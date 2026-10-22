// Jualan ke klien: alur, Profil merek, Dashboard pasangan, Bagikan > Untuk pengantin, Landing page, form klien,
// Pesanan masuk, checklist serah. Every scene is one 1440x900 screen (lib v4): the Scalev editor at 0,0, or the
// member Landing page and its form as a phone page (phoneDesk; the page is mobile-first).
// Product screens come from ui/: the Marketing switch and closed Profil merek (marketing.mjs), Pesanan masuk
// (pesanan.mjs), Bagikan (bagikan.mjs), Template library and Konten panel (editor-panels.mjs), invitation preview
// (invitation.mjs). Drawn here: the four Marketing cards, the open Profil merek, the Gaya of a Landing page, the
// Marketing install dialog and update note (panels-style.jsx), the Dashboard pasangan gate
// (/tmp/ref/dash-gate-hp.png), the WhatsApp message bubble (generic), and the member Landing page and its form
// (server/pages/src/landing/index.html + server/pages/shared/order-form.js, measured in Chrome at 390 px). The flow
// diagram and the checklist are guide graphics, not product screens.
import { C, PHONE, icon, iconX, rect, text, para, line, circle, group, clipped, shadow, skeleton, tw, textWidth, mid } from "../lib.mjs";
import { ED, chrome, favScalev, scalevEditor, nkRail, nkHead, nkBtn, nkBtnBox, nkInput, nkLabel, nkH3, nkHint, nkBadgeBox, nkToast, nkToastBoxes, phoneDesk, onPhone } from "../ui/kit.mjs";
import { badgeAt, inboxCount, ordersDlg, ROW1, ROW2, LIST_Y, PASTE_Y, LINK_Y, ISI_Y, PASTE_AREA, pasteOpen, linkOpen, salinBtn, SALIN_BOX, HAPUS_BOX, hapusRow, hapusBtn, afterDelete,
  kreatorOrders, SALES_AT } from "../ui/pesanan.mjs";
import { kreatorHead, KR_INBOX } from "../ui/gate.mjs";
import { BAGIKAN_TOOL, ACC_Y, COUPLE_Y, shareAll, dashboardBtn, dashboardBox } from "../ui/bagikan.mjs";
import { SEG, MARKETING_BOX, BOX, brandClosed, brandOpen, MK, MKY, cardXY, mkCards, dipakaiBox, TAMBAH_Y, SIMPAN_Y, PKG_F, LOGO_BTN } from "../ui/marketing.mjs";
import { ACCOUNT, panelBg, panelBody, lid, kList, seg, templatePanel, TPL, library, cardAt } from "../ui/editor-panels.mjs";
import { PHOTO_DEFS, pvMempelai, pvWana, kencana } from "../ui/invitation.mjs";

// ---- Editor: the Scalev editor fills the 1440x900 screen at 0,0 -----------------------------------------------------
// PHOTO_DEFS: the gradients the invitation preview's photos use.
const shell = (o = {}) => [PHOTO_DEFS, scalevEditor(0, 0, o)];
// The panel head with the member's plan on the account chip.
const head = (title, o = {}) => nkHead(0, 0, title, { account: ACCOUNT, ...o });
// Step helpers: a mark ({ box, r }) and the screen regions steps focus on.
const M = (x, y, w, hh, r = 4) => ({ box: [x, y, w, hh], r });
const F = { left: [0, 92, 399, 808], panel: [72, 92, 327, 808], rail: [0, 92, 72, 808], tabs: [0, 44, 399, 48], top: [1180, 44, 260, 48], preview: [727, 106, 390, 784] };
const INBOX = M(218, 104, 36, 36, 8);

// The designs the Landing page shows first, newest first (highest template.json order; names from editor-panels TPL;
// [paper, accent] = bg and accent of each design's default palette in nikahkit/src/model.js): [name, description, [paper, accent]].
const DESIGN = (id, pal) => [TPL[id][0], TPL[id][1], pal];
const DESIGNS = [DESIGN("wana-lentera", ["#E4DCAF", "#124541"]), DESIGN("wungu-kencana", ["#F0EAE4", "#985372"]), DESIGN("pinky-promise", ["#F1EEE3", "#901D44"]),
  DESIGN("garden-stroll", ["#F9FFF5", "#D04518"])];
// The opening art (#lpArt): the three display designs (TAMPILAN in server/pages/src/landing) when the catalogue has them,
// [paper, accent] sketched like DESIGNS; first in the middle, second left, third right.
const TAMPILAN = [["#fdf8ec", "#a31d33"], ["#eef3e4", "#c8541f"], ["#8b3a5c", "#f6e4ea"]];
function pageSketch(x, y, w, h, [bg, ac]) {
  const cx = x + w / 2;
  return rect(x, y, w, h, { fill: bg }) + rect(x, y, w, h * 0.06, { fill: ac, opacity: 0.25 }) +
    `<path d="M${cx - w * 0.22} ${y + h * 0.55} V${y + h * 0.3} a${w * 0.22} ${w * 0.22} 0 0 1 ${w * 0.44} 0 V${y + h * 0.55} Z" fill="${ac}" opacity=".28"/>` +
    rect(cx - w * 0.28, y + h * 0.63, w * 0.56, Math.max(4, h * 0.035), { r: 2, fill: ac, opacity: 0.7 }) +
    rect(cx - w * 0.36, y + h * 0.71, w * 0.72, Math.max(3, h * 0.02), { r: 1.5, fill: ac, opacity: 0.35 }) +
    rect(cx - w * 0.3, y + h * 0.76, w * 0.6, Math.max(3, h * 0.02), { r: 1.5, fill: ac, opacity: 0.35 }) +
    rect(cx - w * 0.16, y + h * 0.84, w * 0.32, Math.max(6, h * 0.06), { r: h * 0.03, fill: ac, opacity: 0.55 });
}

// Invitation preview: the Mempelai section (ui/invitation.mjs) with the sample couple or Rani.
const SAMPLE = { nick: "Ayu", full: "Ayu Lestari, S.Ked.", job: "Dokter", parents: "Putri pertama dari Bapak Hadi & Ibu Ratna" };
const RANI = { nick: "Rani", full: "Rani Ayu, S.Psi.", job: "Psikolog", parents: "Putri kedua dari Bapak Ahmad & Ibu Siti" };

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


// ---- Landing page (server/pages/src/landing/index.html), 390 wide, mobile styles ----------------------------------
// Measured in Chrome at 390x844 (Landing Klasik): Rina WO, Basic + Premium, every design newest first; the later
// sections then shifted for the current page's shorter lede, feature notes and Cara pesan steps. Only the first four
// designs are drawn; the sections after the catalogue sit where they would under a two-row catalogue.
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
const LPY = { cta: 253.9, art: 345.9, katalog: 681.9, chips: 843.8, grid: 927.8, fitur: 1609.8, harga: 2926.5, pkg1: 3116.8, cara: 3783, faq: 4270.7, pesan: 4963.8, card: 5150.1 };

// Pilihan tema (#catFilter): Semua, Eksklusif (Nikahin's exclusive designs plus the account's own Kreator templates),
// then one button per category with its number of designs, most first. The row scrolls sideways, so a phone shows the
// first few. [label, count, x, width] as measured on nikahin.myscalev.com/undanganman; `on` is the pressed one. Label
// and count are one centred text: the guide's SVG may fall back to another font, and two separately placed texts would collide.
const CHIPS = [["Semua", "72", 20, 103.3], ["Eksklusif", "11", 131.3, 117.9], ["Adat", "32", 257.2, 89.7], ["Floral", "15", 354.8, 96.8], ["Elegan", "5", 459.6, 95.7],
  ["Minimalis", "5", 563.3, 114.6], ["Ceria", "4", 685.9, 83.5]];
const chipRow = (x0, y, on = "Semua") => CHIPS.map(([l, n, x, w]) => {
  const p = l === on, fg = p ? LP.paper : LP.cocoa;
  return rect(x0 + x + 0.75, y + 0.75, w - 1.5, 42.5, { r: 21.25, fill: p ? LP.cocoa : LP.paper, stroke: LP.cocoa, sw: 1.5 }) +
    `<text x="${x0 + x + w / 2}" y="${y + 26.7}" font-size="15" font-weight="700" fill="${fg}" text-anchor="middle">${l}<tspan dx="6" font-size="13" font-weight="600" opacity=".75">${n}</tspan></text>`;
}).join("");
const chipX = (label) => { const [, , x, w] = CHIPS.find((c) => c[0] === label); return x + w / 2; };
// One Grid design (card 304 tall, rows 328 apart): picture, name (baseline 243), Lihat demo (baseline 285.3) and Pilih (top 258).
const gridItem = (x, t, name, pal) => clipped(x, t, 168, 210, pageSketch(x, t, 168, 210, pal)) + rect(x, t, 168, 210, { r: 14, stroke: LP.cocoa, sw: 1.5 }) +
  h(x, t + 243, name, 20) + text(x, t + 285.3, "Lihat demo", { size: 15, weight: 700, fill: LP.cocoa, underline: true }) + lpBtn(x + 92, t + 258, "Pilih", { small: true, w: 71 });
const gridOf = (x0, top, items) => items.map(([n, , pal], i) => gridItem(x0 + 20 + (i % 2) * 182, top + Math.floor(i / 2) * 328, n, pal)).join("");
const tplGrid = (x0, top) => gridOf(x0, top, DESIGNS);

// Fitur undangan digital (.feat-grid, two columns): icons and words from the page. [x, top below the section top,
// height, title, text]; the title starts 75 below the card top, the text 126.6 below (103.8 under a one-line title);
// a card is 86 + 22.8 per title line + 20.3 per text line, the row as tall as its taller card.
const FEAT_ICON = ['<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>', '<path d="M21 12a9 9 0 0 1-13.5 7.8L3 21l1.2-4.5A9 9 0 1 1 21 12z"/>',
  '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>', '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>', '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M10 2h4"/>',
  '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
  '<path d="m22 8-6 4 6 4V8z"/><rect x="2" y="6" width="14" height="12" rx="2"/>', '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
  '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>', '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM18 18h3v3h-3"/>',
  '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>'];
