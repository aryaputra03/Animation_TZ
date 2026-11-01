import { useId } from "react";
import { P } from "@/core/palette";
import type { CatAccessory, Expression } from "./Character.types";
import { CatHead } from "./parts/CatHead";
import { Zzz } from "./parts/Zzz";

interface CatProps {
  expression?: Expression;
  accessory?: CatAccessory;
  className?: string;
}

/**
 * Kucing oren seluruh badan (gaya stiker, tanpa outline). Murni tampilan: semua perilaku
 * (ketuk, elus, tidur) ada di InteractiveCat. Kepalanya dipakai bersama CatLookout.
 */
export function Cat({
  expression = "idle",
  accessory = "none",
  className = "",
}: CatProps) {
  const gradientId = `fur${useId().replace(/:/g, "")}`;
  const fur = `url(#${gradientId})`;

  return (
    <svg
      className={`cat-svg ${className}`}
      data-expr={expression}
      viewBox="0 0 300 330"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="35%" r="70%">
          <stop offset="0" stopColor="#ffc884" />
          <stop offset="1" stopColor="#f59a3c" />
        </radialGradient>
      </defs>

      {/* ekor belang */}
      <g className="tail">
        <path
          d="M214 290 C292 296 304 214 262 196"
          fill="none"
          stroke="#f59a3c"
          strokeWidth="26"
          strokeLinecap="round"
        />
        <path
          d="M214 290 C292 296 304 214 262 196"
          fill="none"
          stroke="#d9771e"
          strokeWidth="26"
          strokeDasharray="5 24"
          opacity=".75"
        />
      </g>

      {/* badan */}
      <g className="body">
        <ellipse cx="90" cy="298" rx="28" ry="20" fill={fur} />
        <ellipse cx="210" cy="298" rx="28" ry="20" fill={fur} />
        <ellipse cx="150" cy="252" rx="80" ry="68" fill={fur} />
        <ellipse cx="150" cy="268" rx="44" ry="46" fill="#fff3e0" />
        <path
          d="M82 232 l14 6 M80 252 l16 4 M218 232 l-14 6 M220 252 l-16 4"
          stroke="#d9771e"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>

      {/* celemek barista */}
      {accessory === "barista" && (
        <g>
          <path
            d="M114 222 L186 222 L204 304 Q150 322 96 304 Z"
            fill={P.matcha500}
          />
          <path
            d="M118 220 L150 238 L182 220"
            fill="none"
            stroke={P.matcha700}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <rect
            x="128"
            y="268"
            width="44"
            height="26"
            rx="8"
            fill={P.cream50}
            opacity=".92"
          />
          <path
            d="M150 288 C139 281 139 273 145 273 C148 273 150 275 150 277 C150 275 152 273 155 273 C161 273 161 281 150 288 Z"
            fill={P.blush300}
          />
        </g>
      )}

      {/* kaki depan */}
      <g>
        <ellipse cx="120" cy="300" rx="22" ry="17" fill={fur} />
        <ellipse cx="180" cy="300" rx="22" ry="17" fill={fur} />
        <path
          d="M114 290 L114 298 M123 289 L123 298 M177 289 L177 298 M186 290 L186 298"
          stroke="#d9771e"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      <CatHead expression={expression} fur={fur} accessory={accessory} />

      {expression === "sleepy" && <Zzz />}
    </svg>
  );
}
