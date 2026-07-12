import { useState, type ReactNode } from "react";
import type { ModeMeta } from "../data/types";
import { TopBar, glowStyle, NeonButton } from "./ui";

/** Wraps every game screen: back bar, per-mode glow context, and a one-time intro. */
export function GameShell({
  mode,
  children,
}: {
  mode: ModeMeta;
  children: ReactNode;
}) {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div
      style={glowStyle(mode.glow)}
      className="mx-auto flex w-full max-w-md flex-1 flex-col"
    >
      <TopBar
        title={mode.title.join(" ")}
        right={<span className="text-xl">{mode.emoji}</span>}
      />

      {children}

      {showIntro && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-void/80 px-5 pb-8 backdrop-blur-sm">
          <div
            style={glowStyle(mode.glow)}
            className="neon-ring animate-card-in w-full max-w-md rounded-3xl bg-surface p-6"
          >
            <span className="text-4xl">{mode.emoji}</span>
            <h2
              className="neon-text mt-3 font-display text-4xl uppercase leading-[0.9]"
              style={glowStyle(mode.glow)}
            >
              {mode.title.join(" ")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-chalk/90">
              {mode.howTo}
            </p>
            <NeonButton
              className="mt-6 w-full"
              onClick={() => setShowIntro(false)}
            >
              Let's go
            </NeonButton>
          </div>
        </div>
      )}
    </div>
  );
}
