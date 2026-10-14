// Jualan ke klien: alur, Profil merek, Dashboard pasangan, Bagikan > Untuk pengantin, Landing page, form klien,
// Pesanan masuk, checklist serah. Every scene is one 1440x900 screen (lib v4): the Scalev editor at 0,0, or the
// member Landing page and its form as a phone page (phoneDesk; the page is mobile-first).
// Panel: nikahkit/src/ui/panels-style.jsx (TemplatePanel, BrandForm), orders.jsx, App.jsx (AccessSection), styles.js;
// measured from /tmp/ref/editor-marketing.png, editor-pesanan.png, editor-bagikan.png, editor-konten.png.
// Landing page and form: server/pages/src/landing/index.html + server/pages/shared/order-form.js at 390 px (mobile CSS).
// Dashboard pasangan: /tmp/ref/dash-gate-hp.png.
import { C, ED, PHONE, chrome, favScalev, scalevEditor, nkRail, nkHead, nkDialogHead, nkBtn, nkBtnBox, nkInput, nkLabel, nkHint, nkSwitch, nkBadge, nkAcc, nkH3,
  icon, iconX, rect, text, para, line, circle, group, clipped, shadow, skeleton, phoneDesk, tw } from "../lib.mjs";

// ---- Editor: the Scalev editor fills the 1440x900 screen at 0,0 -----------------------------------------------------
const shell = (o = {}) => [scalevEditor(0, 0, o)];
// Over a scrolled list (x 72..399): the Scalev bars and the panel head, redrawn above it.
const cover = (o, title, h = {}) => clipped(72, 0, 328, 153, scalevEditor(0, 0, o), nkHead(0, 0, title, h));
// Simpan & Terbitkan in the toolbar.
const PUB_BOX = [1283, 50, 151, 34], PUB = [1358, 67];
const bodyClip = (...s) => clipped(72, 153, 327, 747, ...s);
const bodyBg = rect(72, 153, 327, 747, { fill: C.white });
const svgIcon = (body, cx, cy, size, color) => `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</g>`;
// Inbox count on the header icon (.nk-inbox__count: top 2, right 0 of the 36px icon button at 218..254).
const inboxCount = (n) => rect(238, 106, 16, 16, { r: 8, fill: C.danger }) + text(246, 118, n, { size: 10, weight: 600, fill: C.white, anchor: "middle" });
// Step helpers: a mark ({ box, r }) and the screen regions steps focus on.
const M = (x, y, w, hh, r = 4) => ({ box: [x, y, w, hh], r });
const F = { left: [0, 92, 399, 808], panel: [72, 92, 327, 808], rail: [0, 92, 72, 808], tabs: [0, 44, 399, 48], top: [1180, 44, 260, 48], preview: [727, 106, 390, 784] };
const INBOX = M(218, 104, 36, 36, 8);

// Kategori: Template | Marketing (Seg with KIND_ICON; the chosen one also shows its label).
const KIND = {
  template: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  marketing: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>'
};
const SEG_Y = 169, SEG = { template: [158, 188], marketing: [297, 188] };
function kindSeg(active) {
  const x = 88, y = SEG_Y, w = 279, h = 38, half = w / 2;
  let s = rect(x + 0.5, y + 0.5, w - 1, h - 1, { r: 4, fill: C.white, stroke: C.field });
  [["template", "Template"], ["marketing", "Marketing"]].forEach(([k, l], i) => {
    const cx = x + i * half + half / 2;
    if (k === active) {
      const total = 26 + tw(l, 12, 600);
      s += rect(x + 1 + i * (half - 1), y + 1, half - 1, h - 2, { fill: C.primarySoft }) + svgIcon(KIND[k], cx - total / 2 + 10, y + h / 2, 20, C.action) +
        text(cx - total / 2 + 26, y + h / 2 + 4, l, { size: 12, weight: 600, fill: C.action });
    } else s += svgIcon(KIND[k], cx, y + h / 2, 20, C.text);
  });
  return s + line(x + half, y + 1, x + half, y + h - 1, { stroke: C.field });
}
const badgeAt = (right, y, label, tone) => { const w = tw(label, 10, 500) + 12; const t = { ok: [C.okSoft, C.ok], todo: [C.warnSoft, C.warnStrong], off: [C.mutedBg, C.text], plain: ["none", C.strong] }[tone]; return nkBadge(right - w, y, label, { fill: t[0], fg: t[1] }); };
// Profil merek box (details.nk-box), closed: 50 px.
const brandClosed = (y, ready = true) => rect(88.5, y + 0.5, 278, 49, { r: 4, fill: C.white, stroke: C.line }) + text(101, y + 30, "Profil merek", { size: 14, weight: 500 }) +
  badgeAt(354, y + 16, ready ? "Terisi" : "Belum diisi", ready ? "ok" : "plain");

// Template cards (Template category). Thumbnails are the worker's images: drawn here as neutral page sketches; the
// description as the card clamps it (two lines, same text as 03-editor-konten.mjs).
const TPL = [["Dasar", ["Abu-abu gelap di atas", "foto, tanpa ornamen…"], ["#ffffff", "#8b8178"]], ["Folio", ["Hitam & krem gaya", "majalah, foto penuh…"], ["#f3ece2", "#7a5c3e"]],
  ["Galeri Putih", ["Putih bersih gaya", "majalah, huruf serif…"], ["#fafafa", "#9aa3ad"]], ["Modern Estetik", ["Putih & krem, bingkai", "lengkung, bayangan…"], ["#e9efe7", "#5d7a5a"]]];
function pageSketch(x, y, w, h, [bg, ac]) {
  const cx = x + w / 2;
  return rect(x, y, w, h, { fill: bg }) + rect(x, y, w, h * 0.06, { fill: ac, opacity: 0.25 }) +
    `<path d="M${cx - w * 0.22} ${y + h * 0.55} V${y + h * 0.3} a${w * 0.22} ${w * 0.22} 0 0 1 ${w * 0.44} 0 V${y + h * 0.55} Z" fill="${ac}" opacity=".28"/>` +
    rect(cx - w * 0.28, y + h * 0.63, w * 0.56, Math.max(4, h * 0.035), { r: 2, fill: ac, opacity: 0.7 }) +
    rect(cx - w * 0.36, y + h * 0.71, w * 0.72, Math.max(3, h * 0.02), { r: 1.5, fill: ac, opacity: 0.35 }) +
    rect(cx - w * 0.3, y + h * 0.76, w * 0.6, Math.max(3, h * 0.02), { r: 1.5, fill: ac, opacity: 0.35 }) +
    rect(cx - w * 0.16, y + h * 0.84, w * 0.32, Math.max(6, h * 0.06), { r: h * 0.03, fill: ac, opacity: 0.55 });
}
function tplCard(x, y, [name, desc, pal]) {
  return clipped(x + 2, y + 2, 130, 163, pageSketch(x + 2, y + 2, 130, 163, pal)) + rect(x + 1, y + 1, 132, 165, { r: 8, stroke: C.line, sw: 2 }) +
    text(x, y + 188, name, { size: 14, weight: 500 }) + para(x, y + 209, desc, { size: 12, fill: C.faint, lh: 16 });
}
const tplCards = (y) => TPL.map((t, i) => tplCard(88 + (i % 2) * 146, y + Math.floor(i / 2) * 241, t)).join("");

// Marketing cards: SKETCH from panels-style.jsx (viewBox 150x100, centred in the 4:5 phone).
const SKETCH = {
  dashboard: rect(0, 0, 150, 18, { fill: C.primarySoft }) + [0, 1, 2, 3].map((i) => rect(8 + i * 35, 24, 28, 6, { r: 3, fill: i ? C.line : C.primary })).join("") +
    [0, 1, 2, 3].map((i) => circle(16, 46 + i * 14, 5, { fill: C.line }) + rect(26, 42 + i * 14, 70 - i * 8, 4, { r: 2, fill: C.line }) + rect(26, 48 + i * 14, 40, 3, { r: 1.5, fill: C.line })).join(""),
  landing: circle(12, 9, 5, { fill: C.primary }) + rect(8, 22, 80, 7, { r: 3.5, fill: C.line }) + rect(8, 33, 34, 8, { r: 4, fill: C.primary }) +
    [0, 1, 2, 3].map((i) => rect(8 + i * 35, 50, 30, 26, { r: 3, fill: C.line })).join("") + rect(8, 84, 134, 12, { r: 3, fill: C.primarySoft })
};
const MK = { dashboard: ["Dashboard pasangan", ["Kirim undangan, RSVP,", "ucapan, dan check-in…"]], landing: ["Landing page", ["Halaman jualan: desain,", "paket dan harga, lalu for…"]] };
// The name and its Dipakai badge share the 134 px row (justify-content: space-between): with the badge the name wraps.
function mkCard(x, y, id, on) {
  const [name, desc] = MK[id], nameLines = on ? name.split(" ") : [name], dy = (nameLines.length - 1) * 20;
  return rect(x + 1, y + 1, 132, 165, { r: 8, fill: C.page, stroke: on ? C.primary : C.line, sw: 2 }) +
    group({ transform: `translate(${x + 2} ${y + 2 + 38.2}) scale(${130 / 150})` }, SKETCH[id]) +
    para(x, y + 188, nameLines, { size: 14, weight: 500, lh: 20 }) + (on ? badgeAt(x + 134, y + 175 + dy / 2, "Dipakai", "ok") : "") + para(x, y + 209 + dy, desc, { size: 12, fill: C.faint, lh: 16 });
}
const mkCards = (y, on) => mkCard(88, y, "dashboard", on === "dashboard") + mkCard(234, y, "landing", on === "landing");
const MKY = 281; // cards under a closed Profil merek box

// NikahKit toast (.nk-toast: left 84, right 12, bottom 12 of the panel; Urungkan link).
function nkToast(lines, undo = true) {
  const h = Math.max(52, lines.length * 18 + 20), y = 888 - h;
  return shadow(84, y, 302, h, 4, 2) + rect(84, y, 302, h, { r: 4, fill: C.strong }) + para(96, y + h / 2 - (lines.length - 1) * 9 + 5, lines, { size: 14, fill: C.white, lh: 18 }) +
    (undo ? text(374, y + h / 2 + 5, "Urungkan", { size: 14, weight: 700, fill: "#7fd3f5", anchor: "end" }) : "");
}

// Invitation preview (sample template data, like editor-konten.png) on the 390 screen at (727, 106).
const INV_RED = "#8f2f1d", SCRIPT = "'Great Vibes','Segoe Script',cursive", SERIF = "Georgia,'Times New Roman',serif";
function invite(p) {
  const cx = 922;
  return rect(727, 106, 390, 784, { fill: "#fdf6ee" }) + rect(727, 106, 390, 18, { fill: INV_RED }) + [0, 1, 2, 3, 4, 5, 6].map((i) => circle(745 + i * 58, 124, 20, { fill: INV_RED })).join("") +
    text(cx, 262, "Mempelai", { size: 46, font: SCRIPT, italic: true, fill: INV_RED, anchor: "middle" }) +
    `<path d="M833 548 V398 a89 89 0 0 1 178 0 V548 Z" fill="#ead3c3" stroke="${INV_RED}" stroke-width="1.5"/>` +
    circle(cx, 420, 36, { fill: "#c9a58f" }) + `<path d="M852 548 q4 -78 70 -84 q66 6 70 84 Z" fill="#9c2b2b"/>` +
    text(cx, 606, p.nick, { size: 36, font: SCRIPT, italic: true, fill: INV_RED, anchor: "middle" }) +
    text(cx, 643, p.full, { size: 16, weight: 700, font: SERIF, fill: "#1a1a1a", anchor: "middle" }) + text(cx, 668, p.job, { size: 14, font: SERIF, fill: "#333", anchor: "middle" }) +
    text(cx, 694, p.parents, { size: 15, font: SERIF, fill: "#1a1a1a", anchor: "middle" }) +
    rect(765, 810, 315, 70, { r: 16, fill: INV_RED }) + rect(773, 818, 58, 52, { r: 10, fill: "rgba(255,255,255,.18)" }) +
    [["heart", "Mempelai"], ["calendar", "Acara"], ["image", "Galeri"], ["message-circle", "Ucapan"], ["gift", "Hadiah"]].map(([ic, l], i) =>
      icon(ic, 802 + i * 60, 836, 18, C.white) + text(802 + i * 60, 860, l, { size: 10, font: SERIF, fill: C.white, anchor: "middle" })).join("");
}
const SAMPLE = { nick: "Ayu", full: "Ayu Lestari, S.Ked.", job: "Dokter", parents: "Putri pertama dari Bapak Hadi & Ibu Ratna" };
const RANI = { nick: "Rani", full: "Rani Ayu, S.Psi.", job: "Psikolog", parents: "Putri kedua dari Bapak Ahmad & Almh. Ibu Siti" };

// Dashboard pasangan gate (dash-gate-hp.png), card 358 wide; x = left of the 390 column, top = card top.
function gate(x, top) {
  const cx = x + 195;
  return rect(x + 16, top, 358, 303, { r: 24, fill: C.white }) + text(cx, top + 47, "Kelola undangan", { size: 22, fill: "#111", anchor: "middle" }) +
    para(cx, top + 76, ["Kirim undangan, lihat RSVP dan ucapan, dan catat", "tamu di hari-H. Semuanya dari sini."], { size: 14, fill: "#5f5f5f", anchor: "middle", lh: 20 }) +
    text(x + 36, top + 138, "PIN atau kode staff", { size: 14, fill: "#5f5f5f" }) + rect(x + 36.5, top + 148.5, 317, 43, { r: 8, fill: C.white, stroke: "#8c8c8c" }) +
    rect(x + 36, top + 208, 318, 39, { r: 20, fill: "#52ab6a" }) + text(cx, top + 233, "Masuk", { size: 16, weight: 600, fill: C.white, anchor: "middle" }) +
    icon("lock", cx - 128, top + 336, 13, "#5f5f5f") + text(cx + 8, top + 341, "PIN hanya diingat selama tab ini terbuka.", { size: 13, fill: "#5f5f5f", anchor: "middle" });
}
const dashPreview = rect(727, 106, 390, 784, { fill: "#f5f4f2" }) + gate(727, 326);

