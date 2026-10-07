"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  advanceFlight,
  answerFlight,
  createFlight,
  pauseFlight,
  tickFlight,
  type Flight,
} from "@/game/engine";
import { DEFAULT_SETTINGS, type Settings } from "@/game/settings";
import { crossedAltitudes, INCIDENTS } from "@/game/flight";
import { FlightAudio } from "@/game/audio";
import type { Session } from "@/game/storage";

export function useFlight(
  settings: Settings,
  onComplete: (session: Session) => void,
) {
  const [state, setState] = useState<Flight>(() =>
    createFlight(DEFAULT_SETTINGS),
  );
  const [caption, setCaption] = useState("");
  const [audioError, setAudioError] = useState("");
  const live = useRef(state);
  const mixer = useRef<FlightAudio | null>(null);
  const complete = useRef(onComplete);
  const sessionId = useRef("");
  const lastAlarm = useRef(-10);
  useEffect(() => {
    complete.current = onComplete;
  }, [onComplete]);
  useEffect(() => {
    mixer.current?.update(settings);
  }, [settings]);
  const publish = useCallback((n: Flight) => {
    const previous = live.current;
    if (n === previous) return;
    live.current = n;
    setState(n);
    if (n.feedback && n.feedback !== previous.feedback && !n.feedback.correct)
      mixer.current?.alarm(true);
    if (n.incident && n.incident !== previous.incident) {
      const message = INCIDENTS[n.incident].title;
      setCaption(message);
      mixer.current?.alarm();
      mixer.current?.say(message);
    } else if (previous.incident && !n.incident && n.status === "flying") {
      setCaption("Emergency recovered. Climb.");
      mixer.current?.say("Emergency recovered. Climb.");
    }
    const thresholds = crossedAltitudes(previous.altitude, n.altitude);
    if (thresholds.length) {
      const labels: Record<number, string> = {
        1000: "One Thousand",
        500: "Five Hundred",
        400: "Four Hundred",
        300: "Three Hundred",
        200: "Two Hundred",
      };
      const message = labels[thresholds.at(-1)!];
      setCaption(message);
      mixer.current?.say(message);
    }
    if (
      n.status === "flying" &&
      !n.feedback &&
      n.altitude < 200 &&
      n.elapsed - lastAlarm.current > 4
    ) {
      lastAlarm.current = n.elapsed;
      setCaption("Terrain. Pull up.");
      mixer.current?.alarm();
      mixer.current?.say("Terrain. Pull up.");
    }
    if (
      ["won", "lost", "completed"].includes(n.status) &&
      !["won", "lost", "completed"].includes(previous.status)
    ) {
      mixer.current?.finish();
      mixer.current?.say(
        n.status === "lost" ? "Flight ended" : "Mission accomplished",
      );
      complete.current({
        id: sessionId.current,
        date: new Date().toISOString(),
        mode: n.settings.mode,
        pace: n.settings.pace,
        outcome: n.status,
        history: n.history,
      });
    }
  }, []);
  const publishRef = useRef(publish);
  useEffect(() => {
    publishRef.current = publish;
  });
  useEffect(() => {
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      publishRef.current(tickFlight(live.current, dt));
    }, 100);
    const hide = () => {
      if (document.hidden && live.current.status === "flying") {
        publishRef.current(pauseFlight(live.current));
        mixer.current?.pause();
      }
    };
    document.addEventListener("visibilitychange", hide);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", hide);
      mixer.current?.dispose();
    };
  }, []);
  const start = useCallback(
    (reviewIds: string[] = [], mode = settings.mode) => {
      mixer.current?.dispose();
      setAudioError("");
      setCaption("");
      lastAlarm.current = -10;
      const flightSettings = {
        ...settings,
        mode,
        pace: reviewIds.length ? ("practice" as const) : settings.pace,
      };
      mixer.current = new FlightAudio(settings, setAudioError);
      mixer.current.start();
      sessionId.current = crypto.randomUUID();
      publish({ ...createFlight(flightSettings, reviewIds), status: "flying" });
    },
    [settings, publish],
  );
  const pause = useCallback(() => {
    const n = pauseFlight(live.current);
    publish(n);
    if (n.status === "paused") mixer.current?.pause();
    else if (n.status === "flying") mixer.current?.resume();
  }, [publish]);
  const leave = useCallback(() => {
    mixer.current?.dispose();
    mixer.current = null;
    publish(createFlight(settings));
    setCaption("");
  }, [settings, publish]);
  const answer = useCallback(
    (choice: string, serial: number) =>
      publish(answerFlight(live.current, choice, serial)),
    [publish],
  );
  const next = useCallback(
    () => publish(advanceFlight(live.current)),
    [publish],
  );
  return {
    state,
    caption,
    audioError,
    start,
    pause,
    leave,
    answer,
    next,
    retryAudio: () => {
      setAudioError("");
      mixer.current?.resume();
    },
  };
}
