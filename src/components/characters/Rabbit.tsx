import { useId } from "react";
import { P } from "@/core/palette";
import type { Expression } from "./Character.types";
import { AnimalMouth } from "./parts/AnimalMouth";
import { Eyes } from "./parts/Eyes";

interface Props {
  expression?: Expression;
  /** Syal hijau (dipakai adik). */
  scarf?: boolean;
}

/** Garis tepi tipis agar kelinci putih tetap terlihat di latar terang. */
const EDGE = { stroke: "rgba(74,47,30,0.18)", strokeWidth: 2.5 } as const;

/** Kelinci putih bertelinga panjang. Dipakai untuk kakak dan kedua adiknya. */
export function Rabbit({ expression = "happy", scarf = false }: Props) {
  const gradientId = `rab${useId().replace(/:/g, "")}`;
  const fur = `url(#${gradientId})`;

  return (
    <svg
      className="cat-svg rabbit block h-auto w-full"
      data-expr={expression}
      viewBox="0 0 200 250"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fffdf7" />
          <stop offset="1" stopColor="#ece7f0" />
        </radialGradient>
      </defs>

      <g className="body">
        <ellipse cx="100" cy="188" rx="54" ry="56" fill={fur} {...EDGE} />
        <ellipse cx="100" cy="204" rx="32" ry="36" fill="#fff6f8" />
        <ellipse cx="78" cy="232" rx="17" ry="12" fill={fur} {...EDGE} />
        <ellipse cx="122" cy="232" rx="17" ry="12" fill={fur} {...EDGE} />
      </g>

      {scarf && (
        <g>
          <path
            d="M50 150 Q100 182 150 150 L148 168 Q100 198 52 168 Z"
            fill={P.matcha500}
          />
          <path d="M122 178 l16 44 l-20 6 l-6 -40 Z" fill={P.matcha700} />
        </g>
      )}

      <g className="head">
        <g className="ear-l">
          <ellipse cx="70" cy="50" rx="17" ry="46" fill={fur} {...EDGE} />
          <ellipse cx="70" cy="56" rx="8" ry="32" fill="#ffd6e0" />
        </g>
        <g className="ear-r">
          <ellipse cx="130" cy="50" rx="17" ry="46" fill={fur} {...EDGE} />
          <ellipse cx="130" cy="56" rx="8" ry="32" fill="#ffd6e0" />
        </g>
        <ellipse cx="100" cy="116" rx="58" ry="50" fill={fur} {...EDGE} />
        <ellipse cx="66" cy="134" rx="13" ry="8" fill="#ff8fa8" opacity=".55" />
        <ellipse
          cx="134"
          cy="134"
          rx="13"
          ry="8"
          fill="#ff8fa8"
          opacity=".55"
        />
        <Eyes expression={expression} lx={76} rx={124} y={110} s={0.62} />
        <ellipse cx="100" cy="126" rx="7" ry="5" fill="#ff8fa8" />
        <AnimalMouth expression={expression} x={100} y={130} s={0.8} />
        {expression === "idle" && (
          <>
            <rect
              x="94"
              y="141"
              width="5.5"
              height="8"
              rx="2"
              fill="#fff"
              stroke="rgba(74,47,30,.25)"
              strokeWidth="1"
            />
            <rect
              x="100.5"
              y="141"
              width="5.5"
              height="8"
              rx="2"
              fill="#fff"
              stroke="rgba(74,47,30,.25)"
              strokeWidth="1"
            />
          </>
        )}
      </g>
    </svg>
  );
}
