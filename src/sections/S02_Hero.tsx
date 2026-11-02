import { SYSTEM } from '@/content/system';
import { SECRET_GIFT_BLOOM_REPLAY_BUTTON } from '@/content/closing';
import { InteractiveCat } from '@/components/characters/InteractiveCat';
import { CupBack, CupFront } from '@/components/props/Cup';
import { SpeechBubble } from '@/components/ui/SpeechBubble';
import { useAppStore } from '@/store/useAppStore';
import type { SectionProps } from './types';

/** S2: kucing oren mengintip dari dalam cangkir kopi. */
export function S02_Hero({ content }: SectionProps) {
  const giftBloomSeen = useAppStore((state) => state.giftBloomSeen);
  const openGiftBloom = useAppStore((state) => state.openGiftBloom);

  return (
    <section
      id={content.id}
      data-section={content.id}
      aria-labelledby="hero-title"
      className="relative flex min-h-dvh flex-col items-center justify-between px-6 pt-24 pb-8 text-center"
    >
      <div className="card-cream max-w-[22rem] px-6 py-5">
        <h1 id="hero-title" className="text-[clamp(1.9rem,9vw,2.6rem)] leading-[1.05] font-extrabold text-balance">
          {content.title}
        </h1>
        <p className="mt-1 text-lg font-semibold text-coffee-800/80">{content.subtitle}</p>
        {giftBloomSeen && (
          <button
            type="button"
            className="btn-matcha mt-3 flex min-h-12 w-full items-center justify-center rounded-full px-4 text-base font-extrabold focus-visible:outline-offset-2"
            onClick={openGiftBloom}
          >
            {SECRET_GIFT_BLOOM_REPLAY_BUTTON}
          </button>
        )}
      </div>

      <div className="flex w-full flex-col items-center gap-2">
        <SpeechBubble owner="hero" />
        <div className="relative mx-auto mt-14 w-[min(88vw,340px)]" style={{ aspectRatio: '300 / 220' }}>
          <CupBack />
          <InteractiveCat accessory="kids" className="absolute bottom-[33%] left-[21%] w-[58%]" />
          <CupFront />
        </div>
        <p aria-hidden="true" className="nudge mt-3 text-base font-bold text-coffee-800">
          ↓ {SYSTEM.scrollHint}
        </p>
      </div>
    </section>
  );
}
