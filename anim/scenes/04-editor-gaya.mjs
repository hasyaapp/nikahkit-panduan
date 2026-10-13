// Editor scenes for the Gaya, Media, Musik, Lapisan, preview click, undo/Kosongkan, and Dijeda pages.
// Labels follow nikahkit/src/ui/App.jsx, panels-style.jsx, panels-structure.jsx, fields.jsx, canvas/canvas.js, store.js.
import { C, browser, editor, editorPhone, railAt, panelArea, rect, text, line, circle, button, input, card, ring, note, toast, para, badge, dim } from "../lib.mjs";

const X = 20, Y = 12, BW = 920, BH = 516;
const URL = "app.scalev.com/pages/365671";
const P = panelArea(X, Y); // x 100, w 364
const S = editorPhone(X, Y, BW, BH); // phone screen
const at = (n) => railAt(X, Y, n);
const base = (rail, o = {}) => [browser(X, Y, BW, BH, URL, { tab: "Scalev" }), editor(X, Y, BW, BH, { railActive: rail, ...o })];
const head = (t) => text(P.x, 200, t, { size: 16, weight: 700 });
const cover = (S2 = S) => rect(S2.x, S2.y, S2.w, S2.h, { r: 4, fill: C.tint });
// Simple invitation in the phone: section blocks with titles.
const block = (y, h, title, o = {}) => rect(S.x + 10, y, S.w - 20, h, { r: 6, fill: o.fill ?? C.paper, stroke: o.stroke ?? C.line, sw: o.sw }) + text(S.x + S.w / 2, y + h / 2 + 5, title, { size: 12, anchor: "middle", fill: o.fg ?? C.ink, weight: 600 });
const sw = (x, y, on) => rect(x, y, 34, 18, { r: 9, fill: on ? C.svDark : "#bdc1c6" }) + circle(on ? x + 25 : x + 9, y + 9, 7, { fill: C.paper });
const thumb = (x, y, w, h, fill) => rect(x, y, w, h, { r: 4, fill }) + `<path d="M${x + 6} ${y + h - 6} L${x + w * 0.4} ${y + h * 0.45} L${x + w * 0.65} ${y + h * 0.7} L${x + w * 0.8} ${y + h * 0.55} L${x + w - 6} ${y + h - 6} Z" fill="rgba(255,255,255,.55)"/>`;
const TH = ["#c9a98f", "#a7b8a0", "#d8b4a6", "#8fa3b8", "#c7b27f", "#b49ac0"];

