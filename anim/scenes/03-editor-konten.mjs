// Editor dan Konten (v2): peta editor, pilih template, isi Mempelai, tambah acara, galeri, RSVP dan Amplop Digital.
// World = the real 1440x900 Scalev editor (lib scalevEditor). Panel boxes follow /tmp/ref/editor-metrics.json (Template,
// Konten: cards 134x229, accordions 279x50, fields 253 wide); labels from nikahkit/src/fields.js, model.js (SAMPLE,
// SAMPLE_CHECKS), ui/panel-content.jsx, ui/panels-style.jsx, ui/fields.jsx, ui/App.jsx (MediaDialog, Toast), store.js.
import { C, ED, esc, rect, text, line, circle, para, clipped, shadow, icon, iconX, tw, ring, nkHead, nkRail, nkLabel, nkBtn, nkDialogHead, scalevEditor } from "../lib.mjs";

// Text with inline bold / underlined runs (link buttons, <b> in notes); parts: string | { t, w?, fill?, u? }.
const rich = (x, y, parts, o = {}) => `<text x="${x}" y="${y}" font-size="${o.size ?? 12}" fill="${o.fill ?? C.faint}">${parts.map((p) => (typeof p === "string" ? esc(p) : `<tspan font-weight="${p.w ?? 700}" fill="${p.fill ?? C.strong}"${p.u ? ' text-decoration="underline"' : ""}>${esc(p.t)}</tspan>`)).join("")}</text>`;

const WORLD = { w: 1440, h: 900 };
const ACCOUNT = "Tahunan"; // the account chip shows the member's plan
const P = 88, PW = 279, I = 101, IW = 253; // panel content box; inside an open accordion
const SC = ED.screen, CX = SC.x + SC.w / 2; // plain preview screen 727,106 390x784

// ---- Panel widgets at measured sizes ------------------------------------------------------------------------------
const lbl = (x, y, s) => nkLabel(x, y + 12, s);
const hintL = (x, y, lines, fill = C.faint) => para(x, y + 12, lines, { size: 12, fill, lh: 16 });
// Input / select / datetime / textarea (o.lines). focus: blue border + 3px soft ring; err: red border; sel: selected text.
function inp(x, y, w, val, o = {}) {
  const h = o.h ?? 36, tail = o.select || o.icon ? 34 : 6;
  let s = (o.focus ? rect(x - 3, y - 3, w + 6, h + 6, { r: 6, fill: C.primarySoft }) : "") +
    rect(x + 0.5, y + 0.5, w - 1, h - 1, { r: 4, fill: C.white, stroke: o.err ? C.danger : o.focus ? C.primary : C.field, sw: o.focus || o.err ? 1.5 : 1 });
  if (o.sel && val) s += rect(x + 10, y + 8, tw(val, 14) + 2, 20, { fill: "#b4d7fe" });
  if (o.lines) s += clipped(x + 2, y + 2, w - 4, h - 4, para(x + 11, y + 22, o.lines, { size: 14, fill: C.strong, lh: 17 }));
  else if (val) s += clipped(x + 2, y + 2, w - tail, h - 4, text(x + 11, y + h / 2 + 5, val, { size: 14, fill: o.ph ? C.faint : C.strong }));
  if (o.select) s += icon("chevron-down", x + w - 16, y + h / 2, 16, C.text);
  if (o.icon) s += icon(o.icon, x + w - 20, y + h / 2, 16, C.strong);
  return s;
}
const sw = (x, y, on) => rect(x, y, 36, 20, { r: 10, fill: on ? C.primary : C.off }) + circle(on ? x + 26 : x + 10, y + 10, 8, { fill: C.white });
const badge = (xr, y, label, ok = true) => { const w = Math.round(label.length * 4.6 + 9); return rect(xr - w, y, w, 18, { r: 9, fill: ok ? C.okSoft : C.warnSoft }) + text(xr - w / 2, y + 12.5, label, { size: 10, weight: 500, fill: ok ? C.ok : C.warnStrong, anchor: "middle" }); };
// Konten accordion (nk-acc): 50px bar, chevron, title, status badge; open = body below a hairline.
function acc(y, title, b, open) {
  return rect(P + 0.5, y + 0.5, PW - 1, (open ? 1400 : 50) - 1, { r: 4, fill: C.white, stroke: C.line }) + (open ? line(P + 1, y + 50.5, P + PW - 1, y + 50.5) : "") +
    icon(open ? "chevron-down" : "chevron-right", P + 22, y + 25, 18, C.strong) + text(P + 43, y + 30, title, { size: 14, weight: 500 }) + (b ? badge(P + 266, y + 16, b, b === "Terisi") : "");
}
// Vertical stack of fields (nk-field: label 16 + gap 4 + control, hint +8, margin 12).
function col(x, y, w) {
  let s = "";
  const c = {
    get y() { return y; }, get svg() { return s; },
    add(str, h = 0) { s += str; y += h; return c; },
    field(l, v, o = {}) {
      const h = o.h ?? 36;
      s += lbl(x, y, l) + inp(x, y + 20, w, v, o);
      let used = 20 + h;
      if (o.err) { s += text(x, y + used + 15, o.err, { size: 12, fill: C.danger }); used += 20; }
      else if (o.hint) { s += hintL(x, y + used + 8, o.hint); used += 8 + o.hint.length * 16; }
      y += used + 12; return c;
    },
    area(l, lines, rows = 2) { return c.field(l, "", { lines, h: rows * 17 + 14 }); },
    toggle(l, on, hint) {
      const ls = [].concat(l);
      s += para(x, y + 25 - (ls.length - 1) * 10, ls, { size: 14, fill: C.text, lh: 20 }) + sw(x + w - 36, y + 10, on);
      y += 48;
      if (hint) { s += hintL(x, y - 6, hint); y += -6 + hint.length * 16 + 12; }
      return c;
    },
    h3(t) { y += 12; s += text(x, y + 12, t, { size: 12, weight: 700 }); y += 24; return c; },
    lead(t) { s += text(x, y + 12, t, { size: 12, fill: C.faint }); y += 28; return c; }
  };
  return c;
}
// List item (nk-item): page-grey box, bar with title and up/down/trash icon buttons.
const itemBar = (y, title, first, last) => text(I + 10, y + 28, title, { size: 12, weight: 700 }) +
  icon("chevron-up", I + IW - 100, y + 24, 18, first ? "rgba(91,102,117,.35)" : C.text) + icon("chevron-down", I + IW - 62, y + 24, 18, last ? "rgba(91,102,117,.35)" : C.text) + icon("trash", I + IW - 24, y + 24, 18, C.text);
const itemBox = (y, h) => rect(I + 0.5, y + 0.5, IW - 1, h - 1, { r: 4, fill: C.page, stroke: C.line });
const quietBlock = (x, y, w, label, ic) => nkBtn(x, y, label, { variant: "quiet", w, icon: ic });
// Sample-data warning at the top of Konten (sampleFields: 6 checks, the button names the first left).
const sampleNote = (left, link) => rect(P, 169, PW, 64, { r: 4, fill: C.warnSoft }) + text(P + 12, 192, `${left} isian masih contoh. Ganti sebelum terbit.`, { size: 12, fill: C.warnStrong }) +
  text(P + 12, 218, link, { size: 12, weight: 500, fill: C.strong, underline: true });
const panelBg = () => rect(72, 153, 327, 747, { fill: C.white });
const body = (...kids) => clipped(72, 153, 327, 747, ...kids);

