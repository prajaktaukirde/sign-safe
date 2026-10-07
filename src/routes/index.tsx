import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  Accessibility, GraduationCap, ShieldAlert, Sparkles, 
  Compass, Trophy, Home as HomeIcon, Video, Heart, Award, Flame,
  Languages, Globe, CheckCircle2, Activity, BarChart3
} from "lucide-react";
import { DemoProvider, useDemo } from "@/lib/demo-store";
import { LanguageProvider, useLanguage } from "@/lib/translations";
import { StudentView } from "@/components/app/StudentView";
import { TeacherView } from "@/components/app/TeacherView";
import { SosOverlay } from "@/components/app/SosOverlay";
import { DemoPanel } from "@/components/app/DemoPanel";
import { HeroLanding } from "@/components/app/HeroLanding";
import { loadProgress, SignRecord } from "@/lib/progress-store";

const TITLE = "SignSafe AI · Indian Sign Language & Child Safety";
const DESC =
  "Interactive Indian Sign Language learning platform with real-time AI camera feedback and SafeSOS emergency protection for deaf children.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <LanguageProvider>
      <DemoProvider>
        <Console />
      </DemoProvider>
    </LanguageProvider>
  ),
});

function Console() {
  const { view, setView, emergency, triggerEmergency, room } = useDemo();
  const { language, setLanguage, t } = useLanguage();
  const [activeNav, setActiveNav] = useState<"home" | "learn" | "test" | "badges" | "dashboard" | "teacher">("home");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Dynamic progress history sync
  const [progressHistory, setProgressHistory] = useState<Record<string, SignRecord>>({});

  useEffect(() => {
    const syncProgress = () => {
      setProgressHistory(loadProgress());
    };
    syncProgress();
    window.addEventListener("signsafe_progress_updated", syncProgress);
    return () => window.removeEventListener("signsafe_progress_updated", syncProgress);
  }, []);

  const masteredCount = Object.keys(progressHistory).length;
  const liveStars = masteredCount * 10;
  const basicCount = Object.values(progressHistory).filter(p => p.category === "basic").length;
  const colorsCount = Object.values(progressHistory).filter(p => p.category === "colors").length;
  const alphabetsCount = Object.values(progressHistory).filter(p => p.category === "alphabets").length;

  const currentLevelLabel = masteredCount === 0
    ? (language === "mr" ? "🌱 स्तर १" : language === "hi" ? "🌱 स्तर 1" : "🌱 Level 1")
    : basicCount < 10
    ? (language === "mr" ? "🌿 अभिवादन" : language === "hi" ? "🌿 अभिवादन" : "🌿 Greetings")
    : colorsCount < 10
    ? (language === "mr" ? "🎨 रंग" : language === "hi" ? "🎨 रंग" : "🎨 Colours")
    : alphabetsCount < 26
    ? (language === "mr" ? "🔤 मुळाक्षरे" : language === "hi" ? "🔤 वर्णमाला" : "🔤 Alphabets")
    : (language === "mr" ? "🏆 ग्रँड मास्टर" : language === "hi" ? "🏆 ग्रैंड मास्टर" : "🏆 Grand Master");

  const handleStartLearning = (categoryKey?: string) => {
    setView("student");
    setActiveNav("learn");
    if (categoryKey) {
      setSelectedCategory(categoryKey);
    }
  };

  const handleOpenTest = () => {
    setView("student");
    setActiveNav("test");
  };

  const handleOpenTeacher = () => {
    setView("teacher");
    setActiveNav("teacher");
  };

  return (
    <main className="min-h-screen px-3 py-4 sm:px-6 md:px-8">
      {/* 1. TOP NAVBAR */}
      <header className="mx-auto mb-8 flex max-w-7xl flex-wrap items-center justify-between gap-4 rounded-3xl border border-border/80 bg-white/90 p-3.5 sm:p-4 backdrop-blur-xl shadow-xs">
        {/* Brand Logo */}
        <button
          onClick={() => {
            setView("student");
            setActiveNav("home");
          }}
          className="flex items-center gap-3 text-left cursor-pointer group"
        >
          <div className="glow-primary flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-sm group-hover:scale-105 transition-transform">
            <Accessibility className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
                SignSafe <span className="bg-linear-to-r from-primary to-indigo-600 bg-clip-text text-transparent">AI</span>
              </h1>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-extrabold text-primary">
                {t.brandTag}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              {t.brandSubtitle}
            </p>
          </div>
        </button>

        {/* Center Nav Links */}
        <nav className="flex items-center gap-1 sm:gap-1.5 rounded-2xl border border-border/60 bg-muted/40 p-1">
          <button
            onClick={() => {
              setView("student");
              setActiveNav("home");
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeNav === "home" && view === "student"
                ? "bg-white text-primary shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <HomeIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t.navHome}</span>
          </button>

          <button
            onClick={() => {
              setView("student");
              setActiveNav("learn");
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeNav === "learn" && view === "student"
                ? "bg-white text-primary shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>{t.navLearn}</span>
          </button>

          <button
            onClick={() => {
              setView("student");
              setActiveNav("test");
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeNav === "test" && view === "student"
                ? "bg-white text-primary shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Award className="h-3.5 w-3.5 text-primary" />
            <span>{t.tabTest}</span>
          </button>

          <button
            onClick={() => {
              setView("student");
              setActiveNav("badges");
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeNav === "badges" && view === "student"
                ? "bg-white text-primary shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            <span>{t.navBadges}</span>
          </button>

          <button
            onClick={() => {
              setView("student");
              setActiveNav("dashboard");
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeNav === "dashboard" && view === "student"
                ? "bg-white text-primary shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Activity className="h-3.5 w-3.5 text-blue-500" />
            <span className="hidden sm:inline">{t.tabParent}</span>
          </button>

          <button
            onClick={handleOpenTeacher}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              view === "teacher"
                ? "bg-white text-primary shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t.navTeacher}</span>
          </button>
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2">
          {/* Language Selector Dropdown */}
          <div className="flex items-center gap-1 rounded-2xl border border-border/80 bg-muted/40 p-1">
            <Languages className="h-3.5 w-3.5 text-primary ml-1.5 hidden sm:inline" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="rounded-xl bg-white px-2 py-1.5 text-xs font-bold text-foreground border border-border/60 outline-none cursor-pointer shadow-2xs"
              aria-label="Select Language"
            >
              <option value="en">🇬🇧 English</option>
              <option value="hi">🇮🇳 हिन्दी (Hindi)</option>
              <option value="mr">🚩 मराठी (Marathi)</option>
            </select>
          </div>

          {/* Quick Stats Pill with dynamic live data */}
          <div className="hidden lg:flex items-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-600">
            <span>⭐ {liveStars} Stars</span>
            <span className="text-muted-foreground">·</span>
            <span>{currentLevelLabel}</span>
          </div>

          <button
            onClick={() => triggerEmergency("Fire alarm acoustic signature detected")}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-destructive/30 bg-destructive/10 px-3.5 py-2 text-xs font-bold text-destructive hover:bg-destructive/20 transition-all cursor-pointer shadow-2xs"
          >
            <Flame className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t.navSos}</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN VIEW AREA */}
      <div className="mx-auto max-w-7xl">
        {view === "teacher" ? (
          <TeacherView onBackToHome={() => { setView("student"); setActiveNav("home"); }} />
        ) : activeNav === "home" ? (
          <HeroLanding
            onStartLearning={handleStartLearning}
            onOpenTest={handleOpenTest}
            onOpenTeacher={handleOpenTeacher}
            onOpenSOS={() => triggerEmergency("Campus Evacuation Preview")}
          />
        ) : (
          <StudentView
            initialCategory={selectedCategory}
            activeTab={
              activeNav === "badges" ? "progress" :
              activeNav === "test" ? "test" :
              activeNav === "dashboard" ? "parent" :
              "learn"
            }
            onTabChange={(tab) => {
              if (tab === "progress") setActiveNav("badges");
              else if (tab === "test") setActiveNav("test");
              else if (tab === "parent") setActiveNav("dashboard");
              else setActiveNav("learn");
            }}
            onBackToHome={() => setActiveNav("home")}
          />
        )}
      </div>

      <DemoPanel />
      {emergency && <SosOverlay />}
    </main>
  );
}
