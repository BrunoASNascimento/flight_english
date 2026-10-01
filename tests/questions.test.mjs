import assert from "node:assert/strict";
import test from "node:test";
import {
  LEVELS,
  QUESTION_BANKS,
  QUESTIONS,
  pickQuestion,
} from "../game/questions.ts";
import { PHRASAL_VERB_QUESTIONS } from "../game/phrasal-verbs.ts";
import { isAcceptedAnswer } from "../game/rules.ts";

test("each level has twenty-six questions", () => {
  for (const level of LEVELS) {
    assert.equal(QUESTIONS.filter((question) => question.level === level).length, 26);
  }
});

test("both modes include thirty attributed music-inspired questions", () => {
  for (const bank of [QUESTIONS, PHRASAL_VERB_QUESTIONS]) {
    const musicQuestions = bank.filter((question) => question.source);
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
  assert.match(pickQuestion("prepositions", "A1").id, /^a1-/);
  assert.match(pickQuestion("phrasal-verbs", "C1").id, /^pv-c1-/);
});

test("accepts every valid alternative answer", () => {
  assert.equal(isAcceptedAnswer("near", ["near", "by"]), true);
  assert.equal(isAcceptedAnswer("BY", ["near", "by"]), true);
  assert.equal(isAcceptedAnswer("  due   to  ", ["because of", "due to"]), true);
  assert.equal(isAcceptedAnswer("SWITCH OFF", ["turn off", "switch off"]), true);
  assert.equal(isAcceptedAnswer("because", ["because of", "due to"]), false);
});

test("every question in both modes has a unique id and a usable answer", () => {
  const allQuestions = [...QUESTIONS, ...PHRASAL_VERB_QUESTIONS];
  assert.equal(
    new Set(allQuestions.map((question) => question.id)).size,
    allQuestions.length,
  );
  for (const question of allQuestions) {
    assert.match(question.sentence, /___/);
    assert.ok(question.answers.length > 0);
  }
});