// Konten panel (editor-konten.png without the update/sample notes).
const kontenBody = nkLabel(88, 181, "Bahasa undangan") + nkInput(88, 189, 279, "Indonesia", { select: true }) +
  para(88, 245, ["Hanya halaman tamu. Teks bawaan ikut", "berganti; teks yang sudah diubah tetap."], { size: 12, fill: C.faint, lh: 16 }) +
  `<text x="88" y="289" font-size="12" fill="${C.faint}">Urutan dan tampilan bagian di <tspan font-weight="500" fill="${C.strong}" text-decoration="underline">Lapisan</tspan>.</text>` +
  nkAcc(88, 305, 279, "Sampul", { badge: "Terisi" }) + nkAcc(88, 363, 279, "Mempelai", { badge: "Terisi" }) + nkAcc(88, 421, 279, "Acara & Tanggal", { badge: "Terisi" });

// ---- Landing page (server/pages/src/landing/index.html), 390 wide, mobile styles ----------------------------------
// Measured in Chrome at 390x844: Rina WO, Basic + Premium, every design in the extension's order, Gaya Grid. Only the
// first four designs are drawn; the sections after the catalogue sit where they would under a two-row catalogue.
const LP = { paper: "#ffffff", tint: "#f7efe9", ink: "#171717", cocoa: "#2b1a07", muted: "#6f675f", accent: "#b8460d", danger: "#913a34", line: "rgba(43,26,7,.22)", dash: "#d2bbad" };
const DISP = "Fraunces,Georgia,serif", BODY = "Nunito,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif";
const body = (...s) => `<g font-family="${BODY}">${s.join("")}</g>`;
const h = (x, y, s, size, o = {}) => text(x, y, s, { size, font: DISP, weight: o.weight ?? 500, fill: o.fill ?? LP.cocoa, anchor: o.anchor });
const dash = (x, y, w) => `<path d="M${x + 1} ${y + 1}H${x + w - 1}" stroke="${LP.dash}" stroke-width="2" stroke-linecap="round" stroke-dasharray="4 8"/>`;
// .btn: white pad 4px, inner 2px cocoa ring r16; solid = cocoa fill; small = 38 px inner.
function lpBtn(x, y, label, o = {}) {
  const hh = o.small ? 46 : 52, size = o.small ? 15 : 17, w = o.w ?? tw(label, size, 700) + (o.small ? 28 : 36) + 8;
  const fill = o.solid ? LP.cocoa : LP.paper, stroke = o.secondary ? LP.muted : LP.cocoa, fg = o.solid ? LP.paper : o.secondary ? LP.muted : LP.cocoa;
  return rect(x, y + 1, w, hh, { r: 20, fill: "rgba(0,0,0,.2)" }) + rect(x, y, w, hh, { r: 20, fill: LP.paper }) + rect(x + 5, y + 5, w - 10, hh - 10, { r: 15, fill, stroke, sw: 2 }) +
    text(x + w / 2, y + hh / 2 + size * 0.36, label, { size, weight: 700, fill: fg, anchor: "middle" });
}
const THUMB = (x, y, w, hh, pal, rot = 0) => group({ transform: `rotate(${rot} ${x + w / 2} ${y + hh / 2})` },
  rect(x, y + 10, w, hh, { r: 14, fill: "rgba(43,26,7,.08)" }), clipped(x, y, w, hh, pageSketch(x, y, w, hh, pal)), rect(x, y, w, hh, { r: 14, stroke: LP.cocoa, sw: 1.5 }));
const PKG = [["Basic", "Rp150.000", ["Isi dan foto dari kalian", "Revisi 2 kali"]], ["Premium", "Rp350.000", ["Semua isi paket Basic", "Revisi 5 kali"]]];
// Page positions (relative to the page top) used by scenes.
const LPY = { cta: 350.3, art: 442.3, katalog: 778.3, chips: 966.6, grid: 1040.6, fitur: 1791.8, harga: 3337.7, pkg1: 3528, cara: 4194.2, faq: 4731.3, pesan: 5424.4, card: 5637.1 };

// Pilihan tema (#catFilter): Semua, then one button per category with its number of designs, most first. The row
// scrolls sideways, so a phone shows the first few. [label, count, x, width]; `on` is the pressed one. Label and count
// are one centred text: the guide's SVG may fall back to another font, and two separately placed texts would collide.
const CHIPS = [["Semua", "62", 20, 103.3], ["Adat", "32", 131.3, 89.7], ["Floral", "15", 228.9, 96.8], ["Elegan", "6", 333.7, 95.7], ["Minimalis", "5", 437.4, 114.6], ["Ceria", "4", 559.9, 83.5]];
const chipRow = (x0, y, on = "Semua") => CHIPS.map(([l, n, x, w]) => {
  const p = l === on, fg = p ? LP.paper : LP.cocoa;
  return rect(x0 + x + 0.75, y + 0.75, w - 1.5, 42.5, { r: 21.25, fill: p ? LP.cocoa : LP.paper, stroke: LP.cocoa, sw: 1.5 }) +
    `<text x="${x0 + x + w / 2}" y="${y + 26.7}" font-size="15" font-weight="700" fill="${fg}" text-anchor="middle">${l}<tspan dx="6" font-size="13" font-weight="600" opacity=".75">${n}</tspan></text>`;
}).join("");
const chipX = (label) => { const [, , x, w] = CHIPS.find((c) => c[0] === label); return x + w / 2; };
// Design notes (the description) as each Gaya katalog clamps them at 390 px, read off the screen.
const NOTES = {
  grid: [["Abu-abu gelap di atas", "foto, tanpa ornamen · 20…"], ["Hitam & krem gaya", "majalah, foto penuh di…"], ["Putih bersih gaya majalah,", "huruf serif besar, tombol…"],
    ["Putih & krem, bingkai", "lengkung, bayangan dau…"]],
  daftar: [["Abu-abu gelap di atas foto, tanpa", "ornamen · 20 bagian · HP & desktop ·…"], ["Hitam & krem gaya majalah, foto", "penuh di sampul, huruf serif · 20…"],
    ["Putih bersih gaya majalah, huruf serif", "besar, tombol biru dongker · 20…"], ["Putih & krem, bingkai lengkung,", "bayangan daun, tombol cokelat · 20…"]],
  kartu: [["Abu-abu gelap di atas foto, tanpa ornamen ·", "20 bagian · HP & desktop · ID/EN"], ["Hitam & krem gaya majalah, foto penuh di", "sampul, huruf serif · 20 bagian · HP & desktop", "· ID/EN"]],
  geser: [["Abu-abu gelap di atas foto, tanpa", "ornamen · 20 bagian · HP & desktop ·…"], ["Hitam & krem gaya majalah, foto penuh", "di sampul, huruf serif · 20 bagian · HP…"]]
};
// One Grid design: picture, name lines, note, Lihat demo and Pilih. `act` is the top of Pilih, shared by both designs
// of a row (a two-line name pushes it down).
const gridItem = (x, t, names, note, pal, act = 287.6) => clipped(x, t, 168, 210, pageSketch(x, t, 168, 210, pal)) + rect(x, t, 168, 210, { r: 14, stroke: LP.cocoa, sw: 1.5 }) +
  names.map((n, k) => h(x, t + 229 + k * 23, n, 20)).join("") + para(x, t + 251 + (names.length - 1) * 23, note, { size: 14, fill: LP.muted, lh: 20.3 }) +
  text(x, t + act + 27.2, "Lihat demo", { size: 15, weight: 700, fill: LP.cocoa, underline: true }) + lpBtn(x + 92, t + act, "Pilih", { small: true, w: 71 });
const tplGrid = (x0, top) => TPL.map(([n, , pal], i) => gridItem(x0 + 20 + (i % 2) * 182, top + Math.floor(i / 2) * 357.6, [n], NOTES.grid[i], pal)).join("");

// Fitur undangan digital (.feat-grid, two columns): icons and words from the page. [x, top, height, title, text]; the
// title starts 75 below the card top, the text 126.6 below (103.8 under a one-line title).
const FEAT_ICON = ['<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>', '<path d="M21 12a9 9 0 0 1-13.5 7.8L3 21l1.2-4.5A9 9 0 1 1 21 12z"/>',
  '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>', '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>', '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M10 2h4"/>',
  '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
  '<path d="m22 8-6 4 6 4V8z"/><rect x="2" y="6" width="14" height="12" rx="2"/>', '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
  '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>', '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM18 18h3v3h-3"/>',
  '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>'];
const FEAT = [[20, 2004.4, 212.8, ["Nama tamu di", "sampul"], ["Tiap tamu dapat link", "pribadi dengan", "namanya."]], [201, 2004.4, 212.8, ["RSVP dan", "ucapan"], ["Tamu konfirmasi", "hadir dan menulis", "doa langsung di", "undangan."]],
  [20, 2229.2, 192.5, ["Galeri dan", "video"], ["Foto prewedding,", "kisah kalian, dan", "video."]], [201, 2229.2, 192.5, ["Musik latar"], ["Lagu pilihan kalian", "saat undangan", "dibuka."]],
  [20, 2433.7, 212.8, ["Peta dan", "kalender"], ["Lokasi acara sekali", "ketuk, simpan", "tanggal ke kalender", "HP."]], [201, 2433.7, 212.8, ["Hitung", "mundur"], ["Hari, jam, dan menit", "menuju acara."]],
  [20, 2658.4, 192.5, ["Amplop digital"], ["Nomor rekening dan", "alamat kirim kado."]], [201, 2658.4, 192.5, ["Siaran", "langsung"], ["Link YouTube atau", "Instagram untuk", "tamu yang jauh."]],
  [20, 2862.9, 212.8, ["Filter", "Instagram"], ["Tamu ikut", "mengabadikan", "momen dengan filter", "kalian."]], [201, 2862.9, 212.8, ["Kirim lewat", "WhatsApp"], ["Dashboard pasangan", "untuk mengirim ke", "tiap tamu dan", "memantau RSVP."]],
  [20, 3087.7, 190, ["Check-in QR"], ["Penerima tamu", "memindai QR tamu", "di hari H."]], [201, 3087.7, 190, ["Dua bahasa"], ["Teks undangan", "dalam bahasa", "Indonesia atau", "Inggris."]]];
const featIcon = (d, x, y) => `<g transform="translate(${x} ${y}) scale(${28 / 24})" fill="none" stroke="${LP.accent}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</g>`;
// Pertanyaan (shared accordion .faq-list, all closed): [top, height, question lines]; plus icon 28 px at the right.
const FAQ = [[4892.2, 63, ["Apakah tamu perlu memasang aplikasi?"]], [4955.2, 78.6, ["Bisakah nama tiap tamu ditulis di", "undangan?"]], [5033.8, 63, ["Berapa lama sampai undangannya jadi?"]],
  [5096.8, 63, ["Bisakah isi undangan diubah setelah jadi?"]], [5159.8, 78.6, ["Bagaimana kami tahu siapa yang akan", "hadir?"]], [5238.4, 63, ["Bagaimana cara membayar?"]],
  [5301.4, 63, ["Berapa lama undangan bisa dibuka?"]]];
const faqPlus = (cx, cy) => circle(cx, cy, 13.25, { stroke: LP.dash, sw: 1.5 }) + rect(cx - 5.5, cy - 1, 11, 2, { fill: LP.cocoa }) + rect(cx - 1, cy - 5.5, 2, 11, { fill: LP.cocoa });

