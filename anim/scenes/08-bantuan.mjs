// Bantuan: dialog Bantuan (nikahkit/src/ui/help.jsx), Izin domain (CSP), pola memperbaiki dari pesan akses (App.jsx
// AccessGate), mencari pesan di panduan (docs.page), masa aktif (RenewNote, gate expired, pin.html), dan kirim laporan
// lewat WhatsApp. Ukuran dari /tmp/ref/editor-bantuan.png + editor-metrics.json (Bantuan), gaya dari ui/styles.js.
import { C, rect, text, line, circle, para, group, clipped, shadow, icon, iconX, nkBtn, nkInput, nkLabel, nkBadge, nkNote, nkAcc, nkH3,
  chrome, favScalev, scalevEditor, nkRail, nkHead, ED, note, ring, dim, tw, esc } from "../lib.mjs";

const BG = "#eef1f5"; // stage background (covers below the world)
const wrap = (s, w, size = 12, weight = 400) => {
  const out = []; let cur = "";
  // Roboto/SF average advance ≈ 0.5em (lib's tw() is a deliberate over-estimate for sizing pills).
  const m = (t) => t.length * size * (weight >= 600 ? 0.56 : 0.5);
  for (const word of s.split(" ")) { const t = cur ? cur + " " + word : word; if (cur && m(t) > w) { out.push(cur); cur = word; } else cur = t; }
  return cur ? [...out, cur] : out;
};
// Monospace pre-wrap (nk-pre: 12px Roboto Mono, ~7.2px per char).
const wrapMono = (s, n) => {
  if (!s) return [""];
  const out = []; let rest = s;
  while (rest.length > n) { let k = rest.lastIndexOf(" ", n); if (k <= 0) k = n; out.push(rest.slice(0, k)); rest = rest.slice(k).replace(/^ /, ""); }
  return [...out, rest];
};
// Text with mixed weight: parts are strings or { t, w, fill, u }.
const rich = (x, y, parts, o = {}) => `<text x="${x}" y="${y}" font-size="${o.size ?? 14}" fill="${o.fill ?? C.strong}" xml:space="preserve">${parts.map((p) => typeof p === "string" ? esc(p)
  : `<tspan${p.w ? ` font-weight="${p.w}"` : ""}${p.fill ? ` fill="${p.fill}"` : ""}${p.u ? ` text-decoration="underline"` : ""}>${esc(p.t)}</tspan>`).join("")}</text>`;
const tr = (dx, dy, ...kids) => group({ transform: `translate(${dx} ${dy})` }, ...kids);

// ---- Pratinjau undangan (template QA di editor-bantuan.png, data contoh) -------------------------------------------
const MAROON = "#8a2c22", SCRIPT = "'Great Vibes','Brush Script MT','Snell Roundhand',cursive", SERIF = "Georgia,'Times New Roman',serif";
const scallops = (x, y) => clipped(x, y, 390, 40, rect(x, y, 390, 20, { fill: MAROON }) + Array.from({ length: 13 }, (_, k) => circle(x + 15 + k * 30, y + 20, 15, { fill: MAROON })).join(""));
function invitation(x, y) {
  const cx = x + 195;
  let s = scallops(x, y);
  s += text(cx, y + 165, "Mempelai", { size: 48, fill: MAROON, anchor: "middle", font: SCRIPT, italic: true }) +
    `<path d="M${cx - 90} ${y + 442} V${y + 292} a90 90 0 0 1 180 0 V${y + 442} Z" fill="#ead8cf" stroke="${MAROON}" stroke-width="1.5"/>` +
    `<path d="M${cx - 76} ${y + 441} q0 -78 76 -78 q76 0 76 78 Z" fill="#9e2f35"/>` + circle(cx, y + 318, 36, { fill: "#c9a596" }) +
    text(cx, y + 500, "Rani", { size: 36, fill: MAROON, anchor: "middle", font: SCRIPT, italic: true }) +
    text(cx, y + 537, "Rani Ayu, S.Psi.", { size: 16, weight: 700, fill: "#111", anchor: "middle", font: SERIF }) +
    text(cx, y + 562, "Psikolog", { size: 14, fill: "#333", anchor: "middle", font: SERIF }) +
    text(cx, y + 588, "Putri kedua dari Bapak Ahmad & Almh. Ibu Siti", { size: 16, fill: "#111", anchor: "middle", font: SERIF }) +
    text(cx, y + 614, "Jakarta", { size: 16, fill: "#111", anchor: "middle", font: SERIF }) +
    rect(cx - 54, y + 626, 108, 36, { r: 18, fill: MAROON }) + icon("instagram", cx - 32, y + 644, 14, C.white) + text(cx + 8, y + 649, "@rani.ayu", { size: 13, fill: C.white, anchor: "middle", font: SERIF });
  return s + bottomNav(x, y + 704);
}
const bottomNav = (x, y) => rect(x + 36, y, 318, 70, { r: 16, fill: MAROON }) + rect(x + 46, y + 9, 58, 52, { r: 10, fill: "rgba(255,255,255,.16)" }) +
  [["heart", "Mempelai"], ["calendar", "Acara"], ["image", "Galeri"], ["message-circle", "Ucapan"], ["gift", "Hadiah"]].map(([ic, l], i) =>
    icon(ic, x + 75 + i * 60, y + 26, 18, C.white) + text(x + 75 + i * 60, y + 51, l, { size: 11, fill: C.white, anchor: "middle", font: SERIF })).join("");
const PREVIEW = invitation(ED.screen.x, ED.screen.y);

// ---- Panel Konten (editor-konten.png): Bahasa undangan, lead, grup akordeon ---------------------------------------
function kontenBody(dy = 0) {
  const y = 169 + dy;
  return nkLabel(88, y + 12, "Bahasa undangan") + nkInput(88, y + 20, 279, "Indonesia", { select: true }) +
    para(88, y + 76, ["Hanya halaman tamu. Teks bawaan ikut berganti;", "teks yang sudah diubah tetap."], { size: 12, fill: C.faint, lh: 16 }) +
    rich(88, y + 120, ["Urutan dan tampilan bagian di ", { t: "Lapisan", w: 500, u: true }, "."], { size: 12, fill: C.faint }) +
    ["Sampul", "Mempelai", "Acara & Tanggal", "Salam Pembuka", "Ayat / Kutipan", "Kisah Cinta", "Simpan Tanggal", "Hitung Mundur", "Galeri Foto", "Rangkaian Acara", "RSVP & Ucapan"]
      .map((t, i) => (y + 136 + i * 58 < 890 ? nkAcc(88, y + 136 + i * 58, 279, t, { badge: "Terisi" }) : "")).join("");
}
// Panel NikahKit lengkap (rel + Konten) di atas editor; chip akun memakai nama paket member.
const PLAN = "Tahunan";
const panelKonten = (o = {}) => nkRail(0, 0, "Konten") + rect(72, 92, 327, 808, { fill: C.white }) + nkHead(0, 0, "Konten", { account: PLAN }) +
  line(72, 153.5, 399, 153.5, { stroke: C.line }) + (o.top ?? "") + clipped(72, 154, 327, 746, kontenBody(o.dy ?? 0));
const editorKonten = (o = {}) => scalevEditor(0, 0, { rail: "Konten", ...o }) + PREVIEW + panelKonten(o);

// ---- Dialog Bantuan (help.jsx) --------------------------------------------------------------------------------------
const BASE_CHECKS = ["Aplikasi Scalev (Nuxt/Vue)", "Komponen halaman studio", "HTML Mode aktif", "Editor kode (CodeMirror)", "Strip tab sidebar", "Area panel sidebar",
  "Iframe preview", "Inspect preview", "Sinkron device", "Media Scalev", "Izin CSP otomatis"];
const CHECKS = [...BASE_CHECKS, "Hanya NikahKit yang aktif", "Versi editor Scalev", "Data undangan terbaca", "Klik di pratinjau", "Kode halaman cocok dengan NikahKit",
  "Penyimpanan ucapan dan RSVP", "Izin domain di tab Security", "Penulisan ke editor"];
