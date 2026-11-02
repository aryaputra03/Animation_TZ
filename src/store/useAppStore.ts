import { create } from 'zustand';
import { SoundManager } from '@/audio/SoundManager';
import type { SectionId } from '@/content/sections';
import { DEFAULT_CAT_NAME } from '@/content/system';
import { unlockScroll } from '@/core/scrollLock';
import { detectInitialPerfMode, type PerfMode } from '@/core/performance';
import { REQUIRED_GAME_IDS, type GameId, type GameResult } from '@/games/types';
import { loadMuted, loadStoredCatName, saveCatName, saveMuted, sanitizeCatName } from './storage';

export interface BubbleState {
  id: number;
  text: string;
  /** Pemilik balon: id section (kucing besar) atau 'mini'. */
  owner: string;
}

interface AppState {
  started: boolean;
  catName: string;
  muted: boolean;
  perfMode: PerfMode;
  activeSectionId: SectionId | null;
  activeGameId: GameId | null;
  giftBloomUnlocked: boolean;
  giftBloomActive: boolean;
  bubble: BubbleState | null;
  gameResults: Partial<Record<GameId, GameResult>>;

  start: (rawName: string) => void;
  setMuted: (muted: boolean) => void;
  setPerfMode: (mode: PerfMode) => void;
  setActiveSection: (id: SectionId) => void;
  setActiveGameId: (id: GameId | null) => void;
  openGiftBloom: () => void;
  closeGiftBloom: () => void;
  setBubble: (bubble: BubbleState | null) => void;
  setGameResult: (id: GameId, result: GameResult) => void;
}

const initialMuted = loadMuted();
SoundManager.setMuted(initialMuted);

export const useAppStore = create<AppState>((set) => ({
  started: false,
  catName: loadStoredCatName() ?? DEFAULT_CAT_NAME,
  muted: initialMuted,
  perfMode: detectInitialPerfMode(),
  activeSectionId: null,
  activeGameId: null,
  giftBloomUnlocked: false,
  giftBloomActive: false,
  bubble: null,
  gameResults: {},

  start: (rawName) => {
    const catName = sanitizeCatName(rawName);
    saveCatName(catName);
    set({ started: true, catName });
    window.scrollTo(0, 0);
    unlockScroll('preloader');
  },

  setMuted: (muted) => {
    SoundManager.setMuted(muted);
    saveMuted(muted);
    set({ muted });
  },

  setPerfMode: (perfMode) => set({ perfMode }),

  setActiveSection: (activeSectionId) => set({ activeSectionId }),

  setActiveGameId: (activeGameId) => set({ activeGameId }),

  openGiftBloom: () =>
    set((state) => state.giftBloomUnlocked ? { giftBloomActive: true } : {}),

  closeGiftBloom: () => set({ giftBloomActive: false }),

  setBubble: (bubble) => set({ bubble }),
  setGameResult: (id, result) =>
    set((state) => {
      const gameResults = { ...state.gameResults, [id]: result };
      const giftBloomUnlocked = state.giftBloomUnlocked ||
        REQUIRED_GAME_IDS.every((gameId) => gameResults[gameId] === 'success');

      return { gameResults, giftBloomUnlocked };
    }),
}));
