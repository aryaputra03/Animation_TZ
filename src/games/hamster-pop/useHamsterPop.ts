import { useCallback, useEffect, useRef, useState } from 'react';
import { SoundManager } from '@/audio/SoundManager';
import { GAME_COPY } from '@/content/games';
import { say } from '@/core/bubbles';
import { HAPTIC, vibrate } from '@/core/haptics';
import { GAME_CONFIG } from '@/games/config';
import type { GameApi } from '@/games/types';

type PopPhase = 'waiting' | 'visible' | 'happy' | 'hiding';

interface PopTurn {
  phase: PopPhase;
  holeIndex: number | null;
  taps: number;
  turn: number;
}

const INITIAL_TURN: PopTurn = {
  phase: 'waiting',
  holeIndex: null,
  taps: 0,
  turn: 0,
};

function randomBetween(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function useHamsterPop(api: GameApi) {
  const { active, runId, announce, complete, setProgress } = api;
  const config = GAME_CONFIG.hamsterPop;
  const [turn, setTurnState] = useState<PopTurn>(INITIAL_TURN);
  const turnRef = useRef(turn);
  const remainingMs = useRef<number | null>(
    randomBetween(config.spawnDelayMinMs, config.spawnDelayMaxMs),
  );
  const lastHole = useRef<number | null>(null);

  const updateTurn = useCallback((next: PopTurn, durationMs: number) => {
    turnRef.current = next;
    remainingMs.current = durationMs;
    setTurnState(next);
  }, []);

  const handleTimer = useCallback(() => {
    const current = turnRef.current;

    if (current.phase === 'waiting') {
      const candidates = Array.from({ length: config.holeCount }, (_, index) => index)
        .filter((index) => index !== lastHole.current);
      const nextHole = candidates[Math.floor(Math.random() * candidates.length)] ?? 0;
      lastHole.current = nextHole;
      SoundManager.play('ui.pop');
      announce(GAME_COPY.hamsterPop.appearedAnnouncement);
      updateTurn(
        { ...current, phase: 'visible', holeIndex: nextHole, turn: current.turn + 1 },
        randomBetween(config.stayMinMs, config.stayMaxMs),
      );
      return;
    }

    if (current.phase === 'visible' || current.phase === 'happy') {
      updateTurn(
        { ...current, phase: 'hiding', turn: current.turn + 1 },
        config.hideMs,
      );
      return;
    }

    if (current.taps >= config.targetTaps) {
      SoundManager.play('hamster.squeak', { pitch: 1.15 });
      SoundManager.play('ui.ting', { delay: 0.1 });
      vibrate(HAPTIC.tap);
      announce(GAME_COPY.hamsterPop.successAnnouncement);
      complete();
      return;
    }

    updateTurn(
      { ...current, phase: 'waiting', holeIndex: null, turn: current.turn + 1 },
      randomBetween(config.spawnDelayMinMs, config.spawnDelayMaxMs),
    );
  }, [announce, complete, config, updateTurn]);

  useEffect(() => {
    if (!active) return;

    const current = turnRef.current;
    const durationMs = remainingMs.current ?? config.spawnDelayMinMs;
    const startedAt = performance.now();
    let completed = false;
    const timer = window.setTimeout(() => {
      completed = true;
      remainingMs.current = null;
      handleTimer();
    }, durationMs);

    return () => {
      window.clearTimeout(timer);
      if (
        !completed &&
        turnRef.current.phase === current.phase &&
        turnRef.current.turn === current.turn
      ) {
        remainingMs.current = Math.max(0, durationMs - (performance.now() - startedAt));
      }
    };
  }, [active, config.spawnDelayMinMs, handleTimer, runId, turn.phase, turn.turn]);

  const tapHole = useCallback((holeIndex: number) => {
    const current = turnRef.current;
    if (current.phase !== 'visible' || current.holeIndex !== holeIndex) return;

    const taps = current.taps + 1;
    SoundManager.play('hamster.squeak');
    vibrate(HAPTIC.tap);
    say('react', { id: 'hamster-pop-hit', section: 'game-hamster' });
    announce(GAME_COPY.hamsterPop.hitAnnouncement);
    setProgress(taps / config.targetTaps);
    updateTurn(
      { ...current, phase: 'happy', taps, turn: current.turn + 1 },
      config.happyMs,
    );
  }, [announce, config.happyMs, config.targetTaps, setProgress, updateTurn]);

  return { turn, tapHole, targetTaps: config.targetTaps, holeCount: config.holeCount, columns: config.columns, active };
}
