"use client";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useFlight } from "@/hooks/useFlight";
import { useProgress } from "@/hooks/useProgress";
import { INCIDENTS } from "@/game/flight";
import FlightMenu from "./game/FlightMenu";
import QuestionCard from "./game/QuestionCard";
import Debrief from "./game/Debrief";
import SettingsPanel from "./game/SettingsPanel";

const FlightScene = dynamic(() => import("./FlightScene"), {
  ssr: false,
  loading: () => <div className="scene-loading"></div>,
});
export default function FlightGame() {
  const { progress, ready, storageError, setSettings, record } = useProgress();
  const flight = useFlight(progress.settings, record);
  const { answer, next, pause } = flight;
  const s = flight.state;
  const settings = progress.settings;
  const active = s.status === "flying";
  const paused = s.status === "paused";
  const finished = ["won", "lost", "completed"].includes(s.status);
  const accuracy = s.history.length
    ? `${Math.round((s.history.filter((a) => a.correct).length / s.history.length) * 100)}%`
    : "—";
  useEffect(() => {
    const viewport = window.visualViewport;
    function resize() {
      document.documentElement.style.setProperty(
        "--game-height",
        `${Math.round(viewport?.height ?? window.innerHeight)}px`,
      );
    }
    resize();
    window.addEventListener("resize", resize);
    viewport?.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      viewport?.removeEventListener("resize", resize);
    };
  }, []);
  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      if (
        event.repeat ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        (event.target instanceof HTMLElement &&
          event.target.closest("input, select, textarea, button, summary"))
      )
        return;
      if (!active) return;
      if (event.code === "Escape") {
        event.preventDefault();
        pause();
        return;
      }
      if (s.feedback) {
        if (event.code === "Enter" || event.code === "Space") {
          event.preventDefault();
          next();
        }
        return;
      }
      const keys: Record<string, number> = {
        a: 0,
        b: 1,
        c: 2,
        d: 3,
        "1": 0,
        "2": 1,
        "3": 2,
        "4": 3,
      };
      const index = keys[event.key.toLowerCase()];
      if (index !== undefined) {
        event.preventDefault();
        answer(s.choices[index], s.serial);
      }
    }
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [active, s.feedback, s.choices, s.serial, answer, next, pause]);
  return (
    <main
      className={`game-shell ${s.incident ? "emergency" : ""} ${settings.reducedMotion ? "reduce-motion" : ""}`}
    >
      <div className="scene" aria-hidden="true">
        <FlightScene
          pitch={s.pitch}
          altitude={s.altitude}
          status={s.status}
          emergency={!!s.incident}
          graphics={settings.graphics}
          reducedMotion={settings.reducedMotion}
        />
      </div>
      <div className="vignette" />
      <header className="topbar">
        <div className="brand">
          <span>FLIGHT</span> ENGLISH<small>MOSQUITO B Mk XVI</small>
        </div>
        <div className="controls">
          <button
            aria-pressed={settings.muted}
            onClick={() => setSettings({ ...settings, muted: !settings.muted })}
          >
            {settings.muted ? "UNMUTE" : "MUTE"}
          </button>
          {(active || paused) && (
            <button onClick={flight.pause}>
              {paused ? "RESUME" : "PAUSE"}
            </button>
          )}
        </div>
      </header>
      {(active || paused) && (
        <>
          <aside className="altimeter">
            <span>ALTITUDE</span>
            <strong>{Math.round(s.altitude).toLocaleString("en-GB")}</strong>
            <small>
              FEET ·{" "}
              {s.settings.pace === "practice" ? "PRACTICE" : "TARGET 37,000"}
            </small>
            <div className="altitude-track">
              <i style={{ height: `${s.altitude / 370}%` }} />
            </div>
          </aside>
          <div className="telemetry">
            <div>
              <span>LEVEL</span>
              <b>{s.level}</b>
            </div>
            <div>
              <span>STREAK</span>
              <b>{s.streak}</b>
            </div>
            <div>
              <span>ACCURACY</span>
              <b>{accuracy}</b>
            </div>
          </div>
        </>
      )}
      {active && (
        <>
          <div className="callout" role="status">
            {flight.caption}
          </div>
          {s.incident && !s.feedback && (
            <aside className="incident" role="alert">
              <strong>⚠ {INCIDENTS[s.incident].title}</strong>
              <p>{INCIDENTS[s.incident].instruction}</p>
              <span>
                RECOVERY {s.recovery}/{INCIDENTS[s.incident].required} · LOSING{" "}
                {INCIDENTS[s.incident].drain} FT/S · REWARD +
                {INCIDENTS[s.incident].reward} FT
              </span>
            </aside>
          )}
          <QuestionCard
            flight={s}
            settings={settings}
            onAnswer={flight.answer}
            onNext={flight.next}
          />
        </>
      )}
      {s.status === "idle" && (
        <FlightMenu
          settings={settings}
          onChange={setSettings}
          onStart={() => flight.start()}
          sessions={progress.sessions}
          onReview={(ids, mode) => flight.start(ids, mode)}
          ready={ready}
        />
      )}
      {paused && (
        <section className="briefing paused-menu">
          <p className="eyebrow">TAKE A BREATHER</p>
          <h1>FLIGHT PAUSED</h1>
          <p>Your question and recovery progress are held.</p>
          <button className="launch-button" onClick={flight.pause}>
            RESUME FLIGHT
          </button>
          <SettingsPanel settings={settings} onChange={setSettings} />
          <button className="secondary-button" onClick={flight.leave}>
            End flight and return to menu
          </button>
        </section>
      )}
      {finished && (
        <Debrief
          session={{
            id: "current",
            date: "",
            mode: s.settings.mode,
            pace: s.settings.pace,
            outcome: s.status,
            history: s.history,
          }}
          onReview={(ids, mode) => flight.start(ids, mode)}
          onMenu={flight.leave}
        />
      )}
      {(storageError || flight.audioError) && (
        <div className="notice" role="status">
          {storageError && (
            <span>
              Progress could not be saved on this browser. You can still play.
            </span>
          )}
          {flight.audioError && (
            <span>
              {flight.audioError}{" "}
              {active && (
                <button onClick={flight.retryAudio}>Enable audio</button>
              )}
            </span>
          )}
        </div>
      )}
    </main>
  );
}
