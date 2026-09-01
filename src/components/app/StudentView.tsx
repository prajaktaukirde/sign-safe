import { useState, useEffect } from "react";
import { 
  Sparkles, Hand, RotateCcw, Trophy, BookOpen, Star, 
  AlertCircle, ShieldAlert, Award, Compass, Heart, Activity, CheckCircle2, RefreshCw
} from "lucide-react";
import { SigningAvatar } from "./SigningAvatar";
import { WebcamMock } from "./WebcamMock";
import { useDemo } from "@/lib/demo-store";

const SPEEDS = [0.75, 1, 1.25, 1.5];

interface Sign {
  name: string;
  desc: string;
  mappedGesture: string; // The output string our webcam classifier matches
  videoUrl: string;      // Embeddable YouTube video demonstration URL
}

interface Category {
  name: string;
  icon: any;
  level: string;
  signs: Sign[];
}

const CATEGORIES: Record<string, Category> = {
  basic: {
    name: "Greetings",
    icon: Compass,
    level: "🌱 Level 1",
    signs: [
      { name: "Hello", desc: "Raise your dominant hand with the palm facing outward and make a small greeting/waving movement.", mappedGesture: "Hello", videoUrl: "/level1-greeting/hello.mp4" },
      { name: "Namaste", desc: "Bring both palms together in front of your chest, with the fingers pointing upward.", mappedGesture: "Namaste", videoUrl: "/level1-greeting/namaste.mp4" },
      { name: "Good Morning", desc: "First make the ISL sign for 'Good' by forming a thumbs-up gesture. Then make the sign for 'Morning' by opening your hand upward like a flower blooming. The two signs are performed together to express 'Good Morning'.", mappedGesture: "Good Morning", videoUrl: "/level1-greeting/goodmorning.mp4" },
      { name: "Good Afternoon", desc: "Perform the official ISL signs for GOOD followed by AFTERNOON as shown in the ISLRTC reference video.", mappedGesture: "Good Afternoon", videoUrl: "/level1-greeting/goodafternoon.mp4" },
      { name: "Good Evening", desc: "Perform the official ISL signs for GOOD followed by EVENING as shown in the ISLRTC reference video.", mappedGesture: "Good Evening", videoUrl: "/level1-greeting/goodevening.mp4" },
      { name: "Good Night", desc: "Perform the official ISL signs for GOOD followed by NIGHT as shown in the ISLRTC reference video.", mappedGesture: "Good Night", videoUrl: "/level1-greeting/goodnight.mp4" },
      { name: "Good Day", desc: "Perform the official ISL sign for GOOD from the official dictionary followed by DAY.", mappedGesture: "Good Day", videoUrl: "/level1-greeting/goodDay.mp4" },
      { name: "How Are You", desc: "Perform the complete ISL phrase for HOW ARE YOU according to the official ISLRTC dictionary guidelines.", mappedGesture: "How Are You", videoUrl: "/level1-greeting/howareyou.mp4" },
      { name: "Happy Birthday", desc: "Perform the official ISL signs for HAPPY followed by the specific ISLRTC BIRTHDAY sign.", mappedGesture: "Happy Birthday", videoUrl: "/level1-greeting/happybirthday.mp4" },
      { name: "Happy Anniversary", desc: "Perform the official ISL signs for HAPPY followed by the specific ISLRTC ANNIVERSARY sign.", mappedGesture: "Happy Anniversary", videoUrl: "/level1-greeting/happyaniversary.mp4" }
    ]
  },
  school: {
    name: "School & Learning",
    icon: BookOpen,
    level: "🏫 Level 2",
    signs: [
      { name: "Teacher", desc: "Hold both hands near chest and circle them.", mappedGesture: "Teacher", videoUrl: "https://www.youtube.com/embed/2_X0qT9N4j4" },
      { name: "Book", desc: "Bring palms together, then open them flat like a book.", mappedGesture: "Book", videoUrl: "https://www.youtube.com/embed/k-xS3c0p0z8" },
      { name: "Question", desc: "Raise your index finger straight up.", mappedGesture: "Question", videoUrl: "https://www.youtube.com/embed/bL1u2kG3Vj8" }
    ]
  },
  emergency: {
    name: "Emergency & Safety",
    icon: ShieldAlert,
    level: "🌟 Level 3",
    signs: [
      { name: "Help", desc: "Rest your closed right fist on your flat left palm.", mappedGesture: "Help", videoUrl: "https://www.youtube.com/embed/0X6dM0Kk1iY" },
      { name: "Safe", desc: "Cross arms in front of chest then open them.", mappedGesture: "Yes", videoUrl: "https://www.youtube.com/embed/rP2t8P6qg5c" }
    ]
  }
};

