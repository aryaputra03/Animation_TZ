# 05 - Minigame

Tiga minigame yang **mudah banget**, nyaman untuk HP Android, dan dimainkan dengan **satu jari**. Teks dan balon chat tiap game ada di `03-sections-and-copy.md` (S4, S6, S10). Karakter ada di `04-characters.md`. Suara ada di `06-sound-design.md`.

## 1. Prinsip yang berlaku untuk semua game

1. **Tidak bisa kalah.** Tidak ada game over, tidak ada nyawa, tidak ada waktu habis yang menghukum.
2. **Tanpa skor, poin, atau level.** Jangan menampilkan angka skor. Kemajuan ditampilkan secara visual saja (cangkir terisi, hati terisi, kartu terbuka). Hadiah menang hanya sticker yang ditentukan untuk tiap game: cappuccino, hamster komedi, dan red panda jenius.
3. **Wajib menang untuk membuka ruang rahasia.** Jangan tampilkan tombol "Lewati". Pengguna boleh menggulir melewati intro dan kembali bermain kapan saja.
4. **Satu jari.** Hanya ketuk atau geser. Tanpa multi-touch, tanpa gestur rumit.
5. **Pendek.** Setiap game selesai dalam sekitar **30 sampai 60 detik**. Ada batas waktu lunak (*soft cap*) yang menyelesaikan game dengan senang hati, bukan gagal.
6. **Tidak bergantung pada refleks.** Kecepatan lambat, area sentuh besar, dan bantuan otomatis (*assist*).
7. **Tidak boleh mengganggu scroll** sebelum dimulai. Pengguna boleh menggulir melewati intro; scroll hanya terkunci setelah game dimulai.
8. **Tanpa teks yang membuatnya merasa gagal.** Salah atau terlewat dibalas dengan teks lucu dan ringan.

## 2. Game Shell (pembungkus bersama)

Semua game dibungkus komponen `GameShell` agar perilaku seragam dan game baru mudah ditambah.

### Tahapan (state)

| State | Tampilan |
|---|---|
| `intro` | Kartu intro berisi judul, petunjuk satu kalimat, dan tombol **Mulai**. Pengguna bebas melanjutkan scroll |
| `playing` | Area game aktif dan scroll terkunci sampai game menang atau soft cap menyelesaikannya |
| `success` | Animasi menang singkat, balon chat, dan tombol **Main Lagi**. Tiap game menampilkan sticker kemenangan yang telah ditentukan |

### Antarmuka (disarankan)

```ts
interface GameShellProps {
  id: 'coffee-beans' | 'hamster-pop' | 'card-match';
  title: string;
  instruction: string;
  startLabel: string;           // "Gas!", "Mulai!", "Ayo!"
  softCapMs: number;            // batas waktu lunak
  onComplete: () => void;
  children: (api: GameApi) => React.ReactNode;
}

interface GameApi {
  progress: number;             // 0..1, hanya untuk visual (bukan skor)
  setProgress: (v: number) => void;
  complete: () => void;
}
```

### Perilaku bersama

- **Sebelum Mulai:** pengguna bebas menggulir melewati game tanpa menekan apa pun.
- **Saat `playing`:**
  - Tampilkan game dalam panel tetap yang terpusat pada viewport agar seluruh area permainan terlihat; tombol mute tetap di atas panel, pendamping dan jejak progres disembunyikan sementara, dan balon chat memakai slot tetap di dalam panel agar kemunculannya tidak menggeser game.
  - Kunci scroll halaman (`overflow: hidden` pada `body` atau pause ScrollTrigger) dan terapkan `touch-action: none` hanya pada area game.
- **Saat `success`:** buka kunci scroll. Tombol **Main Lagi** memulai ronde baru; kemenangan pertama tetap tercatat selama sesi. Pengguna dapat menggulir halaman untuk melanjutkan.
- **Status kemenangan disimpan di memori sesi** (Zustand), bukan `localStorage`. Jika pengguna kembali scroll ke atas, game yang sudah dimenangkan tidak mengunci lagi.
- **Ruang rahasia S11:** hanya tampil setelah `coffee-beans`, `hamster-pop`, dan `card-match` berstatus `success`. Sebelumnya tampilkan panel terkunci. Pemain bebas menentukan kapan memainkan setiap game.
- **Jeda otomatis** saat tab tersembunyi (`visibilitychange`) dan saat game keluar dari layar (`IntersectionObserver`).
- **Batas waktu lunak (`softCapMs`):** jika waktu terlampaui, game otomatis masuk `success` dengan teks hangat. **Bukan** gagal.
- **Animasi menang:** maksimal sekitar 12 partikel (hati atau biji kopi), suara kemenangan singkat, getar halus HP, dan ekspresi `happy` atau `love` pada karakter.
- **Mode hemat animasi:** kurangi partikel dan efek, perlambat tidak diperlukan. Game tetap berfungsi penuh.
- **Aksesibilitas:** area status memakai `aria-live="polite"` (misalnya "Biji kopi tertangkap"). Tombol **Mulai** dan **Main Lagi** punya `aria-label` jelas.

