// Animated SVG walkthroughs for the panduan (v2).
//
// A scene is drawn in WORLD coordinates = real screen pixels (e.g. a 1440x985 Chrome window with the Scalev editor,
// or a 390x844 phone screen), so every button keeps its real size and nothing is squashed. A CAMERA per step decides
// which part of the world fills the stage (960x536 above the caption bar): it pans/zooms between steps.
// Measurements come from the real UIs (Scalev editor, NikahKit panel, chrome://extensions, couple dashboard),
// captured 14 Okt 2026; see the constants below. Scenes import parts from here and compose them.
//
// Scene shape:
//   { title, desc?, world: { w, h }, bg?, base: [svg], els: { id: svg | { svg, enter, origin } },
//     steps: [{ caption, dur?, cam?, at?, click?, press?, show?, hide?, type?, scroll?, hover? }] }
//   cam:    { x, y, w } world rect to show (height follows the stage ratio) or "all". Defaults to the previous step.
//   at:     [x, y] world point the pointer moves to (35% of the step), click: true = ripple + pointer press.
//   press:  element id that dips to 97% when clicked (buttons). hover: element id shown while the pointer is there.
//   show/hide: element ids. enter: "fade" | "rise" (8px up) | "pop" (scale .96 from origin) | "slide" (from below);
//          delay: seconds after the step start (stagger list rows 0.04-0.08 apart).
//   type:   [{ id, n }] reveals that element left-to-right in n character steps (typing), with a caret.
//   scroll: { id, dy } moves element id (a scrolling list/panel) by dy world px during the step (ease-in-out).
// Reduced motion: the final state of every element, no pointer.

import { ICONS } from "../../nikahkit/src/icons.js";

export const W = 960, H = 600, CAP = 64, VH = H - CAP; // stage; caption bar height; visible stage height
const EASE_OUT = "cubic-bezier(0.23,1,0.32,1)", EASE_IN_OUT = "cubic-bezier(0.77,0,0.175,1)";
export const FONT = `Roboto,-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif`;

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
// Approximate text width in Roboto (for sizing buttons and pills around a label).
export const tw = (s, size = 14, weight = 400) => Math.round(String(s).length * size * (weight >= 600 ? 0.57 : weight >= 500 ? 0.55 : 0.53));
let clipN = 0;
// Clip children to a rect (scrolling panels, truncated text).
export const clipped = (x, y, w, h, ...kids) => { const id = `k${clipN++}`; return `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#${id})">${kids.join("")}</g>`; };
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

// ---- NikahKit panel widgets (nikahkit/src/ui/base.css) --------------------------------------------------------------
// Button: variant "primary" (action blue), "ghost" (white, blue text+border), "quiet" (white, grey line), "danger".
export function nkBtn(x, y, label, o = {}) {
  const v = o.variant ?? "primary", h = o.h ?? 36, ic = o.icon, size = o.size ?? 12;
  const w = o.w ?? tw(label, size, 500) + 24 + (ic ? 20 : 0);
  const fill = v === "primary" ? C.action : v === "danger" ? C.danger : C.surface;
  const stroke = v === "quiet" ? C.line : v === "danger" ? C.danger : C.action;
  const fg = v === "primary" || v === "danger" ? C.white : v === "quiet" ? C.strong : C.action;
  const cx = x + w / 2, tx = ic ? cx + 10 : cx;
  return rect(x + 0.5, y + 0.5, w - 1, h - 1, { r: 4, fill, stroke }) + (ic ? iconX(ic, cx - tw(label, size, 500) / 2 - 2, y + h / 2, 16, fg) : "") +
    text(tx, y + h / 2 + size * 0.36, label, { size, weight: 500, fill: fg, anchor: "middle" });
}
export const nkInput = (x, y, w, value, o = {}) => rect(x + 0.5, y + 0.5, w - 1, (o.h ?? 36) - 1, { r: 4, fill: C.white, stroke: o.focus ? C.primary : C.field, sw: o.focus ? 2 : 1 }) +
  (value ? text(x + 10, y + (o.h ?? 36) / 2 + 5, value, { size: 14, fill: o.placeholder ? C.faint : C.strong }) : "") +
  (o.select ? icon("chevron-down", x + w - 16, y + (o.h ?? 36) / 2, 16, C.text) : "");
