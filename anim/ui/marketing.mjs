// Template > Marketing in the NikahKit panel (nikahkit/src/ui/panels-style.jsx: TemplatePanel kind "marketing",
// BrandForm), at the panel's real place in the Scalev editor at 0,0 (body x 72..399). Measured from
// /tmp/ref/editor-marketing.png (Profil merek box, cards); the open BrandForm follows panels-style.jsx and base.css at
// the panel metrics (fields 253 wide at x 101, package item 233 wide at x 111). The Template | Marketing switch above
// it is editor-panels seg("marketing").
import { C, icon, iconX, rect, text, para, line, circle, group, shadow } from "../lib.mjs";
import { nkBtn, nkInput, nkLabel, nkBadgeBox } from "./kit.mjs";
import { badgeAt } from "./pesanan.mjs";

// The switch's click points and the Marketing half's box (for a mark), as editor-panels seg() draws it.
export const SEG = { template: [158, 188], marketing: [297, 188] }, MARKETING_BOX = [227.5, 169, 139.5, 38];

// Profil merek box (details.nk-box) at y (BOX under the switch), closed: 50 px; badge Terisi / Belum diisi.
export const BOX = 219;
export const brandClosed = (y, ready = true) => rect(88.5, y + 0.5, 278, 49, { r: 4, fill: C.white, stroke: C.line }) + text(101, y + 30, "Profil merek", { size: 14, weight: 500 }) +
  badgeAt(354, y + 16, ready ? "Terisi" : "Belum diisi", ready ? "ok" : "plain");

// Marketing cards: SKETCH from panels-style.jsx (viewBox 150x100, centred in the 4:5 phone). MK: name and the
// description as the card clamps it. The name and its Dipakai badge share the 134 px row: with the badge the name wraps.
const SKETCH = {
  dashboard: rect(0, 0, 150, 18, { fill: C.primarySoft }) + [0, 1, 2, 3].map((i) => rect(8 + i * 35, 24, 28, 6, { r: 3, fill: i ? C.line : C.primary })).join("") +
    [0, 1, 2, 3].map((i) => circle(16, 46 + i * 14, 5, { fill: C.line }) + rect(26, 42 + i * 14, 70 - i * 8, 4, { r: 2, fill: C.line }) + rect(26, 48 + i * 14, 40, 3, { r: 1.5, fill: C.line })).join(""),
  landing: circle(12, 9, 5, { fill: C.primary }) + rect(8, 22, 80, 7, { r: 3.5, fill: C.line }) + rect(8, 33, 34, 8, { r: 4, fill: C.primary }) +
    [0, 1, 2, 3].map((i) => rect(8 + i * 35, 50, 30, 26, { r: 3, fill: C.line })).join("") + rect(8, 84, 134, 12, { r: 3, fill: C.primarySoft })
};
export const MK = { dashboard: ["Dashboard pasangan", ["Kirim undangan, RSVP,", "ucapan, dan check-in…"]], landing: ["Landing page", ["Halaman jualan: desain,", "paket dan harga, lalu for…"]] };
function mkCard(x, y, id, on) {
  const [name, desc] = MK[id], nameLines = on ? name.split(" ") : [name], dy = (nameLines.length - 1) * 20;
  return rect(x + 1, y + 1, 132, 165, { r: 8, fill: C.page, stroke: on ? C.primary : C.line, sw: 2 }) +
    group({ transform: `translate(${x + 2} ${y + 2 + 38.2}) scale(${130 / 150})` }, SKETCH[id]) +
    para(x, y + 188, nameLines, { size: 14, weight: 500, lh: 20 }) + (on ? badgeAt(x + 134, y + 175 + dy / 2, "Dipakai", "ok") : "") + para(x, y + 209 + dy, desc, { size: 12, fill: C.faint, lh: 16 });
}
// Both cards at y (MKY under a closed Profil merek box); on: the one marked Dipakai. Card boxes: [CARD_X[id], y, 134, 167].
export const MKY = 281, CARD_X = { dashboard: 88, landing: 234 };
export const mkCards = (y, on) => mkCard(CARD_X.dashboard, y, "dashboard", on === "dashboard") + mkCard(CARD_X.landing, y, "landing", on === "landing");
// The Dipakai badge box on card id (its name wraps to two lines), for a mark.
export const dipakaiBox = (id, y = MKY) => nkBadgeBox(CARD_X[id] + 134, y + 185, "Dipakai", { end: true });

