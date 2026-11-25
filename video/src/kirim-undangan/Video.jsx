// Video panduan "Cara kirim undangan ke tamu" (tegak 1080x1920). Layar dashboard = tangkapan layar asli Safari iPhone
// (rekam-layar.mjs, layar.json) di bingkai iPhone 18 Pro; WhatsApp iOS digambar ulang (ui/wa). Semua isi di zona aman
// (ui/dasar.js AMAN). Waktu dijangkarkan ke kata narasi (waktu.json dari naskah.js), jadi narasi baru cukup `npm run waktu`
// lalu render ulang; kata jangkar yang hilang dari naskah langsung jadi galat.
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { AMAN, antara, BINGKAI, FPS, halus, HP, HURUF, IOS, lepas, PANGGUNG, PONSEL, PUSAT, S, W, WARNA, WEB_H, WEB_Y } from "../ui/dasar";
import { Ikon } from "../ui/ikon";
import { IkonIOS, Safari, StatusIOS } from "../ui/ios";
import { Judul } from "../ui/Judul";
import { Kamera } from "../ui/kamera";
import { Ketuk } from "../ui/Ketuk";
import mockup from "../ui/mockup.json";
import { Ponsel } from "../ui/Ponsel";
import SFX from "../ui/sfx.json";
import { Sorot } from "../ui/Sorot";
import { Tanda } from "../ui/Tanda";
import { potong, Teks } from "../ui/Teks";
import { ATAS, BulatKirim, format, Gelembung, Hari, KartuTautan, Kontak, WaKepala, WaLayar, WaPilih, WaTulis } from "../ui/wa/Wa";
import layar from "./layar.json";
import waktu from "./waktu.json";

// ---- Jangkar waktu dan kotak ----
const K = Object.fromEntries(waktu.kalimat.map((k) => [k.id, k]));
const norm = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
// Detik saat `kata` (awalan, kemunculan pertama) mulai diucapkan di kalimat `id`; `akhir` = saat kata itu selesai.
// Tanpa kata: awal (atau akhir) kalimat.
function t(id, kata, akhir) {
  const k = K[id];
  if (!k) throw new Error(`kalimat "${id}" tidak ada di waktu.json`);
  if (!kata) return akhir ? k.selesai : k.mulai;
  const w = k.kata.find(([x]) => norm(x).startsWith(norm(kata)));
  if (!w) throw new Error(`kata "${kata}" tidak ada di kalimat "${id}"`);
  return akhir ? w[2] : w[1];
}
const fr = (s) => Math.round(s * FPS);
// Kotak elemen dari layar.json dalam pt layar iPhone (isi web mulai di bawah bilah status).
function kotak(nama, kunci) {
  const b = layar.layar[nama] && layar.layar[nama].kotak[kunci];
  if (!b) throw new Error(`kotak ${nama}.${kunci} tidak ada di layar.json`);
  return [b[0], b[1] + WEB_Y, b[2], b[3]];
}
const gabung = (...bs) => {
  const x = Math.min(...bs.map((b) => b[0])), y = Math.min(...bs.map((b) => b[1]));
  return [x, y, Math.max(...bs.map((b) => b[0] + b[2])) - x, Math.max(...bs.map((b) => b[1] + b[3])) - y];
};
const tengah = (b) => [b[0] + b[2] / 2, b[1] + b[3] / 2];

const DASHBOARD = "https://" + layar.layar.gerbang.url;
const LINK_TAMU = layar.layar["undangan-sampul"].url;
const PESAN = layar.layar["chat-terkirim-bawah"].pesan;
const OG = staticFile("kirim-undangan/layar/pratinjau.jpg");
const IKON_WA = staticFile("kirim-undangan/layar/whatsapp.webp");
// Pesan serah terima dari ekstensi (nikahkit/ext/pin.js): tiga bagian, dipisah baris kosong.
const SERAH = [`Undangan siap: ${LINK_TAMU.split("?")[0]}`, `Kelola undangan (kirim ke tamu, RSVP, ucapan, check-in): ${DASHBOARD}`, "PIN: `482913`"];

// ---- Urutan layar: [detik, layar, efek masuk] ----
const PIN_MULAI = t("masuk", "mengetik"), PIN_AKHIR = t("masuk", "lalu");
const PIN_KETIK = [1, 2, 3, 4, 5, 6].map((i) => PIN_MULAI + 0.1 + ((i - 1) * (PIN_AKHIR - PIN_MULAI - 0.15)) / 6);
const TEMPEL = t("sumber") + 0.05, TEMPEL_KETUK = TEMPEL + 0.95;
const BALIK = t("kembali") - 0.45;
const LAYAR = [
  [0, "ios:beranda"],
  [0.55, "wa:serah", "aplikasi"],
  [t("masuk", "kedua", true) + 0.25, "gerbang", "geser"],
  ...PIN_KETIK.map((s, i) => [s, "gerbang-pin-" + (i + 1)]),
  [t("masuk", "Masuk", true) + 0.15, "beranda", "pudar"],
  [t("tab-kirim", "Kirim") + 0.25, "kirim-kosong"],
  [t("panel") + 0.15, "tambah-kosong", "geser"],
  [TEMPEL_KETUK + 0.12, "tambah-isi", "pudar"],
  [t("simpan", "Simpan") + 0.3, "daftar-toast", "pudar"],
  [t("penting") - 0.3, "daftar", "pudar"],
  [t("pilih-tamu", "nama") + 0.25, "chat", "geser"],
  [t("pesan", "link") - 0.3, "chat-link", "gulir"],
  [t("link", "menampilkan"), "undangan-sampul", "geser"],
  [t("teks") - 0.25, "chat-bawah", "kembali"],
  [t("siap", "kirim") + 0.3, "chat-terkirim-bawah"],
  [t("terkirim", "ditandai") - 0.25, "chat-terkirim", "gulir"],
  [t("batal", "titik") + 0.35, "chat-menu"],
  [t("wa") - 0.15, "wa:pilih", "aplikasi"],
  [t("cari", "Cari") - 0.05, "wa:cari"],
  [t("cari", "pilih") + 0.3, "wa:chat", "geser"],
  [t("kirim", "kirim") + 0.3, "wa:terkirim"],
  [BALIK + 0.3, "daftar-terkirim", "kembali"],
  [t("saringan", "Belum") + 0.3, "daftar-belum"],
];
const layarPada = (f) => LAYAR[Math.max(0, LAYAR.findLastIndex(([s]) => fr(s) <= f))][1];

