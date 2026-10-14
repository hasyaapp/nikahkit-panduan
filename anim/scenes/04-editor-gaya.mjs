// Editor scenes for the Media, Musik, Gaya, Lapisan, preview click, Urungkan/Kosongkan and Dijeda pages.
// Every scene is the whole real 1440x900 Scalev editor (ui/kit scalevEditor), panel and preview together. Panel geometry
// from /tmp/ref/editor-*.png and editor-metrics.json (update note left out: content starts at y 169). Labels follow
// nikahkit/src/ui/App.jsx, panels-style.jsx, panels-structure.jsx, fields.jsx, panel-content.jsx, fields.js, model.js,
// store.js and canvas/canvas.js (preview toolbar: #223548 bar, Isi / ↑ / ↓ / Sembunyikan, 30px buttons, 3px blue frame).
// The YouTube, Google Fonts and file windows and the Kencana invitation preview are generic drawings (not measured),
// laid out at 1440 wide.
import { C, rect, text, line, circle, para, tw, clipped, shadow, icon, iconX, skeleton } from "../lib.mjs";
import { ED, nkBtn, nkBtnBox, nkInput, nkSwitch, nkBadge, nkNote, nkAcc, nkH3, nkToast, nkToastBoxes, scalevEditor, nkRail, nkHead, nkDialogHead, chrome, favChrome } from "../ui/kit.mjs";
import { kencana } from "../ui/invitation.mjs";
import { templatePanel } from "../ui/editor-panels.mjs";

const SC = ED.screen; // preview screen 727,106 390x784
const PX = 88, PW = 279, BY = 169; // panel body content box (scrolling panels keep 279 next to the scrollbar)
const { photo, cover, stack, pal: KENCANA, SERIF, SCRIPT } = kencana; // the Kencana invitation page (ui/invitation)
const GOLD = "#E0B84A";
// Focus areas: rail + panel, panel, preview screen, rail tools, rail foot.
const LEFT = [0, 92, 399, 808], PANELF = [72, 92, 327, 808], PREVF = [SC.x, SC.y, SC.w, SC.h], TOOLS = [0, 554, 72, 297], FOOT = [0, 851, 72, 49];
// Rail tab bounds (nkRail: 56 px rows from y 104) and tool bounds, for marks.
const railBox = (n) => [0, 104 + ["Template", "Gaya", "Audio", "Media", "Lapisan", "Konten"].indexOf(n) * 56, 72, 52];
const toolBox = (cy) => [4, cy - 22, 64, 44];

// ---- small drawing helpers -------------------------------------------------------------------------------------------
const raw = (body, cx, cy, size, color, fill = false) => `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${size / 24})" fill="${fill ? color : "none"}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</g>`;
const scrollbar = (y = 157, h = 360) => rect(387, y, 6, h, { r: 3, fill: "#c4c8ce" });
const white = (x, y, w, h) => rect(x, y, w, h, { fill: C.white });

// Editor shell: Scalev editor + NikahKit rail (active menu) + panel header.
const shell = (rail, title, o = {}) => scalevEditor(0, 0, { rail, ...o }) + (title ? nkHead(0, 0, title) + line(72, 153, 399, 153, { stroke: C.line }) : "");
// Switching menus: the rail tabs with another one active, and an empty panel with its header.
const railTabs = (rail) => clipped(0, 92, 72, 350, nkRail(0, 0, rail));
const panelOpen = (title) => white(72, 92, 327, 808) + nkHead(0, 0, title) + line(72, 153, 399, 153, { stroke: C.line });
// The Scalev bars above the panel, drawn over a scrolled panel so its content stays inside the panel.
const barMask = () => clipped(72, 0, 327, 92, scalevEditor(0, 0));

const screen = (...kids) => clipped(SC.x, SC.y, SC.w, SC.h, ...kids);

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

// =====================================================================================================================
// Media: unggah banyak foto
const MEDIA_Y = 239, MS = 89; // grid top, tile size (3 columns, gap 6)
const tile = (i, k) => { const x = PX + (i % 3) * (MS + 6), y = MEDIA_Y + Math.floor(i / 3) * (MS + 6); return photo(x, y, MS, MS, k); };
const mediaGrid = (ks) => clipped(PX, MEDIA_Y, PW, 900 - MEDIA_Y, ks.map((k, i) => tile(i, k)).join(""));
const OLD = [0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2];
const mediaBody = (hint, ks, o = {}) => white(72, 154, 314, 746) + nkBtn(PX, BY, "Unggah foto", { w: PW, icon: "upload", size: 14 }) +
  (o.busy ? rect(PX, BY, PW, 36, { r: 4, fill: "rgba(255,255,255,.5)" }) : "") + text(PX, BY + 54, hint, { size: 12, fill: o.hintFill ?? C.faint }) + mediaGrid(ks) + scrollbar(157, 300);
