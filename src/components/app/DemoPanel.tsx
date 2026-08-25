import { useState } from "react";
import { ChevronDown, Flame, Hand, MonitorSmartphone, Radio, SlidersHorizontal } from "lucide-react";
import { useDemo } from "@/lib/demo-store";

export function DemoPanel() {
  const { simulateSpeech, simulateGesture, triggerEmergency, view, setView } = useDemo();
  const [open, setOpen] = useState(true);

  return (
    <div className="fixed bottom-4 right-4 z-40 w-[15.5rem]">
      <div className="glass overflow-hidden rounded-2xl shadow-2xl">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-bold"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" /> Demo Controls
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "" : "-rotate-90"}`} />
        </button>
        {open && (
          <div className="grid gap-2 border-t border-white/10 p-3">
            <button
              onClick={() => simulateSpeech()}
              className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10"
            >
              <Radio className="h-3.5 w-3.5 text-primary" /> Simulate Teacher Speech
            </button>
            <button
              onClick={() => simulateGesture()}
              className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10"
            >
              <Hand className="h-3.5 w-3.5 text-warning" /> Simulate Student ISL Gesture
            </button>
            <button
              onClick={() => triggerEmergency("Fire alarm acoustic signature detected")}
              className="flex items-center gap-2 rounded-lg bg-destructive/25 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/35"
            >
              <Flame className="h-3.5 w-3.5" /> Simulate Fire Alarm Sound
            </button>
            <button
              onClick={() => setView(view === "student" ? "teacher" : "student")}
              className="flex items-center gap-2 rounded-lg bg-primary/20 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/30"
            >
              <MonitorSmartphone className="h-3.5 w-3.5" /> Switch to{" "}
              {view === "student" ? "Teacher" : "Student"} View
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
