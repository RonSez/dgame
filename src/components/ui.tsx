import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { useApp } from "../store/app";
import { buzz } from "../lib/haptics";

/** Bind a mode's glow token to the `--glow` CSS variable used by neon utilities. */
export function glowStyle(glowToken: string): CSSProperties {
  return { ["--glow" as string]: `var(${glowToken})` } as CSSProperties;
}

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "ghost";
  children: ReactNode;
}

/** Primary action button. Buzzes on tap (respecting the haptics setting). */
export function NeonButton({
  variant = "solid",
  children,
  className = "",
  onClick,
  ...rest
}: NeonButtonProps) {
  const { settings } = useApp();
  const base =
    "select-none rounded-2xl px-6 py-4 font-mono text-sm font-bold uppercase tracking-[0.2em] transition active:scale-[0.97]";
  const look =
    variant === "solid"
      ? "neon-ring neon-fill text-chalk"
      : "border border-hairline text-haze hover:text-chalk";
  return (
    <button
      className={`${base} ${look} ${className}`}
      onClick={(e) => {
        if (settings.haptics) buzz();
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

/** Sticky top bar with a back chevron and an optional right-side slot. */
export function TopBar({
  title,
  right,
}: {
  title?: string;
  right?: ReactNode;
}) {
  const { back } = useApp();
  return (
    <header className="flex items-center justify-between px-5 pt-4 pb-2">
      <button
        onClick={back}
        aria-label="Back"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-chalk active:scale-90"
      >
        <span className="text-2xl leading-none">‹</span>
      </button>
      {title && (
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-haze">
          {title}
        </span>
      )}
      <div className="flex h-11 w-11 items-center justify-center">{right}</div>
    </header>
  );
}
