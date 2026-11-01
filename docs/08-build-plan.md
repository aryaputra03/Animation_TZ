# 08 - Rencana Pengerjaan

Urutan kerja bertahap, lengkap dengan checklist, kriteria selesai, cara uji, dan contoh perintah untuk Codex. **Kerjakan satu tahap sekali. Jangan lanjut sebelum tahap sebelumnya memenuhi kriteria selesai dan lolos uji di HP Android sungguhan.**

Dokumen rujukan: `AGENTS.md`, `01-brief.md` sampai `07-tech-architecture.md`.

## 0. Keputusan teknis yang dikunci

Agar tidak ada ambiguitas saat membangun:

1. **Layar pembuka (S1) diimplementasikan sebagai overlay `Preloader`**, bukan section yang digulir. Section yang digulir dimulai dari **S2 (Hero)** sampai **S11 (Penutup)**. Hapus `S01_Intro` dari registry di `07-tech-architecture.md` bagian 6, dan jangan membuat dua layar pembuka.
2. **Satu halaman, tanpa router.**
3. **Teks hanya di `src/content/`**; pesan penutup, salam perpisahan hewan, dan teks serta kode soal Special Gift ada di `closing.ts`.
4. Pesan penutup memakai teks yang diberikan pemilik proyek. Tombol Special Gift membuka popup programming, bukan tautan eksternal.
5. Gunakan `<meta name="color-scheme" content="light">` dan `color-scheme: light` di CSS (supaya mode gelap paksa Chrome Android tidak membalik warna).
6. **Arah visual final:** palet hijau dengan latar empat pemandangan (lihat blok pembaruan di `02-design-system.md`).
7. **Status:** Tahap 1 sampai 3 dan implementasi Tahap 4a sampai 4c sudah dikerjakan. Seluruh minigame menunggu uji di Chrome Android.

## 1. Aturan kerja per tahap

Untuk **setiap** tahap:

1. Baca ulang `AGENTS.md` dan dokumen yang relevan.
2. Tulis **rencana singkat** (file yang akan dibuat atau diubah) sebelum menulis kode.
3. Kerjakan dengan komit kecil, satu cabang per tahap (contoh `stage-1-foundation`).
4. Jalankan `npm run typecheck`, `npm run lint`, `npm run build`.
5. Uji di **HP Android sungguhan** (lihat bagian 9).
6. Laporkan: apa yang selesai, apa yang belum, dan risiko yang ditemukan.
7. **Jangan menambah fitur di luar dokumen.** Usulkan dulu, jangan langsung kerjakan.
8. Gabung ke cabang utama hanya setelah semua kriteria selesai terpenuhi. Gunakan **Vercel Preview** per cabang untuk uji di HP.

Ukuran usaha (relatif): **S** kecil, **M** sedang, **L** besar.

---

## Tahap 1: Fondasi dan kerangka (L)

**Tujuan:** proyek berjalan end-to-end sebagai kerangka kosong yang halus: ketuk mulai, scroll, latar berubah, mute, dan penjaga orientasi.