// ---- Kamera: [mulai, lama (detik), perbesaran, titik fokus pt layar]. Perbesaran 1 = ponsel utuh di panggung. ----
const TENGAH = [HP.w / 2, HP.h / 2];
const CONTOH = gabung(kotak("tambah-kosong", "baris-1"), kotak("tambah-kosong", "baris-3"));
const KAMERA = [
  [t("masuk") - 0.4, 0.7, 1.5, [HP.w / 2, 560]],
  [t("masuk", "kedua", true) + 0.3, 0.6, 1.55, tengah(kotak("gerbang", "kartu"))],
  [t("beranda") - 0.35, 0.6, 1, TENGAH],
  [t("tab-kirim", "buka") - 0.3, 0.6, 1.5, [HP.w / 2, 660]],
  [t("panel") - 0.1, 0.6, 1.6, tengah(kotak("tambah-kosong", "kolom"))],
  [t("format") - 0.5, 0.8, 2.1, [HP.w / 2, CONTOH[1] + CONTOH[3] / 2 + 10]],
  [t("csv") - 0.4, 0.6, 1.6, tengah(gabung(kotak("tambah-isi", "kolom"), kotak("tambah-isi", "simpan")))],
  [t("simpan", "siap") - 0.4, 0.6, 1.2, tengah(gabung(kotak("daftar", "tamu-1"), kotak("daftar", "tamu-7")))],
  [t("penting") - 0.3, 0.5, 1, TENGAH],
  [t("pilih-tamu") - 0.4, 0.6, 1.5, tengah(kotak("daftar", "tamu-2"))],
  [t("pesan") - 0.2, 0.6, 1.6, tengah(gabung(kotak("chat", "nama-tamu"), kotak("chat-link", "link-tamu")))],
  [t("link", "menampilkan") - 0.1, 0.6, 1.35, tengah(kotak("undangan-sampul", "nama"))],
  [t("teks") - 0.35, 0.6, 1.5, tengah(gabung(kotak("chat-bawah", "pilihan"), kotak("chat-bawah", "status")))],
  [t("ubah") - 0.3, 0.6, 1.35, tengah(gabung(kotak("chat-bawah", "periksa-link"), kotak("chat-bawah", "kirim")))],
  [t("siap") - 0.3, 0.6, 1.3, tengah(gabung(kotak("chat-bawah", "status"), kotak("chat-bawah", "kirim")))],
  [t("terkirim") - 0.3, 0.6, 1.5, tengah(kotak("chat-terkirim", "hari"))],
  [t("batal", "titik") - 0.1, 0.6, 1.55, tengah(kotak("chat-menu", "menu-buka"))],
  [t("wa") - 0.4, 0.45, 1, TENGAH],
  [t("kontak", "meminta") - 0.3, 0.6, 1.5, [HP.w / 2, 330]],
  [t("lewati") - 0.3, 0.5, 1, TENGAH],
  [t("kartu") - 0.35, 0.6, 1.4, [HP.w / 2, 640]],
  [t("selesai") - 0.25, 0.5, 1, TENGAH],
  [t("kembali", "tamu") - 0.3, 0.6, 1.2, tengah(gabung(kotak("daftar-terkirim", "tamu-1"), kotak("daftar-terkirim", "tamu-7")))],
  [t("saringan") - 0.2, 0.5, 1.5, tengah(kotak("daftar-terkirim", "belum"))],
  [t("saringan", "supaya") - 0.1, 0.6, 1.2, tengah(gabung(kotak("daftar-belum", "tamu-1"), kotak("daftar-belum", "tamu-7")))],
  [t("ulangi") + 0.3, 0.8, 1, TENGAH],
];
const SETENGAH = [(PANGGUNG.x1 - PANGGUNG.x0) / 2, (PANGGUNG.y1 - PANGGUNG.y0) / 2];
function kamera(f) {
  let k = 1, fx = TENGAH[0], fy = TENGAH[1];
  for (const [mulai, lama, k2, [x2, y2]] of KAMERA) {
    const a = fr(mulai);
    if (f < a) break;
    const p = antara(f, a, a + fr(lama), 0, 1, halus);
    k += (k2 - k) * p; fx += (x2 - fx) * p; fy += (y2 - fy) * p;
  }
  // Panggung tidak menampilkan lewat dari tepi ponsel: titik fokus dijepit.
  const s = S * k, hw = SETENGAH[0] / s, hh = SETENGAH[1] / s;
  const jepit = (v, a, b) => (a > b ? (a + b) / 2 : Math.max(a, Math.min(b, v)));
  fx = jepit(fx, -BINGKAI.x + hw, BINGKAI.w - BINGKAI.x - hw);
  fy = jepit(fy, -BINGKAI.y + hh, BINGKAI.h - BINGKAI.y - hh);
  const px = PONSEL.x + fx * S, py = PONSEL.y + fy * S;
  return { s, lihat: [fx - hw, fy - hh, fx + hw, fy + hh], transform: `translate(${PUSAT.x - k * px}px, ${PUSAT.y - k * py}px) scale(${k})` };
}
// Di luar panggung ponsel memudar: tidak ada isi layar di luar zona aman saat diperbesar.
const MASKER = {
  WebkitMaskImage: `linear-gradient(to bottom, transparent ${PANGGUNG.y0 - 14}px, #000 ${PANGGUNG.y0 - 2}px, #000 ${PANGGUNG.y1 + 2}px, transparent ${PANGGUNG.y1 + 14}px),
    linear-gradient(to right, transparent ${PANGGUNG.x0 - 24}px, #000 ${PANGGUNG.x0}px, #000 ${PANGGUNG.x1}px, transparent ${PANGGUNG.x1 + 24}px)`,
  WebkitMaskComposite: "source-in", maskComposite: "intersect",
};

