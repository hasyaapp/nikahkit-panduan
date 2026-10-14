// Scalev setup scenes: halaman HTML Mode, slug, simpan/terbit, Security CSP, custom domain, e-payment, verifikasi WA,
// thumbnail (Canva + SEO & Page Identity), tutorial resmi. Every scene is one 1440x900 screen (lib v4): Scalev pages fill
// it at 0,0 (the editor and dashboard viewport); scenes where the address bar matters put the same page in a Chrome window
// (frame + shifted, page from y 85); other sites are Chrome pages laid out at 1440 wide; the phone check uses phoneDesk.
// Measured: Scalev app sidebar, Landing Pages, editor and its Settings tab (14 Okt 2026, page 365671); Canva's public
// gallery, this guide on docs.page and tutorial.scalev.com/azcustomdomain at 1440x900 in headless Chromium (14 Okt 2026).
// Not measured, so generic (grey bars, only the labels the guide pages name): Settings > Domain and Profil at 1440 wide,
// Stores, the Security tab, Cloudflare, the domain registrar, WhatsApp Web, Canva's logged-in header, menus and editor.
import { C, icon, iconX, shadow, clipped, PHONE, group, text, para, rect, line, circle, tw } from "../lib.mjs";
import {
  chrome, favScalev, CHROME_TOP, scalevEditor, ED, scalevApp, svMenuAt, nkHead, nkDialogHead, nkBtn, nkInput, nkLabel, nkHint, nkNote, nkAcc, nkH3, dim, phoneDesk
} from "../ui/kit.mjs";

const CT = CHROME_TOP; // page top inside a Chrome window (y 85)
const SV = { blue: "#3b8fd0", link: "#2f86d1", ink: "#1f2d3d", sub: "#6b7480", line: "#e5e8ec", bg: "#f8f9fb", soft: "#e6f2fb", bar: "#e9edf2" };
const SERIF = "Georgia,'Times New Roman',serif";

// ---- shared pieces ----------------------------------------------------------------------------------------------------
const bar = (x, y, w, h = 10, fill = SV.bar) => rect(x, y, w, h, { r: h / 2, fill });
// Scalev inside a Chrome window: the frame, and page markup (drawn at 0,0) moved below the toolbar.
const frame = (url = "app.scalev.com") => chrome(0, 0, 1440, 900, { tabs: [{ title: "Scalev", active: true, fav: favScalev }], url });
const shifted = (svg) => clipped(0, CT, 1440, 900 - CT, group({ transform: `translate(0 ${CT})` }, svg));
const dn = ([x, y, w, h]) => [x, y + CT, w, h];
const urlSwap = (url) => rect(150, 48, 700, 30, { fill: C.crOmni }) + text(166, 68, url, { size: 14, fill: C.crText });
const OMNI = { box: [124, 46, 1184, 34], r: 17 };
// Scalev buttons (app): primary blue, outline, plain. svBox gives the exact [x, y, w, h] svBtn draws.
const svBox = (x, y, label, o = {}) => [x, y, o.w ?? tw(label, o.size ?? 14, 500) + 32, o.h ?? 40];
function svBtn(x, y, label, o = {}) {
  const v = o.variant ?? "primary", size = o.size ?? 14, [, , w, h] = svBox(x, y, label, o);
  const fill = v === "primary" ? SV.blue : C.white, stroke = v === "primary" ? undefined : v === "outline" ? SV.blue : "#d5dae1";
  return rect(x + 0.5, y + 0.5, w - 1, h - 1, { r: 4, fill, stroke }) + text(x + w / 2, y + h / 2 + size * 0.36, label, { size, weight: 500, fill: v === "primary" ? C.white : v === "outline" ? SV.blue : SV.ink, anchor: "middle" });
}
const svInput = (x, y, w, value, o = {}) => rect(x + 0.5, y + 0.5, w - 1, (o.h ?? 40) - 1, { r: 4, fill: C.white, stroke: o.focus ? SV.blue : "#d5dae1", sw: o.focus ? 2 : 1 }) +
  (value ? text(x + 12, y + (o.h ?? 40) / 2 + 5, value, { size: 14, fill: o.placeholder ? "#9aa1ab" : SV.ink, mono: o.mono }) : "") + (o.select ? icon("chevron-down", x + w - 18, y + (o.h ?? 40) / 2, 16, SV.sub) : "");
const check = (x, y, on) => rect(x + 0.5, y + 0.5, 17, 17, { r: 3, fill: on ? SV.blue : C.white, stroke: on ? SV.blue : "#b8c0ca" }) + (on ? iconX("check", x + 9, y + 9, 13, C.white, 3) : "");
// Measured Scalev app (14 Okt 2026, /tmp/scalev-ukur): colours, and text placed by its measured line box (top y, CSS px);
// `w` pins the measured width (textLength) so text and its skeleton bar match the real line.
const SVC = { blue: "#0899cf", ink: "#111827", title: "#0f161e", text: "#414042", sub: "#5b6675", mute: "#8d8b8f", off: "#b3b2b4", field: "#dbdfe5",
  fieldBg: "#f6f9fc", red: "#f14756", dark: "#223548", line: "#e8ebef", ph: "#8d97a3", grey: "#77828e", tick: "#09afed" };
const tx = (x, top, s, size, o = {}) => {
  const t = text(x, top + Math.round(size * 0.93), s, { size, ...o });
  return o.w ? t.replace("<text", `<text textLength="${o.w}" lengthAdjust="spacingAndGlyphs"`) : t;
};
// Field / button with a 2px border drawn inside its box (Scalev inputs, dialogs).
const box2 = (x, y, w, h, o = {}) => rect(x + 1, y + 1, w - 2, h - 2, { r: o.r ?? 4, fill: o.fill ?? C.white, stroke: o.stroke ?? SVC.field, sw: 2 });
const tick = (x, y, on) => on ? rect(x, y, 16, 16, { r: 4, fill: SVC.tick }) + iconX("check", x + 8, y + 8, 12, C.white, 3) : box2(x, y, 16, 16, { stroke: SVC.sub });
// Page header in the Scalev app main area (x 256..1440), like Landing Pages: title + rule.
const head = (title) => rect(256, 0, 1184, 900, { fill: SV.bg }) + rect(256, 0, 1184, 70, { fill: C.white }) + line(256, 70.5, 1440, 70.5, { stroke: SV.line }) + text(280, 43, title, { size: 18, weight: 600, fill: SV.ink });
const card = (x, y, w, h) => rect(x + 0.5, y + 0.5, w - 1, h - 1, { r: 6, fill: C.white, stroke: SV.line });
// Generic dashboard body (cards of grey bars) for screens we do not walk through.
const genericBody = (y = 94) => [0, 1, 2].map((i) => card(280 + i * 380, y, 364, 120) + bar(300 + i * 380, y + 24, 120) + bar(300 + i * 380, y + 56, 220, 18) + bar(300 + i * 380, y + 92, 160)).join("") +
  card(280, y + 144, 1124, 380) + [0, 1, 2, 3, 4, 5].map((k) => bar(304, y + 180 + k * 52, [520, 380, 600, 300, 460, 340][k])).join("");
// Lucide megaphone (Template panel: Marketing segment), same stroke style as lib icons.
const megaphone = (cx, cy, size = 16, color = C.text) => `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></g>`;
// Clip for a scrolling element: on the element's class, so the clip stays put while its inner group scrolls (also in lenses).
const clipCss = (id, x, y, w, h) => `<style>.e-${id}{clip-path:url(#cl-${id})}</style><defs><clipPath id="cl-${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs>`;
// Tab boxes in the editor tab strip (marks), from the label positions scalevEditor draws.
const TAB = { Code: [8, 52, 44, 28], Media: [52, 52, 49, 28], Security: [101, 52, 69, 28], Settings: [161, 52, 69, 28], NikahKit: [226, 52, 82, 28] };
const tabMark = (n) => ({ box: TAB[n], r: 6 });
const TABS_LENS = { src: [0, 44, 330, 48] };
const PANEL = [0, 44, 399, 856]; // editor tab strip + left panel
const TOOLBAR = [1180, 44, 260, 48];
// Rail tools (Bagikan, Bantuan) and the rail foot, as nkRail draws them.
const TOOL = { Bagikan: [4, 567, 64, 44], Bantuan: [4, 799, 64, 44] };

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
const SC = ED.screen;
// Konten panel body (editor-konten.png without the update note): language select, Sampul, open Mempelai group.
const kontenBody = () => nkLabel(88, 181, "Bahasa undangan") + nkInput(88, 189, 279, "Indonesia", { select: true }) +
  para(88, 245, ["Hanya halaman tamu. Teks bawaan ikut berganti;", "teks yang sudah diubah tetap."], { size: 12, fill: C.faint, lh: 16 }) +
  text(88, 289, "Urutan dan tampilan bagian di ", { size: 12, fill: C.faint }) + text(88 + tw("Urutan dan tampilan bagian di ", 12), 289, "Lapisan", { size: 12, fill: C.strong, underline: true }) +
  nkAcc(88, 305, 279, "Sampul", { badge: "Terisi" }) + rect(88.5, 363.5, 278, 600, { r: 4, fill: C.white, stroke: C.line }) + nkAcc(88, 363, 279, "Mempelai", { open: true, badge: "Terisi" }) +
  nkLabel(101, 433, "Judul") + nkInput(101, 441, 253, "Mempelai") + nkLabel(101, 501, "Urutan nama") + nkInput(101, 509, 253, "Wanita dulu", { select: true }) +
  nkH3(101, 581, "Mempelai Wanita") + nkLabel(101, 605, "Nama panggilan") + nkInput(101, 613, 253, "Rani") + nkHint(101, 665, "Tampil di sampul.") +
  nkLabel(101, 693, "Nama lengkap dan gelar") + nkInput(101, 701, 253, "Rani Ayu, S.Psi.") + nkLabel(101, 761, "Profesi") + nkInput(101, 769, 253, "Psikolog") +
  nkLabel(101, 829, "Keterangan orang tua") + nkInput(101, 837, 253, "Putri kedua dari Bapak Ahmad") + rect(72, 885, 327, 15, { fill: C.white });
const editorKonten = (o = {}) => scalevEditor(0, 0, { tab: "NikahKit", rail: "Konten", ...o }) + nkHead(0, 0, "Konten") + kontenBody() + cover(SC.x, SC.y);
// The Simpan / Simpan & Terbitkan buttons again, as elements that can dip when pressed (boxes as scalevEditor draws them).
const SIMPAN = [1193, 50, 82, 34], TERBIT = [1283, 50, 151, 34];
const btnSimpan = rect(1193, 50, 82, 34, { r: 4, fill: C.white, stroke: C.svBtnLine, sw: 2 }) + text(1201, 72, "Simpan", { size: 13, weight: 500, fill: C.strong }) + iconX("file-text", 1258, 67, 15, C.strong);
const btnPub = rect(1283, 50, 151, 34, { r: 4, fill: C.primary }) + text(1403, 72, "Simpan & Terbitkan", { size: 13, weight: 500, fill: C.white, anchor: "end" }) + iconX("rocket", 1418, 67, 15, C.white);

// ---- 1. Landing Pages → HTML Mode → NikahKit → Simpan --------------------------------------------------------------
const LP_ROWS = [["Undangan Rani & Dimas", "/rani-dimas"], ["Undangan Sari & Bima", "/sari-bima"], ["Contoh Undangan", "/contoh"], ["Katalog Rina WO", "/katalog"]];
function lpPage() {
  return rect(256, 0, 1184, 900, { fill: SV.bg }) + rect(256, 0, 1184, 137, { fill: C.white }) + line(256, 137.5, 1440, 137.5, { stroke: SV.line }) +
    text(280, 36, "Landing Pages", { size: 18, weight: 600, fill: SV.ink }) + line(280, 58.5, 1400, 58.5, { stroke: SV.line }) +
    text(469, 93, "Checkout form creation has moved.", { size: 13, fill: "#3b4350" }) + text(469, 112, "Create a checkout form here →", { size: 13, fill: SV.link, underline: true }) +
    iconX("search", 1203, 97, 15, SV.sub) + text(1223, 103, "Cari landing page...", { size: 13, fill: "#a6adb7" }) +
    rect(1360.5, 78.5, 40, 40, { r: 4, fill: C.white, stroke: "#d5dae1" }) + `<path d="M1371 89 h18 l-7 9 v7 l-4 2 v-9 z" fill="none" stroke="#4a5361" stroke-width="1.6" stroke-linejoin="round"/>` +
    rect(280, 163, 1120, 54, { r: 4, fill: "#eef8fb" }) + circle(308, 190, 7, { stroke: SV.blue, sw: 1.5 }) + text(308, 194, "i", { size: 10, weight: 700, fill: SV.blue, anchor: "middle" }) +
    text(336, 195, "Looking for landing pages with an order form? They're now called Checkout Flows.", { size: 14, fill: SV.ink }) +
    text(336 + tw("Looking for landing pages with an order form? They're now called Checkout Flows. ", 14) - 12, 195, "Open Checkout Flows", { size: 14, fill: SV.ink, underline: true }) +
    card(281, 244, 1119, 680) + line(520.5, 244, 520.5, 900, { stroke: SV.line }) +
    text(297, 275, "Folders", { size: 14, weight: 600, fill: SV.ink }) + para(297, 294, ["Kelompokkan landing page per", "campaign, produk, atau klien."], { size: 11, fill: SV.sub, lh: 16 }) +
    rect(297, 328, 207, 36, { r: 4, fill: "#eef6fc" }) + icon("layout-grid", 316, 346, 15, SV.blue) + text(335, 351, "All Landing Pages", { size: 14, weight: 500, fill: SV.link }) + text(498, 351, "4", { size: 12, fill: SV.link, anchor: "end" }) +
    [["Ungrouped", "file-text", 4], ["Page", "folder", 0], ["Undangan", "folder", 0]].map(([n, ic, c], i) => iconX(ic, 316, 384 + i * 38, 15, "#4a5361") + text(335, 389 + i * 38, n, { size: 14, fill: "#3b4350" }) + text(498, 389 + i * 38, String(c), { size: 12, fill: SV.sub, anchor: "end" })).join("") +
    rect(297.5, 488.5, 206, 41, { r: 4, fill: C.white, stroke: SV.blue }) + text(400, 514, "+  New Folder", { size: 14, weight: 500, fill: SV.link, anchor: "middle" }) +
    text(537, 273, "All Landing Pages", { size: 14, weight: 600, fill: SV.ink }) + text(667, 273, "4", { size: 12, fill: SV.sub }) +
    rect(521, 293, 879, 38, { fill: "#f6f8fa" }) + check(537, 303, false) +
    [["Nama Landing Page", 585], ["Folder", 785], ["Slug", 925], ["Mode", 1125], ["Domains", 1245]].map(([l, x]) => text(x, 316, l, { size: 12, fill: SV.sub })).join("");
}
function lpRow(i) {
  const [name, slug] = LP_ROWS[i], y = 331 + i * 71;
  return rect(521, y, 879, 71, { fill: C.white }) + line(521, y + 70.5, 1400, y + 70.5, { stroke: SV.line }) + check(537, y + 27, false) +
    text(585, y + 41, name, { size: 14, weight: 500, fill: SV.link }) + rect(787, y + 24, 92, 24, { r: 4, fill: "#f3f4f6" }) + iconX("file-text", 800, y + 36, 12, SV.sub) + text(812, y + 40, "Ungrouped", { size: 12, fill: "#3b4350" }) +
    text(925, y + 41, slug, { size: 14, fill: SV.link }) + rect(1125, y + 22, 83, 28, { r: 3, fill: SV.soft }) + text(1166.5, y + 40, "HTML Mode", { size: 12, weight: 700, fill: SV.blue, anchor: "middle" }) +
    text(1245, y + 41, "-", { size: 14, fill: SV.sub }) + [0, 1, 2].map((k) => circle(1364 + k * 7, y + 36, 2.2, { fill: "#3b4350" })).join("");
}
const lpScreen = () => scalevApp(0, 0, { active: "Landing Pages" }) + lpPage() + LP_ROWS.map((_, i) => lpRow(i)).join("");
const CREATE = svBox(280, 78, "+ Create Landing Page", { w: 173 });
const btnCreate = svBtn(280, 78, "+ Create Landing Page", { w: 173 });
// Type chooser (not captured): modal with a generic tile and the HTML Mode tile.
const DLG = { x: 470, y: 260, w: 500, h: 300 };
const HTML_TILE = [DLG.x + 260, DLG.y + 74, 216, 191];
const htmlTile = (on) => rect(DLG.x + 260.5, DLG.y + 74.5, 215, 190, { r: 6, fill: on ? SV.soft : "#f3f9fd", stroke: SV.blue, sw: on ? 3 : 2 }) + icon("code-xml", DLG.x + 368, DLG.y + 140, 34, SV.blue, 1.8) +
  text(DLG.x + 368, DLG.y + 204, "HTML Mode", { size: 16, weight: 700, fill: SV.ink, anchor: "middle" }) + bar(DLG.x + 298, DLG.y + 222, 140, 8);
const typeDlg = shadow(DLG.x, DLG.y, DLG.w, DLG.h, 8, 3) + rect(DLG.x, DLG.y, DLG.w, DLG.h, { r: 8, fill: C.white }) + bar(DLG.x + 24, DLG.y + 30, 180, 12, "#dfe4ea") + iconX("x", DLG.x + DLG.w - 30, DLG.y + 36, 18, SV.sub) +
  rect(DLG.x + 24.5, DLG.y + 74.5, 215, 190, { r: 6, fill: C.white, stroke: SV.line }) + icon("layout-grid", DLG.x + 132, DLG.y + 140, 34, "#b8c0ca", 1.6) + bar(DLG.x + 82, DLG.y + 196, 100, 10) + bar(DLG.x + 62, DLG.y + 220, 140, 8) + htmlTile(false);
// Desktop preview (no NikahKit yet): empty white page across the preview area.
const desktopPreview = rect(400, 93, 1040, 807, { fill: C.svPreview }) + rect(424, 106, 992, 794, { fill: C.white });
// Template panel (editor-template.png, update note left out): segment, template cards; the description as the card
// clamps it (two lines, same text as 03-editor-konten.mjs).
const TEMPLATES = [["Dasar", "#55524f", ["Abu-abu gelap di atas", "foto, tanpa ornamen…"]], ["Folio", "#2e2e33", ["Hitam & krem gaya", "majalah, foto penuh…"]],
  ["Galeri Putih", "#f6f4f1", ["Putih bersih gaya", "majalah, huruf serif…"]], ["Modern Estetik", "#efe7dc", ["Putih & krem, bingkai", "lengkung, bayangan…"]]];
