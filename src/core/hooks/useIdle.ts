import { useEffect, useRef } from 'react';

const EVENTS = ['pointerdown', 'pointermove', 'keydown', 'scroll', 'wheel', 'touchstart'] as const;

interface IdleOptions {
  enabled?: boolean;
  /** Dipanggil saat tidak ada aktivitas selama `ms`. */
  onIdle?: () => void;
  /** Dipanggil saat aktivitas pertama muncul setelah idle. */
  onWake?: () => void;
}

/** Mendeteksi pengguna diam (tanpa sentuhan, scroll, atau tombol) selama `ms` milidetik. */
export function useIdle(ms: number, { enabled = true, onIdle, onWake }: IdleOptions = {}): void {
  const callbacks = useRef({ onIdle, onWake });
  useEffect(() => {
    callbacks.current = { onIdle, onWake };
  });

  useEffect(() => {
    if (!enabled) return;
    let timer = 0;
    let idle = false;

    const arm = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        idle = true;
        callbacks.current.onIdle?.();
      }, ms);
    };
    const onActivity = () => {
      if (idle) {
        idle = false;
        callbacks.current.onWake?.();
      }
      arm();
    };

    arm();
    EVENTS.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      EVENTS.forEach((e) => window.removeEventListener(e, onActivity));
    };
  }, [ms, enabled]);
}
