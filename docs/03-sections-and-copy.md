# 03 - Section dan Teks

Urutan halaman dan **seluruh teks yang tampil**. Semua teks dikumpulkan di `src/content/` (lihat bagian 14), jangan ditulis langsung di komponen.

## 0. Aturan penulisan

- Bahasa Indonesia santai, dominan **receh**, sedikit manis.
- Sapaan: **"Kak Abil"**.
- `{catName}` = nama kucing yang diketik Abil. Jika kosong, pakai **Oyen**.
- Kalimat pendek. Balon chat maksimal sekitar **80 karakter** dan 2 baris.
- Emoji secukupnya (maksimal 1 per balon).
- **Dilarang:** teks yang menekan, membuat merasa bersalah, atau menuntut balasan. Tidak menyebut nama pengirim.
- Tidak ada skor, poin, atau level. Hadiah hanya sticker kemenangan yang ditentukan untuk masing-masing dari tiga game.
- Pesan penutup S11 memakai teks yang diberikan pemilik proyek di `src/content/closing.ts`.

## 1. Gambaran urutan

| # | Section | Hewan | Interaktif | Game |
|---|---|---|---|---|
| S1 | Layar pembuka | Kucing oren | Ketuk mulai, isi nama | tidak |
| S2 | Hero: kucing di cangkir | Kucing oren | Ketuk, elus | tidak |
| S3 | Kucing barista | Kucing oren | Ketuk cangkir | tidak |
| S4 | Game 1: tangkap biji kopi | Kucing oren | Geser keranjang | **ya** |
| S5 | Hamster di roda | Hamster | Ketuk hamster | tidak |
| S6 | Game 2: ketuk hamster | Hamster | Ketuk | **ya** |
| S7 | Kelinci kakak | Kelinci | Ketuk si kecil | tidak |
| S8 | Rubah | Rubah | Ketuk semak atau rubah | tidak |
| S9 | Red panda | Red panda | Ketuk | tidak |
| S10 | Game 3: cocokkan kartu | Semua hewan | Ketuk kartu | **ya** |
| S11 | Penutup | Semua hewan | Ketuk hewan dan bulan, tombol animasi bunga | tidak |

Latar berubah dari pagi ke malam sepanjang S2 sampai S11 (lihat `02-design-system.md`, bagian 3).

---

## S1. Layar pembuka

**Tujuan:** menyambut, meminta ketukan pertama (aktivasi audio), dan menawarkan pemberian nama kucing.

**Visual:** latar `matcha-50`, kucing oren mengintip dari bawah layar sambil menggoyangkan ekor. **Tanpa nama penerima.**

**Teks tampil:**
- Judul: `Psst… ada yang ngintip 👀`
- Label kolom nama: `Kasih nama kucingnya dulu yuk`
- Placeholder kolom: `Oyen`
- Tombol: `Ketuk untuk mulai 🐾`
- Petunjuk kecil di bawah: `Nyalakan suara biar makin seru`

**Interaksi:**
- Kolom nama opsional, maksimal 12 karakter. Boleh dikosongkan (nama bawaan **Oyen**).
- Mengetuk tombol: simpan nama ke `localStorage` (`catName`), aktifkan `AudioContext`, putar suara kucing kecil, lalu layar memudar menuju S2.
- Mengetuk kucing sebelum tombol: kucing berkedip dan kepalanya miring (tanpa suara, karena audio belum aktif).

---

## S2. Hero: kucing mengintip dari cangkir kopi

**Tujuan:** kesan pertama yang hangat dan lucu. Memperkenalkan {catName}.

**Visual:** cangkir kopi besar bergaya stiker, kucing oren mengintip dari dalamnya, uap kopi berupa garis melengkung yang bergoyang, dan daun melayang pelan. Panah kecil bergerak ke bawah sebagai petunjuk scroll.

**Teks tampil:**
- Judul: `Halo, Kak Abil!`
- Subjudul: `Scroll pelan-pelan ya, banyak yang mau ketemu kamu`
- Petunjuk: `↓ geser ke bawah`

**Balon chat:**
- Saat masuk: `Haloo Kak Abil! Aku {catName}. Scroll pelan-pelan ya, aku gampang pusing 😼`

**Interaksi:**
- **Ketuk kucing:** memantul, berkedip, suara meow. Balon singkat (lihat bagian 12).
- **Tekan-tahan (elus):** kucing menutup mata, mendengkur (suara purr), HP bergetar halus, dan muncul hati kecil. Lepas jari, kucing kembali normal.
- **Ketuk 5 kali berturut-turut (dalam sekitar 3 detik):** *mode lebay* (lihat bagian 11).

---

## S3. Kucing barista