function templatePanel() {
  let s = nkHead(0, 0, "Template") + rect(88.5, 169.5, 278, 37, { r: 4, fill: C.white, stroke: C.field }) + rect(89, 170, 138, 36, { r: 3, fill: C.primarySoft }) +
    icon("layout-grid", 129, 188, 16, C.action) + text(141, 193, "Template", { size: 12, weight: 600, fill: C.action }) + line(227.5, 170, 227.5, 206, { stroke: C.field }) + megaphone(297, 188, 16, C.text);
  TEMPLATES.forEach(([n, tone, desc], i) => {
    const cx = 88 + (i % 2) * 145, cy = 219 + Math.floor(i / 2) * 241;
    s += rect(cx + 0.5, cy + 0.5, 132, 165, { r: 6, fill: "#f2f5fa", stroke: C.line }) + rect(cx + 5, cy + 5, 72, 156, { r: 3, fill: tone }) +
      [0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => rect(cx + 84 + (k % 2) * 22, cy + 8 + Math.floor(k / 2) * 34, 18, 28, { r: 2, fill: k % 3 ? "#e4e0da" : "#cfc8bf" })).join("") +
      text(cx + 41, cy + 70, n.split(" ")[0], { size: 9, fill: tone === "#f6f4f1" || tone === "#efe7dc" ? "#6b5b4a" : "#f2ece4", anchor: "middle", font: SERIF }) +
      text(cx, cy + 184, n, { size: 14, weight: 500, fill: C.strong }) + para(cx, cy + 205, desc, { size: 12, fill: C.text, lh: 16 });
  });
  return s + rect(72, 685, 327, 215, { fill: C.white }) + rect(88, 701, 133, 165, { r: 6, fill: "#f2f5fa" }) + rect(233, 701, 133, 165, { r: 6, fill: "#f2f5fa" });
}
// Locked rail menus (disabled buttons) and the native title tooltip.
const lockRail = ["Gaya", "Audio", "Lapisan", "Konten"].map((n) => rect(0, ED.rail[n][1] - 26, 71, 52, { fill: C.page, opacity: 0.6 })).join("");
const lockTip = shadow(46, 210, 198, 26, 4) + rect(46.5, 210.5, 197, 25, { r: 4, fill: "#ffffff", stroke: "#c7c7c7" }) + text(56, 227, "Simpan halaman di Scalev dulu.", { size: 12, fill: "#1f1f1f" });
const edNikahKit = (o) => scalevEditor(0, 0, { tab: "NikahKit", rail: "Template", screenFill: "#ffffff" }) + templatePanel() + (o?.locked ? lockRail : "");
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
// Panel background + header row (published pages only) + accordions; DOMAIN / URL open.
function settingsPanel({ pub = true, now } = {}) {
  let s = accGrad + rect(0, 93, 399, 807, { fill: C.white });
  if (pub) s += rect(16, 112, 49, 20, { r: 4, fill: "#f3f5f7" }) + text(40.5, 126, "ver. 37", { size: 12, weight: 500, fill: "#5b6675", anchor: "middle" }) +
    text(73, 127, "Diterbitkan", { size: 14, weight: 500, fill: "#15c15d" }) + text(149, 127, "14/10/2026", { size: 14, fill: C.strong }) +
    rect(240, 105, 126, 34, { r: 4, fill: C.white, stroke: "#e8ebef", sw: 2 }) + text(303, 126, "Batalkan Penerbitan", { size: 12, weight: 500, fill: "#df0e03", anchor: "middle" });
  s += line(0, 153.5, 399, 153.5, { stroke: "#dbdfe5" }) + acc(170, 0, 351) + svLabel(34, 259, "Slug URL") + text(88, 259, "*", { size: 12, weight: 500, fill: "#f14756" }) + svField(34, 274, 330) +
    (now ? text(34, 334, "Saat ini:", { size: 12, weight: 500, fill: C.strong }) + text(82, 334, now, { size: 12, weight: 500, fill: C.primary }) : "") +
    svLabel(34, 368, "Set as Homepage to Domains") + svField(34, 383, 330, 43) + text(48, 409, "Select Domain", { size: 14, fill: "#8d97a3" }) +
    svLabel(34, 455, "Limit to Domains") + svField(34, 470, 330, 43) + text(48, 496, "Select Custom Domain", { size: 14, fill: "#8d97a3" });
  [1, 2, 3, 4].forEach((i, k) => (s += acc(537 + k * 76, i)));
  return s;
}
const SLUG = [34, 274, 330, 42];
const slugText = (v) => text(48, 300, v, { size: 14, fill: "#0f161e" });
const slugFocus = rect(35, 275, 328, 40, { r: 4, stroke: C.primary, sw: 2 });
const SLUG_LENS = { src: [17, 236, 364, 110] };
const DOMAIN_ACC = [0, 154, 399, 380]; // DOMAIN / URL section of the Settings tab
const settingsEd = (o) => scalevEditor(0, 0, { tab: "Settings" }) + settingsPanel(o);
const SET_PUB = () => settingsEd({ now: "https://tokomu.myscalev.com/undangan-baru" }) + cover(SC.x, SC.y);

// ---- 2. Bagikan dialog (editor-bagikan.png) ---------------------------------------------------------------------------
const SHARE_URL = ["https://tokomu.myscalev.com/rani-dimas?", "to=Nama+Tamu"];
function shareDialog(warn) {
  const d = warn ? 0 : -50;
  return nkDialogHead(0, 0, "Bagikan") + (warn ? nkNote(16, 169, 366, ["Perubahan belum disimpan di Scalev."], { tone: "warn", h: 38 }) : "") +
    nkLabel(16, 231 + d, "Nama tamu") + nkInput(16, 239 + d, 366, "Nama Tamu") + nkHint(16, 295 + d, "Ditambahkan sebagai ?to=Nama.") +
    rect(16, 311 + d, 366, 52, { r: 4, fill: C.mutedBg }) + para(26, 332 + d, SHARE_URL, { size: 12, fill: C.strong, lh: 18 }).replace("<text", `<text font-family="'Roboto Mono',ui-monospace,Menlo,monospace"`) +
    nkBtn(16, 375 + d, "Lihat sebagai tamu", { w: 366, size: 14, icon: "eye" }) + nkBtn(16, 419 + d, "Salin tautan tamu", { w: 366, size: 14, variant: "ghost", icon: "copy" }) +
    nkBtn(16, 463 + d, "Salin tautan umum", { w: 366, size: 14, variant: "quiet", icon: "link" }) +
    nkH3(16, 535 + d, "Undangan khusus") + text(16, 572 + d, "Undangan khusus", { size: 14, fill: C.text }) + rect(346, 558 + d, 36, 20, { r: 10, fill: C.off }) + circle(356, 568 + d, 8, { fill: C.white }) +
    para(16, 601 + d, ["Isi undangan tidak ada di kode halaman. Server Nikahin", "mengirimnya hanya ke tamu dengan tautan sah."], { size: 12, fill: C.faint, lh: 16 }) +
    nkH3(16, 653 + d, "Untuk pengantin") + nkBtn(16, 665 + d, "Kirim undangan", { w: 366, size: 14, variant: "ghost", icon: "link" }) + nkBtn(16, 709 + d, "Buka Dashboard", { w: 366, size: 14, variant: "quiet", icon: "layout-grid" }) +
    nkHint(16, 761 + d, "Masuk dengan PIN dashboard.") + nkH3(16, 801 + d, "PIN dashboard") + nkBtn(16, 813 + d, "Kelola PIN dashboard", { w: 366, size: 14, icon: "lock" }) +
    nkHint(16, 865 + d, "PIN hanya tampil di jendela NikahKit.");
}
const SALIN_UMUM = [16, 413, 366, 36];
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
  const L = {};
  let y = 169;
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
const HB_DY = HB.h3 - 186; // scroll so the CSP heading sits under the dialog head
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
// Security tab panel (measured 14 Okt 2026, editor-security*.png): source selects with Scalev's auto-allowed domain chips.
// Coordinates are the panel at scroll 0 (Connect Sources on top); Image Sources is SECURITY.imageDy lower.
const AUTO_CONNECT = [["Scalev", 224, [[27, 243, 125, "https://api.scalev.com"], [158, 243, 67, "*.scalev.id"], [231, 243, 79, "*.scalev.com"]]],
  ["Google runtime", 279, [[27, 298, 137, "https://www.google.com"], [170, 298, 137, "https://www.gstatic.com"]]],
  ["Meta Pixel", 334, [[27, 353, 149, "https://www.facebook.com"]]],
  ["TikTok Pixel", 389, [[27, 408, 151, "https://analytics.tiktok.com"], [184, 408, 170, "https://analytics-ipv6.tiktokv.us"], [27, 438, 173, "https://analytics-ipv6.tiktokw.us"]]],
  ["Kwai Pixel", 474, [[27, 493, 158, "https://log-sdk.kwai-pro.com"], [191, 493, 155, "https://logsdk.kwai-pro.com"], [27, 523, 131, "https://api.mythad.com"], [164, 523, 134, "https://ads.mythad.com"],
    [27, 553, 137, "https://api.adaether.com"], [170, 553, 108, "https://s1.kwai.net"], [27, 583, 154, "https://s16-11187.ap4r.com"]]],
  ["Google Tag Manager, Analytics, and Ads", 619, [[27, 638, 195, "https://www.googletagmanager.com"], [27, 668, 185, "https://www.google-analytics.com"],
    [27, 698, 166, "https://*.google-analytics.com"], [27, 728, 164, "https://stats.g.doubleclick.net"], [27, 758, 190, "https://googleads.g.doubleclick.net"]]]];
const AUTO_IMAGE = [["Browser inline images", 226, [[27, 245, 41, "data:"], [74, 245, 40, "blob:"]]], ["Scalev", 281, [[27, 300, 67, "*.scalev.id"], [100, 300, 79, "*.scalev.com"]]],
  ["Country flags", 336, [[27, 355, 113, "https://flagcdn.com"]]], ["Meta Pixel", 391, [[27, 410, 149, "https://www.facebook.com"]]], ["TikTok Pixel", 446, [[27, 465, 151, "https://analytics.tiktok.com"]]],
  ["Kwai Pixel", 501, [[27, 520, 158, "https://log-sdk.kwai-pro.com"], [191, 520, 155, "https://logsdk.kwai-pro.com"], [27, 550, 108, "https://s1.kwai.net"], [141, 550, 154, "https://s16-11187.ap4r.com"]]],
  ["Google Tag Manager, Analytics, and Ads", 586, [[27, 605, 195, "https://www.googletagmanager.com"], [27, 635, 185, "https://www.google-analytics.com"],
    [27, 665, 166, "https://*.google-analytics.com"], [27, 695, 164, "https://stats.g.doubleclick.net"], [27, 725, 190, "https://googleads.g.doubleclick.net"]]]];
const IMG_DY = 699;
const secSelect = (y, value, ph) => box2(16, y, 351, 43, { fill: SVC.fieldBg }) + clipped(18, y + 2, 320, 39, tx(30, y + 13, value, 14, { fill: ph ? SVC.ph : SVC.dark })) + icon("chevron-down", 351, y + 22, 12, SVC.mute);
const secAuto = (y, h, groups, dy = 0) => rect(16.5, y + 0.5, 350, h - 1, { r: 4, fill: "#f5f5f5", stroke: SVC.off }) + tx(27, y + 12, "AUTOMATICALLY ALLOWED BY SCALEV", 10, { weight: 600, fill: SVC.sub, w: 184 }) +
  groups.map(([name, top, chips]) => tx(27, top + dy, name, 11, { weight: 600, fill: SVC.mute }) +
    chips.map(([x, cy, w, d]) => rect(x, cy + dy, w, 24, { r: 4, fill: C.white }) + tx(x + 8, cy + dy + 6, d, 11, { weight: 500, fill: SVC.grey, w: w - 16 })).join("")).join("");
const secContent = (o) => tx(16, 110, "Connect Sources", 12, { weight: 500, fill: SVC.sub }) + secSelect(136, `${o.connect ?? 1} selected`) + secAuto(187, 606, AUTO_CONNECT) +
  tx(16, 811, "Image Sources", 12, { weight: 500, fill: SVC.sub }) +
  secSelect(837, o.images ? `${o.images} selected` : "Add image domain, e.g. https://images.example.com", !o.images) + secAuto(888, 571, AUTO_IMAGE, IMG_DY) +
  tx(16, 778 + IMG_DY, "Media Sources", 12, { weight: 500, fill: SVC.sub }) + secSelect(804 + IMG_DY, "Add audio or video domain, e.g. https://media.example.com", true) +
  secAuto(855 + IMG_DY, 146, [["Browser inline media", 892, []]], IMG_DY);
// The Image Sources picker under its select (panel scrolled to Image Sources): search box, then the typed domain as an option.
const secPicker = (p) => shadow(16, 180, 351, p.value ? 105 : 54, 4, 2) + box2(16, 180, 351, p.value ? 105 : 54) + box2(26, 184, 331, 42, { stroke: SVC.blue }) +
  clipped(28, 186, 300, 38, tx(40, 197, p.value || "Add image domain, e.g. https://images.example.com", 14, { fill: p.value ? SVC.dark : SVC.ph })) + iconX("search", 340, 205, 16, SVC.sub) +
  (p.value ? tick(34, 249, p.ticked) + tx(64, 248, p.value, 14, { weight: 500, fill: "#676569" }) : "");
// Scalev editor Security tab panel body for an editor drawn at top y (x 0..399, y+92..y+900). o: { at: "connect" | "image"
// (scrolled to Image Sources), connect: n selected, images: n selected (0 = placeholder), picker: { value, ticked } (with at "image") }.
export function securityPanel(y = 0, o = {}) {
  const body = rect(0, 92, 399, 808, { fill: C.white }) + clipped(0, 92, 399, 808, group({ transform: `translate(0 ${o.at === "image" ? -IMG_DY : 0})` }, secContent(o)) + (o.picker && o.at === "image" ? secPicker(o.picker) : ""));
  return y ? group({ transform: `translate(0 ${y})` }, body) : body;
}
// Exact boxes (editor at y 0, panel scrolled to Image Sources) for marks: the select, the picker's search box, the option's tick.
export const SECURITY = { imageDy: IMG_DY, imageSelect: [16, 138, 351, 43], pickerInput: [26, 184, 331, 42], pickerTick: [34, 249, 16, 16], pickerOption: [26, 240, 331, 34] };

// ---- 4/6. Settings dashboard (measured 14 Okt 2026, domain/profil*.png): sub-menu card, content card, Domain, Profil ----
const SUB_ITEMS = ["Bisnis", "Verifikasi", "Anggota", "Peran", "Gudang", "Payment Methods", "Bank Transfer", "Discount Code", "Courier", "Analitik", "Privasi pelanggan",
  "Domain", "Integrations", "Billing", "Add-ons", "Bahasa", "Suppressed IPs", "Apps", "Developers", "Profil"];
const subTop = (n) => 113 + SUB_ITEMS.indexOf(n) * 27.5;
const subAt = (n) => [345, subTop(n) + 8];
const subBox = (n) => [304, subTop(n) - 6, 150, 28];
const SUBMENU = [280, 83, 200, 735];
// tall: the content runs below the fold (Profil): card to the bottom, page scrollbar, no footer.
function settingsPage(active, tall) {
  let s = scalevApp(0, 0, { active: "Settings" }) + rect(256, 0, 1184, 900, { fill: SV.bg }) + tx(280, 26, "Settings", 26, { weight: 700, fill: SVC.ink }) + rect(280, 83, 200, tall ? 817 : 735, { fill: C.white });
  SUB_ITEMS.forEach((n) => {
    const on = n === active;
    if (on) s += rect(...subBox(n), { r: 4, fill: SVC.fieldBg });
    s += tx(314, subTop(n), n, 13, { weight: 500, fill: on ? SVC.text : SVC.off });
  });
  if (tall) return s + rect(480, 83, 921, 817, { fill: C.white }) + rect(1425, 0, 15, 900, { fill: "#f6f6f6" }) + rect(1428, 4, 8, 516, { r: 4, fill: "#c4c4c4" });
  return s + rect(480, 83, 936, 735, { fill: C.white }) + tx(280, 852, "© 2026 Scalev PT Interna Cipta Asia", 12, { fill: SVC.mute }) +
    [["Kebijakan Privasi", 1144], ["Syarat dan Ketentuan", 1246], ["Bantuan", 1372]].map(([t, x]) => tx(x, 852, t, 12, { fill: SVC.blue })).join("");
}
// Domain: heading with + Tambah Domain and quota, table Nama Domain / Store / Homepage / Status (rows 66 high).
const domRow = (y, name, o = {}) => rect(512, y, 872, 66, { r: 4, fill: SVC.fieldBg }) + tx(528, y + 25, name, 14, { weight: 500, fill: SVC.blue }) +
  (o.added ? "" : iconX("external-link", 700, y + 34, 18, SVC.sub)) + tx(906, y + 25, "Rina WO", 14, { fill: SVC.blue }) + (o.added ? bar(1047, y + 29, 60) : tx(1047, y + 25, "Rina WO", 14, { fill: SVC.blue })) +
  (o.added ? "" : rect(1303, y + 20, 34, 26, { r: 4, fill: "#e3f2f1" }) + tx(1307, y + 26, "Aktif", 12, { weight: 500, fill: "#15c15d" }));
const domainPage = () => settingsPage("Domain") + tx(512, 118, "Domain", 16, { weight: 700, fill: SVC.ink }) + tx(578, 120, "+ Tambah Domain", 14, { weight: 500, fill: SVC.blue, w: 115 }) +
  tx(701, 119, "0", 14, { weight: 600, fill: SVC.dark }) + tx(714, 119, "dari", 14, { fill: SVC.dark, w: 26 }) + tx(744, 119, "3", 14, { weight: 600, fill: SVC.dark }) +
  tx(757, 119, "jatah telah digunakan.", 14, { fill: SVC.dark, w: 139 }) +
  [["Nama Domain", 528, 77], ["Store", 906, 29], ["Homepage", 1047, 59], ["Status", 1301, 35]].map(([t, x, w]) => tx(x, 179, t, 12, { weight: 500, fill: SVC.mute, w })).join("") +
  domRow(211, "tokomu.myscalev.com");
