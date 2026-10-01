export const SERVICE_CEILING_FT = 37_000;
export const STARTING_ALTITUDE_FT = 5_000;
export const QUESTION_TIME_SECONDS = 10;
export const WRONG_ANSWER_PENALTY_FT = 750;

export function climbForAnswer(timeLeft: number, streak: number) {
  return 550 + Math.max(0, timeLeft) * 25 + Math.min(streak, 6) * 75;
}

export function normaliseAnswer(value: string) {
  return value.trim().toLocaleLowerCase("en-GB").replace(/\s+/g, " ");
}

export function isAcceptedAnswer(answer: string, acceptedAnswers: readonly string[]) {
  const normalisedAnswer = normaliseAnswer(answer);
  return acceptedAnswers.some(
    (acceptedAnswer) => normaliseAnswer(acceptedAnswer) === normalisedAnswer,
  );
}