**Pekerjaan:**
- [ ] Inisialisasi Vite + React + TypeScript, pasang Tailwind, GSAP, Framer Motion, Zustand
- [ ] `tsconfig` strict, alias `@/`, ESLint, skrip `npm` sesuai `07` bagian 15
- [ ] Token desain dari `02` (warna, radius, bayangan, tipografi) di `tokens.css` dan konfigurasi Tailwind
- [ ] Font **self-host** (Fredoka dan Nunito, `woff2`, subset Latin) di `public/fonts/`, `font-display: swap`
- [ ] `index.html`: meta lengkap (`lang="id"`, viewport, `color-scheme`, `theme-color`, `noindex`, judul, deskripsi, Open Graph dengan `TODO` URL absolut), `manifest.webmanifest`, ikon sementara
- [ ] `storage.ts` (hanya `catName` dan `muted`), `useAppStore`
- [ ] `scrollLock.ts` berbasis alasan
- [ ] `Preloader`: kolom nama kucing (opsional, bawaan Oyen), tombol "Ketuk untuk mulai 🐾", konten di belakang `inert`
- [ ] `SoundManager` **kerangka**: `unlock()`, `setMuted`, `suspend/resume`, satu suara uji (`ui.start`), batas suara bersamaan
- [ ] `MuteButton` (pojok kanan atas, `aria-pressed`, tersimpan)
- [ ] `PortraitGuard` (overlay landscape, kunci scroll alasan `landscape`)
- [ ] `performance.ts`: deteksi `perfMode` (termasuk `prefers-reduced-motion` dan pengukur FPS)
- [ ] `core/gsap.ts`: registrasi `ScrollTrigger`, `ignoreMobileResize: true`
- [ ] `ScrollDirector` + `SkyBackground`: latar berubah pagi → malam sesuai `02` bagian 3 (belum ada bintang detail)
- [ ] `PawProgress` (jejak kaki progres di tepi layar, tanpa scrollbar native halaman)
- [ ] Section **placeholder** S2 sampai S11 (tinggi `100dvh`, judul sementara dari `content/sections.ts`) dibungkus `ErrorBoundary`

**Kriteria selesai:**
- Layar pembuka muncul, scroll terkunci sampai ketukan pertama, lalu halaman bisa digulir
- Suara uji bunyi **hanya** setelah ketukan pertama; mute berfungsi dan tersimpan setelah muat ulang
- Latar berubah halus dari hijau terang ke gelap sepanjang scroll, teks tetap terbaca
- Landscape menampilkan overlay dan mengunci scroll; kembali portrait membukanya
- Tidak ada scroll ke samping di lebar 360px; tidak ada error di console
- `typecheck`, `lint`, `build` lolos; tidak ada permintaan jaringan ke domain luar

**Cara uji:** buka via jaringan lokal di Chrome Android, ketuk mulai, scroll pelan dan cepat, putar layar, tekan mute, muat ulang, aktifkan hemat daya.

**Contoh perintah Codex:**
> Baca `AGENTS.md` dan semua file di `docs/`. Kerjakan **Tahap 1** di `docs/08-build-plan.md`. Tulis rencana file dulu, lalu implementasikan. Hentikan setelah kriteria selesai Tahap 1 terpenuhi dan laporkan hasil `typecheck`, `lint`, dan `build`.

---

## Tahap 2: Kucing oren, balon chat, dan suara kucing (L)

**Tujuan:** karakter utama hidup, bisa diajak interaksi, dan bersuara.

**Pekerjaan:**
- [ ] Sistem karakter dasar: `Character.types.ts`, `useCharacter` (ekspresi, kedip, debounce), bagian bersama (`Eyes`, `Cheeks`, `Heart`, `Zzz`)
- [ ] `Cat.tsx` (besar), varian apron dan topi barista, `CatMini.tsx` (pendamping)
- [ ] Lima ekspresi + `purr` dan `lebay`
- [ ] Hook `useLongPress`, `useMultiTap`, `useIdle`, `useInView`, `useReducedMotion`
- [ ] `BubbleManager` + `SpeechBubble` + `content/bubbles.ts` untuk S2 sampai S4 (sesuai `03`)
- [ ] **S2 Hero:** cangkir kopi + kucing mengintip, uap, daun parallax ringan, ketuk, elus, mode lebay
- [ ] **S3 Barista:** apron, mesin kopi, latte art hati saat ketuk cangkir, easter egg kopi tumpah (tekan lama)
- [ ] Sintesis suara kucing: `cat.meow`, `meowHappy`, `meowLebay`, `purr` (loop), `yawn`, plus `ui.pop`, `ui.ting`, `heart.pop`, `cup.spill`
- [ ] `haptics.ts` dan getar untuk ketuk dan elus
- [ ] Kucing tidur saat diam ±12 detik, bangun saat diketuk
- [ ] Kucing mini + balon dari S5 ke bawah (tampil di section placeholder)

