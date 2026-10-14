// Bantuan: dialog Bantuan (ui/bantuan.mjs), Izin domain (CSP) dan tab Security Scalev, pola memperbaiki dari pesan akses
// (App.jsx AccessGate), mencari pesan di panduan (docs.page), masa aktif (RenewNote, gate expired, pin.html, halaman
// tamu), dan kirim laporan lewat WhatsApp. Setiap adegan satu layar 1440x900 (lib v4).
// Editor: /tmp/ref/editor-bantuan.png + editor-metrics.json, gaya dari ui/styles.js. docs.page: diukur di Chromium
// 1440x900 (14 Okt 2026; konten = viewport + 85 px bilah Chrome). Tab Security Scalev: diukur 14 Okt (ui/scalev.mjs).
// WhatsApp Web: tata letak umum, belum diukur.
import { C, rect, text, line, circle, para, group, clipped, shadow, icon, iconX, tw, wrap, mid, grow, esc, PHONE } from "../lib.mjs";
import { nkBtn, nkBtnBox, nkH3, chrome, favScalev, scalevEditor, svSimpan, nkRail, nkHead, nkLogo, ED, dim, phoneDesk } from "../ui/kit.mjs";
import { CHECKS, helpBody, dlgSheet, dlgHead, dlgView } from "../ui/bantuan.mjs";
import { securityPanel, SECURITY } from "../ui/scalev.mjs";
import { ACCOUNT, kList } from "../ui/editor-panels.mjs";
import { MAROON, SERIF, CREAM, PHOTO_DEFS, pvMempelai, secTitle, dock } from "../ui/invitation.mjs";

const tr = (dx, dy, ...kids) => group({ transform: `translate(${dx} ${dy})` }, ...kids);
const white = (x, y, w, h) => rect(x, y, w, h, { fill: C.white });

// The editor as these scenes open it: the invitation's Mempelai section in the preview, rail on Konten, the Konten panel
// (every group filled, all closed). Konten's list can sit lower (dy) under a note at the panel top.
const PREVIEW = PHOTO_DEFS + pvMempelai({ city: "Jakarta", ig: "@rani.ayu" });
const kontenBody = (dy = 0) => kList({ left: 0, dy: -dy }).svg;
const panelKonten = () => nkRail(0, 0, "Konten") + rect(72, 92, 327, 808, { fill: C.white }) + nkHead(0, 0, "Konten", { account: ACCOUNT }) + kontenBody();
const editorKonten = (o = {}) => scalevEditor(0, 0, { rail: "Konten", ...o }) + PREVIEW + panelKonten();
// Editor element boxes (marks): Scalev tabs, rail Bantuan, the close × of a panel-wide dialog.
const TAB = { Security: [101, 54, 69, 38], NikahKit: [224, 54, 88, 38] };
const HELP = [6, 800, 60, 44];
const XBOX = [357, 111, 22, 22];
const TABROW = [0, 44, 399, 48];

// The Scalev bars above the dialog's column (they hide a body that scrolls up past the dialog header).
const edBars = clipped(0, 0, 399, 92, scalevEditor(0, 0, { rail: "Konten" }));
const dlgCover = edBars + dlgHead;
// Box of a dialog item at scroll dy, and a lens source around it (the dialog's full width).
const at = (b, dy = 0) => [b[0], b[1] - dy, b[2], b[3]];
const helpLens = (b, dy = 0, pad = 14) => [0, b[1] - dy - pad, 399, b[3] + 2 * pad];

// ---- bantuan-salin-laporan / bantuan-buka-wa: one report state --------------------------------------------------------
const SL_BAD = { "Penyimpanan ucapan dan RSVP": "simpan halaman di Scalev dulu" };
const SL_CSP = [{ o: "https://www.youtube.com", d: "script_src", st: "exists", why: "Musik atau video YouTube" },
  { o: "https://www.youtube.com", d: "frame_src", st: "exists", why: "Musik atau video YouTube" }];
const sl = helpBody({ bad: SL_BAD, csp: SL_CSP });
const BAD_ROW = "Penyimpanan ucapan dan RSVP";
// Scroll increments (scroll dy is relative): the bad row to y 560, then Salin laporan to y 520.
const SL1 = sl.pos.rows[BAD_ROW][1] - 560;
const SL2 = sl.pos.salin[1] - 520 - SL1;
const SLT = SL1 + SL2;
const BTNS = [16, sl.pos.salin[1], 351, 124];

// ---- bantuan-izin-domain / -security / -simpan ------------------------------------------------------------------------
const ORIGIN = "https://foto.contoh.com";
const IZ_BAD = { "Izin domain di tab Security": `${ORIGIN} (img_src)` };
const IZ_CSP = [{ o: "https://www.youtube.com", d: "script_src", st: "added", why: "Musik atau video YouTube" },
  { o: "https://www.youtube.com", d: "frame_src", st: "exists", why: "Musik atau video YouTube" },
  { o: ORIGIN, d: "img_src", st: "failed", why: "Foto dari luar Media Scalev" }];
const iz = helpBody({ bad: IZ_BAD, csp: IZ_CSP, cspMsg: true });
const IZ1 = iz.end - 900; // fully scrolled: Izin domain (CSP) section in view
// After Periksa ulang: store.recheckCsp() re-reads the Security tab, so cspList turns "exists" and cspWarn empties,
// which also turns the check row "Izin domain di tab Security" to OK (help.jsx checks; store.js recheckCsp).
const izF = helpBody({ csp: IZ_CSP.map((r) => ({ ...r, st: r.st === "failed" ? "exists" : r.st })), cspMsg: true });
const IZF = izF.end - 900;
const izCopied = white(16, iz.pos.cspMsg[1] - IZ1, 351, 18) + text(16, iz.pos.cspMsg[1] - IZ1 + 12, "Tersalin. Tempel di tab Security.", { size: 12, fill: C.faint });
const izDialog = (copied) => dlgSheet + dlgHead + dlgView(iz, IZ1) + (copied ? izCopied : "");
const CSP_AREA = [0, iz.pos.csp[0][1] - IZ1 - 8, 399, iz.pos.cspMsg[1] + 24 - iz.pos.csp[0][1]];
// Scalev Security tab: the measured panel (ui/scalev.mjs; Connect Sources on top; at: "image" scrolls to Image Sources,
// picker = the Add image domain box with the pasted domain as an option). Image Sources starts empty in this example.
const editorSecurity = (o = {}) => scalevEditor(0, 0, { tab: "Security" }) + PREVIEW + securityPanel(0, o);

// ---- bantuan-cek-gejala: AccessGate ----------------------------------------------------------------------------------
function gate(lines, o = {}) {
  let s = rect(0, 92, 398, 808, { fill: C.white }) + text(16, 128, "NikahKit", { size: 16, weight: 700, fill: C.strong }) +
    (o.chip ? chip(262, 108, ACCOUNT) : "") + iconX("x", 368, 122, 18, C.text) + line(0, 153.5, 398, 153.5, { stroke: C.line });
  const h = 20 + lines.length * 18, fg = o.warn ? C.warnStrong : C.strong;
  s += rect(16, 169, 351, h, { r: 4, fill: o.warn ? C.warnSoft : C.primarySoft }) + lines.map((l, i) => text(28, 192 + i * 18, l, { size: 12, fill: fg })).join("");
  return s + (o.buttons ?? "");
}
const chip = (x, y, label, warn) => rect(x + 0.5, y + 0.5, 79, 27, { r: 14, fill: warn ? C.warnSoft : C.white, stroke: warn ? "#fde7c7" : C.field }) +
  icon("circle-user-round", x + 16, y + 14, 14, warn ? C.warn : C.action) + text(x + 27, y + 18, label, { size: 12, weight: 500, fill: warn ? C.warnStrong : C.strong });
const RECHECK = nkBtnBox(16, 237, "Periksa lagi", { size: 14 });
const recheckBtn = nkBtn(16, 237, "Periksa lagi", { variant: "quiet", w: RECHECK[2], size: 14 });
const GATE_SERVER = gate([[{ t: "Server NikahKit tidak terjangkau.", w: 700 }, " Periksa"], ["internet, lalu tekan Periksa lagi."]], { warn: true, buttons: recheckBtn });
const GATE_MSG = [16, 169, 351, 56];
const RAIL_TABS = [0, 104, 72, 336];

// ---- bantuan-masa-aktif ------------------------------------------------------------------------------------------------
const renewNote = (lines, err) => {
  const h = Math.max(56, 20 + lines.length * 18), fg = err ? C.danger : C.warnStrong;
  return { h, box: [88, 169, 279, h], svg: rect(88, 169, 279, h, { r: 4, fill: err ? C.dangerSoft : C.warnSoft }) + para(100, 169 + h / 2 - (lines.length - 1) * 9 + 4, lines, { size: 12, fill: fg, lh: 18 }) +
    nkBtn(265, 169 + h / 2 - 18, "Perpanjang", { variant: "quiet", w: 90 }) };
};
const RN_WARN = renewNote(["Langganan berakhir 5 hari", "lagi."]);
const RN_ERR = renewNote(["Langganan berakhir. 6 hari", "lagi ucapan, RSVP, dan", "Dashboard berhenti."], true);
const CHIP = [262, 108, 80, 28];
const panelWith = (rn) => rect(72, 154, 327, 746, { fill: C.white }) + kontenBody(rn.h + 12) + rn.svg +
  rect(262, 108, 81, 29, { fill: C.white }) + chip(262, 108, ACCOUNT, true);
