// Scenes for the "Bagikan dan tamu" pages (panduan/docs/tamu/*), drawn at real size in a 1440x985 Chrome window
// (Buku Tamu: 1112 wide, see WIN).
// Labels and layout follow nikahkit/src/ui/App.jsx (ShareDialog, AccessSection, ResellerPin), nikahkit/ext/pin.html +
// pin.js (PIN window), nikahkit/ext/buku-tamu.html + buku-tamu.js (Buku Tamu), server/pages/src/panel/index.html
// (dashboard gate, Hari-H for staff) and the guest gate texts (gatePrivate*). Measured from /tmp/ref/editor-bagikan.png,
// editor-akun.png, scalev-bukutamu.png, dash-gate-hp.png, dash-hari-h-hp.png (14 Okt 2026).
import {
  C, CHROME_TOP as T, ED, chrome, favScalev, scalevEditor, scalevApp, svMenuAt, nkHead, nkAcc, nkDialogHead, nkBtn, nkLabel, nkHint,
  nkSwitch, nkH3, nkLogo, icon, iconX, rect, text, para, line, circle, clipped, shadow, ring, tw, esc
} from "../lib.mjs";

const PAGE = "rani-dimas", PUBLIC = `https://tokomu.myscalev.com/${PAGE}`, WID = "365671";
const SERIF = "Georgia,'Times New Roman',serif";
const MAROON = "#8b2c23", CREAM = "#fdf6ee";
const scalevTab = (active = true) => ({ title: "Scalev", fav: favScalev, active });

