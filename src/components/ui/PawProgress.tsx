import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/core/gsap';
import { useAppStore } from '@/store/useAppStore';

const COUNT = 9;

/** Jejak kaki di tepi kanan terisi mengikuti progres scroll. */
export function PawProgress() {
  const boxRef = useRef<HTMLDivElement>(null);
  const activeGameId = useAppStore((state) => state.activeGameId);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const scrollRoot = document.getElementById('scroll-root');
    if (!box || !scrollRoot) return;

    const paws = Array.from(box.children) as SVGElement[];
    let last = -1;
    const apply = (progress: number) => {
      box.style.setProperty('--paw-scroll-progress', String(progress));
      const filled = Math.round(progress * COUNT);
      if (filled === last) return;
      last = filled;
      paws.forEach((paw, index) => {
        paw.dataset.on = String(index < filled);
      });
    };

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: scrollRoot,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      });
    });

    return () => context.revert();
  }, []);

  return (
    <div
      ref={boxRef}
      aria-hidden="true"
      className={`paw-progress pointer-events-none fixed top-1/2 z-50 flex -translate-y-1/2 flex-col gap-2 ${activeGameId ? 'hidden' : ''}`}
      style={{ right: 'calc(env(safe-area-inset-right, 0px) + 8px)' }}
    >
      {Array.from({ length: COUNT }, (_, index) => (
        <svg
          key={index}
          className="paw"
          data-on="false"
          viewBox="0 0 24 24"
          width="22"
          height="22"
          style={{ rotate: index % 2 === 0 ? '-12deg' : '12deg' }}
        >
          <ellipse cx="12" cy="16.5" rx="5.2" ry="4.2" />
          <circle cx="5.5" cy="10.5" r="2.3" />
          <circle cx="9.5" cy="6.5" r="2.3" />
          <circle cx="14.5" cy="6.5" r="2.3" />
          <circle cx="18.5" cy="10.5" r="2.3" />
        </svg>
      ))}
    </div>
  );
}