const DIRECTIVE = { img_src: "Gambar", script_src: "Skrip", frame_src: "Bingkai (iframe)" };
const STATUS = { exists: ["Sudah diizinkan", false], added: ["Ditambahkan otomatis", false], failed: ["Perlu ditambah manual", true] };
const badgeW = (l) => tw(l, 10, 500) + 12;
const cspBadge = (x, y, st) => { const [l, todo] = STATUS[st]; return nkBadge(x, y, l, todo ? { fill: C.warnSoft, fg: C.warnStrong } : {}); };
// One .nk-csp row: grid 1fr auto (origin + purpose left, badge centred right), padding 8px 10px, 16px lines.
const cspLi = (r, y) => {
  const bw = badgeW(STATUS[r.st][0]), why = wrap(`${r.why} · ${DIRECTIVE[r.d]} (${r.d})`, 329 - 8 - bw), h = 36 + why.length * 16;
  return { h, svg: rect(16.5, y + 0.5, 350, h - 1, { r: 4, fill: C.white, stroke: C.line }) + text(27, y + 21, r.o, { size: 12, mono: true, fill: C.strong }) +
    para(27, y + 39, why, { size: 12, fill: C.text, lh: 16 }) + cspBadge(366 - 10 - bw, y + h / 2 - 9, r.st) };
};
const mark = (y, kind) => kind === "ok" ? circle(30, y + 18, 10, { fill: C.okSoft }) + iconX("check", 30, y + 18, 12, C.ok, 2.6)
  : circle(30, y + 18, 10, { fill: C.warnSoft }) + text(30, y + 22.5, "!", { size: 12, weight: 700, fill: C.warnStrong, anchor: "middle" });
const VERSI = "[versi]";
const report = (bad, csp) => [`Laporan NikahKit ${VERSI}`, "Waktu: 2026-10-14T03:12:45.000Z", "Halaman: /pages/365671", "Build Scalev: e5cbe30-37178432877-1",
  "Browser: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36", "",
  ...CHECKS.map((c) => (bad[c] ? `[X] ${c}: ${bad[c]}` : `[OK] ${c}`)),
  ...(csp.length ? ["", "Izin domain:", ...csp.map((r) => `- ${r.d} ${r.o}: ${r.st}`)] : [])];

// Lays out the dialog body exactly like the DOM flow (padding 16, margins from styles.js/base.css) at scroll 0.
// o.bad: { feature: detail }, o.csp: [{ o: origin, d: directive, st, why }], o.open: details open, o.cspMsg: reserve the status line.
function helpBody(o) {
  const bad = o.bad ?? {}, csp = o.csp ?? [], nBad = Object.keys(bad).length, pos = {};
  let s = "", y = 169;
  s += text(16, y + 23, "Versi", { size: 14, fill: C.text }) + nkBtn(270, y, "Cek update", { variant: "quiet", w: 97, size: 14 });
  y += 36; s += text(16, y + 16, "Sudah versi terbaru.", { size: 12, fill: C.faint }); y += 20 + 12;
  const st = wrap(nBad ? `${nBad} perlu perhatian. Muat ulang editor; bila tetap, kirim laporan.` : "Semua berjalan normal.", 327);
  pos.status = [16, y, 351, 20 + st.length * 18];
  s += nkNote(16, y, 351, st, { tone: nBad ? "warn" : "info" }); y += 20 + st.length * 18 + 12;
  const tip = wrap('Terbit tertahan "not finished previewing"? Muat ulang editor, lalu tekan Simpan & Terbitkan.', 351);
  s += para(16, y + 12, tip, { size: 12, fill: C.faint, lh: 16 }); y += tip.length * 16;
  pos.rows = {};
  for (const c of CHECKS) {
    const det = bad[c] ? wrap(bad[c], 300) : [], h = 36 + (det.length ? 2 + det.length * 20 : 0) + 1;
    pos.rows[c] = [16, y, 351, h];
    s += mark(y, bad[c] ? "bad" : "ok") + text(50, y + 23, c, { size: 14, weight: 500, fill: C.strong }) +
      (det.length ? para(50, y + 44, det, { size: 12, fill: C.text, lh: 20 }) : "") + line(16, y + h - 0.5, 367, y + h - 0.5, { stroke: C.line });
    y += h + 2;
  }
  y += -2 + 12;
  pos.salin = [16, y, 351, 36]; pos.wa = [16, y + 44, 351, 36]; pos.panduan = [16, y + 88, 351, 36];
  s += nkBtn(16, y, "Salin laporan", { variant: "ghost", w: 351, size: 14, icon: "copy" }) + nkBtn(16, y + 44, "Kirim lewat WhatsApp", { variant: "quiet", w: 351, size: 14, icon: "message-circle" }) +
    nkBtn(16, y + 88, "Panduan", { variant: "quiet", w: 351, size: 14, icon: "book-open" });
  y += 124; pos.hint = [16, y + 4, 351, 16];
  s += text(16, y + 16, "Tanpa data undangan.", { size: 12, fill: C.faint }); y += 20 + 24;
  pos.cspH3 = y; s += nkH3(16, y + 12, "Izin domain (CSP)"); y += 24;
  pos.csp = [];
  if (!csp.length) { s += nkNote(16, y, 351, ["Tidak butuh izin tambahan."]); y += 38 + 12; }
  else {
    csp.forEach((r) => { const li = cspLi(r, y); pos.csp.push([16, y, 351, li.h]); s += li.svg; y += li.h + 6; });
    y += -6 + 10;
    const failed = csp.some((r) => r.st === "failed");
    pos.periksa = [16, y, 351, 36]; pos.salinCsp = [16, y + 44, 351, 36];
    s += nkBtn(16, y, "Periksa ulang", { variant: "ghost", w: 351, size: 14 }) + nkBtn(16, y + 44, failed ? "Salin domain kurang" : "Salin daftar domain", { variant: "quiet", w: 351, size: 14, icon: "copy" });
    y += 80; pos.cspMsg = [16, y + 4, 351, 16]; if (o.cspMsg) y += 20;
  }
  y += 12; pos.details = [16, y, 351, 32];
  s += text(20, y + 20, o.open ? "▾" : "▸", { size: 12, fill: C.action }) + text(34, y + 20, "Lihat isi laporan", { size: 12, fill: C.action }); y += 32;
  if (o.open) {
    const lines = report(bad, csp.map((r) => ({ d: r.d, o: r.o, st: r.st }))).flatMap((l) => wrapMono(l, 45));
    const h = 20 + lines.length * 18;
    pos.pre = [16, y + 6, 351, h];
    s += rect(16, y + 6, 351, h, { r: 4, fill: C.mutedBg }) + lines.map((l, i) => text(26, y + 6 + 23 + i * 18, l, { size: 12, mono: true, fill: l.startsWith("[X]") ? C.warnStrong : C.text })).join("");
    y += 6 + h;
  }
  return { svg: s, pos, end: y + 16 };
}
// Dialog chrome: static white sheet, and a cover drawn after the scrolling body (Scalev bars, dialog header, below 900).
const dlgSheet = rect(0, 92, 398, 808, { fill: C.white });
const dlgCover = (tab = "NikahKit") => clipped(0, 0, 399, 92, scalevEditor(0, 0, { tab, rail: "Konten" })) + rect(0, 92, 398, 61, { fill: C.white }) +
  text(16, 128, "Bantuan", { size: 16, weight: 700, fill: C.strong }) + iconX("x", 368, 122, 18, C.text) + line(0, 153.5, 398, 153.5, { stroke: C.line }) +
  rect(0, 900, 400, 3000, { fill: BG });
const box = (p, dy = 0) => [p[0], p[1] - dy, p[2], p[3]];
const mid = (p, dy = 0, dx = 0) => [p[0] + p[2] / 2 + dx, p[1] - dy + p[3] / 2];
const RAIL_HELP = [36, 821];
// Guide callout below its target (lib's note() points down from the pill; this one points up).
const calloutUp = (x, y, label, tx, ty) => { const w = tw(label, 14, 600) + 28; return line(x + w / 2, y, tx, ty, { stroke: C.accent, sw: 2 }) + circle(tx, ty, 4, { fill: C.accent }) +
  rect(x, y, w, 32, { r: 16, fill: C.accent }) + text(x + w / 2, y + 21, label, { size: 14, weight: 600, fill: C.white, anchor: "middle" }); };

// ---- Scene 1: Bantuan + Salin laporan ------------------------------------------------------------------------------
const SL_BAD = { "Penyimpanan ucapan dan RSVP": "simpan halaman di Scalev dulu" };
const SL_CSP = [{ o: "https://www.youtube.com", d: "script_src", st: "exists", why: "Musik atau video YouTube" },
  { o: "https://www.youtube.com", d: "frame_src", st: "exists", why: "Musik atau video YouTube" }];
const sl = helpBody({ bad: SL_BAD, csp: SL_CSP }), slOpen = helpBody({ bad: SL_BAD, csp: SL_CSP, open: true });
const SL1 = sl.pos.rows["Penyimpanan ucapan dan RSVP"][1] - 470;
const SL2 = sl.pos.salin[1] - 400 - SL1; // increments: scroll dy is relative
const SL3 = sl.end - 900; // fully scrolled (details closed)
const SL4 = 420;

