// Animated SVG walkthroughs for the panduan (v4: one full desktop screen, focus + skeleton, precise marks, lens).
//
// Every scene is ONE desktop screen of 1440x900 real pixels (the size the Scalev editor was measured at), always shown
// whole on a 960x600 stage (scale 2/3) with the caption bar below: no crop, no camera movement. Pages that live on a
// phone (couple dashboard, guest invitation, staff) are a plain 390x844 phone screen at PHONE in that desktop
// (phoneDesk). Per step only what the step discusses is drawn in detail (`focus`); the rest of the base is shown as a
// skeleton of itself (text = bars of its width, colours = light greys), so every block keeps its real place and size.
// The element to act on gets a precise ring (`mark`) with the step number, and a straight arrow from a 2x lens or a
// note to the ring's nearest edge. Measurements come from the real UIs (captured 14 Okt 2026).
// This file is the compiler and its primitives; drawings of the real screens live in ui/ (kit.mjs: shared widgets and
// shells, then one module per screen), and scenes/ compose them without importing each other.
//
// Scene shape:
//   { title, desc?, bg?, base: [svg], els: { id: svg | { svg, enter, origin, delay, skel } }, cursorStart?: [x, y],
//     steps: [{ caption, dur?, focus, mark?, lens?, note?, at?, click?, press?, show?, hide?, type?, scroll?, hover? }] }
//   base:  the whole 1440x900 screen in detail; its skeleton is derived (skeleton()). els are drawn above the base,
//          as given; `skel: true` makes one part of the screen like the base (a panel state): skeleton outside the
//          focus, detail inside it.
//   focus: [x, y, w, h] | [[x, y, w, h], ...] | "all" | "none": base parts drawn in detail. Later steps inherit it; the
//          first step must set it.
//   mark:  [x, y, w, h] | { box: [x, y, w, h], r } | [...]: exact world bounds and corner radius (default 4) of the
//          element to act on. Stage ring: 2.5 px, 4 px outside, radius r*2/3 + 4, step number on its top-left corner.
//   lens:  { src: [x, y, w, h], at?: [sx, sy], zoom? }: magnifier of world rect src at `zoom` (default 2) x the stage,
//          placed at stage point `at` or beside the mark (clear of it, the focus and the pointer), with an arrow to
//          what it magnifies (the ring over src, else src). Use it when focused text is under ~20 px in the world (it
//          would be under ~11 px in the docs). On a click step a lens away from the click shows the result, from it.
//   note:  "text" | { text, at }: a pill placed like a lens, with an arrow to the first ring (steps without a lens).
//   at/click/press/show/hide/type/scroll/hover: pointer target (world px), ripple, press dip, visibility, typing,
//          scroll, hover; on a click step show/hide/type happen at the click.
// Reduced motion: the final state of every element, no pointer.

import { ICONS } from "../../nikahkit/src/icons.js";

export const WORLD = { w: 1440, h: 900 }, PHONE = { x: 525, y: 28, w: 390, h: 844 };
const W = 960, VH = 600, FIT = W / WORLD.w; // stage (caption bar below), world -> stage scale
const EASE_OUT = "cubic-bezier(0.23,1,0.32,1)", EASE_IN_OUT = "cubic-bezier(0.77,0,0.175,1)";
const FONT = `Roboto,-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif`;

// ---- Tokens (NikahKit: nikahkit/src/ui/base.css; Scalev/Chrome: measured) ---------------------------------------
export const C = {
  // NikahKit panel (base.css --sv-*)
  primary: "#0899cf", action: "#0779a6", primarySoft: "#e8f6fb", surface: "#ffffff", page: "#f6f9fc", mutedBg: "#f2f5fa",
  text: "#5b6675", strong: "#223548", faint: "#6b7480", line: "#eaeaeb", field: "#d5dae1", off: "#cbd2da",
  danger: "#b42318", dangerSoft: "#fef3f2", warn: "#b45309", warnStrong: "#9a3412", warnSoft: "#fff7ed", changed: "#f59e0b",
  ok: "#166534", okSoft: "#e8f9ef", toastLink: "#7fd3f5",
  // Scalev chrome
  svTop: "#4497ca", svDivider: "#dcdfe4", svPreview: "#f3f5f9", svTab: "#5b6675", svTabOn: "#0f161e", svBtnLine: "#e8ebef", svEditOk: "#15c15d",
  // Chrome browser (light)
  crFrame: "#dfe3eb", crTab: "#ffffff", crOmni: "#e9eef6", crIcon: "#474747", crText: "#1f1f1f", crSub: "#5e5e5e", crBlue: "#0b57d0", crBlueSoft: "#d3e3fd",
  // Couple dashboard (server/pages/src/panel: WhatsApp light tokens)
  wa: "#1daa61", waStrong: "#15603e", waSoft: "#d9fdd3", waText: "#0a0a0a", waSub: "rgba(0,0,0,.6)", waLine: "rgba(0,0,0,.1)", waWash: "#f7f5f3",
  // Guide brand (caption bar)
  cocoa: "#2b1a07", accent: "#b8460d", tint: "#f7efe9", ink: "#1f1f1f", white: "#ffffff"
};