// Guide timeline (not part of the UI), in the grey preview area left of the invitation.
const TL = { x: 435, y: 136, w: 256 };
const TL_ROWS = [["Aktif", "Semua fitur jalan", C.ok], ["7 hari terakhir", "Panel mengingatkan", C.changed], ["Tenggang 7 hari", "Fitur masih jalan", C.warn], ["Habis", "RSVP dan ucapan berhenti", C.danger]];
const tlY = (i) => TL.y + 56 + i * 68;
const timeline = shadow(TL.x, TL.y, TL.w, 330, 10, 2) + rect(TL.x, TL.y, TL.w, 330, { r: 10, fill: C.white }) +
  text(TL.x + 20, TL.y + 32, "Masa aktif paket", { size: 15, weight: 700, fill: C.ink }) + line(TL.x + 30, tlY(0) + 10, TL.x + 30, tlY(3) + 10, { stroke: "#d9dee5", sw: 2 }) +
  TL_ROWS.map(([l, sub, c], i) => circle(TL.x + 30, tlY(i) + 10, 8, { fill: c }) + text(TL.x + 50, tlY(i) + 14, l, { size: 14, weight: 600, fill: C.ink }) +
    text(TL.x + 50, tlY(i) + 33, sub, { size: 12, fill: C.faint })).join("");
const tlBox = (i) => [TL.x + 14, tlY(i) - 6, TL.w - 28, 48];
const GATE_EXP_BTN = nkBtnBox(16, 237, "Pilih paket", { size: 14 });
// The gate's message and buttons (169..273); ends at 278, above the Konten text the gate covers (a focus edge through
// text under it would let a sliver of that text through the anti-aliased edge).
const GATE_AREA = [0, 154, 399, 124];
const pilihBtn = nkBtn(16, 237, "Pilih paket", { w: GATE_EXP_BTN[2], size: 14 });
const GATE_EXPIRED = gate([[{ t: "Langganan NikahKit sudah habis.", w: 700 }, " Undangan tayang"], ["tetap tampil."]], {
  warn: true, chip: true, buttons: pilihBtn + nkBtn(24 + GATE_EXP_BTN[2], 237, "Periksa lagi", { variant: "quiet", size: 14 })
});
// NikahKit account window (ext/pin.html, editor-akun.png): header, email + Keluar, Paket card, Bisnis Scalev card.
const AW = { x: 500, y: 261, w: 440 };
const AW_LIC = wrap("Langganan habis. Undangan tetap tampil, tetapi RSVP dan ucapan berhenti. Pilih paket.", 370, 14);
const AW_PH = 16 + 16 + 8 + AW_LIC.length * 20 + 8 + 36 + 16, AW_BY = AW.y + 92 + AW_PH + 12, AW_H = AW_BY - AW.y + 122 + 16;
function accountWindow() {
  const { x, y, w } = AW;
  return shadow(x, y, w, AW_H, 8, 3) + rect(x, y, w, AW_H, { r: 8, fill: C.white }) +
    rect(x + 16, y + 16, 32, 32, { r: 7, fill: "#4a9de8" }) + circle(x + 27, y + 32, 6.5, { stroke: C.white, sw: 2.6 }) + circle(x + 37, y + 32, 6.5, { stroke: C.white, sw: 2.6 }) +
    text(x + 58, y + 38, "NikahKit", { size: 16, weight: 700, fill: C.strong }) + iconX("x", x + w - 30, y + 30, 18, C.text) +
    text(x + 16, y + 76, "rina.wo@gmail.com", { size: 12, weight: 700, fill: C.faint }) + text(x + w - 16, y + 76, "Keluar", { size: 12, weight: 500, fill: C.strong, anchor: "end", underline: true }) +
    rect(x + 16.5, y + 92.5, w - 33, AW_PH, { r: 4, fill: C.white, stroke: C.line }) + nkH3(x + 33, y + 92 + 28, "Paket") +
    para(x + 33, y + 92 + 54, AW_LIC, { size: 14, fill: C.warnStrong, lh: 20 }) + nkBtn(x + 33, y + 92 + 40 + AW_LIC.length * 20 + 8, "Pilih paket", { size: 14 }) +
    rect(x + 16.5, AW_BY + 0.5, w - 33, 121, { r: 4, fill: C.white, stroke: C.line }) + nkH3(x + 33, AW_BY + 28, "Bisnis Scalev") +
    text(x + 33, AW_BY + 54, "Rina WO", { size: 14, fill: C.text }) + nkBtn(x + 33, AW_BY + 70, "Hubungkan ulang", { variant: "quiet", size: 14 });
}

// ---- bantuan-masa-aktif-tamu: published invitation, section Ucapan (runtime labels from the template build) ----------
// The invitation's section title and Menu bawah (ui/invitation.mjs, drawn for the editor preview) moved onto the phone;
// the dock sits 60 px lower on the taller phone screen. The Ucapan form is scene-local.
const PX = PHONE.x, PY = PHONE.y, PCX = PX + 195, FX = PX + 32, FW = 326;
const onPhone = (svg, dy = 0) => tr(PX - ED.screen.x, PY - ED.screen.y + dy, svg);
function guestPhone(closed) {
  let s = rect(PX, PY, 390, 844, { fill: CREAM }) + onPhone(secTitle("Ucapan"));
  const nav = onPhone(dock("Ucapan"), 60);
  if (closed) return s + rect(FX, PY + 150, FW, 96, { r: 12, fill: C.white, stroke: "#ead8cf" }) + text(PCX, PY + 205, "Ucapan & RSVP sudah ditutup.", { size: 16, fill: "#333", anchor: "middle", font: SERIF }) + nav;
  const lab = (yy, l) => text(FX, yy, l, { size: 14, fill: "#333", font: SERIF });
  const fld = (yy, h = 40) => rect(FX + 0.5, yy + 0.5, FW - 1, h, { r: 8, fill: C.white, stroke: "#d8c6bd" });
  s += lab(PY + 170, "Nama") + fld(PY + 180) + lab(PY + 250, "Konfirmasi kehadiran") +
    ["Hadir", "Masih ragu", "Tidak hadir"].map((l, i) => rect(FX + 0.5 + i * 110, PY + 260.5, 104, 38, { r: 19, fill: i ? C.white : MAROON, stroke: MAROON }) +
      text(FX + 52 + i * 110, PY + 285, l, { size: 13, fill: i ? MAROON : C.white, anchor: "middle", font: SERIF })).join("") +
    lab(PY + 330, "Jumlah yang hadir") + fld(PY + 340) + text(FX + 14, PY + 366, "1 orang", { size: 14, fill: "#333", font: SERIF }) + icon("chevron-down", FX + FW - 18, PY + 360, 16, "#333") +
    lab(PY + 410, "Ucapan & doa") + fld(PY + 420, 96) + rect(FX, PY + 532, FW, 44, { r: 22, fill: MAROON }) + text(PCX, PY + 559, "Kirim", { size: 15, fill: C.white, anchor: "middle", font: SERIF });
  return s + nav;
}
const FORM = [FX - 4, PY + 150, FW + 8, 432];
const CLOSED = [FX, PY + 150, FW, 96];

// ---- docs.page (panduan) in a 1440x900 Chrome window, measured at 1440 wide --------------------------------------------
// Viewport y + 85 = world y. Header 65 (border once scrolled), sidebar 16..248, content column 320..1089, "On this page"
// 1169..1409. Every line is pinned to its width (textLength): measured where given (len), else Roboto's average advance
// (0.48 / 0.51 / 0.55 em by weight), so the text and its skeleton bar keep the real line length in any viewer font.
const T = 85;
const DOC = { ink: "#171717", body: "#2e2e2e", sub: "#737373", line: "#e5e5e5", muted: "#f5f5f5", head: "#fafafa", accent: "#b8460d" };
const dw = (s, o = {}) => Math.round(s.length * (o.size ?? 16) * ((o.weight ?? 400) >= 600 ? 0.55 : (o.weight ?? 400) >= 500 ? 0.51 : 0.48));
const dt = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.size ?? 16}" fill="${o.fill ?? DOC.body}"${o.weight ? ` font-weight="${o.weight}"` : ""}${o.anchor ? ` text-anchor="${o.anchor}"` : ""}` +
  ` textLength="${o.len ?? Math.min(dw(s, o), o.max ?? Infinity)}" lengthAdjust="spacingAndGlyphs" xml:space="preserve">${esc(s)}</text>`;
// A line of runs (strings or { t, w, u, uc, len }), each pinned, laid out left to right; u = underlined (links).
const drun = (x, y, parts, o = {}) => parts.map((p) => {
  const q = typeof p === "string" ? { t: p } : p, oo = { ...o, weight: q.w ?? o.weight }, w = q.len ?? dw(q.t, oo);
  const s = dt(x, y, q.t, { ...oo, len: w }) + (q.u ? line(x, y + 3.5, x + w, y + 3.5, { stroke: q.uc ?? DOC.sub }) : "");
  x += w; return s;
}).join("");
const dpara = (x, y, lines, o = {}) => lines.map((l, i) => (Array.isArray(l) ? drun(x, y + i * (o.lh ?? 28), l, o) : dt(x, y + i * (o.lh ?? 28), l, o))).join("");
const docsTab = (title, path) => chrome(0, 0, 1440, 900, { tabs: [{ title, active: true, fav: (cx, cy) => nkLogo(cx, cy, 14) }], url: `docs.page/hasyaapp/nikahkit-panduan/${path}` });
const moon = (cx, cy) => `<path d="M${cx + 6} ${cy + 3} A7 7 0 1 1 ${cx - 2} ${cy - 7} A5.5 5.5 0 0 0 ${cx + 6} ${cy + 3} Z" fill="${DOC.ink}"/>`;
const docsHeader = (scrolled) => white(0, T, 1440, 65) + (scrolled ? line(0, T + 64.5, 1440, T + 64.5, { stroke: DOC.line }) : "") +
  nkLogo(32, T + 28, 20) + dt(56, T + 33, "Panduan NikahKit", { size: 16, weight: 500, fill: DOC.ink, len: 131 }) +
  rect(1075.5, T + 12.5, 126, 31, { r: 8, fill: C.white, stroke: DOC.line }) + iconX("search", 1094, T + 28, 15, DOC.ink) + dt(1110, T + 33, "Search", { size: 14, weight: 500, fill: DOC.ink, len: 46 }) +
  rect(1164, T + 20, 27, 17, { r: 4, fill: DOC.muted }) + text(1177.5, T + 32, "⌘K", { size: 11, weight: 500, fill: DOC.sub, anchor: "middle" }) +
  rect(1211, T + 12, 95, 32, { r: 8, fill: DOC.accent }) + dt(1258.5, T + 33, "WhatsApp", { size: 14, weight: 500, fill: C.white, anchor: "middle", len: 67 }) +
  circle(1330, T + 28, 9, { fill: DOC.ink }) + text(1352, T + 32, "0", { size: 12, weight: 500, fill: DOC.sub, anchor: "middle" }) + moon(1386, T + 28);
