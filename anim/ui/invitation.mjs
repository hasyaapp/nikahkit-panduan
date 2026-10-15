// The invitation as the editor preview shows it: a plain 390x784 screen at ED.screen (no device frame). Two designs:
// - the maroon-and-cream reference design (cover, Waktu & Tempat, Galeri, Tanda Kasih, bottom dock), plus the Folio and
//   Dasar covers, another page's HTML before a template is picked, and gradient photo placeholders. Colours and type follow
//   the reference template; section positions are generic (laid out for the 390 px screen, not measured);
// - `kencana`: the Kencana template page (cover with palette/scale/shape/font, sections below it, Menu bawah), as Gaya
//   changes it; fonts and colours from the template's defaults, guest dock from undangan/widgets/dock.js.
import { C, rect, text, line, circle, para, wrap, tw, clipped, clipShape, shadow, icon } from "../lib.mjs";
import { ED } from "./kit.mjs";

const SC = ED.screen, CX = SC.x + SC.w / 2; // plain preview screen 727,106 390x784
export const SERIF = "Georgia,'Times New Roman',serif";
export const SCRIPT = "'Pinyon Script','Snell Roundhand','Apple Chancery','Brush Script MT',cursive";
export const MAROON = "#8b2c22", CREAM = "#fff8ee", INK = "#1f1f1f";
const PH = [["#ead9c4", "#a88a6b"], ["#d7e0e3", "#7d929a"], ["#f0dad6", "#ae7d78"], ["#dfe4cf", "#8b996a"], ["#e7ddd0", "#8a7965"], ["#dad5e7", "#8981a5"], ["#55524d", "#262523"]];
// Gradients the photo placeholders use (ph0..ph6): put once at the start of a scene base that draws photo().
export const PHOTO_DEFS = `<defs>${PH.map(([a, b], i) => `<linearGradient id="ph${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`).join("")}</defs>`;
const ell = (cx, cy, rx, ry, fill) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;
// A photo placeholder: tinted gradient k (0..6), horizon, sun and a couple.
export const photo = (x, y, w, h, k, r = 4) => clipped(x, y, w, h, rect(x, y, w, h, { r, fill: `url(#ph${k})` }),
  `<path d="M${x} ${y + h} L${x} ${y + h * 0.74} Q${x + w * 0.3} ${y + h * 0.6} ${x + w * 0.55} ${y + h * 0.72} T${x + w} ${y + h * 0.66} L${x + w} ${y + h} Z" fill="rgba(60,40,30,.2)"/>`,
  circle(x + w * 0.76, y + h * 0.26, Math.min(w, h) * 0.08, { fill: "rgba(255,255,255,.55)" }),
  ell(x + w * 0.44, y + h * 0.66, w * 0.07, h * 0.2, "rgba(255,255,255,.75)"), circle(x + w * 0.44, y + h * 0.42, Math.min(w, h) * 0.05, { fill: "rgba(255,255,255,.8)" }),
  ell(x + w * 0.56, y + h * 0.68, w * 0.06, h * 0.18, "rgba(40,30,25,.45)"), circle(x + w * 0.56, y + h * 0.46, Math.min(w, h) * 0.045, { fill: "rgba(40,30,25,.5)" }));
// The preview screen filled with `fill`, its content clipped to it.
export const pvScreen = (fill, ...kids) => rect(SC.x - 1, SC.y - 1, SC.w + 2, SC.h + 2, { fill: "rgba(16,24,40,.06)" }) + clipped(SC.x, SC.y, SC.w, SC.h, rect(SC.x, SC.y, SC.w, SC.h, { fill }), ...kids);
const bumps = (y, dir) => rect(SC.x, dir > 0 ? SC.y : y, SC.w, dir > 0 ? y - SC.y : SC.y + SC.h - y, { fill: MAROON }) +
  Array.from({ length: 14 }, (_, i) => circle(SC.x + 14 + i * 29, y, 11 + (i % 3) * 3, { fill: MAROON })).join("");
