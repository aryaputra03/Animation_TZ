import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { lockScroll, unlockScroll } from "@/core/scrollLock";
import { useInView } from "@/core/hooks/useInView";
import { useAppStore } from "@/store/useAppStore";
import type { GameApi, GameId, GameShellState } from "./types";

interface Options {
  id: GameId;
  softCapMs: number;
  rootRef: RefObject<HTMLElement | null>;
  onComplete: () => void;
}

/** State, timer, scroll lock, and session result shared by the minigames. */
export function useGameShell({ id, softCapMs, rootRef, onComplete }: Options) {
  const savedResult = useAppStore((state) => state.gameResults[id]);
  const setGameResult = useAppStore((state) => state.setGameResult);
  const [state, setState] = useState<GameShellState>(() => savedResult ?? "intro");
  const [progress, setProgressState] = useState(savedResult === "success" ? 1 : 0);
  const [runId, setRunId] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const [tabVisible, setTabVisible] = useState(() => typeof document === "undefined" || !document.hidden);
  const stateRef = useRef(state);
  const softCapHandler = useRef<(() => void) | null>(null);
  const elapsedMs = useRef(0);
  const inView = useInView(rootRef, 0.15);
  const canObserve = typeof IntersectionObserver === "undefined";
  const visibleInPage = canObserve || inView;
  const active = state === "playing" && visibleInPage && tabVisible;
  useEffect(() => {
    const handleVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (state !== "playing") return;
    lockScroll("game");
    return () => unlockScroll("game");
  }, [state]);

  const transition = useCallback((next: GameShellState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  const start = useCallback(() => {
    if (stateRef.current !== "intro") return;
    elapsedMs.current = 0;
    setRunId((current) => current + 1);
    setProgressState(0);
    setAnnouncement("");
    transition("playing");
  }, [transition]);

  const replay = useCallback(() => {
    if (stateRef.current !== "success") return;
    elapsedMs.current = 0;
    setRunId((current) => current + 1);
    setProgressState(0);
    setAnnouncement("");
    transition("playing");
  }, [transition]);

  const complete = useCallback(() => {
    if (stateRef.current !== "playing") return;
    transition("success");
    setProgressState(1);
    setGameResult(id, "success");
    onComplete();
  }, [id, onComplete, setGameResult, transition]);

  const setProgress = useCallback((value: number) => {
    if (stateRef.current !== "playing") return;
    setProgressState(Math.max(0, Math.min(1, value)));
  }, []);

  const announce = useCallback((message: string) => {
    setAnnouncement(message);
  }, []);

  const setSoftCapHandler = useCallback((handler: (() => void) | null) => {
    softCapHandler.current = handler;
  }, []);

  useEffect(() => {
    if (!active) return;
    const startedAt = performance.now();
    const remaining = Math.max(0, softCapMs - elapsedMs.current);
    const timer = window.setTimeout(() => {
      const handler = softCapHandler.current;
      if (handler) handler();
      else complete();
    }, remaining);
    return () => {
      window.clearTimeout(timer);
      elapsedMs.current += performance.now() - startedAt;
    };
  }, [active, complete, softCapMs]);

  const api = useMemo<GameApi>(
    () => ({ active, runId, progress, setProgress, announce, complete, setSoftCapHandler }),
    [active, runId, progress, setProgress, announce, complete, setSoftCapHandler],
  );

  return { state, progress, announcement, active, visibleInPage, api, start, replay };
}
