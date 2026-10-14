// Editor scenes for the Media, Musik, Gaya, Lapisan, preview click, Urungkan/Kosongkan and Dijeda pages.
// World = the real 1440x900 Scalev editor (lib scalevEditor). Panel geometry from /tmp/ref/editor-*.png and
// editor-metrics.json (update note left out: content starts at y 169). Labels follow nikahkit/src/ui/App.jsx,
// panels-style.jsx, panels-structure.jsx, fields.jsx, panel-content.jsx, fields.js, model.js, store.js and
// canvas/canvas.js (preview toolbar: #223548 bar, Isi / ↑ / ↓ / Sembunyikan, 30px buttons, 3px blue frame).
import { C, ED, rect, text, line, circle, para, tw, clipped, shadow, icon, iconX, nkBtn, nkInput, nkSwitch, nkBadge, nkNote, nkAcc, nkH3,
  scalevEditor, nkRail, nkHead, nkDialogHead, ring, note, chrome, favChrome } from "../lib.mjs";

// Worlds (static crops; the stage takes their shape). GW: rail + panel + preview (scale 0.86); PV: panel + preview
// without the rail (0.92); PANEL: rail + panel (1.03).
const GW = { x: 0, y: 92, w: 1117, h: 808 }, PV = { x: 72, y: 92, w: 1045, h: 808 }, PANEL = { x: 0, y: 92, w: 400, h: 808 };
const SC = ED.screen; // preview screen 727,106 390x784
const PX = 88, PW = 279, BY = 169; // panel body content box (scrolling panels keep 279 next to the scrollbar)
const SERIF = "Tinos,'Times New Roman',Georgia,serif";
const SCRIPT = "MonteCarlo,'Great Vibes','Snell Roundhand','Apple Chancery',cursive";
const KENCANA = { bg: "#FFF7E9", surface: "#FFFDF8", heading: "#8E2818", text: "#10001E", muted: "#6B5A55", accent: "#8E2818", on: "#FFFFFF" };
const GOLD = "#E0B84A";

// ---- small drawing helpers -------------------------------------------------------------------------------------------
let uid = 0;
const raw = (body, cx, cy, size, color, fill = false) => `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${size / 24})" fill="${fill ? color : "none"}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</g>`;
const clipPath = (d, ...kids) => { const id = `a4c${uid++}`; return `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${kids.join("")}</g>`; };
const rrPath = (x, y, w, h, r) => (r ? `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 -${r} ${r}h-${w - 2 * r}a${r} ${r} 0 0 1 -${r} -${r}v-${h - 2 * r}a${r} ${r} 0 0 1 ${r} -${r}z` : `M${x} ${y}h${w}v${h}h-${w}z`);
const scrollbar = (y = 157, h = 360) => rect(387, y, 6, h, { r: 3, fill: "#c4c8ce" });
const white = (x, y, w, h) => rect(x, y, w, h, { fill: C.white });

// Editor shell: Scalev editor + NikahKit rail (active menu) + panel header.
const shell = (rail, title, o = {}) => scalevEditor(0, 0, { rail, ...o }) + (title ? nkHead(0, 0, title) + line(72, 153, 399, 153, { stroke: C.line }) : "");
// Rail + header + empty panel body as an overlay (switching menus).
const railPanel = (rail, title, o = {}) => nkRail(0, 0, rail, o) + white(72, 92, 327, 808) + nkHead(0, 0, title) + line(72, 153, 399, 153, { stroke: C.line });

// Photos drawn as flat shapes (no screenshots): sky, hills, sun; k picks the colours.
const TONES = [["#d9c7b0", "#a8875f", "#7d5f3f"], ["#cfdbe0", "#8aa596", "#5d7a66"], ["#ead1c6", "#c48f7f", "#8e5a4c"], ["#d6d3e6", "#9a92b8", "#6a6290"], ["#e8dcc0", "#c2a25c", "#8b6d2f"], ["#d3e1e8", "#7f9eb0", "#4f6f82"], ["#efe1d9", "#b9a093", "#7b6257"], ["#dfe6d2", "#a3b47e", "#6d7f4a"], ["#f0d8c8", "#d49a76", "#9b5e3c"]];
function photo(x, y, w, h, k = 0) {
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
const cloud = (cx, cy, col) => circle(cx - 18, cy + 2, 11, { fill: col }) + circle(cx + 18, cy + 2, 11, { fill: col }) + circle(cx, cy - 6, 16, { fill: col }) +
  rect(cx - 40, cy + 4, 80, 10, { r: 5, fill: col }) + circle(cx, cy - 4, 6, { fill: "rgba(255,255,255,.35)" });
const gate = (x, y, col, flip) => { const d = flip ? `M${x} ${y} L${x + 58} ${y + 18} V${y + 112} L${x} ${y + 128} Z` : `M${x} ${y + 18} L${x + 58} ${y} V${y + 128} L${x} ${y + 112} Z`;
  return `<path d="${d}" fill="none" stroke="${col}" stroke-width="3"/>` + circle(x + 29, y + 50, 13, { stroke: col, sw: 2 }) + circle(x + 29, y + 86, 13, { stroke: col, sw: 2 }) + line(x + 29, y + 26, x + 29, y + 118, { stroke: col, sw: 1.5 }); };

// Kencana cover (template "kencana": cream paper, maroon bands, arch photo, script names). o: pal, scale, shape,
// nameFont, nameSize, top (screen y of the page top, for scrolled pages).
function cover(o = {}) {
  const p = { ...KENCANA, ...o.pal }, s = o.scale ?? 1, top = o.top ?? SC.y, x0 = SC.x, cx = SC.x + SC.w / 2, shape = o.shape ?? "arch";
  const Y = (v) => top + v;
  let g = rect(x0, top, SC.w, 784, { fill: p.bg }) + rect(x0, top, SC.w, 18, { fill: p.accent }) + rect(x0, Y(764), SC.w, 20, { fill: p.accent });
  for (let i = 0; i < 15; i++) g += circle(x0 + 6 + i * 27, Y(18), 15, { fill: p.accent }) + circle(x0 + 6 + i * 27, Y(766), 13, { fill: p.accent });
  g += circle(x0 + 20, Y(68), 12, { fill: "#f2c9c4" }) + circle(x0 + 34, Y(70), 9, { fill: "#f5d8d3" });
  g += cloud(x0 + 70, Y(126), p.accent) + cloud(x0 + 320, Y(126), p.accent) + gate(x0 + 66, Y(152), p.accent) + gate(x0 + 266, Y(152), p.accent, true);
  const fx = cx - 70, fy = Y(105), fw = 140, fh = 189;
  const d = shape === "arch" ? `M${fx} ${fy + fh} V${fy + 70} a70 70 0 0 1 140 0 V${fy + fh} Z` : rrPath(fx, fy, fw, fh, shape === "soft" ? 18 : 0);
  g += clipPath(d, couple(fx, fy, fw, fh)) + `<path d="${d}" fill="none" stroke="${p.accent}" stroke-width="2"/>`;
  g += text(cx, Y(327), "The Wedding Of", { size: Math.round(18 * s), fill: p.text, anchor: "middle", font: SERIF });
  g += text(cx, Y(399), o.names ?? "Rani & Dimas", { size: Math.round((o.nameSize ?? 50) * s), fill: p.heading, anchor: "middle", font: o.nameFont ?? SCRIPT });
  g += text(cx, Y(451), "Minggu, 14 Februari 2027", { size: Math.round(15 * s), weight: 700, fill: p.text, anchor: "middle", font: SERIF }) +
    text(cx, Y(472), "#RaniDimas", { size: Math.round(13 * s), fill: p.text, anchor: "middle", font: SERIF }) +
    text(cx, Y(507), "Kepada Yth. Bapak/Ibu/Saudara/i", { size: Math.round(13 * s), weight: 700, fill: p.text, anchor: "middle", font: SERIF }) +
    text(cx, Y(531), "Tamu Undangan", { size: Math.round(18 * s), fill: p.heading, anchor: "middle", font: SERIF });
  const bw = Math.round(171 * s), bh = Math.round(48 * s);
  g += rect(cx - bw / 2, Y(567), bw, bh, { r: shape === "arch" ? bh / 2 : shape === "soft" ? 12 : 2, fill: p.accent }) + icon("mail", cx - bw / 2 + 34, Y(567) + bh / 2, 16, p.on) +
    text(cx + 12, Y(567) + bh / 2 + 5, "Buka Undangan", { size: Math.round(15 * s), fill: p.on, anchor: "middle", font: SERIF });
  g += [0, 1, 2].map((i) => circle(cx - 40 + i * 22, Y(720), 30 + i * 8, { stroke: "#f0d9d3", sw: 2 })).join("");
  if (o.disc !== false) g += circle(x0 + 338, Y(659), 27, { fill: "#141414" }) + circle(x0 + 338, Y(659), 11, { fill: C.white }) + `<path d="M${x0 + 335} ${Y(654)} l8 5 l-8 5 z" fill="#141414"/>`;
  return clipped(x0, top, SC.w, 784, g);
}
const screen = (...kids) => clipped(SC.x, SC.y, SC.w, SC.h, ...kids);
const coverScreen = (o) => screen(cover(o));

// ---- panel widgets not in lib ----------------------------------------------------------------------------------------
// Gaya sub-tabs (nk-seg nk-subtabs) with dividers and the "diubah" dot.
function subtabs(active, dots = []) {
  const items = ["Warna", "Huruf", "Bentuk"], iw = PW / 3;
  let s = rect(PX + 0.5, BY + 0.5, PW - 1, 37, { r: 4, fill: C.white, stroke: C.field });
  items.forEach((it, i) => {
    if (i === active) s += rect(PX + 1 + i * iw, BY + 1, iw - (i === 2 ? 2 : 1), 36, { fill: C.primarySoft });
    if (i) s += line(PX + i * iw, BY + 1, PX + i * iw, BY + 37, { stroke: C.field });
    const cx = PX + i * iw + iw / 2 - (dots.includes(i) ? 5 : 0);
    s += text(cx, BY + 23, it, { size: 12, weight: i === active ? 600 : 500, fill: i === active ? C.action : C.text, anchor: "middle" });
    if (dots.includes(i)) s += circle(cx + tw(it, 12, 600) / 2 + 9, BY + 19, 3, { fill: C.changed });
  });
  return s;
}
// Icon segmented control (fields.jsx Seg): the chosen one also shows its name.
function segIcons(x, y, w, items, active) {
  const lw = (it) => tw(it.label, 12, 600) + 6, need = items[active] ? (it => (it.size ?? 20) + lw(it) + 16)(items[active]) : 0;
  const even = w / items.length, aw = Math.max(even, need), ow = items.length > 1 ? (w - aw) / (items.length - 1) : w;
  let s = rect(x + 0.5, y + 0.5, w - 1, 37, { r: 4, fill: C.white, stroke: C.field }), bx = x;
  items.forEach((it, i) => {
    const on = i === active, col = on ? C.action : C.text, iw = on ? aw : ow, mid = bx + iw / 2, l = on ? lw(it) : 0, size = it.size ?? 20;
    if (on) s += rect(bx + (i ? 0 : 1), y + 1, iw - (i ? 0 : 1) - (i === items.length - 1 ? 1 : 0), 36, { fill: C.primarySoft });
    if (i) s += line(bx, y + 1, bx, y + 37, { stroke: C.field });
    s += raw(it.svg, mid - l / 2, y + 19, size, col) + (on ? text(mid - l / 2 + size / 2 + 6, y + 23, it.label, { size: 12, weight: 600, fill: col }) : "");
    bx += iw;
  });
  return s;
}
const changed = (x, y, label = "diubah") => circle(x + 3, y - 4, 3, { fill: C.changed }) + text(x + 10, y, label, { size: 10, weight: 500, fill: C.warnStrong });
const quiet = (x, y, label, o = {}) => nkBtn(x, y, label, { variant: "quiet", ...o });
// Toast (styles.js .nk-toast): right of the rail, bottom of the panel, dark strong colour, Urungkan link.
const nkToast = (label) => shadow(84, 836, 303, 52, 4) + rect(84, 836, 303, 52, { r: 4, fill: C.strong }) + text(96, 867, label, { size: 14, fill: C.white }) +
  text(375, 867, "Urungkan", { size: 14, weight: 700, fill: "#7fd3f5", anchor: "end" });

// Form column (panel-content.jsx Field/Switch/Photo). Items: {label, value, hint, focus, placeholder} | {toggle, on} |
// {h3} | {photo: label, url, alt, focus}. Returns [svg, positions by key].
function column(items, x, y, w) {
  let s = "", first = true; const pos = {};
  for (const it of items) {
    if (it.h3) { if (!first) y += 20; s += nkH3(x, y + 12, it.h3); y += 24; }
    else if (it.toggle) { pos[it.key ?? it.toggle] = y; s += text(x, y + 25, it.toggle, { size: 14, fill: C.text }) + nkSwitch(x + w - 36, y + 10, it.on); y += 48; }
    else if (it.photo) {
      pos[it.key ?? "photo"] = y;
      s += text(x, y + 12, it.photo, { size: 12, weight: 500, fill: C.strong }); y += 20;
      if (it.url !== undefined) { s += photo(x, y, 64, 64, it.url); y += 72; }
      s += quiet(x, y, it.url !== undefined ? "Ganti foto" : "Pilih foto", { icon: "image" }); pos.photoBtn = y; y += 36;
      if (it.url !== undefined) {
        y += 10; const mh = 146; s += rect(x, y, w, mh, { r: 4, fill: C.page });
        s += text(x + 10, y + 22, "Deskripsi foto", { size: 12, weight: 500, fill: C.strong }) + nkInput(x + 10, y + 30, w - 20, it.alt ?? "", {}); pos.alt = y + 30;
        s += text(x + 10, y + 90, "Titik fokus", { size: 12, weight: 500, fill: C.strong }); pos.focus = y + 98;
        s += focusSeg(x + 10, y + 98, w - 20, it.focus ?? 1);
        y += mh;
      }
      y += 12;
    } else {
      pos[it.key ?? it.label] = y;
      s += text(x, y + 12, it.label, { size: 12, weight: 500, fill: C.strong });
      if (it.focus) s += rect(x - 3, y + 17, w + 6, 42, { r: 6, fill: C.primarySoft });
      s += nkInput(x, y + 20, w, it.value || it.placeholder || "", { focus: it.focus, placeholder: !it.value, select: it.select });
      y += 56; if (it.hint) { s += text(x, y + 20, it.hint, { size: 12, fill: C.faint }); y += 20; } y += 12;
    }
    first = false;
  }
  pos.end = y;
  return [s, pos];
}
const DOT = (cy, cx = 12) => `<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="${cx}" cy="${cy}" r="2.5" fill="currentColor"/>`;
const FOCUS = [["Atas", DOT(8)], ["Tengah", DOT(12)], ["Bawah", DOT(16)], ["Kiri", DOT(12, 8.5)], ["Kanan", DOT(12, 15.5)]];
const focusSeg = (x, y, w, active) => segIcons(x, y, w, FOCUS.map(([label, svg]) => ({ label, svg: svg.replace("currentColor", active === FOCUS.findIndex((f) => f[0] === label) ? C.action : C.text) })), active);

// Template panel (panels-style.jsx TemplatePanel): kind tabs + template cards.
const MEGAPHONE = '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>';
const GRID = '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>';
function templatePanel() {
  let s = rect(PX + 0.5, BY + 0.5, PW - 1, 37, { r: 4, fill: C.white, stroke: C.field }) + rect(PX + 1, BY + 1, PW / 2 - 1, 36, { fill: C.primarySoft }) + line(PX + PW / 2, BY + 1, PX + PW / 2, BY + 37, { stroke: C.field }) +
    raw(GRID, PX + 48, BY + 19, 18, C.action) + text(PX + 62, BY + 23, "Template", { size: 12, weight: 600, fill: C.action }) + raw(MEGAPHONE, PX + PW * 0.75, BY + 19, 18, C.text);
  const cards = [["Dasar", "Polos · 20 bagian · HP &", "#4b4b4b"], ["Folio", "20 bagian · HP &", "#2f3238"], ["Galeri Putih", "20 bagian · HP &", "#f4f2ee"], ["Modern Estetik", "20 bagian · HP &", "#ebe6dc"]];
  cards.forEach(([n, d, bg], i) => {
    const x = PX + (i % 2) * 146, y = BY + 50 + Math.floor(i / 2) * 241;
    s += rect(x + 0.5, y + 0.5, 132, 165, { r: 8, fill: "#f6f6f6", stroke: C.line }) + rect(x + 5, y + 5, 72, 156, { r: 5, fill: bg }) +
      photo(x + 12, y + 30, 58, 60, i + 2) + rect(x + 18, y + 104, 46, 4, { r: 2, fill: i < 2 ? "rgba(255,255,255,.7)" : "#8a8a8a" }) + rect(x + 26, y + 114, 30, 3, { r: 1.5, fill: i < 2 ? "rgba(255,255,255,.5)" : "#b5b5b5" }) +
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => rect(x + 82 + (k % 2) * 23, y + 8 + Math.floor(k / 2) * 30, 20, 26, { r: 2, fill: k % 3 ? "#ffffff" : "#d9d4cc" })).join("") +
      text(x, y + 188, n, { size: 14, weight: 500 }) + para(x, y + 209, [d, "desktop · ID/EN"], { size: 12, fill: C.faint, lh: 16 });
  });
  return s;
}

