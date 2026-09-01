import { createFileRoute } from "@tanstack/react-router";
import { Accessibility, GraduationCap, ShieldAlert } from "lucide-react";
import { DemoProvider, useDemo } from "@/lib/demo-store";
import { StudentView } from "@/components/app/StudentView";
import { TeacherView } from "@/components/app/TeacherView";
import { SosOverlay } from "@/components/app/SosOverlay";
import { DemoPanel } from "@/components/app/DemoPanel";

const TITLE = "AI ISL Teacher & Emergency App for Deaf Children";
const DESC =
  "An AI-powered Indian Sign Language learning platform and emergency assistance tool for deaf children.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <DemoProvider>
      <Console />
    </DemoProvider>
  ),
});

function Console() {
  const { view, setView, emergency, triggerEmergency, room } = useDemo();

  return (
    <main className="min-h-screen px-4 py-6 sm:px-8">
      <header className="mx-auto mb-6 flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="glow-primary flex h-11 w-11 items-center justify-center rounded-xl bg-primary">
            <Accessibility className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">
              AI ISL Teacher <span className="text-muted-foreground">&</span>{" "}
              <span className="text-destructive">SafeSOS Kids</span>
            </h1>
            <p className="text-xs text-muted-foreground">
              Step-by-step ISL learning & safety platform · {room}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setView("student")}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                view === "student"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GraduationCap className="h-4 w-4" /> 👧 Child Learner
            </button>
            <button
              onClick={() => setView("teacher")}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                view === "teacher"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              👩‍🏫 Parent/Teacher Panel
            </button>
          </div>
          <button
            onClick={() => triggerEmergency("Fire alarm acoustic signature detected")}
            className="inline-flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/15 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/25"
          >
            <ShieldAlert className="h-4 w-4" /> Simulate Fire Alarm
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl">
        {view === "student" ? <StudentView /> : <TeacherView />}
      </div>

      <DemoPanel />
      {emergency && <SosOverlay />}
    </main>
  );
}
