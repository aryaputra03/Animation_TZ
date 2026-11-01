import { P } from '@/core/palette';
import type { Expression } from '../Character.types';

const INK = '#2b1a2e';

interface EyeProps {
  expression: Expression;
  x: number;
  y: number;
  s: number;
  side: "left" | "right";
}

function Eye({ expression, x, y, s, side }: EyeProps) {
  const t = `translate(${x} ${y}) scale(${s})`;
  switch (expression) {
    case 'happy':
    case 'cheer':
    case 'purr':
      return <path transform={t} d="M-22 7 Q0 -22 22 7" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />;
    case 'sleepy':
      return <path transform={t} d="M-22 -2 Q0 16 22 -2" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />;
    case 'love':
      return <path transform={t} d="M0 18 C-36 -6 -26 -34 0 -14 C26 -34 36 -6 0 18Z" fill="#ff5d8f" />;
    case 'curious': {
      const pupilX = side === 'left' ? 8 : -8;
      return (
        <g transform={t}>
          <ellipse cy={side === 'left' ? 0 : 3} rx="25" ry={side === 'left' ? 30 : 23} fill={INK} />
          <circle cx={pupilX} cy="-11" r="9" fill="#fff" />
          <circle cx={pupilX * 1.8} cy="8" r="4" fill="#fff" />
          <path
            d={side === 'left' ? 'M-22 -35 Q0 -43 19 -34' : 'M-19 -34 Q0 -43 22 -35'}
            fill="none"
            stroke={INK}
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>
      );
    }
    case 'grumpy':
      return (
        <g transform={t}>
          <ellipse cy="4" rx="23" ry="18" fill={INK} />
          <path
            d={side === 'left' ? 'M-25 -25 L3 -16' : 'M-3 -16 L25 -25'}
            fill="none"
            stroke={INK}
            strokeWidth="7"
            strokeLinecap="round"
          />
        </g>
      );
    case 'hurt':
      return (
        <g transform={t}>
          <path
            d="M-20 -3 L-10 -15 L0 -2 L10 -15 L20 -3"
            fill="none"
            stroke={INK}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={side === 'left' ? 'M-28 9 C-38 19 -33 29 -26 25 C-20 21 -23 15 -28 9Z' : 'M28 9 C38 19 33 29 26 25 C20 21 23 15 28 9Z'}
            fill="#8bc9ec"
          />
        </g>
      );
    case 'lebay':
      return (
        <polygon
          transform={t}
          points="0,-30 8,-10 30,-10 12,4 18,26 0,13 -18,26 -12,4 -30,-10 -8,-10"
          fill={P.sun400}
        />
      );
    case 'surprised':
      return (
        <g transform={t}>
          <ellipse rx="29" ry="34" fill={INK} />
          <circle cx="-10" cy="-14" r="12" fill="#fff" />
          <circle cx="11" cy="16" r="5" fill="#fff" />
        </g>
      );
    default:
      return (
        <g transform={t}>
          <ellipse rx="26" ry="30" fill={INK} />
          <g className="glint">
            <circle cx="-9" cy="-12" r="10" fill="#fff" />
          </g>
          <circle cx="10" cy="14" r="5" fill="#fff" />
          <circle cx="6" cy="-24" r="3" fill="#bfe9ff" />
        </g>
      );
  }
}

interface EyesProps {
  expression: Expression;
  /** Posisi tengah mata kiri dan kanan (satuan viewBox). */
  lx: number;
  rx: number;
  y: number;
  /** Skala ukuran mata, bawaan 1. */
  s?: number;
}

/** Mata bergaya sama untuk semua hewan. Hanya mata terbuka (idle) yang berkedip. */
export function Eyes({ expression, lx, rx, y, s = 1 }: EyesProps) {
  return (
    <g className={expression === 'idle' ? 'blink' : undefined}>
      <g className="eye-l">
        <Eye expression={expression} x={lx} y={y} s={s} side="left" />
      </g>
      <g className="eye-r">
        <Eye expression={expression} x={rx} y={y} s={s} side="right" />
      </g>
    </g>
  );
}