// =====================================================================================================================
// Media: unggah banyak foto
const MEDIA_Y = 239, MS = 89; // grid top, tile size (3 columns, gap 6)
const tile = (i, k) => { const x = PX + (i % 3) * (MS + 6), y = MEDIA_Y + Math.floor(i / 3) * (MS + 6); return photo(x, y, MS, MS, k); };
const mediaGrid = (ks) => clipped(PX, MEDIA_Y, PW, 900 - MEDIA_Y, ks.map((k, i) => tile(i, k)).join(""));
const OLD = [0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2];
const mediaBody = (hint, ks, o = {}) => white(72, 154, 314, 746) + nkBtn(PX, BY, "Unggah foto", { w: PW, icon: "upload", size: 14 }) +
  (o.busy ? rect(PX, BY, PW, 36, { r: 4, fill: "rgba(255,255,255,.5)" }) : "") + text(PX, BY + 54, hint, { size: 12, fill: o.hintFill ?? C.faint }) + mediaGrid(ks) + scrollbar(157, 300);
// A file window over the preview (generic, no app chrome labels).
const FILES = [["akad-1.jpg", 4], ["akad-2.jpg", 1], ["resepsi.jpg", 8], ["lamaran.jpg", 3]];
const FW = { x: 394, y: 300, w: 330, h: 270 }; // over the grey gap left of the preview
const BUKA = [FW.x + FW.w - 52, FW.y + FW.h - 30];
function fileWindow(sel) {
  const { x, y, w, h } = FW;
  let s = shadow(x, y, w, h, 10, 3) + rect(x, y, w, h, { r: 10, fill: C.white, stroke: "#d0d4da" }) + rect(x, y, w, 30, { r: 10, fill: "#eceef1" }) + rect(x, y + 20, w, 10, { fill: "#eceef1" }) +
    circle(x + 16, y + 15, 5, { fill: "#ff5f57" }) + circle(x + 32, y + 15, 5, { fill: "#febc2e" }) + circle(x + 48, y + 15, 5, { fill: "#28c840" }) + iconX("folder", x + 80, y + 15, 14, C.text);
  FILES.forEach(([n, k], i) => {
    const fx = x + 22 + (i % 2) * 150, fy = y + 46 + Math.floor(i / 2) * 92;
    if (sel) s += rect(fx - 6, fy - 4, 138, 86, { r: 6, fill: C.crBlueSoft });
    s += photo(fx + 33, fy, 60, 54, k) + text(fx + 63, fy + 72, n, { size: 13, fill: C.crText, anchor: "middle" });
  });
  return s + line(x, y + h - 52, x + w, y + h - 52, { stroke: "#e3e5e8" }) + rect(BUKA[0] - 36, BUKA[1] - 14, 72, 28, { r: 6, fill: sel ? C.crBlue : "#c4c7c5" }) +
    text(BUKA[0], BUKA[1] + 5, "Buka", { size: 13, weight: 500, fill: C.white, anchor: "middle" });
}

// =====================================================================================================================
// Konten: Mempelai Wanita fields (Media: Pilih foto, Klik di pratinjau).
const ACC_X = 101, ACC_W = 253;
const accFrame = (y0, y1) => line(88.5, y0, 88.5, y1, { stroke: C.line }) + line(366.5, y0, 366.5, y1, { stroke: C.line });
const kontenTop = () => {
  // Bahasa undangan, lead, closed groups (panel-content.jsx), then the Mempelai bar.
  let s = text(PX, BY + 12, "Bahasa undangan", { size: 12, weight: 500, fill: C.strong }) + nkInput(PX, BY + 20, PW, "Indonesia", { select: true }) +
    para(PX, BY + 76, ["Hanya halaman tamu. Teks bawaan ikut berganti;", "teks yang sudah diubah tetap."], { size: 12, fill: C.faint, lh: 16 }) +
    text(PX, BY + 120, "Urutan dan tampilan bagian di Lapisan.", { size: 12, fill: C.faint });
  return s;
};
const GROUPS_Y = BY + 136; // first accordion
const KGROUPS = ["Sampul", "Mempelai", "Acara & Tanggal", "Salam Pembuka", "Ayat / Kutipan", "Kisah Cinta", "Galeri Foto", "Video", "Rangkaian Acara"];

// =====================================================================================================================
// Gaya: Warna
const ROLES = [["Latar", "Latar halaman", "bg"], ["Kartu", "Kotak acara, form, kartu", "surface"], ["Judul", "Nama mempelai dan judul bagian", "heading"], ["Teks", "Isi dan keterangan", "text"], ["Aksen", "Sampul, tombol, ikon", "accent"]];
const colorRow = (y, [label, hint], hex) => rect(PX + 0.5, y + 0.5, PW - 1, 53, { r: 4, fill: C.white, stroke: C.line }) + rect(97, y + 13, 36, 28, { r: 4, fill: C.white, stroke: C.line }) +
  rect(101, y + 18, 28, 18, { r: 2, fill: hex, stroke: "rgba(0,0,0,.25)", sw: 0.5 }) + text(143, y + 22, label, { size: 14, weight: 500 }) + text(143, y + 41, hint, { size: 10, fill: C.faint }) +
  text(358, y + 31, hex, { size: 10, fill: C.text, anchor: "end", mono: true });
const pal = (y, name, c, o = {}) => {
  const h = o.h ?? 44;
  return rect(PX + 0.5, y + 0.5, PW - 1, h - 1, { r: 4, fill: C.white, stroke: o.on ? C.primary : C.line, sw: o.on ? 2 : 1 }) +
    clipped(97, y + h / 2 - 15, 92, 30, ...c.map((col, i) => rect(97 + i * 18.4, y + h / 2 - 15, 18.4, 30, { fill: col }))) + rect(97.5, y + h / 2 - 14.5, 91, 29, { r: 4, stroke: C.line }) +
    (o.lines ? para(199, y + 22, o.lines, { size: 14, weight: 500, lh: 20 }) : text(199, y + h / 2 + 5, name, { size: 14, weight: 500 })) +
    (o.badge ? nkBadge(269, y + 18, o.badge, { fill: C.mutedBg, fg: C.text }) : "");
};
const KENCANA_STRIP = ["#FFF7E9", "#FFFDF8", "#8E2818", "#8E2818", "#6B5A55"];
const EARTHY = [["Terakota", ["#F6EFE7", "#FFFBF6", "#5A2E1F", "#A0522D", "#7A6A60"]], ["Sage", ["#F1F3EC", "#FBFCF8", "#2F3D2C", "#5B7553", "#66705F"]], ["Kakao", ["#EFE6DC", "#FAF5EF", "#3A2A22", "#6B4A3A", "#6E5F56"]], ["Pasir", ["#F5EFE3", "#FFFDF8", "#4A3A26", "#7D5F36", "#6E6253"]]];
// Palette list (model.js paletteChoices for Kencana); sel: 0 = Merah Kencana, 1.. = Earthy rows.
function palettes(y, sel = 0) {
  let s = nkH3(PX, y + 12, "Bold Luxury") + pal(y + 24, "", KENCANA_STRIP, { h: 54, on: sel === 0, lines: ["Merah", "Kencana"], badge: "Bawaan Kencana" }) + nkH3(PX, y + 126, "Earthy");
  EARTHY.forEach(([n, c], i) => (s += pal(y + 138 + i * 50, n, c, { on: sel === i + 1 })));
  return s;
}
const PAL_Y = 597, palRowY = (i) => PAL_Y + 138 + i * 50; // Earthy row i
const TERAKOTA = { bg: "#F6EFE7", surface: "#FFFBF6", heading: "#5A2E1F", text: "#4A3B33", accent: "#A0522D", on: "#FFFFFF" };
// State A: Custom not in use (lead line, colours of the chosen palette), without the sub-tabs.
function warnaA(p = KENCANA, sel = 0) {
  let s = white(72, BY + 38, 314, 900) + nkH3(PX, 235, "Custom") + para(PX, 259, ["Mulai dari palet yang dipilih; ubah salah satu warna", "untuk memakai Custom."], { size: 12, fill: C.faint, lh: 16 });
  ROLES.forEach((r, i) => (s += colorRow(291 + i * 60, r, p[r[2]].toUpperCase())));
  return s + palettes(PAL_Y, sel);
}
// State B: Aksen changed (Custom dipakai, Gaya diubah + Kembalikan, contrast warning).
const resetBox = (y) => rect(PX + 0.5, y + 0.5, PW - 1, 49, { r: 4, fill: C.warnSoft, stroke: "#fde7c7" }) + text(PX + 11, y + 29, "Gaya diubah.", { size: 12, fill: C.strong }) +
  quiet(PX + PW - 11 - 86, y + 9, "Kembalikan", { w: 86, h: 32 });
