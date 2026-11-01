import { useEffect, useId, useRef } from "react";
import { GAME_CONFIG } from "@/games/config";
import { GAME_COPY } from "@/content/games";
import { P } from "@/core/palette";
import { useAppStore } from "@/store/useAppStore";

export function Cup({ progress }: { progress: number }) {
  const clipId = `coffeeCup${useId().replace(/:/g, "")}`;
  const gradientId = `coffeeFill${useId().replace(/:/g, "")}`;
  const boundedProgress = Math.max(0, Math.min(1, progress));
  const caught = Math.round(boundedProgress * GAME_CONFIG.coffeeBeans.targetCatch);
  const lowMotion = useAppStore((state) => state.perfMode === "low");
  const cupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (caught === 0 || lowMotion) return;
    const animation = cupRef.current?.animate(
      [
        { transform: "scale(1) rotate(0deg)" },
        { transform: "scale(1.12) rotate(-3deg)" },
        { transform: "scale(1) rotate(0deg)" },
      ],
      { duration: 360, easing: "ease-out" },
    );
    return () => animation?.cancel();
  }, [caught, lowMotion]);

  return (
    <div
      ref={cupRef}
      className="h-[5.5rem] w-[4.5rem] origin-center"
    >
      <div
        role="progressbar"
        aria-label={GAME_COPY.coffeeBeans.cupLabel}
        aria-valuemin={0}
        aria-valuemax={GAME_CONFIG.coffeeBeans.targetCatch}
        aria-valuenow={caught}
        className="h-full w-full"
      >
        <svg viewBox="0 0 90 110" className="block h-full w-full" aria-hidden="true">
          <defs>
            <clipPath id={clipId}>
              <path d="M17 32 Q17 29 22 29 H64 L60 82 Q57 94 40 95 Q23 94 20 82 Z" />
            </clipPath>
            <linearGradient id={gradientId} x1="0" x2="0.2" y1="0" y2="1">
              <stop offset="0" stopColor={P.coffee500} />
              <stop offset="1" stopColor="#75452b" />
            </linearGradient>
            <linearGradient id={`${gradientId}Body`} x1="0" x2="1" y1="0" y2="0.9">
              <stop offset="0" stopColor="#fff9e8" />
              <stop offset="0.72" stopColor="#f4dfb9" />
              <stop offset="1" stopColor="#dbb784" />
            </linearGradient>
          </defs>
          <ellipse cx="31" cy="95" rx="8" ry="5" fill="#d89a5c" stroke="#4a2f1e" strokeWidth="2" />
          <ellipse cx="53" cy="95" rx="8" ry="5" fill="#d89a5c" stroke="#4a2f1e" strokeWidth="2" />
          <path d="M64 42 C84 37 84 70 62 69" fill="none" stroke="#4a2f1e" strokeWidth="10" strokeLinecap="round" />
          <path d="M64 42 C84 37 84 70 62 69" fill="none" stroke="#f5dfb7" strokeWidth="5" strokeLinecap="round" />
          <path d="M20 61 C8 54 8 72 20 75" fill="#f5dfb7" stroke="#4a2f1e" strokeWidth="3" />
          <path d="M18 62 Q14 63 15 68" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <path d="M16 31 Q16 27 22 27 H64 Q68 28 67 34 L62 82 Q59 96 41 98 Q22 96 19 82 Z" fill={`url(#${gradientId}Body)`} stroke="#4a2f1e" strokeWidth="3" strokeLinejoin="round" />
          <g clipPath={`url(#${clipId})`}>
            <g
              style={{
                transform: `scaleY(${boundedProgress})`,
                transformOrigin: "41px 86px",
                transformBox: "view-box",
                transition: `transform ${lowMotion ? 120 : 360}ms ease-out`,
              }}
            >
              <rect x="17" y="29" width="48" height="66" fill={`url(#${gradientId})`} />
              <ellipse cx="41" cy="30" rx="24" ry="4" fill="#d69a61" />
            </g>
          </g>
          <path d="M19 78 Q41 82 63 78 L62 87 Q41 92 20 87 Z" fill={P.matcha500} />
          <path d="M41 81 C37 77 33 81 41 87 C49 81 45 77 41 81Z" fill={P.cream50} />
          <path d="M28 48 Q33 44 37 48 M46 48 Q51 44 55 48" fill="none" stroke="#4a2f1e" strokeWidth="2.2" strokeLinecap="round" />
          <ellipse cx="33" cy="57" rx="6.2" ry="8" fill="#4a2f1e" />
          <ellipse cx="51" cy="57" rx="6.2" ry="8" fill="#4a2f1e" />
          <ellipse cx="33" cy="57" rx="4.2" ry="6" fill="#211a19" />
          <ellipse cx="51" cy="57" rx="4.2" ry="6" fill="#211a19" />
          <circle cx="31.5" cy="54" r="2.1" fill="#fff" />
          <circle cx="49.5" cy="54" r="2.1" fill="#fff" />
          <ellipse cx="24" cy="68" rx="4.5" ry="3" fill="#f28c96" />
          <ellipse cx="60" cy="68" rx="4.5" ry="3" fill="#f28c96" />
          <path d="M36 66 Q41 63 46 66 L45 72 Q41 77 37 72Z" fill="#b83c50" stroke="#4a2f1e" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M38 69 Q41 67 44 69 Q42 72 39 71Z" fill="#ff9da8" />
          <path d="M19 35 Q21 32 23 34 L26 40" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          <path d="M16 31 Q16 27 22 27 H64 Q68 28 67 34 L62 82 Q59 96 41 98 Q22 96 19 82 Z" fill="none" stroke="#4a2f1e" strokeWidth="3" strokeLinejoin="round" />
          <ellipse cx="41" cy="29" rx="26" ry="9" fill="#fff8e7" stroke="#4a2f1e" strokeWidth="2.5" />
          <ellipse cx="41" cy="29" rx="21" ry="5.5" fill={P.coffee500} />
          <path d="M41 27 C37 22 32 27 41 34 C50 27 45 22 41 27Z" fill="#fff8e7" />
          <path d="M34 30 Q38 28 40 31 M42 31 Q45 28 48 30" fill="none" stroke="#e6bd8d" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="41" cy="101" rx="27" ry="3.5" fill="rgba(74, 47, 30, 0.16)" />
        </svg>
      </div>
    </div>
  );
}
