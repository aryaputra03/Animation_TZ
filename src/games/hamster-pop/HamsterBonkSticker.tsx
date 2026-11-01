import { GAME_COPY } from "@/content/games";
import { Hamster } from "@/components/characters/Hamster";

/** Static comedic win sticker for the hamster game. */
export function HamsterBonkSticker() {
  return (
    <div
      role="img"
      aria-label={GAME_COPY.hamsterPop.stickerLabel}
      className="hamster-bonk-sticker relative h-36 w-36 drop-shadow-[0_5px_0_rgba(74,47,30,0.14)]"
    >
      <span className="absolute inset-0">
        <Hamster expression="hurt" />
      </span>
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <path
          d="M91 52 C87 45 91 37 99 35 C103 27 115 27 121 33 C131 32 137 41 133 50 C134 59 123 64 114 61 C103 66 93 62 91 52Z"
          fill="#f8b4c0"
          stroke="#4a2f1e"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path d="M102 43 Q108 37 114 42 M120 47 Q125 43 129 46" fill="none" stroke="#fff8e7" strokeWidth="3" strokeLinecap="round" />

        <path d="M133 48 L160 20" fill="none" stroke="#fff8e7" strokeWidth="14" strokeLinecap="round" />
        <path d="M133 48 L160 20" fill="none" stroke="#8b5e3c" strokeWidth="8" strokeLinecap="round" />
        <path
          d="M111 35 L123 23 Q126 20 130 24 L147 41 Q151 45 147 49 L135 61Z"
          fill="#8b5e3c"
          stroke="#4a2f1e"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path d="M124 30 L143 49" fill="none" stroke="#f6e7c1" strokeWidth="4" strokeLinecap="round" />

        <path d="M78 30 L70 23 M76 43 L65 42 M137 58 L145 64" fill="none" stroke="#ffc94a" strokeWidth="4" strokeLinecap="round" />
        <path d="M82 65 L86 72 L94 74 L86 77 L82 85 L79 77 L71 74 L79 72Z" fill="#ffc94a" stroke="#fff8e7" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
