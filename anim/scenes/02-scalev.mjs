// Scalev setup scenes: halaman HTML Mode, simpan/terbit, Security CSP, custom domain, e-payment, verifikasi WA.
// World = a 1440x985 Chrome window (Scalev from y 85). Scalev app and editor are measured (lib); Settings, Domain,
// Stores, the Security tab, Cloudflare and WhatsApp were not captured, so they stay generic: grey bars instead of
// unverified labels, and only the labels the guide pages already name.
import {
  C, chrome, favScalev, CHROME_TOP, scalevEditor, ED, scalevApp, svMenuAt, nkHead, nkDialogHead, nkBtn, nkInput, nkLabel, nkHint,
  nkNote, nkAcc, nkH3, icon, iconX, note, ring, dim, shadow, clipped, text, para, rect, line, circle, tw
} from "../lib.mjs";

const T = CHROME_TOP; // Scalev content top (y 85)
const WORLD = { w: 1440, h: 985 };
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
const btnPub = rect(1283, T + 50, 151, 34, { r: 4, fill: C.primary }) + text(1291, T + 72, "Simpan & Terbitkan", { size: 13, weight: 500, fill: C.white }) + iconX("rocket", 1418, T + 67, 15, C.white);

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
// Settings tab (not captured): generic fields, one holds the slug.
const SLUG = { x: 20, y: T + 222, w: 359 };
const settingsPanel = rect(0, T + 93, 399, 807, { fill: C.white }) + bar(20, T + 122, 160, 12, "#dfe4ea") + bar(20, T + 152, 240) +
  bar(20, T + 200, 70, 9, "#d5dae1") + svInput(SLUG.x, SLUG.y, SLUG.w, "", { focus: false }) +
  [0, 1, 2].map((k) => bar(20, T + 298 + k * 76, 90, 9, "#d5dae1") + rect(20.5, T + 316.5 + k * 76, 358, 39, { r: 4, fill: C.white, stroke: "#d5dae1" }) + bar(32, T + 331 + k * 76, [150, 200, 120][k])).join("");

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
// Phone screen (plain, no frame) with Chrome's mobile address bar.
const PH = { x: 1490, y: 70 };
const phone = shadow(PH.x, PH.y, 390, 844, 0, 2) + rect(PH.x, PH.y, 390, 844, { fill: C.white }) + rect(PH.x, PH.y, 390, 60, { fill: C.white }) +
  rect(PH.x + 14, PH.y + 12, 330, 36, { r: 18, fill: C.crOmni }) + icon("lock", PH.x + 34, PH.y + 30, 13, C.crIcon) + text(PH.x + 48, PH.y + 35, "tokomu.myscalev.com/rani-dimas", { size: 14, fill: C.crText }) +
  iconX("more-vertical", PH.x + 366, PH.y + 30, 18, C.crIcon) + line(PH.x, PH.y + 60.5, PH.x + 390, PH.y + 60.5, { stroke: "#e3e3e3" }) + cover(PH.x, PH.y + 61, 783);

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

