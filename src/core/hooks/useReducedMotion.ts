import { useMediaQuery } from './useMediaQuery';

/** True bila pengguna meminta gerakan dikurangi di setelan perangkatnya. */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
