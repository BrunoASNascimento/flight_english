"use client";

import dynamic from "next/dynamic";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { levelForStreak, pickQuestion, type Question } from "@/game/questions";
import { climbForAnswer, normaliseAnswer, QUESTION_TIME_SECONDS, SERVICE_CEILING_FT, STARTING_ALTITUDE_FT, WRONG_ANSWER_PENALTY_FT } from "@/game/rules";

const FlightScene = dynamic(() => import("./FlightScene"), { ssr: false });
type GameStatus = "idle" | "flying" | "won" | "lost";
type Feedback = { kind: "good" | "bad"; message: string } | null;

function useEngineAudio(active: boolean, altitude: number) {
  const audio = useRef<{ context: AudioContext; oscillators: OscillatorNode[] } | null>(null);
  useEffect(() => {
    if (!active || audio.current) return;
    const context = new AudioContext();
    const gain = context.createGain();
    gain.gain.value = 0.045;
    gain.connect(context.destination);
    const oscillators = [72, 144, 38].map((frequency, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = index === 0 ? "sawtooth" : "sine";
      oscillator.frequency.value = frequency;
      oscillator.connect(gain); oscillator.start(); return oscillator;
    });
    audio.current = { context, oscillators };
    return () => { oscillators.forEach((oscillator) => oscillator.stop()); void context.close(); audio.current = null; };
  }, [active]);
  useEffect(() => {
    const current = audio.current; if (!current) return;
    const pressure = 1 + Math.min(altitude / SERVICE_CEILING_FT, 1) * 0.12;
    current.oscillators[0].frequency.setTargetAtTime(72 * pressure, current.context.currentTime, 0.4);
    current.oscillators[1].frequency.setTargetAtTime(144 * pressure, current.context.currentTime, 0.4);
  }, [altitude]);
}

