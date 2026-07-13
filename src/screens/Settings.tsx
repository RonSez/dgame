import { useApp } from "../store/app";
import type { Settings as SettingsType } from "../store/app";
import { TopBar, glowStyle } from "../components/ui";

function Toggle({
  label,
  hint,
  value,
  onChange,
  glow = "--color-neon-cyan",
}: {
  label: string;
  hint: string;
  value: boolean;
  onChange: (v: boolean) => void;
  glow?: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-hairline bg-surface/50 px-4 py-4 text-left active:scale-[0.99]"
    >
      <span>
        <span className="block text-chalk">{label}</span>
        <span className="mt-0.5 block text-xs text-haze">{hint}</span>
      </span>
      <span
        style={value ? glowStyle(glow) : undefined}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          value ? "neon-fill neon-ring" : "bg-hairline"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-chalk transition-all ${
            value ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

export function Settings() {
  const { settings, setSetting, navigate, players } = useApp();

  const set =
    <K extends keyof SettingsType>(key: K) =>
    (v: SettingsType[K]) =>
      setSetting(key, v);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
      <TopBar title="Settings" />

      <div className="flex flex-1 flex-col gap-3 px-5 pb-10">
        <h1
          className="neon-text mb-2 font-display text-5xl uppercase"
          style={glowStyle("--color-neon-violet")}
        >
          Settings
        </h1>

        <Toggle
          label="Buzz on tap"
          hint="Haptic feedback where your phone supports it."
          value={settings.haptics}
          onChange={set("haptics")}
        />
        <Toggle
          label="Neon atmosphere"
          hint="Scanlines and ambient glow. Turn off for a calmer, higher-contrast look."
          value={settings.effects}
          onChange={set("effects")}
        />
        <Toggle
          label="Spicy mode"
          hint="Adds hotter questions & dares to every game. 18+."
          value={settings.spicy}
          onChange={set("spicy")}
          glow="--color-neon-red"
        />

        <button
          onClick={() => navigate({ name: "players" })}
          className="mt-2 flex items-center justify-between rounded-2xl border border-hairline bg-surface/50 px-4 py-4 text-left active:scale-[0.99]"
        >
          <span>
            <span className="block text-chalk">Manage players</span>
            <span className="mt-0.5 block text-xs text-haze">
              {players.length
                ? `${players.length} in the rotation`
                : "None added yet"}
            </span>
          </span>
          <span className="text-haze">›</span>
        </button>

        <div className="mt-4 rounded-2xl border border-hairline bg-surface/30 px-4 py-4">
          <p className="text-sm text-chalk">Install it on your phone</p>
          <p className="mt-1 text-xs leading-relaxed text-haze">
            Use your browser's <em>Share → Add to Home Screen</em> (iPhone) or{" "}
            <em>Install app</em> (Android). It then runs full-screen and works
            with no signal.
          </p>
        </div>

        <p className="mt-auto pt-8 text-center text-xs leading-relaxed text-haze/60">
          Last Call is for adults having fun responsibly. Never pressure anyone
          to drink, and always know your limits.
        </p>
      </div>
    </div>
  );
}
