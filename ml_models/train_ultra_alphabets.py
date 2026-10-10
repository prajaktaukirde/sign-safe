import os
import cv2
import json
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

DATASET_DIR = r"C:\Users\praja\Downloads\archive\dataset - Gesture Speech"
HAND_MODEL = r"c:\Users\praja\prajakta\hand_landmarker.task"
OUTPUT_TS = r"C:\Users\praja\Downloads\sign-safe-main\sign-safe-main\src\lib\isl-alphabet-model-data.ts"
OUTPUT_JSON = r"c:\Users\praja\prajakta\isl_alphabets_model.json"

ALPHABETS = [chr(c) for c in range(ord('a'), ord('z') + 1)] # a to z (26 classes)

print("Initializing MediaPipe Hand Landmarker...")
hand_options = vision.HandLandmarkerOptions(
    base_options=python.BaseOptions(model_asset_path=HAND_MODEL),
    running_mode=vision.RunningMode.IMAGE,
    num_hands=1,
    min_hand_detection_confidence=0.10
)
detector = vision.HandLandmarker.create_from_options(hand_options)

def extract_hand_features(landmarks):
    wrist = landmarks[0]
    coords = []
    for lm in landmarks:
        coords.extend([lm.x - wrist.x, lm.y - wrist.y, lm.z - wrist.z])
    
    max_d = max(np.max(np.abs(coords)), 1e-5)
    norm_coords = [c / max_d for c in coords]
    
    # Biometric ratios & states
    def d(p1, p2):
        return np.hypot(p1.x - p2.x, p1.y - p2.y)
    
    tip4, ip3, mcp2, cmc1 = landmarks[4], landmarks[3], landmarks[2], landmarks[1]
    tip8, pip6 = landmarks[8], landmarks[6]
    tip12, pip10 = landmarks[12], landmarks[10]
    tip16, pip14 = landmarks[16], landmarks[14]
    tip20, pip18 = landmarks[20], landmarks[18]
    
    idx_ext = 1.0 if d(tip8, wrist) > d(pip6, wrist) * 1.05 or tip8.y < pip6.y else 0.0
    mid_ext = 1.0 if d(tip12, wrist) > d(pip10, wrist) * 1.05 or tip12.y < pip10.y else 0.0
    rng_ext = 1.0 if d(tip16, wrist) > d(pip14, wrist) * 1.05 or tip16.y < pip14.y else 0.0
    pnk_ext = 1.0 if d(tip20, wrist) > d(pip18, wrist) * 1.05 or tip20.y < pip18.y else 0.0
    thumb_ext = 1.0 if abs(tip4.x - cmc1.x) > 0.04 or d(tip4, mcp2) > d(ip3, mcp2) * 1.1 else 0.0
    thumb_up = 1.0 if tip4.y < mcp2.y or tip4.y < ip3.y else 0.0
    
    # Pairwise fingertip distances relative to wrist size
    palm_size = max(d(landmarks[9], wrist), 1e-4)
    d4_8 = d(tip4, tip8) / palm_size
    d4_12 = d(tip4, tip12) / palm_size
    d4_16 = d(tip4, tip16) / palm_size
    d4_20 = d(tip4, tip20) / palm_size
    d8_12 = d(tip8, tip12) / palm_size
    d12_16 = d(tip12, tip16) / palm_size
    d16_20 = d(tip16, tip20) / palm_size
    
    # Extended feature vector (63 coords + 6 extension booleans + 7 pairwise distance ratios = 76 dims)
    extra_features = [
        idx_ext, mid_ext, rng_ext, pnk_ext, thumb_ext, thumb_up,
        d4_8, d4_12, d4_16, d4_20, d8_12, d12_16, d16_20
    ]
    
    return norm_coords + extra_features

X, y_labels = [], []
SAMPLES_PER_LETTER = 150 # 150 * 26 = 3,900 base samples + augmentations

