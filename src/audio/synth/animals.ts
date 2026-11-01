import { playVoice } from "./voice";

interface ChirpOptions {
  f0: number;
  f1: number;
  /** Detik dari sekarang. */
  start: number;
  len: number;
  peak: number;
}

/** Cicitan sangat pendek bernada tinggi (sine yang meluncur naik). */
function chirp(
  ctx: AudioContext,
  out: AudioNode,
  { f0, f1, start, len, peak }: ChirpOptions,
): AudioScheduledSourceNode {
  const t = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(f0, t);
  osc.frequency.exponentialRampToValueAtTime(f1, t + len);
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 1000;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(peak, t + 0.008);
  env.gain.exponentialRampToValueAtTime(0.0001, t + len + 0.05);
  osc.connect(hp);
  hp.connect(env);
  env.connect(out);
  osc.onended = () => env.disconnect();
  osc.start(t);
  osc.stop(t + len + 0.08);
  return osc;
}

/** Hamster: dua cicit cepat, yang kedua sedikit lebih tinggi. */
export function playSqueak(
  ctx: AudioContext,
  out: AudioNode,
  pitch = 1,
  delay = 0,
): AudioScheduledSourceNode {
  chirp(ctx, out, {
    f0: 2600 * pitch,
    f1: 3600 * pitch,
    start: delay,
    len: 0.07,
    peak: 0.14,
  });
  return chirp(ctx, out, {
    f0: 2800 * pitch,
    f1: 3900 * pitch,
    start: delay + 0.11,
    len: 0.08,
    peak: 0.12,
  });
}

/** Kelinci: cuit lembut yang hangat. */
export function playRabbit(
  ctx: AudioContext,
  out: AudioNode,
  pitch = 1,
  delay = 0,
): AudioScheduledSourceNode {
  return playVoice(ctx, out, {
    f0: 1300 * pitch,
    f1: 1900 * pitch,
    f2: 1500 * pitch,
    len: 0.26,
    peak: 0.16,
    vib: 8,
    vibDepth: 10,
    delay,
  });
}

/** Rubah: dua "yip" beruntun. */
export function playYip(
  ctx: AudioContext,
  out: AudioNode,
  pitch = 1,
  delay = 0,
): AudioScheduledSourceNode {
  playVoice(ctx, out, {
    f0: 650 * pitch,
    f1: 1200 * pitch,
    f2: 700 * pitch,
    len: 0.2,
    peak: 0.26,
    delay,
  });
  return playVoice(ctx, out, {
    f0: 720 * pitch,
    f1: 1350 * pitch,
    f2: 760 * pitch,
    len: 0.24,
    peak: 0.26,
    delay: delay + 0.1,
  });
}

/** Red panda: kicau bergetar lalu satu cicit pendek. */
export function playTwitter(
  ctx: AudioContext,
  out: AudioNode,
  pitch = 1,
  delay = 0,
): AudioScheduledSourceNode {
  playVoice(ctx, out, {
    f0: 1800 * pitch,
    f1: 2600 * pitch,
    f2: 2000 * pitch,
    len: 0.4,
    peak: 0.15,
    vib: 9,
    vibDepth: 14,
    trill: 20,
    delay,
  });
  return playVoice(ctx, out, {
    f0: 1500 * pitch,
    f1: 1700 * pitch,
    f2: 1400 * pitch,
    len: 0.14,
    peak: 0.12,
    delay: delay + 0.42,
  });
}
