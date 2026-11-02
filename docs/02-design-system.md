# 02 - Design System

Aturan tampilan dan gerakan. Semua nilai di sini dipakai sebagai **design token** (variabel CSS atau konfigurasi Tailwind), jangan ditulis berulang di komponen.

> ## ⚠️ Pembaruan arah visual (versi final, menang atas bagian bertanda di bawah)
> - **Palet:** hijau matcha seperti di bagian 2 (token berlaku kembali; terdefinisi di `src/styles/index.css` `@theme` dan `src/core/palette.ts`). Kucing oren tetap `#f59a3c` dan `#ffc884`.
> - **Font (bagian 4):** satu keluarga, **Baloo 2** bobot 600 dan 800, di-host sendiri di `public/fonts/`. Menggantikan Fredoka dan Nunito (juga di `07`).
> - **Latar (bagian 3) diganti:** empat pemandangan bertumpuk yang saling memudar mengikuti scroll: **padang rumput pagi, hutan siang, bukit sore, malam berbintang**. Kode di `src/components/scene/`. Batas pindah di 25%, 50%, 75% scroll; lebar cross-fade `FADE_WIDTH` (bawaan 0.5) di `scenes.ts`. Hanya opacity yang dianimasikan.
> - **Teks selalu di atas kartu krem** (`.card-cream`, teks `coffee-800`) agar terbaca di semua pemandangan, jadi tidak ada peralihan warna teks.
> - **Karakter (bagian 7):** **tanpa outline**, warna datar dengan gradien radial halus pada bulu, mata besar `#2b1a2e` dengan kilau putih dan biru muda. Acuan gaya: `src/components/characters/CatPeek.tsx`.
> - **Tombol utama:** `.btn-matcha` (gradien hijau, bayangan datar `#3f6b1e`, teks krem). **Tombol mute:** kiri atas, krem dengan ikon `matcha-700`.
> - **`color-scheme`:** `light`.


## 1. Prinsip desain

1. **Bulat dan imut:** semua bentuk membulat. Tidak ada sudut tajam.
2. **Gaya stiker:** outline tebal, warna datar, tanpa gradien rumit pada karakter.
3. **Hijau sebagai identitas:** hijau matcha dan sage mendominasi, dengan krem dan cokelat kopi sebagai pendamping.
4. **Mobile-first:** didesain untuk lebar 360 sampai 412 px (Android umum). Desktop hanya tidak boleh rusak.
5. **Ringan:** animasi hanya memakai `transform` dan `opacity`. Hindari bayangan dan filter berat.
6. **Satu hal menonjol per layar:** jangan menumpuk banyak animasi besar sekaligus.

## 2. Palet warna

### Warna inti

| Token | Hex | Pemakaian |
|---|---|---|
| `matcha-50` | `#F1F8E9` | Latar paling terang (pagi) |
| `matcha-100` | `#DCEDC8` | Latar section terang |
| `matcha-300` | `#AED581` | Aksen, tombol sekunder |
| `matcha-500` | `#7CB342` | Aksen utama, tombol utama |
| `matcha-700` | `#4E7A2A` | Teks aksen, elemen gelap |
| `sage-300` | `#B7C9A8` | Daun, dekorasi lembut |
| `sage-600` | `#6B8A5B` | Dekorasi sedang |
| `forest-900` | `#1F3A2B` | Latar malam, outline karakter |
| `cream-50` | `#FFF8E7` | Latar kartu, balon chat |
| `cream-200` | `#F6E7C1` | Perut hewan, aksen hangat |
| `coffee-500` | `#8B5E3C` | Kopi, kayu, tanah |
| `coffee-800` | `#4A2F1E` | Teks gelap, outline hangat |
| `blush-300` | `#F8B4C0` | Pipi merah muda, hati |
| `sun-400` | `#FFC94A` | Bintang, bulan, sorotan |

### Warna karakter (spesifikasi detail ada di `04-characters.md`)