export const nkLabel = (x, y, s) => text(x, y, s, { size: 12, weight: 500, fill: C.strong });
export const nkHint = (x, y, s, o = {}) => text(x, y, s, { size: 12, fill: o.fill ?? C.faint });
export const nkSwitch = (x, y, on) => rect(x, y, 36, 20, { r: 10, fill: on ? C.primary : C.off }) + circle(on ? x + 26 : x + 10, y + 10, 8, { fill: C.white });
export const nkBadge = (x, y, label, o = {}) => { const w = tw(label, 10, 500) + 12; return rect(x, y, w, 18, { r: 9, fill: o.fill ?? C.okSoft }) + text(x + w / 2, y + 12.5, label, { size: 10, weight: 500, fill: o.fg ?? C.ok, anchor: "middle" }); };
export const nkNote = (x, y, w, lines, o = {}) => { const h = o.h ?? 20 + lines.length * 18; const tone = o.tone ?? "info"; const bg = tone === "warn" ? C.warnSoft : tone === "err" ? C.dangerSoft : tone === "ok" ? C.okSoft : C.primarySoft; const fg = tone === "warn" ? C.warnStrong : tone === "err" ? C.danger : tone === "ok" ? C.ok : C.strong; return rect(x, y, w, h, { r: 4, fill: bg }) + para(x + 12, y + 23, lines, { size: 12, fill: fg, lh: 18 }); };
// Accordion row (Konten groups): title, optional badge (Terisi / Belum diisi), chevron.
export const nkAcc = (x, y, w, title, o = {}) => rect(x + 0.5, y + 0.5, w - 1, 49, { r: 4, fill: C.white, stroke: C.line }) + icon(o.open ? "chevron-down" : "chevron-right", x + 18, y + 25, 16, C.text) +
  text(x + 34, y + 30, title, { size: 14, weight: 500 }) + (o.badge ? nkBadge(x + w - tw(o.badge, 10, 500) - 24, y + 16, o.badge, o.badge === "Terisi" ? {} : { fill: C.warnSoft, fg: C.warnStrong }) : "");
// Segmented control (Gaya: Warna/Huruf/Bentuk; Template: Template/Marketing).
export function nkSeg(x, y, w, items, active) {
  const iw = w / items.length;
  return rect(x + 0.5, y + 0.5, w - 1, 37, { r: 4, fill: C.white, stroke: C.field }) + items.map((it, i) => (i === active ? rect(x + 1 + i * iw, y + 1, iw - 2, 36, { r: 3, fill: C.primarySoft }) : "") +
    text(x + i * iw + iw / 2, y + 24, it, { size: 12, weight: i === active ? 600 : 500, fill: i === active ? C.action : C.text, anchor: "middle" })).join("");
}
export const nkH3 = (x, y, s) => text(x, y, s, { size: 12, weight: 700, fill: C.strong });

// ---- Chrome window --------------------------------------------------------------------------------------------------
// Chrome (light, 2024 UI) at real size: tab strip 41px, toolbar 44px, content from y + 85.
export const CHROME_TOP = 85;
export function chrome(x, y, w, h, o = {}) {
  const tabs = o.tabs ?? [{ title: o.title ?? "Tab baru", active: true, fav: o.fav }];
  let s = rect(x, y, w, h, { r: 10, fill: C.white }) + rect(x, y, w, 41, { r: 10, fill: C.crFrame }) + rect(x, y + 30, w, 11, { fill: C.crFrame });
  [["#ff5f57", 20], ["#febc2e", 40], ["#28c840", 60]].forEach(([c, dx]) => (s += circle(x + dx, y + 20, 6, { fill: c })));
  let tx = x + 84;
  tabs.forEach((t) => {
    const tw2 = t.w ?? 240;
    if (t.active) s += `<path d="M${tx - 8} ${y + 41} q8 0 8 -8 v-18 q0 -9 9 -9 h${tw2 - 18} q9 0 9 9 v18 q0 8 8 8 z" fill="${C.crTab}"/>`;
    s += (t.fav ?? favDot)(tx + 16, y + 23) + text(tx + 32, y + 28, t.title, { size: 12, fill: C.crText }) + iconX("x", tx + tw2 - 16, y + 23, 14, C.crIcon);
    tx += tw2 + 8;
  });
  s += iconX("plus", tx + 8, y + 22, 16, C.crIcon);
  // toolbar
  const ty = y + 41;
  s += rect(x, ty, w, 44, { fill: C.white }) + iconX("arrow-left", x + 24, ty + 22, 18, C.crIcon) + iconX("arrow-right", x + 60, ty + 22, 18, o.forward ? C.crIcon : "#c4c7c5") + iconX("rotate-cw", x + 96, ty + 22, 17, C.crIcon) +
    rect(x + 124, ty + 5, w - 124 - 132, 34, { r: 17, fill: C.crOmni }) + (o.urlIcon ?? iconX("search", x + 146, ty + 22, 15, C.crIcon)) +
    text(x + 166, ty + 27, o.url ?? "", { size: 14, fill: C.crText }) +
    iconX("puzzle", x + w - 100, ty + 22, 18, C.crIcon) + circle(x + w - 62, ty + 22, 13, { fill: "#7cacf8" }) + text(x + w - 62, ty + 27, o.avatar ?? "R", { size: 13, weight: 600, fill: C.white, anchor: "middle" }) +
    iconX("more-vertical", x + w - 24, ty + 22, 18, C.crIcon) + line(x, ty + 44, x + w, ty + 44, { stroke: "#e3e3e3" });
  return s;
}
const favDot = (cx, cy) => circle(cx, cy, 7, { fill: "#c4c7c5" });
export const favScalev = (cx, cy) => circle(cx, cy, 8, { fill: C.primary }) + text(cx, cy + 4, "S", { size: 10, weight: 700, fill: C.white, anchor: "middle" });
export const favChrome = (cx, cy) => circle(cx, cy, 8, { fill: "#4285f4" }) + circle(cx, cy, 3.5, { fill: C.white });
// Chrome toggle (Mode developer, extension on/off).
export const toggleCr = (x, y, on) => rect(x, y, 36, 18, { r: 9, fill: on ? C.crBlue : "#e1e3e1", stroke: on ? undefined : "#747775" }) + circle(on ? x + 27 : x + 9, y + 9, on ? 7 : 5, { fill: on ? C.white : "#747775" });
// NikahKit logo (the extension icon: two rings on Scalev blue).
export const nkLogo = (cx, cy, size = 18) => rect(cx - size / 2, cy - size / 2, size, size, { r: size * 0.22, fill: "#4a9de8" }) +
  circle(cx - size * 0.13, cy, size * 0.2, { stroke: C.white, sw: size * 0.08 }) + circle(cx + size * 0.13, cy, size * 0.2, { stroke: C.white, sw: size * 0.08 });

