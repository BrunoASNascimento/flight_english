import { buildAnswerChoices, type Level, type Question } from "./questions.ts";
import {
  SERVICE_CEILING_FT,
  STARTING_ALTITUDE_FT,
  WRONG_ANSWER_PENALTY_FT,
  isAcceptedAnswer,
  climbForAnswer,
} from "./rules.ts";
import { INCIDENTS, type Incident } from "./flight.ts";
import {
  nextLevel,
  questionPool,
  questionTime,
  shuffle,
  type Attempt,
} from "./training.ts";
import { DEFAULT_SETTINGS, type Settings } from "./settings.ts";

export type FlightStatus =
  "idle" | "flying" | "paused" | "won" | "lost" | "completed";
export type Flight = {
  status: FlightStatus;
  settings: Settings;
  level: Level;
  altitude: number;
  target: number;
  time: number;
  questionTime: number;
  elapsed: number;
  streak: number;
  question: Question;
  choices: string[];
  queue: string[];
  history: Attempt[];
  feedback: Attempt | null;
  feedbackTime: number;
  serial: number;
  incident: Incident | null;
  recovery: number;
  incidentIndex: number;
  nextEmergency: number;
  reviewIds: string[];
  pitch: number;
};
const incidents: Incident[] = ["downdraft", "engine", "icing"];
export function createFlight(
  settings: Settings = DEFAULT_SETTINGS,
  reviewIds: string[] = [],
  random: () => number = Math.random,
): Flight {
  const pool = questionPool(settings, settings.level, reviewIds);
  const queue = shuffle(pool, random);
  const question = queue.shift();
  if (!question) throw new Error("There are no questions for this selection.");
  const seconds = questionTime(question);
  return {
    status: "idle",
    settings: { ...settings },
    level: question.level,
    altitude: STARTING_ALTITUDE_FT,
    target: STARTING_ALTITUDE_FT,
    time: seconds,
    questionTime: seconds,
    elapsed: 0,
    streak: 0,
    question,
    choices: buildAnswerChoices(settings.mode, question, random),
    queue: queue.map((q) => q.id),
    history: [],
    feedback: null,
    feedbackTime: 0,
    serial: 0,
    incident: null,
    recovery: 0,
    incidentIndex: 0,
    nextEmergency: 25,
    reviewIds,
    pitch: 0,
  };
}
export function answerFlight(
  s: Flight,
  selected: string | null,
  serial = s.serial,
): Flight {
  if (s.status !== "flying" || s.feedback || serial !== s.serial) return s;
  if (selected !== null && !s.choices.includes(selected)) return s;
  const correct =
    selected !== null && isAcceptedAnswer(selected, s.question.answers);
  const attempt: Attempt = {
    questionId: s.question.id,
    sentence: s.question.sentence,
    answers: [...s.question.answers],
    selected,
    correct,
    level: s.question.level,
    topic: s.question.hint,
    explanation: s.question.explanation,
    seconds: Math.max(0, s.questionTime - s.time),
  };
  const n = {
    ...s,
    history: [...s.history, attempt],
    feedback: attempt,
    feedbackTime: 0,
    streak: correct ? s.streak + 1 : 0,
  };
  if (s.settings.pace === "survival") {
    n.target = Math.max(
      0,
      Math.min(
        SERVICE_CEILING_FT,
        s.target +
          (correct
            ? climbForAnswer(s.time, s.streak)
            : -WRONG_ANSWER_PENALTY_FT),
      ),
    );
    if (s.incident) {
      // Icing requires consecutive correct answers; engine repair keeps its progress.
      n.recovery = correct
        ? s.recovery + 1
        : s.incident === "icing"
          ? 0
          : s.recovery;
      const needed = INCIDENTS[s.incident].required;
      if (n.recovery >= needed) {
        n.incident = null;
        n.nextEmergency = s.elapsed + 30;
        n.target = Math.min(
          SERVICE_CEILING_FT,
          n.target + INCIDENTS[s.incident].reward,
        );
      }
    }
  } else {
    n.target = Math.min(SERVICE_CEILING_FT, s.target + (correct ? 900 : 0));
    n.altitude = n.target;
  }
  return n;
}
export function advanceFlight(
  s: Flight,
  random: () => number = Math.random,
): Flight {
  if (s.status !== "flying" || !s.feedback) return s;
  // Finite practice/review sessions produce a useful debrief.
  if (
    (s.reviewIds.length && !s.queue.length) ||
    (s.settings.pace === "practice" &&
      !s.reviewIds.length &&
      s.history.length >= 20)
  ) {
    return { ...s, feedback: null, status: "completed" };
  }
  const level = s.reviewIds.length ? s.level : nextLevel(s.level, s.history);
  const pool = questionPool(s.settings, level, s.reviewIds);
  let queue = level === s.level ? [...s.queue] : [];
  if (!queue.length) {
    queue = shuffle(pool, random).map((q) => q.id);
    if (queue[0] === s.question.id && queue.length > 1)
      queue.push(queue.shift()!);
  }
  const id = queue.shift();
  const question = pool.find((q) => q.id === id);
  if (!question) return { ...s, status: "completed", feedback: null };
  const seconds = questionTime(question);
  return {
    ...s,
    level: question.level,
    question,
    choices: buildAnswerChoices(s.settings.mode, question, random),
    queue,
    time: seconds,
    questionTime: seconds,
    feedback: null,
    feedbackTime: 0,
    serial: s.serial + 1,
  };
}
export function tickFlight(
  s: Flight,
  seconds: number,
  random: () => number = Math.random,
): Flight {
  if (s.status !== "flying" || !Number.isFinite(seconds) || seconds <= 0)
    return s;
  const dt = Math.min(seconds, 1);
  if (s.feedback) {
    if (s.settings.pace === "practice") return s;
    const n = { ...s, feedbackTime: s.feedbackTime + dt };
    return s.settings.pace === "survival" && n.feedbackTime >= 2.8
      ? advanceFlight(n, random)
      : n;
  }
  if (s.settings.pace === "practice") return s;
  const n = { ...s, elapsed: s.elapsed + dt, time: Math.max(0, s.time - dt) };
  if (!n.incident && n.elapsed >= n.nextEmergency) {
    n.incident = incidents[n.incidentIndex % incidents.length];
    n.incidentIndex++;
    n.recovery = 0;
  }
  if (n.target < SERVICE_CEILING_FT)
    n.target = Math.max(
      0,
      n.target - (n.incident ? INCIDENTS[n.incident].drain : 18) * dt,
    );
  const difference = n.target - n.altitude;
  n.altitude = Math.max(
    0,
    Math.min(
      SERVICE_CEILING_FT,
      n.altitude +
        Math.sign(difference) *
          Math.min(Math.abs(difference), dt * (difference < 0 ? 140 : 650)),
    ),
  );
  n.pitch = difference > 30 ? 0.12 : difference < -30 ? -0.13 : 0;
  if (n.altitude <= 0 || n.altitude >= SERVICE_CEILING_FT - 1)
    return { ...n, status: n.altitude <= 0 ? "lost" : "won" };
  return n.time <= 0 ? answerFlight(n, null) : n;
}
export function pauseFlight(s: Flight): Flight {
  return s.status === "flying"
    ? { ...s, status: "paused" }
    : s.status === "paused"
      ? { ...s, status: "flying" }
      : s;
}
