// Pesanan masuk dialog of the NikahKit panel (nikahkit/src/ui/orders.jsx), covering rail and panel (x 0..399) of the
// Scalev editor at 0,0. Measured from /tmp/ref/editor-pesanan.png (boxes, rows, badges); the open states (Tempel data
// pesanan, Link form klien, Hapus?) follow orders.jsx and base.css at the same metrics. Example data only.
// Intro and status lines are .nk-lead (margin 0 0 12px; the measured .nk-hint had 4px above and none below), so the
// line sits LEAD_UP higher and everything under it D lower than in the screenshot.
import { C, icon, iconX, rect, text, para, line, group, wrap, textWidth } from "../lib.mjs";
import { nkDialogHead, nkBtn, nkBtnBox, nkHint, nkBadge, nkBadgeBox, nkAcc } from "./kit.mjs";

// A badge right-aligned at `right` (Terisi, Baru, Sudah diisi, Dipakai...): tone ok | todo | off | plain. Its box for a
// mark: kit nkBadgeBox(right, y, label, { end: true }).
const TONE = { ok: [C.okSoft, C.ok], todo: [C.warnSoft, C.warnStrong], off: [C.mutedBg, C.text], plain: ["none", C.strong] };
export const badgeAt = (right, y, label, tone) => nkBadge(right, y, label, { fill: TONE[tone][0], fg: TONE[tone][1], end: true });
// Inbox count on the panel head's inbox icon (.nk-inbox__count: top 2, right 0 of the 36px icon button centred at cx;
// the member's head has it at 236, a Kreator's at KR_INBOX).
export const inboxCount = (n, cx = 236) => rect(cx + 2, 106, 16, 16, { r: 8, fill: C.danger }) + text(cx + 10, 118, n, { size: 10, weight: 600, fill: C.white, anchor: "middle" });

// One order row: couple, meta line, badge, trash icon. Rows start at ROW1 / ROW2 (57 px each).
export function orderRow(y, couple, meta, badge) {
  return text(28, y + 26, couple, { size: 14, weight: 600 }) + text(28, y + 42, meta, { size: 10, fill: C.text }) + badge + icon("trash", 357, y + 28, 18, C.text);
}
const LEAD_UP = 4, D = 12 - LEAD_UP;
export const LIST_Y = 189 + D, ROW1 = LIST_Y + 1, ROW2 = ROW1 + 57;
// Bars of the two closed boxes under the list (Tempel data pesanan, Link form klien) and the Isi undangan button.
export const PASTE_Y = 319 + D, LINK_Y = 377 + D, ISI_Y = 488 + D;
export const ROW_A = ["Rani & Dimas", "Basic + QR check-in tamu · 14 Okt, 10.20"], ROW_B = ["Ayu & Fajar", "Premium · 2 Okt, 09.00"];
// .nk-box summary row, closed (the kit accordion bar, 366 wide at x 16).
export const boxRow = (y, l) => nkAcc(16, y, 366, l);
const ordersTop = nkDialogHead(0, 0, "Pesanan masuk") + nkHint(16, 181 - LEAD_UP, "Klik nama untuk mengisi undangan.");
// The dialog with two orders (Baru, Sudah diisi) and both boxes closed.
export const ordersDlg = ordersTop + rect(16.5, LIST_Y + 0.5, 365, 113, { r: 4, fill: C.white, stroke: C.line }) + line(17, ROW2 - 0.5, 381, ROW2 - 0.5) +
  orderRow(ROW1, ...ROW_A, badgeAt(331, ROW1 + 19, "Baru", "todo")) + orderRow(ROW2, ...ROW_B, badgeAt(331, ROW2 + 19, "Sudah diisi", "ok")) + boxRow(PASTE_Y, "Tempel data pesanan") + boxRow(LINK_Y, "Link form klien");

