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
const cam = (x, y, w) => ({ x, y: y + OY, w });
const EW = { w: 1440, h: 985 };
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
const RANI = { nick: "Rani", full: "Rani Ayu, S.Psi.", job: "Psikolog", parents: "Putri kedua dari Bapak Ahmad & Almh. Ibu Siti" };
const SINTA = { nick: "Sinta", full: "Sinta Maharani, S.E.", job: "Akuntan", parents: "Putri pertama dari Bapak Hadi & Ibu Ratna" };

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
const ordersDlg = nkDialogHead(0, 0, "Pesanan masuk") + nkHint(16, 181, "Klik nama untuk mengisi semua kolom sesuai paketnya.") +
  rect(16.5, 189.5, 365, 113, { r: 4, fill: C.white, stroke: C.line }) + line(17, 246.5, 381, 246.5) +
  orderRow(ROW1, "Sinta & Bayu", "Basic + QR check-in tamu · 14 Okt, 10.20", "") + orderRow(ROW2, "Ayu & Fajar", "Premium · 2 Okt, 09.00", badgeAt(331, ROW2 + 19, "Sudah diisi", "ok")) +
  [[319, "Tempel data pesanan"], [377, "Link form klien (opsional)"]].map(([y, l]) => rect(16.5, y + 0.5, 365, 49, { r: 4, fill: C.white, stroke: C.line }) + icon("chevron-right", 38, y + 25, 18, C.strong) + text(59, y + 30, l, { size: 14, weight: 500 })).join("");

// ---- Flow diagram and checklist ----------------------------------------------------------------------------------
const FLOW = [
  ["smartphone", "Klien buka Landing page", ["Lihat desain, paket dan", "harga, lalu cara pesan"], "Klien"],
  ["pencil", "Klien isi form", ["Tekan kirim data, muncul", "Data terkirim"], "Klien"],
  ["inbox", "Masuk ke Pesanan masuk", ["Ikon kotak masuk di", "kepala panel NikahKit"], "Kamu"],
  ["mouse-pointer-click", "Klik nama klien", ["Semua kolom undangan", "terisi otomatis"], "Kamu"],
  ["image", "Ganti foto, terbitkan", ["Ganti foto contoh, lalu", "Simpan & Terbitkan"], "Kamu"],
  ["send", "Kirim PIN dan pesan", ["PIN dashboard dan pesan", "untuk pengantin"], "Kamu"],
  ["users", "Kirim undangan ke tamu", ["Tautan per tamu dari", "Dashboard > Kirim"], "Pengantin"],
  ["calendar-check", "Hari-H: check-in", ["Penerima tamu memindai", "QR tamu"], "Staff"],
  ["eye", "Buka untuk semua", ["Setelah acara, di Dashboard", "> Pengaturan"], "Pengantin"]
];
const FX = [40, 470, 900], FY = [100, 320, 540], FW = 340, FH = 150;
const flowPos = (i) => { const r = Math.floor(i / 3), c = r === 1 ? 2 - (i % 3) : i % 3; return [FX[c], FY[r]]; };
function flowCard(i) {
  const [x, y] = flowPos(i), [ic, t, sub, who] = FLOW[i], tone = { Klien: ["#e8f6fb", C.action], Kamu: [C.tint, C.accent], Pengantin: [C.okSoft, C.ok], Staff: ["#f2f5fa", C.strong] }[who], whoFill = tone[0], whoFg = tone[1];
  return shadow(x, y, FW, FH, 14, 2) + rect(x, y, FW, FH, { r: 14, fill: C.white }) + rect(x + 20, y + 22, 44, 44, { r: 12, fill: whoFill }) + icon(ic, x + 42, y + 44, 22, whoFg) +
    text(x + 80, y + 40, `Langkah ${i + 1}`, { size: 12, weight: 600, fill: C.faint }) + text(x + 80, y + 64, t, { size: 18, weight: 700, fill: C.ink }) +
    para(x + 80, y + 92, sub, { size: 15, fill: C.text, lh: 21 }) + rect(x + FW - 20 - tw(who, 12, 600) - 20, y + 20, tw(who, 12, 600) + 20, 24, { r: 12, fill: whoFill }) +
    text(x + FW - 20 - (tw(who, 12, 600) + 20) / 2, y + 36, who, { size: 12, weight: 600, fill: whoFg, anchor: "middle" });
}
const arrowHead = (x, y, dir) => { const d = { r: [-9, -6, -9, 6], l: [9, -6, 9, 6], d: [-6, -9, 6, -9] }[dir]; return `<path d="M${x + d[0]} ${y + d[1]} L${x} ${y} L${x + d[2]} ${y + d[3]}" fill="none" stroke="${C.accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`; };
function flowArrow(i) {
  const [x1, y1] = flowPos(i), [x2, y2] = flowPos(i + 1);
  if (y1 === y2) { const l = x2 > x1, ax = l ? x1 + FW + 12 : x1 - 12, bx = l ? x2 - 12 : x2 + FW + 12, ay = y1 + FH / 2; return line(ax, ay, bx, ay, { stroke: C.accent, sw: 2.5, cap: "round" }) + arrowHead(bx, ay, l ? "r" : "l"); }
  const ax = x1 + FW / 2; return line(ax, y1 + FH + 12, ax, y2 - 12, { stroke: C.accent, sw: 2.5, cap: "round" }) + arrowHead(ax, y2 - 12, "d");
}
const CHECK = ["Konten: nama, orang tua, tanggal, jam, alamat, peta", "Semua foto contoh sudah diganti", "Musik sudah diatur", "Slug terisi (min. 3 karakter), halaman tersimpan",
  "Simpan & Terbitkan", "Dicoba sebagai tamu (?to=Nama) di komputer dan HP", "Ucapan percobaan dirapikan", "PIN dashboard dibuat", "Pesan untuk pengantin tersalin, ada tautan Kelola undangan",
  "Undangan khusus dicek (bila dipakai)", "Kode staff hari-H dibuat (bila dipakai)", "Pesanan di Pesanan masuk berlabel Sudah diisi"];
