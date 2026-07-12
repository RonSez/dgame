import { useState } from "react";
import { useApp } from "../store/app";
import { TopBar, NeonButton, glowStyle } from "../components/ui";

export function PlayerSetup() {
  const { players, addPlayer, removePlayer, clearPlayers, back } = useApp();
  const [name, setName] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addPlayer(name);
    setName("");
  };

  return (
    <div
      style={glowStyle("--color-neon-cyan")}
      className="mx-auto flex w-full max-w-md flex-1 flex-col"
    >
      <TopBar title="Players" />

      <div className="flex flex-1 flex-col px-5 pb-8">
        <h1
          className="neon-text font-display text-5xl uppercase leading-[0.9]"
          style={glowStyle("--color-neon-cyan")}
        >
          Who's
          <br />
          playing?
        </h1>
        <p className="mt-3 text-sm text-haze">
          Optional — but adding names lets the app call out whose turn it is and
          who to pass to. Skip it and just read the cards aloud.
        </p>

        <form onSubmit={submit} className="mt-6 flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add a name"
            autoComplete="off"
            maxLength={20}
            className="min-w-0 flex-1 rounded-2xl border border-hairline bg-surface/70 px-4 py-4 text-chalk placeholder:text-haze/60 focus:border-neon-cyan focus:outline-none"
          />
          <NeonButton type="submit" disabled={!name.trim()}>
            Add
          </NeonButton>
        </form>

        <ul className="mt-5 flex flex-col gap-2">
          {players.map((p, i) => (
            <li
              key={`${p}-${i}`}
              className="flex items-center justify-between rounded-2xl border border-hairline bg-surface/50 px-4 py-3"
            >
              <span className="flex items-center gap-3">
                <span className="font-mono text-xs text-haze">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-chalk">{p}</span>
              </span>
              <button
                onClick={() => removePlayer(i)}
                aria-label={`Remove ${p}`}
                className="flex h-8 w-8 items-center justify-center rounded-full text-haze active:scale-90"
              >
                ✕
              </button>
            </li>
          ))}
          {players.length === 0 && (
            <li className="rounded-2xl border border-dashed border-hairline px-4 py-8 text-center text-sm text-haze/70">
              No players yet. Add a few above.
            </li>
          )}
        </ul>

        <div className="mt-auto flex flex-col gap-3 pt-6">
          {players.length > 0 && (
            <button
              onClick={clearPlayers}
              className="font-mono text-xs uppercase tracking-[0.2em] text-haze/70 active:scale-95"
            >
              Clear everyone
            </button>
          )}
          <NeonButton className="w-full" onClick={back}>
            Done
          </NeonButton>
        </div>
      </div>
    </div>
  );
}
