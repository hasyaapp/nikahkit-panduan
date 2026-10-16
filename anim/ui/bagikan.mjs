// The NikahKit Bagikan dialog (nikahkit/src/ui/App.jsx: ShareDialog, AccessSection, ResellerPin), drawn over the
// rail + panel (x 0..399) of the Scalev editor at 0,0. Measured from editor-bagikan.png and editor-metrics.json
// "Bagikan" (body 366 wide at x 16), 14 Okt 2026.
// d = vertical shift of the body: 0 with the "Perubahan belum disimpan di Scalev." note, NO_NOTE (-50) without it.
// Section origins below (ACC_Y, COUPLE_Y, ON_Y) are for the dialog without the note.
import { C, rect, text, para, line, clipped, iconX } from "../lib.mjs";
import { nkDialogHead, nkBtn, nkInput, nkLabel, nkHint, nkSwitch, nkH3 } from "./kit.mjs";

// Rail tool button Bagikan (styles.js .nk-rail__tool: 71 wide, 4 px padding around icon 18 + gap 4 + label 12).
export const BAGIKAN_TOOL = [0, 567, 71, 44];
export const NO_NOTE = -50;
export const NOTE = [16, 169, 366, 38], nameBox = (d) => [16, d + 239, 366, 36];
// Link box under the name field (monospace, wrapped where the panel wraps it).
export const urlBox = (y, lines) => rect(16, y, 366, 52, { r: 4, fill: C.mutedBg }) + para(26, y + 20, lines, { size: 12, fill: C.strong, lh: 18 }).replace("<text", `<text font-family="'Roboto Mono',ui-monospace,Menlo,monospace"`);
// Head, optional unsaved note, Nama tamu field, hint and link. o: { name (guest, default "Nama Tamu"), page (slug) }.
export function shareTop(d, o = {}) {
  const name = o.name ?? "Nama Tamu", page = o.page ?? "rani-dimas";
  return nkDialogHead(0, 0, "Bagikan") +
    (d === 0 ? rect(...NOTE, { r: 4, fill: C.warnSoft }) + text(28, 192, "Perubahan belum disimpan di Scalev.", { size: 12, fill: C.warnStrong }) : "") +
    nkLabel(16, d + 231, "Nama tamu") +
    nkInput(16, d + 239, 366, name) +
    nkHint(16, d + 295, "Ditambahkan sebagai ?to=Nama.") + urlBox(d + 311, [`https://tokomu.myscalev.com/${page}?`, `to=${name.replace(/ /g, "+")}`]);
}
// The three link buttons: key -> [label, y at d = 0, variant, icon]. shareBox gives the button's mark box.
export const SHARE = { lihat: ["Lihat sebagai tamu", 375, "primary", "eye"], salin: ["Salin tautan tamu", 419, "ghost", "copy"], umum: ["Salin tautan umum", 463, "quiet", "link"] };
export const shareBox = (k, d) => [16, d + SHARE[k][1], 366, 36];
export const shareBtn = (k, d) => nkBtn(16, d + SHARE[k][1], SHARE[k][0], { w: 366, size: 14, variant: SHARE[k][2], icon: SHARE[k][3] });
export const shareBtns = (d) => ["lihat", "salin", "umum"].map((k) => shareBtn(k, d)).join("");
// Undangan khusus heading + switch row + hint (y = top of the H3 box).
export const accessHead = (y, on) => nkH3(16, y + 12, "Undangan khusus") + text(16, y + 49, "Undangan khusus", { size: 14, fill: C.text }) + nkSwitch(346, y + 34, on) +
  para(16, y + 78, ["Isi undangan tidak ada di kode halaman. Server Nikahin", "mengirimnya hanya ke tamu dengan tautan sah."], { size: 12, fill: C.faint, lh: 16 });
