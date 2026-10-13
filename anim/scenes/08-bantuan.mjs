// Bantuan: menu Bantuan (help.jsx), Izin domain (CSP), mencari pesan galat, masa aktif, dan kirim laporan ke admin.
import { C, browser, editor, railAt, rect, text, para, line, circle, button, badge, card, ring, note, phone, toast } from "../lib.mjs";

const X = 40, Y = 24, BW = 880, BH = 500;
const TOP = Y + 76;
// Dialog Bantuan menutupi area panel NikahKit (kanan rel, kiri pratinjau).
const DX = X + 66, DY = TOP + 86, DW = 392, DH = BH - 164;
const BANTUAN = railAt(X, Y, "Bantuan", BH);

const shell = (url = "app.scalev.com/pages/365671", o = {}) => [browser(X, Y, BW, BH, url, { tab: "Scalev" }), editor(X, Y, BW, BH, { railActive: "Konten", ...o })];
const panelHead = (title) => text(X + 80, TOP + 112, title, { size: 16, weight: 600 });

// Kerangka dialog Bantuan (judul + tombol tutup). Isi ditumpuk per tampilan.
const dlg = (...body) => rect(DX, DY, DW, DH, { r: 0, fill: C.paper }) + line(DX, DY, DX + DW, DY) +
  text(DX + 20, DY + 30, "Bantuan", { size: 16, weight: 600 }) + text(DX + DW - 26, DY + 30, "×", { size: 20, fill: C.muted }) +
  line(DX, DY + 44, DX + DW, DY + 44) + body.join("");
const MARK = { ok: ["✓", C.okTint, C.ok], info: ["i", C.svTint, C.svDark], bad: ["!", C.badTint, C.bad] };
const row = (y, kind, label, detail) => {
  const [ch, bg, fg] = MARK[kind];
  return circle(DX + 28, y - 4, 8, { fill: bg }) + text(DX + 28, y, ch, { size: 11, weight: 700, fill: fg, anchor: "middle" }) +
    text(DX + 44, y, label, { size: 12, weight: 600 }) + (detail ? text(DX + 44, y + 15, detail, { size: 11, fill: C.muted }) : "");
};