**Kriteria selesai:**
- Ketuk kucing: memantul, meow, balon acak tanpa pengulangan berturut-turut
- Tekan-tahan: mendengkur, getar halus, berhenti tepat saat jari dilepas; **dengkuran terdengar di speaker HP**
- Ketuk 5 kali cepat memicu mode lebay lalu kembali normal
- Hanya satu balon pada satu waktu, jeda minimal ±2,5 detik
- Tidak ada dua kucing sekaligus di layar
- Nama kucing buatan Abil muncul di semua balon (`{catName}`); kosong menjadi **Oyen**
- Gerak berhenti saat kucing di luar layar; mode hemat animasi tetap menarik

**Cara uji:** ketuk beruntun cepat, tekan lama lalu lepas, diamkan 15 detik, ganti nama kucing di layar pembuka, mute lalu unmute di tengah dengkuran.

**Contoh perintah Codex:**
> Kerjakan **Tahap 2**. Fokus pada kucing oren, balon chat, dan suara kucing sesuai `04-characters.md`, `03-sections-and-copy.md` (S2 dan S3), dan `06-sound-design.md`. Jangan mengerjakan hewan lain atau game.

---

## Tahap 3: Hewan lainnya (L)

**Tujuan:** hamster, kelinci, rubah, dan red panda lengkap dengan adegan dan suaranya.

**Pekerjaan:**
- [ ] `Hamster.tsx` + roda lari (kecepatan mengikuti scroll, dengan batas maksimum) → **S5**
- [ ] `Rabbit.tsx` (kakak dan dua adik, syal hijau, interaksi saling peluk) → **S7**
- [ ] `Fox.tsx` + semak (ekor selalu terlihat, ketuk untuk melompat keluar) → **S8**
- [ ] `RedPanda.tsx` + bambu (mengantuk, ketuk untuk bangun, kembali tidur saat diam ±8 detik) → **S9**
- [ ] Suara: `hamster.squeak`, `rabbit.chirp`, `fox.yip`, `redpanda.twitter`, `redpanda.yawn`
- [ ] Balon chat untuk S5, S7, S8, S9 sesuai `03`
- [ ] Dekorasi tiap adegan (kupu-kupu, semak, bambu, awan) dengan jumlah elemen terbatas
- [ ] Pemeriksaan gaya: kelima hewan seragam (outline, mata, pipi)

**Kriteria selesai:**
- Setiap hewan punya gerak idle, reaksi ketuk berbeda, dan satu suara khas
- Roda hamster mengikuti scroll tanpa terlihat berlebihan
- Ekor rubah selalu terlihat saat bersembunyi
- Semua karakter adalah `<button>` dengan `aria-label` dan area sentuh minimal 48px
- Jumlah node SVG per karakter terjaga (di bawah ±60); animasi mulus di Android kelas menengah
- Tidak ada reptil atau hewan yang menjijikkan

**Cara uji:** scroll dari S2 sampai S9 dengan kecepatan berbeda, ketuk tiap hewan beruntun, periksa FPS di mode normal dan hemat.

**Contoh perintah Codex:**
> Kerjakan **Tahap 3**. Buat hamster, kelinci, rubah, dan red panda dengan gaya yang sama persis dengan kucing. Baca `04-characters.md` bagian 3 sampai 6. Jangan menyentuh game.

---

## Tahap 4: Tiga minigame (L)

**Tujuan:** tiga game yang mudah dan nyaman di HP. Pengguna boleh menunda dengan scroll, tetapi harus memenangkan semuanya untuk membuka ruang rahasia S11. **Kerjakan satu per satu (4a, 4b, 4c) dan uji di HP setiap selesai.**

**Pekerjaan umum (4a, kerjakan pertama):**
- [ ] `GameShell` + `useGameShell` (state `intro/playing/success`, kunci scroll, batas waktu lunak, jeda saat tab tersembunyi atau di luar layar)
- [ ] `config.ts` untuk semua angka penyetel
- [ ] Animasi menang (maksimal ±12 partikel), tombol Main Lagi saat menang; tiap game menampilkan sticker kemenangan yang ditentukan
- [ ] Status game disimpan di memori sesi (Zustand), bukan `localStorage`

