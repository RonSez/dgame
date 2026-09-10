import { useMemo, useState } from "react";
import type { ModeMeta } from "../data/types";
import { useApp } from "../store/app";
import { getWyrDeck } from "../data/modes";
import { useDeck } from "../lib/deck";
import { useTurn } from "../lib/turn";
import { fillTokens } from "../lib/tokens";
import { GameShell } from "../components/GameShell";
import { NeonButton, glowStyle } from "../components/ui";
import { buzz } from "../lib/haptics";

/** pick = choose in secret · guess = the room calls it · reveal = who drinks. */
type Phase = "pick" | "guess" | "reveal";
type Side = "a" | "b";

/** Splits the two sides apart again after filling tokens (see below). */
const JOIN = "\n";

export function WouldYouRather({ mode }: { mode: ModeMeta }) {
  const { players, settings } = useApp();
  // Memoize so the no-repeat deck keeps a stable source across renders.
  const source = useMemo(() => getWyrDeck(settings.spicy), [settings.spicy]);
  const deck = useDeck(source);
  const turn = useTurn(players);

  const [phase, setPhase] = useState<Phase>("pick");
  const [choice, setChoice] = useState<Side | null>(null);

  const card = deck.current;
  // Both sides are filled in one pass so a card with two {player} tokens names
  // two different people rather than rerolling the same pool twice.
  const [optionA, optionB] = useMemo(() => {
    const filled = fillTokens(
      `${card.a}${JOIN}${card.b}`,
      players,
      turn.current,
    );
    return filled.split(JOIN);
  }, [card, players, turn.current]);

  const pick = (side: Side) => {
    if (settings.haptics) buzz([10, 30, 10]);
    setChoice(side);
    setPhase("guess");
  };

  const reveal = () => {
    if (settings.haptics) buzz([20, 40, 20]);
    setPhase("reveal");
  };

  const nextCard = () => {
    if (settings.haptics) buzz();
    deck.next();
    turn.advance();
    setChoice(null);
    setPhase("pick");
  };

  const holder = turn.current;

  const header =
    phase === "pick" ? (
      holder ? (
        <>
          <span className="text-chalk">{holder}</span>, pick one — don't say it
        </>
      ) : (
        "Pick one — keep it to yourself"
      )
    ) : phase === "guess" ? (
      "Everyone guess out loud"
    ) : holder ? (
      <>
        <span className="text-chalk">{holder}</span> went with…
      </>
    ) : (
      "The answer is…"
    );

  /** One side of the dilemma. Tappable while picking, a result card after. */
  const Option = ({ side, text }: { side: Side; text: string }) => {
    const chosen = choice === side;
    const revealed = phase === "reveal";
    const lit = phase === "pick" || (revealed && chosen);
    return (
      <button
        onClick={phase === "pick" ? () => pick(side) : undefined}
        disabled={phase !== "pick"}
        style={lit ? glowStyle(mode.glow) : undefined}
        className={[
          "animate-card-in flex flex-1 flex-col items-center justify-center gap-3 rounded-[2rem] p-6 text-center transition",
          lit ? "neon-ring bg-surface/70" : "border border-hairline bg-surface/40",
          revealed && !chosen ? "opacity-40" : "",
          phase === "pick" ? "active:scale-[0.97]" : "",
        ].join(" ")}
      >
        <span
          className={`font-mono text-xs uppercase tracking-[0.3em] ${
            revealed && chosen ? "neon-text" : "text-haze"
          }`}
          style={revealed && chosen ? glowStyle(mode.glow) : undefined}
        >
          {revealed && chosen ? "Their pick" : side === "a" ? "A" : "B"}
        </span>
        <span className="text-2xl font-semibold leading-snug text-chalk">
          {text}
        </span>
      </button>
    );
  };

  return (
    <GameShell mode={mode}>
      <div className="flex flex-1 flex-col px-5 pb-8">
        {/* Turn / phase indicator */}
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-haze">
          <span>{header}</span>
          <span>
            {deck.position} / {deck.total}
          </span>
        </div>

        {mode.prefix && (
          <p
            className="neon-text mt-4 text-center font-mono text-xs uppercase tracking-[0.25em]"
            style={glowStyle(mode.glow)}
          >
            {mode.prefix}
          </p>
        )}

        {/* The two sides */}
        <div key={deck.position} className="flex flex-1 flex-col gap-3 py-4">
          <Option side="a" text={optionA} />
          <span className="text-center font-mono text-xs uppercase tracking-[0.3em] text-haze">
            or
          </span>
          <Option side="b" text={optionB} />
        </div>

        {/* Action */}
        {phase === "pick" ? (
          <p className="pb-2 text-center text-xs leading-relaxed text-haze">
            Tap your answer. The phone keeps it secret until the room has
            guessed.
          </p>
        ) : phase === "guess" ? (
          <NeonButton className="w-full" onClick={reveal}>
            Everyone guessed · reveal
          </NeonButton>
        ) : (
          <>
            <p className="pb-3 text-center text-sm text-chalk">
              Everyone who guessed wrong drinks.
            </p>
            <NeonButton className="w-full" onClick={nextCard}>
              {turn.upNext ? `Next · pass to ${turn.upNext}` : "Next card"}
            </NeonButton>
          </>
        )}
      </div>
    </GameShell>
  );
}