const TAMBAH = [574, 116, 123, 25];
const DOMAIN_CARD = [480, 83, 936, 735];
// Dialog Tambah Domain (measured): Save stays disabled until a domain is typed (enabled look inferred).
const DOM_IN = [506, 441, 428, 42], DOM_SAVE = [869, 499, 65, 44], DOM_DLG = [490, 342, 460, 217];
const domainDlg = shadow(490, 342, 460, 217, 4, 2) + rect(490, 342, 460, 217, { r: 4, fill: C.white }) + tx(506, 359, "Tambah Domain", 16, { weight: 700, fill: SVC.text }) +
  tx(506, 385, "Masukkan domain pribadi Kamu di bawah ini.", 12, { fill: SVC.sub, w: 248 }) + tx(506, 415, "Domain", 12, { weight: 500, fill: SVC.sub }) + tx(551, 415, "*", 12, { weight: 500, fill: SVC.red }) +
  box2(...DOM_IN, { fill: SVC.fieldBg }) + tx(520, 454, "Contoh: budi.contoh.com", 14, { fill: SVC.ph }) +
  box2(792, 499, 65, 44, { stroke: "#eaeaeb" }) + tx(803, 512, "Cancel", 14, { weight: 500, fill: SVC.text, w: 43 }) + rect(869, 499, 65, 44, { r: 4, fill: "#f0f1f3" }) + tx(886, 512, "Save", 14, { weight: 500, fill: SVC.grey, w: 30 });
const domTyped = rect(508, 443, 424, 38, { fill: SVC.fieldBg }) + tx(520, 454, "undangan.namabrand.com", 14, { fill: SVC.title });
const domSaveOn = rect(869, 499, 65, 44, { r: 4, fill: SVC.blue }) + tx(886, 512, "Save", 14, { weight: 500, fill: C.white, w: 30 });
// After Save (not observed: generic): the new domain row with Verifikasi in its Status cell, and its DNS records below.
const VERIFY = [1268, 298, 100, 36];
const NEW_ROW = [512, 283, 872, 66], DNS_CARD = [512, 365, 872, 212];
const dnsTable = domRow(283, "undangan.namabrand.com", { added: true }) + box2(...VERIFY, { stroke: SVC.blue }) + tx(1318, 307, "Verifikasi", 14, { weight: 500, fill: SVC.blue, anchor: "middle" }) +
  box2(...DNS_CARD, { stroke: SVC.line }) + rect(528, 381, 840, 36, { r: 4, fill: SVC.fieldBg }) +
  [["Type", 544], ["Name", 704], ["Target", 924]].map(([t, x]) => tx(x, 392, t, 12, { weight: 500, fill: SVC.mute })).join("") +
  [0, 1, 2].map((i) => {
    const y = 417 + i * 52;
    return line(528, y + 51.5, 1368, y + 51.5, { stroke: SVC.line }) + (i ? bar(544, y + 21, 40) + bar(704, y + 21, 110) : tx(544, y + 18, "A", 14, { weight: 600, fill: SVC.title, mono: true }) + tx(704, y + 18, "undangan", 14, { fill: SVC.title, mono: true })) +
      bar(924, y + 21, [150, 170, 160][i]) + iconX("copy", 1344, y + 26, 15, SVC.sub);
  }).join("");
const verified = icon("circle-check", 528 + tw("undangan.namabrand.com", 14, 500) + 26, 317, 18, "#15c15d");
// Profil (measured; example account data): fields, Telegram cards, Password, Log out, then Security with the MFA method row.
const profilPage = (o = {}) => settingsPage("Profil", true) + tx(512, 118, "Profil", 16, { weight: 700, fill: SVC.ink, w: 38 }) + tx(556, 122, "Edit", 12, { weight: 500, fill: SVC.blue, underline: true }) +
  [["Nama Lengkap", 512, 161], ["Alamat Email", 807, 161], ["Nomor Telepon", 512, 222], ["Akun Telegram", 512, 283], ["Password", 512, 446]].map(([t, x, y]) => tx(x, y, t, 12, { fill: SVC.sub })).join("") +
  tx(1126, 161, "Avatar", 12, { fill: SVC.mute }) + rect(1126, 183, 82, 82, { r: 4, fill: "#e8f6fb" }) + text(1167, 237, "R", { size: 36, fill: SVC.text, anchor: "middle" }) +
  tx(512, 185, "Rina", 14, { weight: 500, fill: SVC.text }) + tx(807, 185, "rina.wo@gmail.com", 14, { weight: 500, fill: SVC.text }) +
  icon("circle-check", 807 + tw("rina.wo@gmail.com", 14, 500) + 12, 193, 13, SVC.blue) + tx(512, 246, o.phone ?? "Belum Ditambahkan", 14, { weight: 500, fill: SVC.text }) +
  [[512, "Notifikasi Order", ["Khusus update pesanan dan status", "pembayaran."]], [808, "Diskusi LMS", ["Untuk komentar dan balasan baru di", "kelas LMS."]]].map(([x, t, d]) =>
    rect(x, 307, 286, 119, { r: 4, fill: SVC.fieldBg }) + tx(x + 12, 321, t, 14, { weight: 600, fill: SVC.text }) + tx(x + 235, 325, "Belum", 11, { weight: 500, fill: SVC.mute }) +
    tx(x + 12, 346, d[0], 12, { fill: SVC.sub }) + tx(x + 12, 364, d[1], 12, { fill: SVC.sub }) + tx(x + 12, 397, "Hubungkan akun Telegram", 12, { weight: 500, fill: SVC.blue, underline: true, w: 144 })).join("") +
  tx(569, 444, "Edit", 14, { weight: 500, fill: SVC.blue, underline: true }) + [0, 1, 2, 3, 4, 5].map((k) => circle(515 + k * 6, 475, 3, { fill: "#676569" })).join("") +
  shadow(512, 514, 156, 52, 4, 1) + box2(512, 514, 156, 52, { stroke: SVC.red }) + tx(528, 532, "Log out", 14, { weight: 500, fill: SVC.red, italic: true }) + tx(583, 532, "dari Scalev", 14, { weight: 500, fill: SVC.red }) +
  tx(512, 604, "Terakhir diubah 14 Okt 2026, 09.30", 12, { fill: SVC.sub }) + line(480, 645.5, 1401, 645.5, { stroke: SVC.line }) +
  tx(512, 681, "Security", 16, { weight: 700, fill: SVC.ink }) + rect(512, 724, 857, 78, { r: 4, fill: "rgba(41,152,117,.1)" }) + iconX("check", 540, 754, 18, "#299875", 2.5) +
  tx(568, 744, "Multi-Factor Authentication (MFA) is Always Active", 14, { weight: 600, fill: SVC.dark, w: 331 }) + tx(899, 744, "•", 14, { fill: SVC.dark }) +
  tx(908, 744, "By default, MFA method is using Email OTP, and you can switch to", 14, { fill: SVC.dark, w: 419 }) +
  tx(568, 765, "use Authenticator App for better security. MFA is used for:", 14, { fill: SVC.dark, w: 372 }) +
  tx(940, 765, "login, fund withdrawal, and change business owner.", 14, { weight: 700, fill: SVC.dark, w: 329 }) +
  tx(512, 853, "Multi-Factor Authentication Method", 12, { weight: 500, fill: SVC.mute, w: 193 }) + tx(512, 880, "Email OTP", 14, { weight: 500, fill: SVC.text }) +
  box2(1198, 851, 171, 44) + bar(1230, 869, 107, 8, "#dde2e8"); // the switch button's label was not observed
const PROFIL_EDIT = [553, 118, 27, 22], MFA_METHOD = [506, 849, 230, 50], SECURITY_BOX = [496, 665, 905, 235];
// Dialog Edit Account (measured): note, Avatar, Nama Lengkap, Alamat Email, Nomor Telepon with +62 picker; Save disabled until edited.
const EA = [481, 190, 478, 520], EA_PHONE = [767, 571, 158, 42], EA_SAVE = [863, 654, 80, 40];
const editAccount = shadow(481, 190, 478, 520, 4, 2) + rect(481, 190, 478, 520, { r: 4, fill: C.white }) + tx(497, 207, "Edit Account", 16, { weight: 700, fill: SVC.text }) +
  tx(497, 233, "Pastikan Anda mengisi data dengan benar.", 12, { fill: SVC.sub, w: 232 }) + iconX("x", 937, 216, 14, SVC.red, 2.5) +
  rect(497, 271, 446, 78, { r: 4, fill: "rgba(251,191,56,.1)" }) + circle(525, 301, 9, { stroke: "#f5a524", sw: 1.6 }) + line(525, 299.5, 525, 305.5, { stroke: "#f5a524", sw: 1.8, cap: "round" }) + circle(525, 296, 1.1, { fill: "#f5a524" }) +
  tx(553, 291, "Jika nomor telepon diubah, akun ini perlu melakukan", 14, { fill: SVC.dark, w: 333 }) + tx(553, 312, "verifikasi ulang melalui WhatsApp.", 14, { fill: SVC.dark, w: 217 }) +
  rect(497, 359, 446, 275, { r: 4, fill: SVC.fieldBg }) + tx(513, 377, "Avatar", 12, { fill: SVC.mute }) + rect(513, 403, 134, 134, { r: 4, fill: "#e8f6fb" }) + text(580, 484, "R", { size: 36, fill: SVC.text, anchor: "middle" }) +
  tx(669, 377, "Nama Lengkap", 12, { weight: 500, fill: SVC.sub, w: 86 }) + tx(755, 377, "*", 12, { weight: 500, fill: SVC.red }) + box2(669, 403, 258, 42) + tx(683, 416, "Rina", 14, { fill: SVC.title }) +
  tx(669, 460, "Alamat Email", 12, { weight: 500, fill: SVC.sub, w: 76 }) + tx(745, 460, "*", 12, { weight: 500, fill: SVC.red }) + tx(927, 460, "Terverifikasi", 12, { weight: 500, fill: "#299875", anchor: "end" }) +
  box2(669, 486, 258, 42) + tx(683, 499, "rina.wo@gmail.com", 14, { fill: SVC.title }) + tx(669, 543, "Nomor Telepon", 12, { weight: 500, fill: SVC.sub, w: 83 }) +
  box2(669, 569, 258, 46, { fill: SVC.fieldBg }) + rect(671, 571, 95, 42, { fill: C.white }) + rect(683, 583, 24, 9, { fill: "#e70011" }) + rect(683, 592, 24, 9, { fill: C.white, stroke: "#e5e5e5", sw: 0.5 }) +
  tx(711, 584, "+62", 14, { fill: SVC.dark }) + icon("chevron-down", 750, 592, 10, SVC.sub) + rect(767, 571, 158, 42, { r: 4, fill: C.white }) + tx(779, 584, "812345678", 14, { fill: SVC.ph }) +
  rect(767, 654, 80, 40, { r: 4, fill: "#f5f5f5" }) + tx(786, 666, "Cancel", 14, { weight: 500, fill: SVC.red, w: 43 }) + rect(863, 654, 80, 40, { r: 4, fill: SVC.fieldBg }) + tx(888, 666, "Save", 14, { weight: 500, fill: SVC.grey, w: 30 });
const eaPhone = rect(768, 572, 156, 40, { fill: C.white }) + tx(779, 584, "81234567890", 14, { fill: SVC.title });
const eaSaveOn = rect(863, 654, 80, 40, { r: 4, fill: SVC.blue }) + tx(888, 666, "Save", 14, { weight: 500, fill: C.white, w: 30 });
// Cloudflare dashboard, DNS records (not captured): generic, with the labels the guide names.
const cfOrange = "#f38020", cfBlue = "#0051c3";
const cloud = (x, y, k, fill) => `<path transform="translate(${x} ${y}) scale(${k})" d="M0 0 a8 8 0 0 1 3 -14 a10 10 0 0 1 19 3 a6 6 0 0 1 2 11 z" fill="${fill}"/>`;
const favCf = (cx, cy) => cloud(cx - 12, cy + 6, 1, cfOrange);
const cfFrame = (url, title = "namabrand.com | Cloudflare") => chrome(0, 0, 1440, 900, { tabs: [{ title, active: true, w: 260, fav: favCf }], url });
const CF_DNS = [12, 316, 216, 34];
const cfPage = cfFrame("dash.cloudflare.com") + rect(0, CT, 1440, 815, { fill: "#f7f7f7" }) + rect(0, CT, 1440, 52, { fill: C.white }) + line(0, CT + 52.5, 1440, CT + 52.5, { stroke: "#e5e5e5" }) +
  cloud(24, CT + 36, 1.3, cfOrange) + text(64, CT + 33, "Cloudflare", { size: 16, weight: 600, fill: "#1f1f1f" }) + bar(1180, CT + 21, 120, 10, "#e5e5e5") + circle(1392, CT + 26, 14, { fill: "#e5e5e5" }) +
  rect(0, CT + 53, 240, 762, { fill: "#fbfbfb" }) + line(240.5, CT + 53, 240.5, 900, { stroke: "#e5e5e5" }) + text(24, 172, "namabrand.com", { size: 14, weight: 600, fill: "#1f1f1f" }) +
  [80, 100, 70, 0, 90, 110, 60, 95, 75].map((w, k) => {
    const y = 196 + k * 40;
    return k === 3 ? rect(12, y, 216, 34, { r: 4, fill: "#e3ecfa" }) + icon("list", 32, y + 17, 15, cfBlue) + text(48, y + 22, "DNS", { size: 14, weight: 600, fill: cfBlue }) :
      rect(26, y + 11, 12, 12, { r: 3, fill: "#dcdcdc" }) + bar(48, y + 12, w, 10, "#e3e3e3");
  }).join("") +
  text(288, 190, "DNS", { size: 24, weight: 600, fill: "#1f1f1f" }) + bar(288, 206, 360, 10, "#e3e3e3") + rect(288.5, 236.5, 1103, 600, { r: 6, fill: C.white, stroke: "#e5e5e5" }) +
  rect(312.5, 260.5, 359, 35, { r: 4, fill: C.white, stroke: "#c9c9c9" }) + bar(326, 273, 150, 9, "#e3e3e3") +
  rect(1236, 260, 132, 36, { r: 4, fill: cfBlue }) + text(1302, 283, "Add Record", { size: 14, weight: 500, fill: C.white, anchor: "middle" }) +
  rect(312, 316, 1056, 36, { fill: "#f6f6f6" }) + [336, 480, 744, 1120].map((x) => bar(x, 330, 60, 8, "#d9d9d9")).join("") +
  [0, 1, 2, 3, 4, 5].map((k) => line(312, 403.5 + k * 52, 1368, 403.5 + k * 52, { stroke: "#eeeeee" }) + bar(336, 374 + k * 52, 40) + bar(480, 374 + k * 52, [160, 120, 180, 140, 100, 150][k]) + bar(744, 374 + k * 52, [260, 220, 300, 200, 240, 280][k])).join("");
const CF_ADD = [1236, 260, 132, 36];
const CF_TABLE = [288, 236, 1104, 600];
const cfForm = rect(312.5, 316.5, 1055, 219, { r: 6, fill: "#f8f9fb", stroke: "#d9d9d9" }) +
  [["Type", 336, 120, "A"], ["Name", 480, 240, "undangan"], ["Target", 744, 360, null]].map(([l, x, w, v]) =>
    text(x, 348, l, { size: 12, weight: 600, fill: "#4a4a4a" }) + rect(x + 0.5, 358.5, w, 35, { r: 4, fill: C.white, stroke: "#c9c9c9" }) +
    (v ? text(x + 10, 381, v, { size: 14, fill: "#1f1f1f", mono: true }) : bar(x + 10, 371, 200))).join("") +
  text(336, 428, "Proxy status", { size: 12, weight: 600, fill: "#4a4a4a" }) + rect(336, 442, 40, 22, { r: 11, fill: "#bdbdbd" }) + circle(347, 453, 9, { fill: C.white }) +
  cloud(392, 461, 0.75, "#9e9e9e") + text(420, 458, "DNS Only", { size: 14, weight: 600, fill: "#1f1f1f" }) +
  rect(1144.5, 482.5, 92, 35, { r: 4, fill: C.white, stroke: "#c9c9c9" }) + bar(1162, 495, 56, 9, "#d9d9d9") + rect(1248, 482, 104, 36, { r: 4, fill: cfBlue }) + bar(1270, 495, 60, 9, "#9fbbe6");
const CF_FORM = [312, 316, 1056, 220];

// ---- 5. Stores (measured 14 Okt 2026, stores/store-payment*.png): with one store, Stores opens it directly ----------------
// Header (title + breadcrumb), right column of settings cards, left column that scrolls: store name + Save, Products Offered,
// then Payment Methods (chips, PayLink card, + Add Payment Method) and Extra Charges. Products and chips use example data.
const PMY = 917, STORE_DY = PMY - 116; // Payment Methods block top in the unscrolled column; scroll that brings it under the header
const storeHead = rect(256, 0, 1184, 88, { fill: C.white }) + line(256, 88.5, 1440, 88.5, { stroke: SVC.line }) + tx(280, 20, "Rina WO", 18, { weight: 700, fill: SVC.title }) +
  tx(280, 54, "Stores", 12, { weight: 700, fill: SVC.blue, w: 35 }) + tx(319, 54, "/", 12, { weight: 500, fill: SVC.sub }) + tx(328, 54, "Rina WO", 12, { weight: 500, fill: SVC.sub });
const RIGHT = [["Storefront Settings", 136, 155, ["Kamu bisa mengatur tampilan Checkout Page dan", "Analytics Setting."], 253], ["LMS Settings", 279, 109, ["Atur banner di halaman LMS untuk menyapa", "member, membagikan info kelas terbaru, atau", "promo khusus member."], 464],
  ["Notification Settings", 490, 168, ["Configure WhatsApp and email notification", "settings to automatically notify customers."], 575], ["Unique Code", 601, 104, ["This feature will add unique code as a discount to", "orders with bank transfer payment method. This", "code can be used to identify the order when the", "customer makes a payment."], 718],
  ["Public Order Page", 744, 148, ["Settings related to order page which can be", "accessed by your customers publicly. Public order", "page is your main channel to inform your", "customers related to order information."], 861], ["Order Shield", 887, 101, [], 0]];
