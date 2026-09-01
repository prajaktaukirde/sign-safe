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

function computeHandFingerStates(landmarks: any[]): number[] {
  const isExt = (tip: number, base: number) => (landmarks[tip].y < landmarks[base].y ? 1.0 : 0.0);
  const thumbUp = landmarks[4].y < landmarks[5].y ? 1.0 : 0.0;
  const idxExt = isExt(8, 6);
  const midExt = isExt(12, 10);
  const rngExt = isExt(16, 14);
  const pnkExt = isExt(20, 18);

  const isOpen = idxExt + midExt + rngExt + pnkExt >= 3.0 ? 1.0 : 0.0;
  const isFist = idxExt + midExt + rngExt + pnkExt === 0.0 ? 1.0 : 0.0;
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

  const hands: any[] = [];
  if (leftHand && leftHand.length === 21) hands.push(leftHand);
  if (rightHand && rightHand.length === 21) hands.push(rightHand);

  for (const landmarks of hands) {
    const wrist = landmarks[0];
    const tip8 = landmarks[8];

    const shape_vec: number[] = [];
    for (const lm of landmarks) {
      shape_vec.push(lm.x - wrist.x, lm.y - wrist.y, (lm.z || 0.0) - (wrist.z || 0.0));
    }

    const fingerStates = computeHandFingerStates(landmarks);
    const spatial = [wrist.x - nose_x, wrist.y - nose_y, (wrist.z || 0.0) - nose_z, tip8.y - nose_y];
    const meta = [...fingerStates, ...spatial];

    if (wrist.x < nose_x) {
      left_hand_shape = shape_vec;
      left_hand_meta = meta;
    } else {
      right_hand_shape = shape_vec;
      right_hand_meta = meta;
    }
  }

  const global_meta = [hands.length];

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
  // Layer 1: ReLU(X * W0 + b0)
  const h1 = new Array(model.b0.length);
  for (let j = 0; j < model.b0.length; j++) {
    let sum = model.b0[j];
    for (let i = 0; i < features.length; i++) {
      sum += features[i] * model.W0[i][j];
    }
    h1[j] = Math.max(0, sum);
  }

  // Layer 2: ReLU(h1 * W1 + b1)
  const h2 = new Array(model.b1.length);
  for (let j = 0; j < model.b1.length; j++) {
    let sum = model.b1[j];
    for (let i = 0; i < h1.length; i++) {
      sum += h1[i] * model.W1[i][j];
    }
    h2[j] = Math.max(0, sum);
  }

  // Output Layer: logits = h2 * W2 + b2
  const logits = new Array(model.b2.length);
  let maxLogit = -Infinity;
  for (let j = 0; j < model.b2.length; j++) {
    let sum = model.b2[j];
    for (let i = 0; i < h2.length; i++) {
      sum += h2[i] * model.W2[i][j];
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
    probs[j] /= expSum;
  }

  let bestIdx = 0;
  let bestProb = probs[0];
  const probMap: Record<string, number> = {};
  for (let j = 0; j < model.classes.length; j++) {
    probMap[model.classes[j]] = Math.round(probs[j] * 100);
    if (probs[j] > bestProb) {
      bestProb = probs[j];
      bestIdx = j;
    }
  }

  return {
    predictedClass: model.classes[bestIdx],
    confidence: bestProb,
    probabilities: probMap
  };
}
