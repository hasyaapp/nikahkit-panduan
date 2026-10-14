// Jualan ke klien: alur, Profil merek, Dashboard pasangan, Bagikan > Untuk pengantin, Landing page, form klien,
// Pesanan masuk, checklist serah.
// Panel: nikahkit/src/ui/panels-style.jsx (TemplatePanel, BrandForm), orders.jsx, App.jsx (AccessSection), styles.js;
// measured from /tmp/ref/editor-marketing.png, editor-pesanan.png, editor-bagikan.png, editor-konten.png.
// Landing page and form: server/pages/src/landing/index.html + server/pages/shared/order-form.js at 390 px (mobile CSS).
// Dashboard pasangan: /tmp/ref/dash-gate-hp.png.
import { C, chrome, scalevEditor, nkRail, nkHead, nkDialogHead, nkBtn, nkInput, nkLabel, nkHint, nkSwitch, nkBadge, nkAcc, nkH3,
  icon, iconX, rect, text, para, line, circle, group, clipped, shadow, tw, note, ring, favScalev } from "../lib.mjs";

// ---- Editor world: Chrome 1440x985, Scalev editor from y 85 -------------------------------------------------------
const OY = 85, URL = "app.scalev.com/pages/365671";
const ed = (...s) => group({ transform: `translate(0 ${OY})` }, ...s);
const P = (x, y) => [x, y + OY];
// Worlds: rail + panel + preview (dialogs centre at x 720); rail + panel only; toolbar with Simpan & Terbitkan.
const PANELW = { x: 0, y: OY + 44, w: 1120, h: 848 };
const RAILW = (h, y = 92) => ({ x: 0, y: OY + y, w: 400, h });
const TOPW = { x: 720, y: OY, w: 720, h: 660 };
const TAB = { title: "Landing Page Studio", active: true, fav: favScalev };
const shell = (o = {}) => [chrome(0, 0, 1440, 985, { tabs: [TAB], url: URL }), ed(scalevEditor(0, 0, o))];
// The panel area under a scrolled list: Chrome, Scalev bars and the panel head redrawn on top (x 0..399, editor y < 153).
const cover = (o, title, h = {}) => clipped(0, 0, 400, OY + 153, chrome(0, 0, 1440, 985, { tabs: [TAB], url: URL }), ed(scalevEditor(0, 0, o), nkHead(0, 0, title, h)));
// Simpan & Terbitkan as its own element, for press.
const pubBtn = ed(rect(1283, 50, 151, 34, { r: 4, fill: C.primary }) + text(1291, 72, "Simpan & Terbitkan", { size: 13, weight: 500, fill: C.white }) + iconX("rocket", 1418, 67, 15, C.white));
const PUB = P(1358, 67);
const bodyClip = (...s) => clipped(72, 153, 327, 747, ...s);
const bodyBg = rect(72, 153, 327, 747, { fill: C.white });
const svgIcon = (body, cx, cy, size, color) => `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</g>`;
// Inbox count on the header icon (.nk-inbox__count: top 2, right 0 of the 36px icon button at 218..254).
const inboxCount = (n) => rect(238, 106, 16, 16, { r: 8, fill: C.danger }) + text(246, 118, n, { size: 10, weight: 600, fill: C.white, anchor: "middle" });

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

// Template cards (Template category). Thumbnails are the worker's images: drawn here as neutral page sketches.
const TPL = [["Dasar", ["Polos · 20 bagian · HP &", "desktop · ID/EN"], ["#ffffff", "#8b8178"]], ["Folio", ["20 bagian · HP & desktop ·", "ID/EN"], ["#f3ece2", "#7a5c3e"]],
  ["Galeri Putih", ["20 bagian · HP & desktop ·", "ID/EN"], ["#fafafa", "#9aa3ad"]], ["Modern Estetik", ["20 bagian · HP & desktop ·", "ID/EN"], ["#e9efe7", "#5d7a5a"]]];
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
const lpBtnW = (label, small) => tw(label, small ? 15 : 17, 700) + (small ? 28 : 36) + 8;
const THUMB = (x, y, w, hh, pal, rot = 0) => group({ transform: `rotate(${rot} ${x + w / 2} ${y + hh / 2})` },
  rect(x, y + 10, w, hh, { r: 14, fill: "rgba(43,26,7,.08)" }), clipped(x, y, w, hh, pageSketch(x, y, w, hh, pal)), rect(x, y, w, hh, { r: 14, stroke: LP.cocoa, sw: 1.5 }));
const PKG = [["Basic", "Rp150.000", ["Isi dan foto dari kalian", "Revisi 2 kali"]], ["Premium", "Rp350.000", ["Semua isi paket Basic", "Revisi 5 kali"]]];
// Page positions (relative to the page top) used by scenes.
const LPY = { cta: 377, katalog: 805, grid: 992, harga: 1864, pkg1: 2055, pesan: 3289, card: 3502 };

