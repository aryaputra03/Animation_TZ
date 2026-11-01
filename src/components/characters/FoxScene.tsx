import { useRef, useState } from "react";
import { SoundManager } from "@/audio/SoundManager";
import { LABELS } from "@/content/system";
import { say } from "@/core/bubbles";
import { spawnSparkles } from "@/core/fx";
import { HAPTIC, vibrate } from "@/core/haptics";
import { useInView } from "@/core/hooks/useInView";
import { useTapGuard } from "@/core/hooks/useTapGuard";
import { useTimeouts } from "@/core/hooks/useTimeouts";
import { useAppStore } from "@/store/useAppStore";
import { Fox, type FoxState } from "./Fox";
import { useCharacter } from "./useCharacter";

const JUMP_MS = 1600;
const SHAKE_MS = 650;

/**
 * Rubah di balik semak.
 * - ketuk rubah atau ekornya: melompat keluar, berputar, "yip", lalu kembali bersembunyi
 * - ketuk semak: daun bergoyang dan rubah mengintip lagi
 */
export function FoxScene() {
  const [state, setState] = useState<FoxState>("rest");
  const { override, react } = useCharacter();
  const stageRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const active = useInView(stageRef, 0.2);
  const perfMode = useAppStore((s) => s.perfMode);
  const canTap = useTapGuard();
  const { after } = useTimeouts();

  const jump = () => {
    if (!canTap() || state !== "rest") return;
    setState("jump");
    react("surprised", 400);
    after(() => react("happy", 900), 350);
    SoundManager.play("fox.yip");
    vibrate(HAPTIC.tap);
    spawnSparkles(fxRef.current, perfMode === "low" ? 1 : 4);
    say("react", { id: "fox-caught" });
    after(() => setState("rest"), JUMP_MS + 50);
  };

  const shake = () => {
    if (!canTap() || state !== "rest") return;
    setState("shake");
    react("curious", SHAKE_MS);
    SoundManager.play("ui.pop");
    vibrate(HAPTIC.tap);
    spawnSparkles(fxRef.current, 2);
    after(() => setState("rest"), SHAKE_MS);
  };

  return (
    <div
      ref={stageRef}
      className="fox-stage relative mx-auto mt-10 w-[min(90vw,340px)]"
      style={{ aspectRatio: "320 / 300" }}
      data-state={state}
      data-active={active}
    >
      <Fox expression={override ?? "curious"} state={state} />
      <div
        ref={fxRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
      />
      <button
        type="button"
        aria-label={LABELS.fox}
        onClick={jump}
        className="absolute inset-x-0 top-0 h-[54%] cursor-pointer border-0 bg-transparent p-0"
      />
      <button
        type="button"
        aria-label={LABELS.bush}
        onClick={shake}
        className="absolute inset-x-0 bottom-0 h-[46%] cursor-pointer border-0 bg-transparent p-0"
      />
    </div>
  );
}
