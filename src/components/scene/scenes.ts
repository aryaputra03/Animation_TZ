export type SceneId = "meadow" | "forest" | "hills" | "night";

export interface SceneDef {
  id: SceneId;
  label: string;
  /** Gradien langit untuk pemandangan ini. */
  sky: string;
}

/** Urutan pemandangan dari atas ke bawah halaman. Tambah atau ubah urutan di sini. */
export const SCENES: readonly SceneDef[] = [
  {
    id: "meadow",
    label: "Padang rumput pagi",
    sky: "linear-gradient(180deg,#CFEBD6 0%,#E9F6DA 55%,#FFF8E7 100%)",
  },
  {
    id: "forest",
    label: "Hutan siang",
    sky: "linear-gradient(180deg,#B9DDBE 0%,#D6EBC6 60%,#EEF6DA 100%)",
  },
  {
    id: "hills",
    label: "Bukit sore",
    sky: "linear-gradient(180deg,#F4E3B0 0%,#FBD9A9 50%,#F8C1C9 100%)",
  },
  {
    id: "night",
    label: "Malam berbintang",
    sky: "linear-gradient(180deg,#112519 0%,#1F3A2B 55%,#2E5A45 100%)",
  },
];

/** Lebar cross-fade antar pemandangan, dalam satuan "satu pemandangan" (0.5 = setengahnya). */
export const FADE_WIDTH = 0.5;

/** Apakah pemandangan ke-k masih terlihat (sebagian atau penuh) pada posisi pos = progres * jumlah. */
export function isSceneVisible(k: number, pos: number, count: number): boolean {
  const startsFading = k === 0 || pos > k - FADE_WIDTH / 2;
  const fullyCovered = k === count - 1 || pos < k + 1 + FADE_WIDTH / 2;
  return startsFading && fullyCovered;
}