function warnaB() {
  let s = white(72, 154, 314, 746) + subtabs(0, [0]) + resetBox(223) + nkH3(PX, 297, "Custom") + changed(PX + 50, 297, "dipakai");
  ROLES.forEach((r, i) => (s += colorRow(309 + i * 60, r, r[2] === "accent" ? GOLD : KENCANA[r[2]].toUpperCase())));
  s += nkNote(PX, 609, PW, ["Kurang kontras: Aksen di Latar, Aksen di", "Kartu."], { tone: "warn" }) + quiet(PX, 677, "Kembali ke palet bawaan");
  return s + palettes(733, -1);
}
// Chrome's colour picker popup (generic: gradient, hue bar, hex value; no labels). Opens above the swatch (no room below).
const PICK = { x: 104, y: 326, w: 232, h: 196 };
function picker(hex) {
  const { x, y, w, h } = PICK;
  return shadow(x, y, w, h, 8, 3) + rect(x, y, w, h, { r: 8, fill: C.white, stroke: "#d6d9de" }) +
    `<defs><linearGradient id="a4pk" x1="0" x2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#e0a020"/></linearGradient><linearGradient id="a4pk2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(0,0,0,0)"/><stop offset="1" stop-color="#000"/></linearGradient><linearGradient id="a4hue" x1="0" x2="1"><stop offset="0" stop-color="#f00"/><stop offset=".17" stop-color="#ff0"/><stop offset=".33" stop-color="#0f0"/><stop offset=".5" stop-color="#0ff"/><stop offset=".67" stop-color="#00f"/><stop offset=".83" stop-color="#f0f"/><stop offset="1" stop-color="#f00"/></linearGradient></defs>` +
    rect(x + 12, y + 12, w - 24, 104, { r: 4, fill: "url(#a4pk)" }) + rect(x + 12, y + 12, w - 24, 104, { r: 4, fill: "url(#a4pk2)" }) +
    circle(x + 46, y + 38, 15, { fill: hex }) + rect(x + 70, y + 128, w - 82, 10, { r: 5, fill: "url(#a4hue)" }) + circle(x + 90, y + 133, 7, { fill: C.white, stroke: "#999" }) +
    rect(x + 12, y + 156, w - 24, 28, { r: 4, fill: C.white, stroke: "#c4c7c5" }) + text(x + w / 2, y + 175, hex, { size: 13, fill: C.crText, anchor: "middle", mono: true });
}

// =====================================================================================================================
// Gaya: Huruf / Bentuk
const TYPE = '<path d="M12 4v16"/><path d="M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"/><path d="M9 20h6"/>';
const SHAPE_ICON = ['<rect x="5" y="3" width="14" height="18" rx="5"/>', '<rect x="5" y="3" width="14" height="18"/>', '<path d="M5 21V10a7 7 0 0 1 14 0v11z"/>'];
const MOTION_ICON = ['<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>', '<path d="M2 12c.6.5 1.2 1 2.5 1C7 13 7 11 9.5 11c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
  '<path d="M9.94 15.5a2 2 0 0 0-1.44-1.44l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 9.94a2 2 0 0 0 1.44-1.44l1.58-6.13a.5.5 0 0 1 .96 0l1.58 6.13a2 2 0 0 0 1.44 1.44l6.13 1.58a.5.5 0 0 1 0 .96l-6.13 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.13a.5.5 0 0 1-.96 0z"/>'];
const ff = (name, cat = "serif") => `'${name}',${cat}`;
const PLAYFAIR = ff("Playfair Display");
// Kencana font pairs (template.json options.fontPairs; model.js FONT_PAIRS): [name, heading, body, heading css, body css].
const PAIRS = [["Walnut", "MonteCarlo", "Tinos", SCRIPT, SERIF], ["Romantis", "Great Vibes", "Lora", ff("Great Vibes", "cursive"), ff("Lora")],
  ["Tradisi", "Rochester", "Nunito", ff("Rochester", "cursive"), ff("Nunito", "sans-serif")], ["Anggun", "Dynalight", "Nunito", ff("Dynalight", "cursive"), ff("Nunito", "sans-serif")]];
const sample = (y, hf, bf = SERIF, size = 26) => rect(PX + 0.5, y + 0.5, PW - 1, 77, { r: 4, fill: C.white, stroke: C.line }) +
  text(PX + 12, y + 38, "Rani & Dimas", { size, fill: C.strong, font: hf }) + text(PX + 12, y + 62, "Minggu, 14 Februari 2027 pukul 08.00 WIB", { size: 12, fill: C.text, font: bf });
const pairCard = (y, [n, h, b, hf, bf], on, def) => rect(PX + 0.5, y + 0.5, PW - 1, 107, { r: 4, fill: C.white, stroke: on ? C.primary : C.line, sw: on ? 2 : 1 }) +
  text(PX + 12, y + 38, "Rani & Dimas", { size: 28, fill: C.strong, font: hf }) + text(PX + 12, y + 60, "Minggu, 14 Februari 2027 pukul 08.00 WIB", { size: 12, fill: C.text, font: bf }) +
  para(PX + 12, y + 82, def ? [`${n}: ${h} + ${b}`, "(bawaan Kencana)"] : [`${n}: ${h} + ${b}`], { size: 12, fill: C.faint, lh: 16 });
const FONT_LINK = "https://fonts.google.com/specimen/Playfair+Display";
// Huruf panel (panels-style.jsx TypePanel), without the sub-tabs. o: big (Besar), bold (Ketebalan teks Tebal),
// pair (index), font ("check" while weights are probed, "done" after). Returns [svg, positions].
function huruf(o = {}) {
  let y = BY + 54, s = white(72, BY + 38, 314, 1600); const pos = {};
  const p = PAIRS[o.pair ?? 0], hf = o.font ? PLAYFAIR : p[3];
  if (o.big || o.bold || o.font) { s += resetBox(y); y += 62; }
  s += nkH3(PX, y + 12, "Ukuran teks") + (o.big ? changed(PX + 76, y + 12) : ""); y += 24;
  pos.scale = y; s += segIcons(PX, y, PW, [{ label: "Kecil", svg: TYPE, size: 14 }, { label: "Normal", svg: TYPE }, { label: "Besar", svg: TYPE, size: 24 }], o.big ? 2 : 1); y += 58;
  s += nkH3(PX, y + 12, "Ketebalan") + (o.bold ? changed(PX + 66, y + 12) : ""); y += 24;
  s += para(PX, y + 12, ["Hanya ketebalan yang dimiliki font yang", "dipakai."], { size: 12, fill: C.faint, lh: 16 }); y += 44;
  if (o.font === "done") { s += text(PX, y + 12, "Ketebalan judul", { size: 12, weight: 500 }) + nkInput(PX, y + 20, PW, "Normal (400)", { select: true }); y += 68; }
  pos.weight = y; s += text(PX, y + 12, "Ketebalan teks", { size: 12, weight: 500 }) + nkInput(PX, y + 20, PW, o.bold ? "Tebal (700)" : "Normal (400)", { select: true }); y += 68;
  s += sample(y, hf, p[4]); y += 86;
  s += nkH3(PX, y + 12, "Custom") + (o.font ? changed(PX + 52, y + 12, "dipakai") : ""); y += 24;
  s += para(PX, y + 12, ["Pilih font di Google Fonts, salin link halaman", "fontnya, lalu tempel di sini."], { size: 12, fill: C.faint, lh: 16 }); y += 44;
  pos.gf = y; s += nkBtn(PX, y, "Buka Google Fonts", { variant: "ghost", w: PW, icon: "external-link" }); y += 48;
  pos.font = y;
  s += o.font ? text(PX, y + 12, "Font judul dan nama: ", { size: 12, weight: 500 }) + text(PX + 123, y + 12, "Playfair Display", { size: 12, weight: 700, font: PLAYFAIR }) : text(PX, y + 12, "Font judul dan nama", { size: 12, weight: 500 });
  s += o.font ? nkInput(PX, y + 20, PW, "", {}) + clipped(PX + 10, y + 20, PW - 20, 36, text(PX + 10, y + 43, FONT_LINK, { size: 14 })) : nkInput(PX, y + 20, PW, "Tempel link Google Fonts", { placeholder: true });
  y += 56; if (o.font === "check") { s += text(PX, y + 20, "Memeriksa ketebalan yang tersedia…", { size: 12, fill: C.faint }); y += 20; } y += 12;
  s += text(PX, y + 12, "Font teks", { size: 12, weight: 500 }) + nkInput(PX, y + 20, PW, "Tempel link Google Fonts", { placeholder: true }); y += 68;
  if (o.font) { s += sample(y, PLAYFAIR, p[4], 24); y += 86; pos.back = y; s += quiet(PX, y, "Kembali ke pasangan bawaan"); y += 48; }
  s += nkH3(PX, y + 20, "Pasangan font"); y += 32; pos.pairs = y;
  PAIRS.forEach((q, i) => (s += pairCard(y + i * 116, q, i === (o.font ? -1 : o.pair ?? 0), i === 0)));
  return [s, pos];
}
// Gaya panel top (header + sub-tabs) drawn over a scrolled pane.
const gayaTop = (active, dots = [], sb = 300) => nkHead(0, 0, "Gaya") + line(72, 153, 399, 153, { stroke: C.line }) + white(72, 154, 327, BY + 46 - 154) + subtabs(active, dots) + scrollbar(157, sb);
const hurufTabs = (dots) => gayaTop(1, dots);
// Bentuk tab (Bentuk sudut + Gerak saat digulir); Kencana defaults: Lengkung (2), Halus (1).
function bentuk(shape = 2, motion = 1) {
  const diff = shape !== 2 || motion !== 1;
  let y = BY + 54, s = white(72, 154, 314, 746) + subtabs(2, diff ? [2] : []) + (diff ? resetBox(y) : ""); y += diff ? 62 : 0;
  s += nkH3(PX, y + 12, "Bentuk") + (shape !== 2 ? changed(PX + 50, y + 12) : ""); y += 24;
  s += segIcons(PX, y, PW, ["Lembut", "Tegas", "Lengkung"].map((label, i) => ({ label, svg: SHAPE_ICON[i] })), shape); y += 58;
  s += nkH3(PX, y + 12, "Gerak") + (motion !== 1 ? changed(PX + 44, y + 12) : ""); y += 24;
  s += segIcons(PX, y, PW, ["Tanpa", "Halus", "Hidup"].map((label, i) => ({ label, svg: MOTION_ICON[i] })), motion); y += 38;
  s += text(PX, y + 16, "Bagian muncul pelan saat tamu menggulir.", { size: 12, fill: C.faint });
  return s;
}
// Seg centres: Bentuk row and Gerak row, before and after the Gaya diubah box (62 px).
const SEG = (row, diff) => BY + 54 + (diff ? 62 : 0) + 24 + row * 82 + 19;

