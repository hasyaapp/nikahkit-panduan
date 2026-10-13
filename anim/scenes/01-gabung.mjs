// Mulai + Gabung dan pasang: peta perjalanan, checklist, istilah alamat, pasang ekstensi, masuk, bayar, Scalev, update.
// Labels follow nikahkit/store/pasang/pasang.html, nikahkit/ext/pin.html + pin.js, nikahkit/src/ui/App.jsx (GATE) and
// nikahkit/src/ui/help.jsx (UpdateBox). Numbers such as versions, ID halaman and emails are examples.
import { C, W, browser, editor, rect, text, para, line, circle, button, card, ring, note, toast, dim, badge, input } from "../lib.mjs";

const X = 40, Y = 24, BW = 880, BH = 500; // browser frame on the stage
const TOP = Y + 76; // browser content top
const STAGE_H = 536;
const ID = "48213"; // contoh ID halaman Scalev
const EDIT_URL = `app.scalev.com/pages/${ID}`;
const VER = "0.7.59", NEW = "0.8.0";
const EMAIL = "rina.wo@gmail.com";

// ---- Shared pieces -------------------------------------------------------------------------------------------------
const screen = (...parts) => rect(0, 0, W, STAGE_H, { r: 0, fill: C.bg }) + parts.join("");
const gBtn = (x, y, w = 230) => `${rect(x, y, w, 40, { r: 8, fill: C.paper, stroke: "#c4c7c5" })}${circle(x + 26, y + 20, 9, { fill: "#4285f4" })}${rect(x + 26, y + 17, 9, 6, { r: 1, fill: "#4285f4" })}${circle(x + 26, y + 20, 5, { fill: C.paper })}${text(x + 46, y + 25, "Masuk dengan Google", { size: 14, weight: 600 })}`;
const small = (x, y, label, o = {}) => button(x, y, label, { h: 28, size: 13, ...o });
const link = (x, y, label, o = {}) => text(x, y, label, { size: 13, fill: C.svDark, weight: 600, ...o });

// Scalev editor (HTML Mode) in a browser frame, optional overlay over the NikahKit panel area.
const edFrame = (o = {}) => browser(X, Y, BW, BH, o.url ?? EDIT_URL, { tab: "Scalev · Landing Page" }) + editor(X, Y, BW, BH, o);
const panelCover = () => rect(X + 1, TOP + 85, 458, BH - 162, { r: 0, fill: C.paper });
// The NikahKit access gate (App.jsx AccessGate): title, hint, buttons.
function gate(title, hint, o = {}) {
  const y = TOP + 85;
  let s = panelCover() + text(X + 20, y + 32, "NikahKit", { size: 18, weight: 700 }) + text(X + 20, y + 52, "/rina-dimas", { size: 12, fill: C.muted });
  if (o.chip) s += rect(X + 340, y + 16, 92, 28, { r: 14, fill: o.chipWarn ? C.warnTint : C.soft }) + text(X + 386, y + 35, o.chip, { size: 12, anchor: "middle", weight: 600, fill: o.chipWarn ? C.warn : C.ink });
  const lines = Array.isArray(hint) ? hint : hint ? [hint] : [];
  const h = 40 + lines.length * 20;
  s += rect(X + 20, y + 68, 420, h, { r: 8, fill: o.warn ? C.warnTint : C.soft });
  s += text(X + 34, y + 94, title, { size: 14, weight: 700, fill: o.warn ? C.warn : C.ink });
  if (lines.length) s += para(X + 34, y + 116, lines, { size: 13, fill: C.ink, lh: 20 });
  return s + (o.extra ?? "");
}
const GY = TOP + 85; // gate panel top

// NikahKit account dialog (pin.html framed over the editor by pin-frame.js).
const DX = 260, DY = 36, DW = 440;
function dlgHead(h) {
  return dim() + card(DX, DY, DW, h, null) + rect(DX + 20, DY + 16, 32, 32, { r: 8, fill: C.accent }) + text(DX + 36, DY + 38, "N", { size: 16, weight: 700, fill: C.paper, anchor: "middle" }) +
    text(DX + 62, DY + 30, "NikahKit", { size: 16, weight: 700 }) + text(DX + 62, DY + 47, `ID ${ID}`, { size: 12, fill: C.muted });
}
function dlgIn(o = {}) {
  const box = (y, h) => rect(DX + 20, DY + y, DW - 40, h, { r: 8, fill: C.paper, stroke: C.line });
  const msgs = o.msg ? [].concat(o.msg) : [], mh = 18 + msgs.length * 16;
  let s = dlgHead(msgs.length ? 406 + mh : 400);
  s += text(DX + 20, DY + 80, EMAIL, { size: 13, weight: 700 }) + link(DX + DW - 70, DY + 80, "Keluar");
  // Paket
  s += box(92, 108) + text(DX + 36, DY + 116, "Paket", { size: 14, weight: 700 }) + text(DX + 36, DY + 136, o.lic ?? "Belum berlangganan. Pilih paket untuk mulai membuat undangan.", { size: 12, fill: o.licWarn ? C.warn : C.ink });
  let bx = DX + 36;
  if (o.choose !== false) { s += small(bx, DY + 148, o.choose ?? "Pilih paket"); bx += (o.choose ?? "Pilih paket").length * 7.8 + 40; }
  if (o.paid) s += small(bx, DY + 148, "Cek pembayaran", { variant: "ghost" });
  if (o.redeem !== false) s += link(DX + 36, DY + 192, "Punya kode uji?", { size: 12 });
  // PIN dashboard
  s += box(210, 80) + text(DX + 36, DY + 234, "PIN dashboard", { size: 14, weight: 700 }) + text(DX + 36, DY + 252, "Undangan ini belum punya PIN.", { size: 12, fill: C.muted }) + small(DX + 36, DY + 258, "Buat PIN", { h: 26 });
  // Bisnis Scalev
  s += box(300, 80) + text(DX + 36, DY + 324, "Bisnis Scalev", { size: 14, weight: 700 }) + text(DX + 36, DY + 342, o.biz ?? "Belum terhubung.", { size: 12, fill: o.biz ? C.ink : C.muted }) +
    small(DX + 36, DY + 348, o.connect ?? "Hubungkan bisnis Scalev", { variant: "ghost", h: 26 });
  if (msgs.length) s += rect(DX + 20, DY + 392, DW - 40, mh, { r: 6, fill: o.msgWarn ? C.warnTint : C.okTint }) + para(DX + 32, DY + 413, msgs, { size: 12, fill: o.msgWarn ? C.warn : C.ok, weight: 600, lh: 16 });
  return s;
}

// Chrome extensions page.
function extPage(o = {}) {
  let s = browser(X, Y, BW, BH, "chrome://extensions", { tab: "Extensions" }) + text(X + 24, TOP + 36, "Extensions", { size: 20, weight: 500 }) +
    text(X + BW - 200, TOP + 36, "Developer mode", { size: 13, fill: C.muted }) + line(X, TOP + 56, X + BW, TOP + 56);
  s += o.dev === false ? toggle(X + BW - 70, TOP + 22, false) : toggle(X + BW - 70, TOP + 22, true);
  if (o.dev !== false) s += devbar();
  if (o.card) s += extCard(o.card === "new" ? NEW : VER);
  return s;
}
const toggle = (x, y, on) => rect(x, y, 40, 20, { r: 10, fill: on ? "#1a73e8" : "#bdc1c6" }) + circle(on ? x + 30 : x + 10, y + 10, 8, { fill: C.paper });
const devbar = () => button(X + 24, TOP + 68, "Load unpacked", { variant: "ghost", color: "#1a73e8", w: 136, h: 30, size: 13 }) +
  button(X + 172, TOP + 68, "Pack extension", { variant: "ghost", color: "#1a73e8", w: 136, h: 30, size: 13 }) +
  button(X + 320, TOP + 68, "Update", { variant: "ghost", color: "#1a73e8", w: 84, h: 30, size: 13 }) + line(X, TOP + 110, X + BW, TOP + 110);