for letter in ALPHABETS:
    folder = os.path.join(DATASET_DIR, letter)
    if not os.path.exists(folder):
        print(f"Directory missing: {folder}")
        continue
    files = sorted([f for f in os.listdir(folder) if f.lower().endswith(('.png', '.jpg', '.jpeg'))])
    
    extracted = 0
    for f in files:
        if extracted >= SAMPLES_PER_LETTER:
            break
        img_path = os.path.join(folder, f)
        img = cv2.imread(img_path)
        if img is None:
            continue
        
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        res = detector.detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb))
        if res.hand_landmarks and len(res.hand_landmarks) > 0:
            lms = res.hand_landmarks[0]
            feat = extract_hand_features(lms)
            X.append(feat)
            y_labels.append(letter.upper())
            extracted += 1
            
            # Data Augmentation: slight noise / jitter to generalize across different webcams
            jittered_feat = [v + np.random.normal(0, 0.015) if idx < 63 else v for idx, v in enumerate(feat)]
            X.append(jittered_feat)
            y_labels.append(letter.upper())
            
    print(f"[{letter.upper()}] Extracted {extracted} base samples (Total with aug: {extracted * 2})")

classes = sorted(list(set(y_labels)))
print(f"\nTotal Dataset: {len(X)} samples across {len(classes)} classes: {classes}")

c2i = {c: i for i, c in enumerate(classes)}
y = np.array([c2i[l] for l in y_labels], dtype=np.int64)
X = np.array(X, dtype=np.float32)

feature_dim = X.shape[1]
print(f"Feature Dimension: {feature_dim}")

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42, stratify=y)

print(f"Training High-Accuracy MLP Classifier ({feature_dim} -> 128 -> 64 -> {len(classes)})...")
mlp = MLPClassifier(hidden_layer_sizes=(128, 64), max_iter=500, random_state=42, alpha=0.0001, early_stopping=True)
mlp.fit(X_train, y_train)

y_pred = mlp.predict(X_test)
test_acc = accuracy_score(y_test, y_pred)
print(f"\n[ACCURACY RESULT] Final Test Accuracy: {test_acc * 100:.2f}%")

weights = {
    'classes': classes,
    'input_dim': feature_dim,
    'test_accuracy': float(test_acc),
    'coefs': [c.tolist() for c in mlp.coefs_],
    'intercepts': [i.tolist() for i in mlp.intercepts_]
}

with open(OUTPUT_JSON, 'w', encoding='utf-8') as jf:
    json.dump(weights, jf, indent=2)

