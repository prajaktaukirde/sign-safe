import { useState } from "react";
import { AlertTriangle, Check, Mic, Send, Volume2 } from "lucide-react";
import { useDemo } from "@/lib/demo-store";

export function TeacherView() {
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
  const [draft, setDraft] = useState("");
  const [reply, setReply] = useState<string | null>(null);

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      <section className="glass rounded-2xl p-5 lg:col-span-3">
        <h2 className="text-lg font-semibold">Lecture Input</h2>
        <p className="text-sm text-muted-foreground">
          Speak or type — students receive subtitles and avatar signing instantly
        </p>

        <div className="mt-5 flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-5">
          <button
            onClick={() => simulateSpeech()}
            className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-105 ${
              isListening
                ? "animate-pulse-ring bg-destructive text-destructive-foreground"
                : "glow-primary bg-primary text-primary-foreground"
            }`}
            aria-label="Toggle microphone"
          >
            <Mic className="h-8 w-8" />
          </button>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {isListening ? "Listening…" : "Microphone idle — tap to speak"}
            </p>
            <p className="mt-1 truncate text-lg font-semibold">{liveWords || transcript}</p>
          </div>
        </div>

        <div className="mt-5">
          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Send text directly to student subtitles
          </label>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            placeholder="e.g. Turn to page 42 and copy the diagram."
            className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/5 p-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/60"
          />
          <button
            onClick={() => {
              pushTeacherMessage(draft);
              setDraft("");
            }}
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90"
          >
            <Send className="h-4 w-4" /> Push to Avatar
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/10 p-5">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-destructive">
            <AlertTriangle className="h-4 w-4" /> Manual Alarm Trigger
          </p>
          <button
            onClick={() => triggerEmergency("Manual evacuation triggered by instructor")}
            className="animate-pulse-ring w-full rounded-xl bg-destructive px-6 py-5 text-lg font-black tracking-wide text-destructive-foreground transition-transform hover:scale-[1.01]"
          >
            TRIGGER CAMPUS EVACUATION
          </button>
        </div>
      </section>

      <section className="glass rounded-2xl p-5 lg:col-span-2">
        <h2 className="text-lg font-semibold">Student Alert Queue</h2>
        <p className="text-sm text-muted-foreground">Translated ISL questions arriving live</p>

        <ul className="mt-4 space-y-3">
          {questions.map((q) => (
            <li
              key={q.id}
              className={`rounded-xl border p-4 ${
                q.answered
                  ? "border-success/30 bg-success/10"
                  : "border-warning/30 bg-warning/10"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold">
                  {q.student} ({q.desk}) asks:
                </p>
                <span className="shrink-0 text-[11px] text-muted-foreground">{q.time}</span>
              </div>
              <p className="mt-1 text-base font-bold">{q.text}</p>
              {q.answered ? (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-success">
                  <Check className="h-3.5 w-3.5" /> Answered
                </p>
              ) : (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      markAnswered(q.id, "typed");
                      setReply(`Typed reply sent to ${q.student}`);
                    }}
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10"
                  >
                    Type Reply
                  </button>
                  <button
                    onClick={() => {
                      markAnswered(q.id, "vocal");
                      setReply(`Answering ${q.student} vocally — avatar is signing`);
                    }}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
                  >
                    <Volume2 className="h-3.5 w-3.5" /> Answer Vocally
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
        {reply && <p className="mt-4 text-xs text-muted-foreground">{reply}</p>}
      </section>
    </div>
  );
}
