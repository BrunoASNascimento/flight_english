import { memo } from "react";
import type { Flight } from "@/game/engine";
import type { Settings } from "@/game/settings";

function QuestionCard({
  flight,
  settings,
  onAnswer,
  onNext,
}: {
  flight: Flight;
  settings: Settings;
  onAnswer: (choice: string, serial: number) => void;
  onNext: () => void;
}) {
  const q = flight.question;
  const feedback = flight.feedback;
  const parts = q.sentence.split("___");
  const showSource =
    !!q.source && (flight.settings.pace === "practice" || !!feedback);
  return (
    <section
      className={`question-card ${feedback ? "has-feedback" : ""}`}
      aria-label="English exercise"
    >
      <div className="question-meta">
        <span>
          {q.level} ·{" "}
          {flight.settings.mode === "prepositions"
            ? "PREPOSITION"
            : "PHRASAL VERB"}
        </span>
        <span>
          {flight.settings.pace === "practice"
            ? `${flight.history.length}/${flight.reviewIds.length || 20} · NO TIMER`
            : feedback
              ? "REVIEW"
              : `${Math.ceil(flight.time)}s`}
        </span>
      </div>
      <p className="meaning-clue">
        Meaning to express: <strong>{q.hint}</strong>
      </p>
      {showSource && (
        <p className="music-source">
          <span>MUSIC INSPIRED</span>
          <strong>{q.source!.artist}</strong>
          <em>{q.source!.song}</em>
        </p>
      )}
      {flight.settings.pace === "survival" && !feedback && (
        <div className="timer" aria-hidden="true">
          <i
            style={{ width: `${(flight.time / flight.questionTime) * 100}%` }}
          />
        </div>
      )}
      <h1>
        {parts[0]}
        <span className={feedback ? "filled-blank" : "blank"}>
          {feedback ? q.answers[0] : "?"}
        </span>
        {parts[1]}
      </h1>
      {feedback ? (
        <div
          className={`answer-feedback ${feedback.correct ? "is-correct" : "is-incorrect"}`}
          role="status"
          aria-live="polite"
        >
          <strong>
            {feedback.correct
              ? "Correct — well done!"
              : feedback.selected === null
                ? "Time expired"
                : "Let’s review this one"}
          </strong>
          {!feedback.correct && (
            <p>
              Your answer: <b>{feedback.selected ?? "No answer"}</b>
            </p>
          )}
          <p>
            Accepted: <b>{q.answers.join(" / ")}</b>
          </p>
          <p>{q.explanation}</p>
          <button className="next-button" onClick={onNext}>
            Next question <span aria-hidden="true">→</span>
          </button>
          {flight.settings.pace === "survival" && (
            <small>
              Continues automatically · flight and timer paused during feedback
            </small>
          )}
        </div>
      ) : (
        <>
          <div
            className="choice-grid"
            role="group"
            aria-label="Choose one answer"
          >
            {flight.choices.map((choice, index) => (
              <button
                key={`${flight.serial}-${choice}`}
                onClick={() => onAnswer(choice, flight.serial)}
              >
                <span aria-hidden="true">
                  {String.fromCharCode(65 + index)}
                </span>
                {choice}
              </button>
            ))}
          </div>
          <p className="choice-instruction">
            Select one · Any listed valid alternative is accepted · A–D or 1–4
            on desktop
          </p>
          {settings.hints && flight.settings.pace === "practice" && (
            <details className="grammar-hint" key={flight.serial}>
              <summary>Show grammar hint</summary>
              <p>{q.explanation}</p>
            </details>
          )}
        </>
      )}
    </section>
  );
}
export default memo(QuestionCard);
