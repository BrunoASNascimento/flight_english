import assert from "node:assert/strict";
import test from "node:test";
import { LEVELS, QUESTIONS } from "../game/questions.ts";
import { isAcceptedAnswer } from "../game/rules.ts";

test("each level has twenty-six questions", () => {
  for (const level of LEVELS) {
    assert.equal(QUESTIONS.filter((question) => question.level === level).length, 26);
  }
});

test("music-inspired questions include unique artist and song attribution", () => {
  const musicQuestions = QUESTIONS.filter((question) => question.source);
  assert.equal(musicQuestions.length, 30);
  assert.equal(new Set(musicQuestions.map((question) => question.source.artist)).size, 30);
  for (const question of musicQuestions) {
    assert.ok(question.source.artist.length > 0);
    assert.ok(question.source.song.length > 0);
  }
});

test("accepts every valid alternative answer", () => {
  assert.equal(isAcceptedAnswer("near", ["near", "by"]), true);
  assert.equal(isAcceptedAnswer("BY", ["near", "by"]), true);
  assert.equal(isAcceptedAnswer("  due   to  ", ["because of", "due to"]), true);
  assert.equal(isAcceptedAnswer("because", ["because of", "due to"]), false);
});

test("every question has a unique id and a usable answer", () => {
  assert.equal(new Set(QUESTIONS.map((question) => question.id)).size, QUESTIONS.length);
  for (const question of QUESTIONS) {
    assert.match(question.sentence, /___/);
    assert.ok(question.answers.length > 0);
  }
});
