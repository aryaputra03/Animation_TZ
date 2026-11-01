import { useEffect, useRef, useState, type ReactNode } from 'react';
import { m, useAnimationControls } from 'framer-motion';
import { SoundManager, type SoundId } from '@/audio/SoundManager';
import { CLOSING_ANIMAL_LABELS, CLOSING_BUTTON, CLOSING_FAREWELL_MESSAGE, CLOSING_GROUP_LABEL, CLOSING_HINT, CLOSING_MESSAGE, CLOSING_MOON_LABEL, SECRET_ROOM_LOCKED_MESSAGE, SECRET_ROOM_LOCKED_TITLE } from '@/content/closing';
import { hide, say } from '@/core/bubbles';
import { useInView } from '@/core/hooks/useInView';
import { useAppStore } from '@/store/useAppStore';
import { Cat } from '@/components/characters/Cat';
import { Fox } from '@/components/characters/Fox';
import { Hamster } from '@/components/characters/Hamster';
import { Rabbit } from '@/components/characters/Rabbit';
import { RedPanda } from '@/components/characters/RedPanda';
import { REQUIRED_GAME_IDS } from '@/games/types';
import { SecretGiftBloom } from './SecretGiftBloom';
import { SecretGiftDialog } from './SecretGiftDialog';
import type { SectionProps } from './types';

const CHOIR: readonly { sound: SoundId; delay: number; pitch: number }[] = [
  { sound: 'cat.meow', delay: 0, pitch: 1 },
  { sound: 'hamster.squeak', delay: 0.28, pitch: 1.02 },
  { sound: 'rabbit.chirp', delay: 0.56, pitch: 1.12 },
  { sound: 'fox.yip', delay: 0.84, pitch: 0.95 },
  { sound: 'redpanda.twitter', delay: 1.12, pitch: 1.08 },
  { sound: 'closing.choir', delay: 2.28, pitch: 1 },
];

interface ClosingAnimalButtonProps {
  active: boolean;
  children: ReactNode;
  className?: string;
  label: string;
  onFarewell: () => void;
  sound: SoundId;
}

function ClosingAnimalButton({ active, children, className = '', label, onFarewell, sound }: ClosingAnimalButtonProps) {
  const controls = useAnimationControls();

  const handleTap = () => {
    SoundManager.play(sound);
    onFarewell();
    void controls.start({
      scale: [1, 0.88, 1.08, 1],
      rotate: [0, -4, 3, 0],
      transition: { duration: 0.48, ease: 'easeOut' },
    });
  };

  return (
    <m.button
      type="button"
      aria-label={label}
      animate={controls}
      whileTap={{ scale: 0.88 }}
      onClick={handleTap}
      data-active={active}
      data-state="rest"
      className={`closing-animal flex h-24 w-[clamp(3rem,16vw,4.25rem)] min-w-12 items-end justify-center rounded-2xl focus-visible:outline-offset-2 ${className}`}
    >
      {children}
    </m.button>
  );
}

