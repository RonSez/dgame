import { useMemo, useState } from "react";
import type { ModeMeta } from "../data/types";
import { useApp } from "../store/app";
import { contactMoves, contactMovesSpicy } from "../data/contact";
import { useDeck } from "../lib/deck";
import { GameShell } from "../components/GameShell";
import { NeonButton, glowStyle } from "../components/ui";
import { buzz } from "../lib/haptics";

/** Pick two distinct players, or null if there aren't enough. */
function pickPair(players: string[]): [string, string] | null {
  if (players.length < 2) return null;
  const a = Math.floor(Math.random() * players.length);
  let b = Math.floor(Math.random() * (players.length - 1));
  if (b >= a) b += 1; // skip a, so b !== a
  return [players[a], players[b]];
}

/** Fill {a}/{b} placeholders with the chosen players (shouted in caps). */
function fill(text: string, pair: [string, string] | null): string {
  if (!pair) return text;
  return text
    .replace(/\{a\}/g, pair[0].toUpperCase())
    .replace(/\{b\}/g, pair[1].toUpperCase());
}

export function Contact({ mode }: { mode: ModeMeta }) {
  const { players, settings, navigate } = useApp();

  // Spicy mode adds the hotter moves on top; memoize for a stable deck source.
  const source = useMemo(
    () => (settings.spicy ? [...contactMoves, ...contactMovesSpicy] : contactMoves),
    [settings.spicy],
  );
  const deck = useDeck(source);

  const [round, setRound] = useState(1);
  const [pair, setPair] = useState<[string, string] | null>(() =>
    pickPair(players),
  );
  const [holding, setHolding] = useState<string[]>([]);

  const command = fill(deck.current.text, pair);

  const held = () => {
    if (settings.haptics) buzz([10, 30, 10]);
    setHolding((h) => [...h, command].slice(-3));
    deck.next();
    setPair(pickPair(players));
    setRound((r) => r + 1);
  };

  const broke = () => {
    if (settings.haptics) buzz([40]);
    setHolding([]);
    deck.next();
    setPair(pickPair(players));
    setRound(1);
  };

  // Contact only works with real people — gate when the roster is too small.
  if (players.length < 2) {
    return (
      <GameShell mode={mode}>
        <div className="flex flex-1 flex-col items-center justify-center px-8 pb-10 text-center">
          <span className="text-5xl">🫦</span>
          <p className="mt-5 text-lg font-semibold text-chalk">
            Contact needs a crowd.
          </p>
          <p className="mt-2 text-sm text-haze">
            Add at least 2 players to start touching.
          </p>
          <NeonButton
            className="mt-8"
            style={glowStyle(mode.glow)}
            onClick={() => navigate({ name: "players" })}
          >
            Add players
          </NeonButton>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell mode={mode}>
      <div className="flex flex-1 flex-col px-5 pb-8">
        {/* Round indicator */}
        <div className="text-center font-mono text-xs uppercase tracking-[0.25em] text-haze">
          Round <span className="text-chalk">{round}</span>
        </div>

        {/* The contact command — the glowing centerpiece */}
        <div className="flex flex-1 items-center justify-center py-6">
          <div
            key={round + command}
            style={glowStyle(mode.glow)}
            className="neon-ring animate-card-in flex min-h-[15rem] w-full flex-col justify-center rounded-[2rem] bg-surface/70 p-8 text-center"
          >
            <p
              className="neon-text mb-4 font-mono text-xs uppercase tracking-[0.25em]"
              style={glowStyle(mode.glow)}
            >
              Touch &amp; hold
            </p>
            <p className="text-2xl font-semibold leading-snug text-chalk">
              {command}
            </p>
          </div>
        </div>

        {/* Everything still in play */}
        {holding.length > 0 && (
          <div className="mb-4 rounded-2xl border border-hairline bg-surface/30 px-4 py-3">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-haze">
              Still holding
            </p>
            <ul className="mt-1 space-y-0.5">
              {holding.map((h, i) => (
                <li key={i} className="text-xs leading-snug text-chalk/80">
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <NeonButton className="w-full" onClick={held}>
            Held it · next
          </NeonButton>
          <NeonButton variant="ghost" className="w-full" onClick={broke}>
            Broke — drink
          </NeonButton>
        </div>
      </div>
    </GameShell>
  );
}
