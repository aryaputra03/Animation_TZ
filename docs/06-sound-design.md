# 06 - Desain Suara

Semua suara **dibuat dari kode** dengan **Web Audio API** (sintesis), tanpa file audio. Gayanya **realistis tapi imut**: terdengar seperti suara hewan aslinya, namun dilembutkan agar nyaman di HP. **Tanpa musik latar.** Suara hanya muncul sebagai reaksi saat pengguna mengetuk atau berinteraksi. Daftar kejadian yang memicu suara ada di `03-sections-and-copy.md`, `04-characters.md`, dan `05-minigames.md`.

## 1. Prinsip

1. **Tidak ada suara sebelum ketukan pertama** di layar pembuka (aturan autoplay Android).
2. **Lembut dan pendek.** Tidak ada suara yang keras, tajam, atau mengagetkan. Pengguna mungkin sedang di tempat umum atau jam istirahat kerja.
3. **Setiap hewan punya suara khas** yang mudah dikenali.
4. **Sedikit variasi acak** di tiap pemutaran (nada ±1 semiton, durasi ±10%) agar tidak terdengar seperti rekaman yang diulang.
5. **Selalu ada tombol mute** dan pilihannya diingat.
6. **Aman untuk speaker HP:** speaker HP hampir tidak memproduksi nada di bawah sekitar 200 Hz. Suara bernada rendah (misalnya dengkuran kucing) harus mengandung **harmonik di rentang 200 sampai 800 Hz** agar tetap terdengar.
7. **Ringan.** Tidak ada file audio, tidak ada library audio pihak ketiga. Semua node dibersihkan setelah selesai.

## 2. Arsitektur `SoundManager`

Satu *singleton* yang mengatur seluruh suara. Komponen lain hanya memanggil `SoundManager.play('cat.meow')`.

### Rantai audio

```
[voice] → [bus gain] → [DynamicsCompressor (limiter lembut)] → [master gain] → destination
```

- `master gain`: batas maksimum sekitar **0.6** (nilai awal), bisa diatur.
- `DynamicsCompressor`: `threshold ≈ -18 dB`, `ratio ≈ 6`, `attack ≈ 0.003`, `release ≈ 0.15` untuk mencegah *clipping* saat banyak suara bersamaan (misalnya "paduan suara" di penutup).
- Target level puncak tiap suara sekitar **-12 dBFS** sebelum master.

### Antarmuka (disarankan)

```ts
type SoundId =
  | 'ui.start' | 'ui.pop' | 'ui.ting' | 'ui.boing' | 'ui.whoosh'
  | 'cat.meow' | 'cat.meowHappy' | 'cat.meowLebay' | 'cat.purr' | 'cat.yawn' | 'cat.sleep'
  | 'hamster.squeak' | 'rabbit.chirp' | 'fox.yip' | 'redpanda.twitter' | 'redpanda.yawn'
  | 'cup.spill' | 'heart.pop'
  | 'game.beanCatch' | 'game.cupFull' | 'game.cardFlip' | 'game.match'
  | 'game.wrong' | 'game.win'
  | 'closing.choir';

interface PlayOptions {
  volume?: number;       // 0..1, relatif terhadap bus
  pitch?: number;        // rasio, default 1
  pitchJitter?: number;  // default 0.06 (≈ ±1 semiton)
  delay?: number;        // detik
}

interface SoundManager {
  unlock(): Promise<void>;                    // dipanggil dari ketukan pertama
  play(id: SoundId, opts?: PlayOptions): void;
  startLoop(id: 'cat.purr'): void;            // dengkuran selama ditekan
  stopLoop(id: 'cat.purr'): void;
  setMuted(muted: boolean): void;
  isMuted(): boolean;
  suspend(): void;                            // saat tab tersembunyi
  resume(): void;
}
```

### Siklus hidup
- `AudioContext` **dibuat di dalam handler ketukan pertama** (tombol "Ketuk untuk mulai 🐾"), bukan saat halaman dimuat. Panggil `ctx.resume()` bila statusnya `suspended`.
- Jika `AudioContext` tidak tersedia atau gagal, **semua pemanggilan menjadi no-op** tanpa melempar error.
- `visibilitychange`: saat tab tersembunyi, `suspend()`. Saat terlihat kembali dan tidak di-mute, `resume()`.
- Saat mute: turunkan `master gain` ke 0 dengan ramp pendek (~30 ms), hentikan semua *loop*, dan jangan membuat suara baru. Saat unmute: naikkan kembali dengan ramp.
- Status mute disimpan di `localStorage` (kunci `muted`) dan di Zustand. Nilai awal: **tidak mute**.