// =====================================================================================================================
// Musik (panels-structure.jsx AudioPanel); the panel does not scroll here, so the body is 294 wide.
const AW = 294;
function musik(o = {}) {
  let y = BY, s = white(72, 154, 327, 746);
  s += text(PX, y + 12, "Tautan lagu", { size: 12, weight: 500 }) + nkInput(PX, y + 20, AW, o.link ? (o.linkVal ? "https://youtu.be/AbCdEf12345" : "") : "https://youtu.be/...", { placeholder: !o.linkVal, focus: o.focusLink }) +
    text(PX, y + 76, "YouTube, atau .mp3 dari hosting lain.", { size: 12, fill: C.faint });
  y += 92;
  s += text(PX, y + 12, "Mulai dari", { size: 12, weight: 500 }) + nkInput(PX, y + 20, AW, o.start ? (o.startVal ? "1:05" : "") : "0:00", { placeholder: !o.startVal, focus: o.focusStart });
  y += 68;
  if (o.link) {
    s += rect(PX + 0.5, y + 0.5, AW - 1, 217, { r: 8, fill: C.page, stroke: C.line });
    s += o.playing ? rect(PX + 1, y + 1, AW - 2, 164, { fill: "#0f0f0f" }) + rect(PX + 12, y + 150, AW - 24, 3, { r: 1.5, fill: "rgba(255,255,255,.3)" }) + rect(PX + 12, y + 150, 64, 3, { r: 1.5, fill: "#ff0033" }) + circle(PX + 76, y + 151.5, 5, { fill: "#ff0033" }) +
      [0, 1, 2, 3, 4].map((i) => rect(PX + AW / 2 - 22 + i * 10, y + 70 - [10, 22, 16, 28, 12][i] / 2, 6, [10, 22, 16, 28, 12][i], { r: 2, fill: "rgba(255,255,255,.8)" })).join("")
      : clipped(PX + 1, y + 1, AW - 2, 164, couple(PX + 1, y - 10, AW - 2, 190), rect(PX + 1, y + 1, AW - 2, 164, { fill: "rgba(34,53,72,.35)" })) +
        rect(PX + AW / 2 - 30, y + 62, 60, 42, { r: 12, fill: "rgba(0,0,0,.6)" }) + `<path d="M${PX + AW / 2 - 7} ${y + 73} l18 10 l-18 10 z" fill="#fff"/>`;
    const label = o.playing ? "Hentikan" : `Coba putar dari ${o.start ? "1:05" : "0:00"}`;
    s += nkBtn(PX + 11, y + 173, label, { icon: o.playing ? "close" : "play" });
    y += 230;
  }
  const t1 = y;
  s += text(PX, y + 25, "Putar saat undangan dibuka", { size: 14, fill: C.text }) + nkSwitch(PX + AW - 36, y + 10, true); y += 48;
  s += text(PX, y + 25, "Ulang terus", { size: 14, fill: C.text }) + nkSwitch(PX + AW - 36, y + 10, true); y += 48;
  if (o.link) s += quiet(PX, y, "Hapus musik", { size: 14, w: 108 });
  return [s, t1];
}

// =====================================================================================================================
// Lapisan (SectionPanel): rows of 50 from y 197.
const SECS = ["Sampul", "Salam Pembuka", "Ayat / Kutipan", "Profil Mempelai", "Kisah Cinta", "Simpan Tanggal", "Hitung Mundur", "Galeri Foto", "Video", "Rangkaian Acara", "Dress Code",
  "Susunan Acara", "RSVP & Ucapan", "Siaran Langsung", "Filter Kamera", "Amplop Digital", "Aturan Tamu", "Turut Mengundang", "Salam Penutup", "Kaki Halaman"];
const ROW0 = 197, rowY = (i) => ROW0 + i * 50;
function secRow(i, name, o = {}) {
  const y = rowY(i);
  let s = white(PX, y, PW, 50) + line(PX, y + 49.5, PX + PW, y + 49.5, { stroke: C.line });
  const small = o.locked ? (o.locked === "first" ? "Selalu pertama" : "Selalu terakhir") : o.off ? "Disembunyikan" : "";
  s += small ? text(95, y + 22, name, { size: 14 }) + text(95, y + 39, small, { size: 12, fill: C.faint }) : text(95, y + 30, name, { size: 14 });
  if (o.locked) return s + icon("lock", 353, y + 25, 14, C.faint);
  return s + `<g opacity="${o.upOff ? 0.35 : 1}">${icon("chevron-up", 270, y + 25, 18, C.text)}</g><g opacity="${o.downOff ? 0.35 : 1}">${icon("chevron-down", 304, y + 25, 18, C.text)}</g>` + nkSwitch(324, y + 15, !o.off);
}
const rowOpts = (i, n, last) => (i === 0 ? { locked: "first" } : i === last ? { locked: "last" } : { upOff: i === 1, downOff: i === last - 1 });
// Whole list for an order (o.off: hidden section, o.button: Kembalikan urutan template, o.dock: Menu bawah on).
function lapList(order, o = {}) {
  const last = order.length - 1, pos = {};
  let s = white(72, 154, 327, 1500) + text(PX, BY + 12, "Bagian kosong tidak tampil.", { size: 12, fill: C.faint }) +
    order.map((n, i) => secRow(i, n, n === o.off ? { off: true } : rowOpts(i, n, last))).join("");
  let y = rowY(order.length) + 12;
  if (o.button) { pos.btn = y; s += quiet(PX, y, "Kembalikan urutan template"); y += 48; }
  pos.dock = y; s += text(PX, y + 25, "Menu bawah", { size: 14, fill: C.text }) + nkSwitch(PX + PW - 36, y + 10, o.dock !== false);
  return [s, pos];
}
const swap = (a, i) => { const b = a.slice(); [b[i], b[i + 1]] = [b[i + 1], b[i]]; return b; };
// Preview, scrolled to the gallery: Galeri Foto, Video, Rangkaian Acara blocks of the Kencana page.
const secTitle = (y, t) => text(SC.x + SC.w / 2, y, t, { size: 40, fill: KENCANA.heading, anchor: "middle", font: SCRIPT });
const galeriSec = (y) => rect(SC.x, y, SC.w, 300, { fill: KENCANA.bg }) + secTitle(y + 62, "Galeri Foto") +
  [0, 1, 2, 3].map((k) => photo(SC.x + 30 + (k % 2) * 170, y + 88 + Math.floor(k / 2) * 100, 160, 92, k + 4)).join("");
const videoSec = (y) => rect(SC.x, y, SC.w, 280, { fill: KENCANA.bg }) + secTitle(y + 62, "Video") + rect(SC.x + 30, y + 88, 330, 168, { r: 6, fill: "#1f1a17" }) +
  rect(SC.x + 165, y + 151, 60, 42, { r: 12, fill: "rgba(255,255,255,.18)" }) + `<path d="M${SC.x + 188} ${y + 162} l18 10 l-18 10 z" fill="#fff"/>`;
const acaraSec = (y) => rect(SC.x, y, SC.w, 300, { fill: KENCANA.bg }) + secTitle(y + 62, "Rangkaian Acara") + rect(SC.x + 30.5, y + 88.5, 329, 170, { r: 12, fill: KENCANA.surface, stroke: "#ead8cf" }) +
  text(SC.x + SC.w / 2, y + 128, "Akad Nikah", { size: 22, weight: 700, fill: KENCANA.heading, anchor: "middle", font: SERIF }) +
  text(SC.x + SC.w / 2, y + 160, "Minggu, 14 Februari 2027", { size: 15, fill: KENCANA.text, anchor: "middle", font: SERIF }) +
  text(SC.x + SC.w / 2, y + 184, "08.00 WIB", { size: 15, fill: KENCANA.text, anchor: "middle", font: SERIF }) +
  rect(SC.x + 125, y + 206, 140, 36, { r: 18, fill: KENCANA.accent }) + text(SC.x + SC.w / 2, y + 229, "Lihat Lokasi", { size: 14, fill: C.white, anchor: "middle", font: SERIF });
const dressSec = (y) => rect(SC.x, y, SC.w, 300, { fill: KENCANA.bg }) + secTitle(y + 62, "Dress Code");
const stack = (list) => { let y = SC.y; return screen(rect(SC.x, SC.y, SC.w, SC.h, { fill: KENCANA.bg }), ...list.map((f) => { const s = f(y); y += f === videoSec ? 280 : 300; return s; })); };

// =====================================================================================================================
// Klik di pratinjau: the page under the cover (Salam Pembuka, Ayat / Kutipan, Mempelai).
const PAGE_DY = 560; // scroll so Salam Pembuka sits at y 330
const salamSec = (y) => rect(SC.x, y, SC.w, 420, { fill: KENCANA.bg }) + cloud(SC.x + SC.w / 2, y + 56, KENCANA.accent) +
  text(SC.x + SC.w / 2, y + 128, "Assalamu'alaikum Warahmatullahi", { size: 17, weight: 700, fill: KENCANA.heading, anchor: "middle", font: SERIF }) +
  text(SC.x + SC.w / 2, y + 152, "Wabarakatuh", { size: 17, weight: 700, fill: KENCANA.heading, anchor: "middle", font: SERIF }) +
  para(SC.x + SC.w / 2, y + 200, ["Dengan memohon rahmat dan ridho Allah SWT,", "kami bermaksud melangsungkan pernikahan.", "Merupakan kehormatan bagi kami apabila", "Bapak/Ibu/Saudara/i berkenan hadir dan", "memberikan doa restu."], { size: 15, fill: KENCANA.text, anchor: "middle", lh: 26 }).replace(/<text /, `<text font-family="${SERIF}" `);
const ayatSec = (y) => rect(SC.x, y, SC.w, 330, { fill: KENCANA.bg }) + rect(SC.x + 30.5, y + 30.5, 329, 260, { r: 12, fill: KENCANA.surface, stroke: "#ead8cf" }) +
  para(SC.x + SC.w / 2, y + 92, ["Dan di antara tanda-tanda kekuasaan-Nya", "ialah Dia menciptakan untukmu pasangan", "hidup dari jenismu sendiri, supaya kamu", "merasa tenteram kepadanya."], { size: 15, fill: KENCANA.text, anchor: "middle", lh: 26 }).replace(/<text /, `<text font-family="${SERIF}" font-style="italic" `) +
  text(SC.x + SC.w / 2, y + 230, "QS. Ar-Rum: 21", { size: 15, weight: 700, fill: KENCANA.heading, anchor: "middle", font: SERIF });
const mempelaiSec = (y) => rect(SC.x, y, SC.w, 500, { fill: KENCANA.bg }) + text(SC.x + SC.w / 2, y + 70, "Mempelai", { size: 48, fill: KENCANA.heading, anchor: "middle", font: SCRIPT }) +
  clipPath(`M${SC.x + 105} ${y + 340} V${y + 180} a90 90 0 0 1 180 0 V${y + 340} Z`, photo(SC.x + 105, y + 90, 180, 250, 2)) + `<path d="M${SC.x + 105} ${y + 340} V${y + 180} a90 90 0 0 1 180 0 V${y + 340} Z" fill="none" stroke="${KENCANA.accent}" stroke-width="2"/>`;
// Preview toolbar (canvas.js): dark bar, 3px padding, 2px gaps, 30px buttons with 10px side padding, 12px/500 white.
function toolbar(right, top, actions, hover) {
  const bw = actions.map((a) => Math.max(32, tw(a, 12, 500) + 20)), w = 6 + bw.reduce((a, b) => a + b, 0) + 2 * (actions.length - 1);
  let x = right - w - 6, s = rect(x, top + 3, w, 36, { r: 6, fill: "rgba(0,0,0,.18)" }) + rect(x, top, w, 36, { r: 6, fill: C.strong }); const at = {};
  let bx = x + 3;
  actions.forEach((a, i) => {
    if (a === hover) s += rect(bx, top + 3, bw[i], 30, { r: 4, fill: C.primary });
    s += a === "↑" || a === "↓" ? text(bx + bw[i] / 2, top + 23, a, { size: 14, weight: 500, fill: C.white, anchor: "middle" }) : text(bx + bw[i] / 2, top + 22, a, { size: 12, weight: 500, fill: C.white, anchor: "middle" });
    at[a] = [bx + bw[i] / 2, top + 18]; bx += bw[i] + 2;
  });
  return [s, at];
}
const frame = (y, h, sw) => rect(SC.x + sw / 2, Math.max(SC.y, y) + sw / 2, SC.w - sw, h - sw, { r: 2, stroke: C.primary, sw });
const hoverTag = (x, y, label) => { const w = tw(label, 12, 500) + 16; return rect(x, y, w, 22, { r: 4, fill: C.primary }) + rect(x, y + 12, w, 10, { fill: C.primary }) + text(x + 8, y + 15, label, { size: 12, weight: 500, fill: C.white }); };