// Tampilan A: bagian atas Bantuan.
const viewTop = dlg(
  text(DX + 20, DY + 70, "Versi 0.7.59", { size: 12 }),
  button(DX + DW - 112, DY + 54, "Cek update", { variant: "ghost", w: 92, h: 26, size: 12 }),
  text(DX + 20, DY + 94, "Sudah versi terbaru.", { size: 11, fill: C.muted }),
  rect(DX + 16, DY + 104, DW - 32, 40, { r: 6, fill: C.warnTint }),
  para(DX + 26, DY + 120, ["1 perlu perhatian. Muat ulang editor;", "bila tetap, kirim laporan."], { size: 12, lh: 15 }),
  para(DX + 20, DY + 162, ['Terbit tertahan "not finished previewing"? Muat ulang', "editor, lalu tekan Simpan & Terbitkan."], { size: 11, lh: 14, fill: C.muted }),
  row(DY + 202, "ok", "Hanya NikahKit yang aktif"),
  row(DY + 224, "ok", "Versi editor Scalev"),
  row(DY + 246, "ok", "Data undangan terbaca"),
  row(DY + 268, "ok", "Klik di pratinjau"),
  row(DY + 290, "ok", "Kode halaman cocok dengan NikahKit"),
  row(DY + 312, "bad", "Penyimpanan ucapan dan RSVP", "simpan halaman di Scalev dulu")
);
// Tampilan B: setelah digulir ke bawah.
const viewBottom = dlg(
  row(DY + 72, "ok", "Klik di pratinjau"),
  row(DY + 94, "ok", "Kode halaman cocok dengan NikahKit"),
  row(DY + 116, "bad", "Penyimpanan ucapan dan RSVP", "simpan halaman di Scalev dulu"),
  row(DY + 154, "ok", "Izin domain di tab Security"),
  row(DY + 176, "ok", "Penulisan ke editor"),
  button(DX + 20, DY + 194, "Salin laporan", { variant: "ghost", w: 130, h: 30, size: 13 }),
  button(DX + 160, DY + 194, "Kirim lewat WhatsApp", { variant: "quiet", w: 180, h: 30, size: 13 }),
  text(DX + 20, DY + 272, "Izin domain (CSP)", { size: 13, weight: 600 }),
  rect(DX + 16, DY + 282, DW - 32, 26, { r: 6, fill: C.soft }), text(DX + 26, DY + 299, "Tidak butuh izin tambahan.", { size: 12 }),
  text(DX + 20, DY + 328, "▸ Lihat isi laporan", { size: 12, fill: C.svDark, weight: 600 })
);
const hintAt = (s, o = {}) => rect(DX + 16, DY + 230, 300, 22, { r: 0, fill: C.paper }) + text(DX + 20, DY + 246, s, { size: 12, fill: o.fill ?? C.muted, weight: o.weight });
const SALIN = [DX + 85, DY + 209], WA = [DX + 250, DY + 209], LIHAT = [DX + 80, DY + 324];
// Tampilan C: isi laporan dibuka.
const REPORT = ["Laporan NikahKit 0.7.59", "Waktu: 2026-10-14T03:12:45.000Z", "Halaman: /pages/365671", "Build Scalev: e5cbe30-37178432877-1",
  "Browser: Mozilla/5.0 ... Chrome/...", "", "[OK] Aplikasi Scalev (Nuxt/Vue)", "...", "[OK] Klik di pratinjau",
  "[OK] Kode halaman cocok dengan NikahKit", "[X] Penyimpanan ucapan dan RSVP: simpan", "  halaman di Scalev dulu",
  "[OK] Izin domain di tab Security", "[OK] Penulisan ke editor"];
const viewReport = dlg(
  text(DX + 20, DY + 68, "▾ Lihat isi laporan", { size: 12, fill: C.svDark, weight: 600 }),
  rect(DX + 16, DY + 80, DW - 32, 236, { r: 6, fill: C.soft }),
  ...REPORT.map((l, i) => text(DX + 26, DY + 100 + i * 16.5, l, { size: 10.5, mono: true, fill: l.startsWith("[X]") ? C.bad : C.ink }))
);

// Izin domain (CSP): daftar domain dengan status.
const BADGE = { ok: [C.okTint, C.ok], todo: [C.warnTint, C.warn] };
const cspRow = (y, origin, status, kind, why) => {
  const w = Math.round(status.length * 6.6 + 16);
  return text(DX + 20, y, origin, { size: 11, mono: true }) + badge(DX + DW - 18 - w, y - 14, status, { fill: BADGE[kind][0], fg: BADGE[kind][1] }) +
    text(DX + 20, y + 18, why, { size: 11, fill: C.muted }) + line(DX + 16, y + 30, DX + DW - 16, y + 30);
};
const cspView = dlg(
  text(DX + 20, DY + 72, "Izin domain (CSP)", { size: 13, weight: 600 }),
  cspRow(DY + 104, "https://www.youtube.com", "Ditambahkan otomatis", "ok", "Musik atau video YouTube · Skrip (script_src)"),
  cspRow(DY + 150, "https://www.youtube.com", "Sudah diizinkan", "ok", "Musik atau video YouTube · Bingkai (iframe) (frame_src)"),
  button(DX + 20, DY + 250, "Periksa ulang", { variant: "ghost", w: 120, h: 30, size: 13 }),
  button(DX + 152, DY + 250, "Salin domain kurang", { variant: "quiet", w: 170, h: 30, size: 13 })
);
const cspBad = rect(DX + 10, DY + 180, DW - 20, 44, { r: 0, fill: C.paper }) +
  cspRow(DY + 196, "https://foto.contoh.com", "Perlu ditambah manual", "todo", "Foto dari luar Media Scalev · Gambar (img_src)");
