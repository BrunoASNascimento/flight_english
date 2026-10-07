import { weakTopics, type Attempt } from "@/game/training";
import type { ExerciseMode } from "@/game/questions";
import type { Session } from "@/game/storage";

export function MistakeList({ history }: { history: Attempt[] }) {
  const mistakes = history.filter((a) => !a.correct);
  return (
    <div className="mistake-list">
      {mistakes.map((a, i) => (
        <article key={`${a.questionId}-${i}`}>
          <strong>{a.sentence.replace("___", a.answers[0])}</strong>
          <p>
            Your answer: {a.selected ?? "No answer"} · Accepted:{" "}
            {a.answers.join(" / ")}
          </p>
          <p>{a.explanation}</p>
        </article>
      ))}
    </div>
  );
}
export default function Debrief({
  session,
  onReview,
  onMenu,
}: {
  session: Session;
  onReview: (ids: string[], mode: ExerciseMode) => void;
  onMenu: () => void;
}) {
  const correct = session.history.filter((a) => a.correct).length;
  const mistakes = [
    ...new Set(
      session.history.filter((a) => !a.correct).map((a) => a.questionId),
    ),
  ];
  return (
    <section className="briefing debrief" aria-label="Flight debrief">
      <p className="eyebrow">YOUR FLIGHT DEBRIEF</p>
      <h1>
        {session.outcome === "lost"
          ? "READY FOR ANOTHER FLIGHT?"
          : "MISSION COMPLETE."}
      </h1>
      <div className="debrief-stats">
        <div>
          <strong>
            {correct}/{session.history.length}
          </strong>
          <span>Correct answers</span>
        </div>
        <div>
          <strong>
            {session.history.length
              ? Math.round((correct / session.history.length) * 100)
              : 0}
            %
          </strong>
          <span>Accuracy</span>
        </div>
        <div>
          <strong>{mistakes.length}</strong>
          <span>Questions to revisit</span>
        </div>
      </div>
      {weakTopics(session.history).length > 0 && (
        <p className="weak-topics">
          Focus next:{" "}
          {weakTopics(session.history)
            .slice(0, 3)
            .map((t) => `${t.topic} (${t.missed} missed)`)
            .join(" · ")}
        </p>
      )}
      {mistakes.length > 0 ? (
        <>
          <button
            className="launch-button"
            onClick={() => onReview(mistakes, session.mode)}
          >
            PRACTISE MY MISTAKES
          </button>
          <details className="review-details">
            <summary>Review answers and explanations</summary>
            <MistakeList history={session.history} />
          </details>
        </>
      ) : (
        <p>You got every attempted question right.</p>
      )}
      <button className="secondary-button" onClick={onMenu}>
        Back to flight menu
      </button>
    </section>
  );
}