const FEAT = [[20, 186.3, 172.2, ["Nama tamu di", "sampul"], ["Link pribadi tiap", "tamu."]], [201, 186.3, 172.2, ["RSVP dan", "ucapan"], ["Konfirmasi hadir dan", "doa tamu."]],
  [20, 370.5, 172.2, ["Galeri dan", "video"], ["Foto dan video", "prewedding."]], [201, 370.5, 172.2, ["Musik latar"], ["Lagu pilihan kalian."]],
  [20, 554.7, 172.2, ["Peta dan", "kalender"], ["Peta lokasi, simpan", "tanggal."]], [201, 554.7, 172.2, ["Hitung", "mundur"], ["Menuju hari acara."]],
  [20, 738.9, 172.2, ["Amplop digital"], ["Rekening dan", "alamat kado."]], [201, 738.9, 172.2, ["Siaran", "langsung"], ["YouTube atau", "Instagram Live."]],
  [20, 923.1, 172.2, ["Bingkai Story", "IG"], ["Tamu berbagi di", "Story."]], [201, 923.1, 172.2, ["Kirim lewat", "WhatsApp"], ["Kirim ke tamu,", "pantau RSVP."]],
  [20, 1107.3, 149.4, ["Check-in QR"], ["Tamu discan di hari", "H."]], [201, 1107.3, 149.4, ["Dua bahasa"], ["Indonesia atau", "Inggris."]]];
const featIcon = (d, x, y) => `<g transform="translate(${x} ${y}) scale(${28 / 24})" fill="none" stroke="${LP.accent}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</g>`;
// Pertanyaan (shared accordion .faq-list, all closed): [top below the section top, height, question lines]; plus icon
// 28 px at the right.
const FAQ = [[161, 63, ["Apakah tamu perlu memasang aplikasi?"]], [224, 78.6, ["Bisakah nama tiap tamu ditulis di", "undangan?"]], [302.6, 63, ["Berapa lama sampai undangannya jadi?"]],
  [365.6, 63, ["Bisakah isi undangan diubah setelah jadi?"]], [428.6, 78.6, ["Bagaimana kami tahu siapa yang akan", "hadir?"]], [507.1, 63, ["Bagaimana cara membayar?"]],
  [570.1, 63, ["Berapa lama undangan bisa dibuka?"]]];
const faqPlus = (cx, cy) => circle(cx, cy, 13.25, { stroke: LP.dash, sw: 1.5 }) + rect(cx - 5.5, cy - 1, 11, 2, { fill: LP.cocoa }) + rect(cx - 1, cy - 5.5, 2, 11, { fill: LP.cocoa });

export function landingTop(x0, y0, name) {
  const X = x0 + 20, Y = (v) => y0 + v;
  let s = rect(x0, y0, 390, LPY.card, { fill: LP.paper });
  // header
  s += circle(X + 20, Y(37), 20, { fill: LP.tint }) + h(X + 20, Y(43), name[0], 18, { weight: 600, anchor: "middle" }) + h(X + 50, Y(43), name, 18, { weight: 600 }) +
    lpBtn(x0 + 288.2, Y(14), "Pesan", { small: true, w: 81.8 });
  // hero (Landing Klasik's own headline and lede, HERO in nikahkit/src/marketing.js)
  s += h(X, Y(131), "Kabarkan hari", 42.9) + h(X, Y(174.8), "bahagia kalian", 42.9);
  s += para(X, Y(217.5), ["Pilih desain dan paket, isi datanya. Kami", "siapkan undangannya."], { size: 17, fill: LP.muted, lh: 26.3 });
  s += lpBtn(X, Y(LPY.cta), "Pesan undangan", { solid: true, w: 178.8 }) + lpBtn(x0 + 210.8, Y(LPY.cta), "Lihat desain", { w: 143.6 });
  s += THUMB(X + 10.5, Y(LPY.art + 28), 175, 219, TAMPILAN[1], -6) + THUMB(X + 164.5, Y(LPY.art + 28), 175, 219, TAMPILAN[2], 6) + THUMB(X + 87.5, Y(LPY.art), 175, 219, TAMPILAN[0]);
  // katalog: theme buttons, the first four designs
  s += dash(X, Y(LPY.katalog), 350) + h(X, Y(LPY.katalog + 88), "Pilih desain undangan", 32) +
    text(X, Y(LPY.katalog + 123.6), "Buka demonya, lalu pilih yang kalian suka.", { size: 17, fill: LP.muted }) +
    chipRow(x0, Y(LPY.chips)) + tplGrid(x0, Y(LPY.grid));
  // fitur undangan digital
  const FT = LPY.fitur;
  s += dash(X, Y(FT), 350) + h(X, Y(FT + 88), "Fitur undangan digital", 32) +
    para(X, Y(FT + 123.6), ["Fitur sama di semua desain. Isinya mengikuti", "paket kalian."], { size: 17, fill: LP.muted, lh: 26.3 }) +
    FEAT.map(([x, top, hh, title, txt], i) => rect(x0 + x + 0.75, Y(FT + top + 0.75), 167.5, hh - 1.5, { r: 16, fill: LP.paper, stroke: LP.line, sw: 1.5 }) + featIcon(FEAT_ICON[i], x0 + x + 17, Y(FT + top + 19)) +
      title.map((l, k) => h(x0 + x + 17, Y(FT + top + 75 + k * 22.8), l, 19)).join("") + para(x0 + x + 17, Y(FT + top + (title.length > 1 ? 126.6 : 103.8)), txt, { size: 14, fill: LP.muted, lh: 20.3 })).join("");
  // paket dan harga
  s += rect(x0, Y(LPY.harga), 390, LPY.cara - LPY.harga, { fill: LP.tint }) + h(X, Y(LPY.harga + 92), "Paket dan harga", 32) +
    para(X, Y(LPY.harga + 127.6), ["Pilih paket yang pas, lalu isi datanya di form", "di bawah."], { size: 17, fill: LP.muted, lh: 26.3 });
  PKG.forEach(([n, price, inc], i) => {
    const t = LPY.pkg1 + i * 311.1;
    s += rect(X + 0.75, Y(t + 0.75), 348.5, 293.6, { r: 16, fill: LP.paper, stroke: LP.cocoa, sw: 1.5 }) + h(X + 25, Y(t + 47), n, 24) + h(X + 25, Y(t + 91.6), price, 32, { weight: 600 }) +
      dash(X + 25, Y(t + 120.6), 300) + inc.map((x, k) => iconX("check", X + 34, Y(t + 151.6 + k * 31.7), 18, LP.cocoa, 2.4) + text(X + 53, Y(t + 155.6 + k * 31.7), x, { size: 15, fill: LP.ink })).join("") +
      lpBtn(X + 25, Y(t + 218.1), "Pilih paket ini", { solid: true, w: 300 });
  });
  // cara pesan
  s += h(X, Y(LPY.cara + 92), "Cara pesan", 32);
  [["1", 125.6, "Pilih desain dan paket", ["Lihat demo desain di atas, lalu pilih", "paket yang sesuai."]], ["2", 235.6, "Isi data pernikahan", ["Isi lewat form di bawah. Boleh", "menyusul."]],
    ["3", 345.6, "Dihubungi lewat WhatsApp", [`${name} konfirmasi pesanan dan`, "pembayaran."]]].forEach(([n, dy, t, p]) => {
    const top = LPY.cara + dy;
    s += circle(X + 24, Y(top + 24), 23, { fill: LP.paper, stroke: LP.cocoa, sw: 2 }) + h(X + 24, Y(top + 32), n, 22, { weight: 600, fill: LP.accent, anchor: "middle" }) +
      h(X + 64, Y(top + 21), t, 22) + para(X + 64, Y(top + 49.3), p, { size: 16, fill: LP.muted, lh: 24.8 });
  });
  // pertanyaan
  const FQ = LPY.faq;
  s += dash(X, Y(FQ), 350) + h(X, Y(FQ + 88), "Pertanyaan", 32) + text(X, Y(FQ + 123.6), "Belum terjawab?", { size: 17, fill: LP.muted }) +
    text(x0 + 152.6, Y(FQ + 123.6), "Tanya lewat WhatsApp", { size: 17, weight: 700, fill: LP.cocoa, underline: true }) + text(x0 + 339.7, Y(FQ + 123.6), ".", { size: 17, fill: LP.muted }) +
    line(X, Y(FQ + 160.75), X + 350, Y(FQ + 160.75), { stroke: LP.dash, sw: 1.5 }) +
    FAQ.map(([top, hh, q]) => para(X, Y(FQ + top + 33), q, { size: 16, weight: 500, fill: LP.cocoa, lh: 20.8 }) + faqPlus(x0 + 356, Y(FQ + top + 30)) +
      line(X, Y(FQ + top + hh - 0.75), X + 350, Y(FQ + top + hh - 0.75), { stroke: LP.dash, sw: 1.5 })).join("");
  // form section head
  s += dash(X, Y(LPY.pesan), 350) + h(X, Y(LPY.pesan + 88), "Isi data pesanan", 32) + para(X, Y(LPY.pesan + 123.6), PESAN_LEDE, { size: 17, fill: LP.muted, lh: 26.3 });
  return body(s);
}
// The form section's subheading (#pesan), as it breaks at 390 px.
const PESAN_LEDE = ["Data langsung terkirim ke kami. Yang belum", "siap boleh menyusul."];

// Form card (#formCard): picked-now, progress, step panel, actions, status, note (gone once sent). Returns { svg, pos, bottom }.
const FITUR = [["Siaran langsung"], ["Dua rekening dan alamat kirim", "kado"], ["Acara ngunduh mantu"], ["Warna, font, dan bingkai Story IG", "pilihan"], ["QR check-in tamu"], ["Hanya tamu yang diundang (link", "per tamu)"]];
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
    s += text(ix, y + 20 + 14, "Data aman di HP ini sampai terkirim.", { size: 13, fill: LP.muted }); y += 20 + 20.2;
  }
  const bottom = y + 21.5;
  const card = rect(X + 0.75, top + 0.75, 348.5, bottom - top - 1.5, { r: 16, fill: LP.tint, stroke: LP.cocoa, sw: 1.5 });
  return { svg: body(card + s), pos, bottom };
}
// Card + foot, on a white sheet that hides whatever was drawn there before.
function formTail(x0, top, st, name = "Rina WO") {
  const c = formCard(x0, top, st), X = x0 + 20, b = c.bottom;
  const tail = rect(x0, b + 57, 390, 150, { fill: LP.cocoa }) + h(X, b + 117, name, 20, { weight: 600, fill: LP.paper }) +
    text(X, b + 159, "Tanya lewat WhatsApp", { size: 16, weight: 700, fill: LP.paper, underline: true });
  return { svg: rect(x0, top - 2, 390, b - top + 220, { fill: LP.paper }) + c.svg + body(tail), pos: c.pos, bottom: b };
}
const PESANAN = { kind: "pesanan", step: 0, title: "Pesanan", intro: ["Pilih paket dan centang fitur yang", "kalian inginkan."] };
const PEMESAN = { kind: "pemesan", step: 1, title: "Pemesan", intro: ["Kontak untuk tim kami."] };
const CATATAN = { kind: "catatan", step: 9, title: "Catatan", intro: ["Hal lain yang ingin dimasukkan, lalu", "kirim."] };

