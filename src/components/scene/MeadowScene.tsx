import { P } from "@/core/palette";
import { Cloud, Flower, Hill, Land } from "./parts";

const FLOWERS = [
  { x: 36, y: 352, c: P.blush300 },
  { x: 78, y: 376, c: P.sun400 },
  { x: 128, y: 346, c: P.cream50 },
  { x: 176, y: 384, c: P.blush300 },
  { x: 228, y: 352, c: P.sun400 },
  { x: 272, y: 380, c: P.cream50 },
  { x: 322, y: 348, c: P.blush300 },
  { x: 366, y: 376, c: P.sun400 },
  { x: 14, y: 392, c: P.cream50 },
  { x: 204, y: 404, c: P.sun400 },
  { x: 300, y: 402, c: P.blush300 },
  { x: 110, y: 412, c: P.blush300 },
];

const TUFTS = [20, 64, 110, 152, 198, 244, 290, 336, 382].map((x, i) => ({
  x,
  y: 332 + (i % 3) * 26,
}));

/** Padang rumput di pagi hari: matahari, awan, bukit hijau muda, bunga. */
export function MeadowScene() {
  return (
    <>
      <div className="sun" style={{ left: "12%", top: "11%" }} />
      <Cloud top="9%" width={150} duration={90} delay={-12} />
      <Cloud top="20%" width={110} duration={120} delay={-60} />
      <Cloud top="31%" width={90} duration={150} delay={-100} />
      <Land>
        <Hill
          d="M0 250 C70 205 140 215 210 235 S340 205 400 230 V520 H0Z"
          fill={P.sage300}
        />
        <Hill
          d="M0 292 C90 252 170 286 250 264 S360 256 400 276 V520 H0Z"
          fill={P.matcha300}
        />
        <Hill
          d="M0 332 C110 302 200 336 300 312 S380 306 400 320 V520 H0Z"
          fill={P.matcha500}
        />
        <Hill
          d="M0 384 C100 362 220 388 400 364 V520 H0Z"
          fill={P.matcha700}
          opacity={0.5}
        />
        {TUFTS.map((t) => (
          <path
            key={t.x}
            d={`M${t.x} ${t.y} l-4 -11 M${t.x} ${t.y} l0 -14 M${t.x} ${t.y} l4 -11`}
            stroke={P.matcha700}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        ))}
        {FLOWERS.map((f) => (
          <Flower key={`${f.x}-${f.y}`} x={f.x} y={f.y} color={f.c} />
        ))}
      </Land>
    </>
  );
}
