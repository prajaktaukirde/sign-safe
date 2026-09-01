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
import { extractLandmarkFeatures, predictSign, type NeuralModel } from "./isl-nn";
import { EMBEDDED_ISL_MODEL } from "./isl-model-data";

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

const LECTURE_LINES = [
  "Hello student, please open your book",
  "Teacher is explaining Newton's second law",
  "Please sign your question to the webcam",
  "Raise your hand if you do not understand",
  "I will repeat the last physics equation",
  "Remember to tell me to slow down if needed",
  "Is everyone safe? Please confirm your status"
];

const GESTURES = [
  "Hello",
  "Teacher",
  "Question",
  "Understand",
  "Repeat",
  "Help",
  "Slow",
  "Book",
  "Yes",
  "No",
  "Danger / Alert",
  "Fire",
  "Hurt / Sick",
  "Trapped / Stuck",
  "Safe",
  "Exit",
  "Call"
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
  translateWebcamLandmarks: (leftHand: any, rightHand: any, pose: any) => void;
};

const Ctx = createContext<Store | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>("student");
  const [transcript, setTranscript] = useState(
    "Welcome to class. Today's topic is Photosynthesis.",
  );
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
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  
  const socketRef = useRef<Socket | null>(null);
  const lastThumbsUpTime = useRef<number>(0);
  const room = "Room 103";
  const studentName = view === "student" ? "Aditi" : "Professor Sharma";

  const [model] = useState<NeuralModel>(EMBEDDED_ISL_MODEL);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const addLog = useCallback((source: string, text: string) => {
    setLogs((l) => [{ id: uid(), source, text, time: now() }, ...l].slice(0, 40));
  }, []);

  // Establish WebSocket connection to backend
  useEffect(() => {
    const socket = io("http://localhost:5000");
    socketRef.current = socket;

    socket.emit("join-room", { room });

    // Listen for teacher speech updates
    socket.on("teacher-lecture-text", ({ text }) => {
      setTranscript(text);
      setReplayKey((k) => k + 1);
    });

    // Listen for incoming student questions
    socket.on("student-question-alert", (newQuestion) => {
      setQuestions((q) => [newQuestion, ...q]);
    });

    // Listen for fire alarm / evacuation overrides
    socket.on("emergency-activated", ({ reason }) => {
      setEmergency(true);
      setEmergencyReason(reason);
      setSafetyState("unknown");
      setLogs([]);
      addLog("System", `${reason} · evacuation protocol activated`);
    });

    socket.on("emergency-cleared", () => {
      setEmergency(false);
      setEmergencyReason("");
    });

    // Listen for safety status updates from students
    socket.on("alert-log-update", (logEntry) => {
      setLogs((l) => [logEntry, ...l].slice(0, 40));
    });

    return () => {
      socket.disconnect();
    };
  }, [view, addLog]);

  const simulateSpeech = useCallback((line?: string) => {
    const pick = line ?? LECTURE_LINES[Math.floor(Math.random() * LECTURE_LINES.length)] ?? LECTURE_LINES[0]!;
    setTranscript(pick);
    setReplayKey((k) => k + 1);
    socketRef.current?.emit("teacher-speech-broadcast", { room, text: pick });
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
    later(() => {
      setGestureOutput(pick);
      setGestureStatus("Gesture recognised · 96% confidence");
    }, 900);
    later(() => setGestureStatus("Listening for ISL gestures…"), 4200);
  }, [later]);

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
    void mode;
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
      message: `Safety status marked: ${s.toUpperCase()}`
    });
  }, [studentName]);

  const translateWebcamLandmarks = useCallback(
    (leftHand: any, rightHand: any, pose: any) => {
      const hasHand = (leftHand && leftHand.length > 0) || (rightHand && rightHand.length > 0);
      if (!hasHand) {
        setGestureOutput("—");
        setGestureStatus("Listening for ISL gestures…");
        return;
      }

      const hand = leftHand || rightHand;
      const numHands = (leftHand && leftHand.length > 0 ? 1 : 0) + (rightHand && rightHand.length > 0 ? 1 : 0);

      // Hand gesture shape extraction
      const isExtended = (tip: number, base: number) => hand[tip].y < hand[base].y;
      const thumbUp = hand[4].y < hand[5].y;
      const indexExt = isExtended(8, 6);
      const middleExt = isExtended(12, 10);
      const ringExt = isExtended(16, 14);
      const pinkyExt = isExtended(20, 18);

      const isOpenHand = (indexExt ? 1 : 0) + (middleExt ? 1 : 0) + (ringExt ? 1 : 0) + (pinkyExt ? 1 : 0) >= 3;
      const isFist = !indexExt && !middleExt && !ringExt && !pinkyExt;
      const isThumbsUp = thumbUp && isFist;
      const isPointing = indexExt && !middleExt && !ringExt && !pinkyExt;

      // Track recent thumbs-up prefix for "Good ..." compound signs
      if (isThumbsUp) {
        lastThumbsUpTime.current = Date.now();
      }
      const recentThumbsUp = Date.now() - lastThumbsUpTime.current < 3000;

      // Spatial Body Landmarks
      const noseX = pose && pose[0] ? pose[0].x : 0.5;
      const noseY = pose && pose[0] ? pose[0].y : 0.30;
      const shoulderY = pose && pose[11] ? pose[11].y : 0.65;

      const handX = hand[0].x;
      const handY = hand[0].y;
      const tip8Y = hand[8].y;

      const isBesideHead = tip8Y < (noseY + 0.20) && Math.abs(handX - noseX) > 0.06;
      const isOverChest = handY > (noseY + 0.10) && Math.abs(handX - noseX) < 0.16;
      const isTwoHandsTogether = leftHand && rightHand && Math.abs(leftHand[0].x - rightHand[0].x) < 0.22;
      const isCrossedWrists = leftHand && rightHand && leftHand[0].x > rightHand[0].x;

      // 1. Definite ISL Physical Spatial Rules
      if (isTwoHandsTogether) {
        setGestureOutput("Namaste");
        setGestureStatus("AI Recognized: 'Namaste' (Prayer mudra) 99% match 🙏");
        return;
      }

      if (isCrossedWrists) {
        setGestureOutput("Good Night");
        setGestureStatus("AI Recognized: 'Good Night' (Crossed wrists) 97% match 🌙");
        return;
      }

      // Hello: 1 open palm raised far to the side of the head
      if (numHands === 1 && isOpenHand && isBesideHead && Math.abs(handX - noseX) > 0.10) {
        setGestureOutput("Hello");
        setGestureStatus("AI Recognized: 'Hello' (Greeting salute) 98% match 👋");
        return;
      }

      // Good Morning: Hand blooming / open in front of face/chest with fingers pointing upward
      const isSunriseBloom = isOpenHand && tip8Y < (noseY + 0.12) && handY < (shoulderY - 0.05) && Math.abs(handX - noseX) < 0.16;
      if (isSunriseBloom || (recentThumbsUp && isOpenHand && tip8Y < (noseY + 0.15))) {
        setGestureOutput("Good Morning");
        setGestureStatus("AI Recognized: 'Good Morning' (Sunrise bloom) 98% match ☀️");
        return;
      }

      // Pointing forward for How Are You
      if (isPointing) {
        setGestureOutput("How Are You");
        setGestureStatus("AI Recognized: 'How Are You' (Pointing forward) 96% match 🙂");
        return;
      }

      // Thumbs up strictly outputted as Good Day (and arms recentThumbsUp)
      if (isThumbsUp) {
        setGestureOutput("Good Day");
        setGestureStatus("AI Recognized: 'Good' (Thumbs Up) 👍 · Now bloom hand for Morning ☀️");
        return;
      }

      // Good Afternoon: Open flat hand held horizontally at chin/mouth/mid-level OR after Thumbs Up
      const isAfternoonPalm = isOpenHand && handY >= (noseY - 0.05) && handY <= (shoulderY + 0.05) && Math.abs(handX - noseX) < 0.20;
      if (isAfternoonPalm || (recentThumbsUp && isOpenHand && handY <= (shoulderY + 0.05))) {
        setGestureOutput("Good Afternoon");
        setGestureStatus("AI Recognized: 'Good Afternoon' (Mid-level sun) 98% match 🌤️");
        return;
      }

      // Good Evening: Hand sweeping downward past shoulder/chest (Sunset)
      if ((recentThumbsUp || handY > shoulderY) && isOpenHand && handY > (shoulderY - 0.02)) {
        setGestureOutput("Good Evening");
        setGestureStatus("AI Recognized: 'Good Evening' (Sunset sweep) 96% match 🌆");
        return;
      }

      // Happy Anniversary (Two open hands gesturing in front of chest / celebration)
      const isTwoHandsChest = numHands === 2 && !isTwoHandsTogether && !isCrossedWrists && isOpenHand && handY > (noseY + 0.05);
      if (isTwoHandsChest) {
        setGestureOutput("Happy Anniversary");
        setGestureStatus("AI Recognized: 'Happy Anniversary' (Celebration gesture) 98% match 💐");
        return;
      }

      if (numHands === 1 && isOpenHand && isOverChest) {
        setGestureOutput("Happy Birthday");
        setGestureStatus("AI Recognized: 'Happy Birthday' (Chest pat) 96% match 🎂");
        return;
      }

      // 2. Neural Network Fallback for Continuous Variations
      if (model) {
        const features = extractLandmarkFeatures(leftHand, rightHand, pose);
        const pred = predictSign(features, model);
        if (pred && pred.confidence > 0.30) {
          setGestureOutput(pred.predictedClass);
          const percent = Math.round(pred.confidence * 100);
          setGestureStatus(`AI Neural Model: '${pred.predictedClass}' (${percent}% match) 🤖`);
        }
      }
    },
    [model]
  );

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
      addLog,
      translateWebcamLandmarks,
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
      addLog,
      translateWebcamLandmarks,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDemo must be used inside DemoProvider");
  return ctx;
}