// ---- Shared bits ---------------------------------------------------------------------------------------------------
// Button with the real nk-btn look but any text colour (Buku Tamu "Hapus"/"Cabut" read red on a quiet button).
function btn(x, y, label, o = {}) {
  const size = o.size ?? 14, h = o.h ?? 36, v = o.variant ?? "quiet", w = o.w ?? tw(label, size, 500) + (h <= 28 ? 18 : 26);
  const fill = v === "primary" ? C.action : C.white, stroke = v === "primary" ? C.action : v === "ghost" ? C.action : C.line;
  const fg = v === "primary" ? C.white : v === "ghost" ? C.action : o.danger ? C.danger : C.strong;
  return rect(x + 0.5, y + 0.5, w - 1, h - 1, { r: 4, fill, stroke }) + text(x + w / 2, y + h / 2 + size * 0.36, label, { size, weight: 500, fill: fg, anchor: "middle" });
}
const bw = (label, size = 14, h = 36) => tw(label, size, 500) + (h <= 28 ? 18 : 26);
// Buku Tamu .badge (muted) and .badge--new.
function badge(x, y, label, fresh) {
  const w = tw(label, 12, fresh ? 500 : 400) + 12;
  return { w, svg: rect(x, y, w, 18, { r: 4, fill: fresh ? C.primarySoft : C.mutedBg }) + text(x + 6, y + 13, label, { size: 12, weight: fresh ? 500 : 400, fill: fresh ? C.action : C.text }) };
}
const checkbox = (x, y, on) => on
  ? rect(x, y, 16, 16, { r: 3, fill: C.crBlue }) + `<path d="M${x + 4} ${y + 8.5} l3 3 l5.5 -6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
  : rect(x + 0.5, y + 0.5, 15, 15, { r: 3, fill: C.white, stroke: "#767676" });
// One line of mixed weights (Buku Tamu <strong> inside a sentence): tspans keep the real spacing.
const rich = (x, y, parts, o = {}) => `<text x="${x}" y="${y}" font-size="${o.size ?? 14}" fill="${o.fill ?? C.text}" style="white-space:pre">` +
  parts.map(([s, w]) => `<tspan${w ? ` font-weight="${w}"` : ""}>${esc(s)}</tspan>`).join("") + "</text>";
// Another device or app: a neutral backdrop over the whole window, then a plain phone screen.
const backdrop = () => rect(0, 0, 1440, 985, { fill: "#e6eaef" });
const selectBox = (x, y, w, value, o = {}) => rect(x + 0.5, y + 0.5, w - 1, (o.h ?? 36) - 1, { r: 4, fill: C.white, stroke: o.focus ? C.primary : C.field, sw: o.focus ? 2 : 1 }) +
  text(x + 11, y + (o.h ?? 36) / 2 + 5, value, { size: 14, fill: C.strong }) + icon("chevron-down", x + w - 16, y + (o.h ?? 36) / 2, 16, C.text);

// ---- Editor: Chrome + Scalev editor + preview screen ----------------------------------------------------------------
// The QA template's Mempelai section in the preview screen (editor-bagikan.png), drawn as plain shapes.
function invPreview() {
  const { x, y, w } = ED.screen, X = x, Y = y + T, cx = X + w / 2;
  let s = rect(X, Y, w, 18, { fill: MAROON });
  for (let i = 0; i < 9; i++) s += circle(X + 22 + i * 44, Y + 16, 16, { fill: MAROON });
  [[X + 50, Y + 80], [X + w - 50, Y + 80]].forEach(([a, b]) => (s += circle(a, b, 14, { fill: MAROON }) + circle(a - 16, b + 6, 10, { fill: MAROON }) + circle(a + 16, b + 6, 10, { fill: MAROON })));
  s += text(cx, Y + 158, "Mempelai", { size: 46, fill: MAROON, anchor: "middle", italic: true, font: SERIF }) +
    `<defs><linearGradient id="tmPh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9aa3ad"/><stop offset=".55" stop-color="#7d3a37"/><stop offset="1" stop-color="#5e1f22"/></linearGradient></defs>` +
    `<path d="M${cx - 89} ${Y + 442} V${Y + 292} a89 89 0 0 1 178 0 V${Y + 442} Z" fill="url(#tmPh)" stroke="${MAROON}" stroke-width="2"/>` +
    circle(cx, Y + 300, 38, { fill: "#e6c1a6" }) + `<path d="M${cx - 70} ${Y + 442} q0 -70 70 -78 q70 8 70 78 z" fill="#8f1f2c"/>` +
    text(cx, Y + 500, "Rani", { size: 32, fill: MAROON, anchor: "middle", italic: true, font: SERIF }) +
    text(cx, Y + 537, "Rani Ayu, S.Psi.", { size: 16, weight: 700, fill: "#1a1a1a", anchor: "middle", font: SERIF }) +
    text(cx, Y + 562, "Psikolog", { size: 14, fill: "#333", anchor: "middle", font: SERIF }) +
    text(cx, Y + 588, "Putri kedua dari Bapak Ahmad & Almh. Ibu Siti", { size: 15, fill: "#1a1a1a", anchor: "middle", font: SERIF }) +
    text(cx, Y + 614, "Jakarta", { size: 15, fill: "#1a1a1a", anchor: "middle", font: SERIF }) +
    rect(cx - 54, Y + 628, 108, 34, { r: 17, fill: MAROON }) + icon("instagram", cx - 32, Y + 645, 14, C.white) + text(cx + 8, Y + 650, "@rani.ayu", { size: 13, fill: C.white, anchor: "middle", font: SERIF }) +
    circle(X + 338, Y + 659, 27, { fill: "#1d1d1d" }) + circle(X + 338, Y + 659, 9, { fill: C.white }) +
    rect(X + 36, Y + 704, 318, 70, { r: 16, fill: MAROON });
  [["heart", "Mempelai"], ["calendar", "Acara"], ["image", "Galeri"], ["message-circle", "Ucapan"], ["gift", "Hadiah"]].forEach(([ic, l], i) => {
    const ix = X + 75 + i * 60;
    if (!i) s += rect(ix - 30, Y + 712, 60, 54, { r: 10, fill: "rgba(255,255,255,.18)" });
    s += icon(ic, ix, Y + 731, 18, C.white) + text(ix, Y + 755, l, { size: 11, fill: C.white, anchor: "middle", font: SERIF });
  });
  return s;
}
const editorBase = () => [
  chrome(0, 0, 1440, 985, { tabs: [scalevTab()], url: `app.scalev.com/pages/${WID}` }),
  scalevEditor(0, T, { rail: "Konten" }),
  nkHead(0, T, "Konten", { account: "Tahunan" }) + nkAcc(88, T + 169, 279, "Sampul", { badge: "Terisi" }) + nkAcc(88, T + 227, 279, "Mempelai", { badge: "Terisi" }) + nkAcc(88, T + 285, 279, "Acara & Tanggal", { badge: "Terisi" }),
  invPreview()
];
const BAGIKAN = [36, T + 589];

// ---- Bagikan dialog (measured: editor-metrics.json "Bagikan", 366 wide body at x 16) --------------------------------
// d = 0 with the "Perubahan belum disimpan" note (editor-bagikan.png), -50 without it.
const urlBox = (y, lines) => rect(16, y, 366, 52, { r: 4, fill: C.mutedBg }) + para(26, y + 20, lines, { size: 12, fill: C.strong, lh: 18 }).replace("<text", `<text font-family="'Roboto Mono',ui-monospace,Menlo,monospace"`);
function shareTop(d, o = {}) {
  const Y = T + d;
  return nkDialogHead(0, T, "Bagikan") +
    (d === 0 ? rect(16, T + 169, 366, 38, { r: 4, fill: C.warnSoft }) + text(28, T + 192, "Perubahan belum disimpan di Scalev.", { size: 12, fill: C.warnStrong }) : "") +
    nkLabel(16, Y + 231, "Nama tamu") +
    rect(16.5, Y + 239.5, 365, 35, { r: 4, fill: C.white, stroke: o.focus ? C.primary : C.field, sw: o.focus ? 2 : 1 }) + text(27, Y + 262, "Nama Tamu", { size: 14, fill: C.strong }) +
    nkHint(16, Y + 295, "Ditambahkan sebagai ?to=Nama.") + urlBox(Y + 311, [`${PUBLIC}?`, "to=Nama+Tamu"]);
}
const shareBtns = {
  lihat: (d) => nkBtn(16, T + d + 375, "Lihat sebagai tamu", { w: 366, size: 14, icon: "eye" }),
  salin: (d) => nkBtn(16, T + d + 419, "Salin tautan tamu", { w: 366, size: 14, variant: "ghost", icon: "copy" }),
  umum: (d) => nkBtn(16, T + d + 463, "Salin tautan umum", { w: 366, size: 14, variant: "quiet", icon: "link" })
};
// Undangan khusus heading + switch row + hint (y = top of the H3 box).
const accessHead = (y, on) => nkH3(16, y + 12, "Undangan khusus") + text(16, y + 49, "Undangan khusus", { size: 14, fill: C.text }) + nkSwitch(346, y + 34, on) +
  para(16, y + 78, ["Isi undangan tidak ada di kode halaman. Server Nikahin", "mengirimnya hanya ke tamu dengan tautan sah."], { size: 12, fill: C.faint, lh: 16 });
// Untuk pengantin + PIN dashboard (y = top of the "Untuk pengantin" H3 box).
const forCouple = (y) => nkH3(16, y + 12, "Untuk pengantin") +
  nkBtn(16, y + 24, "Kirim undangan", { w: 366, size: 14, variant: "ghost", icon: "link" }) +
  nkBtn(16, y + 68, "Buka Dashboard", { w: 366, size: 14, variant: "quiet", icon: "layout-grid" }) +
  nkHint(16, y + 120, "Masuk dengan PIN dashboard.") + nkH3(16, y + 160, "PIN dashboard");
const pinBtn = (y) => nkBtn(16, y + 172, "Kelola PIN dashboard", { w: 366, size: 14, icon: "lock" });
const pinHint = (y) => nkHint(16, y + 224, "PIN hanya tampil di jendela NikahKit.");
// Access section when switched on (y = top of the Keamanan field, i.e. 12 px under the switch hint).
const MODES = { link: ["Tautan pribadi", "Hanya tamu dengan tautan dari Dashboard > Kirim."], device: ["+ Kunci perangkat", "Tautan yang diteruskan tidak terbuka di perangkat lain."] };
function accessOn(y, mode, devices) {
  let s = rect(0, y - 4, 399, 985 - y + 4, { fill: C.white }) + nkLabel(16, y + 12, "Keamanan") + selectBox(16, y + 20, 366, MODES[mode][0]) + nkHint(16, y + 72, MODES[mode][1]);
  let at = y + 92;
  if (mode !== "link") { s += nkLabel(16, at + 12, "Perangkat per tamu") + selectBox(16, at + 20, 366, String(devices)); at += 68; }
  s += para(16, at + 16, ["Tamu tetap bisa memotret layar. Tombol WhatsApp di halaman", "pribadi memakai nomor konfirmasi hadiah."], { size: 12, fill: C.faint, lh: 16 });
  at += 36;
  s += rect(16, at, 366, 56, { r: 4, fill: C.warnSoft }) + para(28, at + 23, ["Tautan di atas tanpa token. Buat tautan tamu di", "Dashboard > Kirim."], { size: 12, fill: C.warnStrong, lh: 18 });
  at += 88;
  return s + forCouple(at) + pinBtn(at) + pinHint(at);
}

// Guest page in a new tab, as seen in the 400 px wide crop of the scenes (the flow column fills it).
function guestTab() {
  const cx = 200;
  let s = chrome(0, 0, 1440, 985, { tabs: [scalevTab(false), { title: "Rani & Dimas", active: true }], url: `tokomu.myscalev.com/${PAGE}?to=Budi+Santoso` }) +
    rect(0, T, 1440, 900, { fill: "#f1e6d8" }) + rect(cx - 240, T, 480, 900, { fill: CREAM }) + rect(cx - 240, T, 480, 16, { fill: MAROON });
  for (let i = 0; i < 11; i++) s += circle(cx - 218 + i * 44, T + 14, 16, { fill: MAROON });
  return s + text(cx, 336, "The Wedding of", { size: 18, fill: "#4a3a30", anchor: "middle", italic: true, font: SERIF }) +
    text(cx, 398, "Rani & Dimas", { size: 54, fill: MAROON, anchor: "middle", italic: true, font: SERIF }) +
    text(cx, 438, "Sabtu, 12 Desember 2026", { size: 15, fill: "#4a3a30", anchor: "middle", font: SERIF }) +
    line(cx - 60, 466, cx + 60, 466, { stroke: MAROON }) +
    text(cx, 504, "Kepada Yth:", { size: 14, fill: "#4a3a30", anchor: "middle", font: SERIF }) +
    text(cx, 540, "Budi Santoso", { size: 24, weight: 700, fill: "#1a1a1a", anchor: "middle", font: SERIF }) +
    rect(cx - 98, 562, 196, 44, { r: 22, fill: MAROON }) + icon("mail", cx - 68, 584, 16, C.white) + text(cx + 12, 589, "Buka Undangan", { size: 15, weight: 700, fill: C.white, anchor: "middle", font: SERIF });
}
// Opened without a guest link while Undangan khusus is on: the private gate (render.js .nk-gate: centred card,
// 28 px title with text-wrap: balance), wrapped as in the 400 px wide crop.
function gateTab() {
  return chrome(0, 0, 1440, 985, { tabs: [scalevTab(false), { title: "Undangan ini bersifat pribadi", active: true, w: 260 }], url: `tokomu.myscalev.com/${PAGE}` }) +
    rect(0, T, 1440, 900, { fill: CREAM }) +
    text(200, 476, "Undangan ini", { size: 28, fill: MAROON, anchor: "middle", font: SERIF }) + text(200, 510, "bersifat pribadi", { size: 28, fill: MAROON, anchor: "middle", font: SERIF }) +
    para(200, 548, ["Undangan ini hanya terbuka lewat tautan", "pribadi yang dikirim pengantin kepada Anda.", "Buka tautan itu, atau hubungi pengantin."], { size: 15, fill: "#3a2e28", anchor: "middle", lh: 23 });
}

// ---- PIN window (pin.html framed by pin-frame.js: 440 wide, centred, 8 px corners) ----------------------------------
const card = (x, y, w, h) => rect(x + 0.5, y + 0.5, w - 1, h - 1, { r: 8, fill: C.white, stroke: C.line });
function pinWindow(made) {
  const h = made ? 598 : 512, X = 500, Y = T + Math.round((900 - h) / 2), L = X + 16, W2 = 408;
  let s = shadow(X, Y, 440, h, 8, 3) + rect(X, Y, 440, h, { r: 8, fill: C.page }) + iconX("x", X + 410, Y + 30, 18, C.text) +
    nkLogo(L + 16, Y + 32, 32) + text(L + 42, Y + 34, "NikahKit", { size: 16, weight: 700, fill: C.strong }) + text(L + 42, Y + 52, `ID ${WID}`, { size: 12, fill: C.faint }) +
    text(L, Y + 88, "rinawo@gmail.com", { size: 12, weight: 700, fill: C.faint }) + text(L + W2, Y + 88, "Keluar", { size: 12, weight: 500, fill: C.strong, anchor: "end", underline: true });
  let y = Y + 104;
  s += card(L, y, W2, 120) + nkH3(L + 17, y + 28, "Paket") + text(L + 17, y + 55, "Paket Tahunan, aktif sampai 14 Oktober 2027.", { size: 14, fill: C.text }) +
    btn(L + 17, y + 68, "Perpanjang atau ganti paket", { variant: "primary" });
  y += 132;
  const ph = made ? 164 : 116;
  s += card(L, y, W2, ph) + nkH3(L + 17, y + 28, "PIN dashboard");
  if (!made) s += nkHint(L + 17, y + 52, "Undangan ini belum punya PIN.") + btn(L + 17, y + 64, "Buat PIN", { variant: "primary" });
  else s += nkHint(L + 17, y + 52, "PIN aktif (versi 1). Lupa? Lihat lagi kapan saja.") +
    rect(L + 17, y + 64, 294, 40, { r: 4, fill: C.mutedBg }) + `<text x="${L + 29}" y="${y + 90}" font-size="16" font-weight="700" fill="${C.strong}" letter-spacing="6" font-family="'Roboto Mono',ui-monospace,Menlo,monospace">482913</text>` +
    icon("copy", L + 333, y + 84, 18, C.text) + icon("message-circle", L + 373, y + 84, 18, C.text) +
    btn(L + 17, y + 112, "Lihat PIN", { variant: "primary" }) + btn(L + 17 + bw("Lihat PIN") + 8, y + 112, "Buat PIN baru");
  y += ph + 12;
  s += card(L, y, W2, 120) + nkH3(L + 17, y + 28, "Bisnis Scalev") + text(L + 17, y + 55, "Rina WO (@rinawo)", { size: 14, fill: C.text }) + btn(L + 17, y + 68, "Hubungkan ulang");
  if (made) s += rect(L, y + 132, W2, 38, { r: 4, fill: C.primarySoft }) + text(L + 12, y + 155, "PIN dibuat. Bisa dilihat lagi kapan saja lewat Lihat PIN.", { size: 12, fill: C.strong });
  return s;
}
const PIN_MADE_Y = T + Math.round((900 - 598) / 2); // 236
const PIN_ROW = PIN_MADE_Y + 104 + 132 + 84; // centre of the PIN output row
const MSG_Y = PIN_MADE_Y + 104 + 132 + 164 + 12 + 132;

// WhatsApp-like chat on a plain phone screen (not captured: no labels beyond the pasted message), h tall.
function waPhone(x, y, h) {
  const lines = [
    ["Undangan siap:", 0], [PUBLIC, 1], ["Kelola undangan (kirim ke tamu, RSVP,", 0], ["ucapan, check-in):", 0],
    ["https://tokomu.myscalev.com/kelola?w=", 1], [`${WID}&link=https%3A%2F%2Ftokomu.`, 1], ["myscalev.com%2Frani-dimas", 1], ["PIN: 482913", 0]
  ];
  const bh = 24 + lines.length * 20;
  return shadow(x, y, 390, h, 0, 3) + rect(x, y, 390, h, { fill: "#efeae2" }) + rect(x, y, 390, 64, { fill: "#f0f2f5" }) +
    iconX("arrow-left", x + 20, y + 32, 20, "#54656f") + circle(x + 58, y + 32, 18, { fill: "#c8d0d6" }) + rect(x + 86, y + 25, 90, 12, { r: 6, fill: "#d6dbe0" }) +
    rect(x + 60, y + 100, 318, bh, { r: 8, fill: C.waSoft }) +
    lines.map(([l, link], i) => text(x + 72, y + 124 + i * 20, l, { size: 14, fill: link ? "#027eb5" : "#111b21", underline: !!link })).join("") +
    text(x + 366, y + 100 + bh - 8, "10.02", { size: 11, fill: "#667781", anchor: "end" }) +
    rect(x, y + h - 64, 390, 64, { fill: "#f0f2f5" }) + rect(x + 12, y + h - 54, 310, 42, { r: 21, fill: C.white }) + circle(x + 354, y + h - 33, 21, { fill: C.wa }) + icon("send", x + 353, y + h - 33, 18, C.white);
}

// ---- Scalev dashboard + Buku Tamu (buku-tamu.html framed over <main>: body 960 max, 24 px padding) -------------------
// Drawn in a 1112 px wide Chrome window so the content column fits a readable crop: <main> is 856 wide (< the 960 body
// max), so the body fills it and the content box is 280..1088 (808 wide). The grid and rows keep the same layout (the
// narrow-screen rule only applies under 640 px).
const WIN = 1112, BX = 280, BW2 = 808, BR = BX + BW2;
const appBase = (active = "Buku Tamu") => [chrome(0, 0, WIN, 985, { tabs: [scalevTab()], url: "app.scalev.com/pages" }), scalevApp(0, T, { active })];
// Landing Pages content (scalev-pages.png), the screen the member starts from, reflowed to the same 1112 window: the page
// keeps its 24 px side padding (280..1088) and the Folders column; the table columns share the narrower width.
function landingPages() {
  const rows = [["The Wedding of Rani & Dimas", "/rani-dimas"], ["Sinta & Bagas", "/sinta-bagas"], ["Contoh Undangan Nikahin", "/contoh"], ["Dashboard Pasangan", "/kelola"], ["Landing Paket Undangan", "/paket"]];
  const R = WIN - 24, NAME = 585, SLUG = 815, MODE = 960;
  let s = rect(256, T, WIN - 256, 900, { fill: "#f7f9fc" }) + rect(256, T, WIN - 270, 137, { fill: C.white }) + text(280, T + 35, "Landing Pages", { size: 18, weight: 700, fill: C.ink }) +
    line(280, T + 58, R, T + 58, { stroke: C.svDivider }) + rect(280, T + 78, 173, 40, { r: 4, fill: "#4497ca" }) + text(366, T + 103, "+ Create Landing Page", { size: 14, weight: 500, fill: C.white, anchor: "middle" }) +
    card(280, T + 243, R - 280, 657) + text(297, T + 275, "Folders", { size: 14, weight: 700, fill: C.ink }) + line(520, T + 243, 520, T + 900, { stroke: C.line }) +
    text(537, T + 274, "All Landing Pages", { size: 14, weight: 700, fill: C.ink }) + rect(521, T + 293, R - 521, 38, { fill: "#f7f9fc" }) +
    [["Nama Landing Page", NAME], ["Slug", SLUG], ["Mode", MODE]].map(([l, x]) => text(x, T + 317, l, { size: 12, fill: C.text })).join("");
  rows.forEach(([n, slug], i) => {
    const y = T + 331 + i * 71;
    s += line(521, y + 71, R, y + 71, { stroke: C.line }) + checkbox(538, y + 28, false) + text(NAME, y + 41, n, { size: 14, weight: 500, fill: "#2a8bc9" }) +
      text(SLUG, y + 41, slug, { size: 14, fill: "#2a8bc9" }) + rect(MODE, y + 22, 83, 28, { r: 4, fill: C.primarySoft }) + text(MODE + 41, y + 41, "HTML Mode", { size: 12, weight: 500, fill: C.action, anchor: "middle" });
  });
  return s;
}
const frameBg = () => rect(256, T, 1184, 900, { fill: "#f7f9fc" });
const frameHead = (msg) => nkLogo(BX + 16, T + 40, 32) + text(BX + 42, T + 46, "Buku Tamu", { size: 16, weight: 700, fill: C.strong }) +
  (msg ? rect(BX, T + 72, BW2, 38, { r: 4, fill: C.primarySoft }) + text(BX + 12, T + 95, msg, { size: 12, fill: C.strong }) : "") +
  text(BX, T + (msg ? 134 : 84), "rinawo@gmail.com", { size: 12, weight: 700, fill: C.faint }) + text(BR, T + (msg ? 134 : 84), "Keluar", { size: 12, weight: 500, fill: C.strong, anchor: "end", underline: true });
const LIST = [
  ["The Wedding of Rani & Dimas", WID, true, "Ucapan 52 (tampil 50) · Hadir 86 orang · Tidak 9 · Ragu 4", true],
  ["Sinta & Bagas", "365702", false, "Ucapan 0 (tampil 0) · Hadir 0 orang · Tidak 0 · Ragu 0"],
  ["Contoh Undangan Nikahin", "364833", true, "Ucapan 3 (tampil 3) · Hadir 5 orang · Tidak 1 · Ragu 0"]
];
const listShell = () => frameBg() + frameHead() + rect(BX + 0.5, T + 100.5, BW2 - 1, 37, { r: 4, fill: C.white, stroke: C.field }) +
  text(BX + 11, T + 124, "Cari nama atau ID undangan", { size: 14, fill: C.faint });
function listCard(i) {
  const [n, id, pub, sum, fresh] = LIST[i], y = T + 150 + i * 86;
  const tail = ` /${id} · ${pub ? "Terbit" : "Belum terbit"}`;
  return card(BX, y, BW2, 74) + rich(BX + 17, y + 31, [[n, 700], [tail]]) +
    (fresh ? badge(BX + 17 + tw(n, 14, 500) + tw(tail, 14) + 6, y + 17, "Ada yang baru", true).svg : "") + text(BX + 17, y + 51, sum, { size: 14, fill: C.text });
}
const listFoot = () => text(BX, T + 424, "Menampilkan 1–3 dari 3", { size: 12, fill: C.faint });

// Detail view. o: { tab, hidden, picked, staff: closed|open|form|code, invites: base|preview|done, msg }.
const COMMENTS = [
  ["Andi Pratama", "14 Okt 2026, 10.21", "Selamat menempuh hidup baru, semoga sakinah, mawaddah, warahmah!", true],
  ["Tante Lia", "13 Okt 2026, 19.02", "Barakallah, lancar sampai hari-H ya, Rani dan Dimas.", true],
  ["Dewi Lestari", "12 Okt 2026, 08.45", "Ikut bahagia! Semoga jadi keluarga yang penuh berkah."],
  ["Keluarga Hendra", "11 Okt 2026, 21.10", "Selamat ya, semoga lancar acaranya. Kami usahakan hadir."],
  ["Rizky", "10 Okt 2026, 16.30", "Congrats bro! Akhirnya."]
];
const INVITES = [
  ["Andi Pratama", "Teman", "2 orang · Dibuka 3× · terakhir 13 Okt 2026, 08.15 · Sudah RSVP: Hadir"],
  ["Tante Lia", "Keluarga", "4 orang · Dibuka 1× · terakhir 12 Okt 2026, 19.40 · Sudah RSVP: Hadir"],
  ["Keluarga Hendra", "Keluarga", "3 orang · Tautan belum pernah dibuka · Belum RSVP", true],
  ["Dewi Lestari", "Kantor", "1 orang · Dibuka 2× · terakhir 11 Okt 2026, 12.05 · Belum RSVP"],
  ["Pak Harun", "Tetangga", "2 orang · Tautan belum pernah dibuka · Belum RSVP", true]
];
const NEW_GUESTS = [
  ["Budi Santoso", "Keluarga", "2 orang · Tautan belum pernah dibuka · Belum RSVP", true],
  ["Siti Aminah", "Kantor", "1 orang · Tautan belum pernah dibuka · Belum RSVP", true],
  ["Pak RT Joko", "Tetangga", "1 orang · Tautan belum pernah dibuka · Belum RSVP", true]
];
const CSV_LABEL = "Unduh daftar tamu (CSV)", CSV_W = bw(CSV_LABEL);
function detail(o = {}) {
  const tab = o.tab ?? "comments", shift = o.msg ? 50 : 0;
  let s = frameBg() + frameHead(o.msg), y = T + 100 + shift;
  s += text(BX, y + 15, "← Daftar undangan", { size: 14, weight: 500, fill: C.strong, underline: true });
  y += 32;
  s += text(BX, y + 18, "The Wedding of Rani & Dimas", { size: 16, weight: 700, fill: C.strong });
  y += 36;
  s += card(BX, y, BW2, 104) + rich(BX + 17, y + 33, [["Hadir 86 orang", 700], [" (41 RSVP) · Tidak 9 · Ragu 4"]]) +
    text(BX + 17, y + 57, "Per sesi: Akad 30 · Resepsi 56", { size: 14, fill: C.text }) + text(BX + 17, y + 81, "Per pihak: Pihak Rani 48 · Pihak Dimas 38", { size: 14, fill: C.text });
  y += 116;
  // Staff penerima tamu (details)
  const st = o.staff ?? "closed", tri = (x, yy, open) => `<path d="${open ? `M${x} ${yy - 3} h9 l-4.5 6 z` : `M${x + 1} ${yy - 5} v10 l6 -5 z`}" fill="${C.strong}"/>`;
  if (st === "closed") {
    s += card(BX, y, BW2, 52) + tri(BX + 17, y + 26, false) + text(BX + 32, y + 31, "Staff penerima tamu", { size: 14, weight: 700, fill: C.strong });
    y += 64;
  } else {
    const body = staffBody(BX + 17, y + 40, st), h = 40 + body.h + 16;
    s += card(BX, y, BW2, h) + tri(BX + 17, y + 26, true) + text(BX + 32, y + 31, "Staff penerima tamu", { size: 14, weight: 700, fill: C.strong }) + body.svg;
    y += h + 12;
  }
  // tools
  const selW = tab === "invites" ? 213 : 235, inW = BW2 - CSV_W - selW - 16;
  s += rect(BX + 0.5, y + 0.5, inW - 1, 37, { r: 4, fill: C.white, stroke: C.field }) + text(BX + 11, y + 24, "Cari nama atau isi ucapan", { size: 14, fill: C.faint }) +
    selectBox(BX + inW + 8, y, selW, "Semua", { h: 38 }) + btn(BR - CSV_W, y + 1, CSV_LABEL, { w: CSV_W });
  y += 50;
  if (o.picked) {
    let bx = BX + 13;
    s += rect(BX + 0.5, y + 0.5, BW2 - 1, 53, { r: 8, fill: C.primarySoft, stroke: C.primary }) + text(bx, y + 32, "1 dipilih", { size: 14, weight: 700, fill: C.text });
    bx += tw("1 dipilih", 14, 700) + 16;
    for (const [l, d] of [["Sembunyikan"], ["Tampilkan"], ["Balas"], ["Unduh CSV terpilih"], ["Hapus", 1]]) { s += btn(bx, y + 9, l, { danger: d }); bx += bw(l) + 8; }
    s += text(bx, y + 32, "Batal pilih", { size: 14, weight: 500, fill: C.strong, underline: true });
    y += 66;
  }
  // tabs
  const tabs = [["comments", "Ucapan (52)"], ["rsvp", "RSVP (54)"], ["invites", `Tautan personal (${o.invites === "done" ? 33 : 30})`]];
  let tx = BX;
  s += line(BX, y + 36.5, BR, y + 36.5, { stroke: C.line });
  for (const [k, l] of tabs) {
    const on = k === tab, w = tw(l, 14, on ? 700 : 400) + 28;
    if (on) s += `<path d="M${tx + 0.5} ${y + 37} V${y + 8} a7.5 7.5 0 0 1 7.5 -7.5 H${tx + w - 8} a7.5 7.5 0 0 1 7.5 7.5 V${y + 37}" fill="#fff" stroke="${C.line}"/>`;
    s += text(tx + 14, y + 23, l, { size: 14, weight: on ? 700 : 400, fill: on ? C.strong : C.text });
    tx += w + 4;
  }
  y += 36;
  s += `<path d="M${BX + 0.5} ${y} V${T + 900}" stroke="${C.line}"/><path d="M${BR - 0.5} ${y} V${T + 900}" stroke="${C.line}"/>` + rect(BX + 1, y + 1, BW2 - 2, T + 900 - y, { fill: C.white });
  return s + (tab === "invites" ? invitesCard(y, o) : commentsCard(y, o));
}
// Ucapan tab card: "Pilih semua" row, then entries (name + badges, date, message; actions on the right).
function commentsCard(y, o) {
  let s = checkbox(BX + 17, y + 18, false) + text(BX + 39, y + 31, "Pilih semua di halaman ini", { size: 12, fill: C.faint }) + line(BX + 17, y + 44.5, BR - 17, y + 44.5, { stroke: C.line });
  y += 48;
  COMMENTS.forEach(([n, when, msg, fresh], i) => {
    const hid = i === 0 && o.hidden;
    s += checkbox(BX + 17, y + 14, i === 1 && o.picked) + text(BX + 45, y + 27, n, { size: 14, weight: 700, fill: C.text });
    let bx = BX + 45 + tw(n, 14, 500) + 6;
    if (fresh) { const b = badge(bx, y + 14, "Baru", true); s += b.svg; bx += b.w + 6; }
    if (hid) s += badge(bx, y + 14, "Disembunyikan").svg;
    s += text(BX + 17, y + 51, when, { size: 12, fill: C.faint }) + text(BX + 17, y + 75, msg, { size: 14, fill: C.text });
    const acts = [["Balas"], ["Ubah teks"], [hid ? "Tampilkan" : "Sembunyikan"], ["Hapus", 1]];
    let ax = BR - 17 - acts.reduce((t, [l]) => t + bw(l, 12, 28) + 4, -4);
    for (const [l, d] of acts) { s += btn(ax, y + 10, l, { size: 12, h: 28, danger: d }); ax += bw(l, 12, 28) + 4; }
    if (i < COMMENTS.length - 1) s += line(BX + 17, y + 92.5, BR - 17, y + 92.5, { stroke: C.line });
    y += 93;
  });
  return s;
}
const ACT_X = (i) => { const acts = ["Balas", "Ubah teks", "Sembunyikan", "Hapus"]; let ax = BR - 17 - acts.reduce((t, l) => t + bw(l, 12, 28) + 4, -4); for (let k = 0; k < i; k++) ax += bw(acts[k], 12, 28) + 4; return ax + bw(acts[i], 12, 28) / 2; };
// Tautan personal tab card: summary, import row, optional preview, reminder tools, rows.
function invitesCard(y, o) {
  const done = o.invites === "done", total = done ? 33 : 30;
  let s = nkHint(BX + 17, y + 32, `Dibuka 12 dari ${total} tautan personal.`);
  y += 36;
  s += btn(BX + 17, y, "Impor daftar tamu (CSV)") + nkHint(BX + 17 + bw("Impor daftar tamu (CSV)") + 8, y + 23, "Kolom: nama, whatsapp, kategori, pax");
  y += 44;
  if (o.invites === "preview") {
    s += rect(BX + 17.5, y + 0.5, BW2 - 35, 259, { r: 8, fill: C.mutedBg, stroke: C.line }) +
      text(BX + 30, y + 27, "3 tamu siap diimpor, 1 baris dilewati.", { size: 14, weight: 700, fill: C.text }) +
      ["Budi Santoso · Keluarga · 2 orang · 081234567890", "Siti Aminah · Kantor · 1 orang · 6285711112222", "Pak RT Joko · Tetangga · 1 orang"]
        .map((l, i) => text(BX + 30, y + 65 + i * 20, l, { size: 14, fill: C.text })).join("") +
      text(BX + 30, y + 143, "Baris yang dilewati:", { size: 14, fill: C.text }) +
      text(BX + 30, y + 165, "Baris 5: nomor WhatsApp tidak sah", { size: 12, fill: C.faint }) +
      nkHint(BX + 30, y + 198, "Nama yang sudah ada diperbarui kategori, pax, dan nomornya; tautannya tetap sama.") +
      btn(BX + 30, y + 212, "Impor 3 tamu", { variant: "primary" }) + btn(BX + 30 + bw("Impor 3 tamu") + 8, y + 212, "Batal");
    y += 268;
  }
  const ready = done ? 21 : 18, l1 = `Salin pengingat untuk ${ready} tamu di daftar ini yang belum RSVP`;
  s += btn(BX + 17, y, l1) + btn(BX + 17 + bw(l1) + 8, y, "Ubah pesan pengingat");
  y += 44;
  const rows = done ? [...NEW_GUESTS, ...INVITES] : INVITES;
  rows.forEach(([n, cat, meta, unopened], i) => {
    s += text(BX + 17, y + 27, n, { size: 14, weight: 700, fill: C.text });
    let bx = BX + 17 + tw(n, 14, 500) + 6;
    const b = badge(bx, y + 14, cat); s += b.svg; bx += b.w + 6;
    if (unopened) s += badge(bx, y + 14, "Belum dibuka").svg;
    s += text(BX + 17, y + 51, meta, { size: 12, fill: C.faint });
    const a1 = "Kirim pengingat", a2 = "Salin pesan", ax = BR - 17 - bw(a1, 12, 28) - 4 - bw(a2, 12, 28);
    s += btn(ax, y + 10, a1, { size: 12, h: 28 }) + btn(ax + bw(a1, 12, 28) + 4, y + 10, a2, { size: 12, h: 28 }) + line(BX + 17, y + 68.5, BR - 17, y + 68.5, { stroke: C.line });
    y += 69;
  });
  return s;
}
// Staff penerima tamu body (x, y = top-left of the body inside the open details card). Returns { svg, h }.
const STAFF_HINT = "Staff masuk ke halaman check-in dengan kode pribadinya, tanpa PIN dashboard. Kode hanya bisa dipakai untuk check-in tamu.";
function staffBody(x, y, st) {
  const w = BW2 - 34;
  let s = nkHint(x, y + 12, STAFF_HINT), h = 16;
  if (st === "code") {
    s += rect(x + 0.5, y + 24.5, w - 1, 119, { r: 8, fill: C.mutedBg, stroke: C.line }) +
      rich(x + 13, y + 51, [["Kode untuk Rina: "], ["K7PM3QXA", 700]]) +
      nkHint(x + 13, y + 82, "Kode hanya tampil sekali. Kirim sekarang; kalau hilang, cabut lalu buat kode baru.");
    let bx = x + 13;
    for (const l of ["Salin kode", "Kirim lewat WA", "Salin pesan"]) { s += btn(bx, y + 96, l); bx += bw(l) + 8; }
    h = 144;
    s += text(x, h + y + 26, "Rina", { size: 14, weight: 700, fill: C.text }) + text(x, y + h + 48, "Dibuat 14 Okt 2026, 09.12", { size: 12, fill: C.faint }) +
      btn(x + w - bw("Cabut", 12, 28), y + h + 10, "Cabut", { size: 12, h: 28, danger: true });
    h += 72;
  } else {
    s += nkHint(x, y + 32, "Belum ada staff."); h = 36;
  }
  s += btn(x, y + h, "+ Tambah staff");
  h += 36;
  if (st === "form") {
    s += rect(x + 0.5, y + h + 8.5, w - 1, 123, { r: 8, fill: C.mutedBg, stroke: C.line }) + text(x + 13, y + h + 35, "Nama staff", { size: 12, fill: C.strong }) +
      rect(x + 13, y + h + 44, w - 26, 38, { r: 4, fill: C.white, stroke: C.primary, sw: 2 }) +
      btn(x + 13, y + h + 92, "Buat kode", { variant: "primary" }) + btn(x + 13 + bw("Buat kode") + 8, y + h + 92, "Batal");
    h += 132;
  }
  return { svg: s, h };
}
// Detail geometry used for pointer targets.
const DY = { staff: T + 284, tools: T + 348, tabs: T + 398, items: T + 482 };

// Dashboard gate and Hari-H on a plain phone screen (dash-gate-hp.png, dash-hari-h-hp.png), cropped to PH tall.
// GY = top of the gate layout as measured on the full 844 px screen, shifted so the card stays centred.
const PX = BX + BW2 / 2 - 195, PY = 98, PH = 744, GY = PY + PH / 2 - 422;
function phoneGate() {
  const x = PX, y = GY;
  return shadow(x, PY, 390, PH, 0, 3) + rect(x, PY, 390, PH, { fill: C.waWash }) + rect(x + 16, y + 249, 358, 304, { r: 24, fill: C.white }) +
    text(x + 195, y + 297, "Kelola undangan", { size: 22, fill: C.waText, anchor: "middle" }) +
    para(x + 195, y + 325, ["Kirim undangan, lihat RSVP dan ucapan, dan catat", "tamu di hari-H. Semuanya dari sini."], { size: 14, fill: C.waSub, anchor: "middle", lh: 20 }) +
    text(x + 36, y + 388, "PIN atau kode staff", { size: 14, fill: C.waSub }) + rect(x + 36.5, y + 397.5, 317, 43, { r: 8, fill: C.white, stroke: "#9e9e9e" }) +
    icon("lock", x + 72, y + 586, 13, C.waSub) + text(x + 84, y + 591, "PIN hanya diingat selama tab ini terbuka.", { size: 13, fill: C.waSub });
}
const masukBtn = () => rect(PX + 36, GY + 457, 318, 40, { r: 20, fill: "#51a868" }) + text(PX + 195, GY + 483, "Masuk", { size: 16, weight: 700, fill: C.white, anchor: "middle" });
function phoneHariH() {
  const x = PX, y = PY, b = PY + PH;
  return rect(x, y, 390, PH, { fill: "#f2efea" }) + rect(x, y, 390, 64, { fill: C.white }) + text(x + 16, y + 29, "Scan tamu", { size: 16, fill: C.waText }) +
    text(x + 16, y + 48, `/${PAGE}`, { size: 13, fill: C.waSub }) + line(x, y + 64, x + 390, y + 64, { stroke: C.waLine }) +
    rect(x + 16, y + 80, 358, 40, { r: 20, fill: "#51a868" }) + text(x + 195, y + 106, "Buka kamera", { size: 15, weight: 700, fill: C.white, anchor: "middle" }) +
    text(x + 20, y + 145, "Atau tempel link tamu", { size: 13, fill: C.waSub }) + rect(x + 16, y + 155, 358, 52, { r: 26, fill: C.white }) +
    text(x + 36, y + 187, "https://…?to=Nama&u=KODE", { size: 16, fill: "#8a8a8a" }) + circle(x + 348, y + 181, 20, { fill: "#51a868" }) + icon("send", x + 347, y + 181, 18, C.white) +
    rect(x, b - 70, 390, 70, { fill: C.white }) + line(x, b - 70, x + 390, b - 70, { stroke: C.waLine }) +
    rect(x + 66, b - 60, 64, 32, { r: 16, fill: C.waSoft }) + icon("calendar-check", x + 98, b - 44, 18, C.waText) + text(x + 98, b - 11, "Hari-H", { size: 12, fill: C.waText, anchor: "middle" }) +
    circle(x + 292, b - 36, 16, { fill: C.waSoft }) + text(x + 292, b - 32, "RD", { size: 11, fill: C.waStrong, anchor: "middle" });
}

// Bagikan dialog with its content scrolled up by dy (the panel below the dialog head scrolls; the head stays).
const shareAll = (o) => [shareTop(-50), shareBtns.lihat(-50), shareBtns.salin(-50), shareBtns.umum(-50), accessHead(T + lowerY - 50, true), accessOn(T + 583, o.mode, o.devices)].join("");
const shareScrolled = (dy, o) => rect(0, T + 154, 399, 746, { fill: C.white }) + clipped(0, T + 154, 399, 746, `<g transform="translate(0 ${-dy})">${shareAll(o)}</g>`) +
  rect(0, T + 92, 399, 61, { fill: C.white }) + text(16, T + 128, "Bagikan", { size: 16, weight: 700, fill: C.strong }) + iconX("x", 368, T + 122, 18, C.text) + line(0, T + 153, 399, T + 153, { stroke: C.line });
// Native select popup under a select box (x, y = top-left of the list).
function selectMenu(x, y, w, items, pick) {
  let s = shadow(x, y, w, items.length * 26 + 8, 6, 3) + rect(x, y, w, items.length * 26 + 8, { r: 6, fill: C.white });
  items.forEach((l, i) => {
    const iy = y + 4 + i * 26;
    if (i === pick) s += rect(x + 4, iy, w - 8, 26, { r: 4, fill: C.crBlue });
    if (i === 0) s += `<path d="M${x + 10} ${iy + 13} l3 3 l6 -7" fill="none" stroke="${i === pick ? C.white : C.crText}" stroke-width="1.8" stroke-linecap="round"/>`;
    s += text(x + 26, iy + 18, l, { size: 13, fill: i === pick ? C.white : C.crText });
  });
  return s;
}
const TAB_W = [["Ucapan (52)", 700], ["RSVP (54)", 400], ["Tautan personal (30)", 400]].reduce((t, [l, w]) => t + tw(l, 14, w) + 32, -4);
const SEL_X = BX + (BW2 - CSV_W - 235 - 16) + 8;
const listEls = (d) => ({ list: { svg: listShell(), enter: "fade", delay: d }, card0: { svg: listCard(0), delay: d + 0.1 }, card1: { svg: listCard(1), delay: d + 0.16 }, card2: { svg: listCard(2), delay: d + 0.22 }, foot: { svg: listFoot(), enter: "fade", delay: d + 0.3 } });
const CARD0 = [760, T + 186];

// Generic spreadsheet (no app branding) with the importer's header row (buku-tamu.js CSV_HEAD: nama, whatsapp,
// kategori, pax). Rows match the import preview: row 5 has an invalid WhatsApp number.
const SHEET = [["nama", "whatsapp", "kategori", "pax"], ["Budi Santoso", "081234567890", "Keluarga", "2"], ["Siti Aminah", "6285711112222", "Kantor", "1"],
  ["Pak RT Joko", "", "Tetangga", "1"], ["Rudi", "12345", "Teman", "1"]];
const SC_X = [20, 60, 220, 370, 480, 540], SH_Y = 72, ROW = 30; // column edges (row numbers, A..D); first row top
function sheet() {
  let s = rect(0, 0, 600, 380, { fill: C.white }) + rect(0, 0, 600, 44, { fill: "#f1f3f4" }) + iconX("file-text", 30, 22, 20, C.wa) + text(48, 27, "Daftar tamu", { size: 14, fill: C.crText }) +
    rect(20, 44, 520, 28, { fill: "#f8f9fa" });
  "ABCD".split("").forEach((l, i) => (s += text((SC_X[i + 1] + SC_X[i + 2]) / 2, 63, l, { size: 12, fill: C.crSub, anchor: "middle" })));
  for (let r = 0; r < 8; r++) {
    const y = SH_Y + r * ROW;
    s += rect(20, y, 40, ROW, { fill: "#f8f9fa" }) + text(40, y + 20, String(r + 1), { size: 12, fill: C.crSub, anchor: "middle" }) + line(20, y + ROW + 0.5, 540, y + ROW + 0.5, { stroke: "#e2e3e3" });
    (SHEET[r] ?? []).forEach((v, c) => (s += text(SC_X[c + 1] + 8, y + 20, v, { size: 13, fill: C.crText })));
  }
  SC_X.forEach((x) => (s += line(x + 0.5, 44, x + 0.5, SH_Y + 8 * ROW, { stroke: "#e2e3e3" })));
  return s;
}
const saveDlg = shadow(140, 120, 340, 196, 10, 3) + rect(140, 120, 340, 196, { r: 10, fill: C.white }) + text(160, 152, "Simpan sebagai", { size: 15, weight: 500, fill: C.crText }) +
  text(160, 182, "Nama file", { size: 12, fill: C.crSub }) + rect(160.5, 190.5, 299, 31, { r: 4, fill: C.white, stroke: C.crBlue, sw: 1.5 }) + text(170, 211, "daftar-tamu.csv", { size: 13, fill: C.crText }) +
  text(160, 242, "Format", { size: 12, fill: C.crSub }) + rect(160.5, 250.5, 299, 31, { r: 4, fill: C.white, stroke: "#c4c7c5" }) + text(170, 271, "CSV (.csv)", { size: 13, fill: C.crText }) + icon("chevron-down", 444, 266, 14, C.crSub) +
  rect(392, 290, 72, 18, { r: 9, fill: C.crBlue }) + text(428, 303, "Simpan", { size: 12, weight: 500, fill: C.white, anchor: "middle" });

// Konten > RSVP & Ucapan opened, as a column (fields.js order; sample values as in 03-editor-konten).
const RSVP_Y = T + 401, RI = 101, RW = 253;
function rsvpOpen() {
  let y = RSVP_Y + 54, s = "";
  const field = (l, v, o = {}) => { s += nkLabel(RI, y + 12, l) + rect(RI + 0.5, y + 20.5, RW - 1, (o.h ?? 36) - 1, { r: 4, fill: C.white, stroke: C.field }) +
      (o.lines ? para(RI + 11, y + 42, o.lines, { size: 14, fill: C.faint, lh: 17 }) : text(RI + 11, y + 43, v, { size: 14, fill: o.ph ? C.faint : C.strong })) + (o.select ? icon("chevron-down", RI + RW - 16, y + 38, 16, C.text) : "") + (o.icon ? icon(o.icon, RI + RW - 20, y + 38, 16, C.strong) : "");
    y += 20 + (o.h ?? 36); if (o.hint) { s += para(RI, y + 20, o.hint, { size: 12, fill: C.faint, lh: 16 }); y += 8 + o.hint.length * 16; } y += 12; };
  const toggle = (l, on, hint) => { const ls = [].concat(l); s += para(RI, y + 25 - (ls.length - 1) * 10, ls, { size: 14, fill: C.text, lh: 20 }) + nkSwitch(RI + RW - 36, y + 10, on); y += 48;
    if (hint) { s += para(RI, y + 6, hint, { size: 12, fill: C.faint, lh: 16 }); y += -6 + hint.length * 16 + 12; } };
  field("Judul", "Ucapan & Kehadiran", { ph: true });
  field("Keterangan", "", { lines: ["mis. Konfirmasi kehadiran dan", "titipkan doa."], h: 48 });
  s += rect(RI, y, RW, 38, { r: 4, fill: C.okSoft }) + rich(RI + 12, y + 24, [["Tersambung. ID: "], [WID, 700]], { size: 12, fill: C.ok }); y += 50;
  field("Isi form", "Ucapan + konfirmasi hadir", { select: true });
  field("Jumlah tamu paling banyak per undangan", "2 orang", { select: true });
  field("Tenggat konfirmasi (opsional)", "07/02/2027, 23.59", { icon: "calendar", hint: ["Setelah lewat, form ditutup; daftar ucapan", "tetap tampil."] });
  toggle("Tampilkan jumlah kehadiran", true, ["Mis. \"120 konfirmasi hadir\" di atas daftar", "ucapan."]);
  toggle("Pilihan \"Masih ragu\"", false, ["Mati: tamu hanya memilih Hadir atau Tidak", "hadir."]);
  y += 12; s += nkH3(RI, y + 12, "Tanyakan juga"); y += 24;
  toggle("Tamu dari pihak mana", true); toggle("Acara yang dihadiri", true, ["Butuh minimal 2 acara."]); toggle("Perkiraan jam datang", true);
  toggle("Minta nomor WhatsApp tamu", true, ["Tamu mengisi nomornya sendiri di form (boleh", "kosong). Nomor tampil di Dashboard."]);
  s += nkHint(RI, y + 12, "Jawaban tampil di Dashboard."); y += 28;
  const qr = y;
  toggle(["Tampilkan QR masuk untuk tamu", "undangan khusus"], false, ["Hanya berlaku bila Undangan khusus", "menyala (di Bagikan). Tamu yang", "menjawab Hadir melihat QR ini di kartu", "terima kasih RSVP; penerima tamu", "memindainya di halaman Check-in."]);
  const end = y + 8, h = end - RSVP_Y;
  const svg = rect(72, RSVP_Y - 8, 327, h + 600, { fill: C.white }) + nkAcc(88, RSVP_Y, 279, "RSVP & Ucapan", { open: true, badge: "Terisi" }).replace(/height="49"/, `height="${h - 1}"`) +
    line(89, RSVP_Y + 50.5, 366, RSVP_Y + 50.5, { stroke: C.line }) + s +
    ["Siaran Langsung", "Filter Kamera", "Amplop Digital"].map((t, i) => nkAcc(88, end + 8 + i * 58, 279, t, { badge: "Terisi" })).join("");
  return { svg, qr, end };
}
const RS = rsvpOpen(), RS_DY = T + 820 - RS.end; // scroll so the QR hint ends near the panel bottom
const kontenList = () => rect(72, T + 153, 327, 747, { fill: C.white }) +
  ["Galeri Foto", "Video", "Dress Code", "Susunan Acara", "RSVP & Ucapan", "Siaran Langsung", "Filter Kamera", "Amplop Digital", "Aturan Tamu", "Turut Mengundang", "Salam Penutup", "Kaki Halaman"]
    .map((t, i) => nkAcc(88, T + 169 + i * 58, 279, t, { badge: "Terisi" })).join("");

// ---- Scenes ---------------------------------------------------------------------------------------------------------
// Crops: the Bagikan panel (rail + panel, 400 wide), the PIN window, and the Buku Tamu content column (832 wide); each
// keeps 12 px text >= 10.5 px at the docs' 780 px image width. A flow that leaves its crop continues in a second scene.
const lowerY = 523; // Undangan khusus H3 in the Bagikan dialog (with the unsaved note)
const CF = WIN / 2 - 225; // Chrome confirm dialog (450 wide, top centre of the window)
const PANEL = { x: 0, y: T, w: 400, h: 900 }, CONTENT = (y) => ({ x: BX - 12, y, w: BW2 + 24, h: 760 });
const sharePanel = (accessOn) => [shareTop(-50), shareBtns.lihat(-50), shareBtns.salin(-50), shareBtns.umum(-50), accessHead(T + lowerY - 50, accessOn)];
const simpanBtn = rect(1193, T + 50, 82, 34, { r: 4, fill: C.white, stroke: C.svBtnLine, sw: 2 }) + text(1201, T + 72, "Simpan", { size: 13, weight: 500, fill: C.strong }) + iconX("file-text", 1258, T + 67, 15, C.strong);
const PK = BX + BW2 / 2 - 720; // file picker (720 wide at PK + 360), centred on the Buku Tamu content
const picker = shadow(PK + 360, 180, 720, 440, 10, 4) + rect(PK + 360, 180, 720, 440, { r: 10, fill: C.white }) + rect(PK + 360, 180, 180, 440, { r: 10, fill: "#f2f2f4" }) + rect(PK + 530, 180, 10, 440, { fill: "#f2f2f4" }) +
  [0, 1, 2, 3, 4].map((k) => rect(PK + 380, 222 + k * 30, [96, 120, 80, 110, 90][k], 10, { r: 5, fill: "#dcdce0" })).join("") +
  rect(PK + 560, 196, 220, 22, { r: 6, fill: "#ececef" }) + line(PK + 540, 232, PK + 1080, 232, { stroke: "#e3e3e3" }) +
  rect(PK + 552, 244, 516, 30, { r: 5, fill: "#dbe7fb" }) + iconX("file-text", PK + 574, 259, 18, C.crBlue) + text(PK + 592, 264, "daftar-tamu.csv", { size: 13, fill: C.crText }) +
  iconX("file-text", PK + 574, 291, 18, "#b8b8bc") + text(PK + 592, 296, "catatan.txt", { size: 13, fill: "#a7a7ab" }) +
  iconX("image", PK + 574, 323, 18, "#b8b8bc") + text(PK + 592, 328, "foto-prewed.jpg", { size: 13, fill: "#a7a7ab" });
const copiedBar = (msg) => rect(516, MSG_Y, 408, 38, { r: 4, fill: C.primarySoft }) + text(528, MSG_Y + 23, msg, { size: 12, fill: C.strong });

export const scenes = {
  "tamu-bagikan": {
    title: "Membagikan undangan dari panel Bagikan",
    world: PANEL,
    base: editorBase(),
    els: {
      dlg: { svg: shareTop(0, { focus: true }), enter: "fade" },
      lihat: { svg: shareBtns.lihat(0), enter: "fade" },
      salin: { svg: shareBtns.salin(0), enter: "fade" },
      umum: { svg: shareBtns.umum(0), enter: "fade" },
      low: { svg: accessHead(T + lowerY + 16, false) + forCouple(T + 657) + pinBtn(T + 657) + pinHint(T + 657), enter: "fade" },
      ringNote: { svg: ring(16, T + 169, 366, 38, { r: 6 }), enter: "fade", delay: 0.3 },
      nameClear: { svg: rect(18, T + 241, 362, 32, { fill: C.white }), enter: "fade" },
      nameTyped: text(27, T + 262, "Budi Santoso", { size: 14, fill: C.strong }),
      urlNew: { svg: urlBox(T + 311, [`${PUBLIC}?`, "to=Budi+Santoso"]), enter: "fade", delay: 1.4 },
      guest: { svg: guestTab(), enter: "fade" },
      copied: { svg: nkHint(16, T + 515, "Tersalin."), enter: "fade" },
      copied2: { svg: nkHint(16, T + 515, "Tersalin."), enter: "fade", delay: 0.1 },
      ringCouple: { svg: ring(16, T + 681, 366, 104), enter: "fade", delay: 0.3 }
    },
    steps: [
      { caption: "Di editor NikahKit, klik Bagikan di bawah rel kiri. Panel Bagikan terbuka.", at: BAGIKAN, click: true, show: ["dlg", "lihat", "salin", "umum", "low"] },
      { caption: "Ada Perubahan belum disimpan di Scalev? Klik Simpan di Scalev dulu.", show: ["ringNote"], dur: 3.2 },
      { caption: "Kolom Nama tamu berisi Nama Tamu. Ganti dengan nama tamumu.", hide: ["ringNote"], at: [300, T + 257], click: true, show: ["nameClear", "nameTyped", "urlNew"], type: [{ id: "nameTyped", n: 12, box: [27, T + 246, tw("Budi Santoso", 14) + 4, 22] }], dur: 3.8 },
      { caption: "Klik Lihat sebagai tamu. Di tab baru, nama tamu tampil di sampul.", at: [199, T + 393], click: true, press: "lihat", show: ["guest"], dur: 4 },
      { caption: "Kembali ke editor. Klik Salin tautan tamu, muncul Tersalin.", hide: ["guest"], at: [199, T + 437], click: true, press: "salin", show: ["copied"], dur: 3.4 },
      { caption: "Butuh tautan tanpa nama tamu? Klik Salin tautan umum.", hide: ["copied"], at: [199, T + 481], click: true, press: "umum", show: ["copied2"], dur: 3.2 },
      { caption: "Di bawah ada Untuk pengantin: Kirim undangan dan Buka Dashboard.", at: [330, T + 741], show: ["ringCouple"], dur: 3.6 }
    ]
  },

  "tamu-undangan-khusus": {
    title: "Menyalakan Undangan khusus",
    world: PANEL,
    base: [...editorBase(), ...sharePanel(false), forCouple(T + 591) + pinBtn(T + 591) + pinHint(T + 591)],
    els: {
      ringSec: { svg: ring(16, T + 473, 366, 98), enter: "fade", delay: 0.3 },
      swOn: { svg: nkSwitch(346, T + 507, true), enter: "fade" },
      accLink: { svg: accessOn(T + 583, "link"), enter: "rise", delay: 0.1 },
      menu: { svg: selectMenu(18, T + 607, 300, ["Tautan pribadi", "+ Kunci perangkat", "+ PIN untuk HP baru"], 1), enter: "pop", origin: [200, T + 621] },
      accDevice: { svg: accessOn(T + 583, "device", 1), enter: "fade" },
      menu2: { svg: selectMenu(18, T + 703, 120, ["1", "2", "3", "4", "5"], 1), enter: "pop", origin: [80, T + 701] },
      accDevice2: { svg: accessOn(T + 583, "device", 2), enter: "fade" }
    },
    steps: [
      { caption: "Di panel Bagikan, gulir ke bagian Undangan khusus.", show: ["ringSec"], dur: 3 },
      { caption: "Klik sakelar Undangan khusus sampai menyala. Keamanan muncul.", hide: ["ringSec"], at: [364, T + 517], click: true, show: ["swOn", "accLink"], dur: 3.6 },
      { caption: "Klik kotak Keamanan. Ada tiga mode.", at: [199, T + 621], click: true, show: ["menu"], dur: 3.2 },
      { caption: "Pilih + Kunci perangkat. Muncul Perangkat per tamu.", at: [120, T + 650], click: true, hide: ["menu"], show: ["accDevice"], dur: 3.4 },
      { caption: "Klik Perangkat per tamu. Pilihannya 1 sampai 10.", at: [199, T + 681], click: true, show: ["menu2"], dur: 3 },
      { caption: "Pilih 2.", at: [60, T + 746], click: true, hide: ["menu2"], show: ["accDevice2"], dur: 2.4 }
    ]
  },

  "tamu-undangan-khusus-qr": {
    title: "Menyalakan QR masuk untuk tamu undangan khusus",
    world: PANEL,
    base: [...editorBase(), kontenList()],
    els: {
      open: { svg: RS.svg, enter: "fade" },
      lid: clipped(72, T, 327, 153, scalevEditor(0, T, { rail: "Konten" }) + nkHead(0, T, "Konten", { account: "Tahunan" })),
      ringQr: { svg: ring(RI, RS.qr + RS_DY, RW, RS.end - 8 - RS.qr, { r: 6 }), enter: "fade", delay: 1.8 },
      qrOn: { svg: nkSwitch(RI + RW - 36, RS.qr + 10 + RS_DY, true), enter: "fade" }
    },
    steps: [
      { caption: "Opsional, untuk check-in di lokasi: di Konten, klik RSVP & Ucapan.", at: [190, RSVP_Y + 25], click: true, show: ["open"] },
      { caption: "Gulir ke bawah sampai Tampilkan QR masuk untuk tamu undangan khusus.", scroll: { id: "open", dy: -RS_DY }, show: ["ringQr"], dur: 3.8 },
      { caption: "Nyalakan sakelarnya. Tamu yang menjawab Hadir mendapat Kode masuk berupa QR.", hide: ["ringQr"], at: [RI + RW - 18, RS.qr + 20 + RS_DY], click: true, show: ["qrOn"], dur: 4 }
    ]
  },

  "tamu-undangan-khusus-simpan": {
    title: "Menyimpan pengaturan di editor Scalev",
    world: { x: 840, y: T + 44, w: 600, h: 136 },
    base: [...editorBase(), ...sharePanel(true), accessOn(T + 583, "device", 2)],
    els: { simpan: simpanBtn },
    steps: [{ caption: "Klik Simpan di editor Scalev supaya pengaturan berlaku.", at: [1234, T + 67], click: true, press: "simpan", dur: 3 }]
  },

  "tamu-undangan-khusus-uji": {
    title: "Membuat tautan tamu dan menguji undangan khusus",
    world: PANEL,
    base: [...editorBase(), shareScrolled(200, { mode: "device", devices: 2 })],
    els: {
      ringKirim: { svg: ring(16, 776, 366, 36, { r: 6 }), enter: "fade", delay: 0.4 },
      gate: { svg: gateTab(), enter: "fade", delay: 0.2 }
    },
    steps: [
      { caption: "Di Untuk pengantin, klik Kirim undangan. Buat tautan per tamu di Dashboard.", show: ["ringKirim"], at: [199, 794], dur: 3.8 },
      { caption: "Uji di jendela penyamaran: tanpa tautan tamu, hanya layar ini yang tampil.", hide: ["ringKirim"], show: ["gate"], dur: 4 }
    ]
  },

  "tamu-pin": {
    title: "Membuka jendela PIN dashboard",
    world: PANEL,
    base: [...editorBase(), ...sharePanel(false), forCouple(T + 591), pinHint(T + 591)],
    els: {
      kelola: pinBtn(T + 591),
      ringPin: { svg: ring(16, T + 739, 366, 36, { r: 6 }), enter: "fade", delay: 0.3 },
      shade: { svg: rect(0, T, 1440, 900, { fill: "rgba(15,23,42,.45)" }), enter: "fade" }
    },
    steps: [
      { caption: "Buka panel Bagikan, lalu gulir ke PIN dashboard.", show: ["ringPin"], dur: 2.8 },
      { caption: "Klik Kelola PIN dashboard. Jendela NikahKit terbuka di atas editor.", hide: ["ringPin"], at: [199, T + 781], click: true, press: "kelola", show: ["shade"], dur: 3.4 }
    ]
  },

  "tamu-pin-salin": {
    title: "Membuat PIN dan menyalin pesan untuk pengantin",
    world: { x: 484, y: 220, w: 472, h: 630 },
    base: [...editorBase(), rect(0, T, 1440, 900, { fill: "rgba(15,23,42,.45)" }), pinWindow(false)],
    els: {
      ringStatus: { svg: ring(516, T + 194 + 236, 408, 116), enter: "fade", delay: 0.3 },
      winB: { svg: pinWindow(true), enter: "fade" },
      copiedMsg: { svg: copiedBar("Pesan tersalin."), enter: "fade" },
      wa: { svg: backdrop() + waPhone(525, 220, 630), enter: "fade", delay: 0.2 },
      copiedPin: { svg: copiedBar("PIN tersalin."), enter: "fade" }
    },
    steps: [
      { caption: "Jendela NikahKit terbuka. Baca status PIN: Undangan ini belum punya PIN.", show: ["ringStatus"], dur: 3.4 },
      { caption: "Klik Buat PIN. PIN 6 angka langsung tampil.", hide: ["ringStatus"], at: [576, T + 194 + 236 + 82], click: true, show: ["winB"], dur: 3.6 },
      { caption: "Klik ikon Salin pesan untuk pengantin. Muncul Pesan tersalin.", at: [889, PIN_ROW], click: true, show: ["copiedMsg"], dur: 3.6 },
      { caption: "Tempel di WhatsApp pengantin: undangan, tautan kelola, dan PIN.", show: ["wa"], dur: 4 },
      { caption: "Hanya perlu PIN saja? Klik ikon Salin PIN. Muncul PIN tersalin.", hide: ["wa", "copiedMsg"], at: [849, PIN_ROW], click: true, show: ["copiedPin"], dur: 3.6 }
    ]
  },

  "tamu-buku-tamu": {
    title: "Membuka Buku Tamu di Scalev",
    world: { x: 0, y: T, w: 860, h: 560 },
    base: [...appBase("Landing Pages"), landingPages()],
    els: {
      menuOn: { svg: clipped(0, T, 255, 900, scalevApp(0, T, { active: "Buku Tamu" })), enter: "fade" },
      ...listEls(0.1),
      d0: { svg: detail(), enter: "fade" },
      ringSum: { svg: ring(BX + 10, T + 182, 340, 74, { r: 6 }), enter: "fade", delay: 0.3 },
      ringTabs: { svg: ring(BX, DY.tabs, TAB_W, 37, { r: 6 }), enter: "fade", delay: 0.3 }
    },
    steps: [
      { caption: "Di sidebar Scalev, klik menu Buku Tamu.", at: [svMenuAt("Buku Tamu")[0], T + svMenuAt("Buku Tamu")[1]], click: true, show: ["menuOn", "list", "card0", "card1", "card2", "foot"] },
      { caption: "Daftar undanganmu tampil. Klik kartu undangan.", at: CARD0, click: true, show: ["d0"] },
      { caption: "Di atas ada ringkasan kehadiran, per sesi dan per pihak.", show: ["ringSum"], dur: 3.4 },
      { caption: "Pilih tab: Ucapan, RSVP, atau Tautan personal.", hide: ["ringSum"], show: ["ringTabs"], at: [BX + TAB_W / 2, DY.tabs + 18], dur: 3.2 }
    ]
  },

  "tamu-buku-tamu-ucapan": {
    title: "Menyaring, memoderasi ucapan, dan mengunduh CSV di Buku Tamu",
    world: CONTENT(T),
    base: [...appBase(), detail()],
    els: {
      filter: { svg: selectMenu(SEL_X, DY.tools + 40, 235, ["Semua", "Baru sejak terakhir dibuka", "Disembunyikan", "Belum dibalas", "Diubah/dicatat pemilik"], 2), enter: "pop", origin: [SEL_X + 117, DY.tools + 38] },
      d1: { svg: detail({ hidden: true }), enter: "fade" },
      d2: { svg: detail({ hidden: true, picked: true }), enter: "fade" },
      dl: {
        svg: circle(WIN - 140, 63, 15, { fill: C.crBlueSoft }) + iconX("download", WIN - 140, 63, 18, C.crBlue) + shadow(BR - 400, 92, 400, 72, 8, 2) + rect(BR - 400, 92, 400, 72, { r: 8, fill: C.white }) +
          iconX("file-text", BR - 368, 128, 22, C.crSub) + text(BR - 344, 133, "daftar-tamu-365671-2026-10-14.csv", { size: 13, weight: 500, fill: C.crText }),
        enter: "pop", origin: [WIN - 140, 80], delay: 0.1
      }
    },
    steps: [
      { caption: "Cari, atau pilih saringan di kotak sebelahnya.", at: [SEL_X + 117, DY.tools + 19], click: true, show: ["filter"], dur: 3.6 },
      { caption: "Tiap ucapan punya Balas, Ubah teks, Sembunyikan, dan Hapus.", hide: ["filter"], at: [ACT_X(1), DY.items + 24], dur: 3 },
      { caption: "Klik Sembunyikan. Ucapan berlabel Disembunyikan, hilang dari undangan.", at: [ACT_X(2), DY.items + 24], click: true, show: ["d1"], dur: 3.6 },
      { caption: "Aksi sekaligus: centang kotak di kiri baris. Bar aksi muncul.", at: [BX + 25, DY.items + 93 + 22], click: true, show: ["d2"], dur: 3.6 },
      { caption: "Klik Unduh daftar tamu (CSV). File tersimpan di folder unduhan.", at: [BR - CSV_W / 2, DY.tools + 19], click: true, show: ["dl"], dur: 3.6 }
    ]
  },

  "tamu-impor-csv-file": {
    title: "Menyiapkan file CSV daftar tamu",
    world: { w: 600, h: 330 },
    base: [sheet()],
    els: {
      ringHead: { svg: ring(60, SH_Y, 480, ROW, { r: 4 }), enter: "fade", delay: 0.3 },
      ringRows: { svg: ring(60, SH_Y + ROW, 480, 4 * ROW, { r: 4 }), enter: "fade", delay: 0.3 },
      dlg: { svg: saveDlg, enter: "pop", origin: [300, 120] }
    },
    steps: [
      { caption: "Baris 1 berisi judul kolom: nama, whatsapp, kategori, pax.", show: ["ringHead"], at: [140, SH_Y + 15], dur: 3.6 },
      { caption: "Isi tamu mulai baris 2. Kolom pax kosong dihitung 1 orang.", hide: ["ringHead"], show: ["ringRows"], at: [300, SH_Y + 75], dur: 3.6 },
      { caption: "Simpan atau unduh sebagai file .csv, misalnya daftar-tamu.csv.", hide: ["ringRows"], show: ["dlg"], at: [300, 206], dur: 3.8 }
    ]
  },

  "tamu-impor-csv": {
    title: "Mengimpor daftar tamu dari file CSV",
    world: CONTENT(146),
    base: appBase(),
    els: {
      ...listEls(0),
      d0: { svg: detail(), enter: "fade" },
      inv: { svg: detail({ tab: "invites" }), enter: "fade" },
      picker: { svg: picker, enter: "pop", origin: [BX + 17 + bw("Impor daftar tamu (CSV)") / 2, DY.tabs + 90] },
      prev: { svg: detail({ tab: "invites", invites: "preview" }), enter: "fade", delay: 0.1 },
      done: { svg: detail({ tab: "invites", invites: "done", msg: "3 tamu baru, 0 diperbarui." }), enter: "fade", delay: 0.1 },
      ringMsg: { svg: ring(BX, T + 72, BW2, 38, { r: 6 }), enter: "fade", delay: 0.3 }
    },
    steps: [
      { caption: "Di Buku Tamu, klik kartu undangan.", at: CARD0, click: true, show: ["d0"], dur: 3 },
      { caption: "Klik tab Tautan personal.", at: [BX + 120 + 99 + 88, DY.tabs + 18], click: true, show: ["inv"] },
      { caption: "Klik Impor daftar tamu (CSV). Jendela pilih file terbuka.", at: [BX + 17 + bw("Impor daftar tamu (CSV)") / 2, DY.tabs + 36 + 36 + 18], click: true, show: ["picker"] },
      { caption: "Klik dua kali file CSV-mu. Pratinjau impor muncul.", at: [PK + 680, 259], click: true, show: ["prev"] },
      { caption: "Cek pratinjau: 3 tamu siap, 1 baris dilewati beserta alasannya.", hide: ["picker"], dur: 3.8 },
      { caption: "Klik Impor 3 tamu. Tamu baru tampil berlabel Belum dibuka.", at: [BX + 30 + bw("Impor 3 tamu") / 2, DY.tabs + 36 + 80 + 212 + 18], click: true, show: ["done"], dur: 3.8 },
      { caption: "Lihat hasil: di atas muncul 3 tamu baru, 0 diperbarui.", show: ["ringMsg"], dur: 3.4 }
    ]
  },

  "tamu-staff": {
    title: "Membuat kode staff penerima tamu",
    world: CONTENT(90),
    base: appBase(),
    els: {
      ...listEls(0),
      d0: { svg: detail(), enter: "fade" },
      open: { svg: detail({ staff: "open" }), enter: "fade" },
      form: { svg: detail({ staff: "form" }), enter: "fade" },
      name: text(BX + 43, DY.staff + 40 + 72 + 66, "Rina", { size: 14, fill: C.strong }),
      code: { svg: detail({ staff: "code" }), enter: "fade", delay: 0.1 },
      ringBar: { svg: ring(BX + 30, DY.staff + 40 + 96, bw("Salin kode") + bw("Kirim lewat WA") + bw("Salin pesan") + 16, 36, { r: 6 }), enter: "fade", delay: 0.3 },
      shade: { svg: backdrop(), enter: "fade" },
      gate: { svg: phoneGate(), enter: "rise" },
      masuk: { svg: masukBtn(), enter: "rise" },
      dots: text(PX + 50, GY + 425, "••••••••", { size: 16, fill: C.waText }),
      hariH: { svg: phoneHariH(), enter: "fade", delay: 0.15 },
      confirm: {
        svg: shadow(CF, T + 12, 450, 132, 12, 3) + rect(CF, T + 12, 450, 132, { r: 12, fill: C.white }) +
          para(CF + 24, T + 48, ["Cabut kode Rina? Kode itu langsung tidak bisa dipakai", "check-in."], { size: 14, fill: C.crText, lh: 20 }) +
          rect(CF + 268.5, T + 96.5, 79, 31, { r: 16, fill: C.white, stroke: "#c4c7c5" }) + text(CF + 308, T + 117, "Batal", { size: 13, weight: 500, fill: C.crBlue, anchor: "middle" }) +
          rect(CF + 357, T + 96, 72, 32, { r: 16, fill: C.crBlue }) + text(CF + 393, T + 117, "OK", { size: 13, weight: 500, fill: C.white, anchor: "middle" }),
        enter: "pop", origin: [WIN / 2, T + 12]
      }
    },
    steps: [
      { caption: "Di Buku Tamu, klik kartu undangan.", at: CARD0, click: true, show: ["d0"], dur: 3 },
      { caption: "Klik Staff penerima tamu di bawah ringkasan kehadiran.", at: [BX + 110, DY.staff + 26], click: true, show: ["open"] },
      { caption: "Klik + Tambah staff. Kolom Nama staff muncul.", at: [BX + 17 + bw("+ Tambah staff") / 2, DY.staff + 40 + 36 + 18], click: true, show: ["form"] },
      { caption: "Ketik nama staff, misalnya Rina.", at: [BX + 200, DY.staff + 40 + 72 + 63], show: ["name"], type: [{ id: "name", n: 4, box: [BX + 43, DY.staff + 40 + 72 + 50, tw("Rina", 14) + 4, 22] }], dur: 2.6 },
      { caption: "Klik Buat kode. Muncul Kode untuk Rina, 8 karakter.", at: [BX + 30 + bw("Buat kode") / 2, DY.staff + 40 + 72 + 92 + 18], click: true, hide: ["name", "form"], show: ["code"], dur: 3.4 },
      { caption: "Kode hanya tampil sekali. Kirim lewat WA, Salin pesan, atau Salin kode.", show: ["ringBar"], dur: 3.8 },
      { caption: "Staff membuka tautan di HP, lalu mengisi PIN atau kode staff.", hide: ["ringBar"], show: ["shade", "gate", "masuk", "dots"], type: [{ id: "dots", n: 8, box: [PX + 50, GY + 408, 80, 24] }], at: [PX + 300, GY + 419], dur: 3.4 },
      { caption: "Klik Masuk. Staff langsung masuk ke Hari-H, hanya untuk check-in.", at: [PX + 195, GY + 477], click: true, press: "masuk", show: ["hariH"], dur: 3.6 },
      { caption: "Selesai acara? Klik Cabut, lalu OK. Kode langsung tidak berlaku.", hide: ["shade", "gate", "masuk", "dots", "hariH"], at: [BR - 17 - bw("Cabut", 12, 28) / 2, DY.staff + 40 + 144 + 24], click: true, show: ["confirm"], dur: 3.8 }
    ]
  }
};
