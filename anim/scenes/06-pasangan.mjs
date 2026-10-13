// Dashboard pasangan (/dashboard): login, tab Beranda/Kirim/Tamu/Ucapan/Hari-H, Pelacakan, Pengaturan.
// Label mengikuti server/pages/src/panel, dashboard, share, checkin dan nikahkit/ext/pin.js.
import { C, W, browser, editor, railAt, panelArea, phone, rect, text, para, line, circle, button, input, badge, toast, card, ring, note, dim } from "../lib.mjs";

// Ponsel di tengah panggung. Layar: x 352..608, y 54..506.
const PX = 340, PY = 14, PW = 280, PH = 516;
const S = { x: PX + 12, y: PY + 40, w: PW - 24, h: PH - 64 };
const SB = S.y + S.h; // bawah layar
const TABS = ["Beranda", "Kirim", "Tamu", "Ucapan", "Hari-H"];
const tabX = (i) => S.x + 22 + i * 42.5;
const tabAt = (name) => [tabX(TABS.indexOf(name)), SB - 26];
const tabbar = (active) => rect(S.x, SB - 46, S.w, 46, { r: 0, fill: C.paper }) + line(S.x, SB - 46, S.x + S.w, SB - 46) +
  TABS.map((t, i) => (t === active ? rect(tabX(i) - 17, SB - 40, 34, 18, { r: 9, fill: "#d9fdd3" }) : "") +
    rect(tabX(i) - 6, SB - 37, 12, 12, { r: 3, fill: "none", stroke: t === active ? C.waDark : C.muted, sw: 1.5 }) +
    text(tabX(i), SB - 9, t, { size: 9, anchor: "middle", fill: t === active ? C.ink : C.muted, weight: t === active ? 700 : 500 })).join("") +
  circle(S.x + S.w - 20, SB - 26, 13, { fill: "#d9fdd3" }) + text(S.x + S.w - 20, SB - 22, "RA", { size: 10, anchor: "middle", fill: C.waDark, weight: 700 });
const avatarAt = [S.x + S.w - 20, SB - 26];
const head = (title) => rect(S.x, S.y, S.w, 40, { r: 0, fill: C.paper }) + line(S.x, S.y + 40, S.x + S.w, S.y + 40) + text(S.x + 14, S.y + 26, title, { size: 16, weight: 700 });
const screen = (fill = C.paper) => rect(S.x, S.y, S.w, S.h, { r: 6, fill });
const row = (y, name, sub, right, o = {}) => circle(S.x + 26, y + 20, 15, { fill: o.av ?? "#e8e0ff" }) +
  text(S.x + 26, y + 24, name.split(" ").slice(0, 2).map((s) => s[0]).join(""), { size: 10, anchor: "middle", fill: "#5e47de", weight: 700 }) +
  text(S.x + 50, y + 17, name, { size: 13, weight: 600 }) + text(S.x + 50, y + 34, sub, { size: 10.5, fill: C.muted }) +
  (right ? badge(S.x + S.w - 10 - Math.round(right.length * 6.6 + 16), y + 8, right, o.badge ?? {}) : "") + line(S.x + 50, y + 42, S.x + S.w, y + 42);
const side = (x, y, lines, o = {}) => para(x, y, lines, { size: 14, fill: o.fill ?? C.muted, lh: 20 });