// ---- Scene 2: Izin domain (CSP) -------------------------------------------------------------------------------------
const ORIGIN = "https://foto.contoh.com";
const IZ_BAD = { "Izin domain di tab Security": `${ORIGIN} (img_src)` };
const IZ_CSP = [{ o: "https://www.youtube.com", d: "script_src", st: "added", why: "Musik atau video YouTube" },
  { o: "https://www.youtube.com", d: "frame_src", st: "exists", why: "Musik atau video YouTube" },
  { o: ORIGIN, d: "img_src", st: "failed", why: "Foto dari luar Media Scalev" }];
const iz = helpBody({ bad: IZ_BAD, csp: IZ_CSP, cspMsg: true });
const IZ1 = Math.min(iz.pos.cspH3 - 200, iz.end - 900);
const IZ_CAM = { x: 0, y: Math.min(iz.pos.cspH3 - IZ1 - 16, 900 - 402), w: 720 }; // CSP section in view
const izWarn = wrap(`Izinkan di tab Security: ${ORIGIN} (img_src).`, 252);
const izWarnH = 20 + izWarn.length * 18;
const [, , , todoH] = iz.pos.csp[2];
const todoBox = box(iz.pos.csp[2], IZ1);
// Scalev Security tab (column names from the guide's Izin domain page; Scalev tutorial).
const SOURCES = ["Connect Sources", "Image Sources", "Media Sources", "Font Sources", "Style Sources", "Script Sources", "Frame Sources"];
const srcY = (i) => 116 + i * 72;
const securityTab = clipped(0, 44, 399, 856, scalevEditor(0, 0, { tab: "Security" })) + rect(0, 93, 398, 807, { fill: C.white }) +
  SOURCES.map((l, i) => text(20, srcY(i) + 14, l, { size: 13, weight: 500, fill: C.strong }) + rect(20.5, srcY(i) + 24.5, 357, 36, { r: 4, fill: C.white, stroke: C.svDivider })).join("");

// ---- Scene 3: pola memperbaiki (AccessGate) -------------------------------------------------------------------------
function gate(lines, o = {}) {
  let s = rect(0, 92, 398, 808, { fill: C.white }) + text(16, 128, "NikahKit", { size: 16, weight: 700, fill: C.strong }) +
    (o.chip ? chip(262, 108, PLAN) : "") + iconX("x", 368, 122, 18, C.text) + line(0, 153.5, 398, 153.5, { stroke: C.line });
  const h = 20 + lines.length * 18, fg = o.warn ? C.warnStrong : C.strong;
  s += rect(16, 169, 351, h, { r: 4, fill: o.warn ? C.warnSoft : C.primarySoft }) + lines.map((l, i) => rich(28, 192 + i * 18, l, { size: 12, fill: fg })).join("");
  return s + (o.buttons ?? "");
}
const chip = (x, y, label, warn) => rect(x + 0.5, y + 0.5, 79, 27, { r: 14, fill: warn ? C.warnSoft : C.white, stroke: warn ? "#fde7c7" : C.field }) +
  icon("circle-user-round", x + 16, y + 14, 14, warn ? C.warn : C.action) + text(x + 27, y + 18, label, { size: 12, weight: 500, fill: warn ? C.warnStrong : C.strong });
const GATE_SERVER = gate([[{ t: "Server NikahKit tidak terjangkau.", w: 700 }, " Periksa"], ["internet, lalu tekan Periksa lagi."]], { warn: true });
const RECHECK = [16, 237, tw("Periksa lagi", 14, 500) + 24, 36];

// ---- Scene 5: masa aktif ---------------------------------------------------------------------------------------------
const PH = { x: 1490, y: 28 }; // guest phone screen 390x844
const renewNote = (lines, err) => {
  const h = Math.max(56, 20 + lines.length * 18), fg = err ? C.danger : C.warnStrong;
  return { h, svg: rect(88, 169, 279, h, { r: 4, fill: err ? C.dangerSoft : C.warnSoft }) + para(100, 169 + h / 2 - (lines.length - 1) * 9 + 4, lines, { size: 12, fill: fg, lh: 18 }) +
    nkBtn(265, 169 + h / 2 - 18, "Perpanjang", { variant: "quiet", w: 90 }) };
};
const RN_WARN = renewNote(["Langganan berakhir 5 hari", "lagi."]);
const RN_ERR = renewNote(["Langganan berakhir. 6 hari", "lagi ucapan, RSVP, dan", "Dashboard berhenti."], true);
const panelWith = (rn, warnChip) => rect(72, 154, 327, 746, { fill: C.white }) + rn.svg + clipped(72, 154, 327, 746, kontenBody(rn.h + 12)) +
  (warnChip ? rect(262, 108, 81, 29, { fill: C.white }) + chip(262, 108, PLAN, true) : "");
const TL = { x: 424, y: 136, w: 280 };
const TL_ROWS = [["Aktif", "Semua fitur jalan", C.ok], ["7 hari terakhir", "Panel mengingatkan", C.changed], ["Tenggang 7 hari", "Fitur masih jalan", C.warn], ["Habis", "RSVP, ucapan, dashboard berhenti", C.danger]];
const tlY = (i) => TL.y + 56 + i * 68;
const timeline = shadow(TL.x, TL.y, TL.w, 330, 10, 2) + rect(TL.x, TL.y, TL.w, 330, { r: 10, fill: C.white }) +
  text(TL.x + 20, TL.y + 32, "Masa aktif paket", { size: 15, weight: 700, fill: C.ink }) + line(TL.x + 30, tlY(0) + 10, TL.x + 30, tlY(3) + 10, { stroke: "#d9dee5", sw: 2 }) +
  TL_ROWS.map(([l, sub, c], i) => circle(TL.x + 30, tlY(i) + 10, 8, { fill: c }) + text(TL.x + 50, tlY(i) + 14, l, { size: 14, weight: 600, fill: C.ink }) +
    text(TL.x + 50, tlY(i) + 33, sub, { size: 12, fill: C.faint })).join("");
const tlRing = (i) => rect(TL.x + 10, tlY(i) - 10, TL.w - 20, 56, { r: 8, stroke: C.accent, sw: 2.5 });
// Guest phone: published invitation, section Ucapan (runtime labels from the template build).
function guestPhone(closed) {
  const x = PH.x, y = PH.y, cx = x + 195;
  let s = shadow(x, y, 390, 844, 0) + rect(x, y, 390, 844, { fill: "#fdf6ee" }) + scallops(x, y);
  s += text(cx, y + 110, "Ucapan", { size: 46, fill: MAROON, anchor: "middle", font: SCRIPT, italic: true });
  const fx = x + 32, fw = 326;
  if (closed) return s + rect(fx, y + 150, fw, 96, { r: 12, fill: C.white, stroke: "#ead8cf" }) + text(cx, y + 205, "Ucapan & RSVP sudah ditutup.", { size: 16, fill: "#333", anchor: "middle", font: SERIF }) + bottomNav(x, y + 762);
  const lab = (yy, l) => text(fx, yy, l, { size: 14, fill: "#333", font: SERIF });
  const fld = (yy, h = 40) => rect(fx + 0.5, yy + 0.5, fw - 1, h, { r: 8, fill: C.white, stroke: "#d8c6bd" });
  s += lab(y + 170, "Nama") + fld(y + 180) + lab(y + 250, "Konfirmasi kehadiran") +
    ["Hadir", "Masih ragu", "Tidak hadir"].map((l, i) => rect(fx + 0.5 + i * 110, y + 260.5, 104, 38, { r: 19, fill: i ? C.white : MAROON, stroke: MAROON }) +
      text(fx + 52 + i * 110, y + 285, l, { size: 13, fill: i ? MAROON : C.white, anchor: "middle", font: SERIF })).join("") +
    lab(y + 330, "Jumlah yang hadir") + fld(y + 340) + text(fx + 14, y + 366, "1 orang", { size: 14, fill: "#333", font: SERIF }) + icon("chevron-down", fx + fw - 18, y + 360, 16, "#333") +
    lab(y + 410, "Ucapan & doa") + fld(y + 420, 96) + rect(fx, y + 532, fw, 44, { r: 22, fill: MAROON }) + text(cx, y + 559, "Kirim", { size: 15, fill: C.white, anchor: "middle", font: SERIF });
  return s + bottomNav(x, y + 762);
}
const GATE_EXP_BTN = [16, 237, tw("Pilih paket", 14, 500) + 24, 36];
const GATE_EXPIRED = gate([[{ t: "Langganan NikahKit sudah habis.", w: 700 }, " Undangan tayang"], ["tetap tampil."]], {
  warn: true, chip: true,
  buttons: nkBtn(16, 237, "Pilih paket", { w: GATE_EXP_BTN[2], size: 14 }) + nkBtn(24 + GATE_EXP_BTN[2], 237, "Periksa lagi", { variant: "quiet", size: 14 })
});
// NikahKit account window (ext/pin.html, editor-akun.png): header, email + Keluar, Paket card, Bisnis Scalev card.
function accountWindow() {
  const x = 500, y = 261, w = 440;
  const lic = wrap("Langganan habis. Undangan tetap tampil, tetapi RSVP dan ucapan berhenti. Pilih paket.", 370, 14);
  const pH = 16 + 16 + 8 + lic.length * 20 + 8 + 36 + 16, bY = y + 92 + pH + 12, h = bY - y + 122 + 16;
  return shadow(x, y, w, h, 8, 3) + rect(x, y, w, h, { r: 8, fill: C.white }) +
    rect(x + 16, y + 16, 32, 32, { r: 7, fill: "#4a9de8" }) + circle(x + 27, y + 32, 6.5, { stroke: C.white, sw: 2.6 }) + circle(x + 37, y + 32, 6.5, { stroke: C.white, sw: 2.6 }) +
    text(x + 58, y + 38, "NikahKit", { size: 16, weight: 700, fill: C.strong }) + iconX("x", x + w - 30, y + 30, 18, C.text) +
    text(x + 16, y + 76, "rina@contoh.com", { size: 12, weight: 700, fill: C.faint }) + text(x + w - 16, y + 76, "Keluar", { size: 12, weight: 500, fill: C.strong, anchor: "end", underline: true }) +
    rect(x + 16.5, y + 92.5, w - 33, pH, { r: 4, fill: C.white, stroke: C.line }) + nkH3(x + 33, y + 92 + 28, "Paket") +
    para(x + 33, y + 92 + 54, lic, { size: 14, fill: C.warnStrong, lh: 20 }) + nkBtn(x + 33, y + 92 + 40 + lic.length * 20 + 8, "Pilih paket", { size: 14 }) +
    rect(x + 16.5, bY + 0.5, w - 33, 121, { r: 4, fill: C.white, stroke: C.line }) + nkH3(x + 33, bY + 28, "Bisnis Scalev") +
    text(x + 33, bY + 54, "Rina WO", { size: 14, fill: C.text }) + nkBtn(x + 33, bY + 70, "Hubungkan ulang", { variant: "quiet", size: 14 });
}

