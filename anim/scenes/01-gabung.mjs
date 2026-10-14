// Mulai + Gabung dan pasang: peta perjalanan, checklist per bagian, istilah alamat, pasang ekstensi, masuk, bayar, kode
// uji, Scalev, update. Every scene is one 1440x900 desktop screen (lib v4). Chrome pages sit in a maximized Chrome window
// (page from y 85, viewport 1440 x 815); the Scalev editor and app are drawn at their measured 1440 layout from y 85.
// Measured: pasang.html at 1440 x 815 in headless Chromium (14 Okt 2026), chrome://extensions at 1440 (labels in Bahasa
// Indonesia), the Scalev Landing Pages list and Settings tab (as in 02-scalev.mjs), the NikahKit account dialog from
// pin.html + pin.js (440 or 760 wide, centred, max-height 100vh - 32px) and src/pin-frame.js (36 px close button 12 px
// from the corner, backdrop rgba(15,23,42,.45)), the panel gate from nikahkit/src/ui/App.jsx, the update banner from
// nikahkit/src/ui/help.jsx. No extension version numbers: the banner and the ZIP names keep their place, the number is
// left out. Not measured (generic, grey bars instead of unverified labels): Scalev and Google login/consent windows,
// Windows Explorer, the Chrome download bubble, folder picker, extension menu and prompt box.
import {
  C, CHROME_TOP, rect, text, para, line, circle, group, clipped, shadow, icon, iconX, tw, wrap, esc, nkBtn, nkBtnBox, nkInput, nkLabel,
  nkHint, nkSeg, nkHead, nkDialogHead, nkAcc, nkRail, chrome, toggleCr, nkLogo, scalevEditor, scalevApp, svMenuAt, favScalev, favChrome
} from "../lib.mjs";

const W = 1440, CT = CHROME_TOP, VIEW = 900 - CT; // Chrome content top 85, page viewport 1440 x 815
const ID = "365671", SLUG = "rani-dimas", PAGE = "Undangan Rani & Dimas", URL = "app.scalev.com/pages/" + ID;
const EMAIL = "rina.wo@gmail.com";
const BIZ = "Rina Wedding Organizer (@rinawo)";
const LIC_NONE = ["Belum berlangganan. Pilih paket untuk mulai", "membuat undangan."];
const LIC_YEAR = ["Paket Tahunan, aktif sampai 14 Oktober 2027."];
const LIC_ON = { license: LIC_YEAR, choose: "Perpanjang atau ganti paket", active: true };
const MAROON = "#8a2d1f", SERIF = "Georgia,'Times New Roman',serif";
const BAR = "#e3e5e8";

// ---- Small shared pieces --------------------------------------------------------------------------------------------
// Mixed-weight text on one line: segs = [[text, weight?, fill?], ...].
const rich = (x, y, segs, o = {}) => `<text x="${x}" y="${y}" font-size="${o.size ?? 12}" fill="${o.fill ?? C.strong}">${segs.map(([s, w, f]) => `<tspan font-weight="${w ?? 400}"${f ? ` fill="${f}"` : ""}>${esc(s)}</tspan>`).join("")}</text>`;
const mid = (r) => [r[0] + r[2] / 2, r[1] + r[3] / 2];
const grow = (r, d) => [r[0] - d, r[1] - d, r[2] + 2 * d, r[3] + 2 * d];
const bars = (x, y, ws, gap = 26, fill = BAR) => ws.map((w, k) => rect(x, y + k * gap, w, 10, { r: 5, fill })).join("");
// Chrome: maximized window, its top strip alone (tab or address changes), the page viewport.
const win = (o) => chrome(0, 0, W, 900, o);
const crTop = (o) => clipped(0, 0, W, CT, chrome(0, 0, W, CT + 10, o));
const vp = (svg) => clipped(0, CT, W, VIEW, svg);
const urlBox = (url) => [164, 54, tw(url, 14) + 4, 18]; // the address text in the omnibox
const TOOLBAR = [0, 41, W, 44];
const TAB_ED = { title: PAGE, active: true, fav: favScalev };
const TAB1 = [84, 6, 240, 35], TAB2 = [332, 6, 240, 35]; // Chrome tab shapes (first, second)
// Editor (measured 1440 layout) in the Chrome page area.
const LEFT = [0, CT + 44, 400, VIEW - 44]; // Scalev tab row + left area
const TOP = [0, 0, W, CT + 92]; // Chrome top + Scalev top bar and tab row
const TAB_NK_BOX = [228, CT + 56, 82, 20], TAB_NK = [264, CT + 66];
const tabBox = (name, x, on, T = CT) => [x - 2, T + 57, tw(name, 12, on ? 700 : 500) + 4, 18];
const editor = (tab = "Code", rail, name = "Tamu Undangan") => scalevEditor(0, CT, { tab, rail }) + coverAt(727, CT + 106, 922, name);
// Google's four-colour G (App.jsx GOOGLE_G), size px square at (x, y).
const gLogo = (x, y, size = 20) => `<g transform="translate(${x} ${y}) scale(${size / 48})"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></g>`;
// "Masuk dengan Google" (.nk-gbtn: 40 high, #747775 border, 14px 500).
const GBTN_W = 12 + 20 + 10 + tw("Masuk dengan Google", 14, 500) + 12;
const gBtn = (x, y, o = {}) => group({ opacity: o.disabled ? 0.38 : 1 }, rect(x + 0.5, y + 0.5, GBTN_W - 1, 39, { r: 4, fill: C.white, stroke: "#747775" }) + gLogo(x + 12, y + 10) +
  text(x + 42, y + 25, "Masuk dengan Google", { size: 14, weight: 500, fill: "#1f1f1f" }));
const DIM = rect(0, CT, W, VIEW, { fill: "rgba(15,23,42,.45)" }); // pin-frame backdrop over the page viewport
const yesIc = (cx, cy) => circle(cx, cy, 7.5, { stroke: C.ok, sw: 1.7 }) + `<path d="M${cx - 3} ${cy} l2.2 2.2 l4 -4" fill="none" stroke="${C.ok}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`;
const noIc = (cx, cy) => circle(cx, cy, 7.5, { stroke: C.off, sw: 1.7 }) + `<path d="M${cx - 2.6} ${cy - 2.6} l5.2 5.2 M${cx + 2.6} ${cy - 2.6} l-5.2 5.2" fill="none" stroke="${C.off}" stroke-width="1.7" stroke-linecap="round"/>`;
const PIN_ICON = '<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>';
const pinIc = (cx, cy, size, color) => `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${PIN_ICON}</g>`;
// Guide annotation card (guide colours, not part of any real screen).
const guideCard = (x, y, w, h, title) => rect(x + 3, y + 5, w, h, { r: 12, fill: "rgba(43,26,7,.12)" }) + rect(x, y, w, h, { r: 12, fill: C.tint, stroke: C.accent, sw: 2 }) +
  (title ? text(x + 28, y + 44, title, { size: 22, weight: 700, fill: C.accent }) : "");

// ---- NikahKit account dialog (pin.html framed by src/pin-frame.js) ---------------------------------------------------
// Opened from the gate or the account chip ("openLogin"): no ID, so no "ID" line and no PIN dashboard card.
// Returns { svg, h, at, X, Y, box } with the dialog at (X, Y), 440 wide. at.* = element rects [x, y, w, h].
function pinDlg(X, Y, o = {}) {
  const st = o.state ?? "in", at = {};
  let s = "", c = 64;
  const card = (top, h) => rect(X + 16.5, top + 0.5, 407, h - 1, { r: 8, fill: C.white, stroke: C.line });
  const btn = (x, y, label, variant, key) => { const w = tw(label, 14, 500) + 24; at[key] = [x, y, w, 36]; return [nkBtn(x, y, label, { variant, size: 14, w }), w]; };
  if (st === "checking") { s += text(X + 16, Y + c + 16, "Memeriksa login...", { size: 12, fill: C.faint }); c += 20 + 12; }
  if (st === "out") { s += card(Y + c, 74) + gBtn(X + 33, Y + c + 17, { disabled: o.gDisabled }); at.google = [X + 33, Y + c + 17, GBTN_W, 40]; c += 74 + 12; }
  if (st === "in") {
    at.email = [X + 16, Y + c, tw(o.email ?? EMAIL, 12, 700), 16];
    s += text(X + 16, Y + c + 12, o.email ?? EMAIL, { size: 12, weight: 700, fill: C.faint }) + text(X + 424, Y + c + 12, "Keluar", { size: 12, weight: 500, fill: C.strong, anchor: "end", underline: true });
    c += 28;
    const lic = o.license ?? LIC_NONE, top = Y + c;
    let L = top + 40 + 20 * lic.length, inner = text(X + 33, top + 28, "Paket", { size: 12, weight: 700 }) + para(X + 33, top + 55, lic, { size: 14, fill: C.text, lh: 20 });
    const choose = o.choose === undefined ? "Pilih paket" : o.choose;
    let bx = X + 33;
    if (choose || o.paid) {
      if (choose) { const [b, w] = btn(bx, L + 8, choose, "primary", "choose"); inner += b; bx += w + 8; }
      if (o.paid) inner += btn(bx, L + 8, "Cek pembayaran", "quiet", "paid")[0];
      L += 44;
    } else L += 8;
    if (!o.active) { inner += text(X + 33, L + 20, "Punya kode uji?", { size: 12, weight: 500, fill: C.strong, underline: true }); at.redeem = [X + 33, L + 8, tw("Punya kode uji?", 12, 500), 16]; L += 24; }
    at.licCard = [X + 16, top, 408, L + 17 - top];
    s += card(top, L + 17 - top) + inner;
    c = L + 17 - Y + 12;
    const biz = o.biz ? [o.biz] : ["Belum terhubung."], bt = Y + c;
    const bL = bt + 40 + 20 * biz.length + 8;
    at.bizCard = [X + 16, bt, 408, bL + 36 + 17 - bt];
    s += card(bt, bL + 36 + 17 - bt) + text(X + 33, bt + 28, "Bisnis Scalev", { size: 12, weight: 700 }) + para(X + 33, bt + 55, biz, { size: 14, fill: C.text, lh: 20 }) +
      btn(X + 33, bL, o.biz ? "Hubungkan ulang" : "Hubungkan bisnis Scalev", "quiet", "connect")[0];
    c = bL + 36 + 17 - Y + 12;
  }
  const msg = o.msg === undefined ? (st === "in" ? ["Sudah masuk. Kembali ke editor Scalev."] : null) : o.msg;
  if (msg) { const h = 20 + msg.length * 18; at.msg = [X + 16, Y + c, 408, h]; s += rect(X + 16, Y + c, 408, h, { r: 4, fill: C.primarySoft }) + para(X + 28, Y + c + 23, msg, { size: 12, fill: C.strong, lh: 18 }); c += h + 16; }
  else c += 4;
  const h = c;
  at.close = [X + 392, Y + 12, 36, 36];
  const head = shadow(X, Y, 440, h, 8, 3) + rect(X, Y, 440, h, { r: 8, fill: C.white }) + nkLogo(X + 32, Y + 32, 32) + text(X + 58, Y + 38, "NikahKit", { size: 16, weight: 700 }) + iconX("x", X + 410, Y + 30, 18, C.text);
  return { svg: head + s, h, at, X, Y, box: [X, Y, 440, h] };
}
// The dialog centred in the page viewport (pin-frame: fixed, flex-centred).
const dlg = (o) => pinDlg(W / 2 - 220, CT + Math.round((VIEW - pinDlg(0, 0, o).h) / 2), o);

// Wide dialog: "Pilih paket" comparison (pin.html #compare, body.wide = 760) at (X, Y), card height H (max 100vh - 32px).
const PLAN_ROWS = [
  [["Masa aktif"], ["30 hari"], ["1 tahun"], ["Selama layanan", "Nikahin berjalan"]],
  [["Jumlah undangan"], ["Tanpa batas"], ["Tanpa batas"], ["Tanpa batas"]],
  [["Editor NikahKit di Scalev"], 1, 1, 1],
  [[[["Buku Tamu Digital", 700, C.strong], [": RSVP, ucapan,"]], "check-in QR. Tanpa kuota tamu", "dan event"], 1, 1, 1],
  [["Akun staff penerima tamu (kode", "check-in, tanpa membagi PIN)"], 0, 1, 1],
  [["Impor daftar tamu CSV (kategori,", "jumlah orang, WhatsApp)"], 0, 1, 1],
  [["PIN dashboard dan tautan tamu"], 1, 1, 1],
  [["Semua template yang tersedia", "saat ini"], 1, 1, 1],
  [["Saat masa aktif habis"], ["Tenggang 7 hari,", "undangan tetap", "tampil"], ["Tenggang 7 hari,", "undangan tetap", "tampil"], ["Tidak perlu", "perpanjang"]]
];
const PLANS = [["", "Bulanan", "Rp79.000", ["per 30 hari"], "ghost"], ["Paling hemat", "Tahunan", "Rp299.000", ["per tahun, setara", "Rp24.917/bulan"], "primary"], ["", "Sekali Bayar", "Rp699.000", ["sekali bayar, tanpa", "perpanjang"], "ghost"]];
function planDlg(X, Y, H) {
  const Wd = 760, tx = X + 16, tw0 = 728, fc = 247, pc = (tw0 - fc) / 3, col = (i) => tx + fc + i * pc;
  const t0 = Y + 112;
  const back = [X + Wd - 16 - (tw("Kembali", 14, 500) + 24), Y + 64, tw("Kembali", 14, 500) + 24, 36];
  let body = nkLogo(X + 32, Y + 32, 32) + text(X + 58, Y + 38, "NikahKit", { size: 16, weight: 700 }) +
    text(X + 16, Y + 86, "Pilih paket", { size: 12, weight: 700 }) + nkBtn(back[0], back[1], "Kembali", { variant: "quiet", size: 14, w: back[2] });
  const rowsH = PLAN_ROWS.map((r) => 24 + 20 * Math.max(...r.map((v) => (Array.isArray(v) ? v.length : 1))));
  const head = 170, tH = head + rowsH.reduce((a, b) => a + b, 0);
  body += rect(tx + 0.5, t0 + 0.5, tw0 - 1, tH - 1, { r: 8, fill: C.white, stroke: C.line }) + rect(col(1), t0 + 1, pc, tH - 2, { fill: C.page });
  const btns = [];
  PLANS.forEach(([tag, name, price, per, v], i) => {
    const x = col(i) + 12;
    if (tag) body += rect(x, t0 + 12, tw(tag, 10, 600) + 12, 18, { r: 4, fill: C.primarySoft }) + text(x + 6, t0 + 25, tag, { size: 10, weight: 600, fill: C.action });
    body += text(x, t0 + 49, name, { size: 14, weight: 700 }) + text(x, t0 + 75, price, { size: 16, weight: 700, fill: C.primary }) + para(x, t0 + 94, per, { size: 12, fill: C.faint, lh: 16 });
    btns.push([x, t0 + 122, pc - 24, 36]);
    body += nkBtn(x, t0 + 122, "Pilih", { variant: v, size: 14, w: pc - 24 });
  });
  const rowY = []; let y = t0 + head;
  PLAN_ROWS.forEach((r, i) => {
    rowY.push(y);
    body += line(tx + 1, y, tx + tw0 - 1, y);
    r[0].forEach((l, k) => (body += Array.isArray(l) ? rich(tx + 12, y + 27 + 20 * k, l, { size: 14, fill: C.text }) : text(tx + 12, y + 27 + 20 * k, l, { size: 14, fill: C.text })));
    r.slice(1).forEach((v, j) => (body += v === 1 ? yesIc(col(j) + 21, y + 22) : v === 0 ? noIc(col(j) + 21, y + 22) : para(col(j) + 12, y + 27, v, { size: 14, weight: 500, fill: C.strong, lh: 20 })));
    y += rowsH[i];
  });
  body += text(tx, t0 + tH + 20, "Harga belum termasuk biaya layanan pembayaran Scalev. Perpanjang kapan saja: sisa masa aktif tetap terhitung.", { size: 12, fill: C.faint });
  const svg = shadow(X, Y, Wd, H, 8, 3) + rect(X, Y, Wd, H, { r: 8, fill: C.white }) + clipped(X, Y, Wd, H, body) + iconX("x", X + Wd - 30, Y + 30, 18, C.text);
  return { svg, X, Y, H, box: [X, Y, Wd, H], col, pc, t0, tx, rowY, rowsH, btns, back };
}
const table = () => planDlg((W - 760) / 2, CT + 16, VIEW - 32);

