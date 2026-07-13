export type ModeId =
  | "nhie"
  | "mlt"
  | "tod"
  | "paranoia"
  | "kings"
  | "contact"
  | "hotpotato";

/** Which engine renders a mode. */
export type ModeKind =
  | "prompt"
  | "truthOrDare"
  | "paranoia"
  | "kings"
  | "contact"
  | "hotpotato";

export interface ModeMeta {
  id: ModeId;
  kind: ModeKind;
  /** Big stacked headline, split into lines for the neon poster treatment. */
  title: string[];
  /** One-line description shown on the home tile. */
  tagline: string;
  /** How to play, shown once when the mode opens. */
  howTo: string;
  emoji: string;
  /** CSS color token name, e.g. "--color-neon-cyan". */
  glow: string;
  /** Small label rendered above each prompt, e.g. "Never have I ever". */
  prefix?: string;
}

export interface KingRule {
  rank: string;
  label: string;
  rule: string;
}
