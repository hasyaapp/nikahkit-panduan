// Scenes for the "Bagikan dan tamu" pages (panduan/docs/tamu/*): each one full 1440x900 screen (lib v4).
// Labels and layout follow nikahkit/src/ui/App.jsx (ShareDialog, AccessSection, ResellerPin), nikahkit/ext/pin.html +
// pin.js (PIN window), nikahkit/ext/buku-tamu.html + buku-tamu.js (Buku Tamu: iframe over Scalev's <main> at x 256,
// body max 960 border-box, so the content box is 392..1304), server/pages/src/panel/index.html (dashboard gate,
// Hari-H for staff) and the guest gate (render.js .nk-gate: 400 px card). Measured from editor-bagikan.png,
// editor-akun.png, scalev-pages.png, scalev-bukutamu.png, dash-gate-hp.png, dash-hari-h-hp.png (14 Okt 2026).
// Not captured, drawn generic: the guest cover's desktop column, the WhatsApp chat, the spreadsheet with its save
// dialog, the OS file picker and Chrome's confirm and download bubble.
// Pattern: base = the state most steps discuss; other states are full-screen `skel` elements (skeleton outside the
// step's focus, detail inside it), so each step's focus covers whatever state is on screen during that step.
import {
  C, CHROME_TOP as T, PHONE, ED, chrome, favScalev, scalevEditor, scalevApp, svMenuAt, nkRail, nkHead, nkAcc, nkDialogHead, nkBtn, nkLabel, nkHint,
  nkSwitch, nkH3, nkLogo, icon, iconX, rect, text, para, line, circle, clipped, shadow, skeleton, phoneDesk, tw, esc
} from "../lib.mjs";

const PAGE = "rani-dimas", PUBLIC = `https://tokomu.myscalev.com/${PAGE}`, WID = "365671";
const SERIF = "Georgia,'Times New Roman',serif";
const MAROON = "#8b2c23", CREAM = "#fdf6ee";
const scalevTab = (active = true) => ({ title: "Scalev", fav: favScalev, active });
// Grow a box by p on every side (lens sources around a marked element).
const pad = ([x, y, w, h], p, q = p) => [x - p, y - q, w + 2 * p, h + 2 * q];

// ---- Shared bits ---------------------------------------------------------------------------------------------------
// Button with the real nk-btn look but any text colour (Buku Tamu "Hapus"/"Cabut" read red on a quiet button).
const bw = (label, size = 14, h = 36) => tw(label, size, 500) + (h <= 28 ? 18 : 26);
const btnBox = (x, y, label, o = {}) => [x, y, o.w ?? bw(label, o.size ?? 14, o.h ?? 36), o.h ?? 36];
function btn(x, y, label, o = {}) {
  const size = o.size ?? 14, [, , w, h] = btnBox(x, y, label, o), v = o.variant ?? "quiet";
  const fill = v === "primary" ? C.action : C.white, stroke = v === "primary" ? C.action : v === "ghost" ? C.action : C.line;
  const fg = v === "primary" ? C.white : v === "ghost" ? C.action : o.danger ? C.danger : C.strong;
  return rect(x + 0.5, y + 0.5, w - 1, h - 1, { r: 4, fill, stroke }) + text(x + w / 2, y + h / 2 + size * 0.36, label, { size, weight: 500, fill: fg, anchor: "middle" });
}
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
const selectBox = (x, y, w, value, o = {}) => rect(x + 0.5, y + 0.5, w - 1, (o.h ?? 36) - 1, { r: 4, fill: C.white, stroke: o.focus ? C.primary : C.field, sw: o.focus ? 2 : 1 }) +
  text(x + 11, y + (o.h ?? 36) / 2 + 5, value, { size: 14, fill: C.strong }) + icon("chevron-down", x + w - 16, y + (o.h ?? 36) / 2, 16, C.text);
// Native select popup (x, y = top-left of the list, 26 px rows). itemBox gives the highlighted row of item i.
const menuItemBox = (x, y, w, i) => [x + 4, y + 4 + i * 26, w - 8, 26];
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
const card = (x, y, w, h) => rect(x + 0.5, y + 0.5, w - 1, h - 1, { r: 8, fill: C.white, stroke: C.line });

