import type { ReactNode } from "react";
import { P } from "@/core/palette";

/** Bingkai SVG lanskap: menempel di dasar layar dan memotong sisi kiri-kanan (slice). */
export function Land({ children }: { children: ReactNode }) {
  return (
    <svg
      className="scene-land"
      viewBox="0 0 400 420"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** Bukit: path harus berakhir di V520 agar menutup sampai dasar layar. */
export function Hill({
  d,
  fill,
  opacity = 1,
}: {
  d: string;
  fill: string;
  opacity?: number;
}) {
  return <path d={d} fill={fill} opacity={opacity} />;
}

interface TreeProps {
  x: number;
  y: number;
  s?: number;
  fill: string;
  trunk?: string;
}

export function Pine({ x, y, s = 1, fill, trunk = P.coffee500 }: TreeProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-4" y="30" width="8" height="16" rx="2" fill={trunk} />
      <path
        d="M0 -62 L22 -22 H-22Z M0 -40 L28 6 H-28Z M0 -16 L34 36 H-34Z"
        fill={fill}
      />
    </g>
  );
}

export function RoundTree({
  x,
  y,
  s = 1,
  fill,
  trunk = P.coffee500,
}: TreeProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-5" y="4" width="10" height="42" rx="3" fill={trunk} />
      <circle cx="0" cy="-8" r="30" fill={fill} />
      <circle cx="-20" cy="8" r="20" fill={fill} />
      <circle cx="20" cy="8" r="20" fill={fill} />
    </g>
  );
}

export function Flower({
  x,
  y,
  color,
}: {
  x: number;
  y: number;
  color: string;
}) {
  return (
    <g>
      <path
        d={`M${x} ${y} v16`}
        stroke={P.matcha700}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx={x} cy={y} r="5" fill={color} />
      <circle
        cx={x}
        cy={y}
        r="2"
        fill={color === P.sun400 ? P.cream50 : P.sun400}
      />
    </g>
  );
}

export function Mushroom({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-2.5" y="0" width="5" height="9" rx="2" fill={P.cream50} />
      <path d="M-9 1 Q0 -14 9 1Z" fill={P.blush300} />
    </g>
  );
}

interface DriftProps {
  top: string;
  width: number;
  /** Lama melintasi layar (detik). */
  duration: number;
  /** Negatif supaya posisi awalnya tersebar. */
  delay: number;
}

/** Awan: melintas pelan dari kiri ke kanan (animasi CSS, hanya transform). */
export function Cloud({
  top,
  width,
  duration,
  delay,
  tint = P.cream50,
}: DriftProps & { tint?: string }) {
  return (
    <svg
      className="drift"
      viewBox="0 0 120 50"
      aria-hidden="true"
      style={{
        top,
        width,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
    >
      <g fill={tint}>
        <ellipse cx="40" cy="32" rx="34" ry="16" />
        <ellipse cx="70" cy="24" rx="30" ry="20" />
        <ellipse cx="94" cy="34" rx="24" ry="13" />
      </g>
    </svg>
  );
}

/** Burung kecil yang melintas. */
export function Bird({ top, width, duration, delay }: DriftProps) {
  return (
    <svg
      className="drift"
      viewBox="0 0 24 10"
      aria-hidden="true"
      style={{
        top,
        width,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
    >
      <path
        d="M1 8 Q6 0 12 6 Q18 0 23 8"
        fill="none"
        stroke={P.coffee800}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