// ---- Scene 4: docs.page (panduan) di Chrome ---------------------------------------------------------------------------
const T = 85; // Chrome content top
const DOC = { ink: "#171717", sub: "#737373", line: "#e5e5e5", head: "#f9f9f9", code: "#f5f5f5" };
const docsHeader = rect(0, T, 1440, 64, { fill: C.white }) + rect(22, T + 18, 20, 20, { r: 5, fill: "#2bace6" }) +
  circle(29, T + 28, 4, { stroke: C.white, sw: 1.8 }) + circle(35, T + 28, 4, { stroke: C.white, sw: 1.8 }) + text(56, T + 34, "Panduan NikahKit", { size: 16, weight: 500, fill: DOC.ink }) +
  rect(1090.5, T + 12.5, 126, 31, { r: 8, fill: C.white, stroke: DOC.line }) + iconX("search", 1109, T + 28, 15, DOC.ink) + text(1125, T + 33, "Search", { size: 14, weight: 500, fill: DOC.ink }) +
  text(1203, T + 33, "⌘K", { size: 12, fill: DOC.sub, anchor: "end" }) + rect(1227, T + 12, 92, 32, { r: 8, fill: C.accent }) + text(1273, T + 33, "WhatsApp", { size: 14, weight: 500, fill: C.white, anchor: "middle" }) +
  circle(1345, T + 28, 9, { fill: DOC.ink }) + text(1367, T + 33, "0", { size: 13, fill: DOC.sub, anchor: "middle" }) + circle(1401, T + 28, 8, { fill: DOC.ink }) + circle(1405, T + 25, 7, { fill: C.white });
const SIDEBAR = [["rocket", "Mulai", ["Selamat datang", "Alur kerja dari nol sampai jualan", "Istilah penting"]],
  ["users", "Gabung dan pasang", ["Pilih paket membership", "Pasang ekstensi NikahKit", "Masuk dan bayar membership", "Hubungkan bisnis Scalev", "Update ekstensi"]],
  ["layout-grid", "Siapkan Scalev", ["Akun dan paket Scalev", "Buat halaman undangan", "Simpan dan terbitkan", "Alamat dan domain sendiri", "Izin domain (tab Security)", "Terima pembayaran klien", "Tutorial resmi Scalev pilihan"]]];
const sidebar = (() => {
  let s = "", y = T + 120;
  SIDEBAR.forEach(([ic, h, items], g) => {
    if (g) { s += line(16, y - 26, 248, y - 26, { stroke: DOC.line }); y += 6; }
    s += iconX(ic, 32, y - 4, 14, DOC.ink) + text(50, y, h, { size: 13, weight: 500, fill: DOC.ink }); y += 39;
    items.forEach((it) => { s += text(24, y, it, { size: 14, fill: "#525252" }); y += 40; });
    y += 25;
  });
  return clipped(0, T + 64, 260, 900, s);
})();
const TOC = ["Langkah", "Panel NikahKit: akses", "Panel NikahKit: catatan di atas ...", "Editor: template dan undangan...", "Editor: Bagikan, PIN, dan salin", "Editor: isian Konten, foto, dan ...",
  "Editor: Profil merek dan Market...", "Editor: Pesanan masuk", "Bantuan dan update", "Jendela akun NikahKit", "Buku Tamu (menu Scalev)", "Halaman tamu (undangan)", "Dashboard pasangan",
  "Halaman check-in", "Form pesanan klien", "Kode dalam kurung", "Tanda berhasil", "Kalau ada masalah", "Lanjut"];
const toc = iconX("list", 1193, T + 115, 15, DOC.ink) + text(1210, T + 120, "On this page", { size: 14, weight: 500, fill: DOC.ink }) +
  line(1188.5, T + 139, 1188.5, T + 139 + TOC.length * 29, { stroke: DOC.line }) + TOC.map((t, i) => text(1213, T + 157 + i * 29, t, { size: 14, fill: "#525252" })).join("");