// ---- NikahKit panel states inside the Scalev editor at (ex, ey) -----------------------------------------------------
// AccessGate (App.jsx): the whole NikahKit area (0..398), header NikahKit + /slug, chip, close; note; buttons.
function gate(ex, ey, o) {
  let s = rect(ex, ey + 92, 399, 808, { fill: C.white }) + line(ex + 399, ey + 92, ex + 399, ey + 900, { stroke: C.svDivider }) +
    text(ex + 16, ey + 92 + 29, "NikahKit", { size: 16, weight: 700 }) + text(ex + 16, ey + 92 + 52, "/" + SLUG, { size: 12, fill: C.text }) +
    line(ex, ey + 158.5, ex + 399, ey + 158.5, { stroke: C.line }) + iconX("x", ex + 369, ey + 125, 18, C.text);
  if (o.chip) { const w = 6 + 16 + 4 + tw(o.chip, 12, 500) + 8, x = ex + 343 - w; s += rect(x + 0.5, ey + 111.5, w - 1, 27, { r: 14, fill: C.white, stroke: C.field }) + icon("circle-user-round", x + 14, ey + 125, 14, C.primary) + text(x + 26, ey + 129, o.chip, { size: 12, weight: 500 }); }
  const nh = 20 + o.lines.length * 18, ny = ey + 175;
  s += rect(ex + 16, ny, 367, nh, { r: 4, fill: o.warn ? C.warnSoft : C.primarySoft }) + o.lines.map((l, i) => rich(ex + 28, ny + 23 + i * 18, l, { size: 12, fill: o.warn ? C.warnStrong : C.strong })).join("");
  const by = ny + nh + 12, at = {};
  let bx = ex + 16;
  for (const [label, v, key] of o.btns ?? []) {
    if (v === "google") { s += gBtn(bx, by); at[key] = [bx, by, GBTN_W, 40]; bx += GBTN_W + 8; continue; }
    const w = tw(label, 12, 500) + 24; s += nkBtn(bx, by, label, { variant: v, w }); at[key] = [bx, by, w, 36]; bx += w + 8;
  }
  return { svg: s, at };
}
const GATE_OUT = (ex, ey) => gate(ex, ey, { lines: [[["Masuk ke NikahKit.", 700]]], btns: [["Masuk dengan Google", "google", "google"]] });
const GATE_NONE = (ex, ey) => gate(ex, ey, { chip: "Akun", lines: [[["Akun belum berlangganan.", 700]]], btns: [["Pilih paket", "primary", "choose"], ["Periksa lagi", "quiet", "recheck"]] });
const GATE_BIZ = (ex, ey) => gate(ex, ey, { chip: "Tahunan", warn: true, lines: [[["Hubungkan bisnis Scalev dulu.", 700], [" Hubungkan di akun"]], [["NikahKit, lalu tekan Periksa lagi."]]], btns: [["Hubungkan bisnis Scalev", "primary", "connect"], ["Periksa lagi", "quiet", "recheck"]] });
// The editor's NikahKit tab with a gate, over a Code-tab editor (tab row + left area).
const gateEl = (g) => clipped(...LEFT, scalevEditor(0, CT, { tab: "NikahKit", rail: "" }) + g.svg);

// Template panel (editor-template.png): rail, header with chip, optional update banner, Template/Marketing, cards. The
// description as the card clamps it (two lines, same text as 03-editor-konten.mjs).
const TPL = [["Dasar", "#3d3a38", ["Abu-abu gelap di atas", "foto, tanpa ornamen…"]], ["Folio", "#2a2d33", ["Hitam & krem gaya", "majalah, foto penuh…"]],
  ["Galeri Putih", "#f4f1ec", ["Putih bersih gaya", "majalah, huruf serif…"]], ["Modern Estetik", "#efe9e2", ["Putih & krem, bingkai", "lengkung, bayangan…"]]];
function thumb(x, y, dark) {
  const fg = dark === "#f4f1ec" || dark === "#efe9e2" ? "#7a6a5c" : "#e8e2da";
  return rect(x + 0.5, y + 0.5, 133, 166, { r: 4, fill: C.page, stroke: C.line, sw: 2 }) + rect(x + 5, y + 5, 72, 157, { r: 2, fill: dark }) +
    text(x + 41, y + 70, "Rani & Dimas", { size: 7, fill: fg, anchor: "middle", font: SERIF }) + rect(x + 26, y + 104, 30, 6, { r: 3, fill: fg }) +
    [0, 1, 2, 3, 4, 5, 6, 7].map((k) => rect(x + 83 + (k % 2) * 23, y + 6 + Math.floor(k / 2) * 39, 20, 35, { r: 1, fill: k % 3 ? "#ffffff" : "#ded6cc" })).join("");
}
const panelHead = (ex, ey, title) => rect(ex + 72, ey + 92, 327, 808, { fill: C.white }) + nkHead(ex, ey, title, { account: "Tahunan" }) + line(ex + 72, ey + 153.5, ex + 399, ey + 153.5, { stroke: C.line });
function templatePanel(ex, ey, o = {}) {
  let s = panelHead(ex, ey, "Template");
  let y = ey + 169;
  if (o.banner) y += 112 + (o.hint ? 36 : 0);
  s += nkSeg(ex + 88, y, 279, ["Template", "Marketing"], 0);
  TPL.forEach(([n, bg, desc], i) => {
    const x = ex + 88 + (i % 2) * 146, cy = y + 50 + Math.floor(i / 2) * 241;
    s += thumb(x, cy, bg) + text(x, cy + 188, n, { size: 14, weight: 500 }) + para(x, cy + 209, desc, { size: 12, fill: C.faint, lh: 16 });
  });
  return clipped(ex, ey + 92, 399, 808, s);
}
const TPL_CARD = [88, 219, 134, 167]; // first template card (Dasar), editor at 0,0
// Template > Marketing (panels-style.jsx, marketing.js): Profil merek box, then the two page cards.
const MKT = [[["Dashboard", "pasangan"], ["Kirim undangan, RSVP,", "ucapan, dan check-in", "tamu dalam satu", "halaman."]],
  [["Landing page"], ["Halaman jualan:", "desain, paket dan", "harga, lalu form", "pesanan yang masuk", "ke Pesanan masuk", "Anda."]]];
function marketing(ex, ey, o = {}) {
  let s = panelHead(ex, ey, "Template") + nkSeg(ex + 88, ey + 169, 279, ["Template", "Marketing"], 1), y = ey + 217;
  if (o.open) {
    const f = (yy, label, value, hint, ph) => nkLabel(ex + 104, yy, label) + nkInput(ex + 104, yy + 8, 247, value, { placeholder: ph }) + (hint ? para(ex + 104, yy + 62, hint, { size: 12, fill: C.faint, lh: 16 }) : "");
    s += rect(ex + 88.5, y + 0.5, 278, 380, { r: 4, fill: C.white, stroke: C.line }) + nkAcc(ex + 88, y, 279, "Profil merek", { open: true, badge: "Terisi" }) +
      f(y + 76, "Nama bisnis", "Rina WO") + f(y + 140, "Nomor WhatsApp", "0812 3456 7890", ["Tombol Tanya lewat WhatsApp di Landing", "page menuju nomor ini."]) +
      f(y + 240, "Logo (opsional)", "https://", ["Alamat gambar https, misalnya dari", "Media Scalev Anda."], true);
    y += 392;
  } else { s += nkAcc(ex + 88, y, 279, "Profil merek", { badge: "Terisi" }); y += 62; }
  MKT.forEach(([name, desc], i) => {
    const x = ex + 88 + i * 146;
    s += rect(x + 0.5, y + 0.5, 133, 166, { r: 4, fill: C.page, stroke: C.line, sw: 2 }) + rect(x + 40, y + 12, 54, 143, { r: 6, fill: C.white, stroke: C.field }) + bars(x + 48, y + 30, [38, 26, 34, 20], 22, C.mutedBg) +
      para(x, y + 188, name, { size: 14, weight: 500, fill: C.strong, lh: 18 }) + para(x, y + 191 + 18 * name.length, desc, { size: 12, fill: C.faint, lh: 16 });
  });
  return clipped(ex, ey + 92, 399, 808, s);
}
// Konten panel: accordion groups (fields.js GROUPS labels).
const konten = (ex, ey) => clipped(ex, ey + 92, 399, 808, panelHead(ex, ey, "Konten") + nkAcc(ex + 88, ey + 169, 279, "Sampul", { badge: "Terisi" }) +
  nkAcc(ex + 88, ey + 227, 279, "Mempelai", { badge: "Terisi" }) + nkAcc(ex + 88, ey + 285, 279, "Acara & Tanggal", { badge: "Belum diisi" }));
// Update banner (help.jsx UpdateBox, nk-note--warn at 88,169 279 wide). Version numbers are left out on purpose.
const BANNER = (ey) => [88, ey + 169, 279, 100];
function updateBanner(ex, ey, o = {}) {
  const x = ex + 88, y = ey + 169, h = 100 + (o.hint ? 36 : 0);
  const bar = (bx, by, w) => rect(bx, by - 9, w, 11, { r: 3, fill: "rgba(154,52,18,.22)" });
  const w1 = tw("NikahKit ", 12, 700);
  let s = rect(x, y, 279, h, { r: 4, fill: C.warnSoft }) + text(x + 12, y + 23, "NikahKit", { size: 12, weight: 700, fill: C.warnStrong }) + bar(x + 12 + w1, y + 23, 34) +
    text(x + 12 + w1 + 40, y + 23, "tersedia.", { size: 12, weight: 700, fill: C.warnStrong }) + text(x + 12 + w1 + 40 + tw("tersedia. ", 12, 700), y + 23, "Anda memakai", { size: 12, fill: C.warnStrong }) +
    bar(x + 12, y + 41, 34) + text(x + 48, y + 41, ".", { size: 12, fill: C.warnStrong });
  s += nkBtn(x + 12, y + 54, "Update", { icon: "download", w: 86 }) + nkBtn(x + 106, y + 54, "Cara update", { variant: "quiet", w: 91 });
  if (o.hint) s += para(x + 12, y + 110, ["Ekstrak ZIP, timpa isi folder NikahKit, lalu", "klik ↻ di chrome://extensions."], { size: 12, fill: C.faint, lh: 16 });
  return s;
}
// The panel after access is granted: rail + Template panel (+ banner).
const nkOpen = (ey, o = {}) => rect(0, ey + 92, 400, 808, { fill: C.white }) + nkRail(0, ey, "Template") + templatePanel(0, ey, o) + (o.banner ? updateBanner(0, ey, o) : "");
// Bagikan dialog (editor-bagikan.png, as in 02-scalev.mjs), guest "Andi".
const SHARE_VIEW = (y) => [16, y + 325, 366, 36];
const shareDlg = (y) => nkDialogHead(0, y, "Bagikan") + nkLabel(16, y + 181, "Nama tamu") + nkInput(16, y + 189, 366, "Andi") + nkHint(16, y + 245, "Ditambahkan sebagai ?to=Nama.") +
  rect(16, y + 261, 366, 52, { r: 4, fill: C.mutedBg }) + para(26, y + 282, [`https://tokomu.myscalev.com/${SLUG}?`, "to=Andi"], { size: 12, fill: C.strong, lh: 18 }) +
  nkBtn(16, y + 325, "Lihat sebagai tamu", { w: 366, size: 14, icon: "eye" }) + nkBtn(16, y + 369, "Salin tautan tamu", { w: 366, size: 14, variant: "ghost", icon: "copy" }) +
  nkBtn(16, y + 413, "Salin tautan umum", { w: 366, size: 14, variant: "quiet", icon: "link" });
// Pesanan masuk dialog (orders.jsx): empty list, "Tempel data pesanan" and "Link form klien (opsional)" boxes.
function ordersDlg(x, y, o = {}) {
  let s = nkDialogHead(x, y, "Pesanan masuk") + text(x + 16, y + 180, "Belum ada pesanan masuk.", { size: 12, fill: C.faint }), yy = y + 196;
  if (o.paste) {
    s += rect(x + 16.5, yy + 0.5, 366, 210, { r: 4, fill: C.white, stroke: C.line }) + nkAcc(x + 16, yy, 367, "Tempel data pesanan", { open: true }) +
      rect(x + 32.5, yy + 62.5, 334, 95, { r: 4, fill: C.white, stroke: C.field }) +
      para(x + 44, yy + 86, ["Halo Rina WO, ini data undangan kami.", "Rani & Dimas, 14 Februari 2027.", "#data-undangan {\"v\":1,…}"], { size: 13, fill: C.strong, lh: 20 }) + nkBtn(x + 32, yy + 166, "Isi undangan");
    yy += 222;
  } else { s += nkAcc(x + 16, yy, 367, "Tempel data pesanan"); yy += 58; }
  if (o.link) s += rect(x + 16.5, yy + 0.5, 366, 156, { r: 4, fill: C.white, stroke: C.line }) + nkAcc(x + 16, yy, 367, "Link form klien (opsional)", { open: true }) +
    para(x + 32, yy + 78, ["Kirim ke klien bila ingin mereka mengisi sendiri.", "Isian mereka muncul di daftar ini."], { size: 12, fill: C.faint, lh: 16 }) +
    nkBtn(x + 32, yy + 106, "Salin link form", { variant: "quiet", icon: "copy", w: tw("Salin link form", 12, 500) + 44 });
  else s += nkAcc(x + 16, yy, 367, "Link form klien (opsional)");
  return s;
}

// Invitation cover in the plain preview screen (template look from editor-template.png).
function coverAt(X, Y, cx, name) {
  const wave = (yy) => `<path d="M${X} ${yy} h390 v24 ${Array.from({ length: 8 }, () => "q-24.4 16 -48.75 0").join(" ")} z" fill="${MAROON}"/>`;
  return rect(X, Y, 390, 784, { fill: "#fdf6ee" }) + rect(X, Y, 390, 22, { fill: MAROON }) + wave(Y + 22) +
    `<path d="M${cx - 70} ${Y + 294} v-120 a70 70 0 0 1 140 0 v120 z" fill="#c9b8a6" stroke="${MAROON}" stroke-width="2"/>` +
    `<path d="M${cx - 68} ${Y + 292} l40 -60 l25 30 l30 -45 l41 75 z" fill="#a8927e"/>` + circle(cx + 30, Y + 160, 12, { fill: "#e9dccd" }) +
    text(cx, Y + 326, "The Wedding Of", { size: 17, fill: "#2b1a07", anchor: "middle", font: SERIF }) +
    text(cx, Y + 398, "Rani & Dimas", { size: 44, fill: MAROON, anchor: "middle", font: SERIF, italic: true }) +
    text(cx, Y + 450, "Minggu, 14 Februari 2027", { size: 15, weight: 700, fill: "#1f1f1f", anchor: "middle", font: SERIF }) +
    text(cx, Y + 471, "#RaniDimas", { size: 13, fill: "#3a3a3a", anchor: "middle", font: SERIF }) +
    text(cx, Y + 506, "Kepada Yth. Bapak/Ibu/Saudara/i", { size: 13, weight: 700, fill: "#1f1f1f", anchor: "middle", font: SERIF }) +
    rect(cx - 120, Y + 512, 240, 30, { fill: "#fdf6ee" }) + text(cx, Y + 535, name, { size: 18, fill: MAROON, anchor: "middle", font: SERIF }) +
    rect(cx - 86, Y + 567, 172, 48, { r: 24, fill: MAROON }) + icon("mail", cx - 58, Y + 591, 16, C.white) + text(cx + 12, Y + 596, "Buka Undangan", { size: 15, fill: C.white, anchor: "middle", font: SERIF }) +
    `<path d="M${X} ${Y + 784} v-24 ${Array.from({ length: 8 }, () => "q24.4 -16 48.75 0").join(" ")} v24 z" fill="${MAROON}"/>`;
}