export const cloud = (cx, cy, s = 1) => circle(cx, cy, 13 * s, { fill: MAROON }) + circle(cx - 17 * s, cy + 6 * s, 10 * s, { fill: MAROON }) + circle(cx + 17 * s, cy + 6 * s, 10 * s, { fill: MAROON }) + rect(cx - 27 * s, cy + 6 * s, 54 * s, 10 * s, { r: 5 * s, fill: MAROON });
// Music button (bottom right of the screen).
export const disc = () => circle(1065, 700, 26, { fill: "#1b1b1b" }) + circle(1065, 700, 10, { fill: C.white }) + `<path d="M1062 695 L1069 700 L1062 705 Z" fill="#1b1b1b"/>`;
const DOCK = [["Mempelai", "heart"], ["Acara", "calendar"], ["Galeri", "image"], ["Ucapan", "message-circle"], ["Hadiah", "gift"]];
// Bottom menu (Menu bawah) with the item `active` highlighted.
export const dock = (active) => shadow(764, 810, 316, 70, 18) + rect(764, 810, 316, 70, { r: 18, fill: MAROON }) + DOCK.map(([n, ic], i) => {
  const x = 802 + i * 60;
  return (n === active ? rect(x - 28, 818, 56, 54, { r: 12, fill: "rgba(255,255,255,.18)" }) : "") + icon(ic, x, 836, 18, C.white) + text(x, 860, n, { size: 11, font: SERIF, fill: C.white, anchor: "middle" });
}).join("");
export const secTitle = (t) => cloud(780, 150, 0.8) + cloud(1064, 150, 0.8) + text(CX, 222, t, { size: 46, font: SCRIPT, fill: MAROON, anchor: "middle" });
// Centred serif line on the screen.
export const sTxt = (y, s, o = {}) => text(CX, y, s, { size: o.size ?? 14, font: SERIF, fill: o.fill ?? "#3a302b", weight: o.weight, anchor: "middle" });
// An arch-topped photo (frame in the accent): clipped photo k and its outline; arch = path d.
const archPhoto = (arch, x, y, w, h, k) => clipShape(`<path d="${arch}"/>`, photo(x, y, w, h, k, 0)) + `<path d="${arch}" fill="none" stroke="${MAROON}" stroke-width="2"/>`;
// Cover with the couple's names; o.guest: the guest's name on the "Kepada Yth." line (default Tamu Undangan).
export function pvCover(names, o = {}) {
  return pvScreen(CREAM, bumps(SC.y + 20, 1), bumps(SC.y + SC.h - 28, -1), cloud(797, 236), cloud(1047, 236),
    `<path d="M796 262 L850 248 L850 384 L796 364 Z M1048 262 L994 248 L994 384 L1048 364 Z" fill="none" stroke="${MAROON}" stroke-width="3"/>`,
    `<path d="M806 280 Q823 300 806 330 Q823 350 812 362 M1038 280 Q1021 300 1038 330 Q1021 350 1032 362" fill="none" stroke="${MAROON}" stroke-width="2"/>`,
    archPhoto("M852 400 V282 A70 70 0 0 1 992 282 V400 Z", 852, 212, 140, 188, 0),
    sTxt(433, "The Wedding Of", { size: 18, fill: INK }), text(CX, 508, names, { size: 46, font: SCRIPT, fill: MAROON, anchor: "middle" }),
    sTxt(557, "Minggu, 14 Februari 2027", { size: 15, weight: 700, fill: INK }), sTxt(578, "#RaniDimas", { size: 13 }),
    sTxt(613, "Kepada Yth. Bapak/Ibu/Saudara/i", { size: 13, weight: 700, fill: INK }), sTxt(637, o.guest ?? "Tamu Undangan", { size: 17, fill: MAROON }),
    rect(836, 673, 171, 48, { r: 24, fill: MAROON }) + icon("mail", 868, 697, 16, C.white) + text(936, 702, "Buka Undangan", { size: 15, font: SERIF, fill: C.white, anchor: "middle" }), disc());
}
// Mempelai section (one partner): title, arch portrait, nickname in script, full name, job, parents line (wrapped), city
// and Instagram pill (both optional), dock with Mempelai active. Defaults: the bride of the sample data.
export function pvMempelai({ nick = "Rani", full = "Rani Ayu, S.Psi.", job = "Psikolog", parents = "Putri kedua dari Bapak Ahmad & Ibu Siti", city, ig, k = 2 } = {}) {
  const lines = wrap(parents, 300, 14), py = 590 + lines.length * 20;
  return pvScreen(CREAM, bumps(SC.y + 20, 1), secTitle("Mempelai"), archPhoto("M852 450 V318 A70 70 0 0 1 992 318 V450 Z", 852, 248, 140, 202, k),
    text(CX, 506, nick, { size: 44, font: SCRIPT, fill: MAROON, anchor: "middle" }), sTxt(542, full, { size: 18, weight: 700, fill: INK }), sTxt(566, job, { size: 13 }),
    ...lines.map((l, i) => sTxt(596 + i * 20, l)), city ? sTxt(py + 8, city, { size: 13 }) : "",
    ig ? rect(CX - tw(ig, 13) / 2 - 16, py + 22, tw(ig, 13) + 32, 30, { r: 15, fill: MAROON }) + text(CX, py + 42, ig, { size: 13, font: SERIF, fill: C.white, anchor: "middle" }) : "",
    dock("Mempelai"), disc());
}
// The cover name changed to Sinta, drawn over pvCover (maroon) and over pvFolio.
export const pvSinta = () => rect(760, 462, 324, 64, { fill: CREAM }) + text(CX, 508, "Sinta & Dimas", { size: 46, font: SCRIPT, fill: MAROON, anchor: "middle" });
export const pvSintaFolio = () => rect(752, 420, 340, 44, { fill: "#232220" }) + sTxt(452, "Sinta & Dimas", { size: 38, fill: C.white });
// Event cards of Waktu & Tempat (y, h on the screen).
export const EV = {
  akad: { y: 250, h: 162, title: "Akad Nikah", time: "08.00 WIB s.d. Selesai", place: "Masjid Al-Ikhlas", addr: "Jl. Melati 1, Jakarta" },
  resepsi: { y: 426, h: 110, title: "Resepsi", time: "11.00 s.d. 14.00 WIB" }
};
const evCard = (e) => rect(751, e.y, 342, e.h, { r: 14, fill: C.white, stroke: "#ecd9c6" }) + sTxt(e.y + 38, e.title, { size: 22, weight: 700, fill: MAROON }) +
  sTxt(e.y + 66, "Minggu, 14 Februari 2027") + sTxt(e.y + 90, e.time) + (e.place ? sTxt(e.y + 120, e.place, { weight: 700, fill: INK }) + sTxt(e.y + 141, e.addr, { size: 12 }) : "");
