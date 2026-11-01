import { Cat } from "@/components/characters/Cat";
import { Fox } from "@/components/characters/Fox";
import { Hamster } from "@/components/characters/Hamster";
import { Rabbit } from "@/components/characters/Rabbit";
import { RedPanda } from "@/components/characters/RedPanda";
import type { Expression } from "@/components/characters/Character.types";
import type { CardAnimalId } from "./useCardMatch";

interface Props {
  animal: CardAnimalId;
  matched: boolean;
  mismatched: boolean;
}

export function CardAnimal({ animal, matched, mismatched }: Props) {
  const expression: Expression = matched ? "happy" : mismatched ? "grumpy" : "idle";

  return (
    <span className="card-match-animal" aria-hidden="true">
      {animal === "cat" && <Cat expression={expression} className="block h-full w-full" />}
      {animal === "hamster" && <Hamster expression={expression} />}
      {animal === "rabbit" && <Rabbit expression={expression} />}
      {animal === "fox" && <Fox expression={expression} />}
      {animal === "redPanda" && <RedPanda expression={expression} />}
    </span>
  );
}
