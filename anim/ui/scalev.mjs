// Scalev product screens, one copy each (owner: 02-scalev). Drawn at the editor / dashboard viewport (0,0, 1440x900).
// Measured 14 Okt 2026 (/tmp/scalev-ukur, headless Chromium at 1440x900): the Landing Pages list, the editor Settings tab, the Security tab
// (Connect / Image Sources with Scalev's auto-allowed chips, the Image Sources picker), Settings > Domain with the
// Tambah Domain dialog, Settings > Profil with Edit Account and the Security section, the store page (Stores) with
// Payment Methods and the Add Payment Method dialog. Example data replaces account data (Rina WO, tokomu.myscalev.com).
// Generic (not observed): the Save-enabled look, the domain row + DNS records after Save, the MFA switch label (bar),
// the store's product list. SV / svBtn / check / head / card / genericBody are the older generic Scalev dashboard
// pieces (grey bars) for screens a scene does not walk through.
import { C, icon, iconX, shadow, clipped, group, text, para, rect, line, circle, tw } from "../lib.mjs";
import { scalevApp, scalevEditor } from "./kit.mjs";

// ---- palette and primitives ---------------------------------------------------------------------------------------
const SV = { blue: "#3b8fd0", link: "#2f86d1", ink: "#1f2d3d", sub: "#6b7480", line: "#e5e8ec", bg: "#f8f9fb", soft: "#e6f2fb", bar: "#e9edf2" };
const bar = (x, y, w, h = 10, fill = SV.bar) => rect(x, y, w, h, { r: h / 2, fill });
// Scalev buttons (app): primary blue, outline, plain. svBox gives the exact [x, y, w, h] svBtn draws.
const svBox = (x, y, label, o = {}) => [x, y, o.w ?? tw(label, o.size ?? 14, 500) + 32, o.h ?? 40];
function svBtn(x, y, label, o = {}) {
  const v = o.variant ?? "primary", size = o.size ?? 14, [, , w, h] = svBox(x, y, label, o);
  const fill = v === "primary" ? SV.blue : C.white, stroke = v === "primary" ? undefined : v === "outline" ? SV.blue : "#d5dae1";
  return rect(x + 0.5, y + 0.5, w - 1, h - 1, { r: 4, fill, stroke }) + text(x + w / 2, y + h / 2 + size * 0.36, label, { size, weight: 500, fill: v === "primary" ? C.white : v === "outline" ? SV.blue : SV.ink, anchor: "middle" });
}
const check = (x, y, on) => rect(x + 0.5, y + 0.5, 17, 17, { r: 3, fill: on ? SV.blue : C.white, stroke: on ? SV.blue : "#b8c0ca" }) + (on ? iconX("check", x + 9, y + 9, 13, C.white, 3) : "");
// Measured Scalev app (14 Okt 2026, /tmp/scalev-ukur): colours, and text placed by its measured line box (top y, CSS px);
// `w` pins the measured width (textLength) so text and its skeleton bar match the real line.
const SVC = { blue: "#0899cf", ink: "#111827", title: "#0f161e", text: "#414042", sub: "#5b6675", mute: "#8d8b8f", off: "#b3b2b4", field: "#dbdfe5",
  fieldBg: "#f6f9fc", red: "#f14756", dark: "#223548", line: "#e8ebef", ph: "#8d97a3", grey: "#77828e", tick: "#09afed" };
const tx = (x, top, s, size, o = {}) => {
  const t = text(x, top + Math.round(size * 0.93), s, { size, ...o });
  return o.w ? t.replace("<text", `<text textLength="${o.w}" lengthAdjust="spacingAndGlyphs"`) : t;
};
// Field / button with a 2px border drawn inside its box (Scalev inputs, dialogs).
const box2 = (x, y, w, h, o = {}) => rect(x + 1, y + 1, w - 2, h - 2, { r: o.r ?? 4, fill: o.fill ?? C.white, stroke: o.stroke ?? SVC.field, sw: 2 });
const tick = (x, y, on) => on ? rect(x, y, 16, 16, { r: 4, fill: SVC.tick }) + iconX("check", x + 8, y + 8, 12, C.white, 3) : box2(x, y, 16, 16, { stroke: SVC.sub });
// Page header in the Scalev app main area (x 256..1440), like Landing Pages: title + rule.
const head = (title) => rect(256, 0, 1184, 900, { fill: SV.bg }) + rect(256, 0, 1184, 70, { fill: C.white }) + line(256, 70.5, 1440, 70.5, { stroke: SV.line }) + text(280, 43, title, { size: 18, weight: 600, fill: SV.ink });
const card = (x, y, w, h) => rect(x + 0.5, y + 0.5, w - 1, h - 1, { r: 6, fill: C.white, stroke: SV.line });
// Generic dashboard body (cards of grey bars) for screens we do not walk through.
const genericBody = (y = 94) => [0, 1, 2].map((i) => card(280 + i * 380, y, 364, 120) + bar(300 + i * 380, y + 24, 120) + bar(300 + i * 380, y + 56, 220, 18) + bar(300 + i * 380, y + 92, 160)).join("") +
  card(280, y + 144, 1124, 380) + [0, 1, 2, 3, 4, 5].map((k) => bar(304, y + 180 + k * 52, [520, 380, 600, 300, 460, 340][k])).join("");

