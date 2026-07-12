import { useState } from "react";
import type { ModeMeta } from "../data/types";
import { useApp } from "../store/app";
import { buildDeck, kingRules, type Card } from "../data/kingsCup";
import { shuffle } from "../lib/deck";
import { useTurn } from "../lib/turn";
import { GameShell } from "../components/GameShell";
import { NeonButton, glowStyle } from "../components/ui";
import { buzz } from "../lib/haptics";

export function KingsCup({ mode }: { mode: ModeMeta }) {
  const { players, settings } = useApp();
  const turn = useTurn(players);

  const [deck, setDeck] = useState<Card[]>(() => shuffle(buildDeck()));
  const [index, setIndex] = useState(0);
  const [current, setCurrent] = useState<Card | null>(null);
  const [kings, setKings] = useState(0);
  const [cupAlert, setCupAlert] = useState(false);

  const remaining = deck.length - index;
  const rule = current ? kingRules[current.rank] : null;

  const draw = () => {
    if (remaining === 0) return;
    const card = deck[index];
    if (settings.haptics) buzz(card.rank === "K" ? [12, 40, 12] : 12);
    setCurrent(card);
    setIndex(index + 1);
    if (card.rank === "K") {
      const total = kings + 1;
      setKings(total);
      if (total === 4) setCupAlert(true);
    }
    turn.advance();
  };

  const reshuffle = () => {
    if (settings.haptics) buzz();
    setDeck(shuffle(buildDeck()));
    setIndex(0);
    setCurrent(null);
    setKings(0);
  };

  return (
    <GameShell mode={mode}>
      <div className="flex flex-1 flex-col px-5 pb-8">
        {/* Status row */}
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-haze">
          <span>
            {turn.current ? (
              <>
                <span className="text-chalk">{turn.current}</span> draws
              </>
            ) : (
              "Take turns drawing"
            )}
          </span>
          <span className="flex gap-3">
            <span>{remaining} left</span>
            <span
              className="neon-text"
              style={glowStyle("--color-neon-gold")}
            >
              👑 {kings}/4
            </span>
          </span>
        </div>

        {/* The card */}
        <div className="flex flex-1 items-center justify-center py-6">
          {current ? (
            <div
              key={index}
              style={glowStyle(mode.glow)}
              className="neon-ring animate-card-in aspect-[3/4] w-48 rounded-[1.5rem] bg-surface p-4"
            >
              <CardFace card={current} />
            </div>
          ) : (
            <div
              style={glowStyle(mode.glow)}
              className="neon-ring flex aspect-[3/4] w-48 items-center justify-center rounded-[1.5rem] bg-surface/50"
            >
              <span className="text-5xl opacity-60">🂠</span>
            </div>
          )}
        </div>

        {/* Rule */}
        <div className="min-h-[6.5rem] text-center">
          {rule && (
            <div key={index} className="animate-card-in">
              <p
                className="neon-text font-display text-3xl uppercase"
                style={glowStyle(mode.glow)}
              >
                {rule.label}
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-chalk/85">
                {rule.rule}
              </p>
            </div>
          )}
        </div>

        {/* Action */}
        {remaining > 0 ? (
          <NeonButton className="mt-4 w-full" onClick={draw}>
            {turn.upNext ? `Draw · then ${turn.upNext}` : "Draw a card"}
          </NeonButton>
        ) : (
          <NeonButton className="mt-4 w-full" onClick={reshuffle}>
            Deck's empty — shuffle again
          </NeonButton>
        )}
      </div>

      {/* 4th King payoff */}
      {cupAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/85 px-6 text-center backdrop-blur-sm">
          <div
            style={glowStyle("--color-neon-gold")}
            className="neon-ring animate-card-in w-full max-w-sm rounded-3xl bg-surface p-8"
          >
            <p className="text-6xl">👑</p>
            <h2
              className="neon-text mt-4 font-display text-5xl uppercase leading-[0.9]"
              style={glowStyle("--color-neon-gold")}
            >
              Drink the cup
            </h2>
            <p className="mt-3 text-sm text-chalk/85">
              {turn.current
                ? `${turn.current} drew the 4th King. Down the whole thing.`
                : "The 4th King is out. Whoever drew it downs the center cup."}
            </p>
            <NeonButton
              className="mt-6 w-full"
              style={glowStyle("--color-neon-gold")}
              onClick={() => {
                if (settings.haptics) buzz();
                setCupAlert(false);
              }}
            >
              Down it 🍺
            </NeonButton>
          </div>
        </div>
      )}
    </GameShell>
  );
}

function CardFace({ card }: { card: Card }) {
  const color = card.suit.red ? "text-neon-red" : "text-chalk";
  return (
    <div className={`flex h-full flex-col justify-between ${color}`}>
      <div className="text-left leading-none">
        <div className="font-mono text-2xl font-bold">{card.rank}</div>
        <div className="text-xl">{card.suit.symbol}</div>
      </div>
      <div className="text-center text-6xl">{card.suit.symbol}</div>
      <div className="rotate-180 text-left leading-none">
        <div className="font-mono text-2xl font-bold">{card.rank}</div>
        <div className="text-xl">{card.suit.symbol}</div>
      </div>
    </div>
  );
}
