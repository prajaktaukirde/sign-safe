# SignSync + SafeSOS Kids 🤟🚨

An AI-powered, interactive **Indian Sign Language (ISL)** learning platform and real-time emergency safety tool designed for deaf children, students, and educators.

---

## 🌟 Key Features

### 👧 1. Child Learner Panel (SignSync)
* **Step-by-Step Curriculum**: Categorized interactive learning levels:
  * **Level 1 (Greetings)**: Hello, Namaste, Good Morning, Good Afternoon, Good Evening, Good Night, Good Day, How Are You, Happy Birthday, Happy Anniversary.
  * **Level 2 (School & Learning)**: Teacher, Book, Question, Understand.
  * **Level 3 (Emergency & Safety)**: Help, Safe, Doctor, Danger.
* **Real-Time AI Vision Evaluation**:
  * Utilizes **MediaPipe Holistic** in the browser to track 21 hand landmarks and 33 body posture keypoints.
  * Evaluated against an embedded **98.59% accuracy Deep Neural Network (MLP)** trained on official ISLRTC sign videos.
  * Instant gamified visual feedback with celebration confetti, accuracy scores, and star badges!
* **Animated Signing Guide**: Dynamic 3D visual guide demonstrating each sign with adjustable playback speed ($0.5\times$ to $1.5\times$).

---

### 👩‍🏫 2. Parent & Teacher Panel
* **Live Classroom Voice Transcription**:
  * Teachers can speak naturally into the microphone or type lecture notes.
  * Speech is translated live into text and mirrored on the student's screen in real time.
* **Real-Time Student Question Inbox**:
  * Deaf students can send sign-translated questions directly to the teacher's dashboard via Socket.IO.
* **Emergency Dispatch Controls**:
  * Instant broadcast trigger for school-wide acoustic and visual alerts.

---

### 🚨 3. SafeSOS Universal Emergency System
* **Visual Strobe Alert**: High-contrast flashing strobe notification for deaf individuals who cannot hear audible fire sirens.
* **Interactive Evacuation Floorplan**: Dynamic architectural floorplan showing the shortest, safest escape route with pulsing green guides.
* **One-Click Distress Beacon**: Quick-action buttons (**"I AM OK"** / **"I NEED HELP"**) broadcasting student status and desk location to first responders.

---

## 🛠️ Technology Stack

* **Frontend Framework**: React 19 + TypeScript
* **Routing & Architecture**: TanStack Router + TanStack Start (Vite)
* **AI & Computer Vision**: MediaPipe Holistic Vision Tasks + Client-Side Neural Network Classifier (Pure Matrix Multiplication)
* **Styling & UI**: Tailwind CSS + Lucide Icons
* **Real-Time Communication**: Socket.IO Client

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/prajaktaukirde/AI-LEARN.git
cd AI-LEARN
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:8081/`.

### 4. Build for Production
```bash
npm run build
```

---

## 🧠 AI Neural Network Pipeline

* **Dataset Extraction**: Frames extracted from ISL demonstration videos into 172-dimensional normalized joint coordinates (`public/model/isl_dataset.npz`).
* **In-Browser Inference**: Synchronously executes zero-latency matrix operations directly on client hardware without sending camera feeds to any external server (100% privacy preserved).

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
