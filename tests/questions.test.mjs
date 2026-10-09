import assert from "node:assert/strict";
import test from "node:test";
import {
  buildAnswerChoices,
  LEVELS,
  QUESTION_BANKS,
  QUESTIONS,
  pickQuestion,
} from "../game/questions.ts";
import { PHRASAL_VERB_QUESTIONS } from "../game/phrasal-verbs.ts";
import {
  SHAKESPEARE_PHRASAL_VERB_QUESTIONS,
  SHAKESPEARE_PREPOSITION_QUESTIONS,
} from "../game/shakespeare.ts";
import { isAcceptedAnswer } from "../game/rules.ts";

test("each level has twenty-six questions", () => {
  for (const level of LEVELS) {
    assert.equal(
      QUESTIONS.filter((question) => question.level === level).length,
      26,
    );
  }
});

test("both modes include thirty attributed music-inspired questions", () => {
  for (const bank of [QUESTIONS, PHRASAL_VERB_QUESTIONS]) {
    const musicQuestions = bank.filter(
      (question) => question.source?.kind === "music",
    );
    assert.equal(musicQuestions.length, 30);
    assert.equal(
      new Set(musicQuestions.map((question) => question.source.artist)).size,
      30,
    );
    for (const question of musicQuestions) {
      assert.ok(question.source.artist.length > 0);
      assert.ok(question.source.song.length > 0);
    }
  }
});

test("each level has twenty-six phrasal-verb questions", () => {
  for (const level of LEVELS) {
    assert.equal(
      PHRASAL_VERB_QUESTIONS.filter((question) => question.level === level)
        .length,
      26,
    );
  }
});

test("question selection stays inside the chosen exercise mode", () => {
  assert.equal(QUESTION_BANKS.prepositions, QUESTIONS);
  assert.equal(QUESTION_BANKS["phrasal-verbs"], PHRASAL_VERB_QUESTIONS);
  assert.equal(
    QUESTION_BANKS["shakespeare-prepositions"],
    SHAKESPEARE_PREPOSITION_QUESTIONS,
  );
  assert.equal(
    QUESTION_BANKS["shakespeare-phrasal-verbs"],
    SHAKESPEARE_PHRASAL_VERB_QUESTIONS,
  );
  assert.match(pickQuestion("prepositions", "A1").id, /^a1-/);
  assert.match(pickQuestion("phrasal-verbs", "C1").id, /^pv-c1-/);
  assert.match(
    pickQuestion("shakespeare-prepositions", "B1").id,
    /^sh-prep-b1-/,
  );
  assert.match(
    pickQuestion("shakespeare-phrasal-verbs", "B2").id,
    /^sh-pv-b2-/,
  );
});

test("Shakespeare modes have eight attributed questions at every level", () => {
  for (const bank of [
    SHAKESPEARE_PREPOSITION_QUESTIONS,
    SHAKESPEARE_PHRASAL_VERB_QUESTIONS,
  ]) {
    for (const level of LEVELS)
      assert.equal(
        bank.filter((question) => question.level === level).length,
        8,
      );
    for (const question of bank) {
      assert.equal(question.source.kind, "shakespeare");
      assert.ok(question.source.work.length > 0);
    }
  }
  assert.equal(
    new Set(
      SHAKESPEARE_PHRASAL_VERB_QUESTIONS.map((question) => question.answers[0]),
    ).size,
    SHAKESPEARE_PHRASAL_VERB_QUESTIONS.length,
  );
});

test("accepts every valid alternative answer", () => {
  assert.equal(isAcceptedAnswer("near", ["near", "by"]), true);
  assert.equal(isAcceptedAnswer("BY", ["near", "by"]), true);
  assert.equal(
    isAcceptedAnswer("  due   to  ", ["because of", "due to"]),
    true,
  );
  assert.equal(
    isAcceptedAnswer("SWITCH OFF", ["turn off", "switch off"]),
    true,
  );
  assert.equal(isAcceptedAnswer("because", ["because of", "due to"]), false);
});

test("mobile choices contain every valid answer and difficult distractors", () => {
  for (const [mode, bank] of Object.entries(QUESTION_BANKS)) {
    for (const question of bank) {
      const choices = buildAnswerChoices(mode, question, () => 0.42);
      assert.equal(choices.length, 4);
      assert.equal(
        new Set(choices.map((choice) => choice.toLowerCase())).size,
        4,
      );
      for (const answer of question.answers) {
        assert.ok(choices.includes(answer));
      }
      assert.ok(
        choices.some((choice) => !isAcceptedAnswer(choice, question.answers)),
      );
    }
  }

  const deviceQuestion = PHRASAL_VERB_QUESTIONS.find(
    (question) => question.id === "pv-a1-7",
  );
  const deviceChoices = buildAnswerChoices(
    "phrasal-verbs",
    deviceQuestion,
    () => 0.42,
  );
  assert.ok(deviceChoices.includes("turn off"));
  assert.ok(deviceChoices.includes("turn down"));
  assert.ok(deviceChoices.includes("switch on"));
});

test("every question in every mode has a unique id and a usable answer", () => {
  const allQuestions = Object.values(QUESTION_BANKS).flat();
  assert.equal(
    new Set(allQuestions.map((question) => question.id)).size,
    allQuestions.length,
  );
  for (const question of allQuestions) {
    assert.match(question.sentence, /___/);
    assert.ok(question.answers.length > 0);
  }
});