// ---- Callouts --------------------------------------------------------------------------------------------------------
// Pill pinned to a world point; k scales it so it stays readable in the overview camera.
const tag = (x, y, label, tx, ty, k = 1) => {
  const w = Math.round(tw(label, 14 * k, 600) + 28 * k), h = 32 * k;
  return line(x + w / 2, y + h / 2, tx, ty, { stroke: C.accent, sw: 2 * k }) + circle(tx, ty, 4 * k, { fill: C.accent }) +
    rect(x, y, w, h, { r: h / 2, fill: C.accent }) + text(x + w / 2, y + 21 * k, label, { size: 14 * k, weight: 600, fill: C.white, anchor: "middle" });
};

// ---- Preview screen (plain screen, no device frame); the maroon cream design of the reference ------------------------
const SERIF = "Georgia,'Times New Roman',serif";
const SCRIPT = "'Pinyon Script','Snell Roundhand','Apple Chancery','Brush Script MT',cursive";
const MAROON = "#8b2c22", CREAM = "#fff8ee", INK = "#1f1f1f";
const PH = [["#ead9c4", "#a88a6b"], ["#d7e0e3", "#7d929a"], ["#f0dad6", "#ae7d78"], ["#dfe4cf", "#8b996a"], ["#e7ddd0", "#8a7965"], ["#dad5e7", "#8981a5"], ["#55524d", "#262523"]];
const DEFS = `<defs>${PH.map(([a, b], i) => `<linearGradient id="ph${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`).join("")}</defs>`;
const ell = (cx, cy, rx, ry, fill) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;
// A photo placeholder: tinted gradient, horizon, sun and a couple.
const photo = (x, y, w, h, k, r = 4) => clipped(x, y, w, h, rect(x, y, w, h, { r, fill: `url(#ph${k})` }),
  `<path d="M${x} ${y + h} L${x} ${y + h * 0.74} Q${x + w * 0.3} ${y + h * 0.6} ${x + w * 0.55} ${y + h * 0.72} T${x + w} ${y + h * 0.66} L${x + w} ${y + h} Z" fill="rgba(60,40,30,.2)"/>`,
  circle(x + w * 0.76, y + h * 0.26, Math.min(w, h) * 0.08, { fill: "rgba(255,255,255,.55)" }),
  ell(x + w * 0.44, y + h * 0.66, w * 0.07, h * 0.2, "rgba(255,255,255,.75)"), circle(x + w * 0.44, y + h * 0.42, Math.min(w, h) * 0.05, { fill: "rgba(255,255,255,.8)" }),
  ell(x + w * 0.56, y + h * 0.68, w * 0.06, h * 0.18, "rgba(40,30,25,.45)"), circle(x + w * 0.56, y + h * 0.46, Math.min(w, h) * 0.045, { fill: "rgba(40,30,25,.5)" }));
const scr = (fill, ...kids) => rect(SC.x - 1, SC.y - 1, SC.w + 2, SC.h + 2, { fill: "rgba(16,24,40,.06)" }) + clipped(SC.x, SC.y, SC.w, SC.h, rect(SC.x, SC.y, SC.w, SC.h, { fill }), ...kids);
const bumps = (y, dir) => rect(SC.x, dir > 0 ? SC.y : y, SC.w, dir > 0 ? y - SC.y : SC.y + SC.h - y, { fill: MAROON }) +
  Array.from({ length: 14 }, (_, i) => circle(SC.x + 14 + i * 29, y, 11 + (i % 3) * 3, { fill: MAROON })).join("");
const cloud = (cx, cy, s = 1) => circle(cx, cy, 13 * s, { fill: MAROON }) + circle(cx - 17 * s, cy + 6 * s, 10 * s, { fill: MAROON }) + circle(cx + 17 * s, cy + 6 * s, 10 * s, { fill: MAROON }) + rect(cx - 27 * s, cy + 6 * s, 54 * s, 10 * s, { r: 5 * s, fill: MAROON });
const disc = () => circle(1065, 765, 26, { fill: "#1b1b1b" }) + circle(1065, 765, 10, { fill: C.white }) + `<path d="M1062 760 L1069 765 L1062 770 Z" fill="#1b1b1b"/>`;
const DOCK = [["Mempelai", "heart"], ["Acara", "calendar"], ["Galeri", "image"], ["Ucapan", "message-circle"], ["Hadiah", "gift"]];
const dock = (active) => shadow(764, 810, 316, 70, 18) + rect(764, 810, 316, 70, { r: 18, fill: MAROON }) + DOCK.map(([n, ic], i) => {
  const x = 802 + i * 60;
  return (n === active ? rect(x - 28, 818, 56, 54, { r: 12, fill: "rgba(255,255,255,.18)" }) : "") + icon(ic, x, 836, 18, C.white) + text(x, 860, n, { size: 11, font: SERIF, fill: C.white, anchor: "middle" });
}).join("");
const secTitle = (t) => cloud(780, 150, 0.8) + cloud(1064, 150, 0.8) + text(CX, 222, t, { size: 46, font: SCRIPT, fill: MAROON, anchor: "middle" });
const sTxt = (y, s, o = {}) => text(CX, y, s, { size: o.size ?? 14, font: SERIF, fill: o.fill ?? "#3a302b", weight: o.weight, anchor: "middle" });
function pvCover(names) {
  const arch = "M852 400 V282 A70 70 0 0 1 992 282 V400 Z";
  return scr(CREAM, bumps(SC.y + 20, 1), bumps(SC.y + SC.h - 28, -1), cloud(797, 236), cloud(1047, 236),
    `<path d="M796 262 L850 248 L850 384 L796 364 Z M1048 262 L994 248 L994 384 L1048 364 Z" fill="none" stroke="${MAROON}" stroke-width="3"/>`,
    `<path d="M806 280 Q823 300 806 330 Q823 350 812 362 M1038 280 Q1021 300 1038 330 Q1021 350 1032 362" fill="none" stroke="${MAROON}" stroke-width="2"/>`,
    `<defs><clipPath id="arch"><path d="${arch}"/></clipPath></defs><g clip-path="url(#arch)">${photo(852, 212, 140, 188, 0, 0)}</g><path d="${arch}" fill="none" stroke="${MAROON}" stroke-width="2"/>`,
    sTxt(433, "The Wedding Of", { size: 18, fill: INK }), text(CX, 508, names, { size: 46, font: SCRIPT, fill: MAROON, anchor: "middle" }),
    sTxt(557, "Minggu, 14 Februari 2027", { size: 15, weight: 700, fill: INK }), sTxt(578, "#RaniDimas", { size: 13 }),
    sTxt(613, "Kepada Yth. Bapak/Ibu/Saudara/i", { size: 13, weight: 700, fill: INK }), sTxt(637, "Tamu Undangan", { size: 17, fill: MAROON }),
    rect(836, 673, 171, 48, { r: 24, fill: MAROON }) + icon("mail", 868, 697, 16, C.white) + text(936, 702, "Buka Undangan", { size: 15, font: SERIF, fill: C.white, anchor: "middle" }), disc());
}
const EV = {
  akad: { y: 250, h: 162, title: "Akad Nikah", time: "08.00 WIB s.d. Selesai", place: "Masjid Al-Ikhlas", addr: "Jl. Melati 1, Jakarta" },
  resepsi: { y: 426, h: 110, title: "Resepsi", time: "11.00 s.d. 14.00 WIB" }
};
const evCard = (e) => rect(751, e.y, 342, e.h, { r: 14, fill: C.white, stroke: "#ecd9c6" }) + sTxt(e.y + 38, e.title, { size: 22, weight: 700, fill: MAROON }) +
  sTxt(e.y + 66, "Minggu, 14 Februari 2027") + sTxt(e.y + 90, e.time) + (e.place ? sTxt(e.y + 120, e.place, { weight: 700, fill: INK }) + sTxt(e.y + 141, e.addr, { size: 12 }) : "");
