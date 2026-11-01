/** Dentingan manis (latte art, hadiah kecil). */
export function playTing(ctx: AudioContext, out: AudioNode, pitch = 1): AudioScheduledSourceNode {
  const t = ctx.currentTime;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.2, t + 0.01);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
  env.connect(out);

  const main = ctx.createOscillator();
  main.type = 'sine';
  main.frequency.value = 1600 * pitch;
  const overtone = ctx.createOscillator();
  overtone.type = 'sine';
  overtone.frequency.value = 3200 * pitch;
  const overtoneGain = ctx.createGain();
  overtoneGain.gain.value = 0.3;
  main.connect(env);
  overtone.connect(overtoneGain);
  overtoneGain.connect(env);

  main.onended = () => env.disconnect();
  main.start(t);
  overtone.start(t);
  main.stop(t + 0.5);
  overtone.stop(t + 0.5);
  return main;
}

/** Dua nada naik lembut saat pasangan kartu ditemukan. */
export function playMatch(ctx: AudioContext, out: AudioNode, pitch = 1): AudioScheduledSourceNode {
  const t = ctx.currentTime;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.18, t + 0.015);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.48);
  env.connect(out);

  const notes = [880, 1320];
  const oscillators = notes.map((frequency, index) => {
    const oscillator = ctx.createOscillator();
    const noteStart = t + index * 0.14;
    oscillator.type = "sine";
    oscillator.frequency.value = frequency * pitch;
    oscillator.connect(env);
    oscillator.start(noteStart);
    oscillator.stop(noteStart + 0.34);
    return oscillator;
  });

  const lastOscillator = oscillators[oscillators.length - 1];
  lastOscillator?.addEventListener("ended", () => env.disconnect(), { once: true });
  return lastOscillator as OscillatorNode;
}

/** Boing kecil dan turun-naik lembut untuk pasangan yang belum cocok. */
export function playBoing(
  ctx: AudioContext,
  out: AudioNode,
  pitch = 1,
  delay = 0,
): AudioScheduledSourceNode {
  const t = ctx.currentTime + delay;
  const oscillator = ctx.createOscillator();
  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(430 * pitch, t);
  oscillator.frequency.exponentialRampToValueAtTime(190 * pitch, t + 0.1);
  oscillator.frequency.exponentialRampToValueAtTime(270 * pitch, t + 0.2);

  const envelope = ctx.createGain();
  envelope.gain.setValueAtTime(0.0001, t);
  envelope.gain.exponentialRampToValueAtTime(0.13, t + 0.012);
  envelope.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
  oscillator.connect(envelope);
  envelope.connect(out);
  oscillator.addEventListener("ended", () => envelope.disconnect(), { once: true });
  oscillator.start(t);
  oscillator.stop(t + 0.26);
  return oscillator;
}

/** Dentingan tiga nada lembut saat cangkir kopi penuh. */
export function playCupFull(ctx: AudioContext, out: AudioNode, pitch = 1): AudioScheduledSourceNode {
  const t = ctx.currentTime;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.12, t + 0.025);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.72);
  env.connect(out);

  const notes = [660, 830, 990];
  const oscillators = notes.map((frequency, index) => {
    const oscillator = ctx.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency * pitch;
    oscillator.connect(env);
    oscillator.start(t + index * 0.12);
    oscillator.stop(t + 0.48 + index * 0.12);
    return oscillator;
  });

  const lastOscillator = oscillators[oscillators.length - 1];
  lastOscillator?.addEventListener("ended", () => env.disconnect());
  return lastOscillator as OscillatorNode;
}

/** Kopi tumpah: noise tersaring yang meluncur turun. */
export function playSpill(ctx: AudioContext, out: AudioNode, noise: AudioBuffer | null): AudioScheduledSourceNode {
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  if (noise) src.buffer = noise;
  src.loop = true;
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.Q.value = 1.1;
  band.frequency.setValueAtTime(2200, t);
  band.frequency.exponentialRampToValueAtTime(600, t + 0.6);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.18, t + 0.06);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.65);
  src.connect(band);
  band.connect(env);
  env.connect(out);
  src.onended = () => env.disconnect();
  src.start(t);
  src.stop(t + 0.7);
  return src;
}