const tocActive = (i) => rect(1187, T + 142 + i * 29, 2.5, 22, { fill: C.accent }) + rect(1205, T + 142 + i * 29, 230, 22, { fill: C.white }) + text(1213, T + 157 + i * 29, TOC[i], { size: 14, fill: C.accent });
const TOP = T + 64; // first content y under the docs header
const docClip = (...k) => clipped(290, TOP, 860, 985 - TOP, ...k);
// Runs whose width must line up with a highlight are drawn at an exact advance (textLength), so the search highlight
// and inline code chip fit their text in any viewer font.
const adv = (s, size, o = {}) => s.length * size * (o.mono ? 0.6 : (o.weight ?? 400) >= 600 ? 0.53 : 0.5);
const run = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.size ?? 14}" fill="${o.fill ?? DOC.ink}"${o.weight ? ` font-weight="${o.weight}"` : ""}${o.mono ? ` font-family="'Roboto Mono',ui-monospace,Menlo,monospace"` : ""} textLength="${adv(s, o.size ?? 14, o)}" lengthAdjust="spacingAndGlyphs" xml:space="preserve">${esc(s)}</text>`;
const codeChip = (x, y, s) => { const w = adv(s, 14, { mono: true }) + 10; return { w, svg: rect(x, y - 16, w, 22, { r: 4, fill: DOC.code, stroke: DOC.line }) + run(x + 5, y, s, { mono: true }) }; };
const pageTop = docClip(
  text(320, T + 138, "Kamus pesan galat", { size: 36, weight: 500, fill: DOC.ink }),
  rect(952.5, T + 109.5, 151, 31, { r: 8, fill: C.white, stroke: DOC.line }) + icon("copy", 970, T + 125, 14, DOC.ink) + text(986, T + 130, "Copy page", { size: 14, weight: 500, fill: DOC.ink }) +
    line(1068.5, T + 110, 1068.5, T + 140, { stroke: DOC.line }) + icon("chevron-down", 1086, T + 125, 14, DOC.ink),
  para(320, T + 173, ["Semua pesan yang bisa muncul di NikahKit, Buku Tamu, Dashboard pasangan, halaman tamu,", "halaman check-in, dan form pesanan klien, lengkap dengan artinya dan yang harus dilakukan."], { size: 18, fill: DOC.sub, lh: 28 }),
  para(320, T + 261, ["Lihat pesan aneh di layar? Cari kalimatnya di halaman ini. Setiap tabel berisi pesan persis seperti di layar,", "artinya, dan langkah yang harus kamu lakukan."], { size: 16, fill: DOC.ink, lh: 28 }),
  rect(320.5, T + 313.5, 783, 235, { r: 12, fill: "#f0fafe", stroke: "#b9e4f6" }) + circle(345, T + 336, 7, { fill: DOC.ink }) + text(345, T + 340, "i", { size: 10, weight: 700, fill: C.white, anchor: "middle" }) +
    text(361, T + 341, "Information", { size: 14, weight: 500, fill: DOC.ink }) + text(361, T + 367, "Yang kamu perlukan", { size: 14, weight: 700, fill: DOC.ink }) +
    [[406, "Kalimat pesan yang kamu lihat. Cukup beberapa kata awalnya."], [442, "Tahu di layar mana pesan itu muncul: panel NikahKit di editor Scalev, jendela akun NikahKit, Buku Tamu,"],
      [470, "Dashboard pasangan, halaman tamu, atau halaman check-in.", true], [506, "Untuk gejala tanpa pesan, pakai Masalah umum."]]
      .map(([y, t, cont]) => (cont ? "" : circle(372, T + y - 5, 2.2, { fill: "#525252" })) + text(389, T + y, t, { size: 14, fill: "#404040" })).join(""),
  rect(320, T + 565, 784, 520, { r: 12, fill: "#f8f9fa" }) + rect(352.5, T + 584.5, 719, 470, { r: 8, fill: C.white, stroke: DOC.line }) + rect(353, T + 585, 718, 28, { r: 8, fill: "#e8eaed" }) +
    rect(372, T + 640, 220, 14, { r: 7, fill: "#e5e7eb" }) + rect(372, T + 668, 300, 9, { r: 4.5, fill: "#eceef1" }) + rect(372, T + 710, 680, 30, { fill: DOC.head })
);
// "Langkah" (Steps). Match 1 = the code chip "Sesi berakhir" in step 3.
const STEPS = [["Catat pesannya", [["Salin atau tulis kalimat pesan persis seperti di layar, termasuk titiknya. Kalau ada kode dalam"], ["kurung, misalnya ", { code: "Gagal (rate_limited)." }, ", catat kodenya juga."]]],
  ["Tekan Ctrl+F di halaman ini", [["Di Mac tekan Cmd+F. Kotak cari muncul di kanan atas Chrome."]]],
  ["Ketik beberapa kata awal pesan", [["Misalnya ", { code: "Sesi berakhir", match: true }, ". Chrome menandai kata yang cocok dengan warna kuning. Tekan Enter untuk"], ["lompat ke hasil berikutnya."]]],
  ["Baca kolom Artinya", [["Kolom ini menjelaskan penyebab pesan itu muncul."]]],
  ["Kerjakan kolom Yang harus dilakukan", [["Ikuti langkahnya, lalu ulangi tindakan yang tadi gagal. Kalau di editor, klik Periksa lagi bila"], ["tombolnya ada."]]]];
const MATCH = {};
const pageSteps = (() => {
  let s = text(320, TOP + 58, "Langkah", { size: 28, weight: 500, fill: DOC.ink }), y = TOP + 112;
  const y0 = y;
  STEPS.forEach(([title, body], i) => {
    s += circle(336, y - 6, 14, { fill: "#f5f5f5", stroke: DOC.line }) + text(336, y - 1, String(i + 1), { size: 13, weight: 600, fill: DOC.ink, anchor: "middle" }) +
      text(366, y, title, { size: 16, weight: 600, fill: DOC.ink });
    y += 32;
    body.forEach((ln) => {
      let x = 366;
      ln.forEach((p) => {
        if (typeof p === "string") { s += ln.length > 1 ? run(x, y, p, { size: 16, fill: "#404040" }) : text(x, y, p, { size: 16, fill: "#404040" }); x += adv(p, 16); }
        else { const c = codeChip(x + 2, y, p.code); if (p.match) MATCH.one = [x + 2, y - 16, c.w, 22]; s += c.svg; x += c.w + 4; }
      });
      y += 28;
    });
    y += 26;
  });
  s += line(336, y0 + 10, 336, y - 72, { stroke: DOC.line }) +
    rect(320.5, y + 0.5, 783, 70, { r: 12, fill: "#f0fafe", stroke: "#b9e4f6" }) + circle(345, y + 24, 7, { fill: DOC.ink }) + text(345, y + 28, "i", { size: 10, weight: 700, fill: C.white, anchor: "middle" }) +
    text(361, y + 29, "Information", { size: 14, weight: 500, fill: DOC.ink }) + text(361, y + 54, "Bagian di dalam kurung, misalnya (nama) atau N, di layar diganti nama atau angka yang sebenarnya.", { size: 14, fill: "#404040" }) +
    text(320, y + 140, "Panel NikahKit: akses", { size: 28, weight: 500, fill: DOC.ink }) + text(320, y + 184, "Muncul di panel NikahKit saat editor dibuka, menggantikan rel menu.", { size: 16, fill: "#404040" });
  return docClip(s);
})();
// "Jendela akun NikahKit" table. Match 2 = "Sesi berakhir" in row 3.
const COLX = [337, 637, 887];
const ROWS = [
  [[[{ t: "Sudah masuk. Kembali ke editor", w: 700 }], [{ t: "Scalev.", w: 700 }]], [["Login berhasil."]], [["Tutup jendela, klik ", { t: "Periksa lagi", w: 700 }], ["di panel."]]],
  [[[{ t: "Akun dinonaktifkan. Hubungi tim", w: 700 }], [{ t: "Nikahin.", w: 700 }]], [["Akun dinonaktifkan."]], [[{ t: "Hubungi tim Nikahin", u: true }, "."]]],
  [[[{ t: "Sesi berakhir. Masuk lagi.", w: 700 }]], [["Login habis."]], [["Klik ", { t: "Masuk dengan Google", w: 700 }], ["lagi."]]],
  [[[{ t: "Login dibatalkan.", w: 700 }]], [["Jendela Google ditutup."]], [["Klik ", { t: "Masuk dengan Google", w: 700 }], ["lagi."]]],
  [[[{ t: "Login Google belum diatur.", w: 700 }]], [["Login Google belum aktif di"], ["server."]], [["Hubungi tim Nikahin."]]],
  [[[{ t: "Login sudah dipakai. Masuk lagi. /", w: 700 }], [{ t: "Login kedaluwarsa. Masuk lagi.", w: 700 }]], [["Proses login terputus atau"], ["terlalu lama."]], [["Klik ", { t: "Masuk dengan Google", w: 700 }], ["lagi."]]]
];
const CELL = {};
const pageTable = (() => {
  let s = text(320, TOP + 58, "Jendela akun NikahKit", { size: 28, weight: 500, fill: DOC.ink }) +
    rich(320, TOP + 106, ["Jendela kecil yang terbuka dari chip akun, ", { t: "Masuk dengan Google", w: 700 }, ", ", { t: "Pilih paket", w: 700 }, ", atau ", { t: "Kelola PIN", w: 700 }], { size: 16, fill: "#404040" }) +
    rich(320, TOP + 134, [{ t: "dashboard", w: 700 }, "."], { size: 16, fill: "#404040" });
  const ty = TOP + 166;
  let y = ty + 44, rows = "";
  ROWS.forEach((r, i) => {
    const n = Math.max(...r.map((c) => c.length)), h = 25 + n * 20;
    r.forEach((cell, j) => cell.forEach((ln, k) => (rows += i === 2 && j === 0 ? run(COLX[0], y + 30, ln[0].t, { weight: 700 }) : rich(COLX[j], y + 30 + k * 20, ln, { size: 14, fill: j ? "#404040" : DOC.ink }))));
    if (i === 2) { CELL.row = [320, y, 784, h]; CELL.arti = [COLX[1] - 8, y + 12, 120, 26]; CELL.do = [COLX[2] - 8, y + 12, 210, 46]; MATCH.two = [COLX[0] - 1, y + 14, adv("Sesi berakhir", 14, { weight: 700 }) + 2, 21]; }
    y += h;
    if (i < ROWS.length - 1) rows += line(320, y - 0.5, 1104, y - 0.5, { stroke: DOC.line });
  });
  s += rect(320.5, ty + 0.5, 783, y - ty, { r: 12, fill: C.white, stroke: DOC.line }) + rect(321, ty + 1, 782, 43, { r: 11, fill: DOC.head }) + rect(321, ty + 30, 782, 14, { fill: DOC.head }) +
    line(320, ty + 44.5, 1104, ty + 44.5, { stroke: DOC.line }) + ["Pesan", "Artinya", "Yang harus dilakukan"].map((h, j) => text(COLX[j], ty + 28, h, { size: 14, weight: 500, fill: DOC.ink })).join("") + rows;
  return docClip(s);
})();
// Chrome find bar (top right, under the toolbar) and highlights (active match orange, others yellow).
const FB = { x: 1036, y: T + 4, w: 380, h: 48 };
const findBar = shadow(FB.x, FB.y, FB.w, FB.h, 8, 2) + rect(FB.x, FB.y, FB.w, FB.h, { r: 8, fill: C.white }) + line(FB.x + 266.5, FB.y + 12, FB.x + 266.5, FB.y + 36, { stroke: "#dadce0" }) +
  icon("chevron-up", FB.x + 290, FB.y + 24, 18, C.crIcon) + icon("chevron-down", FB.x + 320, FB.y + 24, 18, C.crIcon) + iconX("x", FB.x + 354, FB.y + 24, 16, C.crIcon);