// Over ordersDlg: Tempel data pesanan open (OrderPaste), empty or with a pasted message (PASTE_AREA); Isi undangan at (28, ISI_Y).
export const PASTE_AREA = [28, PASTE_Y + 62, 341, 95];
export const pasteOpen = (filled) => rect(16, PASTE_Y - 4, 366, 300, { fill: C.white }) + rect(16.5, PASTE_Y + 0.5, 365, 214, { r: 4, fill: C.white, stroke: C.line }) +
  icon("chevron-down", 38, PASTE_Y + 25, 18, C.strong) + text(59, PASTE_Y + 30, "Tempel data pesanan", { size: 14, weight: 500 }) +
  rect(PASTE_AREA[0] + 0.5, PASTE_AREA[1] + 0.5, 340, 94, { r: 4, fill: C.white, stroke: filled ? C.primary : C.field, sw: filled ? 2 : 1 }) +
  (filled ? para(38, PASTE_Y + 82, ["Desain: Dasar", " ", "*Pemesan*", "Nama: Rani Kusuma"], { size: 14, fill: C.strong, lh: 20 })
    : para(38, PASTE_Y + 82, ["Tempel pesan WhatsApp dari klien"], { size: 14, fill: C.faint, lh: 20 })) +
  group({ opacity: filled ? 1 : 0.5 }, nkBtn(28, ISI_Y, "Isi undangan")) + boxRow(PASTE_Y + 226, "Link form klien");
// Over ordersDlg: Link form klien open (lead, link text box); salinBtn is its Salin link form button. The lead inside
// the box body is .nk-lead too (one line): the text LEAD_UP higher, the link box under it after the 12 px gap.
const LT = LINK_Y + 70 - LEAD_UP, LU = LINK_Y + 99 + D - 16;
export const linkOpen = rect(16.5, LINK_Y + 0.5, 365, LU + 102 - LINK_Y, { r: 4, fill: C.white, stroke: C.line }) + icon("chevron-down", 38, LINK_Y + 25, 18, C.strong) + text(59, LINK_Y + 30, "Link form klien", { size: 14, weight: 500 }) +
  para(28, LT, ["Kirim ke klien. Isiannya masuk ke daftar ini."], { size: 12, fill: C.faint, lh: 16 }) +
  rect(28, LU, 341, 52, { r: 4, fill: C.mutedBg }) + text(38, LU + 22, "https://nikahin.myscalev.com/order?", { size: 12, mono: true }) + text(38, LU + 40, "k=rn7kq4mx", { size: 12, mono: true });
export const SALIN_Y = LU + 58;
export const salinBtn = nkBtn(28, SALIN_Y, "Salin link form", { variant: "quiet", icon: "copy" }), SALIN_BOX = nkBtnBox(28, SALIN_Y, "Salin link form", { icon: "copy" });
// Hapus: the trash of row 2 becomes a red Hapus? button (nk-btn--danger, HAPUS_BOX) and the badge moves left of it;
// afterDelete is the list with only row 1.
const HAPUS_W = nkBtnBox(0, 0, "Hapus?")[2];
export const HAPUS_BOX = nkBtnBox(375 - HAPUS_W, ROW2 + 10, "Hapus?");
export const hapusRow = rect(17, ROW2 + 1, 364, 55, { fill: C.primarySoft }) + text(28, ROW2 + 26, ROW_B[0], { size: 14, weight: 600 }) + text(28, ROW2 + 42, ROW_B[1], { size: 10, fill: C.text }) +
  badgeAt(HAPUS_BOX[0] - 8, ROW2 + 19, "Sudah diisi", "ok");
export const hapusBtn = nkBtn(HAPUS_BOX[0], HAPUS_BOX[1], "Hapus?", { variant: "danger" });
export const afterDelete = rect(15, LIST_Y - 3, 368, 400, { fill: C.white }) + rect(16.5, LIST_Y + 0.5, 365, 56, { r: 4, fill: C.white, stroke: C.line }) + orderRow(ROW1, ...ROW_A, badgeAt(331, ROW1 + 19, "Baru", "todo")) +
  boxRow(LIST_Y + 73, "Tempel data pesanan") + boxRow(LIST_Y + 131, "Link form klien");