// ---- Sorotan dan ketukan di layar dashboard ----
const B = (k) => kotak("tambah-kosong", k);
const SOROT = [
  [kotak("gerbang", "pin"), "Ketik PIN 6 angka", PIN_MULAI - 0.1, PIN_AKHIR],
  [kotak("gerbang", "masuk"), "Masuk", t("masuk", "menekan") - 0.15, t("masuk", "Masuk", true) + 0.1],
  [kotak("beranda", "tab-kirim"), "Tab Kirim", t("tab-kirim", "buka") - 0.1, t("tab-kirim", "Kirim") + 0.2],
  [kotak("kirim-kosong", "fab"), "Tombol tambah", t("tab-kirim", "ketuk") - 0.1, t("laptop") - 0.2],
  [kotak("tambah-kosong", "kolom"), "Daftar tamu, satu per baris", t("tempel", "kolom") - 0.2, t("format") - 0.15],
  [B("baris-3"), "Satu baris, satu tamu", t("format"), t("format", "dipisah") - 0.05],
  [B("baris-3"), "Dipisah tanda strip ( - )", t("format", "dipisah"), t("format", "nama") - 0.05],
  [B("baris-3-1"), "nama", t("format", "nama"), t("format", "nomor") - 0.05],
  [B("baris-3-2"), "nomor WhatsApp", t("format", "nomor"), t("format", "kategori") - 0.05],
  [B("baris-3-3"), "kategori", t("format", "kategori"), t("format", "jumlah") - 0.05],
  [B("baris-3-4"), "jumlah orang", t("format", "jumlah"), t("format", null, true) + 0.15],
  [B("baris-3-1"), "Wajib diisi", t("wajib"), t("wajib", "sisanya") - 0.05],
  [gabung(B("baris-3-2"), B("baris-3-4")), "Boleh dikosongkan", t("wajib", "sisanya"), t("wajib", null, true) + 0.15],
  [CONTOH, "Contoh di kolom", t("contoh"), t("contoh", null, true) + 0.15],
  [B("baris-1"), "Hanya nama", t("baris-1"), t("baris-1", null, true) + 0.15],
  [B("baris-2-1"), "nama", t("baris-2"), t("baris-2", "strip") - 0.05],
  [B("baris-2-2"), "nomor WhatsApp", t("baris-2", "strip"), t("baris-2", null, true) + 0.15],
  [B("baris-3-1"), "nama", t("baris-3"), t("baris-3", "nomor") - 0.45],
  [B("baris-3-2"), "nomor WhatsApp", t("baris-3", "nomor") - 0.4, t("baris-3", "Sahabat") - 0.4],
  [B("baris-3-3"), "kategori", t("baris-3", "Sahabat") - 0.35, t("baris-3", "2") - 0.4],
  [B("baris-3-4"), "jumlah orang", t("baris-3", "2") - 0.35, t("baris-3", "lengkap") - 0.05],
  [B("baris-3"), "Lengkap empat-empatnya", t("baris-3", "lengkap"), t("baris-3", null, true) + 0.2],
  [B("baris-2-2"), "Chat tamu langsung terbuka", t("nomor"), t("nomor", null, true) + 0.15],
  [B("baris-1"), "Tanpa nomor: pilih kontak sendiri", t("tanpa-nomor"), t("tanpa-nomor", null, true) + 0.15],
  [B("baris-3-3"), "Kategori", t("kategori"), t("kategori", null, true) + 0.15],
  [B("baris-3-4"), "Jumlah orang", t("jumlah"), t("jumlah", null, true) + 0.15],
  [kotak("tambah-isi", "csv"), "Impor CSV", t("csv", "pakai") - 0.1, t("csv", null, true) + 0.15],
  [kotak("tambah-isi", "kolom"), "Sampai 1.000 tamu per daftar", t("batas"), t("batas", null, true) + 0.15],
  [kotak("tambah-isi", "simpan"), "Simpan daftar", t("simpan", "ketuk") - 0.2, t("simpan", "Simpan") + 0.25],
  [gabung(kotak("daftar", "tamu-1"), kotak("daftar", "tamu-7")), "Tamu siap dikirimi", t("simpan", "siap") - 0.2, t("simpan", null, true) + 0.25],
  [kotak("daftar", "tamu-2"), "Ketuk nama tamu", t("pilih-tamu") - 0.1, t("pilih-tamu", "nama") + 0.2],
  [kotak("chat", "nama-tamu"), "Nama tamu", t("pesan", "nama") - 0.1, t("pesan", "link") - 0.35],
  [kotak("chat-link", "link-tamu"), "Link pribadi tamu ini", t("pesan", "link"), t("link") - 0.05],
  [kotak("undangan-sampul", "nama"), "Nama tamu di sampul", t("link", "nama") - 0.1, t("khusus") - 0.1],
  [kotak("chat-bawah", "pilihan"), "Pilih teks pengantar", t("teks", "Pilih") - 0.05, t("teks", null, true) + 0.15],
  [gabung(kotak("chat-bawah", "periksa-link"), kotak("chat-bawah", "periksa-nama")), "Boleh diubah, asal [nama] dan [link-undangan] tetap ada", t("ubah"), t("ubah", null, true) + 0.15],
  [kotak("chat-bawah", "status"), "Siap dikirim", t("siap", "Siap") - 0.1, t("siap", "ketuk") - 0.05],
  [kotak("chat-bawah", "kirim"), "Kirim", t("siap", "ketuk"), t("siap", "kirim") + 0.25],
  [kotak("chat-terkirim", "hari"), "Langsung ditandai Terkirim", t("terkirim", "ditandai") - 0.1, t("terkirim", null, true) + 0.25],
  [kotak("chat-menu", "belum-dikirim"), "Kalau batal mengirim", t("batal", "pilih") - 0.2, t("batal", null, true) - 0.1],
  [kotak("daftar-terkirim", "tamu-2"), "Sudah tercatat Terkirim", t("kembali", "tamu") - 0.1, t("kembali", null, true) + 0.25],
  [kotak("daftar-terkirim", "belum"), "Belum dikirim", t("saringan") - 0.05, t("saringan", "Belum") + 0.3],
  [gabung(kotak("daftar-belum", "tamu-1"), kotak("daftar-belum", "tamu-7")), "Tinggal tamu yang belum dikirimi", t("saringan", "supaya"), t("ulangi", null, true) + 0.6],
];
const KETUK = [
  [kotak("gerbang", "masuk"), t("masuk", "Masuk") + 0.05],
  [kotak("beranda", "tab-kirim"), t("tab-kirim", "Kirim") + 0.05],
  [kotak("kirim-kosong", "fab"), t("panel") - 0.05],
  [kotak("tambah-isi", "simpan"), t("simpan", "Simpan") + 0.05],
  [kotak("daftar", "tamu-2"), t("pilih-tamu", "nama")],
  [kotak("chat-bawah", "teks-muslim"), t("teks", "muslim")],
  [kotak("chat-bawah", "kirim"), t("siap", "kirim") + 0.05],
  [kotak("chat-terkirim", "menu"), t("batal", "titik") + 0.1],
  [[30, 18, 80, 28], BALIK],
  [kotak("daftar-terkirim", "belum"), t("saringan", "Belum") + 0.05],
];
// Tempel: tekan lama di kolom, menu sunting iOS (Tempel) muncul, diketuk, daftar terisi.
const KOLOM = kotak("tambah-kosong", "kolom");
const TITIK_TEMPEL = [KOLOM[0] + 120, KOLOM[1] + 120];
const Tempel = () => {
  const f = useCurrentFrame();
  const a = fr(TEMPEL + 0.45), b = fr(TEMPEL_KETUK) + 4;
  if (f < a || f > b) return null;
  const o = antara(f, a, a + 6, 0, 1, lepas) * (1 - antara(f, b - 4, b, 0, 1));
  const [x, y] = TITIK_TEMPEL;
  return (
    <div style={{ position: "absolute", left: x - 48, top: y - 64, zIndex: 7, opacity: o, transform: `scale(${0.92 + 0.08 * o})`, transformOrigin: "48px 100%",
      display: "flex", alignItems: "center", height: 42, borderRadius: 21, background: "rgba(255,255,255,.96)", boxShadow: "0 0 0 .5px rgba(0,0,0,.08), 0 8px 24px rgba(0,0,0,.2)",
      font: `400 16px ${IOS}`, color: "#000", whiteSpace: "nowrap" }}>
      <span style={{ padding: "0 16px" }}>Tempel</span>
      <span style={{ width: .5, height: 22, background: "rgba(60,60,67,.3)" }} />
      <span style={{ padding: "0 16px" }}>Isi Otomatis</span>
    </div>
  );
};