const findCount = (s) => rect(FB.x + 200, FB.y + 10, 60, 28, { fill: C.white }) + text(FB.x + 256, FB.y + 29, s, { size: 13, fill: C.crSub, anchor: "end" });
// Highlight under the text (multiply keeps the glyphs dark, as Chrome paints matches).
const hl = (b, active) => `<rect x="${b[0]}" y="${b[1]}" width="${b[2]}" height="${b[3]}" rx="2" fill="${active ? "#ff9632" : "#ffff00"}" style="mix-blend-mode:multiply"/>`;
const docsChrome = chrome(0, 0, 1440, 985, { tabs: [{ title: "Kamus pesan galat", active: true, fav: (cx, cy) => rect(cx - 7, cy - 7, 14, 14, { r: 3.5, fill: "#2bace6" }) }], url: "docs.page/hasyaapp/nikahkit-panduan/bantuan/pesan-galat" });

// ---- Scene 6: WhatsApp ----------------------------------------------------------------------------------------------
const KW = helpBody({ bad: SL_BAD, csp: SL_CSP });
const KW_S = KW.pos.wa[1] - 470;
const WA = { green: "#00a884", bg: "#efeae2", bar: "#f0f2f5", ink: "#111b21", sub: "#667781", out: "#d9fdd3" };
const ADMIN = "+62 821-7527-4118";
const CMP = { x: 556, y: 765, w: 820, h: 200 }; // composer input (9 lines)
const MSG = ["Halo Nikahin, NikahKit saya bermasalah.", "", `Laporan NikahKit ${VERSI}`, "Waktu: 2026-10-14T03:12:45.000Z", "Halaman: /pages/365671", "Build Scalev: e5cbe30-37178432877-1",
  "Browser: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)", "Chrome/141.0.0.0 Safari/537.36", "",
  ...CHECKS.map((c) => (SL_BAD[c] ? `[X] ${c}: ${SL_BAD[c]}` : `[OK] ${c}`)), "", "Izin domain:", "- script_src https://www.youtube.com: exists", "- frame_src https://www.youtube.com: exists", ""];
const TYPED = "Saya klik Simpan & Terbitkan, lalu tertahan. Halaman: app.scalev.com/pages/365671";
const CMP_SCROLL = (MSG.length + 1 - 9) * 20;
const waPage = (() => {
  let s = rect(0, T, 1440, 900, { fill: C.white }) + rect(0, T, 64, 900, { fill: WA.bar }) + line(64.5, T, 64.5, 985, { stroke: "#e9edef" }) +
    [0, 1, 2, 3].map((i) => circle(32, T + 34 + i * 52, 11, { stroke: "#54656f", sw: 1.6 })).join("") + circle(32, 985 - 34, 14, { fill: "#dfe5e7" }) +
    text(84, T + 44, "WhatsApp", { size: 22, weight: 700, fill: WA.green }) + rect(80, T + 66, 374, 36, { r: 18, fill: WA.bar }) + iconX("search", 102, T + 84, 16, "#54656f");
  for (let k = 0; k < 9; k++) {
    const ry = T + 118 + k * 72, on = k === 0;
    if (on) s += rect(72, ry, 390, 72, { r: 10, fill: WA.bar });
    s += circle(108, ry + 36, 24, { fill: "#dfe5e7" }) + (on ? text(144, ry + 32, ADMIN, { size: 16, fill: WA.ink }) + rect(144, ry + 44, 210, 9, { r: 4.5, fill: "#e9edef" })
      : rect(144, ry + 22, 120 + ((k * 37) % 90), 11, { r: 5.5, fill: "#e9edef" }) + rect(144, ry + 44, 200 + ((k * 53) % 60), 9, { r: 4.5, fill: "#f0f2f5" }));
  }
  s += line(470.5, T, 470.5, 985, { stroke: "#e9edef" }) + rect(471, T, 969, 60, { fill: WA.bar }) + circle(504, T + 30, 20, { fill: "#dfe5e7" }) +
    text(536, T + 36, ADMIN, { size: 16, fill: WA.ink }) + iconX("search", 1360, T + 30, 18, "#54656f") + iconX("more-vertical", 1404, T + 30, 18, "#54656f");
  s += rect(471, T + 60, 969, 985 - T - 60, { fill: WA.bg }) + rect(471, CMP.y - 10, 969, 985 - CMP.y + 10, { fill: WA.bar }) +
    icon("plus", 506, CMP.y + CMP.h - 21, 22, "#54656f") + rect(CMP.x, CMP.y, CMP.w, CMP.h, { r: 8, fill: C.white }) +
    circle(1407, CMP.y + CMP.h - 21, 21, { fill: WA.green }) + icon("send", 1406, CMP.y + CMP.h - 21, 18, C.white);
  return s;
})();
const cmpText = para(CMP.x + 14, CMP.y + 25, MSG.map((l) => l || "\u00a0"), { size: 14, fill: WA.ink, lh: 20 });
const cmpTypedY = CMP.y + 25 + MSG.length * 20 - CMP_SCROLL;
const waCover = rect(471, T + 60, 969, CMP.y - 10 - T - 60, { fill: WA.bg }) + rect(471, CMP.y - 10, 969, 10, { fill: WA.bar }) + rect(CMP.x, CMP.y, CMP.w, 4, { fill: C.white }) +
  rect(CMP.x, CMP.y + CMP.h - 4, CMP.w, 4, { fill: C.white }) + rect(471, CMP.y + CMP.h, 969, 985 - CMP.y - CMP.h, { fill: WA.bar }) + rect(0, 985, 1440, 2000, { fill: BG });
const SEND = [1407, CMP.y + CMP.h - 21];
const bubbleLines = [MSG[0], "", MSG[2], MSG[3], MSG[4], MSG[5], "...", "[X] Penyimpanan ucapan dan RSVP: simpan halaman di Scalev dulu", "...", TYPED];
const sentBubble = (() => {
  const w = 640, h = 24 + bubbleLines.length * 20 + 14, x = 1440 - 60 - w, y = 985 - 74 - 16 - h;
  return rect(x, y, w, h, { r: 8, fill: WA.out }) + para(x + 12, y + 26, bubbleLines.map((l) => l || "\u00a0"), { size: 14, fill: WA.ink, lh: 20 }) +
    text(x + w - 40, y + h - 10, "10.12", { size: 11, fill: WA.sub, anchor: "end" }) + iconX("check", x + w - 26, y + h - 14, 13, "#53bdeb", 2.2) + iconX("check", x + w - 20, y + h - 14, 13, "#53bdeb", 2.2);
})();
const cmpEmpty = rect(471, CMP.y - 10, 969, 985 - CMP.y + 10, { fill: WA.bg }) + rect(471, 985 - 74, 969, 74, { fill: WA.bar }) + icon("plus", 506, 985 - 37, 22, "#54656f") +
  rect(CMP.x, 985 - 59, CMP.w, 44, { r: 8, fill: C.white }) + circle(1407, 985 - 37, 21, { fill: "#e9edef" }) + icon("send", 1406, 985 - 37, 18, "#8696a0");

