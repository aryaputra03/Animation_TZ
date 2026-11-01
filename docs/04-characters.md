# 04 - Karakter

Spesifikasi lima hewan halaman: **kucing oren, hamster, kelinci, rubah, red panda**. Semuanya digambar sebagai **SVG inline** (komponen React), bergaya bulat, imut, dan simpel seperti stiker. Warna dan outline mengikuti `02-design-system.md`. Teks dan pemicu balon ada di `03-sections-and-copy.md`, suara di `06-sound-design.md`.

Pengecualian khusus: satu sticker primata SVG yang fokus mengerjakan soal programming boleh tampil hanya di popup Special Gift S11. Primata ini bukan karakter baru di alur halaman dan tidak memiliki interaksi atau suara sendiri.

## 1. Aturan umum untuk semua karakter

### Gaya
- Kepala besar, badan kecil dan bulat (proporsi sekitar 60:40).
- Outline **3px**, warna `#3A2418`, `stroke-linejoin: round`, `stroke-linecap: round`.
- Warna datar. **Tanpa gradien, tanpa filter, tanpa bayangan lembut** di dalam karakter.
- Mata: dua oval hitam besar dengan satu titik kilau putih. Gaya mata **sama untuk semua hewan**.
- Pipi: lingkaran `blush-300` dengan opacity sekitar 0.7.
- Mulut: garis kecil bergaya "ω" atau senyum sederhana, tanpa gigi rumit.
- Tidak ada detail bulu halus, hanya beberapa garis belang bila perlu.
- Semua hewan harus terlihat seperti satu "keluarga" bila diletakkan berdampingan.

### Kerangka SVG
- `viewBox="0 0 240 240"` untuk semua karakter agar ukuran dan posisinya konsisten.
- Ukuran tampil di HP: sekitar **160 sampai 240 px** (hewan utama), **72 px** untuk kucing pendamping mini.
- Setiap bagian yang bergerak berupa `<g>` terpisah dengan `id` atau `data-part` tetap:

| Bagian | Nama | Dipakai oleh |
|---|---|---|
| Badan | `body` | semua |
| Kepala | `head` | semua |
| Telinga kiri dan kanan | `ear-l`, `ear-r` | semua |
| Ekor | `tail` | semua |
| Mata (kiri dan kanan) | `eye-l`, `eye-r` | semua |
| Kelopak (untuk kedip dan tidur) | `lid-l`, `lid-r` | semua |
| Mulut | `mouth` | semua |
| Pipi | `cheek-l`, `cheek-r` | semua |
| Lengan atau kaki depan | `arm-l`, `arm-r` | semua |
| Aksesori | `accessory` | kucing barista, kelinci (syal) |

- Atur `transform-box: fill-box` dan `transform-origin` pada tiap bagian supaya rotasi dan skala terjadi di titik tumpu yang benar (misalnya pangkal telinga atau pangkal ekor).
- Jumlah elemen SVG per karakter sebaiknya **di bawah sekitar 60 node** demi performa.

### Ekspresi (status wajib)

| Status | Mata | Mulut | Tubuh |
|---|---|---|---|
| `idle` | Oval normal, berkedip tiap 3 sampai 6 detik secara acak | Senyum kecil | Bernapas pelan |
| `happy` | Melengkung seperti "^ ^" | Senyum lebar | Memantul kecil |
| `surprised` | Oval besar, kilau besar | "O" kecil | Terlonjak sedikit |
| `sleepy` | Setengah tertutup atau garis lengkung "‿" | Datar kecil | Condong, napas lambat, muncul "Zzz" |
| `love` | Bentuk hati | Senyum | Hati melayang di atas kepala |

Karakter khusus kucing oren juga punya:
- `lebay`: mata bintang, tubuh membesar dan bergoyang (lihat `03-sections-and-copy.md`, easter egg).
- `purr`: mata terpejam rapat, getaran halus (saat dielus).

### Aturan gerak
- Setiap karakter **selalu punya gerak idle** (bernapas, kedip, telinga atau ekor). Jangan pernah diam kaku total.
- Reaksi ketukan memakai prinsip **squash and stretch** (memipih lalu memanjang), durasi 200 sampai 400 ms.
- Setelah reaksi, kembali ke `idle` secara halus (maksimal sekitar 1,5 detik).
- Pause semua gerak idle saat karakter keluar dari layar.
- Mode hemat animasi: gerak idle diganti kedipan sederhana, partikel dikurangi (lihat `02-design-system.md`, bagian 8).

