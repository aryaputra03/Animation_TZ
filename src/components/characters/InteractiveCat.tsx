import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type KeyboardEvent,
  type Ref,
} from "react";
import { SoundManager } from "@/audio/SoundManager";
import { LABELS } from "@/content/system";
import { say } from "@/core/bubbles";
import { spawnSparkles } from "@/core/fx";
import { cancelVibration, HAPTIC, vibrate } from "@/core/haptics";
import { useIdle } from "@/core/hooks/useIdle";
import { useInView } from "@/core/hooks/useInView";
import { useLongPress } from "@/core/hooks/useLongPress";
import { useMultiTap } from "@/core/hooks/useMultiTap";
import { useReducedMotion } from "@/core/hooks/useReducedMotion";
import { useAppStore } from "@/store/useAppStore";
import { Cat } from "./Cat";
import { CatLookout } from "./CatLookout";
import type {
  CatAccessory,
  CatHandle,
  CatMood,
  CatVariant,
  Expression,
} from "./Character.types";
import { useCharacter } from "./useCharacter";

interface Props {
  accessory?: CatAccessory;
  /** 'full' = seluruh badan, 'lookout' = hanya kepala dan tangan (mengintip dari tepi layar). */
  variant?: CatVariant;
  /** 'pleading' = mata besar memohon, 'cheerful' = mata senang dan senyum. */
  mood?: CatMood;
  /** Atur ukuran dan posisi dari luar, contoh "w-[58%]". */
  className?: string;
  ref?: Ref<CatHandle>;
}

const SLEEP_AFTER_MS = 12000;
const PET_AFTER_MS = 400;
const TAP_DEBOUNCE_MS = 150;

/**
 * Kucing yang bisa diajak berinteraksi:
 * - ketuk: meow, memantul, balon acak
 * - tekan-tahan: dielus (mendengkur, percikan, getar halus)
 * - ketuk 5 kali dalam 3 detik: mode lebay
 * - diam sekitar 12 detik: tertidur, bangun saat ada aktivitas
 */
export function InteractiveCat({
  accessory = "none",
  variant = "full",
  mood = "pleading",
  className = "",
  ref,
}: Props) {
  const catName = useAppStore((s) => s.catName);
  const started = useAppStore((s) => s.started);
  const reducedMotion = useReducedMotion();
  const { override, react, hold } = useCharacter();
  const [sleeping, setSleeping] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const lastTap = useRef(0);
  const petTimers = useRef<number[]>([]);
  const visible = useInView(buttonRef, 0.5);
  const registerTap = useMultiTap(5, 3000);

  const sparkles = useCallback(
    (count = 3) => spawnSparkles(fxRef.current, count),
    [],
  );

  useImperativeHandle(ref, () => ({ react, sparkles }), [react, sparkles]);

  const bounce = useCallback(() => {
    if (reducedMotion) return;
    buttonRef.current?.animate(
      [
        { transform: "translateY(0) scale(1,1)" },
        { transform: "translateY(-16px) scale(0.95,1.07)" },
        { transform: "translateY(0) scale(1.05,0.94)" },
        { transform: "translateY(0) scale(1,1)" },
      ],
      { duration: 420, easing: "ease-out" },
    );
  }, [reducedMotion]);

  // Tidur saat diam, bangun saat ada aktivitas apa pun.
  useIdle(SLEEP_AFTER_MS, {
    enabled: started && visible,
    onIdle: () => {
      setSleeping(true);
      say("idle");
    },
    onWake: () => {
      setSleeping(false);
      react("surprised", 700);
      SoundManager.play("cat.yawn");
      say("wake");
    },
  });

  const stopPet = useCallback(() => {
    petTimers.current.forEach((id) => window.clearInterval(id));
    petTimers.current = [];
    SoundManager.stopLoop("cat.purr");
    cancelVibration();
  }, []);
  useEffect(() => stopPet, [stopPet]);

  const startPet = () => {
    hold("purr");
    SoundManager.startLoop("cat.purr");
    vibrate(HAPTIC.pet);
    sparkles(1);
    say("pet");
    petTimers.current = [
      window.setInterval(() => vibrate(HAPTIC.pet), 140),
      window.setInterval(() => {
        sparkles(1);
        SoundManager.play("heart.pop");
      }, 650),
    ];
  };

  const endPet = () => {
    stopPet();
    hold(null);
    react("happy", 700);
  };

  const goLebay = () => {
    react("lebay", 4000);
    SoundManager.play("cat.meowLebay");
    vibrate(HAPTIC.lebay);
    sparkles(8);
    bounce();
    say("lebay");
  };

  const tap = () => {
    const now = performance.now();
    if (now - lastTap.current < TAP_DEBOUNCE_MS) return;
    lastTap.current = now;

    if (registerTap()) {
      goLebay();
      return;
    }
    const r = Math.random();
    SoundManager.play(
      r < 0.55 ? "cat.meow" : r < 0.85 ? "cat.meowHappy" : "cat.mrrp",
    );
    vibrate(HAPTIC.tap);
    bounce();
    react("happy", 1000);
    say("tap");
  };

  const press = useLongPress({
    ms: PET_AFTER_MS,
    onTap: tap,
    onLongPressStart: startPet,
    onLongPressEnd: endPet,
  });

  // Ketuk lewat keyboard (Enter atau spasi)
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      tap();
    }
  };

  const base: Expression = mood === "cheerful" ? "cheer" : "idle";
  const shown: Expression = override ?? (sleeping && visible ? "sleepy" : base);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={fxRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
      />
      <button
        ref={buttonRef}
        type="button"
        aria-label={LABELS.petCat(catName)}
        onKeyDown={onKeyDown}
        {...press}
        className="block w-full cursor-pointer border-0 bg-transparent p-0"
      >
        {variant === "lookout" ? (
          <CatLookout expression={shown} />
        ) : (
          <Cat expression={shown} accessory={accessory} />
        )}
      </button>
    </div>
  );
}
