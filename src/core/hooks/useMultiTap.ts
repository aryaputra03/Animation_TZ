import { useCallback, useRef } from 'react';

/** Mengembalikan fungsi `register()`; bernilai true saat `count` ketukan terjadi dalam `windowMs`. */
export function useMultiTap(count: number, windowMs: number): () => boolean {
  const times = useRef<number[]>([]);
  return useCallback(() => {
    const now = performance.now();
    times.current = [...times.current.filter((t) => now - t < windowMs), now];
    if (times.current.length >= count) {
      times.current = [];
      return true;
    }
    return false;
  }, [count, windowMs]);
}
