import { GAME_CONFIG } from "@/games/config";
import { GAME_COPY } from "@/content/games";
import { CoffeeBeansGame } from "@/games/coffee-beans/CoffeeBeansGame";
import { GameShell } from "@/games/GameShell";
import type { SectionProps } from "./types";

export function S04_CoffeeBeans({ content }: SectionProps) {
  return (
    <GameShell
      id="coffee-beans"
      section={content.id}
      title={content.title}
      instruction={content.subtitle}
      startLabel={GAME_COPY.coffeeBeans.start}
      softCapMs={GAME_CONFIG.coffeeBeans.softCapMs}
    >
      {(api) => <CoffeeBeansGame api={api} />}
    </GameShell>
  );
}
