# AGENTS.md

Aturan kerja untuk Codex di proyek ini. **Baca file ini lebih dulu, lalu baca hanya file `docs/` yang relevan untuk tahap yang sedang dikerjakan (lihat bagian 2).** Proyek ini dikerjakan **bertahap**, bukan sekaligus.

## 1. Ringkasan proyek

Landing page satu halaman yang lucu dan beranimasi, dibuat sebagai kejutan untuk seorang barista bernama **Abil** (seorang kakak yang suka warna hijau dan hal-hal lucu). Semakin halaman di-scroll, semakin banyak hewan kartun bulat dan imut (gaya stiker) yang muncul dan bisa diajak berinteraksi, diselingi **3 minigame** yang mudah. Karakter utama adalah **kucing oren** yang menemani sepanjang halaman lewat balon chat.

- Tujuan: lucu-lucuan, nada campuran dan dominan receh.
- Pengguna akhir hanya satu orang, memakai **HP Android** (Chrome), mengakses lewat **QR code**.
- Di-deploy sebagai situs statis di **Vercel**.
- Target durasi dari pembuka sampai penutup: sekitar **3 sampai 5 menit**.

## 2. File konteks yang wajib dibaca

Urutan baca:

1. `docs/01-brief.md` : tujuan, fitur final, daftar yang dihapus
2. `docs/02-design-system.md` : warna, font, gaya karakter, aturan animasi
3. `docs/03-sections-and-copy.md` : urutan section dan seluruh teks
4. `docs/04-characters.md` : spesifikasi tiap hewan
5. `docs/05-minigames.md` : aturan 3 minigame
6. `docs/06-sound-design.md` : desain suara (Web Audio API)
7. `docs/07-tech-architecture.md` : struktur kode dan komponen
8. `docs/08-build-plan.md` : tahap pengerjaan dan kriteria selesai

Jika ada konflik antar file, urutan prioritasnya: `AGENTS.md` > `01-brief.md` > file lainnya. Jika masih ambigu, **tanyakan, jangan menebak**.

**Dokumen yang dibaca per tahap** (selalu baca `AGENTS.md`; tahapnya ada di `docs/08-build-plan.md`):

| Tahap | Dokumen yang dibaca |
|---|---|
| 1. Fondasi dan kerangka | `01`, `02`, `07`, `08` (bagian Tahap 1), dan `06` (hanya bagian SoundManager) |
| 2. Kucing oren dan balon chat | `03` (S2 dan S3), `04` (bagian umum dan kucing), `06`, `08` (Tahap 2) |
| 3. Hewan lainnya | `03` (S5, S7, S8, S9), `04` (bagian hewan terkait), `06` (suara hewan terkait), `08` (Tahap 3) |
| 4. Tiga minigame | `05`, `03` (section game), `04` (bagian game), `06` (suara game), `08` (Tahap 4) |
| 5. Penutup dan polesan | `03` (S11), `06` (bagian 5), `02`, `08` (Tahap 5) |
| 6. Uji, deploy, dan QR | `07` (bagian 16 dan 17), `08` (Tahap 6 dan daftar periksa rilis) |

Jangan membaca ulang dokumen yang tidak relevan untuk tahap saat ini.

## 3. Stack (tetap, jangan diganti)

| Kebutuhan | Pilihan |
|---|---|
| Build | Vite |
| UI | React + TypeScript (mode `strict`) |
| Styling | Tailwind CSS |
| Animasi scroll | GSAP + ScrollTrigger |
| Animasi komponen | Framer Motion |
| State global | Zustand |
| Suara | Web Audio API buatan sendiri (tanpa file audio) |
| Game | Canvas 2D atau DOM sederhana (tanpa game engine) |
| Package manager | **npm** |

Jangan menambah dependency **runtime** di luar tabel ini tanpa meminta persetujuan lebih dulu (termasuk `@gsap/react`, library ikon, library audio, `vite-plugin-pwa`, dan Lenis).

**Alat pengembangan (`devDependencies`)** seperti ESLint, `typescript-eslint`, Prettier, serta plugin Vite dan Tailwind **diperbolehkan** tanpa meminta persetujuan.

## 4. Aturan konten (WAJIB dipatuhi)