const cspFixed = rect(DX + 10, DY + 180, DW - 20, 44, { r: 0, fill: C.paper }) +
  cspRow(DY + 196, "https://foto.contoh.com", "Sudah diizinkan", "ok", "Foto dari luar Media Scalev · Gambar (img_src)");
const cspMsg = (s) => rect(DX + 16, DY + 290, 340, 24, { r: 0, fill: C.paper }) + text(DX + 20, DY + 306, s, { size: 12, fill: C.ok, weight: 600 });
const tabAt = (i) => [X + 18 + i * 74 + 22, TOP + 66];

// Gerbang akses (AccessGate): panel tanpa rel.
const gate = (title, hint, warn) => rect(X + 1, TOP + 85, 458, BH - 162, { r: 0, fill: C.paper }) +
  text(X + 20, TOP + 116, "NikahKit", { size: 16, weight: 600 }) + line(X, TOP + 130, X + 460, TOP + 130) +
  rect(X + 16, TOP + 144, 428, 56, { r: 6, fill: warn ? C.warnTint : C.soft }) +
  text(X + 28, TOP + 166, title, { size: 13, weight: 700 }) + text(X + 28, TOP + 186, hint, { size: 12 });

// Halaman panduan "Pesan galat" (tabel).
const PG = [["Sesi berakhir. Masuk lagi.", "Login NikahKit habis", "Masuk dengan Google lagi"],
  ["Login dibatalkan.", "Jendela Google ditutup", "Klik Masuk dengan Google lagi"],
  ["Kode salah.", "Kode uji tidak dikenali", "Cek ulang kode dari tim"],
  ["Pakai tautan https.", "Tautan diawali http://", "Ganti jadi https://"],
  ["PIN salah.", "PIN dashboard keliru", "Lihat PIN di jendela NikahKit"]];
const COLS = [X + 30, X + 330, X + 580];
const TY = TOP + 150;
const table = [
  text(X + 30, TOP + 52, "Pesan galat", { size: 24, weight: 700 }),
  text(X + 30, TOP + 80, "Cari pesan yang kamu lihat, lalu ikuti kolom ketiga.", { size: 13, fill: C.muted }),
  rect(X + 20, TY - 32, BW - 40, 34, { r: 0, fill: C.soft }),
  ...["Pesan (verbatim)", "Artinya", "Yang harus dilakukan"].map((h, i) => text(COLS[i], TY - 10, h, { size: 13, weight: 700 })),
  ...PG.flatMap((r, j) => [line(X + 20, TY + 2 + j * 44, X + BW - 20, TY + 2 + j * 44),
    ...r.map((c, i) => text(COLS[i], TY + 28 + j * 44, c, { size: 13, weight: i === 0 ? 600 : undefined }))])
];

// Garis waktu masa aktif.
const TLX = X + 40, TLY = Y + 120, SEG = [[0, 360, "Aktif", C.ok], [360, 220, "Tenggang 7 hari", C.warn], [580, 220, "Habis", C.bad]];
const timeline = [
  text(X + 40, Y + 70, "Masa aktif paket NikahKit", { size: 20, weight: 700 }),
  ...SEG.map(([dx, w, l, c]) => rect(TLX + dx, TLY, w - 4, 36, { r: 6, fill: c }) + text(TLX + dx + (w - 4) / 2, TLY + 23, l, { size: 14, weight: 700, fill: C.paper, anchor: "middle" })),
  text(TLX + 356, TLY + 56, "tanggal berakhir", { size: 12, fill: C.muted, anchor: "middle" }), line(TLX + 358, TLY - 6, TLX + 358, TLY + 42, { stroke: C.ink, sw: 2 }),
  text(TLX + 578, TLY + 56, "+7 hari", { size: 12, fill: C.muted, anchor: "middle" }), line(TLX + 578, TLY - 6, TLX + 578, TLY + 42, { stroke: C.ink, sw: 2 })
];
const pill = (x, y, w, h, lines, o = {}) => rect(x, y, w, h, { r: 8, fill: o.fill ?? C.soft, stroke: o.stroke }) + para(x + 14, y + 22, lines, { size: 13, lh: 18, fill: o.fg ?? C.ink });
const PX = X + 600, PY = Y + 210; // ponsel tamu

