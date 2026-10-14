// Scalev setup scenes: halaman HTML Mode, slug, simpan/terbit, Security CSP, custom domain, e-payment, verifikasi WA,
// thumbnail (Canva + SEO & Page Identity), tutorial resmi. World = a 1440x985 Chrome window (Scalev from y 85), each
// scene cropped to the part it explains. Scalev app, editor and the Settings tab (14 Okt 2026, page 365671) are
// measured; Domain, Stores, Security, Cloudflare, WhatsApp and Canva's editor were not, so they stay generic: grey bars
// instead of unverified labels, and only the labels the guide pages name.
import {
  C, chrome, favScalev, CHROME_TOP, scalevEditor, ED, scalevApp, svMenuAt, nkHead, nkDialogHead, nkBtn, nkInput, nkLabel, nkHint,
  nkNote, nkAcc, nkH3, icon, iconX, note, ring, dim, shadow, clipped, text, para, rect, line, circle, tw
} from "../lib.mjs";

const T = CHROME_TOP; // Scalev content top (y 85)
const SV = { blue: "#3b8fd0", link: "#2f86d1", ink: "#1f2d3d", sub: "#6b7480", line: "#e5e8ec", bg: "#f8f9fb", soft: "#e6f2fb", bar: "#e9edf2" };
const SERIF = "Georgia,'Times New Roman',serif";

// ---- shared pieces ----------------------------------------------------------------------------------------------------
const win = (url = "app.scalev.com") => chrome(0, 0, 1440, 985, { tabs: [{ title: "Scalev", active: true, fav: favScalev }], url });
const urlSwap = (url) => rect(150, 48, 700, 30, { fill: C.crOmni }) + text(166, 68, url, { size: 14, fill: C.crText });
const at = (p) => [p[0], p[1] + T];
const menu = (n) => at(svMenuAt(n));
const bar = (x, y, w, h = 10, fill = SV.bar) => rect(x, y, w, h, { r: h / 2, fill });
// Scalev buttons (app): primary blue, outline, plain.
function svBtn(x, y, label, o = {}) {
  const v = o.variant ?? "primary", h = o.h ?? 40, size = o.size ?? 14, w = o.w ?? tw(label, size, 500) + 32;
  const fill = v === "primary" ? SV.blue : C.white, stroke = v === "primary" ? undefined : v === "outline" ? SV.blue : "#d5dae1";
  return rect(x + 0.5, y + 0.5, w - 1, h - 1, { r: 4, fill, stroke }) + text(x + w / 2, y + h / 2 + size * 0.36, label, { size, weight: 500, fill: v === "primary" ? C.white : v === "outline" ? SV.blue : SV.ink, anchor: "middle" });
}
const svInput = (x, y, w, value, o = {}) => rect(x + 0.5, y + 0.5, w - 1, (o.h ?? 40) - 1, { r: 4, fill: C.white, stroke: o.focus ? SV.blue : "#d5dae1", sw: o.focus ? 2 : 1 }) +
  (value ? text(x + 12, y + (o.h ?? 40) / 2 + 5, value, { size: 14, fill: o.placeholder ? "#9aa1ab" : SV.ink, mono: o.mono }) : "") + (o.select ? icon("chevron-down", x + w - 18, y + (o.h ?? 40) / 2, 16, SV.sub) : "");
const check = (x, y, on) => rect(x + 0.5, y + 0.5, 17, 17, { r: 3, fill: on ? SV.blue : C.white, stroke: on ? SV.blue : "#b8c0ca" }) + (on ? iconX("check", x + 9, y + 9, 13, C.white, 3) : "");
// Page header in the Scalev app main area (x 256..1440), like Landing Pages: title + rule.
const head = (title) => rect(256, T, 1184, 900, { fill: SV.bg }) + rect(256, T, 1184, 70, { fill: C.white }) + line(256, T + 70.5, 1440, T + 70.5, { stroke: SV.line }) + text(280, T + 43, title, { size: 18, weight: 600, fill: SV.ink });
const card = (x, y, w, h) => rect(x + 0.5, y + 0.5, w - 1, h - 1, { r: 6, fill: C.white, stroke: SV.line });
// Generic dashboard body (cards of grey bars) for screens we do not walk through.
const genericBody = (y = T + 94) => [0, 1, 2].map((i) => card(280 + i * 380, y, 364, 120) + bar(300 + i * 380, y + 24, 120) + bar(300 + i * 380, y + 56, 220, 18) + bar(300 + i * 380, y + 92, 160)).join("") +
  card(280, y + 144, 1124, 380) + [0, 1, 2, 3, 4, 5].map((k) => bar(304, y + 180 + k * 52, [520, 380, 600, 300, 460, 340][k])).join("");
// Lucide megaphone (Template panel: Marketing segment), same stroke style as lib icons.
const megaphone = (cx, cy, size = 16, color = C.text) => `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></g>`;
// Style-clipped element (the clip stays put while an inner group scrolls).
const clipCss = (id, x, y, w, h) => `<style>#e-${id}{clip-path:url(#cl-${id})}</style><defs><clipPath id="cl-${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs>`;

// Invitation cover in the plain preview screen (390 wide), from the Dasar template in editor-template.png.
function cover(sx, sy, h = 784) {
  const cx = sx + 195, m = "#8c2f1f";
  let s = rect(sx, sy, 390, h, { fill: "#fdf6ee" }) + rect(sx, sy, 390, 22, { fill: m });
  for (let i = 0; i < 8; i++) s += circle(sx + 22 + i * 49.4, sy + 22, 18, { fill: m });
  s += `<path d="M${cx - 70} ${sy + 300} V${sy + 176} a70 70 0 0 1 140 0 V${sy + 300} Z" fill="#d8c6b0" stroke="${m}" stroke-width="2"/>` +
    circle(cx, sy + 200, 26, { fill: "#efe6da" }) + `<path d="M${cx - 50} ${sy + 300} q50 -90 100 0 Z" fill="#efe6da"/>` +
    text(cx, sy + 330, "The Wedding Of", { size: 17, fill: "#1f1f1f", anchor: "middle", font: SERIF }) +
    text(cx, sy + 392, "Rani & Dimas", { size: 44, fill: m, anchor: "middle", font: SERIF, italic: true });
  if (h > 450) s += text(cx, sy + 452, "Minggu, 14 Februari 2027", { size: 15, weight: 700, fill: "#1f1f1f", anchor: "middle", font: SERIF }) +
    text(cx, sy + 474, "#RaniDimas", { size: 13, fill: "#3a3a3a", anchor: "middle", font: SERIF }) +
    text(cx, sy + 510, "Kepada Yth. Bapak/Ibu/Saudara/i", { size: 13, weight: 700, fill: "#1f1f1f", anchor: "middle", font: SERIF }) +
    text(cx, sy + 532, "Tamu Undangan", { size: 17, fill: m, anchor: "middle", font: SERIF }) +
    rect(cx - 86, sy + 568, 172, 48, { r: 24, fill: m }) + icon("mail", cx - 52, sy + 592, 16, C.white) + text(cx + 10, sy + 597, "Buka Undangan", { size: 15, fill: C.white, anchor: "middle", font: SERIF });
  return s;
}
const SC = { x: ED.screen.x, y: ED.screen.y + T };
// Konten panel body (editor-konten.png without the update note): language select, Sampul, open Mempelai group.
function kontenBody() {
  const y = T;
  return nkLabel(88, y + 181, "Bahasa undangan") + nkInput(88, y + 189, 279, "Indonesia", { select: true }) +
    para(88, y + 245, ["Hanya halaman tamu. Teks bawaan ikut berganti;", "teks yang sudah diubah tetap."], { size: 12, fill: C.faint, lh: 16 }) +
    text(88, y + 289, "Urutan dan tampilan bagian di ", { size: 12, fill: C.faint }) + text(88 + tw("Urutan dan tampilan bagian di ", 12), y + 289, "Lapisan", { size: 12, fill: C.strong, underline: true }) +
    nkAcc(88, y + 305, 279, "Sampul", { badge: "Terisi" }) + rect(88.5, y + 363.5, 278, 600, { r: 4, fill: C.white, stroke: C.line }) + nkAcc(88, y + 363, 279, "Mempelai", { open: true, badge: "Terisi" }) +
    nkLabel(101, y + 433, "Judul") + nkInput(101, y + 441, 253, "Mempelai") + nkLabel(101, y + 501, "Urutan nama") + nkInput(101, y + 509, 253, "Wanita dulu", { select: true }) +
    nkH3(101, y + 581, "Mempelai Wanita") + nkLabel(101, y + 605, "Nama panggilan") + nkInput(101, y + 613, 253, "Rani") + nkHint(101, y + 665, "Tampil di sampul.") +
    nkLabel(101, y + 693, "Nama lengkap dan gelar") + nkInput(101, y + 701, 253, "Rani Ayu, S.Psi.") + nkLabel(101, y + 761, "Profesi") + nkInput(101, y + 769, 253, "Psikolog") +
    nkLabel(101, y + 829, "Keterangan orang tua") + nkInput(101, y + 837, 253, "Putri kedua dari Bapak Ahmad") + rect(72, y + 885, 327, 15, { fill: C.white });
}
const editorKonten = (o = {}) => scalevEditor(0, T, { tab: "NikahKit", rail: "Konten", ...o }) + nkHead(0, T, "Konten") + kontenBody() + cover(SC.x, SC.y);
// The Simpan / Simpan & Terbitkan buttons again, as elements that can dip when pressed.
const btnSimpan = rect(1193, T + 50, 82, 34, { r: 4, fill: C.white, stroke: C.svBtnLine, sw: 2 }) + text(1201, T + 72, "Simpan", { size: 13, weight: 500, fill: C.strong }) + iconX("file-text", 1258, T + 67, 15, C.strong);
const btnPub = rect(1283, T + 50, 151, 34, { r: 4, fill: C.primary }) + text(1403, T + 72, "Simpan & Terbitkan", { size: 13, weight: 500, fill: C.white, anchor: "end" }) + iconX("rocket", 1418, T + 67, 15, C.white);

// ---- 1. Landing Pages → HTML Mode → NikahKit → Simpan --------------------------------------------------------------
const LP_ROWS = [["Undangan Rani & Dimas", "/rani-dimas"], ["Undangan Sari & Bima", "/sari-bima"], ["Contoh Undangan", "/contoh"], ["Katalog Rina WO", "/katalog"]];
function lpPage() {
  const y = T;
  return rect(256, y, 1184, 900, { fill: SV.bg }) + rect(256, y, 1184, 137, { fill: C.white }) + line(256, y + 137.5, 1440, y + 137.5, { stroke: SV.line }) +
    text(280, y + 36, "Landing Pages", { size: 18, weight: 600, fill: SV.ink }) + line(280, y + 58.5, 1400, y + 58.5, { stroke: SV.line }) +
    text(469, y + 93, "Checkout form creation has moved.", { size: 13, fill: "#3b4350" }) + text(469, y + 112, "Create a checkout form here →", { size: 13, fill: SV.link, underline: true }) +
    iconX("search", 1203, y + 97, 15, SV.sub) + text(1223, y + 103, "Cari landing page...", { size: 13, fill: "#a6adb7" }) +
    rect(1360.5, y + 78.5, 40, 40, { r: 4, fill: C.white, stroke: "#d5dae1" }) + `<path d="M${1371} ${y + 89} h18 l-7 9 v7 l-4 2 v-9 z" fill="none" stroke="#4a5361" stroke-width="1.6" stroke-linejoin="round"/>` +
    rect(280, y + 163, 1120, 54, { r: 4, fill: "#eef8fb" }) + circle(308, y + 190, 7, { stroke: SV.blue, sw: 1.5 }) + text(308, y + 194, "i", { size: 10, weight: 700, fill: SV.blue, anchor: "middle" }) +
    text(336, y + 195, "Looking for landing pages with an order form? They're now called Checkout Flows.", { size: 14, fill: SV.ink }) +
    text(336 + tw("Looking for landing pages with an order form? They're now called Checkout Flows. ", 14) - 12, y + 195, "Open Checkout Flows", { size: 14, fill: SV.ink, underline: true }) +
    card(281, y + 244, 1119, 680) + line(520.5, y + 244, 520.5, y + 900, { stroke: SV.line }) +
    text(297, y + 275, "Folders", { size: 14, weight: 600, fill: SV.ink }) + para(297, y + 294, ["Kelompokkan landing page per", "campaign, produk, atau klien."], { size: 11, fill: SV.sub, lh: 16 }) +
    rect(297, y + 328, 207, 36, { r: 4, fill: "#eef6fc" }) + icon("layout-grid", 316, y + 346, 15, SV.blue) + text(335, y + 351, "All Landing Pages", { size: 14, weight: 500, fill: SV.link }) + text(498, y + 351, "4", { size: 12, fill: SV.link, anchor: "end" }) +
    [["Ungrouped", "file-text", 4], ["Page", "folder", 0], ["Undangan", "folder", 0]].map(([n, ic, c], i) => iconX(ic, 316, y + 384 + i * 38, 15, "#4a5361") + text(335, y + 389 + i * 38, n, { size: 14, fill: "#3b4350" }) + text(498, y + 389 + i * 38, String(c), { size: 12, fill: SV.sub, anchor: "end" })).join("") +
    rect(297.5, y + 488.5, 206, 41, { r: 4, fill: C.white, stroke: SV.blue }) + text(400, y + 514, "+  New Folder", { size: 14, weight: 500, fill: SV.link, anchor: "middle" }) +
    text(537, y + 273, "All Landing Pages", { size: 14, weight: 600, fill: SV.ink }) + text(667, y + 273, "4", { size: 12, fill: SV.sub }) +
    rect(521, y + 293, 879, 38, { fill: "#f6f8fa" }) + check(537, y + 303, false) +
    [["Nama Landing Page", 585], ["Folder", 785], ["Slug", 925], ["Mode", 1125], ["Domains", 1245]].map(([l, x]) => text(x, y + 316, l, { size: 12, fill: SV.sub })).join("");
}
function lpRow(i) {
  const [name, slug] = LP_ROWS[i], y = T + 331 + i * 71;
  return rect(521, y, 879, 71, { fill: C.white }) + line(521, y + 70.5, 1400, y + 70.5, { stroke: SV.line }) + check(537, y + 27, false) +
    text(585, y + 41, name, { size: 14, weight: 500, fill: SV.link }) + rect(787, y + 24, 92, 24, { r: 4, fill: "#f3f4f6" }) + iconX("file-text", 800, y + 36, 12, SV.sub) + text(812, y + 40, "Ungrouped", { size: 12, fill: "#3b4350" }) +
    text(925, y + 41, slug, { size: 14, fill: SV.link }) + rect(1125, y + 22, 83, 28, { r: 3, fill: SV.soft }) + text(1166.5, y + 40, "HTML Mode", { size: 12, weight: 700, fill: SV.blue, anchor: "middle" }) +
    text(1245, y + 41, "-", { size: 14, fill: SV.sub }) + [0, 1, 2].map((k) => circle(1364 + k * 7, y + 36, 2.2, { fill: "#3b4350" })).join("");
}
const CREATE = { x: 280, y: T + 78, w: 173, h: 40 };
const btnCreate = svBtn(CREATE.x, CREATE.y, "+ Create Landing Page", { w: CREATE.w, size: 14 });
// Type chooser (not captured): modal with a generic tile and the HTML Mode tile.
const DLG = { x: 470, y: T + 260, w: 500, h: 300 };
const typeDlg = shadow(DLG.x, DLG.y, DLG.w, DLG.h, 8, 3) + rect(DLG.x, DLG.y, DLG.w, DLG.h, { r: 8, fill: C.white }) + bar(DLG.x + 24, DLG.y + 30, 180, 12, "#dfe4ea") + iconX("x", DLG.x + DLG.w - 30, DLG.y + 36, 18, SV.sub) +
  rect(DLG.x + 24.5, DLG.y + 74.5, 215, 190, { r: 6, fill: C.white, stroke: SV.line }) + icon("layout-grid", DLG.x + 132, DLG.y + 140, 34, "#b8c0ca", 1.6) + bar(DLG.x + 82, DLG.y + 196, 100, 10) + bar(DLG.x + 62, DLG.y + 220, 140, 8) +
  rect(DLG.x + 260.5, DLG.y + 74.5, 215, 190, { r: 6, fill: "#f3f9fd", stroke: SV.blue, sw: 2 }) + icon("code-xml", DLG.x + 368, DLG.y + 140, 34, SV.blue, 1.8) + text(DLG.x + 368, DLG.y + 204, "HTML Mode", { size: 16, weight: 700, fill: SV.ink, anchor: "middle" }) + bar(DLG.x + 298, DLG.y + 222, 140, 8);
