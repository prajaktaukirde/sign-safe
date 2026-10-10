import os, cv2, json, numpy as np, mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

DATASET_DIR = r'C:\Users\praja\Downloads\archive\dataset - Gesture Speech'
HAND_MODEL = r'c:\Users\praja\prajakta\hand_landmarker.task'
OUTPUT_TS = r'C:\Users\praja\Downloads\sign-safe-main\sign-safe-main\src\lib\isl-alphabet-model-data.ts'
OUTPUT_JSON = r'c:\Users\praja\prajakta\isl_alphabets_model.json'

ALPHABETS = [chr(c) for c in range(ord('a'), ord('z') + 1)] # a to z (26)

print('Initializing MediaPipe Hand Landmarker...')
hand_options = vision.HandLandmarkerOptions(
    base_options=python.BaseOptions(model_asset_path=HAND_MODEL),
    running_mode=vision.RunningMode.IMAGE,
    num_hands=1,
    min_hand_detection_confidence=0.10
)
detector = vision.HandLandmarker.create_from_options(hand_options)

X, y_labels = [], []
for letter in ALPHABETS:
    p = os.path.join(DATASET_DIR, letter)
    if not os.path.exists(p):
        print(f'Folder missing: {p}')
        continue
    files = sorted([f for f in os.listdir(p) if f.lower().endswith(('.png', '.jpg', '.jpeg'))])
    
    extracted = 0
    for f in files:
        if extracted >= 50: break
        img = cv2.imread(os.path.join(p, f))
        if img is None: continue
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        res = detector.detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb))
        if res.hand_landmarks and len(res.hand_landmarks) > 0:
            lms = res.hand_landmarks[0]
            wrist = lms[0]
            coords = []
            for lm in lms:
                coords.extend([lm.x - wrist.x, lm.y - wrist.y, lm.z - wrist.z])
            max_d = max(np.max(np.abs(coords)), 1e-5)
            norm_coords = [c / max_d for c in coords]
            X.append(norm_coords)
            y_labels.append(letter.upper())
            extracted += 1
    print(f'[{letter.upper()}] Extracted {extracted} samples')

classes = sorted(list(set(y_labels)))
print(f'Total {len(X)} samples across all {len(classes)} classes: {classes}')

c2i = {c: i for i, c in enumerate(classes)}
y = np.array([c2i[l] for l in y_labels], dtype=np.int64)
X = np.array(X, dtype=np.float32)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42, stratify=y)

print(f'Training Deep MLP Neural Network (63 -> 256 -> 128 -> {len(classes)})...')
mlp = MLPClassifier(hidden_layer_sizes=(256, 128), max_iter=600, random_state=42, alpha=0.0001)
mlp.fit(X_train, y_train)

y_pred = mlp.predict(X_test)
test_acc = accuracy_score(y_test, y_pred)
print(f'[SUCCESS] Final Test Accuracy on all {len(classes)} classes: {test_acc * 100:.2f}%')

num_classes = len(classes)
weights = {
    'classes': classes,
    'input_dim': 63,
    'test_accuracy': float(test_acc),
    'coefs': [c.tolist() for c in mlp.coefs_],
    'intercepts': [i.tolist() for i in mlp.intercepts_]
}
with open(OUTPUT_JSON, 'w', encoding='utf-8') as jf:
    json.dump(weights, jf, indent=2)

ts_content = f"""// Auto-generated Level 3 ISL Alphabet Neural Network Model Data
// Trained on {num_classes} ISL/ASL Alphabet Classes (A to Z) with MediaPipe Hand Landmarks
// Test Accuracy: {test_acc * 100:.2f}%

export const ALPHABET_CLASSES: string[] = {json.dumps(classes)};
export const ALPHABET_TEST_ACCURACY: number = {test_acc * 100:.2f};

export const ALPHABET_W0: number[][] = {json.dumps(weights['coefs'][0])};
export const ALPHABET_b0: number[] = {json.dumps(weights['intercepts'][0])};

export const ALPHABET_W1: number[][] = {json.dumps(weights['coefs'][1])};
export const ALPHABET_b1: number[] = {json.dumps(weights['intercepts'][1])};

export const ALPHABET_W2: number[][] = {json.dumps(weights['coefs'][2])};
export const ALPHABET_b2: number[] = {json.dumps(weights['intercepts'][2])};

export function predictAlphabet(landmarks: Array<{{x: number, y: number, z: number}}>): {{ letter: string; confidence: number }} | null {{
  if (!landmarks || landmarks.length < 21) return null;
  
  const wrist = landmarks[0];
  const coords: number[] = [];
  for (let i = 0; i < 21; i++) {{
    coords.push((landmarks[i].x || 0) - (wrist.x || 0));
    coords.push((landmarks[i].y || 0) - (wrist.y || 0));
    coords.push((landmarks[i].z || 0) - (wrist.z || 0));
  }}
  
  let maxAbs = 1e-5;
  for (let i = 0; i < coords.length; i++) {{
    const abs = Math.abs(coords[i]);
    if (abs > maxAbs) maxAbs = abs;
  }}
  
  const x = coords.map(c => c / maxAbs);
  
  // Layer 0: 63 -> 256
  const h0 = new Array(256).fill(0);
  for (let j = 0; j < 256; j++) {{
    let sum = ALPHABET_b0[j];
    for (let i = 0; i < 63; i++) {{
      sum += x[i] * ALPHABET_W0[i][j];
    }}
    h0[j] = Math.max(0, sum);
  }}
  
  // Layer 1: 256 -> 128
  const h1 = new Array(128).fill(0);
  for (let j = 0; j < 128; j++) {{
    let sum = ALPHABET_b1[j];
    for (let i = 0; i < 256; i++) {{
      sum += h0[i] * ALPHABET_W1[i][j];
    }}
    h1[j] = Math.max(0, sum);
  }}
  
  // Layer 2: 128 -> {num_classes}
  const numClasses = ALPHABET_CLASSES.length;
  const logits = new Array(numClasses).fill(0);
  for (let j = 0; j < numClasses; j++) {{
    let sum = ALPHABET_b2[j];
    for (let i = 0; i < 128; i++) {{
      sum += h1[i] * ALPHABET_W2[i][j];
    }}
    logits[j] = sum;
  }}
  
  // Softmax
  let maxLogit = -Infinity;
  for (let j = 0; j < numClasses; j++) {{
    if (logits[j] > maxLogit) maxLogit = logits[j];
  }}
  
  let expSum = 0;
  const exps = new Array(numClasses).fill(0);
  for (let j = 0; j < numClasses; j++) {{
    exps[j] = Math.exp(logits[j] - maxLogit);
    expSum += exps[j];
  }}
  
  let bestIdx = 0;
  let bestProb = 0;
  for (let j = 0; j < numClasses; j++) {{
    const prob = exps[j] / (expSum || 1);
    if (prob > bestProb) {{
      bestProb = prob;
      bestIdx = j;
    }}
  }}
  
  return {{
    letter: ALPHABET_CLASSES[bestIdx],
    confidence: bestProb
  }};
}}
"""

with open(OUTPUT_TS, 'w', encoding='utf-8') as tsf:
    tsf.write(ts_content)
print(f'[SUCCESS] Wrote complete in-browser model to: {OUTPUT_TS}')
