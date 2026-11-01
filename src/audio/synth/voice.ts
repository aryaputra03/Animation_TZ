/**
 * Satu "nada kucing": nada naik dari f0 ke puncak f1, lalu turun ke f2.
 * Diport dari desain referensi, dengan pembersihan node setelah selesai.
 */
export interface VoiceParams {
  f0: number;
  f1: number;
  f2: number;
  len: number;
  peak?: number;
  vib?: number;
  vibDepth?: number;
  trill?: number;
  delay?: number;
}

export function playVoice(ctx: AudioContext, out: AudioNode, p: VoiceParams): AudioScheduledSourceNode {
  const { f0, f1, f2, len, peak = 0.3, vib = 6, vibDepth = 12, trill = 0, delay = 0 } = p;
  const t = ctx.currentTime + delay;
  const end = t + len + 0.05;

  // suara utama (lembut) + satu oktaf di atasnya supaya berkilau imut
  const o1 = ctx.createOscillator();
  o1.type = 'triangle';
  const o2 = ctx.createOscillator();
  o2.type = 'sine';
  const g2 = ctx.createGain();
  g2.gain.value = 0.35;
  [o1, o2].forEach((o, i) => {
    const m = i === 0 ? 1 : 2;
    o.frequency.setValueAtTime(f0 * m, t);
    o.frequency.exponentialRampToValueAtTime(f1 * m, t + len * 0.3);
    o.frequency.exponentialRampToValueAtTime(f2 * m, t + len);
  });

  // vibrato halus supaya terdengar hidup
  const lfo = ctx.createOscillator();
  lfo.frequency.value = vib;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = vibDepth * 3; // satuan: cent
  lfo.connect(lfoGain);
  lfoGain.connect(o1.detune);
  lfoGain.connect(o2.detune);

  // filter "vokal": dari "mi" ke "aw" seperti mulut membuka
  const vowel = ctx.createBiquadFilter();
  vowel.type = 'peaking';
  vowel.gain.value = 9;
  vowel.Q.value = 2;
  vowel.frequency.setValueAtTime(1100, t);
  vowel.frequency.exponentialRampToValueAtTime(2400, t + len * 0.3);
  vowel.frequency.exponentialRampToValueAtTime(1300, t + len);
  const soft = ctx.createBiquadFilter();
  soft.type = 'lowpass';
  soft.frequency.value = 4500;

  // volume naik halus, turun pelan (tidak mengagetkan)
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(peak, t + 0.04);
  env.gain.exponentialRampToValueAtTime(0.0001, t + len);

  // trill: volume dikedipkan cepat = bunyi "mrrp"
  const tr = ctx.createGain();
  tr.gain.value = trill ? 0.55 : 1;
  const extra: AudioScheduledSourceNode[] = [];
  if (trill) {
    const tl = ctx.createOscillator();
    tl.frequency.value = trill;
    const td = ctx.createGain();
    td.gain.value = 0.45;
    tl.connect(td);
    td.connect(tr.gain);
    tl.start(t);
    tl.stop(end);
    extra.push(tl);
  }

  o1.connect(vowel);
  o2.connect(g2);
  g2.connect(vowel);
  vowel.connect(soft);
  soft.connect(env);
  env.connect(tr);
  tr.connect(out);

  o1.onended = () => {
    tr.disconnect();
    env.disconnect();
    soft.disconnect();
    vowel.disconnect();
  };
  [o1, o2, lfo].forEach((o) => {
    o.start(t);
    o.stop(end);
  });
  return o1;
}

/** "Pop" bulat pendek untuk tombol dan partikel. */
export function playPop(ctx: AudioContext, out: AudioNode, delay = 0, pitch = 1): AudioScheduledSourceNode {
  const t = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400 * pitch, t);
  osc.frequency.exponentialRampToValueAtTime(700 * pitch, t + 0.07);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.25, t + 0.01);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
  osc.connect(env);
  env.connect(out);
  osc.onended = () => env.disconnect();
  osc.start(t);
  osc.stop(t + 0.1);
  return osc;
}