// =====================================================================================================================
// Dijeda: code view (Scalev Code tab, generic editor; the reveal selects the hand-edited lines).
const CODE = ['<section data-nk-section="cover">', '  <div class="nk-cover__inner">', '    <p class="nk-kicker">The Wedding Of</p>', '    <h1 class="nk-names">Rani &amp; Dimas</h1>',
  '    <p class="nk-note">Teks tambahan manual</p>', '    <p class="nk-date">Minggu, 14 Februari 2027</p>', "  </div>", "</section>", '<section data-nk-section="opening">', '  <div class="nk-opening">'];
function codeView() {
  let s = rect(0, 92, 399, 808, { fill: C.white });
  CODE.forEach((l, i) => {
    const y = 120 + i * 22;
    if (i === 4) s += rect(40, y - 15, 359, 22, { fill: "#cfe3fb" });
    s += text(30, y, String(i + 1), { size: 12, fill: "#9aa3ad", anchor: "end", mono: true }) + text(44, y, l.replace("&amp;", "&").replace(/^ +/, (m) => "\u00a0".repeat(m.length)), { size: 12, fill: i === 4 ? C.strong : "#3b4a5a", mono: true });
  });
  return clipped(0, 92, 399, 808, s);
}
const driftBanner = () => rect(PX, BY, PW, 126, { r: 4, fill: C.warnSoft }) + `<text x="${PX + 12}" y="${BY + 23}" font-size="12" fill="${C.warnStrong}"><tspan font-weight="700">Kode diubah di tab Code.</tspan> NikahKit dijeda.</text>` +
  quiet(PX + 12, BY + 36, "Lihat di kode", { icon: "code-xml" }) + nkBtn(PX + 12, BY + 80, "Timpa dengan NikahKit");
const footStatus = (label, color) => rect(0, 852, 71, 48, { fill: C.page }) + circle(36, 868, 4, { fill: color }) + text(36, 888, label, { size: 10, fill: C.text, anchor: "middle" });

const typed = (id, x, y, s) => ({ id, n: s.length, box: [x, y, tw(s, 14) + 4, 22] });
const tooltip = (x, y, s) => rect(x, y, tw(s, 12) + 16, 24, { r: 3, fill: "#f8f8f8", stroke: "#bdbdbd" }) + text(x + 8, y + 16, s, { size: 12, fill: C.strong });

const accTitles = (y0) => KGROUPS.map((g, i) => nkAcc(PX, y0 + i * 58, PW, g, { badge: i < 3 ? "Terisi" : undefined })).join("");
const kontenClosed = () => white(72, 154, 327, 746) + kontenTop() + accTitles(GROUPS_Y) + scrollbar(157, 300);
// Mempelai Pria fields (Urungkan / Kosongkan); nick = the Nama panggilan value.
const priaCol = (nick) => column([{ h3: "Mempelai Pria" }, { label: "Nama panggilan", value: nick, hint: "Tampil di sampul." }, { label: "Nama lengkap dan gelar", value: "Dimas Pratama, S.T." },
  { label: "Profesi atau bio singkat (opsional)", value: "Arsitek" }, { label: "Anak ke- (opsional)", value: "Putra pertama" }, { label: "Nama ayah", value: "Bapak Hasan" },
  { toggle: "Ayah sudah wafat (Alm.)", on: false }, { label: "Nama ibu", value: "Ibu Aminah" }, { toggle: "Ibu sudah wafat (Almh.)", on: false }], ACC_X, 169, ACC_W);
const priaPanel = (nick) => white(72, 154, 327, 746) + accFrame(154, 900) + priaCol(nick)[0] + scrollbar(380, 200);
const NICK_Y = priaCol("Dimas")[1]["Nama panggilan"] + 20;
const nickFix = (nick) => white(ACC_X + 1, NICK_Y + 1, ACC_W - 2, 34) + text(ACC_X + 10, NICK_Y + 23, nick, { size: 14 }) + coverScreen({ names: `Rani & ${nick}` });