const pvEvents = (list) => scr(CREAM, secTitle("Waktu & Tempat"), ...list.map((k) => evCard(EV[k])), dock("Acara"), disc());
const pvGallery = () => scr(CREAM, secTitle("Galeri"), sTxt(262, "Sebagian momen yang ingin kami bagi"), sTxt(283, "bersama Anda."),
  photo(751, 305, 342, 236, 0, 10), photo(751, 553, 165, 120, 2, 10), dock("Galeri"), disc());
const pvGifts = () => scr(CREAM, secTitle("Tanda Kasih"), sTxt(262, "Doa restu Anda sudah lebih dari cukup."), sTxt(284, "Bila ingin memberi tanda kasih,"), sTxt(306, "dapat melalui:"),
  rect(842, 334, 160, 46, { r: 23, fill: MAROON }) + icon("gift", 874, 357, 16, C.white) + text(932, 362, "Kirim Hadiah", { size: 15, font: SERIF, fill: C.white, anchor: "middle" }), dock("Hadiah"), disc());
// Another landing page's HTML (before a template is picked): neutral blocks, no text.
const pvForeign = () => scr(C.white, rect(SC.x, SC.y, SC.w, 56, { fill: "#1f2937" }), rect(SC.x + 20, SC.y + 20, 90, 16, { r: 3, fill: "#4b5563" }),
  rect(SC.x, SC.y + 56, SC.w, 250, { fill: "#e5e7eb" }), rect(SC.x + 40, SC.y + 130, 310, 22, { r: 4, fill: "#9ca3af" }), rect(SC.x + 70, SC.y + 166, 250, 14, { r: 4, fill: "#c4c8ce" }),
  rect(SC.x + 125, SC.y + 220, 140, 40, { r: 6, fill: "#2563eb" }),
  ...[0, 1, 2, 3, 4, 5, 6].map((i) => rect(SC.x + 30, SC.y + 340 + i * 26, [330, 290, 310, 250, 320, 280, 200][i], 10, { r: 5, fill: "#e5e7eb" })),
  rect(SC.x + 30, SC.y + 540, 155, 120, { r: 6, fill: "#f3f4f6" }), rect(SC.x + 205, SC.y + 540, 155, 120, { r: 6, fill: "#f3f4f6" }));
const pvFolio = () => scr("#F4F1EA", photo(SC.x, SC.y, SC.w, 300, 6, 0), rect(SC.x, SC.y + 300, SC.w, 140, { fill: "#232220" }),
  sTxt(402, "Undangan Pernikahan", { size: 13, fill: "#f4f1ea" }), sTxt(452, "Rani & Dimas", { size: 38, fill: C.white }), sTxt(484, "Minggu, 14 Februari 2027", { fill: "#f4f1ea" }),
  sTxt(600, "Kepada Yth. Bapak/Ibu/Saudara/i", { size: 13, fill: "#333333" }), sTxt(628, "Tamu Undangan", { size: 18, fill: "#1E1E1E" }),
  rect(836, 660, 172, 46, { fill: "#1E1E1E" }) + text(922, 688, "Buka Undangan", { size: 15, font: SERIF, fill: C.white, anchor: "middle" }));
const pvDasar = () => scr("#F4F1EA", rect(747.5, 126.5, 349, 743, { stroke: "#3A3A3A", sw: 0.8 }), sTxt(300, "Undangan Pernikahan", { size: 13, fill: "#6B6B6B" }),
  sTxt(360, "Rani & Dimas", { size: 40, fill: "#1E1E1E" }), line(872, 382, 972, 382, { stroke: "#6B6B6B" }), sTxt(410, "Minggu, 14 Februari 2027", { size: 15, fill: "#333333" }),
  sTxt(560, "Kepada Yth. Bapak/Ibu/Saudara/i", { size: 13, fill: "#333333" }), sTxt(588, "Tamu Undangan", { size: 18, fill: "#1E1E1E" }),
  rect(836, 620, 172, 46, { r: 6, fill: "#3A3A3A" }) + text(922, 648, "Buka Undangan", { size: 15, font: SERIF, fill: C.white, anchor: "middle" }));

// ---- Template panel ------------------------------------------------------------------------------------------------
// Template list in catalogue order (nikahkit/templates/*/template.json name + description).
const TPL = [
  ["dasar", "Dasar", ["Polos · 20 bagian · HP &", "desktop · ID/EN"]], ["folio", "Folio", ["20 bagian · HP &", "desktop · ID/EN"]],
  ["galeri", "Galeri Putih", ["20 bagian · HP &", "desktop · ID/EN"]], ["modern-estetik", "Modern Estetik", ["20 bagian · HP &", "desktop · ID/EN"]],
  ["cute-gemoy", "Cute Gemoy", ["20 bagian · HP &", "desktop · ID/EN"]], ["tradisional-elegan", "Tradisional Elegan", ["20 bagian · HP &", "desktop · ID/EN"]]
];
const STRIP = { dasar: ["#ffffff", "#e7e3dc", "#3a3a3a"], folio: ["#ffffff", "#e9e3d8", "#2b2a28"], galeri: ["#ffffff", "#eceae6", "#9a948c"],
  "modern-estetik": ["#ffffff", "#efe7dd", "#7b5a44"], "cute-gemoy": ["#fff3f6", "#fbd9e2", "#e48aa3"], "tradisional-elegan": ["#2b1e16", "#4a3426", "#c9a86a"] };