// ---- Primitives ----------------------------------------------------------------------------------------------------
export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const attrs = (o) => Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== false).map(([k, v]) => ` ${k}="${esc(v)}"`).join("");
export const rect = (x, y, w, h, o = {}) => `<rect${attrs({ x, y, width: w, height: h, rx: o.r ?? 0, fill: o.fill ?? "none", stroke: o.stroke, "stroke-width": o.stroke ? o.sw ?? 1 : undefined, "stroke-dasharray": o.dash, opacity: o.opacity })}/>`;
// s: a string, or the runs of one line in mixed styles: each a string (styled like the line) or { t, w?, fill?, u?, size? }
// (a bold run, an underlined link, a smaller count); a run sets only what it names. Runs keep their spaces (xml:space).
const run = (p) => (typeof p === "string" ? esc(p) : `<tspan${attrs({ "font-weight": p.w, fill: p.fill, "font-size": p.size, "text-decoration": p.u ? "underline" : undefined })}>${esc(p.t)}</tspan>`);
export const text = (x, y, s, o = {}) => `<text${attrs({ x, y, "font-size": o.size ?? 14, "font-weight": o.weight, fill: o.fill ?? C.strong, "text-anchor": o.anchor, "font-family": o.mono ? "'Roboto Mono',ui-monospace,Menlo,monospace" : o.font, "font-style": o.italic ? "italic" : undefined, "text-decoration": o.underline ? "underline" : undefined, "xml:space": Array.isArray(s) ? "preserve" : undefined })}>${Array.isArray(s) ? s.map(run).join("") : esc(s)}</text>`;
export const line = (x1, y1, x2, y2, o = {}) => `<line${attrs({ x1, y1, x2, y2, stroke: o.stroke ?? C.line, "stroke-width": o.sw ?? 1, "stroke-linecap": o.cap })}/>`;
export const circle = (cx, cy, r, o = {}) => `<circle${attrs({ cx, cy, r, fill: o.fill ?? "none", stroke: o.stroke, "stroke-width": o.stroke ? o.sw ?? 1 : undefined })}/>`;
export const group = (o, ...kids) => `<g${attrs({ transform: o.transform, opacity: o.opacity, "clip-path": o.clip })}>${kids.join("")}</g>`;
export const para = (x, y, lines, o = {}) => `<text${attrs({ x, y, "font-size": o.size ?? 14, fill: o.fill ?? C.strong, "font-weight": o.weight, "text-anchor": o.anchor })}>${lines.map((l, i) => `<tspan x="${x}" dy="${i ? (o.lh ?? Math.round((o.size ?? 14) * 1.43)) : 0}">${esc(l)}</tspan>`).join("")}</text>`;
// Box helpers for [x, y, w, h]: its centre, and the box grown by d on every side.
export const mid = (b) => [b[0] + b[2] / 2, b[1] + b[3] / 2];
export const grow = (b, d) => [b[0] - d, b[1] - d, b[2] + 2 * d, b[3] + 2 * d];
// Approximate text width, a flat average per character: on median 5-8% wider than a Mac draws the text, though one
// short label can come out up to 20% narrower. The measure for text that fills a column: every line wrap() makes in
// the guide keeps inside its column on a Mac (checked 14 Okt 2026), and older layouts are built on it. A box that hugs
// its own label (badge, pill) and the skeleton bars use textWidth().
export const tw = (s, size = 14, weight = 400) => Math.round(String(s).length * size * (weight >= 600 ? 0.57 : weight >= 500 ? 0.55 : 0.53));
// Glyph advances (per 100 px) of the SVG font stack as Chrome draws it on macOS, for weights 400/500/600/700
// (measured 14 Okt 2026). At UI sizes macOS switches to SF's text design, which runs wider (OPSZ: median ratio over
// the guide's 1851 texts, measured the same day, p05-p95 within 3% of it). Other systems draw the stack narrower
// (Roboto on Android about 10% at 14 px), so textWidth() is the width a Mac draws, the widest: a box sized from it
// holds its text everywhere, and a skeleton bar ends where the text ends on a Mac.
const GLYPHS = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~…·•🤍←›×–▸©⌘»→⇣↻“”±↑↓ابحرسلمنهي";
const ADV = Object.fromEntries(Object.entries({
  400: "21 27 40 60 60 81 67 25 32 32 40 60 21 43 21 28 61 44 57 59 60 59 62 55 60 62 21 21 60 60 60 49 87 64 60 69 68 55 53 71 70 22 50 60 52 83 70 73 58 73 60 59 58 70 63 92 63 61 62 32 28 32 60 53 50 50 55 50 55 51 30 55 54 21 21 49 20 80 53 53 55 55 31 47 30 53 48 72 47 49 47 32 22 32 60 59 21 43 100 91 40 60 53 43 85 92 62 91 87 82 36 36 60 78 78 23 89 62 34 108 62 51 61 43 72",
  500: "20 28 42 62 62 84 68 26 34 34 42 62 22 43 22 29 62 46 58 60 62 60 63 56 62 63 22 22 62 62 62 50 88 65 62 69 69 56 53 71 71 24 52 62 53 84 70 74 59 74 61 61 59 70 65 94 65 63 62 34 29 34 62 54 50 52 57 52 57 53 32 56 55 22 22 50 22 82 54 55 56 56 33 48 32 54 50 74 49 50 48 34 22 34 62 62 22 43 100 92 41 62 54 43 85 92 63 92 87 82 38 38 62 79 79 24 91 65 35 112 64 53 64 46 75",
  600: "20 30 44 63 63 86 69 26 36 36 43 63 23 44 23 30 64 47 59 62 63 61 64 56 63 64 23 23 63 63 63 52 88 67 63 70 69 57 54 72 72 25 54 64 54 85 71 75 60 75 63 62 59 70 66 95 67 65 63 36 30 36 63 56 50 53 58 53 58 54 34 58 57 23 23 52 23 84 56 56 58 58 35 50 34 56 51 77 51 52 49 36 23 36 63 65 23 44 100 93 41 63 56 44 85 93 65 93 87 83 40 40 63 80 80 25 93 67 37 117 66 56 67 48 78",
  700: "20 32 46 64 65 89 70 27 38 38 45 65 24 44 24 30 66 48 60 63 65 63 65 57 65 65 24 24 65 65 65 53 89 69 64 71 70 57 55 73 73 26 56 65 54 86 71 75 62 75 64 63 60 71 68 97 69 67 63 38 30 38 65 58 50 55 60 55 60 56 36 59 58 24 24 54 24 86 58 57 59 59 36 51 36 58 53 79 53 54 51 38 24 38 65 68 24 44 100 94 42 65 58 44 85 94 66 94 87 84 43 43 65 82 82 26 94 69 38 121 68 58 69 50 80"
}).map(([w, s]) => [w, s.split(" ").map(Number)]));
const GLYPH = new Map([...GLYPHS].map((c, i) => [c, i]));
const OPSZ = [[10, 1.143], [12, 1.113], [14, 1.091], [16, 1.071], [18, 1.051], [20, 1.037], [24, 1.023], [36, 1.019], [48, 1.009]];
const opsz = (size) => {
  const i = OPSZ.findIndex(([s]) => s >= size);
  if (i <= 0) return OPSZ.at(i)[1]; // below 10 px: as 10 px; above 48 px: as 48 px
  const [[s0, r0], [s1, r1]] = [OPSZ[i - 1], OPSZ[i]];
  return r0 + ((r1 - r0) * (size - s0)) / (s1 - s0);
};
// Width a line of text takes: glyph advances at its size (combining marks take none, unlisted glyphs 0.6 em,
// monospace 0.6 em each) plus letter-spacing between glyphs.
export const textWidth = (s, size = 14, weight = 400, { mono = false, spacing = 0 } = {}) => {
  const adv = ADV[weight >= 650 ? 700 : weight >= 550 ? 600 : weight >= 450 ? 500 : 400];
  const glyphs = [...String(s).replace(/\u00a0/g, " ")].filter((c) => !/\p{Mn}/u.test(c));
  const em = glyphs.reduce((t, c) => t + (mono ? 60 : adv[GLYPH.get(c)] ?? 60), 0) / 100;
  return +(em * size * (mono ? 1 : opsz(size)) + spacing * Math.max(0, glyphs.length - 1)).toFixed(1);
};
// One WhatsApp line ending in inline code (`482913`): the lead text, then the code in monospace on a light rounded box,
// as WhatsApp draws a backticked span in a bubble (the backticks themselves are hidden).
export const waCode = (x, y, lead, code, o = {}) => {
  const size = o.size ?? 14, cx = x + textWidth(lead, size), w = textWidth(code, size - 1, 400, { mono: true }) + 8;
  return text(x, y, lead, { size, fill: o.fill }) + rect(cx, y - size + 1, w, size + 5, { r: 4, fill: "rgba(0,0,0,.07)" }) +
    text(cx + 4, y, code, { size: size - 1, mono: true, fill: o.fill });
};
// Greedy word wrap to a width; a word longer than the width (a URL) is split where the line is full. measure: tw
// (keeps every line inside its column on every system) or textWidth (breaks where a Mac breaks, as clamp() needs).
export function wrap(s, width, size = 14, weight = 400, measure = tw) {
  const lines = [], fits = (t) => measure(t, size, weight) <= width;
  for (let w of String(s).split(" ")) {
    const last = lines.at(-1);
    if (last && fits(last + " " + w)) { lines[lines.length - 1] = last + " " + w; continue; }
    for (let cs = [...w]; cs.length > 1 && !fits(w); cs = [...w]) {
      let k = cs.length - 1;
      while (k > 1 && !fits(cs.slice(0, k).join(""))) k--;
      lines.push(cs.slice(0, k).join(""));
      w = cs.slice(k).join("");
    }
    lines.push(w);
  }
  return lines;
}
// Text cut with an ellipsis as CSS does it: n = 1 is text-overflow on one unwrapped line (cut at a character), n > 1
// is line-clamp (whole words on n lines, the last one cut to fit its ellipsis). Breaks where a Mac breaks.
export function clamp(s, width, n = 1, size = 14, weight = 400) {
  const fits = (t) => textWidth(t, size, weight) <= width, ls = n === 1 ? [String(s)] : wrap(s, width, size, weight, textWidth);
  if (ls.length <= n && fits(ls.at(-1))) return ls;
  let last = ls[n - 1];
  while (last.length > 1 && !fits(last + "…")) last = last.slice(0, -1);
  return [...ls.slice(0, n - 1), last.trimEnd() + "…"];
}
// Clip children to a rect (scrolling panels, truncated text) or to any shape markup (clipShape: an arch path, a rounded
// rect). The id comes from the shape itself, so a build never renumbers clips in unrelated scenes; equal shapes share
// one identical clipPath, which is harmless.
const clipId = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193); return "k" + (h >>> 0).toString(36); };
const clipBy = (key, shape, kids) => { const id = clipId(key); return `<defs><clipPath id="${id}">${shape}</clipPath></defs><g clip-path="url(#${id})">${kids.join("")}</g>`; };
export const clipped = (x, y, w, h, ...kids) => clipBy(`${x},${y},${w},${h}`, `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`, kids);
export const clipShape = (shape, ...kids) => clipBy(shape, shape, kids);
export const shadow = (x, y, w, h, r = 8, d = 1) => rect(x, y + 2 * d, w, h, { r, fill: "rgba(16,24,40,.08)" }) + rect(x - d, y + d * 4, w + 2 * d, h, { r: r + 2, fill: "rgba(16,24,40,.04)" });