// ---- Shared panel pieces -----------------------------------------------------------------------------------------
const tplPanel = (o = {}) => head("Template", o.head) + panelBody(panelBg(), templatePanel(null));
// Template > Marketing: switch, Profil merek closed, extra (a note under it) and the four cards at cardY; on = the Dipakai card.
const mkBody = (on, extra = "", cardY = MKY) => panelBody(panelBg(), seg("marketing"), brandClosed(BOX), extra, mkCards(cardY, on));
const mkPanel = (on, extra, cardY) => head("Template", { inbox: false }) + mkBody(on, extra, cardY);

const SCROLL = PKG_F - 248; // the brand form scrolled so the first package shows
const BIZ = { name: "Rina WO", wa: "6281234567890" }; // an empty Profil merek starts from the Scalev business (wa as waDigits keeps it)

// ---- Gaya of an open Landing page (panels-style.jsx LandingStylePanel; styles.js .nk-pal, .nk-color) ---------------
// On a Landing page the rail opens Template, Gaya and Media; the invitation menus, Bagikan and Kosongkan stay locked.
const LP_LOCKED = [216, 328, 384].map((y) => rect(0, y, 71, 52, { fill: C.page, opacity: 0.62 })).join("") + rect(0, 560, 71, 50, { fill: C.page, opacity: 0.62 }) +
  rect(0, 750, 71, 46, { fill: C.page, opacity: 0.62 });
// Palet of Landing Klasik (LOOKS.grid): Bawaan shows the template's own main and accent.
const PALETTES = [["Bawaan", "#2B1A07", "#B8460D"], ["Zaitun", "#2F3A1F", "#6E5A12"], ["Marun", "#3B0D11", "#9B2335"], ["Laut", "#12304A", "#1C6584"]];
// Below Warna aksen: Buka Google Fonts (ExtLink, the ghost button of the invitation's Huruf tab), then the two font fields.
// Once the applied font has more than one weight (Lora: 400 to 700), Ketebalan judul shows above the buttons.
const PAL_Y = (i) => 193 + i * 50, COLOR_Y = [437, 491], GF_Y = 549, FONT_Y = [611, 679], TERAPKAN_Y = 747, WEIGHT_Y = 763, TERAPKAN_Y2 = 815;
const palRow = ([name, main, accent], i, on) => {
  const y = PAL_Y(i);
  return rect(88.5, y + 0.5, 278, 43, { r: 4, fill: C.white, stroke: on ? C.primary : C.line, sw: on ? 2 : 1 }) +
    rect(97, y + 7, 38, 30, { r: 4, fill: C.line }) + rect(98, y + 8, 18, 28, { fill: main }) + rect(116, y + 8, 18, 28, { fill: accent }) +
    text(145, y + 27, name, { size: 14, weight: 500 });
};
const colorRow = (y, label, sub, hex, own) => rect(88.5, y + 0.5, 278, 47, { r: 4, fill: C.white, stroke: C.line }) + rect(97.5, y + 10.5, 35, 27, { r: 4, fill: hex, stroke: C.line }) +
  text(143, y + 21, label, { size: 14, weight: 500 }) + text(143, y + 38, sub, { size: 11, fill: C.faint }) + text(358, y + 28, own || "Bawaan", { size: 11, fill: C.text, anchor: "end" });
const btnsY = (th) => (th?.heading ? TERAPKAN_Y2 : TERAPKAN_Y);
const TERAPKAN = nkBtnBox(88, TERAPKAN_Y, "Terapkan");
const KEMBALI = nkBtnBox(88 + TERAPKAN[2] + 8, TERAPKAN_Y2, "Kembali ke bawaan", { variant: "quiet" });
const GF_BOX = nkBtnBox(88, GF_Y, "Buka Google Fonts", { w: 279, icon: "external-link" }), WEIGHT_BOX = [88, WEIGHT_Y, 279, 36];
// The panel for a page theme th ({ main, accent, heading } or null): the palette it equals is pressed, Custom is marked
// dipakai when none is (or a font is set), and Kembali ke bawaan shows once the page has a theme.
function gayaPanel(th) {
  const now = (p) => (th ? p[1] === th.main && p[2] === (th.accent || "") : p[0] === "Bawaan");
  const custom = th && (!PALETTES.slice(1).some(now) || th.heading);
  let s = nkH3(88, 181, "Palet") + PALETTES.map((p, i) => palRow(p, i, now(p))).join("") + nkH3(88, 425, "Custom");
  if (custom) { const cx = 88 + textWidth("Custom", 12, 700) + 9; s += circle(cx, 421, 3, { fill: C.changed }) + text(cx + 7, 425, "dipakai", { size: 11, weight: 500, fill: C.warnStrong }); }
  s += colorRow(COLOR_Y[0], "Warna utama", "Judul, teks, dan tombol.", th?.main || PALETTES[0][1], th?.main) +
    colorRow(COLOR_Y[1], "Warna aksen", "Tautan, angka, dan sorotan.", th?.accent || PALETTES[0][2], th?.accent) +
    nkBtn(88, GF_Y, "Buka Google Fonts", { variant: "ghost", w: 279, icon: "external-link" }) +
    nkLabel(88, FONT_Y[0] - 8, "Huruf judul") + nkInput(88, FONT_Y[0], 279, th?.heading || "Nama atau link Google Fonts", { placeholder: !th?.heading }) +
    nkLabel(88, FONT_Y[1] - 8, "Huruf teks") + nkInput(88, FONT_Y[1], 279, "Nama atau link Google Fonts", { placeholder: true }) +
    text(88, FONT_Y[1] + 52, "Contoh: Lora, atau link dari fonts.google.com.", { size: 12, fill: C.faint });
  if (th?.heading) s += nkLabel(88, WEIGHT_Y - 8, "Ketebalan judul") + nkInput(88, WEIGHT_Y, 279, "Bawaan", { select: true });
  const y = btnsY(th);
  s += nkBtn(88, y, "Terapkan") + (th ? nkBtn(88 + TERAPKAN[2] + 8, y, "Kembali ke bawaan", { variant: "quiet" }) : "");
  return s;
}
const gayaBody = (th) => panelBody(panelBg(), gayaPanel(th));
// The Landing page in the preview with a theme: main takes headings, text and buttons, accent the highlights, heading
// the headline font (the page's --cocoa/--ink, --accent and --display).
const themed = (svg, th) => {
  let s = svg.replaceAll(LP.cocoa, th.main.toLowerCase()).replaceAll(LP.ink, th.main.toLowerCase());
  if (th.accent) s = s.replaceAll(LP.accent, th.accent.toLowerCase());
  return th.heading ? s.replaceAll(DISP, `${th.heading},Georgia,serif`) : s;
};
const MARUN = { main: PALETTES[2][1], accent: PALETTES[2][2] }, OWN = { main: "#1E3A5F", heading: "Lora" };
const GAYA_TOAST = ["Gaya diterapkan. Tekan", "Simpan di Scalev."];
const gayaShell = [...shell({ page: "Landing Rina WO", rail: "Gaya" }), LP_LOCKED, head("Gaya", { inbox: false })];

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
// Pages are drawn in phone px (0..390): kit onPhone puts them on the desktop's phone screen (PHONE), clipped to it;
// atPhone only shifts them (a scrolling page, whose clip would scroll with it). Q, QR and QM turn phone px into world
// points, rects and marks.
const atPhone = (...s) => group({ transform: `translate(${PHONE.x} ${PHONE.y})` }, ...s);
const phBase = (...s) => [phoneDesk(atPhone(...s))];
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
const F1 = formTail(0, LPY.card, { ...PESANAN, picked: ["Pilihan kalian: desain Wana Lentera"], desain: "Wana Lentera" });
const F2 = formTail(0, LPY.card, { ...PESANAN, picked: ["Pilihan kalian: Paket Basic, desain", "Wana Lentera"], desain: "Wana Lentera", paket: "Basic" });
// Live demo (dialog.demo, full screen): bar 63 px (name, Pakai desain ini 147x46, close 44), the sample invitation below.
const DEMO_PICK = [181 + 147 / 2, 31], DEMO_X = [360, 31];
const demoView = body(rect(0, 0, 390, 844, { fill: LP.paper }) + PHOTO_DEFS + clipped(0, 63, 390, 781, group({ transform: "translate(-727 -43)" }, pvMempelai(RANI))) +
  rect(0, 0, 390, 62, { fill: LP.paper }) + line(0, 62.25, 390, 62.25, { stroke: LP.cocoa, sw: 1.5 }) + h(16, 38, "Wana Lentera", 19, { weight: 600 }) +
  iconX("x", DEMO_X[0], DEMO_X[1], 24, LP.cocoa, 2.2));
const demoPick = body(lpBtn(181, 8, "Pakai desain ini", { small: true, solid: true, w: 147 }));
const KAT = LPY.katalog, LIHAT_DEMO = [59, LPY.grid + 280.5 - KAT];
// The phone's address bar (56 px) above a 844 viewport, for the shareable ?demo= link.
const ADDR = "tokomu.myscalev.com/rina-wo";
const urlBar = (u) => rect(0, 0, 390, 56, { fill: "#f1f3f4" }) + rect(12, 8, 366, 40, { r: 20, fill: "#e3e5e8" }) + icon("lock", 32, 28, 14, C.text) + text(46, 33, u, { size: 14, fill: C.strong });
const inBrowser = (...s) => clipped(0, 56, 390, 844, group({ transform: "translate(0 56)" }, ...s));

// The theme buttons and the first designs, in y from the katalog's dashed line.
const CT = LPY.grid - KAT, CHIP_Y = LPY.chips - KAT;
// Pilihan tema (page y from the buttons down): Eksklusif pressed (its first four are the newest designs, as under
// Semua), and Adat with the first four adat designs, newest first.
const ADAT = [DESIGN("pagaruyung", ["#ECE3CE", "#8A5732"]), DESIGN("gorga", ["#DFB67E", "#473735"]), DESIGN("penjor", ["#704F38", "#FFF8EE"]), DESIGN("joglo", ["#E6D6B4", "#473735"])];
const catView = (on, items) => body(rect(0, LPY.chips - 4, 390, KAT + 844 - LPY.chips + 4, { fill: LP.paper }), chipRow(0, LPY.chips, on), gridOf(0, LPY.grid, items));
const eksView = catView("Eksklusif", DESIGNS), adatView = catView("Adat", ADAT);
const PKG_Y = LPY.pkg1 - 40, FORM_Y = LPY.card - 20;

