# 07 - Arsitektur Teknis

Struktur kode, alur data, dan aturan teknis. Stack dan larangan utama ada di `AGENTS.md`. Dokumen ini menjelaskan **bagaimana** semuanya disusun. Isi visual ada di `02`, teks di `03`, karakter di `04`, game di `05`, suara di `06`.

## 1. Stack dan aturan dependency

| Kebutuhan | Pilihan |
|---|---|
| Build | Vite |
| UI | React + TypeScript (`strict`) |
| Styling | Tailwind CSS (versi stabil terbaru) |
| Animasi scroll | `gsap` + `ScrollTrigger` |
| Animasi komponen | `framer-motion` (pakai `LazyMotion` + `domAnimation` untuk menghemat ukuran) |
| State global | `zustand` |
| Suara | Web Audio API buatan sendiri |
| Game | Canvas 2D (game 1), DOM (game 2 dan 3) |
| Package manager | npm |

Aturan:
- **Dependency runtime** di luar tabel ini **tidak boleh** ditambah tanpa persetujuan. Itu termasuk `@gsap/react`, library ikon, library audio, `vite-plugin-pwa`, Lenis, dan sejenisnya.
- **Alat pengembangan** (`devDependencies`) seperti ESLint, `typescript-eslint`, Prettier, dan plugin Tailwind/React untuk Vite **diperbolehkan**.
- Integrasi GSAP di React memakai `gsap.context()` di dalam `useLayoutEffect` dan dibersihkan lewat `ctx.revert()` (tanpa paket tambahan).

## 2. Struktur folder

```
project-root/
├── AGENTS.md
├── docs/                       # 01 sampai 08
├── index.html                  # meta, Open Graph, manifest, font preload
├── package.json
├── vite.config.ts
├── tsconfig.json               # "strict": true
├── vercel.json                 # opsional (header cache)
├── public/
│   ├── fonts/                  # woff2 Fredoka dan Nunito (subset Latin)
│   ├── icons/                  # icon-192.png, icon-512.png, maskable-512.png, favicon.svg
│   ├── og-image.png            # 1200 x 630
│   ├── manifest.webmanifest
│   └── robots.txt
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── styles/
    │   ├── index.css           # Tailwind, font-face, token CSS, aturan global
    │   └── tokens.css          # variabel warna, radius, bayangan (dari 02)
    ├── content/                # SEMUA teks (lihat 03)
    │   ├── sections.ts
    │   ├── bubbles.ts
    │   ├── system.ts
     │   └── closing.ts          # teks pesan, salam perpisahan, dan tombol animasi bunga
    ├── store/
    │   ├── useAppStore.ts      # Zustand
    │   └── storage.ts          # localStorage aman (catName, muted)
    ├── core/
    │   ├── ScrollDirector.tsx  # sumber kebenaran scroll, latar, section aktif
    │   ├── scrollLock.ts       # kunci scroll berbasis penghitung
    │   ├── bubbles.ts          # BubbleManager (antrean, jeda, prioritas)
    │   ├── performance.ts      # deteksi mode hemat animasi
    │   ├── gsap.ts             # registrasi plugin sekali saja
    │   └── hooks/
    │       ├── useInView.ts
    │       ├── useIdle.ts
    │       ├── useReducedMotion.ts
    │       ├── useLongPress.ts
    │       └── useMultiTap.ts  # ketuk 5 kali (mode lebay)
    ├── audio/                  # lihat 06
    ├── components/
    │   ├── characters/         # lihat 04
    │   ├── ui/                 # Button, MuteButton, SpeechBubble, PawProgress, CatNameInput
    │   ├── Preloader.tsx
    │   ├── PortraitGuard.tsx
    │   ├── SkyBackground.tsx   # latar tetap (langit, bintang, bulan)
    │   └── ErrorBoundary.tsx
    ├── sections/
    │   ├── index.ts            # registry urutan S1..S11
    │   ├── S01_Intro.tsx
    │   ├── S02_Hero.tsx
    │   ├── S03_Barista.tsx
    │   ├── S04_GameBeans.tsx
    │   ├── S05_HamsterWheel.tsx
    │   ├── S06_GameHamster.tsx
    │   ├── S07_Rabbits.tsx
    │   ├── S08_Fox.tsx
    │   ├── S09_RedPanda.tsx
    │   ├── S10_GameCards.tsx
    │   └── S11_Closing.tsx
    ├── features/games/         # lihat 05
    └── types/
```

