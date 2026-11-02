# 01 - Brief Proyek

Dokumen ini adalah gambaran besar proyek. Jika ada konflik dengan file `docs/` lain, file ini yang menang (setelah `AGENTS.md`).

## 1. Ide inti

Satu landing page panjang yang lucu dan beranimasi, dibuat sebagai kejutan kecil untuk **Abil**. Semakin halaman di-scroll, semakin muncul hewan kartun yang bisa diajak berinteraksi, diselingi tiga minigame yang mudah. Tidak ada halaman lain dan tidak ada navigasi: hanya scroll ke bawah.

Perasaan yang ingin dicapai: **senang, geli, dan hangat**. Tidak ada tekanan, tidak ada hal yang membuatnya merasa harus membalas.

## 2. Penerima

| Hal | Detail |
|---|---|
| Nama | Abil (disapa "Kak Abil") |
| Pekerjaan | Barista |
| Peran | Seorang kakak |
| Suka | Warna hijau, hal-hal lucu, kartun hewan (terutama kucing) |
| Perangkat | HP Android (Chrome) |
| Cara membuka | Memindai QR code |
| Catatan | Tidak punya laptop, jadi semuanya harus nyaman di HP |

## 3. Pengirim

Pemilik proyek. **Namanya tidak ditampilkan di mana pun** di halaman, metadata, atau teks apa pun yang tampil ke penerima.

## 4. Tujuan dan nada

- **Tujuan:** lucu-lucuan, tanpa maksud menyatakan perasaan secara terang-terangan.
- **Nada tulisan:** campuran, dominan **lucu dan receh**, dengan sedikit sentuhan manis.
- **Bahasa teks halaman:** Indonesia santai (bukan baku).
- **Sapaan:** "Kak Abil".

## 5. Konsep pengalaman

1. Abil membuka link dari QR dan melihat layar pembuka.
2. Dia mengetuk tombol mulai, sekaligus mengaktifkan suara, dan boleh memberi nama kucing oren.
3. Dia scroll. Tiap beberapa layar muncul hewan berbeda dengan animasi dan suara khas.
4. Hewan-hewan itu bisa diketuk dan bereaksi.
5. Di tiga titik, muncul minigame yang mudah. Pengguna bebas melewati intro dan memilih kapan bermain; game tidak menjadi syarat untuk membuka penutup atau animasi bunga.
6. Penutup dapat dibuka kapan saja dengan scroll, menampilkan semua hewan berkumpul di malam berbintang, salam perpisahan, pesan terima kasih, dan tombol animasi bunga.

Kucing oren menemani sepanjang halaman lewat balon chat yang berkomentar receh.

## 6. Fitur final (yang HARUS ada)

**Inti**
- Layar pembuka "Ketuk untuk mulai 🐾" yang sekaligus mengaktifkan audio
- Kolom opsional untuk memberi nama kucing oren (bawaan: **Oyen**)
- Kucing oren pendamping dengan balon chat
- 5 hewan: kucing oren, hamster, kelinci, rubah, red panda
- Setiap hewan punya reaksi dan suara khas saat diketuk
- 3 minigame
- Latar yang berubah dari pagi sampai malam berbintang sepanjang scroll
- Indikator progres berupa jejak kaki di tepi layar
- Tombol animasi bunga di bagian akhir tanpa syarat kemenangan game

**Kenyamanan**
- Tombol mute di pojok kanan atas
- Penutup S11 dan tombol animasi bunga dapat dibuka kapan saja tanpa syarat kemenangan game
- Mode hemat animasi (otomatis untuk perangkat lemah atau `prefers-reduced-motion`)
- Tampilan terkunci portrait dengan pesan lucu saat diputar ke landscape

**Interaksi tambahan**
- **Elus kucing:** tekan-tahan, kucing mendengkur dan HP bergetar halus
- **Kucing tertidur** jika pengguna diam terlalu lama, dan bangun saat diketuk
- **Easter egg:** ketuk kucing 5 kali (mode lebay), dan ketuk bulan di penutup (semua hewan bernyanyi)

