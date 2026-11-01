import { P } from '@/core/palette';

/** Cangkir besar untuk Hero, dibuat dua lapis supaya kucing terlihat "duduk di dalam" cangkir. */

/** Lapis belakang: bayangan, piring, bagian dalam cangkir, dan uap. */
export function CupBack() {
  return (
    <svg viewBox="0 0 300 220" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <ellipse cx="150" cy="198" rx="146" ry="16" fill={P.forest900} opacity="0.18" />
      <ellipse cx="150" cy="192" rx="140" ry="17" fill={P.cream200} />
      <ellipse cx="150" cy="62" rx="124" ry="26" fill={P.coffee500} />
      <g className="steam" fill="none" stroke={P.matcha700} strokeWidth="5" strokeLinecap="round" opacity="0.5">
        <path d="M44 34 q-10 -14 0 -26 q10 -12 0 -26" />
        <path d="M256 34 q10 -14 0 -26 q-10 -12 0 -26" />
      </g>
    </svg>
  );
}

/** Lapis depan: badan cangkir, gagang, dan dua kaki kucing yang memegang bibir cangkir. */
export function CupFront() {
  return (
    <svg
      viewBox="0 0 300 220"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      aria-hidden="true"
    >
      <path d="M268 84 Q324 84 312 128 Q304 160 250 152" fill="none" stroke={P.cream200} strokeWidth="18" strokeLinecap="round" />
      <path d="M268 84 Q324 84 312 128 Q304 160 250 152" fill="none" stroke={P.cream50} strokeWidth="11" strokeLinecap="round" />
      <path
        d="M26 62 Q150 112 274 62 L246 176 Q150 214 54 176 Z"
        fill={P.cream50}
        stroke="rgba(31,58,43,0.16)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M33 112 Q150 160 267 112 L260 140 Q150 186 40 140 Z" fill={P.matcha500} />
      <path d="M50 92 Q66 150 80 184" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity="0.55" />
      <g>
        <ellipse cx="104" cy="84" rx="22" ry="14" fill="#f8a64c" />
        <ellipse cx="196" cy="84" rx="22" ry="14" fill="#f8a64c" />
        <path
          d="M96 76 v8 M104 74 v9 M112 76 v8 M188 76 v8 M196 74 v9 M204 76 v8"
          stroke="#d9771e"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
