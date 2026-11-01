import { useEffect } from 'react';
import { AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import { SoundManager } from '@/audio/SoundManager';
import { ScrollDirector } from '@/core/ScrollDirector';
import { enterSection } from '@/core/bubbles';
import { measureFps } from '@/core/performance';
import { useReducedMotion } from '@/core/hooks/useReducedMotion';
import { useAppStore } from '@/store/useAppStore';
import { CatCompanion } from '@/components/characters/CatCompanion';
import { PortraitGuard } from '@/components/PortraitGuard';
import { Preloader } from '@/components/Preloader';
import { SceneBackground } from '@/components/scene/SceneBackground';
import { MuteButton } from '@/components/ui/MuteButton';
import { PawProgress } from '@/components/ui/PawProgress';
import { Sections } from '@/sections';

export default function App() {
  const started = useAppStore((s) => s.started);
  const perfMode = useAppStore((s) => s.perfMode);
  const setPerfMode = useAppStore((s) => s.setPerfMode);
  const reducedMotion = useReducedMotion();

  // Mode hemat animasi dibaca CSS lewat atribut data-perf.
  useEffect(() => {
    document.documentElement.dataset.perf = perfMode;
  }, [perfMode]);

  useEffect(() => {
    if (reducedMotion) setPerfMode('low');
  }, [reducedMotion, setPerfMode]);

  // Suara berhenti saat tab tersembunyi.
  useEffect(() => {
    const onVisibility = () => (document.hidden ? SoundManager.suspend() : SoundManager.resume());
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Setelah layar pembuka menutup, kucing menyapa di section pertama.
  useEffect(() => {
    if (!started) return;
    const id = window.setTimeout(() => enterSection(useAppStore.getState().activeSectionId ?? 'hero'), 900);
    return () => window.clearTimeout(id);
  }, [started]);

  // Ukur FPS 2 detik setelah mulai; jika di bawah 45, pindah ke mode hemat.
  useEffect(() => {
    if (!started || useAppStore.getState().perfMode === 'low') return;
    let alive = true;
    void measureFps(2000).then((fps) => {
      if (alive && fps < 45) setPerfMode('low');
    });
    return () => {
      alive = false;
    };
  }, [started, setPerfMode]);

  return (
    <LazyMotion features={domAnimation} strict>
      <SceneBackground />
      <ScrollDirector>
        <Sections />
      </ScrollDirector>
      <CatCompanion />
      {started && (
        <>
          <MuteButton />
          <PawProgress />
        </>
      )}
      <AnimatePresence>{!started && <Preloader key="preloader" />}</AnimatePresence>
      <PortraitGuard />
    </LazyMotion>
  );
}