// Lucide icon from nikahkit/src/icons.js (the exact icons the NikahKit panel shows). size in px, centred at (cx, cy).
export function icon(name, cx, cy, size = 20, color = C.text, sw = 2) {
  const body = ICONS[name];
  if (body === undefined) throw new Error(`icon "${name}" tidak ada di nikahkit/src/icons.js`);
  const s = size / 24, solid = typeof body === "object";
  const inner = solid ? body.svg ?? body.body ?? "" : body;
  return `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${s})" fill="${solid ? color : "none"}" stroke="${solid ? "none" : color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`;
}
// A few icons the panel set lacks (Scalev and Chrome chrome), drawn in the same 24px stroke style.
const EXTRA = {
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  "arrow-left": '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  "arrow-right": '<path d="m12 5 7 7-7 7"/><path d="M5 12h14"/>',
  "rotate-cw": '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
  puzzle: '<path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"/>',
  "more-vertical": '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  "file-text": '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  "panel-left": '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>',
  folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  "refresh-ccw": '<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>',
  home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  "credit-card": '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
  package: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/>',
  "shopping-cart": '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>'
};
export const iconX = (name, cx, cy, size = 20, color = C.text, sw = 2) => {
  if (EXTRA[name]) return `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${EXTRA[name]}</g>`;
  return icon(name, cx, cy, size, color, sw);
};

