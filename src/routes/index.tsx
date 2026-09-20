import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { 
  Accessibility, GraduationCap, ShieldAlert, Sparkles, 
  Compass, Trophy, Home as HomeIcon, Video, Heart, Award, Flame,
  Languages, Globe, Cloud, CheckCircle2, Server, X
} from "lucide-react";
import { DemoProvider, useDemo } from "@/lib/demo-store";
import { LanguageProvider, useLanguage } from "@/lib/translations";
import { AWS_SERVICES } from "@/lib/aws-services";
import { StudentView } from "@/components/app/StudentView";
import { TeacherView } from "@/components/app/TeacherView";
import { SosOverlay } from "@/components/app/SosOverlay";
import { DemoPanel } from "@/components/app/DemoPanel";
import { HeroLanding } from "@/components/app/HeroLanding";

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
  const [activeNav, setActiveNav] = useState<"home" | "learn" | "badges" | "teacher">("home");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAwsModal, setShowAwsModal] = useState(false);

  const handleStartLearning = (categoryKey?: string) => {
    setView("student");
    setActiveNav("learn");
    if (categoryKey) {
      setSelectedCategory(categoryKey);
    }
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
          {/* AWS Cloud Badge & Trigger */}
          <button
            onClick={() => setShowAwsModal(true)}
            className="flex items-center gap-1.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer shadow-2xs"
            title="View Active AWS Cloud Services"
          >
            <Cloud className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
            <span className="hidden sm:inline">AWS Cloud</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          </button>

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

          {/* Quick Stats Pill */}
          <div className="hidden lg:flex items-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-600">
            <span>{t.starsCount}</span>
            <span className="text-muted-foreground">·</span>
            <span>{t.levelBadge}</span>
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
            onOpenTeacher={handleOpenTeacher}
            onOpenSOS={() => triggerEmergency("Campus Evacuation Preview")}
          />
        ) : (
          <StudentView
            initialCategory={selectedCategory}
            activeTab={activeNav === "badges" ? "progress" : "learn"}
            onTabChange={(tab) => {
              if (tab === "progress") setActiveNav("badges");
              else setActiveNav("learn");
            }}
            onBackToHome={() => setActiveNav("home")}
          />
        )}
      </div>

      {/* 3. AWS SERVICES MODAL */}
      {showAwsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl border border-amber-500/30 bg-card p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  <Cloud className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    AWS Cloud Architecture
                    <span className="rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold uppercase">
                      Live & Active
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Cloud-native accessibility infrastructure for SignSafe AI
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAwsModal(false)}
                className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {AWS_SERVICES.map((srv) => (
                <div
                  key={srv.id}
                  className="flex items-start gap-3.5 rounded-2xl border border-border/80 bg-muted/40 p-3.5 transition-all hover:border-amber-500/30"
                >
                  <span className="text-2xl">{srv.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-foreground truncate">{srv.name}</h4>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {srv.region}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-primary">{srv.service}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{srv.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-xs text-muted-foreground flex items-center justify-between">
              <span className="font-semibold text-amber-800 dark:text-amber-300">
                ☁️ Hosted Live on AWS Amplify Global CDN
              </span>
              <a
                href="https://main.d3aunvxyxb078t.amplifyapp.com"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-primary hover:underline ml-2"
              >
                amplifyapp.com ↗
              </a>
            </div>
          </div>
        </div>
      )}

      <DemoPanel />
      {emergency && <SosOverlay />}
    </main>
  );
}
