"use client";

import { useTimer } from "@/hooks/useTimer";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { formatTime } from "@/lib/format-time";
import { TomatoProgress } from "@/components/TomatoProgress";

const SESSION_LABEL = {
  focus: "Focus",
  break: "Break",
} as const;

const BUTTON_CLASS =
  "border border-[#565656] px-6 py-2 font-mono text-sm uppercase tracking-wide text-[#ededed] " +
  "hover:bg-[#2a2a2a] disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed";

export function PomodoroTimer() {
  const { sessionType, status, remainingMs, totalMs, justSwitched, start, pause, reset } = useTimer();

  useDocumentTitle({ remainingMs, sessionType, status });

  const progressFraction = 1 - remainingMs / totalMs;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="w-64 h-64 sm:w-72 sm:h-72">
        <TomatoProgress
          sessionType={sessionType}
          progressFraction={progressFraction}
          isSessionSwitch={justSwitched}
        />
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-sm uppercase tracking-[0.2em] text-[#8a8a8a]">
          {SESSION_LABEL[sessionType]}
        </span>
        <span className="text-6xl font-mono tabular-nums text-[#ededed]" aria-live="polite">
          {formatTime(remainingMs)}
        </span>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={start}
          disabled={status === "running" || status === "ended"}
          className={BUTTON_CLASS}
        >
          Start
        </button>
        <button
          type="button"
          onClick={pause}
          disabled={status !== "running"}
          className={BUTTON_CLASS}
        >
          Pause
        </button>
        <button type="button" onClick={reset} className={BUTTON_CLASS}>
          Reset
        </button>
      </div>
    </div>
  );
}
