import { useId } from "react";
import type { Expression } from "./Character.types";
import { AnimalMouth } from "./parts/AnimalMouth";
import { Eyes } from "./parts/Eyes";

interface Props {
  expression?: Expression;
  /** Pipi menggembung besar. */
  puffed?: boolean;
}

/** Hamster gemuk bergaya stiker. Kaki (leg-l, leg-r) dianimasikan CSS sesuai kecepatan roda. */
export function Hamster({ expression = "idle", puffed = false }: Props) {
  const gradientId = `ham${useId().replace(/:/g, "")}`;
  const fur = `url(#${gradientId})`;

  return (
    <svg
      className="cat-svg hamster block h-auto w-full"
      data-expr={expression}
      data-puffed={puffed}
      viewBox="0 0 200 200"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fbe0b0" />
          <stop offset="1" stopColor="#f2c98a" />
        </radialGradient>
      </defs>

      <g className="body">
        <ellipse cx="100" cy="146" rx="68" ry="50" fill={fur} />
        <ellipse cx="100" cy="164" rx="40" ry="30" fill="#fff1d6" />
        <ellipse
          cx="126"
          cy="130"
          rx="16"
          ry="10"
          fill="#e0a96b"
          opacity=".7"
        />
      </g>

      <g className="legs">
        <ellipse
          className="leg-l"
          cx="72"
          cy="190"
          rx="16"
          ry="10"
          fill="#f7d9a6"
        />
        <ellipse
          className="leg-r"
          cx="128"
          cy="190"
          rx="16"
          ry="10"
          fill="#f7d9a6"
        />
      </g>

      <g className="head">
        <g className="ear-l">
          <circle cx="54" cy="52" r="17" fill={fur} />
          <circle cx="54" cy="54" r="9" fill="#ffb6c8" />
        </g>
        <g className="ear-r">
          <circle cx="146" cy="52" r="17" fill={fur} />
          <circle cx="146" cy="54" r="9" fill="#ffb6c8" />
        </g>
        <ellipse cx="100" cy="98" rx="64" ry="54" fill={fur} />
        <ellipse cx="100" cy="58" rx="14" ry="8" fill="#e0a96b" opacity=".8" />
        <ellipse
          className="cheek"
          cx="52"
          cy="118"
          rx="22"
          ry="18"
          fill="#fff1d6"
        />
        <ellipse
          className="cheek"
          cx="148"
          cy="118"
          rx="22"
          ry="18"
          fill="#fff1d6"
        />
        <ellipse cx="50" cy="122" rx="10" ry="6" fill="#ff8fa8" opacity=".6" />
        <ellipse cx="150" cy="122" rx="10" ry="6" fill="#ff8fa8" opacity=".6" />
        <Eyes expression={expression} lx={74} rx={126} y={96} s={0.6} />
        <ellipse className="nose" cx="100" cy="112" rx="7" ry="5" fill="#ff7a9c" />
        <AnimalMouth expression={expression} x={100} y={116} s={0.8} />
        <g stroke="#7a3b12" strokeWidth="2" strokeLinecap="round" opacity=".5">
          <path d="M60 112 L82 116 M60 124 L82 122" />
          <path d="M140 112 L118 116 M140 124 L118 122" />
        </g>
      </g>
    </svg>
  );
}
