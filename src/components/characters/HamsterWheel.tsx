import { useEffect, useRef, useState } from "react";
import { SoundManager } from "@/audio/SoundManager";
import { LABELS } from "@/content/system";
import { say } from "@/core/bubbles";
import { spawnSparkles } from "@/core/fx";
import { HAPTIC, vibrate } from "@/core/haptics";
import { useInView } from "@/core/hooks/useInView";
import { useReducedMotion } from "@/core/hooks/useReducedMotion";
import { useTapGuard } from "@/core/hooks/useTapGuard";
import { useTimeouts } from "@/core/hooks/useTimeouts";
import { P } from "@/core/palette";
import { useAppStore } from "@/store/useAppStore";
import type { Expression } from "./Character.types";
import { Hamster } from "./Hamster";
import { useCharacter } from "./useCharacter";

/** Kecepatan putar maksimum roda (radian per detik). */
const MAX_SPEED = 9;
/** Berapa piksel scroll per detik yang setara dengan 1 radian per detik. */
const PX_PER_RAD = 220;

type Level = 0 | 1 | 2;

/**
 * Roda hamster. Putaran roda dan langkah kaki mengikuti kecepatan scroll:
 * scroll cepat membuat roda cepat dan hamster terengah, diam membuat roda melambat lalu berhenti.
 * Di mode hemat animasi, roda tidak berputar.
 */
export function HamsterWheel() {
  const perfMode = useAppStore((s) => s.perfMode);
  const reduced = useReducedMotion();
  const { override, react } = useCharacter();
  const [puffed, setPuffed] = useState(false);
  const [level, setLevel] = useState<Level>(0);

  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGSVGElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const freezeUntil = useRef(0);
  const canTap = useTapGuard();
  const { after } = useTimeouts();
  const inView = useInView(stageRef, 0.2);
  const animate = inView && perfMode !== "low" && !reduced;

  // Satu loop ringan yang hanya berjalan saat panggung terlihat.
  useEffect(() => {
    const ring = ringRef.current;
    if (!animate || !ring) return;

    let raf = 0;
    let last = performance.now();
    let lastY = window.scrollY;
    let angle = 0;
    let speed = 0;
    let current: Level = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const y = window.scrollY;
      const velocity = dt > 0 ? Math.abs(y - lastY) / dt : 0;
      lastY = y;

      const target =
        now < freezeUntil.current
          ? 0
          : Math.min(MAX_SPEED, velocity / PX_PER_RAD);
      // cepat saat menambah kecepatan, pelan saat melambat
      speed += (target - speed) * Math.min(1, dt * (target > speed ? 8 : 1.6));
      if (speed < 0.02) speed = 0;
      angle += speed * dt;
      ring.style.transform = `rotate(${angle}rad)`;

      const next: Level = speed < 0.15 ? 0 : speed < 2.5 ? 1 : 2;
      if (next !== current) {
        current = next;
        setLevel(next);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animate]);

  const tap = () => {
    if (!canTap()) return;
    SoundManager.play("hamster.squeak");
    vibrate(HAPTIC.tap);
    spawnSparkles(fxRef.current, perfMode === "low" ? 1 : 3);
    say("react", { id: "hamster-puff" });
    setPuffed(true);
    react("surprised", 260);
    after(() => react("happy", 540), 180);
    freezeUntil.current = performance.now() + 700;
    after(() => setPuffed(false), 850);
  };

  const shown: Expression = override ?? (level === 2 ? "surprised" : "happy");

  return (
    <div
      ref={stageRef}
      className="wheel-stage relative mx-auto aspect-square w-[min(84vw,310px)]"
      data-speed={level}
      data-active={inView}
    >
      {/* kaki penyangga */}
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <ellipse
          cx="100"
          cy="194"
          rx="70"
          ry="6"
          fill={P.forest900}
          opacity="0.18"
        />
        <path
          d="M100 100 L44 190 M100 100 L156 190"
          stroke={P.coffee800}
          strokeWidth="9"
          strokeLinecap="round"
        />
        <rect x="30" y="186" width="140" height="8" rx="4" fill={P.coffee800} />
      </svg>

      {/* roda yang berputar */}
      <svg
        ref={ringRef}
        viewBox="0 0 200 200"
        className="wheel-ring absolute inset-[5%] h-[90%] w-[90%]"
        aria-hidden="true"
      >
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="none"
          stroke={P.coffee500}
          strokeWidth="10"
        />
        <circle
          cx="100"
          cy="100"
          r="86"
          fill="none"
          stroke={P.cream200}
          strokeWidth="3"
        />
        <path
          d="M100 100 L100 14 M100 100 L161 39 M100 100 L186 100 M100 100 L161 161 M100 100 L100 186 M100 100 L39 161 M100 100 L14 100 M100 100 L39 39"
          stroke={P.cream200}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="100" cy="100" r="9" fill={P.coffee500} />
        <circle cx="100" cy="8" r="6" fill={P.matcha500} />
      </svg>

      <div
        ref={fxRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
      />

      <button
        type="button"
        aria-label={LABELS.hamster}
        onClick={tap}
        className="absolute bottom-[8%] left-1/2 z-[5] block w-[50%] -translate-x-1/2 cursor-pointer border-0 bg-transparent p-0"
      >
        <Hamster expression={shown} puffed={puffed} />
      </button>
    </div>
  );
}