const SIDEBAR = [["rocket", "Mulai", 120, [["Selamat datang", 141], ["Alur kerja dari nol sampai jualan", 181], ["Istilah penting", 221]], 273],
  ["users", "Gabung dan pasang", 305, [["Pilih paket membership", 326], ["Pasang ekstensi NikahKit", 366], ["Masuk dan bayar membership", 406], ["Hubungkan bisnis Scalev", 446], ["Update ekstensi", 486]], 538],
  ["home", "Siapkan Scalev", 570, [["Akun dan paket Scalev", 591], ["Buat halaman undangan", 631], ["Simpan dan terbitkan", 671], ["Thumbnail WhatsApp dan|sosmed", 711], ["Alamat dan domain sendiri", 771]]]];
const docsSidebar = (active) => SIDEBAR.map(([ic, h, hy, items, sep]) => iconX(ic, 32, T + hy, 14, DOC.ink) + dt(50, T + hy + 4, h, { size: 12, weight: 500, fill: DOC.ink }) +
  items.map(([l, y]) => { const on = l === active; return (on ? rect(16, T + y, 232, 36, { r: 8, fill: DOC.muted }) : "") + dpara(24, T + y + 23, l.split("|"), { size: 14, weight: on ? 500 : undefined, fill: on ? DOC.ink : y > 760 ? "#a3a3a3" : DOC.sub, lh: 20 }); }).join("") +
  (sep ? line(16, T + sep + 0.5, 248, T + sep + 0.5, { stroke: DOC.line }) : "")).join("");
// "On this page": items [label, sub?] (sub items indented), the active one in the accent colour; truncated at 211 px.
const docsToc = (items, active) => icon("list", 1178, T + 115, 15, DOC.ink) + dt(1195, T + 120, "On this page", { size: 16, fill: DOC.ink, len: 82 }) +
  line(1173.5, T + 141, 1173.5, T + 141 + items.length * 29 - 8, { stroke: DOC.line }) +
  items.map(([l, sub], i) => (i === active ? line(1173.5, T + 141 + i * 29, 1173.5, T + 162 + i * 29, { stroke: DOC.ink }) : "") +
    dt(sub ? 1210 : 1198, T + 156 + i * 29, l, { size: 14, fill: i === active ? DOC.accent : DOC.sub, max: sub ? 199 : 211 })).join("");
const copyPage = white(937, T + 109, 152, 32) + rect(937.5, T + 109.5, 151, 31, { r: 8, fill: C.white, stroke: DOC.line }) + icon("copy", 955, T + 125, 14, DOC.ink) +
  dt(972, T + 130, "Copy page", { size: 14, weight: 500, fill: DOC.ink, len: 71 }) + line(1054.5, T + 110, 1054.5, T + 140, { stroke: DOC.line }) + icon("chevron-down", 1071, T + 125, 14, DOC.ink);
const infoBox = (y, h, lines) => rect(320.5, y + 0.5, 768, h - 1, { r: 12, fill: "#f1f9fd", stroke: "#bde3f4" }) + circle(345, y + 23, 7, { fill: DOC.ink }) +
  text(345, y + 27, "i", { size: 10, weight: 700, fill: C.white, anchor: "middle" }) + dt(361, y + 28, "Information", { size: 14, weight: 500, fill: DOC.ink, len: 76 }) + lines;
const bullets = (rows) => rows.map(([y, t, len, cont]) => (cont ? "" : circle(372, T + y - 5, 2.2, { fill: DOC.sub })) + dt(389, T + y, t, { size: 14, fill: DOC.sub, len })).join("");
// Inline code chip at an exact measured box; textLength pins the text to it in any viewer font.
const codeChip = (x, y, w, s) => rect(x, y, w, 23, { r: 6, fill: DOC.muted }) +
  `<text x="${x + 6}" y="${y + 16.5}" font-size="14.4" fill="${DOC.ink}" font-family="'Roboto Mono',ui-monospace,Menlo,monospace" textLength="${w - 12}" lengthAdjust="spacingAndGlyphs">${esc(s)}</text>`;
const MAIN = [256, T + 65, 900, 900 - T - 65]; // the scrolling column between sidebar and "On this page"

// Kamus pesan galat (bantuan/pesan-galat.mdx) at scroll 0.
const GALAT_TOC = [["Langkah"], ["Panel NikahKit: akses"], ["Panel NikahKit: catatan di atas ..."], ["Editor: template dan undangan..."], ["Editor: Bagikan, PIN, dan salin"],
  ["Editor: isian Konten, foto, dan ..."], ["Editor: Profil merek dan Market..."], ["Editor: Pesanan masuk"], ["Bantuan dan update"], ["Jendela akun NikahKit"], ["Buku Tamu (menu Scalev)"],
  ["Halaman tamu (undangan)"], ["Dashboard pasangan"], ["Halaman check-in"], ["Form pesanan klien"], ["Kode dalam kurung"], ["Tanda berhasil"], ["Kalau ada masalah"], ["Lanjut"]];
const H1 = [320, T + 105, 291, 40];
const galatTop = dt(320, T + 135, "Kamus pesan galat", { size: 36, fill: DOC.ink, len: 291 }) + copyPage +
  dt(320, T + 173, "Semua pesan yang bisa muncul di NikahKit, Buku Tamu, Dashboard pasangan, halaman tamu,", { size: 18, fill: DOC.sub, len: 747 }) +
  dt(320, T + 201, "halaman check-in, dan form pesanan klien, lengkap dengan artinya dan yang harus dilakukan.", { size: 18, fill: DOC.sub, len: 746 }) +
  dt(320, T + 260, "Lihat pesan aneh di layar? Cari kalimatnya di halaman ini. Setiap tabel berisi pesan persis seperti di layar,", { len: 753 }) +
  dt(320, T + 288, "artinya, dan langkah yang harus kamu lakukan.", { len: 336 }) +
  infoBox(T + 313, 235, dt(361, T + 367, "Yang kamu perlukan", { size: 14, weight: 600, fill: DOC.ink, len: 136 }) +
    bullets([[411, "Kalimat pesan yang kamu lihat. Cukup beberapa kata awalnya.", 400], [447, "Tahu di layar mana pesan itu muncul: panel NikahKit di editor Scalev, jendela akun NikahKit, Buku Tamu,", 666],
      [475, "Dashboard pasangan, halaman tamu, atau halaman check-in.", 392, true], [511, "Untuk gejala tanpa pesan, pakai Masalah umum.", 312]])) +
  dt(320, T + 625, "Langkah", { size: 30, fill: DOC.ink, len: 112 }) +
  // The page's own animation (an image) below the heading.
  rect(320, T + 650, 769, 180, { r: 12, fill: "#f3f1ee" });
