// Template > Marketing in the NikahKit panel (nikahkit/src/ui/panels-style.jsx: TemplatePanel kind "marketing",
// BrandForm; marketing.js MARKETING), at the panel's real place in the Scalev editor at 0,0 (body x 72..399), as of
// extension 0.7.71: four cards (Dashboard pasangan and the three Landing templates) and Profil merek with business data
// only. Measured from /tmp/ref/editor-marketing.png (Profil merek box, cards); the open BrandForm follows
// panels-style.jsx and base.css at the panel metrics (fields 253 wide at x 101, package item 233 wide at x 111). The
// Template | Marketing switch above it is editor-panels seg("marketing").
import { C, icon, rect, text, para, line, circle, group, clipped, clamp } from "../lib.mjs";
import { nkBtn, nkInput, nkLabel, nkBadgeBox } from "./kit.mjs";
import { badgeAt } from "./pesanan.mjs";

// The switch's click points and the Marketing half's box (for a mark), as editor-panels seg() draws it.
export const SEG = { template: [158, 188], marketing: [297, 188] }, MARKETING_BOX = [227.5, 169, 139.5, 38];

// Profil merek box (details.nk-box) at y (BOX under the switch), closed: 50 px; badge Terisi / Belum diisi.
export const BOX = 219;
export const brandClosed = (y, ready = true) => rect(88.5, y + 0.5, 278, 49, { r: 4, fill: C.white, stroke: C.line }) + text(101, y + 30, "Profil merek", { size: 14, weight: 500 }) +
  badgeAt(354, y + 16, ready ? "Terisi" : "Belum diisi", ready ? "ok" : "plain");

// Marketing cards: two columns, 241 apart (as the library). SKETCH: the card's page drawing (viewBox 150x100, centred
// in the 4:5 phone); a Landing template in its own colours (LOOK: page, main, accent, band). MK: name and description
// (the card clamps it at two lines). The name and its Dipakai badge share the 134 px row: with the badge the name
// wraps, and a Dipakai badge in the first row grows that grid row by the line.
const LOOK = { landing: ["#FFFAF6", "#2B1A07", "#B8460D", "#F7EFE9"], etalase: ["#FFFCF2", "#10324A", "#D1124F", "#FBE3E8"], langit: ["#F5FBFF", "#000000", "#0070C9", "#EEF8FF"] };
const alpha = (hex, a) => `rgba(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(",")},${a})`;
const SKETCH = {
  dashboard: rect(0, 0, 150, 18, { fill: C.primarySoft }) + [0, 1, 2, 3].map((i) => rect(8 + i * 35, 24, 28, 6, { r: 3, fill: i ? C.line : C.primary })).join("") +
    [0, 1, 2, 3].map((i) => circle(16, 46 + i * 14, 5, { fill: C.line }) + rect(26, 42 + i * 14, 70 - i * 8, 4, { r: 2, fill: C.line }) + rect(26, 48 + i * 14, 40, 3, { r: 1.5, fill: C.line })).join(""),
  ...Object.fromEntries(Object.entries(LOOK).map(([id, [bg, ink, accent, band]]) => [id, rect(0, 0, 150, 100, { fill: bg }) + circle(12, 9, 5, { fill: ink }) +
    rect(35, 20, 80, 7, { r: 3.5, fill: ink }) + rect(58, 31, 34, 8, { r: 4, fill: accent }) + rect(0, 45, 150, 34, { fill: band }) +
    [0, 1, 2, 3].map((i) => rect(8 + i * 35, 49, 30, 26, { r: 3, fill: "#ffffff", stroke: alpha(ink, 0.25) })).join("") + rect(8, 84, 134, 12, { r: 3, fill: band })]))
};
export const MK = { dashboard: ["Dashboard pasangan", "Kirim undangan, RSVP, ucapan, dan check-in tamu."], landing: ["Landing Klasik", "Krem dan cokelat, judul serif."],
  etalase: ["Landing Etalase", "Pita merah muda, desain berbingkai."], langit: ["Landing Langit", "Putih kebiruan, tombol pil hitam."] };
