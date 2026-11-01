import { m, type Variants } from "framer-motion";
import { GAME_COPY } from "@/content/games";
import type { AnimalCard } from "./useCardMatch";
import { CardAnimal } from "./CardAnimal";

const CARD_VARIANTS: Variants = {
  closed: { rotateY: 0, scale: 1 },
  open: { rotateY: 180, scale: 1 },
  matched: {
    rotateY: 180,
    scale: [1, 1.08, 1],
    y: [0, -5, 0],
    transition: { duration: 0.46, ease: "easeOut" },
  },
};

interface Props {
  card: AnimalCard;
  cardNumber: number;
  faceUp: boolean;
  matched: boolean;
  mismatched: boolean;
  locked: boolean;
  lowMotion: boolean;
  onSelect: (id: number) => void;
}

export function Card({ card, cardNumber, faceUp, matched, mismatched, locked, lowMotion, onSelect }: Props) {
  const variant = matched && !lowMotion ? "matched" : faceUp ? "open" : "closed";
  const label = GAME_COPY.cardMatch.cardAriaLabel(
    cardNumber,
    faceUp ? GAME_COPY.cardMatch.animals[card.animal] : null,
    matched,
    GAME_COPY.cardMatch.cardBackLabel,
  );

  return (
    <div className="card-match-perspective">
      <m.button
        type="button"
        aria-label={label}
        aria-pressed={faceUp}
        data-matched={matched}
        disabled={locked || matched || faceUp}
        onClick={() => onSelect(card.id)}
        initial={false}
        variants={CARD_VARIANTS}
        animate={variant}
        transition={{ duration: lowMotion ? 0.14 : 0.3, ease: "easeInOut" }}
        whileTap={lowMotion || locked || matched || faceUp ? undefined : { scale: 0.96 }}
        style={{ transformStyle: "preserve-3d" }}
        className="card-match-button touch-manipulation rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest-900 disabled:cursor-default"
      >
        <span aria-hidden="true" className="card-match-face card-match-back">
          <svg viewBox="0 0 64 64" className="h-10 w-10" fill="none">
            <ellipse cx="32" cy="43" rx="13" ry="10" fill="#fff8e7" />
            <ellipse cx="15" cy="27" rx="6" ry="8" fill="#fff8e7" transform="rotate(-24 15 27)" />
            <ellipse cx="28" cy="20" rx="6" ry="8" fill="#fff8e7" transform="rotate(-8 28 20)" />
            <ellipse cx="42" cy="22" rx="6" ry="8" fill="#fff8e7" transform="rotate(14 42 22)" />
            <ellipse cx="52" cy="31" rx="6" ry="8" fill="#fff8e7" transform="rotate(32 52 31)" />
          </svg>
        </span>
        <span aria-hidden="true" className="card-match-face card-match-front">
          <CardAnimal animal={card.animal} matched={matched} mismatched={mismatched} />
        </span>
      </m.button>
    </div>
  );
}
