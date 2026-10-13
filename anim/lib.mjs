// Animated SVG walkthroughs for the panduan. One scene = a list of steps on a 960x600 stage:
// each step has a caption, an optional cursor target (and click), and the elements it shows or hides.
// The output is a single self-contained SVG (inline CSS keyframes, no script), so docs.page can show it
// through <Image> like any picture. Readers with "reduce motion" get the final frame, without the cursor.
//
// Element visibility: an element listed in step i `show` is visible from step i on, until a later step lists it
// in `hide`. Elements never shown stay visible from the start (the base screen). Cursor moves during the first
// 35% of a step, then clicks (ripple) when `click` is set. `type: [id]` reveals that element left-to-right over
// the step (typing). Everything else is plain SVG markup from the helpers below or hand-written.

export const W = 960, H = 600, CAP = 64; // stage size; caption bar height at the bottom
export const C = {
  ink: "#202124", muted: "#5f6368", line: "#dadce0", soft: "#f1f3f4", paper: "#ffffff", bg: "#f8f9fa",
  sv: "#0899cf", svDark: "#0779a6", svTint: "#e6f6fc", ok: "#188038", okTint: "#e6f4ea", warn: "#b06000", warnTint: "#fef7e0",
  bad: "#c5221f", badTint: "#fce8e6", wa: "#25d366", waDark: "#075e54", waTint: "#dcf8c6", cocoa: "#2b1a07", accent: "#b8460d", tint: "#f7efe9"
};
const FONT = `system-ui,-apple-system,"Segoe UI",Roboto,sans-serif`;

export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const attrs = (o) => Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== false).map(([k, v]) => ` ${k}="${esc(v)}"`).join("");

// ---- Primitives -------------------------------------------------------------------------------------------------
export const g = (id, ...children) => `<g${id ? ` id="${id}"` : ""}>${children.join("")}</g>`;
export const rect = (x, y, w, h, o = {}) => `<rect${attrs({ x, y, width: w, height: h, rx: o.r ?? 6, fill: o.fill ?? C.paper, stroke: o.stroke, "stroke-width": o.stroke ? o.sw ?? 1 : undefined, "stroke-dasharray": o.dash })}/>`;
export const text = (x, y, s, o = {}) => `<text${attrs({ x, y, "font-size": o.size ?? 14, "font-weight": o.weight, fill: o.fill ?? C.ink, "text-anchor": o.anchor, "font-family": o.mono ? "ui-monospace,Menlo,monospace" : undefined })}>${esc(s)}</text>`;
export const line = (x1, y1, x2, y2, o = {}) => `<line${attrs({ x1, y1, x2, y2, stroke: o.stroke ?? C.line, "stroke-width": o.sw ?? 1, "stroke-dasharray": o.dash })}/>`;
export const circle = (cx, cy, r, o = {}) => `<circle${attrs({ cx, cy, r, fill: o.fill ?? C.sv, stroke: o.stroke, "stroke-width": o.stroke ? o.sw ?? 1 : undefined })}/>`;

// Multi-line text: lines is an array; returns one <text> with tspans.
export const para = (x, y, lines, o = {}) => `<text${attrs({ x, y, "font-size": o.size ?? 14, fill: o.fill ?? C.ink, "font-weight": o.weight, "text-anchor": o.anchor })}>${lines.map((l, i) => `<tspan x="${x}" dy="${i ? (o.lh ?? (o.size ?? 14) * 1.45) : 0}">${esc(l)}</tspan>`).join("")}</text>`;

