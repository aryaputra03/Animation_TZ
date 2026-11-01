import { useAppStore } from '@/store/useAppStore';

/** Pola getar (milidetik). Getar tidak terikat tombol mute, tapi mati di mode hemat animasi. */
export const HAPTIC = {
  tap: 10,
  pet: 8,
  lebay: [15, 30, 15, 30, 15],
  spill: [20, 40, 20],
} as const;

type Pattern = number | readonly number[];

export function vibrate(pattern: Pattern): void {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
  if (useAppStore.getState().perfMode === 'low') return;
  try {
    navigator.vibrate(typeof pattern === 'number' ? pattern : [...pattern]);
  } catch {
    /* tidak didukung: abaikan */
  }
}

export function cancelVibration(): void {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
  try {
    navigator.vibrate(0);
  } catch {
    /* abaikan */
  }
}