function landingTop(x0, y0, name) {
  const X = x0 + 20, Y = (v) => y0 + v;
  let s = rect(x0, y0, 390, LPY.card, { fill: LP.paper });
  // header
  s += circle(X + 20, Y(37), 20, { fill: LP.tint }) + h(X + 20, Y(43), name[0], 18, { weight: 600, anchor: "middle" }) + h(X + 50, Y(43), name, 18, { weight: 600 }) +
    lpBtn(x0 + 288.2, Y(14), "Pesan", { small: true, w: 81.8 });
  // hero
  ["Undangan digital", "untuk hari", "bahagia kalian"].forEach((l, i) => (s += h(X, Y([131, 174.8, 218.5][i]), l, 42.9)));
  s += para(X, Y(261.3), ["Pilih desain, pilih paket, lalu isi data", `pernikahan kalian. ${name} menyiapkan`, "undangannya sampai siap dibagikan ke tamu."], { size: 17, fill: LP.muted, lh: 26.3 });
  s += lpBtn(X, Y(LPY.cta), "Pesan undangan", { solid: true, w: 178.8 }) + lpBtn(x0 + 210.8, Y(LPY.cta), "Lihat desain", { w: 143.6 });
  s += THUMB(X + 10.5, Y(LPY.art + 28), 175, 219, TPL[1][2], -6) + THUMB(X + 164.5, Y(LPY.art + 28), 175, 219, TPL[2][2], 6) + THUMB(X + 87.5, Y(LPY.art), 175, 219, TPL[0][2]);
  // katalog: theme buttons, the first four designs
  s += dash(X, Y(LPY.katalog), 350) + h(X, Y(866.3), "Pilih desain undangan", 32) +
    para(X, Y(901.9), ["Buka demo untuk melihat undangan", "contohnya, lalu pilih desain yang kalian suka."], { size: 17, fill: LP.muted, lh: 26.3 }) +
    chipRow(x0, Y(LPY.chips)) + tplGrid(x0, Y(LPY.grid));
  // fitur undangan digital
  s += dash(X, Y(LPY.fitur), 350) + h(X, Y(1879.8), "Fitur undangan digital", 32) +
    para(X, Y(1915.4), ["Semua desain memakai fitur yang sama. Yang", "termasuk di undangan kalian mengikuti paket", "yang kalian pilih."], { size: 17, fill: LP.muted, lh: 26.3 }) +
    FEAT.map(([x, top, hh, title, txt], i) => rect(x0 + x + 0.75, Y(top + 0.75), 167.5, hh - 1.5, { r: 16, fill: LP.paper, stroke: LP.line, sw: 1.5 }) + featIcon(FEAT_ICON[i], x0 + x + 17, Y(top + 19)) +
      title.map((l, k) => h(x0 + x + 17, Y(top + 75 + k * 22.8), l, 19)).join("") + para(x0 + x + 17, Y(top + (title.length > 1 ? 126.6 : 103.8)), txt, { size: 14, fill: LP.muted, lh: 20.3 })).join("");
  // paket dan harga
  s += rect(x0, Y(LPY.harga), 390, LPY.cara - LPY.harga, { fill: LP.tint }) + h(X, Y(3429.7), "Paket dan harga", 32) +
    para(X, Y(3465.3), ["Pilih paket yang pas, lalu isi datanya di form", "di bawah."], { size: 17, fill: LP.muted, lh: 26.3 });
  PKG.forEach(([n, price, inc], i) => {
    const t = LPY.pkg1 + i * 311.1;
    s += rect(X + 0.75, Y(t + 0.75), 348.5, 293.6, { r: 16, fill: LP.paper, stroke: LP.cocoa, sw: 1.5 }) + h(X + 25, Y(t + 47), n, 24) + h(X + 25, Y(t + 91.6), price, 32, { weight: 600 }) +
      dash(X + 25, Y(t + 120.6), 300) + inc.map((x, k) => iconX("check", X + 34, Y(t + 151.6 + k * 31.7), 18, LP.cocoa, 2.4) + text(X + 53, Y(t + 155.6 + k * 31.7), x, { size: 15, fill: LP.ink })).join("") +
      lpBtn(X + 25, Y(t + 218.1), "Pilih paket ini", { solid: true, w: 300 });
  });
  // cara pesan
  s += h(X, Y(4286.2), "Cara pesan", 32);
  [["1", 4319.8, "Pilih desain dan paket", ["Lihat demo desain di atas, lalu pilih", "paket yang sesuai."]], ["2", 4429.7, "Isi data pernikahan", ["Nama, acara, dan detail lain lewat form", "di bawah. Yang belum siap boleh", "menyusul."]],
    ["3", 4564.5, "Dihubungi lewat WhatsApp", [`${name} mengonfirmasi pesanan dan`, "pembayaran, lalu menyiapkan", "undangan kalian."]]].forEach(([n, top, t, p]) => {
    s += circle(X + 24, Y(top + 24), 23, { fill: LP.paper, stroke: LP.cocoa, sw: 2 }) + h(X + 24, Y(top + 32), n, 22, { weight: 600, fill: LP.accent, anchor: "middle" }) +
      h(X + 64, Y(top + 21), t, 22) + para(X + 64, Y(top + 49.3), p, { size: 16, fill: LP.muted, lh: 24.8 });
  });
  // pertanyaan
  s += dash(X, Y(LPY.faq), 350) + h(X, Y(4819.3), "Pertanyaan", 32) + text(X, Y(4854.9), "Belum terjawab?", { size: 17, fill: LP.muted }) +
    text(x0 + 152.6, Y(4854.9), "Tanya lewat WhatsApp", { size: 17, weight: 700, fill: LP.cocoa, underline: true }) + text(x0 + 339.7, Y(4854.9), ".", { size: 17, fill: LP.muted }) +
    line(X, Y(4891.95), X + 350, Y(4891.95), { stroke: LP.dash, sw: 1.5 }) +
    FAQ.map(([top, hh, q]) => para(X, Y(top + 33), q, { size: 16, weight: 500, fill: LP.cocoa, lh: 20.8 }) + faqPlus(x0 + 356, Y(top + 30)) +
      line(X, Y(top + hh - 0.75), X + 350, Y(top + hh - 0.75), { stroke: LP.dash, sw: 1.5 })).join("");
  // form section head
  s += dash(X, Y(LPY.pesan), 350) + h(X, Y(5512.4), "Isi data pesanan", 32) +
    para(X, Y(5548), [`Data langsung terkirim ke ${name}. Yang`, "belum siap boleh dikosongkan dan dilengkapi", "lewat WhatsApp."], { size: 17, fill: LP.muted, lh: 26.3 });
  return body(s);
}

// Form card (#formCard): picked-now, progress, step panel, actions, status. Returns { svg, pos, bottom }.
const FITUR = [["Siaran langsung"], ["Dua rekening dan alamat kirim", "kado"], ["Acara ngunduh mantu"], ["Warna, font, dan filter Instagram", "pilihan"], ["QR check-in tamu"], ["Hanya tamu yang diundang (link", "per tamu)"]];
function lpField(x, y, w, label, value, o = {}) {
  const hh = o.area ? 112 : 48;
  return text(x, y + 16, label, { size: 14, weight: 700, fill: LP.cocoa }) + rect(x + 0.75, y + 28.75, w - 1.5, hh - 1.5, { r: 8, fill: LP.paper, stroke: o.bad ? LP.danger : LP.cocoa, sw: 1.5 }) +
    (value ? text(x + 14, y + 28 + (o.area ? 26 : 30), value, { size: 16, fill: o.ph ? "#8a847e" : LP.ink }) : "") + (o.select ? iconX("chevron-down", x + w - 22, y + 52, 18, LP.ink) : "");
}
function formCard(x0, top, st) {
  const X = x0 + 20, ix = X + 21.5, iw = 307, pos = {};
  let y = top + 21.5, s = "";
  if (st.done) {
    s += h(ix, y + 30, "Data terkirim", 32);
    s += para(ix, y + 64, ["Terima kasih. Vendor undangan kalian", "sudah menerima data ini dan akan", "mengabari kalian."], { size: 16, fill: LP.muted, lh: 24.8 });
    y += 35 + 10 + 3 * 24.8;
  } else {
    if (st.picked) { const ph = 20 + st.picked.length * 23.25 + 2; s += rect(ix + 0.5, y + 0.5, iw - 1, ph - 1, { r: 8, fill: LP.paper, stroke: LP.line }) + para(ix + 14, y + 27, st.picked, { size: 15, weight: 700, fill: LP.cocoa, lh: 23.25 }); pos.picked = y; y += ph + 18; }
    const n = 10, k = st.step, bw = (iw - 4 * (n - 1)) / n;
    for (let i = 0; i < n; i++) s += rect(ix + i * (bw + 4), y, bw, 6, { r: 3, fill: i < k ? LP.cocoa : i === k ? LP.accent : LP.dash });
    s += text(ix, y + 30, `Langkah ${k + 1} dari ${n} · ${st.title}`, { size: 13, weight: 700, fill: LP.muted });
    y += 36 + 24;
    pos.head = y;
    s += h(ix, y + 23, st.title, 26) + para(ix, y + 52, st.intro, { size: 15, fill: LP.muted, lh: 23.25 });
    y += 28.6 + 6 + st.intro.length * 23.25 + 20;
    if (st.kind === "pesanan") {
      s += lpField(ix, y, iw, "Paket", st.paket || "Pilih paket", { select: true, ph: !st.paket }); pos.paket = y + 28; y += 76 + 14;
      s += text(ix, y + 16, "Fitur undangan", { size: 14, weight: 700, fill: LP.cocoa }); y += 30;
      pos.picks = [];
      FITUR.forEach((f) => {
        const hh = f.length > 1 ? 68.5 : 48;
        s += rect(ix + 0.5, y + 0.5, iw - 1, hh - 1, { r: 8, fill: LP.paper, stroke: LP.line }) + rect(ix + 14.5, y + hh / 2 - 9.5, 19, 19, { r: 3, fill: LP.paper, stroke: "#767676", sw: 1.5 }) +
          para(ix + 46, y + hh / 2 + 5 - (f.length - 1) * 11.6, f, { size: 15, fill: LP.ink, lh: 23.25 });
        pos.picks.push([ix, y, hh]); y += hh + 8;
      });
      y += 6;
      s += lpField(ix, y, iw, "Desain", st.desain || "nama desain pilihan kalian", { ph: !st.desain }); pos.desain = y + 28; y += 76;
    } else if (st.kind === "pemesan") {
      pos.fields = [];
      [["Nama *", ""], ["WhatsApp *", "08xxxxxxxxxx"], ["Email", ""]].forEach(([l, ph]) => { s += lpField(ix, y, iw, l, ph, { ph: true, bad: st.bad && l === "Nama *" }); pos.fields.push(y + 28); y += 76 + 14; });
      y -= 14;
    } else if (st.kind === "catatan") {
      s += lpField(ix, y, iw, "Catatan untuk tim", "Permintaan lain untuk undangan kalian.", { area: true, ph: true }); y += 28 + 112;
    }
    y += 24;
    pos.next = y;
    s += lpBtn(ix, y, st.kind === "catatan" ? "kirim data" : "lanjut", { solid: true, w: iw }); y += 52;
    if (k > 0) { y += 10; pos.prev = y; s += lpBtn(ix, y, "kembali", { secondary: true, w: iw }); y += 52; }
    if (st.status) { pos.status = y + 14; s += text(ix, y + 14 + 17, st.status, { size: 14, weight: 700, fill: LP.danger }); y += 14 + 22; }
  }
  const bottom = y + 21.5;
  const card = rect(X + 0.75, top + 0.75, 348.5, bottom - top - 1.5, { r: 16, fill: LP.tint, stroke: LP.cocoa, sw: 1.5 });
  return { svg: body(card + s), pos, bottom };
}
// Card + note + foot, on a white sheet that hides whatever was drawn there before.
function formTail(x0, top, st, name = "Rina WO") {
  const c = formCard(x0, top, st), X = x0 + 20, b = c.bottom;
  const tail = para(X, b + 36, ["Data tersimpan di HP ini sampai terkirim, jadi aman", "bila halaman tertutup."], { size: 13, fill: LP.muted, lh: 20 }) +
    rect(x0, b + 117, 390, 150, { fill: LP.cocoa }) + h(X, b + 177, name, 20, { weight: 600, fill: LP.paper }) +
    text(X, b + 219, "Tanya lewat WhatsApp", { size: 16, weight: 700, fill: LP.paper, underline: true });
  return { svg: rect(x0, top - 2, 390, b - top + 280, { fill: LP.paper }) + c.svg + body(tail), pos: c.pos, bottom: b };
}
const PESANAN = { kind: "pesanan", step: 0, title: "Pesanan", intro: ["Pilih paket dan centang fitur yang", "kalian inginkan."] };
const PEMESAN = { kind: "pemesan", step: 1, title: "Pemesan", intro: ["Kontak untuk tim kami."] };
const CATATAN = { kind: "catatan", step: 9, title: "Catatan", intro: ["Hal lain yang ingin dimasukkan, lalu", "kirim."] };

// ---- Shared panel pieces -----------------------------------------------------------------------------------------
const tplPanel = (o = {}) => nkHead(0, 0, "Template", o.head) + bodyBg + bodyClip(kindSeg("template"), tplCards(219));
const mkPanel = (on, extra = "") => nkHead(0, 0, "Template", { inbox: false }) + bodyBg + bodyClip(kindSeg("marketing"), brandClosed(219), extra, mkCards(MKY, on));

// Profil merek open form (BrandForm), from the box top y; positions documented in scene notes below.
const BOX = 219;
function brandOpen(v = {}) {
  const fx = 101, fw = 253;
  let s = rect(85.5, BOX - 2.5, 284, 1004, { r: 6, stroke: C.primarySoft, sw: 3 }) + rect(88.5, BOX + 0.5, 278, 998, { r: 4, fill: C.white, stroke: C.primary }) +
    text(101, BOX + 30, "Profil merek", { size: 14, weight: 500 }) + badgeAt(354, BOX + 16, v.ready ? "Terisi" : "Belum diisi", v.ready ? "ok" : "plain") + line(89, BOX + 49, 366, BOX + 49);
  s += nkLabel(fx, 292, "Nama bisnis") + nkInput(fx, 300, fw, v.name ?? "") +
    nkLabel(fx, 360, "Nomor WhatsApp") + nkInput(fx, 368, fw, v.wa ?? "0812 3456 7890", { placeholder: !v.wa }) +
    para(fx, 420, ["Tombol Tanya lewat WhatsApp di Landing page", "menuju nomor ini."], { size: 12, fill: C.faint, lh: 16 }) +
    nkLabel(fx, 464, "Logo (opsional)") + nkInput(fx, 472, fw, "https://", { placeholder: true }) +
    para(fx, 524, ["Alamat gambar https, misalnya dari Media", "Scalev Anda."], { size: 12, fill: C.faint, lh: 16 }) +
    para(fx, 572, ["Paket dan harga di Landing page, 1 sampai 3", "paket."], { size: 12, fill: C.faint, lh: 16 });
  // one package item (.nk-item)
  s += rect(fx + 0.5, 600.5, fw - 1, 396, { r: 4, fill: C.page, stroke: C.line }) + text(111, 629, v.pkg ?? "Paket 1", { size: 12, weight: 700 }) +
    icon("chevron-up", 282, 624, 16, C.off) + icon("chevron-down", 308, 624, 16, C.off) + icon("trash", 334, 624, 16, C.off) +
    nkLabel(111, 660, "Nama paket") + nkInput(111, 668, 233, v.pkgName ?? "Nama paket", { placeholder: !v.pkgName }) +
    nkLabel(111, 728, "Harga (Rp)") + nkInput(111, 736, 233, v.price ?? "150.000", { placeholder: !v.price }) +
    nkLabel(111, 796, "Isi paket (opsional)") + rect(111.5, 804.5, 232, 133, { r: 4, fill: C.white, stroke: C.field }) +
    para(111, 954, ["Satu baris satu isi, maksimal 6 baris, 80", "huruf per baris."], { size: 12, fill: C.faint, lh: 16 }) +
    nkBtn(fx, 1005, "Tambah paket", { variant: "quiet", w: fw, icon: "plus" }) +
    nkLabel(fx, 1061, "Gaya katalog") + nkInput(fx, GAYA_Y, fw, v.style ?? "Grid", { select: true }) +
    para(fx, 1121, ["Cara daftar desain tampil di Landing", "page. Berlaku setelah profil disimpan", "dan halaman dipasang atau diperbarui."], { size: 12, fill: C.faint, lh: 16 }) +
    nkBtn(fx, SIMPAN_Y, "Simpan profil", { w: 110 });
  return s;
}
const GAYA_Y = 1069, SIMPAN_Y = 1169, SCROLL = 420;
// Gaya katalog's native select list (CATALOG_STYLES labels), under the select; the current value has a check.
const STYLE_LABELS = ["Grid", "Daftar", "Kartu besar", "Geser", "Mozaik"];
const MENU_Y = GAYA_Y - SCROLL + 40, menuItemY = (i) => MENU_Y + 4 + i * 32;
const styleMenu = shadow(101, MENU_Y, 253, 168, 6, 2) + rect(101.5, MENU_Y + 0.5, 252, 167, { r: 6, fill: C.white, stroke: C.line }) +
  rect(105, menuItemY(0), 245, 32, { r: 4, fill: C.primarySoft }) + iconX("check", 120, menuItemY(0) + 16, 14, C.strong, 2.4) +
  STYLE_LABELS.map((l, i) => text(134, menuItemY(i) + 21, l, { size: 14 })).join("");

