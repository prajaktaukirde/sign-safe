import os
import cv2
import json
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

DATASET_DIR = r"C:\Users\praja\Downloads\archive\dataset - Gesture Speech"
HAND_MODEL = r"c:\Users\praja\prajakta\hand_landmarker.task"
POSE_MODEL = r"c:\Users\praja\prajakta\pose_landmarker.task"
OUTPUT_TS = r"c:\Users\praja\prajakta\isl-alphabet-model-data.ts"
OUTPUT_JSON = r"c:\Users\praja\prajakta\isl_alphabets_model.json"

ALPHABETS = [chr(c) for c in range(ord('a'), ord('z') + 1)]  # ['a', 'b', ..., 'z']

def create_detectors():
    print("Loading MediaPipe Landmarker Models...")
    hand_options = vision.HandLandmarkerOptions(
        base_options=python.BaseOptions(model_asset_path=HAND_MODEL),
        running_mode=vision.RunningMode.IMAGE,
        num_hands=2,
        min_hand_detection_confidence=0.20,
        min_tracking_confidence=0.20
    )
    hand_detector = vision.HandLandmarker.create_from_options(hand_options)

    pose_detector = None
    if os.path.exists(POSE_MODEL):
        pose_options = vision.PoseLandmarkerOptions(
            base_options=python.BaseOptions(model_asset_path=POSE_MODEL),
            running_mode=vision.RunningMode.IMAGE,
            min_pose_detection_confidence=0.20,
            min_tracking_confidence=0.20
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

def extract_features(hand_result, pose_result):
    left_hand_shape = [0.0] * 63
    right_hand_shape = [0.0] * 63
    left_hand_meta = [0.0] * 12
    right_hand_meta = [0.0] * 12
    pose_vec = [0.0] * 21
    
    nose_x, nose_y, nose_z = 0.5, 0.30, 0.0
    if pose_result and pose_result.pose_landmarks and len(pose_result.pose_landmarks) > 0:
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

def main():
    print("=" * 60)
    print("      SignSafe AI: Level 3 Alphabet Model Trainer (A-Z)     ")
    print("=" * 60)
    
    if not os.path.exists(DATASET_DIR):
        print(f"Error: Dataset directory not found at {DATASET_DIR}")
        return
        
    hand_detector, pose_detector = create_detectors()
    X, y_labels = [], []
    
    for letter in ALPHABETS:
        letter_dir = os.path.join(DATASET_DIR, letter)
        upper_letter_dir = os.path.join(DATASET_DIR, letter.upper())
        target_dir = letter_dir if os.path.exists(letter_dir) else (upper_letter_dir if os.path.exists(upper_letter_dir) else None)
        
        if not target_dir:
            print(f"Warning: No directory found for letter '{letter.upper()}'")
            continue
            
        label = letter.upper()
        files = [f for f in os.listdir(target_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.mp4', '.avi'))]
        print(f"Processing Letter '{label}': Found {len(files)} files...")
        
        extracted_for_class = 0
        for f in files:
            fpath = os.path.join(target_dir, f)
            
            # Handle Video files
            if f.lower().endswith(('.mp4', '.avi', '.mov')):
                cap = cv2.VideoCapture(fpath)
                while cap.isOpened():
                    ret, frame = cap.read()
                    if not ret: break
                    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
                    h_res = hand_detector.detect(mp_image)
                    p_res = pose_detector.detect(mp_image) if pose_detector else None
                    if h_res.hand_landmarks and len(h_res.hand_landmarks) > 0:
                        feat = extract_features(h_res, p_res)
                        X.append(feat)
                        y_labels.append(label)
                        extracted_for_class += 1
                cap.release()
            else:
                # Handle Image files
                img = cv2.imread(fpath)
                if img is None: continue
                rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
                h_res = hand_detector.detect(mp_image)
                p_res = pose_detector.detect(mp_image) if pose_detector else None
                if h_res.hand_landmarks and len(h_res.hand_landmarks) > 0:
                    feat = extract_features(h_res, p_res)
                    X.append(feat)
                    y_labels.append(label)
                    extracted_for_class += 1
                    
        print(f"  --> Extracted {extracted_for_class} valid landmark samples for '{label}'")

    unique_classes = sorted(list(set(y_labels)))
    if len(unique_classes) == 0:
        print("No landmark samples could be extracted. Check dataset images.")
        return
        
    print(f"\nExtracted total {len(X)} samples across {len(unique_classes)} classes: {unique_classes}")
    
    class_to_idx = {c: i for i, c in enumerate(unique_classes)}
    y = np.array([class_to_idx[l] for l in y_labels], dtype=np.int64)
    X = np.array(X, dtype=np.float32)
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    
    print(f"\nTraining Deep MLP Neural Network (172 -> 128 -> 64 -> {len(unique_classes)})...")
    mlp = MLPClassifier(
        hidden_layer_sizes=(128, 64),
        activation='relu',
        solver='adam',
        max_iter=500,
        random_state=42,
        early_stopping=True,
        validation_fraction=0.1,
        n_iter_no_change=15,
        alpha=0.0001,
        verbose=True
    )
    
    mlp.fit(X_train, y_train)
    
    y_pred = mlp.predict(X_test)
    test_acc = accuracy_score(y_test, y_pred)
    print("\n" + "=" * 60)
    print(f"LEVEL 3 ALPHABET TEST ACCURACY: {test_acc * 100:.2f}%")
    print("=" * 60)
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=unique_classes))
    
    # Export model weights for JavaScript in-browser evaluation
    weights = {
        "classes": unique_classes,
        "input_dim": 172,
        "test_accuracy": float(test_acc),
        "coefs": [c.tolist() for c in mlp.coefs_],
        "intercepts": [i.tolist() for i in mlp.intercepts_]
    }
    
    with open(OUTPUT_JSON, "w") as jf:
        json.dump(weights, jf, indent=2)
    print(f"Saved model weights to JSON: {OUTPUT_JSON}")
    
    # Export TypeScript file
    with open(OUTPUT_TS, "w") as tsf:
        tsf.write("// Auto-generated Level 3 ISL Alphabet Neural Network Model Data\n")
        tsf.write(f"export const ALPHABET_CLASSES = {json.dumps(unique_classes)};\n\n")
        tsf.write(f"export const ALPHABET_TEST_ACCURACY = {test_acc * 100:.2f};\n\n")
        tsf.write(f"export const ALPHABET_W0: number[][] = {json.dumps(weights['coefs'][0])};\n")
        tsf.write(f"export const ALPHABET_b0: number[] = {json.dumps(weights['intercepts'][0])};\n")
        tsf.write(f"export const ALPHABET_W1: number[][] = {json.dumps(weights['coefs'][1])};\n")
        tsf.write(f"export const ALPHABET_b1: number[] = {json.dumps(weights['intercepts'][1])};\n")
        tsf.write(f"export const ALPHABET_W2: number[][] = {json.dumps(weights['coefs'][2])};\n")
        tsf.write(f"export const ALPHABET_b2: number[] = {json.dumps(weights['intercepts'][2])};\n")
    print(f"Exported in-browser TypeScript model to: {OUTPUT_TS}")

if __name__ == "__main__":
    main()