**4a. Game 1: tangkap biji kopi (S4)**
- [ ] Canvas 2D dengan `requestAnimationFrame` dan delta time, DPR maksimal 2
- [ ] Keranjang mengikuti gerakan jari di mana saja (dengan pelunakan), alternatif ketuk satu sisi
- [ ] 10 biji, jatuh pelan, magnet bantuan, cangkir terisi sebagai indikator (tanpa angka)
- [ ] Suara `game.beanCatch` (nada naik), `game.cupFull`; kucing bereaksi

**4b. Game 2: ketuk hamster (S6)**
- [ ] 9 lubang (3 x 3), satu hamster aktif, bertahan 1,8 sampai 2,4 detik, 8 sapaan sampai selesai
- [ ] Area sentuh minimal 96px, indikator hati terisi, tanpa hukuman bila terlewat
- [ ] Saat menang, tampil sticker hamster benjol dengan ekspresi kesakitan lucu dan teks komedi di atasnya
- [ ] Penjadwal dibersihkan saat game berhenti atau dijeda

**4c. Game 3: cocokkan kartu (S10)**
- [x] 6 kartu (3 pasang) dari 3 hewan acak, intip awal 1,5 detik, flip 3D
- [x] Kunci input saat dua kartu dievaluasi, tanpa hitungan salah
- [x] Suara khas hewan saat kartu dibuka, `game.match`, `game.wrong` (boing lembut)
- [x] Soft cap membuka kartu dan menyelesaikan game dengan senang
- [x] Saat menang, tampil sticker red panda jenius yang fokus mengingat kartu dengan teks komedi di atasnya
- [x] Logika dipisah di `useCardMatch`

**Kriteria selesai:**
- Intro game bisa dilewati dengan scroll dan pemain dapat kembali kapan saja; game yang dimulai **tidak bisa kalah**
- Game selesai dalam 30 sampai 60 detik; batas waktu lunak menyelesaikan dengan senang
- Scroll terkunci hanya saat `playing`; selalu terbuka lagi setelah menang
- Ruang rahasia S11 terkunci sampai ketiga game dimenangkan
- Tidak ada skor, poin, atau level; sticker kemenangan hanya muncul setelah menang di game terkait
- Tidak ada kebocoran `setTimeout`, listener, atau loop yang berjalan di luar layar
- Satu jari cukup, tanpa konflik dengan scroll vertikal sebelum Mulai

**Cara uji:** scroll melewati intro dan kembali untuk bermain, mainkan tiap game sampai selesai, biarkan sampai batas waktu lunak, pastikan S11 terkunci sebelum tiga kemenangan dan terbuka sesudahnya, scroll setelah selesai, pindah tab saat bermain, hemat daya aktif.

**Contoh perintah Codex:**
> Kerjakan **Tahap 4a** saja: `GameShell` dan Game 1 (tangkap biji kopi) sesuai `05-minigames.md`. Setelah selesai dan lolos, berhenti. Aku akan uji di HP sebelum lanjut ke 4b.

---

## Tahap 5: Penutup dan polesan (M)

**Tujuan:** akhir yang hangat, easter egg, dan finishing.

**Pekerjaan:**
- [ ] **S11 Penutup:** malam berbintang, bulan sabit, kunang-kunang, semua hewan berkumpul
- [ ] Bintang dan bulan muncul setelah ±80% scroll
- [ ] Tombol **"Special Gift (Ruang Rahasia)"** membuka popup soal JavaScript dengan syntax highlighting di panel gelap, tombol salin, kolom jawaban `0001`, petunjuk jawaban hex, dan sticker primata fokus
- [ ] Pesan penutup menampilkan teks dari pemilik proyek di `closing.ts`
- [ ] Semua hewan di penutup bisa diketuk untuk mengucapkan salam perpisahan dan terima kasih
- [ ] Easter egg bulan: `closing.choir` (semua hewan "bernyanyi" ±3 detik)
- [ ] Balon chat penutup dan teks sistem lengkap (idle, mute, landscape)
- [ ] Ikon aplikasi asli (favicon, 192, 512, maskable) dan gambar Open Graph 1200 x 630
- [ ] Pengaturan akhir mode hemat animasi, pause di luar layar, dan pembatasan partikel
- [ ] Audit aksesibilitas dasar (label, kontras, fokus, `aria-live`)
- [ ] Penyetelan angka game di `config.ts` berdasarkan uji di HP