// Bagikan dialog (editor-bagikan.png, saved state: no unsaved note, so 50 px higher).
const shareDlg = nkDialogHead(0, 0, "Bagikan") + nkLabel(16, 181, "Nama tamu") + nkInput(16, 189, 366, "Nama Tamu") + nkHint(16, 245, "Ditambahkan sebagai ?to=Nama.") +
  rect(16, 261, 366, 52, { r: 4, fill: C.mutedBg }) + text(26, 283, "https://tokomu.myscalev.com/rani-dimas?", { size: 12, mono: true }) + text(26, 301, "to=Nama+Tamu", { size: 12, mono: true }) +
  nkBtn(16, 325, "Lihat sebagai tamu", { w: 366, size: 14, icon: "eye" }) + nkBtn(16, 369, "Salin tautan tamu", { w: 366, size: 14, variant: "ghost", icon: "copy" }) +
  nkBtn(16, 413, "Salin tautan umum", { w: 366, size: 14, variant: "quiet", icon: "link" }) +
  nkH3(16, 485, "Undangan khusus") + text(16, 522, "Undangan khusus", { size: 14, fill: C.text }) + nkSwitch(346, 507, false) +
  para(16, 551, ["Isi undangan tidak ada di kode halaman. Server Nikahin", "mengirimnya hanya ke tamu dengan tautan sah."], { size: 12, fill: C.faint, lh: 16 }) +
  nkH3(16, 603, "Untuk pengantin") + nkBtn(16, 615, "Kirim undangan", { w: 366, size: 14, variant: "ghost", icon: "link" }) +
  nkHint(16, 711, "Masuk dengan PIN dashboard.") + nkH3(16, 751, "PIN dashboard") + nkBtn(16, 763, "Kelola PIN dashboard", { w: 366, size: 14, icon: "lock" }) +
  nkHint(16, 815, "PIN hanya tampil di jendela NikahKit.");
const bukaDash = nkBtn(16, 659, "Buka Dashboard", { w: 366, size: 14, variant: "quiet", icon: "layout-grid" });

// Pesanan masuk dialog (orders.jsx; editor-pesanan.png for the boxes).
function orderRow(y, couple, meta, badge) {
  return text(28, y + 26, couple, { size: 14, weight: 600 }) + text(28, y + 42, meta, { size: 10, fill: C.text }) + badge + icon("trash", 357, y + 28, 18, C.text);
}
const ROW1 = 190, ROW2 = 247;
const ROW_A = ["Rani & Dimas", "Basic + QR check-in tamu · 14 Okt, 10.20"], ROW_B = ["Ayu & Fajar", "Premium · 2 Okt, 09.00"];
// .nk-box summary row (closed or open).
const boxRow = (y, l, open = false) => rect(16.5, y + 0.5, 365, 49, { r: 4, fill: C.white, stroke: C.line }) + icon(open ? "chevron-down" : "chevron-right", 38, y + 25, 18, C.strong) + text(59, y + 30, l, { size: 14, weight: 500 });
const ordersTop = nkDialogHead(0, 0, "Pesanan masuk") + nkHint(16, 181, "Klik nama untuk mengisi semua kolom sesuai paketnya.");
const ordersDlg = ordersTop + rect(16.5, 189.5, 365, 113, { r: 4, fill: C.white, stroke: C.line }) + line(17, 246.5, 381, 246.5) +
  orderRow(ROW1, ...ROW_A, badgeAt(331, ROW1 + 19, "Baru", "todo")) + orderRow(ROW2, ...ROW_B, badgeAt(331, ROW2 + 19, "Sudah diisi", "ok")) + boxRow(319, "Tempel data pesanan") + boxRow(377, "Link form klien (opsional)");

// ---- Flow diagram and checklist ----------------------------------------------------------------------------------
// The 11 steps of alur-dengan-klien.mdx, snaking over 4 rows of 3.
const FLOW = [
  ["smartphone", "Klien buka Landing page", ["Desain, paket dan harga,", "lalu cara pesan"], "Klien"],
  ["pencil", "Klien isi form", ["Tekan kirim data, muncul", "Data terkirim"], "Klien"],
  ["credit-card", "Sepakati pembayaran", ["Konfirmasi pesanan dan", "bayar lewat WhatsApp"], "Kamu"],
  ["file-text", "Buat halaman undangan", ["HTML Mode baru, isi slug,", "lalu pilih template"], "Kamu"],
  ["inbox", "Pesanan masuk: klik nama", ["Semua kolom undangan", "terisi otomatis"], "Kamu"],
  ["image", "Rapikan isi, ganti foto", ["Foto tidak ikut terisi", "dari form"], "Kamu"],
  ["rocket", "Simpan & Terbitkan", ["Di kanan atas editor", "Scalev"], "Kamu"],
  ["send", "Kirim PIN dan pesan", ["PIN dashboard dan pesan", "untuk pengantin"], "Kamu"],
  ["users", "Kirim undangan ke tamu", ["Tautan per tamu dari", "Dashboard > Kirim"], "Pengantin"],
  ["calendar-check", "Hari-H: check-in", ["Penerima tamu memindai", "QR tamu"], "Staff"],
  ["eye", "Buka untuk semua", ["Setelah acara, di", "Dashboard > Pengaturan"], "Pengantin"]
];
// One 1440x900 screen: text is 22-24 px, so it reads at 12-13 px in the docs without a lens.
const FX = [12, 500, 988], FY = [78, 284, 490, 696], FW = 440, FH = 168;
const flowPos = (i) => { const r = Math.floor(i / 3), c = r % 2 ? 2 - (i % 3) : i % 3; return [FX[c], FY[r]]; };
function flowCard(i) {
  const [x, y] = flowPos(i), [ic, t, sub, who] = FLOW[i], [whoFill, whoFg] = { Klien: ["#e8f6fb", C.action], Kamu: [C.tint, C.accent], Pengantin: [C.okSoft, C.ok], Staff: ["#f2f5fa", C.strong] }[who];
  const bw = tw(who, 22, 600) + 24;
  return shadow(x, y, FW, FH, 14, 2) + rect(x, y, FW, FH, { r: 14, fill: C.white }) + rect(x + 18, y + 26, 50, 50, { r: 12, fill: whoFill }) + iconX(ic, x + 43, y + 51, 26, whoFg) +
    text(x + 84, y + 44, `Langkah ${i + 1}`, { size: 22, weight: 600, fill: C.faint }) + text(x + 84, y + 80, t, { size: 24, weight: 700, fill: C.ink }) +
    para(x + 84, y + 114, sub, { size: 22, fill: C.text, lh: 28 }) + rect(x + FW - 18 - bw, y + 16, bw, 34, { r: 17, fill: whoFill }) +
    text(x + FW - 18 - bw / 2, y + 41, who, { size: 22, weight: 600, fill: whoFg, anchor: "middle" });
}
const arrowHead = (x, y, dir) => { const d = { r: [-9, -6, -9, 6], l: [9, -6, 9, 6], d: [-6, -9, 6, -9] }[dir]; return `<path d="M${x + d[0]} ${y + d[1]} L${x} ${y} L${x + d[2]} ${y + d[3]}" fill="none" stroke="${C.accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`; };
function flowArrow(i) {
  const [x1, y1] = flowPos(i), [x2, y2] = flowPos(i + 1);
  if (y1 === y2) { const l = x2 > x1, ax = l ? x1 + FW + 8 : x1 - 8, bx = l ? x2 - 8 : x2 + FW + 8, ay = y1 + FH / 2; return line(ax, ay, bx, ay, { stroke: C.accent, sw: 2.5, cap: "round" }) + arrowHead(bx, ay, l ? "r" : "l"); }
  const ax = x1 + FW / 2; return line(ax, y1 + FH + 6, ax, y2 - 6, { stroke: C.accent, sw: 2.5, cap: "round" }) + arrowHead(ax, y2 - 6, "d");
}
// The 10 step titles of checklist-serah.mdx.
const CHECK = ["Konten sudah benar", "Semua foto contoh sudah diganti", "Musik sudah diatur", "Halaman tersimpan, slug terisi, RSVP siap", "Simpan & Terbitkan", "Coba sebagai tamu",
  "PIN dashboard dibuat", "Pesan untuk pengantin tersalin dan memuat tautan Dashboard", "Undangan khusus dicek (bila dipakai)", "Kode staff untuk hari-H (bila dipakai)"];
const CKX = 230, CKY = (i) => 172 + i * 68, CKW = 980;

// ---- Phone screens and dialog extras -----------------------------------------------------------------------------
// A 390x844 phone viewport onto a long page: the page drawn shifted up by y.
const scr = (y, ...s) => group({ transform: `translate(0 ${-y})` }, ...s);
// Pages are drawn in phone px (0..390). ph() puts them on the desktop's phone screen (PHONE), clipped to it; Q, QR and
// QM turn phone px into world points, rects and marks.
const onPhone = (...s) => group({ transform: `translate(${PHONE.x} ${PHONE.y})` }, ...s);
const ph = (...s) => clipped(PHONE.x, PHONE.y, PHONE.w, PHONE.h, onPhone(...s));
const phBase = (...s) => [phoneDesk(onPhone(...s))];
const Q = (x, y) => [+(x + PHONE.x).toFixed(1), +(y + PHONE.y).toFixed(1)];
const QR = (x, y, w, hh) => [...Q(x, y), w, hh];
const QM = (x, y, w, hh, r = 4) => ({ box: QR(x, y, w, hh), r });
const PHF = [PHONE.x, PHONE.y, PHONE.w, PHONE.h];
// A lens beside the phone screen ("l" or "r"), level with its source (stage = world * 2/3; lens = src * zoom * 2/3).
const lensBy = (src, side, zoom = 2) => {
  const k = (zoom * 2) / 3, w = src[2] * k, hh = src[3] * k, cy = ((src[1] + src[3] / 2) * 2) / 3;
  return { src, zoom, at: [+(side === "l" ? Math.max(12, (PHONE.x * 2) / 3 - 16 - w) : ((PHONE.x + PHONE.w) * 2) / 3 + 16).toFixed(1), +Math.min(Math.max(cy - hh / 2, 12), 588 - hh).toFixed(1)] };
};
// The desktop strips above and below the screen, redrawn over a page that scrolls (as the skeleton the steps show there).
const PH_BOTTOM = PHONE.y + PHONE.h;
const phEdges = skeleton(clipped(0, 0, 1440, PHONE.y, phoneDesk("")) + clipped(0, PH_BOTTOM, 1440, 900 - PH_BOTTOM, phoneDesk("")));
const LAND = landingTop(0, 0, "Rina WO");
const F0 = formTail(0, LPY.card, PESANAN);
const F1 = formTail(0, LPY.card, { ...PESANAN, picked: ["Pilihan kalian: desain Dasar"], desain: "Dasar" });
const F2 = formTail(0, LPY.card, { ...PESANAN, picked: ["Pilihan kalian: Paket Basic, desain", "Dasar"], desain: "Dasar", paket: "Basic" });
// Live demo (dialog.demo, full screen): bar 63 px (name, Pakai desain ini 147x46, close 44), the sample invitation below.
const DEMO_PICK = [181 + 147 / 2, 31], DEMO_X = [360, 31];
const demoView = body(rect(0, 0, 390, 844, { fill: LP.paper }) + clipped(0, 63, 390, 781, group({ transform: "translate(-727 -43)" }, invite(RANI))) +
  rect(0, 0, 390, 62, { fill: LP.paper }) + line(0, 62.25, 390, 62.25, { stroke: LP.cocoa, sw: 1.5 }) + h(16, 38, "Dasar", 19, { weight: 600 }) +
  iconX("x", DEMO_X[0], DEMO_X[1], 24, LP.cocoa, 2.2));
const demoPick = body(lpBtn(181, 8, "Pakai desain ini", { small: true, solid: true, w: 147 }));
const KAT = LPY.katalog, LIHAT_DEMO = [62, LPY.grid + 310 - KAT];
// The phone's address bar (56 px) above a 844 viewport, for the shareable ?demo= link.
const ADDR = "tokomu.myscalev.com/rina-wo";
const urlBar = (u) => rect(0, 0, 390, 56, { fill: "#f1f3f4" }) + rect(12, 8, 366, 40, { r: 20, fill: "#e3e5e8" }) + icon("lock", 32, 28, 14, C.text) + text(46, 33, u, { size: 14, fill: C.strong });
const inBrowser = (...s) => clipped(0, 56, 390, 844, group({ transform: "translate(0 56)" }, ...s));

// Gaya katalog (renderCatalog + .cat-* CSS at 390 px, measured in Chrome): y from the katalog's dashed line; the designs
// start under the theme buttons.
let rcN = 0;
const rclip = (x, y, w, hh, r, ...kids) => { const id = `rc${rcN++}`; return `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${r}"/></clipPath></defs><g clip-path="url(#${id})">${kids.join("")}</g>`; };
const pic = (x, y, w, hh, pal, r = 14) => rclip(x, y, w, hh, r, pageSketch(x, y, w, hh, pal)) + rect(x, y, w, hh, { r, stroke: LP.cocoa, sw: 1.5 });
const demoLink = (x, top) => text(x, top + 28, "Lihat demo", { size: 15, weight: 700, fill: LP.cocoa, underline: true });
const CT = LPY.grid - KAT, CHIP_Y = LPY.chips - KAT;
const catHead = rect(0, 0, 390, 844, { fill: LP.paper }) + dash(20, 0, 350) + h(20, 88, "Pilih desain undangan", 32) +
  para(20, 123.6, ["Buka demo untuk melihat undangan", "contohnya, lalu pilih desain yang kalian suka."], { size: 17, fill: LP.muted, lh: 26.3 }) + chipRow(0, CHIP_Y);
