import os
import json
import numpy as np
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

OUTPUT_TS = r"C:\Users\praja\Downloads\sign-safe-main\sign-safe-main\src\lib\isl-levels-678-model.ts"
OUTPUT_JSON = r"c:\Users\praja\prajakta\isl_levels_678_model.json"

CLASSES = [
    # Level 6: Jobs & Professions (10)
    "Teacher", "Doctor", "Police", "Engineer", "Nurse", 
    "Farmer", "Driver", "Chef", "Lawyer", "Soldier",
    
    # Level 7: Family & Relations (10)
    "Father", "Mother", "Brother", "Sister", "Grandfather", 
    "Grandmother", "Son", "Daughter", "Friend", "Family",
    
    # Level 8: Question Words (8)
    "What", "Where", "When", "Why", "Who", "How", "Which", "How Many"
]

print(f"Training High-Accuracy Neural Model for {len(CLASSES)} classes in Levels 6, 7, 8...")

np.random.seed(42)
X, y = [], []
SAMPLES_PER_CLASS = 250

PROFILES = {
    # Level 6: Jobs
    "Teacher": {"open": 1.0, "fist": 0.0, "idx": 0.0, "thUp": 0.0, "hands": 1.0, "head": 1.0, "wrists": 0.0, "y_off": -0.15, "ext": [1, 1, 1, 1], "motion": 1.0},
    "Doctor": {"open": 0.0, "fist": 0.0, "idx": 1.0, "thUp": 0.0, "hands": 2.0, "head": 0.0, "wrists": 1.0, "y_off": 0.20, "ext": [1, 1, 0, 0], "motion": 0.0},
    "Police": {"open": 1.0, "fist": 0.0, "idx": 0.0, "thUp": 0.0, "hands": 1.0, "head": 1.0, "wrists": 0.0, "y_off": -0.22, "ext": [1, 1, 1, 1], "motion": 0.0},
    "Engineer": {"open": 0.0, "fist": 0.0, "idx": 1.0, "thUp": 1.0, "hands": 2.0, "head": 0.0, "wrists": 1.0, "y_off": 0.10, "ext": [1, 0, 0, 0], "motion": 1.0},
    "Nurse": {"open": 0.0, "fist": 0.0, "idx": 1.0, "thUp": 0.0, "hands": 1.0, "head": 0.0, "wrists": 0.0, "y_off": 0.15, "ext": [1, 0, 0, 0], "motion": 0.0},
    "Farmer": {"open": 1.0, "fist": 0.0, "idx": 0.0, "thUp": 0.0, "hands": 1.0, "head": 0.0, "wrists": 0.0, "y_off": 0.35, "ext": [1, 1, 1, 1], "motion": 1.0},
    "Driver": {"open": 0.0, "fist": 1.0, "idx": 0.0, "thUp": 1.0, "hands": 2.0, "head": 0.0, "wrists": 0.0, "y_off": 0.20, "ext": [0, 0, 0, 0], "motion": 1.0},
    "Chef": {"open": 0.0, "fist": 1.0, "idx": 0.0, "thUp": 0.0, "hands": 2.0, "head": 0.0, "wrists": 1.0, "y_off": 0.25, "ext": [0, 0, 0, 0], "motion": 1.0},
    "Lawyer": {"open": 1.0, "fist": 0.0, "idx": 0.0, "thUp": 0.0, "hands": 2.0, "head": 0.0, "wrists": 0.0, "y_off": 0.18, "ext": [1, 1, 1, 1], "motion": 1.0},
    "Soldier": {"open": 1.0, "fist": 0.0, "idx": 0.0, "thUp": 0.0, "hands": 2.0, "head": 1.0, "wrists": 0.0, "y_off": -0.25, "ext": [1, 1, 1, 1], "motion": 0.0},

    # Level 7: Relations
    "Father": {"open": 1.0, "fist": 0.0, "idx": 0.0, "thUp": 1.0, "hands": 1.0, "head": 1.0, "wrists": 0.0, "y_off": -0.20, "ext": [1, 1, 1, 1], "motion": 0.0},
    "Mother": {"open": 1.0, "fist": 0.0, "idx": 0.0, "thUp": 1.0, "hands": 1.0, "head": 0.0, "wrists": 0.0, "y_off": -0.05, "ext": [1, 1, 1, 1], "motion": 0.0},
    "Brother": {"open": 0.0, "fist": 0.0, "idx": 1.0, "thUp": 0.0, "hands": 2.0, "head": 1.0, "wrists": 1.0, "y_off": 0.10, "ext": [1, 0, 0, 0], "motion": 1.0},
    "Sister": {"open": 0.0, "fist": 0.0, "idx": 1.0, "thUp": 0.0, "hands": 2.0, "head": 0.0, "wrists": 1.0, "y_off": 0.05, "ext": [1, 0, 0, 0], "motion": 1.0},
    "Grandfather": {"open": 1.0, "fist": 0.0, "idx": 0.0, "thUp": 1.0, "hands": 1.0, "head": 1.0, "wrists": 0.0, "y_off": -0.26, "ext": [1, 1, 1, 1], "motion": 1.0},
    "Grandmother": {"open": 1.0, "fist": 0.0, "idx": 0.0, "thUp": 1.0, "hands": 1.0, "head": 0.0, "wrists": 0.0, "y_off": -0.10, "ext": [1, 1, 1, 1], "motion": 1.0},
    "Son": {"open": 1.0, "fist": 0.0, "idx": 0.0, "thUp": 0.0, "hands": 2.0, "head": 1.0, "wrists": 1.0, "y_off": 0.20, "ext": [1, 1, 1, 1], "motion": 1.0},
    "Daughter": {"open": 1.0, "fist": 0.0, "idx": 0.0, "thUp": 0.0, "hands": 2.0, "head": 0.0, "wrists": 1.0, "y_off": 0.15, "ext": [1, 1, 1, 1], "motion": 1.0},
    "Friend": {"open": 0.0, "fist": 0.0, "idx": 1.0, "thUp": 0.0, "hands": 2.0, "head": 0.0, "wrists": 1.0, "y_off": 0.12, "ext": [1, 0, 0, 0], "motion": 0.0},
    "Family": {"open": 1.0, "fist": 0.0, "idx": 0.0, "thUp": 0.0, "hands": 2.0, "head": 0.0, "wrists": 1.0, "y_off": 0.15, "ext": [1, 1, 1, 1], "motion": 1.0},

    # Level 8: Questions
    "What": {"open": 1.0, "fist": 0.0, "idx": 0.0, "thUp": 0.0, "hands": 2.0, "head": 0.0, "wrists": 0.0, "y_off": 0.22, "ext": [1, 1, 1, 1], "motion": 1.0},
    "Where": {"open": 0.0, "fist": 0.0, "idx": 1.0, "thUp": 0.0, "hands": 1.0, "head": 0.0, "wrists": 0.0, "y_off": 0.05, "ext": [1, 0, 0, 0], "motion": 1.0},
    "When": {"open": 0.0, "fist": 0.0, "idx": 1.0, "thUp": 0.0, "hands": 2.0, "head": 0.0, "wrists": 1.0, "y_off": 0.10, "ext": [1, 0, 0, 0], "motion": 1.0},
    "Why": {"open": 0.0, "fist": 0.0, "idx": 0.0, "thUp": 1.0, "hands": 1.0, "head": 1.0, "wrists": 0.0, "y_off": -0.18, "ext": [0, 0, 0, 1], "motion": 1.0},
    "Who": {"open": 0.0, "fist": 0.0, "idx": 1.0, "thUp": 0.0, "hands": 1.0, "head": 0.0, "wrists": 0.0, "y_off": -0.05, "ext": [1, 0, 0, 0], "motion": 1.0},
    "How": {"open": 1.0, "fist": 0.0, "idx": 0.0, "thUp": 0.0, "hands": 2.0, "head": 0.0, "wrists": 1.0, "y_off": 0.18, "ext": [1, 1, 1, 1], "motion": 1.0},
    "Which": {"open": 0.0, "fist": 1.0, "idx": 0.0, "thUp": 1.0, "hands": 2.0, "head": 0.0, "wrists": 0.0, "y_off": 0.15, "ext": [0, 0, 0, 0], "motion": 1.0},
    "How Many": {"open": 1.0, "fist": 0.0, "idx": 0.0, "thUp": 0.0, "hands": 2.0, "head": 0.0, "wrists": 0.0, "y_off": 0.10, "ext": [1, 1, 1, 1], "motion": 1.0},
}

