import { useRef } from 'react';
import type { CatHandle } from '@/components/characters/Character.types';
import { InteractiveCat } from '@/components/characters/InteractiveCat';
import { EspressoMachine } from '@/components/props/EspressoMachine';
import { LatteCup } from '@/components/props/LatteCup';
import { SpeechBubble } from '@/components/ui/SpeechBubble';
import { P } from '@/core/palette';
import type { SectionProps } from './types';

/** Meja barista: bagian depan menutupi badan kucing sampai ke perut. */
function Counter() {
  return (
    <svg
      viewBox="0 0 340 100"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[33%] w-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <rect x="0" y="0" width="340" height="16" rx="6" fill={P.coffee500} />
      <rect x="0" y="14" width="340" height="86" fill={P.coffee800} />
      <path d="M0 44 H340 M0 74 H340" stroke={P.coffee500} strokeWidth="2" opacity="0.35" />
    </svg>
  );
}

/** S3: kucing barista di balik meja, dengan mesin kopi dan cangkir latte yang bisa diketuk. */
export function S03_Barista({ content }: SectionProps) {
  const catRef = useRef<CatHandle>(null);

  return (
    <section
      id={content.id}
      data-section={content.id}
      aria-labelledby="barista-title"
      className="relative flex min-h-dvh flex-col items-center justify-between px-6 pt-24 pb-10 text-center"
    >
      <div className="card-cream max-w-[22rem] px-6 py-5">
        <h2 id="barista-title" className="text-[clamp(1.7rem,8vw,2.3rem)] leading-[1.05] font-extrabold text-balance">
          {content.title}
        </h2>
        <p className="mt-1 text-lg font-semibold text-coffee-800/80">{content.subtitle}</p>
      </div>

      <div className="flex w-full flex-col items-center gap-2">
        <div aria-hidden="true" className="h-[5.5rem] w-full" />
        <div className="relative mx-auto mt-4 w-[min(96vw,400px)]" style={{ aspectRatio: '340 / 290' }}>
          <SpeechBubble owner="barista" placement="barista" />
          <InteractiveCat
            ref={catRef}
            accessory="barista"
            mood="cheerful"
            className="absolute top-[14%] left-[28%] w-[44%]"
          />
          <div className="absolute bottom-[33%] left-[2%] w-[27%]">
            <EspressoMachine />
          </div>
          <div className="absolute right-[3%] bottom-[33%] w-[28%]">
            <LatteCup catRef={catRef} />
          </div>
          <Counter />
        </div>
      </div>
    </section>
  );
}