export const pvEvents = (list) => pvScreen(CREAM, secTitle("Waktu & Tempat"), ...list.map((k) => evCard(EV[k])), dock("Acara"), disc());
export const pvGallery = () => pvScreen(CREAM, secTitle("Galeri"), sTxt(262, "Sebagian momen yang ingin kami bagi"), sTxt(283, "bersama Anda."),
  photo(751, 305, 342, 236, 0, 10), photo(751, 553, 165, 120, 4, 10), dock("Galeri"), disc());
// Amplop Digital with "Tampilkan lewat tombol Kirim Hadiah" on: title, intro and the button (accounts open after it).
export const pvGift = () => pvScreen(CREAM, secTitle("Tanda Kasih"), sTxt(262, "Doa restu Anda sudah lebih dari"), sTxt(283, "cukup. Bila ingin memberi tanda"), sTxt(304, "kasih, dapat melalui:"),
  rect(837, 336, 170, 48, { r: 24, fill: MAROON }) + icon("gift", 866, 360, 16, C.white) + text(932, 365, "Kirim Hadiah", { size: 15, font: SERIF, fill: C.white, anchor: "middle" }), dock("Hadiah"), disc());
// A new HTML Sales Page: Scalev's empty skeleton shows as a blank screen; NikahKit treats it as an empty page.
export const pvBlank = () => pvScreen(C.white);
// Another landing page's HTML (before a template is picked): neutral blocks, no text.
export const pvForeign = () => pvScreen(C.white, rect(SC.x, SC.y, SC.w, 56, { fill: "#1f2937" }), rect(SC.x + 20, SC.y + 20, 90, 16, { r: 3, fill: "#4b5563" }),
  rect(SC.x, SC.y + 56, SC.w, 250, { fill: "#e5e7eb" }), rect(SC.x + 40, SC.y + 130, 310, 22, { r: 4, fill: "#9ca3af" }), rect(SC.x + 70, SC.y + 166, 250, 14, { r: 4, fill: "#c4c8ce" }),
  rect(SC.x + 125, SC.y + 220, 140, 40, { r: 6, fill: "#2563eb" }),
  ...[0, 1, 2, 3, 4, 5, 6].map((i) => rect(SC.x + 30, SC.y + 340 + i * 26, [330, 290, 310, 250, 320, 280, 200][i], 10, { r: 5, fill: "#e5e7eb" })),
  rect(SC.x + 30, SC.y + 540, 155, 120, { r: 6, fill: "#f3f4f6" }), rect(SC.x + 205, SC.y + 540, 155, 120, { r: 6, fill: "#f3f4f6" }));