// ---- Landing Pages list (measured 14 Okt 2026, page 365671): rows of HTML Mode pages (row i name at 585, 372 + 71 i) -----
const LP_ROWS = [["Undangan Rani & Dimas", "/rani-dimas"], ["Undangan Sari & Bima", "/sari-bima"], ["Contoh Undangan", "/contoh"], ["Katalog Rina WO", "/katalog"]];
function lpPage() {
  return rect(256, 0, 1184, 900, { fill: SV.bg }) + rect(256, 0, 1184, 137, { fill: C.white }) + line(256, 137.5, 1440, 137.5, { stroke: SV.line }) +
    text(280, 36, "Landing Pages", { size: 18, weight: 600, fill: SV.ink }) + line(280, 58.5, 1400, 58.5, { stroke: SV.line }) +
    text(469, 93, "Checkout form creation has moved.", { size: 13, fill: "#3b4350" }) + text(469, 112, "Create a checkout form here →", { size: 13, fill: SV.link, underline: true }) +
    iconX("search", 1203, 97, 15, SV.sub) + text(1223, 103, "Cari landing page...", { size: 13, fill: "#a6adb7" }) +
    rect(1360.5, 78.5, 40, 40, { r: 4, fill: C.white, stroke: "#d5dae1" }) + `<path d="M1371 89 h18 l-7 9 v7 l-4 2 v-9 z" fill="none" stroke="#4a5361" stroke-width="1.6" stroke-linejoin="round"/>` +
    rect(280, 163, 1120, 54, { r: 4, fill: "#eef8fb" }) + circle(308, 190, 7, { stroke: SV.blue, sw: 1.5 }) + text(308, 194, "i", { size: 10, weight: 700, fill: SV.blue, anchor: "middle" }) +
    text(336, 195, "Looking for landing pages with an order form? They're now called Checkout Flows.", { size: 14, fill: SV.ink }) +
    text(336 + tw("Looking for landing pages with an order form? They're now called Checkout Flows. ", 14) - 12, 195, "Open Checkout Flows", { size: 14, fill: SV.ink, underline: true }) +
    card(281, 244, 1119, 680) + line(520.5, 244, 520.5, 900, { stroke: SV.line }) +
    text(297, 275, "Folders", { size: 14, weight: 600, fill: SV.ink }) + para(297, 294, ["Kelompokkan landing page per", "campaign, produk, atau klien."], { size: 11, fill: SV.sub, lh: 16 }) +
    rect(297, 328, 207, 36, { r: 4, fill: "#eef6fc" }) + icon("layout-grid", 316, 346, 15, SV.blue) + text(335, 351, "All Landing Pages", { size: 14, weight: 500, fill: SV.link }) + text(498, 351, "4", { size: 12, fill: SV.link, anchor: "end" }) +
    [["Ungrouped", "file-text", 4], ["Page", "folder", 0], ["Undangan", "folder", 0]].map(([n, ic, c], i) => iconX(ic, 316, 384 + i * 38, 15, "#4a5361") + text(335, 389 + i * 38, n, { size: 14, fill: "#3b4350" }) + text(498, 389 + i * 38, String(c), { size: 12, fill: SV.sub, anchor: "end" })).join("") +
    rect(297.5, 488.5, 206, 41, { r: 4, fill: C.white, stroke: SV.blue }) + text(400, 514, "+  New Folder", { size: 14, weight: 500, fill: SV.link, anchor: "middle" }) +
    text(537, 273, "All Landing Pages", { size: 14, weight: 600, fill: SV.ink }) + text(667, 273, "4", { size: 12, fill: SV.sub }) +
    rect(521, 293, 879, 38, { fill: "#f6f8fa" }) + check(537, 303, false) +
    [["Nama Landing Page", 585], ["Folder", 785], ["Slug", 925], ["Mode", 1125], ["Domains", 1245]].map(([l, x]) => text(x, 316, l, { size: 12, fill: SV.sub })).join("");
}
function lpRow(i) {
  const [name, slug] = LP_ROWS[i], y = 331 + i * 71;
  return rect(521, y, 879, 71, { fill: C.white }) + line(521, y + 70.5, 1400, y + 70.5, { stroke: SV.line }) + check(537, y + 27, false) +
    text(585, y + 41, name, { size: 14, weight: 500, fill: SV.link }) + rect(787, y + 24, 92, 24, { r: 4, fill: "#f3f4f6" }) + iconX("file-text", 800, y + 36, 12, SV.sub) + text(812, y + 40, "Ungrouped", { size: 12, fill: "#3b4350" }) +
    text(925, y + 41, slug, { size: 14, fill: SV.link }) + rect(1125, y + 22, 83, 28, { r: 3, fill: SV.soft }) + text(1166.5, y + 40, "HTML Mode", { size: 12, weight: 700, fill: SV.blue, anchor: "middle" }) +
    text(1245, y + 41, "-", { size: 14, fill: SV.sub }) + [0, 1, 2].map((k) => circle(1364 + k * 7, y + 36, 2.2, { fill: "#3b4350" })).join("");
}
const lpScreen = () => scalevApp(0, 0, { active: "Landing Pages" }) + lpPage() + LP_ROWS.map((_, i) => lpRow(i)).join("");
const CREATE = svBox(280, 78, "+ Create Landing Page", { w: 173 });
const btnCreate = svBtn(280, 78, "+ Create Landing Page", { w: 173 });

// ---- editor Settings tab -------------------------------------------------------------------------------------------
// Settings tab (measured 14 Okt 2026): header row (version, status, Batalkan Penerbitan) and accordions.
const lu = (paths, cx, cy, size, color) => `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</g>`;
const ACC_ICON = {
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>'
};
const ACC = [["DOMAIN / URL", "globe"], ["SEO & PAGE IDENTITY", "search"], ["ANALYTICS SETTINGS", "chart"], ["PAGE MANAGEMENT", "users"], ["ADVANCED SETTINGS", "code"]];
const accGrad = `<defs><linearGradient id="svAcc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#12ade0"/><stop offset="1" stop-color="#087eac"/></linearGradient></defs>`;
// One accordion at y (section top); h = section height when open.
const acc = (y, i, h = 0) => rect(17, y + 1, 364, (h || 60) - 2, { r: 8, fill: C.white, stroke: "#e8ebef", sw: 2 }) + rect(18, y + 2, 362, h ? 58 : 56, { r: 6, fill: h ? "#eef2f6" : "#f3f5f7" }) +
  rect(30, y + 14, 32, 32, { r: 8, fill: "url(#svAcc)" }) + lu(ACC_ICON[ACC[i][1]], 46, y + 30, 16, C.white) +
  text(72, y + 35, ACC[i][0], { size: 12, weight: 700, fill: "#344157" }).replace("<text", '<text letter-spacing="0.96"') + icon(h ? "chevron-up" : "chevron-down", 359, y + 30, 14, "#7c899b");
