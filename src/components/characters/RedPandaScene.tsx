import { useEffect, useRef, useState } from "react";
import { SoundManager } from "@/audio/SoundManager";
import { LABELS } from "@/content/system";
import { say } from "@/core/bubbles";
import { spawnSparkles } from "@/core/fx";
import { HAPTIC, vibrate } from "@/core/haptics";
import { useInView } from "@/core/hooks/useInView";
import { useTapGuard } from "@/core/hooks/useTapGuard";
import { useTimeouts } from "@/core/hooks/useTimeouts";
import { useAppStore } from "@/store/useAppStore";
import { RedPanda } from "./RedPanda";

const AWAKE_MS = 8000;
const ROLL_MS = 1500;

/**
 * Red panda yang mengantuk. Saat bangun ia tetap cemberut lucu selama delapan detik,
 * lalu kembali tidur setelah berguling pelan sambil memeluk bambu.
 */
export function RedPandaScene() {
  const [awake, setAwake] = useState(false);
  const [rolling, setRolling] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const sleepTimer = useRef(0);
  const canTap = useTapGuard();
  const active = useInView(stageRef, 0.2);
  const perfMode = useAppStore((s) => s.perfMode);
  const { after, cancel } = useTimeouts();

  useEffect(() => () => window.clearTimeout(sleepTimer.current), []);

  const wake = () => {
    if (!canTap()) return;
    SoundManager.play("redpanda.twitter");
    SoundManager.play("redpanda.yawn", { delay: 0.5 });
    vibrate(HAPTIC.tap);
    spawnSparkles(fxRef.current, perfMode === "low" ? 1 : 3);
    say("react", { id: "panda-wake" });

    setAwake(true);
    setRolling(true);
    after(() => setRolling(false), ROLL_MS);

    cancel(sleepTimer.current);
    sleepTimer.current = after(() => setAwake(false), AWAKE_MS);
  };

  const shown = awake ? "grumpy" : "sleepy";

  return (
    <div
      ref={stageRef}
      className="relative mx-auto w-[min(72vw,290px)]"
      style={{ aspectRatio: "220 / 260" }}
      data-active={active}
    >
      <div
        ref={fxRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
      />
      <button
        type="button"
        aria-label={LABELS.redPanda}
        onClick={wake}
        className="block h-full w-full cursor-pointer border-0 bg-transparent p-0"
      >
        <RedPanda expression={shown} rolling={rolling} />
      </button>
    </div>
  );
}
