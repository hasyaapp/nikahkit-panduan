// Editor dan Konten: langkah editor, pilih/ganti template, Langkah tiap halaman Konten, tambah acara, galeri, RSVP dan Amplop Digital.
// Every scene is the whole real 1440x900 Scalev editor (lib scalevEditor): top bar, tabs, rail, panel and preview. Panel
// boxes follow /tmp/ref/editor-metrics.json (Template, Konten: cards 134x229, accordions 279x50, fields 253 wide); labels
// from nikahkit/src/fields.js, model.js (SAMPLE, SAMPLE_CHECKS), ui/panel-content.jsx, ui/panels-style.jsx, ui/fields.jsx,
// ui/App.jsx (MediaDialog, Toast), store.js.
import { C, ED, esc, rect, text, line, circle, para, clipped, shadow, icon, iconX, tw, skeleton, nkHead, nkRail, nkLabel, nkBtn, nkDialogHead, scalevEditor } from "../lib.mjs";

// Text with inline bold / underlined runs (link buttons, <b> in notes); parts: string | { t, w?, fill?, u? }.
const rich = (x, y, parts, o = {}) => `<text x="${x}" y="${y}" font-size="${o.size ?? 12}" fill="${o.fill ?? C.faint}">${parts.map((p) => (typeof p === "string" ? esc(p) : `<tspan font-weight="${p.w ?? 700}" fill="${p.fill ?? C.strong}"${p.u ? ' text-decoration="underline"' : ""}>${esc(p.t)}</tspan>`)).join("")}</text>`;

// Focus areas (world px): rail + panel, panel, panel body, preview screen, Scalev bars, Simpan buttons, rail foot, the
// Scalev bars and panel head above a scrolling panel body (lid).
const F = { side: [0, 92, 399, 808], panel: [72, 92, 327, 808], body: [72, 153, 327, 747], pv: [726, 105, 392, 786], top: [0, 0, 1440, 92],
  save: [1183, 44, 257, 48], foot: [0, 851, 72, 49], lid: [72, 0, 327, 153] };
// Marks: Scalev Simpan, the save status at the rail foot, a rail tab, an accordion bar, a field, a template card.
const SIMPAN = [1193, 50, 82, 34], FOOT = { box: [0, 851, 71, 49], r: 0 };
const railM = (n) => ({ box: [0, ED.rail[n][1] - 26, 71, 52], r: 0 });
const accM = (y) => [88, y, 279, 50];
const cardM = (x, y) => ({ box: [x, y, 134, 167], r: 8 });
const ACCOUNT = "Tahunan"; // the account chip shows the member's plan
const P = 88, PW = 279, I = 101, IW = 253; // panel content box; inside an open accordion
const SC = ED.screen, CX = SC.x + SC.w / 2; // plain preview screen 727,106 390x784

