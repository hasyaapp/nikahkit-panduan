// Scenes for the "Bagikan dan tamu" pages (panduan/docs/tamu/*). Labels follow nikahkit/src/ui/App.jsx (ShareDialog,
// AccessSection, ResellerPin), nikahkit/ext/pin.html + pin.js, nikahkit/ext/buku-tamu.html + buku-tamu.js,
// server/pages/src/panel/index.html and the guest gate texts (gatePrivate*).
import { C, browser, scalevShell, editor, railAt, panelArea, editorPhone, phone, rect, text, para, line, circle, button, input, badge, toast, card, ring, note, dim } from "../lib.mjs";

const X = 20, Y = 12, BW = 920, BH = 516;
const P = panelArea(X, Y); // x 100, y 188, w 364
const EP = editorPhone(X, Y, BW, BH);
const BAGIKAN = railAt(X, Y, "Bagikan");
const URL = "tokomu.myscalev.com/rara-dimas";

// Share dialog header + body frame inside the NikahKit panel area.
const shareHead = () => rect(P.x - 14, P.y - 12, P.w + 14, BH - (P.y - Y) + 0, { r: 0, fill: C.paper }) +
  text(P.x, P.y + 14, "Bagikan", { size: 18, weight: 700 }) + text(P.x + P.w - 22, P.y + 14, "✕", { size: 16, fill: C.muted });
const sw = (x, y, on) => rect(x, y, 36, 20, { r: 10, fill: on ? C.sv : "#bdc1c6" }) + circle(on ? x + 26 : x + 10, y + 10, 7, { fill: C.paper });
const select = (x, y, w, label, value) => input(x, y, w, label, value) + text(x + w - 18, y + 22, "▾", { size: 12, fill: C.muted });
const iconBtn = (x, y, glyph) => rect(x, y, 30, 30, { r: 6, fill: C.paper, stroke: C.line }) + text(x + 15, y + 20, glyph, { size: 13, anchor: "middle", fill: C.svDark });

// Guest page on the editor phone preview.
const coverPhone = (to) => rect(EP.x, EP.y, EP.w, EP.h, { r: 6, fill: C.tint }) +
  text(EP.x + EP.w / 2, EP.y + 90, "The Wedding of", { size: 12, anchor: "middle", fill: C.muted }) +
  text(EP.x + EP.w / 2, EP.y + 124, "Rara & Dimas", { size: 22, anchor: "middle", weight: 700, fill: C.accent }) +
  text(EP.x + EP.w / 2, EP.y + 180, "Kepada Yth.", { size: 11, anchor: "middle", fill: C.muted }) +
  text(EP.x + EP.w / 2, EP.y + 202, to, { size: 15, anchor: "middle", weight: 600 }) +
  button(EP.x + 48, EP.y + 230, "Buka undangan", { w: 100, h: 30, size: 12, color: C.accent });

// Scalev "Buku Tamu" frame: sidebar + content header.
const bukuTamuBase = (urlTail = "") => [
  browser(X, Y, BW, BH, "app.scalev.com" + urlTail, { tab: "Scalev" }),
  scalevShell(X, Y, BW, BH, { active: "Buku Tamu" }),
  text(X + 214, Y + 112, "Buku Tamu", { size: 20, weight: 700 }),
  text(X + BW - 200, Y + 112, "kamu@gmail.com · Keluar", { size: 12, fill: C.muted })
];
const CX = X + 214, CW = BW - 234; // content x and width