const svField = (x, y, w, h = 42) => rect(x + 1, y + 1, w - 2, h - 2, { r: 4, fill: "#f6f9fc", stroke: "#dbdfe5", sw: 2 });
const svLabel = (x, y, s) => text(x, y, s, { size: 12, weight: 500, fill: "#5b6675" });
// Panel background + header row (published pages only) + accordions; DOMAIN / URL open.
function settingsPanel({ pub = true, now } = {}) {
  let s = accGrad + rect(0, 93, 399, 807, { fill: C.white });
  if (pub) s += rect(16, 112, 49, 20, { r: 4, fill: "#f3f5f7" }) + text(40.5, 126, "ver. 37", { size: 12, weight: 500, fill: "#5b6675", anchor: "middle" }) +
    text(73, 127, "Diterbitkan", { size: 14, weight: 500, fill: "#15c15d" }) + text(149, 127, "14/10/2026", { size: 14, fill: C.strong }) +
    rect(240, 105, 126, 34, { r: 4, fill: C.white, stroke: "#e8ebef", sw: 2 }) + text(303, 126, "Batalkan Penerbitan", { size: 12, weight: 500, fill: "#df0e03", anchor: "middle" });
  s += line(0, 153.5, 399, 153.5, { stroke: "#dbdfe5" }) + acc(170, 0, 351) + svLabel(34, 259, "Slug URL") + text(88, 259, "*", { size: 12, weight: 500, fill: "#f14756" }) + svField(34, 274, 330) +
    (now ? text(34, 334, "Saat ini:", { size: 12, weight: 500, fill: C.strong }) + text(82, 334, now, { size: 12, weight: 500, fill: C.primary }) : "") +
    svLabel(34, 368, "Set as Homepage to Domains") + svField(34, 383, 330, 43) + text(48, 409, "Select Domain", { size: 14, fill: "#8d97a3" }) +
    svLabel(34, 455, "Limit to Domains") + svField(34, 470, 330, 43) + text(48, 496, "Select Custom Domain", { size: 14, fill: "#8d97a3" });
  [1, 2, 3, 4].forEach((i, k) => (s += acc(537 + k * 76, i)));
  return s;
}
const SLUG = [34, 274, 330, 42];
const slugText = (v) => text(48, 300, v, { size: 14, fill: "#0f161e" });
const slugFocus = rect(35, 275, 328, 40, { r: 4, stroke: C.primary, sw: 2 });
const SLUG_LENS = { src: [17, 236, 364, 110] };
const DOMAIN_ACC = [0, 154, 399, 380]; // DOMAIN / URL section of the Settings tab
const settingsEd = (o) => scalevEditor(0, 0, { tab: "Settings" }) + settingsPanel(o);

// ---- editor Security tab -------------------------------------------------------------------------------------------
// Security tab panel (measured 14 Okt 2026, editor-security*.png): source selects with Scalev's auto-allowed domain chips.
// Coordinates are the panel at scroll 0 (Connect Sources on top); Image Sources is SECURITY.imageDy lower.
const AUTO_CONNECT = [["Scalev", 224, [[27, 243, 125, "https://api.scalev.com"], [158, 243, 67, "*.scalev.id"], [231, 243, 79, "*.scalev.com"]]],
  ["Google runtime", 279, [[27, 298, 137, "https://www.google.com"], [170, 298, 137, "https://www.gstatic.com"]]],
  ["Meta Pixel", 334, [[27, 353, 149, "https://www.facebook.com"]]],
  ["TikTok Pixel", 389, [[27, 408, 151, "https://analytics.tiktok.com"], [184, 408, 170, "https://analytics-ipv6.tiktokv.us"], [27, 438, 173, "https://analytics-ipv6.tiktokw.us"]]],
  ["Kwai Pixel", 474, [[27, 493, 158, "https://log-sdk.kwai-pro.com"], [191, 493, 155, "https://logsdk.kwai-pro.com"], [27, 523, 131, "https://api.mythad.com"], [164, 523, 134, "https://ads.mythad.com"],
    [27, 553, 137, "https://api.adaether.com"], [170, 553, 108, "https://s1.kwai.net"], [27, 583, 154, "https://s16-11187.ap4r.com"]]],
  ["Google Tag Manager, Analytics, and Ads", 619, [[27, 638, 195, "https://www.googletagmanager.com"], [27, 668, 185, "https://www.google-analytics.com"],
    [27, 698, 166, "https://*.google-analytics.com"], [27, 728, 164, "https://stats.g.doubleclick.net"], [27, 758, 190, "https://googleads.g.doubleclick.net"]]]];
const AUTO_IMAGE = [["Browser inline images", 226, [[27, 245, 41, "data:"], [74, 245, 40, "blob:"]]], ["Scalev", 281, [[27, 300, 67, "*.scalev.id"], [100, 300, 79, "*.scalev.com"]]],
  ["Country flags", 336, [[27, 355, 113, "https://flagcdn.com"]]], ["Meta Pixel", 391, [[27, 410, 149, "https://www.facebook.com"]]], ["TikTok Pixel", 446, [[27, 465, 151, "https://analytics.tiktok.com"]]],
  ["Kwai Pixel", 501, [[27, 520, 158, "https://log-sdk.kwai-pro.com"], [191, 520, 155, "https://logsdk.kwai-pro.com"], [27, 550, 108, "https://s1.kwai.net"], [141, 550, 154, "https://s16-11187.ap4r.com"]]],
  ["Google Tag Manager, Analytics, and Ads", 586, [[27, 605, 195, "https://www.googletagmanager.com"], [27, 635, 185, "https://www.google-analytics.com"],
    [27, 665, 166, "https://*.google-analytics.com"], [27, 695, 164, "https://stats.g.doubleclick.net"], [27, 725, 190, "https://googleads.g.doubleclick.net"]]]];
const IMG_DY = 699;
const secSelect = (y, value, ph) => box2(16, y, 351, 43, { fill: SVC.fieldBg }) + clipped(18, y + 2, 320, 39, tx(30, y + 13, value, 14, { fill: ph ? SVC.ph : SVC.dark })) + icon("chevron-down", 351, y + 22, 12, SVC.mute);
const secAuto = (y, h, groups, dy = 0) => rect(16.5, y + 0.5, 350, h - 1, { r: 4, fill: "#f5f5f5", stroke: SVC.off }) + tx(27, y + 12, "AUTOMATICALLY ALLOWED BY SCALEV", 10, { weight: 600, fill: SVC.sub, w: 184 }) +
  groups.map(([name, top, chips]) => tx(27, top + dy, name, 11, { weight: 600, fill: SVC.mute }) +
    chips.map(([x, cy, w, d]) => rect(x, cy + dy, w, 24, { r: 4, fill: C.white }) + tx(x + 8, cy + dy + 6, d, 11, { weight: 500, fill: SVC.grey, w: w - 16 })).join("")).join("");