// A Kreator's Pesanan masuk (orders.jsx Sales, styles.js .nk-box[open]): one order from the Landing, then Penjualan
// katalog open (the total commission on its title row, the lead, the paid orders with their commission, Buka /slug),
// then Tempel data pesanan and Link form klien closed. Example sales: the three Nikahin packages at 60%.
export const KR_ROW = ["Rani & Dimas", "Undangan Inti · 19 Okt, 10.20"];
const SALES = [["Rani Kusuma", "Undangan Inti · 19 Okt, 09.55", "Rp77.400"], ["Ayu Lestari", "Paket Lengkap · 12 Okt, 14.05", "Rp137.400"],
  ["Dewi Lestari", "Paket Istimewa · 3 Okt, 19.30", "Rp227.400"]];
const SALES_TOTAL = "Rp442.200", SALES_LEAD = wrap("3 pesanan lunas. Komisi 60% dari harga paket setelah diskon.", 342, 12, 400, textWidth);
// Box geometry: summary 50, body padding 12, lead 16 per line + 12, list rows 56 + 1 px rules + 16, the button 36.
const SY = LIST_Y + 73, LEAD_Y = SY + 63, SL_Y = LEAD_Y + SALES_LEAD.length * 16 + 12, SL_H = SALES.length * 57 + 1, BUKA_Y = SL_Y + SL_H + 16, SH = BUKA_Y + 36 + 12 - SY;
// Boxes the steps mark: the whole box, the total badge, the lead, the paid orders, the Buka /rina-wo button.
export const SALES_AT = { box: [16, SY, 366, SH], total: nkBadgeBox(369, SY + 16, SALES_TOTAL, { end: true }), lead: [28, LEAD_Y - 1, 342, SALES_LEAD.length * 16 + 2],
  list: [28, SL_Y, 342, SL_H], buka: [28, BUKA_Y, 342, 36] };
const salesRow = (y, [name, meta, fee]) => text(40, y + 26, name, { size: 14, weight: 600 }) + text(40, y + 42, meta, { size: 10, fill: C.text }) + badgeAt(364, y + 19, fee, "ok");
const salesBox = rect(13, SY - 3, 372, SH + 6, { r: 7, fill: C.primarySoft }) + rect(16.5, SY + 0.5, 365, SH - 1, { r: 4, fill: C.white, stroke: C.primary }) +
  icon("chevron-down", 38, SY + 25, 18, C.strong) + text(59, SY + 30, "Penjualan katalog", { size: 14, weight: 500 }) + badgeAt(369, SY + 16, SALES_TOTAL, "ok") +
  para(28, LEAD_Y + 11, SALES_LEAD, { size: 12, fill: C.faint, lh: 16 }) + rect(28.5, SL_Y + 0.5, 341, SL_H - 1, { r: 4, fill: C.white, stroke: C.line }) +
  SALES.map((r, i) => (i ? line(29, SL_Y + i * 57 + 0.5, 369, SL_Y + i * 57 + 0.5) : "") + salesRow(SL_Y + 1 + i * 57, r)).join("") +
  rect(28.5, BUKA_Y + 0.5, 341, 35, { r: 4, fill: C.surface, stroke: C.line }) + iconX("link", 48, BUKA_Y + 18, 16, C.strong) + text(64, BUKA_Y + 22, "Buka /rina-wo", { size: 12, weight: 500, fill: C.strong });
export const KR_PASTE_Y = SY + SH + 8;
export const kreatorOrders = ordersTop + rect(16.5, LIST_Y + 0.5, 365, 56, { r: 4, fill: C.white, stroke: C.line }) + orderRow(ROW1, ...KR_ROW, badgeAt(331, ROW1 + 19, "Baru", "todo")) +
  salesBox + boxRow(KR_PASTE_Y, "Tempel data pesanan") + boxRow(KR_PASTE_Y + 58, "Link form klien");
