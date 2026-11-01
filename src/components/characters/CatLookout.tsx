import { useId } from "react";
import type { Expression } from "./Character.types";
import { CatHead } from "./parts/CatHead";
import { Zzz } from "./parts/Zzz";

interface Props {
  expression?: Expression;
  className?: string;
}

/**
 * Kucing yang mengintip dari tepi layar: hanya kepala dan dua tangan yang memegang tepi.
 * Letakkan dengan sebagian bawahnya keluar dari layar. Kepalanya sama dengan kucing besar.
 */
export function CatLookout({ expression = "cheer", className = "" }: Props) {
  const gradientId = `fur${useId().replace(/:/g, "")}`;
  const fur = `url(#${gradientId})`;

  return (
    <svg
      className={`cat-svg lookout ${className}`}
      data-expr={expression}
      viewBox="40 40 220 232"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="35%" r="70%">
          <stop offset="0" stopColor="#ffc884" />
          <stop offset="1" stopColor="#f59a3c" />
        </radialGradient>
      </defs>

      <CatHead expression={expression} fur={fur} accessory="none" />

      {/* kedua tangan memegang tepi layar */}
      <g className="paw-l">
        <ellipse cx="124" cy="238" rx="21" ry="18" fill={fur} />
        <path
          d="M118 228 L118 236 M127 227 L127 236"
          stroke="#d9771e"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="124" cy="245" r="5" fill="#ff9db3" />
      </g>
      <g className="paw-r">
        <ellipse cx="176" cy="238" rx="21" ry="18" fill={fur} />
        <path
          d="M169 227 L169 236 M178 228 L178 236"
          stroke="#d9771e"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="176" cy="245" r="5" fill="#ff9db3" />
      </g>

      {expression === "sleepy" && <Zzz />}
    </svg>
  );
}
