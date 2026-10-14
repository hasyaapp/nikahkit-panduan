// The NikahKit Bantuan dialog (nikahkit/src/ui/help.jsx), drawn in the editor's panel column (x 0..398), one copy for
// every scene. Owner: 08-bantuan. Layout follows the DOM flow (padding 16, margins from styles.js/base.css); sizes from
// /tmp/ref/editor-bantuan.png + editor-metrics.json.
import { C, rect, text, line, circle, para, group, clipped, iconX, tw, wrap } from "../lib.mjs";
import { nkBtn, nkBadge, nkNote, nkH3 } from "./kit.mjs";

// Check rows in help.jsx order.
const BASE_CHECKS = ["Aplikasi Scalev (Nuxt/Vue)", "Komponen halaman studio", "HTML Mode aktif", "Editor kode (CodeMirror)", "Strip tab sidebar", "Area panel sidebar",
  "Iframe preview", "Inspect preview", "Sinkron device", "Media Scalev", "Izin CSP otomatis"];
export const CHECKS = [...BASE_CHECKS, "Hanya NikahKit yang aktif", "Versi editor Scalev", "Data undangan terbaca", "Klik di pratinjau", "Kode halaman cocok dengan NikahKit",
  "Penyimpanan ucapan dan RSVP", "Izin domain di tab Security", "Penulisan ke editor"];
const DIRECTIVE = { img_src: "Gambar", script_src: "Skrip", frame_src: "Bingkai (iframe)" };
const STATUS = { exists: ["Sudah diizinkan", false], added: ["Ditambahkan otomatis", false], failed: ["Perlu ditambah manual", true] };
// The status badge is kit nkBadge (width tw + 12), right-aligned 10 px inside the row.
const badgeW = (l) => tw(l, 10, 500) + 12;
const cspBadge = (xr, y, st) => { const [l, todo] = STATUS[st]; return nkBadge(xr, y, l, { end: true, ...(todo ? { fill: C.warnSoft, fg: C.warnStrong } : {}) }); };
// One .nk-csp row: grid 1fr auto (origin + purpose left, badge centred right), padding 8px 10px, 16px lines.
const cspLi = (r, y) => {
  const bw = badgeW(STATUS[r.st][0]), why = wrap(`${r.why} · ${DIRECTIVE[r.d]} (${r.d})`, 329 - 8 - bw, 12), h = 36 + why.length * 16;
  return { h, svg: rect(16.5, y + 0.5, 350, h - 1, { r: 4, fill: C.white, stroke: C.line }) + text(27, y + 21, r.o, { size: 12, mono: true, fill: C.strong }) +
    para(27, y + 39, why, { size: 12, fill: C.text, lh: 16 }) + cspBadge(366 - 10, y + h / 2 - 9, r.st) };
};
const glyph = (y, kind) => kind === "ok" ? circle(30, y + 18, 10, { fill: C.okSoft }) + iconX("check", 30, y + 18, 12, C.ok, 2.6)
  : circle(30, y + 18, 10, { fill: C.warnSoft }) + text(30, y + 22.5, "!", { size: 12, weight: 700, fill: C.warnStrong, anchor: "middle" });