ts_content = f"""// Auto-generated Level 3 ISL Alphabet Neural Network Model Data
// Trained on {len(classes)} ISL Alphabet Classes (A to Z) with MediaPipe Hand Landmarks + Biometric Features
// Test Accuracy: {test_acc * 100:.2f}%

export const ALPHABET_CLASSES: string[] = {json.dumps(classes)};
export const ALPHABET_TEST_ACCURACY: number = {test_acc * 100:.2f};

export const ALPHABET_W0: number[][] = {json.dumps(weights['coefs'][0])};
export const ALPHABET_b0: number[] = {json.dumps(weights['intercepts'][0])};

export const ALPHABET_W1: number[][] = {json.dumps(weights['coefs'][1])};
export const ALPHABET_b1: number[] = {json.dumps(weights['intercepts'][1])};

export const ALPHABET_W2: number[][] = {json.dumps(weights['coefs'][2])};
export const ALPHABET_b2: number[] = {json.dumps(weights['intercepts'][2])};

/**
 * Predict Alphabet from MediaPipe Hand Landmarks
 * Input: 21 3D landmarks
 * Returns: {{ letter: string, confidence: number, probabilities: Record<string, number> }}
 */
export function predictAlphabet(landmarks: Array<{{x: number, y: number, z?: number}}>): {{ letter: string; confidence: number; probabilities?: Record<string, number> }} | null {{
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
  const normCoords = coords.map(c => c / maxAbs);
  
  const d = (p1: any, p2: any) => Math.hypot((p1.x || 0) - (p2.x || 0), (p1.y || 0) - (p2.y || 0));
  
  const tip4 = landmarks[4], ip3 = landmarks[3], mcp2 = landmarks[2], cmc1 = landmarks[1];
  const tip8 = landmarks[8], pip6 = landmarks[6];
  const tip12 = landmarks[12], pip10 = landmarks[10];
  const tip16 = landmarks[16], pip14 = landmarks[14];
  const tip20 = landmarks[20], pip18 = landmarks[18];
  
  const idxExt = d(tip8, wrist) > d(pip6, wrist) * 1.05 || tip8.y < pip6.y ? 1.0 : 0.0;
  const midExt = d(tip12, wrist) > d(pip10, wrist) * 1.05 || tip12.y < pip10.y ? 1.0 : 0.0;
  const rngExt = d(tip16, wrist) > d(pip14, wrist) * 1.05 || tip16.y < pip14.y ? 1.0 : 0.0;
  const pnkExt = d(tip20, wrist) > d(pip18, wrist) * 1.05 || tip20.y < pip18.y ? 1.0 : 0.0;
  const thumbExt = Math.abs(tip4.x - cmc1.x) > 0.04 || d(tip4, mcp2) > d(ip3, mcp2) * 1.1 ? 1.0 : 0.0;
  const thumbUp = tip4.y < mcp2.y || tip4.y < ip3.y ? 1.0 : 0.0;
  
  const palmSize = Math.max(d(landmarks[9], wrist), 1e-4);
  const d4_8 = d(tip4, tip8) / palmSize;
  const d4_12 = d(tip4, tip12) / palmSize;
  const d4_16 = d(tip4, tip16) / palmSize;
  const d4_20 = d(tip4, tip20) / palmSize;
  const d8_12 = d(tip8, tip12) / palmSize;
  const d12_16 = d(tip12, tip16) / palmSize;
  const d16_20 = d(tip16, tip20) / palmSize;
  
  const extraFeatures = [
    idxExt, midExt, rngExt, pnkExt, thumbExt, thumbUp,
    d4_8, d4_12, d4_16, d4_20, d8_12, d12_16, d16_20
  ];
  
  const x = [...normCoords, ...extraFeatures];
  
  // Layer 0: 76 -> 128
  const h0 = new Array(128).fill(0);
  for (let j = 0; j < 128; j++) {{
    let sum = ALPHABET_b0[j];
    for (let i = 0; i < x.length; i++) {{
      sum += x[i] * ALPHABET_W0[i][j];
    }}
    h0[j] = Math.max(0, sum);
  }}
  
  // Layer 1: 128 -> 64
  const h1 = new Array(64).fill(0);
  for (let j = 0; j < 64; j++) {{
    let sum = ALPHABET_b1[j];
    for (let i = 0; i < 128; i++) {{
      sum += h0[i] * ALPHABET_W1[i][j];
    }}
    h1[j] = Math.max(0, sum);
  }}
  
  // Layer 2: 64 -> 26
  const logits = new Array(ALPHABET_CLASSES.length).fill(0);
  for (let j = 0; j < ALPHABET_CLASSES.length; j++) {{
    let sum = ALPHABET_b2[j];
    for (let i = 0; i < 64; i++) {{
      sum += h1[i] * ALPHABET_W2[i][j];
    }}
    logits[j] = sum;
  }}
  
  // Softmax
  const maxLogit = Math.max(...logits);
  const expLogits = logits.map(l => Math.exp(l - maxLogit));
  const sumExp = expLogits.reduce((a, b) => a + b, 0);
  const probs = expLogits.map(e => e / sumExp);
  
  let bestIdx = 0;
  let bestProb = probs[0];
  const probMap: Record<string, number> = {{}};
  for (let i = 0; i < probs.length; i++) {{
    probMap[ALPHABET_CLASSES[i]] = probs[i];
    if (probs[i] > bestProb) {{
      bestProb = probs[i];
      bestIdx = i;
    }}
  }}
  
  return {{
    letter: ALPHABET_CLASSES[bestIdx],
    confidence: bestProb,
    probabilities: probMap
  }};
}}
"""

with open(OUTPUT_TS, 'w', encoding='utf-8') as tsf:
    tsf.write(ts_content)

print(f"\n[EXPORT COMPLETE] Generated {OUTPUT_TS}")
