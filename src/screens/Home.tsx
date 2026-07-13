import { useApp } from "../store/app";
import { MODES } from "../data/modes";
import { glowStyle } from "../components/ui";
import { buzz } from "../lib/haptics";

export function Home() {
  const { navigate, players, settings } = useApp();

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-10">
      {/* Hero — the marquee */}
      <header className="pt-10 pb-8 text-center">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.5em] text-haze">
          Open bar · pass the phone
        </p>
        <h1
          className="neon-text mt-3 font-display text-7xl leading-[0.85] tracking-tight"
          style={glowStyle("--color-neon-pink")}
        >
          LAST
          <br />
          CALL
        </h1>
        <p className="mt-4 text-sm text-haze">
          Six games. One phone. No sober decisions.
        </p>
      </header>

      {/* Mode grid — each game glows in its own neon */}
      <div className="grid grid-cols-2 gap-3">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => {
              if (settings.haptics) buzz();
              navigate({ name: "game", modeId: mode.id });
            }}
            style={glowStyle(mode.glow)}
            className="neon-ring group relative flex aspect-[4/5] flex-col justify-between rounded-3xl bg-surface/70 p-4 text-left transition active:scale-[0.97]"
          >
            <span className="text-3xl">{mode.emoji}</span>
            <span>
              <span
                className="neon-text block font-display text-2xl leading-[0.9] uppercase"
                style={glowStyle(mode.glow)}
              >
                {mode.title.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
              <span className="mt-2 block text-xs leading-snug text-haze">
                {mode.tagline}
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* Footer nav */}
      <nav className="mt-6 grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate({ name: "players" })}
          className="flex items-center justify-center gap-2 rounded-2xl border border-hairline py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-haze active:scale-[0.97]"
        >
          <span aria-hidden>🎟️</span>
          {players.length ? `${players.length} players` : "Add players"}
        </button>
        <button
          onClick={() => navigate({ name: "settings" })}
          className="flex items-center justify-center gap-2 rounded-2xl border border-hairline py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-haze active:scale-[0.97]"
        >
          <span aria-hidden>⚙️</span>
          Settings
        </button>
      </nav>

      <p className="mt-8 text-center text-xs text-haze/60">
        Please drink responsibly. Know your limits.
      </p>
    </div>
  );
}
