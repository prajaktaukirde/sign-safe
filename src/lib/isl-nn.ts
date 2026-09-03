export interface NeuralModel {
  W0: number[][];
  b0: number[];
  W1: number[][];
  b1: number[];
  W2: number[][];
  b2: number[];
  classes: string[];
  input_dim: number;
  output_dim: number;
  accuracy: number;
}

function dist3D(p1: any, p2: any): number {
  const dx = (p1.x || 0) - (p2.x || 0);
  const dy = (p1.y || 0) - (p2.y || 0);
  const dz = (p1.z || 0) - (p2.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function computeHandFingerStates(landmarks: any[]): number[] {
  if (!landmarks || landmarks.length < 21) {
    return [0, 0, 0, 0, 0, 0, 0, 0];
  }

  const wrist = landmarks[0];

  // Radial + vertical extension check
  const isExt = (tip: number, base: number) => {
    const pTip = landmarks[tip];
    const pBase = landmarks[base];
    const dTip = dist3D(pTip, wrist);
    const dBase = dist3D(pBase, wrist);
    return (dTip > dBase * 1.05 || pTip.y < pBase.y) ? 1.0 : 0.0;
  };

  const thumbUp = (landmarks[4].y < landmarks[5].y || landmarks[4].y < landmarks[3].y || dist3D(landmarks[4], landmarks[2]) > dist3D(landmarks[3], landmarks[2]) * 1.1) ? 1.0 : 0.0;
  const idxExt = isExt(8, 6);
  const midExt = isExt(12, 10);
  const rngExt = isExt(16, 14);
  const pnkExt = isExt(20, 18);

  const openCount = idxExt + midExt + rngExt + pnkExt;
  const isOpen = openCount >= 3.0 ? 1.0 : 0.0;
  const isFist = openCount === 0.0 ? 1.0 : 0.0;
  const isPointing = idxExt === 1.0 && midExt === 0.0 && rngExt === 0.0 && pnkExt === 0.0 ? 1.0 : 0.0;
  const isThumbsUp = thumbUp === 1.0 && isFist === 1.0 ? 1.0 : 0.0;

  return [idxExt, midExt, rngExt, pnkExt, isOpen, isFist, isPointing, isThumbsUp];
}

export function extractLandmarkFeatures(leftHand: any, rightHand: any, pose: any): number[] {
  let left_hand_shape = new Array(63).fill(0.0);
  let right_hand_shape = new Array(63).fill(0.0);
  let left_hand_meta = new Array(12).fill(0.0);
  let right_hand_meta = new Array(12).fill(0.0);
  let pose_vec = new Array(21).fill(0.0);

  let nose_x = 0.5;
  let nose_y = 0.3;
  let nose_z = 0.0;

  if (pose && pose.length > 0) {
    const nose = pose[0];
    nose_x = nose.x;
    nose_y = nose.y;
    nose_z = nose.z || 0.0;

    const poseIndices = [0, 11, 12, 13, 14, 15, 16];
    const vec: number[] = [];
    for (const idx of poseIndices) {
      const lm = pose[idx] || nose;
      vec.push(lm.x - nose_x, lm.y - nose_y, (lm.z || 0.0) - nose_z);
    }
    pose_vec = vec;
  }

  let handCount = 0;

  // Process Left Hand
  if (leftHand && leftHand.length === 21) {
    handCount++;
    const wrist = leftHand[0];
    const tip8 = leftHand[8];

    const shape_vec: number[] = [];
    for (const lm of leftHand) {
      shape_vec.push(lm.x - wrist.x, lm.y - wrist.y, (lm.z || 0.0) - (wrist.z || 0.0));
    }
    const fingerStates = computeHandFingerStates(leftHand);
    const spatial = [wrist.x - nose_x, wrist.y - nose_y, (wrist.z || 0.0) - nose_z, tip8.y - nose_y];
    left_hand_shape = shape_vec;
    left_hand_meta = [...fingerStates, ...spatial];
  }

  // Process Right Hand
  if (rightHand && rightHand.length === 21) {
    handCount++;
    const wrist = rightHand[0];
    const tip8 = rightHand[8];

    const shape_vec: number[] = [];
    for (const lm of rightHand) {
      shape_vec.push(lm.x - wrist.x, lm.y - wrist.y, (lm.z || 0.0) - (wrist.z || 0.0));
    }
    const fingerStates = computeHandFingerStates(rightHand);
    const spatial = [wrist.x - nose_x, wrist.y - nose_y, (wrist.z || 0.0) - nose_z, tip8.y - nose_y];
    right_hand_shape = shape_vec;
    right_hand_meta = [...fingerStates, ...spatial];
  }

  const global_meta = [handCount];

  // 172 dimensions total
  return [
    ...left_hand_shape,
    ...right_hand_shape,
    ...left_hand_meta,
    ...right_hand_meta,
    ...pose_vec,
    ...global_meta,
  ];
}

export function predictSign(
  features: number[],
  model: NeuralModel
): { predictedClass: string; confidence: number; probabilities: Record<string, number> } {
  if (!model || !model.W0 || !features || features.length !== model.input_dim) {
    return { predictedClass: "—", confidence: 0, probabilities: {} };
  }

  // Layer 1: ReLU(X * W0 + b0)
  const h1 = new Array(model.b0.length);
  for (let j = 0; j < model.b0.length; j++) {
    let sum = model.b0[j] || 0;
    for (let i = 0; i < features.length; i++) {
      sum += (features[i] || 0) * (model.W0[i]?.[j] || 0);
    }
    h1[j] = Math.max(0, sum);
  }

  // Layer 2: ReLU(h1 * W1 + b1)
  const h2 = new Array(model.b1.length);
  for (let j = 0; j < model.b1.length; j++) {
    let sum = model.b1[j] || 0;
    for (let i = 0; i < h1.length; i++) {
      sum += (h1[i] || 0) * (model.W1[i]?.[j] || 0);
    }
    h2[j] = Math.max(0, sum);
  }

  // Output Layer: logits = h2 * W2 + b2
  const logits = new Array(model.b2.length);
  let maxLogit = -Infinity;
  for (let j = 0; j < model.b2.length; j++) {
    let sum = model.b2[j] || 0;
    for (let i = 0; i < h2.length; i++) {
      sum += (h2[i] || 0) * (model.W2[i]?.[j] || 0);
    }
    logits[j] = sum;
    if (sum > maxLogit) maxLogit = sum;
  }

  // Softmax
  let expSum = 0;
  const probs = new Array(logits.length);
  for (let j = 0; j < logits.length; j++) {
    probs[j] = Math.exp(logits[j] - maxLogit);
    expSum += probs[j];
  }
  for (let j = 0; j < probs.length; j++) {
    probs[j] = expSum > 0 ? probs[j] / expSum : 0;
  }

  let bestIdx = 0;
  let bestProb = probs[0] || 0;
  const probMap: Record<string, number> = {};
  for (let j = 0; j < model.classes.length; j++) {
    const className = model.classes[j] || `Class_${j}`;
    probMap[className] = Math.round((probs[j] || 0) * 100);
    if ((probs[j] || 0) > bestProb) {
      bestProb = probs[j] || 0;
      bestIdx = j;
    }
  }

  return {
    predictedClass: model.classes[bestIdx] || "Unknown",
    confidence: bestProb,
    probabilities: probMap
  };
}
