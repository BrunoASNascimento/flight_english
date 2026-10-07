"use client";
import { useState, useSyncExternalStore } from "react";
import {
  STORAGE_KEY,
  mergeSession,
  parseProgress,
  type Progress,
  type Session,
} from "@/game/storage";
import type { Settings } from "@/game/settings";

type Snapshot = { progress: Progress; ready: boolean; storageError: boolean };
const serverSnapshot: Snapshot = {
  progress: parseProgress(null),
  ready: false,
  storageError: false,
};
function createStore() {
  let snapshot = serverSnapshot;
  let loaded = false;
  const listeners = new Set<() => void>();
  function emit() {
    for (const listener of listeners) listener();
  }
  function save(progress: Progress) {
    let storageError = false;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      storageError = true;
    }
    snapshot = { progress, ready: true, storageError };
    emit();
  }
  return {
    subscribe(listener: () => void) {
      if (!loaded) {
        loaded = true;
        let progress = parseProgress(null);
        let storageError = false;
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          progress = saved ? parseProgress(JSON.parse(saved)) : progress;
          if (!saved)
            progress.settings.reducedMotion = window.matchMedia(
              "(prefers-reduced-motion: reduce)",
            ).matches;
        } catch {
          storageError = true;
        }
        snapshot = { progress, ready: true, storageError };
      }
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => snapshot,
    setSettings: (settings: Settings) =>
      save({ ...snapshot.progress, settings }),
    record: (session: Session) =>
      save(mergeSession(snapshot.progress, session)),
  };
}
export function useProgress() {
  const [store] = useState(createStore);
  const snapshot = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    () => serverSnapshot,
  );
  return { ...snapshot, setSettings: store.setSettings, record: store.record };
}
