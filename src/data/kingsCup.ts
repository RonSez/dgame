import type { KingRule } from "./types";

// Classic Kings Cup rule set, keyed by rank. Draw a card → do the rule.
export const kingRules: Record<string, KingRule> = {
  A: {
    rank: "A",
    label: "Waterfall",
    rule: "Everyone starts drinking at once. You can't stop until the person before you stops.",
  },
  "2": {
    rank: "2",
    label: "You",
    rule: "Point at someone. They take a drink.",
  },
  "3": {
    rank: "3",
    label: "Me",
    rule: "Bad luck — you drink.",
  },
  "4": {
    rank: "4",
    label: "Floor",
    rule: "Everyone races to touch the floor. Last one down drinks.",
  },
  "5": {
    rank: "5",
    label: "Thumb Master",
    rule: "Any time before your next turn, put your thumb on the table. Last to copy drinks. You hold this power until the next 5.",
  },
  "6": {
    rank: "6",
    label: "Categories",
    rule: "Pick a category (drink brands, cities…). Go around naming one each. First to blank or repeat drinks.",
  },
  "7": {
    rank: "7",
    label: "Heaven",
    rule: "Throw a hand in the air. Last person to raise theirs drinks.",
  },
  "8": {
    rank: "8",
    label: "Mate",
    rule: "Choose a drinking buddy. From now on, whenever you drink, they drink too.",
  },
  "9": {
    rank: "9",
    label: "Rhyme",
    rule: "Say a word. Go around rhyming with it. First to fail or repeat drinks.",
  },
  "10": {
    rank: "10",
    label: "Never Have I Ever",
    rule: "Everyone holds up 3 fingers. Say something you've never done — anyone who has drops a finger and drinks. First to drop all three… you know the deal.",
  },
  J: {
    rank: "J",
    label: "Make a Rule",
    rule: "Invent a rule everyone must follow for the rest of the game. Break it and you drink.",
  },
  Q: {
    rank: "Q",
    label: "Question Master",
    rule: "Until the next Queen, anyone who answers one of your questions drinks.",
  },
  K: {
    rank: "K",
    label: "King's Cup",
    rule: "Pour some of your drink into the center cup. Whoever draws the 4th King downs the whole thing.",
  },
};

export const RANKS = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
] as const;

export const SUITS = [
  { symbol: "♠", name: "spades", red: false },
  { symbol: "♥", name: "hearts", red: true },
  { symbol: "♦", name: "diamonds", red: true },
  { symbol: "♣", name: "clubs", red: false },
] as const;

export interface Card {
  rank: string;
  suit: (typeof SUITS)[number];
}

/** A full 52-card deck. */
export function buildDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}
