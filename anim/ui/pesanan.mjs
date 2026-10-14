// Pesanan masuk dialog of the NikahKit panel (nikahkit/src/ui/orders.jsx), covering rail and panel (x 0..399) of the
// Scalev editor at 0,0. Measured from /tmp/ref/editor-pesanan.png (boxes, rows, badges); the open states (Tempel data
// pesanan, Link form klien, Hapus?) follow orders.jsx and base.css at the same metrics. Example data only.
import { C, icon, rect, text, para, line, group } from "../lib.mjs";
import { nkDialogHead, nkBtn, nkBtnBox, nkHint, nkBadge, nkAcc } from "./kit.mjs";

// A badge right-aligned at `right` (Terisi, Baru, Sudah diisi, Dipakai...): tone ok | todo | off | plain. Its box for a
// mark: kit nkBadgeBox(right, y, label, { end: true }).
const TONE = { ok: [C.okSoft, C.ok], todo: [C.warnSoft, C.warnStrong], off: [C.mutedBg, C.text], plain: ["none", C.strong] };
export const badgeAt = (right, y, label, tone) => nkBadge(right, y, label, { fill: TONE[tone][0], fg: TONE[tone][1], end: true });
// Inbox count on the panel head's inbox icon (.nk-inbox__count: top 2, right 0 of the 36px icon button at 218..254).
export const inboxCount = (n) => rect(238, 106, 16, 16, { r: 8, fill: C.danger }) + text(246, 118, n, { size: 10, weight: 600, fill: C.white, anchor: "middle" });

// One order row: couple, meta line, badge, trash icon. Rows start at ROW1 / ROW2 (57 px each).
export function orderRow(y, couple, meta, badge) {
  return text(28, y + 26, couple, { size: 14, weight: 600 }) + text(28, y + 42, meta, { size: 10, fill: C.text }) + badge + icon("trash", 357, y + 28, 18, C.text);
}
export const ROW1 = 190, ROW2 = 247;
export const ROW_A = ["Rani & Dimas", "Basic + QR check-in tamu · 14 Okt, 10.20"], ROW_B = ["Ayu & Fajar", "Premium · 2 Okt, 09.00"];
// .nk-box summary row, closed (the kit accordion bar, 366 wide at x 16).
export const boxRow = (y, l) => nkAcc(16, y, 366, l);
const ordersTop = nkDialogHead(0, 0, "Pesanan masuk") + nkHint(16, 181, "Klik nama untuk mengisi semua kolom sesuai paketnya.");
// The dialog with two orders (Baru, Sudah diisi) and both boxes closed.
export const ordersDlg = ordersTop + rect(16.5, 189.5, 365, 113, { r: 4, fill: C.white, stroke: C.line }) + line(17, 246.5, 381, 246.5) +
  orderRow(ROW1, ...ROW_A, badgeAt(331, ROW1 + 19, "Baru", "todo")) + orderRow(ROW2, ...ROW_B, badgeAt(331, ROW2 + 19, "Sudah diisi", "ok")) + boxRow(319, "Tempel data pesanan") + boxRow(377, "Link form klien (opsional)");

// Over ordersDlg: Tempel data pesanan open (OrderPaste), empty or with a pasted message; Isi undangan at (28, 488).
export const pasteOpen = (filled) => rect(16, 315, 366, 300, { fill: C.white }) + rect(16.5, 319.5, 365, 214, { r: 4, fill: C.white, stroke: C.line }) +
  icon("chevron-down", 38, 344, 18, C.strong) + text(59, 349, "Tempel data pesanan", { size: 14, weight: 500 }) +
  rect(28.5, 381.5, 341, 95, { r: 4, fill: C.white, stroke: filled ? C.primary : C.field, sw: filled ? 2 : 1 }) +
  (filled ? para(38, 401, ["Desain: Dasar", " ", "*Pemesan*", "Nama: Rani Kusuma"], { size: 14, fill: C.strong, lh: 20 })
    : para(38, 401, ["Tempel pesan WhatsApp dari form data", "undangan"], { size: 14, fill: C.faint, lh: 20 })) +
  group({ opacity: filled ? 1 : 0.5 }, nkBtn(28, 488, "Isi undangan")) + boxRow(545, "Link form klien (opsional)");
// Over ordersDlg: Link form klien open (link text box); salinBtn is its Salin link form button (SALIN_W wide).
export const linkOpen = rect(16.5, 377.5, 365, 201, { r: 4, fill: C.white, stroke: C.line }) + icon("chevron-down", 38, 402, 18, C.strong) + text(59, 407, "Link form klien (opsional)", { size: 14, weight: 500 }) +
  para(28, 447, ["Kirim ke klien bila ingin mereka mengisi sendiri.", "Isian mereka muncul di daftar ini."], { size: 12, fill: C.faint, lh: 16 }) +
  rect(28, 476, 341, 52, { r: 4, fill: C.mutedBg }) + text(38, 498, "https://nikahin.myscalev.com/order?", { size: 12, mono: true }) + text(38, 516, "k=AB12CD34", { size: 12, mono: true });
export const salinBtn = nkBtn(28, 534, "Salin link form", { variant: "quiet", icon: "copy" }), SALIN_BOX = nkBtnBox(28, 534, "Salin link form", { icon: "copy" });
// Hapus: the trash of row 2 becomes a red Hapus? button (nk-btn--danger, HAPUS_BOX) and the badge moves left of it;
// afterDelete is the list with only row 1.
const HAPUS_W = nkBtnBox(0, 0, "Hapus?")[2];
export const HAPUS_BOX = nkBtnBox(375 - HAPUS_W, ROW2 + 10, "Hapus?");
export const hapusRow = rect(17, ROW2 + 1, 364, 55, { fill: C.primarySoft }) + text(28, ROW2 + 26, ROW_B[0], { size: 14, weight: 600 }) + text(28, ROW2 + 42, ROW_B[1], { size: 10, fill: C.text }) +
  badgeAt(HAPUS_BOX[0] - 8, ROW2 + 19, "Sudah diisi", "ok");
export const hapusBtn = nkBtn(HAPUS_BOX[0], HAPUS_BOX[1], "Hapus?", { variant: "danger" });
export const afterDelete = rect(16, 186, 366, 400, { fill: C.white }) + rect(16.5, 189.5, 365, 56, { r: 4, fill: C.white, stroke: C.line }) + orderRow(ROW1, ...ROW_A, badgeAt(331, ROW1 + 19, "Baru", "todo")) +
  boxRow(262, "Tempel data pesanan") + boxRow(320, "Link form klien (opsional)");
