import { useCallback, useRef } from "react";

/** Mengembalikan fungsi yang bernilai false jika dipanggil lagi dalam `ms` (mencegah ketukan beruntun menumpuk). */
export function useTapGuard(ms = 150): () => boolean {
  const last = useRef(0);
  return useCallback(() => {
    const now = performance.now();
    if (now - last.current < ms) return false;
    last.current = now;
    return true;
  }, [ms]);
}
