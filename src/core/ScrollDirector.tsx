import { useEffect, useRef, type ReactNode } from 'react';
import type { SectionId } from '@/content/sections';
import { enterSection, hide } from '@/core/bubbles';
import { ScrollTrigger } from '@/core/gsap';
import { useAppStore } from '@/store/useAppStore';

/**
 * Pembungkus halaman yang bisa digulir. Tugasnya:
 * - menandai section yang sedang aktif,
 * - menyegarkan ScrollTrigger setelah font siap dan saat orientasi berubah,
 * - menahan konten (inert) sampai layar pembuka ditutup.
 * Latar langit dan jejak kaki memakai #scroll-root sebagai acuan progres.
 */
export function ScrollDirector({ children }: { children: ReactNode }) {
  const started = useAppStore((s) => s.started);
  const activeGameId = useAppStore((s) => s.activeGameId);
  const setActiveSection = useAppStore((s) => s.setActiveSection);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = (entry.target as HTMLElement).dataset.section as SectionId | undefined;
          if (id) {
            setActiveSection(id);
            if ((entry.target as HTMLElement).dataset.secretRoomLocked === 'true') hide();
            else enterSection(id);
          }
        }
      },
      { threshold: 0.55 },
    );
    root.querySelectorAll('[data-section]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [setActiveSection]);

  useEffect(() => {
    let timer = 0;
    const refresh = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    void document.fonts?.ready.then(refresh);
    window.addEventListener('orientationchange', refresh);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('orientationchange', refresh);
    };
  }, []);

  return (
    <main
      id="scroll-root"
      ref={rootRef}
      data-game-playing={activeGameId !== null}
      inert={!started}
      className={`relative z-10 transition-opacity duration-700 ${started ? 'opacity-100' : 'opacity-0'}`}
    >
      {children}
    </main>
  );
}
