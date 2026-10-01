import assert from "node:assert/strict";
import test from "node:test";
import { LEVELS, QUESTIONS } from "../game/questions.ts";

test("each level has twenty questions", () => {
  for (const level of LEVELS) {
    assert.equal(QUESTIONS.filter((question) => question.level === level).length, 20);
  }
});

test("every question has a unique id and a usable answer", () => {
  assert.equal(new Set(QUESTIONS.map((question) => question.id)).size, QUESTIONS.length);
  for (const question of QUESTIONS) {
    assert.match(question.sentence, /___/);
    assert.ok(question.answers.length > 0);
  }
});
