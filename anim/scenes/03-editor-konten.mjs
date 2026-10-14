// Editor dan Konten: langkah editor, pilih/ganti template, Langkah tiap halaman Konten, tambah acara, galeri, RSVP dan Amplop Digital.
// World = the real 1440x900 Scalev editor (lib scalevEditor). Panel boxes follow /tmp/ref/editor-metrics.json (Template,
// Konten: cards 134x229, accordions 279x50, fields 253 wide); labels from nikahkit/src/fields.js, model.js (SAMPLE,
// SAMPLE_CHECKS), ui/panel-content.jsx, ui/panels-style.jsx, ui/fields.jsx, ui/App.jsx (MediaDialog, Toast), store.js.
import { C, ED, esc, rect, text, line, circle, para, clipped, shadow, icon, iconX, tw, ring, nkHead, nkRail, nkLabel, nkBtn, nkDialogHead, scalevEditor } from "../lib.mjs";

// Text with inline bold / underlined runs (link buttons, <b> in notes); parts: string | { t, w?, fill?, u? }.
const rich = (x, y, parts, o = {}) => `<text x="${x}" y="${y}" font-size="${o.size ?? 12}" fill="${o.fill ?? C.faint}">${parts.map((p) => (typeof p === "string" ? esc(p) : `<tspan font-weight="${p.w ?? 700}" fill="${p.fill ?? C.strong}"${p.u ? ' text-decoration="underline"' : ""}>${esc(p.t)}</tspan>`)).join("")}</text>`;

