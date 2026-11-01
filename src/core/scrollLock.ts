/**
 * Kunci scroll berbasis alasan: scroll terkunci selama minimal satu alasan aktif.
 * Setiap lock harus dipasangkan dengan unlock saat komponen dibongkar.
 */
export type LockReason = 'preloader' | 'game' | 'landscape';

// Saat halaman dimuat, layar pembuka langsung mengunci scroll.
const reasons = new Set<LockReason>(['preloader']);

function apply(): void {
  document.documentElement.classList.toggle('scroll-locked', reasons.size > 0);
}

export function lockScroll(reason: LockReason): void {
  reasons.add(reason);
  apply();
}

export function unlockScroll(reason: LockReason): void {
  reasons.delete(reason);
  apply();
}

apply();