const CARD = { x: X + 24, y: TOP + 130 };
function extCard(ver) {
  const { x, y } = CARD;
  return card(x, y, 420, 150, null, { shadow: false }) + rect(x + 18, y + 18, 40, 40, { r: 8, fill: C.accent }) + text(x + 38, y + 44, "N", { size: 18, weight: 700, fill: C.paper, anchor: "middle" }) +
    text(x + 72, y + 34, `NikahKit ${ver}`, { size: 15, weight: 600 }) +
    para(x + 72, y + 56, ["Buat undangan pernikahan digital di Scalev", "HTML Mode: pilih template, warna, font, musik…"], { size: 12, fill: C.muted, lh: 17 }) +
    text(x + 72, y + 98, "ID: ibljeopjjcapnmcclgcggefhgnolmmeb", { size: 11, fill: C.muted }) +
    button(x + 18, y + 112, "Details", { variant: "ghost", color: "#1a73e8", w: 76, h: 26, size: 12 }) + button(x + 104, y + 112, "Remove", { variant: "ghost", color: "#1a73e8", w: 76, h: 26, size: 12 }) +
    text(x + 340, y + 131, "↻", { size: 20, fill: C.muted, anchor: "middle" }) + toggle(x + 362, y + 115, true);
}
const RELOAD = [CARD.x + 340, CARD.y + 125];

// File window (Unduhan / Dokumen) with icons.
const zipIcon = (x, y, label) => rect(x, y, 56, 66, { r: 6, fill: "#e8eaed", stroke: "#c4c7c5" }) + rect(x + 24, y, 8, 40, { r: 0, fill: "#9aa0a6" }) +
  [0, 1, 2, 3, 4].map((i) => rect(x + 24, y + 4 + i * 8, 8, 3, { r: 0, fill: "#e8eaed" })).join("") + text(x + 28, y + 86, label, { size: 12, anchor: "middle" });
const folderIcon = (x, y, label, o = {}) => rect(x, y + 6, 64, 52, { r: 6, fill: "#e5a531" }) + rect(x, y, 26, 12, { r: 3, fill: "#e5a531" }) + rect(x, y + 14, 64, 44, { r: 6, fill: "#f2b84b" }) +
  text(x + 32, y + 78, label, { size: 12, anchor: "middle", weight: o.bold ? 700 : undefined });
function fileWin(x, y, w, h, title, side = "Unduhan") {
  return rect(x + 3, y + 6, w, h, { r: 12, fill: "rgba(0,0,0,.12)" }) + rect(x, y, w, h, { r: 12, fill: C.paper, stroke: C.line }) + rect(x, y, w, 38, { r: 12, fill: "#f3f3f3" }) + rect(x, y + 26, w, 12, { r: 0, fill: "#f3f3f3" }) +
    circle(x + 18, y + 19, 5, { fill: "#d0d0d0" }) + circle(x + 34, y + 19, 5, { fill: "#d0d0d0" }) + circle(x + 50, y + 19, 5, { fill: "#d0d0d0" }) + text(x + 70, y + 24, title, { size: 13, weight: 600, fill: "#444" }) +
    rect(x, y + 38, 130, h - 38, { r: 0, fill: "#f8f8f8" }) + ["Desktop", "Dokumen", "Unduhan"].map((n, i) => (n === side ? rect(x + 6, y + 50 + i * 30, 118, 26, { r: 5, fill: "#e4e4e4" }) : "") + text(x + 18, y + 68 + i * 30, n, { size: 13, fill: n === side ? C.ink : C.muted, weight: n === side ? 600 : undefined })).join("") +
    line(x + 130, y + 38, x + 130, y + h);
}

