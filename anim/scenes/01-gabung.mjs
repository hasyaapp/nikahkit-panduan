// Mulai + Gabung dan pasang: peta perjalanan, checklist per bagian, istilah alamat, pasang ekstensi, masuk, bayar, kode
// uji, Scalev, update. Measured re-creations: chrome://extensions from /tmp/ref/chrome-extensions.png (labels in Bahasa
// Indonesia), the NikahKit account dialog from editor-akun.png and nikahkit/ext/pin.html + pin.js (440 or 760 wide,
// 16px padding, cards 8px radius, centred, max-height 100vh - 32px), the panel gate from nikahkit/src/ui/App.jsx, the
// update banner from nikahkit/src/ui/help.jsx, pasang.html from nikahkit/store/pasang. Most scenes use a laptop Chrome
// window (1440 x 715, page viewport 630 high) and show its left 1280 px, so 12px text stays 9px on stage. No extension
// version numbers anywhere: the banner and the ZIP names keep their place, with the number left out. Pages Scalev and
// Google own (payment, login, consent) were not measured: grey bars instead of unverified labels.
import {
  C, CHROME_TOP, ED, rect, text, para, line, circle, group, clipped, shadow, icon, iconX, tw, esc, nkBtn, nkInput, nkLabel, nkHint,
  nkSeg, nkHead, nkDialogHead, nkAcc, chrome, toggleCr, nkLogo, scalevEditor, scalevApp, svMenuAt, note, ring, favScalev, favChrome
} from "../lib.mjs";

const CT = CHROME_TOP; // 85: content top inside the Chrome window
// Laptop Chrome window, 800 x 715 (page viewport 630 high), shown whole, so 12px text stays >= 10.5px when the docs show
// the image 780 wide. The editor is drawn at its measured 1440 width and cut by the window's right edge: rail + panel
// (0..400) and the preview screen (390 wide) re-centred in the rest.
const WIN = 800, LAP = 715, VIEW = LAP - CT, LAP_WORLD = { w: WIN, h: LAP }, DLG_O = [WIN / 2, CT + VIEW / 2];
const ID = "365671";
const SLUG = "rani-dimas";
const PAGE = "Undangan Rani & Dimas";
const URL = "app.scalev.com/pages/" + ID;
const EMAIL = "rina.wo@gmail.com";
const BIZ = "Rina Wedding Organizer (@rinawo)";
const LIC_NONE = ["Belum berlangganan. Pilih paket untuk mulai", "membuat undangan."];
const LIC_YEAR = ["Paket Tahunan, aktif sampai 14 Oktober 2027."];
const MAROON = "#8a2d1f", SERIF = "Georgia,'Times New Roman',serif";
const BAR = "#e3e5e8";

// ---- Small shared pieces --------------------------------------------------------------------------------------------
// Mixed-weight text on one line: segs = [[text, weight?, fill?], ...].
const rich = (x, y, segs, o = {}) => `<text x="${x}" y="${y}" font-size="${o.size ?? 12}" fill="${o.fill ?? C.strong}">${segs.map(([s, w, f]) => `<tspan font-weight="${w ?? 400}"${f ? ` fill="${f}"` : ""}>${esc(s)}</tspan>`).join("")}</text>`;
// A window onto real-size UI: shows the region from (sx, sy) inside the box (x, y, w, h), 1:1.
const crop = (x, y, w, h, sx, sy, svg) => clipped(x, y, w, h, group({ transform: `translate(${x - sx} ${y - sy})` }, svg));
const mid = (r) => [r[0] + r[2] / 2, r[1] + r[3] / 2];
const bars = (x, y, ws, gap = 26, fill = BAR) => ws.map((w, k) => rect(x, y + k * gap, w, 10, { r: 5, fill })).join("");
// Google's four-colour G (App.jsx GOOGLE_G), size px square at (x, y).
const gLogo = (x, y, size = 20) => `<g transform="translate(${x} ${y}) scale(${size / 48})"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></g>`;
// "Masuk dengan Google" (.nk-gbtn: 40 high, #747775 border, 14px 500).
const GBTN_W = 12 + 20 + 10 + tw("Masuk dengan Google", 14, 500) + 12;
const gBtn = (x, y, o = {}) => group({ opacity: o.disabled ? 0.38 : 1 }, rect(x + 0.5, y + 0.5, GBTN_W - 1, 39, { r: 4, fill: C.white, stroke: "#747775" }) + gLogo(x + 12, y + 10) +
  text(x + 42, y + 25, "Masuk dengan Google", { size: 14, weight: 500, fill: "#1f1f1f" }));
const DIM = rect(0, CT, WIN, VIEW, { fill: "rgba(15,23,42,.45)" }); // pin-frame backdrop over the page viewport
const DARK = [712, 640]; // a point on the backdrop (closes the dialog)
const yesIc = (cx, cy) => circle(cx, cy, 7.5, { stroke: C.ok, sw: 1.7 }) + `<path d="M${cx - 3} ${cy} l2.2 2.2 l4 -4" fill="none" stroke="${C.ok}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`;
const noIc = (cx, cy) => circle(cx, cy, 7.5, { stroke: C.off, sw: 1.7 }) + `<path d="M${cx - 2.6} ${cy - 2.6} l5.2 5.2 M${cx + 2.6} ${cy - 2.6} l-5.2 5.2" fill="none" stroke="${C.off}" stroke-width="1.7" stroke-linecap="round"/>`;
const PIN_ICON = '<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>';
const pinIc = (cx, cy, size, color) => `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${PIN_ICON}</g>`;
// Guide annotation card (guide colours, not part of any real screen).
const guideCard = (x, y, w, title, lines, o = {}) => { const h = 46 + lines.length * 22; return rect(x + 2, y + 4, w, h, { r: 10, fill: "rgba(43,26,7,.12)" }) + rect(x, y, w, h, { r: 10, fill: C.tint, stroke: C.accent, sw: 1.5 }) +
  text(x + 16, y + 26, title, { size: 13, weight: 700, fill: C.accent }) + lines.map((l, i) => (Array.isArray(l) ? rich(x + 16, y + 52 + i * 22, l, { size: o.size ?? 15, fill: C.cocoa }) : text(x + 16, y + 52 + i * 22, l, { size: o.size ?? 15, fill: C.cocoa }))).join(""); };

// ---- Chrome laptop window with the Scalev editor ---------------------------------------------------------------------
const TAB_ED = { title: PAGE, active: true, fav: favScalev };
// rail "" = no active rail item (under a gate, which covers the rail).
// The editor in a window w wide: the preview screen is re-centred in the space right of the panel (400..w).
const edPage = (tab, rail, w = WIN) => { const cx = (400 + w) / 2; return clipped(0, CT, w, VIEW, scalevEditor(0, CT, { tab, rail }) + rect(400, CT + 93, w - 400, 807, { fill: C.svPreview }) +
  rect(cx - 196, CT + ED.screen.y - 1, 392, ED.screen.h + 2, { fill: "rgba(16,24,40,.06)" }) + coverAt(cx - 195, CT + ED.screen.y, cx, "Tamu Undangan")); };
const edBase = (tab = "Code", rail) => [chrome(0, 0, WIN, LAP, { tabs: [TAB_ED], url: URL }), edPage(tab, rail)];
const URL_AT = [166 + tw(URL, 14) + 28, 63], URL_RING = ring(162, 52, tw(URL, 14) + 8, 22, { r: 6 });
const TAB_NK = [264, CT + 66];
// Chrome top (tab strip + toolbar) only, to switch tabs or the address without redrawing the page.
const crTop = (o, w = WIN) => clipped(0, 0, w, CT, chrome(0, 0, w, CT + 10, o));

// ---- NikahKit account dialog (pin.html framed by src/pin-frame.js) ---------------------------------------------------
// Opened from the gate or the account chip ("openLogin"): no ID, so no "ID" line and no PIN dashboard card.
// Returns { svg, h, at } with the dialog at (X, Y), 440 wide. at.* = button rects [x, y, w, h].
function pinDlg(X, Y, o = {}) {
  const st = o.state ?? "in", at = {};
  let s = "", c = 64;
  const card = (top, h) => rect(X + 16.5, top + 0.5, 407, h - 1, { r: 8, fill: C.white, stroke: C.line });
  const btn = (x, y, label, variant, key) => { const w = tw(label, 14, 500) + 24; at[key] = [x, y, w, 36]; return [nkBtn(x, y, label, { variant, size: 14, w }), w]; };
  if (st === "checking") { s += text(X + 16, Y + c + 16, "Memeriksa login...", { size: 12, fill: C.faint }); c += 20 + 12; }
  if (st === "out") { s += card(Y + c, 74) + gBtn(X + 33, Y + c + 17, { disabled: o.gDisabled }); at.google = [X + 33, Y + c + 17, GBTN_W, 40]; c += 74 + 12; }
  if (st === "in") {
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
  const head = shadow(X, Y, 440, h, 8, 3) + rect(X, Y, 440, h, { r: 8, fill: C.white }) + nkLogo(X + 32, Y + 32, 32) + text(X + 58, Y + 38, "NikahKit", { size: 16, weight: 700 }) + iconX("x", X + 410, Y + 30, 18, C.text);
  return { svg: head + s, h, at, X, Y };
}
// The dialog centred in the laptop viewport (pin-frame: fixed, centred).
const dlg = (o) => pinDlg(WIN / 2 - 220, CT + Math.round((VIEW - pinDlg(0, 0, o).h) / 2), o);

// Wide dialog: "Pilih paket" comparison (pin.html #compare, body.wide = 760), card height H (max 100vh - 32px).
// frame = card, body = its scrolling content (unclipped), close = pin-frame's fixed close button.
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
function planDlg(ex, ey, H) {
  const X = ex + (WIN - 760) / 2, Y = ey + 16, Wd = 760;
  const tx = X + 16, tw0 = 728, fc = 247, pc = (tw0 - fc) / 3, col = (i) => tx + fc + i * pc;
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
  const foot = t0 + tH + 8;
  body += text(tx, foot + 12, "Harga belum termasuk biaya layanan pembayaran Scalev. Perpanjang kapan saja: sisa masa aktif tetap terhitung.", { size: 12, fill: C.faint });
  const frame = shadow(X, Y, Wd, H, 8, 3) + rect(X, Y, Wd, H, { r: 8, fill: C.white }), close = iconX("x", X + Wd - 30, Y + 30, 18, C.text);
  return { frame, body, close, svg: frame + clipped(X, Y, Wd, H, body) + close, X, Y, H, col, pc, t0, rowY, rowsH, btns, back, foot, tx };
}

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
// The editor's NikahKit tab with a gate, as an element over a Code-tab base (tab row + left area).
const gateEl = (g) => clipped(0, CT + 44, 400, VIEW - 44, scalevEditor(0, CT, { tab: "NikahKit", rail: "" }) + g.svg);

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
const nkOpen = (ey, o = {}) => rect(0, ey + 92, 400, 808, { fill: C.white }) + crop(0, ey + 92, 72, 808, 0, 92, scalevEditor(0, 0, { tab: "NikahKit", rail: "Template" })) +
  templatePanel(0, ey, o) + (o.banner ? updateBanner(0, ey, o) : "");
// Bagikan dialog (App.jsx ShareDialog), guest "Andi".
function shareDlg(x, y) {
  const w1 = tw("Lihat sebagai tamu", 12, 500) + 44, w2 = tw("Salin tautan tamu", 12, 500) + 44;
  return nkDialogHead(x, y, "Bagikan") + nkLabel(x + 16, y + 182, "Nama tamu") + nkInput(x + 16, y + 190, 367, "Andi") + nkHint(x + 16, y + 244, "Ditambahkan sebagai ?to=Nama.") +
    text(x + 16, y + 272, `https://tokomu.myscalev.com/${SLUG}?to=Andi`, { size: 12, fill: C.strong }) + nkBtn(x + 16, y + 288, "Lihat sebagai tamu", { icon: "eye", w: w1 }) +
    nkBtn(x + 24 + w1, y + 288, "Salin tautan tamu", { variant: "ghost", icon: "copy", w: w2 }) + nkBtn(x + 16, y + 332, "Salin tautan umum", { variant: "quiet", icon: "link", w: tw("Salin tautan umum", 12, 500) + 44 });
}
const SHARE_VIEW = [16, 288, tw("Lihat sebagai tamu", 12, 500) + 44, 36];
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
const cover = (ex, ey, name = "Tamu Undangan") => coverAt(ex + ED.screen.x, ey + ED.screen.y, ex + ED.screen.x + ED.screen.w / 2, name);
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
    coverName(cx, Y, name) +
    rect(cx - 86, Y + 567, 172, 48, { r: 24, fill: MAROON }) + icon("mail", cx - 58, Y + 591, 16, C.white) + text(cx + 12, Y + 596, "Buka Undangan", { size: 15, fill: C.white, anchor: "middle", font: SERIF }) +
    `<path d="M${X} ${Y + 784} v-24 ${Array.from({ length: 8 }, () => "q24.4 -16 48.75 0").join(" ")} v24 z" fill="${MAROON}"/>`;
}
const coverName = (cx, Y, name) => rect(cx - 120, Y + 512, 240, 30, { fill: "#fdf6ee" }) + text(cx, Y + 535, name, { size: 18, fill: MAROON, anchor: "middle", font: SERIF });