**Kriteria selesai:**
- Popup Special Gift terbuka, kode dapat disalin dengan pulse dan label sukses, jawaban `0001` memulai pertumbuhan batang langsung menjadi taman malam dengan lima bunga jingga dan banyak kelopak yang tertiup angin mendatar dari kiri ke kanan; setelah 10 detik tombol X membawa ke halaman awal tanpa mereset progres game, dan tombol replay di S2 membuka ulang animasi, jawaban hex dan frasa password memberi respons khusus; tidak ada navigasi eksternal
- Bulan diketuk → paduan suara berjalan tanpa pecah atau menumpuk; di-mute tetap menampilkan animasi tanpa suara
- Seluruh alur dari awal sampai akhir sekitar 3 sampai 5 menit
- Tidak ada pelanggaran daftar larangan di `AGENTS.md` bagian 9

**Contoh perintah Codex:**
> Kerjakan **Tahap 5**. Buat S11 sesuai `03-sections-and-copy.md` dan `06-sound-design.md` bagian 5. Gunakan teks penutup yang diberikan pemilik proyek.

---

## Tahap 6: Uji menyeluruh, deploy, dan QR (M)

**Tujuan:** siap diberikan.

**Pekerjaan:**
- [ ] Uji menyeluruh sesuai matriks (bagian 9)
- [ ] Lighthouse mobile (performa, aksesibilitas, praktik terbaik), perbaiki temuan penting
- [ ] Cek ukuran build (JS awal gzip sekitar di bawah 250 KB) dan hapus kode tak terpakai
- [ ] Deploy ke Vercel (preset Vite), tambahkan `vercel.json` cache bila perlu
- [ ] Perbarui URL absolut `og:image`, cek pratinjau link saat dibagikan
- [ ] Pilih nama subdomain yang singkat dan lucu (opsional)
- [ ] Buat QR code dari URL produksi (koreksi galat minimal M, ukuran cetak minimal ±3 x 3 cm, kontras tinggi)
- [ ] **Uji pindai QR dengan HP Android** sebelum dicetak
- [ ] Pastikan pesan penutup dan salam perpisahan tampil di S11
- [ ] Uji pewarnaan dan format kode, pulse tombol salin, submit jawaban `0001` hingga batang langsung tumbuh dan taman malam mekar; pastikan X kembali ke halaman awal setelah minimal 10 detik tanpa menghapus progres game, lalu tombol replay S2 membuka animasi lagi; cek komposisi di beberapa ukuran portrait agar tidak terpotong, uji jawaban hex dan frasa password, serta pastikan tidak ada navigasi eksternal
- [ ] Cek privasi: tanpa analytics, cookie, skrip, atau font pihak ketiga; hanya `catName` dan `muted` di `localStorage`

**Kriteria selesai:** seluruh daftar periksa rilis (bagian 10) tercentang.

---

## 9. Matriks pengujian di HP Android

Uji tiap tahap di Chrome Android; uji penuh di Tahap 6.

| Aspek | Yang diuji |
|---|---|
| Perangkat | Minimal 1 HP Android kelas menengah; bila ada, 1 yang lebih lawas |
| Layar | Lebar 360 dan 412 px; poni atau lubang kamera (safe area) |
| Orientasi | Portrait normal, putar ke landscape dan kembali |
| Penghemat daya | Mode hemat baterai aktif |
| Ukuran teks sistem | Normal dan **besar** (setelan aksesibilitas Android) |
| Suara | Volume media rendah, sedang, penuh; speaker dan headphone |
| Sentuhan | Ketuk cepat beruntun, tekan lama, geser; jari basah atau kasar (bila relevan) |
| Jaringan | Wi-Fi dan 4G lambat (throttling) |
| Siklus | Pindah aplikasi lalu kembali; kunci layar lalu buka; muat ulang halaman |
| Browser | Chrome utama; cek singkat di browser bawaan Samsung bila ada |

