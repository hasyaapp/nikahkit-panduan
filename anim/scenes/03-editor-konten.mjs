// Editor dan Konten: peta editor, pilih template, isi Mempelai, tambah acara, galeri, RSVP dan hadiah.
import { C, browser, editor, editorPhone, railAt, rect, text, button, card, ring, note, toast, input, badge, para, line, circle, dim } from "../lib.mjs";

const X = 40, Y = 24, BW = 880, BH = 500;
const URL = "app.scalev.com/pages/365671";
const S = editorPhone(X, Y, BW, BH); // phone screen
const PX = X + 80, PW = 364;          // panel x / width

const shell = (o) => [browser(X, Y, BW, BH, URL, { tab: "Scalev" }), editor(X, Y, BW, BH, o)];
const head = (t) => text(PX, Y + 206, t, { size: 15, weight: 700 });
// One Konten accordion row.
const acc = (y, label, ok, open) => rect(PX, y, PW, 30, { r: 6, fill: open ? C.svTint : C.paper, stroke: C.line }) +
  text(PX + 12, y + 20, (open ? "▾ " : "▸ ") + label, { size: 13, weight: 600 }) +
  badge(PX + PW - (ok ? 64 : 96), y + 5, ok ? "Terisi" : "Belum diisi", ok ? { fill: C.okTint, fg: C.ok } : { fill: C.warnTint, fg: C.warn });
// Invitation cover on the phone screen.
const cover = (names, o = {}) => rect(S.x, S.y, S.w, S.h, { r: 6, fill: o.fill ?? "#efe3d6" }) +
  text(S.x + S.w / 2, S.y + 70, "The Wedding of", { size: 11, anchor: "middle", fill: C.muted }) +
  text(S.x + S.w / 2, S.y + 108, names, { size: 22, anchor: "middle", weight: 700, fill: C.cocoa }) +
  text(S.x + S.w / 2, S.y + 136, "Minggu, 14 Februari 2027", { size: 11, anchor: "middle", fill: C.muted }) +
  rect(S.x + 48, S.y + 220, 100, 28, { r: 14, fill: C.cocoa }) + text(S.x + 98, S.y + 239, "Buka Undangan", { size: 11, anchor: "middle", fill: C.paper });