// ---- Skeleton -------------------------------------------------------------------------------------------------------
// The same drawing as a skeleton: every text becomes a rounded bar of its glyph width, colours become light greys
// (alpha kept; near-white surfaces keep their lightness but lose their hue, so a skeleton is one neutral family with
// no green badge or cream page showing through), so each block keeps its real place and size. A pure string
// transform, so it works on primitives and raw markup alike; compile() applies it to the world outside the focus.
const SK = { bar: "#dde2e8", fill: "#eceff3", line: "#e0e4e9" };
const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
function skColor(kind, v) {
  if (v === "none" || v === "transparent" || v === "currentColor" || v === "white") return v;
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(v), rgba = /^rgba?\(([^)]*)\)$/.exec(v);
  const h = hex && (hex[1].length === 3 ? hex[1].replace(/./g, "$&$&") : hex[1]);
  const [r, g, b, a = 1] = hex ? [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) : rgba ? rgba[1].split(",").map(parseFloat) : [0, 0, 0];
  if ((hex || rgba) && lum(r, g, b) > 238) {
    if (Math.max(r, g, b) - Math.min(r, g, b) <= 10) return v; // white and neutral page greys stay exactly
    const l = Math.round(lum(r, g, b)), n = l.toString(16).padStart(2, "0");
    return hex ? `#${n}${n}${n}` : `rgba(${l},${l},${l},${a})`;
  }
  if (rgba) return `rgba(214,219,226,${a})`;
  return kind === "fill" ? SK.fill : SK.line;
}
const attr = (a, k) => new RegExp(`(?:^|\\s)${k}="([^"]*)"`).exec(a)?.[1];
const unesc = (s) => s.replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
// One bar per line. A tspan with an x starts a line (para()); other tspans (a bold run) and bare text continue the
// line they are on, each run measured at its own weight and size.
function textBars(attrs, body) {
  const x0 = +(attr(attrs, "x") ?? 0), y0 = +(attr(attrs, "y") ?? 0), size = +(attr(attrs, "font-size") ?? 14), weight = +(attr(attrs, "font-weight") ?? 400), anchor = attr(attrs, "text-anchor");
  const metrics = { mono: /mono/i.test(attr(attrs, "font-family") ?? ""), spacing: +(attr(attrs, "letter-spacing") ?? 0) };
  const pinned = !/<tspan/.test(body) && attr(attrs, "textLength"); // a measured line width wins over the glyph estimate
  const lines = [{ x: x0, y: y0, runs: [] }];
  let y = y0;
  for (const [, a, inner, bare] of body.matchAll(/<tspan\b([^>]*)>([\s\S]*?)<\/tspan>|([^<]+)/g)) {
    if (bare !== undefined) { lines.at(-1).runs.push([unesc(bare), weight, size]); continue; }
    y += +(attr(a, "dy") ?? 0);
    if (attr(a, "x") !== undefined) lines.push({ x: +attr(a, "x"), y, runs: [] });
    lines.at(-1).runs.push([unesc(inner), +(attr(a, "font-weight") ?? weight), +(attr(a, "font-size") ?? size)]);
  }
  return lines.map(({ x, y: ly, runs }) => {
    const s = runs.map(([t]) => t).join("");
    if (!s.trim()) return "";
    const lead = s.length - s.trimStart().length, tail = s.trimEnd().length;
    let at = 0; // trim the line's outer whitespace, then sum the runs
    const width = runs.reduce((sum, [t, wt, sz]) => { const from = Math.max(lead - at, 0), to = Math.min(tail - at, t.length); at += t.length; return to > from ? sum + textWidth(t.slice(from, to), sz, wt, metrics) : sum; }, 0);
    const w = pinned ? +pinned : +width.toFixed(1), h = Math.max(3, +(size * 0.5).toFixed(1)), bx = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
    return `<rect x="${+bx.toFixed(1)}" y="${+(ly - size * 0.62).toFixed(1)}" width="${w}" height="${h}" rx="${h / 2}" fill="${SK.bar}"/>`;
  }).join("");
}
export const skeleton = (svg) => String(svg)
  .replace(/\b(fill|stroke)="([^"]+)"/g, (m, k, v) => `${k}="${skColor(k, v)}"`)
  .replace(/<text\b([^>]*)>([\s\S]*?)<\/text>/g, (m, a, b) => textBars(a, b));

// ---- Compiler -------------------------------------------------------------------------------------------------------
// compile(scene) runs in phases: validate the scene, time the steps, give each element its visibility windows and
// motion (typing, scroll, press), cut the focus zones, place each step's marks, lenses and notes, move the pointer,
// write the caption bar, then assemble one SVG.
const POINTER = `<path d="M0 0 L0 20 L5.5 15 L9.5 24 L13 22.5 L9 13.8 L16.5 13.8 Z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>`;
const KEYS = new Set(["caption", "dur", "focus", "mark", "lens", "note", "at", "click", "press", "show", "hide", "type", "scroll", "hover"]);
const REDUCE = `@media (prefers-reduced-motion:reduce){*{animation:none!important}#cur{display:none}}`;
const MOVE = 0.6; // shortest time (s) the pointer takes to reach a step's `at`
const rectsOf = (f) => (f === "all" || f === "none" ? [] : Array.isArray(f[0]) ? f : [f]);
const marksOf = (m) => (!m ? [] : Array.isArray(m) && Array.isArray(m[0]) ? m.map((b) => ({ box: b })) : Array.isArray(m) && typeof m[0] === "object" ? m : [Array.isArray(m) ? { box: m } : m]);
const overlap = (a, b, pad = 0) => a[0] < b[0] + b[2] + pad && b[0] < a[0] + a[2] + pad && a[1] < b[1] + b[3] + pad && b[1] < a[1] + a[3] + pad;
const hits = (p, b) => p[0] >= b[0] - 2 && p[0] <= b[0] + b[2] + 2 && p[1] >= b[1] - 2 && p[1] <= b[1] + b[3] + 2; // click point on a mark box
const toStage = (p) => [+(p[0] * FIT).toFixed(1), +(p[1] * FIT).toFixed(1)], boxStage = (b) => [b[0] * FIT, b[1] * FIT, b[2] * FIT, b[3] * FIT];
// A world coordinate on the nearest whole stage pixel (1.5 world px): a focus zone edge through a pixel blends the
// detailed and skeleton layers there, which shows as a faint line under a translucent overlay (a dim).
const onPixel = (v) => Math.round(v / (WORLD.w / W)) * (WORLD.w / W);
// Where the segment from the centre of rect r towards point p leaves r.
function edge(r, p) {
  const [cx, cy] = mid(r), dx = p[0] - cx, dy = p[1] - cy;
  const k = Math.min(dx ? r[2] / 2 / Math.abs(dx) : Infinity, dy ? r[3] / 2 / Math.abs(dy) : Infinity);
  return [cx + dx * k, cy + dy * k];
}
function dedupe(kf) { const m = new Map(); for (const k of kf) m.set(k.slice(0, k.indexOf("{")), k); return [...m.values()].join(""); }