### Aturan interaksi
- Setiap karakter adalah elemen `<button>` dengan area sentuh minimal 48 x 48 px dan `aria-label` yang jelas (contoh: "Elus {catName}", "Ketuk hamster").
- Semua reaksi harus bekerja dengan sentuhan, bukan hover.
- Reaksi ketuk memicu: animasi, **satu suara khas** (lewat `SoundManager`), dan **getar halus** bila didukung.
- Ketukan beruntun tidak boleh menumpuk animasi atau suara tanpa batas. Beri jeda singkat (*debounce* sekitar 150 ms) dan hentikan animasi sebelumnya sebelum memulai yang baru.

### Antarmuka komponen (disarankan)

```ts
type Expression = 'idle' | 'happy' | 'surprised' | 'sleepy' | 'love' | 'hurt';

interface CharacterProps {
  expression?: Expression;      // default 'idle'
  size?: number;                // px, default 200
  onTap?: () => void;
  onLongPress?: () => void;     // dipakai kucing (elus)
  disabled?: boolean;
  reducedMotion?: boolean;
  ariaLabel: string;
}
```

---

## 2. Kucing oren (karakter utama)

| Hal | Detail |
|---|---|
| Nama | Nama dari Abil, bawaan **Oyen** (`{catName}`) |
| Peran | Pemandu dan pendamping sepanjang halaman |
| Warna utama | `#FF9A3C` |
| Perut dan muzzle | `#FFD9A8` |
| Belang | `#E67E22` (3 garis di dahi, 2 garis di tiap sisi badan) |
| Telinga dalam | `blush-300` |
| Hidung | kecil, merah muda tua |

**Bentuk:** kepala bulat lebar dengan dua telinga segitiga membulat, pipi sedikit menggembung, ekor panjang melengkung ke atas. Badan oval gemuk.

**Aksesori (berganti sesuai section):**
- S2: tanpa aksesori (mengintip dari cangkir kopi, hanya kepala dan kaki depan terlihat).
- S3 dan S4: **apron hijau** (`matcha-500` dengan outline) dan **topi barista kecil** krem.
- Mode lebay: mata bintang, tanpa aksesori tambahan.

**Gerak idle:** napas pelan, telinga sesekali berkedut, ujung ekor bergoyang, kedip acak.

**Reaksi saat diketuk:** memantul (squash and stretch), `happy`, suara **meow**, balon singkat acak (lihat `03`, bagian 12).

**Tekan-tahan (elus):**
- Setelah sekitar 400 ms: ekspresi `purr` (mata terpejam), badan bergetar halus (maksimal amplitudo 1 sampai 2 px).
- Suara **purr** berulang selama ditekan, getaran HP halus.
- Muncul hati kecil sesekali.
- Lepas: kembali ke `idle` dengan menggeliat kecil.

**Mode lebay:** ketuk 5 kali dalam sekitar 3 detik. Durasi sekitar 4 detik, lalu kembali normal.

**Tidur:** jika tidak ada interaksi sekitar 12 detik, status `sleepy`, muncul "Zzz". Ketukan membangunkan: `surprised` singkat, lalu `idle`.

**Kucing pendamping mini (S5 sampai S11):**
- Versi kecil (~72 px), tetap di **pojok kiri bawah**, di dalam safe area.
- Hanya tampil di section yang **tidak** memakai kucing besar (S5 ke bawah). Di S1 sampai S4, balon berasal dari kucing besar supaya tidak ada dua kucing sekaligus.
- Tempat munculnya balon chat. Bisa diketuk dengan reaksi yang sama (lebih sederhana).
- Tidak boleh menutupi area game atau hewan utama.

**Elemen latar (props) untuk adegan kucing:** cangkir kopi besar (S2), mesin kopi mungil dan latte art (S3), keranjang dan biji kopi (S4, lihat `05`).

---

## 3. Hamster

| Hal | Detail |
|---|---|
| Peran | Bintang S5 (roda) dan S6 (game) |
| Warna utama | `#F2C98A` |
| Perut dan wajah bawah | `#FFF1D6` |
| Bercak | `#E0A96B` (satu bercak di punggung, satu di dahi) |
| Telinga | bulat kecil, bagian dalam `blush-300` |

**Bentuk:** badan bulat gemuk hampir seperti bola, kepala menyatu dengan badan, pipi sangat besar yang bisa menggembung, kaki sangat pendek, ekor nyaris tak terlihat.

