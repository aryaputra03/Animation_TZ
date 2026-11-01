export type GameId = "coffee-beans" | "hamster-pop" | "card-match";

export const REQUIRED_GAME_IDS: readonly GameId[] = ["coffee-beans", "hamster-pop", "card-match"];

export type GameResult = "success";

export type GameShellState = "intro" | "playing" | GameResult;

export interface GameApi {
  active: boolean;
  runId: number;
  progress: number;
  setProgress: (value: number) => void;
  announce: (message: string) => void;
  complete: () => void;
  setSoftCapHandler: (handler: (() => void) | null) => void;
}
