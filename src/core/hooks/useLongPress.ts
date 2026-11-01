import { useEffect, useRef, type MouseEvent, type PointerEvent } from 'react';

interface LongPressOptions {
  /** Lama tekan sebelum dianggap tekan-tahan (ms). */
  ms?: number;
  onTap?: () => void;
  onLongPressStart?: () => void;
  onLongPressEnd?: () => void;
}

/**
 * Membedakan ketuk dan tekan-tahan lewat Pointer Events.
 * Jika jari bergeser sampai browser mulai menggulir, ketukan dibatalkan (pointercancel).
 */
export function useLongPress(options: LongPressOptions) {
  const opts = useRef(options);
  useEffect(() => {
    opts.current = options;
  });

  const timer = useRef(0);
  const pressing = useRef(false);
  const longPressed = useRef(false);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const end = (cancelled: boolean) => {
    if (!pressing.current) return;
    pressing.current = false;
    window.clearTimeout(timer.current);
    if (longPressed.current) {
      longPressed.current = false;
      opts.current.onLongPressEnd?.();
    } else if (!cancelled) {
      opts.current.onTap?.();
    }
  };

  return {
    onPointerDown: (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pressing.current = true;
      longPressed.current = false;
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        longPressed.current = true;
        opts.current.onLongPressStart?.();
      }, opts.current.ms ?? 400);
    },
    onPointerUp: () => end(false),
    onPointerCancel: () => end(true),
    onPointerLeave: () => end(true),
    onContextMenu: (e: MouseEvent) => e.preventDefault(),
  };
}
