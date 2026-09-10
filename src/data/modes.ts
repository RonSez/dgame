import type { ModeId, ModeMeta, WyrCard } from "./types";
import { neverHaveIEver, neverHaveIEverSpicy } from "./neverHaveIEver";
import { mostLikelyTo, mostLikelyToSpicy } from "./mostLikelyTo";
import { paranoia, paranoiaSpicy } from "./paranoia";
import { wouldYouRather, wouldYouRatherSpicy } from "./wouldYouRather";

export const MODES: ModeMeta[] = [
  {
    id: "nhie",
    kind: "prompt",
    title: ["Never", "Have I", "Ever"],
    tagline: "Everyone who's done it drinks.",
    howTo: "Read the card aloud. Anyone who HAS done it takes a drink. Then pass the phone on.",
    emoji: "🙈",
    glow: "--color-neon-cyan",
    prefix: "Never have I ever…",
  },
  {
    id: "mlt",
    kind: "prompt",
    title: ["Most", "Likely", "To"],
    tagline: "Point at once. Most votes drinks.",
    howTo: "Read the card. On the count of three, everyone points at the guilty one. Whoever gets the most votes drinks.",
    emoji: "👉",
    glow: "--color-neon-pink",
    prefix: "Who is most likely to…",
  },
  {
    id: "wyr",
    kind: "wyr",
    title: ["Would", "You", "Rather"],
    tagline: "Guess their pick. Guess wrong, drink.",
    howTo:
      "Whoever holds the phone picks a side — silently, no tells. Everyone else calls out which one they think it was. Tap reveal: everyone who guessed wrong drinks. Nail it and you're safe.",
    emoji: "⚖️",
    glow: "--color-neon-mint",
    prefix: "Would you rather…",
  },
  {
    id: "tod",
    kind: "truthOrDare",
    title: ["Truth", "or", "Dare"],
    tagline: "Pick your poison. Chicken out and drink.",
    howTo: "Tap Truth or Dare. Do it, or take the drink (the group decides the penalty). Then pass the phone.",
    emoji: "🎭",
    glow: "--color-neon-red",
  },
  {
    id: "paranoia",
    kind: "paranoia",
    title: ["Para-", "noia"],
    tagline: "Answer out loud. The question stays secret… maybe.",
    howTo: "Read the card silently to the person on your right. They answer OUT LOUD with a name — but the question is only revealed on a coin flip. Named and revealed? That person drinks.",
    emoji: "👀",
    glow: "--color-neon-violet",
  },
  {
    id: "kings",
    kind: "kings",
    title: ["King's", "Cup"],
    tagline: "Draw a card, obey the rule. 4th King drinks it all.",
    howTo: "Take turns drawing. Each rank has a rule — do it. Kings fill the center cup; whoever draws the 4th King downs it.",
    emoji: "👑",
    glow: "--color-neon-gold",
  },
  {
    id: "contact",
    kind: "contact",
    title: ["Con-", "tact"],
    tagline: "Touch. Hold. Don't break the chain.",
    howTo: "The phone names two people and a way to touch — do it and HOLD. Each round stacks a new contact on top; keep them all connected. Break contact or chicken out = drink.",
    emoji: "🫦",
    glow: "--color-neon-lime",
  },
  {
    id: "hotseat",
    kind: "hotseat",
    title: ["Hot", "Seat"],
    tagline: "One player. Sixty seconds. No dodging.",
    howTo:
      "One player takes the hot seat and the clock starts. The group fires questions at them — tap for a card, or just ask your own. Every question must be answered before the buzzer. Dodge one and you drink. When time's up, the seat passes on.",
    emoji: "🪑",
    glow: "--color-neon-blue",
  },
  {
    id: "hotpotato",
    kind: "hotpotato",
    title: ["Hot", "Potato"],
    tagline: "Name it. Pass it. Don't be holding when it blows.",
    howTo: "Pick a heat level. The phone shows a category — shout something that fits, then SLAM it into the next person's hands. A hidden fuse is ticking. Whoever's holding it when the phone buzzes drinks.",
    emoji: "🥔",
    glow: "--color-neon-orange",
  },
];

export function getMode(id: ModeId): ModeMeta {
  const mode = MODES.find((m) => m.id === id);
  if (!mode) throw new Error(`Unknown mode: ${id}`);
  return mode;
}

/**
 * Single-deck prompt content for the plain "prompt" and "paranoia" engines.
 * Spicy mode is a superset — it keeps the normal cards and adds the hotter ones.
 */
export function getPromptDeck(id: ModeId, spicy = false): string[] {
  switch (id) {
    case "nhie":
      return spicy ? [...neverHaveIEver, ...neverHaveIEverSpicy] : neverHaveIEver;
    case "mlt":
      return spicy ? [...mostLikelyTo, ...mostLikelyToSpicy] : mostLikelyTo;
    case "paranoia":
      return spicy ? [...paranoia, ...paranoiaSpicy] : paranoia;
    default:
      return [];
  }
}

/** Card pairs for the Would You Rather engine. Spicy is a superset. */
export function getWyrDeck(spicy = false): WyrCard[] {
  return spicy ? [...wouldYouRather, ...wouldYouRatherSpicy] : wouldYouRather;
}
