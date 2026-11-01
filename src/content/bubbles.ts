import type { SectionId } from './sections';

export type BubbleTrigger =
  | 'enter'
  | 'followUp'
  | 'tap'
  | 'pet'
  | 'latte'
  | 'spill'
  | 'lebay'
  | 'idle'
  | 'wake'
  | 'react'
  | 'system'
  | 'gameStart'
  | 'gameEnd';

export interface BubbleLine {
  id: string;
  trigger: BubbleTrigger;
  /** Kosong = berlaku di mana saja. */
  section?: SectionId;
  /** {catName} diganti nama kucing. */
  text: string;
}

/** Semua balon chat kucing. Pemicu 'game*' dipakai oleh sesi minigame. */
export const BUBBLES: readonly BubbleLine[] = [
  // masuk section
  { id: 'enter-hero', trigger: 'enter', section: 'hero', text: 'Haloo Kak Abil! Aku {catName}. Scroll pelan-pelan ya, aku gampang pusing 😼' },
  { id: 'enter-barista', trigger: 'enter', section: 'barista', text: 'Kak Abil, kopinya jangan lupa diminum dulu 😼' },
  { id: 'enter-hamster', trigger: 'enter', section: 'hamster', text: 'Itu hamster lari terus tapi gak sampai-sampai. Mirip aku ngejar deadline.' },
  { id: 'enter-rabbits', trigger: 'enter', section: 'rabbits', text: 'Kakak yang jagain adik itu keren. Kak Abil juga gitu kan?' },
  { id: 'enter-fox', trigger: 'enter', section: 'fox', text: 'Psst, ada rubah ngintip. Pura-pura gak lihat aja.' },
  { id: 'enter-redpanda', trigger: 'enter', section: 'redpanda', text: 'Dia tidur sambil meluk bambu. Tolong jangan dibangunin… eh, ketuk aja deh.' },
  { id: 'enter-closing', trigger: 'enter', section: 'closing', text: 'Semua teman-teman udah kumpul nih, Kak Abil!' },

  // beberapa detik setelah masuk
  { id: 'follow-barista', trigger: 'followUp', section: 'barista', text: 'Aku lagi belajar bikin latte art. Hasilnya… ya, ada bentuknya lah.' },
  { id: 'follow-hamster', trigger: 'followUp', section: 'hamster', text: 'Kak Abil juga sering capek ya? Istirahat sebentar boleh kok.' },
  { id: 'follow-rabbits', trigger: 'followUp', section: 'rabbits', text: 'Kakak juga boleh dimanja kok, sesekali.' },
  { id: 'follow-fox', trigger: 'followUp', section: 'fox', text: 'Ekornya kelihatan tuh. Kasih tahu nggak ya?' },
  { id: 'follow-redpanda', trigger: 'followUp', section: 'redpanda', text: 'Zzz… dia mimpi makan bambu rasa matcha.' },
  { id: 'follow-closing', trigger: 'followUp', section: 'closing', text: 'Kalau mau, ketuk tombolnya. Kalau nggak, nggak apa-apa kok 😺' },
  { id: 'follow-cards-near-closing', trigger: 'followUp', section: 'game-cards', text: 'Tinggal sedikit lagi, aku udah gak sabar.' },

  // kucing diketuk
  { id: 'tap-1', trigger: 'tap', text: 'Meow! Ada apa, Kak Abil?' },
  { id: 'tap-2', trigger: 'tap', text: 'Hehe, geli.' },
  { id: 'tap-3', trigger: 'tap', text: 'Aku bukan tombol lho… eh, boleh deh.' },
  { id: 'tap-4', trigger: 'tap', text: 'Ketuk lagi dong, enak.' },
  { id: 'tap-5', trigger: 'tap', text: 'Kak Abil, kopi dulu!' },
  { id: 'tap-6', trigger: 'tap', text: 'Lapar nih. Ada ikan?' },

  // kucing dielus (tekan-tahan)
  { id: 'pet-1', trigger: 'pet', text: 'Purr… purr… jangan dilepas dulu.' },
  { id: 'pet-2', trigger: 'pet', text: 'Enak banget… lanjut elus aja.' },
  { id: 'pet-3', trigger: 'pet', text: 'Aku jadi ngantuk… tapi gak mau berhenti.' },

  // mode lebay (ketuk 5 kali)
  { id: 'lebay-1', trigger: 'lebay', text: 'AKU TERHARU DIKETUK SEBANYAK ITU 😭' },
  { id: 'lebay-2', trigger: 'lebay', text: 'Stop stop, aku geli! 🙀' },
  { id: 'lebay-3', trigger: 'lebay', text: 'Iya iya, aku kucing paling lucu sedunia. Sudah tahu kok.' },

  // cangkir latte
  { id: 'latte-1', trigger: 'latte', section: 'barista', text: 'Tuh, hatinya jadi! Bakat alam 😼' },
  { id: 'spill-1', trigger: 'spill', section: 'barista', text: 'Eh eh eh! Tumpah! Jangan bilang siapa-siapa ya 🙀' },

  // diam lama dan bangun
  { id: 'idle-1', trigger: 'idle', text: 'Zzz… eh, Kak Abil masih di sini?' },
  { id: 'wake-1', trigger: 'wake', text: 'Hoaam… eh, lanjut yuk!' },

  // kucing mengomentari hewan lain (dipanggil lewat say('react', { id }))
  { id: 'hamster-puff', trigger: 'react', text: 'Pipinya penuh! Kayaknya lagi nyimpen biji kopi 🐹' },
  { id: 'hamster-pop-hit', trigger: 'react', section: 'game-hamster', text: 'Kena! Hamsternya malah senang dicolek.' },
  { id: 'rabbit-hug', trigger: 'react', text: 'Aww, adiknya minta dipeluk kakak 🐰' },
  { id: 'rabbit-pat', trigger: 'react', text: 'Kakak ngelus kepala adik. Manis banget.' },
  { id: 'fox-caught', trigger: 'react', text: 'Ketahuan! Ya sudah, rubahnya keluar deh 🦊' },
  { id: 'panda-wake', trigger: 'react', text: 'Eh, dia bangun! Ngomongnya pelan-pelan ya.' },
  { id: 'bean-caught', trigger: 'react', section: 'game-beans', text: 'Mantap! Tanganmu lebih sigap dari aku ngejar tikus mainan.' },
  { id: 'cards-match', trigger: 'react', section: 'game-cards', text: 'Cocok! Mereka senang ketemu 🥰' },
  { id: 'cards-almost', trigger: 'react', section: 'game-cards', text: 'Hampir! Coba lagi, pelan-pelan aja.' },

  // mute
  { id: 'mute-on', trigger: 'system', text: 'Oke, aku diam deh. 🤐' },
  { id: 'mute-off', trigger: 'system', text: 'Yeay, aku boleh meong lagi!' },
  { id: 'closing-choir', trigger: 'system', section: 'closing', text: 'Konser malam dimulai! 🎶' },

  // game (dipakai di Tahap 4)
  { id: 'gs-beans', trigger: 'gameStart', section: 'game-beans', text: 'Biji kopinya jatuh semua! Tolong tangkap, Kak Abil!' },
  { id: 'ge-beans', trigger: 'gameEnd', section: 'game-beans', text: 'Yeay! Kopinya selamat. Kamu memang barista sejati ☕' },
  { id: 'gs-hamster', trigger: 'gameStart', section: 'game-hamster', text: 'Mereka nongol dari lubang! Sapa satu-satu ya 🐹' },
  { id: 'ge-hamster', trigger: 'gameEnd', section: 'game-hamster', text: 'Selesai! Kasihan hamsternya… tapi lucu sih.' },
  { id: 'gs-cards', trigger: 'gameStart', section: 'game-cards', text: 'Cocokin semuanya ya. Kalau salah, aku tutup mata, gak lihat kok.' },
  { id: 'ge-cards', trigger: 'gameEnd', section: 'game-cards', text: 'Semua pasangan ketemu! Kamu jago banget.' },
];