// form-klien: the #pesan section from its top; the phone shows it from FY0.
const FK = { card: LPY.card - LPY.pesan };
const fkHead = body(rect(0, 0, 390, FK.card, { fill: LP.paper }) + dash(20, 0, 350) + h(20, 88, "Isi data pesanan", 32) +
  para(20, 123.6, PESAN_LEDE, { size: 17, fill: LP.muted, lh: 26.3 }));
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

// Tempel data pesanan: the client's WhatsApp message (with the #data-undangan line) over the dimmed panel.
const WA_MSG = ["*Pemesan*", "Nama: Rani Kusuma", "WhatsApp: 0812 3456 7890", " ", "Data untuk mengisi undangan otomatis", "(jangan diubah):", '#data-undangan {"v":1, ...}'];
const waBubble = rect(0, 92, 400, 808, { fill: "rgba(15,22,30,.42)" }) + shadow(24, 300, 352, 200, 10, 2) + rect(24, 300, 352, 200, { r: 10, fill: C.waSoft }) +
  para(40, 326, WA_MSG, { size: 14, fill: C.waText, lh: 24 }) + text(362, 488, "10.20", { size: 11, fill: C.waSub, anchor: "end" });

// Marketing card install (Dashboard pasangan / Landing page): dialog + Pasang.
const CARD_AT = { dashboard: [155, 360], landing: [301, 360] };
const veil = rect(0, 0, 1440, 900, { fill: "rgba(255,255,255,.92)" });
const DLG = [540, 383, 360, 134];
const pasangDlg = (name) => shadow(...DLG, 8, 3) + rect(...DLG, { r: 8, fill: C.white }) +
  text(560, 418, `Pasang ${name} di halaman ini?`, { size: 14, weight: 600 }) + nkHint(560, 442, "Seluruh isi halaman diganti. Bisa diurungkan.") + nkBtn(745, 461, "Batal", { variant: "quiet", w: 63 });
const pasangBtn = nkBtn(816, 461, "Pasang", { w: 64 });
const DLG_O = [720, 450];

// Shared step parts: the NikahKit tab, Kategori > Marketing, the panel toast, Simpan & Terbitkan.
const NK_TAB = M(224, 52, 92, 32), MARKETING = M(...MARKETING_BOX);
const tabStep = (caption, dur = 2.8) => ({ caption, dur, focus: [F.tabs, F.left], mark: NK_TAB, lens: { src: [100, 46, 222, 46] } });
// The toast's lens: its box with 8 px above and below, 4 px at the sides (the panel ends at 399).
const toastLens = (lines) => { const [x, y, w, hh] = nkToastBoxes(lines).toast; return { src: [x - 4, y - 8, w + 8, hh + 16] }; };
const pubStep = (caption) => ({ caption, at: ED.terbitkan, click: true, focus: F.top, mark: M(...ED.terbitkanBox), lens: { src: [1180, 44, 260, 50] }, dur: 3.4 });

// ---- Scenes ------------------------------------------------------------------------------------------------------
// Konten with every group closed (the panel the order data fills); editor-panels kontenPanel has Mempelai open.
const kontenClosed = head("Konten") + kList({ left: 0 }).svg;
const kontenEd = (page, p) => [...shell({ page, rail: "Konten" }), kontenClosed, pvMempelai(p)];
const DATA_TOAST = ["Undangan terisi. Ganti", "foto contohnya."];
const filled = (o = {}) => ({ konten: { svg: nkRail(0, 0, "Konten") + (o.panel ?? kontenClosed) + pvMempelai(RANI), enter: "fade" },
  t1: { svg: nkToast(DATA_TOAST), enter: "slide", delay: o.toast ?? 0.3 } });
// Kreator: an invitation page in bisnis Nikahin, the head with the Kreator chip (ui/gate), Pesanan masuk with Penjualan
// katalog (ui/pesanan kreatorOrders).
const krKonten = kreatorHead("Konten", true) + kList({ left: 0 }).svg;
const krEd = [...shell({ page: "Undangan Rani & Dimas", rail: "Konten" }), krKonten, pvMempelai(SAMPLE)];
const KR_INBOX_M = M(KR_INBOX[0] - 18, 104, 36, 36, 8);
// The Kreator's Landing order row in Pesanan masuk with the client's design in front (worker pesanan-masuk.mjs:
// "Desain <nama> · <paket>"), over the meta line of ui/pesanan kreatorOrders.
const KR_ROW_DESAIN = rect(27, ROW1 + 32, 262, 14, { fill: C.white }) + text(28, ROW1 + 42, "Desain Kencana · Undangan Inti · 19 Okt, 10.20", { size: 10, fill: C.text });
// Install one Marketing card on a blank HTML Mode page (pasang-dashboard-pasangan, landing-page), one scene per group
// of steps: the panel up to the card click, the dialog and Pasang, then the toast and the Dipakai badge.
function pasangScenes(kind, title, page, after, resLens, result, toast, caps) {
  const name = MK[kind][0], slug = `jualan-pasang-${kind}`, [cx] = cardXY(kind);
  const donePanel = mkBody(kind);
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
      base: [...blank, after, head("Template", { inbox: false }), donePanel],
      els: { t1: { svg: nkToast(toast), enter: "slide", delay: 0.3 } },
      steps: [
        { caption: `Muncul pesan: ${toast.join(" ")}`, show: ["t1"], focus: F.panel, mark: M(...nkToastBoxes(toast).toast), lens: toastLens(toast), dur: 3.4 },
        { caption: `Kartu ${name} kini berlabel Dipakai.`, mark: M(...dipakaiBox(kind), 9), lens: { src: [84, MKY + 170, 294, 80] }, dur: 3 }
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
    base: [...shell({ page, rail: "Template" }), before, mkPanel(kind, rect(88.5, 277.5, 278, 49, { r: 4, fill: C.warnSoft, stroke: "#fde7c7" }) +
      resetText(["Versi baru halaman", "tersedia."]), 339)],
    els: {
      perbarui: nkBtn(216, 286, "Perbarui halaman ini", { variant: "quiet", h: 32, w: 140 }),
      ...(kind === "landing" ? { brandT: { svg: rect(89, 278, 124, 48, { fill: C.warnSoft }) + resetText(["Profil merek", "berubah."]), enter: "fade" } } : {}),
      after: { svg: mkBody(kind) + after, enter: "fade", delay: 0.1 },
      t1: { svg: nkToast(toast), enter: "slide", delay: 0.25 }
    },
    steps: [
      { ...steps[0], focus: F.panel, mark: MARKETING, lens: { src: [80, 161, 295, 113] } },
      ...steps.slice(1).map((s) => ({ ...s, mark: RESET, lens: RESET_LENS })),
      { caption: "Klik Perbarui halaman ini. Halaman langsung dipasang ulang.", at: [286, 302], click: true, press: "perbarui", hide: kind === "landing" ? ["brandT"] : [],
        show: ["after", "t1"], focus: [F.panel, F.preview], mark: M(216, 286, 140, 32), lens: toastLens(toast), dur: 3.8 }
    ]
  };
}

// Phone scenes: positions of the Landing page and form in phone px.
const LIHAT_BOX = [20, LIHAT_DEMO[1] - 11, 78, 22]; // the Lihat demo link of the first design (Wana Lentera)
const PICKED = F1.pos.picked - FORM_Y; // the Pilihan kalian box on the form, under the scrolled view
const PKG_BTN = (i) => [45, LPY.pkg1 + i * 311.1 + 218.1 - PKG_Y, 300, 52];
const CHIP_BOX = (label) => { const [, , x, w] = CHIPS.find((c) => c[0] === label); return [x, CHIP_Y, w, 44]; };
// Form card positions on the phone (page y minus FY0).
const fy = (v) => v - FY0;
const fieldBox = (y) => [41.5, fy(y), 307, 48];
const btnBox = (y) => [41.5, fy(y), 307, 52];

// Landing Kreator's pay card (#payCard, central mode) on a phone: Paket and Tambahan from shared/paket.json, Desain,
// contact, Cara bayar and the bayar button (one tall page, PAY_Y2 = the view scrolled to the contact fields), then the
// QRIS panel (#payBox) on the same page, then /order?k=&paket= (Data undangan) after payment. Labels from
// server/pages/src/landing/index.html, src/order and shared/order-form.js; the service fee is example data.
const payField = (y, label, val) => text(20, y, label, { size: 14, weight: 700, fill: LP.cocoa }) +
  rect(20, y + 8, 350, 44, { r: 10, fill: LP.paper, stroke: LP.line, sw: 1.5 }) + text(34, y + 36, val, { size: 15, fill: LP.ink });
// .pick: input, name, price (b) at the right; a checked pick takes the tint and the accent border.
const payPick = (y, name, price, on, box) => rect(20, y, 350, 48, { r: 12, fill: on ? LP.tint : LP.paper, stroke: on ? LP.accent : LP.line, sw: on ? 2 : 1.5 }) +
  (box ? rect(32, y + 14, 20, 20, { r: 4, fill: LP.paper, stroke: LP.muted, sw: 1.5 })
    : circle(42, y + 24, 9, { fill: LP.paper, stroke: on ? LP.accent : LP.muted, sw: 1.5 }) + (on ? circle(42, y + 24, 5, { fill: LP.accent }) : "")) +
  text(60, y + 29, name, { size: 15, fill: LP.ink }) + text(358, y + 29, price, { size: 15, weight: 700, fill: LP.ink, anchor: "end" });
const PAY_PLANS = [["Undangan Inti", "Rp129.000"], ["Paket Lengkap", "Rp229.000"], ["Paket Istimewa", "Rp379.000"]];
const PAY_ADDONS = [["Live streaming & video", 35], ["Kado & rekening tambahan", 25], ["Ngunduh mantu", 35], ["Warna, font & bingkai Story IG", 35],
  ["QR check-in & layar sapa", 50], ["Undangan khusus", 35], ["Tayang selama Nikahin aktif", 50], ["Dibantu sampai jadi (1x24 jam)", 75]];