// ---- chrome://extensions (measured from chrome-extensions.png at 1440 wide) -------------------------------------------
const DEV_BTNS = ["Muat yang belum dibuka", "Kemas ekstensi", "Perbarui"];
const devBtnRects = (x, y) => { let bx = x + 24; return DEV_BTNS.map((l) => { const w = tw(l, 13, 500) + 34, r = [bx, y + 66, w, 36]; bx += w + 19; return r; }); };
function extPage(x, y, o = {}) {
  const w = 1440, dy = o.dev ? 0 : -57, SW_X = 692;
  let s = rect(x, y, w, 900, { fill: C.white }) + iconX("puzzle", x + 33, y + 28, 22, "#8e918f") + text(x + 67, y + 37, "Ekstensi", { size: 22, fill: C.crText }) +
    rect(x + (w - SW_X) / 2, y + 10, SW_X, 36, { r: 18, fill: C.crOmni }) + iconX("search", x + (w - SW_X) / 2 + 20, y + 28, 16, C.crIcon) + text(x + (w - SW_X) / 2 + 36, y + 33, "Telusuri ekstensi", { size: 13, fill: C.crSub }) +
    text(x + w - 54, y + 33, "Mode developer", { size: 13, fill: C.crText, anchor: "end" }) + toggleCr(x + w - 43, y + 19, !!o.dev);
  if (o.dev) devBtnRects(x, y).forEach(([bx, by, bw, bh], i) => (s += rect(bx + 0.5, by + 0.5, bw - 1, bh - 1, { r: 18, fill: C.white, stroke: "#a8b4c4" }) + text(bx + bw / 2, by + 23, DEV_BTNS[i], { size: 13, weight: 500, fill: C.crBlue, anchor: "middle" })));
  s += line(x, y + 113.5 + dy, x + w, y + 113.5 + dy, { stroke: "#e3e3e3" }) +
    `<path d="M${x} ${y + 122 + dy} h234 a20 20 0 0 1 0 40 h-234 z" fill="${C.crBlueSoft}"/>` + iconX("puzzle", x + 34, y + 142 + dy, 17, C.crBlue) + text(x + 64, y + 147 + dy, "Ekstensi saya", { size: 14, weight: 500, fill: C.crBlue }) +
    rect(x + 26, y + 176 + dy, 16, 11, { r: 2, stroke: C.crIcon, sw: 1.5 }) + text(x + 64, y + 187 + dy, "Pintasan keyboard", { size: 14, weight: 500, fill: C.crText }) +
    line(x, y + 210.5 + dy, x + 256, y + 210.5 + dy, { stroke: "#e3e3e3" });
  if (o.card) s += extCard(x, y);
  return s;
}
const EXT_CARD = [384, 203, 400, 208]; // relative to the page top
const pillCr = (x, y, l) => { const w = tw(l, 13, 500) + 34; return rect(x + 0.5, y + 0.5, w - 1, 35, { r: 18, fill: C.white, stroke: "#a8b4c4" }) + text(x + w / 2, y + 23, l, { size: 13, weight: 500, fill: C.crBlue, anchor: "middle" }); };
const extCard = (px, py) => { const x = px + 384, y = py + 203; return text(x, py + 182, "Semua Ekstensi", { size: 16, fill: C.crText }) + shadow(x, y, 400, 208, 8, 1) + rect(x + 0.5, y + 0.5, 399, 207, { r: 8, fill: C.white, stroke: "#e3e3e3" }) + nkLogo(x + 43, y + 40, 34) +
  text(x + 92, y + 31, "NikahKit", { size: 13, weight: 500, fill: C.crText }) +
  para(x + 92, y + 55, ["Buat undangan pernikahan digital di Scalev", "HTML Mode: pilih template, warna, font, musik,", "dan isi data."], { size: 13, fill: C.crSub, lh: 20 }) +
  text(x + 92, y + 119, "ID: ibljeopjjcapnmcclgcggefhgnolmmeb", { size: 13, fill: C.crSub }) +
  pillCr(x + 8, y + 166, "Detail") + pillCr(x + 8 + tw("Detail", 13, 500) + 34 + 8, y + 166, "Hapus") + iconX("rotate-cw", x + 325, y + 184, 16, C.crIcon) + toggleCr(x + 353, y + 175, true); };
const RELOAD = [384 + 325, CT + 203 + 184];

// ---- Desktop windows (generic: Windows Explorer) ----------------------------------------------------------------------
function explorer(x, y, w, h, o = {}) {
  let s = rect(x + 4, y + 10, w, h, { r: 10, fill: "rgba(0,0,0,.14)" }) + rect(x, y, w, h, { r: 8, fill: C.white, stroke: "#cfd3d8" }) +
    rect(x, y, w, 36, { r: 8, fill: "#f3f3f3" }) + rect(x, y + 28, w, 8, { fill: "#f3f3f3" }) + iconX("folder", x + 22, y + 18, 15, "#e5a531") +
    text(x + 38, y + 23, o.title, { size: 13, fill: "#1f1f1f" }) + line(x + w - 126, y + 18, x + w - 114, y + 18, { stroke: "#444" }) + rect(x + w - 76, y + 13, 10, 10, { stroke: "#444" }) + iconX("x", x + w - 24, y + 18, 13, "#444") +
    rect(x, y + 36, w, 44, { fill: "#f9f9f9" }) + iconX("arrow-left", x + 22, y + 58, 15, "#666") + iconX("arrow-right", x + 50, y + 58, 15, "#bbb") +
    rect(x + 72, y + 44, w - 92, 28, { r: 4, fill: C.white, stroke: "#dcdcdc" }) + text(x + 84, y + 63, o.path, { size: 13, fill: "#1f1f1f" }) + line(x, y + 80.5, x + w, y + 80.5, { stroke: "#e5e5e5" }) +
    rect(x, y + 81, 180, h - 82, { fill: "#fafafa" }) + line(x + 180.5, y + 81, x + 180.5, y + h, { stroke: "#e5e5e5" });
  ["Desktop", "Dokumen", "Unduhan"].forEach((n, i) => (s += (n === o.side ? rect(x + 8, y + 94 + i * 32, 164, 28, { r: 4, fill: "#e5eefb" }) : "") + iconX("folder", x + 26, y + 108 + i * 32, 15, n === o.side ? "#e5a531" : "#c49a3a") + text(x + 44, y + 113 + i * 32, n, { size: 13, fill: "#1f1f1f" })));
  return s;
}
const sideRow = (x, y, i) => [x + 8, y + 94 + i * 32, 164, 28]; // Explorer sidebar row (Desktop, Dokumen, Unduhan)
const SEL = (x, y) => [x - 22, y - 8, 108, 112]; // icon selection box
const selBox = (x, y) => rect(...SEL(x, y), { r: 4, fill: "#cce4f7", stroke: "#99c9ef" });
const zipIcon = (x, y, label, sel) => (sel ? selBox(x, y) : "") + rect(x, y, 64, 72, { r: 6, fill: "#e8eaed", stroke: "#c4c7c5" }) +
  [0, 1, 2, 3, 4].map((i) => rect(x + 26, y + i * 8, 12, 4, { fill: "#9aa0a6" })).join("") + rect(x + 24, y + 40, 16, 12, { r: 2, stroke: "#9aa0a6", sw: 1.5 }) + text(x + 32, y + 92, label, { size: 13, fill: "#1f1f1f", anchor: "middle" });
const folderIcon = (x, y, label, sel) => (sel ? selBox(x, y - 4) : "") + rect(x, y + 4, 64, 58, { r: 6, fill: "#e5a531" }) + rect(x, y, 28, 14, { r: 4, fill: "#e5a531" }) + rect(x, y + 16, 64, 46, { r: 6, fill: "#f2b84b" }) +
  text(x + 32, y + 82, label, { size: 13, fill: "#1f1f1f", anchor: "middle", weight: label === "NikahKit" ? 600 : undefined });
const fileIcon = (x, y, label, sel) => (sel ? selBox(x, y) : "") + `<path d="M${x + 12} ${y} h28 l14 14 v54 h-42 z" fill="#ffffff" stroke="#9aa0a6" stroke-width="1.5"/>` +
  `<path d="M${x + 40} ${y} v14 h14" fill="none" stroke="#9aa0a6" stroke-width="1.5"/>` + [24, 32, 40, 48].map((d) => rect(x + 20, y + d, 26, 2, { fill: "#c4c7c5" })).join("") + text(x + 32, y + 88, label, { size: 13, fill: "#1f1f1f", anchor: "middle" });
const NK_FILES = ["manifest.json", "nk-bg.js", "pin.html", "nk-bridge.js"];
const DOC_FOLDERS = ["Faktur", "NikahKit", "Foto klien"];

// ---- Scalev pages ---------------------------------------------------------------------------------------------------
// Landing Pages (scalev-pages.png, 1440 layout as in 02-scalev.mjs), page top y; rows of HTML Mode pages.
const SV = { blue: "#3b8fd0", link: "#2f86d1", ink: "#1f2d3d", sub: "#6b7480", line: "#e5e8ec", bg: "#f8f9fb", soft: "#e6f2fb" };
const LP_ROWS = [[PAGE, "/" + SLUG], ["Promo Rina WO", "/promo"], ["Contoh Undangan", "/contoh"]];
const svCheck = (x, y) => rect(x + 0.5, y + 0.5, 17, 17, { r: 3, fill: C.white, stroke: "#b8c0ca" });
function lpPage(y) {
  let s = rect(256, y, 1184, 900, { fill: SV.bg }) + rect(256, y, 1184, 137, { fill: C.white }) + line(256, y + 137.5, 1440, y + 137.5, { stroke: SV.line }) +
    text(280, y + 36, "Landing Pages", { size: 18, weight: 600, fill: SV.ink }) + line(280, y + 58.5, 1400, y + 58.5, { stroke: SV.line }) +
    rect(280, y + 78, 173, 40, { r: 4, fill: SV.blue }) + text(366.5, y + 103, "+ Create Landing Page", { size: 14, weight: 500, fill: C.white, anchor: "middle" }) +
    iconX("search", 1203, y + 97, 15, SV.sub) + text(1223, y + 103, "Cari landing page...", { size: 13, fill: "#a6adb7" }) +
    rect(280.5, y + 244.5, 1119, 655, { r: 6, fill: C.white, stroke: SV.line }) + line(520.5, y + 244, 520.5, y + 900, { stroke: SV.line }) +
    text(297, y + 275, "Folders", { size: 14, weight: 600, fill: SV.ink }) + para(297, y + 294, ["Kelompokkan landing page per", "campaign, produk, atau klien."], { size: 11, fill: SV.sub, lh: 16 }) +
    rect(297, y + 328, 207, 36, { r: 4, fill: "#eef6fc" }) + icon("layout-grid", 316, y + 346, 15, SV.blue) + text(335, y + 351, "All Landing Pages", { size: 14, weight: 500, fill: SV.link }) + text(498, y + 351, String(LP_ROWS.length), { size: 12, fill: SV.link, anchor: "end" }) +
    text(537, y + 273, "All Landing Pages", { size: 14, weight: 600, fill: SV.ink }) + text(667, y + 273, String(LP_ROWS.length), { size: 12, fill: SV.sub }) +
    rect(521, y + 293, 879, 38, { fill: "#f6f8fa" }) + svCheck(537, y + 303) +
    [["Nama Landing Page", 585], ["Folder", 785], ["Slug", 925], ["Mode", 1125], ["Domains", 1245]].map(([l, x]) => text(x, y + 316, l, { size: 12, fill: SV.sub })).join("");
  LP_ROWS.forEach(([name, slug], i) => {
    const ry = y + 331 + i * 71;
    s += line(521, ry + 70.5, 1400, ry + 70.5, { stroke: SV.line }) + svCheck(537, ry + 27) +
      text(585, ry + 41, name, { size: 14, weight: 500, fill: SV.link }) + rect(787, ry + 24, 92, 24, { r: 4, fill: "#f3f4f6" }) + iconX("file-text", 800, ry + 36, 12, SV.sub) + text(812, ry + 40, "Ungrouped", { size: 12, fill: "#3b4350" }) +
      text(925, ry + 41, slug, { size: 14, fill: SV.link }) + rect(1125, ry + 22, 83, 28, { r: 3, fill: SV.soft }) + text(1166.5, ry + 40, "HTML Mode", { size: 12, weight: 700, fill: SV.blue, anchor: "middle" }) +
      text(1245, ry + 41, "-", { size: 14, fill: SV.sub }) + [0, 1, 2].map((k) => circle(1364 + k * 7, ry + 36, 2.2, { fill: "#3b4350" })).join("");
  });
  return s;
}
const LP_NAME = (y) => [585, y + 358, tw(PAGE, 14, 500), 18]; // first row's page name
const LP_ALL = (y) => [297, y + 328, 207, 36];
// Scalev editor Settings tab (measured 14 Okt 2026, as in 02-scalev.mjs): header row, Domain / URL open with the slug.
const lu = (paths, cx, cy, size, color) => `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</g>`;
const ACC = [["DOMAIN / URL", '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>'],
  ["SEO & PAGE IDENTITY", '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'], ["ANALYTICS SETTINGS", '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>'],
  ["PAGE MANAGEMENT", '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'],
  ["ADVANCED SETTINGS", '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>']];
const acc = (y, i, h = 0) => rect(17, y + 1, 364, (h || 60) - 2, { r: 8, fill: C.white, stroke: "#e8ebef", sw: 2 }) + rect(18, y + 2, 362, h ? 58 : 56, { r: 6, fill: h ? "#eef2f6" : "#f3f5f7" }) +
  rect(30, y + 14, 32, 32, { r: 8, fill: "#0b9bd3" }) + lu(ACC[i][1], 46, y + 30, 16, C.white) +
  text(72, y + 35, ACC[i][0], { size: 12, weight: 700, fill: "#344157" }).replace("<text", '<text letter-spacing="0.96"') + icon(h ? "chevron-up" : "chevron-down", 359, y + 30, 14, "#7c899b");
