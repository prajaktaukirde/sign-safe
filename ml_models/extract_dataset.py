import os
import cv2
import json
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

SIGN_MAPPINGS = {
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

def create_detectors(hand_model_path, pose_model_path):
    hand_options = vision.HandLandmarkerOptions(
        base_options=python.BaseOptions(model_asset_path=hand_model_path),
        running_mode=vision.RunningMode.IMAGE,
        num_hands=2,
        min_hand_detection_confidence=0.3,
        min_tracking_confidence=0.3
    )
    hand_detector = vision.HandLandmarker.create_from_options(hand_options)

    pose_options = vision.PoseLandmarkerOptions(
        base_options=python.BaseOptions(model_asset_path=pose_model_path),
        running_mode=vision.RunningMode.IMAGE,
        min_pose_detection_confidence=0.3,
        min_tracking_confidence=0.3
    )
    pose_detector = vision.PoseLandmarker.create_from_options(pose_options)

    return hand_detector, pose_detector

def compute_hand_finger_states(landmarks):
    # landmarks: 21 points
    wrist = landmarks[0]
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
    left_hand_meta = [0.0] * 12 # 8 finger states + dx, dy, dz, tip_dy
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
            
            # Shape
            shape_vec = []
            for lm in landmarks:
                shape_vec.extend([lm.x - wrist.x, lm.y - wrist.y, lm.z - wrist.z])
                
            finger_states = compute_hand_finger_states(landmarks) # 8
            spatial = [wrist.x - nose_x, wrist.y - nose_y, wrist.z - nose_z, tip8.y - nose_y] # 4
            meta = finger_states + spatial # 12
            
            if wrist.x < nose_x:
                left_hand_shape = shape_vec
                left_hand_meta = meta
            else:
                right_hand_shape = shape_vec
                right_hand_meta = meta
                
    global_meta = [float(num_hands)] # 1
    
    # Total features = 63 + 63 + 12 + 12 + 21 + 1 = 172
    return np.array(left_hand_shape + right_hand_shape + left_hand_meta + right_hand_meta + pose_vec + global_meta, dtype=np.float32)

def augment_sample(vec):
    noise = np.random.normal(0, 0.010, size=vec.shape)
    # Don't add noise to discrete binary indicators at the end
    noise[126:150] = 0.0
    noise[-1] = 0.0
    scale = np.random.uniform(0.94, 1.06)
    return (vec * scale + noise).astype(np.float32)

def mirror_sample(vec):
    """
    Mirror sample: swap left hand and right hand blocks, negate all X coordinates.
    """
    mirrored = vec.copy()
    left_shape = vec[0:63].copy()
    right_shape = vec[63:126].copy()
    left_meta = vec[126:138].copy()
    right_meta = vec[138:150].copy()
    pose_part = vec[150:171].copy()
    global_meta = vec[171:172].copy()
    
    # Negate X in shapes
    for i in range(0, 63, 3):
        left_shape[i] = -left_shape[i]
        right_shape[i] = -right_shape[i]
    for i in range(0, 21, 3):
        pose_part[i] = -pose_part[i]
        
    # In meta: index 8 is dx (negate)
    left_meta[8] = -left_meta[8]
    right_meta[8] = -right_meta[8]
    
    # Swap left and right
    return np.concatenate([right_shape, left_shape, right_meta, left_meta, pose_part, global_meta]).astype(np.float32)

def process_all_videos(video_dir, output_dir, hand_model_path, pose_model_path):
    os.makedirs(output_dir, exist_ok=True)
    hand_detector, pose_detector = create_detectors(hand_model_path, pose_model_path)
    
    X = []
    y = []
    
    sorted_classes = sorted(list(set(SIGN_MAPPINGS.values())))
    class_to_idx = {c: i for i, c in enumerate(sorted_classes)}
    
    print(f"Target Classes ({len(sorted_classes)}): {sorted_classes}\n")
    
    for file in os.listdir(video_dir):
        if not file.lower().endswith(('.mp4', '.mov', '.webm', '.avi')):
            continue
            
        base_key = os.path.splitext(file)[0]
        class_name = None
        for key, val in SIGN_MAPPINGS.items():
            if key.lower() == base_key.lower():
                class_name = val
                break
                
        if not class_name:
            continue
            
        class_idx = class_to_idx[class_name]
        video_path = os.path.join(video_dir, file)
        cap = cv2.VideoCapture(video_path)
        
        valid_frames = 0
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
            
            hand_result = hand_detector.detect(mp_image)
            pose_result = pose_detector.detect(mp_image)
            
            if hand_result.hand_landmarks and len(hand_result.hand_landmarks) > 0:
                feat = extract_features_rich(hand_result, pose_result)
                mirrored_feat = mirror_sample(feat)
                
                X.append(feat)
                y.append(class_idx)
                X.append(mirrored_feat)
                y.append(class_idx)
                valid_frames += 1
                
                # 6 augmentations per frame
                for _ in range(6):
                    X.append(augment_sample(feat))
                    y.append(class_idx)
                    X.append(augment_sample(mirrored_feat))
                    y.append(class_idx)
                    
        cap.release()
        print(f"Processed: '{file}' -> Class '{class_name}' ({valid_frames} frames, {valid_frames * 14} total samples)")
        
    X = np.array(X, dtype=np.float32)
    y = np.array(y, dtype=np.int64)
    
    print(f"\n==========================================")
    print(f"Dataset summary: {len(X)} samples, {X.shape[1]} features per sample across {len(sorted_classes)} classes.")
    print(f"==========================================")
    
    dataset_file = os.path.join(output_dir, "isl_dataset.npz")
    np.savez_compressed(dataset_file, X=X, y=y)
    
    labels_file = os.path.join(output_dir, "labels.json")
    with open(labels_file, "w") as f:
        json.dump(sorted_classes, f, indent=2)
        
    print(f"Saved dataset to: {dataset_file}")
    print(f"Saved labels to: {labels_file}")

if __name__ == "__main__":
    v_dir = r"C:\Users\praja\Downloads\sign-safe\data\level1-greeting"
    out_dir = r"C:\Users\praja\Downloads\sign-safe\public\model"
    h_model = r"c:\Users\praja\prajakta\hand_landmarker.task"
    p_model = r"c:\Users\praja\prajakta\pose_landmarker.task"
    process_all_videos(v_dir, out_dir, h_model, p_model)
