import { useEffect, useRef, useState, type RefObject } from "react";
import { SoundManager } from "@/audio/SoundManager";
import { LABELS } from "@/content/system";
import { say } from "@/core/bubbles";
import { HAPTIC, vibrate } from "@/core/haptics";
import { useLongPress } from "@/core/hooks/useLongPress";
import { P } from "@/core/palette";
import type { CatHandle } from "../characters/Character.types";

/** Tekan-tahan selama ini (ms) untuk menumpahkan kopi. Sengaja di bawah 500 ms agar mendahului menu tekan-lama Android. */
const SPILL_AFTER_MS = 450;
/** Lama animasi tumpah (harus sama dengan durasi `spillCup` di CSS), ditambah sedikit jeda. */
const SPILL_MS = 2400;

/**
 * Cangkir latte di meja.
 * - ketuk: muncul latte art berbentuk hati, kucing senang
 * - tekan lama: cangkir terguling, kopi memercik dan menggenang di meja, lalu cangkir bangkit lagi
 */
export function LatteCup({ catRef }: { catRef: RefObject<CatHandle | null> }) {
  const [art, setArt] = useState(false);
  const [spilled, setSpilled] = useState(false);
  const resetTimer = useRef(0);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const showArt = () => {
    if (spilled) return;
    setArt(true);
    SoundManager.play("ui.ting");
    vibrate(HAPTIC.tap);
    catRef.current?.react("happy", 1400);
    catRef.current?.sparkles(3);
    say("latte");
  };

  const spill = () => {
    if (spilled) return;
    setSpilled(true);
    setArt(false);
    SoundManager.play("cup.spill");
    vibrate(HAPTIC.spill);
    catRef.current?.react("surprised", 2000);
    say("spill");
    resetTimer.current = window.setTimeout(
      () => setSpilled(false),
      SPILL_MS + 50,
    );
  };

  const press = useLongPress({
    ms: SPILL_AFTER_MS,
    onTap: showArt,
    onLongPressStart: spill,
  });

  return (
    <button
      type="button"
      aria-label={LABELS.latteCup}
      {...press}
      className="block w-full cursor-pointer border-0 bg-transparent p-0"
    >
      <svg
        viewBox="0 0 100 100"
        className="latte block w-full overflow-visible"
        data-art={art}
        data-spilled={spilled}
        aria-hidden="true"
      >
        <ellipse cx="50" cy="90" rx="40" ry="8" fill={P.cream200} />

        {/* genangan kopi di meja, di sebelah kiri cangkir */}
        <ellipse
          className="puddle"
          cx="20"
          cy="90"
          rx="36"
          ry="7"
          fill={P.coffee500}
        />

        <g className="cup-body">
          <path
            d="M80 52 Q98 54 92 68 Q88 77 75 75"
            fill="none"
            stroke={P.cream50}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M18 42 L82 42 L74 84 Q50 94 26 84 Z"
            fill={P.cream50}
            stroke="rgba(31,58,43,0.16)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M21 58 L79 58 L76.5 68 L23.5 68 Z" fill={P.matcha500} />
          <ellipse cx="50" cy="42" rx="32" ry="8" fill={P.cream50} />
          <ellipse cx="50" cy="43" rx="28" ry="6.5" fill={P.coffee500} />
          <path
            className="latte-heart"
            d="M50 47 C44 42 41 39 45 38 C47.5 37.5 49 39 50 40.5 C51 39 52.5 37.5 55 38 C59 39 56 42 50 47 Z"
            fill={P.cream50}
          />
        </g>

        {/* percikan kopi yang terlempar saat cangkir terguling ke kiri */}
        <circle
          className="drop drop-1"
          cx="4"
          cy="66"
          r="2.4"
          fill={P.coffee500}
        />
        <circle
          className="drop drop-2"
          cx="8"
          cy="72"
          r="2.4"
          fill={P.coffee500}
        />
        <circle
          className="drop drop-3"
          cx="2"
          cy="78"
          r="2.4"
          fill={P.coffee500}
        />
        <circle
          className="drop drop-4"
          cx="7"
          cy="82"
          r="2.4"
          fill={P.coffee500}
        />
        <circle
          className="drop drop-5"
          cx="5"
          cy="70"
          r="2.4"
          fill={P.coffee500}
        />

        <g
          className="steam"
          fill="none"
          stroke={P.cream50}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.8"
        >
          <path d="M42 30 q-5 -7 0 -13 q5 -6 0 -12" />
          <path d="M58 30 q-5 -7 0 -13 q5 -6 0 -12" />
        </g>
      </svg>
    </button>
  );
}