**Tujuan:** menyambungkan dengan profesi Kak Abil.

**Visual:** {catName} memakai apron hijau dan topi barista kecil, berdiri di balik mesin kopi mungil, menuang susu membentuk latte art.

**Teks tampil:**
- Judul: `Barista baru lagi magang`
- Keterangan: `Kerjanya belum rapi, tapi niatnya 100%`

**Balon chat:**
- Saat masuk: `Kak Abil, kopinya jangan lupa diminum dulu 😼`
- Setelah beberapa detik: `Aku lagi belajar bikin latte art. Hasilnya… ya, ada bentuknya lah.`

**Interaksi:**
- **Ketuk cangkir:** latte art berbentuk hati muncul di permukaan kopi, dentingan kecil, dan {catName} bangga (ekspresi `happy`).
- **Tekan-tahan cangkir (easter egg):** kopi tumpah, {catName} panik (ekspresi `surprised`). Balon: `Eh eh eh! Tumpah! Jangan bilang siapa-siapa ya 🙀`. Cangkir kembali utuh setelah sekitar 2 detik.

---

## S4. Game 1: tangkap biji kopi

**Tujuan:** minigame pertama, nyambung ke barista. Aturan lengkap ada di `05-minigames.md`.

**Teks tampil:**
- Judul game: `Tangkap biji kopinya!`
- Petunjuk: `Geser keranjang ke kiri dan kanan`
- Tombol mulai: `Gas!`

**Balon chat:**
- Saat game dibuka: `Biji kopinya jatuh semua! Tolong tangkap, Kak Abil!`
- Saat berhasil menangkap beberapa: `Mantap! Tanganmu lebih sigap dari aku ngejar tikus mainan.`
- Saat selesai: `Yeay! Kopinya selamat. Kamu memang barista sejati ☕`

**Interaksi:** lihat `05-minigames.md`. Tidak ada kalah, tidak ada skor yang ditampilkan.

---

## S5. Hamster di roda

**Tujuan:** adegan lucu ringan, memberi jeda setelah game.

**Visual:** hamster gemuk berlari di roda besar. Roda berputar **mengikuti kecepatan scroll** (scroll lebih cepat, roda lebih cepat). Pipi hamster kembung.

**Teks tampil:**
- Judul: `Hamster, si pelari abadi`
- Keterangan: `Lari terus tapi nggak sampai-sampai`

**Balon chat:**
- Saat masuk: `Itu hamster lari terus tapi gak sampai-sampai. Mirip aku ngejar deadline.`
- Setelah beberapa detik: `Kak Abil juga sering capek ya? Istirahat sebentar boleh kok.`

**Interaksi:**
- **Ketuk hamster:** pipinya menggembung, hamster berhenti sebentar, lalu lanjut lari. Suara cicit.
- **Scroll cepat:** roda berputar cepat dan hamster terengah (ekspresi `surprised`).

---

## S6. Game 2: ketuk hamster

**Tujuan:** minigame kedua. Aturan lengkap ada di `05-minigames.md`.

**Teks tampil:**
- Judul game: `Hamster main petak umpet`
- Petunjuk: `Ketuk hamster yang nongol dari lubang`
- Tombol mulai: `Mulai!`
- Saat menang: sticker hamster dengan benjol, palu kartun, dan ekspresi kesakitan lucu. Teks di atas sticker: `Sakit Kak Abil, kamu harus tanggung jawab, aku gak ada asuransi soalnya.`

**Balon chat:**
- Saat game dibuka: `Mereka nongol dari lubang! Sapa satu-satu ya 🐹`
- Saat berhasil mengetuk beberapa: `Kena! Hamsternya malah senang dicolek.`
- Saat selesai: `Selesai! Kasihan hamsternya… tapi lucu sih.`

---

## S7. Kelinci kakak

**Tujuan:** adegan yang menyentuh dengan cara ringan, menghargai peran Kak Abil sebagai kakak.

**Visual:** kelinci kakak dan dua adiknya duduk berdekatan di padang rumput hijau. Keduanya memakai syal hijau; kakak menjaga mereka. Kupu-kupu atau bunga kecil melayang.

**Teks tampil:**
- Judul: `Kakak kelinci yang selalu siaga`
- Keterangan: `Jagain adik itu bukan tugas gampang`

**Balon chat:**
- Saat masuk: `Kakak yang jagain adik itu keren. Kak Abil juga gitu kan?`
- Setelah beberapa detik: `Kakak juga boleh dimanja kok, sesekali.`

**Interaksi:**
- **Ketuk salah satu adik:** melompat singkat mendekat ke pelukan kakak, muncul hati, dan suara cuit lembut.
- **Ketuk kakak:** telinganya bergoyang dan tangannya mengelus kepala adik.