const HTML_TILE = [DLG.x + 368, DLG.y + 170];
// Desktop preview (no NikahKit yet): empty white page across the preview area.
const desktopPreview = rect(400, T + 93, 1040, 807, { fill: C.svPreview }) + rect(424, T + 106, 992, 794, { fill: C.white }) + shadow(424, T + 106, 992, 0);
// Template panel (editor-template.png, update note left out): segment, template cards.
const TEMPLATES = [["Dasar", "#55524f"], ["Folio", "#2e2e33"], ["Galeri Putih", "#f6f4f1"], ["Modern Estetik", "#efe7dc"]];
function templatePanel() {
  const y = T;
  let s = nkHead(0, T, "Template") + rect(88.5, y + 169.5, 278, 37, { r: 4, fill: C.white, stroke: C.field }) + rect(89, y + 170, 138, 36, { r: 3, fill: C.primarySoft }) +
    icon("layout-grid", 129, y + 188, 16, C.action) + text(141, y + 193, "Template", { size: 12, weight: 600, fill: C.action }) + line(227.5, y + 170, 227.5, y + 206, { stroke: C.field }) + megaphone(297, y + 188, 16, C.text);
  TEMPLATES.forEach(([n, tone], i) => {
    const cx = 88 + (i % 2) * 145, cy = y + 219 + Math.floor(i / 2) * 241;
    s += rect(cx + 0.5, cy + 0.5, 132, 165, { r: 6, fill: "#f2f5fa", stroke: C.line }) + rect(cx + 5, cy + 5, 72, 156, { r: 3, fill: tone }) +
      [0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => rect(cx + 84 + (k % 2) * 22, cy + 8 + Math.floor(k / 2) * 34, 18, 28, { r: 2, fill: k % 3 ? "#e4e0da" : "#cfc8bf" })).join("") +
      text(cx + 41, cy + 70, n.split(" ")[0], { size: 9, fill: tone === "#f6f4f1" || tone === "#efe7dc" ? "#6b5b4a" : "#f2ece4", anchor: "middle", font: SERIF }) +
      text(cx, cy + 184, n, { size: 14, weight: 500, fill: C.strong }) + para(cx, cy + 205, [i ? "20 bagian · HP &" : "Polos · 20 bagian · HP &", "desktop · ID/EN"], { size: 12, fill: C.text, lh: 16 });
  });
  return s + rect(72, y + 685, 327, 215, { fill: C.white }) + rect(88, y + 701, 133, 165, { r: 6, fill: "#f2f5fa" }) + rect(233, y + 701, 133, 165, { r: 6, fill: "#f2f5fa" });
}
// Locked rail menus (disabled buttons) and the native title tooltip.
const lockRail = ["Gaya", "Audio", "Lapisan", "Konten"].map((n) => rect(0, T + ED.rail[n][1] - 26, 71, 52, { fill: C.page, opacity: 0.6 })).join("");
const lockTip = shadow(46, T + 210, 198, 26, 4) + rect(46.5, T + 210.5, 197, 25, { r: 4, fill: "#ffffff", stroke: "#c7c7c7" }) + text(56, T + 227, "Simpan halaman di Scalev dulu.", { size: 12, fill: "#1f1f1f" });
// Settings tab (measured 14 Okt 2026): header row (version, status, Batalkan Penerbitan) and accordions.
const lu = (paths, cx, cy, size, color) => `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</g>`;
const ACC_ICON = {
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>'
};
const ACC = [["DOMAIN / URL", "globe"], ["SEO & PAGE IDENTITY", "search"], ["ANALYTICS SETTINGS", "chart"], ["PAGE MANAGEMENT", "users"], ["ADVANCED SETTINGS", "code"]];
const accGrad = `<defs><linearGradient id="svAcc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#12ade0"/><stop offset="1" stop-color="#087eac"/></linearGradient></defs>`;
// One accordion at y (section top); h = section height when open.
const acc = (y, i, h = 0) => rect(17, y + 1, 364, (h || 60) - 2, { r: 8, fill: C.white, stroke: "#e8ebef", sw: 2 }) + rect(18, y + 2, 362, h ? 58 : 56, { r: 6, fill: h ? "#eef2f6" : "#f3f5f7" }) +
  rect(30, y + 14, 32, 32, { r: 8, fill: "url(#svAcc)" }) + lu(ACC_ICON[ACC[i][1]], 46, y + 30, 16, C.white) +
  text(72, y + 35, ACC[i][0], { size: 12, weight: 700, fill: "#344157" }).replace("<text", '<text letter-spacing="0.96"') + icon(h ? "chevron-up" : "chevron-down", 359, y + 30, 14, "#7c899b");
const svField = (x, y, w, h = 42) => rect(x + 1, y + 1, w - 2, h - 2, { r: 4, fill: "#f6f9fc", stroke: "#dbdfe5", sw: 2 });
const svLabel = (x, y, s) => text(x, y, s, { size: 12, weight: 500, fill: "#5b6675" });
// Panel background + header row (published pages only) + accordions; open = index of the open accordion (Domain only).
function settingsPanel({ pub = true, open = 0, now } = {}) {
  let s = accGrad + rect(0, T + 93, 399, 807, { fill: C.white });
  if (pub) s += rect(16, T + 112, 49, 20, { r: 4, fill: "#f3f5f7" }) + text(40.5, T + 126, "ver. 37", { size: 12, weight: 500, fill: "#5b6675", anchor: "middle" }) +
    text(73, T + 127, "Diterbitkan", { size: 14, weight: 500, fill: "#15c15d" }) + text(149, T + 127, "14/10/2026", { size: 14, fill: C.strong }) +
    rect(240, T + 105, 126, 34, { r: 4, fill: C.white, stroke: "#e8ebef", sw: 2 }) + text(303, T + 126, "Batalkan Penerbitan", { size: 12, weight: 500, fill: "#df0e03", anchor: "middle" });
  s += line(0, T + 153.5, 399, T + 153.5, { stroke: "#dbdfe5" });
  let y = T + 170;
  ACC.forEach((_, i) => {
    if (i === open) {
      s += acc(y, 0, 351) + svLabel(34, T + 259, "Slug URL") + text(88, T + 259, "*", { size: 12, weight: 500, fill: "#f14756" }) + svField(34, T + 274, 330) +
        (now ? text(34, T + 334, "Saat ini:", { size: 12, weight: 500, fill: C.strong }) + text(82, T + 334, now, { size: 12, weight: 500, fill: C.primary }) : "") +
        svLabel(34, T + 368, "Set as Homepage to Domains") + svField(34, T + 383, 330, 43) + text(48, T + 409, "Select Domain", { size: 14, fill: "#8d97a3" }) +
        svLabel(34, T + 455, "Limit to Domains") + svField(34, T + 470, 330, 43) + text(48, T + 496, "Select Custom Domain", { size: 14, fill: "#8d97a3" });
      y += 367;
    } else { s += acc(y, i); y += 76; }
  });
  return s;
}
const SLUG_IN = { x: 34, y: T + 274, w: 330 };
const slugText = (v) => text(48, T + 300, v, { size: 14, fill: "#0f161e" });
const slugFocus = rect(35, T + 275, 328, 40, { r: 4, stroke: C.primary, sw: 2 });
const SETTINGS_TAB = at(ED.tab.Settings);

// ---- 2. Bagikan dialog (editor-bagikan.png) ---------------------------------------------------------------------------
const SHARE_URL = ["https://tokomu.myscalev.com/rani-dimas?", "to=Nama+Tamu"];
function shareDialog(warn) {
  const d = warn ? 0 : -50, y = T;
  return nkDialogHead(0, T, "Bagikan") + (warn ? nkNote(16, y + 169, 366, ["Perubahan belum disimpan di Scalev."], { tone: "warn", h: 38 }) : "") +
    nkLabel(16, y + 231 + d, "Nama tamu") + nkInput(16, y + 239 + d, 366, "Nama Tamu") + nkHint(16, y + 295 + d, "Ditambahkan sebagai ?to=Nama.") +
    rect(16, y + 311 + d, 366, 52, { r: 4, fill: C.mutedBg }) + para(26, y + 332 + d, SHARE_URL, { size: 12, fill: C.strong, lh: 18 }).replace("<text", `<text font-family="'Roboto Mono',ui-monospace,Menlo,monospace"`) +
    nkBtn(16, y + 375 + d, "Lihat sebagai tamu", { w: 366, size: 14, icon: "eye" }) + nkBtn(16, y + 419 + d, "Salin tautan tamu", { w: 366, size: 14, variant: "ghost", icon: "copy" }) +
    nkBtn(16, y + 463 + d, "Salin tautan umum", { w: 366, size: 14, variant: "quiet", icon: "link" }) +
    nkH3(16, y + 535 + d, "Undangan khusus") + text(16, y + 572 + d, "Undangan khusus", { size: 14, fill: C.text }) + rect(346, y + 558 + d, 36, 20, { r: 10, fill: C.off }) + circle(356, y + 568 + d, 8, { fill: C.white }) +
    para(16, y + 601 + d, ["Isi undangan tidak ada di kode halaman. Server Nikahin", "mengirimnya hanya ke tamu dengan tautan sah."], { size: 12, fill: C.faint, lh: 16 }) +
    nkH3(16, y + 653 + d, "Untuk pengantin") + nkBtn(16, y + 665 + d, "Kirim undangan", { w: 366, size: 14, variant: "ghost", icon: "link" }) + nkBtn(16, y + 709 + d, "Buka Dashboard", { w: 366, size: 14, variant: "quiet", icon: "layout-grid" }) +
    nkHint(16, y + 761 + d, "Masuk dengan PIN dashboard.") + nkH3(16, y + 801 + d, "PIN dashboard") + nkBtn(16, y + 813 + d, "Kelola PIN dashboard", { w: 366, size: 14, icon: "lock" }) +
    nkHint(16, y + 865 + d, "PIN hanya tampil di jendela NikahKit.");
}
// ---- 3. Bantuan dialog with Izin domain (CSP) (editor-bantuan.png + help.jsx) -------------------------------------------
const CHECKS = ["Aplikasi Scalev (Nuxt/Vue)", "Komponen halaman studio", "HTML Mode aktif", "Editor kode (CodeMirror)", "Strip tab sidebar", "Area panel sidebar", "Iframe preview",
  "Inspect preview", "Sinkron device", "Media Scalev", "Izin CSP otomatis", "Hanya NikahKit yang aktif", "Versi editor Scalev", "Data undangan terbaca", "Klik di pratinjau",
  "Kode halaman cocok dengan NikahKit", "Penyimpanan ucapan dan RSVP", "Izin domain di tab Security", "Penulisan ke editor"];
const CSP = [
  { origin: ["https://wedding-guestbook.", "nikahin.workers.dev"], st: "Sudah diizinkan", why: ["Ucapan & RSVP (Nikahin) · Koneksi", "data (connect_src)"] },
  { origin: ["https://www.youtube.com"], st: "Ditambahkan otomatis", why: ["Musik atau video YouTube ·", "Bingkai (iframe) (frame_src)"] },
  { origin: ["https://foto.contoh.com"], st: "Perlu ditambah manual", why: ["Foto dari luar Media Scalev ·", "Gambar (img_src)"], todo: true },
  { origin: ["https://fonts.gstatic.com"], st: "Sudah diizinkan", why: ["Font Google · Font (font_src)"] }
];
const HB = (() => { // layout of the Bantuan body (world y), computed top-down like the real flex column
  const L = {}, y0 = T;
  let y = y0 + 169;
  L.update = y; y += 36 + 12;
  L.note = y; y += 56 + 12;
  L.hint = y; y += 32 + 8;
  L.checks = [];
  CHECKS.forEach((c) => { L.checks.push(y); y += c === "Izin domain di tab Security" ? 58 : 39; });
  y += 12; L.actions = y; y += 3 * 36 + 2 * 8 + 4; L.actionsHint = y + 12; y += 16 + 24;
  L.h3 = y; y += 16 + 8;
  L.rows = [];
  CSP.forEach((r) => { const h = 18 + 2 + r.origin.length * 16 + r.why.length * 16 + 2; L.rows.push([y, h]); y += h + 6; });
  y += 4; L.recheck = y; L.copy = y + 44; L.msg = y + 44 + 36 + 16;
  L.end = y + 140;
  return L;
})();
const HB_DY = HB.h3 - (T + 186); // scroll so the CSP heading sits under the dialog head
// Badge sized like the real one (10px medium; "Sudah diizinkan" is 83px wide in Scalev's Roboto, this font runs wider).
const bw = (label) => Math.round(label.length * 5.3) + 12;
const badge = (x, y, label, todo) => { const w = bw(label); return rect(x, y, w, 18, { r: 9, fill: todo ? C.warnSoft : C.okSoft }) + text(x + w / 2, y + 12.5, label, { size: 10, weight: 500, fill: todo ? C.warnStrong : C.ok, anchor: "middle" }); };
const cspRow = (r, y, h, st = r.st, todo = r.todo) => rect(16.5, y + 0.5, 350, h - 1, { r: 4, fill: C.white, stroke: C.line }) +
  para(27, y + 21, r.origin, { size: 12, fill: C.strong, lh: 16 }).replace("<text", `<text font-family="'Roboto Mono',ui-monospace,Menlo,monospace"`) +
  para(27, y + 21 + r.origin.length * 16 + 2, r.why, { size: 12, fill: C.text, lh: 16 }) +
  badge(356 - bw(st), y + h / 2 - 9, st, todo);
