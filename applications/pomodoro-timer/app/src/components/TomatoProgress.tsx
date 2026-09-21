"use client";

import { motion } from "framer-motion";
import { heightFractionForAreaFraction } from "@/lib/circular-fill";
import {
  FILL_TICK_TRANSITION_S,
  SESSION_SWITCH_TRANSITION_S,
} from "@/lib/timer-constants";
import type { SessionType } from "@/hooks/useTimer";

const VIEWBOX_WIDTH = 200;
const VIEWBOX_HEIGHT = 220;

// Body drawn as a bezier approximation of an ellipse (kappa = 0.5523),
// nudged slightly off-symmetric for a hand-drawn feel.
const BODY_CENTER_X = 100;
const BODY_CENTER_Y = 132;
const BODY_RX = 76;
const BODY_RY = 66;
const BODY_TOP_Y = BODY_CENTER_Y - BODY_RY;
const BODY_BOTTOM_Y = BODY_CENTER_Y + BODY_RY;
const BODY_HEIGHT = BODY_BOTTOM_Y - BODY_TOP_Y;
const FILL_RECT_HEIGHT = BODY_HEIGHT + 24;
const FILL_RECT_X = BODY_CENTER_X - BODY_RX - 6;
const FILL_RECT_WIDTH = 2 * (BODY_RX + 6);

const BODY_PATH = [
  `M ${BODY_CENTER_X - 3},${BODY_TOP_Y}`,
  `C ${BODY_CENTER_X + 42},${BODY_TOP_Y - 2} ${BODY_CENTER_X + BODY_RX},${BODY_CENTER_Y - 36} ${BODY_CENTER_X + BODY_RX + 2},${BODY_CENTER_Y}`,
  `C ${BODY_CENTER_X + BODY_RX + 3},${BODY_CENTER_Y + 40} ${BODY_CENTER_X + 40},${BODY_BOTTOM_Y + 3} ${BODY_CENTER_X - 2},${BODY_BOTTOM_Y}`,
  `C ${BODY_CENTER_X - 46},${BODY_BOTTOM_Y + 2} ${BODY_CENTER_X - BODY_RX - 2},${BODY_CENTER_Y + 38} ${BODY_CENTER_X - BODY_RX},${BODY_CENTER_Y - 2}`,
  `C ${BODY_CENTER_X - BODY_RX + 1},${BODY_CENTER_Y - 40} ${BODY_CENTER_X - 40},${BODY_TOP_Y - 1} ${BODY_CENTER_X - 3},${BODY_TOP_Y}`,
  "Z",
].join(" ");

// A single sepal, drawn pointing straight up from the calyx attachment
// point; fanned out with rotation transforms to form the five-pointed calyx.
const CALYX_ATTACH_X = BODY_CENTER_X;
const CALYX_ATTACH_Y = BODY_TOP_Y + 4;
const SEPAL_PATH = `M ${CALYX_ATTACH_X - 6},${CALYX_ATTACH_Y} C ${CALYX_ATTACH_X - 10},${CALYX_ATTACH_Y - 20} ${CALYX_ATTACH_X - 5},${CALYX_ATTACH_Y - 38} ${CALYX_ATTACH_X},${CALYX_ATTACH_Y - 48} C ${CALYX_ATTACH_X + 5},${CALYX_ATTACH_Y - 38} ${CALYX_ATTACH_X + 10},${CALYX_ATTACH_Y - 20} ${CALYX_ATTACH_X + 6},${CALYX_ATTACH_Y} Z`;
const SEPAL_ANGLES = [-58, -29, 0, 29, 58];

const STEM_PATH = `M ${BODY_CENTER_X - 4},${CALYX_ATTACH_Y - 6} L ${BODY_CENTER_X + 3},${CALYX_ATTACH_Y - 6} L ${BODY_CENTER_X + 2},${CALYX_ATTACH_Y - 28} L ${BODY_CENTER_X - 3},${CALYX_ATTACH_Y - 28} Z`;

const EMPTY_BODY_COLOR = "#3a3a3a";
const EMPTY_BODY_STROKE = "#565656";
const CALYX_COLOR = "#4f7a45";
const STEM_COLOR = "#3f5c37";
const FOCUS_COLOR = "#d94f3d";
const BREAK_COLOR = "#3e7cb1";

const SESSION_FILL_COLOR: Record<SessionType, string> = {
  focus: FOCUS_COLOR,
  break: BREAK_COLOR,
};

interface TomatoProgressProps {
  sessionType: SessionType;
  progressFraction: number;
  /** True right after an automatic session switch, for a slower drain + color cross-fade. */
  isSessionSwitch: boolean;
}

export function TomatoProgress({ sessionType, progressFraction, isSessionSwitch }: TomatoProgressProps) {
  const heightFraction = heightFractionForAreaFraction(progressFraction);
  const fillTopY = BODY_BOTTOM_Y - heightFraction * BODY_HEIGHT;

  const transition = isSessionSwitch
    ? { duration: SESSION_SWITCH_TRANSITION_S, ease: "easeInOut" as const }
    : { duration: FILL_TICK_TRANSITION_S, ease: "linear" as const };

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      role="img"
      aria-hidden="true"
      className="w-full h-full"
    >
      <defs>
        <clipPath id="tomato-body-clip">
          <path d={BODY_PATH} />
        </clipPath>
      </defs>

      <path d={BODY_PATH} fill={EMPTY_BODY_COLOR} stroke={EMPTY_BODY_STROKE} strokeWidth={3} />

      <g clipPath="url(#tomato-body-clip)">
        <motion.rect
          x={FILL_RECT_X}
          width={FILL_RECT_WIDTH}
          height={FILL_RECT_HEIGHT}
          animate={{ y: fillTopY, fill: SESSION_FILL_COLOR[sessionType] }}
          transition={transition}
        />
      </g>

      <path d={BODY_PATH} fill="none" stroke={EMPTY_BODY_STROKE} strokeWidth={3} />

      {SEPAL_ANGLES.map((angle) => (
        <path
          key={angle}
          d={SEPAL_PATH}
          fill={CALYX_COLOR}
          transform={`rotate(${angle} ${CALYX_ATTACH_X} ${CALYX_ATTACH_Y})`}
        />
      ))}

      <path d={STEM_PATH} fill={STEM_COLOR} />
    </svg>
  );
}