// ---- Scalev editor (Landing Page Studio, HTML Mode), real 1440x900 viewport at (x, y) -------------------------------
// Rail/tool centres for pointer targets; panel body area; preview screen rect.
export const ED = {
  rail: { Template: [36, 130], Gaya: [36, 186], Audio: [36, 242], Media: [36, 298], Lapisan: [36, 354], Konten: [36, 410] },
  tool: { Bagikan: [36, 589], Urungkan: [20, 633], Ulangi: [52, 633], Perangkat: [36, 677], Klik: [36, 725], Kosongkan: [36, 773], Bantuan: [36, 821] },
  tab: { Code: [30, 66], Media: [76, 66], Security: [131, 66], Settings: [191, 66], NikahKit: [264, 66] },
  simpan: [1234, 67], terbitkan: [1358, 67], close: [368, 122], account: [302, 122], inbox: [236, 122],
  panel: { x: 88, y: 169, w: 279 }, // panel body content box (inside 16px padding)
  screen: { x: 727, y: 106, w: 390, h: 784 } // preview: plain screen, no device frame
};
export const RAIL = [["Template", "layout-grid"], ["Gaya", "palette"], ["Audio", "music"], ["Media", "image"], ["Lapisan", "rows-3"], ["Konten", "pencil"]];
export function scalevEditor(x, y, o = {}) {
  const tab = o.tab ?? "NikahKit", page = o.page ?? "Undangan Rani & Dimas";
  let s = rect(x, y, 1440, 900, { fill: C.svPreview });
  // top bar
  s += rect(x, y, 1440, 44, { fill: C.svTop }) + iconX("x", x + 26, y + 22, 18, C.white) + circle(x + 61, y + 22, 12, { fill: C.white }) + circle(x + 61, y + 22, 6, { fill: C.svTop }) +
    text(x + 83, y + 26, "Landing Page Studio", { size: 12, fill: C.white }) + circle(x + 92 + tw("Landing Page Studio", 12), y + 22, 1.6, { fill: C.white }) + text(x + 102 + tw("Landing Page Studio", 12), y + 26, page, { size: 12, fill: C.white }) +
    rect(x + 1250.5, y + 10.5, 93, 24, { r: 4, stroke: "rgba(255,255,255,.6)" }) + text(x + 1297, y + 26, "View analytics", { size: 11, weight: 600, fill: C.white, anchor: "middle" }) +
    text(x + 1356, y + 26, o.user ?? "Rina", { size: 12, fill: C.white }) + circle(x + 1412, y + 22, 12, { fill: C.white }) + text(x + 1412, y + 26, (o.user ?? "Rina")[0], { size: 11, weight: 500, fill: C.svTop, anchor: "middle" });
  // second row: Scalev tabs (left) + toolbar (right)
  s += rect(x, y + 44, 1440, 48, { fill: C.white }) + line(x, y + 92, x + 1440, y + 92, { stroke: C.svDivider }) + line(x + 399, y + 44, x + 399, y + 900, { stroke: C.svDivider });
  [["Code", 16], ["Media", 60], ["Security", 109], ["Settings", 169]].forEach(([t, tx]) => (s += text(x + tx, y + 70, t, { size: 12, weight: t === tab ? 700 : 500, fill: t === tab ? C.svTabOn : C.svTab })));
  s += nkLogo(x + 238, y + 65, 16) + text(x + 253, y + 70, "NikahKit", { size: 12, weight: tab === "NikahKit" ? 700 : 500, fill: tab === "NikahKit" ? C.svTabOn : C.svTab });
  const ux = { Code: 30, Media: 76, Security: 131, Settings: 191, NikahKit: 264 }[tab];
  s += `<defs><linearGradient id="nkInd" x1="0" x2="1"><stop offset="0" stop-color="#09afed"/><stop offset="1" stop-color="#66d1f9"/></linearGradient></defs>` + rect(x + ux - 14, y + 87, 28, 5, { r: 2, fill: "url(#nkInd)" });
  s += iconX("panel-left", x + 428, y + 67, 20, C.text) + icon("lock", x + 462, y + 67, 20, C.text) +
    rect(x + 492.5, y + 52.5, 205, 30, { r: 4, fill: "#e8f9ef", stroke: C.svEditOk }) + text(x + 501, y + 73, "Only you are editing this page", { size: 14, fill: C.ok }) +
    rect(x + 858.5, y + 50.5, 123, 33, { r: 4, fill: "#f6f9fc", stroke: C.svDivider }) +
    ["monitor", "monitor", "tablet", "smartphone"].map((ic, i) => (i === 3 ? rect(x + 952, y + 54, 26, 26, { r: 3, fill: C.white }) : "") + icon(ic, x + 874 + i * 30, y + 67, 14, C.text)).join("") +
    rect(x + 990.5, y + 53.5, 35, 27, { r: 4, fill: C.white, stroke: C.svDivider, sw: 2 }) + iconX("search", x + 1008, y + 67, 16, C.text) +
    rect(x + 1193, y + 50, 82, 34, { r: 4, fill: C.white, stroke: C.svBtnLine, sw: 2 }) + text(x + 1201, y + 72, "Simpan", { size: 13, weight: 500, fill: C.strong }) + iconX("file-text", x + 1258, y + 67, 15, C.strong) +
    rect(x + 1283, y + 50, 151, 34, { r: 4, fill: C.primary }) + text(x + 1403, y + 72, "Simpan & Terbitkan", { size: 13, weight: 500, fill: C.white, anchor: "end" }) + iconX("rocket", x + 1418, y + 67, 15, C.white);
  // left area
  if (tab === "NikahKit") s += nkRail(x, y, o.rail ?? "Template", o) + rect(x + 72, y + 92, 327, 808, { fill: C.white });
  else s += rect(x, y + 92, 399, 808, { fill: C.white }) + [0, 1, 2, 3, 4, 5, 6, 7].map((k) => rect(x + 20, y + 120 + k * 26, [220, 300, 260, 340, 180, 280, 240, 320][k], 10, { r: 5, fill: C.mutedBg })).join("");
  // preview screen (no device frame)
  const sc = ED.screen;
  s += rect(x + sc.x - 1, y + sc.y - 1, sc.w + 2, sc.h + 2, { fill: "rgba(16,24,40,.06)" }) + rect(x + sc.x, y + sc.y, sc.w, sc.h, { fill: o.screenFill ?? "#fdf6ee" });
  return s;
}
// NikahKit rail (72px): tabs with icon over label, tools, save status foot.
export function nkRail(x, y, active, o = {}) {
  let s = rect(x, y + 92, 72, 808, { fill: C.page });
  RAIL.forEach(([n, ic], i) => {
    const ty = y + 104 + i * 56, on = n === active;
    if (on) s += rect(x, ty, 71, 52, { fill: C.white }) + rect(x, ty + 8, 3, 36, { r: 1.5, fill: C.primary });
    s += icon(ic, x + 36, ty + 16, 20, on ? C.strong : C.text) + text(x + 36, ty + 42, n, { size: 12, weight: 500, fill: on ? C.strong : C.text, anchor: "middle" });
    if (o.changed?.includes(n)) s += circle(x + 50, ty + 8, 4, { fill: C.changed });
  });
  s += line(x, y + 554, x + 71, y + 554, { stroke: C.line });
  s += icon("share-2", x + 36, y + 581, 18, C.text) + text(x + 36, y + 604, "Bagikan", { size: 10, fill: C.text, anchor: "middle" }) +
    icon("undo-2", x + 20, y + 633, 16, C.text) + icon("redo-2", x + 52, y + 633, 16, C.off) +
    icon(o.device === "Desktop" ? "monitor" : o.device === "Tablet" ? "tablet" : "smartphone", x + 36, y + 669, 18, C.text) + text(x + 36, y + 692, o.device ?? "Mobile", { size: 10, fill: C.text, anchor: "middle" }) +
    icon("mouse-pointer-click", x + 36, y + 717, 18, o.klik === false ? C.text : C.action) + text(x + 36, y + 740, o.klik === false ? "Klik mati" : "Klik aktif", { size: 10, fill: o.klik === false ? C.text : C.action, anchor: "middle" }) +
    icon("eraser", x + 36, y + 765, 18, C.text) + text(x + 36, y + 788, "Kosongkan", { size: 10, fill: C.text, anchor: "middle" }) +
    icon("circle-question-mark", x + 36, y + 813, 18, C.text) + text(x + 36, y + 836, "Bantuan", { size: 10, fill: C.text, anchor: "middle" }) +
    rect(x, y + 851, 71, 49, { fill: C.page }) + line(x, y + 851, x + 71, y + 851, { stroke: C.line }) +
    circle(x + 36, y + 868, 4, { fill: o.saving === "Menulis..." ? C.changed : o.saving === "Gagal" || o.saving === "Dijeda" ? C.warn : C.ok }) + text(x + 36, y + 888, o.saving ?? "Tersimpan", { size: 10, fill: C.text, anchor: "middle" });
  return s;
}
// Panel header (title, inbox, account chip, close) at the panel's real place.
export const nkHead = (x, y, title, o = {}) => rect(x + 72, y + 92, 327, 61, { fill: C.white }) + text(x + 88, y + 128, title, { size: 16, weight: 700, fill: C.strong }) +
  (o.inbox === false ? "" : icon("inbox", x + 236, y + 122, 18, C.text)) +
  (o.account === false ? "" : rect(x + 262.5, y + 108.5, 79, 27, { r: 14, fill: C.white, stroke: C.field }) + icon("circle-user-round", x + 278, y + 122, 14, C.action) + text(x + 289, y + 126, o.account ?? "Akun", { size: 12, weight: 500, fill: C.strong })) +
  iconX("x", x + 368, y + 122, 18, C.text);
