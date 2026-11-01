import type { ComponentType } from 'react';
import { SECTION_CONTENT, type SectionId } from '@/content/sections';
import { SYSTEM } from '@/content/system';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { S02_Hero } from './S02_Hero';
import { S03_Barista } from './S03_Barista';
import { S04_CoffeeBeans } from './S04_CoffeeBeans';
import { S05_Hamster } from './S05_Hamster';
import { S06_HamsterPop } from './S06_HamsterPop';
import { S07_Rabbits } from './S07_Rabbits';
import { S08_Fox } from './S08_Fox';
import { S09_RedPanda } from './S09_RedPanda';
import { S10_CardMatch } from './S10_CardMatch';
import { S11_Closing } from './S11_Closing';
import type { SectionProps } from './types';

/**
 * Registry urutan section (S2 sampai S11). Layar pembuka (S1) adalah overlay Preloader.
 * Ganti PlaceholderSection dengan komponen asli seiring tahap pengerjaan.
 */
const COMPONENTS: Record<SectionId, ComponentType<SectionProps>> = {
  hero: S02_Hero,
  barista: S03_Barista,
  'game-beans': S04_CoffeeBeans,
  hamster: S05_Hamster,
  'game-hamster': S06_HamsterPop,
  rabbits: S07_Rabbits,
  fox: S08_Fox,
  redpanda: S09_RedPanda,
  'game-cards': S10_CardMatch,
  closing: S11_Closing,
};

export function Sections() {
  return (
    <>
      {SECTION_CONTENT.map((content, index) => {
        const Component = COMPONENTS[content.id];
        return (
          <ErrorBoundary
            key={content.id}
            fallback={
              <section
                id={content.id}
                data-section={content.id}
                className="flex min-h-dvh items-center justify-center px-6 text-center text-xl font-extrabold"
              >
                {SYSTEM.sectionError}
              </section>
            }
          >
            <Component content={content} index={index} />
          </ErrorBoundary>
        );
      })}
    </>
  );
}
