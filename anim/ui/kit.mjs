// Drawings of the product UIs the scenes compose: NikahKit panel widgets, the Chrome window, the Scalev editor and
// dashboard shell, and the guide's stage pieces (dim, phone page). lib.mjs is the compiler and its primitives;
// every drawing of a real screen lives under ui/, so scenes never import from each other.
import { C, PHONE, WORLD, rect, text, line, circle, para, tw, clipped, shadow, icon, iconX } from "../lib.mjs";

// ---- NikahKit panel widgets (nikahkit/src/ui/base.css) --------------------------------------------------------------
// Button: variant "primary" (action blue), "ghost" (white, blue text+border), "quiet" (white, grey line), "danger".
// nkBtnBox gives the exact [x, y, w, h] nkBtn draws, for a step's mark (radius 4).
export const nkBtnBox = (x, y, label, o = {}) => [x, y, o.w ?? tw(label, o.size ?? 12, 500) + 24 + (o.icon ? 20 : 0), o.h ?? 36];
export function nkBtn(x, y, label, o = {}) {
  const v = o.variant ?? "primary", ic = o.icon, size = o.size ?? 12;
  const [, , w, h] = nkBtnBox(x, y, label, o);
  const fill = v === "primary" ? C.action : v === "danger" ? C.danger : C.surface;
  const stroke = v === "quiet" ? C.line : v === "danger" ? C.danger : C.action;
  const fg = v === "primary" || v === "danger" ? C.white : v === "quiet" ? C.strong : C.action;
  const cx = x + w / 2, tx = ic ? cx + 10 : cx;
  return rect(x + 0.5, y + 0.5, w - 1, h - 1, { r: 4, fill, stroke }) + (ic ? iconX(ic, cx - tw(label, size, 500) / 2 - 2, y + h / 2, 16, fg) : "") +
    text(tx, y + h / 2 + size * 0.36, label, { size, weight: 500, fill: fg, anchor: "middle" });
}
// Input (nk-input, 36 high, 4 px radius; measured in the Konten panel). o.placeholder: faint value; o.select: chevron;
// o.icon: icon at the right (calendar); o.lines: textarea lines (17 px apart); o.focus: blue 1.5 border + 3 px soft ring;
// o.err: red border; o.sel: the value selected. The value is clipped to the box.
export function nkInput(x, y, w, value, o = {}) {
  const h = o.h ?? 36, tail = o.select || o.icon ? 34 : 6;
  let s = (o.focus ? rect(x - 3, y - 3, w + 6, h + 6, { r: 6, fill: C.primarySoft }) : "") +
    rect(x + 0.5, y + 0.5, w - 1, h - 1, { r: 4, fill: C.white, stroke: o.err ? C.danger : o.focus ? C.primary : C.field, sw: o.focus || o.err ? 1.5 : 1 });
  if (o.sel && value) s += rect(x + 10, y + 8, tw(value, 14) + 2, 20, { fill: "#b4d7fe" });
  if (o.lines) s += clipped(x + 2, y + 2, w - 4, h - 4, para(x + 11, y + 22, o.lines, { size: 14, fill: C.strong, lh: 17 }));
  else if (value) s += clipped(x + 2, y + 2, w - tail, h - 4, text(x + 11, y + h / 2 + 5, value, { size: 14, fill: o.placeholder ? C.faint : C.strong }));
  if (o.select) s += icon("chevron-down", x + w - 16, y + h / 2, 16, C.text);
  if (o.icon) s += icon(o.icon, x + w - 20, y + h / 2, 16, C.strong);
  return s;
}
export const nkLabel = (x, y, s) => text(x, y, s, { size: 12, weight: 500, fill: C.strong });
export const nkHint = (x, y, s, o = {}) => text(x, y, s, { size: 12, fill: o.fill ?? C.faint });
export const nkSwitch = (x, y, on) => rect(x, y, 36, 20, { r: 10, fill: on ? C.primary : C.off }) + circle(on ? x + 26 : x + 10, y + 10, 8, { fill: C.white });
// Status pill (CSS padding 2px 6px; width from the layout measure tw): left edge x, or right edge x with o.end; tones via
// o.fill / o.fg (default ok green). nkBadgeBox gives the exact [x, y, w, 18] nkBadge draws, for a step's mark (radius 9).
export const nkBadgeBox = (x, y, label, o = {}) => { const w = tw(label, 10, 500) + 12; return [o.end ? x - w : x, y, w, 18]; };
export const nkBadge = (x, y, label, o = {}) => { const [bx, , w] = nkBadgeBox(x, y, label, o); return rect(bx, y, w, 18, { r: 9, fill: o.fill ?? C.okSoft }) + text(bx + w / 2, y + 12.5, label, { size: 10, weight: 500, fill: o.fg ?? C.ok, anchor: "middle" }); };
export const nkNote = (x, y, w, lines, o = {}) => { const h = o.h ?? 20 + lines.length * 18; const tone = o.tone ?? "info"; const bg = tone === "warn" ? C.warnSoft : tone === "err" ? C.dangerSoft : tone === "ok" ? C.okSoft : C.primarySoft; const fg = tone === "warn" ? C.warnStrong : tone === "err" ? C.danger : tone === "ok" ? C.ok : C.strong; return rect(x, y, w, h, { r: 4, fill: bg }) + para(x + 12, y + 23, lines, { size: 12, fill: fg, lh: 18 }); };
// Accordion (nk-acc, measured in Konten): 50 px bar, 18 px chevron at x + 22, title at x + 43, badge (Terisi green,
// anything else warn) with its right edge at x + w - 13. o.open: chevron down; o.h: open with a body, the box h high and a
// hairline under the bar.
export const nkAcc = (x, y, w, title, o = {}) => rect(x + 0.5, y + 0.5, w - 1, (o.h ?? 50) - 1, { r: 4, fill: C.white, stroke: C.line }) + (o.h ? line(x + 1, y + 50.5, x + w - 1, y + 50.5) : "") +
  icon(o.open || o.h ? "chevron-down" : "chevron-right", x + 22, y + 25, 18, C.strong) + text(x + 43, y + 30, title, { size: 14, weight: 500 }) +
  (o.badge ? nkBadge(x + w - 13, y + 16, o.badge, o.badge === "Terisi" ? { end: true } : { end: true, fill: C.warnSoft, fg: C.warnStrong }) : "");
