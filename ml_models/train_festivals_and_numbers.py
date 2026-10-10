import os
import json
import numpy as np
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# All 12 Festival signs, 23 Numbers, and 3 Emergency signs
FESTIVAL_CLASSES = [
    "Diwali", "Holi", "Christmas", "Eid", "Ganesh Chaturthi",
    "Navratri", "Durga Puja", "Dussehra", "Raksha Bandhan",
    "Janmashtami", "Independence Day", "Republic Day"
]

NUMBER_CLASSES = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
    "11", "12", "13", "14", "15", "25", "50", "100",
    "1000", "10000", "100000", "1000000", "10cr"
]

EMERGENCY_CLASSES = ["Safe", "Help", "Emergency"]

ALL_NEW_CLASSES = FESTIVAL_CLASSES + NUMBER_CLASSES + EMERGENCY_CLASSES
print(f"Total New Classes: {len(ALL_NEW_CLASSES)}")
print(ALL_NEW_CLASSES)

# Feature dimension:
# 63 (primary hand landmarks normalized to wrist) +
# 8 (finger state booleans: idx_ext, mid_ext, rng_ext, pnk_ext, isOpen, isFist, isPointing, isThumbsUp) +
# 4 (wrist spatial position relative to nose: dx, dy, dz, tip8_dy) +
# 4 (body/two-hand metadata: numHands, areWristsClose, isCrossedWrists, isBesideHead) = 79 features

def generate_synthetic_samples_for_class(cls_name, num_samples=120):
    samples = []
    
    for _ in range(num_samples):
        # 21 3D points initialized around default open/rest hand
        hand_pts = np.zeros((21, 3))
        # noise factor
        noise = np.random.normal(0, 0.02, (21, 3))
        
        idx_ext = 0.0
        mid_ext = 0.0
        rng_ext = 0.0
        pnk_ext = 0.0
        is_open = 0.0
        is_fist = 0.0
        is_pointing = 0.0
        is_thumbs_up = 0.0
        
        wrist_dx = np.random.uniform(-0.15, 0.15)
        wrist_dy = np.random.uniform(0.15, 0.35) # over chest
        wrist_dz = 0.0
        tip8_dy = -0.15
        
        num_hands = 1.0
        are_wrists_close = 0.0
        is_crossed_wrists = 0.0
        is_beside_head = 0.0
        
        # Configure archetype features based on class
        if cls_name == "1":
            idx_ext = 1.0
            is_pointing = 1.0
        elif cls_name == "2":
            idx_ext = 1.0
            mid_ext = 1.0
        elif cls_name == "3":
            idx_ext = 1.0
            mid_ext = 1.0
            is_thumbs_up = 0.5
        elif cls_name == "4":
            idx_ext = 1.0
            mid_ext = 1.0
            rng_ext = 1.0
            pnk_ext = 1.0
        elif cls_name == "5":
            idx_ext = 1.0
            mid_ext = 1.0
            rng_ext = 1.0
            pnk_ext = 1.0
            is_open = 1.0
        elif cls_name == "6":
            idx_ext = 1.0
            mid_ext = 1.0
            rng_ext = 1.0
        elif cls_name == "7":
            idx_ext = 1.0
            mid_ext = 1.0
            pnk_ext = 1.0
        elif cls_name == "8":
            idx_ext = 1.0
            rng_ext = 1.0
            pnk_ext = 1.0
        elif cls_name == "9":
            mid_ext = 1.0
            rng_ext = 1.0
            pnk_ext = 1.0
        elif cls_name == "10":
            is_thumbs_up = 1.0
        elif cls_name in ["11", "12", "13", "14", "15"]:
            idx_ext = 1.0
            if cls_name in ["12", "13", "14", "15"]: mid_ext = 1.0
            if cls_name in ["14", "15"]: rng_ext = 1.0; pnk_ext = 1.0
            if cls_name == "15": is_open = 1.0
        elif cls_name in ["25", "50", "100", "1000", "10000", "100000", "1000000", "10cr"]:
            is_open = 0.8
            idx_ext = 1.0
            if "0" in cls_name: is_thumbs_up = 0.6
        elif cls_name == "Diwali":
            num_hands = 2.0
            is_open = 1.0
            idx_ext = 1.0; mid_ext = 1.0; rng_ext = 1.0; pnk_ext = 1.0
        elif cls_name == "Holi":
            num_hands = 2.0
            is_open = 1.0
            wrist_dy = 0.05 # above chest
        elif cls_name == "Christmas":
            num_hands = 2.0
            are_wrists_close = 1.0
        elif cls_name == "Eid":
            num_hands = 2.0
            is_crossed_wrists = 1.0
        elif cls_name == "Ganesh Chaturthi":
            wrist_dy = -0.05 # in front of face
            is_fist = 0.8
        elif cls_name == "Navratri":
            num_hands = 2.0
            is_pointing = 0.8
        elif cls_name == "Durga Puja":
            is_beside_head = 1.0
            is_open = 1.0
        elif cls_name == "Dussehra":
            num_hands = 2.0
            is_pointing = 1.0
        elif cls_name == "Raksha Bandhan":
            num_hands = 2.0
            are_wrists_close = 1.0
        elif cls_name == "Janmashtami":
            num_hands = 2.0
            wrist_dy = -0.08 # at lips
        elif cls_name in ["Independence Day", "Republic Day"]:
            is_beside_head = 1.0
            is_open = 0.9
            wrist_dy = -0.15 # forehead salute
        elif cls_name == "Safe":
            num_hands = 2.0
            is_crossed_wrists = 0.9
            is_open = 1.0
        elif cls_name == "Help":
            num_hands = 2.0
            are_wrists_close = 1.0
            is_fist = 0.7
        elif cls_name == "Emergency":
            wrist_dy = -0.30 # high above head
            is_open = 1.0
            idx_ext = 1.0; mid_ext = 1.0; rng_ext = 1.0; pnk_ext = 1.0
        
        # Synthesize normalized hand points relative to wrist (P0)
        hand_pts[0] = [0, 0, 0]
        for p in range(1, 21):
            base_y = -0.1 * (p % 4 + 1) if (idx_ext or is_open) else -0.04
            hand_pts[p] = [np.random.uniform(-0.05, 0.05), base_y, np.random.uniform(-0.02, 0.02)]
            
        hand_pts_flat = (hand_pts + noise).flatten()
        
        meta = [
            idx_ext, mid_ext, rng_ext, pnk_ext, is_open, is_fist, is_pointing, is_thumbs_up,
            wrist_dx, wrist_dy, wrist_dz, tip8_dy,
            num_hands, are_wrists_close, is_crossed_wrists, is_beside_head
        ]
        
        feature_vector = np.concatenate([hand_pts_flat, meta])
        samples.append(feature_vector)
        
    return samples

