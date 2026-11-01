import { useId } from "react";
import { P } from "@/core/palette";
import type { Expression } from "./Character.types";
import { AnimalMouth } from "./parts/AnimalMouth";
import { Eyes } from "./parts/Eyes";

export type FoxState = "rest" | "jump" | "shake";

interface Props {
  expression?: Expression;
  state?: FoxState;
}

/**
 * Rubah di balik semak. Ekor besarnya selalu terlihat (lucunya: "bersembunyi" tapi ekornya kelihatan).
 * Saat state "jump", seluruh badan rubah (fox-body) melompat naik dan berputar.
 */
export function Fox({ expression = "curious", state = "rest" }: Props) {
  const uid = useId().replace(/:/g, "");
  const furId = `fox${uid}`;
  const earId = `ear${uid}`;
  const fur = `url(#${furId})`;

  return (
    <svg
      className="cat-svg fox-svg block h-full w-full"
      data-expr={expression}
      data-state={state}
      viewBox="0 0 320 300"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={furId} cx="50%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fb9150" />
          <stop offset="1" stopColor="#e8742c" />
        </radialGradient>
        {/* telinga: ujung cokelat tua, sisanya oranye */}
        <linearGradient id={earId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a2f1e" />
          <stop offset="0.3" stopColor="#4a2f1e" />
          <stop offset="0.32" stopColor="#e8742c" />
          <stop offset="1" stopColor="#e8742c" />
        </linearGradient>
      </defs>

      <g className="fox-body">
        <g className="tail">
          <path
            d="M196 236 C262 236 282 170 244 126"
            fill="none"
            stroke={fur}
            strokeWidth="46"
            strokeLinecap="round"
          />
          <path
            d="M257 102 C282 115 280 145 252 154 C236 149 229 136 231 122 C237 111 246 105 257 102 Z"
            fill="#fff"
          />
        </g>

        <ellipse cx="150" cy="238" rx="56" ry="54" fill={fur} />
        <ellipse cx="150" cy="226" rx="34" ry="36" fill="#fff" />
        <ellipse cx="124" cy="284" rx="16" ry="10" fill="#4a2f1e" />
        <ellipse cx="176" cy="284" rx="16" ry="10" fill="#4a2f1e" />

        <g className="head">
          <g className="ear-l">
            <path d="M106 116 C94 104 88 76 84 51 Q83 46 88 49 C109 62 126 80 142 96 C129 101 116 109 106 116 Z" fill={`url(#${earId})`} />
            <path d="M108 107 C101 95 98 79 96 66 Q112 77 130 94 C120 98 113 102 108 107 Z" fill="#fff3e0" />
          </g>
          <g className="ear-r">
            <path d="M194 116 C206 104 212 76 216 51 Q217 46 212 49 C191 62 174 80 158 96 C171 101 184 109 194 116 Z" fill={`url(#${earId})`} />
            <path d="M192 107 C199 95 202 79 204 66 Q188 77 170 94 C180 98 187 102 192 107 Z" fill="#fff3e0" />
          </g>
          <ellipse cx="150" cy="140" rx="62" ry="52" fill={fur} />
          <path
            className="fox-tuft"
            d="M135 97 Q142 87 150 97 Q158 87 165 97"
            fill="none"
            stroke="#cf6426"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M96 150 Q110 176 150 178 Q190 176 204 150 Q192 190 150 194 Q108 190 96 150 Z"
            fill="#fff"
          />
          <ellipse className="fox-cheek" cx="96" cy="156" rx="12" ry="7" fill="#ff8fa8" opacity=".56" />
          <ellipse className="fox-cheek" cx="204" cy="156" rx="12" ry="7" fill="#ff8fa8" opacity=".56" />
          <ellipse cx="136" cy="164" rx="17" ry="12" fill="#fffaf0" />
          <ellipse cx="164" cy="164" rx="17" ry="12" fill="#fffaf0" />
          <Eyes expression={expression} lx={122} rx={178} y={134} s={0.55} />
          <ellipse cx="150" cy="154" rx="8" ry="6" fill="#3a2418" />
          <circle cx="153" cy="152" r="1.8" fill="#fff" opacity=".8" />
          <AnimalMouth expression={expression} x={150} y={158} s={0.8} />
        </g>
      </g>

      <g className="bush">
        <path
          className="bush-body"
          d="M0 300 L0 263 C0 236 22 214 51 214 C58 187 86 176 109 192 C125 167 158 163 180 189 C207 172 237 183 247 210 C282 201 315 221 320 254 L320 300 Z"
          fill={P.matcha700}
        />
        <g className="bush-leaf bush-leaf-1">
          <ellipse cx="112" cy="214" rx="22" ry="14" fill={P.matcha500} transform="rotate(-24 112 214)" />
        </g>
        <g className="bush-leaf bush-leaf-2">
          <ellipse cx="190" cy="218" rx="20" ry="13" fill={P.matcha500} transform="rotate(18 190 218)" />
        </g>
        <g className="bush-leaf bush-leaf-3">
          <ellipse cx="58" cy="232" rx="16" ry="11" fill={P.matcha500} transform="rotate(-32 58 232)" />
        </g>
        <g className="bush-leaf bush-leaf-4">
          <ellipse cx="252" cy="238" rx="16" ry="11" fill={P.matcha500} transform="rotate(28 252 238)" />
        </g>
        <g className="bush-leaf bush-leaf-5">
          <ellipse cx="150" cy="248" rx="18" ry="12" fill={P.matcha500} transform="rotate(-8 150 248)" />
        </g>
      </g>
    </svg>
  );
}