// ---- Layar WhatsApp iOS ----
const Kolom = ({ children, bawah = 96, atas }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: ATAS, bottom: bawah, display: "flex", flexDirection: "column", justifyContent: atas ? "flex-start" : "flex-end", padding: "4px 0 10px" }}>{children}</div>
);
function WaSerah() {
  const a = fr(t("masuk", "link") - 0.25), b = fr(t("masuk", "kedua", true) + 0.2);
  return (
    <WaLayar>
      <WaKepala nama="Rina WO" sub="online" />
      <Kolom>
        <Hari>Hari ini</Hari>
        <Gelembung jam="19.34" ekor={false}>{"Halo Kak Rani & Mas Dimas 🤍 Undangan digitalnya sudah jadi. Ini link undangan, link untuk kirim ke tamu, dan PIN-nya:"}</Gelembung>
        <Gelembung jam="19.35" rapat>
          <div>{format(SERAH[0])}</div>
          <div style={{ margin: "22px 0" }}><Tanda dari={a} sampai={b} label="Link kedua" ketuk={fr(t("masuk", "kedua") + 0.1)} radius={8} block>{format(SERAH[1])}</Tanda></div>
          <div>{format(SERAH[2])}</div>
        </Gelembung>
      </Kolom>
      <WaTulis />
    </WaLayar>
  );
}
const KONTAK = [
  ["Rina WO", "Sama-sama Kak, semoga lancar ya 🤍"], ["Mama", "Jangan lupa makan ya"], ["Keluarga Besar Rani", "Tante Lia: Siap, ditunggu undangannya"],
  ["Om Surya", "Sehat selalu ya, Nak"], ["Dewi Lestari", "Wah selamat yaa!"], ["Om Hendra", "👍"], ["Sari Wulandari", "Oke siap"],
];
const KONTAK_CARI = [["Om Surya", "+62 812-7788-1020"], ["Surya Pratama", "+62 813-2244-5566"], ["Sari Wulandari", "+62 857-1122-3344"], ["Dewi Lestari", "+62 821-9876-5432"]];
const CARI_MULAI = t("cari", "Cari") + 0.2, HURUF_CARI = 4;
function WaPilihLayar() {
  const a = fr(t("kontak", "meminta") - 0.2), b = fr(t("kontak", null, true) + 0.2);
  return (
    <WaPilih cari={null} bungkus={(n) => <Tanda dari={a} sampai={b} label="Pilih kontak tamu" di="bawah" radius={8}>{n}</Tanda>}
      kontak={KONTAK.map(([n, s]) => <Kontak key={n} nama={n} sub={s} />)} />
  );
}
function WaCari() {
  const f = useCurrentFrame();
  const mulai = fr(CARI_MULAI), n = Math.max(0, Math.min(5, Math.floor((f - mulai) / HURUF_CARI) + 1));
  const cari = "Surya".slice(0, f < mulai ? 0 : n);
  const hasil = KONTAK_CARI.filter(([nm]) => nm.toLowerCase().includes(cari.toLowerCase()));
  const a = fr(t("cari", "lalu") - 0.15), pilih = fr(t("cari", "pilih") + 0.05);
  return (
    <WaPilih cari={cari} caret={(f >> 3) % 2 === 0} kontak={hasil.map(([nm, s]) => (
      nm === "Om Surya" && cari.length === 5
        ? <Tanda key={nm} dari={a} sampai={pilih + 8} label="Pilih kontaknya" di="bawah" ketuk={pilih} radius={0} pad={0} block><Kontak nama={nm} sub={s} /></Tanda>
        : <Kontak key={nm} nama={nm} sub={s} />))} />
  );
}
const KARTU = { gambar: OG, judul: "Undangan Pernikahan Rani & Dimas", deskripsi: "Minggu, 14 Februari 2027. Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberi doa restu.", domain: "nikahin.id" };
const ChatLama = () => (
  <>
    <Hari>Kemarin</Hari>
    <Gelembung jam="20.11">Rani, nanti kabari ya kalau undangannya sudah jadi 😊</Gelembung>
    <Gelembung keluar jam="20.15" centang="biru">Siap Om, nanti Rani kirim 🙏</Gelembung>
  </>
);
const KIRIM_WA = t("kirim", "kirim") + 0.02;
function WaChat() {
  const a = fr(t("kartu", "kartu") - 0.15), b = fr(t("kartu", null, true) + 0.2);
  const k = fr(KIRIM_WA);
  return (
    <WaLayar>
      <WaKepala nama="Om Surya" sub="terakhir dilihat hari ini pukul 18.20" />
      <Kolom bawah={300}><ChatLama /></Kolom>
      <WaTulis teks={PESAN} baris={6}
        kartu={<Tanda dari={a} sampai={b} label="Kartu tautan undangan" radius={14} block><KartuTautan kecil tutup {...KARTU} /></Tanda>}
        tombol={<Tanda dari={fr(t("kirim") - 0.1)} sampai={k + 8} label="Kirim" rata="kanan" ketuk={k} radius={22}><BulatKirim /></Tanda>} />
    </WaLayar>
  );
}
function WaTerkirim() {
  const f = useCurrentFrame(), a = fr(t("kirim", "kirim") + 0.3);
  const o = antara(f, a, a + 8, 0, 1, lepas);
  return (
    <WaLayar>
      <WaKepala nama="Om Surya" sub="online" />
      <Kolom atas bawah={96}>
        <ChatLama />
        <Hari>Hari ini</Hari>
        <div style={{ display: "flex", flexDirection: "column", opacity: o, transform: `translateY(${(1 - o) * 24}px)` }}>
          <Gelembung keluar jam="19.42" centang="abu"><KartuTautan {...KARTU} />{format(PESAN)}</Gelembung>
        </div>
      </Kolom>
      <WaTulis />
    </WaLayar>
  );
}
// Layar utama iOS sebelum WhatsApp dibuka: wallpaper hangat dan ikon WhatsApp di tengah.
const Beranda = () => (
  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 80% at 30% 20%, #f6d9c4, #d99a77 55%, #8f5a45)" }}>
    <Img src={IKON_WA} style={{ position: "absolute", left: HP.w / 2 - 32, top: HP.h / 2 - 32, width: 64, height: 64, borderRadius: 14 }} />
  </div>
);
const WA_LAYAR = { "wa:serah": WaSerah, "wa:pilih": WaPilihLayar, "wa:cari": WaCari, "wa:chat": WaChat, "wa:terkirim": WaTerkirim };
// Warna atas halaman (di belakang bilah status Safari), dari baris piksel pertama tangkapan layarnya.
const ATAS_WEB = { "undangan-sampul": "#f7f6cf", gerbang: "#f7f5f3" };

