"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BREAK_DURATION_MS,
  FOCUS_DURATION_MS,
  SESSION_END_HOLD_MS,
  TICK_INTERVAL_MS,
} from "@/lib/timer-constants";

export type SessionType = "focus" | "break";
export type TimerStatus = "idle" | "running" | "paused" | "ended";

const DURATION_MS: Record<SessionType, number> = {
  focus: FOCUS_DURATION_MS,
  break: BREAK_DURATION_MS,
};

const NEXT_SESSION: Record<SessionType, SessionType> = {
  focus: "break",
  break: "focus",
};

const SESSION_END_MESSAGE: Record<SessionType, { title: string; body: string }> = {
  focus: { title: "Focus session complete", body: "Time for a break." },
  break: { title: "Break's over", body: "Back to focus." },
};

function requestNotificationPermissionOnce(): void {
  if (typeof Notification === "undefined") return;
  if (Notification.permission === "default") {
    void Notification.requestPermission();
  }
}

function notifySessionEnd(sessionType: SessionType): void {
  if (typeof Notification === "undefined") return;
  if (Notification.permission !== "granted") return;
  const { title, body } = SESSION_END_MESSAGE[sessionType];
  new Notification(title, { body });
}

export interface UseTimerResult {
  sessionType: SessionType;
  status: TimerStatus;
  remainingMs: number;
  totalMs: number;
  /** True for the brief window right after an automatic session switch, for consumers that want a distinct transition. */
  justSwitched: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export function useTimer(): UseTimerResult {
  const [sessionType, setSessionType] = useState<SessionType>("focus");
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [remainingMs, setRemainingMs] = useState<number>(DURATION_MS.focus);
  const [justSwitched, setJustSwitched] = useState(false);

  // Wall-clock timestamp the current running period ends at. Remaining time
  // is always re-derived from this rather than accumulated tick-by-tick, so
  // it stays correct even if ticks are delayed (e.g. a backgrounded tab).
  const endAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (status !== "running") return;

    const tick = (): void => {
      const endAt = endAtRef.current;
      if (endAt === null) return;
      const remaining = endAt - Date.now();
      if (remaining <= 0) {
        setRemainingMs(0);
        setStatus("ended");
        notifySessionEnd(sessionType);
        return;
      }
      setRemainingMs(remaining);
    };

    tick();
    const intervalId = setInterval(tick, TICK_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [status, sessionType]);

  useEffect(() => {
    if (status !== "ended") return;

    const timeoutId = setTimeout(() => {
      const next = NEXT_SESSION[sessionType];
      const duration = DURATION_MS[next];
      endAtRef.current = Date.now() + duration;
      setSessionType(next);
      setRemainingMs(duration);
      setStatus("running");
      setJustSwitched(true);
    }, SESSION_END_HOLD_MS);

    return () => clearTimeout(timeoutId);
  }, [status, sessionType]);

  // justSwitched only needs to be true for the render(s) right after a
  // switch, so consumers can pick a one-off transition; clear it right after.
  useEffect(() => {
    if (!justSwitched) return;
    const timeoutId = setTimeout(() => setJustSwitched(false), 0);
    return () => clearTimeout(timeoutId);
  }, [justSwitched]);

  const start = useCallback(() => {
    requestNotificationPermissionOnce();
    if (status === "running" || status === "ended") return;
    const duration = status === "paused" ? remainingMs : DURATION_MS[sessionType];
    endAtRef.current = Date.now() + duration;
    setStatus("running");
  }, [status, remainingMs, sessionType]);

  const pause = useCallback(() => {
    if (status !== "running") return;
    const endAt = endAtRef.current;
    if (endAt !== null) {
      setRemainingMs(Math.max(0, endAt - Date.now()));
    }
    endAtRef.current = null;
    setStatus("paused");
  }, [status]);

  const reset = useCallback(() => {
    endAtRef.current = null;
    setSessionType("focus");
    setStatus("idle");
    setRemainingMs(DURATION_MS.focus);
    setJustSwitched(false);
  }, []);

  return {
    sessionType,
    status,
    remainingMs,
    totalMs: DURATION_MS[sessionType],
    justSwitched,
    start,
    pause,
    reset,
  };
}