// A panel-wide dialog (Bagikan, Bantuan, Pesanan masuk) covering rail and panel (0..398).
export const nkDialogHead = (x, y, title) => rect(x, y + 92, 399, 808, { fill: C.white }) + text(x + 16, y + 128, title, { size: 16, weight: 700, fill: C.strong }) + iconX("x", x + 368, y + 122, 18, C.text) + line(x, y + 153, x + 399, y + 153, { stroke: C.line });

// ---- Scalev dashboard shell (app.scalev.com), measured from /tmp/ref/scalev-pages.png ------------------------------
// Sidebar 0..255; menu rows 32px apart from y 138; chevron = has a submenu; bottom group Tutorials/Billing/Settings.
export const SV_MENU = [["Home", "home", 1], ["E-Payment", "credit-card"], ["Products", "package", 1], ["Landing Pages", "file-text"], ["Buku Tamu", "book-open"],
  ["Checkout Flows", "shopping-cart", 0, "New"], ["Orders", "list", 1], ["Subscriptions", "refresh-ccw"], ["Ads & WhatsApp", "send", 1], ["Stores", "home"], ["Customers", "users"],
  ["Marketers", "link"], ["Collaborations", "heart"], ["Developers", "code-xml"], ["Mailev", "mail", 0, "ext"], ["Waylev", "message-circle", 0, "ext"]];