### Batasan pemutaran
- **Maksimal 6 suara bersamaan.** Jika penuh, abaikan suara baru berprioritas rendah (UI kecil) atau hentikan suara tertua.
- **Cooldown per ID:** minimal sekitar **80 ms** antar pemutaran ID yang sama (mencegah suara menumpuk saat diketuk beruntun).
- Suara hewan yang sama tidak boleh tumpang-tindih lebih dari **2** instance.
- Bersihkan node pada `onended` (`disconnect()`), dan hentikan osilator dengan `stop()` terjadwal.

### Aturan teknis sintesis
- Mulai amplitudo di **0.0001** lalu naik (hindari bunyi klik). Akhiri dengan ramp turun ke 0.0001 sebelum `stop()`.
- Gunakan `setTargetAtTime` atau `linearRampToValueAtTime` / `exponentialRampToValueAtTime` untuk semua perubahan nada dan amplitudo.
- Buat **satu buffer noise putih** (sekitar 1 detik) saat `unlock()`, lalu pakai ulang untuk semua suara bernoise.
- Jangan membuat `AudioContext` lebih dari satu.

---

## 3. Resep suara hewan

Nilai di bawah adalah **titik awal**. Setel dengan telinga di HP Android sungguhan. Semua frekuensi dikalikan `pitch` (dengan sedikit acak).

### 3.1 Kucing: meow (`cat.meow`)

Suara "meow" realistis = nada dasar yang naik-turun, dilewatkan melalui **filter formant** yang bergeser dari "mmm" ke "eee" ke "ow".

| Elemen | Pengaturan |
|---|---|
| Sumber | Osilator `sawtooth` (atau `triangle` dicampur sedikit `sawtooth`) |
| Kontur nada (f0) | 450 Hz → naik ke 800 Hz (sekitar 30% durasi) → turun ke 520 Hz di akhir |
| Durasi | sekitar **0,55 s** (±10%) |
| Vibrato | LFO 5 sampai 6 Hz, kedalaman ±12 Hz, makin terasa di akhir |
| Formant | Dua filter `bandpass` paralel (Q ≈ 6 sampai 8). F1 bergeser 500 → 900 → 600 Hz. F2 bergeser 1500 → 2200 → 1400 Hz |
| Amplitudo | *Attack* 40 ms, *sustain* ringan, *release* 180 ms |
| Tambahan | Sedikit noise (gain 0.03) lewat bandpass 3 kHz untuk "nafas" |

Varian:
- `cat.meowHappy`: durasi lebih pendek (~0,35 s), nada akhir lebih tinggi.
- `cat.meowLebay`: dua meow beruntun, nada makin tinggi (mode lebay).
- `cat.yawn`: noise lembut dengan filter yang meluncur turun sekitar 0,8 s (menguap, volume rendah).
- `cat.sleep`: dengkuran sangat halus dan jarang (opsional, volume rendah).

Contoh kerangka (ilustrasi, bukan final):

```ts
function playMeow(ctx: AudioContext, out: AudioNode, pitch = 1) {
  const t = ctx.currentTime;
  const dur = 0.55 * (0.9 + Math.random() * 0.2);
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(450 * pitch, t);
  osc.frequency.linearRampToValueAtTime(800 * pitch, t + dur * 0.3);
  osc.frequency.linearRampToValueAtTime(520 * pitch, t + dur);
  // vibrato LFO, dua bandpass formant paralel yang di-sweep, noise tipis,
  // envelope A=40ms / R=180ms, lalu sambungkan ke `out`.
}
```

### 3.2 Kucing: dengkuran (`cat.purr`, loop)

| Elemen | Pengaturan |
|---|---|
| Sumber | `sawtooth` sekitar **70 sampai 90 Hz** + noise coklat tipis |
| Modulasi amplitudo | LFO **22 sampai 28 Hz** (kedalaman penuh 0 → 1) yang menciptakan "getaran" khas dengkuran |
| Filter | `bandpass` sekitar **250 sampai 500 Hz** (agar terdengar di speaker HP) |
| Level | Rendah. *Fade-in* 150 ms saat mulai, *fade-out* 250 ms saat berhenti |
| Perilaku | Dimulai saat tekan-tahan (elus), berhenti saat jari dilepas |

### 3.3 Hamster: cicit (`hamster.squeak`)

| Elemen | Pengaturan |
|---|---|
| Sumber | `sine` atau `triangle` |
| Kontur nada | Dua cicit cepat: 2,6 kHz → 3,6 kHz (±70 ms), jeda 40 ms, ulang sedikit lebih tinggi |
| Durasi total | sekitar **0,2 s** |
| Filter | `highpass` ~1 kHz |
| Amplitudo | *Attack* 5 ms, *release* 50 ms |
| Variasi | Nada acak ±8% agar tiap sapaan terdengar berbeda |

### 3.4 Kelinci: cuit lembut (`rabbit.chirp`)

