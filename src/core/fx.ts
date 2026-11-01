import { useAppStore } from "@/store/useAppStore";

const PARTICLES = ["✨", "🌼", "🍃"];
const MAX_ALIVE = 12;

/** Memunculkan percikan kecil yang naik dari sebuah elemen. Dibuat langsung di DOM (tanpa render ulang React). */
export function spawnSparkles(host: HTMLElement | null, count = 3): void {
  if (!host) return;
  const n =
    useAppStore.getState().perfMode === "low" ? Math.min(count, 2) : count;
  for (let i = 0; i < n; i += 1) {
    if (host.childElementCount >= MAX_ALIVE) return;
    const el = document.createElement("span");
    el.className = "spark-up";
    el.textContent =
      PARTICLES[Math.floor(Math.random() * PARTICLES.length)] ?? "✨";
    el.style.left = `${30 + Math.random() * 40}%`;
    el.style.animationDelay = `${i * 90}ms`;
    el.style.setProperty("--dx", `${Math.random() * 70 - 35}px`);
    host.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}