Ekspresi dasar hamster ceria dengan mata tersenyum; saat roda berputar cepat, ekspresinya berubah menjadi `surprised`.

**Props:** roda lari besar (S5), 9 lubang tanah dalam grid 3 x 3 (S6).

**Gerak idle:** hidung kembang-kempis, telinga bergoyang kecil, kedip.

**Di S5 (roda):**
- Berlari di roda. **Kecepatan putaran roda dan langkah kaki mengikuti kecepatan scroll**: scroll cepat membuat roda cepat dan hamster terengah (`surprised`). Diam membuat roda melambat pelan lalu berhenti.
- Batasi kecepatan maksimum supaya tidak terlihat gila atau berat.

**Reaksi saat diketuk:**
- Pipi **menggembung** besar, hamster berhenti sebentar, mata melebar, lalu pipi mengempis dan lanjut berlari.
- Suara **cicit** (lihat `06`).

**Di S6 (game):**
- Muncul dari lubang dengan ekspresi `idle`. Saat diketuk: `happy`, memantul, suara cicit, lalu masuk lubang lagi. Detail ada di `05-minigames.md`.
- Saat menang, hamster tampil pada sticker statis dengan benjol, palu kartun kecil, dan ekspresi `hurt` yang lucu. Ilustrasi ini hanya muncul di layar hasil menang.

**Tidur:** tidak perlu (bukan karakter pendamping).

---

## 4. Kelinci (tiga ekor: kakak dan dua adik)

| Hal | Detail |
|---|---|
| Peran | Bintang S7, menghargai peran "kakak" |
| Warna utama | `#FFFFFF` (dengan outline cokelat gelap supaya terlihat di latar hijau muda) |
| Bayangan lembut badan | `#E8E8E8` (datar, bukan gradien) |
| Telinga dalam | `#FFD6E0` |
| Syal | adik memakai syal hijau `matcha-500` |
| Hidung | merah muda |

**Tiga ekor:**
- **Kelinci kakak:** besar (sekitar 220 px), telinga panjang tegak, ekspresi tenang dan menjaga.
- **Adik pertama:** kecil (sekitar 130 px), telinga lebih pendek, memakai syal, ekspresi ceria.
- **Adik paling kecil:** lebih mungil (sekitar 100 px), memakai syal, ekspresi polos dan ceria.

**Bentuk:** kepala bulat, telinga panjang melengkung (bisa terkulai atau tegak), badan oval, ekor bulat kecil seperti kapas.

**Gerak idle:**
- Kakak: telinga sesekali bergerak, napas pelan, sesekali menoleh ke adik.
- Kedua adik: hidung bergerak, telinga bergoyang, sesekali melompat kecil.

**Reaksi saat diketuk:**
- **Salah satu adik:** melompat singkat mendekat ke pelukan kakak (lintasan lengkung), muncul hati, ekspresi `love`, suara **cuit lembut**.
- **Kakak:** telinga bergoyang, mengayunkan lengan dari bahu untuk mengelus kepala adik, ekspresi `happy`.

**Props dan dekorasi:** padang rumput, bunga kecil, kupu-kupu atau kelopak melayang (ringan, maksimal beberapa elemen).

---

## 5. Rubah

| Hal | Detail |
|---|---|
| Peran | Bintang S8, kejutan kecil yang lucu |
| Warna utama | `#E8742C` |
| Ujung ekor, dada, dan muzzle | `#FFFFFF` |
| Kaki dan ujung telinga | `#4A2F1E` |
| Telinga dalam | `#FFD9A8` |

**Bentuk:** kepala segitiga membulat dengan moncong runcing yang tetap imut, telinga tegak besar, ekor **sangat besar dan lebat** dengan ujung putih (bagian terpenting untuk lelucon "sembunyi tapi ekornya kelihatan").

**Props:** semak hijau besar di sisi layar (rubah bersembunyi di baliknya).

**Gerak idle:** ekor bergoyang pelan keluar dari semak (selalu terlihat), semak dan daun bergoyang, dan rubah sesekali mengintip sambil mengedip sebelah mata. Ekspresinya penasaran dengan pandangan melirik.

**Reaksi saat diketuk (ekor atau rubah):**
1. Kaget (`surprised`), melompat keluar dari semak.
2. Mengeluarkan suara **"yip"**.
3. Berputar bangga sekali, ekor mengibas, ekspresi `happy`.
4. Setelah sekitar 2 detik, kembali mengintip dari semak.