| Hewan | Warna utama | Aksen |
|---|---|---|
| Kucing oren | `#FF9A3C` | `#FFD9A8` (perut), `#E67E22` (belang) |
| Hamster | `#F2C98A` | `#FFF1D6` (perut), `#E0A96B` |
| Kelinci | `#FFFFFF` | `#FFD6E0` (telinga dalam), `#E8E8E8` |
| Rubah | `#E8742C` | `#FFFFFF` (ekor dan dada), `#4A2F1E` (kaki) |
| Red panda | `#C4581E` | `#FFFFFF` (wajah), `#3A2418` (kaki) |

### Outline karakter

- Warna outline: `#3A2418` (cokelat gelap) atau `forest-900`. **Pilih satu dan konsisten untuk semua karakter.**
- Ketebalan: `3px` pada viewBox standar karakter, dengan `stroke-linejoin: round` dan `stroke-linecap: round`.

## 3. Latar berubah sepanjang scroll (pagi ke malam)

Latar halaman berpindah halus mengikuti progres scroll (0% sampai 100%). Gunakan interpolasi warna lewat GSAP ScrollTrigger pada satu elemen latar tetap (`position: fixed`), bukan pada tiap section.

| Progres scroll | Suasana | Warna dasar latar | Warna teks |
|---|---|---|---|
| 0% sampai 20% | Pagi cerah | `#F1F8E9` ke `#DCEDC8` | `coffee-800` |
| 20% sampai 50% | Siang hijau | `#DCEDC8` ke `#AED581` | `coffee-800` |
| 50% sampai 75% | Sore hangat | `#AED581` ke `#F6D9A0` (hangat) | `coffee-800` |
| 75% sampai 100% | Malam berbintang | `#F6D9A0` ke `#1F3A2B` | `cream-50` |

Aturan:
- Teks harus tetap **terbaca** di semua tahap. Beralih ke teks terang tepat saat latar cukup gelap.
- Bintang dan bulan baru muncul setelah progres sekitar 80%.
- Awan, matahari, dan elemen langit sederhana (bentuk datar), bukan ilustrasi rumit.
- Jika mode hemat animasi aktif, ganti interpolasi halus dengan perpindahan antar-section yang lebih sederhana.

## 4. Tipografi

| Peran | Font | Bobot | Catatan |
|---|---|---|---|
| Judul dan balon chat | **Fredoka** | 500 dan 600 | Bulat, ramah |
| Teks isi dan tombol kecil | **Nunito** | 500 dan 700 | Mudah dibaca di HP |
| Cadangan | `ui-rounded, system-ui, sans-serif` | | Jika font gagal dimuat |

Aturan:
- **Self-host** font di `public/fonts/` dalam format `woff2` dan hanya subset Latin. **Jangan memuat dari Google Fonts atau CDN lain** (aturan tanpa pihak ketiga).
- Pakai `font-display: swap`.
- Maksimal 4 file font secara total.

Skala ukuran (untuk lebar HP):

| Token | Ukuran | Pemakaian |
|---|---|---|
| `text-hero` | `clamp(2rem, 9vw, 2.75rem)` | Judul pembuka |
| `text-title` | `1.5rem` | Judul section |
| `text-body` | `1rem` | Teks isi |
| `text-bubble` | `0.95rem` | Balon chat |
| `text-small` | `0.8rem` | Keterangan kecil |

## 5. Bentuk, jarak, dan elevasi

- **Radius:** kartu `24px`, tombol `9999px` (pil), balon chat `20px`.
- **Jarak:** pakai skala kelipatan 4px (`4, 8, 12, 16, 24, 32, 48`).
- **Padding halaman:** `16px` kiri-kanan, ditambah `env(safe-area-inset-*)`.
- **Bayangan:** gunakan satu gaya "bayangan datar bergeser" (offset tanpa blur), misalnya `0 4px 0 rgba(31,58,43,0.25)`, agar tetap bergaya stiker dan ringan.
- **Tinggi section:** minimal `100dvh` untuk section hewan, supaya tiap hewan punya "panggung" sendiri.

## 6. Komponen UI

### Tombol utama
- Bentuk pil, latar `matcha-500`, teks `cream-50`, outline `forest-900` 3px.
- Tinggi minimal **56px** (target sentuh nyaman).
- Efek tekan: turun 3px dan bayangan mengecil (dalam `transform`).
- Tombol aksi penutup ("Lihat animasi bunga") adalah satu-satunya tombol besar berwarna paling mencolok di halaman dan selalu bisa diakses.