Kelinci asli hampir tak bersuara, jadi dibuat sebagai cuit lembut dan hangat.

| Elemen | Pengaturan |
|---|---|
| Sumber | `sine` + sedikit `triangle` |
| Kontur nada | 1,3 kHz → 1,9 kHz → 1,5 kHz |
| Durasi | sekitar **0,25 s** |
| Vibrato | LFO 8 Hz, kedalaman ±15 Hz |
| Amplitudo | *Attack* 30 ms, *release* 120 ms (lebih lembut dari hamster) |

### 3.5 Rubah: yip (`fox.yip`)

| Elemen | Pengaturan |
|---|---|
| Sumber | `sawtooth` |
| Kontur nada | 650 Hz → 1,2 kHz → 700 Hz, cepat (sekitar 0,22 s) |
| Formant | Bandpass F1 ~700 Hz, F2 ~1,8 kHz (bunyi "yip") |
| Pola | Dua *yip* beruntun (jeda ~60 ms), yang kedua sedikit lebih tinggi |
| Amplitudo | *Attack* 10 ms, *release* 90 ms |

### 3.6 Red panda: cicit khas (`redpanda.twitter`)

Red panda dikenal dengan kicau bernada tinggi yang bergetar.

| Elemen | Pengaturan |
|---|---|
| Sumber | `sine` |
| Kontur nada | 1,8 kHz → 2,6 kHz dengan **trill cepat** (LFO 18 sampai 22 Hz, kedalaman ±120 Hz) |
| Durasi | sekitar **0,4 s** |
| Tambahan | Cicit pendek kedua di akhir (nada lebih rendah) |
| Amplitudo | *Attack* 20 ms, *release* 150 ms |
- `redpanda.yawn`: noise lembut meluncur turun (seperti `cat.yawn`) dengan nada sedikit lebih tinggi.

---

## 4. Suara UI, adegan, dan game

| ID | Pemicu | Karakter suara |
|---|---|---|
| `ui.start` | Ketukan pertama (layar pembuka) | Meow kecil + dentingan halus (mengaktifkan audio) |
| `ui.pop` | Tombol ditekan, partikel hati | "Pop" bulat pendek: `sine` 400 → 700 Hz, ~80 ms |
| `ui.ting` | Latte art hati, dentingan kecil | `sine` 1,6 kHz + harmonik 3,2 kHz, peluruhan ~350 ms |
| `ui.boing` | Kartu salah, pantulan lucu | `sine` meluncur 300 → 150 → 220 Hz, ~220 ms, lembut |
| `ui.whoosh` | Transisi layar | Noise bandpass menyapu naik, ~250 ms, volume rendah |
| `heart.pop` | Hati muncul (elus, hewan senang) | `ui.pop` lebih tinggi dan singkat |
| `cup.spill` | Easter egg kopi tumpah | Noise tersaring menurun (sapuan "glug") ~600 ms |
| `game.beanCatch` | Biji kopi tertangkap | "Pop" kecil, **nada naik tiap biji** (maksimal 10 tingkat) |
| `game.cupFull` | Cangkir penuh | Dentingan tiga nada naik (do-mi-sol) + `cat.meowHappy` |
| `game.cardFlip` | Kartu dibalik | Suara khas hewan di kartu (volume 60%) |
| `game.match` | Pasangan cocok | Dua nada naik manis + `heart.pop` |
| `game.wrong` | Pasangan salah | `ui.boing` lembut (bukan buzzer) |
| `game.win` | Game selesai | Arpeggio naik singkat (~0,8 s), lembut |
| `closing.choir` | Easter egg bulan di penutup | Semua suara hewan bergantian cepat dengan nada naik-turun (lihat bagian 5) |

Aturan: **tidak ada suara kegagalan yang keras**. Kesalahan dibalas "boing" lembut yang lucu.

---

## 5. "Paduan suara" penutup (`closing.choir`)

Dipicu mengetuk bulan di S11 (sekitar 3 detik):

1. Susun jadwal pendek: kucing, hamster, kelinci, rubah, red panda, lalu semuanya bersama.
2. Tiap suara dimainkan dengan **nada diarahkan pada tangga nada mayor sederhana** (misalnya C-E-G-A-G) lewat parameter `pitch`, agar terdengar seperti "nyanyian" lucu.
3. Beri jeda sekitar 250 ms antar suara, lalu bagian akhir menumpuk 2 sampai 3 suara dengan volume lebih kecil.
4. Gunakan `delay` pada `PlayOptions` untuk penjadwalan, bukan `setTimeout` (lebih presisi).
5. Patuhi batas 6 suara bersamaan dan pastikan kompresor tidak membuatnya pecah.
6. Hormati mute: jika di-mute, animasi hati tetap berjalan tanpa suara.

---

