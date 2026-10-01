"use client";
import dynamic from "next/dynamic";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  pickQuestion,
  levelForStreak,
  type ExerciseMode,
} from "@/game/questions";
import { isAcceptedAnswer, climbForAnswer } from "@/game/rules";
import { crossedAltitudes, INCIDENTS, type Incident } from "@/game/flight";
const FlightScene = dynamic(() => import("./FlightScene"), { ssr: false });
const labels: Record<number, string> = {
  1000: "One Thousand",
  500: "Five Hundred",
  400: "Four Hundred",
  300: "Three Hundred",
  200: "Two Hundred",
};
const MODE_OPTIONS: ExerciseMode[] = ["prepositions", "phrasal-verbs"];
const MODE_DETAILS: Record<
  ExerciseMode,
  {
    title: string;
    shortTitle: string;
    description: string;
    inputLabel: string;
  }
> = {
  prepositions: {
    title: "PREPOSITIONS",
    shortTitle: "PREPOSITION",
    description: "Complete everyday sentences with the missing preposition.",
    inputLabel: "Missing preposition",
  },
  "phrasal-verbs": {
    title: "PHRASAL VERBS",
    shortTitle: "PHRASAL VERB",
    description: "Complete everyday sentences with the missing phrasal verb.",
    inputLabel: "Missing phrasal verb",
  },
};
function initial(mode: ExerciseMode = "prepositions") {
  return {
    status: "idle",
    mode,
    altitude: 5000,
    target: 5000,
    correct: 0,
    attempts: 0,
    streak: 0,
    time: 10,
    elapsed: 0,
    nextEmergency: 25,
    incident: null as Incident | null,
    recovery: 0,
    question: pickQuestion(mode, "A1"),
    feedback: "",
    pitch: 0,
  };
}
type Flight = ReturnType<typeof initial>;
export default function FlightGame() {
  const [selectedMode, setSelectedMode] =
    useState<ExerciseMode>("prepositions");
  const [state, setState] = useState<Flight>(() => initial("prepositions"));
  const live = useRef(state);
  const [answer, setAnswer] = useState("");
  const [muted, setMuted] = useState(false);
  const [caption, setCaption] = useState("");
  const audio = useRef<AudioContext | null>(null);
  const gain = useRef<GainNode | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const muteRef = useRef(false);
  const lastAlarm = useRef(0);
  function publish(next: Flight) {
    live.current = next;
    setState(next);
  }
  useEffect(() => {
    const viewport = window.visualViewport;
    const setGameHeight = () => {
      document.documentElement.style.setProperty(
        "--game-height",
        `${Math.round(viewport?.height ?? window.innerHeight)}px`,
      );
    };

    setGameHeight();
    window.addEventListener("resize", setGameHeight);
    viewport?.addEventListener("resize", setGameHeight);
    return () => {
      window.removeEventListener("resize", setGameHeight);
      viewport?.removeEventListener("resize", setGameHeight);
    };
  }, []);
  function say(message: string) {
    setCaption(message);
    if (!muteRef.current && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "en-GB";
      utterance.rate = 1.02;
      utterance.pitch = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }
  function alarm() {
    const ctx = audio.current;
    if (!ctx || muteRef.current) return;
    const tone = ctx.createOscillator();
    const volume = ctx.createGain();
    tone.frequency.setValueAtTime(850, ctx.currentTime);
    tone.frequency.setValueAtTime(650, ctx.currentTime + 0.18);
    volume.gain.setValueAtTime(0.045, ctx.currentTime);
    volume.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    tone.connect(volume);
    volume.connect(ctx.destination);
    tone.start();
    tone.stop(ctx.currentTime + 0.45);
  }
  function incorrectAnswerAlarm() {
    const ctx = audio.current;
    if (!ctx || muteRef.current) return;

    const volume = ctx.createGain();
    volume.gain.setValueAtTime(0.0001, ctx.currentTime);
    volume.connect(ctx.destination);

    [0, 0.18, 0.36].forEach((start, index) => {
      const tone = ctx.createOscillator();
      tone.type = "square";
      tone.frequency.setValueAtTime(
        index % 2 === 0 ? 880 : 660,
        ctx.currentTime + start,
      );
      tone.connect(volume);
      volume.gain.setValueAtTime(0.0001, ctx.currentTime + start);
      volume.gain.linearRampToValueAtTime(
        0.052,
        ctx.currentTime + start + 0.012,
      );
      volume.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + start + 0.13,
      );
      tone.start(ctx.currentTime + start);
      tone.stop(ctx.currentTime + start + 0.14);
    });
  }
  async function start() {
    window.speechSynthesis?.cancel();
    if (audio.current) await audio.current.close();
    const ctx = new AudioContext();
    audio.current = ctx;
    await ctx.resume();
    const volume = ctx.createGain();
    volume.gain.value = muteRef.current ? 0 : 0.018;
    volume.connect(ctx.destination);
    gain.current = volume;
    [63, 65, 126].forEach((f) => {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = f;
      osc.connect(volume);
      osc.start();
    });
    setAnswer("");
    setCaption("");
    lastAlarm.current = 0;
    publish({ ...initial(selectedMode), status: "flying" });
    input.current?.focus();
  }
  useEffect(() => {
    const timer = window.setInterval(() => {
      const s = live.current;
      if (s.status !== "flying") return;
      const dt = 0.1;
      const n = { ...s, elapsed: s.elapsed + dt, time: s.time - dt };
      if (!n.incident && n.elapsed >= n.nextEmergency) {
        const kinds: Incident[] = ["downdraft", "engine", "icing"];
        n.incident = kinds[Math.floor(n.elapsed / 25 - 1) % 3];
        n.recovery = 0;
        alarm();
        say(INCIDENTS[n.incident].title);
      }
      const drain = n.incident ? INCIDENTS[n.incident].drain : 18;
      if (n.target < 37000) n.target = Math.max(0, n.target - drain * dt);
      const difference = n.target - n.altitude;
      n.altitude = Math.max(
        0,
        Math.min(
          37000,
          n.altitude +
            Math.sign(difference) *
              Math.min(Math.abs(difference), dt * (difference < 0 ? 140 : 650)),
        ),
      );
      n.pitch = difference > 30 ? 0.12 : difference < -30 ? -0.13 : 0;
      for (const threshold of crossedAltitudes(s.altitude, n.altitude))
        say(labels[threshold]);
      if (n.altitude < 200 && n.elapsed - lastAlarm.current > 4) {
        lastAlarm.current = n.elapsed;
        alarm();
        say("Terrain. Pull up.");
      }
      if (n.time <= 0) {
        n.attempts++;
        n.streak = 0;
        n.target = Math.max(0, n.target - 750);
        n.feedback = `Time expired: ${n.question.answers.join(" / ")}`;
        n.question = pickQuestion(
          n.mode,
          levelForStreak(n.correct),
          n.question.id,
        );
        n.time = 10;
        setAnswer("");
      }
      if (n.altitude <= 0 || n.altitude >= 36999) {
        n.status = n.altitude <= 0 ? "lost" : "won";
        window.speechSynthesis?.cancel();
        say(n.status === "won" ? "Mission accomplished" : "Flight ended");
        if (gain.current) gain.current.gain.value = 0;
      }
      publish(n);
    }, 100);
    const pause = () => {
      if (document.hidden && live.current.status === "flying") {
        publish({ ...live.current, status: "paused" });
        window.speechSynthesis?.cancel();
        void audio.current?.suspend();
      }
    };
    document.addEventListener("visibilitychange", pause);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", pause);
      window.speechSynthesis?.cancel();
      void audio.current?.close();
    };
    // The fixed clock reads current flight and mute state through refs.
  }, []);
  function submit(e: FormEvent) {
    e.preventDefault();
    const s = live.current;
    if (s.status !== "flying" || !answer.trim()) return;
    const accepted = isAcceptedAnswer(answer, s.question.answers);
    const n = { ...s, attempts: s.attempts + 1, time: 10 };
    if (accepted) {
      n.correct++;
      n.streak++;
      n.target = Math.min(37000, n.target + climbForAnswer(s.time, s.streak));
      n.feedback = "Correct — climbing";
      if (n.incident) {
        n.recovery++;
        if (n.recovery >= 2) {
          n.incident = null;
          n.nextEmergency = n.elapsed + 30;
          n.target = Math.min(37000, n.target + 1000);
          n.feedback = "Emergency recovered! +1,000 ft";
          say("Power restored. Climb.");
        }
      }
    } else {
      n.streak = 0;
      n.target = Math.max(0, n.target - 750);
      n.feedback = `Correct answer: ${s.question.answers.join(" / ")}`;
      incorrectAnswerAlarm();
    }
    n.question = pickQuestion(
      s.mode,
      levelForStreak(n.correct),
      s.question.id,
    );
    publish(n);
    setAnswer("");
    input.current?.focus();
  }
  function pause() {
    const running = live.current.status === "flying";
    publish({ ...live.current, status: running ? "paused" : "flying" });
    if (running) {
      window.speechSynthesis?.cancel();
      void audio.current?.suspend();
    } else {
      void audio.current?.resume();
    }
  }
  const level = levelForStreak(state.correct);
  const modeDetails = MODE_DETAILS[state.mode];
  const selectedModeDetails = MODE_DETAILS[selectedMode];
  const sentence = state.question.sentence.split("___");
  const accuracy = state.attempts
    ? Math.round((state.correct / state.attempts) * 100)
    : 100;
  return (
    <main className={`game-shell ${state.incident ? "emergency" : ""}`}>
      <div className="scene" aria-hidden="true">
        <FlightScene
          pitch={state.pitch}
          altitude={state.altitude}
          status={state.status}
          emergency={!!state.incident}
        />
      </div>
      <div className="vignette" />
      <header className="topbar">
        <div className="brand">
          <span>FLIGHT</span> ENGLISH<small>MOSQUITO B Mk XVI</small>
        </div>
        <div className="controls">
          <button
            onClick={() => {
              muteRef.current = !muteRef.current;
              setMuted(muteRef.current);
              if (gain.current)
                gain.current.gain.value = muteRef.current ? 0 : 0.018;
              if (muteRef.current) window.speechSynthesis?.cancel();
            }}
          >
            {muted ? "UNMUTE" : "MUTE"}
          </button>
          {["flying", "paused"].includes(state.status) && (
            <button onClick={pause}>
              {state.status === "paused" ? "RESUME" : "PAUSE"}
            </button>
          )}
        </div>
      </header>
      <aside className="altimeter">
        <span>ALTITUDE</span>
        <strong>{Math.round(state.altitude).toLocaleString("en-GB")}</strong>
        <small>FEET · TARGET 37,000</small>
        <div className="altitude-track">
          <i style={{ height: `${state.altitude / 370}%` }} />
        </div>
      </aside>
      <div className="telemetry">
        <div>
          <span>LEVEL</span>
          <b>{level}</b>
        </div>
        <div>
          <span>STREAK</span>
          <b>{state.streak}</b>
        </div>
        <div>
          <span>ACCURACY</span>
          <b>{accuracy}%</b>
        </div>
      </div>
      {state.status === "flying" && (
        <>
          <div className="callout" role="status">
            {caption}
          </div>
          {state.incident && (
            <aside className="incident" role="alert">
              <strong>⚠ {INCIDENTS[state.incident].title}</strong>
              <p>{INCIDENTS[state.incident].instruction}</p>
              <span>
                RECOVERY {state.recovery} / 2 · LOSING{" "}
                {INCIDENTS[state.incident].drain} FT/S
              </span>
            </aside>
          )}
          <section className="question-card">
            <div className="question-meta">
              <span>
                {level} · {modeDetails.shortTitle} · {state.question.hint}
              </span>
              <span>{Math.ceil(state.time)}s</span>
            </div>
            {state.question.source && (
              <div className="music-source">
                <span>MUSIC INSPIRED</span>
                <strong>{state.question.source.artist}</strong>
                <span aria-hidden="true">·</span>
                <em>{state.question.source.song}</em>
              </div>
            )}
            <div className="timer">
              <i style={{ width: `${state.time * 10}%` }} />
            </div>
            <h1>
              {sentence[0]}
              <span className="blank">?</span>
              {sentence[1]}
            </h1>
            <form onSubmit={submit}>
              <label htmlFor="answer">{modeDetails.inputLabel}</label>
              <div className="answer-row">
                <input
                  autoFocus
                  ref={input}
                  id="answer"
                  autoComplete="off"
                  spellCheck={false}
                  autoCapitalize="none"
                  autoCorrect="off"
                  inputMode="text"
                  enterKeyHint="done"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
                <button>
                  CONFIRM <span className="keyboard-hint">↵</span>
                </button>
              </div>
            </form>
            <p className="feedback" role="status">
              {state.feedback}
            </p>
          </section>
        </>
      )}
      {state.status !== "flying" && (
        <section className="briefing">
          <p className="eyebrow">MOSQUITO · SURVIVAL FLIGHT</p>
          <h1>
            {state.status === "idle"
              ? "WORDS KEEP YOU FLYING."
              : state.status === "paused"
                ? "FLIGHT PAUSED"
                : state.status === "won"
                  ? "CEILING REACHED"
                  : "FLIGHT ENDED"}
          </h1>
          <p>
            {state.status === "idle"
              ? `${selectedModeDetails.description} Survive downdrafts, engine power loss and wing icing: two correct answers resolve each emergency. Your aircraft steadily loses height — stay sharp.`
              : `${modeDetails.title} · Accuracy ${accuracy}% · Correct answers ${state.correct}`}
          </p>
          {state.status !== "paused" && (
            <div className="mode-menu" role="group" aria-label="Exercise mode">
              {MODE_OPTIONS.map((mode) => {
                const details = MODE_DETAILS[mode];
                const selected = selectedMode === mode;
                return (
                  <button
                    type="button"
                    key={mode}
                    className={`mode-option ${selected ? "is-selected" : ""}`}
                    aria-pressed={selected}
                    onClick={() => setSelectedMode(mode)}
                  >
                    <span>{mode === "prepositions" ? "01" : "02"}</span>
                    <strong>{details.title}</strong>
                    <small>{details.description}</small>
                  </button>
                );
              })}
            </div>
          )}
          <div className="aircraft-facts">
            <span>A1 → C1</span>
            <span>3 EMERGENCIES</span>
            <span>VOICE CALLOUTS</span>
          </div>
          <button
            className="launch-button"
            onClick={state.status === "paused" ? pause : start}
          >
            {state.status === "paused"
              ? "RESUME FLIGHT"
              : `START ${selectedModeDetails.title}`}
          </button>
          <small>
            Modern-style synthetic callouts · Mobile and desktop · Sound can be muted
          </small>
        </section>
      )}
    </main>
  );
}