### Tombol kecil (Mute)
- Target sentuh minimal **48 x 48 px** meski ikonnya lebih kecil.
- **Mute:** pojok kanan atas, di dalam safe area, selalu terlihat (`position: fixed`).

### Balon chat kucing
- Latar `cream-50`, outline 3px, radius 20px, ekor kecil mengarah ke kucing.
- Maksimal sekitar **2 baris** dan 80 karakter agar terbaca sekilas.
- Muncul dengan animasi pegas (lihat bagian 8), hilang otomatis setelah beberapa detik atau saat balon berikutnya datang.
- Posisikan tidak menutupi hewan atau game yang sedang aktif.

### Indikator progres scroll
- Tampilkan deretan jejak kaki kecil di tepi kanan; jejak terisi sesuai progres scroll.
- Sembunyikan scrollbar native pada halaman utama agar tidak bertumpuk dengan indikator jejak kaki.
- Tidak boleh menghalangi sentuhan (`pointer-events: none`) dan tidak menutupi konten.
- Panel internal yang dapat digulir memakai thumb matcha membulat dan track sage transparan; panel kode gelap mempertahankan track gelap.
- Scroll programatik bergerak halus; hormati `prefers-reduced-motion` dengan menonaktifkan scroll smooth.

### Kolom nama kucing (layar pembuka)
- Satu input teks bulat dengan placeholder `Oyen`, maksimal 12 karakter.
- Boleh dikosongkan. Jika kosong, pakai **Oyen**.
- Pastikan input tidak menyebabkan zoom otomatis di Android (font minimal 16px).

## 7. Gaya karakter (aturan lintas hewan)

- Bentuk dasar: lingkaran atau oval besar. Kepala besar, badan kecil.
- Mata: dua titik hitam besar dengan kilau putih kecil. Boleh berubah bentuk sesuai ekspresi.
- Pipi: lingkaran `blush-300` dengan opacity sekitar 0.7.
- Tanpa hidung rumit dan tanpa detail bulu halus.
- Semua hewan memakai **outline, ketebalan, dan gaya mata yang sama** agar terlihat satu keluarga.
- Ukuran tampil di layar HP: sekitar **160 sampai 240 px** untuk hewan utama di setiap section.
- Setiap karakter harus bisa digambar sebagai satu SVG dengan bagian-bagian yang bisa dianimasikan terpisah (telinga, ekor, mata, mulut).

## 8. Animasi dan gerakan

### Durasi dan easing

| Jenis | Durasi | Easing |
|---|---|---|
| Mikro (tekan tombol, kedip) | 100 sampai 200 ms | `easeOut` |
| Masuk ke layar | 400 sampai 600 ms | pegas ringan (Framer Motion `spring`, `stiffness ~ 220`, `damping ~ 16`) |
| Perpindahan latar | mengikuti scroll (scrub) | linear |
| Ekspresi karakter | 200 sampai 350 ms | `easeInOut` |
| Gerak idle berulang | 2 sampai 4 detik | `easeInOut`, bolak-balik |

### Aturan
- Setiap hewan punya **gerak idle** halus (bernapas, berkedip, telinga atau ekor bergoyang) supaya terasa hidup.
- Setiap hewan punya **reaksi saat diketuk**: memantul (squash and stretch), ekspresi berubah, dan efek kecil (hati, bintang, atau daun).
- Efek partikel (hati, bintang, daun) dibatasi **maksimal ~12 partikel aktif** sekaligus.
- Parallax: elemen dekoratif (daun, awan, biji kopi) bergerak dengan kecepatan berbeda, tetapi **tanpa mengganggu keterbacaan**.
- Jangan menjalankan animasi yang tidak terlihat di layar (pause saat keluar viewport).
- Hindari getaran layar atau kilatan cepat (aman untuk pengguna sensitif).