Aturan struktur:
- **Section** hanya menyusun tata letak dan memanggil komponen karakter, game, dan teks. Logika bersama ada di `core/` dan `hooks/`.
- **Satu file, satu tanggung jawab.** Pecah file yang melebihi sekitar 250 baris.
- Impor memakai alias `@/` yang menunjuk ke `src/`.

## 3. Alur aplikasi

1. `index.html` dimuat dengan font ter-*preload* dan meta lengkap.
2. `App` merender `Preloader` (kunci scroll aktif, konten di belakang diberi atribut `inert`).
3. Pengguna mengisi nama kucing (opsional) dan menekan **"Ketuk untuk mulai 🐾"**:
   - simpan `catName` (bawaan **Oyen**),
   - `SoundManager.unlock()`,
   - `started = true`, lepas kunci scroll `preloader`,
   - `Preloader` memudar, lalu dilepas dari DOM.
4. `ScrollDirector` mengambil alih: mengamati section, mengatur latar, memicu balon chat.
5. Section game mengunci scroll hanya saat `playing` (lihat `05`).
 6. Penutup (S11) menampilkan pesan, salam perpisahan yang dapat dipicu dengan mengetuk setiap hewan, dan tombol animasi bunga setelah ketiga game dimenangkan.

## 4. State global (Zustand)

Satu store kecil. **Hanya `catName` dan `muted` yang disimpan permanen** (lihat bagian 5).

```ts
interface AppState {
  // sesi
  started: boolean;
  catName: string;                       // bawaan 'Oyen'
  muted: boolean;
  perfMode: 'normal' | 'low';            // mode hemat animasi
  reducedMotion: boolean;

  // scroll
  activeSectionId: SectionId | null;
  scrollProgress: number;                // 0..1 (seluruh halaman)

  // game (hanya di memori sesi)
  gameResults: Partial<Record<GameId, 'success'>>;

  // balon chat
  bubble: { id: string; text: string; ts: number } | null;

  // tindakan
  start: (name: string) => void;
  setMuted: (m: boolean) => void;
  setActiveSection: (id: SectionId) => void;
  setProgress: (p: number) => void;
  setGameStatus: (id: GameId, s: GameStatus) => void;
  say: (b: { id: string; text: string } | null) => void;
}
```

Aturan:
- Pakai **selector** (`useAppStore(s => s.xxx)`) agar komponen tidak ter-render ulang berlebihan.
- `scrollProgress` **jangan** dipakai untuk merender ulang React setiap frame. Nilai progres untuk animasi latar dan parallax dikelola langsung oleh GSAP (tanpa state React). Simpan ke store hanya dengan frekuensi rendah (misalnya saat melewati ambang tertentu) atau untuk indikator yang di-*throttle*.
- Ruang rahasia S11 hanya dibuka jika seluruh `gameResults` untuk `coffee-beans`, `hamster-pop`, dan `card-match` bernilai `success`.
- Jangan menaruh objek besar atau fungsi sinkron berat di store.

## 5. Penyimpanan (`storage.ts`)

- Hanya dua kunci: **`catName`** dan **`muted`**.
- Semua akses dibungkus `try/catch` (mode privat atau penyimpanan penuh tidak boleh membuat aplikasi rusak).
- Validasi saat membaca: `catName` dipotong maksimal 12 karakter dan di-*trim*, `muted` hanya `'true'` atau `'false'`.
- Nilai kosong atau tidak valid kembali ke bawaan (`Oyen`, tidak mute).
- Tidak menyimpan data lain (tanpa progres, tanpa waktu kunjungan, tanpa identitas).