const PAY_TOP = 120, PAY_ADD = 320, PAY_DESIGN = 780, PAY_FIELDS = 852, PAY_Y2 = 760;
const PAY_BTN = [20, 1146, 350, 52];
const payForm = body(rect(0, 0, 390, PAY_Y2 + 844, { fill: LP.paper }), h(20, 44, "Pesan dan bayar", 26, { weight: 600 }),
  text(20, 72, "Bayar online, lalu isi data undangan.", { size: 14, fill: LP.muted }),
  text(20, PAY_TOP - 10, "Paket", { size: 14, weight: 700, fill: LP.cocoa }), PAY_PLANS.map(([n, p], i) => payPick(PAY_TOP + i * 56, n, p, i === 0)).join(""),
  text(20, PAY_ADD - 10, "Tambahan", { size: 14, weight: 700, fill: LP.cocoa }), PAY_ADDONS.map(([n, k], i) => payPick(PAY_ADD + i * 56, n, `+Rp${k}.000`, false, true)).join(""),
  rect(20, PAY_DESIGN, 350, 44, { r: 12, fill: LP.tint }), text(34, PAY_DESIGN + 28, "Desain: Kencana", { size: 15, weight: 700, fill: LP.ink }),
  payField(PAY_FIELDS, "Nama pemesan", "Rani Ayu"), payField(PAY_FIELDS + 74, "Nomor WhatsApp", "081234567890"), payField(PAY_FIELDS + 148, "Email", "rani@contoh.com"),
  payField(PAY_FIELDS + 222, "Cara bayar", "QRIS"), lpBtn(PAY_BTN[0], PAY_BTN[1], "bayar Rp129.903", { solid: true, w: 350 }),
  text(20, 1224, "Termasuk biaya layanan Rp903.", { size: 14, fill: LP.muted }), text(20, 1252, "Sesudah lunas, form data undangan langsung terbuka.", { size: 13, fill: LP.muted }));
const qrDots = (x, y, n, c) => { let d = ""; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (((i * 7 + j * 13 + i * j) % 5) < 2) d += `M${x + j * c} ${y + i * c}h${c}v${c}h-${c}z`;
  const eye = (ex, ey) => rect(ex, ey, c * 7, c * 7, { fill: LP.ink }) + rect(ex + c, ey + c, c * 5, c * 5, { fill: "#fff" }) + rect(ex + c * 2, ey + c * 2, c * 3, c * 3, { fill: LP.ink });
  return rect(x - 4, y - 4, n * c + 8, n * c + 8, { fill: "#fff" }) + `<path d="${d}" fill="${LP.ink}"/>` + rect(x, y, c * 8, c * 8, { fill: "#fff" }) + rect(x + (n - 8) * c, y, c * 8, c * 8, { fill: "#fff" }) +
    rect(x, y + (n - 8) * c, c * 8, c * 8, { fill: "#fff" }) + eye(x, y) + eye(x + (n - 7) * c, y) + eye(x, y + (n - 7) * c); };
const QR_SAVE = [95, 334, 200, 46], PAY_TOTAL = [20, 404, 350, 40], PAY_WAIT = [20, 588, 350, 80];
const payBox = body(rect(0, 0, 390, 844, { fill: LP.paper }), h(20, 44, "Pesan dan bayar", 26, { weight: 600 }), qrDots(85, 80, 29, 7.5),
  lpBtn(QR_SAVE[0], QR_SAVE[1], "simpan gambar QR", { small: true, w: QR_SAVE[2] }),
  text(20, 418, "Total bayar", { size: 14, fill: LP.muted }), h(20, 444, "Rp129.903", 26, { weight: 600 }), text(20, 476, "Termasuk biaya layanan Rp903.", { size: 14, fill: LP.muted }),
  para(20, 504, ["1. Buka m-banking atau dompet digital, pilih", "bayar dengan QRIS.", "2. Pindai kode ini. Bayar dari HP ini? Simpan", "gambarnya, lalu unggah dari galeri."], { size: 12, fill: LP.ink, lh: 13 }),
  text(20, 574, ["Bayar sebelum ", { t: "19 Okt 2026, 15.30", w: 700 }], { size: 13, fill: LP.muted }),
  circle(28, 607, 5, { fill: LP.accent }), text(42, 612, "Menunggu pembayaran", { size: 15, weight: 700, fill: LP.cocoa }),
  text(20, 639, "Sesudah lunas, halaman ini pindah sendiri ke form data", { size: 13, fill: LP.muted }), text(20, 657, "undangan.", { size: 13, fill: LP.muted }));
