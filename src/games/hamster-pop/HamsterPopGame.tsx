import { m, type Variants } from 'framer-motion';
import { GAME_COPY } from '@/content/games';
import { useAppStore } from '@/store/useAppStore';
import type { GameApi } from '@/games/types';
import { Hole } from './Hole';
import { useHamsterPop } from './useHamsterPop';

const HEART_VARIANTS: Variants = {
  empty: { scale: 1, rotate: 0 },
  filled: { scale: [1, 1.42, 0.94, 1], rotate: [0, -12, 7, 0] },
};

export function HamsterPopGame({ api }: { api: GameApi }) {
  const game = useHamsterPop(api);
  const lowMotion = useAppStore((state) => state.perfMode === 'low');
  const hearts = Array.from({ length: game.targetTaps }, (_, index) => index);

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div
        role="progressbar"
        aria-label={GAME_COPY.hamsterPop.progressLabel}
        aria-valuemin={0}
        aria-valuemax={game.targetTaps}
        aria-valuenow={game.turn.taps}
        className="card-cream flex min-h-8 items-center justify-center gap-2 px-2 text-xl leading-none"
      >
        {hearts.map((heart) => (
          <m.span
            key={heart}
            aria-hidden="true"
            initial={false}
            variants={HEART_VARIANTS}
            animate={heart < game.turn.taps && !lowMotion ? 'filled' : 'empty'}
            transition={{ duration: lowMotion ? 0.16 : 0.42, ease: 'easeOut' }}
            className={heart < game.turn.taps ? 'text-blush-300' : 'text-coffee-500/30'}
          >
            ♥
          </m.span>
        ))}
      </div>

      <div className="hamster-ground">
        <div
          className="hamster-pop-grid"
          style={{ gridTemplateColumns: `repeat(${game.columns}, minmax(96px, 1fr))` }}
        >
          {Array.from({ length: game.holeCount }, (_, index) => (
            <Hole
              key={index}
              active={game.active}
              index={index}
              lowMotion={lowMotion}
              onTap={game.tapHole}
              turn={game.turn}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
