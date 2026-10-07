import assert from "node:assert/strict";
import test from "node:test";
import {
  createFlight,
  answerFlight,
  advanceFlight,
  tickFlight,
  pauseFlight,
} from "../game/engine.ts";
import { DEFAULT_SETTINGS, parseSettings } from "../game/settings.ts";
import {
  questionPool,
  questionTime,
  nextLevel,
  unresolvedQuestions,
} from "../game/training.ts";
import { parseProgress, mergeSession } from "../game/storage.ts";
import { QUESTION_BANKS, buildAnswerChoices } from "../game/questions.ts";
const rng = () => 0.42;
const flight = (changes = {}) => ({
  ...createFlight({ ...DEFAULT_SETTINGS, ...changes }, [], rng),
  status: "flying",
});
const correct = (s) => answerFlight(s, s.question.answers[0]);

test("feedback retains the original question and ignores duplicate or stale submissions", () => {
  const s = flight();
  const n = correct(s);
  assert.equal(n.question, s.question);
  assert.equal(n.history.length, 1);
  assert.equal(answerFlight(n, s.question.answers[0]), n);
  const next = advanceFlight(n, rng);
  assert.equal(answerFlight(next, next.question.answers[0], s.serial), next);
  assert.equal(n.feedback.correct, true);
  assert.equal(n.feedback.sentence, s.question.sentence);
});
test("practice has no countdown, descent or penalty and holds feedback until Next", () => {
  const s = flight();
  assert.equal(tickFlight(s, 1), s);
  const bad = answerFlight(s, s.question.distractors[0]);
  assert.equal(bad.target, s.target);
  assert.equal(tickFlight(bad, 1), bad);
  assert.equal(bad.history.length, 1);
});
test("timeout is counted once and the corrected sentence remains visible", () => {
  const s = { ...flight({ pace: "survival" }), time: 0.05 };
  const n = tickFlight(s, 0.1, rng);
  assert.equal(n.history.length, 1);
  assert.equal(n.feedback.selected, null);
  assert.equal(n.streak, 0);
  assert.equal(n.question, s.question);
  const held = tickFlight(n, 1, rng);
  assert.equal(held.history.length, 1);
  assert.equal(held.altitude, n.altitude);
  assert.equal(held.time, n.time);
});
test("pause and resume preserve timer, correction and incident progress", () => {
  const s = {
    ...flight({ pace: "survival" }),
    incident: "engine",
    recovery: 1,
  };
  const paused = pauseFlight(s);
  assert.equal(paused.status, "paused");
  assert.equal(tickFlight(paused, 1), paused);
  const resumed = pauseFlight(paused);
  assert.equal(resumed.time, s.time);
  assert.equal(resumed.recovery, 1);
});
test("survival feedback advances automatically without applying flight penalties", () => {
  let n = correct(flight({ pace: "survival" }));
  const before = n.altitude;
  for (let i = 0; i < 3; i++) n = tickFlight(n, 1, rng);
  assert.equal(n.feedback, null);
  assert.equal(n.serial, 1);
  assert.equal(n.altitude, before);
});
test("a shuffled queue visits all collection questions before repeating", () => {
  let s = flight({ pace: "survival", content: "music" });
  const ids = [];
  for (let i = 0; i < 6; i++) {
    ids.push(s.question.id);
    s = advanceFlight(correct(s), rng);
  }
  assert.equal(new Set(ids).size, 6);
  assert.notEqual(s.question.id, ids.at(-1));
});
test("advancement requires accuracy, distinct questions and coverage of different patterns", () => {
  const make = (i, correct = true, topic = `topic-${i % 3}`) => ({
    questionId: `q${i}`,
    correct,
    level: "A1",
    topic,
  });
  assert.equal(
    nextLevel(
      "A1",
      Array.from({ length: 4 }, (_, i) => make(i)),
    ),
    "A1",
  );
  assert.equal(
    nextLevel(
      "A1",
      Array.from({ length: 10 }, (_, i) => make(i, i < 7)),
    ),
    "A1",
  );
  assert.equal(
    nextLevel(
      "A1",
      Array.from({ length: 10 }, (_, i) => make(i, true, "one pattern")),
    ),
    "A1",
  );
  assert.equal(
    nextLevel(
      "A1",
      Array.from({ length: 10 }, (_, i) => make(i)),
    ),
    "A2",
  );
  assert.equal(
    nextLevel(
      "C1",
      Array.from({ length: 10 }, (_, i) => ({ ...make(i), level: "C1" })),
    ),
    "C1",
  );
});
test("practice ends with a debrief after 20 questions", () => {
  let s = flight();
  for (let i = 0; i < 20; i++) s = advanceFlight(correct(s), rng);
  assert.equal(s.status, "completed");
  assert.equal(s.history.length, 20);
});
test("review is finite, uses the requested mode and ignores the collection/level filters", () => {
  const ids = ["pv-a1-7", "pv-c1-4"];
  let s = {
    ...createFlight(
      { ...DEFAULT_SETTINGS, mode: "phrasal-verbs", content: "music" },
      ids,
      rng,
    ),
    status: "flying",
  };
  const seen = [];
  for (let i = 0; i < 2; i++) {
    seen.push(s.question.id);
    s = advanceFlight(correct(s), rng);
  }
  assert.equal(s.status, "completed");
  assert.deepEqual(seen.sort(), ids.sort());
});
test("each emergency has its own recovery requirement and reward", () => {
  let engine = {
    ...flight({ pace: "survival" }),
    incident: "engine",
    recovery: 0,
  };
  engine = advanceFlight(correct(engine), rng);
  assert.equal(engine.recovery, 1);
  engine = advanceFlight(
    answerFlight(engine, engine.question.distractors[0]),
    rng,
  );
  assert.equal(engine.recovery, 1);
  engine = advanceFlight(correct(engine), rng);
  assert.equal(engine.incident, "engine");
  engine = correct(engine);
  assert.equal(engine.incident, null);
  assert.equal(engine.nextEmergency, engine.elapsed + 30);
  let ice = { ...flight({ pace: "survival" }), incident: "icing", recovery: 0 };
  ice = advanceFlight(correct(ice), rng);
  ice = answerFlight(ice, ice.question.distractors[0]);
  assert.equal(ice.recovery, 0);
});
test("victory and loss are final and do not count answers after the flight ends", () => {
  const won = tickFlight(
    { ...flight({ pace: "survival" }), altitude: 36998, target: 37000 },
    0.1,
  );
  assert.equal(won.status, "won");
  assert.equal(correct(won), won);
  const lost = tickFlight(
    { ...flight({ pace: "survival" }), altitude: 1, target: 0 },
    0.1,
  );
  assert.equal(lost.status, "lost");
  assert.equal(tickFlight(lost, 1), lost);
});
test("reading time grows with length and level; collections remain separate", () => {
  const q = QUESTION_BANKS.prepositions[0];
  assert.ok(
    questionTime({ ...q, level: "C1", sentence: "A ".repeat(30) + "___" }) >
      questionTime(q),
  );
  assert.ok(
    questionPool({ ...DEFAULT_SETTINGS, content: "music" }, "A1").every(
      (q) => q.source,
    ),
  );
  assert.ok(
    questionPool({ ...DEFAULT_SETTINGS, content: "everyday" }, "A1").every(
      (q) => !q.source,
    ),
  );
});
test("storage validates schema, bounds settings and prevents duplicate sessions", () => {
  assert.deepEqual(
    parseProgress({ version: 99, sessions: [] }),
    parseProgress(null),
  );
  assert.equal(parseSettings({ music: 10, voice: -1 }).music, 1);
  assert.equal(parseSettings({ voice: -1 }).voice, 0);
  assert.equal(parseSettings({ music: NaN }).music, DEFAULT_SETTINGS.music);
  const session = {
    id: "s",
    date: new Date().toISOString(),
    mode: "prepositions",
    pace: "practice",
    outcome: "completed",
    history: correct(flight()).history,
  };
  let progress = mergeSession(parseProgress(null), session);
  progress = mergeSession(progress, session);
  assert.equal(progress.sessions.length, 1);
  const restored = parseProgress(JSON.parse(JSON.stringify(progress)));
  assert.equal(
    restored.sessions[0].history[0].sentence,
    session.history[0].sentence,
  );
  assert.equal(
    parseProgress({ version: 1, sessions: [{ ...session, history: [null] }] })
      .sessions[0].history.length,
    0,
  );
});
test("a successful later review removes the question from saved mistakes", () => {
  assert.deepEqual(
    unresolvedQuestions([
      { questionId: "q1", correct: false },
      { questionId: "q2", correct: false },
      { questionId: "q1", correct: true },
    ]),
    ["q2"],
  );
});
test("every editorial record has four unique choices, explanations and one gap", () => {
  for (const [mode, bank] of Object.entries(QUESTION_BANKS))
    for (const q of bank) {
      assert.equal(q.sentence.split("___").length, 2);
      assert.ok(q.explanation.length > 30);
      const choices = buildAnswerChoices(mode, q, rng);
      assert.equal(choices.length, 4);
      assert.equal(new Set(choices).size, 4);
      assert.ok(q.answers.every((a) => choices.includes(a)));
      assert.ok(q.distractors.every((a) => !q.answers.includes(a)));
    }
  const pronoun = QUESTION_BANKS["phrasal-verbs"].find(
    (q) => q.id === "pv-b1-19",
  );
  assert.match(
    pronoun.sentence.replace("___", pronoun.answers[0]),
    /let down my friend/,
  );
  assert.match(pronoun.explanation, /let her down/);
});