for class_idx, name in enumerate(CLASSES):
    p = PROFILES[name]
    for _ in range(SAMPLES_PER_CLASS):
        coords = np.zeros(63)
        ext = p["ext"]
        # Set realistic hand landmark skeleton points
        coords[25] = -0.28 + np.random.normal(0, 0.02) if ext[0] else 0.05 + np.random.normal(0, 0.02)
        coords[37] = -0.30 + np.random.normal(0, 0.02) if ext[1] else 0.06 + np.random.normal(0, 0.02)
        coords[49] = -0.27 + np.random.normal(0, 0.02) if ext[2] else 0.06 + np.random.normal(0, 0.02)
        coords[61] = -0.22 + np.random.normal(0, 0.02) if ext[3] else 0.05 + np.random.normal(0, 0.02)
        coords[13] = 0.14 + np.random.normal(0, 0.02) if p["thUp"] else 0.04 + np.random.normal(0, 0.02)

        meta = [
            float(ext[0]),
            float(ext[1]),
            float(ext[2]),
            float(ext[3]),
            float(p["open"]),
            float(p["fist"]),
            float(p["idx"]),
            float(p["thUp"]),
            float(np.random.normal(0, 0.03)),
            float(p["y_off"] + np.random.normal(0, 0.02)),
            float(np.random.normal(0, 0.02)),
            float(p["y_off"] - 0.20 + np.random.normal(0, 0.02)),
            float(p["hands"]),
            float(p["wrists"]),
            float(1.0 if p["wrists"] and p["hands"] == 2 else 0.0),
            float(p["head"])
        ]

        feat = list(coords) + meta
        X.append(feat)
        y.append(class_idx)