// ---- UI pieces ----------------------------------------------------------------------------------------------------
export const button = (x, y, label, o = {}) => {
  const w = o.w ?? Math.round(label.length * (o.size ?? 14) * 0.6 + 28), h = o.h ?? 34;
  const v = o.variant ?? "primary";
  const fill = v === "primary" ? (o.color ?? C.svDark) : v === "danger" ? C.bad : v === "wa" ? C.wa : C.paper;
  const fg = v === "ghost" || v === "quiet" ? (o.color ?? C.svDark) : C.paper;
  return `${rect(x, y, w, h, { r: o.r ?? 6, fill, stroke: v === "ghost" ? (o.color ?? C.svDark) : undefined })}${text(x + w / 2, y + h / 2 + 5, label, { anchor: "middle", fill: fg, weight: 600, size: o.size ?? 14 })}`;
};
export const input = (x, y, w, label, value, o = {}) =>
  `${label ? text(x, y - 8, label, { size: 12, fill: C.muted }) : ""}${rect(x, y, w, o.h ?? 34, { r: 4, stroke: o.focus ? C.sv : "#c4c7c5", sw: o.focus ? 2 : 1 })}${value ? text(x + 10, y + (o.h ?? 34) / 2 + 5, value, { size: 14, fill: o.placeholder ? C.muted : C.ink }) : ""}`;
export const badge = (x, y, label, o = {}) => {
  const w = Math.round(label.length * 6.6 + 16);
  return `${rect(x, y, w, 20, { r: 10, fill: o.fill ?? C.svTint })}${text(x + w / 2, y + 14, label, { size: 11, anchor: "middle", fill: o.fg ?? C.svDark, weight: 600 })}`;
};
export const toast = (x, y, label, o = {}) => {
  const w = o.w ?? Math.round(label.length * 7.4 + 36);
  return `${rect(x, y, w, 40, { r: 8, fill: o.fill ?? "#323232" })}${text(x + 18, y + 25, label, { size: 14, fill: C.paper })}`;
};
// Generic card / dialog with a title.
export const card = (x, y, w, h, title, o = {}) =>
  `${o.shadow !== false ? rect(x + 2, y + 4, w, h, { r: o.r ?? 10, fill: "rgba(0,0,0,.08)" }) : ""}${rect(x, y, w, h, { r: o.r ?? 10, fill: o.fill ?? C.paper, stroke: o.stroke ?? C.line })}${title ? text(x + 20, y + 32, title, { size: o.titleSize ?? 16, weight: 600 }) : ""}`;
export const dim = (o = {}) => rect(0, 0, W, H - CAP, { r: 0, fill: o.fill ?? "rgba(0,0,0,.35)" });
// Highlight ring (draws attention to a target).
export const ring = (x, y, w, h, o = {}) => rect(x - 4, y - 4, w + 8, h + 8, { r: o.r ?? 8, fill: "none", stroke: o.color ?? C.accent, sw: 3, dash: o.dash });
// Callout label with a short line pointing at (tx,ty).
export const note = (x, y, label, tx, ty, o = {}) => {
  const w = o.w ?? Math.round(label.length * 7 + 24);
  return `${line(x + w / 2, y + 30, tx, ty, { stroke: C.accent, sw: 2 })}${rect(x, y, w, 30, { r: 15, fill: C.accent })}${text(x + w / 2, y + 20, label, { size: 13, fill: C.paper, anchor: "middle", weight: 600 })}`;
};

// Browser window (Chrome-like). Content area starts at y + 76.
export const browser = (x, y, w, h, url, o = {}) => `${rect(x, y, w, h, { r: 10, fill: C.paper, stroke: C.line })}
${rect(x, y, w, 36, { r: 10, fill: "#dee1e6" })}${rect(x, y + 26, w, 10, { r: 0, fill: "#dee1e6" })}
${rect(x + 12, y + 6, Math.min(240, w - 24), 30, { r: 8, fill: C.paper })}${text(x + 26, y + 26, o.tab ?? "", { size: 12 })}
${rect(x, y + 36, w, 40, { r: 0, fill: C.paper })}${line(x, y + 76, x + w, y + 76)}
${circle(x + 22, y + 56, 5, { fill: "#bdc1c6" })}${circle(x + 40, y + 56, 5, { fill: "#bdc1c6" })}
${rect(x + 60, y + 44, w - 120, 24, { r: 12, fill: C.soft })}${text(x + 76, y + 61, url, { size: 13, fill: C.muted })}`;