function validate(scene) {
  const { steps, title } = scene;
  if (!steps?.length) throw new Error(`${title}: tanpa langkah`);
  if (scene.world) throw new Error(`${title}: "world" dihapus; kanvas selalu satu layar ${WORLD.w}x${WORLD.h}`);
  if (!Array.isArray(scene.base)) throw new Error(`${title}: base harus daftar svg layar penuh`);
  if (steps[0].focus === undefined) throw new Error(`${title}: langkah 1 harus punya focus`);
  const els = scene.els ?? {};
  for (const id of Object.keys(els)) if (!/^[A-Za-z][\w-]*$/.test(id)) throw new Error(`${title}: id "${id}" harus diawali huruf`);
  steps.forEach((s, i) => {
    const step = `${title}: langkah ${i + 1}`, need = (kind, id) => { if (!Object.hasOwn(els, id)) throw new Error(`${step} ${kind} "${id}" tidak ada`); };
    for (const k of Object.keys(s)) if (!KEYS.has(k)) throw new Error(`${step} kunci "${k}" tidak dikenal`);
    for (const id of s.show ?? []) need("show", id);
    for (const id of s.hide ?? []) need("hide", id);
    for (const t of s.type ?? []) need("type", t.id ?? t);
    if (s.press) need("press", s.press);
    if (s.hover) need("hover", s.hover);
    if (s.scroll) need("scroll", s.scroll.id);
    if (s.lens && !Array.isArray(s.lens.src)) throw new Error(`${step} lens butuh src [x, y, w, h]`);
    // Every click lands on a marked element: the pointer target must sit inside one of the step's mark boxes.
    if (s.click && s.at && !marksOf(s.mark).some(({ box }) => hits(s.at, box))) throw new Error(`${step} klik di [${s.at}] tidak berada di dalam mark`);
    if (!s.caption || s.caption.length > 80) throw new Error(`${step} caption kosong atau lebih dari 80 huruf`);
  });
}

// Step timing (s): a step runs [start, end); the pointer reaches its `at` at hit; act is when the step changes the
// screen (the click on a click step, else its start); from rest the loop holds its last frame, then restarts at total.
// fade() writes one looping opacity rule for [from, to] windows (null = from the start / to the end).
function timeline(steps) {
  const durs = steps.map((s) => s.dur ?? 3.2), total = +(durs.reduce((a, b) => a + b, 0) + 1.6).toFixed(2), rest = total - 0.45;
  const start = durs.map((_, i) => +durs.slice(0, i).reduce((a, b) => a + b, 0).toFixed(3)), end = durs.map((d, i) => start[i] + d);
  const hit = durs.map((d, i) => start[i] + Math.max(MOVE, d * 0.35)), act = steps.map((s, i) => (s.click && s.at ? hit[i] + 0.1 : start[i]));
  const pct = (t) => +Math.max(0, Math.min(100, (100 * t) / total)).toFixed(3);
  const fade = (sel, k, w, { on = "opacity:1", off = "opacity:0", enter = 0.26, exit = 0.16, base = "" } = {}) => {
    const startsOn = w[0][0] === null, endsOn = w.at(-1)[1] === null, kf = [`0%{${startsOn ? on : off}}`];
    for (const [a, b] of w) {
      if (a !== null) kf.push(`${pct(a)}%{${off};animation-timing-function:${EASE_OUT}}`, `${pct(a + enter)}%{${on}}`);
      if (b !== null) kf.push(`${pct(b)}%{${on};animation-timing-function:${EASE_OUT}}`, `${pct(b + exit)}%{${off}}`);
    }
    kf.push(`${pct(rest)}%{${endsOn ? on : off}}`, `100%{${startsOn ? on : off}}`);
    return `${sel}{${base}${endsOn ? on : off};animation:${k} ${total}s infinite}@keyframes ${k}{${dedupe(kf)}}`;
  };
  return { durs, start, end, hit, act, total, rest, pct, fade };
}

// Visibility windows per element: shown / hidden at its step's act (a shown element waits its delay), hovered from
// 30% of its step to the step's end.
function windows(steps, els, t) {
  const win = {};
  steps.forEach((s, i) => {
    for (const id of s.show ?? []) (win[id] ??= []).push([t.act[i] + (els[id].delay ?? 0), null]);
    for (const id of s.hide ?? []) { const w = win[id]; if (w && w.at(-1)[1] === null) w.at(-1)[1] = t.act[i]; else (win[id] ??= []).push([null, t.act[i]]); }
    if (s.hover) (win[s.hover] ??= []).push([t.start[i] + t.durs[i] * 0.3, t.end[i]]);
  });
  return win;
}

// Element motion. Visibility uses class rules, so a copy of an element (inside a lens) animates exactly like the
// element. Typing: a clip reveal in character steps from the click (or 0.35 s into the step), with a caret over its
// box. Scroll: the content translates. Press: a dip to .97 at the click. Returns each element's markup inside those
// wrappers (typing, then scroll, then press), the carets, css and defs.
const HIDDEN = { fade: "opacity:0", pop: "opacity:0;transform:scale(.96)", slide: "opacity:0;transform:translateY(24px)", rise: "opacity:0;transform:translateY(8px)" };
function animate(steps, els, win, t) {
  const css = [], defs = [], svg = Object.fromEntries(Object.entries(els).map(([id, el]) => [id, el.svg])), caret = {};
  Object.entries(els).forEach(([id, el], k) => {
    if (!win[id]) return;
    const base = el.origin ? `transform-origin:${el.origin[0]}px ${el.origin[1]}px;` : "transform-box:fill-box;transform-origin:center;", enter = el.enter ?? "rise";
    css.push(t.fade(`.e-${id}`, `v${k}`, win[id], { on: enter === "fade" ? "opacity:1" : "opacity:1;transform:none", off: HIDDEN[enter] ?? HIDDEN.rise, base }));
  });
  steps.forEach((s, i) => (s.type ?? []).forEach((ty, j) => {
    const id = ty.id ?? ty, n = ty.n ?? 16, cid = `ty${i}_${j}`, t0 = s.click && s.at ? t.act[i] : t.start[i] + 0.35, t1 = Math.min(t.start[i] + t.durs[i] * 0.85, t0 + n * 0.07);
    const [bx, by, bw, bh] = ty.box ?? [-2000, -2000, 8000, 8000]; // box: [x, y, w, h] of the typed text (adds a caret)
    defs.push(`<clipPath id="${cid}"><rect class="${cid}" x="${bx}" y="${by}" width="${bw}" height="${bh}"/></clipPath>`);
    css.push(`.${cid}{transform-box:fill-box;transform-origin:left center;animation:${cid} ${t.total}s infinite}@keyframes ${cid}{0%,${t.pct(t0)}%{transform:scaleX(0);animation-timing-function:steps(${n},end)}${t.pct(t1)}%,${t.pct(t.rest)}%{transform:scaleX(1)}100%{transform:scaleX(1)}}`);
    if (ty.box) caret[id] = { box: ty.box, t0, t1 };
    svg[id] = `<g clip-path="url(#${cid})">${svg[id]}</g>`;
  }));
  const scrolls = {};
  steps.forEach((s, i) => { if (s.scroll) (scrolls[s.scroll.id] ??= []).push([t.start[i] + 0.3, t.start[i] + Math.min(1.2, t.durs[i] * 0.6), s.scroll.dy]); });
  Object.entries(scrolls).forEach(([id, list], k) => {
    let y = 0; const kf = ["0%{transform:translateY(0)}"];
    for (const [a, b, dy] of list) { kf.push(`${t.pct(a)}%{transform:translateY(${y}px);animation-timing-function:${EASE_IN_OUT}}`); y -= dy; kf.push(`${t.pct(b)}%{transform:translateY(${y}px)}`); }
    kf.push(`${t.pct(t.rest)}%{transform:translateY(${y}px)}`, "100%{transform:translateY(0)}");
    css.push(`.sc-${id}{transform:translateY(${y}px);animation:sc${k} ${t.total}s infinite}@keyframes sc${k}{${dedupe(kf)}}`);
    svg[id] = `<g class="sc-${id}">${svg[id]}</g>`;
  });
  steps.forEach((s, i) => {
    if (!s.press) return;
    const h = t.hit[i];
    svg[s.press] = `<g class="pr${i}">${svg[s.press]}</g>`;
    css.push(`.pr${i}{transform-box:fill-box;transform-origin:center;animation:pr${i} ${t.total}s infinite}@keyframes pr${i}{0%,${t.pct(h)}%{transform:none;animation-timing-function:${EASE_OUT}}${t.pct(h + 0.08)}%{transform:scale(.97)}${t.pct(h + 0.24)}%,100%{transform:none}}`);
  });
  const carets = Object.keys(els).filter((id) => caret[id]).map((id, k) => {
    const { box: [x, y, w, h], t0, t1 } = caret[id];
    css.push(`.ca${k}{opacity:0;animation:ca${k} ${t.total}s infinite}@keyframes ca${k}{0%,${t.pct(t0)}%{opacity:0;transform:translateX(0)}${t.pct(t0) + 0.001}%{opacity:1;transform:translateX(0);animation-timing-function:steps(${Math.max(2, Math.round((t1 - t0) / 0.07))},end)}${t.pct(t1)}%{opacity:1;transform:translateX(${w}px)}${t.pct(t1 + 0.5)}%{opacity:0;transform:translateX(${w}px)}100%{opacity:0;transform:translateX(${w}px)}}`);
    return `<rect class="ca${k}" x="${x}" y="${y + 2}" width="1.5" height="${h - 4}" fill="${C.strong}"/>`;
  }).join("");
  return { svg, carets, css, defs };
}