export const scenes = {
  // ---------------------------------------------------------------- Media: unggah banyak foto
  "editor-media-unggah": {
    title: "Mengunggah banyak foto lewat menu Media",
    base: [...base("Media"), head("Media"), button(P.x, 216, "Unggah foto", { w: P.w, h: 36 }), rect(P.x, 296, P.w, 200, { r: 8, fill: C.bg, stroke: C.line, dash: "6 4" })],
    els: {
      hint0: text(P.x, 278, "Atau seret ke sini.", { size: 12, fill: C.muted }) + text(P.x + P.w / 2, 400, "Belum ada foto.", { size: 13, anchor: "middle", fill: C.muted }),
      files: [["foto-1.jpg", 560, 300], ["foto-2.png", 580, 352], ["resepsi.heic", 600, 404]].map(([n, x, y]) => rect(x, y, 150, 40, { r: 6, fill: C.paper, stroke: C.line }) + rect(x + 8, y + 8, 24, 24, { r: 3, fill: "#c9a98f" }) + text(x + 40, y + 25, n, { size: 12 })).join(""),
      over: rect(P.x - 2, 294, P.w + 4, 204, { r: 8, fill: "rgba(8,153,207,.08)", stroke: C.sv, sw: 2, dash: "6 4" }) + text(P.x + P.w / 2, 400, "Lepas di sini", { size: 14, anchor: "middle", fill: C.svDark, weight: 600 }),
      busy: rect(P.x, 264, P.w, 22, { r: 0, fill: C.paper }) + text(P.x, 278, "Mengunggah 2 dari 2...", { size: 12, fill: C.svDark, weight: 600 }),
      grid: rect(P.x + 1, 297, P.w - 2, 198, { r: 8, fill: C.bg }) + [0, 1].map((i) => thumb(P.x + 12 + (i % 3) * 116, 308 + Math.floor(i / 3) * 90, 106, 80, TH[i])).join(""),
      done: rect(P.x, 264, P.w, 22, { r: 0, fill: C.paper }) + text(P.x, 278, "1 dilewati: hanya JPG, PNG, WebP, GIF.", { size: 12, fill: C.warn, weight: 600 })
    },
    steps: [
      { caption: "Di tab NikahKit, klik Media di rel kiri.", at: at("Media"), click: true },
      { caption: "Seret beberapa foto dari folder komputer ke panel Media.", at: [P.x + 180, 380], show: ["files", "over"], hide: ["hint0"], dur: 3.6 },
      { caption: "Lepas tombol mouse. Foto diunggah satu per satu.", show: ["busy"], hide: ["files", "over"] },
      { caption: "Foto masuk ke Media Scalev dan tampil di grid.", show: ["grid", "done"], hide: ["busy"], dur: 3.6 },
      { caption: "File HEIC dilewati. Ubah ke JPG atau PNG dulu, lalu unggah lagi.", at: [P.x + 120, 278], dur: 4 }
    ]
  },

  // ---------------------------------------------------------------- Media: Pilih foto di form
  "editor-media-pilih-foto": {
    title: "Memasang foto lewat tombol Pilih foto",
    base: [...base("Konten"), head("Konten"), rect(P.x, 214, P.w, 36, { r: 6, fill: C.bg }), text(P.x + 12, 237, "Mempelai", { size: 14, weight: 700 }),
      text(P.x, 274, "Foto", { size: 12, fill: C.muted }), cover(), text(S.x + S.w / 2, S.y + 60, "Profil Mempelai", { size: 13, anchor: "middle", weight: 600 }),
      circle(S.x + S.w / 2, S.y + 140, 50, { fill: C.line }), text(S.x + S.w / 2, S.y + 216, "Rani Putri", { size: 14, anchor: "middle", weight: 700 })],
    els: {
      pick: button(P.x, 284, "Pilih foto", { variant: "ghost", w: 120, h: 32, size: 13 }),
      dlg: rect(84, 164, 396, 364, { r: 0, fill: C.paper }) + text(P.x, 196, "Pilih foto", { size: 16, weight: 700 }) + text(P.x + P.w - 8, 196, "✕", { size: 14, fill: C.muted }) +
        button(P.x, 210, "Unggah foto", { variant: "ghost", w: P.w, h: 30, size: 13 }) + text(P.x, 262, "Atau tempel tautan https", { size: 12, fill: C.muted }) +
        input(P.x, 270, P.w - 74, "", "https://...", { placeholder: true, h: 30 }) + button(P.x + P.w - 66, 270, "Pakai", { variant: "ghost", w: 66, h: 30, size: 13 }) +
        TH.map((f, i) => thumb(P.x + (i % 3) * 124, 314 + Math.floor(i / 3) * 76, 116, 68, f)).join("") +
        button(P.x, 474, "Pakai foto", { w: P.w, h: 34 }),
      sel: rect(P.x + 124 - 3, 311, 122, 74, { r: 6, fill: "none", stroke: C.svDark, sw: 3 }) + circle(P.x + 230, 324, 9, { fill: C.svDark }) + text(P.x + 230, 328, "✓", { size: 11, anchor: "middle", fill: C.paper }),
      got: rect(84, 264, 396, 264, { r: 0, fill: C.paper }) + text(P.x, 274, "Foto", { size: 12, fill: C.muted }) + thumb(P.x, 284, 90, 68, TH[1]) +
        button(P.x + 104, 302, "Ganti foto", { variant: "ghost", w: 110, h: 32, size: 13 }) + text(P.x, 382, "Deskripsi foto", { size: 12, fill: C.muted }) + input(P.x, 390, P.w, "", "") +
        text(P.x, 448, "Titik fokus", { size: 12, fill: C.muted }) + ["Atas", "Tengah", "Bawah", "Kiri", "Kanan"].map((l, i) => rect(P.x + i * 46, 458, 40, 32, { r: 4, fill: i === 1 ? C.svTint : C.paper, stroke: C.line })).join("") + text(P.x + 240, 479, "Tengah", { size: 12, fill: C.svDark, weight: 600 }),
      desc: text(P.x + 10, 412, "Foto Rani tersenyum di taman", { size: 14 }),
      pphoto: circle(S.x + S.w / 2, S.y + 140, 50, { fill: TH[1] }) + circle(S.x + S.w / 2, S.y + 150, 18, { fill: "rgba(255,255,255,.5)" }),
      focus: rect(P.x + 1, 459, 38, 30, { r: 4, fill: C.svTint }) + rect(P.x + 47, 459, 38, 30, { r: 4, fill: C.paper }) + rect(P.x + 200, 466, 140, 20, { r: 0, fill: C.paper }) + text(P.x + 240, 479, "Atas", { size: 12, fill: C.svDark, weight: 600 }) +
        circle(S.x + S.w / 2, S.y + 140, 50, { fill: TH[1] }) + circle(S.x + S.w / 2, S.y + 128, 18, { fill: "rgba(255,255,255,.5)" })
    },
    steps: [
      { caption: "Di Konten, buka kelompok yang punya foto, misalnya Mempelai.", at: [P.x + 60, 232], click: true, show: ["pick"] },
      { caption: "Klik Pilih foto. Jendela Pilih foto terbuka.", at: [P.x + 60, 300], click: true, show: ["dlg"] },
      { caption: "Klik satu foto dari Media Scalev.", at: [P.x + 180, 348], click: true, show: ["sel"] },
      { caption: "Klik Pakai foto. Foto langsung tampil di pratinjau.", at: [P.x + 180, 491], click: true, hide: ["dlg", "sel", "pick"], show: ["got", "pphoto"] },
      { caption: "Isi Deskripsi foto dengan kalimat singkat.", at: [P.x + 150, 407], click: true, type: ["desc"], show: ["desc"], dur: 3.6 },
      { caption: "Wajah terpotong? Pilih Titik fokus Atas.", at: [P.x + 20, 474], click: true, show: ["focus"], dur: 3.6 }
    ]
  },

  // ---------------------------------------------------------------- Musik
  "editor-musik-youtube": {
    title: "Memasang musik dari YouTube",
    base: [...base("Audio"), head("Musik"), text(P.x, 228, "Tautan lagu", { size: 12, fill: C.muted }), rect(P.x, 236, P.w, 34, { r: 4, stroke: "#c4c7c5" }),
      text(P.x, 288, "YouTube, atau .mp3 dari hosting lain.", { size: 12, fill: C.muted }),
      text(P.x, 316, "Mulai dari", { size: 12, fill: C.muted }), rect(P.x, 324, 120, 34, { r: 4, stroke: "#c4c7c5" }),
      text(P.x, 470, "Putar saat undangan dibuka", { size: 13 }), text(P.x, 502, "Ulang terus", { size: 13 }),
      cover(), text(S.x + S.w / 2, S.y + 120, "Rani & Dimas", { size: 20, anchor: "middle", weight: 700, fill: C.cocoa })],
    els: {
      ph1: text(P.x + 10, 258, "https://youtu.be/...", { size: 14, fill: C.muted }),
      ph2: text(P.x + 10, 346, "0:00", { size: 14, fill: C.muted }),
      link: rect(P.x + 1, 237, P.w - 2, 32, { r: 4, fill: C.paper }) + text(P.x + 10, 258, "https://youtu.be/AbCdEfGh123", { size: 14 }),
      start: rect(P.x + 1, 325, 118, 32, { r: 4, fill: C.paper }) + text(P.x + 10, 346, "1:05", { size: 14 }),
      swOff: sw(P.x + 300, 457, false) + sw(P.x + 300, 489, false),
      swOn: sw(P.x + 300, 457, true) + sw(P.x + 300, 489, true),
      player: thumb(P.x, 372, 110, 64, "#5d4a3a") + `<path d="M${P.x + 48} ${392} l16 12 l-16 12 z" fill="#fff"/>` + button(P.x + 124, 388, "Coba putar dari 1:05", { w: 180, h: 32, size: 13 }),
      playing: rect(P.x + 122, 386, 186, 36, { r: 0, fill: C.paper }) + button(P.x + 124, 388, "Hentikan", { w: 110, h: 32, size: 13 }),
      disc: circle(S.x + S.w - 24, S.y + S.h - 24, 14, { fill: C.cocoa }) + circle(S.x + S.w - 24, S.y + S.h - 24, 4, { fill: C.tint })
    },
    steps: [
      { caption: "Klik Audio di rel kiri. Panel Musik terbuka.", at: at("Audio"), click: true },
      { caption: "Klik Tautan lagu, lalu tempel link lagu dari YouTube.", at: [P.x + 150, 253], click: true, show: ["link"], hide: ["ph1"], type: ["link"], dur: 3.8 },
      { caption: "Isi Mulai dari, contoh 1:05 atau 65 (detik).", at: [P.x + 60, 341], click: true, show: ["start", "player"], hide: ["ph2"], type: ["start"] },
      { caption: "Klik Coba putar dari 1:05 untuk mengecek potongan lagu.", at: [P.x + 214, 404], click: true, show: ["playing"], dur: 3.6 },
      { caption: "Nyalakan Putar saat undangan dibuka dan Ulang terus.", at: [P.x + 317, 466], click: true, show: ["swOn", "disc"], hide: ["swOff"], dur: 3.6 }
    ]
  },

  // ---------------------------------------------------------------- Gaya: Warna
  "editor-gaya-warna": {
    title: "Mengganti warna undangan di menu Gaya",
    base: [...base("Gaya"), head("Gaya"),
      rect(P.x, 212, P.w, 32, { r: 6, fill: C.soft }), rect(P.x + 2, 214, 118, 28, { r: 5, fill: C.paper }),
      text(P.x + 60, 233, "Warna", { size: 13, anchor: "middle", weight: 700, fill: C.svDark }), text(P.x + 182, 233, "Huruf", { size: 13, anchor: "middle", fill: C.muted }), text(P.x + 304, 233, "Bentuk", { size: 13, anchor: "middle", fill: C.muted }),
      text(P.x, 300, "Custom", { size: 14, weight: 700 }),
      ...[["Latar", "#F6EFE7"], ["Kartu", "#FFFBF6"], ["Judul", "#5A2E1F"], ["Teks", "#4A3B33"]].map(([l, c], i) => rect(P.x, 310 + i * 30, 22, 22, { r: 4, fill: c, stroke: C.line }) + text(P.x + 32, 326 + i * 30, l, { size: 13, weight: 600 }) + text(P.x + P.w, 326 + i * 30, c, { size: 12, anchor: "end", fill: C.muted, mono: true })),
      text(P.x + 32, 446, "Aksen", { size: 13, weight: 600 }),
      cover(), text(S.x + S.w / 2, S.y + 70, "The Wedding of", { size: 11, anchor: "middle", fill: C.muted }), text(S.x + S.w / 2, S.y + 104, "Rani & Dimas", { size: 20, anchor: "middle", weight: 700, fill: "#5A2E1F" })],
    els: {
      acc0: rect(P.x, 430, 22, 22, { r: 4, fill: "#A0522D" }) + text(P.x + P.w, 446, "#A0522D", { size: 12, anchor: "end", fill: C.muted, mono: true }) + rect(S.x + 48, S.y + 220, 100, 32, { r: 16, fill: "#A0522D" }) + text(S.x + 98, S.y + 241, "Buka Undangan", { size: 11, anchor: "middle", fill: C.paper, weight: 600 }),
      picker: card(250, 300, 200, 150, "", { r: 8 }) + `<defs><linearGradient id="gw" x1="0" x2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#f2e14a"/></linearGradient></defs>` + rect(262, 312, 176, 100, { r: 4, fill: "url(#gw)" }) + circle(420, 324, 7, { fill: "none", stroke: "#333", sw: 2 }) + rect(262, 420, 176, 14, { r: 7, fill: "#e0c040" }),
      acc1: rect(P.x - 2, 428, P.w + 4, 26, { r: 0, fill: C.paper }) + rect(P.x, 430, 22, 22, { r: 4, fill: "#F2E14A" }) + text(P.x + 32, 446, "Aksen", { size: 13, weight: 600 }) + text(P.x + P.w, 446, "#F2E14A", { size: 12, anchor: "end", fill: C.muted, mono: true }) +
        rect(S.x + 48, S.y + 220, 100, 32, { r: 16, fill: "#F2E14A" }) + text(S.x + 98, S.y + 241, "Buka Undangan", { size: 11, anchor: "middle", fill: "#111", weight: 600 }) +
        text(P.x + 60, 300, "dipakai", { size: 11, fill: C.accent, weight: 600 }),
      warn: rect(P.x, 462, P.w, 50, { r: 6, fill: C.warnTint }) + para(P.x + 10, 482, ["Kurang kontras: Aksen di Latar, Aksen di Kartu."], { size: 12, fill: C.warn }) + text(P.x + 10, 502, "Kembali ke palet bawaan", { size: 12, fill: C.svDark, weight: 600 }),
      reset: rect(P.x, 252, P.w, 30, { r: 6, fill: C.svTint }) + text(P.x + 10, 272, "Gaya diubah.", { size: 13 }) + text(P.x + P.w - 10, 272, "Kembalikan", { size: 13, anchor: "end", fill: C.svDark, weight: 700 })
    },
    steps: [
      { caption: "Klik Gaya di rel kiri, lalu pastikan tab Warna terpilih.", at: at("Gaya"), click: true },
      { caption: "Di Custom ada lima warna dasar: Latar, Kartu, Judul, Teks, Aksen.", at: [P.x + 60, 380], dur: 3.6 },
      { caption: "Klik kotak warna Aksen. Pemilih warna Chrome terbuka.", at: [P.x + 11, 441], click: true, show: ["picker"] },
      { caption: "Pilih warna baru. Pratinjau langsung berubah.", at: [420, 324], click: true, show: ["acc1", "reset"], hide: ["picker", "acc0"], dur: 3.6 },
      { caption: "Muncul Kurang kontras? Tulisan susah dibaca. Pilih warna lain.", show: ["warn"], at: [P.x + 120, 482], dur: 4 },
      { caption: "Ingin kembali ke awal? Klik Kembalikan.", at: [P.x + P.w - 40, 267], click: true, dur: 3.2 }
    ]
  },

  // ---------------------------------------------------------------- Gaya: Huruf dan Bentuk
  "editor-gaya-huruf": {
    title: "Mengatur huruf, ukuran teks, bentuk, dan gerak",
    base: [...base("Gaya"), head("Gaya"), rect(P.x, 212, P.w, 32, { r: 6, fill: C.soft }),
      cover(), text(S.x + S.w / 2, S.y + 70, "The Wedding of", { size: 11, anchor: "middle", fill: C.muted })],
    els: {
      tWarna: rect(P.x + 2, 214, 118, 28, { r: 5, fill: C.paper }) + text(P.x + 60, 233, "Warna", { size: 13, anchor: "middle", weight: 700, fill: C.svDark }) + text(P.x + 182, 233, "Huruf", { size: 13, anchor: "middle", fill: C.muted }) + text(P.x + 304, 233, "Bentuk", { size: 13, anchor: "middle", fill: C.muted }),
      tHuruf: rect(P.x, 212, P.w, 32, { r: 6, fill: C.soft }) + rect(P.x + 123, 214, 118, 28, { r: 5, fill: C.paper }) + text(P.x + 60, 233, "Warna", { size: 13, anchor: "middle", fill: C.muted }) + text(P.x + 182, 233, "Huruf", { size: 13, anchor: "middle", weight: 700, fill: C.svDark }) + text(P.x + 304, 233, "Bentuk", { size: 13, anchor: "middle", fill: C.muted }) +
        rect(84, 250, 396, 278, { r: 0, fill: C.paper }) +
        text(P.x, 274, "Ukuran teks", { size: 14, weight: 700 }) + ["Kecil", "Normal", "Besar"].map((l, i) => rect(P.x + i * 46, 284, 40, 32, { r: 4, fill: i === 1 ? C.svTint : C.paper, stroke: C.line }) + text(P.x + 20 + i * 46, 306, "T", { size: 10 + i * 3, anchor: "middle", weight: 700 })).join("") +
        text(P.x, 344, "Custom", { size: 14, weight: 700 }) + text(P.x, 366, "Font judul dan nama", { size: 12, fill: C.muted }) + rect(P.x, 374, P.w, 32, { r: 4, stroke: "#c4c7c5" }) +
        text(P.x, 430, "Pasangan font", { size: 14, weight: 700 }) + rect(P.x, 440, P.w, 56, { r: 6, fill: C.svTint, stroke: C.sv }) + text(P.x + 12, 464, "Rani & Dimas", { size: 18, weight: 700 }) + text(P.x + 12, 486, "Minggu, 14 Februari 2027 pukul 08.00 WIB", { size: 11, fill: C.muted }),
      big: rect(P.x + 46, 284, 40, 32, { r: 4, fill: C.paper, stroke: C.line }) + text(P.x + 66, 306, "T", { size: 13, anchor: "middle", weight: 700 }) + rect(P.x + 92, 284, 40, 32, { r: 4, fill: C.svTint, stroke: C.sv }) + text(P.x + 112, 306, "T", { size: 16, anchor: "middle", weight: 700 }) + text(P.x + 146, 306, "Besar", { size: 12, fill: C.svDark, weight: 600 }),
      ph: text(P.x + 10, 395, "Tempel link Google Fonts", { size: 13, fill: C.muted }),
      font: rect(P.x + 1, 375, P.w - 2, 30, { r: 4, fill: C.paper }) + text(P.x + 10, 395, "https://fonts.google.com/specimen/Playfair+Display", { size: 11 }),
      nameA: text(S.x + S.w / 2, S.y + 104, "Rani & Dimas", { size: 18, anchor: "middle", weight: 700, fill: C.cocoa }),
      nameB: rect(S.x + 4, S.y + 80, S.w - 8, 36, { r: 0, fill: C.tint }) + text(S.x + S.w / 2, S.y + 106, "Rani & Dimas", { size: 22, anchor: "middle", weight: 700, fill: C.cocoa, }) + `<g font-style="italic"></g>`,
      tBentuk: rect(P.x, 212, P.w, 32, { r: 6, fill: C.soft }) + rect(P.x + 244, 214, 118, 28, { r: 5, fill: C.paper }) + text(P.x + 60, 233, "Warna", { size: 13, anchor: "middle", fill: C.muted }) + text(P.x + 182, 233, "Huruf", { size: 13, anchor: "middle", fill: C.muted }) + text(P.x + 304, 233, "Bentuk", { size: 13, anchor: "middle", weight: 700, fill: C.svDark }) +
        rect(84, 250, 396, 278, { r: 0, fill: C.paper }) +
        text(P.x, 274, "Bentuk", { size: 14, weight: 700 }) + [0, 1, 2].map((i) => rect(P.x + i * 46, 284, 40, 32, { r: 4, fill: C.paper, stroke: C.line })).join("") +
        `<rect x="${P.x + 13}" y="290" width="14" height="20" rx="4" fill="none" stroke="#333"/><rect x="${P.x + 59}" y="290" width="14" height="20" fill="none" stroke="#333"/><path d="M${P.x + 105} 310 v-12 a7 7 0 0 1 14 0 v12 z" fill="none" stroke="#333"/>` +
        text(P.x, 350, "Gerak", { size: 14, weight: 700 }) + [0, 1, 2].map((i) => rect(P.x + i * 46, 360, 40, 32, { r: 4, fill: i === 1 ? C.svTint : C.paper, stroke: C.line })).join("") + text(P.x + 146, 381, "Halus", { size: 12, fill: C.svDark, weight: 600 }) +
        text(P.x, 412, "Bagian muncul pelan saat tamu menggulir.", { size: 12, fill: C.muted }),
      arch: rect(P.x + 92, 284, 40, 32, { r: 4, fill: C.svTint, stroke: C.sv }) + `<path d="M${P.x + 105} 310 v-12 a7 7 0 0 1 14 0 v12 z" fill="none" stroke="#333"/>` + text(P.x + 146, 305, "Lengkung", { size: 12, fill: C.svDark, weight: 600 }) +
        `<path d="M${S.x + 48} ${S.y + 290} v-130 a50 50 0 0 1 100 0 v130 z" fill="${C.line}"/>`
    },
    steps: [
      { caption: "Di menu Gaya, klik tab Huruf.", at: [P.x + 182, 228], click: true, show: ["tHuruf", "nameA", "ph"], hide: ["tWarna"] },
      { caption: "Ukuran teks: klik ikon Besar supaya tulisan lebih mudah dibaca.", at: [P.x + 112, 300], click: true, show: ["big"], dur: 3.6 },
      { caption: "Mau font lain? Tempel link font dari Google Fonts di kolom Custom.", at: [P.x + 150, 390], click: true, show: ["font", "nameB"], hide: ["ph"], type: ["font"], dur: 4 },
      { caption: "Klik tab Bentuk untuk sudut tombol, kartu, dan bingkai foto.", at: [P.x + 304, 228], click: true, show: ["tBentuk"], hide: ["tHuruf", "big", "font"] },
      { caption: "Pilih Lengkung. Bingkai foto di pratinjau ikut berubah.", at: [P.x + 112, 300], click: true, show: ["arch"], dur: 3.6 },
      { caption: "Gerak Halus: bagian muncul pelan saat tamu menggulir.", at: [P.x + 66, 376], dur: 3.4 }
    ]
  },

  // ---------------------------------------------------------------- Lapisan
  "editor-lapisan-urutan": {
    title: "Mengatur urutan dan menyembunyikan bagian di Lapisan",
    base: [...base("Lapisan"), head("Lapisan"), text(P.x, 226, "Bagian kosong tidak tampil.", { size: 12, fill: C.muted }), cover()],
    els: (() => {
      const row = (i, name, o = {}) => {
        const y = 240 + i * 36;
        return rect(P.x, y, P.w, 32, { r: 6, fill: o.fill ?? C.paper, stroke: C.line }) + text(P.x + 10, y + 15, name, { size: 13, weight: 600 }) +
          (o.small ? text(P.x + 10, y + 28, o.small, { size: 10, fill: C.muted }) : "") +
          (o.locked ? text(P.x + P.w - 18, y + 21, "🔒", { size: 12, anchor: "middle" }) : text(P.x + 220, y + 21, "▲", { size: 11, fill: C.muted }) + text(P.x + 250, y + 21, "▼", { size: 11, fill: C.muted }) + sw(P.x + P.w - 46, y + 7, o.on !== false));
      };
      const ph = (list) => list.map(([t], i) => block(S.y + 10 + i * 48, 40, t)).join("");
      return {
        listA: rect(84, 236, 396, 260, { r: 0, fill: C.paper }) + row(0, "Sampul", { locked: true, small: "Selalu pertama" }) + row(1, "Salam Pembuka") + row(2, "Galeri Foto") + row(3, "Profil Mempelai") + row(4, "Rangkaian Acara") + row(5, "Kaki Halaman", { locked: true, small: "Selalu terakhir" }) +
          rect(S.x, S.y, S.w, S.h, { r: 4, fill: C.tint }) + ph([["Sampul"], ["Salam Pembuka"], ["Galeri Foto"], ["Profil Mempelai"], ["Rangkaian Acara"], ["Kaki Halaman"]]),
        listB: rect(84, 236, 396, 260, { r: 0, fill: C.paper }) + row(0, "Sampul", { locked: true, small: "Selalu pertama" }) + row(1, "Salam Pembuka") + row(2, "Profil Mempelai") + row(3, "Galeri Foto") + row(4, "Rangkaian Acara") + row(5, "Kaki Halaman", { locked: true, small: "Selalu terakhir" }) +
          rect(S.x, S.y, S.w, S.h, { r: 4, fill: C.tint }) + ph([["Sampul"], ["Salam Pembuka"], ["Profil Mempelai"], ["Galeri Foto"], ["Rangkaian Acara"], ["Kaki Halaman"]]) +
          text(P.x, 472, "Kembalikan urutan template", { size: 13, fill: C.svDark, weight: 600 }),
        listC: rect(84, 236, 396, 230, { r: 0, fill: C.paper }) + row(0, "Sampul", { locked: true, small: "Selalu pertama" }) + row(1, "Salam Pembuka", { on: false, small: "Disembunyikan" }) + row(2, "Profil Mempelai") + row(3, "Galeri Foto") + row(4, "Rangkaian Acara") + row(5, "Kaki Halaman", { locked: true, small: "Selalu terakhir" }) +
          rect(S.x, S.y, S.w, S.h, { r: 4, fill: C.tint }) + ph([["Sampul"], ["Profil Mempelai"], ["Galeri Foto"], ["Rangkaian Acara"], ["Kaki Halaman"]])
      };
    })(),
    steps: [
      { caption: "Klik Lapisan di rel kiri. Semua bagian undangan tampil berurutan.", at: at("Lapisan"), click: true, show: ["listA"], dur: 3.6 },
      { caption: "Klik ▼ di Galeri Foto untuk menurunkannya satu langkah.", at: [P.x + 254, 329], click: true, show: ["listB"], hide: ["listA"], dur: 3.6 },
      { caption: "Urutan di pratinjau ikut berubah.", at: [S.x + 100, S.y + 130], dur: 3 },
      { caption: "Matikan sakelar Salam Pembuka untuk menyembunyikannya.", at: [P.x + P.w - 29, 285], click: true, show: ["listC"], hide: ["listB"], dur: 3.6 },
      { caption: "Sampul dan Kaki Halaman terkunci: tidak bisa dipindah atau dimatikan.", at: [P.x + P.w - 18, 255], dur: 4 }
    ]
  },

  // ---------------------------------------------------------------- Klik di pratinjau
  "editor-klik-pratinjau": {
    title: "Mengisi undangan dengan klik langsung di pratinjau",
    base: [...base("Template"), cover(), text(S.x + S.w / 2, S.y + 30, "The Wedding of", { size: 11, anchor: "middle", fill: C.muted }),
      text(S.x + S.w / 2, S.y + 62, "Rani & Dimas", { size: 20, anchor: "middle", weight: 700, fill: C.cocoa }),
      block(S.y + 150, 120, "Galeri Foto")],
    els: {
      tmpl: head("Template") + [0, 1, 2, 3].map((i) => rect(P.x + (i % 2) * 184, 220 + Math.floor(i / 2) * 140, 176, 130, { r: 8, fill: C.bg, stroke: C.line })).join(""),
      hover: rect(S.x + 4, S.y + 44, S.w - 8, 28, { r: 4, fill: "none", stroke: C.sv, sw: 2, dash: "4 3" }),
      konten: rect(X + 6, 183, 52, 28, { r: 6, fill: C.bg }) + text(X + 32, 201, "Template", { size: 10, anchor: "middle", fill: C.muted, weight: 500 }) + rect(X + 6, 343, 52, 28, { r: 6, fill: C.svTint }) + text(X + 32, 361, "Konten", { size: 10, anchor: "middle", fill: C.svDark, weight: 700 }) +
        rect(84, 164, 396, 364, { r: 0, fill: C.paper }) + head("Konten") + rect(P.x, 214, P.w, 36, { r: 6, fill: C.bg }) + text(P.x + 12, 237, "Mempelai", { size: 14, weight: 700 }) +
        text(P.x, 274, "Nama panggilan", { size: 12, fill: C.muted }) + input(P.x, 282, P.w, "", "Rani", { focus: true }) + text(P.x, 340, "Nama lengkap dan gelar", { size: 12, fill: C.muted }) + input(P.x, 348, P.w, "", "Rani Putri, S.Psi."),
      tb: rect(S.x + 10, S.y + 150, S.w - 20, 120, { r: 6, fill: "none", stroke: C.sv, sw: 2 }) + rect(S.x + 10, S.y + 120, S.w - 20, 28, { r: 4, fill: "#202124" }) +
        text(S.x + 18, S.y + 139, "Isi", { size: 11, fill: C.paper, weight: 600 }) + text(S.x + 46, S.y + 139, "↑", { size: 13, fill: C.paper }) + text(S.x + 66, S.y + 139, "↓", { size: 13, fill: C.paper }) + text(S.x + 88, S.y + 139, "Sembunyikan", { size: 11, fill: C.paper, weight: 600 }),
      gone: rect(S.x + 6, S.y + 116, S.w - 12, 160, { r: 0, fill: C.tint }) + toast(X + 300, 470, "Galeri Foto disembunyikan.", { w: 300 }) + text(X + 580, 495, "Urungkan", { size: 14, fill: "#8ab4f8", weight: 700, anchor: "end" })
    },
    steps: [
      { caption: "Pastikan tombol Klik aktif di rel (bukan Klik mati).", at: at("Klik aktif"), show: ["tmpl"], dur: 3.2 },
      { caption: "Arahkan mouse ke nama mempelai di pratinjau.", at: [S.x + 98, S.y + 58], show: ["hover"] },
      { caption: "Klik namanya. Form Mempelai terbuka, kursor di Nama panggilan.", at: [S.x + 98, S.y + 58], click: true, show: ["konten"], hide: ["tmpl", "hover"], dur: 3.8 },
      { caption: "Klik bagian lain, misalnya Galeri Foto. Muncul toolbar kecil.", at: [S.x + 100, S.y + 230], click: true, show: ["tb"], dur: 3.6 },
      { caption: "Isi membuka form, ↑ ↓ memindah bagian, Sembunyikan menutupnya.", at: [S.x + 120, S.y + 134], dur: 4 },
      { caption: "Klik Sembunyikan. Salah klik? Tekan Urungkan di pesan bawah.", at: [S.x + 120, S.y + 134], click: true, show: ["gone"], hide: ["tb"], dur: 4 }
    ]
  },

  // ---------------------------------------------------------------- Urungkan dan Kosongkan
  "editor-urungkan-kosongkan": {
    title: "Mengurungkan perubahan dan mengosongkan halaman",
    base: [...base("Konten"), head("Konten"), rect(P.x, 214, P.w, 36, { r: 6, fill: C.bg }), text(P.x + 12, 237, "Mempelai", { size: 14, weight: 700 }), cover()],
    els: {
      v1: text(S.x + S.w / 2, S.y + 70, "Rani & Dimaz", { size: 20, anchor: "middle", weight: 700, fill: C.cocoa }) + input(P.x, 282, P.w, "Nama panggilan", "Dimaz"),
      v2: rect(S.x, S.y + 40, S.w, 50, { r: 0, fill: C.tint }) + text(S.x + S.w / 2, S.y + 70, "Rani & Dimas", { size: 20, anchor: "middle", weight: 700, fill: C.cocoa }) + rect(P.x, 270, P.w, 50, { r: 0, fill: C.paper }) + input(P.x, 282, P.w, "Nama panggilan", "Dimas"),
      tipU: note(170, 470, "Urungkan (Ctrl+Z)", at("↶ ↷")[0] - 6, at("↶ ↷")[1]),
      dlg: dim() + card(240, 170, 480, 220, "Kosongkan halaman?") + rect(260, 220, 440, 48, { r: 6, fill: C.warnTint }) + text(272, 249, "Isi undangan dihapus. Ucapan dan RSVP aman. Bisa diurungkan.", { size: 13, fill: C.warn }) +
        button(260, 296, "Kosongkan halaman", { variant: "danger", w: 180 }) + button(452, 296, "Batal", { variant: "quiet", w: 80 }),
      empty: rect(84, 164, 396, 364, { r: 0, fill: C.paper }) + head("Template") + [0, 1, 2, 3].map((i) => rect(P.x + (i % 2) * 184, 220 + Math.floor(i / 2) * 140, 176, 130, { r: 8, fill: C.bg, stroke: C.line })).join("") +
        rect(S.x, S.y, S.w, S.h, { r: 4, fill: C.paper }) + toast(X + 300, 470, "Halaman dikosongkan.", { w: 300 }) + text(X + 580, 495, "Urungkan", { size: 14, fill: "#8ab4f8", weight: 700, anchor: "end" })
    },
    steps: [
      { caption: "Salah ketik atau salah ubah? Lihat tombol panah di rel kiri.", show: ["v1"], at: at("↶ ↷"), dur: 3.4 },
      { caption: "Klik ↶ Urungkan, atau tekan Ctrl+Z (Mac: Cmd+Z) di luar kolom isian.", at: [at("↶ ↷")[0] - 8, at("↶ ↷")[1]], click: true, show: ["v2", "tipU"], dur: 4.2 },
      { caption: "Mau mulai dari nol? Klik Kosongkan di rel.", at: at("Kosongkan"), click: true, show: ["dlg"], hide: ["tipU"] },
      { caption: "Baca pesannya, lalu klik Kosongkan halaman. Batal untuk mundur.", at: [350, 313], click: true, dur: 3.8 },
      { caption: "Halaman kosong, kembali ke Template. Urungkan bila berubah pikiran.", hide: ["dlg"], show: ["empty"], at: [X + 545, 490], dur: 4.2 }
    ]
  },

  // ---------------------------------------------------------------- Dijeda
  "editor-dijeda-timpa": {
    title: "NikahKit dijeda karena kode diubah manual",
    base: [...base("Konten", { saving: "Dijeda" }), head("Konten"), cover(), text(S.x + S.w / 2, S.y + 70, "Rani & Dimas", { size: 20, anchor: "middle", weight: 700, fill: C.cocoa })],
    els: {
      banner: rect(P.x, 214, P.w, 96, { r: 6, fill: C.warnTint, stroke: "#f0d48a" }) + text(P.x + 12, 238, "Kode diubah di tab Code.", { size: 13, weight: 700, fill: C.warn }) + text(P.x + 186, 238, "NikahKit dijeda.", { size: 13, fill: C.warn }) +
        button(P.x + 12, 256, "Lihat di kode", { variant: "ghost", w: 130, h: 32, size: 13 }) + button(P.x + 152, 256, "Timpa dengan NikahKit", { w: 190, h: 32, size: 13 }),
      foot: ring(X + 4, Y + BH - 22, 60, 18),
      code: rect(X + 1, Y + 77, 459, BH - 78, { r: 0, fill: "#1e1e1e" }) + text(X + 20, Y + 110, "Code", { size: 13, fill: "#8ab4f8", weight: 700 }) +
        ['<section class="nk-cover">', '  <h1>Rani &amp; Dimas</h1>', '  <p>Teks tambahan manual</p>', "</section>"].map((l, i) => rect(X + 16, Y + 136 + i * 24, 420, 22, { r: 0, fill: i === 2 ? "rgba(138,180,248,.3)" : "none" }) + text(X + 22, Y + 152 + i * 24, l.replace("&amp;", "&"), { size: 12, fill: "#e8eaed", mono: true })).join(""),
      fixed: rect(P.x, 210, P.w, 104, { r: 0, fill: C.paper }) + rect(X + 4, Y + BH - 22, 70, 20, { r: 0, fill: C.bg }) + circle(X + 12, Y + BH - 12, 3.5, { fill: C.ok }) + text(X + 19, Y + BH - 8, "Tersimpan", { size: 9, fill: C.muted })
    },
    steps: [
      { caption: "Status di kaki rel berubah jadi Dijeda. NikahKit berhenti menulis.", show: ["foot"], at: [X + 34, Y + BH - 12], dur: 3.6 },
      { caption: "Di panel muncul: Kode diubah di tab Code. NikahKit dijeda.", show: ["banner"], hide: ["foot"], at: [P.x + 150, 240], dur: 3.6 },
      { caption: "Klik Lihat di kode untuk melihat bagian yang diubah manual.", at: [P.x + 77, 272], click: true, show: ["code"], dur: 3.6 },
      { caption: "Kembali ke tab NikahKit. Pilih Timpa dengan NikahKit.", at: [P.x + 247, 272], click: true, hide: ["code"], dur: 3.6 },
      { caption: "Perubahan manual dibuang, status kembali Tersimpan.", show: ["fixed"], hide: ["banner"], at: [X + 40, Y + BH - 12], dur: 3.8 }
    ]
  }
};