// Segmented control (Gaya: Warna/Huruf/Bentuk; Template: Template/Marketing).
export function nkSeg(x, y, w, items, active) {
  const iw = w / items.length;
  return rect(x + 0.5, y + 0.5, w - 1, 37, { r: 4, fill: C.white, stroke: C.field }) + items.map((it, i) => (i === active ? rect(x + 1 + i * iw, y + 1, iw - 2, 36, { r: 3, fill: C.primarySoft }) : "") +
    text(x + i * iw + iw / 2, y + 24, it, { size: 12, weight: i === active ? 600 : 500, fill: i === active ? C.action : C.text, anchor: "middle" })).join("");
}
export const nkH3 = (x, y, s) => text(x, y, s, { size: 12, weight: 700, fill: C.strong });
// Toast (styles.js .nk-toast): left 84 / right 12 / bottom 12 of the 399-wide panel area, padding 10 12, 14 px lines
// (it grows upward), the Urungkan button on the right (Chrome's 6 px button padding inside the toast's 12). Boxes for
// marks: the toast and the Urungkan button.
export const nkToastBoxes = (lines) => {
  const h = Math.max(52, [].concat(lines).length * 18 + 20), y = 888 - h, w = tw("Urungkan", 14, 700) + 12;
  return { toast: [84, y, 303, h], undo: [375 - w, y + h / 2 - 16, w, 32] };
};
export function nkToast(lines, o = {}) {
  const ls = [].concat(lines), [x, y, w, h] = nkToastBoxes(ls).toast;
  return shadow(x, y, w, h, 4, 2) + rect(x, y, w, h, { r: 4, fill: C.strong }) + para(x + 12, y + h / 2 - (ls.length - 1) * 9 + 5, ls, { size: 14, fill: C.white, lh: 18 }) +
    (o.undo === false ? "" : text(369, y + h / 2 + 5, "Urungkan", { size: 14, weight: 700, fill: C.toastLink, anchor: "end" }));
}

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
// Rail/tool centres for pointer targets; the Simpan / Simpan & Terbitkan button boxes (marks); panel body; preview.
export const ED = {
  rail: { Template: [36, 130], Gaya: [36, 186], Audio: [36, 242], Media: [36, 298], Lapisan: [36, 354], Konten: [36, 410] },
  tool: { Bagikan: [36, 589], Urungkan: [20, 633], Ulangi: [52, 633], Perangkat: [36, 677], Klik: [36, 725], Kosongkan: [36, 773], Bantuan: [36, 821] },
  tab: { Code: [30, 66], Media: [76, 66], Security: [131, 66], Settings: [191, 66], NikahKit: [264, 66] },
  simpan: [1234, 67], terbitkan: [1358, 67], close: [368, 122], account: [302, 122], inbox: [236, 122],
  simpanBox: [1193, 50, 82, 34], terbitkanBox: [1283, 50, 151, 34],
  panel: { x: 88, y: 169, w: 279 }, // panel body content box (inside 16px padding)
  screen: { x: 727, y: 106, w: 390, h: 784 } // preview: plain screen, no device frame
};
// The two toolbar buttons, alone: scenes draw them as elements that dip when pressed (at ED.simpanBox / terbitkanBox).
export const svSimpan = (x = 0, y = 0) => rect(x + 1193, y + 50, 82, 34, { r: 4, fill: C.white, stroke: C.svBtnLine, sw: 2 }) + text(x + 1201, y + 72, "Simpan", { size: 13, weight: 500, fill: C.strong }) + iconX("file-text", x + 1258, y + 67, 15, C.strong);
export const svTerbitkan = (x = 0, y = 0) => rect(x + 1283, y + 50, 151, 34, { r: 4, fill: C.primary }) + text(x + 1403, y + 72, "Simpan & Terbitkan", { size: 13, weight: 500, fill: C.white, anchor: "end" }) + iconX("rocket", x + 1418, y + 67, 15, C.white);
const RAIL = [["Template", "layout-grid"], ["Gaya", "palette"], ["Audio", "music"], ["Media", "image"], ["Lapisan", "rows-3"], ["Konten", "pencil"]];
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
    svSimpan(x, y) + svTerbitkan(x, y);
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
const SV_MENU = [["Home", "home", 1], ["E-Payment", "credit-card"], ["Products", "package", 1], ["Landing Pages", "file-text"], ["Buku Tamu", "book-open"],
  ["Checkout Flows", "shopping-cart", 0, "New"], ["Orders", "list", 1], ["Subscriptions", "refresh-ccw"], ["Ads & WhatsApp", "send", 1], ["Stores", "home"], ["Customers", "users"],
  ["Marketers", "link"], ["Collaborations", "heart"], ["Developers", "code-xml"], ["Mailev", "mail", 0, "ext"], ["Waylev", "message-circle", 0, "ext"]];
