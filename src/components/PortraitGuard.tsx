import { useEffect } from "react";
import { SYSTEM } from "@/content/system";
import { lockScroll, unlockScroll } from "@/core/scrollLock";
import { useMediaQuery } from "@/core/hooks/useMediaQuery";

const LANDSCAPE = "(orientation: landscape) and (max-height: 500px)";

/** Saat HP diputar ke landscape, tutup layar dengan pesan lucu dan kunci scroll. */
export function PortraitGuard() {
  const landscape = useMediaQuery(LANDSCAPE);

  useEffect(() => {
    if (!landscape) return;
    lockScroll("landscape");
    return () => unlockScroll("landscape");
  }, [landscape]);

  if (!landscape) return null;

  return (
    <div
      role="alert"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-2 px-8 text-center text-coffee-800"
      style={{ background: "linear-gradient(180deg,#DCEDC8 0%,#AED581 100%)" }}
    >
      <span aria-hidden="true" className="tilt-slow text-6xl leading-none">
        🐱
      </span>
      <p className="text-2xl font-extrabold">{SYSTEM.landscapeTitle}</p>
      <p className="text-base font-semibold text-coffee-800/80">
        {SYSTEM.landscapeHint}
      </p>
    </div>
  );
}
