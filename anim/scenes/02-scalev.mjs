// Scalev setup scenes (W2): halaman HTML Mode, simpan/terbit, Security CSP, custom domain, e-payment, verifikasi WA.
import { C, browser, scalevShell, editor, rect, text, button, card, ring, note, input, badge, line, para, circle } from "../lib.mjs";

const X = 40, Y = 24, BW = 880, BH = 500;
const MENU = ["Landing Pages", "Stores", "Setting"];
const CX = X + 210; // content x
const menuAt = (name) => [X + 70, Y + 140 + MENU.indexOf(name) * 34];
const tabAt = (t) => [X + 18 + ["Code", "Media", "Security", "Settings", "NikahKit"].indexOf(t) * 74 + 18, Y + 76 + 66];
const SAVE = [X + BW - 191, Y + 97], PUBLISH = [X + BW - 77, Y + 97];
const check = (x, y, on) => rect(x, y, 16, 16, { r: 3, fill: on ? C.sv : C.paper, stroke: on ? C.sv : "#9aa0a6" }) + (on ? text(x + 3, y + 13, "✓", { size: 13, fill: C.paper, weight: 700 }) : "");

export const scenes = {
  "scalev-buat-halaman-html": {
    title: "Membuat halaman HTML Mode di Scalev untuk undangan",
    base: [browser(X, Y, BW, BH, "app.scalev.com/pages", { tab: "Scalev" })],
    els: {
      list: scalevShell(X, Y, BW, BH, { menu: MENU, active: "" }) + text(CX, Y + 112, "Dasbor", { size: 20, weight: 600 }),
      lp: scalevShell(X, Y, BW, BH, { menu: MENU, active: "Landing Pages" }) + rect(X + 191, Y + 77, BW - 192, 60, { r: 0 }) + text(CX, Y + 112, "Landing Pages", { size: 20, weight: 600 }) +
        button(X + BW - 150, Y + 92, "+", { w: 130 }) + rect(CX, Y + 150, 640, 50, { fill: C.bg, stroke: C.line }) + text(CX + 16, Y + 180, "Daftar halaman kamu tampil di sini", { size: 13, fill: C.muted }),
      tipe: card(X + 260, Y + 150, 420, 200, "Tipe landing page") + rect(X + 280, Y + 200, 180, 110, { r: 8, fill: C.bg, stroke: C.line }) + text(X + 370, Y + 262, "Tipe lain", { size: 14, anchor: "middle", fill: C.muted }) +
        rect(X + 480, Y + 200, 180, 110, { r: 8, fill: C.svTint, stroke: C.sv, sw: 2 }) + text(X + 570, Y + 262, "HTML Mode", { size: 15, anchor: "middle", weight: 700, fill: C.svDark }),
      ed: rect(X + 1, Y + 77, BW - 2, BH - 78, { r: 0 }) + editor(X, Y, BW, BH, { tab: "Code", phone: false }) + rect(X + 470, Y + 121, 400, 360, { r: 0, fill: "#eceff1" }) + text(X + 670, Y + 300, "Pratinjau kosong", { size: 13, anchor: "middle", fill: C.muted }),
      nk: rect(X + 1, Y + 77, BW - 2, BH - 78, { r: 0 }) + editor(X, Y, BW, BH, { tab: "NikahKit", railActive: "Template", saving: "Tersimpan" }) + text(X + 80, Y + 200, "Template", { size: 16, weight: 600 }),
      lock: note(X + 130, Y + 270, "Simpan halaman di Scalev dulu.", X + 52, Y + 76 + 141, { w: 240 }),
      ringNk: ring(X + 314, Y + 130, 66, 22),
      saved: rect(X + 60, Y + 44, BW - 120, 24, { r: 12, fill: C.soft }) + text(X + 76, Y + 61, "app.scalev.com/pages/359177", { size: 13, fill: C.ink }) + note(X + 300, Y + 230, "ID undangan = 359177", X + 230, Y + 64, { w: 190 })
    },
    steps: [
      { caption: "Masuk app.scalev.com, lalu klik Landing Pages di menu kiri.", at: menuAt("Landing Pages"), click: true, show: ["lp"] },
      { caption: "Klik tombol untuk membuat halaman baru.", at: [X + BW - 85, Y + 109], click: true, show: ["tipe"] },
      { caption: "Pilih HTML Mode. Editor Landing Page Studio terbuka.", at: [X + 570, Y + 255], click: true, show: ["ed"], hide: ["tipe"], dur: 3.6 },
      { caption: "Tab NikahKit muncul di samping Code, Media, Security, Settings.", show: ["ringNk"], dur: 3.2 },
      { caption: "Klik NikahKit. Selain Template dan Media, menu masih terkunci.", at: tabAt("NikahKit"), click: true, show: ["nk", "lock"], hide: ["ringNk"] },
      { caption: "Klik Simpan. Alamat berubah jadi /pages/angka: itu ID undangan.", at: SAVE, click: true, show: ["saved"], hide: ["lock"], dur: 4 }
    ]
  },

  "scalev-simpan-terbitkan": {
    title: "Simpan dan Simpan & Terbitkan di editor Scalev",
    base: [browser(X, Y, BW, BH, "app.scalev.com/pages/359177", { tab: "Scalev" }), editor(X, Y, BW, BH, { tab: "NikahKit", railActive: "Konten", saving: "Tersimpan" }),
      text(X + 80, Y + 200, "Konten", { size: 16, weight: 600 }), input(X + 80, Y + 240, 360, "Nama panggilan", "Rani"), input(X + 80, Y + 306, 360, "Nama panggilan", "Dimas")],
    els: {
      share: card(X + 72, Y + 170, 380, 180, "Bagikan") + rect(X + 92, Y + 214, 340, 34, { r: 6, fill: C.warnTint }) + text(X + 104, Y + 236, "Perubahan belum disimpan di Scalev.", { size: 13, fill: C.warn, weight: 600 }) +
        input(X + 92, Y + 290, 340, "Nama tamu", "Nama Tamu"),
      ringBtn: ring(X + BW - 230, Y + 82, 216, 30),
      pub: card(X + 480, Y + 160, 380, 150, "Alamat publik") + text(X + 500, Y + 230, "namabisnis.myscalev.com/rani-dimas", { size: 14, mono: true, fill: C.svDark }) + text(X + 500, Y + 270, "Buka di HP untuk cek RSVP dan video.", { size: 12, fill: C.muted }),
      stuck: card(X + 480, Y + 330, 380, 110, "Tertahan \"not finished previewing\"?", { titleSize: 14 }) + para(X + 500, Y + 392, ["Muat ulang editor, lalu tekan", "Simpan & Terbitkan lagi."], { size: 13 })
    },
    steps: [
      { caption: "Kamu mengubah isi undangan. Scalev belum menyimpannya.", dur: 2.8 },
      { caption: "Panel Bagikan mengingatkan: Perubahan belum disimpan di Scalev.", at: [X + 32, Y + 76 + 306], click: true, show: ["share"], dur: 3.6 },
      { caption: "Ada dua tombol: Simpan dan Simpan & Terbitkan.", show: ["ringBtn"], hide: ["share"], dur: 3.6 },
      { caption: "Klik Simpan & Terbitkan supaya tamu melihat versi terbaru.", at: PUBLISH, click: true, hide: ["ringBtn"] },
      { caption: "Buka alamat publik di HP: RSVP dan YouTube aktif setelah terbit.", show: ["pub"], dur: 3.6 },
      { caption: "Tertahan \"not finished previewing\"? Muat ulang, lalu terbitkan lagi.", show: ["stuck"], dur: 4 }
    ]
  },

  "scalev-security-csp": {
    title: "Izin domain (CSP) di Bantuan NikahKit dan tab Security Scalev",
    base: [browser(X, Y, BW, BH, "app.scalev.com/pages/359177", { tab: "Scalev" })],
    els: {
      nk: editor(X, Y, BW, BH, { tab: "NikahKit", railActive: "Konten" }),
      help: rect(X + 66, Y + 162, 392, 338, { r: 0 }) + text(X + 80, Y + 190, "Bantuan", { size: 16, weight: 600 }) + text(X + 80, Y + 222, "Izin domain (CSP)", { size: 14, weight: 600 }) +
        text(X + 80, Y + 250, "https://www.youtube.com", { size: 12, mono: true }) + badge(X + 300, Y + 237, "Ditambahkan otomatis", { fill: C.okTint, fg: C.ok }) +
        text(X + 80, Y + 284, "https://fonts.gstatic.com", { size: 12, mono: true }) + badge(X + 300, Y + 271, "Sudah diizinkan", { fill: C.okTint, fg: C.ok }) +
        text(X + 80, Y + 318, "https://foto.contoh.com", { size: 12, mono: true }) + badge(X + 300, Y + 305, "Perlu ditambah manual", { fill: C.warnTint, fg: C.warn }) +
        button(X + 80, Y + 344, "Periksa ulang", { variant: "ghost", h: 30, size: 13 }) + button(X + 210, Y + 344, "Salin domain kurang", { variant: "ghost", h: 30, size: 13 }),
      copied: text(X + 80, Y + 400, "Tersalin. Tempel di tab Security.", { size: 13, fill: C.ok, weight: 600 }),
      sec: rect(X + 1, Y + 77, BW - 2, BH - 78, { r: 0 }) + editor(X, Y, BW, BH, { tab: "Security", phone: false }) + rect(X + 1, Y + 161, 459, 338, { r: 0 }) + text(X + 20, Y + 190, "Security", { size: 16, weight: 600 }) +
        ["Connect Sources", "Image Sources", "Media Sources", "Frame Sources"].map((l, i) => input(X + 20, Y + 228 + i * 62, 420, l, i === 0 ? "https://wedding-guestbook.nikahin…" : "")).join(""),
      paste: text(X + 30, Y + 312, "https://foto.contoh.com", { size: 14 })
    },
    steps: [
      { caption: "Di tab NikahKit, klik Bantuan di bawah rel kiri.", at: [X + 32, Y + 76 + 411], click: true, show: ["nk", "help"], dur: 3.4 },
      { caption: "Lihat Izin domain (CSP): tiap domain punya status.", dur: 3.6 },
      { caption: "Ada \"Perlu ditambah manual\"? Klik Salin domain kurang.", at: [X + 290, Y + 359], click: true, show: ["copied"], dur: 3.4 },
      { caption: "Klik tab Security di strip editor Scalev.", at: tabAt("Security"), click: true, show: ["sec"], hide: ["help", "copied"] },
      { caption: "Tempel domain di kolom yang sesuai jenisnya, misalnya Image Sources.", at: [X + 200, Y + 307], click: true, type: ["paste"], dur: 3.8 },
      { caption: "Simpan & Terbitkan, lalu buka Bantuan lagi untuk cek ulang.", at: PUBLISH, click: true, dur: 3.6 }
    ]
  },

  "scalev-custom-domain": {
    title: "Menambahkan domain sendiri ke Scalev lewat Cloudflare",
    base: [browser(X, Y, BW, BH, "app.scalev.com/dashboard", { tab: "Scalev" }), scalevShell(X, Y, BW, BH, { menu: MENU, active: "Setting" }), text(CX, Y + 112, "Setting", { size: 20, weight: 600 })],
    els: {
      dom: text(CX, Y + 150, "Domain", { size: 15, weight: 600 }) + button(X + BW - 190, Y + 132, "Tambahkan Domain", { w: 170 }),
      form: card(X + 260, Y + 170, 440, 160, "Tambahkan Domain") + input(X + 280, Y + 240, 400, "", "") + button(X + 600, Y + 286, "Simpan", { w: 80, h: 30 }),
      typed: text(X + 290, Y + 262, "undangan.namabrand.com", { size: 14 }),
      dns: card(X + 210, Y + 170, 640, 200, "Kode DNS dari Scalev") + ["A/CNAME  Name  Target  (salin persis)", "TXT      Name  Target  (record 1)", "TXT      Name  Target  (record 2)"].map((l, i) => text(X + 230, Y + 230 + i * 30, l, { size: 13, mono: true })).join("") +
        text(X + 230, Y + 340, "Di Cloudflare: Proxy status DNS Only", { size: 12, fill: C.warn, weight: 600 }) + button(X + 740, Y + 322, "Verifikasi", { w: 100, h: 30 }),
      aktif: card(X + 210, Y + 390, 640, 60, "", { shadow: false }) + text(X + 230, Y + 426, "undangan.namabrand.com", { size: 14, mono: true }) + badge(X + 740, Y + 410, "Aktif", { fill: C.okTint, fg: C.ok })
    },
    steps: [
      { caption: "Siapkan dulu: domain dibeli, DNS dipindah ke Cloudflare.", dur: 3.2 },
      { caption: "Di Scalev, buka menu Setting lalu Domain.", at: menuAt("Setting"), click: true, show: ["dom"] },
      { caption: "Klik Tambahkan Domain.", at: [X + BW - 105, Y + 149], click: true, show: ["form"] },
      { caption: "Ketik domain atau subdomain, lalu klik Simpan.", at: [X + 640, Y + 301], click: true, type: ["typed"], dur: 3.6 },
      { caption: "Salin tiap record ke Cloudflare satu per satu, Proxy: DNS Only.", show: ["dns"], hide: ["form", "typed"], dur: 4 },
      { caption: "Klik Verifikasi. Bisa butuh sampai 2x24 jam, ulangi berkala.", at: [X + 790, Y + 337], click: true, show: ["aktif"], dur: 4 }
    ]
  },

  "scalev-epayment": {
    title: "Mengaktifkan ePayment di toko Scalev",
    base: [browser(X, Y, BW, BH, "app.scalev.com/dashboard", { tab: "Scalev" }), scalevShell(X, Y, BW, BH, { menu: MENU, active: "Stores" })],
    els: {
      st: text(CX, Y + 112, "Stores", { size: 20, weight: 600 }) + rect(CX, Y + 130, 620, 44, { fill: C.paper, stroke: C.line }) + text(CX + 16, Y + 157, "Toko Undangan Kamu", { size: 14, weight: 600 }),
      det: rect(X + 191, Y + 77, BW - 192, BH - 78, { r: 0 }) + text(CX, Y + 112, "Toko Undangan Kamu", { size: 20, weight: 600 }) + button(X + BW - 110, Y + 92, "Simpan", { w: 90 }) +
        text(CX, Y + 300, "Metode Pembayaran", { size: 15, weight: 600 }) + button(CX, Y + 316, "Pilih Metode Pembayaran", { variant: "ghost", w: 210 }),
      dlg: card(X + 260, Y + 140, 440, 230, "") + input(X + 280, Y + 200, 400, "", "Invoice") + check(X + 280, Y + 258, false) + text(X + 304, Y + 271, "Aktifkan Metode Pembayaran ALL E-Payment", { size: 13 }) + button(X + 600, Y + 320, "Simpan", { w: 80, h: 30 }),
      on: check(X + 280, Y + 258, true)
    },
    steps: [
      { caption: "Klik Stores di menu kiri, lalu pilih nama toko kamu.", at: menuAt("Stores"), click: true, show: ["st"] },
      { caption: "Scroll ke Metode Pembayaran, klik Pilih Metode Pembayaran.", at: [CX + 16, Y + 152], click: true, show: ["det"], dur: 3.4 },
      { caption: "Dialog muncul. Pada dropdown pilih Invoice.", at: [CX + 105, Y + 333], click: true, show: ["dlg"] },
      { caption: "Centang Aktifkan Metode Pembayaran ALL E-Payment.", at: [X + 288, Y + 266], click: true, show: ["on"] },
      { caption: "Klik Simpan di dialog.", at: [X + 640, Y + 335], click: true, hide: ["dlg", "on"] },
      { caption: "Klik Simpan di kanan atas supaya pengaturan tersimpan.", at: [X + BW - 65, Y + 109], click: true, dur: 3.6 }
    ]
  },

  "scalev-verifikasi-wa": {
    title: "Verifikasi nomor WhatsApp di Scalev",
    base: [browser(X, Y, BW, BH, "app.scalev.com/dashboard", { tab: "Scalev" }), scalevShell(X, Y, BW, BH, { menu: MENU, active: "Setting" })],
    els: {
      prof: text(CX, Y + 112, "Profil", { size: 20, weight: 600 }) + button(X + BW - 100, Y + 92, "Edit", { variant: "ghost", w: 80 }),
      form: input(CX, Y + 170, 300, "", "") + button(CX, Y + 220, "Save", { w: 80 }),
      num: text(CX + 10, Y + 192, "081234567890", { size: 14 }),
      konf: card(X + 300, Y + 150, 360, 150, "") + text(X + 320, Y + 220, "081234567890", { size: 15, mono: true }) + button(X + 540, Y + 250, "Verifikasi", { w: 100, h: 30 }),
      wa: card(X + 300, Y + 150, 360, 210, "WhatsApp", { fill: C.waTint }) + text(X + 320, Y + 210, "Ke: +6282125784683", { size: 13, fill: C.waDark }) + rect(X + 320, Y + 226, 320, 50, { r: 8, fill: C.paper }) +
        text(X + 334, Y + 256, "Kode OTP (jangan diubah)", { size: 13 }) + button(X + 560, Y + 300, "Kirim", { variant: "wa", w: 80, h: 30 }),
      cek: button(CX + 100, Y + 220, "Cek Verifikasi", { variant: "ghost", w: 140 }),
      ok: badge(CX + 310, Y + 177, "Terverifikasi", { fill: C.okTint, fg: C.ok })
    },
    steps: [
      { caption: "Buka menu Setting, lalu Profil, lalu klik Edit.", at: [X + BW - 60, Y + 109], click: true, show: ["prof", "form"] },
      { caption: "Isi nomor WhatsApp kamu, lalu klik Save.", at: [CX + 40, Y + 237], click: true, type: ["num"], dur: 3.4 },
      { caption: "Jendela konfirmasi muncul. Klik Verifikasi.", at: [X + 590, Y + 265], click: true, show: ["konf"] },
      { caption: "WhatsApp terbuka dengan kode OTP. Kirim apa adanya.", at: [X + 600, Y + 315], click: true, show: ["wa"], hide: ["konf"], dur: 3.6 },
      { caption: "Kembali ke Scalev, klik Cek Verifikasi.", at: [CX + 170, Y + 237], click: true, show: ["cek", "ok"], hide: ["wa"], dur: 3.6 }
    ]
  }
};