**Reaksi ketuk semak:** daun bergoyang dan rubah mengintip lagi dengan satu mata (tanpa melompat).

---

## 6. Red panda

| Hal | Detail |
|---|---|
| Peran | Bintang S9, adegan tenang dan mengantuk |
| Warna utama | `#C4581E` |
| Wajah dan telinga luar | `#FFFFFF` (pola khas wajah putih dengan "alis" putih) |
| Kaki dan perut bawah | `#3A2418` |
| Ekor | belang melingkar `#C4581E` dan `#F2C98A` |
| Pipi | `blush-300` |

**Bentuk:** kepala lebar dengan telinga bulat besar berujung putih, badan gemuk, ekor besar berbelang yang melingkar. Duduk memeluk **batang bambu**.

**Props:** batang bambu hijau (`matcha-500` dan `matcha-700`) dengan daun, awan kecil di latar.

**Gerak idle:** napas lambat (lebih lambat dari hewan lain), mata setengah terpejam, kepala sesekali terangguk, ekor bergoyang sangat pelan.

**Reaksi saat diketuk:**
1. Terbangun dengan mata menyipit tanpa kilau putih dan ekspresi kesal yang lucu (`grumpy`).
2. Tetap cemberut sambil memeluk bambu dan berguling pelan; suara menguap dan cicit khas red panda tetap terdengar (lihat `06`).

**Diam lama (sekitar 8 detik):** selesai bangun, kembali `sleepy` dengan "Zzz".

---

## 7. Karakter di game (rangkuman)

| Game | Karakter yang terlibat | Catatan |
|---|---|---|
| Game 1 (biji kopi) | Kucing oren | Menjadi "penjaga keranjang" atau sorak-sorai di sisi layar. Ekspresi mengikuti keberhasilan |
| Game 2 (ketuk hamster) | Hamster | Muncul dari lubang, ekspresi `idle` lalu `happy` saat diketuk |
| Game 3 (kartu hewan) | Semua lima hewan | Muka hewan dipakai sebagai gambar kartu (versi sederhana atau kepala saja); sticker kemenangan menampilkan red panda fokus mengingat kartu |

Versi kartu (game 3) boleh memakai **kepala saja** (viewBox lebih kecil) dengan ekspresi `idle` dan `happy`, supaya ringan dan mudah dikenali.

---

## 8. Struktur file yang disarankan

```
src/components/characters/
├── Character.types.ts       # tipe Expression, CharacterProps
├── useCharacter.ts          # hook state ekspresi, kedip, tidur, debounce ketukan
├── Cat.tsx                  # kucing oren besar (+ varian apron dan lebay)
├── CatMini.tsx              # kucing pendamping kecil
├── Hamster.tsx
├── Rabbit.tsx               # RabbitBig dan RabbitSmall
├── Fox.tsx
├── RedPanda.tsx
├── parts/                   # bagian bersama (Eyes, Cheeks, Heart, Zzz)
└── props/                   # cangkir, roda, semak, bambu, dll.
```

Aturan:
- Bagian bersama (mata, pipi, hati, "Zzz") dibuat satu kali dan dipakai ulang agar gaya seragam.
- Logika ekspresi dan gerak (kedip, tidur, debounce) ada di hook `useCharacter`, bukan diulang di tiap komponen.
- Animasi memakai GSAP atau Framer Motion pada `transform` dan `opacity` saja.

---

## 9. Daftar periksa karakter

- [ ] Kelima hewan memakai outline, ketebalan, dan gaya mata yang sama
- [ ] Setiap hewan memiliki 5 ekspresi (`idle`, `happy`, `surprised`, `sleepy`, `love`)
- [ ] Setiap hewan punya gerak idle dan reaksi ketuk berbeda
- [ ] Kucing punya elus (tekan-tahan), mode lebay, dan tidur
- [ ] Rubah selalu terlihat ekornya saat bersembunyi
- [ ] Roda hamster mengikuti kecepatan scroll (dengan batas maksimum)
- [ ] Kelinci kakak dan adik berinteraksi satu sama lain
- [ ] Tidak ada reptil atau hewan yang menjijikkan
- [ ] Semua karakter adalah `<button>` dengan `aria-label` dan target sentuh minimal 48px
- [ ] Gerak berhenti saat karakter di luar layar
- [ ] Jumlah node SVG per karakter terjaga (di bawah sekitar 60)