export default function FlightGame() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [altitude, setAltitude] = useState(STARTING_ALTITUDE_FT);
  const [correct, setCorrect] = useState(0); const [attempts, setAttempts] = useState(0); const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_SECONDS); const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null); const [pitch, setPitch] = useState(0.04);
  const [question, setQuestion] = useState<Question>(() => pickQuestion("A1"));
  const inputRef = useRef<HTMLInputElement>(null); const level = levelForStreak(correct);
  useEngineAudio(status === "flying", altitude);

  const nextQuestion = useCallback((correctCount: number, previousId: string) => {
    setQuestion(pickQuestion(levelForStreak(correctCount), previousId)); setTimeLeft(QUESTION_TIME_SECONDS); setAnswer("");
    window.setTimeout(() => inputRef.current?.focus(), 30);
  }, []);

  const penalise = useCallback((message: string) => {
    setAttempts((value) => value + 1); setStreak(0); setFeedback({ kind: "bad", message }); setPitch(-0.22);
    setAltitude((current) => { const updated = Math.max(0, current - WRONG_ANSWER_PENALTY_FT); if (updated === 0) setStatus("lost"); return updated; });
    window.setTimeout(() => setPitch(0.04), 900);
  }, []);

  useEffect(() => {
    if (status !== "flying") return;
    const timer = window.setInterval(() => setTimeLeft((current) => {
      if (current > 1) return current - 1;
      penalise(`Time expired — ${question.answers[0]}`); nextQuestion(correct, question.id); return QUESTION_TIME_SECONDS;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [correct, nextQuestion, penalise, question, status]);

  function startGame() {
    setAltitude(STARTING_ALTITUDE_FT); setCorrect(0); setAttempts(0); setStreak(0); setQuestion(pickQuestion("A1"));
    setFeedback(null); setTimeLeft(QUESTION_TIME_SECONDS); setStatus("flying"); window.setTimeout(() => inputRef.current?.focus(), 50);
  }

  function submitAnswer(event: FormEvent) {
    event.preventDefault(); if (!answer.trim() || status !== "flying") return;
    const accepted = question.answers.map(normaliseAnswer).includes(normaliseAnswer(answer));
    if (accepted) {
      const newCorrect = correct + 1; const gain = climbForAnswer(timeLeft, streak);
      setCorrect(newCorrect); setAttempts((value) => value + 1); setStreak((value) => value + 1);
      setFeedback({ kind: "good", message: `Correct +${gain.toLocaleString("en-GB")} ft` }); setPitch(0.2);
      setAltitude((current) => { const updated = Math.min(SERVICE_CEILING_FT, current + gain); if (updated === SERVICE_CEILING_FT) setStatus("won"); return updated; });
      window.setTimeout(() => setPitch(0.04), 900); nextQuestion(newCorrect, question.id);
    } else { penalise(`Correct answer: ${question.answers.join(" / ")}`); nextQuestion(correct, question.id); }
  }

  const accuracy = attempts ? Math.round((correct / attempts) * 100) : 100;
  const progress = (altitude / SERVICE_CEILING_FT) * 100; const formattedSentence = useMemo(() => question.sentence.split("___"), [question]);

  return (
    <main className="game-shell">
      <div className="scene" aria-hidden="true"><FlightScene pitch={pitch} altitude={altitude} status={status} /></div><div className="vignette" />
      <header className="topbar"><div className="brand"><span>FLIGHT</span> ENGLISH <small>MOSQUITO B Mk XVI</small></div><div className="mission">MISSION 01 <b>CLIMB TO 37,000 FT</b></div></header>
      <aside className="altimeter" aria-label={`Altitude ${altitude} feet`}><span>ALT</span><strong>{altitude.toLocaleString("en-GB")}</strong><small>FEET</small><div className="altitude-track"><i style={{ height: `${progress}%` }} /></div><em>CEILING 37,000</em></aside>
      {status === "flying" && <section className="question-card">
        <div className="question-meta"><span>{level} · {question.hint.toUpperCase()}</span><span>{timeLeft}s</span></div><div className="timer"><i style={{ width: `${(timeLeft / QUESTION_TIME_SECONDS) * 100}%` }} /></div>
        <h1>{formattedSentence[0]}<span className="blank">?</span>{formattedSentence[1]}</h1>
        <form onSubmit={submitAnswer}><label htmlFor="answer">Missing preposition</label><div className="answer-row"><input ref={inputRef} id="answer" value={answer} onChange={(event) => setAnswer(event.target.value)} autoComplete="off" spellCheck={false} /><button type="submit">CONFIRM <kbd>↵</kbd></button></div></form>
        {feedback && <p className={`feedback ${feedback.kind}`}>{feedback.message}</p>}
      </section>}
      <div className="telemetry"><div><span>LEVEL</span><b>{level}</b></div><div><span>STREAK</span><b>{streak}</b></div><div><span>ACCURACY</span><b>{accuracy}%</b></div></div>
      {status !== "flying" && <section className="briefing">
        <p className="eyebrow">{status === "idle" ? "RAF BOMBER COMMAND · FLIGHT BRIEFING" : status === "won" ? "SERVICE CEILING REACHED" : "AIRCRAFT LOST"}</p>
        <h1>{status === "idle" ? "CLIMB WITH EVERY WORD." : status === "won" ? "MISSION ACCOMPLISHED." : "RETURN TO BASE."}</h1>
        <p>{status === "idle" ? "Supply the missing English preposition. Correct answers generate lift; mistakes and hesitation cost altitude. Difficulty rises from A1 to C1 as you climb." : `Final altitude: ${altitude.toLocaleString("en-GB")} ft · Accuracy: ${accuracy}%`}</p>
        <div className="aircraft-facts"><span>TWIN MERLIN 76/77</span><span>PRESSURISED BOMBER</span><span>CEILING 37,000 FT</span></div>
        <button onClick={startGame}>{status === "idle" ? "START ENGINES" : "FLY AGAIN"}</button><small>Headphones recommended · Desktop prototype</small>
      </section>}
      <div className="desktop-warning">Flight English currently requires a desktop-sized display.</div>
    </main>
  );
}