function helpBody() {
  let s = text(16, HB.update + 23, "Sudah versi terbaru.", { size: 14, fill: C.text }) + nkBtn(270, HB.update, "Cek update", { w: 97, size: 14, variant: "quiet" }) +
    nkNote(16, HB.note, 351, ["1 perlu perhatian. Muat ulang editor; bila tetap,", "kirim laporan."], { tone: "warn" }) +
    para(16, HB.hint + 12, ["Terbit tertahan \"not finished previewing\"? Muat ulang editor, lalu", "tekan Simpan & Terbitkan."], { size: 12, fill: C.faint, lh: 16 });
  CHECKS.forEach((c, i) => {
    const y = HB.checks[i], bad = c === "Izin domain di tab Security";
    s += circle(30, y + 18, 10, { fill: bad ? C.dangerSoft : C.okSoft }) + (bad ? text(30, y + 22, "!", { size: 12, weight: 700, fill: C.danger, anchor: "middle" }) : iconX("check", 30, y + 18, 12, C.ok, 2.6)) +
      text(50, y + 23, c, { size: 14, weight: 500, fill: C.strong }) + (bad ? text(50, y + 41, "https://foto.contoh.com (img_src)", { size: 12, fill: C.text }) : "") +
      line(16, (HB.checks[i + 1] ?? y + 39) - 0.5, 367, (HB.checks[i + 1] ?? y + 39) - 0.5, { stroke: C.line });
  });
  s += nkBtn(16, HB.actions, "Salin laporan", { w: 351, size: 14, variant: "ghost", icon: "copy" }) + nkBtn(16, HB.actions + 44, "Kirim lewat WhatsApp", { w: 351, size: 14, variant: "quiet", icon: "message-circle" }) +
    nkBtn(16, HB.actions + 88, "Panduan", { w: 351, size: 14, variant: "quiet", icon: "book-open" }) + nkHint(16, HB.actionsHint, "Tanpa data undangan.") + nkH3(16, HB.h3 + 12, "Izin domain (CSP)");
  CSP.forEach((r, i) => (s += cspRow(r, ...HB.rows[i])));
  return s + nkBtn(16, HB.recheck, "Periksa ulang", { w: 351, size: 14, variant: "ghost" }) + nkBtn(16, HB.copy, "Salin domain kurang", { w: 351, size: 14, variant: "quiet", icon: "copy" }) + rect(0, HB.end, 399, 400, { fill: C.white });
}
const up = (y) => y - HB_DY; // world y after the scroll
// Security tab (not captured): the seven source fields the guide names; NikahKit already filled some.
const SEC = ["Connect Sources", "Image Sources", "Media Sources", "Font Sources", "Style Sources", "Script Sources", "Frame Sources"];
const SEC_VAL = { "Connect Sources": "https://wedding-guestbook.nikahin.workers.dev", "Frame Sources": "https://www.youtube.com", "Script Sources": "https://www.youtube.com" };
const secY = (i) => T + 140 + i * 72;
const securityPanel = rect(0, T + 93, 399, 807, { fill: C.white }) + SEC.map((l, i) => text(20, secY(i), l, { size: 13, weight: 500, fill: C.strong }) +
  svInput(20, secY(i) + 10, 359, SEC_VAL[l] ? (SEC_VAL[l].length > 38 ? SEC_VAL[l].slice(0, 37) + "…" : SEC_VAL[l]) : "", { h: 40 })).join("");

// ---- 4/6. Settings (measured 14 Okt 2026): the sub-menu list; Domain and Profil pages not captured ------------------
const SUB = { x: 280, y: T + 94, w: 240 };
const SUB_ITEMS = ["Bisnis", "Verifikasi", "Anggota", "Peran", "Gudang", "Payment Methods", "Bank Transfer", "Discount Code", "Courier", "Analitik", "Privasi pelanggan",
  "Domain", "Integrations", "Billing", "Add-ons", "Bahasa", "Suppressed IPs", "Apps", "Developers", "Profil"];
const subAt = (n) => [SUB.x + 70, SUB.y + 26 + SUB_ITEMS.indexOf(n) * 27.5];
function settingsPage(active) {
  let s = scalevApp(0, T, { active: "Settings" }) + head("Settings") + card(SUB.x, SUB.y, SUB.w, 590);
  SUB_ITEMS.forEach((n, i) => {
    const [, cy] = subAt(n), on = n === active;
    if (on) s += rect(SUB.x + 12, cy - 13, SUB.w - 24, 26, { r: 4, fill: "#f3f5f7" });
    s += text(SUB.x + 22, cy + 5, n, { size: 13, weight: on ? 500 : 400, fill: on ? "#344157" : "#9aa1ab" });
  });
  return s;
}
const MAIN = { x: 544, y: T + 94, w: 860 };
const profileCard = (o = {}) => {
  const x = MAIN.x, y = MAIN.y;
  return card(x, y, MAIN.w, 330) + text(x + 24, y + 36, "Profil", { size: 16, weight: 600, fill: SV.ink }) + circle(x + 60, y + 104, 36, { fill: "#dbe7f3" }) + text(x + 60, y + 113, "R", { size: 26, weight: 600, fill: SV.blue, anchor: "middle" }) +
    bar(x + 120, y + 86, 180, 14, "#dfe4ea") + bar(x + 120, y + 114, 240) + [0, 1, 2].map((k) => bar(x + 24, y + 180 + k * 44, 100, 9, "#d5dae1") + bar(x + 220, y + 180 + k * 44, [220, 160, 0][k] || 1, 10)).join("") +
    icon("smartphone", x + 228, y + 273, 15, SV.sub) + (o.phone ? text(x + 244, y + 278, o.phone, { size: 14, fill: SV.ink }) : bar(x + 244, y + 268, 120, 10)) + (o.edit === false ? "" : svBtn(x + MAIN.w - 104, y + 16, "Edit", { variant: "plain", w: 80, h: 36 }));
};
const EDIT_BTN = [MAIN.x + MAIN.w - 64, MAIN.y + 34];
const PHONE_IN = { x: MAIN.x + 24, y: MAIN.y + 236, w: 360 };
const editForm = card(MAIN.x, MAIN.y, MAIN.w, 400) + text(MAIN.x + 24, MAIN.y + 36, "Profil", { size: 16, weight: 600, fill: SV.ink }) +
  [0, 1].map((k) => bar(MAIN.x + 24, MAIN.y + 72 + k * 78, 90, 9, "#d5dae1") + svInput(MAIN.x + 24, MAIN.y + 88 + k * 78, 360, "") + bar(MAIN.x + 36, MAIN.y + 103 + k * 78, [160, 210][k])).join("") +
  bar(MAIN.x + 24, MAIN.y + 228 - 6, 90, 9, "#d5dae1") + svInput(PHONE_IN.x, PHONE_IN.y, PHONE_IN.w, "", { focus: true }) + icon("smartphone", PHONE_IN.x + 18, PHONE_IN.y + 20, 15, SV.sub) +
  svBtn(MAIN.x + 24, MAIN.y + 318, "Save", { w: 80 });
const SAVE_BTN = [MAIN.x + 64, MAIN.y + 338];
const CEK = { x: PHONE_IN.x + PHONE_IN.w + 12, y: PHONE_IN.y };
// Domain section
const domainSection = card(MAIN.x, MAIN.y, MAIN.w, 520) + text(MAIN.x + 24, MAIN.y + 38, "Domain", { size: 16, weight: 600, fill: SV.ink }) +
  svBtn(MAIN.x + MAIN.w - 184, MAIN.y + 16, "Tambahkan Domain", { w: 160 }) + line(MAIN.x, MAIN.y + 72.5, MAIN.x + MAIN.w, MAIN.y + 72.5, { stroke: SV.line }) +
  icon("map", MAIN.x + MAIN.w / 2, MAIN.y + 170, 34, "#c3cad3", 1.6) + bar(MAIN.x + MAIN.w / 2 - 110, MAIN.y + 214, 220);
const ADD_BTN = [MAIN.x + MAIN.w - 104, MAIN.y + 36];
const MD = { x: 470, y: T + 250, w: 500, h: 210 };
const DOM_IN = { x: MD.x + 24, y: MD.y + 82, w: 452 };
const domainDlg = shadow(MD.x, MD.y, MD.w, MD.h, 8, 3) + rect(MD.x, MD.y, MD.w, MD.h, { r: 8, fill: C.white }) + text(MD.x + 24, MD.y + 40, "Tambahkan Domain", { size: 16, weight: 600, fill: SV.ink }) +
  iconX("x", MD.x + MD.w - 30, MD.y + 34, 18, SV.sub) + svInput(DOM_IN.x, DOM_IN.y, DOM_IN.w, "", { focus: true }) + svBtn(MD.x + MD.w - 104, MD.y + 146, "Simpan", { w: 80 });
const DOM_SAVE = [MD.x + MD.w - 64, MD.y + 166];
const DNS_ROWS = [["A", "undangan"], [null, null], [null, null]];
const dnsHead = rect(MAIN.x + 1, MAIN.y + 73, MAIN.w - 2, 446, { fill: C.white }) + text(MAIN.x + 24, MAIN.y + 110, "undangan.namabrand.com", { size: 15, weight: 600, fill: SV.ink, mono: true }) +
  rect(MAIN.x + 24, MAIN.y + 130, MAIN.w - 48, 36, { fill: "#f6f8fa" }) + [["Type", 40], ["Name", 160], ["Target", 380]].map(([l, dx]) => text(MAIN.x + dx, MAIN.y + 153, l, { size: 12, weight: 600, fill: SV.sub })).join("") +
  svBtn(MAIN.x + MAIN.w - 144, MAIN.y + 88, "Verifikasi", { variant: "outline", w: 120, h: 36 });
const VERIFY = [MAIN.x + MAIN.w - 84, MAIN.y + 106];
const dnsRow = (i) => {
  const y = MAIN.y + 166 + i * 52, [t, n] = DNS_ROWS[i];
  return line(MAIN.x + 24, y + 51.5, MAIN.x + MAIN.w - 24, y + 51.5, { stroke: SV.line }) + (t ? text(MAIN.x + 40, y + 31, t, { size: 14, weight: 600, fill: SV.ink, mono: true }) : bar(MAIN.x + 40, y + 21, 40)) +
    (n ? text(MAIN.x + 160, y + 31, n, { size: 14, fill: SV.ink, mono: true }) : bar(MAIN.x + 160, y + 21, 150)) + bar(MAIN.x + 380, y + 21, [260, 330, 300][i]) + iconX("file-text", MAIN.x + MAIN.w - 50, y + 26, 15, SV.sub);
};
const verified = icon("circle-check", MAIN.x + 246, MAIN.y + 105, 20, "#15a34a");
// Cloudflare DNS (not captured): a second window with the labels the guide names.
const CF = { x: 720, y: 400, w: 680, h: 330 };
const cfOrange = "#f38020";
const cfWin = shadow(CF.x, CF.y, CF.w, CF.h, 10, 4) + rect(CF.x, CF.y, CF.w, CF.h, { r: 10, fill: C.white }) + rect(CF.x, CF.y, CF.w, 44, { r: 10, fill: "#f2f2f2" }) + rect(CF.x, CF.y + 30, CF.w, 14, { fill: "#f2f2f2" }) +
  [["#ff5f57", 20], ["#febc2e", 40], ["#28c840", 60]].map(([c, dx]) => circle(CF.x + dx, CF.y + 22, 6, { fill: c })).join("") +
  `<path d="M${CF.x + 96} ${CF.y + 29} a8 8 0 0 1 3 -14 a10 10 0 0 1 19 3 a6 6 0 0 1 2 11 z" fill="${cfOrange}"/>` + text(CF.x + 128, CF.y + 28, "Cloudflare", { size: 14, weight: 600, fill: "#1f1f1f" }) +
  text(CF.x + 24, CF.y + 84, "DNS", { size: 18, weight: 600, fill: "#1f1f1f" }) + rect(CF.x + CF.w - 150, CF.y + 62, 126, 36, { r: 4, fill: "#0051c3" }) + text(CF.x + CF.w - 87, CF.y + 85, "Add Record", { size: 14, weight: 500, fill: C.white, anchor: "middle" }) +
  line(CF.x + 24, CF.y + 116.5, CF.x + CF.w - 24, CF.y + 116.5, { stroke: "#e5e5e5" }) + [0, 1].map((k) => bar(CF.x + 24, CF.y + 140 + k * 30, [400, 300][k], 9, "#ececec")).join("");
const CF_ADD = [CF.x + CF.w - 87, CF.y + 80];
const cfForm = rect(CF.x + 16, CF.y + 124, CF.w - 32, 190, { r: 6, fill: "#f8f9fb" }) + [["Type", 40, "A"], ["Name", 160, "undangan"], ["Target", 340, null]].map(([l, dx, v]) =>
  text(CF.x + dx, CF.y + 150, l, { size: 12, weight: 600, fill: "#4a4a4a" }) + rect(CF.x + dx + 0.5, CF.y + 158.5, l === "Target" ? 280 : l === "Name" ? 160 : 100, 35, { r: 4, fill: C.white, stroke: "#c9c9c9" }) +
  (v ? text(CF.x + dx + 10, CF.y + 181, v, { size: 14, fill: "#1f1f1f", mono: true }) : bar(CF.x + dx + 10, CF.y + 171, 200))).join("") +
  text(CF.x + 40, CF.y + 228, "Proxy status", { size: 12, weight: 600, fill: "#4a4a4a" }) + rect(CF.x + 40, CF.y + 242, 40, 22, { r: 11, fill: "#bdbdbd" }) + circle(CF.x + 51, CF.y + 253, 9, { fill: C.white }) +
  `<path d="M${CF.x + 96} ${CF.y + 261} a6 6 0 0 1 2 -11 a8 8 0 0 1 15 2 a5 5 0 0 1 2 9 z" fill="#9e9e9e"/>` + text(CF.x + 124, CF.y + 258, "DNS Only", { size: 14, weight: 600, fill: "#1f1f1f" });

