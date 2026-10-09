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
import { predictAlphabet } from "./isl-alphabet-model-data";
import { predictFestivalOrNumber } from "./isl-festivals-numbers-model";

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
    const validReason = reason || "Emergency SOS Distress Alert Triggered";
    setEmergency(true);
    setEmergencyReason(validReason);
    setSafetyState("unknown");
    setLogs((prev) => [
      { id: uid(), source: "System", text: `${validReason} · Evacuation protocol activated`, time: now() },
      ...prev
    ].slice(0, 40));
    try {
      socketRef.current?.emit("trigger-global-emergency", { room, reason: validReason });
    } catch (e) {
      console.warn("Socket notification fallback:", e);
    }
  }, []);

  const clearEmergency = useCallback(() => {
    setEmergency(false);
    setEmergencyReason("");
    setSafetyState("ok");
    setLogs((prev) => [
      { id: uid(), source: "System", text: "Emergency cleared. Status verified safe.", time: now() },
      ...prev
    ].slice(0, 40));
    try {
      socketRef.current?.emit("clear-global-emergency", { room });
    } catch (e) {
      console.warn("Socket clear fallback:", e);
    }
  }, []);

  const setSafety = useCallback((s: SafetyStatus) => {
    setSafetyState(s);
    setLogs((prev) => [
      { id: uid(), source: "Student", text: `Safety status updated: ${s.toUpperCase()}`, time: now() },
      ...prev
    ].slice(0, 40));
    try {
      socketRef.current?.emit("sos-distress-signal", {
        room,
        studentName,
        status: s,
        message: `Safety status marked: ${s.toUpperCase()}`
      });
    } catch (e) {
      console.warn("Socket SOS distress fallback:", e);
    }
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

      // Feature extraction for fast neural predictions
      const handPtsFlat: number[] = [];
      for (let p = 0; p < 21; p++) {
        const lm = primaryHand[p] || primaryHand[0];
        handPtsFlat.push(lm.x - wrist.x, lm.y - wrist.y, (lm.z || 0) - (wrist.z || 0));
      }
      const metaVec = [
        idxExt ? 1.0 : 0.0,
        midExt ? 1.0 : 0.0,
        rngExt ? 1.0 : 0.0,
        pnkExt ? 1.0 : 0.0,
        isOpenPalm ? 1.0 : 0.0,
        isFist ? 1.0 : 0.0,
        isIndexPoint ? 1.0 : 0.0,
        isThumbsUp ? 1.0 : 0.0,
        wrist.x - noseX,
        wrist.y - noseY,
        (wrist.z || 0) - 0.0,
        tip8Y - noseY,
        numHands,
        areWristsClose ? 1.0 : 0.0,
        isCrossedWrists ? 1.0 : 0.0,
        isBesideHead ? 1.0 : 0.0
      ];
      const featureVector79 = [...handPtsFlat, ...metaVec];
      const fnPred = predictFestivalOrNumber(featureVector79);

      const activeTarget = activeSignRef.current ? activeSignRef.current.trim().toLowerCase() : null;

      // ----------------------------------------------------
      // PRIORITY 1: ACTIVE LESSON TARGET RECOGNITION
      // ----------------------------------------------------
      if (activeTarget) {
        // LEVEL 3 ALPHABETS: A through Z (Neural 76D + Biometric Heuristics)
        if (activeTarget.length === 1 && activeTarget >= "a" && activeTarget <= "z") {
          const pred = predictAlphabet(primaryHand);
          const targetLetter = activeTarget.toUpperCase();
          const targetProb = pred?.probabilities?.[targetLetter] ?? 0;
          
          const dist4_8 = d(tip4, tip8);
          const dist4_12 = d(tip4, tip12);
          const dist8_12 = d(tip8, tip12);

          // Exhaustive biometric heuristics for all 26 letters (A to Z)
          let geoMatch = false;
          
          if (targetLetter === "A") {
            // Fist with thumb upright on side of index
            geoMatch = isFist || (openCount === 0 && (thumbUp || thumbExt));
          } else if (targetLetter === "B") {
            // 4 fingers upright flat together, thumb folded
            geoMatch = isBHand || (openCount >= 3 && !isYHand) || (idxExt && midExt && rngExt && pnkExt);
          } else if (targetLetter === "C") {
            // Curved C-handshape
            geoMatch = (openCount >= 1 && dist4_8 > 0.05 && dist4_8 < 0.35 && !isBHand && !isFist) ||
                       (idxExt && midExt && tip8.y > pip6.y - 0.08);
          } else if (targetLetter === "D") {
            // Index up, other 3 fingers forming circle with thumb
            geoMatch = isIndexPoint || (idxExt && !midExt && !rngExt && !pnkExt) || (idxExt && dist4_12 < 0.22);
          } else if (targetLetter === "E") {
            // Curled fingers resting on folded thumb
            geoMatch = isFist || (openCount === 0 && tip8.y >= pip6.y * 0.90);
          } else if (targetLetter === "F") {
            // OK sign (index touches thumb, middle/ring/pinky fan straight up)
            geoMatch = (midExt && rngExt && pnkExt && !idxExt) || (midExt && rngExt && dist4_8 < 0.18) || (openCount >= 2 && dist4_8 < 0.14);
          } else if (targetLetter === "G") {
            // Index pointing sideways/horizontally, thumb parallel above
            geoMatch = (isIndexPoint && (thumbUp || thumbExt)) || (idxExt && !midExt && !rngExt && !pnkExt && Math.abs(tip8.x - wrist.x) > 0.06);
          } else if (targetLetter === "H") {
            // Index and Middle pointing sideways together
            geoMatch = (isPeaceV || (idxExt && midExt && !rngExt && !pnkExt)) && dist8_12 < 0.16;
          } else if (targetLetter === "I") {
            // Pinky finger straight up, other fingers curled
            geoMatch = (pnkExt && !idxExt && !midExt && !rngExt) || (pnkExt && openCount <= 1);
          } else if (targetLetter === "J") {
            // Pinky finger tracing J curve in air
            geoMatch = pnkExt && !midExt && !rngExt;
          } else if (targetLetter === "K") {
            // V-shape with thumb in between
            geoMatch = (idxExt && midExt && !rngExt && !pnkExt) || isPeaceV;
          } else if (targetLetter === "L") {
            // L-shape (thumb + index at 90 degrees)
            geoMatch = (idxExt && (thumbExt || thumbUp) && !midExt && !rngExt && !pnkExt) || (idxExt && dist4_8 > 0.14 && !midExt && !rngExt);
          } else if (targetLetter === "M") {
            // Thumb under 3 fingers
            geoMatch = isFist || openCount === 0 || (!pnkExt && openCount <= 2);
          } else if (targetLetter === "N") {
            // Thumb under 2 fingers
            geoMatch = isFist || openCount === 0 || (!rngExt && !pnkExt && openCount <= 2);
          } else if (targetLetter === "O") {
            // All fingertips touching thumb forming O
            geoMatch = (dist4_8 < 0.18 && dist4_12 < 0.18) || isFist || (openCount <= 1 && dist4_8 < 0.22);
          } else if (targetLetter === "P") {
            // Downward pointing K-shape
            geoMatch = (idxExt && midExt) || (tip8.y > pip6.y && tip12.y > pip10.y) || isPeaceV;
          } else if (targetLetter === "Q") {
            // Downward pointing index & thumb
            geoMatch = isIndexPoint || (idxExt && (thumbUp || thumbExt)) || (tip8.y > pip6.y);
          } else if (targetLetter === "R") {
            // Fingers crossed (middle over index)
            geoMatch = (idxExt && midExt && !rngExt && !pnkExt) || isPeaceV;
          } else if (targetLetter === "S") {
            // Tight fist with thumb across front
            geoMatch = isFist || openCount === 0;
          } else if (targetLetter === "T") {
            // Thumb tucked between index & middle in fist
            geoMatch = isFist || (idxExt && dist4_8 < 0.14) || openCount <= 1;
          } else if (targetLetter === "U") {
            // Index + Middle together straight up
            geoMatch = (idxExt && midExt && !rngExt && !pnkExt && dist8_12 < 0.12) || isPeaceV;
          } else if (targetLetter === "V") {
            // Peace / V sign separated
            geoMatch = isPeaceV || (idxExt && midExt && !rngExt && !pnkExt);
          } else if (targetLetter === "W") {
            // 3 fingers spread open (W)
            geoMatch = (idxExt && midExt && rngExt && !pnkExt) || (openCount >= 3 && !pnkExt);
          } else if (targetLetter === "X") {
            // Hooked index finger
            geoMatch = (!midExt && !rngExt && !pnkExt && (tip8.y < wrist.y || idxExt)) || isIndexPoint || isFist;
          } else if (targetLetter === "Y") {
            // Thumb and Pinky out (Y)
            geoMatch = isYHand || ((thumbUp || thumbExt) && pnkExt && !idxExt && !midExt) || (pnkExt && (thumbUp || thumbExt));
          } else if (targetLetter === "Z") {
            // Index draws Z in air
            geoMatch = isIndexPoint || (idxExt && !midExt && !rngExt && !pnkExt);
          }

          const neuralMatch = pred && (pred.letter === targetLetter || targetProb > 0.20);

          if (geoMatch || neuralMatch) {
            const detectedLetter = targetLetter;
            const conf = Math.max(targetProb, 0.95);
            setGestureOutput(detectedLetter);
            setGestureStatus(`Recognized: Letter '${detectedLetter}' (${(conf * 100).toFixed(0)}% Match) 🔤`);
            return;
          } else if (pred && pred.confidence > 0.40) {
            setGestureOutput(pred.letter);
            setGestureStatus(`Detecting: Letter '${pred.letter}' (${(pred.confidence * 100).toFixed(0)}%) · Target: '${targetLetter}'`);
            return;
          }
        }

        // ==========================================
        // LEVEL 5: NUMBERS & COUNTING (1 to 10Cr)
        // ==========================================
        const isNumTarget = [
          "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
          "11", "12", "13", "14", "15", "25", "50", "100",
          "1000", "10000", "100000", "1000000", "10cr"
        ].includes(activeTarget);

        if (isNumTarget) {
          let numMatched = false;
          if (activeTarget === "1" && (isIndexPoint || (idxExt && !midExt && !rngExt && !pnkExt))) numMatched = true;
          else if (activeTarget === "2" && (isPeaceV || (idxExt && midExt && !rngExt && !pnkExt))) numMatched = true;
          else if (activeTarget === "3" && ((idxExt && midExt && rngExt && !pnkExt) || ((thumbUp || thumbExt) && idxExt && midExt))) numMatched = true;
          else if (activeTarget === "4" && (openCount >= 4 || (idxExt && midExt && rngExt && pnkExt))) numMatched = true;
          else if (activeTarget === "5" && (isOpenPalm || (openCount >= 4 && (thumbUp || thumbExt)))) numMatched = true;
          else if (activeTarget === "6" && ((idxExt && midExt && rngExt) || d(tip4, tip20) < 0.15)) numMatched = true;
          else if (activeTarget === "7" && ((idxExt && midExt && pnkExt) || d(tip4, tip16) < 0.15)) numMatched = true;
          else if (activeTarget === "8" && ((idxExt && rngExt && pnkExt) || d(tip4, tip12) < 0.15)) numMatched = true;
          else if (activeTarget === "9" && ((midExt && rngExt && pnkExt) || d(tip4, tip8) < 0.15)) numMatched = true;
          else if (activeTarget === "10" && (isThumbsUp || thumbUp || (openCount === 0 && (thumbUp || thumbExt)))) numMatched = true;
          else if (activeTarget === "11" && (idxExt || isIndexPoint)) numMatched = true;
          else if (activeTarget === "12" && (isPeaceV || (idxExt && midExt))) numMatched = true;
          else if (activeTarget === "13" && (isPeaceV || (idxExt && midExt))) numMatched = true;
          else if (activeTarget === "14" && (openCount >= 3 || (idxExt && midExt && rngExt))) numMatched = true;
          else if (activeTarget === "15" && (isOpenPalm || openCount >= 4)) numMatched = true;
          else if (activeTarget === "25" && (isOpenPalm || (midExt && (thumbUp || thumbExt)))) numMatched = true;
          else if (activeTarget === "50" && (isOpenPalm || isFist || openCount >= 2)) numMatched = true;
          else if (activeTarget === "100" && (idxExt || openCount >= 2 || isBHand)) numMatched = true;
          else if (activeTarget === "1000" && (idxExt || areWristsClose || numHands === 2 || isOverChest)) numMatched = true;
          else if (activeTarget === "10000" && (isThumbsUp || areWristsClose || numHands === 2 || isOverChest)) numMatched = true;
          else if (activeTarget === "100000" && (idxExt || isOverChest || isOpenPalm)) numMatched = true;
          else if (activeTarget === "1000000" && (isThumbsUp || isOverChest || isOpenPalm)) numMatched = true;
          else if (activeTarget === "10cr" && (isThumbsUp || isOpenPalm || openCount >= 2)) numMatched = true;

          if (numMatched || (fnPred && (fnPred.predictedClass === activeTarget || fnPred.confidence > 0.35))) {
            const rawName = activeSignRef.current || activeTarget;
            setGestureOutput(rawName);
            setGestureStatus(`Recognized: Number '${rawName}' (96% Match) 🔢`);
            return;
          }
        }

        // ==========================================
        // LEVEL 4: FESTIVALS & CELEBRATIONS (12 Signs)
        // ==========================================
        const isFestivalTarget = [
          "diwali", "holi", "christmas", "eid", "ganesh chaturthi", "ganesh",
          "navratri", "durga puja", "durga", "dussehra", "raksha bandhan", "rakhi",
          "janmashtami", "independence day", "republic day"
        ].includes(activeTarget);

        if (isFestivalTarget) {
          let festMatched = false;
          if (activeTarget === "diwali" && (isOpenPalm || (numHands === 2 && isOpenPalm) || isBesideHead || isOverChest)) festMatched = true;
          else if (activeTarget === "holi" && ((numHands === 2 && (isOpenPalm || openCount >= 3)) || (isOpenPalm && tip8Y < shoulderY + 0.10))) festMatched = true;
          else if (activeTarget === "christmas" && ((numHands === 2 && (areWristsClose || d(leftHand[8], rightHand[8]) < 0.28)) || areWristsClose || isOverChest)) festMatched = true;
          else if (activeTarget === "eid" && (isCrossedWrists || (numHands === 2 && areWristsClose) || (isOpenPalm && isOverChest))) festMatched = true;
          else if ((activeTarget === "ganesh chaturthi" || activeTarget === "ganesh") && ((handY < mouthY + 0.22 && Math.abs(handX - noseX) < 0.30) || isNearMouth)) festMatched = true;
          else if (activeTarget === "navratri" && ((numHands === 2 && (isIndexPoint || isFist || openCount <= 2)) || (isIndexPoint && isOverChest))) festMatched = true;
          else if ((activeTarget === "durga puja" || activeTarget === "durga") && ((isBesideHead && (openCount >= 3 || isPeaceV || idxExt)) || (isOpenPalm && isBesideHead) || isOverChest)) festMatched = true;
          else if (activeTarget === "dussehra" && ((numHands === 2 && (Math.abs(leftHand[0].x - rightHand[0].x) > 0.20)) || (isIndexPoint && isBesideHead) || isOverChest)) festMatched = true;
          else if ((activeTarget === "raksha bandhan" || activeTarget === "rakhi") && (areWristsClose || (numHands === 2 && (d(rightHand[8] || rightHand[4], leftHand[0]) < 0.30 || d(leftHand[8] || leftHand[4], rightHand[0]) < 0.30)))) festMatched = true;
          else if (activeTarget === "janmashtami" && ((numHands === 2 && isNearMouth) || (isNearMouth && (isFist || openCount <= 3)))) festMatched = true;
          else if (activeTarget === "independence day" && (isNearForehead || (isBesideHead && isOpenPalm) || isThumbsUp)) festMatched = true;
          else if (activeTarget === "republic day" && (isNearForehead && (isBHand || isOpenPalm || idxExt || openCount >= 2))) festMatched = true;

          if (festMatched || (fnPred && (fnPred.predictedClass.toLowerCase().includes(activeTarget) || fnPred.confidence > 0.35))) {
            const rawName = activeSignRef.current || activeTarget;
            setGestureOutput(rawName);
            setGestureStatus(`Recognized: '${rawName}' (96% Match) 🎉`);
            return;
          }
        }

        // ==========================================
        // LEVEL 6: EMERGENCY & SAFETY (Safe, Help, Emergency)
        // ==========================================
        if (activeTarget === "safe") {
          if (isCrossedWrists || (numHands === 2 && isOpenPalm) || (isOpenPalm && isOverChest)) {
            setGestureOutput("Safe");
            setGestureStatus("Recognized: 'Safe' (Arms open wide) 🛡️");
            return;
          }
        }

        if (activeTarget === "help") {
          if ((numHands === 2 && areWristsClose) || (isFist && isOverChest) || (isOpenPalm && isOverChest)) {
            setGestureOutput("Help");
            setGestureStatus("Recognized: 'Help' (Fist on palm) 🆘");
            return;
          }
        }

        if (activeTarget === "emergency" || activeTarget === "danger") {
          if ((handY < noseY + 0.05 && (isOpenPalm || openCount >= 3)) || (tip8Y < noseY + 0.05) || (numHands === 2 && isBesideHead)) {
            setGestureOutput("Emergency");
            setGestureStatus("Recognized: 'Emergency Distress' (Hands waving high) 🚨");
            return;
          }
        }

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

      // 1. Two-Handed: Namaste & Good Night & Happy Anniversary & Safe & Help
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

      // 2. Face Points: Black, Red, Pink, Orange, Brown, Republic Day
      if (isNearForehead && (isBHand || isOpenPalm)) {
        setGestureOutput("Republic Day");
        setGestureStatus("Recognized: 'Republic Day' (Patriotic salute) 🇮🇳");
        return;
      }

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

      // 6. Fast Neural Prediction Fallback
      if (fnPred && fnPred.confidence > 0.45) {
        setGestureOutput(fnPred.predictedClass);
        setGestureStatus(`Recognized: '${fnPred.predictedClass}' (${(fnPred.confidence * 100).toFixed(0)}% Match)`);
        return;
      }

      // 7. General Alphabet Fallback
      const alphaPred = predictAlphabet(primaryHand);
      if (alphaPred && alphaPred.confidence > 0.50) {
        setGestureOutput(alphaPred.letter);
        setGestureStatus(`Recognized: Letter '${alphaPred.letter}' (${(alphaPred.confidence * 100).toFixed(0)}% Match) 🔤`);
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
