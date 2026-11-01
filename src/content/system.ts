/** Teks sistem dan konstanta umum. Semua teks tampil dikumpulkan di folder content. */
export const DEFAULT_CAT_NAME = 'Oyen';
export const MAX_CAT_NAME_LENGTH = 12;

export const PRELOADER = {
  title: 'Psst… ada yang ngintip 👀',
  nameLabel: 'Kasih nama kucingnya dulu yuk',
  namePlaceholder: DEFAULT_CAT_NAME,
  button: 'Ketuk untuk mulai 🐾',
  hint: 'Nyalakan suara biar makin seru',
} as const;

export const SYSTEM = {
  landscapeTitle: 'Putar balik dulu ya, Kak 🐾',
  landscapeHint: 'Halamannya lebih seru kalau HP-nya berdiri',
  muteOn: 'Matikan suara',
  muteOff: 'Nyalakan suara',
  sectionError: 'Ups, bagian ini lagi ngumpet 🙈',
  scrollHint: 'geser ke bawah',
} as const;

export const LABELS = {
  petCat: (name: string) => `Elus ${name}`,
  latteCup: 'Cangkir latte. Ketuk untuk latte art, tekan lama untuk menumpahkannya',
  hamster: 'Colek hamster',
    rabbitMiddle: 'Ketuk adik kelinci',
    rabbitYoungest: 'Ketuk adik kelinci paling kecil',
  rabbitBig: 'Ketuk kakak kelinci',
  fox: 'Ketuk rubah yang bersembunyi',
  bush: 'Ketuk semak',
  redPanda: 'Ketuk red panda yang mengantuk',
} as const;
