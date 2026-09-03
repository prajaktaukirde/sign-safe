import React, { useState } from "react";
import { 
  Sparkles, Hand, Play, Trophy, ShieldAlert, Star, 
  ArrowRight, CheckCircle2, Heart, Award, Compass, 
  BookOpen, Palette, Volume2, Shield, Eye, Flame, ChevronRight,
  GraduationCap
} from "lucide-react";
import { useDemo } from "@/lib/demo-store";

interface HeroLandingProps {
  onStartLearning: (categoryKey?: string) => void;
  onOpenTeacher: () => void;
  onOpenSOS: () => void;
}

const PREVIEW_SIGNS = [
  { name: "Namaste", emoji: "🙏", desc: "Prayer mudra in front of chest", tag: "Level 1" },
  { name: "Hello", emoji: "👋", desc: "Open palm waving beside temple", tag: "Level 1" },
  { name: "Good Morning", emoji: "☀️", desc: "Thumbs up into rising sun bloom", tag: "Level 1" },
  { name: "Red", emoji: "🔴", desc: "Index finger touch on lips", tag: "Level 2" },
  { name: "Yellow", emoji: "💛", desc: "Y-handshape shaking by shoulder", tag: "Level 2" },
  { name: "SafeSOS", emoji: "🛡️", desc: "Visual fire alarm & 1-tap rescue", tag: "Safety" },
];

const FEATURES = [
  {
    icon: Hand,
    title: "Real-Time AI Camera Feedback",
    desc: "Smart joint tracking verifies your finger shapes and hand positions live at 30 FPS.",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20"
  },
  {
    icon: Play,
    title: "Official ISLRTC Demonstrations",
    desc: "High-definition video lessons recorded following official Indian Sign Language standards.",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20"
  },
  {
    icon: Trophy,
    title: "Gamified Stars & Badges",
    desc: "Earn stars, unlock achievement badges, and level up as you master each sign vocabulary.",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20"
  },
  {
    icon: ShieldAlert,
    title: "SafeSOS Emergency Protection",
    desc: "Visual strobe fire alarms and 1-tap interactive evacuation floorplans for deaf children.",
    color: "bg-rose-500/10 text-rose-600 border-rose-500/20"
  }
];

const STEPS = [
  {
    num: "1",
    title: "Watch & Observe",
    desc: "Watch the authentic ISL demonstration video with clear step-by-step instructions.",
    icon: Eye,
    tag: "Video Guided"
  },
  {
    num: "2",
    title: "Perform to Camera",
    desc: "Show the sign to your webcam. The AI validates your hand posture in real time.",
    icon: Hand,
    tag: "AI Powered"
  },
  {
    num: "3",
    title: "Earn Stars & Badges",
    desc: "Hold your sign steadily to score points, unlock achievements, and level up!",
    icon: Star,
    tag: "Rewarding"
  }
];

const LESSON_MODULES = [
  {
    id: "basic",
    title: "Everyday Greetings",
    level: "🌱 Level 1",
    count: "10 Signs",
    desc: "Master essential greetings like Hello, Namaste, Good Morning, How Are You, and more.",
    color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-600",
    badge: "Most Popular"
  },
  {
    id: "colors",
    title: "Vibrant Colours",
    level: "🎨 Level 2",
    count: "10 Signs",
    desc: "Learn colourful sign expressions including Red, Black, Yellow, Violet, White, and Brown.",
    color: "from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-600",
    badge: "Interactive"
  },
  {
    id: "school",
    title: "School & Classroom",
    level: "🏫 Level 3",
    count: "3 Signs",
    desc: "Learn essential study vocabulary like Teacher, Book, and Question.",
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600",
    badge: "Classroom"
  },
  {
    id: "emergency",
    title: "Emergency & Safety",
    level: "🚨 Level 4",
    count: "2 Signs",
    desc: "Vital safety signs like Help and Safe for urgent situations and campus evacuation.",
    color: "from-rose-500/10 to-red-500/10 border-rose-500/20 text-rose-600",
    badge: "Crucial"
  }
];

