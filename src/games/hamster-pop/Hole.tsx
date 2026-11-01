import { AnimatePresence, m } from 'framer-motion';
import { GAME_COPY } from '@/content/games';
import { Hamster } from '@/components/characters/Hamster';
import type { useHamsterPop } from './useHamsterPop';

type PopState = ReturnType<typeof useHamsterPop>['turn'];

interface Props {
  active: boolean;
  index: number;
  lowMotion: boolean;
  onTap: (index: number) => void;
  turn: PopState;
}

export function Hole({ active, index, lowMotion, onTap, turn }: Props) {
  const occupied = turn.holeIndex === index && (turn.phase === 'visible' || turn.phase === 'happy');
  const targetHole = turn.holeIndex === index;

  return (
    <m.button
      type="button"
      aria-label={GAME_COPY.hamsterPop.holeAriaLabel(index + 1, occupied)}
      onClick={() => onTap(index)}
      whileTap={{ scale: 0.96 }}
      data-active={active}
      data-speed="0"
      data-phase={targetHole ? turn.phase : 'idle'}
      className="wheel-stage hamster-hole-button touch-manipulation focus-visible:outline-offset-2"
    >
      <span aria-hidden="true" className="hamster-hole-mound">
        <span className="hamster-hole-opening" />
      </span>
      <AnimatePresence initial={false}>
        {occupied && (
          <m.span
            key={`hamster-${turn.turn}`}
            initial={lowMotion ? { opacity: 0, y: 26, scale: 0.9 } : { opacity: 0, y: 54, scale: 0.72, rotate: -5 }}
            animate={
              lowMotion
                ? { opacity: 1, y: 0, scale: 1 }
                : turn.phase === 'happy'
                  ? { opacity: 1, y: [0, -14, 2, 0], scale: [1, 0.86, 1.12, 1], rotate: [0, -5, 5, 0] }
                  : { opacity: 1, y: [8, -4, 0], scale: [0.88, 1.06, 1], rotate: [-4, 2, 0] }
            }
            exit={lowMotion ? { opacity: 0, y: 24, scale: 0.9 } : { opacity: 0, y: 50, scale: 0.78, rotate: 5 }}
            transition={
              lowMotion
                ? { duration: 0.18, ease: 'easeOut' }
                : { type: 'spring', stiffness: turn.phase === 'happy' ? 340 : 260, damping: 15 }
            }
            className="hamster-hole-occupant"
          >
            <Hamster expression={turn.phase === 'happy' ? 'happy' : 'idle'} />
          </m.span>
        )}
      </AnimatePresence>
    </m.button>
  );
}
