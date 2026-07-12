import { useCallback, useState } from "react";

/** Fisher–Yates shuffle, returns a new array. */
export function shuffle<T>(input: readonly T[]): T[] {
  const arr = input.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface DeckState<T> {
  /** The current card. */
  current: T;
  /** 1-based position in the current shuffle. */
  position: number;
  /** Total cards in the deck. */
  total: number;
  /** Advance to the next card. Reshuffles when the deck runs out. */
  next: () => void;
}

/**
 * Draws through a deck with no repeats until it's exhausted, then reshuffles
 * (guaranteeing the last card of one pass never repeats as the first of the next).
 */
export function useDeck<T>(source: readonly T[]): DeckState<T> {
  const [order, setOrder] = useState<T[]>(() => shuffle(source));
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => {
      if (i + 1 < order.length) return i + 1;
      // Exhausted — reshuffle, avoiding an immediate repeat of the last card.
      let reshuffled = shuffle(source);
      if (reshuffled.length > 1 && reshuffled[0] === order[order.length - 1]) {
        reshuffled = [...reshuffled.slice(1), reshuffled[0]];
      }
      setOrder(reshuffled);
      return 0;
    });
  }, [order, source]);

  return {
    current: order[index],
    position: index + 1,
    total: order.length,
    next,
  };
}