// ---- Elements follow the focus ---------------------------------------------------------------------------------------
// lib draws els in detail; v4() makes each element follow the step's focus like the base (skeleton outside it). An
// element visible across a focus change gets one copy per focus: the new copy fades in over the old one by the step start
// (0.3 s before it on a step without a click) and the old one goes at the step's action. `box` (the area the element
// covers) lets a copy skip the skeleton when the focus holds it whole. Steps keep using the original ids in
// show/hide/type/press/scroll; a scrolled element needs a focus that contains its box.
const inside = (a, b) => a[0] >= b[0] && a[1] >= b[1] && a[0] + a[2] <= b[0] + b[2] && a[1] + a[3] <= b[1] + b[3];
const meets = (a, b) => a[0] < b[0] + b[2] && b[0] < a[0] + a[2] && a[1] < b[1] + b[3] && b[1] < a[1] + a[3];
const rectsOf = (f) => (Array.isArray(f[0]) ? f : [f]);
const fid = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193); return (h >>> 0).toString(36); };
function inFocus(svg, f, box) {
  if (f === "all") return svg;
  if (f === "none") return skeleton(svg);
  const rs = rectsOf(f);
  if (box && rs.some((r) => inside(box, r))) return svg;
  if (box && !rs.some((r) => meets(box, r))) return skeleton(svg);
  const id = fid(JSON.stringify(rs)), rr = (fill) => rs.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"${fill}/>`).join("");
  return `<defs><mask id="m${id}" maskUnits="userSpaceOnUse" x="-4000" y="-4000" width="9440" height="9800"><rect x="-4000" y="-4000" width="9440" height="9800" fill="#fff"/>${rr(' fill="#000"')}</mask><clipPath id="c${id}">${rr("")}</clipPath></defs>` +
    `<g mask="url(#m${id})">${skeleton(svg)}</g><g clip-path="url(#c${id})">${svg}</g>`;
}
function v4(sc) {
  const n = sc.steps.length, show = sc.steps.map(() => []), hide = sc.steps.map(() => []), ref = sc.steps.map(() => ({})), els = {};
  let f = sc.steps[0].focus;
  const fo = sc.steps.map((s) => (f = s.focus ?? f)), lead = sc.steps.map((s) => (s.click && s.at ? Math.max(0.6, (s.dur ?? 3.2) * 0.35) + 0.1 : 0));
  for (const [id, raw] of Object.entries(sc.els ?? {})) {
    const { box, svg, ...opt } = typeof raw === "string" ? { svg: raw } : raw;
    const ops = sc.steps.map((s) => [s.show?.includes(id), s.hide?.includes(id)]), first = ops.find(([a, b]) => a || b);
    let vis = !first || !first[0], live = [], key = null, dy = 0, k = 0;
    const copy = (i, o) => {
      const cid = `${id}_${k++}`, body = dy ? `<g transform="translate(0 ${-dy})">${svg}</g>` : svg;
      key = JSON.stringify(fo[i]); els[cid] = { ...o, svg: inFocus(body, fo[i], box) }; live.push(cid); return cid;
    };
    if (vis) copy(0, opt);
    sc.steps.forEach((s, i) => {
      const [on, off] = ops[i];
      if (on) { show[i].push(copy(i, opt)); vis = true; }
      else if (vis && (!off || lead[i]) && key !== JSON.stringify(fo[i])) { hide[i].push(...live.splice(0)); show[i].push(copy(i, { enter: "fade", delay: -(lead[i] || 0.3) })); }
      if (live.length) ref[i][id] = live.at(-1);
      if (s.scroll?.id === id) {
        if (!box || (fo[i] !== "all" && !rectsOf(fo[i]).some((r) => inside(box, r)))) throw new Error(`${sc.title}: langkah ${i + 1} gulir "${id}" butuh focus yang memuat box-nya`);
        dy += s.scroll.dy;
      }
      if (off) { hide[i].push(...live.splice(0)); vis = false; }
    });
  }
  const steps = sc.steps.map((s, i) => {
    const t = { ...s, show: show[i], hide: hide[i] };
    if (!t.show.length) delete t.show;
    if (!t.hide.length) delete t.hide;
    if (s.type) t.type = s.type.map((x) => (typeof x === "string" ? ref[i][x] : { ...x, id: ref[i][x.id] }));
    if (s.press) t.press = ref[i][s.press];
    if (s.scroll) t.scroll = { ...s.scroll, id: ref[i][s.scroll.id] };
    if (s.hover) throw new Error(`${sc.title}: hover tidak didukung v4()`);
    return t;
  });
  if (steps.length !== n) throw new Error("v4");
  return { ...sc, els, steps };
}

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
// Amplop Digital with "Tampilkan lewat tombol Kirim Hadiah" on: title, intro and the button (accounts open after it).
const pvGift = () => scr(CREAM, secTitle("Tanda Kasih"), sTxt(262, "Doa restu Anda sudah lebih dari"), sTxt(283, "cukup. Bila ingin memberi tanda"), sTxt(304, "kasih, dapat melalui:"),
  rect(837, 336, 170, 48, { r: 24, fill: MAROON }) + icon("gift", 866, 360, 16, C.white) + text(932, 365, "Kirim Hadiah", { size: 15, font: SERIF, fill: C.white, anchor: "middle" }), dock("Hadiah"), disc());
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
// Templates as cards show them (build/templates.json name + description, clamped to two lines as measured in Chromium).
const TPL = {
  dasar: ["Dasar", ["Abu-abu gelap di atas", "foto, tanpa ornamen…"]], folio: ["Folio", ["Hitam & krem gaya", "majalah, foto penuh…"]],
  galeri: ["Galeri Putih", ["Putih bersih gaya", "majalah, huruf serif…"]], "modern-estetik": ["Modern Estetik", ["Putih & krem, bingkai", "lengkung, bayangan…"]],
  "cute-gemoy": ["Cute Gemoy", ["Krem, foto polaroid", "berjepit, bunga kering…"]], "tradisional-elegan": ["Tradisional Elegan", ["Hitam & emas, bingkai", "lengkung, judul huruf…"]],
  kencana: ["Kencana", ["Krem & merah bata,", "wayang golek…"]], joyo: ["Kembang Joyo", ["Kertas cokelat muda,", "bingkai lengkung dan…"]],
  ladomudo: ["Lado Mudo", ["Krem merah muda &", "marun, pita ulos dan…"]], pusako: ["Pusako", ["Merah marun, rumah", "gadang bergaris dan…"]],
  saman: ["Saman", ["Hitam & emas, motif", "Aceh dan bingkai…"]], pendopo: ["Pendopo", ["Krem & cokelat emas,", "bingkai lengkung dan…"]],
  "sekar-kedaton": ["Sekar Kedaton", ["Krem & merah marun,", "gerbang lengkung…"]], sogan: ["Sogan", ["Krem & cokelat sogan,", "bingkai ukir emas…"]],
  "sekar-jagad": ["Sekar Jagad", ["Kertas batik putih &", "hijau tua, gunungan…"]], kayon: ["Kayon", ["Kertas krem & cokelat", "tua, gunungan…"]],
  joglo: ["Joglo", ["Kertas batik tan,", "gunungan, rumah…"]]
};
const FIRST6 = ["dasar", "folio", "galeri", "modern-estetik", "cute-gemoy", "tradisional-elegan"];
// Section strip colours [light, mid, accent]; adat templates from their default palette (surface, bg, accent).
const STRIP = { dasar: ["#ffffff", "#e7e3dc", "#3a3a3a"], folio: ["#ffffff", "#e9e3d8", "#2b2a28"], galeri: ["#ffffff", "#eceae6", "#9a948c"],
  "modern-estetik": ["#ffffff", "#efe7dd", "#7b5a44"], "cute-gemoy": ["#fff3f6", "#fbd9e2", "#e48aa3"], "tradisional-elegan": ["#2a2522", "#1f1c1a", "#ecbb6c"],
  kencana: ["#FFFDF8", "#FFF7E9", "#8E2818"], joyo: ["#E7DCC8", "#D8C9AE", "#18150F"], ladomudo: ["#FFFFFF", "#FFFAF0", "#520000"], pusako: ["#F2EDDC", "#E1DABB", "#520000"],
  saman: ["#232220", "#181818", "#F0DA86"], pendopo: ["#FFFAF2", "#FAF4EC", "#86683A"], "sekar-kedaton": ["#FFFFFF", "#FFFCF3", "#7A1A1A"], sogan: ["#FFFFFF", "#FFFCF3", "#86683A"],
  "sekar-jagad": ["#FFFFFF", "#FDFDFD", "#374A33"], kayon: ["#F7F1E3", "#E6D6B4", "#473735"], joglo: ["#F7F1E3", "#E6D6B4", "#473735"] };
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
  // Adat covers: paper colour, arch frame and title lines in the accent.
  else s += rect(ix, iy, iw, ih, { r: 3, fill: b }) + `<path d="M${ix + 14} ${iy + 100} V${iy + 48} A23 23 0 0 1 ${ix + 60} ${iy + 48} V${iy + 100} Z" fill="none" stroke="${c}" stroke-width="1.5"/>` + tline(iy + 116, 40, c) + tline(iy + 126, 26, c);
  return s;
}
function card(x, y, id, o = {}) {
  const [name, desc] = TPL[id];
  return rect(x + 1, y + 1, 132, 165, { r: 8, fill: C.page, stroke: o.on ? C.primary : C.line, sw: 2 }) + clipped(x + 2, y + 2, 130, 163, thumb(x, y, id)) +
    text(x, y + 188, name, { size: 14, weight: 500 }) + (o.on ? badge(x + 133, y + 174, "Dipakai") : "") + para(x, y + 209, desc, { size: 12, fill: C.faint, lh: 16 });
}
const CARD = (i, top) => [i % 2 ? 234 : 88, top + Math.floor(i / 2) * 241];
const cards = (top, used, ids = FIRST6) => ids.map((id, i) => card(...CARD(i, top), id, { on: id === used })).join("");
const MEGAPHONE = `<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>`;
const seg = () => rect(P + 0.5, 169.5, PW - 1, 37, { r: 4, fill: C.white, stroke: C.field }) + rect(P + 1, 170, 138, 36, { r: 3, fill: C.primarySoft }) +
  icon("layout-grid", 129, 188, 16, C.action) + text(146, 192, "Template", { size: 12, weight: 600, fill: C.action }) +
  `<g transform="translate(289 180) scale(.6667)" fill="none" stroke="${C.text}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${MEGAPHONE}</g>`;
const htmlNote = () => rect(P, 219, PW, 56, { r: 4, fill: C.warnSoft }) + para(P + 12, 242, ["Halaman berisi HTML lain. Memilih template", "akan menggantinya."], { size: 12, fill: C.warnStrong, lh: 18 });
// Search box and category chips above the cards (panels-style.jsx TemplatePanel; categories from templates/base/categories.json,
// counts from the build catalogue). Chips are 28 high, 6 apart, wrap at the panel width; widths measured in Chromium.
const SEARCH_PH = "Cari: Jawa, bunga, atau tulis keinginan klien…";
const CATS = ["Semua", "Adat", "Floral", "Elegan", "Minimalis", "Ceria"], ALL_N = [62, 32, 15, 6, 5, 4];
const CHIP_W = { Semua: [72, 76, 79], Adat: [60, 63, 67], Floral: [65, 70, 70], Elegan: [72], Minimalis: [86], Ceria: [63] }; // 1 digit, 11, other 2 digits
function chips(y, n = ALL_N, on = "Semua") {
  let x = P, row = y, s = "";
  CATS.forEach((c, i) => {
    const w = CHIP_W[c][n[i] < 10 ? 0 : n[i] === 11 ? 1 : 2], a = c === on;
    if (x + w > P + PW) { x = P; row += 34; }
    s += rect(x + 0.5, row + 0.5, w - 1, 27, { r: 14, fill: a ? C.primarySoft : C.white, stroke: a ? C.primary : C.field }) +
      text(x + 11, row + 18, c, { size: 12, fill: a ? C.action : C.strong }) + text(x + w - 11, row + 18, String(n[i]), { size: 12, fill: C.text, anchor: "end" });
    x += w + 6;
  });
  return s;
}
const searchBox = (y, q = "", focus = false) => inp(P, y, PW, q || SEARCH_PH, { ph: !q, focus });
// The whole library under the Template/Marketing switch: search at top, chips 44 below, cards 118 below (cards at 337
// when top = 219).
const library = (top, used, o = {}) => searchBox(top, o.q) + chips(top + 44, o.n, o.cat) + cards(top + 118, used, o.ids);
const ADAT_CHIP = [206, 277]; // centre of the Adat chip with the default counts

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

