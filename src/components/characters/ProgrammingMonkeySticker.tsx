interface ProgrammingMonkeyStickerProps {
  className?: string;
  label: string;
}

/** Sticker SVG primata yang fokus mengerjakan soal programming. */
export function ProgrammingMonkeySticker({ className = '', label }: ProgrammingMonkeyStickerProps) {
  return (
    <svg
      viewBox="0 0 220 210"
      role="img"
      aria-label={label}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M47 177c-9-10-11-26-3-35 8-9 20-7 28 2l9 13m85-2 10-13c8-9 20-11 28-2s6 25-3 35" fill="none" stroke="#4a2f1e" strokeWidth="17" strokeLinecap="round" />
      <path d="M47 177c-9-10-11-26-3-35 8-9 20-7 28 2l9 13m85-2 10-13c8-9 20-11 28-2s6 25-3 35" fill="none" stroke="#a9653d" strokeWidth="11" strokeLinecap="round" />
      <ellipse cx="110" cy="151" rx="49" ry="43" fill="#a9653d" stroke="#4a2f1e" strokeWidth="4" />
      <ellipse cx="110" cy="153" rx="26" ry="29" fill="#f1c791" />

      <circle cx="53" cy="66" r="26" fill="#a9653d" stroke="#4a2f1e" strokeWidth="4" />
      <circle cx="167" cy="66" r="26" fill="#a9653d" stroke="#4a2f1e" strokeWidth="4" />
      <circle cx="53" cy="66" r="13" fill="#f8b4c0" />
      <circle cx="167" cy="66" r="13" fill="#f8b4c0" />
      <ellipse cx="110" cy="77" rx="60" ry="58" fill="#a9653d" stroke="#4a2f1e" strokeWidth="4" />
      <path d="M93 27c-2-14 8-20 17-6 9-14 19-8 17 6-8-5-11-3-17 4-6-7-9-9-17-4Z" fill="#7d452d" stroke="#4a2f1e" strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="110" cy="91" rx="40" ry="34" fill="#f1c791" />

      <path d="m72 69 17-6m42 6 17-6" fill="none" stroke="#4a2f1e" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="86" cy="82" rx="8" ry="10" fill="#fff8e7" />
      <ellipse cx="134" cy="82" rx="8" ry="10" fill="#fff8e7" />
      <circle cx="89" cy="86" r="5" fill="#1f3a2b" />
      <circle cx="137" cy="86" r="5" fill="#1f3a2b" />
      <circle cx="90" cy="84" r="1.8" fill="#fff8e7" />
      <circle cx="138" cy="84" r="1.8" fill="#fff8e7" />
      <circle cx="86" cy="82" r="14" fill="none" stroke="#4a2f1e" strokeWidth="3" />
      <circle cx="134" cy="82" r="14" fill="none" stroke="#4a2f1e" strokeWidth="3" />
      <path d="M100 82h20" stroke="#4a2f1e" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="110" cy="97" rx="6" ry="4.5" fill="#7d452d" />
      <path d="M110 102c-2 6-8 6-11 4m11-4c2 6 8 6 11 4" fill="none" stroke="#4a2f1e" strokeWidth="3" strokeLinecap="round" />
      <path d="M108 106c0 6 7 7 9 3 2-4-2-6-9-6Z" fill="#f28da0" />
      <ellipse cx="71" cy="101" rx="8" ry="5" fill="#f8b4c0" opacity=".85" />
      <ellipse cx="149" cy="101" rx="8" ry="5" fill="#f8b4c0" opacity=".85" />

      <path d="M75 132c-2 11 3 17 12 20m58-20c2 11-3 17-12 20" fill="none" stroke="#4a2f1e" strokeWidth="12" strokeLinecap="round" />
      <path d="M75 132c-2 11 3 17 12 20m58-20c2 11-3 17-12 20" fill="none" stroke="#a9653d" strokeWidth="7" strokeLinecap="round" />
      <rect x="61" y="132" width="98" height="43" rx="7" fill="#7cb342" stroke="#4a2f1e" strokeWidth="4" />
      <rect x="67" y="138" width="86" height="31" rx="3" fill="#dcedc8" />
      <path d="m88 148-7 6 7 6m12-12 7 6-7 6m18-12-5 12" fill="none" stroke="#4e7a2a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m48 177 124 0 18 16c-42 11-118 11-160 0Z" fill="#8b5e3c" stroke="#4a2f1e" strokeWidth="4" strokeLinejoin="round" />
      <path d="M79 178v6m14-6v6m14-6v6m14-6v6m14-6v6" stroke="#f6e7c1" strokeWidth="3" strokeLinecap="round" />
      <path d="m183 35 4 9 9 4-9 4-4 9-4-9-9-4 9-4Z" fill="#ffc94a" stroke="#8b5e3c" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