export const scenes = {
  "editor-peta": {
    title: "Peta editor NikahKit di Scalev",
    base: [...shell({ railActive: "Konten" }), head("Konten"),
      acc(Y + 222, "Sampul", true), acc(Y + 258, "Mempelai", true), acc(Y + 294, "Acara & Tanggal", true),
      acc(Y + 330, "Salam Pembuka", true), acc(Y + 366, "Galeri Foto", false), cover("Rani & Dimas")],
    els: {
      nTab: ring(X + 310, Y + 132, 64, 26) + note(X + 430, Y + 116, "Tab NikahKit", X + 378, Y + 140),
      nRail: ring(X + 6, Y + 171, 52, 188) + note(X + 150, Y + 400, "Menu: Template sampai Konten", X + 62, Y + 270, { w: 240 }),
      nTools: ring(X + 6, Y + 368, 52, 128) + note(X + 150, Y + 440, "Alat: Bagikan, Urungkan, Pratinjau...", X + 62, Y + 430, { w: 290 }),
      nFoot: ring(X + 4, Y + BH - 20, 60, 16) + note(X + 150, Y + 470, "Status: Tersimpan", X + 66, Y + BH - 12, { w: 160 }),
      nPrev: ring(S.x - 12, S.y - 40, 220, 350, { r: 30 }) + note(X + 560, Y + 116, "Pratinjau undangan", S.x + 98, S.y - 44, { w: 170 }),
      nPanel: ring(PX - 4, Y + 190, PW + 8, 210) + note(X + 150, Y + 430, "Panel menu yang terbuka", PX + 180, Y + 404, { w: 210 })
    },
    steps: [
      { caption: "Di editor halaman Scalev (HTML Mode), buka tab NikahKit.", show: ["nTab"], at: [X + 340, Y + 146], click: true },
      { caption: "Kolom kiri adalah menu: Template, Gaya, Audio, Media, Lapisan, Konten.", hide: ["nTab"], show: ["nRail"], at: railAt(X, Y, "Konten") },
      { caption: "Panel di tengah berisi isian menu yang sedang dibuka.", hide: ["nRail"], show: ["nPanel"], at: [PX + 120, Y + 236] },
      { caption: "Di bawah menu ada alat: Bagikan, Urungkan, Pratinjau, Klik, Kosongkan.", hide: ["nPanel"], show: ["nTools"], at: railAt(X, Y, "Bagikan") },
      { caption: "Paling bawah: status simpan. Tersimpan berarti aman.", hide: ["nTools"], show: ["nFoot"], at: [X + 30, Y + BH - 12] },
      { caption: "Di kanan, pratinjau undangan berubah setiap kamu mengetik.", hide: ["nFoot"], show: ["nPrev"], at: [S.x + 98, S.y + 120], dur: 3.6 }
    ]
  },

  "editor-pilih-template": {
    title: "Memilih template NikahKit",
    base: [...shell({ railActive: "Template", phone: true, screenFill: "#ffffff" }), head("Template"),
      rect(PX, Y + 220, 180, 30, { r: 6, fill: C.soft }), rect(PX + 2, Y + 222, 88, 26, { r: 5, fill: C.paper }),
      text(PX + 46, Y + 240, "Template", { size: 12, anchor: "middle", weight: 600 }), text(PX + 135, Y + 240, "Marketing", { size: 12, anchor: "middle", fill: C.muted }),
      ...[["Dasar", "#f3eee6", "20 bagian"], ["Folio", "#e8edf2", "20 bagian"], ["Galeri Putih", "#fafafa", "20 bagian"], ["Sogan", "#e9dccb", "19 bagian"]].map(([n, f, d], i) => {
        const cx = PX + (i % 2) * 186, cy = Y + 296 + Math.floor(i / 2) * 106;
        return rect(cx, cy, 176, 98, { r: 8, stroke: C.line }) + rect(cx + 8, cy + 8, 50, 62, { r: 4, fill: f, stroke: C.line }) + text(cx + 68, cy + 30, n, { size: 13, weight: 600 }) +
          text(cx + 68, cy + 50, d, { size: 10, fill: C.muted });
      })],
    els: {
      warn: rect(PX, Y + 256, PW, 32, { r: 6, fill: C.warnTint }) + text(PX + 10, Y + 276, "Halaman berisi HTML lain. Memilih template akan menggantinya.", { size: 10.5, fill: C.warn }),
      dlg: dim() + card(250, 210, 460, 150, "Ganti isi halaman dengan Folio?") + text(270, 270, "HTML yang sekarang ada di halaman akan diganti.", { size: 13, fill: C.muted }) +
        button(520, 300, "Batal", { variant: "ghost", w: 80 }) + button(612, 300, "Ganti", { w: 80 }),
      folio: cover("Rani & Dimas", { fill: "#e8edf2" }) + badge(PX + 186 + 68, Y + 360, "Dipakai", { fill: C.okTint, fg: C.ok }),
      sogan: cover("Rani & Dimas", { fill: "#e9dccb" }) + badge(PX + 186 + 68, Y + 466, "Dipakai", { fill: C.okTint, fg: C.ok }) + rect(PX + 254, Y + 356, 70, 24, { r: 0, fill: C.paper }),
      t1: toast(530, 470, "Template diganti ke Sogan.", { w: 330 }) + text(778, 495, "Urungkan", { size: 13, fill: "#8ab4f8", weight: 700 })
    },
    steps: [
      { caption: "Klik Template di menu kiri. Pastikan pilihan Template yang aktif.", at: railAt(X, Y, "Template"), click: true, show: ["warn"] },
      { caption: "Klik kartu template yang kamu suka, misalnya Folio.", at: [PX + 270, Y + 330], click: true },
      { caption: "Halaman masih berisi HTML lain? Muncul konfirmasi. Klik Ganti.", show: ["dlg"], at: [652, 317], click: true, dur: 3.6 },
      { caption: "Template terpasang. Kartunya bertanda Dipakai, pratinjau ikut berubah.", hide: ["dlg", "warn"], show: ["folio"], dur: 3.4 },
      { caption: "Mau ganti nanti? Klik kartu lain. Isian undangan tetap terbawa.", at: [PX + 270, Y + 436], click: true, hide: ["folio"], show: ["sogan", "t1"], dur: 3.8 }
    ]
  },

  "editor-isi-mempelai": {
    title: "Mengisi nama mempelai di Konten",
    base: [...shell({ railActive: "Konten" }), head("Konten"), acc(Y + 222, "Sampul", true)],
    els: {
      openA: acc(Y + 258, "Mempelai", true, true) + text(PX + 4, Y + 312, "Mempelai Wanita", { size: 13, weight: 700 }) +
        input(PX, Y + 340, PW, "Nama panggilan", "Rani") + text(PX, Y + 390, "Tampil di sampul.", { size: 11, fill: C.muted }) +
        input(PX, Y + 420, PW, "Nama lengkap dan gelar", "Rani Ayu, S.Psi."),
      focus: ring(PX - 2, Y + 338, PW + 4, 38, { r: 6 }),
      typed: rect(PX + 2, Y + 342, PW - 4, 30, { r: 3, fill: C.paper }) + text(PX + 10, Y + 362, "Sinta", { size: 14 }),
      before: cover("Rani & Dimas"),
      after: cover("Sinta & Dimas") + ring(S.x + 30, S.y + 88, 136, 28)
    },
    steps: [
      { caption: "Klik Konten di menu kiri. Daftar bagian undangan muncul.", at: railAt(X, Y, "Konten"), click: true, show: ["openA", "before"] },
      { caption: "Mempelai biasanya sudah terbuka. Bila tertutup, klik namanya.", at: [PX + 80, Y + 273] },
      { caption: "Klik kotak Nama panggilan di bagian Mempelai Wanita. Hapus nama contoh.", at: [PX + 120, Y + 357], click: true, show: ["focus"] },
      { caption: "Ketik nama panggilan klien, misalnya Sinta.", type: ["typed"], show: ["typed"], dur: 3.4 },
      { caption: "Sampul di pratinjau langsung berubah.", hide: ["before", "focus"], show: ["after"], dur: 3.6 }
    ]
  },

  "editor-tambah-acara": {
    title: "Menambah acara di Acara & Tanggal",
    base: [...shell({ railActive: "Konten" }), head("Konten"), acc(Y + 216, "Acara & Tanggal", true, true),
      text(PX, Y + 268, "Zona waktu", { size: 12, fill: C.muted }),
      rect(PX + 90, Y + 252, 120, 24, { r: 5, fill: C.paper, stroke: C.line }), text(PX + 100, Y + 269, "WIB", { size: 12, weight: 700 }), text(PX + 196, Y + 269, "▾", { size: 12, anchor: "middle", fill: C.muted }),
      rect(PX, Y + 286, PW, 30, { r: 6, fill: C.bg, stroke: C.line }), text(PX + 12, Y + 306, "Akad Nikah", { size: 13, weight: 700 }), text(PX + PW - 66, Y + 306, "▲  ▼  🗑", { size: 12, fill: C.muted })],
    els: {
      add: button(PX, Y + 326, "+ Tambah acara", { variant: "ghost", w: PW, h: 30, size: 13 }),
      item: rect(PX, Y + 326, PW, 30, { r: 6, fill: C.bg, stroke: C.line }) + text(PX + 12, Y + 346, "Acara 2", { size: 13, weight: 700 }) +
        input(PX, Y + 380, PW, "Nama acara", "mis. Akad Nikah", { placeholder: true }),
      name: rect(PX + 2, Y + 382, PW - 4, 30, { r: 3, fill: C.paper }) + text(PX + 10, Y + 401, "Resepsi", { size: 14 }) + rect(PX + 2, Y + 328, 120, 26, { r: 0, fill: C.bg }) + text(PX + 12, Y + 346, "Resepsi", { size: 13, weight: 700 }),
      times: input(PX, Y + 436, 175, "Mulai", "12/12/2026 11.00") + input(PX + 189, Y + 436, 175, "Selesai (opsional)", "12/12/2026 10.00"),
      err: text(PX + 189, Y + 486, "Jam selesai harus setelah jam mulai.", { size: 10.5, fill: C.bad, weight: 600 }),
      fix: rect(PX + 190, Y + 437, 172, 32, { r: 3, fill: C.paper }) + text(PX + 199, Y + 458, "12/12/2026 14.00", { size: 14 }) + rect(PX + 186, Y + 476, 180, 16, { r: 0, fill: C.paper }),
      prev: rect(S.x, S.y, S.w, S.h, { r: 6, fill: "#efe3d6" }) + text(S.x + 98, S.y + 40, "Rangkaian Acara", { size: 14, anchor: "middle", weight: 700, fill: C.cocoa }) +
        rect(S.x + 14, S.y + 60, 168, 80, { r: 8 }) + text(S.x + 98, S.y + 88, "Akad Nikah", { size: 13, anchor: "middle", weight: 700 }) + text(S.x + 98, S.y + 110, "08.00 WIB", { size: 11, anchor: "middle", fill: C.muted }) +
        rect(S.x + 14, S.y + 152, 168, 80, { r: 8 }) + text(S.x + 98, S.y + 180, "Resepsi", { size: 13, anchor: "middle", weight: 700 }) + text(S.x + 98, S.y + 202, "11.00 - 14.00 WIB", { size: 11, anchor: "middle", fill: C.muted })
    },
    steps: [
      { caption: "Di Konten, buka Acara & Tanggal. Pilih Zona waktu: WIB, WITA, atau WIT.", at: [PX + 150, Y + 264], click: true, show: ["add"] },
      { caption: "Acara contoh yang tak dipakai sudah dihapus. Klik Tambah acara.", at: [PX + 182, Y + 341], click: true, hide: ["add"], show: ["item"], dur: 3.6 },
      { caption: "Isi Nama acara, misalnya Resepsi.", at: [PX + 120, Y + 397], click: true, show: ["name"], type: ["name"] },
      { caption: "Isi Mulai dan Selesai. Selesai lebih awal? Muncul pesan merah.", at: [PX + 270, Y + 452], click: true, show: ["times", "err"], dur: 3.8 },
      { caption: "Perbaiki jam selesai. Pesan hilang, acara tampil di pratinjau.", hide: ["err"], show: ["fix", "prev"], dur: 3.8 }
    ]
  },

  "editor-isi-galeri": {
    title: "Mengisi Galeri Foto",
    base: [...shell({ railActive: "Konten" }), head("Konten"), acc(Y + 216, "Galeri Foto", false, true),
      input(PX, Y + 272, PW, "Teks pengantar (opsional)", "")],
    els: {
      add0: text(PX, Y + 330, "Foto galeri (0)", { size: 12, fill: C.muted }) + button(PX, Y + 340, "Tambah foto", { variant: "ghost", w: PW, h: 30, size: 13 }),
      media: dim() + card(220, 120, 520, 340, "Pilih foto") +
        [0, 1, 2, 3, 4, 5].map((i) => rect(244 + (i % 3) * 160, 170 + Math.floor(i / 3) * 110, 150, 100, { r: 6, fill: ["#d7c4b0", "#c9d6cf", "#e2d2c8", "#cdd5e0", "#e8dcc2", "#d6cbd9"][i] })).join("") +
        text(244, 410, "Atau tempel tautan https", { size: 12, fill: C.muted }) + button(600, 400, "Pakai foto", { w: 116, color: "#9aa0a6" }),
      sel: ring(244, 170, 150, 100) + ring(404, 170, 150, 100) + ring(564, 170, 150, 100) + button(600, 400, "Pakai 3 foto", { w: 116 }),
      rows: rect(PX, Y + 316, PW, 60, { r: 0, fill: C.paper }) + text(PX, Y + 330, "Foto galeri (3)", { size: 12, fill: C.muted }) +
        [0, 1, 2].map((i) => rect(PX, Y + 340 + i * 44, 40, 38, { r: 4, fill: ["#d7c4b0", "#c9d6cf", "#e2d2c8"][i] }) + rect(PX + 50, Y + 344 + i * 44, 200, 30, { r: 4, stroke: C.line }) +
          text(PX + 60, Y + 364 + i * 44, "Deskripsi foto", { size: 12, fill: C.muted }) + text(PX + 262, Y + 364 + i * 44, "▲  🗑", { size: 12, fill: C.muted })).join("") +
        text(PX, Y + 482, "Foto pertama tampil paling besar.", { size: 11, fill: C.muted }) +
        rect(PX + PW - 100, Y + 218, 98, 26, { r: 0, fill: C.svTint }) + badge(PX + PW - 64, Y + 221, "Terisi", { fill: C.okTint, fg: C.ok }),
      prev: rect(S.x, S.y, S.w, S.h, { r: 6, fill: "#f6efe6" }) + text(S.x + 98, S.y + 34, "Galeri Foto", { size: 14, anchor: "middle", weight: 700, fill: C.cocoa }) +
        rect(S.x + 12, S.y + 50, 172, 120, { r: 6, fill: "#d7c4b0" }) + rect(S.x + 12, S.y + 178, 84, 80, { r: 6, fill: "#c9d6cf" }) + rect(S.x + 100, S.y + 178, 84, 80, { r: 6, fill: "#e2d2c8" })
    },
    steps: [
      { caption: "Di Konten, buka Galeri Foto. Foto contoh sudah dihapus. Klik Tambah foto.", at: [PX + 182, Y + 355], click: true, show: ["add0"], dur: 3.6 },
      { caption: "Jendela foto dari Media Scalev terbuka.", show: ["media"] },
      { caption: "Klik foto satu per satu untuk memilihnya.", at: [630, 220], click: true, show: ["sel"] },
      { caption: "Klik Pakai 3 foto (angkanya sesuai jumlah pilihan).", at: [658, 417], click: true },
      { caption: "Foto masuk ke daftar. Foto pertama tampil paling besar.", hide: ["media", "sel", "add0"], show: ["rows", "prev"], dur: 3.8 }
    ]
  },

  "editor-rsvp-hadiah": {
    title: "Mengatur RSVP dan Amplop Digital",
    base: [...shell({ railActive: "Konten" }), head("Konten")],
    els: {
      rsvp: acc(Y + 216, "RSVP & Ucapan", true, true) +
        rect(PX, Y + 254, PW, 28, { r: 6, fill: C.okTint }) + text(PX + 10, Y + 273, "Tersambung. ID: 365671", { size: 12, fill: C.ok, weight: 600 }) +
        input(PX, Y + 310, PW, "Isi form", "Ucapan + konfirmasi hadir") + input(PX, Y + 368, PW, "Jumlah tamu paling banyak per undangan", "2 orang") +
        text(PX, Y + 428, "Pilihan \"Masih ragu\"", { size: 13 }) + rect(PX + PW - 44, Y + 414, 40, 20, { r: 10, fill: "#bdc1c6" }) + circle(PX + PW - 34, Y + 424, 8, { fill: C.paper }),
      on: rect(PX + PW - 44, Y + 414, 40, 20, { r: 10, fill: C.sv }) + circle(PX + PW - 14, Y + 424, 8, { fill: C.paper }),
      gifts: rect(PX - 2, Y + 210, PW + 4, 288, { r: 0, fill: C.paper }) + acc(Y + 216, "Amplop Digital", true, true) +
        rect(PX, Y + 256, PW, 30, { r: 6, fill: C.bg, stroke: C.line }) + text(PX + 12, Y + 276, "BCA", { size: 13, weight: 700 }) +
        input(PX, Y + 314, PW, "Bank atau e-wallet", "BCA") + input(PX, Y + 372, PW, "Nomor rekening", "1234567890") + input(PX, Y + 430, PW, "Nama pemilik rekening", "Rani Ayu"),
      num: rect(PX + 2, Y + 374, PW - 4, 30, { r: 3, fill: C.paper }) + text(PX + 10, Y + 393, "7712003456", { size: 14 }),
      holder: rect(PX + 2, Y + 432, PW - 4, 30, { r: 3, fill: C.paper }) + text(PX + 10, Y + 451, "Sinta Maharani", { size: 14 }),
      ok: rect(S.x, S.y, S.w, S.h, { r: 6, fill: "#f6efe6" }) + text(S.x + 98, S.y + 40, "Amplop Digital", { size: 14, anchor: "middle", weight: 700, fill: C.cocoa }) +
        rect(S.x + 14, S.y + 60, 168, 96, { r: 8 }) + text(S.x + 30, S.y + 88, "BCA", { size: 14, weight: 700, fill: "#0060af" }) + text(S.x + 30, S.y + 112, "7712003456", { size: 13 }) +
        text(S.x + 30, S.y + 136, "a.n. Sinta Maharani", { size: 11, fill: C.muted })
    },
    steps: [
      { caption: "Buka RSVP & Ucapan. Pastikan ada tulisan hijau Tersambung. ID: (ID halaman).", show: ["rsvp"], at: [PX + 120, Y + 268] },
      { caption: "Pilih Isi form dan jumlah tamu paling banyak per undangan.", at: [PX + 200, Y + 385], click: true },
      { caption: "Nyalakan sakelar yang kamu perlukan, misalnya Pilihan \"Masih ragu\".", at: [PX + PW - 24, Y + 424], click: true, show: ["on"] },
      { caption: "Lalu buka Amplop Digital. Rekening contoh sudah ada.", hide: ["rsvp", "on"], show: ["gifts"], at: [PX + 80, Y + 231], click: true },
      { caption: "Ganti Nomor rekening dan Nama pemilik rekening dengan data klien.", at: [PX + 120, Y + 389], click: true, show: ["num", "holder"], type: ["num", "holder"], dur: 3.8 },
      { caption: "Kartu rekening di pratinjau ikut berubah. Cek ulang nomornya.", show: ["ok"], dur: 3.6 }
    ]
  }
};