// ---- 4/6. Settings (not captured): sub menu with Profil and Domain ------------------------------------------------------
const SUB = { x: 280, y: T + 94, w: 240 };
const subAt = (n) => [SUB.x + 40, SUB.y + 30 + (n === "Profil" ? 0 : 44)];
function settingsPage(active) {
  let s = scalevApp(0, T, { active: "Settings" }) + head("Settings") + card(SUB.x, SUB.y, SUB.w, 300);
  [["Profil", "circle-user-round"], ["Domain", "map"]].forEach(([n, ic], i) => {
    const y = SUB.y + 12 + i * 44, on = n === active;
    if (on) s += rect(SUB.x + 8, y, SUB.w - 16, 36, { r: 4, fill: SV.soft });
    s += icon(ic, SUB.x + 28, y + 18, 15, on ? SV.blue : "#4a5361") + text(SUB.x + 46, y + 23, n, { size: 14, weight: on ? 600 : 400, fill: on ? SV.ink : "#3b4350" });
  });
  [0, 1, 2, 3].forEach((k) => (s += circle(SUB.x + 28, SUB.y + 118 + k * 44, 7, { fill: SV.bar }) + bar(SUB.x + 46, SUB.y + 113 + k * 44, [110, 90, 130, 80][k])));
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
const CF = { x: 720, y: 420, w: 680, h: 330 };
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

// Result of a click appears just after the pointer lands (lib: click at max(0.6, 35% of the step)).
const D = (dur = 3.2) => +(Math.max(0.6, dur * 0.35) + 0.1).toFixed(2);
const PAGE_CAM = { x: 260, y: T - 10, w: 1160 };

export const scenes = {
  "scalev-buat-halaman-html": {
    title: "Membuat halaman HTML Mode di Scalev untuk undangan",
    world: WORLD,
    base: [win(), scalevApp(0, T, { active: "Home" }), head("Home"), genericBody()],
    els: {
      lp: { svg: scalevApp(0, T, { active: "Landing Pages" }) + lpPage(), enter: "fade", delay: D() },
      ...Object.fromEntries(LP_ROWS.map((_, i) => [`row${i}`, { svg: lpRow(i), delay: D() + 0.12 + i * 0.06 }])),
      create: { svg: btnCreate, enter: "fade", delay: D() },
      shade: { svg: dim(0, T, 1440, 900), enter: "fade", delay: D() },
      typeDlg: { svg: typeDlg, enter: "pop", delay: D() },
      edCode: { svg: scalevEditor(0, T, { tab: "Code" }) + desktopPreview, enter: "fade", delay: D(3.6) },
      simpan: { svg: btnSimpan, enter: "fade", delay: D(3.6) },
      edNk: { svg: scalevEditor(0, T, { tab: "NikahKit", rail: "Template", screenFill: "#ffffff" }) + templatePanel() + lockRail, enter: "fade", delay: D(4) },
      tip: { svg: lockTip, enter: "fade", delay: D(4) + 0.8 },
      edSet: { svg: scalevEditor(0, T, { tab: "Settings" }) + desktopPreview + settingsPanel, enter: "fade" },
      slug: text(SLUG.x + 12, SLUG.y + 25, "rani-dimas", { size: 14, fill: SV.ink }),
      slugFocus: { svg: rect(SLUG.x + 0.5, SLUG.y + 0.5, SLUG.w - 1, 39, { r: 4, stroke: SV.blue, sw: 2 }), enter: "fade", delay: D(3.6) - 0.1 },
      simpan2: btnSimpan,
      saved: { svg: urlSwap("app.scalev.com/pages/359177"), enter: "fade", delay: D() },
      idNote: { svg: note(300, 140, "ID undangan: 359177", 340, 74), enter: "pop", origin: [340, 74], delay: 0.5 }
    },
    steps: [
      { caption: "Di dasbor Scalev, klik Landing Pages di menu kiri.", cam: { x: 0, y: T - 20, w: 900 }, at: menu("Landing Pages"), click: true, show: ["lp", "row0", "row1", "row2", "row3", "create"] },
      { caption: "Klik + Create Landing Page.", cam: { x: 200, y: T + 30, w: 1000 }, at: [CREATE.x + CREATE.w / 2, CREATE.y + 20], click: true, press: "create", show: ["shade", "typeDlg"] },
      { caption: "Pilih HTML Mode. Editor terbuka: Code, Media, Security, Settings.", cam: { x: 0, y: T - 30, w: 1000 }, at: HTML_TILE, click: true, show: ["edCode", "simpan"], dur: 3.6 },
      { caption: "Klik NikahKit di ujung strip. Menu selain Template dan Media terkunci.", cam: { x: 0, y: T - 30, w: 720 }, at: at(ED.tab.NikahKit), click: true, show: ["edNk", "tip"], hide: ["shade", "typeDlg"], dur: 4 },
      { caption: "Di tab Settings, isi slug, misalnya rani-dimas.", at: [SLUG.x + 120, SLUG.y + 20], click: true, show: ["edSet", "slugFocus", "simpan2"], hide: ["tip"], type: [{ id: "slug", n: 10, box: [SLUG.x + 12, SLUG.y + 9, 80, 22] }], dur: 3.6 },
      { caption: "Klik Simpan di kanan atas editor.", cam: { x: 780, y: T - 40, w: 660 }, at: at(ED.simpan), click: true, press: "simpan2", show: ["saved"], hide: ["slugFocus"] },
      { caption: "Alamat berubah jadi app.scalev.com/pages/angka: itu ID undangan.", cam: { x: 0, y: 0, w: 720 }, show: ["idNote"], dur: 4 }
    ]
  },

  "scalev-simpan-terbitkan": {
    title: "Simpan dan Simpan & Terbitkan di editor Scalev",
    world: { w: 1900, h: 985 },
    base: [win("app.scalev.com/pages/359177"), editorKonten({ saving: "Tersimpan" })],
    els: {
      footRing: { svg: ring(0, T + 851, 71, 49, { r: 4 }), enter: "pop", delay: 0.4 },
      pub: btnPub,
      shareA: { svg: shareDialog(true), enter: "fade", delay: D(3.6) },
      shareB: { svg: shareDialog(false), enter: "fade", delay: D(3.4) },
      copied: { svg: nkHint(16, T + 515 - 50, "Tersalin."), enter: "fade", delay: D(3.4) },
      phone: { svg: phone, enter: "rise", delay: 0.3 },
      reload: { svg: ring(80, 47, 32, 32, { r: 16 }), enter: "pop", delay: 0.3 }
    },
    steps: [
      { caption: "Kaki rel Tersimpan: NikahKit sudah menulis, Scalev belum menyimpan.", cam: { x: 0, y: T + 470, w: 760 }, show: ["footRing"], dur: 3.4 },
      { caption: "Klik Bagikan: Perubahan belum disimpan di Scalev.", cam: { x: 0, y: T + 60, w: 720 }, at: at(ED.tool.Bagikan), click: true, show: ["shareA"], hide: ["footRing"], dur: 3.6 },
      { caption: "Klik Simpan & Terbitkan supaya tamu melihat versi terbaru.", cam: { x: 760, y: T - 30, w: 680 }, at: at(ED.terbitkan), click: true, press: "pub", show: ["shareB"], dur: 3.4 },
      { caption: "Di Bagikan, peringatannya hilang. Klik Salin tautan umum.", cam: { x: 0, y: T + 120, w: 720 }, at: [199, T + 481 - 50], click: true, show: ["copied"], hide: ["shareA"], dur: 3.4 },
      { caption: "Buka tautan di HP. Ucapan, RSVP, dan video aktif setelah terbit.", cam: { x: 1380, y: 40, w: 1000 }, show: ["phone"], dur: 3.6 },
      { caption: "Tertahan \"not finished previewing\"? Muat ulang, lalu terbitkan lagi.", cam: { x: 0, y: 0, w: 720 }, at: [96, 63], click: true, show: ["reload"], hide: ["shareB", "copied"], dur: 3.8 }
    ]
  },

  "scalev-security-csp": {
    title: "Izin domain (CSP) di Bantuan NikahKit dan tab Security Scalev",
    world: WORLD,
    base: [win("app.scalev.com/pages/359177"), editorKonten()],
    els: {
      help: { svg: nkDialogHead(0, T, "Bantuan"), enter: "fade", delay: D() },
      helpBody: { svg: clipCss("helpBody", 0, T + 154, 386, 746) + helpBody(), enter: "fade", delay: D() },
      helpBar: { svg: rect(388, T + 160, 6, 120, { r: 3, fill: "#c9ced6" }), enter: "fade", delay: D() },
      copied: { svg: nkHint(16, up(HB.msg), "Tersalin. Tempel di tab Security."), enter: "fade", delay: D(3.4) },
      sec: { svg: scalevEditor(0, T, { tab: "Security" }) + securityPanel + cover(SC.x, SC.y), enter: "fade", delay: D() },
      secFocus: { svg: rect(20.5, secY(1) + 10.5, 358, 39, { r: 4, stroke: SV.blue, sw: 2 }), enter: "fade", delay: D(3.8) - 0.1 },
      paste: { svg: text(32, secY(1) + 35, "https://foto.contoh.com", { size: 14, fill: SV.ink }), enter: "fade", delay: D(3.8) + 0.3 },
      pub: btnPub,
      fixed: { svg: cspRow(CSP[2], up(HB.rows[2][0]), HB.rows[2][1], "Sudah diizinkan", false) + nkBtn(16, up(HB.copy), "Salin daftar domain", { w: 351, size: 14, variant: "quiet", icon: "copy" }) + nkHint(16, up(HB.msg), "Diperiksa ulang."), enter: "fade", delay: D(3.8) }
    },
    steps: [
      { caption: "Di tab NikahKit, klik Bantuan di bagian bawah rel kiri.", cam: { x: 0, y: T + 470, w: 760 }, at: at(ED.tool.Bantuan), click: true, show: ["help", "helpBody", "helpBar"] },
      { caption: "Gulir ke Izin domain (CSP). Tiap domain punya status.", cam: { x: 0, y: T + 90, w: 640 }, scroll: { id: "helpBody", dy: HB_DY }, dur: 3.6 },
      { caption: "Ada Perlu ditambah manual? Klik Salin domain kurang.", cam: { x: 0, y: T + 240, w: 700 }, at: [190, up(HB.copy) + 18], click: true, show: ["copied"], dur: 3.4 },
      { caption: "Klik tab Security di strip editor Scalev.", cam: { x: 0, y: T - 30, w: 720 }, at: at(ED.tab.Security), click: true, show: ["sec"] },
      { caption: "Tempel domainnya saja di kolom yang cocok: img_src ke Image Sources.", at: [200, secY(1) + 30], click: true, show: ["secFocus", "paste"], hide: ["help", "helpBody", "helpBar", "copied"], dur: 3.8 },
      { caption: "Klik Simpan & Terbitkan.", cam: { x: 760, y: T - 30, w: 680 }, at: at(ED.terbitkan), click: true, press: "pub", hide: ["secFocus"] },
      { caption: "Buka Bantuan lagi, klik Periksa ulang: jadi Sudah diizinkan.", cam: { x: 0, y: T + 240, w: 700 }, at: [190, up(HB.recheck) + 18], click: true, show: ["help", "helpBody", "helpBar", "fixed"], hide: ["sec", "paste"], dur: 3.8 }
    ]
  },

  "scalev-custom-domain": {
    title: "Menambahkan domain sendiri ke Scalev lewat Cloudflare",
    world: WORLD,
    base: [win(), scalevApp(0, T, { active: "Home" }), head("Home"), genericBody()],
    els: {
      set: { svg: settingsPage("Profil") + profileCard(), enter: "fade", delay: D(3.4) },
      dom: { svg: settingsPage("Domain") + domainSection, enter: "fade", delay: D() },
      addBtn: { svg: svBtn(MAIN.x + MAIN.w - 184, MAIN.y + 16, "Tambahkan Domain", { w: 160 }), enter: "fade", delay: D() },
      shade: { svg: dim(0, T, 1440, 900), enter: "fade", delay: D() },
      dlg: { svg: domainDlg, enter: "pop", delay: D() },
      typed: text(DOM_IN.x + 12, DOM_IN.y + 25, "undangan.namabrand.com", { size: 14, fill: SV.ink }),
      done: { svg: settingsPage("Domain") + domainSection + dnsHead, enter: "fade", delay: D(3.6) },
      ...Object.fromEntries(DNS_ROWS.map((_, i) => [`dns${i}`, { svg: dnsRow(i), delay: D(3.6) + 0.15 + i * 0.07 }])),
      cf: { svg: cfWin, enter: "rise", delay: 0.1 },
      cfForm: { svg: cfForm, enter: "pop", origin: CF_ADD, delay: D(4) },
      ok: { svg: verified, enter: "pop", delay: D(4) }
    },
    steps: [
      { caption: "Domain sudah dibeli dan DNS-nya di Cloudflare? Klik Settings.", cam: { x: 0, y: T + 420, w: 860 }, at: menu("Settings"), click: true, show: ["set"], dur: 3.4 },
      { caption: "Buka bagian Domain.", cam: PAGE_CAM, at: subAt("Domain"), click: true, show: ["dom", "addBtn"] },
      { caption: "Klik Tambahkan Domain.", at: ADD_BTN, click: true, press: "addBtn", show: ["shade", "dlg"] },
      { caption: "Ketik domain atau subdomain, misalnya undangan.namabrand.com.", cam: { x: 380, y: T + 160, w: 720 }, at: [DOM_IN.x + 200, DOM_IN.y + 20], click: true, show: ["typed"], type: [{ id: "typed", n: 22, box: [DOM_IN.x + 12, DOM_IN.y + 9, 172, 22] }], dur: 3.6 },
      { caption: "Klik Simpan. Scalev menampilkan kode DNS (Type, Name, Target).", cam: PAGE_CAM, at: DOM_SAVE, click: true, show: ["done", "dns0", "dns1", "dns2"], dur: 3.6 },
      { caption: "Di Cloudflare: DNS, Add Record. Salin persis, Proxy status DNS Only.", cam: { x: 600, y: 330, w: 840 }, at: CF_ADD, click: true, show: ["cf", "cfForm"], hide: ["shade", "dlg", "typed"], dur: 4 },
      { caption: "Kembali ke Scalev, klik Verifikasi. Bisa butuh sampai 2x24 jam.", cam: PAGE_CAM, at: VERIFY, click: true, show: ["ok"], hide: ["cf", "cfForm"], dur: 4 }
    ]
  },

  "scalev-epayment": {
    title: "Mengaktifkan ePayment di toko Scalev",
    world: WORLD,
    base: [win(), storesPage],
    els: {
      det: { svg: scalevApp(0, T, { active: "Stores" }) + rect(256, T, 1184, 900, { fill: SV.bg }), enter: "fade", delay: D(3.4) },
      detBody: { svg: detBody, enter: "fade", delay: D(3.4) },
      detHead: { svg: detHead + topSave, enter: "fade", delay: D(3.4) },
      shade: { svg: dim(0, T, 1440, 900), enter: "fade", delay: D(3.8) },
      dlg: { svg: payDlg, enter: "pop", delay: D(3.8) },
      menu: { svg: payMenu, enter: "pop", origin: [SEL.x + SEL.w / 2, SEL.y + 40], delay: D(2.8) },
      val: { svg: payDlg + payVal, enter: "fade", delay: D(2.8) },
      on: { svg: check(PD.x + 24, PD.y + 150, true), enter: "pop", delay: D() },
      dlgSave: svBtn(PD.x + PD.w - 104, PD.y + 230, "Simpan", { w: 80 }),
      after: { svg: detAfter, enter: "fade", delay: D() },
      topSave: topSave
    },
    steps: [
      { caption: "Buka Stores di menu kiri, lalu klik nama tokomu.", cam: { x: 0, y: T - 20, w: 900 }, at: STORE_AT, click: true, show: ["det", "detBody", "detHead"], dur: 3.4 },
      { caption: "Gulir ke Metode Pembayaran, klik Pilih Metode Pembayaran.", cam: PAGE_CAM, scroll: { id: "detBody", dy: DET_DY }, at: PICK, click: true, show: ["shade", "dlg"], dur: 3.8 },
      { caption: "Di dialog, klik dropdown.", cam: { x: 380, y: T + 170, w: 720 }, at: [SEL.x + SEL.w - 30, SEL.y + 20], click: true, show: ["menu"], dur: 2.8 },
      { caption: "Pilih Invoice.", at: INVOICE_AT, click: true, show: ["val"], dur: 2.8 },
      { caption: "Centang Aktifkan Metode Pembayaran ALL E-Payment.", at: CHECK_AT, click: true, show: ["on", "dlgSave"], hide: ["menu"] },
      { caption: "Klik Simpan di dialog. Metode pembayaran tercatat.", cam: PAGE_CAM, at: DLG_SAVE, click: true, press: "dlgSave", show: ["after", "topSave"] },
      { caption: "Klik Simpan di kanan atas supaya pengaturan benar-benar tersimpan.", cam: { x: 560, y: T - 30, w: 880 }, at: [TOP_SAVE.x + 50, TOP_SAVE.y + 20], click: true, press: "topSave", hide: ["shade", "dlg", "val", "on", "dlgSave"], dur: 3.8 }
    ]
  },

  "scalev-verifikasi-wa": {
    title: "Verifikasi nomor WhatsApp di Scalev",
    world: WORLD,
    base: [win(), scalevApp(0, T, { active: "Home" }), head("Home"), genericBody()],
    els: {
      set: { svg: settingsPage("Profil") + profileCard(), enter: "fade", delay: D(3.4) },
      edit: { svg: rect(MAIN.x, MAIN.y, MAIN.w, 420, { fill: SV.bg }) + editForm, enter: "fade", delay: D() },
      num: text(PHONE_IN.x + 34, PHONE_IN.y + 25, "081234567890", { size: 14, fill: SV.ink }),
      saveBtn: { svg: svBtn(MAIN.x + 24, MAIN.y + 318, "Save", { w: 80 }), enter: "fade", delay: D() },
      shade: { svg: dim(0, T, 1440, 900), enter: "fade", delay: D(3.4) },
      konf: { svg: confirmDlg, enter: "pop", delay: D(3.4) },
      back: { svg: settingsPage("Profil") + rect(MAIN.x, MAIN.y, MAIN.w, 420, { fill: SV.bg }) + editForm + text(PHONE_IN.x + 34, PHONE_IN.y + 25, "081234567890", { size: 14, fill: SV.ink }) + cekBtn, enter: "fade", delay: D(3.8) },
      wa: { svg: waWin, enter: "rise", delay: D(3.8) + 0.15 },
      draft: { svg: waDraft, enter: "fade", delay: D(3.8) + 0.15 },
      send: { svg: waSend, enter: "fade", delay: D(3.8) + 0.15 },
      bubble: { svg: waBubble, enter: "slide", delay: D(3.4) },
      ok: { svg: icon("circle-check", PHONE_IN.x + PHONE_IN.w - 22, PHONE_IN.y + 20, 20, "#15a34a"), enter: "pop", delay: D(3.8) }
    },
    steps: [
      { caption: "Di dasbor Scalev, klik Settings. Bagian Profil terbuka.", cam: { x: 0, y: T + 420, w: 860 }, at: menu("Settings"), click: true, show: ["set"], dur: 3.4 },
      { caption: "Klik Edit di bagian Profil.", cam: PAGE_CAM, at: EDIT_BTN, click: true, show: ["edit", "saveBtn"] },
      { caption: "Isi nomor WhatsApp yang aktif di kolom nomor telepon.", cam: { x: 400, y: T + 60, w: 800 }, at: [PHONE_IN.x + 200, PHONE_IN.y + 20], click: true, show: ["num"], type: [{ id: "num", n: 12, box: [PHONE_IN.x + 34, PHONE_IN.y + 9, 104, 22] }], dur: 3.4 },
      { caption: "Klik Save. Jendela konfirmasi menampilkan nomormu.", cam: { x: 300, y: T + 60, w: 900 }, at: SAVE_BTN, click: true, press: "saveBtn", show: ["shade", "konf"], dur: 3.4 },
      { caption: "Klik Verifikasi. WhatsApp terbuka dengan draf kode OTP ke Scalev.", cam: { x: 480, y: 160, w: 960 }, at: VERIF_AT, click: true, show: ["back", "wa", "draft", "send"], dur: 3.8 },
      { caption: "Kirim apa adanya ke +6282125784683. Jangan ubah kodenya.", at: WA_SEND, click: true, press: "send", show: ["bubble"], hide: ["shade", "konf"], dur: 3.4 },
      { caption: "Kembali ke Scalev, klik Cek Verifikasi. Nomor jadi terverifikasi.", cam: { x: 400, y: T + 60, w: 800 }, at: [CEK.x + 70, CEK.y + 20], click: true, show: ["ok"], hide: ["wa", "draft", "send", "bubble"], dur: 3.8 }
    ]
  }
};
