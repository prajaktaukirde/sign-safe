import { useState } from "react";
import { AlertTriangle, Check, Mic, Send, Volume2, ChevronLeft } from "lucide-react";
import { useDemo } from "@/lib/demo-store";
import { useLanguage } from "@/lib/translations";

interface TeacherViewProps {
  onBackToHome?: () => void;
}

export function TeacherView({ onBackToHome }: TeacherViewProps) {
  const {
    isListening,
    liveWords,
    transcript,
    simulateSpeech,
    pushTeacherMessage,
    questions,
    markAnswered,
    triggerEmergency,
  } = useDemo();
  const { t } = useLanguage();
  const [draft, setDraft] = useState("");
  const [reply, setReply] = useState<string | null>(null);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <section className="glass rounded-2xl p-6 lg:col-span-3 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">{t.teacherConsoleTitle}</h2>
            <p className="text-xs text-muted-foreground">
              {t.teacherConsoleDesc}
            </p>
          </div>
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="h-4 w-4 text-primary" />
              <span>{t.backToHome}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/40 p-5">
          <button
            onClick={() => simulateSpeech()}
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl transition-transform hover:scale-105 cursor-pointer shadow-sm ${
              isListening
                ? "animate-pulse-ring bg-destructive text-destructive-foreground"
                : "bg-primary text-white"
            }`}
            aria-label="Toggle microphone"
          >
            <Mic className="h-7 w-7" />
          </button>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              {isListening ? t.micListening : t.voiceTranscription}
            </span>
            <p className="mt-1 truncate text-base font-bold text-foreground">{liveWords || transcript}</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t.broadcastSubtitles}
          </label>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            placeholder={t.broadcastPlaceholder}
            className="w-full resize-none rounded-xl border border-border bg-card p-3.5 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={() => {
              pushTeacherMessage(draft);
              setDraft("");
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
          >
            <Send className="h-3.5 w-3.5" /> {t.sendBroadcast}
          </button>
        </div>
      </section>

      <section className="glass rounded-2xl p-6 lg:col-span-2 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">{t.studentQuestionQueue}</h2>
          <p className="text-xs text-muted-foreground">{t.realtimeQuestionsDesc}</p>
        </div>

        <ul className="space-y-3">
          {questions.length === 0 ? (
            <li className="rounded-xl border border-border bg-muted/30 p-6 text-center text-xs text-muted-foreground">
              {t.noQuestions}
            </li>
          ) : (
            questions.map((q) => (
              <li
                key={q.id}
                className={`rounded-xl border p-4 transition-all ${
                  q.answered
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-amber-500/30 bg-amber-500/10"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-bold text-foreground">
                    {q.student} ({q.desk})
                  </p>
                  <span className="text-[10px] text-muted-foreground">{q.time}</span>
                </div>
                <p className="mt-1.5 text-sm font-bold text-foreground">{q.text}</p>
                {q.answered ? (
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                    <Check className="h-3.5 w-3.5" /> {t.answeredBadge}
                  </p>
                ) : (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => {
                        markAnswered(q.id, "typed");
                        setReply(`Reply sent to ${q.student}`);
                      }}
                      className="flex-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                    >
                      {t.typeReply}
                    </button>
                    <button
                      onClick={() => {
                        markAnswered(q.id, "vocal");
                        setReply(`Answering ${q.student} vocally — text broadcasted`);
                      }}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <Volume2 className="h-3.5 w-3.5" /> {t.answerVocally}
                    </button>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
        {reply && <p className="text-xs text-primary font-medium">{reply}</p>}
      </section>
    </div>
  );
}