---

## S8. Rubah

**Tujuan:** adegan kejutan kecil dan lucu.

**Visual:** semak hijau di sisi layar, rubah mengintip dari baliknya, ekor besar bergoyang di luar semak (lucunya: dia "sembunyi" tapi ekornya kelihatan).

**Teks tampil:**
- Judul: `Ada yang ngumpet…`
- Keterangan: `Katanya sih nggak kelihatan`

**Balon chat:**
- Saat masuk: `Psst, ada rubah ngintip. Pura-pura gak lihat aja.`
- Setelah beberapa detik: `Ekornya kelihatan tuh. Kasih tahu nggak ya?`

**Interaksi:**
- **Ketuk ekor atau rubah:** rubah kaget, melompat keluar, mengeluarkan suara "yip", lalu berputar bangga. Balon: `Ketahuan! Ya sudah, aku keluar deh 🦊`
- **Ketuk semak:** daun bergoyang dan rubah mengintip lagi.

---

## S9. Red panda

**Tujuan:** adegan tenang dan lucu, penutup deretan hewan sebelum game terakhir.

**Visual:** red panda duduk memeluk batang bambu, mata setengah terpejam mengantuk, ekor belang melingkar. Bintang atau awan kecil mulai terlihat karena latar menuju sore.

**Teks tampil:**
- Judul: `Red panda lagi ngantuk`
- Keterangan: `Jangan berisik ya`

**Balon chat:**
- Saat masuk: `Dia tidur sambil meluk bambu. Tolong jangan dibangunin… eh, ketuk aja deh.`
- Setelah beberapa detik: `Zzz… dia mimpi makan bambu rasa matcha.`

**Interaksi:**
- **Ketuk red panda:** bangun kaget, menguap, lalu berguling pelan dan memeluk bambu lagi. Suara cicit khas red panda.
- **Diam lama:** dia kembali tertidur dan muncul "Zzz".

---

## S10. Game 3: cocokkan kartu hewan

**Tujuan:** minigame ketiga yang merangkum semua hewan. Aturan lengkap ada di `05-minigames.md`.

**Teks tampil:**
- Judul game: `Cocokkan teman-temannya`
- Petunjuk: `Ketuk dua kartu, cari pasangan yang sama`
- Tombol mulai: `Ayo!`

**Balon chat:**
- Saat game dibuka: `Cocokin semuanya ya. Kalau salah, aku tutup mata, gak lihat kok.`
- Saat salah pasang: `Hampir! Coba lagi, pelan-pelan aja.`
- Saat benar: `Cocok! Mereka senang ketemu 🥰`
- Saat selesai: `Semua pasangan ketemu! Kamu jago banget.`
- Saat menang: sticker red panda jenius yang fokus mengingat kartu sambil memegang kartu. Teks di atas sticker: `Wahh Kak Abil, memory-nya kuat ya! Iyalah, kan dia ingat aku semenjak di Arten, hahaha.`

---

## S11. Penutup

**Tujuan:** momen akhir yang hangat, berisi pesan terima kasih, salam perpisahan dari hewan, dan tombol animasi bunga.

S11 dapat dibuka kapan saja dan tidak bergantung pada hasil tiga game. Tampilkan isi penutup langsung saat pengguna scroll ke bagian ini.

**Visual:** malam berbintang, bulan sabit besar di atas, semua hewan (kucing oren, hamster, kelinci, rubah, red panda) berkumpul di padang rumput, duduk melingkar atau berjejer. Kunang-kunang kecil melayang.

**Teks tampil:**
- Judul: `Terima kasih sudah scroll sampai sini 🌙`
- Pesan utama: `Terimakasih bil sudah eksplorasi di Website Landing Page yang masih banyak kurangnya ini.`
- Tombol aksi: `Lihat animasi bunga`

**Animasi bunga:** tombol di bagian akhir selalu tersedia dan langsung membuka taman tanpa kuis atau popup. Batang tumbuh langsung dari bawah layar tanpa tahap benih/kecambah. Daun teal berlapis tersambung ke batang melalui tangkai, rumput hijau ramping, dan lima bunga jingga mekar di atas latar malam burgundy. Batang dan dedaunan bergoyang lembut tertiup angin; banyak kelopak tersebar melayang mendatar dari kiri ke kanan di depan dan belakang taman. Taman tampil minimal 10 detik, lalu tombol X muncul di pojok kanan atas dan membawa pengguna ke halaman awal tanpa reload atau menghapus progres game. Tombol `Lihat animasi bunga lagi` di S2 tersedia setelah animasi pertama kali dibuka dan tidak bergantung pada hasil game. Dalam mode hemat gerak, taman langsung mekar tetapi tetap menunggu 10 detik dan tombol X.