- **Arah visual:** palet hijau (matcha, sage, krem, kopi), font Baloo 2, kucing oren bermata besar tanpa outline, latar berupa empat pemandangan yang berganti sepanjang scroll (padang rumput, hutan, bukit sore, malam). Lihat blok "Pembaruan arah visual" di `docs/02-design-system.md`. Jangan mengubah gaya ini.
- **Sapaan:** kucing menyapa pengguna dengan **"Kak Abil"**.
- **Nama kucing:** Abil mengetik sendiri nama kucing di layar pembuka. Kalau dilewati, nama bawaannya **"Oyen"**. Nama ini dipakai di semua balon chat dan di penutup.
- **Pengirim tidak disebut.** Jangan menaruh nama pengirim di mana pun di halaman, metadata, atau komentar kode yang tampil ke pengguna.
- **Layar pembuka tanpa nama penerima.** Jangan menulis "Untuk Abil" di sana.
- **Layar pembuka (S1) adalah overlay `Preloader`**, bukan section yang digulir. Section yang digulir dimulai dari S2 (Hero) sampai S11 (Penutup). Jangan membuat dua layar pembuka.
- **Hewan yang dipakai:** kucing oren, hamster, kelinci, rubah, red panda. **Tanpa primata, reptil, serangga, atau hewan yang menjijikkan.**
- **Game wajib dimenangkan untuk membuka ruang rahasia S11.** Jangan sediakan tombol Lewati di game. Pengguna boleh menggulir melewati intro game dan bermain kapan saja; jika game dimulai, soft cap menyelesaikannya dengan sukses. S11 tetap terkunci sampai ketiga game berstatus sukses.
- **Tanpa skor, poin, atau level.** Saat menang di game biji kopi, tampilkan sticker cappuccino lucu dengan teks **"Abil dapat Capucino"**. Saat menang di game hamster, tampilkan sticker hamster benjol dengan palu kartun, ekspresi kesakitan lucu, dan teks **"Sakit Kak Abil, kamu harus tanggung jawab, aku gak ada asuransi soalnya."** Saat menang di game kartu, tampilkan sticker red panda jenius yang mengingat kartu dengan teks **"Wahh Kak Abil, memory-nya kuat ya! Iyalah, kan dia ingat aku semenjak di Arten, hahaha."** Jangan menambah hadiah game lain.
- **Tanpa musik latar.** Suara hanya muncul sebagai reaksi saat pengguna mengetuk atau berinteraksi.
- **Tanpa pelacakan:** tanpa analytics, cookie, atau skrip pihak ketiga.
- **Pesan penutup:** `Terimakasih bil sudah eksplorasi di Website Landing Page yang masih banyak kurangnya ini.`
- **Bahasa teks di halaman:** Indonesia, santai, dominan receh.
- **Penutup S11:** setiap karakter bisa diketuk untuk menampilkan balon salam perpisahan tepat di atas karakter dan berterima kasih karena sudah diajak bermain. Setelah ketiga game dimenangkan, tampilkan tombol **"Lihat animasi bunga"** di bagian akhir. Tombol langsung membuka animasi taman bunga; tidak ada kuis, popup soal, atau tautan eksternal. Tombol X kembali ke halaman awal tanpa reload dan tanpa menghapus progres game. Tombol replay di S2 juga hanya tersedia setelah ketiga game dimenangkan.
- **Judul tab dan pratinjau link:**
  - Judul: `Buka disaat jam istirahat saja atau pulang kerja ya 🐾`
  - Deskripsi: `Scroll pelan-pelan ya`

## 5. Aturan teknis

**Perangkat dan layout**
- Prioritaskan **HP Android** dan layout **mobile-first**. Desktop hanya perlu tidak rusak.
- Kunci tampilan ke **portrait**. Jika layar diputar ke landscape, tampilkan pesan lucu yang menyuruh memutar kembali.
- Target sentuh minimal **48 x 48 px**. Hormati `safe-area-inset-*` dan gunakan `100dvh`, bukan `100vh`.
- Semua game harus bisa dimainkan dengan **satu jari** (ketuk atau geser).
- Halaman tidak boleh bergulir ke samping.

**Performa**
- Jaga gerakan tetap mulus di Android kelas menengah. Animasikan hanya `transform` dan `opacity`.
- Sediakan **mode hemat animasi**: aktif otomatis saat `prefers-reduced-motion` atau perangkat lemah, yaitu mengurangi partikel dan efek parallax.
- Hentikan animasi dan game yang tidak terlihat di layar.
- Tanpa aset gambar raster besar. Karakter dibuat sebagai **SVG** dengan gaya seragam.
- Total ukuran build usahakan ringan (tidak ada file audio, tidak ada font berat).

**Suara**
- Semua suara dibuat dengan Web Audio API lewat satu `SoundManager`.
- `AudioContext` baru dibuat atau di-resume setelah **ketukan pertama** di layar pembuka (kebijakan autoplay Android).
- Selalu sediakan **tombol mute** di pojok kanan atas. Pilihan mute disimpan.
- Jangan ada suara yang keras atau mengagetkan. Beri batas volume.