### Konfigurasi terpusat

Semua angka penyetel (kecepatan, jumlah target, durasi) ada di satu file, contoh `src/game/config.ts`, agar mudah diatur setelah uji di HP sungguhan:

```ts
export const GAME_CONFIG = {
  coffeeBeans: { /* lihat bagian 3 */ },
  hamsterPop:  { /* lihat bagian 4 */ },
  cardMatch:   { /* lihat bagian 5 */ },
};
```

---

## 3. Game 1: Tangkap biji kopi (S4)

**Tema:** {catName} si barista mengumpulkan biji kopi yang berjatuhan ke dalam keranjang. Nyambung dengan profesi Kak Abil.

### Cara bermain
- Biji kopi jatuh dari atas, satu per satu, **pelan**.
- Pemain **menggeser jari ke kiri dan kanan** untuk menggerakkan keranjang (atau mengetuk di satu sisi, keranjang bergerak menuju titik itu).
- Setiap biji yang tertangkap mengisi sebuah **cangkir kopi** di sisi layar (indikator visual, bukan skor).
- Saat cangkir penuh, game selesai.

### Parameter (nilai awal yang disarankan)

| Parameter | Nilai | Catatan |
|---|---|---|
| Target tertangkap | **10 biji** | Cangkir penuh saat tercapai |
| Kecepatan jatuh | sekitar **90 sampai 120 px/detik** | Sangat lambat |
| Jeda antar biji | sekitar **900 ms** (acak 700 sampai 1100) | Maksimal 2 biji di layar sekaligus pada awal |
| Lebar keranjang | **minimal 30% lebar layar** | Besar dan mudah |
| Tinggi keranjang | sekitar 64 px | |
| Magnet bantuan (*assist*) | Biji dalam jarak sekitar **40 px** di luar tepi keranjang tetap dihitung tertangkap | Mengurangi frustrasi |
| Batas waktu lunak | **45 detik** | Setelah itu otomatis selesai dengan senang |
| Gerak keranjang | Mengikuti jari dengan pelunakan (*smoothing*) | Tidak kaku |

### Aturan
- Biji yang terlewat **tidak menghukum**. Biji itu jatuh ke lantai, memantul kecil, lalu memudar (lucu, bukan mengecewakan).
- Tidak ada biji buruk atau rintangan. Tidak ada kecepatan yang meningkat.
- {catName} bereaksi di sisi layar: `happy` saat menangkap, sorak kecil saat cangkir penuh.
- Kursor jari tidak harus tepat di keranjang: **gerakan di mana saja di area game** menggeser keranjang (jari tidak menutupi keranjang).

### Suara dan getar
- Tangkap biji: suara "pop" kecil bernada naik (nada naik tiap biji), getar sangat halus.
- Cangkir penuh: dentingan kemenangan singkat dan suara meow bahagia.

### Implementasi (saran)
- **Canvas 2D** dengan `requestAnimationFrame` dan **delta time** (batasi `dt` maksimum agar tidak melompat saat tab lambat).
- Skala resolusi (DPR) maksimal 2.
- Pakai **Pointer Events** (`pointerdown`, `pointermove`, `pointerup`) dengan `setPointerCapture`.
- Hentikan loop saat tidak `playing` atau tidak terlihat.

---

## 4. Game 2: Ketuk hamster (S6)

**Tema:** hamster main petak umpet dari lubang-lubang tanah. Pemain "menyapa" mereka dengan mengetuk. Interaksi permainan bukan gaya pukul dan hamster senang diketuk. Palu hanya tampil sebagai ilustrasi komedi statis pada sticker setelah menang.