const secContent = (o) => tx(16, 110, "Connect Sources", 12, { weight: 500, fill: SVC.sub }) + secSelect(136, `${o.connect ?? 1} selected`) + secAuto(187, 606, AUTO_CONNECT) +
  tx(16, 811, "Image Sources", 12, { weight: 500, fill: SVC.sub }) +
  secSelect(837, o.images ? `${o.images} selected` : "Add image domain, e.g. https://images.example.com", !o.images) + secAuto(888, 571, AUTO_IMAGE, IMG_DY) +
  tx(16, 778 + IMG_DY, "Media Sources", 12, { weight: 500, fill: SVC.sub }) + secSelect(804 + IMG_DY, "Add audio or video domain, e.g. https://media.example.com", true) +
  secAuto(855 + IMG_DY, 146, [["Browser inline media", 892, []]], IMG_DY);
// The Image Sources picker under its select (panel scrolled to Image Sources): search box, then the typed domain as an option.
const secPicker = (p) => shadow(16, 180, 351, p.value ? 105 : 54, 4, 2) + box2(16, 180, 351, p.value ? 105 : 54) + box2(26, 184, 331, 42, { stroke: SVC.blue }) +
  clipped(28, 186, 300, 38, tx(40, 197, p.value || "Add image domain, e.g. https://images.example.com", 14, { fill: p.value ? SVC.dark : SVC.ph })) + iconX("search", 340, 205, 16, SVC.sub) +
  (p.value ? tick(34, 249, p.ticked) + tx(64, 248, p.value, 14, { weight: 500, fill: "#676569" }) : "");
// Scalev editor Security tab panel body for an editor drawn at top y (x 0..399, y+92..y+900). o: { at: "connect" | "image"
// (scrolled to Image Sources), connect: n selected, images: n selected (0 = placeholder), picker: { value, ticked } (with at "image") }.
function securityPanel(y = 0, o = {}) {
  const body = rect(0, 92, 399, 808, { fill: C.white }) + clipped(0, 92, 399, 808, group({ transform: `translate(0 ${o.at === "image" ? -IMG_DY : 0})` }, secContent(o)) + (o.picker && o.at === "image" ? secPicker(o.picker) : ""));
  return y ? group({ transform: `translate(0 ${y})` }, body) : body;
}
// Exact boxes (editor at y 0, panel scrolled to Image Sources) for marks: the select, the picker's search box, the option's tick.
const SECURITY = { imageDy: IMG_DY, imageSelect: [16, 138, 351, 43], pickerInput: [26, 184, 331, 42], pickerTick: [34, 249, 16, 16], pickerOption: [26, 240, 331, 34] };

// ---- Settings dashboard (measured 14 Okt 2026, domain/profil*.png): sub-menu card, content card, Domain, Profil ------
const SUB_ITEMS = ["Bisnis", "Verifikasi", "Anggota", "Peran", "Gudang", "Payment Methods", "Bank Transfer", "Discount Code", "Courier", "Analitik", "Privasi pelanggan",
  "Domain", "Integrations", "Billing", "Add-ons", "Bahasa", "Suppressed IPs", "Apps", "Developers", "Profil"];
const subTop = (n) => 113 + SUB_ITEMS.indexOf(n) * 27.5;
const subAt = (n) => [345, subTop(n) + 8];
const subBox = (n) => [304, subTop(n) - 6, 150, 28];
const SUBMENU = [280, 83, 200, 735];
// tall: the content runs below the fold (Profil): card to the bottom, page scrollbar, no footer.
function settingsPage(active, tall) {
  let s = scalevApp(0, 0, { active: "Settings" }) + rect(256, 0, 1184, 900, { fill: SV.bg }) + tx(280, 26, "Settings", 26, { weight: 700, fill: SVC.ink }) + rect(280, 83, 200, tall ? 817 : 735, { fill: C.white });
  SUB_ITEMS.forEach((n) => {
    const on = n === active;
    if (on) s += rect(...subBox(n), { r: 4, fill: SVC.fieldBg });
    s += tx(314, subTop(n), n, 13, { weight: 500, fill: on ? SVC.text : SVC.off });
  });
  if (tall) return s + rect(480, 83, 921, 817, { fill: C.white }) + rect(1425, 0, 15, 900, { fill: "#f6f6f6" }) + rect(1428, 4, 8, 516, { r: 4, fill: "#c4c4c4" });
  return s + rect(480, 83, 936, 735, { fill: C.white }) + tx(280, 852, "© 2026 Scalev PT Interna Cipta Asia", 12, { fill: SVC.mute }) +
    [["Kebijakan Privasi", 1144], ["Syarat dan Ketentuan", 1246], ["Bantuan", 1372]].map(([t, x]) => tx(x, 852, t, 12, { fill: SVC.blue })).join("");
}
// Domain: heading with + Tambah Domain and quota, table Nama Domain / Store / Homepage / Status (rows 66 high).
const domRow = (y, name, o = {}) => rect(512, y, 872, 66, { r: 4, fill: SVC.fieldBg }) + tx(528, y + 25, name, 14, { weight: 500, fill: SVC.blue }) +
  (o.added ? "" : iconX("external-link", 700, y + 34, 18, SVC.sub)) + tx(906, y + 25, "Rina WO", 14, { fill: SVC.blue }) + (o.added ? bar(1047, y + 29, 60) : tx(1047, y + 25, "Rina WO", 14, { fill: SVC.blue })) +
  (o.added ? "" : rect(1303, y + 20, 34, 26, { r: 4, fill: "#e3f2f1" }) + tx(1307, y + 26, "Aktif", 12, { weight: 500, fill: "#15c15d" }));
