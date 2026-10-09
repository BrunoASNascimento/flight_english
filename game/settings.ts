import {
  isExerciseMode,
  LEVELS,
  type ExerciseMode,
  type Level,
} from "./questions.ts";

export type Settings = {
  mode: ExerciseMode;
  pace: "practice" | "survival";
  level: Level;
  content: "mixed" | "everyday" | "music";
  hints: boolean;
  graphics: "low" | "medium" | "high";
  reducedMotion: boolean;
  muted: boolean;
  music: number;
  engine: number;
  alarms: number;
  voice: number;
};
export const DEFAULT_SETTINGS: Settings = {
  mode: "prepositions",
  pace: "practice",
  level: "A1",
  content: "mixed",
  hints: true,
  graphics: "medium",
  reducedMotion: false,
  muted: false,
  music: 0.5,
  engine: 0.25,
  alarms: 0.55,
  voice: 0.8,
};
export function parseSettings(value: unknown): Settings {
  const result = { ...DEFAULT_SETTINGS };
  if (!value || typeof value !== "object") return result;
  const raw = value as Record<string, unknown>;
  if (isExerciseMode(raw.mode)) result.mode = raw.mode;
  if (raw.pace === "practice" || raw.pace === "survival")
    result.pace = raw.pace;
  if (LEVELS.includes(raw.level as Level)) result.level = raw.level as Level;
  if (
    raw.content === "mixed" ||
    raw.content === "everyday" ||
    raw.content === "music"
  )
    result.content = raw.content;
  if (
    raw.graphics === "low" ||
    raw.graphics === "medium" ||
    raw.graphics === "high"
  )
    result.graphics = raw.graphics;
  for (const key of ["hints", "reducedMotion", "muted"] as const) {
    if (typeof raw[key] === "boolean") result[key] = raw[key];
  }
  for (const key of ["music", "engine", "alarms", "voice"] as const) {
    if (typeof raw[key] === "number" && Number.isFinite(raw[key]))
      result[key] = Math.min(1, Math.max(0, raw[key]));
  }
  return result;
}