const HS = [10, 16, 8, 20, 12, 18, 9, 14, 22, 11, 16, 8, 13];
// Catalogue thumbnail: the template's phone cover plus its section strip (the real card image is a screenshot).
function thumb(x, y, id) {
  const [a, b, c] = STRIP[id], ix = x + 6, iy = y + 6, iw = 74, ih = 155, mx = ix + iw / 2;
  let s = "";
  for (const [k, cx] of [[0, x + 84], [5, x + 108]]) {
    let yy = y + 6, i = k;
    while (yy < y + 160) { const h = HS[i % HS.length]; s += rect(cx, yy, 22, Math.min(h - 2, y + 161 - yy), { r: 1, fill: i % 3 === 2 ? c : i % 2 ? b : a }); yy += h; i++; }
  }
  const tline = (yy, w, f) => rect(mx - w / 2, yy, w, 2.5, { r: 1, fill: f });
  if (id === "dasar" || id === "folio") s += photo(ix, iy, iw, ih, 6, 3) + text(mx, iy + (id === "dasar" ? 70 : 92), "Rani & Dimas", { size: 7, font: SERIF, fill: C.white, anchor: "middle" }) + tline(iy + 78, 40, "rgba(255,255,255,.7)") + tline(iy + 98, 30, "rgba(255,255,255,.6)") + rect(mx - 15, iy + 108, 30, 6, { r: 3, fill: C.white });
  else if (id === "galeri") s += rect(ix, iy, iw, ih, { r: 3, fill: C.white }) + tline(iy + 14, 30, "#9a948c") + tline(iy + 22, 22, "#c9c3bb") + photo(ix + 12, iy + 40, 50, 64, 0, 2) + tline(iy + 118, 40, "#6b6560") + rect(mx - 18, iy + 132, 36, 7, { fill: "#2F3E4E" });
  else if (id === "modern-estetik") s += rect(ix, iy, iw, ih, { r: 3, fill: C.white }) + tline(iy + 16, 36, "#9b8676") + photo(ix + 17, iy + 30, 40, 52, 4, 20) + tline(iy + 96, 30, "#7b5a44") + tline(iy + 104, 24, "#7b5a44") + rect(mx - 16, iy + 126, 32, 7, { r: 3.5, fill: "#7b5a44" });
  else if (id === "cute-gemoy") s += rect(ix, iy, iw, ih, { r: 3, fill: "#fde7ec" }) + circle(mx, iy + 56, 22, { fill: "#f7b9c8" }) + circle(mx, iy + 56, 16, { fill: "#fff3f6" }) + tline(iy + 96, 40, "#e48aa3") + tline(iy + 106, 28, "#e9a4b6") + rect(mx - 16, iy + 126, 32, 7, { r: 3.5, fill: "#e48aa3" });
  else s += rect(ix, iy, iw, ih, { r: 3, fill: "#2b1e16" }) + `<path d="M${ix + 14} ${iy + 100} V${iy + 48} A23 23 0 0 1 ${ix + 60} ${iy + 48} V${iy + 100} Z" fill="none" stroke="#c9a86a" stroke-width="1.5"/>` + tline(iy + 116, 40, "#c9a86a") + tline(iy + 126, 26, "#a88b58");
  return s;
}
function card(x, y, [id, name, desc], o = {}) {
  return rect(x + 1, y + 1, 132, 165, { r: 8, fill: C.page, stroke: o.on ? C.primary : C.line, sw: 2 }) + clipped(x + 2, y + 2, 130, 163, thumb(x, y, id)) +
    text(x, y + 188, name, { size: 14, weight: 500 }) + (o.on ? badge(x + 133, y + 174, "Dipakai") : "") + para(x, y + 209, desc, { size: 12, fill: C.faint, lh: 16 });
}
const CARD = (i, top) => [i % 2 ? 234 : 88, top + Math.floor(i / 2) * 241];
const cards = (top, used) => TPL.map((t, i) => card(...CARD(i, top), t, { on: t[0] === used })).join("");
const MEGAPHONE = `<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>`;
const seg = () => rect(P + 0.5, 169.5, PW - 1, 37, { r: 4, fill: C.white, stroke: C.field }) + rect(P + 1, 170, 138, 36, { r: 3, fill: C.primarySoft }) +
  icon("layout-grid", 129, 188, 16, C.action) + text(146, 192, "Template", { size: 12, weight: 600, fill: C.action }) +
  `<g transform="translate(289 180) scale(.6667)" fill="none" stroke="${C.text}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${MEGAPHONE}</g>`;
const htmlNote = () => rect(P, 219, PW, 56, { r: 4, fill: C.warnSoft }) + para(P + 12, 242, ["Halaman berisi HTML lain. Memilih template", "akan menggantinya."], { size: 12, fill: C.warnStrong, lh: 18 });
const templatePanel = (used) => body(seg(), cards(219, used));

// ---- Konten panel (Mempelai open, as the reference) -------------------------------------------------------------------
const NICK_Y = 685; // Nama panggilan input (Mempelai Wanita)
function kontenBody(left = 6, link = "Ganti nama mempelai wanita") {
  const c = col(P, 245, PW).add(sampleNote(left, link));
  c.field("Bahasa undangan", "Indonesia", { select: true, hint: ["Hanya halaman tamu. Teks bawaan ikut berganti;", "teks yang sudah diubah tetap."] });
  c.add(rich(P, c.y + 12, ["Urutan dan tampilan bagian di ", { t: "Lapisan", w: 500, u: true }, "."]), 28);
  c.add(acc(c.y, "Sampul", "Terisi"), 58).add(acc(c.y, "Mempelai", "Terisi", true));
  const m = col(I, c.y + 54, IW);
  m.field("Judul", "Mempelai", { ph: true }).field("Urutan nama", "Wanita dulu", { select: true }).h3("Mempelai Wanita")
    .field("Nama panggilan", "Rani", { hint: ["Tampil di sampul."] }).field("Nama lengkap dan gelar", "Rani Ayu, S.Psi.").field("Profesi atau bio singkat (opsional)", "Psikolog");
  return body(c.svg, m.svg);
}
const kontenPanel = (o = {}) => nkRail(0, 0, "Konten") + rect(72, 92, 327, 808, { fill: C.white }) + nkHead(0, 0, "Konten", { account: ACCOUNT }) + kontenBody(o.left, o.link);
const editor = (rail) => [DEFS, scalevEditor(0, 0, { rail })];
// The panel head and Scalev bars above a scrolling panel body (content slides under them).
const lid = (rail) => clipped(72, 0, 327, 153, scalevEditor(0, 0, { rail }), nkHead(0, 0, "Konten", { account: ACCOUNT }));