const domainPage = () => settingsPage("Domain") + tx(512, 118, "Domain", 16, { weight: 700, fill: SVC.ink }) + tx(578, 120, "+ Tambah Domain", 14, { weight: 500, fill: SVC.blue, w: 115 }) +
  tx(701, 119, "0", 14, { weight: 600, fill: SVC.dark }) + tx(714, 119, "dari", 14, { fill: SVC.dark, w: 26 }) + tx(744, 119, "3", 14, { weight: 600, fill: SVC.dark }) +
  tx(757, 119, "jatah telah digunakan.", 14, { fill: SVC.dark, w: 139 }) +
  [["Nama Domain", 528, 77], ["Store", 906, 29], ["Homepage", 1047, 59], ["Status", 1301, 35]].map(([t, x, w]) => tx(x, 179, t, 12, { weight: 500, fill: SVC.mute, w })).join("") +
  domRow(211, "tokomu.myscalev.com");
const TAMBAH = [574, 116, 123, 25];
// Dialog Tambah Domain (measured): Save stays disabled until a domain is typed (enabled look inferred).
const DOM_IN = [506, 441, 428, 42], DOM_SAVE = [869, 499, 65, 44], DOM_DLG = [490, 342, 460, 217];
const domainDlg = shadow(490, 342, 460, 217, 4, 2) + rect(490, 342, 460, 217, { r: 4, fill: C.white }) + tx(506, 359, "Tambah Domain", 16, { weight: 700, fill: SVC.text }) +
  tx(506, 385, "Masukkan domain pribadi Kamu di bawah ini.", 12, { fill: SVC.sub, w: 248 }) + tx(506, 415, "Domain", 12, { weight: 500, fill: SVC.sub }) + tx(551, 415, "*", 12, { weight: 500, fill: SVC.red }) +
  box2(...DOM_IN, { fill: SVC.fieldBg }) + tx(520, 454, "Contoh: budi.contoh.com", 14, { fill: SVC.ph }) +
  box2(792, 499, 65, 44, { stroke: "#eaeaeb" }) + tx(803, 512, "Cancel", 14, { weight: 500, fill: SVC.text, w: 43 }) + rect(869, 499, 65, 44, { r: 4, fill: "#f0f1f3" }) + tx(886, 512, "Save", 14, { weight: 500, fill: SVC.grey, w: 30 });
const domTyped = rect(508, 443, 424, 38, { fill: SVC.fieldBg }) + tx(520, 454, "undangan.namabrand.com", 14, { fill: SVC.title });
const domSaveOn = rect(869, 499, 65, 44, { r: 4, fill: SVC.blue }) + tx(886, 512, "Save", 14, { weight: 500, fill: C.white, w: 30 });
// After Save (not observed: generic): the new domain row with Verifikasi in its Status cell, and its DNS records below.
const VERIFY = [1268, 298, 100, 36];
const DNS_CARD = [512, 365, 872, 212];
const dnsTable = domRow(283, "undangan.namabrand.com", { added: true }) + box2(...VERIFY, { stroke: SVC.blue }) + tx(1318, 307, "Verifikasi", 14, { weight: 500, fill: SVC.blue, anchor: "middle" }) +
  box2(...DNS_CARD, { stroke: SVC.line }) + rect(528, 381, 840, 36, { r: 4, fill: SVC.fieldBg }) +
  [["Type", 544], ["Name", 704], ["Target", 924]].map(([t, x]) => tx(x, 392, t, 12, { weight: 500, fill: SVC.mute })).join("") +
  [0, 1, 2].map((i) => {
    const y = 417 + i * 52;
    return line(528, y + 51.5, 1368, y + 51.5, { stroke: SVC.line }) + (i ? bar(544, y + 21, 40) + bar(704, y + 21, 110) : tx(544, y + 18, "A", 14, { weight: 600, fill: SVC.title, mono: true }) + tx(704, y + 18, "undangan", 14, { fill: SVC.title, mono: true })) +
      bar(924, y + 21, [150, 170, 160][i]) + iconX("copy", 1344, y + 26, 15, SVC.sub);
  }).join("");
const verified = icon("circle-check", 528 + tw("undangan.namabrand.com", 14, 500) + 26, 317, 18, "#15c15d");
// Profil (measured; example account data): fields, Telegram cards, Password, Log out, then Security with the MFA method row.
const profilPage = (o = {}) => settingsPage("Profil", true) + tx(512, 118, "Profil", 16, { weight: 700, fill: SVC.ink, w: 38 }) + tx(556, 122, "Edit", 12, { weight: 500, fill: SVC.blue, underline: true }) +
  [["Nama Lengkap", 512, 161], ["Alamat Email", 807, 161], ["Nomor Telepon", 512, 222], ["Akun Telegram", 512, 283], ["Password", 512, 446]].map(([t, x, y]) => tx(x, y, t, 12, { fill: SVC.sub })).join("") +
  tx(1126, 161, "Avatar", 12, { fill: SVC.mute }) + rect(1126, 183, 82, 82, { r: 4, fill: "#e8f6fb" }) + text(1167, 237, "R", { size: 36, fill: SVC.text, anchor: "middle" }) +
  tx(512, 185, "Rina", 14, { weight: 500, fill: SVC.text }) + tx(807, 185, "rina.wo@gmail.com", 14, { weight: 500, fill: SVC.text }) +
  icon("circle-check", 807 + tw("rina.wo@gmail.com", 14, 500) + 12, 193, 13, SVC.blue) + tx(512, 246, o.phone ?? "Belum Ditambahkan", 14, { weight: 500, fill: SVC.text }) +
  [[512, "Notifikasi Order", ["Khusus update pesanan dan status", "pembayaran."]], [808, "Diskusi LMS", ["Untuk komentar dan balasan baru di", "kelas LMS."]]].map(([x, t, d]) =>
    rect(x, 307, 286, 119, { r: 4, fill: SVC.fieldBg }) + tx(x + 12, 321, t, 14, { weight: 600, fill: SVC.text }) + tx(x + 235, 325, "Belum", 11, { weight: 500, fill: SVC.mute }) +
    tx(x + 12, 346, d[0], 12, { fill: SVC.sub }) + tx(x + 12, 364, d[1], 12, { fill: SVC.sub }) + tx(x + 12, 397, "Hubungkan akun Telegram", 12, { weight: 500, fill: SVC.blue, underline: true, w: 144 })).join("") +
  tx(569, 444, "Edit", 14, { weight: 500, fill: SVC.blue, underline: true }) + [0, 1, 2, 3, 4, 5].map((k) => circle(515 + k * 6, 475, 3, { fill: "#676569" })).join("") +
  shadow(512, 514, 156, 52, 4, 1) + box2(512, 514, 156, 52, { stroke: SVC.red }) + tx(528, 532, "Log out", 14, { weight: 500, fill: SVC.red, italic: true }) + tx(583, 532, "dari Scalev", 14, { weight: 500, fill: SVC.red }) +
  tx(512, 604, "Terakhir diubah 14 Okt 2026, 09.30", 12, { fill: SVC.sub }) + line(480, 645.5, 1401, 645.5, { stroke: SVC.line }) +
  tx(512, 681, "Security", 16, { weight: 700, fill: SVC.ink }) + rect(512, 724, 857, 78, { r: 4, fill: "rgba(41,152,117,.1)" }) + iconX("check", 540, 754, 18, "#299875", 2.5) +
  tx(568, 744, "Multi-Factor Authentication (MFA) is Always Active", 14, { weight: 600, fill: SVC.dark, w: 331 }) + tx(899, 744, "•", 14, { fill: SVC.dark }) +
  tx(908, 744, "By default, MFA method is using Email OTP, and you can switch to", 14, { fill: SVC.dark, w: 419 }) +
  tx(568, 765, "use Authenticator App for better security. MFA is used for:", 14, { fill: SVC.dark, w: 372 }) +
  tx(940, 765, "login, fund withdrawal, and change business owner.", 14, { weight: 700, fill: SVC.dark, w: 329 }) +
  tx(512, 853, "Multi-Factor Authentication Method", 12, { weight: 500, fill: SVC.mute, w: 193 }) + tx(512, 880, "Email OTP", 14, { weight: 500, fill: SVC.text }) +
  box2(1198, 851, 171, 44) + bar(1230, 869, 107, 8, "#dde2e8"); // the switch button's label was not observed