const BADGES = [
  { id: "first", name: "First Sign", desc: "Learned your first ISL sign!", icon: Star, color: "text-amber-400 bg-amber-400/10 border-amber-400/30" },
  { id: "perfect", name: "Perfect Score", desc: "Got 100% accuracy on a sign", icon: Trophy, color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" },
  { id: "safety", name: "Safety Expert", desc: "Completed Level 3 Emergency Signs", icon: Award, color: "text-rose-400 bg-rose-400/10 border-rose-400/30" }
];

export function StudentView() {
  const {
    transcript,
    liveWords,
    avatarSpeed,
    setAvatarSpeed,
    replayKey,
    replay,
    gestureStatus,
    gestureOutput,
    simulateSpeech
  } = useDemo();

  const [activeTab, setActiveTab] = useState<"learn" | "progress" | "parent">("learn");
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [currentSignIdx, setCurrentSignIdx] = useState(0);
  const [points, setPoints] = useState(320);
  const [accuracyHistory, setAccuracyHistory] = useState<Record<string, number>>({
    "Hello": 92,
    "Yes": 88,
    "Book": 78
  });
  
  // Real-time gesture validation states
  const [matchingStatus, setMatchingStatus] = useState<"waiting" | "correct" | "incorrect">("waiting");
  const [evaluatedScore, setEvaluatedScore] = useState<number | null>(null);

  const category = selectedCat ? CATEGORIES[selectedCat] : null;
  const currentSign = category ? category.signs[currentSignIdx] : null;

  // Whenever we select a sign, teach the avatar to sign the name of the word!
  useEffect(() => {
    if (currentSign) {
      simulateSpeech(`Let's learn: ${currentSign.name}. ${currentSign.desc}`);
      setMatchingStatus("waiting");
      setEvaluatedScore(null);
    }
  }, [selectedCat, currentSignIdx, currentSign, simulateSpeech]);

  // Hook up real-time MediaPipe evaluation loops
  useEffect(() => {
    // Lock screen in success state once correct (preventing reset when hand is lowered)
    if (matchingStatus === "correct") return;

    if (currentSign && gestureOutput !== "—" && gestureOutput !== "…") {
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
        (nameNorm.includes("anniversary") && (outputNorm.includes("anniversary") || outputNorm.includes("birthday") || outputNorm.includes("happy"))) ||
        (nameNorm.includes("birthday") && (outputNorm.includes("birthday") || outputNorm.includes("anniversary") || outputNorm.includes("happy")));

      if (isDirectMatch || isCompoundMatch) {
        setMatchingStatus("correct");
        setEvaluatedScore(92 + Math.floor(Math.random() * 8)); // Generate 92% - 100% score
        setPoints((p) => p + 10);
        
        // Add to history
        setAccuracyHistory(prev => ({
          ...prev,
          [currentSign.name]: 96
        }));
      }
    }
  }, [gestureOutput, currentSign, matchingStatus]);

  const handleNext = () => {
    if (category && currentSignIdx < category.signs.length - 1) {
      setCurrentSignIdx(currentSignIdx + 1);
    } else {
      setSelectedCat(null);
      setCurrentSignIdx(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub navigation for Child Console */}
      <nav className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab("learn")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "learn" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          👩‍🏫 AI Teacher & Play Console
        </button>
        <button
          onClick={() => setActiveTab("progress")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "progress" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          🏆 My Achievements
        </button>
        <button
          onClick={() => setActiveTab("parent")}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "parent" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          📊 Parent/Teacher Dashboard
        </button>
      </nav>

      {/* Learn Mode */}
      {activeTab === "learn" && (
        <div className="grid gap-5 lg:grid-cols-5">
          {/* Main Workspace (Avatar and Subtitles) */}
          <section className="glass rounded-2xl p-5 lg:col-span-3 space-y-4">
            {!selectedCat ? (
              // Category Selection Home screen
              <div className="space-y-6 py-4">
                <div className="text-center max-w-lg mx-auto space-y-2">
                  <h2 className="text-2xl font-black tracking-tight text-primary">Choose Your Lesson</h2>
                  <p className="text-sm text-muted-foreground">Select a category below to start learning Indian Sign Language step-by-step with your AI Teacher.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {Object.entries(CATEGORIES).map(([key, cat]) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setSelectedCat(key);
                          setCurrentSignIdx(0);
                        }}
                        className="flex flex-col items-center gap-3 p-6 text-center rounded-xl border border-secondary bg-white hover:bg-secondary/40 hover:border-primary/40 transition-all shadow-sm hover:shadow group"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary group-hover:scale-110 transition-transform">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase">{cat.level}</p>
                          <h3 className="font-bold text-base mt-0.5">{cat.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{cat.signs.length} signs to learn</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              // Active Lesson screen
              <div className="space-y-4">
                <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                  <div>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{category?.level}</span>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      Learn Sign: <span className="text-warning font-black">{currentSign?.name}</span>
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedCat(null)}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    ← Back to Lessons
                  </button>
                </header>

                {/* Visual Demonstrations Split Screen */}
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Left: 3D Signing Avatar */}
                  <div className="relative h-[240px] overflow-hidden rounded-xl border border-border bg-[radial-gradient(500px_260px_at_50%_0%,rgba(0,102,255,0.14),transparent_70%)]">
                    <SigningAvatar speed={avatarSpeed} replayKey={replayKey} transcript={liveWords || transcript} />
                    <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] text-muted-foreground bg-black/70">
                      3D AI Avatar
                    </span>
                  </div>

                  {/* Right: Human Video Demonstration */}
                  <div className="relative h-[240px] overflow-hidden rounded-xl border border-border bg-black">
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
                    <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] text-muted-foreground bg-black/70">
                      Human Demonstration Video
                    </span>
                  </div>
                </div>

                {/* Subtitle Description */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">AI Teacher Instruction</p>
                  <p className="text-base font-medium leading-relaxed">{currentSign?.desc}</p>
                </div>
              </div>
            )}
          </section>

          {/* Practice Workspace (Webcam and AI Feedbacks) */}
          <section className="glass rounded-2xl p-5 lg:col-span-2 space-y-4">
            <header className="mb-2">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Hand className="h-5 w-5 text-warning" /> Webcam Gesture Evaluator
              </h2>
              <p className="text-xs text-muted-foreground">Perform the sign in front of your camera to check your match.</p>
            </header>

            <WebcamMock active={!!selectedCat} />

            {/* AI Evaluator Output Panel */}
            {selectedCat ? (
              <div className="space-y-4">
                {matchingStatus === "waiting" && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center space-y-2">
                    <div className="h-3.5 w-3.5 mx-auto animate-ping rounded-full bg-warning" />
                    <p className="text-sm font-semibold">AI Teacher is watching...</p>
                    <p className="text-xs text-muted-foreground">Make the sign for <span className="font-bold text-warning">"{currentSign?.name}"</span> in your camera.</p>
                  </div>
                )}

                {matchingStatus === "correct" && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-bold">🎉 EXCELLENT JOB!</span>
                    </div>
                    <div className="text-sm">
                      You matched the sign for <span className="font-bold">{currentSign?.name}</span> correctly!
                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground font-semibold">
                        <span>Accuracy: <span className="text-emerald-400 text-sm font-bold">{evaluatedScore}%</span></span>
                        <span>Points: <span className="text-warning text-sm font-bold">+10 Stars</span></span>
                      </div>
                    </div>
                    <button
                      onClick={handleNext}
                      className="w-full bg-emerald-500 text-white font-bold py-2 rounded-xl text-sm transition-opacity hover:opacity-90"
                    >
                      Next Sign →
                    </button>
                  </div>
                )}

                {matchingStatus === "incorrect" && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-rose-400">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-bold">Almost there!</span>
                    </div>
                    <p className="text-sm">
                      Your hand position is good, but your finger gestures are slightly misaligned.
                    </p>
                    <div className="text-xs font-semibold text-muted-foreground">
                      Calculated Match: <span className="text-rose-400">{evaluatedScore}%</span>
                    </div>
                    <button
                      onClick={() => setMatchingStatus("waiting")}
                      className="w-full bg-white/10 hover:bg-white/15 text-foreground font-semibold py-2 rounded-xl text-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="h-4 w-4" /> Try Again
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-muted-foreground text-sm">
                Start a lesson to open the webcam interpreter.
              </div>
            )}
          </section>
        </div>
      )}

      {/* Achievements Mode */}
      {activeTab === "progress" && (
        <div className="grid gap-5 md:grid-cols-3">
          {/* Stats Summary */}
          <section className="glass rounded-2xl p-6 text-center space-y-3">
            <h3 className="text-base font-bold text-muted-foreground uppercase tracking-wider">Score Summary</h3>
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-warning/10 text-warning">
              <Trophy className="h-10 w-10" />
            </div>
            <p className="text-4xl font-black text-warning">{points} Stars</p>
            <p className="text-xs text-muted-foreground">Keep learning signs to earn more points!</p>
          </section>

          {/* Level Tracker */}
          <section className="glass rounded-2xl p-6 text-center space-y-3">
            <h3 className="text-base font-bold text-muted-foreground uppercase tracking-wider">Current Tier</h3>
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Award className="h-10 w-10" />
            </div>
            <p className="text-2xl font-black">🌿 Level 2 Learner</p>
            <p className="text-xs text-muted-foreground">Level up to Level 3 by completing Emergency signs!</p>
          </section>

          {/* Badges list */}
          <section className="glass rounded-2xl p-6 space-y-3 col-span-1 md:col-span-1">
            <h3 className="text-base font-bold text-muted-foreground uppercase tracking-wider text-center">Achievements Badges</h3>
            <div className="space-y-3">
              {BADGES.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.id} className={`flex items-center gap-3 p-3 rounded-xl border ${badge.color}`}>
                    <Icon className="h-5 w-5 shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm">{badge.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{badge.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* Parent Console Mode */}
      {activeTab === "parent" && (
        <div className="grid gap-5 md:grid-cols-2">
          {/* Performance Report */}
          <section className="glass rounded-2xl p-5 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" /> Student Accuracy Log
            </h3>
            <div className="space-y-3">
              {Object.entries(accuracyHistory).map(([sign, acc]) => (
                <div key={sign} className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div>
                    <span className="font-semibold text-sm">{sign}</span>
                    <p className="text-xs text-muted-foreground">Recent try</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${acc >= 90 ? "text-emerald-400" : "text-warning"}`}>
                      {acc}% Accuracy
                    </span>
                    <span className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded text-muted-foreground uppercase">
                      {acc >= 90 ? "Passed" : "Needs Review"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Weak Areas Adaptive learning list */}
          <section className="glass rounded-2xl p-5 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-400" /> Adaptive Practice Planner
            </h3>
            <p className="text-xs text-muted-foreground">The AI Teacher tracks weak areas and automatically schedules review practices.</p>
            <div className="space-y-3">
              <div className="rounded-xl border border-warning/30 bg-warning/10 p-3 flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold">Review Needed: "Book"</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Accuracy dropped below 80%. AI teacher scheduled video walkthrough retry.</p>
                </div>
              </div>
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 flex items-start gap-2.5">
                <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold">Emergency Sign Training Scheduled</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Recommended practice before progressing to Level 3.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
