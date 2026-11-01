import { useId } from "react";
import { P } from "@/core/palette";
import type { Expression } from "./Character.types";
import { AnimalMouth } from "./parts/AnimalMouth";
import { Eyes } from "./parts/Eyes";
import { Zzz } from "./parts/Zzz";

interface Props {
  expression?: Expression;
  /** Sedang berguling setelah dibangunkan. */
  rolling?: boolean;
}

/** Red panda yang mengantuk sambil memeluk batang bambu. */
export function RedPanda({ expression = "sleepy", rolling = false }: Props) {
  const gradientId = `pan${useId().replace(/:/g, "")}`;
  const fur = `url(#${gradientId})`;

  return (
    <svg
      className="cat-svg panda block h-full w-full"
      data-expr={expression}
      data-roll={rolling}
      viewBox="0 0 220 260"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="35%" r="70%">
          <stop offset="0" stopColor="#dd6f31" />
          <stop offset="1" stopColor="#c4581e" />
        </radialGradient>
      </defs>

      <g className="panda-roll">
        <g className="tail">
          <path
            d="M152 232 C214 232 226 172 196 142"
            fill="none"
            stroke={fur}
            strokeWidth="38"
            strokeLinecap="round"
          />
          <path
            d="M152 232 C214 232 226 172 196 142"
            fill="none"
            stroke="#f2d6a8"
            strokeWidth="38"
            strokeDasharray="7 24"
            opacity=".8"
          />
        </g>

        <g className="body">
          <ellipse cx="110" cy="198" rx="60" ry="58" fill={fur} />
          <ellipse cx="110" cy="214" rx="38" ry="38" fill="#3a2418" />
        </g>

        {/* batang bambu */}
        <g transform="translate(16 0)">
          <rect
            x="22"
            y="10"
            width="26"
            height="246"
            rx="6"
            fill={P.matcha500}
          />
          <rect x="20" y="58" width="30" height="7" rx="3" fill={P.matcha700} />
          <rect
            x="20"
            y="118"
            width="30"
            height="7"
            rx="3"
            fill={P.matcha700}
          />
          <rect
            x="20"
            y="178"
            width="30"
            height="7"
            rx="3"
            fill={P.matcha700}
          />
          <rect
            x="20"
            y="234"
            width="30"
            height="7"
            rx="3"
            fill={P.matcha700}
          />
          <rect
            x="27"
            y="14"
            width="5"
            height="238"
            rx="2.5"
            fill="#fff"
            opacity=".25"
          />
          <path d="M48 34 q34 -22 56 -6 q-26 20 -56 6 Z" fill={P.matcha300} />
          <path d="M22 52 q-26 -6 -34 12 q24 12 34 -12 Z" fill={P.matcha300} />
        </g>

        {/* kedua tangan memeluk bambu */}
        <ellipse
          cx="66"
          cy="182"
          rx="28"
          ry="13"
          fill="#3a2418"
          transform="rotate(-10 66 182)"
        />
        <ellipse
          cx="66"
          cy="210"
          rx="28"
          ry="13"
          fill="#3a2418"
          transform="rotate(-10 66 210)"
        />

        <g className="head">
          <g className="ear-l">
            <circle cx="52" cy="68" r="22" fill={fur} />
            <circle cx="52" cy="70" r="13" fill="#fff" />
          </g>
          <g className="ear-r">
            <circle cx="168" cy="68" r="22" fill={fur} />
            <circle cx="168" cy="70" r="13" fill="#fff" />
          </g>
          <ellipse cx="110" cy="112" rx="68" ry="54" fill={fur} />
          <ellipse cx="66" cy="128" rx="26" ry="22" fill="#fff" />
          <ellipse cx="154" cy="128" rx="26" ry="22" fill="#fff" />
          <ellipse cx="110" cy="134" rx="30" ry="22" fill="#fff" />
          <ellipse cx="70" cy="140" rx="13" ry="7" fill="#ff8fa8" opacity=".55" />
          <ellipse cx="150" cy="140" rx="13" ry="7" fill="#ff8fa8" opacity=".55" />
          <ellipse cx="84" cy="90" rx="12" ry="7" fill="#fff" />
          <ellipse cx="136" cy="90" rx="12" ry="7" fill="#fff" />
          <Eyes expression={expression} lx={84} rx={136} y={108} s={0.6} />
          <ellipse cx="110" cy="128" rx="9" ry="6.5" fill="#3a2418" />
          <AnimalMouth expression={expression} x={110} y={133} s={0.9} />
        </g>
      </g>

      {expression === "sleepy" && <Zzz dx={-40} dy={-20} />}
    </svg>
  );
}