const PROFIL_EDIT = [553, 118, 27, 22], MFA_METHOD = [506, 849, 230, 50], SECURITY_BOX = [496, 665, 905, 235];
// Dialog Edit Account (measured): note, Avatar, Nama Lengkap, Alamat Email, Nomor Telepon with +62 picker; Save disabled until edited.
const EA = [481, 190, 478, 520], EA_PHONE = [767, 571, 158, 42], EA_SAVE = [863, 654, 80, 40];
const editAccount = shadow(481, 190, 478, 520, 4, 2) + rect(481, 190, 478, 520, { r: 4, fill: C.white }) + tx(497, 207, "Edit Account", 16, { weight: 700, fill: SVC.text }) +
  tx(497, 233, "Pastikan Anda mengisi data dengan benar.", 12, { fill: SVC.sub, w: 232 }) + iconX("x", 937, 216, 14, SVC.red, 2.5) +
  rect(497, 271, 446, 78, { r: 4, fill: "rgba(251,191,56,.1)" }) + circle(525, 301, 9, { stroke: "#f5a524", sw: 1.6 }) + line(525, 299.5, 525, 305.5, { stroke: "#f5a524", sw: 1.8, cap: "round" }) + circle(525, 296, 1.1, { fill: "#f5a524" }) +
  tx(553, 291, "Jika nomor telepon diubah, akun ini perlu melakukan", 14, { fill: SVC.dark, w: 333 }) + tx(553, 312, "verifikasi ulang melalui WhatsApp.", 14, { fill: SVC.dark, w: 217 }) +
  rect(497, 359, 446, 275, { r: 4, fill: SVC.fieldBg }) + tx(513, 377, "Avatar", 12, { fill: SVC.mute }) + rect(513, 403, 134, 134, { r: 4, fill: "#e8f6fb" }) + text(580, 484, "R", { size: 36, fill: SVC.text, anchor: "middle" }) +
  tx(669, 377, "Nama Lengkap", 12, { weight: 500, fill: SVC.sub, w: 86 }) + tx(755, 377, "*", 12, { weight: 500, fill: SVC.red }) + box2(669, 403, 258, 42) + tx(683, 416, "Rina", 14, { fill: SVC.title }) +
  tx(669, 460, "Alamat Email", 12, { weight: 500, fill: SVC.sub, w: 76 }) + tx(745, 460, "*", 12, { weight: 500, fill: SVC.red }) + tx(927, 460, "Terverifikasi", 12, { weight: 500, fill: "#299875", anchor: "end" }) +
  box2(669, 486, 258, 42) + tx(683, 499, "rina.wo@gmail.com", 14, { fill: SVC.title }) + tx(669, 543, "Nomor Telepon", 12, { weight: 500, fill: SVC.sub, w: 83 }) +
  box2(669, 569, 258, 46, { fill: SVC.fieldBg }) + rect(671, 571, 95, 42, { fill: C.white }) + rect(683, 583, 24, 9, { fill: "#e70011" }) + rect(683, 592, 24, 9, { fill: C.white, stroke: "#e5e5e5", sw: 0.5 }) +
  tx(711, 584, "+62", 14, { fill: SVC.dark }) + icon("chevron-down", 750, 592, 10, SVC.sub) + rect(767, 571, 158, 42, { r: 4, fill: C.white }) + tx(779, 584, "812345678", 14, { fill: SVC.ph }) +
  rect(767, 654, 80, 40, { r: 4, fill: "#f5f5f5" }) + tx(786, 666, "Cancel", 14, { weight: 500, fill: SVC.red, w: 43 }) + rect(863, 654, 80, 40, { r: 4, fill: SVC.fieldBg }) + tx(888, 666, "Save", 14, { weight: 500, fill: SVC.grey, w: 30 });
const eaPhone = rect(768, 572, 156, 40, { fill: C.white }) + tx(779, 584, "81234567890", 14, { fill: SVC.title });
const eaSaveOn = rect(863, 654, 80, 40, { r: 4, fill: SVC.blue }) + tx(888, 666, "Save", 14, { weight: 500, fill: C.white, w: 30 });