const SV_BOTTOM = [["Tutorials", "video", 803], ["Billing", "landmark", 833], ["Settings", "settings", 862]];
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
// Dimmed backdrop over a world rect, for dialogs: Scalev's modal veil, as NikahKit's pin frame copies it (src/pin-frame.js).
export const dim = (x, y, w, h) => rect(x, y, w, h, { fill: "rgba(15,23,42,.45)" });
// A phone page in the desktop canvas: the plain screen (no device frame) at PHONE, a generic desktop around it (top bar,
// side cards) that steps leave as skeleton. content: markup drawn at PHONE coordinates, clipped to the screen.
export const phoneDesk = (content, o = {}) => rect(0, 0, WORLD.w, WORLD.h, { fill: o.bg ?? "#eef1f5" }) +
  rect(0, 0, WORLD.w, 56, { fill: C.white }) + rect(32, 18, 180, 20, { r: 10, fill: "#c9d1db" }) + rect(1180, 16, 228, 24, { r: 12, fill: "#c9d1db" }) +
  [0, 1, 2].map((k) => rect(48, 96 + k * 260, 400, 228, { r: 12, fill: C.white }) + rect(992, 96 + k * 260, 400, 228, { r: 12, fill: C.white })).join("") +
  shadow(PHONE.x, PHONE.y, PHONE.w, PHONE.h, 12, 3) + rect(PHONE.x, PHONE.y, PHONE.w, PHONE.h, { r: 12, fill: o.screen ?? C.white }) +
  clipped(PHONE.x, PHONE.y, PHONE.w, PHONE.h, content);

