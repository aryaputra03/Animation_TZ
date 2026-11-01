export type PerfMode = 'normal' | 'low';

type NavigatorWithMemory = Navigator & { deviceMemory?: number };

/** Tebakan awal dari kemampuan perangkat dan setelan "kurangi gerakan". */
export function detectInitialPerfMode(): PerfMode {
  if (import.meta.env.DEV) {
    const forced = new URLSearchParams(window.location.search).get('perf');
    if (forced === 'low' || forced === 'normal') return forced;
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'low';
  const nav = navigator as NavigatorWithMemory;
  if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) return 'low';
  if (nav.deviceMemory && nav.deviceMemory <= 2) return 'low';
  return 'normal';
}

/**
 * Mengukur rata-rata FPS selama `ms` milidetik.
 * Jika tab disembunyikan di tengah pengukuran, hasilnya diabaikan (Infinity).
 */
export function measureFps(ms = 2000): Promise<number> {
  return new Promise((resolve) => {
    let frames = 0;
    let t0 = 0;
    let cancelled = false;
    const onHide = () => {
      if (document.hidden) {
        document.removeEventListener('visibilitychange', onHide);
        cancelled = true;
        resolve(Infinity);
      }
    };
    document.addEventListener('visibilitychange', onHide);

    const tick = (t: number) => {
      if (cancelled) return;
      if (t0 === 0) t0 = t;
      frames += 1;
      if (t - t0 >= ms) {
        document.removeEventListener('visibilitychange', onHide);
        resolve((frames * 1000) / (t - t0));
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}