## 7. Tiga minigame

| # | Game | Inti |
|---|---|---|
| 1 | Tangkap biji kopi | Geser keranjang untuk menangkap biji kopi yang jatuh (nyambung dengan profesi barista) |
| 2 | Ketuk hamster | Hamster muncul dari lubang, ketuk untuk menyapanya |
| 3 | Cocokkan kartu hewan | 6 kartu (3 pasang) bergambar hewan |

Semua game: **mudah banget**, satu jari, tanpa kalah dan tanpa skor. Intro game boleh dilewati dengan scroll dan pemain dapat kembali kapan saja. S11 serta animasi bunga selalu dapat diakses tanpa harus menang game. Detail ada di `05-minigames.md`.

## 8. Alur halaman (garis besar)

1. Layar pembuka
2. Hero: kucing oren mengintip dari cangkir kopi
3. Kucing barista
4. Game 1: tangkap biji kopi
5. Hamster di roda
6. Game 2: ketuk hamster
7. Kelinci kakak
8. Rubah
9. Red panda
10. Game 3: cocokkan kartu
11. Penutup

Detail ada di `03-sections-and-copy.md`.

## 9. Penutup

- Pesan: **"Terimakasih bil sudah eksplorasi di Website Landing Page yang masih banyak kurangnya ini."**
- Setiap karakter di ending bisa diketuk untuk mengucapkan salam perpisahan dan berterima kasih sudah bermain.
- Tombol: **"Lihat animasi bunga"**
- Tombol langsung membuka animasi taman bunga. Tidak ada kuis, popup soal, syarat game, atau tautan eksternal.
- Setelah animasi dibuka sekali, tombol replay tersedia di S2 tanpa menghapus progres game.

## 10. Metadata

- Judul tab dan pratinjau link: `Buka disaat jam istirahat saja atau pulang kerja ya 🐾`
- Deskripsi: `Scroll pelan-pelan ya`

## 11. Yang dihapus (JANGAN dibuat)

- Mainan benang atau laser untuk kucing
- Menu kafe dan fitur memesan kopi ke kucing
- Cap jejak kaki tersembunyi
- Obrolan palsu ala WhatsApp
- Fitur goyang HP dan tilt (bergantung sensor, hasilnya tidak konsisten)
- Minigame tambahan di luar tiga yang ditentukan
- Skor, poin, level, kupon, atau hadiah selain sticker kemenangan yang ditentukan untuk masing-masing dari tiga game
- Musik latar
- Analytics, cookie, atau pelacakan apa pun
- Nama pengirim di halaman

## 12. Batasan konten

- Hewan halaman: kucing oren, hamster, kelinci, rubah, red panda.
- **Tanpa reptil, serangga, atau hewan yang menjijikkan.**
- Tidak ada teks yang menekan atau membuatnya merasa bersalah jika tidak membalas.
- Pesan penutup menggunakan teks yang ditentukan pemilik proyek.

## 13. Target

- **Durasi:** sekitar 3 sampai 5 menit dari awal sampai akhir; pemain bebas menentukan kapan memainkan game.
- **Perangkat utama:** Android kelas menengah, Chrome.
- **Hosting:** Vercel, situs statis.
- **Distribusi:** QR code.

## 14. Kriteria sukses

- Terasa mulus dan lucu dari awal sampai akhir di HP Android sungguhan.
- Tidak ada momen yang membingungkan, membosankan, atau membuatnya frustrasi.
- Setiap hewan punya momen "aww" sendiri.
- Tombol animasi bunga selalu tersedia di penutup dan membuka taman bunga secara langsung.
- Tidak ada pelanggaran terhadap bagian 11 dan 12.

## 15. Hal yang masih terbuka

- [ ] Pesan penutup (diisi pengirim sendiri)
- [ ] Pengujian akhir di HP Android sungguhan