// ---- 5. Stores (not captured) ---------------------------------------------------------------------------------------
const STORE_ROW = { x: 280, y: T + 94 };
const storesPage = scalevApp(0, T, { active: "Stores" }) + head("Stores") + card(280, T + 94, 1124, 300) + rect(281, T + 95, 1122, 40, { fill: "#f6f8fa" }) +
  [0, 1, 2].map((k) => bar(304 + k * 300, T + 111, 80, 9, "#d5dae1")).join("") +
  rect(281, T + 135, 1122, 64, { fill: C.white }) + circle(320, T + 167, 18, { fill: "#dbe7f3" }) + iconX("home", 320, T + 167, 16, SV.blue) +
  text(352, T + 172, "Rina WO", { size: 14, weight: 600, fill: SV.link }) + bar(604, T + 162, 180) + bar(904, T + 162, 120) + line(281, T + 199.5, 1403, T + 199.5, { stroke: SV.line }) +
  bar(352, T + 226, 130) + bar(604, T + 226, 160) + bar(904, T + 226, 90);
const STORE_AT = [384, T + 167];
const DET_TOP = T + 70;
const detHead = rect(256, T, 1184, 70, { fill: C.white }) + line(256, T + 70.5, 1440, T + 70.5, { stroke: SV.line }) + iconX("arrow-left", 290, T + 36, 18, SV.ink) + text(316, T + 43, "Rina WO", { size: 18, weight: 600, fill: SV.ink });
const TOP_SAVE = { x: 1300, y: T + 16 };
const topSave = svBtn(TOP_SAVE.x, TOP_SAVE.y, "Simpan", { w: 100 });
const PM_Y = T + 94 + 3 * 200; // Metode Pembayaran card top (before scroll)
const DET_DY = 520;
const detContent = rect(256, DET_TOP, 1184, 1500, { fill: SV.bg }) +
  [0, 1, 2].map((k) => card(280, T + 94 + k * 200, 1124, 176) + bar(304, T + 124 + k * 200, 160, 12, "#dfe4ea") + bar(304, T + 160 + k * 200, 360) + rect(304.5, T + 186.5 + k * 200, 520, 39, { r: 4, fill: C.white, stroke: "#d5dae1" }) + bar(316, T + 201 + k * 200, 200)).join("") +
  card(280, PM_Y, 1124, 200) + text(304, PM_Y + 38, "Metode Pembayaran", { size: 16, weight: 600, fill: SV.ink }) + bar(304, PM_Y + 62, 420) +
  svBtn(304, PM_Y + 90, "Pilih Metode Pembayaran", { variant: "outline", w: 220 }) + card(280, PM_Y + 224, 1124, 176) + bar(304, PM_Y + 254, 160, 12, "#dfe4ea");
const detBody = clipCss("detBody", 256, DET_TOP + 1, 1184, 900) + detContent;
const chosenRow = rect(304, PM_Y + 146 - DET_DY, 300, 36, { r: 4, fill: SV.soft }) + iconX("credit-card", 324, PM_Y + 164 - DET_DY, 16, SV.blue) + text(342, PM_Y + 169 - DET_DY, "Invoice · ALL E-Payment", { size: 14, weight: 500, fill: SV.ink });
// The store page after the dialog closes (body already scrolled), drawn over the dialog.
const detAfter = scalevApp(0, T, { active: "Stores" }) + clipped(256, DET_TOP + 1, 1184, 900, `<g transform="translate(0 ${-DET_DY})">${detContent}</g>`) + chosenRow + detHead;
const PICK = [414, PM_Y + 110 - DET_DY];
const PD = { x: 450, y: T + 230, w: 540, h: 290 };
const SEL = { x: PD.x + 24, y: PD.y + 72, w: 492 };
const payDlg = shadow(PD.x, PD.y, PD.w, PD.h, 8, 3) + rect(PD.x, PD.y, PD.w, PD.h, { r: 8, fill: C.white }) + bar(PD.x + 24, PD.y + 32, 200, 12, "#dfe4ea") + iconX("x", PD.x + PD.w - 30, PD.y + 38, 18, SV.sub) +
  svInput(SEL.x, SEL.y, SEL.w, "", { select: true }) + bar(SEL.x + 12, SEL.y + 15, 140) + check(PD.x + 24, PD.y + 150, false) +
  text(PD.x + 52, PD.y + 164, "Aktifkan Metode Pembayaran ALL E-Payment", { size: 14, fill: SV.ink }) + line(PD.x, PD.y + 210.5, PD.x + PD.w, PD.y + 210.5, { stroke: SV.line }) +
  svBtn(PD.x + PD.w - 104, PD.y + 230, "Simpan", { w: 80 });
const payMenu = shadow(SEL.x, SEL.y + 44, SEL.w, 132, 6, 2) + rect(SEL.x, SEL.y + 44, SEL.w, 132, { r: 6, fill: C.white }) + bar(SEL.x + 14, SEL.y + 64, 160) +
  rect(SEL.x + 4, SEL.y + 88, SEL.w - 8, 40, { r: 4, fill: SV.soft }) + text(SEL.x + 14, SEL.y + 113, "Invoice", { size: 14, weight: 500, fill: SV.ink }) + bar(SEL.x + 14, SEL.y + 150, 120);
const INVOICE_AT = [SEL.x + 60, SEL.y + 108];
const payVal = rect(SEL.x + 2, SEL.y + 2, SEL.w - 40, 36, { fill: C.white }) + text(SEL.x + 12, SEL.y + 25, "Invoice", { size: 14, fill: SV.ink });
const CHECK_AT = [PD.x + 33, PD.y + 159];
const DLG_SAVE = [PD.x + PD.w - 64, PD.y + 250];

// ---- 6. WhatsApp (not captured): chat window with the OTP draft to Scalev's official number ---------------------------
const WA = { x: 800, y: 190, w: 600, h: 470 };
const waGreen = "#008069";
const waWin = shadow(WA.x, WA.y, WA.w, WA.h, 10, 4) + rect(WA.x, WA.y, WA.w, WA.h, { r: 10, fill: "#efeae2" }) + rect(WA.x, WA.y, WA.w, 64, { r: 10, fill: "#f0f2f5" }) + rect(WA.x, WA.y + 50, WA.w, 14, { fill: "#f0f2f5" }) +
  circle(WA.x + 36, WA.y + 32, 20, { fill: "#dfe5e7" }) + icon("users", WA.x + 36, WA.y + 32, 18, "#8696a0") + text(WA.x + 68, WA.y + 38, "+6282125784683", { size: 15, weight: 500, fill: "#111b21" }) +
  rect(WA.x, WA.y + WA.h - 64, WA.w, 64, { r: 10, fill: "#f0f2f5" }) + rect(WA.x, WA.y + WA.h - 64, WA.w, 14, { fill: "#f0f2f5" });
const waDraft = rect(WA.x + 16, WA.y + WA.h - 52, WA.w - 92, 40, { r: 8, fill: C.white }) + bar(WA.x + 32, WA.y + WA.h - 37, 220, 10, "#c9d1d6") + bar(WA.x + 262, WA.y + WA.h - 37, 90, 10, "#9aa6ad");
const WA_SEND = [WA.x + WA.w - 38, WA.y + WA.h - 32];
const waSend = circle(WA_SEND[0], WA_SEND[1], 21, { fill: waGreen }) + icon("send", WA_SEND[0] - 1, WA_SEND[1], 18, C.white);
const waBubble = rect(WA.x + 16, WA.y + WA.h - 52, WA.w - 92, 40, { r: 8, fill: C.white }) +
  rect(WA.x + WA.w - 336, WA.y + WA.h - 150, 316, 64, { r: 8, fill: "#d9fdd3" }) + bar(WA.x + WA.w - 320, WA.y + WA.h - 132, 220, 10, "#a8c9a2") + bar(WA.x + WA.w - 320, WA.y + WA.h - 112, 90, 10, "#7fa978") +
  `<path d="M${WA.x + WA.w - 58} ${WA.y + WA.h - 100} l3 3 l6 -7 M${WA.x + WA.w - 52} ${WA.y + WA.h - 100} l3 3 l6 -7" fill="none" stroke="#53bdeb" stroke-width="1.6" stroke-linecap="round"/>`;
const confirmDlg = shadow(520, T + 260, 400, 220, 8, 3) + rect(520, T + 260, 400, 220, { r: 8, fill: C.white }) + bar(544, T + 292, 200, 12, "#dfe4ea") +
  icon("smartphone", 560, T + 352, 18, SV.sub) + text(578, T + 359, "081234567890", { size: 20, weight: 600, fill: SV.ink, mono: true }) + bar(544, T + 384, 300) +
  svBtn(776, T + 420, "Verifikasi", { w: 120 });
const VERIF_AT = [836, T + 440];
const cekBtn = svBtn(CEK.x, CEK.y, "Cek Verifikasi", { variant: "outline", w: 140 });

// ---- 7. Thumbnail: the square image, SEO & PAGE IDENTITY (measured), WhatsApp link card ---------------------------------
const JUDUL = "Undangan Rani & Dimas", DESC = ["Minggu, 14 Februari 2027.", "Mohon doa restu."], PUB_URL = "https://tokomu.myscalev.com/rani-dimas";
// The square image made in Canva (s = side in px).
const thumb = (x, y, s) => {
  const k = s / 300, cx = x + s / 2, ink = "#6b4a2f";
  return rect(x, y, s, s, { fill: "#efe4d8" }) + rect(x + 14 * k, y + 14 * k, s - 28 * k, s - 28 * k, { stroke: "#b08968", sw: Math.max(1, 2 * k) }) +
    text(cx, y + 118 * k, "RANI", { size: 46 * k, fill: ink, anchor: "middle", font: SERIF }) + text(cx, y + 160 * k, "&", { size: 30 * k, fill: ink, anchor: "middle", font: SERIF, italic: true }) +
    text(cx, y + 210 * k, "DIMAS", { size: 46 * k, fill: ink, anchor: "middle", font: SERIF }) + text(cx, y + 252 * k, "14 . 02 . 2027", { size: 17 * k, fill: ink, anchor: "middle", font: SERIF });
};
// SEO & PAGE IDENTITY open (Domain collapsed above). o: { judul, desc, img }.
function seoContent(o = {}) {
  const E = T + 727 + (o.img ? 299 : 164); // bottom of the image or upload box
  const F = E + 97; // Favicon label row
  let s = accGrad + rect(0, T + 154, 399, 1500, { fill: C.white }) + acc(T + 170, 0) + rect(17, T + 247, 364, F + 340 - (T + 246), { r: 8, fill: C.white, stroke: "#e8ebef", sw: 2 }) +
    rect(18, T + 248, 362, 58, { r: 6, fill: "#eef2f6" }) + rect(30, T + 260, 32, 32, { r: 8, fill: "url(#svAcc)" }) + lu(ACC_ICON.search, 46, T + 276, 16, C.white) +
    text(72, T + 281, ACC[1][0], { size: 12, weight: 700, fill: "#344157" }).replace("<text", '<text letter-spacing="0.96"') + icon("chevron-up", 359, T + 276, 14, "#7c899b") +
    svLabel(34, T + 335, "Judul Tag") + svField(34, T + 350, 315) + (o.judul ? text(48, T + 376, JUDUL, { size: 14, fill: "#0f161e" }) : "") +
    svLabel(34, T + 418, "Meta Description") + svField(34, T + 433, 315, 126) + (o.desc ? para(48, T + 459, DESC, { size: 14, fill: "#0f161e", lh: 20 }) : "") +
    rect(34, T + 584, 315, 104, { r: 4, fill: "#f6f9fc" }) + text(42, T + 603, "Pratinjau di Google Search", { size: 10, weight: 500, fill: "#5b6675" }) +
    (o.judul ? text(42, T + 629, JUDUL, { size: 14, weight: 500, fill: "#1a0dab" }) : "") + text(42, T + 647, PUB_URL, { size: 12, weight: 500, fill: "#006621" }) +
    (o.desc ? text(42, T + 673, DESC.join(" "), { size: 12, fill: "#545454" }) : "") +
    rect(34, T + 700, 315, E + 81 - (T + 700), { r: 4, fill: "#f6f9fc" }) + text(42, T + 719, "Pratinjau di Sosial Media", { size: 10, weight: 500, fill: "#5b6675" });
  s += o.img ? clipped(42, T + 727, 299, 299, thumb(42, T + 727, 299)) :
    rect(53, T + 738, 277, 142, { r: 4, stroke: "#e8ebef", sw: 2 }) + icon("upload", 191, T + 790, 22, C.primary) +
    text(191, T + 826, "Upload Meta Gambar", { size: 14, weight: 500, fill: C.primary, anchor: "middle" }) + text(191, T + 846, ".jpg, .jpeg, .png, .webp", { size: 12, fill: "#5b6675", anchor: "middle" });
  s += (o.judul ? text(42, E + 23, JUDUL, { size: 14, weight: 500, fill: "#0f161e" }) : "") + (o.desc ? text(42, E + 45, DESC.join(" "), { size: 12, fill: "#545454" }) : "") +
    text(42, E + 67, PUB_URL, { size: 12, fill: "#8d97a3" }) +
    text(34, F, "Favicon", { size: 12, weight: 500, fill: C.strong }) + rect(34, F + 15, 315, 164, { r: 4, fill: "#f6f9fc" }) + rect(45, F + 26, 293, 142, { r: 4, stroke: "#e8ebef", sw: 2 }) +
    icon("upload", 191, F + 70, 20, C.primary) + text(191, F + 106, "Upload Favicon", { size: 14, weight: 500, fill: C.primary, anchor: "middle" }) +
    text(191, F + 126, ".ico, .png, .jpeg, .jpg, .webp", { size: 12, fill: "#5b6675", anchor: "middle" }) +
    para(34, F + 210, ["Tampilkan halaman ini di search engine", "(Google, Bing, etc.)"], { size: 12, fill: "#5b6675", lh: 18 }) +
    rect(317, F + 210, 32, 16, { r: 8, fill: "#b6b6b6" }) + circle(326, F + 218, 6, { fill: C.white });
  const y = F + 356;
  return s + acc(y, 2) + acc(y + 76, 3) + acc(y + 152, 4);
}
const SEO_DY = 480; // scroll so Pratinjau di Sosial Media sits under the header row
const IMG = { x: 42, y: T + 727 - SEO_DY, s: 299 };
const seoAfter = (o) => clipCss(o.id, 0, T + 154, 399, 746) + (o.dy ? `<g transform="translate(0 ${-o.dy})">${seoContent(o)}</g>` : seoContent(o));
const imgHover = rect(IMG.x, IMG.y, IMG.s, IMG.s, { r: 4, fill: "rgba(65,64,66,.4)" }) +
  [["pencil", C.primary], ["trash", "#f14756"], ["eye", "#5b6675"]].map(([ic, c], i) => rect(129 + i * 46, IMG.y + 133, 34, 34, { r: 4, fill: "#e8ebef" }) + icon(ic, 146 + i * 46, IMG.y + 150, 16, c)).join("");