**Penyimpanan**
- Hanya `localStorage`, dengan kunci terbatas: `catName` dan `muted`. Jangan menyimpan data lain.

**Kualitas kode**
- TypeScript `strict`, tanpa `any` kecuali sangat terpaksa (beri komentar alasannya).
- Komponen kecil dan fokus pada satu tugas. Pisahkan logika game dari tampilan.
- Nama kode (variabel, fungsi, komponen, file) memakai bahasa **Inggris**. Teks yang tampil di halaman memakai bahasa **Indonesia**.
- Kumpulkan seluruh teks tampilan di satu tempat (misalnya `src/content/`), jangan menyebarkannya di dalam komponen.
- Setiap interaksi wajib punya fallback jika Vibration API atau audio tidak tersedia, dan tidak boleh melempar error.
- Jangan membuat elemen yang hanya bisa dioperasikan dengan hover.

## 6. Perintah penting

```bash
npm install        # pasang dependency
npm run dev        # jalankan dev server (uji di HP lewat jaringan lokal)
npm run build      # build produksi
npm run preview    # pratinjau hasil build
npm run lint       # cek lint
npm run typecheck  # cek tipe (tsc --noEmit)
```

Jika skrip di atas belum ada di `package.json`, tambahkan.

## 7. Cara kerja

- Kerjakan **satu tahap per sesi** sesuai `docs/08-build-plan.md`. **Berhenti setelah tahap yang diminta selesai.** Jangan melompat atau "sekalian" mengerjakan tahap berikutnya, dan jangan mengerjakan bagian yang tidak diminta.
- Tahap 4 dipecah menjadi 4a (GameShell dan game 1), 4b (game 2), dan 4c (game 3). Kerjakan **satu sub-tahap per sesi**.

**Hemat token (wajib):**
- Baca hanya dokumen yang relevan untuk tahap saat ini (lihat bagian 2).
- Jangan menampilkan seluruh isi file di jawaban. Cukup ringkas apa yang diubah dan sebutkan nama file.
- Jangan membaca ulang file yang tidak berubah. Jangan mencetak keluaran panjang dari `npm install`, `build`, atau `lint`; cukup laporkan hasil lolos atau gagal dan pesan error yang relevan.
- Jangan menulis ulang file besar untuk perubahan kecil; ubah bagian yang perlu saja.
- Jangan membuat dokumentasi, README panjang, atau file tambahan yang tidak diminta.
- Laporan akhir tiap tahap singkat: **(1) apa yang selesai, (2) hasil `typecheck`/`lint`/`build`, (3) hal yang belum atau perlu diuji di HP, (4) pertanyaan bila ada.**
- Sebelum menulis kode di satu tahap, tulis rencana singkat berisi file apa yang akan dibuat atau diubah.
- Jangan menambah fitur di luar yang tertulis di dokumen. Jika punya ide, **sarankan dulu, jangan langsung kerjakan**.
- Setelah tiap tahap, jalankan `npm run typecheck`, `npm run lint`, dan `npm run build`, lalu laporkan hasilnya.
- Jika keputusan berubah, perbarui file `.md` yang relevan.

## 8. Definisi "selesai" (berlaku untuk setiap tahap)

- [ ] `typecheck`, `lint`, dan `build` lolos tanpa error
- [ ] Tidak ada error di console pada Chrome Android
- [ ] Semua interaksi bekerja dengan sentuhan, bukan hanya mouse
- [ ] Animasi tetap mulus; mode hemat animasi berfungsi
- [ ] Suara tidak berbunyi sebelum ketukan pertama; tombol mute berfungsi
- [ ] Tidak ada hal yang melanggar bagian 4 (aturan konten)

## 9. Dilarang keras

- Menambah analytics, cookie, atau skrip pihak ketiga
- Menambah skor, poin, atau level
- Menambah hadiah game selain sticker cappuccino, hamster, dan red panda yang ditentukan untuk kemenangan masing-masing game
- Menambah tombol Lewati pada game atau membuka ruang rahasia sebelum ketiga game dimenangkan
- Menambah musik latar
- Menaruh nama pengirim di halaman
- Memakai hewan reptil atau yang menjijikkan
- Mengubah pesan penutup dari teks yang diberikan pemilik proyek tanpa instruksi
- Menambah dependency di luar daftar tanpa persetujuan
- Menambah game selain 3 game yang sudah ditentukan