// ---- Stores (measured 14 Okt 2026, stores/store-payment*.png): with one store, Stores opens it directly --------------
// Header (title + breadcrumb), right column of settings cards, left column that scrolls: store name + Save, Products Offered,
// then Payment Methods (chips, PayLink card, + Add Payment Method) and Extra Charges. Products and chips use example data.
const PMY = 917, STORE_DY = PMY - 116; // Payment Methods block top in the unscrolled column; scroll that brings it under the header
const storeHead = rect(256, 0, 1184, 88, { fill: C.white }) + line(256, 88.5, 1440, 88.5, { stroke: SVC.line }) + tx(280, 20, "Rina WO", 18, { weight: 700, fill: SVC.title }) +
  tx(280, 54, "Stores", 12, { weight: 700, fill: SVC.blue, w: 35 }) + tx(319, 54, "/", 12, { weight: 500, fill: SVC.sub }) + tx(328, 54, "Rina WO", 12, { weight: 500, fill: SVC.sub });
const RIGHT = [["Storefront Settings", 136, 155, ["Kamu bisa mengatur tampilan Checkout Page dan", "Analytics Setting."], 253], ["LMS Settings", 279, 109, ["Atur banner di halaman LMS untuk menyapa", "member, membagikan info kelas terbaru, atau", "promo khusus member."], 464],
  ["Notification Settings", 490, 168, ["Configure WhatsApp and email notification", "settings to automatically notify customers."], 575], ["Unique Code", 601, 104, ["This feature will add unique code as a discount to", "orders with bank transfer payment method. This", "code can be used to identify the order when the", "customer makes a payment."], 718],
  ["Public Order Page", 744, 148, ["Settings related to order page which can be", "accessed by your customers publicly. Public order", "page is your main channel to inform your", "customers related to order information."], 861], ["Order Shield", 887, 101, [], 0]];
const storeRight = rect(1054, 112, 325, 788, { r: 4, fill: C.white }) + RIGHT.map(([t, y, w, d, end]) => tx(1078, y, t, 18, { weight: 700, fill: SVC.title, w }) + tx(1327, y + 4, "Open", 12, { weight: 500, fill: SVC.blue }) +
  d.map((l, k) => tx(1078, y + 30 + k * 16, l, 12, { fill: SVC.sub })).join("") + (end ? line(1054, end + 0.5, 1379, end + 0.5, { stroke: SVC.line, sw: 2 }) : "")).join("") +
  tx(1078, 211, "Tidak dapat diakses publik", 14, { weight: 500, fill: SVC.text, w: 170 }) + icon("lock", 1259, 219, 14, SVC.mute) + tx(1078, 370, "LMS Access Link", 12, { weight: 500, fill: SVC.sub }) +
  box2(1078, 396, 277, 44, { fill: SVC.fieldBg }) + tx(1092, 410, "https://tokomu.myscalev.com/m...", 14, { fill: SVC.ink, w: 201 }) + tx(1314, 411, "Copy", 12, { weight: 500, fill: SVC.blue }) +
  rect(1384, 92, 6, 180, { r: 3, fill: "#c4c4c4" });
const PRODUCTS = ["Undangan Digital Basic", "Undangan Digital Premium", "Undangan Digital Eksklusif", "Tambahan: Musik Pilihan", "Tambahan: Buku Tamu Digital"];
const chip = (x, y, label, w, color) => box2(x, y, w, 44, { stroke: SVC.line }) + rect(x + 10, y + 14, 24, 16, { r: 3, fill: color }) + tx(x + 42, y + 14, label, 14, { weight: 500, fill: SVC.title }) +
  iconX("x", x + w - 22, y + 22, 12, "#d42a2a", 3);
const storeLeft = (o = {}) => rect(280, 112, 750, 2000, { r: 4, fill: C.white }) + rect(304, 136, 702, 96, { r: 4, fill: SVC.fieldBg }) + rect(328, 160, 48, 48, { fill: C.white }) + icon("image", 352, 184, 16, SVC.mute) +
  box2(400, 163, 494, 42) + tx(414, 176, "Rina WO", 14, { fill: SVC.title }) + rect(902, 164, 80, 40, { r: 4, fill: SVC.fieldBg }) + tx(927, 176, "Save", 14, { weight: 500, fill: SVC.grey, w: 30 }) +
  rect(304, 256, 702, 637, { r: 4, fill: SVC.fieldBg }) + tx(328, 280, "Products Offered", 18, { weight: 700, fill: SVC.title, w: 140 }) + rect(328, 325, 654, 477, { r: 4, fill: C.white }) +
  tx(355, 352, "Product Name", 12, { weight: 500, fill: SVC.mute, w: 78 }) + tx(811, 343, "# of", 12, { weight: 500, fill: SVC.mute }) + tx(790, 361, "variants", 12, { weight: 500, fill: SVC.mute, w: 43 }) +
  tx(865, 352, "Visibility", 12, { weight: 500, fill: SVC.mute, w: 46 }) +
  PRODUCTS.map((p, i) => {
    const y = 393 + i * 67;
    return rect(355, y + 19, 24, 24, { r: 4, fill: "#e5e7eb" }) + tx(395, y + 12, p, 14, { fill: SVC.title }) + tx(395, y + 35, "Digital", 12, { fill: SVC.sub }) + tx(825, y + 22, "1", 14, { fill: SVC.title }) +
      rect(880, y + 23, 32, 16, { r: 8, fill: SVC.blue }) + circle(903, y + 31, 6, { fill: C.white }) + iconX("x", 949, y + 31, 12, "#d42a2a", 3);
  }).join("") +
  tx(621, 745, "Show More", 12, { weight: 500, fill: SVC.blue }) + tx(339, 774, "+ Add Products", 12, { weight: 500, fill: SVC.blue }) + rect(328, 826, 654, 43, { r: 4, fill: C.white }) + tx(339, 840, "+ Add Bundles", 12, { weight: 500, fill: SVC.blue }) +
  rect(304, PMY, 702, 305, { r: 4, fill: SVC.fieldBg }) + tx(328, PMY + 24, "Payment Methods", 18, { weight: 700, fill: SVC.title, w: 148 }) + tx(328, PMY + 71, "Selected Payment Methods:", 12, { weight: 500, fill: SVC.sub, w: 153 }) +
  chip(328, PMY + 103, "QRIS", 111, "#1f2937") + chip(447, PMY + 103, "BCA Virtual Account", 210, "#0b4ea2") + (o.allepay ? chip(665, PMY + 103, "ALL E-Payment", 177, "#2bb3a3") : "") +
  box2(328, PMY + 167, 654, 77, { stroke: SVC.line }) + rect(346, PMY + 188, 36, 36, { r: 4, fill: SVC.fieldBg }) + icon("link", 364, PMY + 206, 18, SVC.sub) +
  tx(394, PMY + 187, "Pengaturan PayLink", 14, { weight: 500, fill: SVC.title }) + circle(399, PMY + 217, 5, { fill: "#2b1a07" }) + tx(410, PMY + 210, "Bahasa Indonesia · Pemilih bahasa nonaktif", 12, { fill: SVC.sub, w: 233 }) +
  tx(909, PMY + 199, "Kelola", 12, { weight: 500, fill: SVC.blue }) + iconX("arrow-right", 957, PMY + 206, 14, SVC.blue, 2.5) + tx(328, PMY + 263, "+ Add Payment Method", 12, { weight: 500, fill: SVC.blue, w: 126 }) +
  rect(304, PMY + 329, 702, 600, { r: 4, fill: SVC.fieldBg }) + tx(328, PMY + 353, "Extra Charges", 18, { weight: 700, fill: SVC.title, w: 114 }) +
  tx(328, PMY + 380, "Kelola biaya tambahan yang ditagihkan kepada customer berdasarkan metode pembayaran tertentu.", 12, { fill: SVC.grey, w: 544 }) +
  rect(902, PMY + 354, 80, 40, { r: 4, fill: SVC.fieldBg }) + tx(927, PMY + 366, "Save", 14, { weight: 500, fill: SVC.grey, w: 30 }) + box2(328, PMY + 416, 654, 400, { stroke: SVC.line }) +
  rect(330, PMY + 418, 650, 102, { fill: SVC.fieldBg }) + [["Metode", 342, 46], ["Service Fee", 578, 16], ["Biaya Lainnya", 733, 30], ["Total", 930, 46]].map(([t, x, d]) => tx(x, PMY + 416 + d, t, 12, { weight: 700, fill: SVC.grey })).join("");
