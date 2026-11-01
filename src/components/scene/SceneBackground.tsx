import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/core/gsap";
import { useAppStore } from "@/store/useAppStore";
import { FADE_WIDTH, SCENES, isSceneVisible, type SceneId } from "./scenes";
import { Floaters } from "./Floaters";
import { MeadowScene } from "./MeadowScene";
import { ForestScene } from "./ForestScene";
import { HillsScene } from "./HillsScene";
import { NightScene } from "./NightScene";

const VIEWS: Record<SceneId, ReactNode> = {
  meadow: <MeadowScene />,
  forest: <ForestScene />,
  hills: <HillsScene />,
  night: <NightScene />,
};

/**
 * Latar tetap di belakang seluruh halaman. Empat pemandangan bertumpuk dan saling memudar
 * mengikuti scroll (hanya opacity, jadi ringan di HP). Pemandangan yang tidak terlihat
 * dijeda animasinya lewat atribut data-active.
 */
export function SceneBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const perfMode = useAppStore((s) => s.perfMode);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const scrollRoot = document.getElementById("scroll-root");
    if (!root || !scrollRoot) return;

    const scenes = Array.from(
      root.querySelectorAll<HTMLElement>("[data-scene]"),
    );
    const count = scenes.length;

    const markActive = (progress: number) => {
      const pos = progress * count;
      scenes.forEach((el, k) => {
        const active = String(isSceneVisible(k, pos, count));
        if (el.dataset.active !== active) el.dataset.active = active;
      });
    };

    const ctx = gsap.context(() => {
      if (perfMode === "low") {
        // Mode hemat: berpindah per pemandangan dengan transisi CSS, tanpa scrub.
        const apply = (progress: number) => {
          const idx = Math.min(count - 1, Math.floor(progress * count));
          scenes.forEach((el, k) => {
            el.style.opacity = k <= idx ? "1" : "0";
            el.dataset.active = String(k === idx);
          });
        };
        ScrollTrigger.create({
          trigger: scrollRoot,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => apply(self.progress),
          onRefresh: (self) => apply(self.progress),
        });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: scrollRoot,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          onUpdate: (self) => markActive(self.progress),
          onRefresh: (self) => markActive(self.progress),
        },
      });
      // Pemandangan k memudar masuk di sekitar batas ke-k; panjang timeline = jumlah pemandangan.
      scenes.forEach((el, k) => {
        if (k === 0) return;
        tl.fromTo(
          el,
          { opacity: 0 },
          { opacity: 1, duration: FADE_WIDTH },
          k - FADE_WIDTH / 2,
        );
      });
      tl.to({}, { duration: 0 }, count);
    }, root);

    return () => ctx.revert();
  }, [perfMode]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden bg-matcha-100"
    >
      {SCENES.map((scene, k) => (
        <div
          key={scene.id}
          data-scene={scene.id}
          data-active={k === 0 ? "true" : "false"}
          className="scene"
          style={{ background: scene.sky, opacity: k === 0 ? 1 : 0 }}
        >
          {VIEWS[scene.id]}
        </div>
      ))}
      <Floaters />
    </div>
  );
}
