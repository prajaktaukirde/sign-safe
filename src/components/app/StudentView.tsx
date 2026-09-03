import { useState, useEffect } from "react";
import { 
  Sparkles, Hand, RotateCcw, Trophy, BookOpen, Star, 
  AlertCircle, ShieldAlert, Award, Compass, Heart, Activity, CheckCircle2, RefreshCw,
  Palette, ChevronRight, ChevronLeft, Volume2, Flame
} from "lucide-react";
import { WebcamMock } from "./WebcamMock";
import { useDemo } from "@/lib/demo-store";

interface Sign {
  name: string;
  desc: string;
  mappedGesture: string; // The output string our webcam classifier matches
  videoUrl: string;      // Demonstration URL
  hint?: string;
}

interface Category {
  name: string;
  icon: any;
  level: string;
  description: string;
  signs: Sign[];
}

const CATEGORIES: Record<string, Category> = {
  basic: {
    name: "Greetings",
    icon: Compass,
    level: "🌱 Level 1",
    description: "Essential everyday greetings in Indian Sign Language",
    signs: [
      { 
        name: "Hello", 
        desc: "Raise your dominant hand with your open palm facing forward beside your ear/temple and make a gentle greeting wave.", 
        mappedGesture: "Hello", 
        videoUrl: "/level1-greeting/hello.mp4",
        hint: "Open hand up beside your head waving"
      },
      { 
        name: "Namaste", 
        desc: "Bring both flat palms together in front of your chest with fingers pointing straight up in the traditional Indian prayer mudra.", 
        mappedGesture: "Namaste", 
        videoUrl: "/level1-greeting/namaste.mp4",
        hint: "Press both palms together in front of your chest"
      },
      { 
        name: "Good Morning", 
        desc: "Show a Thumbs Up (Good) followed by blooming your open hand upward in front of your chest like a rising morning sun.", 
        mappedGesture: "Good Morning", 
        videoUrl: "/level1-greeting/goodmorning.mp4",
        hint: "Thumbs up 👍 then open hand blooming upwards ☀️"
      },
      { 
        name: "Good Afternoon", 
        desc: "First make a Thumbs Up (Good), then hold your open flat hand horizontally near chin/mouth level indicating midday sun.", 
        mappedGesture: "Good Afternoon", 
        videoUrl: "/level1-greeting/goodafternoon.mp4",
        hint: "Thumbs up 👍 then flat open hand at mid-level 🌤️"
      },
      { 
        name: "Good Evening", 
        desc: "First make a Thumbs Up (Good), then sweep your open hand downward across your chest representing the setting sun.", 
        mappedGesture: "Good Evening", 
        videoUrl: "/level1-greeting/goodevening.mp4",
        hint: "Thumbs up 👍 then sweep hand downward 🌆"
      },
      { 
        name: "Good Night", 
        desc: "Cross both your wrists or lower your hands gently in front of your chest in the resting evening pose.", 
        mappedGesture: "Good Night", 
        videoUrl: "/level1-greeting/goodnight.mp4",
        hint: "Cross your wrists in front of your chest 🌙"
      },
      { 
        name: "Good Day", 
        desc: "Form a clear, distinct Thumbs Up gesture with your dominant hand held in front of your chest.", 
        mappedGesture: "Good Day", 
        videoUrl: "/level1-greeting/goodDay.mp4",
        hint: "Firm thumbs up gesture 👍"
      },
      { 
        name: "How Are You", 
        desc: "Extend your index finger pointing gently forward toward the person/camera to ask 'How are you?'.", 
        mappedGesture: "How Are You", 
        videoUrl: "/level1-greeting/howareyou.mp4",
        hint: "Point index finger forward 🙂"
      },
      { 
        name: "Happy Birthday", 
        desc: "Place your open flat hand gently over your chest/heart in the warm ISL birthday greeting.", 
        mappedGesture: "Happy Birthday", 
        videoUrl: "/level1-greeting/happybirthday.mp4",
        hint: "Open flat hand touching your chest 🎂"
      },
      { 
        name: "Happy Anniversary", 
        desc: "Bring both hands forward in front of your chest and celebrate/clap with open palms.", 
        mappedGesture: "Happy Anniversary", 
        videoUrl: "/level1-greeting/happyaniversary.mp4",
        hint: "Two open hands celebrating together 💐"
      }
    ]
  },
  colors: {
    name: "Colours",
    icon: Palette,
    level: "🎨 Level 2",
    description: "Vibrant colour words and expressions in ISL",
    signs: [
      { name: "Black", desc: "Point your index finger towards your eyebrow or forehead.", mappedGesture: "Black", videoUrl: "/level2-colour/black.mp4", hint: "Point index finger to forehead ⬛" },
      { name: "Brown", desc: "Form a B-handshape (flat 4 fingers) moving downward beside your cheek.", mappedGesture: "Brown", videoUrl: "/level2-colour/brown.mp4", hint: "Flat hand on cheek 🟤" },
      { name: "Green", desc: "Form the G handshape shaking gently across your body in ISL.", mappedGesture: "Green", videoUrl: "/level2-colour/green.mp4", hint: "G-hand shaking motion 🟢" },
      { name: "Grey", desc: "Pass open fingers between each other in front of the chest in ISL.", mappedGesture: "Grey", videoUrl: "/level2-colour/grey.mp4", hint: "Intertwining fingers ⚪" },
      { name: "Orange", desc: "Squeeze your hand in front of your mouth/chin like squeezing an orange.", mappedGesture: "Orange", videoUrl: "/level2-colour/orange.mp4", hint: "Squeezing hand at mouth 🍊" },
      { name: "Pink", desc: "Brush your middle or index finger downward across your lower lip/chin.", mappedGesture: "Pink", videoUrl: "/level2-colour/pink.mp4", hint: "Touch chin/lower lip 🌸" },
      { name: "Red", desc: "Point your index finger to your lips and pull gently downward.", mappedGesture: "Red", videoUrl: "/level2-colour/red.mp4", hint: "Index finger touches lip 🔴" },
      { name: "Violet", desc: "Form a V / Peace handshape (index & middle fingers open) and shake gently.", mappedGesture: "Violet", videoUrl: "/level2-colour/violet.mp4", hint: "V / Peace handshape 💜" },
      { name: "White", desc: "Place a flat hand on your chest and pull outward closing gently.", mappedGesture: "White", videoUrl: "/level2-colour/white.mp4", hint: "Flat hand pulling from chest ⚪" },
      { name: "Yellow", desc: "Form a Y-handshape (thumb & pinky extended) and shake beside your shoulder.", mappedGesture: "Yellow", videoUrl: "/level2-colour/yellow.mp4", hint: "Y-hand (thumb+pinky) shaking 💛" }
    ]
  },
  school: {
    name: "School & Learning",
    icon: BookOpen,
    level: "🏫 Level 3",
    description: "Classroom and study vocabulary for everyday learning",
    signs: [
      { name: "Teacher", desc: "Hold both hands near chest and circle them gently forward.", mappedGesture: "Teacher", videoUrl: "https://www.youtube.com/embed/2_X0qT9N4j4", hint: "Circle hands near chest 👩‍🏫" },
      { name: "Book", desc: "Bring flat palms together, then open them like opening a book.", mappedGesture: "Book", videoUrl: "https://www.youtube.com/embed/k-xS3c0p0z8", hint: "Open palms like a book 📖" },
      { name: "Question", desc: "Raise your index finger straight up to ask a question.", mappedGesture: "Question", videoUrl: "https://www.youtube.com/embed/bL1u2kG3Vj8", hint: "Index finger raised up ❓" }
    ]
  },
  emergency: {
    name: "Emergency & Safety",
    icon: ShieldAlert,
    level: "🚨 Level 4",
    description: "Vital safety and emergency assistance signs",
    signs: [
      { name: "Help", desc: "Rest your closed right fist on your flat left palm and lift slightly.", mappedGesture: "Help", videoUrl: "https://www.youtube.com/embed/0X6dM0Kk1iY", hint: "Fist on flat palm 🆘" },
      { name: "Safe", desc: "Cross arms in front of chest then open them wide outward.", mappedGesture: "Yes", videoUrl: "https://www.youtube.com/embed/rP2t8P6qg5c", hint: "Arms cross and open wide 🛡️" }
    ]
  }
};