Alat bantu: `npm run dev` (jaringan lokal), `chrome://inspect` untuk debug lewat USB, Vercel Preview.

## 10. Daftar periksa rilis

**Konten**
- [ ] Semua teks memakai sapaan "Kak Abil"; tidak ada "Ida"
- [ ] Tidak ada nama pengirim di mana pun (halaman, meta, komentar yang tampil)
- [ ] Pesan penutup sudah diisi pemilik proyek (bukan `TODO`)
- [ ] Tidak ada teks yang menekan atau menuntut balasan
- [ ] Judul tab: "Buka disaat jam istirahat saja atau pulang kerja ya 🐾"; deskripsi: "Scroll pelan-pelan ya"

**Fungsi**
- [ ] Popup Special Gift menerima jawaban `0001` tanpa membuka situs eksternal
- [ ] Nama kucing: ketikan Abil dipakai; kosong menjadi **Oyen**
- [ ] Tiga game bisa dimainkan kapan saja; S11 hanya terbuka setelah ketiganya dimenangkan
- [ ] Easter egg berfungsi (lebay, kopi tumpah, paduan suara bulan)
- [ ] Mute berfungsi dan tersimpan; tidak ada suara sebelum ketukan pertama
- [ ] Landscape menampilkan pesan lucu

**Kualitas**
- [ ] `typecheck`, `lint`, `build` lolos; tidak ada error di console
- [ ] Mulus di Android kelas menengah; mode hemat animasi berfungsi
- [ ] Tidak ada scroll ke samping; tidak ada konten tertutup poni atau bilah navigasi
- [ ] Kontras teks terbaca di semua tahap latar
- [ ] Durasi total sekitar 3 sampai 5 menit

**Privasi dan rilis**
- [ ] `noindex` dan `robots.txt` aktif
- [ ] Tanpa analytics, cookie, atau permintaan ke domain pihak ketiga
- [ ] `og:image` memakai URL absolut dan pratinjau link benar
- [ ] QR sudah dipindai dan terbukti membuka halaman

## 11. Risiko dan cara menanganinya

| Risiko | Penanganan |
|---|---|
| Animasi patah-patah di HP kelas menengah | Mode hemat animasi otomatis, kurangi partikel dan parallax, kurangi node SVG |
| Scroll terkunci selamanya akibat bug game | Kunci berbasis alasan, `unlock` pada *unmount*, batas waktu lunak |
| Suara tidak keluar di Android | Pastikan `AudioContext` dibuat di handler ketukan, `resume()` bila `suspended`, uji speaker HP |
| Dengkuran tak terdengar di speaker | Pastikan harmonik 250 sampai 500 Hz (lihat `06`) |
| Konflik geser game dengan scroll | `touch-action: none` hanya di area game saat `playing` |
| Bilah alamat Chrome mengubah tinggi layar | `dvh`, `ignoreMobileResize`, refresh terkontrol |
| Terlalu panjang atau membosankan | Pangkas section yang tidak perlu, perpendek durasi game |
| Bug sulit dilacak di proyek besar | Tahap kecil, komit kecil, satu cabang per tahap, Preview Vercel |

## 12. Urutan pemangkasan jika perlu mengurangi beban

Jika performa atau jadwal bermasalah, **pangkas dari atas ke bawah** sampai cukup:

1. Parallax dekoratif dan kupu-kupu atau kunang-kunang
2. Mode lebay kucing
3. Paduan suara penutup (cukup satu suara)
4. Dengkuran loop (cukup meow)
5. Animasi menang yang rumit (cukup teks dan hati sederhana)
6. Kucing tidur saat diam

**Jangan dipangkas:** layar pembuka dan aktivasi suara, tombol mute, kunci ruang rahasia, tombol Special Gift, mode hemat animasi, penjaga landscape.

## 13. Hal yang harus diisi atau diputuskan pemilik proyek

- [ ] URL produksi dan nama subdomain; lalu URL absolut `og:image`
- [ ] Persetujuan untuk Vitest (opsional) bila ingin uji otomatis logika
