import type { ModeMeta } from "../data/types";
import { useApp } from "../store/app";
import { getPromptDeck } from "../data/modes";
import { useDeck } from "../lib/deck";
import { useTurn } from "../lib/turn";
import { GameShell } from "../components/GameShell";
import { NeonButton, glowStyle } from "../components/ui";
import { buzz } from "../lib/haptics";

export function PromptGame({ mode }: { mode: ModeMeta }) {
  const { players, settings } = useApp();
  const deck = useDeck(getPromptDeck(mode.id));
  const turn = useTurn(players);

  const onNext = () => {
    if (settings.haptics) buzz();
    deck.next();
    turn.advance();
  };

  return (
    <GameShell mode={mode}>
      <div className="flex flex-1 flex-col px-5 pb-8">
        {/* Turn indicator */}
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-haze">
          <span>
            {turn.current ? (
              <>
                <span className="text-chalk">{turn.current}</span>'s card
              </>
            ) : (
              "Read it aloud"
            )}
          </span>
          <span>
            {deck.position} / {deck.total}
          </span>
        </div>

        {/* The prompt card — the glowing centerpiece */}
        <div className="flex flex-1 items-center justify-center py-6">
          <div
            key={deck.position}
            style={glowStyle(mode.glow)}
            className="neon-ring animate-card-in flex min-h-[15rem] w-full flex-col justify-center rounded-[2rem] bg-surface/70 p-8 text-center"
          >
            {mode.prefix && (
              <p
                className="neon-text mb-4 font-mono text-xs uppercase tracking-[0.25em]"
                style={glowStyle(mode.glow)}
              >
                {mode.prefix}
              </p>
            )}
            <p className="text-2xl font-semibold leading-snug text-chalk">
              {deck.current}
            </p>
          </div>
        </div>

        {/* Action */}
        <NeonButton className="w-full" onClick={onNext}>
          {turn.upNext ? `Next · pass to ${turn.upNext}` : "Next card"}
        </NeonButton>
      </div>
    </GameShell>
  );
}