export function S11_Closing({ content }: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const choirTimer = useRef<number | null>(null);
  const active = useInView(sectionRef, 0.1);
  const secretRoomUnlocked = useAppStore((state) =>
    REQUIRED_GAME_IDS.every((gameId) => state.gameResults[gameId] === 'success'),
  );
  const perfMode = useAppStore((state) => state.perfMode);
  const catName = useAppStore((state) => state.catName);
  const giftBloomActive = useAppStore((state) => state.giftBloomActive);
  const unlockGiftBloom = useAppStore((state) => state.unlockGiftBloom);
  const closeGiftBloom = useAppStore((state) => state.closeGiftBloom);
  const [singing, setSinging] = useState(false);
  const [singingKey, setSingingKey] = useState(0);
  const [farewellShown, setFarewellShown] = useState(false);
  const [giftDialogOpen, setGiftDialogOpen] = useState(false);

  const sayFarewell = () => setFarewellShown(true);

  useEffect(() => () => {
    if (choirTimer.current !== null) window.clearTimeout(choirTimer.current);
  }, []);

  const startChoir = () => {
    if (choirTimer.current !== null) return;

    hide();
    say('system', { id: 'closing-choir', section: 'closing' });
    setSinging(true);
    setSingingKey((key) => key + 1);
    CHOIR.forEach(({ sound, delay, pitch }) => {
      SoundManager.play(sound, { delay, pitch, pitchJitter: 0 });
    });
    choirTimer.current = window.setTimeout(() => {
      choirTimer.current = null;
      setSinging(false);
    }, 3000);
  };

  const particleCount = perfMode === 'low' ? 3 : 8;

  if (!secretRoomUnlocked) {
    return (
      <section
        ref={sectionRef}
        id={content.id}
        data-section={content.id}
        data-active={active}
        data-secret-room-locked="true"
        aria-labelledby="closing-title"
        className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 py-24 text-center"
      >
        <div className="card-cream z-10 flex w-full max-w-[24rem] flex-col items-center gap-4 px-6 py-8">
          <svg viewBox="0 0 64 64" aria-hidden="true" className="h-14 w-14">
            <rect x="12" y="27" width="40" height="31" rx="8" fill="var(--color-matcha-300)" stroke="var(--color-coffee-800)" strokeWidth="4" />
            <path d="M21 27v-8a11 11 0 0 1 22 0v8" fill="none" stroke="var(--color-coffee-800)" strokeWidth="5" strokeLinecap="round" />
            <circle cx="32" cy="41" r="4" fill="var(--color-coffee-800)" />
            <path d="M32 45v6" stroke="var(--color-coffee-800)" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <h2 id="closing-title" className="text-[clamp(1.65rem,7.4vw,2.1rem)] leading-tight font-extrabold text-balance">
            {SECRET_ROOM_LOCKED_TITLE}
          </h2>
          <p className="max-w-[20rem] text-lg leading-snug font-semibold text-coffee-800/80">
            {SECRET_ROOM_LOCKED_MESSAGE}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id={content.id}
      data-section={content.id}
      data-active={active}
      aria-labelledby="closing-title"
      className="relative flex min-h-dvh flex-col items-center justify-center gap-3 overflow-hidden px-4 pt-[calc(env(safe-area-inset-top,0px)+1rem)] pb-[calc(env(safe-area-inset-bottom,0px)+7rem)] text-center"
    >
      <m.button
        type="button"
        aria-label={CLOSING_MOON_LABEL}
        onClick={startChoir}
        whileTap={{ scale: 0.88, rotate: -8 }}
        className="closing-moon absolute top-[calc(env(safe-area-inset-top,0px)+0.75rem)] right-[calc(env(safe-area-inset-right,0px)+1rem)] z-20 flex h-16 w-16 min-w-12 items-center justify-center rounded-full focus-visible:outline-offset-2"
      >
        <svg viewBox="0 0 72 72" aria-hidden="true" className="h-full w-full overflow-visible">
          <path d="M46 8a28 28 0 1 0 0 56A22 22 0 0 1 46 8Z" fill="var(--color-sun-400)" />
          <circle cx="18" cy="16" r="2" fill="var(--color-cream-50)" />
          <circle cx="12" cy="36" r="1.5" fill="var(--color-cream-50)" />
          <circle cx="22" cy="55" r="1.5" fill="var(--color-cream-50)" />
        </svg>
      </m.button>

      <div className="card-cream z-10 mt-20 max-w-[22rem] px-5 py-4">
        <h2 id="closing-title" className="text-[clamp(1.65rem,7.4vw,2.1rem)] leading-tight font-extrabold text-balance">
          {content.title}
        </h2>
      </div>

      {farewellShown && (
        <m.p
          role="status"
          aria-live="polite"
          initial={perfMode === 'low' ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="closing-farewell-bubble card-cream z-20 mt-3 w-full max-w-[22rem] px-5 py-2 text-base leading-snug font-bold"
        >
          {CLOSING_FAREWELL_MESSAGE}
        </m.p>
      )}

      <div className="relative mt-2 flex w-full max-w-sm items-end justify-center gap-1" role="group" aria-label={CLOSING_GROUP_LABEL}>
        <ClosingAnimalButton active={active} label={CLOSING_ANIMAL_LABELS.cat(catName)} onFarewell={sayFarewell} sound="cat.meow">
          <Cat expression="happy" className="block h-auto w-full" />
        </ClosingAnimalButton>
        <ClosingAnimalButton active={active} className="wheel-stage" label={CLOSING_ANIMAL_LABELS.hamster} onFarewell={sayFarewell} sound="hamster.squeak">
          <Hamster expression="happy" />
        </ClosingAnimalButton>
        <ClosingAnimalButton active={active} className="rabbit-stage" label={CLOSING_ANIMAL_LABELS.rabbit} onFarewell={sayFarewell} sound="rabbit.chirp">
          <Rabbit expression="happy" />
        </ClosingAnimalButton>
        <ClosingAnimalButton active={active} className="fox-stage" label={CLOSING_ANIMAL_LABELS.fox} onFarewell={sayFarewell} sound="fox.yip">
          <Fox expression="happy" />
        </ClosingAnimalButton>
        <ClosingAnimalButton active={active} label={CLOSING_ANIMAL_LABELS.redPanda} onFarewell={sayFarewell} sound="redpanda.twitter">
          <RedPanda expression="happy" />
        </ClosingAnimalButton>

        {singing && (
          <div key={singingKey} aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-visible">
            {Array.from({ length: particleCount }, (_, index) => (
              <m.span
                key={`${singingKey}-${index}`}
                className="absolute text-2xl leading-none"
                style={{ left: `${12 + index * (76 / Math.max(particleCount - 1, 1))}%`, top: `${38 + (index % 3) * 10}%` }}
                initial={{ opacity: 0, scale: 0.6, x: 0, y: 10 }}
                animate={{ opacity: [0, 1, 0], scale: [0.65, 1, 1.1], x: index % 2 === 0 ? -20 : 20, y: -88 }}
                transition={{ duration: 2.7, delay: index * 0.08, ease: 'easeOut' }}
              >
                💚
              </m.span>
            ))}
          </div>
        )}
      </div>

      <div className="card-cream z-10 mt-1 max-w-[22rem] px-5 py-3 text-[1.05rem] leading-snug font-bold">
        {CLOSING_MESSAGE}
      </div>

      <div className="z-10 mt-1 flex w-full max-w-[22rem] flex-col items-center gap-2">
        <m.button
          type="button"
          aria-describedby="closing-action-hint"
          whileTap={{ y: 3, scale: 0.98 }}
          onClick={() => {
            hide();
            setGiftDialogOpen(true);
          }}
          className="btn-matcha flex min-h-14 w-full items-center justify-center px-6 text-lg font-extrabold focus-visible:outline-offset-4"
        >
          {CLOSING_BUTTON}
        </m.button>
        <p id="closing-action-hint" className="card-cream px-3 py-1 text-sm font-semibold">{CLOSING_HINT}</p>
      </div>

      <SecretGiftDialog
        isOpen={giftDialogOpen}
        onClose={() => setGiftDialogOpen(false)}
        onSolved={() => {
          setGiftDialogOpen(false);
          unlockGiftBloom();
        }}
      />
      {giftBloomActive && (
        <SecretGiftBloom
          reducedMotion={perfMode === 'low'}
          onClose={() => {
            closeGiftBloom();
            hide();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </section>
  );
}
