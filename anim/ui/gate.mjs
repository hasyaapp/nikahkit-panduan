// The NikahKit AccessGate (nikahkit/src/ui/App.jsx AccessGate, styles.js .nk-panel__head/.nk-gate, base.css .nk-note,
// .nk-btn, .nk-gbtn), covering rail and panel (x 0..399) of the Scalev editor whose top is at y. Geometry from the CSS:
// header padding 12/12/12/16, h2 16/24, the /slug line 12/16 2 below it (header 66 high with it, 60 without) and a 1 px
// border; body padding 16; nk-note 12/18 with 10/12 padding and a bold title; the .nk-gate row (gap 8, centred, 14 px
// buttons, the Google button 40 high). Chip, title, hint and buttons follow App.jsx per access state.
import { C, rect, text, line, group, icon, iconX, tw } from "../lib.mjs";
import { nkBtn, nkBtnBox } from "./kit.mjs";

// App.jsx GATE: state -> [title, hint, warn].
export const GATE_TEXT = {
  checking: ["Memeriksa akses...", ""],
  offline: ["Ekstensi tidak tersambung.", "Muat ulang halaman.", true],
  server: ["Server NikahKit tidak terjangkau.", "Periksa internet, lalu tekan Periksa lagi.", true],
  signedOut: ["Masuk ke NikahKit.", ""],
  noFeature: ["Akun belum punya akses desain.", "Hubungi tim Nikahin."],
  expired: ["Langganan habis.", "Undangan tayang tetap tampil.", true],
  unlicensed: ["Akun belum berlangganan.", ""],
  other: ["Undangan ini milik akun NikahKit lain.", "Masuk dengan akun pemiliknya.", true],
  unassigned: ["Hubungkan bisnis Scalev dulu.", "Hubungkan lewat Akun, lalu Periksa lagi.", true],
  notInScalev: ["Halaman belum ada di bisnis Scalev yang terhubung.", "Simpan dulu, atau hubungkan bisnis pemiliknya.", true]
};
const NO_CHIP = ["checking", "signedOut", "offline", "server"];

// Google's four-colour G (App.jsx GOOGLE_G), size px square at (x, y), and the "Masuk dengan Google" button (.nk-gbtn).
export const gLogo = (x, y, size = 20) => `<g transform="translate(${x} ${y}) scale(${size / 48})"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></g>`;
export const GBTN_W = 12 + 20 + 10 + tw("Masuk dengan Google", 14, 500) + 12;
export const gBtn = (x, y, o = {}) => group({ opacity: o.disabled ? 0.38 : 1 }, rect(x + 0.5, y + 0.5, GBTN_W - 1, 39, { r: 4, fill: C.white, stroke: "#747775" }) + gLogo(x + 12, y + 10) +
  text(x + 42, y + 25, "Masuk dengan Google", { size: 14, weight: 500, fill: "#1f1f1f" }));

// AccountChip (.nk-account, 28 high, pill): circle-user icon 16 + plan name 12/500; warn = last week or grace.
export const chipW = (label) => tw(label, 12, 500) + 36;
export const accountChip = (x, y, label, warn = false) => rect(x + 0.5, y + 0.5, chipW(label) - 1, 27, { r: 14, fill: warn ? C.warnSoft : C.white, stroke: warn ? "#fde7c7" : C.field }) +
  icon("circle-user-round", x + 15, y + 14, 16, warn ? C.warn : C.primary) + text(x + 27, y + 18, label, { size: 12, weight: 500, fill: warn ? C.warnStrong : C.strong });

// Buttons per state: google (signedOut), choose (unlicensed, expired), connect (unassigned), pick, recheck (not checking).
const BTN = { choose: ["Pilih paket", "primary"], connect: ["Hubungkan bisnis Scalev", "primary"], pick: ["Pilih template lain", "primary"], recheck: ["Periksa lagi", "quiet"] };
// Note text: bold title then hint, wrapped greedily to the note's 343 px text width.
function noteLines(title, hint) {
  const words = [...title.split(" ").map((t) => ({ t, w: 700 })), ...(hint ? hint.split(" ").map((t) => ({ t })) : [])];
  const lines = [[]];
  let used = 0;
  for (const wd of words) {
    const w = tw(wd.t + " ", 12, wd.w ?? 400);
    if (used && used + tw(wd.t, 12, wd.w ?? 400) > 343) { lines.push([]); used = 0; }
    lines.at(-1).push(wd); used += w;
  }
  return lines.map((l) => l.map((wd, i) => ({ t: (i ? " " : "") + wd.t, w: wd.w })));
}

// gate({ state, slug, chip, chipWarn, text, recheck = true, pick = false }, y = 0)
//   state: an App.jsx access state (text, chip and buttons follow it); text: [title, hint, warn] to override (locked,
//   loading); chip: the plan name (default "Akun"), false for none; slug: show the /slug line.
// Returns { svg, at: { [button]: box }, btn: { [button]: markup }, note, close, chip, head } (boxes [x, y, w, h]).
export function gate(o = {}, y = 0) {
  const [title, hint, warn] = o.text ?? GATE_TEXT[o.state];
  const H = o.slug ? 66 : 60, top = y + 92, cy = top + 12 + (H - 24) / 2;
  let s = rect(0, top, 399, 808, { fill: C.white }) + line(399, top, 399, y + 900, { stroke: C.svDivider }) +
    text(16, o.slug ? top + 29.5 : top + 35.5, "NikahKit", { size: 16, weight: 700 }) + (o.slug ? text(16, top + 50, "/" + o.slug, { size: 12, fill: C.text }) : "") +
    iconX("x", 369, cy, 18, C.text) + line(0, top + H + 1.5, 399, top + H + 1.5, { stroke: C.line });
  const res = { at: {}, btn: {}, close: [351, cy - 18, 36, 36], head: [0, top, 399, H + 1] };
  const label = o.chip ?? "Akun";
  if (label !== false && !NO_CHIP.includes(o.state)) { const x = 343 - chipW(label); s += accountChip(x, cy - 14, label, o.chipWarn); res.chip = [x, cy - 14, chipW(label), 28]; }
  const lines = noteLines(title, hint), ny = top + H + 17, nh = 20 + lines.length * 18;
  res.note = [16, ny, 367, nh];
  s += rect(16, ny, 367, nh, { r: 4, fill: warn ? C.warnSoft : C.primarySoft }) + lines.map((l, i) => text(28, ny + 23 + i * 18, l, { size: 12, fill: warn ? C.warnStrong : C.strong })).join("");
  const keys = [o.state === "signedOut" && "google", ["unlicensed", "expired"].includes(o.state) && "choose", o.state === "unassigned" && "connect",
    o.pick && "pick", o.recheck !== false && o.state !== "checking" && "recheck"].filter(Boolean);
  const rowH = keys.includes("google") ? 40 : 36, by = ny + nh + 12;
  let bx = 16;
  for (const k of keys) {
    if (k === "google") { res.at.google = [bx, by, GBTN_W, 40]; res.btn.google = gBtn(bx, by); bx += GBTN_W + 8; continue; }
    const [l, variant] = BTN[k], b = nkBtnBox(bx, by + (rowH - 36) / 2, l, { size: 14 });
    res.at[k] = b; res.btn[k] = nkBtn(b[0], b[1], l, { variant, size: 14, w: b[2] }); bx += b[2] + 8;
  }
  res.svg = s + Object.values(res.btn).join("");
  res.area = [0, top + H + 2, 399, by + rowH + 6 - (top + H + 2)];
  return res;
}