// ---- chrome://extensions (measured from /tmp/ref/chrome-extensions.png at 1440 wide; o.w reflows the header) ----------
const DEV_BTNS = ["Muat yang belum dibuka", "Kemas ekstensi", "Perbarui"];
const devBtnRects = (x, y) => { let bx = x + 24; return DEV_BTNS.map((l) => { const w = tw(l, 13, 500) + 34, r = [bx, y + 66, w, 36]; bx += w + 19; return r; }); };
// Search box: 692 wide, narrower windows shrink it between the title and Mode developer.
function extPage(x, y, o = {}) {
  const w = o.w ?? 1440, dy = o.dev ? 0 : -57, SW_X = Math.min(692, w - 420);
  let s = rect(x, y, w, 900, { fill: C.white }) + iconX("puzzle", x + 33, y + 28, 22, "#8e918f") + text(x + 67, y + 37, "Ekstensi", { size: 22, fill: C.crText }) +
    rect(x + (w - SW_X) / 2, y + 10, SW_X, 36, { r: 18, fill: C.crOmni }) + iconX("search", x + (w - SW_X) / 2 + 20, y + 28, 16, C.crIcon) + text(x + (w - SW_X) / 2 + 36, y + 33, "Telusuri ekstensi", { size: 13, fill: C.crSub }) +
    text(x + w - 54, y + 33, "Mode developer", { size: 13, fill: C.crText, anchor: "end" }) + toggleCr(x + w - 43, y + 19, !!o.dev);
  if (o.dev) devBtnRects(x, y).forEach(([bx, by, bw, bh], i) => (s += rect(bx + 0.5, by + 0.5, bw - 1, bh - 1, { r: 18, fill: C.white, stroke: "#a8b4c4" }) + text(bx + bw / 2, by + 23, DEV_BTNS[i], { size: 13, weight: 500, fill: C.crBlue, anchor: "middle" })));
  s += line(x, y + 113.5 + dy, x + w, y + 113.5 + dy, { stroke: "#e3e3e3" }) +
    `<path d="M${x} ${y + 122 + dy} h234 a20 20 0 0 1 0 40 h-234 z" fill="${C.crBlueSoft}"/>` + iconX("puzzle", x + 34, y + 142 + dy, 17, C.crBlue) + text(x + 64, y + 147 + dy, "Ekstensi saya", { size: 14, weight: 500, fill: C.crBlue }) +
    rect(x + 26, y + 176 + dy, 16, 11, { r: 2, stroke: C.crIcon, sw: 1.5 }) + text(x + 64, y + 187 + dy, "Pintasan keyboard", { size: 14, weight: 500, fill: C.crText }) +
    line(x, y + 210.5 + dy, x + 256, y + 210.5 + dy, { stroke: "#e3e3e3" });
  if (o.card) s += text(x + 384, y + 182, "Semua Ekstensi", { size: 16, fill: C.crText }) + extCardR(x + 384, y + 203);
  return s;
}
const EXT_CARD = { x: 384, y: 203 };
const extCardR = (x, y) => shadow(x, y, 400, 208, 8, 1) + rect(x + 0.5, y + 0.5, 399, 207, { r: 8, fill: C.white, stroke: "#e3e3e3" }) + nkLogo(x + 43, y + 40, 34) +
  text(x + 92, y + 31, "NikahKit", { size: 13, weight: 500, fill: C.crText }) +
  para(x + 92, y + 55, ["Buat undangan pernikahan digital di Scalev", "HTML Mode: pilih template, warna, font, musik,", "dan isi data."], { size: 13, fill: C.crSub, lh: 20 }) +
  text(x + 92, y + 119, "ID: ibljeopjjcapnmcclgcggefhgnolmmeb", { size: 13, fill: C.crSub }) +
  pillCr(x + 8, y + 166, "Detail") + pillCr(x + 8 + tw("Detail", 13, 500) + 34 + 8, y + 166, "Hapus") + iconX("rotate-cw", x + 325, y + 184, 16, C.crIcon) + toggleCr(x + 353, y + 175, true);
const pillCr = (x, y, l) => { const w = tw(l, 13, 500) + 34; return rect(x + 0.5, y + 0.5, w - 1, 35, { r: 18, fill: C.white, stroke: "#a8b4c4" }) + text(x + w / 2, y + 23, l, { size: 13, weight: 500, fill: C.crBlue, anchor: "middle" }); };
const RELOAD = [EXT_CARD.x + 325, CT + EXT_CARD.y + 184];

// ---- Desktop windows (generic: Windows Explorer) ----------------------------------------------------------------------
function explorer(x, y, w, h, o = {}) {
  let s = rect(x + 4, y + 10, w, h, { r: 10, fill: "rgba(0,0,0,.14)" }) + rect(x, y, w, h, { r: 8, fill: C.white, stroke: "#cfd3d8" }) +
    rect(x, y, w, 36, { r: 8, fill: "#f3f3f3" }) + rect(x, y + 28, w, 8, { fill: "#f3f3f3" }) + iconX("folder", x + 22, y + 18, 15, "#e5a531") +
    text(x + 38, y + 23, o.title, { size: 13, fill: "#1f1f1f" }) + text(x + w - 120, y + 23, "—", { size: 12, fill: "#444" }) + rect(x + w - 76, y + 13, 10, 10, { stroke: "#444" }) + iconX("x", x + w - 24, y + 18, 13, "#444") +
    rect(x, y + 36, w, 44, { fill: "#f9f9f9" }) + iconX("arrow-left", x + 22, y + 58, 15, "#666") + iconX("arrow-right", x + 50, y + 58, 15, "#bbb") +
    rect(x + 72, y + 44, w - 92, 28, { r: 4, fill: C.white, stroke: "#dcdcdc" }) + text(x + 84, y + 63, o.path, { size: 13, fill: "#1f1f1f" }) + line(x, y + 80.5, x + w, y + 80.5, { stroke: "#e5e5e5" }) +
    rect(x, y + 81, 180, h - 82, { fill: "#fafafa" }) + line(x + 180.5, y + 81, x + 180.5, y + h, { stroke: "#e5e5e5" });
  ["Desktop", "Dokumen", "Unduhan"].forEach((n, i) => (s += (n === o.side ? rect(x + 8, y + 94 + i * 32, 164, 28, { r: 4, fill: "#e5eefb" }) : "") + iconX("folder", x + 26, y + 108 + i * 32, 15, n === o.side ? "#e5a531" : "#c49a3a") + text(x + 44, y + 113 + i * 32, n, { size: 13, fill: "#1f1f1f" })));
  return s;
}
const selBox = (x, y) => rect(x - 22, y - 8, 108, 112, { r: 4, fill: "#cce4f7", stroke: "#99c9ef" });
const zipIcon = (x, y, label, sel) => (sel ? selBox(x, y) : "") + rect(x, y, 64, 72, { r: 6, fill: "#e8eaed", stroke: "#c4c7c5" }) +
  [0, 1, 2, 3, 4].map((i) => rect(x + 26, y + i * 8, 12, 4, { fill: "#9aa0a6" })).join("") + rect(x + 24, y + 40, 16, 12, { r: 2, stroke: "#9aa0a6", sw: 1.5 }) + text(x + 32, y + 92, label, { size: 13, fill: "#1f1f1f", anchor: "middle" });
const folderIcon = (x, y, label, sel) => (sel ? selBox(x, y) : "") + rect(x, y + 4, 64, 58, { r: 6, fill: "#e5a531" }) + rect(x, y, 28, 14, { r: 4, fill: "#e5a531" }) + rect(x, y + 16, 64, 46, { r: 6, fill: "#f2b84b" }) +
  text(x + 32, y + 82, label, { size: 13, fill: "#1f1f1f", anchor: "middle", weight: label === "NikahKit" ? 600 : undefined });
const fileIcon = (x, y, label, sel) => (sel ? selBox(x, y) : "") + `<path d="M${x + 12} ${y} h28 l14 14 v54 h-42 z" fill="#ffffff" stroke="#9aa0a6" stroke-width="1.5"/>` +
  `<path d="M${x + 40} ${y} v14 h14" fill="none" stroke="#9aa0a6" stroke-width="1.5"/>` + [24, 32, 40, 48].map((d) => rect(x + 20, y + d, 26, 2, { fill: "#c4c7c5" })).join("") + text(x + 32, y + 88, label, { size: 13, fill: "#1f1f1f", anchor: "middle" });
const NK_FILES = ["manifest.json", "nk-bg.js", "pin.html", "nk-bridge.js"];
const DOC_FOLDERS = ["Faktur", "NikahKit", "Foto klien"];