const storeRight = rect(1054, 112, 325, 788, { r: 4, fill: C.white }) + RIGHT.map(([t, y, w, d, end]) => tx(1078, y, t, 18, { weight: 700, fill: SVC.title, w }) + tx(1327, y + 4, "Open", 12, { weight: 500, fill: SVC.blue }) +
  d.map((l, k) => tx(1078, y + 30 + k * 16, l, 12, { fill: SVC.sub })).join("") + (end ? line(1054, end + 0.5, 1379, end + 0.5, { stroke: SVC.line, sw: 2 }) : "")).join("") +
  tx(1078, 211, "Tidak dapat diakses publik", 14, { weight: 500, fill: SVC.text, w: 170 }) + icon("lock", 1259, 219, 14, SVC.mute) + tx(1078, 370, "LMS Access Link", 12, { weight: 500, fill: SVC.sub }) +
  box2(1078, 396, 277, 44, { fill: SVC.fieldBg }) + tx(1092, 410, "https://tokomu.myscalev.com/m...", 14, { fill: SVC.ink, w: 201 }) + tx(1314, 411, "Copy", 12, { weight: 500, fill: SVC.blue }) +
  rect(1384, 92, 6, 180, { r: 3, fill: "#c4c4c4" });
const PRODUCTS = ["Undangan Digital Basic", "Undangan Digital Premium", "Undangan Digital Eksklusif", "Tambahan: Musik Pilihan", "Tambahan: Buku Tamu Digital"];
const chip = (x, y, label, w, color) => box2(x, y, w, 44, { stroke: SVC.line }) + rect(x + 10, y + 14, 24, 16, { r: 3, fill: color }) + tx(x + 42, y + 14, label, 14, { weight: 500, fill: SVC.title }) +
  iconX("x", x + w - 22, y + 22, 12, "#d42a2a", 3);
const ALLPAY_CHIP = [665, 219, 177, 44];
const storeLeft = (o = {}) => rect(280, 112, 750, 2000, { r: 4, fill: C.white }) + rect(304, 136, 702, 96, { r: 4, fill: SVC.fieldBg }) + rect(328, 160, 48, 48, { fill: C.white }) + icon("image", 352, 184, 16, SVC.mute) +
  box2(400, 163, 494, 42) + tx(414, 176, "Rina WO", 14, { fill: SVC.title }) + rect(902, 164, 80, 40, { r: 4, fill: SVC.fieldBg }) + tx(927, 176, "Save", 14, { weight: 500, fill: SVC.grey, w: 30 }) +
  rect(304, 256, 702, 637, { r: 4, fill: SVC.fieldBg }) + tx(328, 280, "Products Offered", 18, { weight: 700, fill: SVC.title, w: 140 }) + rect(328, 325, 654, 477, { r: 4, fill: C.white }) +
  tx(355, 352, "Product Name", 12, { weight: 500, fill: SVC.mute, w: 78 }) + tx(811, 343, "# of", 12, { weight: 500, fill: SVC.mute }) + tx(790, 361, "variants", 12, { weight: 500, fill: SVC.mute, w: 43 }) +
  tx(865, 352, "Visibility", 12, { weight: 500, fill: SVC.mute, w: 46 }) +
  PRODUCTS.map((p, i) => {
    const y = 393 + i * 67;
    return rect(355, y + 19, 24, 24, { r: 4, fill: "#e5e7eb" }) + tx(395, y + 12, p, 14, { fill: SVC.title }) + tx(395, y + 35, "Digital", 12, { fill: SVC.sub }) + tx(825, y + 22, "1", 14, { fill: SVC.title }) +
      rect(880, y + 23, 32, 16, { r: 8, fill: SVC.blue }) + circle(903, y + 31, 6, { fill: C.white }) + iconX("x", 949, y + 31, 12, "#d42a2a", 3);
  }).join("") +
  tx(621, 745, "Show More", 12, { weight: 500, fill: SVC.blue }) + tx(339, 774, "+ Add Products", 12, { weight: 500, fill: SVC.blue }) + rect(328, 826, 654, 43, { r: 4, fill: C.white }) + tx(339, 840, "+ Add Bundles", 12, { weight: 500, fill: SVC.blue }) +
  rect(304, PMY, 702, 305, { r: 4, fill: SVC.fieldBg }) + tx(328, PMY + 24, "Payment Methods", 18, { weight: 700, fill: SVC.title, w: 148 }) + tx(328, PMY + 71, "Selected Payment Methods:", 12, { weight: 500, fill: SVC.sub, w: 153 }) +
  chip(328, PMY + 103, "QRIS", 111, "#1f2937") + chip(447, PMY + 103, "BCA Virtual Account", 210, "#0b4ea2") + (o.allepay ? chip(665, PMY + 103, "ALL E-Payment", 177, "#2bb3a3") : "") +
  box2(328, PMY + 167, 654, 77, { stroke: SVC.line }) + rect(346, PMY + 188, 36, 36, { r: 4, fill: SVC.fieldBg }) + icon("link", 364, PMY + 206, 18, SVC.sub) +
  tx(394, PMY + 187, "Pengaturan PayLink", 14, { weight: 500, fill: SVC.title }) + circle(399, PMY + 217, 5, { fill: "#2b1a07" }) + tx(410, PMY + 210, "Bahasa Indonesia · Pemilih bahasa nonaktif", 12, { fill: SVC.sub, w: 233 }) +
  tx(909, PMY + 199, "Kelola", 12, { weight: 500, fill: SVC.blue }) + iconX("arrow-right", 957, PMY + 206, 14, SVC.blue, 2.5) + tx(328, PMY + 263, "+ Add Payment Method", 12, { weight: 500, fill: SVC.blue, w: 126 }) +
  rect(304, PMY + 329, 702, 600, { r: 4, fill: SVC.fieldBg }) + tx(328, PMY + 353, "Extra Charges", 18, { weight: 700, fill: SVC.title, w: 114 }) +
  tx(328, PMY + 380, "Kelola biaya tambahan yang ditagihkan kepada customer berdasarkan metode pembayaran tertentu.", 12, { fill: SVC.grey, w: 544 }) +
  rect(902, PMY + 354, 80, 40, { r: 4, fill: SVC.fieldBg }) + tx(927, PMY + 366, "Save", 14, { weight: 500, fill: SVC.grey, w: 30 }) + box2(328, PMY + 416, 654, 400, { stroke: SVC.line }) +
  rect(330, PMY + 418, 650, 102, { fill: SVC.fieldBg }) + [["Metode", 342, 46], ["Service Fee", 578, 16], ["Biaya Lainnya", 733, 30], ["Total", 930, 46]].map(([t, x, d]) => tx(x, PMY + 416 + d, t, 12, { weight: 700, fill: SVC.grey })).join("");
// The page with the column scrolled to Payment Methods (static, for the scenes that start there).
const storeScrolled = (o) => scalevApp(0, 0, { active: "Stores" }) + rect(256, 0, 1184, 900, { fill: SV.bg }) + clipped(256, 89, 790, 811, group({ transform: `translate(0 ${-STORE_DY})` }, storeLeft(o))) + storeRight + storeHead;
const ADD_PM = [326, 374, 130, 24], PM_BLOCK = [304, 116, 702, 305];
// Dialog Add Payment Method (measured): accordion rows, ALL E-Payment open shows one inner row with a checkbox; Cancel / Save.
const PAY_ROWS = [["QRIS", "#1f2937"], ["E-Wallet", "#3b82f6"], ["ALL E-Payment", "#2bb3a3"], ["Virtual Account", "#0b4ea2"], ["Cash on Delivery (COD)", "#6b8e23"], ["No Payment", "#f5a524"], ["Bank Transfer", "#1e3a8a"]];
function payDialog(open, n) {
  const y0 = open ? 134 : 176, h = open ? 632 : 548;
  let s = shadow(497, y0, 431, h, 4, 2) + rect(497, y0, 431, h, { r: 4, fill: C.white }) + tx(521, y0 + 27, "Add Payment Method", 16, { weight: 700, fill: SVC.text, w: 157 }) +
    tx(904, y0 + 29, `${n} selected`, 12, { fill: SVC.sub, anchor: "end" });
  let y = y0 + 64;
  PAY_ROWS.forEach(([t, c], i) => {
    const big = open && i === 2, rh = big ? 136 : 52;
    s += box2(521, y, 368, rh) + rect(523, y + 2, 364, 48, { fill: SVC.fieldBg }) + rect(535, y + 16, 24, 16, { r: 3, fill: c }) + tx(567, y + 18, t, 14, { weight: 500, fill: SVC.title }) +
      icon(big ? "chevron-up" : "chevron-down", 868, y + 26, 14, SVC.mute);
    if (big) s += rect(539, y + 66, 332, 52, { r: 4, fill: SVC.fieldBg }) + rect(555, y + 84, 24, 16, { r: 3, fill: c }) + tx(587, y + 84, "ALL E-Payment", 14, { weight: 500, fill: SVC.dark }) + tick(839, y + 84, false);
    y += rh + 6;
  });
  return s + box2(723, y0 + h - 68, 80, 44, { stroke: SVC.line }) + tx(742, y0 + h - 54, "Cancel", 14, { weight: 500, fill: SVC.dark, w: 43 }) +
    rect(824, y0 + h - 66, 80, 40, { r: 4, fill: SVC.blue }) + tx(849, y0 + h - 54, "Save", 14, { weight: 500, fill: C.white, w: 30 });
}
const PAY_DLG = [497, 176, 431, 548], PAY_DLG_OPEN = [497, 134, 431, 632], ALLPAY_ROW = [521, 356, 368, 52], ALLPAY_TICK = [839, 398, 16, 16], PAY_SAVE = [824, 700, 80, 40];
const payTicked = tick(839, 398, true) + rect(820, 155, 90, 20, { fill: C.white }) + tx(904, 163, "3 selected", 12, { fill: SVC.sub, anchor: "end" });

// ---- 6. WhatsApp Web (not captured): generic chat list and one chat ------------------------------------------------
const favWa = (cx, cy) => circle(cx, cy, 8, { fill: "#25d366" });
const WA = { x: 461, head: [461, CT, 979, 60], foot: 838 };
function waWeb(name) {
  let s = chrome(0, 0, 1440, 900, { tabs: [{ title: "WhatsApp", active: true, fav: favWa }], url: "web.whatsapp.com" }) +
    rect(0, CT, 460, 815, { fill: C.white }) + rect(0, CT, 460, 60, { fill: "#f0f2f5" }) + circle(36, CT + 30, 20, { fill: "#dfe5e7" }) +
    rect(16, CT + 72, 428, 36, { r: 8, fill: "#f0f2f5" }) + bar(48, CT + 85, 140, 10, "#d1d7db");
  for (let k = 0; k < 9; k++) {
    const y = CT + 120 + k * 72;
    if (!k) s += rect(0, y, 460, 72, { fill: "#f0f2f5" });
    s += circle(40, y + 36, 24, { fill: "#dfe5e7" }) + bar(80, y + 22, [180, 140, 200, 160, 120, 190, 150, 170, 130][k], 10, "#d1d7db") + bar(80, y + 44, [260, 220, 240, 200, 250, 210, 230, 190, 220][k], 8, "#e9edef") + line(80, y + 71.5, 460, y + 71.5, { stroke: "#e9edef" });
  }
  return s + line(460.5, CT, 460.5, 900, { stroke: "#d1d7db" }) + rect(461, CT, 979, 60, { fill: "#f0f2f5" }) + circle(500, CT + 30, 20, { fill: "#dfe5e7" }) + icon("users", 500, CT + 30, 18, "#8696a0") +
    text(532, CT + 36, name, { size: 16, weight: 500, fill: "#111b21" }) + rect(461, CT + 60, 979, 693, { fill: "#efeae2" }) + rect(461, WA.foot, 979, 62, { fill: "#f0f2f5" }) + rect(477, WA.foot + 10, 887, 42, { r: 8, fill: C.white });
}
const WA_SEND = [1383, 848, 42, 42];
const waDraft = bar(497, WA.foot + 26, 260, 10, "#c9d1d6") + bar(767, WA.foot + 26, 110, 10, "#9aa6ad");
const waSend = circle(1404, 869, 21, { fill: "#008069" }) + icon("send", 1403, 869, 18, C.white);
const ticks = (x, y) => `<path d="M${x} ${y} l3 3 l6 -7 M${x + 6} ${y} l3 3 l6 -7" fill="none" stroke="#53bdeb" stroke-width="1.6" stroke-linecap="round"/>`;
const waBubble = rect(477, WA.foot + 10, 887, 42, { r: 8, fill: C.white }) + rect(1088, 740, 336, 64, { r: 8, fill: "#d9fdd3" }) + bar(1104, 758, 230, 10, "#a8c9a2") + bar(1104, 778, 100, 10, "#7fa978") + ticks(1394, 788);
const WA_CHAT = [461, CT, 979, 815];
// After Save in Edit Account (not observed, generic): a confirmation that shows the number with Verifikasi, later Cek Verifikasi.
const CD = { x: 520, y: 300 };
const confirmDlg = (btn, w) => shadow(CD.x, CD.y, 400, 220, 4, 2) + rect(CD.x, CD.y, 400, 220, { r: 4, fill: C.white }) + bar(CD.x + 24, CD.y + 32, 200, 12, "#dfe4ea") +
  icon("smartphone", CD.x + 40, CD.y + 92, 18, SVC.sub) + tx(CD.x + 58, CD.y + 80, "+62 81234567890", 20, { weight: 600, fill: SVC.title, mono: true }) + bar(CD.x + 24, CD.y + 124, 300) +
  rect(CD.x + 376 - w, CD.y + 160, w, 40, { r: 4, fill: SVC.blue }) + tx(CD.x + 376 - w / 2, CD.y + 172, btn, 14, { weight: 500, fill: C.white, anchor: "middle" });
const VERIF = [CD.x + 256, CD.y + 160, 120, 40], CEK = [CD.x + 236, CD.y + 160, 140, 40];

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
  const E = 727 + (o.img ? 299 : 164); // bottom of the image or upload box
  const F = E + 97; // Favicon label row
  let s = accGrad + rect(0, 154, 399, 1500, { fill: C.white }) + acc(170, 0) + rect(17, 247, 364, F + 340 - 246, { r: 8, fill: C.white, stroke: "#e8ebef", sw: 2 }) +
    rect(18, 248, 362, 58, { r: 6, fill: "#eef2f6" }) + rect(30, 260, 32, 32, { r: 8, fill: "url(#svAcc)" }) + lu(ACC_ICON.search, 46, 276, 16, C.white) +
    text(72, 281, ACC[1][0], { size: 12, weight: 700, fill: "#344157" }).replace("<text", '<text letter-spacing="0.96"') + icon("chevron-up", 359, 276, 14, "#7c899b") +
    svLabel(34, 335, "Judul Tag") + svField(34, 350, 315) + (o.judul ? text(48, 376, JUDUL, { size: 14, fill: "#0f161e" }) : "") +
    svLabel(34, 418, "Meta Description") + svField(34, 433, 315, 126) + (o.desc ? para(48, 459, DESC, { size: 14, fill: "#0f161e", lh: 20 }) : "") +
    rect(34, 584, 315, 104, { r: 4, fill: "#f6f9fc" }) + text(42, 603, "Pratinjau di Google Search", { size: 10, weight: 500, fill: "#5b6675" }) +
    (o.judul ? text(42, 629, JUDUL, { size: 14, weight: 500, fill: "#1a0dab" }) : "") + text(42, 647, PUB_URL, { size: 12, weight: 500, fill: "#006621" }) +
    (o.desc ? text(42, 673, DESC.join(" "), { size: 12, fill: "#545454" }) : "") +
    rect(34, 700, 315, E + 81 - 700, { r: 4, fill: "#f6f9fc" }) + text(42, 719, "Pratinjau di Sosial Media", { size: 10, weight: 500, fill: "#5b6675" });
  s += o.img ? clipped(42, 727, 299, 299, thumb(42, 727, 299)) :
    rect(53, 738, 277, 142, { r: 4, stroke: "#e8ebef", sw: 2 }) + icon("upload", 191, 790, 22, C.primary) +
    text(191, 826, "Upload Meta Gambar", { size: 14, weight: 500, fill: C.primary, anchor: "middle" }) + text(191, 846, ".jpg, .jpeg, .png, .webp", { size: 12, fill: "#5b6675", anchor: "middle" });
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
const IMG = { x: 42, y: 727 - SEO_DY, s: 299 };
const UPLOAD = [53, 738 - SEO_DY, 277, 142];
const seoAfter = (o) => clipCss(o.id, 0, 154, 399, 746) + (o.dy ? `<g transform="translate(0 ${-o.dy})">${seoContent(o)}</g>` : seoContent(o));
const PENCIL = [129, IMG.y + 133, 34, 34];
const imgHover = rect(IMG.x, IMG.y, IMG.s, IMG.s, { r: 4, fill: "rgba(65,64,66,.4)" }) +
  [["pencil", C.primary], ["trash", "#f14756"], ["eye", "#5b6675"]].map(([ic, c], i) => rect(129 + i * 46, IMG.y + 133, 34, 34, { r: 4, fill: "#e8ebef" }) + icon(ic, 146 + i * 46, IMG.y + 150, 16, c)).join("");
// WhatsApp outgoing bubble with the link card (square thumbnail, title, description, domain).
function waLink(x, y, w) {
  const p = 96, tx = x + p + 18;
  return rect(x, y, w, p + 72, { r: 8, fill: "#d9fdd3" }) + rect(x + 4, y + 4, w - 8, p, { r: 6, fill: "#c9eec3" }) + clipped(x + 4, y + 4, p, p, thumb(x + 4, y + 4, p)) +
    text(tx, y + 28, JUDUL, { size: 14, weight: 600, fill: "#111b21" }) + para(tx, y + 48, DESC, { size: 12, fill: "#4a5a63", lh: 16 }) + text(tx, y + 88, "tokomu.myscalev.com", { size: 12, fill: "#4a5a63" }) +
    text(x + 10, y + p + 30, PUB_URL, { size: 14, fill: "#027eb5" }) + text(x + w - 54, y + p + 60, "10.12", { size: 11, fill: "#667781" }) + ticks(x + w - 20, y + p + 54);
}