// ---- Pergantian layar ----
const Isi = ({ nama }) => {
  if (nama === "ios:beranda") return <><Beranda /><StatusIOS warna="#fff" /></>;
  if (WA_LAYAR[nama]) { const L = WA_LAYAR[nama]; return <><L /><StatusIOS balik={nama === "wa:serah" ? null : "Safari"} /></>; }
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: HP.w, height: WEB_Y, background: ATAS_WEB[nama] || "#fff" }} />
      <StatusIOS balik="WhatsApp" />
      <Img src={staticFile(`kirim-undangan/layar/${nama}.png`)} style={{ position: "absolute", left: 0, top: WEB_Y, width: HP.w, height: WEB_H }} />
      <Safari url={nama === "undangan-sampul" ? LINK_TAMU : DASHBOARD} />
    </>
  );
};
const LAMA = { pudar: 8, geser: 11, kembali: 11, gulir: 9, aplikasi: 16 };
// Buka aplikasi seperti iOS: jendela aplikasi melebar dari ikon di tengah layar, ikon memudar, layar lama mundur.
const IKON = 64;
function Layar() {
  const f = useCurrentFrame();
  const i = Math.max(0, LAYAR.findLastIndex(([s]) => fr(s) <= f));
  const [s, nama, efek] = LAYAR[i];
  const p = LAMA[efek] ? antara(f, fr(s), fr(s) + LAMA[efek], 0, 1, efek === "pudar" ? halus : lepas) : 1;
  const lama = i > 0 && p < 1 ? LAYAR[i - 1][1] : null;
  const ix = (HP.w - IKON) / 2 * (1 - p), iy = (HP.h - IKON) / 2 * (1 - p), ir = 14 + (BINGKAI.r - 14) * p;
  const gaya = {
    pudar: [{}, { opacity: p }],
    geser: [{ transform: `translateX(${-p * 100}px)` }, { transform: `translateX(${(1 - p) * HP.w}px)`, boxShadow: "-10px 0 24px rgba(0,0,0,.18)" }],
    kembali: [{ transform: `translateX(${p * HP.w}px)`, boxShadow: "-10px 0 24px rgba(0,0,0,.18)", zIndex: 1 }, { transform: `translateX(${-(1 - p) * 100}px)` }],
    gulir: [{ transform: `translateY(${-p * 60}px)`, opacity: 1 - p }, { transform: `translateY(${(1 - p) * 60}px)`, opacity: p }],
    aplikasi: [{ transform: `scale(${1 - 0.08 * p})`, filter: `brightness(${1 - 0.35 * p})`, borderRadius: BINGKAI.r, overflow: "hidden" },
      { clipPath: `inset(${iy}px ${ix}px ${iy}px ${ix}px round ${ir}px)`, transform: `scale(${0.94 + 0.06 * p})` }],
  }[efek] || [{}, {}];
  return (
    <>
      {lama ? <div style={{ position: "absolute", inset: 0, background: "#fff", ...gaya[0] }}><Isi nama={lama} /></div> : null}
      <div style={{ position: "absolute", inset: 0, background: "#fff", ...(lama ? gaya[1] : {}) }}><Isi nama={nama} /></div>
      {lama && efek === "aplikasi" ? (
        <Img src={IKON_WA} style={{ position: "absolute", left: ix, top: iy, width: HP.w - 2 * ix, height: HP.h - 2 * iy, objectFit: "contain", borderRadius: ir, zIndex: 2,
          opacity: 1 - antara(f, fr(s), fr(s) + LAMA.aplikasi * 0.6, 0, 1) }} />
      ) : null}
    </>
  );
}

