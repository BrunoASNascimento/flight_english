import type { Settings } from "./settings.ts";

// One controller owns audio resources and gracefully degrades when audio is unavailable.
export class FlightAudio {
  private context: AudioContext | null = null;
  private engineGain: GainNode | null = null;
  private music: HTMLAudioElement[] = [];
  private active = 0;
  private overlap = false;
  private loopBusy = false;
  private settings: Settings;
  private running = false;
  private duckUntil = 0;
  private fade = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private disposed = false;
  private generation = 0;
  private onError: (message: string) => void;

  constructor(settings: Settings, onError: (message: string) => void) {
    this.settings = settings;
    this.onError = onError;
  }
  update(settings: Settings) {
    this.settings = settings;
    if (this.engineGain && this.context)
      this.engineGain.gain.setTargetAtTime(
        this.running && !settings.muted ? settings.engine * 0.035 : 0,
        this.context.currentTime,
        0.08,
      );
    if (settings.muted) window.speechSynthesis?.cancel();
  }
  start() {
    if (this.disposed) return;
    this.running = true;
    this.fade = 0;
    if (!this.music.length) {
      this.music = [
        new Audio("/audio/cleared-for-takeoff.mp3"),
        new Audio("/audio/cleared-for-takeoff.mp3"),
      ];
      for (const track of this.music) {
        track.preload = "none";
        track.volume = 0;
        track.addEventListener("error", () =>
          this.onError("Music is unavailable. Your flight can continue."),
        );
        track.addEventListener("ended", () => {
          if (
            this.running &&
            track === this.music[this.active] &&
            !this.overlap
          ) {
            track.currentTime = 0;
            void track
              .play()
              .catch(() =>
                this.onError(
                  "Music playback was blocked. Use Enable audio to retry.",
                ),
              );
          }
        });
      }
    }
    // Both audio systems are activated in the player's click handler.
    void this.music[this.active]
      .play()
      .catch(() =>
        this.onError("Music playback was blocked. Use Enable audio to retry."),
      );
    try {
      if (!this.context) {
        this.context = new AudioContext();
        this.engineGain = this.context.createGain();
        this.engineGain.gain.value = 0;
        this.engineGain.connect(this.context.destination);
        for (const hz of [63, 65, 126]) {
          const osc = this.context.createOscillator();
          osc.type = "sawtooth";
          osc.frequency.value = hz;
          osc.connect(this.engineGain);
          osc.start();
        }
      }
      void this.context
        .resume()
        .catch(() =>
          this.onError(
            "Engine audio is unavailable. Your flight can continue.",
          ),
        );
    } catch {
      this.onError("Engine audio is unavailable. Your flight can continue.");
    }
    if (this.overlap) void this.music[1 - this.active].play().catch(() => {});
    this.update(this.settings);
    if (!this.timer) this.timer = setInterval(() => this.mix(), 100);
  }
  pause() {
    this.running = false;
    this.generation++;
    for (const track of this.music) track.pause();
    window.speechSynthesis?.cancel();
    if (this.context?.state === "running")
      void this.context.suspend().catch(() => {});
  }
  resume() {
    this.start();
  }
  finish() {
    this.running = false;
    this.generation++;
    if (this.engineGain && this.context)
      this.engineGain.gain.setTargetAtTime(0, this.context.currentTime, 0.1);
    // mix() completes the music fade, then stops playback.
  }
  say(message: string) {
    this.duckUntil = performance.now() + 2500;
    if (
      this.settings.muted ||
      !this.settings.voice ||
      !("speechSynthesis" in window)
    )
      return;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = "en-GB";
    speech.rate = 1.02;
    speech.pitch = 0.8;
    speech.volume = this.settings.voice;
    window.speechSynthesis.speak(speech);
  }
  alarm(incorrect = false) {
    const ctx = this.context;
    this.duckUntil = performance.now() + 1200;
    if (
      !ctx ||
      ctx.state !== "running" ||
      this.settings.muted ||
      !this.settings.alarms
    )
      return;
    const volume = ctx.createGain();
    volume.connect(ctx.destination);
    const osc = ctx.createOscillator();
    osc.type = incorrect ? "square" : "sine";
    osc.connect(volume);
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(850, now);
    osc.frequency.setValueAtTime(650, now + 0.18);
    volume.gain.setValueAtTime(0.0001, now);
    volume.gain.linearRampToValueAtTime(
      this.settings.alarms * 0.075,
      now + 0.01,
    );
    volume.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    osc.start();
    osc.stop(now + 0.55);
    osc.onended = () => {
      osc.disconnect();
      volume.disconnect();
    };
  }
  private mix() {
    const track = this.music[this.active];
    if (!track) return;
    this.fade = Math.max(
      0,
      Math.min(1, this.fade + (this.running ? 0.1 : -0.1)),
    );
    const base = this.settings.muted
      ? 0
      : this.settings.music *
        this.fade *
        (performance.now() < this.duckUntil ? 0.25 : 1);
    const remaining = track.duration - track.currentTime;
    if (
      this.running &&
      !this.overlap &&
      !this.loopBusy &&
      Number.isFinite(remaining) &&
      remaining < 1.8 &&
      remaining > 0 &&
      !track.paused
    ) {
      const next = this.music[1 - this.active];
      next.currentTime = 0;
      next.volume = 0;
      const token = this.generation;
      this.loopBusy = true;
      void next
        .play()
        .then(() => {
          this.loopBusy = false;
          if (this.disposed || !this.running || token !== this.generation) {
            next.pause();
            return;
          }
          this.overlap = true;
        })
        .catch(() => {
          this.loopBusy = false;
        });
    }
    if (this.overlap) {
      const ratio = Math.max(0, Math.min(1, remaining / 1.8));
      track.volume = base * ratio;
      this.music[1 - this.active].volume = base * (1 - ratio);
      if (remaining <= 0.12 || track.ended) {
        track.pause();
        track.currentTime = 0;
        this.active = 1 - this.active;
        this.overlap = false;
      }
    } else {
      track.volume = base;
      this.music[1 - this.active].volume = 0;
    }
    if (!this.running && this.fade === 0) {
      for (const music of this.music) music.pause();
      if (this.context?.state === "running")
        void this.context.suspend().catch(() => {});
    }
  }
  dispose() {
    this.disposed = true;
    this.pause();
    if (this.timer) clearInterval(this.timer);
    for (const track of this.music) {
      track.removeAttribute("src");
      track.load();
    }
    this.music = [];
    if (this.context && this.context.state !== "closed")
      void this.context.close().catch(() => {});
    this.context = null;
  }
}
