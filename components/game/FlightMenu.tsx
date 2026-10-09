import {
  EXERCISE_MODES,
  LEVELS,
  MODE_DETAILS,
  type ExerciseMode,
  type Level,
} from "@/game/questions";
import type { Settings } from "@/game/settings";
import type { Session } from "@/game/storage";
import SettingsPanel from "./SettingsPanel";
import { weakTopics, unresolvedQuestions } from "@/game/training";

export default function FlightMenu({
  settings,
  onChange,
  onStart,
  sessions,
  onReview,
  ready,
}: {
  settings: Settings;
  onChange: (next: Settings) => void;
  onStart: () => void;
  sessions: Session[];
  onReview: (ids: string[], mode: ExerciseMode) => void;
  ready: boolean;
}) {
  const history = sessions
    .filter((s) => s.mode === settings.mode)
    .flatMap((s) => s.history);
  const mistakes = unresolvedQuestions(history);
  function change<K extends keyof Settings>(key: K, value: Settings[K]) {
    onChange({ ...settings, [key]: value });
  }
  return (
    <section className="briefing flight-menu" aria-label="Flight menu">
      <p className="eyebrow">MOSQUITO · YOUR ENGLISH FLIGHT SCHOOL</p>
      <h1>WORDS KEEP YOU FLYING.</h1>
      <p>
        Build your English, one flight at a time. Choose relaxed practice or
        take on a survival mission.
      </p>
      <div className="mode-menu" role="group" aria-label="Exercise mode">
        {EXERCISE_MODES.map((mode, i) => (
          <button
            key={mode}
            className={`mode-option ${settings.mode === mode ? "is-selected" : ""}`}
            aria-pressed={settings.mode === mode}
            onClick={() => change("mode", mode)}
          >
            <span>0{i + 1}</span>
            <strong>{MODE_DETAILS[mode].title}</strong>
            <small>{MODE_DETAILS[mode].description}</small>
          </button>
        ))}
      </div>
      <div className="setup-grid">
        <label>
          Flight style
          <select
            value={settings.pace}
            onChange={(e) => change("pace", e.target.value as Settings["pace"])}
          >
            <option value="practice">Practice · relaxed</option>
            <option value="survival">Survival · timed</option>
          </select>
        </label>
        <label>
          Starting level
          <select
            value={settings.level}
            onChange={(e) => change("level", e.target.value as Level)}
          >
            {LEVELS.map((level) => (
              <option key={level}>{level}</option>
            ))}
          </select>
        </label>
        {MODE_DETAILS[settings.mode].shakespeare ? (
          <div className="collection-note" role="note">
            <span>Question collection</span>
            <strong>SHAKESPEARE · ADVANCED</strong>
            <small>Original excerpts · modern explanations</small>
          </div>
        ) : (
          <label>
            Question collection
            <select
              value={settings.content}
              onChange={(e) =>
                change("content", e.target.value as Settings["content"])
              }
            >
              <option value="mixed">Mixed collection</option>
              <option value="everyday">Everyday English</option>
              <option value="music">Music inspired</option>
            </select>
          </label>
        )}
        <label className="check-setting">
          <input
            type="checkbox"
            checked={settings.hints}
            onChange={(e) => change("hints", e.target.checked)}
          />
          Grammar hints in practice
        </label>
      </div>
      <p className="mission-description">
        {settings.pace === "practice"
          ? "20 questions at your pace. Read each correction and continue when ready."
          : "Reach 37,000 ft. Correct answers lift you; mistakes cost 750 ft. Read the meaning clue before choosing. Recover from three distinct emergencies."}
      </p>
      <button className="launch-button" disabled={!ready} onClick={onStart}>
        {ready
          ? `START ${settings.pace.toUpperCase()} FLIGHT`
          : "LOADING PREFERENCES…"}
      </button>
      <SettingsPanel settings={settings} onChange={onChange} />
      <details className="progress-panel">
        <summary>Flight log · {sessions.length} saved flights</summary>
        <p>
          Progress is saved on this browser. Levels are CEFR-inspired practice
          bands, not a proficiency assessment.
        </p>
        {mistakes.length > 0 && (
          <>
            <p>
              Focus next:{" "}
              {weakTopics(history)
                .slice(0, 3)
                .map((t) => t.topic)
                .join(" · ")}
            </p>
            <button
              className="secondary-button"
              onClick={() => onReview(mistakes, settings.mode)}
            >
              Practise saved mistakes ({mistakes.length})
            </button>
          </>
        )}
        {sessions
          .slice(-5)
          .reverse()
          .map((s) => (
            <div className="log-row" key={s.id}>
              <span>
                {new Date(s.date).toLocaleDateString("en-GB")} · {s.mode} ·{" "}
                {s.pace}
              </span>
              <b>
                {s.history.filter((a) => a.correct).length}/{s.history.length}
              </b>
            </div>
          ))}
        {!sessions.length && (
          <p>Your first completed flight will appear here.</p>
        )}
      </details>
    </section>
  );
}