// Detail view of one invitation in Buku Tamu (top part shared by several scenes).
const detailTop = (tab) => rect(CX - 4, Y + 120, CW + 8, BH - 120 - 4, { r: 0, fill: C.paper }) +
  text(CX, Y + 142, "← Daftar undangan", { size: 12, fill: C.svDark }) +
  text(CX, Y + 168, "Rara & Dimas", { size: 16, weight: 700 }) +
  rect(CX, Y + 180, CW, 40, { r: 8, fill: C.bg, stroke: C.line }) +
  text(CX + 12, Y + 205, "Hadir 86 orang (41 RSVP) · Tidak 9 · Ragu 4", { size: 13, weight: 600 }) +
  rect(CX, Y + 228, CW, 30, { r: 8, fill: C.paper, stroke: C.line }) + text(CX + 12, Y + 248, "▸ Staff penerima tamu", { size: 13, weight: 700 }) +
  input(CX, Y + 266, 250, "", "Cari nama atau isi ucapan", { placeholder: true, h: 30 }) +
  select(CX + 260, Y + 266, 150, "", "Semua") +
  button(CX + 420, Y + 264, "Unduh daftar tamu (CSV)", { variant: "ghost", h: 32, w: 220, size: 13 }) +
  [["Ucapan", "Ucapan (52)"], ["RSVP", "RSVP (54)"], ["Tautan personal", "Tautan personal (30)"]].map(([t, label], i) => text(CX + 8 + [0, 110, 200][i], Y + 326, label, { size: 13, weight: t === tab ? 700 : 500, fill: t === tab ? C.svDark : C.muted }) +
    (t === tab ? rect(CX + 8 + [0, 110, 200][i], Y + 332, label.length * 7.4, 3, { r: 1, fill: C.sv }) : "")).join("") +
  line(CX, Y + 336, CX + CW, Y + 336);

