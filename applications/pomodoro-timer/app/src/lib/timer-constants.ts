const SECONDS_PER_MINUTE = 60;
const MS_PER_SECOND = 1000;

/** Fixed session lengths — this timer is intentionally not user-configurable. */
export const FOCUS_DURATION_MS = 25 * SECONDS_PER_MINUTE * MS_PER_SECOND;
export const BREAK_DURATION_MS = 5 * SECONDS_PER_MINUTE * MS_PER_SECOND;

/** How often the countdown re-derives remaining time from the wall clock. */
export const TICK_INTERVAL_MS = 250;

/** How long to hold at 00:00 (fully filled) before auto-advancing to the next session. */
export const SESSION_END_HOLD_MS = 1500;

/** Tween duration for the tomato fill catching up to a regular tick. */
export const FILL_TICK_TRANSITION_S = TICK_INTERVAL_MS / MS_PER_SECOND;

/** Tween duration for the drain + color cross-fade when a session switches. */
export const SESSION_SWITCH_TRANSITION_S = 0.6;