// The dialog body at scroll 0 (top y 169). o.bad: { check: detail } (rows with "!"), o.csp: [{ o: origin, d: directive,
// st: exists|added|failed, why }], o.cspMsg: reserve the status line under the CSP buttons.
// Returns { svg, pos, part, end }: pos = each item's box at scroll 0 (version, status, tip, rows[check], salin, wa,
// panduan, hint, cspH3, csp[i], periksa, salinCsp, cspMsg); part = each item's markup (to press a button as its own
// element); end = the body's bottom y.
export function helpBody(o = {}) {
  const bad = o.bad ?? {}, csp = o.csp ?? [], nBad = Object.keys(bad).length, pos = {}, part = {};
  let s = "", y = 169;
  const add = (k, svg) => { part[k] = (part[k] ?? "") + svg; s += svg; };
  pos.version = [16, y, 351, 36];
  add("version", text(16, y + 23, "Versi", { size: 14, fill: C.text }) + nkBtn(270, y, "Cek update", { variant: "quiet", w: 97, size: 14 }));
  y += 36; add("version", text(16, y + 16, "Sudah versi terbaru.", { size: 12, fill: C.faint })); y += 20 + 12;
  const st = wrap(nBad ? `${nBad} perlu perhatian. Muat ulang editor; bila tetap, kirim laporan.` : "Semua berjalan normal.", 327, 12);
  pos.status = [16, y, 351, 20 + st.length * 18];
  add("status", nkNote(16, y, 351, st, { tone: nBad ? "warn" : "info" })); y += 20 + st.length * 18 + 12;
  const tip = wrap('Terbit tertahan "not finished previewing"? Muat ulang editor, lalu tekan Simpan & Terbitkan.', 351, 12);
  pos.tip = [16, y, 351, tip.length * 16 + 4];
  add("tip", para(16, y + 12, tip, { size: 12, fill: C.faint, lh: 16 })); y += tip.length * 16;
  pos.rows = {};
  for (const c of CHECKS) {
    const det = bad[c] ? wrap(bad[c], 300, 12) : [], h = 36 + (det.length ? 2 + det.length * 20 : 0) + 1;
    pos.rows[c] = [16, y, 351, h];
    add(c, glyph(y, bad[c] ? "bad" : "ok") + text(50, y + 23, c, { size: 14, weight: 500, fill: C.strong }) +
      (det.length ? para(50, y + 44, det, { size: 12, fill: C.text, lh: 20 }) : "") + line(16, y + h - 0.5, 367, y + h - 0.5, { stroke: C.line }));
    y += h + 2;
  }
  y += -2 + 12;
  pos.salin = [16, y, 351, 36]; pos.wa = [16, y + 44, 351, 36]; pos.panduan = [16, y + 88, 351, 36];
  add("salin", nkBtn(16, y, "Salin laporan", { variant: "ghost", w: 351, size: 14, icon: "copy" }));
  add("wa", nkBtn(16, y + 44, "Kirim lewat WhatsApp", { variant: "quiet", w: 351, size: 14, icon: "message-circle" }));
  add("panduan", nkBtn(16, y + 88, "Panduan", { variant: "quiet", w: 351, size: 14, icon: "book-open" }));
  y += 124; pos.hint = [16, y + 4, 351, 16];
  add("hint", text(16, y + 16, "Tanpa data undangan.", { size: 12, fill: C.faint })); y += 20 + 24;
  pos.cspH3 = y; add("cspH3", nkH3(16, y + 12, "Izin domain (CSP)")); y += 24;
  pos.csp = [];
  if (!csp.length) { add("csp", nkNote(16, y, 351, ["Tidak butuh izin tambahan."])); y += 38 + 12; }
  else {
    csp.forEach((r, i) => { const li = cspLi(r, y); pos.csp.push([16, y, 351, li.h]); add(`csp${i}`, li.svg); y += li.h + 6; });
    y += -6 + 10;
    const failed = csp.some((r) => r.st === "failed");
    pos.periksa = [16, y, 351, 36]; pos.salinCsp = [16, y + 44, 351, 36];
    add("periksa", nkBtn(16, y, "Periksa ulang", { variant: "ghost", w: 351, size: 14 }));
    add("salinCsp", nkBtn(16, y + 44, failed ? "Salin domain kurang" : "Salin daftar domain", { variant: "quiet", w: 351, size: 14, icon: "copy" }));
    y += 80; pos.cspMsg = [16, y + 4, 351, 16]; if (o.cspMsg) y += 20;
  }
  y += 12;
  add("more", text(20, y + 20, "▸", { size: 12, fill: C.action }) + text(34, y + 20, "Lihat isi laporan", { size: 12, fill: C.action })); y += 32;
  // White behind the whole body, so its detailed copy (inside a step's focus) hides the skeleton under it.
  return { svg: rect(0, 154, 398, y + 16 - 154, { fill: C.white }) + s, pos, part, end: y + 16 };
}
// Dialog chrome: the white sheet over rail and panel, the header (title + ×), and the body scrolled by dy inside the
// view (y 154..900).
export const dlgSheet = rect(0, 92, 398, 808, { fill: C.white });
export const dlgHead = rect(0, 92, 398, 61, { fill: C.white }) + text(16, 128, "Bantuan", { size: 16, weight: 700, fill: C.strong }) + iconX("x", 368, 122, 18, C.text) +
  line(0, 153.5, 398, 153.5, { stroke: C.line });
export const dlgView = (body, dy = 0) => rect(0, 154, 398, 746, { fill: C.white }) + clipped(0, 154, 398, 746, group({ transform: `translate(0 ${-dy})` }, body.svg));