// ---- 8. Canva: public gallery measured at 1440x900 (14 Okt 2026); logged-in header, menus and editor generic --------------
const CV = { p: "#8b3dff", ink: "#0e1318", sub: "#545f71", line: "#d4d7dd" };
const favCanva = (cx, cy) => circle(cx, cy, 8, { fill: "#00c4cc" }) + text(cx, cy + 4, "C", { size: 10, weight: 700, fill: C.white, anchor: "middle" });
const GAL_TAB = { title: "Wedding invitation templates | Canva", w: 280, fav: favCanva };
const cvWin = (tabs, url) => chrome(0, 0, 1440, 900, { tabs, url });
const crown = (cx, cy) => circle(cx, cy, 12, { fill: "rgba(30,30,30,.72)" }) +
  `<path transform="translate(${cx - 7} ${cy - 7}) scale(.58)" d="M11.6 3.3a.5.5 0 0 1 .9 0l2.9 5.6a1 1 0 0 0 1.5.3l4.3-3.7a.5.5 0 0 1 .8.5l-2.8 10.3a1 1 0 0 1-1 .7H5.8a1 1 0 0 1-1-.7L2 6a.5.5 0 0 1 .8-.5l4.3 3.7a1 1 0 0 0 1.5-.3z" fill="#f5c84c"/>`;
// A template card: grey tile, the paper (portrait or envelope mock-up) with grey text lines.
const tpl = (x, y, w, h, tone, dark) => {
  const pw = Math.min(w - 24, h * 0.7), ph = pw * 1.4 > h - 24 ? h - 24 : pw * 1.4, px = x + (w - pw) / 2, py = y + (h - ph) / 2;
  return rect(x, y, w, h, { r: 8, fill: "#ecebe8" }) + rect(px, py, pw, ph, { r: 2, fill: tone }) +
    [0, 1, 2, 3, 4].map((k) => bar(px + pw / 2 - (pw * 0.6 - k * 8) / 2, py + ph * 0.3 + k * ph * 0.11, pw * 0.6 - k * 8, k ? 4 : 9, dark ? "#8f8b86" : "#d0cbc4")).join("");
};
// Gallery scrolled to "Top printed wedding invites" (page y + 85; measured second load).
const CAR = [[48, 256, "White Black Classic Monogram Eleg…", 0, "#ffffff"], [328, 183, "Grey and White Minimali…", 1, "#5d5a57"], [535, 183, "Beige Elegance Wedding I…", 0, "#f6f2ee"],
  [741, 256, "White and Blue Vintage Wedding Inv…", 1, "#c9d8ea"], [1021, 183, "Ivory Black Minimalist Lu…", 0, "#fbfaf7"], [1228, 256, "Cream Minimalist Elegant Ha", 0, "#f4efe6"]];
const CROWN = [491, 572]; // crown on "Grey and White Minimali…" (Pro)
const galleryDown = cvWin([{ ...GAL_TAB, active: true }], "canva.com/wedding-invitations/templates") + clipped(0, CT, 1425, 815,
  rect(0, CT, 1440, 815, { fill: C.white }) + text(48, 256, "Top printed wedding invites", { size: 21, weight: 500, fill: CV.ink }) +
  rect(1316.5, 234.5, 60, 31, { r: 8, fill: C.white, stroke: CV.line }) + text(1346, 255, "See all", { size: 14, weight: 600, fill: CV.ink, anchor: "middle" }) +
  text(48, 298, "Celebrate love: Get started with these popular templates", { size: 16, fill: "#3c3f47" }) +
  CAR.map(([x, w, name, pro, tone], i) => tpl(x, 336, w, 256, tone, i === 1) + (pro ? crown(x + w - 20, 572) : "") + text(x, 616, name, { size: 14, weight: 500, fill: CV.ink })).join("") +
  shadow(1365, 455, 48, 48, 24, 1) + circle(1389, 479, 24, { fill: C.white }) + icon("chevron-right", 1389, 479, 18, CV.ink) +
  rect(48.5, 645.5, 463, 39, { r: 8, fill: C.white, stroke: CV.line }) + iconX("search", 68, 665, 17, CV.ink) + text(88, 670, "Search thousands of templates", { size: 15, fill: CV.sub }) +
  rect(520.5, 645.5, 116, 39, { r: 20, fill: C.white, stroke: CV.line }) + text(560, 670, "All filters", { size: 14, weight: 500, fill: CV.ink }) + bar(530, 662, 18, 6, "#5b5f68") +
  rect(48, 709, 314, 260, { r: 8, fill: "#f2f3f5" }) + [386, 725, 1063].map((x, k) => tpl(x, 709, 314, 380, ["#f6f2ee", "#ede9f6", "#f4efe6"][k], false)).join("")) +
  rect(1425, CT, 15, 815, { fill: "#f6f6f6" }) + rect(1428, CT + 40, 8, 300, { r: 4, fill: "#c4c4c4" });
// Gallery top (measured first load; the logged-in header is generic: Create a design + avatar).
const NAV = [["Design", 536], ["Product", 606], ["Plans", 672], ["Business", 741], ["Education", 825], ["Help", 896]];
const CHIPS = [["All", 48, 75], ["Style", 131, 87], ["Theme", 226, 99], ["Color", 333, 90], ["Price", 431, 87], ["Feature", 526, 104]];
const CREATE_CV = [1197, 109, 140, 32];
const galleryTop = cvWin([{ ...GAL_TAB, active: true }], "canva.com/wedding-invitations/templates") +
  `<defs><linearGradient id="cvHero" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ece7fd"/><stop offset="1" stop-color="#ffffff"/></linearGradient></defs>` + clipped(0, CT, 1425, 815,
  rect(0, CT, 1440, 815, { fill: C.white }) + rect(0, CT, 1440, 330, { fill: "url(#cvHero)" }) +
  text(48, 137, "Canva", { size: 32, weight: 700, fill: "#7d2ae8", italic: true, font: SERIF }) + NAV.map(([n, cx]) => text(cx, 130, n, { size: 15, weight: 500, fill: CV.ink, anchor: "middle" })).join("") +
  rect(...CREATE_CV, { r: 8, fill: CV.p }) + text(CREATE_CV[0] + 70, 130, "Create a design", { size: 14, weight: 600, fill: C.white, anchor: "middle" }) +
  circle(1361, 125, 16, { fill: "#7d2ae8" }) + text(1361, 130, "R", { size: 14, weight: 600, fill: C.white, anchor: "middle" }) +
  text(48, 206, "Home", { size: 15, fill: CV.ink }) + icon("chevron-right", 107, 201, 16, CV.ink) + text(128, 206, "Wedding invitation te…", { size: 15, fill: CV.ink }) +
  text(712, 367, "Wedding invitation templates", { size: 48, fill: CV.ink, anchor: "middle" }) +
  rect(519.5, 402.5, 387, 47, { r: 8, fill: C.white, stroke: CV.line }) + iconX("search", 543, 425, 20, CV.ink) + text(567, 431, "Search templates", { size: 15, fill: CV.sub }) +
  text(380, 491, "Spread the word about your big day with these free and printable wedding invit…", { size: 17, fill: "#3c3f47" }) + text(1005, 491, "More", { size: 17, fill: "#3c3f47", underline: true }) +
  CHIPS.map(([n, x, w]) => rect(x + 0.5, 592.5, w - 1, 39, { r: 20, fill: C.white, stroke: CV.line }) + text(x + (n === "All" ? 41 : 16), 617, n, { size: 15, fill: CV.ink }) +
    (n === "All" ? bar(x + 15, 609, 14, 6, "#5b5f68") : icon("chevron-down", x + w - 22, 612, 14, CV.ink))).join("") +
  rect(48, 656, 314, 300, { r: 8, fill: "#f2f3f5" }) + [386, 725, 1063].map((x, k) => tpl(x, 656, 314, 440, ["#f6f2ee", "#ede9f6", "#f4efe6"][k], false)).join("")) +
  rect(1425, CT, 15, 815, { fill: "#f6f6f6" }) + rect(1428, CT + 4, 8, 300, { r: 4, fill: "#c4c4c4" });
const POP = { x: 1017, y: 149, w: 320 };
const popBox = (h) => shadow(POP.x, POP.y, POP.w, h, 8, 3) + rect(POP.x, POP.y, POP.w, h, { r: 8, fill: C.white });
const cvPop = popBox(170) + rect(POP.x + 16.5, POP.y + 16.5, POP.w - 33, 39, { r: 6, stroke: CV.line }) + text(POP.x + 30, POP.y + 41, "What would you like to create?", { size: 13, fill: CV.sub }) +
  rect(POP.x + 8, POP.y + 72, POP.w - 16, 40, { r: 6, fill: "#f2f3f5" }) + icon("plus", POP.x + 32, POP.y + 92, 16, CV.ink) + text(POP.x + 50, POP.y + 97, "Custom size", { size: 14, weight: 500, fill: CV.ink }) +
  bar(POP.x + 22, POP.y + 134, 150, 9, "#e4e6ea");
const CUSTOM = [POP.x + 8, POP.y + 72, POP.w - 16, 40];
const cvSize = popBox(184) + text(POP.x + 16, POP.y + 32, "Custom size", { size: 15, weight: 600, fill: CV.ink }) +
  text(POP.x + 16, POP.y + 58, "Width", { size: 12, fill: CV.sub }) + text(POP.x + 140, POP.y + 58, "Height", { size: 12, fill: CV.sub }) +
  rect(POP.x + 16.5, POP.y + 66.5, 112, 39, { r: 6, stroke: CV.line }) + rect(POP.x + 140.5, POP.y + 66.5, 112, 39, { r: 6, stroke: CV.line }) +
  rect(POP.x + 264.5, POP.y + 66.5, 40, 39, { r: 6, stroke: CV.line }) + text(POP.x + 284.5, POP.y + 91, "px", { size: 13, fill: CV.ink, anchor: "middle" }) +
  rect(POP.x + 16, POP.y + 124, POP.w - 32, 42, { r: 8, fill: CV.p }) + text(POP.x + POP.w / 2, POP.y + 150, "Create new design", { size: 14, weight: 600, fill: C.white, anchor: "middle" });
const cvW = text(POP.x + 28, POP.y + 91, "1080", { size: 14, fill: CV.ink }), cvH = text(POP.x + 152, POP.y + 91, "1080", { size: 14, fill: CV.ink });
const NEW_CV = [POP.x + 16, POP.y + 124, POP.w - 32, 42];
// Canva editor (generic): gradient bar, tool rail, the 1080x1080 page with the elements copied from the template.
const SQ = { x: 476, y: 181, s: 560 };
const SHARE_CV = [1310, 96, 106, 34];
const cvEditor = cvWin([{ title: "Wedding invitations | Canva", w: 250, fav: favCanva }, { title: "rani-dimas - 1080 × 1080px", active: true, w: 250, fav: favCanva }], "canva.com/design") +
  `<defs><linearGradient id="cvBar" x1="0" x2="1"><stop offset="0" stop-color="#00c4cc"/><stop offset="1" stop-color="#7d2ae8"/></linearGradient></defs>` +
  rect(0, CT, 1440, 56, { fill: "url(#cvBar)" }) + text(24, CT + 34, "File", { size: 15, weight: 500, fill: C.white }) + text(80, CT + 34, "Resize", { size: 15, weight: 500, fill: C.white }) +
  rect(...SHARE_CV, { r: 8, fill: C.white }) + icon("upload", SHARE_CV[0] + 26, SHARE_CV[1] + 17, 15, CV.ink) + text(SHARE_CV[0] + 44, SHARE_CV[1] + 23, "Share", { size: 15, weight: 600, fill: CV.ink }) +
  rect(0, CT + 56, 72, 759, { fill: "#f8f8fa" }) + ["layout-grid", "image", "type", "upload", "folder"].map((ic, i) => iconX(ic, 36, CT + 92 + i * 64, 20, CV.sub)).join("") +
  rect(72, CT + 56, 1368, 759, { fill: "#ebecf0" }) + rect(SQ.x, SQ.y, SQ.s, SQ.s, { fill: "#efe4d8" }) + rect(SQ.x + 26, SQ.y + 26, SQ.s - 52, SQ.s - 52, { stroke: "#b08968", sw: 3 }) +
  `<path d="M${SQ.x + 52} ${SQ.y + 156} q78 -117 195 -91 M${SQ.x + SQ.s - 52} ${SQ.y + SQ.s - 156} q-78 117 -195 91" fill="none" stroke="#b08968" stroke-width="2"/>` +
  text(SQ.x + SQ.s / 2, SQ.y + SQ.s + 34, "1080 × 1080 px", { size: 14, fill: CV.sub, anchor: "middle" });
const cvNames = text(SQ.x + SQ.s / 2, SQ.y + 273, "RANI & DIMAS", { size: 57, fill: "#6b4a2f", anchor: "middle", font: SERIF });
const cvDate = text(SQ.x + SQ.s / 2, SQ.y + 349, "14 . 02 . 2027", { size: 34, fill: "#6b4a2f", anchor: "middle", font: SERIF });
const NAMES = [SQ.x + 70, SQ.y + 218, SQ.s - 140, 75];
const cvSel = rect(NAMES[0], NAMES[1], NAMES[2], NAMES[3], { stroke: CV.p, sw: 2 });
const SHP = { x: 1036, y: 137, w: 380 };
const shareBox = (h) => shadow(SHP.x, SHP.y, SHP.w, h, 8, 3) + rect(SHP.x, SHP.y, SHP.w, h, { r: 8, fill: C.white });
const cvShare = shareBox(220) + text(SHP.x + 20, SHP.y + 36, "Share this design", { size: 16, weight: 600, fill: CV.ink }) + bar(SHP.x + 20, SHP.y + 62, 200, 9, "#e4e6ea") +
  rect(SHP.x + 20.5, SHP.y + 84.5, SHP.w - 41, 39, { r: 6, stroke: CV.line }) + bar(SHP.x + 34, SHP.y + 100, 160, 8, "#e4e6ea") +
  rect(SHP.x + 12, SHP.y + 146, SHP.w - 24, 52, { r: 6, fill: "#f2f3f5" }) + icon("download", SHP.x + 40, SHP.y + 172, 18, CV.ink) + text(SHP.x + 62, SHP.y + 177, "Download", { size: 15, weight: 500, fill: CV.ink });
const DL_ROW = [SHP.x + 12, SHP.y + 146, SHP.w - 24, 52];
const cvDl = shareBox(220) + iconX("arrow-left", SHP.x + 28, SHP.y + 32, 18, CV.ink) + text(SHP.x + 48, SHP.y + 38, "Download", { size: 16, weight: 600, fill: CV.ink }) +
  text(SHP.x + 20, SHP.y + 78, "File type", { size: 13, weight: 500, fill: CV.ink }) + rect(SHP.x + 20.5, SHP.y + 88.5, SHP.w - 41, 41, { r: 6, stroke: CV.line }) +
  text(SHP.x + 34, SHP.y + 115, "PNG", { size: 14, fill: CV.ink }) + icon("chevron-down", SHP.x + SHP.w - 40, SHP.y + 109, 16, CV.ink) +
  rect(SHP.x + 20, SHP.y + 152, SHP.w - 40, 44, { r: 8, fill: CV.p }) + text(SHP.x + SHP.w / 2, SHP.y + 179, "Download", { size: 15, weight: 600, fill: C.white, anchor: "middle" });
const DL_BTN = [SHP.x + 20, SHP.y + 152, SHP.w - 40, 44];
const DLB = { x: 1012, y: 89 };
const dlBubble = shadow(DLB.x, DLB.y, 400, 96, 10, 2) + rect(DLB.x, DLB.y, 400, 96, { r: 10, fill: C.white }) + clipped(DLB.x + 22, DLB.y + 20, 56, 56, thumb(DLB.x + 22, DLB.y + 20, 56)) +
  text(DLB.x + 94, DLB.y + 42, "rani-dimas.png", { size: 14, fill: C.crText }) + text(DLB.x + 94, DLB.y + 64, "Selesai · siap dipasang di Scalev", { size: 13, fill: C.crSub });

// ---- 9. Tutorial resmi: this guide on docs.page and tutorial.scalev.com, both measured at 1440x900 (14 Okt 2026) --------
const GUIDE_TAB = { title: "Tutorial resmi Scalev yang berg…", w: 250 }, TUT_TAB = { title: "A – Z Custom Domain di Scal…", w: 250, fav: favScalev };
const GUIDE_URL = "docs.page/hasyaapp/nikahkit-panduan/scalev/tutorial-scalev";
const DP = { ink: "#070707", sub: "#737373", line: "#e5e5e5", acc: C.accent };
const SIDE = [["Mulai", "rocket", 120, ["Selamat datang", "Alur kerja dari nol sampai jualan", "Istilah penting"]], ["Gabung dan pasang", "users", 305, ["Pilih paket membership", "Pasang ekstensi NikahKit", "Masuk dan bayar membership", "Hubungkan bisnis Scalev", "Update ekstensi"]],
  ["Siapkan Scalev", "landmark", 570, ["Akun dan paket Scalev", "Buat halaman undangan", "Simpan dan terbitkan", "Thumbnail WhatsApp dan", "sosmed", "Alamat dan domain sendiri", "Izin domain (tab Security)", "Terima pembayaran klien"]]];
const TOC = ["Langkah", "Akun dan keamanan", "Halaman (landing page)", "Domain", "Toko", "Jualan dan pembayaran", "Tanda berhasil", "Kalau ada masalah", "Lanjut"];
// One guide bullet: underlined link (measured width) + plain rest, optional second line (page y = text centre).
const li = (y, link, lw, rest, next) => circle(332, y + CT, 2.5, { fill: DP.ink }) + text(348, y + CT + 5, link, { size: 16, weight: 500, fill: "#1c1c1c" }) +
  line(348, y + CT + 10, 348 + lw, y + CT + 10, { stroke: DP.acc }) + text(348 + lw, y + CT + 5, rest, { size: 16, fill: "#262626" }) + (next ? text(348, y + CT + 33, next, { size: 16, fill: "#262626" }) : "");
