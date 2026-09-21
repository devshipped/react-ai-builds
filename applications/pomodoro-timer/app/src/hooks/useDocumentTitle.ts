"use client";

import { useEffect } from "react";
import { formatTime } from "@/lib/format-time";
import type { SessionType, TimerStatus } from "./useTimer";

const SESSION_LABEL: Record<SessionType, string> = {
  focus: "Focus",
  break: "Break",
};

interface UseDocumentTitleParams {
  remainingMs: number;
  sessionType: SessionType;
  status: TimerStatus;
}

/** Mirrors the countdown into the tab title, restoring the original on unmount. */
export function useDocumentTitle({ remainingMs, sessionType, status }: UseDocumentTitleParams): void {
  useEffect(() => {
    const originalTitle = document.title;
    return () => {
      document.title = originalTitle;
    };
  }, []);

  useEffect(() => {
    const pausedSuffix = status === "paused" ? " (paused)" : "";
    document.title = `${formatTime(remainingMs)} · ${SESSION_LABEL[sessionType]}${pausedSuffix}`;
  }, [remainingMs, sessionType, status]);
}
