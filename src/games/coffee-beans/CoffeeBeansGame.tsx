import { useCallback, useEffect, useRef, type PointerEvent } from "react";
import { SoundManager } from "@/audio/SoundManager";
import { GAME_COPY } from "@/content/games";
import { say } from "@/core/bubbles";
import { HAPTIC, vibrate } from "@/core/haptics";
import { useAppStore } from "@/store/useAppStore";
import { GAME_CONFIG } from "../config";
import type { GameApi } from "../types";
import { Cup } from "./Cup";
import {
  createCoffeeBeansEngine,
  drawCoffeeBeans,
  resetCoffeeSpawnClock,
  resizeCoffeeBeansEngine,
  steerCoffeeBasket,
  stepCoffeeBeans,
  type CoffeeBeansEngine,
} from "./engine";

export function CoffeeBeansGame({ api }: { api: GameApi }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<CoffeeBeansEngine | null>(null);
  const pointerId = useRef<number | null>(null);
  const activeRunId = useRef<number | null>(null);
  const completionTimer = useRef<number | null>(null);
  const targetCatch = GAME_CONFIG.coffeeBeans.targetCatch;
  const { announce, complete, setProgress } = api;

  const onCaught = useCallback((caught: number) => {
    SoundManager.play("game.beanCatch", {
      pitch: 1 + (caught - 1) * GAME_CONFIG.coffeeBeans.catchPitchStep,
    });
    vibrate(HAPTIC.tap);
    say("react", { id: "bean-caught" });
    announce(GAME_COPY.coffeeBeans.beanCaughtAnnouncement);
    setProgress(caught / targetCatch);

    if (caught >= targetCatch) {
      SoundManager.play("game.cupFull");
      SoundManager.play("cat.meowHappy", { delay: 0.14 });
      if (completionTimer.current === null) {
        completionTimer.current = window.setTimeout(() => {
          completionTimer.current = null;
          complete();
        }, GAME_CONFIG.coffeeBeans.catchBurstDurationMs);
      }
    }
  }, [announce, complete, setProgress, targetCatch]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !api.active) return;
    if (activeRunId.current !== api.runId) {
      activeRunId.current = api.runId;
      engineRef.current = null;
    }

    let frame = 0;
    let lastFrame = 0;
    let cssWidth = 0;
    let cssHeight = 0;
    const lowMotion = useAppStore.getState().perfMode === "low";
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      cssWidth = rect.width;
      cssHeight = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, GAME_CONFIG.coffeeBeans.maxDpr);
      canvas.width = Math.max(1, Math.round(cssWidth * dpr));
      canvas.height = Math.max(1, Math.round(cssHeight * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!engineRef.current) {
        engineRef.current = createCoffeeBeansEngine(cssWidth, cssHeight, 0, lowMotion);
      } else {
        resizeCoffeeBeansEngine(engineRef.current, cssWidth, cssHeight);
        engineRef.current.lowMotion = lowMotion;
      }
    };

    resize();
    const engine = engineRef.current;
    if (!engine) return;

    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    observer?.observe(canvas);
    if (!observer) window.addEventListener("resize", resize);

    resetCoffeeSpawnClock(engine, performance.now());

    const drawFrame = (now: number) => {
      const dt = lastFrame === 0 ? 0 : Math.min(0.05, (now - lastFrame) / 1000);
      lastFrame = now;
      const caughtBefore = engine.caught;
      stepCoffeeBeans(engine, dt, now);
      const caughtNow = engine.caught - caughtBefore;
      for (let index = 0; index < caughtNow; index += 1) {
        onCaught(caughtBefore + index + 1);
      }
      drawCoffeeBeans(ctx, engine);
      if (!engine.finished || engine.bursts.length > 0) frame = requestAnimationFrame(drawFrame);
    };

    frame = requestAnimationFrame(drawFrame);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      if (!observer) window.removeEventListener("resize", resize);
      if (completionTimer.current !== null) {
        window.clearTimeout(completionTimer.current);
        completionTimer.current = null;
      }
      pointerId.current = null;
    };
  }, [api.active, api.runId, onCaught, targetCatch]);

  const steer = (clientX: number) => {
    const canvas = canvasRef.current;
    const engine = engineRef.current;
    if (!canvas || !engine) return;
    const rect = canvas.getBoundingClientRect();
    steerCoffeeBasket(engine, clientX - rect.left);
  };

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    pointerId.current = event.pointerId;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Browser tanpa pointer capture tetap bisa menggerakkan keranjang di area kanvas.
    }
    steer(event.clientX);
  };

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (pointerId.current !== event.pointerId) return;
    event.preventDefault();
    steer(event.clientX);
  };

  const releasePointer = (event: PointerEvent<HTMLCanvasElement>) => {
    if (pointerId.current !== event.pointerId) return;
    pointerId.current = null;
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      // Pointer berakhir normal meski browser tidak mendukung pointer capture.
    }
  };

  return (
    <div className="relative w-full max-w-[30rem]">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={GAME_COPY.coffeeBeans.canvasLabel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={releasePointer}
        onPointerCancel={releasePointer}
        onLostPointerCapture={() => { pointerId.current = null; }}
        className="block h-[min(44dvh,23rem)] min-h-[17rem] w-full touch-none rounded-[28px] border-2 border-coffee-800/20 bg-cream-50/35"
      />
      <div className="pointer-events-none absolute top-3 right-3 rounded-2xl bg-forest-900/15 p-2">
        <Cup progress={api.progress} />
      </div>
    </div>
  );
}