X = np.array(X, dtype=np.float32)
y = np.array(y, dtype=np.int64)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42, stratify=y)

mlp = MLPClassifier(hidden_layer_sizes=(128, 64), max_iter=500, random_state=42, alpha=0.0001, early_stopping=True)
mlp.fit(X_train, y_train)

y_pred = mlp.predict(X_test)
test_acc = accuracy_score(y_test, y_pred)
print(f"[ACCURACY RESULT] Level 6/7/8 Model Test Accuracy: {test_acc * 100:.2f}%")

weights = {
    "classes": CLASSES,
    "input_dim": X.shape[1],
    "test_accuracy": float(test_acc),
    "coefs": [c.tolist() for c in mlp.coefs_],
    "intercepts": [i.tolist() for i in mlp.intercepts_]
}

with open(OUTPUT_JSON, "w", encoding="utf-8") as jf:
    json.dump(weights, jf, indent=2)

ts_content = f"""// Auto-generated Level 6, 7, 8 ISL Neural Network Model
// Trained on {len(CLASSES)} Classes (Jobs, Relations, Questions)
// Test Accuracy: {test_acc * 100:.2f}%

export const LEVEL678_CLASSES: string[] = {json.dumps(CLASSES)};
export const LEVEL678_TEST_ACCURACY: number = {test_acc * 100:.2f};

export const LEVEL678_W0: number[][] = {json.dumps(weights['coefs'][0])};
export const LEVEL678_b0: number[] = {json.dumps(weights['intercepts'][0])};

export const LEVEL678_W1: number[][] = {json.dumps(weights['coefs'][1])};
export const LEVEL678_b1: number[] = {json.dumps(weights['intercepts'][1])};

export const LEVEL678_W2: number[][] = {json.dumps(weights['coefs'][2])};
export const LEVEL678_b2: number[] = {json.dumps(weights['intercepts'][2])};

export function predictLevel678Sign(features: number[]): {{ predictedClass: string; confidence: number; probabilities: Record<string, number> }} | null {{
  if (!features || features.length < 79) return null;
  
  // Layer 0: 79 -> 128 (ReLU)
  const h0 = new Array(128).fill(0);
  for (let j = 0; j < 128; j++) {{
    let sum = LEVEL678_b0[j];
    for (let i = 0; i < 79; i++) {{
      sum += features[i] * LEVEL678_W0[i][j];
    }}
    h0[j] = Math.max(0, sum);
  }}
  
  // Layer 1: 128 -> 64 (ReLU)
  const h1 = new Array(64).fill(0);
  for (let j = 0; j < 64; j++) {{
    let sum = LEVEL678_b1[j];
    for (let i = 0; i < 128; i++) {{
      sum += h0[i] * LEVEL678_W1[i][j];
    }}
    h1[j] = Math.max(0, sum);
  }}
  
  // Layer 2: 64 -> {len(CLASSES)} (Logits)
  const logits = new Array(LEVEL678_CLASSES.length).fill(0);
  for (let j = 0; j < LEVEL678_CLASSES.length; j++) {{
    let sum = LEVEL678_b2[j];
    for (let i = 0; i < 64; i++) {{
      sum += h1[i] * LEVEL678_W2[i][j];
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
    probMap[LEVEL678_CLASSES[i]] = probs[i];
    if (probs[i] > bestProb) {{
      bestProb = probs[i];
      bestIdx = i;
    }}
  }}
  
  return {{
    predictedClass: LEVEL678_CLASSES[bestIdx],
    confidence: bestProb,
    probabilities: probMap
  }};
}}
"""

with open(OUTPUT_TS, "w", encoding="utf-8") as tsf:
    tsf.write(ts_content)

print(f"[EXPORT COMPLETE] Generated {OUTPUT_TS}")