// WhatsApp outgoing bubble with the link card (square thumbnail, title, description, domain).
function waLink(x, y, w) {
  const p = 96, tx = x + p + 18;
  return rect(x, y, w, p + 72, { r: 8, fill: "#d9fdd3" }) + rect(x + 4, y + 4, w - 8, p, { r: 6, fill: "#c9eec3" }) + clipped(x + 4, y + 4, p, p, thumb(x + 4, y + 4, p)) +
    text(tx, y + 28, JUDUL, { size: 14, weight: 600, fill: "#111b21" }) + para(tx, y + 48, DESC, { size: 12, fill: "#4a5a63", lh: 16 }) + text(tx, y + 88, "tokomu.myscalev.com", { size: 12, fill: "#4a5a63" }) +
    text(x + 10, y + p + 30, PUB_URL, { size: 14, fill: "#027eb5" }) + text(x + w - 54, y + p + 60, "10.12", { size: 11, fill: "#667781" }) +
    `<path d="M${x + w - 20} ${y + p + 54} l3 3 l6 -7 M${x + w - 14} ${y + p + 54} l3 3 l6 -7" fill="none" stroke="#53bdeb" stroke-width="1.6" stroke-linecap="round"/>`;
}
const WAD = { x: 470, y: T + 130, w: 920, h: 520 };
const waDesk = shadow(WAD.x, WAD.y, WAD.w, WAD.h, 10, 4) + rect(WAD.x, WAD.y, WAD.w, WAD.h, { r: 10, fill: "#efeae2" }) + rect(WAD.x, WAD.y, WAD.w, 64, { r: 10, fill: "#f0f2f5" }) + rect(WAD.x, WAD.y + 50, WAD.w, 14, { fill: "#f0f2f5" }) +
  circle(WAD.x + 36, WAD.y + 32, 20, { fill: "#dfe5e7" }) + icon("users", WAD.x + 36, WAD.y + 32, 18, "#8696a0") + text(WAD.x + 68, WAD.y + 38, "Rina WO (Anda)", { size: 15, weight: 500, fill: "#111b21" }) +
  rect(WAD.x, WAD.y + WAD.h - 64, WAD.w, 64, { r: 10, fill: "#f0f2f5" }) + rect(WAD.x, WAD.y + WAD.h - 64, WAD.w, 14, { fill: "#f0f2f5" }) + rect(WAD.x + 16, WAD.y + WAD.h - 52, WAD.w - 32, 40, { r: 8, fill: C.white }) +
  waLink(WAD.x + WAD.w - 356, WAD.y + 220, 340);

// ---- 8. Canva (gallery measured from canva.com/wedding-invitations/templates; menus and editor not captured) ------------
const CV = { p: "#8b3dff", ink: "#0e1318", sub: "#545f71", top: 85 };
const favCanva = (cx, cy) => circle(cx, cy, 8, { fill: "#00c4cc" }) + text(cx, cy + 4, "C", { size: 10, weight: 700, fill: C.white, anchor: "middle" });
const crown = (cx, cy) => circle(cx, cy, 13, { fill: "rgba(30,30,30,.72)" }) +
  `<path transform="translate(${cx - 7} ${cy - 7}) scale(.58)" d="M11.6 3.3a.5.5 0 0 1 .9 0l2.9 5.6a1 1 0 0 0 1.5.3l4.3-3.7a.5.5 0 0 1 .8.5l-2.8 10.3a1 1 0 0 1-1 .7H5.8a1 1 0 0 1-1-.7L2 6a.5.5 0 0 1 .8-.5l4.3 3.7a1 1 0 0 0 1.5-.3z" fill="#f5c84c"/>`;
const CARDS = [[32, 256, "Classic Monogram Elegant…", 0], [312, 183, "Minimalist Save the Date…", 1], [519, 183, "Beige Elegance Wedding…", 0], [726, 256, "Vintage Blue Wedding Inv…", 1]];
const CY = CV.top + 225;
const cvCard = ([x, w, name, pro], i) => {
  const tone = ["#ffffff", "#5d5a57", "#f6f2ee", "#c9d8ea", "#f4efe6"][i], dark = i === 1, iw = w > 200 ? 130 : w - 16, ix = x + (w - iw) / 2;
  return rect(x, CY, w, 240, { r: 8, fill: "#e9e7e4" }) + rect(ix, CY + (w > 200 ? 26 : 8), iw, w > 200 ? 188 : 224, { r: 2, fill: tone }) +
    text(x + w / 2, CY + 92, i === 2 ? "OLIVIA" : "R | D", { size: 18, fill: dark ? "#f2ece4" : "#4a4a4a", anchor: "middle", font: SERIF }) +
    [0, 1, 2].map((k) => bar(x + w / 2 - 40 + k * 6, CY + 120 + k * 18, 80 - k * 12, 6, dark ? "#8f8b86" : "#d8d4cf")).join("") +
    (pro ? crown(x + w - 22, CY + 218) : "") + text(x, CY + 266, name, { size: 13, fill: CV.ink });
};
const CVW = 1060; // window width (the gallery reflows to four cards, as Canva does)
const CREATE_CV = { x: CVW - 220, y: CV.top + 20, w: 170, h: 40 };
const canvaWin = (o) => chrome(0, 0, CVW, 715, { tabs: o.tabs, url: o.url });
const gallery = canvaWin({ tabs: [{ title: "Wedding invitation templates | Canva", active: true, w: 300, fav: favCanva }], url: "canva.com/wedding-invitations/templates" }) +
  rect(0, CV.top, CVW, 630, { fill: C.white }) + rect(0, CV.top, CVW, 130, { fill: "#f4f1fe" }) +
  text(32, CV.top + 46, "Canva", { size: 30, weight: 700, fill: "#7d2ae8", italic: true, font: SERIF }) +
  ["Design", "Product", "Plans", "Business", "Education", "Help"].map((n, i) => text(330 + i * 92, CV.top + 45, n, { size: 15, weight: 500, fill: CV.ink })).join("") +
  rect(CREATE_CV.x, CREATE_CV.y, CREATE_CV.w, CREATE_CV.h, { r: 8, fill: CV.p }) + text(CREATE_CV.x + CREATE_CV.w / 2, CREATE_CV.y + 26, "Create a design", { size: 15, weight: 600, fill: C.white, anchor: "middle" }) +
  text(32, CV.top + 100, "Home  ›  Wedding invitation templates", { size: 14, fill: CV.ink }) +
  text(CVW / 2, CV.top + 160, "Wedding invitation templates", { size: 36, weight: 500, fill: CV.ink, anchor: "middle" }) +
  text(32, CV.top + 210, "Top printed wedding invites", { size: 19, weight: 600, fill: CV.ink }) + CARDS.map(cvCard).join("") +
  rect(32.5, CV.top + 525.5, 464, 42, { r: 8, fill: C.white, stroke: "#c9ced6" }) + iconX("search", 56, CV.top + 547, 17, CV.sub) + text(76, CV.top + 552, "Search thousands of templates", { size: 15, fill: CV.sub });
const POP = { x: CVW - 340, y: CV.top + 68, w: 290 };
const popBox = (h) => shadow(POP.x, POP.y, POP.w, h, 8, 3) + rect(POP.x, POP.y, POP.w, h, { r: 8, fill: C.white });
const cvPop = popBox(170) + rect(POP.x + 16.5, POP.y + 16.5, POP.w - 33, 39, { r: 6, stroke: "#c9ced6" }) + text(POP.x + 30, POP.y + 41, "What would you like to create?", { size: 13, fill: CV.sub }) +
  rect(POP.x + 8, POP.y + 72, POP.w - 16, 40, { r: 6, fill: "#f2f3f5" }) + icon("plus", POP.x + 32, POP.y + 92, 16, CV.ink) + text(POP.x + 50, POP.y + 97, "Custom size", { size: 14, weight: 500, fill: CV.ink }) +
  bar(POP.x + 22, POP.y + 134, 150, 9, "#e4e6ea");
const CUSTOM_AT = [POP.x + 100, POP.y + 92];
const cvSize = popBox(184) + text(POP.x + 16, POP.y + 32, "Custom size", { size: 15, weight: 600, fill: CV.ink }) +
  text(POP.x + 16, POP.y + 58, "Width", { size: 12, fill: CV.sub }) + text(POP.x + 128, POP.y + 58, "Height", { size: 12, fill: CV.sub }) +
  rect(POP.x + 16.5, POP.y + 66.5, 100, 39, { r: 6, stroke: "#c9ced6" }) + rect(POP.x + 128.5, POP.y + 66.5, 100, 39, { r: 6, stroke: "#c9ced6" }) +
  rect(POP.x + 240.5, POP.y + 66.5, 34, 39, { r: 6, stroke: "#c9ced6" }) + text(POP.x + 257.5, POP.y + 91, "px", { size: 13, fill: CV.ink, anchor: "middle" }) +
  rect(POP.x + 16, POP.y + 124, POP.w - 32, 42, { r: 8, fill: CV.p }) + text(POP.x + POP.w / 2, POP.y + 150, "Create new design", { size: 14, weight: 600, fill: C.white, anchor: "middle" });
const cvW = text(POP.x + 28, POP.y + 91, "1080", { size: 14, fill: CV.ink }), cvH = text(POP.x + 140, POP.y + 91, "1080", { size: 14, fill: CV.ink });
const NEW_AT = [POP.x + POP.w / 2, POP.y + 145];
// Canva editor (generic): gradient bar, tool rail, the 1080x1080 page with the elements copied from the template.
const SQ = { x: 351, y: CV.top + 92, s: 430 };
const SHARE_CV = { x: CVW - 130, y: CV.top + 12, w: 106, h: 34 };
const cvEditor = canvaWin({ tabs: [{ title: "Wedding invitations | Canva", w: 260, fav: favCanva }, { title: "rani-dimas - 1080 × 1080px", active: true, w: 260, fav: favCanva }], url: "canva.com/design" }) +
  `<defs><linearGradient id="cvBar" x1="0" x2="1"><stop offset="0" stop-color="#00c4cc"/><stop offset="1" stop-color="#7d2ae8"/></linearGradient></defs>` +
  rect(0, CV.top, CVW, 58, { fill: "url(#cvBar)" }) + text(24, CV.top + 35, "File", { size: 15, weight: 500, fill: C.white }) + text(80, CV.top + 35, "Resize", { size: 15, weight: 500, fill: C.white }) +
  rect(SHARE_CV.x, SHARE_CV.y, SHARE_CV.w, SHARE_CV.h, { r: 8, fill: C.white }) + icon("upload", SHARE_CV.x + 26, SHARE_CV.y + 17, 15, CV.ink) + text(SHARE_CV.x + 44, SHARE_CV.y + 23, "Share", { size: 15, weight: 600, fill: CV.ink }) +
  rect(0, CV.top + 58, 72, 572, { fill: "#f8f8fa" }) + ["layout-grid", "image", "type", "upload", "folder"].map((ic, i) => iconX(ic, 36, CV.top + 92 + i * 64, 20, CV.sub)).join("") +
  rect(72, CV.top + 58, CVW - 72, 572, { fill: "#ebecf0" }) + rect(SQ.x, SQ.y, SQ.s, SQ.s, { fill: "#efe4d8" }) + rect(SQ.x + 20, SQ.y + 20, SQ.s - 40, SQ.s - 40, { stroke: "#b08968", sw: 3 }) +
  `<path d="M${SQ.x + 40} ${SQ.y + 120} q60 -90 150 -70 M${SQ.x + SQ.s - 40} ${SQ.y + SQ.s - 120} q-60 90 -150 70" fill="none" stroke="#b08968" stroke-width="2"/>` +
  text(SQ.x + SQ.s / 2, SQ.y + SQ.s + 30, "1080 × 1080 px", { size: 14, fill: CV.sub, anchor: "middle" });
const cvNames = text(SQ.x + SQ.s / 2, SQ.y + 210, "RANI & DIMAS", { size: 44, fill: "#6b4a2f", anchor: "middle", font: SERIF });
const cvDate = text(SQ.x + SQ.s / 2, SQ.y + 268, "14 . 02 . 2027", { size: 26, fill: "#6b4a2f", anchor: "middle", font: SERIF });
const cvSel = rect(SQ.x + 60, SQ.y + 168, SQ.s - 120, 58, { stroke: CV.p, sw: 2 });
const SHP = { x: CVW - 380, y: CV.top + 56, w: 356 };
const shareBox = (h) => shadow(SHP.x, SHP.y, SHP.w, h, 8, 3) + rect(SHP.x, SHP.y, SHP.w, h, { r: 8, fill: C.white });
const cvShare = shareBox(220) + text(SHP.x + 20, SHP.y + 36, "Share this design", { size: 16, weight: 600, fill: CV.ink }) + bar(SHP.x + 20, SHP.y + 62, 200, 9, "#e4e6ea") +
  rect(SHP.x + 20.5, SHP.y + 84.5, SHP.w - 41, 39, { r: 6, stroke: "#c9ced6" }) + bar(SHP.x + 34, SHP.y + 100, 160, 8, "#e4e6ea") +
  rect(SHP.x + 12, SHP.y + 146, SHP.w - 24, 52, { r: 6, fill: "#f2f3f5" }) + icon("download", SHP.x + 40, SHP.y + 172, 18, CV.ink) + text(SHP.x + 62, SHP.y + 177, "Download", { size: 15, weight: 500, fill: CV.ink });
const DL_ROW = [SHP.x + 110, SHP.y + 172];
const cvDl = shareBox(220) + iconX("arrow-left", SHP.x + 28, SHP.y + 32, 18, CV.ink) + text(SHP.x + 48, SHP.y + 38, "Download", { size: 16, weight: 600, fill: CV.ink }) +
  text(SHP.x + 20, SHP.y + 78, "File type", { size: 13, weight: 500, fill: CV.ink }) + rect(SHP.x + 20.5, SHP.y + 88.5, SHP.w - 41, 41, { r: 6, stroke: "#c9ced6" }) +
  text(SHP.x + 34, SHP.y + 115, "PNG", { size: 14, fill: CV.ink }) + icon("chevron-down", SHP.x + SHP.w - 40, SHP.y + 109, 16, CV.ink) +
  rect(SHP.x + 20, SHP.y + 152, SHP.w - 40, 44, { r: 8, fill: CV.p }) + text(SHP.x + SHP.w / 2, SHP.y + 179, "Download", { size: 15, weight: 600, fill: C.white, anchor: "middle" });
const DL_BTN = [SHP.x + SHP.w / 2, SHP.y + 174];
const dlBubble = shadow(CVW - 420, 92, 400, 96, 10, 2) + rect(CVW - 420, 92, 400, 96, { r: 10, fill: C.white }) + clipped(CVW - 398, 112, 56, 56, thumb(CVW - 398, 112, 56)) +
  text(CVW - 326, 134, "rani-dimas.png", { size: 14, fill: C.crText }) + text(CVW - 326, 156, "Selesai · siap dipasang di Scalev", { size: 13, fill: C.crSub });