// ---- Scalev pages ---------------------------------------------------------------------------------------------------
// Landing Pages list (scalev-pages.png) in an 880 window (content to 856): Folders panel 170 wide; the Folder and
// Domains columns and the row menu do not fit and are left out.
const LP_ROWS = [[PAGE, "/" + SLUG], ["Promo Rina WO", "/promo"], ["Contoh Undangan", "/contoh"]];
const LP_W = 880, LP_NAME = 496;
function lpList(x, y) {
  const R = LP_W - 24;
  let s = text(x + 280, y + 35, "Landing Pages", { size: 18, weight: 700, fill: C.ink }) + line(x + 280, y + 58.5, x + R, y + 58.5, { stroke: C.svDivider }) +
    rect(x + 280, y + 78, 173, 40, { r: 4, fill: "#2f8fcf" }) + text(x + 366, y + 103, "+ Create Landing Page", { size: 14, weight: 500, fill: C.white, anchor: "middle" }) +
    rect(x + 280, y + 244, R - 280, 656, { r: 6, fill: C.white, stroke: "#e6e8ec" }) + line(x + 450.5, y + 244, x + 450.5, y + 900, { stroke: "#e6e8ec" }) +
    text(x + 294, y + 275, "Folders", { size: 14, weight: 600, fill: C.ink }) + rect(x + 286, y + 328, 158, 36, { r: 4, fill: "#eef6fc" }) + text(x + 298, y + 351, "All Landing Pages", { size: 14, weight: 500, fill: C.primary }) +
    text(x + 466, y + 273, "All Landing Pages", { size: 14, weight: 600, fill: C.ink }) + rect(x + 451, y + 293, R - 451, 38, { fill: "#f5f6f8" });
  [["Nama Landing Page", LP_NAME], ["Slug", 676], ["Mode", 770]].forEach(([l, tx]) => (s += text(x + tx, y + 317, l, { size: 12, fill: "#5b6675" })));
  LP_ROWS.forEach(([n, sl], i) => {
    const ry = y + 367 + i * 71;
    s += rect(x + 466, ry - 7, 14, 14, { r: 3, stroke: "#9aa0a6", sw: 1.5 }) + text(x + LP_NAME, ry + 5, n, { size: 14, weight: 500, fill: C.primary }) + text(x + 676, ry + 5, sl, { size: 14, fill: C.primary }) +
      rect(x + 770, ry - 14, 83, 28, { r: 4, fill: "#e6f4fb" }) + text(x + 811, ry + 4, "HTML Mode", { size: 12, weight: 600, fill: "#1f86c2", anchor: "middle" }) + line(x + 451, ry + 35.5, x + R, ry + 35.5, { stroke: "#eef0f3" });
  });
  return s;
}
// Scalev PayLink invoice page (nikahin.myscalev.com/pay/…, labels as seen live), Tahunan Rp299.000, in the laptop viewport.
const PAY = { x: WIN / 2 - 250, w: 500 }, PAYBTN = [PAY.x + PAY.w / 2, CT + 524];
const payPage = () => {
  const L = PAY.x + 24, R = PAY.x + PAY.w - 24, f = { size: 14, fill: C.strong }, sm = { size: 12, fill: C.faint }, rule = (y) => line(PAY.x, y + 0.5, PAY.x + PAY.w, y + 0.5, { stroke: "#eef0f3" });
  const opt = (x, y, w, label) => rect(x + 0.5, y + 0.5, w - 1, 35, { r: 6, fill: C.white, stroke: "#dcdfe4" }) + text(x + 14, y + 23, label, { size: 14, weight: 500, fill: C.strong });
  const half = (PAY.w - 48 - 10) / 2;
  return rect(0, CT, WIN, VIEW, { fill: "#f5f6f8" }) + rect(PAY.x, CT + 30, PAY.w, 560, { r: 10, fill: C.white, stroke: "#e6e8ec" }) +
    text(PAY.x + PAY.w / 2, CT + 66, "Nikahin", { size: 18, weight: 700, fill: C.strong, anchor: "middle" }) + rule(CT + 86) +
    text(L, CT + 112, "RINGKASAN PESANAN", { ...sm, weight: 700 }) + text(R, CT + 112, "Invoice #261014KXRWQPT", { ...sm, anchor: "end" }) +
    text(L, CT + 138, "NikahKit Membership - Tahunan", f) + text(R, CT + 138, "Rp299.000", { ...f, anchor: "end" }) + text(L, CT + 156, "1 x Rp299.000", sm) +
    text(L, CT + 184, "Total Tagihan", { ...f, weight: 700 }) + text(R, CT + 184, "Rp299.000", { size: 16, weight: 700, fill: C.strong, anchor: "end" }) + rule(CT + 200) +
    text(L, CT + 224, "BAYAR SEBELUM 17 OKT 2026, 09.30", { size: 12, weight: 700, fill: C.strong }) + text(R, CT + 224, "Sisa waktu 71:58:43", { ...sm, anchor: "end" }) +
    text(L, CT + 254, "PILIH METODE PEMBAYARAN", { ...sm, weight: 700 }) + opt(L, CT + 266, PAY.w - 48, "QRIS") +
    text(L, CT + 326, "Virtual Account", { ...sm, weight: 700 }) + opt(L, CT + 338, half, "BCA") + opt(L + half + 10, CT + 338, half, "BNI") +
    opt(L, CT + 382, half, "BRI") + opt(L + half + 10, CT + 382, half, "Bank Mandiri") + opt(L, CT + 426, half, "Bank Permata") +
    rect(L, CT + 500, PAY.w - 48, 48, { r: 6, fill: C.primary }) + text(PAYBTN[0], CT + 529, "Bayar ke Nikahin", { size: 15, weight: 700, fill: C.white, anchor: "middle" }) +
    text(PAYBTN[0], CT + 572, "Pembayaran diproses dengan aman dan terenkripsi", { ...sm, anchor: "middle" });
};
const payDone = rect(PAY.x + 24, CT + 500, PAY.w - 48, 48, { r: 6, fill: C.ok }) + iconX("check", PAYBTN[0], PAYBTN[1], 22, C.white, 3);
const TABS_PAY = [{ ...TAB_ED, active: false }, { title: "nikahin.myscalev.com", active: true, fav: favScalev }];
// Separate Scalev window (OAuth): login, then consent with the business chosen. Not measured: grey bars.
const SW = { x: 320, y: 100, w: 460, h: 560 };
const scalevWin = (consent) => {
  const { x, y, w, h } = SW;
  let s = shadow(x, y, w, h, 10, 4) + rect(x, y, w, h, { r: 10, fill: C.white, stroke: "#d0d4d9" }) + rect(x, y, w, 40, { r: 10, fill: C.crFrame }) + rect(x, y + 30, w, 10, { fill: C.crFrame }) +
    rect(x + 10, y + 7, w - 20, 26, { r: 13, fill: C.white }) + icon("lock", x + 26, y + 20, 12, C.crIcon) + text(x + 40, y + 25, "app.scalev.com/oauth/authorize", { size: 12, fill: C.crText }) +
    circle(x + w / 2 - 4, y + 96, 22, { fill: "#3b7dd8" }) + circle(x + w / 2 - 10, y + 90, 5, { fill: C.white }) + circle(x + w / 2 + 2, y + 102, 5, { fill: C.white }) +
    rect(x + 90, y + 142, 280, 14, { r: 7, fill: BAR }) + rect(x + 130, y + 168, 200, 10, { r: 5, fill: "#eceef1" });
  if (!consent) return s + [0, 1].map((k) => rect(x + 40, y + 222 + k * 92, 120, 10, { r: 5, fill: BAR }) + rect(x + 40.5, y + 240.5 + k * 92, w - 81, 43, { r: 6, fill: C.white, stroke: "#d5dae1" })).join("") +
    rect(x + 40, y + h - 120, w - 80, 48, { r: 6, fill: C.primary });
  return s + rect(x + 40, y + 212, w - 80, 64, { r: 8, fill: C.white, stroke: C.primary, sw: 2 }) + circle(x + 72, y + 244, 14, { fill: C.primary }) + text(x + 72, y + 249, "R", { size: 12, weight: 700, fill: C.white, anchor: "middle" }) +
    text(x + 96, y + 249, "Rina Wedding Organizer", { size: 14, weight: 500, fill: C.strong }) + bars(x + 40, y + 302, [320, 260, 300]) + rect(x + 40, y + h - 120, w - 80, 48, { r: 6, fill: C.primary });
};
const SW_BTN = [SW.x + SW.w / 2, SW.y + SW.h - 96];

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

// ---- Checklist scenes (alur lengkap, peta): rows ticked one by one, the real screen of each row in a pane below -------
// Portrait (600 wide), so the 16px rows and the 1:1 screen in the pane stay readable when the image is shown narrow.
// pv(sx, sy, svg): svg drawn so its point (sx, sy) lands on the pane's top-left (pane coordinates, clipped by the pane).
const PW = 540, PH = 450;
const pv = (sx, sy, svg) => group({ transform: `translate(${-sx} ${-sy})` }, svg);
function checklist(title, head, sub, rows) {
  const x = 30, y0 = 104, n = rows.length, RH = n > 6 ? 46 : 50, bh = RH - 8, cy = (i) => y0 + i * RH + bh / 2;
  const PX = x, PY = y0 + n * RH + 8, H = PY + PH + 24;
  const base = [rect(0, 0, 600, H, { fill: "#f7f3ef" }), text(x, 52, head, { size: 26, weight: 700, fill: C.cocoa }), text(x, 82, sub, { size: 16, fill: "#6f675f" }),
    rect(PX + 3, PY + 6, PW, PH, { r: 12, fill: "rgba(43,26,7,.08)" }), rect(PX, PY, PW, PH, { r: 12, fill: C.svPreview, stroke: "#e6dcd3" })];
  const els = {};
  rows.forEach(([label, , preview], i) => {
    const y = y0 + i * RH;
    base.push(rect(x, y, PW, bh, { r: 10, fill: C.white, stroke: "#e6dcd3" }) + rect(x + 12, cy(i) - 12, 24, 24, { r: 6, fill: C.white, stroke: "#b9aa9c", sw: 1.5 }) + text(x + 48, cy(i) + 6, label, { size: 16, fill: C.cocoa }));
    els["k" + i] = { svg: rect(x + 12, cy(i) - 12, 24, 24, { r: 6, fill: C.ok }) + `<path d="M${x + 18} ${cy(i)} l4.5 4.5 l8 -9" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`, enter: "pop", origin: [x + 24, cy(i)] };
    els["r" + i] = { svg: rect(x - 2, y - 2, PW + 4, bh + 4, { r: 11, stroke: C.accent, sw: 2.5 }), enter: "fade" };
    els["p" + i] = { svg: group({ transform: `translate(${PX} ${PY})` }, clipped(1, 1, PW - 2, PH - 2, rect(0, 0, PW, PH, { fill: C.svPreview }) + preview)), enter: "fade" };
  });
  return { title, world: { w: 600, h: H }, base, els,
    steps: rows.map(([, caption], i) => ({ caption, at: [x + 24, cy(i)], click: true, show: ["k" + i, "r" + i, "p" + i], hide: i ? ["r" + (i - 1), "p" + (i - 1)] : [], dur: 3 })) };
}
// Preview sources (drawn at 0,0 in their own coordinates).
const PV = {
  plans: () => { const t = planDlg(0, 0, 868); return pv(t.col(0) - 8, 50, t.svg + ring(t.col(1) + 2, t.t0 + 4, t.pc - 4, 162, { r: 8 })); },
  files: () => pv(0, 0, explorer(10, 40, 520, 460, { title: "NikahKit", path: "Unduhan › nikahkit-… › NikahKit", side: "Unduhan" }) +
    NK_FILES.map((f, i) => fileIcon(214 + (i % 3) * 104, 150 + Math.floor(i / 3) * 130, f, i === 0)).join("") + ring(192, 142, 108, 112)),
  ext: () => pv(370, 56, extPage(0, 0, { dev: true, card: true }) + ring(EXT_CARD.x, EXT_CARD.y, 400, 208, { r: 10 })),
  // The editor's left area only (tab row down), so the toolbar's right part is not cut by the pane.
  left: (svg, over) => pv(-10, 44, clipped(0, 44, 400, 856, svg) + over),
  gate: (g, key) => PV.left(scalevEditor(0, 0, { tab: "NikahKit", rail: "" }) + g.svg, ring(...g.at[key], { r: 6 })),
  dialog: (o, key) => { const d = pinDlg(50, 16, o); return pv(0, 0, d.svg + ring(...d.at[key], { r: 6 })); },
  editor: (tab, extra, rings, sy = 92) => pv(-10, sy, clipped(0, 92, 400, 808, scalevEditor(0, 0, { tab, rail: tab === "NikahKit" ? "Template" : undefined }) + extra) + rings),
  // The top-right save buttons as a strip, with a note under it.
  saveBar: (both, title, lines) => pv(965, -110, clipped(1030, 0, 410, 92, scalevEditor(0, 0, { tab: "NikahKit" })) + (both ? ring(1193, 50, 82, 34, { r: 6 }) : "") + ring(1283, 50, 151, 34, { r: 6 }) +
    guideCard(1030, 136, 410, title, lines, { size: 14 }))
};
const settingsPanel = (ex, ey) => rect(ex, ey + 92, 399, 808, { fill: C.white }) + bars(ex + 16, ey + 116, [220, 300, 180]) +
  nkLabel(ex + 16, ey + 220, "Slug") + nkInput(ex + 16, ey + 230, 367, SLUG, { focus: true }) + bars(ex + 16, ey + 300, [260, 320, 200, 280]);