function landingTop(x0, y0, name) {
  const X = x0 + 20, Y = (v) => y0 + v;
  let s = rect(x0, y0, 390, 3502, { fill: LP.paper });
  // header
  s += circle(X + 20, Y(37), 20, { fill: LP.tint }) + h(X + 20, Y(43), name[0], 18, { weight: 600, anchor: "middle" }) + h(X + 50, Y(43), name, 18, { weight: 600 }) +
    lpBtn(x0 + 370 - lpBtnW("Pesan", true), Y(14), "Pesan", { small: true });
  // hero
  ["Undangan digital", "untuk hari", "bahagia kalian"].forEach((l, i) => (s += h(X, Y(129 + i * 44), l, 43)));
  s += para(X, Y(263), ["Pilih desain, pilih paket, lalu isi data", `pernikahan kalian. ${name} menyiapkan`, "undangannya sampai siap dibagikan ke", "tamu."], { size: 17, fill: LP.muted, lh: 26.35 });
  s += lpBtn(X, Y(LPY.cta), "Pesan undangan", { solid: true }) + lpBtn(X + lpBtnW("Pesan undangan") + 12, Y(LPY.cta), "Lihat desain");
  s += THUMB(X + 10.5, Y(469 + 28), 175, 219, TPL[1][2], -6) + THUMB(X + 164.5, Y(469 + 28), 175, 219, TPL[2][2], 6) + THUMB(X + 87.5, Y(469), 175, 219, TPL[0][2]);
  // katalog
  s += dash(X, Y(LPY.katalog), 350) + h(X, Y(892), "Pilih desain undangan", 32) +
    para(X, Y(930), ["Buka demo untuk melihat desainnya lebih", "besar, lalu pilih yang kalian suka."], { size: 17, fill: LP.muted, lh: 26.35 });
  TPL.forEach(([n, note, pal], i) => {
    const cx = X + (i % 2) * 182, ry = LPY.grid + Math.floor(i / 2) * 418;
    s += clipped(cx, Y(ry), 168, 210, pageSketch(cx, Y(ry), 168, 210, pal)) + rect(cx, Y(ry), 168, 210, { r: 14, stroke: LP.cocoa, sw: 1.5 }) +
      h(cx, Y(ry + 240), n, 20) + para(cx, Y(ry + 263), note, { size: 14, fill: LP.muted, lh: 20.3 }) +
      text(cx, Y(ry + 327), "Lihat demo", { size: 15, weight: 700, fill: LP.cocoa, underline: true }) + lpBtn(cx, Y(ry + 348), "Pilih", { small: true });
  });
  // paket dan harga
  s += rect(x0, Y(LPY.harga), 390, 2719 - LPY.harga, { fill: LP.tint }) + h(X, Y(1955), "Paket dan harga", 32) +
    para(X, Y(1993), ["Pilih paket yang pas, lalu isi datanya di", "form di bawah."], { size: 17, fill: LP.muted, lh: 26.35 });
  PKG.forEach(([n, price, inc], i) => {
    const t = LPY.pkg1 + i * 310;
    s += rect(X + 0.75, Y(t + 0.75), 348.5, 292.5, { r: 16, fill: LP.paper, stroke: LP.cocoa, sw: 1.5 }) + h(X + 25, Y(t + 45), n, 24) + h(X + 25, Y(t + 91), price, 32, { weight: 600 }) +
      dash(X + 25, Y(t + 120), 300) + inc.map((x, k) => iconX("check", X + 34, Y(t + 151 + k * 32), 18, LP.cocoa, 2.4) + text(X + 53, Y(t + 156 + k * 32), x, { size: 15, fill: LP.ink })).join("") +
      lpBtn(X + 25, Y(t + 218), "Pilih paket ini", { solid: true, w: 300 });
  });
  // cara pesan
  s += h(X, Y(2810), "Cara pesan", 32);
  [["1", "Pilih desain dan paket", ["Lihat demo desain di atas, lalu", "pilih paket yang sesuai."]], ["2", "Isi data pernikahan", ["Nama, acara, dan detail lain lewat", "form di bawah. Yang belum siap", "boleh menyusul."]],
    ["3", "Dihubungi lewat WhatsApp", [`${name} mengonfirmasi pesanan dan`, "pembayaran, lalu menyiapkan", "undangan kalian."]]].forEach(([n, t, p], i) => {
    const top = [2845, 2965, 3111][i];
    s += circle(X + 24, Y(top + 24), 23, { fill: LP.paper, stroke: LP.cocoa, sw: 2 }) + h(X + 24, Y(top + 32), n, 22, { weight: 600, fill: LP.accent, anchor: "middle" }) +
      h(X + 64, Y(top + 30), t, 22) + para(X + 64, Y(top + 59), p, { size: 17, fill: LP.muted, lh: 26.35 });
  });
  // form section head
  s += dash(X, Y(LPY.pesan), 350) + h(X, Y(3376), "Isi data pesanan", 32) +
    para(X, Y(3414), [`Data langsung terkirim ke ${name}. Yang`, "belum siap boleh dikosongkan dan", "dilengkapi lewat WhatsApp."], { size: 17, fill: LP.muted, lh: 26.35 });
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
  let s = rect(85.5, BOX - 2.5, 284, 884, { r: 6, stroke: C.primarySoft, sw: 3 }) + rect(88.5, BOX + 0.5, 278, 878, { r: 4, fill: C.white, stroke: C.primary }) +
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
    nkBtn(fx, 1005, "Tambah paket", { variant: "quiet", w: fw, icon: "plus" }) + nkBtn(fx, 1049, "Simpan profil", { w: 110 });
  return s;
}
const SCROLL = 300;

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
// Text is 20-21 px: the 1240-wide diagram shows at ~0.63 in the docs, so it still reads at 12-13 px.
const FX = [20, 435, 850], FY = [80, 285, 490, 695], FW = 370, FH = 160;
const flowPos = (i) => { const r = Math.floor(i / 3), c = r % 2 ? 2 - (i % 3) : i % 3; return [FX[c], FY[r]]; };
function flowCard(i) {
  const [x, y] = flowPos(i), [ic, t, sub, who] = FLOW[i], [whoFill, whoFg] = { Klien: ["#e8f6fb", C.action], Kamu: [C.tint, C.accent], Pengantin: [C.okSoft, C.ok], Staff: ["#f2f5fa", C.strong] }[who];
  const bw = tw(who, 20, 600) + 24;
  return shadow(x, y, FW, FH, 14, 2) + rect(x, y, FW, FH, { r: 14, fill: C.white }) + rect(x + 18, y + 24, 46, 46, { r: 12, fill: whoFill }) + iconX(ic, x + 41, y + 47, 24, whoFg) +
    text(x + 80, y + 42, `Langkah ${i + 1}`, { size: 20, weight: 600, fill: C.faint }) + text(x + 80, y + 76, t, { size: 21, weight: 700, fill: C.ink }) +
    para(x + 80, y + 110, sub, { size: 20, fill: C.text, lh: 26 }) + rect(x + FW - 18 - bw, y + 16, bw, 32, { r: 16, fill: whoFill }) +
    text(x + FW - 18 - bw / 2, y + 39, who, { size: 20, weight: 600, fill: whoFg, anchor: "middle" });
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
const CKX = 150, CKY = (i) => 168 + i * 58;

// ---- Phone screens and dialog extras -----------------------------------------------------------------------------
// A 390x844 phone viewport onto a long page: the page drawn shifted up by y (the world crop clips it).
const scr = (y, ...s) => group({ transform: `translate(0 ${-y})` }, ...s);
const PHONE = { w: 390, h: 844 };
const LAND = landingTop(0, 0, "Rina WO");
const F0 = formTail(0, LPY.card, PESANAN);
const F1 = formTail(0, LPY.card, { ...PESANAN, picked: ["Pilihan kalian: desain Dasar"], desain: "Dasar" });
const F2 = formTail(0, LPY.card, { ...PESANAN, picked: ["Pilihan kalian: Paket Basic, desain", "Dasar"], desain: "Dasar", paket: "Basic" });
// Lihat demo dialog: viewport = katalog top (805) .. +844; dialog 358 wide, centred.
const KAT = LPY.katalog, DLG_TOP = 919, DLG = { img: DLG_TOP + 1.5, body: DLG_TOP + 449 };
const demoDlg = body(rect(0, KAT, 390, 844, { fill: "rgba(23,16,8,.55)" }) + rect(16.75, DLG_TOP + 0.75, 356.5, 614, { r: 16, fill: LP.paper, stroke: LP.cocoa, sw: 1.5 }) +
  clipped(18, DLG.img, 354, 446, pageSketch(18, DLG.img, 354, 446, TPL[0][2])) + line(18, DLG.body, 372, DLG.body, { stroke: LP.cocoa, sw: 1 }) +
  h(37, DLG.body + 43, "Dasar", 26) + text(37, DLG.body + 74, "Polos · 20 bagian · HP & desktop · ID/EN", { size: 15, fill: LP.muted }) +
  lpBtn(37 + lpBtnW("Pakai desain ini") + 10, DLG.body + 100, "Tutup", { secondary: true }));
const DLG_PICK = [37 + lpBtnW("Pakai desain ini") / 2, DLG.body + 126 - KAT];
const PKG_Y = LPY.pkg1 - 40, FORM_Y = LPY.card - 20;

// form-klien: the #pesan section from its top; the phone shows it from FY0.
const FK = { card: LPY.card - LPY.pesan };
const fkHead = body(rect(0, 0, 390, FK.card, { fill: LP.paper }) + dash(20, 0, 350) + h(20, 87, "Isi data pesanan", 32) +
  para(20, 125, ["Data langsung terkirim ke Rina WO. Yang", "belum siap boleh dikosongkan dan", "dilengkapi lewat WhatsApp."], { size: 17, fill: LP.muted, lh: 26.35 }));
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
const CARD_AT = { dashboard: P(155, 360), landing: P(301, 360) };
const veil = ed(rect(0, 0, 1440, 900, { fill: "rgba(255,255,255,.92)" }));
const pasangDlg = (name) => ed(shadow(540, 383, 360, 134, 8, 3), rect(540, 383, 360, 134, { r: 8, fill: C.white }),
  text(560, 418, `Pasang ${name} di halaman ini?`, { size: 14, weight: 600 }), nkHint(560, 442, "Seluruh isi halaman diganti. Bisa diurungkan."), nkBtn(745, 461, "Batal", { variant: "quiet", w: 63 }));
const pasangBtn = ed(nkBtn(816, 461, "Pasang", { w: 64 }));
const DLG_O = P(720, 450);
// The confirm dialog and the preview, without the panel (editor x 520..1120).
const DLGW = { x: 520, y: OY + 92, w: 600, h: 800 };

// ---- Scenes ------------------------------------------------------------------------------------------------------
const kontenEd = (page, inv) => [...shell({ page, rail: "Konten" }), ed(nkHead(0, 0, "Konten"), kontenBody, invite(inv))];
const filled = (o = {}) => ({ konten: { svg: ed(nkRail(0, 0, "Konten"), nkHead(0, 0, "Konten"), rect(72, 153, 327, 747, { fill: C.white }), kontenBody, invite(RANI)), enter: "fade" },
  t1: { svg: ed(nkToast(["Data pesanan dimasukkan.", "Foto tetap; ganti foto", "contoh bila masih ada."])), enter: "slide", delay: o.toast ?? 0.3 } });
// Install one Marketing card on a blank HTML Mode page (pasang-dashboard-pasangan, landing-page), in three crops:
// the panel up to the card click, the centred dialog with the preview, then the panel's toast and Dipakai badge.
function pasangScenes(kind, title, page, after, result, toast, caps) {
  const name = MK[kind][0], slug = `jualan-pasang-${kind}`;
  const donePanel = ed(rect(72, 153, 327, 747, { fill: C.white }), bodyClip(kindSeg("marketing"), brandClosed(219), mkCards(MKY, kind)));
  const bw = tw("Dipakai", 10, 500) + 12, bx = (kind === "dashboard" ? 88 : 234) + 134 - bw; // mkCard's wrapped-name badge
  return {
    [slug]: {
      title, world: RAILW(848, 44),
      base: [...shell({ page, rail: "Template", screenFill: C.white }), ed(tplPanel({ head: { inbox: false } }))],
      els: { mk: { svg: ed(mkPanel()), enter: "fade" }, veil: { svg: veil, enter: "fade" } },
      steps: [
        { caption: caps[0], dur: 3 },
        { caption: caps[1], at: P(...SEG.marketing), click: true, show: ["mk"], dur: 3.2 },
        { caption: `Klik kartu ${name}. Layar meredup: dialog konfirmasi muncul.`, at: CARD_AT[kind], click: true, show: ["veil"], dur: 3.6 }
      ]
    },
    [`${slug}-dialog`]: {
      title: `Dialog Pasang ${name}`, world: DLGW,
      base: [...shell({ page, rail: "Template", screenFill: C.white }), ed(mkPanel())],
      els: { dlg: { svg: veil + pasangDlg(name), enter: "pop", origin: DLG_O }, pasang: { svg: pasangBtn, enter: "pop", origin: DLG_O },
        done: { svg: ed(after) + donePanel, enter: "fade" } },
      steps: [
        { caption: `Muncul dialog Pasang ${name} di halaman ini?`, show: ["dlg", "pasang"], dur: 3.2 },
        { caption: `Klik Pasang. ${result}`, at: P(848, 479), click: true, press: "pasang", hide: ["dlg", "pasang"], show: ["done"], dur: 3.8 }
      ]
    },
    [`${slug}-hasil`]: {
      title: `${name} dipasang`, world: RAILW(848, 44),
      base: [...shell({ page, rail: "Template", screenFill: C.white }), ed(after, nkHead(0, 0, "Template", { inbox: false })), donePanel],
      els: { t1: { svg: ed(nkToast(toast)), enter: "slide", delay: 0.3 }, hl: { svg: ed(ring(bx, MKY + 185, bw, 18, { r: 12 })), enter: "fade", delay: 0.3 } },
      steps: [{ caption: `Muncul pesan: ${toast.join(" ")}`, show: ["t1"], dur: 3.4 }, { caption: `Kartu ${name} kini berlabel Dipakai.`, show: ["hl"], dur: 3 }]
    }
  };
}
// The publish step, split off so the panel scenes stay readable: the toolbar and the top of the preview.
function pubScene(title, page, preview, cap, hl, before) {
  const first = [...(hl ? ["hl"] : []), ...(before ? ["nw"] : [])];
  return {
    title, world: TOPW,
    base: [...shell({ page, rail: "Konten" }), ed(before ?? preview)],
    els: { pub: pubBtn, ...(hl ? { hl: { svg: ed(hl), enter: "fade", delay: 0.4 } } : {}), ...(before ? { nw: { svg: ed(preview), enter: "fade", delay: 0.6 } } : {}) },
    steps: [{ caption: cap[0], show: first, dur: 3 }, { caption: cap[1], at: PUB, click: true, press: "pub", hide: hl ? ["hl"] : [], dur: 3.4 }]
  };
}

export const scenes = {
  // ---------------------------------------------------------------- alur-dengan-klien
  "jualan-alur": {
    title: "Alur jualan undangan dari klien sampai hari-H",
    world: { w: 1240, h: 880 }, bg: C.tint,
    base: [rect(0, 0, 1240, 880, { fill: C.tint }), text(620, 52, "Alur kerja vendor dengan NikahKit", { size: 32, weight: 700, fill: C.ink, anchor: "middle" })],
    els: Object.fromEntries(FLOW.flatMap((_, i) => [[`c${i}`, { svg: flowCard(i), enter: "pop", origin: [flowPos(i)[0] + FW / 2, flowPos(i)[1] + FH / 2] }],
      ...(i < FLOW.length - 1 ? [[`a${i}`, { svg: flowArrow(i), enter: "fade" }]] : [])])),
    steps: [
      { caption: "Klien membuka Landing page kamu, lalu mengisi form data undangan.", show: ["c0", "a0", "c1"], dur: 3.4 },
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
    world: RAILW(856, 44),
    base: kontenEd("Undangan Rani & Dimas", SAMPLE),
    els: {
      tpl: { svg: ed(nkRail(0, 0, "Template"), tplPanel()), enter: "fade" },
      mk: { svg: ed(bodyBg, bodyClip(kindSeg("marketing"), brandOpen())), enter: "fade" },
      nameFocus: { svg: ed(nkInput(101, 300, 253, "", { focus: true })), enter: "fade" },
      nameBlur: { svg: ed(nkInput(101, 300, 253, "")), enter: "fade" },
      nameV: { svg: ed(text(111, 323, "Rina WO", { size: 14 })) },
      waFocus: { svg: ed(nkInput(101, 368, 253, "", { focus: true })), enter: "fade" },
      waV: { svg: ed(text(111, 391, "0812 3456 7890", { size: 14 })) },
      logoHl: { svg: ed(ring(101, 464, 253, 82, { r: 6 })), enter: "fade" },
      body2: { svg: ed(rect(72, 153, 327, 1100, { fill: C.white }), kindSeg("marketing"), brandOpen({ name: "Rina WO", wa: "0812 3456 7890" })), enter: "fade" },
      pkFocus: { svg: ed(nkInput(111, 368, 233, "", { focus: true })), enter: "fade" },
      pkBlur: { svg: ed(nkInput(111, 368, 233, "")), enter: "fade" },
      pkName: { svg: ed(text(121, 391, "Basic", { size: 14 })) },
      prFocus: { svg: ed(nkInput(111, 436, 233, "", { focus: true })), enter: "fade" },
      pkPrice: { svg: ed(text(121, 459, "150.000", { size: 14 })) },
      addHl: { svg: ed(ring(101, 1005 - SCROLL, 253, 36, { r: 6 })), enter: "fade", delay: 0.5 },
      done: { svg: ed(bodyBg, bodyClip(kindSeg("marketing"), brandClosed(BOX), mkCards(MKY))), enter: "fade", delay: 0.15 },
      cover: cover({ page: "Undangan Rani & Dimas", rail: "Template" }, "Template")
    },
    steps: [
      { caption: "Di editor halaman, buka tab NikahKit.", dur: 2.4 },
      { caption: "Klik Template di rel kiri.", at: P(36, 130), click: true, show: ["tpl"], dur: 3 },
      { caption: "Di Kategori, klik Marketing. Kotak Profil merek terbuka: Belum diisi.", at: P(...SEG.marketing), click: true, show: ["mk"], dur: 3.4 },
      { caption: "Klik Nama bisnis, lalu ketik nama bisnismu.", at: P(228, 318), click: true, show: ["nameFocus", "nameV"], type: [{ id: "nameV", n: 7, box: [111, 303 + OY, 70, 30] }], dur: 3.2 },
      { caption: "Klik Nomor WhatsApp, lalu ketik nomornya, misalnya 0812 3456 7890.", at: P(228, 386), click: true, show: ["nameBlur", "waFocus", "waV"], type: [{ id: "waV", n: 14, box: [111, 371 + OY, 110, 30] }], dur: 3.4 },
      { caption: "Logo (opsional): tempel alamat gambar https, atau kosongkan.", show: ["logoHl"], dur: 3 },
      { caption: "Gulir ke paket pertama, lalu isi Nama paket.", at: P(228, 386), click: true, show: ["body2", "pkFocus", "pkName"],
        hide: ["nameFocus", "nameBlur", "nameV", "waFocus", "waV", "logoHl"], scroll: { id: "body2", dy: SCROLL }, type: [{ id: "pkName", n: 5, box: [121, 371 + OY, 36, 30] }], dur: 3.6 },
      { caption: "Isi Harga (Rp) dan Isi paket. Tambah paket untuk paket kedua dan ketiga.", at: P(228, 454), click: true, show: ["pkBlur", "prFocus", "pkPrice", "addHl"], type: [{ id: "pkPrice", n: 7, box: [121, 439 + OY, 50, 30] }], dur: 3.6 },
      { caption: "Klik Simpan profil. Kotak menutup dengan label Terisi.", at: P(156, 1067 - SCROLL), click: true, hide: ["addHl"], show: ["done"], dur: 3.4 }
    ]
  },

  // ---------------------------------------------------------------- pasang-dashboard-pasangan
  ...pasangScenes("dashboard", "Memasang Dashboard pasangan di halaman Scalev sendiri", "Dashboard Rina WO", dashPreview, "Pratinjau berubah menjadi Kelola undangan.",
    ["Dashboard pasangan dipasang.", "Tekan Simpan di Scalev."],
    ["Halaman HTML Mode baru yang kosong: tab NikahKit menampilkan Template.", "Di Kategori, klik Marketing."]),
  "jualan-pasang-dashboard-terbit": pubScene("Menerbitkan halaman Dashboard pasangan", "Dashboard Rina WO", dashPreview,
    ["Pratinjau sudah Kelola undangan. Tinggal diterbitkan.", "Klik Simpan & Terbitkan. Alamat halaman ini jadi alamat Dashboard."]),

  // Bagikan in an invitation after the dashboard is installed.
  "jualan-bagikan-pengantin": {
    title: "Tombol Untuk pengantin di Bagikan",
    world: { x: 0, y: 0, w: 446, h: 905 },
    base: kontenEd("Undangan Rani & Dimas", RANI),
    els: {
      share: { svg: ed(shareDlg), enter: "fade" },
      buka: { svg: ed(bukaDash), enter: "fade" },
      hl: { svg: ed(ring(16, 595, 366, 126, { r: 6 })), enter: "fade", delay: 0.4 },
      ci: { svg: ed(ring(16, 470, 366, 100, { r: 6 })), enter: "fade", delay: 0.3 },
      tab: { svg: chrome(0, 0, 1440, 985, { tabs: [{ title: "Landing Page Studio", fav: favScalev, w: 180 }, { title: "Kelola undangan", active: true, w: 160 }], url: "tokomu.myscalev.com/kelola?w=…" }) +
        rect(0, 85, 1440, 900, { fill: "#f5f4f2" }) + gate(25, 300), enter: "fade" }
    },
    steps: [
      { caption: "Buka undangan klien di editor, tab NikahKit.", dur: 2.8 },
      { caption: "Klik Bagikan di rel kiri.", at: P(36, 585), click: true, show: ["share", "buka"], dur: 3.2 },
      { caption: "Untuk pengantin: Kirim undangan dan Buka Dashboard.", at: P(420, 700), show: ["hl"], dur: 3.4 },
      { caption: "Buka Check-in muncul bila Undangan khusus dan QR masuk menyala.", hide: ["hl"], show: ["ci"], dur: 3.8 },
      { caption: "Klik Buka Dashboard: Kelola undangan terbuka di tab baru.", at: P(199, 677), click: true, press: "buka", hide: ["ci"], show: ["tab"], dur: 3.4 },
      { caption: "Pengantin masuk dengan PIN dashboard.", dur: 3 }
    ]
  },

  // ---------------------------------------------------------------- landing-page
  ...pasangScenes("landing", "Memasang Landing page di halaman Scalev sendiri", "Landing Rina WO", clipped(727, 106, 390, 784, landingTop(727, 106, "Rina WO")),
    "Pratinjau berubah menjadi Landing page.", ["Landing page dipasang. Tekan", "Simpan di Scalev."],
    ["Halaman HTML Mode baru yang kosong: tab NikahKit menampilkan Template.", "Klik Marketing. Profil merek harus berlabel Terisi."]),
  "jualan-pasang-landing-terbit": pubScene("Menerbitkan Landing page", "Landing Rina WO", clipped(727, 106, 390, 784, landingTop(727, 106, "Rina WO")),
    ["Pratinjau sudah Landing page dengan nama bisnismu.", "Klik Simpan & Terbitkan, lalu buka alamat publiknya dari HP."]),

  "jualan-landing-page": {
    title: "Isi Landing page member di HP klien",
    world: PHONE,
    base: [scr(0, LAND, F0.svg)],
    els: {
      v1: { svg: scr(KAT, LAND, F0.svg), enter: "fade", delay: 0.1 },
      dlg: { svg: scr(KAT, demoDlg), enter: "pop", origin: [195, 422] },
      pick: { svg: scr(KAT, body(lpBtn(37, DLG.body + 100, "Pakai desain ini", { solid: true }))), enter: "pop", origin: [195, 422] },
      f1: { svg: scr(FORM_Y, LAND, F1.svg), enter: "fade", delay: 0.2 },
      vPkg: { svg: scr(PKG_Y, LAND, F1.svg), enter: "fade" },
      p2: { svg: scr(PKG_Y, body(lpBtn(45, LPY.pkg1 + 218, "Pilih paket ini", { solid: true, w: 300 }))) },
      f2: { svg: scr(FORM_Y, LAND, F2.svg), enter: "fade", delay: 0.3 }
    },
    steps: [
      { caption: "Pembuka: nama bisnismu, Pesan undangan, dan Lihat desain.", at: [287, LPY.cta + 26], click: true, show: ["v1"], dur: 3.4 },
      { caption: "Lihat desain turun ke katalog. Klien menekan Lihat demo.", at: [62, LPY.grid + 322 - KAT], click: true, show: ["dlg", "pick"], dur: 3.4 },
      { caption: "Gambar desain tampil lebih besar. Klik Pakai desain ini.", at: DLG_PICK, click: true, press: "pick", hide: ["dlg", "pick", "v1"], show: ["f1"], dur: 3.4 },
      { caption: "Form menulis Pilihan kalian: desain Dasar.", dur: 2.6 },
      { caption: "Di Paket dan harga, setiap paket punya Pilih paket ini.", hide: ["f1"], show: ["vPkg", "p2"], dur: 2.8 },
      { caption: "Pilih paket ini: form mencatat Paket Basic, desain Dasar.", at: [195, LPY.pkg1 + 244 - PKG_Y], click: true, press: "p2", show: ["f2"], dur: 3.8 }
    ]
  },

  "jualan-perbarui-landing": {
    title: "Memperbarui Landing page setelah Profil merek diubah",
    world: RAILW(848, 44),
    base: [...shell({ page: "Landing Rina WO", rail: "Template" }), ed(clipped(727, 106, 390, 784, landingTop(727, 106, "Rina Undangan")), nkHead(0, 0, "Template", { inbox: false }), bodyBg,
      bodyClip(kindSeg("marketing"), brandClosed(219), rect(88.5, 277.5, 278, 49, { r: 4, fill: C.warnSoft, stroke: "#fde7c7" }),
        para(99, 298, ["Profil merek", "berubah."], { size: 12, fill: C.strong, lh: 16 }), mkCards(339, "landing")))],
    els: {
      perbarui: { svg: ed(nkBtn(216, 286, "Perbarui halaman ini", { variant: "quiet", h: 32, w: 140 })) },
      hl: { svg: ed(ring(88, 277, 279, 50, { r: 6 })), enter: "fade", delay: 0.4 },
      after: { svg: ed(bodyBg, bodyClip(kindSeg("marketing"), brandClosed(219), mkCards(MKY, "landing")), clipped(727, 106, 390, 784, landingTop(727, 106, "Rina WO"))), enter: "fade", delay: 0.1 },
      t1: { svg: ed(nkToast(["Landing page dipasang. Tekan", "Simpan di Scalev."])), enter: "slide", delay: 0.25 }
    },
    steps: [
      { caption: "Buka halaman Landing page kamu: NikahKit > Template > Marketing.", dur: 3.2 },
      { caption: "Profil diubah setelah dipasang? Muncul Profil merek berubah.", show: ["hl"], dur: 3.4 },
      { caption: "Klik Perbarui halaman ini. Halaman langsung dipasang ulang.", at: P(286, 302), click: true, press: "perbarui", hide: ["hl"], show: ["after", "t1"], dur: 3.8 }
    ]
  },
  "jualan-perbarui-terbit": pubScene("Menerbitkan Landing page yang diperbarui", "Landing Rina WO", clipped(727, 106, 390, 784, landingTop(727, 106, "Rina WO")),
    ["Pratinjau ikut berganti ke profil terbaru, misalnya nama bisnis.", "Klik Simpan & Terbitkan supaya klien melihat versi baru."], null,
    clipped(727, 106, 390, 784, landingTop(727, 106, "Rina Undangan"))),

  // ---------------------------------------------------------------- form-data-klien
  "jualan-form-klien": {
    title: "Klien mengisi form data undangan",
    world: PHONE,
    base: [scr(FY0, fkHead, K1.svg)],
    els: {
      pgc: { svg: scr(FY0, fkHead, K1.svg, qrChk), enter: "fade" },
      s2: { svg: sheet(fkHead, K2.svg), enter: "fade", delay: 0.15 },
      err: { svg: sheet(fkHead, K2e.svg), enter: "fade", delay: 0.1 },
      nameBg: { svg: scr(FY0, lpFocus(nameY)), enter: "fade" },
      nameT: { svg: scr(FY0, body(text(55.5, nameY + 30, "Rani Kusuma", { size: 16, fill: LP.ink }))) },
      nameOff: { svg: scr(FY0, body(lpRing(nameY, LP.tint))), enter: "fade" },
      waBg: { svg: scr(FY0, lpFocus(waY)), enter: "fade" },
      waT: { svg: scr(FY0, body(text(55.5, waY + 30, "0812 3456 7890", { size: 16, fill: LP.ink }))) },
      s10: { svg: sheet(fkHead, K10.svg), enter: "fade" },
      sub: { svg: scr(FY0, body(lpBtn(41.5, K10.pos.next, "kirim data", { solid: true, w: 307 }))) },
      done: { svg: sheet(fkHead, KD.svg), enter: "fade", delay: 0.2 }
    },
    steps: [
      { caption: "Langkah 1 dari 10, Pesanan: Paket, Fitur undangan, dan Desain.", dur: 3.2 },
      { caption: "Centang fitur yang dipesan, misalnya QR check-in tamu.", at: [70, qr[1] + qr[2] / 2 - FY0], click: true, show: ["pgc"], dur: 3.2 },
      { caption: "Gulir ke bawah, lalu tekan lanjut.", scroll: { id: "pgc", dy: FDY }, at: [195, K1.pos.next + 26 - FY0 - FDY], click: true, show: ["s2"], dur: 3.6 },
      { caption: "Langkah 2, Pemesan. Lanjut saat Nama kosong: Nama wajib diisi.", at: [195, K2.pos.next + 26 - FY0], click: true, show: ["err"], dur: 3.4 },
      { caption: "Kolom bertanda * wajib. Klik Nama, lalu ketik namanya.", at: [195, nameY + 24 - FY0], click: true, show: ["nameBg", "nameT"], type: [{ id: "nameT", n: 11, box: [55, nameY + 4 - FY0, 100, 40] }], dur: 3.4 },
      { caption: "Isi juga WhatsApp, lalu tekan lanjut sampai langkah terakhir.", at: [195, waY + 24 - FY0], click: true, show: ["nameOff", "waBg", "waT"], type: [{ id: "waT", n: 14, box: [55, waY + 4 - FY0, 120, 40] }], dur: 3.4 },
      { caption: "Langkah 10, Catatan: hal lain untuk undangan.", hide: ["err", "nameBg", "nameT", "nameOff", "waBg", "waT", "s2", "pgc"], show: ["s10", "sub"], dur: 2.8 },
      { caption: "Tekan kirim data: Data terkirim ke Pesanan masuk.", at: [195, K10.pos.next + 26 - FY0], click: true, press: "sub", show: ["done"], dur: 3.4 }
    ]
  },

  "jualan-link-form": {
    title: "Menyalin Link form klien dari Pesanan masuk",
    world: RAILW(560),
    base: kontenEd("Undangan Rani & Dimas", SAMPLE),
    els: {
      inbox: { svg: ed(ordersDlg), enter: "fade" },
      link: { svg: ed(rect(16, 372, 366, 260, { fill: C.white }), linkOpen), enter: "fade" },
      salin: { svg: ed(salinBtn), enter: "fade" },
      ok: { svg: ed(nkHint(28 + SALIN_W + 8, 557, "Tersalin.")), enter: "fade", delay: 0.15 }
    },
    steps: [
      { caption: "Buka panel NikahKit di halaman undangan.", dur: 2.6 },
      { caption: "Klik ikon kotak masuk di kepala panel. Pesanan masuk terbuka.", at: P(236, 122), click: true, show: ["inbox"], dur: 3.2 },
      { caption: "Klik Link form klien (opsional). Alamat link form tampil.", at: P(200, 402), click: true, show: ["link", "salin"], dur: 3.4 },
      { caption: "Klik Salin link form: Tersalin. Tempel di chat WhatsApp klien.", at: P(28 + SALIN_W / 2, 552), click: true, press: "salin", show: ["ok"], dur: 3.6 }
    ]
  },

  // ---------------------------------------------------------------- pesanan-masuk
  "jualan-pesanan-masuk": {
    title: "Mengisi undangan dari Pesanan masuk",
    world: RAILW(808),
    base: [...kontenEd("Undangan Rani & Dimas", SAMPLE), ed(inboxCount("1"))],
    els: {
      hl: { svg: ed(ring(221, 107, 30, 30, { r: 8 })), enter: "fade", delay: 0.4 },
      inbox: { svg: ed(ordersDlg), enter: "fade" },
      lbl: { svg: ed(ring(331 - tw("Baru", 10, 500) - 12, ROW1 + 19, tw("Baru", 10, 500) + 12, 18, { r: 12 }), ring(331 - tw("Sudah diisi", 10, 500) - 12, ROW2 + 19, tw("Sudah diisi", 10, 500) + 12, 18, { r: 12 })), enter: "fade", delay: 0.3 },
      memuat: { svg: ed(rect(270, ROW1 + 16, 64, 24, { fill: C.white }), badgeAt(331, ROW1 + 19, "Memuat…", "off")), enter: "fade" },
      ...filled()
    },
    steps: [
      { caption: "Buka halaman undangan klien di editor, tab NikahKit.", dur: 2.6 },
      { caption: "Angka merah di ikon kotak masuk: ada pesanan yang belum diisi.", show: ["hl"], dur: 3 },
      { caption: "Klik ikonnya. Layar Pesanan masuk terbuka, terbaru di atas.", at: P(236, 122), click: true, hide: ["hl"], show: ["inbox"], dur: 3.2 },
      { caption: "Baru: belum dipakai. Sudah diisi: sudah pernah kamu klik.", show: ["lbl"], dur: 3.2 },
      { caption: "Klik nama pasangan berlabel Baru.", at: P(150, ROW1 + 20), click: true, hide: ["lbl"], show: ["memuat"], dur: 3 },
      { caption: "Semua kolom terisi sesuai paketnya. Salah halaman? Klik Urungkan.", hide: ["inbox", "memuat"], show: ["konten", "t1"], dur: 4 }
    ]
  },
  "jualan-pesanan-terbit": pubScene("Ganti foto, lalu terbitkan undangan", "Undangan Rani & Dimas", invite(RANI),
    ["Foto tidak ikut terisi: ganti foto contoh di pratinjau.", "Lalu klik Simpan & Terbitkan."], ring(833, 309, 178, 239, { r: 12 })),

  "jualan-tempel-pesanan": {
    title: "Tempel data pesanan dari pesan WhatsApp",
    world: RAILW(808),
    base: kontenEd("Undangan Rani & Dimas", SAMPLE),
    els: {
      wa: { svg: ed(waBubble), enter: "rise" },
      waHl: { svg: ed(ring(24, 300, 352, 200, { r: 12 })), enter: "fade", delay: 0.4 },
      inbox: { svg: ed(ordersDlg), enter: "fade" },
      paste: { svg: ed(pasteOpen(false)), enter: "fade" },
      pasted: { svg: ed(pasteOpen(true)), enter: "fade" },
      isi: { svg: ed(nkBtn(28, 488, "Isi undangan")) , enter: "fade" },
      ...filled({ toast: 0.3 })
    },
    steps: [
      { caption: "Di WhatsApp, salin seluruh pesan klien, termasuk baris #data-undangan.", show: ["wa", "waHl"], dur: 3.6 },
      { caption: "Buka Pesanan masuk lewat ikon kotak masuk.", at: P(236, 122), click: true, hide: ["wa", "waHl"], show: ["inbox"], dur: 3.2 },
      { caption: "Klik Tempel data pesanan. Kotak teks muncul.", at: P(200, 344), click: true, show: ["paste"], dur: 3.2 },
      { caption: "Klik di kotak, tekan Ctrl+V (Windows) atau Cmd+V (Mac).", at: P(200, 428), click: true, show: ["pasted", "isi"], dur: 3.4 },
      { caption: "Klik Isi undangan: panel pindah ke Konten, ada tombol Urungkan.", at: P(70, 506), click: true, press: "isi", hide: ["inbox", "paste", "pasted", "isi"], show: ["konten", "t1"], dur: 4 }
    ]
  },

  "jualan-hapus-pesanan": {
    title: "Menghapus pesanan dari Pesanan masuk",
    world: RAILW(560),
    base: [...kontenEd("Undangan Rani & Dimas", SAMPLE), ed(ordersDlg)],
    els: {
      row: { svg: ed(hapusRow), enter: "fade" },
      hapus: { svg: ed(hapusBtn), enter: "pop", origin: P(357, ROW2 + 28) },
      gone: { svg: ed(afterDelete), enter: "fade", delay: 0.15 }
    },
    steps: [
      { caption: "Klik ikon tempat sampah di baris pesanan. Muncul Hapus? merah.", at: P(357, ROW2 + 28), click: true, show: ["row", "hapus"], dur: 3.4 },
      { caption: "Klik Hapus? untuk memastikan. Pesanan hilang dari daftar.", at: P(HAPUS_X + HAPUS_W / 2, ROW2 + 28), click: true, press: "hapus", hide: ["row", "hapus"], show: ["gone"], dur: 3.6 }
    ]
  },

  // ---------------------------------------------------------------- checklist-serah
  "jualan-checklist": {
    title: "Checklist sebelum menyerahkan undangan ke klien",
    world: { x: 90, y: 10, w: 820, h: 780 }, bg: "#eef1f5",
    base: [rect(0, 0, 1000, 800, { fill: "#eef1f5" }), shadow(110, 30, 780, 740, 6, 3), rect(110, 30, 780, 740, { r: 6, fill: C.white }), text(CKX, 90, "Checklist serah undangan", { size: 28, weight: 700, fill: C.ink }),
      text(CKX, 122, "Centang setiap baris sebelum mengirim pesan untuk pengantin.", { size: 16, fill: C.text }),
      ...CHECK.map((l, i) => rect(CKX + 1, CKY(i) + 1, 24, 24, { r: 5, stroke: C.faint, sw: 2 }) + text(CKX + 44, CKY(i) + 19, l, { size: 18, fill: C.ink }) +
        line(CKX, CKY(i) + 42, 850, CKY(i) + 42, { stroke: C.line }))],
    els: Object.fromEntries(CHECK.map((_, i) => [`k${i}`, { svg: rect(CKX, CKY(i), 26, 26, { r: 5, fill: C.ok }) + iconX("check", CKX + 13, CKY(i) + 13, 18, C.white, 3), enter: "pop", origin: [CKX + 13, CKY(i) + 13] }])),
    steps: [
      { caption: "Isi undangan: Konten, foto contoh, dan musik.", show: ["k0", "k1", "k2"], dur: 3.4 },
      { caption: "Halaman tersimpan dengan slug, lalu Simpan & Terbitkan.", show: ["k3", "k4"], dur: 3.2 },
      { caption: "Coba sebagai tamu, buat PIN, salin pesan untuk pengantin.", show: ["k5", "k6", "k7"], dur: 3.6 },
      { caption: "Bila dipakai: Undangan khusus dan kode staff hari-H.", show: ["k8", "k9"], dur: 3.2 },
      { caption: "Semua tercentang: kirim pesan untuk pengantin.", dur: 2.8 }
    ]
  }
};
// Flow cards and checklist rows enter in reading order within each step.
for (const k of ["jualan-alur", "jualan-checklist"]) for (const st of scenes[k].steps) (st.show ?? []).forEach((id, n) => (scenes[k].els[id].delay = 0.1 + n * (k === "jualan-alur" ? 0.18 : 0.08)));