// Detail zones over the skeleton: one per run of steps with the same focus, changing at the click on a click step
// (like show/hide), plus each clicked element from its step's start, so the target is detailed before the click.
function focusZones(steps, focusOf, t) {
  const runs = [];
  focusOf.forEach((f, i) => { const key = JSON.stringify(f); if (runs.length && runs.at(-1).key === key) runs.at(-1).to = i; else runs.push({ key, f, from: i, to: i }); });
  const zones = runs.filter((r) => r.f !== "none").map((r) => ({ rects: rectsOf(r.f), a: t.act[r.from] > 0 ? t.act[r.from] : null, b: r.to === steps.length - 1 ? null : t.act[r.to + 1] }));
  steps.forEach((s, i) => { if (s.click && s.at) zones.push({ rects: marksOf(s.mark).map((m) => m.box).filter((b) => hits(s.at, b)), a: i === 0 ? null : t.start[i], b: t.act[i] + 0.3 }); });
  return zones;
}

// Stage position of a lens or note of w x h: `place` if given, else beside its target, then beside the first mark,
// clamped to the stage: the first spot clear of all it must avoid (12 px from the target), else one clear of the
// marks and the target, else the first.
function placeBox(w, h, target, marks, avoid, place) {
  if (place) return place;
  const gap = 44, fits = (p) => p[0] >= 12 && p[1] >= 12 && p[0] + w <= W - 12 && p[1] + h <= VH - 12;
  const around = (r) => { const c = mid(r); return [[r[0] + r[2] + gap, c[1] - h / 2], [r[0] - gap - w, c[1] - h / 2], [c[0] - w / 2, r[1] + r[3] + gap], [c[0] - w / 2, r[1] - gap - h]]; };
  const cands = [...around(target), ...(marks[0] && marks[0].box !== target ? around(marks[0].box) : [])]
    .map(([x, y]) => [Math.min(Math.max(x, 12), W - 12 - w), Math.min(Math.max(y, 12), VH - 12 - h)]);
  const at = (p) => [p[0], p[1], w, h];
  const free = (p) => fits(p) && !avoid.some((a, k) => overlap(at(p), a, k ? 0 : 12));
  const clear = (p) => fits(p) && !marks.some((m) => overlap(at(p), m.box)) && !overlap(at(p), target, 12);
  return cands.find(free) ?? cands.find(clear) ?? cands[0];
}
// Straight arrow from a box to the nearest edge of its target, the head on that edge.
function arrowTo(box, target) {
  const p = edge(box, mid(target)), q = edge(target, mid(box)), ang = Math.atan2(q[1] - p[1], q[0] - p[0]), L = 11, A = 0.45;
  const head = [[q[0], q[1]], [q[0] - L * Math.cos(ang - A), q[1] - L * Math.sin(ang - A)], [q[0] - L * Math.cos(ang + A), q[1] - L * Math.sin(ang + A)]];
  const back = [q[0] - (L - 2) * Math.cos(ang), q[1] - (L - 2) * Math.sin(ang)];
  return line(p[0], p[1], back[0], back[1], { stroke: C.accent, sw: 2.5, cap: "round" }) + `<path d="M${head.map((v) => v.map((n) => +n.toFixed(1)).join(" ")).join(" L")} Z" fill="${C.accent}"/>`;
}
// A mark's ring with the step number on its top-left corner, kept fully on the stage for rings at the stage edge.
const ring = (m, n) => { const bx = Math.max(11, m.box[0]), by = Math.max(11, m.box[1]);
  return rect(m.box[0], m.box[1], m.box[2], m.box[3], { r: m.r, stroke: C.accent, sw: 2.5 }) + circle(bx, by, 10, { fill: C.accent }) + text(bx, by + 4, String(n), { size: 12, weight: 700, fill: C.white, anchor: "middle" }); };