// Phone frame. Screen starts at (x+12, y+40), size (w-24) x (h-64).
export const phone = (x, y, w = 240, h = 480, o = {}) => `${rect(x, y, w, h, { r: 30, fill: o.frame ?? "#1f1f1f" })}${rect(x + 12, y + 40, w - 24, h - 64, { r: 6, fill: o.screen ?? C.paper })}${rect(x + w / 2 - 30, y + 16, 60, 8, { r: 4, fill: "#444" })}`;

// Scalev dashboard shell: dark-ish sidebar on the left, content on the right. Returns markup; content area
// x >= sx+200, y >= sy+76 within a browser frame at (sx, sy).
export const SCALEV_MENU = ["Home", "E-Payment", "Products", "Landing Pages", "Buku Tamu", "Checkout Flows", "Orders", "Customers", "Settings"];
export const scalevShell = (sx, sy, w, h, o = {}) => {
  const items = o.menu ?? SCALEV_MENU, active = o.active ?? "Landing Pages";
  return `${rect(sx, sy + 76, 190, h - 76, { r: 0, fill: C.bg })}${line(sx + 190, sy + 76, sx + 190, sy + h)}
${text(sx + 20, sy + 108, "Scalev", { size: 18, weight: 700, fill: C.sv })}
${items.map((m, i) => `${m === active ? rect(sx + 10, sy + 124 + i * 34, 170, 30, { r: 6, fill: C.svTint }) : ""}${text(sx + 24, sy + 144 + i * 34, m, { size: 13, fill: m === active ? C.svDark : C.ink, weight: m === active ? 600 : undefined })}`).join("")}`;
};

