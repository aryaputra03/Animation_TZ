import { GAME_COPY } from '@/content/games';
import { GAME_CONFIG } from '@/games/config';
import { GameShell } from '@/games/GameShell';
import { HamsterPopGame } from '@/games/hamster-pop/HamsterPopGame';
import type { SectionProps } from './types';

export function S06_HamsterPop({ content }: SectionProps) {
  return (
    <GameShell
      id="hamster-pop"
      section={content.id}
      title={content.title}
      instruction={content.subtitle}
      startLabel={GAME_COPY.hamsterPop.start}
      softCapMs={GAME_CONFIG.hamsterPop.softCapMs}
    >
      {(api) => <HamsterPopGame api={api} />}
    </GameShell>
  );
}