const galatScreen = docsTab("Kamus pesan galat", "bantuan/pesan-galat") + galatTop + docsHeader(false) + docsSidebar() + docsToc(GALAT_TOC, 0);
// "Langkah" (Steps) at scroll 1226. Step tops (viewport): titles 120/249/349/478/578, text 164/293/393/522/622.
const STEP_T = [120, 249, 349, 478, 578].map((y) => T + y), STEP_P = [164, 293, 393, 522, 622].map((y) => T + y);
const MATCH1 = [451, T + 396, 124, 23];
const galatSteps = (() => {
  let s = white(...MAIN) + dt(704.5, T + 95, "Mencari arti pesan dengan Ctrl+F", { size: 14, fill: DOC.sub, anchor: "middle", len: 215 });
  [["Catat pesannya", 139], ["Tekan Ctrl+F di halaman ini", 240], ["Ketik beberapa kata awal pesan", 282], ["Baca kolom Artinya", 171], ["Kerjakan kolom Yang harus dilakukan", 330]].forEach(([t, len], i) => {
    const cy = STEP_T[i] + 14, next = i < 4 ? STEP_T[i + 1] + 14 - 32 : T + 688;
    s += circle(340, cy, 20, { fill: DOC.muted }) + text(340, cy + 6, String(i + 1), { size: 17, weight: 500, fill: DOC.ink, anchor: "middle" }) + line(340.5, cy + 31, 340.5, next, { stroke: DOC.line }) +
      dt(384, STEP_T[i] + 21, t, { size: 20, weight: 500, len });
  });
  const p = (i, k) => STEP_P[i] + 19.5 + k * 28.5;
  s += dt(384, p(0, 0), "Salin atau tulis kalimat pesan persis seperti di layar, termasuk titiknya. Kalau ada kode dalam", { len: 665 }) +
    dt(384, p(0, 1), "kurung, misalnya ", { len: 121 }) + codeChip(510, T + 195, 193, "Gagal (rate_limited).") + dt(707, p(0, 1), ", catat kodenya juga.", { len: 145 }) +
    dt(384, p(1, 0), "Di Mac tekan Cmd+F. Kotak cari muncul di kanan atas Chrome.", { len: 452 }) +
    dt(384, p(2, 0), "Misalnya ", { len: 63 }) + codeChip(...MATCH1.slice(0, 3), "Sesi berakhir") + dt(577, p(2, 0), ". Chrome menandai kata yang cocok dengan warna kuning. Tekan", { len: 472 }) +
    dt(384, p(2, 1), "Enter untuk lompat ke hasil berikutnya.", { len: 281 }) +
    dt(384, p(3, 0), "Kolom ini menjelaskan penyebab pesan itu muncul.", { len: 366 }) +
    drun(384, p(4, 0), [{ t: "Ikuti langkahnya, lalu ulangi tindakan yang tadi gagal. Kalau di editor, klik ", len: 526 }, { t: "Periksa lagi", w: 700, len: 87 }, { t: " bila", len: 29 }]) +
    dt(384, p(4, 1), "tombolnya ada.", { len: 111 }) +
    infoBox(T + 718, 76, dt(361, T + 772, "Bagian di dalam kurung, misalnya (nama) atau N, di layar diganti nama atau angka yang sebenarnya.", { size: 14, fill: DOC.sub, len: 645 }));
  return s;
})();
const STEP3 = [376, STEP_T[2] - 8, 720, 112];
// "Jendela akun NikahKit" table at scroll 9622. Columns 321/690/886 (text +16), header 44, rows from the measured tops.
const COLX = [337, 706, 902];
const ROW_T = [297, 361, 406, 471, 536, 601, 706, 811, 876].map((y) => T + y);
const B = (t) => ({ t, w: 700 });
const ROWS = [
  [[[B("Sudah masuk. Kembali ke editor Scalev.")]], [["Login berhasil."]], [["Tutup jendela, klik"], [B("Periksa lagi"), " di panel."]]],
  [[[B("Akun dinonaktifkan. Hubungi tim Nikahin.")]], [["Akun dinonaktifkan."]], [[{ t: "Hubungi tim Nikahin", u: true, uc: DOC.accent }, "."]]],
  [[[{ t: "Sesi berakhir", w: 700, len: 96 }, B(". Masuk lagi.")]], [["Login habis."]], [["Klik ", B("Masuk dengan")], [B("Google"), " lagi."]]],
  [[[B("Login dibatalkan.")]], [["Jendela Google ditutup."]], [["Klik ", B("Masuk dengan")], [B("Google"), " lagi."]]],
  [[[B("Login Google belum diatur.")]], [["Login Google belum aktif"], ["di server."]], [["Hubungi tim Nikahin."]]],
  [[[B("Login sudah dipakai. Masuk lagi. / Login")], [B("kedaluwarsa. Masuk lagi. / Login Google")], [B("kedaluwarsa. Masuk lagi. / Login tidak lengkap.")], [B("Masuk lagi.")]],
    [["Proses login terputus"], ["atau terlalu lama."]], [["Klik ", B("Masuk dengan")], [B("Google"), " lagi."]]],
  [[[B("Login Google tidak sah. Masuk lagi. / Login")], [B("Google tidak cocok. Masuk lagi.")]], [["Server Nikahin menolak"], ["bukti login dari Google."]],
    [["Klik ", B("Masuk dengan")], [B("Google"), " lagi. Bila"], ["berulang, ", { t: "hubungi tim", u: true, uc: DOC.accent }], [{ t: "Nikahin", u: true, uc: DOC.accent }, "."]]],
  [[[B("Email Google belum terverifikasi.")]], [["Email akun Google belum"], ["diverifikasi."]], [["Verifikasi email, atau"], ["pakai akun lain."]]],
  [[[B("Terlalu banyak permintaan. Coba lagi nanti.")]], [["Terlalu sering mencoba"], ["dalam waktu singkat."]], [["Tunggu beberapa menit."]]]
];
const MATCH2 = [COLX[0] - 1, ROW_T[2] + 13, 98, 19]; // "Sesi berakhir" (bold 14 px, pinned to 96 px)
const ROW3 = [321, ROW_T[2], 767, 65];
const ARTI = [COLX[1] - 4, ROW_T[2] + 12, 84, 22];
const TODO = [COLX[2] - 4, ROW_T[2] + 12, 160, 42];
const galatTable = (() => {
  let s = white(...MAIN) + dt(320, T + 149, "Jendela akun NikahKit", { size: 30, fill: DOC.ink, len: 287 }) +
    drun(320, T + 191, [{ t: "Jendela kecil yang terbuka dari chip akun, ", len: 307 }, { t: "Masuk dengan Google", w: 700, len: 169 }, { t: ", ", len: 8 }, { t: "Pilih paket", w: 700, len: 78 },
      { t: ", atau ", len: 45 }, { t: "Kelola PIN", w: 700, len: 76 }]) +
    drun(320, T + 219, [{ t: "dashboard", w: 700, len: 81 }, { t: ".", len: 4 }]);
  const ty = T + 253, bottom = 900 + 60;
  s += rect(320.5, ty + 0.5, 768, bottom - ty, { r: 8, fill: C.white, stroke: DOC.line }) + rect(321, ty + 1, 767, 43, { r: 7.5, fill: DOC.head }) + rect(321, ty + 30, 767, 14, { fill: DOC.head }) +
    ["Pesan", "Artinya", "Yang harus dilakukan"].map((h, j) => dt(COLX[j], ty + 27, h, { size: 14, weight: 500, fill: DOC.ink })).join("");
  ROWS.forEach((r, i) => {
    const y = ROW_T[i];
    s += line(321, y - 0.5, 1088, y - 0.5, { stroke: DOC.line }) + r.map((cell, j) => dpara(COLX[j], y + 27, cell, { size: 14, lh: 20 })).join("");
  });
  return s;
})();
// Chrome find bar (under the toolbar, right) and match highlights (active orange, under the glyphs).
const FB = { x: 1440 - 24 - 380, y: T + 4, w: 380, h: 48 };
const FB_BOX = [FB.x, FB.y, FB.w, FB.h];
const findBar = shadow(FB.x, FB.y, FB.w, FB.h, 8, 2) + rect(FB.x, FB.y, FB.w, FB.h, { r: 8, fill: C.white }) + line(FB.x + 266.5, FB.y + 12, FB.x + 266.5, FB.y + 36, { stroke: "#dadce0" }) +
  icon("chevron-up", FB.x + 290, FB.y + 24, 18, C.crIcon) + icon("chevron-down", FB.x + 320, FB.y + 24, 18, C.crIcon) + iconX("x", FB.x + 354, FB.y + 24, 16, C.crIcon);
const QUERY = text(FB.x + 18, FB.y + 29, "Sesi berakhir", { size: 14, fill: C.crText });
const findCount = (s) => white(FB.x + 200, FB.y + 10, 60, 28) + text(FB.x + 256, FB.y + 29, s, { size: 13, fill: C.crSub, anchor: "end" });
const hl = (b) => `<rect x="${b[0]}" y="${b[1]}" width="${b[2]}" height="${b[3]}" rx="2" fill="#ff9632" style="mix-blend-mode:multiply"/>`;

// FAQ (bantuan/faq.mdx) at scroll 3569: the end of "Paket dan harga", then "Masa aktif dan refund" (measured).
const FAQ_TOC = [["Langkah"], ["Paket dan harga"], ["Masa aktif dan refund"], ["Scalev dan perangkat"], ["Tamu dan data"], ["Jualan ke klien"], ["Pasang dan update"], ["Tanda berhasil"], ["Kalau ada masalah"], ["Lanjut"]];
// Accordion group: item rows 42 + 1 px line; o.open: { i, h, svg } expands item i.
const accGroup = (top, titles, o = {}) => {
  let s = "", y = top;
  titles.forEach((t, i) => {
    if (i) { s += line(321, y + 0.5, 1088, y + 0.5, { stroke: DOC.line }); y += 1; }
    const open = o.open?.i === i;
    s += dt(338, y + 26, t, { size: 14 }) + icon(open ? "chevron-up" : "chevron-down", 1062, y + 20, 16, DOC.sub);
    y += 42;
    if (open) { s += o.open.svg; y += o.open.h; }
  });
  return rect(320.5, top + 0.5, 768, y - top, { r: 8, fill: C.white, stroke: DOC.line }) + s;
};
const PAKET_Q = ["Bagaimana cara membayar?", "Bisa perpanjang sebelum habis?", "Bisa turun dari Tahunan ke Bulanan?", "Satu akun bisa dipakai bersama tim?"];
const AKTIF_Q = ["Apa yang terjadi saat masa aktif habis?", "Kapan saya diingatkan?", "Ada garansi uang kembali?", "Apa yang terjadi pada undangan khusus saat paket habis?"];
const SCALEV_Q = ["Perlu Scalev berbayar?", "Bisa dipakai di HP?", "Undangannya tayang di mana?", "Bisa dipakai bersama ekstensi Landing Hero?", "Kenapa harus menghubungkan bisnis Scalev?"];
const TAMU_Q = ["Di mana data tamu disimpan?", "Bagaimana staff penerima tamu masuk?"];
const H2_AKTIF = [320, T + 211, 278, 36];
const Q1 = [337, T + 264, 735, 42];
const FAQ_LINK = [949, T + 367, 112, 17];
const ANSWER = { i: 0, h: 94, svg: dt(338, T + 325, "Ada tenggang 7 hari. Selama tenggang, fitur masih jalan dan panel mengingatkan kamu untuk memperpanjang.", { size: 14, len: 712 }) +
  dt(338, T + 353, "Setelah itu RSVP, ucapan, dan dashboard pasangan berhenti. Halaman undangan tetap tampil untuk tamu, dan", { size: 14, len: 710 }) +
  drun(338, T + 381, [{ t: "form ucapan menulis ", len: 138 }, { t: "Ucapan & RSVP sudah ditutup.", w: 700, len: 206 }, { t: " Perpanjang untuk menyalakan lagi. Lihat ", len: 267 },
    { t: "Masuk dan bayar", w: 500, len: 112, u: true, uc: DOC.accent }, { t: ".", len: 4 }], { size: 14 }) };