// Crops (world width <= 800 or portrait, scale ~1): SIDE = rail and panel; TABS = SIDE plus the Scalev tab row;
// PV = the preview screen; PVS = preview plus the Scalev Simpan button; DLG = a centred dialog plus the preview.
// The rail and the preview never share a crop: a flow that needs both is split into a panel scene and a preview scene.
const SIDE = { x: 0, y: 92, w: 400, h: 808 }, TABS = { x: 0, y: 44, w: 400, h: 856 }, PV = { x: 707, y: 92, w: 430, h: 808 };
const PVS = { x: 707, y: 44, w: 733, h: 856 }, DLG = { x: 520, y: 92, w: 620, h: 808 };
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
// Konten accordion (nk-acc): 50px bar, chevron, title, status badge; open = body height h below a hairline.
function acc(y, title, b, h) {
  return rect(P + 0.5, y + 0.5, PW - 1, (h ?? 50) - 1, { r: 4, fill: C.white, stroke: C.line }) + (h ? line(P + 1, y + 50.5, P + PW - 1, y + 50.5) : "") +
    icon(h ? "chevron-down" : "chevron-right", P + 22, y + 25, 18, C.strong) + text(P + 43, y + 30, title, { size: 14, weight: 500 }) + (b ? badge(P + 266, y + 16, b, b === "Terisi") : "");
}
// Vertical stack of fields (nk-field: label 16 + gap 4 + control, hint +8, margin 12).
function col(x, y, w) {
  let s = "";
  const c = {
    at: {}, // label -> top y of its field
    get y() { return y; }, get svg() { return s; },
    add(str, h = 0) { s += str; y += h; return c; },
    field(l, v, o = {}) {
      const h = o.h ?? 36;
      c.at[l] = y;
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
    lead(t) { s += text(x, y + 12, t, { size: 12, fill: C.faint }); y += 28; return c; },
    // Photo field (nk-photo): label, 96px thumb, button (Ganti foto; Pilih foto when empty).
    photo(l, k, btn = "Ganti foto") { c.at[l] = y; s += lbl(x, y, l) + (k === null ? "" : photo(x, y + 20, 96, 96, k, 4)) + quietBlock(x, y + (k === null ? 20 : 124), w, btn, "image"); y += k === null ? 68 : 172; return c; }
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
// Konten groups in panel order (nikahkit/src/fields.js GROUPS, labels from model.js META).
const GRP = ["Sampul", "Mempelai", "Acara & Tanggal", "Salam Pembuka", "Ayat / Kutipan", "Kisah Cinta", "Galeri Foto", "Video", "Dress Code", "Susunan Acara",
  "RSVP & Ucapan", "Siaran Langsung", "Filter Kamera", "Amplop Digital", "Aturan Tamu", "Turut Mengundang", "Salam Penutup", "Kaki Halaman"];
// Konten panel body: the head (sample note, Bahasa undangan, Lapisan line) when from = 0, then the accordions from GRP[from];
// open: title of the open group, fill(c) adds its fields to a col; dy: panel scrolled by dy; raw: no clip (a scroll element
// under lid()). Returns the svg, each bar's y and the open group's field tops (f), all in scrolled coordinates.
function kList({ from = 0, top = 169, left = 6, link = "Ganti nama mempelai wanita", open, fill, todo = [], dy = 0, raw = false } = {}) {
  let s = "", y = top;
  if (!from) {
    const c = col(P, left ? 245 : 169, PW);
    if (left) s += sampleNote(left, link);
    c.field("Bahasa undangan", "Indonesia", { select: true, hint: ["Hanya halaman tamu. Teks bawaan ikut berganti;", "teks yang sudah diubah tetap."] });
    s += c.svg + rich(P, c.y + 12, ["Urutan dan tampilan bagian di ", { t: "Lapisan", w: 500, u: true }, "."]);
    y = c.y + 28;
  }
  const at = {}, f = {};
  for (const t of GRP.slice(from)) {
    if (y - dy > 3000) break;
    at[t] = y - dy;
    const b = todo.includes(t) ? "Belum diisi" : "Terisi";
    if (t !== open) { s += acc(y, t, b); y += 58; continue; }
    const c = col(I, y + 54, IW); fill(c);
    for (const [k, v] of Object.entries(c.at)) f[k] = v - dy;
    const h = c.y - y; s += acc(y, t, b, h) + c.svg; y += h + 8;
  }
  const g = dy ? `<g transform="translate(0 ${-dy})">${s}</g>` : s;
  return { svg: raw ? rect(72, -2000, 327, 5000, { fill: C.white }) + g : body(panelBg(), g), at, f };
}
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
const disc = () => circle(1065, 700, 26, { fill: "#1b1b1b" }) + circle(1065, 700, 10, { fill: C.white }) + `<path d="M1062 695 L1069 700 L1062 705 Z" fill="#1b1b1b"/>`;
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
  photo(751, 305, 342, 236, 0, 10), photo(751, 553, 165, 120, 4, 10), dock("Galeri"), disc());
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

// ---- Konten groups (fields from nikahkit/src/fields.js, sample values from model.js SAMPLE) ---------------------------
// List item (nk-item) built by build(col); its field tops join c.at (first occurrence wins).
function item(c, title, build, first, last) {
  const y0 = c.y, f = col(I + 10, y0 + 48, IW - 20); build(f);
  const h = f.y - y0 - 2;
  c.at[title] = y0; for (const [k, v] of Object.entries(f.at)) if (!(k in c.at)) c.at[k] = v;
  return c.add(itemBox(y0, h) + itemBar(y0, title, first, last) + f.svg, h + 8);
}
const fillMempelai = (nick = "Rani") => (c) => c.field("Judul", "Mempelai", { ph: true }).field("Urutan nama", "Wanita dulu", { select: true }).h3("Mempelai Wanita")
  .field("Nama panggilan", nick, { hint: ["Tampil di sampul."] }).field("Nama lengkap dan gelar", "Rani Ayu, S.Psi.").field("Profesi atau bio singkat (opsional)", "Psikolog")
  .field("Anak ke- (opsional)", "Putri kedua", { hint: ["Kosong: \"Putri dari\" / \"Putra dari\"."] }).field("Nama ayah", "Ahmad").toggle("Ayah sudah wafat (Alm.)", false)
  .field("Nama ibu", "Siti").toggle("Ibu sudah wafat (Almh.)", true);
const EVS = [["Akad Nikah", "14/02/2027, 08.00", "", "Masjid Al-Ikhlas", "Jl. Melati 1, Jakarta", "https://maps.google.com/?q=Kebayoran+Baru", "Khusus keluarga inti"],
  ["Resepsi", "14/02/2027, 11.00", "14/02/2027, 14.00", "Gedung Sejahtera", "Jl. Melati 10, Jakarta", "https://maps.google.com/?q=Kebayoran+Baru", "Parkir di basement"],
  ["Ngunduh Mantu", "21/02/2027, 10.00", "21/02/2027, 13.00", "Rumah Bpk. Budi", "Jl. Mawar 5, Depok", "https://maps.google.com/?q=Depok", "Acara keluarga"]];
const fillAcara = (list) => (c) => {
  c.field("Zona waktu", "WIB", { select: true }).field("Acara utama", "Akad Nikah", { select: true, hint: ["Acuan tanggal sampul, Simpan Tanggal,", "Hitung Mundur, dan kalender. Tanpa", "tanggal: acara pertama yang bertanggal."] });
  list.forEach((e, i) => item(c, e[0], (f) => f.field("Nama acara", e[0]).field("Mulai", e[1], { icon: "calendar" })
    .field("Selesai (opsional)", e[2] || "hh/bb/tttt, --.--", { icon: "calendar", ph: !e[2] }).field("Nama tempat atau gedung", e[3])
    .area("Alamat lengkap", [e[4]]).field("Tautan peta", e[5]).area("Catatan (opsional)", [e[6]]), i === 0, i === list.length - 1));
  c.at["Tambah acara"] = c.y;
  c.add(quietBlock(I, c.y, IW, "Tambah acara", "plus"), 48).toggle("Tampilkan peta di kartu acara", true, ["Butuh tautan Google Maps dan alamat."]);
};
const fillSampul = (c) => c.add(hintL(I, c.y, ["Nama dan tanggal diambil dari", "Mempelai dan Acara."]), 44).photo("Foto sampul", 6).photo("Foto slideshow (opsional, maks. 4)", 2, "Tambah foto");
const fillSalam = (c) => c.field("Preset salam", "Islam", { select: true, hint: ["Mengisi kalimat pembuka, salam,", "kata pengantar, dan salam penutup.", "Tetap bisa diubah."] })
  .field("Kalimat pembuka (opsional)", "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ", { hint: ["Mis. basmalah. Kosongkan bila tidak", "dipakai."] })
  .field("Salam", "Assalamu'alaikum Warahmatullahi Wabarakatuh").area("Kata pengantar", ["Dengan memohon rahmat dan rida", "Allah SWT, kami bermaksud", "menyelenggarakan pernikahan", "putra-putri kami. Merupakan", "kebahagiaan bagi kami apabila"], 5);
const story = (when, place, title, lines, k) => (f) => f.field("Waktu", when).field("Lokasi (opsional)", place).field("Judul", title).area("Cerita", lines, 4).photo("Foto (opsional)", k);
const fillKisah = (c) => { c.field("Judul", "Kisah Cinta", { ph: true }); item(c, "Pertama Bertemu", story("Maret 2021", "Bandung", "Pertama Bertemu", ["Kami bertemu di sebuah acara", "kampus dan mulai saling", "mengenal."], 1), true, false);
  item(c, "Menjalin Hubungan", story("Agustus 2022", "Jakarta", "Menjalin Hubungan", ["Setelah sekian lama berteman,", "kami memutuskan untuk", "melangkah bersama."], 3), false, false); };
const fillVideo = (c) => { c.field("Judul", "Video", { ph: true }).area("Keterangan", ["Saksikan perjalanan kami dalam", "video berikut."]);
  item(c, "Prewedding", (f) => f.field("Tautan YouTube", "https://www.youtube.com/watch?v=boRd_GXsYWA").field("Judul video (opsional)", "Prewedding"), true, true);
  c.add(quietBlock(I, c.y, IW, "Tambah video", "plus"), 48); };
const swatch = (f, hex) => f.add(rect(I + IW - 52, f.y - 40, 20, 20, { r: 3, fill: hex, stroke: C.field }));
const fillDress = (c) => { c.field("Judul", "Dress Code", { ph: true });
  [["Olive", "#3F4232"], ["Terakota", "#A0522D"], ["Sage", "#5B7553"]].forEach(([n, hex], i) => item(c, n, (f) => swatch(f.field("Warna", hex), hex).field("Nama warna", n), i === 0, false)); };
const fillGifts = (c) => {
  c.field("Judul", "Tanda Kasih", { ph: true }).area("Teks pengantar (opsional)", ["Doa restu Anda sudah lebih dari", "cukup. Bila ingin memberi tanda"])
    .toggle(["Tampilkan lewat tombol", "\"Kirim Hadiah\""], true, ["Rekening dan alamat terbuka setelah tamu", "menekan tombol."]);
  [["BCA", "1234567890", "Rani Ayu"], ["Mandiri", "1230004567890", "Dimas Putra"]].forEach(([b, n, h], i) => item(c, b, (f) => f.field("Bank atau e-wallet", b, { hint: ["Logo tampil otomatis untuk bank dan", "e-wallet yang dikenal (BCA, BNI, BRI,", "BSI, Mandiri, DANA, OVO, ...). Nama", "lain tampil sebagai teks."] })
    .field("Nomor rekening", n).field("Nama pemilik rekening", h).photo("Gambar QRIS (opsional)", null, "Pilih foto"), i === 0, i === 1));
  c.add(quietBlock(I, c.y, IW, "Tambah rekening", "plus"), 48).h3("Kirim kado (opsional)").field("Nama penerima", "Rani Ayu").area("Alamat", ["Jl. Melati 10, Jakarta 12110"], 3)
    .field("Tautan peta alamat (opsional)", "https://maps.google.com/?q=Kebayoran+Baru").toggle("Tampilkan peta alamat", true, ["Butuh tautan Google Maps dan alamat."]).field("WhatsApp konfirmasi", "081234567890");
};
const fillFamilies = (c) => c.field("Judul", "Turut Mengundang", { ph: true }).field("Judul grup wanita", "Keluarga Bpk. Ahmad").area("Keluarga mempelai wanita", ["Kel. Bpk. Hasan", "Kel. Ibu Aminah", "Kel. Bpk. Rahmat"], 3)
  .field("Judul grup pria", "Keluarga Bpk. Budi").area("Keluarga mempelai pria", ["Kel. Bpk. Hartono", "Kel. Ibu Sri", "Kel. Bpk. Joko"], 3);
const fillFooter = (c) => c.add(hintL(I, c.y, ["Branding Anda. Undangan baru mengambil", "nama dan WhatsApp dari Profil merek,", "atau dari bisnis Scalev bila profil kosong.", "Kosongkan kolom untuk menyembunyikan", "barisnya."]), 92)
  .toggle(["Hak cipta (© tahun dan nama", "mempelai)"], true).photo("Logo (opsional)", null, "Pilih foto")
  .field("Nama brand", "Rina WO", { hint: ["Mengisi {{Brand}} di Kredit. Tanpa {{Brand}}", "di Kredit: tampil sendiri di bawah logo."] }).field("Tautan brand (opsional)", "https://...", { ph: true });
// A Konten list placed so that group t's bar sits at y (the panel scrolled to it), with enough groups above to reach the head.
const keep = (t, y, o = {}) => { const i = GRP.indexOf(t), from = Math.max(1, i - Math.ceil((y - 153) / 58)); return kList({ ...o, from, top: y - 58 * (i - from) }); };

const kontenPanel = (o = {}) => nkRail(0, 0, "Konten") + rect(72, 92, 327, 808, { fill: C.white }) + nkHead(0, 0, "Konten", { account: ACCOUNT }) + kList({ ...o, open: "Mempelai", fill: fillMempelai() }).svg;
const editor = (rail) => [DEFS, scalevEditor(0, 0, { rail })];
// The panel head and Scalev bars above a scrolling panel body (content slides under them).
const lid = (rail, o = {}) => clipped(72, 0, 327, 153, scalevEditor(0, 0, { rail }), nkHead(0, 0, rail, { account: ACCOUNT, ...o }));
// Save status at the foot of the rail.
const SAVED = { svg: ring(0, 851, 71, 49, { r: 4 }), enter: "fade" }, SAVED_AT = [36, 878];
// Scalev Simpan button, redrawn so it can dip when clicked.
const simpanBtn = () => rect(1193, 50, 82, 34, { r: 4, fill: C.white, stroke: C.svBtnLine, sw: 2 }) + text(1201, 72, "Simpan", { size: 13, weight: 500, fill: C.strong }) + iconX("file-text", 1258, 67, 15, C.strong);
// Rail before a template is picked: only Template and Media open; Bagikan and Kosongkan disabled.
const LOCKED = [160, 216, 328, 384].map((y) => rect(0, y, 71, 52, { fill: C.page, opacity: 0.62 })).join("") + rect(0, 560, 71, 50, { fill: C.page, opacity: 0.62 }) + rect(0, 750, 71, 46, { fill: C.page, opacity: 0.62 });
// Typing into a cleared, focused input: [box, typed text, type spec].
const typeIn = (x, y, w, val) => [inp(x, y, w, "", { focus: true }), text(x + 11, y + 23, val, { size: 14, fill: C.strong }), { n: val.length, box: [x + 10, y + 7, tw(val, 14) + 2, 22] }];
// Name on the cover preview changed to Sinta: maroon cover and Folio cover.
const pvSinta = () => rect(760, 462, 324, 64, { fill: CREAM }) + text(CX, 508, "Sinta & Dimas", { size: 46, font: SCRIPT, fill: MAROON, anchor: "middle" });
const pvSintaFolio = () => rect(752, 420, 340, 44, { fill: "#232220" }) + sTxt(452, "Sinta & Dimas", { size: 38, fill: C.white });
const FOLIO_C = [301, 302], DASAR_C = [155, 302]; // card centres with the cards at y 219
// Galeri Foto: panel scrolled so Kisah Cinta's bar is at y 191 and Galeri Foto (opened) at 249; the Media dialog (Pilih foto)
// covers rail and panel: Unggah foto, paste link, 3-column grid, Pakai foto footer.
const GAL = (() => {
  const top = (n) => acc(191, "Kisah Cinta", "Terisi") + acc(249, "Galeri Foto", n ? "Terisi" : "Belum diisi", 1400) +
    col(I, 303, IW).field("Judul", "Galeri", { ph: true }).area("Teks pengantar (opsional)", ["Sebagian momen yang ingin kami", "bagi bersama Anda."]).svg +
    lbl(I, 451, `Foto galeri (${n})`);
  const rest = (y) => quietBlock(I, y, IW, "Tambah foto", "image") + text(I, y + 60, "Foto pertama tampil paling besar.", { size: 12, fill: C.faint }) +
    ["Video", "Dress Code", "Susunan Acara", "RSVP & Ucapan", "Siaran Langsung", "Filter Kamera"].map((t, i) => acc(y + 85 + i * 58, t, "Terisi")).join("");
  const cell = (i) => [16 + (i % 3) * 124, 291 + Math.floor(i / 3) * 124];
  const dlg = nkDialogHead(0, 0, "Pilih foto") + nkBtn(16, 169, "Unggah foto", { variant: "ghost", w: 366, icon: "upload" }) + lbl(16, 217, "Atau tempel tautan https") +
    inp(16, 237, 300, "https://...", { ph: true }) + `<g opacity=".5">${nkBtn(322, 237, "Pakai", { variant: "ghost", w: 60 })}</g>` +
    clipped(0, 285, 399, 554, ...Array.from({ length: 12 }, (_, i) => photo(...cell(i), 118, 118, i % 6, 4))) +
    rect(0, 839, 399, 61, { fill: C.white }) + line(0, 839.5, 399, 839.5) + `<g opacity=".5">${nkBtn(16, 851, "Pakai foto", { w: 366 })}</g>`;
  const pick = (i) => { const [x, y] = cell(i); return rect(x + 1, y + 1, 116, 116, { r: 4, stroke: C.primary, sw: 2 }) + circle(x + 104, y + 14, 8, { fill: C.action }) + iconX("check", x + 104, y + 14, 10, C.white, 3.5); };
  const foot = (n) => rect(0, 840, 399, 60, { fill: C.white }) + nkBtn(16, 851, `Pakai ${n} foto`, { w: 366 });
  const row = (k) => { const y = 471 + k * 104; return rect(I + 0.5, y + 0.5, IW - 1, 95, { r: 4, fill: C.page, stroke: C.line }) + photo(I + 9, y + 9, 64, 64, k * 4, 4) +
    inp(I + 81, y + 9, 127, "Deskripsi foto", { ph: true }) + inp(I + 81, y + 51, 127, "Fokus tengah", { select: true }) +
    icon("chevron-up", I + 230, y + 27, 16, k ? C.text : "rgba(91,102,117,.35)") + icon("trash", I + 230, y + 63, 16, C.text); };
  const after = () => body(panelBg(), top(2), rest(679), row(0), row(1));
  return { top, rest, dlg, pick, foot, after };
})();

export const scenes = {
  // ---------------------------------------------------------------------------------------------------------------------
  "editor-peta": {
    title: "Langkah pertama di editor NikahKit: tab NikahKit sampai Konten",
    world: TABS,
    base: [DEFS, scalevEditor(0, 0, { tab: "Code", screenFill: C.white })],
    els: {
      rTabs: { svg: ring(10, 52, 210, 30, { r: 6 }), enter: "fade", delay: 0.3 },
      gate: { svg: scalevEditor(0, 0, { rail: "Template", screenFill: C.white }) + rect(0, 93, 399, 807, { fill: C.white }) + text(200, 300, "Memeriksa akses...", { size: 14, weight: 600, anchor: "middle" }), enter: "fade" },
      tpl: { svg: nkRail(0, 0, "Template") + rect(72, 92, 327, 808, { fill: C.white }) + nkHead(0, 0, "Template", { inbox: false, account: ACCOUNT }) + body(seg(), cards(219)), enter: "fade", delay: 0.5 },
      locked: { svg: LOCKED, enter: "fade", delay: 0.5 },
      picked: { svg: body(panelBg(), seg(), cards(219, "folio")) + icon("inbox", 236, 122, 18, C.text), enter: "fade" },
      konten: { svg: kontenPanel(), enter: "fade" }
    },
    steps: [
      { caption: "Buka halaman undangan di Scalev. Editornya terbuka dalam HTML Mode.", show: ["rTabs"], at: [120, 66] },
      { caption: "Klik tab NikahKit. Sebentar tertulis Memeriksa akses...", hide: ["rTabs"], show: ["gate"], at: ED.tab.NikahKit, click: true },
      { caption: "Tunggu pemeriksaan akses selesai. Menu dan panel muncul.", show: ["tpl", "locked"], at: [230, 330] },
      { caption: "Halaman masih kosong? Klik satu kartu template, misalnya Folio.", hide: ["locked"], show: ["picked"], at: FOLIO_C, click: true, dur: 3.4 },
      { caption: "Klik Konten untuk mengisi data. Daftar bagian undangan muncul.", show: ["konten"], at: ED.rail.Konten, click: true }
    ]
  },

  "editor-peta-simpan": {
    title: "Langkah pertama di editor NikahKit: pratinjau dan Simpan",
    world: PVS,
    base: [DEFS, scalevEditor(0, 0, { rail: "Konten" }), pvFolio()],
    els: {
      pvName: { svg: pvSintaFolio() + ring(770, 420, 304, 46, { r: 10 }), enter: "fade" },
      sBtn: simpanBtn()
    },
    steps: [
      { caption: "Lihat hasilnya di pratinjau: nama yang kamu ketik langsung tampil.", show: ["pvName"], at: [922, 560], dur: 3.4 },
      { caption: "Status Tersimpan di kolom kiri? Klik Simpan di kanan atas Scalev.", at: ED.simpan, click: true, press: "sBtn" }
    ]
  },

  // ---------------------------------------------------------------------------------------------------------------------
  "editor-pilih-template": {
    title: "Memilih template NikahKit pertama kali: kartu template",
    world: SIDE,
    base: [...editor("Template"), nkHead(0, 0, "Template", { inbox: false, account: ACCOUNT })],
    els: {
      locked: LOCKED,
      cardsA: { svg: seg() + htmlNote() + cards(287), enter: "fade" },
      lidT: lid("Template", { inbox: false }),
      rSeg: { svg: ring(P, 169, PW, 38, { r: 6 }), enter: "fade" },
      selF: { svg: ring(234, 287, 134, 167, { r: 10 }), enter: "pop", origin: [301, 370] }
    },
    steps: [
      { caption: "Klik Template di menu kiri. Panel Template terbuka.", at: ED.rail.Template, click: true, show: ["cardsA"] },
      { caption: "Pastikan pilihan Template yang aktif, bukan Marketing.", show: ["rSeg"], at: [160, 188] },
      { caption: "Gulir ke bawah dan lihat gambar contoh tiap template.", hide: ["rSeg"], scroll: { id: "cardsA", dy: 241 }, at: [230, 560], dur: 3.4 },
      { caption: "Klik kartu yang kamu suka, misalnya Folio.", scroll: { id: "cardsA", dy: -241 }, at: [301, 370], click: true, show: ["selF"], dur: 3.6 }
    ]
  },

  "editor-pilih-template-ganti": {
    title: "Memilih template NikahKit pertama kali: dialog Ganti",
    world: DLG,
    base: [...editor("Template"), pvForeign()],
    els: {
      veil: { svg: rect(0, 0, 1440, 900, { fill: "rgba(255,255,255,.92)" }), enter: "fade" },
      dlg: { svg: shadow(540, 383, 360, 134, 8, 3) + rect(540, 383, 360, 134, { r: 8, fill: C.white }) + text(560, 418, "Ganti isi halaman dengan Folio?", { size: 14, weight: 600 }) +
        text(560, 442, "HTML yang sekarang ada di halaman akan diganti.", { size: 12, fill: C.faint }) + nkBtn(758, 461, "Batal", { variant: "quiet", w: 57 }), enter: "fade" },
      gnt: { svg: nkBtn(823, 461, "Ganti", { w: 57 }), enter: "fade" },
      pvF: { svg: pvFolio(), enter: "fade", delay: 0.2 }
    },
    steps: [
      { caption: "Halaman berisi HTML lain, jadi muncul dialog Ganti isi halaman.", at: [650, 495] },
      { caption: "Klik Ganti. Pratinjau kini menampilkan Folio.", at: [851, 479], click: true, press: "gnt", hide: ["veil", "dlg", "gnt"], show: ["pvF"], dur: 3.6 }
    ]
  },

  "editor-pilih-template-dipakai": {
    title: "Memilih template NikahKit pertama kali: Dipakai dan Konten",
    world: SIDE,
    base: [...editor("Template"), nkHead(0, 0, "Template", { account: ACCOUNT }), body(panelBg(), seg(), cards(219, "folio"))],
    els: {
      rDip: { svg: ring(326, 393, 41, 18, { r: 12 }), enter: "fade" },
      konten: { svg: kontenPanel(), enter: "fade" },
      rNote: { svg: ring(P, 169, PW, 64, { r: 6 }), enter: "fade", delay: 0.4 },
      saved: SAVED
    },
    steps: [
      { caption: "Kartu Folio kini bertanda Dipakai. Menu lain bisa diklik.", show: ["rDip"], at: [346, 402] },
      { caption: "Ganti data contoh: klik Konten. Catatan kuning menghitung isian contoh.", hide: ["rDip"], at: ED.rail.Konten, click: true, show: ["konten", "rNote"], dur: 3.6 },
      { caption: "Tunggu status Tersimpan, lalu klik Simpan di kanan atas Scalev.", hide: ["rNote"], show: ["saved"], at: SAVED_AT }
    ]
  },

  // ---------------------------------------------------------------------------------------------------------------------
  "editor-ganti-template": {
    title: "Mengganti template nanti: kartu lain",
    world: SIDE,
    base: [DEFS, scalevEditor(0, 0, { rail: "Konten" }), kontenPanel()],
    els: {
      tplB: { svg: nkRail(0, 0, "Template") + rect(72, 92, 327, 808, { fill: C.white }) + nkHead(0, 0, "Template", { account: ACCOUNT }) + body(seg(), cards(219, "folio")), enter: "fade" },
      rDip: { svg: ring(326, 393, 41, 18, { r: 12 }), enter: "fade", delay: 0.4 },
      cardsC: { svg: body(panelBg(), seg(), cards(219, "dasar")), enter: "fade" },
      toast: { svg: shadow(84, 836, 302, 52, 4, 2) + rect(84, 836, 302, 52, { r: 4, fill: C.strong }) + text(96, 867, "Template diganti ke Dasar.", { size: 14, fill: C.white }) +
        text(374, 867, "Urungkan", { size: 14, weight: 700, fill: "#7fd3f5", anchor: "end" }), enter: "slide", delay: 0.4 }
    },
    steps: [
      { caption: "Klik Template di menu kiri. Template yang dipakai bertanda Dipakai.", at: ED.rail.Template, click: true, show: ["tplB", "rDip"] },
      { caption: "Klik kartu template lain, misalnya Dasar. Muncul pesan dengan Urungkan.", hide: ["rDip"], at: DASAR_C, click: true, show: ["cardsC", "toast"], dur: 3.6 }
    ]
  },

  "editor-ganti-template-pratinjau": {
    title: "Mengganti template nanti: pratinjau",
    world: PV,
    base: [DEFS, scalevEditor(0, 0, { rail: "Template" }), pvDasar()],
    els: {
      rPv: { svg: ring(780, 322, 284, 52, { r: 10 }), enter: "fade" },
      pvF: { svg: pvFolio(), enter: "fade" }
    },
    steps: [
      { caption: "Periksa pratinjau. Desainnya Dasar, isian Konten tetap ada.", show: ["rPv"], at: [922, 420] },
      { caption: "Tidak suka? Klik Urungkan di pesan bawah panel. Folio kembali.", hide: ["rPv"], show: ["pvF"], at: [922, 560], dur: 3.4 }
    ]
  },

  // ---------------------------------------------------------------------------------------------------------------------
  "editor-isi-mempelai": (() => {
    const hold = { left: 5, link: "Ganti foto sampul", raw: true };
    const v1 = kList({ open: "Mempelai", fill: fillMempelai(), raw: true });
    const v1b = kList({ ...hold, open: "Mempelai", fill: fillMempelai("Sinta") });
    const nickY = v1.f["Nama panggilan"] + 20, [clear, typed, ty] = typeIn(I, nickY, IW, "Sinta");
    const D4 = v1b.f["Nama ayah"] - 400, ayahY = 420;
    const D5 = Math.max(0, v1b.at["Acara & Tanggal"] - D4 - 260), barA = v1b.at["Acara & Tanggal"] - D4 - D5;
    const a0 = kList({ ...hold, open: "Acara & Tanggal", fill: fillAcara(EVS) });
    const dyA = Math.max(0, a0.at["Acara & Tanggal"] - barA);
    const v2 = kList({ ...hold, open: "Acara & Tanggal", fill: fillAcara(EVS), dy: dyA });
    const D6 = v2.f["Ngunduh Mantu"] - 320;
    const v2d = kList({ ...hold, open: "Acara & Tanggal", fill: fillAcara(EVS.slice(0, 2)), dy: dyA + D6 });
    const v3 = kList({ ...hold, open: "Sampul", fill: fillSampul });
    const D8 = v3.at["Salam Pembuka"] - 420;
    const s0 = kList({ ...hold, open: "Salam Pembuka", fill: fillSalam });
    const v4 = kList({ ...hold, open: "Salam Pembuka", fill: fillSalam, dy: s0.at["Salam Pembuka"] - 420 });
    const v5 = kList({ left: 5, link: "Ganti foto sampul" });
    const sub = (D) => (D ? { scroll: { id: "v1b", dy: D } } : {});
    return {
      title: "Mengisi Mempelai, Acara, Sampul, dan Salam di Konten",
      world: SIDE,
      base: [...editor("Template"), nkHead(0, 0, "Template", { account: ACCOUNT }), templatePanel("sekar-kedaton")],
      els: {
        railK: { svg: nkRail(0, 0, "Konten"), enter: "fade" },
        v1: { svg: v1.svg, enter: "fade" },
        rMemp: { svg: ring(P, v1.at.Mempelai, PW, 50, { r: 6 }), enter: "fade" },
        clear: { svg: clear, enter: "fade" },
        typed: { svg: typed, enter: "fade" },
        v1b: { svg: v1b.svg, enter: "fade", delay: -1.2 },
        ayahF: { svg: inp(I, ayahY, IW, "Ahmad", { focus: true }), enter: "fade" },
        v2: { svg: v2.svg, enter: "fade" },
        v2d: { svg: v2d.svg, enter: "fade" },
        v3: { svg: v3.svg, enter: "fade" },
        v4: { svg: v4.svg, enter: "fade" },
        v5: { svg: v5.svg, enter: "fade" },
        rBad: { svg: ring(310, 397, 46, 18 + 58 * 5, { r: 10 }), enter: "fade", delay: 0.3 },
        lidK: { svg: lid("Konten"), enter: "fade" },
        saved: SAVED
      },
      steps: [
        { caption: "Klik Konten di menu kiri. Daftar bagian muncul, di atasnya Bahasa undangan.", at: ED.rail.Konten, click: true, show: ["railK", "v1", "lidK"] },
        { caption: "Buka Mempelai. Biasanya sudah terbuka; bila tertutup, klik namanya.", show: ["rMemp"], at: [190, v1.at.Mempelai + 25] },
        { caption: "Klik Nama panggilan di bawah Mempelai Wanita, lalu ketik nama klien.", hide: ["rMemp"], show: ["clear", "typed"], at: [230, nickY + 18], click: true, type: [{ id: "typed", ...ty }], dur: 3.6 },
        { caption: "Isi kolom mempelai lain: Nama lengkap, Nama ayah, Nama ibu. Ulangi untuk pria.", hide: ["clear", "typed"], show: ["v1b", "ayahF"], ...sub(D4), at: [230, ayahY + 18], click: true, dur: 3.8 },
        { caption: "Klik Acara & Tanggal. Pilih Zona waktu, lalu ganti isi acara contoh.", hide: ["ayahF"], show: ["v2"], ...sub(D5), at: [190, barA + 25], click: true, dur: 3.6 },
        { caption: "Hapus acara yang tidak dipakai dengan ikon tempat sampah.", show: ["v2d"], scroll: { id: "v2", dy: D6 }, at: [I + IW - 24, 344], click: true, dur: 3.6 },
        { caption: "Klik Sampul. Pilih Foto sampul; teks sampul boleh dibiarkan kosong.", show: ["v3"], scroll: { id: "v2d", dy: -(dyA + D6) }, at: [190, v3.at.Sampul + 25], click: true, dur: 3.6 },
        { caption: "Klik Salam Pembuka dan pilih Preset salam. Lalu buka Ayat / Kutipan.", show: ["v4"], scroll: { id: "v3", dy: D8 }, at: [190, 445], click: true, dur: 3.6 },
        { caption: "Periksa tanda Terisi. Status Tersimpan? Klik Simpan di Scalev.", show: ["v5", "rBad", "saved"], at: SAVED_AT, dur: 3.8 }
      ]
    };
  })(),

  "editor-isi-mempelai-pratinjau": {
    title: "Hasil isian Mempelai dan Acara di pratinjau",
    world: PV,
    base: [DEFS, scalevEditor(0, 0, { rail: "Konten" }), pvCover("Rani & Dimas")],
    els: {
      pvS: { svg: pvSinta() + ring(770, 466, 304, 58, { r: 10 }), enter: "fade" },
      pvEv: { svg: pvEvents(["akad", "resepsi"]), enter: "fade" }
    },
    steps: [
      { caption: "Isi Nama panggilan mempelai wanita: sampul di pratinjau ikut berubah.", show: ["pvS"], at: [922, 580], dur: 3.4 },
      { caption: "Klik Acara & Tanggal: acara-acara tampil di pratinjau.", show: ["pvEv"], at: [922, 340], dur: 3.4 }
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
    const scrolled = rect(72, 153, 327, 747 + DY, { fill: C.white }) + acc(111, "Mempelai", "Terisi") + acc(169, "Acara & Tanggal", "Terisi", 1400) + c.svg +
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
      world: SIDE,
      base: [...editor("Konten")],
      els: {
        list: scrolled,
        dd: { svg: dd, enter: "pop", origin: [I + IW / 2, 279] },
        item2: { svg: item2, enter: "rise" },
        nFocus: { svg: inp(I + 10, nameY + 20, IW - 20, "", { focus: true }), enter: "fade" },
        nBlur: { svg: inp(I + 10, nameY + 20, IW - 20, ""), enter: "fade" },
        nTyped: { svg: text(I + 21, nameY + 43, "Resepsi", { size: 14, fill: C.strong }), enter: "fade" },
        title2: { svg: rect(I + 8, y2 + 12, 80, 22, { fill: C.page }) + text(I + 10, y2 + 28, "Resepsi", { size: 12, weight: 700 }), enter: "fade", delay: 0.9 },
        times: { svg: times, enter: "fade" },
        fixed: { svg: fixed, enter: "fade" },
        lidE: lid("Konten")
      },
      steps: [
        { caption: "Di Acara & Tanggal, pilih Zona waktu: WIB, WITA, atau WIT.", at: [I + 120, 261], click: true, show: ["dd"] },
        { caption: "Gulir ke bawah daftar acara, lalu klik Tambah acara.", hide: ["dd"], scroll: { id: "list", dy: DY }, at: [I + IW / 2, y2 + 18], click: true, show: ["item2"], dur: 3.6 },
        { caption: "Kotak Acara 2 muncul. Klik kotak Nama acara.", at: [I + 120, nameY + 38], click: true, show: ["nFocus"] },
        { caption: "Ketik nama acara, misalnya Resepsi. Judul kotaknya ikut berganti.", show: ["nTyped", "title2"], type: [{ id: "nTyped", n: 7, box: [I + 20, nameY + 27, tw("Resepsi", 14) + 2, 22] }], dur: 3.4 },
        { caption: "Isi Mulai dan Selesai. Selesai lebih awal? Muncul pesan merah.", hide: ["nFocus"], show: ["nBlur", "times"], at: [I + 120, endY + 38], click: true, dur: 3.6 },
        { caption: "Perbaiki jam Selesai, misalnya 14.00. Pesan merah hilang.", at: [I + 60, endY + 38], click: true, show: ["fixed"] }
      ]
    };
  })(),

  "editor-tambah-acara-pratinjau": {
    title: "Acara baru di pratinjau",
    world: PV,
    base: [DEFS, scalevEditor(0, 0, { rail: "Konten" }), pvEvents(["akad"])],
    els: { pv2: { svg: pvEvents(["akad", "resepsi"]) + ring(751, EV.resepsi.y, 342, EV.resepsi.h, { r: 16 }), enter: "fade" } },
    steps: [{ caption: "Acara baru tampil di pratinjau, lengkap dengan jamnya.", show: ["pv2"], at: [922, 620], dur: 3.6 }]
  },

  // ---------------------------------------------------------------------------------------------------------------------
  "editor-galeri-pilih-foto": {
    title: "Memilih foto galeri dari Media Scalev",
    world: SIDE,
    base: [...editor("Konten"), nkHead(0, 0, "Konten", { account: ACCOUNT }), body(GAL.top(0), GAL.rest(471))],
    els: {
      dlg: { svg: GAL.dlg, enter: "rise" },
      s1: { svg: GAL.pick(0), enter: "pop", origin: [75, 350] },
      b1: { svg: GAL.foot(1), enter: "fade" },
      s2: { svg: GAL.pick(4), enter: "pop", origin: [199, 474] },
      b2: { svg: GAL.foot(2), enter: "fade" },
      after: { svg: GAL.after(), enter: "fade" }
    },
    steps: [
      { caption: "Klik Tambah foto. Jendela Pilih foto berisi foto Media Scalev.", at: [I + IW / 2, 489], click: true, show: ["dlg"] },
      { caption: "Klik foto yang ingin dipakai. Foto terpilih diberi tanda centang.", at: [75, 350], click: true, show: ["s1", "b1"] },
      { caption: "Klik foto lain bila perlu. Tombolnya kini Pakai 2 foto.", at: [199, 474], click: true, show: ["s2", "b2"] },
      { caption: "Klik Pakai 2 foto. Foto masuk daftar Foto galeri (2).", at: [199, 869], click: true, press: "b2", hide: ["dlg", "s1", "b1", "s2", "b2"], show: ["after"], dur: 3.6 }
    ]
  },

  "editor-galeri-pratinjau": {
    title: "Galeri Foto di pratinjau",
    world: PV,
    base: [DEFS, scalevEditor(0, 0, { rail: "Konten" }), pvCover("Rani & Dimas")],
    els: { pvG: { svg: pvGallery(), enter: "fade" } },
    steps: [{ caption: "Galeri tampil di pratinjau. Foto pertama tampil paling besar.", show: ["pvG"], at: [1000, 640], dur: 3.6 }]
  },

  // ---------------------------------------------------------------------------------------------------------------------
  "editor-isi-galeri": (() => {
    const [dClear, dTyped, dTy] = typeIn(I + 81, 480, 127, "Lamaran kami");
    const g = { from: 5, raw: true };
    const vK = kList({ ...g, top: 191, open: "Kisah Cinta", fill: fillKisah });
    const DK = vK.at.Video - 330;
    const vV = keep("Video", 330, { ...g, open: "Video", fill: fillVideo });
    const DV = vV.at["Dress Code"] - 330;
    const vD = keep("Dress Code", 330, { ...g, open: "Dress Code", fill: fillDress });
    return {
      title: "Mengisi Galeri Foto, Kisah Cinta, Video, dan Dress Code",
      world: SIDE,
      base: [...editor("Konten"), nkHead(0, 0, "Konten", { account: ACCOUNT }), kList({ from: 5, top: 191, todo: ["Galeri Foto"] }).svg],
      els: {
        after: { svg: GAL.after(), enter: "fade" },
        rBadge: { svg: ring(306, 263, 50, 22, { r: 12 }), enter: "fade", delay: 0.4 },
        dClear: { svg: dClear, enter: "fade" },
        dTyped: { svg: dTyped, enter: "fade" },
        vK: { svg: vK.svg, enter: "fade" },
        vV: { svg: vV.svg, enter: "fade" },
        vD: { svg: vD.svg, enter: "fade" },
        vAll: { svg: kList({ from: 5, top: 191 }).svg, enter: "fade" },
        rBad: { svg: ring(310, 207, 46, 18 + 58 * 8, { r: 10 }), enter: "fade", delay: 0.3 },
        lidK: lid("Konten"),
        saved: SAVED
      },
      steps: [
        { caption: "Klik Konten, lalu Galeri Foto. Foto dari Tambah foto ada di daftar.", at: [190, 274], click: true, show: ["after", "rBadge"] },
        { caption: "Isi Deskripsi foto. Foto pertama tampil paling besar.", hide: ["rBadge"], at: [245, 498], click: true, show: ["dClear", "dTyped"], type: [{ id: "dTyped", ...dTy }], dur: 3.6 },
        { caption: "Klik Kisah Cinta. Ganti Waktu, Judul, dan Cerita tiap momen.", hide: ["dClear", "dTyped"], at: [190, 216], click: true, show: ["vK"], dur: 3.4 },
        { caption: "Klik Video. Ganti Tautan YouTube dengan video klien.", scroll: { id: "vK", dy: DK }, at: [190, 355], click: true, show: ["vV"], dur: 3.6 },
        { caption: "Isi Dress Code dan Susunan Acara bila dipakai.", scroll: { id: "vV", dy: DV }, at: [190, 355], click: true, show: ["vD"], dur: 3.6 },
        { caption: "Periksa tanda Terisi. Status Tersimpan? Klik Simpan di Scalev.", show: ["vAll", "rBad", "saved"], at: SAVED_AT, dur: 3.8 }
      ]
    };
  })(),

  // ---------------------------------------------------------------------------------------------------------------------
  "editor-rsvp-hadiah": (() => {
    // RSVP & Ucapan open (sample: allowMaybe off, maxGuests 2, the four "Tanyakan juga" switches on).
    const rs = col(I, 223, IW).field("Judul", "Ucapan & Kehadiran", { ph: true });
    const noteY = rs.y;
    rs.add(rect(I, noteY, IW, 38, { r: 4, fill: C.primarySoft }) + rich(I + 12, noteY + 24, ["Tersambung. ID: ", { t: "365671" }], { fill: C.strong }), 50);
    const formY = rs.y + 20;
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
    const rsvp = (on) => rect(72, 153, 327, 747 + DY, { fill: C.white }) + acc(111, "Susunan Acara", "Terisi") + acc(169, "RSVP & Ucapan", "Terisi", 1400) + rect(P + 1, accY - 9, PW - 2, 1400, { fill: C.white }) + line(P, accY - 8.5, P + PW, accY - 8.5) +
      rs.svg + accs + (on ? sw(I + IW - 36, maybeY, true) : "");
    const ddMode = shadow(I, formY + 38, IW, 80, 6, 2) + rect(I, formY + 38, IW, 80, { r: 6, fill: C.white, stroke: C.field }) + rect(I + 4, formY + 42, IW - 8, 24, { r: 4, fill: C.primarySoft }) +
      ["Ucapan + konfirmasi hadir", "Ucapan saja", "Konfirmasi hadir saja"].map((v, i) => text(I + 14, formY + 59 + i * 24, v, { size: 14, fill: C.strong })).join("") + iconX("check", I + IW - 18, formY + 54, 14, C.action);
    const gifts = keep("Amplop Digital", 169, { open: "Amplop Digital", fill: fillGifts, raw: true });
    const numY = gifts.f["Nomor rekening"] + 20, D6 = gifts.f["WhatsApp konfirmasi"] - 450, waY = 470;
    const [waClear, waTyped, waTy] = typeIn(I, waY, IW, "081298765432");
    const turutY = gifts.at["Turut Mengundang"] - D6;
    const vF = keep("Turut Mengundang", turutY, { open: "Turut Mengundang", fill: fillFamilies, raw: true });
    const D8 = vF.at["Kaki Halaman"] - 330;
    const vKaki = keep("Kaki Halaman", 330, { open: "Kaki Halaman", fill: fillFooter });
    return {
      title: "Mengatur RSVP, Amplop Digital, dan bagian penutup",
      world: SIDE,
      base: [...editor("Konten"), keep("RSVP & Ucapan", 169).svg],
      els: {
        list1: { svg: rsvp(false), enter: "fade" },
        rNote: { svg: ring(I, noteY, IW, 38, { r: 6 }), enter: "fade" },
        ddMode: { svg: ddMode, enter: "pop", origin: [I + IW / 2, formY + 36] },
        ddG: { svg: shadow(I, guestsY + 38, IW, 152, 6, 2) + rect(I, guestsY + 38, IW, 152, { r: 6, fill: C.white, stroke: C.field }) + rect(I + 4, guestsY + 66, IW - 8, 24, { r: 4, fill: C.primarySoft }) +
          [1, 2, 3, 4, 5, 6].map((n, i) => text(I + 14, guestsY + 59 + i * 24, `${n} orang`, { size: 14, fill: C.strong })).join("") + iconX("check", I + IW - 18, guestsY + 78, 14, C.action), enter: "pop", origin: [I + IW / 2, guestsY + 36] },
        list2: { svg: rsvp(false), enter: "fade", delay: -1.3 },
        gifts: { svg: gifts.svg, enter: "fade" },
        rNum: { svg: ring(I + 10, numY, IW - 20, 36, { r: 6 }), enter: "fade", delay: 0.5 },
        waClear: { svg: waClear, enter: "fade" },
        waTyped: { svg: waTyped, enter: "fade" },
        vF: { svg: vF.svg, enter: "fade" },
        vKaki: { svg: vKaki.svg, enter: "fade" },
        rBrand: { svg: ring(I, vKaki.f["Nama brand"] + 20, IW, 36, { r: 6 }), enter: "fade", delay: 0.4 },
        lidE: lid("Konten"),
        saved: SAVED
      },
      steps: [
        { caption: "Klik Konten, lalu klik RSVP & Ucapan. Bagian terbuka.", at: [190, 194], click: true, show: ["list1"] },
        { caption: "Pastikan tertulis Tersambung. ID: diikuti angka ID halaman.", show: ["rNote"], at: [I + 150, noteY + 19] },
        { caption: "Pilih Isi form, misalnya Ucapan + konfirmasi hadir.", hide: ["rNote"], show: ["ddMode"], at: [I + 120, formY + 18], click: true },
        { caption: "Pilih Jumlah tamu paling banyak per undangan, lalu atur sakelar Tanyakan juga.", hide: ["ddMode"], show: ["ddG"], at: [I + 120, guestsY + 18], click: true },
        { caption: "Klik Amplop Digital, lalu ganti rekening contoh 1234567890.", hide: ["ddG"], show: ["list2", "gifts", "rNum"], scroll: { id: "list2", dy: DY }, at: [190, 445], click: true, dur: 3.8 },
        { caption: "Masih di Amplop Digital, isi WhatsApp konfirmasi dengan nomor klien.", hide: ["rNum"], scroll: { id: "gifts", dy: D6 }, at: [230, waY + 18], click: true, show: ["waClear", "waTyped"], type: [{ id: "waTyped", ...waTy }], dur: 3.8 },
        { caption: "Isi Turut Mengundang dan Salam Penutup.", at: [190, turutY + 25], click: true, show: ["vF"], dur: 3.4 },
        { caption: "Periksa Kaki Halaman: nama brand dan WhatsApp pemesanan milik usahamu.", scroll: { id: "vF", dy: D8 }, at: [190, 355], click: true, show: ["vKaki", "rBrand"], dur: 3.8 },
        { caption: "Simpan: tunggu status Tersimpan, lalu klik Simpan di Scalev.", hide: ["rBrand"], show: ["saved"], at: SAVED_AT }
      ]
    };
  })()
};