## 6. Scroll Director

Komponen tunggal yang menjadi **sumber kebenaran** untuk posisi scroll.

### Model scroll
- **Scroll bawaan browser** pada dokumen (bukan smooth-scroll library). Section adalah blok vertikal biasa.
- Tinggi section hewan: minimal `100dvh`. Section game: `100dvh` (kartu intro dan area game).
- **Hindari *pinning* yang berlebihan.** Pinning hanya bila benar-benar perlu (misalnya roda hamster) dan dengan `pinSpacing` yang tepat.

### Tugas
1. **Section aktif:** `IntersectionObserver` (ambang sekitar 0,55) memperbarui `activeSectionId` dan memicu balon `enter`.
2. **Latar:** satu `ScrollTrigger` (scrub) pada seluruh halaman menginterpolasi warna latar sesuai tabel di `02-design-system.md` bagian 3. Elemen latar `position: fixed` dengan variabel CSS yang di-set GSAP (`--bg-top`, `--bg-bottom`, `--text`), tanpa merender ulang React.
3. **Parallax dekoratif:** tiap section mendaftarkan elemen dekorasi dengan kecepatan sendiri lewat `data-speed`. Dinonaktifkan di mode hemat animasi.
4. **Indikator jejak kaki:** `PawProgress` membaca progres lewat GSAP (mengubah kelas atau transform langsung).
5. **Auto-scroll** ke section berikutnya setelah game selesai: `window.scrollTo({ top, behavior: 'smooth' })`. Jika `reducedMotion`, pakai `behavior: 'auto'`.
6. **Kunci scroll** lewat `scrollLock` (bagian 7).

### Pengaturan penting
- Daftarkan `ScrollTrigger` **sekali** di `core/gsap.ts`.
- `ScrollTrigger.config({ ignoreMobileResize: true })` agar perubahan tinggi viewport saat bilah alamat Chrome Android mengecil tidak memicu `refresh` terus-menerus.
- Panggil `ScrollTrigger.refresh()` setelah `document.fonts.ready` dan saat `orientationchange` (dengan *debounce*).
- Pada *cleanup* komponen, selalu `ctx.revert()` dan matikan observer.

### Registry section

```ts
// src/sections/index.ts
export const SECTIONS = [
  { id: 'intro',   Component: S01_Intro,        hasGame: false },
  { id: 'hero',    Component: S02_Hero,         hasGame: false },
  { id: 'barista', Component: S03_Barista,      hasGame: false },
  { id: 'game-beans',   Component: S04_GameBeans,   hasGame: true },
  { id: 'hamster', Component: S05_HamsterWheel, hasGame: false },
  { id: 'game-hamster', Component: S06_GameHamster, hasGame: true },
  { id: 'rabbits', Component: S07_Rabbits,      hasGame: false },
  { id: 'fox',     Component: S08_Fox,          hasGame: false },
  { id: 'redpanda',Component: S09_RedPanda,     hasGame: false },
  { id: 'game-cards',   Component: S10_GameCards,   hasGame: true },
  { id: 'closing', Component: S11_Closing,      hasGame: false },
] as const;
```

> Catatan: **S1 (layar pembuka) berbeda dari `Preloader`**. `Preloader` adalah overlay penuh layar yang menutup konten sampai ada ketukan pertama. Pengaturan S1 di registry hanya jika kamu ingin bagian pembuka tetap ada sebagai section pertama setelah overlay hilang. Jika layar pembuka cukup sebagai overlay, hapus `S01_Intro` dari registry dan mulai dari `hero`. **Pilih satu**, jangan keduanya, supaya tidak duplikat.

## 7. Kunci scroll (`scrollLock.ts`)

Banyak hal bisa mengunci scroll (preloader, game, overlay landscape). Pakai **penghitung berbasis alasan** agar tidak saling menimpa.

