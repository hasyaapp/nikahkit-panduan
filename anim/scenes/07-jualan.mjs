// Jualan ke klien: alur, Profil merek, Dashboard pasangan, Landing page, form klien, Pesanan masuk, checklist.
// Labels follow nikahkit/src/ui/panels-style.jsx, orders.jsx, store.js, server/pages/src/landing/index.html,
// server/pages/shared/order-form.js.
import { C, browser, scalevShell, editor, railAt, phone, rect, text, para, line, circle, button, input, badge, toast, card, ring, note, dim } from "../lib.mjs";

const X = 40, Y = 24, BW = 880, BH = 500;
const PX = X + 80, PY = Y + 176; // panel content origin (lib panelArea)
const SCALEV_URL = "app.scalev.com/pages/365671";

// Panel heading row; the Pesanan masuk (inbox) icon only on an invitation page (App.jsx shows it when ready), so pass count.
const panelHead = (title, count) => `${text(PX, PY - 2, title, { size: 17, weight: 600 })}
${count ? `${rect(PX + 300, PY - 22, 30, 28, { r: 6, fill: C.soft })}${rect(PX + 307, PY - 14, 16, 12, { r: 2, fill: "none", stroke: C.ink, sw: 1.5 })}${line(PX + 307, PY - 8, PX + 323, PY - 8, { stroke: C.ink, sw: 1.5 })}` : ""}
${count ? `${circle(PX + 328, PY - 14, 8, { fill: C.bad })}${text(PX + 328, PY - 10, count, { size: 10, anchor: "middle", fill: C.paper, weight: 700 })}` : ""}`;
// Kategori segmented control (Template | Marketing).
const seg = (on) => `${rect(PX, PY + 14, 340, 34, { r: 8, fill: C.soft })}${rect(on === "Template" ? PX + 3 : PX + 172, PY + 17, 165, 28, { r: 6, fill: C.paper, stroke: C.line })}
${text(PX + 85, PY + 36, "Template", { size: 13, anchor: "middle", weight: on === "Template" ? 700 : 500, fill: on === "Template" ? C.svDark : C.muted })}
${text(PX + 255, PY + 36, "Marketing", { size: 13, anchor: "middle", weight: on === "Marketing" ? 700 : 500, fill: on === "Marketing" ? C.svDark : C.muted })}`;
const mkCard = (x, y, name, desc, o = {}) => `${rect(x, y, 165, 112, { r: 8, fill: C.paper, stroke: o.on ? C.sv : C.line, sw: o.on ? 2 : 1 })}
${rect(x + 10, y + 10, 145, 42, { r: 6, fill: C.tint })}${text(x + 10, y + 70, name, { size: 13, weight: 700 })}${para(x + 10, y + 88, desc, { size: 10, fill: C.muted, lh: 13 })}`;
const MK_CARDS = (y) => mkCard(PX, y, "Dashboard pasangan", ["Kirim undangan, RSVP, ucapan,", "dan check-in tamu."]) + mkCard(PX + 175, y, "Landing page", ["Halaman jualan: desain,", "paket dan harga, form."]);