### Cara bermain
- Tersedia **9 lubang** (grid 3 kolom x 3 baris).
- Grid berada di atas petak tanah rerumputan; tanah dan lubang bereaksi singkat saat hamster muncul atau disapa.
- Hamster muncul dari satu lubang, bertahan cukup lama, lalu masuk lagi bila tidak diketuk.
- Mengetuk hamster membuatnya `happy`, memantul, mengeluarkan cicit, lalu masuk lubang sambil melambai.
- Hamster memantul saat keluar dan masuk lubang, sementara hati memantul saat satu sapaan berhasil dihitung. Saat deretan hati penuh, game selesai.
- Saat menang, tampil sticker hamster berkepala benjol, berekspresi kesakitan lucu, dengan palu kartun kecil. Teks di atas sticker: **"Sakit Kak Abil, kamu harus tanggung jawab, aku gak ada asuransi soalnya."**

### Parameter (nilai awal yang disarankan)

| Parameter | Nilai | Catatan |
|---|---|---|
| Jumlah lubang | **9** (3 x 3) | |
| Target sapaan | **8 kali** | Indikator hati terisi penuh |
| Hamster aktif bersamaan | **1** | Tidak pernah lebih dari 1 pada game ini |
| Lama hamster bertahan | **1,8 sampai 2,4 detik** | Lama dan santai |
| Jeda antar kemunculan | **500 sampai 900 ms** | |
| Lubang berulang | Hindari lubang yang sama dua kali berturut-turut | |
| Area sentuh | Seluruh lubang, **minimal 96 x 96 px** | Besar |
| Batas waktu lunak | **45 detik** | Setelah itu selesai dengan senang |

### Aturan
- Hamster yang tidak diketuk hanya masuk lubang lagi sambil mengintip. **Tidak ada hukuman** dan tidak ada hitungan terlewat.
- Ketukan di lubang kosong tidak berdampak (atau menggetarkan tanah sedikit sebagai animasi lucu, tanpa suara keras).
- Hamster tidak pernah bergerak cepat. Animasi muncul dan masuk berdurasi sekitar 300 sampai 400 ms.

### Suara dan getar
- Hamster muncul: "pop" kecil.
- Hamster diketuk: **cicit** lucu (nada acak sedikit tiap kali), getar halus.
- Selesai: cicit bergembira dan dentingan.

### Implementasi (saran)
- **DOM sederhana** dengan Framer Motion (9 tombol lubang). Tiap lubang adalah `<button>` dengan `aria-label` ("Lubang 1, ada hamster" atau "Lubang 1, kosong").
- Penjadwal kemunculan memakai `setTimeout` yang dibersihkan saat game berhenti atau dijeda.

---

## 5. Game 3: Cocokkan kartu hewan (S10)

**Tema:** kartu bergambar hewan yang sudah ditemui sepanjang halaman. Pemain mencari pasangan yang sama.

### Cara bermain
- Tersedia **6 kartu** (3 pasang) dalam grid **3 kolom x 2 baris**.
- Gambar tiap pasang diambil dari **3 hewan** yang dipilih acak dari kelima hewan (kucing oren, hamster, kelinci, rubah, red panda), tanpa pengulangan dalam satu permainan.
- Di awal, semua kartu **terbuka sebentar (sekitar 1,5 detik)** agar pemain sempat melihat, lalu menutup.
- Pemain mengetuk dua kartu. Jika sama, kartu tetap terbuka (dan hewannya bereaksi). Jika berbeda, kartu menutup lagi setelah sekitar 900 ms.
- Game selesai saat semua pasangan ditemukan.

### Parameter (nilai awal yang disarankan)

| Parameter | Nilai | Catatan |
|---|---|---|
| Jumlah kartu | **6** (3 pasang) | |
| Intip awal | **1500 ms** | Memudahkan |
| Lama kartu salah terbuka | **900 ms** | Cukup untuk diingat |
| Ukuran kartu | sekitar **100 x 120 px** (menyesuaikan lebar layar) | Besar, rapat tapi tidak berdempetan |
| Animasi balik kartu | 250 sampai 350 ms | |
| Batas waktu lunak | **60 detik** | Setelah itu kartu otomatis terbuka semua dan selesai dengan senang |

### Aturan
- **Tidak ada hitungan percobaan, tidak ada skor, tidak ada pembatas jumlah salah.**
- Selama dua kartu sedang dievaluasi, **kunci input** agar tidak terjadi ketukan ganda.
- Tidak boleh mengetuk kartu yang sudah cocok atau yang sedang terbuka.
- Wajah hewan di kartu adalah **kepala saja** (versi sederhana dari karakter, ekspresi `idle`). Pasangan yang cocok berubah ke ekspresi `happy` dan memantul.
- Dua kartu yang cocok mendapat sapuan kilau emas di permukaan dalam kartu. Kedua hewan yang tidak cocok berekspresi `grumpy` selama kartunya masih terbuka.
- Saat menang, tampil sticker red panda jenius yang fokus mengingat sambil memegang kartu, dengan teks: **"Wahh Kak Abil, memory-nya kuat ya! Iyalah, kan dia ingat aku semenjak di Arten, hahaha."**
- Punggung kartu: pola jejak kaki dengan latar `matcha-500`.

