import { parseSettings, type Settings } from "./settings.ts";
import { QUESTION_BANKS, LEVELS, type ExerciseMode } from "./questions.ts";
import type { Attempt } from "./training.ts";

export const STORAGE_KEY = "flight-english.v1";
export type Session = {
  id: string;
  date: string;
  mode: ExerciseMode;
  pace: Settings["pace"];
  outcome: string;
  history: Attempt[];
};
export type Progress = { version: 1; settings: Settings; sessions: Session[] };
export function parseProgress(value: unknown): Progress {
  const empty: Progress = {
    version: 1,
    settings: parseSettings(null),
    sessions: [],
  };
  if (!value || typeof value !== "object") return empty;
  const raw = value as Record<string, unknown>;
  if (raw.version !== 1) return empty;
  empty.settings = parseSettings(raw.settings);
  if (!Array.isArray(raw.sessions)) return empty;
  for (const value of raw.sessions.slice(-20)) {
    if (!value || typeof value !== "object") continue;
    const s = value as Session;
    if (
      typeof s.id !== "string" ||
      typeof s.date !== "string" ||
      !Number.isFinite(Date.parse(s.date)) ||
      (s.mode !== "prepositions" && s.mode !== "phrasal-verbs") ||
      (s.pace !== "practice" && s.pace !== "survival") ||
      !["won", "lost", "completed"].includes(s.outcome) ||
      !Array.isArray(s.history)
    )
      continue;
    const bank = QUESTION_BANKS[s.mode];
    const history: Attempt[] = [];
    for (const a of s.history.slice(-300)) {
      if (
        !a ||
        typeof a !== "object" ||
        typeof a.questionId !== "string" ||
        typeof a.correct !== "boolean" ||
        !(a.selected === null || typeof a.selected === "string") ||
        !LEVELS.includes(a.level) ||
        typeof a.seconds !== "number" ||
        !Number.isFinite(a.seconds) ||
        a.seconds < 0
      )
        continue;
      const q = bank.find((q) => q.id === a.questionId);
      if (!q) continue;
      // Current editorial content is authoritative, not persisted arbitrary text.
      history.push({
        questionId: q.id,
        sentence: q.sentence,
        answers: q.answers,
        selected: a.selected,
        correct: a.correct,
        level: q.level,
        topic: q.hint,
        explanation: q.explanation,
        seconds: a.seconds,
      });
    }
    empty.sessions.push({
      id: s.id,
      date: s.date,
      mode: s.mode,
      pace: s.pace,
      outcome: s.outcome,
      history,
    });
  }
  return empty;
}
export function mergeSession(progress: Progress, session: Session): Progress {
  return {
    ...progress,
    sessions: [
      ...progress.sessions.filter((s) => s.id !== session.id),
      session,
    ].slice(-20),
  };
}
