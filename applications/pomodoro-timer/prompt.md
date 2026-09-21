# You are a senior developer.

Build a production-quality Pomodoro timer with Next.js and TypeScript — real engineering, not vibe coding: correct edge cases, clean architecture, no unexplained magic numbers.

## Core Logic

Countdown display, fixed 25 min focus / 5 min break (not user-configurable), start/pause/reset buttons, automatic switch between sessions. Custom hook `useTimer`, fully typed, no `any`. Derive remaining time from a stored wall-clock end-timestamp (`Date.now()`-based), not tick-counting, so it stays accurate if the tab loses focus; clean up all intervals/timeouts on unmount, pause, and reset. When a session ends, land on `00:00` (fully filled) and hold briefly before auto-advancing, rather than jumping straight to the next session's empty state.

## Tab Title & Notifications

Live countdown in the tab title as plain text (`MM:SS · Focus`, `+ " (paused)"`), restored on unmount — no emoji there. Request notification permission lazily on the first Start click (a user gesture); fire a browser Notification when a session ends.

## Visual — Tomato Progress

Visual centerpiece: a custom hand-drawn SVG tomato (body + calyx + stem, no external assets) acting as the progress indicator itself. A `clipPath`-masked rect fills it bottom-up, animated with Framer Motion (smooth height/position tween, plus a color cross-fade between ripe red for focus and cool blue for break as sessions switch); gray/faded when empty. Since the tomato body is round, map the fill by circular-segment area, not raw height fraction — otherwise it visually looks fully filled several seconds before the timer actually hits zero.

## Favicon

The tomato emoji as `app/icon.svg` (SVG `<text>`) — keep it out of the tab title.

## Style

Dark charcoal background (`#181818`), monospace type throughout, flat bordered buttons — no rounded corners, no drop shadows.

---

@devshipped