// ---- 9. Tutorial resmi: this guide's page and a tutorial.scalev.com page (generic) --------------------------------------
const GUIDE_TAB = { title: "Tutorial resmi Scalev | Panduan", w: 250 }, TUT_TAB = { title: "A–Z Custom Domain di Scalev", w: 250, fav: favScalev };
const GROUP_Y = (g) => CV.top + 130 + g * 150;
const guideBody = rect(0, CV.top, 1280, 630, { fill: C.white }) + text(80, CV.top + 70, "Tutorial resmi Scalev yang berguna", { size: 30, weight: 700, fill: C.ink }) +
  [["Akun dan keamanan", ["Cara verifikasi Nomor WhatsApp Anda di Scalev", "Cara Mengaktifkan Multi-Factor Authentication (MFA) di Scalev"]],
    ["Halaman (landing page)", ["Cara Membuat HTML Sales Page di Scalev", "Tutorial Cara Optimasi LP dengan Swap Slug"]],
    ["Domain", ["A–Z Custom Domain di Scalev", "Tutorial Cara Memindahkan Pengaturan DNS ke Cloudflare", "Tutorial Cara Menambahkan Custom Sub-Domain ke Scalev"]]]
    .map(([h, links], g) => text(80, GROUP_Y(g), h, { size: 22, weight: 700, fill: C.ink }) +
      links.map((l, k) => circle(90, GROUP_Y(g) + 32 + k * 34, 3, { fill: C.ink }) + text(104, GROUP_Y(g) + 37 + k * 34, l, { size: 16, fill: C.accent, underline: true })).join("")).join("");
const LINK_AT = [200, GROUP_Y(2) + 32];
const guideWin = (tut) => chrome(0, 0, 1280, 715, { tabs: tut ? [{ ...GUIDE_TAB, active: true }, TUT_TAB] : [{ ...GUIDE_TAB, active: true }], url: "…/scalev/tutorial-scalev" });
const tutPage = chrome(0, 0, 1280, 715, { tabs: [GUIDE_TAB, { ...TUT_TAB, active: true }], url: "tutorial.scalev.com/azcustomdomain" }) + rect(0, CV.top, 1280, 630, { fill: C.white }) +
  text(120, CV.top + 64, "A–Z Custom Domain di Scalev", { size: 30, weight: 700, fill: SV.ink }) + bar(120, CV.top + 90, 420) +
  rect(120, CV.top + 120, 720, 405, { r: 6, fill: "#1b1f24" }) + bar(880, CV.top + 130, 280) + bar(880, CV.top + 160, 240) + bar(880, CV.top + 190, 260) + bar(880, CV.top + 240, 200) + bar(880, CV.top + 270, 250);
const PLAY = [480, CV.top + 322];
const playBtn = circle(PLAY[0], PLAY[1], 34, { fill: "rgba(255,255,255,.92)" }) + `<path d="M${PLAY[0] - 9} ${PLAY[1] - 14} l24 14 -24 14 z" fill="#1b1f24"/>`;
const playing = rect(120, CV.top + 120, 720, 405, { r: 6, fill: "#2a3038" }) + rect(300, CV.top + 220, 360, 160, { r: 6, fill: "#3a424d" }) + bar(340, CV.top + 260, 280, 12, "#58626f") + bar(340, CV.top + 290, 200, 12, "#58626f") +
  rect(140, CV.top + 500, 680, 4, { r: 2, fill: "#5b636e" }) + rect(140, CV.top + 500, 250, 4, { r: 2, fill: "#e53935" }) + circle(390, CV.top + 502, 6, { fill: "#e53935" });

// ---- 10. Phone: the link in WhatsApp, then the public page --------------------------------------------------------------
const PX = 378, PY = 20, PH = 844;
const phoneWa = rect(PX, PY, 390, PH, { r: 24, fill: "#efeae2" }) + rect(PX, PY, 390, 64, { r: 24, fill: C.white }) + rect(PX, PY + 40, 390, 24, { fill: C.white }) +
  iconX("arrow-left", PX + 22, PY + 38, 20, "#111b21") + circle(PX + 62, PY + 38, 17, { fill: "#dfe5e7" }) + icon("users", PX + 62, PY + 38, 16, "#8696a0") +
  text(PX + 90, PY + 44, "Rina WO (Anda)", { size: 16, weight: 500, fill: "#111b21" });
const BUB = { x: PX + 390 - 12 - 340, y: PY + 250 };
// The public page in the phone browser: cover, then a YouTube video and Ucapan & RSVP (labels from the widget in
// nikahkit/build/nk-render.js), in the Dasar cover's colours. Scrolls as one element.
const M = "#8c2f1f", P0 = PY + 63;
const pill = (x, y, w, label, on) => rect(x, y, w, 40, { r: 20, fill: on ? M : "#fdf6ee", stroke: M }) + text(x + w / 2, y + 25, label, { size: 14, fill: on ? C.white : M, anchor: "middle" });
const phField = (y, h, v) => rect(PX + 24, y, 342, h, { r: 6, fill: C.white, stroke: "#d8c6b0" }) + text(PX + 36, y + 26, v, { size: 14, fill: "#1f1f1f" });
const phLabel = (y, s) => text(PX + 24, y, s, { size: 13, weight: 700, fill: "#1f1f1f" });
const phSecs = (y0) => rect(PX, y0, 390, 900, { fill: "#fdf6ee" }) + rect(PX + 20, y0 + 20, 350, 197, { r: 6, fill: "#111" }) +
  rect(PX + 161, y0 + 94, 68, 48, { r: 12, fill: "#ff0000" }) + `<path d="M${PX + 188} ${y0 + 107} l18 11 -18 11 z" fill="#fff"/>` +
  text(PX + 195, y0 + 290, "Ucapan & RSVP", { size: 28, fill: M, anchor: "middle", font: SERIF, italic: true }) +
  phLabel(y0 + 330, "Nama") + phField(y0 + 340, 42, "Tamu Undangan") + phLabel(y0 + 408, "Kehadiran") +
  pill(PX + 24, y0 + 418, 104, "Hadir", true) + pill(PX + 136, y0 + 418, 112, "Tidak hadir") + pill(PX + 256, y0 + 418, 110, "Masih ragu") +
  phLabel(y0 + 486, "Ucapan") + phField(y0 + 496, 90, "Selamat menempuh hidup baru!") +
  rect(PX + 24, y0 + 604, 342, 46, { r: 23, fill: M }) + icon("send", PX + 168, y0 + 627, 16, C.white) + text(PX + 204, y0 + 632, "Kirim", { size: 15, fill: C.white, anchor: "middle" });
const phoneWeb = rect(PX, PY, 390, PH, { r: 24, fill: C.white }) + rect(PX + 14, PY + 14, 330, 36, { r: 18, fill: C.crOmni }) + icon("lock", PX + 34, PY + 32, 13, C.crIcon) +
  text(PX + 48, PY + 37, "tokomu.myscalev.com/rani-dimas", { size: 14, fill: C.crText }) + iconX("more-vertical", PX + 366, PY + 32, 18, C.crIcon) + line(PX, PY + 62.5, PX + 390, PY + 62.5, { stroke: "#e3e3e3" });
const phPage = clipCss("page", PX, P0, 390, PH - 63) + cover(PX, P0, 783) + phSecs(P0 + 783);
const phPlaying = rect(PX + 20, P0 + 20, 350, 197, { r: 6, fill: "#2b2b2b" }) + rect(PX + 70, P0 + 60, 250, 110, { r: 4, fill: "#444" }) + rect(PX + 32, P0 + 200, 326, 3, { fill: "#666" }) + rect(PX + 32, P0 + 200, 90, 3, { fill: "#ff0000" });
const phThanks = rect(PX + 24, P0 + 262, 342, 400, { r: 8, fill: C.white, stroke: "#d8c6b0" }) + text(PX + 195, P0 + 430, "Terima Kasih", { size: 28, fill: M, anchor: "middle", font: SERIF, italic: true }) +
  para(PX + 195, P0 + 470, ["Terima kasih, pesan Anda", "sudah kami terima."], { size: 15, fill: "#1f1f1f", anchor: "middle", lh: 22 });

// ---- 11. Akun: business switcher (measured: Pilih Bisnis Kamu), Security / MFA under Profil (measured text) ----------
const bizMenu = shadow(24, T + 120, 268, 223, 6, 2) + rect(24, T + 120, 268, 223, { r: 6, fill: C.white }) + text(40, T + 150, "Pilih Bisnis Kamu", { size: 12, fill: "#3b4350" }) +
  rect(41, T + 171, 234, 40, { r: 4, fill: C.white, stroke: "#d5dae1", sw: 2 }) + text(54, T + 196, "Cari Bisnis", { size: 14, fill: "#8d97a3" }) + iconX("search", 252, T + 191, 13, "#3b4350") +
  rect(41, T + 227, 234, 53, { r: 4, fill: "#f8fafc", stroke: SV.blue, sw: 2 }) + text(66, T + 258, "R", { size: 12, weight: 700, fill: "#3b4350", anchor: "middle" }) + text(86, T + 258, "Rina WO", { size: 14, weight: 500, fill: SV.ink }) +
  text(158, T + 314, "+ Buat Bisnis Baru", { size: 12, weight: 500, fill: SV.link, anchor: "middle" });
const mfaCard = rect(MAIN.x, MAIN.y, MAIN.w, 420, { fill: SV.bg }) + card(MAIN.x, MAIN.y, MAIN.w, 310) + text(MAIN.x + 24, MAIN.y + 38, "Security", { size: 16, weight: 600, fill: SV.ink }) +
  rect(MAIN.x + 24, MAIN.y + 58, MAIN.w - 48, 92, { r: 6, fill: "#ecf8f1" }) + iconX("check", MAIN.x + 48, MAIN.y + 84, 16, "#15a34a") +
  text(MAIN.x + 72, MAIN.y + 88, "Multi-Factor Authentication (MFA) is Always Active", { size: 14, weight: 600, fill: SV.ink }) +
  para(MAIN.x + 72, MAIN.y + 110, ["By default, MFA method is using Email OTP, and you can switch to use Authenticator App", "for better security. MFA is used for: login, fund withdrawal, and change business owner."], { size: 13, fill: "#3b4350", lh: 18 }) +
  text(MAIN.x + 24, MAIN.y + 188, "Multi-Factor Authentication Method", { size: 12, fill: SV.sub }) + text(MAIN.x + 24, MAIN.y + 214, "Email OTP", { size: 15, weight: 500, fill: SV.ink }) +
  line(MAIN.x + 24, MAIN.y + 236.5, MAIN.x + MAIN.w - 24, MAIN.y + 236.5, { stroke: SV.line }) + text(MAIN.x + 24, MAIN.y + 262, "Backup Codes", { size: 12, fill: SV.sub }) +
  text(MAIN.x + 24, MAIN.y + 286, "Emergency access codes for account recovery", { size: 14, fill: SV.ink });

// ---- 12. Domain preparation (registrar and Cloudflare not captured: generic) and the page's domain (editor, measured) --
const genWin = (title, url, fav) => chrome(0, 0, 1280, 715, { tabs: [{ title, active: true, w: 260, fav }], url }) + rect(0, CV.top, 1280, 630, { fill: C.white });
const regPage = genWin("Penyedia domain", "penyedia-domain › namabrand.com") + rect(80.5, CV.top + 60.5, 600, 47, { r: 6, stroke: "#c9ced6" }) + text(98, CV.top + 90, "namabrand.com", { size: 16, fill: C.ink }) +
  card(80, CV.top + 140, 1120, 90) + text(104, CV.top + 182, "namabrand.com", { size: 20, weight: 600, fill: C.ink }) + bar(104, CV.top + 200, 160) +
  rect(1060, CV.top + 162, 116, 44, { r: 6, fill: "#2f6fde" }) + text(1118, CV.top + 190, "Beli", { size: 15, weight: 600, fill: C.white, anchor: "middle" }) +
  card(80, CV.top + 250, 1120, 72) + check(104, CV.top + 277, false) + text(136, CV.top + 292, "Hosting", { size: 16, fill: C.ink }) + bar(240, CV.top + 282, 300);
const cfSign = genWin("Cloudflare", "dash.cloudflare.com/sign-up", (cx, cy) => circle(cx, cy, 8, { fill: cfOrange })) +
  `<path d="M${560} ${CV.top + 110} a16 16 0 0 1 6 -28 a20 20 0 0 1 38 6 a12 12 0 0 1 4 22 z" fill="${cfOrange}"/>` + text(616, CV.top + 108, "Cloudflare", { size: 26, weight: 600, fill: "#1f1f1f" }) +
  [0, 1].map((k) => rect(440.5, CV.top + 160.5 + k * 74, 400, 47, { r: 6, stroke: "#c9ced6" }) + bar(456, CV.top + 180 + k * 74, 160, 9, "#e4e6ea")).join("") + rect(440, CV.top + 320, 400, 48, { r: 6, fill: cfOrange });
const nsPage = genWin("Penyedia domain", "penyedia-domain › namabrand.com › nameserver") + text(80, CV.top + 70, "namabrand.com", { size: 24, weight: 700, fill: C.ink }) +
  card(80, CV.top + 100, 700, 250) + text(104, CV.top + 140, "Nameserver", { size: 18, weight: 600, fill: C.ink }) +
  ["ana.ns.cloudflare.com", "bob.ns.cloudflare.com"].map((v, k) => rect(104.5, CV.top + 164.5 + k * 60, 520, 45, { r: 6, stroke: "#c9ced6" }) + text(120, CV.top + 193 + k * 60, v, { size: 16, fill: C.ink, mono: true })).join("") +
  rect(104, CV.top + 290, 120, 42, { r: 6, fill: "#2f6fde" }) + text(164, CV.top + 317, "Simpan", { size: 15, weight: 600, fill: C.white, anchor: "middle" });

const DASH = { x: 270, y: T, w: 1150, h: 640 }; // Scalev dashboard main area
const PANEL = { x: 0, y: T + 44, w: 400, h: 856 }; // editor tab strip + left panel
const SET_PUB = () => scalevEditor(0, T, { tab: "Settings" }) + settingsPanel({ now: "https://tokomu.myscalev.com/undangan-baru" }) + cover(SC.x, SC.y);