const svField = (x, y, w, h = 42) => rect(x + 1, y + 1, w - 2, h - 2, { r: 4, fill: "#f6f9fc", stroke: "#dbdfe5", sw: 2 });
const svLabel = (x, y, s) => text(x, y, s, { size: 12, weight: 500, fill: "#5b6675" });
function settingsPanel(T) {
  let s = rect(0, T + 93, 399, 807, { fill: C.white }) + rect(16, T + 112, 49, 20, { r: 4, fill: "#f3f5f7" }) + text(40.5, T + 126, "ver. 37", { size: 12, weight: 500, fill: "#5b6675", anchor: "middle" }) +
    text(73, T + 127, "Diterbitkan", { size: 14, weight: 500, fill: "#15c15d" }) + text(149, T + 127, "14/10/2026", { size: 14, fill: C.strong }) +
    rect(240, T + 105, 126, 34, { r: 4, fill: C.white, stroke: "#e8ebef", sw: 2 }) + text(303, T + 126, "Batalkan Penerbitan", { size: 12, weight: 500, fill: "#df0e03", anchor: "middle" }) +
    line(0, T + 153.5, 399, T + 153.5, { stroke: "#dbdfe5" });
  let y = T + 170;
  ACC.forEach((_, i) => {
    if (i === 0) {
      s += acc(y, 0, 351) + svLabel(34, T + 259, "Slug URL") + text(88, T + 259, "*", { size: 12, weight: 500, fill: "#f14756" }) + svField(34, T + 274, 330) + text(48, T + 300, SLUG, { size: 14, fill: "#0f161e" }) +
        svLabel(34, T + 368, "Set as Homepage to Domains") + svField(34, T + 383, 330, 43) + text(48, T + 409, "Select Domain", { size: 14, fill: "#8d97a3" }) +
        svLabel(34, T + 455, "Limit to Domains") + svField(34, T + 470, 330, 43) + text(48, T + 496, "Select Custom Domain", { size: 14, fill: "#8d97a3" });
      y += 367;
    } else { s += acc(y, i); y += 76; }
  });
  return s;
}
const SLUG_FIELD = (T) => [34, T + 274, 330, 42];
// Scalev PayLink invoice page (nikahin.myscalev.com/pay/…, labels as seen live), Tahunan Rp299.000, in the viewport.
const PAY = { x: W / 2 - 250, w: 500 }, PAY_BTN = [PAY.x + 24, CT + 500, PAY.w - 48, 48], PAY_CARD = [PAY.x, CT + 30, PAY.w, 560];
const payPage = () => {
  const L = PAY.x + 24, R = PAY.x + PAY.w - 24, f = { size: 14, fill: C.strong }, sm = { size: 12, fill: C.faint }, rule = (y) => line(PAY.x, y + 0.5, PAY.x + PAY.w, y + 0.5, { stroke: "#eef0f3" });
  const opt = (x, y, w, label) => rect(x + 0.5, y + 0.5, w - 1, 35, { r: 6, fill: C.white, stroke: "#dcdfe4" }) + text(x + 14, y + 23, label, { size: 14, weight: 500, fill: C.strong });
  const half = (PAY.w - 48 - 10) / 2, cx = PAY.x + PAY.w / 2;
  return rect(0, CT, W, VIEW, { fill: "#f5f6f8" }) + rect(PAY.x, CT + 30, PAY.w, 560, { r: 10, fill: C.white, stroke: "#e6e8ec" }) +
    text(cx, CT + 66, "Nikahin", { size: 18, weight: 700, fill: C.strong, anchor: "middle" }) + rule(CT + 86) +
    text(L, CT + 112, "RINGKASAN PESANAN", { ...sm, weight: 700 }) + text(R, CT + 112, "Invoice #261014KXRWQPT", { ...sm, anchor: "end" }) +
    text(L, CT + 138, "NikahKit Membership - Tahunan", f) + text(R, CT + 138, "Rp299.000", { ...f, anchor: "end" }) + text(L, CT + 156, "1 x Rp299.000", sm) +
    text(L, CT + 184, "Total Tagihan", { ...f, weight: 700 }) + text(R, CT + 184, "Rp299.000", { size: 16, weight: 700, fill: C.strong, anchor: "end" }) + rule(CT + 200) +
    text(L, CT + 224, "BAYAR SEBELUM 17 OKT 2026, 09.30", { size: 12, weight: 700, fill: C.strong }) + text(R, CT + 224, "Sisa waktu 71:58:43", { ...sm, anchor: "end" }) +
    text(L, CT + 254, "PILIH METODE PEMBAYARAN", { ...sm, weight: 700 }) + opt(L, CT + 266, PAY.w - 48, "QRIS") +
    text(L, CT + 326, "Virtual Account", { ...sm, weight: 700 }) + opt(L, CT + 338, half, "BCA") + opt(L + half + 10, CT + 338, half, "BNI") +
    opt(L, CT + 382, half, "BRI") + opt(L + half + 10, CT + 382, half, "Bank Mandiri") + opt(L, CT + 426, half, "Bank Permata") +
    rect(...PAY_BTN, { r: 6, fill: C.primary }) + text(cx, CT + 529, "Bayar ke Nikahin", { size: 15, weight: 700, fill: C.white, anchor: "middle" }) +
    text(cx, CT + 572, "Pembayaran diproses dengan aman dan terenkripsi", { ...sm, anchor: "middle" });
};
const TABS_PAY = [{ ...TAB_ED, active: false }, { title: "nikahin.myscalev.com", active: true, fav: favScalev }];
// The pay tab: its own Chrome top + the invoice page.
const payTab = () => crTop({ tabs: TABS_PAY, url: "nikahin.myscalev.com/pay/…" }) + payPage();
// A popup window (OAuth): Chrome popup frame with its address, generic content.
const popup = (x, y, w, h, url) => shadow(x, y, w, h, 10, 4) + rect(x, y, w, h, { r: 10, fill: C.white, stroke: "#d0d4d9" }) + rect(x, y, w, 40, { r: 10, fill: C.crFrame }) + rect(x, y + 30, w, 10, { fill: C.crFrame }) +
  rect(x + 10, y + 7, w - 20, 26, { r: 13, fill: C.white }) + icon("lock", x + 26, y + 20, 12, C.crIcon) + text(x + 40, y + 25, url, { size: 12, fill: C.crText });
// Separate Scalev window (OAuth): login, then consent with the business chosen. Not measured: grey bars.
const SW = { x: 880, y: 130, w: 460, h: 560 };
const SW_BTN = [SW.x + 40, SW.y + SW.h - 120, SW.w - 80, 48];
const scalevWin = (consent) => {
  const { x, y, w, h } = SW;
  let s = popup(x, y, w, h, "app.scalev.com/oauth/authorize") +
    circle(x + w / 2 - 4, y + 96, 22, { fill: "#3b7dd8" }) + circle(x + w / 2 - 10, y + 90, 5, { fill: C.white }) + circle(x + w / 2 + 2, y + 102, 5, { fill: C.white }) +
    rect(x + 90, y + 142, 280, 14, { r: 7, fill: BAR }) + rect(x + 130, y + 168, 200, 10, { r: 5, fill: "#eceef1" });
  if (!consent) return s + [0, 1].map((k) => rect(x + 40, y + 222 + k * 92, 120, 10, { r: 5, fill: BAR }) + rect(x + 40.5, y + 240.5 + k * 92, w - 81, 43, { r: 6, fill: C.white, stroke: "#d5dae1" })).join("") +
    rect(...SW_BTN, { r: 6, fill: C.primary });
  return s + rect(x + 40, y + 212, w - 80, 64, { r: 8, fill: C.white, stroke: C.primary, sw: 2 }) + circle(x + 72, y + 244, 14, { fill: C.primary }) + text(x + 72, y + 249, "R", { size: 12, weight: 700, fill: C.white, anchor: "middle" }) +
    text(x + 96, y + 249, "Rina Wedding Organizer", { size: 14, weight: 500, fill: C.strong }) + bars(x + 40, y + 302, [320, 260, 300]) + rect(...SW_BTN, { r: 6, fill: C.primary });
};
const SW_BIZ = [SW.x + 40, SW.y + 212, SW.w - 80, 64];

// ---- Small screens used by the overview scenes ------------------------------------------------------------------------
// pin.html PIN card with a PIN shown (openPin with an ID): PIN, copy, handover, Lihat PIN / Buat PIN baru, message.
function pinCard(x, y) {
  return rect(x + 0.5, y + 0.5, 407, 213, { r: 8, fill: C.white, stroke: C.line }) + text(x + 17, y + 28, "PIN dashboard", { size: 12, weight: 700 }) +
    text(x + 17, y + 52, "PIN aktif (versi 1). Lupa? Lihat lagi kapan saja.", { size: 12, fill: C.faint }) +
    rect(x + 17, y + 64, 296, 40, { r: 4, fill: C.mutedBg }) + text(x + 29, y + 91, "482190", { size: 16, weight: 700, fill: C.strong, mono: true }).replace("<text", '<text letter-spacing="6"') +
    icon("copy", x + 335, y + 84, 18, C.text) + icon("message-circle", x + 375, y + 84, 18, C.text) +
    nkBtn(x + 17, y + 116, "Lihat PIN", { size: 14, w: tw("Lihat PIN", 14, 500) + 24 }) + nkBtn(x + 17 + tw("Lihat PIN", 14, 500) + 32, y + 116, "Buat PIN baru", { variant: "quiet", size: 14, w: tw("Buat PIN baru", 14, 500) + 24 }) +
    rect(x + 17, y + 166, 374, 32, { r: 4, fill: C.primarySoft }) + text(x + 29, y + 187, "Pesan tersalin.", { size: 12, fill: C.strong });
}
const PIN_MSG_IC = [363, 72, 24, 24], PIN_FIELD = [17, 64, 296, 40], PIN_COPIED = [17, 166, 374, 32];
// Bisnis Scalev card (linked) over the Landing Pages row of the undangan.
function lpRowCard(x, y) {
  return rect(x, y + 10, 408, 121, { r: 8, fill: C.white, stroke: C.line }) + text(x + 16, y + 38, "Bisnis Scalev", { size: 12, weight: 700 }) +
    text(x + 16, y + 65, BIZ, { size: 14, fill: C.text }) + nkBtn(x + 16, y + 81, "Hubungkan ulang", { variant: "quiet", size: 14, w: tw("Hubungkan ulang", 14, 500) + 24 }) +
    rect(x, y + 160, 408, 120, { r: 6, fill: C.white, stroke: "#e6e8ec" }) + rect(x, y + 160, 408, 34, { r: 6, fill: "#f5f6f8" }) + text(x + 14, y + 182, "Nama Landing Page", { size: 12, fill: "#5b6675" }) + text(x + 294, y + 182, "Mode", { size: 12, fill: "#5b6675" }) +
    text(x + 14, y + 228, PAGE, { size: 14, weight: 500, fill: C.primary }) + rect(x + 294, y + 210, 83, 28, { r: 4, fill: "#e6f4fb" }) + text(x + 335, y + 228, "HTML Mode", { size: 12, weight: 600, fill: "#1f86c2", anchor: "middle" });
}
// Couple dashboard, Hari-H tab (dash-hari-h-hp.png), 390x844 at (x, y).
function scanScreen(x, y) {
  const G = "#57a96b";
  return rect(x, y, 390, 844, { fill: "#f3f0eb" }) + rect(x, y, 390, 64, { fill: C.white }) + text(x + 16, y + 29, "Scan tamu", { size: 16, fill: "#0a0a0a" }) + text(x + 16, y + 48, "/" + SLUG, { size: 12, fill: "#666" }) +
    rect(x + 16, y + 80, 358, 40, { r: 20, fill: G }) + text(x + 195, y + 106, "Buka kamera", { size: 15, weight: 700, fill: C.white, anchor: "middle" }) +
    text(x + 20, y + 146, "Atau tempel link tamu", { size: 13, fill: "#555" }) + rect(x + 16, y + 155, 358, 52, { r: 26, fill: C.white }) +
    text(x + 36, y + 187, "https://…?to=Nama&u=KODE", { size: 16, fill: "#8a8a8a" }) + circle(x + 348, y + 181, 20, { fill: G }) + icon("send", x + 348, y + 181, 16, C.white) +
    rect(x, y + 773, 390, 71, { fill: C.white }) + line(x, y + 773.5, x + 390, y + 773.5, { stroke: "#e5e5e5" }) +
    [["Beranda", 36], ["Kirim", 102], ["Tamu", 166], ["Ucapan", 231], ["Hari-H", 296]].map(([l, cx]) => (l === "Hari-H" ? rect(x + 264, y + 784, 64, 32, { r: 16, fill: "#d9fdd3" }) : "") +
      circle(x + cx, y + 800, 8, { stroke: "#0a0a0a", sw: 1.6 }) + text(x + cx, y + 833, l, { size: 12, fill: "#0a0a0a", anchor: "middle" })).join("");
}

// ---- Checklist (journey) screens: one desktop screen, the checklist left, the real screen of the current row right --
// The row being explained and the preview pane are the focus (the other rows stay skeleton, ticks stay green). The
// preview shows the real UI at 1:1; mark and lens point at the element the row is about.
// pv(svg, sx, sy, mark, o): svg in its own coordinates, its point (sx, sy) lands on the pane's inner top-left.
const PANE = { x: 600, y: 40, w: 800, h: 820, pad: 16 };
const pv = (svg, sx, sy, mark, o = {}) => ({ svg, sx, sy, mark, r: o.r ?? 4, more: o.more ?? [], lens: o.lens ?? grow(mark, 24), lensAt: o.lensAt });
function checklist(title, head, sub, rows) {
  const x = 40, w = 520, y0 = 150, n = rows.length, RH = Math.min(96, Math.floor((860 - y0) / n)), bh = RH - 12;
  const base = [rect(0, 0, W, 900, { fill: "#f7f3ef" }), text(x, 78, head, { size: 34, weight: 700, fill: C.cocoa }), text(x, 114, sub, { size: 18, fill: "#6f675f" }),
    rect(PANE.x + 3, PANE.y + 6, PANE.w, PANE.h, { r: 12, fill: "rgba(43,26,7,.08)" }), rect(PANE.x, PANE.y, PANE.w, PANE.h, { r: 12, fill: C.svPreview, stroke: "#e6dcd3" })];
  const els = {}, steps = [];
  const ox = PANE.x + PANE.pad, oy = PANE.y + PANE.pad;
  rows.forEach(([label, caption, p], i) => {
    const y = y0 + i * RH, cy = y + bh / 2, lines = wrap(label, w - 84, 20, 500);
    base.push(rect(x, y, w, bh, { r: 10, fill: C.white, stroke: "#e6dcd3" }) + rect(x + 16, cy - 13, 26, 26, { r: 6, fill: C.white, stroke: "#b9aa9c", sw: 1.5 }) +
      para(x + 60, cy + 7 - (lines.length - 1) * 13, lines, { size: 20, weight: 500, fill: C.cocoa, lh: 26 }));
    els["k" + i] = { svg: rect(x + 16, cy - 13, 26, 26, { r: 6, fill: C.ok }) + `<path d="M${x + 22} ${cy} l5 5 l9 -10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`, enter: "pop", origin: [x + 29, cy] };
    const dx = ox - p.sx, dy = oy - p.sy, sh = (b) => [b[0] + dx, b[1] + dy, b[2], b[3]];
    const marks = [{ box: sh(p.mark), r: p.r }, ...p.more.map(([b, r]) => ({ box: sh(b), r: r ?? 4 }))];
    els["p" + i] = { svg: clipped(PANE.x + 1, PANE.y + 1, PANE.w - 2, PANE.h - 2, group({ transform: `translate(${dx} ${dy})` }, p.svg)), enter: "fade" };
    steps.push({ caption, dur: 3.4, focus: [[x - 4, y - 4, w + 8, bh + 8], [PANE.x, PANE.y, PANE.w, PANE.h]], show: ["k" + i, "p" + i], hide: i ? ["p" + (i - 1)] : [],
      mark: marks, lens: { src: sh(p.lens), at: p.lensAt ?? lensSpot(p.lens, marks.map((m) => m.box)) } });
  });
  return { title, base, els, steps };
}
// Lens inside the pane, clear of the marks: centred in the larger band above or below them, else beside them
// (stage coordinates, scale 2/3).
function lensSpot(src, boxes) {
  const S = 2 / 3, lw = src[2] * 4 / 3, lh = src[3] * 4 / 3, g = 6;
  const m = [Math.min(...boxes.map((b) => b[0])) - g, Math.min(...boxes.map((b) => b[1])) - g, Math.max(...boxes.map((b) => b[0] + b[2])) + g, Math.max(...boxes.map((b) => b[1] + b[3])) + g].map((v) => v * S);
  const P = [PANE.x * S + 8, PANE.y * S + 8, (PANE.x + PANE.w) * S - 8, (PANE.y + PANE.h) * S - 8];
  const cx = Math.min(P[2] - lw, Math.max(P[0], (P[0] + P[2]) / 2 - lw / 2)), cy = Math.min(P[3] - lh, Math.max(P[1], (m[1] + m[3]) / 2 - lh / 2));
  const cands = [[cx, m[3] + 16], [cx, m[1] - 16 - lh], [m[2] + 24, cy], [m[0] - 24 - lw, cy]];
  const ok = (p) => p[0] >= 12 && p[1] >= 12 && p[0] + lw <= 948 && p[1] + lh <= 588 && !(p[0] < m[2] && m[0] < p[0] + lw && p[1] < m[3] && m[1] < p[1] + lh);
  const p = cands.find(ok) ?? cands[0];
  return [+p[0].toFixed(1), +p[1].toFixed(1)];
}
// Preview sources (drawn at 0,0 in their own coordinates).
const edLeft = (inner, o = {}) => clipped(0, o.top ?? 92, 400, 900 - (o.top ?? 92), scalevEditor(0, 0, { tab: o.tab ?? "NikahKit", rail: o.rail ?? "Template" }) + inner);
const PV = {
  dialog: (o, key, lens) => { const d = pinDlg(0, 0, o); return pv(d.svg, -164, -40, d.at[key], { r: key === "bizCard" || key === "licCard" ? 8 : 4, lens: lens?.(d) }); },
  ext: () => pv(extPage(0, 0, { dev: true, card: true }), 360, 120, EXT_CARD, { r: 8, lens: [384, 203, 400, 150] }),
  files: () => pv(explorer(10, 40, 600, 460, { title: "NikahKit", path: "Unduhan › nikahkit-… › NikahKit", side: "Unduhan" }) + NK_FILES.map((f, i) => fileIcon(214 + i * 96, 150, f, i === 0)).join(""),
    -74, -60, SEL(214, 150), { lens: [184, 130, 400, 128] }),
  plans: () => { const t = planDlg(0, 0, 788); return pv(t.svg, 4, 0, [t.col(1), t.t0, t.pc, 170], { r: 4, lens: [t.col(0), t.t0, 3 * t.pc, 168] }); },
  gate: (g, key) => pv(edLeft(g.svg, { tab: "NikahKit", rail: "", top: 44 }), -184, 44, g.at[key], { lens: [0, 44, 400, 240] }),
  template: () => pv(edLeft(templatePanel(0, 0)), -184, 92, TPL_CARD, { lens: [80, 208, 300, 248] })
};