```ts
type LockReason = 'preloader' | 'game' | 'landscape';
lockScroll(reason: LockReason): void;
unlockScroll(reason: LockReason): void;
```

- Scroll terkunci selama **minimal satu alasan** aktif.
- Penguncian: `html.scroll-locked { overflow: hidden; overscroll-behavior: none; }`.
- Posisi scroll **tidak boleh melompat** saat kunci dipasang atau dilepas.
- Area game memakai `touch-action: none` hanya di dalam kontainer game.
- Pastikan setiap `lock` dipasangkan dengan `unlock` saat komponen dibongkar (hindari scroll terkunci selamanya).

## 8. Balon chat (`BubbleManager`)

Mengatur kapan {catName} berbicara agar tidak ramai.

- Masukan: pemicu (`enter`, `tap`, `idle`, `gameStart`, `gameEnd`, `system`) dan section.
- Data teks diambil dari `src/content/bubbles.ts` dengan placeholder `{catName}` yang diganti saat tampil.
- Aturan:
  - **Satu balon pada satu waktu.** Balon baru menggantikan yang lama jika prioritasnya sama atau lebih tinggi.
  - **Jeda minimal ~2,5 detik** antar balon.
  - **Prioritas:** `system` > `gameEnd` > `gameStart` > `enter` > `tap` > `idle`.
  - Jangan mengulang teks yang sama dua kali berturut-turut. Lacak teks yang sudah dipakai di memori sesi dan pilih yang belum.
  - Hilang otomatis setelah sekitar **4,5 detik** atau saat pengguna menggulir jauh ke section lain.
  - Teks ditampilkan sebagai teks biasa (tanpa `dangerouslySetInnerHTML`).
- Penampil: `SpeechBubble` menempel pada **kucing besar** (S1 sampai S4) atau **kucing mini** (S5 sampai S11), sesuai aturan di `04-characters.md`.
- Aksesibilitas: area balon memakai `aria-live="polite"` (tidak terlalu cerewet) dan `role="status"`.

## 9. Mode hemat animasi (`performance.ts`)

`perfMode = 'low'` jika salah satu terpenuhi:
- `prefers-reduced-motion: reduce`,
- `navigator.hardwareConcurrency <= 4`,
- `navigator.deviceMemory <= 2` (jika tersedia),
- **Pengukuran FPS**: rata-rata di bawah 32 fps selama 4 detik setelah mulai (pakai `requestAnimationFrame`). Jika turun, ubah ke `low` dan tidak kembali ke `normal` dalam sesi yang sama.

Efek `low` (lihat juga `02` bagian 8):
- matikan parallax dan partikel berlebih,
- gerak idle dekoratif dikurangi; gerakan utama kelinci dan rubah serta animasi interaksi tetap berjalan,
- transisi latar halus diganti perpindahan antar-section,
- batasi partikel game dan animasi menang,
- matikan getar HP.

Fitur lain tetap berjalan penuh. Untuk pengujian, boleh ada override `?perf=low` atau `?perf=normal` pada URL (aktif hanya jika `import.meta.env.DEV`).

## 10. Hook dan utilitas penting

| Hook | Fungsi |
|---|---|
| `useInView(ref, opts)` | Mengetahui elemen terlihat, dipakai untuk menjeda animasi dan game di luar layar |
| `useIdle(ms)` | Mendeteksi diam (tanpa pointer, scroll, atau tombol) selama `ms` (12 detik global, 8 detik untuk red panda) |
| `useReducedMotion()` | Membaca `prefers-reduced-motion` dan perubahan setelannya |
| `useLongPress(ms, handlers)` | Tekan-tahan (elus kucing, tumpah kopi), dengan pembatalan saat jari bergeser |
| `useMultiTap(n, windowMs)` | Ketuk n kali dalam jendela waktu (mode lebay: 5 kali dalam sekitar 3 detik) |