const kontenPanel = (nick = "Rani", o = {}) => nkRail(0, 0, "Konten") + rect(72, 92, 327, 808, { fill: C.white }) + nkHead(0, 0, "Konten", { account: ACCOUNT }) + kList({ ...o, open: "Mempelai", fill: fillMempelai(nick) }).svg;
// The whole editor with a rail tab active (gradients for the photo placeholders first).
const editor = (rail, o = {}) => [DEFS, scalevEditor(0, 0, { rail, ...o })];
// The panel head and Scalev bars above a scrolling panel body (content slides under them).
const lid = (rail, o = {}) => clipped(72, 0, 327, 153, scalevEditor(0, 0, { rail }), nkHead(0, 0, rail, { account: ACCOUNT, ...o }));
// Lens around the save status at the rail foot.
const FOOT_LENS = { src: [0, 844, 110, 56] };
// Scalev Simpan button, redrawn so it can dip when clicked.
const simpanBtn = () => rect(1193, 50, 82, 34, { r: 4, fill: C.white, stroke: C.svBtnLine, sw: 2 }) + text(1201, 72, "Simpan", { size: 13, weight: 500, fill: C.strong }) + iconX("file-text", 1258, 67, 15, C.strong);
// Toast after a template change, with Urungkan (its exact text box for the mark).
const TOAST = shadow(84, 836, 302, 52, 4, 2) + rect(84, 836, 302, 52, { r: 4, fill: C.strong }) + text(96, 867, "Template diganti ke Dasar.", { size: 14, fill: C.white }) +
  text(374, 867, "Urungkan", { size: 14, weight: 700, fill: "#7fd3f5", anchor: "end" }), TOAST_BOX = [84, 836, 302, 56], URUNGKAN = [304, 850, 76, 26];