const SCENES = {
  // ------------------------------------------------------------------------------------------- Media A: unggah banyak foto
  "editor-media-unggah": {
    title: "Mengunggah banyak foto lewat menu Media",
    world: { x: 0, y: 92, w: 727, h: 808 }, // rail + panel + the file window (the preview does not change)
    base: [shell("Template", "Template"), templatePanel(), scrollbar(157, 360), coverScreen()],
    els: {
      media: { svg: railPanel("Media", "Media") + mediaBody("Atau seret ke sini.", OLD), enter: "fade" },
      win: { svg: fileWindow(false), enter: "pop", origin: [FW.x, FW.y] },
      winSel: { svg: fileWindow(true), enter: "fade", delay: 1.0 },
      busy1: { svg: mediaBody("Mengunggah 1 dari 4...", OLD, { busy: true }), enter: "fade" },
      up1: { svg: tile(0, 4), enter: "pop", delay: 0.8 },
      busy2: { svg: white(PX, BY + 40, PW, 20) + text(PX, BY + 54, "Mengunggah 2 dari 4...", { size: 12, fill: C.faint }), enter: "fade", delay: 0.9 },
      up2: { svg: tile(0, 1) + tile(1, 4), enter: "pop", delay: 1.7 },
      done: { svg: mediaBody("Atau seret ke sini.", [3, 8, 1, 4, ...OLD]), enter: "fade" }
    },
    steps: [
      { caption: "Buka menu Media: klik Media di rel kiri.", at: ED.rail.Media, click: true, show: ["media"] },
      { caption: "Klik Unggah foto, lalu pilih beberapa foto (tahan Ctrl atau Cmd).", at: [PX + PW / 2, BY + 18], click: true, show: ["win", "winSel"], dur: 3.8 },
      { caption: "Klik Buka, lalu tunggu. Foto diunggah satu per satu: Mengunggah 1 dari 4...", at: BUKA, click: true, hide: ["win", "winSel"], show: ["busy1", "up1", "busy2", "up2"], dur: 4 },
      { caption: "Selesai: semua foto baru tampil paling depan di grid Media.", at: [PX + 140, MEDIA_Y + 45], hide: ["busy1", "up1", "busy2", "up2"], show: ["done"], dur: 3.4 }
    ]
  },

  // ------------------------------------------------------------------------------------------- Media B: Pilih foto di form
  "editor-media-pilih-foto": (() => {
    const accY = GROUPS_Y + 58, FOTO_AT = 170; // Mempelai bar; the Foto label lands at the top of the panel body after scrolling
    const [col, p] = column([{ label: "Judul", placeholder: "Mempelai" }, { label: "Urutan nama", value: "Wanita dulu", select: true }, { h3: "Mempelai Wanita" },
      { label: "Nama panggilan", value: "Rani", hint: "Tampil di sampul." }, { label: "Nama lengkap dan gelar", value: "Rani Ayu, S.Psi." }, { label: "Profesi atau bio singkat (opsional)", value: "Psikolog" },
      { label: "Anak ke- (opsional)", value: "Putri kedua" }, { label: "Nama ayah", value: "Bapak Ahmad" }, { toggle: "Ayah sudah wafat (Alm.)", on: false }, { label: "Nama ibu", value: "Ibu Siti" },
      { toggle: "Ibu sudah wafat (Almh.)", on: true }, { photo: "Foto" }, { label: "Kota asal", value: "Jakarta" }, { label: "Media sosial", value: "@rani.ayu", hint: "@nama dibuka di Instagram." },
      { h3: "Mempelai Pria" }, { label: "Nama panggilan", key: "pria", value: "Dimas" }], ACC_X, accY + 58, ACC_W);
    const open = white(72, 154, 314, 1800) + kontenTop() + nkAcc(PX, GROUPS_Y, PW, "Sampul", { badge: "Terisi" }) + nkAcc(PX, accY, PW, "Mempelai", { badge: "Terisi", open: true }) +
      line(88, accY + 49.5, 367, accY + 49.5, { stroke: C.line }) + accFrame(accY, p.end + 20) + col;
    const dy = p.photo - FOTO_AT;
    const [col2, p2] = column([{ photo: "Foto", url: 6 }, { label: "Kota asal", value: "Jakarta" }, { label: "Media sosial", value: "@rani.ayu", hint: "@nama dibuka di Instagram." }, { h3: "Mempelai Pria" },
      { label: "Nama panggilan", value: "Dimas", hint: "Tampil di sampul." }, { label: "Nama lengkap dan gelar", value: "Dimas Pratama, S.T." }, { label: "Profesi atau bio singkat (opsional)", value: "Arsitek" }], ACC_X, FOTO_AT, ACC_W);
    const picked = white(72, 154, 314, 746) + accFrame(154, 900) + col2;
    // Pilih foto dialog (App.jsx MediaDialog), panel-wide.
    const DX = 16, DW = 352, gy = 297, gs = (DW - 12) / 3;
    const dthumb = (i) => photo(DX + (i % 3) * (gs + 6), gy + Math.floor(i / 3) * (gs + 6), gs, gs, i);
    const dlg = nkDialogHead(0, 0, "Pilih foto") + nkBtn(DX, BY, "Unggah foto", { variant: "ghost", w: DW, icon: "upload", size: 14 }) +
      text(DX, 229, "Atau tempel tautan https", { size: 12, weight: 500 }) + nkInput(DX, 237, DW - 72, "https://...", { placeholder: true }) +
      `<g opacity=".5">${nkBtn(DX + DW - 66, 237, "Pakai", { variant: "ghost", w: 66, size: 14 })}</g>` +
      clipped(DX, gy, DW, 839 - gy, ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2].map((k, i) => dthumb(i))) + line(0, 839.5, 399, 839.5, { stroke: C.line }) + rect(0, 840, 399, 60, { fill: C.white }) + scrollbar(157, 420);
    const pakai = (on) => `<g opacity="${on ? 1 : 0.5}">${nkBtn(DX, 852, "Pakai foto", { w: 367, size: 14 })}</g>`;
    const selX = DX + 2 * (gs + 6), selY = gy + (gs + 6);
    const ALT = "Rani tersenyum di taman";
    return {
      title: "Memasang foto lewat tombol Pilih foto",
      world: PANEL,
      base: [shell("Konten", "Konten"), white(72, 154, 327, 746), kontenTop(), accTitles(GROUPS_Y), scrollbar(157, 300), coverScreen()],
      els: {
        open: { svg: open, enter: "fade" },
        hdr: clipped(72, 0, 327, 154, scalevEditor(0, 0, { rail: "Konten" })) + nkHead(0, 0, "Konten") + line(72, 153, 399, 153, { stroke: C.line }),
        dlg: { svg: dlg + pakai(false), enter: "pop", origin: [150, FOTO_AT + 38] },
        sel: { svg: rect(selX + 1, selY + 1, gs - 2, gs - 2, { r: 4, stroke: C.primary, sw: 2 }) + circle(selX + gs - 12, selY + 12, 8, { fill: C.action }) + iconX("check", selX + gs - 12, selY + 12, 10, C.white, 3) + pakai(true), enter: "fade" },
        picked: { svg: nkRail(0, 0, "Konten") + picked, enter: "fade" },
        alt: { svg: text(ACC_X + 20, p2.alt + 23, ALT, { size: 14 }), enter: "fade" },
        altFocus: { svg: rect(ACC_X + 10.5, p2.alt + 0.5, ACC_W - 21, 35, { r: 4, stroke: C.primary, sw: 2 }), enter: "fade" },
        top: { svg: rect(ACC_X + 10.5, p2.alt + 0.5, ACC_W - 21, 35, { r: 4, stroke: C.white, sw: 3 }) + rect(ACC_X + 10.5, p2.alt + 0.5, ACC_W - 21, 35, { r: 4, stroke: C.field }) + rect(ACC_X + 10, p2.focus, ACC_W - 20, 38, { fill: C.page }) + focusSeg(ACC_X + 10, p2.focus, ACC_W - 20, 0), enter: "fade" }
      },
      steps: [
        { caption: "Di Konten, klik kelompok yang punya foto, misalnya Mempelai.", at: [200, accY + 25], click: true, show: ["open", "hdr"] },
        { caption: "Gulir ke Foto, lalu klik Pilih foto. Jendela Pilih foto terbuka.", at: [150, FOTO_AT + 38], scroll: { id: "open", dy }, click: true, show: ["dlg"], dur: 3.6 },
        { caption: "Klik satu foto di grid. Foto itu diberi tanda terpilih.", show: ["sel"], at: [selX + gs / 2, selY + gs / 2], click: true, dur: 3.4 },
        { caption: "Klik Pakai foto. Foto terpasang dan tombolnya menjadi Ganti foto.", at: [200, 870], click: true, hide: ["dlg", "sel"], show: ["picked"], dur: 3.6 },
        { caption: "Klik Deskripsi foto, lalu tulis kalimat pendek tentang isi foto.", at: [230, p2.alt + 18], click: true, show: ["alt", "altFocus"], type: [typed("alt", ACC_X + 20, p2.alt + 8, ALT)], dur: 3.8 },
        { caption: "Wajah terpotong di undangan? Di Titik fokus, klik Atas.", at: [ACC_X + 10 + (ACC_W - 20) / 10, p2.focus + 19], click: true, show: ["top"], dur: 3.6 }
      ]
    };
  })(),

  // ------------------------------------------------------------------------------------------- Musik
  "editor-musik-youtube": (() => {
    const [A] = musik(), [B] = musik({ link: true, linkVal: true, focusLink: true }), [Cc] = musik({ link: true, linkVal: true, start: true, focusStart: true }), [D, t1] = musik({ link: true, linkVal: true, start: true, startVal: true, playing: true });
    // YouTube watch page with the Bagikan dialog open (generic drawing, YouTube's Indonesian labels), laid out in the
    // crop's 560 px so it reads at full size.
    const SALIN = [452, 356];
    const yt = rect(0, 0, 1440, 900, { fill: C.white }) + rect(24, 62, 30, 21, { r: 6, fill: "#ff0033" }) + `<path d="M35 67 l9 5.5 l-9 5.5 z" fill="#fff"/>` +
      text(60, 80, "YouTube", { size: 18, weight: 700, fill: "#0f0f0f" }) + rect(170.5, 54.5, 360, 38, { r: 19, stroke: "#d3d3d3" }) +
      rect(24, 116, 512, 288, { r: 12, fill: "#0f0f0f" }) + text(24, 440, "Lagu pengiring untuk Rani & Dimas", { size: 18, weight: 700, fill: "#0f0f0f" }) +
      rect(24, 460, 96, 36, { r: 18, fill: "#f2f2f2" }) + icon("share-2", 46, 478, 16, "#0f0f0f") + text(60, 483, "Bagikan", { size: 14, weight: 500, fill: "#0f0f0f" }) +
      rect(0, 0, 1440, 900, { fill: "rgba(0,0,0,.5)" }) + rect(40, 220, 480, 260, { r: 12, fill: C.white }) + text(64, 258, "Bagikan", { size: 16, weight: 700, fill: "#0f0f0f" }) +
      iconX("x", 492, 252, 18, "#0f0f0f") + rect(64.5, 330.5, 432, 51, { r: 12, stroke: "#d3d3d3" }) + text(80, 362, "https://youtu.be/AbCdEf12345", { size: 14, fill: "#0f0f0f" }) +
      rect(SALIN[0] - 36, SALIN[1] - 18, 72, 36, { r: 18, fill: "#065fd4" }) + text(SALIN[0], SALIN[1] + 5, "Salin", { size: 14, weight: 500, fill: C.white, anchor: "middle" }) +
      rect(64.5, 420.5, 17, 17, { r: 3, stroke: "#606060", sw: 2 }) + text(92, 434, "Mulai pada", { size: 14, fill: "#0f0f0f" }) + text(172, 434, "1:05", { size: 14, fill: "#606060" });
    const editor = scalevEditor(0, 0, { rail: "Template" }) + nkHead(0, 0, "Template") + line(72, 153, 399, 153, { stroke: C.line }) + templatePanel() + scrollbar(157, 360) + coverScreen();
    // Simpan / Simpan & Terbitkan sit at the far right of the editor; shown as a labelled inset of that corner.
    const inset = shadow(290, 760, 260, 48, 6, 2) + `<g transform="translate(-890 716)">${clipped(1180, 44, 260, 48, scalevEditor(0, 0, { rail: "Audio" }))}</g>` +
      rect(290.5, 760.5, 259, 47, { r: 6, stroke: C.accent, sw: 2 }) + note(300, 704, "Kanan atas editor Scalev", 420, 760);
    return {
      title: "Memasang musik dari YouTube",
      world: { x: 0, y: 44, w: 560, h: 856 },
      base: [yt],
      els: {
        copied: { svg: rect(24, 820, 248, 48, { r: 8, fill: "#0f0f0f" }) + text(44, 849, "Link disalin ke papan klip", { size: 14, fill: C.white }), enter: "slide" },
        ed: { svg: editor, enter: "fade", delay: 2.0 },
        musik: { svg: railPanel("Audio", "Musik") + A, enter: "fade" },
        b: { svg: B, enter: "fade", delay: 0.3 },
        clear: { svg: white(PX + 1, BY + 21, AW - 2, 34) + rect(PX + 0.5, BY + 20.5, AW - 1, 35, { r: 4, stroke: C.primary, sw: 2 }), enter: "fade" },
        link: { svg: text(PX + 10, BY + 43, "https://youtu.be/AbCdEf12345", { size: 14 }), enter: "fade" },
        c: { svg: Cc, enter: "fade" },
        start: { svg: text(PX + 10, BY + 135, "1:05", { size: 14 }), enter: "fade" },
        d: { svg: D, enter: "fade" },
        sw: { svg: ring(PX + AW - 40, t1 + 6, 44, 76, { r: 14 }), enter: "fade" },
        inset: { svg: inset, enter: "pop", origin: [420, 784] }
      },
      steps: [
        { caption: "Di YouTube, klik Bagikan, lalu Salin. Centang Mulai pada bila perlu.", at: SALIN, click: true, show: ["copied", "ed"], dur: 3.8 },
        { caption: "Kembali ke editor Scalev. Klik Audio di rel kiri, panel Musik terbuka.", at: ED.rail.Audio, click: true, show: ["musik"], dur: 3.4 },
        { caption: "Klik Tautan lagu, lalu tekan Ctrl+V (Mac: Cmd+V).", at: [240, BY + 38], click: true, show: ["b", "clear", "link"], dur: 3.6 },
        { caption: "Isi Mulai dari, contoh 1:05 atau 65 (detik).", at: [200, BY + 130], click: true, show: ["c", "start"], type: [typed("start", PX + 10, BY + 119, "1:05")], dur: 3.4 },
        { caption: "Klik Coba putar dari 1:05 untuk mendengar. Klik Hentikan untuk berhenti.", at: [180, BY + 351], click: true, show: ["d"], dur: 3.8 },
        { caption: "Putar saat undangan dibuka dan Ulang terus sudah menyala. Biarkan.", at: [PX + AW - 18, t1 + 20], show: ["sw"], dur: 3.6 },
        { caption: "Klik Simpan atau Simpan & Terbitkan di kanan atas editor Scalev.", at: [344, 783], press: "inset", hide: ["sw"], show: ["inset"], dur: 3.8 }
      ]
    };
  })(),

  // ------------------------------------------------------------------------------------------- Gaya A: palet siap pakai
  "editor-gaya-palet": (() => {
    const DY = 200, tY = palRowY(0) - DY + 22; // Terakota row centre after scrolling
    return {
      title: "Memilih palet warna siap pakai",
      world: GW,
      base: [shell("Template", "Template"), templatePanel(), scrollbar(157, 360), coverScreen()],
      els: {
        gaya: { svg: railPanel("Gaya", "Gaya"), enter: "fade" },
        pane: { svg: warnaA(), enter: "fade" },
        terra: { svg: `<g transform="translate(0 -${DY})">${warnaA(TERAKOTA, 1)}</g>`, enter: "fade" },
        tabs: { svg: gayaTop(0, [], 380), enter: "fade" },
        prev: { svg: coverScreen({ pal: TERAKOTA }), enter: "fade", delay: 0.3 }
      },
      steps: [
        { caption: "Klik Gaya di rel kiri. Tab Warna terbuka lebih dulu.", at: ED.rail.Gaya, click: true, show: ["gaya", "pane", "tabs"] },
        { caption: "Gulir ke daftar palet. Palet bawaan diberi label Bawaan Kencana.", at: [250, 470], scroll: { id: "pane", dy: DY }, dur: 3.6 },
        { caption: "Klik satu palet, misalnya Terakota. Pratinjau langsung berganti warna.", at: [230, tY], click: true, show: ["terra", "prev"], dur: 3.8 }
      ]
    };
  })(),

  // ------------------------------------------------------------------------------------------- Gaya B: Custom
  "editor-gaya-warna": {
    title: "Mengatur warna sendiri di Custom",
    world: PV,
    base: [shell("Gaya", "Gaya"), subtabs(0), warnaA(), scrollbar(157, 380), coverScreen()],
    els: {
      rows: { svg: ring(PX, 291, PW, 294, { r: 8 }), enter: "fade" },
      pick: { svg: picker("#8E2818"), enter: "pop", origin: [115, PICK.y + PICK.h] },
      b: { svg: warnaB() + scrollbar(157, 330), enter: "fade" },
      gold: { svg: coverScreen({ pal: { accent: GOLD, on: "#111111" } }), enter: "fade", delay: 0.4 },
      warn: { svg: ring(PX, 609, PW, 56, { r: 8 }), enter: "fade" },
      back: { svg: subtabs(0) + warnaA() + scrollbar(157, 380) + coverScreen(), enter: "fade" }
    },
    steps: [
      { caption: "Di Custom ada lima warna: Latar, Kartu, Judul, Teks, Aksen.", at: [300, 440], show: ["rows"], dur: 3.6 },
      { caption: "Klik kotak warna di kiri Aksen. Pemilih warna Chrome terbuka.", at: [115, 558], click: true, hide: ["rows"], show: ["pick"], dur: 3.4 },
      { caption: "Pilih warna. Kodenya tampil di kanan, Custom diberi tanda dipakai.", at: [PICK.x + 190, PICK.y + 40], click: true, hide: ["pick"], show: ["b", "gold"], dur: 3.8 },
      { caption: "Muncul Kurang kontras? Tulisan susah dibaca. Pilih warna lain.", at: [300, 637], show: ["warn"], dur: 3.6 },
      { caption: "Klik Kembali ke palet bawaan untuk membuang warna Custom.", at: [160, 695], click: true, hide: ["warn"], show: ["back"], dur: 3.6 }
    ]
  },

  // ------------------------------------------------------------------------------------------- Gaya C: Huruf dan ukuran teks
  "editor-gaya-huruf": (() => {
    const [H0, P0] = huruf(), [H1, P1] = huruf({ big: true }), [HP] = huruf({ big: true, pair: 1 }), [HB] = huruf({ big: true, pair: 1, bold: true });
    const DY = P1.pairs - 300, wy = P1.weight + 56;
    const wpop = shadow(PX, wy, PW, 72, 4, 2) + rect(PX, wy, PW, 72, { r: 4, fill: C.white, stroke: "#c4c7c5" }) + text(PX + 12, wy + 23, "Normal (400)", { size: 14 }) +
      rect(PX + 1, wy + 36, PW - 2, 32, { fill: C.crBlue }) + text(PX + 12, wy + 57, "Tebal (700)", { size: 14, fill: C.white });
    return {
      title: "Mengatur ukuran teks, pasangan font, dan ketebalan",
      world: PV,
      base: [shell("Gaya", "Gaya"), subtabs(0), warnaA(), coverScreen()],
      els: {
        h0: { svg: H0 + hurufTabs([]), enter: "fade" },
        pane: { svg: H1, enter: "fade" },
        paneP: { svg: `<g transform="translate(0 -${DY})">${HP}</g>`, enter: "fade" },
        wpop: { svg: wpop, enter: "pop", origin: [PX + PW / 2, wy] },
        paneB: { svg: HB, enter: "fade", delay: 1.0 },
        tabs: { svg: hurufTabs([1]), enter: "fade" },
        prevBig: { svg: coverScreen({ scale: 1.15 }), enter: "fade", delay: 0.3 },
        prevPair: { svg: coverScreen({ scale: 1.15, nameFont: PAIRS[1][3], nameSize: 44 }), enter: "fade", delay: 0.3 }
      },
      steps: [
        { caption: "Di menu Gaya, klik tab Huruf.", at: [227, 188], click: true, show: ["h0"] },
        { caption: "Di Ukuran teks, klik ikon Besar bila tamu banyak orang tua.", at: [PX + PW - 30, P0.scale + 19], click: true, show: ["pane", "tabs", "prevBig"], dur: 3.6 },
        { caption: "Gulir ke Pasangan font, lalu klik yang kamu suka, misalnya Romantis.", at: [230, 300 + 116 + 54], scroll: { id: "pane", dy: DY }, click: true, show: ["paneP", "prevPair"], dur: 4.2 },
        { caption: "Di Ketebalan, pilih Ketebalan teks, misalnya Tebal (700).", at: [230, P1.weight + 38], scroll: { id: "paneP", dy: -DY }, click: true, show: ["wpop", "paneB"], dur: 4.2 }
      ]
    };
  })(),

  // ------------------------------------------------------------------------------------------- Gaya D: font dari Google Fonts
  "editor-gaya-font": (() => {
    const [H0, P0] = huruf(), [HC, PC] = huruf({ font: "check" }), [HD, PD] = huruf({ font: "done" });
    const SDY = 150, gx = 420, gy = 310;
    const gfWin = (url, title, body) => shadow(gx, gy, 630, 560, 10, 3) + chrome(gx, gy, 630, 560, { tabs: [{ title, active: true, fav: favChrome, w: 220 }], url }) + body;
    const fontRow = (y, name, font) => rect(gx + 24.5, y + 0.5, 581, 79, { r: 8, stroke: "#dadce0" }) + text(gx + 44, y + 26, name, { size: 13, fill: "#5f6368" }) + text(gx + 44, y + 62, "Rani & Dimas", { size: 26, fill: "#202124", font });
    const home = gfWin("fonts.google.com", "Google Fonts", text(gx + 24, gy + 130, "Google Fonts", { size: 22, fill: "#202124" }) + rect(gx + 24.5, gy + 150.5, 581, 40, { r: 20, fill: "#f1f3f4" }) +
      fontRow(gy + 210, "Playfair Display", PLAYFAIR) + fontRow(gy + 300, "Lora", ff("Lora")) + fontRow(gy + 390, "Great Vibes", ff("Great Vibes", "cursive")));
    const URL = "fonts.google.com/specimen/Playfair+Display";
    const spec = gfWin("", "Playfair Display - Google Fonts", rect(gx + 162, gy + 53, tw(URL, 14) + 8, 22, { r: 3, fill: "#c2dbff" }) + text(gx + 166, gy + 68, URL, { size: 14, fill: C.crText }) +
      text(gx + 24, gy + 150, "Playfair Display", { size: 44, fill: "#202124", font: PLAYFAIR }) + text(gx + 24, gy + 250, "Rani & Dimas", { size: 56, fill: "#202124", font: PLAYFAIR }));
    return {
      title: "Memakai font sendiri dari Google Fonts",
      world: PV,
      base: [shell("Gaya", "Gaya"), subtabs(1), H0, coverScreen()],
      els: {
        gf: { svg: home, enter: "pop", origin: [PX + PW / 2, P0.gf + 18] },
        gf2: { svg: spec, enter: "fade" },
        chk: { svg: HC, enter: "fade" },
        done: { svg: HD, enter: "fade", delay: 1.0 },
        prev: { svg: coverScreen({ nameFont: PLAYFAIR, nameSize: 40 }), enter: "fade", delay: 1.2 },
        back: { svg: H0 + coverScreen(), enter: "fade" },
        tabs1: { svg: hurufTabs([1]), enter: "fade" },
        tabs0: { svg: hurufTabs([]), enter: "fade" }
      },
      steps: [
        { caption: "Di bagian Custom tab Huruf, klik Buka Google Fonts.", at: [PX + PW / 2, P0.gf + 18], click: true, show: ["gf"], dur: 3.4 },
        { caption: "Klik font yang kamu mau, lalu salin alamatnya dari kolom alamat Chrome.", at: [gx + 300, gy + 250], click: true, show: ["gf2"], dur: 3.8 },
        { caption: "Kembali ke Scalev. Tempel di Font judul dan nama.", at: [230, PC.font + 38], click: true, hide: ["gf", "gf2"], show: ["chk", "tabs1"], dur: 3.4 },
        { caption: "Tunggu Memeriksa ketebalan... Lalu nama font tampil di label kolom.", at: [230, PD.font + 12], show: ["done", "prev"], dur: 3.8 },
        { caption: "Klik Kembali ke pasangan bawaan untuk membuang font Custom.", at: [PX + 90, PD.back - SDY + 18], scroll: { id: "done", dy: SDY }, click: true, hide: ["tabs1"], show: ["back", "tabs0"], dur: 3.8 }
      ]
    };
  })(),

  // ------------------------------------------------------------------------------------------- Gaya E: Bentuk dan Gerak
  "editor-gaya-bentuk": {
    title: "Mengatur bentuk sudut dan gerak saat digulir",
    world: PV,
    base: [shell("Gaya", "Gaya"), subtabs(0), warnaA(), coverScreen()],
    els: {
      b0: { svg: bentuk(), enter: "fade" },
      b1: { svg: bentuk(0), enter: "fade" },
      prevSoft: { svg: coverScreen({ shape: "soft" }), enter: "fade", delay: 0.3 },
      b2: { svg: bentuk(0, 2), enter: "fade" }
    },
    steps: [
      { caption: "Di menu Gaya, klik tab Bentuk.", at: [320, 188], click: true, show: ["b0"] },
      { caption: "Klik Lembut: sudut tombol, kartu, dan bingkai foto jadi membulat.", at: [128, SEG(0, false)], click: true, show: ["b1", "prevSoft"], dur: 3.8 },
      { caption: "Di Gerak pilih Tanpa, Halus, atau Hidup. Hidup bergerak lebih jauh.", at: [PX + PW - 30, SEG(1, true)], click: true, show: ["b2"], dur: 3.8 }
    ]
  },

  // ------------------------------------------------------------------------------------------- Lapisan
  "editor-lapisan-urutan": (() => {
    const O1 = swap(SECS, 7), O2 = swap(O1, 8), DY = 570; // Video up; then Galeri Foto down
    const [L0] = lapList(SECS), [L1] = lapList(O1, { button: true }), [L2, Q2] = lapList(O2, { button: true }), [L3] = lapList(O2, { off: "Video", button: true });
    const [R, QR] = lapList(SECS), [R2] = lapList(SECS, { dock: false });
    const up = (svg) => `<g transform="translate(0 -${DY})">${svg}</g>`;
    const P = (list) => ({ svg: stack(list), enter: "fade", delay: 0.4 });
    return {
      title: "Mengatur urutan dan menyembunyikan bagian di Lapisan",
      world: GW,
      base: [shell("Template", "Template"), templatePanel(), scrollbar(157, 360), stack([galeriSec, videoSec, acaraSec])],
      els: {
        lap: { svg: nkRail(0, 0, "Lapisan") + L0 + nkHead(0, 0, "Lapisan"), enter: "fade" },
        l1: { svg: L1, enter: "fade" }, p1: P([videoSec, galeriSec, acaraSec]),
        l2: { svg: L2, enter: "fade" }, p2: P([videoSec, acaraSec, galeriSec]),
        l3: { svg: L3, enter: "fade" }, p3: P([acaraSec, galeriSec, dressSec]),
        l4: { svg: L2, enter: "fade" }, p4: P([videoSec, acaraSec, galeriSec]),
        r: { svg: up(R), enter: "fade" }, p0: P([galeriSec, videoSec, acaraSec]),
        r2: { svg: up(R2), enter: "fade" },
        lhdr: { svg: nkHead(0, 0, "Lapisan") + line(72, 153, 399, 153, { stroke: C.line }), enter: "fade" }
      },
      steps: [
        { caption: "Klik Lapisan di rel kiri. Daftar bagian tampil sesuai urutan undangan.", at: ED.rail.Lapisan, click: true, show: ["lap", "lhdr"], dur: 3.4 },
        { caption: "Klik panah naik di Video. Video naik satu langkah, pratinjau ikut berubah.", at: [270, rowY(8) + 25], click: true, show: ["l1", "p1"], dur: 3.8 },
        { caption: "Klik panah turun di Galeri Foto. Galeri Foto turun satu langkah.", at: [304, rowY(8) + 25], click: true, show: ["l2", "p2"], dur: 3.8 },
        { caption: "Matikan sakelar Video: tertulis Disembunyikan, Video hilang dari pratinjau.", at: [342, rowY(7) + 25], click: true, show: ["l3", "p3"], dur: 3.8 },
        { caption: "Nyalakan lagi sakelarnya. Video tampil lagi dengan isi yang sama.", at: [342, rowY(7) + 25], click: true, show: ["l4", "p4"], dur: 3.6 },
        { caption: "Gulir ke bawah daftar, lalu klik Kembalikan urutan template.", at: [PX + 90, Q2.btn - DY + 18], scroll: { id: "l4", dy: DY }, click: true, show: ["r", "p0"], dur: 4 },
        { caption: "Paling bawah ada sakelar Menu bawah. Matikan bila tidak perlu.", at: [PX + PW - 18, QR.dock - DY + 20], click: true, show: ["r2"], dur: 3.6 }
      ]
    };
  })(),

  // ------------------------------------------------------------------------------------------- Klik di pratinjau (langkah 1-4)
  "editor-klik-pratinjau": (() => {
    const [tbCover] = toolbar(SC.x + SC.w, SC.y + 6, ["Isi"]);
    const [kcol, p] = column([{ label: "Nama panggilan", value: "Rani", hint: "Tampil di sampul.", focus: true }, { label: "Nama lengkap dan gelar", value: "Rani Ayu, S.Psi." },
      { label: "Profesi atau bio singkat (opsional)", value: "Psikolog" }, { label: "Anak ke- (opsional)", value: "Putri kedua", hint: "Kosong: \"Putri dari\" / \"Putra dari\"." },
      { label: "Nama ayah", value: "Bapak Ahmad" }, { toggle: "Ayah sudah wafat (Alm.)", on: false }, { label: "Nama ibu", value: "Ibu Siti" }, { toggle: "Ibu sudah wafat (Almh.)", on: true }], ACC_X, 161, ACC_W);
    const nY = p["Nama panggilan"] + 20;
    return {
      title: "Mengisi undangan dengan klik langsung di pratinjau",
      world: GW,
      base: [shell("Template", "Template"), templatePanel(), scrollbar(157, 360), coverScreen()],
      els: {
        pn: { svg: coverScreen({ names: "Rania & Dimas" }), enter: "fade", delay: 1.6 },
        hover: { svg: frame(SC.y, SC.h, 2) + hoverTag(SC.x, SC.y, "Sampul · klik untuk mengisi"), enter: "fade" },
        selCover: { svg: frame(SC.y, SC.h, 3) + tbCover, enter: "fade" },
        klik: { svg: ring(6, 703, 60, 44, { r: 8 }) + note(92, 709, "Klik aktif", 66, 725), enter: "fade" },
        konten: { svg: railPanel("Konten", "Konten") + accFrame(154, 900) + kcol + scrollbar(420, 200) + nkHead(0, 0, "Konten") + line(72, 153, 399, 153, { stroke: C.line }), enter: "fade" },
        clr: { svg: white(ACC_X + 3, nY + 3, ACC_W - 6, 30), enter: "fade" },
        nama: { svg: text(ACC_X + 10, nY + 23, "Rania", { size: 14 }), enter: "fade" }
      },
      steps: [
        { caption: "Cek tombol di rel kiri: harus tertulis Klik aktif.", at: ED.tool.Klik, show: ["klik"], dur: 3.2 },
        { caption: "Arahkan mouse ke nama mempelai. Sampul diberi garis biru dan label.", at: [922, 505], hide: ["klik"], show: ["hover"], dur: 3.4 },
        { caption: "Klik namanya. Form Mempelai terbuka, kursor di Nama panggilan.", at: [922, 505], click: true, show: ["selCover", "konten"], dur: 3.8 },
        { caption: "Ketik isi baru. Pratinjau ikut berubah setelah sesaat.", at: [ACC_X + 120, nY + 18], click: true, show: ["clr", "nama", "pn"], type: [typed("nama", ACC_X + 10, nY + 8, "Rania")], dur: 4 }
      ]
    };
  })(),

  // ------------------------------------------------------------------------------------------- Klik di pratinjau (langkah 5-7)
  "editor-klik-toolbar": (() => {
    const salamTop = SC.y + 784 - PAGE_DY;
    const [tb, at] = toolbar(SC.x + SC.w, salamTop + 6, ["Isi", "↑", "↓", "Sembunyikan"]);
    const page = cover({ top: SC.y }) + salamSec(SC.y + 784) + ayatSec(SC.y + 1204) + mempelaiSec(SC.y + 1534);
    return {
      title: "Memakai toolbar bagian di pratinjau",
      world: { x: 72, y: 300, w: 1045, h: 600 },
      base: [shell("Konten", "Konten"), kontenClosed(), rect(SC.x - 1, SC.y - 1, SC.w + 2, SC.h + 2, { fill: "rgba(16,24,40,.06)" })],
      els: {
        page: { svg: page },
        sel: { svg: frame(salamTop, 420, 3) + tb, enter: "fade" },
        gone: { svg: screen(rect(SC.x, salamTop, SC.w, 900, { fill: KENCANA.bg }), ayatSec(salamTop), mempelaiSec(salamTop + 330)), enter: "fade" },
        mask: rect(400, SC.y + SC.h, 1040, 900 - SC.y - SC.h, { fill: C.svPreview }),
        toast: { svg: nkToast("Salam Pembuka disembunyikan."), enter: "slide" }
      },
      steps: [
        { caption: "Gulir pratinjau, lalu klik bagian lain, misalnya Salam Pembuka.", at: [922, salamTop + 140], scroll: { id: "page", dy: PAGE_DY }, click: true, show: ["sel"], dur: 3.8 },
        { caption: "Toolbar: Isi buka form, ↑ ↓ pindah bagian. Klik Sembunyikan.", at: at.Sembunyikan, click: true, hide: ["sel"], show: ["gone", "toast"], dur: 4 },
        { caption: "Salah klik? Klik Urungkan di pesan bawah. Bagian tampil lagi.", at: [345, 862], click: true, hide: ["gone", "toast"], show: ["sel"], dur: 3.8 }
      ]
    };
  })(),

  // ------------------------------------------------------------------------------------------- Klik di pratinjau: Inspect
  "editor-klik-inspect": (() => {
    const insTool = (on) => rect(0, 700, 71, 50, { fill: C.page }) + icon("crosshair", 36, 717, 18, on ? C.action : C.text) + text(36, 740, on ? "Inspect aktif" : "Inspect", { size: 10, fill: on ? C.action : C.text, anchor: "middle" });
    const sY = GROUPS_Y + 50;
    const form = white(72, 154, 327, 746) + kontenTop() + nkAcc(PX, GROUPS_Y, PW, "Sampul", { badge: "Terisi", open: true }) + line(88, sY - 0.5, 367, sY - 0.5, { stroke: C.line }) + accFrame(sY, 900) +
      para(ACC_X, sY + 24, ["Nama dan tanggal diambil dari Mempelai dan", "Acara."], { size: 12, fill: C.faint, lh: 16 }) +
      text(ACC_X, sY + 76, "Foto sampul", { size: 12, weight: 500 }) + photo(ACC_X, sY + 86, 64, 64, 2) + quiet(ACC_X, sY + 158, "Ganti foto", { icon: "image" }) +
      text(ACC_X, sY + 218, "Foto slideshow (opsional, maks. 4)", { size: 12, weight: 500 }) + scrollbar(157, 300);
    return {
      title: "Memakai Inspect bila Klik aktif tidak tersedia",
      world: GW,
      base: [shell("Konten", "Konten"), insTool(false), kontenClosed(), coverScreen()],
      els: {
        on: { svg: insTool(true), enter: "fade" },
        tip: { svg: note(96, 640, "Inspect aktif", 66, 725), enter: "fade" },
        sel: { svg: rect(770, 360, 304, 56, { fill: "rgba(30,136,229,.12)", stroke: "#1e88e5", sw: 2 }), enter: "fade" },
        form: { svg: form, enter: "fade" }
      },
      steps: [
        { caption: "Klik Inspect di rel. Tulisannya berubah menjadi Inspect aktif.", at: [36, 725], click: true, show: ["on", "tip"], dur: 3.4 },
        { caption: "Klik bagian di pratinjau. Formnya terbuka di Konten, tanpa toolbar.", at: [922, 390], click: true, hide: ["tip"], show: ["sel", "form"], dur: 3.8 },
        { caption: "Selesai? Klik Inspect aktif lagi untuk mematikan.", at: [36, 725], click: true, hide: ["on", "sel"], dur: 3.4 }
      ]
    };
  })(),

  // ------------------------------------------------------------------------------------------- Urungkan dan Ulangi
  "editor-urungkan-ulangi": {
    title: "Mengurungkan dan mengulangi perubahan",
    world: GW,
    base: [shell("Konten", "Konten"), priaPanel("Dimaz"), coverScreen({ names: "Rani & Dimaz" })],
    els: {
      tipU: { svg: tooltip(8, 652, "Urungkan (Ctrl+Z)") + tooltip(40, 684, "Ulangi (Ctrl+Shift+Z)"), enter: "fade", delay: 0.6 },
      fix: { svg: nickFix("Dimas") + rect(38, 622, 30, 24, { fill: C.page }) + icon("redo-2", 52, 633, 16, C.text), enter: "fade" },
      redo: { svg: nickFix("Dimaz") + rect(38, 622, 30, 24, { fill: C.page }) + icon("redo-2", 52, 633, 16, C.off), enter: "fade" }
    },
    steps: [
      { caption: "Di bawah Bagikan ada dua panah: kiri Urungkan, kanan Ulangi.", at: ED.tool.Urungkan, show: ["tipU"], dur: 3.8 },
      { caption: "Klik panah kiri. Perubahan terakhir batal: nama kembali Dimas.", at: ED.tool.Urungkan, click: true, hide: ["tipU"], show: ["fix"], dur: 3.6 },
      { caption: "Kebablasan? Klik panah kanan untuk mengulangi perubahan tadi.", at: ED.tool.Ulangi, click: true, show: ["redo"], dur: 3.6 }
    ]
  },

  // ------------------------------------------------------------------------------------------- Kosongkan (langkah 1-3)
  "editor-kosongkan": (() => {
    const dlg = nkDialogHead(0, 0, "Kosongkan halaman?") + nkNote(16, BY, 367, ["Isi undangan dihapus. Ucapan dan RSVP aman. Bisa", "diurungkan."], { tone: "warn" }) +
      nkBtn(16, 237, "Kosongkan halaman", { variant: "danger", icon: "eraser" }) + quiet(16 + tw("Kosongkan halaman", 12, 500) + 52, 237, "Batal");
    return {
      title: "Mengosongkan halaman",
      world: GW,
      base: [shell("Konten", "Konten"), priaPanel("Dimas"), coverScreen()],
      els: {
        red: { svg: rect(0, 752, 71, 46, { fill: C.page }) + icon("eraser", 36, 765, 18, C.danger) + text(36, 788, "Kosongkan", { size: 10, fill: C.danger, anchor: "middle" }) + note(96, 700, "Kosongkan", 66, 770), enter: "fade" },
        dlg: { svg: dlg, enter: "pop", origin: [36, 773] },
        msg: { svg: ring(16, BY, 367, 56, { r: 6 }), enter: "fade" },
        empty: { svg: railPanel("Template", "Template") + templatePanel() + scrollbar(157, 360) + rect(SC.x, SC.y, SC.w, SC.h, { fill: C.white }), enter: "fade" }
      },
      steps: [
        { caption: "Di rel kiri, klik Kosongkan (judul tombol: Kosongkan halaman).", at: ED.tool.Kosongkan, hover: "red", click: true, show: ["dlg"], dur: 3.4 },
        { caption: "Baca jendela Kosongkan halaman?: Ucapan dan RSVP aman. Bisa diurungkan.", at: [260, BY + 30], show: ["msg"], dur: 4 },
        { caption: "Klik Kosongkan halaman untuk lanjut, atau Batal (Esc) untuk mundur.", at: [90, 255], click: true, hide: ["dlg", "msg"], show: ["empty"], dur: 3.8 }
      ]
    };
  })(),

  // ------------------------------------------------------------------------------------------- Kosongkan (langkah 4-5)
  "editor-kosongkan-hasil": {
    title: "Hasil Kosongkan dan cara mengurungkannya",
    world: PV,
    base: [shell("Template", "Template"), templatePanel(), scrollbar(157, 360), rect(SC.x, SC.y, SC.w, SC.h, { fill: C.white })],
    els: {
      toast: { svg: nkToast("Halaman dikosongkan."), enter: "slide", delay: 0.4 },
      back: { svg: coverScreen(), enter: "fade" }
    },
    steps: [
      { caption: "Halaman kosong, menu Template terbuka, muncul pesan Halaman dikosongkan.", at: [700, 640], show: ["toast"], dur: 3.8 },
      { caption: "Berubah pikiran? Klik Urungkan di pesan itu. Undangan kembali utuh.", at: [345, 862], click: true, hide: ["toast"], show: ["back"], dur: 3.8 }
    ]
  },

  // ------------------------------------------------------------------------------------------- Dijeda
  "editor-dijeda-timpa": (() => {
    const [kcol] = column([{ label: "Bahasa undangan", value: "Indonesia", select: true }], PX, BY + 138, PW);
    const rest = kcol + text(PX, BY + 226, "Urutan dan tampilan bagian di Lapisan.", { size: 12, fill: C.faint }) +
      ["Sampul", "Mempelai", "Acara & Tanggal", "Salam Pembuka", "Ayat / Kutipan", "Kisah Cinta", "Galeri Foto", "Video"].map((g, i) => nkAcc(PX, BY + 242 + i * 58, PW, g, { badge: "Terisi" })).join("");
    const banner = ring(PX, BY, PW, 126, { r: 8 });
    return {
      title: "NikahKit dijeda karena kode diubah manual",
      world: { x: 0, y: 44, w: 400, h: 856 }, // the Scalev tab strip, rail and panel
      base: [shell("Konten", "Konten", { saving: "Dijeda" }), white(72, 154, 327, 746), driftBanner(), rest, scrollbar(157, 300), coverScreen()],
      els: {
        foot: { svg: ring(4, 856, 64, 40, { r: 8 }) + note(96, 866, "Dijeda", 68, 878) + banner, enter: "fade" },
        code: { svg: clipped(0, 0, 399, 92, scalevEditor(0, 0, { tab: "Code" })) + codeView(), enter: "fade" },
        mark: { svg: ring(40, 193, 355, 22, { r: 4 }), enter: "fade" },
        leftK: { svg: clipped(0, 0, 400, 900, shell("Konten", "Konten", { saving: "Dijeda" }) + white(72, 154, 327, 746) + driftBanner() + rest + scrollbar(157, 300)), enter: "fade" },
        fixed: { svg: white(72, 154, 327, 746) + text(PX, BY + 12, "Bahasa undangan", { size: 12, weight: 500 }) + nkInput(PX, BY + 20, PW, "Indonesia", { select: true }) +
          text(PX, BY + 88, "Urutan dan tampilan bagian di Lapisan.", { size: 12, fill: C.faint }) +
          ["Sampul", "Mempelai", "Acara & Tanggal", "Salam Pembuka", "Ayat / Kutipan", "Kisah Cinta", "Galeri Foto", "Video", "Rangkaian Acara", "Dress Code"].map((g, i) => nkAcc(PX, BY + 104 + i * 58, PW, g, { badge: "Terisi" })).join("") +
          scrollbar(157, 300) + footStatus("Tersimpan", C.ok), enter: "fade" },
        ok: { svg: ring(4, 856, 64, 40, { r: 8 }) + note(96, 860, "Tersimpan", 68, 878), enter: "fade" }
      },
      steps: [
        { caption: "Kaki rel menunjukkan Dijeda. Baca kotak kuning di atas panel.", at: [36, 878], show: ["foot"], dur: 3.8 },
        { caption: "Klik Lihat di kode. Tab Code terbuka, bagian yang diubah ditandai.", at: [150, BY + 54], click: true, hide: ["foot"], show: ["code"], dur: 3.8 },
        { caption: "Putuskan: tidak penting? Lanjut. Penting? Salin dulu, atau Ctrl+Z di Code.", at: [250, 204], show: ["mark"], dur: 4 },
        { caption: "Kembali ke tab NikahKit di strip atas editor Scalev.", at: ED.tab.NikahKit, click: true, hide: ["code", "mark"], show: ["leftK"], dur: 3.4 },
        { caption: "Klik Timpa dengan NikahKit. Perubahan manual dibuang, bisa diurungkan.", at: [180, BY + 98], click: true, show: ["fixed"], dur: 3.6 },
        { caption: "Kotak kuning hilang, kaki rel kembali Tersimpan. Lalu Simpan di Scalev.", at: [36, 878], show: ["ok"], dur: 3.6 }
      ]
    };
  })()
};
export const scenes = SCENES;