// Profil merek open (BrandForm) from BOX, unscrolled; v: { name, wa, pkg, pkgName, price, style, ready }. The box is
// 1030 high; GAYA_Y and SIMPAN_Y are the Gaya katalog select and the Simpan profil button tops.
export const GAYA_Y = 1069, SIMPAN_Y = 1201;
export function brandOpen(v = {}) {
  const fx = 101, fw = 253;
  let s = rect(85.5, BOX - 2.5, 284, 1036, { r: 6, stroke: C.primarySoft, sw: 3 }) + rect(88.5, BOX + 0.5, 278, 1030, { r: 4, fill: C.white, stroke: C.primary }) +
    text(101, BOX + 30, "Profil merek", { size: 14, weight: 500 }) + badgeAt(354, BOX + 16, v.ready ? "Terisi" : "Belum diisi", v.ready ? "ok" : "plain") + line(89, BOX + 49, 366, BOX + 49);
  s += nkLabel(fx, 292, "Nama bisnis") + nkInput(fx, 300, fw, v.name ?? "") +
    nkLabel(fx, 360, "Nomor WhatsApp") + nkInput(fx, 368, fw, v.wa ?? "0812 3456 7890", { placeholder: !v.wa }) +
    para(fx, 420, ["Tombol Tanya lewat WhatsApp di Landing page", "menuju nomor ini."], { size: 12, fill: C.faint, lh: 16 }) +
    nkLabel(fx, 464, "Logo (opsional)") + nkInput(fx, 472, fw, "https://", { placeholder: true }) +
    para(fx, 524, ["Alamat gambar https, misalnya dari Media", "Scalev Anda."], { size: 12, fill: C.faint, lh: 16 }) +
    para(fx, 572, ["Paket dan harga di Landing page, 1 sampai 3", "paket."], { size: 12, fill: C.faint, lh: 16 });
  // one package item (.nk-item)
  s += rect(fx + 0.5, 600.5, fw - 1, 396, { r: 4, fill: C.page, stroke: C.line }) + text(111, 629, v.pkg ?? "Paket 1", { size: 12, weight: 700 }) +
    icon("chevron-up", 282, 624, 16, C.off) + icon("chevron-down", 308, 624, 16, C.off) + icon("trash", 334, 624, 16, C.off) +
    nkLabel(111, 660, "Nama paket") + nkInput(111, 668, 233, v.pkgName ?? "Nama paket", { placeholder: !v.pkgName }) +
    nkLabel(111, 728, "Harga (Rp)") + nkInput(111, 736, 233, v.price ?? "150.000", { placeholder: !v.price }) +
    nkLabel(111, 796, "Isi paket (opsional)") + rect(111.5, 804.5, 232, 133, { r: 4, fill: C.white, stroke: C.field }) +
    para(111, 954, ["Satu baris satu isi, maksimal 6 baris, 80", "huruf per baris."], { size: 12, fill: C.faint, lh: 16 }) +
    nkBtn(fx, 1005, "Tambah paket", { variant: "quiet", w: fw, icon: "plus" }) +
    nkLabel(fx, 1061, "Gaya katalog") + nkInput(fx, GAYA_Y, fw, v.style ?? "Grid", { select: true }) +
    para(fx, 1121, ["Cara daftar desain tampil di Landing", "page; Etalase juga mengganti warna dan", "huruf seluruh halaman. Berlaku setelah", "profil disimpan dan halaman dipasang", "atau diperbarui."], { size: 12, fill: C.faint, lh: 16 }) +
    nkBtn(fx, SIMPAN_Y, "Simpan profil", { w: 110 });
  return s;
}
// Gaya katalog's native select list (CATALOG_STYLES labels) under the select whose top is y; the first value is checked.
export const STYLE_LABELS = ["Grid", "Daftar", "Kartu besar", "Geser", "Mozaik", "Etalase"];
export const MENU_H = 8 + STYLE_LABELS.length * 32, menuItemY = (y, i) => y + 40 + 4 + i * 32;
export const styleMenu = (y) => shadow(101, y + 40, 253, MENU_H, 6, 2) + rect(101.5, y + 40 + 0.5, 252, MENU_H - 1, { r: 6, fill: C.white, stroke: C.line }) +
  rect(105, menuItemY(y, 0), 245, 32, { r: 4, fill: C.primarySoft }) + iconX("check", 120, menuItemY(y, 0) + 16, 14, C.strong, 2.4) +
  STYLE_LABELS.map((l, i) => text(134, menuItemY(y, i) + 21, l, { size: 14 })).join("");