export const scenes = {
  // ---------------------------------------------------------------------------------------------------------------------
  "editor-peta": {
    title: "Peta editor NikahKit di Scalev",
    world: WORLD,
    base: [...editor("Template"), nkHead(0, 0, "Template", { account: ACCOUNT }), templatePanel("sekar-kedaton"), pvCover("Rani & Dimas")],
    els: {
      konten: { svg: kontenPanel(), enter: "fade", delay: 1.15 },
      o1: { svg: tag(420, 120, "Tab Scalev & NikahKit", 150, 80, 2), enter: "pop", origin: [150, 80], delay: 0.2 },
      o2: { svg: tag(420, 250, "Menu dan alat", 50, 330, 2), enter: "pop", origin: [50, 330], delay: 0.45 },
      o3: { svg: tag(420, 380, "Panel", 300, 560, 2), enter: "pop", origin: [300, 560], delay: 0.7 },
      o4: { svg: tag(1140, 300, "Pratinjau", 1080, 420, 2), enter: "pop", origin: [1080, 420], delay: 0.95 },
      o5: { svg: tag(1150, 140, "Simpan", 1300, 86, 2), enter: "pop", origin: [1300, 86], delay: 1.2 },
      n2: { svg: ring(10, 52, 210, 30, { r: 6 }) + ring(226, 50, 82, 34, { r: 6 }) + tag(40, 190, "Tab Scalev", 110, 86) + tag(250, 240, "Tab NikahKit", 266, 88), enter: "fade" },
      n3: { svg: ring(1193, 50, 241, 34, { r: 6 }) + tag(1150, 170, "Tombol Scalev", 1300, 88), enter: "fade" },
      n4: { svg: ring(2, 104, 68, 332, { r: 6 }), enter: "fade" },
      n5: { svg: ring(226, 112, 20, 20, { r: 4 }) + ring(262, 108, 79, 27, { r: 16 }) + ring(358, 112, 20, 20, { r: 4 }) + tag(430, 100, "Tutup", 382, 122) + tag(430, 160, "Tombol akun", 345, 130) + tag(430, 220, "Pesanan masuk", 240, 136), enter: "fade" },
      n6: { svg: ring(2, 562, 68, 286, { r: 6 }) + ring(2, 855, 68, 42, { r: 6 }) + tag(430, 640, "Alat", 72, 690) + tag(430, 800, "Status simpan", 72, 876), enter: "fade" },
      n7: { svg: ring(SC.x, SC.y, SC.w, 410, { r: 2 }) + tag(560, 200, "Pratinjau", 723, 260), enter: "fade" }
    },
    steps: [
      { caption: "Editor NikahKit menumpang di editor halaman Scalev. Ini petanya.", cam: "all", show: ["o1", "o2", "o3", "o4", "o5"], dur: 3.8 },
      { caption: "Code, Media, Security, Settings milik Scalev. Klik tab NikahKit.", cam: { x: 0, y: 24, w: 600 }, hide: ["o1", "o2", "o3", "o4", "o5"], show: ["n2"], at: ED.tab.NikahKit, click: true },
      { caption: "Simpan dan Simpan & Terbitkan di kanan atas tetap tombol Scalev.", cam: { x: 840, y: 24, w: 600 }, hide: ["n2"], show: ["n3"], at: ED.simpan },
      { caption: "Kolom kiri berisi enam menu. Klik Konten, panelnya terbuka di tengah.", cam: { x: 0, y: 90, w: 660 }, hide: ["n3"], show: ["n4", "konten"], at: ED.rail.Konten, click: true, dur: 3.6 },
      { caption: "Kepala panel: judul menu, Pesanan masuk, tombol akun, dan Tutup.", cam: { x: 40, y: 60, w: 560 }, hide: ["n4"], show: ["n5"], at: ED.account },
      { caption: "Di bawah menu ada alat. Paling bawah status simpan: Tersimpan.", cam: { x: 0, y: 540, w: 640 }, hide: ["n5"], show: ["n6"], at: [36, 878] },
      { caption: "Di kanan, pratinjau undangan berubah setiap kamu mengisi.", cam: { x: 520, y: 96, w: 760 }, hide: ["n6"], show: ["n7"], at: [922, 470], dur: 3.6 }
    ]
  },

  // ---------------------------------------------------------------------------------------------------------------------
  "editor-pilih-template": {
    title: "Memilih template NikahKit",
    world: WORLD,
    base: [...editor("Template"), nkHead(0, 0, "Template", { inbox: false, account: ACCOUNT }), body(seg()), pvForeign()],
    els: {
      // Before a template is picked: only Template and Media open, Bagikan and Kosongkan disabled (opacity .4).
      locked: [160, 216, 328, 384].map((y) => rect(0, y, 71, 52, { fill: C.page, opacity: 0.62 })).join("") + rect(0, 560, 71, 50, { fill: C.page, opacity: 0.62 }) + rect(0, 750, 71, 46, { fill: C.page, opacity: 0.62 }),
      cardsA: { svg: body(htmlNote(), cards(287)), enter: "fade" },
      rSeg: { svg: ring(P, 169, PW, 38, { r: 6 }), enter: "fade" },
      rNote: { svg: ring(P, 219, PW, 56, { r: 6 }), enter: "fade" },
      veil: { svg: rect(0, 0, 1440, 900, { fill: "rgba(255,255,255,.92)" }), enter: "fade", delay: 1.2 },
      dlg: { svg: shadow(540, 383, 360, 134, 8, 3) + rect(540, 383, 360, 134, { r: 8, fill: C.white }) + text(560, 418, "Ganti isi halaman dengan Folio?", { size: 14, weight: 600 }) +
        text(560, 442, "HTML yang sekarang ada di halaman akan diganti.", { size: 12, fill: C.faint }) + nkBtn(758, 461, "Batal", { variant: "quiet", w: 57 }), enter: "pop", origin: [720, 450], delay: 1.2 },
      gnt: { svg: nkBtn(823, 461, "Ganti", { w: 57 }), enter: "pop", origin: [720, 450], delay: 1.2 },
      inboxIc: { svg: icon("inbox", 236, 122, 18, C.text), enter: "fade" },
      cardsB: { svg: body(panelBg(), seg(), cards(219, "folio")), enter: "fade" },
      pvF: { svg: pvFolio(), enter: "fade", delay: 0.2 },
      cardsC: { svg: body(panelBg(), seg(), cards(219, "dasar")), enter: "fade", delay: 1.15 },
      pvD: { svg: pvDasar(), enter: "fade", delay: 1.3 },
      toast: { svg: shadow(84, 836, 302, 52, 4, 2) + rect(84, 836, 302, 52, { r: 4, fill: C.strong }) + text(96, 867, "Template diganti ke Dasar.", { size: 14, fill: C.white }) +
        text(374, 867, "Urungkan", { size: 14, weight: 700, fill: "#7fd3f5", anchor: "end" }), enter: "slide", delay: 1.4 }
    },
    steps: [
      { caption: "Klik Template di menu kiri. Pastikan pilihan Template yang aktif.", cam: { x: 0, y: 92, w: 760 }, at: ED.rail.Template, click: true, show: ["rSeg"] },
      { caption: "Halaman berisi HTML lain? Peringatan kuning muncul di atas kartu.", hide: ["rSeg"], show: ["rNote"], at: [260, 247] },
      { caption: "Klik kartu yang kamu suka, misalnya Folio.", cam: { x: 0, y: 96, w: 960 }, hide: ["rNote"], at: [301, 370], click: true, show: ["veil", "dlg", "gnt"] },
      { caption: "Dialog bertanya: Ganti isi halaman dengan Folio? Klik Ganti.", cam: { x: 420, y: 260, w: 600 }, at: [851, 479], click: true, press: "gnt", dur: 2.8 },
      { caption: "Template terpasang. Kartu Folio bertanda Dipakai, menu lain terbuka.", cam: { x: 70, y: 96, w: 1060 }, hide: ["veil", "dlg", "gnt", "cardsA", "locked"], show: ["cardsB", "pvF", "inboxIc"], at: [301, 400], dur: 3.6 },
      { caption: "Mau ganti nanti? Klik kartu lain, misalnya Dasar. Isian tetap terbawa.", at: [155, 300], click: true, show: ["cardsC", "pvD", "toast"], dur: 3.6 },
      { caption: "Pesan Template diganti ke Dasar. muncul. Urungkan membatalkannya.", cam: { x: 40, y: 520, w: 680 }, at: [345, 864], dur: 3.6 }
    ]
  },

  // ---------------------------------------------------------------------------------------------------------------------
  "editor-isi-mempelai": {
    title: "Mengisi nama mempelai di Konten",
    world: WORLD,
    base: [...editor("Template"), nkHead(0, 0, "Template", { account: ACCOUNT }), templatePanel("sekar-kedaton"), pvCover("Rani & Dimas")],
    els: {
      konten: { svg: kontenPanel(), enter: "fade", delay: 1.15 },
      rMemp: { svg: ring(P, 439, PW, 50, { r: 6 }), enter: "fade" },
      focus: { svg: inp(I, NICK_Y, IW, "Rani", { focus: true, sel: true }), enter: "fade", delay: 1.15 },
      clear: { svg: inp(I, NICK_Y, IW, "", { focus: true }), enter: "fade" },
      typed: { svg: text(I + 11, NICK_Y + 23, "Sinta", { size: 14, fill: C.strong }), enter: "fade" },
      pvS: { svg: rect(760, 462, 324, 64, { fill: CREAM }) + text(CX, 508, "Sinta & Dimas", { size: 46, font: SCRIPT, fill: MAROON, anchor: "middle" }) + ring(770, 466, 304, 58, { r: 10 }), enter: "fade", delay: 0.5 },
      note5: { svg: rect(P, 169, PW, 64, { r: 4, fill: C.warnSoft }) + text(P + 12, 192, "5 isian masih contoh. Ganti sebelum terbit.", { size: 12, fill: C.warnStrong }) +
        text(P + 12, 218, "Ganti foto sampul", { size: 12, weight: 500, fill: C.strong, underline: true }) + ring(P, 169, PW, 64, { r: 6 }), enter: "fade", delay: 0.4 }
    },
    steps: [
      { caption: "Klik Konten di menu kiri. Daftar bagian undangan muncul.", cam: { x: 0, y: 92, w: 760 }, at: ED.rail.Konten, click: true, show: ["konten"] },
      { caption: "Mempelai biasanya sudah terbuka. Bila tertutup, klik namanya.", show: ["rMemp"], at: [190, 464] },
      { caption: "Klik kotak Nama panggilan di bawah Mempelai Wanita. Isinya contoh: Rani.", cam: { x: 40, y: 420, w: 640 }, hide: ["rMemp"], at: [230, NICK_Y + 18], click: true, show: ["focus"], dur: 3.4 },
      { caption: "Ketik nama panggilan klien, misalnya Sinta.", show: ["clear", "typed"], type: [{ id: "typed", n: 5, box: [I + 10, NICK_Y + 7, tw("Sinta", 14) + 2, 22] }] },
      { caption: "Nama di sampul pratinjau langsung berubah.", cam: { x: 60, y: 308, w: 1060 }, show: ["pvS"], dur: 3.4 },
      { caption: "Catatan kuning ikut berkurang: tinggal 5 isian yang masih contoh.", cam: { x: 0, y: 92, w: 760 }, show: ["note5"], at: [190, 218], dur: 3.6 }
    ]
  },

  // ---------------------------------------------------------------------------------------------------------------------
  "editor-tambah-acara": (() => {
    const DY = 560;
    // Panel scrolled to Acara & Tanggal (Mempelai closed above it), one event left in the list.
    const c = col(I, 223, IW).field("Zona waktu", "WIB", { select: true })
      .field("Acara utama", "Akad Nikah", { select: true, hint: ["Acuan tanggal sampul, Simpan Tanggal,", "Hitung Mundur, dan kalender. Tanpa", "tanggal: acara pertama yang bertanggal."] });
    const it1 = c.y;
    const f1 = col(I + 10, it1 + 48, IW - 20).field("Nama acara", "Akad Nikah").field("Mulai", "14/02/2027, 08.00", { icon: "calendar" })
      .field("Selesai (opsional)", "hh/bb/tttt, --.--", { icon: "calendar", ph: true }).field("Nama tempat atau gedung", "Masjid Al-Ikhlas")
      .area("Alamat lengkap", ["Jl. Melati 1, Jakarta"]).field("Tautan peta", "https://maps.google.com/?q=Kebayoran+Baru").area("Catatan (opsional)", ["Khusus keluarga inti"]);
    const end1 = f1.y - 2, btnY = end1 + 8;
    const after = col(I, btnY + 48, IW).toggle("Tampilkan peta di kartu acara", true, ["Butuh tautan Google Maps dan alamat."]).lead("Hitung mundur memakai Acara utama.");
    const scrolled = rect(72, 153, 327, 747 + DY, { fill: C.white }) + acc(111, "Mempelai", "Terisi") + acc(169, "Acara & Tanggal", "Terisi", true) + c.svg +
      itemBox(it1, end1 - it1) + itemBar(it1, "Akad Nikah", true, true) + f1.svg + quietBlock(I, btnY, IW, "Tambah acara", "plus") + after.svg;
    // Second event, after scrolling (world y = scrolled y - DY).
    const y2 = btnY - DY, nameY = y2 + 48, startY = nameY + 68, endY = startY + 68;
    const lower = (y) => col(I + 10, y, IW - 20).field("Nama tempat atau gedung", "").area("Alamat lengkap", []).field("Tautan peta", "https://...", { ph: true }).svg;
    const item2 = rect(I, y2 - 1, IW, 901 - y2, { fill: C.white }) + itemBox(y2, 900 - y2 + 20) + itemBar(y2, "Acara 2", false, true) +
      col(I + 10, nameY, IW - 20).field("Nama acara", "mis. Akad Nikah", { ph: true }).field("Mulai", "hh/bb/tttt, --.--", { icon: "calendar", ph: true }).field("Selesai (opsional)", "hh/bb/tttt, --.--", { icon: "calendar", ph: true }).svg + lower(endY + 68);
    const below = (y) => rect(I + 2, y, IW - 4, 900 - y, { fill: C.page });
    const times = rect(I + 11, startY + 21, IW - 58, 34, { fill: C.white }) + text(I + 21, startY + 43, "14/02/2027, 11.00", { size: 14, fill: C.strong }) +
      below(endY + 18) + inp(I + 10, endY + 20, IW - 20, "14/02/2027, 10.00", { icon: "calendar", err: true, focus: true }) +
      text(I + 10, endY + 71, "Jam selesai harus setelah jam mulai.", { size: 12, fill: C.danger }) + lower(endY + 88);
    const fixed = below(endY + 18) + inp(I + 10, endY + 20, IW - 20, "14/02/2027, 14.00", { icon: "calendar", focus: true }) + lower(endY + 68);
    const dd = shadow(I, 281, IW, 80, 6, 2) + rect(I, 281, IW, 80, { r: 6, fill: C.white, stroke: C.field }) + rect(I + 4, 285, IW - 8, 24, { r: 4, fill: C.primarySoft }) +
      ["WIB", "WITA", "WIT"].map((v, i) => text(I + 14, 302 + i * 24, v, { size: 14, fill: C.strong })).join("") + iconX("check", I + IW - 18, 297, 14, C.action);
    return {
      title: "Menambah acara di Acara & Tanggal",
      world: WORLD,
      base: [...editor("Konten"), pvEvents(["akad"])],
      els: {
        list: scrolled,
        dd: { svg: dd, enter: "pop", origin: [I + IW / 2, 279], delay: 1.15 },
        item2: { svg: item2, enter: "rise", delay: 1.3 },
        nFocus: { svg: inp(I + 10, nameY + 20, IW - 20, "", { focus: true }), enter: "fade", delay: 1.15 },
        nBlur: { svg: inp(I + 10, nameY + 20, IW - 20, ""), enter: "fade" },
        nTyped: { svg: text(I + 21, nameY + 43, "Resepsi", { size: 14, fill: C.strong }), enter: "fade" },
        title2: { svg: rect(I + 8, y2 + 12, 80, 22, { fill: C.page }) + text(I + 10, y2 + 28, "Resepsi", { size: 12, weight: 700 }), enter: "fade", delay: 1.1 },
        times: { svg: times, enter: "fade", delay: 1.2 },
        fixed: { svg: fixed, enter: "fade", delay: 1.15 },
        lidE: lid("Konten"),
        pv2: { svg: pvEvents(["akad", "resepsi"]) + ring(751, EV.resepsi.y, 342, EV.resepsi.h, { r: 16 }), enter: "fade", delay: 0.3 }
      },
      steps: [
        { caption: "Di Acara & Tanggal, pilih Zona waktu: WIB, WITA, atau WIT.", cam: { x: 40, y: 150, w: 680 }, at: [I + 120, 261], click: true, show: ["dd"] },
        { caption: "Gulir ke bawah daftar acara, lalu klik Tambah acara.", cam: { x: 40, y: 300, w: 680 }, hide: ["dd"], scroll: { id: "list", dy: DY }, at: [I + IW / 2, y2 + 18], click: true, show: ["item2"], dur: 3.6 },
        { caption: "Kotak Acara 2 muncul. Klik kotak Nama acara.", at: [I + 120, nameY + 38], click: true, show: ["nFocus"] },
        { caption: "Ketik nama acara, misalnya Resepsi. Judul kotaknya ikut berganti.", show: ["nTyped", "title2"], type: [{ id: "nTyped", n: 7, box: [I + 20, nameY + 27, tw("Resepsi", 14) + 2, 22] }], dur: 3.4 },
        { caption: "Isi Mulai dan Selesai. Selesai lebih awal? Muncul pesan merah.", hide: ["nFocus"], show: ["nBlur", "times"], at: [I + 120, endY + 38], click: true, dur: 3.6 },
        { caption: "Perbaiki jam Selesai, misalnya 14.00. Pesan merah hilang.", at: [I + 60, endY + 38], click: true, show: ["fixed"] },
        { caption: "Acara baru tampil di pratinjau, lengkap dengan jamnya.", cam: { x: 560, y: 120, w: 720 }, show: ["pv2"], at: [922, 470], dur: 3.6 }
      ]
    };
  })(),

  // ---------------------------------------------------------------------------------------------------------------------
  "editor-isi-galeri": (() => {
    // Panel scrolled to Galeri Foto (opened), sample photos already removed.
    const top = (n) => acc(111, "Kisah Cinta", "Terisi") + acc(169, "Galeri Foto", n ? "Terisi" : "Belum diisi", true) +
      col(I, 223, IW).field("Judul", "Galeri", { ph: true }).area("Teks pengantar (opsional)", ["Sebagian momen yang ingin kami", "bagi bersama Anda."]).svg +
      lbl(I, 371, `Foto galeri (${n})`);
    const rest = (y) => quietBlock(I, y, IW, "Tambah foto", "image") + text(I, y + 60, "Foto pertama tampil paling besar.", { size: 12, fill: C.faint }) +
      ["Video", "Dress Code", "Susunan Acara", "RSVP & Ucapan", "Siaran Langsung", "Filter Kamera", "Amplop Digital"].map((t, i) => acc(y + 85 + i * 58, t, "Terisi")).join("");
    // Media dialog (covers rail and panel): Unggah foto, paste link, 3-column grid, Pakai foto footer.
    const cell = (i) => [16 + (i % 3) * 124, 291 + Math.floor(i / 3) * 124];
    const dlg = nkDialogHead(0, 0, "Pilih foto") + nkBtn(16, 169, "Unggah foto", { variant: "ghost", w: 366, icon: "upload" }) + lbl(16, 217, "Atau tempel tautan https") +
      inp(16, 237, 300, "https://...", { ph: true }) + `<g opacity=".5">${nkBtn(322, 237, "Pakai", { variant: "ghost", w: 60 })}</g>` +
      clipped(0, 285, 399, 554, ...Array.from({ length: 12 }, (_, i) => photo(...cell(i), 118, 118, i % 6, 4))) +
      rect(0, 839, 399, 61, { fill: C.white }) + line(0, 839.5, 399, 839.5) + `<g opacity=".5">${nkBtn(16, 851, "Pakai foto", { w: 366 })}</g>`;
    const pick = (i) => { const [x, y] = cell(i); return rect(x + 1, y + 1, 116, 116, { r: 4, stroke: C.primary, sw: 2 }) + circle(x + 104, y + 14, 8, { fill: C.action }) + iconX("check", x + 104, y + 14, 10, C.white, 3.5); };
    const foot = (n) => rect(0, 840, 399, 60, { fill: C.white }) + nkBtn(16, 851, `Pakai ${n} foto`, { w: 366 });
    const row = (k) => { const y = 391 + k * 104; return rect(I + 0.5, y + 0.5, IW - 1, 95, { r: 4, fill: C.page, stroke: C.line }) + photo(I + 9, y + 9, 64, 64, k * 2, 4) +
      inp(I + 81, y + 9, 127, "Deskripsi foto", { ph: true }) + inp(I + 81, y + 51, 127, "Fokus tengah", { select: true }) +
      icon("chevron-up", I + 230, y + 27, 16, k ? C.text : "rgba(91,102,117,.35)") + icon("trash", I + 230, y + 63, 16, C.text); };
    return {
      title: "Mengisi Galeri Foto",
      world: WORLD,
      base: [...editor("Konten"), nkHead(0, 0, "Konten", { account: ACCOUNT }), body(top(0), rest(391)), pvCover("Rani & Dimas")],
      els: {
        dlg: { svg: dlg, enter: "rise", delay: 1.15 },
        s1: { svg: pick(0), enter: "pop", origin: [75, 350], delay: 1.1 },
        b1: { svg: foot(1), enter: "fade", delay: 1.1 },
        s2: { svg: pick(4), enter: "pop", origin: [199, 474], delay: 1.1 },
        b2: { svg: foot(2), enter: "fade", delay: 1.1 },
        after: { svg: body(panelBg(), top(2), rest(599)), enter: "fade" },
        r1: { svg: row(0), enter: "rise", delay: 0.15 },
        r2: { svg: row(1), enter: "rise", delay: 0.22 },
        rBadge: { svg: ring(306, 183, 50, 22, { r: 12 }), enter: "fade", delay: 0.5 },
        pvG: { svg: pvGallery(), enter: "fade", delay: 0.2 }
      },
      steps: [
        { caption: "Di Konten, buka Galeri Foto. Foto contoh sudah dihapus. Klik Tambah foto.", cam: { x: 0, y: 92, w: 760 }, at: [I + IW / 2, 409], click: true, show: ["dlg"], dur: 3.6 },
        { caption: "Jendela Pilih foto berisi foto Media Scalev. Klik satu foto.", cam: { x: 0, y: 140, w: 700 }, at: [75, 350], click: true, show: ["s1", "b1"] },
        { caption: "Klik foto lain. Setiap foto terpilih diberi tanda centang.", at: [199, 474], click: true, show: ["s2", "b2"] },
        { caption: "Klik Pakai 2 foto. Angkanya sesuai jumlah foto yang dipilih.", cam: { x: 0, y: 509, w: 700 }, at: [199, 869], click: true, press: "b2", dur: 2.6 },
        { caption: "Foto masuk ke daftar dengan kotak Deskripsi foto. Galeri kini Terisi.", cam: { x: 0, y: 92, w: 760 }, hide: ["dlg", "s1", "s2", "b1", "b2"], show: ["after", "r1", "r2", "rBadge"], at: [230, 420], dur: 3.6 },
        { caption: "Di pratinjau, foto pertama tampil paling besar.", cam: { x: 520, y: 160, w: 800 }, hide: ["rBadge"], show: ["pvG"], at: [922, 420], dur: 3.4 }
      ]
    };
  })(),

  // ---------------------------------------------------------------------------------------------------------------------
  "editor-rsvp-hadiah": (() => {
    // RSVP & Ucapan open (sample: allowMaybe off, maxGuests 2, the four "Tanyakan juga" switches on).
    const rs = col(I, 223, IW).field("Judul", "Ucapan & Kehadiran", { ph: true });
    const noteY = rs.y;
    rs.add(rect(I, noteY, IW, 38, { r: 4, fill: C.primarySoft }) + rich(I + 12, noteY + 24, ["Tersambung. ID: ", { t: "365671" }], { fill: C.strong }), 50);
    rs.field("Isi form", "Ucapan + konfirmasi hadir", { select: true });
    const guestsY = rs.y + 20;
    rs.field("Jumlah tamu paling banyak per undangan", "2 orang", { select: true })
      .field("Tenggat konfirmasi (opsional)", "07/02/2027, 23.59", { icon: "calendar", hint: ["Setelah lewat, form ditutup; daftar ucapan", "tetap tampil."] })
      .toggle("Tampilkan jumlah kehadiran", true, ["Mis. \"120 konfirmasi hadir\" di atas daftar", "ucapan."]);
    const maybeY = rs.y + 10;
    rs.toggle("Pilihan \"Masih ragu\"", false, ["Mati: tamu hanya memilih Hadir atau Tidak", "hadir."]).h3("Tanyakan juga")
      .toggle("Tamu dari pihak mana", true).toggle("Acara yang dihadiri", true, ["Butuh minimal 2 acara."]).toggle("Perkiraan jam datang", true)
      .toggle("Minta nomor WhatsApp tamu", true, ["Tamu mengisi nomornya sendiri di form (boleh", "kosong). Nomor tampil di Dashboard."]).lead("Jawaban tampil di Dashboard.")
      .toggle(["Tampilkan QR masuk untuk tamu", "undangan khusus"], false, ["Hanya berlaku bila Undangan khusus menyala", "(di Bagikan). Tamu yang menjawab Hadir", "melihat QR ini di kartu terima kasih RSVP;", "penerima tamu memindainya di halaman Check-in."]);
    const accY = rs.y + 8;
    const DY = accY + 2 * 58 - 420; // scroll so Amplop Digital's bar lands at y 420
    const accs = ["Siaran Langsung", "Filter Kamera", "Amplop Digital", "Aturan Tamu", "Turut Mengundang"].map((t, i) => acc(accY + i * 58, t, "Terisi")).join("");
    const amplopY = accY + 2 * 58 - DY;
    const rsvp = (o = {}) => rect(72, 153, 327, 747 + DY, { fill: C.white }) + acc(111, "Susunan Acara", "Terisi") + acc(169, "RSVP & Ucapan", "Terisi", true) + rect(P + 1, accY - 9, PW - 2, 1400, { fill: C.white }) + line(P, accY - 8.5, P + PW, accY - 8.5) +
      rs.svg + accs + (o.v3 ? inp(I, guestsY, IW, "3 orang", { select: true }) : "") + (o.on ? sw(I + IW - 36, maybeY, true) : "");
    const dd = shadow(I, guestsY + 38, IW, 152, 6, 2) + rect(I, guestsY + 38, IW, 152, { r: 6, fill: C.white, stroke: C.field }) + rect(I + 4, guestsY + 66, IW - 8, 24, { r: 4, fill: C.primarySoft }) +
      [1, 2, 3, 4, 5, 6].map((n, i) => text(I + 14, guestsY + 59 + i * 24, `${n} orang`, { size: 14, fill: C.strong })).join("") + iconX("check", I + IW - 18, guestsY + 78, 14, C.action);
    // Amplop Digital open (sample: reveal on, BCA 1234567890 a.n. Rani Ayu).
    const gc = col(I, 223, IW).field("Judul", "Tanda Kasih", { ph: true }).area("Teks pengantar (opsional)", ["Doa restu Anda sudah lebih dari", "cukup. Bila ingin memberi tanda"])
      .toggle(["Tampilkan lewat tombol", "\"Kirim Hadiah\""], true, ["Rekening dan alamat terbuka setelah tamu", "menekan tombol."]);
    const it = gc.y, fx = I + 10, fw = IW - 20;
    const fields = col(fx, it + 48, fw).field("Bank atau e-wallet", "BCA", { hint: ["Logo tampil otomatis untuk bank dan", "e-wallet yang dikenal (BCA, BNI, BRI,", "BSI, Mandiri, DANA, OVO, ...). Nama", "lain tampil sebagai teks."] });
    const numY = fields.y + 20;
    fields.field("Nomor rekening", "1234567890");
    const holderY = fields.y + 20;
    fields.field("Nama pemilik rekening", "Rani Ayu").add(lbl(fx, fields.y, "Gambar QRIS (opsional)") + quietBlock(fx, fields.y + 20, fw, "Pilih foto", "image"));
    const gifts = body(panelBg(), acc(111, "Filter Kamera", "Terisi"), acc(169, "Amplop Digital", "Terisi", true), gc.svg, itemBox(it, 900 - it + 20), itemBar(it, "BCA", true, false), fields.svg);
    return {
      title: "Mengatur RSVP dan Amplop Digital",
      world: WORLD,
      base: [...editor("Konten"), pvCover("Rani & Dimas")],
      els: {
        list1: rsvp(),
        rNote: { svg: ring(I, noteY, IW, 38, { r: 6 }), enter: "fade" },
        dd: { svg: dd, enter: "pop", origin: [I + IW / 2, guestsY + 36] },
        v3: { svg: inp(I, guestsY, IW, "3 orang", { select: true }), enter: "fade" },
        on: { svg: sw(I + IW - 36, maybeY, true), enter: "fade", delay: 1.15 },
        list2: { svg: rsvp({ v3: true, on: true }), enter: "fade" },
        gifts: { svg: gifts, enter: "fade", delay: 1.45 },
        nFocus: { svg: inp(fx, numY, fw, "1234567890", { focus: true, sel: true }), enter: "fade", delay: 1.1 },
        nClear: { svg: inp(fx, numY, fw, "", { focus: true }), enter: "fade" },
        nTyped: { svg: text(fx + 11, numY + 23, "7712003456", { size: 14, fill: C.strong }), enter: "fade" },
        holder: { svg: rect(fx + 2, holderY + 2, fw - 4, 32, { fill: C.white }) + text(fx + 11, holderY + 23, "Sinta Maharani", { size: 14, fill: C.strong }), enter: "fade", delay: 2.2 },
        lidE: lid("Konten"),
        pvH: { svg: pvGifts() + tag(560, 420, "Rekening ada di balik tombol ini", 842, 357), enter: "fade", delay: 0.2 }
      },
      steps: [
        { caption: "Buka RSVP & Ucapan. Catatan Tersambung. ID: (angka) berarti siap.", cam: { x: 40, y: 150, w: 680 }, show: ["rNote"], at: [I + 150, noteY + 19] },
        { caption: "Pilih Isi form, lalu Jumlah tamu paling banyak per undangan.", cam: { x: 40, y: 250, w: 680 }, hide: ["rNote"], show: ["dd"], at: [I + 80, guestsY + 102], click: true },
        { caption: "Nyalakan sakelar yang perlu, misalnya Pilihan \"Masih ragu\".", cam: { x: 40, y: 420, w: 680 }, hide: ["dd"], show: ["v3", "on"], at: [I + IW - 18, maybeY + 10], click: true },
        { caption: "Gulir ke Amplop Digital, lalu klik namanya. Rekening contoh sudah ada.", cam: { x: 40, y: 150, w: 680 }, hide: ["v3", "on"], show: ["list2", "gifts"], scroll: { id: "list2", dy: DY }, at: [P + 80, amplopY + 25], click: true, dur: 3.8 },
        { caption: "Klik Nomor rekening. Nomor contoh 1234567890 harus diganti.", cam: { x: 40, y: 470, w: 680 }, at: [fx + 150, numY + 18], click: true, show: ["nFocus"] },
        { caption: "Ketik nomor rekening klien. Ganti juga Nama pemilik rekening.", show: ["nClear", "nTyped", "holder"], type: [{ id: "nTyped", n: 10, box: [fx + 10, numY + 7, tw("7712003456", 14) + 2, 22] }], dur: 3.6 },
        { caption: "Di undangan, rekening tampil setelah tamu menekan Kirim Hadiah.", cam: { x: 520, y: 120, w: 760 }, show: ["pvH"], at: [922, 357], dur: 3.6 }
      ]
    };
  })()
};
