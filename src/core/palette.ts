/**
 * Warna untuk SVG dan JS. Harus sama dengan token @theme di src/styles/index.css.
 * (Kelas Tailwind seperti bg-matcha-500 memakai token CSS, sedangkan SVG memakai konstanta ini.)
 */
export const P = {
  matcha50: "#F1F8E9",
  matcha100: "#DCEDC8",
  matcha300: "#AED581",
  matcha500: "#7CB342",
  matcha700: "#4E7A2A",
  sage300: "#B7C9A8",
  sage600: "#6B8A5B",
  forest900: "#1F3A2B",
  cream50: "#FFF8E7",
  cream200: "#F6E7C1",
  coffee500: "#8B5E3C",
  coffee800: "#4A2F1E",
  blush300: "#F8B4C0",
  sun400: "#FFC94A",
} as const;

/** Hijau malam untuk pemandangan terakhir. */
export const N = {
  far: "#244A38",
  mid: "#1B3A2B",
  near: "#12281D",
  tree: "#0C1D14",
  trunk: "#2A1C12",
} as const;