Aturan hook:
- Semua listener dibersihkan saat *unmount*.
- Gunakan Pointer Events (`pointerdown`, `pointerup`, `pointercancel`), bukan hanya `click`, untuk interaksi yang butuh akurasi.
- Tangani `pointercancel` dan `contextmenu` (tekan-tahan di Android bisa memicu menu konteks): pasang `onContextMenu={e => e.preventDefault()}` pada elemen interaktif yang bisa ditekan lama.

## 11. Aturan global CSS dan HTML

- `html { lang="id" }`, `meta viewport`: `width=device-width, initial-scale=1, viewport-fit=cover`.
- Tinggi layar memakai `dvh`. **Jangan `100vh`.**
- `touch-action: manipulation` pada elemen interaktif (mencegah zoom ketuk dua kali).
- `-webkit-tap-highlight-color: transparent`.
- `user-select: none` pada karakter dan tombol (bukan pada teks isi).
- `overscroll-behavior-y: contain` pada `body` agar tarik-untuk-refresh tidak mengganggu game.
- Input nama kucing: font minimal 16px (mencegah zoom otomatis).
- Struktur semantik: `<main>`, tiap section dengan `aria-labelledby`, judul dengan hierarki yang benar.
- `inert` pada konten di belakang `Preloader` sampai pengguna menekan mulai, dan fokus awal di tombol mulai.

## 12. Penjaga orientasi (`PortraitGuard`)

- Utama: **overlay CSS** berbasis `@media (orientation: landscape) and (max-height: 500px)` atau `matchMedia`, menutup seluruh layar dengan pesan lucu ("Putar balik dulu ya, Kak 🐾"), `z-index` 100.
- Saat overlay tampil: kunci scroll dengan alasan `landscape`, jeda game dan animasi berat.
- Tambahan: `"orientation": "portrait"` di manifest. Jangan mengandalkan `screen.orientation.lock()` (hanya bekerja di layar penuh atau PWA terpasang).

## 13. Penanganan error

- `ErrorBoundary` membungkus tiap section. Jika satu section gagal, tampilkan kartu cadangan lucu (misalnya kucing bingung) dan **halaman tetap bisa digulir**.
- Audio gagal: seluruh pemanggilan suara menjadi *no-op* tanpa error.
- `navigator.vibrate`, `localStorage`, `AudioContext`, dan `IntersectionObserver`: selalu dicek dukungannya.
- Tidak boleh ada `console.error` yang tidak ditangani dalam alur normal.

## 14. Performa

**Anggaran (target):**
- JS awal (gzip) sekitar **200 sampai 250 KB** di bawah. Pantau lewat `npm run build`.
- Tanpa gambar raster besar. Hanya favicon, ikon PWA, dan gambar OG.
- Font: maksimal 4 file `woff2`, subset Latin.

**Teknik:**
- *Code splitting*: muat game dengan `React.lazy` ketika section game mendekati layar (pre-muat saat section sebelumnya aktif).
- `LazyMotion` + `domAnimation` untuk Framer Motion.
- Animasikan hanya `transform` dan `opacity`. Gunakan `will-change` seperlunya dan lepas setelah animasi selesai.
- Jeda animasi, loop game, dan partikel saat di luar layar atau tab tersembunyi.
- Hindari *layout thrashing* (jangan membaca dan menulis dimensi berselingan di dalam loop).
- Batasi partikel aktif (~12) dan node SVG per karakter (~60).
- Aset statis diberi cache panjang (`immutable`) di Vercel.

**Target pengalaman:** mulus (sekitar 60 fps) di Android kelas menengah, dan LCP di bawah 2,5 detik pada jaringan 4G.

## 15. Build, kualitas, dan skrip

`package.json`:

```json
{
  "scripts": {
    "dev": "vite --host",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview --host",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  }
}
```

