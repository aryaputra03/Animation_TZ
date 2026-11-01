import { GAME_COPY } from "@/content/games";
import { GAME_CONFIG } from "@/games/config";
import { GameShell } from "@/games/GameShell";
import { CardMatchGame } from "@/games/card-match/CardMatchGame";
import type { SectionProps } from "./types";

export function S10_CardMatch({ content }: SectionProps) {
  return (
    <GameShell
      id="card-match"
      section={content.id}
      title={content.title}
      instruction={content.subtitle}
      startLabel={GAME_COPY.cardMatch.start}
      softCapMs={GAME_CONFIG.cardMatch.softCapMs}
    >
      {(api) => <CardMatchGame api={api} />}
    </GameShell>
  );
}
