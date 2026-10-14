// Animated SVG walkthroughs for the panduan (v4: one full desktop screen, focus + skeleton, precise marks, lens).
//
// Every scene is ONE desktop screen of 1440x900 real pixels (the size the Scalev editor was measured at), always shown
// whole on a 960x600 stage (scale 2/3) with the caption bar below: no crop, no camera movement. Pages that live on a
// phone (couple dashboard, guest invitation, staff) are a plain 390x844 phone screen at PHONE in that desktop
// (phoneDesk). Per step only what the step discusses is drawn in detail (`focus`); the rest of the base is shown as a
// skeleton of itself (text = bars of its width, colours = light greys), so every block keeps its real place and size.
// The element to act on gets a precise ring (`mark`) with the step number, and a straight arrow from a 2x lens or a
// note to the ring's nearest edge. Measurements come from the real UIs (captured 14 Okt 2026).
//
// Scene shape:
//   { title, desc?, bg?, base: [svg], els: { id: svg | { svg, enter, origin, delay } }, cursorStart?: [x, y],
//     steps: [{ caption, dur?, focus, mark?, lens?, note?, at?, click?, press?, show?, hide?, type?, scroll?, hover? }] }
//   base:  the whole 1440x900 screen in detail; its skeleton is derived (skeleton()). els are drawn as given, above the
//          base: wrap an element in skeleton() when it should look greyed (e.g. a panel state outside the focus).
//   focus: [x, y, w, h] | [[x, y, w, h], ...] | "all" | "none": base parts drawn in detail. Later steps inherit it; the
//          first step must set it.
//   mark:  [x, y, w, h] | { box: [x, y, w, h], r } | [...]: exact world bounds and corner radius (default 4) of the
//          element to act on. Stage ring: 2.5 px, 4 px outside, radius r*2/3 + 4, step number on its top-left corner.
//   lens:  { src: [x, y, w, h], at?: [sx, sy], zoom? }: magnifier of world rect src at `zoom` (default 2) x the stage,
//          placed at stage point `at` or beside the mark (clear of it, the focus and the pointer), with an arrow to
//          the ring. Use it when focused text is under ~20 px in the world (it would be under ~11 px in the docs).
//   note:  "text" | { text, at }: a pill placed like a lens, with an arrow to the ring (steps without a lens).
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
  ok: "#166534", okSoft: "#e8f9ef",
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
export const text = (x, y, s, o = {}) => `<text${attrs({ x, y, "font-size": o.size ?? 14, "font-weight": o.weight, fill: o.fill ?? C.strong, "text-anchor": o.anchor, "font-family": o.mono ? "'Roboto Mono',ui-monospace,Menlo,monospace" : o.font, "font-style": o.italic ? "italic" : undefined, "text-decoration": o.underline ? "underline" : undefined })}>${esc(s)}</text>`;
export const line = (x1, y1, x2, y2, o = {}) => `<line${attrs({ x1, y1, x2, y2, stroke: o.stroke ?? C.line, "stroke-width": o.sw ?? 1, "stroke-linecap": o.cap })}/>`;
export const circle = (cx, cy, r, o = {}) => `<circle${attrs({ cx, cy, r, fill: o.fill ?? "none", stroke: o.stroke, "stroke-width": o.stroke ? o.sw ?? 1 : undefined })}/>`;
export const group = (o, ...kids) => `<g${attrs({ transform: o.transform, opacity: o.opacity, "clip-path": o.clip })}>${kids.join("")}</g>`;
export const para = (x, y, lines, o = {}) => `<text${attrs({ x, y, "font-size": o.size ?? 14, fill: o.fill ?? C.strong, "font-weight": o.weight, "text-anchor": o.anchor })}>${lines.map((l, i) => `<tspan x="${x}" dy="${i ? (o.lh ?? Math.round((o.size ?? 14) * 1.43)) : 0}">${esc(l)}</tspan>`).join("")}</text>`;
// Approximate text width (a flat average per character) for laying out boxes and pills around a label; every scene's
// layout is built on these numbers. Skeleton bars use textWidth() instead, which follows the glyphs.
export const tw = (s, size = 14, weight = 400) => Math.round(String(s).length * size * (weight >= 600 ? 0.57 : weight >= 500 ? 0.55 : 0.53));
// Glyph advances (per 100 px) of the SVG font stack as Chrome draws it on macOS, for weights 400/500/600/700
// (measured 14 Okt 2026). Their sums land between Roboto (Android) and SF Text (Apple, small sizes), so a skeleton
// bar ends where the text would end on Android and a little before it on Apple: never past its box.
const GLYPHS = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~…·•🤍←›×–▸©⌘»→⇣↻“”±↑↓ابحرسلمنهي";
const ADV = Object.fromEntries(Object.entries({
  400: "21 27 40 60 60 81 67 25 32 32 40 60 21 43 21 28 61 44 57 59 60 59 62 55 60 62 21 21 60 60 60 49 87 64 60 69 68 55 53 71 70 22 50 60 52 83 70 73 58 73 60 59 58 70 63 92 63 61 62 32 28 32 60 53 50 50 55 50 55 51 30 55 54 21 21 49 20 80 53 53 55 55 31 47 30 53 48 72 47 49 47 32 22 32 60 59 21 43 100 91 40 60 53 43 85 92 62 91 87 82 36 36 60 78 78 23 89 62 34 108 62 51 61 43 72",
  500: "20 28 42 62 62 84 68 26 34 34 42 62 22 43 22 29 62 46 58 60 62 60 63 56 62 63 22 22 62 62 62 50 88 65 62 69 69 56 53 71 71 24 52 62 53 84 70 74 59 74 61 61 59 70 65 94 65 63 62 34 29 34 62 54 50 52 57 52 57 53 32 56 55 22 22 50 22 82 54 55 56 56 33 48 32 54 50 74 49 50 48 34 22 34 62 62 22 43 100 92 41 62 54 43 85 92 63 92 87 82 38 38 62 79 79 24 91 65 35 112 64 53 64 46 75",
  600: "20 30 44 63 63 86 69 26 36 36 43 63 23 44 23 30 64 47 59 62 63 61 64 56 63 64 23 23 63 63 63 52 88 67 63 70 69 57 54 72 72 25 54 64 54 85 71 75 60 75 63 62 59 70 66 95 67 65 63 36 30 36 63 56 50 53 58 53 58 54 34 58 57 23 23 52 23 84 56 56 58 58 35 50 34 56 51 77 51 52 49 36 23 36 63 65 23 44 100 93 41 63 56 44 85 93 65 93 87 83 40 40 63 80 80 25 93 67 37 117 66 56 67 48 78",
  700: "20 32 46 64 65 89 70 27 38 38 45 65 24 44 24 30 66 48 60 63 65 63 65 57 65 65 24 24 65 65 65 53 89 69 64 71 70 57 55 73 73 26 56 65 54 86 71 75 62 75 64 63 60 71 68 97 69 67 63 38 30 38 65 58 50 55 60 55 60 56 36 59 58 24 24 54 24 86 58 57 59 59 36 51 36 58 53 79 53 54 51 38 24 38 65 68 24 44 100 94 42 65 58 44 85 94 66 94 87 84 43 43 65 82 82 26 94 69 38 121 68 58 69 50 80"
}).map(([w, s]) => [w, s.split(" ").map(Number)]));
const GLYPH = new Map([...GLYPHS].map((c, i) => [c, i]));
// Width a line of text takes: glyph advances (combining marks take none, unlisted glyphs 0.6 em, monospace 0.6 em
// each) plus letter-spacing between glyphs.
export const textWidth = (s, size = 14, weight = 400, { mono = false, spacing = 0 } = {}) => {
  const adv = ADV[weight >= 650 ? 700 : weight >= 550 ? 600 : weight >= 450 ? 500 : 400];
  const glyphs = [...String(s).replace(/\u00a0/g, " ")].filter((c) => !/\p{Mn}/u.test(c));
  const em = glyphs.reduce((t, c) => t + (mono ? 60 : adv[GLYPH.get(c)] ?? 60), 0) / 100;
  return +(em * size + spacing * Math.max(0, glyphs.length - 1)).toFixed(1);
};
// Greedy word wrap to a width, using tw().
export const wrap = (s, width, size = 14, weight = 400) => String(s).split(" ").reduce((ls, w) => {
  const last = ls.at(-1);
  if (last && tw(last + " " + w, size, weight) <= width) ls[ls.length - 1] = last + " " + w; else ls.push(w);
  return ls;
}, []);
// Clip children to a rect (scrolling panels, truncated text). The id comes from the rect itself, so a build never
// renumbers clips in unrelated scenes; equal rects share one identical clipPath, which is harmless.
const clipId = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193); return "k" + (h >>> 0).toString(36); };
export const clipped = (x, y, w, h, ...kids) => { const id = clipId(`${x},${y},${w},${h}`); return `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#${id})">${kids.join("")}</g>`; };
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
// line they are on, each run measured at its own weight.
function textBars(attrs, body) {
  const x0 = +(attr(attrs, "x") ?? 0), y0 = +(attr(attrs, "y") ?? 0), size = +(attr(attrs, "font-size") ?? 14), weight = +(attr(attrs, "font-weight") ?? 400), anchor = attr(attrs, "text-anchor");
  const metrics = { mono: /mono/i.test(attr(attrs, "font-family") ?? ""), spacing: +(attr(attrs, "letter-spacing") ?? 0) };
  const pinned = !/<tspan/.test(body) && attr(attrs, "textLength"); // a measured line width wins over the glyph estimate
  const lines = [{ x: x0, y: y0, runs: [] }];
  let y = y0;
  for (const [, a, inner, bare] of body.matchAll(/<tspan\b([^>]*)>([\s\S]*?)<\/tspan>|([^<]+)/g)) {
    if (bare !== undefined) { lines.at(-1).runs.push([unesc(bare), weight]); continue; }
    y += +(attr(a, "dy") ?? 0);
    if (attr(a, "x") !== undefined) lines.push({ x: +attr(a, "x"), y, runs: [] });
    lines.at(-1).runs.push([unesc(inner), +(attr(a, "font-weight") ?? weight)]);
  }
  return lines.map(({ x, y: ly, runs }) => {
    const s = runs.map(([t]) => t).join("");
    if (!s.trim()) return "";
    const lead = s.length - s.trimStart().length, tail = s.trimEnd().length;
    let at = 0; // trim the line's outer whitespace, then sum the runs
    const width = runs.reduce((sum, [t, wt]) => { const from = Math.max(lead - at, 0), to = Math.min(tail - at, t.length); at += t.length; return to > from ? sum + textWidth(t.slice(from, to), size, wt, metrics) : sum; }, 0);
    const w = pinned ? +pinned : +width.toFixed(1), h = Math.max(3, +(size * 0.5).toFixed(1)), bx = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
    return `<rect x="${+bx.toFixed(1)}" y="${+(ly - size * 0.62).toFixed(1)}" width="${w}" height="${h}" rx="${h / 2}" fill="${SK.bar}"/>`;
  }).join("");
}
export const skeleton = (svg) => String(svg)
  .replace(/\b(fill|stroke)="([^"]+)"/g, (m, k, v) => `${k}="${skColor(k, v)}"`)
  .replace(/<text\b([^>]*)>([\s\S]*?)<\/text>/g, (m, a, b) => textBars(a, b));