// Mozaik with every design: the fourth is a tall tile on the right, the fifth (Cute Gemoy) starts beside it.
const GEMOY = ["Cute Gemoy", null, ["#fde7ec", "#e48aa3"]];
const CAT_STYLE = {
  grid: tplGrid(0, CT),
  daftar: TPL.map(([n, , pal], i) => { const t = CT + i * 153.6;
    return pic(20, t + 16, 92, 115, pal, 10) + h(128, t + 35, n, 20) + para(128, t + 57, NOTES.daftar[i], { size: 14, fill: LP.muted, lh: 20.3 }) + demoLink(128, t + 88.8) +
      lpBtn(220, t + 89.6, "Pilih", { small: true, w: 71 }) + dash(20, t + 151.6, 350); }).join(""),
  // Kartu besar: a third note line makes the card 21.8 taller and moves Lihat demo and Pilih down with it.
  kartu: [0, 1].map((i) => { const [n, , pal] = TPL[i], note = NOTES.kartu[i], more = (note.length - 2) * 21.8, t = CT + i * 470.6, hh = 450.6 + more;
    return rect(20, t, 350, hh, { r: 16, fill: LP.paper }) + rclip(20, t, 350, hh, 16, pageSketch(21, t + 1, 348, 261, pal)) + line(20, t + 262.25, 370, t + 262.25, { stroke: LP.cocoa, sw: 1.5 }) +
      rect(20.75, t + 0.75, 348.5, hh - 1.5, { r: 16, stroke: LP.cocoa, sw: 1.5 }) + h(41, t + 303, n, 26) + para(41, t + 331, note, { size: 15, fill: LP.muted, lh: 21.8 }) +
      demoLink(41, t + 379.8 + more) + lpBtn(137, t + 377.5 + more, "Pilih", { solid: true, w: 83.1 }); }).join(""),
  // Geser: on a phone (no arrows) the next section, Fitur undangan digital, starts 778.9 below the dashed line.
  geser: [0, 1].map((i) => { const [n, , pal] = TPL[i], x = 20 + i * 268, t = CT + 4;
    return pic(x, t, 252, 315, pal) + h(x, t + 334, n, 20) + para(x, t + 356, NOTES.geser[i], { size: 14, fill: LP.muted, lh: 20.3 }) + demoLink(x, t + 391.8) +
      lpBtn(x + 92, t + 392.6, "Pilih", { small: true, w: 71 }); }).join("") + dash(20, 778.9, 350),
  mozaik: `<defs><linearGradient id="mzfade" x1="0" y1="1" x2="0" y2="0"><stop offset="${(79 / 135).toFixed(3)}" stop-color="rgb(20,12,8)" stop-opacity=".88"/><stop offset="1" stop-color="rgb(20,12,8)" stop-opacity="0"/></linearGradient></defs>` +
    [[TPL[0], 20, CT, 450], [TPL[1], 200, CT, 220], [TPL[2], 200, CT + 230, 220], [TPL[3], 200, CT + 460, 450], [GEMOY, 20, CT + 460, 220]].map(([[n, , pal], x, y, hh]) => { const b = y + hh;
      return rclip(x, y, 170, hh, 14, pageSketch(x, y, 170, hh, pal), rect(x, b - 135, 170, 135, { fill: "url(#mzfade)" })) + rect(x + 0.75, y + 0.75, 168.5, hh - 1.5, { r: 14, stroke: LP.cocoa, sw: 1.5 }) +
        rect(x + 10, y + 11, 84, 24, { r: 12, fill: "rgba(20,12,8,.3)" }) + rect(x + 10, y + 10, 84, 24, { r: 12, fill: LP.paper }) + text(x + 52, y + 27, "Lihat demo", { size: 12, weight: 800, fill: LP.cocoa, anchor: "middle" }) +
        h(x + 12, b - 64, n, 18, { fill: LP.paper }) + rect(x + 12, b - 50, 59, 38, { r: 15, fill: LP.paper }) + text(x + 41.5, b - 25.5, "Pilih", { size: 15, weight: 700, fill: LP.cocoa, anchor: "middle" }); }).join("")
};
// Pilihan tema Adat (page y): the first four adat designs; Tradisional Elegan's name takes two lines, so its row is taller.
const ADAT = [[["Tradisional", "Elegan"], ["Hitam & emas, bingkai", "lengkung, judul huruf…"], ["#1f1c1a", "#ecbb6c"]], [["Kencana"], ["Krem & merah bata,", "wayang golek berwarna…"], ["#fff7e9", "#8e2818"]],
  [["Kembang Joyo"], ["Kertas cokelat muda,", "bingkai lengkung dan…"], ["#d8c9ae", "#18150f"]], [["Lado Mudo"], ["Krem merah muda &", "marun, pita ulos dan…"], ["#fffaf0", "#520000"]]];
const adatView = body(rect(0, LPY.chips - 4, 390, KAT + 844 - LPY.chips + 4, { fill: LP.paper }), chipRow(0, LPY.chips, "Adat"),
  ADAT.map(([names, note, pal], i) => gridItem(20 + (i % 2) * 182, LPY.grid + (i > 1 ? 380.6 : 0), names, note, pal, i > 1 ? 287.6 : 310.6)).join(""));
const PKG_Y = LPY.pkg1 - 40, FORM_Y = LPY.card - 20;

// form-klien: the #pesan section from its top; the phone shows it from FY0.
const FK = { card: LPY.card - LPY.pesan };
const fkHead = body(rect(0, 0, 390, FK.card, { fill: LP.paper }) + dash(20, 0, 350) + h(20, 88, "Isi data pesanan", 32) +
  para(20, 123.6, ["Data langsung terkirim ke Rina WO. Yang", "belum siap boleh dikosongkan dan dilengkapi", "lewat WhatsApp."], { size: 17, fill: LP.muted, lh: 26.3 }));
const K1 = formTail(0, FK.card, { ...PESANAN, picked: ["Pilihan kalian: Paket Basic, desain", "Dasar"], desain: "Dasar", paket: "Basic" });
const K2 = formTail(0, FK.card, PEMESAN);
const K2e = formTail(0, FK.card, { ...PEMESAN, bad: true, status: "Nama wajib diisi." });
const K10 = formTail(0, FK.card, CATATAN);
const KD = formTail(0, FK.card, { done: true });
const qr = K1.pos.picks[4];
const qrChk = body(rect(qr[0] + 0.5, qr[1] + 0.5, 306, qr[2] - 1, { r: 8, stroke: LP.cocoa }) + rect(qr[0] + 14, qr[1] + qr[2] / 2 - 10, 20, 20, { r: 3, fill: LP.cocoa }) +
  iconX("check", qr[0] + 24, qr[1] + qr[2] / 2, 15, LP.paper, 3));
const [nameY, waY] = K2.pos.fields;
const sheet = (...k) => rect(0, 0, 390, 844, { fill: LP.paper }) + scr(FY0, ...k);
const FY0 = FK.card - 20, FDY = Math.max(0, K1.pos.next + 52 + 40 - 844 - FY0);
const lpRing = (y, stroke) => rect(40, y - 1.5, 310, 51, { r: 9.5, stroke, sw: 3 });
const lpFocus = (y) => body(rect(42, y + 1.5, 304, 45, { r: 7, fill: LP.paper }) + rect(42.25, y + 0.75, 305.5, 46.5, { r: 8, stroke: LP.cocoa, sw: 1.5 }) + lpRing(y, "rgba(184,70,13,.28)"));

// Pesanan masuk: Tempel data pesanan open (OrderPaste), Link form klien open, one order deleted.
const pasteOpen = (filled) => rect(16, 315, 366, 300, { fill: C.white }) + rect(16.5, 319.5, 365, 214, { r: 4, fill: C.white, stroke: filled ? C.line : C.line }) +
  icon("chevron-down", 38, 344, 18, C.strong) + text(59, 349, "Tempel data pesanan", { size: 14, weight: 500 }) +
  rect(28.5, 381.5, 341, 95, { r: 4, fill: C.white, stroke: filled ? C.primary : C.field, sw: filled ? 2 : 1 }) +
  (filled ? para(38, 401, ["Desain: Dasar", " ", "*Pemesan*", "Nama: Rani Kusuma"], { size: 14, fill: C.strong, lh: 20 })
    : para(38, 401, ["Tempel pesan WhatsApp dari form data", "undangan"], { size: 14, fill: C.faint, lh: 20 })) +
  group({ opacity: filled ? 1 : 0.5 }, nkBtn(28, 488, "Isi undangan")) + boxRow(545, "Link form klien (opsional)");
const WA_MSG = ["*Pemesan*", "Nama: Rani Kusuma", "WhatsApp: 0812 3456 7890", " ", "Data untuk mengisi undangan otomatis", "(jangan diubah):", '#data-undangan {"v":1, ...}'];
const waBubble = rect(0, 92, 400, 808, { fill: "rgba(15,22,30,.42)" }) + shadow(24, 300, 352, 200, 10, 2) + rect(24, 300, 352, 200, { r: 10, fill: C.waSoft }) +
  para(40, 326, WA_MSG, { size: 14, fill: C.waText, lh: 24 }) + text(362, 488, "10.20", { size: 11, fill: C.waSub, anchor: "end" });
const LINK = "https://nikahin.myscalev.com/order?k=AB12CD34";
const linkOpen = rect(16.5, 377.5, 365, 201, { r: 4, fill: C.white, stroke: C.line }) + icon("chevron-down", 38, 402, 18, C.strong) + text(59, 407, "Link form klien (opsional)", { size: 14, weight: 500 }) +
  para(28, 447, ["Kirim ke klien bila ingin mereka mengisi sendiri.", "Isian mereka muncul di daftar ini."], { size: 12, fill: C.faint, lh: 16 }) +
  rect(28, 476, 341, 52, { r: 4, fill: C.mutedBg }) + text(38, 498, "https://nikahin.myscalev.com/order?", { size: 12, mono: true }) + text(38, 516, "k=AB12CD34", { size: 12, mono: true });
const salinBtn = nkBtn(28, 534, "Salin link form", { variant: "quiet", icon: "copy" });
const SALIN_W = tw("Salin link form", 12, 500) + 44;
// Hapus: the trash becomes a red Hapus? button (nk-btn--danger) and the badge moves left of it.
const HAPUS_W = tw("Hapus?", 12, 500) + 24, HAPUS_X = 375 - HAPUS_W;
const hapusRow = rect(17, ROW2 + 1, 364, 55, { fill: C.primarySoft }) + text(28, ROW2 + 26, ROW_B[0], { size: 14, weight: 600 }) + text(28, ROW2 + 42, ROW_B[1], { size: 10, fill: C.text }) +
  badgeAt(HAPUS_X - 8, ROW2 + 19, "Sudah diisi", "ok");
const hapusBtn = nkBtn(HAPUS_X, ROW2 + 10, "Hapus?", { variant: "danger", w: HAPUS_W });
const afterDelete = rect(16, 186, 366, 400, { fill: C.white }) + rect(16.5, 189.5, 365, 56, { r: 4, fill: C.white, stroke: C.line }) + orderRow(ROW1, ...ROW_A, badgeAt(331, ROW1 + 19, "Baru", "todo")) +
  boxRow(262, "Tempel data pesanan") + boxRow(320, "Link form klien (opsional)");

// Marketing card install (Dashboard pasangan / Landing page): dialog + Pasang.
const CARD_X = { dashboard: 88, landing: 234 }, CARD_AT = { dashboard: [155, 360], landing: [301, 360] };
const veil = rect(0, 0, 1440, 900, { fill: "rgba(255,255,255,.92)" });
const DLG = [540, 383, 360, 134];
const pasangDlg = (name) => shadow(...DLG, 8, 3) + rect(...DLG, { r: 8, fill: C.white }) +
  text(560, 418, `Pasang ${name} di halaman ini?`, { size: 14, weight: 600 }) + nkHint(560, 442, "Seluruh isi halaman diganti. Bisa diurungkan.") + nkBtn(745, 461, "Batal", { variant: "quiet", w: 63 });
const pasangBtn = nkBtn(816, 461, "Pasang", { w: 64 });
const DLG_O = [720, 450];

// Shared step parts: the NikahKit tab, Kategori > Marketing, the panel toast, Simpan & Terbitkan.
const NK_TAB = M(224, 52, 92, 32), MARKETING = M(227.5, 169, 139.5, 38);
const tabStep = (caption, dur = 2.8) => ({ caption, dur, focus: [F.tabs, F.left], mark: NK_TAB, lens: { src: [100, 46, 222, 46] } });
const toastBox = (lines) => { const hh = Math.max(52, lines.length * 18 + 20); return [84, 888 - hh, 302, hh]; };
const pubStep = (caption) => ({ caption, at: PUB, click: true, focus: F.top, mark: M(...PUB_BOX), lens: { src: [1180, 44, 260, 50] }, dur: 3.4 });

// ---- Scenes ------------------------------------------------------------------------------------------------------
const kontenPanel = nkHead(0, 0, "Konten") + kontenBody;
const kontenEd = (page, inv) => [...shell({ page, rail: "Konten" }), kontenPanel, invite(inv)];
const DATA_TOAST = ["Data pesanan dimasukkan.", "Foto tetap; ganti foto", "contoh bila masih ada."];
const filled = (o = {}) => ({ konten: { svg: nkRail(0, 0, "Konten") + nkHead(0, 0, "Konten") + bodyBg + kontenBody + invite(RANI), enter: "fade" },
  t1: { svg: nkToast(DATA_TOAST), enter: "slide", delay: o.toast ?? 0.3 } });
