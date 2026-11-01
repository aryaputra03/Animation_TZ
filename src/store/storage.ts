import { DEFAULT_CAT_NAME, MAX_CAT_NAME_LENGTH } from '@/content/system';

/** Hanya dua kunci yang boleh disimpan: catName dan muted. */
const KEY_CAT_NAME = 'catName';
const KEY_MUTED = 'muted';

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* mode privat atau penyimpanan penuh: abaikan */
  }
}

/** Rapikan nama: spasi ganda dibuang, dipotong 12 karakter, kosong menjadi bawaan. */
export function sanitizeCatName(raw: string): string {
  const cleaned = raw.replace(/\s+/g, ' ').trim().slice(0, MAX_CAT_NAME_LENGTH).trim();
  return cleaned || DEFAULT_CAT_NAME;
}

/** Nama yang pernah diketik pengguna, atau null bila belum pernah. */
export function loadStoredCatName(): string | null {
  const v = read(KEY_CAT_NAME);
  return v ? sanitizeCatName(v) : null;
}

export function saveCatName(name: string): void {
  write(KEY_CAT_NAME, sanitizeCatName(name));
}

export function loadMuted(): boolean {
  return read(KEY_MUTED) === 'true';
}

export function saveMuted(muted: boolean): void {
  write(KEY_MUTED, muted ? 'true' : 'false');
}
