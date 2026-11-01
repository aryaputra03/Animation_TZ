import type { Expression } from "../Character.types";

const INK = "#7a3b12";
const INSIDE = "#8a2f45";

interface Props {
  expression: Expression;
  /** Titik di bawah hidung, tempat mulut mulai. */
  x: number;
  y: number;
  s?: number;
}

/** Mulut sederhana untuk hamster, kelinci, rubah, dan red panda. */
export function AnimalMouth({ expression, x, y, s = 1 }: Props) {
  const t = `translate(${x} ${y}) scale(${s})`;
  switch (expression) {
    case "happy":
    case "cheer":
    case "lebay":
      return (
        <g transform={t}>
          <path d="M-12 0 Q0 18 12 0 Z" fill={INSIDE} />
          <path d="M-6 8 Q0 13 6 8 Q0 5 -6 8 Z" fill="#ff8fa8" />
        </g>
      );
    case "surprised":
      return <ellipse transform={t} rx="6" ry="8" cy="6" fill={INSIDE} />;
    case "curious":
      return <ellipse transform={t} rx="4" ry="5" cy="4" fill={INSIDE} />;
    case "grumpy":
      return (
        <path
          transform={t}
          d="M-9 8 Q0 -2 9 8"
          fill="none"
          stroke={INSIDE}
          strokeWidth="4"
          strokeLinecap="round"
        />
      );
    case "hurt":
      return (
        <path
          transform={t}
          d="M-12 7 Q-7 -2 -2 6 Q3 14 8 5 Q11 1 13 4"
          fill="none"
          stroke={INSIDE}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    case "sleepy":
      return (
        <path
          transform={t}
          d="M-8 3 h16"
          stroke={INK}
          strokeWidth="3"
          strokeLinecap="round"
        />
      );
    default:
      return (
        <path
          transform={t}
          d="M0 0 Q0 10 -10 11 M0 0 Q0 10 10 11"
          fill="none"
          stroke={INK}
          strokeWidth="3"
          strokeLinecap="round"
        />
      );
  }
}