### Mode hemat animasi
Aktif otomatis jika `prefers-reduced-motion: reduce` **atau** perangkat dinilai lemah (misalnya `navigator.hardwareConcurrency <= 4` atau `deviceMemory <= 2`). Efeknya:
- Matikan parallax dan partikel berlebih.
- Gerak idle diganti kedipan sederhana atau diam.
- Hentikan transisi latar halus, ganti dengan perpindahan antar-section.
- Semua interaksi dan game tetap berfungsi.

## 9. Lapisan tumpukan (z-index)

| Lapisan | Isi | z-index |
|---|---|---|
| Latar tetap (langit, bintang) | | 0 |
| Dekorasi parallax | | 10 |
| Konten section dan hewan | | 20 |
| Balon chat kucing | | 40 |
| Jejak kaki progres | | 50 |
| Tombol mute | | 60 |
| Layar pembuka dan overlay (portrait guard) | | 100 |

## 10. Layar khusus

### Layar pembuka
- Latar `matcha-50`, kucing oren mengintip dari bawah, tombol "Ketuk untuk mulai 🐾" besar di tengah, dan kolom nama kucing (opsional) di atasnya.
- **Tanpa nama penerima.**
- Setelah tombol diketuk, layar memudar halus dan audio diaktifkan.

### Pesan landscape
- Saat HP diputar ke landscape, tampilkan overlay lucu (kucing miring kepala, tulisan "Putar balik dulu ya, Kak 🐾") yang menutup seluruh layar.
- Overlay hilang otomatis saat kembali ke portrait.

## 11. Ikon dan aset statis

- **Favicon dan ikon PWA:** kepala kucing oren sederhana, latar `matcha-500`. Sediakan ukuran 192 dan 512 px (format PNG).
- **Gambar Open Graph:** 1200 x 630 px, kucing oren dan teks pendek, latar hijau.
- Semua ikon UI (mute, kunci, panah) dibuat sebagai **SVG inline** bergaya bulat dan tebal, bukan library ikon.

## 12. Aksesibilitas dasar

- Kontras teks terhadap latar minimal **4.5:1** di setiap tahap latar.
- Semua tombol punya `aria-label` yang jelas (terutama mute dan tombol animasi bunga).
- Tombol di bagian akhir selalu tersedia dan langsung membuka animasi bunga tanpa popup atau kuis.
- Batang tanaman tumbuh langsung dari bawah layar tanpa tahap benih/kecambah, lalu daun teal berlapis dengan tangkai yang tersambung ke batang, rumput hijau tipis, dan lima bunga jingga mekar bertahap di latar malam burgundy. Batang, daun, rumput, dan bunga bergoyang lembut; banyak kelopak tersebar bergerak mendatar dari kiri ke kanan di depan dan belakang taman, bersama titik cahaya kecil. Gerak memakai `transform` dan `opacity`. SVG mempertahankan rasio aspek dan mengecil agar seluruh komposisi tidak terpotong pada ukuran layar portrait berbeda. Taman tampil minimal 10 detik; setelah itu tombol X muncul di pojok kanan atas dan membawa pengguna kembali ke halaman awal tanpa reload atau menghapus progres game. Tombol replay tersedia di S2 setelah animasi pertama kali dibuka, tanpa syarat kemenangan game. Mode hemat gerak langsung menampilkan taman mekar, dengan aturan tunggu dan tombol X yang sama.
- Elemen dekoratif diberi `aria-hidden="true"`.
- Hewan yang bisa diketuk adalah `<button>` (bukan `div`), dengan `aria-label` seperti "Elus Oyen".
- Fokus keyboard terlihat jelas, meski penggunaan utama adalah sentuhan.
- Jangan mengandalkan warna saja untuk menyampaikan informasi.

## 13. Daftar periksa desain

- [ ] Semua warna berasal dari token, tanpa hex acak di komponen
- [ ] Outline dan gaya mata seragam di kelima hewan
- [ ] Semua tombol minimal 48px dan aman dari poni layar
- [ ] Teks terbaca di setiap tahap latar
- [ ] Font di-host sendiri, tidak ada permintaan ke domain luar
- [ ] Mode hemat animasi diuji dan tetap menarik
- [ ] Tidak ada gulir ke samping pada lebar 360px