const CKX = 150, CKY = (i) => 168 + i * 58;

// ---- Scenes ------------------------------------------------------------------------------------------------------
const lpCam = (y, w = 760) => ({ x: 195 - w / 2, y, w });
const LAND = landingTop(0, 0, "Rina WO");
const F0 = formTail(0, LPY.card, PESANAN);
const F1 = formTail(0, LPY.card, { ...PESANAN, picked: ["Pilihan kalian: desain Dasar"], desain: "Dasar" });
const PICKED2 = ["Pilihan kalian: Paket Basic, desain", "Dasar"];
const F2 = formTail(0, LPY.card, { ...PESANAN, picked: PICKED2, desain: "Dasar", paket: "Basic" });
// Lihat demo dialog: viewport = katalog top (805) .. +844; dialog 358 wide, centred.
const DLG_TOP = 919, DLG = { img: DLG_TOP + 1.5, body: DLG_TOP + 449 };
const demoDlg = body(rect(0, LPY.katalog, 390, 844, { fill: "rgba(23,16,8,.55)" }) + rect(16.75, DLG_TOP + 0.75, 356.5, 614, { r: 16, fill: LP.paper, stroke: LP.cocoa, sw: 1.5 }) +
  clipped(18, DLG.img, 354, 446, pageSketch(18, DLG.img, 354, 446, TPL[0][2])) + line(18, DLG.body, 372, DLG.body, { stroke: LP.cocoa, sw: 1 }) +
  h(37, DLG.body + 43, "Dasar", 26) + text(37, DLG.body + 74, "Polos · 20 bagian · HP & desktop · ID/EN", { size: 15, fill: LP.muted }) +
  lpBtn(37, DLG.body + 100, "Pakai desain ini", { solid: true }));
const DLG_PICK = [37 + lpBtnW("Pakai desain ini") / 2, DLG.body + 126];
const demoClose = body(lpBtn(37 + lpBtnW("Pakai desain ini") + 10, DLG.body + 100, "Tutup", { secondary: true }));

// form-klien world: the #pesan section from its top.
const FK = { top: 0, card: LPY.card - LPY.pesan };
const fkHead = body(rect(0, 0, 390, FK.card, { fill: LP.paper }) + dash(20, 0, 350) + h(20, 87, "Isi data pesanan", 32) +
  para(20, 125, ["Data langsung terkirim ke Rina WO. Yang", "belum siap boleh dikosongkan dan", "dilengkapi lewat WhatsApp."], { size: 17, fill: LP.muted, lh: 26.35 }));
