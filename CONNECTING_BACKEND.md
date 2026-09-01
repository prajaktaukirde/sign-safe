# Connecting Your React Frontend to the Node.js Backend

You have a complete React frontend (designed in TanStack Start) and a Node.js + Express + Socket.io backend server configured inside the `server/` directory.

Follow these simple steps to wire your frontend state to the backend database and WebSocket servers.

---

## Step 1: Update the Frontend State Store
Open the file **`src/lib/demo-store.tsx`** and replace it with the following code. This replaces the mock timers with real WebSocket emitters and listeners:

```typescript
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

export type View = "student" | "teacher";
export type SafetyStatus = "unknown" | "ok" | "help" | "trapped";

export type Question = {
  id: string;
  student: string;
  desk: string;
  text: string;
  time: string;
  answered: boolean;
};

export type LogEntry = { id: string; source: string; text: string; time: string };

const GESTURES = [
  "I have a question",
  "Please repeat that",
  "Help",
  "I understand",
  "Can you slow down?",
];

const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

const uid = () => Math.random().toString(36).slice(2, 10);

type Store = {
  view: View;
  setView: (v: View) => void;
  transcript: string;
  liveWords: string;
  isListening: boolean;
  simulateSpeech: (line?: string) => void;
  pushTeacherMessage: (text: string) => void;
  avatarSpeed: number;
  setAvatarSpeed: (n: number) => void;
  replayKey: number;
  replay: () => void;
  gestureStatus: string;
  gestureOutput: string;
  simulateGesture: (text?: string) => void;
  questions: Question[];
  sendQuestion: (text: string) => void;
  markAnswered: (id: string, mode: "typed" | "vocal") => void;
  emergency: boolean;
  emergencyReason: string;
  triggerEmergency: (reason: string) => void;
  clearEmergency: () => void;
  safety: SafetyStatus;
  setSafety: (s: SafetyStatus) => void;
  room: string;
  logs: LogEntry[];
  addLog: (source: string, text: string) => void;
};

const Ctx = createContext<Store | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>("student");
  const [transcript, setTranscript] = useState("Welcome to class. Today's topic is Photosynthesis.");
  const [liveWords, setLiveWords] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [avatarSpeed, setAvatarSpeed] = useState(1);
  const [replayKey, setReplayKey] = useState(0);
  const [gestureStatus, setGestureStatus] = useState("Listening for ISL gestures…");
  const [gestureOutput, setGestureOutput] = useState("—");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [emergency, setEmergency] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState("");
  const [safety, setSafetyState] = useState<SafetyStatus>("unknown");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  const socketRef = useRef<Socket | null>(null);
  const room = "Room 103";
  const studentName = view === "student" ? "Aditi" : "Professor Sharma";

  // Establish WebSocket connection
  useEffect(() => {
    // Connect to Node.js backend running on port 5000
    const socket = io("http://localhost:5000");
    socketRef.current = socket;

    socket.emit("join-room", { room });

    // Listen for teacher's speech translations
    socket.on("teacher-lecture-text", ({ text }) => {
      setTranscript(text);
      setReplayKey((k) => k + 1);
    });

    // Listen for incoming DHH student questions
    socket.on("student-question-alert", (newQuestion) => {
      setQuestions((q) => [newQuestion, ...q]);
    });

    // Listen for fire alarm acoustic scanner / emergency overrides
    socket.on("emergency-activated", ({ reason }) => {
      setEmergency(true);
      setEmergencyReason(reason);
      setSafetyState("unknown");
      setLogs([]);
    });

    socket.on("emergency-cleared", () => {
      setEmergency(false);
      setEmergencyReason("");
    });

    // Listen for live SOS responder updates
    socket.on("alert-log-update", (logEntry) => {
      setLogs((l) => [logEntry, ...l].slice(0, 40));
    });

    return () => {
      socket.disconnect();
    };
  }, [view]);

  const simulateSpeech = useCallback((line?: string) => {
    if (!line) return;
    setTranscript(line);
    setReplayKey((k) => k + 1);
    socketRef.current?.emit("teacher-speech-broadcast", { room, text: line });
  }, []);

  const pushTeacherMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    setTranscript(text.trim());
    setReplayKey((k) => k + 1);
    socketRef.current?.emit("teacher-speech-broadcast", { room, text: text.trim() });
  }, []);

  const simulateGesture = useCallback((text?: string) => {
    const pick = text ?? GESTURES[Math.floor(Math.random() * GESTURES.length)] ?? GESTURES[0]!;
    setGestureStatus("Hand landmarks locked · decoding ISL…");
    setGestureOutput("…");
    setTimeout(() => {
      setGestureOutput(pick);
      setGestureStatus("Gesture recognised · 96% confidence");
    }, 900);
    setTimeout(() => setGestureStatus("Listening for ISL gestures…"), 4200);
  }, []);

  const sendQuestion = useCallback((text: string) => {
    if (!text.trim() || text === "—") return;
    socketRef.current?.emit("student-sign-send", { 
      room, 
      studentName, 
      word: text.trim(), 
      desk: "Desk 7" 
    });
  }, [studentName]);

  const markAnswered = useCallback((id: string, mode: "typed" | "vocal") => {
    setQuestions((q) => q.map((x) => (x.id === id ? { ...x, answered: true } : x)));
  }, []);

  const triggerEmergency = useCallback((reason: string) => {
    socketRef.current?.emit("trigger-global-emergency", { room, reason });
  }, []);

  const clearEmergency = useCallback(() => {
    socketRef.current?.emit("clear-global-emergency", { room });
  }, []);

  const setSafety = useCallback((s: SafetyStatus) => {
    setSafetyState(s);
    socketRef.current?.emit("sos-distress-signal", {
      room,
      studentName,
      status: s,
      message: `Safety state set to ${s.toUpperCase()}`
    });
  }, [studentName]);

  const value = useMemo<Store>(
    () => ({
      view,
      setView,
      transcript,
      liveWords,
      isListening,
      simulateSpeech,
      pushTeacherMessage,
      avatarSpeed,
      setAvatarSpeed,
      replayKey,
      replay: () => setReplayKey((k) => k + 1),
      gestureStatus,
      gestureOutput,
      simulateGesture,
      questions,
      sendQuestion,
      markAnswered,
      emergency,
      emergencyReason,
      triggerEmergency,
      clearEmergency,
      safety,
      setSafety,
      room,
      logs,
      addLog: (source: string, text: string) => {
        setLogs((l) => [{ id: uid(), source, text, time: now() }, ...l].slice(0, 40));
      },
    }),
    [
      view,
      transcript,
      liveWords,
      isListening,
      simulateSpeech,
      pushTeacherMessage,
      avatarSpeed,
      replayKey,
      gestureStatus,
      gestureOutput,
      simulateGesture,
      questions,
      sendQuestion,
      markAnswered,
      emergency,
      emergencyReason,
      triggerEmergency,
      clearEmergency,
      safety,
      setSafety,
      logs,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDemo must be used inside DemoProvider");
  return ctx;
}
```

---

## Step 2: How to Run the App

Open **two terminals** inside `Downloads/sign-safe`:

### Terminal 1: Run the Backend
```bash
cd server
npm run dev
```
*(Server will start on `http://localhost:5000`)*

### Terminal 2: Run the Frontend
```bash
npm run dev
```
*(Frontend dev client will start on Vite's local port)*