**Balon chat:**
- Menjelang penutup (di akhir S10 menuju S11): `Tinggal sedikit lagi, aku udah gak sabar.`
- Saat masuk S11: `Semua teman-teman udah kumpul nih, Kak Abil!`
- Dekat tombol: `Kalau mau, ketuk tombolnya. Kalau nggak, nggak apa-apa kok 😺`

**Interaksi:**
- **Ketuk hewan:** masing-masing bereaksi dan bersuara khasnya, lalu menampilkan balon chat tepat di atas karakter: `Dadah, Kak Abil! Makasih sudah main bareng kami!`.
- **Ketuk bulan (easter egg):** semua hewan "bernyanyi" bersamaan, yaitu rangkaian suara semua hewan dengan nada naik-turun lucu dan hati beterbangan, sekitar 3 detik, lalu kembali tenang. Balon: `Konser malam dimulai! 🎶`
- **Ketuk tombol:** tombol langsung membuka animasi bunga kapan saja.

---

## 11. Easter egg: mode lebay

**Pemicu:** ketuk kucing 5 kali berturut-turut dalam sekitar 3 detik (di S2 atau saat kucing pendamping terlihat).

**Efek:** kucing berubah heboh selama sekitar 4 detik: mata berbentuk bintang, tubuh membesar sedikit dan bergoyang, hati dan bintang meledak keluar, dan suara meow bertingkat naik.

**Balon (pilih satu secara acak):**
- `AKU TERHARU DIKETUK SEBANYAK ITU 😭`
- `Stop stop, aku geli! 🙀`
- `Iya iya, aku kucing paling lucu sedunia. Sudah tahu kok.`

## 12. Balon singkat saat kucing diketuk

Pilih acak, jangan mengulang yang sama dua kali berturut-turut.

- `Meow! Ada apa, Kak Abil?`
- `Hehe, geli.`
- `Aku bukan tombol lho… eh, boleh deh.`
- `Ketuk lagi dong, enak.`
- `Kak Abil, kopi dulu!`
- `Lapar nih. Ada ikan?`

## 13. Teks sistem dan kejadian khusus

| Situasi | Teks |
|---|---|
| Idle terlalu lama (sekitar 12 detik tanpa interaksi) | Balon: `Zzz… eh, Kak Abil masih di sini?` (kucing tertidur, bangun saat diketuk) |
| Bangun dari tidur | `Hoaam… eh, lanjut yuk!` |
| Layar diputar ke landscape | `Putar balik dulu ya, Kak 🐾` |
| Tombol mute (aktif) | `aria-label`: "Matikan suara" |
| Tombol mute (nonaktif) | `aria-label`: "Nyalakan suara" |
| Suara dimatikan pertama kali | Balon: `Oke, aku diam deh. 🤐` |
| Suara dinyalakan kembali | Balon: `Yeay, aku boleh meong lagi!` |

## 14. Struktur file konten yang disarankan

Seluruh teks di atas disimpan terpusat, tidak tersebar di komponen:

```
src/content/
├── sections.ts      # judul, subjudul, keterangan tiap section
├── bubbles.ts       # semua balon chat, dikelompokkan per section dan pemicu
├── system.ts        # teks sistem (idle, landscape, mute)
└── closing.ts       # pesan penutup, salam perpisahan hewan, dan teks tombol ruang rahasia
```

Aturan:
- Setiap balon chat memiliki `id`, `section`, `trigger` (`enter`, `tap`, `idle`, `gameStart`, `gameEnd`), dan `text`.
- Teks memakai placeholder `{catName}` yang diganti saat tampil.
- Pesan penutup, salam perpisahan, label tombol, dan keterangan ruang rahasia disimpan di `closing.ts`.

## 15. Daftar periksa konten

- [ ] Semua teks memakai sapaan "Kak Abil", bukan "Ida" atau nama lain
- [ ] `{catName}` diganti dengan benar, dan bawaannya **Oyen**
- [ ] Tidak ada nama pengirim di teks mana pun
- [ ] Tidak ada teks yang menekan atau menuntut balasan
- [ ] Pesan penutup menampilkan teks yang diberikan pemilik proyek
- [ ] Semua hewan di S11 menampilkan salam perpisahan saat diketuk
- [ ] Tombol animasi bunga di bagian akhir selalu tersedia; replay S2 muncul setelah taman pernah dibuka
- [ ] Sticker primata hanya muncul di popup, bukan sebagai karakter baru di alur halaman
- [ ] Setiap section punya minimal satu balon chat dan satu interaksi ketukan
- [ ] Balon tidak menutupi hewan atau area game
