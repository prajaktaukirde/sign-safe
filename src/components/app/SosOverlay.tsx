import { AlertOctagon, HeartPulse, ShieldCheck, X } from "lucide-react";
import { useDemo } from "@/lib/demo-store";

function Floorplan() {
  return (
    <svg viewBox="0 0 520 300" className="h-full w-full">
      <rect x="8" y="8" width="504" height="284" rx="10" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.25)" />
      {/* corridor */}
      <rect x="30" y="130" width="460" height="50" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" />
      <text x="230" y="160" fill="rgba(255,255,255,0.6)" fontSize="12">MAIN CORRIDOR</text>
      {/* rooms */}
      {[
        { x: 40, label: "Room 101" },
        { x: 190, label: "Room 102" },
        { x: 340, label: "Room 103", you: true },
      ].map((r) => (
        <g key={r.label}>
          <rect
            x={r.x}
            y={30}
            width={130}
            height={90}
            rx="6"
            fill={r.you ? "rgba(255,59,48,0.22)" : "rgba(255,255,255,0.05)"}
            stroke={r.you ? "#FF3B30" : "rgba(255,255,255,0.2)"}
          />
          <text x={r.x + 16} y={62} fill="white" fontSize="14" fontWeight="700">
            {r.label}
          </text>
          {r.you && (
            <text x={r.x + 16} y={84} fill="#FF9500" fontSize="12">
              YOU ARE HERE
            </text>
          )}
        </g>
      ))}
      {/* exits */}
      <rect x="30" y="210" width="110" height="52" rx="6" fill="rgba(52,199,89,0.15)" stroke="#34C759" />
      <text x="46" y="242" fill="#34C759" fontSize="13" fontWeight="700">EXIT A</text>
      <rect x="380" y="210" width="110" height="52" rx="6" fill="rgba(52,199,89,0.28)" stroke="#34C759" />
      <text x="392" y="235" fill="#34C759" fontSize="13" fontWeight="700">EXIT B</text>
      <text x="392" y="252" fill="rgba(52,199,89,0.85)" fontSize="10">NEAREST · 18m</text>
      {/* escape route */}
      <path
        d="M405 120 L405 155 L440 155 L440 210"
        fill="none"
        stroke="#34C759"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="12 16"
        className="animate-dash"
        style={{ filter: "drop-shadow(0 0 8px rgba(52,199,89,0.9))" }}
      />
      <circle cx="405" cy="120" r="7" fill="#FF3B30" />
    </svg>
  );
}

export function SosOverlay() {
  const { emergencyReason, safety, setSafety, logs, room, clearEmergency } = useDemo();
  const safe = safety === "ok";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className={
          safe
            ? "absolute inset-0 bg-[oklch(0.35_0.14_150_/_0.92)]"
            : "animate-strobe absolute inset-0"
        }
      />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-8">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="rounded-2xl bg-black/55 px-5 py-4">
            <h1 className="flex items-center gap-3 text-2xl font-black tracking-tight sm:text-4xl">
              <AlertOctagon className="h-8 w-8 shrink-0 text-warning" />
              {safe ? "STATUS CONFIRMED SAFE" : "!!! WARNING: FIRE ALARM DETECTED !!!"}
            </h1>
            <p className="mt-1 text-sm text-white/80">
              {emergencyReason} · {room} · Evacuate immediately via Exit B
            </p>
          </div>
          <button
            onClick={clearEmergency}
            className="rounded-full bg-black/50 p-3 hover:bg-black/70"
            aria-label="Dismiss emergency overlay"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-5">
          <div className="rounded-2xl bg-black/55 p-4 lg:col-span-3">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              Evacuation Floorplan — Wing B, Level 1
            </p>
            <div className="h-[300px]">
              <Floorplan />
            </div>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <div className="grid gap-3 rounded-2xl bg-black/55 p-4">
              <button
                onClick={() => setSafety("ok")}
                className={`rounded-xl px-4 py-4 text-lg font-black transition-transform hover:scale-[1.02] ${
                  safety === "ok" ? "bg-success text-success-foreground" : "bg-success/25 text-success"
                }`}
              >
                <ShieldCheck className="mr-2 inline h-5 w-5" /> I AM OK
              </button>
              <button
                onClick={() => setSafety("help")}
                className={`rounded-xl px-4 py-4 text-lg font-black transition-transform hover:scale-[1.02] ${
                  safety === "help" ? "bg-warning text-warning-foreground" : "bg-warning/25 text-warning"
                }`}
              >
                <HeartPulse className="mr-2 inline h-5 w-5" /> I NEED HELP
              </button>
              <button
                onClick={() => setSafety("trapped")}
                className={`rounded-xl px-4 py-4 text-lg font-black transition-transform hover:scale-[1.02] ${
                  safety === "trapped"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-destructive/30 text-white"
                }`}
              >
                <AlertOctagon className="mr-2 inline h-5 w-5" /> I AM TRAPPED ({room})
              </button>
            </div>

            <div className="rounded-2xl bg-black/55 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                Live rescue status log
              </p>
              <ul className="max-h-52 space-y-2 overflow-y-auto pr-1">
                {logs.length === 0 && (
                  <li className="text-sm text-white/60">Awaiting responder updates…</li>
                )}
                {logs.map((l) => (
                  <li key={l.id} className="rounded-lg bg-white/10 px-3 py-2 text-sm">
                    <span className="font-bold">{l.source}:</span> {l.text}
                    <span className="ml-2 text-[11px] text-white/50">{l.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
