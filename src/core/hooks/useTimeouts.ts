import { useCallback, useEffect, useRef } from "react";

/** setTimeout yang otomatis dibersihkan saat komponen dibongkar. */
export function useTimeouts() {
  const ids = useRef(new Set<number>());

  useEffect(() => {
    const set = ids.current;
    return () => {
      set.forEach((id) => window.clearTimeout(id));
      set.clear();
    };
  }, []);

  const after = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      ids.current.delete(id);
      fn();
    }, ms);
    ids.current.add(id);
    return id;
  }, []);

  const cancel = useCallback((id: number) => {
    window.clearTimeout(id);
    ids.current.delete(id);
  }, []);

  return { after, cancel };
}