export const SV_BOTTOM = [["Tutorials", "video", 803], ["Billing", "landmark", 833], ["Settings", "settings", 862]];
// Row centre of a sidebar item (pointer target): svMenuAt("Landing Pages").
export const svMenuAt = (name) => { const i = SV_MENU.findIndex((m) => m[0] === name); if (i >= 0) return [110, 138 + i * 32]; const b = SV_BOTTOM.find((m) => m[0] === name); if (b) return [100, b[2]]; throw new Error(`svMenuAt: "${name}"`); };
export function scalevApp(x, y, o = {}) {
  const active = o.active ?? "Landing Pages", biz = o.biz ?? "Rina WO";
  let s = rect(x, y, 1440, 900, { fill: C.white }) + rect(x, y, 255, 900, { fill: C.white }) + line(x + 255.5, y, x + 255.5, y + 900, { stroke: C.svDivider }) +
    circle(x + 44, y + 33, 16, { fill: "#3b7dd8" }) + circle(x + 39, y + 29, 4, { fill: C.white }) + circle(x + 49, y + 37, 4, { fill: C.white }) + text(x + 72, y + 39, "Scalev", { size: 15, weight: 700, fill: C.ink }) +
    icon("eye", x + 150, y + 33, 17, C.text) + icon("heart", x + 181, y + 33, 17, "#d42a2a") +
    `<defs><linearGradient id="svBiz" x1="0" x2="1"><stop offset="0" stop-color="#4497ca"/><stop offset="1" stop-color="#7cc6f0"/></linearGradient></defs>` +
    rect(x + 24, y + 62, 206, 48, { r: 4, fill: "url(#svBiz)" }) + circle(x + 47, y + 86, 11, { fill: C.white }) + text(x + 47, y + 90, biz[0], { size: 11, weight: 700, fill: C.strong, anchor: "middle" }) +
    text(x + 68, y + 91, biz, { size: 13, weight: 600, fill: C.white }) + icon("chevron-down", x + 212, y + 86, 14, C.white);
  SV_MENU.forEach(([n, ic, sub, tag], i) => {
    const my = y + 138 + i * 32, on = n === active;
    s += iconX(ic, x + 41, my, 15, on ? C.primary : "#4a5361") + text(x + 64, my + 5, n, { size: 14, weight: on ? 700 : 400, fill: on ? C.ink : "#3b4350" });
    if (sub) s += icon("chevron-down", x + 215, my, 14, "#4a5361");
    if (tag === "New") s += rect(x + 172, my - 9, 43, 18, { r: 9, fill: "#3b8fd0" }) + text(x + 193.5, my + 4, "New", { size: 11, weight: 600, fill: C.white, anchor: "middle" });
    if (tag === "ext") s += icon("external-link", x + 212, my, 12, "#4a5361");
  });
  SV_BOTTOM.forEach(([n, ic, by]) => { const on = n === active; s += iconX(ic, x + 44, y + by, 15, on ? C.primary : "#3b4350") + text(x + 68, y + by + 5, n, { size: 14, weight: on ? 700 : 500, fill: C.ink }); });
  return s;
}

