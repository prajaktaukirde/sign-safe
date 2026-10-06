import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, Hand, Volume2, Trash2, RotateCcw, Copy, Check, 
  ChevronLeft, Award, Star, CheckCircle2, Play, Plus, Zap, MessageSquare, AlertOctagon, Flame
} from "lucide-react";
import { useLanguage, Language } from "@/lib/translations";
import { WebcamMock } from "./WebcamMock";
import { SIGN_TRANSLATIONS, getSignDetails } from "./StudentView";

interface SentenceToken {
  id: string;
  signKey: string;
  name: string;
  emoji: string;
  category: "greetings" | "colors" | "alphabets" | "emergency";
}

interface SentenceQuest {
  id: string;
  title: Record<Language, string>;
  desc: Record<Language, string>;
  targetTokens: string[];
  xp: number;
  badge: string;
}

const SIGN_EMOJIS: Record<string, string> = {
  "Namaste": "🙏",
  "Hello": "👋",
  "Good Morning": "☀️",
  "Good Afternoon": "🌤️",
  "Good Evening": "🌆",
  "Good Night": "🌙",
  "Good Day": "👍",
  "How Are You": "❓",
  "Happy Birthday": "🎂",
  "Happy Anniversary": "💐",
  "Black": "⚫",
  "Brown": "🟤",
  "Green": "🟢",
  "Grey": "⚪",
  "Orange": "🍊",
  "Pink": "🌸",
  "Red": "🔴",
  "Violet": "🟣",
  "White": "🤍",
  "Yellow": "🟡",
  "Help": "🆘",
  "Safe": "🛡️",
};

const QUESTS: SentenceQuest[] = [
  {
    id: "greetings_flow",
    title: {
      en: "🌅 Morning Greeting Flow",
      hi: "🌅 प्रातःकालीन अभिवादन प्रवाह",
      mr: "🌅 सकाळचे संभाषण आव्हान"
    },
    desc: {
      en: "Sign 'Good Morning' ➔ 'Namaste' ➔ 'How Are You'",
      hi: "'सुप्रभात' ➔ 'नमस्ते' ➔ 'आप कैसे हैं?' का संकेत करें",
      mr: "'शुभ सकाळ' ➔ 'नमस्कार' ➔ 'तुम्ही कसे आहात?' हे चिन्ह करा"
    },
    targetTokens: ["Good Morning", "Namaste", "How Are You"],
    xp: 50,
    badge: "Master Greeter 🏅"
  },
  {
    id: "colors_palette",
    title: {
      en: "🎨 Color Trio Palette",
      hi: "🎨 रंग त्रिक चुनौती",
      mr: "🎨 रंग संयोजन आव्हान"
    },
    desc: {
      en: "Sign 'Black' ➔ 'Red' ➔ 'Pink'",
      hi: "'काला' ➔ 'लाल' ➔ 'गुलाबी' का संकेत करें",
      mr: "'काळा' ➔ 'लाल' ➔ 'गुलाबी' हे चिन्ह करा"
    },
    targetTokens: ["Black", "Red", "Pink"],
    xp: 50,
    badge: "Color Artist 🎨"
  },
  {
    id: "emergency_rescue",
    title: {
      en: "🚨 Safety & Rescue Protocol",
      hi: "🚨 सुरक्षा एवं बचाव प्रोटोकॉल",
      mr: "🚨 आपत्कालीन सुरक्षा प्रोटोकॉल"
    },
    desc: {
      en: "Sign 'Help' ➔ 'Safe'",
      hi: "'मदद' ➔ 'सुरक्षित' का संकेत करें",
      mr: "'मदत' ➔ 'सुरक्षित' हे चिन्ह करा"
    },
    targetTokens: ["Help", "Safe"],
    xp: 60,
    badge: "Rescue Hero 🛡️"
  }
];

