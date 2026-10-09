import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Trophy, Sparkles, Hand, CheckCircle2, XCircle, AlertCircle,
  Timer, ChevronRight, ChevronLeft, RefreshCw, Play, Award,
  Volume2, Printer, BookOpen, Palette, Compass, ShieldAlert,
  Eye, HelpCircle, Flame, Zap, RotateCcw, Share2,
  Briefcase, Users, MessageSquare
} from "lucide-react";
import { WebcamMock } from "./WebcamMock";
import { useDemo } from "@/lib/demo-store";
import { useLanguage, Language } from "@/lib/translations";
import { CATEGORIES, getSignDetails, Sign } from "./StudentView";
import { saveProgressRecord } from "@/lib/progress-store";

export interface TestQuestion {
  id: number;
  sign: Sign;
  categoryKey: string;
  options?: string[]; // 4 multiple choice options for quiz mode
}

export interface QuestionResult {
  questionId: number;
  signName: string;
  isCorrect: boolean;
  score: number;
  selectedOption?: string;
  timeSpent: number;
}

interface TestSectionProps {
  onBackToHome?: () => void;
  onBackToLearn?: () => void;
}

export function TestSection({ onBackToHome, onBackToLearn }: TestSectionProps) {
  const { gestureOutput, simulateSpeech, setActiveSign } = useDemo();
  const { language, t } = useLanguage();

  // Test Arena State
  const [testState, setTestState] = useState<"lobby" | "in_test" | "completed">("lobby");
  const [selectedCategory, setSelectedCategory] = useState<string>("basic");
  const [testMode, setTestMode] = useState<"camera" | "quiz">("camera");
  const [timeLimit, setTimeLimit] = useState<number>(20); // 0 = untimed, 15s, 20s, 30s
  
  // Active Test States
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [questionStatus, setQuestionStatus] = useState<"answering" | "correct" | "incorrect" | "timeout">("answering");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [earnedPoints, setEarnedPoints] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const timerRef = useRef<any>(null);

  const currentQuestion = questions[currentIdx] || null;
  const currentLocalizedSign = currentQuestion ? getSignDetails(currentQuestion.sign.name, language) : null;

  // Build assessment modules list
  const TEST_MODULES = [
    {
      id: "basic",
      title: t.testLevel1Title,
      desc: t.testLevel1Desc,
      icon: Compass,
      count: "10 Signs",
      badge: "🌱 Level 1",
      color: "border-blue-500/30 bg-blue-500/5 hover:border-blue-500 text-blue-600"
    },
    {
      id: "colors",
      title: t.testLevel2Title,
      desc: t.testLevel2Desc,
      icon: Palette,
      count: "10 Signs",
      badge: "🎨 Level 2",
      color: "border-purple-500/30 bg-purple-500/5 hover:border-purple-500 text-purple-600"
    },
    {
      id: "alphabets",
      title: t.testLevel3Title,
      desc: t.testLevel3Desc,
      icon: BookOpen,
      count: "10 Random Letters",
      badge: "🔤 Level 3",
      color: "border-amber-500/30 bg-amber-500/5 hover:border-amber-500 text-amber-600"
    },
    {
      id: "festivals",
      title: t.testLevel4Title,
      desc: t.testLevel4Desc,
      icon: Sparkles,
      count: "12 Festival Signs",
      badge: "🎉 Level 4",
      color: "border-pink-500/30 bg-pink-500/5 hover:border-pink-500 text-pink-600"
    },
    {
      id: "numbers",
      title: t.testLevel5Title,
      desc: t.testLevel5Desc,
      icon: Award,
      count: "10 Random Numbers",
      badge: "🔢 Level 5",
      color: "border-indigo-500/30 bg-indigo-500/5 hover:border-indigo-500 text-indigo-600"
    },
    {
      id: "jobs",
      title: t.testLevel6Title,
      desc: t.testLevel6Desc,
      icon: Briefcase,
      count: "9 Career Signs",
      badge: "💼 Level 6",
      color: "border-teal-500/30 bg-teal-500/5 hover:border-teal-500 text-teal-600"
    },
    {
      id: "relations",
      title: t.testLevel7Title,
      desc: t.testLevel7Desc,
      icon: Users,
      count: "12 Kinship Signs",
      badge: "👨‍👩‍👧‍👦 Level 7",
      color: "border-fuchsia-500/30 bg-fuchsia-500/5 hover:border-fuchsia-500 text-fuchsia-600"
    },
    {
      id: "questions",
      title: t.testLevel8Title,
      desc: t.testLevel8Desc,
      icon: HelpCircle,
      count: "12 Question Signs",
      badge: "❓ Level 8",
      color: "border-amber-500/30 bg-amber-500/5 hover:border-amber-500 text-amber-600"
    },
    {
      id: "sentences",
      title: t.testLevel9Title,
      desc: t.testLevel9Desc,
      icon: MessageSquare,
      count: "15 Dialog Signs",
      badge: "💬 Level 9",
      color: "border-sky-500/30 bg-sky-500/5 hover:border-sky-500 text-sky-600"
    },
    {
      id: "emergency",
      title: t.testLevel10Title,
      desc: t.testLevel10Desc,
      icon: ShieldAlert,
      count: "3 Safety Signs",
      badge: "🚨 Level 10",
      color: "border-rose-500/30 bg-rose-500/5 hover:border-rose-500 text-rose-600"
    },
    {
      id: "mixed",
      title: t.testMixedTitle,
      desc: t.testMixedDesc,
      icon: Trophy,
      count: "10 Mixed Challenges",
      badge: "⚡ Grand Exam",
      color: "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500 text-emerald-600"
    }
  ];

  // Helper to generate question list
  const generateQuestions = (catKey: string): TestQuestion[] => {
    let pool: { sign: Sign; cat: string }[] = [];

    if (catKey === "mixed") {
      // Pick 1 question from each of the 10 categories
      const bSigns = [...(CATEGORIES.basic?.signs || [])].sort(() => 0.5 - Math.random()).slice(0, 1);
      const cSigns = [...(CATEGORIES.colors?.signs || [])].sort(() => 0.5 - Math.random()).slice(0, 1);
      const aSigns = [...(CATEGORIES.alphabets?.signs || [])].sort(() => 0.5 - Math.random()).slice(0, 1);
      const fSigns = [...(CATEGORIES.festivals?.signs || [])].sort(() => 0.5 - Math.random()).slice(0, 1);
      const nSigns = [...(CATEGORIES.numbers?.signs || [])].sort(() => 0.5 - Math.random()).slice(0, 1);
      const jSigns = [...(CATEGORIES.jobs?.signs || [])].sort(() => 0.5 - Math.random()).slice(0, 1);
      const rSigns = [...(CATEGORIES.relations?.signs || [])].sort(() => 0.5 - Math.random()).slice(0, 1);
      const qSigns = [...(CATEGORIES.questions?.signs || [])].sort(() => 0.5 - Math.random()).slice(0, 1);
      const sSigns = [...(CATEGORIES.sentences?.signs || [])].sort(() => 0.5 - Math.random()).slice(0, 1);
      const eSigns = [...(CATEGORIES.emergency?.signs || [])].sort(() => 0.5 - Math.random()).slice(0, 1);

      pool = [
        ...bSigns.map(s => ({ sign: s, cat: "basic" })),
        ...cSigns.map(s => ({ sign: s, cat: "colors" })),
        ...aSigns.map(s => ({ sign: s, cat: "alphabets" })),
        ...fSigns.map(s => ({ sign: s, cat: "festivals" })),
        ...nSigns.map(s => ({ sign: s, cat: "numbers" })),
        ...jSigns.map(s => ({ sign: s, cat: "jobs" })),
        ...rSigns.map(s => ({ sign: s, cat: "relations" })),
        ...qSigns.map(s => ({ sign: s, cat: "questions" })),
        ...sSigns.map(s => ({ sign: s, cat: "sentences" })),
        ...eSigns.map(s => ({ sign: s, cat: "emergency" })),
      ].sort(() => 0.5 - Math.random());
    } else if (catKey === "alphabets") {
      // Pick 10 random letters from A-Z
      const shuffled = [...(CATEGORIES.alphabets?.signs || [])].sort(() => 0.5 - Math.random()).slice(0, 10);
      pool = shuffled.map(s => ({ sign: s, cat: "alphabets" }));
    } else if (catKey === "numbers") {
      // Pick 10 random numbers
      const shuffled = [...(CATEGORIES.numbers?.signs || [])].sort(() => 0.5 - Math.random()).slice(0, 10);
      pool = shuffled.map(s => ({ sign: s, cat: "numbers" }));
    } else {
      const cat = CATEGORIES[catKey] || CATEGORIES.basic;
      pool = (cat?.signs || []).map(s => ({ sign: s, cat: catKey }));
    }

    // Generate options for Quiz mode (4 choices per question)
    const allSignNames = Object.values(CATEGORIES).flatMap(c => c.signs.map(s => s.name));

    return pool.map((item, idx) => {
      const distractors = allSignNames
        .filter(name => name !== item.sign.name)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const options = [item.sign.name, ...distractors].sort(() => 0.5 - Math.random());

      return {
        id: idx + 1,
        sign: item.sign,
        categoryKey: item.cat,
        options
      };
    });
  };

  // Start Assessment
  const handleStartTest = () => {
    const qList = generateQuestions(selectedCategory);
    setQuestions(qList);
    setCurrentIdx(0);
    setResults([]);
    setEarnedPoints(0);
    setQuestionStatus("answering");
    setSelectedOption(null);
    setTimeLeft(timeLimit);
    setQuestionStartTime(Date.now());
    setTestState("in_test");

    if (qList.length > 0) {
      setActiveSign(qList[0].sign.name);
      const loc = getSignDetails(qList[0].sign.name, language);
      simulateSpeech(`Question 1: Please demonstrate the sign for ${loc.name}`);
    }
  };

  // Timer Tick
  useEffect(() => {
    if (testState !== "in_test" || timeLimit === 0 || questionStatus !== "answering") return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testState, currentIdx, questionStatus, timeLimit]);

  // Handle Timeout
  const handleTimeout = () => {
    if (questionStatus !== "answering" || !currentQuestion) return;
    setQuestionStatus("timeout");
    const spent = Math.round((Date.now() - questionStartTime) / 1000);

    setResults(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        signName: currentQuestion.sign.name,
        isCorrect: false,
        score: 0,
        timeSpent: spent
      }
    ]);
  };

  // Advance to Next Question or Finish
  const handleNextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setQuestionStatus("answering");
      setSelectedOption(null);
      setTimeLeft(timeLimit);
      setQuestionStartTime(Date.now());
      setActiveSign(questions[nextIdx].sign.name);

      const loc = getSignDetails(questions[nextIdx].sign.name, language);
      simulateSpeech(`Question ${nextIdx + 1}: ${loc.name}`);
    } else {
      // Completed Test
      setActiveSign(null);
      setTestState("completed");
    }
  };

  // AI Camera Gesture Matching
  useEffect(() => {
    if (testState !== "in_test" || testMode !== "camera" || questionStatus !== "answering" || !currentQuestion) {
      return;
    }

    if (gestureOutput && gestureOutput !== "—" && gestureOutput !== "…") {
      const outputNorm = gestureOutput.trim().toLowerCase();
      const mappedNorm = currentQuestion.sign.mappedGesture.trim().toLowerCase();
      const nameNorm = currentQuestion.sign.name.trim().toLowerCase();

      const isDirectMatch = 
        outputNorm === mappedNorm || 
        outputNorm === nameNorm || 
        outputNorm.replace("letter ", "") === nameNorm || 
        outputNorm.replace("letter ", "") === mappedNorm;
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
        (nameNorm === "pink" && outputNorm === "pink") ||
        (nameNorm === "diwali" && (outputNorm === "diwali" || outputNorm.includes("diwali"))) ||
        (nameNorm === "holi" && (outputNorm === "holi" || outputNorm.includes("holi"))) ||
        (nameNorm === "christmas" && (outputNorm === "christmas" || outputNorm.includes("christmas"))) ||
        (nameNorm === "eid" && (outputNorm === "eid" || outputNorm.includes("eid"))) ||
        (nameNorm === "ganesh chaturthi" && (outputNorm === "ganesh chaturthi" || outputNorm === "ganesh" || outputNorm.includes("ganesh"))) ||
        (nameNorm === "navratri" && (outputNorm === "navratri" || outputNorm.includes("navratri") || outputNorm.includes("dandiya"))) ||
        (nameNorm === "durga puja" && (outputNorm === "durga puja" || outputNorm === "durga" || outputNorm.includes("durga"))) ||
        (nameNorm === "dussehra" && (outputNorm === "dussehra" || outputNorm.includes("dussehra") || outputNorm.includes("bow"))) ||
        (nameNorm === "raksha bandhan" && (outputNorm === "raksha bandhan" || outputNorm === "rakhi" || outputNorm.includes("raksha"))) ||
        (nameNorm === "janmashtami" && (outputNorm === "janmashtami" || outputNorm.includes("janmashtami") || outputNorm.includes("flute"))) ||
        (nameNorm === "independence day" && (outputNorm === "independence day" || outputNorm === "flag" || outputNorm.includes("independence"))) ||
        (nameNorm === "republic day" && (outputNorm === "republic day" || outputNorm === "salute" || outputNorm.includes("republic"))) ||
        (nameNorm === "1000" && (outputNorm === "1000" || outputNorm.includes("thousand") || outputNorm.includes("1000"))) ||
        (nameNorm === "10000" && (outputNorm === "10000" || outputNorm.includes("10000") || outputNorm.includes("10 thousand"))) ||
        (nameNorm === "100000" && (outputNorm === "100000" || outputNorm.includes("lakh") || outputNorm.includes("100000"))) ||
        (nameNorm === "1000000" && (outputNorm === "1000000" || outputNorm.includes("million") || outputNorm.includes("10 lakh"))) ||
        (nameNorm === "10cr" && (outputNorm === "10cr" || outputNorm.includes("crore") || outputNorm.includes("10cr"))) ||
        // Level 6: Jobs
        (nameNorm === "teacher" && (outputNorm === "teacher" || outputNorm.includes("teacher"))) ||
        (nameNorm === "doctor" && (outputNorm === "doctor" || outputNorm.includes("doctor"))) ||
        (nameNorm === "driver" && (outputNorm === "driver" || outputNorm.includes("driver"))) ||
        (nameNorm === "farmer" && (outputNorm === "farmer" || outputNorm.includes("farmer"))) ||
        (nameNorm === "lawyer" && (outputNorm === "lawyer" || outputNorm.includes("lawyer"))) ||
        (nameNorm === "barber" && (outputNorm === "barber" || outputNorm.includes("barber"))) ||
        (nameNorm === "postman" && (outputNorm === "postman" || outputNorm.includes("postman"))) ||
        (nameNorm === "sweeper" && (outputNorm === "sweeper" || outputNorm.includes("sweeper"))) ||
        (nameNorm === "writer" && (outputNorm === "writer" || outputNorm.includes("writer"))) ||
        // Level 7: Relations
        (nameNorm === "father" && (outputNorm === "father" || outputNorm.includes("father"))) ||
        (nameNorm === "mother" && (outputNorm === "mother" || outputNorm.includes("mother"))) ||
        (nameNorm === "brother" && (outputNorm === "brother" || outputNorm.includes("brother"))) ||
        (nameNorm === "daughter" && (outputNorm === "daughter" || outputNorm.includes("daughter"))) ||
        (nameNorm === "husband" && (outputNorm === "husband" || outputNorm.includes("husband"))) ||
        (nameNorm === "wife" && (outputNorm === "wife" || outputNorm.includes("wife"))) ||
        (nameNorm === "married" && (outputNorm === "married" || outputNorm.includes("married"))) ||
        (nameNorm === "grandfather" && (outputNorm === "grandfather" || outputNorm.includes("grandfather"))) ||
        (nameNorm === "grandmother" && (outputNorm === "grandmother" || outputNorm.includes("grandmother"))) ||
        (nameNorm === "family" && (outputNorm === "family" || outputNorm.includes("family"))) ||
        (nameNorm === "man" && (outputNorm === "man" || outputNorm.includes("man"))) ||
        (nameNorm === "woman" && (outputNorm === "woman" || outputNorm.includes("woman"))) ||
        // Level 8: Questions
        (nameNorm === "what" && (outputNorm === "what" || outputNorm.includes("what"))) ||
        (nameNorm === "where" && (outputNorm === "where" || outputNorm.includes("where"))) ||
        (nameNorm === "when" && (outputNorm === "when" || outputNorm.includes("when"))) ||
        (nameNorm === "which" && (outputNorm === "which" || outputNorm.includes("which"))) ||
        (nameNorm === "who" && (outputNorm === "who" || outputNorm.includes("who"))) ||
        (nameNorm === "how" && (outputNorm === "how" || outputNorm.includes("how"))) ||
        (nameNorm === "question" && (outputNorm === "question" || outputNorm.includes("question"))) ||
        (nameNorm === "answer" && (outputNorm === "answer" || outputNorm.includes("answer"))) ||
        (nameNorm === "time" && (outputNorm === "time" || outputNorm.includes("time"))) ||
        (nameNorm === "place" && (outputNorm === "place" || outputNorm.includes("place"))) ||
        (nameNorm === "face" && (outputNorm === "face" || outputNorm.includes("face"))) ||
        (nameNorm === "this" && (outputNorm === "this" || outputNorm.includes("this"))) ||
        // Level 9: Sentences
        (nameNorm.includes("nice to meet") && outputNorm.includes("nice to meet")) ||
        (nameNorm.includes("my name") && outputNorm.includes("my name")) ||
        (nameNorm.includes("deaf") && outputNorm.includes("deaf")) ||
        (nameNorm.includes("sign language") && outputNorm.includes("sign language")) ||
        (nameNorm.includes("your name") && outputNorm.includes("your name")) ||
        (nameNorm.includes("where are you from") && outputNorm.includes("where are you from")) ||
        (nameNorm.includes("what do you do") && outputNorm.includes("what do you do")) ||
        (nameNorm.includes("father name") && outputNorm.includes("father name")) ||
        (nameNorm.includes("profession") && outputNorm.includes("profession")) ||
        (nameNorm.includes("healthy") && outputNorm.includes("healthy")) ||
        (nameNorm.includes("slow") && outputNorm.includes("slow")) ||
        (nameNorm.includes("again") && outputNorm.includes("again")) ||
        (nameNorm.includes("fast") && outputNorm.includes("fast")) ||
        (nameNorm.includes("understand") && outputNorm.includes("understand")) ||
        // Level 10: Emergency
        (nameNorm === "safe" && outputNorm === "safe") ||
        (nameNorm === "help" && outputNorm === "help") ||
        (nameNorm === "emergency" && (outputNorm === "emergency" || outputNorm === "danger"));

      if (isDirectMatch || isCompoundMatch) {
        setQuestionStatus("correct");
        setEarnedPoints(p => p + 10);
        const spent = Math.round((Date.now() - questionStartTime) / 1000);
        saveProgressRecord(currentQuestion.sign.name, (currentQuestion.categoryKey as any) || "basic", 96);

        setResults(prev => [
          ...prev,
          {
            questionId: currentQuestion.id,
            signName: currentQuestion.sign.name,
            isCorrect: true,
            score: 10,
            timeSpent: spent
          }
        ]);

        simulateSpeech("Correct! Great job!");
      }
    }
  }, [gestureOutput, currentQuestion, questionStatus, testMode, testState, questionStartTime, simulateSpeech]);

  // Manual Match Assist (Lighting fallback)
  const handleForceMatch = () => {
    if (questionStatus !== "answering" || !currentQuestion) return;
    setQuestionStatus("correct");
    setEarnedPoints(p => p + 10);
    const spent = Math.round((Date.now() - questionStartTime) / 1000);
    saveProgressRecord(currentQuestion.sign.name, (currentQuestion.categoryKey as any) || "basic", 96);

    setResults(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        signName: currentQuestion.sign.name,
        isCorrect: true,
        score: 10,
        timeSpent: spent
      }
    ]);
  };

  // Skip Question
  const handleSkipQuestion = () => {
    if (questionStatus !== "answering" || !currentQuestion) return;
    setQuestionStatus("incorrect");
    const spent = Math.round((Date.now() - questionStartTime) / 1000);

    setResults(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        signName: currentQuestion.sign.name,
        isCorrect: false,
        score: 0,
        timeSpent: spent
      }
    ]);
  };

  // Quiz Option Click
  const handleSelectQuizOption = (option: string) => {
    if (questionStatus !== "answering" || !currentQuestion) return;
    setSelectedOption(option);
    const isCorrect = option === currentQuestion.sign.name;
    const spent = Math.round((Date.now() - questionStartTime) / 1000);

    if (isCorrect) {
      setQuestionStatus("correct");
      setEarnedPoints(p => p + 10);
      saveProgressRecord(currentQuestion.sign.name, (currentQuestion.categoryKey as any) || "basic", 95);
    } else {
      setQuestionStatus("incorrect");
    }

    setResults(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        signName: currentQuestion.sign.name,
        isCorrect,
        score: isCorrect ? 10 : 0,
        selectedOption: option,
        timeSpent: spent
      }
    ]);
  };

  // Performance calculations
  const totalQuestions = questions.length || 1;
  const correctCount = results.filter(r => r.isCorrect).length;
  const accuracyPercentage = Math.round((correctCount / totalQuestions) * 100);

  const getGradeInfo = (acc: number) => {
    if (acc >= 90) return { grade: "A+", label: "🏆 Distinction / A+", color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/30" };
    if (acc >= 75) return { grade: "A", label: "⭐ Excellent / A", color: "text-blue-600 bg-blue-500/10 border-blue-500/30" };
    if (acc >= 50) return { grade: "B", label: "🌱 Pass / B", color: "text-amber-600 bg-amber-500/10 border-amber-500/30" };
    return { grade: "C", label: "📖 Practice Needed", color: "text-rose-600 bg-rose-500/10 border-rose-500/30" };
  };

  const gradeInfo = getGradeInfo(accuracyPercentage);

  return (
    <div className="space-y-6">
      {/* 1. LOBBY / SELECTION SCREEN */}
      {testState === "lobby" && (
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary">
                  <Award className="h-3.5 w-3.5" />
                  <span>{t.tabTest}</span>
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                  AI Computer Vision
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground mt-1.5">
                {t.testArenaTitle}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                {t.testArenaDesc}
              </p>
            </div>

            {onBackToLearn && (
              <button
                onClick={onBackToLearn}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer shadow-2xs"
              >
                <Compass className="h-4 w-4 text-primary" />
                <span>{t.tabLearn}</span>
              </button>
            )}
          </div>

          {/* Test Configuration Controls */}
          <div className="grid gap-6 md:grid-cols-12">
            {/* Left Column: Module Selection */}
            <div className="space-y-4 md:col-span-7">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <Zap className="h-4 w-4" /> {t.selectTestCategory}
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                {TEST_MODULES.map((mod) => {
                  const Icon = mod.icon;
                  const isSelected = selectedCategory === mod.id;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => setSelectedCategory(mod.id)}
                      className={`flex flex-col justify-between p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/30 scale-[1.02]"
                          : "border-border bg-card hover:bg-muted/40"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-extrabold text-foreground shadow-2xs">
                            {mod.badge}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-foreground">{mod.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{mod.desc}</p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                        <span>{mod.count}</span>
                        {isSelected && <span className="text-primary flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Selected</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Mode & Timer Settings */}
            <div className="space-y-5 md:col-span-5">
              {/* Assessment Mode Toggle */}
              <div className="rounded-2xl border border-border bg-card/90 p-5 space-y-4 shadow-xs">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" /> Assessment Exam Format
                </h3>

                <div className="space-y-2.5">
                  <button
                    onClick={() => setTestMode("camera")}
                    className={`flex items-start gap-3 w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      testMode === "camera"
                        ? "border-primary bg-primary/10 shadow-xs"
                        : "border-border bg-muted/20 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white mt-0.5">
                      <Hand className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{t.testCameraMode}</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{t.testCameraModeDesc}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setTestMode("quiz")}
                    className={`flex items-start gap-3 w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      testMode === "quiz"
                        ? "border-primary bg-primary/10 shadow-xs"
                        : "border-border bg-muted/20 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white mt-0.5">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{t.testQuizMode}</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{t.testQuizModeDesc}</p>
                    </div>
                  </button>
                </div>

                {/* Timer Selector */}
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Timer className="h-3.5 w-3.5 text-primary" /> {t.testTimePerQuestion}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "15 Sec", val: 15 },
                      { label: "20 Sec", val: 20 },
                      { label: "30 Sec", val: 30 },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setTimeLimit(opt.val)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          timeLimit === opt.val
                            ? "border-primary bg-primary text-white shadow-2xs"
                            : "border-border bg-muted/30 text-foreground hover:bg-muted"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start Exam CTA */}
                <button
                  onClick={handleStartTest}
                  className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>{t.testStartBtn}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACTIVE TEST ARENA */}
      {testState === "in_test" && currentQuestion && (
        <div className="space-y-5 max-w-5xl mx-auto">
          {/* Top Progress & HUD Header */}
          <div className="glass rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 border border-border/80 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white font-black text-sm">
                {currentIdx + 1}
              </span>
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase">
                  {t.testQuestionProgress} {currentIdx + 1} / {questions.length}
                </span>
                <h4 className="text-sm font-bold text-foreground">
                  {testMode === "camera" ? t.testCameraMode : t.testQuizMode}
                </h4>
              </div>
            </div>

            {/* Timer Countdown Bar */}
            {timeLimit > 0 && (
              <div className="flex items-center gap-2 bg-muted/50 border border-border/60 px-3.5 py-1.5 rounded-xl">
                <Timer className={`h-4 w-4 ${timeLeft <= 5 ? "text-rose-500 animate-pulse" : "text-primary"}`} />
                <span className={`text-xs font-bold ${timeLeft <= 5 ? "text-rose-600 font-black" : "text-foreground"}`}>
                  {timeLeft}s
                </span>
              </div>
            )}

            {/* Score & Points Counter */}
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-xl">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-bold text-amber-600">{earnedPoints} Pts</span>
            </div>
          </div>

          {/* Question Main Arena Grid */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left: Target Sign / Demonstration */}
            <div className="space-y-4 lg:col-span-6">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                    Question #{currentIdx + 1}
                  </span>
                  <button
                    onClick={() => {
                      if (currentLocalizedSign) {
                        simulateSpeech(`Perform the sign for ${currentLocalizedSign.name}. ${currentLocalizedSign.desc}`);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
                  >
                    <Volume2 className="h-3.5 w-3.5" /> Speak
                  </button>
                </div>

                <div className="text-center py-4 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {testMode === "camera" ? t.testPerformSignPrompt : t.testSelectCorrectSign}
                  </p>

                  {testMode === "camera" ? (
                    <div className="space-y-2">
                      <h3 className="text-3xl font-black text-foreground">
                        {currentLocalizedSign?.name}
                      </h3>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                        {currentLocalizedSign?.desc}
                      </p>
                    </div>
                  ) : (
                    /* Video Demonstration in Quiz mode */
                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black shadow-sm mt-2">
                      {currentQuestion.sign.videoUrl.endsWith(".png") ? (
                        <img
                          src={currentQuestion.sign.videoUrl}
                          alt="Sign demonstration"
                          className="h-full w-full object-contain p-2 bg-white"
                        />
                      ) : (
                        <video
                          key={currentQuestion.sign.videoUrl}
                          src={currentQuestion.sign.videoUrl}
                          className="h-full w-full object-contain"
                          controls
                          autoPlay
                          loop
                          muted
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Status Feedback Banner */}
                {questionStatus === "correct" && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-emerald-950 flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-2 font-bold text-xs text-emerald-700">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <span>{t.testCorrectFeedback}</span>
                    </div>
                    <button
                      onClick={handleNextQuestion}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors cursor-pointer shadow-xs"
                    >
                      Next <ChevronRight className="inline h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                {questionStatus === "incorrect" && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-rose-950 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs text-rose-700">
                        <XCircle className="h-5 w-5 text-rose-600" />
                        <span>{t.testIncorrectFeedback}</span>
                      </div>
                      <button
                        onClick={handleNextQuestion}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition-colors cursor-pointer shadow-xs"
                      >
                        Next <ChevronRight className="inline h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-rose-800">
                      Target was: <strong className="font-bold">{currentLocalizedSign?.name}</strong>
                    </p>
                  </div>
                )}

                {questionStatus === "timeout" && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-amber-950 flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-2 font-bold text-xs text-amber-700">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <span>Time expired for this question!</span>
                    </div>
                    <button
                      onClick={handleNextQuestion}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-500 transition-colors cursor-pointer shadow-xs"
                    >
                      Next <ChevronRight className="inline h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Camera Vision / MCQ Selection */}
            <div className="space-y-4 lg:col-span-6">
              {testMode === "camera" ? (
                /* Live Camera Practical Exam */
                <div className="glass rounded-3xl p-5 border border-border space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Hand className="h-4 w-4 text-primary" /> Live AI Camera Viewport
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                      Evaluating Pose
                    </span>
                  </div>

                  <WebcamMock active={testState === "in_test"} />

                  {/* Actions & Skip */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <button
                      onClick={handleSkipQuestion}
                      disabled={questionStatus !== "answering"}
                      className="text-xs font-bold text-muted-foreground hover:text-foreground disabled:opacity-40 cursor-pointer"
                    >
                      {t.testSkipQuestion}
                    </button>

                    <button
                      onClick={handleForceMatch}
                      disabled={questionStatus !== "answering"}
                      className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-xl border border-primary/20 transition-all cursor-pointer shadow-2xs disabled:opacity-40"
                    >
                      💡 {t.markAsMatched}
                    </button>
                  </div>
                </div>
              ) : (
                /* Visual Theory MCQ Quiz Options */
                <div className="glass rounded-3xl p-6 border border-border space-y-4 shadow-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Select the matching Indian Sign:
                  </span>

                  <div className="space-y-3">
                    {currentQuestion.options?.map((opt, oIdx) => {
                      const optLoc = getSignDetails(opt, language);
                      const isSelected = selectedOption === opt;
                      const isCorrectAnswer = opt === currentQuestion.sign.name;

                      let btnStyle = "border-border bg-card hover:bg-muted/50 text-foreground";
                      if (questionStatus !== "answering") {
                        if (isCorrectAnswer) {
                          btnStyle = "border-emerald-500 bg-emerald-500/15 text-emerald-700 font-bold ring-2 ring-emerald-500/40";
                        } else if (isSelected && !isCorrectAnswer) {
                          btnStyle = "border-rose-500 bg-rose-500/15 text-rose-700 font-bold";
                        } else {
                          btnStyle = "border-border/40 bg-muted/20 opacity-60";
                        }
                      }

                      return (
                        <button
                          key={opt}
                          disabled={questionStatus !== "answering"}
                          onClick={() => handleSelectQuizOption(opt)}
                          className={`flex items-center justify-between w-full p-4 rounded-2xl border text-left transition-all cursor-pointer font-medium ${btnStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-muted text-xs font-bold text-foreground">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="text-sm font-bold">{optLoc.name}</span>
                          </div>

                          {questionStatus !== "answering" && isCorrectAnswer && (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          )}
                          {questionStatus !== "answering" && isSelected && !isCorrectAnswer && (
                            <XCircle className="h-5 w-5 text-rose-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleSkipQuestion}
                      disabled={questionStatus !== "answering"}
                      className="text-xs font-bold text-muted-foreground hover:text-foreground disabled:opacity-40 cursor-pointer"
                    >
                      {t.testSkipQuestion}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. TEST COMPLETED & CERTIFICATE REPORT */}
      {testState === "completed" && (
        <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
          {/* Score Header */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 text-center space-y-4 shadow-sm">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-500 mx-auto shadow-inner">
              <Trophy className="h-10 w-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${gradeInfo.color}`}>
                <Award className="h-4 w-4" /> {gradeInfo.label}
              </span>
              <h2 className="text-3xl font-black text-foreground pt-2">
                {t.testCompletedTitle}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                {t.testCompletedDesc}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 border-t border-border/60 pt-6 max-w-lg mx-auto">
              <div>
                <p className="text-2xl font-black text-foreground">{earnedPoints} / {totalQuestions * 10}</p>
                <p className="text-[11px] text-muted-foreground">{t.testFinalScore}</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-600">{accuracyPercentage}%</p>
                <p className="text-[11px] text-muted-foreground">{t.testAccuracyRate}</p>
              </div>
              <div>
                <p className="text-2xl font-black text-primary">{gradeInfo.grade}</p>
                <p className="text-[11px] text-muted-foreground">{t.testGradeEarned}</p>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={handleStartTest}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-all cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>{t.testRetakeBtn}</span>
              </button>

              <button
                onClick={() => setTestState("lobby")}
                className="inline-flex items-center gap-2 rounded-2xl border border-border bg-white px-5 py-3 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer shadow-2xs"
              >
                <span>{t.testBackToArena}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-3 text-xs font-bold text-amber-700 hover:bg-amber-500/20 transition-colors cursor-pointer shadow-2xs"
              >
                <Printer className="h-4 w-4" />
                <span>{t.testPrintCertificate}</span>
              </button>
            </div>
          </div>

          {/* Printable Official ISL Certificate */}
          <div className="rounded-3xl border-4 border-amber-500/30 bg-linear-to-b from-amber-500/5 via-card to-amber-500/5 p-8 sm:p-12 text-center space-y-6 shadow-md relative overflow-hidden">
            <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-amber-400/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-primary/10 blur-2xl" />

            <div className="relative z-10 space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Award className="h-6 w-6 text-amber-500" />
                <span className="text-xs font-black tracking-widest uppercase text-amber-600">
                  {t.testCertificateSubtitle}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-foreground">
                {t.testCertificateTitle}
              </h3>
            </div>

            <div className="relative z-10 space-y-2 py-4 border-y border-amber-500/20 max-w-lg mx-auto">
              <p className="text-xs text-muted-foreground">{t.testCertificateIssuedTo}</p>
              <h4 className="text-xl font-black text-foreground">SignSafe Student Scholar</h4>
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                {t.testCertificatePassed} with an overall score of <strong className="font-bold text-foreground">{accuracyPercentage}% ({gradeInfo.grade})</strong> on {new Date().toLocaleDateString()}.
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between text-left text-xs text-muted-foreground pt-2 max-w-md mx-auto">
              <div>
                <span className="block font-bold text-foreground">Verified By</span>
                <span className="text-[11px]">SignSafe AI Vision Engine</span>
              </div>
              <div className="text-right">
                <span className="block font-bold text-foreground">Accreditation</span>
                <span className="text-[11px]">ISLRTC Standards Alignment</span>
              </div>
            </div>
          </div>

          {/* Question Breakdown Review */}
          <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-xs">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> Question-by-Question Evaluation
            </h4>

            <div className="space-y-2.5">
              {results.map((res, rIdx) => {
                const loc = getSignDetails(res.signName, language);
                return (
                  <div
                    key={res.questionId}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                      res.isCorrect
                        ? "border-emerald-500/25 bg-emerald-500/5"
                        : "border-rose-500/25 bg-rose-500/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold ${
                        res.isCorrect ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                      }`}>
                        {rIdx + 1}
                      </span>
                      <div>
                        <h5 className="font-bold text-xs text-foreground">{loc.name}</h5>
                        <p className="text-[11px] text-muted-foreground">{loc.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold">
                        {res.isCorrect ? "+10 Pts" : "0 Pts"}
                      </span>
                      {res.isCorrect ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-600" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