// ---- Guide stage pieces ---------------------------------------------------------------------------------------------
// Callout pinned at a world point (drawn in world space, scales with the camera).
export const note = (x, y, label, tx, ty, o = {}) => { const w = o.w ?? tw(label, 14, 600) + 28; return line(x + w / 2, y + 32, tx, ty, { stroke: C.accent, sw: 2 }) + circle(tx, ty, 4, { fill: C.accent }) + rect(x, y, w, 32, { r: 16, fill: C.accent }) + text(x + w / 2, y + 21, label, { size: 14, weight: 600, fill: C.white, anchor: "middle" }); };
// Focus ring around a world rect.
export const ring = (x, y, w, h, o = {}) => rect(x - 4, y - 4, w + 8, h + 8, { r: o.r ?? 8, stroke: o.color ?? C.accent, sw: o.sw ?? 3 });
// Dark toast (NikahKit/Scalev snackbar).
export const toast = (x, y, label, o = {}) => { const w = o.w ?? tw(label, 14) + 40 + (o.action ? tw(o.action, 14, 600) + 24 : 0); return rect(x, y, w, 44, { r: 6, fill: "#323232" }) + text(x + 18, y + 27, label, { size: 14, fill: C.white }) + (o.action ? text(x + w - 18, y + 27, o.action, { size: 14, weight: 600, fill: "#7fd3f5", anchor: "end" }) : ""); };
// Dimmed backdrop over a world rect (for dialogs).
export const dim = (x, y, w, h) => rect(x, y, w, h, { fill: "rgba(15,22,30,.42)" });

