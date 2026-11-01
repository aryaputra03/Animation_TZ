import { playMeow, playMeowHappy, playMeowLebay, playMrrp, playYawn, startPurr, type Loop } from './synth/cat';
import { playBoing, playCupFull, playMatch, playTing, playSpill } from './synth/ui';
import { playPop, playVoice } from './synth/voice';
import { playRabbit, playSqueak, playTwitter, playYip } from './synth/animals';

export type SoundId =
  | 'ui.start'
  | 'ui.pop'
  | 'ui.ting'
  | 'heart.pop'
  | 'cat.meow'
  | 'cat.meowHappy'
  | 'cat.mrrp'
  | 'cat.meowLebay'
  | 'cat.yawn'
  | 'cup.spill'
  | 'hamster.squeak'
  | 'rabbit.chirp'
  | 'fox.yip'
  | 'redpanda.twitter'
  | 'redpanda.yawn'
  | 'game.beanCatch'
  | 'game.cupFull'
  | 'game.match'
  | 'game.wrong'
  | 'game.win'
  | 'closing.choir';

export type LoopId = 'cat.purr';

export interface PlayOptions {
  /** Rasio nada, bawaan 1. */
  pitch?: number;
  /** Variasi acak nada, bawaan 0.06 (sekitar satu semiton). */
  pitchJitter?: number;
  /** Penundaan mulai (detik). */
  delay?: number;
}

const MAX_VOICES = 6;
const MASTER_LEVEL = 0.6;
const COOLDOWN_MS = 80;

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

/**
 * Satu-satunya pintu suara. Rantai: voice -> bus -> kompresor -> master -> speaker.
 * Tidak ada suara sebelum unlock() (dipanggil dari ketukan pertama).
 */
class SoundManagerImpl {
  private ctx: AudioContext | null = null;
  private bus: GainNode | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private muted = false;
  private unlocked = false;
  private active = 0;
  private lastPlayed = new Map<SoundId, number>();
  private loops = new Map<LoopId, Loop>();

  /** Wajib dipanggil di dalam handler ketukan pengguna. */
  unlock(): Promise<void> {
    try {
      if (!this.ctx) {
        const Ctor = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
        if (!Ctor) return Promise.resolve();
        const ctx = new Ctor();
        const bus = ctx.createGain();
        const comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -18;
        comp.ratio.value = 6;
        comp.attack.value = 0.003;
        comp.release.value = 0.15;
        const master = ctx.createGain();
        master.gain.value = this.muted ? 0 : MASTER_LEVEL;
        bus.connect(comp);
        comp.connect(master);
        master.connect(ctx.destination);

        // satu buffer noise putih (1 detik) dipakai ulang oleh semua suara bernoise
        const noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
        const data = noise.getChannelData(0);
        for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;

        this.ctx = ctx;
        this.bus = bus;
        this.master = master;
        this.noise = noise;
      }
      this.unlocked = true;
      return this.ctx.state === 'suspended' ? this.ctx.resume() : Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted) this.stopAllLoops();
    if (this.ctx && this.master) {
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setTargetAtTime(muted ? 0 : MASTER_LEVEL, t, 0.015);
    }
  }

  isMuted(): boolean {
    return this.muted;
  }

  /** Dipanggil saat tab tersembunyi. */
  suspend(): void {
    this.stopAllLoops();
    void this.ctx?.suspend().catch(() => undefined);
  }

  /** Dipanggil saat tab terlihat lagi. */
  resume(): void {
    if (this.ctx && this.unlocked && !this.muted) void this.ctx.resume().catch(() => undefined);
  }

