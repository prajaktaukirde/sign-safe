import { Hand, MessageSquarePlus, RotateCcw, Sparkles, Waves } from "lucide-react";
import { SigningAvatar } from "./SigningAvatar";
import { WebcamMock } from "./WebcamMock";
import { useDemo } from "@/lib/demo-store";

const SPEEDS = [0.75, 1, 1.25, 1.5];

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
    simulateGesture,
    sendQuestion,
  } = useDemo();

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      {/* Avatar panel */}
      <section className="glass rounded-2xl p-5 lg:col-span-3">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Sparkles className="h-5 w-5 text-primary" /> ISL Avatar Interpreter
            </h2>
            <p className="text-sm text-muted-foreground">
              Live speech → Indian Sign Language, rendered in real time
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-full border border-white/10 bg-white/5 p-1">
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  onClick={() => setAvatarSpeed(s)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    avatarSpeed === s
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
            <button
              onClick={replay}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-white/10"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Replay
            </button>
          </div>
        </header>

        <div className="relative h-[340px] overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(600px_320px_at_50%_0%,rgba(0,102,255,0.18),transparent_70%)]">
          <SigningAvatar speed={avatarSpeed} replayKey={replayKey} />
          <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] text-muted-foreground">
            Signing at {avatarSpeed}x
          </span>
        </div>

        <div className="mt-5 rounded-xl border border-primary/30 bg-primary/10 p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Teacher · Live Lecture Transcript
          </p>
          <p className="text-2xl font-bold leading-snug sm:text-3xl">
            {liveWords || transcript}
            {liveWords && <span className="ml-1 animate-pulse text-primary">▍</span>}
          </p>
        </div>
      </section>

      {/* Webcam panel */}
      <section className="glass rounded-2xl p-5 lg:col-span-2">
        <header className="mb-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Hand className="h-5 w-5 text-warning" /> Gesture Capture
          </h2>
          <p className="text-sm text-muted-foreground">Your signs, translated for the class</p>
        </header>

        <WebcamMock active={gestureOutput !== "—"} />

        <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Waves className="h-4 w-4 text-primary" />
            <span>Status: {gestureStatus}</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Translated output
            </p>
            <p className="mt-1 text-xl font-bold text-warning">{gestureOutput}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          <button
            onClick={() => simulateGesture()}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white/10"
          >
            Simulate my ISL gesture
          </button>
          <button
            onClick={() => sendQuestion(gestureOutput)}
            disabled={gestureOutput === "—" || gestureOutput === "…"}
            className="glow-primary inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <MessageSquarePlus className="h-4 w-4" /> Send Question to Teacher
          </button>
        </div>
      </section>
    </div>
  );
}
