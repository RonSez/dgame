import { useEffect, useMemo, useState } from "react";
import type { ModeMeta } from "../data/types";
import { useApp } from "../store/app";
import { hotPotatoCategories, hotPotatoCategoriesSpicy } from "../data/hotPotato";
import { useDeck } from "../lib/deck";
import { GameShell } from "../components/GameShell";
import { NeonButton, glowStyle } from "../components/ui";
import { buzz } from "../lib/haptics";

type Difficulty = "chill" | "normal" | "chaos";
type Phase = "setup" | "running" | "busted";

/** Fuse ranges in seconds, hidden from players. Random within the band. */
const BANDS: Record<Difficulty, [number, number]> = {
  chill: [20, 45],
  normal: [12, 30],
  chaos: [6, 18],
};

const HEAT: { id: Difficulty; label: string; emoji: string; blurb: string }[] = [
  { id: "chill", label: "Chill", emoji: "🧊", blurb: "Long fuse, easy breaths" },
  { id: "normal", label: "Normal", emoji: "🔥", blurb: "Pass it, don't think" },
  { id: "chaos", label: "Chaos", emoji: "💀", blurb: "Could blow any second" },
];

export function HotPotato({ mode }: { mode: ModeMeta }) {
  const { settings } = useApp();

  // Spicy mode adds the racier categories on top; memoize for a stable source.
  const source = useMemo(
    () =>
      settings.spicy
        ? [...hotPotatoCategories, ...hotPotatoCategoriesSpicy]
        : hotPotatoCategories,
    [settings.spicy],
  );
  const deck = useDeck(source);

  const [phase, setPhase] = useState<Phase>("setup");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [round, setRound] = useState(0);
  const [fuseMs, setFuseMs] = useState(0);

  // Arm a fresh round: new category, new hidden fuse, start the clock.
  const arm = (d: Difficulty) => {
    if (settings.haptics) buzz(12);
    setDifficulty(d);
    deck.next();
    const [min, max] = BANDS[d];
    setFuseMs((min + Math.random() * (max - min)) * 1000);
    setRound((r) => r + 1);
    setPhase("running");
  };

  // The fuse. Re-arms whenever a new round starts; always cleaned up so an old
  // timer can never fire into a new round (or after leaving the screen).
  useEffect(() => {
    if (phase !== "running") return;
    const id = setTimeout(() => {
      if (settings.haptics) buzz([400, 120, 400, 120, 600]);
      setPhase("busted");
    }, fuseMs);
    return () => clearTimeout(id);
  }, [phase, round, fuseMs, settings.haptics]);

  // ── Time's up ────────────────────────────────────────────────────────────
  if (phase === "busted") {
    return (
      <GameShell mode={mode}>
        <div
          style={glowStyle(mode.glow)}
          className="flex flex-1 flex-col items-center justify-center px-6 pb-10 text-center"
        >
          <div
            key={round}
            style={glowStyle(mode.glow)}
            className="neon-ring neon-fill animate-card-in flex w-full flex-col items-center rounded-[2rem] p-10"
          >
            <span className="text-6xl">💥</span>
            <h2
              className="neon-text mt-4 font-display text-6xl uppercase leading-[0.85]"
              style={glowStyle(mode.glow)}
            >
              Time's
              <br />
              up
            </h2>
            <p className="mt-5 text-lg font-semibold text-chalk">
              Holding it? Drink. 🍻
            </p>
          </div>
          <NeonButton className="mt-8 w-full" onClick={() => arm(difficulty)}>
            Next round
          </NeonButton>
          <button
            onClick={() => setPhase("setup")}
            className="mt-3 font-mono text-xs uppercase tracking-[0.25em] text-haze active:scale-95"
          >
            Change heat
          </button>
        </div>
      </GameShell>
    );
  }

  // ── Setup — pick the heat ──────────────────────────────────────────────────
  if (phase === "setup") {
    return (
      <GameShell mode={mode}>
        <div className="flex flex-1 flex-col px-5 pb-8">
          <div className="text-center font-mono text-xs uppercase tracking-[0.25em] text-haze">
            Pick your heat
          </div>
          <div className="flex flex-1 flex-col justify-center gap-3 py-6">
            {HEAT.map((h) => (
              <button
                key={h.id}
                onClick={() => arm(h.id)}
                style={glowStyle(mode.glow)}
                className="neon-ring flex items-center gap-4 rounded-3xl bg-surface/70 p-5 text-left transition active:scale-[0.97]"
              >
                <span className="text-4xl">{h.emoji}</span>
                <span>
                  <span className="block font-display text-2xl uppercase leading-none text-chalk">
                    {h.label}
                  </span>
                  <span className="mt-1 block text-xs text-haze">{h.blurb}</span>
                </span>
              </button>
            ))}
          </div>
          <p className="text-center text-xs leading-snug text-haze/70">
            The fuse is random and hidden. Say something that fits, then pass fast.
          </p>
        </div>
      </GameShell>
    );
  }

  // ── Running — the category is live, keep passing ───────────────────────────
  return (
    <GameShell mode={mode}>
      <div className="flex flex-1 flex-col px-5 pb-8">
        <div className="text-center font-mono text-xs uppercase tracking-[0.25em] text-haze">
          Category
        </div>

        <div className="flex flex-1 items-center justify-center py-6">
          <div
            key={round}
            style={glowStyle(mode.glow)}
            className="neon-ring animate-card-in flex min-h-[15rem] w-full flex-col justify-center rounded-[2rem] bg-surface/70 p-8 text-center"
          >
            <p
              className="neon-text mb-4 font-mono text-xs uppercase tracking-[0.25em]"
              style={glowStyle(mode.glow)}
            >
              Name one…
            </p>
            <p className="text-3xl font-semibold leading-snug text-chalk">
              {deck.current}
            </p>
          </div>
        </div>

        <p className="animate-pulse text-center font-display text-3xl uppercase tracking-wide text-chalk">
          Pass the phone!
        </p>
        <p className="mt-2 text-center text-xs text-haze">
          Don't be caught holding it when it buzzes.
        </p>
      </div>
    </GameShell>
  );
}
