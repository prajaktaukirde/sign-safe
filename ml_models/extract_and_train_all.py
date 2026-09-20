import os
import cv2
import json
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

GREETING_DIR = r"C:\Users\praja\Downloads\sign-safe\public\level1-greeting"
COLOUR_DIR = r"C:\Users\praja\Downloads\sign-safe\public\level2-colour"
HAND_MODEL = r"c:\Users\praja\prajakta\hand_landmarker.task"
POSE_MODEL = r"c:\Users\praja\prajakta\pose_landmarker.task"

GREETING_MAP = {
    "hello": "Hello",
    "namaste": "Namaste",
    "goodmorning": "Good Morning",
    "goodafternoon": "Good Afternoon",
    "goodevening": "Good Evening",
    "goodnight": "Good Night",
    "goodDay": "Good Day",
    "howareyou": "How Are You",
    "happybirthday": "Happy Birthday",
    "happyaniversary": "Happy Anniversary"
}

COLOUR_MAP = {
    "black": "Black",
    "brown": "Brown",
    "green": "Green",
    "grey": "Grey",
    "orange": "Orange",
    "pink": "Pink",
    "red": "Red",
    "violet": "Violet",
    "white": "White",
    "yellow": "Yellow"
}

def create_detectors():
    hand_options = vision.HandLandmarkerOptions(
        base_options=python.BaseOptions(model_asset_path=HAND_MODEL),
        running_mode=vision.RunningMode.IMAGE,
        num_hands=2,
        min_hand_detection_confidence=0.25,
        min_tracking_confidence=0.25
    )
    hand_detector = vision.HandLandmarker.create_from_options(hand_options)

    pose_options = vision.PoseLandmarkerOptions(
        base_options=python.BaseOptions(model_asset_path=POSE_MODEL),
        running_mode=vision.RunningMode.IMAGE,
        min_pose_detection_confidence=0.25,
        min_tracking_confidence=0.25
    )
    pose_detector = vision.PoseLandmarker.create_from_options(pose_options)

    return hand_detector, pose_detector

def compute_hand_finger_states(landmarks):
    is_ext = lambda tip, base: 1.0 if landmarks[tip].y < landmarks[base].y else 0.0
    thumb_up = 1.0 if landmarks[4].y < landmarks[5].y else 0.0
    idx_ext = is_ext(8, 6)
    mid_ext = is_ext(12, 10)
    rng_ext = is_ext(16, 14)
    pnk_ext = is_ext(20, 18)
    
    is_open = 1.0 if (idx_ext + mid_ext + rng_ext + pnk_ext) >= 3.0 else 0.0
    is_fist = 1.0 if (idx_ext + mid_ext + rng_ext + pnk_ext) == 0.0 else 0.0
    is_pointing = 1.0 if (idx_ext == 1.0 and mid_ext == 0.0 and rng_ext == 0.0 and pnk_ext == 0.0) else 0.0
    is_thumbs_up = 1.0 if (thumb_up == 1.0 and is_fist == 1.0) else 0.0
    
    return [idx_ext, mid_ext, rng_ext, pnk_ext, is_open, is_fist, is_pointing, is_thumbs_up]

def extract_features_rich(hand_result, pose_result):
    left_hand_shape = [0.0] * 63
    right_hand_shape = [0.0] * 63
    left_hand_meta = [0.0] * 12
    right_hand_meta = [0.0] * 12
    pose_vec = [0.0] * 21
    
    nose_x, nose_y, nose_z = 0.5, 0.30, 0.0
    if pose_result.pose_landmarks and len(pose_result.pose_landmarks) > 0:
        nose = pose_result.pose_landmarks[0][0]
        nose_x, nose_y, nose_z = nose.x, nose.y, nose.z
        
        pose_indices = [0, 11, 12, 13, 14, 15, 16]
        vec = []
        for p_idx in pose_indices:
            lm = pose_result.pose_landmarks[0][p_idx]
            vec.extend([lm.x - nose_x, lm.y - nose_y, lm.z - nose_z])
        pose_vec = vec

    num_hands = len(hand_result.hand_landmarks) if hand_result.hand_landmarks else 0
    
    if hand_result.hand_landmarks:
        for idx, landmarks in enumerate(hand_result.hand_landmarks):
            wrist = landmarks[0]
            tip8 = landmarks[8]
            
            shape_vec = []
            for lm in landmarks:
                shape_vec.extend([lm.x - wrist.x, lm.y - wrist.y, lm.z - wrist.z])
                
            finger_states = compute_hand_finger_states(landmarks)
            spatial = [wrist.x - nose_x, wrist.y - nose_y, wrist.z - nose_z, tip8.y - nose_y]
            meta = finger_states + spatial
            
            if wrist.x < nose_x:
                left_hand_shape = shape_vec
                left_hand_meta = meta
            else:
                right_hand_shape = shape_vec
                right_hand_meta = meta
                
    features = left_hand_shape + right_hand_shape + left_hand_meta + right_hand_meta + pose_vec + [float(num_hands)]
    return features

