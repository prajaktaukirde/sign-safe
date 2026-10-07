export interface SignRecord {
  signName: string;
  category: "basic" | "colors" | "alphabets" | "emergency";
  accuracy: number;
  lastPracticed: string;
  count: number;
}

export interface ProgressState {
  records: Record<string, SignRecord>;
}

const STORAGE_KEY = "signsafe_student_progress_v2";

export function loadProgress(): Record<string, SignRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to load progress from localStorage", err);
  }
  return {};
}

export function saveProgressRecord(
  signName: string,
  category: "basic" | "colors" | "alphabets" | "emergency",
  accuracy: number
): Record<string, SignRecord> {
  const current = loadProgress();
  const existing = current[signName];

  const updatedRecord: SignRecord = {
    signName,
    category,
    accuracy: Math.max(accuracy, existing?.accuracy || 0),
    lastPracticed: new Date().toLocaleDateString(),
    count: (existing?.count || 0) + 1,
  };

  const updatedState = {
    ...current,
    [signName]: updatedRecord,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
    window.dispatchEvent(new Event("signsafe_progress_updated"));
  } catch (err) {
    console.error("Failed to save progress to localStorage", err);
  }

  return updatedState;
}

export function resetProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("signsafe_progress_updated"));
  } catch (err) {
    console.error("Failed to reset progress", err);
  }
}