// Folio and Dasar template covers.
export const pvFolio = () => pvScreen("#F4F1EA", photo(SC.x, SC.y, SC.w, 300, 6, 0), rect(SC.x, SC.y + 300, SC.w, 140, { fill: "#232220" }),
  sTxt(402, "Undangan Pernikahan", { size: 13, fill: "#f4f1ea" }), sTxt(452, "Rani & Dimas", { size: 38, fill: C.white }), sTxt(484, "Minggu, 14 Februari 2027", { fill: "#f4f1ea" }),
  sTxt(600, "Kepada Yth. Bapak/Ibu/Saudara/i", { size: 13, fill: "#333333" }), sTxt(628, "Tamu Undangan", { size: 18, fill: "#1E1E1E" }),
  rect(836, 660, 172, 46, { fill: "#1E1E1E" }) + text(922, 688, "Buka Undangan", { size: 15, font: SERIF, fill: C.white, anchor: "middle" }));
export const pvDasar = () => pvScreen("#F4F1EA", rect(747.5, 126.5, 349, 743, { stroke: "#3A3A3A", sw: 0.8 }), sTxt(300, "Undangan Pernikahan", { size: 13, fill: "#6B6B6B" }),
  sTxt(360, "Rani & Dimas", { size: 40, fill: "#1E1E1E" }), line(872, 382, 972, 382, { stroke: "#6B6B6B" }), sTxt(410, "Minggu, 14 Februari 2027", { size: 15, fill: "#333333" }),
  sTxt(560, "Kepada Yth. Bapak/Ibu/Saudara/i", { size: 13, fill: "#333333" }), sTxt(588, "Tamu Undangan", { size: 18, fill: "#1E1E1E" }),
  rect(836, 620, 172, 46, { r: 6, fill: "#3A3A3A" }) + text(922, 648, "Buka Undangan", { size: 15, font: SERIF, fill: C.white, anchor: "middle" }));

// ---- Kencana page (template "kencana") --------------------------------------------------------------------------------
const K_SERIF = "Tinos,'Times New Roman',Georgia,serif";
const K_SCRIPT = "MonteCarlo,'Great Vibes','Snell Roundhand','Apple Chancery',cursive";
const KENCANA = { bg: "#FFF7E9", surface: "#FFFDF8", heading: "#8E2818", text: "#10001E", muted: "#6B5A55", accent: "#8E2818", on: "#FFFFFF" };
const clipPath = (d, ...kids) => clipShape(`<path d="${d}"/>`, ...kids);
const rrPath = (x, y, w, h, r) => (r ? `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 -${r} ${r}h-${w - 2 * r}a${r} ${r} 0 0 1 -${r} -${r}v-${h - 2 * r}a${r} ${r} 0 0 1 ${r} -${r}z` : `M${x} ${y}h${w}v${h}h-${w}z`);
// Photos drawn as flat shapes (sky, hills, sun); k picks the colours.
const TONES = [["#d9c7b0", "#a8875f", "#7d5f3f"], ["#cfdbe0", "#8aa596", "#5d7a66"], ["#ead1c6", "#c48f7f", "#8e5a4c"], ["#d6d3e6", "#9a92b8", "#6a6290"], ["#e8dcc0", "#c2a25c", "#8b6d2f"], ["#d3e1e8", "#7f9eb0", "#4f6f82"], ["#efe1d9", "#b9a093", "#7b6257"], ["#dfe6d2", "#a3b47e", "#6d7f4a"], ["#f0d8c8", "#d49a76", "#9b5e3c"]];
function kPhoto(x, y, w, h, k = 0) {
  const [sky, hill, near] = TONES[k % TONES.length];
  return clipped(x, y, w, h, rect(x, y, w, h, { fill: sky }), circle(x + w * (0.25 + (k % 3) * 0.2), y + h * 0.3, Math.min(w, h) * 0.1, { fill: "rgba(255,255,255,.7)" }),
    `<path d="M${x} ${y + h * 0.62} Q${x + w * 0.3} ${y + h * 0.42} ${x + w * 0.55} ${y + h * 0.58} T${x + w} ${y + h * 0.5} V${y + h} H${x} Z" fill="${hill}"/>`,
    `<path d="M${x} ${y + h * 0.8} Q${x + w * 0.5} ${y + h * 0.66} ${x + w} ${y + h * 0.82} V${y + h} H${x} Z" fill="${near}"/>`);
}
// The cover photo: a couple in a field (simple shapes).
function couple(x, y, w, h) {
  const cx = x + w / 2;
  return rect(x, y, w, h, { fill: "#e3e1da" }) + rect(x, y + h * 0.55, w, h * 0.45, { fill: "#c9ad73" }) + rect(x, y + h * 0.55, w, 6, { fill: "#b39457" }) +
    `<path d="M${cx - 6} ${y + h * 0.38} L${cx - 34} ${y + h} H${cx + 22} L${cx + 6} ${y + h * 0.4} Z" fill="#f7f6f2"/>` +
    `<path d="M${cx + 4} ${y + h * 0.36} L${cx + 2} ${y + h} H${cx + 30} L${cx + 26} ${y + h * 0.38} Z" fill="#3a3f47"/>` +
    circle(cx - 2, y + h * 0.31, 9, { fill: "#d9b192" }) + circle(cx + 16, y + h * 0.29, 9, { fill: "#c79f80" }) +
    `<ellipse cx="${cx - 14}" cy="${y + h * 0.5}" rx="34" ry="46" fill="rgba(255,255,255,.45)"/>`;
}
const kCloud = (cx, cy, col) => circle(cx - 18, cy + 2, 11, { fill: col }) + circle(cx + 18, cy + 2, 11, { fill: col }) + circle(cx, cy - 6, 16, { fill: col }) +
  rect(cx - 40, cy + 4, 80, 10, { r: 5, fill: col }) + circle(cx, cy - 4, 6, { fill: "rgba(255,255,255,.35)" });