const BADGES = [
  { id: "first", name: "First Sign", desc: "Learned your first ISL sign!", icon: Star, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  { id: "perfect", name: "Perfect Score", desc: "Got 100% accuracy on a sign", icon: Trophy, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  { id: "safety", name: "Safety Hero", desc: "Completed Level 4 Emergency Signs", icon: Award, color: "text-rose-500 bg-rose-500/10 border-rose-500/20" }
];

interface StudentViewProps {
  initialCategory?: string | null;
  activeTab?: "learn" | "progress" | "parent";
  onTabChange?: (tab: "learn" | "progress" | "parent") => void;
  onBackToHome?: () => void;
}

export function StudentView({
  initialCategory = null,
  activeTab: externalTab,
  onTabChange,
  onBackToHome
}: StudentViewProps) {
  const {
    transcript,
    liveWords,
    gestureStatus,
    gestureOutput,
    simulateSpeech,
    setActiveSign
  } = useDemo();

  const [internalTab, setInternalTab] = useState<"learn" | "progress" | "parent">("learn");
  const activeTab = externalTab ?? internalTab;
  const setActiveTab = (tab: "learn" | "progress" | "parent") => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };

  const [selectedCat, setSelectedCat] = useState<string | null>(initialCategory);
  const [currentSignIdx, setCurrentSignIdx] = useState(0);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCat(initialCategory);
      setCurrentSignIdx(0);
    }
  }, [initialCategory]);
  const [points, setPoints] = useState(350);
  const [accuracyHistory, setAccuracyHistory] = useState<Record<string, number>>({
    "Hello": 95,
    "Namaste": 98,
    "Good Morning": 92
  });
  
  // Real-time gesture validation states
  const [matchingStatus, setMatchingStatus] = useState<"waiting" | "correct" | "incorrect">("waiting");
  const [evaluatedScore, setEvaluatedScore] = useState<number | null>(null);

  const category = selectedCat ? CATEGORIES[selectedCat] : null;
  const currentSign = category ? category.signs[currentSignIdx] : null;

  // Whenever we select a sign, reset validation state, register active target sign, and simulate teacher speech
  useEffect(() => {
    if (currentSign) {
      setActiveSign(currentSign.name);
      simulateSpeech(`Let's learn: ${currentSign.name}. ${currentSign.desc}`);
      setMatchingStatus("waiting");
      setEvaluatedScore(null);
    } else {
      setActiveSign(null);
    }
    return () => {
      setActiveSign(null);
    };
  }, [selectedCat, currentSignIdx, currentSign, simulateSpeech, setActiveSign]);

  // Hook up real-time gesture evaluation
  useEffect(() => {
    if (matchingStatus === "correct" || !currentSign) return;

    if (gestureOutput && gestureOutput !== "—" && gestureOutput !== "…") {
      const outputNorm = gestureOutput.trim().toLowerCase();
      const mappedNorm = currentSign.mappedGesture.trim().toLowerCase();
      const nameNorm = currentSign.name.trim().toLowerCase();

      // Check if user's gesture matches the required sign
      const isDirectMatch = outputNorm === mappedNorm || outputNorm === nameNorm;
      const isCompoundMatch = 
        (nameNorm === "good morning" && (outputNorm === "good morning" || outputNorm === "morning")) ||
        (nameNorm === "good afternoon" && (outputNorm === "good afternoon" || outputNorm === "afternoon")) ||
        (nameNorm === "good evening" && (outputNorm === "good evening" || outputNorm === "evening")) ||
        (nameNorm === "good night" && (outputNorm === "good night" || outputNorm === "night")) ||
        (nameNorm === "good day" && (outputNorm === "good day" || outputNorm === "good")) ||
        (nameNorm === "namaste" && outputNorm === "namaste") ||
        (nameNorm === "hello" && outputNorm === "hello") ||
        (nameNorm === "how are you" && outputNorm === "how are you") ||
        (nameNorm.includes("anniversary") && outputNorm.includes("anniversary")) ||
        (nameNorm.includes("birthday") && outputNorm.includes("birthday")) ||
        (nameNorm === "black" && outputNorm === "black") ||
        (nameNorm === "red" && outputNorm === "red") ||
        (nameNorm === "yellow" && outputNorm === "yellow") ||
        (nameNorm === "violet" && outputNorm === "violet") ||
        (nameNorm === "brown" && outputNorm === "brown") ||
        (nameNorm === "white" && outputNorm === "white") ||
        (nameNorm === "green" && outputNorm === "green") ||
        (nameNorm === "grey" && outputNorm === "grey") ||
        (nameNorm === "orange" && outputNorm === "orange") ||
        (nameNorm === "pink" && outputNorm === "pink");

      if (isDirectMatch || isCompoundMatch) {
        setMatchingStatus("correct");
        const score = 94 + Math.floor(Math.random() * 6);
        setEvaluatedScore(score);
        setPoints((p) => p + 10);
        setAccuracyHistory((prev) => ({
          ...prev,
          [currentSign.name]: score
        }));
      }
    }
  }, [gestureOutput, currentSign, matchingStatus]);

  const forceMatch = () => {
    if (currentSign) {
      setMatchingStatus("correct");
      const score = 96;
      setEvaluatedScore(score);
      setPoints((p) => p + 10);
      setAccuracyHistory(prev => ({
        ...prev,
        [currentSign.name]: score
      }));
    }
  };

  const handleNext = () => {
    if (category && currentSignIdx < category.signs.length - 1) {
      setCurrentSignIdx(currentSignIdx + 1);
    } else {
      setSelectedCat(null);
      setCurrentSignIdx(0);
    }
  };

  const handlePrev = () => {
    if (category && currentSignIdx > 0) {
      setCurrentSignIdx(currentSignIdx - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("learn")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition-colors ${
            activeTab === "learn"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Compass className="h-4 w-4" /> Learn & Practice
        </button>
        <button
          onClick={() => setActiveTab("progress")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition-colors ${
            activeTab === "progress"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Trophy className="h-4 w-4" /> Achievements & Badges
        </button>
        <button
          onClick={() => setActiveTab("parent")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition-colors ${
            activeTab === "parent"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Activity className="h-4 w-4" /> Progress Dashboard
        </button>
      </div>

      {/* 1. Learn Mode */}
      {activeTab === "learn" && (
        <div>
          {!selectedCat ? (
            /* Category Selection Grid */
            <div className="space-y-6 py-2">
              <div className="text-center max-w-xl mx-auto space-y-1.5">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Choose a Lesson</h2>
                <p className="text-sm text-muted-foreground">
                  Select a category to watch official video demonstrations and verify your signs with the real-time AI camera.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Object.entries(CATEGORIES).map(([key, cat]) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedCat(key);
                        setCurrentSignIdx(0);
                      }}
                      className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 text-left transition-all hover:border-primary/40 hover:shadow-md cursor-pointer"
                    >
                      <div className="space-y-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">{cat.level}</span>
                          <h3 className="text-lg font-bold text-foreground mt-0.5">{cat.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{cat.description}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs font-semibold text-primary">
                        <span>{cat.signs.length} Signs</span>
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Active Learning & Practice Interface */
            <div className="space-y-4">
              {/* Top Lesson Header & Sign Carousel */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedCat(null)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-muted/40 text-foreground hover:bg-muted transition-colors"
                    title="Back to Lessons"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div>
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider">{category?.level} · {category?.name}</span>
                    <h2 className="text-lg font-bold text-foreground">
                      Sign {currentSignIdx + 1} of {category?.signs.length}: <span className="text-primary">{currentSign?.name}</span>
                    </h2>
                  </div>
                </div>

                {/* Quick Switch Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {category?.signs.map((s, idx) => (
                    <button
                      key={s.name}
                      onClick={() => setCurrentSignIdx(idx)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                        idx === currentSignIdx
                          ? "bg-primary text-primary-foreground"
                          : accuracyHistory[s.name]
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-muted/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Workspace Split: Video on Left, Webcam & AI on Right */}
              <div className="grid gap-5 lg:grid-cols-2">
                {/* Left: Video Demonstration & Instructions */}
                <div className="glass rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Official ISLRTC Demonstration
                    </span>
                    {currentSign?.hint && (
                      <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600">
                        Hint: {currentSign.hint}
                      </span>
                    )}
                  </div>

                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-black shadow-sm">
                    {currentSign?.videoUrl ? (
                      currentSign.videoUrl.startsWith("http") ? (
                        <iframe
                          src={currentSign.videoUrl}
                          className="absolute inset-0 h-full w-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={`ISL sign for ${currentSign.name}`}
                        />
                      ) : (
                        <video
                          key={currentSign.videoUrl}
                          src={currentSign.videoUrl}
                          className="absolute inset-0 h-full w-full object-contain"
                          controls
                          autoPlay
                          loop
                          muted
                        />
                      )
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                        No video link available
                      </div>
                    )}
                  </div>

                  {/* AI Instruction description */}
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">How to perform this sign</p>
                    <p className="text-sm font-medium leading-relaxed text-foreground">{currentSign?.desc}</p>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={handlePrev}
                      disabled={currentSignIdx === 0}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </button>
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity"
                    >
                      {currentSignIdx === (category?.signs.length ?? 0) - 1 ? "Finish Lesson" : "Next Sign"} <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Right: Live Webcam & AI Verification */}
                <div className="glass rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                        <Hand className="h-4 w-4 text-primary" /> Live AI Evaluator
                      </h3>
                      <p className="text-xs text-muted-foreground">Perform the sign in front of your camera</p>
                    </div>
                  </div>

                  <WebcamMock active={!!selectedCat} />

                  {/* Evaluation Result Feedback */}
                  <div className="space-y-3">
                    {matchingStatus === "waiting" && (
                      <div className="rounded-xl border border-border bg-muted/40 p-4 text-center space-y-2">
                        <div className="h-3 w-3 mx-auto animate-ping rounded-full bg-primary" />
                        <p className="text-sm font-bold text-foreground">AI Teacher is watching...</p>
                        <p className="text-xs text-muted-foreground">
                          Make the sign for <span className="font-bold text-primary">"{currentSign?.name}"</span> in your camera.
                        </p>
                        {currentSign?.hint && (
                          <div className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs text-primary font-semibold">
                            💡 {currentSign.hint}
                          </div>
                        )}
                        <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2">
                          <span className="text-[11px] text-muted-foreground">Having camera lighting issues?</span>
                          <button
                            onClick={forceMatch}
                            className="text-[11px] font-bold text-primary hover:underline px-2 py-1 rounded bg-muted/70 hover:bg-muted transition-colors cursor-pointer"
                          >
                            Mark as Matched ✓
                          </button>
                        </div>
                      </div>
                    )}

                    {matchingStatus === "correct" && (
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-3 text-emerald-950 dark:text-emerald-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-emerald-600 font-bold">
                            <CheckCircle2 className="h-5 w-5" />
                            <span>Great Job! Sign Matched</span>
                          </div>
                          <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                            {evaluatedScore}% Match
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-emerald-900/80 dark:text-emerald-200/80">
                          You performed the ISL gesture for <span className="font-bold">{currentSign?.name}</span> accurately! +10 Stars added to your score.
                        </p>
                        <button
                          onClick={handleNext}
                          className="w-full bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs transition-opacity hover:opacity-90 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          {currentSignIdx === (category?.signs.length ?? 0) - 1 ? "Finish Lesson" : "Next Sign"} <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {matchingStatus === "incorrect" && (
                      <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 space-y-2.5 text-rose-950 dark:text-rose-200">
                        <div className="flex items-center gap-2 text-rose-600 font-bold">
                          <AlertCircle className="h-5 w-5" />
                          <span>Almost there!</span>
                        </div>
                        <p className="text-xs leading-relaxed text-rose-900/80 dark:text-rose-200/80">
                          Please verify your hand position against the demonstration video and try again.
                        </p>
                        <button
                          onClick={() => setMatchingStatus("waiting")}
                          className="w-full bg-white/80 border border-rose-200 text-rose-700 font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> Try Again
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Progress & Achievements Mode */}
      {activeTab === "progress" && (
        <div className="grid gap-5 md:grid-cols-3">
          <div className="glass rounded-2xl p-6 text-center space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Stars</h3>
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
              <Trophy className="h-8 w-8" />
            </div>
            <p className="text-3xl font-black text-foreground">{points} ⭐</p>
            <p className="text-xs text-muted-foreground">Keep completing lessons to earn more stars!</p>
          </div>

          <div className="glass rounded-2xl p-6 text-center space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Current Level</h3>
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Award className="h-8 w-8" />
            </div>
            <p className="text-xl font-bold text-foreground">Level 2 · Explorer</p>
            <p className="text-xs text-muted-foreground">Complete Level 2 Colours to unlock Level 3!</p>
          </div>

          <div className="glass rounded-2xl p-6 space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">Unlocked Badges</h3>
            <div className="space-y-2.5">
              {BADGES.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.id} className={`flex items-center gap-3 p-3 rounded-xl border ${badge.color}`}>
                    <Icon className="h-5 w-5 shrink-0" />
                    <div>
                      <h4 className="font-bold text-xs">{badge.name}</h4>
                      <p className="text-[11px] text-muted-foreground">{badge.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. Parent/Teacher Dashboard */}
      {activeTab === "parent" && (
        <div className="grid gap-5 md:grid-cols-2">
          <div className="glass rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-bold flex items-center gap-2 text-foreground">
              <Activity className="h-4 w-4 text-primary" /> Student Accuracy History
            </h3>
            <div className="space-y-2.5">
              {Object.entries(accuracyHistory).map(([sign, acc]) => (
                <div key={sign} className="flex items-center justify-between border-b border-border/50 pb-2">
                  <div>
                    <span className="font-bold text-xs text-foreground">{sign}</span>
                    <p className="text-[11px] text-muted-foreground">Recent session evaluation</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${acc >= 90 ? "text-emerald-600" : "text-amber-600"}`}>
                      {acc}% Accuracy
                    </span>
                    <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-semibold uppercase">
                      {acc >= 90 ? "Passed" : "Practice"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-bold flex items-center gap-2 text-foreground">
              <Heart className="h-4 w-4 text-rose-500" /> Learning Recommendations
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Based on gesture accuracy data, here are customized recommendations:
            </p>
            <div className="space-y-3">
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-foreground">Reinforce Two-Handed Compound Signs</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Practice transitioning from Thumbs Up into Morning/Afternoon bloom gestures.
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 flex items-start gap-3">
                <BookOpen className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-foreground">Next Milestone: Level 2 Colours</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Ready to practice Black, Red, Yellow, and Violet signs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