// ---- Compiler -------------------------------------------------------------------------------------------------------
const POINTER = `<path d="M0 0 L0 20 L5.5 15 L9.5 24 L13 22.5 L9 13.8 L16.5 13.8 Z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>`;
export function compile(scene) {
  const steps = scene.steps;
  if (!steps?.length) throw new Error(`${scene.title}: tanpa langkah`);
  const world = scene.world ?? { w: W, h: VH };
  const els = Object.fromEntries(Object.entries(scene.els ?? {}).map(([id, v]) => [id, typeof v === "string" ? { svg: v } : v]));
  for (const id of Object.keys(els)) if (!/^[A-Za-z][\w-]*$/.test(id)) throw new Error(`${scene.title}: id "${id}" harus diawali huruf`);
  const durs = steps.map((s) => s.dur ?? 3.2), total = +(durs.reduce((a, b) => a + b, 0) + 1.6).toFixed(2);
  const start = durs.map((_, i) => +durs.slice(0, i).reduce((a, b) => a + b, 0).toFixed(3));
  const pct = (t) => +Math.max(0, Math.min(100, (100 * t) / total)).toFixed(3);
  const css = [];
  // Cameras: each step's view rect → stage transform (scale, tx, ty).
  const camOf = (c) => {
    const r = c === "all" || !c ? { x: 0, y: 0, w: world.w, h: world.h } : { x: c.x, y: c.y, w: c.w ?? world.w, h: c.h };
    const s = r.h ? Math.min(W / r.w, VH / r.h) : W / r.w;
    const vw = W / s, vh = VH / s;
    const cx = r.x + r.w / 2, cy = r.y + (r.h ?? vh) / 2;
    return { s, tx: -(cx - vw / 2) * s, ty: -(cy - vh / 2) * s };
  };
  // Static view: every step shows the whole world; per-step `cam` is ignored.
  const cams = steps.map(() => camOf("all"));
  steps.forEach((st) => delete st.cam);
  const camT = (c) => `translate(${+c.tx.toFixed(2)}px,${+c.ty.toFixed(2)}px) scale(${+c.s.toFixed(4)})`;
  const MOVE = 0.6;
  const camKf = [];
  steps.forEach((_, i) => { const c = cams[i], p = cams[i - 1] ?? c; camKf.push(`${pct(start[i])}%{transform:${camT(p)};animation-timing-function:${EASE_IN_OUT}}`, `${pct(start[i] + MOVE)}%{transform:${camT(c)}}`); });
  camKf.push(`${pct(total - 0.45)}%{transform:${camT(cams.at(-1))};animation-timing-function:${EASE_IN_OUT}}`, `100%{transform:${camT(cams[0])}}`);
  css.push(`#world{transform:${camT(cams.at(-1))};animation:cam ${total}s infinite}@keyframes cam{${dedupe(camKf)}}`);
  // Visibility windows.
  const win = {};
  steps.forEach((s, i) => {
    for (const id of s.show ?? []) { if (!els[id]) throw new Error(`${scene.title}: langkah ${i + 1} show "${id}" tidak ada`); (win[id] ??= []).push([i, null]); }
    for (const id of s.hide ?? []) {
      if (!els[id]) throw new Error(`${scene.title}: langkah ${i + 1} hide "${id}" tidak ada`);
      const w = win[id]; if (w && w.at(-1)[1] === null) w.at(-1)[1] = i; else (win[id] ??= []).push([-1, i]);
    }
    for (const t of s.type ?? []) if (!els[t.id ?? t]) throw new Error(`${scene.title}: langkah ${i + 1} type "${t.id ?? t}" tidak ada`);
    if (s.press && !els[s.press]) throw new Error(`${scene.title}: langkah ${i + 1} press "${s.press}" tidak ada`);
    if (s.hover && !els[s.hover]) throw new Error(`${scene.title}: langkah ${i + 1} hover "${s.hover}" tidak ada`);
    if (s.scroll && !els[s.scroll.id]) throw new Error(`${scene.title}: langkah ${i + 1} scroll "${s.scroll.id}" tidak ada`);
  });
  steps.forEach((s, i) => { if (s.hover) { const t = start[i] + durs[i] * 0.3; (win[s.hover] ??= []).push([`t${t}`, `t${start[i] + durs[i]}`]); } });
  const ENTER = 0.26, EXIT = 0.16;
  const off = (el) => {
    const e = el.enter ?? "rise";
    if (e === "fade") return "opacity:0";
    if (e === "pop") return "opacity:0;transform:scale(.96)";
    if (e === "slide") return "opacity:0;transform:translateY(24px)";
    return "opacity:0;transform:translateY(8px)";
  };
  const onState = (el) => ((el.enter ?? "rise") === "fade" ? "opacity:1" : "opacity:1;transform:none");
  const tOf = (v, kind) => (typeof v === "string" ? +v.slice(1) : start[v]);
  Object.entries(els).forEach(([id, el], k) => {
    const w = win[id];
    if (!w) return;
    const kf = [], startsOn = w[0][0] === -1, endsOn = w.at(-1)[1] === null;
    kf.push(`0%{${startsOn ? onState(el) : off(el)}}`);
    for (const [a, b] of w) {
      if (a !== -1) { const t = tOf(a) + (typeof a === "number" ? el.delay ?? 0 : 0); kf.push(`${pct(t)}%{${off(el)};animation-timing-function:${EASE_OUT}}`, `${pct(t + ENTER)}%{${onState(el)}}`); }
      if (b !== null) { const t = tOf(b); kf.push(`${pct(t)}%{${onState(el)};animation-timing-function:${EASE_OUT}}`, `${pct(t + EXIT)}%{${off(el)}}`); }
    }
    kf.push(`${pct(total - 0.45)}%{${endsOn ? onState(el) : off(el)}}`, `100%{${startsOn ? onState(el) : off(el)}}`);
    const origin = el.origin ? `transform-origin:${el.origin[0]}px ${el.origin[1]}px;` : "transform-box:fill-box;transform-origin:center;";
    css.push(`#e-${id}{${origin}${endsOn ? onState(el) : off(el)};animation:v${k} ${total}s infinite}@keyframes v${k}{${dedupe(kf)}}`);
  });
  // Typing: clip reveal in character steps + caret.
  const defs = [];
  steps.forEach((s, i) => (s.type ?? []).forEach((t, j) => {
    const id = t.id ?? t, n = t.n ?? 16, cid = `ty${i}_${j}`, t0 = start[i] + (s.click && s.at ? Math.max(MOVE, durs[i] * 0.35) + 0.1 : 0.35), t1 = Math.min(start[i] + durs[i] * 0.85, t0 + n * 0.07);
    defs.push(`<clipPath id="${cid}"><rect class="${cid}" x="-2000" y="-2000" width="8000" height="8000"/></clipPath>`);
    css.push(`.${cid}{transform-box:fill-box;transform-origin:left center;animation:${cid} ${total}s infinite}@keyframes ${cid}{0%,${pct(t0)}%{transform:scaleX(0);animation-timing-function:steps(${n},end)}${pct(t1)}%,${pct(total - 0.45)}%{transform:scaleX(1)}100%{transform:scaleX(1)}}`);
    const bb = t.box; // optional [x, y, w, h] of the text to clip precisely
    if (bb) {
      defs.pop();
      defs.push(`<clipPath id="${cid}"><rect class="${cid}" x="${bb[0]}" y="${bb[1]}" width="${bb[2]}" height="${bb[3]}"/></clipPath>`);
      els[id].caret = { box: bb, t0, t1 };
    }
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
  // Press: buttons dip to .97 on click.
  steps.forEach((s, i) => {
    if (!s.press) return;
    const t = start[i] + durs[i] * 0.35, id = s.press;
    els[id].svg = `<g class="pr${i}">${els[id].svg}</g>`;
    css.push(`.pr${i}{transform-box:fill-box;transform-origin:center;animation:pr${i} ${total}s infinite}@keyframes pr${i}{0%,${pct(t)}%{transform:none;animation-timing-function:${EASE_OUT}}${pct(t + 0.08)}%{transform:scale(.97)}${pct(t + 0.24)}%,100%{transform:none}}`);
  });
  // Pointer in stage space (constant size): position = camera(world point) at arrival.
  const toStage = (p, c) => [+(p[0] * c.s + c.tx).toFixed(1), +(p[1] * c.s + c.ty).toFixed(1)];
  const rest = scene.cursorStart ? toStage(scene.cursorStart, cams[0]) : [W - 140, VH - 70];
  const pts = []; let cur = rest, curWorld = null;
  steps.forEach((s, i) => {
    const t = start[i];
    pts.push([pct(t), cur]);
    if (curWorld && s.cam) { cur = toStage(curWorld, cams[i]); pts.push([pct(t + MOVE), cur]); }
    if (s.at) { curWorld = s.at; cur = toStage(s.at, cams[i]); pts.push([pct(t + Math.max(MOVE, durs[i] * 0.35)), cur]); }
  });
  pts.push([pct(total - 0.45), cur], [100, rest]);
  const usesCursor = steps.some((s) => s.at);
  if (usesCursor) css.push(`#cur{animation:cur ${total}s infinite}@keyframes cur{${dedupe(pts.map(([p, [x, y]]) => `${p}%{transform:translate(${x}px,${y}px);animation-timing-function:${EASE_IN_OUT}}`))}}`);
  // Clicks: ripple at the stage point + pointer press.
  const ripples = [];
  steps.forEach((s, i) => {
    if (!s.click || !s.at) return;
    const t = start[i] + Math.max(MOVE, durs[i] * 0.35), [x, y] = toStage(s.at, cams[i]);
    ripples.push(`<circle id="r${i}" cx="${x}" cy="${y}" r="16" fill="rgba(184,70,13,.18)" stroke="${C.accent}" stroke-width="2.5"/>`);
    css.push(`#r${i}{opacity:0;transform-origin:${x}px ${y}px;animation:r${i} ${total}s infinite}@keyframes r${i}{0%,${pct(t)}%{opacity:0;transform:scale(.4);animation-timing-function:${EASE_OUT}}${pct(t + 0.05)}%{opacity:1}${pct(t + 0.55)}%{opacity:0;transform:scale(1.5)}100%{opacity:0}}`);
  });
  // Captions, step numbers, progress.
  const caps = steps.map((s, i) => `<g id="c${i}">${text(64, H - CAP / 2 + 6, s.caption, { size: 16, fill: C.white, weight: 500 })}</g>`).join("");
  steps.forEach((s, i) => {
    if (!s.caption || s.caption.length > 80) throw new Error(`${scene.title}: langkah ${i + 1} caption kosong atau lebih dari 80 huruf`);
    const a = start[i], b = a + durs[i], last = i === steps.length - 1, end = last ? total - 0.45 : b;
    css.push(`#c${i},#n${i}{opacity:${last ? 1 : 0};animation:c${i} ${total}s infinite}@keyframes c${i}{${dedupe([`0%{opacity:${i === 0 ? 1 : 0}}`, i ? `${pct(a)}%{opacity:0}` : "", i ? `${pct(a + 0.2)}%{opacity:1}` : "", `${pct(end)}%{opacity:1}`, `${pct(end + 0.2)}%{opacity:0}`, i === 0 ? `${pct(total - 0.05)}%{opacity:0}` : "", `100%{opacity:${i === 0 ? 1 : 0}}`].filter(Boolean))}}`);
  });
  const nums = steps.map((_, i) => `<g id="n${i}">${circle(32, H - CAP / 2, 15, { fill: C.accent })}${text(32, H - CAP / 2 + 5, String(i + 1), { size: 14, fill: C.white, anchor: "middle", weight: 700 })}</g>`).join("");
  const bar = `<rect x="0" y="${H - CAP}" width="${W}" height="3" fill="rgba(255,255,255,.18)"/><rect id="prog" x="0" y="${H - CAP}" width="${W}" height="3" fill="${C.accent}"/>`;
  css.push(`#prog{transform-origin:0 0;transform:scaleX(1);animation:prog ${total}s linear infinite}@keyframes prog{0%{transform:scaleX(0)}${pct(total - 0.45)}%{transform:scaleX(1)}100%{transform:scaleX(1)}}`);
  // Carets for typed fields.
  const carets = Object.entries(els).filter(([, e]) => e.caret).map(([id, e], k) => {
    const [x, y, w, h] = e.caret.box;
    css.push(`#ca${k}{opacity:0;animation:ca${k} ${total}s infinite}@keyframes ca${k}{0%,${pct(e.caret.t0)}%{opacity:0;transform:translateX(0)}${pct(e.caret.t0) + 0.001}%{opacity:1;transform:translateX(0);animation-timing-function:steps(${Math.max(2, Math.round((e.caret.t1 - e.caret.t0) / 0.07))},end)}${pct(e.caret.t1)}%{opacity:1;transform:translateX(${w}px)}${pct(e.caret.t1 + 0.5)}%{opacity:0;transform:translateX(${w}px)}100%{opacity:0;transform:translateX(${w}px)}}`);
    return `<rect id="ca${k}" x="${x}" y="${y + 2}" width="1.5" height="${h - 4}" fill="${C.strong}"/>`;
  });
  const reduce = `@media (prefers-reduced-motion:reduce){*{animation:none!important}#cur{display:none}}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="ttl dsc" font-family='${FONT}' data-total="${total}" data-steps="${start.join(",")}">
<title id="ttl">${esc(scene.title)}</title>
<desc id="dsc">${esc(scene.desc ?? steps.map((s, i) => `${i + 1}. ${s.caption}`).join(" "))}</desc>
<style>${css.join("\n")}
${reduce}</style>
<defs>${defs.join("")}<clipPath id="stage"><rect x="0" y="0" width="${W}" height="${VH}"/></clipPath></defs>
${rect(0, 0, W, H, { r: 0, fill: scene.bg ?? "#eef1f5" })}
<g clip-path="url(#stage)"><g id="world">
${(scene.base ?? []).join("\n")}
${Object.entries(els).map(([id, e]) => `<g id="e-${id}">${e.svg}</g>`).join("\n")}
${carets.join("")}
</g></g>
${ripples.join("")}
${usesCursor ? `<g id="cur">${POINTER}</g>` : ""}
${rect(0, H - CAP, W, CAP, { fill: C.cocoa })}${bar}
${nums}${caps}
</svg>`;
}
function dedupe(kf) { const m = new Map(); for (const k of kf) m.set(k.slice(0, k.indexOf("{")), k); return [...m.values()].join(""); }