const gate = (x, y, col, flip) => { const d = flip ? `M${x} ${y} L${x + 58} ${y + 18} V${y + 112} L${x} ${y + 128} Z` : `M${x} ${y + 18} L${x + 58} ${y} V${y + 128} L${x} ${y + 112} Z`;
  return `<path d="${d}" fill="none" stroke="${col}" stroke-width="3"/>` + circle(x + 29, y + 50, 13, { stroke: col, sw: 2 }) + circle(x + 29, y + 86, 13, { stroke: col, sw: 2 }) + line(x + 29, y + 26, x + 29, y + 118, { stroke: col, sw: 1.5 }); };
// Cover (cream paper, maroon bands, arch photo, script names). o: pal (palette roles overriding KENCANA), scale (all text),
// shape ("arch" | "soft" | "sharp": photo frame and button radius), nameFont, nameSize, names, top (screen y of the page
// top, for scrolled pages), disc: false hides the music button. 784 high, clipped to itself.
function kCover(o = {}) {
  const p = { ...KENCANA, ...o.pal }, s = o.scale ?? 1, top = o.top ?? SC.y, x0 = SC.x, cx = SC.x + SC.w / 2, shape = o.shape ?? "arch";
  const Y = (v) => top + v;
  let g = rect(x0, top, SC.w, 784, { fill: p.bg }) + rect(x0, top, SC.w, 18, { fill: p.accent }) + rect(x0, Y(764), SC.w, 20, { fill: p.accent });
  for (let i = 0; i < 15; i++) g += circle(x0 + 6 + i * 27, Y(18), 15, { fill: p.accent }) + circle(x0 + 6 + i * 27, Y(766), 13, { fill: p.accent });
  g += circle(x0 + 20, Y(68), 12, { fill: "#f2c9c4" }) + circle(x0 + 34, Y(70), 9, { fill: "#f5d8d3" });
  g += kCloud(x0 + 70, Y(126), p.accent) + kCloud(x0 + 320, Y(126), p.accent) + gate(x0 + 66, Y(152), p.accent) + gate(x0 + 266, Y(152), p.accent, true);
  const fx = cx - 70, fy = Y(105), fw = 140, fh = 189;
  const d = shape === "arch" ? `M${fx} ${fy + fh} V${fy + 70} a70 70 0 0 1 140 0 V${fy + fh} Z` : rrPath(fx, fy, fw, fh, shape === "soft" ? 18 : 0);
  g += clipPath(d, couple(fx, fy, fw, fh)) + `<path d="${d}" fill="none" stroke="${p.accent}" stroke-width="2"/>`;
  g += text(cx, Y(327), "The Wedding Of", { size: Math.round(18 * s), fill: p.text, anchor: "middle", font: K_SERIF });
  g += text(cx, Y(399), o.names ?? "Rani & Dimas", { size: Math.round((o.nameSize ?? 50) * s), fill: p.heading, anchor: "middle", font: o.nameFont ?? K_SCRIPT });
  g += text(cx, Y(451), "Minggu, 14 Februari 2027", { size: Math.round(15 * s), weight: 700, fill: p.text, anchor: "middle", font: K_SERIF }) +
    text(cx, Y(472), "#RaniDimas", { size: Math.round(13 * s), fill: p.text, anchor: "middle", font: K_SERIF }) +
    text(cx, Y(507), "Kepada Yth. Bapak/Ibu/Saudara/i", { size: Math.round(13 * s), weight: 700, fill: p.text, anchor: "middle", font: K_SERIF }) +
    text(cx, Y(531), "Tamu Undangan", { size: Math.round(18 * s), fill: p.heading, anchor: "middle", font: K_SERIF });
  const bw = Math.round(171 * s), bh = Math.round(48 * s);
  g += rect(cx - bw / 2, Y(567), bw, bh, { r: shape === "arch" ? bh / 2 : shape === "soft" ? 12 : 2, fill: p.accent }) + icon("mail", cx - bw / 2 + 34, Y(567) + bh / 2, 16, p.on) +
    text(cx + 12, Y(567) + bh / 2 + 5, "Buka Undangan", { size: Math.round(15 * s), fill: p.on, anchor: "middle", font: K_SERIF });
  g += [0, 1, 2].map((i) => circle(cx - 40 + i * 22, Y(720), 30 + i * 8, { stroke: "#f0d9d3", sw: 2 })).join("");
  if (o.disc !== false) g += circle(x0 + 338, Y(659), 27, { fill: "#141414" }) + circle(x0 + 338, Y(659), 11, { fill: C.white }) + `<path d="M${x0 + 335} ${Y(654)} l8 5 l-8 5 z" fill="#141414"/>`;
  return clipped(x0, top, SC.w, 784, g);
}
// Sections below the cover, each drawn at screen y (heights in kencana.H): Galeri Foto, Video, Rangkaian Acara, Dress Code
// (title only), Salam Pembuka, Ayat / Kutipan, Mempelai.
const kTitle = (y, t) => text(SC.x + SC.w / 2, y, t, { size: 40, fill: KENCANA.heading, anchor: "middle", font: K_SCRIPT });
const galeri = (y) => rect(SC.x, y, SC.w, 300, { fill: KENCANA.bg }) + kTitle(y + 62, "Galeri Foto") +
  [0, 1, 2, 3].map((k) => kPhoto(SC.x + 30 + (k % 2) * 170, y + 88 + Math.floor(k / 2) * 100, 160, 92, k + 4)).join("");
