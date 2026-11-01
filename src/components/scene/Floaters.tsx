import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";

const FLOATERS = ['🍃', '🌸', '🐾', '🌼', '✨'];

/** Emoji yang naik pelan-pelan. Dibuat langsung di DOM agar React tidak ikut render ulang. */
export function Floaters() {
  const ref = useRef<HTMLDivElement>(null);
  const perfMode = useAppStore((s) => s.perfMode);

  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    const max = perfMode === "low" ? 5 : 10;
    const every = perfMode === "low" ? 1400 : 650;

    const spawn = () => {
      if (document.hidden || box.childElementCount >= max) return;
      const el = document.createElement("span");
      el.textContent =
        FLOATERS[Math.floor(Math.random() * FLOATERS.length)] ?? "🍃";
      el.className = "float-item";
      el.style.left = `${Math.random() * 100}%`;
      el.style.fontSize = `${16 + Math.random() * 20}px`;
      el.style.animationDuration = `${6 + Math.random() * 5}s`;
      el.style.setProperty("--dx", `${Math.random() * 80 - 40}px`);
      el.style.setProperty("--rot", `${Math.random() * 60 - 30}deg`);
      box.appendChild(el);
      el.addEventListener("animationend", () => el.remove());
    };

    const id = window.setInterval(spawn, every);
    return () => {
      window.clearInterval(id);
      box.replaceChildren();
    };
  }, [perfMode]);

  return <div ref={ref} className="pointer-events-none absolute inset-0" />;
}