  play(id: SoundId, opts: PlayOptions = {}): void {
    const ctx = this.ctx;
    const bus = this.bus;
    if (!ctx || !bus || !this.unlocked || this.muted) return;

    const now = performance.now();
    if (now - (this.lastPlayed.get(id) ?? 0) < COOLDOWN_MS) return;
    if (this.active >= MAX_VOICES) return;
    this.lastPlayed.set(id, now);

    const jitter = opts.pitchJitter ?? 0.06;
    const pitch = (opts.pitch ?? 1) * (1 + (Math.random() * 2 - 1) * jitter);
    const delay = opts.delay ?? 0;

    try {
      let node: AudioScheduledSourceNode;
      switch (id) {
        case 'ui.start':
          node = playVoice(ctx, bus, { f0: 620 * pitch, f1: 1150 * pitch, f2: 760 * pitch, len: 0.42, peak: 0.22, delay });
          break;
        case 'ui.pop':
          node = playPop(ctx, bus, delay, pitch);
          break;
        case 'heart.pop':
          node = playPop(ctx, bus, delay, pitch * 1.6);
          break;
        case 'ui.ting':
          node = playTing(ctx, bus, pitch);
          break;
        case 'game.beanCatch':
          node = playPop(ctx, bus, delay, pitch);
          break;
        case 'game.cupFull':
          node = playCupFull(ctx, bus, pitch);
          break;
        case 'game.match':
          node = playMatch(ctx, bus, pitch);
          break;
        case 'game.wrong':
          node = playBoing(ctx, bus, pitch, delay);
          break;
        case 'game.win':
          node = playCupFull(ctx, bus, pitch * 1.08);
          break;
        case 'cat.meow':
          node = playMeow(ctx, bus, pitch, delay);
          break;
        case 'cat.meowHappy':
          node = playMeowHappy(ctx, bus, pitch, delay);
          break;
        case 'cat.mrrp':
          node = playMrrp(ctx, bus, pitch, delay);
          break;
        case 'cat.meowLebay':
          node = playMeowLebay(ctx, bus, pitch, delay);
          break;
        case 'cat.yawn':
          node = playYawn(ctx, bus, this.noise);
          break;
        case 'cup.spill':
          node = playSpill(ctx, bus, this.noise);
          break;
        case 'hamster.squeak':
          node = playSqueak(ctx, bus, pitch, delay);
          break;
        case 'rabbit.chirp':
          node = playRabbit(ctx, bus, pitch, delay);
          break;
        case 'fox.yip':
          node = playYip(ctx, bus, pitch, delay);
          break;
        case 'redpanda.twitter':
          node = playTwitter(ctx, bus, pitch, delay);
          break;
        case 'redpanda.yawn':
          node = playYawn(ctx, bus, this.noise, 1.25);
          break;
        case 'closing.choir': {
          const choirBus = ctx.createGain();
          choirBus.gain.value = 0.42;
          choirBus.connect(bus);
          node = playMeow(ctx, choirBus, pitch, delay);
          playSqueak(ctx, choirBus, pitch * 1.2, delay);
          playRabbit(ctx, choirBus, pitch * 0.92, delay);
          node.addEventListener('ended', () => choirBus.disconnect(), { once: true });
          break;
        }
      }
      this.active += 1;
      node.addEventListener('ended', () => {
        this.active = Math.max(0, this.active - 1);
      });
    } catch {
      /* suara gagal: abaikan, jangan merusak halaman */
    }
  }

  /** Memulai suara berulang (dengkuran). Dihentikan dengan stopLoop. */
  startLoop(id: LoopId): void {
    const ctx = this.ctx;
    const bus = this.bus;
    if (!ctx || !bus || !this.unlocked || this.muted || this.loops.has(id)) return;
    try {
      this.loops.set(id, startPurr(ctx, bus));
    } catch {
      /* abaikan */
    }
  }

  stopLoop(id: LoopId): void {
    this.loops.get(id)?.stop();
    this.loops.delete(id);
  }

  private stopAllLoops(): void {
    this.loops.forEach((loop) => loop.stop());
    this.loops.clear();
  }
}

export const SoundManager = new SoundManagerImpl();