const video = (y) => rect(SC.x, y, SC.w, 280, { fill: KENCANA.bg }) + kTitle(y + 62, "Video") + rect(SC.x + 30, y + 88, 330, 168, { r: 6, fill: "#1f1a17" }) +
  rect(SC.x + 165, y + 151, 60, 42, { r: 12, fill: "rgba(255,255,255,.18)" }) + `<path d="M${SC.x + 188} ${y + 162} l18 10 l-18 10 z" fill="#fff"/>`;
const acara = (y) => rect(SC.x, y, SC.w, 300, { fill: KENCANA.bg }) + kTitle(y + 62, "Rangkaian Acara") + rect(SC.x + 30.5, y + 88.5, 329, 170, { r: 12, fill: KENCANA.surface, stroke: "#ead8cf" }) +
  text(SC.x + SC.w / 2, y + 128, "Akad Nikah", { size: 22, weight: 700, fill: KENCANA.heading, anchor: "middle", font: K_SERIF }) +
  text(SC.x + SC.w / 2, y + 160, "Minggu, 14 Februari 2027", { size: 15, fill: KENCANA.text, anchor: "middle", font: K_SERIF }) +
  text(SC.x + SC.w / 2, y + 184, "08.00 WIB", { size: 15, fill: KENCANA.text, anchor: "middle", font: K_SERIF }) +
  rect(SC.x + 125, y + 206, 140, 36, { r: 18, fill: KENCANA.accent }) + text(SC.x + SC.w / 2, y + 229, "Lihat Lokasi", { size: 14, fill: C.white, anchor: "middle", font: K_SERIF });