const guidePage = (tabs) => chrome(0, 0, 1440, 900, { tabs, url: GUIDE_URL }) + clipped(0, CT, 1440, 815,
  rect(0, CT, 1440, 815, { fill: C.white }) + rect(0, CT, 1425, 65, { fill: C.white }) + line(0, CT + 64.5, 1425, CT + 64.5, { stroke: DP.line }) +
  rect(20, CT + 16, 24, 24, { r: 6, fill: "#4a9de8" }) + text(56, CT + 33, "Panduan NikahKit", { size: 16, weight: 500, fill: DP.ink }) +
  rect(1075.5, CT + 12.5, 126, 31, { r: 8, fill: C.white, stroke: DP.line }) + iconX("search", 1094, CT + 28, 15, DP.ink) + text(1110, CT + 33, "Search", { size: 14, weight: 500, fill: DP.ink }) + text(1164, CT + 32, "⌘K", { size: 12, fill: DP.sub }) +
  rect(1211, CT + 12, 95, 32, { r: 8, fill: DP.acc }) + text(1258.5, CT + 33, "WhatsApp", { size: 14, weight: 500, fill: C.white, anchor: "middle" }) +
  circle(1330, CT + 28, 9, { fill: DP.ink }) + text(1348, CT + 33, "0", { size: 12, fill: DP.sub }) + circle(1386, CT + 28, 8, { fill: DP.ink }) +
  SIDE.map(([g, ic, y, items], k) => (k ? line(16, y + CT - 32, 248, y + CT - 32, { stroke: DP.line }) : "") + iconX(ic, 32, y + CT, 14, DP.ink) + text(50, y + CT + 4, g, { size: 12, weight: 500, fill: "#3d3d3d" }) +
    items.map((t, i) => text(24, y + CT + 44 + i * 40 - (k === 2 && i > 3 ? 20 : 0), t, { size: 14, fill: k === 2 && i === 7 ? "#b5b5b5" : DP.sub })).join("")).join("") +
  icon("list", 1178, CT + 115, 14, DP.ink) + text(1195, CT + 120, "On this page", { size: 14, fill: DP.ink }) + line(1173.5, CT + 142, 1173.5, CT + 395, { stroke: DP.line }) + rect(1172, CT + 229, 3, 20, { fill: DP.acc }) +
  TOC.map((t, i) => text(1198, CT + 157 + i * 29, t, { size: 14, fill: t === "Domain" ? DP.acc : DP.sub })).join("") +
  text(348, CT + 79, "setiap kolom tab ", { size: 16, fill: "#262626" }) + text(472, CT + 79, "Security", { size: 16, weight: 600, fill: DP.ink }) + text(535, CT + 79, ".", { size: 16, fill: "#262626" }) +
  li(110, "Tutorial Cara Optimasi LP dengan Swap Slug", 329, ": cara menukar slug antara halaman lama dan", "duplikatnya. Ingat, halaman duplikat punya ID undangan baru, jadi RSVP lama tidak ikut.") +
  text(320, CT + 229, "Domain", { size: 30, fill: DP.ink }) +
  li(266, "A–Z Custom Domain di Scalev", 223, ": urutan wajib memasang domain sendiri. Mulai dari sini.") +
  li(302, "Tutorial Cara Memindahkan Pengaturan DNS ke Cloudflare", 432, ": video memindah DNS domain ke", "Cloudflare.") +
  li(366, "Tutorial Cara Menambahkan Domain dan Sub Domain Pribadi ke Scalev", 524, ": menambah domain lewat", "menu Setting > Domain, memasukkan DNS di Cloudflare, dan verifikasi.") +
  li(430, "Tutorial Cara Menambahkan Custom Sub-Domain ke Scalev", 440, ": langkah subdomain seperti") + rect(348, CT + 447, 196, 23, { r: 4, fill: "#f5f5f5" }) +
  text(354, CT + 463, "undangan.namabrand.com", { size: 14, fill: DP.ink, mono: true }) + text(550, CT + 463, ". Custom domain butuh paket Scalev minimal Lite.", { size: 16, fill: "#262626" }) +
  li(495, "Domain tidak bisa diakses, jangan-jangan blokir Komdigi", 417, ": cara cek domain diblokir dan solusinya.") +
  text(320, CT + 586, "Toko", { size: 30, fill: DP.ink }) + li(623, "Tutorial Cara Setting Toko Scalev", 244, ": video menyiapkan toko.") +
  li(659, "Cara Mengaktifkan Storefront Homepage", 305, ": empat video agar toko bisa diakses publik. Satu domain", "hanya untuk satu toko.") +
  text(320, CT + 778, "Jualan dan pembayaran", { size: 30, fill: DP.ink }) + li(815, "Tutorial Cara Jualan Produk Digital", 255, ": video menjual produk digital di Scalev.") +
  rect(1425, CT, 15, 815, { fill: "#f6f6f6" }) + rect(1428, CT + 455, 8, 200, { r: 4, fill: "#c4c4c4" }));
const DOMAIN_H2 = [318, CT + 200, 104, 36];
const AZ_LINK = [346, CT + 255, 227, 22];
const GUIDE_FOCUS = [300, CT + 190, 800, 330];
// tutorial.scalev.com/azcustomdomain: an article (no video), page y + 85.
const TUT_URL = "tutorial.scalev.com/azcustomdomain";
const tutFrame = chrome(0, 0, 1440, 900, { tabs: [{ ...GUIDE_TAB, fav: favScalev }, { ...TUT_TAB, active: true }], url: TUT_URL }) + rect(0, CT, 1440, 815, { fill: C.white }) +
  rect(1425, CT, 15, 815, { fill: "#f6f6f6" });
const TB = "#09afed", TI = "#171718";
const tutArticle = rect(0, CT, 1425, 1700, { fill: C.white }) + rect(343.5, CT + 50.5, 739, 204, { r: 8, fill: "#f7f8fb", stroke: "#e8eaef" }) +
  rect(394.5, CT + 116.5, 639, 72, { r: 4, fill: C.white, stroke: TB }) + iconX("search", 426, CT + 153, 20, TB) + text(456, CT + 158, "Ketikkan keyword di sini...", { size: 15, fill: "#8a8a8a" }) +
  text(343, CT + 299, "Beranda", { size: 13, fill: TB }) + text(397, CT + 299, "»", { size: 13, fill: TI }) + text(409, CT + 299, "App Dashboard", { size: 13, fill: TB }) + text(507, CT + 299, "»", { size: 13, fill: TI }) +
  text(518, CT + 299, "Setting", { size: 13, fill: TB }) + text(566, CT + 299, "»", { size: 13, fill: TI }) + text(577, CT + 299, "A – Z Custom Domain di Scalev (Nurut Aja, Biar Gak Ribet Di Tengah Jalan!)", { size: 13, fill: TI }) +
  para(343, CT + 381, ["A – Z Custom Domain di Scalev (Nurut Aja, Biar Gak Ribet", "Di Tengah Jalan!)"], { size: 26, weight: 700, fill: TI, lh: 34 }) +
  rect(593, CT + 445, 239, 84, { stroke: "#000", sw: 4, fill: C.white }) + bar(608, CT + 465, 110, 12, "#d0d0d0") + bar(608, CT + 500, 190, 12, "#e0e0e0") +
  text(343, CT + 574, "Di atas adalah jumlah user Scalev per tulisan ini diketik.", { size: 17, fill: TI }) +
  para(343, CT + 625, ["Jadi apa yang mau saya sampaikan di sini, adalah kesimpulan dari pengalaman ngajarin orang", "sebanyak itu untuk urusan custom domain."], { size: 17, fill: TI, lh: 26 }) +
  text(346, CT + 701, "⇣", { size: 17, fill: TI }) + text(343, CT + 753, "Ada 2 jenis type orang yang ketika mau setting custom domain:", { size: 17, fill: TI }) +
  text(375, CT + 804, "1.  Type yang: Gue pilih cara gue sendiri.", { size: 17, fill: TI }) + text(375, CT + 829, "2.  Type yang: OK gue ikuti semua sesuai tutorial.", { size: 17, fill: TI }) +
  text(346, CT + 880, "⇣", { size: 17, fill: TI }) +
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((k) => bar(343, CT + 920 + k * 34, [700, 640, 420, 720, 680, 300, 700, 560, 650, 380, 710, 600, 480, 690, 520][k], 12, "#e4e6ea")).join("");
const TUT_ART = [330, CT, 770, 815];

// ---- 10. Phone: the link in WhatsApp, then the public page (phoneDesk, content at PHONE) -------------------------------
const PX = PHONE.x, PY = PHONE.y, PH = PHONE.h;
const phoneWa = rect(PX, PY, 390, PH, { fill: "#efeae2" }) + rect(PX, PY, 390, 64, { fill: C.white }) +
  iconX("arrow-left", PX + 22, PY + 38, 20, "#111b21") + circle(PX + 62, PY + 38, 17, { fill: "#dfe5e7" }) + icon("users", PX + 62, PY + 38, 16, "#8696a0") +
  text(PX + 90, PY + 44, "Rina WO (Anda)", { size: 16, weight: 500, fill: "#111b21" });
const BUB = { x: PX + 38, y: PY + 250 };
const BUB_LINK = [BUB.x + 6, BUB.y + 108, 300, 26];
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
const phoneWeb = rect(PX, PY, 390, PH, { r: 12, fill: C.white }) + rect(PX + 14, PY + 14, 330, 36, { r: 18, fill: C.crOmni }) + icon("lock", PX + 34, PY + 32, 13, C.crIcon) +
  text(PX + 48, PY + 37, "tokomu.myscalev.com/rani-dimas", { size: 14, fill: C.crText }) + iconX("more-vertical", PX + 366, PY + 32, 18, C.crIcon) + line(PX, PY + 62.5, PX + 390, PY + 62.5, { stroke: "#e3e3e3" });
const phPage = clipCss("page", PX, P0, 390, PH - 63) + cover(PX, P0, 783) + phSecs(P0 + 783);
const VIDEO = [PX + 20, P0 + 20, 350, 197];
const KIRIM = { box: [PX + 24, P0 + 604, 342, 46], r: 23 };
const phPlaying = rect(PX + 20, P0 + 20, 350, 197, { r: 6, fill: "#2b2b2b" }) + rect(PX + 70, P0 + 60, 250, 110, { r: 4, fill: "#444" }) + rect(PX + 32, P0 + 200, 326, 3, { fill: "#666" }) + rect(PX + 32, P0 + 200, 90, 3, { fill: "#ff0000" });
const phThanks = rect(PX + 24, P0 + 262, 342, 320, { r: 8, fill: C.white, stroke: "#d8c6b0" }) + text(PX + 195, P0 + 400, "Terima Kasih", { size: 28, fill: M, anchor: "middle", font: SERIF, italic: true }) +
  para(PX + 195, P0 + 440, ["Terima kasih, pesan Anda", "sudah kami terima."], { size: 15, fill: "#1f1f1f", anchor: "middle", lh: 22 });
const PHONE_R = [PX, PY, 390, PH];

// ---- 11. Akun: business switcher (measured: Pilih Bisnis Kamu), Security / MFA under Profil (measured text) ----------
const bizMenu = shadow(24, 120, 268, 223, 6, 2) + rect(24, 120, 268, 223, { r: 6, fill: C.white }) + text(40, 150, "Pilih Bisnis Kamu", { size: 12, fill: "#3b4350" }) +
  rect(41, 171, 234, 40, { r: 4, fill: C.white, stroke: "#d5dae1", sw: 2 }) + text(54, 196, "Cari Bisnis", { size: 14, fill: "#8d97a3" }) + iconX("search", 252, 191, 13, "#3b4350") +
  rect(41, 227, 234, 53, { r: 4, fill: "#f8fafc", stroke: SV.blue, sw: 2 }) + text(66, 258, "R", { size: 12, weight: 700, fill: "#3b4350", anchor: "middle" }) + text(86, 258, "Rina WO", { size: 14, weight: 500, fill: SV.ink }) +
  text(158, 314, "+ Buat Bisnis Baru", { size: 12, weight: 500, fill: SV.link, anchor: "middle" });
const BIZ = [24, 62, 206, 48];

// ---- 12. Domain preparation: registrar and Cloudflare sign-up (not captured: generic, 1440 wide) ------------------------
const genWin = (title, url, fav) => chrome(0, 0, 1440, 900, { tabs: [{ title, active: true, w: 260, fav }], url }) + rect(0, CT, 1440, 815, { fill: C.white });
const regPage = genWin("Penyedia domain", "penyedia-domain › namabrand.com") + rect(0, CT, 1440, 64, { fill: "#f7f8fa" }) + line(0, CT + 64.5, 1440, CT + 64.5, { stroke: SV.line }) +
  bar(48, CT + 27, 140, 12, "#cfd5dd") + [0, 1, 2, 3].map((k) => bar(880 + k * 120, CT + 28, 80)).join("") +
  rect(320.5, CT + 100.5, 799, 51, { r: 6, fill: C.white, stroke: "#c9ced6" }) + text(342, CT + 132, "namabrand.com", { size: 16, fill: C.ink }) +
  card(320, CT + 180, 800, 96) + text(344, CT + 222, "namabrand.com", { size: 20, weight: 600, fill: C.ink }) + bar(344, CT + 242, 160) +
  rect(980, CT + 206, 116, 44, { r: 6, fill: "#2f6fde" }) + text(1038, CT + 234, "Beli", { size: 15, weight: 600, fill: C.white, anchor: "middle" }) +
  card(320, CT + 300, 800, 72) + check(344, CT + 327, false) + text(376, CT + 342, "Hosting", { size: 16, fill: C.ink }) + bar(480, CT + 332, 300) +
  [0, 1, 2].map((k) => card(320, CT + 400 + k * 96, 800, 80) + bar(344, CT + 432 + k * 96, [220, 180, 240][k], 12, "#dfe4ea")).join("");
const BELI = [980, CT + 206, 116, 44], HOSTING = [338, CT + 320, 100, 32];
const cfSign = genWin("Cloudflare", "dash.cloudflare.com/sign-up", favCf) + cloud(612, CT + 120, 1.6, cfOrange) + text(660, CT + 112, "Cloudflare", { size: 26, weight: 600, fill: "#1f1f1f" }) +
  bar(560, CT + 150, 320, 12, "#e4e6ea") + [0, 1].map((k) => rect(520.5, CT + 190.5 + k * 74, 400, 47, { r: 6, fill: C.white, stroke: "#c9ced6" }) + bar(536, CT + 210 + k * 74, 160, 9, "#e4e6ea")).join("") +
  rect(520, CT + 350, 400, 48, { r: 6, fill: cfOrange }) + bar(650, CT + 370, 140, 9, "#fbc9a0");
const CF_URL = [160, 52, tw("dash.cloudflare.com/sign-up", 14) + 12, 24];
const nsPage = genWin("Penyedia domain", "penyedia-domain › namabrand.com › nameserver") + text(320, CT + 70, "namabrand.com", { size: 24, weight: 700, fill: C.ink }) +
  card(320, CT + 100, 800, 250) + text(344, CT + 140, "Nameserver", { size: 18, weight: 600, fill: C.ink }) +
  ["ana.ns.cloudflare.com", "bob.ns.cloudflare.com"].map((v, k) => rect(344.5, CT + 164.5 + k * 60, 520, 45, { r: 6, fill: C.white, stroke: "#c9ced6" }) + text(360, CT + 193 + k * 60, v, { size: 16, fill: C.ink, mono: true })).join("") +
  rect(344, CT + 290, 120, 42, { r: 6, fill: "#2f6fde" }) + text(404, CT + 317, "Simpan", { size: 15, weight: 600, fill: C.white, anchor: "middle" });
const NS_SAVE = [344, CT + 290, 120, 42];