// Rail before a template is picked: only Template and Media open; Bagikan and Kosongkan disabled.
const LOCKED = [160, 216, 328, 384].map((y) => rect(0, y, 71, 52, { fill: C.page, opacity: 0.62 })).join("") + rect(0, 560, 71, 50, { fill: C.page, opacity: 0.62 }) + rect(0, 750, 71, 46, { fill: C.page, opacity: 0.62 });
// Typing into a cleared, focused input: [box, typed text, type spec].
const typeIn = (x, y, w, val) => [inp(x, y, w, "", { focus: true }), text(x + 11, y + 23, val, { size: 14, fill: C.strong }), { n: val.length, box: [x + 10, y + 7, tw(val, 14) + 2, 22] }];
// Name on the cover preview changed to Sinta: maroon cover and Folio cover.
const pvSinta = () => rect(760, 462, 324, 64, { fill: CREAM }) + text(CX, 508, "Sinta & Dimas", { size: 46, font: SCRIPT, fill: MAROON, anchor: "middle" });
const pvSintaFolio = () => rect(752, 420, 340, 44, { fill: "#232220" }) + sTxt(452, "Sinta & Dimas", { size: 38, fill: C.white });
const FOLIO_C = [301, 420], DASAR_C = [155, 420]; // card centres with the cards at y 337
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
  "editor-peta": v4({
    title: "Langkah pertama di editor NikahKit: tab NikahKit sampai Konten",
    base: [DEFS, scalevEditor(0, 0, { tab: "Code", screenFill: C.white })],
    els: {
      gate: { svg: clipped(0, 44, 399, 856, scalevEditor(0, 0, { rail: "Template", screenFill: C.white })) + rect(0, 93, 399, 807, { fill: C.white }) +
        text(200, 300, "Memeriksa akses...", { size: 14, weight: 600, anchor: "middle" }), enter: "fade", box: [0, 44, 399, 856] },
      tpl: { svg: nkRail(0, 0, "Template") + rect(72, 92, 327, 808, { fill: C.white }) + nkHead(0, 0, "Template", { inbox: false, account: ACCOUNT }) + body(seg(), library(219)), enter: "fade", delay: 0.5, box: F.side },
      locked: { svg: LOCKED, enter: "fade", delay: 0.5 },
      picked: { svg: body(panelBg(), seg(), library(219, "folio")) + icon("inbox", 236, 122, 18, C.text), enter: "fade", box: F.panel },
      pvF: { svg: pvFolio(), enter: "fade", delay: 0.2, box: F.pv },
      konten: { svg: kontenPanel(), enter: "fade", box: F.side }
    },
    steps: [
      { caption: "Buka halaman undangan di Scalev. Editornya terbuka dalam HTML Mode.", focus: F.top, mark: [8, 54, 222, 26], lens: { src: [0, 0, 420, 92] }, at: [120, 66] },
      { caption: "Klik tab NikahKit. Sebentar tertulis Memeriksa akses...", focus: [0, 44, 399, 856], mark: [226, 54, 88, 26], lens: { src: [200, 44, 190, 50] }, show: ["gate"], at: ED.tab.NikahKit, click: true },
      { caption: "Tunggu pemeriksaan akses selesai. Menu dan panel muncul.", focus: F.side, mark: { box: [0, 104, 71, 332], r: 0 }, lens: { src: [0, 96, 300, 180], at: [290, 70] }, show: ["tpl", "locked"], at: [230, 330] },
      { caption: "Halaman masih kosong? Klik satu kartu template, misalnya Folio.", mark: cardM(234, 337), lens: { src: [226, 330, 150, 236] }, hide: ["locked"], show: ["picked", "pvF"], at: FOLIO_C, click: true, dur: 3.4 },
      { caption: "Klik Konten untuk mengisi data. Daftar bagian undangan muncul.", mark: railM("Konten"), lens: { src: [0, 360, 240, 100], at: [290, 200] }, show: ["konten"], at: ED.rail.Konten, click: true }
    ]
  }),

  "editor-peta-simpan": v4({
    title: "Langkah pertama di editor NikahKit: pratinjau dan Simpan",
    base: [...editor("Konten"), kontenPanel("Sinta"), pvFolio()],
    els: { pvName: { svg: pvSintaFolio(), enter: "fade", delay: 0.6, box: F.pv }, sBtn: { svg: simpanBtn(), box: SIMPAN } },
    steps: [
      { caption: "Lihat hasilnya di pratinjau: nama yang kamu ketik langsung tampil.", focus: F.pv, mark: [784, 420, 276, 46], show: ["pvName"], at: [922, 560], dur: 3.4 },
      { caption: "Status Tersimpan di kolom kiri? Klik Simpan di kanan atas Scalev.", focus: [F.foot, F.save], mark: [FOOT, { box: SIMPAN, r: 4 }], lens: FOOT_LENS, at: ED.simpan, click: true, press: "sBtn" }
    ]
  }),

  // ---------------------------------------------------------------------------------------------------------------------
  "editor-pilih-template": v4({
    title: "Memilih template NikahKit pertama kali: kartu template",
    base: [...editor("Template"), nkHead(0, 0, "Template", { inbox: false, account: ACCOUNT }), pvForeign()],
    els: {
      locked: LOCKED,
      cardsA: { svg: rect(72, 153, 327, 1000, { fill: C.white }) + seg() + htmlNote() + library(287), enter: "fade", box: F.body },
      lidT: { svg: lid("Template", { inbox: false }), box: F.lid }
    },
    steps: [
      { caption: "Klik Template di menu kiri. Panel Template terbuka.", focus: F.side, mark: railM("Template"), lens: { src: [0, 96, 330, 190], at: [290, 70] }, at: ED.rail.Template, click: true, show: ["cardsA"] },
      { caption: "Pastikan pilihan Template yang aktif, bukan Marketing.", focus: [80, 161, 295, 122], mark: [P, 169, PW, 38], lens: { src: [80, 161, 295, 122] }, at: [160, 188] },
      { caption: "Gulir ke bawah dan lihat gambar contoh tiap template.", focus: F.body, scroll: { id: "cardsA", dy: 241 }, at: [230, 560], dur: 3.4 },
      { caption: "Klik kartu yang kamu suka, misalnya Folio.", mark: cardM(234, 405), lens: { src: [226, 398, 150, 236] }, scroll: { id: "cardsA", dy: -241 }, at: [301, 488], click: true, dur: 3.6 }
    ]
  }),

  "editor-pilih-template-ganti": v4({
    title: "Memilih template NikahKit pertama kali: dialog Ganti",
    base: [...editor("Template"), nkHead(0, 0, "Template", { inbox: false, account: ACCOUNT }), body(panelBg(), seg(), htmlNote(), library(287)), pvForeign()],
    els: {
      veil: { svg: rect(0, 0, 1440, 900, { fill: "rgba(255,255,255,.92)" }), enter: "fade" },
      dlg: { svg: shadow(540, 383, 360, 134, 8, 3) + rect(540, 383, 360, 134, { r: 8, fill: C.white }) + text(560, 418, "Ganti isi halaman dengan Folio?", { size: 14, weight: 600 }) +
        text(560, 442, "HTML yang sekarang ada di halaman akan diganti.", { size: 12, fill: C.faint }) + nkBtn(758, 461, "Batal", { variant: "quiet", w: 57 }), enter: "fade", box: [540, 383, 360, 134] },
      gnt: { svg: nkBtn(823, 461, "Ganti", { w: 57 }), enter: "fade", box: [823, 461, 57, 36] },
      pvF: { svg: pvFolio(), enter: "fade", delay: 0.2, box: F.pv }
    },
    steps: [
      { caption: "Halaman berisi HTML lain, jadi muncul dialog Ganti isi halaman.", focus: [540, 383, 360, 134], mark: { box: [540, 383, 360, 134], r: 8 }, lens: { src: [540, 383, 360, 134] }, at: [650, 495] },
      { caption: "Klik Ganti. Pratinjau kini menampilkan Folio.", focus: [[540, 383, 360, 134], F.pv], mark: [823, 461, 57, 36], lens: { src: [748, 452, 140, 54], at: [290, 300] }, at: [851, 479], click: true, press: "gnt", hide: ["veil", "dlg", "gnt"], show: ["pvF"], dur: 3.6 }
    ]
  }),

  "editor-pilih-template-dipakai": v4({
    title: "Memilih template NikahKit pertama kali: Dipakai dan Konten",
    base: [...editor("Template"), nkHead(0, 0, "Template", { account: ACCOUNT }), body(panelBg(), seg(), library(219, "folio")), pvFolio()],
    els: { konten: { svg: kontenPanel(), enter: "fade", box: F.side }, sBtn: { svg: simpanBtn(), box: SIMPAN } },
    steps: [
      { caption: "Kartu Folio kini bertanda Dipakai. Menu lain bisa diklik.", focus: F.side, mark: { box: [326, 511, 41, 18], r: 9 }, lens: { src: [226, 330, 150, 236] }, at: [346, 520] },
      { caption: "Ganti data contoh: klik Konten. Catatan kuning menghitung isian contoh.", mark: railM("Konten"), lens: { src: [80, 161, 295, 80], at: [290, 90] }, show: ["konten"], at: ED.rail.Konten, click: true, dur: 3.6 },
      { caption: "Tunggu status Tersimpan, lalu klik Simpan di kanan atas Scalev.", focus: [F.foot, F.save], mark: [FOOT, { box: SIMPAN, r: 4 }], lens: FOOT_LENS, at: ED.simpan, click: true, press: "sBtn" }
    ]
  }),

  // Search and categories (panels-style.jsx TemplatePanel). Keyword results and counts from model.findTemplates on the build
  // catalogue; the sentence answer comes from the worker (Jev), so its order here is only an example.
  "editor-cari-template": (() => {
    const [qBox, q1, t1] = typeIn(P, 219, PW, "Jawa"), [, q2, t2] = typeIn(P, 219, PW, "Jawa, nuansa hijau");
    const below = (...kids) => rect(72, 257, 327, 643, { fill: C.white }) + kids.join("");
    const Q = [P, 219, PW, 36], LOW = [72, 257, 327, 643], LS = { src: [80, 211, 295, 90] };
    return v4({
      title: "Mencari template lewat kata kunci, kategori, atau kalimat",
      base: [...editor("Template", { screenFill: C.white }), nkHead(0, 0, "Template", { account: ACCOUNT }), body(panelBg(), seg(), library(219))],
      els: {
        adat: { svg: body(below(chips(263, ALL_N, "Adat"), cards(337, null, ["tradisional-elegan", "kencana", "joyo", "ladomudo", "pusako", "saman"]))), enter: "fade", box: LOW },
        jawa: { svg: body(below(chips(263, [11, 11, 0, 0, 0, 0], "Adat"), cards(337, null, ["tradisional-elegan", "kencana", "joyo", "pendopo", "sekar-kedaton", "sogan"]))), enter: "fade", delay: 0.5, box: LOW },
        busy: { svg: body(below(chips(263, [0, 0, 0, 0, 0, 0], "Adat"), hintL(P, 337, ["Mencari template yang paling cocok…"]))), enter: "fade", delay: 1.4, box: LOW },
        smart: { svg: body(below(chips(263, [6, 6, 0, 0, 0, 0], "Adat"), hintL(P, 337, ["Paling cocok untuk “Jawa, nuansa hijau”, urut dari", "yang terdekat."]),
          cards(369, null, ["sekar-jagad", "kayon", "joglo", "sogan", "kencana", "pendopo"]))), enter: "fade", box: LOW },
        qBox: { svg: qBox, enter: "fade", box: [P - 3, 216, PW + 6, 42] },
        q1: { svg: q1, enter: "fade" },
        q2: { svg: q2, enter: "fade" }
      },
      steps: [
        { caption: "Klik kategori, misalnya Adat. Hanya template adat yang tampil.", focus: F.body, mark: { box: [173, 263, 67, 28], r: 14 }, lens: LS, at: ADAT_CHIP, click: true, show: ["adat"] },
        { caption: "Ketik kata kunci di kotak Cari, misalnya Jawa. Angka kategori ikut berubah.", mark: Q, lens: LS, at: [228, 237], click: true, show: ["qBox", "q1", "jawa"], type: [{ id: "q1", ...t1 }], dur: 3.6 },
        { caption: "Tulis keinginan klien dalam kalimat, lalu tekan Enter.", mark: Q, lens: { src: [80, 211, 295, 150] }, at: [300, 237], click: true, hide: ["q1"], show: ["q2", "busy"], type: [{ id: "q2", ...t2 }], dur: 4.4 },
        { caption: "Hasilnya diurutkan dari yang paling cocok dengan kalimatmu.", mark: cardM(P, 369), lens: { src: [80, 328, 295, 100], at: [290, 200] }, at: [160, 452], show: ["smart"], dur: 3.6 }
      ]
    });
  })(),

  // ---------------------------------------------------------------------------------------------------------------------
  "editor-ganti-template": v4({
    title: "Mengganti template nanti: kartu lain",
    base: [...editor("Konten"), kontenPanel(), pvFolio()],
    els: {
      tplB: { svg: nkRail(0, 0, "Template") + rect(72, 92, 327, 808, { fill: C.white }) + nkHead(0, 0, "Template", { account: ACCOUNT }) + body(seg(), library(219, "folio")), enter: "fade", box: F.side },
      cardsC: { svg: body(panelBg(), seg(), library(219, "dasar")), enter: "fade", box: F.body },
      toast: { svg: TOAST, enter: "slide", delay: 0.4, box: TOAST_BOX },
      pvD: { svg: pvDasar(), enter: "fade", delay: 0.2, box: F.pv }
    },
    steps: [
      { caption: "Klik Template di menu kiri. Template yang dipakai bertanda Dipakai.", focus: F.side, mark: railM("Template"), lens: { src: [226, 330, 150, 236], at: [290, 160] }, at: ED.rail.Template, click: true, show: ["tplB"] },
      { caption: "Klik kartu template lain, misalnya Dasar. Muncul pesan dengan Urungkan.", mark: cardM(P, 337), lens: { src: [80, 330, 295, 236], at: [290, 140] }, at: DASAR_C, click: true, show: ["cardsC", "toast", "pvD"], dur: 3.6 }
    ]
  }),

  "editor-ganti-template-pratinjau": v4({
    title: "Mengganti template nanti: pratinjau",
    base: [...editor("Template"), nkHead(0, 0, "Template", { account: ACCOUNT }), body(panelBg(), seg(), library(219, "dasar")), pvDasar()],
    els: {
      cardsF: { svg: body(panelBg(), seg(), library(219, "folio")), enter: "fade", box: F.body },
      pvF: { svg: pvFolio(), enter: "fade", box: F.pv },
      toast: { svg: TOAST, box: TOAST_BOX }
    },
    steps: [
      { caption: "Periksa pratinjau. Desainnya Dasar, isian Konten tetap ada.", focus: F.pv, mark: [790, 326, 264, 48], at: [922, 420] },
      { caption: "Tidak suka? Klik Urungkan di pesan bawah panel. Folio kembali.", focus: [[84, 836, 302, 52], F.pv], mark: URUNGKAN, lens: { src: [84, 832, 302, 60] }, at: [342, 863], click: true, show: ["cardsF", "pvF"], dur: 3.4 }
    ]
  }),

  // ---------------------------------------------------------------------------------------------------------------------
  "editor-isi-mempelai": (() => {
    const hold = { left: 5, link: "Ganti foto sampul", raw: true };
    const v1 = kList({ open: "Mempelai", fill: fillMempelai(), raw: true });
    const v1b = kList({ ...hold, open: "Mempelai", fill: fillMempelai("Sinta") });
    const yM = v1.at.Mempelai, nickY = v1.f["Nama panggilan"] + 20, [clear, typed, ty] = typeIn(I, nickY, IW, "Sinta");
    const D4 = v1b.f["Nama ayah"] - 400, ayahY = 420;
    const D5 = Math.max(0, v1b.at["Acara & Tanggal"] - D4 - 260), barA = v1b.at["Acara & Tanggal"] - D4 - D5;
    const a0 = kList({ ...hold, open: "Acara & Tanggal", fill: fillAcara(EVS) });
    const dyA = Math.max(0, a0.at["Acara & Tanggal"] - barA);
    const v2 = kList({ ...hold, open: "Acara & Tanggal", fill: fillAcara(EVS), dy: dyA });
    const D6 = v2.f["Ngunduh Mantu"] - 320;
    const v2d = kList({ ...hold, open: "Acara & Tanggal", fill: fillAcara(EVS.slice(0, 2)), dy: dyA + D6 });
    const v3 = kList({ ...hold, open: "Sampul", fill: fillSampul }), yS = v3.at.Sampul;
    const D8 = v3.at["Salam Pembuka"] - 420;
    const s0 = kList({ ...hold, open: "Salam Pembuka", fill: fillSalam });
    const v4s = kList({ ...hold, open: "Salam Pembuka", fill: fillSalam, dy: s0.at["Salam Pembuka"] - 420 });
    const v5 = kList({ left: 5, link: "Ganti foto sampul" }), y5 = v5.at.Sampul;
    const sub = (D) => (D ? { scroll: { id: "v1b", dy: D } } : {});
    return v4({
      title: "Mengisi Mempelai, Acara, Sampul, dan Salam di Konten",
      base: [...editor("Template"), nkHead(0, 0, "Template", { account: ACCOUNT }), body(seg(), library(219)), pvCover("Rani & Dimas")],
      els: {
        railK: { svg: nkRail(0, 0, "Konten"), enter: "fade", box: [0, 92, 72, 808] },
        v1: { svg: v1.svg, enter: "fade", box: F.body },
        clear: { svg: clear, enter: "fade", box: [I - 3, nickY - 3, IW + 6, 42] },
        typed: { svg: typed, enter: "fade" },
        pvS: { svg: pvSinta(), enter: "fade", delay: 0.4, box: [760, 462, 324, 64] },
        v1b: { svg: v1b.svg, enter: "fade", delay: -1.2, box: F.body },
        ayahF: { svg: inp(I, ayahY, IW, "Ahmad", { focus: true }), enter: "fade", box: [I - 3, ayahY - 3, IW + 6, 42] },
        v2: { svg: v2.svg, enter: "fade", box: F.body },
        v2d: { svg: v2d.svg, enter: "fade", box: F.body },
        v3: { svg: v3.svg, enter: "fade", box: F.body },
        v4: { svg: v4s.svg, enter: "fade", box: F.body },
        v5: { svg: v5.svg, enter: "fade", box: F.body },
        lidK: { svg: lid("Konten"), enter: "fade", box: F.lid },
        sBtn: { svg: simpanBtn(), box: SIMPAN }
      },
      steps: [
        { caption: "Klik Konten di menu kiri. Daftar bagian muncul, di atasnya Bahasa undangan.", focus: F.side, mark: railM("Konten"), lens: { src: [0, 360, 240, 100], at: [290, 200] }, at: ED.rail.Konten, click: true, show: ["railK", "v1", "lidK"] },
        { caption: "Buka Mempelai. Biasanya sudah terbuka; bila tertutup, klik namanya.", focus: [72, yM - 8, 327, 908 - yM], mark: accM(yM), lens: { src: [80, yM - 8, 295, 130] }, at: [190, yM + 25] },
        { caption: "Klik Nama panggilan di bawah Mempelai Wanita, lalu ketik nama klien.", focus: [72, nickY - 60, 327, 130], mark: [I, nickY, IW, 36], lens: { src: [93, nickY - 56, 270, 120] },
          show: ["clear", "typed", "pvS"], at: [230, nickY + 18], click: true, type: [{ id: "typed", ...ty }], dur: 3.6 },
        { caption: "Isi kolom mempelai lain: Nama lengkap, Nama ayah, Nama ibu. Ulangi untuk pria.", focus: F.body, mark: [I, ayahY, IW, 36], lens: { src: [93, ayahY - 28, 270, 110] },
          hide: ["clear", "typed"], show: ["v1b", "ayahF"], ...sub(D4), at: [230, ayahY + 18], click: true, dur: 3.8 },
        { caption: "Klik Acara & Tanggal. Pilih Zona waktu, lalu ganti isi acara contoh.", mark: accM(barA), lens: { src: [80, barA - 8, 295, 128] }, hide: ["ayahF", "v1"], show: ["v2"], ...sub(D5), at: [190, barA + 25], click: true, dur: 3.6 },
        { caption: "Hapus acara yang tidak dipakai dengan ikon tempat sampah.", mark: [I + IW - 35, 333, 22, 22], lens: { src: [96, 250, 262, 130] }, hide: ["v1b"], show: ["v2d"], scroll: { id: "v2", dy: D6 }, at: [I + IW - 24, 344], click: true, dur: 3.6 },
        { caption: "Klik Sampul. Pilih Foto sampul; teks sampul boleh dibiarkan kosong.", mark: accM(yS), lens: { src: [80, yS - 8, 295, 140] }, hide: ["v2"], show: ["v3"], scroll: { id: "v2d", dy: -(dyA + D6) }, at: [190, yS + 25], click: true, dur: 3.6 },
        { caption: "Klik Salam Pembuka dan pilih Preset salam. Lalu buka Ayat / Kutipan.", mark: accM(420), lens: { src: [80, 412, 295, 150] }, hide: ["v2d"], show: ["v4"], scroll: { id: "v3", dy: D8 }, at: [190, 445], click: true, dur: 3.6 },
        { caption: "Periksa tanda Terisi. Status Tersimpan? Klik Simpan di Scalev.", focus: [F.body, F.foot, F.save], mark: [{ box: [317, y5 + 16, 37, 18 + 58 * 5], r: 9 }, FOOT, { box: SIMPAN, r: 4 }],
          lens: { src: [96, y5 + 4, 270, 216] }, hide: ["v3"], show: ["v5"], at: ED.simpan, click: true, press: "sBtn", dur: 3.8 }
      ]
    });
  })(),

  "editor-isi-mempelai-pratinjau": (() => {
    const hold = { left: 5, link: "Ganti foto sampul" };
    const k = kList({ ...hold, open: "Mempelai", fill: fillMempelai("Sinta") }), nickY = k.f["Nama panggilan"] + 20;
    const shut = kList(hold), barA = shut.at["Acara & Tanggal"];
    return v4({
      title: "Hasil isian Mempelai dan Acara di pratinjau",
      base: [...editor("Konten"), nkHead(0, 0, "Konten", { account: ACCOUNT }), k.svg, pvCover("Rani & Dimas")],
      els: {
        pvS: { svg: pvSinta(), enter: "fade", delay: 0.8, box: [760, 462, 324, 64] },
        shut: { svg: shut.svg, enter: "fade", delay: -1, box: F.body },
        open: { svg: kList({ ...hold, open: "Acara & Tanggal", fill: fillAcara(EVS.slice(0, 2)) }).svg, enter: "fade", box: F.body },
        pvEv: { svg: pvEvents(["akad", "resepsi"]), enter: "fade", box: F.pv }
      },
      steps: [
        { caption: "Isi Nama panggilan mempelai wanita: sampul di pratinjau ikut berubah.", focus: [[72, nickY - 60, 327, 130], F.pv], mark: [{ box: [I, nickY, IW, 36], r: 4 }, { box: [770, 466, 304, 58], r: 4 }],
          lens: { src: [93, nickY - 56, 270, 120] }, show: ["pvS"], at: [922, 600], dur: 3.4 },
        { caption: "Klik Acara & Tanggal: acara-acara tampil di pratinjau.", focus: [[72, barA - 8, 327, 160], F.pv], mark: accM(barA), lens: { src: [80, barA - 8, 295, 140] },
          show: ["shut", "open", "pvEv"], at: [190, barA + 25], click: true, dur: 3.4 }
      ]
    });
  })(),
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
    const nameM = [I + 10, nameY + 20, IW - 20, 36], endM = [I + 10, endY + 20, IW - 20, 36];
    const nameL = { src: [I, y2, IW, nameY + 64 - y2] }, timeL = { src: [I, startY - 2, IW, endY + 84 - startY] };
    return v4({
      title: "Menambah acara di Acara & Tanggal",
      base: [...editor("Konten"), pvEvents(["akad"])],
      els: {
        list: { svg: scrolled, box: F.body },
        dd: { svg: dd, enter: "pop", origin: [I + IW / 2, 279] },
        item2: { svg: item2, enter: "rise", box: [I, y2 - 1, IW, 901 - y2] },
        nFocus: { svg: inp(I + 10, nameY + 20, IW - 20, "", { focus: true }), enter: "fade" },
        nBlur: { svg: inp(I + 10, nameY + 20, IW - 20, ""), enter: "fade" },
        nTyped: { svg: text(I + 21, nameY + 43, "Resepsi", { size: 14, fill: C.strong }), enter: "fade" },
        title2: { svg: rect(I + 8, y2 + 12, 80, 22, { fill: C.page }) + text(I + 10, y2 + 28, "Resepsi", { size: 12, weight: 700 }), enter: "fade", delay: 0.9 },
        times: { svg: times, enter: "fade" },
        fixed: { svg: fixed, enter: "fade" },
        lidE: { svg: lid("Konten"), box: F.lid }
      },
      steps: [
        { caption: "Di Acara & Tanggal, pilih Zona waktu: WIB, WITA, atau WIT.", focus: [72, 215, 327, 150], mark: [I, 243, IW, 36], lens: { src: [93, 215, 270, 150] }, at: [I + 120, 261], click: true, show: ["dd"] },
        { caption: "Gulir ke bawah daftar acara, lalu klik Tambah acara.", focus: F.body, mark: [I, y2, IW, 36], lens: { src: [93, y2 - 8, 270, 110] }, hide: ["dd"], scroll: { id: "list", dy: DY },
          at: [I + IW / 2, y2 + 18], click: true, show: ["item2"], dur: 3.6 },
        { caption: "Kotak Acara 2 muncul. Klik kotak Nama acara.", focus: [72, y2 - 8, 327, 908 - y2], mark: nameM, lens: nameL, at: [I + 120, nameY + 38], click: true, show: ["nFocus"] },
        { caption: "Ketik nama acara, misalnya Resepsi. Judul kotaknya ikut berganti.", mark: nameM, lens: nameL, show: ["nTyped", "title2"], type: [{ id: "nTyped", n: 7, box: [I + 20, nameY + 27, tw("Resepsi", 14) + 2, 22] }], dur: 3.4 },
        { caption: "Isi Mulai dan Selesai. Selesai lebih awal? Muncul pesan merah.", mark: endM, lens: timeL, hide: ["nFocus"], show: ["nBlur", "times"], at: [I + 120, endY + 38], click: true, dur: 3.6 },
        { caption: "Perbaiki jam Selesai, misalnya 14.00. Pesan merah hilang.", mark: endM, lens: timeL, at: [I + 60, endY + 38], click: true, show: ["fixed"] }
      ]
    });
  })(),

  "editor-tambah-acara-pratinjau": v4({
    title: "Acara baru di pratinjau",
    base: [...editor("Konten"), nkHead(0, 0, "Konten", { account: ACCOUNT }), kList({ left: 5, link: "Ganti foto sampul", open: "Acara & Tanggal", fill: fillAcara(EVS.slice(0, 2)) }).svg, pvEvents(["akad"])],
    els: { pv2: { svg: pvEvents(["akad", "resepsi"]), enter: "fade", delay: 0.4, box: F.pv } },
    steps: [{ caption: "Acara baru tampil di pratinjau, lengkap dengan jamnya.", focus: F.pv, mark: { box: [751, EV.resepsi.y, 342, EV.resepsi.h], r: 14 }, lens: { src: [751, EV.resepsi.y, 342, EV.resepsi.h] }, show: ["pv2"], at: [922, 640], dur: 3.6 }]
  }),

  // ---------------------------------------------------------------------------------------------------------------------
  "editor-galeri-pilih-foto": v4({
    title: "Memilih foto galeri dari Media Scalev",
    base: [...editor("Konten"), nkHead(0, 0, "Konten", { account: ACCOUNT }), body(GAL.top(0), GAL.rest(471)), pvCover("Rani & Dimas")],
    els: {
      dlg: { svg: GAL.dlg, enter: "rise", box: F.side },
      s1: { svg: GAL.pick(0), enter: "pop", origin: [75, 350] },
      b1: { svg: GAL.foot(1), enter: "fade", box: [0, 840, 399, 60] },
      s2: { svg: GAL.pick(4), enter: "pop", origin: [199, 474] },
      b2: { svg: GAL.foot(2), enter: "fade", box: [0, 840, 399, 60] },
      after: { svg: GAL.after(), enter: "fade", box: F.body }
    },
    steps: [
      { caption: "Klik Tambah foto. Jendela Pilih foto berisi foto Media Scalev.", focus: F.side, mark: [I, 471, IW, 36], lens: { src: [93, 440, 270, 80] }, at: [I + IW / 2, 489], click: true, show: ["dlg"] },
      { caption: "Klik foto yang ingin dipakai. Foto terpilih diberi tanda centang.", focus: [0, 285, 399, 554], mark: [16, 291, 118, 118], lens: { src: [8, 283, 250, 134] }, at: [75, 350], click: true, show: ["s1", "b1"] },
      { caption: "Klik foto lain bila perlu. Tombolnya kini Pakai 2 foto.", focus: [[0, 285, 399, 554], [0, 839, 399, 61]], mark: [140, 415, 118, 118], lens: { src: [132, 407, 250, 134] }, at: [199, 474], click: true, show: ["s2", "b2"] },
      { caption: "Klik Pakai 2 foto. Foto masuk daftar Foto galeri (2).", focus: [[0, 839, 399, 61], [72, 440, 327, 240]], mark: [16, 851, 366, 36], lens: { src: [93, 443, 270, 230] },
        at: [199, 869], click: true, press: "b2", hide: ["dlg", "s1", "b1", "s2", "b2"], show: ["after"], dur: 3.6 }
    ]
  }),

  "editor-galeri-pratinjau": v4({
    title: "Galeri Foto di pratinjau",
    base: [...editor("Konten"), nkHead(0, 0, "Konten", { account: ACCOUNT }), GAL.after(), pvCover("Rani & Dimas")],
    els: { pvG: { svg: pvGallery(), enter: "fade", delay: 0.4, box: F.pv } },
    steps: [{ caption: "Galeri tampil di pratinjau. Foto pertama tampil paling besar.", focus: F.pv, mark: { box: [751, 305, 342, 236], r: 10 }, note: "Foto pertama paling besar", show: ["pvG"], at: [1000, 640], dur: 3.6 }]
  }),

  // ---------------------------------------------------------------------------------------------------------------------
  "editor-isi-galeri": (() => {
    const [dClear, dTyped, dTy] = typeIn(I + 81, 480, 127, "Lamaran kami");
    const g = { from: 5, raw: true };
    const vK = kList({ ...g, top: 191, open: "Kisah Cinta", fill: fillKisah });
    const DK = vK.at.Video - 330;
    const vV = keep("Video", 330, { ...g, open: "Video", fill: fillVideo });
    const DV = vV.at["Dress Code"] - 330;
    const vD = keep("Dress Code", 330, { ...g, open: "Dress Code", fill: fillDress });
    return v4({
      title: "Mengisi Galeri Foto, Kisah Cinta, Video, dan Dress Code",
      base: [...editor("Konten"), nkHead(0, 0, "Konten", { account: ACCOUNT }), kList({ from: 5, top: 191, todo: ["Galeri Foto"] }).svg, pvCover("Rani & Dimas")],
      els: {
        after: { svg: GAL.after(), enter: "fade", box: F.body },
        dClear: { svg: dClear, enter: "fade" },
        dTyped: { svg: dTyped, enter: "fade" },
        vK: { svg: vK.svg, enter: "fade", box: F.body },
        vV: { svg: vV.svg, enter: "fade", box: F.body },
        vD: { svg: vD.svg, enter: "fade", box: F.body },
        vAll: { svg: kList({ from: 5, top: 191 }).svg, enter: "fade", box: F.body },
        lidK: { svg: lid("Konten"), box: F.lid },
        sBtn: { svg: simpanBtn(), box: SIMPAN }
      },
      steps: [
        { caption: "Klik Konten, lalu Galeri Foto. Foto dari Tambah foto ada di daftar.", focus: [72, 241, 327, 659], mark: accM(249), lens: { src: [80, 241, 295, 66] }, at: [190, 274], click: true, show: ["after"] },
        { caption: "Isi Deskripsi foto. Foto pertama tampil paling besar.", focus: [I - 8, 463, IW + 16, 112], mark: [I + 81, 480, 127, 36], lens: { src: [I - 8, 463, IW + 16, 112] },
          at: [245, 498], click: true, show: ["dClear", "dTyped"], type: [{ id: "dTyped", ...dTy }], dur: 3.6 },
        { caption: "Klik Kisah Cinta. Ganti Waktu, Judul, dan Cerita tiap momen.", focus: [72, 183, 327, 717], mark: accM(191), lens: { src: [80, 183, 295, 140] }, hide: ["dClear", "dTyped"], at: [190, 216], click: true, show: ["vK"], dur: 3.4 },
        { caption: "Klik Video. Ganti Tautan YouTube dengan video klien.", focus: F.body, mark: accM(330), lens: { src: [80, 322, 295, 320] }, hide: ["after"], scroll: { id: "vK", dy: DK }, at: [190, 355], click: true, show: ["vV"], dur: 3.6 },
        { caption: "Isi Dress Code dan Susunan Acara bila dipakai.", mark: accM(330), lens: { src: [80, 322, 295, 250] }, hide: ["vK"], scroll: { id: "vV", dy: DV }, at: [190, 355], click: true, show: ["vD"], dur: 3.6 },
        { caption: "Periksa tanda Terisi. Status Tersimpan? Klik Simpan di Scalev.", focus: [F.body, F.foot, F.save], mark: [{ box: [317, 207, 37, 18 + 58 * 8], r: 9 }, FOOT, { box: SIMPAN, r: 4 }],
          lens: { src: [96, 195, 270, 216] }, hide: ["vV"], show: ["vAll"], at: ED.simpan, click: true, press: "sBtn", dur: 3.8 }
      ]
    });
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
      .toggle("Tampilkan jumlah kehadiran", true, ["Mis. \"120 konfirmasi hadir\" di atas daftar", "ucapan."])
      .toggle("Pilihan \"Masih ragu\"", false, ["Mati: tamu hanya memilih Hadir atau Tidak", "hadir."]).h3("Tanyakan juga")
      .toggle("Tamu dari pihak mana", true).toggle("Acara yang dihadiri", true, ["Butuh minimal 2 acara."]).toggle("Perkiraan jam datang", true)
      .toggle("Minta nomor WhatsApp tamu", true, ["Tamu mengisi nomornya sendiri di form (boleh", "kosong). Nomor tampil di Dashboard."]).lead("Jawaban tampil di Dashboard.")
      .toggle(["Tampilkan QR masuk untuk tamu", "undangan khusus"], false, ["Hanya berlaku bila Undangan khusus menyala", "(di Bagikan). Tamu yang menjawab Hadir", "melihat QR ini di kartu terima kasih RSVP;", "penerima tamu memindainya di halaman Check-in."]);
    const accY = rs.y + 8;
    const DY = accY + 2 * 58 - 169; // scroll so Amplop Digital's bar lands at y 169, where the opened group stays
    const accs = ["Siaran Langsung", "Filter Kamera", "Amplop Digital", "Aturan Tamu", "Turut Mengundang"].map((t, i) => acc(accY + i * 58, t, "Terisi")).join("");
    const rsvp = () => rect(72, 153, 327, 747 + DY, { fill: C.white }) + acc(111, "Susunan Acara", "Terisi") + acc(169, "RSVP & Ucapan", "Terisi", 1400) + rect(P + 1, accY - 9, PW - 2, 1400, { fill: C.white }) + line(P, accY - 8.5, P + PW, accY - 8.5) +
      rs.svg + accs;
    const ddMode = shadow(I, formY + 38, IW, 80, 6, 2) + rect(I, formY + 38, IW, 80, { r: 6, fill: C.white, stroke: C.field }) + rect(I + 4, formY + 42, IW - 8, 24, { r: 4, fill: C.primarySoft }) +
      ["Ucapan + konfirmasi hadir", "Ucapan saja", "Konfirmasi hadir saja"].map((v, i) => text(I + 14, formY + 59 + i * 24, v, { size: 14, fill: C.strong })).join("") + iconX("check", I + IW - 18, formY + 54, 14, C.action);
    const gifts = keep("Amplop Digital", 169, { open: "Amplop Digital", fill: fillGifts, raw: true });
    const D6 = gifts.f["WhatsApp konfirmasi"] - 450, waY = 470;
    const [waClear, waTyped, waTy] = typeIn(I, waY, IW, "081298765432");
    const turutY = gifts.at["Turut Mengundang"] - D6;
    const vF = keep("Turut Mengundang", turutY, { open: "Turut Mengundang", fill: fillFamilies, raw: true });
    const D8 = vF.at["Kaki Halaman"] - 330;
    const vKaki = keep("Kaki Halaman", 330, { open: "Kaki Halaman", fill: fillFooter }), brandY = vKaki.f["Nama brand"] + 20;
    return v4({
      title: "Mengatur RSVP, Amplop Digital, dan bagian penutup",
      base: [...editor("Konten"), keep("RSVP & Ucapan", 169).svg, pvCover("Rani & Dimas")],
      els: {
        list1: { svg: rsvp(), enter: "fade", box: F.body },
        ddMode: { svg: ddMode, enter: "pop", origin: [I + IW / 2, formY + 36] },
        ddG: { svg: shadow(I, guestsY + 38, IW, 152, 6, 2) + rect(I, guestsY + 38, IW, 152, { r: 6, fill: C.white, stroke: C.field }) + rect(I + 4, guestsY + 66, IW - 8, 24, { r: 4, fill: C.primarySoft }) +
          [1, 2, 3, 4, 5, 6].map((n, i) => text(I + 14, guestsY + 59 + i * 24, `${n} orang`, { size: 14, fill: C.strong })).join("") + iconX("check", I + IW - 18, guestsY + 78, 14, C.action), enter: "pop", origin: [I + IW / 2, guestsY + 36] },
        list2: { svg: rsvp(), enter: "fade", delay: -1.3, box: F.body },
        gifts: { svg: gifts.svg, enter: "fade", box: F.body },
        pvGift: { svg: pvGift(), enter: "fade", delay: 0.3, box: F.pv },
        waClear: { svg: waClear, enter: "fade" },
        waTyped: { svg: waTyped, enter: "fade" },
        vF: { svg: vF.svg, enter: "fade", box: F.body },
        vKaki: { svg: vKaki.svg, enter: "fade", box: F.body },
        lidE: { svg: lid("Konten"), box: F.lid },
        sBtn: { svg: simpanBtn(), box: SIMPAN }
      },
      steps: [
        { caption: "Klik Konten, lalu klik RSVP & Ucapan. Bagian terbuka.", focus: F.body, mark: accM(169), lens: { src: [80, 161, 295, 130] }, at: [190, 194], click: true, show: ["list1"] },
        { caption: "Pastikan tertulis Tersambung. ID: diikuti angka ID halaman.", focus: [80, noteY - 8, 295, 54], mark: [I, noteY, IW, 38], lens: { src: [93, noteY - 8, 270, 54] }, at: [I + 150, noteY + 19] },
        { caption: "Pilih Isi form, misalnya Ucapan + konfirmasi hadir.", focus: [80, formY - 28, 295, 156], mark: [I, formY, IW, 36], lens: { src: [93, formY - 24, 270, 150] }, show: ["ddMode"], at: [I + 120, formY + 18], click: true },
        { caption: "Pilih Jumlah tamu paling banyak per undangan, lalu atur sakelar Tanyakan juga.", focus: [80, guestsY - 28, 295, 226], mark: [I, guestsY, IW, 36], lens: { src: [93, guestsY - 24, 270, 220] },
          hide: ["ddMode"], show: ["ddG"], at: [I + 120, guestsY + 18], click: true },
        { caption: "Klik Amplop Digital, lalu ganti rekening contoh 1234567890.", focus: [F.body, F.pv], mark: accM(169), lens: { src: [80, 161, 295, 200] },
          hide: ["ddG"], show: ["list2", "gifts", "pvGift"], scroll: { id: "list2", dy: DY }, at: [190, 194], click: true, dur: 3.8 },
        { caption: "Masih di Amplop Digital, isi WhatsApp konfirmasi dengan nomor klien.", focus: F.body, mark: [I, waY, IW, 36], lens: { src: [93, waY - 28, 270, 72] }, hide: ["list1", "list2"], scroll: { id: "gifts", dy: D6 },
          at: [230, waY + 18], click: true, show: ["waClear", "waTyped"], type: [{ id: "waTyped", ...waTy }], dur: 3.8 },
        { caption: "Isi Turut Mengundang dan Salam Penutup.", focus: [72, turutY - 8, 327, 908 - turutY], mark: accM(turutY), lens: { src: [80, turutY - 8, 295, 140] }, at: [190, turutY + 25], click: true, show: ["vF"], dur: 3.4 },
        { caption: "Periksa Kaki Halaman: nama brand dan WhatsApp pemesanan milik usahamu.", focus: F.body, mark: accM(330), lens: { src: [93, 322, 270, brandY + 44 - 322] },
          hide: ["gifts", "waClear", "waTyped"], scroll: { id: "vF", dy: D8 }, at: [190, 355], click: true, show: ["vKaki"], dur: 3.8 },
        { caption: "Simpan: tunggu status Tersimpan, lalu klik Simpan di Scalev.", focus: [F.foot, F.save], mark: [FOOT, { box: SIMPAN, r: 4 }], lens: FOOT_LENS, hide: ["vF"], at: ED.simpan, click: true, press: "sBtn" }
      ]
    });
  })()
};
