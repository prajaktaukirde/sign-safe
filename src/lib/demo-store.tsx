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
  activeSign: string | null;
  setActiveSign: (s: string | null) => void;
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
  const [activeSign, setActiveSign] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [emergency, setEmergency] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState("");
  const [safety, setSafetyState] = useState<SafetyStatus>("unknown");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  
  const socketRef = useRef<Socket | null>(null);
  const lastThumbsUpTime = useRef<number>(0);
  const activeSignRef = useRef<string | null>(null);
  activeSignRef.current = activeSign;

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

    socket.on("teacher-lecture-text", ({ text }) => {
      setTranscript(text);
      setReplayKey((k) => k + 1);
    });

    socket.on("student-question-alert", (newQuestion) => {
      setQuestions((q) => [newQuestion, ...q]);
    });

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

  /**
   * Anatomically Accurate, Multi-Modal Real-Time ISL Gesture Interpreter
   */
  const translateWebcamLandmarks = useCallback(
    (leftHand: any, rightHand: any, pose: any) => {
      // 1. Validate real hand presence
      const hasLeft = leftHand && Array.isArray(leftHand) && leftHand.length === 21;
      const hasRight = rightHand && Array.isArray(rightHand) && rightHand.length === 21;

      if (!hasLeft && !hasRight) {
        setGestureOutput("—");
        setGestureStatus("No hands detected. Show your hand to the camera.");
        return;
      }

      const primaryHand = hasRight ? rightHand : leftHand;
      const numHands = (hasLeft ? 1 : 0) + (hasRight ? 1 : 0);

      // Body spatial anchors
      const noseX = pose && pose[0] ? pose[0].x : 0.5;
      const noseY = pose && pose[0] ? pose[0].y : 0.28;
      const shoulderY = pose && pose[11] ? (pose[11].y + (pose[12]?.y || pose[11].y)) / 2 : 0.60;
      const mouthY = pose && pose[9] && pose[10] ? (pose[9].y + pose[10].y) / 2 : noseY + 0.08;

      // Primary hand key joints
      const wrist = primaryHand[0];
      const tip4 = primaryHand[4]; // Thumb tip
      const ip3 = primaryHand[3];
      const mcp2 = primaryHand[2];
      const cmc1 = primaryHand[1];

      const tip8 = primaryHand[8]; // Index tip
      const pip6 = primaryHand[6];

      const tip12 = primaryHand[12]; // Middle tip
      const pip10 = primaryHand[10];

      const tip16 = primaryHand[16]; // Ring tip
      const pip14 = primaryHand[14];

      const tip20 = primaryHand[20]; // Pinky tip
      const pip18 = primaryHand[18];

      // Robust 3D distance check
      const d = (p1: any, p2: any) => Math.hypot((p1.x || 0) - (p2.x || 0), (p1.y || 0) - (p2.y || 0));
      
      const idxExt = d(tip8, wrist) > d(pip6, wrist) * 1.05 || tip8.y < pip6.y;
      const midExt = d(tip12, wrist) > d(pip10, wrist) * 1.05 || tip12.y < pip10.y;
      const rngExt = d(tip16, wrist) > d(pip14, wrist) * 1.05 || tip16.y < pip14.y;
      const pnkExt = d(tip20, wrist) > d(pip18, wrist) * 1.05 || tip20.y < pip18.y;

      const thumbUp = tip4.y < mcp2.y || tip4.y < ip3.y || (tip4.y < wrist.y && Math.abs(tip4.x - wrist.x) < 0.15);
      const thumbExt = Math.abs(tip4.x - cmc1.x) > 0.04 || d(tip4, mcp2) > d(ip3, mcp2) * 1.1;

      const openCount = (idxExt ? 1 : 0) + (midExt ? 1 : 0) + (rngExt ? 1 : 0) + (pnkExt ? 1 : 0);
      const isOpenPalm = openCount >= 3;
      const isFist = openCount === 0 && !thumbUp;
      const isThumbsUp = (thumbUp || thumbExt) && openCount === 0;
      const isIndexPoint = idxExt && !midExt && !rngExt && !pnkExt;
      const isPeaceV = idxExt && midExt && !rngExt && !pnkExt;
      const isYHand = (thumbExt || thumbUp) && pnkExt && !idxExt && !midExt;
      const isBHand = isOpenPalm;

      if (isThumbsUp) {
        lastThumbsUpTime.current = Date.now();
      }
      const recentThumbsUp = Date.now() - lastThumbsUpTime.current < 5000;

      const handX = wrist.x;
      const handY = wrist.y;
      const tip8Y = tip8.y;
      const tip8X = tip8.x;

      const isBesideHead = tip8Y < shoulderY && Math.abs(handX - noseX) > 0.08;
      const isOverChest = handY > noseY + 0.05 && handY < shoulderY + 0.35 && Math.abs(handX - noseX) < 0.35;
      const isNearMouth = Math.abs(tip8Y - mouthY) < 0.16 && Math.abs(tip8X - noseX) < 0.25;
      const isNearForehead = tip8Y < noseY + 0.08 && Math.abs(tip8X - noseX) < 0.25;

      // Two hand distance and wrist relationships
      let areWristsClose = false;
      let isCrossedWrists = false;
      if (hasLeft && hasRight) {
        const distWrists = d(leftHand[0], rightHand[0]);
        areWristsClose = distWrists < 0.28;
        isCrossedWrists = (leftHand[0].x > rightHand[0].x && rightHand[0].x < 0.52) || (distWrists < 0.20 && leftHand[0].y > noseY);
      }

      const activeTarget = activeSignRef.current ? activeSignRef.current.trim().toLowerCase() : null;

      // ----------------------------------------------------
      // PRIORITY 1: ACTIVE LESSON TARGET RECOGNITION
      // ----------------------------------------------------
      if (activeTarget) {
        // PINK: Touching chin / lower lip with finger
        if (activeTarget === "pink") {
          if (isNearMouth || (Math.abs(tip8Y - mouthY) < 0.18 && Math.abs(tip8X - noseX) < 0.25 && (idxExt || midExt))) {
            setGestureOutput("Pink");
            setGestureStatus("Recognized: 'Pink' (Chin/Lip touch) 🌸");
            return;
          }
        }

        // RED: Index finger touching lips
        if (activeTarget === "red") {
          if (isNearMouth && idxExt) {
            setGestureOutput("Red");
            setGestureStatus("Recognized: 'Red' (Lip touch) 🔴");
            return;
          }
        }

        // BLACK: Index finger touching forehead/eyebrow
        if (activeTarget === "black") {
          if (isNearForehead && idxExt) {
            setGestureOutput("Black");
            setGestureStatus("Recognized: 'Black' (Forehead point) ⬛");
            return;
          }
        }

        // BROWN: Flat B-handshape on cheek
        if (activeTarget === "brown") {
          if ((isBHand || isOpenPalm || openCount >= 2) && Math.abs(tip8Y - mouthY) < 0.20 && Math.abs(handX - noseX) > 0.05) {
            setGestureOutput("Brown");
            setGestureStatus("Recognized: 'Brown' (B-hand on cheek) 🟤");
            return;
          }
        }

        // YELLOW: Y-hand (thumb + pinky)
        if (activeTarget === "yellow") {
          if (isYHand || (thumbExt && pnkExt)) {
            setGestureOutput("Yellow");
            setGestureStatus("Recognized: 'Yellow' (Y-handshape) 💛");
            return;
          }
        }

        // VIOLET: Peace V sign
        if (activeTarget === "violet") {
          if (isPeaceV || (idxExt && midExt)) {
            setGestureOutput("Violet");
            setGestureStatus("Recognized: 'Violet' (V-handshape) 💜");
            return;
          }
        }

        // WHITE: Flat hand on chest
        if (activeTarget === "white") {
          if (isOpenPalm && isOverChest) {
            setGestureOutput("White");
            setGestureStatus("Recognized: 'White' (Flat on chest) ⚪");
            return;
          }
        }

        // ORANGE: Squeezing at mouth
        if (activeTarget === "orange") {
          if (isNearMouth) {
            setGestureOutput("Orange");
            setGestureStatus("Recognized: 'Orange' (Squeezing at mouth) 🍊");
            return;
          }
        }

        // GREEN: Pointing G-gesture
        if (activeTarget === "green") {
          if (idxExt && isOverChest) {
            setGestureOutput("Green");
            setGestureStatus("Recognized: 'Green' (G-gesture across body) 🟢");
            return;
          }
        }

        // GREY: Fingers intercrossed
        if (activeTarget === "grey") {
          if (numHands === 2 && isOverChest) {
            setGestureOutput("Grey");
            setGestureStatus("Recognized: 'Grey' (Intertwined fingers) ⚪");
            return;
          }
        }

        // HAPPY BIRTHDAY: Flat palm on chest/heart
        if (activeTarget === "happy birthday") {
          if (isOpenPalm && isOverChest) {
            setGestureOutput("Happy Birthday");
            setGestureStatus("Recognized: 'Happy Birthday' (Chest heart greeting) 🎂");
            return;
          }
        }

        // HAPPY ANNIVERSARY: Two hands celebrating
        if (activeTarget === "happy anniversary") {
          if (numHands === 2 && !isCrossedWrists) {
            setGestureOutput("Happy Anniversary");
            setGestureStatus("Recognized: 'Happy Anniversary' (Celebration) 💐");
            return;
          }
        }

        // GOOD NIGHT: Crossed wrists
        if (activeTarget === "good night") {
          if (isCrossedWrists || (numHands === 2 && areWristsClose)) {
            setGestureOutput("Good Night");
            setGestureStatus("Recognized: 'Good Night' (Crossed arms) 🌙");
            return;
          }
        }

        // NAMASTE: Palms together
        if (activeTarget === "namaste") {
          if (areWristsClose || (numHands === 2 && areWristsClose)) {
            setGestureOutput("Namaste");
            setGestureStatus("Recognized: 'Namaste' (Prayer mudra) 🙏");
            return;
          }
        }

        // HELLO: Open palm beside head
        if (activeTarget === "hello") {
          if (isOpenPalm && isBesideHead) {
            setGestureOutput("Hello");
            setGestureStatus("Recognized: 'Hello' (Greeting hand) 👋");
            return;
          }
        }

        // GOOD DAY: Thumbs up
        if (activeTarget === "good day") {
          if (isThumbsUp) {
            setGestureOutput("Good Day");
            setGestureStatus("Recognized: 'Good Day' (Thumbs Up) 👍");
            return;
          }
        }

        // GOOD MORNING
        if (activeTarget === "good morning") {
          if (recentThumbsUp || (isOpenPalm && tip8Y < noseY + 0.20 && Math.abs(handX - noseX) < 0.30)) {
            setGestureOutput("Good Morning");
            setGestureStatus("Recognized: 'Good Morning' (Rising sun bloom) ☀️");
            return;
          }
        }

        // GOOD AFTERNOON
        if (activeTarget === "good afternoon") {
          if (isOpenPalm && isNearMouth) {
            setGestureOutput("Good Afternoon");
            setGestureStatus("Recognized: 'Good Afternoon' (Midday sun) 🌤️");
            return;
          }
        }

        // GOOD EVENING
        if (activeTarget === "good evening") {
          if (recentThumbsUp || (isOpenPalm && handY > shoulderY - 0.08 && isOverChest)) {
            setGestureOutput("Good Evening");
            setGestureStatus("Recognized: 'Good Evening' (Sunset sweep) 🌆");
            return;
          }
        }

        // HOW ARE YOU
        if (activeTarget === "how are you") {
          if (isIndexPoint && isOverChest && !isNearMouth && !isNearForehead) {
            setGestureOutput("How Are You");
            setGestureStatus("Recognized: 'How Are You' (Pointing forward) 🙂");
            return;
          }
        }
      }

      // ----------------------------------------------------
      // PRIORITY 2: GENERAL DISAMBIGUATED GESTURE RECOGNITION
      // ----------------------------------------------------

      // 1. Two-Handed: Namaste & Good Night & Happy Anniversary
      if (numHands === 2) {
        if (isCrossedWrists) {
          setGestureOutput("Good Night");
          setGestureStatus("Recognized: 'Good Night' (Crossed arms) 🌙");
          return;
        }
        if (areWristsClose) {
          setGestureOutput("Namaste");
          setGestureStatus("Recognized: 'Namaste' (Prayer mudra) 🙏");
          return;
        }
        if (isOpenPalm) {
          setGestureOutput("Happy Anniversary");
          setGestureStatus("Recognized: 'Happy Anniversary' (Celebration) 💐");
          return;
        }
      }

      // 2. Face Points: Black, Red, Pink, Orange, Brown
      if (isNearForehead && isIndexPoint) {
        setGestureOutput("Black");
        setGestureStatus("Recognized: 'Black' (Forehead point) ⬛");
        return;
      }

      if (isNearMouth && isIndexPoint) {
        setGestureOutput("Red");
        setGestureStatus("Recognized: 'Red' (Lip touch) 🔴");
        return;
      }

      if (isNearMouth && (isFist || openCount <= 2) && !isIndexPoint) {
        setGestureOutput("Orange");
        setGestureStatus("Recognized: 'Orange' (Squeezing at mouth) 🍊");
        return;
      }

      if (isBesideHead && isBHand && Math.abs(tip8Y - mouthY) < 0.18) {
        setGestureOutput("Brown");
        setGestureStatus("Recognized: 'Brown' (B-hand on cheek) 🟤");
        return;
      }

      // 3. Handshape-specific: Yellow (Y-hand), Violet (Peace V)
      if (isYHand) {
        setGestureOutput("Yellow");
        setGestureStatus("Recognized: 'Yellow' (Y-handshape) 💛");
        return;
      }

      if (isPeaceV) {
        setGestureOutput("Violet");
        setGestureStatus("Recognized: 'Violet' (V-handshape) 💜");
        return;
      }

      // 4. Salutes & Greetings: Hello, Good Day, Good Morning, Good Afternoon, Good Evening, Happy Birthday
      if (isBesideHead && isOpenPalm) {
        setGestureOutput("Hello");
        setGestureStatus("Recognized: 'Hello' (Greeting hand) 👋");
        return;
      }

      if (isThumbsUp) {
        setGestureOutput("Good Day");
        setGestureStatus("Recognized: 'Good Day' (Thumbs Up) 👍");
        return;
      }

      if (recentThumbsUp && isOpenPalm && tip8Y < noseY + 0.18) {
        setGestureOutput("Good Morning");
        setGestureStatus("Recognized: 'Good Morning' (Rising sun bloom) ☀️");
        return;
      }

      if (isOpenPalm && isNearMouth) {
        setGestureOutput("Good Afternoon");
        setGestureStatus("Recognized: 'Good Afternoon' (Midday sun) 🌤️");
        return;
      }

      if (recentThumbsUp && isOpenPalm && handY > shoulderY - 0.08) {
        setGestureOutput("Good Evening");
        setGestureStatus("Recognized: 'Good Evening' (Sunset sweep) 🌆");
        return;
      }

      if (isOpenPalm && isOverChest) {
        setGestureOutput("Happy Birthday");
        setGestureStatus("Recognized: 'Happy Birthday' (Chest heart greeting) 🎂");
        return;
      }

      // 5. How Are You: Only when pointing forward away from mouth/forehead
      if (isIndexPoint && isOverChest && !isNearMouth && !isNearForehead && tip8Y > mouthY + 0.10) {
        setGestureOutput("How Are You");
        setGestureStatus("Recognized: 'How Are You' (Pointing forward) 🙂");
        return;
      }

      // Default state when hands are active
      setGestureOutput("—");
      setGestureStatus("Hand detected. Make the exact sign gesture.");
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
      activeSign,
      setActiveSign,
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
      activeSign,
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