export const switchBox = (y) => [346, y + 34, 36, 20];
// Untuk pengantin + PIN dashboard (y = top of the "Untuk pengantin" H3 box). The buttons are exported on their own
// for scenes that press them.
export const kirimBtn = (y) => nkBtn(16, y + 24, "Kirim undangan", { w: 366, size: 14, variant: "ghost", icon: "link" });
export const dashboardBtn = (y) => nkBtn(16, y + 68, "Buka Dashboard", { w: 366, size: 14, variant: "quiet", icon: "layout-grid" });
export const forCouple = (y) => nkH3(16, y + 12, "Untuk pengantin") + kirimBtn(y) + dashboardBtn(y) +
  nkHint(16, y + 120, "Masuk dengan PIN dashboard.") + nkH3(16, y + 160, "PIN dashboard");
export const kirimBox = (y) => [16, y + 24, 366, 36], dashboardBox = (y) => [16, y + 68, 366, 36], pinBox = (y) => [16, y + 172, 366, 36];
export const pinBtn = (y) => nkBtn(16, y + 172, "Kelola PIN dashboard", { w: 366, size: 14, icon: "lock" });
export const pinHint = (y) => nkHint(16, y + 224, "PIN hanya tampil di jendela NikahKit.");
export const coupleAll = (y) => forCouple(y) + pinBtn(y) + pinHint(y);
// Access section when switched on (y = top of the Keamanan field, i.e. 12 px under the switch hint).
export const MODES = { link: ["Tautan pribadi", "Hanya tamu dengan tautan dari Dashboard > Kirim."], device: ["+ Kunci perangkat", "Tautan yang diteruskan tidak terbuka di perangkat lain."] };
export const keamananBox = (y) => [16, y + 20, 366, 36], devicesBox = (y) => [16, y + 112, 366, 36];
export function accessOn(y, mode, devices) {
  let s = rect(0, y - 4, 399, 900 - y + 4, { fill: C.white }) + nkLabel(16, y + 12, "Keamanan") + nkInput(16, y + 20, 366, MODES[mode][0], { select: true }) + nkHint(16, y + 72, MODES[mode][1]);
  let at = y + 92;
  if (mode !== "link") { s += nkLabel(16, at + 12, "Perangkat per tamu") + nkInput(16, at + 20, 366, String(devices), { select: true }); at += 68; }
  s += para(16, at + 16, ["Tamu tetap bisa memotret layar. Tombol WhatsApp di halaman", "pribadi memakai nomor konfirmasi hadiah."], { size: 12, fill: C.faint, lh: 16 });
  at += 36;
  s += rect(16, at, 366, 56, { r: 4, fill: C.warnSoft }) + para(28, at + 23, ["Tautan di atas tanpa token. Buat tautan tamu di", "Dashboard > Kirim."], { size: 12, fill: C.warnStrong, lh: 18 });
  at += 88;
  return s + coupleAll(at);
}
// The dialog without the unsaved note: its sections' y.
export const ACC_Y = 473, COUPLE_Y = 591, ON_Y = 583;
// The whole dialog without the note. accessMode: null (Undangan khusus off), "link" or "device" (with devices).
export const shareAll = (accessMode, devices) => shareTop(NO_NOTE) + shareBtns(NO_NOTE) + accessHead(ACC_Y, !!accessMode) + (accessMode ? accessOn(ON_Y, accessMode, devices) : coupleAll(COUPLE_Y));
// The dialog with its body scrolled up by dy (the head stays); boxes inside move up by dy.
export const shareScrolled = (dy, mode, devices) => rect(0, 154, 399, 746, { fill: C.white }) + clipped(0, 154, 399, 746, `<g transform="translate(0 ${-dy})">${shareAll(mode, devices)}</g>`) +
  rect(0, 92, 399, 61, { fill: C.white }) + text(16, 128, "Bagikan", { size: 16, weight: 700, fill: C.strong }) + iconX("x", 368, 122, 18, C.text) + line(0, 153, 399, 153, { stroke: C.line });
