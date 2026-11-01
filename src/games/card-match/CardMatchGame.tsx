import { GAME_COPY } from "@/content/games";
import type { GameApi } from "@/games/types";
import { Card } from "./Card";
import { useCardMatch } from "./useCardMatch";

export function CardMatchGame({ api }: { api: GameApi }) {
  const game = useCardMatch(api);
  const locked = !api.active || game.stage !== "ready";

  return (
    <div
      role="group"
      aria-label={GAME_COPY.cardMatch.cardGroupLabel}
      className="card-match-grid"
      data-speed="0"
    >
      {game.cards.map((card, index) => (
        <Card
          key={card.id}
          card={card}
          cardNumber={index + 1}
          faceUp={game.revealedIds.includes(card.id)}
          matched={game.matchedIds.includes(card.id)}
          mismatched={game.stage === "resolving" && game.selectionIds.includes(card.id)}
          locked={locked}
          lowMotion={game.lowMotion}
          onSelect={game.chooseCard}
        />
      ))}
    </div>
  );
}