// The page with the column scrolled to Payment Methods (static, for the scenes that start there).
const storeScrolled = (o) => scalevApp(0, 0, { active: "Stores" }) + rect(256, 0, 1184, 900, { fill: SV.bg }) + clipped(256, 89, 790, 811, group({ transform: `translate(0 ${-STORE_DY})` }, storeLeft(o))) + storeRight + storeHead;
const ADD_PM = [326, 374, 130, 24], PM_BLOCK = [304, 116, 702, 305];
// Dialog Add Payment Method (measured): accordion rows, ALL E-Payment open shows one inner row with a checkbox; Cancel / Save.
const PAY_ROWS = [["QRIS", "#1f2937"], ["E-Wallet", "#3b82f6"], ["ALL E-Payment", "#2bb3a3"], ["Virtual Account", "#0b4ea2"], ["Cash on Delivery (COD)", "#6b8e23"], ["No Payment", "#f5a524"], ["Bank Transfer", "#1e3a8a"]];
function payDialog(open, n) {
  const y0 = open ? 134 : 176, h = open ? 632 : 548;
  let s = shadow(497, y0, 431, h, 4, 2) + rect(497, y0, 431, h, { r: 4, fill: C.white }) + tx(521, y0 + 27, "Add Payment Method", 16, { weight: 700, fill: SVC.text, w: 157 }) +
    tx(904, y0 + 29, `${n} selected`, 12, { fill: SVC.sub, anchor: "end" });
  let y = y0 + 64;
  PAY_ROWS.forEach(([t, c], i) => {
    const big = open && i === 2, rh = big ? 136 : 52;
    s += box2(521, y, 368, rh) + rect(523, y + 2, 364, 48, { fill: SVC.fieldBg }) + rect(535, y + 16, 24, 16, { r: 3, fill: c }) + tx(567, y + 18, t, 14, { weight: 500, fill: SVC.title }) +
      icon(big ? "chevron-up" : "chevron-down", 868, y + 26, 14, SVC.mute);
    if (big) s += rect(539, y + 66, 332, 52, { r: 4, fill: SVC.fieldBg }) + rect(555, y + 84, 24, 16, { r: 3, fill: c }) + tx(587, y + 84, "ALL E-Payment", 14, { weight: 500, fill: SVC.dark }) + tick(839, y + 84, false);
    y += rh + 6;
  });
  return s + box2(723, y0 + h - 68, 80, 44, { stroke: SVC.line }) + tx(742, y0 + h - 54, "Cancel", 14, { weight: 500, fill: SVC.dark, w: 43 }) +
    rect(824, y0 + h - 66, 80, 40, { r: 4, fill: SVC.blue }) + tx(849, y0 + h - 54, "Save", 14, { weight: 500, fill: C.white, w: 30 });
}
const PAY_DLG = [497, 176, 431, 548], PAY_DLG_OPEN = [497, 134, 431, 632], ALLPAY_ROW = [521, 356, 368, 52], ALLPAY_TICK = [839, 398, 16, 16], PAY_SAVE = [824, 700, 80, 40];
const payTicked = tick(839, 398, true) + rect(820, 155, 90, 20, { fill: C.white }) + tx(904, 163, "3 selected", 12, { fill: SVC.sub, anchor: "end" });

export {
  SV, bar, svBox, svBtn, check, SVC, tx, box2, tick, head, card, genericBody, LP_ROWS, lpPage, lpRow, lpScreen, CREATE, btnCreate,
  lu, ACC_ICON, ACC, accGrad, acc, svField, svLabel, settingsPanel, settingsEd, SLUG, slugText, slugFocus, SLUG_LENS, DOMAIN_ACC,
  secContent, secPicker, securityPanel, SECURITY,
  settingsPage, subAt, subBox, SUBMENU, domainPage, TAMBAH, DOM_IN, DOM_SAVE, DOM_DLG, domainDlg, domTyped, domSaveOn, VERIFY, dnsTable, verified,
  profilPage, PROFIL_EDIT, MFA_METHOD, SECURITY_BOX, EA, EA_PHONE, EA_SAVE, editAccount, eaPhone, eaSaveOn,
  STORE_DY, storeHead, storeRight, storeLeft, storeScrolled, ADD_PM, PM_BLOCK, payDialog, PAY_DLG, PAY_DLG_OPEN, ALLPAY_ROW, ALLPAY_TICK, PAY_SAVE, payTicked
};