const LIC_ON = { license: LIC_YEAR, choose: "Perpanjang atau ganti paket", active: true };

// ---- Scenes ---------------------------------------------------------------------------------------------------------
export const scenes = {
  // Home page overview: eight stops, each with a glimpse of the screen involved.
  "mulai-peta-perjalanan": checklist("Peta perjalanan member NikahKit", "Perjalanan member NikahKit", "Dari gabung sampai jualan, delapan titik.", [
    ["1. Gabung: pilih paket, bayar", "Gabung: pilih paket dan bayar membership di jendela NikahKit.", PV.dialog({ ...LIC_ON, biz: BIZ, msg: null }, "choose")],
    ["2. Pasang: ekstensi di Chrome", "Pasang NikahKit di Chrome komputer lewat chrome://extensions.", PV.ext()],
    ["3. Scalev: hubungkan bisnis", "Scalev: hubungkan bisnismu, buat halaman dengan HTML Mode.", pv(-66, -90, lpRowCard(0, 0))],
    ["4. Buat undangan: template, Konten", "Buat undangan: pilih template, isi Konten, lalu Simpan.", PV.editor("NikahKit", templatePanel(0, 0), ring(88, 219, 134, 225, { r: 6 }))],
    ["5. Serahkan: tautan, Dashboard, PIN", "Serahkan ke pasangan: tautan undangan, Dashboard, dan PIN.", pv(-66, -150, pinCard(0, 0) + ring(355, 70, 40, 30, { r: 6 }))],
    ["6. Tamu: tautan pribadi, RSVP", "Tamu membuka undangan lewat tautan pribadi berisi namanya.", pv(-75, 200, coverAt(0, 0, 195, "Andi") + ring(125, 516, 140, 28, { r: 6 }))],
    ["7. Hari-H: check-in tamu", "Hari-H: tamu dicatat lewat check-in di Dashboard pasangan.", pv(-75, -20, scanScreen(0, 0) + ring(12, 76, 366, 48, { r: 24 }))],
    ["8. Jualan: landing page, pesanan", "Jualan: landing page milikmu, pesanan klien masuk ke NikahKit.", pv(-70, 92, ordersDlg(0, 0))]
  ]),

  // /mulai/alur-lengkap, one checklist per Bagian; rows = the page's step titles.
  "mulai-alur-gabung": checklist("Bagian 1: gabung dan pasang", "Bagian 1: Gabung dan pasang", "Langkah 1 sampai 6.", [
    ["1. Pilih paket membership", "Pilih paket: Bulanan, Tahunan, atau Sekali Bayar.", PV.plans()],
    ["2. Unduh dan ekstrak ZIP NikahKit", "Unduh dan ekstrak ZIP: folder NikahKit berisi manifest.json.", PV.files()],
    ["3. Pasang lewat Load unpacked", "Di chrome://extensions: Developer mode, Load unpacked, folder NikahKit.", PV.ext()],
    ["4. Masuk dengan Google", "Di tab NikahKit editor Scalev, klik Masuk dengan Google.", PV.gate(GATE_OUT(0, 0), "google")],
    ["5. Bayar membership", "Klik Pilih paket, Pilih, bayar di Scalev, lalu Cek pembayaran.", PV.dialog({ paid: true, msg: ["Halaman bayar terbuka di tab baru. Setelah bayar, tekan Cek", "pembayaran."] }, "paid")],
    ["6. Hubungkan bisnis Scalev", "Di kartu Bisnis Scalev, klik Hubungkan bisnis Scalev dan setujui.", PV.dialog({ ...LIC_ON, biz: BIZ, msg: ["Bisnis Scalev terhubung."] }, "bizCard")]
  ]),
  "mulai-alur-scalev": checklist("Bagian 2: siapkan Scalev", "Bagian 2: Siapkan Scalev", "Langkah 7 sampai 10.", [
    ["7. Pastikan paket Scalev cukup", "Satu undangan memakai satu halaman Scalev. Cek batas halaman paketmu.", pv(441, 250, scalevApp(0, 0) + lpList(0, 0) + ring(447, 352, 409, 210, { r: 8 }))],
    ["8. Buat halaman undangan dengan HTML Mode", "Buat Landing Page HTML Mode, isi slug di Settings, lalu Simpan.", PV.left(scalevEditor(0, 0, { tab: "Settings" }) + settingsPanel(0, 0), ring(16, 230, 367, 36, { r: 6 }))],
    ["9. Pahami Simpan dan Simpan & Terbitkan", "Simpan menyimpan halaman. Simpan & Terbitkan menayangkannya ke tamu.",
      PV.saveBar(true, "Dua tombol di kanan atas editor", ["Simpan: menyimpan halaman di Scalev.", "Simpan & Terbitkan: tamu melihat versi terbaru."])],
    ["10. Atur alamat dan izin domain", "Atur alamat di Settings dan izin domain di tab Security.", PV.left(scalevEditor(0, 0, { tab: "Security" }), ring(102, 54, 116, 24, { r: 6 }) +
      guideCard(16, 300, 500, "Alamat umum undangan", ["https://tokomu.myscalev.com/" + SLUG], { size: 17 }))]
  ]),
  "mulai-alur-undangan": checklist("Bagian 3: buat undangan", "Bagian 3: Buat undangan", "Langkah 11 sampai 15.", [
    ["11. Kenali editor NikahKit", "Rail kiri: Template, Gaya, Audio, Media, Lapisan, Konten.", PV.editor("NikahKit", templatePanel(0, 0), ring(2, 104, 68, 332, { r: 8 }))],
    ["12. Pilih template", "Pilih template di panel Template.", PV.editor("NikahKit", templatePanel(0, 0), ring(88, 219, 134, 225, { r: 6 }))],
    ["13. Isi Konten", "Isi Konten: mulai dari sampul, mempelai, dan acara.", pv(-10, 92, clipped(0, 92, 400, 808, scalevEditor(0, 0, { tab: "NikahKit", rail: "Konten" }) + konten(0, 0)) + ring(88, 169, 279, 166, { r: 6 }))],
    ["14. Rapikan foto, musik, gaya, dan lapisan", "Rapikan lewat Gaya, Audio, Media, dan Lapisan di rail kiri.", PV.editor("NikahKit", templatePanel(0, 0), ring(2, 160, 68, 220, { r: 8 }))],
    ["15. Simpan & Terbitkan", "Tekan Simpan & Terbitkan supaya tamu melihat versi terbaru.", PV.saveBar(false, "Simpan & Terbitkan", ["Menyimpan sekaligus menerbitkan, supaya", "tamu melihat versi terbaru."])]
  ]),
  "mulai-alur-serahkan": checklist("Bagian 4: bagikan dan serahkan", "Bagian 4: Bagikan dan serahkan", "Langkah 16 sampai 20.", [
    ["16. Cek tampilan tamu lewat Bagikan", "Bagikan: isi nama tamu, lalu klik Lihat sebagai tamu.", PV.editor("NikahKit", shareDlg(0, 0), ring(...SHARE_VIEW, { r: 6 }))],
    ["17. Pasang Dashboard pasangan milikmu (sekali saja)", "Template > Marketing: pasang Dashboard pasangan, sekali saja.", PV.editor("NikahKit", marketing(0, 0), ring(88, 279, 134, 290, { r: 6 }), 166)],
    ["18. Buat PIN dashboard", "Buat PIN dashboard di jendela NikahKit.", pv(-66, -150, pinCard(0, 0) + ring(17, 64, 296, 40, { r: 6 }))],
    ["19. Serahkan ke pasangan", "Salin pesan untuk pengantin, kirim lewat WhatsApp.", pv(-66, -150, pinCard(0, 0) + ring(355, 70, 40, 30, { r: 6 }) + ring(17, 166, 374, 32, { r: 6 }))],
    ["20. Siapkan hari-H (opsional)", "Hari-H: tamu di-check-in dari Dashboard pasangan.", pv(-75, -20, scanScreen(0, 0) + ring(12, 76, 366, 48, { r: 24 }))]
  ]),
  "mulai-alur-jualan": checklist("Bagian 5: jualan", "Bagian 5: Jualan", "Langkah 21 sampai 24.", [
    ["21. Isi Profil merek", "Template > Marketing: isi Profil merek, nama bisnis dan WhatsApp.", PV.editor("NikahKit", marketing(0, 0, { open: true }), ring(88, 217, 279, 376, { r: 6 }), 166)],
    ["22. Pasang Landing page jualan", "Pasang Landing page dari kartu Landing page di Marketing.", PV.editor("NikahKit", marketing(0, 0), ring(234, 279, 134, 322, { r: 6 }), 166)],
    ["23. Bagikan form data klien dan proses Pesanan masuk", "Kirim link form ke klien. Pesanannya masuk ke Pesanan masuk.", pv(-70, 92, ordersDlg(0, 0, { link: true }) + ring(32, 360, tw("Salin link form", 12, 500) + 44, 36, { r: 6 }))],
    ["24. Ikuti alur kerja dengan klien", "Tempel data pesanan dari WhatsApp klien, lalu klik Isi undangan.", pv(-70, 92, ordersDlg(0, 0, { paste: true }) + ring(32, 362, tw("Isi undangan", 12, 500) + 24, 36, { r: 6 }))]
  ]),

  // Istilah: ID undangan (address bar), slug (Settings), tab NikahKit, then the terms on that screen.
  "mulai-istilah-alamat": (() => {
    const urlX = 166 + tw("app.scalev.com/pages/", 14), idW = tw(ID, 14);
    const els = {
      idRing: ring(urlX + 2, 54, idW + 2, 20, { r: 6 }) + note(urlX + 120, 100, "ID undangan = ID halaman Scalev", urlX + idW / 2, 76, { w: 280 }),
      settings: { svg: settingsPanel(0, CT) + crop(0, CT + 44, 399, 48, 0, 44, scalevEditor(0, 0, { tab: "Settings" })), enter: "fade" },
      slugNote: { svg: note(210, CT + 296, "slug", 140, CT + 266, { w: 80 }), delay: 0.3 },
      nk: { svg: clipped(0, CT + 44, 400, 856, scalevEditor(0, CT, { tab: "NikahKit", rail: "Template" }) + templatePanel(0, CT)), enter: "fade" },
      railRing: { svg: ring(2, CT + 104, 68, 332, { r: 8 }), delay: 0.3 },
      terms: rect(12, CT + 294, 704, 262, { r: 10, fill: "rgba(43,26,7,.12)" }) + rect(10, CT + 290, 704, 262, { r: 10, fill: C.tint, stroke: C.accent, sw: 1.5 }) +
        text(28, CT + 318, "Alamat umum: domain atau subdomain, lalu slug", { size: 13, weight: 700, fill: C.accent }) + text(28, CT + 344, "https://tokomu.myscalev.com/" + SLUG, { size: 18, fill: C.cocoa }) +
        text(28, CT + 386, "Tautan pribadi: alamat umum ditambah ?to=Nama", { size: 13, weight: 700, fill: C.accent }) +
        rich(28, CT + 412, [["https://tokomu.myscalev.com/" + SLUG], ["?to=Andi", 700, C.accent]], { size: 18, fill: C.cocoa }),
      keys: text(28, CT + 456, "Untuk masuk Dashboard pasangan", { size: 13, weight: 700, fill: C.accent }) + rich(28, CT + 482, [["PIN dashboard", 700], [": pasangan, pemilik undangan"]], { size: 16, fill: C.cocoa }) +
        rich(28, CT + 506, [["Kode staff", 700], [": penerima tamu, khusus Tahunan dan Sekali Bayar"]], { size: 16, fill: C.cocoa })
    };
    return {
      title: "ID undangan, slug, alamat, dan tautan pribadi", world: { x: -10, y: 40, w: 740, h: 612 },
      base: [chrome(0, 0, WIN, 985, { tabs: [TAB_ED], url: URL }), scalevEditor(0, CT, { tab: "Code" })],
      els,
      steps: [
        { caption: "Buka halaman di editor Scalev. Angka di alamat adalah ID undangan.", at: [urlX + idW / 2, 63], show: ["idRing"], dur: 3.6 },
        { caption: "Klik tab Settings. Di sini kamu mengisi slug, bagian akhir alamat.", at: [191, CT + 66], click: true, hide: ["idRing"], show: ["settings", "slugNote"], dur: 3.6 },
        { caption: "Klik tab NikahKit. Rail kiri: Template, Gaya, Audio, Media, Lapisan, Konten.", at: TAB_NK, click: true, hide: ["settings", "slugNote"], show: ["nk", "railRing"], dur: 3.8 },
        { caption: "Cocokkan istilah: alamat umum, lalu tautan pribadi berisi nama tamu.", hide: ["railRing"], show: ["terms"], dur: 3.8 },
        { caption: "PIN dashboard untuk pasangan, kode staff untuk penerima tamu.", show: ["keys"], dur: 3.6 }
      ]
    };
  })(),

  // Pasang bagian 1: pasang.html, unduh, ikon unduhan, folder Unduhan, ekstrak (Windows, Mac), isi folder, pindah ke Dokumen.
  "gabung-ekstrak-zip": (() => {
    // pasang.html in the 800 window: main = 100% - 48 (24..776). The title and the download button no longer fit on
    // one line, so .top wraps: title, subtitle, then the button with its meta line, then the player (steps + screen).
    const DLX = 24, DLY = CT + 173, DLW = 236, P0 = CT + 299; // .dl: 52 high, 16px radius, cocoa; .player top
    const page = rect(0, CT, WIN, 900, { fill: C.white }) + text(24, CT + 104, "Cara pasang NikahKit", { size: 56, fill: C.cocoa, font: SERIF }) +
      text(24, CT + 145, "Untuk Google Chrome di komputer Windows atau Mac.", { size: 18, fill: "#6f675f" }) +
      text(DLX + DLW, DLY + 76, "ZIP ±120 KB", { size: 14, fill: "#6f675f", anchor: "end" }) +
      ["Unduh dan ekstrak", "Buka chrome://extensions", "Nyalakan Developer mode", "Klik Load unpacked", "NikahKit terpasang", "Masuk di editor Scalev"].map((t, i) =>
        circle(53, P0 + 29 + i * 74, 15, { stroke: "#6f675f", sw: 1.5 }) + text(53, P0 + 34 + i * 74, String(i + 1), { size: 14, weight: 800, fill: "#6f675f", anchor: "middle" }) +
        text(80, P0 + 35 + i * 74, t, { size: 17, weight: 700, fill: C.cocoa })).join("") +
      rect(372, P0, 404, 482, { r: 16, fill: C.white, stroke: "rgba(43,26,7,.22)", sw: 1.5 });
    const dlBtn = rect(DLX, DLY, DLW, 52, { r: 16, fill: C.cocoa }) + text(DLX + DLW / 2, DLY + 32, "Unduh NikahKit", { size: 16, weight: 800, fill: C.white, anchor: "middle" });
    const DLI = [WIN - 146, 63]; // Chrome's download button, left of the extensions puzzle (omnibox shortens)
    const dlIcon = rect(WIN - 178, 44, 62, 38, { fill: C.white }) + rect(WIN - 204, 46, 34, 34, { r: 17, fill: C.crOmni }) + iconX("download", DLI[0], DLI[1], 18, C.crBlue) + circle(DLI[0], DLI[1], 14, { stroke: C.crBlue, sw: 2 });
    const BX = WIN - 388, FOLDER = [BX + 310, 128];
    const bubble = shadow(BX, 90, 340, 76, 10, 2) + rect(BX, 90, 340, 76, { r: 10, fill: C.white }) + rect(BX + 20, 111, 28, 34, { r: 4, fill: "#e8eaed", stroke: "#c4c7c5" }) +
      text(BX + 62, 124, "nikahkit-….zip", { size: 14, fill: C.crText }) + text(BX + 62, 144, "120 KB", { size: 13, fill: C.crSub }) + iconX("folder", FOLDER[0], FOLDER[1], 18, C.crIcon);
    const EX = 20, EY = 150, EW = 760, EH = 560, IX = EX + 220, IY = EY + 110, menuY = IY + 40;
    const content = (path) => rect(EX + 181, EY + 81, EW - 182, EH - 82, { fill: C.white }) + rect(EX + 72, EY + 44, EW - 92, 28, { r: 4, fill: C.white, stroke: "#dcdcdc" }) + text(EX + 84, EY + 63, path, { size: 13, fill: "#1f1f1f" });
    const els = {
      dl: dlBtn,
      dlIcon: { svg: dlIcon, enter: "pop", origin: DLI },
      bubble: { svg: bubble, enter: "pop", origin: [DLI[0], 90] },
      files: { svg: explorer(EX, EY, EW, EH, { title: "Unduhan", path: "Unduhan", side: "Unduhan" }) + zipIcon(IX, IY, "nikahkit-….zip", true), enter: "pop", origin: [EX + EW / 2, 430] },
      menu: { svg: shadow(IX + 70, menuY, 220, 168, 6, 2) + rect(IX + 70, menuY, 220, 168, { r: 6, fill: C.white, stroke: "#dcdcdc" }) + rect(IX + 76, menuY + 46, 208, 30, { r: 4, fill: "#e5eefb" }) +
        [0, 2, 3, 4].map((k) => rect(IX + 92, menuY + 16 + k * 32, [90, 0, 120, 70, 100][k], 9, { r: 4, fill: BAR })).join("") + text(IX + 92, menuY + 66, "Extract All...", { size: 13, fill: "#1f1f1f", weight: 500 }), enter: "pop", origin: [IX + 70, menuY] },
      extract: { svg: shadow(EX + 160, EY + 120, 580, 300, 8, 3) + rect(EX + 160, EY + 120, 580, 300, { r: 8, fill: C.white, stroke: "#cfd3d8" }) + text(EX + 184, EY + 156, "Extract Compressed (Zipped) Folders", { size: 15, weight: 500, fill: "#1f1f1f" }) +
        rect(EX + 184, EY + 196, 532, 32, { r: 4, fill: C.white, stroke: "#9aa0a6" }) + text(EX + 196, EY + 217, "C:\\Users\\Rina\\Downloads\\nikahkit-…", { size: 13, fill: "#1f1f1f" }) +
        rect(EX + 520, EY + 368, 96, 32, { r: 4, fill: "#0067c0" }) + text(EX + 568, EY + 389, "Extract", { size: 13, weight: 500, fill: C.white, anchor: "middle" }) +
        rect(EX + 624, EY + 368, 92, 32, { r: 4, fill: C.white, stroke: "#c4c7c5" }) + text(EX + 670, EY + 389, "Cancel", { size: 13, fill: "#1f1f1f", anchor: "middle" }), enter: "pop", origin: [EX + 450, EY + 270] },
      outer: { svg: folderIcon(IX + 160, IY + 4, "nikahkit-…", true) + rect(IX - 24, IY - 10, 112, 116, { fill: C.white }) + zipIcon(IX, IY, "nikahkit-….zip", false), enter: "pop", origin: [IX + 192, IY + 40] },
      inside: { svg: content("Unduhan › nikahkit-…") + folderIcon(IX, IY + 4, "NikahKit", true), enter: "fade" },
      mac: rect(EX + 200, EY + 380, 540, 76, { r: 10, fill: C.tint, stroke: C.accent, sw: 1.5 }) + text(EX + 220, EY + 410, "Mac: klik dua kali file ZIP.", { size: 15, weight: 600, fill: C.cocoa }) +
        text(EX + 220, EY + 436, "Folder NikahKit langsung muncul di folder Unduhan.", { size: 15, fill: C.cocoa }),
      nkFiles: { svg: content("Unduhan › nikahkit-… › NikahKit") + NK_FILES.map((f, i) => fileIcon(IX + i * 120, IY, f, i === 0)).join("") + text(IX + 4 * 120 + 32, IY + 50, "…", { size: 20, fill: "#9aa0a6", anchor: "middle" }), enter: "fade" },
      mfNote: { svg: note(IX + 60, IY + 150, "ada manifest.json: folder yang benar", IX + 32, IY + 100, { w: 300 }), delay: 0.3 },
      moved: { svg: explorer(EX, EY, EW, EH, { title: "Dokumen", path: "Dokumen", side: "Dokumen" }) + DOC_FOLDERS.map((f, i) => folderIcon(IX + i * 120, IY + 4, f, f === "NikahKit")).join(""), enter: "fade" }
    };
    return {
      title: "Mengunduh dan mengekstrak ZIP NikahKit", world: { x: 0, y: 41, w: WIN, h: 679 },
      base: [chrome(0, 0, WIN, 985, { tabs: [{ title: "Cara pasang NikahKit · Nikahin", active: true }], url: "assets.nikahin.workers.dev/brand-assets/nikahkit/pasang.html" }), page],
      els,
      steps: [
        { caption: "Buka halaman Cara pasang NikahKit di Chrome komputer.", at: [420, 63], dur: 3 },
        { caption: "Klik Unduh NikahKit. Chrome mengunduh ZIP NikahKit, sekitar 120 KB.", at: [DLX + DLW / 2, DLY + 26], click: true, press: "dl", show: ["dlIcon"], dur: 3.4 },
        { caption: "Buka folder Unduhan: klik ikon unduhan di kanan atas Chrome.", at: DLI, click: true, show: ["bubble"] },
        { caption: "Klik ikon folder di sebelah nama file. Folder Unduhan terbuka.", at: FOLDER, click: true, hide: ["bubble"], show: ["files"], dur: 3.4 },
        { caption: "Ekstrak ZIP (Windows): klik kanan file ZIP.", at: [IX + 32, IY + 36], click: true, show: ["menu"] },
        { caption: "Pilih Extract All... (di Windows Indonesia: Ekstrak Semua...).", at: [IX + 150, menuY + 61], click: true, hide: ["menu"], show: ["extract"] },
        { caption: "Klik Extract. Muncul folder bernama sama dengan ZIP.", at: [EX + 568, EY + 384], click: true, hide: ["extract"], show: ["outer"] },
        { caption: "Buka folder itu. Di dalamnya ada folder NikahKit.", at: [IX + 192, IY + 40], click: true, show: ["inside"] },
        { caption: "Mac: cukup klik dua kali file ZIP. Folder NikahKit langsung muncul.", show: ["mac"], dur: 3.4 },
        { caption: "Buka folder NikahKit: harus ada manifest.json, nk-bg.js, pin.html.", at: [IX + 32, IY + 40], click: true, hide: ["mac"], show: ["nkFiles", "mfNote"], dur: 3.6 },
        { caption: "Seret folder NikahKit ke Dokumen. Jangan disimpan di Unduhan.", at: [EX + 70, EY + 140], click: true, hide: ["mfNote"], show: ["moved"], dur: 3.6 }
      ]
    };
  })(),

  // Pasang bagian 2: chrome://extensions, Mode developer, Muat yang belum dibuka, pilih folder, kartu, sematkan.
  // The 800 x 715 Chrome window: the extensions page reflows to that width (search box shrinks).
  "pasang-load-unpacked": (() => {
    const W = WIN, url = "chrome://extensions", dev = devBtnRects(0, CT);
    const PW = 760, PH = 470, PX = (W - PW) / 2, PY = CT + 130;
    const row = (y, label, sel) => (sel ? rect(PX + 200, y, PW - 216, 30, { r: 5, fill: "#d3e3fd" }) : "") + iconX("folder", PX + 222, y + 15, 16, "#e5a531") + text(PX + 242, y + 20, label, { size: 13, fill: "#1f1f1f", weight: sel ? 600 : undefined });
    const picker = shadow(PX, PY, PW, PH, 10, 4) + rect(PX, PY, PW, PH, { r: 10, fill: C.white, stroke: "#cfd3d8" }) + rect(PX, PY, PW, 44, { r: 10, fill: "#f3f3f3" }) + rect(PX, PY + 34, PW, 10, { fill: "#f3f3f3" }) +
      text(PX + PW / 2, PY + 27, "Pilih folder ekstensi", { size: 13, weight: 600, fill: "#333", anchor: "middle" }) + line(PX, PY + 44.5, PX + PW, PY + 44.5, { stroke: "#e3e3e3" }) +
      rect(PX, PY + 45, 184, PH - 45 - 64, { fill: "#f6f6f6" }) + ["Desktop", "Dokumen", "Unduhan"].map((n, i) => (n === "Dokumen" ? rect(PX + 8, PY + 58 + i * 32, 168, 28, { r: 5, fill: "#e4e4e4" }) : "") + iconX("folder", PX + 26, PY + 72 + i * 32, 15, "#5e8fd8") + text(PX + 44, PY + 77 + i * 32, n, { size: 13, fill: "#1f1f1f" })).join("") +
      text(PX + 204, PY + 74, "Dokumen", { size: 12, weight: 600, fill: "#5e5e5e" }) + DOC_FOLDERS.map((f, i) => row(PY + 88 + i * 34, f, false)).join("") +
      line(PX, PY + PH - 64.5, PX + PW, PY + PH - 64.5, { stroke: "#e3e3e3" }) +
      rect(PX + PW - 232, PY + PH - 48, 100, 32, { r: 6, fill: C.white, stroke: "#c4c7c5" }) + text(PX + PW - 182, PY + PH - 27, "Batal", { size: 13, fill: "#1f1f1f", anchor: "middle" }) +
      rect(PX + PW - 120, PY + PH - 48, 100, 32, { r: 6, fill: "#0a7cff" }) + text(PX + PW - 70, PY + PH - 27, "Select", { size: 13, weight: 600, fill: C.white, anchor: "middle" });
    const PUZ = [W - 100, 63], MX = W - 400, PINAT = [MX + 272, 152];
    const els = {
      typed: text(166, 68, url, { size: 14, fill: C.crText }),
      page: { svg: extPage(0, CT, { w: W }), enter: "fade", delay: 1.3 },
      devPage: { svg: extPage(0, CT, { w: W, dev: true }), enter: "fade" },
      picker: { svg: rect(0, CT, W, LAP - CT, { fill: "rgba(0,0,0,.32)" }) + picker, enter: "pop", origin: [PX + PW / 2, PY + PH / 2] },
      rowSel: { svg: row(PY + 122, "NikahKit", true) + note(PX + 420, PY + 200, "berisi manifest.json", PX + 320, PY + 140, { w: 190 }) },
      card: { svg: text(384, CT + 182, "Semua Ekstensi", { size: 16, fill: C.crText }) + extCardR(EXT_CARD.x, CT + EXT_CARD.y) },
      cardRing: { svg: ring(EXT_CARD.x, CT + EXT_CARD.y, 400, 208, { r: 10 }), delay: 0.3 },
      menu: { svg: shadow(MX, 80, 340, 190, 10, 3) + rect(MX, 80, 340, 190, { r: 10, fill: C.white }) + text(MX + 22, 114, "Ekstensi", { size: 15, weight: 500, fill: C.crText }) +
        nkLogo(MX + 32, 152, 20) + text(MX + 54, 157, "NikahKit", { size: 13, fill: C.crText }) + pinIc(PINAT[0], 152, 17, C.crIcon) + iconX("more-vertical", MX + 310, 152, 17, C.crIcon) +
        line(MX, 196, MX + 340, 196, { stroke: "#e3e3e3" }) + iconX("settings", MX + 32, 232, 17, C.crIcon) + text(MX + 54, 237, "Kelola ekstensi", { size: 13, fill: C.crText }), enter: "pop", origin: [PUZ[0], 80] },
      pinOn: { svg: rect(PINAT[0] - 12, 140, 24, 24, { r: 12, fill: C.crBlueSoft }) + pinIc(PINAT[0], 152, 17, C.crBlue) + rect(W - 168, 44, 50, 38, { fill: C.white }) + rect(W - 196, 46, 34, 34, { r: 17, fill: C.crOmni }) + nkLogo(W - 140, 63, 18), enter: "fade" }
    };
    return {
      title: "Memasang NikahKit lewat Muat yang belum dibuka", world: { w: W, h: LAP },
      base: [chrome(0, 0, W, LAP, { tabs: [{ title: "Ekstensi", active: true, fav: favChrome }] })],
      els,
      steps: [
        { caption: "Klik kolom alamat Chrome, ketik chrome://extensions, lalu tekan Enter.", at: [300, 63], click: true, type: [{ id: "typed", n: url.length, box: [166, 52, tw(url, 14), 22] }], show: ["typed", "page"], dur: 3.6 },
        { caption: "Nyalakan Developer mode (Mode developer) di kanan atas sampai biru.", at: [W - 25, CT + 28], click: true, show: ["devPage"] },
        { caption: "Klik Load unpacked (Muat yang belum dibuka). Pemilih folder terbuka.", at: mid(dev[0]), click: true, show: ["picker"], dur: 3.4 },
        { caption: "Di Dokumen, klik sekali folder NikahKit (berisi manifest.json).", at: [PX + 280, PY + 137], click: true, show: ["rowSel"], dur: 3.6 },
        { caption: "Klik Select. Kartu NikahKit muncul dengan sakelar biru menyala.", at: [PX + PW - 70, PY + PH - 32], click: true, hide: ["picker", "rowSel"], show: ["card", "cardRing"], dur: 3.6 },
        { caption: "Sematkan (opsional): klik ikon puzzle di kanan atas Chrome.", at: PUZ, click: true, hide: ["cardRing"], show: ["menu"] },
        { caption: "Klik ikon pin di samping NikahKit. Ikonnya tampil di toolbar.", at: PINAT, click: true, show: ["pinOn"], dur: 3.4 }
      ]
    };
  })(),

  // Pasang bagian 3: app.scalev.com, Landing Pages, halaman HTML Mode, tab NikahKit, panel Masuk ke NikahKit.
  // An 880 window: the narrowest that still shows the list's HTML Mode column next to the Scalev sidebar.
  "gabung-tab-nikahkit-muncul": (() => {
    const g = GATE_OUT(0, CT), W = LP_W;
    const home = scalevApp(0, CT, { active: "Home" }) + text(280, CT + 35, "Home", { size: 18, weight: 700, fill: C.ink }) + [0, 1].map((k) => rect(280 + k * 290, CT + 80, 276, 140, { r: 8, fill: C.page, stroke: "#e6e8ec" })).join("");
    const lp = svMenuAt("Landing Pages");
    const els = {
      list: { svg: clipped(0, CT, W, VIEW, scalevApp(0, CT, { active: "Landing Pages" }) + lpList(0, CT)), enter: "fade" },
      editor: { svg: crTop({ tabs: [TAB_ED], url: URL }, W) + edPage("Code", undefined, W), enter: "fade" },
      gate: { svg: gateEl(g), enter: "fade" },
      gRing: { svg: ring(...g.at.google, { r: 6 }), delay: 0.5 }
    };
    return {
      title: "Tab NikahKit muncul di editor Scalev", world: { w: W, h: LAP },
      base: [chrome(0, 0, W, LAP, { tabs: [{ title: "Scalev", active: true, fav: favScalev }], url: "app.scalev.com" }), clipped(0, CT, W, VIEW, home)],
      els,
      steps: [
        { caption: "Buka app.scalev.com. Editor sudah terbuka? Muat ulang dengan F5.", at: [330, 63], dur: 3 },
        { caption: "Klik menu Landing Pages. Daftar halamanmu tampil.", at: [lp[0], CT + lp[1]], click: true, show: ["list"] },
        { caption: "Klik halaman undangan yang memakai HTML Mode. Editor terbuka.", at: [LP_NAME + tw(PAGE, 14, 500) / 2, CT + 362], click: true, hide: ["list"], show: ["editor"], dur: 3.4 },
        { caption: "Klik tab NikahKit: Masuk ke NikahKit. dan tombol Masuk dengan Google.", at: TAB_NK, click: true, show: ["gate", "gRing"], dur: 4 }
      ]
    };
  })(),

  // Masuk dengan Google: editor, tab NikahKit, jendela NikahKit, jendela Google, masuk berhasil.
  "gabung-masuk-google": (() => {
    const g = GATE_OUT(0, CT);
    const chk = dlg({ state: "checking", msg: null }), out = dlg({ state: "out", msg: null, gDisabled: true }), inn = dlg({});
    const GX = 340, GY = 110, GW = 440, GH = 560;
    const google = shadow(GX, GY, GW, GH, 10, 4) + rect(GX, GY, GW, GH, { r: 10, fill: C.white, stroke: "#d0d4d9" }) + rect(GX, GY, GW, 40, { r: 10, fill: C.crFrame }) + rect(GX, GY + 30, GW, 10, { fill: C.crFrame }) +
      rect(GX + 10, GY + 7, GW - 20, 26, { r: 13, fill: C.white }) + icon("lock", GX + 26, GY + 20, 12, C.crIcon) + text(GX + 40, GY + 25, "accounts.google.com", { size: 12, fill: C.crText }) +
      gLogo(GX + 32, GY + 70, 24) + text(GX + 32, GY + 140, "Pilih akun", { size: 26, fill: "#1f1f1f" }) +
      line(GX + 32, GY + 200.5, GX + GW - 32, GY + 200.5, { stroke: "#e3e3e3" }) + circle(GX + 52, GY + 236, 16, { fill: "#7cacf8" }) + text(GX + 52, GY + 241, "R", { size: 14, weight: 600, fill: C.white, anchor: "middle" }) +
      text(GX + 80, GY + 231, "Rina WO", { size: 14, weight: 500, fill: "#1f1f1f" }) + text(GX + 80, GY + 250, EMAIL, { size: 12, fill: C.crSub }) + line(GX + 32, GY + 272.5, GX + GW - 32, GY + 272.5, { stroke: "#e3e3e3" }) +
      circle(GX + 52, GY + 304, 14, { stroke: C.crSub }) + text(GX + 80, GY + 309, "Gunakan akun lain", { size: 14, weight: 500, fill: "#1f1f1f" }) + line(GX + 32, GY + 336.5, GX + GW - 32, GY + 336.5, { stroke: "#e3e3e3" });
    const els = {
      urlRing: URL_RING,
      gate: { svg: gateEl(g), enter: "fade" },
      dim: { svg: DIM, enter: "fade" },
      chk: { svg: chk.svg, enter: "pop", origin: DLG_O },
      out: { svg: out.svg, enter: "fade", delay: 1 },
      google: { svg: google, enter: "pop", origin: [GX + GW / 2, GY + GH / 2], delay: 1.1 },
      inn: { svg: inn.svg, enter: "fade" },
      emailRing: ring(inn.X + 10, inn.Y + 58, 420, 26, { r: 6 }),
      msgRing: ring(...inn.at.msg, { r: 6 })
    };
    return {
      title: "Masuk ke NikahKit dengan akun Google", world: LAP_WORLD,
      base: edBase("Code"),
      els,
      steps: [
        { caption: "Buka editor halaman Scalev yang memakai HTML Mode.", at: URL_AT, show: ["urlRing"], dur: 3 },
        { caption: "Klik tab NikahKit. Panel menampilkan Masuk ke NikahKit.", at: TAB_NK, click: true, hide: ["urlRing"], show: ["gate"] },
        { caption: "Klik Masuk dengan Google. Memeriksa login..., lalu jendela Google terbuka.", at: mid(g.at.google), click: true, show: ["dim", "chk", "out", "google"], dur: 4 },
        { caption: "Pilih akun Google: klik akunmu. Jendela Google menutup sendiri.", at: [GX + 200, GY + 238], click: true, hide: ["google", "chk", "out"], show: ["inn"], dur: 3.6 },
        { caption: "Lihat jendela NikahKit: email Google-mu, Keluar, kartu Paket dan Bisnis Scalev.", show: ["emailRing"], dur: 3.6 },
        { caption: "Di bawah kartu tertulis Sudah masuk. Kembali ke editor Scalev.", hide: ["emailRing"], show: ["msgRing"], dur: 3.4 }
      ]
    };
  })(),

  // Pilih paket (steps): editor, tab NikahKit, Pilih paket di panel, kartu Paket, tabel (laptop: the dialog scrolls), Pilih.
  "gabung-pilih-paket": (() => {
    const g = GATE_NONE(0, CT), d0 = dlg({}), t = planDlg(0, CT, VIEW - 32);
    const D = 110; // scroll: brings the staff and CSV rows into view and Kembali out from under the close button
    const under = edPage("NikahKit") + DIM;
    // The card clips its scrolling content: copies of what lies above and below it, drawn over the scrolled content.
    const frameMask = clipped(t.X - 4, 0, 768, t.Y, chrome(0, 0, WIN, LAP, { tabs: [TAB_ED], url: URL }) + under) + clipped(t.X - 4, t.Y + t.H, 768, LAP - t.Y - t.H, under) + t.close;
    const els = {
      urlRing: URL_RING,
      gate: { svg: gateEl(g), enter: "fade" },
      dim: { svg: DIM, enter: "fade" },
      d0: { svg: d0.svg, enter: "pop", origin: DLG_O },
      frame: { svg: t.frame, enter: "pop", origin: DLG_O },
      body: { svg: t.body, enter: "pop", origin: DLG_O },
      mask: { svg: frameMask, enter: "fade" },
      prices: ring(t.col(0) + 6, t.t0 + 58, 3 * t.pc - 12, 28, { r: 6 }),
      noRows: { svg: ring(t.tx + 4, t.rowY[4] + 2 - D, 720, t.rowY[5] + t.rowsH[5] - t.rowY[4] - 4, { r: 6 }), delay: 1.1 },
      payTab: { svg: crTop({ tabs: TABS_PAY, url: "nikahin.myscalev.com/pay/…" }) + payPage(), enter: "fade" }
    };
    return {
      title: "Membuka tabel Pilih paket di NikahKit", world: LAP_WORLD,
      base: edBase("Code"),
      els,
      steps: [
        { caption: "Buka editor halaman Scalev yang memakai HTML Mode.", at: URL_AT, show: ["urlRing"], dur: 3 },
        { caption: "Klik tab NikahKit di samping Settings. Panel NikahKit terbuka.", at: TAB_NK, click: true, hide: ["urlRing"], show: ["gate"] },
        { caption: "Akun belum berlangganan? Klik Pilih paket. Muncul kartu Paket.", at: mid(g.at.choose), click: true, show: ["dim", "d0"], dur: 3.4 },
        { caption: "Klik Pilih paket di kartu Paket. Tabel Pilih paket muncul.", at: mid(d0.at.choose), click: true, hide: ["d0"], show: ["frame", "body", "mask"], dur: 3.4 },
        { caption: "Baca tabelnya: Bulanan Rp79.000, Tahunan Rp299.000, Sekali Bayar Rp699.000.", show: ["prices"], at: [t.col(1) + 60, t.t0 + 75], dur: 3.8 },
        { caption: "Tanda silang: akun staff dan impor CSV tidak ada di Bulanan.", hide: ["prices"], scroll: { id: "body", dy: D }, show: ["noRows"], at: [t.col(0) + 21, t.rowY[4] + 22 - D], dur: 3.8 },
        { caption: "Klik Pilih di kolom paket yang kamu mau. Halaman bayar terbuka di tab baru.", hide: ["noRows"], scroll: { id: "body", dy: -D }, at: mid(t.btns[1]), click: true, show: ["payTab"], dur: 4 }
      ]
    };
  })(),

  // Pilih paket, bayar di tab Scalev, Cek pembayaran, tutup, Periksa lagi.
  "gabung-bayar-paket": (() => {
    const gn = GATE_NONE(0, CT), t = planDlg(0, CT, VIEW - 32);
    const d0 = dlg({}), d1 = dlg({ paid: true, msg: ["Halaman bayar terbuka di tab baru. Setelah bayar, tekan Cek", "pembayaran."] });
    const d2 = dlg({ ...LIC_ON, msg: ["Langganan aktif. Tekan Periksa lagi di panel NikahKit."] });
    const els = {
      dim: { svg: DIM, enter: "fade" },
      d0: { svg: d0.svg, enter: "fade" },
      table: { svg: t.svg, enter: "pop", origin: DLG_O },
      d1: { svg: d1.svg, enter: "fade" },
      payTab: { svg: crTop({ tabs: TABS_PAY, url: "nikahin.myscalev.com/pay/…" }) + payPage(), enter: "fade" },
      payDone: { svg: payDone, enter: "pop", origin: PAYBTN },
      paidRing: { svg: ring(...d1.at.paid, { r: 6 }), delay: 0.3 },
      d2: { svg: d2.svg, enter: "fade" },
      okRing: { svg: ring(...d2.at.msg, { r: 6 }), delay: 0.3 },
      open: { svg: nkOpen(CT), enter: "fade" }
    };
    return {
      title: "Memilih paket dan membayar di Scalev", world: LAP_WORLD,
      base: [...edBase("NikahKit", ""), gn.svg],
      els,
      steps: [
        { caption: "Klik Pilih paket di kartu Paket. Tabel Pilih paket muncul.", at: mid(d0.at.choose), click: true, hide: ["d0"], show: ["table"] },
        { caption: "Klik Pilih di kolom paket yang kamu mau. Halaman bayar terbuka di tab baru.", at: mid(t.btns[1]), click: true, hide: ["table"], show: ["d1", "payTab"], dur: 3.6 },
        { caption: "Pilih QRIS atau Virtual Account, lalu bayar sebelum batas waktu.", at: PAYBTN, click: true, show: ["payDone"], dur: 3.6 },
        { caption: "Kembali ke tab editor Scalev. Di kartu Paket ada tombol Cek pembayaran.", at: [200, 23], click: true, hide: ["payTab", "payDone"], show: ["paidRing"], dur: 3.6 },
        { caption: "Klik Cek pembayaran. Kartu Paket berubah, muncul Langganan aktif.", at: mid(d1.at.paid), click: true, hide: ["d1", "paidRing"], show: ["d2", "okRing"], dur: 3.8 },
        { caption: "Tutup jendela NikahKit: tekan Esc, atau klik area gelap di luarnya.", at: DARK, click: true, hide: ["d2", "okRing", "dim"] },
        { caption: "Klik Periksa lagi di panel. Rail editor NikahKit muncul.", at: mid(gn.at.recheck), click: true, show: ["open"], dur: 3.6 }
      ]
    };
  })(),

  // Punya kode uji? (pin.js: prompt("Kode uji"), then "Kode diterima. ..."; the review code grants Bulanan for 30 days).
  "gabung-kode-uji": (() => {
    const d0 = dlg({}), d1 = dlg({ license: ["Paket Bulanan, aktif sampai 13 November 2026."], choose: "Perpanjang atau ganti paket", active: true, msg: ["Kode diterima. Kembali ke editor Scalev, lalu Periksa lagi."] });
    const QW = 448, QX = (WIN - QW) / 2, QY = CT + 6, QH = 176, code = "KODE-UJI";
    const prompt = shadow(QX, QY, QW, QH, 12, 3) + rect(QX, QY, QW, QH, { r: 12, fill: C.white }) + rect(QX + 24, QY + 24, 200, 10, { r: 5, fill: BAR }) +
      text(QX + 24, QY + 66, "Kode uji", { size: 14, fill: C.crText }) + rect(QX + 24.5, QY + 80.5, 399, 35, { r: 4, fill: C.white, stroke: C.crBlue, sw: 2 }) +
      rect(QX + 280.5, QY + 128.5, 71, 31, { r: 16, fill: C.white, stroke: "#747775" }) + text(QX + 316, QY + 149, "Batal", { size: 13, weight: 500, fill: C.crBlue, anchor: "middle" }) +
      rect(QX + 360, QY + 128, 64, 32, { r: 16, fill: C.crBlue }) + text(QX + 392, QY + 149, "Oke", { size: 13, weight: 500, fill: C.white, anchor: "middle" });
    const OKE = [QX + 392, QY + 144];
    const els = {
      d0: d0.svg,
      prompt: { svg: prompt, enter: "pop", origin: [QX + QW / 2, QY] },
      code: text(QX + 36, QY + 104, code, { size: 14, fill: C.crText }),
      d1: { svg: d1.svg, enter: "fade" },
      okRing: { svg: ring(...d1.at.msg, { r: 6 }), delay: 0.3 }
    };
    return {
      title: "Memakai kode uji di jendela NikahKit", world: LAP_WORLD,
      base: [...edBase("NikahKit", ""), GATE_NONE(0, CT).svg, DIM],
      els,
      steps: [
        { caption: "Klik Punya kode uji? di bawah kartu Paket. Kotak Kode uji muncul.", at: mid(d0.at.redeem), click: true, show: ["prompt"], dur: 3.4 },
        { caption: "Ketik kode dari tim Nikahin di kotak Kode uji.", at: [QX + 300, QY + 98], click: true, type: [{ id: "code", n: code.length, box: [QX + 36, QY + 87, tw(code, 14), 22] }], show: ["code"] },
        { caption: "Klik Oke. Muncul Kode diterima. Kembali ke editor Scalev, lalu Periksa lagi.", at: OKE, click: true, hide: ["prompt", "code", "d0"], show: ["d1", "okRing"], dur: 4 }
      ]
    };
  })(),

  // Hubungkan bisnis Scalev: editor, gate, jendela NikahKit, kartu Bisnis Scalev, jendela Scalev, Hubungkan ulang, tutup, Periksa lagi.
  "gabung-hubungkan-scalev": (() => {
    const gb = GATE_BIZ(0, CT);
    const d1 = dlg(LIC_ON), d2 = dlg({ ...LIC_ON, biz: BIZ, msg: ["Bisnis Scalev terhubung."] });
    const els = {
      urlRing: URL_RING,
      gate: { svg: gateEl(gb), enter: "fade" },
      dim: { svg: DIM, enter: "fade" },
      d1: { svg: d1.svg, enter: "pop", origin: DLG_O },
      bizRing: ring(...d1.at.bizCard, { r: 10 }),
      login: { svg: scalevWin(false), enter: "pop", origin: [SW.x + SW.w / 2, SW.y + SW.h / 2] },
      consent: { svg: scalevWin(true), enter: "fade" },
      d2: { svg: d2.svg, enter: "fade" },
      linked: { svg: ring(...d2.at.bizCard, { r: 10 }) + ring(...d2.at.msg, { r: 6 }), delay: 0.3 },
      open: { svg: nkOpen(CT), enter: "fade" }
    };
    return {
      title: "Menghubungkan bisnis Scalev ke akun NikahKit", world: LAP_WORLD,
      base: edBase("Code"),
      els,
      steps: [
        { caption: "Buka editor halaman undangan di Scalev. Pastikan halaman sudah disimpan.", at: URL_AT, show: ["urlRing"], dur: 3 },
        { caption: "Klik tab NikahKit. Panel: Hubungkan bisnis Scalev dulu.", at: TAB_NK, click: true, hide: ["urlRing"], show: ["gate"] },
        { caption: "Klik Hubungkan bisnis Scalev di panel. Jendela NikahKit muncul.", at: mid(gb.at.connect), click: true, show: ["dim", "d1"], dur: 3.4 },
        { caption: "Cari kartu Bisnis Scalev, paling bawah: Belum terhubung.", at: [d1.X + 360, d1.at.bizCard[1] + 30], show: ["bizRing"] },
        { caption: "Klik Hubungkan bisnis Scalev di kartu itu. Jendela Scalev terbuka.", at: mid(d1.at.connect), click: true, hide: ["bizRing"], show: ["login"], dur: 3.4 },
        { caption: "Masuk ke Scalev bila diminta, dengan akun pemilik bisnis halamanmu.", at: SW_BTN, click: true, hide: ["login"], show: ["consent"], dur: 3.4 },
        { caption: "Setujui akses NikahKit. Ada pilihan bisnis? Pilih bisnis halamanmu.", at: SW_BTN, click: true, hide: ["consent", "d1"], show: ["d2"], dur: 3.6 },
        { caption: "Kartu menampilkan nama bisnismu, tombolnya jadi Hubungkan ulang.", show: ["linked"], dur: 3.6 },
        { caption: "Tutup jendela NikahKit: tekan Esc, atau klik area gelap di luarnya.", at: DARK, click: true, hide: ["d2", "linked", "dim"] },
        { caption: "Klik Periksa lagi di panel. Rail editor NikahKit muncul.", at: mid(gb.at.recheck), click: true, show: ["open"], dur: 3.6 }
      ]
    };
  })(),

  // Update: banner (nomor versi tidak ditampilkan), unduh, ekstrak, salin, timpa folder lama, ↻ di chrome://extensions, muat ulang.
  "gabung-update": (() => {
    const tabsEd = [TAB_ED, { title: "Ekstensi", active: false, fav: favChrome }];
    const tabsExt = [{ ...TAB_ED, active: false }, { title: "Ekstensi", active: true, fav: favChrome }];
    const EX = 20, EY = 140, EW = 760, EH = 560, IX = EX + 220, IY = EY + 110;
    const files = (sel) => NK_FILES.map((f, i) => fileIcon(IX + i * 130, IY, f, sel)).join("");
    const RX = EX + 180, RY = EY + 150, REPL = [RX + 270, RY + 106];
    const replace = shadow(RX, RY, 540, 250, 8, 3) + rect(RX, RY, 540, 250, { r: 8, fill: C.white, stroke: "#cfd3d8" }) + rect(RX + 24, RY + 30, 260, 12, { r: 6, fill: BAR }) +
      rect(RX + 24, RY + 80, 492, 52, { r: 6, fill: "#e5eefb", stroke: "#99c9ef" }) + iconX("check", RX + 48, RY + 106, 18, "#0067c0", 2.5) + text(RX + 72, RY + 111, "Replace the files in the destination", { size: 14, weight: 500, fill: "#1f1f1f" }) +
      rect(RX + 24, RY + 146, 492, 40, { r: 6, fill: C.white }) + rect(RX + 72, RY + 162, 180, 9, { r: 4, fill: BAR });
    const UPD = [88 + 12 + 43, CT + 169 + 54 + 18]; // Update button in the banner
    const els = {
      hint: { svg: nkOpen(CT, { banner: true, hint: true }), enter: "fade" },
      newWin: { svg: explorer(EX, EY, EW, EH, { title: "NikahKit", path: "Unduhan › nikahkit-… › NikahKit", side: "Unduhan" }) + files(false), enter: "pop", origin: [EX + EW / 2, 420] },
      sel: { svg: files(true), enter: "fade", delay: 0.9 },
      old: { svg: explorer(EX, EY, EW, EH, { title: "NikahKit", path: "Dokumen › NikahKit", side: "Dokumen" }) + files(false), enter: "fade" },
      replace: { svg: replace, enter: "pop", origin: [RX + 270, RY + 125], delay: 0.9 },
      pasted: { svg: files(true), enter: "fade" },
      ext: { svg: crTop({ tabs: tabsExt, url: "chrome://extensions" }) + clipped(0, CT, WIN, VIEW, extPage(0, CT, { w: WIN, dev: true, card: true })), enter: "fade" },
      spin: { svg: ring(RELOAD[0] - 14, RELOAD[1] - 14, 28, 28, { r: 14 }), enter: "fade" },
      after: { svg: crTop({ tabs: tabsEd, url: URL }) + edPage("NikahKit") + nkOpen(CT), enter: "fade" }
    };
    return {
      title: "Memperbarui NikahKit ke versi terbaru", world: LAP_WORLD,
      base: [chrome(0, 0, WIN, LAP, { tabs: tabsEd, url: URL }), edPage("NikahKit"), nkOpen(CT, { banner: true })],
      els,
      steps: [
        { caption: "Ada versi baru? Banner kuning muncul di panel. Tidak ada? Bantuan, Cek update.", at: [UPD[0] + 60, UPD[1] - 40], dur: 3.6 },
        { caption: "Klik Update. ZIP terunduh, banner menampilkan petunjuk singkat.", at: UPD, click: true, show: ["hint"], dur: 3.4 },
        { caption: "Ekstrak ZIP baru, lalu buka folder NikahKit yang baru.", at: [IX + 300, IY + 220], show: ["newWin"] },
        { caption: "Pilih semua isinya (Ctrl+A atau Cmd+A), lalu salin (Ctrl+C atau Cmd+C).", at: [IX + 420, IY + 240], show: ["sel"], dur: 3.6 },
        { caption: "Buka folder NikahKit lama, misalnya di Dokumen. Tempel (Ctrl+V).", at: [EX + 90, EY + 140], click: true, hide: ["newWin", "sel"], show: ["old", "replace"], dur: 3.6 },
        { caption: "Pilih Replace the files in the destination: ganti semua file.", at: REPL, click: true, hide: ["replace"], show: ["pasted"], dur: 3.4 },
        { caption: "Buka chrome://extensions di tab Ekstensi.", at: [460, 23], click: true, hide: ["old", "pasted"], show: ["ext"] },
        { caption: "Klik ↻ di kartu NikahKit, di samping sakelar.", at: RELOAD, click: true, show: ["spin"] },
        { caption: "Kembali ke editor, tekan F5 (Cmd+R di Mac), klik tab NikahKit.", at: TAB_NK, click: true, hide: ["ext", "spin"], show: ["after"], dur: 3.8 }
      ]
    };
  })()
};
