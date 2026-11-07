/**
 * Site clock. The system runs on a fixed operating day: every start (and every reset) opens at
 * 1403/04/17 10:30 Tehran time with the same data, and the clock then ticks normally from there.
 * Server and browser share the same offset (the server sends it with each live snapshot).
 */
export const CLOCK_ANCHOR = Date.UTC(2024, 6, 7, 7, 0, 0); // 1403/04/17 10:30 IRST

const g = globalThis as { __tozinClockOffset?: number };

export function clockOffset(): number {
  if (g.__tozinClockOffset === undefined) g.__tozinClockOffset = CLOCK_ANCHOR - Date.now();
  return g.__tozinClockOffset;
}
/** Re-anchor to the start of the operating day (server boot / reset). */
export function resetClock(): void {
  g.__tozinClockOffset = CLOCK_ANCHOR - Date.now();
}
/** Browser: adopt the server's offset. */
export function setClockOffset(ms: number): void {
  if (Number.isFinite(ms)) g.__tozinClockOffset = ms;
}
/** Current site time in ms (use instead of Date.now()). */
export const clockNow = (): number => Date.now() + clockOffset();
