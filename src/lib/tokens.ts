import { useMemo } from "react";
import { shuffle } from "./deck";

/** Placeholder in card text, swapped for a random other player when drawn. */
const TOKEN = "{player}";
const TOKEN_RE = /\{player\}/g;
/** Used when there's no roster (or the roster is just the current player). */
const FALLBACK = "someone in this room";

/**
 * Replaces every {player} in a card with a random player who isn't the one
 * holding the phone. Repeated tokens get different names where the roster
 * allows, so "would you rather {player} or {player}" never names one twice.
 */
export function fillTokens(
  text: string,
  players: readonly string[],
  current?: string | null,
): string {
  if (!text.includes(TOKEN)) return text;
  const pool = shuffle(players.filter((p) => p !== current));
  if (pool.length === 0) return text.replace(TOKEN_RE, FALLBACK);
  let i = 0;
  return text.replace(TOKEN_RE, () => pool[i++ % pool.length]);
}

/**
 * Card text with its {player} tokens filled in. Stable across re-renders —
 * the names only reroll when the card or the current player changes.
 */
export function useFilledCard(
  text: string,
  players: readonly string[],
  current?: string | null,
): string {
  return useMemo(
    () => fillTokens(text, players, current),
    [text, players, current],
  );
}