const K1 = formTail(0, FK.card, { ...PESANAN, picked: PICKED2, desain: "Dasar", paket: "Basic" });
const K2 = formTail(0, FK.card, PEMESAN);
const K2e = formTail(0, FK.card, { ...PEMESAN, bad: true, status: "Nama wajib diisi." });
const K10 = formTail(0, FK.card, CATATAN);
const KD = formTail(0, FK.card, { done: true });
const qr = K1.pos.picks[4];
const qrChk = body(rect(qr[0] + 0.5, qr[1] + 0.5, 306, qr[2] - 1, { r: 8, stroke: LP.cocoa }) + rect(qr[0] + 14, qr[1] + qr[2] / 2 - 10, 20, 20, { r: 3, fill: LP.cocoa }) +
  iconX("check", qr[0] + 24, qr[1] + qr[2] / 2, 15, LP.paper, 3));
const [nameY, waY] = K2.pos.fields;
// Pointer arrival (= click) inside a step, as lib.mjs times it: focus borders appear then, typing follows.
const tc = (dur) => Math.max(0.6, dur * 0.35);
const lpRing = (y, stroke) => rect(40, y - 1.5, 310, 51, { r: 9.5, stroke, sw: 3 });
const lpFocus = (y) => body(rect(42, y + 1.5, 304, 45, { r: 7, fill: LP.paper }) + rect(42.25, y + 0.75, 305.5, 46.5, { r: 8, stroke: LP.cocoa, sw: 1.5 }) + lpRing(y, "rgba(184,70,13,.28)"));