export const scenes = {
  // ---------------------------------------------------------------- alur-dengan-klien
  "jualan-alur": {
    title: "Alur jualan undangan dari klien sampai hari-H",
    base: [rect(0, 0, 960, 536, { r: 0, fill: C.bg }), text(480, 50, "Alur kerja vendor dengan NikahKit", { size: 22, weight: 700, anchor: "middle" })],
    els: Object.fromEntries([
      ["a1", 60, 90, "1. Klien buka", "Landing page"], ["a2", 360, 90, "2. Klien isi", "form data undangan"], ["a3", 660, 90, "3. Masuk ke", "Pesanan masuk"],
      ["a4", 660, 250, "4. Klik nama:", "undangan terisi"], ["a5", 360, 250, "5. Ganti foto, lalu", "Simpan & Terbitkan"], ["a6", 60, 250, "6. Kirim PIN dan", "pesan untuk pengantin"],
      ["a7", 60, 410, "7. Pengantin kirim", "undangan ke tamu"], ["a8", 360, 410, "8. Hari-H:", "check-in tamu"], ["a9", 660, 410, "9. Setelah acara:", "Buka untuk semua"]
    ].map(([id, x, y, l1, l2], i) => [id, `${rect(x + 3, y + 4, 240, 90, { r: 12, fill: "rgba(0,0,0,.07)" })}${rect(x, y, 240, 90, { r: 12, fill: i % 3 === 2 ? C.svTint : C.paper, stroke: C.sv, sw: 1.5 })}
${text(x + 120, y + 40, l1, { size: 15, anchor: "middle", weight: 700 })}${text(x + 120, y + 64, l2, { size: 14, anchor: "middle", fill: C.muted })}
${i % 3 !== 2 && i < 8 ? (Math.floor(i / 3) === 1 ? text(x - 30, y + 52, "◀", { size: 18, fill: C.sv }) : text(x + 262, y + 52, "▶", { size: 18, fill: C.sv })) : ""}
${i === 2 || i === 5 ? text(x + 120, y + 128, i === 2 ? "▼" : "", { size: 18, anchor: "middle", fill: C.sv }) : ""}${i === 5 ? text(x + 120, y + 128, "▼", { size: 18, anchor: "middle", fill: C.sv }) : ""}`])),
    steps: [
      { caption: "Klien menemukan Landing page kamu, lalu mengisi form data undangan.", show: ["a1", "a2"], dur: 3.4 },
      { caption: "Isian klien masuk ke Pesanan masuk di panel NikahKit.", show: ["a3"], dur: 3 },
      { caption: "Klik nama klien: semua kolom undangan terisi otomatis.", show: ["a4"], dur: 3 },
      { caption: "Ganti foto contoh, lalu Simpan & Terbitkan di Scalev.", show: ["a5"], dur: 3 },
      { caption: "Kirim PIN dan pesan untuk pengantin. Mereka kirim undangan ke tamu.", show: ["a6", "a7"], dur: 3.6 },
      { caption: "Hari-H: check-in. Setelah acara: Buka untuk semua.", show: ["a8", "a9"], dur: 3.8 }
    ]
  },

  // ---------------------------------------------------------------- profil-merek
  "jualan-profil-merek": {
    title: "Mengisi Profil merek di Template > Marketing",
    base: [browser(X, Y, BW, BH, SCALEV_URL, { tab: "Landing Page" }), editor(X, Y, BW, BH, { railActive: "Template" }), panelHead("Template")],
    els: {
      segT: seg("Template") + mkCard(PX, PY + 62, "Arunika", ["Template undangan"]) + mkCard(PX + 175, PY + 62, "Sekar", ["Template undangan"]),
      segM: rect(PX - 2, PY + 10, 350, 320, { r: 0, fill: C.paper }) + seg("Marketing") +
        rect(PX, PY + 58, 340, 262, { r: 8, fill: C.paper, stroke: C.sv }) + text(PX + 14, PY + 82, "Profil merek", { size: 14, weight: 700 }),
      belum: badge(PX + 110, PY + 68, "Belum diisi", { fill: C.soft, fg: C.muted }),
      fields: input(PX + 14, PY + 112, 312, "Nama bisnis", "") + input(PX + 14, PY + 166, 312, "Nomor WhatsApp", "0812 3456 7890", { placeholder: true }) +
        input(PX + 14, PY + 220, 312, "Logo (opsional)", "https://", { placeholder: true }) + button(PX + 14, PY + 270, "Simpan profil", { w: 120, h: 32, size: 13 }),
      nameV: rect(PX + 15, PY + 113, 300, 32, { r: 3, fill: C.paper }) + text(PX + 24, PY + 134, "Contoh: Undangan Sekar", { size: 14 }),
      waV: rect(PX + 15, PY + 167, 300, 32, { r: 3, fill: C.paper }) + text(PX + 24, PY + 188, "0812 3456 7890", { size: 14 }),
      pkg: rect(PX + 2, PY + 92, 336, 226, { r: 0, fill: C.paper }) + text(PX + 14, PY + 120, "Paket dan harga di Landing page, 1 sampai 3 paket.", { size: 11, fill: C.muted }) +
        input(PX + 14, PY + 150, 312, "Nama paket", "Contoh: Basic") + input(PX + 14, PY + 204, 312, "Harga (Rp)", "150.000") +
        text(PX + 14, PY + 252, "+ Tambah paket", { size: 13, fill: C.svDark, weight: 600 }) + button(PX + 14, PY + 270, "Simpan profil", { w: 120, h: 32, size: 13 }),
      ok: text(PX + 150, PY + 291, "Profil tersimpan.", { size: 13, fill: C.ok, weight: 600 }) + rect(PX + 106, PY + 66, 100, 24, { r: 0, fill: C.paper }) + badge(PX + 110, PY + 68, "Terisi", { fill: C.okTint, fg: C.ok })
    },
    steps: [
      { caption: "Buka tab NikahKit, lalu klik Template di rel kiri.", at: railAt(X, Y, "Template"), click: true, show: ["segT"], dur: 3 },
      { caption: "Di Kategori, klik Marketing. Profil merek ada paling atas.", at: [PX + 255, PY + 31], click: true, show: ["segM", "belum", "fields"], dur: 3.4 },
      { caption: "Isi Nama bisnis dan Nomor WhatsApp (boleh 08xx).", at: [PX + 170, PY + 182], click: true, type: ["nameV", "waV"], dur: 4 },
      { caption: "Gulir ke bawah: isi Nama paket dan Harga (Rp). Maksimal 3 paket.", at: [PX + 170, PY + 220], show: ["pkg"], dur: 3.8 },
      { caption: "Klik Simpan profil. Muncul Profil tersimpan. dan badge Terisi.", at: [PX + 74, PY + 286], click: true, show: ["ok"], dur: 3.8 }
    ]
  },

  // ---------------------------------------------------------------- pasang-dashboard-pasangan
  "jualan-pasang-dashboard": {
    title: "Memasang Dashboard pasangan di halaman Scalev sendiri",
    base: [browser(X, Y, BW, BH, SCALEV_URL, { tab: "Dashboard" }), editor(X, Y, BW, BH, { railActive: "Template", screenFill: C.paper }), panelHead("Template"), seg("Marketing"),
      rect(PX, PY + 58, 340, 44, { r: 8, fill: C.paper, stroke: C.line }), text(PX + 14, PY + 85, "Profil merek", { size: 14, weight: 700 }), badge(PX + 110, PY + 71, "Terisi", { fill: C.okTint, fg: C.ok }),
      MK_CARDS(PY + 116)],
    els: {
      pick: ring(PX, PY + 116, 165, 112),
      dlg: dim() + card(250, 200, 460, 150, "Pasang Dashboard pasangan di halaman ini?") + text(270, 262, "Seluruh isi halaman diganti. Bisa diurungkan.", { size: 13, fill: C.muted }) +
        button(510, 294, "Batal", { variant: "ghost", w: 80 }) + button(600, 294, "Pasang", { w: 90 }),
      dash: rect(612, 200, 196, 200, { r: 4, fill: C.paper }) + text(710, 226, "Kelola undangan", { size: 13, anchor: "middle", weight: 700 }) +
        rect(626, 240, 168, 30, { r: 4, fill: C.soft }) + rect(626, 280, 168, 30, { r: 4, fill: C.soft }) + rect(626, 320, 168, 30, { r: 4, fill: C.soft }),
      t1: toast(PX - 20, 470, "Dashboard pasangan dipasang. Tekan Simpan di Scalev."),
      saving: ring(X + BW - 144, Y + 82, 134, 30),
      t2: badge(PX + 90, PY + 124, "Dipakai", { fill: C.okTint, fg: C.ok }) + note(PX + 20, 450, "Bagikan di undangan kini punya tautan Dashboard", PX + 80, PY + 232)
    },
    steps: [
      { caption: "Di halaman HTML Mode baru: Template > Marketing.", dur: 2.8 },
      { caption: "Klik kartu Dashboard pasangan.", at: [PX + 80, PY + 170], click: true, show: ["pick", "dlg"], dur: 3.2 },
      { caption: "Konfirmasi: klik Pasang.", at: [645, 311], click: true, hide: ["dlg", "pick"], show: ["dash", "t1"], dur: 3.6 },
      { caption: "Klik Simpan & Terbitkan supaya halaman punya alamat publik.", at: [X + BW - 80, Y + 97], click: true, show: ["saving"], dur: 3.2 },
      { caption: "Selesai. Sekarang Bagikan di undangan memuat tautan Dashboard.", hide: ["saving", "t1"], show: ["t2"], dur: 3.6 }
    ]
  },

  // Bagikan panel in an invitation after the dashboard is installed.
  "jualan-bagikan-pengantin": {
    title: "Tautan Untuk pengantin di Bagikan",
    base: [browser(X, Y, BW, BH, SCALEV_URL, { tab: "Undangan" }), editor(X, Y, BW, BH, { railActive: "Konten" })],
    els: {
      before: text(PX, PY - 2, "Konten", { size: 17, weight: 600 }) + rect(PX, PY + 20, 340, 40, { r: 8, fill: C.soft }) + text(PX + 14, PY + 45, "Sampul", { size: 14 }) +
        rect(PX, PY + 68, 340, 40, { r: 8, fill: C.soft }) + text(PX + 14, PY + 93, "Mempelai", { size: 14 }),
      share: rect(PX - 2, PY - 22, 352, 342, { r: 0, fill: C.paper }) + text(PX, PY - 2, "Bagikan", { size: 17, weight: 600 }) +
        text(PX, PY + 34, "Untuk pengantin", { size: 14, weight: 700 }) +
        button(PX, PY + 48, "Kirim undangan", { variant: "ghost", w: 150, h: 32, size: 13 }) + button(PX + 160, PY + 48, "Buka Dashboard", { variant: "quiet", w: 150, h: 32, size: 13 }) +
        button(PX, PY + 90, "Buka Check-in", { variant: "quiet", w: 150, h: 32, size: 13 }) + text(PX, PY + 142, "Masuk dengan PIN dashboard.", { size: 12, fill: C.muted }),
      noDash: rect(PX, PY + 166, 340, 74, { r: 8, fill: C.warnTint }) + para(PX + 12, PY + 188, ["Belum terpasang? Panel menulis:", "Pasang Dashboard pasangan dulu", "(Template > Marketing)."], { size: 12, fill: C.warn, lh: 16 }),
      tab: rect(612, 200, 196, 286, { r: 4, fill: C.paper }) + text(710, 216, "Kelola undangan", { size: 13, anchor: "middle", weight: 700 }) + text(710, 246, "Kirim", { size: 12, anchor: "middle", fill: C.muted }) +
        note(620, 400, "Tab baru: Dashboard", 700, 260)
    },
    steps: [
      { caption: "Buka undangan klien di editor.", show: ["before"], dur: 2.6 },
      { caption: "Klik Bagikan di rel kiri.", at: railAt(X, Y, "Bagikan"), click: true, show: ["share"], hide: ["before"], dur: 3.2 },
      { caption: "Bagian Untuk pengantin: Kirim undangan, Buka Dashboard, Buka Check-in.", at: [PX + 235, PY + 64], dur: 3.8 },
      { caption: "Buka Check-in hanya muncul untuk undangan khusus dengan QR masuk aktif.", at: [PX + 75, PY + 106], show: ["noDash"], dur: 4.2 },
      { caption: "Klik Buka Dashboard: dashboard terbuka di tab baru.", at: [PX + 235, PY + 64], click: true, show: ["tab"], dur: 3.4 }
    ]
  },

  // ---------------------------------------------------------------- landing-page
  "jualan-landing-page": {
    title: "Isi Landing page member di HP klien",
    base: [rect(0, 0, 960, 536, { r: 0, fill: C.bg }), phone(360, 20, 240, 500)],
    els: {
      ...Object.fromEntries([
        ["v1", ["Undangan Sekar (contoh)", "", "Undangan digital untuk", "hari bahagia kalian"], ["Pesan undangan", "Lihat desain"]],
        ["v2", ["Pilih desain undangan", "", "", "Arunika"], ["Lihat demo", "Pilih"]],
        ["v4", ["Paket dan harga", "", "Basic (contoh)", "Rp150.000"], ["Pilih paket ini"]],
        ["v5", ["Isi data pesanan", "Pilihan kalian: Paket Basic,", "desain Arunika", "Langkah 1 dari 10"], ["lanjut"]]
      ].map(([id, lines, btns]) => [id, `${rect(372, 60, 216, 436, { r: 6, fill: "#fbf6f1" })}
${id === "v2" ? rect(400, 136, 160, 64, { r: 6, fill: C.tint }) : ""}
${lines.map((l, i) => text(480, 100 + i * 26 + (id === "v2" && i === 3 ? 30 : 0), l, { size: i === 0 ? 15 : 13, anchor: "middle", weight: i === 0 || (id === "v2" && i === 3) ? 700 : 500, fill: C.cocoa })).join("")}
${btns.map((b, i) => button(396, 250 + i * 46, b, { w: 168, h: 38, color: C.cocoa, variant: i ? "ghost" : "primary", size: 13 })).join("")}`])),
      dlg: rect(372, 60, 216, 436, { r: 6, fill: "rgba(23,16,8,.55)" }) + rect(384, 120, 192, 300, { r: 12, fill: C.paper, stroke: C.cocoa }) +
        rect(396, 132, 168, 150, { r: 6, fill: C.tint }) + text(480, 210, "gambar desain", { size: 11, anchor: "middle", fill: C.muted }) +
        text(400, 306, "Arunika", { size: 15, weight: 700, fill: C.cocoa }) + button(396, 324, "Pakai desain ini", { w: 168, h: 36, color: C.cocoa, size: 13 }) +
        button(396, 368, "Tutup", { w: 168, h: 36, variant: "ghost", color: C.muted, size: 13 }),
      n1: note(640, 120, "Nama dari Profil merek", 588, 100),
      n2: note(640, 260, "Desain yang boleh kamu pakai", 588, 160),
      n3: note(640, 260, "Paket dari Profil merek", 588, 150)
    },
    steps: [
      { caption: "Bagian pembuka: nama bisnismu, tombol Pesan undangan dan Lihat desain.", show: ["v1", "n1"], dur: 3.6 },
      { caption: "Katalog: desain yang boleh kamu jual, tiap desain punya Lihat demo.", show: ["v2", "n2"], hide: ["n1"], dur: 3.6 },
      { caption: "Lihat demo membuka gambar lebih besar. Pakai desain ini memilihnya.", at: [480, 269], click: true, show: ["dlg"], dur: 3.8 },
      { caption: "Paket dan harga dari Profil merek. Klik Pilih paket ini.", at: [480, 269], click: true, hide: ["dlg", "n2"], show: ["v4", "n3"], dur: 3.6 },
      { caption: "Halaman turun ke form. Pilihan klien sudah tercatat di langkah Pesanan.", hide: ["n3"], show: ["v5"], dur: 4 }
    ]
  },

  "jualan-perbarui-landing": {
    title: "Memperbarui Landing page setelah Profil merek diubah",
    base: [browser(X, Y, BW, BH, SCALEV_URL, { tab: "Landing page" }), editor(X, Y, BW, BH, { railActive: "Template" }), panelHead("Template"), seg("Marketing"),
      rect(PX, PY + 58, 340, 44, { r: 8, fill: C.paper, stroke: C.line }), text(PX + 14, PY + 85, "Profil merek", { size: 14, weight: 700 }), badge(PX + 110, PY + 71, "Terisi", { fill: C.okTint, fg: C.ok })],
    els: {
      stale: rect(PX, PY + 112, 340, 46, { r: 8, fill: C.warnTint }) + text(PX + 12, PY + 140, "Profil merek berubah.", { size: 13, fill: C.warn, weight: 600 }) +
        button(PX + 168, PY + 118, "Perbarui halaman ini", { variant: "ghost", w: 162, h: 32, size: 12 }),
      cards: MK_CARDS(PY + 172) + badge(PX + 252, PY + 176, "Dipakai", { fill: C.okTint, fg: C.ok }),
      t1: toast(PX - 20, 470, "Landing page dipasang. Tekan Simpan di Scalev."),
      gone: rect(PX - 2, PY + 108, 346, 54, { r: 0, fill: C.paper })
    },
    steps: [
      { caption: "Buka halaman Landing page kamu, lalu Template > Marketing.", show: ["cards"], dur: 3 },
      { caption: "Profil diubah setelah halaman dipasang? Muncul Profil merek berubah.", show: ["stale"], dur: 3.6 },
      { caption: "Klik Perbarui halaman ini.", at: [PX + 249, PY + 134], click: true, show: ["t1", "gone"], dur: 3.4 },
      { caption: "Tekan Simpan & Terbitkan supaya klien melihat versi baru.", at: [X + BW - 80, Y + 97], click: true, dur: 3.4 }
    ]
  },

  // ---------------------------------------------------------------- form-data-klien
  "jualan-form-klien": {
    title: "Klien mengisi form data undangan",
    base: [rect(0, 0, 960, 536, { r: 0, fill: C.bg }), phone(360, 20, 240, 500)],
    els: {
      s1: rect(372, 60, 216, 436, { r: 6, fill: "#fbf6f1" }) + text(384, 88, "Langkah 1 dari 10 · Pesanan", { size: 11, fill: C.muted }) +
        text(384, 116, "Pesanan", { size: 18, weight: 700, fill: C.cocoa }) + text(384, 140, "Paket", { size: 12, fill: C.muted }) + rect(384, 148, 192, 30, { r: 6, stroke: C.cocoa }) + text(394, 168, "Basic (contoh)", { size: 13 }) +
        text(384, 202, "Fitur undangan", { size: 12, fill: C.muted }) +
        ["Siaran langsung", "QR check-in tamu", "Acara ngunduh mantu"].map((f, i) => rect(384, 214 + i * 28, 14, 14, { r: 3, stroke: C.cocoa }) + text(406, 226 + i * 28, f, { size: 12 })).join("") +
        text(384, 318, "Desain", { size: 12, fill: C.muted }) + rect(384, 326, 192, 30, { r: 6, stroke: C.cocoa }) + text(394, 346, "Arunika", { size: 13 }) +
        button(384, 440, "lanjut", { w: 192, h: 38, color: C.cocoa, size: 14 }),
      chk: rect(384, 242, 14, 14, { r: 3, fill: C.cocoa }) + text(386, 254, "✓", { size: 12, fill: C.paper }),
      s2: rect(372, 60, 216, 436, { r: 6, fill: "#fbf6f1" }) + text(384, 88, "Langkah 2 dari 10 · Pemesan", { size: 11, fill: C.muted }) +
        text(384, 116, "Pemesan", { size: 18, weight: 700, fill: C.cocoa }) + text(384, 136, "Kontak untuk tim kami.", { size: 12, fill: C.muted }) +
        text(384, 164, "Nama *", { size: 12, fill: C.muted }) + rect(384, 172, 192, 30, { r: 6, stroke: C.cocoa }) +
        text(384, 224, "WhatsApp *", { size: 12, fill: C.muted }) + rect(384, 232, 192, 30, { r: 6, stroke: C.cocoa }) +
        text(384, 284, "Email", { size: 12, fill: C.muted }) + rect(384, 292, 192, 30, { r: 6, stroke: C.cocoa }) +
        button(384, 394, "kembali", { w: 192, h: 38, variant: "ghost", color: C.muted, size: 14 }) + button(384, 440, "lanjut", { w: 192, h: 38, color: C.cocoa, size: 14 }),
      err: text(384, 352, "Nama wajib diisi.", { size: 13, fill: C.bad, weight: 700 }) + rect(383, 171, 194, 32, { r: 6, fill: "none", stroke: C.bad, sw: 2 }),
      typed: rect(372, 340, 216, 24, { r: 0, fill: "#fbf6f1" }) + rect(383, 171, 194, 32, { r: 6, fill: C.paper, stroke: C.cocoa }) + text(394, 192, "Rani (contoh)", { size: 13 }) + text(394, 252, "0812 3456 7890", { size: 13 }),
      s3: rect(372, 60, 216, 436, { r: 6, fill: "#fbf6f1" }) + text(384, 88, "Langkah 10 dari 10 · Catatan", { size: 11, fill: C.muted }) +
        text(384, 116, "Catatan", { size: 18, weight: 700, fill: C.cocoa }) + text(384, 140, "Catatan untuk tim", { size: 12, fill: C.muted }) + rect(384, 148, 192, 80, { r: 6, stroke: C.cocoa }) +
        button(384, 394, "kembali", { w: 192, h: 38, variant: "ghost", color: C.muted, size: 14 }) + button(384, 440, "kirim data", { w: 192, h: 38, color: C.cocoa, size: 14 }),
      done: rect(372, 60, 216, 436, { r: 6, fill: "#fbf6f1" }) + text(384, 130, "Data terkirim", { size: 20, weight: 700, fill: C.cocoa }) +
        para(384, 160, ["Terima kasih. Vendor undangan", "kalian sudah menerima data ini", "dan akan mengabari kalian."], { size: 12, fill: C.ink, lh: 18 }),
      n1: note(630, 200, "Masuk ke Pesanan masuk kamu", 588, 140)
    },
    steps: [
      { caption: "Langkah Pesanan: pilih Paket, centang fitur, tulis Desain.", show: ["s1"], dur: 3.4 },
      { caption: "Centang fitur yang dipesan, lalu tekan lanjut.", at: [391, 249], click: true, show: ["chk"], dur: 3.2 },
      { caption: "Kolom bertanda * wajib. Tekan lanjut saat kosong: muncul pesan merah.", at: [480, 459], click: true, show: ["s2", "err"], dur: 3.8 },
      { caption: "Isi Nama dan WhatsApp, lalu lanjut ke langkah berikutnya.", at: [480, 247], click: true, show: ["typed"], hide: ["err"], dur: 3.4 },
      { caption: "Langkah terakhir Catatan: tekan kirim data.", at: [480, 459], click: true, show: ["s3"], dur: 3.4 },
      { caption: "Klien melihat Data terkirim. Datanya masuk ke Pesanan masuk kamu.", show: ["done", "n1"], dur: 4 }
    ]
  },

  // ---------------------------------------------------------------- pesanan-masuk
  "jualan-pesanan-masuk": {
    title: "Mengisi undangan dari Pesanan masuk",
    base: [browser(X, Y, BW, BH, SCALEV_URL, { tab: "Undangan" }), editor(X, Y, BW, BH, { railActive: "Template" }), panelHead("Template", "1"), seg("Template"),
      mkCard(PX, PY + 62, "Arunika", ["Template undangan"]) + mkCard(PX + 175, PY + 62, "Sekar", ["Template undangan"])],
    els: {
      inbox: rect(PX - 2, PY - 22, 352, 346, { r: 0, fill: C.paper }) + text(PX, PY - 2, "Pesanan masuk", { size: 17, weight: 600 }) + text(PX + 320, PY - 2, "✕", { size: 16, fill: C.muted }) +
        text(PX, PY + 26, "Klik nama untuk mengisi semua kolom sesuai paketnya.", { size: 11, fill: C.muted }) +
        rect(PX, PY + 38, 340, 52, { r: 8, stroke: C.line }) + text(PX + 12, PY + 60, "Dimas & Rani (contoh)", { size: 14, weight: 700 }) + text(PX + 12, PY + 80, "Basic · 14 Okt 10.20", { size: 11, fill: C.muted }) +
        rect(PX, PY + 98, 340, 52, { r: 8, stroke: C.line }) + text(PX + 12, PY + 120, "Bayu & Sinta (contoh)", { size: 14, weight: 700 }) + text(PX + 12, PY + 140, "Paket tidak disebut · 2 Okt 09.00", { size: 11, fill: C.muted }) +
        badge(PX + 230, PY + 114, "Sudah diisi", { fill: C.okTint, fg: C.ok }) + text(PX + 318, PY + 130, "🗑", { size: 14 }) + text(PX + 318, PY + 70, "🗑", { size: 14 }) +
        rect(PX, PY + 162, 340, 40, { r: 8, stroke: C.line }) + text(PX + 12, PY + 187, "›  Tempel data pesanan", { size: 13 }) +
        rect(PX, PY + 210, 340, 40, { r: 8, stroke: C.line }) + text(PX + 12, PY + 235, "›  Link form klien (opsional)", { size: 13 }),
      baru: badge(PX + 260, PY + 54, "Baru", { fill: C.warnTint, fg: C.warn }),
      sudah: rect(PX + 226, PY + 50, 80, 26, { r: 0, fill: C.paper }) + badge(PX + 230, PY + 54, "Sudah diisi", { fill: C.okTint, fg: C.ok }),
      konten: rect(PX - 2, PY - 22, 352, 346, { r: 0, fill: C.paper }) + text(PX, PY - 2, "Konten", { size: 17, weight: 600 }) +
        ["Sampul", "Mempelai", "Acara & Tanggal", "Pembuka"].map((s, i) => rect(PX, PY + 20 + i * 48, 340, 40, { r: 8, fill: C.soft }) + text(PX + 14, PY + 45 + i * 48, s, { size: 14 })).join("") +
        rect(X + 6, 195, 52, 28, { r: 6, fill: C.bg }) + text(X + 32, 213, "Template", { size: 10, anchor: "middle", fill: C.muted }) + rect(X + 6, 355, 52, 28, { r: 6, fill: C.svTint }) + text(X + 32, 373, "Konten", { size: 10, anchor: "middle", fill: C.svDark, weight: 700 }) + rect(612, 230, 196, 60, { r: 4, fill: C.tint }) + text(710, 266, "Dimas & Rani", { size: 16, anchor: "middle", weight: 700, fill: C.cocoa }),
      t1: toast(X + 10, 466, "Data pesanan dimasukkan. Foto tetap; ganti foto contoh bila masih ada.  Urungkan", { w: 600 })
    },
    steps: [
      { caption: "Angka merah di ikon kotak masuk = pesanan baru.", at: [PX + 315, PY - 8], dur: 3 },
      { caption: "Klik ikon itu. Layar Pesanan masuk terbuka.", at: [PX + 315, PY - 8], click: true, show: ["inbox", "baru"], dur: 3.4 },
      { caption: "Klik nama klien yang berlabel Baru.", at: [PX + 90, PY + 60], click: true, show: ["sudah"], hide: ["baru"], dur: 3.2 },
      { caption: "Kolom Konten terisi. Klik Urungkan di pesan bawah bila salah.", show: ["konten", "t1"], dur: 4.4 },
      { caption: "Ganti foto contoh dengan foto klien, lalu Simpan & Terbitkan.", at: [X + BW - 80, Y + 97], click: true, dur: 3.6 }
    ]
  },

  // ---------------------------------------------------------------- checklist-serah
  "jualan-checklist": {
    title: "Checklist sebelum menyerahkan undangan ke klien",
    base: [rect(0, 0, 960, 536, { r: 0, fill: C.bg }), card(200, 24, 560, 496, "Checklist serah undangan", { titleSize: 20 })],
    els: Object.fromEntries(["Konten: nama, acara, tanggal sudah dicek", "Foto contoh sudah diganti semua", "Musik sudah diatur",
      "Halaman tersimpan, slug terisi", "Simpan & Terbitkan sudah ditekan", "Dicoba sebagai tamu (?to=Nama)", "PIN dashboard dibuat", "Pesan untuk pengantin tersalin",
      "Undangan khusus dicek (bila dipakai)", "Kode staff untuk hari-H (bila dipakai)"].flatMap((l, i) => {
      const y = 76 + i * 42;
      return [[`ckr${i}`, rect(228, y, 22, 22, { r: 4, stroke: C.muted }) + text(264, y + 17, l, { size: 15 })],
        [`ckc${i}`, rect(228, y, 22, 22, { r: 4, fill: C.ok }) + text(232, y + 17, "✓", { size: 15, fill: C.paper, weight: 700 })]];
    })),
    steps: [
      { caption: "Sebelum serah ke klien, cek isi undangan dan foto.", show: ["ckr0", "ckr1", "ckr2", "ckr3", "ckr4", "ckr5", "ckr6", "ckr7", "ckr8", "ckr9", "ckc0", "ckc1"], at: [239, 87], click: true, dur: 3.6 },
      { caption: "Musik, simpan, dan terbit sudah beres.", show: ["ckc2", "ckc3", "ckc4"], at: [239, 213], click: true, dur: 3.4 },
      { caption: "Coba tautan sebagai tamu dengan ?to=Nama.", show: ["ckc5"], at: [239, 297], click: true, dur: 3.2 },
      { caption: "Buat PIN dashboard dan salin pesan untuk pengantin.", show: ["ckc6", "ckc7"], at: [239, 381], click: true, dur: 3.4 },
      { caption: "Undangan khusus dan kode staff: cek bila dipakai klien.", show: ["ckc8", "ckc9"], at: [239, 465], click: true, dur: 3.8 }
    ]
  }
};
