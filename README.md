# Sign & Safe

Role: Senior Frontend Developer & UI/UX Expert

Platform: React (Vite) + Tailwind CSS + Lucide Icons

Generate a fully functional, highly interactive, and premium dark-themed web application for "AI-Powered Classroom and Emergency Assistance for Deaf Individuals in ISL". The project has two modules: SignSync (classroom accessibility) and SafeSOS (emergency assistance). 

Because this is a frontend prototype, all hardware integrations (webcam tracking, microphone voice translation, 3D avatar animations, and fire alarm sound scanning) must be simulated with realistic, beautiful visual mocks.

---

### Design System & Layout (Tailwind CSS)

- Theme: High-contrast, dark mode.

- Colors:

  - Background: Deep Indigo (bg-[#0B0A1A] or bg-[#121124])

  - Accent: Vibrant Blue (#0066FF), Warning Orange (#FF9500), Danger Red (#FF3B30)

  - Cards: Translucent white with heavy blur (bg-white/5 backdrop-blur-md border border-white/10)

- Typography: Outfit or Inter sans-serif font, clear and scalable for accessibility.

---

### Dashboard View 1: Student Classroom Panel ("SignSync")

Provide a split-pane layout for the student's console:

1. Left Panel: 3D Sign Language Avatar (60% width)

   - Display a simulated 3D character (rendered inside a card using standard Canvas or HTML/CSS skeletal lines).

   - The avatar should perform smooth, looping signing movements.

   - Include controls to change speed (0.75x, 1x, 1.25x, 1.5x) and a button to replay the sign sequence.

   - At the bottom of this panel, include a massive, bold subtitle banner: "Teacher: [Live Lecture Transcript]" (this updates automatically as the teacher speaks).

2. Right Panel: Webcam Gesture Capture (40% width)

   - Display a simulated webcam feed box. Over the video box, overlay animated tracking lines (MediaPipe hand skeletons) to simulate live tracking.

   - Below the webcam, display a translation status box showing: "Status: Listening for ISL gestures..." and "Translated Output: [Mock text updates here, e.g., 'I have a question' or 'Help']".

   - Include a "Send Question to Teacher" button.

---

### Dashboard View 2: Teacher Presentation Panel

Provide a control board for the instructor:

1. Lecture Input Panel:

   - A microphone button. When clicked, it simulates listening and updates the "live text" transcripts word-by-word.

   - A text area where the teacher can type messages to send directly to the student's subtitles/avatar.

2. Student Alert Queue:

   - A list displaying incoming translated sign questions from deaf students in real-time (e.g. "Rohan (Desk 3) asks: Please repeat").

   - Buttons to "Type Reply" or "Answer Vocally".

3. Manual Alarm Trigger:

   - A large, pulsing red button labeled "TRIGGER CAMPUS EVACUATION". Clicking this activates the global emergency override.

---

### Dashboard View 3: SafeSOS Universal Emergency Overlay

This component represents the safety responder. It should override the screen if:

- The teacher triggers the evacuation button, OR

- An alarm sound is detected (include a "Simulate Fire Alarm" button on screen to trigger this).

Overlay Features (Full-screen, absolute overlay):

1. Visual Strobe Alert: A fast flashing animation wiggling between red and orange. Include a loud visual alert: "!!! WARNING: FIRE ALARM DETECTED !!!"

2. Evacuation Floorplan Map:

   - Render a simplified visual map of the school floorplan (e.g., Rooms 101, 102, 103, main corridor, exits).

   - Animate a glowing green dotted line pointing from the user's room to the nearest escape exit.

3. SOS Action Buttons:

   - Large, clickable status buttons:

     - "I AM OK" (changes panel to safe green).

     - "I NEED HELP" (sends distress alert).

     - "I AM TRAPPED" (sends critical emergency alert with room number).

   - Display a live status log showing rescue responses: "Security: Rescue team dispatched to Room 103".

---

### Interactivity & Prototyping Controls

Provide a floating "Demo Control Panel" widget in the corner of the screen so users can simulate scenarios:

1. "Simulate Teacher Speech": Triggers mock lecture text to update subtitles and avatar motion.

2. "Simulate Student ISL Gesture": Triggers mock sign-language output.

3. "Simulate Fire Alarm Sound": Triggers the SafeSOS emergency overlay.

4. "Toggle Student/Teacher View": Easily switch between the Student Console and the Teacher Console.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2e3b1bbb-5ac3-41e6-9c27-37bc9628978b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
