import { useEffect, useMemo, useState } from "react";
import type { ModeMeta } from "../data/types";
import { useApp } from "../store/app";
import { hotSeat, hotSeatSpicy } from "../data/hotSeat";
import { useDeck } from "../lib/deck";
import { useTurn } from "../lib/turn";
import { useFilledCard } from "../lib/tokens";
import { GameShell } from "../components/GameShell";
import { NeonButton, glowStyle } from "../components/ui";
import { buzz } from "../lib/haptics";

type Phase = "seat" | "running" | "done";

/** Round lengths, in seconds. */
const LENGTHS = [30, 60, 90] as const;
type Length = (typeof LENGTHS)[number];

/** Below this many seconds the clock turns red and starts pulsing. */
const PANIC_AT = 10;

export function HotSeat({ mode }: { mode: ModeMeta }) {
  const { players, settings } = useApp();

  // Spicy mode adds the hotter questions on top; memoize for a stable source.
  const source = useMemo(
    () => (settings.spicy ? [...hotSeat, ...hotSeatSpicy] : hotSeat),
    [settings.spicy],
  );
  const deck = useDeck(source);
  const turn = useTurn(players);

  const [phase, setPhase] = useState<Phase>("seat");
  const [length, setLength] = useState<Length>(60);
  const [left, setLeft] = useState<number>(60);
  const [asked, setAsked] = useState(0);

  const inSeat = turn.current;
  const card = useFilledCard(deck.current ?? "", players, inSeat);

  const start = () => {
    if (settings.haptics) buzz([10, 30, 10]);
    deck.next();
    setLeft(length);
    setAsked(0);
    setPhase("running");
  };

  const nextQuestion = () => {
    if (settings.haptics) buzz();
    deck.next();
    setAsked((n) => n + 1);
  };

  const passSeat = () => {
    if (settings.haptics) buzz();
    turn.advance();
    setPhase("seat");
  };

  // The clock. Ticks only while the round is live, and is always torn down so
  // an old interval can never bleed into the next round or outlive the screen.
  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(() => {
      setLeft((t) => {
        if (t > 1) return t - 1;
        clearInterval(id);
        if (settings.haptics) buzz([400, 120, 400]);
        setPhase("done");
        return 0;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, settings.haptics]);

  // ── Time's up ──────────────────────────────────────────────────────────────
  if (phase === "done") {
    return (
      <GameShell mode={mode}>
        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-10 text-center">
          <div
            style={glowStyle(mode.glow)}
            className="neon-ring neon-fill animate-card-in flex w-full flex-col items-center rounded-[2rem] p-10"
          >
            <span className="text-6xl">⏱️</span>
            <h2
              className="neon-text mt-4 font-display text-6xl uppercase leading-[0.85]"
              style={glowStyle(mode.glow)}
            >
              Seat's
              <br />
              cool
            </h2>
            <p className="mt-5 text-lg font-semibold text-chalk">
              {inSeat ? `${inSeat} survived` : "You survived"} {asked}{" "}
              {asked === 1 ? "question" : "questions"}.
            </p>
            <p className="mt-2 text-sm text-haze">
              Dodged any? That's a drink each. 🍻
            </p>
          </div>
          <NeonButton className="mt-8 w-full" onClick={passSeat}>
            {turn.upNext ? `${turn.upNext}'s turn in the seat` : "Next round"}
          </NeonButton>
        </div>
      </GameShell>
    );
  }

  // ── Who's up — pick the round length and sit down ──────────────────────────
  if (phase === "seat") {
    return (
      <GameShell mode={mode}>
        <div className="flex flex-1 flex-col px-5 pb-8">
          <div className="text-center font-mono text-xs uppercase tracking-[0.25em] text-haze">
            In the hot seat
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-8 py-6">
            <div
              key={inSeat ?? "anyone"}
              style={glowStyle(mode.glow)}
              className="neon-ring animate-card-in flex min-h-[13rem] w-full flex-col items-center justify-center rounded-[2rem] bg-surface/70 p-8 text-center"
            >
              <span className="text-5xl">🪑</span>
              {inSeat ? (
                <>
                  <p
                    className="neon-text mt-4 font-display text-5xl uppercase leading-[0.9]"
                    style={glowStyle(mode.glow)}
                  >
                    {inSeat}
                  </p>
                  <p className="mt-3 text-sm text-haze">
                    Everyone else: line up your questions.
                  </p>
                </>
              ) : (
                <p className="mt-4 text-xl font-semibold leading-snug text-chalk">
                  Pick someone to take the seat.
                </p>
              )}
            </div>

            {/* Round length */}
            <div className="w-full">
              <p className="mb-2 text-center font-mono text-[0.7rem] uppercase tracking-[0.25em] text-haze">
                Round length
              </p>
              <div className="grid grid-cols-3 gap-2">
                {LENGTHS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      if (settings.haptics) buzz(10);
                      setLength(s);
                    }}
                    style={s === length ? glowStyle(mode.glow) : undefined}
                    className={`rounded-2xl py-3 font-mono text-sm font-bold tracking-widest transition active:scale-[0.97] ${
                      s === length
                        ? "neon-ring neon-fill text-chalk"
                        : "border border-hairline text-haze"
                    }`}
                  >
                    {s}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          <NeonButton className="w-full" onClick={start}>
            Start the clock
          </NeonButton>
        </div>
      </GameShell>
    );
  }

  // ── Running — clock down, questions flying ─────────────────────────────────
  const panic = left <= PANIC_AT;
  const clockGlow = panic ? "--color-neon-red" : mode.glow;

  return (
    <GameShell mode={mode}>
      <div className="flex flex-1 flex-col px-5 pb-8">
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-haze">
          <span>
            {inSeat ? <span className="text-chalk">{inSeat}</span> : "Hot seat"}
          </span>
          <span>
            {asked} asked
            {deck.total > 0 && ` · ${deck.position}/${deck.total}`}
          </span>
        </div>

        {/* The clock */}
        <p
          className={`neon-text mt-4 text-center font-display text-7xl leading-none ${
            panic ? "animate-pulse" : ""
          }`}
          style={glowStyle(clockGlow)}
        >
          {left}s
        </p>

        {/* The question */}
        <div className="flex flex-1 items-center justify-center py-6">
          <div
            key={`${deck.position}-${asked}`}
            style={glowStyle(mode.glow)}
            className="neon-ring animate-card-in flex min-h-[14rem] w-full flex-col justify-center rounded-[2rem] bg-surface/70 p-8 text-center"
          >
            {card ? (
              <>
                <p
                  className="neon-text mb-4 font-mono text-xs uppercase tracking-[0.25em]"
                  style={glowStyle(mode.glow)}
                >
                  Answer it
                </p>
                <p className="text-2xl font-semibold leading-snug text-chalk">
                  {card}
                </p>
              </>
            ) : (
              <p className="text-2xl font-semibold leading-snug text-chalk">
                Ask them anything. Go.
              </p>
            )}
          </div>
        </div>

        {/* With no card deck loaded, ending the round is the only action. */}
        {deck.total > 0 ? (
          <>
            <NeonButton className="w-full" onClick={nextQuestion}>
              Next question
            </NeonButton>
            <button
              onClick={() => setPhase("done")}
              className="mt-3 font-mono text-xs uppercase tracking-[0.25em] text-haze active:scale-95"
            >
              End the round
            </button>
          </>
        ) : (
          <NeonButton className="w-full" onClick={() => setPhase("done")}>
            End the round
          </NeonButton>
        )}
      </div>
    </GameShell>
  );
}