### Suara dan getar
- Kartu dibalik: suara **khas hewan** di wajah kartu (meow, cicit, cuit, yip, cicit red panda) dengan volume lembut.
- Pasangan cocok: dentingan manis singkat dan getar halus.
- Pasangan salah: suara "boing" lembut (bukan buzzer), tanpa getar.
- Semua selesai: musik kemenangan sangat singkat dan semua hewan bersuara bergantian.

### Implementasi (saran)
- **DOM sederhana** dengan Framer Motion (flip 3D memakai `rotateY` dan `backface-visibility`).
- Tiap kartu adalah `<button>` dengan `aria-label` ("Kartu 1, tertutup" / "Kartu 1, kucing").
- Logika pencocokan dipisah dari tampilan (hook `useCardMatch`) agar mudah diuji.

---

## 6. Alur kerja: dari scroll ke game

1. Section game masuk layar, kartu **intro** muncul dengan balon chat {catName}.
2. Pengguna boleh langsung menggulir melewati intro, atau menekan **Mulai** kapan saja.
3. Saat `playing`, scroll terkunci dan area game aktif.
4. Setelah menang (atau soft cap menyelesaikan game), scroll terbuka dan pengguna dapat melanjutkan.
5. S11 tetap terkunci sampai ketiga kemenangan tercatat di memori sesi.
6. Balon chat memberi komentar sesuai hasil (teks di `03-sections-and-copy.md`).

## 7. Struktur file yang disarankan

```
src/features/games/
├── GameShell.tsx
├── useGameShell.ts           # state intro/playing/success, scroll lock, soft cap
├── config.ts                 # semua angka penyetel
├── coffee-beans/
│   ├── CoffeeBeansGame.tsx
│   ├── engine.ts             # loop canvas, spawn, tabrakan, assist
│   └── Cup.tsx               # indikator cangkir terisi
├── hamster-pop/
│   ├── HamsterPopGame.tsx
│   ├── HamsterBonkSticker.tsx # sticker saat menang
│   ├── useHamsterPop.ts      # penjadwal kemunculan
│   └── Hole.tsx
└── card-match/
    ├── CardMatchGame.tsx
    ├── RedPandaMemorySticker.tsx # sticker saat menang
    ├── useCardMatch.ts       # logika pasangan, kunci input
    ├── Card.tsx
    └── CardAnimal.tsx        # wajah hewan di kartu
```

## 8. Daftar periksa

**Umum**
- [ ] Intro setiap game bisa dilewati dengan scroll; game yang dimulai harus diselesaikan
- [ ] S11 tetap terkunci sampai ketiga game berstatus sukses
- [ ] Tidak ada kondisi kalah, skor, poin, atau level; sticker hadiah hanya muncul setelah menang di game terkait
- [ ] Game selesai dalam 30 sampai 60 detik, dan batas waktu lunak berfungsi
- [ ] Scroll terkunci hanya saat `playing`, dan terbuka kembali setelahnya
- [ ] Game dijeda saat tab tersembunyi atau game keluar layar
- [ ] Semua kontrol bekerja dengan sentuhan satu jari di Chrome Android
- [ ] Tidak ada error di console, tidak ada kebocoran `setTimeout` atau listener
- [ ] Tidak ada teks yang membuat pengguna merasa gagal

**Game 1**
- [ ] Keranjang mengikuti gerakan jari di area mana pun, dengan pelunakan
- [ ] Biji jatuh pelan dan assist magnet aktif
- [ ] Cangkir terisi sebagai indikator, tanpa angka

**Game 2**
- [ ] Hanya satu hamster aktif, bertahan cukup lama
- [ ] Area sentuh lubang minimal 96px
- [ ] Hamster yang terlewat tidak menghukum

**Game 3**
- [x] Kartu intip awal 1,5 detik
- [x] Input terkunci saat dua kartu dievaluasi
- [x] Setiap kartu bersuara sesuai hewannya
- [x] Soft cap membuka semua kartu dan selesai dengan senang