print("Initializing MediaPipe models...")
hand_detector, pose_detector = create_detectors()

X, y_labels = [], []

def process_video_folder(folder_path, sign_mapping):
    for f in os.listdir(folder_path):
        if not f.endswith(".mp4"): continue
        base = os.path.splitext(f)[0]
        if base not in sign_mapping:
            print(f"Skipping {f}, not in mapping")
            continue
            
        label = sign_mapping[base]
        vpath = os.path.join(folder_path, f)
        cap = cv2.VideoCapture(vpath)
        fps = cap.get(cv2.CAP_PROP_FPS) or 30
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        frames_extracted = 0
        frame_idx = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret: break
            frame_idx += 1
            
            # Skip intro / outro 10%
            if frame_idx < total_frames * 0.08 or frame_idx > total_frames * 0.92:
                continue
                
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
            
            h_res = hand_detector.detect(mp_image)
            p_res = pose_detector.detect(mp_image)
            
            if h_res.hand_landmarks and len(h_res.hand_landmarks) > 0:
                feat = extract_features_rich(h_res, p_res)
                X.append(feat)
                y_labels.append(label)
                frames_extracted += 1
                
        cap.release()
        print(f"Extracted {frames_extracted} valid frames for {label}")

print("\n--- Processing Level 1 Greetings ---")
process_video_folder(GREETING_DIR, GREETING_MAP)

print("\n--- Processing Level 2 Colours ---")
process_video_folder(COLOUR_DIR, COLOUR_MAP)

unique_classes = sorted(list(set(y_labels)))
class_to_idx = {c: i for i, c in enumerate(unique_classes)}
y = np.array([class_to_idx[l] for l in y_labels], dtype=np.int64)
X = np.array(X, dtype=np.float32)

print(f"\nTotal extracted samples: {len(X)} across {len(unique_classes)} classes:")
for c in unique_classes:
    count = np.sum(y == class_to_idx[c])
    print(f"  {c}: {count} samples")

# Train Multi-Layer Perceptron
print("\n--- Training Deep Neural Network (MLP) ---")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.15, random_state=42, stratify=y
)

clf = MLPClassifier(
    hidden_layer_sizes=(128, 64),
    activation="relu",
    solver="adam",
    alpha=1e-4,
    batch_size=64,
    learning_rate_init=0.003,
    max_iter=300,
    random_state=42,
    early_stopping=True,
    n_iter_no_change=25
)

clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print("\n==========================================")
print(f"Model Test Accuracy across all {len(unique_classes)} classes: {acc * 100:.2f}%")
print("==========================================\n")
print(classification_report(y_test, y_pred, target_names=unique_classes))

# Export to TypeScript
weights_and_biases = {
    "W0": clf.coefs_[0].tolist(),       # 172 -> 128
    "b0": clf.intercepts_[0].tolist(),   # 128
    "W1": clf.coefs_[1].tolist(),       # 128 -> 64
    "b1": clf.intercepts_[1].tolist(),   # 64
    "W2": clf.coefs_[2].tolist(),       # 64 -> 20
    "b2": clf.intercepts_[2].tolist(),   # 20
    "classes": unique_classes,
    "input_dim": int(X.shape[1]),
    "output_dim": len(unique_classes),
    "accuracy": float(acc)
}

out_ts_path = r"C:\Users\praja\Downloads\sign-safe\src\lib\isl-model-data.ts"
with open(out_ts_path, "w", encoding="utf-8") as f:
    f.write(f"// Embedded 20-Class ISL Neural Model (Greetings + Colours, {acc*100:.2f}% accuracy)\n")
    f.write(f"import type {{ NeuralModel }} from './isl-nn';\n\n")
    f.write(f"export const EMBEDDED_ISL_MODEL: NeuralModel = {json.dumps(weights_and_biases)};\n")

print(f"\nSuccessfully generated {out_ts_path}!")
