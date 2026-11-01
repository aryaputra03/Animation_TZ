import { GAME_COPY } from "@/content/games";

/** Small vector gift sticker shown after the coffee-bean game is won. */
export function CappuccinoSticker() {
  return (
    <svg
      viewBox="0 0 180 150"
      role="img"
      aria-label={GAME_COPY.coffeeBeans.stickerLabel}
      className="h-40 w-44 overflow-visible drop-shadow-[0_5px_0_rgba(74,47,30,0.12)]"
    >
      <defs>
        <linearGradient id="cappuccinoCup" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fff5dc" />
          <stop offset="0.72" stopColor="#f4d6a4" />
          <stop offset="1" stopColor="#d99a5e" />
        </linearGradient>
        <linearGradient id="cappuccinoCoffee" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#c77a3e" />
          <stop offset="1" stopColor="#7f4024" />
        </linearGradient>
      </defs>
      <path d="M139 68 C174 58 177 108 142 112" fill="#f4d6a4" stroke="#4a2f1e" strokeWidth="8" />
      <path d="M145 75 C164 70 164 98 145 103" fill="none" stroke="#fff5dc" strokeWidth="7" strokeLinecap="round" />
      <path d="M39 98 C12 89 13 119 39 121" fill="#f4d6a4" stroke="#4a2f1e" strokeWidth="7" />
      <path d="M25 101 Q33 99 37 108" fill="none" stroke="#fff5dc" strokeWidth="4" strokeLinecap="round" />
      <path d="M56 132 Q52 150 68 151 Q82 150 78 136 M101 136 Q97 151 114 151 Q129 149 121 130" fill="#e6b274" stroke="#4a2f1e" strokeWidth="5" />
      <path d="M31 56 Q31 37 90 34 Q149 37 149 56 L142 116 Q139 143 90 146 Q41 143 38 116 Z" fill="url(#cappuccinoCup)" stroke="#4a2f1e" strokeWidth="5" strokeLinejoin="round" />
      <path d="M36 68 Q90 82 144 68 L142 80 Q90 94 38 80Z" fill="#e8ad70" opacity="0.9" />
      <ellipse cx="90" cy="56" rx="63" ry="22" fill="#f7e1bb" stroke="#4a2f1e" strokeWidth="5" />
      <ellipse cx="90" cy="55" rx="56" ry="16" fill="url(#cappuccinoCoffee)" stroke="#bd7845" strokeWidth="3" />
      <ellipse cx="90" cy="54" rx="46" ry="11" fill="#d99b62" opacity="0.85" />
      <path d="M90 47 C77 33 66 46 90 64 C114 46 103 33 90 47Z" fill="#fff5dc" />
      <path d="M89 62 C72 51 68 43 75 41 M91 62 C108 51 112 43 105 41 M90 64 C84 54 83 48 85 44 M90 64 C96 54 97 48 95 44" fill="none" stroke="#fff5dc" strokeWidth="3" strokeLinecap="round" />
      <path d="M58 82 Q68 72 78 81 M102 81 Q112 72 122 82" fill="none" stroke="#4a2f1e" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="68" cy="94" rx="11" ry="14" fill="#4a2f1e" />
      <ellipse cx="112" cy="94" rx="11" ry="14" fill="#4a2f1e" />
      <ellipse cx="68" cy="94" rx="7" ry="10" fill="#211a19" />
      <ellipse cx="112" cy="94" rx="7" ry="10" fill="#211a19" />
      <circle cx="65" cy="89" r="4" fill="#fff" />
      <circle cx="109" cy="89" r="4" fill="#fff" />
      <circle cx="72" cy="99" r="2" fill="#c77a3e" />
      <circle cx="116" cy="99" r="2" fill="#c77a3e" />
      <ellipse cx="51" cy="107" rx="8" ry="5" fill="#f28c96" opacity="0.8" />
      <ellipse cx="129" cy="107" rx="8" ry="5" fill="#f28c96" opacity="0.8" />
      <path d="M81 105 Q90 101 99 105 L98 114 Q90 124 82 114Z" fill="#b83c50" stroke="#4a2f1e" strokeWidth="3" strokeLinejoin="round" />
      <path d="M84 110 Q90 107 96 110 Q92 116 86 114Z" fill="#ff9da8" />
      <path d="M25 38 L29 47 L38 50 L29 54 L25 63 L21 54 L12 50 L21 47Z" fill="#f5c85b" stroke="#fff8e7" strokeWidth="2" strokeLinejoin="round" />
      <path d="M152 30 L155 37 L162 40 L155 43 L152 50 L149 43 L142 40 L149 37Z" fill="#f28caa" stroke="#fff8e7" strokeWidth="2" strokeLinejoin="round" />
      <path d="M27 130 L30 136 L36 139 L30 142 L27 148 L24 142 L18 139 L24 136Z" fill="#82cdbc" stroke="#fff8e7" strokeWidth="2" strokeLinejoin="round" />
      <path d="M154 122 L157 128 L163 131 L157 134 L154 140 L151 134 L145 131 L151 128Z" fill="#f28caa" stroke="#fff8e7" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