- `vite.config.ts`: alias `@`, `build.target: 'es2020'`, `manualChunks` memisahkan `react`, `gsap`, dan `framer-motion`.
- `tsconfig`: `strict`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`.
- ESLint: aturan React Hooks aktif dan melarang `any` implisit.
- **Uji di HP:** `npm run dev` (dengan `--host`) lalu buka alamat jaringan lokal di Chrome Android. Untuk debug, sambungkan USB dan buka `chrome://inspect` di laptop.
- **Uji otomatis (opsional, perlu persetujuan):** Vitest untuk logika murni (misalnya `useCardMatch`, `BubbleManager`, `storage`). Tidak wajib.

## 16. Metadata, PWA, dan privasi

**`index.html`:**
- `<title>Buka disaat jam istirahat saja atau pulang kerja ya 🐾</title>`
- `<meta name="description" content="Scroll pelan-pelan ya">`
- Open Graph: `og:title`, `og:description`, `og:type=website`, `og:image` (URL **absolut**; **TODO:** isi setelah domain Vercel pasti), `og:locale=id_ID`.
- `<meta name="theme-color" content="#7CB342">`
- `<meta name="robots" content="noindex, nofollow">` (halaman pribadi, jangan muncul di mesin pencari) dan `public/robots.txt` dengan `Disallow: /`.
- `<link rel="manifest" href="/manifest.webmanifest">`, `<link rel="icon" ...>`
- Preload font utama (Fredoka 600 dan Nunito 500).

**`manifest.webmanifest`:**
- `name` dan `short_name` (bisa disingkat), `display: standalone`, `orientation: portrait`, `theme_color`, `background_color`, `start_url: "/"`, ikon 192, 512, dan maskable 512.
- **Tanpa service worker** (tidak menambah dependency). PWA hanya memungkinkan "Tambah ke layar utama".

**Privasi:** tanpa analytics, tanpa cookie, tanpa skrip atau font pihak ketiga, tanpa permintaan jaringan ke domain lain. Penutup tidak memiliki tautan keluar.

## 17. Deploy ke Vercel dan QR code

- Preset framework **Vite**. Build `npm run build`, output `dist`. Tidak perlu *rewrite* (satu halaman).
- `vercel.json` opsional untuk cache: `/assets/*` dan `/fonts/*` memakai `Cache-Control: public, max-age=31536000, immutable`.
- Setelah deploy: perbarui URL absolut `og:image`, cek pratinjau link, lalu buat QR.
- **QR code:** buat dari URL produksi (nama subdomain yang singkat dan lucu lebih mudah). Tingkat koreksi galat minimal **M**, ukuran cetak minimal sekitar 3 x 3 cm, kontras tinggi (gelap di atas terang), dan **uji pindai** dengan HP Android sungguhan sebelum dicetak.
- Uji syarat kemenangan tiga game untuk tombol animasi bunga dan replay S2 pada versi produksi.

## 18. Daftar periksa arsitektur

- [ ] Tidak ada dependency runtime di luar daftar
- [ ] Hanya `catName` dan `muted` yang disimpan di `localStorage`, dengan `try/catch` dan validasi
- [ ] `ScrollDirector` satu-satunya pengelola latar, section aktif, dan auto-scroll
- [ ] Kunci scroll berbasis alasan dan selalu dilepas saat *unmount*
- [ ] Animasi latar dan parallax tidak memicu render ulang React per frame
- [ ] `ScrollTrigger.config({ ignoreMobileResize: true })` aktif; `refresh` setelah font siap
- [ ] Mode hemat animasi aktif otomatis dan berfungsi penuh
- [ ] `ErrorBoundary` per section; halaman tetap bisa digulir saat ada error
- [ ] Overlay landscape berfungsi dan mengunci scroll sementara
- [ ] Preloader: konten di belakang `inert`, audio aktif setelah ketukan pertama
- [ ] Meta `noindex`, Open Graph (URL absolut), manifest, dan ikon lengkap
- [ ] Tanpa permintaan jaringan ke domain pihak ketiga
- [ ] `typecheck`, `lint`, dan `build` lolos; ukuran JS awal sesuai anggaran
- [ ] Diuji di HP Android sungguhan (versi lokal dan versi produksi di Vercel)
