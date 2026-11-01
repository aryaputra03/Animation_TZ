import { useRef, useState } from "react";
import { SoundManager } from "@/audio/SoundManager";
import { LABELS } from "@/content/system";
import { say } from "@/core/bubbles";
import { spawnSparkles } from "@/core/fx";
import { HAPTIC, vibrate } from "@/core/haptics";
import { useInView } from "@/core/hooks/useInView";
import { useTapGuard } from "@/core/hooks/useTapGuard";
import { useTimeouts } from "@/core/hooks/useTimeouts";
import { P } from "@/core/palette";
import { useAppStore } from "@/store/useAppStore";
import { Rabbit } from "./Rabbit";
import { useCharacter } from "./useCharacter";

type Mode = "rest" | "hug-middle" | "hug-youngest" | "pat";

const HUG_MS = 1350;
const PAT_MS = 950;

/** Kakak kelinci dan dua adiknya yang bisa saling menyapa lewat sentuhan. */
export function RabbitPair() {
  const [mode, setMode] = useState<Mode>("rest");
  const big = useCharacter();
  const middle = useCharacter();
  const youngest = useCharacter();
  const stageRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const canTap = useTapGuard();
  const active = useInView(stageRef, 0.2);
  const perfMode = useAppStore((s) => s.perfMode);
  const { after } = useTimeouts();
  const busy = mode !== "rest";

  const run = (next: Mode, lineId: string) => {
    if (!canTap() || busy) return;
    const duration = next === "pat" ? PAT_MS : HUG_MS;
    setMode(next);
    big.react("happy", duration);
    middle.react(next === "hug-middle" ? "love" : "happy", duration);
    youngest.react(next === "hug-youngest" ? "love" : "happy", duration);
    SoundManager.play("rabbit.chirp", {
      pitch: next === "hug-youngest" ? 1.2 : next === "pat" ? 0.9 : 1,
    });
    vibrate(HAPTIC.tap);
    spawnSparkles(fxRef.current, perfMode === "low" ? 1 : 3);
    say("react", { id: lineId });
    after(() => setMode("rest"), duration);
  };

  return (
    <div
      ref={stageRef}
      className="rabbit-stage relative mx-auto w-[min(92vw,380px)]"
      style={{ aspectRatio: "380 / 300" }}
      data-mode={mode}
      data-active={active}
    >
      <div
        ref={fxRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30"
      />

      <button
        type="button"
        aria-label={LABELS.rabbitBig}
        onClick={() => run("pat", "rabbit-pat")}
        className="rabbit-big absolute right-0 bottom-0 z-[5] block w-[50%] cursor-pointer border-0 bg-transparent p-0"
      >
        <Rabbit expression={big.override ?? "happy"} />
      </button>

      <div
        className="rabbit-sibling rabbit-middle absolute bottom-0 left-[25%] z-[12] w-[30%]"
        data-hug={mode === "hug-middle"}
        data-pat={mode === "pat"}
      >
        <button
          type="button"
          aria-label={LABELS.rabbitMiddle}
          onClick={() => run("hug-middle", "rabbit-hug")}
          className="block w-full cursor-pointer border-0 bg-transparent p-0"
        >
          <Rabbit scarf expression={middle.override ?? "happy"} />
        </button>
      </div>

      <div
        className="rabbit-sibling rabbit-youngest absolute bottom-0 left-[2%] z-[15] w-[24%]"
        data-hug={mode === "hug-youngest"}
        data-pat={mode === "pat"}
      >
        <button
          type="button"
          aria-label={LABELS.rabbitYoungest}
          onClick={() => run("hug-youngest", "rabbit-hug")}
          className="block w-full cursor-pointer border-0 bg-transparent p-0"
        >
          <Rabbit scarf expression={youngest.override ?? "happy"} />
        </button>
      </div>

      {/* Lengan melengkung dari bahu kakak, dengan telapak kecil yang menyentuh adik. */}
      <svg
        className="pat-arm pointer-events-none absolute inset-0 z-20 h-full w-full"
        viewBox="0 0 380 300"
        aria-hidden="true"
      >
        <g>
          <path
            d="M236 228 C218 216 190 207 157 210"
            fill="none"
            stroke="rgba(74,47,30,0.2)"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <path
            d="M236 228 C218 216 190 207 157 210"
            fill="none"
            stroke="#fffdf7"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <ellipse
            cx="151"
            cy="209"
            rx="14"
            ry="12"
            fill="#fffdf7"
            stroke="rgba(74,47,30,0.2)"
            strokeWidth="2.5"
          />
          <path
            d="M144 204 l-2 5 M151 201 v5 M158 203 l2 5"
            stroke={P.coffee500}
            strokeWidth="2"
            strokeLinecap="round"
            opacity=".65"
          />
        </g>
      </svg>
    </div>
  );
}
