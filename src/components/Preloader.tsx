import { useState, type FormEvent } from "react";
import { m } from "framer-motion";
import { SoundManager } from "@/audio/SoundManager";
import { MAX_CAT_NAME_LENGTH, PRELOADER } from "@/content/system";
import { loadStoredCatName } from "@/store/storage";
import { useAppStore } from "@/store/useAppStore";
import { CatPeek } from "./characters/CatPeek";

/** Layar pembuka: overlay penuh layar. Ketukan pertama mengaktifkan suara dan membuka scroll. */
export function Preloader() {
  const start = useAppStore((s) => s.start);
  const [name, setName] = useState(() => loadStoredCatName() ?? "");

  const handleStart = (e: FormEvent) => {
    e.preventDefault();
    // Harus sinkron di dalam handler ketukan agar audio Android terbuka.
    void SoundManager.unlock();
    SoundManager.play("ui.start");
    start(name);
  };

  return (
    <m.div
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-5 overflow-hidden px-6 pt-[env(safe-area-inset-top)] pb-[22dvh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, pointerEvents: "none" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="bubble max-w-[22rem] card-cream px-5 py-4 text-center text-[1.35rem] leading-snug font-extrabold">
        {PRELOADER.title}
      </div>

      <form
        onSubmit={handleStart}
        className="mt-3 flex w-full max-w-xs flex-col items-center gap-3"
      >
        <label
          htmlFor="cat-name"
          className="text-base font-bold text-coffee-800"
        >
          {PRELOADER.nameLabel}
        </label>
        <input
          id="cat-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={MAX_CAT_NAME_LENGTH}
          placeholder={PRELOADER.namePlaceholder}
          autoComplete="off"
          autoCapitalize="words"
          enterKeyHint="go"
          spellCheck={false}
          className="w-full rounded-full bg-cream-50/95 px-5 py-3 text-center text-[1.15rem] font-extrabold text-coffee-800 shadow-[0_4px_0_rgba(31,58,43,0.2)] outline-none placeholder:text-coffee-800/35 focus-visible:ring-4 focus-visible:ring-matcha-700"
        />
        <button
          type="submit"
          className="btn-matcha mt-1 min-h-14 w-full rounded-full px-6 text-[1.25rem] font-extrabold"
        >
          {PRELOADER.button}
        </button>
        <p className="text-sm font-semibold text-coffee-800/75">
          {PRELOADER.hint}
        </p>
      </form>

      <CatPeek />
    </m.div>
  );
}