// Urungkan in a toast (right-aligned bold link).
const undoMark = (lines) => { const [, y, , hh] = toastBox(lines), w = tw("Urungkan", 14, 700); return M(374 - w - 4, y + hh / 2 - 11, w + 8, 22); };
// Install one Marketing card on a blank HTML Mode page (pasang-dashboard-pasangan, landing-page), one scene per group
// of steps: the panel up to the card click, the dialog and Pasang, then the toast and the Dipakai badge.
function pasangScenes(kind, title, page, after, resLens, result, toast, caps) {
  const name = MK[kind][0], slug = `jualan-pasang-${kind}`, cx = CARD_X[kind];
  const donePanel = bodyBg + bodyClip(kindSeg("marketing"), brandClosed(219), mkCards(MKY, kind));
  const bw = tw("Dipakai", 10, 500) + 12, bx = cx + 134 - bw; // mkCard's wrapped-name badge
  const blank = shell({ page, rail: "Template", screenFill: C.white });
  return {
    [slug]: {
      title,
      base: [...blank, tplPanel({ head: { inbox: false } })],
      els: { mk: { svg: mkPanel(), enter: "fade" }, veil: { svg: veil + pasangDlg(name) + pasangBtn, enter: "fade" } },
      steps: [
        tabStep(caps[0], 3),
        { caption: caps[1], at: SEG.marketing, click: true, show: ["mk"], focus: F.panel, mark: MARKETING, lens: { src: [80, 161, 295, 54] }, dur: 3.2 },
        { caption: `Klik kartu ${name}. Layar meredup: dialog konfirmasi muncul.`, at: CARD_AT[kind], click: true, show: ["veil"], mark: M(cx, MKY, 134, 167, 8),
          lens: { src: [548, 396, 344, 56] }, dur: 3.6 }
      ]
    },
    [`${slug}-dialog`]: {
      title: `Dialog Pasang ${name}`,
      base: [...blank, mkPanel()],
      els: { dlg: { svg: veil + pasangDlg(name), enter: "pop", origin: DLG_O }, pasang: { svg: pasangBtn, enter: "pop", origin: DLG_O },
        done: { svg: after + donePanel, enter: "fade" } },
      steps: [
        { caption: `Muncul dialog Pasang ${name} di halaman ini?`, show: ["dlg", "pasang"], focus: DLG, mark: M(...DLG, 8), lens: { src: [548, 396, 344, 56] }, dur: 3.2 },
        { caption: `Klik Pasang. ${result}`, at: [848, 479], click: true, press: "pasang", hide: ["dlg", "pasang"], show: ["done"], focus: F.preview, mark: M(816, 461, 64, 36),
          lens: resLens, dur: 3.8 }
      ]
    },
    [`${slug}-hasil`]: {
      title: `${name} dipasang`,
      base: [...blank, after, nkHead(0, 0, "Template", { inbox: false }), donePanel],
      els: { t1: { svg: nkToast(toast), enter: "slide", delay: 0.3 } },
      steps: [
        { caption: `Muncul pesan: ${toast.join(" ")}`, show: ["t1"], focus: F.panel, mark: M(...toastBox(toast)), lens: { src: [84, 820, 302, 72] }, dur: 3.4 },
        { caption: `Kartu ${name} kini berlabel Dipakai.`, mark: M(bx, MKY + 185, bw, 18, 9), lens: { src: [84, MKY + 170, 294, 80] }, dur: 3 }
      ]
    }
  };
}
// The publish step of a page: the preview first (what to check), then Simpan & Terbitkan in the toolbar.
function pubScene(title, page, rail, panel, preview, cap, first, before) {
  return {
    title,
    base: [...shell({ page, rail }), panel, before ?? preview],
    els: before ? { nw: { svg: preview, enter: "fade", delay: 0.6 } } : {},
    steps: [{ caption: cap[0], show: before ? ["nw"] : [], focus: F.preview, ...first, dur: 3.2 }, pubStep(cap[1])]
  };
}
const tplDone = (kind) => nkHead(0, 0, "Template", { inbox: false }) + bodyBg + bodyClip(kindSeg("marketing"), brandClosed(219), mkCards(MKY, kind));
// The landing header in the preview (logo, business name, Pesan) and the gate card of the couple dashboard.
const LAND_HEAD = { mark: M(727, 106, 390, 74, 0), lens: { src: [727, 106, 390, 74], zoom: 1.6 } };
const landPreview = (n) => clipped(727, 106, 390, 784, landingTop(727, 106, n));
// Perbarui halaman ini on an installed Marketing page (store.outdated, .nk-reset under Profil merek): "Versi baru halaman
// tersedia." when the extension carries a newer page (wins), else "Profil merek berubah." (Landing page only).
const resetText = (lines) => para(99, 298, lines, { size: 12, fill: C.strong, lh: 16 });
const RESET = M(88, 277, 279, 50), RESET_LENS = { src: [80, 272, 295, 62] };
function perbaruiScene(kind, title, page, before, after, toast, steps) {
  return {
    title,
    base: [...shell({ page, rail: "Template" }), before, nkHead(0, 0, "Template", { inbox: false }), bodyBg,
      bodyClip(kindSeg("marketing"), brandClosed(219), rect(88.5, 277.5, 278, 49, { r: 4, fill: C.warnSoft, stroke: "#fde7c7" }),
        resetText(["Versi baru halaman", "tersedia."]), mkCards(339, kind))],
    els: {
      perbarui: nkBtn(216, 286, "Perbarui halaman ini", { variant: "quiet", h: 32, w: 140 }),
      ...(kind === "landing" ? { brandT: { svg: rect(89, 278, 124, 48, { fill: C.warnSoft }) + resetText(["Profil merek", "berubah."]), enter: "fade" } } : {}),
      after: { svg: bodyBg + bodyClip(kindSeg("marketing"), brandClosed(219), mkCards(MKY, kind)) + after, enter: "fade", delay: 0.1 },
      t1: { svg: nkToast(toast), enter: "slide", delay: 0.25 }
    },
    steps: [
      { ...steps[0], focus: F.panel, mark: MARKETING, lens: { src: [80, 161, 295, 113] } },
      ...steps.slice(1).map((s) => ({ ...s, mark: RESET, lens: RESET_LENS })),
      { caption: "Klik Perbarui halaman ini. Halaman langsung dipasang ulang.", at: [286, 302], click: true, press: "perbarui", hide: kind === "landing" ? ["brandT"] : [],
        show: ["after", "t1"], focus: [F.panel, F.preview], mark: M(216, 286, 140, 32), lens: { src: [84, 820, 302, 72] }, dur: 3.8 }
    ]
  };
}

// Phone scenes: positions of the Landing page and form in phone px.
const LIHAT_BOX = [20, LIHAT_DEMO[1] - 11, 88, 22]; // the Lihat demo link of the first design (Dasar)
const PICKED = F1.pos.picked - FORM_Y; // the Pilihan kalian box on the form, under the scrolled view
const PKG_BTN = (i) => [45, LPY.pkg1 + i * 311.1 + 218.1 - PKG_Y, 300, 52];
const CHIP_BOX = (label) => { const [, , x, w] = CHIPS.find((c) => c[0] === label); return [x, CHIP_Y, w, 44]; };
// Form card positions on the phone (page y minus FY0).
const fy = (v) => v - FY0;
const fieldBox = (y) => [41.5, fy(y), 307, 48];
const btnBox = (y) => [41.5, fy(y), 307, 52];

