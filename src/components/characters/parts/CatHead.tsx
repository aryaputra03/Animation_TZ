import type { CatAccessory, Expression } from "../Character.types";
import { Eyes } from "./Eyes";
import { BaristaHat, KidsHat } from "./Hats";

const MOUTH_INK = "#7a3b12";
const MOUTH_IN = "#8a2f45";

function Nose() {
  return (
    <path d="M141 172 Q150 167 159 172 Q150 184 141 172 Z" fill="#ff7a9c" />
  );
}

function Mouth({ expression }: { expression: Expression }) {
  switch (expression) {
    case "cheer":
      return (
        <>
          <Nose />
          <path d="M137 184 Q150 203 163 184 Z" fill={MOUTH_IN} />
          <path
            d="M144 193 Q150 198 156 193 Q150 190 144 193 Z"
            fill="#ff8fa8"
          />
        </>
      );
    case "happy":
    case "lebay":
      return (
        <>
          <Nose />
          <path d="M133 184 Q150 210 167 184 Z" fill={MOUTH_IN} />
          <path
            d="M142 197 Q150 204 158 197 Q150 193 142 197 Z"
            fill="#ff8fa8"
          />
        </>
      );
    case "surprised":
      return (
        <>
          <Nose />
          <ellipse cx="150" cy="194" rx="8" ry="11" fill={MOUTH_IN} />
        </>
      );
    case "sleepy":
      return (
        <>
          <Nose />
          <path
            d="M141 190 h18"
            stroke={MOUTH_INK}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </>
      );
    case "love":
    case "purr":
      return (
        <>
          <Nose />
          <path
            d="M150 181 Q150 196 134 190 M150 181 Q150 196 166 190"
            fill="none"
            stroke={MOUTH_INK}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </>
      );
    default:
      return (
        <>
          <Nose />
          <g
            className="lip"
            stroke={MOUTH_INK}
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          >
            <path d="M150 181 Q150 192 138 193" />
            <path d="M150 181 Q150 192 162 193" />
          </g>
        </>
      );
  }
}

interface CatHeadProps {
  expression: Expression;
  /** Nilai fill gradien bulu, contoh "url(#furX)". */
  fur: string;
  accessory: CatAccessory;
}

/** Kepala kucing (koordinat viewBox 300 x 330). Dipakai oleh kucing besar dan kucing yang mengintip. */
export function CatHead({ expression, fur, accessory }: CatHeadProps) {
  const hat = accessory !== "none";
  const bigCheeks =
    expression === "happy" ||
    expression === "cheer" ||
    expression === "love" ||
    expression === "lebay";
  const cheekOpacity = bigCheeks ? 0.9 : 0.6;

  return (
    <g className="head">
      <g className="ear-l">
        <path d="M80 112 L68 48 L124 86 Z" fill="#f59a3c" />
        <path d="M86 98 L81 66 L109 86 Z" fill="#ffb6c8" />
      </g>
      <g className="ear-r">
        <path d="M220 112 L232 48 L176 86 Z" fill="#f59a3c" />
        <path d="M214 98 L219 66 L191 86 Z" fill="#ffb6c8" />
      </g>
      <ellipse cx="150" cy="152" rx="90" ry="78" fill={fur} />
      {!hat && (
        <path
          d="M150 76 L150 96 M131 79 L136 95 M169 79 L164 95"
          stroke="#d9771e"
          strokeWidth="6"
          strokeLinecap="round"
        />
      )}
      <ellipse cx="150" cy="180" rx="32" ry="22" fill="#fff3e0" />
      <ellipse
        cx="90"
        cy="180"
        rx="15"
        ry="9"
        fill="#ff8fa8"
        opacity={cheekOpacity}
      />
      <ellipse
        cx="210"
        cy="180"
        rx="15"
        ry="9"
        fill="#ff8fa8"
        opacity={cheekOpacity}
      />

      {expression === "surprised" && (
        <g stroke="#b45f12" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M96 106 Q112 94 130 102" />
          <path d="M204 106 Q188 94 170 102" />
        </g>
      )}

      <Eyes expression={expression} lx={118} rx={182} y={150} />
      <Mouth expression={expression} />
      <g
        stroke={MOUTH_INK}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity=".55"
      >
        <path d="M70 176 L98 180 M68 190 L97 188" />
        <path d="M230 176 L202 180 M232 190 L203 188" />
      </g>

      {accessory === "barista" && <BaristaHat />}
      {accessory === "kids" && <KidsHat />}
    </g>
  );
}