// The system file window (generic: traffic lights, folder, four photos, Buka), in the grey gap between panel and preview.
const FILES = [["akad-1.jpg", 4], ["akad-2.jpg", 1], ["resepsi.jpg", 8], ["lamaran.jpg", 3]];
const FW = { x: 403, y: 290, w: 320, h: 370 };
const BUKA_BOX = [FW.x + FW.w - 96, FW.y + FW.h - 40, 80, 28], BUKA = [BUKA_BOX[0] + 40, BUKA_BOX[1] + 14];
function fileWindow(sel) {
  const { x, y, w, h } = FW;
  let s = shadow(x, y, w, h, 10, 3) + rect(x, y, w, h, { r: 10, fill: C.white, stroke: "#d0d4da" }) + rect(x, y, w, 36, { r: 10, fill: "#eceef1" }) + rect(x, y + 26, w, 10, { fill: "#eceef1" }) +
    circle(x + 18, y + 18, 6, { fill: "#ff5f57" }) + circle(x + 38, y + 18, 6, { fill: "#febc2e" }) + circle(x + 58, y + 18, 6, { fill: "#28c840" }) + iconX("folder", x + 90, y + 18, 16, C.text) +
    text(x + 106, y + 23, "Foto Rani & Dimas", { size: 13, weight: 500, fill: C.crText });
  FILES.forEach(([n, k], i) => {
    const fx = x + 20 + (i % 2) * 154, fy = y + 56 + Math.floor(i / 2) * 124;
    if (sel) s += rect(fx, fy - 8, 108, 128, { r: 8, fill: C.crBlueSoft });
    s += photo(fx + 14, fy, 80, 80, k) + text(fx + 54, fy + 104, n, { size: 13, fill: C.crText, anchor: "middle" });
  });
  return s + line(x, y + h - 56, x + w, y + h - 56, { stroke: "#e3e5e8" }) + rect(...BUKA_BOX, { r: 6, fill: sel ? C.crBlue : "#c4c7c5" }) +
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
    (o.badge ? nkBadge(PX + PW - 11, y + 18, o.badge, { fill: C.mutedBg, fg: C.text, end: true }) : "");
};
const KENCANA_STRIP = ["#FFF7E9", "#FFFDF8", "#8E2818", "#8E2818", "#6B5A55"];
// Gaya > Warna list for Kencana (model.js paletteChoices): its own palette, then the Jelajah palettes it can wear, grouped
// by catalogue group in that order. Strip colours: bg, surface, heading, accent, muted.
const PAL_GROUPS = [
  ["Earthy", [["Terakota", ["#F6EFE7", "#FFFBF6", "#5A2E1F", "#A0522D", "#7A6A60"]], ["Sage", ["#F1F3EC", "#FBFCF8", "#2F3D2C", "#5B7553", "#66705F"]],
    ["Kakao", ["#EFE6DC", "#FAF5EF", "#3A2A22", "#6B4A3A", "#6E5F56"]], ["Pasir", ["#F5EFE3", "#FFFDF8", "#4A3A26", "#7D5F36", "#6E6253"]],
    ["Tanah Liat", ["#F3ECE8", "#FFFAF7", "#5B2F2A", "#9A4A3C", "#73625C"]], ["Olive Vintage", ["#F7F0E8", "#FAF6F0", "#332A24", "#3F4232", "#74675F"]]]],
  ["Romantic Pastel", [["Blush", ["#FBF1F1", "#FFFFFF", "#6E3A44", "#A04E61", "#76636A"]], ["Lilac", ["#F5F1FA", "#FFFFFF", "#47385E", "#7A5C9E", "#6F6780"]],
    ["Langit", ["#EEF5FA", "#FFFFFF", "#24435A", "#3F7397", "#5E6E7A"]], ["Peach", ["#FDF3EE", "#FFFFFF", "#7A3E2E", "#A44E38", "#76625C"]],
    ["Mint", ["#EFF7F3", "#FFFFFF", "#24493D", "#3B735E", "#5A6B64"]], ["Mawar", ["#FBF0F4", "#FFFFFF", "#6B2D46", "#9C3F63", "#75606A"]]]],
  ["Monokrom", [["Tinta", ["#FFFFFF", "#F5F5F4", "#111111", "#111111", "#666666"]], ["Batu", ["#EEEDEA", "#F8F8F6", "#262626", "#4A4A4A", "#626262"]]]]
];
// y = top of the Bold Luxury heading; headings sit 24 below the previous row, rows 50 apart (measured). sel: 0 = Merah
// Kencana, 1.. = Earthy rows.
function palettes(y, sel = 0) {
  let s = nkH3(PX, y + 12, "Bold Luxury") + pal(y + 24, "", KENCANA_STRIP, { h: 54, on: sel === 0, lines: ["Merah", "Kencana"], badge: "Bawaan Kencana" }), top = y + 102;
  PAL_GROUPS.forEach(([g, rows], k) => {
    s += nkH3(PX, top + 12, g);
    rows.forEach(([n, c], i) => (s += pal(top + 24 + i * 50, n, c, { on: k === 0 && sel === i + 1 })));
    top += 24 + rows.length * 50 + 18;
  });
  return s;
}
const PAL_Y = 609, palRowY = (i) => PAL_Y + 126 + i * 50; // Earthy row i
const TERAKOTA = { bg: "#F6EFE7", surface: "#FFFBF6", heading: "#5A2E1F", text: "#4A3B33", accent: "#A0522D", on: "#FFFFFF" };
const SAGE = { bg: "#F1F3EC", surface: "#FBFCF8", heading: "#2F3D2C", text: "#3B4438", accent: "#5B7553", on: "#FFFFFF" };
// State A: Custom not in use (lead line, colours of the chosen palette), without the sub-tabs.
function warnaA(p = KENCANA, sel = 0) {
  let s = white(72, BY + 38, 314, 1400) + nkH3(PX, 235, "Custom") + para(PX, 259, ["Mulai dari palet yang dipilih; ubah salah satu warna", "untuk memakai Custom."], { size: 12, fill: C.faint, lh: 16 });
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
  return s + palettes(738, -1);
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
  const p = PAIRS[o.pair ?? 0], hf = o.font === "done" ? PLAYFAIR : p[3];
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
  s += o.font === "done" ? text(PX, y + 12, "Font judul dan nama: ", { size: 12, weight: 500 }) + text(PX + 123, y + 12, "Playfair Display", { size: 12, weight: 700, font: PLAYFAIR }) : text(PX, y + 12, "Font judul dan nama", { size: 12, weight: 500 });
  s += o.font ? nkInput(PX, y + 20, PW, "", {}) + clipped(PX + 10, y + 20, PW - 20, 36, text(PX + 10, y + 43, FONT_LINK, { size: 14 })) : nkInput(PX, y + 20, PW, "Tempel link Google Fonts", { placeholder: true });
  y += 56; if (o.font === "check") { s += text(PX, y + 20, "Memeriksa ketebalan yang tersedia…", { size: 12, fill: C.faint }); y += 20; } y += 12;
  s += text(PX, y + 12, "Font teks", { size: 12, weight: 500 }) + nkInput(PX, y + 20, PW, "Tempel link Google Fonts", { placeholder: true }); y += 68;
  if (o.font) { s += sample(y, hf, p[4], 24); y += 86; pos.back = y; s += quiet(PX, y, "Kembali ke pasangan bawaan"); y += 48; }
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
      : clipped(PX + 1, y + 1, AW - 2, 164, photo(PX + 1, y + 1, AW - 2, 164, 6), rect(PX + 1, y + 1, AW - 2, 164, { fill: "rgba(34,53,72,.35)" })) +
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

// =====================================================================================================================
// Klik di pratinjau: the page under the cover (kencana Salam Pembuka, Ayat / Kutipan, Mempelai).
const PAGE_DY = 560; // scroll so Salam Pembuka sits at y 330
// Preview toolbar (canvas.js): dark bar, 3px padding, 2px gaps, 30px buttons with 10px side padding, 12px/500 white.
// Returns [svg, button centres, button boxes, bar box].
function toolbar(right, top, actions, hover) {
  const bw = actions.map((a) => Math.max(32, tw(a, 12, 500) + 20)), w = 6 + bw.reduce((a, b) => a + b, 0) + 2 * (actions.length - 1);
  let x = right - w - 6, s = rect(x, top + 3, w, 36, { r: 6, fill: "rgba(0,0,0,.18)" }) + rect(x, top, w, 36, { r: 6, fill: C.strong }); const at = {}, box = {};
  let bx = x + 3;
  actions.forEach((a, i) => {
    if (a === hover) s += rect(bx, top + 3, bw[i], 30, { r: 4, fill: C.primary });
    s += a === "↑" || a === "↓" ? text(bx + bw[i] / 2, top + 23, a, { size: 14, weight: 500, fill: C.white, anchor: "middle" }) : text(bx + bw[i] / 2, top + 22, a, { size: 12, weight: 500, fill: C.white, anchor: "middle" });
    at[a] = [bx + bw[i] / 2, top + 18]; box[a] = [bx, top + 3, bw[i], 30]; bx += bw[i] + 2;
  });
  return [s, at, box, [x, top, w, 36]];
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
const nickFix = (nick) => white(ACC_X + 1, NICK_Y + 1, ACC_W - 2, 34) + text(ACC_X + 10, NICK_Y + 23, nick, { size: 14 }) + cover({ names: `Rani & ${nick}` });

// ---- other windows (generic drawings at 1440 wide) ---------------------------------------------------------------------
// YouTube watch page with the Bagikan dialog open (YouTube's Indonesian labels).
const YT_DLG = [460, 300, 520, 330], YT_TOAST = [24, 820, 248, 48], SALIN_BOX = [870, 478, 72, 36];
const favYT = (cx, cy) => rect(cx - 8, cy - 6, 16, 12, { r: 3, fill: "#ff0033" }) + `<path d="M${cx - 2.5} ${cy - 3} l6 3 l-6 3 z" fill="#fff"/>`;
function youtube() {
  let s = chrome(0, 0, 1440, 900, { tabs: [{ title: "Lagu pengiring - YouTube", active: true, fav: favYT }], url: "youtube.com/watch?v=AbCdEf12345" }) +
    [104, 112, 120].map((y) => line(28, y, 46, y, { stroke: "#0f0f0f", sw: 2 })).join("") + rect(68, 102, 30, 21, { r: 6, fill: "#ff0033" }) + `<path d="M79 107 l9 5.5 l-9 5.5 z" fill="#fff"/>` +
    text(104, 119, "YouTube", { size: 18, weight: 700, fill: "#0f0f0f" }) + rect(440.5, 93.5, 500, 39, { r: 20, stroke: "#d3d3d3" }) + iconX("search", 972, 113, 18, "#0f0f0f") + circle(1400, 113, 16, { fill: "#c9b6a6" }) +
    rect(24, 165, 1012, 569, { r: 12, fill: "#0f0f0f" }) + rect(36, 716, 988, 3, { r: 1.5, fill: "rgba(255,255,255,.3)" }) + rect(36, 716, 300, 3, { r: 1.5, fill: "#ff0033" }) +
    text(24, 772, "Lagu pengiring untuk Rani & Dimas", { size: 20, weight: 700, fill: "#0f0f0f" }) + circle(44, 816, 20, { fill: "#d9c7b0" }) +
    text(76, 812, "Musik Pernikahan", { size: 16, weight: 500, fill: "#0f0f0f" }) + text(76, 830, "12 rb subscriber", { size: 12, fill: "#606060" }) +
    rect(252, 798, 104, 36, { r: 18, fill: "#0f0f0f" }) + text(304, 821, "Subscribe", { size: 14, weight: 500, fill: C.white, anchor: "middle" }) +
    rect(736, 798, 128, 36, { r: 18, fill: "#f2f2f2" }) + rect(876, 798, 112, 36, { r: 18, fill: "#f2f2f2" }) + icon("share-2", 900, 816, 16, "#0f0f0f") + text(916, 821, "Bagikan", { size: 14, weight: 500, fill: "#0f0f0f" });
  for (let i = 0; i < 7; i++) { const y = 165 + i * 104; s += rect(1060, y, 168, 94, { r: 8, fill: "#e5e5e5" }) + rect(1240, y + 6, 160, 10, { r: 5, fill: "#d6d6d6" }) + rect(1240, y + 26, 110, 8, { r: 4, fill: "#e5e5e5" }) + rect(1240, y + 42, 80, 8, { r: 4, fill: "#e5e5e5" }); }
  const [dx, dy, dw, dh] = YT_DLG;
  s += rect(0, 85, 1440, 815, { fill: "rgba(0,0,0,.5)" }) + rect(dx, dy, dw, dh, { r: 12, fill: C.white }) + text(dx + 24, dy + 40, "Bagikan", { size: 16, weight: 700, fill: "#0f0f0f" }) + iconX("x", dx + dw - 28, dy + 34, 18, "#0f0f0f") +
    [["Sematkan", "#f2f2f2"], ["WhatsApp", "#25d366"], ["Facebook", "#1877f2"], ["X", "#0f0f0f"], ["Email", "#8a8a8a"]].map(([n, c], i) => circle(dx + 54 + i * 86, dy + 95, 28, { fill: c }) + text(dx + 54 + i * 86, dy + 146, n, { size: 12, fill: "#0f0f0f", anchor: "middle" })).join("") +
    rect(dx + 24.5, dy + 170.5, dw - 49, 51, { r: 12, fill: "#f9f9f9", stroke: "#d3d3d3" }) + text(dx + 40, dy + 201, "https://youtu.be/AbCdEf12345", { size: 14, fill: "#0f0f0f" }) +
    rect(...SALIN_BOX, { r: 18, fill: "#065fd4" }) + text(SALIN_BOX[0] + 36, SALIN_BOX[1] + 23, "Salin", { size: 14, weight: 500, fill: C.white, anchor: "middle" }) + line(dx, dy + 245, dx + dw, dy + 245, { stroke: "#e5e5e5" }) +
    rect(dx + 24.5, dy + 268.5, 17, 17, { r: 3, stroke: "#606060", sw: 2 }) + text(dx + 52, dy + 282, "Mulai pada", { size: 14, fill: "#0f0f0f" }) + text(dx + 136, dy + 282, "1:05", { size: 14, fill: "#606060" });
  return s;
}
// Google Fonts: the font list, or one font's page (with the address bar selected: gfSel).
const GF_URL = "fonts.google.com/specimen/Playfair+Display", GF_ROW0 = [32, 245, 1376, 96], OMNI = [124, 46, 1184, 34];
const GF_FONTS = [["Playfair Display", PLAYFAIR], ["Lora", ff("Lora")], ["Great Vibes", ff("Great Vibes", "cursive")], ["Montserrat", ff("Montserrat", "sans-serif")], ["Cormorant Garamond", ff("Cormorant Garamond")], ["Dancing Script", ff("Dancing Script", "cursive")]];
function googleFonts(spec) {
  let s = chrome(0, 0, 1440, 900, { tabs: [{ title: spec ? "Playfair Display - Google Fonts" : "Google Fonts", active: true, fav: favChrome }], url: spec ? GF_URL : "fonts.google.com" }) +
    text(32, 126, "Google Fonts", { size: 22, fill: "#202124" }) + line(0, 149.5, 1440, 149.5, { stroke: "#dadce0" });
  if (!spec) return s + rect(32, 173, 1376, 48, { r: 24, fill: "#f1f3f4" }) + iconX("search", 60, 197, 18, "#5f6368") +
    GF_FONTS.map(([n, font], i) => { const y = 245 + i * 108; return rect(32.5, y + 0.5, 1375, 95, { r: 12, stroke: "#dadce0" }) + text(56, y + 28, n, { size: 14, fill: "#5f6368" }) + text(56, y + 78, "Rani & Dimas", { size: 36, fill: "#202124", font }); }).join("");
  return s + text(32, 306, "Playfair Display", { size: 48, fill: "#202124", font: PLAYFAIR }) + rect(1232, 268, 176, 44, { r: 22, fill: C.crBlue }) +
    text(32, 470, "Rani & Dimas", { size: 110, fill: "#202124", font: PLAYFAIR }) +
    ["Regular 400", "Italic 400", "Bold 700"].map((n, i) => { const y = 540 + i * 110; return line(32, y, 1408, y, { stroke: "#dadce0" }) + text(32, y + 28, n, { size: 14, fill: "#5f6368" }) + text(32, y + 84, "Rani & Dimas", { size: 44, fill: "#202124", font: PLAYFAIR }); }).join("");
}
const gfSel = rect(162, 57, tw(GF_URL, 14) + 8, 22, { r: 3, fill: "#c2dbff" }) + text(166, 68, GF_URL, { size: 14, fill: C.crText });

// Marks shared by several scenes.
const FOOT_MARK = [10, 859, 52, 34]; // save status dot + label in the rail foot
const TOAST = nkToastBoxes("Halaman dikosongkan.").toast, URUNG_BOX = nkToastBoxes("Halaman dikosongkan.").undo; // one-line toast, Urungkan button
const URUNG_AT = [URUNG_BOX[0] + URUNG_BOX[2] / 2, URUNG_BOX[1] + URUNG_BOX[3] / 2];
const NAMES = [763, 464, 318, 56]; // couple names on the cover
const segW = (w, labels, active) => { const need = 20 + tw(labels[active], 12, 600) + 6 + 16, aw = Math.max(w / labels.length, need); return [(w - aw) / (labels.length - 1), aw]; };

const SCENES = {
  // ------------------------------------------------------------------------------------------- Media A: unggah banyak foto
  "editor-media-unggah": {
    title: "Mengunggah banyak foto lewat menu Media",
    base: [shell("Template", "Template"), templatePanel(null), scrollbar(157, 360), cover()],
    els: {
      tabs: { svg: railTabs("Media"), enter: "fade" },
      media: { svg: panelOpen("Media") + mediaBody("Atau seret ke sini.", OLD), enter: "fade" },
      win: { svg: fileWindow(false), enter: "pop", origin: [FW.x + FW.w / 2, FW.y] },
      winSel: { svg: fileWindow(true), enter: "fade", delay: 1.0 },
      busy1: { svg: mediaBody("Mengunggah 1 dari 4...", OLD, { busy: true }), enter: "fade" },
      up1: { svg: tile(0, 4), enter: "pop", delay: 0.8 },
      busy2: { svg: white(PX, BY + 40, PW, 20) + text(PX, BY + 54, "Mengunggah 2 dari 4...", { size: 12, fill: C.faint }), enter: "fade", delay: 0.9 },
      up2: { svg: tile(0, 1) + tile(1, 4), enter: "pop", delay: 1.7 },
      done: { svg: mediaBody("Atau seret ke sini.", [3, 8, 1, 4, ...OLD]), enter: "fade" }
    },
    steps: [
      { caption: "Buka menu Media: klik Media di rel kiri.", focus: LEFT, at: ED.rail.Media, click: true, show: ["tabs", "media"], mark: railBox("Media"), lens: { src: [0, 96, 384, 116], at: [300, 40] } },
      { caption: "Klik Unggah foto, lalu pilih beberapa foto (tahan Ctrl atau Cmd).", focus: [[72, 154, 327, 84], [FW.x, FW.y, FW.w, FW.h]], at: [PX + PW / 2, BY + 18], click: true, show: ["win", "winSel"],
        mark: [PX, BY, PW, 36], lens: { src: [80, 161, 295, 70] }, dur: 3.8 },
      { caption: "Klik Buka, lalu tunggu. Foto diunggah satu per satu: Mengunggah 1 dari 4...", focus: [[72, 154, 327, 178], [FW.x, FW.y, FW.w, FW.h]], at: BUKA, click: true,
        hide: ["win", "winSel"], show: ["busy1", "up1", "busy2", "up2"], mark: [{ box: [PX, 211, 150, 16], r: 2 }, { box: BUKA_BOX, r: 6 }], lens: { src: [80, 161, 295, 70], at: [12, 420] }, dur: 4 },
      { caption: "Selesai: semua foto baru tampil paling depan di grid Media.", focus: [72, 154, 327, 272], at: [PX + 140, MEDIA_Y + 45], hide: ["busy1", "up1", "busy2", "up2"], show: ["done"],
        mark: { box: [PX, MEDIA_Y, PW, 2 * MS + 6], r: 0 }, note: "4 foto baru paling depan", dur: 3.4 }
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
    const [atasW] = segW(ACC_W - 20, FOCUS.map((f) => f[0]), 1);
    return {
      title: "Memasang foto lewat tombol Pilih foto",
      base: [shell("Konten", "Konten"), white(72, 154, 327, 746), kontenTop(), accTitles(GROUPS_Y), scrollbar(157, 300), cover()],
      els: {
        open: { svg: open, enter: "fade" },
        hdr: clipped(72, 0, 327, 154, scalevEditor(0, 0, { rail: "Konten" })) + nkHead(0, 0, "Konten") + line(72, 153, 399, 153, { stroke: C.line }),
        dlg: { svg: dlg + pakai(false), enter: "pop", origin: [150, FOTO_AT + 38] },
        sel: { svg: rect(selX + 1, selY + 1, gs - 2, gs - 2, { r: 4, stroke: C.primary, sw: 2 }) + circle(selX + gs - 12, selY + 12, 8, { fill: C.action }) + iconX("check", selX + gs - 12, selY + 12, 10, C.white, 3) + pakai(true), enter: "fade" },
        picked: { svg: picked, enter: "fade" },
        alt: { svg: text(ACC_X + 20, p2.alt + 23, ALT, { size: 14 }), enter: "fade" },
        altFocus: { svg: rect(ACC_X + 10.5, p2.alt + 0.5, ACC_W - 21, 35, { r: 4, stroke: C.primary, sw: 2 }), enter: "fade" },
        top: { svg: rect(ACC_X + 10.5, p2.alt + 0.5, ACC_W - 21, 35, { r: 4, stroke: C.white, sw: 3 }) + rect(ACC_X + 10.5, p2.alt + 0.5, ACC_W - 21, 35, { r: 4, stroke: C.field }) + rect(ACC_X + 10, p2.focus, ACC_W - 20, 38, { fill: C.page }) + focusSeg(ACC_X + 10, p2.focus, ACC_W - 20, 0), enter: "fade" }
      },
      steps: [
        { caption: "Di Konten, klik kelompok yang punya foto, misalnya Mempelai.", focus: PANELF, at: [200, accY + 25], click: true, show: ["open", "hdr"], mark: [PX, accY, PW, 50], lens: { src: [80, GROUPS_Y - 10, 302, 121] } },
        { caption: "Gulir ke Foto, lalu klik Pilih foto. Jendela Pilih foto terbuka.", focus: LEFT, at: [150, FOTO_AT + 38], scroll: { id: "open", dy }, click: true, show: ["dlg"],
          mark: nkBtnBox(ACC_X, FOTO_AT + 20, "Pilih foto", { icon: "image" }), lens: { src: [8, 213, 370, 76] }, dur: 3.6 },
        { caption: "Klik satu foto di grid. Foto itu diberi tanda terpilih.", show: ["sel"], at: [selX + gs / 2, selY + gs / 2], click: true, mark: [selX, selY, gs, gs], note: "Foto terpilih", dur: 3.4 },
        { caption: "Klik Pakai foto. Foto terpasang dan tombolnya menjadi Ganti foto.", at: [200, 870], click: true, hide: ["dlg", "sel"], show: ["picked"], mark: [DX, 852, 367, 36], lens: { src: [ACC_X - 8, FOTO_AT - 6, 270, 144] }, dur: 3.6 },
        { caption: "Klik Deskripsi foto, lalu tulis kalimat pendek tentang isi foto.", focus: PANELF, at: [230, p2.alt + 18], click: true, show: ["alt", "altFocus"], type: [typed("alt", ACC_X + 20, p2.alt + 8, ALT)],
          mark: [ACC_X + 10, p2.alt, ACC_W - 20, 36], lens: { src: [ACC_X - 8, p2.alt - 34, ACC_W + 16, 78] }, dur: 3.8 },
        { caption: "Wajah terpotong di undangan? Di Titik fokus, klik Atas.", at: [ACC_X + 10 + atasW / 2, p2.focus + 19], click: true, show: ["top"], mark: [ACC_X + 10, p2.focus, atasW, 38],
          lens: { src: [ACC_X - 8, p2.focus - 24, ACC_W + 16, 70] }, dur: 3.6 }
      ]
    };
  })(),

  // ------------------------------------------------------------------------------------------- Musik
  "editor-musik-youtube": (() => {
    const [A] = musik(), [B] = musik({ link: true, linkVal: true, focusLink: true }), [Cc] = musik({ link: true, linkVal: true, start: true, focusStart: true }), [D, t1] = musik({ link: true, linkVal: true, start: true, startVal: true, playing: true });
    const base = [shell("Template", "Template"), templatePanel(null), scrollbar(157, 360), cover()];
    return {
      title: "Memasang musik dari YouTube",
      base,
      els: {
        yt: youtube(),
        copied: { svg: rect(...YT_TOAST, { r: 8, fill: "#0f0f0f" }) + text(44, 849, "Link disalin ke papan klip", { size: 14, fill: C.white }), enter: "slide" },
        // Back to the editor (2 s after Salin, before step 2's click moves the focus): drawn as step 2 shows it.
        ed: { svg: skeleton(base.join("\n")) + clipped(...LEFT, base.join("\n")), skel: false, enter: "fade", delay: 2.0 },
        tabs: { svg: railTabs("Audio"), enter: "fade" },
        musik: { svg: panelOpen("Musik") + A, enter: "fade" },
        b: { svg: B, enter: "fade", delay: 0.3 },
        clear: { svg: white(PX + 1, BY + 21, AW - 2, 34) + rect(PX + 0.5, BY + 20.5, AW - 1, 35, { r: 4, stroke: C.primary, sw: 2 }), enter: "fade" },
        link: { svg: text(PX + 10, BY + 43, "https://youtu.be/AbCdEf12345", { size: 14 }), enter: "fade" },
        c: { svg: Cc, enter: "fade" },
        start: { svg: text(PX + 10, BY + 135, "1:05", { size: 14 }), enter: "fade" },
        d: { svg: D, enter: "fade" }
      },
      steps: [
        { caption: "Di YouTube, klik Bagikan, lalu Salin. Centang Mulai pada bila perlu.", focus: [YT_DLG, YT_TOAST], at: [906, 496], click: true, show: ["copied", "ed"],
          mark: { box: SALIN_BOX, r: 18 }, lens: { src: [476, 462, 500, 136], at: [150, 16] }, dur: 3.8 },
        { caption: "Kembali ke editor Scalev. Klik Audio di rel kiri, panel Musik terbuka.", focus: LEFT, at: ED.rail.Audio, click: true, hide: ["yt", "copied"], show: ["tabs", "musik"],
          mark: railBox("Audio"), lens: { src: [0, 96, 384, 232], at: [300, 40] }, dur: 3.4 },
        { caption: "Klik Tautan lagu, lalu tekan Ctrl+V (Mac: Cmd+V).", focus: PANELF, at: [240, BY + 38], click: true, hide: ["ed"], show: ["b", "clear", "link"], mark: [PX, BY + 20, AW, 36], lens: { src: [80, BY - 6, 310, 100] }, dur: 3.6 },
        { caption: "Isi Mulai dari, contoh 1:05 atau 65 (detik).", at: [200, BY + 130], click: true, show: ["c", "start"], type: [typed("start", PX + 10, BY + 119, "1:05")],
          mark: [PX, BY + 112, AW, 36], lens: { src: [80, BY + 86, 310, 70] }, dur: 3.4 },
        { caption: "Klik Coba putar dari 1:05 untuk mendengar. Klik Hentikan untuk berhenti.", at: [180, BY + 351], click: true, show: ["d"],
          mark: nkBtnBox(PX + 11, BY + 333, "Coba putar dari 1:05", { icon: "play" }), lens: { src: [PX - 4, BY + 156, AW + 8, 226] }, dur: 3.8 },
        { caption: "Putar saat undangan dibuka dan Ulang terus sudah menyala. Biarkan.", at: [PX + AW - 18, t1 + 20],
          mark: [{ box: [PX + AW - 36, t1 + 10, 36, 20], r: 10 }, { box: [PX + AW - 36, t1 + 58, 36, 20], r: 10 }], lens: { src: [PX - 4, t1, AW + 8, 92] }, dur: 3.6 },
        { caption: "Klik Simpan atau Simpan & Terbitkan di kanan atas editor Scalev.", focus: [1180, 44, 260, 48], at: [1234, 67], click: true,
          mark: [ED.simpanBox[0], ED.simpanBox[1], ED.terbitkanBox[0] + ED.terbitkanBox[2] - ED.simpanBox[0], ED.simpanBox[3]], lens: { src: [1180, 46, 260, 42] }, dur: 3.8 }
      ]
    };
  })(),

  // ------------------------------------------------------------------------------------------- Gaya A: palet siap pakai
  "editor-gaya-palet": (() => {
    const DY = 300, tRow = palRowY(0) - DY; // Terakota row after scrolling
    return {
      title: "Memilih palet warna siap pakai",
      base: [shell("Template", "Template"), templatePanel(null), scrollbar(157, 360), cover()],
      els: {
        tabs: { svg: railTabs("Gaya"), enter: "fade" },
        pane: { svg: warnaA(), enter: "fade" },
        terra: { svg: `<g transform="translate(0 -${DY})">${warnaA(TERAKOTA, 1)}</g>`, enter: "fade" },
        top: { svg: gayaTop(0, [], 380), enter: "fade" },
        bar: { svg: barMask(), enter: "fade" },
        pv: { svg: cover({ pal: TERAKOTA }), enter: "fade" }
      },
      steps: [
        { caption: "Klik Gaya di rel kiri. Tab Warna terbuka lebih dulu.", focus: LEFT, at: ED.rail.Gaya, click: true, show: ["tabs", "pane", "top", "bar"], mark: railBox("Gaya"), lens: { src: [0, 96, 384, 118], at: [300, 40] } },
        { caption: "Gulir ke daftar palet. Paling atas palet bawaan, berlabel Bawaan Kencana.", focus: PANELF, at: [250, 470], scroll: { id: "pane", dy: DY },
          mark: [PX, PAL_Y + 24 - DY, PW, 54], lens: { src: [80, PAL_Y - DY - 6, 302, 230] }, dur: 3.6 },
        { caption: "Klik satu palet, misalnya Terakota. Pratinjau langsung berganti warna.", focus: [[72, tRow - 40, 327, 136], PREVF], at: [230, tRow + 22], click: true, show: ["terra", "pv"],
          mark: [PX, tRow, PW, 44], lens: { src: [80, tRow - 40, 302, 138] }, dur: 3.8 }
      ]
    };
  })(),

  // ------------------------------------------------------------------------------------------- Gaya B: Custom
  "editor-gaya-warna": {
    title: "Mengatur warna sendiri di Custom",
    base: [shell("Gaya", "Gaya"), subtabs(0), warnaA(), scrollbar(157, 380), cover()],
    els: {
      pick: { svg: picker("#8E2818"), enter: "pop", origin: [115, PICK.y + PICK.h] },
      b: { svg: warnaB() + scrollbar(157, 330), enter: "fade" },
      gold: { svg: cover({ pal: { accent: GOLD, on: "#111111" } }), enter: "fade" }
    },
    steps: [
      { caption: "Di Custom ada lima warna: Latar, Kartu, Judul, Teks, Aksen.", focus: PANELF, at: [300, 440], mark: [PX, 291, PW, 294], lens: { src: [80, 218, 302, 372] }, dur: 3.6 },
      { caption: "Klik kotak warna di kiri Aksen. Pemilih warna Chrome terbuka.", at: [115, 558], click: true, show: ["pick"], mark: [97, 544, 36, 28], lens: { src: [80, 284, 302, 308], at: [290, 150] }, dur: 3.4 },
      { caption: "Pilih warna. Kodenya tampil di kanan, Custom diberi tanda dipakai.", focus: [[72, 154, 327, 450], PREVF], at: [PICK.x + 190, PICK.y + 40], click: true, hide: ["pick"], show: ["b", "gold"],
        mark: [PICK.x + 12, PICK.y + 12, PICK.w - 24, 104], lens: { src: [80, 545, 302, 60], at: [12, 420] }, dur: 3.8 },
      { caption: "Muncul Kurang kontras? Tulisan susah dibaca. Pilih warna lain.", focus: PANELF, at: [300, 637], mark: [PX, 609, PW, 56], lens: { src: [80, 605, 302, 116] }, dur: 3.6 },
      { caption: "Klik Kembali ke palet bawaan untuk membuang warna Custom.", focus: [[72, 224, 327, 62], [72, 600, 327, 130], PREVF], at: [160, 695], click: true, hide: ["b", "gold"],
        mark: nkBtnBox(PX, 677, "Kembali ke palet bawaan"), lens: { src: [80, 214, 302, 70], at: [12, 250] }, dur: 3.6 }
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
      base: [shell("Gaya", "Gaya"), subtabs(0), warnaA(), scrollbar(157, 380), cover()],
      els: {
        h0: { svg: H0 + hurufTabs([]), enter: "fade" },
        pane: { svg: H1, enter: "fade" },
        paneP: { svg: `<g transform="translate(0 -${DY})">${HP}</g>`, enter: "fade" },
        wpop: { svg: wpop, enter: "pop", origin: [PX + PW / 2, wy] },
        paneB: { svg: HB, enter: "fade", delay: 1.0 },
        tabs: { svg: hurufTabs([1]), enter: "fade" },
        bar: { svg: barMask(), enter: "fade" },
        big: { svg: cover({ scale: 1.15 }), enter: "fade" },
        pair: { svg: cover({ scale: 1.15, nameFont: PAIRS[1][3], nameSize: 44 }), enter: "fade" }
      },
      steps: [
        { caption: "Di menu Gaya, klik tab Huruf.", focus: PANELF, at: [227, 188], click: true, show: ["h0"], mark: [PX + PW / 3, BY, PW / 3, 38], lens: { src: [80, 160, 302, 128] } },
        { caption: "Di Ukuran teks, klik ikon Besar bila tamu banyak orang tua.", focus: [[72, 154, 327, 200], PREVF], at: [PX + PW - 30, P0.scale + 19], click: true, show: ["pane", "tabs", "bar", "big"],
          mark: [PX + (2 * PW) / 3, P0.scale, PW / 3, 38], lens: { src: [80, 281, 302, 69], at: [12, 262] }, dur: 3.6 },
        { caption: "Gulir ke Pasangan font, lalu klik yang kamu suka, misalnya Romantis.", focus: [[72, 296, 327, 232], PREVF], at: [230, 470], scroll: { id: "pane", dy: DY }, click: true, show: ["paneP", "pair"],
          mark: [PX, 416, PW, 108], lens: { src: [80, 412, 302, 116], at: [12, 24] }, dur: 4.2 },
        { caption: "Di Ketebalan, pilih Ketebalan teks, misalnya Tebal (700).", focus: PANELF, at: [230, P1.weight + 38], scroll: { id: "paneP", dy: -DY }, click: true, show: ["wpop", "paneB"],
          mark: [PX, P1.weight + 20, PW, 36], lens: { src: [80, P1.weight - 6, 302, 160] }, dur: 4.2 }
      ]
    };
  })(),

  // ------------------------------------------------------------------------------------------- Gaya D: font dari Google Fonts
  "editor-gaya-font": (() => {
    const [H0, P0] = huruf(), [HC, PC] = huruf({ font: "check" }), [HD, PD] = huruf({ font: "done" });
    const SDY = 250, base = [shell("Gaya", "Gaya"), subtabs(1), H0, cover()];
    return {
      title: "Memakai font sendiri dari Google Fonts",
      base,
      els: {
        // The new tab opens before step 2's click moves the focus: drawn as step 2 shows it (address bar, first font).
        gf: { svg: skeleton(googleFonts(false)) + clipped(0, 41, 1440, 44, googleFonts(false)) + clipped(24, 236, 1392, 260, googleFonts(false)), skel: false, enter: "fade", delay: 1.6 },
        spec: { svg: googleFonts(true), enter: "fade" },
        sel: { svg: gfSel, enter: "fade", delay: 1.0 },
        // Back to Scalev (2.2 s after the copy, before step 3's click moves the focus): drawn as step 3 shows it.
        ed: { svg: skeleton(base.join("\n")) + clipped(...PANELF, base.join("\n")), skel: false, enter: "fade", delay: 2.2 },
        chk: { svg: HC, enter: "fade" },
        done: { svg: HD, enter: "fade" },
        tabs1: { svg: hurufTabs([1]), enter: "fade" },
        bar: { svg: barMask(), enter: "fade" }
      },
      steps: [
        { caption: "Klik Buka Google Fonts di tab Huruf. Google Fonts terbuka di tab baru.", focus: PANELF, at: [PX + PW / 2, P0.gf + 18], click: true, show: ["gf"],
          mark: nkBtnBox(PX, P0.gf, "Buka Google Fonts", { w: PW, icon: "external-link" }), lens: { src: [80, P0.gf - 72, 302, 120] }, dur: 3.6 },
        { caption: "Klik font, misalnya Playfair Display. Salin alamatnya dari kolom alamat.", focus: [[0, 41, 1440, 44], [24, 236, 1392, 260]], at: [600, 290], click: true, show: ["spec", "sel", "ed"],
          mark: [{ box: OMNI, r: 17 }, { box: GF_ROW0, r: 12 }], lens: { src: [118, 44, 560, 40], at: [100, 92] }, dur: 4.2 },
        { caption: "Kembali ke Scalev. Tempel link di Font judul dan nama.", focus: PANELF, at: [230, P0.font + 38], click: true, hide: ["gf", "spec", "sel"], show: ["chk", "tabs1", "bar"],
          mark: [PX, P0.font + 20, PW, 36], lens: { src: [80, PC.font - 8, 302, 96] }, dur: 3.4 },
        { caption: "Tunggu Memeriksa ketebalan... Lalu nama font tampil di label kolom.", at: [230, PD.font + 12], hide: ["ed"], show: ["done"], mark: { box: [PX, PD.font, PW, 16], r: 2 },
          lens: { src: [80, PD.font - 8, 302, 72] }, dur: 3.8 },
        { caption: "Klik Kembali ke pasangan bawaan untuk membuang font Custom.", at: [PX + 90, PD.back - SDY + 18], scroll: { id: "done", dy: SDY }, click: true, hide: ["chk", "done", "tabs1", "bar"],
          mark: nkBtnBox(PX, PD.back - SDY, "Kembali ke pasangan bawaan"), note: "Kembali ke pasangan bawaan", dur: 3.8 }
      ]
    };
  })(),

  // ------------------------------------------------------------------------------------------- Gaya E: Bentuk dan Gerak
  "editor-gaya-bentuk": (() => {
    const [lembutW] = segW(PW, ["Lembut", "Tegas", "Lengkung"], 2);
    return {
      title: "Mengatur bentuk sudut dan gerak saat digulir",
      base: [shell("Gaya", "Gaya"), subtabs(0), warnaA(), scrollbar(157, 380), cover()],
      els: {
        b0: { svg: bentuk(), enter: "fade" },
        b1: { svg: bentuk(0), enter: "fade" },
        soft: { svg: cover({ shape: "soft" }), enter: "fade" },
        b2: { svg: bentuk(0, 2), enter: "fade" }
      },
      steps: [
        { caption: "Di menu Gaya, klik tab Bentuk.", focus: PANELF, at: [320, 188], click: true, show: ["b0"], mark: [PX + (2 * PW) / 3, BY, PW / 3, 38], lens: { src: [80, 160, 302, 128] } },
        { caption: "Klik Lembut: sudut tombol, kartu, dan bingkai foto jadi membulat.", focus: [[72, 154, 327, 220], PREVF], at: [128, SEG(0, false)], click: true, show: ["b1", "soft"],
          mark: [PX, SEG(0, false) - 19, lembutW, 38], lens: { src: [80, 281, 302, 73], at: [12, 262] }, dur: 3.8 },
        { caption: "Di Gerak pilih Tanpa, Halus, atau Hidup. Hidup bergerak lebih jauh.", focus: PANELF, at: [PX + PW - 30, SEG(1, true)], click: true, show: ["b2"],
          mark: [PX + (2 * PW) / 3, SEG(1, true) - 19, PW / 3, 38], lens: { src: [80, 360, 302, 110] }, dur: 3.8 }
      ]
    };
  })(),

  // ------------------------------------------------------------------------------------------- Lapisan
  "editor-lapisan-urutan": (() => {
    const O1 = swap(SECS, 7), O2 = swap(O1, 8), DY = 570; // Video up; then Galeri Foto down
    const [L0] = lapList(SECS), [L1] = lapList(O1, { button: true }), [L2, Q2] = lapList(O2, { button: true }), [L3] = lapList(O2, { off: "Video", button: true });
    const [R, QR] = lapList(SECS), [R2] = lapList(SECS, { dock: false });
    const up = (svg) => `<g transform="translate(0 -${DY})">${svg}</g>`, P = (list) => ({ svg: stack(list), enter: "fade" });
    const rows = [[72, rowY(6), 327, 150], PREVF], foot = [[72, Q2.btn - DY - 110, 327, 200], PREVF];
    const rowLens = { src: [80, rowY(6) + 1, 302, 148], at: [12, 60] };
    return {
      title: "Mengatur urutan dan menyembunyikan bagian di Lapisan",
      base: [shell("Template", "Template"), templatePanel(null), scrollbar(157, 360), stack(["galeri", "video", "acara"])],
      els: {
        tabs: { svg: railTabs("Lapisan"), enter: "fade" },
        lap: { svg: panelOpen("Lapisan") + L0, enter: "fade" },
        l1: { svg: L1, enter: "fade" }, l2: { svg: L2, enter: "fade" }, l3: { svg: L3, enter: "fade" }, l4: { svg: L2, enter: "fade" },
        r: { svg: up(R), enter: "fade" }, r2: { svg: up(R2), enter: "fade" },
        lhdr: { svg: nkHead(0, 0, "Lapisan") + line(72, 153, 399, 153, { stroke: C.line }), enter: "fade" },
        bar: { svg: barMask(), enter: "fade" },
        p1: P(["video", "galeri", "acara"]), p2: P(["video", "acara", "galeri"]), p3: P(["acara", "galeri", "dress"]), p4: P(["video", "acara", "galeri"]), p0: P(["galeri", "video", "acara"]),
        dock: kencana.dock()
      },
      steps: [
        { caption: "Klik Lapisan di rel kiri. Daftar bagian tampil sesuai urutan undangan.", focus: LEFT, at: ED.rail.Lapisan, click: true, show: ["tabs", "lap", "lhdr", "bar"],
          mark: railBox("Lapisan"), lens: { src: [0, 96, 384, 237], at: [300, 40] }, dur: 3.4 },
        { caption: "Klik panah naik di Video. Video naik, pratinjau ikut berubah.", focus: rows, at: [270, rowY(8) + 25], click: true, show: ["l1", "p1"], mark: [261, rowY(8) + 16, 18, 18], lens: rowLens, dur: 3.6 },
        { caption: "Klik panah turun di Galeri Foto. Rangkaian Acara kini di atasnya.", at: [304, rowY(8) + 25], click: true, hide: ["lap"], show: ["l2", "p2"], mark: [295, rowY(8) + 16, 18, 18], lens: rowLens, dur: 3.6 },
        { caption: "Matikan sakelar Video. Tertulis Disembunyikan, Video hilang dari pratinjau.", at: [342, rowY(7) + 25], click: true, hide: ["l1", "p1"], show: ["l3", "p3"], mark: { box: [324, rowY(7) + 15, 36, 20], r: 10 }, lens: rowLens, dur: 3.6 },
        { caption: "Nyalakan lagi sakelarnya. Video tampil lagi dengan isi yang sama.", at: [342, rowY(7) + 25], click: true, hide: ["l2", "p2"], show: ["l4", "p4"], mark: { box: [324, rowY(7) + 15, 36, 20], r: 10 }, lens: rowLens, dur: 3.6 },
        { caption: "Gulir ke bawah daftar, lalu klik Kembalikan urutan template.", focus: foot, at: [PX + 90, Q2.btn - DY + 18], scroll: { id: "l4", dy: DY }, click: true, hide: ["l3", "p3"], show: ["r", "p0"],
          mark: nkBtnBox(PX, Q2.btn - DY, "Kembalikan urutan template"), lens: { src: [80, Q2.btn - DY - 61, 302, 105], at: [12, 100] }, dur: 4 },
        { caption: "Paling bawah ada sakelar Menu bawah. Matikan bila tidak perlu.", at: [PX + PW - 18, QR.dock - DY + 20], click: true, hide: ["dock", "l4", "p4"], show: ["r2"],
          mark: { box: [PX + PW - 36, QR.dock - DY + 10, 36, 20], r: 10 }, lens: { src: [80, QR.dock - DY - 61, 302, 105], at: [12, 100] }, dur: 3.6 }
      ]
    };
  })(),

  // ------------------------------------------------------------------------------------------- Klik di pratinjau
  "editor-klik-aktif": (() => {
    const [kcol, p] = column([{ label: "Nama panggilan", value: "Rani", hint: "Tampil di sampul.", focus: true }, { label: "Nama lengkap dan gelar", value: "Rani Ayu, S.Psi." },
      { label: "Profesi atau bio singkat (opsional)", value: "Psikolog" }, { label: "Anak ke- (opsional)", value: "Putri kedua", hint: "Kosong: \"Putri dari\" / \"Putra dari\"." },
      { label: "Nama ayah", value: "Bapak Ahmad" }, { toggle: "Ayah sudah wafat (Alm.)", on: false }, { label: "Nama ibu", value: "Ibu Siti" }, { toggle: "Ibu sudah wafat (Almh.)", on: true }], ACC_X, 161, ACC_W);
    const nY = p["Nama panggilan"] + 20, NICK = [ACC_X, nY, ACC_W, 36];
    const TAG = "Sampul · klik untuk mengisi";
    const salamTop = SC.y + 784 - PAGE_DY;
    const [tbCover] = toolbar(SC.x + SC.w, SC.y + 6, ["Isi"]);
    const [tb, at, tbBox, tbBar] = toolbar(SC.x + SC.w, salamTop + 6, ["Isi", "↑", "↓", "Sembunyikan"]);
    const sections = kencana.salam(SC.y + 784) + kencana.ayat(SC.y + 1204) + kencana.mempelai(SC.y + 1534);
    const top = 0 - PAGE_DY;
    const panelTop = [72, 92, 327, 130], nickLens = { src: [ACC_X - 8, nY - 24, ACC_W + 16, 70], at: [12, 170] };
    // The toast label wraps next to Urungkan (styles.js .nk-toast: flex, gap 10).
    const SALAM = ["Salam Pembuka", "disembunyikan."], undo = nkToastBoxes(SALAM).undo, undoAt = [undo[0] + undo[2] / 2, undo[1] + undo[3] / 2];
    return {
      title: "Klik di pratinjau: form terbuka di kolom yang tepat",
      base: [shell("Template", "Template"), templatePanel(null), scrollbar(157, 360), cover()],
      els: {
        tabs: { svg: railTabs("Konten"), enter: "fade" },
        konten: { svg: panelOpen("Konten") + accFrame(154, 900) + kcol + scrollbar(420, 200) + nkHead(0, 0, "Konten") + line(72, 153, 399, 153, { stroke: C.line }), enter: "fade" },
        clr: { svg: white(ACC_X + 3, nY + 3, ACC_W - 6, 30), enter: "fade" },
        nama: { svg: text(ACC_X + 10, nY + 23, "Rania", { size: 14 }), enter: "fade" },
        busy: { svg: footStatus("Menulis...", C.changed), enter: "fade", delay: 0.4 },
        saved: { svg: footStatus("Tersimpan", C.ok), enter: "fade", delay: 1.9 },
        hover: { svg: frame(SC.y, SC.h, 2) + hoverTag(SC.x, SC.y, TAG), enter: "fade" },
        selCover: { svg: frame(SC.y, SC.h, 3) + tbCover, enter: "fade" },
        // The page after typing (new names, Sampul still selected); scrolled in step 5. The mask keeps the scrolled page
        // inside the preview screen.
        page: { svg: cover({ top: SC.y, names: "Rania & Dimas" }) + frame(SC.y, SC.h, 3) + tbCover + sections, enter: "fade" },
        mask: { svg: clipped(400, 0, 1040, SC.y, scalevEditor(0, 0, { rail: "Konten" })) + rect(400, SC.y + SC.h, 1040, 900 - SC.y - SC.h, { fill: C.svPreview }), enter: "fade" },
        pageS: { svg: screen(`<g transform="translate(0 ${top})">${cover({ top: SC.y, names: "Rania & Dimas" }) + sections}</g>`) + frame(salamTop, 420, 3) + tb, enter: "fade" },
        gone: { svg: screen(rect(SC.x, salamTop, SC.w, 900, { fill: KENCANA.bg }), kencana.ayat(salamTop), kencana.mempelai(salamTop + 330)), enter: "fade" },
        toast: { svg: nkToast(SALAM), enter: "slide" }
      },
      steps: [
        { caption: "Cek tombol di rel kiri: harus tertulis Klik aktif.", focus: TOOLS, at: ED.tool.Klik, mark: toolBox(725), lens: { src: [0, 566, 72, 232], zoom: 3 }, dur: 3.2 },
        { caption: "Arahkan mouse ke nama mempelai. Sampul diberi garis biru dan label.", focus: PREVF, at: [922, 492], hover: "hover",
          mark: [[SC.x, SC.y, tw(TAG, 12, 500) + 16, 22], NAMES], lens: { src: [SC.x - 4, SC.y - 4, 260, 44] }, dur: 3.4 },
        { caption: "Klik namanya. Mempelai terbuka, kursor langsung di Nama panggilan.", focus: [panelTop, PREVF], at: [922, 492], click: true, show: ["tabs", "konten", "selCover"],
          mark: NAMES, dur: 3.6 },
        { caption: "Ketik isi baru. Pratinjau ikut berubah, kaki rel Menulis... lalu Tersimpan.", focus: [panelTop, FOOT, PREVF], at: [ACC_X + 120, nY + 18], click: true,
          hide: ["selCover"], show: ["clr", "nama", "busy", "saved", "page", "mask"], type: [typed("nama", ACC_X + 10, nY + 8, "Rania")], mark: [NICK, FOOT_MARK], lens: nickLens, dur: 4.2 },
        { caption: "Gulir pratinjau, lalu klik bagian lain, misalnya Salam Pembuka.", focus: PREVF, at: [922, salamTop + 140], scroll: { id: "page", dy: PAGE_DY }, click: true, show: ["pageS"],
          mark: [SC.x, salamTop, SC.w, 420], lens: { src: [SC.x + SC.w - 250, salamTop + 1, 250, 78], at: [140, 190] }, dur: 3.8 },
        { caption: "Toolbar: Isi buka form, ↑ ↓ pindah bagian. Klik Sembunyikan.", focus: [nkToastBoxes(SALAM).toast, PREVF], at: at.Sembunyikan, click: true, show: ["gone", "toast"], mark: tbBox.Sembunyikan,
          note: "Sembunyikan", dur: 4 },
        { caption: "Muncul Salam Pembuka disembunyikan. Klik Urungkan untuk menampilkannya lagi.", focus: PREVF, at: undoAt, click: true, hide: ["toast", "gone"],
          mark: undo, note: "Urungkan", dur: 3.6 }
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
    const toolLens = { src: [0, 694, 72, 56], zoom: 3 };
    return {
      title: "Memakai Inspect bila Klik aktif tidak tersedia",
      base: [shell("Konten", "Konten"), insTool(false), kontenClosed(), cover()],
      els: {
        on: { svg: insTool(true), enter: "fade" },
        form: { svg: form, enter: "fade" },
        sel: { svg: rect(NAMES[0], NAMES[1], NAMES[2], NAMES[3], { fill: "rgba(30,136,229,.12)", stroke: "#1e88e5", sw: 2 }), enter: "fade" }
      },
      steps: [
        { caption: "Klik Inspect di rel. Tulisannya berubah menjadi Inspect aktif.", focus: TOOLS, at: [36, 725], click: true, show: ["on"], mark: toolBox(725), lens: toolLens, dur: 3.4 },
        { caption: "Klik bagian di pratinjau. Formnya terbuka di Konten, tanpa toolbar.", focus: [[72, GROUPS_Y - 10, 327, 300], PREVF], at: [922, 492], click: true, show: ["sel", "form"],
          mark: NAMES, lens: { src: [80, GROUPS_Y - 6, 302, 118], at: [12, 410] }, dur: 3.8 },
        { caption: "Selesai? Klik Inspect aktif lagi untuk mematikan.", focus: TOOLS, at: [36, 725], click: true, hide: ["on"], mark: toolBox(725), lens: toolLens, dur: 3.4 }
      ]
    };
  })(),

  // ------------------------------------------------------------------------------------------- Urungkan dan Ulangi
  "editor-urungkan-ulangi": (() => {
    const NICK = [ACC_X, NICK_Y, ACC_W, 36], UNDO = [8, 621, 24, 24], REDO = [40, 621, 24, 24];
    const focus = [[0, 612, 72, 42], [ACC_X - 8, NICK_Y - 26, ACC_W + 16, 70], PREVF], nickLens = { src: [ACC_X - 8, NICK_Y - 26, ACC_W + 16, 70], at: [12, 230] };
    const tips = [[8, 652, tw("Urungkan (Ctrl+Z)", 12) + 16, 24], [40, 684, tw("Ulangi (Ctrl+Shift+Z)", 12) + 16, 24]];
    return {
      title: "Mengurungkan dan mengulangi perubahan",
      base: [shell("Konten", "Konten"), priaPanel("Dimaz"), cover({ names: "Rani & Dimaz" })],
      els: {
        tipU: { svg: tooltip(8, 652, "Urungkan (Ctrl+Z)") + tooltip(40, 684, "Ulangi (Ctrl+Shift+Z)"), enter: "fade", delay: 0.6 },
        fix: { svg: nickFix("Dimas") + rect(38, 622, 30, 24, { fill: C.page }) + icon("redo-2", 52, 633, 16, C.text), enter: "fade" },
        redo: { svg: nickFix("Dimaz") + rect(38, 622, 30, 24, { fill: C.page }) + icon("redo-2", 52, 633, 16, C.off), enter: "fade" }
      },
      steps: [
        { caption: "Di bawah Bagikan ada dua panah: kiri Urungkan, kanan Ulangi.", focus: [[0, 612, 72, 42], ...tips], at: ED.tool.Urungkan, show: ["tipU"], mark: [UNDO[0], UNDO[1], REDO[0] + REDO[2] - UNDO[0], 24],
          note: "Urungkan dan Ulangi", dur: 3.8 },
        { caption: "Klik panah kiri. Perubahan terakhir batal: nama kembali Dimas.", focus, at: ED.tool.Urungkan, click: true, hide: ["tipU"], show: ["fix"], mark: [NICK, UNDO], lens: nickLens, dur: 3.6 },
        { caption: "Kebablasan? Klik panah kanan untuk mengulangi perubahan tadi.", at: ED.tool.Ulangi, click: true, show: ["redo"], mark: [NICK, REDO], lens: nickLens, dur: 3.6 }
      ]
    };
  })(),

  // ------------------------------------------------------------------------------------------- Kosongkan
  "editor-kosongkan": (() => {
    const batalX = 16 + tw("Kosongkan halaman", 12, 500) + 52;
    const dlg = nkDialogHead(0, 0, "Kosongkan halaman?") + nkNote(16, BY, 367, ["Isi undangan dihapus. Ucapan dan RSVP aman. Bisa", "diurungkan."], { tone: "warn" }) +
      nkBtn(16, 237, "Kosongkan halaman", { variant: "danger", icon: "eraser" }) + quiet(batalX, 237, "Batal");
    const dlgTop = [0, 92, 399, 182];
    return {
      title: "Mengosongkan halaman dan mengurungkannya",
      base: [shell("Konten", "Konten"), priaPanel("Dimas"), cover()],
      els: {
        red: { svg: rect(0, 752, 71, 46, { fill: C.page }) + icon("eraser", 36, 765, 18, C.danger) + text(36, 788, "Kosongkan", { size: 10, fill: C.danger, anchor: "middle" }), enter: "fade" },
        dlg: { svg: dlg, enter: "pop", origin: [36, 773], delay: 0.3 },
        emptyPanel: { svg: railTabs("Template") + panelOpen("Template") + templatePanel(null) + scrollbar(157, 360), enter: "fade" },
        emptyPrev: { svg: rect(SC.x, SC.y, SC.w, SC.h, { fill: C.white }), enter: "fade" },
        toast: { svg: nkToast("Halaman dikosongkan."), enter: "slide", delay: 0.4 }
      },
      steps: [
        { caption: "Di rel kiri, klik Kosongkan (judul tombol: Kosongkan halaman).", focus: [dlgTop, TOOLS], at: ED.tool.Kosongkan, hover: "red", click: true, show: ["dlg"],
          mark: toolBox(773), note: "Kosongkan", dur: 3.4 },
        { caption: "Baca jendela Kosongkan halaman?: Ucapan dan RSVP aman. Bisa diurungkan.", focus: dlgTop, at: [260, BY + 30], mark: [16, BY, 367, 56], lens: { src: [8, 100, 390, 190] }, dur: 4 },
        { caption: "Klik Kosongkan halaman untuk lanjut, atau Batal (Esc) untuk mundur.", at: [90, 255], click: true, hide: ["dlg"], show: ["emptyPanel", "emptyPrev"],
          mark: [16, 237, nkBtnBox(batalX, 237, "Batal")[0] + nkBtnBox(batalX, 237, "Batal")[2] - 16, 36], note: "Kosongkan halaman atau Batal", dur: 3.8 },
        { caption: "Menu Template terbuka, pratinjau kosong. Muncul pesan Halaman dikosongkan.", focus: [[72, 92, 327, 166], TOAST, PREVF], show: ["toast"],
          mark: TOAST, lens: { src: TOAST, at: [12, 430] }, dur: 3.6 },
        { caption: "Berubah pikiran? Klik Urungkan di pesan itu. Undangan kembali utuh.", focus: PREVF, at: URUNG_AT, click: true, hide: ["toast", "emptyPrev"],
          mark: URUNG_BOX, note: "Urungkan", dur: 3.6 }
      ]
    };
  })(),

  // ------------------------------------------------------------------------------------------- Dijeda
  "editor-dijeda-timpa": (() => {
    const [kcol] = column([{ label: "Bahasa undangan", value: "Indonesia", select: true }], PX, BY + 138, PW);
    const rest = kcol + text(PX, BY + 226, "Urutan dan tampilan bagian di Lapisan.", { size: 12, fill: C.faint }) +
      ["Sampul", "Mempelai", "Acara & Tanggal", "Salam Pembuka", "Ayat / Kutipan", "Kisah Cinta", "Galeri Foto", "Video"].map((g, i) => nkAcc(PX, BY + 242 + i * 58, PW, g, { badge: "Terisi" })).join("");
    const banner = [72, 154, 327, 150], fixedTop = [72, 154, 327, 172], bannerLens = { src: [80, 160, 300, 145] };
    return {
      title: "NikahKit dijeda karena kode diubah manual",
      base: [shell("Konten", "Konten", { saving: "Dijeda" }), white(72, 154, 327, 746), driftBanner(), rest, scrollbar(157, 300), cover()],
      els: {
        code: { svg: clipped(0, 0, 399, 92, scalevEditor(0, 0, { tab: "Code" })) + codeView(), enter: "fade" },
        fixed: { svg: white(72, 154, 327, 746) + text(PX, BY + 12, "Bahasa undangan", { size: 12, weight: 500 }) + nkInput(PX, BY + 20, PW, "Indonesia", { select: true }) +
          text(PX, BY + 88, "Urutan dan tampilan bagian di Lapisan.", { size: 12, fill: C.faint }) +
          ["Sampul", "Mempelai", "Acara & Tanggal", "Salam Pembuka", "Ayat / Kutipan", "Kisah Cinta", "Galeri Foto", "Video", "Rangkaian Acara", "Dress Code"].map((g, i) => nkAcc(PX, BY + 104 + i * 58, PW, g, { badge: "Terisi" })).join("") +
          scrollbar(157, 300) + footStatus("Tersimpan", C.ok), enter: "fade" }
      },
      steps: [
        { caption: "Kaki rel menunjukkan Dijeda. Baca kotak kuning di atas panel.", focus: [FOOT, banner], at: [36, 878], mark: [[PX, BY, PW, 126], FOOT_MARK], lens: bannerLens, dur: 3.8 },
        { caption: "Klik Lihat di kode. Tab Code terbuka, bagian yang diubah ditandai.", focus: [0, 44, 399, 300], at: [150, BY + 54], click: true, show: ["code"],
          mark: nkBtnBox(PX + 12, BY + 36, "Lihat di kode", { icon: "code-xml" }), lens: { src: [0, 96, 399, 120], at: [290, 60] }, dur: 3.8 },
        { caption: "Putuskan: tidak penting? Lanjut. Penting? Salin dulu, atau Ctrl+Z di Code.", at: [250, 204], mark: { box: [40, 193, 359, 22], r: 0 }, lens: { src: [0, 100, 399, 116], at: [290, 60] }, dur: 4 },
        { caption: "Kembali ke tab NikahKit di strip atas editor Scalev.", focus: [0, 44, 399, 48], at: ED.tab.NikahKit, click: true, hide: ["code"], mark: [228, 54, 84, 28], lens: { src: [0, 44, 340, 48] }, dur: 3.4 },
        { caption: "Klik Timpa dengan NikahKit. Perubahan manual dibuang, bisa diurungkan.", focus: [fixedTop, FOOT], at: [180, BY + 98], click: true, show: ["fixed"],
          mark: nkBtnBox(PX + 12, BY + 80, "Timpa dengan NikahKit"), note: "Timpa dengan NikahKit", dur: 3.6 },
        { caption: "Kotak kuning hilang, kaki rel kembali Tersimpan. Lalu Simpan di Scalev.", focus: [FOOT, fixedTop, [1180, 44, 260, 48]], at: [36, 878], mark: [FOOT_MARK, ED.simpanBox],
          lens: { src: [0, 846, 72, 54], zoom: 3 }, dur: 3.6 }
      ]
    };
  })()
};
// Every element here is a state of the screen (lib `skel`: skeleton outside the focus, detail inside) unless it says
// skel: false (screens shown before a click moves the focus, drawn with that later focus already).
export const scenes = Object.fromEntries(Object.entries(SCENES).map(([name, s]) =>
  [name, { ...s, els: Object.fromEntries(Object.entries(s.els).map(([id, e]) => [id, { skel: true, ...(typeof e === "string" ? { svg: e } : e) }])) }]));