// Marks, lens and note of step i on the stage (constant size, aligned to world pixels). lensWorld(a, b): the detailed
// world a lens shows during [a, b].
function stepOverlays(scene, i, t, focus, lensWorld) {
  const s = scene.steps[i], css = [], defs = [], svg = [], clicks = !!(s.click && s.at), err = `${scene.title}: langkah ${i + 1} lens/note`;
  const w = [[t.start[i] + 0.15, i === scene.steps.length - 1 ? null : t.end[i]]];
  const marks = marksOf(s.mark).map((m) => { const [x, y, bw, bh] = boxStage(m.box); return { box: [x - 4, y - 4, bw + 8, bh + 8], r: (m.r ?? 4) * FIT + 4, hit: clicks && hits(s.at, m.box) }; });
  const lens = s.lens && { src: s.lens.src, zoom: (s.lens.zoom ?? 2) * FIT }, note = typeof s.note === "string" ? { text: s.note } : s.note;
  const srcSt = lens && boxStage(lens.src);
  // On a click step a lens whose source does not hold the click point shows the result: it appears at the click.
  const after = !!(lens && clicks && !hits(s.at, lens.src));
  // What the arrow points at: for a lens, the first mark over its source (else the source itself); for a note, the
  // first mark. So an arrow always joins a lens to what it magnifies.
  const aim = lens ? marks.find((m) => (!after || !m.hit) && overlap(m.box, srcSt)) : marks[0];
  const size = lens ? [lens.src[2] * lens.zoom, lens.src[3] * lens.zoom] : note ? [tw(note.text, 15, 600) + 32, 36] : null;
  let inner = "", arrow = "";
  if (size) {
    if (size[0] > W - 24 || size[1] > VH - 24) throw new Error(`${err} lebih besar dari panggung`);
    const target = aim?.box ?? srcSt ?? [0, 0, 0, 0], avoid = [target, ...marks.map((m) => m.box), ...rectsOf(focus).map(boxStage)];
    if (s.at) avoid.push([...toStage(s.at).map((v) => v - 12), 24, 24]);
    const box = [...placeBox(size[0], size[1], target, marks, avoid, s.lens?.at ?? note?.at).slice(0, 2), ...size];
    if (marks.some((m) => overlap(box, m.box))) throw new Error(`${err} menutupi mark`);
    if (lens) {
      const [sx, sy, sw, sh] = lens.src;
      defs.push(`<clipPath id="ln${i}"><rect x="${sx}" y="${sy}" width="${sw}" height="${sh}"/></clipPath>`, `<clipPath id="lc${i}"><rect x="${box[0]}" y="${box[1]}" width="${box[2]}" height="${box[3]}" rx="10"/></clipPath>`);
      inner = rect(box[0] - 1, box[1] + 3, box[2] + 2, box[3], { r: 11, fill: "rgba(16,24,40,.14)" }) + rect(box[0], box[1], box[2], box[3], { r: 10, fill: scene.bg ?? C.white }) +
        `<g clip-path="url(#lc${i})"><g transform="translate(${+box[0].toFixed(2)} ${+box[1].toFixed(2)}) scale(${+lens.zoom.toFixed(4)}) translate(${-sx} ${-sy})"><g clip-path="url(#ln${i})">${lensWorld(t.start[i], t.end[i])}</g></g></g>` +
        rect(box[0], box[1], box[2], box[3], { r: 10, stroke: C.accent, sw: 2.5 });
    } else inner = rect(box[0], box[1], box[2], box[3], { r: 18, fill: C.accent }) + text(box[0] + box[2] / 2, box[1] + 23, note.text, { size: 15, weight: 600, fill: C.white, anchor: "middle" });
    if (aim || lens) arrow = arrowTo(box, target);
  }
  // A lens or note stays for the whole step (a result lens from the click). On a click step the ring around the click
  // point leaves just after the click, so it never floats over a screen the click has changed; the step's other marks
  // point at the result, so they appear at the click. The arrow goes with the ring it points at, else with the lens.
  if (inner) { css.push(t.fade(`.ov${i}`, `ov${i}`, after ? [[t.act[i], w[0][1]]] : w, { enter: 0.22, exit: 0.14 })); svg.push(`<g class="ov${i}">${aim ? "" : arrow}${inner}</g>`); }
  const groups = clicks ? [[marks.filter((m) => m.hit), [[t.start[i] + 0.15, t.act[i] + 0.35]]], [marks.filter((m) => !m.hit), [[t.act[i], w[0][1]]]]] : [[marks, w]];
  groups.forEach(([ms, mw], g) => {
    if (!ms.length) return;
    css.push(t.fade(`.om${i}_${g}`, `om${i}_${g}`, mw, { enter: 0.22, exit: 0.2 }));
    svg.push(`<g class="om${i}_${g}">${aim && ms.includes(aim) ? arrow : ""}${ms.map((m) => ring(m, i + 1)).join("")}</g>`);
  });
  return { css, defs, svg };
}

