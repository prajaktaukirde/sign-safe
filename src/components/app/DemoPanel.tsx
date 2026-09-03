import { useState } from "react";
import { ChevronDown, Flame, Hand, MonitorSmartphone, Radio, SlidersHorizontal } from "lucide-react";
import { useDemo } from "@/lib/demo-store";

export function DemoPanel() {
  const { simulateSpeech, simulateGesture, triggerEmergency, view, setView } = useDemo();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-40 w-64">
      <div className="glass overflow-hidden rounded-2xl shadow-xl border border-border">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between px-4 py-3 text-xs font-bold text-foreground cursor-pointer hover:bg-muted/40 transition-colors"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-primary" /> Test Controls
          </span>
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "" : "-rotate-90"}`} />
        </button>
        {open && (
          <div className="grid gap-1.5 border-t border-border p-3">
            <button
              onClick={() => simulateSpeech()}
              className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Radio className="h-3.5 w-3.5 text-primary" /> Test Lecture Speech
            </button>
            <button
              onClick={() => simulateGesture()}
              className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Hand className="h-3.5 w-3.5 text-amber-500" /> Test ISL Sign
            </button>
            <button
              onClick={() => triggerEmergency("Fire alarm acoustic signature detected")}
              className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/20 transition-colors cursor-pointer"
            >
              <Flame className="h-3.5 w-3.5" /> Test Fire Alarm
            </button>
            <button
              onClick={() => setView(view === "student" ? "teacher" : "student")}
              className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors cursor-pointer"
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
