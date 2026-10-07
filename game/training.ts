import {
  QUESTION_BANKS,
  LEVELS,
  type Question,
  type Level,
} from "./questions.ts";
import type { Settings } from "./settings.ts";

export type Attempt = {
  questionId: string;
  sentence: string;
  answers: string[];
  selected: string | null;
  correct: boolean;
  level: Level;
  topic: string;
  explanation: string;
  seconds: number;
};
export function questionTime(question: Question) {
  const words = question.sentence.trim().split(/\s+/).length;
  return Math.min(
    22,
    8 + Math.ceil(words / 4) + LEVELS.indexOf(question.level),
  );
}
export function shuffle<T>(
  values: readonly T[],
  random: () => number = Math.random,
): T[] {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function questionPool(
  settings: Settings,
  level: Level,
  reviewIds: readonly string[] = [],
) {
  // Review deliberately spans levels and ignores content filters.
  return QUESTION_BANKS[settings.mode].filter((q) =>
    reviewIds.length
      ? reviewIds.includes(q.id)
      : q.level === level &&
        (settings.content === "mixed" ||
          (settings.content === "music") === !!q.source),
  );
}
export function nextLevel(level: Level, history: readonly Attempt[]): Level {
  const recent = history.filter((a) => a.level === level).slice(-10);
  if (recent.length < 10 || recent.filter((a) => a.correct).length < 8)
    return level;
  if (
    new Set(recent.filter((a) => a.correct).map((a) => a.questionId)).size < 8
  )
    return level;
  if (new Set(recent.filter((a) => a.correct).map((a) => a.topic)).size < 3)
    return level;
  return LEVELS[Math.min(LEVELS.indexOf(level) + 1, LEVELS.length - 1)];
}
export function weakTopics(history: readonly Attempt[]) {
  const topics = new Map<
    string,
    { topic: string; missed: number; total: number }
  >();
  for (const attempt of history) {
    const row = topics.get(attempt.topic) ?? {
      topic: attempt.topic,
      missed: 0,
      total: 0,
    };
    row.total++;
    if (!attempt.correct) row.missed++;
    topics.set(attempt.topic, row);
  }
  return [...topics.values()]
    .filter((t) => t.missed)
    .sort((a, b) => b.missed - a.missed);
}

export function unresolvedQuestions(
  history: readonly Pick<Attempt, "questionId" | "correct">[],
) {
  const latest = new Map<string, boolean>();
  for (const attempt of history)
    latest.set(attempt.questionId, attempt.correct);
  return [...latest].filter(([, correct]) => !correct).map(([id]) => id);
}