// WhatsApp admin.
const WX = X + 300, WY = Y + 30, WW = 560, WH = 470;
const waWin = browser(WX, WY, WW, WH, "wa.me/6282175274118", { tab: "WhatsApp" }) +
  rect(WX + 1, WY + 77, WW - 2, 44, { r: 0, fill: C.waDark }) + circle(WX + 28, WY + 99, 13, { fill: "#dfe5e7" }) +
  text(WX + 50, WY + 104, "+62 821-7527-4118", { size: 14, weight: 600, fill: C.paper }) +
  rect(WX + 1, WY + 121, WW - 2, WH - 122, { r: 0, fill: "#efeae2" });
const CB = { x: WX + 16, y: WY + 262, w: WW - 80, h: 190 };
const composer = rect(CB.x, CB.y, CB.w, CB.h, { r: 10, fill: C.paper, stroke: C.line }) +
  para(CB.x + 14, CB.y + 24, ["Halo Nikahin, NikahKit saya bermasalah.", "", "Laporan NikahKit 0.7.59", "Waktu: 2026-10-14T03:12:45.000Z", "[X] Penyimpanan ucapan dan RSVP: simpan", "halaman di Scalev dulu"], { size: 12, lh: 17 }) +
  circle(WX + WW - 34, CB.y + CB.h - 20, 18, { fill: C.waDark }) + text(WX + WW - 34, CB.y + CB.h - 15, "➤", { size: 15, fill: C.paper, anchor: "middle" });
const extra = rect(CB.x + 10, CB.y + 124, CB.w - 20, 40, { r: 0, fill: C.paper }) +
  para(CB.x + 14, CB.y + 138, ["Saya klik Simpan, lalu muncul tanda !. Halaman:", "https://contoh.myscalev.com/rani-dimas  [screenshot]"], { size: 12, lh: 17, fill: C.svDark });
const sent = rect(WX + WW - 300, WY + 140, 280, 64, { r: 10, fill: C.waTint }) +
  para(WX + WW - 288, WY + 162, ["Halo Nikahin, NikahKit saya bermasalah.", "Laporan NikahKit 0.7.59 ...", "[screenshot]  ✓✓"], { size: 12, lh: 16 });

