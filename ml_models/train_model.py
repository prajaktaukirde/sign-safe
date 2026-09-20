import os
import json
import numpy as np
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

def train_and_export(data_path, output_dir):
    print("Loading dataset from:", data_path)
    data = np.load(data_path)
    X, y = data["X"], data["y"]
    
    # Load label mapping
    labels_file = os.path.join(os.path.dirname(data_path), "labels.json")
    with open(labels_file, "r") as f:
        class_names = json.load(f)
        
    print(f"Dataset shape: X={X.shape}, y={y.shape}")
    print(f"Classes ({len(class_names)}): {class_names}")
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print("\nTraining Neural Network Classifier (MLP)...")
    clf = MLPClassifier(
        hidden_layer_sizes=(128, 64),
        activation="relu",
        solver="adam",
        max_iter=400,
        random_state=42,
        early_stopping=True,
        n_iter_no_change=20
    )
    
    clf.fit(X_train, y_train)
    
    # Evaluate
    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print("\n==========================================")
    print(f"Model Test Accuracy: {acc * 100:.2f}%")
    print("==========================================\n")
    print("Classification Report:")
    print(classification_report(y_test, y_pred, target_names=class_names))
    
    # Export weights for real-time in-browser JavaScript evaluation
    weights_and_biases = {
        "W0": clf.coefs_[0].tolist(),         # 147 -> 128
        "b0": clf.intercepts_[0].tolist(),     # 128
        "W1": clf.coefs_[1].tolist(),         # 128 -> 64
        "b1": clf.intercepts_[1].tolist(),     # 64
        "W2": clf.coefs_[2].tolist(),         # 64 -> 10
        "b2": clf.intercepts_[2].tolist(),     # 10
        "classes": class_names,
        "input_dim": int(X.shape[1]),
        "output_dim": len(class_names),
        "accuracy": float(acc)
    }
    
    model_export_path = os.path.join(output_dir, "isl_model.json")
    with open(model_export_path, "w") as f:
        json.dump(weights_and_biases, f)
        
    print(f"Real-time browser model successfully exported to: {model_export_path}")

if __name__ == "__main__":
    dataset_npz = r"C:\Users\praja\Downloads\sign-safe\public\model\isl_dataset.npz"
    export_directory = r"C:\Users\praja\Downloads\sign-safe\public\model"
    train_and_export(dataset_npz, export_directory)