// ---- Scenes --------------------------------------------------------------------------------------------------------
export const scenes = {
  // Overview for the home page: the whole member journey in seven steps.
  "mulai-peta-perjalanan": (() => {
    const N = [
      ["Gabung", "pilih paket, bayar"], ["Pasang", "ekstensi di Chrome"], ["Scalev", "hubungkan bisnis"], ["Buat undangan", "template + Konten"],
      ["Serahkan", "PIN ke pasangan"], ["Tamu", "tautan, RSVP, ucapan"], ["Hari-H", "check-in tamu"], ["Jualan", "landing page, pesanan"]
    ];
    const pos = N.map((_, i) => [130 + (i % 4) * 233, i < 4 ? 92 : 232]);
    const node = (i, on) => { const [x, y] = pos[i]; return circle(x, y, 28, { fill: on ? C.accent : C.paper, stroke: on ? C.accent : C.line, sw: 2 }) + text(x, y + 6, String(i + 1), { size: 18, weight: 700, anchor: "middle", fill: on ? C.paper : C.muted }) + text(x, y + 50, N[i][0], { size: 15, weight: 700, anchor: "middle", fill: on ? C.cocoa : C.ink }) + text(x, y + 68, N[i][1], { size: 12, anchor: "middle", fill: C.muted }); };
    const base = [text(40, 40, "Perjalanan member NikahKit", { size: 20, weight: 700, fill: C.cocoa })];
    for (let i = 0; i < 3; i++) base.push(line(pos[i][0] + 30, pos[i][1], pos[i + 1][0] - 30, pos[i + 1][1], { stroke: C.line, sw: 3 }));
    base.push(`<path d="M${pos[3][0]} ${pos[3][1] + 76} C ${pos[3][0]} 190, ${pos[4][0]} 150, ${pos[4][0]} ${pos[4][1] - 30}" fill="none" stroke="${C.line}" stroke-width="3" stroke-dasharray="6 6"/>`);
    for (let i = 4; i < 7; i++) base.push(line(pos[i][0] + 30, pos[i][1], pos[i + 1][0] - 30, pos[i + 1][1], { stroke: C.line, sw: 3 }));
    N.forEach((_, i) => base.push(node(i, false)));
    const els = {};
    N.forEach((_, i) => (els["on" + i] = node(i, true)));
    // Detail panel (y 330..520)
    const P = (title, body) => rect(40, 330, 880, 190, { r: 12, fill: C.paper, stroke: C.line }) + text(64, 362, title, { size: 16, weight: 700, fill: C.cocoa }) + body;
    els.d1 = P("Kamu (member) gabung dan memasang NikahKit", extCardMini(64, 380) +
      rect(520, 380, 360, 120, { r: 10, fill: C.bg, stroke: C.line }) + text(540, 410, "Paket", { size: 14, weight: 700 }) + text(540, 434, "Bulanan · Tahunan · Sekali Bayar", { size: 13, fill: C.muted }) + small(540, 450, "Pilih paket"));
    els.d2 = P("Hubungkan bisnis Scalev, lalu buat halaman HTML Mode", rect(64, 380, 400, 120, { r: 10, fill: C.bg, stroke: C.line }) + text(84, 410, "Bisnis Scalev", { size: 14, weight: 700 }) + text(84, 432, "Rina Wedding Organizer (@rinawo)", { size: 13 }) + small(84, 448, "Hubungkan ulang", { variant: "ghost" }) +
      rect(500, 380, 380, 120, { r: 10, fill: C.bg, stroke: C.line }) + ["Code", "Media", "Security", "Settings", "NikahKit"].map((t, i) => text(520 + i * 70, 420, t, { size: 13, weight: t === "NikahKit" ? 700 : 500, fill: t === "NikahKit" ? C.svDark : C.muted })).join("") + rect(800, 428, 60, 4, { r: 2, fill: C.sv }) + text(520, 470, "Landing Page Studio · HTML Mode", { size: 13, fill: C.muted }));
    els.d3 = P("Pilih template dan isi Konten di panel NikahKit", ["Template", "Gaya", "Audio", "Media", "Lapisan", "Konten"].map((t, i) => rect(64 + i * 92, 384, 84, 34, { r: 8, fill: i === 5 ? C.svTint : C.bg, stroke: C.line }) + text(106 + i * 92, 406, t, { size: 13, anchor: "middle", weight: 600, fill: i === 5 ? C.svDark : C.ink })).join("") +
      input(64, 448, 260, "", "Rina & Dimas") + input(340, 448, 200, "", "Sabtu, 12 Desember") + phoneMini(760, 372));
    els.d4 = P("Serahkan ke pasangan: tautan undangan, Dashboard, dan PIN", waBubble(64, 380, ["Undangan siap: https://domainmu.com/rina-dimas", "Kelola undangan (kirim ke tamu, RSVP, ucapan,", "check-in): https://domainmu.com/dashboard?w=…", "PIN: 4 8 2 1 9 0"]));
    els.d5 = P("Pasangan mengirim tautan pribadi, tamu membuka dan mengisi RSVP", phoneMini(80, 372, "Kepada Andi") + text(200, 410, "Tautan pribadi: …/rina-dimas?to=Andi", { size: 14, weight: 600 }) + text(200, 436, "Nama tamu tampil di sampul undangan.", { size: 13, fill: C.muted }) + badge(200, 456, "Hadir · 2 orang", { fill: C.okTint, fg: C.ok }) + badge(320, 456, "Ucapan masuk", {}));
    els.d6 = P("Hari-H: pasangan atau staff penerima tamu mencatat kedatangan", phoneMini(80, 372, "Check-in") + text(200, 410, "Masuk dengan PIN dashboard, atau kode staff", { size: 14, weight: 600 }) + text(200, 436, "Kode staff: paket Tahunan dan Sekali Bayar.", { size: 13, fill: C.muted }) + badge(200, 456, "Andi sudah datang", { fill: C.okTint, fg: C.ok }));
    els.d7 = P("Jualan: landing page milikmu, pesanan klien masuk ke NikahKit", rect(64, 380, 400, 120, { r: 10, fill: C.bg, stroke: C.line }) + text(84, 410, "Landing page", { size: 14, weight: 700 }) + text(84, 432, "Paket dan harga, lalu form pesanan.", { size: 13, fill: C.muted }) +
      rect(500, 380, 380, 120, { r: 10, fill: C.bg, stroke: C.line }) + text(520, 410, "Pesanan masuk", { size: 14, weight: 700 }) + text(520, 436, "Sari & Bayu", { size: 13 }) + badge(620, 422, "Baru", { fill: C.warnTint, fg: C.warn }) + text(520, 462, "Klik nama untuk mengisi semua kolom.", { size: 12, fill: C.muted }));
    // lib.mjs uses d0.. for progress dots: move the detail panels to p1..p7.
    for (let i = 1; i <= 7; i++) { els["p" + i] = els["d" + i]; delete els["d" + i]; }
    const ids = ["p1", "p2", "p3", "p4", "p5", "p6", "p7"];
    const step = (k, caption, on) => ({ caption, show: [ids[k], ...on.map((i) => "on" + i)], hide: k ? [ids[k - 1]] : [], dur: 3.4 });
    return {
      title: "Peta perjalanan member NikahKit",
      base, els,
      steps: [
        step(0, "1–2. Gabung: pilih paket, bayar, lalu pasang NikahKit di Chrome.", [0, 1]),
        step(1, "3. Hubungkan bisnis Scalev dan buka halaman HTML Mode.", [2]),
        step(2, "4. Buat undangan: pilih template, isi Konten, Simpan.", [3]),
        step(3, "5. Serahkan ke pasangan: tautan undangan, Dashboard, dan PIN.", [4]),
        step(4, "6. Pasangan kirim tautan pribadi. Tamu membuka dan isi RSVP.", [5]),
        step(5, "7. Hari-H: tamu dicatat lewat check-in di HP.", [6]),
        step(6, "8. Jualan: landing page milikmu, pesanan klien masuk ke NikahKit.", [7])
      ]
    };
  })(),

  // Checklist for /mulai/alur-lengkap.
  "mulai-checklist": (() => {
    const items = ["Pilih paket dan bayar membership", "Pasang NikahKit di Chrome komputer", "Hubungkan bisnis Scalev", "Buat halaman HTML Mode, lalu Simpan",
      "Pilih template dan isi Konten", "Simpan & Terbitkan, cek lewat Bagikan", "Buat PIN dan serahkan ke pasangan"];
    const x = 180, y0 = 96;
    const base = [card(140, 30, 680, 480, "Checklist member baru", { titleSize: 20 }), text(160, 82, "Centang satu per satu. Tiap baris punya halaman panduannya sendiri.", { size: 13, fill: C.muted })];
    items.forEach((t, i) => base.push(rect(x - 20, y0 + i * 56, 600, 46, { r: 8, fill: C.bg }) + rect(x - 6, y0 + i * 56 + 11, 24, 24, { r: 6, fill: C.paper, stroke: "#9aa0a6", sw: 1.5 }) +
      text(x + 34, y0 + i * 56 + 28, `${i + 1}. ${t}`, { size: 15 })));
    const els = {};
    items.forEach((t, i) => (els["k" + i] = rect(x - 6, y0 + i * 56 + 11, 24, 24, { r: 6, fill: C.ok }) + `<path d="M${x} ${y0 + i * 56 + 23} l5 5 l9 -10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` +
      text(x + 34, y0 + i * 56 + 28, `${i + 1}. ${t}`, { size: 15, fill: C.muted })));
    els.done = toast(290, 484, "Siap jualan: undangan pertama sudah diserahkan.");
    const caps = ["Mulai dari paket: Bulanan, Tahunan, atau Sekali Bayar.", "Pasang ekstensi lewat Load unpacked di Chrome.", "Hubungkan bisnis Scalev dari jendela akun NikahKit.",
      "Buat halaman Landing Page dengan HTML Mode, lalu Simpan.", "Buka tab NikahKit, pilih template, isi Konten.", "Simpan & Terbitkan, lalu cek tampilan tamu lewat Bagikan.", "Buat PIN dashboard, salin pesan, kirim ke pasangan."];
    return {
      title: "Checklist dari nol sampai jualan",
      base, els,
      steps: caps.map((c, i) => ({ caption: c, at: [x + 6, y0 + i * 56 + 23], click: true, show: ["k" + i, ...(i === 6 ? ["done"] : [])], dur: i === 6 ? 3.6 : 2.6 }))
    };
  })(),

  // Istilah: ID undangan, slug, alamat publik, tautan pribadi, PIN dan kode staff.
  "mulai-istilah-alamat": (() => {
    const els = {
      idRing: ring(X + 213, Y + 47, 42, 18, { r: 6 }) + note(X + 360, TOP + 30, "ID undangan = ID halaman Scalev", X + 250, Y + 68, { w: 260 }),
      settings: panelCover() + text(X + 20, GY + 32, "Settings", { size: 16, weight: 700 }) + input(X + 20, GY + 80, 400, "Slug (alamat halaman)", "rina-dimas", { focus: true }) +
        text(X + 20, GY + 136, "Minimal 3 karakter. Ganti slug tidak mengubah ID.", { size: 13, fill: C.muted }),
      slugNote: note(X + 340, GY + 30, "slug", X + 300, GY + 82, { w: 80 }),
      pub: rect(X + 20, GY + 200, 420, 70, { r: 8, fill: C.svTint }) + text(X + 34, GY + 226, "Alamat umum undangan", { size: 12, fill: C.svDark, weight: 600 }) +
        text(X + 34, GY + 252, "https://domainmu.com/rina-dimas", { size: 15, weight: 600 }),
      priv: rect(X + 20, GY + 280, 420, 56, { r: 8, fill: C.tint }) + text(X + 34, GY + 302, "Tautan pribadi (nama tamu)", { size: 12, fill: C.accent, weight: 600 }) +
        text(X + 34, GY + 324, "https://domainmu.com/rina-dimas?to=Andi", { size: 14, weight: 600 }),
      guest: rect(612, TOP + 100, 196, 286, { r: 6, fill: "#3b2a1a" }) + text(710, TOP + 180, "Kepada Yth.", { size: 12, fill: "#e8d9c8", anchor: "middle" }) +
        text(710, TOP + 208, "Andi", { size: 22, fill: C.paper, anchor: "middle", weight: 700 }) + text(710, TOP + 260, "Rina & Dimas", { size: 16, fill: "#e8d9c8", anchor: "middle" }) +
        rect(660, TOP + 300, 100, 30, { r: 15, fill: C.accent }) + text(710, TOP + 320, "Buka", { size: 13, fill: C.paper, anchor: "middle", weight: 600 }),
      keys: rect(X + 20, GY + 200, 420, 136, { r: 8, fill: C.paper, stroke: C.line }) + text(X + 34, GY + 226, "Untuk masuk Dashboard pasangan", { size: 13, weight: 700 }) +
        text(X + 34, GY + 254, "PIN dashboard", { size: 13, weight: 600 }) + text(X + 160, GY + 254, "6 angka, untuk pasangan (pemilik)", { size: 12, fill: C.muted }) +
        text(X + 34, GY + 284, "Kode staff", { size: 13, weight: 600 }) + text(X + 160, GY + 284, "untuk penerima tamu di hari-H", { size: 12, fill: C.muted }) +
        text(X + 34, GY + 314, "Kode staff: paket Tahunan dan Sekali Bayar.", { size: 12, fill: C.accent })
    };
    return {
      title: "ID undangan, slug, alamat, dan tautan pribadi",
      base: [edFrame({ tab: "Settings", phone: true })],
      els,
      steps: [
        { caption: "Angka di alamat editor adalah ID undangan (ID halaman Scalev).", at: [X + 236, Y + 58], show: ["idRing"], dur: 3.6 },
        { caption: "Slug diisi di tab Settings Scalev. Slug membentuk alamat halaman.", at: [X + 200, GY + 97], click: true, hide: ["idRing"], show: ["settings", "slugNote"], dur: 3.6 },
        { caption: "Alamat umum: domain atau subdomain Scalev, lalu slug.", show: ["pub"], hide: ["slugNote"] },
        { caption: "Tautan pribadi menambah ?to=Nama. Nama tamu tampil di sampul.", show: ["priv", "guest"], dur: 3.8 },
        { caption: "PIN dashboard untuk pasangan, kode staff untuk penerima tamu.", hide: ["pub", "priv"], show: ["keys"], dur: 3.8 }
      ]
    };
  })(),

  // Pasang: download + extract (Windows and Mac).
  "gabung-ekstrak-zip": (() => {
    const FX = 150, FY = 70, FW = 660, FH = 400; // file window
    const els = {
      page: screen(browser(X, Y, BW, BH, "assets.nikahin.workers.dev/brand-assets/nikahkit/pasang.html", { tab: "Cara pasang NikahKit · Nikahin" }),
        text(X + 40, TOP + 70, "Cara pasang NikahKit", { size: 30, weight: 700, fill: C.cocoa }), text(X + 40, TOP + 102, "Untuk Google Chrome di komputer Windows atau Mac.", { size: 15, fill: C.muted }),
        rect(X + 560, TOP + 44, 270, 50, { r: 14, fill: C.cocoa }), text(X + 695, TOP + 75, `Unduh NikahKit ${VER}`, { size: 15, fill: C.paper, weight: 700, anchor: "middle" }),
        text(X + 830, TOP + 116, "Rilis … · ZIP ±120 KB", { size: 12, fill: C.muted, anchor: "end" }),
        ["1 Unduh dan ekstrak", "2 Buka chrome://extensions", "3 Nyalakan Developer mode", "4 Klik Load unpacked", "5 NikahKit terpasang", "6 Masuk di editor Scalev"].map((t, i) => text(X + 40, TOP + 170 + i * 34, t, { size: 15, weight: 600, fill: C.cocoa })).join("")),
      dl: rect(X + 560, TOP + 140, 300, 48, { r: 10, fill: C.paper, stroke: C.line }) + rect(X + 574, TOP + 152, 24, 24, { r: 4, fill: "#e8eaed" }) + text(X + 610, TOP + 170, `nikahkit-${VER}.zip · Selesai`, { size: 13 }),
      files: fileWin(FX, FY, FW, FH, "Unduhan") + zipIcon(FX + 200, FY + 90, `nikahkit-${VER}.zip`),
      menu: rect(FX + 262, FY + 140, 190, 128, { r: 8, fill: C.paper, stroke: C.line }) + ["Open", "Extract All...", "Share", "Copy"].map((t, i) => (i === 1 ? rect(FX + 266, FY + 146 + i * 30, 182, 28, { r: 5, fill: C.svTint }) : "") + text(FX + 280, FY + 165 + i * 30, t, { size: 13, weight: i === 1 ? 600 : undefined })).join(""),
      extract: card(FX + 100, FY + 90, 460, 220, "Extract Compressed (Zipped) Folders", { titleSize: 15 }) + text(FX + 120, FY + 160, "Files will be extracted to this folder:", { size: 13, fill: C.muted }) +
        input(FX + 120, FY + 172, 420, "", `C:\\Users\\Rina\\Downloads\\nikahkit-${VER}`, { h: 32 }) + button(FX + 440, FY + 256, "Extract", { w: 100, color: "#1a73e8" }),
      outer: folderIcon(FX + 340, FY + 92, `nikahkit-${VER}`),
      inside: rect(FX + 131, FY + 39, FW - 132, FH - 40, { r: 0, fill: C.paper }) + text(FX + 150, FY + 66, `Unduhan › nikahkit-${VER}`, { size: 13, fill: C.muted }) + folderIcon(FX + 200, FY + 92, "NikahKit", { bold: true }) +
        rect(FX + 320, FY + 92, 300, 96, { r: 8, fill: C.bg }) + para(FX + 336, FY + 118, ["Isi folder NikahKit:", "manifest.json, nk-bg.js, pin.html …"], { size: 13, fill: C.muted, lh: 22 }),
      innerRing: ring(FX + 190, FY + 86, 84, 104),
      mac: rect(FX + 140, FY + FH - 70, FW - 160, 50, { r: 8, fill: C.warnTint }) + para(FX + 156, FY + FH - 50, ["Mac: klik dua kali ZIP, folder NikahKit langsung muncul.", "Pindahkan folder NikahKit ke Dokumen, jangan dihapus."], { size: 13, fill: C.warn, lh: 18 })
    };
    return {
      title: "Mengunduh dan mengekstrak ZIP NikahKit",
      base: [], els,
      steps: [
        { caption: "Buka halaman Cara pasang NikahKit, klik Unduh NikahKit.", at: [X + 695, TOP + 69], click: true, show: ["page", "dl"], dur: 3.4 },
        { caption: "Buka folder Unduhan. File ZIP NikahKit ada di sana.", hide: ["page", "dl"], show: ["files"], at: [FX + 228, FY + 124] },
        { caption: "Windows: klik kanan ZIP, pilih Extract All...", at: [FX + 330, FY + 191], click: true, show: ["menu"] },
        { caption: "Klik Extract. Windows membuat folder bernama sama dengan ZIP.", at: [FX + 490, FY + 273], click: true, hide: ["menu"], show: ["extract"], dur: 3.4 },
        { caption: "Buka folder itu. Di dalamnya ada folder NikahKit berisi manifest.json.", at: [FX + 372, FY + 124], click: true, hide: ["extract"], show: ["outer"], dur: 3 },
        { caption: "Folder NikahKit inilah yang dipilih nanti di Load unpacked.", at: [FX + 232, FY + 160], show: ["inside", "innerRing", "mac"], dur: 4.4 }
      ]
    };
  })(),

  // Pasang: chrome://extensions, Developer mode, Load unpacked.
  "pasang-load-unpacked": (() => {
    const PX = X + 190, PY = TOP + 40; // folder picker
    const els = {
      off: toggle(X + BW - 70, TOP + 22, false),
      on: toggle(X + BW - 70, TOP + 22, true),
      bar: devbar(),
      picker: card(PX, PY, 500, 320, "Pilih folder ekstensi") + rect(PX + 1, PY + 50, 130, 269, { r: 0, fill: "#f6f6f6" }) +
        ["Desktop", "Dokumen", "Unduhan"].map((n, i) => (i === 2 ? rect(PX + 6, PY + 58 + i * 30, 120, 26, { r: 5, fill: "#e4e4e4" }) : "") + text(PX + 18, PY + 76 + i * 30, n, { size: 13, fill: i === 2 ? C.ink : C.muted })).join("") +
        text(PX + 150, PY + 76, `Unduhan › nikahkit-${VER}`, { size: 12, fill: C.muted }) + rect(PX + 150, PY + 88, 336, 34, { r: 6, fill: C.paper }) + rect(PX + 162, PY + 98, 20, 15, { r: 3, fill: "#f2b84b" }) + text(PX + 192, PY + 110, "NikahKit", { size: 14 }) +
        button(PX + 290, PY + 274, "Batal", { variant: "ghost", color: C.muted, w: 90, h: 32 }) + button(PX + 390, PY + 274, "Select", { color: "#1a73e8", w: 96, h: 32 }),
      rowSel: rect(PX + 150, PY + 88, 336, 34, { r: 6, fill: "#d3e3fd" }) + rect(PX + 162, PY + 98, 20, 15, { r: 3, fill: "#f2b84b" }) + text(PX + 192, PY + 110, "NikahKit", { size: 14, weight: 600 }) +
        para(PX + 192, PY + 146, ["manifest.json", "nk-bg.js", "pin.html …"], { size: 12, fill: C.muted, lh: 20 }) + note(PX + 300, PY + 170, "ada manifest.json", PX + 250, PY + 142, { w: 150 }),
      cardNk: extCard(VER),
      puzzle: rect(X + BW - 50, Y + 44, 28, 24, { r: 6, fill: C.soft }) + rect(X + BW - 43, Y + 50, 13, 13, { r: 2, fill: "#5f6368" }) + circle(X + BW - 36.5, Y + 49, 3, { fill: "#5f6368" }) + circle(X + BW - 29, Y + 56.5, 3, { fill: "#5f6368" }),
      pinPop: card(X + BW - 300, Y + 74, 280, 112, "Extensions", { titleSize: 14 }) + rect(X + BW - 290, Y + 120, 32, 32, { r: 6, fill: C.accent }) + text(X + BW - 274, Y + 142, "N", { size: 15, weight: 700, fill: C.paper, anchor: "middle" }) +
        text(X + BW - 248, Y + 141, "NikahKit", { size: 14 }) + text(X + BW - 52, Y + 142, "📌", { size: 15, anchor: "middle" }),
      okToast: toast(X + 200, TOP + 330, "NikahKit terpasang. Jangan hapus atau pindahkan foldernya.", { w: 480 })
    };
    return {
      title: "Memasang NikahKit lewat Load unpacked",
      base: [extPage({ dev: false })],
      els,
      steps: [
        { caption: "Ketik chrome://extensions di kolom alamat Chrome, lalu Enter.", at: [X + 200, Y + 56], click: true, show: ["off"], dur: 3 },
        { caption: "Nyalakan Developer mode di kanan atas.", at: [X + BW - 50, TOP + 32], click: true, show: ["on", "bar"], hide: ["off"] },
        { caption: "Klik Load unpacked.", at: [X + 92, TOP + 83], click: true, show: ["picker"] },
        { caption: "Pilih folder NikahKit yang berisi manifest.json, bukan ZIP-nya.", at: [PX + 240, PY + 105], click: true, show: ["rowSel"], dur: 3.8 },
        { caption: "Klik Select. Kartu NikahKit muncul dan aktif.", at: [PX + 438, PY + 290], click: true, hide: ["picker", "rowSel"], show: ["cardNk", "okToast"], dur: 3.8 },
        { caption: "Opsional: klik ikon puzzle, lalu sematkan NikahKit.", at: [X + BW - 35, Y + 56], click: true, hide: ["okToast"], show: ["puzzle", "pinPop"], dur: 3.4 }
      ]
    };
  })(),

  // Pasang: open the Scalev page in HTML Mode and see the NikahKit tab.
  "gabung-tab-nikahkit-muncul": (() => {
    const list = browser(X, Y, BW, BH, "app.scalev.com/pages", { tab: "Scalev · Landing Pages" }) + rect(X + 1, TOP, 190, BH - 77, { r: 0, fill: C.bg }) +
      text(X + 20, TOP + 32, "Scalev", { size: 18, weight: 700, fill: C.sv }) + ["Home", "E-Payment", "Products", "Landing Pages", "Buku Tamu", "Orders", "Settings"].map((m, i) => (m === "Landing Pages" ? rect(X + 10, TOP + 48 + i * 34, 170, 30, { r: 6, fill: C.svTint }) : "") + text(X + 24, TOP + 68 + i * 34, m, { size: 13, fill: m === "Landing Pages" ? C.svDark : C.ink, weight: m === "Landing Pages" ? 600 : undefined })).join("") +
      line(X + 190, TOP, X + 190, Y + BH) + text(X + 220, TOP + 40, "Landing Pages", { size: 20, weight: 600 }) +
      ["Undangan Rina & Dimas", "Undangan Sari & Bayu", "Promo WO"].map((n, i) => rect(X + 220, TOP + 64 + i * 56, 630, 46, { r: 8, fill: C.paper, stroke: C.line }) + text(X + 240, TOP + 92 + i * 56, n, { size: 14, weight: i === 0 ? 600 : 400 }) + badge(X + 740, TOP + 78 + i * 56, "HTML Mode", {})).join("");
    const codeCover = panelCover() + para(X + 20, GY + 36, ['<!doctype html>', '<html>', '  <head>…</head>', '  <body>…</body>', '</html>'], { size: 12, fill: C.muted, lh: 22 });
    const tabX = X + 18 + 4 * 74; // NikahKit tab label x
    const els = {
      list,
      codeTab: edFrame({ tab: "Code" }) + codeCover,
      nkRing: ring(tabX - 4, TOP + 56, 66, 22, { r: 6 }),
      nkTab: edFrame({ tab: "NikahKit" }) + gate("Masuk ke NikahKit.", "", { extra: gBtn(X + 20, GY + 124) }),
      googleRing: ring(X + 20, GY + 124, 230, 40)
    };
    return {
      title: "Tab NikahKit muncul di editor Scalev",
      base: [], els,
      steps: [
        { caption: "Di Scalev, buka Landing Pages.", at: [X + 80, TOP + 165], show: ["list"], dur: 2.8 },
        { caption: "Klik halaman undangan yang memakai HTML Mode.", at: [X + 330, TOP + 87], click: true },
        { caption: "Editor terbuka. Lihat deretan tab di kiri atas.", hide: ["list"], show: ["codeTab"], dur: 2.8 },
        { caption: "Tab NikahKit ada di samping Settings. Klik tab itu.", at: [tabX + 28, TOP + 66], click: true, show: ["nkRing"], dur: 3.4 },
        { caption: "Panel NikahKit terbuka: Masuk ke NikahKit.", hide: ["codeTab", "nkRing"], show: ["nkTab", "googleRing"], dur: 3.6 }
      ]
    };
  })(),

  // Masuk dengan Google.
  "gabung-masuk-google": (() => {
    const GX = 540, GYY = 110, GW = 320, GH = 360;
    const els = {
      checking: dlgHead(120) + text(DX + 20, DY + 92, "Memeriksa login...", { size: 13, fill: C.muted }),
      google: browser(GX, GYY, GW, GH, "accounts.google.com", { tab: "Masuk - Akun Google" }) + text(GX + 24, GYY + 116, "Google", { size: 18, weight: 700, fill: "#4285f4" }) +
        text(GX + 24, GYY + 150, "Pilih akun", { size: 22 }) +
        rect(GX + 16, GYY + 176, GW - 32, 56, { r: 8, fill: C.paper, stroke: C.line }) + circle(GX + 44, GYY + 204, 14, { fill: C.accent }) + text(GX + 44, GYY + 209, "R", { size: 13, fill: C.paper, anchor: "middle", weight: 700 }) +
        text(GX + 68, GYY + 200, "Rina WO", { size: 14, weight: 600 }) + text(GX + 68, GYY + 218, EMAIL, { size: 12, fill: C.muted }) +
        rect(GX + 16, GYY + 240, GW - 32, 46, { r: 8, fill: C.paper, stroke: C.line }) + text(GX + 44, GYY + 268, "Gunakan akun lain", { size: 14, fill: C.muted }),
      signedIn: dlgIn({}),
      chooseRing: ring(DX + 36, DY + 148, 104, 28)
    };
    return {
      title: "Masuk ke NikahKit dengan akun Google",
      base: [edFrame({ tab: "NikahKit" }), gate("Masuk ke NikahKit.", "", { extra: gBtn(X + 20, GY + 124) })],
      els,
      steps: [
        { caption: "Di panel NikahKit, klik Masuk dengan Google.", at: [X + 135, GY + 144], click: true, dur: 3 },
        { caption: "Jendela NikahKit terbuka di atas editor, lalu jendela Google.", show: ["checking", "google"], dur: 3.4 },
        { caption: "Klik akun Google yang dipakai untuk membership.", at: [GX + 160, GYY + 204], click: true, dur: 3.2 },
        { caption: "Berhasil: email Google-mu tampil di atas, dengan tombol Keluar.", hide: ["checking", "google"], show: ["signedIn"], dur: 3.8 },
        { caption: "Belum berlangganan? Lanjut ke Pilih paket.", at: [DX + 88, DY + 162], show: ["chooseRing"], dur: 3.4 }
      ]
    };
  })(),

  // Plan comparison table (pin.html #compare).
  "gabung-pilih-paket": (() => {
    const t = planTable();
    return {
      title: "Membandingkan paket Bulanan, Tahunan, dan Sekali Bayar",
      base: [edFrame({ tab: "NikahKit" }), t.svg],
      els: {
        colA: ring(t.col(0), t.y0 + 4, 160, 128),
        colB: ring(t.col(1), t.y0 + 4, 160, 128),
        colC: ring(t.col(2), t.y0 + 4, 160, 128),
        rows: ring(t.x + 8, t.row(4), t.w - 16, 56),
        grace: ring(t.x + 8, t.row(8), t.w - 16, 28),
        foot: ring(t.x + 8, t.footY - 16, t.w - 16, 22)
      },
      steps: [
        { caption: "Bulanan: Rp79.000 per 30 hari. Cocok untuk mencoba dulu.", show: ["colA"], at: [t.col(0) + 80, t.y0 + 104], dur: 3.4 },
        { caption: "Tahunan: Rp299.000 per tahun, setara Rp24.917/bulan.", show: ["colB"], hide: ["colA"], at: [t.col(1) + 80, t.y0 + 104], dur: 3.4 },
        { caption: "Sekali Bayar: Rp699.000, tanpa perpanjang.", show: ["colC"], hide: ["colB"], at: [t.col(2) + 80, t.y0 + 104], dur: 3.2 },
        { caption: "Akun staff dan impor CSV hanya di Tahunan dan Sekali Bayar.", show: ["rows"], hide: ["colC"], at: [t.col(0) + 80, t.row(4) + 14], dur: 3.8 },
        { caption: "Masa aktif habis: tenggang 7 hari, undangan tetap tampil.", show: ["grace"], hide: ["rows"], at: [t.col(0) + 80, t.row(8) + 14], dur: 3.6 },
        { caption: "Harga belum termasuk biaya layanan pembayaran Scalev.", show: ["foot"], hide: ["grace"], at: [t.x + 300, t.footY - 6], dur: 3.6 }
      ]
    };
  })(),

  // Choose a plan, pay in Scalev, Cek pembayaran, Periksa lagi.
  "gabung-bayar-paket": (() => {
    const t = planTable();
    const payX = X, payY = Y;
    const els = {
      start: dlgIn({}),
      table: t.svg,
      pay: screen() + browser(payX, payY, BW, BH, "nikahin.myscalev.com/…", { tab: "Nikahin's Store" }) +
        text(payX + 40, payY + 130, "NikahKit Tahunan", { size: 20, weight: 700 }) + text(payX + 40, payY + 160, "Rp299.000", { size: 18, weight: 700, fill: C.sv }) +
        [0, 1, 2].map((i) => rect(payX + 40, payY + 190 + i * 54, 420, 44, { r: 8, fill: C.bg, stroke: C.line })).join("") + rect(payX + 40, payY + 360, 420, 44, { r: 8, fill: C.sv }) +
        note(payX + 500, payY + 230, "Halaman bayar Scalev", payX + 462, payY + 240, { w: 190 }),
      waiting: dlgIn({ paid: true, msg: ["Halaman bayar terbuka di tab baru. Setelah bayar,", "tekan Cek pembayaran."] }),
      active: dlgIn({ lic: "Paket Tahunan, aktif sampai 14 Oktober 2027.", choose: "Perpanjang atau ganti paket", redeem: false, msg: "Langganan aktif. Tekan Periksa lagi di panel NikahKit." }),
      gateOk: edFrame({ tab: "NikahKit", railActive: "Template" }) + rect(X + 65, GY, 394, BH - 162, { r: 0, fill: C.paper }) + text(X + 84, GY + 32, "Template", { size: 18, weight: 700 }) + rect(X + 84, GY + 52, 160, 110, { r: 8, fill: C.tint }) + rect(X + 260, GY + 52, 160, 110, { r: 8, fill: C.svTint })
    };
    return {
      title: "Memilih paket dan membayar di Scalev",
      base: [edFrame({ tab: "NikahKit" }), gate("Akun belum berlangganan.", "", { chip: "Akun", extra: small(X + 20, GY + 124, "Pilih paket") + small(X + 146, GY + 124, "Periksa lagi", { variant: "ghost" }) })],
      els,
      steps: [
        { caption: "Di jendela NikahKit, klik Pilih paket.", at: [DX + 80, DY + 162], click: true, show: ["start"], dur: 3 },
        { caption: "Tabel paket muncul. Klik Pilih di paket yang kamu mau.", at: [t.col(1) + 80, t.y0 + 104], click: true, show: ["table"], dur: 3.4 },
        { caption: "Halaman bayar Scalev terbuka di tab baru. Selesaikan pembayaran.", hide: ["start", "table"], show: ["pay"], dur: 3.8 },
        { caption: "Kembali ke tab editor. Klik Cek pembayaran.", at: [DX + 196, DY + 162], click: true, hide: ["pay"], show: ["waiting"], dur: 3.6 },
        { caption: "Langganan aktif. Tutup jendela ini dengan tombol Esc.", hide: ["waiting"], show: ["active"], dur: 3.6 },
        { caption: "Di panel, klik Periksa lagi. Editor NikahKit terbuka.", at: [X + 196, GY + 138], click: true, hide: ["active"], show: ["gateOk"], dur: 3.8 }
      ]
    };
  })(),

  // Hubungkan bisnis Scalev.
  "gabung-hubungkan-scalev": (() => {
    const SX = 560, SY = 90, SW = 360, SH = 380;
    const els = {
      dlg: dlgIn({ lic: "Paket Tahunan, aktif sampai 14 Oktober 2027.", choose: "Perpanjang atau ganti paket", redeem: false }),
      bizRing: ring(DX + 36, DY + 348, 207, 26),
      consent: browser(SX, SY, SW, SH, "app.scalev.com/oauth/authorize", { tab: "Scalev" }) + text(SX + 24, SY + 116, "Scalev", { size: 20, weight: 700, fill: C.sv }) +
        rect(SX + 24, SY + 136, 300, 12, { r: 6, fill: C.soft }) + rect(SX + 24, SY + 158, 250, 12, { r: 6, fill: C.soft }) + rect(SX + 24, SY + 190, 312, 64, { r: 8, fill: C.bg, stroke: C.line }) +
        rect(SX + 24, SY + 300, 312, 40, { r: 8, fill: C.sv }) + note(SX + 40, SY + 260, "Setujui di layar izin Scalev", SX + 180, SY + 300, { w: 230 }),
      linked: dlgIn({ lic: "Paket Tahunan, aktif sampai 14 Oktober 2027.", choose: "Perpanjang atau ganti paket", redeem: false, biz: "Rina Wedding Organizer (@rinawo)", connect: "Hubungkan ulang", msg: "Bisnis Scalev terhubung." }),
      open: edFrame({ tab: "NikahKit", railActive: "Template" }) + rect(X + 65, GY, 394, BH - 162, { r: 0, fill: C.paper }) + text(X + 84, GY + 32, "Template", { size: 18, weight: 700 }) + rect(X + 84, GY + 52, 160, 110, { r: 8, fill: C.tint }) + rect(X + 260, GY + 52, 160, 110, { r: 8, fill: C.svTint })
    };
    return {
      title: "Menghubungkan bisnis Scalev ke akun NikahKit",
      base: [edFrame({ tab: "NikahKit" }), gate("Hubungkan bisnis Scalev dulu.", ["Hubungkan di akun NikahKit, lalu tekan", "Periksa lagi."], { warn: true, chip: "Tahunan",
        extra: small(X + 20, GY + 160, "Hubungkan bisnis Scalev") + small(X + 240, GY + 160, "Periksa lagi", { variant: "ghost" }) })],
      els,
      steps: [
        { caption: "Panel bilang: Hubungkan bisnis Scalev dulu. Klik tombol itu.", at: [X + 110, GY + 174], click: true, dur: 3.4 },
        { caption: "Di kartu Bisnis Scalev, klik Hubungkan bisnis Scalev.", at: [DX + 120, DY + 361], click: true, show: ["dlg", "bizRing"], dur: 3.4 },
        { caption: "Jendela Scalev terbuka. Masuk bila diminta, lalu setujui akses.", at: [SX + 180, SY + 320], click: true, hide: ["bizRing"], show: ["consent"], dur: 4 },
        { caption: "Nama bisnis tampil. Tombol berubah jadi Hubungkan ulang.", hide: ["consent", "dlg"], show: ["linked"], dur: 3.8 },
        { caption: "Tekan Esc, lalu klik Periksa lagi. Editor NikahKit terbuka.", at: [X + 290, GY + 174], click: true, hide: ["linked"], show: ["open"], dur: 3.8 }
      ]
    };
  })(),

  // Update ekstensi.
  "gabung-update": (() => {
    const FX = 150, FY = 70, FW = 660, FH = 400;
    const banner = (hint) => rect(X + 80, GY + 50, 364, hint ? 128 : 96, { r: 8, fill: C.warnTint }) + text(X + 94, GY + 74, `NikahKit ${NEW} tersedia.`, { size: 13, weight: 700, fill: C.warn }) +
      text(X + 262, GY + 74, `Anda memakai ${VER}.`, { size: 13, fill: C.ink }) + small(X + 94, GY + 90, "⤓ Update") + small(X + 188, GY + 90, "Cara update", { variant: "ghost" }) +
      (hint ? para(X + 94, GY + 144, ["Ekstrak ZIP, timpa isi folder NikahKit, lalu", "klik ↻ di chrome://extensions."], { size: 12, lh: 16, fill: C.ink }) : "");
    const ed = (b) => edFrame({ tab: "NikahKit", railActive: "Template" }) + rect(X + 65, GY, 394, BH - 162, { r: 0, fill: C.paper }) + text(X + 84, GY + 32, "Template", { size: 18, weight: 700 }) + b;
    const els = {
      e1: ed(banner(false)),
      e2: ed(banner(true)) + rect(X + BW - 330, TOP + 6, 310, 46, { r: 8, fill: C.paper, stroke: C.line }) + text(X + BW - 316, TOP + 34, `nikahkit-${NEW}.zip · Selesai`, { size: 13 }),
      files: screen(fileWin(FX, FY, FW, FH, `Unduhan › nikahkit-${NEW}`)) + folderIcon(FX + 200, FY + 92, "NikahKit", { bold: true }) + text(FX + 150, FY + 66, "ZIP baru sudah diekstrak:", { size: 13, fill: C.muted }) +
        note(FX + 300, FY + 210, "salin semua isinya", FX + 232, FY + 160, { w: 160 }),
      replace: screen(fileWin(FX, FY, FW, FH, "Dokumen › NikahKit", "Dokumen")) + text(FX + 150, FY + 66, "Folder NikahKit lama (yang dipilih saat Load unpacked):", { size: 13, fill: C.muted }) +
        ["manifest.json", "nk-bg.js", "pin.html", "…"].map((f, i) => rect(FX + 150, FY + 84 + i * 34, 300, 28, { r: 5, fill: i < 3 ? C.bg : C.paper }) + text(FX + 164, FY + 103 + i * 34, f, { size: 13 })).join("") +
        note(FX + 330, FY + 250, "Tempel, lalu pilih timpa semua", FX + 300, FY + 160, { w: 240 }),
      ext: screen(extPage({ card: "old" })),
      reloadRing: ring(RELOAD[0] - 14, RELOAD[1] - 16, 28, 28, { r: 14 }),
      extNew: extCard(NEW),
      e3: ed(rect(X + 80, GY + 50, 364, 60, { r: 8, fill: C.okTint }) + text(X + 94, GY + 86, "Banner update hilang: versi terbaru terpasang.", { size: 13, fill: C.ok, weight: 600 }))
    };
    return {
      title: "Memperbarui NikahKit ke versi baru",
      base: [], els,
      steps: [
        { caption: "Ada versi baru? Banner kuning muncul. Klik Update.", at: [X + 130, GY + 104], click: true, show: ["e1"], dur: 3.4 },
        { caption: "ZIP terbaru terunduh. Ekstrak seperti saat memasang.", hide: ["e1"], show: ["e2"], dur: 3.4 },
        { caption: "Buka folder hasil ekstrak, salin isi folder NikahKit yang baru.", hide: ["e2"], show: ["files"], at: [FX + 232, FY + 124], dur: 3.4 },
        { caption: "Buka folder NikahKit lama, tempel, lalu pilih timpa semua file.", at: [FX + 300, FY + 160], click: true, hide: ["files"], show: ["replace"], dur: 3.8 },
        { caption: "Di chrome://extensions, klik ↻ di kartu NikahKit.", at: RELOAD, click: true, hide: ["replace"], show: ["ext", "reloadRing"], dur: 3.4 },
        { caption: "Nomor versi di kartu berubah ke versi baru.", show: ["extNew"], hide: ["reloadRing"], dur: 3 },
        { caption: "Muat ulang editor Scalev (F5). Banner update hilang.", hide: ["ext", "extNew"], show: ["e3"], dur: 3.6 }
      ]
    };
  })()
};