## 6. Getar (haptic)

Menggunakan **Vibration API** (`navigator.vibrate`) pada Chrome Android. Selalu bungkus dengan pengecekan dukungan dan `try/catch`. Getar tidak terikat tombol mute (karena senyap), tetapi **dimatikan saat mode hemat animasi aktif**.

| Pemicu | Pola |
|---|---|
| Ketuk hewan | `[10]` |
| Elus kucing (selama ditekan) | `[8]` berulang tiap ~140 ms |
| Biji kopi tertangkap | `[6]` |
| Pasangan cocok | `[20]` |
| Game selesai | `[20, 40, 20, 40, 30]` |
| Mode lebay | `[15, 30, 15, 30, 15]` |

Aturan:
- Jangan getar berkepanjangan. Total tiap pola di bawah sekitar 300 ms (kecuali elus, yang dihentikan saat jari dilepas).
- Panggil `navigator.vibrate(0)` untuk menghentikan getar saat elus berakhir.
- Getar hanya dipanggil dari handler interaksi pengguna (syarat aktivasi pengguna).
- Jika tidak didukung, abaikan secara diam-diam.

---

## 7. Tombol mute

- Posisi: **pojok kanan atas**, di dalam safe area, `position: fixed`, `z-index` 60 (lihat `02-design-system.md`).
- Target sentuh minimal **48 x 48 px**. Ikon speaker bergaya bulat dan tebal (SVG inline).
- Atribut: `aria-pressed`, `aria-label` "Matikan suara" / "Nyalakan suara".
- Terlihat sejak setelah layar pembuka, dan tetap tampil sampai akhir.
- Mengubahnya memicu balon chat kucing (teks di `03-sections-and-copy.md`, bagian 13).
- Saat mute: tidak ada suara apa pun, dan animasi berjalan seperti biasa.

---

## 8. Struktur file yang disarankan

```
src/audio/
├── SoundManager.ts       # singleton: unlock, play, loop, mute, suspend/resume, polyphony, cooldown
├── soundIds.ts           # tipe SoundId dan metadata (prioritas, cooldown, volume dasar)
├── synth/
│   ├── helpers.ts        # envelope, noise buffer, formant, vibrato, jitter acak
│   ├── cat.ts            # meow, meowHappy, meowLebay, purr, yawn
│   ├── hamster.ts
│   ├── rabbit.ts
│   ├── fox.ts
│   ├── redpanda.ts
│   ├── ui.ts             # pop, ting, boing, whoosh, heart
│   └── game.ts           # beanCatch, cupFull, match, wrong, win, choir
└── haptics.ts            # vibrate(pattern), cancel(), dukungan dan try/catch
```

Aturan:
- Setiap fungsi sintesis menerima `(ctx, out, options)` dan **mengembalikan** objek dengan `stop()` (untuk loop dan pembersihan).
- Hook `useSound()` membungkus `SoundManager` untuk komponen React, dan membaca status mute dari Zustand.
- Semua parameter suara (frekuensi, durasi, volume) dikumpulkan di satu objek konfigurasi agar mudah disetel tanpa membaca kode sintesis.

---

## 9. Pengujian suara

Uji di **HP Android sungguhan**, bukan hanya di laptop:
- Kuping Android menilai suara berbeda dari headphone. Pastikan **dengkuran kucing terdengar** di speaker HP.
- Uji di volume media rendah, sedang, dan penuh. Tidak boleh ada suara yang menusuk telinga.
- Uji dengan headphone: tidak boleh ada klik atau *pop* yang tidak diinginkan.
- Ketuk beruntun cepat: suara tidak menumpuk berlebihan, tidak ada lag.
- Tab dipindah dan kembali: suara berhenti lalu lanjut dengan benar.
- Mute lalu unmute di tengah suara: tidak ada suara tersangkut.

## 10. Daftar periksa

- [ ] Tidak ada suara sebelum ketukan pertama; `AudioContext` dibuat di handler ketukan
- [ ] Tidak ada file audio dan tidak ada library audio tambahan
- [ ] Setiap hewan punya suara khas yang bisa dibedakan
- [ ] Dengkuran kucing terdengar di speaker HP (ada harmonik 200 sampai 800 Hz)
- [ ] Variasi acak tiap pemutaran aktif
- [ ] Batas 6 suara bersamaan dan cooldown per ID berfungsi
- [ ] Master gain dibatasi dan kompresor mencegah clipping
- [ ] Tombol mute: `aria-pressed`, tersimpan, menghentikan loop dan suara baru
- [ ] Suara berhenti saat tab tersembunyi
- [ ] Getar dibungkus pengecekan dukungan dan `try/catch`, dimatikan di mode hemat animasi
- [ ] Tidak ada musik latar
- [ ] Tidak ada suara kegagalan yang keras
