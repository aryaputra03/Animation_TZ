/** Teks penutup, salam perpisahan, dan aksi ruang hadiah. */
export const CLOSING_MESSAGE = 'Terimakasih bil sudah eksplorasi di Website Landing Page yang masih banyak kurangnya ini.';
export const SECRET_ROOM_LOCKED_TITLE = 'Ruang rahasia masih terkunci';
export const SECRET_ROOM_LOCKED_MESSAGE = 'Menangkan ketiga game dulu ya. Kamu bebas main kapan saja, lalu balik lagi ke sini!';

export const CLOSING_BUTTON = 'Special Gift (Ruang Rahasia)';
export const CLOSING_HINT = 'Membuka ruang tersebut membutuhkan pemahaman programming thinking.';
export const CLOSING_FAREWELL_MESSAGE = 'Dadah, Kak Abil! Makasih sudah main bareng kami!';
export const SECRET_GIFT_TITLE = 'Soal programming thinking';
export const SECRET_GIFT_PROMPT = 'Kak Abil, program JavaScript di bawah ini menghasilkan output apa? Tulis jawabanmu di kolom. Boleh tanya budakmu atau ChatGPT!';
export const SECRET_GIFT_PROBLEM = `const vault = (function* (seed) {
  let state = seed;
  while (true) {
    // 8-bit XOR-shift PRNG
    state ^= (state << 3) & 0xff;
    state ^= (state >> 5) & 0xff;
    state = (state + 0x3d) & 0xff;
    yield state;
  }
})(0x5a);

const payload =
  0x5c36c133b419b30eb0c8c30aa7657b05ba73218996ca4020aa6dd20f17e1bc20286ad080bd668f60be2eb537n;

const rawBytes = (function extract(n, acc = []) {
  return n === 0n ? acc : extract(n >> 8n, [Number(n & 0xffn), ...acc]);
})(payload);

const decoded = new TextDecoder().decode(
  Uint8Array.from(rawBytes, (byte) => byte ^ vault.next().value)
);

const result = Array.from(
  new TextEncoder().encode(decoded),
  (b) => b.toString(16).padStart(2, '0')
).join('');

console.log(result);`;
export const SECRET_GIFT_ANSWER = '0001';
export const SECRET_GIFT_HEX_HINT_TRIGGER = '50617373776f72646e79612074616e796120616a61206b652079616e672070756e79612077656273697465';
export const SECRET_GIFT_PLAIN_HINT_TRIGGER = 'passwordnya tanya aja ke yang punya website';
export const SECRET_GIFT_COPY_LABEL = '📋 Salin soal';
export const SECRET_GIFT_COPY_DONE_LABEL = '✅ Tersalin!';
export const SECRET_GIFT_COPY_SUCCESS = 'Soal berhasil disalin!';
export const SECRET_GIFT_COPY_ERROR = 'Soal belum bisa disalin. Salin kode secara manual, ya.';
export const SECRET_GIFT_ANSWER_LABEL = 'Jawaban Kak Abil';
export const SECRET_GIFT_ANSWER_PLACEHOLDER = 'Tulis jawabanmu';
export const SECRET_GIFT_SUBMIT_LABEL = 'Kirim jawaban';
export const SECRET_GIFT_CLOSE_LABEL = 'Tutup soal';
export const SECRET_GIFT_CORRECT_MESSAGE = 'Tepat! Jawabanmu diterima.';
export const SECRET_GIFT_WRONG_MESSAGE = 'Belum tepat, Kak Abil. Coba lagi ya!';
export const SECRET_GIFT_HEX_HINT = 'Ubah dari bahasa mesin hexa ke teks.';
export const SECRET_GIFT_PLAIN_HINT_NOTICE = 'Nohh tanya aja ke yang buat soalnya, ini passwordnya rahasia banget.';
export const SECRET_GIFT_BLOOM_RESET_MESSAGE = 'Tamannya mekar dulu ya.';
export const SECRET_GIFT_BLOOM_RESTART_MESSAGE = 'Tanda × kembali ke halaman awal. Tombol animasi bunga ada di sana.';
export const SECRET_GIFT_BLOOM_RESTART_LABEL = 'Kembali ke halaman awal';
export const SECRET_GIFT_BLOOM_REPLAY_BUTTON = 'Lihat animasi bunga lagi';
export const SECRET_GIFT_BLOOM_LABEL = 'Taman malam dengan bunga jingga, daun teal, dan rumput tinggi';
export const SECRET_GIFT_STICKER_LABEL = 'Primata cerdas memakai kacamata sambil fokus mengerjakan soal';
export const CLOSING_MOON_LABEL = 'Ketuk bulan untuk konser malam';
export const CLOSING_GROUP_LABEL = 'Teman-teman berkumpul';

export const CLOSING_ANIMAL_LABELS = {
  cat: (name: string) => `Ketuk ${name} untuk salam perpisahan`,
  hamster: 'Ketuk hamster untuk salam perpisahan',
  rabbit: 'Ketuk kelinci untuk salam perpisahan',
  fox: 'Ketuk rubah untuk salam perpisahan',
  redPanda: 'Ketuk red panda untuk salam perpisahan',
} as const;