// ---- Helpers used by the scenes above (hoisted function declarations) ------------------------------------------------
function extCardMini(x, y) {
  return rect(x, y, 420, 120, { r: 10, fill: C.bg, stroke: C.line }) + rect(x + 18, y + 18, 36, 36, { r: 8, fill: C.accent }) + text(x + 36, y + 42, "N", { size: 16, weight: 700, fill: C.paper, anchor: "middle" }) +
    text(x + 68, y + 34, `NikahKit ${VER}`, { size: 14, weight: 600 }) + text(x + 68, y + 54, "chrome://extensions · Load unpacked", { size: 12, fill: C.muted }) + toggle(x + 360, y + 80, true);
}
function phoneMini(x, y, label) {
  return rect(x, y, 96, 140, { r: 16, fill: "#1f1f1f" }) + rect(x + 6, y + 14, 84, 116, { r: 4, fill: C.tint }) + (label ? text(x + 48, y + 66, label, { size: 11, anchor: "middle", weight: 700, fill: C.cocoa }) : "") +
    rect(x + 22, y + 92, 52, 18, { r: 9, fill: C.accent });
}
function waBubble(x, y, lines) {
  return rect(x, y, 560, 120, { r: 10, fill: C.waTint }) + para(x + 16, y + 26, lines, { size: 13, lh: 22, fill: C.ink }) + circle(x + 620, y + 60, 36, { fill: C.wa }) + text(x + 620, y + 66, "WA", { size: 16, weight: 700, fill: C.paper, anchor: "middle" });
}
// pin.html "Pilih paket" table (wide dialog).
function planTable() {
  const x = 100, w = 760, y = 30, h = 486;
  const fw = 250, cw = 170;
  const col = (i) => x + fw + i * cw;
  const y0 = y + 52; // plan header block top
  const rowH = 28, ry = y0 + 136;
  const row = (i) => ry + i * rowH;
  const rows = [
    ["Masa aktif", "30 hari", "1 tahun", "Selama layanan berjalan"],
    ["Jumlah undangan", "Tanpa batas", "Tanpa batas", "Tanpa batas"],
    ["Editor NikahKit di Scalev", "✓", "✓", "✓"],
    ["Buku Tamu Digital", "✓", "✓", "✓"],
    ["Akun staff penerima tamu", "✗", "✓", "✓"],
    ["Impor daftar tamu CSV", "✗", "✓", "✓"],
    ["PIN dashboard dan tautan tamu", "✓", "✓", "✓"],
    ["Semua template yang tersedia", "✓", "✓", "✓"],
    ["Saat masa aktif habis", "Tenggang 7 hari", "Tenggang 7 hari", "Tidak perlu perpanjang"]
  ];
  const plans = [["", "Bulanan", "Rp79.000", "per 30 hari", true], ["Paling hemat", "Tahunan", "Rp299.000", "per tahun, setara Rp24.917/bulan", false], ["", "Sekali Bayar", "Rp699.000", "sekali bayar, tanpa perpanjang", true]];
  let s = dim() + card(x, y, w, h, null) + text(x + 20, y + 32, "Pilih paket", { size: 16, weight: 700 }) + button(x + w - 104, y + 12, "Kembali", { variant: "ghost", w: 84, h: 30, size: 13 });
  s += rect(col(1), y0, cw, row(9) - y0, { r: 0, fill: C.bg });
  plans.forEach(([tag, name, price, per, ghost], i) => {
    const cx = col(i) + 12;
    if (tag) s += rect(cx, y0 + 6, tag.length * 7 + 12, 18, { r: 4, fill: C.svTint }) + text(cx + 6, y0 + 19, tag, { size: 11, weight: 600, fill: C.svDark });
    s += text(cx, y0 + 42, name, { size: 14, weight: 700 }) + text(cx, y0 + 64, price, { size: 17, weight: 700, fill: C.sv });
    s += per.length > 22 ? para(cx, y0 + 80, per.includes("setara") ? ["per tahun, setara", "Rp24.917/bulan"] : ["sekali bayar, tanpa", "perpanjang"], { size: 11, fill: C.muted, lh: 13 }) : text(cx, y0 + 80, per, { size: 11, fill: C.muted });
    s += button(cx, y0 + 102, "Pilih", { variant: ghost ? "ghost" : "primary", w: cw - 24, h: 28, size: 13 });
  });
  rows.forEach((r, i) => {
    s += line(x + 12, row(i), x + w - 12, row(i));
    s += text(x + 20, row(i) + 19, r[0], { size: 12 });
    r.slice(1).forEach((v, j) => (s += text(col(j) + 12, row(i) + 19, v, { size: v.length > 1 ? 11 : 14, weight: 600, fill: v === "✓" ? C.ok : v === "✗" ? "#9aa0a6" : C.ink })));
  });
  const footY = row(9) + 26;
  s += text(x + 20, footY, "Harga belum termasuk biaya layanan pembayaran Scalev. Perpanjang kapan saja: sisa masa aktif tetap terhitung.", { size: 11, fill: C.muted });
  return { svg: s, x, w, y0, col, row, footY };
}