export function SentenceBuilder({ onBack }: { onBack?: () => void }) {
  const { language, t } = useLanguage();
  const [tokens, setTokens] = useState<SentenceToken[]>([]);
  const [activeGesture, setActiveGesture] = useState<string | null>(null);
  const [holdProgress, setHoldProgress] = useState<number>(0);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeQuestIdx, setActiveQuestIdx] = useState<number>(0);
  const [completedQuests, setCompletedQuests] = useState<Record<string, boolean>>({});
  const [totalXp, setTotalXp] = useState<number>(150);

  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastCommittedSign = useRef<string | null>(null);

  // Synthesize grammatical sentence from token sequence
  const constructSentence = (items: SentenceToken[], lang: Language): string => {
    if (items.length === 0) return "";

    const keys = items.map(t => t.signKey);
    const keyStr = keys.join("+");

    // Pre-mapped compound conversational sentence rules
    if (keyStr === "Good Morning+Namaste+How Are You") {
      if (lang === "mr") return "शुभ सकाळ! नमस्कार, तुम्ही कसे आहात?";
      if (lang === "hi") return "सुप्रभात! नमस्ते, आप कैसे हैं?";
      return "Good morning! Namaste, how are you doing today?";
    }
    if (keyStr === "Namaste+How Are You") {
      if (lang === "mr") return "नमस्कार! तुम्ही कसे आहात?";
      if (lang === "hi") return "नमस्ते! आप कैसे हैं?";
      return "Namaste! How are you doing?";
    }
    if (keyStr === "Hello+How Are You") {
      if (lang === "mr") return "हॅलो! आपण कसे आहात?";
      if (lang === "hi") return "हैलो! आप कैसे हैं?";
      return "Hello! How are you?";
    }
    if (keyStr === "Black+Red+Pink") {
      if (lang === "mr") return "काळा, लाल आणि गुलाबी रंग.";
      if (lang === "hi") return "काला, लाल और गुलाबी रंग।";
      return "Black, red, and pink colors.";
    }
    if (keyStr === "Help+Safe") {
      if (lang === "mr") return "मला मदतीची गरज आहे, कृपया सर्वांना सुरक्षित करा.";
      if (lang === "hi") return "मुझे सहायता चाहिए, कृपया सभी को सुरक्षित करें।";
      return "I need assistance. Please ensure everyone is safe.";
    }
    if (keyStr === "Good Night+Namaste") {
      if (lang === "mr") return "शुभ रात्री! नमस्कार.";
      if (lang === "hi") return "शुभ रात्रि! नमस्ते।";
      return "Good night! Namaste.";
    }

    // Generic natural sentence joiner for arbitrary sequences
    const localizedWords = items.map(item => {
      const details = getSignDetails(item.signKey, lang);
      return details.name.split(" ")[0] || item.name;
    });

    if (lang === "mr") {
      return localizedWords.join(", ") + ".";
    }
    if (lang === "hi") {
      return localizedWords.join(", ") + "।";
    }
    return localizedWords.join(", ") + ".";
  };

  const synthesizedSentence = constructSentence(tokens, language);

  // Add token helper
  const addToken = (signKey: string) => {
    const details = getSignDetails(signKey, language);
    const emoji = SIGN_EMOJIS[signKey] || (signKey.startsWith("Letter") ? "🔤" : "✨");
    
    let cat: SentenceToken["category"] = "greetings";
    if (["Black", "Red", "Pink", "Yellow", "Green", "White", "Violet", "Brown", "Grey", "Orange"].includes(signKey)) {
      cat = "colors";
    } else if (["Help", "Safe"].includes(signKey)) {
      cat = "emergency";
    } else if (signKey.startsWith("Letter")) {
      cat = "alphabets";
    }

    const newToken: SentenceToken = {
      id: Math.random().toString(36).slice(2, 9),
      signKey,
      name: details.name,
      emoji,
      category: cat
    };

    setTokens(prev => [...prev, newToken]);
    setLockedNotice(`${details.name} added!`);
    setTimeout(() => setLockedNotice(null), 2000);
  };

  // Remove single token
  const removeToken = (id: string) => {
    setTokens(prev => prev.filter(t => t.id !== id));
  };

  // Undo last token
  const undoLast = () => {
    setTokens(prev => prev.slice(0, -1));
  };

  // Clear all tokens
  const clearAll = () => {
    setTokens([]);
  };

  // Copy to clipboard
  const copySentence = () => {
    if (!synthesizedSentence) return;
    navigator.clipboard.writeText(synthesizedSentence);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Speak synthesized sentence with SpeechSynthesis (Polly / Browser Engine)
  const speakSentence = () => {
    if (!synthesizedSentence || isSpeaking) return;
    setIsSpeaking(true);

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(synthesizedSentence);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      
      if (language === "hi") {
        utterance.lang = "hi-IN";
      } else if (language === "mr") {
        utterance.lang = "mr-IN";
      } else {
        utterance.lang = "en-IN";
      }

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSpeaking(false), 2000);
    }
  };

  // Check quest completion
  useEffect(() => {
    const currentQuest = QUESTS[activeQuestIdx];
    if (!currentQuest) return;

    const tokenKeys = tokens.map(t => t.signKey);
    const targetKeys = currentQuest.targetTokens;

    // Check if tokenKeys contain targetKeys in sequence
    let isMatch = false;
    if (tokenKeys.length >= targetKeys.length) {
      const lastN = tokenKeys.slice(-targetKeys.length);
      isMatch = targetKeys.every((key, idx) => lastN[idx] === key);
    }

    if (isMatch && !completedQuests[currentQuest.id]) {
      setCompletedQuests(prev => ({ ...prev, [currentQuest.id]: true }));
      setTotalXp(prev => prev + currentQuest.xp);
      setLockedNotice(`🎉 Quest Completed! +${currentQuest.xp} XP`);
    }
  }, [tokens, activeQuestIdx, completedQuests]);

  // Handle incoming camera gesture with 1.2s Hold-to-Lock
  const handleGestureDetected = (gesture: string) => {
    if (!gesture || gesture === "—" || gesture === "…") {
      setActiveGesture(null);
      setHoldProgress(0);
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
        holdTimerRef.current = null;
      }
      return;
    }

    const matchedKey = Object.keys(SIGN_EMOJIS).find(
      k => k.toLowerCase() === gesture.toLowerCase().trim()
    ) || gesture;

    if (activeGesture !== matchedKey) {
      setActiveGesture(matchedKey);
      setHoldProgress(0);
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
      }

      let elapsed = 0;
      holdTimerRef.current = setInterval(() => {
        elapsed += 100;
        const pct = Math.min(100, Math.round((elapsed / 1200) * 100));
        setHoldProgress(pct);

        if (elapsed >= 1200) {
          if (holdTimerRef.current) {
            clearInterval(holdTimerRef.current);
            holdTimerRef.current = null;
          }
          if (lastCommittedSign.current !== matchedKey || tokens.length === 0) {
            addToken(matchedKey);
            lastCommittedSign.current = matchedKey;
          }
          setHoldProgress(0);
        }
      }, 100);
    }
  };

  const currentQuest = QUESTS[activeQuestIdx];

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="h-4 w-4 text-primary" />
              <span>{t.backToLessons}</span>
            </button>
          )}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              {t.sentenceBuilderTitle}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
              {t.sentenceBuilderDesc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-700 flex items-center gap-1.5">
            <Award className="h-4 w-4 text-amber-600" />
            <span>{totalXp} XP</span>
          </span>
          <span className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>30 FPS Active</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Camera on Left, Sentence Ribbon & Controls on Right */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Live AI Camera & Hold Detector */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  AI Continuous Vision Engine
                </span>
              </div>
              <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                {t.holdSignPrompt}
              </span>
            </div>

            {/* Camera Feed */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-border/80 aspect-video flex items-center justify-center">
              <WebcamMock 
                targetSign={null} 
                onGestureDetected={handleGestureDetected}
              />

              {/* Hold Progress Overlay */}
              {activeGesture && holdProgress > 0 && (
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-black/80 backdrop-blur-md p-3 border border-primary/40 flex items-center justify-between text-white shadow-xl animate-fadeIn">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{SIGN_EMOJIS[activeGesture] || "🖐️"}</span>
                    <div>
                      <p className="text-xs font-bold">{activeGesture}</p>
                      <p className="text-[10px] text-slate-300">{t.holdingSign}</p>
                    </div>
                  </div>
                  <div className="w-24 bg-slate-700 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-primary h-2.5 rounded-full transition-all duration-100"
                      style={{ width: `${holdProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Notification Banner */}
            {lockedNotice && (
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 text-xs font-bold text-emerald-700 flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{lockedNotice}</span>
              </div>
            )}

            {/* Quick Add Token Tray for Instant Testing */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                {t.quickAddSign} (Tap to append token)
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                {Object.keys(SIGN_EMOJIS).map((key) => (
                  <button
                    key={key}
                    onClick={() => addToken(key)}
                    className="inline-flex items-center gap-1 rounded-xl border border-border bg-muted/40 hover:bg-primary/10 hover:border-primary/40 px-2.5 py-1 text-xs font-bold text-foreground transition-all cursor-pointer shadow-2xs hover:scale-105"
                  >
                    <span>{SIGN_EMOJIS[key]}</span>
                    <span>{getSignDetails(key, language).name.split(" ")[0]}</span>
                    <Plus className="h-3 w-3 text-muted-foreground ml-0.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sentence Ribbon, Formed Sentence & Polly Voice */}
        <div className="lg:col-span-6 space-y-4">
          {/* Active Sentence Workspace Card */}
          <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-md space-y-5">
            {/* Header: Ribbon Controls */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-primary" />
                {t.signedTokensLabel} ({tokens.length})
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={undoLast}
                  disabled={tokens.length === 0}
                  className="rounded-xl border border-border bg-muted/30 hover:bg-muted px-2.5 py-1 text-xs font-bold text-foreground disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-1"
                  title={t.undoTokenBtn}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t.undoTokenBtn}</span>
                </button>
                <button
                  onClick={clearAll}
                  disabled={tokens.length === 0}
                  className="rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 px-2.5 py-1 text-xs font-bold disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-1"
                  title={t.clearTokensBtn}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t.clearTokensBtn}</span>
                </button>
              </div>
            </div>

            {/* Tokens Ribbon Box */}
            <div className="min-h-24 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-3.5 flex flex-wrap items-center gap-2">
              {tokens.length === 0 ? (
                <p className="text-xs text-muted-foreground italic text-center w-full py-4">
                  {t.noTokensYet}
                </p>
              ) : (
                tokens.map((token, index) => (
                  <div
                    key={token.id}
                    className="inline-flex items-center gap-1.5 rounded-2xl bg-white border border-border px-3 py-1.5 text-xs font-bold text-foreground shadow-sm animate-scaleIn"
                  >
                    <span className="text-base">{token.emoji}</span>
                    <span>{token.name}</span>
                    <button
                      onClick={() => removeToken(token.id)}
                      className="ml-1 text-muted-foreground hover:text-rose-600 rounded-full p-0.5 cursor-pointer"
                      title="Remove token"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Synthesized Natural Sentence Display */}
            <div className="rounded-2xl border border-border bg-muted/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-amber-500" />
                  {t.formedSentenceLabel}
                </span>
                <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
                  Amazon Bedrock Grammar Core
                </span>
              </div>

              <div className="rounded-xl bg-white p-3.5 border border-border shadow-2xs min-h-16 flex items-center">
                <p className="text-sm font-bold text-foreground leading-relaxed">
                  {synthesizedSentence || "—"}
                </p>
              </div>

              {/* Action Buttons: Speak & Copy */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={speakSentence}
                  disabled={!synthesizedSentence || isSpeaking}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-4 text-xs transition-all shadow-md cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
                >
                  <Volume2 className={`h-4 w-4 ${isSpeaking ? "animate-bounce text-amber-300" : ""}`} />
                  <span>{isSpeaking ? "Speaking..." : t.speakSentenceBtn}</span>
                </button>

                <button
                  onClick={copySentence}
                  disabled={!synthesizedSentence}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-white hover:bg-muted text-foreground font-bold py-2.5 px-3.5 text-xs transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
                  title={t.copySentenceBtn}
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  <span className="hidden sm:inline">{copied ? "Copied!" : t.copySentenceBtn}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Gamified Sentence Practice Quests Card */}
          <div className="rounded-3xl border border-border bg-card p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500" />
                  {t.sentenceQuestsTitle}
                </h3>
                <p className="text-[11px] text-muted-foreground">{t.sentenceQuestsDesc}</p>
              </div>
            </div>

            {/* Quests Selector & Progress */}
            <div className="space-y-2.5">
              {QUESTS.map((quest, qIdx) => {
                const isCompleted = completedQuests[quest.id];
                const isActive = activeQuestIdx === qIdx;
                return (
                  <button
                    key={quest.id}
                    onClick={() => setActiveQuestIdx(qIdx)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActive 
                        ? "border-primary bg-primary/5 shadow-xs" 
                        : "border-border bg-muted/20 hover:bg-muted/40"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">{quest.title[language]}</span>
                        {isCompleted && (
                          <span className="rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                            ✓ Done
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground">{quest.desc[language]}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-xl shrink-0">
                      +{quest.xp} XP
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
