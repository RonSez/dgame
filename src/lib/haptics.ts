/** A short buzz on interaction, where the device supports it. Fails silently. */
export function buzz(pattern: number | number[] = 12): void {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* not supported — ignore */
    }
  }
}