const dress = (y) => rect(SC.x, y, SC.w, 300, { fill: KENCANA.bg }) + kTitle(y + 62, "Dress Code");
const salam = (y) => rect(SC.x, y, SC.w, 420, { fill: KENCANA.bg }) + kCloud(SC.x + SC.w / 2, y + 56, KENCANA.accent) +
  text(SC.x + SC.w / 2, y + 128, "Assalamu'alaikum Warahmatullahi", { size: 17, weight: 700, fill: KENCANA.heading, anchor: "middle", font: K_SERIF }) +
  text(SC.x + SC.w / 2, y + 152, "Wabarakatuh", { size: 17, weight: 700, fill: KENCANA.heading, anchor: "middle", font: K_SERIF }) +
  para(SC.x + SC.w / 2, y + 200, ["Dengan memohon rahmat dan ridho Allah SWT,", "kami bermaksud melangsungkan pernikahan.", "Merupakan kehormatan bagi kami apabila", "Bapak/Ibu/Saudara/i berkenan hadir dan", "memberikan doa restu."], { size: 15, fill: KENCANA.text, anchor: "middle", lh: 26 }).replace(/<text /, `<text font-family="${K_SERIF}" `);
const ayat = (y) => rect(SC.x, y, SC.w, 330, { fill: KENCANA.bg }) + rect(SC.x + 30.5, y + 30.5, 329, 260, { r: 12, fill: KENCANA.surface, stroke: "#ead8cf" }) +
  para(SC.x + SC.w / 2, y + 92, ["Dan di antara tanda-tanda kekuasaan-Nya", "ialah Dia menciptakan untukmu pasangan", "hidup dari jenismu sendiri, supaya kamu", "merasa tenteram kepadanya."], { size: 15, fill: KENCANA.text, anchor: "middle", lh: 26 }).replace(/<text /, `<text font-family="${K_SERIF}" font-style="italic" `) +
  text(SC.x + SC.w / 2, y + 230, "QS. Ar-Rum: 21", { size: 15, weight: 700, fill: KENCANA.heading, anchor: "middle", font: K_SERIF });
const mempelai = (y) => rect(SC.x, y, SC.w, 500, { fill: KENCANA.bg }) + text(SC.x + SC.w / 2, y + 70, "Mempelai", { size: 48, fill: KENCANA.heading, anchor: "middle", font: K_SCRIPT }) +
  clipPath(`M${SC.x + 105} ${y + 340} V${y + 180} a90 90 0 0 1 180 0 V${y + 340} Z`, kPhoto(SC.x + 105, y + 90, 180, 250, 2)) + `<path d="M${SC.x + 105} ${y + 340} V${y + 180} a90 90 0 0 1 180 0 V${y + 340} Z" fill="none" stroke="${KENCANA.accent}" stroke-width="2"/>`;
const H = { cover: 784, galeri: 300, video: 280, acara: 300, dress: 300, salam: 420, ayat: 330, mempelai: 500 };
const SECTION = { galeri, video, acara, dress, salam, ayat, mempelai };
// The screen showing sections stacked from the top, in order (names from SECTION).
const stack = (names) => { let y = SC.y; return clipped(SC.x, SC.y, SC.w, SC.h, rect(SC.x, SC.y, SC.w, SC.h, { fill: KENCANA.bg }), ...names.map((n) => { const s = SECTION[n](y); y += H[n]; return s; })); };
// Guest page "Menu bawah" (undangan/widgets/dock.js): accent bar 10 px above the bottom, 56 px links, 11 px labels.
const kDock = () => rect(765, 816, 314, 64, { r: 18, fill: KENCANA.accent }) + ["heart", "calendar", "image", "message-circle", "gift"].map((ic, i) => icon(ic, 802 + i * 60, 838, 20, C.white) +
  text(802 + i * 60, 864, ["Mempelai", "Acara", "Galeri", "Ucapan", "Hadiah"][i], { size: 11, weight: 500, fill: "rgba(255,255,255,.85)", anchor: "middle" })).join("");
export const kencana = { pal: KENCANA, SERIF: K_SERIF, SCRIPT: K_SCRIPT, photo: kPhoto, cloud: kCloud, cover: kCover, H, ...SECTION, stack, dock: kDock };
