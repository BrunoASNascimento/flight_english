import type { Settings } from "@/game/settings";

export default function SettingsPanel({
  settings,
  onChange,
}: {
  settings: Settings;
  onChange: (next: Settings) => void;
}) {
  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    onChange({ ...settings, [key]: value });
  }
  return (
    <details className="settings-panel">
      <summary>Sound & display settings</summary>
      <div className="settings-grid">
        {(["music", "engine", "alarms", "voice"] as const).map((key) => (
          <label key={key} className="volume-setting">
            <span>
              {key === "music"
                ? "Soundtrack"
                : key === "voice"
                  ? "Voice callouts"
                  : key[0].toUpperCase() + key.slice(1)}{" "}
              <small>{Math.round(settings[key] * 100)}%</small>
            </span>
            <input
              aria-label={`${key} volume`}
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings[key]}
              onChange={(e) => update(key, Number(e.target.value))}
            />
          </label>
        ))}
        <label>
          Graphics
          <select
            value={settings.graphics}
            onChange={(e) =>
              update("graphics", e.target.value as Settings["graphics"])
            }
          >
            <option value="low">Low · simple scenery</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label className="check-setting">
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(e) => update("reducedMotion", e.target.checked)}
          />
          Reduce scene motion
        </label>
        <label className="check-setting">
          <input
            type="checkbox"
            checked={settings.muted}
            onChange={(e) => update("muted", e.target.checked)}
          />
          Mute all audio
        </label>
      </div>
    </details>
  );
}
