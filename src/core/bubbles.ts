import { BUBBLES, type BubbleLine, type BubbleTrigger } from '@/content/bubbles';
import { MAIN_CAT_SECTIONS, type SectionId } from '@/content/sections';
import { useAppStore } from '@/store/useAppStore';

/**
 * Pengatur kapan kucing berbicara. Aturan:
 * - satu balon pada satu waktu, jeda minimal 2,5 detik antar balon,
 * - balon baru menggantikan yang lama jika prioritasnya sama atau lebih tinggi,
 * - tidak mengulang teks yang sama sebelum semua pilihan terpakai,
 * - hilang otomatis setelah 4,5 detik.
 */
const PRIORITY: Record<BubbleTrigger, number> = {
  system: 6,
  gameEnd: 5,
  gameStart: 4,
  lebay: 4,
  spill: 4,
  latte: 3,
  enter: 3,
  followUp: 2,
  pet: 2,
  tap: 2,
  wake: 2,
  react: 2,
  idle: 1,
};

const MIN_GAP_MS = 2500;
const SHOW_MS = 4500;
const FOLLOW_UP_MS = 6500;

let hideTimer = 0;
let followTimer = 0;
let lastShownAt = -Infinity;
let visibleUntil = 0;
let currentPriority = 0;
let seq = 0;
let lastId = '';
const used = new Set<string>();
const entered = new Set<SectionId>();

/** Section dengan kucing besar memegang balonnya sendiri; section lain memakai kucing mini. */
export function bubbleOwner(section: SectionId | null): string {
  return section && MAIN_CAT_SECTIONS.includes(section) ? section : 'mini';
}

function pick(trigger: BubbleTrigger, section: SectionId | null): BubbleLine | null {
  const pool = BUBBLES.filter((l) => l.trigger === trigger);
  const scoped = pool.filter((l) => l.section === section);
  const candidates = scoped.length > 0 ? scoped : pool.filter((l) => !l.section);
  if (candidates.length === 0) return null;

  let fresh = candidates.filter((l) => !used.has(l.id));
  if (fresh.length === 0) {
    candidates.forEach((l) => used.delete(l.id));
    fresh = candidates.filter((l) => l.id !== lastId);
    if (fresh.length === 0) fresh = candidates;
  }
  return fresh[Math.floor(Math.random() * fresh.length)] ?? null;
}

export function hide(): void {
  window.clearTimeout(hideTimer);
  visibleUntil = 0;
  currentPriority = 0;
  useAppStore.getState().setBubble(null);
}

interface SayOptions {
  /** Pakai baris tertentu (untuk teks sistem). */
  id?: string;
  /** Paksa konteks section (dipakai saat baru masuk section). */
  section?: SectionId;
}

/** Minta kucing berbicara. Mengembalikan true jika balon benar-benar ditampilkan. */
export function say(trigger: BubbleTrigger, opts: SayOptions = {}): boolean {
  const state = useAppStore.getState();
  if (!state.started) return false;

  const section = opts.section ?? state.activeSectionId;
  const priority = PRIORITY[trigger];
  const now = performance.now();

  if (now < visibleUntil && priority < currentPriority) return false;
  if (now - lastShownAt < MIN_GAP_MS && priority <= currentPriority && priority < 6) return false;

  const line = opts.id ? (BUBBLES.find((l) => l.id === opts.id) ?? null) : pick(trigger, section);
  if (!line) return false;

  window.clearTimeout(hideTimer);
  seq += 1;
  used.add(line.id);
  lastId = line.id;
  lastShownAt = now;
  visibleUntil = now + SHOW_MS;
  currentPriority = priority;
  state.setBubble({
    id: seq,
    text: line.text.replaceAll('{catName}', state.catName),
    owner: bubbleOwner(section),
  });
  hideTimer = window.setTimeout(hide, SHOW_MS);
  return true;
}

/** Dipanggil saat sebuah section menjadi aktif. Hanya bicara saat pertama kali masuk. */
export function enterSection(id: SectionId): void {
  window.clearTimeout(followTimer);
  const state = useAppStore.getState();
  if (!state.started) return;

  if (state.bubble && state.bubble.owner !== bubbleOwner(id)) hide();
  if (entered.has(id)) return;
  entered.add(id);

  lastShownAt = -Infinity;
  say('enter', { section: id });
  followTimer = window.setTimeout(() => {
    if (useAppStore.getState().activeSectionId === id) say('followUp', { section: id });
  }, FOLLOW_UP_MS);
}