export const scenes = {
  // 1. Member: salin pesan untuk pengantin dari NikahKit.
  "pasangan-salin-pesan": (() => {
    const X = 20, Y = 14, BW = 920, BH = 510, P = panelArea(X, Y);
    const [bx, by] = railAt(X, Y, "Bagikan");
    return {
      title: "Menyalin pesan serah terima untuk pengantin",
      base: [browser(X, Y, BW, BH, "app.scalev.com/pages/365671", { tab: "Scalev" }), editor(X, Y, BW, BH, { railActive: "" })],
      els: {
        panel: rect(P.x - 14, P.y - 12, P.w + 14, 300, { r: 0, fill: C.paper }) +
          text(P.x, P.y + 10, "Bagikan", { size: 16, weight: 700 }) +
          text(P.x, P.y + 44, "Untuk pengantin", { size: 13, weight: 700 }) +
          button(P.x, P.y + 54, "Kirim undangan", { variant: "ghost", w: 165, h: 32, size: 13 }) + button(P.x + 175, P.y + 54, "Buka Dashboard", { variant: "ghost", w: 165, h: 32, size: 13 }) +
          text(P.x, P.y + 106, "Masuk dengan PIN dashboard.", { size: 12, fill: C.muted }) +
          text(P.x, P.y + 144, "PIN dashboard", { size: 13, weight: 700 }) + button(P.x, P.y + 154, "Kelola PIN dashboard", { w: 340, h: 32, size: 13 }) +
          text(P.x, P.y + 206, "PIN hanya tampil di jendela NikahKit.", { size: 12, fill: C.muted }),
        win: dim() + card(300, 120, 380, 250, "PIN dashboard") + para(320, 180, ["PIN aktif (versi 1). Lupa? Lihat lagi kapan saja."], { size: 13, fill: C.muted }) +
          button(320, 200, "Lihat PIN", { w: 110, h: 32, size: 13 }) + button(440, 200, "Buat PIN baru", { variant: "ghost", w: 130, h: 32, size: 13 }),
        pin: rect(320, 246, 340, 50, { r: 8, fill: C.bg }) + text(340, 280, "482913", { size: 26, weight: 700, mono: true }) +
          rect(574, 256, 28, 28, { r: 6, fill: C.paper, stroke: C.line }) + rect(581, 263, 11, 11, { r: 2, fill: "none", stroke: C.ink, sw: 1.4 }) + rect(585, 267, 11, 11, { r: 2, fill: C.paper, stroke: C.ink, sw: 1.4 }) +
          rect(612, 256, 28, 28, { r: 6, fill: C.paper, stroke: C.line }) + circle(626, 270, 8, { fill: "none", stroke: C.ink, sw: 1.6 }),
        tip: note(560, 312, "Salin pesan untuk pengantin", 626, 288, { w: 210 }),
        ok: toast(320, 384, "Pesan tersalin.", { w: 340 }),
        msg: dim() + card(220, 110, 520, 220, "Contoh isi pesan yang tersalin") +
          para(240, 170, ["Undangan siap: https://domainmu.com/rina-andi", "Kelola undangan (kirim ke tamu, RSVP, ucapan, check-in):", "https://domainmu.com/halaman-dashboard?w=365671&link=…", "PIN: 482913"], { size: 13, lh: 26 }) +
          text(240, 306, "Tempel di chat WhatsApp pengantin.", { size: 13, fill: C.ok, weight: 600 })
      },
      steps: [
        { caption: "Di editor undangan, klik Bagikan di lajur kiri NikahKit.", at: [bx, by], click: true, show: ["panel"] },
        { caption: "Klik Kelola PIN dashboard. Jendela NikahKit terbuka.", at: [P.x + 170, P.y + 170], click: true, show: ["win"] },
        { caption: "Klik Lihat PIN (atau Buat PIN kalau belum ada).", at: [375, 216], click: true, show: ["pin"] },
        { caption: "Klik ikon balon chat: Salin pesan untuk pengantin.", at: [626, 270], click: true, show: ["tip", "ok"], dur: 3.6 },
        { caption: "Pesan berisi link undangan, link dashboard, dan PIN. Tempel di WA.", hide: ["win", "pin", "tip", "ok"], show: ["msg"], dur: 4.2 }
      ]
    };
  })(),

  // 2. Masuk dashboard di HP.
  "pasangan-masuk": {
    title: "Masuk ke Dashboard pasangan dengan link dan PIN",
    base: [rect(0, 0, W, 536, { r: 0, fill: C.bg }), phone(PX, PY, PW, PH), screen(C.bg),
      text(S.x + S.w / 2, S.y + 70, "Kelola undangan", { size: 19, weight: 700, anchor: "middle" }),
      para(S.x + 20, S.y + 98, ["Kirim undangan, lihat RSVP dan ucapan,", "dan catat tamu di hari-H."], { size: 11, fill: C.muted }),
      input(S.x + 16, S.y + 160, S.w - 32, "Link undangan", "https://domain-anda.com/…", { placeholder: true }),
      input(S.x + 16, S.y + 226, S.w - 32, "PIN atau kode staff", "••••••", { placeholder: true }),
      button(S.x + 16, S.y + 276, "Masuk", { w: S.w - 32, h: 36, r: 18, variant: "wa", color: C.wa }),
      text(S.x + S.w / 2, SB - 16, "PIN hanya diingat selama tab ini terbuka.", { size: 9.5, anchor: "middle", fill: C.muted }),
      side(40, 120, ["Buka link dashboard", "dari pesan WhatsApp."]), side(660, 120, ["PIN pasangan: 6 angka.", "Kode staff: 8 huruf/angka,", "hanya membuka Hari-H."])],
    els: {
      link: rect(S.x + 17, S.y + 161, S.w - 34, 32, { r: 4 }) + text(S.x + 26, S.y + 182, "https://domainmu.com/rina-andi", { size: 12 }),
      pin: rect(S.x + 17, S.y + 227, S.w - 34, 32, { r: 4, stroke: C.sv, sw: 2 }) + text(S.x + 26, S.y + 249, "• • • • • •", { size: 14 }),
      err: text(S.x + S.w / 2, S.y + 336, "PIN salah.", { size: 12, anchor: "middle", fill: C.bad }),
      home: screen() + head("Beranda") + text(S.x + 14, S.y + 70, "Ringkasan undangan", { size: 14, weight: 700 }) +
        text(S.x + 14, S.y + 90, "45 hari lagi · Akad, Sabtu, 28 November…", { size: 10, fill: C.ok }) +
        rect(S.x + 12, S.y + 102, S.w - 24, 92, { r: 10, fill: C.bg, stroke: C.line }) + text(S.x + 24, S.y + 124, "Estimasi tamu hadir", { size: 11, fill: C.muted }) +
        text(S.x + 24, S.y + 158, "0", { size: 28, weight: 700 }) + text(S.x + 24, S.y + 180, "0 konfirmasi hadir", { size: 10, fill: C.muted }) + tabbar("Beranda")
    },
    steps: [
      { caption: "Pengantin membuka link dashboard dari WA. Layar Kelola undangan muncul.", dur: 3 },
      { caption: "Isi Link undangan. Kalau link dashboard lengkap, kolom ini tidak muncul.", at: [S.x + 120, S.y + 177], click: true, type: ["link"], show: ["link"] },
      { caption: "Ketik PIN 6 angka (atau kode staff 8 karakter).", at: [S.x + 120, S.y + 243], click: true, type: ["pin"], show: ["pin"] },
      { caption: "Salah ketik? Muncul tulisan merah, misalnya PIN salah. Ketik ulang.", at: [S.x + 128, S.y + 294], click: true, show: ["err"] },
      { caption: "PIN benar, tekan Masuk: Beranda terbuka, tab ada di bawah layar HP.", at: [S.x + 128, S.y + 294], click: true, hide: ["err"], show: ["home"], dur: 3.8 }
    ]
  },

  // 3. Beranda.
  "pasangan-beranda": {
    title: "Membaca Beranda Dashboard pasangan",
    base: [rect(0, 0, W, 536, { r: 0, fill: C.bg }), phone(PX, PY, PW, PH), screen(), head("Beranda"),
      text(S.x + 14, S.y + 64, "Ringkasan undangan", { size: 14, weight: 700 }),
      text(S.x + 14, S.y + 82, "45 hari lagi · Resepsi, Sabtu, 28 Nov…", { size: 10, fill: C.ok }),
      rect(S.x + 12, S.y + 92, S.w - 24, 104, { r: 10, fill: C.bg, stroke: C.line }), text(S.x + 24, S.y + 112, "Estimasi tamu hadir", { size: 11, fill: C.muted }),
      text(S.x + 24, S.y + 142, "128", { size: 26, weight: 700 }), text(S.x + 24, S.y + 158, "52 konfirmasi hadir", { size: 10, fill: C.muted }),
      rect(S.x + 24, S.y + 166, 150, 8, { r: 4, fill: C.ok }), rect(S.x + 174, S.y + 166, 30, 8, { r: 0, fill: "#f9ab00" }), rect(S.x + 204, S.y + 166, 20, 8, { r: 4, fill: C.bad }),
      button(S.x + 24, S.y + 178, "Lihat daftar tamu", { w: 110, h: 14, size: 9, r: 7 }),
      ...[["Konfirmasi diterima", "61"], ["Sudah datang", "0"], ["Ucapan & doa", "47"], ["Tamu membuka", "140"]].map(([l, v], i) =>
        rect(S.x + 12 + (i % 2) * 118, S.y + 204 + Math.floor(i / 2) * 58, 112, 52, { r: 8, fill: C.bg, stroke: C.line }) +
        text(S.x + 20 + (i % 2) * 118, S.y + 222 + Math.floor(i / 2) * 58, l, { size: 9.5, fill: C.muted }) + text(S.x + 20 + (i % 2) * 118, S.y + 246 + Math.floor(i / 2) * 58, v, { size: 18, weight: 700 })),
      ...[["Lihat undangan", "Sebagai tamu"], ["Kirim undangan", "Tautan per tamu"], ["Scan tamu datang", "Di lokasi acara"]].map(([a, b], i) =>
        rect(S.x + 12, S.y + 324 + i * 26, S.w - 24, 22, { r: 6, fill: C.paper, stroke: C.line }) + text(S.x + 22, S.y + 339 + i * 26, a, { size: 10.5, weight: 700 }) + text(S.x + S.w - 22, S.y + 339 + i * 26, b, { size: 9.5, fill: C.muted, anchor: "end" })),
      tabbar("Beranda")],
    els: {
      n1: note(40, 70, "Hitung mundur ke acara", S.x + 14, S.y + 80, { w: 200 }),
      n2: note(40, 150, "Jumlah orang, termasuk pendamping", S.x + 14, S.y + 140, { w: 260 }),
      n3: note(680, 230, "Empat angka ringkas", S.x + S.w - 12, S.y + 240, { w: 180 }),
      n4: note(660, 330, "Jalan pintas ke tab lain", S.x + S.w - 12, S.y + 350, { w: 200 }),
      tamu: screen() + head("Tamu") + text(S.x + 14, S.y + 62, "Kehadiran dan ucapan.", { size: 11, fill: C.muted }) +
        row(S.y + 74, "Dewi Lestari", "Selamat ya, semoga sakinah…", "Hadir", { badge: { fill: C.okTint, fg: C.ok } }) +
        row(S.y + 118, "Bapak Andi", "Belum mengirim…", "Belum konfirmasi") + tabbar("Tamu")
    },
    steps: [
      { caption: "Beranda terbuka pertama kali setelah masuk.", dur: 2.8 },
      { caption: "Baris hijau: berapa hari lagi menuju acara utama.", show: ["n1"] },
      { caption: "Estimasi tamu hadir menjumlahkan orang dari RSVP Hadir.", hide: ["n1"], show: ["n2"] },
      { caption: "Kartu angka: konfirmasi, sudah datang, ucapan, tamu membuka.", hide: ["n2"], show: ["n3"] },
      { caption: "Tiga tombol cepat: lihat undangan, kirim, scan tamu.", hide: ["n3"], show: ["n4"] },
      { caption: "Tekan Lihat daftar tamu untuk pindah ke tab Tamu.", at: [S.x + 79, S.y + 185], click: true, hide: ["n4"], show: ["tamu"], dur: 3.6 }
    ]
  },

  // 4. Kirim undangan.
  "pasangan-kirim": {
    title: "Mengirim undangan per tamu lewat WhatsApp",
    base: [rect(0, 0, W, 536, { r: 0, fill: C.bg }), phone(PX, PY, PW, PH), screen(), head("Kirim undangan"),
      circle(S.x + S.w - 50, S.y + 20, 11, { fill: C.soft }), text(S.x + S.w - 50, S.y + 25, "+", { size: 16, anchor: "middle", weight: 700 }),
      text(S.x + S.w - 20, S.y + 25, "⋮", { size: 16, anchor: "middle", weight: 700 }),
      rect(S.x + 12, S.y + 50, S.w - 24, 26, { r: 13, fill: C.soft }), text(S.x + 26, S.y + 67, "Cari tamu", { size: 11, fill: C.muted }),
      badge(S.x + 12, S.y + 84, "Semua 0", { fill: "#d9fdd3", fg: C.waDark }), badge(S.x + 76, S.y + 84, "Belum dikirim 0", { fill: C.soft, fg: C.muted }),
      para(S.x + 20, S.y + 150, ["Belum ada tamu", "Tekan tombol tambah untuk menempel", "daftar tamu dari WhatsApp, Excel,", "atau catatan."], { size: 11, fill: C.muted }),
      tabbar("Kirim"), side(40, 110, ["Daftar tamu Kirim", "tersimpan di HP/browser", "yang dipakai."])],
    els: {
      add: screen() + head("Tambah tamu") + text(S.x + 14, S.y + 64, "Daftar tamu, satu per baris", { size: 11, fill: C.muted }) +
        rect(S.x + 12, S.y + 72, S.w - 24, 120, { r: 6, stroke: C.sv, sw: 2 }) +
        para(S.x + 12, S.y + 214, ["Format: nama - nomor WA - kategori -", "jumlah orang. Hanya nama yang wajib."], { size: 10, fill: C.muted }) +
        button(S.x + 12, S.y + 246, "Simpan daftar", { w: S.w - 24, h: 34, variant: "wa", r: 17 }),
      typed: para(S.x + 20, S.y + 94, ["Keluarga Besar Surya", "Bapak Andi & Ibu Rina - 0812…", "Dewi Lestari - 0821… - Sahabat - 2"], { size: 11, lh: 20 }),
      list: screen() + head("Kirim undangan") + badge(S.x + 12, S.y + 52, "Semua 3", { fill: "#d9fdd3", fg: C.waDark }) + badge(S.x + 82, S.y + 52, "Belum dikirim 3", { fill: C.soft, fg: C.muted }) +
        row(S.y + 80, "Keluarga Besar Surya", "Belum dikirim: Belum ada nomor WA") + row(S.y + 124, "Bapak Andi & Ibu Rina", "Belum dikirim: +62812…") +
        row(S.y + 168, "Dewi Lestari", "Belum dikirim: +62821… · Sahabat") + tabbar("Kirim") + toast(S.x + 12, S.y + 300, "3 tamu siap.", { w: S.w - 24 }),
      chat: screen("#efeae2") + head("Dewi Lestari") + text(S.x + 14, S.y + 56, "+62821…", { size: 10, fill: C.muted }) +
        rect(S.x + 30, S.y + 72, S.w - 44, 170, { r: 8, fill: C.waTint }) +
        para(S.x + 40, S.y + 94, ["Kepada Yth.", "Bapak/Ibu/Saudara/i", "Dewi Lestari", "", "…", "https://domainmu.com/rina-andi", "?to=Dewi+Lestari&u=K7Q2MX", "…"], { size: 11, lh: 18 }) +
        badge(S.x + 12, S.y + 256, "formal", { fill: C.paper, fg: C.muted }) + badge(S.x + 72, S.y + 256, "muslim", { fill: "#d9fdd3", fg: C.waDark }) + badge(S.x + 136, S.y + 256, "nasrani", { fill: C.paper, fg: C.muted }) +
        rect(S.x + 8, SB - 52, S.w - 62, 40, { r: 20, fill: C.paper }) + text(S.x + 22, SB - 27, "Pesan untuk semua tamu…", { size: 11, fill: C.muted }) +
        circle(S.x + S.w - 28, SB - 32, 20, { fill: C.waDark }) + text(S.x + S.w - 28, SB - 27, "➤", { size: 15, anchor: "middle", fill: C.paper }),
      wa: rect(660, 150, 260, 140, { r: 12, fill: C.paper, stroke: C.line }) + text(680, 180, "WhatsApp terbuka", { size: 15, weight: 700, fill: C.waDark }) +
        para(680, 206, ["Pesan sudah terisi. Tekan kirim", "di WhatsApp. Di daftar, tamu ini", "ditandai Terkirim."], { size: 13, fill: C.muted })
    },
    steps: [
      { caption: "Buka tab Kirim. Tekan tombol + (Tambah tamu) di atas.", at: [S.x + S.w - 50, S.y + 20], click: true, show: ["add"] },
      { caption: "Tempel daftar tamu, satu nama per baris.", at: [S.x + 120, S.y + 130], click: true, show: ["typed"], type: ["typed"], dur: 3.6 },
      { caption: "Tekan Simpan daftar. Tautan pribadi tiap tamu disiapkan.", at: [S.x + 128, S.y + 263], click: true, hide: ["add", "typed"], show: ["list"] },
      { caption: "Ketuk nama tamu. Muncul pratinjau pesan dengan tautan khusus dia.", at: [S.x + 110, S.y + 190], click: true, show: ["chat"], dur: 3.6 },
      { caption: "Tekan tombol kirim hijau. WhatsApp terbuka dengan pesan siap kirim.", at: [S.x + S.w - 28, SB - 32], click: true, show: ["wa"], dur: 4 }
    ]
  },

  // 5. Tamu dan ucapan.
  "pasangan-tamu-ucapan": {
    title: "Melihat tamu dan mengelola ucapan",
    base: [rect(0, 0, W, 536, { r: 0, fill: C.bg }), phone(PX, PY, PW, PH), screen(), head("Tamu"),
      rect(S.x + 12, S.y + 50, S.w - 24, 26, { r: 13, fill: C.soft }), text(S.x + 26, S.y + 67, "Cari nama, ucapan, atau nomor HP", { size: 10.5, fill: C.muted }),
      badge(S.x + 12, S.y + 84, "Semua 61", { fill: "#d9fdd3", fg: C.waDark }), badge(S.x + 84, S.y + 84, "Hadir 52", { fill: C.soft, fg: C.muted }), badge(S.x + 150, S.y + 84, "Masih ragu 4", { fill: C.soft, fg: C.muted }),
      row(S.y + 112, "Dewi Lestari", "Selamat ya, semoga sakinah…", "Hadir", { badge: { fill: C.okTint, fg: C.ok } }),
      row(S.y + 156, "Rudi Hartono", "Maaf belum bisa datang", "Tidak hadir", { badge: { fill: C.badTint, fg: C.bad } }),
      row(S.y + 200, "Sari", "Belum mengirim…", "Belum konfirmasi"),
      tabbar("Tamu")],
    els: {
      detail: screen("#efeae2") + rect(S.x, S.y, S.w, 44, { r: 0, fill: C.paper }) + text(S.x + 14, S.y + 27, "←", { size: 16 }) +
        text(S.x + 40, S.y + 20, "Dewi Lestari", { size: 14, weight: 700 }) + text(S.x + 40, S.y + 36, "Hadir · 2 orang · 0821…", { size: 10, fill: C.muted }) +
        text(S.x + S.w - 16, S.y + 28, "⋮", { size: 18, anchor: "middle", weight: 700 }) +
        rect(S.x + 12, S.y + 60, 200, 64, { r: 8, fill: C.paper }) + text(S.x + 22, S.y + 80, "Hadir · 2 orang", { size: 11, weight: 700 }) +
        para(S.x + 22, S.y + 98, ["Selamat ya, semoga sakinah", "mawaddah warahmah."], { size: 11 }) +
        rect(S.x + 12, S.y + 136, S.w - 24, 130, { r: 8, fill: C.paper }) + text(S.x + 22, S.y + 156, "Info tamu", { size: 11, weight: 700, fill: C.muted }) +
        para(S.x + 22, S.y + 176, ["Kehadiran: Hadir", "Jumlah tamu: 2 orang", "Perkiraan datang: Belum diisi", "Check-in: Belum datang"], { size: 11, lh: 20 }) +
        rect(S.x + 8, SB - 48, S.w - 16, 38, { r: 19, fill: C.paper }) + text(S.x + 24, SB - 24, "Tulis balasan", { size: 12, fill: C.muted }),
      menu: rect(S.x + 70, S.y + 40, 178, 128, { r: 10, fill: C.paper, stroke: C.line }) +
        ["Ubah ucapan", "Sembunyikan ucapan", "Buka kunci perangkat", "Hapus data tamu"].map((t, i) => text(S.x + 84, S.y + 66 + i * 30, t, { size: 12, fill: i === 3 ? C.bad : C.ink })).join(""),
      reply: rect(S.x + 8, SB - 92, S.w - 16, 82, { r: 12, fill: C.paper, stroke: C.sv, sw: 2 }) + text(S.x + 20, SB - 72, "Balasan untuk Dewi Lestari", { size: 10, fill: C.muted }) +
        text(S.x + 20, SB - 48, "Terima kasih doanya, Dewi!", { size: 12 }) + circle(S.x + S.w - 30, SB - 34, 15, { fill: C.waDark }) + text(S.x + S.w - 30, SB - 29, "➤", { size: 12, anchor: "middle", fill: C.paper }),
      ok: toast(S.x + 12, S.y + 280, "Balasan berhasil disimpan.", { w: S.w - 24 })
    },
    steps: [
      { caption: "Tab Tamu: semua RSVP dan ucapan, terbaru di atas.", dur: 2.8 },
      { caption: "Ketuk satu tamu untuk membuka detailnya.", at: [S.x + 100, S.y + 130], click: true, show: ["detail"] },
      { caption: "Tombol ⋮ di kanan atas berisi aksi: ubah, sembunyikan, hapus.", at: [S.x + S.w - 16, S.y + 24], click: true, show: ["menu"], dur: 3.6 },
      { caption: "Untuk membalas, tutup menu lalu tekan Tulis balasan.", at: [S.x + 80, SB - 28], click: true, hide: ["menu"], show: ["reply"] },
      { caption: "Tekan tombol kirim. Balasan tersimpan dan tampil di undangan.", at: [S.x + S.w - 30, SB - 34], click: true, show: ["ok"], dur: 3.6 }
    ]
  },

  // 6. Hari-H.
  "pasangan-hari-h": {
    title: "Check-in tamu di hari-H",
    base: [rect(0, 0, W, 536, { r: 0, fill: C.bg }), phone(PX, PY, PW, PH), screen(), head("Scan tamu"),
      rect(S.x + 12, S.y + 54, S.w - 24, 170, { r: 10, fill: "#1f1f1f" }),
      button(S.x + 70, S.y + 122, "Buka kamera", { w: S.w - 140, h: 34, variant: "wa", r: 17 }),
      text(S.x + 14, S.y + 248, "Atau tempel link tamu", { size: 11, fill: C.muted }),
      input(S.x + 12, S.y + 256, S.w - 64, "", "https://…?to=Nama&u=…", { placeholder: true }),
      button(S.x + S.w - 46, S.y + 256, "➤", { w: 34, h: 34, variant: "wa" }),
      tabbar("Hari-H"), side(40, 110, ["Staff yang masuk dengan", "kode staff hanya melihat", "layar ini."])],
    els: {
      cam: rect(S.x + 12, S.y + 54, S.w - 24, 170, { r: 10, fill: "#333" }) + rect(S.x + 78, S.y + 80, 100, 100, { r: 8, fill: "none", stroke: C.wa, sw: 3 }) +
        rect(S.x + 98, S.y + 100, 60, 60, { r: 2, fill: C.paper }) + text(S.x + 128, S.y + 136, "QR", { size: 16, anchor: "middle", weight: 700 }) +
        text(S.x + S.w / 2, S.y + 210, "Arahkan ke QR tamu.", { size: 11, anchor: "middle", fill: C.paper }),
      okres: rect(S.x + 12, S.y + 300, S.w - 24, 64, { r: 10, fill: C.okTint, stroke: C.ok }) + text(S.x + 24, S.y + 322, "Selamat datang", { size: 12, fill: C.ok, weight: 700 }) +
        text(S.x + 24, S.y + 344, "Dewi Lestari", { size: 15, weight: 700 }) + text(S.x + 24, S.y + 358, "Sahabat · 2 orang", { size: 10, fill: C.muted }),
      warn: rect(S.x + 12, S.y + 300, S.w - 24, 64, { r: 10, fill: C.warnTint, stroke: C.warn }) + text(S.x + 24, S.y + 322, "Sudah check-in pukul 10.12", { size: 12, fill: C.warn, weight: 700 }) +
        text(S.x + 24, S.y + 346, "Dewi Lestari", { size: 15, weight: 700 }),
      recent: rect(S.x + 12, S.y + 372, S.w - 24, 34, { r: 0, fill: C.paper }) + text(S.x + 14, S.y + 388, "Check-in di perangkat ini", { size: 10, fill: C.muted, weight: 700 }) +
        text(S.x + 14, S.y + 403, "Dewi Lestari · 10.12", { size: 11 })
    },
    steps: [
      { caption: "Buka tab Hari-H di HP penerima tamu.", at: tabAt("Hari-H"), click: true, dur: 2.8 },
      { caption: "Tekan Buka kamera, lalu izinkan kamera.", at: [S.x + 128, S.y + 139], click: true, show: ["cam"] },
      { caption: "Arahkan kamera ke QR di undangan tamu.", dur: 3 },
      { caption: "Hijau: Selamat datang. Tamu tercatat datang.", show: ["okres", "recent"], dur: 3.4 },
      { caption: "Di-scan lagi? Muncul kuning: Sudah check-in pukul …", hide: ["okres"], show: ["warn"], dur: 3.6 }
    ]
  },

  // 7. Pelacakan (desktop: tab ini hanya di lajur kiri laptop).
  "pasangan-pelacakan": (() => {
    const X = 20, Y = 14, BW = 920, BH = 510, T = Y + 76, L = X + 64;
    const icons = ["Beranda", "Kirim", "Tamu", "Ucapan", "Hari-H", "Pelacakan"];
    const rowD = (y, n, sub, chip, warn) => text(L + 60, y + 18, n, { size: 14, weight: 600 }) + text(L + 60, y + 36, sub, { size: 11.5, fill: C.muted }) +
      circle(L + 34, y + 22, 15, { fill: "#e8e0ff" }) + badge(L + 290, y + 12, chip, warn ? { fill: C.warnTint, fg: C.warn } : chip.includes("kali") ? { fill: C.okTint, fg: C.ok } : {}) + line(L + 60, y + 46, L + 420, y + 46);
    return {
      title: "Melihat siapa yang sudah membuka undangan",
      base: [browser(X, Y, BW, BH, "domainmu.com/halaman-dashboard#pelacakan", { tab: "Pelacakan" }),
        rect(X, T, 64, BH - 76, { r: 0, fill: C.bg }), line(X + 64, T, X + 64, Y + BH),
        ...icons.map((t, i) => (t === "Pelacakan" ? circle(X + 32, T + 30 + i * 46 + (i > 4 ? 14 : 0), 18, { fill: "#e7e2dd" }) : "") +
          rect(X + 25, T + 23 + i * 46 + (i > 4 ? 14 : 0), 14, 14, { r: 3, fill: "none", stroke: C.muted, sw: 1.5 })),
        line(X + 20, T + 248, X + 44, T + 248),
        text(L + 20, T + 34, "Pelacakan", { size: 20, weight: 700 }), text(L + 20, T + 58, "Tautan tamu: dibuka atau belum, kapan, dan perangkatnya.", { size: 12, fill: C.muted }),
        rect(L + 20, T + 70, 400, 30, { r: 15, fill: C.soft }), text(L + 36, T + 90, "Cari nama, ucapan, atau nomor HP", { size: 12, fill: C.muted }),
        badge(L + 20, T + 110, "Semua", { fill: "#d9fdd3", fg: C.waDark }), badge(L + 76, T + 110, "Sudah dibuka 86", { fill: C.soft, fg: C.muted }), badge(L + 196, T + 110, "Belum dibuka 34", { fill: C.soft, fg: C.muted }), badge(L + 314, T + 110, "Perangkat penuh", { fill: C.soft, fg: C.muted }),
        rowD(T + 182, "Dewi Lestari", "Pertama dibuka 3 Okt · Perangkat 1/2", "3 kali dibuka"),
        rowD(T + 232, "Bapak Andi", "Pertama dibuka 4 Okt · Perangkat 2/2", "Perangkat penuh", true),
        rowD(T + 282, "Sari", "Tautan dibuat 2 Okt", "Belum dibuka"),
        line(L + 440, T, L + 440, Y + BH), rect(L + 441, T, BW - 64 - 441, BH - 76, { r: 0, fill: "#efeae2" }),
        text(L + 600, T + 200, "Pilih tamu", { size: 14, fill: C.muted, anchor: "middle" })],
      els: {
        pinbar: rect(L + 20, T + 140, 400, 34, { r: 8, fill: C.warnTint }) + text(L + 30, T + 162, "PIN tamu untuk HP baru: 731905", { size: 12, weight: 600 }) + button(L + 350, T + 145, "Ganti", { w: 60, h: 24, size: 12 }),
        det: rect(L + 441, T, BW - 64 - 441, BH - 76, { r: 0, fill: "#efeae2" }) + rect(L + 441, T, BW - 64 - 441, 54, { r: 0, fill: C.paper }) +
          text(L + 460, T + 24, "Bapak Andi", { size: 15, weight: 700 }) + text(L + 460, T + 42, "Belum konfirmasi", { size: 11, fill: C.muted }) + text(X + BW - 26, T + 32, "⋮", { size: 20, anchor: "middle", weight: 700 }) +
          rect(L + 456, T + 70, 330, 150, { r: 8, fill: C.paper }) + text(L + 470, T + 92, "Aktivitas undangan", { size: 12, weight: 700, fill: C.muted }) +
          para(L + 470, T + 116, ["Status: Perangkat penuh", "Dibuka: 5 kali", "Perangkat: 2/2", "Kode tamu: K7Q2MX"], { size: 12.5, lh: 24 }),
        menu: rect(X + BW - 230, T + 46, 210, 44, { r: 10, fill: C.paper, stroke: C.line }) + text(X + BW - 214, T + 74, "Buka kunci perangkat", { size: 13 }),
        ok: toast(L + 470, T + 380, "Kunci perangkat dibuka.", { w: 300 })
      },
      steps: [
        { caption: "Di laptop, klik ikon Pelacakan di lajur kiri (di HP: lewat menu akun).", at: [X + 32, T + 274], click: true, dur: 3.4 },
        { caption: "Tiap tamu: berapa kali dibuka, kapan pertama, dan jumlah perangkat.", show: ["pinbar"], dur: 3.4 },
        { caption: "Pakai tombol saring: Sudah dibuka, Belum dibuka, Perangkat penuh.", at: [L + 280, T + 120], click: true },
        { caption: "Klik tamu bertanda Perangkat penuh. Detailnya tampil di kanan.", at: [L + 140, T + 250], click: true, show: ["det"] },
        { caption: "Klik ⋮ lalu Buka kunci perangkat supaya tamu bisa buka di HP baru.", at: [X + BW - 140, T + 69], click: true, show: ["menu", "ok"], dur: 4 }
      ]
    };
  })(),

  // 8. Pengaturan.
  "pasangan-pengaturan": {
    title: "Membuka Pengaturan undangan dan Buka untuk semua",
    base: [rect(0, 0, W, 536, { r: 0, fill: C.bg }), phone(PX, PY, PW, PH), screen(), head("Beranda"),
      text(S.x + 14, S.y + 64, "Ringkasan undangan", { size: 14, weight: 700 }), tabbar("Beranda")],
    els: {
      menu: rect(S.x + 40, SB - 196, S.w - 48, 146, { r: 14, fill: C.paper, stroke: C.line }) +
        text(S.x + 56, SB - 170, "Undangan Anda", { size: 13, weight: 600 }) + text(S.x + 56, SB - 154, "https://domainmu.com/rina-andi", { size: 9.5, fill: C.muted }) +
        line(S.x + 48, SB - 144, S.x + S.w - 16, SB - 144) +
        text(S.x + 56, SB - 120, "Pelacakan", { size: 13 }) + text(S.x + 56, SB - 90, "Pengaturan undangan", { size: 13 }) + text(S.x + 56, SB - 60, "Keluar", { size: 13, fill: C.bad }),
      set: screen() + head("Pengaturan") + circle(S.x + S.w / 2, S.y + 80, 22, { fill: "#d9fdd3" }) + text(S.x + S.w / 2, S.y + 86, "RA", { size: 14, anchor: "middle", weight: 700, fill: C.waDark }) +
        text(S.x + S.w / 2, S.y + 124, "Undangan Anda", { size: 15, anchor: "middle", weight: 700 }) + text(S.x + S.w / 2, S.y + 142, "/rina-andi", { size: 11, anchor: "middle", fill: C.muted }) +
        text(S.x + 14, S.y + 172, "Undangan", { size: 11, weight: 700, fill: C.muted }) +
        rect(S.x + 12, S.y + 180, S.w - 24, 64, { r: 8, fill: C.bg }) + text(S.x + 24, S.y + 204, "Lihat undangan", { size: 13 }) + text(S.x + 24, S.y + 234, "Kirim undangan", { size: 13 }) +
        text(S.x + 14, S.y + 268, "Akses tamu", { size: 11, weight: 700, fill: C.muted }) +
        rect(S.x + 12, S.y + 276, S.w - 24, 36, { r: 8, fill: C.bg }) + text(S.x + 24, S.y + 299, "Buka untuk semua", { size: 13 }) + tabbar(""),
      off: badge(S.x + S.w - 66, S.y + 284, "Mati", { fill: C.soft, fg: C.muted }),
      on: badge(S.x + S.w - 70, S.y + 284, "Aktif", { fill: C.okTint, fg: C.ok }),
      ok: toast(S.x + 12, S.y + 340, "Terbuka untuk semua.", { w: S.w - 24 })
    },
    steps: [
      { caption: "Di HP, ketuk lingkaran inisial di ujung kanan tab bawah.", at: avatarAt, click: true, show: ["menu"] },
      { caption: "Pilih Pengaturan undangan.", at: [S.x + 120, SB - 94], click: true, hide: ["menu"], show: ["set", "off"] },
      { caption: "Bagian Undangan: buka undangan sebagai tamu, atau ke Kirim.", dur: 3 },
      { caption: "Buka untuk semua: undangan khusus terbuka tanpa tautan tamu.", at: [S.x + 120, S.y + 294], click: true, hide: ["off"], show: ["on", "ok"], dur: 3.8 },
      { caption: "Ketuk lagi untuk kembali khusus tamu. Status kembali Mati.", at: [S.x + 120, S.y + 294], click: true, hide: ["on", "ok"], show: ["off"], dur: 3.4 }
    ]
  }
};
