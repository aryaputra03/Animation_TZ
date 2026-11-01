export type Expression =
  | "idle"
  | "cheer"
  | "happy"
  | "surprised"
  | "sleepy"
  | "love"
  | "curious"
  | "grumpy"
  | "hurt"
  | "purr"
  | "lebay";

export type CatAccessory = "none" | "barista" | "kids";

/** 'full' = seluruh badan; 'lookout' = hanya kepala dan tangan, mengintip dari tepi layar. */
export type CatVariant = "full" | "lookout";

/** 'pleading' = mata besar memohon; 'cheerful' = mata senang dan senyum. */
export type CatMood = "pleading" | "cheerful";

/** Pegangan agar komponen lain bisa menyuruh kucing bereaksi. */
export interface CatHandle {
  react: (expression: Expression, ms?: number) => void;
  sparkles: (count?: number) => void;
}