export const scenes = {
  "bantuan-salin-laporan": {
    title: "Membuka Bantuan dan menyalin laporan",
    world: { w: 1440, h: 900 },
    base: [editorKonten()],
    els: {
      sheet: { svg: dlgSheet, enter: "fade", delay: 1.25 },
      body: { svg: sl.svg, enter: "fade", delay: 1.25 },
      body2: { svg: tr(0, -SL3, rect(0, 153 + SL3, 398, 4000, { fill: C.white }), slOpen.svg), enter: "fade", delay: 1.5 },
      copied: { svg: rect(16, sl.pos.hint[1] - SL2 - SL1 - 2, 300, 20, { fill: C.white }) + text(16, sl.pos.hint[1] - SL2 - SL1 + 12, "Tersalin.", { size: 12, fill: C.faint }), enter: "fade", delay: 1.55 },
      salin: { svg: nkBtn(16, sl.pos.salin[1] - SL1 - SL2, "Salin laporan", { variant: "ghost", w: 351, size: 14, icon: "copy" }), enter: "fade", delay: 1.2 },
      cover: { svg: dlgCover(), enter: "fade", delay: 1.25 },
      ringStatus: { svg: ring(...sl.pos.status), enter: "fade", delay: 0.7 },
      ringBad: { svg: ring(...box(sl.pos.rows["Penyimpanan ucapan dan RSVP"], SL1), { r: 6 }), enter: "fade", delay: 1.25 },
      ringCopied: { svg: ring(12, sl.pos.hint[1] - SL1 - SL2 - 1, 64, 18, { r: 6 }), enter: "fade", delay: 1.7 }
    },
    steps: [
      { caption: "Di editor Scalev, klik Bantuan di bagian bawah rel NikahKit.", cam: "all", at: RAIL_HELP, click: true, show: ["sheet", "body", "cover"] },
      { caption: "Kotak status menulis 1 perlu perhatian. Cek update ada di atasnya.", cam: { x: 0, y: 140, w: 720 }, show: ["ringStatus"] },
      { caption: "Gulir daftar cek. Tanda ! bermasalah, penyebabnya di bawah namanya.", hide: ["ringStatus"], scroll: { id: "body", dy: SL1 }, cam: { x: 0, y: 250, w: 720 }, show: ["ringBad"], dur: 3.6 },
      { caption: "Gulir lagi, lalu klik Salin laporan. Tulisan kecil berubah: Tersalin.", hide: ["ringBad"], scroll: { id: "body", dy: SL2 }, at: mid(sl.pos.salin, SL1 + SL2), click: true, press: "salin", show: ["salin", "copied", "ringCopied"], dur: 3.8 },
      { caption: "Mau lihat isinya? Gulir ke paling bawah, klik Lihat isi laporan.", hide: ["ringCopied", "salin", "copied"], scroll: { id: "body", dy: SL3 - SL1 - SL2 }, cam: { x: 0, y: 492, w: 720 }, at: [90, sl.pos.details[1] - SL3 + 16], click: true, show: ["body2"], dur: 3.8 },
      { caption: "Isinya hanya data teknis: versi, waktu, halaman, browser, daftar cek.", scroll: { id: "body2", dy: SL4 }, cam: { x: 0, y: 330, w: 720 }, dur: 4.2 }
    ]
  },

  "bantuan-izin-domain": {
    title: "Memperbaiki Izin domain (CSP) dari Bantuan",
    world: { w: 1440, h: 900 },
    base: [editorKonten({ dy: izWarnH + 12, top: nkNote(88, 169, 279, izWarn, { tone: "warn" }) })],
    els: {
      ringWarn: { svg: ring(88, 169, 279, izWarnH, { r: 6 }), enter: "fade", delay: 0.4 },
      sheet: { svg: dlgSheet, enter: "fade", delay: 1.25 },
      body: { svg: iz.svg, enter: "fade", delay: 1.25 },
      salinCsp: { svg: nkBtn(16, iz.pos.salinCsp[1] - IZ1, "Salin domain kurang", { variant: "quiet", w: 351, size: 14, icon: "copy" }), enter: "fade", delay: 1.25 },
      periksa: { svg: nkBtn(16, iz.pos.periksa[1] - IZ1, "Periksa ulang", { variant: "ghost", w: 351, size: 14 }), enter: "fade", delay: 1.25 },
      copied: { svg: text(16, iz.pos.cspMsg[1] - IZ1 + 12, "Tersalin. Tempel di tab Security.", { size: 12, fill: C.faint }), enter: "fade", delay: 1.5 },
      fixed: { svg: cspLi({ ...IZ_CSP[2], st: "exists" }, todoBox[1]).svg +
        rect(17, iz.pos.salinCsp[1] - IZ1 + 1, 349, 34, { r: 3, fill: C.white }) + nkBtn(16, iz.pos.salinCsp[1] - IZ1, "Salin daftar domain", { variant: "quiet", w: 351, size: 14, icon: "copy" }) +
        rect(16, iz.pos.cspMsg[1] - IZ1 - 2, 300, 20, { fill: C.white }) + text(16, iz.pos.cspMsg[1] - IZ1 + 12, "Diperiksa ulang.", { size: 12, fill: C.faint }), enter: "fade", delay: 1.5 },
      cover: { svg: dlgCover(), enter: "fade", delay: 1.25 },
      ringTodo: { svg: ring(...todoBox, { r: 6 }), enter: "fade", delay: 1.3 },
      sec: { svg: securityTab, enter: "fade", delay: 1.2 },
      pasted: { svg: rect(20, srcY(1) + 24, 358, 37, { r: 4, fill: C.white, stroke: C.primary, sw: 2 }) + text(32, srcY(1) + 48, ORIGIN, { size: 14, fill: C.strong }), enter: "fade", delay: 1.4 },
      ringFixed: { svg: ring(...todoBox, { r: 6, color: C.ok }), enter: "fade", delay: 1.7 }
    },
    steps: [
      { caption: "Panel menulis Izinkan di tab Security: ada domain yang belum diizinkan.", cam: { x: 0, y: 92, w: 720 }, show: ["ringWarn"] },
      { caption: "Klik Bantuan di bagian bawah rel NikahKit.", hide: ["ringWarn"], cam: { x: 0, y: 470, w: 760 }, at: RAIL_HELP, click: true, show: ["sheet", "body", "cover"] },
      { caption: "Gulir ke Izin domain (CSP). Perlu ditambah manual: izinkan sendiri.", scroll: { id: "body", dy: IZ1 }, cam: IZ_CAM, show: ["ringTodo", "salinCsp", "periksa"], dur: 3.8 },
      { caption: "Klik Salin domain kurang. Muncul Tersalin. Tempel di tab Security.", hide: ["ringTodo"], at: mid(iz.pos.salinCsp, IZ1), click: true, press: "salinCsp", show: ["copied"], dur: 3.6 },
      { caption: "Buka tab Security di deretan tab editor Scalev.", cam: { x: 0, y: 0, w: 720 }, at: ED.tab.Security, click: true, show: ["sec"] },
      { caption: "Klik kolom Image Sources (untuk img_src), tempel domainnya, lalu Simpan.", at: [190, srcY(1) + 42], click: true, show: ["pasted"], dur: 3.6 },
      { caption: "Buka lagi Bantuan, klik Periksa ulang. Status jadi Sudah diizinkan.", hide: ["sec", "pasted", "copied"], cam: IZ_CAM, at: mid(iz.pos.periksa, IZ1), click: true, press: "periksa", show: ["fixed", "ringFixed"], dur: 4 }
    ]
  },

  "bantuan-cek-gejala": {
    title: "Pola memperbaiki masalah: baca pesan, perbaiki, periksa lagi",
    world: { w: 1440, h: 900 },
    base: [editorKonten()],
    els: {
      gate: GATE_SERVER,
      recheck: nkBtn(RECHECK[0], RECHECK[1], "Periksa lagi", { variant: "quiet", w: RECHECK[2], size: 14 }),
      ringMsg: { svg: ring(16, 169, 351, 56, { r: 6 }), enter: "fade", delay: 0.5 },
      fix: { svg: calloutUp(130, 300, "Cek Wi-Fi atau data seluler dulu", 120, 214), delay: 0.4 },
      checking: { svg: gate([[{ t: "Memeriksa akses...", w: 700 }]]), enter: "fade", delay: 1.3 },
      ok: { svg: panelKonten(), enter: "fade", delay: 0.6 },
      ringRail: { svg: ring(0, 104, 71, 330, { r: 6 }), enter: "fade", delay: 1.1 }
    },
    steps: [
      { caption: "Panel NikahKit menampilkan pesan, bukan rel menu seperti biasa.", cam: "all" },
      { caption: "Kalimat tebal adalah gejalanya. Kalimat sesudahnya: cara memperbaikinya.", cam: { x: 0, y: 92, w: 640 }, show: ["ringMsg"], dur: 3.6 },
      { caption: "Kerjakan perbaikannya dulu. Contoh ini: pastikan internet tersambung.", hide: ["ringMsg"], show: ["fix"], dur: 3.6 },
      { caption: "Lalu klik Periksa lagi. Panel menulis Memeriksa akses... sebentar.", hide: ["fix"], at: mid(RECHECK), click: true, press: "recheck", show: ["checking"] },
      { caption: "Berhasil bila rel menu NikahKit tampil lagi. Masih gagal? Kirim laporan.", hide: ["gate", "recheck", "checking"], cam: { x: -12, y: 92, w: 760 }, show: ["ok", "ringRail"], dur: 3.8 }
    ]
  },

  "bantuan-cari-galat": {
    title: "Mencari arti pesan galat di panduan",
    world: { w: 1440, h: 985 },
    base: [docsChrome, docsHeader, sidebar, toc],
    els: {
      tocA: tocActive(0),
      top: pageTop,
      steps: { svg: rect(290, TOP, 860, 985 - TOP, { fill: C.white }) + pageSteps + hl([MATCH.one[0] + 3, MATCH.one[1] + 1, MATCH.one[2] - 6, 20], true), enter: "fade", delay: 1.45 },
      table: { svg: rect(290, TOP, 860, 985 - TOP, { fill: C.white }) + pageTable + hl(MATCH.two, true) + tocActive(9), enter: "fade", delay: 0.5 },
      find: { svg: findBar, enter: "pop", origin: [FB.x + FB.w, FB.y] },
      query: text(FB.x + 18, FB.y + 29, "Sesi berakhir", { size: 14, fill: C.crText }),
      n1: { svg: findCount("1/2"), enter: "fade", delay: 1.4 },
      n2: { svg: findCount("2/2"), enter: "fade", delay: 0.5 },
      ringArti: { svg: ring(...CELL.arti, { r: 6 }), enter: "fade", delay: 0.7 },
      ringDo: { svg: ring(...CELL.do, { r: 6 }), enter: "fade", delay: 0.5 }
    },
    steps: [
      { caption: "Buka halaman Pesan galat di panduan. Siapkan kalimat pesannya.", cam: "all", dur: 3 },
      { caption: "Tekan Ctrl+F (Mac: Cmd+F). Kotak cari muncul di kanan atas Chrome.", cam: { x: 760, y: 40, w: 680 }, show: ["find"] },
      { caption: "Ketik beberapa kata awal, misalnya Sesi berakhir. Chrome lompat ke hasilnya.", cam: { x: 300, y: 50, w: 1140 }, type: [{ id: "query", n: 13, box: [FB.x + 16, FB.y + 12, tw("Sesi berakhir", 14) + 6, 24] }], show: ["n1", "steps"], dur: 3.8 },
      { caption: "Tekan Enter untuk lompat ke hasil berikutnya: baris di tabel pesan.", hide: ["n1", "tocA"], show: ["n2", "table"], dur: 3.4 },
      { caption: "Baca kolom Artinya. Di sini: Login habis.", cam: { x: 320, y: 280, w: 800 }, show: ["ringArti"] },
      { caption: "Kerjakan kolom Yang harus dilakukan: klik Masuk dengan Google lagi.", hide: ["ringArti"], show: ["ringDo"], dur: 3.8 }
    ]
  },

  "bantuan-masa-aktif": {
    title: "Apa yang terjadi saat masa aktif habis",
    cursorStart: [1240, 640],
    world: { w: 1900, h: 900 },
    base: [editorKonten(), timeline, guestPhone(false)],
    els: {
      h0: { svg: tlRing(0), enter: "fade" },
      warn: { svg: panelWith(RN_WARN, true), enter: "fade", delay: 0.5 }, h1: { svg: tlRing(1), enter: "fade", delay: 0.5 },
      err: { svg: panelWith(RN_ERR, true), enter: "fade", delay: 0.5 }, h2: { svg: tlRing(2), enter: "fade", delay: 0.5 },
      expired: { svg: GATE_EXPIRED, enter: "fade", delay: 0.5 }, h3: { svg: tlRing(3), enter: "fade", delay: 0.5 },
      closed: { svg: guestPhone(true), enter: "fade", delay: 0.5 },
      pilih: nkBtn(16, 237, "Pilih paket", { w: GATE_EXP_BTN[2], size: 14 }),
      acct: { svg: dim(0, 0, 1440, 900) + accountWindow(), enter: "pop", origin: [720, 450], delay: 1.35 }
    },
    steps: [
      { caption: "Selama paket aktif, semua fitur jalan: editor, RSVP, ucapan, dashboard.", cam: "all", show: ["h0"], dur: 3.4 },
      { caption: "Mulai 7 hari sebelum berakhir, panel menulis Langganan berakhir N hari lagi.", cam: { x: 0, y: 92, w: 760 }, hide: ["h0"], show: ["warn", "h1"], dur: 3.8 },
      { caption: "Lewat tanggal berakhir: tenggang 7 hari. Fitur masih jalan, segera perpanjang.", hide: ["h1"], show: ["err", "h2"], dur: 3.8 },
      { caption: "Lewat tenggang: RSVP, ucapan, dan Dashboard pasangan berhenti.", hide: ["h2"], show: ["expired", "h3", "closed", "pilih"], dur: 3.6 },
      { caption: "Halaman undangan tetap tampil. Form menulis Ucapan & RSVP sudah ditutup.", cam: { x: 1440, y: 20, w: 520 }, dur: 3.6 },
      { caption: "Klik Pilih paket, lalu bayar. RSVP dan ucapan jalan lagi.", cam: { x: 0, y: 150, w: 1000 }, at: mid(GATE_EXP_BTN), click: true, press: "pilih", show: ["acct"], dur: 4 }
    ]
  },

  "bantuan-kirim-wa": {
    title: "Mengirim laporan ke admin Nikahin lewat WhatsApp",
    world: { w: 1440, h: 985 },
    base: [chrome(0, 0, 1440, 985, { tabs: [{ title: "Undangan Rani & Dimas", active: true, fav: favScalev }], url: "app.scalev.com/pages/365671" }),
      tr(0, T, editorKonten(), dlgSheet, clipped(0, 154, 398, 746, tr(0, -KW_S, KW.svg)), dlgCover())],
    els: {
      waBtn: tr(0, T, nkBtn(16, KW.pos.wa[1] - KW_S, "Kirim lewat WhatsApp", { variant: "quiet", w: 351, size: 14, icon: "message-circle" })),
      ringWa: { svg: tr(0, T, ring(...box(KW.pos.wa, KW_S), { r: 6 })), enter: "fade", delay: 0.3 },
      wa: { svg: chrome(0, 0, 1440, 985, { tabs: [{ title: "Undangan Rani & Dimas", fav: favScalev }, { title: "WhatsApp", active: true, fav: (cx, cy) => circle(cx, cy, 8, { fill: "#25d366" }) }], url: "web.whatsapp.com" }) + waPage, enter: "fade" },
      cmp: { svg: cmpText, enter: "fade" },
      typed: text(CMP.x + 14, cmpTypedY, TYPED, { size: 14, fill: WA.ink }),
      cover: { svg: waCover, enter: "fade" },
      ringC: { svg: ring(CMP.x, CMP.y, CMP.w, 64, { r: 8 }), enter: "fade", delay: 0.6 },
      warnN: { svg: note(640, CMP.y - 110, "Jangan kirim PIN, kode staff, atau data klien", 860, CMP.y + 2), delay: 0.3 },
      empty: { svg: cmpEmpty, enter: "fade", delay: 1.4 },
      sent: { svg: sentBubble, delay: 1.5 }
    },
    steps: [
      { caption: "Di Bantuan, gulir ke tombol laporan, lalu klik Kirim lewat WhatsApp.", cam: { x: 0, y: T + 240, w: 720 }, show: ["ringWa"], at: mid(KW.pos.wa, KW_S - T), click: true, press: "waBtn", dur: 3.4 },
      { caption: "Tab baru terbuka ke chat WhatsApp admin Nikahin.", hide: ["ringWa"], cam: "all", show: ["wa", "cmp", "cover"], dur: 3 },
      { caption: "Pesannya sudah terisi: salam dan laporan teknis. Biarkan, jangan dihapus.", cam: { x: 470, y: 550, w: 780 }, show: ["ringC"], dur: 3.8 },
      { caption: "Klik di bawah laporan, tulis yang kamu klik dan alamat halamannya.", hide: ["ringC"], scroll: { id: "cmp", dy: CMP_SCROLL }, at: [CMP.x + 300, cmpTypedY - 5], click: true, type: [{ id: "typed", n: 24, box: [CMP.x + 12, cmpTypedY - 16, TYPED.length * 7 + 4, 22] }], dur: 4 },
      { caption: "Tambahkan screenshot. Jangan kirim PIN, kode staff, atau data klien.", show: ["warnN"], dur: 3.6 },
      { caption: "Klik kirim. Admin membalas di chat yang sama.", hide: ["warnN", "cmp", "typed"], cam: { x: 470, y: 440, w: 970 }, at: SEND, click: true, show: ["empty", "sent"], dur: 3.8 }
    ]
  }
};