// Scalev Landing Page editor (HTML Mode): tab strip + NikahKit panel (rail + panel) + preview.
// Rail and tools follow nikahkit/src/ui/App.jsx (TABS, nk-rail__tools, nk-rail__foot).
export const EDITOR_TABS = ["Code", "Media", "Security", "Settings", "NikahKit"];
export const NK_RAIL = ["Template", "Gaya", "Audio", "Media", "Lapisan", "Konten"];
export const NK_TOOLS = ["Bagikan", "↶ ↷", "Mobile", "Klik aktif", "Kosongkan", "Bantuan"];
// Tool rows shrink so the last tool stays above the save status at the bottom of the rail.
const toolStep = (h) => Math.min(21, (h - 76 - 306 - 26) / (NK_TOOLS.length - 1));
// Rail button centre for a rail item or tool (for cursor targets): railAt(sx, sy, "Konten", h = editor height).
export const railAt = (sx, sy, name, h = 508) => {
  const top = sy + 76, i = NK_RAIL.indexOf(name), j = NK_TOOLS.indexOf(name);
  if (i >= 0) return [sx + 32, top + 109 + i * 32];
  if (j >= 0) return [sx + 32, top + 302 + j * toolStep(h)];
  throw new Error(`railAt: unknown "${name}"`);
};
export const editor = (sx, sy, w, h, o = {}) => {
  const tab = o.tab ?? "NikahKit", active = o.railActive ?? "Template";
  const top = sy + 76, px = sx + 470; // preview pane x
  return `${rect(sx, top, w, 44, { r: 0, fill: C.paper })}${line(sx, top + 44, sx + w, top + 44)}
${text(sx + 16, top + 27, o.title ?? "Landing Page Studio · HTML Mode", { size: 13, weight: 600 })}
${button(sx + w - 230, top + 6, "Simpan", { variant: "ghost", h: 30, w: 78, size: 13 })}${button(sx + w - 144, top + 6, "Simpan & Terbitkan", { h: 30, w: 134, size: 12 })}
${EDITOR_TABS.map((t, i) => `${text(sx + 18 + i * 74, top + 70, t, { size: 12, fill: t === tab ? C.svDark : C.muted, weight: t === tab ? 700 : 500 })}${t === tab ? rect(sx + 18 + i * 74, top + 78, t.length * 7, 4, { r: 2, fill: C.sv }) : ""}`).join("")}
${line(sx, top + 84, sx + 460, top + 84)}
${tab === "NikahKit" ? `${rect(sx, top + 85, 64, h - 161, { r: 0, fill: C.bg })}
${NK_RAIL.map((r, i) => `${r === active ? rect(sx + 6, top + 95 + i * 32, 52, 28, { r: 6, fill: C.svTint }) : ""}${text(sx + 32, top + 113 + i * 32, r, { size: 10, anchor: "middle", fill: r === active ? C.svDark : C.muted, weight: r === active ? 700 : 500 })}`).join("")}
${line(sx + 8, top + 288, sx + 56, top + 288)}
${NK_TOOLS.map((t, j) => text(sx + 32, top + 306 + j * toolStep(h), t, { size: 9, anchor: "middle", fill: t === "Kosongkan" ? C.bad : C.muted })).join("")}
${circle(sx + 12, sy + h - 12, 3.5, { fill: o.saving && o.saving !== "Tersimpan" ? C.warn : C.ok })}${text(sx + 19, sy + h - 8, o.saving ?? "Tersimpan", { size: 9, fill: C.muted })}
${line(sx + 64, top + 85, sx + 64, sy + h)}` : [0, 1, 2, 3, 4, 5].map((k) => rect(sx + 16, top + 104 + k * 22, [180, 260, 220, 300, 140, 240][k], 8, { r: 4, fill: C.soft })).join("")}
${line(sx + 460, top + 44, sx + 460, sy + h)}
${rect(px, top + 45, w - 470 - 10, h - 121, { r: 0, fill: "#eceff1" })}
${o.phone !== false ? phone(px + (w - 480) / 2 - 110, top + 60, 220, h - 150, { screen: o.screenFill ?? C.tint }) : ""}`;
};
// Screen area of the phone in the editor preview.
export const editorPhone = (sx, sy, w, h) => { const px = sx + 470 + (w - 480) / 2 - 110; return { x: px + 12, y: sy + 76 + 60 + 40, w: 196, h: h - 150 - 64 }; };
// Panel area of the editor (right of the rail, where forms go): x, y, width.
export const panelArea = (sx, sy) => ({ x: sx + 80, y: sy + 76 + 100, w: 364 });

// Mouse pointer (drawn at 0,0; positioned by the animation).
const POINTER = `<path d="M0 0 L0 22 L6 16 L10 26 L14 24 L10 15 L18 15 Z" fill="#111" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>`;

