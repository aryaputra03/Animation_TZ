import { playVoice } from './voice';

/** Suara yang berulang sampai dihentikan (contoh: dengkuran). */
export interface Loop {
  stop: () => void;
}

/** "Meow" biasa: nada naik lalu turun, agak panjang. */
export function playMeow(ctx: AudioContext, out: AudioNode, pitch = 1, delay = 0): AudioScheduledSourceNode {
  return playVoice(ctx, out, { f0: 480 * pitch, f1: 900 * pitch, f2: 520 * pitch, len: 0.6, peak: 0.3, vib: 5.5, vibDepth: 10, delay });
}

/** "Mew!" pendek dan ceria. */
export function playMeowHappy(ctx: AudioContext, out: AudioNode, pitch = 1, delay = 0): AudioScheduledSourceNode {
  return playVoice(ctx, out, { f0: 640 * pitch, f1: 1200 * pitch, f2: 800 * pitch, len: 0.34, peak: 0.26, delay });
}

/** "Mrrp" bergetar, seperti kucing menyapa. */
export function playMrrp(ctx: AudioContext, out: AudioNode, pitch = 1, delay = 0): AudioScheduledSourceNode {
  return playVoice(ctx, out, { f0: 330 * pitch, f1: 460 * pitch, f2: 380 * pitch, len: 0.22, peak: 0.28, vib: 6, vibDepth: 6, trill: 26, delay });
}

/** Mode lebay: dua meow beruntun, yang kedua lebih tinggi dan panjang. */
export function playMeowLebay(ctx: AudioContext, out: AudioNode, pitch = 1, delay = 0): AudioScheduledSourceNode {
  playVoice(ctx, out, { f0: 560 * pitch, f1: 1150 * pitch, f2: 700 * pitch, len: 0.38, peak: 0.26, delay });
  return playVoice(ctx, out, { f0: 640 * pitch, f1: 1400 * pitch, f2: 760 * pitch, len: 0.55, peak: 0.28, vib: 7, vibDepth: 14, delay: delay + 0.34 });
}

/** Menguap: desah bernoise yang meluncur turun. */
export function playYawn(ctx: AudioContext, out: AudioNode, noise: AudioBuffer | null, pitch = 1): AudioScheduledSourceNode {
  if (!noise) return playVoice(ctx, out, { f0: 420, f1: 300, f2: 200, len: 0.7, peak: 0.12 });
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noise;
  src.loop = true;
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.Q.value = 1.4;
  band.frequency.setValueAtTime(1500 * pitch, t);
  band.frequency.exponentialRampToValueAtTime(350 * pitch, t + 0.9);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.14, t + 0.25);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.95);
  src.connect(band);
  band.connect(env);
  env.connect(out);
  src.onended = () => env.disconnect();
  src.start(t);
  src.stop(t + 1);
  return src;
}

/**
 * Dengkuran: dua gelombang gergaji rendah yang volumenya dikedipkan ±25 kali per detik.
 * Harmonik di sekitar 160 sampai 500 Hz dipertahankan karena speaker HP nyaris tidak
 * memutar nada di bawah 200 Hz.
 */
export function startPurr(ctx: AudioContext, out: AudioNode): Loop {
  const t = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, t);
  master.gain.exponentialRampToValueAtTime(0.28, t + 0.15);

  const amp = ctx.createGain();
  amp.gain.value = 0.5;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 24 + Math.random() * 3;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 0.5;
  lfo.connect(lfoDepth);
  lfoDepth.connect(amp.gain);

  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 330;
  band.Q.value = 0.8;

  const low = ctx.createOscillator();
  low.type = 'sawtooth';
  low.frequency.value = 82;
  const high = ctx.createOscillator();
  high.type = 'sawtooth';
  high.frequency.value = 164;
  const highGain = ctx.createGain();
  highGain.gain.value = 0.6;

  low.connect(band);
  high.connect(highGain);
  highGain.connect(band);
  band.connect(amp);
  amp.connect(master);
  master.connect(out);

  const sources = [low, high, lfo];
  sources.forEach((o) => o.start(t));

  let stopped = false;
  return {
    stop() {
      if (stopped) return;
      stopped = true;
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      sources.forEach((o) => o.stop(now + 0.3));
      window.setTimeout(() => master.disconnect(), 400);
    },
  };
}