// Pointer in stage space (constant size): from its rest point to each step's `at` by hit, back to rest at the end.
function pointer(scene, t) {
  const home = scene.cursorStart ? toStage(scene.cursorStart) : [W - 60, VH - 50], pts = [];
  let cur = home;
  scene.steps.forEach((s, i) => { pts.push([t.pct(t.start[i]), cur]); if (s.at) { cur = toStage(s.at); pts.push([t.pct(t.hit[i]), cur]); } });
  pts.push([t.pct(t.rest), cur], [100, home]);
  return `#cur{animation:cur ${t.total}s infinite}@keyframes cur{${dedupe(pts.map(([p, [x, y]]) => `${p}%{transform:translate(${x}px,${y}px);animation-timing-function:${EASE_IN_OUT}}`))}}`;
}
// A ripple at the stage point of each click.
function ripples(steps, t) {
  const css = [], svg = [];
  steps.forEach((s, i) => {
    if (!s.click || !s.at) return;
    const h = t.hit[i], [x, y] = toStage(s.at);
    svg.push(`<circle id="r${i}" cx="${x}" cy="${y}" r="16" fill="rgba(184,70,13,.18)" stroke="${C.accent}" stroke-width="2.5"/>`);
    css.push(`#r${i}{opacity:0;transform-origin:${x}px ${y}px;animation:r${i} ${t.total}s infinite}@keyframes r${i}{0%,${t.pct(h)}%{opacity:0;transform:scale(.4);animation-timing-function:${EASE_OUT}}${t.pct(h + 0.05)}%{opacity:1}${t.pct(h + 0.55)}%{opacity:0;transform:scale(1.5)}100%{opacity:0}}`);
  });
  return { css, svg: svg.join("") };
}
// Caption bar below the stage (CAP high): each step's caption and number, fading with the step, and the progress bar.
function captionBar(steps, t, capLines, CAP) {
  const H = VH + CAP, css = [];
  const caps = capLines.map((ls, i) => `<g id="c${i}">${para(64, VH + CAP / 2 + 6 - 11 * (ls.length - 1), ls, { size: 16, fill: C.white, weight: 500, lh: 22 })}</g>`).join("");
  steps.forEach((s, i) => {
    const a = t.start[i], last = i === steps.length - 1, e = last ? t.rest : t.end[i];
    css.push(`#c${i},#n${i}{opacity:${last ? 1 : 0};animation:c${i} ${t.total}s infinite}@keyframes c${i}{${dedupe([`0%{opacity:${i === 0 ? 1 : 0}}`, i ? `${t.pct(a)}%{opacity:0}` : "", i ? `${t.pct(a + 0.2)}%{opacity:1}` : "", `${t.pct(e)}%{opacity:1}`, `${t.pct(e + 0.2)}%{opacity:0}`, i === 0 ? `${t.pct(t.total - 0.05)}%{opacity:0}` : "", `100%{opacity:${i === 0 ? 1 : 0}}`].filter(Boolean))}}`);
  });
  const nums = steps.map((_, i) => `<g id="n${i}">${circle(32, VH + CAP / 2, 15, { fill: C.accent })}${text(32, VH + CAP / 2 + 5, String(i + 1), { size: 14, fill: C.white, anchor: "middle", weight: 700 })}</g>`).join("");
  const bar = `<rect x="0" y="${H - CAP}" width="${W}" height="3" fill="rgba(255,255,255,.18)"/><rect id="prog" x="0" y="${H - CAP}" width="${W}" height="3" fill="${C.accent}"/>`;
  css.push(`#prog{transform-origin:0 0;transform:scaleX(1);animation:prog ${t.total}s linear infinite}@keyframes prog{0%{transform:scaleX(0)}${t.pct(t.rest)}%{transform:scaleX(1)}100%{transform:scaleX(1)}}`);
  return { css, svg: `${rect(0, H - CAP, W, CAP, { fill: C.cocoa })}${bar}\n${nums}${caps}` };
}

export function compile(scene) {
  validate(scene);
  const { steps } = scene, t = timeline(steps);
  const els = Object.fromEntries(Object.entries(scene.els ?? {}).map(([id, v]) => [id, typeof v === "string" ? { svg: v } : v]));
  let focus = steps[0].focus;
  const focusOf = steps.map((s) => (focus = s.focus ?? focus));
  const win = windows(steps, els, t), anim = animate(steps, els, win, t), ids = Object.keys(els);
  // Every element is drawn once (in defs, with its animation class) and placed by <use>: its class rules animate each
  // instance the same, so the screen, the focus zones and the lenses share one copy. The world is drawn twice, in
  // declaration order: as skeleton (base and `skel: true` elements greyed, other elements detailed), and fully detailed
  // inside each focus zone, which is opaque, so no skeleton shows through detailed text.
  const css = [...anim.css], defs = [...anim.defs, ...ids.map((id) => `<g id="ed-${id}" class="e-${id}">${anim.svg[id]}</g>`), `<g id="carets">${anim.carets}</g>`];
  const during = (a, b) => (w) => !w || w.some(([x, y]) => (x ?? -1) < b && (y ?? Infinity) > a);
  const world = (a, b) => `<use href="#db"/>${ids.filter((id) => during(a, b)(win[id])).map((id) => `<use href="#ed-${id}"/>`).join("")}`;
  const zones = focusZones(steps, focusOf, t);
  zones.forEach((z, k) => {
    if (z.rects.length) defs.push(`<clipPath id="fz${k}">${z.rects.map((x) => `<rect x="${onPixel(x[0])}" y="${onPixel(x[1])}" width="${onPixel(x[0] + x[2]) - onPixel(x[0])}" height="${onPixel(x[1] + x[3]) - onPixel(x[1])}"/>`).join("")}</clipPath>`);
    css.push(t.fade(`.fz${k}`, `fz${k}`, [[z.a, z.b]], { enter: 0.3, exit: 0.3 }));
  });
  const overlays = steps.map((_, i) => stepOverlays(scene, i, t, focusOf[i], (a, b) => world(a, b) + (anim.carets ? '<use href="#carets"/>' : "")));
  for (const o of overlays) { css.push(...o.css); defs.push(...o.defs); }
  const usesCursor = steps.some((s) => s.at), rip = ripples(steps, t);
  if (usesCursor) css.push(pointer(scene, t));
  css.push(...rip.css);
  const capLines = steps.map((s) => wrap(s.caption, W - 80, 16, 500)), CAP = 24 + 22 * Math.max(...capLines.map((l) => l.length)), H = VH + CAP;
  const bar = captionBar(steps, t, capLines, CAP);
  css.push(...bar.css);
  const base = scene.base.join("\n"), bg = rect(0, 0, WORLD.w, WORLD.h, { fill: scene.bg ?? C.white });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="ttl dsc" font-family='${FONT}' data-total="${t.total}" data-steps="${t.start.join(",")}">
<title id="ttl">${esc(scene.title)}</title>
<desc id="dsc">${esc(scene.desc ?? steps.map((s, i) => `${i + 1}. ${s.caption}`).join(" "))}</desc>
<style>${css.join("\n")}
${REDUCE}</style>
<defs>${defs.join("")}<g id="db">${bg}${base}</g><clipPath id="stage"><rect x="0" y="0" width="${W}" height="${VH}"/></clipPath></defs>
<g clip-path="url(#stage)"><g id="world" transform="scale(${+FIT.toFixed(4)})">
${skeleton(bg + base)}
${ids.map((id) => (els[id].skel ? `<g class="e-${id}">${skeleton(anim.svg[id])}</g>` : `<use href="#ed-${id}"/>`)).join("\n")}
${zones.map((z, k) => `<g class="fz${k}"${z.rects.length ? ` clip-path="url(#fz${k})"` : ""}>${world(z.a ?? 0, z.b ?? t.total)}</g>`).join("\n")}
${anim.carets ? '<use href="#carets"/>' : ""}
</g>
${overlays.flatMap((o) => o.svg).join("\n")}
</g>
${rip.svg}
${usesCursor ? `<g id="cur">${POINTER}</g>` : ""}
${bar.svg}
</svg>`;
}
