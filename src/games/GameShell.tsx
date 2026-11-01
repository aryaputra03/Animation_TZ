import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { say } from "@/core/bubbles";
import { spawnSparkles } from "@/core/fx";
import { useAppStore } from "@/store/useAppStore";
import { GAME_COPY } from "@/content/games";
import type { SectionId } from "@/content/sections";
import { GAME_CONFIG } from "./config";
import type { GameId, GameApi, GameShellState } from "./types";
import { useGameShell } from "./useGameShell";
import { CappuccinoSticker } from "./coffee-beans/CappuccinoSticker";
import { HamsterBonkSticker } from "./hamster-pop/HamsterBonkSticker";
import { RedPandaMemorySticker } from "./card-match/RedPandaMemorySticker";
import { SpeechBubble } from "@/components/ui/SpeechBubble";

interface Props {
  id: GameId;
  section: SectionId;
  title: string;
  instruction: string;
  startLabel: string;
  softCapMs: number;
  children: (api: GameApi) => ReactNode;
}

/** Shared intro, play, and win flow for each required minigame. */
export function GameShell({ id, section, title, instruction, startLabel, softCapMs, children }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const previousState = useRef<GameShellState>("intro");
  const perfMode = useAppStore((state) => state.perfMode);
  const setActiveGameId = useAppStore((state) => state.setActiveGameId);

  const onComplete = useCallback(() => say("gameEnd", { section }), [section]);
  const game = useGameShell({ id, softCapMs, rootRef, onComplete });

  useEffect(() => {
    if (game.state !== "playing") {
      if (useAppStore.getState().activeGameId === id) setActiveGameId(null);
      return;
    }

    setActiveGameId(id);
    return () => {
      if (useAppStore.getState().activeGameId === id) setActiveGameId(null);
    };
  }, [game.state, id, setActiveGameId]);

  useEffect(() => {
    const previous = previousState.current;
    previousState.current = game.state;
    const becameTerminal = previous === "playing" && game.state === "success";
    if (!becameTerminal) return;
    spawnSparkles(
      fxRef.current,
      perfMode === "low" ? GAME_CONFIG.common.lowWinParticles : GAME_CONFIG.common.winParticles,
    );
  }, [game.state, perfMode]);

  const start = () => {
    if (game.state !== "intro") return;
    say("gameStart", { section });
    game.start();
  };

  return (
    <section
      ref={rootRef}
      id={section}
      data-section={section}
      data-game-state={game.state}
      aria-labelledby={`${section}-title`}
      className="relative flex min-h-dvh flex-col items-center justify-center gap-5 px-5 py-24 text-center"
    >
      <div ref={fxRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-20" />
      <div className="sr-only" role="status" aria-live="polite">
        {game.announcement}
      </div>

      {game.state === "intro" && (
        <div className="card-cream z-10 flex w-full max-w-[24rem] flex-col items-center gap-4 px-6 py-6">
          <h2 id={`${section}-title`} className="text-[clamp(1.7rem,8vw,2.3rem)] leading-[1.05] font-extrabold text-balance">
            {title}
          </h2>
          <p className="text-lg font-semibold text-coffee-800/80">{instruction}</p>
          <div className="flex w-full flex-wrap justify-center gap-3">
            <button
              type="button"
              aria-label={GAME_COPY.startAriaLabel(title)}
              onClick={start}
              className="min-h-12 min-w-28 rounded-full bg-matcha-700 px-6 py-3 font-extrabold text-cream-50 active:scale-95"
            >
              {startLabel}
            </button>
          </div>
        </div>
      )}

      {game.state === "playing" && createPortal(
        <div className="game-play-overlay fixed inset-0 z-[55] flex min-h-dvh items-center justify-center overscroll-contain px-[calc(env(safe-area-inset-left,0px)+1rem)] pt-[calc(env(safe-area-inset-top,0px)+3.5rem)] pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] text-center">
          <div className="flex w-full max-w-[30rem] flex-col items-center gap-2">
            <div className="card-cream flex min-h-16 w-full items-center justify-center px-4 py-2 text-center">
              <div>
                <h2 id={`${section}-title`} className="text-lg leading-tight font-extrabold">{title}</h2>
                <p className="text-sm font-semibold text-coffee-800/80">{instruction}</p>
              </div>
            </div>
            <SpeechBubble owner="mini" placement="game" />
            {children(game.api)}
          </div>
        </div>,
        document.body,
      )}

      {game.state === "success" && (
        <div className="card-cream z-10 flex w-full max-w-[24rem] flex-col items-center gap-4 px-6 py-6">
          <h2 id={`${section}-title`} className="text-[clamp(1.7rem,8vw,2.3rem)] leading-[1.05] font-extrabold text-balance">
            {title}
          </h2>
          {game.state === "success" && id === "coffee-beans" && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-xl font-extrabold text-coffee-800">{GAME_COPY.coffeeBeans.reward}</p>
              <CappuccinoSticker />
            </div>
          )}
          {game.state === "success" && id === "hamster-pop" && (
            <div className="flex flex-col items-center gap-1">
              <p className="max-w-[18rem] text-center text-base leading-snug font-extrabold text-coffee-800">
                {GAME_COPY.hamsterPop.stickerCaption}
              </p>
              <HamsterBonkSticker />
            </div>
          )}
          {game.state === "success" && id === "card-match" && (
            <div className="flex flex-col items-center gap-1">
              <p className="max-w-[18rem] text-center text-base leading-snug font-extrabold text-coffee-800">
                {GAME_COPY.cardMatch.stickerCaption}
              </p>
              <RedPandaMemorySticker />
            </div>
          )}
          <div className="flex w-full flex-wrap justify-center gap-3">
            <button
              type="button"
              aria-label={GAME_COPY.replayAriaLabel(title)}
              onClick={game.replay}
              className="min-h-12 min-w-32 rounded-full bg-cream-200 px-5 py-3 font-extrabold text-coffee-800 active:scale-95"
            >
              {GAME_COPY.replay}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