export const scenes = {
  "tamu-bagikan": {
    title: "Membagikan undangan dari panel Bagikan",
    base: [browser(X, Y, BW, BH, "app.scalev.com/pages/365671", { tab: "Scalev" }), editor(X, Y, BW, BH, { railActive: "Konten" })],
    els: {
      ringRail: ring(BAGIKAN[0] - 26, BAGIKAN[1] - 9, 52, 14),
      dlg: shareHead() +
        input(P.x, P.y + 66, P.w - 20, "Nama tamu", "") +
        text(P.x, P.y + 116, "Ditambahkan sebagai ?to=Nama.", { size: 12, fill: C.muted }),
      prefill: text(P.x + 10, P.y + 88, "Nama Tamu", { size: 14 }),
      urlPlain: text(P.x, P.y + 146, URL + "?to=Nama+Tamu", { size: 12, fill: C.svDark, mono: true }),
      typed: text(P.x + 10, P.y + 88, "Budi Santoso", { size: 14 }),
      urlGuest: rect(P.x - 2, P.y + 132, P.w - 14, 20, { r: 0, fill: C.paper }) + text(P.x, P.y + 146, URL + "?to=Budi+Santoso", { size: 12, fill: C.svDark, mono: true }),
      acts: button(P.x, P.y + 162, "Lihat sebagai tamu", { w: 150, h: 32, size: 13 }) +
        button(P.x + 158, P.y + 162, "Salin tautan tamu", { variant: "ghost", w: 146, h: 32, size: 13 }) +
        button(P.x, P.y + 202, "Salin tautan umum", { variant: "quiet", w: 150, h: 32, size: 13 }),
      copied: text(P.x, P.y + 254, "Tersalin.", { size: 13, fill: C.ok, weight: 600 }),
      guestCover: coverPhone("Budi Santoso"),
      pengantin: text(P.x, P.y + 282, "Untuk pengantin", { size: 14, weight: 700 }) +
        button(P.x, P.y + 292, "Kirim undangan", { variant: "ghost", w: 130, h: 30, size: 12 }) +
        button(P.x + 138, P.y + 292, "Buka Dashboard", { variant: "quiet", w: 130, h: 30, size: 12 }) +
        text(P.x, P.y + 338, "Masuk dengan PIN dashboard.", { size: 12, fill: C.muted })
    },
    steps: [
      { caption: "Di editor, klik Bagikan di bagian bawah rel kiri.", at: BAGIKAN, click: true, show: ["ringRail"] },
      { caption: "Panel Bagikan terbuka. Kolom Nama tamu berisi contoh Nama Tamu.", hide: ["ringRail"], show: ["dlg", "prefill", "urlPlain", "acts", "pengantin"], dur: 3 },
      { caption: "Ganti dengan nama tamu. Tautan di bawahnya ikut berubah (?to=).", at: [P.x + 120, P.y + 84], click: true, type: ["typed"], show: ["typed", "urlGuest"], hide: ["urlPlain", "prefill"], dur: 3.6 },
      { caption: "Klik Lihat sebagai tamu untuk mencoba. Nama tamu tampil di sampul.", at: [P.x + 75, P.y + 178], click: true, show: ["guestCover"], dur: 3.6 },
      { caption: "Klik Salin tautan tamu. Muncul tulisan Tersalin.", at: [P.x + 231, P.y + 178], click: true, show: ["copied"] },
      { caption: "Untuk pengantin: tombol menuju Dashboard pasangan.", at: [P.x + 203, P.y + 307], dur: 3.4 }
    ]
  },

  "tamu-undangan-khusus": {
    title: "Menyalakan Undangan khusus",
    base: [browser(X, Y, BW, BH, "app.scalev.com/pages/365671", { tab: "Scalev" }), editor(X, Y, BW, BH, { railActive: "Konten" }),
      shareHead(), text(P.x, P.y + 50, "… tautan tamu di atas …", { size: 12, fill: C.muted }),
      text(P.x, P.y + 86, "Undangan khusus", { size: 15, weight: 700 }),
      text(P.x, P.y + 116, "Undangan khusus", { size: 14 }),
      para(P.x, P.y + 138, ["Isi undangan tidak ada di kode halaman. Server Nikahin", "mengirimnya hanya ke tamu dengan tautan sah."], { size: 11, fill: C.muted }),
      coverPhone("Budi Santoso")],
    els: {
      off: sw(P.x + P.w - 60, P.y + 102, false),
      on: sw(P.x + P.w - 60, P.y + 102, true),
      sec: select(P.x, P.y + 196, P.w - 20, "Keamanan", "Tautan pribadi"),
      secHint1: text(P.x, P.y + 248, "Hanya tamu dengan tautan dari Dashboard > Kirim.", { size: 11, fill: C.muted }),
      menu: card(P.x, P.y + 232, P.w - 20, 108, "", { shadow: true }) +
        text(P.x + 14, P.y + 258, "Tautan pribadi", { size: 13 }) +
        rect(P.x + 4, P.y + 270, P.w - 28, 28, { r: 4, fill: C.svTint }) + text(P.x + 14, P.y + 289, "+ Kunci perangkat", { size: 13, weight: 600 }) +
        text(P.x + 14, P.y + 324, "+ PIN untuk HP baru", { size: 13 }),
      sec2: rect(P.x + 1, P.y + 197, P.w - 40, 32, { r: 0, fill: C.paper }) + text(P.x + 10, P.y + 218, "+ Kunci perangkat", { size: 14 }) +
        rect(P.x - 2, P.y + 236, P.w, 18, { r: 0, fill: C.paper }) +
        text(P.x, P.y + 248, "Tautan yang diteruskan tidak terbuka di perangkat lain.", { size: 11, fill: C.muted }),
      dev: select(P.x, P.y + 284, 120, "Perangkat per tamu", "2"),
      note1: para(P.x, P.y + 330, ["Tamu tetap bisa memotret layar."], { size: 11, fill: C.muted }),
      gate: rect(EP.x, EP.y, EP.w, EP.h, { r: 6, fill: C.paper }) + text(EP.x + EP.w / 2, EP.y + 110, "🔒", { size: 30, anchor: "middle" }) +
        para(EP.x + EP.w / 2, EP.y + 150, ["Undangan ini", "bersifat pribadi"], { size: 15, anchor: "middle", weight: 700 }) +
        para(EP.x + EP.w / 2, EP.y + 205, ["Undangan ini hanya terbuka", "lewat tautan pribadi yang", "dikirim pengantin kepada Anda."], { size: 11, anchor: "middle", fill: C.muted }),
      gateNote: note(EP.x - 20, EP.y - 46, "Dibuka tanpa tautan tamu", EP.x + EP.w / 2, EP.y + 6)
    },
    steps: [
      { caption: "Di panel Bagikan, gulir ke bagian Undangan khusus.", dur: 2.8 },
      { caption: "Klik sakelar Undangan khusus sampai menyala biru.", at: [P.x + P.w - 42, P.y + 112], click: true, show: ["on", "sec", "secHint1"], hide: ["off"] },
      { caption: "Buka pilihan Keamanan. Ada tiga mode.", at: [P.x + 200, P.y + 212], click: true, show: ["menu"] },
      { caption: "Contoh: pilih + Kunci perangkat.", at: [P.x + 120, P.y + 285], click: true, hide: ["menu", "secHint1"], show: ["sec2", "dev", "note1"], dur: 3.4 },
      { caption: "Atur Perangkat per tamu (1 sampai 10), lalu Simpan di Scalev.", at: [P.x + 60, P.y + 300], click: true, dur: 3.4 },
      { caption: "Orang tanpa tautan tamu hanya melihat layar pribadi ini.", show: ["gate", "gateNote"], dur: 3.8 }
    ]
  },

  "tamu-pin": {
    title: "Membuat PIN dashboard dan menyalin pesan untuk pengantin",
    base: [browser(X, Y, BW, BH, "app.scalev.com/pages/365671", { tab: "Scalev" }), editor(X, Y, BW, BH, { railActive: "Konten" }),
      shareHead(), text(P.x, P.y + 50, "… Undangan khusus, Untuk pengantin …", { size: 12, fill: C.muted }),
      text(P.x, P.y + 92, "PIN dashboard", { size: 15, weight: 700 }),
      button(P.x, P.y + 106, "🔒  Kelola PIN dashboard", { w: P.w - 20, h: 36 }),
      text(P.x, P.y + 162, "PIN hanya tampil di jendela NikahKit.", { size: 12, fill: C.muted })],
    els: {
      shade: dim(),
      win: card(260, 70, 440, 400, "") + text(284, 106, "NikahKit", { size: 18, weight: 700 }) + text(676, 106, "✕", { size: 16, fill: C.muted }) +
        text(284, 130, "ID 365671 · kamu@gmail.com", { size: 12, fill: C.muted }) + line(280, 144, 680, 144) +
        text(284, 176, "PIN dashboard", { size: 15, weight: 700 }),
      none: text(284, 204, "Undangan ini belum punya PIN.", { size: 13, fill: C.muted }) + button(284, 222, "Buat PIN", { w: 110 }),
      made: rect(280, 190, 400, 230, { r: 0, fill: C.paper }) +
        text(284, 204, "PIN aktif (versi 1). Lupa? Lihat lagi kapan saja.", { size: 13, fill: C.muted }) +
        rect(284, 222, 200, 52, { r: 8, fill: C.bg, stroke: C.line }) + text(384, 258, "482913", { size: 28, weight: 700, anchor: "middle", mono: true }) +
        iconBtn(496, 233, "⧉") + iconBtn(534, 233, "✉") +
        button(284, 290, "Lihat PIN", { w: 100 }) + button(394, 290, "Buat PIN baru", { variant: "quiet", w: 130 }),
      sayMade: para(284, 352, ["PIN dibuat. Bisa dilihat lagi kapan saja lewat", "Lihat PIN."], { size: 12, fill: C.ok }),
      sayCopy: rect(280, 336, 400, 40, { r: 0, fill: C.paper }) + text(284, 352, "Pesan tersalin.", { size: 13, fill: C.ok, weight: 600 }),
      msg: card(250, 390, 470, 110, "", { fill: C.waTint, stroke: C.wa }) +
        para(266, 414, ["Undangan siap: https://" + URL, "Kelola undangan (kirim ke tamu, RSVP, ucapan, check-in):", "https://tokomu.myscalev.com/kelola?w=365671&link=… (contoh)", "PIN: 482913"], { size: 12, mono: false })
    },
    steps: [
      { caption: "Di panel Bagikan, klik Kelola PIN dashboard.", at: [P.x + 170, P.y + 124], click: true },
      { caption: "Jendela NikahKit terbuka: Undangan ini belum punya PIN.", show: ["shade", "win", "none"], dur: 3 },
      { caption: "Klik Buat PIN. PIN 6 angka langsung tampil.", at: [339, 239], click: true, show: ["made", "sayMade"], dur: 3.6 },
      { caption: "Klik ikon amplop: Salin pesan untuk pengantin.", at: [549, 248], click: true, show: ["sayCopy"], hide: ["sayMade"] },
      { caption: "Tempel di WhatsApp pengantin. Isinya undangan, dashboard, dan PIN.", show: ["msg"], dur: 4 }
    ]
  },

  "tamu-buku-tamu": {
    title: "Membuka Buku Tamu di Scalev dan memoderasi ucapan",
    base: bukuTamuBase("/pages"),
    els: {
      ringMenu: ring(X + 14, Y + 124 + 4 * 34, 162, 30),
      list: rect(CX - 4, Y + 120, CW + 8, BH - 124, { r: 0, fill: C.paper }) +
        input(CX, Y + 140, 320, "", "Cari nama atau ID undangan", { placeholder: true, h: 30 }) +
        card(CX, Y + 186, CW, 62, "", { shadow: false }) + text(CX + 16, Y + 210, "Rara & Dimas", { size: 14, weight: 700 }) +
        text(CX + 116, Y + 210, " /365671 · Terbit", { size: 13, fill: C.muted }) + badge(CX + 300, Y + 197, "Ada yang baru") +
        text(CX + 16, Y + 234, "Ucapan 52 (tampil 50) · Hadir 86 orang · Tidak 9 · Ragu 4", { size: 12, fill: C.muted }) +
        card(CX, Y + 258, CW, 62, "", { shadow: false }) + text(CX + 16, Y + 282, "Sinta & Bagas", { size: 14, weight: 700 }) +
        text(CX + 120, Y + 282, " /365702 · Belum terbit", { size: 13, fill: C.muted }) +
        text(CX + 16, Y + 306, "Ucapan 0 (tampil 0) · Hadir 0 orang · Tidak 0 · Ragu 0", { size: 12, fill: C.muted }),
      detail: detailTop("Ucapan") +
        rect(CX, Y + 346, CW, 74, { r: 8, fill: C.paper, stroke: C.line }) +
        rect(CX + 10, Y + 356, 14, 14, { r: 3, fill: C.paper, stroke: C.muted }) +
        text(CX + 34, Y + 368, "Andi · 12 Okt 10.21", { size: 13, weight: 700 }) + badge(CX + 180, Y + 355, "Baru") +
        text(CX + 34, Y + 390, "Selamat menempuh hidup baru, semoga sakinah!", { size: 13 }) +
        button(CX + 34, Y + 398, "Balas", { variant: "quiet", h: 22, w: 54, size: 12 }) + button(CX + 92, Y + 398, "Ubah teks", { variant: "quiet", h: 22, w: 80, size: 12 }) +
        button(CX + 176, Y + 398, "Sembunyikan", { variant: "quiet", h: 22, w: 100, size: 12 }) + button(CX + 280, Y + 398, "Hapus", { variant: "quiet", h: 22, w: 56, size: 12, color: C.bad }) +
        rect(CX, Y + 428, CW, 70, { r: 8, fill: C.paper, stroke: C.line }) +
        rect(CX + 10, Y + 438, 14, 14, { r: 3, fill: C.paper, stroke: C.muted }) +
        text(CX + 34, Y + 450, "Tante Lia · 11 Okt 19.02", { size: 13, weight: 700 }) +
        text(CX + 34, Y + 472, "Barakallah, lancar sampai hari-H ya.", { size: 13 }),
      hidden: rect(CX + 170, Y + 353, 300, 24, { r: 0, fill: C.paper }) + badge(CX + 180, Y + 355, "Disembunyikan", { fill: C.soft, fg: C.muted }) +
        rect(CX + 176, Y + 397, 104, 24, { r: 0, fill: C.paper }) + button(CX + 176, Y + 398, "Tampilkan", { variant: "quiet", h: 22, w: 100, size: 12 }),
      picks: `<path d="M${CX + 13} ${Y + 444} l3 4 l6 -8" stroke="${C.svDark}" stroke-width="2.5" fill="none"/>` +
        rect(CX - 2, Y + 262, CW + 4, 40, { r: 8, fill: C.svTint, stroke: C.sv }) + text(CX + 12, Y + 287, "1 dipilih", { size: 13, weight: 700 }) +
        ["Sembunyikan", "Tampilkan", "Balas", "Unduh CSV terpilih", "Hapus"].map((b, i) => text(CX + 96 + [0, 100, 184, 234, 370][i], Y + 287, b, { size: 12, fill: b === "Hapus" ? C.bad : C.svDark, weight: 600 })).join("") +
        text(CX + 520, Y + 287, "Batal pilih", { size: 12, fill: C.muted }),
      csvToast: toast(CX + 200, Y + 448, "daftar-tamu-365671-2026-10-14.csv")
    },
    steps: [
      { caption: "Di sidebar Scalev, klik menu Buku Tamu.", at: [X + 70, Y + 144 + 4 * 34], click: true, show: ["ringMenu", "list"] },
      { caption: "Daftar undanganmu tampil. Klik satu undangan.", at: [CX + 200, Y + 216], click: true, hide: ["ringMenu"], dur: 3 },
      { caption: "Ringkasan kehadiran di atas, ucapan di tab Ucapan.", show: ["detail"], dur: 3.4 },
      { caption: "Klik Sembunyikan. Ucapan tidak tampil lagi di undangan.", at: [CX + 226, Y + 409], click: true, show: ["hidden"], dur: 3.4 },
      { caption: "Centang beberapa baris untuk aksi sekaligus.", at: [CX + 17, Y + 445], click: true, show: ["picks"], dur: 3.4 },
      { caption: "Klik Unduh daftar tamu (CSV) untuk menyimpan data RSVP.", at: [CX + 530, Y + 280], click: true, hide: ["picks"], show: ["csvToast"], dur: 3.6 }
    ]
  },

  "tamu-impor-csv": {
    title: "Mengimpor daftar tamu dari file CSV",
    base: [...bukuTamuBase("/pages"), detailTop("Tautan personal")],
    els: {
      tools: text(CX, Y + 362, "Dibuka 12 dari 30 tautan personal.", { size: 12, fill: C.muted }) +
        button(CX, Y + 374, "Impor daftar tamu (CSV)", { variant: "quiet", w: 210, h: 32, size: 13 }) +
        text(CX + 222, Y + 395, "Kolom: nama, whatsapp, kategori, pax", { size: 12, fill: C.muted }),
      picker: card(300, 150, 400, 230, "Open") + rect(316, 196, 368, 120, { r: 6, fill: C.bg, stroke: C.line }) +
        rect(326, 210, 348, 28, { r: 4, fill: C.svTint }) + text(338, 229, "📄  daftar-tamu.csv", { size: 13, weight: 600 }) +
        text(338, 262, "📄  catatan.txt", { size: 13, fill: C.muted }) + button(600, 332, "Open", { w: 84, color: "#1a73e8" }),
      preview: rect(CX, Y + 414, CW, 100, { r: 8, fill: C.bg, stroke: C.line }) +
        text(CX + 12, Y + 434, "3 tamu siap diimpor, 1 baris dilewati.", { size: 13, weight: 700 }) +
        text(CX + 12, Y + 454, "Budi Santoso · Keluarga · 2 orang · 081234567890", { size: 12 }) +
        text(CX + 12, Y + 472, "Baris 5: nomor WhatsApp tidak sah", { size: 12, fill: C.bad }) +
        button(CX + 12, Y + 480, "Impor 3 tamu", { h: 28, w: 110, size: 13 }) + button(CX + 130, Y + 480, "Batal", { variant: "quiet", h: 28, w: 64, size: 13 }),
      done: toast(CX + 440, Y + 352, "3 tamu baru, 0 diperbarui.", { fill: C.ok })
    },
    steps: [
      { caption: "Buka undangan di Buku Tamu, lalu klik tab Tautan personal.", at: [CX + 200, Y + 326], click: true, show: ["tools"], dur: 3.2 },
      { caption: "Klik Impor daftar tamu (CSV).", at: [CX + 105, Y + 390], click: true, show: ["picker"] },
      { caption: "Pilih file CSV-mu, lalu Open.", at: [642, 349], click: true, dur: 3 },
      { caption: "Cek pratinjau: berapa tamu siap, baris mana yang dilewati.", hide: ["picker"], show: ["preview"], dur: 3.8 },
      { caption: "Klik Impor 3 tamu. Tautan personal mereka langsung jadi.", at: [CX + 67, Y + 494], click: true, show: ["done"], dur: 3.8 }
    ]
  },

  "tamu-staff": {
    title: "Membuat kode staff penerima tamu",
    base: [...bukuTamuBase("/pages"), detailTop("Ucapan")],
    els: {
      open: rect(CX, Y + 228, CW, 220, { r: 8, fill: C.paper, stroke: C.line }) + text(CX + 12, Y + 248, "▾ Staff penerima tamu", { size: 13, weight: 700 }) +
        para(CX + 12, Y + 272, ["Staff masuk ke halaman check-in dengan kode pribadinya, tanpa PIN dashboard.", "Kode hanya bisa dipakai untuk check-in tamu."], { size: 12, fill: C.muted }) +
        text(CX + 12, Y + 312, "Belum ada staff.", { size: 12, fill: C.muted }),
      addBtn: button(CX + 12, Y + 324, "+ Tambah staff", { variant: "quiet", h: 30, w: 130, size: 13 }),
      form: rect(CX + 8, Y + 300, CW - 16, 140, { r: 0, fill: C.paper }) +
        input(CX + 12, Y + 330, 260, "Nama staff", "") + button(CX + 282, Y + 330, "Buat kode", { h: 34, w: 100, size: 13 }),
      name: text(CX + 22, Y + 352, "Rina", { size: 14 }),
      code: rect(CX + 8, Y + 300, CW - 16, 144, { r: 0, fill: C.paper }) +
        text(CX + 12, Y + 322, "Kode untuk Rina: ", { size: 14 }) + text(CX + 132, Y + 322, "K7PM3QXA", { size: 16, weight: 700, mono: true }) +
        button(CX + 12, Y + 334, "Salin kode", { variant: "quiet", h: 28, w: 96, size: 12 }) +
        button(CX + 116, Y + 334, "Kirim lewat WA", { variant: "quiet", h: 28, w: 120, size: 12 }) +
        button(CX + 244, Y + 334, "Salin pesan", { variant: "quiet", h: 28, w: 100, size: 12 }) +
        text(CX + 12, Y + 386, "Kode hanya tampil sekali. Kirim sekarang; kalau hilang, cabut lalu buat kode baru.", { size: 12, fill: C.warn }) +
        text(CX + 12, Y + 418, "Rina", { size: 13, weight: 700 }) + text(CX + 52, Y + 418, "Dibuat 14 Okt 09.12", { size: 12, fill: C.muted }) +
        button(CX + 220, Y + 403, "Cabut", { variant: "quiet", h: 24, w: 60, size: 12, color: C.bad }),
      ph: rect(700, 120, 260, 416, { r: 0, fill: C.bg }) + phone(710, 130, 220, 400) +
        text(820, 210, "Kelola undangan", { size: 15, weight: 700, anchor: "middle" }) +
        input(734, 270, 172, "PIN atau kode staff", "••••••••", { h: 30 }) +
        button(734, 316, "Masuk", { w: 172, h: 32 }) + text(820, 420, "Staff hanya melihat Hari-H", { size: 11, anchor: "middle", fill: C.muted })
    },
    steps: [
      { caption: "Di detail undangan, klik Staff penerima tamu.", at: [CX + 100, Y + 244], click: true, show: ["open", "addBtn"] },
      { caption: "Klik + Tambah staff.", at: [CX + 77, Y + 339], click: true, show: ["form"], dur: 2.8 },
      { caption: "Ketik nama staff, lalu klik Buat kode.", at: [CX + 332, Y + 347], click: true, type: ["name"], show: ["name"], dur: 3.6 },
      { caption: "Kode 8 karakter tampil sekali saja. Kirim lewat WA atau salin.", show: ["code"], hide: ["form", "name", "addBtn"], at: [CX + 176, Y + 348], dur: 4 },
      { caption: "Staff masuk dengan kode itu di kolom PIN atau kode staff.", show: ["ph"], dur: 3.8 },
      { caption: "Selesai acara? Klik Cabut. Kode langsung tidak berlaku.", hide: ["ph"], at: [CX + 250, Y + 415], click: true, dur: 3.4 }
    ]
  }
};