export const scenes = {
  "bantuan-salin-laporan": {
    title: "Membuka Bantuan dan menyalin laporan",
    base: [...shell(), panelHead("Konten")],
    els: {
      a: viewTop, b: viewBottom, c: viewReport,
      ringNote: ring(DX + 16, DY + 104, DW - 32, 40),
      ringRow: ring(DX + 16, DY + 301, DW - 32, 30),
      hintA: hintAt("Tanpa data undangan."),
      hintOk: hintAt("Tersalin.", { fill: C.ok, weight: 600 })
    },
    steps: [
      { caption: "Di editor Scalev, klik Bantuan di bagian bawah rel NikahKit.", at: BANTUAN, click: true, show: ["a"], dur: 3.4 },
      { caption: "Baca baris status di atas: di sini tertulis 1 perlu perhatian.", show: ["ringNote"], dur: 3.4 },
      { caption: "Tanda ! artinya bermasalah. Penyebabnya tertulis di bawah namanya.", hide: ["ringNote"], show: ["ringRow"], dur: 3.8 },
      { caption: "Gulir ke bawah, lalu klik Salin laporan.", hide: ["ringRow", "a"], show: ["b", "hintA"], at: SALIN, click: true },
      { caption: "Muncul Tersalin. Laporan siap ditempel ke chat admin.", hide: ["hintA"], show: ["hintOk"], dur: 3.4 },
      { caption: "Mau lihat isinya dulu? Klik Lihat isi laporan.", at: LIHAT, click: true, dur: 2.8 },
      { caption: "Isinya hanya data teknis, tanpa nama atau data undangan.", hide: ["b", "hintOk"], show: ["c"], dur: 4 }
    ]
  },

  "bantuan-izin-domain": {
    title: "Memperbaiki Izin domain (CSP) dari Bantuan",
    base: [...shell(), panelHead("Konten")],
    els: {
      warn: rect(X + 80, TOP + 126, 364, 40, { r: 6, fill: C.warnTint }) + para(X + 90, TOP + 142, ["Izinkan di tab Security: https://foto.contoh.com", "(img_src)."], { size: 12, lh: 15 }),
      csp: cspView, bad: cspBad,
      ringOk: ring(DX + 16, DY + 84, DW - 32, 84),
      ringBad: ring(DX + 16, DY + 180, DW - 32, 44),
      copied: cspMsg("Tersalin. Tempel di tab Security."),
      sec: rect(X + 1, TOP + 85, 458, BH - 162, { r: 0, fill: C.paper }) + rect(X + 18 + 4 * 74 - 2, TOP + 77, 64, 6, { r: 0, fill: C.paper }) +
        rect(X + 18 + 2 * 74, TOP + 78, 56, 4, { r: 2, fill: C.sv }) +
        text(X + 24, TOP + 120, "Tab Security Scalev", { size: 14, weight: 600 }) +
        rect(X + 24, TOP + 136, 410, 60, { r: 6, fill: C.soft, stroke: C.line }) + text(X + 36, TOP + 170, "img_src: https://foto.contoh.com", { size: 12, mono: true }),
      fixed: cspFixed, rechecked: cspMsg("Diperiksa ulang.")
    },
    steps: [
      { caption: "Panel menulis Izinkan di tab Security: ada domain yang belum diizinkan.", show: ["warn"], dur: 3.8 },
      { caption: "Klik Bantuan, lalu gulir ke bagian Izin domain (CSP).", at: BANTUAN, click: true, show: ["csp", "bad"], hide: ["warn"] },
      { caption: "Sudah diizinkan: aman. Ditambahkan otomatis: aman setelah kamu klik Simpan.", show: ["ringOk"], dur: 3.8 },
      { caption: "Perlu ditambah manual: domain ini harus kamu izinkan sendiri.", hide: ["ringOk"], show: ["ringBad"], dur: 3.4 },
      { caption: "Klik Salin domain kurang. Muncul Tersalin. Tempel di tab Security.", hide: ["ringBad"], at: [DX + 237, DY + 265], click: true, show: ["copied"], dur: 3.8 },
      { caption: "Buka tab Security, tempel, lalu simpan di Scalev.", at: tabAt(2), click: true, show: ["sec"], dur: 3.6 },
      { caption: "Kembali ke Bantuan, klik Periksa ulang. Status jadi Sudah diizinkan.", at: [DX + 80, DY + 265], click: true, hide: ["sec", "copied"], show: ["fixed", "rechecked"], dur: 4 }
    ]
  },

  "bantuan-cek-gejala": {
    title: "Pola memperbaiki masalah: baca pesan, perbaiki, periksa lagi",
    base: [...shell(), panelHead("Konten")],
    els: {
      g1: gate("Server NikahKit tidak terjangkau.", "Periksa internet, lalu tekan Periksa lagi.", true) +
        button(X + 16, TOP + 214, "Periksa lagi", { variant: "ghost", w: 116, h: 32, size: 13 }),
      ringMsg: ring(X + 16, TOP + 144, 428, 56),
      wifi: note(X + 120, TOP + 270, "Cek Wi-Fi atau data dulu", X + 200, TOP + 202),
      g2: gate("Memeriksa akses...", "", false),
      okToast: toast(X + 500, Y + 440, "Rel NikahKit tampil lagi: masalah selesai.", { fill: C.ok })
    },
    steps: [
      { caption: "Panel NikahKit menampilkan pesan, bukan rel menu seperti biasa.", show: ["g1"], dur: 3.4 },
      { caption: "Baca baris tebal: itu gejalanya. Baris kedua: langkah perbaikan.", show: ["ringMsg"], dur: 3.8 },
      { caption: "Cari pesan itu di halaman Pesan galat atau Masalah umum.", dur: 3.4 },
      { caption: "Lakukan perbaikannya. Contoh ini: pastikan internet tersambung.", hide: ["ringMsg"], show: ["wifi"], dur: 3.6 },
      { caption: "Klik Periksa lagi.", hide: ["wifi"], at: [X + 74, TOP + 230], click: true, show: ["g2"], dur: 2.8 },
      { caption: "Berhasil bila rel menu NikahKit muncul lagi.", hide: ["g1", "g2"], show: ["okToast"], dur: 3.8 }
    ]
  },

  "bantuan-cari-galat": {
    title: "Mencari arti pesan galat di panduan",
    base: [browser(X, Y, BW, BH, "…/bantuan/pesan-galat", { tab: "Panduan NikahKit" }), ...table],
    els: {
      find: rect(X + BW - 330, TOP + 4, 310, 40, { r: 8, fill: C.paper, stroke: C.line }) + text(X + BW - 90, TOP + 29, "1/1", { size: 12, fill: C.muted }),
      findText: text(X + BW - 316, TOP + 29, "Sesi berakhir", { size: 14 }),
      hl: rect(COLS[0] - 4, TY + 12, 186, 22, { r: 3, fill: "#fde293" }) + text(COLS[0], TY + 28, PG[0][0], { size: 13, weight: 600 }),
      ringMean: ring(COLS[1] - 6, TY + 8, 230, 30),
      ringDo: ring(COLS[2] - 6, TY + 8, 260, 30)
    },
    steps: [
      { caption: "Catat pesan persis seperti di layar, lalu buka halaman Pesan galat.", dur: 3.6 },
      { caption: "Tekan Ctrl+F (Mac: Cmd+F). Kotak cari muncul di kanan atas.", show: ["find"], dur: 3.4 },
      { caption: "Ketik beberapa kata awal pesannya, misalnya Sesi berakhir.", type: ["findText"], dur: 3.6 },
      { caption: "Baris yang cocok ditandai kuning.", show: ["hl"], dur: 3 },
      { caption: "Baca kolom Artinya supaya tahu penyebabnya.", show: ["ringMean"], dur: 3.2 },
      { caption: "Ikuti kolom Yang harus dilakukan. Di sini: masuk lagi.", hide: ["ringMean"], show: ["ringDo"], dur: 3.8 }
    ]
  },

  "bantuan-masa-aktif": {
    title: "Apa yang terjadi saat masa aktif habis",
    base: [rect(X, Y, BW, BH, { r: 12, fill: C.paper, stroke: C.line }), ...timeline,
      phone(PX, PY, 200, 280, { screen: C.tint }), text(PX + 100, PY + 80, "Rani & Dimas", { size: 16, weight: 700, anchor: "middle", fill: C.cocoa }),
      text(PX + 100, PY + 104, "Undangan tetap tampil", { size: 12, anchor: "middle", fill: C.muted })],
    els: {
      p1: pill(X + 40, Y + 214, 500, 38, ["Paket aktif: editor, RSVP, ucapan, dashboard pasangan jalan."]),
      p2: pill(X + 40, Y + 264, 500, 38, ["7 hari terakhir, panel menulis: Langganan berakhir 5 hari lagi."], { fill: C.warnTint }),
      p3: pill(X + 40, Y + 314, 500, 38, ["Masa tenggang 7 hari: fitur masih jalan. Segera perpanjang."], { fill: C.warnTint }),
      p4: pill(X + 40, Y + 364, 500, 38, ["Setelah tenggang: RSVP, ucapan, dan dashboard berhenti."], { fill: C.badTint }),
      rsvpOn: rect(PX + 24, PY + 140, 152, 70, { r: 8, fill: C.paper }) + text(PX + 100, PY + 166, "Ucapan & RSVP", { size: 12, weight: 600, anchor: "middle" }) +
        button(PX + 44, PY + 176, "Kirim", { w: 112, h: 26, size: 12 }),
      rsvpOff: rect(PX + 24, PY + 140, 152, 70, { r: 8, fill: C.paper }) + para(PX + 36, PY + 166, ["Ucapan & RSVP", "sudah ditutup."], { size: 12, lh: 18, fill: C.bad }),
      renew: button(X + 40, Y + 420, "Perpanjang", { w: 120, h: 32, size: 13 }),
      cur: ring(TLX, TLY, 356, 36), curG: ring(TLX + 360, TLY, 216, 36), curX: ring(TLX + 580, TLY, 216, 36)
    },
    steps: [
      { caption: "Selama paket aktif, semua fitur berjalan.", show: ["p1", "rsvpOn", "cur"], dur: 3.4 },
      { caption: "Seminggu sebelum berakhir, panel NikahKit mengingatkan kamu.", show: ["p2"], dur: 3.6 },
      { caption: "Lewat tanggal berakhir: masa tenggang 7 hari, fitur masih jalan.", hide: ["cur"], show: ["p3", "curG"], dur: 3.8 },
      { caption: "Lewat tenggang: RSVP, ucapan, dan dashboard pasangan berhenti.", hide: ["curG", "rsvpOn"], show: ["p4", "curX", "rsvpOff"], dur: 4 },
      { caption: "Halaman undangan tetap tampil untuk tamu.", dur: 3.2 },
      { caption: "Perpanjang kapan saja: sisa masa aktif tetap terhitung.", show: ["renew"], at: [X + 100, Y + 436], click: true, dur: 3.8 }
    ]
  },

  "bantuan-kirim-wa": {
    title: "Mengirim laporan ke admin Nikahin lewat WhatsApp",
    base: [...shell(), panelHead("Konten"), viewBottom, hintAt("Tanpa data undangan.")],
    els: {
      wa: waWin + composer,
      ringC: ring(CB.x, CB.y, CB.w, CB.h - 46),
      extra,
      warnN: rect(WX + 16, WY + 140, 300, 56, { r: 8, fill: C.badTint }) + para(WX + 28, WY + 162, ["Jangan kirim PIN pasangan, kode staff,", "atau data klien di chat ini."], { size: 12, lh: 17, fill: C.bad }),
      sent, cleared: rect(CB.x + 8, CB.y + 8, CB.w - 16, CB.h - 50, { r: 0, fill: C.paper })
    },
    steps: [
      { caption: "Buka Bantuan, gulir ke bawah, lalu klik Kirim lewat WhatsApp.", at: WA, click: true, dur: 3.4 },
      { caption: "Tab baru terbuka ke WhatsApp admin Nikahin.", show: ["wa"], dur: 3 },
      { caption: "Pesan sudah berisi salam dan laporan teknis. Biarkan, jangan dihapus.", show: ["ringC"], dur: 3.8 },
      { caption: "Tambahkan apa yang kamu lakukan, alamat halaman, dan screenshot.", hide: ["ringC"], type: ["extra"], dur: 4 },
      { caption: "Jangan kirim PIN, kode staff, atau data klien.", show: ["warnN"], dur: 3.4 },
      { caption: "Klik kirim. Tunggu balasan admin di chat yang sama.", hide: ["warnN", "extra"], at: [WX + WW - 34, CB.y + CB.h - 20], click: true, show: ["sent", "cleared"], dur: 3.8 }
    ]
  }
};