// ---- Scene compiler -------------------------------------------------------------------------------------------
// scene = { title, desc, base: [svg...], els: { id: svg }, steps: [{ caption, dur?, at?: [x,y], click?, show?: [], hide?: [], type?: [] }] }
export function compile(scene) {
  const steps = scene.steps;
  if (!steps?.length) throw new Error(`${scene.title}: no steps`);
  const els = scene.els ?? {};
  // Scene element ids are emitted as "e-<id>" so they never collide with the compiler's own ids (c0, d0, n0, r0, cur...).
  for (const id of Object.keys(els)) if (!/^[A-Za-z][\w-]*$/.test(id)) throw new Error(`${scene.title}: id "${id}" harus diawali huruf, isi huruf/angka/_/-`);
  const durs = steps.map((s) => s.dur ?? 3.2);
  const total = durs.reduce((a, b) => a + b, 0) + 1.6; // hold the last frame a moment before looping
  const start = durs.map((_, i) => durs.slice(0, i).reduce((a, b) => a + b, 0));
  const pct = (t) => +(100 * t / total).toFixed(3);
  const fade = 0.25; // seconds
  const css = [];
  // Visibility windows per element.
  const win = {};
  steps.forEach((s, i) => {
    for (const id of s.show ?? []) { if (!els[id]) throw new Error(`${scene.title}: step ${i + 1} shows unknown "${id}"`); (win[id] = win[id] || []).push([i, null]); }
    for (const id of s.hide ?? []) {
      if (!els[id]) throw new Error(`${scene.title}: step ${i + 1} hides unknown "${id}"`);
      const w = win[id];
      if (w && w.at(-1)[1] === null) w.at(-1)[1] = i; else (win[id] = win[id] || []).push([-1, i]); // hide a base-visible element
    }
    for (const id of s.type ?? []) if (!els[id]) throw new Error(`${scene.title}: step ${i + 1} types unknown "${id}"`);
  });
  const finalVisible = (id) => { const w = win[id]; if (!w) return true; return w.at(-1)[1] === null; };
  Object.entries(els).forEach(([id], k) => {
    const w = win[id];
    if (!w) return;
    const kf = [];
    let visible = w[0][0] === -1; // starts visible only if first window is a "hide a base element"
    kf.push(`0%{opacity:${visible ? 1 : 0}}`);
    for (const [a, b] of w) {
      if (a >= 0) { const t = start[a]; kf.push(`${pct(t)}%{opacity:0}`, `${pct(t + fade)}%{opacity:1}`); }
      if (b !== null) { const t = start[b]; kf.push(`${pct(t)}%{opacity:1}`, `${pct(t + fade)}%{opacity:0}`); }
    }
    // Loop: everything returns to the first state at the end.
    const last = w.at(-1)[1] === null;
    kf.push(`${pct(total - 0.4)}%{opacity:${last ? 1 : 0}}`, `100%{opacity:${visible ? 1 : 0}}`);
    css.push(`#e-${id}{opacity:${finalVisible(id) ? 1 : 0};animation:v${k} ${total}s linear infinite}@keyframes v${k}{${dedupe(kf)}}`);
  });
  // Typing reveal: a clipPath rect grows over the step.
  const clips = [];
  steps.forEach((s, i) => (s.type ?? []).forEach((id, j) => {
    const cid = `t${i}_${j}`, t0 = start[i] + 0.3, t1 = start[i] + durs[i] * 0.75;
    clips.push(`<clipPath id="${cid}"><rect class="${cid}" x="0" y="0" width="${W}" height="${H}"/></clipPath>`);
    css.push(`.${cid}{animation:${cid} ${total}s linear infinite}@keyframes ${cid}{0%,${pct(t0)}%{transform:scaleX(0)}${pct(t1)}%,${pct(total - 0.4)}%{transform:scaleX(1)}100%{transform:scaleX(0)}}`);
    els[id] = `<g clip-path="url(#${cid})">${els[id]}</g>`;
  }));
  // Cursor path.
  const pts = [];
  let cur = scene.cursorStart ?? [W - 120, H - CAP - 60];
  steps.forEach((s, i) => {
    const t = start[i];
    pts.push([pct(t), cur]);
    if (s.at) { cur = s.at; pts.push([pct(t + durs[i] * 0.35), cur]); }
  });
  pts.push([pct(total - 0.4), cur], [100, scene.cursorStart ?? [W - 120, H - CAP - 60]]);
  const curKf = dedupe(pts.map(([p, [x, y]]) => `${p}%{transform:translate(${x}px,${y}px)}`));
  const usesCursor = steps.some((s) => s.at);
  if (usesCursor) css.push(`#cur{animation:cur ${total}s ease-in-out infinite}@keyframes cur{${curKf}}`);
  // Click ripples.
  const ripples = [];
  steps.forEach((s, i) => {
    if (!s.click || !s.at) return;
    const t = start[i] + durs[i] * 0.35, id = `r${i}`;
    ripples.push(`<circle id="${id}" cx="${s.at[0]}" cy="${s.at[1]}" r="18" fill="none" stroke="${C.accent}" stroke-width="3"/>`);
    css.push(`#${id}{opacity:0;transform-origin:${s.at[0]}px ${s.at[1]}px;animation:${id} ${total}s linear infinite}@keyframes ${id}{0%,${pct(t)}%{opacity:0;transform:scale(.3)}${pct(t + 0.08)}%{opacity:1;transform:scale(.5)}${pct(t + 0.6)}%{opacity:0;transform:scale(1.4)}100%{opacity:0}}`);
  });
  // Captions and progress dots.
  const caps = steps.map((s, i) => `<g id="c${i}">${text(64, H - CAP / 2 + 6, s.caption, { size: 16, fill: C.paper, weight: 500 })}</g>`).join("");
  steps.forEach((s, i) => {
    if (!s.caption || s.caption.length > 80) throw new Error(`${scene.title}: step ${i + 1} caption kosong atau lebih dari 80 huruf`);
    const a = start[i], b = start[i] + durs[i], last = i === steps.length - 1;
    css.push(`#c${i}{opacity:${last ? 1 : 0};animation:c${i} ${total}s linear infinite}@keyframes c${i}{${dedupe([`0%{opacity:${i === 0 ? 1 : 0}}`, i ? `${pct(a)}%{opacity:0}` : "", i ? `${pct(a + fade)}%{opacity:1}` : "", `${pct(last ? total - 0.4 : b)}%{opacity:1}`, `${pct((last ? total - 0.4 : b) + fade)}%{opacity:0}`, i === 0 ? `${pct(total - 0.05)}%{opacity:0}` : "", `100%{opacity:${i === 0 ? 1 : 0}}`].filter(Boolean))}}`);
    css.push(`#d${i}{animation:d${i} ${total}s linear infinite}@keyframes d${i}{${dedupe([`0%{fill:${i === 0 ? C.paper : "rgba(255,255,255,.35)"}}`, i ? `${pct(a)}%{fill:rgba(255,255,255,.35)}` : "", i ? `${pct(a + fade)}%{fill:${C.paper}}` : "", `${pct(total - 0.4)}%{fill:${C.paper}}`, `100%{fill:${i === 0 ? C.paper : "rgba(255,255,255,.35)"}}`].filter(Boolean))}}`);
  });
  const num = steps.map((_, i) => `<g id="n${i}">${circle(32, H - CAP / 2, 15, { fill: C.accent })}${text(32, H - CAP / 2 + 5, String(i + 1), { size: 14, fill: C.paper, anchor: "middle", weight: 700 })}</g>`).join("");
  steps.forEach((_, i) => { css.push(`#n${i}{opacity:${i === steps.length - 1 ? 1 : 0};animation:c${i} ${total}s linear infinite}`); });
  const dots = steps.map((_, i) => `<circle id="d${i}" cx="${W - 24 - (steps.length - 1 - i) * 14}" cy="${H - CAP / 2}" r="4" fill="${C.paper}"/>`).join("");
  const reduce = `@media (prefers-reduced-motion:reduce){*{animation:none!important}#cur{display:none}}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="ttl dsc" font-family='${FONT}' data-total="${total}" data-steps="${start.join(",")}">
<title id="ttl">${esc(scene.title)}</title>
<desc id="dsc">${esc(scene.desc ?? steps.map((s, i) => `${i + 1}. ${s.caption}`).join(" "))}</desc>
<style>${css.join("\n")}
${reduce}</style>
<defs>${clips.join("")}</defs>
${rect(0, 0, W, H, { r: 14, fill: scene.bg ?? C.bg })}
${(scene.base ?? []).join("\n")}
${Object.entries(els).map(([id, svg]) => `<g id="e-${id}">${svg}</g>`).join("\n")}
${ripples.join("")}
${usesCursor ? `<g id="cur">${POINTER}</g>` : ""}
${rect(0, H - CAP, W, CAP, { r: 0, fill: C.cocoa })}${rect(0, H - 14, W, 14, { r: 14, fill: C.cocoa })}
${num}${caps}${dots}
</svg>`;
}
// Collapse identical consecutive percentages (keeps the last rule for a percentage).
function dedupe(kf) {
  const m = new Map();
  for (const k of kf) m.set(k.slice(0, k.indexOf("{")), k);
  return [...m.values()].join("");
}