const faqMain = (open) => white(...MAIN) + clipped(...MAIN, accGroup(T - 52, PAKET_Q) + dt(320, T + 239, "Masa aktif dan refund", { size: 30, fill: DOC.ink, len: 278 }) +
  accGroup(T + 264, AKTIF_Q, open ? { open: ANSWER } : {}) +
  (open ? dt(320, T + 606, "Scalev dan perangkat", { size: 30, fill: DOC.ink, len: 278 }) + accGroup(T + 631, SCALEV_Q) + dt(320, T + 922, "Tamu dan data", { size: 30, fill: DOC.ink, len: 189 })
    : dt(320, T + 512, "Scalev dan perangkat", { size: 30, fill: DOC.ink, len: 278 }) + accGroup(T + 537, SCALEV_Q) + dt(320, T + 828, "Tamu dan data", { size: 30, fill: DOC.ink, len: 189 }) + accGroup(T + 853, TAMU_Q)));
const faqScreen = docsTab("Pertanyaan yang sering ditanyakan", "bantuan/faq") + faqMain(false) + docsHeader(true) + docsSidebar() + docsToc(FAQ_TOC, 2);
// Masuk dan bayar membership (gabung/masuk-dan-bayar.mdx) at scroll 0.
const MDB_TOC = [["Langkah"], ["Bagian 1: Masuk dengan Goo...", 1], ["Bagian 2: Pilih paket dan bayar", 1], ["Punya kode uji?", 1], ["Tanda berhasil"], ["Kalau ada masalah"], ["Pesan saat masuk", 1], ["Pesan saat membayar", 1], ["Lanjut"]];
const MDB_SIDE = [16, T + 406, 232, 36];
const mdbScreen = docsTab("Masuk dan bayar membership", "gabung/masuk-dan-bayar") + white(0, T, 1440, 815) +
  dt(320, T + 135, "Masuk dan bayar membership", { size: 36, fill: DOC.ink, len: 463 }) + copyPage +
  dt(320, T + 173, "Masuk ke NikahKit dengan akun Google, pilih paket, bayar di halaman Scalev, lalu aktifkan", { size: 18, fill: DOC.sub, len: 716 }) +
  dt(320, T + 201, "langganan dengan Cek pembayaran dan Periksa lagi. Lengkap dengan arti setiap pesan.", { size: 18, fill: DOC.sub, len: 703 }) +
  dt(320, T + 260, "Di halaman ini kamu masuk ke NikahKit dengan akun Google, lalu membayar membership lewat Scalev.", { len: 741 }) +
  dt(320, T + 288, "Setelah selesai, editor NikahKit terbuka di halaman Scalev-mu.", { len: 452 }) +
  infoBox(T + 313, 207, dt(361, T + 367, "Yang kamu perlukan", { size: 14, weight: 600, fill: DOC.ink, len: 136 }) +
    bullets([[411, "NikahKit sudah terpasang dan tab NikahKit muncul. Lihat Pasang ekstensi NikahKit.", 541], [447, "Akun Google yang akan kamu pakai terus untuk NikahKit. Membership menempel di email Google ini.", 648],
      [483, "Sudah tahu paket yang mau dibeli. Lihat Pilih paket membership.", 419]])) +
  rect(320.5, T + 537.5, 768, 103, { r: 12, fill: "#fefbeb", stroke: "#f6e7b4" }) + dt(361, T + 565, "Warning", { size: 14, weight: 500, fill: DOC.ink, len: 54 }) +
  dt(361, T + 591, "Pakai satu akun Google yang sama setiap kali. Langganan, PIN, dan kepemilikan undangan tercatat di email", { size: 14, fill: DOC.sub, len: 689 }) +
  dt(361, T + 619, "Google itu. Kalau masuk dengan email lain, NikahKit menganggapnya akun baru tanpa langganan.", { size: 14, fill: DOC.sub, len: 627 }) +
  dt(320, T + 717, "Langkah", { size: 30, fill: DOC.ink, len: 112 }) + dt(320, T + 797, "Bagian 1: Masuk dengan Google", { size: 24, fill: DOC.ink, len: 330 }) +
  docsHeader(false) + docsSidebar("Masuk dan bayar membership") + docsToc(MDB_TOC, 0);

// ---- WhatsApp Web in Chrome at 1440 (generic layout, not measured) ----------------------------------------------------
const WA = { green: "#00a884", bg: "#efeae2", bar: "#f0f2f5", ink: "#111b21", sub: "#667781", out: "#d9fdd3", line: "#e9edef" };
const ADMIN = "+62 821-7527-4118";
const WC = 504; // chat pane from here; nav rail 0..64 and chat list 64..504
const CMP = { x: WC + 52, y: 900 - 22 - 200, w: 1440 - WC - 52 - 64, h: 200 }; // composer input, 9 lines
const CMP_AREA = [WC + 1, CMP.y - 10, 1440 - WC - 1, 900 - CMP.y + 10]; // footer: attach, composer, send
const SEND = [1440 - 33, CMP.y + CMP.h - 21];
const SEND_BOX = [SEND[0] - 21, SEND[1] - 21, 42, 42];
const VERSI = "[versi]";
const MSG = ["Halo Nikahin, NikahKit saya bermasalah.", "", `Laporan NikahKit ${VERSI}`, "Waktu: 2026-10-14T03:12:45.000Z", "Halaman: /pages/365671", "Build Scalev: e5cbe30-37178432877-1",
  "Browser: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36", "",
  ...CHECKS.map((c) => (SL_BAD[c] ? `[X] ${c}: ${SL_BAD[c]}` : `[OK] ${c}`)), "", "Izin domain:", "- script_src https://www.youtube.com: exists", "- frame_src https://www.youtube.com: exists", ""];
// Composer text soft-wraps at the composer width, as WhatsApp does.
const CMP_LINES = MSG.flatMap((l) => (l ? wrap(l, CMP.w - 40, 14) : ["\u00a0"]));
const TYPED = ["Saya klik Simpan & Terbitkan, lalu tertahan.", "Halaman: app.scalev.com/pages/365671"];
const cmpLine = (i) => CMP.y + 25 + i * 20;
// At first the composer shows the start of the message; once you click at its end it shows the last 7 lines + 2 typed.
const cmpTop = para(CMP.x + 14, cmpLine(0), CMP_LINES.slice(0, 9), { size: 14, fill: WA.ink, lh: 20 });
const cmpEnd = rect(CMP.x + 4, CMP.y + 4, CMP.w - 8, CMP.h - 8, { fill: C.white }) + para(CMP.x + 14, cmpLine(0), CMP_LINES.slice(-7), { size: 14, fill: WA.ink, lh: 20 });
const typedY = (i) => cmpLine(7 + i);
const CMP_BOX = [CMP.x, CMP.y, CMP.w, CMP.h];
const CHAT_HEAD = [WC + 1, T, 1440 - WC - 1, 60];
function waScreen(composer) {
  let s = chrome(0, 0, 1440, 900, { tabs: [{ title: "Landing Page Studio", fav: favScalev }, { title: "WhatsApp", active: true, fav: (cx, cy) => circle(cx, cy, 8, { fill: "#25d366" }) }], url: "web.whatsapp.com" }) +
    rect(0, T, 64, 815, { fill: WA.bar }) + line(64.5, T, 64.5, 900, { stroke: WA.line }) +
    [0, 1, 2, 3].map((i) => circle(32, T + 34 + i * 52, 11, { stroke: "#54656f", sw: 1.6 })).join("") + circle(32, 900 - 34, 14, { fill: "#dfe5e7" }) +
    white(65, T, WC - 65, 815) + text(84, T + 44, "WhatsApp", { size: 22, weight: 700, fill: WA.green }) + rect(80, T + 66, WC - 96, 36, { r: 18, fill: WA.bar }) +
    iconX("search", 102, T + 84, 16, "#54656f") + text(122, T + 89, "Cari", { size: 14, fill: WA.sub });
  for (let k = 0; k < 10; k++) {
    const ry = T + 118 + k * 72, on = k === 0;
    if (on) s += rect(72, ry, WC - 80, 72, { r: 10, fill: WA.bar });
    s += circle(108, ry + 36, 24, { fill: "#dfe5e7" }) + (on ? text(144, ry + 32, ADMIN, { size: 16, fill: WA.ink }) + rect(144, ry + 44, 210, 9, { r: 4.5, fill: WA.line })
      : rect(144, ry + 22, 120 + ((k * 37) % 90), 11, { r: 5.5, fill: WA.line }) + rect(144, ry + 44, 200 + ((k * 53) % 60), 9, { r: 4.5, fill: WA.bar }));
  }
  s += line(WC + 0.5, T, WC + 0.5, 900, { stroke: WA.line }) + rect(...CHAT_HEAD, { fill: WA.bar }) + circle(WC + 34, T + 30, 20, { fill: "#dfe5e7" }) +
    text(WC + 66, T + 36, ADMIN, { size: 16, fill: WA.ink }) + iconX("search", 1440 - 80, T + 30, 18, "#54656f") + iconX("more-vertical", 1440 - 36, T + 30, 18, "#54656f") +
    rect(WC + 1, T + 60, 1440 - WC - 1, 900 - T - 60, { fill: WA.bg }) +
    rect(1440 - 60 - 300, T + 100, 300, 40, { r: 8, fill: WA.out }) + rect(1440 - 60 - 290, T + 112, 200, 9, { r: 4.5, fill: "#b5e3ad" }) + // an earlier message
    rect(WC + 1, CMP.y - 10, 1440 - WC - 1, 900 - CMP.y + 10, { fill: WA.bar }) + icon("plus", WC + 26, SEND[1], 22, "#54656f") + rect(...CMP_BOX, { r: 8, fill: C.white }) +
    circle(SEND[0], SEND[1], 21, { fill: WA.green }) + icon("send", SEND[0] - 1, SEND[1], 18, C.white);
  return s + composer;
}
// Screenshot pasted from the clipboard: a thumbnail of the editor, as an attachment and later as a sent image.
const shotImg = (x, y, w, h) => rect(x, y, w, h, { r: 4, fill: "#f3f5f9" }) + rect(x, y, w, h * 0.08, { fill: C.svTop }) + rect(x, y + h * 0.08, w * 0.05, h * 0.92, { fill: C.page }) +
  rect(x + w * 0.05, y + h * 0.08, w * 0.23, h * 0.92, { fill: C.white }) + rect(x + w * 0.09, y + h * 0.2, w * 0.15, h * 0.3, { r: 2, fill: C.warnSoft }) + rect(x + w * 0.5, y + h * 0.14, w * 0.3, h * 0.8, { fill: "#fdf6ee" });