const CARD_AT = { dashboard: [88, 0], landing: [234, 0], etalase: [88, 241], langit: [234, 241] };
// Top-left of card id with the cards from y (MKY under a closed Profil merek box); on: the card marked Dipakai. Card
// box: [x, y, 134, 167].
export const MKY = 281;
export const cardXY = (id, y = MKY, on) => [CARD_AT[id][0], y + CARD_AT[id][1] + (CARD_AT[id][1] && on && !CARD_AT[on][1] ? 20 : 0)];
function mkCard(x, y, id, on) {
  const [name, desc] = MK[id], nameLines = on ? name.split(" ") : [name], dy = (nameLines.length - 1) * 20;
  return rect(x + 1, y + 1, 132, 165, { r: 8, fill: C.page, stroke: on ? C.primary : C.line, sw: 2 }) +
    clipped(x + 2, y + 2, 130, 163, group({ transform: `translate(${x + 2} ${y + 2 + 38.2}) scale(${130 / 150})` }, SKETCH[id])) +
    para(x, y + 188, nameLines, { size: 14, weight: 500, lh: 20 }) + (on ? badgeAt(x + 134, y + 175 + dy / 2, "Dipakai", "ok") : "") + para(x, y + 209 + dy, clamp(desc, 134, 2, 12), { size: 12, fill: C.faint, lh: 16 });
}
export const mkCards = (y, on) => Object.keys(MK).map((id) => mkCard(...cardXY(id, y, on), id, on === id)).join("");
// The Dipakai badge box on card id (its name wraps to two lines), for a mark.
export const dipakaiBox = (id, y = MKY) => { const [x, cy] = cardXY(id, y); return nkBadgeBox(x + 134, cy + 185, "Dipakai", { end: true }); };

// Profil merek open (BrandForm) from BOX, unscrolled: business data only. v: { name, wa, ready }. TAMBAH_Y and SIMPAN_Y
// are the Tambah paket and Simpan profil button tops; the package item's fields start at PKG_F (Nama paket input).
export const TAMBAH_Y = 941, SIMPAN_Y = 989, PKG_F = 620;
export function brandOpen(v = {}) {
  const fx = 101, fw = 253, hint = (y, s) => text(fx, y, s, { size: 12, fill: C.faint });
  let s = rect(85.5, BOX - 2.5, 284, 824, { r: 6, stroke: C.primarySoft, sw: 3 }) + rect(88.5, BOX + 0.5, 278, 818, { r: 4, fill: C.white, stroke: C.primary }) +
    text(101, BOX + 30, "Profil merek", { size: 14, weight: 500 }) + badgeAt(354, BOX + 16, v.ready ? "Terisi" : "Belum diisi", v.ready ? "ok" : "plain") + line(89, BOX + 49, 366, BOX + 49);
  s += nkLabel(fx, 292, "Nama bisnis") + nkInput(fx, 300, fw, v.name ?? "") +
    nkLabel(fx, 360, "Nomor WhatsApp") + nkInput(fx, 368, fw, v.wa ?? "0812 3456 7890", { placeholder: !v.wa }) + hint(420, "Untuk tombol Tanya lewat WhatsApp.") +
    nkLabel(fx, 448, "Logo (opsional)") + nkInput(fx, 456, fw, "https://", { placeholder: true }) + hint(508, "Alamat gambar https.") +
    hint(540, "Paket di Landing page, 1 sampai 3.");
  // one package item (.nk-item)
  s += rect(fx + 0.5, 552.5, fw - 1, 380, { r: 4, fill: C.page, stroke: C.line }) + text(111, 581, "Paket 1", { size: 12, weight: 700 }) +
    icon("chevron-up", 282, 576, 16, C.off) + icon("chevron-down", 308, 576, 16, C.off) + icon("trash", 334, 576, 16, C.off) +
    nkLabel(111, PKG_F - 8, "Nama paket") + nkInput(111, PKG_F, 233, "Nama paket", { placeholder: true }) +
    nkLabel(111, PKG_F + 60, "Harga (Rp)") + nkInput(111, PKG_F + 68, 233, "150.000", { placeholder: true }) +
    nkLabel(111, PKG_F + 128, "Isi paket (opsional)") + rect(111.5, PKG_F + 136.5, 232, 133, { r: 4, fill: C.white, stroke: C.field }) +
    text(111, 906, "Satu isi per baris, maksimal 6 baris.", { size: 12, fill: C.faint }) +
    nkBtn(fx, TAMBAH_Y, "Tambah paket", { variant: "quiet", w: fw, icon: "plus" }) + nkBtn(fx, SIMPAN_Y, "Simpan profil", { w: 110 });
  return s;
}
