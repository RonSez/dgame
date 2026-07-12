import { useCallback, useState } from "react";

interface TurnState {
  /** Whose turn it is right now (null if no roster). */
  current: string | null;
  /** Who to pass to next (null if no roster). */
  upNext: string | null;
  /** Advance the rotation. */
  advance: () => void;
}

/** Rotates through the player roster for "pass the phone" prompts. */
export function useTurn(players: string[]): TurnState {
  const [i, setI] = useState(0);
  const advance = useCallback(() => {
    setI((prev) => (players.length ? (prev + 1) % players.length : 0));
  }, [players.length]);

  if (players.length === 0) {
    return { current: null, upNext: null, advance };
  }
  const idx = i % players.length;
  return {
    current: players[idx],
    upNext: players[(idx + 1) % players.length],
    advance,
  };
}