// ---- Editor (Scalev editor viewport at 0,0) ------------------------------------------------------------------------
// The QA template's Mempelai section in the preview screen (editor-bagikan.png), drawn as plain shapes.
function invPreview() {
  const { x: X, y: Y, w } = ED.screen, cx = X + w / 2;
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
const kontenPanel = () => nkHead(0, 0, "Konten", { account: "Tahunan" }) + nkAcc(88, 169, 279, "Sampul", { badge: "Terisi" }) + nkAcc(88, 227, 279, "Mempelai", { badge: "Terisi" }) + nkAcc(88, 285, 279, "Acara & Tanggal", { badge: "Terisi" });
const editorBase = () => [scalevEditor(0, 0, { rail: "Konten" }), kontenPanel(), invPreview()];
// Rail tool button Bagikan (styles.js .nk-rail__tool: 71 wide, 4 px padding around icon 18 + gap 4 + label 12).
const BAGIKAN = [0, 567, 71, 44];
const SIMPAN = [1193, 50, 82, 34];

// ---- Bagikan dialog (editor-metrics.json "Bagikan": 366 wide body at x 16) ----------------------------------------
// d = 0 with the "Perubahan belum disimpan" note (editor-bagikan.png), -50 without it.
const NOTE = [16, 169, 366, 38], nameBox = (d) => [16, d + 239, 366, 36];
const urlBox = (y, lines) => rect(16, y, 366, 52, { r: 4, fill: C.mutedBg }) + para(26, y + 20, lines, { size: 12, fill: C.strong, lh: 18 }).replace("<text", `<text font-family="'Roboto Mono',ui-monospace,Menlo,monospace"`);
function shareTop(d) {
  return nkDialogHead(0, 0, "Bagikan") +
    (d === 0 ? rect(...NOTE, { r: 4, fill: C.warnSoft }) + text(28, 192, "Perubahan belum disimpan di Scalev.", { size: 12, fill: C.warnStrong }) : "") +
    nkLabel(16, d + 231, "Nama tamu") +
    rect(16.5, d + 239.5, 365, 35, { r: 4, fill: C.white, stroke: C.field }) + text(27, d + 262, "Nama Tamu", { size: 14, fill: C.strong }) +
    nkHint(16, d + 295, "Ditambahkan sebagai ?to=Nama.") + urlBox(d + 311, [`${PUBLIC}?`, "to=Nama+Tamu"]);
}
const SHARE = { lihat: ["Lihat sebagai tamu", 375, "primary", "eye"], salin: ["Salin tautan tamu", 419, "ghost", "copy"], umum: ["Salin tautan umum", 463, "quiet", "link"] };
const shareBox = (k, d) => [16, d + SHARE[k][1], 366, 36];
const shareBtn = (k, d) => nkBtn(16, d + SHARE[k][1], SHARE[k][0], { w: 366, size: 14, variant: SHARE[k][2], icon: SHARE[k][3] });
const shareBtns = (d) => ["lihat", "salin", "umum"].map((k) => shareBtn(k, d)).join("");
// Undangan khusus heading + switch row + hint (y = top of the H3 box).
const accessHead = (y, on) => nkH3(16, y + 12, "Undangan khusus") + text(16, y + 49, "Undangan khusus", { size: 14, fill: C.text }) + nkSwitch(346, y + 34, on) +
  para(16, y + 78, ["Isi undangan tidak ada di kode halaman. Server Nikahin", "mengirimnya hanya ke tamu dengan tautan sah."], { size: 12, fill: C.faint, lh: 16 });
const switchBox = (y) => [346, y + 34, 36, 20];
// Untuk pengantin + PIN dashboard (y = top of the "Untuk pengantin" H3 box).
const forCouple = (y) => nkH3(16, y + 12, "Untuk pengantin") +
  nkBtn(16, y + 24, "Kirim undangan", { w: 366, size: 14, variant: "ghost", icon: "link" }) +
  nkBtn(16, y + 68, "Buka Dashboard", { w: 366, size: 14, variant: "quiet", icon: "layout-grid" }) +
  nkHint(16, y + 120, "Masuk dengan PIN dashboard.") + nkH3(16, y + 160, "PIN dashboard");
const pinBtn = (y) => nkBtn(16, y + 172, "Kelola PIN dashboard", { w: 366, size: 14, icon: "lock" });
const pinHint = (y) => nkHint(16, y + 224, "PIN hanya tampil di jendela NikahKit.");
const coupleAll = (y) => forCouple(y) + pinBtn(y) + pinHint(y);
// Access section when switched on (y = top of the Keamanan field, i.e. 12 px under the switch hint).
const MODES = { link: ["Tautan pribadi", "Hanya tamu dengan tautan dari Dashboard > Kirim."], device: ["+ Kunci perangkat", "Tautan yang diteruskan tidak terbuka di perangkat lain."] };
const keamananBox = (y) => [16, y + 20, 366, 36], devicesBox = (y) => [16, y + 112, 366, 36];
function accessOn(y, mode, devices) {
  let s = rect(0, y - 4, 399, 900 - y + 4, { fill: C.white }) + nkLabel(16, y + 12, "Keamanan") + selectBox(16, y + 20, 366, MODES[mode][0]) + nkHint(16, y + 72, MODES[mode][1]);
  let at = y + 92;
  if (mode !== "link") { s += nkLabel(16, at + 12, "Perangkat per tamu") + selectBox(16, at + 20, 366, String(devices)); at += 68; }
  s += para(16, at + 16, ["Tamu tetap bisa memotret layar. Tombol WhatsApp di halaman", "pribadi memakai nomor konfirmasi hadiah."], { size: 12, fill: C.faint, lh: 16 });
  at += 36;
  s += rect(16, at, 366, 56, { r: 4, fill: C.warnSoft }) + para(28, at + 23, ["Tautan di atas tanpa token. Buat tautan tamu di", "Dashboard > Kirim."], { size: 12, fill: C.warnStrong, lh: 18 });
  at += 88;
  return s + coupleAll(at);
}
// The dialog without the unsaved note (d = -50): its sections' y.
const ACC_Y = 473, COUPLE_Y = 591, ON_Y = 583;
const shareAll = (accessMode, devices) => shareTop(-50) + shareBtns(-50) + accessHead(ACC_Y, !!accessMode) + (accessMode ? accessOn(ON_Y, accessMode, devices) : coupleAll(COUPLE_Y));
// Bagikan dialog with its content scrolled up by dy (the body under the dialog head scrolls; the head stays).
const shareScrolled = (dy, mode, devices) => rect(0, 154, 399, 746, { fill: C.white }) + clipped(0, 154, 399, 746, `<g transform="translate(0 ${-dy})">${shareAll(mode, devices)}</g>`) +
  rect(0, 92, 399, 61, { fill: C.white }) + text(16, 128, "Bagikan", { size: 16, weight: 700, fill: C.strong }) + iconX("x", 368, 122, 18, C.text) + line(0, 153, 399, 153, { stroke: C.line });

// Guest page in a new Chrome tab (desktop: the template's 480 px flow column centred, cover with the guest line).
function guestTab() {
  const cx = 720;
  let s = chrome(0, 0, 1440, 900, { tabs: [scalevTab(false), { title: "Rani & Dimas", active: true }], url: `tokomu.myscalev.com/${PAGE}?to=Budi+Santoso` }) +
    rect(0, T, 1440, 900 - T, { fill: "#f6efe7" }) + rect(cx - 240, T, 480, 900 - T, { fill: CREAM }) + rect(cx - 240, T, 480, 16, { fill: MAROON });
  for (let i = 0; i < 11; i++) s += circle(cx - 218 + i * 44, T + 14, 16, { fill: MAROON });
  return s + text(cx, 336, "The Wedding of", { size: 18, fill: "#4a3a30", anchor: "middle", italic: true, font: SERIF }) +
    text(cx, 398, "Rani & Dimas", { size: 54, fill: MAROON, anchor: "middle", italic: true, font: SERIF }) +
    text(cx, 438, "Sabtu, 12 Desember 2026", { size: 15, fill: "#4a3a30", anchor: "middle", font: SERIF }) +
    line(cx - 60, 466, cx + 60, 466, { stroke: MAROON }) +
    text(cx, 504, "Kepada Yth:", { size: 14, fill: "#4a3a30", anchor: "middle", font: SERIF }) +
    text(cx, 540, "Budi Santoso", { size: 24, weight: 700, fill: "#1a1a1a", anchor: "middle", font: SERIF }) +
    rect(cx - 98, 562, 196, 44, { r: 22, fill: MAROON }) + icon("mail", cx - 68, 584, 16, C.white) + text(cx + 12, 589, "Buka Undangan", { size: 15, weight: 700, fill: C.white, anchor: "middle", font: SERIF });
}
// Opened without a guest link while Undangan khusus is on: the private gate (.nk-gate centred in the viewport,
// .nk-gate__card max 400 wide, so the 28 px title wraps in two balanced lines).
function gateTab() {
  return chrome(0, 0, 1440, 900, { tabs: [{ title: "Undangan ini bersifat pribadi", active: true, w: 260 }], url: `tokomu.myscalev.com/${PAGE}` }) +
    rect(0, T, 1440, 900 - T, { fill: CREAM }) +
    text(720, 433, "Undangan ini", { size: 28, fill: MAROON, anchor: "middle", font: SERIF }) + text(720, 467, "bersifat pribadi", { size: 28, fill: MAROON, anchor: "middle", font: SERIF }) +
    para(720, 505, ["Undangan ini hanya terbuka lewat tautan", "pribadi yang dikirim pengantin kepada Anda.", "Buka tautan itu, atau hubungi pengantin."], { size: 15, fill: "#3a2e28", anchor: "middle", lh: 23 });
}
const GATE_CARD = [520, 405, 400, 160];

// ---- PIN window (pin.html framed over the editor: 440 wide, centred, 8 px corners) --------------------------------
const pinY = (made) => Math.round((900 - (made ? 598 : 512)) / 2), PX0 = 500, PL = PX0 + 16, PW = 408;
function pinWindow(made) {
  const h = made ? 598 : 512, X = PX0, Y = pinY(made), L = PL, W2 = PW;
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
const PIN_CARD_A = [PL, pinY(false) + 236, PW, 116], BUAT_PIN = btnBox(PL + 17, pinY(false) + 236 + 64, "Buat PIN");
const PIN_CARD_B = [PL, pinY(true) + 236, PW, 164], PIN_ROW = pinY(true) + 236 + 84; // centre of the PIN output row
// .pin: output flex 1, then the 36 px icon buttons Salin PIN and Salin pesan untuk pengantin, 4 px apart.
const COPY_PIN = [PL + 315, PIN_ROW - 18, 36, 36], COPY_MSG = [PL + 355, PIN_ROW - 18, 36, 36];
const MSG_Y = pinY(true) + 236 + 164 + 12 + 132, MSG_BOX = [PL, MSG_Y, PW, 38];
const PIN_LENS = [PL, PIN_ROW - 26, PW, MSG_Y + 44 - PIN_ROW + 26]; // PIN row down to the copied message
const copiedBar = (msg) => rect(...MSG_BOX, { r: 4, fill: C.primarySoft }) + text(PL + 12, MSG_Y + 23, msg, { size: 12, fill: C.strong });
const SHADE = rect(0, 0, 1440, 900, { fill: "rgba(15,23,42,.45)" });

// WhatsApp-like chat on the phone screen (not captured: no labels beyond the pasted message).
const WA_LINES = [
  ["Undangan siap:", 0], [PUBLIC, 1], ["Kelola undangan (kirim ke tamu, RSVP,", 0], ["ucapan, check-in):", 0],
  ["https://tokomu.myscalev.com/kelola?w=", 1], [`${WID}&link=https%3A%2F%2Ftokomu.`, 1], ["myscalev.com%2Frani-dimas", 1], ["PIN: 482913", 0]
];
const WA_BUBBLE = [PHONE.x + 60, PHONE.y + 100, 318, 24 + WA_LINES.length * 20];
function waChat() {
  const { x, y, h } = PHONE, [bx, by, bwid, bh] = WA_BUBBLE;
  return rect(x, y, 390, h, { fill: "#efeae2" }) + rect(x, y, 390, 64, { fill: "#f0f2f5" }) +
    iconX("arrow-left", x + 20, y + 32, 20, "#54656f") + circle(x + 58, y + 32, 18, { fill: "#c8d0d6" }) + rect(x + 86, y + 25, 90, 12, { r: 6, fill: "#d6dbe0" }) +
    rect(bx, by, bwid, bh, { r: 8, fill: C.waSoft }) +
    WA_LINES.map(([l, link], i) => text(bx + 12, by + 24 + i * 20, l, { size: 14, fill: link ? "#027eb5" : "#111b21", underline: !!link })).join("") +
    text(bx + bwid - 12, by + bh - 8, "10.02", { size: 11, fill: "#667781", anchor: "end" }) +
    rect(x, y + h - 64, 390, 64, { fill: "#f0f2f5" }) + rect(x + 12, y + h - 54, 310, 42, { r: 21, fill: C.white }) + circle(x + 354, y + h - 33, 21, { fill: C.wa }) + icon("send", x + 353, y + h - 33, 18, C.white);
}

// ---- Scalev dashboard + Buku Tamu ----------------------------------------------------------------------------------
const BX = 392, BW2 = 912, BR = BX + BW2; // content box 392..1304 (scalev-bukutamu.png)
const appShell = (active = "Buku Tamu") => scalevApp(0, 0, { active });
const SIDE = [0, 0, 256, 900], MAIN = [256, 0, 1184, 900];
const menuBox = (name) => { const [, y] = svMenuAt(name); return [24, y - 16, 207, 32]; };
// Landing Pages content (scalev-pages.png), the screen the member starts from.
function landingPages() {
  const rows = [["The Wedding of Rani & Dimas", "/rani-dimas"], ["Sinta & Bagas", "/sinta-bagas"], ["Contoh Undangan Nikahin", "/contoh"], ["Dashboard Pasangan", "/kelola"], ["Landing Paket Undangan", "/paket"]];
  let s = rect(256, 0, 1184, 900, { fill: "#f7f9fc" }) + rect(256, 0, 1170, 137, { fill: C.white }) + text(280, 35, "Landing Pages", { size: 18, weight: 700, fill: C.ink }) +
    line(280, 58, 1400, 58, { stroke: C.svDivider }) + rect(280, 78, 173, 40, { r: 4, fill: "#4497ca" }) + text(366, 103, "+ Create Landing Page", { size: 14, weight: 500, fill: C.white, anchor: "middle" }) +
    card(280, 243, 1120, 657) + text(297, 275, "Folders", { size: 14, weight: 700, fill: C.ink }) + line(520, 243, 520, 900, { stroke: C.line }) +
    text(537, 274, "All Landing Pages", { size: 14, weight: 700, fill: C.ink }) + rect(521, 293, 879, 38, { fill: "#f7f9fc" }) +
    [["Nama Landing Page", 585], ["Slug", 925], ["Mode", 1125]].map(([l, x]) => text(x, 317, l, { size: 12, fill: C.text })).join("");
  rows.forEach(([n, slug], i) => {
    const y = 331 + i * 71;
    s += line(521, y + 71, 1400, y + 71, { stroke: C.line }) + checkbox(538, y + 28, false) + text(585, y + 41, n, { size: 14, weight: 500, fill: "#2a8bc9" }) +
      text(925, y + 41, slug, { size: 14, fill: "#2a8bc9" }) + rect(1125, y + 22, 83, 28, { r: 4, fill: C.primarySoft }) + text(1166, y + 41, "HTML Mode", { size: 12, weight: 500, fill: C.action, anchor: "middle" });
  });
  return s;
}
const frameBg = () => rect(256, 0, 1184, 900, { fill: C.page });
const frameHead = (msg) => nkLogo(BX + 16, 40, 32) + text(BX + 42, 46, "Buku Tamu", { size: 16, weight: 700, fill: C.strong }) +
  (msg ? rect(BX, 72, BW2, 38, { r: 4, fill: C.primarySoft }) + text(BX + 12, 95, msg, { size: 12, fill: C.strong }) : "") +
  text(BX, msg ? 134 : 84, "rinawo@gmail.com", { size: 12, weight: 700, fill: C.faint }) + text(BR, msg ? 134 : 84, "Keluar", { size: 12, weight: 500, fill: C.strong, anchor: "end", underline: true });
const MSG_BT = [BX, 72, BW2, 38];
const LIST = [
  ["The Wedding of Rani & Dimas", WID, true, "Ucapan 52 (tampil 50) · Hadir 86 orang · Tidak 9 · Ragu 4", true],
  ["Sinta & Bagas", "365702", false, "Ucapan 0 (tampil 0) · Hadir 0 orang · Tidak 0 · Ragu 0"],
  ["Contoh Undangan Nikahin", "364833", true, "Ucapan 3 (tampil 3) · Hadir 5 orang · Tidak 1 · Ragu 0"]
];
function listView() {
  let s = frameBg() + frameHead() + rect(BX + 0.5, 100.5, BW2 - 1, 37, { r: 4, fill: C.white, stroke: C.field }) + text(BX + 11, 124, "Cari nama atau ID undangan", { size: 14, fill: C.faint });
  LIST.forEach(([n, id, pub, sum, fresh], i) => {
    const y = 150 + i * 86, tail = ` /${id} · ${pub ? "Terbit" : "Belum terbit"}`;
    s += card(BX, y, BW2, 74) + rich(BX + 17, y + 31, [[n, 700], [tail]]) +
      (fresh ? badge(BX + 17 + tw(n, 14, 500) + tw(tail, 14) + 6, y + 17, "Ada yang baru", true).svg : "") + text(BX + 17, y + 51, sum, { size: 14, fill: C.text });
  });
  return s + text(BX, 424, "Menampilkan 1–3 dari 3", { size: 12, fill: C.faint });
}
const CARD0 = [BX, 150, BW2, 74], CARD0_AT = [760, 186];

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
const tri = (x, yy, open) => `<path d="${open ? `M${x} ${yy - 3} h9 l-4.5 6 z` : `M${x + 1} ${yy - 5} v10 l6 -5 z`}" fill="${C.strong}"/>`;
function detail(o = {}) {
  const tab = o.tab ?? "comments", shift = o.msg ? 50 : 0;
  let s = frameBg() + frameHead(o.msg), y = 100 + shift;
  s += text(BX, y + 15, "← Daftar undangan", { size: 14, weight: 500, fill: C.strong, underline: true });
  y += 32;
  s += text(BX, y + 18, "The Wedding of Rani & Dimas", { size: 16, weight: 700, fill: C.strong });
  y += 36;
  s += card(BX, y, BW2, 104) + rich(BX + 17, y + 33, [["Hadir 86 orang", 700], [" (41 RSVP) · Tidak 9 · Ragu 4"]]) +
    text(BX + 17, y + 57, "Per sesi: Akad 30 · Resepsi 56", { size: 14, fill: C.text }) + text(BX + 17, y + 81, "Per pihak: Pihak Rani 48 · Pihak Dimas 38", { size: 14, fill: C.text });
  y += 116;
  // Staff penerima tamu (details)
  const st = o.staff ?? "closed";
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
  s += `<path d="M${BX + 0.5} ${y} V900" stroke="${C.line}"/><path d="M${BR - 0.5} ${y} V900" stroke="${C.line}"/>` + rect(BX + 1, y + 1, BW2 - 2, 900 - y, { fill: C.white });
  return s + (tab === "invites" ? invitesCard(y, o) : commentsCard(y, o));
}
// Ucapan tab card: "Pilih semua" row, then entries (name + badges, date, message; actions on the right).
const ACTS = ["Balas", "Ubah teks", "Sembunyikan", "Hapus"], ACTS_W = ACTS.reduce((t, l) => t + bw(l, 12, 28) + 4, -4);
const actBox = (i, y) => { let ax = BR - 17 - ACTS_W; for (let k = 0; k < i; k++) ax += bw(ACTS[k], 12, 28) + 4; return [ax, y + 10, bw(ACTS[i], 12, 28), 28]; };
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
    ACTS.forEach((l, k) => { const [ax, ay] = actBox(k, y); s += btn(ax, ay, hid && k === 2 ? "Tampilkan" : l, { size: 12, h: 28, danger: k === 3, w: bw(l, 12, 28) }); });
    if (i < COMMENTS.length - 1) s += line(BX + 17, y + 92.5, BR - 17, y + 92.5, { stroke: C.line });
    y += 93;
  });
  return s;
}
// Tautan personal tab card: summary, import row, optional preview, reminder tools, rows.
const IMPORT_LABEL = "Impor daftar tamu (CSV)";
function invitesCard(y, o) {
  const done = o.invites === "done", total = done ? 33 : 30;
  let s = nkHint(BX + 17, y + 32, `Dibuka 12 dari ${total} tautan personal.`);
  y += 36;
  s += btn(BX + 17, y, IMPORT_LABEL) + nkHint(BX + 17 + bw(IMPORT_LABEL) + 8, y + 23, "Kolom: nama, whatsapp, kategori, pax");
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
  rows.forEach(([n, cat, meta, unopened]) => {
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
const CODE_BTNS = ["Salin kode", "Kirim lewat WA", "Salin pesan"];
function staffBody(x, y, st) {
  const w = BW2 - 34;
  let s = nkHint(x, y + 12, STAFF_HINT), h;
  if (st === "code") {
    s += rect(x + 0.5, y + 24.5, w - 1, 119, { r: 8, fill: C.mutedBg, stroke: C.line }) +
      rich(x + 13, y + 51, [["Kode untuk Rina: "], ["K7PM3QXA", 700]]) +
      nkHint(x + 13, y + 82, "Kode hanya tampil sekali. Kirim sekarang; kalau hilang, cabut lalu buat kode baru.");
    let bx = x + 13;
    for (const l of CODE_BTNS) { s += btn(bx, y + 96, l); bx += bw(l) + 8; }
    h = 144;
    s += text(x, y + h + 26, "Rina", { size: 14, weight: 700, fill: C.text }) + text(x, y + h + 48, "Dibuat 14 Okt 2026, 09.12", { size: 12, fill: C.faint }) +
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
// Detail geometry (staff closed, nothing picked): pointer targets and marks.
const DY = { sum: 168, staff: 284, tools: 348, tabs: 398, items: 482 };
const SUM = [BX, DY.sum, BW2, 104], STAFF = [BX, DY.staff, BW2, 52];
const SB = { x: BX + 17, y: DY.staff + 40 }; // staff body origin
const TAMBAH = btnBox(SB.x, SB.y + 36, "+ Tambah staff"), NAME_IN = [SB.x + 13, SB.y + 72 + 44, BW2 - 60, 38], BUAT_KODE = btnBox(SB.x + 13, SB.y + 72 + 92, "Buat kode");
const CODE_BAR = [SB.x + 13, SB.y + 96, CODE_BTNS.reduce((t, l) => t + bw(l) + 8, -8), 36], CODE_BOX = [SB.x, SB.y + 24, BW2 - 34, 120];
const CABUT = btnBox(SB.x + BW2 - 34 - bw("Cabut", 12, 28), SB.y + 154, "Cabut", { size: 12, h: 28 });
const TAB_X = (i) => [["Ucapan (52)", 700], ["RSVP (54)", 400], ["Tautan personal (30)", 400]].slice(0, i).reduce((t, [l, w]) => t + tw(l, 14, w) + 32, BX);
const tabBox = (i, y = DY.tabs) => [TAB_X(i), y, TAB_X(i + 1) - TAB_X(i) - 4, 37];
const TABS = [BX, DY.tabs, TAB_X(3) - BX - 4, 37];
const SEL = [BX + (BW2 - CSV_W - 235 - 16) + 8, DY.tools, 235, 38], CSV = [BR - CSV_W, DY.tools + 1, CSV_W, 36];
// Tautan personal tab (staff closed): import button, preview box, Impor 3 tamu.
const IMPORT = btnBox(BX + 17, DY.tabs + 72, IMPORT_LABEL), PREVIEW = [BX + 17, DY.tabs + 116, BW2 - 34, 260], IMPOR3 = btnBox(BX + 30, DY.tabs + 116 + 212, "Impor 3 tamu");

// Dashboard gate and Hari-H on the phone screen (dash-gate-hp.png, dash-hari-h-hp.png, 390x844).
const GX = PHONE.x, GY = PHONE.y;
function phoneGate() {
  const x = GX, y = GY;
  return rect(x, y, 390, 844, { fill: C.waWash }) + rect(x + 16, y + 249, 358, 304, { r: 24, fill: C.white }) +
    text(x + 195, y + 297, "Kelola undangan", { size: 22, fill: C.waText, anchor: "middle" }) +
    para(x + 195, y + 325, ["Kirim undangan, lihat RSVP dan ucapan, dan catat", "tamu di hari-H. Semuanya dari sini."], { size: 14, fill: C.waSub, anchor: "middle", lh: 20 }) +
    text(x + 36, y + 388, "PIN atau kode staff", { size: 14, fill: C.waSub }) + rect(x + 36.5, y + 397.5, 317, 43, { r: 8, fill: C.white, stroke: "#9e9e9e" }) +
    icon("lock", x + 72, y + 586, 13, C.waSub) + text(x + 84, y + 591, "PIN hanya diingat selama tab ini terbuka.", { size: 13, fill: C.waSub });
}
const GATE_IN = [GX + 36, GY + 397, 318, 44], MASUK = [GX + 36, GY + 457, 318, 40], GATE_CARDP = [GX + 16, GY + 249, 358, 304];
const masukBtn = () => rect(...MASUK, { r: 20, fill: "#51a868" }) + text(GX + 195, GY + 483, "Masuk", { size: 16, weight: 700, fill: C.white, anchor: "middle" });
function phoneHariH() {
  const x = GX, y = GY, b = GY + 844;
  return rect(x, y, 390, 844, { fill: "#f2efea" }) + rect(x, y, 390, 64, { fill: C.white }) + text(x + 16, y + 29, "Scan tamu", { size: 16, fill: C.waText }) +
    text(x + 16, y + 48, `/${PAGE}`, { size: 13, fill: C.waSub }) + line(x, y + 64, x + 390, y + 64, { stroke: C.waLine }) +
    rect(x + 16, y + 80, 358, 40, { r: 20, fill: "#51a868" }) + text(x + 195, y + 106, "Buka kamera", { size: 15, weight: 700, fill: C.white, anchor: "middle" }) +
    text(x + 20, y + 145, "Atau tempel link tamu", { size: 13, fill: C.waSub }) + rect(x + 16, y + 155, 358, 52, { r: 26, fill: C.white }) +
    text(x + 36, y + 187, "https://…?to=Nama&u=KODE", { size: 16, fill: "#8a8a8a" }) + circle(x + 348, y + 181, 20, { fill: "#51a868" }) + icon("send", x + 347, y + 181, 18, C.white) +
    rect(x, b - 70, 390, 70, { fill: C.white }) + line(x, b - 70, x + 390, b - 70, { stroke: C.waLine }) +
    rect(x + 66, b - 60, 64, 32, { r: 16, fill: C.waSoft }) + icon("calendar-check", x + 98, b - 44, 18, C.waText) + text(x + 98, b - 11, "Hari-H", { size: 12, fill: C.waText, anchor: "middle" }) +
    circle(x + 292, b - 36, 16, { fill: C.waSoft }) + text(x + 292, b - 32, "RD", { size: 11, fill: C.waStrong, anchor: "middle" });
}
// Chrome confirm dialog (450 wide, top centre of the viewport).
const CF = 495, CONFIRM_OK = [CF + 357, 108, 72, 32];
const confirmDlg = shadow(CF, 12, 450, 132, 12, 3) + rect(CF, 12, 450, 132, { r: 12, fill: C.white }) +
  para(CF + 24, 48, ["Cabut kode Rina? Kode itu langsung tidak bisa dipakai", "check-in."], { size: 14, fill: C.crText, lh: 20 }) +
  rect(CF + 268.5, 108.5, 79, 31, { r: 16, fill: C.white, stroke: "#c4c7c5" }) + text(CF + 308, 129, "Batal", { size: 13, weight: 500, fill: C.crBlue, anchor: "middle" }) +
  rect(...CONFIRM_OK, { r: 16, fill: C.crBlue }) + text(CF + 393, 129, "OK", { size: 13, weight: 500, fill: C.white, anchor: "middle" });
// Chrome download bubble (top right, under the toolbar).
const DL = [1020, 8, 400, 72];
const dlBubble = shadow(...DL, 8, 2) + rect(...DL, { r: 8, fill: C.white }) + iconX("file-text", DL[0] + 32, DL[1] + 36, 22, C.crSub) +
  text(DL[0] + 56, DL[1] + 41, "daftar-tamu-365671-2026-10-14.csv", { size: 13, weight: 500, fill: C.crText });
// OS file picker centred on the screen (generic: sidebar, file list).
const PICK_FILE = [552, 244, 516, 30];
const picker = shadow(360, 180, 720, 440, 10, 4) + rect(360, 180, 720, 440, { r: 10, fill: C.white }) + rect(360, 180, 180, 440, { r: 10, fill: "#f2f2f4" }) + rect(530, 180, 10, 440, { fill: "#f2f2f4" }) +
  [0, 1, 2, 3, 4].map((k) => rect(380, 222 + k * 30, [96, 120, 80, 110, 90][k], 10, { r: 5, fill: "#dcdce0" })).join("") +
  rect(560, 196, 220, 22, { r: 6, fill: "#ececef" }) + line(540, 232, 1080, 232, { stroke: "#e3e3e3" }) +
  rect(...PICK_FILE, { r: 5, fill: "#dbe7fb" }) + iconX("file-text", 574, 259, 18, C.crBlue) + text(592, 264, "daftar-tamu.csv", { size: 13, fill: C.crText }) +
  iconX("file-text", 574, 291, 18, "#b8b8bc") + text(592, 296, "catatan.txt", { size: 13, fill: "#a7a7ab" }) +
  iconX("image", 574, 323, 18, "#b8b8bc") + text(592, 328, "foto-prewed.jpg", { size: 13, fill: "#a7a7ab" });

// ---- Spreadsheet (generic program, full screen; 100 px columns, 21 px rows) ---------------------------------------
// Rows match the import preview: row 5 has an invalid WhatsApp number. Header row = buku-tamu.js CSV_HEAD.
const SHEET = [["nama", "whatsapp", "kategori", "pax"], ["Budi Santoso", "081234567890", "Keluarga", "2"], ["Siti Aminah", "6285711112222", "Kantor", "1"],
  ["Pak RT Joko", "", "Tetangga", "1"], ["Rudi", "12345", "Teman", "1"]];
const SC0 = 46, COLW = 120, HDR = 160, ROWH = 21, rowTop = (r) => HDR + 21 + (r - 1) * ROWH;
function sheet() {
  let s = rect(0, 0, 1440, 900, { fill: C.white }) + iconX("file-text", 28, 28, 24, C.wa) + text(52, 34, "Daftar tamu", { size: 18, fill: C.crText }) + circle(1404, 28, 15, { fill: "#7cacf8" }) +
    ["File", "Edit", "View", "Insert", "Format", "Data", "Tools", "Help"].reduce((a, m) => ({ s: a.s + text(a.x, 77, m, { size: 14, fill: C.crText }), x: a.x + tw(m, 14) + 18 }), { s: "", x: 52 }).s +
    rect(12, 92, 1416, 34, { r: 17, fill: "#edf2fa" }) + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => rect(34 + k * 44, 104, 22, 10, { r: 5, fill: "#c7cdd6" })).join("") +
    rect(0, 130, 1440, 30, { fill: C.white }) + text(24, 150, "A1", { size: 13, fill: C.crText }) + line(80, 134, 80, 156, { stroke: "#e2e3e3" }) + text(94, 150, "fx", { size: 13, fill: C.crSub, italic: true }) +
    rect(0, HDR, 1440, 21, { fill: "#f8f9fa" }) + rect(0, HDR, SC0, 900 - HDR, { fill: "#f8f9fa" });
  for (let c = 0; SC0 + c * COLW < 1440; c++) s += text(SC0 + c * COLW + COLW / 2, HDR + 15, String.fromCharCode(65 + c), { size: 12, fill: C.crSub, anchor: "middle" }) + line(SC0 + (c + 1) * COLW + 0.5, HDR, SC0 + (c + 1) * COLW + 0.5, 900, { stroke: "#e2e3e3" });
  for (let r = 1; rowTop(r) < 900; r++) {
    const y = rowTop(r);
    s += text(SC0 / 2, y + 15, String(r), { size: 12, fill: C.crSub, anchor: "middle" }) + line(0, y + ROWH - 0.5, 1440, y + ROWH - 0.5, { stroke: "#e2e3e3" });
    (SHEET[r - 1] ?? []).forEach((v, c) => (s += text(SC0 + c * COLW + 6, y + 15, v, { size: 13, fill: C.crText })));
  }
  return s + line(SC0 + 0.5, HDR, SC0 + 0.5, 900, { stroke: "#c4c7c5" }) + line(0, HDR + 20.5, 1440, HDR + 20.5, { stroke: "#c4c7c5" });
}
const SAVE = [520, 320, 400, 240], FNAME = [540, 392, 360, 32];
const saveDlg = shadow(...SAVE, 10, 3) + rect(...SAVE, { r: 10, fill: C.white }) + text(540, 356, "Simpan sebagai", { size: 16, weight: 500, fill: C.crText }) +
  text(540, 384, "Nama file", { size: 12, fill: C.crSub }) + rect(FNAME[0] + 0.5, FNAME[1] + 0.5, FNAME[2] - 1, FNAME[3] - 1, { r: 4, fill: C.white, stroke: C.crBlue, sw: 1.5 }) + text(550, 413, "daftar-tamu.csv", { size: 13, fill: C.crText }) +
  text(540, 446, "Format", { size: 12, fill: C.crSub }) + rect(540.5, 454.5, 359, 31, { r: 4, fill: C.white, stroke: "#c4c7c5" }) + text(550, 475, "CSV (.csv)", { size: 13, fill: C.crText }) + icon("chevron-down", 884, 470, 14, C.crSub) +
  rect(820, 512, 80, 30, { r: 15, fill: C.crBlue }) + text(860, 532, "Simpan", { size: 13, weight: 500, fill: C.white, anchor: "middle" });

// ---- Konten > RSVP & Ucapan opened, as a column (fields.js order; sample values as in 03-editor-konten) -----------
const RSVP_Y = 401, RI = 101, RW = 253;
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
const RS = rsvpOpen(), RS_DY = 820 - RS.end; // scroll so the QR hint ends near the panel bottom
const kontenList = () => rect(72, 153, 327, 747, { fill: C.white }) +
  ["Galeri Foto", "Video", "Dress Code", "Susunan Acara", "RSVP & Ucapan", "Siaran Langsung", "Filter Kamera", "Amplop Digital", "Aturan Tamu", "Turut Mengundang", "Salam Penutup", "Kaki Halaman"]
    .map((t, i) => nkAcc(88, 169 + i * 58, 279, t, { badge: "Terisi" })).join("");
const QR_ROW = [RI, RS.qr + RS_DY, RW, RS.end - 8 - RS.qr], QR_SW = [RI + RW - 36, RS.qr + 10 + RS_DY, 36, 20];

// ---- Scenes ---------------------------------------------------------------------------------------------------------
const PANEL = [0, 92, 399, 808];
const center = ([x, y, w, h]) => [x + w / 2, y + h / 2];
const pill = (b) => ({ box: b, r: b[3] / 2 });

export const scenes = {
  "tamu-bagikan": {
    title: "Membagikan undangan dari panel Bagikan",
    // The dialog (with the unsaved note) is the base; the editor before the click is the element "pre".
    base: [...editorBase(), shareTop(0), shareBtns(0), accessHead(539, false), coupleAll(657)],
    els: {
      pre: { svg: nkRail(0, 0, "Konten") + skeleton(rect(72, 92, 327, 808, { fill: C.white }) + kontenPanel()), enter: "fade" },
      nameClear: { svg: rect(18, 241, 362, 32, { fill: C.white }), skel: true, enter: "fade" },
      nameTyped: { svg: text(27, 262, "Budi Santoso", { size: 14, fill: C.strong }), skel: true },
      urlNew: { svg: urlBox(311, [`${PUBLIC}?`, "to=Budi+Santoso"]), skel: true, enter: "fade", delay: 0.9 },
      guest: { svg: guestTab(), skel: true, enter: "fade", delay: 0.2 },
      copied: { svg: nkHint(16, 515, "Tersalin."), enter: "fade" },
      copied2: { svg: nkHint(16, 515, "Tersalin."), enter: "fade" }
    },
    steps: [
      { caption: "Di editor NikahKit, klik Bagikan di bawah rel kiri. Panel Bagikan terbuka.", focus: PANEL, mark: { box: BAGIKAN, r: 0 }, note: "Bagikan", at: center(BAGIKAN), click: true, hide: ["pre"] },
      { caption: "Ada Perubahan belum disimpan di Scalev? Klik Simpan di Scalev dulu.", focus: [[0, 153, 399, 70], [1183, 44, 257, 48]], mark: [NOTE, SIMPAN], lens: { src: [0, 160, 399, 56] }, dur: 3.4 },
      { caption: "Kolom Nama tamu berisi Nama Tamu. Ganti dengan nama tamumu.", focus: [0, 215, 399, 155], mark: nameBox(0), lens: { src: [0, 218, 399, 150] }, at: [300, 257], click: true, show: ["nameClear", "nameTyped", "urlNew"], type: [{ id: "nameTyped", n: 12, box: [27, 246, tw("Budi Santoso", 14) + 4, 22] }], dur: 3.8 },
      { caption: "Klik Lihat sebagai tamu. Di tab baru, nama tamu tampil di sampul.", focus: [[124, 46, 1184, 34], [480, 300, 480, 320]], mark: shareBox("lihat", 0), note: { text: "Lihat sebagai tamu", at: [24, 300] }, at: center(shareBox("lihat", 0)), click: true, show: ["guest"], dur: 4 },
      { caption: "Kembali ke tab editor.", focus: [0, 365, 399, 160], hide: ["guest"], dur: 1.8 },
      { caption: "Klik Salin tautan tamu. Di bawah tombol muncul Tersalin.", focus: [0, 413, 399, 112], mark: shareBox("salin", 0), lens: { src: [0, 413, 399, 112] }, at: center(shareBox("salin", 0)), click: true, show: ["copied"], dur: 3.4 },
      { caption: "Butuh tautan tanpa nama tamu? Klik Salin tautan umum.", focus: [0, 453, 399, 72], mark: shareBox("umum", 0), lens: { src: [0, 453, 399, 72] }, at: center(shareBox("umum", 0)), click: true, hide: ["copied"], show: ["copied2"], dur: 3.2 },
      { caption: "Di bawah ada Untuk pengantin: Kirim undangan dan Buka Dashboard.", focus: [0, 655, 399, 142], mark: [16, 681, 366, 80], lens: { src: [0, 655, 399, 137] }, at: [330, 743], hide: ["copied2"], dur: 3.6 }
    ]
  },

  "tamu-undangan-khusus": {
    title: "Menyalakan Undangan khusus",
    base: [...editorBase(), shareAll(null)],
    els: {
      swOn: { svg: nkSwitch(...switchBox(ACC_Y).slice(0, 2), true), enter: "fade" },
      accLink: { svg: accessOn(ON_Y, "link"), skel: true, enter: "rise", delay: 0.1 },
      menu: { svg: selectMenu(18, 607, 300, ["Tautan pribadi", "+ Kunci perangkat", "+ PIN untuk HP baru"], 1), enter: "pop", origin: [200, 621] },
      accDevice: { svg: accessOn(ON_Y, "device", 1), skel: true, enter: "fade" },
      menu2: { svg: selectMenu(18, 612, 120, ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], 1), enter: "pop", origin: [80, 713] },
      accDevice2: { svg: accessOn(ON_Y, "device", 2), skel: true, enter: "fade" }
    },
    steps: [
      { caption: "Di panel Bagikan, gulir ke bagian Undangan khusus.", focus: [0, ACC_Y, 399, 108], mark: [16, ACC_Y + 2, 366, 96], lens: { src: [0, ACC_Y - 4, 399, 108] }, dur: 3 },
      { caption: "Klik sakelar Undangan khusus sampai menyala. Keamanan muncul.", focus: [0, ACC_Y, 399, ON_Y + 92 - ACC_Y], mark: { box: switchBox(ACC_Y), r: 10 }, lens: { src: [0, ACC_Y + 20, 399, 150] }, at: center(switchBox(ACC_Y)), click: true, show: ["swOn", "accLink"], dur: 3.6 },
      { caption: "Klik kotak Keamanan. Ada tiga mode.", focus: [0, ON_Y - 4, 399, 96], mark: keamananBox(ON_Y), lens: { src: [0, 582, 399, 120] }, at: center(keamananBox(ON_Y)), click: true, show: ["menu"], dur: 3.2 },
      { caption: "Pilih + Kunci perangkat. Muncul Perangkat per tamu.", focus: [0, ON_Y - 4, 399, 164], mark: menuItemBox(18, 607, 300, 1), lens: { src: [0, 595, 399, 170] }, at: center(menuItemBox(18, 607, 300, 1)), click: true, hide: ["menu"], show: ["accDevice"], dur: 3.4 },
      { caption: "Klik Perangkat per tamu. Pilihannya 1 sampai 10.", mark: devicesBox(ON_Y), lens: { src: [10, 606, 140, 290] }, at: center(devicesBox(ON_Y)), click: true, show: ["menu2"], dur: 3.2 },
      { caption: "Pilih 2.", mark: menuItemBox(18, 612, 120, 1), lens: { src: [0, 666, 399, 86] }, at: center(menuItemBox(18, 612, 120, 1)), click: true, hide: ["menu2"], show: ["accDevice2"], dur: 2.6 }
    ]
  },

  "tamu-undangan-khusus-qr": {
    title: "Menyalakan QR masuk untuk tamu undangan khusus",
    base: [...editorBase(), kontenList()],
    els: {
      open: { svg: RS.svg, enter: "fade" },
      lid: skeleton(clipped(72, 0, 327, 92, scalevEditor(0, 0, { rail: "Konten" }))) + nkHead(0, 0, "Konten", { account: "Tahunan" }),
      qrOn: { svg: nkSwitch(QR_SW[0], QR_SW[1], true), enter: "fade" }
    },
    steps: [
      { caption: "Opsional, untuk check-in di lokasi: di Konten, klik RSVP & Ucapan.", focus: [72, 153, 327, 747], mark: [88, RSVP_Y, 279, 50], lens: { src: [80, RSVP_Y - 10, 300, 70] }, at: [190, RSVP_Y + 25], click: true, show: ["open"] },
      { caption: "Gulir ke bawah sampai Tampilkan QR masuk untuk tamu undangan khusus.", mark: QR_ROW, lens: { src: pad(QR_ROW, 8, 12) }, scroll: { id: "open", dy: -RS_DY }, dur: 3.8 },
      { caption: "Nyalakan sakelarnya. Tamu yang menjawab Hadir mendapat Kode masuk berupa QR.", mark: { box: QR_SW, r: 10 }, lens: { src: pad(QR_ROW, 8, 12) }, at: center(QR_SW), click: true, show: ["qrOn"], dur: 4 }
    ]
  },

  "tamu-undangan-khusus-simpan": {
    title: "Menyimpan pengaturan di editor Scalev",
    base: [...editorBase(), shareAll("device", 2)],
    els: { simpan: rect(...SIMPAN, { r: 4, fill: C.white, stroke: C.svBtnLine, sw: 2 }) + text(1201, 72, "Simpan", { size: 13, weight: 500, fill: C.strong }) + iconX("file-text", 1258, 67, 15, C.strong) },
    steps: [{ caption: "Klik Simpan di editor Scalev supaya pengaturan berlaku.", focus: [1183, 44, 257, 48], mark: SIMPAN, lens: { src: [1150, 44, 290, 46] }, at: center(SIMPAN), click: true, press: "simpan", dur: 3 }]
  },

  "tamu-undangan-khusus-uji": {
    title: "Membuat tautan tamu dan menguji undangan khusus",
    base: [...editorBase(), shareScrolled(200, "device", 2)],
    els: { gate: { svg: gateTab(), skel: true, enter: "fade", delay: 0.2 } },
    steps: [
      { caption: "Di Untuk pengantin, klik Kirim undangan. Buat tautan per tamu di Dashboard.", focus: [0, 650, 399, 150], mark: [16, 691, 366, 36], lens: { src: [0, 660, 399, 112] }, at: [199, 709], dur: 3.8 },
      { caption: "Uji di jendela penyamaran: tanpa tautan tamu, hanya layar ini yang tampil.", focus: [[124, 46, 1184, 34], [480, 395, 480, 180]], mark: GATE_CARD, lens: { src: [500, 480, 440, 90], at: [266, 440] }, show: ["gate"], dur: 4 }
    ]
  },

  "tamu-pin": {
    title: "Membuka jendela PIN dashboard",
    base: [...editorBase(), shareAll(null)],
    els: {
      kelola: pinBtn(COUPLE_Y),
      shade: { svg: SHADE, enter: "fade" },
      win: { svg: pinWindow(false), enter: "pop", delay: 0.1 }
    },
    steps: [
      { caption: "Buka panel Bagikan, lalu gulir ke PIN dashboard.", focus: [0, COUPLE_Y + 145, 399, 164], mark: [16, COUPLE_Y + 150, 366, 58], lens: { src: [0, COUPLE_Y + 140, 399, 112] }, dur: 2.8 },
      { caption: "Klik Kelola PIN dashboard. Jendela NikahKit terbuka di atas editor.", mark: [16, COUPLE_Y + 172, 366, 36], note: "Kelola PIN dashboard", at: [199, COUPLE_Y + 190], click: true, press: "kelola", show: ["shade", "win"], dur: 3.6 }
    ]
  },

  "tamu-pin-salin": {
    title: "Membuat PIN dan menyalin pesan untuk pengantin",
    base: [...editorBase(), shareAll(null), SHADE, pinWindow(false)],
    els: {
      winB: { svg: pinWindow(true), skel: true, enter: "fade" },
      copiedMsg: { svg: copiedBar("Pesan tersalin."), enter: "fade" },
      wa: { svg: phoneDesk(waChat()), skel: true, enter: "fade", delay: 0.1 },
      copiedPin: { svg: copiedBar("PIN tersalin."), enter: "fade" }
    },
    steps: [
      { caption: "Jendela NikahKit terbuka. Baca status PIN: Undangan ini belum punya PIN.", focus: PIN_CARD_A, mark: { box: PIN_CARD_A, r: 8 }, lens: { src: [PL, PIN_CARD_A[1] + 8, PW, 108] }, dur: 3.4 },
      { caption: "Klik Buat PIN. PIN 6 angka langsung tampil.", focus: [PIN_CARD_B, MSG_BOX], mark: BUAT_PIN, lens: { src: [PL, PIN_CARD_B[1], PW, 164] }, at: center(BUAT_PIN), click: true, show: ["winB"], dur: 3.6 },
      { caption: "Klik ikon Salin pesan untuk pengantin. Muncul Pesan tersalin.", focus: [PIN_CARD_B, MSG_BOX], mark: COPY_MSG, lens: { src: PIN_LENS, zoom: 1.5 }, at: center(COPY_MSG), click: true, show: ["copiedMsg"], dur: 3.6 },
      { caption: "Tempel di WhatsApp pengantin: undangan, tautan kelola, dan PIN.", focus: pad(WA_BUBBLE, 8), mark: { box: WA_BUBBLE, r: 8 }, lens: { src: pad(WA_BUBBLE, 6) }, at: [PHONE.x + 160, PHONE.y + PHONE.h - 33], hide: ["copiedMsg"], show: ["wa"], dur: 4.2 },
      { caption: "Kembali ke jendela NikahKit.", focus: [PIN_CARD_B, MSG_BOX], hide: ["wa"], dur: 1.8 },
      { caption: "Hanya perlu PIN saja? Klik ikon Salin PIN. Muncul PIN tersalin.", mark: COPY_PIN, lens: { src: PIN_LENS, zoom: 1.5 }, at: center(COPY_PIN), click: true, show: ["copiedPin"], dur: 3.6 }
    ]
  },

  "tamu-buku-tamu": {
    title: "Membuka Buku Tamu di Scalev",
    base: [appShell(), detail()],
    els: {
      pre: { svg: appShell("Landing Pages") + landingPages(), skel: true, enter: "fade" },
      list: { svg: appShell() + listView(), skel: true, enter: "fade" }
    },
    steps: [
      { caption: "Di sidebar Scalev, klik menu Buku Tamu.", focus: [menuBox("Buku Tamu"), [BX - 8, 0, BW2 + 16, 440]], mark: menuBox("Buku Tamu"), lens: { src: [0, 226, 256, 80] }, at: svMenuAt("Buku Tamu"), click: true, hide: ["pre"], show: ["list"] },
      { caption: "Daftar undanganmu tampil. Klik kartu undangan.", focus: MAIN, mark: { box: CARD0, r: 8 }, lens: { src: [BX, CARD0[1] - 22, 420, 102] }, at: CARD0_AT, click: true, hide: ["list"] },
      { caption: "Di atas ada ringkasan kehadiran, per sesi dan per pihak.", focus: pad(SUM, 8), mark: { box: SUM, r: 8 }, lens: { src: [BX, DY.sum, 400, 104] }, dur: 3.4 },
      { caption: "Pilih tab: Ucapan, RSVP, atau Tautan personal.", focus: pad(TABS, 8), mark: TABS, lens: { src: pad(TABS, 10, 14) }, at: center(TABS), dur: 3.2 }
    ]
  },

  "tamu-buku-tamu-ucapan": {
    title: "Menyaring, memoderasi ucapan, dan mengunduh CSV di Buku Tamu",
    base: [appShell(), detail()],
    els: {
      filter: { svg: selectMenu(SEL[0], DY.tools + 40, 235, ["Semua", "Baru sejak terakhir dibuka", "Disembunyikan", "Belum dibalas", "Diubah/dicatat pemilik"], 2), enter: "pop", origin: [SEL[0] + 117, DY.tools + 38] },
      d1: { svg: detail({ hidden: true }), skel: true, enter: "fade" },
      d2: { svg: detail({ hidden: true, picked: true }), skel: true, enter: "fade" },
      dl: { svg: dlBubble, enter: "pop", origin: [1220, 8], delay: 0.1 }
    },
    steps: [
      { caption: "Cari, atau pilih saringan di kotak sebelahnya.", focus: [BX - 8, DY.tools - 8, BW2 + 16, 54], mark: SEL, lens: { src: [SEL[0] - 4, DY.tools - 4, 243, 194] }, at: center(SEL), click: true, show: ["filter"], dur: 3.6 },
      { caption: "Tiap ucapan punya Balas, Ubah teks, Sembunyikan, dan Hapus.", focus: [BX - 8, DY.items, BW2 + 16, 93], mark: [actBox(0, DY.items)[0], DY.items + 10, ACTS_W, 28], lens: { src: pad([actBox(0, DY.items)[0], DY.items + 10, ACTS_W, 28], 10, 12) }, at: center(actBox(1, DY.items)), hide: ["filter"], dur: 3 },
      { caption: "Klik Sembunyikan. Ucapan berlabel Disembunyikan, hilang dari undangan.", focus: [BX - 8, DY.items, BW2 + 16, 186], mark: actBox(2, DY.items), lens: { src: [BX, DY.items + 4, 400, 86] }, at: center(actBox(2, DY.items)), click: true, show: ["d1"], dur: 3.6 },
      { caption: "Aksi sekaligus: centang kotak di kiri baris. Bar aksi muncul.", focus: [BX - 8, DY.tools - 8, BW2 + 16, DY.items + 260 - DY.tools], mark: { box: [BX + 17, DY.items + 93 + 14, 16, 16], r: 3 }, lens: { src: [BX, DY.tools + 44, 440, 180], zoom: 1.5 }, at: [BX + 25, DY.items + 93 + 22], click: true, show: ["d2"], dur: 3.6 },
      { caption: "Klik Unduh daftar tamu (CSV). File tersimpan di folder unduhan.", mark: CSV, lens: { src: DL }, at: center(CSV), click: true, show: ["dl"], dur: 3.6 }
    ]
  },

  "tamu-impor-csv-file": {
    title: "Menyiapkan file CSV daftar tamu",
    base: [sheet()],
    els: { dlg: { svg: saveDlg, enter: "pop", origin: [720, 320] } },
    steps: [
      { caption: "Baris 1 berisi judul kolom: nama, whatsapp, kategori, pax.", focus: [0, HDR, SC0 + 4 * COLW + 20, 21 * 7], mark: [SC0, rowTop(1), 4 * COLW, ROWH], lens: { src: [0, HDR, SC0 + 4 * COLW + 10, 21 * 3], zoom: 1.6 }, at: [SC0 + 60, rowTop(1) + 10], dur: 3.6 },
      { caption: "Isi tamu mulai baris 2. Kolom pax kosong dihitung 1 orang.", mark: [SC0, rowTop(2), 4 * COLW, 4 * ROWH], lens: { src: [0, rowTop(1), SC0 + 4 * COLW + 10, 21 * 5 + 4], zoom: 1.6 }, at: [SC0 + 180, rowTop(3) + 10], dur: 3.6 },
      { caption: "Simpan atau unduh sebagai file .csv, misalnya daftar-tamu.csv.", focus: "none", mark: FNAME, lens: { src: [530, 372, 380, 124], at: [226, 388] }, at: [700, 408], show: ["dlg"], dur: 3.8 }
    ]
  },

  "tamu-impor-csv": {
    title: "Mengimpor daftar tamu dari file CSV",
    base: [appShell(), detail({ tab: "invites", invites: "preview" })],
    els: {
      // Earlier states sit on top of later ones; each step hides the top one.
      inv: { svg: detail({ tab: "invites" }), skel: true, enter: "fade" },
      d0: { svg: detail(), skel: true, enter: "fade" },
      list: { svg: appShell() + listView(), skel: true, enter: "fade" },
      picker: { svg: picker, enter: "pop", origin: [720, 400] },
      done: { svg: detail({ tab: "invites", invites: "done", msg: "3 tamu baru, 0 diperbarui." }), skel: true, enter: "fade", delay: 0.1 }
    },
    steps: [
      { caption: "Di Buku Tamu, klik kartu undangan.", focus: [[BX - 8, 92, BW2 + 16, 190], pad(TABS, 8)], mark: { box: CARD0, r: 8 }, lens: { src: [BX, CARD0[1] - 22, 420, 102] }, at: CARD0_AT, click: true, hide: ["list"], dur: 3 },
      { caption: "Klik tab Tautan personal.", focus: [BX - 8, DY.tabs - 8, BW2 + 16, 124], mark: tabBox(2), lens: { src: pad(TABS, 10, 14) }, at: center(tabBox(2)), click: true, hide: ["d0"] },
      { caption: "Klik Impor daftar tamu (CSV). Jendela pilih file terbuka.", mark: IMPORT, note: IMPORT_LABEL, at: center(IMPORT), click: true, show: ["picker"] },
      { caption: "Klik dua kali file CSV-mu. Pratinjau impor muncul.", focus: [BX - 8, DY.tabs - 8, BW2 + 16, 392], mark: { box: PICK_FILE, r: 5 }, lens: { src: [540, 236, 300, 104] }, at: [680, 259], click: true, hide: ["inv"] },
      { caption: "Cek pratinjau: 3 tamu siap, 1 baris dilewati beserta alasannya.", focus: pad(PREVIEW, 8), mark: { box: PREVIEW, r: 8 }, lens: { src: [PREVIEW[0], PREVIEW[1], 420, 176], at: [300, 20] }, at: [BX + 640, PREVIEW[1] + 120], hide: ["picker"], dur: 3.8 },
      { caption: "Klik Impor 3 tamu. Tamu baru tampil berlabel Belum dibuka.", focus: [pad(MSG_BT, 8), [BX - 8, 600, BW2 + 16, 215]], mark: IMPOR3, lens: { src: [BX, 604, 420, 207] }, at: center(IMPOR3), click: true, show: ["done"], dur: 3.8 },
      { caption: "Lihat hasil: di atas muncul 3 tamu baru, 0 diperbarui.", mark: MSG_BT, lens: { src: [BX, 66, 400, 50] }, dur: 3.4 }
    ]
  },

  "tamu-staff": {
    title: "Membuat kode staff penerima tamu",
    base: [appShell(), detail({ staff: "code" })],
    els: {
      // Earlier states sit on top of later ones; each step hides the top one.
      form: { svg: detail({ staff: "form" }), skel: true, enter: "fade" },
      open: { svg: detail({ staff: "open" }), skel: true, enter: "fade" },
      d0: { svg: detail(), skel: true, enter: "fade" },
      list: { svg: appShell() + listView(), skel: true, enter: "fade" },
      name: text(NAME_IN[0] + 13, NAME_IN[1] + 24, "Rina", { size: 14, fill: C.strong }),
      phone: { svg: phoneDesk(phoneGate(), { screen: C.waWash }), skel: true, enter: "fade" },
      masuk: { svg: masukBtn(), enter: "fade" },
      dots: text(GATE_IN[0] + 14, GATE_IN[1] + 28, "••••••••", { size: 16, fill: C.waText }),
      hariH: { svg: phoneDesk(phoneHariH()), skel: true, enter: "fade", delay: 0.15 },
      confirm: { svg: confirmDlg, enter: "pop", origin: [720, 12] }
    },
    steps: [
      { caption: "Di Buku Tamu, klik kartu undangan.", focus: [BX - 8, 92, BW2 + 16, 252], mark: { box: CARD0, r: 8 }, lens: { src: [BX, CARD0[1] - 22, 420, 102] }, at: CARD0_AT, click: true, hide: ["list"], dur: 3 },
      { caption: "Klik Staff penerima tamu di bawah ringkasan kehadiran.", focus: [BX - 8, DY.staff - 8, BW2 + 16, 136], mark: { box: STAFF, r: 8 }, lens: { src: [BX, DY.staff - 4, 360, 60] }, at: [BX + 110, DY.staff + 26], click: true, hide: ["d0"] },
      { caption: "Klik + Tambah staff. Kolom Nama staff muncul.", focus: [BX - 8, DY.staff - 8, BW2 + 16, 310], mark: TAMBAH, lens: { src: [BX, SB.y + 20, 420, 150] }, at: center(TAMBAH), click: true, hide: ["open"] },
      { caption: "Ketik nama staff, misalnya Rina.", mark: NAME_IN, lens: { src: [BX + 17, NAME_IN[1] - 28, 400, 76] }, at: [NAME_IN[0] + 180, NAME_IN[1] + 19], show: ["name"], type: [{ id: "name", n: 4, box: [NAME_IN[0] + 13, NAME_IN[1] + 8, tw("Rina", 14) + 4, 22] }], dur: 2.8 },
      { caption: "Klik Buat kode. Muncul Kode untuk Rina, 8 karakter.", focus: [BX - 8, SB.y + 16, BW2 + 16, 240], mark: BUAT_KODE, lens: { src: [BX + 17, SB.y + 24, 420, 120] }, at: center(BUAT_KODE), click: true, hide: ["name", "form"], dur: 3.4 },
      { caption: "Kode hanya tampil sekali. Kirim lewat WA, Salin pesan, atau Salin kode.", mark: CODE_BAR, lens: { src: [CODE_BOX[0], CODE_BOX[1], 420, 120] }, at: center(CODE_BAR), dur: 3.8 },
      { caption: "Staff membuka tautan di HP, lalu mengisi PIN atau kode staff.", focus: GATE_CARDP, mark: { box: GATE_IN, r: 8 }, lens: { src: [GX + 16, GY + 370, 358, 132] }, at: [GATE_IN[0] + 260, GATE_IN[1] + 22], show: ["phone", "masuk", "dots"], type: [{ id: "dots", n: 8, box: [GATE_IN[0] + 14, GATE_IN[1] + 11, 80, 24] }], dur: 3.6 },
      { caption: "Klik Masuk. Staff langsung masuk ke Hari-H, hanya untuk check-in.", focus: [[GX, GY, 390, 220], [GX, GY + 774, 390, 70]], mark: pill(MASUK), lens: { src: [GX, GY, 390, 128] }, at: center(MASUK), click: true, press: "masuk", hide: ["masuk", "dots"], show: ["hariH"], dur: 3.8 },
      { caption: "Selesai acara? Kembali ke Buku Tamu.", focus: [BX - 8, SB.y + 16, BW2 + 16, 240], hide: ["phone", "hariH"], dur: 1.8 },
      { caption: "Klik Cabut, lalu OK. Kode langsung tidak berlaku.", mark: [{ box: CABUT }, pill(CONFIRM_OK)], lens: { src: [CF, 12, 450, 132] }, at: center(CABUT), click: true, show: ["confirm"], dur: 4 }
    ]
  }
};