// ---- Compiler -------------------------------------------------------------------------------------------------------
const POINTER = `<path d="M0 0 L0 20 L5.5 15 L9.5 24 L13 22.5 L9 13.8 L16.5 13.8 Z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>`;
const KEYS = new Set(["caption", "dur", "focus", "mark", "lens", "note", "at", "click", "press", "show", "hide", "type", "scroll", "hover"]);
const rectsOf = (f) => (f === "all" || f === "none" ? [] : Array.isArray(f[0]) ? f : [f]);
const marksOf = (m) => (!m ? [] : Array.isArray(m) && Array.isArray(m[0]) ? m.map((b) => ({ box: b })) : Array.isArray(m) && typeof m[0] === "object" ? m : [Array.isArray(m) ? { box: m } : m]);
const overlap = (a, b, pad = 0) => a[0] < b[0] + b[2] + pad && b[0] < a[0] + a[2] + pad && a[1] < b[1] + b[3] + pad && b[1] < a[1] + a[3] + pad;
const hits = (p, b) => p[0] >= b[0] - 2 && p[0] <= b[0] + b[2] + 2 && p[1] >= b[1] - 2 && p[1] <= b[1] + b[3] + 2; // click point on a mark box
// Where the segment from the centre of rect r towards point p leaves r.
function edge(r, p) {
  const cx = r[0] + r[2] / 2, cy = r[1] + r[3] / 2, dx = p[0] - cx, dy = p[1] - cy;
  const k = Math.min(dx ? r[2] / 2 / Math.abs(dx) : Infinity, dy ? r[3] / 2 / Math.abs(dy) : Infinity);
  return [cx + dx * k, cy + dy * k];
}
export function compile(scene) {
  const steps = scene.steps;
  if (!steps?.length) throw new Error(`${scene.title}: tanpa langkah`);
  if (scene.world) throw new Error(`${scene.title}: "world" dihapus; kanvas selalu satu layar ${WORLD.w}x${WORLD.h}`);
  if (!Array.isArray(scene.base)) throw new Error(`${scene.title}: base harus daftar svg layar penuh`);
  if (steps[0].focus === undefined) throw new Error(`${scene.title}: langkah 1 harus punya focus`);
  const els = Object.fromEntries(Object.entries(scene.els ?? {}).map(([id, v]) => [id, typeof v === "string" ? { svg: v } : { ...v }]));
  for (const id of Object.keys(els)) if (!/^[A-Za-z][\w-]*$/.test(id)) throw new Error(`${scene.title}: id "${id}" harus diawali huruf`);
  const durs = steps.map((s) => s.dur ?? 3.2), total = +(durs.reduce((a, b) => a + b, 0) + 1.6).toFixed(2);
  const start = durs.map((_, i) => +durs.slice(0, i).reduce((a, b) => a + b, 0).toFixed(3)), end = durs.map((d, i) => start[i] + d);
  const pct = (t) => +Math.max(0, Math.min(100, (100 * t) / total)).toFixed(3);
  const css = [], defs = [];
  const S = FIT, toStage = (p) => [+(p[0] * S).toFixed(1), +(p[1] * S).toFixed(1)], boxStage = (b) => [b[0] * S, b[1] * S, b[2] * S, b[3] * S];
  const capLines = steps.map((s) => wrap(s.caption ?? "", W - 80, 16, 500));
  const CAP = 24 + 22 * Math.max(...capLines.map((l) => l.length)), H = VH + CAP;
  // Timing: the pointer reaches `at` at hit[i]; on a click step everything the step changes happens at the click.
  const MOVE = 0.6;
  const hit = durs.map((d, i) => start[i] + Math.max(MOVE, d * 0.35));
  const act = steps.map((s, i) => (s.click && s.at ? hit[i] + 0.1 : start[i]));
  // One opacity window per [from, to] (seconds; null = from the start / to the end), looping like the rest.
  const fadeRule = (sel, k, w, on = "opacity:1", offS = "opacity:0", enter = 0.26, exit = 0.16) => {
    const startsOn = w[0][0] === null, endsOn = w.at(-1)[1] === null, kf = [`0%{${startsOn ? on : offS}}`];
    for (const [a, b] of w) {
      if (a !== null) kf.push(`${pct(a)}%{${offS};animation-timing-function:${EASE_OUT}}`, `${pct(a + enter)}%{${on}}`);
      if (b !== null) kf.push(`${pct(b)}%{${on};animation-timing-function:${EASE_OUT}}`, `${pct(b + exit)}%{${offS}}`);
    }
    kf.push(`${pct(total - 0.45)}%{${endsOn ? on : offS}}`, `100%{${startsOn ? on : offS}}`);
    return `${sel}{${endsOn ? on : offS};animation:${k} ${total}s infinite}@keyframes ${k}{${dedupe(kf)}}`;
  };
  // Element visibility windows.
  const win = {};
  const need = (i, kind, id) => { if (!els[id]) throw new Error(`${scene.title}: langkah ${i + 1} ${kind} "${id}" tidak ada`); };
  let focus = steps[0].focus;
  const focusOf = steps.map((s) => (focus = s.focus ?? focus));
  steps.forEach((s, i) => {
    for (const k of Object.keys(s)) if (!KEYS.has(k)) throw new Error(`${scene.title}: langkah ${i + 1} kunci "${k}" tidak dikenal`);
    for (const id of s.show ?? []) { need(i, "show", id); (win[id] ??= []).push([act[i] + (els[id].delay ?? 0), null]); }
    for (const id of s.hide ?? []) {
      need(i, "hide", id);
      const w = win[id]; if (w && w.at(-1)[1] === null) w.at(-1)[1] = act[i]; else (win[id] ??= []).push([null, act[i]]);
    }
    for (const t of s.type ?? []) need(i, "type", t.id ?? t);
    if (s.press) need(i, "press", s.press);
    if (s.hover) { need(i, "hover", s.hover); (win[s.hover] ??= []).push([start[i] + durs[i] * 0.3, end[i]]); }
    if (s.scroll) need(i, "scroll", s.scroll.id);
    if (s.lens && !Array.isArray(s.lens.src)) throw new Error(`${scene.title}: langkah ${i + 1} lens butuh src [x, y, w, h]`);
    // Every click lands on a marked element: the pointer target must sit inside one of the step's mark boxes.
    if (s.click && s.at && !marksOf(s.mark).some(({ box }) => hits(s.at, box)))
      throw new Error(`${scene.title}: langkah ${i + 1} klik di [${s.at}] tidak berada di dalam mark`);
  });
  const off = (el) => ({ fade: "opacity:0", pop: "opacity:0;transform:scale(.96)", slide: "opacity:0;transform:translateY(24px)" })[el.enter ?? "rise"] ?? "opacity:0;transform:translateY(8px)";
  const onState = (el) => ((el.enter ?? "rise") === "fade" ? "opacity:1" : "opacity:1;transform:none");
  // Element rules use classes, so a copy of an element (inside a lens) animates exactly like the element itself.
  Object.entries(els).forEach(([id, el], k) => {
    if (!win[id]) return;
    const origin = el.origin ? `transform-origin:${el.origin[0]}px ${el.origin[1]}px;` : "transform-box:fill-box;transform-origin:center;";
    css.push(fadeRule(`.e-${id}`, `v${k}`, win[id], onState(el), off(el)).replace(`.e-${id}{`, `.e-${id}{${origin}`));
  });
  // Typing: clip reveal in character steps + caret, starting at the click (or 0.35 s into the step).
  steps.forEach((s, i) => (s.type ?? []).forEach((t, j) => {
    const id = t.id ?? t, n = t.n ?? 16, cid = `ty${i}_${j}`, t0 = s.click && s.at ? act[i] : start[i] + 0.35, t1 = Math.min(start[i] + durs[i] * 0.85, t0 + n * 0.07);
    const [bx, by, bw, bh] = t.box ?? [-2000, -2000, 8000, 8000]; // box: [x, y, w, h] of the typed text (adds a caret)
    defs.push(`<clipPath id="${cid}"><rect class="${cid}" x="${bx}" y="${by}" width="${bw}" height="${bh}"/></clipPath>`);
    css.push(`.${cid}{transform-box:fill-box;transform-origin:left center;animation:${cid} ${total}s infinite}@keyframes ${cid}{0%,${pct(t0)}%{transform:scaleX(0);animation-timing-function:steps(${n},end)}${pct(t1)}%,${pct(total - 0.45)}%{transform:scaleX(1)}100%{transform:scaleX(1)}}`);
    if (t.box) els[id].caret = { box: t.box, t0, t1 };
    els[id].svg = `<g clip-path="url(#${cid})">${els[id].svg}</g>`;
  }));
  // Scroll: translate inner content.
  const scrolls = {};
  steps.forEach((s, i) => { if (s.scroll) (scrolls[s.scroll.id] ??= []).push([start[i] + 0.3, start[i] + Math.min(1.2, durs[i] * 0.6), s.scroll.dy]); });
  Object.entries(scrolls).forEach(([id, list], k) => {
    let y = 0; const kf = ["0%{transform:translateY(0)}"];
    for (const [a, b, dy] of list) { kf.push(`${pct(a)}%{transform:translateY(${y}px);animation-timing-function:${EASE_IN_OUT}}`); y -= dy; kf.push(`${pct(b)}%{transform:translateY(${y}px)}`); }
    kf.push(`${pct(total - 0.45)}%{transform:translateY(${y}px)}`, "100%{transform:translateY(0)}");
    css.push(`.sc-${id}{transform:translateY(${y}px);animation:sc${k} ${total}s infinite}@keyframes sc${k}{${dedupe(kf)}}`);
    els[id].svg = `<g class="sc-${id}">${els[id].svg}</g>`;
  });
  // Press: buttons dip to .97 when the pointer clicks.
  steps.forEach((s, i) => {
    if (!s.press) return;
    const t = hit[i], id = s.press;
    els[id].svg = `<g class="pr${i}">${els[id].svg}</g>`;
    css.push(`.pr${i}{transform-box:fill-box;transform-origin:center;animation:pr${i} ${total}s infinite}@keyframes pr${i}{0%,${pct(t)}%{transform:none;animation-timing-function:${EASE_OUT}}${pct(t + 0.08)}%{transform:scale(.97)}${pct(t + 0.24)}%,100%{transform:none}}`);
  });
  const carets = Object.values(els).filter((e) => e.caret).map((e, k) => {
    const [x, y, w, h] = e.caret.box;
    css.push(`.ca${k}{opacity:0;animation:ca${k} ${total}s infinite}@keyframes ca${k}{0%,${pct(e.caret.t0)}%{opacity:0;transform:translateX(0)}${pct(e.caret.t0) + 0.001}%{opacity:1;transform:translateX(0);animation-timing-function:steps(${Math.max(2, Math.round((e.caret.t1 - e.caret.t0) / 0.07))},end)}${pct(e.caret.t1)}%{opacity:1;transform:translateX(${w}px)}${pct(e.caret.t1 + 0.5)}%{opacity:0;transform:translateX(${w}px)}100%{opacity:0;transform:translateX(${w}px)}}`);
    return { svg: `<rect class="ca${k}" x="${x}" y="${y + 2}" width="1.5" height="${h - 4}" fill="${C.strong}"/>`, t: [e.caret.t0, e.caret.t1 + 0.5] };
  });
  // Every element is drawn once (in defs, with its animation class) and placed by <use>: its class rules animate each
  // instance the same, so the screen, the focus zones and the lenses share one copy. The world is drawn twice, in
  // declaration order: as skeleton (base and `skel: true` elements greyed, other elements detailed), and fully detailed
  // inside each focus zone, which is opaque, so no skeleton shows through detailed text.
  const ids = Object.keys(els);
  defs.push(...ids.map((id) => `<g id="ed-${id}" class="e-${id}">${els[id].svg}</g>`), `<g id="carets">${carets.map((c) => c.svg).join("")}</g>`);
  const during = (a, b) => (w) => !w || w.some(([x, y]) => (x ?? -1) < b && (y ?? Infinity) > a);
  const uses = (keep) => ids.filter((id) => keep(win[id])).map((id) => `<use href="#ed-${id}"/>`).join("");
  // Detail zones over the skeleton: one per run of steps with the same focus, changing at the click on a click step
  // (like show/hide), plus each clicked element from its step's start, so the target is detailed before the click.
  const runs = [];
  focusOf.forEach((f, i) => { const key = JSON.stringify(f); if (runs.length && runs.at(-1).key === key) runs.at(-1).to = i; else runs.push({ key, f, from: i, to: i }); });
  const zones = runs.filter((r) => r.f !== "none").map((r) => ({ rects: rectsOf(r.f), a: act[r.from] > 0 ? act[r.from] : null, b: r.to === steps.length - 1 ? null : act[r.to + 1] }));
  steps.forEach((s, i) => { if (s.click && s.at) zones.push({ rects: marksOf(s.mark).map((m) => m.box).filter((b) => hits(s.at, b)), a: i === 0 ? null : start[i], b: act[i] + 0.3 }); });
  zones.forEach((z, k) => {
    if (z.rects.length) defs.push(`<clipPath id="fz${k}">${z.rects.map((x) => `<rect x="${x[0]}" y="${x[1]}" width="${x[2]}" height="${x[3]}"/>`).join("")}</clipPath>`);
    css.push(fadeRule(`.fz${k}`, `fz${k}`, [[z.a, z.b]], "opacity:1", "opacity:0", 0.3, 0.3));
  });
  const zoneLayers = zones.map((z, k) => `<g class="fz${k}"${z.rects.length ? ` clip-path="url(#fz${k})"` : ""}><use href="#db"/>${uses(during(z.a ?? 0, z.b ?? total))}</g>`);
  // Marks, notes and lenses on the stage (constant size, aligned to world pixels).
  const overlays = [];
  steps.forEach((s, i) => {
    const w = [[start[i] + 0.15, i === steps.length - 1 ? null : end[i]]];
    const marks = marksOf(s.mark).map((m) => { const [x, y, bw, bh] = boxStage(m.box); return { box: [x - 4, y - 4, bw + 8, bh + 8], r: (m.r ?? 4) * S + 4, hit: !!(s.click && s.at && hits(s.at, m.box)) }; });
    const lensOf = s.lens && { src: s.lens.src, zoom: s.lens.zoom ?? 2 }, note = typeof s.note === "string" ? { text: s.note } : s.note;
    const srcSt = lensOf && boxStage(lensOf.src);
    // On a click step a lens whose source does not hold the click point shows the result: it appears at the click.
    const after = !!(lensOf && s.click && s.at && !hits(s.at, lensOf.src));
    // What the arrow points at: for a lens, the first mark over its source (else the source itself); for a note, the
    // first mark. So an arrow always joins a lens to what it magnifies.
    const aim = lensOf ? marks.find((m) => (!after || !m.hit) && overlap(m.box, srcSt)) : marks[0];
    let box = null, inner = "", arrow = "";
    if (lensOf) { const z = lensOf.zoom * S; box = [0, 0, lensOf.src[2] * z, lensOf.src[3] * z]; }
    else if (note) box = [0, 0, tw(note.text, 15, 600) + 32, 36];
    if (box) {
      const target = aim?.box ?? srcSt ?? [0, 0, 0, 0], avoid = [target, ...marks.map((m) => m.box), ...rectsOf(focusOf[i]).map(boxStage)];
      if (s.at) avoid.push([...toStage(s.at).map((v) => v - 12), 24, 24]);
      const place = s.lens?.at ?? note?.at; // stage point; otherwise beside its target (then the first mark), clear of marks, focus and pointer
      const fits = (p) => p[0] >= 12 && p[1] >= 12 && p[0] + box[2] <= W - 12 && p[1] + box[3] <= VH - 12, gap = 44;
      const around = (t) => { const c = [t[0] + t[2] / 2, t[1] + t[3] / 2]; return [[t[0] + t[2] + gap, c[1] - box[3] / 2], [t[0] - gap - box[2], c[1] - box[3] / 2], [c[0] - box[2] / 2, t[1] + t[3] + gap], [c[0] - box[2] / 2, t[1] - gap - box[3]]]; };
      const cands = [...around(target), ...(marks[0] && marks[0].box !== target ? around(marks[0].box) : [])]
        .map(([x, y]) => [Math.min(Math.max(x, 12), W - 12 - box[2]), Math.min(Math.max(y, 12), VH - 12 - box[3])]);
      const at = (p) => [p[0], p[1], box[2], box[3]];
      const free = (p) => fits(p) && !avoid.some((a, k) => overlap(at(p), a, k ? 0 : 12));
      const clear = (p) => fits(p) && !marks.some((m) => overlap(at(p), m.box)) && !overlap(at(p), target, 12);
      const pos = place ?? cands.find(free) ?? cands.find(clear) ?? cands[0];
      if (box[2] > W - 24 || box[3] > VH - 24) throw new Error(`${scene.title}: langkah ${i + 1} lens/note lebih besar dari panggung`);
      box = [pos[0], pos[1], box[2], box[3]];
      if (marks.some((mk) => overlap(box, mk.box))) throw new Error(`${scene.title}: langkah ${i + 1} lens/note menutupi mark`);
      if (lensOf) {
        const [sx, sy, sw, sh] = lensOf.src, z = lensOf.zoom * S, k = `ln${i}`, keep = during(start[i], end[i]);
        defs.push(`<clipPath id="${k}"><rect x="${sx}" y="${sy}" width="${sw}" height="${sh}"/></clipPath>`);
        inner = rect(box[0] - 1, box[1] + 3, box[2] + 2, box[3], { r: 11, fill: "rgba(16,24,40,.14)" }) + rect(box[0], box[1], box[2], box[3], { r: 10, fill: scene.bg ?? C.white }) +
          `<g clip-path="url(#lc${i})"><g transform="translate(${+box[0].toFixed(2)} ${+box[1].toFixed(2)}) scale(${+z.toFixed(4)}) translate(${-sx} ${-sy})"><g clip-path="url(#${k})"><use href="#db"/>${uses(keep)}${carets.length ? '<use href="#carets"/>' : ""}</g></g></g>` +
          rect(box[0], box[1], box[2], box[3], { r: 10, stroke: C.accent, sw: 2.5 });
        defs.push(`<clipPath id="lc${i}"><rect x="${box[0]}" y="${box[1]}" width="${box[2]}" height="${box[3]}" rx="10"/></clipPath>`);
      } else inner = rect(box[0], box[1], box[2], box[3], { r: 18, fill: C.accent }) + text(box[0] + box[2] / 2, box[1] + 23, note.text, { size: 15, weight: 600, fill: C.white, anchor: "middle" });
      if (aim || lensOf) { // straight arrow from the lens or note to the nearest edge of what it points at
        const t = target, b = [box[0] + box[2] / 2, box[1] + box[3] / 2], tcc = [t[0] + t[2] / 2, t[1] + t[3] / 2];
        const p = edge(box, tcc), q = edge(t, b), ang = Math.atan2(q[1] - p[1], q[0] - p[0]), L = 11, A = 0.45;
        const head = [[q[0], q[1]], [q[0] - L * Math.cos(ang - A), q[1] - L * Math.sin(ang - A)], [q[0] - L * Math.cos(ang + A), q[1] - L * Math.sin(ang + A)]];
        const back = [q[0] - (L - 2) * Math.cos(ang), q[1] - (L - 2) * Math.sin(ang)];
        arrow = line(p[0], p[1], back[0], back[1], { stroke: C.accent, sw: 2.5, cap: "round" }) + `<path d="M${head.map((v) => v.map((n) => +n.toFixed(1)).join(" ")).join(" L")} Z" fill="${C.accent}"/>`;
      }
    }
    // Step number on the ring's top-left corner, kept fully on the stage for rings at the stage edge (rail, tab row).
    const ring = (m) => { const bx = Math.max(11, m.box[0]), by = Math.max(11, m.box[1]);
      return rect(m.box[0], m.box[1], m.box[2], m.box[3], { r: m.r, stroke: C.accent, sw: 2.5 }) +
        circle(bx, by, 10, { fill: C.accent }) + text(bx, by + 4, String(i + 1), { size: 12, weight: 700, fill: C.white, anchor: "middle" }); };
    // A lens or note stays for the whole step (a result lens from the click). On a click step the ring around the click
    // point leaves just after the click, so it never floats over a screen the click has changed; the step's other marks
    // point at the result, so they appear at the click. The arrow goes with the ring it points at, else with the lens.
    if (inner) { css.push(fadeRule(`.ov${i}`, `ov${i}`, after ? [[act[i], w[0][1]]] : w, "opacity:1", "opacity:0", 0.22, 0.14)); overlays.push(`<g class="ov${i}">${aim ? "" : arrow}${inner}</g>`); }
    const groups = s.click && s.at ? [[marks.filter((m) => m.hit), [[start[i] + 0.15, act[i] + 0.35]]], [marks.filter((m) => !m.hit), [[act[i], w[0][1]]]]] : [[marks, w]];
    groups.forEach(([ms, mw], g) => {
      if (!ms.length) return;
      css.push(fadeRule(`.om${i}_${g}`, `om${i}_${g}`, mw, "opacity:1", "opacity:0", 0.22, 0.2));
      overlays.push(`<g class="om${i}_${g}">${aim && ms.includes(aim) ? arrow : ""}${ms.map(ring).join("")}</g>`);
    });
  });
  // Pointer in stage space (constant size).
  const rest = scene.cursorStart ? toStage(scene.cursorStart) : [W - 60, VH - 50];
  const pts = []; let cur = rest;
  steps.forEach((s, i) => { pts.push([pct(start[i]), cur]); if (s.at) { cur = toStage(s.at); pts.push([pct(hit[i]), cur]); } });
  pts.push([pct(total - 0.45), cur], [100, rest]);
  const usesCursor = steps.some((s) => s.at);
  if (usesCursor) css.push(`#cur{animation:cur ${total}s infinite}@keyframes cur{${dedupe(pts.map(([p, [x, y]]) => `${p}%{transform:translate(${x}px,${y}px);animation-timing-function:${EASE_IN_OUT}}`))}}`);
  // Clicks: ripple at the stage point.
  const ripples = [];
  steps.forEach((s, i) => {
    if (!s.click || !s.at) return;
    const t = hit[i], [x, y] = toStage(s.at);
    ripples.push(`<circle id="r${i}" cx="${x}" cy="${y}" r="16" fill="rgba(184,70,13,.18)" stroke="${C.accent}" stroke-width="2.5"/>`);
    css.push(`#r${i}{opacity:0;transform-origin:${x}px ${y}px;animation:r${i} ${total}s infinite}@keyframes r${i}{0%,${pct(t)}%{opacity:0;transform:scale(.4);animation-timing-function:${EASE_OUT}}${pct(t + 0.05)}%{opacity:1}${pct(t + 0.55)}%{opacity:0;transform:scale(1.5)}100%{opacity:0}}`);
  });
  // Captions, step numbers, progress.
  const caps = capLines.map((ls, i) => `<g id="c${i}">${para(64, VH + CAP / 2 + 6 - 11 * (ls.length - 1), ls, { size: 16, fill: C.white, weight: 500, lh: 22 })}</g>`).join("");
  steps.forEach((s, i) => {
    if (!s.caption || s.caption.length > 80) throw new Error(`${scene.title}: langkah ${i + 1} caption kosong atau lebih dari 80 huruf`);
    const a = start[i], last = i === steps.length - 1, e = last ? total - 0.45 : end[i];
    css.push(`#c${i},#n${i}{opacity:${last ? 1 : 0};animation:c${i} ${total}s infinite}@keyframes c${i}{${dedupe([`0%{opacity:${i === 0 ? 1 : 0}}`, i ? `${pct(a)}%{opacity:0}` : "", i ? `${pct(a + 0.2)}%{opacity:1}` : "", `${pct(e)}%{opacity:1}`, `${pct(e + 0.2)}%{opacity:0}`, i === 0 ? `${pct(total - 0.05)}%{opacity:0}` : "", `100%{opacity:${i === 0 ? 1 : 0}}`].filter(Boolean))}}`);
  });
  const nums = steps.map((_, i) => `<g id="n${i}">${circle(32, VH + CAP / 2, 15, { fill: C.accent })}${text(32, VH + CAP / 2 + 5, String(i + 1), { size: 14, fill: C.white, anchor: "middle", weight: 700 })}</g>`).join("");
  const bar = `<rect x="0" y="${H - CAP}" width="${W}" height="3" fill="rgba(255,255,255,.18)"/><rect id="prog" x="0" y="${H - CAP}" width="${W}" height="3" fill="${C.accent}"/>`;
  css.push(`#prog{transform-origin:0 0;transform:scaleX(1);animation:prog ${total}s linear infinite}@keyframes prog{0%{transform:scaleX(0)}${pct(total - 0.45)}%{transform:scaleX(1)}100%{transform:scaleX(1)}}`);
  const reduce = `@media (prefers-reduced-motion:reduce){*{animation:none!important}#cur{display:none}}`;
  const base = scene.base.join("\n"), bg = rect(0, 0, WORLD.w, WORLD.h, { fill: scene.bg ?? C.white });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="ttl dsc" font-family='${FONT}' data-total="${total}" data-steps="${start.join(",")}">
<title id="ttl">${esc(scene.title)}</title>
<desc id="dsc">${esc(scene.desc ?? steps.map((s, i) => `${i + 1}. ${s.caption}`).join(" "))}</desc>
<style>${css.join("\n")}
${reduce}</style>
<defs>${defs.join("")}<g id="db">${bg}${base}</g><clipPath id="stage"><rect x="0" y="0" width="${W}" height="${VH}"/></clipPath></defs>
<g clip-path="url(#stage)"><g id="world" transform="scale(${+S.toFixed(4)})">
${skeleton(bg + base)}
${ids.map((id) => (els[id].skel ? `<g class="e-${id}">${skeleton(els[id].svg)}</g>` : `<use href="#ed-${id}"/>`)).join("\n")}
${zoneLayers.join("\n")}
${carets.length ? '<use href="#carets"/>' : ""}
</g>
${overlays.join("\n")}
</g>
${ripples.join("")}
${usesCursor ? `<g id="cur">${POINTER}</g>` : ""}
${rect(0, H - CAP, W, CAP, { fill: C.cocoa })}${bar}
${nums}${caps}
</svg>`;
}
function dedupe(kf) { const m = new Map(); for (const k of kf) m.set(k.slice(0, k.indexOf("{")), k); return [...m.values()].join(""); }
