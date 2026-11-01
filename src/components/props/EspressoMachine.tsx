import { P } from "@/core/palette";

/**
 * Mesin espresso mungil di atas meja barista. Tidak interaktif, tapi hidup:
 * jarum tekanan naik-turun, lampu berkedip, dan kopi menetes dari corong.
 */
export function EspressoMachine() {
  return (
    <svg
      viewBox="0 0 100 120"
      className="machine block w-full overflow-visible"
      aria-hidden="true"
    >
      <g
        className="steam"
        fill="none"
        stroke={P.cream50}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.8"
      >
        <path d="M64 56 q-6 -8 0 -15 q6 -7 0 -14" />
        <path d="M74 56 q-6 -8 0 -15 q6 -7 0 -14" />
      </g>
      <rect x="8" y="14" width="84" height="84" rx="12" fill={P.sage600} />
      <rect x="4" y="6" width="92" height="22" rx="10" fill={P.matcha700} />

      {/* alat ukur tekanan */}
      <circle cx="30" cy="48" r="13" fill={P.cream50} />
      <path
        d="M22.6 43.8 L20.5 42.5 M25.8 40.6 L24.5 38.5 M30 39.5 L30 37 M34.3 40.6 L35.5 38.5 M37.4 43.8 L39.5 42.5"
        stroke={P.coffee500}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        className="needle"
        d="M30 48 L30 40"
        stroke={P.coffee800}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="30" cy="48" r="2.5" fill={P.coffee800} />

      {/* lampu dan tombol */}
      <circle className="light" cx="58" cy="42" r="4" fill={P.sun400} />
      <circle cx="74" cy="42" r="4" fill={P.cream200} />

      {/* corong, tetesan, dan nampan */}
      <rect x="56" y="62" width="22" height="14" rx="4" fill={P.cream200} />
      <circle className="drip" cx="67" cy="79" r="2.2" fill={P.coffee500} />
      <rect x="14" y="98" width="72" height="12" rx="5" fill={P.coffee800} />
    </svg>
  );
}
