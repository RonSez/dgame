import { useState } from "react";
import type { ModeMeta } from "../data/types";
import { useApp } from "../store/app";
import { getPromptDeck } from "../data/modes";
import { useDeck } from "../lib/deck";
import { useTurn } from "../lib/turn";
import { GameShell } from "../components/GameShell";
import { NeonButton, glowStyle } from "../components/ui";
import { buzz } from "../lib/haptics";

type Flip = null | "reveal" | "secret";

export function Paranoia({ mode }: { mode: ModeMeta }) {
  const { players, settings } = useApp();
  const deck = useDeck(getPromptDeck(mode.id));
  const turn = useTurn(players);
  const [flip, setFlip] = useState<Flip>(null);

  const doFlip = () => {
    if (settings.haptics) buzz([10, 40, 10, 40, 40]);
    setFlip(Math.random() < 0.5 ? "reveal" : "secret");
  };

  const next = () => {
    if (settings.haptics) buzz();
    deck.next();
    turn.advance();
    setFlip(null);
  };

  return (
    <GameShell mode={mode}>
      <div className="flex flex-1 flex-col px-5 pb-8">
        <div className="text-center font-mono text-xs uppercase tracking-[0.2em] text-haze">
          {turn.current ? (
            <>
              <span className="text-chalk">{turn.current}</span> — ask to your
              right
            </>
          ) : (
            "Ask the person on your right"
          )}
        </div>

        <div className="flex flex-1 items-center justify-center py-6">
          <div
            key={deck.position}
            style={glowStyle(mode.glow)}
            className="neon-ring animate-card-in flex min-h-[16rem] w-full flex-col justify-center rounded-[2rem] bg-surface/70 p-8 text-center"
          >
            <p
              className="neon-text mb-4 font-mono text-xs uppercase tracking-[0.25em]"
              style={glowStyle(mode.glow)}
            >
              🔒 Keep it quiet
            </p>
            <p className="text-2xl font-semibold leading-snug text-chalk">
              {deck.current}
            </p>

            {flip && (
              <p
                key={flip}
                className="animate-pop mt-6 border-t border-hairline pt-5 text-sm"
              >
                {flip === "reveal" ? (
                  <span
                    className="neon-text font-display text-2xl uppercase"
                    style={glowStyle("--color-neon-red")}
                  >
                    Heads — reveal it!
                    <span className="mt-1 block font-body text-sm normal-case text-chalk/80">
                      Say the question out loud. The named one drinks.
                    </span>
                  </span>
                ) : (
                  <span
                    className="neon-text font-display text-2xl uppercase"
                    style={glowStyle("--color-neon-cyan")}
                  >
                    Tails — it stays secret
                    <span className="mt-1 block font-body text-sm normal-case text-chalk/80">
                      The question dies with you. Just pass it on.
                    </span>
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {flip === null ? (
          <NeonButton className="w-full" onClick={doFlip}>
            Flip the coin
          </NeonButton>
        ) : (
          <NeonButton className="w-full" onClick={next}>
            {turn.upNext ? `Next · pass to ${turn.upNext}` : "Next question"}
          </NeonButton>
        )}
      </div>
    </GameShell>
  );
}