export const scenes = {
  "scalev-buat-halaman-html": {
    title: "Membuka Landing Pages di dasbor Scalev",
    base: [scalevApp(0, 0, { active: "Home" }), head("Home"), genericBody()],
    els: { lp: { svg: lpScreen(), skel: true, enter: "fade" } },
    steps: [{
      caption: "Di dasbor Scalev, klik Landing Pages di menu kiri.", focus: [0, 118, 256, 540], at: svMenuAt("Landing Pages"), click: true, show: ["lp"], dur: 3.4,
      mark: { box: [28, 220, 196, 28], r: 6 }, lens: { src: [8, 180, 248, 110] }
    }]
  },

  "scalev-lp-html": {
    title: "Membuat landing page baru tipe HTML Mode",
    base: [lpScreen()],
    els: {
      create: btnCreate,
      shade: { svg: dim(0, 0, 1440, 900), enter: "fade" },
      typeDlg: { svg: typeDlg, enter: "pop", origin: [CREATE[0] + CREATE[2] / 2, CREATE[1] + 20] },
      tile: { svg: htmlTile(true), enter: "fade" }
    },
    steps: [
      { caption: "Klik + Create Landing Page.", focus: [256, 0, 1184, 137], at: [CREATE[0] + CREATE[2] / 2, CREATE[1] + 20], click: true, press: "create", show: ["shade", "typeDlg"], mark: CREATE, lens: { src: [270, 70, 192, 56] } },
      { caption: "Pilih tipe HTML Mode.", focus: [DLG.x, DLG.y, DLG.w, DLG.h], at: [DLG.x + 368, DLG.y + 170], click: true, press: "tile", show: ["tile"], mark: { box: HTML_TILE, r: 6 }, lens: { src: [DLG.x + 252, DLG.y + 66, 232, 207] } }
    ]
  },

  "scalev-tab-nikahkit": {
    title: "Editor HTML Mode terbuka, lalu klik tab NikahKit",
    base: [scalevEditor(0, 0, { tab: "Code" }), desktopPreview],
    els: {
      edNk: { svg: edNikahKit({ locked: true }), skel: true, enter: "fade" },
      tip: { svg: lockTip, enter: "fade", delay: 0.8 }
    },
    steps: [
      { caption: "Editor terbuka dengan tab Code, Media, Security, Settings.", focus: [0, 44, 399, 48], mark: { box: [8, 52, 222, 28], r: 6 }, lens: TABS_LENS, dur: 3.2 },
      { caption: "Tab NikahKit berlogo biru ada di ujung strip tab.", at: ED.tab.NikahKit, mark: tabMark("NikahKit"), lens: TABS_LENS },
      { caption: "Klik NikahKit. Menu selain Template dan Media terkunci.", focus: PANEL, at: ED.tab.NikahKit, click: true, show: ["edNk", "tip"], dur: 4, mark: tabMark("NikahKit"), lens: { src: [0, 98, 380, 110], at: [300, 70] } }
    ]
  },

  "scalev-slug-simpan": {
    title: "Klik Simpan di kanan atas editor",
    base: [settingsEd({ pub: false }), desktopPreview, slugText("rani-dimas")],
    els: { simpan: btnSimpan },
    steps: [{ caption: "Klik Simpan di kanan atas editor.", focus: [[...TOOLBAR], DOMAIN_ACC], at: ED.simpan, click: true, press: "simpan", dur: 3.4, mark: SIMPAN, lens: { src: [1180, 44, 260, 50] } }]
  },

  "scalev-slug-id": {
    title: "Alamat halaman berisi ID undangan",
    base: [frame(), shifted(settingsEd({ pub: false }) + desktopPreview + slugText("rani-dimas"))],
    els: {
      saved: { svg: urlSwap("app.scalev.com/pages/365671"), enter: "fade", delay: 0.3 },
      now: { svg: text(34, CT + 334, "Saat ini:", { size: 12, weight: 500, fill: C.strong }) + text(82, CT + 334, PUB_URL, { size: 12, weight: 500, fill: C.primary }), enter: "fade", delay: 0.3 },
      edNk: { svg: shifted(edNikahKit()), skel: true, enter: "fade" }
    },
    steps: [
      { caption: "Tersimpan: alamat jadi app.scalev.com/pages/365671. Angka itu ID undangan.", focus: [OMNI.box, dn(DOMAIN_ACC)], show: ["saved", "now"], dur: 4,
        mark: { box: [160, 52, tw("app.scalev.com/pages/365671", 14) + 12, 24], r: 4 }, lens: { src: [134, 48, 300, 30] } },
      { caption: "Klik NikahKit lagi, lalu pilih template. Menu lain terbuka.", focus: dn(PANEL), at: [ED.tab.NikahKit[0], ED.tab.NikahKit[1] + CT], click: true, show: ["edNk"], hide: ["now"], dur: 3.6,
        mark: { box: dn(TAB.NikahKit), r: 6 }, lens: { src: [0, CT + 98, 380, 110], at: [300, 90] } }
    ]
  },

  "scalev-slug-isi": {
    title: "Mengisi slug di tab Settings",
    base: [edNikahKit({ locked: true })],
    els: {
      set: { svg: settingsEd({ pub: false }) + desktopPreview, skel: true, enter: "fade" },
      focus: { svg: slugFocus, enter: "fade" },
      slug: slugText("rani-dimas")
    },
    steps: [
      { caption: "Klik tab Settings. Bagian DOMAIN / URL berisi Slug URL.", focus: [[0, 44, 399, 48], DOMAIN_ACC], at: ED.tab.Settings, click: true, show: ["set"], mark: tabMark("Settings"), lens: { src: [0, 44, 392, 280], at: [300, 40] } },
      { caption: "Isi Slug URL, misalnya rani-dimas.", focus: DOMAIN_ACC, at: [SLUG[0] + 200, SLUG[1] + 21], click: true, show: ["focus", "slug"], type: [{ id: "slug", n: 10, box: [48, 285, 76, 22] }], dur: 3.4, mark: SLUG, lens: SLUG_LENS }
    ]
  },

  "scalev-ubah-slug": {
    title: "Mengubah slug di tab Settings lalu Simpan & Terbitkan",
    base: [editorKonten()],
    els: {
      set: { svg: SET_PUB(), skel: true, enter: "fade" },
      old: slugText("undangan-baru"),
      clear: { svg: rect(37, 277, 324, 36, { fill: "#f6f9fc" }) + slugFocus, enter: "fade" },
      slug: slugText("rani-dimas")
    },
    steps: [
      { caption: "Di editor halaman, klik tab Settings.", focus: [[0, 44, 399, 48], DOMAIN_ACC], at: ED.tab.Settings, click: true, show: ["set", "old"], mark: tabMark("Settings"), lens: { src: [0, 44, 390, 300], at: [300, 40] } },
      { caption: "Ganti Slug URL, misalnya rani-dimas.", focus: DOMAIN_ACC, at: [SLUG[0] + 200, SLUG[1] + 21], click: true, show: ["clear", "slug"], hide: ["old"], type: [{ id: "slug", n: 10, box: [48, 285, 76, 22] }], dur: 3.4, mark: SLUG, lens: SLUG_LENS }
    ]
  },

  "scalev-simpan-terbitkan": {
    title: "Simpan dan Simpan & Terbitkan di editor Scalev",
    base: [editorKonten({ saving: "Tersimpan" })],
    els: { shareA: { svg: shareDialog(true), enter: "fade" } },
    steps: [
      { caption: "Ubah undangan di tab NikahKit. Tunggu kaki rel: Tersimpan.", focus: [0, 851, 72, 49], dur: 3.4, mark: { box: [0, 851, 71, 49], r: 0 }, lens: { src: [0, 792, 72, 108] } },
      { caption: "Klik Bagikan: Perubahan belum disimpan di Scalev.", focus: [0, 92, 399, 808], at: ED.tool.Bagikan, click: true, show: ["shareA"], dur: 3.6, mark: TOOL.Bagikan, lens: { src: [0, 100, 399, 120], at: [300, 70] } }
    ]
  },

  "scalev-terbitkan": {
    title: "Klik Simpan & Terbitkan di kanan atas editor Scalev",
    base: [editorKonten()],
    els: { pub: btnPub },
    steps: [{ caption: "Klik Simpan & Terbitkan di kanan atas editor. Tunggu sampai selesai.", focus: TOOLBAR, at: ED.terbitkan, click: true, press: "pub", dur: 3.4, mark: TERBIT, lens: { src: [1180, 44, 260, 50] } }]
  },

  "scalev-bagikan-salin": {
    title: "Menyalin tautan umum dari Bagikan setelah terbit",
    base: [editorKonten()],
    els: { shareB: { svg: shareDialog(false), enter: "fade" }, copied: { svg: nkHint(16, 465, "Tersalin."), enter: "fade" } },
    steps: [
      { caption: "Klik Bagikan lagi. Peringatan sudah hilang.", focus: [0, 92, 399, 808], at: ED.tool.Bagikan, click: true, show: ["shareB"], mark: TOOL.Bagikan, lens: { src: [0, 100, 399, 154], at: [300, 70] } },
      { caption: "Klik Salin tautan umum untuk menyalin alamat publik.", at: [199, 431], click: true, show: ["copied"], mark: SALIN_UMUM, lens: { src: [8, 407, 384, 66] } }
    ]
  },

  "scalev-buka-di-hp": {
    title: "Membuka alamat publik undangan di HP",
    base: [phoneDesk(phoneWa)],
    els: {
      bubble: { svg: waLink(BUB.x, BUB.y, 340), enter: "slide", delay: 0.4 },
      web: { svg: phoneWeb, enter: "fade" },
      page: { svg: phPage, enter: "fade" },
      playing: { svg: phPlaying, enter: "fade" },
      thanks: { svg: phThanks, enter: "pop", origin: [PX + 195, P0 + 627] }
    },
    steps: [
      { caption: "Kirim tautan umum ke WhatsApp-mu sendiri.", focus: PHONE_R, show: ["bubble"], dur: 3.4, mark: { box: [BUB.x, BUB.y, 340, 168], r: 8 }, lens: { src: [BUB.x - 4, BUB.y - 4, 348, 176] } },
      { caption: "Ketuk tautannya di HP. Halaman publik undangan terbuka.", at: [BUB.x + 120, BUB.y + 121], click: true, show: ["web", "page"], dur: 3.8, mark: BUB_LINK, lens: { src: [PX + 24, PY + 18, 256, 28] } },
      { caption: "Putar video YouTube. Di halaman yang sudah terbit, video berjalan.", scroll: { id: "page", dy: 783 }, at: [PX + 195, P0 + 118], click: true, show: ["playing"], dur: 3.6, mark: { box: VIDEO, r: 6 } },
      { caption: "Kirim ucapan dan konfirmasi hadir. Ucapan & RSVP aktif setelah terbit.", at: [PX + 195, P0 + 627], click: true, show: ["thanks"], hide: ["playing"], dur: 4, mark: KIRIM, lens: { src: [PX + 75, P0 + 365, 240, 110] } }
    ]
  },

  "scalev-security-csp": {
    title: "Izin domain (CSP) di Bantuan NikahKit dan tab Security Scalev",
    base: [editorKonten()],
    els: {
      help: { svg: nkDialogHead(0, 0, "Bantuan"), enter: "fade" },
      helpBody: { svg: clipCss("helpBody", 0, 154, 386, 746) + helpBody(), enter: "fade" },
      helpBar: { svg: rect(388, 160, 6, 120, { r: 3, fill: "#c9ced6" }), enter: "fade" },
      copied: { svg: nkHint(16, up(HB.msg), "Tersalin. Tempel di tab Security."), enter: "fade" },
      secFrame: { svg: scalevEditor(0, 0, { tab: "Security" }) + rect(0, 92, 399, 808, { fill: C.white }) + cover(SC.x, SC.y), skel: true, enter: "fade" },
      secBody: { svg: clipCss("secBody", 0, 92, 399, 808) + secContent({}), skel: true, enter: "fade" },
      picker: { svg: secPicker({ value: "" }), enter: "fade" },
      pickRow: { svg: secPicker({ value: "https://foto.contoh.com", ticked: false }), enter: "fade", delay: 1.2 },
      pickVal: rect(28, 186, 300, 38, { fill: C.white }) + tx(40, 197, "https://foto.contoh.com", 14, { fill: SVC.dark }),
      ticked: { svg: tick(34, 249, true) + rect(18, 140, 320, 39, { fill: SVC.fieldBg }) + tx(30, 151, "1 selected", 14, { fill: SVC.dark }), enter: "fade" }
    },
    steps: [
      { caption: "Di tab NikahKit, klik Bantuan di bagian bawah rel kiri.", focus: [0, 790, 72, 60], at: ED.tool.Bantuan, click: true, show: ["help", "helpBody", "helpBar"], mark: TOOL.Bantuan, lens: { src: [8, 160, 368, 118], at: [320, 60] } },
      { caption: "Gulir ke Izin domain (CSP). Tiap domain punya status.", focus: [0, 92, 399, 808], scroll: { id: "helpBody", dy: HB_DY }, dur: 3.6,
        mark: [16, up(HB.rows[2][0]), 351, HB.rows[2][1]], lens: { src: [8, up(HB.h3) - 10, 380, HB.rows[3][0] - HB.h3 + 8] } },
      { caption: "Ada Perlu ditambah manual? Klik Salin domain kurang.", at: [190, up(HB.copy) + 18], click: true, show: ["copied"], dur: 3.4,
        mark: [16, up(HB.copy), 351, 36], lens: { src: [8, up(HB.recheck) - 8, 380, up(HB.msg) - up(HB.recheck) + 20] } },
      { caption: "Lihat hasil salinan, lalu klik tab Security.", focus: [[0, 44, 399, 48], [0, 92, 399, 808]], at: ED.tab.Security, click: true, show: ["secFrame", "secBody"], hide: ["help", "helpBody", "helpBar", "copied"],
        mark: tabMark("Security"), lens: TABS_LENS },
      { caption: "Gulir ke kolom yang cocok: img_src ke Image Sources. Klik kolomnya.", focus: [0, 92, 399, 330], scroll: { id: "secBody", dy: IMG_DY }, at: [190, 159], click: true, show: ["picker"], dur: 3.8,
        mark: SECURITY.imageSelect, lens: { src: [8, 104, 383, 135] } },
      { caption: "Tempel domainnya saja di kotak Add image domain, misalnya foto.contoh.com.", at: [190, 205], click: true, show: ["pickRow", "pickVal"],
        type: [{ id: "pickVal", n: 23, box: [40, 195, 152, 22] }], dur: 3.8, mark: SECURITY.pickerInput, lens: { src: [16, 176, 351, 106] } },
      { caption: "Centang domain yang muncul. Image Sources jadi 1 selected.", at: [42, 257], click: true, show: ["ticked"], dur: 3.6, mark: { box: SECURITY.pickerTick, r: 4 }, lens: { src: [8, 132, 367, 150] } }
    ]
  },

  "scalev-periksa-ulang": {
    title: "Memeriksa ulang izin domain di Bantuan",
    base: [editorKonten()],
    els: {
      help: { svg: nkDialogHead(0, 0, "Bantuan") + clipped(0, 154, 386, 746, `<g transform="translate(0 ${-HB_DY})">${helpBody()}</g>`), enter: "fade" },
      fixed: { svg: cspRow(CSP[2], up(HB.rows[2][0]), HB.rows[2][1], "Sudah diizinkan", false) + nkBtn(16, up(HB.copy), "Salin daftar domain", { w: 351, size: 14, variant: "quiet", icon: "copy" }) + nkHint(16, up(HB.msg), "Diperiksa ulang."), enter: "fade" }
    },
    steps: [
      { caption: "Setelah terbit, klik Bantuan lagi di rel kiri.", focus: [0, 790, 72, 60], at: ED.tool.Bantuan, click: true, show: ["help"], mark: TOOL.Bantuan, lens: { src: [8, up(HB.h3) - 10, 380, HB.rows[2][0] - HB.h3 + 8], at: [320, 60] } },
      { caption: "Klik Periksa ulang: statusnya jadi Sudah diizinkan.", focus: [0, 92, 399, 808], at: [190, up(HB.recheck) + 18], click: true, show: ["fixed"], dur: 3.8,
        mark: [16, up(HB.recheck), 351, 36], lens: { src: [8, up(HB.rows[2][0]) - 5, 380, up(HB.recheck) - up(HB.rows[2][0]) + 49] } }
    ]
  },

  "scalev-custom-domain": {
    title: "Menambahkan domain sendiri di Settings Scalev",
    base: [profilPage()],
    els: {
      dom: { svg: domainPage(), skel: true, enter: "fade" },
      shade: { svg: dim(0, 0, 1440, 900), enter: "fade" },
      dlg: { svg: domainDlg, enter: "pop", origin: [720, 450] },
      typed: domTyped,
      saveOn: { svg: domSaveOn, enter: "fade", delay: 1.6 },
      done: { svg: domainPage() + dnsTable, skel: true, enter: "fade" }
    },
    steps: [
      { caption: "Di Settings dasbor Scalev, buka bagian Domain.", focus: [SUBMENU, [480, 83, 936, 220]], at: subAt("Domain"), click: true, show: ["dom"], mark: { box: subBox("Domain"), r: 4 }, lens: { src: [292, 377, 176, 92] } },
      { caption: "Klik + Tambah Domain.", focus: DOM_DLG, at: [635, 128], click: true, show: ["shade", "dlg"], mark: TAMBAH, lens: { src: [504, 110, 400, 36] } },
      { caption: "Ketik domain atau subdomain, misalnya undangan.namabrand.com.", at: [720, 462], click: true, show: ["typed", "saveOn"],
        type: [{ id: "typed", n: 22, box: [520, 452, 170, 22] }], dur: 3.6, mark: DOM_IN, lens: { src: [498, 432, 444, 60], at: [40, 420] } },
      { caption: "Klik Save. Scalev menampilkan kode DNS (Type, Name, Target).", focus: [496, 270, 904, 320], at: [901, 521], click: true, show: ["done"], hide: ["shade", "dlg", "typed", "saveOn"], dur: 3.6,
        mark: DOM_SAVE, lens: { src: [528, 381, 600, 96], zoom: 1.25, at: [380, 420] } }
    ]
  },

  "scalev-domain-verifikasi": {
    title: "Menyalin record DNS ke Cloudflare lalu verifikasi di Scalev",
    base: [domainPage(), dnsTable],
    els: {
      cf: { svg: cfPage, skel: true, enter: "fade" },
      cfForm: { svg: cfForm, enter: "pop", origin: [CF_ADD[0] + 66, CF_ADD[1] + 36] },
      back: { svg: domainPage() + dnsTable, skel: true, enter: "fade", delay: -1 },
      ok: { svg: verified, enter: "pop" }
    },
    steps: [
      { caption: "Di Cloudflare buka DNS.", focus: [0, CT + 53, 240, 762], at: [100, CF_DNS[1] + 17], show: ["cf"], dur: 2.8, mark: CF_DNS, lens: { src: [0, 150, 240, 200] } },
      { caption: "Klik Add Record. Salin Type, Name, Target persis. Proxy status: DNS Only.", focus: CF_TABLE, at: [CF_ADD[0] + 66, CF_ADD[1] + 18], click: true, show: ["cfForm"], dur: 4,
        mark: CF_ADD, lens: { src: [320, 330, 800, 148], zoom: 1.5, at: [80, 330] } },
      { caption: "Kembali ke Scalev, klik Verifikasi. Bisa butuh sampai 2x24 jam.", focus: [496, 270, 904, 320], at: [1318, 316], click: true, show: ["back", "ok"], hide: ["cf", "cfForm"], dur: 4,
        mark: VERIFY, lens: { src: [516, 289, 300, 54], at: [360, 330] } }
    ]
  },

  "scalev-epayment": {
    title: "Membuka Add Payment Method di toko Scalev",
    base: [scalevApp(0, 0, { active: "Home" }), head("Home"), genericBody()],
    els: {
      storeFrame: { svg: scalevApp(0, 0, { active: "Stores" }) + rect(256, 0, 1184, 900, { fill: SV.bg }) + storeRight + storeHead, skel: true, enter: "fade" },
      storeBody: { svg: clipCss("storeBody", 256, 89, 790, 811) + storeLeft(), skel: true, enter: "fade" },
      shade: { svg: dim(0, 0, 1440, 900), enter: "fade" },
      dlg: { svg: payDialog(false, 2), enter: "pop", origin: [712, 450] },
      dlgOpen: { svg: payDialog(true, 2), enter: "fade" }
    },
    steps: [
      { caption: "Klik Stores. Dengan satu toko, halaman tokomu langsung terbuka.", focus: [256, 0, 1184, 232], at: svMenuAt("Stores"), click: true, show: ["storeFrame", "storeBody"], dur: 3.4,
        mark: { box: [28, 412, 196, 28], r: 6 }, lens: { src: [8, 380, 248, 92] } },
      { caption: "Gulir ke Payment Methods, klik + Add Payment Method.", focus: PAY_DLG, scroll: { id: "storeBody", dy: STORE_DY }, at: [391, 386], click: true, show: ["shade", "dlg"], dur: 3.8,
        mark: ADD_PM, lens: { src: [318, 366, 148, 40], zoom: 2, at: [16, 300] } },
      { caption: "Di dialog Add Payment Method, buka ALL E-Payment.", focus: PAY_DLG_OPEN, at: [640, 366], click: true, show: ["dlgOpen"], hide: ["dlg"], dur: 3.4,
        mark: ALLPAY_ROW, lens: { src: [531, 372, 348, 68] } }
    ]
  },

  "scalev-epayment-simpan": {
    title: "Mencentang ALL E-Payment lalu Save",
    base: [storeScrolled(), dim(0, 0, 1440, 900), payDialog(true, 2)],
    els: {
      ticked: { svg: payTicked, enter: "pop" },
      after: { svg: storeScrolled({ allepay: true }), skel: true, enter: "fade" }
    },
    steps: [
      { caption: "Centang ALL E-Payment.", focus: PAY_DLG_OPEN, at: [847, 406], click: true, show: ["ticked"], mark: { box: ALLPAY_TICK, r: 4 }, lens: { src: [531, 372, 348, 68] } },
      { caption: "Klik Save. ALL E-Payment masuk ke Selected Payment Methods.", focus: PM_BLOCK, at: [864, 720], click: true, show: ["after"], hide: ["ticked"], dur: 3.8,
        mark: PAY_SAVE, lens: { src: [320, 211, 530, 60] } }
    ]
  },

  "scalev-verifikasi-wa": {
    title: "Mengisi nomor WhatsApp di Profil Scalev",
    base: [profilPage()],
    els: {
      shade: { svg: dim(0, 0, 1440, 900), enter: "fade" },
      edit: { svg: editAccount, enter: "pop", origin: [720, 450] },
      num: eaPhone,
      saveOn: { svg: eaSaveOn, enter: "fade", delay: 1.2 },
      konf: { svg: confirmDlg("Verifikasi", 120), enter: "pop", origin: [903, 674] },
      wa: { svg: waWeb("+6282125784683") + waDraft + waSend, skel: true, enter: "rise", delay: 0.15 }
    },
    steps: [
      { caption: "Di Settings bagian Profil, klik Edit. Jendela Edit Account terbuka.", focus: EA, at: [566, 129], click: true, show: ["shade", "edit"], mark: { box: PROFIL_EDIT, r: 4 }, lens: { src: [489, 197, 300, 58] } },
      { caption: "Isi nomor WhatsApp yang aktif di Nomor Telepon (kode +62 sudah ada).", at: [846, 592], click: true, show: ["num", "saveOn"], type: [{ id: "num", n: 11, box: [779, 582, 96, 22] }], dur: 3.6,
        mark: EA_PHONE, lens: { src: [661, 535, 274, 88] } },
      { caption: "Klik Save. Jendela konfirmasi menampilkan nomormu.", focus: [CD.x, CD.y, 400, 220], at: [903, 674], click: true, show: ["konf"], hide: ["edit", "num", "saveOn"], dur: 3.4,
        mark: EA_SAVE, lens: { src: [CD.x + 16, CD.y + 70, 330, 50] } },
      { caption: "Klik Verifikasi. WhatsApp terbuka dengan draf kode OTP ke Scalev.", focus: [WA.head, [461, WA.foot, 979, 62]], at: [VERIF[0] + 60, VERIF[1] + 20], click: true, show: ["wa"], hide: ["shade", "konf"], dur: 3.8,
        mark: VERIF, lens: { src: [470, CT, 320, 60] } }
    ]
  },

  "scalev-wa-otp": {
    title: "Mengirim OTP lewat WhatsApp, Cek Verifikasi, lalu MFA",
    base: [profilPage(), dim(0, 0, 1440, 900), confirmDlg("Cek Verifikasi", 140)],
    els: {
      wa: { svg: waWeb("+6282125784683") + waDraft, skel: true },
      send: waSend,
      bubble: { svg: waBubble, enter: "slide" },
      back: { svg: profilPage() + dim(0, 0, 1440, 900) + confirmDlg("Cek Verifikasi", 140), skel: true, enter: "fade" },
      ok: { svg: icon("circle-check", CD.x + 274, CD.y + 92, 20, "#15c15d"), enter: "pop" },
      mfa: { svg: profilPage({ phone: "+62 81234567890" }), skel: true, enter: "fade" }
    },
    steps: [
      { caption: "Kirim apa adanya ke +6282125784683. Jangan ubah kodenya.", focus: [WA.head, [461, WA.foot, 979, 62], [1060, 720, 380, 100]], at: [1404, 869], click: true, press: "send", show: ["bubble"], dur: 3.4, mark: { box: WA_SEND, r: 21 }, lens: { src: [1080, 728, 352, 84], at: [300, 150] } },
      { caption: "Kembali ke tab Scalev.", focus: [CD.x, CD.y, 400, 220], at: [720, 640], show: ["back"], hide: ["wa", "send", "bubble"], dur: 2.4 },
      { caption: "Klik Cek Verifikasi. Nomor jadi terverifikasi.", at: [CEK[0] + 70, CEK[1] + 20], click: true, show: ["ok"], dur: 3.4,
        mark: CEK, lens: { src: [CD.x + 16, CD.y + 70, 370, 50] } },
      { caption: "Nyalakan MFA: Profil, bagian Security. Ganti Email OTP ke Authenticator App.", focus: SECURITY_BOX, at: [580, 890], show: ["mfa"], dur: 4, mark: MFA_METHOD, lens: { src: [504, 845, 240, 55], at: [470, 400] } }
    ]
  },

  "scalev-thumbnail-canva": {
    title: "Membuat gambar thumbnail 1:1 di Canva",
    base: [cvEditor],
    els: {
      down: { svg: galleryDown, skel: true },
      top: { svg: galleryTop, skel: true, enter: "fade", delay: -1 },
      pop: { svg: cvPop, enter: "pop", origin: [CREATE_CV[0] + 70, CREATE_CV[1] + 32] },
      size: { svg: cvSize, enter: "fade" },
      w: cvW, h: cvH,
      sel: { svg: cvSel, enter: "fade" },
      names: { svg: cvNames, skel: true }, date: { svg: cvDate, skel: true },
      share: { svg: cvShare, enter: "pop", origin: [SHARE_CV[0] + 53, SHARE_CV[1] + 34] },
      dl: { svg: cvDl, enter: "fade" },
      done: { svg: dlBubble, enter: "pop", origin: [DLB.x + 340, DLB.y] }
    },
    steps: [
      { caption: "Buka galeri template undangan Canva. Mahkota berarti Canva Pro.", focus: [0, 330, 1425, 300], at: CROWN, dur: 3.6, mark: { box: [CROWN[0] - 12, CROWN[1] - 12, 24, 24], r: 12 }, lens: { src: [322, 520, 196, 108] } },
      { caption: "Jadikan persegi: klik Create a design, lalu Custom size.", focus: [0, CT, 1425, 80], at: [CREATE_CV[0] + 70, CREATE_CV[1] + 16], click: true, show: ["top", "pop"], hide: ["down"], mark: { box: CREATE_CV, r: 8 }, lens: { src: [1180, 97, 212, 52] } },
      { caption: "Isi 1080 x 1080 px.", at: [CUSTOM[0] + 100, CUSTOM[1] + 20], click: true, show: ["size", "w", "h"], type: [{ id: "w", n: 4 }, { id: "h", n: 4 }], mark: { box: CUSTOM, r: 6 }, lens: { src: [POP.x - 8, POP.y - 4, POP.w + 16, 196], at: [200, 150] } },
      { caption: "Klik Create new design, lalu salin elemen dari template.", focus: [SQ.x, SQ.y, SQ.s, SQ.s + 50], at: [NEW_CV[0] + 144, NEW_CV[1] + 21], click: true, hide: ["top", "pop", "size", "w", "h"], dur: 3.6,
        mark: { box: NEW_CV, r: 8 }, lens: { src: [SQ.x + 160, SQ.y + SQ.s + 8, 240, 40] } },
      { caption: "Isi nama panggilan dan tanggal dengan huruf besar.", at: [SQ.x + SQ.s / 2, SQ.y + 255], click: true, show: ["sel", "names", "date"], type: [{ id: "names", n: 12 }, { id: "date", n: 14 }], dur: 3.8, mark: NAMES },
      { caption: "Unduh: klik Share, lalu Download.", focus: [SHARE_CV, [SHP.x - 6, 141, SHP.w + 12, 222]], at: [SHARE_CV[0] + 53, SHARE_CV[1] + 17], click: true, show: ["share"], hide: ["sel"],
        mark: { box: SHARE_CV, r: 8 }, lens: { src: [SHP.x - 6, 142, SHP.w + 12, 220], at: [140, 150] } },
      { caption: "Pilih PNG atau JPG.", at: [DL_ROW[0] + 100, DL_ROW[1] + 26], click: true, show: ["dl"], mark: { box: DL_ROW, r: 6 }, lens: { src: [SHP.x - 6, 142, SHP.w + 12, 220], at: [140, 150] } },
      { caption: "Klik Download. Gambar persegi tersimpan di komputermu.", at: [DL_BTN[0] + 170, DL_BTN[1] + 22], click: true, show: ["done"], hide: ["share", "dl"], dur: 3.6, mark: { box: DL_BTN, r: 8 }, lens: { src: [DLB.x + 2, DLB.y + 2, 396, 92], at: [140, 150] } }
    ]
  },

  "scalev-thumbnail-seo": {
    title: "Memasang thumbnail di SEO & Page Identity Scalev",
    base: [editorKonten()],
    els: {
      set: { svg: settingsEd({ now: PUB_URL }) + cover(SC.x, SC.y), skel: true, enter: "fade" },
      seo: { svg: seoAfter({ id: "seo" }), enter: "fade" },
      jFocus: { svg: rect(35, 351, 313, 40, { r: 4, stroke: C.primary, sw: 2 }), enter: "fade" },
      judul: text(48, 376, JUDUL, { size: 14, fill: "#0f161e" }),
      gTitle: { svg: text(42, 629, JUDUL, { size: 14, weight: 500, fill: "#1a0dab" }), enter: "fade", delay: 1.4 },
      dFocus: { svg: rect(35, 434, 313, 124, { r: 4, stroke: C.primary, sw: 2 }), enter: "fade" },
      desc: para(48, 459, DESC, { size: 14, fill: "#0f161e", lh: 20 }),
      gDesc: { svg: text(42, 673, DESC.join(" "), { size: 12, fill: "#545454" }), enter: "fade", delay: 1.6 },
      down: { svg: seoAfter({ id: "down", judul: true, desc: true }), enter: "fade" },
      img: { svg: seoAfter({ id: "img", judul: true, desc: true, img: true, dy: SEO_DY }), enter: "fade" },
      hover: { svg: imgHover, enter: "fade" }
    },
    steps: [
      { caption: "Di editor halaman, klik tab Settings.", focus: [[0, 44, 399, 48], [0, 520, 399, 100]], at: ED.tab.Settings, click: true, show: ["set"], mark: tabMark("Settings"), lens: { ...TABS_LENS, at: [300, 40] } },
      { caption: "Buka bagian SEO & PAGE IDENTITY.", focus: [0, 92, 399, 808], at: [200, 567], click: true, show: ["seo"], mark: { box: [17, 538, 364, 58], r: 8 }, lens: { src: [8, 240, 382, 160] } },
      { caption: "Isi Judul Tag, misalnya Undangan Rani & Dimas.", at: [190, 371], click: true, show: ["jFocus", "judul", "gTitle"], type: [{ id: "judul", n: 21, box: [48, 361, 160, 22] }], dur: 3.6,
        mark: [34, 350, 315, 42], lens: { src: [26, 318, 340, 80] } },
      { caption: "Isi Meta Description: tanggal dan ucapan singkat.", at: [190, 496], click: true, show: ["dFocus", "desc", "gDesc"], hide: ["jFocus"], type: [{ id: "desc", n: 24 }], dur: 3.6,
        mark: [34, 433, 315, 126], lens: { src: [26, 578, 340, 118], at: [320, 330] } },
      { caption: "Gulir ke Pratinjau di Sosial Media.", show: ["down"], hide: ["dFocus"], scroll: { id: "down", dy: SEO_DY }, dur: 2.8, mark: [34, 700 - SEO_DY, 315, 30], lens: { src: [26, 700 - SEO_DY - 6, 340, 40] } },
      { caption: "Klik Upload Meta Gambar, pilih gambar dari Canva.", at: [191, UPLOAD[1] + 71], click: true, show: ["img"], dur: 3.4, mark: UPLOAD, lens: { src: [34, IMG.y + 302, 320, 80], at: [320, 330] } },
      { caption: "Sudah ada gambar? Arahkan kursor ke gambar, klik pensil.", at: [146, IMG.y + 150], show: ["hover"], dur: 3.4, mark: PENCIL, lens: { src: [112, IMG.y + 122, 200, 56] } }
    ]
  },

  "scalev-thumbnail-terbit": {
    title: "Kartu pratinjau tautan undangan di WhatsApp",
    base: [waWeb("Rina WO (Anda)")],
    els: { bubble: { svg: waLink(1076, 640, 340), enter: "slide", delay: 0.3 } },
    steps: [{ caption: "Kirim tautannya di WhatsApp: kartu pratinjau memakai gambar itu.", focus: WA_CHAT, dur: 4, mark: { box: [1076, 640, 340, 168], r: 8 }, lens: { src: [1076, 640, 340, 110], at: [200, 200] } }]
  },

  "scalev-tutorial-resmi": {
    title: "Membuka tutorial resmi Scalev dari panduan",
    base: [guidePage([{ ...GUIDE_TAB, active: true }])],
    els: {
      tutFrame: { svg: tutFrame, skel: true, enter: "fade" },
      tut: { svg: clipCss("tut", 0, CT, 1425, 815) + tutArticle, skel: true, enter: "fade" },
      back: { svg: guidePage([{ ...GUIDE_TAB, active: true }, { ...TUT_TAB }]), skel: true, enter: "fade" }
    },
    steps: [
      { caption: "Tentukan kebutuhanmu: cari kelompoknya, misalnya Domain.", focus: GUIDE_FOCUS, at: [370, CT + 218], dur: 3.4, mark: DOMAIN_H2, lens: { src: [310, CT + 192, 160, 60] } },
      { caption: "Klik judul tutorial. Halaman tutorial Scalev terbuka.", focus: [330, CT + 270, 770, 545], at: [AZ_LINK[0] + 110, AZ_LINK[1] + 11], click: true, show: ["tutFrame", "tut"], mark: { box: AZ_LINK, r: 3 } },
      { caption: "Tonton atau baca sampai habis. Ikuti urutannya.", focus: [330, CT, 770, 815], at: [1000, 600], scroll: { id: "tut", dy: 420 }, dur: 3.6 },
      { caption: "Kembali ke tab panduan NikahKit.", focus: [[0, 0, 1440, 41], GUIDE_FOCUS], at: [200, 23], click: true, show: ["back"], hide: ["tutFrame", "tut"], mark: { box: [84, 6, 250, 35], r: 8 }, lens: { src: [76, 0, 520, 41] } }
    ]
  },

  "scalev-akun-awal": {
    title: "Masuk ke dasbor Scalev dan memilih bisnis",
    base: [frame(""), rect(0, CT, 1440, 815, { fill: C.white })],
    els: {
      url: text(166, 68, "app.scalev.com", { size: 14, fill: C.crText }),
      dash: { svg: shifted(scalevApp(0, 0, { active: "Home" }) + head("Home") + genericBody()), skel: true, enter: "fade", delay: 1.3 },
      biz: { svg: shifted(bizMenu), enter: "pop", origin: [127, CT + 110] }
    },
    steps: [
      { caption: "Buka app.scalev.com di Chrome komputer, lalu daftar dan masuk.", focus: OMNI.box, at: [300, 63], click: true, show: ["url", "dash"], type: [{ id: "url", n: 14, box: [166, 54, 108, 20] }], dur: 3.8,
        mark: OMNI, lens: { src: [134, 48, 200, 30] } },
      { caption: "Tanda sudah masuk: menu kiri punya Landing Pages.", focus: [0, CT, 256, 815], at: [110, 234 + CT], mark: { box: [28, 220 + CT, 196, 28], r: 6 }, lens: { src: [8, 180 + CT, 248, 110] } },
      { caption: "Klik nama bisnis. Pilih bisnis untuk merek undanganmu.", at: [127, 86 + CT], click: true, show: ["biz"], dur: 3.6, mark: { box: dn(BIZ), r: 4 }, lens: { src: [18, CT + 114, 278, 236], at: [300, 120] } }
    ]
  },

  "scalev-domain-beli": {
    title: "Membeli domain saja, tanpa hosting",
    base: [regPage],
    steps: [{ caption: "Beli domain saja di penyedia domain. Hosting tidak usah.", focus: [320, CT + 180, 800, 192], at: [1038, BELI[1] + 22], click: true, dur: 3.6,
      mark: [{ box: HOSTING, r: 4 }, { box: BELI, r: 6 }], lens: { src: [326, CT + 306, 140, 60], at: [140, 330] } }]
  },

  "scalev-domain-cloudflare": {
    title: "Memindahkan DNS domain ke Cloudflare",
    base: [cfSign],
    els: { ns: { svg: nsPage, skel: true, enter: "fade", delay: -1 }, nsOk: { svg: icon("circle-check", 484, NS_SAVE[1] + 21, 22, "#15a34a"), enter: "pop" } },
    steps: [
      { caption: "Daftar Cloudflare di dash.cloudflare.com/sign-up.", focus: [OMNI.box, [320, CT + 80, 800, 340]], dur: 3.4, mark: { box: CF_URL, r: 4 }, lens: { src: [134, 48, 300, 30] } },
      { caption: "Pindahkan DNS: ganti nameserver ke Cloudflare (ikuti video Scalev).", focus: [320, CT + 100, 800, 250], at: [404, NS_SAVE[1] + 21], click: true, show: ["ns", "nsOk"], dur: 4,
        mark: { box: NS_SAVE, r: 6 }, lens: { src: [336, CT + 150, 540, 130], at: [200, 360] } }
    ]
  }
};
