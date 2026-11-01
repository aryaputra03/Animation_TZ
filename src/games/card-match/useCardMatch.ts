import { useCallback, useEffect, useRef, useState } from "react";
import { SoundManager, type SoundId } from "@/audio/SoundManager";
import { GAME_COPY } from "@/content/games";
import { say } from "@/core/bubbles";
import { HAPTIC, vibrate } from "@/core/haptics";
import { GAME_CONFIG } from "@/games/config";
import type { GameApi } from "@/games/types";
import { useAppStore } from "@/store/useAppStore";

export type CardAnimalId = keyof typeof GAME_COPY.cardMatch.animals;

export interface AnimalCard {
  id: number;
  animal: CardAnimalId;
}

type RoundStage = "preview" | "ready" | "resolving" | "finishing" | "done";

interface RoundState {
  cards: AnimalCard[];
  revealedIds: number[];
  selectionIds: number[];
  matchedIds: number[];
  stage: RoundStage;
}

const ANIMALS: CardAnimalId[] = ["cat", "hamster", "rabbit", "fox", "redPanda"];
const CARD_SOUNDS: Record<CardAnimalId, SoundId> = {
  cat: "cat.meow",
  hamster: "hamster.squeak",
  rabbit: "rabbit.chirp",
  fox: "fox.yip",
  redPanda: "redpanda.twitter",
};
const WIN_SOUNDS: SoundId[] = [
  "cat.meowHappy",
  "hamster.squeak",
  "rabbit.chirp",
  "fox.yip",
  "redpanda.twitter",
];

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex] as T, shuffled[index] as T];
  }
  return shuffled;
}

function createRound(): RoundState {
  const pairCount = GAME_CONFIG.cardMatch.cardCount / 2;
  const selectedAnimals = shuffle(ANIMALS).slice(0, pairCount);
  const pairs = selectedAnimals.flatMap((animal, pairIndex) => [
    { id: pairIndex * 2, animal },
    { id: pairIndex * 2 + 1, animal },
  ]);
  const cards = shuffle(pairs);

  return {
    cards,
    revealedIds: cards.map((card) => card.id),
    selectionIds: [],
    matchedIds: [],
    stage: "preview",
  };
}

function playWinSounds(): void {
  SoundManager.play("game.win");
  WIN_SOUNDS.forEach((sound, index) => {
    SoundManager.play(sound, { delay: 0.12 + index * 0.16 });
  });
}

export function useCardMatch(api: GameApi) {
  const { active, announce, complete, setProgress, setSoftCapHandler } = api;
  const [round, setRound] = useState(createRound);
  const roundRef = useRef(round);
  const previewRemaining = useRef<number>(GAME_CONFIG.cardMatch.previewMs);
  const mismatchRemaining = useRef<number>(GAME_CONFIG.cardMatch.mismatchMs);
  const finishRemaining = useRef<number>(GAME_CONFIG.cardMatch.matchedBounceMs);
  const previewAnnounced = useRef(false);
  const lowMotion = useAppStore((state) => state.perfMode === "low");

  const updateRound = useCallback((update: (current: RoundState) => RoundState) => {
    const next = update(roundRef.current);
    roundRef.current = next;
    setRound(next);
    return next;
  }, []);

  const finishAtSoftCap = useCallback(() => {
    const current = roundRef.current;
    if (current.stage === "finishing" || current.stage === "done") return;

    finishRemaining.current = GAME_CONFIG.cardMatch.softCapRevealMs;
    setProgress(1);
    announce(GAME_COPY.cardMatch.completeAnnouncement);
    updateRound((latest) => ({
      ...latest,
      revealedIds: latest.cards.map((card) => card.id),
      selectionIds: [],
      stage: "finishing",
    }));
  }, [announce, setProgress, updateRound]);

  useEffect(() => {
    setSoftCapHandler(finishAtSoftCap);
    return () => setSoftCapHandler(null);
  }, [finishAtSoftCap, setSoftCapHandler]);

  useEffect(() => {
    if (!active || round.stage !== "preview" || previewAnnounced.current) return;
    previewAnnounced.current = true;
    announce(GAME_COPY.cardMatch.previewAnnouncement);
  }, [active, announce, round.stage]);

  useEffect(() => {
    if (!active) return;

    const stage = round.stage;
    const remainingRef =
      stage === "preview"
        ? previewRemaining
        : stage === "resolving"
          ? mismatchRemaining
          : stage === "finishing"
            ? finishRemaining
            : null;
    if (!remainingRef) return;

    const duration = Math.max(0, remainingRef.current);
    const startedAt = performance.now();
    let completed = false;
    const timer = window.setTimeout(() => {
      completed = true;
      remainingRef.current = 0;

      if (stage === "preview") {
        updateRound((current) => ({
          ...current,
          revealedIds: [],
          stage: "ready",
        }));
        return;
      }

      if (stage === "resolving") {
        updateRound((current) => ({
          ...current,
          revealedIds: current.revealedIds.filter((id) => !current.selectionIds.includes(id)),
          selectionIds: [],
          stage: "ready",
        }));
        return;
      }

      playWinSounds();
      updateRound((current) => ({ ...current, stage: "done" }));
      complete();
    }, duration);

    return () => {
      window.clearTimeout(timer);
      if (!completed) {
        remainingRef.current = Math.max(0, duration - (performance.now() - startedAt));
      }
    };
  }, [active, complete, round.stage, updateRound]);

  const chooseCard = useCallback((cardId: number) => {
    if (!active) return;
    const current = roundRef.current;
    if (current.stage !== "ready") return;
    if (current.revealedIds.includes(cardId) || current.matchedIds.includes(cardId)) return;

    const card = current.cards.find((candidate) => candidate.id === cardId);
    if (!card) return;
    SoundManager.play(CARD_SOUNDS[card.animal]);

    const revealedIds = [...current.revealedIds, cardId];
    if (current.selectionIds.length === 0) {
      updateRound((latest) => ({ ...latest, revealedIds, selectionIds: [cardId] }));
      return;
    }

    const firstId = current.selectionIds[0];
    if (firstId === undefined) return;
    const firstCard = current.cards.find((candidate) => candidate.id === firstId);
    if (!firstCard) return;

    if (firstCard.animal === card.animal) {
      const matchedIds = [...current.matchedIds, firstId, cardId];
      const hasWon = matchedIds.length === current.cards.length;
      setProgress(matchedIds.length / current.cards.length);
      announce(
        hasWon ? GAME_COPY.cardMatch.completeAnnouncement : GAME_COPY.cardMatch.matchAnnouncement,
      );
      SoundManager.play("game.match");
      vibrate(HAPTIC.tap);
      say("react", { id: "cards-match", section: "game-cards" });

      if (hasWon) {
        finishRemaining.current = GAME_CONFIG.cardMatch.matchedBounceMs;
      }

      updateRound((latest) => ({
        ...latest,
        revealedIds,
        selectionIds: [],
        matchedIds,
        stage: hasWon ? "finishing" : "ready",
      }));
      return;
    }

    mismatchRemaining.current = GAME_CONFIG.cardMatch.mismatchMs;
    announce(GAME_COPY.cardMatch.mismatchAnnouncement);
    SoundManager.play("game.wrong");
    say("react", { id: "cards-almost", section: "game-cards" });
    updateRound((latest) => ({
      ...latest,
      revealedIds,
      selectionIds: [...current.selectionIds, cardId],
      stage: "resolving",
    }));
  }, [active, announce, setProgress, updateRound]);

  return { ...round, chooseCard, lowMotion };
}