// ---- Sisipan di kanvas (di luar ponsel, di dalam zona aman) ----
const LEBAR = AMAN.x1 - AMAN.x0;
const muncul = (f, dari, sampai) => antara(f, fr(dari), fr(dari) + 9, 0, 1, lepas) * (1 - antara(f, fr(sampai), fr(sampai) + 7, 0, 1));
// Kartu di atas ponsel; `redup` menyamarkan ponsel di belakangnya supaya pesan kartu yang dibaca.
const Kartu = ({ dari, sampai, y, children, redup }) => {
  const f = useCurrentFrame();
  if (f < fr(dari) || f > fr(sampai) + 8) return null;
  const o = muncul(f, dari, sampai);
  return (
    <>
      {redup ? <div style={{ position: "absolute", inset: 0, background: `rgba(251,247,242,${0.78 * o})` }} /> : null}
      <div style={{ position: "absolute", left: AMAN.x0, top: y, width: LEBAR, opacity: o, transform: `translateY(${(1 - o) * 24}px) scale(${0.97 + 0.03 * o})`,
        borderRadius: 30, background: WARNA.kertas, border: `1.5px solid ${WARNA.garis}`, boxShadow: "0 24px 56px rgba(43,26,7,.16), 0 4px 12px rgba(43,26,7,.08)", padding: "32px 34px" }}>{children}</div>
    </>
  );
};
const Pil = ({ ikon, teks, dari, sampai, x, y }) => {
  const f = useCurrentFrame();
  if (f < fr(dari) || f > fr(sampai) + 8) return null;
  const o = muncul(f, dari, sampai);
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 14, padding: "18px 26px 18px 20px", borderRadius: 999, background: WARNA.kertas,
      border: `1.5px solid ${WARNA.garis}`, color: WARNA.coklat, font: `800 28px ${HURUF}`, opacity: o, transform: `translateX(-50%) translateY(${(1 - o) * 18}px) scale(${0.94 + 0.06 * o})`,
      boxShadow: "0 14px 32px rgba(43,26,7,.16)", whiteSpace: "nowrap" }}>
      <Ikon n={ikon} s={36} c={WARNA.oranyeTua} />{teks}
    </div>
  );
};
// Potongan tangkapan layar lain (px CSS sumbernya), diperbesar ke `lebar` px kanvas.
const Potongan = ({ nama, kotak: [x, y, w, h], lebar }) => {
  const k = lebar / w, vw = (layar.layar[nama].viewport || layar.viewport)[0];
  return (
    <div style={{ width: lebar, height: h * k, overflow: "hidden", position: "relative", borderRadius: 18, boxShadow: `0 0 0 1.5px ${WARNA.garis}` }}>
      <Img src={staticFile(`kirim-undangan/layar/${nama}.png`)} style={{ position: "absolute", left: -x * k, top: -y * k, width: vw * k }} />
    </div>
  );
};
const Teks2 = ({ children, kecil }) => <div style={{ font: `${kecil ? 700 : 800} ${kecil ? 28 : 36}px/1.3 ${kecil ? HURUF : HURUF}`, color: kecil ? WARNA.abu : WARNA.coklat }}>{children}</div>;

