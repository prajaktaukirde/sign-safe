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
            ? "absolute inset-0 bg-emerald-950/90 backdrop-blur-md"
            : "animate-strobe absolute inset-0 backdrop-blur-md"
        }
      />
      <div className="relative mx-auto w-full max-w-5xl px-4 py-8">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="rounded-2xl bg-black/70 px-6 py-4 backdrop-blur-md border border-white/10 shadow-xl">
            <h1 className="flex items-center gap-3 text-xl font-black tracking-tight sm:text-3xl text-white">
              <AlertOctagon className="h-7 w-7 shrink-0 text-amber-400" />
              {safe ? "STATUS CONFIRMED: SAFE" : "EMERGENCY: FIRE ALARM DETECTED"}
            </h1>
            <p className="mt-1 text-xs text-white/80">
              {emergencyReason} · {room} · Evacuate via nearest Exit B
            </p>
          </div>
          <button
            onClick={clearEmergency}
            className="rounded-full bg-black/60 p-3 text-white hover:bg-black/80 transition-colors cursor-pointer border border-white/10"
            aria-label="Dismiss emergency overlay"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="rounded-2xl bg-black/70 p-5 lg:col-span-3 backdrop-blur-md border border-white/10">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-white/70">
              Evacuation Map — Wing B, Level 1
            </p>
            <div className="h-[280px]">
              <Floorplan />
            </div>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <div className="grid gap-2.5 rounded-2xl bg-black/70 p-4 backdrop-blur-md border border-white/10">
              <button
                onClick={() => setSafety("ok")}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition-all cursor-pointer ${
                  safety === "ok" ? "bg-emerald-500 text-white" : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                }`}
              >
                <ShieldCheck className="mr-2 inline h-4 w-4" /> I AM OK
              </button>
              <button
                onClick={() => setSafety("help")}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition-all cursor-pointer ${
                  safety === "help" ? "bg-amber-500 text-slate-950" : "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                }`}
              >
                <HeartPulse className="mr-2 inline h-4 w-4" /> I NEED HELP
              </button>
              <button
                onClick={() => setSafety("trapped")}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition-all cursor-pointer ${
                  safety === "trapped"
                    ? "bg-rose-600 text-white"
                    : "bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
                }`}
              >
                <AlertOctagon className="mr-2 inline h-4 w-4" /> I AM TRAPPED ({room})
              </button>
            </div>

            <div className="rounded-2xl bg-black/70 p-4 backdrop-blur-md border border-white/10">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-white/70">
                Rescue Status Updates
              </p>
              <ul className="max-h-44 space-y-1.5 overflow-y-auto pr-1">
                {logs.length === 0 && (
                  <li className="text-xs text-white/60">Awaiting responder updates…</li>
                )}
                {logs.map((l) => (
                  <li key={l.id} className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white">
                    <span className="font-bold">{l.source}:</span> {l.text}
                    <span className="ml-2 text-[10px] text-white/50">{l.time}</span>
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
