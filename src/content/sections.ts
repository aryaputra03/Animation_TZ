export type SectionId =
  | 'hero'
  | 'barista'
  | 'game-beans'
  | 'hamster'
  | 'game-hamster'
  | 'rabbits'
  | 'fox'
  | 'redpanda'
  | 'game-cards'
  | 'closing';

export interface SectionContent {
  id: SectionId;
  title: string;
  subtitle: string;
  /** Hiasan sementara sampai karakter aslinya dibuat. */
  emoji: string;
  /** Tahap pengerjaan (docs/08) yang akan menggantikan placeholder ini. */
  stage: number;
}

export const SECTION_CONTENT: readonly SectionContent[] = [
  { id: 'hero', title: 'Halo, Kak Abil!', subtitle: 'Scroll pelan-pelan ya, banyak yang mau ketemu kamu', emoji: '🐱', stage: 2 },
  { id: 'barista', title: 'Barista baru lagi magang', subtitle: 'Kerjanya belum rapi, tapi niatnya 100%', emoji: '☕', stage: 2 },
  { id: 'game-beans', title: 'Tangkap biji kopinya!', subtitle: 'Geser keranjang ke kiri dan kanan', emoji: '🫘', stage: 4 },
  { id: 'hamster', title: 'Hamster, si pelari abadi', subtitle: 'Lari terus tapi nggak sampai-sampai', emoji: '🐹', stage: 3 },
  { id: 'game-hamster', title: 'Hamster main petak umpet', subtitle: 'Ketuk hamster yang nongol dari lubang', emoji: '🕳️', stage: 4 },
  { id: 'rabbits', title: 'Kakak kelinci yang selalu siaga', subtitle: 'Jagain adik itu bukan tugas gampang', emoji: '🐰', stage: 3 },
  { id: 'fox', title: 'Ada yang ngumpet…', subtitle: 'Katanya sih nggak kelihatan', emoji: '🦊', stage: 3 },
  { id: 'redpanda', title: 'Red panda lagi ngantuk', subtitle: 'Jangan berisik ya', emoji: '🎋', stage: 3 },
  { id: 'game-cards', title: 'Cocokkan teman-temannya', subtitle: 'Ketuk dua kartu, cari pasangan yang sama', emoji: '🃏', stage: 4 },
  { id: 'closing', title: 'Terima kasih sudah scroll sampai sini 🌙', subtitle: 'Ada satu hal lagi di bawah sini', emoji: '🌙', stage: 5 },
];

/** Section yang punya kucing besar sendiri. Di section lain, kucing mini yang menemani. */
export const MAIN_CAT_SECTIONS: readonly SectionId[] = ['hero', 'barista'];
