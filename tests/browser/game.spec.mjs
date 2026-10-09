import { test, expect } from "@playwright/test";
import { QUESTION_BANKS } from "../../game/questions.ts";
import { DEFAULT_SETTINGS } from "../../game/settings.ts";

async function currentQuestion(page, mode = "prepositions") {
  const text = await page.locator(".question-card h1").innerText();
  const normalise = (s) => s.replace(/\s+/g, " ").trim();
  return QUESTION_BANKS[mode].find(
    (q) => normalise(q.sentence.replace("___", "?")) === normalise(text),
  );
}
async function answer(page, correct = true, mode = "prepositions") {
  const q = await currentQuestion(page, mode);
  expect(q).toBeTruthy();
  const selected = correct ? q.answers[0] : q.distractors[0];
  await page
    .locator(".choice-grid")
    .getByRole("button", { name: selected, exact: true })
    .click();
  return q;
}
async function configure(page, changes = {}) {
  await page.addInitScript(
    (settings) => {
      if (localStorage.getItem("flight-english.v1")) return;
      localStorage.setItem(
        "flight-english.v1",
        JSON.stringify({ version: 1, settings, sessions: [] }),
      );
    },
    { ...DEFAULT_SETTINGS, graphics: "low", reducedMotion: true, ...changes },
  );
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: /START .* FLIGHT/ }),
  ).toBeEnabled();
}

test("practice corrections remain readable, pause works, and a debrief can review mistakes", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await configure(page);
  await page.screenshot({ path: test.info().outputPath("menu.png") });
  await page.getByRole("button", { name: "START PRACTICE FLIGHT" }).click();
  const q = await answer(page, false);
  await expect(page.getByText("Let’s review this one")).toBeVisible();
  await expect(page.locator(".question-card h1")).toContainText(q.answers[0]);
  await expect(page.locator(".answer-feedback")).toContainText(q.explanation);
  await expect(
    page.getByRole("button", { name: "Next question" }),
  ).toBeInViewport();
  await page.screenshot({ path: test.info().outputPath("feedback.png") });
  await page.getByRole("button", { name: "PAUSE", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "FLIGHT PAUSED" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "RESUME FLIGHT", exact: true })
    .click();
  await expect(page.getByText("Let’s review this one")).toBeVisible();
  await page.getByRole("button", { name: "Next question" }).click();
  for (let i = 1; i < 20; i++) {
    await answer(page, true);
    await page.getByRole("button", { name: "Next question" }).click();
  }
  await expect(
    page.getByRole("heading", { name: "MISSION COMPLETE." }),
  ).toBeVisible();
  await expect(page.locator(".debrief-stats")).toContainText("19/20");
  await page.getByRole("button", { name: "PRACTISE MY MISTAKES" }).click();
  await answer(page, true);
  await page.getByRole("button", { name: "Next question" }).click();
  await expect(page.locator(".debrief-stats")).toContainText("1/1");
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("flight-english.v1")),
  );
  expect(saved.sessions).toHaveLength(2);
  expect(errors).toEqual([]);
});

test("preferences survive reload and both grammar modes keep four choices", async ({
  page,
}) => {
  await configure(page, {
    mode: "phrasal-verbs",
    level: "B2",
    content: "music",
  });
  await expect(page.getByLabel("Starting level")).toHaveValue("B2");
  await page.getByLabel("Starting level").selectOption("C1");
  await page.reload();
  await expect(page.getByLabel("Starting level")).toHaveValue("C1");
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("flight-english.v1")),
  );
  expect(saved.settings.level).toBe("C1");
  await page.getByRole("button", { name: "START PRACTICE FLIGHT" }).click();
  await expect(page.locator(".choice-grid button")).toHaveCount(4);
  await expect(page.locator(".question-meta")).toContainText("PHRASAL VERB");
  await answer(page, true, "phrasal-verbs");
});

test("Shakespeare modes keep four difficult choices and identify the work", async ({
  page,
}) => {
  await configure(page, {
    mode: "shakespeare-phrasal-verbs",
    level: "B1",
    content: "music",
  });
  await expect(page.getByText("SHAKESPEARE · ADVANCED")).toBeVisible();
  await page.getByRole("button", { name: "START PRACTICE FLIGHT" }).click();
  await expect(page.locator(".choice-grid button")).toHaveCount(4);
  await expect(page.locator(".question-meta")).toContainText(
    "SHAKESPEARE PHRASAL VERB",
  );
  await expect(page.getByText("FROM SHAKESPEARE")).toBeVisible();
  await answer(page, true, "shakespeare-phrasal-verbs");
});

test("survival hides music attribution until feedback and resumes after timeout", async ({
  page,
}) => {
  await configure(page, { pace: "survival", content: "music" });
  await page.getByRole("button", { name: "START SURVIVAL FLIGHT" }).click();
  await expect(page.locator(".music-source")).toHaveCount(0);
  await expect(page.getByText("Time expired", { exact: true })).toBeVisible({
    timeout: 25000,
  });
  await expect(page.locator(".music-source")).toBeVisible();
  await expect(page.locator(".choice-grid button")).toHaveCount(4, {
    timeout: 10000,
  });
});

test("soundtrack loads from the app and pauses with the flight", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const NativeAudio = window.Audio;
    window.__music = [];
    window.Audio = function (...args) {
      const audio = new NativeAudio(...args);
      window.__music.push(audio);
      return audio;
    };
  });
  await configure(page);
  const responsePromise = page.waitForResponse((r) =>
    r.url().includes("/audio/cleared-for-takeoff.mp3"),
  );
  await page.getByRole("button", { name: "START PRACTICE FLIGHT" }).click();
  const response = await responsePromise;
  expect([200, 206]).toContain(response.status());
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.__music.some((a) => !a.paused && a.currentTime > 0),
      ),
    )
    .toBe(true);
  await page.evaluate(() => {
    window.__music[0].currentTime = window.__music[0].duration - 1;
  });
  await expect
    .poll(() =>
      page.evaluate(
        () => !window.__music[1].paused && window.__music[1].currentTime > 0,
      ),
    )
    .toBe(true);
  await page.getByRole("button", { name: "MUTE", exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(() => window.__music.every((a) => a.volume === 0)),
    )
    .toBe(true);
  await page.getByRole("button", { name: "UNMUTE", exact: true }).click();
  await page.getByRole("button", { name: "PAUSE", exact: true }).click();
  expect(await page.evaluate(() => window.__music.every((a) => a.paused))).toBe(
    true,
  );
  await page
    .getByRole("button", { name: "RESUME FLIGHT", exact: true })
    .click();
  await expect
    .poll(() => page.evaluate(() => window.__music.some((a) => !a.paused)))
    .toBe(true);
});