// MacBook: bingkai dari model AR Apple (public/mockup/macbook.png), layar 1280x828 pt: bilah menu macOS, bilah Safari,
// lalu tangkapan layar dashboard 1280x751.
const MB = mockup.macbook, MB_PT = MB.layar.w / 1280;
const MAC = { w: 1280, h: MB.layar.h / MB_PT, menu: 25, safari: 52, x: MB.layar.x / MB_PT, y: MB.layar.y / MB_PT, r: MB.layar.r / MB_PT };
const MenuMac = () => (
  <div style={{ position: "absolute", left: 0, top: 0, width: MAC.w, height: MAC.menu, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px 0 20px",
    background: "rgba(232,226,219,.96)", font: `400 13px ${IOS}`, color: "#1d1d1f" }}>
    <div style={{ display: "flex", gap: 15, alignItems: "center" }}>
      <span style={{ fontSize: 15 }}>{"\uF8FF"}</span><b style={{ fontWeight: 700 }}>Safari</b>
      {["Arsip", "Edit", "Tampilan", "Riwayat", "Markah", "Jendela", "Bantuan"].map((m) => <span key={m}>{m}</span>)}
    </div>
    <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
      <svg width="24" height="12" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.8" fill="none" stroke="#1d1d1f" strokeOpacity=".5" /><rect x="2" y="2" width="16" height="9" rx="2.4" fill="#1d1d1f" /></svg>
      <IkonIOS n="cari" s={14} c="#1d1d1f" w={2.4} />
      <span>Rab 25 Nov 19.42</span>
    </div>
  </div>
);
const SafariMac = () => (
  <div style={{ position: "absolute", left: 0, top: MAC.menu, width: MAC.w, height: MAC.safari, display: "flex", alignItems: "center", gap: 10, padding: "0 18px",
    background: "#f3f1ee", borderBottom: ".5px solid rgba(0,0,0,.16)" }}>
    {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c }} />)}
    <span style={{ width: 22 }} />
    <IkonIOS n="kembali" s={18} c="#6e6e73" w={2.2} />
    <IkonIOS n="kembali" s={18} c="#c7c7cc" w={2.2} style={{ transform: "scaleX(-1)" }} />
    <div style={{ flex: 1 }} />
    <div style={{ width: 520, height: 34, borderRadius: 10, background: "rgba(0,0,0,.06)", display: "flex", alignItems: "center", justifyContent: "center", font: `500 14px ${IOS}`, color: "#1d1d1f" }}>nikahin.id</div>
    <div style={{ flex: 1 }} />
    <IkonIOS n="muat" s={17} c="#6e6e73" w={2} />
    <span style={{ width: 120 }} />
  </div>
);
function Laptop() {
  const f = useCurrentFrame(), dari = t("laptop") - 0.15, sampai = t("panel") - 0.3;
  if (f < fr(dari) || f > fr(sampai) + 8) return null;
  const o = muncul(f, dari, sampai);
  // Seluruh MacBook selebar zona aman, lalu diperbesar ke tombol tambah (pt layar MacBook).
  const s0 = LEBAR / (MB.w / MB_PT), tinggi = (MB.h / MB_PT) * s0;
  const x0 = AMAN.x0, y0 = (PANGGUNG.y0 + PANGGUNG.y1) / 2 - tinggi / 2;
  const [bx, by, bw, bh] = layar.layar["kirim-laptop"].kotak.tambah;
  const fokus = [bx + bw / 2, by + bh / 2 + MAC.menu + MAC.safari];
  const kMaks = 2, k = antara(f, fr(dari) + 16, fr(dari) + 40, 1, kMaks, halus), p = (k - 1) / (kMaks - 1);
  const F = [x0 + (MAC.x + fokus[0]) * s0, y0 + (MAC.y + fokus[1]) * s0], C = [W / 2, (PANGGUNG.y0 + PANGGUNG.y1) / 2 - 60];
  const T = [C[0] * p + F[0] * (1 - p) - k * F[0], C[1] * p + F[1] * (1 - p) - k * F[1]];
  const s = s0 * k, ke = (X, Y) => [(X - T[0]) / k, (Y - T[1]) / k].map((v, i) => (v - [x0, y0][i]) / s0 - [MAC.x, MAC.y][i]);
  const [lx0, ly0] = ke(PANGGUNG.x0, PANGGUNG.y0), [lx1, ly1] = ke(PANGGUNG.x1, PANGGUNG.y1);
  return (
    <div style={{ position: "absolute", inset: 0, background: `rgba(251,247,242,${o})` }}>
      <div style={{ position: "absolute", inset: 0, opacity: o, ...MASKER }}>
        <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${T[0]}px, ${T[1] + (1 - o) * 40}px) scale(${k})` }}>
          <div style={{ position: "absolute", left: x0, top: y0, width: MB.w / MB_PT, height: MB.h / MB_PT, transform: `scale(${s0})`, transformOrigin: "0 0" }}>
            <div style={{ position: "absolute", left: MAC.x, top: MAC.y, width: MAC.w, height: MAC.h, overflow: "hidden", borderRadius: MAC.r, background: "#fff" }}>
              <MenuMac />
              <SafariMac />
              <Img src={staticFile("kirim-undangan/layar/kirim-laptop.png")} style={{ position: "absolute", left: 0, top: MAC.menu + MAC.safari, width: MAC.w, height: MAC.h - MAC.menu - MAC.safari }} />
              <Kamera.Provider value={{ s, lihat: [lx0, ly0, lx1, ly1], ukuran: [MAC.w, MAC.h] }}>
                <Sorot kotak={[bx, fokus[1] - bh / 2, bw, bh]} label="Di laptop: di atas daftar" dari={fr(dari) + 40} sampai={fr(sampai)} sisi="bawah" radius={999} redup={false} />
              </Kamera.Provider>
            </div>
            <Img src={staticFile("mockup/macbook.png")} style={{ position: "absolute", left: 0, top: 0, width: MB.w / MB_PT, height: MB.h / MB_PT }} />
          </div>
        </div>
      </div>
    </div>
  );
}
function Sisipan() {
  const lapRow = layar.layar["daftar-laptop"].kotak.dewi, lapSub = layar.layar["daftar-laptop"].kotak["dewi-sub"];
  const BARIS = [lapRow[0], lapRow[1], lapSub[0] + lapSub[2] - lapRow[0] + 14, lapRow[3]];
  const cariTop = layar.layar["daftar-cari"].kotak.cari;
  const sari = layar.layar["daftar-cari"].kotak.sari;
  const dalam = LEBAR - 68;
  return (
    <>
      <Laptop />
      <Kartu dari={t("kategori", "tampil") - 0.1} sampai={t("kategori", "dicari") - 0.15} y={880}>
        <Teks2 kecil>Di daftar tamu, tampil di bawah nama:</Teks2>
        <div style={{ height: 16 }} />
        <Potongan nama="daftar-laptop" kotak={BARIS} lebar={dalam} />
      </Kartu>
      <Kartu dari={t("kategori", "dicari") - 0.1} sampai={t("kategori", null, true) + 0.2} y={760}>
        <Teks2 kecil>Bisa dicari, misalnya Sahabat:</Teks2>
        <div style={{ height: 16 }} />
        <Potongan nama="daftar-cari" kotak={[0, cariTop[1] - 12, HP.w, sari[1] + sari[3] - cariTop[1] + 18]} lebar={dalam} />
      </Kartu>
      <Kartu dari={t("jumlah", "catatan") - 0.1} sampai={t("jumlah", null, true) + 0.2} y={880}>
        <Teks2 kecil>Hanya catatan, tampil sebagai "2 orang":</Teks2>
        <div style={{ height: 16 }} />
        <Potongan nama="daftar-laptop" kotak={BARIS} lebar={dalam} />
      </Kartu>
      <Pil ikon="catatan" teks="Catatan" dari={t("sumber", "catatan")} sampai={t("csv") - 0.2} x={W / 2} y={990} />
      <Pil ikon="chat" teks="Daftar bernomor WhatsApp" dari={t("sumber", "bernomor")} sampai={t("csv") - 0.2} x={W / 2} y={1080} />
      <Pil ikon="tabel" teks="Kolom Excel" dari={t("sumber", "kolom")} sampai={t("csv") - 0.2} x={W / 2} y={1170} />
      <Kartu dari={t("penting") - 0.05} sampai={t("pilih-tamu") - 0.35} y={500} redup>
        <div style={{ width: 84, height: 84, borderRadius: 24, background: WARNA.krem, display: "grid", placeItems: "center", marginBottom: 22 }}><Ikon n="hp" s={50} c={WARNA.oranyeTua} /></div>
        <Teks2>Daftar tamu dan status terkirim hanya tersimpan di HP yang dipakai</Teks2>
        <div style={{ height: 22 }} />
        <Cek dari={t("satu-hp", "HP")} teks="Kirim dari HP dan browser yang sama" />
        <Cek dari={t("satu-hp", "simpan")} teks="Simpan juga daftar tamunya di catatan" />
      </Kartu>
      <Pil ikon="lihat" teks="Tercatat di Pelacakan saat dibuka" dari={t("link", "tercatat") - 0.1} sampai={t("khusus") - 0.15} x={W / 2} y={1150} />
      <Pil ikon="gembok" teks="Undangan khusus: hanya lewat link pribadi" dari={t("khusus") - 0.05} sampai={t("teks") - 0.35} x={W / 2} y={1150} />
      <Kartu dari={t("lewati") - 0.05} sampai={t("kartu") - 0.3} y={700} redup>
        <div style={{ width: 84, height: 84, borderRadius: 24, background: WARNA.krem, display: "grid", placeItems: "center", marginBottom: 22 }}><Ikon n="telepon" s={44} c={WARNA.oranyeTua} /></div>
        <Teks2>Tamu sudah punya nomor? Chat-nya langsung terbuka, langkah ini terlewati.</Teks2>
      </Kartu>
      <Selesai />
    </>
  );
}
const Cek = ({ dari, teks }) => {
  const f = useCurrentFrame(), o = antara(f, fr(dari), fr(dari) + 8, 0, 1, lepas);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "12px 0", opacity: o, transform: `translateX(${(1 - o) * 16}px)` }}>
      <Ikon n="selesai" s={38} c={WARNA.hijau} /><span style={{ font: `700 30px/1.3 ${HURUF}`, color: WARNA.coklat }}>{teks}</span>
    </div>
  );
};
function Selesai() {
  const f = useCurrentFrame(), a = fr(t("selesai") - 0.05), b = fr(BALIK - 0.1);
  if (f < a || f > b + 8) return null;
  const o = antara(f, a, a + 10, 0, 1, lepas) * (1 - antara(f, b, b + 8, 0, 1));
  return (
    <div style={{ position: "absolute", left: W / 2 - 130, top: PUSAT.y - 130, width: 260, height: 260, borderRadius: "50%", background: WARNA.hijau, display: "grid", placeItems: "center",
      opacity: o, transform: `scale(${0.6 + 0.4 * o})`, boxShadow: "0 26px 60px rgba(31,122,63,.35)" }}>
      <svg width="150" height="150" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="22" strokeDashoffset={22 * (1 - antara(f, a + 4, a + 16, 0, 1))} /></svg>
    </div>
  );
}

// ---- Efek suara (Boombox Studio, src/ui/sfx.json): ketukan, ketikan, langkah baru, pindah layar/aplikasi, kirim ----
// Narasi -16 LUFS; efek sekitar 8-14 dB di bawah puncak suara supaya terdengar tanpa menutupi narasi.
const VOLUME = { ketuk: 0.4, ketik: 0.3, tempel: 0.45, langkah: 0.35, layar: 0.3, aplikasi: 0.55, muncul: 0.35, kirim: 0.38, notifikasi: 0.4, menu: 0.35, selesai: 0.6 };
const JUDUL = [
  [0, null, "Cara kirim undangan ke tamu"],
  [t("masuk"), 1, "Masuk dashboard"],
  [t("tab-kirim"), 2, "Buka tab Kirim"],
  [t("tempel"), 3, "Tempel daftar tamu"],
  [t("guna"), 3, "Gunanya tiap bagian"],
  [t("sumber"), 3, "Tempel lalu simpan"],
  [t("penting"), null, "Penting"],
  [t("pilih-tamu"), 4, "Kirim ke tamu"],
  [t("wa"), 5, "Di WhatsApp"],
  [t("selesai"), null, "Selesai!"],
  [t("saringan"), null, "Tamu berikutnya"],
];
const BUNYI = [
  ...JUDUL.slice(1).map(([s]) => [s, "langkah"]),
  ...LAYAR.filter(([, , e]) => e === "geser" || e === "kembali").map(([s]) => [s, "layar"]),
  ...LAYAR.filter(([, , e]) => e === "aplikasi").map(([s]) => [s, "aplikasi"]),
  ...KETUK.map(([, s]) => [s - 0.02, "ketuk"]),
  [t("masuk", "kedua") + 0.08, "ketuk"], [TEMPEL, "ketuk"], [TEMPEL_KETUK, "ketuk"], [TEMPEL_KETUK + 0.1, "tempel"],
  [t("cari", "pilih") + 0.03, "ketuk"], [KIRIM_WA, "ketuk"], [KIRIM_WA + 0.12, "kirim"],
  ...PIN_KETIK.map((s) => [s - 0.02, "ketik"]),
  ...[0, 1, 2, 3, 4].map((i) => [CARI_MULAI + (i * HURUF_CARI) / FPS - 0.02, "ketik"]),
  [t("simpan", "Simpan") + 0.3, "notifikasi"], [t("siap", "kirim") + 0.3, "notifikasi"], [t("batal", "titik") + 0.35, "menu"],
  [t("kategori", "tampil") - 0.1, "muncul"], [t("kategori", "dicari") - 0.1, "muncul"], [t("jumlah", "catatan") - 0.1, "muncul"], [t("penting") - 0.05, "muncul"],
  [t("sumber", "catatan"), "muncul"], [t("sumber", "bernomor"), "muncul"], [t("sumber", "kolom"), "muncul"], [t("lewati") - 0.05, "muncul"],
  [t("link", "tercatat") - 0.1, "muncul"], [t("khusus") - 0.05, "muncul"], [t("laptop") - 0.15, "muncul"],
  [t("selesai") - 0.05, "selesai"],
];
const Bunyi = () => BUNYI.map(([s, jenis], i) => (
  <Sequence key={i} from={Math.max(0, fr(s))} durationInFrames={fr(2)} layout="none">
    <Audio src={staticFile("sounds/" + SFX[jenis])} volume={VOLUME[jenis]} />
  </Sequence>
));

// ---- Komposisi ----
const POTONGAN = potong(waktu.kalimat);
export const DURASI = Math.ceil((waktu.durasi + 1.2) * FPS);

export const KirimUndangan = () => {
  const f = useCurrentFrame();
  const awal = antara(f, 0, 16, 0, 1, lepas);
  const kam = kamera(f);
  return (
    <AbsoluteFill style={{ background: WARNA.latar, fontFamily: HURUF }}>
      <Audio src={staticFile("kirim-undangan/narasi.mp3")} />
      <Bunyi />
      <div style={{ position: "absolute", left: W / 2 - 520, top: PUSAT.y - 520, width: 1040, height: 1040, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,111,30,.10), rgba(255,111,30,0))" }} />
      <div style={{ position: "absolute", inset: 0, ...MASKER }}>
        <div style={{ position: "absolute", inset: 0, transformOrigin: "0 0", transform: kam.transform, opacity: awal }}>
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - awal) * 60}px)` }}>
            <Kamera.Provider value={{ s: kam.s, lihat: kam.lihat, ukuran: [HP.w, HP.h] }}>
              <Ponsel>
                <Layar />
                {SOROT.map(([k, label, a, b], i) => <Sorot key={i} kotak={k} label={label} dari={fr(a)} sampai={fr(b)} />)}
                {KETUK.map(([k, pada], i) => { const [x, y] = tengah(k); return <Ketuk key={i} x={x} y={y} pada={fr(pada)} />; })}
                <Ketuk x={TITIK_TEMPEL[0]} y={TITIK_TEMPEL[1]} pada={fr(TEMPEL)} tahan={fr(0.45)} />
                <Tempel />
                <Ketuk x={TITIK_TEMPEL[0] - 6} y={TITIK_TEMPEL[1] - 43} pada={fr(TEMPEL_KETUK)} />
              </Ponsel>
            </Kamera.Provider>
          </div>
        </div>
      </div>
      <Sisipan />
      <Judul daftar={JUDUL} total={5} wa={layarPada(f).startsWith("wa:")} />
      <Teks potongan={POTONGAN} />
    </AbsoluteFill>
  );
};
