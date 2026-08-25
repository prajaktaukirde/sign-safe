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
  "Good morning everyone, today we continue with photosynthesis.",
  "Chlorophyll absorbs light energy inside the chloroplast.",
  "Water is split into hydrogen and oxygen during the light reaction.",
  "The Calvin cycle then fixes carbon dioxide into glucose.",
  "Please note the equation written on the board carefully.",
];

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
  const [transcript, setTranscript] = useState(
    "Welcome to class. Today's topic is Photosynthesis.",
  );
  const [liveWords, setLiveWords] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [avatarSpeed, setAvatarSpeed] = useState(1);
  const [replayKey, setReplayKey] = useState(0);
  const [gestureStatus, setGestureStatus] = useState("Listening for ISL gestures…");
  const [gestureOutput, setGestureOutput] = useState("—");
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: uid(),
      student: "Rohan",
      desk: "Desk 3",
      text: "Please repeat the last step",
      time: now(),
      answered: false,
    },
  ]);
  const [emergency, setEmergency] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState("");
  const [safety, setSafetyState] = useState<SafetyStatus>("unknown");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const room = "Room 103";

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const addLog = useCallback((source: string, text: string) => {
    setLogs((l) => [{ id: uid(), source, text, time: now() }, ...l].slice(0, 40));
  }, []);

  const streamLine = useCallback(
    (line: string) => {
      setIsListening(true);
      const words = line.split(" ");
      setLiveWords("");
      words.forEach((w, i) => {
        later(() => {
          setLiveWords((prev) => (prev ? prev + " " + w : w));
          if (i === words.length - 1) {
            setTranscript(line);
            setLiveWords("");
            setIsListening(false);
            setReplayKey((k) => k + 1);
          }
        }, 180 * (i + 1));
      });
    },
    [later],
  );

  const simulateSpeech = useCallback(
    (line?: string) => {
      const pick = line ?? LECTURE_LINES[Math.floor(Math.random() * LECTURE_LINES.length)];
      streamLine(pick);
    },
    [streamLine],
  );

  const pushTeacherMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      setTranscript(text.trim());
      setReplayKey((k) => k + 1);
    },
    [],
  );

  const simulateGesture = useCallback(
    (text?: string) => {
      const pick = text ?? GESTURES[Math.floor(Math.random() * GESTURES.length)];
      setGestureStatus("Hand landmarks locked · decoding ISL…");
      setGestureOutput("…");
      later(() => {
        setGestureOutput(pick);
        setGestureStatus("Gesture recognised · 96% confidence");
      }, 900);
      later(() => setGestureStatus("Listening for ISL gestures…"), 4200);
    },
    [later],
  );

  const sendQuestion = useCallback((text: string) => {
    if (!text.trim() || text === "—") return;
    setQuestions((q) => [
      { id: uid(), student: "Aditi", desk: "Desk 7", text: text.trim(), time: now(), answered: false },
      ...q,
    ]);
  }, []);

  const markAnswered = useCallback((id: string, mode: "typed" | "vocal") => {
    setQuestions((q) => q.map((x) => (x.id === id ? { ...x, answered: true } : x)));
    void mode;
  }, []);

  const triggerEmergency = useCallback(
    (reason: string) => {
      setEmergency(true);
      setEmergencyReason(reason);
      setSafetyState("unknown");
      setLogs([]);
      addLog("System", `${reason} · evacuation protocol activated`);
      later(() => addLog("Security", "Alarm verified. Wing B corridor cleared."), 2200);
      later(() => addLog("Fire Marshal", "Nearest safe exit: East Stairwell (Exit B)."), 4600);
    },
    [addLog, later],
  );

  const clearEmergency = useCallback(() => {
    setEmergency(false);
    setEmergencyReason("");
  }, []);

  const setSafety = useCallback(
    (s: SafetyStatus) => {
      setSafetyState(s);
      if (s === "ok") {
        addLog("You", "Marked status: I AM OK");
        later(() => addLog("Security", "Status logged. Proceed to Exit B calmly."), 1400);
      }
      if (s === "help") {
        addLog("You", "Distress alert sent: I NEED HELP");
        later(() => addLog("Security", "Responder en route to Room 103 (ETA 90s)."), 1600);
      }
      if (s === "trapped") {
        addLog("You", "CRITICAL: I AM TRAPPED in Room 103");
        later(() => addLog("Security", "Rescue team dispatched to Room 103."), 1500);
        later(() => addLog("Fire Marshal", "Stay low. Team breaching corridor door now."), 3600);
      }
    },
    [addLog, later],
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
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDemo must be used inside DemoProvider");
  return ctx;
}