export const scenes = {
  "scalev-buat-halaman-html": {
    title: "Membuat halaman HTML Mode di Scalev untuk undangan",
    world: { x: 0, y: T, w: 1000, h: 558 },
    base: [win(), scalevApp(0, T, { active: "Home" }), head("Home"), genericBody()],
    els: {
      lp: { svg: scalevApp(0, T, { active: "Landing Pages" }) + lpPage(), enter: "fade" },
      ...Object.fromEntries(LP_ROWS.map((_, i) => [`row${i}`, { svg: lpRow(i), delay: 0.12 + i * 0.06 }])),
      create: { svg: btnCreate, enter: "fade" },
      shade: { svg: dim(0, T, 1440, 900), enter: "fade" },
      typeDlg: { svg: typeDlg, enter: "pop", origin: [CREATE.x + CREATE.w / 2, CREATE.y + 20] },
      edCode: { svg: scalevEditor(0, T, { tab: "Code" }) + desktopPreview, enter: "fade" },
      tabRing: { svg: ring(226, T + 52, 82, 28, { r: 6 }), enter: "pop" },
      edNk: { svg: scalevEditor(0, T, { tab: "NikahKit", rail: "Template", screenFill: "#ffffff" }) + templatePanel() + lockRail, enter: "fade" },
      tip: { svg: lockTip, enter: "fade", delay: 0.8 }
    },
    steps: [
      { caption: "Di dasbor Scalev, klik Landing Pages di menu kiri.", at: menu("Landing Pages"), click: true, show: ["lp", "row0", "row1", "row2", "row3", "create"] },
      { caption: "Klik + Create Landing Page.", at: [CREATE.x + CREATE.w / 2, CREATE.y + 20], click: true, press: "create", show: ["shade", "typeDlg"] },
      { caption: "Pilih HTML Mode. Editor terbuka: Code, Media, Security, Settings.", at: HTML_TILE, click: true, show: ["edCode"], hide: ["shade", "typeDlg"], dur: 3.6 },
      { caption: "Tab NikahKit berlogo biru ada di ujung strip tab.", at: at(ED.tab.NikahKit), show: ["tabRing"] },
      { caption: "Klik NikahKit. Menu selain Template dan Media terkunci.", at: at(ED.tab.NikahKit), click: true, show: ["edNk", "tip"], hide: ["tabRing"], dur: 4 }
    ]
  },

  "scalev-slug-simpan": {
    title: "Klik Simpan sampai halaman punya ID undangan",
    world: { x: 140, y: 0, w: 1150, h: 380 },
    base: [win(), scalevEditor(0, T, { tab: "Settings" }), desktopPreview, settingsPanel({ pub: false }), slugText("rani-dimas")],
    els: {
      simpan: btnSimpan,
      saved: { svg: urlSwap("app.scalev.com/pages/365671") + text(34, T + 334, "Saat ini:", { size: 12, weight: 500, fill: C.strong }) + text(82, T + 334, PUB_URL, { size: 12, weight: 500, fill: C.primary }), enter: "fade" },
      idNote: { svg: note(560, 240, "ID undangan: 365671", 345, 74), enter: "pop", origin: [345, 74], delay: 0.3 },
      edNk: { svg: scalevEditor(0, T, { tab: "NikahKit", rail: "Template", screenFill: "#ffffff" }) + templatePanel(), enter: "fade" }
    },
    steps: [
      { caption: "Klik Simpan di kanan atas editor.", at: at(ED.simpan), click: true, press: "simpan", show: ["saved"] },
      { caption: "Alamat jadi app.scalev.com/pages/365671. Angka itu ID undangan.", show: ["idNote"], dur: 3.8 },
      { caption: "Klik NikahKit lagi, lalu pilih template. Menu lain terbuka.", at: at(ED.tab.NikahKit), click: true, show: ["edNk"], hide: ["idNote"], dur: 3.6 }
    ]
  },

  "scalev-slug-isi": {
    title: "Mengisi slug di tab Settings",
    world: PANEL,
    base: [win(), scalevEditor(0, T, { tab: "NikahKit", rail: "Template", screenFill: "#ffffff" }), templatePanel(), lockRail],
    els: {
      set: { svg: scalevEditor(0, T, { tab: "Settings" }) + settingsPanel({ pub: false }), enter: "fade" },
      focus: { svg: slugFocus, enter: "fade" },
      slug: slugText("rani-dimas")
    },
    steps: [
      { caption: "Klik tab Settings. Bagian DOMAIN / URL berisi Slug URL.", at: SETTINGS_TAB, click: true, show: ["set"] },
      { caption: "Isi Slug URL, misalnya rani-dimas.", at: [SLUG_IN.x + 200, SLUG_IN.y + 21], click: true, show: ["focus", "slug"], type: [{ id: "slug", n: 10, box: [48, T + 285, 76, 22] }], dur: 3.4 }
    ]
  },

  "scalev-ubah-slug": {
    title: "Mengubah slug di tab Settings lalu Simpan & Terbitkan",
    world: PANEL,
    base: [win("app.scalev.com/pages/365671"), editorKonten()],
    els: {
      set: { svg: SET_PUB(), enter: "fade" },
      old: slugText("undangan-baru"),
      clear: { svg: rect(37, T + 277, 324, 36, { fill: "#f6f9fc" }) + slugFocus, enter: "fade" },
      slug: slugText("rani-dimas")
    },
    steps: [
      { caption: "Di editor halaman, klik tab Settings.", at: SETTINGS_TAB, click: true, show: ["set", "old"] },
      { caption: "Ganti Slug URL, misalnya rani-dimas.", at: [SLUG_IN.x + 200, SLUG_IN.y + 21], click: true, show: ["clear", "slug"], hide: ["old"], type: [{ id: "slug", n: 10, box: [48, T + 285, 76, 22] }], dur: 3.4 }
    ]
  },

  "scalev-simpan-terbitkan": {
    title: "Simpan dan Simpan & Terbitkan di editor Scalev",
    world: PANEL,
    base: [win("app.scalev.com/pages/365671"), editorKonten({ saving: "Tersimpan" })],
    els: {
      footRing: { svg: ring(0, T + 851, 71, 49, { r: 4 }), enter: "pop", delay: 0.4 },
      shareA: { svg: shareDialog(true), enter: "fade" }
    },
    steps: [
      { caption: "Ubah undangan di tab NikahKit. Tunggu kaki rel: Tersimpan.", show: ["footRing"], dur: 3.4 },
      { caption: "Klik Bagikan: Perubahan belum disimpan di Scalev.", at: at(ED.tool.Bagikan), click: true, show: ["shareA"], hide: ["footRing"], dur: 3.6 }
    ]
  },

  "scalev-terbitkan": {
    title: "Klik Simpan & Terbitkan di kanan atas editor Scalev",
    world: { x: 680, y: T, w: 760, h: 440 },
    base: [win("app.scalev.com/pages/365671"), editorKonten()],
    els: { pub: btnPub, ring: { svg: ring(1283, T + 50, 151, 34, { r: 6 }), enter: "pop", delay: 0.4 } },
    steps: [{ caption: "Klik Simpan & Terbitkan di kanan atas editor. Tunggu sampai selesai.", at: at(ED.terbitkan), click: true, press: "pub", show: ["ring"], dur: 3.4 }]
  },

  "scalev-bagikan-salin": {
    title: "Menyalin tautan umum dari Bagikan setelah terbit",
    world: PANEL,
    base: [win("app.scalev.com/pages/365671"), editorKonten()],
    els: { shareB: { svg: shareDialog(false), enter: "fade" }, copied: { svg: nkHint(16, T + 465, "Tersalin."), enter: "fade" } },
    steps: [
      { caption: "Klik Bagikan lagi. Peringatan sudah hilang.", at: at(ED.tool.Bagikan), click: true, show: ["shareB"] },
      { caption: "Klik Salin tautan umum untuk menyalin alamat publik.", at: [199, T + 431], click: true, show: ["copied"] }
    ]
  },

  "scalev-buka-di-hp": {
    title: "Membuka alamat publik undangan di HP",
    world: { x: PX - 10, y: PY - 10, w: 410, h: PH + 20 },
    base: [shadow(PX, PY, 390, PH, 24, 2), phoneWa],
    els: {
      bubble: { svg: waLink(BUB.x, BUB.y, 340), enter: "slide", delay: 0.4 },
      web: { svg: phoneWeb, enter: "fade" },
      page: { svg: phPage, enter: "fade" },
      playing: { svg: phPlaying, enter: "fade" },
      thanks: { svg: phThanks, enter: "pop", origin: [PX + 195, P0 + 627] }
    },
    steps: [
      { caption: "Kirim tautan umum ke WhatsApp-mu sendiri.", show: ["bubble"], dur: 3.4 },
      { caption: "Ketuk tautannya di HP. Halaman publik undangan terbuka.", at: [BUB.x + 120, BUB.y + 121], click: true, show: ["web", "page"], dur: 3.8 },
      { caption: "Putar video YouTube. Di halaman yang sudah terbit, video berjalan.", scroll: { id: "page", dy: 783 }, at: [PX + 195, P0 + 118], click: true, show: ["playing"], dur: 3.6 },
      { caption: "Kirim ucapan dan konfirmasi hadir. Ucapan & RSVP aktif setelah terbit.", at: [PX + 195, P0 + 627], click: true, show: ["thanks"], hide: ["playing"], dur: 4 }
    ]
  },

  "scalev-security-csp": {
    title: "Izin domain (CSP) di Bantuan NikahKit dan tab Security Scalev",
    world: PANEL,
    base: [win("app.scalev.com/pages/365671"), editorKonten()],
    els: {
      help: { svg: nkDialogHead(0, T, "Bantuan"), enter: "fade" },
      helpBody: { svg: clipCss("helpBody", 0, T + 154, 386, 746) + helpBody(), enter: "fade" },
      helpBar: { svg: rect(388, T + 160, 6, 120, { r: 3, fill: "#c9ced6" }), enter: "fade" },
      copied: { svg: nkHint(16, up(HB.msg), "Tersalin. Tempel di tab Security."), enter: "fade" },
      sec: { svg: scalevEditor(0, T, { tab: "Security" }) + securityPanel + cover(SC.x, SC.y), enter: "fade" },
      secFocus: { svg: rect(20.5, secY(1) + 10.5, 358, 39, { r: 4, stroke: SV.blue, sw: 2 }), enter: "fade" },
      paste: { svg: text(32, secY(1) + 35, "https://foto.contoh.com", { size: 14, fill: SV.ink }), enter: "fade", delay: 0.2 },
    },
    steps: [
      { caption: "Di tab NikahKit, klik Bantuan di bagian bawah rel kiri.", at: at(ED.tool.Bantuan), click: true, show: ["help", "helpBody", "helpBar"] },
      { caption: "Gulir ke Izin domain (CSP). Tiap domain punya status.", scroll: { id: "helpBody", dy: HB_DY }, dur: 3.6 },
      { caption: "Ada Perlu ditambah manual? Klik Salin domain kurang.", at: [190, up(HB.copy) + 18], click: true, show: ["copied"], dur: 3.4 },
      { caption: "Lihat hasil salinan, lalu klik tab Security.", at: at(ED.tab.Security), click: true, show: ["sec"] },
      { caption: "Tempel domainnya saja di kolom yang cocok: img_src ke Image Sources.", at: [200, secY(1) + 30], click: true, show: ["secFocus", "paste"], hide: ["help", "helpBody", "helpBar", "copied"], dur: 3.8 },
    ]
  },

  "scalev-periksa-ulang": {
    title: "Memeriksa ulang izin domain di Bantuan",
    world: PANEL,
    base: [win("app.scalev.com/pages/365671"), editorKonten()],
    els: {
      help: { svg: nkDialogHead(0, T, "Bantuan") + clipped(0, T + 154, 386, 746, `<g transform="translate(0 ${-HB_DY})">${helpBody()}</g>`), enter: "fade" },
      fixed: { svg: cspRow(CSP[2], up(HB.rows[2][0]), HB.rows[2][1], "Sudah diizinkan", false) + nkBtn(16, up(HB.copy), "Salin daftar domain", { w: 351, size: 14, variant: "quiet", icon: "copy" }) + nkHint(16, up(HB.msg), "Diperiksa ulang."), enter: "fade" }
    },
    steps: [
      { caption: "Setelah terbit, klik Bantuan lagi di rel kiri.", at: at(ED.tool.Bantuan), click: true, show: ["help"] },
      { caption: "Klik Periksa ulang: statusnya jadi Sudah diizinkan.", at: [190, up(HB.recheck) + 18], click: true, show: ["fixed"], dur: 3.8 }
    ]
  },

  "scalev-custom-domain": {
    title: "Menambahkan domain sendiri ke Scalev lewat Cloudflare",
    world: DASH,
    base: [win(), settingsPage("Profil"), profileCard()],
    els: {
      dom: { svg: settingsPage("Domain") + domainSection, enter: "fade" },
      addBtn: { svg: svBtn(MAIN.x + MAIN.w - 184, MAIN.y + 16, "Tambahkan Domain", { w: 160 }), enter: "fade" },
      shade: { svg: dim(0, T, 1440, 900), enter: "fade" },
      dlg: { svg: domainDlg, enter: "pop", origin: ADD_BTN },
      typed: text(DOM_IN.x + 12, DOM_IN.y + 25, "undangan.namabrand.com", { size: 14, fill: SV.ink }),
      done: { svg: settingsPage("Domain") + domainSection + dnsHead, enter: "fade" },
      ...Object.fromEntries(DNS_ROWS.map((_, i) => [`dns${i}`, { svg: dnsRow(i), delay: 0.15 + i * 0.06 }])),
      cf: { svg: cfWin, enter: "rise" },
      cfForm: { svg: cfForm, enter: "pop", origin: CF_ADD },
      ok: { svg: verified, enter: "pop" }
    },
    steps: [
      { caption: "Di Settings dasbor Scalev, buka bagian Domain.", at: subAt("Domain"), click: true, show: ["dom", "addBtn"] },
      { caption: "Klik Tambahkan Domain.", at: ADD_BTN, click: true, press: "addBtn", show: ["shade", "dlg"] },
      { caption: "Ketik domain atau subdomain, misalnya undangan.namabrand.com.", at: [DOM_IN.x + 200, DOM_IN.y + 20], click: true, show: ["typed"], type: [{ id: "typed", n: 22, box: [DOM_IN.x + 12, DOM_IN.y + 9, 172, 22] }], dur: 3.6 },
      { caption: "Klik Simpan. Scalev menampilkan kode DNS (Type, Name, Target).", at: DOM_SAVE, click: true, show: ["done", "dns0", "dns1", "dns2"], hide: ["shade", "dlg", "typed"], dur: 3.6 },
      { caption: "Di Cloudflare: DNS, Add Record. Salin persis, Proxy status DNS Only.", at: CF_ADD, click: true, show: ["cf", "cfForm"], dur: 4 },
      { caption: "Kembali ke Scalev, klik Verifikasi. Bisa butuh sampai 2x24 jam.", at: VERIFY, click: true, show: ["ok"], hide: ["cf", "cfForm"], dur: 4 }
    ]
  },

  "scalev-epayment": {
    title: "Mengaktifkan ePayment di toko Scalev",
    world: DASH,
    base: [win(), storesPage],
    els: {
      det: { svg: scalevApp(0, T, { active: "Stores" }) + rect(256, T, 1184, 900, { fill: SV.bg }), enter: "fade" },
      detBody: { svg: detBody, enter: "fade" },
      detHead: { svg: detHead + topSave, enter: "fade" },
      shade: { svg: dim(0, T, 1440, 900), enter: "fade" },
      dlg: { svg: payDlg, enter: "pop", origin: PICK },
      menu: { svg: payMenu, enter: "pop", origin: [SEL.x + SEL.w / 2, SEL.y + 40] },
      val: { svg: payDlg + payVal, enter: "fade" },
      on: { svg: check(PD.x + 24, PD.y + 150, true), enter: "pop" },
      dlgSave: svBtn(PD.x + PD.w - 104, PD.y + 230, "Simpan", { w: 80 }),
      after: { svg: detAfter, enter: "fade" },
      topSave: topSave
    },
    steps: [
      { caption: "Di Stores, klik nama tokomu.", at: STORE_AT, click: true, show: ["det", "detBody", "detHead"], dur: 3.4 },
      { caption: "Gulir ke Metode Pembayaran, klik Pilih Metode Pembayaran.", scroll: { id: "detBody", dy: DET_DY }, at: PICK, click: true, show: ["shade", "dlg"], dur: 3.8 },
      { caption: "Di dialog, klik dropdown.", at: [SEL.x + SEL.w - 30, SEL.y + 20], click: true, show: ["menu"], dur: 2.8 },
      { caption: "Pilih Invoice.", at: INVOICE_AT, click: true, show: ["val"], hide: ["menu"], dur: 2.8 },
      { caption: "Centang Aktifkan Metode Pembayaran ALL E-Payment.", at: CHECK_AT, click: true, show: ["on", "dlgSave"] },
      { caption: "Klik Simpan di dialog. Metode pembayaran tercatat.", at: DLG_SAVE, click: true, press: "dlgSave", show: ["after", "topSave"], hide: ["shade", "dlg", "val", "on", "dlgSave"] },
      { caption: "Klik Simpan di kanan atas supaya pengaturan benar-benar tersimpan.", at: [TOP_SAVE.x + 50, TOP_SAVE.y + 20], click: true, press: "topSave", dur: 3.8 }
    ]
  },

  "scalev-verifikasi-wa": {
    title: "Verifikasi nomor WhatsApp di Scalev",
    world: DASH,
    base: [win(), settingsPage("Profil"), profileCard()],
    els: {
      edit: { svg: rect(MAIN.x, MAIN.y, MAIN.w, 420, { fill: SV.bg }) + editForm, enter: "fade" },
      num: text(PHONE_IN.x + 34, PHONE_IN.y + 25, "081234567890", { size: 14, fill: SV.ink }),
      saveBtn: { svg: svBtn(MAIN.x + 24, MAIN.y + 318, "Save", { w: 80 }), enter: "fade" },
      shade: { svg: dim(0, T, 1440, 900), enter: "fade" },
      konf: { svg: confirmDlg, enter: "pop", origin: SAVE_BTN },
      back: { svg: settingsPage("Profil") + rect(MAIN.x, MAIN.y, MAIN.w, 420, { fill: SV.bg }) + editForm + text(PHONE_IN.x + 34, PHONE_IN.y + 25, "081234567890", { size: 14, fill: SV.ink }) + cekBtn, enter: "fade" },
      wa: { svg: waWin, enter: "rise", delay: 0.15 },
      draft: { svg: waDraft, enter: "fade", delay: 0.15 },
      send: { svg: waSend, enter: "fade", delay: 0.15 },
      bubble: { svg: waBubble, enter: "slide" },
      ok: { svg: icon("circle-check", PHONE_IN.x + PHONE_IN.w - 22, PHONE_IN.y + 20, 20, "#15a34a"), enter: "pop" },
      mfa: { svg: mfaCard, enter: "fade" },
      mfaRing: { svg: ring(MAIN.x + 20, MAIN.y + 176, 320, 48), enter: "pop", delay: 0.5 }
    },
    steps: [
      { caption: "Di Settings bagian Profil, klik Edit.", at: EDIT_BTN, click: true, show: ["edit", "saveBtn"] },
      { caption: "Isi nomor WhatsApp yang aktif di kolom nomor telepon.", at: [PHONE_IN.x + 200, PHONE_IN.y + 20], click: true, show: ["num"], type: [{ id: "num", n: 12, box: [PHONE_IN.x + 34, PHONE_IN.y + 9, 104, 22] }], dur: 3.4 },
      { caption: "Klik Save. Jendela konfirmasi menampilkan nomormu.", at: SAVE_BTN, click: true, press: "saveBtn", show: ["shade", "konf"], dur: 3.4 },
      { caption: "Klik Verifikasi. WhatsApp terbuka dengan draf kode OTP ke Scalev.", at: VERIF_AT, click: true, show: ["back", "wa", "draft", "send"], hide: ["shade", "konf"], dur: 3.8 },
      { caption: "Kirim apa adanya ke +6282125784683. Jangan ubah kodenya.", at: WA_SEND, click: true, press: "send", show: ["bubble"], dur: 3.4 },
      { caption: "Kembali ke Scalev, klik Cek Verifikasi. Nomor jadi terverifikasi.", at: [CEK.x + 70, CEK.y + 20], click: true, show: ["ok"], hide: ["wa", "draft", "send", "bubble"], dur: 3.8 },
      { caption: "Nyalakan MFA: Profil, bagian Security. Ganti Email OTP ke Authenticator App.", at: [MAIN.x + 140, MAIN.y + 206], show: ["mfa", "mfaRing"], dur: 4 }
    ]
  },

  "scalev-thumbnail-canva": {
    title: "Membuat gambar thumbnail 1:1 di Canva",
    world: { x: 0, y: 0, w: CVW, h: 660 },
    base: [gallery],
    els: {
      pro: { svg: note(380, CV.top + 166, "Canva Pro", 473, CY + 206), enter: "pop", origin: [473, CY + 206] },
      pop: { svg: cvPop, enter: "pop", origin: [CREATE_CV.x + 85, CREATE_CV.y + 40] },
      size: { svg: cvSize, enter: "fade" },
      w: cvW, h: cvH,
      editor: { svg: cvEditor, enter: "fade" },
      sel: { svg: cvSel, enter: "fade" },
      names: cvNames, date: cvDate,
      share: { svg: cvShare, enter: "pop", origin: [SHARE_CV.x + 53, SHARE_CV.y + 34] },
      dl: { svg: cvDl, enter: "fade" },
      done: { svg: dlBubble, enter: "pop", origin: [CVW - 80, 92] }
    },
    steps: [
      { caption: "Buka galeri template undangan Canva. Mahkota berarti Canva Pro.", at: [473, CY + 218], show: ["pro"], dur: 3.6 },
      { caption: "Jadikan persegi: klik Create a design, lalu Custom size.", at: [CREATE_CV.x + 85, CREATE_CV.y + 20], click: true, show: ["pop"], hide: ["pro"] },
      { caption: "Isi 1080 x 1080 px.", at: CUSTOM_AT, click: true, show: ["size", "w", "h"], type: [{ id: "w", n: 4 }, { id: "h", n: 4 }] },
      { caption: "Klik Create new design, lalu salin elemen dari template.", at: NEW_AT, click: true, show: ["editor"], hide: ["pop", "size", "w", "h"], dur: 3.6 },
      { caption: "Isi nama panggilan dan tanggal dengan huruf besar.", at: [SQ.x + SQ.s / 2, SQ.y + 200], click: true, show: ["sel", "names", "date"], type: [{ id: "names", n: 12 }, { id: "date", n: 14 }], dur: 3.8 },
      { caption: "Unduh: klik Share, lalu Download.", at: [SHARE_CV.x + 53, SHARE_CV.y + 17], click: true, show: ["share"], hide: ["sel"] },
      { caption: "Pilih PNG atau JPG.", at: DL_ROW, click: true, show: ["dl"] },
      { caption: "Klik Download. Gambar persegi tersimpan di komputermu.", at: DL_BTN, click: true, show: ["done"], hide: ["share", "dl"], dur: 3.6 }
    ]
  },

  "scalev-thumbnail-seo": {
    title: "Memasang thumbnail di SEO & Page Identity Scalev",
    world: PANEL,
    base: [win("app.scalev.com/pages/365671"), editorKonten()],
    els: {
      set: { svg: scalevEditor(0, T, { tab: "Settings" }) + settingsPanel({ now: PUB_URL }) + cover(SC.x, SC.y), enter: "fade" },
      seo: { svg: seoAfter({ id: "seoA" }), enter: "fade" },
      jFocus: { svg: rect(35, T + 351, 313, 40, { r: 4, stroke: C.primary, sw: 2 }), enter: "fade" },
      judul: text(48, T + 376, JUDUL, { size: 14, fill: "#0f161e" }),
      gTitle: { svg: text(42, T + 629, JUDUL, { size: 14, weight: 500, fill: "#1a0dab" }), enter: "fade", delay: 1.4 },
      dFocus: { svg: rect(35, T + 434, 313, 124, { r: 4, stroke: C.primary, sw: 2 }), enter: "fade" },
      desc: para(48, T + 459, DESC, { size: 14, fill: "#0f161e", lh: 20 }),
      gDesc: { svg: text(42, T + 673, DESC.join(" "), { size: 12, fill: "#545454" }), enter: "fade", delay: 1.6 },
      down: { svg: seoAfter({ id: "seoB", judul: true, desc: true }), enter: "fade" },
      img: { svg: seoAfter({ id: "seoC", judul: true, desc: true, img: true, dy: SEO_DY }), enter: "fade" },
      hover: { svg: imgHover, enter: "fade" }
    },
    steps: [
      { caption: "Di editor halaman, klik tab Settings.", at: SETTINGS_TAB, click: true, show: ["set"] },
      { caption: "Buka bagian SEO & PAGE IDENTITY.", at: [200, T + 276], click: true, show: ["seo"] },
      { caption: "Isi Judul Tag, misalnya Undangan Rani & Dimas.", at: [190, T + 371], click: true, show: ["jFocus", "judul", "gTitle"], type: [{ id: "judul", n: 21, box: [48, T + 361, 160, 22] }], dur: 3.6 },
      { caption: "Isi Meta Description: tanggal dan ucapan singkat.", at: [190, T + 496], click: true, show: ["dFocus", "desc", "gDesc"], hide: ["jFocus"], type: [{ id: "desc", n: 24 }], dur: 3.6 },
      { caption: "Gulir ke Pratinjau di Sosial Media.", show: ["down"], hide: ["dFocus"], scroll: { id: "down", dy: SEO_DY }, dur: 2.8 },
      { caption: "Klik Upload Meta Gambar, pilih gambar dari Canva.", at: [191, IMG.y + 82], click: true, show: ["img"], dur: 3.4 },
      { caption: "Sudah ada gambar? Arahkan kursor ke gambar, klik pensil.", at: [146, IMG.y + 150], show: ["hover"], dur: 3.4 }
    ]
  },

  "scalev-thumbnail-terbit": {
    title: "Menerbitkan lalu mengecek kartu pratinjau di WhatsApp",
    world: { x: 460, y: T, w: 980, h: 660 },
    base: [win("app.scalev.com/pages/365671"), scalevEditor(0, T, { tab: "Settings" }), cover(SC.x, SC.y)],
    els: { pub: btnPub, wa: { svg: waDesk, enter: "rise", delay: 0.3 } },
    steps: [
      { caption: "Klik Simpan & Terbitkan.", at: at(ED.terbitkan), click: true, press: "pub" },
      { caption: "Kirim tautannya di WhatsApp: kartu pratinjau memakai gambar itu.", show: ["wa"], dur: 4 }
    ]
  },

  "scalev-tutorial-resmi": {
    title: "Membuka tutorial resmi Scalev dari panduan",
    world: { x: 0, y: 0, w: 880, h: 640 },
    base: [guideWin(false), guideBody],
    els: {
      ring: { svg: ring(76, GROUP_Y(2) - 24, 96, 32), enter: "pop" },
      tut: { svg: tutPage, enter: "fade" },
      play: playBtn,
      playing: { svg: playing, enter: "fade" },
      back: { svg: guideWin(true) + guideBody, enter: "fade" }
    },
    steps: [
      { caption: "Tentukan kebutuhanmu: cari kelompoknya, misalnya Domain.", at: [124, GROUP_Y(2) - 8], show: ["ring"], dur: 3.4 },
      { caption: "Klik judul tutorial. Halaman tutorial Scalev terbuka.", at: LINK_AT, click: true, show: ["tut", "play"], hide: ["ring"] },
      { caption: "Tonton atau baca sampai habis. Ikuti urutannya.", at: PLAY, click: true, show: ["playing"], hide: ["play"] },
      { caption: "Kembali ke tab panduan NikahKit.", at: [200, 23], click: true, show: ["back"], hide: ["tut", "playing"] }
    ]
  },

  "scalev-akun-awal": {
    title: "Masuk ke dasbor Scalev dan memilih bisnis",
    world: { x: 0, y: 0, w: 700, h: 500 },
    base: [win(""), rect(0, T, 1440, 900, { fill: C.white })],
    els: {
      url: text(166, 68, "app.scalev.com", { size: 14, fill: C.crText }),
      dash: { svg: scalevApp(0, T, { active: "Home" }) + head("Home") + genericBody(), enter: "fade", delay: 1.3 },
      lpRing: { svg: ring(30, T + 220, 200, 28, { r: 6 }), enter: "pop" },
      biz: { svg: bizMenu, enter: "pop", origin: [127, T + 110] }
    },
    steps: [
      { caption: "Buka app.scalev.com di Chrome komputer, lalu daftar dan masuk.", at: [300, 63], click: true, show: ["url", "dash"], type: [{ id: "url", n: 14, box: [166, 54, 108, 20] }], dur: 3.8 },
      { caption: "Tanda sudah masuk: menu kiri punya Landing Pages.", at: menu("Landing Pages"), show: ["lpRing"] },
      { caption: "Klik nama bisnis. Pilih bisnis untuk merek undanganmu.", at: [127, T + 86], click: true, show: ["biz"], hide: ["lpRing"], dur: 3.6 }
    ]
  },

  "scalev-domain-cloudflare": {
    title: "Membeli domain dan memindahkan DNS ke Cloudflare",
    world: { x: 0, y: 0, w: 1220, h: 480 },
    base: [regPage],
    els: {
      noHost: { svg: ring(100, CV.top + 271, 120, 30, { r: 6 }), enter: "pop" },
      cf: { svg: cfSign, enter: "fade" },
      ns: { svg: nsPage, enter: "fade" }
    },
    steps: [
      { caption: "Beli domain saja di penyedia domain. Hosting tidak usah.", at: [1118, CV.top + 184], click: true, show: ["noHost"], dur: 3.6 },
      { caption: "Daftar Cloudflare di dash.cloudflare.com/sign-up.", show: ["cf"], hide: ["noHost"], dur: 3.4 },
      { caption: "Pindahkan DNS: ganti nameserver ke Cloudflare (ikuti video Scalev).", at: [164, CV.top + 311], click: true, show: ["ns"], hide: ["cf"], dur: 4 }
    ]
  }
};