const SHOT = { x: 1440 - 320, y: CMP.y - 10 - 150, w: 220, h: 138 };
const SHOT_BOX = [SHOT.x, SHOT.y, SHOT.w, SHOT.h];
const shotAttach = shadow(SHOT.x, SHOT.y, SHOT.w, SHOT.h, 8, 2) + rect(SHOT.x, SHOT.y, SHOT.w, SHOT.h, { r: 8, fill: C.white }) + shotImg(SHOT.x + 6, SHOT.y + 6, SHOT.w - 12, SHOT.h - 12) +
  circle(SHOT.x + SHOT.w - 4, SHOT.y + 4, 11, { fill: "#54656f" }) + iconX("x", SHOT.x + SHOT.w - 4, SHOT.y + 4, 12, C.white, 2.4);
const bubbleLines = [MSG[0], "", MSG[2], MSG[3], MSG[4], MSG[5], "...", "[X] Penyimpanan ucapan dan RSVP: simpan halaman di Scalev dulu", "...", ...TYPED];
const BUB = { w: 560, h: 24 + bubbleLines.length * 20 + 14 }; BUB.x = 1440 - 60 - BUB.w; BUB.y = 900 - 62 - 16 - BUB.h;
const sentBubble = (() => {
  const { x, y, w, h } = BUB, ix = x + w - 232, iy = y - 8 - 150;
  return rect(ix, iy, 232, 150, { r: 8, fill: WA.out }) + shotImg(ix + 4, iy + 4, 224, 142) +
    rect(x, y, w, h, { r: 8, fill: WA.out }) + para(x + 12, y + 26, bubbleLines.map((l) => l || "\u00a0"), { size: 14, fill: WA.ink, lh: 20 }) +
    text(x + w - 40, y + h - 10, "10.12", { size: 11, fill: WA.sub, anchor: "end" }) + iconX("check", x + w - 26, y + h - 14, 13, "#53bdeb", 2.2) + iconX("check", x + w - 20, y + h - 14, 13, "#53bdeb", 2.2);
})();
const cmpEmpty = rect(WC + 1, CMP.y - 10, 1440 - WC - 1, 900 - CMP.y + 10, { fill: WA.bg }) + rect(WC + 1, 900 - 62, 1440 - WC - 1, 62, { fill: WA.bar }) + icon("plus", WC + 26, 900 - 31, 22, "#54656f") +
  rect(CMP.x, 900 - 52, CMP.w, 42, { r: 8, fill: C.white }) + text(CMP.x + 14, 900 - 26, "Ketik pesan", { size: 14, fill: WA.sub }) + circle(SEND[0], 900 - 31, 21, { fill: WA.bar }) + icon("send", SEND[0] - 1, 900 - 31, 18, "#8696a0");

const REST = [560, 700]; // pointer rest in the grey preview area, clear of the panel
const KW_S = sl.pos.salin[1] - 600; // bantuan-buka-wa: Salin laporan and Kirim lewat WhatsApp sit low in the dialog view

