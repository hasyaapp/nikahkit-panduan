// WhatsApp Web in Chrome at 1440x900 (generic layout, not measured): nav rail 0..64, chat list 64..504, the open chat
// from 504. The chat's footer holds attach +, the input and send; the input grows upward with its text (h px high).
import { C, rect, text, line, circle, icon, iconX } from "../lib.mjs";
import { chrome, CHROME_TOP } from "./kit.mjs";

export const WA = { green: "#00a884", bg: "#efeae2", bar: "#f0f2f5", ink: "#111b21", sub: "#667781", out: "#d9fdd3", line: "#e9edef" };
const T = CHROME_TOP;
export const WA_X = 504; // the open chat starts here
export const WA_HEAD = [WA_X + 1, T, 1440 - WA_X - 1, 60];
export const favWa = (cx, cy) => circle(cx, cy, 8, { fill: "#25d366" });

// Footer of the open chat for an input h px high (42 = one line): input box, footer area, send centre and its box.
export function waFootBox(h = 42) {
  const box = [WA_X + 52, 900 - 10 - h, 1440 - WA_X - 52 - 64, h], send = [1440 - 33, 900 - 31];
  return { box, area: [WA_X + 1, box[1] - 10, 1440 - WA_X - 1, h + 20], send, sendBox: [send[0] - 21, send[1] - 21, 42, 42] };
}

// The footer: empty input with "Ketik pesan" and a grey send, or (draft) an input for text drawn on top and a green send.
export function waFoot(h = 42, draft = false) {
  const { box, area, send } = waFootBox(h);
  return rect(...area, { fill: WA.bar }) + icon("plus", WA_X + 26, send[1], 22, "#54656f") + rect(...box, { r: 8, fill: C.white }) +
    (draft ? "" : text(box[0] + 14, box[1] + 26, "Ketik pesan", { size: 14, fill: WA.sub })) +
    circle(...send, 21, { fill: draft ? WA.green : WA.bar }) + icon("send", send[0] - 1, send[1], 18, draft ? C.white : "#8696a0");
}

// The screen with chat `name` open (also the selected chat list row). o.tabs: Chrome tabs before the WhatsApp tab;
// o.h, o.draft: the footer (waFoot).
export function waWeb(name, o = {}) {
  let s = chrome(0, 0, 1440, 900, { tabs: [...(o.tabs ?? []), { title: "WhatsApp", active: true, fav: favWa }], url: "web.whatsapp.com" }) +
    rect(0, T, 64, 900 - T, { fill: WA.bar }) + line(64.5, T, 64.5, 900, { stroke: WA.line }) +
    [0, 1, 2, 3].map((i) => circle(32, T + 34 + i * 52, 11, { stroke: "#54656f", sw: 1.6 })).join("") + circle(32, 900 - 34, 14, { fill: "#dfe5e7" }) +
    rect(65, T, WA_X - 65, 900 - T, { fill: C.white }) + text(84, T + 44, "WhatsApp", { size: 22, weight: 700, fill: WA.green }) +
    rect(80, T + 66, WA_X - 96, 36, { r: 18, fill: WA.bar }) + iconX("search", 102, T + 84, 16, "#54656f") + text(122, T + 89, "Cari", { size: 14, fill: WA.sub });
  for (let k = 0; k < 10; k++) {
    const ry = T + 118 + k * 72, on = k === 0;
    if (on) s += rect(72, ry, WA_X - 80, 72, { r: 10, fill: WA.bar });
    s += circle(108, ry + 36, 24, { fill: "#dfe5e7" }) + (on ? text(144, ry + 32, name, { size: 16, fill: WA.ink }) + rect(144, ry + 44, 210, 9, { r: 4.5, fill: WA.line })
      : rect(144, ry + 22, 120 + ((k * 37) % 90), 11, { r: 5.5, fill: WA.line }) + rect(144, ry + 44, 200 + ((k * 53) % 60), 9, { r: 4.5, fill: WA.bar }));
  }
  return s + line(WA_X + 0.5, T, WA_X + 0.5, 900, { stroke: WA.line }) + rect(...WA_HEAD, { fill: WA.bar }) + circle(WA_X + 34, T + 30, 20, { fill: "#dfe5e7" }) +
    text(WA_X + 66, T + 36, name, { size: 16, fill: WA.ink }) + iconX("search", 1440 - 80, T + 30, 18, "#54656f") + iconX("more-vertical", 1440 - 36, T + 30, 18, "#54656f") +
    rect(WA_X + 1, T + 60, 1440 - WA_X - 1, 900 - T - 60, { fill: WA.bg }) + waFoot(o.h, o.draft);
}

// A sent bubble (text drawn on top by the caller) with read ticks bottom right, and its time (e.g. "10.12") when given.
export const waBubble = (x, y, w, h, time) => rect(x, y, w, h, { r: 8, fill: WA.out }) +
  (time ? text(x + w - 40, y + h - 10, time, { size: 11, fill: WA.sub, anchor: "end" }) : "") +
  iconX("check", x + w - 26, y + h - 14, 13, "#53bdeb", 2.2) + iconX("check", x + w - 20, y + h - 14, 13, "#53bdeb", 2.2);
