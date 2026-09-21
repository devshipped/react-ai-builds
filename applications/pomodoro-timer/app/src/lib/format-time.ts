const SECONDS_PER_MINUTE = 60;
const MS_PER_SECOND = 1000;

/**
 * Formats milliseconds as MM:SS. Rounds up so the display holds "01" for the
 * entire last second rather than dropping to "00" a tick early.
 */
export function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / MS_PER_SECOND));
  const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
  const seconds = totalSeconds % SECONDS_PER_MINUTE;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
