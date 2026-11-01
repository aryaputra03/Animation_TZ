import { GAME_COPY } from "@/content/games";
import { RedPanda } from "@/components/characters/RedPanda";

/** Static win sticker with a focused red panda remembering the cards. */
export function RedPandaMemorySticker() {
  return (
    <div
      role="img"
      aria-label={GAME_COPY.cardMatch.stickerLabel}
      className="red-panda-memory-sticker relative h-40 w-[8.5rem] drop-shadow-[0_5px_0_rgba(74,47,30,0.14)]"
    >
      <span className="absolute inset-0">
        <RedPanda expression="curious" />
      </span>
      <svg
        aria-hidden="true"
        viewBox="0 0 220 260"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <g fill="none" stroke="#4a2f1e" strokeWidth="4">
          <circle cx="84" cy="108" r="17" fill="#fff8e7" fillOpacity="0.18" />
          <circle cx="136" cy="108" r="17" fill="#fff8e7" fillOpacity="0.18" />
          <path d="M101 106 Q110 100 119 106" strokeLinecap="round" />
        </g>
        <path d="M186 68 C186 60 192 56 199 58 C205 60 207 68 203 73 L200 77 H192 L189 73Z" fill="#ffc94a" stroke="#4a2f1e" strokeWidth="3" strokeLinejoin="round" />
        <path d="M193 80 H200 M194 84 H199 M184 61 L180 58 M209 61 L213 57 M195 52 V47" fill="none" stroke="#d6a51c" strokeWidth="3" strokeLinecap="round" />

        <path d="M126 183 Q144 168 161 181 L168 196 Q156 206 143 197 L128 197Z" fill="#c4581e" stroke="#4a2f1e" strokeWidth="3" strokeLinejoin="round" />
        <g transform="rotate(9 181 181)">
          <rect x="157" y="147" width="49" height="68" rx="9" fill="#fff8e7" stroke="#4a2f1e" strokeWidth="4" />
          <rect x="162" y="152" width="39" height="56" rx="5" fill="#f6e7c1" />
          <path d="M181 164 C174 158 169 165 181 176 C193 165 188 158 181 164Z" fill="#8b5e3c" />
          <circle cx="170" cy="192" r="3.5" fill="#7cb342" />
          <circle cx="181" cy="192" r="3.5" fill="#f8b4c0" />
          <circle cx="192" cy="192" r="3.5" fill="#ffc94a" />
        </g>
        <ellipse cx="158" cy="194" rx="15" ry="9" fill="#d96d31" stroke="#4a2f1e" strokeWidth="3" transform="rotate(18 158 194)" />
        <path d="M117 93 L121 86 L125 93 L132 97 L125 100 L121 107 L117 100 L110 97Z" fill="#fff8e7" stroke="#ffc94a" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
