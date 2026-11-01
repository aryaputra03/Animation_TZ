import { useCallback, useEffect, useRef, useState } from 'react';
import type { Expression } from './Character.types';

/**
 * Ekspresi sementara. `override` null berarti kembali ke ekspresi dasar milik komponen
 * (idle atau tidur). `react` menahan ekspresi sebentar, `hold` menahan sampai dilepas.
 */
export function useCharacter() {
  const [override, setOverride] = useState<Expression | null>(null);
  const timer = useRef(0);

  const react = useCallback((expression: Expression, ms = 1200) => {
    window.clearTimeout(timer.current);
    setOverride(expression);
    timer.current = window.setTimeout(() => setOverride(null), ms);
  }, []);

  const hold = useCallback((expression: Expression | null) => {
    window.clearTimeout(timer.current);
    setOverride(expression);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return { override, react, hold };
}
