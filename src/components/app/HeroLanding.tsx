import React, { useState } from "react";
import { 
  Sparkles, Hand, Play, Trophy, ShieldAlert, Star, 
  ArrowRight, CheckCircle2, Heart, Award, Compass, 
  BookOpen, Palette, Volume2, Shield, Eye, Flame, ChevronRight,
  GraduationCap, MapPin, MessageCircle, PhoneCall, Zap, Cpu, Layers
} from "lucide-react";
import { useDemo } from "@/lib/demo-store";
import { useLanguage } from "@/lib/translations";

interface HeroLandingProps {
  onStartLearning: (categoryKey?: string) => void;
  onOpenTest?: () => void;
  onOpenTeacher: () => void;
  onOpenSOS: () => void;
}

export function HeroLanding({ onStartLearning, onOpenTest, onOpenTeacher, onOpenSOS }: HeroLandingProps) {
  const { triggerEmergency } = useDemo();
  const { t, language } = useLanguage();
  const [activePreview, setActivePreview] = useState(0);

  const PREVIEW_SIGNS = [
    { 
      name: language === "mr" ? "नमस्कार" : language === "hi" ? "नमस्ते" : "Namaste", 
      emoji: "🙏", 
      desc: language === "mr" ? "छातीसमोर दोन्ही हात जोडून प्रार्थना मुद्रा करा" : language === "hi" ? "छाती के सामने दोनों हाथ जोड़कर प्रार्थना मुद्रा बनाएं" : "Both flat palms pressed together in prayer mudra", 
      tag: "Level 1 · Greetings", 
      cat: "basic" 
    },
    { 
      name: language === "mr" ? "हॅलो" : language === "hi" ? "हैलो" : "Hello", 
      emoji: "👋", 
      desc: language === "mr" ? "डोक्याजवळ हाताचा पंजा हलवून अभिवादन करा" : language === "hi" ? "सिर के पास खुली हथेली हिलाकर अभिवादन करें" : "Open palm waving beside temple/ear level", 
      tag: "Level 1 · Greetings", 
      cat: "basic" 
    },
    { 
      name: language === "mr" ? "काळा" : language === "hi" ? "काला" : "Black", 
      emoji: "⚫", 
      desc: language === "mr" ? "तर्जनीच्या बाजूने कपाळाला किंवा गालाला स्पर्श करा" : language === "hi" ? "तर्जनी उंगली के किनारे से माथे या गाल को छुएं" : "Point index finger to forehead or cheek", 
      tag: "Level 2 · Colours", 
      cat: "colors" 
    },
    { 
      name: language === "mr" ? "अक्षर V" : language === "hi" ? "अक्षर V" : "Letter V", 
      emoji: "✌️", 
      desc: language === "mr" ? "तर्जनी आणि मधले बोट 'V' आकारात उघडा" : language === "hi" ? "तर्जनी और मध्यमा को 'V' आकार में फैलाएं" : "Index & middle fingers extended in peace/V shape", 
      tag: "Level 3 · Alphabets", 
      cat: "alphabets" 
    },
    { 
      name: language === "mr" ? "दिवाळी" : language === "hi" ? "दीवाली" : "Diwali", 
      emoji: "🪔", 
      desc: language === "mr" ? "दिवे लावल्याप्रमाणे दोन्ही हात बाहेर पसरवून बोटे लुकलुकावा" : language === "hi" ? "दिये जलाने की तरह दोनों हाथ फैलाकर उंगलियां टिमटिमाएं" : "Both hands outward with fluttering sparkling fingers", 
      tag: "Level 4 · Festivals", 
      cat: "festivals" 
    },
    { 
      name: language === "mr" ? "अंक ५ (Five)" : language === "hi" ? "संख्या 5 (Five)" : "Number 5", 
      emoji: "🖐️", 
      desc: language === "mr" ? "तळहात पुढे ठेवून पाचही बोटे उघडा" : language === "hi" ? "हथेली सामने रखकर पांचों उंगलियां खोलें" : "Open all 5 fingers upright facing forward", 
      tag: "Level 5 · Numbers", 
      cat: "numbers" 
    },
    { 
      name: language === "mr" ? "सुरक्षित (Safe)" : language === "hi" ? "सुरक्षित (Safe)" : "Safe", 
      emoji: "🛡️", 
      desc: language === "mr" ? "हात क्रॉस करून सुरक्षा व संरक्षणाची खात्री द्या" : language === "hi" ? "हाथ क्रॉस करके सुरक्षा और बचाव का संकेत दें" : "Cross arms and open wide indicating safety & protection", 
      tag: "Level 6 · Emergency", 
      cat: "emergency" 
    },
    { 
      name: language === "mr" ? "स्मार्ट SOS" : language === "hi" ? "स्मार्ट SOS" : "Smart SOS", 
      emoji: "🚨", 
      desc: language === "mr" ? "१-टॅप थेट GPS व व्हॉट्सॲप/SMS आपत्कालीन संदेश" : language === "hi" ? "1-टैप लाइव GPS और व्हाट्सएप/SMS संकट अलर्ट" : "1-Tap GPS location & WhatsApp distress to Registered Guardians", 
      tag: "Safety Suite", 
      cat: "emergency" 
    },
  ];

  const LESSON_MODULES = [
    {
      id: "basic",
      title: t.level1Title,
      level: "🌱 Level 1",
      count: language === "mr" ? "१० चिन्हे" : language === "hi" ? "10 संकेत" : "10 Signs",
      desc: t.level1Desc,
      color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-600",
      badge: "Foundation"
    },
    {
      id: "colors",
      title: t.level2Title,
      level: "🎨 Level 2",
      count: language === "mr" ? "१० चिन्हे" : language === "hi" ? "10 संकेत" : "10 Signs",
      desc: t.level2Desc,
      color: "from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-600",
      badge: "Vocabulary"
    },
    {
      id: "alphabets",
      title: t.level3Title,
      level: "🔤 Level 3",
      count: language === "mr" ? "२६ चिन्हे" : language === "hi" ? "26 संकेत" : "26 Signs",
      desc: t.level3Desc,
      color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600",
      badge: "Deep Learning AI"
    },
    {
      id: "festivals",
      title: t.level4Title,
      level: "🎉 Level 4",
      count: language === "mr" ? "१२ चिन्हे" : language === "hi" ? "12 संकेत" : "12 Signs",
      desc: t.level4Desc,
      color: "from-pink-500/10 to-rose-500/10 border-pink-500/20 text-pink-600",
      badge: "Culture & Celebrations"
    },
    {
      id: "numbers",
      title: t.level5Title,
      level: "🔢 Level 5",
      count: language === "mr" ? "२३ चिन्हे" : language === "hi" ? "23 संकेत" : "23 Signs",
      desc: t.level5Desc,
      color: "from-indigo-500/10 to-cyan-500/10 border-indigo-500/20 text-indigo-600",
      badge: "Counting & Math"
    },
    {
      id: "jobs",
      title: t.level6Title,
      level: "💼 Level 6",
      count: language === "mr" ? "९ चिन्हे" : language === "hi" ? "9 संकेत" : "9 Signs",
      desc: t.level6Desc,
      color: "from-teal-500/10 to-emerald-500/10 border-teal-500/20 text-teal-600",
      badge: "Career & Professions"
    },
    {
      id: "relations",
      title: t.level7Title,
      level: "👨‍👩‍👧‍👦 Level 7",
      count: language === "mr" ? "१२ चिन्हे" : language === "hi" ? "12 संकेत" : "12 Signs",
      desc: t.level7Desc,
      color: "from-fuchsia-500/10 to-pink-500/10 border-fuchsia-500/20 text-fuchsia-600",
      badge: "Family & Kinship"
    },
    {
      id: "questions",
      title: t.level8Title,
      level: "❓ Level 8",
      count: language === "mr" ? "१२ चिन्हे" : language === "hi" ? "12 संकेत" : "12 Signs",
      desc: t.level8Desc,
      color: "from-amber-500/10 to-yellow-500/10 border-amber-500/20 text-amber-600",
      badge: "Inquiry & Wh-Words"
    },
    {
      id: "sentences",
      title: t.level9Title,
      level: "💬 Level 9",
      count: language === "mr" ? "१५ वाक्ये" : language === "hi" ? "15 वाक्य" : "15 Phrases",
      desc: t.level9Desc,
      color: "from-sky-500/10 to-blue-500/10 border-sky-500/20 text-sky-600",
      badge: "Daily Conversation"
    },
    {
      id: "emergency",
      title: t.level10Title || t.level9Title,
      level: "🚨 Level 10",
      count: language === "mr" ? "३ चिन्हे + SOS" : language === "hi" ? "3 संकेत + SOS" : "3 Signs + SOS",
      desc: t.level10Desc || t.level9Desc,
      color: "from-rose-500/10 to-red-500/10 border-rose-500/20 text-rose-600",
      badge: "Life Safety & SOS"
    }
  ];

  const PIPELINE_STEPS = [
    {
      step: "01",
      title: t.pipe1Title,
      desc: t.pipe1Desc,
      icon: Eye,
      tag: "Client-Side Vision"
    },
    {
      step: "02",
      title: t.pipe2Title,
      desc: t.pipe2Desc,
      icon: Hand,
      tag: "63-D Scale Invariant"
    },
    {
      step: "03",
      title: t.pipe3Title,
      desc: t.pipe3Desc,
      icon: Zap,
      tag: "98.85% Trained Model"
    },
    {
      step: "04",
      title: t.pipe4Title,
      desc: t.pipe4Desc,
      icon: Trophy,
      tag: "Accessible UI"
    }
  ];

  const activeSign = PREVIEW_SIGNS[activePreview];

  return (
    <div className="space-y-16 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-linear-to-b from-white/90 via-white/80 to-primary/5 p-6 sm:p-10 md:p-12 shadow-sm backdrop-blur-md">
        {/* Decorative background glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Heading, Badges, & CTAs */}
          <div className="space-y-6 lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-bold text-primary shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                <span>{t.heroBadge}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{t.heroAccuracyBadge}</span>
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-5xl leading-[1.15]">
              {t.heroHeadingStart}{" "}
              <span className="bg-linear-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {t.heroHeadingGradient}
              </span>{" "}
              {t.heroHeadingEnd}
            </h1>

            <p className="max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t.heroDesc}
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onStartLearning("basic")}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-primary/90 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>{t.btnStartLearning}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onOpenTest}
                className="inline-flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-5 py-3.5 text-sm font-bold text-primary hover:bg-primary/20 transition-all cursor-pointer shadow-2xs hover:scale-[1.02]"
              >
                <Award className="h-4 w-4 text-primary" />
                <span>{t.tabTest}</span>
              </button>

              <button
                onClick={() => onStartLearning("alphabets")}
                className="inline-flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-3.5 text-sm font-bold text-amber-700 hover:bg-amber-500/20 transition-all cursor-pointer shadow-2xs"
              >
                <span>{t.btnAlphabets}</span>
              </button>

              <button
                onClick={() => triggerEmergency("Manual SOS distress test from homepage")}
                className="inline-flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-3.5 text-sm font-bold text-rose-600 hover:bg-rose-500/20 transition-all cursor-pointer shadow-2xs"
              >
                <ShieldAlert className="h-4 w-4 text-rose-600" />
                <span>{t.btnSosDemo}</span>
              </button>
            </div>

            {/* Quick Stats Ribbon */}
            <div className="grid grid-cols-3 gap-3 border-t border-border/60 pt-6 max-w-lg">
              <div>
                <p className="text-xl font-black text-foreground">{t.statTotalSigns}</p>
                <p className="text-xs text-muted-foreground">{t.statTotalSignsDesc}</p>
              </div>
              <div>
                <p className="text-xl font-black text-emerald-600">{t.statFps}</p>
                <p className="text-xs text-muted-foreground">{t.statFpsDesc}</p>
              </div>
              <div>
                <p className="text-xl font-black text-primary">{t.statGps}</p>
                <p className="text-xs text-muted-foreground">{t.statGpsDesc}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Featured Signs Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-border bg-card/90 p-5 shadow-lg backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-foreground">{t.previewTitle}</span>
                </div>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                  {t.previewTapPrompt}
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
                    <span className="text-[11px] mt-1 truncate w-full font-bold">{item.name}</span>
                  </button>
                ))}
              </div>

              {/* Active Sign Detail Showcase */}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">{activeSign.emoji}</span>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{activeSign.name}</h4>
                      <span className="text-[10px] uppercase font-bold text-primary">
                        {activeSign.tag}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 text-[10px] font-bold">
                    {t.previewAiValidated}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {activeSign.desc}
                </p>

                {activeSign.cat === "emergency" ? (
                  <button
                    onClick={() => triggerEmergency("SOS preview test")}
                    className="w-full rounded-xl bg-rose-600 text-white py-2.5 text-xs font-bold hover:bg-rose-500 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <ShieldAlert className="h-3.5 w-3.5" /> {t.previewSosBtn}
                  </button>
                ) : (
                  <button
                    onClick={() => onStartLearning(activeSign.cat)}
                    className="w-full rounded-xl bg-primary text-white py-2.5 text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Play className="h-3.5 w-3.5" /> {t.previewPracticeBtn}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STRUCTURED CURRICULUM LEVELS */}
      <section className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">{t.curriculumSubtitle}</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {t.curriculumHeading}
            </h2>
          </div>

          <button
            onClick={() => onStartLearning("basic")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            <span>{t.openLearningLab}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LESSON_MODULES.map((mod) => (
            <div
              key={mod.id}
              className={`flex flex-col justify-between rounded-3xl border p-6 bg-linear-to-b ${mod.color} bg-card/80 transition-all hover:shadow-md hover:scale-[1.01]`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider">{mod.level}</span>
                  <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] font-bold text-foreground shadow-2xs">
                    {mod.count}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground">{mod.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{mod.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/40">
                <button
                  onClick={() => onStartLearning(mod.id)}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-2.5 text-xs font-bold shadow-2xs transition-all cursor-pointer ${
                    mod.id === "emergency"
                      ? "bg-rose-600 text-white hover:bg-rose-500"
                      : "bg-white text-foreground hover:bg-primary hover:text-white"
                  }`}
                >
                  <span>{t.btnStartLevel}</span>
                  {mod.id === "emergency" ? (
                    <ShieldAlert className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MODULE 2: SMART SOS EMERGENCY SPOTLIGHT */}
      <section className="relative overflow-hidden rounded-3xl border border-rose-500/30 bg-linear-to-r from-rose-500/10 via-rose-500/5 to-amber-500/10 p-6 sm:p-8 md:p-10 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
          <div className="space-y-4 lg:col-span-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/15 px-3.5 py-1 text-xs font-bold text-rose-600">
              <Shield className="h-4 w-4" />
              <span>{t.mod2Tag}</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              {t.mod2Heading}
            </h2>
            
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {t.mod2Desc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="rounded-xl border border-rose-500/20 bg-white/60 p-3 backdrop-blur-xs">
                <span className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                  <MapPin className="h-3.5 w-3.5" /> {t.mod2GpsTitle}
                </span>
                <p className="text-[11px] text-muted-foreground mt-1">{t.mod2GpsDesc}</p>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-white/60 p-3 backdrop-blur-xs">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <MessageCircle className="h-3.5 w-3.5" /> {t.mod2WhatsappTitle}
                </span>
                <p className="text-[11px] text-muted-foreground mt-1">{t.mod2WhatsappDesc}</p>
              </div>

              <div className="rounded-xl border border-blue-500/20 bg-white/60 p-3 backdrop-blur-xs">
                <span className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                  <PhoneCall className="h-3.5 w-3.5" /> {t.mod2CallTitle}
                </span>
                <p className="text-[11px] text-muted-foreground mt-1">{t.mod2CallDesc}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:col-span-4 lg:items-end">
            <button
              onClick={() => triggerEmergency("Campus Fire Alarm Simulation")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-destructive px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-destructive/90 transition-all cursor-pointer"
            >
              <Flame className="h-4 w-4" />
              <span>{t.btnSimulateFire}</span>
            </button>
            <button
              onClick={onOpenSOS}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-6 py-3 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer shadow-2xs"
            >
              <ShieldAlert className="h-4 w-4 text-rose-600" />
              <span>{t.btnOpenSos}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. HOW THE AI VISION ENGINE WORKS */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">{t.pipelineSubtitle}</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t.pipelineHeading}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {PIPELINE_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="relative rounded-3xl border border-border bg-card p-6 shadow-xs hover:shadow-md transition-all space-y-4 group hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white font-black text-sm shadow-xs">
                    {step.step}
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

      {/* 6. PROJECT & DEVELOPER FOOTER */}
      <footer className="border-t border-border/80 pt-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-3 font-bold text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white shadow-2xs">
              <Hand className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-sm">{t.footerTitle}</span>
              <span className="text-[11px] font-normal text-muted-foreground">
                {t.footerAuthor}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenTest}
              className="text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              {t.tabTest}
            </button>
            <span className="text-muted-foreground">·</span>
            <button
              onClick={() => onStartLearning("alphabets")}
              className="text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Level 3 Alphabets (A-Z)
            </button>
            <span className="text-muted-foreground">·</span>
            <button
              onClick={onOpenTeacher}
              className="text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Teacher Panel
            </button>
            <span className="text-muted-foreground">·</span>
            <button
              onClick={() => triggerEmergency("Footer SOS trigger")}
              className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Smart SOS
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between border-t border-border/40 pt-4 text-[11px] text-muted-foreground">
          <p>{t.footerRights}</p>
          <p>{t.footerEmergency}</p>
        </div>
      </footer>
    </div>
  );
}