// ---- Scenes ---------------------------------------------------------------------------------------------------------
export const scenes = {
  // Home page overview: eight stops, each with a glimpse of the screen involved.
  "mulai-peta-perjalanan": checklist("Peta perjalanan member NikahKit", "Perjalanan member NikahKit", "Dari gabung sampai jualan, delapan titik.", [
    ["1. Gabung: pilih paket, bayar", "Gabung: pilih paket dan bayar membership di jendela NikahKit.", PV.dialog({ msg: null }, "choose", (d) => [16, d.at.licCard[1], 408, d.at.licCard[3]])],
    ["2. Pasang: ekstensi di Chrome", "Pasang NikahKit di Chrome komputer lewat chrome://extensions.", PV.ext()],
    ["3. Scalev: hubungkan bisnis", "Scalev: hubungkan bisnismu, buat halaman dengan HTML Mode.", pv(lpRowCard(0, 0), -180, -200, [0, 10, 408, 121], { r: 8, lens: [0, 10, 408, 121] })],
    ["4. Buat undangan: template, Konten", "Buat undangan: pilih template, isi Konten, lalu Simpan.", PV.template()],
    ["5. Serahkan: tautan, Dashboard, PIN", "Serahkan ke pasangan: tautan undangan, Dashboard, dan PIN.", pv(pinCard(0, 0), -180, -240, PIN_FIELD, { more: [[PIN_MSG_IC]], lens: [0, 0, 408, 120] })],
    ["6. Tamu: tautan pribadi, RSVP", "Tamu membuka undangan lewat tautan pribadi berisi namanya.", pv(coverAt(0, 0, 195, "Andi"), -189, 0, [75, 512, 240, 30], { lens: [30, 488, 330, 70] })],
    ["7. Hari-H: check-in tamu", "Hari-H: tamu dicatat lewat check-in di Dashboard pasangan.", pv(scanScreen(0, 0), -189, 0, [16, 80, 358, 40], { r: 20, lens: [0, 0, 390, 136] })],
    ["8. Jualan: landing page, pesanan", "Jualan: landing page milikmu, pesanan klien masuk ke NikahKit.", pv(clipped(0, 92, 399, 808, ordersDlg(0, 0)), -184, 92, [16, 196, 367, 50], { lens: [0, 100, 399, 210] })]
  ]),

  // /mulai/alur-lengkap, one checklist per Bagian; rows = the page's step titles.
  "mulai-alur-gabung": checklist("Bagian 1: gabung dan pasang", "Bagian 1: Gabung dan pasang", "Langkah 1 sampai 6.", [
    ["1. Pilih paket membership", "Pilih paket: Bulanan, Tahunan, atau Sekali Bayar.", PV.plans()],
    ["2. Unduh dan ekstrak ZIP NikahKit", "Unduh dan ekstrak ZIP: folder NikahKit berisi manifest.json.", PV.files()],
    ["3. Pasang lewat Load unpacked", "Di chrome://extensions: Developer mode, Load unpacked, folder NikahKit.", PV.ext()],
    ["4. Masuk dengan Google", "Di tab NikahKit editor Scalev, klik Masuk dengan Google.", PV.gate(GATE_OUT(0, 0), "google")],
    ["5. Bayar membership", "Klik Pilih paket, Pilih, bayar di Scalev, lalu Cek pembayaran.",
      PV.dialog({ paid: true, msg: ["Halaman bayar terbuka di tab baru. Setelah bayar, tekan Cek", "pembayaran."] }, "paid", (d) => [16, d.at.licCard[1], 408, d.at.licCard[3]])],
    ["6. Hubungkan bisnis Scalev", "Di kartu Bisnis Scalev, klik Hubungkan bisnis Scalev dan setujui.", PV.dialog({ ...LIC_ON, biz: BIZ, msg: ["Bisnis Scalev terhubung."] }, "bizCard", (d) => d.at.bizCard)]
  ]),
  "mulai-alur-scalev": checklist("Bagian 2: siapkan Scalev", "Bagian 2: Siapkan Scalev", "Langkah 7 sampai 10.", [
    ["7. Pastikan paket Scalev cukup", "Satu undangan memakai satu halaman Scalev. Cek batas halaman paketmu.",
      pv(scalevApp(0, 0, { active: "Landing Pages" }) + lpPage(0), 276, 220, LP_ALL(0), { lens: [281, 260, 500, 180] })],
    ["8. Buat halaman undangan dengan HTML Mode", "Buat Landing Page HTML Mode, isi slug di Settings, lalu Simpan.",
      pv(edLeft(settingsPanel(0), { tab: "Settings", top: 44 }), -184, 44, SLUG_FIELD(0), { lens: [16, 240, 368, 90] })],
    ["9. Pahami Simpan dan Simpan & Terbitkan", "Simpan menyimpan halaman. Simpan & Terbitkan menayangkannya ke tamu.",
      pv(scalevEditor(0, 0, { tab: "NikahKit" }) + nkOpen(0) + coverAt(727, 106, 922, "Tamu Undangan"), 672, 0, [1193, 50, 241, 34], { lens: [1180, 40, 260, 56] })],
    ["10. Atur alamat dan izin domain", "Atur alamat di Settings dan izin domain di tab Security.",
      pv(edLeft("", { tab: "Security", rail: "", top: 44 }), -184, 44, [107, 57, 169 + tw("Settings", 12, 500) + 2 - 107, 18], { lens: [0, 44, 340, 48] })]
  ]),
  "mulai-alur-undangan": checklist("Bagian 3: buat undangan", "Bagian 3: Buat undangan", "Langkah 11 sampai 15.", [
    ["11. Kenali editor NikahKit", "Rail kiri: Template, Gaya, Audio, Media, Lapisan, Konten.", pv(edLeft(templatePanel(0, 0)), -184, 92, [0, 104, 72, 332], { lens: [0, 100, 150, 340] })],
    ["12. Pilih template", "Pilih template di panel Template.", PV.template()],
    ["13. Isi Konten", "Isi Konten: mulai dari sampul, mempelai, dan acara.", pv(edLeft(konten(0, 0), { rail: "Konten" }), -184, 92, [88, 169, 279, 166], { lens: [80, 160, 296, 182] })],
    ["14. Rapikan foto, musik, gaya, dan lapisan", "Rapikan lewat Gaya, Audio, Media, dan Lapisan di rail kiri.", pv(edLeft(templatePanel(0, 0)), -184, 92, [0, 160, 72, 220], { lens: [0, 150, 150, 240] })],
    ["15. Simpan & Terbitkan", "Tekan Simpan & Terbitkan supaya tamu melihat versi terbaru.",
      pv(scalevEditor(0, 0, { tab: "NikahKit" }) + nkOpen(0) + coverAt(727, 106, 922, "Tamu Undangan"), 672, 0, [1283, 50, 151, 34], { lens: [1180, 40, 260, 56] })]
  ]),
  "mulai-alur-serahkan": checklist("Bagian 4: bagikan dan serahkan", "Bagian 4: Bagikan dan serahkan", "Langkah 16 sampai 20.", [
    ["16. Cek tampilan tamu lewat Bagikan", "Bagikan: isi nama tamu, lalu klik Lihat sebagai tamu.", pv(edLeft(shareDlg(0)), -184, 92, SHARE_VIEW(0), { lens: [8, 170, 384, 200] })],
    ["17. Pasang Dashboard pasangan milikmu (sekali saja)", "Template > Marketing: pasang Dashboard pasangan, sekali saja.",
      pv(edLeft(marketing(0, 0)), -184, 92, [88, 279, 134, 167], { lens: [80, 270, 150, 270] })],
    ["18. Buat PIN dashboard", "Buat PIN dashboard di jendela NikahKit.", pv(pinCard(0, 0), -180, -240, PIN_FIELD, { lens: [0, 0, 408, 120] })],
    ["19. Serahkan ke pasangan", "Salin pesan untuk pengantin, kirim lewat WhatsApp.", pv(pinCard(0, 0), -180, -240, PIN_MSG_IC, { more: [[PIN_COPIED]], lens: [0, 50, 408, 160] })],
    ["20. Siapkan hari-H (opsional)", "Hari-H: tamu di-check-in dari Dashboard pasangan.", pv(scanScreen(0, 0), -189, 0, [16, 80, 358, 40], { r: 20, lens: [0, 0, 390, 136] })]
  ]),
  "mulai-alur-jualan": checklist("Bagian 5: jualan", "Bagian 5: Jualan", "Langkah 21 sampai 24.", [
    ["21. Isi Profil merek", "Template > Marketing: isi Profil merek, nama bisnis dan WhatsApp.", pv(edLeft(marketing(0, 0, { open: true })), -184, 92, [88, 217, 279, 380], { lens: [88, 260, 279, 140] })],
    ["22. Pasang Landing page jualan", "Pasang Landing page dari kartu Landing page di Marketing.", pv(edLeft(marketing(0, 0)), -184, 92, [234, 279, 134, 167], { lens: [226, 270, 150, 306] })],
    ["23. Bagikan form data klien dan proses Pesanan masuk", "Kirim link form ke klien. Pesanannya masuk ke Pesanan masuk.",
      pv(clipped(0, 92, 399, 808, ordersDlg(0, 0, { link: true })), -184, 92, [32, 360, tw("Salin link form", 12, 500) + 44, 36], { lens: [16, 254, 367, 160] })],
    ["24. Ikuti alur kerja dengan klien", "Tempel data pesanan dari WhatsApp klien, lalu klik Isi undangan.",
      pv(clipped(0, 92, 399, 808, ordersDlg(0, 0, { paste: true })), -184, 92, nkBtnBox(32, 362, "Isi undangan"), { lens: [16, 196, 367, 214] })]
  ]),

  // Istilah: ID undangan (address bar), slug (Settings), tab NikahKit, then the terms (guide card over the preview).
  "mulai-istilah-alamat": (() => {
    const urlX = 166 + tw("app.scalev.com/pages/", 14), idBox = [urlX - 2, 54, tw(ID, 14) + 4, 18];
    const nk = clipped(...LEFT, scalevEditor(0, CT, { tab: "NikahKit", rail: "Template" }) + templatePanel(0, CT));
    const CARD = [452, CT + 120, 960, 360], cx = CARD[0] + 28, cy = CARD[1];
    const terms = guideCard(...CARD, "Alamat umum: domain atau subdomain, lalu slug") + text(cx, cy + 86, "https://tokomu.myscalev.com/" + SLUG, { size: 26, fill: C.cocoa }) +
      text(cx, cy + 138, "Tautan pribadi: alamat umum ditambah ?to=Nama", { size: 22, weight: 700, fill: C.accent }) +
      rich(cx, cy + 178, [["https://tokomu.myscalev.com/" + SLUG], ["?to=Andi", 700, C.accent]], { size: 26, fill: C.cocoa });
    const keys = text(cx, cy + 236, "Untuk masuk Dashboard pasangan", { size: 22, weight: 700, fill: C.accent }) +
      rich(cx, cy + 276, [["PIN dashboard", 700], [": pasangan, pemilik undangan"]], { size: 22, fill: C.cocoa }) +
      rich(cx, cy + 312, [["Kode staff", 700], [": penerima tamu, khusus Tahunan dan Sekali Bayar"]], { size: 22, fill: C.cocoa });
    return {
      title: "ID undangan, slug, alamat, dan tautan pribadi",
      base: [win({ tabs: [TAB_ED], url: URL }), editor("Code")],
      els: {
        settings: { svg: clipped(...LEFT, scalevEditor(0, CT, { tab: "Settings" }) + settingsPanel(CT)), enter: "fade" },
        nk: { svg: nk, enter: "fade", skel: true },
        terms: { svg: terms, enter: "pop", origin: mid(CARD) }, keys
      },
      steps: [
        { caption: "Buka halaman di editor Scalev. Angka di alamat adalah ID undangan.", focus: [TOOLBAR], at: mid(idBox), mark: { box: idBox, r: 3 }, lens: { src: [130, 46, 330, 36] }, dur: 3.6 },
        { caption: "Klik tab Settings di editor Scalev.", focus: [LEFT], at: [191, CT + 66], click: true, show: ["settings"], mark: tabBox("Settings", 169, false), lens: { src: [0, CT + 44, 330, 48] } },
        { caption: "Kolom Slug URL berisi slug, bagian akhir alamat: rani-dimas.", mark: SLUG_FIELD(CT), lens: { src: [16, CT + 240, 368, 90] }, dur: 3.6 },
        { caption: "Klik tab NikahKit.", at: TAB_NK, click: true, hide: ["settings"], show: ["nk"], mark: TAB_NK_BOX, lens: { src: [0, CT + 44, 330, 48] }, dur: 3 },
        { caption: "Rail kiri: Template, Gaya, Audio, Media, Lapisan, Konten.", mark: [0, CT + 104, 72, 332], lens: { src: [0, CT + 100, 150, 340], at: [296, 70] }, dur: 3.6 },
        { caption: "Cocokkan istilah: alamat umum, lalu tautan pribadi berisi nama tamu.", focus: [CARD], show: ["terms"], dur: 4 },
        { caption: "PIN dashboard untuk pasangan, kode staff untuk penerima tamu.", show: ["keys"], dur: 3.8 }
      ]
    };
  })(),

  // Pasang bagian 1: pasang.html, unduh, ikon unduhan, folder Unduhan, ekstrak (Windows, Mac), isi folder, pindah ke Dokumen.
  "gabung-ekstrak-zip": (() => {
    const PURL = "assets.nikahin.workers.dev/brand-assets/nikahkit/pasang.html";
    // pasang.html at 1440 x 815 (measured): main 160..1280; title + download button row; steps list beside the player.
    const y = CT, DL = [1014, y + 65, 237, 52];
    const LI = [[201, 100], [307, 100], [413, 79], [498, 100], [605, 100], [711, 100]];
    const ST = [["Unduh dan ekstrak", "Windows: klik kanan ZIP, Extract All.", "Mac: klik dua kali."], ["Buka chrome://extensions", "Ketik di kolom alamat Chrome, lalu", "Enter."],
      ["Nyalakan Developer mode", "Tombol geser di kanan atas."], ["Klik Load unpacked", "Pilih folder NikahKit yang berisi", "manifest.json, lalu Select."],
      ["NikahKit terpasang", "Jangan hapus atau pindahkan", "foldernya."], ["Masuk di editor Scalev", "Halaman HTML Mode, tab NikahKit,", "Masuk dengan Google."]];
    let page = rect(0, y, W, VIEW, { fill: C.white }) + text(160, y + 104, "Cara pasang NikahKit", { size: 60, fill: C.cocoa, font: SERIF }) +
      text(160, y + 148, "Untuk Google Chrome di komputer Windows atau Mac.", { size: 18, fill: "#6f675f" }) +
      text(1014, y + 148, "Rilis", { size: 18, fill: "#6f675f" }) + rect(1062, y + 136, 92, 12, { r: 6, fill: "#e6e1dc" }) + text(1280, y + 148, "· ZIP ±120 KB", { size: 18, fill: "#6f675f", anchor: "end" }) +
      rect(...DL, { r: 16, fill: C.cocoa }) + text(1038, y + 97, "Unduh NikahKit", { size: 16, weight: 800, fill: C.white }) + rect(1169, y + 87, 52, 9, { r: 4.5, fill: "rgba(255,255,255,.35)" });
    ST.forEach(([b, ...t], i) => {
      const top = y + LI[i][0];
      if (i === 0) page += rect(160.5, top + 0.5, 319, LI[i][1] - 1, { r: 12, fill: "#f6efe9", stroke: C.cocoa });
      page += circle(190, top + 30, 15, i === 0 ? { fill: C.cocoa } : { stroke: "#6f675f", sw: 1.5 }) + text(190, top + 35, String(i + 1), { size: 14, weight: 800, fill: i === 0 ? C.white : "#6f675f", anchor: "middle" }) +
        text(217, top + 32, b, { size: 17, weight: 700, fill: C.cocoa }) + para(217, top + 56, t, { size: 14.5, fill: "#6f675f", lh: 21 });
    });
    page += rect(508.5, y + 201.5, 771, 482, { r: 16, fill: C.white, stroke: "#d9d3cd" }) + clipped(509, y + 202, 770, 481, rect(509, y + 202, 770, 32, { fill: "#dee1e6" }) +
      rect(518, y + 207, 185, 27, { r: 6, fill: C.white }) + text(530, y + 224, "Tab baru", { size: 11, fill: "#3c4043" }) + [528, 550, 572].map((dx) => circle(dx, y + 250, 5, { fill: "#c4c7c5" })).join("") +
      rect(597, y + 239, 594, 22, { r: 11, fill: "#f1f3f4" }) + line(509, y + 266.5, 1279, y + 266.5, { stroke: "#e3e3e3" }) + text(541, y + 300, "Tab baru", { size: 12, fill: "#5f6368" })) +
      rect(1155, y + 650, 112, 23, { r: 6, fill: "rgba(255,255,255,.9)" }) + text(1163, y + 666, "Simulasi tampilan", { size: 12, fill: "#5f6368" });
    const DLI = [1300, 63], DLI_BOX = [1286, 49, 28, 28];
    const dlIcon = rect(1270, 44, 62, 38, { fill: C.white }) + rect(1244, 46, 34, 34, { r: 17, fill: C.crOmni }) + iconX("download", DLI[0], DLI[1], 18, C.crBlue) + circle(DLI[0], DLI[1], 14, { stroke: C.crBlue, sw: 2 });
    const BX = 1052, FOLDER = [BX + 310, 128], FOLDER_BOX = [BX + 299, 117, 22, 22];
    const bubble = shadow(BX, 90, 340, 76, 10, 2) + rect(BX, 90, 340, 76, { r: 10, fill: C.white }) + rect(BX + 20, 111, 28, 34, { r: 4, fill: "#e8eaed", stroke: "#c4c7c5" }) +
      text(BX + 62, 124, "nikahkit-….zip", { size: 14, fill: C.crText }) + text(BX + 62, 144, "120 KB", { size: 13, fill: C.crSub }) + iconX("folder", FOLDER[0], FOLDER[1], 18, C.crIcon);
    const EX = 200, EY = 150, EW = 1040, EH = 620, IX = EX + 220, IY = EY + 110, menuY = IY + 40, XWIN = [EX, EY, EW, EH];
    const content = (path) => rect(EX + 181, EY + 81, EW - 182, EH - 82, { fill: C.white }) + rect(EX + 72, EY + 44, EW - 92, 28, { r: 4, fill: C.white, stroke: "#dcdcdc" }) + text(EX + 84, EY + 63, path, { size: 13, fill: "#1f1f1f" });
    const EXTRACT = [EX + 520, EY + 368, 96, 32], MENU_ROW = [IX + 76, menuY + 46, 208, 30], MAC = [EX + 240, EY + 400, 640, 110];
    return {
      title: "Mengunduh dan mengekstrak ZIP NikahKit",
      base: [win({ tabs: [{ title: "Cara pasang NikahKit · Nikahin", active: true }], url: PURL }), page],
      els: {
        dlIcon: { svg: dlIcon, enter: "pop", origin: DLI },
        bubble: { svg: bubble, enter: "pop", origin: [DLI[0], 90] },
        files: { svg: explorer(EX, EY, EW, EH, { title: "Unduhan", path: "Unduhan", side: "Unduhan" }) + zipIcon(IX, IY, "nikahkit-….zip", true), enter: "pop", origin: mid(XWIN) },
        menu: { svg: shadow(IX + 70, menuY, 220, 168, 6, 2) + rect(IX + 70, menuY, 220, 168, { r: 6, fill: C.white, stroke: "#dcdcdc" }) + rect(...MENU_ROW, { r: 4, fill: "#e5eefb" }) +
          [0, 2, 3, 4].map((k) => rect(IX + 92, menuY + 16 + k * 32, [90, 0, 120, 70, 100][k], 9, { r: 4, fill: BAR })).join("") + text(IX + 92, menuY + 66, "Extract All...", { size: 13, fill: "#1f1f1f", weight: 500 }), enter: "pop", origin: [IX + 70, menuY] },
        extract: { svg: shadow(EX + 160, EY + 120, 580, 300, 8, 3) + rect(EX + 160, EY + 120, 580, 300, { r: 8, fill: C.white, stroke: "#cfd3d8" }) + text(EX + 184, EY + 156, "Extract Compressed (Zipped) Folders", { size: 15, weight: 500, fill: "#1f1f1f" }) +
          rect(EX + 184, EY + 196, 532, 32, { r: 4, fill: C.white, stroke: "#9aa0a6" }) + text(EX + 196, EY + 217, "C:\\Users\\Rina\\Downloads\\nikahkit-…", { size: 13, fill: "#1f1f1f" }) +
          rect(...EXTRACT, { r: 4, fill: "#0067c0" }) + text(EX + 568, EY + 389, "Extract", { size: 13, weight: 500, fill: C.white, anchor: "middle" }) +
          rect(EX + 624, EY + 368, 92, 32, { r: 4, fill: C.white, stroke: "#c4c7c5" }) + text(EX + 670, EY + 389, "Cancel", { size: 13, fill: "#1f1f1f", anchor: "middle" }), enter: "pop", origin: [EX + 450, EY + 270] },
        outer: { svg: folderIcon(IX + 160, IY + 4, "nikahkit-…", true) + rect(IX - 24, IY - 10, 112, 116, { fill: C.white }) + zipIcon(IX, IY, "nikahkit-….zip", false), enter: "pop", origin: [IX + 192, IY + 40] },
        inside: { svg: content("Unduhan › nikahkit-…") + folderIcon(IX, IY + 4, "NikahKit", true), enter: "fade" },
        mac: { svg: guideCard(...MAC) + text(MAC[0] + 28, MAC[1] + 44, "Mac: klik dua kali file ZIP.", { size: 20, weight: 700, fill: C.cocoa }) +
          text(MAC[0] + 28, MAC[1] + 78, "Folder NikahKit langsung muncul di folder Unduhan.", { size: 20, fill: C.cocoa }), enter: "pop", origin: mid(MAC) },
        nkFiles: { svg: content("Unduhan › nikahkit-… › NikahKit") + NK_FILES.map((f, i) => fileIcon(IX + i * 120, IY, f, i === 0)).join("") + text(IX + 4 * 120 + 32, IY + 50, "…", { size: 20, fill: "#9aa0a6", anchor: "middle" }), enter: "fade" },
        moved: { svg: explorer(EX, EY, EW, EH, { title: "Dokumen", path: "Dokumen", side: "Dokumen" }) + DOC_FOLDERS.map((f, i) => folderIcon(IX + i * 120, IY + 4, f, f === "NikahKit")).join(""), enter: "fade" }
      },
      steps: [
        { caption: "Buka halaman Cara pasang NikahKit di Chrome komputer.", focus: [TOOLBAR, [140, CT + 40, 1160, 140]], at: mid(urlBox(PURL)), mark: { box: urlBox(PURL), r: 3 }, lens: { src: [150, 46, 480, 36], at: [120, 200] }, dur: 3 },
        { caption: "Klik Unduh NikahKit. Chrome mengunduh ZIP NikahKit, sekitar 120 KB.", focus: [[990, CT + 50, 310, 120], [1230, 41, 210, 44]], at: mid(DL), click: true, show: ["dlIcon"], mark: { box: DL, r: 16 }, lens: { src: [1004, CT + 55, 290, 110] }, dur: 3.4 },
        { caption: "Buka folder Unduhan: klik ikon unduhan di kanan atas Chrome.", focus: [[1030, 41, 410, 135]], at: DLI, click: true, show: ["bubble"], mark: { box: DLI_BOX, r: 14 }, lens: { src: [1040, 44, 380, 126] } },
        { caption: "Klik ikon folder di sebelah nama file. Folder Unduhan terbuka.", focus: [[1030, 41, 410, 135], XWIN], at: FOLDER, click: true, show: ["files"], mark: FOLDER_BOX, lens: { src: [1060, 96, 330, 64] }, dur: 3.4 },
        { caption: "Ekstrak ZIP (Windows): klik kanan file ZIP.", focus: [XWIN], at: [IX + 32, IY + 36], click: true, hide: ["bubble"], show: ["menu"], mark: SEL(IX, IY), lens: { src: [IX - 30, IY - 16, 340, 224] } },
        { caption: "Pilih Extract All... (di Windows Indonesia: Ekstrak Semua...).", at: mid(MENU_ROW), click: true, hide: ["menu"], show: ["extract"], mark: MENU_ROW, note: "Extract All..." },
        { caption: "Klik Extract. Muncul folder bernama sama dengan ZIP.", at: mid(EXTRACT), click: true, hide: ["extract"], show: ["outer"], mark: EXTRACT, note: "Extract" },
        { caption: "Buka folder itu. Di dalamnya ada folder NikahKit.", at: [IX + 192, IY + 40], click: true, show: ["inside"], mark: SEL(IX + 160, IY), lens: { src: [IX - 30, IY - 16, 340, 130] } },
        { caption: "Mac: cukup klik dua kali file ZIP. Folder NikahKit langsung muncul.", focus: [MAC], show: ["mac"], dur: 3.4 },
        { caption: "Buka folder NikahKit: harus ada manifest.json, nk-bg.js, pin.html.", focus: [XWIN], at: [IX + 32, IY + 40], click: true, hide: ["mac"], show: ["nkFiles"], mark: SEL(IX, IY), lens: { src: [IX - 30, IY - 16, 520, 130] }, dur: 3.6 },
        { caption: "Seret folder NikahKit ke Dokumen. Jangan disimpan di Unduhan.", at: mid(sideRow(EX, EY, 1)), click: true, show: ["moved"], mark: sideRow(EX, EY, 1), lens: { src: [EX, EY + 81, 300, 120] }, dur: 3.6 }
      ]
    };
  })(),

  // Pasang bagian 2: chrome://extensions, Mode developer, Muat yang belum dibuka, pilih folder, kartu, sematkan.
  "pasang-load-unpacked": (() => {
    const url = "chrome://extensions", dev = devBtnRects(0, CT), TOG = [W - 43, CT + 19, 36, 18];
    const PW = 760, PH = 470, PX = (W - PW) / 2, PY = CT + 130, ROW = [PX + 200, PY + 122, PW - 216, 30], SELECT = [PX + PW - 120, PY + PH - 48, 100, 32];
    const row = (ry, label, sel) => (sel ? rect(PX + 200, ry, PW - 216, 30, { r: 5, fill: "#d3e3fd" }) : "") + iconX("folder", PX + 222, ry + 15, 16, "#e5a531") + text(PX + 242, ry + 20, label, { size: 13, fill: "#1f1f1f", weight: sel ? 600 : undefined });
    const picker = shadow(PX, PY, PW, PH, 10, 4) + rect(PX, PY, PW, PH, { r: 10, fill: C.white, stroke: "#cfd3d8" }) + rect(PX, PY, PW, 44, { r: 10, fill: "#f3f3f3" }) + rect(PX, PY + 34, PW, 10, { fill: "#f3f3f3" }) +
      text(PX + PW / 2, PY + 27, "Pilih folder ekstensi", { size: 13, weight: 600, fill: "#333", anchor: "middle" }) + line(PX, PY + 44.5, PX + PW, PY + 44.5, { stroke: "#e3e3e3" }) +
      rect(PX, PY + 45, 184, PH - 45 - 64, { fill: "#f6f6f6" }) + ["Desktop", "Dokumen", "Unduhan"].map((n, i) => (n === "Dokumen" ? rect(PX + 8, PY + 58 + i * 32, 168, 28, { r: 5, fill: "#e4e4e4" }) : "") + iconX("folder", PX + 26, PY + 72 + i * 32, 15, "#5e8fd8") + text(PX + 44, PY + 77 + i * 32, n, { size: 13, fill: "#1f1f1f" })).join("") +
      text(PX + 204, PY + 74, "Dokumen", { size: 12, weight: 600, fill: "#5e5e5e" }) + DOC_FOLDERS.map((f, i) => row(PY + 88 + i * 34, f, false)).join("") +
      line(PX, PY + PH - 64.5, PX + PW, PY + PH - 64.5, { stroke: "#e3e3e3" }) +
      rect(PX + PW - 232, PY + PH - 48, 100, 32, { r: 6, fill: C.white, stroke: "#c4c7c5" }) + text(PX + PW - 182, PY + PH - 27, "Batal", { size: 13, fill: "#1f1f1f", anchor: "middle" }) +
      rect(...SELECT, { r: 6, fill: "#0a7cff" }) + text(PX + PW - 70, PY + PH - 27, "Select", { size: 13, weight: 600, fill: C.white, anchor: "middle" });
    const PUZ = [W - 100, 63], MX = W - 400, PINAT = [MX + 272, 152], CARD = [376, CT + 165, 416, 252];
    const TOGR = [1150, CT, 290, 60], DEVR = [0, CT + 56, 620, 56], MENUR = [1020, 0, 420, 290];
    const extTop = crTop({ tabs: [{ title: "Ekstensi", active: true, fav: favChrome }], url });
    return {
      title: "Memasang NikahKit lewat Muat yang belum dibuka",
      base: [win({ tabs: [{ title: "Tab baru", active: true }] })],
      els: {
        typed: text(166, 68, url, { size: 14, fill: C.crText }),
        page: { svg: extTop + extPage(0, CT), enter: "fade", delay: 1.3, skel: true },
        devPage: { svg: extTop + extPage(0, CT, { dev: true }), enter: "fade", skel: true },
        picker: { svg: rect(0, CT, W, VIEW, { fill: "rgba(0,0,0,.32)" }) + picker, enter: "pop", origin: [PX + PW / 2, PY + PH / 2] },
        rowSel: row(PY + 122, "NikahKit", true),
        card: extCard(0, CT),
        menu: { svg: shadow(MX, 80, 340, 190, 10, 3) + rect(MX, 80, 340, 190, { r: 10, fill: C.white }) + text(MX + 22, 114, "Ekstensi", { size: 15, weight: 500, fill: C.crText }) +
          nkLogo(MX + 32, 152, 20) + text(MX + 54, 157, "NikahKit", { size: 13, fill: C.crText }) + pinIc(PINAT[0], 152, 17, C.crIcon) + iconX("more-vertical", MX + 310, 152, 17, C.crIcon) +
          line(MX, 196, MX + 340, 196, { stroke: "#e3e3e3" }) + iconX("settings", MX + 32, 232, 17, C.crIcon) + text(MX + 54, 237, "Kelola ekstensi", { size: 13, fill: C.crText }), enter: "pop", origin: [PUZ[0], 80] },
        pinOn: { svg: rect(PINAT[0] - 12, 140, 24, 24, { r: 12, fill: C.crBlueSoft }) + pinIc(PINAT[0], 152, 17, C.crBlue) + rect(W - 168, 44, 50, 38, { fill: C.white }) + rect(W - 196, 46, 34, 34, { r: 17, fill: C.crOmni }) + nkLogo(W - 140, 63, 18), enter: "fade" }
      },
      steps: [
        { caption: "Klik kolom alamat Chrome, ketik chrome://extensions, lalu tekan Enter.", focus: [TOOLBAR], at: [300, 63], click: true, type: [{ id: "typed", n: url.length, box: [166, 52, tw(url, 14), 22] }],
          show: ["typed", "page"], mark: { box: [124, 46, 1184, 34], r: 17 }, lens: { src: [124, 41, 330, 44] }, dur: 3.6 },
        { caption: "Nyalakan Developer mode (Mode developer) di kanan atas sampai biru.", focus: [TOGR, DEVR], at: mid(TOG), click: true, show: ["devPage"], mark: { box: TOG, r: 9 }, lens: { src: [1170, CT + 6, 266, 44] } },
        { caption: "Klik Load unpacked (Muat yang belum dibuka). Pemilih folder terbuka.", focus: [[PX, PY, PW, PH]], at: mid(dev[0]), click: true, show: ["picker"], mark: { box: dev[0], r: 18 }, note: "Muat yang belum dibuka", dur: 3.4 },
        { caption: "Di Dokumen, klik sekali folder NikahKit (berisi manifest.json).", focus: [[PX, PY, PW, PH]], at: [PX + 280, PY + 137], click: true, show: ["rowSel"], mark: { box: ROW, r: 5 }, lens: { src: [PX + 190, PY + 56, 330, 104] }, dur: 3.6 },
        { caption: "Klik Select. Chrome memasang NikahKit dari folder itu.", focus: [CARD], at: mid(SELECT), click: true, hide: ["picker", "rowSel"], show: ["card"], mark: { box: SELECT, r: 6 }, note: "Select" },
        { caption: "Kartu NikahKit muncul dengan sakelar biru menyala.", focus: [CARD], mark: { box: [384 + 353, CT + 203 + 175, 36, 18], r: 9 }, lens: { src: [384, CT + 362, 400, 56] }, dur: 3.4 },
        { caption: "Sematkan (opsional): klik ikon puzzle di kanan atas Chrome.", focus: [MENUR], at: PUZ, click: true, show: ["menu"], mark: { box: [PUZ[0] - 13, 50, 26, 26], r: 13 }, lens: { src: [1040, 44, 400, 140], at: [300, 330] } },
        { caption: "Klik ikon pin di samping NikahKit. Ikonnya tampil di toolbar.", at: PINAT, click: true, show: ["pinOn"], mark: { box: [PINAT[0] - 12, 140, 24, 24], r: 12 }, lens: { src: [1040, 44, 400, 140], at: [300, 330] }, dur: 3.4 }
      ]
    };
  })(),

  // Pasang bagian 3: app.scalev.com, Landing Pages, halaman HTML Mode, tab NikahKit, panel Masuk ke NikahKit.
  "gabung-tab-nikahkit-muncul": (() => {
    const g = GATE_OUT(0, CT), lp = svMenuAt("Landing Pages"), LPROW = [24, CT + lp[1] - 14, 216, 28];
    const home = scalevApp(0, CT, { active: "Home" }) + rect(256, CT, 1184, 900, { fill: SV.bg }) + rect(256, CT, 1184, 70, { fill: C.white }) + line(256, CT + 70.5, W, CT + 70.5, { stroke: SV.line }) +
      text(280, CT + 43, "Home", { size: 18, weight: 600, fill: SV.ink }) + [0, 1, 2].map((i) => rect(280.5 + i * 380, CT + 94.5, 363, 119, { r: 6, fill: C.white, stroke: SV.line }) + bars(300 + i * 380, CT + 118, [120, 220, 160], 34)).join("") +
      rect(280.5, CT + 238.5, 1123, 379, { r: 6, fill: C.white, stroke: SV.line }) + bars(304, CT + 274, [520, 380, 600, 300, 460, 340], 52);
    const ROW0 = [521, CT + 331, 879, 71];
    return {
      title: "Tab NikahKit muncul di editor Scalev",
      base: [win({ tabs: [TAB_ED], url: URL }), scalevEditor(0, CT, { tab: "Code" })],
      els: {
        dash: { svg: crTop({ tabs: [{ title: "Scalev", active: true, fav: favScalev }], url: "app.scalev.com" }) + vp(home), skel: true },
        list: { svg: vp(scalevApp(0, CT, { active: "Landing Pages" }) + lpPage(CT)), enter: "fade", skel: true },
        gate: { svg: gateEl(g), enter: "fade" }
      },
      steps: [
        { caption: "Buka app.scalev.com. Editor sudah terbuka? Muat ulang dengan F5.", focus: [TOOLBAR], at: [330, 63], mark: { box: urlBox("app.scalev.com"), r: 3 }, lens: { src: [124, 44, 300, 40] }, dur: 3 },
        { caption: "Klik menu Landing Pages. Daftar halamanmu tampil.", focus: [LPROW, [256, CT, 1184, 420]], at: [lp[0], CT + lp[1]], click: true, show: ["list"], mark: LPROW, lens: { src: [0, CT + 190, 260, 90] } },
        { caption: "Klik halaman undangan yang memakai HTML Mode. Editor terbuka.", focus: [TOP], at: mid(LP_NAME(CT)), click: true, hide: ["dash", "list"], mark: LP_NAME(CT), note: PAGE, dur: 3.4 },
        { caption: "Klik tab NikahKit di samping Settings.", focus: [LEFT], at: TAB_NK, click: true, show: ["gate"], mark: TAB_NK_BOX, lens: { src: [0, CT + 44, 400, 230] } },
        { caption: "Panel menampilkan Masuk ke NikahKit. dan tombol Masuk dengan Google.", mark: g.at.google, lens: { src: [0, CT + 160, 330, 120] }, dur: 3.6 }
      ]
    };
  })(),

  // Masuk dengan Google: editor, tab NikahKit, jendela NikahKit, jendela Google, masuk berhasil.
  "gabung-masuk-google": (() => {
    const g = GATE_OUT(0, CT);
    const chk = dlg({ state: "checking", msg: null }), out = dlg({ state: "out", msg: null, gDisabled: true }), inn = dlg({});
    const GX = 880, GY = 130, GW = 440, GH = 560, ACCT = [GX + 32, GY + 204, GW - 64, 66];
    const google = popup(GX, GY, GW, GH, "accounts.google.com") + gLogo(GX + 32, GY + 70, 24) + text(GX + 32, GY + 140, "Pilih akun", { size: 26, fill: "#1f1f1f" }) +
      line(GX + 32, GY + 200.5, GX + GW - 32, GY + 200.5, { stroke: "#e3e3e3" }) + circle(GX + 52, GY + 236, 16, { fill: "#7cacf8" }) + text(GX + 52, GY + 241, "R", { size: 14, weight: 600, fill: C.white, anchor: "middle" }) +
      text(GX + 80, GY + 231, "Rina WO", { size: 14, weight: 500, fill: "#1f1f1f" }) + text(GX + 80, GY + 250, EMAIL, { size: 12, fill: C.crSub }) + line(GX + 32, GY + 272.5, GX + GW - 32, GY + 272.5, { stroke: "#e3e3e3" }) +
      circle(GX + 52, GY + 304, 14, { stroke: C.crSub }) + text(GX + 80, GY + 309, "Gunakan akun lain", { size: 14, weight: 500, fill: "#1f1f1f" }) + line(GX + 32, GY + 336.5, GX + GW - 32, GY + 336.5, { stroke: "#e3e3e3" });
    return {
      title: "Masuk ke NikahKit dengan akun Google",
      base: [win({ tabs: [TAB_ED], url: URL }), editor("Code")],
      els: {
        gate: { svg: gateEl(g), enter: "fade", skel: true },
        dim: { svg: DIM, enter: "fade" },
        chk: { svg: chk.svg, enter: "pop", origin: mid(chk.box) },
        out: { svg: out.svg, enter: "fade", delay: 1 },
        google: { svg: google, enter: "pop", origin: [GX + GW / 2, GY + GH / 2], delay: 1.1 },
        inn: { svg: inn.svg, enter: "fade" }
      },
      steps: [
        { caption: "Buka editor halaman Scalev yang memakai HTML Mode.", focus: [TOOLBAR, [0, CT, W, 44]], at: mid(urlBox(URL)), mark: { box: urlBox(URL), r: 3 }, lens: { src: [0, 44, 480, 88] }, dur: 3 },
        { caption: "Klik tab NikahKit. Panel menampilkan Masuk ke NikahKit.", focus: [LEFT], at: TAB_NK, click: true, show: ["gate"], mark: TAB_NK_BOX, lens: { src: [0, CT + 44, 400, 230] } },
        { caption: "Klik Masuk dengan Google. Memeriksa login..., lalu jendela Google terbuka.", focus: "none", at: mid(g.at.google), click: true,
          show: ["dim", "chk", "out", "google"], mark: g.at.google, lens: { src: [0, CT + 160, 330, 120] }, dur: 4 },
        { caption: "Pilih akun Google: klik akunmu. Jendela Google menutup sendiri.", focus: "none", at: mid(ACCT), click: true, hide: ["google", "chk", "out"], show: ["inn"],
          mark: ACCT, note: "Rina WO", dur: 3.6 },
        { caption: "Lihat jendela NikahKit: email Google-mu, Keluar, kartu Paket dan Bisnis.", focus: [inn.box], mark: inn.at.email, lens: { src: [inn.X, inn.Y + 50, 440, 200] }, dur: 3.6 },
        { caption: "Di bawah kartu tertulis Sudah masuk. Kembali ke editor Scalev.", mark: inn.at.msg, lens: { src: [inn.X, inn.at.msg[1] - 12, 440, 62] }, dur: 3.4 }
      ]
    };
  })(),

  // Pilih paket (steps): editor, tab NikahKit, Pilih paket di panel, kartu Paket, tabel, Pilih.
  "gabung-pilih-paket": (() => {
    const g = GATE_NONE(0, CT), d0 = dlg({}), t = table();
    return {
      title: "Membuka tabel Pilih paket di NikahKit",
      base: [win({ tabs: [TAB_ED], url: URL }), editor("Code")],
      els: {
        gate: { svg: gateEl(g), enter: "fade", skel: true },
        dim: { svg: DIM, enter: "fade" },
        d0: { svg: d0.svg, enter: "pop", origin: mid(d0.box) },
        table: { svg: t.svg, enter: "pop", origin: mid(t.box) },
        pay: { svg: payTab(), enter: "fade", skel: true }
      },
      steps: [
        { caption: "Buka editor halaman Scalev yang memakai HTML Mode.", focus: [TOOLBAR, [0, CT, W, 44]], at: mid(urlBox(URL)), mark: { box: urlBox(URL), r: 3 }, lens: { src: [0, 44, 480, 88] }, dur: 3 },
        { caption: "Klik tab NikahKit di samping Settings. Panel NikahKit terbuka.", focus: [LEFT], at: TAB_NK, click: true, show: ["gate"], mark: TAB_NK_BOX, lens: { src: [0, CT + 44, 400, 230] } },
        { caption: "Akun belum berlangganan? Klik Pilih paket. Muncul kartu Paket.", focus: [d0.box], at: mid(g.at.choose), click: true, show: ["dim", "d0"],
          mark: g.at.choose, lens: { src: [0, CT + 160, 330, 120] }, dur: 3.4 },
        { caption: "Klik Pilih paket di kartu Paket. Tabel Pilih paket muncul.", focus: [t.box], at: mid(d0.at.choose), click: true, hide: ["d0"], show: ["table"], mark: d0.at.choose, note: "Pilih paket", dur: 3.4 },
        { caption: "Baca tabelnya: Bulanan Rp79.000, Tahunan Rp299.000, Sekali Bayar Rp699.000.", focus: [t.box], at: [t.col(1) + 60, t.t0 + 70],
          mark: [t.col(0) + 8, t.t0 + 58, 3 * t.pc - 16, 26], lens: { src: [t.col(0), t.t0 + 30, 3 * t.pc, 90] }, dur: 3.8 },
        { caption: "Tanda silang: akun staff dan impor CSV tidak ada di Bulanan.", at: [t.col(0) + 21, t.rowY[4] + 22],
          mark: [t.tx + 4, t.rowY[4] + 2, 720, t.rowsH[4] + t.rowsH[5] - 4], lens: { src: [t.tx, t.rowY[4] - 4, 570, t.rowsH[4] + t.rowsH[5] + 8] }, dur: 3.8 },
        { caption: "Klik Pilih di kolom paket yang kamu mau. Halaman bayar terbuka di tab baru.", focus: [PAY_CARD], at: mid(t.btns[1]), click: true, hide: ["table", "dim"], show: ["pay"], mark: t.btns[1], note: "Pilih", dur: 4 }
      ]
    };
  })(),

  // Pilih paket, bayar di tab Scalev, Cek pembayaran, tutup, Periksa lagi.
  "gabung-bayar-paket": (() => {
    const gn = GATE_NONE(0, CT), t = table();
    const d0 = dlg({}), d1 = dlg({ paid: true, msg: ["Halaman bayar terbuka di tab baru. Setelah bayar, tekan Cek", "pembayaran."] });
    const d2 = dlg({ ...LIC_ON, msg: ["Langganan aktif. Tekan Periksa lagi di panel NikahKit."] });
    const tabs2 = crTop({ tabs: [TAB_ED, { title: "nikahin.myscalev.com", active: false, fav: favScalev }], url: URL });
    return {
      title: "Memilih paket dan membayar di Scalev",
      base: [win({ tabs: [TAB_ED], url: URL }), editor("NikahKit", ""), gn.svg],
      els: {
        dim: { svg: DIM, enter: "fade" },
        d0: { svg: d0.svg, enter: "fade" },
        table: { svg: t.svg, enter: "pop", origin: mid(t.box) },
        d1: { svg: d1.svg, enter: "fade" },
        pay: { svg: payTab(), enter: "fade", skel: true },
        tabs2: { svg: tabs2, skel: true },
        d2: { svg: d2.svg, enter: "fade" },
        open: { svg: nkOpen(CT), enter: "fade" }
      },
      steps: [
        { caption: "Klik Pilih paket di kartu Paket. Tabel Pilih paket muncul.", focus: [t.box], at: mid(d0.at.choose), click: true, hide: ["d0"], show: ["table"], mark: d0.at.choose, note: "Pilih paket" },
        { caption: "Klik Pilih di kolom paket yang kamu mau. Halaman bayar terbuka di tab baru.", focus: [PAY_CARD], at: mid(t.btns[1]), click: true, hide: ["table", "dim"], show: ["pay"],
          mark: t.btns[1], note: "Pilih", dur: 3.6 },
        { caption: "Pilih QRIS atau Virtual Account. Bayar sebelum batas waktu.", focus: [PAY_CARD], at: [PAY.x + 120, CT + 284],
          mark: { box: [PAY.x + 24, CT + 266, PAY.w - 48, 196], r: 6 }, lens: { src: [PAY.x + 12, CT + 206, PAY.w - 24, 100], at: [162, 452] }, dur: 3.6 },
        { caption: "Klik Bayar ke Nikahin, lalu ikuti petunjuknya sampai selesai.", at: mid(PAY_BTN), click: true, mark: { box: PAY_BTN, r: 6 }, note: "Bayar ke Nikahin", dur: 3 },
        { caption: "Kembali ke tab editor Scalev. Di kartu Paket ada tombol Cek pembayaran.", focus: [[0, 0, W, 41], d1.box], at: mid(TAB1), click: true, hide: ["pay"], show: ["tabs2", "dim", "d1"],
          mark: { box: TAB1, r: 9 }, lens: { src: [70, 0, 520, 41] }, dur: 3.6 },
        { caption: "Klik Cek pembayaran. Kartu Paket berubah, muncul Langganan aktif.", focus: [d2.box], at: mid(d1.at.paid), click: true, hide: ["d1"], show: ["d2"], mark: d1.at.paid,
          note: "Cek pembayaran", dur: 3.8 },
        { caption: "Tutup jendela NikahKit: klik ×, tekan Esc, atau klik area gelap.", focus: "none", at: mid(d2.at.close), click: true, hide: ["d2", "dim"], mark: d2.at.close, note: "Tutup" },
        { caption: "Klik Periksa lagi di panel. Rail editor NikahKit muncul.", focus: [LEFT], at: mid(gn.at.recheck), click: true, show: ["open"], mark: gn.at.recheck, note: "Periksa lagi", dur: 3.6 }
      ]
    };
  })(),

  // Punya kode uji? (pin.js: prompt("Kode uji"), then "Kode diterima. ..."; the review code grants Bulanan for 30 days).
  "gabung-kode-uji": (() => {
    const d0 = dlg({}), d1 = dlg({ license: ["Paket Bulanan, aktif sampai 13 November 2026."], choose: "Perpanjang atau ganti paket", active: true, msg: ["Kode diterima. Kembali ke editor Scalev, lalu Periksa lagi."] });
    const QW = 448, QX = (W - QW) / 2, QY = CT + 8, QH = 176, code = "KODE-UJI", Q = [QX, QY, QW, QH], INPUT = [QX + 24, QY + 80, 400, 36], OKE = [QX + 360, QY + 128, 64, 32];
    const prompt = shadow(QX, QY, QW, QH, 12, 3) + rect(QX, QY, QW, QH, { r: 12, fill: C.white }) + rect(QX + 24, QY + 24, 200, 10, { r: 5, fill: BAR }) +
      text(QX + 24, QY + 66, "Kode uji", { size: 14, fill: C.crText }) + rect(QX + 24.5, QY + 80.5, 399, 35, { r: 4, fill: C.white, stroke: C.crBlue, sw: 2 }) +
      rect(QX + 280.5, QY + 128.5, 71, 31, { r: 16, fill: C.white, stroke: "#747775" }) + text(QX + 316, QY + 149, "Batal", { size: 13, weight: 500, fill: C.crBlue, anchor: "middle" }) +
      rect(...OKE, { r: 16, fill: C.crBlue }) + text(QX + 392, QY + 149, "Oke", { size: 13, weight: 500, fill: C.white, anchor: "middle" });
    return {
      title: "Memakai kode uji di jendela NikahKit",
      base: [win({ tabs: [TAB_ED], url: URL }), editor("NikahKit", ""), GATE_NONE(0, CT).svg, DIM],
      els: {
        d0: d0.svg,
        prompt: { svg: prompt, enter: "pop", origin: [QX + QW / 2, QY] },
        code: text(QX + 36, QY + 104, code, { size: 14, fill: C.crText }),
        d1: { svg: d1.svg, enter: "fade" }
      },
      steps: [
        { caption: "Klik Punya kode uji? di bawah kartu Paket. Kotak Kode uji muncul.", focus: [Q], at: mid(d0.at.redeem), click: true, show: ["prompt"], mark: d0.at.redeem, lens: { src: d0.at.licCard }, dur: 3.4 },
        { caption: "Ketik kode dari tim Nikahin di kotak Kode uji.", focus: [Q], at: [QX + 300, QY + 98], click: true, type: [{ id: "code", n: code.length, box: [QX + 36, QY + 87, tw(code, 14), 22] }], show: ["code"],
          mark: INPUT, lens: { src: [QX, QY + 50, QW, 80] } },
        { caption: "Klik Oke.", focus: [d1.box], at: mid(OKE), click: true, hide: ["prompt", "code", "d0"], show: ["d1"], mark: { box: OKE, r: 16 }, note: "Oke", dur: 3 },
        { caption: "Muncul Kode diterima. Kembali ke editor Scalev, lalu Periksa lagi.", focus: [d1.box], mark: [{ box: d1.at.msg, r: 4 }, { box: d1.at.licCard, r: 8 }], lens: { src: [d1.X, d1.at.msg[1] - 12, 440, 64] }, dur: 3.8 }
      ]
    };
  })(),

  // Hubungkan bisnis Scalev: editor, gate, jendela NikahKit, kartu Bisnis Scalev, jendela Scalev, Hubungkan ulang, tutup, Periksa lagi.
  "gabung-hubungkan-scalev": (() => {
    const gb = GATE_BIZ(0, CT);
    const d1 = dlg(LIC_ON), d2 = dlg({ ...LIC_ON, biz: BIZ, msg: ["Bisnis Scalev terhubung."] }), SWR = [SW.x, SW.y, SW.w, SW.h];
    return {
      title: "Menghubungkan bisnis Scalev ke akun NikahKit",
      base: [win({ tabs: [TAB_ED], url: URL }), editor("Code")],
      els: {
        gate: { svg: gateEl(gb), enter: "fade", skel: true },
        dim: { svg: DIM, enter: "fade" },
        d1: { svg: d1.svg, enter: "pop", origin: mid(d1.box) },
        login: { svg: scalevWin(false), enter: "pop", origin: mid(SWR) },
        consent: { svg: scalevWin(true), enter: "fade" },
        d2: { svg: d2.svg, enter: "fade" },
        open: { svg: nkOpen(CT), enter: "fade" }
      },
      steps: [
        { caption: "Buka editor halaman undangan di Scalev. Pastikan halaman sudah disimpan.", focus: [TOOLBAR, [0, CT, W, 44]], at: mid(urlBox(URL)), mark: { box: urlBox(URL), r: 3 }, lens: { src: [0, 44, 480, 88] }, dur: 3 },
        { caption: "Klik tab NikahKit. Panel: Hubungkan bisnis Scalev dulu.", focus: [LEFT], at: TAB_NK, click: true, show: ["gate"], mark: TAB_NK_BOX, lens: { src: [0, CT + 44, 400, 230] } },
        { caption: "Klik Hubungkan bisnis Scalev di panel. Jendela NikahKit muncul.", focus: [d1.box], at: mid(gb.at.connect), click: true, show: ["dim", "d1"],
          mark: gb.at.connect, lens: { src: [0, CT + 160, 400, 130] }, dur: 3.4 },
        { caption: "Cari kartu Bisnis Scalev, paling bawah: Belum terhubung.", focus: [d1.box], at: [d1.X + 360, d1.at.bizCard[1] + 30], mark: { box: d1.at.bizCard, r: 8 }, lens: { src: d1.at.bizCard } },
        { caption: "Klik Hubungkan bisnis Scalev di kartu itu. Jendela Scalev terbuka.", focus: [d1.box], at: mid(d1.at.connect), click: true, show: ["login"], mark: d1.at.connect, lens: { src: d1.at.bizCard }, dur: 3.4 },
        { caption: "Masuk ke Scalev bila diminta, dengan akun pemilik bisnis halamanmu.", at: mid(SW_BTN), click: true, hide: ["login"], show: ["consent"],
          mark: [{ box: SW_BTN, r: 6 }, { box: SW_BIZ, r: 8 }], dur: 3.4 },
        { caption: "Setujui akses NikahKit. Ada pilihan bisnis? Pilih bisnis halamanmu.", focus: [d2.box], at: mid(SW_BTN), click: true, hide: ["consent", "d1"], show: ["d2"],
          mark: { box: SW_BTN, r: 6 }, dur: 3.6 },
        { caption: "Kartu menampilkan nama bisnismu, tombolnya jadi Hubungkan ulang.", focus: [d2.box], mark: [{ box: d2.at.bizCard, r: 8 }, { box: d2.at.msg, r: 4 }],
          lens: { src: [d2.X, d2.at.bizCard[1], 440, d2.at.msg[1] + d2.at.msg[3] - d2.at.bizCard[1]] }, dur: 3.6 },
        { caption: "Tutup jendela NikahKit: klik ×, tekan Esc, atau klik area gelap.", focus: "none", at: mid(d2.at.close), click: true, hide: ["d2", "dim"], mark: d2.at.close, note: "Tutup" },
        { caption: "Klik Periksa lagi di panel. Rail editor NikahKit muncul.", focus: [LEFT], at: mid(gb.at.recheck), click: true, show: ["open"], mark: gb.at.recheck, note: "Periksa lagi", dur: 3.6 }
      ]
    };
  })(),

  // Update: banner (nomor versi tidak ditampilkan), unduh, ekstrak, salin, timpa folder lama, ↻ di chrome://extensions, muat ulang.
  "gabung-update": (() => {
    const tabsEd = [TAB_ED, { title: "Ekstensi", active: false, fav: favChrome }];
    const tabsExt = [{ ...TAB_ED, active: false }, { title: "Ekstensi", active: true, fav: favChrome }];
    const EX = 200, EY = 150, EW = 1040, EH = 620, IX = EX + 220, IY = EY + 110, XWIN = [EX, EY, EW, EH];
    const files = (sel) => NK_FILES.map((f, i) => fileIcon(IX + i * 130, IY, f, sel)).join("");
    const RX = EX + 250, RY = EY + 160, REPL = [RX + 24, RY + 80, 492, 52];
    const replace = shadow(RX, RY, 540, 250, 8, 3) + rect(RX, RY, 540, 250, { r: 8, fill: C.white, stroke: "#cfd3d8" }) + rect(RX + 24, RY + 30, 260, 12, { r: 6, fill: BAR }) +
      rect(...REPL, { r: 6, fill: "#e5eefb", stroke: "#99c9ef" }) + iconX("check", RX + 48, RY + 106, 18, "#0067c0", 2.5) + text(RX + 72, RY + 111, "Replace the files in the destination", { size: 14, weight: 500, fill: "#1f1f1f" }) +
      rect(RX + 24, RY + 146, 492, 40, { r: 6, fill: C.white }) + rect(RX + 72, RY + 162, 180, 9, { r: 4, fill: BAR });
    const UPD = nkBtnBox(100, CT + 223, "Update", { icon: "download", w: 86 }), NEWPATH = "Unduhan › nikahkit-… › NikahKit", PATHBOX = [EX + 82, EY + 50, tw(NEWPATH, 13) + 4, 18];
    const CARD = [376, CT + 165, 416, 252], STRIP = [0, 0, W, 41];
    return {
      title: "Memperbarui NikahKit ke versi terbaru",
      base: [win({ tabs: tabsEd, url: URL }), editor("NikahKit", "Template"), nkOpen(CT, { banner: true })],
      els: {
        hint: { svg: nkOpen(CT, { banner: true, hint: true }), enter: "fade", skel: true },
        newWin: { svg: explorer(EX, EY, EW, EH, { title: "NikahKit", path: NEWPATH, side: "Unduhan" }) + files(false), enter: "pop", origin: mid(XWIN) },
        sel: { svg: files(true), enter: "fade", delay: 0.9 },
        old: { svg: explorer(EX, EY, EW, EH, { title: "NikahKit", path: "Dokumen › NikahKit", side: "Dokumen" }) + files(false), enter: "fade" },
        replace: { svg: replace, enter: "pop", origin: [RX + 270, RY + 125], delay: 0.9 },
        pasted: { svg: files(true), enter: "fade" },
        ext: { svg: crTop({ tabs: tabsExt, url: "chrome://extensions" }) + vp(extPage(0, CT, { dev: true, card: true })), enter: "fade", skel: true },
        code: { svg: crTop({ tabs: tabsEd, url: URL }) + vp(editor("Code")), enter: "fade", skel: true },
        after: { svg: clipped(...LEFT, scalevEditor(0, CT, { tab: "NikahKit", rail: "Template" }) + nkOpen(CT)), enter: "fade" }
      },
      steps: [
        { caption: "Ada versi baru? Banner kuning muncul di panel. Tidak ada? Bantuan, Cek update.", focus: [grow(BANNER(CT), 8)], at: [mid(UPD)[0] + 60, UPD[1] - 30], mark: BANNER(CT),
          lens: { src: [80, CT + 161, 296, 116] }, dur: 3.6 },
        { caption: "Klik Update. ZIP terunduh, banner menampilkan petunjuk singkat.", focus: [[80, CT + 161, 296, 156]], at: mid(UPD), click: true, show: ["hint"], mark: UPD, lens: { src: [80, CT + 161, 296, 156] }, dur: 3.4 },
        { caption: "Ekstrak ZIP baru, lalu buka folder NikahKit yang baru.", focus: [XWIN], at: [IX + 300, IY + 220], show: ["newWin"], mark: PATHBOX, lens: { src: [EX, EY + 36, 420, 50] } },
        { caption: "Pilih semua isinya (Ctrl+A atau Cmd+A), lalu salin (Ctrl+C atau Cmd+C).", at: [IX + 420, IY + 240], show: ["sel"], mark: [IX - 22, IY - 8, 3 * 130 + 108, 112],
          lens: { src: [IX - 30, IY - 16, 520, 130] }, dur: 3.6 },
        { caption: "Buka folder NikahKit lama, misalnya di Dokumen. Tempel (Ctrl+V).", at: mid(sideRow(EX, EY, 1)), click: true, hide: ["newWin", "sel"], show: ["old", "replace"], mark: sideRow(EX, EY, 1),
          lens: { src: [EX, EY + 81, 300, 120] }, dur: 3.6 },
        { caption: "Pilih Replace the files in the destination: ganti semua file.", at: mid(REPL), click: true, hide: ["replace"], show: ["pasted"], mark: { box: REPL, r: 6 }, note: "Replace the files in the destination", dur: 3.4 },
        { caption: "Buka chrome://extensions di tab Ekstensi.", focus: [[0, 0, 600, 41], CARD], at: mid(TAB2), click: true, hide: ["old", "pasted"], show: ["ext"], mark: { box: TAB2, r: 9 }, lens: { src: [70, 0, 520, 41] } },
        { caption: "Klik ↻ di kartu NikahKit, di samping sakelar.", focus: [CARD], at: RELOAD, click: true, mark: { box: [RELOAD[0] - 14, RELOAD[1] - 14, 28, 28], r: 14 }, lens: { src: [384, CT + 350, 400, 64] } },
        { caption: "Kembali ke tab editor, lalu tekan F5 (Cmd+R di Mac) untuk memuat ulang.", focus: [[0, 0, 600, 41], [0, CT + 44, 400, 48]], at: mid(TAB1), click: true, hide: ["ext"], show: ["code"], mark: { box: TAB1, r: 9 }, lens: { src: [70, 0, 520, 41] } },
        { caption: "Klik tab NikahKit. Banner update hilang: NikahKit sudah versi terbaru.", focus: [LEFT], at: TAB_NK, click: true, show: ["after"], mark: TAB_NK_BOX, lens: { src: [0, CT + 44, 400, 230] }, dur: 3.8 }
      ]
    };
  })()
};