// /order?k=<kode>&paket=inti&desain=Dasar: Nikahin header, Data undangan, step 1 of 10 (Pesanan) with the paid plan.
const ORDER_PAID = [20, 388, 350, 28];
const orderPaid = body(rect(0, 0, 390, 844, { fill: LP.paper }), h(20, 52, "Nikahin", 24, { weight: 700 }), dash(0, 74, 390),
  h(20, 140, "Data undangan", 34, { weight: 600 }),
  para(20, 172, ["Isi data untuk pesanan yang sudah dibayar. Yang", "belum siap boleh dikosongkan dan dilengkapi", "lewat WhatsApp."], { size: 15, fill: LP.muted, lh: 22 }),
  rect(20, 248, 350, 260, { r: 16, fill: LP.paper, stroke: LP.line, sw: 1.5 }),
  Array.from({ length: 10 }, (_, i) => rect(36 + i * 32, 270, 28, 6, { r: 3, fill: i ? LP.dash : "#ff6f1e" })).join(""),
  text(36, 296, "Langkah 1 dari 10 · Pesanan", { size: 13, weight: 600, fill: LP.muted }),
  h(36, 340, "Pesanan", 22, { weight: 600 }), text(36, 366, "Sesuai pembayaran kalian.", { size: 15, fill: LP.muted }),
  text(36, 408, "Undangan Inti, desain Kencana", { size: 15, weight: 700, fill: LP.ink }),
  lpBtn(36, 436, "lanjut", { w: 120 }));

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
      mk: { svg: panelBody(panelBg(), seg("marketing"), brandOpen(BIZ)), enter: "fade" },
      body2: { svg: rect(72, 153, 327, 1200, { fill: C.white }) + seg("marketing") + brandOpen(BIZ), enter: "fade" },
      pkFocus: { svg: nkInput(111, PKG_F - SCROLL, 233, "", { focus: true }), enter: "fade" },
      pkBlur: { svg: nkInput(111, PKG_F - SCROLL, 233, ""), enter: "fade" },
      pkName: text(122, PKG_F + 23 - SCROLL, "Basic", { size: 14 }),
      prFocus: { svg: nkInput(111, PKG_F + 68 - SCROLL, 233, "", { focus: true }), enter: "fade" },
      pkPrice: text(122, PKG_F + 91 - SCROLL, "150.000", { size: 14 }),
      prBlur: { svg: nkInput(111, PKG_F + 68 - SCROLL, 233, "150.000"), enter: "fade" },
      done: { svg: mkBody(), enter: "fade", delay: 0.15 },
      cover: { svg: lid("Template"), enter: "fade" }
    }).map(([id, e]) => [id, { ...(typeof e === "string" ? { svg: e } : e), skel: true }])),
    steps: [
      tabStep("Di editor halaman, buka tab NikahKit.", 2.6),
      { caption: "Klik Template di rel kiri.", at: [36, 130], click: true, show: ["rail", "tpl"], focus: F.left, mark: M(0, 104, 71, 52, 0), lens: { src: [0, 96, 220, 64] }, dur: 3 },
      { caption: "Di Kategori, klik Marketing. Kotak Profil merek terbuka: Belum diisi.", at: SEG.marketing, click: true, show: ["mk"], focus: F.panel, mark: MARKETING,
        lens: { src: [80, 161, 295, 54] }, dur: 3.4 },
      { caption: "Cek Nama bisnis: sudah terisi dari bisnis Scalev. Ubah bila perlu.", mark: M(101, 300, 253, 36), lens: { src: [92, 276, 282, 68] }, dur: 3.2 },
      { caption: "Cek Nomor WhatsApp: juga terisi dari bisnis Scalev.", mark: M(101, 368, 253, 36), lens: { src: [92, 344, 282, 88] }, dur: 3 },
      { caption: "Logo (opsional): klik Pilih foto untuk memilih gambar dari Media.", mark: M(...LOGO_BTN), lens: { src: [92, 430, 282, 72] }, dur: 3.2 },
      { caption: "Gulir ke paket pertama, lalu isi Nama paket.", at: [228, PKG_F + 18 - SCROLL], click: true, show: ["body2", "cover", "pkFocus", "pkName"],
        scroll: { id: "body2", dy: SCROLL }, type: [{ id: "pkName", n: 5, box: [122, PKG_F + 3 - SCROLL, 36, 30] }],
        mark: M(111, PKG_F - SCROLL, 233, 36), lens: { src: [96, 196, 268, 92] }, dur: 3.6 },
      { caption: "Isi Harga (Rp) dan Isi paket. Tambah paket untuk paket kedua dan ketiga.", at: [228, PKG_F + 86 - SCROLL], click: true, show: ["pkBlur", "prFocus", "pkPrice"],
        type: [{ id: "pkPrice", n: 7, box: [122, PKG_F + 71 - SCROLL, 50, 30] }], mark: [M(111, PKG_F + 68 - SCROLL, 233, 36), M(101, TAMBAH_Y - SCROLL, 253, 36)],
        lens: { src: [96, 286, 268, 74] }, dur: 3.6 },
      { caption: "Klik Simpan profil. Kotak menutup dengan label Terisi.", at: [156, SIMPAN_Y + 18 - SCROLL], click: true, hide: ["prFocus"], show: ["prBlur", "done"],
        mark: M(...nkBtnBox(101, SIMPAN_Y - SCROLL, "Simpan profil", { w: 110 })), lens: { src: [84, 210, 290, 68] }, dur: 3.4 }
    ]
  },

  // ---------------------------------------------------------------- pasang-dashboard-pasangan
  ...pasangScenes("dashboard", "Memasang Dashboard pasangan di halaman Scalev sendiri", "Dashboard Rina WO", dashPreview, { src: [737, 320, 370, 204], zoom: 1.4 },
    "Pratinjau berubah menjadi Kelola undangan.",
    ["Dashboard pasangan dipasang.", "Tekan Simpan di Scalev."],
    ["Halaman HTML Mode baru yang kosong: tab NikahKit menampilkan Template.", "Di Kategori, klik Marketing."]),
  "jualan-pasang-dashboard-terbit": pubScene("Menerbitkan halaman Dashboard pasangan", "Dashboard Rina WO", "Template", mkPanel("dashboard"), dashPreview,
    ["Pratinjau sudah Kelola undangan. Tinggal diterbitkan.", "Klik Simpan & Terbitkan. Alamat halaman ini jadi alamat Dashboard."],
    { mark: M(743, 326, 358, 303, 24), lens: { src: [737, 320, 370, 204], zoom: 1.4 } }),

  // Bagikan in an invitation after the dashboard is installed.
  "jualan-bagikan-pengantin": {
    title: "Tombol Untuk pengantin di Bagikan",
    base: kontenEd("Undangan Rani & Dimas", RANI),
    els: {
      share: { svg: shareAll(null), enter: "fade" },
      buka: { svg: dashboardBtn(COUPLE_Y), enter: "fade" },
      // Kelola undangan in a new Chrome tab: the 390 column of the dashboard centred on a 1440 window.
      tab: { svg: chrome(0, 0, 1440, 900, { tabs: [{ title: "Landing Page Studio", fav: favScalev, w: 180 }, { title: "Kelola undangan", active: true, w: 160 }], url: "tokomu.myscalev.com/kelola?w=…" }) +
        rect(0, 85, 1440, 815, { fill: "#f5f4f2" }) + gate(525, 300), enter: "fade" }
    },
    steps: [
      tabStep("Buka undangan klien di editor, tab NikahKit."),
      { caption: "Klik Bagikan di rel kiri.", at: ED.tool.Bagikan, click: true, show: ["share", "buka"], focus: F.left, mark: M(...BAGIKAN_TOOL), note: "Bagikan", dur: 3.2 },
      { caption: "Untuk pengantin: Kirim undangan dan Buka Dashboard.", mark: M(16, COUPLE_Y + 24, 366, 80), lens: { src: [12, COUPLE_Y - 3, 374, 136] }, dur: 3.4 },
      { caption: "Buka Check-in muncul bila Undangan khusus dan QR masuk menyala.", mark: M(16, ACC_Y - 5, 366, 90), lens: { src: [12, ACC_Y - 9, 374, 98] }, dur: 3.8 },
      { caption: "Klik Buka Dashboard: Kelola undangan terbuka di tab baru.", at: [199, COUPLE_Y + 86], click: true, press: "buka", show: ["tab"], mark: M(...dashboardBox(COUPLE_Y)),
        note: "Buka Dashboard", dur: 3.4 },
      { caption: "Pengantin masuk dengan PIN dashboard.", focus: "none", mark: M(561, 448, 318, 44, 8), lens: { src: [541, 300, 358, 250], zoom: 1.4, at: [12, 180] }, dur: 3 }
    ]
  },

  // ---------------------------------------------------------------- landing-page
  ...pasangScenes("landing", "Memasang Landing Klasik di halaman Scalev sendiri", "Landing Rina WO", landPreview("Rina WO"), LAND_HEAD.lens,
    "Pratinjau berubah menjadi Landing Klasik.", ["Landing Klasik dipasang. Tekan", "Simpan di Scalev."],
    ["Halaman HTML Mode baru yang kosong: tab NikahKit menampilkan Template.", "Klik Marketing. Profil merek harus berlabel Terisi."]),
  "jualan-pasang-landing-terbit": pubScene("Menerbitkan Landing page", "Landing Rina WO", "Template", mkPanel("landing"), landPreview("Rina WO"),
    ["Pratinjau sudah Landing page dengan nama bisnismu.", "Klik Simpan & Terbitkan, lalu buka alamat publiknya dari HP."], LAND_HEAD),

  "gabung-kreator-landing-bayar": {
    title: "Klien membayar di Landing Kreator",
    base: phBase(payForm),
    els: {
      v2: { svg: onPhone(scr(PAY_Y2, payForm)), enter: "fade", delay: 0.1 },
      box: { svg: onPhone(payBox), enter: "fade", delay: 0.2 },
      order: { svg: onPhone(orderPaid), enter: "fade", delay: 0.2 }
    },
    steps: [
      { caption: "Klien memilih paket dan tambahan. Harganya tampil di tiap pilihan.", focus: PHF, mark: QM(20, PAY_TOP - 30, 350, 190, 12),
        lens: lensBy(QR(14, PAY_TOP - 34, 362, 198), "l", 1.1), dur: 3.4 },
      { caption: "Desain dari katalog tertulis. Isi nama, WhatsApp, Email, dan Cara bayar.", show: ["v2"],
        mark: [QM(20, PAY_DESIGN - PAY_Y2, 350, 44, 12), QM(14, PAY_FIELDS - PAY_Y2 - 20, 362, 296, 10)], lens: lensBy(QR(14, PAY_DESIGN - PAY_Y2 - 6, 362, 352), "l", 1), dur: 3.8 },
      { caption: "Klik bayar: total sudah termasuk biaya layanan.", at: Q(195, PAY_BTN[1] - PAY_Y2 + 26), click: true, mark: QM(PAY_BTN[0], PAY_BTN[1] - PAY_Y2, PAY_BTN[2], PAY_BTN[3], 20),
        lens: lensBy(QR(14, PAY_BTN[1] - PAY_Y2 - 8, 362, 96), "r", 1.4), dur: 3.4 },
      { caption: "Kode QRIS tampil di halaman yang sama, dengan simpan gambar QR.", hide: ["v2"], show: ["box"], mark: QM(80, 75, 230, 310, 10), lens: lensBy(QR(80, 75, 230, 310), "l", 1), dur: 3.6 },
      { caption: "Total bayar, batas bayar, dan Menunggu pembayaran. VA: salin nomor.", mark: [QM(...PAY_TOTAL, 6), QM(...PAY_WAIT, 6)], lens: lensBy(QR(14, 400, 362, 268), "r", 1.1), dur: 4 },
      { caption: "Sesudah lunas, halaman pindah ke form Data undangan sesuai paketnya.", hide: ["box"], show: ["order"], mark: QM(...ORDER_PAID, 6),
        lens: lensBy(QR(20, 310, 350, 120), "r", 1.4), dur: 3.8 }
    ]
  },

  // Kreator: the paid Landing order in Pesanan masuk, filled into the client's invitation in bisnis Nikahin. The page already
  // has template Wana Lentera (the inbox icon only shows once an invitation exists, App.jsx ready); the row starts with the
  // client's design (worker pesanan-masuk.mjs: "Desain <nama> · <paket>"). Filling keeps the page's template, so a
  // different design is then picked in Template: the content stays (store.js setTemplate, toast "Template diganti ke …").
  "gabung-kreator-pesanan": (() => {
    const Q = { q: "Kencana", n: [2, 1, 1, 0, 0, 0, 0], ids: ["kencana", "wungu-kencana"] }, K_CARD = [...cardAt(0, 371), 134, 167], K_TOAST = "Template diganti ke Kencana.";
    const tplHead = nkRail(0, 0, "Template") + rect(72, 92, 327, 808, { fill: C.white }) + kreatorHead("Template", true);
    return {
      title: "Mengisi undangan dari pesanan Landing Kreator",
      base: [...shell({ page: "Undangan Rani & Dimas", rail: "Konten" }), krKonten, pvWana(), inboxCount("1", KR_INBOX[0])],
      els: {
        inbox: { svg: kreatorOrders + KR_ROW_DESAIN, enter: "fade" },
        memuat: { svg: rect(270, ROW1 + 16, 64, 24, { fill: C.white }) + badgeAt(331, ROW1 + 19, "Memuat…", "off"), enter: "fade" },
        konten: { svg: nkRail(0, 0, "Konten") + krKonten + pvWana(), enter: "fade" },
        t1: { svg: nkToast(DATA_TOAST), enter: "slide", delay: 0.3 },
        tplA: { svg: tplHead + panelBody(panelBg(), seg(), library(219, "wana-lentera")), enter: "fade", skel: true },
        tplQ: { svg: tplHead + panelBody(panelBg(), seg(), library(219, "wana-lentera", Q)), enter: "fade", delay: 1.2, skel: true },
        qF: { svg: nkInput(88, 219, 279, "", { focus: true }), enter: "fade" },
        qT: text(99, 242, "Kencana", { size: 14 }),
        tplK: { svg: tplHead + panelBody(panelBg(), seg(), library(219, "kencana", Q)), enter: "fade", skel: true },
        pvK: { svg: kencana.cover(), enter: "fade", delay: 0.2, skel: true },
        t2: { svg: nkToast(K_TOAST), enter: "slide", delay: 0.4 }
      },
      steps: [
        tabStep("Buka halaman undangan klien di editor, tab NikahKit.", 2.6),
        { caption: "Angka merah di ikon kotak masuk: ada pesanan yang belum diisi.", focus: F.left, mark: KR_INBOX_M, lens: { src: [150, 96, 240, 52] }, dur: 3 },
        { caption: "Klik ikonnya. Layar Pesanan masuk terbuka, terbaru di atas.", at: KR_INBOX, click: true, show: ["inbox"], mark: KR_INBOX_M, lens: { src: [12, 160, 374, 150] }, dur: 3.2 },
        { caption: "Data dari form klienmu masuk ke sini, berlabel Baru.", mark: M(17, ROW1, 364, 57), lens: { src: [12, LIST_Y - 7, 374, 70] }, dur: 3.2 },
        { caption: "Klik nama pasangan berlabel Baru.", at: [150, ROW1 + 20], click: true, show: ["memuat"], mark: M(17, ROW1, 364, 57), lens: { src: [12, LIST_Y - 7, 374, 70] }, dur: 3 },
        { caption: "Undangan terisi. Salah halaman? Klik Urungkan.", hide: ["inbox", "memuat"], show: ["konten", "t1"], focus: [F.left, F.preview],
          mark: M(...nkToastBoxes(DATA_TOAST).undo), lens: toastLens(DATA_TOAST), dur: 4 },
        { caption: "Desain klien beda? Klik Template.", at: ED.rail.Template, click: true, hide: ["t1"], show: ["tplA"], focus: F.left, mark: M(0, 104, 71, 52, 0),
          lens: { src: [80, 364, 295, 242], at: [430, 300] }, dur: 3 },
        { caption: "Ketik Kencana di kotak Cari.", at: [228, 237], click: true, show: ["tplQ", "qF", "qT"], type: [{ id: "qT", n: 7, box: [99, 222, tw("Kencana", 14) + 2, 30] }],
          mark: M(88, 219, 279, 36), lens: { src: [80, 211, 295, 84], at: [430, 200] }, dur: 3 },
        { caption: "Klik kartu Kencana. Desain berganti, isinya tetap.", at: mid(K_CARD), click: true, hide: ["qF", "qT"], show: ["tplK", "pvK", "t2"], focus: [F.left, F.preview],
          mark: M(...K_CARD, 8), lens: toastLens(K_TOAST), dur: 3.8 }
      ]
    };
  })(),

  // Kreator: Penjualan katalog in Pesanan masuk (total commission, lead, paid orders, Buka /slug). The Landing order row
  // starts with its design, as in gabung-kreator-pesanan.
  "gabung-kreator-komisi": (() => {
    const { box, total, lead, list, buka } = SALES_AT;
    return {
      title: "Melihat penjualan dan komisi Kreator",
      base: krEd,
      els: { inbox: { svg: kreatorOrders + KR_ROW_DESAIN, enter: "fade" } },
      steps: [
        { caption: "Di editor halamanmu, klik ikon kotak masuk.", focus: F.left, at: KR_INBOX, click: true, show: ["inbox"], mark: KR_INBOX_M, lens: { src: [12, 160, 374, 150] }, dur: 3 },
        { caption: "Di bawah daftar pesanan ada kotak Penjualan katalog.", mark: M(...box), lens: { src: [box[0] - 6, box[1] - 6, box[2] + 12, box[3] + 12], zoom: 1.2 }, dur: 3.2 },
        { caption: "Total komisimu tertulis di judul kotak.", mark: M(...total, 9), lens: { src: [20, box[1] + 2, 358, 46] }, dur: 3 },
        { caption: "Komisi 60% dari harga paket setelah diskon, hanya yang lunas.", mark: M(...lead), lens: { src: [24, lead[1] - 6, 350, lead[3] + 12] }, dur: 3.6 },
        { caption: "Tiap baris: nama klien, paket, tanggal, dan komisinya.", mark: M(...list), lens: { src: [24, list[1] - 4, 350, list[3] + 8], zoom: 1.5 }, dur: 3.6 },
        { caption: "Buka /rina-wo membuka halaman Landing-mu.", at: mid(buka), mark: M(...buka), lens: { src: [24, buka[1] - 6, 350, 48] }, dur: 3 }
      ]
    };
  })(),

  "jualan-landing-page": {
    title: "Isi Landing page member di HP klien",
    base: phBase(LAND, F0.svg),
    els: {
      v1: { svg: onPhone(scr(KAT, LAND, F0.svg)), enter: "fade", delay: 0.1 },
      dlg: { svg: onPhone(demoView), enter: "pop", origin: Q(...LIHAT_DEMO) },
      pick: { svg: onPhone(demoPick), enter: "pop", origin: Q(...LIHAT_DEMO) },
      f1: { svg: onPhone(scr(FORM_Y, LAND, F1.svg)), enter: "fade", delay: 0.2 },
      vPkg: { svg: onPhone(scr(PKG_Y, LAND, F1.svg)), enter: "fade" },
      p2: onPhone(scr(PKG_Y, body(lpBtn(45, LPY.pkg1 + 218.1, "Pilih paket ini", { solid: true, w: 300 })))),
      f2: { svg: onPhone(scr(FORM_Y, LAND, F2.svg)), enter: "fade", delay: 0.3 }
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
      { caption: "Form menulis Pilihan kalian: desain Wana Lentera.", mark: QM(41.5, PICKED, 307, 45.25, 8), lens: lensBy(QR(36, PICKED - 8, 318, 62), "l", 1.4), dur: 2.6 },
      { caption: "Di Paket dan harga, setiap paket punya Pilih paket ini.", hide: ["f1"], show: ["vPkg", "p2"], mark: [QM(...PKG_BTN(0), 20), QM(...PKG_BTN(1), 20)],
        lens: lensBy(QR(14, 34, 362, 306), "l", 1.2), dur: 2.8 },
      { caption: "Pilih paket ini: form mencatat Paket Basic, desain Wana Lentera.", at: Q(195, PKG_BTN(0)[1] + 26), click: true, press: "p2", show: ["f2"], mark: QM(...PKG_BTN(0), 20),
        lens: lensBy(QR(36, PICKED - 12, 320, 94), "r", 1.4), dur: 3.8 }
    ]
  },

  "jualan-landing-tema": {
    title: "Pilihan tema di katalog Landing page",
    base: phBase(scr(KAT, LAND, F0.svg)),
    els: { eks: { svg: onPhone(scr(KAT, eksView)), enter: "fade", delay: 0.1 }, adat: { svg: onPhone(scr(KAT, adatView)), enter: "fade", delay: 0.1 } },
    steps: [
      { caption: "Di atas katalog ada tombol tema: Semua, Eksklusif, dan tiap kategori.", focus: PHF, mark: QM(18, CHIP_Y - 2, 372, 48, 24),
        lens: lensBy(QR(14, CHIP_Y - 8, 240, 60), "l"), dur: 3.8 },
      { caption: "Desain terbaru tampil paling depan.", mark: QM(14, CT - 6, 362, 310, 18), lens: lensBy(QR(12, CT + 222, 370, 71), "l", 1.2), dur: 3 },
      { caption: "Klik Eksklusif: desain eksklusif Nikahin dan template milik akunmu.", at: Q(chipX("Eksklusif"), CHIP_Y + 22), click: true, show: ["eks"], mark: QM(...CHIP_BOX("Eksklusif"), 22),
        lens: lensBy(QR(12, CT + 222, 370, 71), "l", 1.2), dur: 3.6 },
      { caption: "Klik Adat: katalog hanya menampilkan desain adat.", at: Q(chipX("Adat"), CHIP_Y + 22), click: true, hide: ["eks"], show: ["adat"], mark: QM(...CHIP_BOX("Adat"), 22),
        lens: lensBy(QR(12, CT + 222, 370, 71), "l", 1.2), dur: 3.6 },
      { caption: "Klik Semua untuk menampilkan lagi seluruh desain.", at: Q(chipX("Semua"), CHIP_Y + 22), click: true, hide: ["adat"], mark: QM(...CHIP_BOX("Semua"), 22),
        lens: lensBy(QR(12, CT + 222, 370, 71), "r", 1.2), dur: 3.2 }
    ]
  },

  "jualan-landing-demo": {
    title: "Demo desain di Landing page dan tautannya",
    base: phBase(urlBar(ADDR), inBrowser(scr(KAT, LAND, F0.svg))),
    els: {
      demo: { svg: onPhone(inBrowser(demoView)), enter: "pop", origin: Q(LIHAT_DEMO[0], LIHAT_DEMO[1] + 56) },
      pick: { svg: onPhone(inBrowser(demoPick)), enter: "pop", origin: Q(LIHAT_DEMO[0], LIHAT_DEMO[1] + 56) },
      url: { svg: onPhone(urlBar(`${ADDR}?demo=wana-lentera`)), enter: "fade" },
      f1: { svg: onPhone(urlBar(ADDR), inBrowser(scr(FORM_Y, LAND, F1.svg))), enter: "fade", delay: 0.2 }
    },
    steps: [
      { caption: "Di Pilih desain undangan, klien menekan Lihat demo.", at: Q(LIHAT_DEMO[0], LIHAT_DEMO[1] + 56), click: true, show: ["demo", "pick", "url"], focus: PHF,
        mark: QM(LIHAT_BOX[0], LIHAT_BOX[1] + 56, LIHAT_BOX[2], LIHAT_BOX[3]), lens: lensBy(QR(12, LIHAT_DEMO[1] - 42, 370, 138), "l", 1.2), dur: 3.4 },
      { caption: "Undangan contoh desain itu terbuka satu layar penuh.", mark: QM(0, 56, 390, 63, 0), lens: lensBy(QR(0, 56, 390, 63), "l", 1.2), dur: 2.8 },
      { caption: "Alamatnya mendapat ?demo=wana-lentera. Bagikan tautan ini ke klien.", mark: QM(12, 8, 366, 40, 20), lens: lensBy(QR(4, 2, 382, 52), "l", 1.2), dur: 3.6 },
      { caption: "Tombol silang, Esc, atau tombol kembali menutup demo.", mark: QM(DEMO_X[0] - 22, DEMO_X[1] + 56 - 22, 44, 44, 22), lens: lensBy(QR(150, 56, 240, 63), "r"), dur: 3.4 },
      { caption: "Pakai desain ini: form menulis Pilihan kalian: desain Wana Lentera.", at: Q(DEMO_PICK[0], DEMO_PICK[1] + 56), click: true, press: "pick",
        hide: ["demo", "pick", "url"], show: ["f1"], mark: QM(181, 64, 147, 46, 20), lens: lensBy(QR(36, PICKED + 48, 318, 62), "r", 1.4), dur: 3.8 }
    ]
  },

  "jualan-landing-gaya": {
    title: "Memilih palet di menu Gaya Landing page",
    base: [...shell({ page: "Landing Rina WO", rail: "Template" }), LP_LOCKED, mkPanel("landing"), landPreview("Rina WO")],
    els: {
      gaya: { svg: nkRail(0, 0, "Gaya") + LP_LOCKED + head("Gaya", { inbox: false }) + gayaBody(null), enter: "fade" },
      marun: { svg: gayaBody(MARUN), enter: "fade" },
      pv: { svg: themed(landPreview("Rina WO"), MARUN), enter: "fade", delay: 0.2 },
      t1: { svg: nkToast(GAYA_TOAST), enter: "slide", delay: 0.3 }
    },
    steps: [
      tabStep("Buka halaman Landing page kamu di editor, tab NikahKit.", 2.8),
      { caption: "Klik Gaya di rel kiri. Panel Gaya terbuka.", at: ED.rail.Gaya, click: true, show: ["gaya"], focus: F.left, mark: M(0, 160, 71, 52, 0),
        lens: { src: [0, 152, 220, 64] }, dur: 3 },
      { caption: "Palet: Bawaan (warna template), lalu tiga palet lain.", focus: F.panel, mark: M(88, PAL_Y(0), 279, 194, 6), lens: { src: [84, 168, 290, 224] }, dur: 3.4 },
      { caption: "Klik Marun. Warna Landing page langsung berganti.", at: [228, PAL_Y(2) + 22], click: true, show: ["marun", "pv"], focus: [F.panel, F.preview],
        mark: M(88, PAL_Y(2), 279, 44), lens: { src: [84, PAL_Y(2) - 6, 290, 56] }, dur: 3.6 },
      { caption: "Muncul pesan: Gaya diterapkan. Tekan Simpan di Scalev.", show: ["t1"], focus: [F.panel, F.preview], mark: M(...nkToastBoxes(GAYA_TOAST).toast),
        lens: toastLens(GAYA_TOAST), dur: 3.4 },
      pubStep("Klik Simpan & Terbitkan supaya klien melihat warna baru.")
    ]
  },
  "jualan-landing-gaya-custom": {
    title: "Warna dan huruf sendiri di Custom",
    base: [...gayaShell, gayaBody(null), landPreview("Rina WO")],
    els: {
      main: { svg: colorRow(COLOR_Y[0], "Warna utama", "Judul, teks, dan tombol.", OWN.main, OWN.main), enter: "fade" },
      fFocus: { svg: nkInput(88, FONT_Y[0], 279, "", { focus: true }), enter: "fade" },
      fVal: text(99, FONT_Y[0] + 23, OWN.heading, { size: 14 }),
      done: { svg: gayaBody(OWN), enter: "fade", delay: 0.1 },
      pv: { svg: themed(landPreview("Rina WO"), OWN), enter: "fade", delay: 0.2 },
      t1: { svg: nkToast(GAYA_TOAST), enter: "slide", delay: 0.3 }
    },
    steps: [
      { caption: "Di Custom, klik kotak Warna utama, lalu pilih warna yang gelap.", at: [115, COLOR_Y[0] + 24], click: true, show: ["main"], focus: F.panel,
        mark: M(88, COLOR_Y[0], 279, 48), lens: { src: [84, 410, 290, 136] }, dur: 3.6 },
      { caption: "Belum tahu nama fontnya? Buka Google Fonts membuka fonts.google.com.", mark: M(...GF_BOX), lens: { src: [84, GF_Y - 30, 290, 92] }, dur: 3.4 },
      { caption: "Di Huruf judul, ketik nama font Google Fonts, misalnya Lora.", at: [228, FONT_Y[0] + 18], click: true, show: ["fFocus", "fVal"],
        type: [{ id: "fVal", n: 4, box: [99, FONT_Y[0] + 3, 40, 30] }], mark: M(88, FONT_Y[0], 279, 36), lens: { src: [84, FONT_Y[0] - 28, 290, 132] }, dur: 3.4 },
      { caption: "Klik Terapkan. Warna dan huruf halaman langsung berganti.", at: mid(TERAPKAN), click: true, hide: ["main", "fFocus", "fVal"], show: ["done", "pv", "t1"],
        focus: [F.panel, F.preview], mark: M(...TERAPKAN), lens: toastLens(GAYA_TOAST), dur: 3.8 },
      { caption: "Lora punya beberapa ketebalan, jadi muncul Ketebalan judul.", hide: ["t1"], focus: F.panel, mark: M(...WEIGHT_BOX), lens: { src: [84, WEIGHT_Y - 30, 290, 80] }, dur: 3.4 },
      { caption: "Custom kini dipakai. Kembali ke bawaan menghapus warna dan huruf ini.", focus: F.panel, mark: [M(86, 409, 130, 22), M(...KEMBALI)],
        lens: { src: [84, TERAPKAN_Y2 - 10, 290, 56] }, dur: 3.8 },
      pubStep("Klik Simpan & Terbitkan supaya klien melihat gaya baru.")
    ]
  },

  "jualan-perbarui-landing": perbaruiScene("landing", "Memperbarui Landing page yang terpasang", "Landing Rina WO", landPreview("Rina Undangan"), landPreview("Rina WO"),
    ["Landing Klasik dipasang. Tekan", "Simpan di Scalev."], [
      { caption: "Buka halaman Landing page kamu: NikahKit > Template > Marketing.", dur: 3.2 },
      { caption: "Ada versi baru: tulisannya Versi baru halaman tersedia.", dur: 3.6 },
      { caption: "Hanya profil yang diubah? Tulisannya Profil merek berubah.", show: ["brandT"], dur: 3.4 }
    ]),
  "jualan-perbarui-dashboard": perbaruiScene("dashboard", "Memperbarui Dashboard pasangan ke versi baru", "Dashboard Rina WO", dashPreview, dashPreview,
    ["Dashboard pasangan dipasang.", "Tekan Simpan di Scalev."], [
      { caption: "Buka halaman Dashboard pasangan: NikahKit > Template > Marketing.", dur: 3.2 },
      { caption: "Ada versi baru: tulisannya Versi baru halaman tersedia.", dur: 3.6 }
    ]),
  "jualan-perbarui-terbit": pubScene("Menerbitkan Landing page yang diperbarui", "Landing Rina WO", "Template", mkPanel("landing"), landPreview("Rina WO"),
    ["Pratinjau ikut berganti ke profil terbaru, misalnya nama bisnis.", "Klik Simpan & Terbitkan supaya klien melihat versi baru."], LAND_HEAD,
    landPreview("Rina Undangan")),

  // ---------------------------------------------------------------- form-data-klien
  "jualan-form-klien": {
    title: "Klien mengisi form data undangan",
    base: phBase(scr(FY0, fkHead, K1.svg)),
    els: {
      // The page scrolls inside the screen: unclipped (a clip would scroll with it), under the desktop strips above and below.
      pgc: { svg: atPhone(scr(FY0, fkHead, K1.svg, qrChk)), enter: "fade" },
      edges: phEdges,
      s2: { svg: onPhone(sheet(fkHead, K2.svg)), enter: "fade", delay: 0.15 },
      err: { svg: onPhone(sheet(fkHead, K2e.svg)), enter: "fade", delay: 0.1 },
      nameBg: { svg: onPhone(scr(FY0, lpFocus(nameY))), enter: "fade" },
      nameT: onPhone(scr(FY0, body(text(55.5, nameY + 30, "Rani Kusuma", { size: 16, fill: LP.ink })))),
      nameOff: { svg: onPhone(scr(FY0, body(lpRing(nameY, LP.tint)))), enter: "fade" },
      waBg: { svg: onPhone(scr(FY0, lpFocus(waY))), enter: "fade" },
      waT: onPhone(scr(FY0, body(text(55.5, waY + 30, "0812 3456 7890", { size: 16, fill: LP.ink })))),
      s10: { svg: onPhone(sheet(fkHead, K10.svg)), enter: "fade" },
      sub: onPhone(scr(FY0, body(lpBtn(41.5, K10.pos.next, "kirim data", { solid: true, w: 307 })))),
      done: { svg: onPhone(sheet(fkHead, KD.svg)), enter: "fade", delay: 0.2 }
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
      link: { svg: rect(16, LINK_Y - 5, 366, 260, { fill: C.white }) + linkOpen, enter: "fade" },
      salin: { svg: salinBtn, enter: "fade" },
      ok: { svg: nkHint(SALIN_BOX[0] + SALIN_BOX[2] + 8, SALIN_BOX[1] + 23, "Tersalin."), enter: "fade", delay: 0.15 }
    },
    steps: [
      tabStep("Buka panel NikahKit di halaman undangan.", 2.6),
      { caption: "Klik ikon kotak masuk di kepala panel. Pesanan masuk terbuka.", at: ED.inbox, click: true, show: ["inbox"], focus: F.left, mark: INBOX,
        lens: { src: [12, 160, 374, 150] }, dur: 3.2 },
      { caption: "Klik Link form klien. Alamat link form tampil.", at: [200, LINK_Y + 25], click: true, show: ["link", "salin"], mark: M(16, LINK_Y, 366, 50),
        lens: { src: [12, LINK_Y - 5, 374, 204] }, dur: 3.4 },
      { caption: "Klik Salin link form: Tersalin. Tempel di chat WhatsApp klien.", at: mid(SALIN_BOX), click: true, press: "salin", show: ["ok"],
        mark: M(...SALIN_BOX), lens: { src: [12, SALIN_BOX[1] - 62, 374, 108] }, dur: 3.6 }
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
      { caption: "Baru: belum dipakai. Sudah diisi: sudah pernah kamu klik.", mark: [M(...nkBadgeBox(331, ROW1 + 19, "Baru", { end: true }), 9),
        M(...nkBadgeBox(331, ROW2 + 19, "Sudah diisi", { end: true }), 9)], lens: { src: [12, LIST_Y - 3, 374, 120] }, dur: 3.2 },
      { caption: "Klik nama pasangan berlabel Baru.", at: [150, ROW1 + 20], click: true, show: ["memuat"], mark: M(17, ROW1, 364, 57), lens: { src: [12, LIST_Y - 7, 374, 70] }, dur: 3 },
      { caption: "Undangan terisi. Salah halaman? Klik Urungkan.", hide: ["inbox", "memuat"], show: ["konten", "t1"], focus: [F.left, F.preview],
        mark: M(...nkToastBoxes(DATA_TOAST).undo), lens: toastLens(DATA_TOAST), dur: 4 }
    ]
  },
  "jualan-pesanan-terbit": pubScene("Ganti foto, lalu terbitkan undangan", "Undangan Rani & Dimas", "Konten", kontenClosed, pvMempelai(RANI),
    ["Foto tidak ikut terisi: ganti foto contoh di pratinjau.", "Lalu klik Simpan & Terbitkan."], { mark: M(852, 248, 140, 202, 12), note: "Foto contoh" }),

  "jualan-tempel-pesanan": {
    title: "Tempel data pesanan dari pesan WhatsApp",
    base: kontenEd("Undangan Rani & Dimas", SAMPLE),
    els: {
      wa: { svg: waBubble, enter: "rise" },
      inbox: { svg: ordersDlg, enter: "fade" },
      paste: { svg: pasteOpen(false), enter: "fade" },
      pasted: { svg: pasteOpen(true), enter: "fade" },
      isi: { svg: nkBtn(28, ISI_Y, "Isi undangan"), enter: "fade" },
      ...filled({ toast: 0.3 })
    },
    steps: [
      { caption: "Di WhatsApp, salin seluruh pesan klien, termasuk baris #data-undangan.", show: ["wa"], focus: F.left, mark: M(24, 300, 352, 200, 10),
        lens: { src: [24, 300, 352, 200] }, dur: 3.6 },
      { caption: "Buka Pesanan masuk lewat ikon kotak masuk.", at: ED.inbox, click: true, hide: ["wa"], show: ["inbox"], mark: INBOX, lens: { src: [12, 160, 374, 150] }, dur: 3.2 },
      { caption: "Klik Tempel data pesanan. Kotak teks muncul.", at: [200, PASTE_Y + 25], click: true, show: ["paste"], mark: M(16, PASTE_Y, 366, 50), lens: { src: [12, PASTE_Y - 5, 374, 220] }, dur: 3.2 },
      { caption: "Klik di kotak, tekan Ctrl+V (Windows) atau Cmd+V (Mac).", at: [200, PASTE_AREA[1] + 47], click: true, show: ["pasted", "isi"], mark: M(...PASTE_AREA),
        lens: { src: [20, PASTE_AREA[1] - 9, 358, 160] }, dur: 3.4 },
      { caption: "Klik Isi undangan: panel pindah ke Konten, ada tombol Urungkan.", at: [70, ISI_Y + 18], click: true, press: "isi", hide: ["inbox", "paste", "pasted", "isi"],
        show: ["konten", "t1"], mark: M(...nkBtnBox(28, ISI_Y, "Isi undangan")), lens: toastLens(DATA_TOAST), dur: 4 }
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
        mark: M(345, ROW2 + 16, 24, 24), lens: { src: [12, LIST_Y - 7, 374, 134] }, dur: 3.4 },
      { caption: "Klik Hapus? untuk memastikan. Pesanan hilang dari daftar.", at: mid(HAPUS_BOX), click: true, press: "hapus", hide: ["row", "hapus"],
        show: ["gone"], mark: M(...HAPUS_BOX), lens: { src: [12, LIST_Y - 7, 374, 134] }, dur: 3.6 }
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
