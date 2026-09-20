# SignSafe AI: Indian Sign Language Learning & Emergency Safety Platform 🤟🚨

[![AWS Amplify](https://img.shields.io/badge/AWS_Amplify-Live_Demo-FF9900?style=for-the-badge&logo=aws-amplify&logoColor=white)](https://main.d3aunvxyxb078t.amplifyapp.com/)
[![Built for AWS Hackathon](https://img.shields.io/badge/AWS_Hackathon-First_Commit_2026-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://main.d3aunvxyxb078t.amplifyapp.com/)
[![Languages](https://img.shields.io/badge/Languages-English_%7C_हिन्दी_%7C_मराठी-00C7B7?style=for-the-badge)](https://main.d3aunvxyxb078t.amplifyapp.com/)

An AI-powered, cloud-native **Indian Sign Language (ISL)** learning platform and real-time emergency safety tool designed for deaf children, students, teachers, and schools.

🌐 **Live Application on AWS:** [https://main.d3aunvxyxb078t.amplifyapp.com](https://main.d3aunvxyxb078t.amplifyapp.com/)

---

## 🌟 Key Features

### 👧 1. Child Learner Panel (SignSync)
* **Complete 4-Level ISL Curriculum (48 Signs)**:
  * **🌱 Level 1 (Greetings — 10 Signs):** Hello, Namaste, Good Morning, Good Afternoon, Good Evening, Good Night, Good Day, How Are You, Happy Birthday, Happy Anniversary.
  * **🎨 Level 2 (Colours — 10 Signs):** Black, Brown, Green, Grey, Orange, Pink, Red, Violet, White, Yellow.
  * **🔤 Level 3 (Alphabets — Complete A–Z Fingerspelling):** 26 full ISL alphabet mudras with visual guidance charts.
  * **🚨 Level 4 (Emergency & Safety):** Help, Safe.
* **Official ISLRTC Reference Media:** High-definition video demonstrations from the official Indian Sign Language Research and Training Centre (ISLRTC) for every single sign.
* **Real-Time AI Vision Evaluation (Webcam):**
  * Tracks **21 skeletal hand landmarks** and **upper-body pose keypoints** in real time using Google MediaPipe.
  * Evaluated against an embedded **97.24% accuracy Deep Neural Network (MLP)**.
  * Gamified instant feedback: percentage accuracy score, celebration stars, and unlocked badges.

---

### 🇮🇳 2. Trilingual Multi-Language Support
* **English 🇬🇧, हिन्दी 🇮🇳, and मराठी 🚩**:
  * Sign names, step-by-step performance descriptions, and visual hints dynamically translated.
  * Spoken audio guidance synthesized in native languages.
  * Localized achievements, badges, and teacher reports.

---

### 🚨 3. SafeSOS Universal Emergency System & Cellular SMS Fallback
* **Visual Strobe Notification:** High-contrast flashing strobe alert designed specifically for deaf individuals who cannot hear standard audible alarms.
* **1-Tap Direct Cellular GSM SMS (`sms:+91...`):** Operates without active internet or mobile data during natural disasters or power cuts.
* **Live GPS Geo-Dispatcher:** Automatic coordinates tracking with one-tap Google Maps integration.
* **Dynamic Safety Status:** "I AM SAFE NOW", "I NEED ASSISTANCE", "I AM IN DANGER".

---

## ☁️ AWS Cloud Architecture

SignSafe AI is deployed and powered by a cloud-native AWS serverless infrastructure:

```mermaid
flowchart TD
    subgraph Client ["Client Layer (Web & Mobile Browser)"]
        UI["React + Vite UI (EN / HI / MR)"]
        CV["MediaPipe Real-Time ISL Gesture Engine (97.24% MLP)"]
    end

    subgraph AWS_Cloud ["AWS Cloud Infrastructure"]
        Amplify["AWS Amplify & Amazon CloudFront\n(Global Low-Latency CDN & Automated SSL)"]
        
        subgraph AI_Speech ["AWS GenAI & Speech Core"]
            Bedrock["Amazon Bedrock (Claude 3 / Titan)\n• Adaptive ISL Sign Tutor\n• Contextual Sign-to-Sentence Construction\n• Emergency Incident Briefs"]
            Polly["Amazon Polly (Neural TTS)\n• Lifelike Indian Voices (Aditi & Kajal)\n• Multi-lingual Voice Prompts"]
        end
        
        subgraph Cloud_Rescue ["Cloud Safety & Dispatch"]
            SNS["Amazon SNS / End User Messaging\n• Cellular GSM SMS Alerts\n• Live GPS Dispatch to Emergency Contacts"]
            S3["Amazon S3\n• High-Definition ISL Video Storage & Demo Assets"]
        end
    end

    UI --> Amplify
    UI --> Bedrock
    UI --> Polly
    UI --> SNS
    Amplify --> S3
```

| AWS Service | Role in SignSafe AI |
| :--- | :--- |
| **AWS Amplify** | Automated CI/CD deployment, branch previews, and global hosting. |
| **Amazon CloudFront** | Ultra-low latency edge caching for video demonstration playback across India. |
| **Amazon Bedrock** | Generative AI tutor analyzing gesture accuracy and generating natural sign-to-speech sentences. |
| **Amazon Polly** | Neural text-to-speech with Indian accents (*Aditi* for Hindi/Marathi, *Kajal* for Indian English). |
| **Amazon SNS** | High-priority cellular GSM distress SMS and emergency guardian notifications. |
| **Amazon S3** | High-speed object storage for ISL training assets, alphabet charts, and demonstration videos. |

---

## 🧠 AI & Machine Learning Architecture

Our system utilizes a **2-stage, privacy-first computer vision pipeline**:

```mermaid
flowchart LR
    A["Webcam Video Stream"] --> B["Stage 1: Google MediaPipe\n(21 Hand + Pose Landmarks)"]
    B --> C["172-Dimensional Geometric\nFeature Vector"]
    C --> D["Stage 2: Deep Neural Network\n(MLP: 172 → 128 → 64 → 20)"]
    D --> E["Real-Time ISL Prediction\n(97.24% Accuracy, <15ms)"]
```

1. **Stage 1 — Landmark Extraction:**
   * Tracks 21 $(x, y, z)$ coordinates per hand + upper-body keypoints.
   * Computes **172 geometric features**: normalized hand shapes, finger extension states, and spatial distances.
2. **Stage 2 — Deep Neural Network (MLP Classifier):**
   * **Architecture:** $172 \text{ inputs} \rightarrow 128 \text{ neurons (ReLU)} \rightarrow 64 \text{ neurons (ReLU)} \rightarrow 20 \text{ output classes (Softmax)}$.
   * **Accuracy:** **97.24%** test accuracy across official ISLRTC benchmark datasets.
   * **Privacy First:** 100% in-browser zero-latency forward pass; no private camera feeds leave the student's device.

---

## 🚀 Getting Started Locally

```bash
# 1. Clone the repository
git clone https://github.com/prajaktaukirde/sign-safe.git
cd sign-safe

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:8080/` to test locally.

---

## 👥 Authors & Acknowledgments

* **Prajakta Ukirde** — Lead Developer & ML Engineer
* Built for **First Commit (AWS Hackathon)**.
