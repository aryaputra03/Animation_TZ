import { useId } from "react";
import { P } from "@/core/palette";

/** Topi barista kecil. Digambar dalam koordinat kepala kucing (viewBox 300 x 330). */
export function BaristaHat() {
  return (
    <g>
      <ellipse cx="150" cy="82" rx="42" ry="11" fill={P.cream50} />
      <path d="M114 82 Q110 40 150 42 Q190 40 186 82 Z" fill={P.cream50} />
      <path
        d="M117 72 Q150 80 183 72"
        fill="none"
        stroke={P.matcha500}
        strokeWidth="6"
        strokeLinecap="round"
      />
    </g>
  );
}

/** Topi baling-baling anak-anak: kubah empat warna dengan baling-baling yang berputar. */
export function KidsHat() {
  const clipId = `hat${useId().replace(/:/g, "")}`;
  return (
    <g className="kids-hat">
      <clipPath id={clipId}>
        <path d="M106 88 Q102 42 150 40 Q198 42 194 88 Z" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <rect x="100" y="36" width="25" height="56" fill={P.matcha500} />
        <rect x="125" y="36" width="25" height="56" fill={P.cream50} />
        <rect x="150" y="36" width="25" height="56" fill={P.blush300} />
        <rect x="175" y="36" width="25" height="56" fill={P.sun400} />
      </g>
      <rect x="102" y="80" width="96" height="13" rx="6.5" fill={P.matcha700} />
      <rect x="147" y="28" width="6" height="14" rx="3" fill={P.coffee800} />
      <g className="propeller">
        <ellipse cx="136" cy="27" rx="15" ry="4.5" fill={P.blush300} />
        <ellipse cx="164" cy="27" rx="15" ry="4.5" fill={P.sun400} />
      </g>
      <circle cx="150" cy="27" r="3.5" fill={P.coffee800} />
    </g>
  );
}