export const scenes = {
  // ---------------------------------------------------------------- alur-dengan-klien
  "jualan-alur": {
    title: "Alur jualan undangan dari klien sampai hari-H",
    bg: C.tint,
    base: [rect(0, 0, 1440, 900, { fill: C.tint }), text(720, 52, "Alur kerja vendor dengan NikahKit", { size: 34, weight: 700, fill: C.ink, anchor: "middle" })],
    els: Object.fromEntries(FLOW.flatMap((_, i) => [[`c${i}`, { svg: flowCard(i), enter: "pop", origin: [flowPos(i)[0] + FW / 2, flowPos(i)[1] + FH / 2] }],
      ...(i < FLOW.length - 1 ? [[`a${i}`, { svg: flowArrow(i), enter: "fade" }]] : [])])),
    steps: [
      { caption: "Klien membuka Landing page kamu, lalu mengisi form data undangan.", show: ["c0", "a0", "c1"], focus: "all", dur: 3.4 },
      { caption: "Sepakati pembayaran, lalu buat halaman undangan baru di Scalev.", show: ["a1", "c2", "a2", "c3"], dur: 3.6 },
      { caption: "Klik nama klien di Pesanan masuk, ganti foto, lalu terbitkan.", show: ["a3", "c4", "a4", "c5", "a5", "c6"], dur: 4.2 },
      { caption: "Kirim PIN dan pesan; pengantin mengirim undangan ke tamu.", show: ["a6", "c7", "a7", "c8"], dur: 3.6 },
      { caption: "Hari-H check-in. Setelah acara, pengantin bisa Buka untuk semua.", show: ["a8", "c9", "a9", "c10"], dur: 3.6 },
      { caption: "Itu seluruh alurnya: empat peran, sebelas langkah.", dur: 3.2 }
    ]
  },

  // ---------------------------------------------------------------- profil-merek
  "jualan-profil-merek": {
    title: "Mengisi Profil merek di Template > Marketing",
    base: kontenEd("Undangan Rani & Dimas", SAMPLE),
    // Every element is a state of the screen (skel): skeleton outside the step's focus, in the order they stack.
    els: Object.fromEntries(Object.entries({
      rail: { svg: nkRail(0, 0, "Template"), enter: "fade" },
      tpl: { svg: tplPanel(), enter: "fade" },
      mk: { svg: bodyBg + bodyClip(kindSeg("marketing"), brandOpen()), enter: "fade" },
      nameFocus: { svg: nkInput(101, 300, 253, "", { focus: true }), enter: "fade" },
      nameBlur: { svg: nkInput(101, 300, 253, ""), enter: "fade" },
      nameV: text(111, 323, "Rina WO", { size: 14 }),
      waFocus: { svg: nkInput(101, 368, 253, "", { focus: true }), enter: "fade" },
      waV: text(111, 391, "0812 3456 7890", { size: 14 }),
      body2: { svg: rect(72, 153, 327, 1200, { fill: C.white }) + kindSeg("marketing") + brandOpen({ name: "Rina WO", wa: "0812 3456 7890" }), enter: "fade" },
      pkFocus: { svg: nkInput(111, 668 - SCROLL, 233, "", { focus: true }), enter: "fade" },
      pkBlur: { svg: nkInput(111, 668 - SCROLL, 233, ""), enter: "fade" },
      pkName: text(121, 691 - SCROLL, "Basic", { size: 14 }),
      prFocus: { svg: nkInput(111, 736 - SCROLL, 233, "", { focus: true }), enter: "fade" },
      pkPrice: text(121, 759 - SCROLL, "150.000", { size: 14 }),
      prBlur: { svg: nkInput(111, 736 - SCROLL, 233, "") + text(121, 759 - SCROLL, "150.000", { size: 14 }), enter: "fade" },
      selFocus: { svg: nkInput(101, GAYA_Y - SCROLL, 253, "Grid", { select: true, focus: true }), enter: "fade" },
      menu: { svg: styleMenu, enter: "fade" },
      selV: { svg: nkInput(101, GAYA_Y - SCROLL, 253, "Kartu besar", { select: true, focus: true }), enter: "fade" },
      done: { svg: bodyBg + bodyClip(kindSeg("marketing"), brandClosed(BOX), mkCards(MKY)), enter: "fade", delay: 0.15 },
      cover: { svg: cover({ page: "Undangan Rani & Dimas", rail: "Template" }, "Template"), enter: "fade" }
    }).map(([id, e]) => [id, { ...(typeof e === "string" ? { svg: e } : e), skel: true }])),
    steps: [
      tabStep("Di editor halaman, buka tab NikahKit.", 2.6),
      { caption: "Klik Template di rel kiri.", at: [36, 130], click: true, show: ["rail", "tpl"], focus: F.left, mark: M(0, 104, 71, 52, 0), lens: { src: [0, 96, 220, 64] }, dur: 3 },
      { caption: "Di Kategori, klik Marketing. Kotak Profil merek terbuka: Belum diisi.", at: SEG.marketing, click: true, show: ["mk"], focus: F.panel, mark: MARKETING,
        lens: { src: [80, 161, 295, 54] }, dur: 3.4 },
      { caption: "Klik Nama bisnis, lalu ketik nama bisnismu.", at: [228, 318], click: true, show: ["nameFocus", "nameV"], type: [{ id: "nameV", n: 7, box: [111, 303, 70, 30] }],
        mark: M(101, 300, 253, 36), lens: { src: [92, 276, 282, 68] }, dur: 3.2 },
      { caption: "Klik Nomor WhatsApp, lalu ketik nomornya, misalnya 0812 3456 7890.", at: [228, 386], click: true, show: ["nameBlur", "waFocus", "waV"],
        type: [{ id: "waV", n: 14, box: [111, 371, 110, 30] }], mark: M(101, 368, 253, 36), lens: { src: [92, 344, 282, 100] }, dur: 3.4 },
      { caption: "Logo (opsional): tempel alamat gambar https, atau kosongkan.", mark: M(101, 452, 253, 94, 6), lens: { src: [92, 446, 282, 106] }, dur: 3 },
      { caption: "Gulir ke paket pertama, lalu isi Nama paket.", at: [228, 686 - SCROLL], click: true, show: ["body2", "cover", "pkFocus", "pkName"],
        hide: ["nameFocus", "nameBlur", "nameV", "waFocus", "waV"], scroll: { id: "body2", dy: SCROLL }, type: [{ id: "pkName", n: 5, box: [121, 671 - SCROLL, 36, 30] }],
        mark: M(111, 668 - SCROLL, 233, 36), lens: { src: [96, 196, 268, 92] }, dur: 3.6 },
      { caption: "Isi Harga (Rp) dan Isi paket. Tambah paket untuk paket kedua dan ketiga.", at: [228, 754 - SCROLL], click: true, show: ["pkBlur", "prFocus", "pkPrice"],
        type: [{ id: "pkPrice", n: 7, box: [121, 739 - SCROLL, 50, 30] }], mark: [M(111, 736 - SCROLL, 233, 36), M(101, 1005 - SCROLL, 253, 36)],
        lens: { src: [96, 286, 268, 74] }, dur: 3.6 },
      { caption: "Klik Gaya katalog: Grid, Daftar, Kartu besar, Geser, atau Mozaik.", at: [228, GAYA_Y - SCROLL + 18], click: true, hide: ["prFocus"], show: ["prBlur", "selFocus", "menu"],
        mark: M(101, GAYA_Y - SCROLL, 253, 36), lens: { src: [96, GAYA_Y - SCROLL - 20, 268, 236] }, dur: 3.4 },
      { caption: "Pilih gayanya, misalnya Kartu besar. Bawaannya Grid.", at: [180, menuItemY(2) + 16], click: true, hide: ["menu", "selFocus"], show: ["selV"],
        mark: M(105, menuItemY(2), 245, 32), lens: { src: [96, GAYA_Y - SCROLL - 20, 268, 236] }, dur: 3 },
      { caption: "Klik Simpan profil. Kotak menutup dengan label Terisi.", at: [156, SIMPAN_Y + 18 - SCROLL], click: true, show: ["done"],
        mark: M(...nkBtnBox(101, SIMPAN_Y - SCROLL, "Simpan profil", { w: 110 })), lens: { src: [84, 210, 290, 68] }, dur: 3.4 }
    ]
  },

  // ---------------------------------------------------------------- pasang-dashboard-pasangan
  ...pasangScenes("dashboard", "Memasang Dashboard pasangan di halaman Scalev sendiri", "Dashboard Rina WO", dashPreview, { src: [737, 320, 370, 204], zoom: 1.4 },
    "Pratinjau berubah menjadi Kelola undangan.",
    ["Dashboard pasangan dipasang.", "Tekan Simpan di Scalev."],
    ["Halaman HTML Mode baru yang kosong: tab NikahKit menampilkan Template.", "Di Kategori, klik Marketing."]),
  "jualan-pasang-dashboard-terbit": pubScene("Menerbitkan halaman Dashboard pasangan", "Dashboard Rina WO", "Template", tplDone("dashboard"), dashPreview,
    ["Pratinjau sudah Kelola undangan. Tinggal diterbitkan.", "Klik Simpan & Terbitkan. Alamat halaman ini jadi alamat Dashboard."],
    { mark: M(743, 326, 358, 303, 24), lens: { src: [737, 320, 370, 204], zoom: 1.4 } }),

  // Bagikan in an invitation after the dashboard is installed.
  "jualan-bagikan-pengantin": {
    title: "Tombol Untuk pengantin di Bagikan",
    base: kontenEd("Undangan Rani & Dimas", RANI),
    els: {
      share: { svg: shareDlg, enter: "fade" },
      buka: { svg: bukaDash, enter: "fade" },
      // Kelola undangan in a new Chrome tab: the 390 column of the dashboard centred on a 1440 window.
      tab: { svg: chrome(0, 0, 1440, 900, { tabs: [{ title: "Landing Page Studio", fav: favScalev, w: 180 }, { title: "Kelola undangan", active: true, w: 160 }], url: "tokomu.myscalev.com/kelola?w=…" }) +
        rect(0, 85, 1440, 815, { fill: "#f5f4f2" }) + gate(525, 300), enter: "fade" }
    },
    steps: [
      tabStep("Buka undangan klien di editor, tab NikahKit."),
      { caption: "Klik Bagikan di rel kiri.", at: ED.tool.Bagikan, click: true, show: ["share", "buka"], focus: F.left, mark: M(6, 566, 60, 46), note: "Bagikan", dur: 3.2 },
      { caption: "Untuk pengantin: Kirim undangan dan Buka Dashboard.", mark: M(16, 615, 366, 80), lens: { src: [12, 588, 374, 136] }, dur: 3.4 },
      { caption: "Buka Check-in muncul bila Undangan khusus dan QR masuk menyala.", mark: M(16, 468, 366, 106), lens: { src: [12, 464, 374, 114] }, dur: 3.8 },
      { caption: "Klik Buka Dashboard: Kelola undangan terbuka di tab baru.", at: [199, 677], click: true, press: "buka", show: ["tab"], mark: M(16, 659, 366, 36),
        note: "Buka Dashboard", dur: 3.4 },
      { caption: "Pengantin masuk dengan PIN dashboard.", focus: "none", mark: M(561, 448, 318, 44, 8), lens: { src: [541, 300, 358, 250], zoom: 1.4, at: [12, 180] }, dur: 3 }
    ]
  },

  // ---------------------------------------------------------------- landing-page
  ...pasangScenes("landing", "Memasang Landing page di halaman Scalev sendiri", "Landing Rina WO", landPreview("Rina WO"), LAND_HEAD.lens,
    "Pratinjau berubah menjadi Landing page.", ["Landing page dipasang. Tekan", "Simpan di Scalev."],
    ["Halaman HTML Mode baru yang kosong: tab NikahKit menampilkan Template.", "Klik Marketing. Profil merek harus berlabel Terisi."]),
  "jualan-pasang-landing-terbit": pubScene("Menerbitkan Landing page", "Landing Rina WO", "Template", tplDone("landing"), landPreview("Rina WO"),
    ["Pratinjau sudah Landing page dengan nama bisnismu.", "Klik Simpan & Terbitkan, lalu buka alamat publiknya dari HP."], LAND_HEAD),

  "jualan-landing-page": {
    title: "Isi Landing page member di HP klien",
    base: phBase(LAND, F0.svg),
    els: {
      v1: { svg: ph(scr(KAT, LAND, F0.svg)), enter: "fade", delay: 0.1 },
      dlg: { svg: ph(demoView), enter: "pop", origin: Q(...LIHAT_DEMO) },
      pick: { svg: ph(demoPick), enter: "pop", origin: Q(...LIHAT_DEMO) },
      f1: { svg: ph(scr(FORM_Y, LAND, F1.svg)), enter: "fade", delay: 0.2 },
      vPkg: { svg: ph(scr(PKG_Y, LAND, F1.svg)), enter: "fade" },
      p2: ph(scr(PKG_Y, body(lpBtn(45, LPY.pkg1 + 218.1, "Pilih paket ini", { solid: true, w: 300 })))),
      f2: { svg: ph(scr(FORM_Y, LAND, F2.svg)), enter: "fade", delay: 0.3 }
    },
    steps: [
      { caption: "Pembuka: nama bisnismu, Pesan undangan, dan Lihat desain.", focus: PHF,
        mark: [QM(20, LPY.cta, 178.8, 52, 20), QM(210.8, LPY.cta, 143.6, 52, 20)], lens: lensBy(QR(0, LPY.cta - 8, 390, 68), "l", 1.2), dur: 3.2 },
      { caption: "Klik Lihat desain: halaman turun ke katalog Pilih desain undangan.", at: Q(283, LPY.cta + 26), click: true, show: ["v1"],
        mark: QM(210.8, LPY.cta, 143.6, 52, 20), dur: 3.2 },
      { caption: "Di katalog, klien menekan Lihat demo.", at: Q(...LIHAT_DEMO), click: true, show: ["dlg", "pick"], mark: QM(...LIHAT_BOX),
        lens: lensBy(QR(12, LIHAT_DEMO[1] - 98, 370, 138), "l", 1.2), dur: 3.4 },
      { caption: "Undangan contoh tampil satu layar. Klik Pakai desain ini.", at: Q(...DEMO_PICK), click: true, press: "pick", hide: ["dlg", "pick", "v1"], show: ["f1"],
        mark: QM(181, 8, 147, 46, 20), lens: lensBy(QR(36, PICKED - 8, 318, 62), "l", 1.4), dur: 3.4 },
      { caption: "Form menulis Pilihan kalian: desain Dasar.", mark: QM(41.5, PICKED, 307, 45.25, 8), lens: lensBy(QR(36, PICKED - 8, 318, 62), "l", 1.4), dur: 2.6 },
      { caption: "Di Paket dan harga, setiap paket punya Pilih paket ini.", hide: ["f1"], show: ["vPkg", "p2"], mark: [QM(...PKG_BTN(0), 20), QM(...PKG_BTN(1), 20)],
        lens: lensBy(QR(14, 34, 362, 306), "l", 1.2), dur: 2.8 },
      { caption: "Pilih paket ini: form mencatat Paket Basic, desain Dasar.", at: Q(195, PKG_BTN(0)[1] + 26), click: true, press: "p2", show: ["f2"], mark: QM(...PKG_BTN(0), 20),
        lens: lensBy(QR(36, PICKED - 12, 320, 94), "r", 1.4), dur: 3.8 }
    ]
  },

  "jualan-landing-tema": {
    title: "Pilihan tema di katalog Landing page",
    base: phBase(scr(KAT, LAND, F0.svg)),
    els: { adat: { svg: ph(scr(KAT, adatView)), enter: "fade", delay: 0.1 } },
    steps: [
      { caption: "Di atas katalog ada tombol tema: Semua dan tiap kategori, dengan jumlahnya.", focus: PHF, mark: QM(18, CHIP_Y - 2, 372, 48, 24),
        lens: lensBy(QR(14, CHIP_Y - 8, 212, 60), "l"), dur: 3.8 },
      { caption: "Klik Adat: katalog hanya menampilkan desain adat.", at: Q(chipX("Adat"), CHIP_Y + 22), click: true, show: ["adat"], mark: QM(...CHIP_BOX("Adat"), 22),
        lens: lensBy(QR(12, CT + 212, 370, 71), "l", 1.2), dur: 3.6 },
      { caption: "Klik Semua untuk menampilkan lagi seluruh desain.", at: Q(chipX("Semua"), CHIP_Y + 22), click: true, hide: ["adat"], mark: QM(...CHIP_BOX("Semua"), 22),
        lens: lensBy(QR(12, CT + 212, 370, 71), "r", 1.2), dur: 3.2 }
    ]
  },

  "jualan-landing-demo": {
    title: "Demo desain di Landing page dan tautannya",
    base: phBase(urlBar(ADDR), inBrowser(scr(KAT, LAND, F0.svg))),
    els: {
      demo: { svg: ph(inBrowser(demoView)), enter: "pop", origin: Q(LIHAT_DEMO[0], LIHAT_DEMO[1] + 56) },
      pick: { svg: ph(inBrowser(demoPick)), enter: "pop", origin: Q(LIHAT_DEMO[0], LIHAT_DEMO[1] + 56) },
      url: { svg: ph(urlBar(`${ADDR}?demo=dasar`)), enter: "fade" },
      f1: { svg: ph(urlBar(ADDR), inBrowser(scr(FORM_Y, LAND, F1.svg))), enter: "fade", delay: 0.2 }
    },
    steps: [
      { caption: "Di Pilih desain undangan, klien menekan Lihat demo.", at: Q(LIHAT_DEMO[0], LIHAT_DEMO[1] + 56), click: true, show: ["demo", "pick", "url"], focus: PHF,
        mark: QM(LIHAT_BOX[0], LIHAT_BOX[1] + 56, LIHAT_BOX[2], LIHAT_BOX[3]), lens: lensBy(QR(12, LIHAT_DEMO[1] - 42, 370, 138), "l", 1.2), dur: 3.4 },
      { caption: "Undangan contoh desain itu terbuka satu layar penuh.", mark: QM(0, 56, 390, 63, 0), lens: lensBy(QR(0, 56, 390, 63), "l", 1.2), dur: 2.8 },
      { caption: "Alamatnya mendapat ?demo=dasar. Bagikan tautan ini ke klien.", mark: QM(12, 8, 366, 40, 20), lens: lensBy(QR(4, 2, 382, 52), "l", 1.2), dur: 3.6 },
      { caption: "Tombol silang, Esc, atau tombol kembali menutup demo.", mark: QM(DEMO_X[0] - 22, DEMO_X[1] + 56 - 22, 44, 44, 22), lens: lensBy(QR(150, 56, 240, 63), "r"), dur: 3.4 },
      { caption: "Pakai desain ini: form menulis Pilihan kalian: desain Dasar.", at: Q(DEMO_PICK[0], DEMO_PICK[1] + 56), click: true, press: "pick",
        hide: ["demo", "pick", "url"], show: ["f1"], mark: QM(181, 64, 147, 46, 20), lens: lensBy(QR(36, PICKED + 48, 318, 62), "r", 1.4), dur: 3.8 }
    ]
  },

  "jualan-gaya-katalog": {
    title: "Lima Gaya katalog di Landing page",
    base: phBase(body(catHead)),
    els: Object.fromEntries(Object.entries(CAT_STYLE).map(([k, svg]) => [k, { svg: ph(body(rect(0, CHIP_Y + 52, 390, 844 - CHIP_Y - 52, { fill: LP.paper }), svg)), enter: "fade" }])),
    steps: [
      { caption: "Grid (bawaan): dua desain sejajar, Lihat demo dan Pilih di bawahnya.", show: ["grid"], focus: PHF, lens: lensBy(QR(16, CT + 212, 176, 134), "l"), dur: 3.4 },
      { caption: "Daftar: gambar kecil di kiri, nama dan catatan di kanan.", hide: ["grid"], show: ["daftar"], lens: lensBy(QR(14, CT + 10, 372, 140), "r", 1.2), dur: 3.2 },
      { caption: "Kartu besar: satu kartu selebar layar, tombol Pilih berwarna.", hide: ["daftar"], show: ["kartu"], lens: lensBy(QR(30, CT + 274, 340, 154), "l", 1.4), dur: 3.2 },
      { caption: "Geser: satu baris desain yang digeser ke samping.", hide: ["kartu"], show: ["geser"], lens: lensBy(QR(16, CT + 321, 260, 127), "l", 1.8), dur: 3.2 },
      { caption: "Mozaik: kolase gambar. Ketuk gambar untuk membuka demo.", hide: ["geser"], show: ["mozaik"], lens: lensBy(QR(196, CT - 4, 178, 228), "r"), dur: 3.4 }
    ]
  },

  "jualan-perbarui-landing": perbaruiScene("landing", "Memperbarui Landing page yang terpasang", "Landing Rina WO", landPreview("Rina Undangan"), landPreview("Rina WO"),
    ["Landing page dipasang. Tekan", "Simpan di Scalev."], [
      { caption: "Buka halaman Landing page kamu: NikahKit > Template > Marketing.", dur: 3.2 },
      { caption: "Ada versi baru: tulisannya Versi baru halaman tersedia.", dur: 3.6 },
      { caption: "Hanya profil yang diubah? Tulisannya Profil merek berubah.", show: ["brandT"], dur: 3.4 }
    ]),
  "jualan-perbarui-dashboard": perbaruiScene("dashboard", "Memperbarui Dashboard pasangan ke versi baru", "Dashboard Rina WO", dashPreview, dashPreview,
    ["Dashboard pasangan dipasang.", "Tekan Simpan di Scalev."], [
      { caption: "Buka halaman Dashboard pasangan: NikahKit > Template > Marketing.", dur: 3.2 },
      { caption: "Ada versi baru: tulisannya Versi baru halaman tersedia.", dur: 3.6 }
    ]),
  "jualan-perbarui-terbit": pubScene("Menerbitkan Landing page yang diperbarui", "Landing Rina WO", "Template", tplDone("landing"), landPreview("Rina WO"),
    ["Pratinjau ikut berganti ke profil terbaru, misalnya nama bisnis.", "Klik Simpan & Terbitkan supaya klien melihat versi baru."], LAND_HEAD,
    landPreview("Rina Undangan")),

  // ---------------------------------------------------------------- form-data-klien
  "jualan-form-klien": {
    title: "Klien mengisi form data undangan",
    base: phBase(scr(FY0, fkHead, K1.svg)),
    els: {
      // The page scrolls inside the screen: unclipped (a clip would scroll with it), under the desktop strips above and below.
      pgc: { svg: onPhone(scr(FY0, fkHead, K1.svg, qrChk)), enter: "fade" },
      edges: phEdges,
      s2: { svg: ph(sheet(fkHead, K2.svg)), enter: "fade", delay: 0.15 },
      err: { svg: ph(sheet(fkHead, K2e.svg)), enter: "fade", delay: 0.1 },
      nameBg: { svg: ph(scr(FY0, lpFocus(nameY))), enter: "fade" },
      nameT: ph(scr(FY0, body(text(55.5, nameY + 30, "Rani Kusuma", { size: 16, fill: LP.ink })))),
      nameOff: { svg: ph(scr(FY0, body(lpRing(nameY, LP.tint)))), enter: "fade" },
      waBg: { svg: ph(scr(FY0, lpFocus(waY))), enter: "fade" },
      waT: ph(scr(FY0, body(text(55.5, waY + 30, "0812 3456 7890", { size: 16, fill: LP.ink })))),
      s10: { svg: ph(sheet(fkHead, K10.svg)), enter: "fade" },
      sub: ph(scr(FY0, body(lpBtn(41.5, K10.pos.next, "kirim data", { solid: true, w: 307 })))),
      done: { svg: ph(sheet(fkHead, KD.svg)), enter: "fade", delay: 0.2 }
    },
    steps: [
      { caption: "Langkah 1 dari 10, Pesanan: Paket, Fitur undangan, dan Desain.", focus: PHF, mark: QM(41.5, fy(K1.pos.head) - 64, 307, 42),
        lens: lensBy(QR(36, fy(K1.pos.head) - 70, 320, 154), "l", 1.4), dur: 3.2 },
      { caption: "Centang fitur yang dipesan, misalnya QR check-in tamu.", at: Q(70, fy(qr[1] + qr[2] / 2)), click: true, show: ["pgc"], mark: QM(41.5, fy(qr[1]), 307, qr[2], 8),
        lens: lensBy(QR(36, fy(qr[1]) - 8, 318, qr[2] + 16), "l", 1.4), dur: 3.2 },
      { caption: "Gulir ke bawah, lalu tekan lanjut.", scroll: { id: "pgc", dy: FDY }, at: Q(195, fy(K1.pos.next) + 26 - FDY), click: true, show: ["s2"],
        mark: QM(...btnBox(K1.pos.next - FDY), 20), note: "lanjut", dur: 3.6 },
      { caption: "Langkah 2, Pemesan. Lanjut saat Nama kosong: Nama wajib diisi.", at: Q(195, fy(K2.pos.next) + 26), click: true, show: ["err"], mark: QM(...btnBox(K2.pos.next), 20),
        lens: lensBy(QR(36, fy(K2.pos.next) - 6, 320, 160), "l", 1.4), dur: 3.4 },
      { caption: "Kolom bertanda * wajib. Klik Nama, lalu ketik namanya.", at: Q(195, fy(nameY) + 24), click: true, show: ["nameBg", "nameT"],
        type: [{ id: "nameT", n: 11, box: QR(55, fy(nameY) + 4, 100, 40) }], mark: QM(...fieldBox(nameY), 8), lens: lensBy(QR(36, fy(nameY) - 34, 318, 90), "l", 1.4), dur: 3.4 },
      { caption: "Isi juga WhatsApp, lalu tekan lanjut sampai langkah terakhir.", at: Q(195, fy(waY) + 24), click: true, show: ["nameOff", "waBg", "waT"],
        type: [{ id: "waT", n: 14, box: QR(55, fy(waY) + 4, 120, 40) }], mark: QM(...fieldBox(waY), 8), lens: lensBy(QR(36, fy(waY) - 34, 318, 90), "l", 1.4), dur: 3.4 },
      { caption: "Langkah 10, Catatan: hal lain untuk undangan.", hide: ["err", "nameBg", "nameT", "nameOff", "waBg", "waT", "s2", "pgc"], show: ["s10", "sub"],
        mark: QM(41.5, fy(K10.pos.head) - 64, 307, 42), lens: lensBy(QR(36, fy(K10.pos.head) - 70, 320, 156), "l", 1.4), dur: 2.8 },
      { caption: "Tekan kirim data: Data terkirim ke Pesanan masuk.", at: Q(195, fy(K10.pos.next) + 26), click: true, press: "sub", show: ["done"],
        mark: QM(...btnBox(K10.pos.next), 20), lens: lensBy(QR(36, fy(FK.card) + 20, 320, 144), "l", 1.4), dur: 3.4 }
    ]
  },

  "jualan-link-form": {
    title: "Menyalin Link form klien dari Pesanan masuk",
    base: kontenEd("Undangan Rani & Dimas", SAMPLE),
    els: {
      inbox: { svg: ordersDlg, enter: "fade" },
      link: { svg: rect(16, 372, 366, 260, { fill: C.white }) + linkOpen, enter: "fade" },
      salin: { svg: salinBtn, enter: "fade" },
      ok: { svg: nkHint(28 + SALIN_W + 8, 557, "Tersalin."), enter: "fade", delay: 0.15 }
    },
    steps: [
      tabStep("Buka panel NikahKit di halaman undangan.", 2.6),
      { caption: "Klik ikon kotak masuk di kepala panel. Pesanan masuk terbuka.", at: ED.inbox, click: true, show: ["inbox"], focus: F.left, mark: INBOX,
        lens: { src: [12, 160, 374, 150] }, dur: 3.2 },
      { caption: "Klik Link form klien (opsional). Alamat link form tampil.", at: [200, 402], click: true, show: ["link", "salin"], mark: M(16, 377, 366, 50),
        lens: { src: [12, 372, 374, 212] }, dur: 3.4 },
      { caption: "Klik Salin link form: Tersalin. Tempel di chat WhatsApp klien.", at: [28 + SALIN_W / 2, 552], click: true, press: "salin", show: ["ok"],
        mark: M(28, 534, SALIN_W, 36), lens: { src: [12, 472, 374, 108] }, dur: 3.6 }
    ]
  },

  // ---------------------------------------------------------------- pesanan-masuk
  "jualan-pesanan-masuk": {
    title: "Mengisi undangan dari Pesanan masuk",
    base: [...kontenEd("Undangan Rani & Dimas", SAMPLE), inboxCount("1")],
    els: {
      inbox: { svg: ordersDlg, enter: "fade" },
      memuat: { svg: rect(270, ROW1 + 16, 64, 24, { fill: C.white }) + badgeAt(331, ROW1 + 19, "Memuat…", "off"), enter: "fade" },
      ...filled()
    },
    steps: [
      tabStep("Buka halaman undangan klien di editor, tab NikahKit.", 2.6),
      { caption: "Angka merah di ikon kotak masuk: ada pesanan yang belum diisi.", focus: F.left, mark: INBOX, lens: { src: [150, 96, 240, 52] }, dur: 3 },
      { caption: "Klik ikonnya. Layar Pesanan masuk terbuka, terbaru di atas.", at: ED.inbox, click: true, show: ["inbox"], mark: INBOX, lens: { src: [12, 160, 374, 150] }, dur: 3.2 },
      { caption: "Baru: belum dipakai. Sudah diisi: sudah pernah kamu klik.", mark: [M(331 - tw("Baru", 10, 500) - 12, ROW1 + 19, tw("Baru", 10, 500) + 12, 18, 9),
        M(331 - tw("Sudah diisi", 10, 500) - 12, ROW2 + 19, tw("Sudah diisi", 10, 500) + 12, 18, 9)], lens: { src: [12, 186, 374, 120] }, dur: 3.2 },
      { caption: "Klik nama pasangan berlabel Baru.", at: [150, ROW1 + 20], click: true, show: ["memuat"], mark: M(17, ROW1, 364, 57), lens: { src: [12, 182, 374, 70] }, dur: 3 },
      { caption: "Semua kolom terisi sesuai paketnya. Salah halaman? Klik Urungkan.", hide: ["inbox", "memuat"], show: ["konten", "t1"], focus: [F.left, F.preview],
        mark: undoMark(DATA_TOAST), lens: { src: [84, 806, 302, 90] }, dur: 4 }
    ]
  },
  "jualan-pesanan-terbit": pubScene("Ganti foto, lalu terbitkan undangan", "Undangan Rani & Dimas", "Konten", kontenPanel, invite(RANI),
    ["Foto tidak ikut terisi: ganti foto contoh di pratinjau.", "Lalu klik Simpan & Terbitkan."], { mark: M(833, 309, 178, 239, 12), note: "Foto contoh" }),

  "jualan-tempel-pesanan": {
    title: "Tempel data pesanan dari pesan WhatsApp",
    base: kontenEd("Undangan Rani & Dimas", SAMPLE),
    els: {
      wa: { svg: waBubble, enter: "rise" },
      inbox: { svg: ordersDlg, enter: "fade" },
      paste: { svg: pasteOpen(false), enter: "fade" },
      pasted: { svg: pasteOpen(true), enter: "fade" },
      isi: { svg: nkBtn(28, 488, "Isi undangan"), enter: "fade" },
      ...filled({ toast: 0.3 })
    },
    steps: [
      { caption: "Di WhatsApp, salin seluruh pesan klien, termasuk baris #data-undangan.", show: ["wa"], focus: F.left, mark: M(24, 300, 352, 200, 10),
        lens: { src: [24, 300, 352, 200] }, dur: 3.6 },
      { caption: "Buka Pesanan masuk lewat ikon kotak masuk.", at: ED.inbox, click: true, hide: ["wa"], show: ["inbox"], mark: INBOX, lens: { src: [12, 160, 374, 150] }, dur: 3.2 },
      { caption: "Klik Tempel data pesanan. Kotak teks muncul.", at: [200, 344], click: true, show: ["paste"], mark: M(16, 319, 366, 50), lens: { src: [12, 314, 374, 220] }, dur: 3.2 },
      { caption: "Klik di kotak, tekan Ctrl+V (Windows) atau Cmd+V (Mac).", at: [200, 428], click: true, show: ["pasted", "isi"], mark: M(28, 381, 341, 95),
        lens: { src: [20, 372, 358, 160] }, dur: 3.4 },
      { caption: "Klik Isi undangan: panel pindah ke Konten, ada tombol Urungkan.", at: [70, 506], click: true, press: "isi", hide: ["inbox", "paste", "pasted", "isi"],
        show: ["konten", "t1"], mark: M(...nkBtnBox(28, 488, "Isi undangan")), lens: { src: [84, 806, 302, 90] }, dur: 4 }
    ]
  },

  "jualan-hapus-pesanan": {
    title: "Menghapus pesanan dari Pesanan masuk",
    base: [...kontenEd("Undangan Rani & Dimas", SAMPLE), ordersDlg],
    els: {
      row: { svg: hapusRow, enter: "fade" },
      hapus: { svg: hapusBtn, enter: "pop", origin: [357, ROW2 + 28] },
      gone: { svg: afterDelete, enter: "fade", delay: 0.15 }
    },
    steps: [
      { caption: "Klik ikon tempat sampah di baris pesanan. Muncul Hapus? merah.", at: [357, ROW2 + 28], click: true, show: ["row", "hapus"], focus: F.left,
        mark: M(345, ROW2 + 16, 24, 24), lens: { src: [12, 182, 374, 134] }, dur: 3.4 },
      { caption: "Klik Hapus? untuk memastikan. Pesanan hilang dari daftar.", at: [HAPUS_X + HAPUS_W / 2, ROW2 + 28], click: true, press: "hapus", hide: ["row", "hapus"],
        show: ["gone"], mark: M(HAPUS_X, ROW2 + 10, HAPUS_W, 36), lens: { src: [12, 182, 374, 134] }, dur: 3.6 }
    ]
  },

  // ---------------------------------------------------------------- checklist-serah
  "jualan-checklist": {
    title: "Checklist sebelum menyerahkan undangan ke klien",
    bg: "#eef1f5",
    base: [rect(0, 0, 1440, 900, { fill: "#eef1f5" }), shadow(170, 24, 1100, 852, 6, 3), rect(170, 24, 1100, 852, { r: 6, fill: C.white }),
      text(CKX, 96, "Checklist serah undangan", { size: 34, weight: 700, fill: C.ink }), text(CKX, 134, "Centang setiap baris sebelum mengirim pesan untuk pengantin.", { size: 20, fill: C.text }),
      ...CHECK.map((l, i) => rect(CKX + 1, CKY(i) + 1, 30, 30, { r: 5, stroke: C.faint, sw: 2 }) + text(CKX + 52, CKY(i) + 24, l, { size: 24, fill: C.ink }) +
        line(CKX, CKY(i) + 50, CKX + CKW, CKY(i) + 50, { stroke: C.line }))],
    els: Object.fromEntries(CHECK.map((_, i) => [`k${i}`, { svg: rect(CKX, CKY(i), 32, 32, { r: 5, fill: C.ok }) + iconX("check", CKX + 16, CKY(i) + 16, 22, C.white, 3), enter: "pop", origin: [CKX + 16, CKY(i) + 16] }])),
    steps: [
      { caption: "Isi undangan: Konten, foto contoh, dan musik.", show: ["k0", "k1", "k2"], focus: "all", mark: M(CKX - 10, CKY(0) - 10, CKW + 20, CKY(2) - CKY(0) + 52, 6), dur: 3.4 },
      { caption: "Halaman tersimpan dengan slug, lalu Simpan & Terbitkan.", show: ["k3", "k4"], mark: M(CKX - 10, CKY(3) - 10, CKW + 20, CKY(4) - CKY(3) + 52, 6), dur: 3.2 },
      { caption: "Coba sebagai tamu, buat PIN, salin pesan untuk pengantin.", show: ["k5", "k6", "k7"], mark: M(CKX - 10, CKY(5) - 10, CKW + 20, CKY(7) - CKY(5) + 52, 6), dur: 3.6 },
      { caption: "Bila dipakai: Undangan khusus dan kode staff hari-H.", show: ["k8", "k9"], mark: M(CKX - 10, CKY(8) - 10, CKW + 20, CKY(9) - CKY(8) + 52, 6), dur: 3.2 },
      { caption: "Semua tercentang: kirim pesan untuk pengantin.", dur: 2.8 }
    ]
  }
};
// Flow cards and checklist rows enter in reading order within each step.
for (const k of ["jualan-alur", "jualan-checklist"]) for (const st of scenes[k].steps) (st.show ?? []).forEach((id, n) => (scenes[k].els[id].delay = 0.1 + n * (k === "jualan-alur" ? 0.18 : 0.08)));