export const scenes = {
  "bantuan-buka": {
    title: "Membuka Bantuan di editor",
    cursorStart: REST,
    base: [editorKonten()],
    els: {
      dlg: { svg: dlgSheet + dlgHead + dlgView(sl, 0), skel: true, enter: "fade" }
    },
    steps: [
      { caption: "Buka halaman undangan di editor Scalev. Rel NikahKit ada di kiri.", dur: 3.4, focus: [TABROW, [0, 92, 72, 808]],
        mark: TAB.NikahKit, lens: { src: [101, 48, 215, 42] } },
      { caption: "Cari tombol Bantuan: paling bawah rel, di bawah Kosongkan.", dur: 3.4, focus: [0, 554, 72, 346], mark: { box: HELP, r: 6 }, lens: { src: [0, 752, 72, 100], zoom: 3 } },
      { caption: "Klik Bantuan. Dialog Bantuan terbuka di atas panel.", dur: 3.8, focus: [0, 92, 399, 808], mark: { box: HELP, r: 6 }, at: mid(HELP), click: true, show: ["dlg"],
        lens: { src: [0, 92, 399, 140], at: [330, 60] } }
    ]
  },

  "bantuan-salin-laporan": (() => {
    const ver = [16, 169, 351, 52], btns = [16, BTNS[1], 351, 146];
    return {
      title: "Membaca Bantuan dan menyalin laporan",
      cursorStart: REST,
      base: [editorKonten()],
      // The open dialog is part of the screen (skel): skeleton, with the step's item in detail as the body scrolls.
      els: {
        sheet: { svg: dlgSheet, skel: true },
        body: { svg: sl.svg, skel: true },
        cover: { svg: dlgCover, skel: true },
        salin: { svg: tr(0, -SLT, sl.part.salin), skel: true, enter: "fade", delay: 1.2 },
        copied: { svg: white(16, sl.pos.hint[1] - SLT - 2, 300, 20) + text(16, sl.pos.hint[1] - SLT + 12, "Tersalin.", { size: 12, fill: C.faint }), skel: true, enter: "fade", delay: 0.1 }
      },
      steps: [
        { caption: "Baca baris versi: Versi, dengan tombol Cek update di kanan.", focus: ver, mark: sl.pos.version, lens: { src: helpLens(ver) } },
        { caption: "Baca baris status: 1 perlu perhatian. Muat ulang editor dulu.", dur: 3.4, focus: sl.pos.status, mark: sl.pos.status, lens: { src: helpLens(sl.pos.status, 0, 8) } },
        { caption: "Baca tips Terbit tertahan: muat ulang, lalu Simpan & Terbitkan.", dur: 3.6, focus: sl.pos.tip, mark: sl.pos.tip,
          lens: { src: [0, sl.pos.tip[1] - 6, 399, sl.pos.tip[3] + 7] } },
        { caption: "Periksa daftar cek. Tanda ! bermasalah, penyebabnya di bawah namanya.", dur: 3.8, focus: at(sl.pos.rows[BAD_ROW], SL1), mark: at(sl.pos.rows[BAD_ROW], SL1),
          scroll: { id: "body", dy: SL1 }, lens: { src: helpLens(sl.pos.rows[BAD_ROW], SL1, 1) } },
        { caption: "Gulir ke bawah sampai tombol laporan.", focus: at(btns, SLT), mark: at(BTNS, SLT), scroll: { id: "body", dy: SL2 }, show: ["salin"],
          lens: { src: helpLens(btns, SLT, 8) } },
        { caption: "Klik Salin laporan. Tulisan kecil berubah: Tersalin.", dur: 3.4, mark: at(sl.pos.salin, SLT), at: mid(at(sl.pos.salin, SLT)), click: true, press: "salin",
          show: ["copied"], lens: { src: helpLens(btns, SLT, 8) } },
        { caption: "Kirim laporannya ke admin: tempel di WhatsApp, atau Kirim lewat WhatsApp.", dur: 3.6, focus: at(sl.pos.wa, SLT), mark: at(sl.pos.wa, SLT),
          lens: { src: helpLens(sl.pos.wa, SLT, 4) } },
        { caption: "Tutup Bantuan: klik × di kanan atas, atau tekan Esc.", focus: [72, 92, 327, 62], mark: XBOX, at: mid(XBOX), click: true,
          hide: ["sheet", "body", "salin", "copied", "cover"], lens: { src: [200, 96, 199, 54] } }
      ]
    };
  })(),

  "bantuan-izin-domain": {
    title: "Izin domain (CSP) di Bantuan: salin, lalu periksa ulang",
    cursorStart: REST,
    base: [editorKonten(), izDialog(false)],
    els: {
      salinCsp: { svg: tr(0, -IZ1, iz.part.salinCsp), skel: true },
      periksa: { svg: tr(0, -IZ1, iz.part.periksa), skel: true },
      copied: { svg: izCopied, skel: true, enter: "fade", delay: 0.1 },
      fixed: { svg: dlgView(izF, IZF) + text(16, izF.pos.cspMsg[1] - IZF + 12, "Diperiksa ulang.", { size: 12, fill: C.faint }), skel: true, enter: "fade", delay: 0.1 }
    },
    steps: [
      { caption: "Klik Salin domain kurang. Muncul Tersalin. Tempel di tab Security.", dur: 3.8, focus: CSP_AREA, mark: at(iz.pos.salinCsp, IZ1), at: mid(at(iz.pos.salinCsp, IZ1)),
        click: true, press: "salinCsp", show: ["copied"], lens: { src: [0, iz.pos.csp[2][1] - IZ1 - 8, 399, iz.pos.cspMsg[1] + 32 - iz.pos.csp[2][1]] } },
      { caption: "Buka tab Security, tempel, lalu Simpan (dua animasi berikutnya).", dur: 3.2, focus: [TABROW, [1183, 44, 257, 48]], mark: [TAB.Security, ED.simpanBox],
        lens: { src: [0, 46, 330, 46] } },
      { caption: "Kembali ke Bantuan, klik Periksa ulang: Diperiksa ulang, Sudah diizinkan.", dur: 4.2, focus: [CSP_AREA, helpLens(izF.pos.rows["Izin domain di tab Security"], IZF, 2)],
        mark: at(iz.pos.periksa, IZ1), at: mid(at(iz.pos.periksa, IZ1)),
        click: true, press: "periksa", hide: ["copied"], show: ["fixed"], lens: { src: [0, izF.pos.csp[2][1] - IZF - 8, 399, izF.pos.cspMsg[1] + 32 - izF.pos.csp[2][1]] } }
    ]
  },

  "bantuan-izin-security": {
    title: "Menempel domain di tab Security Scalev",
    cursorStart: REST,
    base: [editorSecurity()],
    els: {
      before: { svg: clipped(0, 44, 399, 856, scalevEditor(0, 0, { rail: "Konten" }) + izDialog(true)), skel: true },
      img: { svg: securityPanel(0, { at: "image" }), skel: true },
      open: { svg: securityPanel(0, { at: "image", picker: {} }), skel: true },
      typed: { svg: securityPanel(0, { at: "image", picker: { value: ORIGIN } }), skel: true, enter: "fade" },
      ticked: { svg: securityPanel(0, { at: "image", images: 1, picker: { value: ORIGIN, ticked: true } }), skel: true }
    },
    steps: [
      { caption: "Buka tab Security di deretan tab editor Scalev.", dur: 3.4, focus: TABROW, mark: TAB.Security, at: mid(TAB.Security), click: true, hide: ["before"],
        lens: { src: [0, 46, 330, 46] } },
      { caption: "Gulir panel sampai Image Sources: img_src masuk ke kolom ini.", dur: 3.4, focus: [0, 100, 399, 88], mark: SECURITY.imageSelect, show: ["img"],
        lens: { src: [0, 102, 399, 86] } },
      { caption: "Klik kolom Image Sources. Kotak Add image domain terbuka.", dur: 3.4, focus: [0, 100, 399, 136], mark: SECURITY.imageSelect,
        at: mid(SECURITY.imageSelect), click: true, hide: ["img"], show: ["open"], lens: { src: [0, 176, 399, 58] } },
      { caption: "Tempel https://foto.contoh.com di kotak itu. Domainnya muncul di bawah.", dur: 3.8, focus: [0, 100, 399, 187], mark: SECURITY.pickerInput,
        hide: ["open"], show: ["typed"], lens: { src: [0, 176, 399, 109] } },
      { caption: "Centang domain itu. Kolom Image Sources menulis 1 selected.", dur: 3.6, mark: SECURITY.pickerOption, at: mid(SECURITY.pickerTick), click: true,
        hide: ["typed"], show: ["ticked"], lens: { src: [0, 102, 399, 183] } }
    ]
  },

  "bantuan-izin-simpan": {
    title: "Menyimpan tab Security di Scalev",
    cursorStart: [1300, 400],
    base: [editorSecurity({ at: "image", images: 1 })],
    els: {
      simpan: svSimpan()
    },
    steps: [
      { caption: "Simpan ada di kanan atas editor Scalev, di kiri Simpan & Terbitkan.", dur: 3.4, focus: [1183, 44, 257, 48], mark: ED.simpanBox, lens: { src: [1150, 46, 290, 44] } },
      { caption: "Klik Simpan supaya domain yang kamu tempel tersimpan.", dur: 3.2, mark: ED.simpanBox, at: mid(ED.simpanBox), click: true, press: "simpan", lens: { src: [1150, 46, 290, 44] } }
    ]
  },

  "bantuan-cek-gejala": {
    title: "Pola memperbaiki masalah: baca pesan, perbaiki, periksa lagi",
    cursorStart: REST,
    base: [scalevEditor(0, 0) + PREVIEW + GATE_SERVER],
    els: {
      recheck: { svg: recheckBtn, skel: true },
      checking: { svg: gate([[{ t: "Memeriksa akses...", w: 700 }]]), skel: true, enter: "fade" },
      ok: { svg: panelKonten(), skel: true, enter: "fade", delay: 0.6 }
    },
    steps: [
      { caption: "Catat gejalanya: salin kalimat pesannya persis seperti di layar.", dur: 3.6, focus: [0, 154, 399, 80], mark: GATE_MSG, lens: { src: [0, 158, 399, 72] } },
      { caption: "Cari bagiannya di Masalah umum: Ctrl+F, ketik beberapa kata gejalanya.", dur: 3.6, mark: GATE_MSG, note: "Ctrl+F: tidak terjangkau" },
      { caption: "Ikuti Langkah perbaikan. Contoh ini: pastikan internet tersambung.", dur: 3.6, mark: GATE_MSG, note: "Cek Wi-Fi atau data seluler dulu" },
      { caption: "Klik Periksa lagi. Panel menulis Memeriksa akses... sebentar.", dur: 3.4, focus: [0, 154, 399, 130], mark: RECHECK, at: mid(RECHECK), click: true, press: "recheck",
        show: ["checking"], lens: { src: [0, 158, 399, 60] } },
      { caption: "Rel menu tampil lagi: beres. Masih belum? Kirim laporan lewat Bantuan.", dur: 3.8, focus: [0, 92, 72, 360], mark: { box: RAIL_TABS, r: 0 },
        hide: ["recheck", "checking"], show: ["ok"], lens: { src: [0, 100, 72, 344] } }
    ]
  },

  "bantuan-cari-galat": {
    title: "Mencari arti pesan galat di panduan",
    cursorStart: [1200, 700],
    base: [galatScreen],
    els: {
      steps: { svg: galatSteps + hl([MATCH1[0] + 5, MATCH1[1] + 2, MATCH1[2] - 10, 19]) + line(0, T + 64.5, 1425, T + 64.5, { stroke: DOC.line }), skel: true, enter: "fade", delay: 1.45 },
      table: { svg: galatTable + hl(MATCH2) + line(0, T + 64.5, 1425, T + 64.5, { stroke: DOC.line }), skel: true, enter: "fade", delay: 0.5 },
      find: { svg: findBar, enter: "pop", origin: [FB.x + FB.w, FB.y] },
      query: QUERY,
      n1: { svg: findCount("1/2"), enter: "fade", delay: 1.4 },
      n2: { svg: findCount("2/2"), enter: "fade", delay: 0.5 },
      findSk: { svg: findBar + QUERY + findCount("2/2"), skel: true }
    },
    steps: [
      { caption: "Catat pesannya persis seperti di layar. Buka halaman Pesan galat.", dur: 3.2, focus: [316, T + 98, 780, 120], mark: H1 },
      { caption: "Tekan Ctrl+F (Mac: Cmd+F). Kotak cari muncul di kanan atas Chrome.", dur: 3.2, focus: FB_BOX, mark: { box: FB_BOX, r: 8 }, show: ["find"], note: "Ctrl+F (Mac: Cmd+F)" },
      { caption: "Ketik beberapa kata awal, misalnya Sesi berakhir. Chrome lompat ke hasilnya.", dur: 3.8, focus: [FB_BOX, STEP3], mark: [MATCH1, [FB.x + 12, FB.y + 10, 250, 28]],
        type: [{ id: "query", n: 13, box: [FB.x + 16, FB.y + 12, tw("Sesi berakhir", 14) + 6, 24] }], show: ["n1", "steps"], lens: { src: [376, STEP_T[2] - 6, 680, 110], zoom: 1.5 } },
      { caption: "Tekan Enter untuk lompat ke hasil berikutnya: baris di tabel pesan.", dur: 3.4, focus: [FB_BOX, ROW3], mark: [MATCH2, [FB.x + 200, FB.y + 10, 62, 28]],
        hide: ["n1"], show: ["n2", "table"], lens: { src: [321, ROW_T[2] - 4, 560, 73] } },
      { caption: "Baca kolom Artinya. Di sini: Login habis.", dur: 3.2, focus: ROW3, mark: ARTI, hide: ["find", "query", "n2"], show: ["findSk"], lens: { src: [600, ROW_T[2] - 4, 490, 73] } },
      { caption: "Kerjakan kolom Yang harus dilakukan: klik Masuk dengan Google lagi.", dur: 3.8, mark: TODO, lens: { src: [600, ROW_T[2] - 4, 490, 73] } }
    ]
  },

  "bantuan-faq": {
    title: "Mencari jawaban di FAQ",
    cursorStart: [1200, 700],
    base: [faqScreen],
    els: {
      open: { svg: faqMain(true), skel: true, enter: "fade" },
      mdb: { svg: mdbScreen, skel: true, enter: "fade" }
    },
    steps: [
      { caption: "Cari kelompok pertanyaanmu, misalnya Masa aktif dan refund.", dur: 3.4, focus: [316, H2_AKTIF[1] - 6, 780, 230], mark: H2_AKTIF },
      { caption: "Klik pertanyaannya. Jawaban terbuka di bawah judulnya.", dur: 3.8, focus: [316, Q1[1], 780, 134], mark: Q1, at: [560, Q1[1] + 21], click: true, show: ["open"],
        lens: { src: [330, Q1[1] + 44, 740, 90], zoom: 1.5, at: [110, 420] } },
      { caption: "Buka tautan untuk detail: klik Masuk dan bayar.", dur: 3.8, focus: [[316, T + 98, 780, 56], MDB_SIDE], mark: { box: FAQ_LINK, r: 2 },
        at: mid(FAQ_LINK), click: true, show: ["mdb"],
        note: "Tautan: Masuk dan bayar" }
    ]
  },

  "bantuan-masa-aktif": {
    title: "Apa yang terjadi saat masa aktif habis",
    cursorStart: [600, 700],
    base: [editorKonten(), timeline],
    els: {
      warn: { svg: panelWith(RN_WARN), skel: true, enter: "fade", delay: 0.5 },
      err: { svg: panelWith(RN_ERR), skel: true, enter: "fade", delay: 0.5 },
      expired: { svg: GATE_EXPIRED, skel: true, enter: "fade", delay: 0.5 },
      pilih: pilihBtn,
      acct: { svg: dim(0, 0, 1440, 900) + accountWindow(), enter: "pop", origin: [AW.x + AW.w / 2, AW.y + 100], delay: 0.1 }
    },
    steps: [
      { caption: "Selama paket aktif, semua fitur jalan: editor, RSVP, ucapan, dashboard.", dur: 3.4, focus: [tlBox(0), [72, 92, 327, 808]], mark: { box: tlBox(0), r: 8 },
        lens: { src: grow(tlBox(0), 6) } },
      { caption: "Mulai 7 hari sebelum berakhir, panel menulis Langganan berakhir N hari lagi.", dur: 3.8, focus: [tlBox(1), grow(RN_WARN.box, 6), grow(CHIP, 4)],
        mark: [{ box: RN_WARN.box }, { box: tlBox(1), r: 8 }],
        show: ["warn"], lens: { src: [72, 100, 327, 135], at: [480, 330] } },
      { caption: "Lewat tanggal berakhir: tenggang 7 hari. Fitur masih jalan, segera perpanjang.", dur: 3.8, focus: [tlBox(2), grow(RN_ERR.box, 6), grow(CHIP, 4)],
        mark: [{ box: RN_ERR.box }, { box: tlBox(2), r: 8 }],
        hide: ["warn"], show: ["err"], lens: { src: [72, 100, 327, 154], at: [480, 330] } },
      { caption: "Lewat tenggang: RSVP, ucapan, dan Dashboard pasangan berhenti.", dur: 3.6, focus: [tlBox(3), GATE_AREA, grow(CHIP, 4)],
        mark: [{ box: GATE_MSG }, { box: tlBox(3), r: 8 }], hide: ["err"],
        show: ["expired", "pilih"], lens: { src: GATE_AREA, zoom: 1.6, at: [480, 330] } },
      { caption: "Klik Pilih paket, lalu bayar. RSVP dan ucapan jalan lagi.", dur: 4, focus: GATE_AREA, mark: GATE_EXP_BTN, at: mid(GATE_EXP_BTN), click: true,
        press: "pilih", show: ["acct"], lens: { src: GATE_AREA, zoom: 1.6, at: [480, 440] } }
    ]
  },

  "bantuan-masa-aktif-tamu": {
    title: "Halaman tamu saat masa aktif habis",
    cursorStart: [PX + 340, PY + 700],
    base: [phoneDesk(guestPhone(false), { screen: CREAM })],
    els: {
      closed: { svg: clipped(PX, PY, 390, 844, guestPhone(true)), skel: true, enter: "fade" }
    },
    steps: [
      { caption: "Selama paket aktif, tamu bisa mengisi kehadiran dan Ucapan & doa.", dur: 3.4, focus: [PX, PY, 390, 844], mark: { box: FORM, r: 12 },
        lens: { src: [FX - 8, PY + 229, FW + 16, 161], zoom: 1.4, at: [625, 230] } },
      { caption: "Lewat tenggang, halaman tetap tampil. Form menulis Ucapan & RSVP sudah ditutup.", dur: 4, mark: { box: CLOSED, r: 12 }, show: ["closed"],
        lens: { src: grow(CLOSED, 8), zoom: 1.4, at: [625, 90] } }
    ]
  },

  "bantuan-buka-wa": (() => {
    const D = [3.4, 3.6, 3.8];
    return {
      title: "Membuka WhatsApp admin dari Bantuan",
      cursorStart: REST,
      base: [editorKonten()],
      els: {
        sheet: { svg: dlgSheet, skel: true, enter: "fade" },
        body: { svg: sl.svg, skel: true, enter: "fade" },
        cover: { svg: dlgCover, skel: true, enter: "fade" },
        waBtn: { svg: tr(0, -KW_S, sl.part.wa), skel: true, enter: "fade", delay: 1.2 },
        wa: { svg: waScreen(cmpTop), skel: true, enter: "fade", delay: 0.25 }
      },
      steps: [
        { caption: "Buka Bantuan di editor: klik Bantuan di bagian bawah rel NikahKit.", dur: D[0], focus: [0, 92, 399, 140], mark: { box: HELP, r: 6 },
          at: mid(HELP), click: true, show: ["sheet", "body", "cover"], lens: { src: [0, 92, 399, 140], at: [330, 60] } },
        { caption: "Gulir ke tombol laporan: Salin laporan dan Kirim lewat WhatsApp.", dur: D[1], focus: at([16, BTNS[1], 351, 80], KW_S), mark: at([16, BTNS[1], 351, 80], KW_S),
          scroll: { id: "body", dy: KW_S }, show: ["waBtn"], lens: { src: helpLens([16, BTNS[1], 351, 80], KW_S, 4) } },
        { caption: "Klik Kirim lewat WhatsApp. WhatsApp terbuka di chat admin Nikahin.", dur: D[2], focus: [CHAT_HEAD, CMP_AREA], mark: at(sl.pos.wa, KW_S),
          at: mid(at(sl.pos.wa, KW_S)), click: true, press: "waBtn", show: ["wa"] }
      ]
    };
  })(),

  "bantuan-kirim-wa": {
    title: "Melengkapi dan mengirim laporan lewat WhatsApp",
    cursorStart: [1100, 300],
    base: [waScreen(cmpTop)],
    els: {
      end: { svg: cmpEnd, enter: "fade" },
      typed1: text(CMP.x + 14, typedY(0), TYPED[0], { size: 14, fill: WA.ink }),
      typed2: text(CMP.x + 14, typedY(1), TYPED[1], { size: 14, fill: WA.ink }),
      shot: { svg: shotAttach, enter: "pop", origin: [SHOT.x + SHOT.w / 2, SHOT.y + SHOT.h] },
      empty: { svg: cmpEmpty, enter: "fade" },
      sent: { svg: sentBubble, delay: 0.15 }
    },
    steps: [
      { caption: "Pesannya sudah terisi: salam dan laporan teknis. Biarkan, jangan dihapus.", dur: 3.6, focus: [CHAT_HEAD, CMP_AREA], mark: { box: CMP_BOX, r: 8 },
        lens: { src: [CMP.x, CMP.y, 440, 92] } },
      { caption: "Tulis apa yang kamu lakukan di bawah laporan, dengan kalimat pendek.", dur: 4, focus: CMP_AREA, mark: { box: CMP_BOX, r: 8 }, at: [CMP.x + 420, typedY(0) - 5],
        click: true, show: ["end"], type: [{ id: "typed1", n: 22, box: [CMP.x + 12, typedY(0) - 16, tw(TYPED[0], 14) + 6, 22] }], lens: { src: [CMP.x, CMP.y + 89, 400, 103] } },
      { caption: "Tulis alamat halamannya, misalnya app.scalev.com/pages/365671.", dur: 3.6, mark: { box: CMP_BOX, r: 8 },
        type: [{ id: "typed2", n: 18, box: [CMP.x + 12, typedY(1) - 16, tw(TYPED[1], 14) + 6, 22] }], lens: { src: [CMP.x, CMP.y + 111, 400, 89] } },
      { caption: "Ambil screenshot layarnya, lalu tempel (Ctrl+V) di chat.", dur: 3.4, focus: [grow(SHOT_BOX, 12), CMP_AREA], mark: { box: SHOT_BOX, r: 8 }, show: ["shot"],
        note: "Tempel: Ctrl+V" },
      { caption: "Periksa sebelum kirim: tanpa PIN, kode staff, atau data klien.", dur: 3.8, focus: CMP_AREA, mark: { box: CMP_BOX, r: 8 },
        note: "Jangan kirim PIN, kode staff, atau data klien" },
      { caption: "Klik kirim. Admin membalas di chat yang sama.", dur: 3.8, focus: [WC + 1, T + 60, 1440 - WC - 1, 900 - T - 60],
        mark: { box: SEND_BOX, r: 21 }, at: SEND, click: true, hide: ["shot", "end", "typed1", "typed2"], show: ["empty", "sent"] }
    ]
  }
};
