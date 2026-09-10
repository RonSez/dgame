import { useMemo, useState } from "react";
import type { ModeMeta } from "../data/types";
import { useApp } from "../store/app";
import { truths, dares, truthsSpicy, daresSpicy } from "../data/truthOrDare";
import { useDeck } from "../lib/deck";
import { useTurn } from "../lib/turn";
import { useFilledCard } from "../lib/tokens";
import { GameShell } from "../components/GameShell";
import { NeonButton, glowStyle } from "../components/ui";
import { buzz } from "../lib/haptics";

const TRUTH_GLOW = "--color-neon-cyan";
const DARE_GLOW = "--color-neon-red";

export function TruthOrDare({ mode }: { mode: ModeMeta }) {
  const { players, settings } = useApp();
  // Spicy mode adds the hotter cards on top; memoize for a stable deck source.
  const truthSource = useMemo(
    () => (settings.spicy ? [...truths, ...truthsSpicy] : truths),
    [settings.spicy],
  );
  const dareSource = useMemo(
    () => (settings.spicy ? [...dares, ...daresSpicy] : dares),
    [settings.spicy],
  );
  const truthDeck = useDeck(truthSource);
  const dareDeck = useDeck(dareSource);
  const turn = useTurn(players);
  const [pick, setPick] = useState<null | "truth" | "dare">(null);

  const choose = (kind: "truth" | "dare") => {
    if (settings.haptics) buzz([10, 30, 10]);
    setPick(kind);
  };

  const nextPlayer = () => {
    if (settings.haptics) buzz();
    (pick === "truth" ? truthDeck : dareDeck).next();
    turn.advance();
    setPick(null);
  };

  const glow = pick === "dare" ? DARE_GLOW : TRUTH_GLOW;
  const raw = pick === "truth" ? truthDeck.current : dareDeck.current;
  const card = useFilledCard(raw, players, turn.current);

  return (
    <GameShell mode={mode}>
      <div className="flex flex-1 flex-col px-5 pb-8">
        <div className="text-center font-mono text-xs uppercase tracking-[0.2em] text-haze">
          {turn.current ? (
            <>
              <span className="text-chalk">{turn.current}</span>, choose your
              fate
            </>
          ) : (
            "Whoever's turn it is — choose"
          )}
        </div>

        {pick === null ? (
          <div className="flex flex-1 flex-col justify-center gap-4">
            <button
              onClick={() => choose("truth")}
              style={glowStyle(TRUTH_GLOW)}
              className="neon-ring animate-card-in flex h-40 flex-col items-center justify-center rounded-[2rem] bg-surface/70 active:scale-[0.97]"
            >
              <span
                className="neon-text font-display text-5xl uppercase"
                style={glowStyle(TRUTH_GLOW)}
              >
                Truth
              </span>
              <span className="mt-1 text-xs text-haze">Spill it</span>
            </button>
            <button
              onClick={() => choose("dare")}
              style={glowStyle(DARE_GLOW)}
              className="neon-ring animate-card-in flex h-40 flex-col items-center justify-center rounded-[2rem] bg-surface/70 active:scale-[0.97]"
            >
              <span
                className="neon-text font-display text-5xl uppercase"
                style={glowStyle(DARE_GLOW)}
              >
                Dare
              </span>
              <span className="mt-1 text-xs text-haze">Prove it</span>
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-1 items-center justify-center py-6">
              <div
                key={card}
                style={glowStyle(glow)}
                className="neon-ring animate-card-in flex min-h-[15rem] w-full flex-col justify-center rounded-[2rem] bg-surface/70 p-8 text-center"
              >
                <p
                  className="neon-text mb-4 font-display text-4xl uppercase"
                  style={glowStyle(glow)}
                >
                  {pick}
                </p>
                <p className="text-2xl font-semibold leading-snug text-chalk">
                  {card}
                </p>
              </div>
            </div>
            <NeonButton
              className="w-full"
              style={glowStyle(mode.glow)}
              onClick={nextPlayer}
            >
              {turn.upNext ? `Done · pass to ${turn.upNext}` : "Next player"}
            </NeonButton>
          </>
        )}
      </div>
    </GameShell>
  );
}