export const scenes = {
  // ---------------------------------------------------------------- alur-dengan-klien
  "jualan-alur": {
    title: "Alur jualan undangan dari klien sampai hari-H",
    world: { w: 1280, h: 740 }, bg: C.tint,
    base: [rect(0, 0, 1280, 740, { fill: C.tint }), text(640, 60, "Alur kerja vendor dengan NikahKit", { size: 28, weight: 700, fill: C.ink, anchor: "middle" })],
    els: Object.fromEntries(FLOW.flatMap((_, i) => [[`c${i}`, { svg: flowCard(i), enter: "pop", delay: i % 2 ? 0.5 : 0.2, origin: [flowPos(i)[0] + FW / 2, flowPos(i)[1] + FH / 2] }],
      ...(i < 8 ? [[`a${i}`, { svg: flowArrow(i), enter: "fade", delay: 0.45 }]] : [])])),
    steps: [
      { caption: "Klien membuka Landing page kamu, lalu mengisi form data undangan.", cam: { x: 20, y: 70, w: 860 }, show: ["c0", "a0", "c1"], dur: 3.4 },
      { caption: "Kiriman masuk ke Pesanan masuk. Klik nama klien: undangan terisi.", cam: { x: 420, y: 80, w: 860 }, show: ["a1", "c2", "a2", "c3"], dur: 3.6 },
      { caption: "Ganti foto contoh, terbitkan, lalu kirim PIN dan pesan untuk pengantin.", cam: { x: 20, y: 290, w: 860 }, show: ["a3", "c4", "a4", "c5"], dur: 3.8 },
      { caption: "Pengantin membuat tautan per tamu, lalu check-in di hari-H.", cam: { x: 20, y: 300, w: 860 }, show: ["a5", "c6", "a6", "c7"], dur: 3.6 },
      { caption: "Setelah acara, pengantin bisa menyalakan Buka untuk semua.", cam: { x: 420, y: 300, w: 860 }, show: ["a7", "c8"], dur: 3.2 },
      { caption: "Itu seluruh alurnya: empat peran, sembilan langkah.", cam: "all", dur: 3.4 }
    ]
  },

  // ---------------------------------------------------------------- profil-merek
  "jualan-profil-merek": {
    title: "Mengisi Profil merek di Template > Marketing",
    world: EW,
    base: [...shell({ page: "Undangan Rani & Dimas", rail: "Konten" }), ed(nkHead(0, 0, "Konten"), kontenBody, invite(RANI))],
    els: {
      tpl: { svg: ed(nkRail(0, 0, "Template"), tplPanel()), enter: "fade", delay: 1.25 },
      mk: { svg: ed(bodyBg, bodyClip(kindSeg("marketing"), brandOpen())), enter: "fade", delay: 1.25 },
      nameFocus: { svg: ed(nkInput(101, 300, 253, "", { focus: true })), enter: "fade", delay: tc(3.2) },
      nameBlur: { svg: ed(nkInput(101, 300, 253, "")), enter: "fade", delay: tc(3.4) },
      nameV: { svg: ed(text(111, 323, "Rina WO", { size: 14 })) },
      waFocus: { svg: ed(nkInput(101, 368, 253, "", { focus: true })), enter: "fade", delay: tc(3.4) },
      waV: { svg: ed(text(111, 391, "0812 3456 7890", { size: 14 })) },
      body2: { svg: ed(rect(72, 153, 327, 1100, { fill: C.white }), kindSeg("marketing"), brandOpen({ name: "Rina WO", wa: "0812 3456 7890" })), enter: "fade" },
      pkFocus: { svg: ed(nkInput(111, 368, 233, "", { focus: true })), enter: "fade", delay: tc(3.6) },
      pkBlur: { svg: ed(nkInput(111, 368, 233, "")), enter: "fade", delay: tc(3.4) },
      pkName: { svg: ed(text(121, 391, "Basic", { size: 14 })) },
      prFocus: { svg: ed(nkInput(111, 436, 233, "", { focus: true })), enter: "fade", delay: tc(3.4) },
      pkPrice: { svg: ed(text(121, 459, "150.000", { size: 14 })) },
      done: { svg: ed(bodyBg, bodyClip(kindSeg("marketing"), brandClosed(BOX), mkCards(MKY))), enter: "fade", delay: tc(3.4) + 0.15 },
      cover: cover({ page: "Undangan Rani & Dimas", rail: "Template" }, "Template")
    },
    steps: [
      { caption: "Di tab NikahKit, klik Template di rel kiri.", cam: { x: 0, y: 40, w: 1000 }, at: P(36, 130), click: true, show: ["tpl"], dur: 3.2 },
      { caption: "Di Kategori, klik Marketing. Kotak Profil merek terbuka: Belum diisi.", cam: cam(68, 100, 520), at: P(...SEG.marketing), click: true, show: ["mk"], dur: 3.4 },
      { caption: "Klik Nama bisnis, lalu ketik nama bisnismu.", cam: cam(68, 150, 520), at: P(228, 318), click: true, show: ["nameFocus", "nameV"], type: [{ id: "nameV", n: 7, box: [111, 303 + OY, 70, 30] }], dur: 3.2 },
      { caption: "Klik Nomor WhatsApp, lalu ketik nomornya, misalnya 0812 3456 7890.", at: P(228, 386), click: true, show: ["nameBlur", "waFocus", "waV"], type: [{ id: "waV", n: 14, box: [111, 371 + OY, 110, 30] }], dur: 3.4 },
      { caption: "Gulir ke paket pertama (1 sampai 3 paket), lalu isi Nama paket.", cam: cam(68, 260, 520), at: P(228, 386), click: true, show: ["body2", "pkFocus", "pkName"],
        hide: ["nameFocus", "nameBlur", "nameV", "waFocus", "waV"], scroll: { id: "body2", dy: SCROLL }, type: [{ id: "pkName", n: 5, box: [121, 371 + OY, 36, 30] }], dur: 3.6 },
      { caption: "Isi Harga (Rp). Tambah paket untuk paket kedua dan ketiga.", at: P(228, 454), click: true, show: ["pkBlur", "prFocus", "pkPrice"], type: [{ id: "pkPrice", n: 7, box: [121, 439 + OY, 50, 30] }], dur: 3.4 },
      { caption: "Klik Simpan profil. Kotak menutup dengan label Terisi.", cam: cam(0, 215, 1000), at: P(156, 1067 - SCROLL), click: true, show: ["done"], dur: 3.4 }
    ]
  },

  // ---------------------------------------------------------------- pasang-dashboard-pasangan
  "jualan-pasang-dashboard": {
    title: "Memasang Dashboard pasangan di halaman Scalev sendiri",
    world: EW,
    base: [...shell({ page: "Dashboard Rina WO", rail: "Template", screenFill: C.white }), ed(tplPanel({ head: { inbox: false } }))],
    els: {
      mk: { svg: ed(mkPanel()), enter: "fade", delay: 1.25 },
      dlg: { svg: ed(rect(0, 0, 1440, 900, { fill: "rgba(255,255,255,.92)" }), shadow(540, 383, 360, 134, 8, 3), rect(540, 383, 360, 134, { r: 8, fill: C.white }),
        text(560, 418, "Pasang Dashboard pasangan di halaman ini?", { size: 14, weight: 600 }), nkHint(560, 442, "Seluruh isi halaman diganti. Bisa diurungkan."),
        nkBtn(745, 461, "Batal", { variant: "quiet", w: 63 })), enter: "pop", origin: P(720, 450), delay: 1.2 },
      pasang: { svg: ed(nkBtn(816, 461, "Pasang", { w: 64 })), enter: "pop", origin: P(720, 450), delay: 1.2 },
      dash: { svg: ed(dashPreview, rect(72, 153, 327, 747, { fill: C.white }), bodyClip(kindSeg("marketing"), brandClosed(219), mkCards(MKY, "dashboard"))), enter: "fade" },
      t1: { svg: ed(nkToast(["Dashboard pasangan dipasang.", "Tekan Simpan di Scalev."])), enter: "slide", delay: 0.3 },
      pub: pubBtn
    },
    steps: [
      { caption: "Halaman HTML Mode baru yang kosong. Buka NikahKit > Template.", cam: "all", dur: 3 },
      { caption: "Di Kategori, klik Marketing.", cam: cam(68, 100, 520), at: P(...SEG.marketing), click: true, show: ["mk"], dur: 3.2 },
      { caption: "Klik kartu Dashboard pasangan. Muncul dialog konfirmasi.", cam: cam(40, 150, 900), at: P(155, 360), click: true, show: ["dlg", "pasang"], dur: 3.6 },
      { caption: "Klik Pasang. Seluruh isi halaman diganti, bisa diurungkan.", at: P(848, 479), click: true, press: "pasang", dur: 3 },
      { caption: "Pratinjau jadi Kelola undangan. Kartu Dashboard pasangan: Dipakai.", cam: cam(0, 250, 1180), hide: ["dlg", "pasang"], show: ["dash", "t1"], dur: 3.8 },
      { caption: "Klik Simpan & Terbitkan. Alamat halaman ini jadi alamat Dashboard.", cam: cam(840, 0, 600), at: PUB, click: true, press: "pub", dur: 3.4 }
    ]
  },

  // Bagikan in an invitation after the dashboard is installed.
  "jualan-bagikan-pengantin": {
    title: "Tombol Untuk pengantin di Bagikan",
    world: EW,
    base: [...shell({ page: "Undangan Rani & Dimas", rail: "Konten" }), ed(nkHead(0, 0, "Konten"), kontenBody, invite(RANI))],
    els: {
      share: { svg: ed(shareDlg), enter: "fade", delay: 1.2 },
      buka: { svg: ed(bukaDash), enter: "fade", delay: 1.2 },
      hl: { svg: ed(ring(16, 595, 366, 126, { r: 6 })), enter: "fade", delay: 0.4 },
      ci: { svg: ed(line(384, 677, 430, 640, { stroke: C.accent, sw: 2 }), circle(384, 677, 4, { fill: C.accent }), rect(430, 596, 280, 64, { r: 12, fill: C.accent }),
        para(446, 622, ["Buka Check-in: hanya bila Undangan", "khusus dan QR masuk menyala"], { size: 14, weight: 600, fill: C.white, lh: 20 })), enter: "fade", delay: 0.3 },
      tab: { svg: chrome(0, 0, 1440, 985, { tabs: [{ title: "Landing Page Studio", fav: favScalev }, { title: "Kelola undangan", active: true }], url: "tokomu.myscalev.com/kelola?w=...#beranda" }) +
        rect(0, 85, 1440, 900, { fill: "#f5f4f2" }) + gate(525, 340), enter: "fade", delay: 1.3 }
    },
    steps: [
      { caption: "Buka undangan klien di editor, tab NikahKit.", cam: "all", dur: 2.8 },
      { caption: "Klik Bagikan di rel kiri.", cam: cam(0, 92, 620), at: P(36, 585), click: true, show: ["share", "buka"], dur: 3.2 },
      { caption: "Untuk pengantin: Kirim undangan dan Buka Dashboard.", cam: cam(0, 440, 620), show: ["hl"], dur: 3.4 },
      { caption: "Buka Check-in muncul bila Undangan khusus dan QR masuk menyala.", cam: cam(0, 440, 980), hide: ["hl"], show: ["ci"], dur: 3.8 },
      { caption: "Klik Buka Dashboard: Kelola undangan terbuka di tab baru.", cam: { x: 0, y: 0, w: 1440 }, at: P(199, 677), click: true, press: "buka", hide: ["ci"], show: ["tab"], dur: 3.4 },
      { caption: "Pengantin masuk dengan PIN dashboard.", cam: { x: 340, y: 320, w: 760 }, dur: 3 }
    ]
  },

  // ---------------------------------------------------------------- landing-page
  "jualan-landing-page": {
    title: "Isi Landing page member di HP klien",
    world: { w: 390, h: 4000 },
    base: [shadow(0, 0, 390, 4000, 0, 2), LAND, F0.svg],
    els: {
      dlg: { svg: demoDlg, enter: "pop", origin: [195, 1227], delay: 1.25 },
      tutup: { svg: demoClose, enter: "pop", origin: [195, 1227], delay: 1.25 },
      pick: { svg: body(lpBtn(37, DLG.body + 100, "Pakai desain ini", { solid: true })), enter: "pop", origin: [195, 1227], delay: 1.25 },
      f1: { svg: F1.svg, enter: "fade" },
      p2: { svg: body(lpBtn(45, LPY.pkg1 + 218, "Pilih paket ini", { solid: true, w: 300 })) },
      f2: { svg: F2.svg, enter: "fade" }
    },
    steps: [
      { caption: "Pembuka: nama bisnismu, Pesan undangan, dan Lihat desain.", cam: lpCam(0), at: [287, LPY.cta + 26], click: true, dur: 3.4 },
      { caption: "Lihat desain turun ke katalog. Klien menekan Lihat demo.", cam: lpCam(860, 1200), at: [62, LPY.grid + 322], click: true, show: ["dlg", "tutup", "pick"], dur: 3.8 },
      { caption: "Gambar desain tampil lebih besar. Klik Pakai desain ini.", at: DLG_PICK, click: true, press: "pick", dur: 3.2 },
      { caption: "Halaman turun ke form: Pilihan kalian: desain Dasar.", cam: lpCam(LPY.card - 20), hide: ["dlg", "tutup", "pick"], show: ["f1"], dur: 3.4 },
      { caption: "Di Paket dan harga, klien menekan Pilih paket ini.", cam: lpCam(LPY.pkg1 - 40), at: [195, LPY.pkg1 + 244], click: true, press: "p2", dur: 3.2 },
      { caption: "Form mencatat pilihannya: Paket Basic, desain Dasar.", cam: lpCam(LPY.card - 20), show: ["f2"], dur: 3.6 }
    ]
  },

  "jualan-perbarui-landing": {
    title: "Memperbarui Landing page setelah Profil merek diubah",
    world: EW,
    base: [...shell({ page: "Landing Rina WO", rail: "Template" }), ed(clipped(727, 106, 390, 784, landingTop(727, 106, "Rina Undangan")), nkHead(0, 0, "Template", { inbox: false }), bodyBg,
      bodyClip(kindSeg("marketing"), brandClosed(219), rect(88.5, 277.5, 278, 49, { r: 4, fill: C.warnSoft, stroke: "#fde7c7" }),
        para(99, 298, ["Profil merek", "berubah."], { size: 12, fill: C.strong, lh: 16 }), mkCards(339, "landing")))],
    els: {
      perbarui: { svg: ed(nkBtn(216, 286, "Perbarui halaman ini", { variant: "quiet", h: 32, w: 140 })) },
      hl: { svg: ed(ring(88, 277, 279, 50, { r: 6 })), enter: "fade", delay: 0.4 },
      after: { svg: ed(bodyBg, bodyClip(kindSeg("marketing"), brandClosed(219), mkCards(MKY, "landing")), clipped(727, 106, 390, 784, landingTop(727, 106, "Rina WO"))), enter: "fade", delay: 1.3 },
      t1: { svg: ed(nkToast(["Landing page dipasang. Tekan", "Simpan di Scalev."])), enter: "slide", delay: 1.45 },
      pub: pubBtn
    },
    steps: [
      { caption: "Buka halaman Landing page kamu: NikahKit > Template > Marketing.", cam: "all", dur: 3.2 },
      { caption: "Profil diubah setelah dipasang? Muncul Profil merek berubah.", cam: cam(0, 100, 620), show: ["hl"], dur: 3.4 },
      { caption: "Klik Perbarui halaman ini. Halaman langsung dipasang ulang.", cam: cam(0, 250, 1180), at: P(286, 302), click: true, press: "perbarui", hide: ["hl"], show: ["after", "t1"], dur: 3.8 },
      { caption: "Klik Simpan & Terbitkan supaya klien melihat versi baru.", cam: cam(840, 0, 600), at: PUB, click: true, press: "pub", dur: 3.4 }
    ]
  },

  // ---------------------------------------------------------------- form-data-klien
  "jualan-form-klien": {
    title: "Klien mengisi form data undangan",
    world: { w: 390, h: 1500 },
    base: [shadow(0, 0, 390, 1500, 0, 2), fkHead, K1.svg],
    els: {
      chk: { svg: qrChk, enter: "fade", delay: 1.15 },
      s2: { svg: K2.svg, enter: "fade" },
      err: { svg: K2e.svg, enter: "fade", delay: 1.45 },
      n1: { svg: body(lpBtn(41.5, K1.pos.next, "lanjut", { solid: true, w: 307 })) },
      nameBg: { svg: lpFocus(nameY), enter: "fade", delay: tc(3.4) },
      nameT: { svg: body(text(55.5, nameY + 30, "Rani Kusuma", { size: 16, fill: LP.ink })) },
      nameOff: { svg: body(lpRing(nameY, LP.tint)), enter: "fade", delay: tc(3.4) },
      waBg: { svg: lpFocus(waY), enter: "fade", delay: tc(3.4) },
      waT: { svg: body(text(55.5, waY + 30, "0812 3456 7890", { size: 16, fill: LP.ink })) },
      s10: { svg: K10.svg, enter: "fade" },
      sub: { svg: body(lpBtn(41.5, K10.pos.next, "kirim data", { solid: true, w: 307 })) },
      done: { svg: rect(0, FK.card - 2, 390, 1500 - FK.card, { fill: LP.paper }) + KD.svg, enter: "fade", delay: tc(3.8) + 0.2 }
    },
    steps: [
      { caption: "Langkah 1 dari 10, Pesanan: Paket, Fitur undangan, dan Desain.", cam: lpCam(FK.card - 20), dur: 3.2 },
      { caption: "Centang fitur yang dipesan, misalnya QR check-in tamu.", cam: lpCam(qr[1] - 230), at: [70, qr[1] + qr[2] / 2], click: true, show: ["chk"], dur: 3.2 },
      { caption: "Tekan lanjut untuk pindah ke langkah berikutnya.", cam: lpCam(K1.pos.next - 300), at: [195, K1.pos.next + 26], click: true, press: "n1", dur: 3 },
      { caption: "Langkah 2, Pemesan. Lanjut saat Nama kosong: Nama wajib diisi.", cam: lpCam(FK.card - 10, 1150), hide: ["n1"], show: ["s2", "err"], at: [195, K2.pos.next + 26], click: true, dur: 3.8 },
      { caption: "Kolom bertanda * wajib. Klik Nama, lalu ketik namanya.", at: [195, nameY + 24], click: true, show: ["nameBg", "nameT"], type: [{ id: "nameT", n: 11, box: [55, nameY + 4, 100, 40] }], dur: 3.4 },
      { caption: "Isi juga WhatsApp, lalu tekan lanjut sampai langkah terakhir.", at: [195, waY + 24], click: true, show: ["nameOff", "waBg", "waT"], type: [{ id: "waT", n: 14, box: [55, waY + 4, 120, 40] }], dur: 3.4 },
      { caption: "Di langkah Catatan, tekan kirim data: Data terkirim ke Pesanan masuk.", cam: lpCam(FK.card - 10, 900), hide: ["err", "nameBg", "nameT", "nameOff", "waBg", "waT", "s2"], show: ["s10", "sub", "done"], at: [195, K10.pos.next + 26], click: true, press: "sub", dur: 3.8 }
    ]
  },

  // ---------------------------------------------------------------- pesanan-masuk
  "jualan-pesanan-masuk": {
    title: "Mengisi undangan dari Pesanan masuk",
    world: EW,
    base: [...shell({ page: "Undangan Sinta & Bayu", rail: "Konten" }), ed(nkHead(0, 0, "Konten"), inboxCount("1"), kontenBody, invite(RANI))],
    els: {
      hl: { svg: ed(ring(218, 104, 36, 36, { r: 8 })), enter: "fade", delay: 0.4 },
      inbox: { svg: ed(ordersDlg), enter: "fade", delay: 1.2 },
      baru: { svg: ed(badgeAt(331, ROW1 + 19, "Baru", "todo")), enter: "fade", delay: 1.2 },
      memuat: { svg: ed(rect(270, ROW1 + 16, 64, 24, { fill: C.white }), badgeAt(331, ROW1 + 19, "Memuat…", "off")), enter: "fade", delay: 1.15 },
      konten: { svg: ed(nkRail(0, 0, "Konten"), nkHead(0, 0, "Konten"), rect(72, 153, 327, 747, { fill: C.white }), kontenBody, invite(SINTA)), enter: "fade" },
      t1: { svg: ed(nkToast(["Data pesanan dimasukkan.", "Foto tetap; ganti foto", "contoh bila masih ada."])), enter: "slide", delay: 0.3 },
      pub: pubBtn
    },
    steps: [
      { caption: "Angka merah di ikon kotak masuk: ada pesanan baru.", cam: cam(0, 40, 700), show: ["hl"], dur: 3 },
      { caption: "Klik ikonnya. Layar Pesanan masuk terbuka.", at: P(236, 122), click: true, hide: ["hl"], show: ["inbox", "baru"], dur: 3.2 },
      { caption: "Klik nama klien berlabel Baru.", cam: cam(0, 100, 620), at: P(110, ROW1 + 26), click: true, show: ["memuat"], dur: 3 },
      { caption: "Semua kolom terisi sesuai paketnya. Salah halaman? Klik Urungkan.", cam: cam(0, 250, 1180), hide: ["inbox", "baru", "memuat"], show: ["konten", "t1"], dur: 4 },
      { caption: "Ganti foto contoh, lalu klik Simpan & Terbitkan.", cam: cam(840, 0, 600), at: PUB, click: true, press: "pub", dur: 3.4 }
    ]
  },

  // ---------------------------------------------------------------- checklist-serah
  "jualan-checklist": {
    title: "Checklist sebelum menyerahkan undangan ke klien",
    world: { w: 1000, h: 940 }, bg: "#eef1f5",
    base: [shadow(110, 30, 780, 880, 6, 3), rect(110, 30, 780, 880, { r: 6, fill: C.white }), text(CKX, 90, "Checklist serah undangan", { size: 28, weight: 700, fill: C.ink }),
      text(CKX, 122, "Centang setiap baris sebelum mengirim pesan untuk pengantin.", { size: 16, fill: C.text }),
      ...CHECK.map((l, i) => rect(CKX + 1, CKY(i) + 1, 24, 24, { r: 5, stroke: C.faint, sw: 2 }) + text(CKX + 44, CKY(i) + 19, l, { size: 18, fill: C.ink }) +
        line(CKX, CKY(i) + 42, 850, CKY(i) + 42, { stroke: C.line }))],
    els: Object.fromEntries(CHECK.map((_, i) => [`k${i}`, { svg: rect(CKX, CKY(i), 26, 26, { r: 5, fill: C.ok }) + iconX("check", CKX + 13, CKY(i) + 13, 18, C.white, 3), enter: "pop", origin: [CKX + 13, CKY(i) + 13], delay: [0, 1, 2].includes(i % 3) ? 1.1 + (i % 3) * 0.25 : 1.1 }])),
    steps: [
      { caption: "Isi undangan: Konten, foto contoh, dan musik.", cam: { x: 90, y: 40, w: 760 }, at: [CKX + 13, CKY(0) + 13], click: true, show: ["k0", "k1", "k2"], dur: 3.6 },
      { caption: "Slug terisi, halaman tersimpan, lalu Simpan & Terbitkan.", cam: { x: 90, y: 200, w: 760 }, at: [CKX + 13, CKY(3) + 13], click: true, show: ["k3", "k4", "k5"], dur: 3.6 },
      { caption: "Coba sebagai tamu, rapikan ucapan percobaan, buat PIN dashboard.", cam: { x: 90, y: 370, w: 760 }, at: [CKX + 13, CKY(6) + 13], click: true, show: ["k6", "k7", "k8"], dur: 3.8 },
      { caption: "Undangan khusus, kode staff, dan label Sudah diisi di Pesanan masuk.", cam: { x: 90, y: 540, w: 760 }, at: [CKX + 13, CKY(9) + 13], click: true, show: ["k9", "k10", "k11"], dur: 3.8 },
      { caption: "Semua tercentang: kirim pesan untuk pengantin.", cam: "all", dur: 3 }
    ]
  }
};
// Flow cards and arrows enter in reading order within each step.
for (const st of scenes["jualan-alur"].steps) (st.show ?? []).forEach((id, k) => (scenes["jualan-alur"].els[id].delay = 0.15 + k * 0.22));