# Generate dataset
X_all = []
y_all = []

for idx, cls in enumerate(ALL_NEW_CLASSES):
    samples = generate_synthetic_samples_for_class(cls, num_samples=150)
    for s in samples:
        X_all.append(s)
        y_all.append(idx)

X = np.array(X_all)
y = np.array(y_all)

print(f"Dataset generated: X={X.shape}, y={y.shape}")

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

print("Training MLP Neural Network for Festivals, Numbers, and Emergency...")
clf = MLPClassifier(
    hidden_layer_sizes=(64, 32),
    activation="relu",
    solver="adam",
    batch_size=64,
    max_iter=80,
    early_stopping=True,
    n_iter_no_change=5,
    random_state=42
)
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"\n==========================================")
print(f"Festivals & Numbers Model Accuracy: {acc * 100:.2f}%")
print(f"==========================================\n")

# Export to TypeScript file
ts_content = f"""// Auto-generated Level 4 Festivals & Level 5 Numbers ISL Neural Model Data
// Accuracy: {acc * 100:.2f}%

export const FESTIVAL_AND_NUMBER_CLASSES: string[] = {json.dumps(ALL_NEW_CLASSES)};
export const MODEL_ACCURACY: number = {acc * 100:.2f};

export const MODEL_W0: number[][] = {json.dumps(clf.coefs_[0].tolist())};
export const MODEL_B0: number[] = {json.dumps(clf.intercepts_[0].tolist())};
export const MODEL_W1: number[][] = {json.dumps(clf.coefs_[1].tolist())};
export const MODEL_B1: number[] = {json.dumps(clf.intercepts_[1].tolist())};
export const MODEL_W2: number[][] = {json.dumps(clf.coefs_[2].tolist())};
export const MODEL_B2: number[] = {json.dumps(clf.intercepts_[2].tolist())};

export function predictFestivalOrNumber(features: number[]): {{ predictedClass: string; confidence: number }} | null {{
  if (!features || features.length !== {int(X.shape[1])}) return null;
  
  // Layer 1
  const h1 = new Array(MODEL_B0.length);
  for (let j = 0; j < MODEL_B0.length; j++) {{
    let sum = MODEL_B0[j] || 0;
    for (let i = 0; i < features.length; i++) {{
      sum += (features[i] || 0) * (MODEL_W0[i]?.[j] || 0);
    }}
    h1[j] = Math.max(0, sum);
  }}

  // Layer 2
  const h2 = new Array(MODEL_B1.length);
  for (let j = 0; j < MODEL_B1.length; j++) {{
    let sum = MODEL_B1[j] || 0;
    for (let i = 0; i < h1.length; i++) {{
      sum += (h1[i] || 0) * (MODEL_W1[i]?.[j] || 0);
    }}
    h2[j] = Math.max(0, sum);
  }}

  // Output Layer
  const logits = new Array(MODEL_B2.length);
  let maxLogit = -Infinity;
  for (let j = 0; j < MODEL_B2.length; j++) {{
    let sum = MODEL_B2[j] || 0;
    for (let i = 0; i < h2.length; i++) {{
      sum += (h2[i] || 0) * (MODEL_W2[i]?.[j] || 0);
    }}
    logits[j] = sum;
    if (sum > maxLogit) maxLogit = sum;
  }}

  let expSum = 0;
  const probs = new Array(logits.length);
  for (let j = 0; j < logits.length; j++) {{
    probs[j] = Math.exp(logits[j] - maxLogit);
    expSum += probs[j];
  }}

  let bestIdx = 0;
  let bestProb = 0;
  for (let j = 0; j < probs.length; j++) {{
    const prob = expSum > 0 ? probs[j] / expSum : 0;
    if (prob > bestProb) {{
      bestProb = prob;
      bestIdx = j;
    }}
  }}

  return {{
    predictedClass: FESTIVAL_AND_NUMBER_CLASSES[bestIdx] || "Unknown",
    confidence: bestProb
  }};
}}
"""

ts_export_path = r"C:\Users\praja\Downloads\sign-safe-main\sign-safe-main\src\lib\isl-festivals-numbers-model.ts"
with open(ts_export_path, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Exported TypeScript model to: {ts_export_path}")
