import type { CSSProperties } from "react";
import { N } from "@/core/palette";
import { useAppStore } from "@/store/useAppStore";
import { Hill, Land, Pine } from "./parts";

const STAR_COUNT = 45;
const STARS = Array.from({ length: STAR_COUNT }, () => ({
  left: Math.random() * 100,
  top: Math.random() * 50,
  delay: Math.random() * 3,
  duration: 2 + Math.random() * 3,
}));

const FIREFLIES = [
  { l: 8, t: 62, d: 0, fx: 14, fy: -18 },
  { l: 18, t: 74, d: 1.2, fx: -12, fy: -14 },
  { l: 29, t: 58, d: 2.1, fx: 16, fy: -10 },
  { l: 38, t: 70, d: 0.6, fx: -16, fy: -20 },
  { l: 47, t: 80, d: 3.2, fx: 10, fy: -16 },
  { l: 56, t: 64, d: 1.8, fx: -10, fy: -12 },
  { l: 64, t: 76, d: 2.6, fx: 18, fy: -18 },
  { l: 72, t: 60, d: 0.3, fx: -14, fy: -10 },
  { l: 80, t: 72, d: 3.6, fx: 12, fy: -20 },
  { l: 88, t: 66, d: 1.5, fx: -18, fy: -14 },
  { l: 93, t: 82, d: 2.9, fx: 8, fy: -12 },
  { l: 12, t: 86, d: 4.1, fx: 14, fy: -14 },
];

const BACK_PINES = [30, 76, 124, 176, 228, 280, 330, 380];
const FRONT_PINES = [24, 72, 212, 262, 346];

/** Malam berbintang: bintang, kunang-kunang, siluet hutan hijau tua. */
export function NightScene() {
  const perfMode = useAppStore((s) => s.perfMode);
  const stars = STARS.slice(0, perfMode === "low" ? 18 : STAR_COUNT);

  return (
    <>
      {stars.map((s, i) => (
        <span
          key={i}
          className="star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
      {FIREFLIES.map((f) => (
        <span
          key={f.l}
          className="firefly"
          style={
            {
              left: `${f.l}%`,
              top: `${f.t}%`,
              animationDelay: `${f.d}s`,
              "--fx": `${f.fx}px`,
              "--fy": `${f.fy}px`,
            } as CSSProperties
          }
        />
      ))}
      <Land>
        <Hill
          d="M0 262 C90 230 170 250 250 240 S350 225 400 245 V520 H0Z"
          fill={N.far}
        />
        {BACK_PINES.map((x) => (
          <Pine key={x} x={x} y={274} s={0.7} fill={N.mid} trunk={N.trunk} />
        ))}
        <Hill
          d="M0 306 C100 276 200 308 300 288 S380 282 400 296 V520 H0Z"
          fill={N.mid}
        />
        {FRONT_PINES.map((x) => (
          <Pine key={x} x={x} y={322} fill={N.near} trunk={N.trunk} />
        ))}
        <Hill d="M0 360 C120 336 240 366 400 346 V520 H0Z" fill={N.near} />
        <Pine x={40} y={394} s={1.7} fill={N.tree} trunk={N.trunk} />
        <Pine x={360} y={390} s={1.5} fill={N.tree} trunk={N.trunk} />
        <Hill d="M0 410 C140 396 260 414 400 400 V520 H0Z" fill={N.tree} />
      </Land>
    </>
  );
}
