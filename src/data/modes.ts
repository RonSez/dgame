import type { ModeId, ModeMeta } from "./types";
import { neverHaveIEver } from "./neverHaveIEver";
import { mostLikelyTo } from "./mostLikelyTo";
import { paranoia } from "./paranoia";

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
];

export function getMode(id: ModeId): ModeMeta {
  const mode = MODES.find((m) => m.id === id);
  if (!mode) throw new Error(`Unknown mode: ${id}`);
  return mode;
}

/** Single-deck prompt content for the plain "prompt" and "paranoia" engines. */
export function getPromptDeck(id: ModeId): string[] {
  switch (id) {
    case "nhie":
      return neverHaveIEver;
    case "mlt":
      return mostLikelyTo;
    case "paranoia":
      return paranoia;
    default:
      return [];
  }
}