export function HeroLanding({ onStartLearning, onOpenTeacher, onOpenSOS }: HeroLandingProps) {
  const { triggerEmergency } = useDemo();
  const [activePreview, setActivePreview] = useState(0);

  return (
    <div className="space-y-16 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-linear-to-b from-white/90 via-white/80 to-primary/5 p-6 sm:p-10 md:p-14 shadow-sm backdrop-blur-md">
        {/* Decorative background glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>AI-Powered Indian Sign Language & Safety</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-5xl leading-[1.15]">
              Learn Indian Sign Language with your{" "}
              <span className="bg-linear-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Real-Time AI Teacher
              </span>
            </h1>

            <p className="max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed">
              Designed specifically for deaf children, students, and educators. Watch authentic ISLRTC video demonstrations, get instant camera AI feedback, collect stars & badges, and stay safe with interactive SafeSOS alerts.
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onStartLearning("basic")}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-primary/90 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => onStartLearning("basic")}
                className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3.5 text-sm font-bold text-foreground hover:bg-muted/60 transition-all cursor-pointer shadow-2xs"
              >
                <Hand className="h-4 w-4 text-primary" />
                <span>Try AI Camera</span>
              </button>

              <button
                onClick={onOpenTeacher}
                className="inline-flex items-center gap-2 rounded-2xl border border-border/80 bg-card/60 px-4 py-3.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-card transition-colors cursor-pointer"
              >
                <GraduationCap className="h-4 w-4" />
                <span>Teacher Mode</span>
              </button>
            </div>

            {/* Quick Stats Ribbon */}
            <div className="grid grid-cols-3 gap-3 border-t border-border/60 pt-6 max-w-lg">
              <div>
                <p className="text-xl font-black text-foreground">20+ Signs</p>
                <p className="text-xs text-muted-foreground">Level 1 & Level 2</p>
              </div>
              <div>
                <p className="text-xl font-black text-emerald-600">30 FPS</p>
                <p className="text-xs text-muted-foreground">Real-Time AI Vision</p>
              </div>
              <div>
                <p className="text-xl font-black text-amber-500">100% Free</p>
                <p className="text-xs text-muted-foreground">Child-Safe & Open</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Featured Signs Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-border bg-card/90 p-5 shadow-lg backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-foreground">Interactive ISL Preview</span>
                </div>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                  Tap to explore
                </span>
              </div>

              {/* Preview Chips */}
              <div className="grid grid-cols-3 gap-2">
                {PREVIEW_SIGNS.map((item, idx) => (
                  <button
                    key={item.name}
                    onClick={() => setActivePreview(idx)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      activePreview === idx
                        ? "border-primary bg-primary/10 text-primary shadow-xs font-bold scale-[1.03]"
                        : "border-border bg-muted/30 text-foreground hover:bg-muted font-medium"
                    }`}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-[11px] mt-1 truncate w-full">{item.name}</span>
                  </button>
                ))}
              </div>

              {/* Active Sign Detail Showcase */}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{PREVIEW_SIGNS[activePreview]?.emoji}</span>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{PREVIEW_SIGNS[activePreview]?.name}</h4>
                      <span className="text-[10px] uppercase font-bold text-primary">
                        {PREVIEW_SIGNS[activePreview]?.tag}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 text-[10px] font-bold">
                    AI Validated ✓
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {PREVIEW_SIGNS[activePreview]?.desc}
                </p>

                <button
                  onClick={() => onStartLearning(activePreview < 3 ? "basic" : activePreview < 5 ? "colors" : "emergency")}
                  className="w-full rounded-xl bg-primary text-white py-2 text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Play className="h-3 w-3" /> Practice this Sign in Video Lab
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS: 3 EASY STEPS */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Simple & Fun Process</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            How SignSafe Works in 3 Steps
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Designed to make Indian Sign Language accessible, intuitive, and fun for deaf children of all ages.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative rounded-3xl border border-border bg-card p-6 shadow-xs hover:shadow-md transition-all space-y-4 group hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white font-black text-sm shadow-xs">
                    {step.num}
                  </span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                    {step.tag}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. EXPLORE LESSON MODULES */}
      <section className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Structured Curriculum</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Choose Your Lesson Level
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Progress smoothly from basic greetings to colours, classroom terms, and safety signs.
            </p>
          </div>

          <button
            onClick={() => onStartLearning("basic")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            <span>Open All Modules</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {LESSON_MODULES.map((mod) => (
            <div
              key={mod.id}
              className={`flex flex-col justify-between rounded-3xl border p-6 bg-linear-to-b ${mod.color} bg-card/80 transition-all hover:shadow-md hover:scale-[1.01]`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider">{mod.level}</span>
                  <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold text-foreground shadow-2xs">
                    {mod.count}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground">{mod.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{mod.desc}</p>
              </div>

              <button
                onClick={() => onStartLearning(mod.id)}
                className="mt-6 flex w-full items-center justify-between rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-foreground shadow-2xs hover:bg-primary hover:text-white transition-all cursor-pointer"
              >
                <span>Start Lesson</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. KEY PLATFORM FEATURES */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Empowering Features</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Why Students & Teachers Love SignSafe
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="rounded-3xl border border-border bg-card p-6 shadow-2xs space-y-3 hover:shadow-sm transition-all"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${feat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-foreground">{feat.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. SAFESOS SAFETY HIGHLIGHT BANNER */}
      <section className="relative overflow-hidden rounded-3xl border border-rose-500/30 bg-linear-to-r from-rose-500/10 via-rose-500/5 to-amber-500/10 p-6 sm:p-8 md:p-10 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
          <div className="space-y-3 lg:col-span-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/15 px-3 py-1 text-xs font-bold text-rose-600">
              <Shield className="h-3.5 w-3.5" />
              <span>Crucial Safety Feature for Deaf Children</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              SafeSOS: Visual Emergency Alerts for Campus & Home
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
              Deaf children cannot hear audible fire bells. SafeSOS provides strobe screen warnings, instant evacuation route floorplans, and a 1-tap "I AM OK" safety confirmation system.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 lg:col-span-4 lg:items-end">
            <button
              onClick={() => triggerEmergency("Fire alarm acoustic signature detected")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-destructive px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-destructive/90 transition-all cursor-pointer"
            >
              <Flame className="h-4 w-4" />
              <span>Simulate Fire Alarm Alert</span>
            </button>
            <button
              onClick={onOpenSOS}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-5 py-3 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <span>View Evacuation Plan</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="border-t border-border/80 pt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white">
            <Hand className="h-4 w-4" />
          </div>
          <span>SignSafe AI · Indian Sign Language Education & Child Safety</span>
        </div>
        <p>© 2026 SignSafe Platform · Open educational accessibility initiative.</p>
      </footer>
    </div>
  );
}
