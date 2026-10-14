// Dashboard pasangan: serah terima dari NikahKit, masuk, Beranda, Kirim, Tamu dan Ucapan, Hari-H, Pelacakan, Pengaturan.
// Layar HP digambar 390x844 dan layar laptop 1280x800 seperti tangkapan asli (/tmp/ref/dash-*, 14 Okt). Label, ukuran,
// warna, dan ikon diambil dari server/pages/src/{panel,dashboard,share,checkin} dan nikahkit/ext/pin.html; ikon WhatsApp
// dan template pesan dibaca langsung dari sumbernya supaya tidak bergeser dari aslinya.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { C, rect, text, line, circle, para, tw as libTw, shadow, icon, iconX, nkBtn, nkInput, nkLabel, nkHint, nkSwitch, nkH3, nkNote, nkLogo, nkHead, nkDialogHead, nkAcc, chrome, scalevEditor, favScalev, ring, dim } from "../lib.mjs";

// Lebar teks Roboto per huruf (em), lebih tepat dari tw() untuk menata baris daftar dan pil di layar dashboard.
const CW = { " ": 0.248, a: 0.544, b: 0.561, c: 0.523, d: 0.563, e: 0.53, f: 0.347, g: 0.561, h: 0.551, i: 0.243, j: 0.239, k: 0.507, l: 0.243, m: 0.876, n: 0.552, o: 0.57, p: 0.561, q: 0.568, r: 0.338, s: 0.516, t: 0.327, u: 0.551,
  v: 0.484, w: 0.751, x: 0.496, y: 0.473, z: 0.496, ".": 0.263, ",": 0.196, ":": 0.242, "·": 0.26, "-": 0.276, "&": 0.621, "/": 0.411, "?": 0.473, "(": 0.342, ")": 0.348, "@": 0.897, "+": 0.567, "=": 0.549,
  "…": 0.73, "!": 0.258, "%": 0.733, "*": 0.431, "_": 0.451, "[": 0.266, "]": 0.266, "'": 0.17, '"': 0.32, "•": 0.35, I: 0.272, J: 0.552, M: 0.873, W: 0.887, L: 0.538, E: 0.568, F: 0.553 };
const tw = (s, size = 14, weight = 400) => Math.round([...String(s)].reduce((a, ch) => a + (CW[ch] ?? (/[A-Z]/.test(ch) ? 0.65 : /[0-9]/.test(ch) ? 0.561 : 0.6)), 0) * size * (weight >= 600 ? 1.06 : weight >= 500 ? 1.03 : 1));

// ---- Sumber asli ------------------------------------------------------------------------------------------------------
const SRC = (p) => fs.readFileSync(fileURLToPath(new URL(`../../../server/pages/src/${p}`, import.meta.url)), "utf8");
// Peta ikon { nama: "<svg…>" } dari objek ICONS / LUCIDE_SVGS di halaman (urutan file = urutan menimpa, seperti di halaman).
function svgMap(src) {
  const out = {}, re = /["']?([\w-]+)["']?\s*:\s*(["'])(<svg[\s\S]*?<\/svg>)\2/g;
  for (let m; (m = re.exec(src)); ) out[m[1]] = m[2] === '"' ? m[3].replace(/\\"/g, '"') : m[3];
  return out;
}
const SHARE = SRC("share/index.html");
const WA = { ...svgMap(SHARE), ...svgMap(SRC("checkin/index.html")), ...svgMap(SRC("dashboard/index.html")), ...svgMap(SRC("panel/index.html")) };
// Ikon WhatsApp/Lucide dari halaman dashboard, size px, berpusat di (cx, cy).
function wa(name, cx, cy, size = 24, color = T.text) {
  const s = WA[name];
  if (!s) throw new Error(`ikon dashboard "${name}" tidak ada`);
  const head = /^<svg([^>]*)>/.exec(s)[1], inner = s.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "").replace(/currentColor/g, color);
  const a = (k) => (new RegExp(`\\s${k}="([^"]*)"`).exec(head) || [])[1];
  const vb = (a("viewBox") || "0 0 24 24").split(/\s+/).map(Number), k = size / vb[2];
  const fill = (a("fill") || color).replace("currentColor", color), stroke = a("stroke")?.replace("currentColor", color);
  const extra = ["stroke-width", "stroke-linecap", "stroke-linejoin"].map((n) => (a(n) ? ` ${n}="${a(n)}"` : "")).join("");
  return `<g transform="translate(${+(cx - size / 2).toFixed(2)} ${+(cy - (vb[3] * k) / 2).toFixed(2)}) scale(${+k.toFixed(4)})" fill="${fill}"${stroke ? ` stroke="${stroke}"` : ""}${extra}>${inner}</g>`;
}
// Template pesan "muslim" (pilihan bawaan Kirim undangan), apa adanya.
const MUSLIM = /muslim:\{label:"muslim",message:`([\s\S]*?)`\}/.exec(SHARE)[1];

// ---- Token dashboard (WhatsApp light, #svPanel / .wa #svDash / #svShareApp) ------------------------------------------
const T = { accent: "#1daa61", strong: "#15603e", soft: "#d9fdd3", text: "#0a0a0a", sub: "#666666", line: "#e6e6e6", outline: "#cccccc", wash: "#f7f5f3",
  hi: "#f6f5f4", wall: "#f5f1eb", system: "#fff0d4", danger: "#b80531", border: "#959393", railOn: "#ebe7e3", toast: "#242626", link: "#027eb5", amber: "#e3a008", grey: "#9e9e9e" };
// Warna foto profil tanpa gambar (AVATAR + avatarStyle di dashboard/share/checkin).
const AV = [["#cbf2ee", "#028377"], ["#ffdae7", "#d42a66"], ["#e8e0ff", "#5e47de"], ["#fee2d8", "#c4532d"], ["#d2e8fe", "#0063cb"], ["#fff0d4", "#9d6c2c"], ["#d9fdd3", "#1b8755"], ["#caecfa", "#027eb5"], ["#f4ded1", "#855538"], ["#fbd8dc", "#b80531"]];
const avc = (name) => { let h = 0; for (const c of String(name)) h = (h * 31 + c.charCodeAt(0)) % 997; return AV[h % AV.length]; };
// Inisial: Rekap (dua kata pertama) dan Kirim/Check-in (sapaan Bapak/Ibu/Keluarga dibuang).
const iniR = (n) => n.trim().split(/\s+/).filter((p) => p !== "&").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
const iniS = (n) => { const w = n.replace(/^(bapak|ibu|bpk\.?|kel\.?|keluarga)\s+/i, "").trim().split(/\s+/).filter((x) => x && x !== "&"); return ((w[0] || "?")[0] + (w[1] ? w[1][0] : "")).toUpperCase(); };

// ---- Teks ------------------------------------------------------------------------------------------------------------
const fit = (s, maxW, size = 14, weight = 400) => { if (tw(s, size, weight) <= maxW) return s; let t = s; while (t.length > 1 && tw(t + "…", size, weight) > maxW) t = t.slice(0, -1); return t.trimEnd() + "…"; };
function wrap(s, maxW, size = 14, weight = 400) {
  const out = [];
  for (const para of String(s).split("\n")) {
    if (!para.trim()) { out.push(""); continue; }
    let cur = "";
    for (const word of para.split(" ")) {
      const next = cur ? cur + " " + word : word;
      if (tw(next, size, weight) <= maxW) { cur = next; continue; }
      if (cur) out.push(cur);
      cur = word;
      while (tw(cur, size, weight) > maxW) { let k = cur.length; while (k > 1 && tw(cur.slice(0, k), size, weight) > maxW) k--; out.push(cur.slice(0, k)); cur = cur.slice(k); }
    }
    out.push(cur);
  }
  return out;
}

// ---- Layar HP (390x844, tanpa bingkai perangkat) ----------------------------------------------------------------------
const PX = 305, PY = 28, BG = "#eef1f5", PWORLD = { w: 1000, h: 900 };
const P = (x, y) => [PX + x, PY + y];
const ph = (...k) => `<g transform="translate(${PX} ${PY})">${k.join("")}</g>`;
// Bagian dunia yang tampil: layar HP saja (390x844) plus 10px di kiri-kanan untuk bayangan; hampir 1:1 di panggung.
const PCROP = { x: PX - 10, y: PY, w: 410, h: 844 };
const phoneBase = (fill) => [rect(0, 0, PWORLD.w, PWORLD.h, { fill: BG }), shadow(PX, PY, 390, 844, 2, 3), rect(PX, PY, 390, 844, { fill })];
// Penutup di luar layar (untuk isi yang bergulir); selalu tampil, paling atas.
const MASKS = rect(0, 0, PWORLD.w, PY, { fill: BG }) + rect(0, PY + 844, PWORLD.w, PWORLD.h, { fill: BG });
const SITE = "https://tokomu.myscalev.com/rani-dimas";

// Kepala tab (pane-header 64px): judul hijau 22px, tombol ikon 40px.
const head = (title, acts = "rekap") => rect(0, 0, 390, 64, { fill: "#fff" }) + text(16, 40, title, { size: 22, fill: T.accent }) +
  (acts === "rekap" ? wa("rotate-cw", 303, 32) + wa("download", 347, 32) : acts === "share" ? wa("menu", 361, 32) : "");
// Tab bawah (#svPanel .rail di HP): Beranda, Kirim, Tamu, Ucapan, Hari-H, lingkaran inisial.
const TABS = [["beranda", "Beranda", 36], ["kirim", "Kirim", 101], ["tamu", "Tamu", 166], ["ucapan", "Ucapan", 231], ["harih", "Hari-H", 296]];
const tabAt = (k) => P(TABS.find((t) => t[0] === k)[2], 806);
const ME = P(357, 809);
const tabbar = (active) => rect(0, 773, 390, 71, { fill: "#fff" }) + line(0, 773.5, 390, 773.5, { stroke: T.line }) +
  TABS.map(([k, l, x]) => (k === active ? rect(x - 32, 784, 64, 32, { r: 16, fill: T.soft }) : "") + wa(k, x, 800, 24, k === active ? T.strong : T.text) +
    text(x, 833, l, { size: 12, weight: 500, fill: T.text, anchor: "middle" })).join("") +
  circle(357, 809, 16, { fill: T.soft }) + text(357, 813.5, "RD", { size: 13, fill: T.strong, anchor: "middle" });
const search = (y, label, x0 = 20, w = 350) => rect(x0, y, w, 40, { r: 20, fill: T.hi }) + wa("search", x0 + 26, y + 20, 20, T.sub) + text(x0 + 48, y + 25, label, { size: 14, fill: T.sub });
// Pil filter (.fbtn / .chip): 32px, garis rgba(0,0,0,.2); yang aktif hijau muda.
function chips(y, items, active, x0 = 20) {
  let x = x0, svg = "";
  const at = [];
  items.forEach(([l, n], i) => {
    const lw = tw(l, 14, 500), nw = n == null ? 0 : tw(String(n), 12) + 6, w = lw + nw + 24, on = i === active;
    svg += rect(x + 0.5, y + 0.5, w - 1, 31, { r: 16, fill: on ? T.soft : "#fff", stroke: on ? "#bfe6b8" : T.outline }) + text(x + 12, y + 21, l, { size: 14, weight: 500, fill: on ? T.strong : T.sub }) +
      (n == null ? "" : text(x + 12 + lw + 6, y + 21, String(n), { size: 12, fill: on ? T.strong : T.sub }));
    at.push([x + w / 2, y + 16]);
    x += w + 8;
  });
  return { svg, at };
}
// Baris daftar ala chat: avatar 48, nama 16px + waktu, baris kedua 14px.
function row(y, o) {
  const x0 = o.x0 ?? 10, right = o.right ?? 365, [bg, fg] = avc(o.name), ax = x0 + 37, nx = x0 + 76;
  return (o.sel ? rect(x0, y, right + 15 - x0, 72, { r: 12, fill: T.hi }) : "") + circle(ax, y + 36, 24, { fill: bg }) + text(ax, y + 42, o.ini, { size: 17, fill: fg, anchor: "middle" }) +
    text(nx, y + 31, fit(o.name, right - nx - (o.time ? 50 : 0), 16), { size: 16, fill: T.text }) + (o.time ? text(right, y + 31, o.time, { size: 12, weight: 500, fill: T.sub, anchor: "end" }) : "") +
    l2(o.parts, right - nx)(nx, y + 54);
}
// Baris kedua: potongan { t, fill, w, icon }.
const l2 = (parts, maxW) => (x, y) => {
  let s = "", cx = x;
  for (const p of parts) {
    if (p.icon) { s += wa(p.icon, cx + 8, y - 5, 16, p.iconFill ?? p.fill ?? T.sub); cx += 19; }
    const str = fit(p.t, x + maxW - cx, 14, p.w ?? 400);
    s += text(cx, y, str, { size: 14, fill: p.fill ?? T.sub, weight: p.w });
    cx += tw(str, 14, p.w ?? 400) + 5;
    if (cx >= x + maxW) break;
  }
  return s;
};
const groupLabel = (y, s, x = 23) => text(x, y, s, { size: 13, weight: 500, fill: T.sub });
// Snackbar dashboard (#242626, 14px) berpusat di cx, sisi bawah di bottom.
const waToast = (cx, bottom, label) => { const w = tw(label, 14) + 44; return rect(cx - w / 2, bottom - 48, w, 48, { r: 4, fill: T.toast }) + text(cx, bottom - 19, label, { size: 14, fill: "#fff", anchor: "middle" }); };
const menuBox = (x, y, w, h) => rect(x, y + 6, w, h, { r: 16, fill: "rgba(0,0,0,.08)" }) + rect(x - 1, y + 2, w + 2, h + 1, { r: 17, fill: "rgba(0,0,0,.06)" }) + rect(x, y, w, h, { r: 16, fill: "#fff" });
const menuItem = (x, y, ic, label, danger) => wa(ic, x + 21, y + 20, 18, danger ? T.danger : T.sub) + text(x + 46, y + 25, label, { size: 15, fill: danger ? T.danger : T.text });
// Ekor gelembung chat (masuk = kiri, putih; keluar = kanan, hijau).
const tail = (x, y, side, fill) => side === "in" ? `<path d="M${x} ${y} h-6.5 q-2.6 0 -1.1 2.1 l7.6 9.9 z" fill="${fill}"/>` : `<path d="M${x} ${y} h6.5 q2.6 0 1.1 2.1 l-7.6 9.9 z" fill="${fill}"/>`;
const dayChip = (cx, y, s) => { const w = tw(s, 12, 500) + 26; return rect(cx - w / 2, y, w, 24, { r: 6, fill: "#fff" }) + text(cx, y + 16, s, { size: 12, weight: 500, fill: T.sub, anchor: "middle" }); };
const sysNote = (cx, y, s) => { const w = tw(s, 12.5) + 26; return rect(cx - w / 2, y, w, 29, { r: 7.5, fill: T.system }) + text(cx, y + 19, s, { size: 12.5, fill: T.sub, anchor: "middle" }); };
// Kepala percakapan (chat-bar): kembali, avatar 40, nama + keterangan, menu ⋮.
const chatBar = (name, ini, sub, o = {}) => rect(0, 64, 390, 3, { fill: "rgba(10,10,10,.05)" }) + rect(0, 0, 390, 64, { fill: "#fff" }) + wa("back", 24, 32) +
  (o.av === false ? "" : circle(72, 32, 20, { fill: avc(name)[0] }) + text(72, 37.5, ini, { size: 15, fill: avc(name)[1], anchor: "middle" })) +
  text(o.av === false ? 46 : 100, 29, name, { size: 16, fill: T.text }) + text(o.av === false ? 46 : 100, 47, sub, { size: 13, fill: T.sub }) + wa("menu", 362, 32);
// Grup detail (dt kiri, dd kanan abu-abu), tiap baris 52px di HP / 36px di laptop.
const detailGroup = (x, y, w, lines, lh = 52, size = 14) => rect(x, y, w, 8 + lines.length * lh, { r: 12, fill: "#fff" }) +
  lines.map(([dt, dd], i) => text(x + 16, y + 4 + i * lh + lh / 2 + 5, dt, { size, fill: T.text }) + text(x + w - 16, y + 4 + i * lh + lh / 2 + 5, dd, { size, fill: T.sub, anchor: "end" })).join("");

// ---- Beranda (HP), dengan data contoh --------------------------------------------------------------------------------
const STATS = [["Konfirmasi diterima", "61", ["4 masih ragu · 5 tidak", "hadir"]], ["Sudah datang", "0", ["tamu check-in di lokasi"]], ["Ucapan & doa", "47", ["dari tamu undangan"]], ["Tamu membuka", "140", ["312 kali undangan dibuka"]]];
const QUICK = [["external-link", "Lihat undangan", "Sebagai tamu"], ["send", "Kirim undangan", "Tautan per tamu"], ["scan-line", "Scan tamu datang", "Di lokasi acara"]];
const LIHAT_DAFTAR = [40, 350, 144, 36]; // tombol Lihat daftar tamu (lokal)
function homeContent() {
  let s = rect(0, 64, 390, 1100, { fill: T.wash }) + text(16, 103, "Ringkasan undangan", { size: 22, fill: T.text }) +
    para(16, 131, ["45 hari lagi · Akad Nikah, Sabtu, 28 November", "2026 pukul 08.00"], { size: 16, fill: T.sub, lh: 24 });
  // Kartu Estimasi tamu hadir + komposisi jawaban
  s += rect(16, 180, 358, 230, { r: 16, fill: "#fff" }) + text(40, 217, "Estimasi tamu hadir", { size: 14, fill: T.sub }) + text(38, 262, "128", { size: 40, fill: T.text }) +
    text(40, 281, "52 konfirmasi hadir", { size: 12, fill: T.sub }) +
    rect(40, 298, 310, 8, { r: 4, fill: "#e5e5e5" }) + rect(40, 298, 264, 8, { r: 4, fill: T.accent }) + rect(300, 298, 21, 8, { fill: T.amber }) + rect(321, 298, 29, 8, { r: 4, fill: T.grey }) + rect(318, 298, 6, 8, { fill: T.grey }) +
    [["Hadir", "52", T.accent, 40], ["Ragu", "4", T.amber, 120], ["Tidak hadir", "5", T.grey, 190]].map(([l, n, c, x]) => circle(x + 4, 326, 4, { fill: c }) + text(x + 14, 330, l, { size: 12, fill: T.sub }) + text(x + 18 + tw(l, 12) + 3, 330, n, { size: 12, weight: 600, fill: T.text })).join("") +
    rect(40.5, 350.5, 143, 35, { r: 18, fill: "#fff", stroke: T.outline }) + text(112, 373, "Lihat daftar tamu", { size: 14, weight: 500, fill: T.strong, anchor: "middle" });
  // Empat angka
  s += rect(16, 434, 358, 207, { r: 16, fill: "#fff" }) + STATS.map(([l, v, n], i) => {
    const x = i % 2 ? 200 : 36, y = 434 + (i > 1 ? 104 : 0);
    return text(x, y + 28, l, { size: 12, fill: T.sub }) + text(x, y + 61, v, { size: 24, weight: 500, fill: T.text }) + para(x, y + 80, n, { size: 12, fill: T.sub, lh: 16 });
  }).join("");
  // Tombol cepat
  s += QUICK.map(([ic, a, b], i) => { const y = 665 + i * 73; return rect(16, y, 358, 65, { r: 16, fill: "#fff" }) + circle(52, y + 33, 20, { fill: T.soft }) + wa(ic, 52, y + 33, 24, T.strong) + text(88, y + 32, a, { size: 16, weight: 500, fill: T.text }) + text(88, y + 52, b, { size: 12, fill: T.sub }); }).join("");
  // Kabar terbaru
  s += text(16, 923, "Kabar terbaru", { size: 16, weight: 500, fill: T.text }) + text(362, 923, "Lihat semua", { size: 14, weight: 500, fill: T.strong, anchor: "end" }) +
    rect(16, 944, 358, 152, { r: 16, fill: "#fff" }) +
    row(948, { x0: 24, right: 351, name: "Dewi Lestari", ini: iniR("Dewi Lestari"), time: "12 Okt", parts: [{ icon: "check", t: "Hadir", fill: T.strong }, { t: "· Selamat ya Rani & Dimas, semoga…" }] }) +
    row(1020, { x0: 24, right: 351, name: "Rudi Hartono", ini: iniR("Rudi Hartono"), time: "11 Okt", parts: [{ icon: "x", t: "Tidak hadir", fill: "#555" }, { t: "· Maaf belum bisa datang" }] });
  return s;
}
const HOME_STATIC = homeContent() + head("Beranda") + tabbar("beranda");

// ---- Tamu dan Ucapan (HP) --------------------------------------------------------------------------------------------
const GUESTS = [
  { name: "Dewi Lestari", time: "12 Okt", parts: [{ icon: "check", t: "Hadir", fill: T.strong }, { t: "· Selamat ya Rani & Dimas, semoga sakinah" }] },
  { name: "Rudi Hartono", time: "11 Okt", parts: [{ icon: "x", t: "Tidak hadir", fill: "#555" }, { t: "· Maaf belum bisa datang" }] },
  { name: "Sari Wulandari", time: "10 Okt", parts: [{ t: "Belum konfirmasi" }, { t: "· Belum mengirim konfirmasi" }] },
  { name: "Bapak Andi & Ibu Rina", time: "9 Okt", parts: [{ icon: "check", t: "Hadir", fill: T.strong }, { t: "· Barakallahu lakuma" }] }
];
const TAMU_ROW0 = 211;
const tamuChips = (active) => chips(116, [["Semua", 4], ["Hadir", 2], ["Masih ragu", 0], ["Tidak hadir", 1], ["Belum konfirmasi", 1], ["Sudah datang", 0]], active);
const TAMU_CHIP_AT = tamuChips(0).at;
// Kolom cari yang sedang diisi (placeholder hilang, tanda silang Hapus pencarian di kanan).
const searchOn = (y) => rect(20, y, 350, 40, { r: 20, fill: T.hi }) + wa("search", 46, y + 20, 20, T.sub) + wa("x", 344, y + 20, 20, T.sub);
function tamuList(o = {}) {
  const rows = o.rows ?? GUESTS;
  return rect(0, 0, 390, 844, { fill: "#fff" }) + head("Tamu") + (o.q ? searchOn(66) : search(66, "Cari nama, ucapan, atau nomor HP")) +
    `<svg x="0" y="100" width="370" height="60" viewBox="0 100 370 60" overflow="hidden">${tamuChips(o.active ?? 0).svg}</svg>` +
    text(20, 171, "Kehadiran dan ucapan.", { size: 13, fill: T.sub }) + text(370, 171, `${rows.length} tamu`, { size: 13, weight: 500, fill: T.sub, anchor: "end" }) +
    groupLabel(203, "Oktober 2026") + rows.map((g, i) => row(TAMU_ROW0 + i * 72, { ...g, ini: iniR(g.name) })).join("") + tabbar("tamu");
}
// Tab Ucapan: kotak centang (.pick-box 20px di HP) di kiri tiap baris; bar massal (hitungan + grid 2x2 tombol 44px) di atas daftar.
const UCAPAN = [["Dewi Lestari", "12 Okt", "· Selamat ya Rani & Dimas, semoga sakinah"], ["Rudi Hartono", "11 Okt", "· Maaf belum bisa datang"], ["Bapak Andi & Ibu Rina", "9 Okt", "· Barakallahu lakuma"]];
const BULK_H = 136;
const ucapanRowY = (i, picked = []) => 174 + (picked.length ? BULK_H : 0) + i * 72;
const pickBox = (y, on) => on
  ? rect(22, y, 20, 20, { r: 5, fill: T.accent }) + `<path d="M26.5 ${y + 10} l3.8 3.8 l7.2 -7.4" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`
  : rect(22.75, y + 0.75, 18.5, 18.5, { r: 5, fill: "#fff", stroke: T.border, sw: 1.5 });
function ucapanList(o = {}) {
  const picked = o.picked ?? [];
  let s = rect(0, 0, 390, 844, { fill: "#fff" }) + head("Ucapan") + search(66, "Cari nama, ucapan, atau nomor HP") +
    text(20, 129, "Ucapan dan doa.", { size: 13, fill: T.sub }) + text(370, 129, "3 ucapan", { size: 13, weight: 500, fill: T.sub, anchor: "end" });
  if (picked.length) s += rect(20.5, 140.5, 349, 123, { r: 12, fill: "#fff", stroke: "rgba(0,0,0,.12)" }) + text(36, 159, `${picked.length} dipilih`, { size: 12, weight: 500, fill: T.sub }) +
    [["Tampilkan"], ["Sembunyikan"], ["Hapus", true], ["Batal"]].map(([l, d], i) => { const x = i % 2 ? 197 : 24.5, y = i > 1 ? 216 : 168;
      return rect(x + 0.5, y + 0.5, 167.5, 43, { r: 22, fill: "#fff", stroke: T.outline }) + text(x + 84, y + 27, l, { size: 14, weight: 500, fill: d ? T.danger : T.strong, anchor: "middle" }); }).join("");
  s += groupLabel(ucapanRowY(0, picked) - 8, "Oktober 2026") + UCAPAN.map(([n, t, c], i) => { const y = ucapanRowY(i, picked);
    return pickBox(y + 26, picked.includes(i)) + row(y, { x0: 54, name: n, ini: iniR(n), time: t, parts: [{ t: i === 0 && o.replied ? "Sudah dibalas" : "Belum dibalas" }, { t: c }] }); }).join("");
  return s + tabbar("ucapan");
}
// Detail tamu Dewi Lestari (HP): gelembung ucapan, Info tamu, penyusun balasan.
const DET = (() => {
  const bub = wrap("Selamat ya Rani & Dimas, semoga menjadi keluarga sakinah, mawaddah, warahmah. Aamiin.", 286, 14.2);
  const bh = 6 + 31 + 6 + bub.length * 19 + 8 + 15, bTop = 116, bEnd = bTop + bh;
  const inBubble = rect(16, bTop, 305, bh, { r: 7.5, fill: "#fff" }) + rect(16, bTop, 10, 10, { fill: "#fff" }) + tail(16, bTop, "in", "#fff") +
    rect(19, bTop + 3, 298, 31, { r: 6, fill: "rgba(0,0,0,.05)" }) + text(27, bTop + 24, "Hadir · 2 orang", { size: 14.2, weight: 500, fill: T.text }) +
    para(25, bTop + 52, bub, { size: 14.2, fill: T.text, lh: 19 }) + text(314, bTop + bh - 8, "19.42", { size: 11, fill: T.sub, anchor: "end" });
  const info = (y) => text(20, y + 20, "Info tamu", { size: 14, fill: T.sub }) + detailGroup(16, y + 28, 358, [["Kehadiran", "Hadir"], ["Jumlah tamu", "2 orang"], ["Pihak keluarga", "Mempelai wanita"], ["Perkiraan datang", "Belum diisi"], ["Check-in", "Belum datang"]]);
  const replyTop = bEnd + 12, outY = replyTop + 36, outH = 6 + 19 + 8 + 15, infoB = outY + outH + 36;
  const compose = (label) => rect(0, 768, 390, 76, { fill: T.wall }) + rect(8, 786, 374, 52, { r: 26, fill: "rgba(0,0,0,.08)" }) + rect(8, 784, 374, 52, { r: 26, fill: "#fff" }) +
    text(29, 815, label, { size: 15, fill: T.sub }) + circle(357, 810, 20, { fill: T.accent }) + wa("send", 357, 810, 24, "#fff");
  return {
    detail: { svg: ph(rect(0, 0, 390, 844, { fill: T.wall }), dayChip(195, 80, "12 Oktober 2026"), inBubble, chatBar("Dewi Lestari", iniR("Dewi Lestari"), "Hadir · 2 orang · 082198765432")), enter: "fade" },
    infoA: ph(info(bEnd + 24)),
    composeA: ph(compose("Tulis balasan")),
    reply: ph(rect(0, 752, 390, 92, { fill: T.wall }), text(16, 772, "Balasan untuk Dewi Lestari", { size: 13, fill: T.sub }),
      rect(8, 786, 374, 52, { r: 26, fill: "rgba(0,0,0,.08)" }), rect(8, 784, 374, 52, { r: 26, fill: "#fff" }), wa("x", 313, 811, 24, T.text), circle(357, 811, 20, { fill: T.accent }), wa("send", 357, 811, 24, "#fff")),
    phReply: ph(text(29, 816, "Tulis ucapan terima kasih...", { size: 15, fill: T.grey })),
    typed: ph(text(29, 816, "Terima kasih doanya, Dewi!", { size: 15, fill: T.text })),
    out: ph(rect(0, replyTop, 390, 900, { fill: T.wall }), dayChip(195, replyTop, "14 Oktober 2026"),
      rect(374 - 228, outY, 228, outH, { r: 7.5, fill: T.soft }), rect(364, outY, 10, 10, { fill: T.soft }), tail(374, outY, "out", T.soft),
      text(374 - 219, outY + 21, "Terima kasih doanya, Dewi!", { size: 14.2, fill: T.text }), text(347, outY + outH - 8, "10.15", { size: 11, fill: T.sub, anchor: "end" }), wa("read", 359, outY + outH - 12, 16, T.link),
      info(infoB), compose("Ubah balasan")),
    saved: { svg: ph(waToast(195, 756, "Balasan berhasil disimpan.")), enter: "slide" }
  };
})();

// ---- Kirim undangan (HP) ---------------------------------------------------------------------------------------------
const FAB = P(345, 729);
const kirimTop = (counts, active = 0) => rect(0, 0, 390, 844, { fill: "#fff" }) + head("Kirim undangan", "share") + search(66, "Cari tamu") +
  chips(116, [["Semua", counts[0]], ["Belum dikirim", counts[1]], ["Terkirim", counts[2]]], active).svg;
const fab = () => rect(317, 703, 56, 56, { r: 16, fill: "rgba(0,0,0,.14)" }) + rect(317, 701, 56, 56, { r: 16, fill: T.accent }) + wa("newChat", 345, 729, 24, "#fff");
// Contoh tamu = isi placeholder kotak Tambah tamu (share/index.html).
const SENT_ROWS = (sent) => [
  { name: "Keluarga Besar Surya", parts: [{ t: "Belum dikirim:", fill: T.accent, w: 500 }, { t: "Belum ada nomor WA" }] },
  { name: "Bapak Andi & Ibu Rina", parts: [{ t: "Belum dikirim:", fill: T.accent, w: 500 }, { t: "+6281234567890" }] },
  sent ? { name: "Dewi Lestari", time: "10.12", parts: [{ icon: "read", t: "+6282198765432 · Sahabat · 2 orang" }] }
    : { name: "Dewi Lestari", parts: [{ t: "Belum dikirim:", fill: T.accent, w: 500 }, { t: "+6282198765432 · Sahabat · 2 orang" }] }
].map((g, i) => row(158 + i * 72, { ...g, ini: iniS(g.name) })).join("");

// Percakapan pratinjau (#chat): gelembung draf berisi kartu tautan + pesan muslim untuk Dewi Lestari, lalu penyusun pesan.
const GUEST_LINK = SITE + "?to=Dewi+Lestari&u=K7Q2MX";
function chatContent() {
  const msg = MUSLIM.replace(/\*\[nama\]\*/g, "*Dewi Lestari*").replace(/\[nama\]/g, "Dewi Lestari").replace(/\[link-undangan\]/g, GUEST_LINK);
  const bw = 305, bx = 374 - bw, inner = bw - 16;
  const lines = msg.split("\n").flatMap((l) => { const bold = /^\*[^*]+\*$/.test(l.trim()); return wrap(bold ? l.trim().slice(1, -1) : l, inner, 14.2, bold ? 600 : 400).map((t) => ({ t, bold, link: /^https?:/.test(l) })); });
  let y = 116;
  let s = rect(0, 0, 390, 2600, { fill: T.wall }) + dayChip(195, 80, "Belum dikirim");
  const bh = 6 + 66 + lines.length * 19 + 8 + 17;
  s += rect(bx, y, bw, bh, { r: 7.5, fill: T.soft }) + rect(bx + bw - 10, y, 10, 10, { fill: T.soft }) + tail(bx + bw, y, "out", T.soft) +
    rect(bx + 3, y + 3, bw - 6, 60, { r: 6, fill: "rgba(0,0,0,.05)" }) + rect(bx + 9, y + 9, 48, 48, { r: 4, fill: T.strong }) +
    text(bx + 33, y + 38, "R&D", { size: 14, fill: "#fff", anchor: "middle", italic: true, font: "Georgia,serif" }) +
    text(bx + 67, y + 29, "Undangan pernikahan", { size: 14.2, weight: 500, fill: T.text }) + text(bx + 67, y + 46, "tokomu.myscalev.com", { size: 12, fill: T.sub });
  lines.forEach((l, i) => (s += text(bx + 9, y + 66 + 15 + i * 19, l.t, { size: 14.2, fill: l.link ? T.link : T.text, weight: l.bold ? 600 : undefined })));
  s += text(bx + bw - 7, y + bh - 8, "Draf · belum dikirim", { size: 11, fill: T.sub, anchor: "end" });
  y += bh + 20;
  // Penyusun: pilihan teks + kotak pesan (tumbuh setinggi isi) + tombol kirim.
  let cx = 12;
  ["formal", "muslim", "nasrani", "hindu", "custom"].forEach((k) => { const w = tw(k, 13, 500) + 26; s += rect(cx + 0.5, y + 0.5, w - 1, 29, { r: 15, fill: k === "muslim" ? T.soft : "#fff", stroke: T.outline }) + text(cx + w / 2, y + 20, k, { size: 13, weight: 500, fill: k === "muslim" ? T.strong : T.sub, anchor: "middle" }); cx += w + 6; });
  s += rect(cx, y + 4, 1, 22, { fill: T.outline });
  const raw = wrap(MUSLIM, 286, 15);
  const ch = Math.max(52, 20 + raw.length * 22 + 10), cy = y + 38;
  s += rect(8, cy + 2, 374, ch, { r: 26, fill: "rgba(0,0,0,.08)" }) + rect(8, cy, 374, ch, { r: 26, fill: "#fff" }) +
    raw.map((t, i) => text(29, cy + 26 + i * 22, t, { size: 15, fill: T.text })).join("");
  const send = [356, cy + ch - 26];
  s += circle(send[0], send[1], 20, { fill: T.accent }) + wa("send", send[0], send[1], 24, "#fff");
  return { svg: s, bottom: cy + ch + 8, send };
}
const CHAT = chatContent();
const CHAT_DY = CHAT.bottom - 844;

// ---- Hari-H (HP) -----------------------------------------------------------------------------------------------------
const scanBar = () => rect(0, 64, 390, 3, { fill: "rgba(10,10,10,.05)" }) + rect(0, 0, 390, 64, { fill: "#fff" }) + text(16, 29, "Scan tamu", { size: 16, fill: T.text }) + text(16, 47, "/rani-dimas", { size: 13, fill: T.sub });
const pillBtn = (x, y, w, label, o = {}) => rect(x, y, w, 40, { r: 20, fill: o.soft ? T.soft : T.accent }) + text(x + w / 2, y + 25, label, { size: 15, weight: 500, fill: o.soft ? T.strong : "#fff", anchor: "middle" });
const linkBox = (y) => text(20, y + 13, "Atau tempel link tamu", { size: 13, fill: T.sub }) + rect(16, y + 25, 358, 52, { r: 26, fill: "rgba(0,0,0,.08)" }) + rect(16, y + 23, 358, 52, { r: 26, fill: "#fff" }) +
  text(37, y + 55, "https://…?to=Nama&u=KODE", { size: 16, fill: T.grey }) + circle(347, y + 49, 20, { fill: T.accent }) + wa("send", 347, y + 49, 24, "#fff");
const qrCode = (x, y, s) => { // pola QR tiruan (bukan kode nyata)
  const n = 21, c = s / n; let q = rect(x - 8, y - 8, s + 16, s + 16, { r: 4, fill: "#fff" });
  const finder = (fx, fy) => rect(x + fx * c, y + fy * c, 7 * c, 7 * c, { fill: "#111" }) + rect(x + (fx + 1) * c, y + (fy + 1) * c, 5 * c, 5 * c, { fill: "#fff" }) + rect(x + (fx + 2) * c, y + (fy + 2) * c, 3 * c, 3 * c, { fill: "#111" });
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const inF = (i < 8 && j < 8) || (i > 12 && j < 8) || (i < 8 && j > 12); if (!inF && ((i * 7 + j * 13 + i * j) % 5 < 2)) q += rect(x + i * c, y + j * c, c + 0.2, c + 0.2, { fill: "#111" }); }
  return q + finder(0, 0) + finder(14, 0) + finder(0, 14);
};
const DEWI = ["Dewi Lestari", "Sahabat · 2 orang", "10.12"], ANDI = ["Bapak Andi & Ibu Rina", "Keluarga · 2 orang", "10.20"];
const resultBox = (kind, [name, info] = DEWI) => kind === "ok"
  ? rect(16, 80, 358, 200, { r: 7.5, fill: T.soft }) + wa("read", 195, 130, 32, T.accent) + text(195, 177, name, { size: 28, weight: 500, fill: T.text, anchor: "middle" }) +
    text(195, 207, "Selamat datang", { size: 18, fill: T.strong, anchor: "middle" }) + text(195, 235, info, { size: 18, fill: T.strong, anchor: "middle" })
  : rect(16, 80, 358, 200, { r: 7.5, fill: T.system }) + text(195, 159, name, { size: 28, weight: 500, fill: T.text, anchor: "middle" }) +
    text(195, 189, "Sudah check-in pukul 10.12", { size: 18, fill: T.text, anchor: "middle" }) + text(195, 217, info, { size: 18, fill: T.text, anchor: "middle" });
const recentRow = (y, ok, [name, info, at] = DEWI) => row(y, { x0: 24, right: 351, name, ini: iniS(name), time: at, parts: [{ icon: "read", iconFill: ok ? T.accent : T.sub, t: (ok ? "Selamat datang · " : "Sudah check-in sebelumnya · ") + info }] });
// Kartu Check-in di perangkat ini (terbaru di atas): baris [ok, tamu].
const recentBox = (y, rows) => rect(16, y, 358, 52 + rows.length * 72, { r: 12, fill: "#fff" }) + text(32, y + 31, "Check-in di perangkat ini", { size: 14, weight: 500, fill: T.sub }) +
  rows.map(([ok, g], i) => recentRow(y + 44 + i * 72, ok, g)).join("");

// ---- Laptop (1280x800 di Chrome) -------------------------------------------------------------------------------------
const DY = 85;
const D = (x, y) => [x, DY + y];
const dg = (...k) => `<g transform="translate(0 ${DY})">${k.join("")}</g>`;
const RAILD = [["beranda", 30], ["kirim", 78], ["tamu", 126], ["ucapan", 174], ["harih", 222], ["pelacakan", 291]];
const railD = (active) => rect(0, 0, 64, 800, { fill: T.wash }) + line(63.5, 0, 63.5, 800, { stroke: T.line }) + line(20, 257, 44, 257, { stroke: T.line }) +
  RAILD.map(([k, y]) => (k === active ? circle(32, y, 20, { fill: T.railOn }) : "") + wa(k, 32, y, 24, k === active ? T.text : "#5c5c5c")).join("") +
  circle(33, 770, 16, { fill: T.soft }) + text(33, 774.5, "RD", { size: 13, fill: T.strong, anchor: "middle" });
function berandaDesk() {
  let s = rect(64, 0, 1216, 800, { fill: T.wash }) + rect(64, 0, 1216, 64, { fill: "#fff" }) + text(84, 40, "Beranda", { size: 22, fill: T.accent }) + wa("rotate-cw", 1204, 32) + wa("download", 1248, 32) +
    text(272, 110, "Ringkasan undangan", { size: 22, fill: T.text }) + text(272, 138, "45 hari lagi · Akad Nikah, Sabtu, 28 November 2026 pukul 08.00", { size: 16, fill: T.sub });
  s += rect(272, 164, 388, 236, { r: 16, fill: "#fff" }) + text(296, 202, "Estimasi tamu hadir", { size: 14, fill: T.sub }) + text(294, 248, "128", { size: 40, fill: T.text }) + text(296, 268, "52 konfirmasi hadir", { size: 12, fill: T.sub }) +
    rect(296, 286, 340, 8, { r: 4, fill: T.accent }) + rect(586, 286, 23, 8, { fill: T.amber }) + rect(609, 286, 27, 8, { r: 4, fill: T.grey }) + rect(606, 286, 6, 8, { fill: T.grey }) +
    text(296, 318, "Hadir 52   Ragu 4   Tidak hadir 5", { size: 12, fill: T.sub }) + rect(296.5, 340.5, 143, 35, { r: 18, fill: "#fff", stroke: T.outline }) + text(368, 363, "Lihat daftar tamu", { size: 14, weight: 500, fill: T.strong, anchor: "middle" });
  s += rect(684, 164, 388, 236, { r: 16, fill: "#fff" }) + STATS.map(([l, v, n], i) => { const x = i % 2 ? 886 : 704, y = 164 + (i > 1 ? 100 : 12); return text(x, y + 20, l, { size: 12, fill: T.sub }) + text(x, y + 52, v, { size: 24, weight: 500, fill: T.text }) + text(x, y + 72, n.join(" "), { size: 12, fill: T.sub }); }).join("");
  s += QUICK.map(([ic, a, b], i) => { const x = 272 + i * 269; return rect(x, 424, 261, 73, { r: 16, fill: "#fff" }) + circle(x + 36, 460, 20, { fill: T.soft }) + wa(ic, x + 36, 460, 24, T.strong) + text(x + 68, 456, a, { size: 16, weight: 500, fill: T.text }) + text(x + 68, 478, b, { size: 12, fill: T.sub }); }).join("");
  s += text(272, 553, "Kabar terbaru", { size: 16, weight: 500, fill: T.text }) + text(1055, 553, "Lihat semua", { size: 14, weight: 500, fill: T.strong, anchor: "end" }) + rect(272, 573, 800, 152, { r: 16, fill: "#fff" }) +
    row(577, { x0: 280, right: 1049, name: "Dewi Lestari", ini: iniR("Dewi Lestari"), time: "12 Okt", parts: GUESTS[0].parts }) + row(649, { x0: 280, right: 1049, name: "Rudi Hartono", ini: iniR("Rudi Hartono"), time: "11 Okt", parts: GUESTS[1].parts });
  return s;
}
// Pelacakan: daftar 40% (64..550) + panel percakapan (551..1280).
const TRACK = {
  dewi: { name: "Dewi Lestari", time: "12 Okt", parts: [{ t: "3 kali dibuka", fill: T.strong }, { t: "· Pertama dibuka 3 Okt · Perangkat 1/2" }] },
  hendra: { name: "Bapak Hendra", time: "11 Okt", parts: [{ t: "• Perangkat penuh ", fill: T.danger }, { t: "· Pertama dibuka 4 Okt · Perangkat 2/2" }] },
  rudi: { name: "Rudi Hartono", time: "9 Okt", parts: [{ t: "1 kali dibuka", fill: T.strong }, { t: "· Pertama dibuka 9 Okt · Perangkat 1/2" }] },
  surya: { name: "Keluarga Besar Surya", time: "", parts: [{ t: "Belum dibuka" }, { t: "· Tautan dibuat 2 Okt" }] },
  sari: { name: "Sari Wulandari", time: "", parts: [{ t: "Belum dibuka" }, { t: "· Tautan dibuat 2 Okt" }] }
};
const trackRows = (groups) => { let y = 270, s = ""; for (const [label, keys] of groups) { s += groupLabel(y + 28, label, 87); y += 36; for (const k of keys) { s += row(y, { x0: 74, right: 525, ...TRACK[k], ini: iniR(TRACK[k].name) }); y += 72; } } return s; };
const CHIPS_D = [["Semua", 5], ["Sudah dibuka", 3], ["Belum dibuka", 2], ["Perangkat penuh", 1]];
const chipsD = (active) => rect(84, 112, 446, 40, { fill: "#fff" }) + `<svg x="0" y="0" width="530" height="200" overflow="hidden">${chips(116, CHIPS_D, active, 84).svg}</svg>`;
const CHIP_AT = chips(116, CHIPS_D, 0, 84).at;
const countD = (n) => rect(470, 156, 62, 18, { fill: "#fff" }) + text(530, 171, `${n} tamu`, { size: 13, weight: 500, fill: T.sub, anchor: "end" });
const listPaneD = () => rect(64, 0, 487, 800, { fill: "#fff" }) + line(550.5, 0, 550.5, 800, { stroke: T.line }) + text(84, 40, "Pelacakan", { size: 22, fill: T.accent }) + wa("rotate-cw", 474, 32) + wa("download", 518, 32) +
  search(66, "Cari nama, ucapan, atau nomor HP", 84, 446) + text(84, 171, "Tautan tamu: dibuka atau belum, kapan, dan perangkatnya.", { size: 13, fill: T.sub }) +
  // Bar PIN tamu untuk HP baru (undangan khusus dengan "+ PIN untuk HP baru")
  rect(84.5, 182.5, 445, 77, { r: 10, fill: "#fff", stroke: T.line }) + text(97, 213, "PIN tamu untuk HP baru:", { size: 14, fill: T.text }) +
  text(262, 214, "7 3 1 9 0 5", { size: 18, weight: 700, fill: T.text }) + rect(372.5, 192.5, 71, 35, { r: 18, fill: "#fff", stroke: T.outline }) + text(408, 215, "Ganti", { size: 14, weight: 500, fill: T.strong, anchor: "middle" }) +
  text(97, 247, "Berikan ke tamu yang ganti HP. PIN ini tidak membuka dashboard.", { size: 12, fill: T.sub });
const emptyDetail = () => rect(551, 0, 729, 800, { fill: T.wall }) + circle(915, 375, 24, { fill: T.wash }) + wa("users", 915, 375, 20, T.sub) + text(915, 436, "Pilih tamu", { size: 16, fill: T.text, anchor: "middle" });
const HENDRA_INFO = [["Kehadiran", "Belum konfirmasi"], ["Jumlah tamu", "Tidak ada konfirmasi hadir"], ["Pihak keluarga", "Belum diisi"], ["Perkiraan datang", "Belum diisi"], ["Check-in", "Belum datang"]];
const HENDRA_TRACK = [["Status", "Perangkat penuh"], ["Dibuka", "5 kali"], ["Pertama dibuka", "4 Okt 2026 · 19.20"], ["Terakhir dibuka", "11 Okt 2026 · 08.05"], ["Perangkat", "2/2"], ["Tautan dibuat", "2 Okt 2026 · 14.30"], ["Kode tamu", "K7Q2MX"]];
const detailD = () => rect(551, 0, 729, 800, { fill: T.wall }) + rect(551, 64, 729, 3, { fill: "rgba(10,10,10,.05)" }) + rect(551, 0, 729, 64, { fill: "#fff" }) +
  circle(587, 32, 20, { fill: avc("Bapak Hendra")[0] }) + text(587, 37.5, iniR("Bapak Hendra"), { size: 15, fill: avc("Bapak Hendra")[1], anchor: "middle" }) +
  text(615, 29, "Bapak Hendra", { size: 16, fill: T.text }) + text(615, 47, "Belum konfirmasi", { size: 13, fill: T.sub }) + wa("menu", 1244, 32) +
  sysNote(915, 84, "Tamu ini belum mengirim konfirmasi atau ucapan.") +
  text(679, 183, "Info tamu", { size: 14, fill: T.sub }) + detailGroup(675, 192, 480, HENDRA_INFO, 36) +
  text(679, 414, "Aktivitas undangan", { size: 14, fill: T.sub }) + detailGroup(675, 422, 480, HENDRA_TRACK, 36);
const ddPatch = (i, s) => rect(1000, 426 + i * 36 + 6, 140, 24, { fill: "#fff" }) + text(1139, 426 + i * 36 + 23, s, { size: 14, fill: T.sub, anchor: "end" });

// ---- Editor Scalev + jendela PIN NikahKit ------------------------------------------------------------------------------
const EY = 85; // editor di bawah toolbar Chrome
const SY = EY - 50; // isi dialog Bagikan (tanpa catatan "Perubahan belum disimpan", jadi naik 50px dari ukuran QA)
const bagikan = () => nkDialogHead(0, EY, "Bagikan") +
  nkLabel(16, SY + 231, "Nama tamu") + nkInput(16, SY + 239, 366, "Nama Tamu") + nkHint(16, SY + 295, "Ditambahkan sebagai ?to=Nama.") +
  rect(16, SY + 311, 366, 52, { r: 4, fill: C.mutedBg }) + para(26, SY + 332, ["https://tokomu.myscalev.com/rani-dimas?", "to=Nama+Tamu"], { size: 12, fill: C.strong, lh: 18 }).replace("<text", `<text font-family="'Roboto Mono',ui-monospace,Menlo,monospace"`) +
  nkBtn(16, SY + 375, "Lihat sebagai tamu", { w: 366, size: 14, icon: "eye" }) + nkBtn(16, SY + 419, "Salin tautan tamu", { w: 366, size: 14, icon: "copy", variant: "ghost" }) +
  nkBtn(16, SY + 463, "Salin tautan umum", { w: 366, size: 14, icon: "link", variant: "quiet" }) +
  nkH3(16, SY + 535, "Undangan khusus") + text(16, SY + 572, "Undangan khusus", { size: 14, fill: C.text }) + nkSwitch(346, SY + 557, false) +
  para(16, SY + 601, ["Isi undangan tidak ada di kode halaman. Server Nikahin", "mengirimnya hanya ke tamu dengan tautan sah."], { size: 12, fill: C.faint, lh: 16 }) +
  nkH3(16, SY + 653, "Untuk pengantin") + nkBtn(16, SY + 665, "Kirim undangan", { w: 366, size: 14, icon: "link", variant: "ghost" }) +
  nkBtn(16, SY + 709, "Buka Dashboard", { w: 366, size: 14, icon: "layout-grid", variant: "quiet" }) + nkHint(16, SY + 761, "Masuk dengan PIN dashboard.") +
  nkH3(16, SY + 801, "PIN dashboard") + nkHint(16, SY + 865, "PIN hanya tampil di jendela NikahKit.");
const KELOLA = [16, SY + 813];
// pin.html dalam dialog Scalev (src/pin-frame.js): kartu 440px, sudut 8px. revealed = setelah Lihat PIN.
const DLG_X = 500;
const dlgTop = (revealed) => (revealed ? 535 - 282 : 535 - 233);
function pinDialog(revealed) {
  const x = DLG_X, y = dlgTop(revealed), h = revealed ? 564 : 466, card = (cy, ch) => rect(x + 16.5, cy + 0.5, 407, ch - 1, { r: 8, fill: "#fff", stroke: C.line });
  let s = rect(x - 2, y + 4, 444, h + 2, { r: 10, fill: "rgba(16,24,40,.10)" }) + rect(x, y, 440, h, { r: 8, fill: C.page }) +
    nkLogo(x + 32, y + 36, 32) + text(x + 58, y + 34, "NikahKit", { size: 16, weight: 700, fill: C.strong }) + text(x + 58, y + 54, "ID 365671", { size: 12, fill: C.faint }) + iconX("x", x + 410, y + 30, 20, C.text) +
    text(x + 16, y + 90, "rina.wo@gmail.com", { size: 12, weight: 700, fill: C.strong }) + text(x + 424, y + 90, "Keluar", { size: 12, weight: 500, fill: C.strong, anchor: "end", underline: true }) +
    card(y + 108, 85) + nkH3(x + 32, y + 136, "Paket") + text(x + 32, y + 162, "Paket Tahunan, aktif sampai 14 Oktober 2027.", { size: 14, fill: C.text });
  const pc = y + 205, ph2 = revealed ? 160 : 112;
  s += card(pc, ph2) + nkH3(x + 32, pc + 28, "PIN dashboard") + nkHint(x + 32, pc + 50, "PIN aktif (versi 1). Lupa? Lihat lagi kapan saja.");
  const by = pc + (revealed ? 108 : 60);
  if (revealed) s += rect(x + 32, pc + 60, 296, 40, { r: 4, fill: C.mutedBg }) + text(x + 44, pc + 86, "4 8 2 9 1 3", { size: 16, weight: 700, fill: C.strong, mono: true }) +
    icon("copy", x + 350, pc + 80, 18, C.text) + icon("message-circle", x + 390, pc + 80, 18, C.text);
  s += nkBtn(x + 32, by, "Lihat PIN", { size: 14 }) + nkBtn(x + 32 + libTw("Lihat PIN", 14, 500) + 32, by, "Buat PIN baru", { size: 14, variant: "quiet" });
  const bc = pc + ph2 + 12;
  s += card(bc, 121) + nkH3(x + 32, bc + 28, "Bisnis Scalev") + text(x + 32, bc + 54, "Rina WO (@rinawo)", { size: 14, fill: C.text }) + nkBtn(x + 32, bc + 70, "Hubungkan ulang", { size: 14, variant: "quiet" });
  return { svg: s, lihat: [x + 32 + (libTw("Lihat PIN", 14, 500) + 24) / 2, by + 18], noteY: bc + 133, handover: [x + 390, pc + 80] };
}
const DLG_A = pinDialog(false), DLG_B = pinDialog(true);
const pinNote = (s) => nkNote(DLG_X + 16, DLG_B.noteY, 408, [s], { h: 38 });

const SCENES = {
  // 1. Member: salin pesan serah terima untuk pengantin (Bagikan > Kelola PIN dashboard > Lihat PIN > balon chat).
  "pasangan-salin-pesan": (() => {
    const msg = ["Undangan siap: " + SITE, "Kelola undangan (kirim ke tamu, RSVP, ucapan, check-in): https://tokomu.myscalev.com/kelola?w=365671&link=https%3A%2F%2Ftokomu.myscalev.com%2Frani-dimas", "PIN: 482913"]
      .flatMap((l) => wrap(l, 372, 14));
    const bx = 24, by = 250, bh = 24 + msg.length * 20 + 16;
    return {
      title: "Menyalin pesan serah terima untuk pengantin",
      world: { x: 0, y: 96, w: 1000, h: 820 },
      base: [chrome(0, 0, 1440, 985, { tabs: [{ title: "Landing Page Studio", active: true, fav: favScalev }], url: "app.scalev.com/pages/365671" }),
        scalevEditor(0, EY, { rail: "Konten", page: "Undangan Rani & Dimas", user: "Rina" }),
        nkHead(0, EY, "Konten") + nkLabel(88, EY + 192, "Bahasa undangan") + nkInput(88, EY + 200, 279, "Indonesia", { select: true }) +
          para(88, EY + 256, ["Hanya halaman tamu. Teks bawaan ikut berganti;", "teks yang sudah diubah tetap."], { size: 12, fill: C.faint, lh: 16 }) +
          nkAcc(88, EY + 300, 279, "Sampul", { badge: "Terisi" }) + nkAcc(88, EY + 358, 279, "Mempelai", { badge: "Terisi" }),
        text(922, EY + 300, "Rani & Dimas", { size: 34, fill: "#8a3b2b", anchor: "middle", italic: true, font: "Georgia,serif" }) + text(922, EY + 340, "Sabtu, 28 November 2026", { size: 15, fill: "#5a4636", anchor: "middle", font: "Georgia,serif" })],
      els: {
        share: { svg: bagikan(), enter: "fade" },
        kelola: nkBtn(KELOLA[0], KELOLA[1], "Kelola PIN dashboard", { w: 366, size: 14, icon: "lock" }),
        backdrop: { svg: dim(0, EY, 1440, 900), enter: "fade" },
        dlgA: { svg: DLG_A.svg, enter: "pop" },
        dlgB: { svg: DLG_B.svg + pinNote("PIN aktif saat ini. Tetap berlaku sampai Anda membuat PIN baru."), enter: "fade" },
        tip: { svg: rect(DLG_B.handover[0] - 96, DLG_B.handover[1] + 24, 192, 24, { r: 4, fill: "#fff", stroke: "#c4c7c5" }) + text(DLG_B.handover[0], DLG_B.handover[1] + 40, "Salin pesan untuk pengantin", { size: 12, fill: C.crText, anchor: "middle" }), enter: "fade" },
        copied: { svg: pinNote("Pesan tersalin."), enter: "fade" },
        bubble: { svg: rect(bx, by + 2, 404, bh, { r: 8, fill: "rgba(0,0,0,.08)" }) + rect(bx, by, 404, bh, { r: 8, fill: T.soft }) +
          para(bx + 16, by + 30, msg, { size: 14, fill: T.text, lh: 20 }), enter: "rise" }
      },
      steps: [
        { caption: "Di editor undangan, klik Bagikan di lajur kiri NikahKit.", at: [36, EY + 584], click: true, show: ["share", "kelola"] },
        { caption: "Klik Kelola PIN dashboard. Jendela NikahKit terbuka di atas editor.", at: [KELOLA[0] + 183, KELOLA[1] + 18], click: true, press: "kelola", show: ["backdrop", "dlgA"] },
        { caption: "Di bagian PIN dashboard, klik Lihat PIN. PIN 6 angka tampil.", at: DLG_A.lihat, click: true, show: ["dlgB"] },
        { caption: "Klik ikon balon chat: Salin pesan untuk pengantin.", at: DLG_B.handover, click: true, hover: "tip", show: ["copied"], dur: 3.6 },
        { caption: "Pesan berisi link undangan, link kelola undangan, dan PIN. Tempel di WA.", show: ["bubble"], dur: 4.4 }
      ]
    };
  })(),

  // 2. Masuk dashboard di HP (gerbang #gate di panel/index.html).
  "pasangan-masuk": (() => {
    const dots = () => Array.from({ length: 6 }, (_, i) => circle(52 + i * 11, 420, 3.6, { fill: T.text })).join("");
    const pinBox = [P(46, 0)[0], P(0, 408)[1], 70, 24];
    return {
      title: "Masuk ke Dashboard pasangan dengan PIN",
      world: PCROP,
      base: [...phoneBase(T.wash), ph(rect(16, 249, 358, 305, { r: 24, fill: "#fff" }), text(195, 297, "Kelola undangan", { size: 22, fill: T.text, anchor: "middle" }),
        para(195, 326, ["Kirim undangan, lihat RSVP dan ucapan, dan catat", "tamu di hari-H. Semuanya dari sini."], { size: 14, fill: T.sub, anchor: "middle", lh: 20 }),
        text(36, 388, "PIN atau kode staff", { size: 14, fill: T.sub }), rect(36.5, 398.5, 317, 43, { r: 8, fill: "#fff", stroke: T.border }),
        wa("lock", 73, 586, 14, T.sub), text(86, 591, "PIN hanya diingat selama tab ini terbuka.", { size: 13, fill: T.sub }))],
      els: {
        hint: ph(text(48, 425, "••••••", { size: 16, fill: T.sub })),
        focus: ph(rect(37, 399, 316, 42, { r: 8, fill: "#fff", stroke: T.accent, sw: 2 })),
        pin1: ph(dots()),
        pin2: ph(rect(40, 402, 300, 36, { fill: "#fff" }), dots()),
        btn: ph(rect(36, 458, 318, 40, { r: 20, fill: T.accent }), text(195, 483, "Masuk", { size: 15, weight: 500, fill: "#fff", anchor: "middle" })),
        err: ph(text(195, 526, "PIN salah.", { size: 14, fill: T.danger, anchor: "middle" })),
        home: { svg: ph(HOME_STATIC), enter: "fade" },
        nTab: ring(PX + 4, PY + 782, 324, 56, { r: 12 }),
        nMe: ring(PX + 341, PY + 793, 32, 32, { r: 16 }),
        masks: MASKS
      },
      steps: [
        { caption: "Pengantin membuka link dashboard dari WA, lalu mengetuk kolom PIN.", at: P(195, 420), click: true, show: ["focus"], dur: 3.4 },
        { caption: "Ketik PIN 6 angka (pengantin) atau kode staff 8 karakter (staff).", hide: ["hint"], show: ["pin1"], type: [{ id: "pin1", n: 6, box: pinBox }], dur: 2.8 },
        { caption: "Tekan Masuk. Kalau salah, muncul tulisan merah: PIN salah.", at: P(195, 478), click: true, press: "btn", show: ["err"] },
        { caption: "Hapus, lalu ketik ulang PIN yang benar.", hide: ["pin1"], show: ["pin2"], type: [{ id: "pin2", n: 6, box: pinBox }], dur: 2.8 },
        { caption: "Tekan Masuk. PIN benar: Beranda terbuka.", at: P(195, 478), click: true, press: "btn", show: ["home"], dur: 3.4 },
        { caption: "Tab ada di bawah layar. Lingkaran inisial di kanan membuka menu akun.", at: P(270, 240), show: ["nTab", "nMe"], dur: 3.8 }
      ]
    };
  })(),

  // 3. Beranda (home-view rekap): hitung mundur, estimasi hadir, empat angka, tombol cepat.
  "pasangan-beranda": {
    title: "Membaca Beranda Dashboard pasangan",
    world: PCROP, cursorStart: P(270, 240),
    base: [...phoneBase(T.wash)],
    els: {
      home: ph(homeContent()),
      chromeTop: ph(head("Beranda"), tabbar("beranda")),
      n1: ring(PX + 12, PY + 112, 366, 52),
      n2: ring(PX + 16, PY + 180, 358, 230, { r: 16 }),
      n3: ring(PX + 16, PY + 104, 358, 207, { r: 16 }),
      n4: ring(PX + 16, PY + 335, 358, 211, { r: 16 }),
      tamu: { svg: ph(tamuList()), enter: "fade" },
      masks: MASKS
    },
    steps: [
      { caption: "Beranda terbuka pertama kali setelah masuk.", dur: 2.8 },
      { caption: "Di bawah judul: berapa hari lagi menuju acara utama.", show: ["n1"] },
      { caption: "Estimasi tamu hadir menjumlahkan orang dari RSVP Hadir.", hide: ["n1"], show: ["n2"] },
      { caption: "Gulir: konfirmasi, sudah datang, ucapan, dan tamu membuka.", scroll: { id: "home", dy: 330 }, hide: ["n2"], show: ["n3"], dur: 3.4 },
      { caption: "Tombol cepat: Lihat undangan, Kirim undangan, Scan tamu datang.", hide: ["n3"], show: ["n4"] },
      { caption: "Gulir ke atas, tekan Lihat daftar tamu: tab Tamu terbuka.", scroll: { id: "home", dy: -330 }, at: P(LIHAT_DAFTAR[0] + 72, LIHAT_DAFTAR[1] + 18), click: true, hide: ["n4"], show: ["tamu"], dur: 3.8 }
    ]
  },

  // 4. Kirim undangan (share/index.html di HP).
  "pasangan-kirim": (() => {
    const dewi = P(200, 158 + 144 + 36);
    return {
      title: "Mengirim undangan per tamu lewat WhatsApp",
      world: PCROP,
      base: [...phoneBase("#fff"), ph(kirimTop([0, 0, 0]), text(195, 452, "Belum ada tamu", { size: 16, fill: T.text, anchor: "middle" }),
        para(195, 478, ["Tekan tombol tambah untuk menempel daftar", "tamu dari WhatsApp, Excel, atau catatan."], { size: 14, fill: T.sub, anchor: "middle", lh: 20 }), fab(), tabbar("kirim"))],
      els: {
        fab: ph(fab()),
        drawer: ph(rect(0, 0, 390, 773, { fill: "#fff" }), wa("back", 36, 32), text(64, 38, "Tambah tamu", { size: 16, weight: 500, fill: T.text }),
          text(20, 90, "Daftar tamu, satu per baris", { size: 14, fill: T.sub }), rect(20.5, 100.5, 349, 179, { r: 8, fill: "#fff", stroke: T.border }),
          para(20, 302, ["Format: nama - nomor WA - kategori - jumlah orang.", "Hanya nama yang wajib. Bisa ditempel langsung dari", "WhatsApp, Excel, atau catatan. File CSV: kolom", "nama, no wa, kategori, jumlah."], { size: 13, fill: T.sub, lh: 17 }),
          pillBtn(20, 390, 136, "Simpan daftar"), pillBtn(164, 390, 104, "Impor CSV", { soft: true })),
        ph1: ph(para(32, 126, ["Keluarga Besar Surya", "Bapak Andi & Ibu Rina - 081234567890", "Dewi Lestari - 082198765432 - Sahabat - 2"], { size: 16, fill: T.grey, lh: 24 })),
        paste: { svg: ph(rect(22, 102, 346, 176, { r: 7, fill: "#fff" }), rect(21, 101, 348, 178, { r: 8, stroke: T.accent, sw: 2 }),
          para(32, 126, ["Keluarga Besar Surya", "Bapak Andi & Ibu Rina - 081234567890", "Dewi Lestari - 082198765432 - Sahabat - 2"], { size: 16, fill: T.text, lh: 24 })), enter: "fade" },
        list: { svg: ph(kirimTop([3, 3, 0]), SENT_ROWS(false), fab(), tabbar("kirim")), enter: "fade" },
        ready: { svg: ph(waToast(195, 684, "3 tamu siap.")), enter: "slide" },
        chat: { svg: ph(CHAT.svg), enter: "fade" },
        chatTop: { svg: ph(chatBar("Dewi Lestari", "", "+6282198765432", { av: false })), enter: "fade" },
        opened: { svg: ph(waToast(195, 684, "WhatsApp dibuka untuk Dewi Lestari.")), enter: "slide" },
        sent: { svg: ph(kirimTop([3, 2, 1]), SENT_ROWS(true), fab(), tabbar("kirim")), enter: "fade" },
        masks: MASKS
      },
      steps: [
        { caption: "Buka tab Kirim. Tekan tombol tambah hijau di kanan bawah.", at: FAB, click: true, press: "fab", show: ["drawer", "ph1"] },
        { caption: "Tempel daftar tamu, satu per baris. Hanya nama yang wajib.", at: P(195, 190), click: true, hide: ["ph1"], show: ["paste"], dur: 3.4 },
        { caption: "Tekan Simpan daftar. Muncul 3 tamu siap, masing-masing dengan tautan.", at: P(88, 410), click: true, show: ["list", "ready"], dur: 3.6 },
        { caption: "Ketuk nama tamu. Pratinjau pesan dengan tautan pribadinya muncul.", at: dewi, click: true, hide: ["ready"], show: ["chat", "chatTop"], dur: 3.6 },
        { caption: "Gulir ke bawah, tekan tombol kirim hijau. WhatsApp terbuka.", scroll: { id: "chat", dy: CHAT_DY }, at: P(CHAT.send[0], CHAT.send[1] - CHAT_DY), click: true, show: ["opened"], dur: 4 },
        { caption: "Kembali ke daftar: tamu itu bercentang dan masuk hitungan Terkirim.", at: P(24, 32), click: true, hide: ["opened"], show: ["sent"], dur: 3.8 }
      ]
    };
  })(),

  // 5. Tab Tamu: buka, saring, cari, detail seperti chat, kembali.
  "pasangan-tamu": (() => {
    const hadir = [GUESTS[0], GUESTS[3]];
    return {
      title: "Melihat daftar tamu dan detailnya",
      world: PCROP,
      base: [...phoneBase("#fff"), ph(HOME_STATIC)],
      els: {
        list: { svg: ph(tamuList()), enter: "fade" },
        hadir: { svg: ph(tamuList({ active: 1, rows: hadir })), enter: "fade" },
        res: { svg: ph(tamuList({ active: 1, rows: [GUESTS[0]], q: true })), enter: "fade", delay: 1.4 },
        qbox: ph(searchOn(66)),
        qtxt: ph(text(68, 91, "Dewi", { size: 14, fill: T.text })),
        sel: ph(rect(10, TAMU_ROW0, 370, 72, { r: 12, fill: T.hi }), row(TAMU_ROW0, { ...GUESTS[0], ini: iniR(GUESTS[0].name) })),
        detail: DET.detail, infoA: DET.infoA, composeA: DET.composeA,
        masks: MASKS
      },
      steps: [
        { caption: "Buka tab Tamu. Muncul Kehadiran dan ucapan dan jumlah tamu.", at: tabAt("tamu"), click: true, show: ["list"] },
        { caption: "Saring daftar: tekan Hadir. Angka di tombol menunjukkan jumlahnya.", at: P(TAMU_CHIP_AT[1][0], 132), click: true, show: ["hadir"] },
        { caption: "Cari tamu: ketik nama di kolom Cari nama, ucapan, atau nomor HP.", at: P(160, 86), click: true, show: ["res", "qbox", "qtxt"], type: [{ id: "qtxt", n: 4, box: [PX + 68, PY + 76, 34, 20] }], dur: 4 },
        { caption: "Buka detail tamu: ketuk namanya. RSVP, ucapan, dan Info tamu tampil.", at: P(200, TAMU_ROW0 + 36), click: true, show: ["sel", "detail", "infoA", "composeA"], dur: 3.6 },
        { caption: "Tekan panah kiri untuk kembali ke daftar tamu.", at: P(24, 32), click: true, hide: ["sel", "detail", "infoA", "composeA"] }
      ]
    };
  })(),

  // 6. Tab Ucapan: buka, balas, menu ⋮, pilih banyak.
  "pasangan-ucapan": (() => {
    const menu = [["pencil", "Ubah ucapan"], ["eye-off", "Sembunyikan ucapan"], ["del", "Hapus balasan", true], ["lock-open", "Buka kunci perangkat"], ["del", "Hapus data tamu", true]];
    return {
      title: "Membalas ucapan dan memilih banyak ucapan",
      world: PCROP,
      base: [...phoneBase("#fff"), ph(tamuList())],
      els: {
        ucapan: { svg: ph(ucapanList()), enter: "fade" },
        sel: ph(rect(54, ucapanRowY(0), 326, 72, { r: 12, fill: T.hi }), row(ucapanRowY(0), { x0: 54, name: UCAPAN[0][0], ini: iniR(UCAPAN[0][0]), time: UCAPAN[0][1], parts: [{ t: "Belum dibalas" }, { t: UCAPAN[0][2] }] })),
        ...DET,
        menu: { svg: ph(menuBox(142, 56, 232, 221), ...menu.map(([ic, l, d], i) => menuItem(150, 64 + i * 41, ic, l, d))), enter: "pop", origin: P(362, 40) },
        back: { svg: ph(ucapanList({ replied: true })), enter: "fade" },
        pick1: ph(ucapanList({ replied: true, picked: [1] })),
        pick2: ph(ucapanList({ replied: true, picked: [1, 2] })),
        masks: MASKS
      },
      steps: [
        { caption: "Buka tab Ucapan. Tiap baris bertanda Belum dibalas atau Sudah dibalas.", at: tabAt("ucapan"), click: true, show: ["ucapan"] },
        { caption: "Balas ucapan: ketuk ucapannya. Detail terbuka seperti chat.", at: P(200, ucapanRowY(0) + 36), click: true, show: ["sel", "detail", "infoA", "composeA"] },
        { caption: "Tekan Tulis balasan di bawah.", at: P(150, 810), click: true, show: ["reply", "phReply"], dur: 2.8 },
        { caption: "Ketik balasan, maksimal 500 huruf.", hide: ["phReply"], show: ["typed"], type: [{ id: "typed", n: 26, box: [PX + 29, PY + 798, 196, 24] }], dur: 2.8 },
        { caption: "Tekan tombol kirim. Muncul Balasan berhasil disimpan.", at: P(357, 811), click: true, show: ["out", "saved"], dur: 3.6 },
        { caption: "Menu ⋮ di kanan atas: ubah, sembunyikan, hapus, buka kunci perangkat.", at: P(362, 32), click: true, hide: ["saved"], show: ["menu"], dur: 3.8 },
        { caption: "Tutup menu dan kembali. Ucapan itu kini Sudah dibalas.", at: P(24, 32), click: true, hide: ["menu"], show: ["back"] },
        { caption: "Pilih banyak: centang kotak di kiri ucapan. Bar dipilih muncul.", at: P(32, ucapanRowY(1) + 36), click: true, show: ["pick1"] },
        { caption: "Centang lagi, lalu pilih Tampilkan, Sembunyikan, Hapus, atau Batal.", at: P(32, ucapanRowY(2, [1]) + 36), click: true, hide: ["pick1"], show: ["pick2"], dur: 3.8 }
      ]
    };
  })(),

  // 6. Hari-H (checkin/index.html di dalam dashboard).
  "pasangan-hari-h": {
    title: "Check-in tamu di hari-H",
    world: PCROP,
    base: [...phoneBase(T.wash), ph(HOME_STATIC)],
    els: {
      scan: { svg: ph(rect(0, 0, 390, 844, { fill: T.wall }), pillBtn(16, 80, 358, "Buka kamera"), linkBox(132)), enter: "fade" },
      cam: ph(rect(0, 64, 390, 1000, { fill: T.wall }), rect(16, 80, 358, 358, { r: 7.5, fill: "#0b141a" }), rect(36, 100, 318, 318, { r: 6, fill: "#18242c" }),
        pillBtn(16, 450, 358, "Tutup kamera"), text(195, 515, "Arahkan ke QR tamu.", { size: 13, fill: T.sub, anchor: "middle" }), linkBox(524)),
      qr: { svg: ph(rect(110, 150, 170, 218, { r: 14, fill: "#2c3a43" }), rect(118, 160, 154, 198, { r: 8, fill: "#fdf6ee" }), qrCode(139, 200, 112)), enter: "rise" },
      ok: ph(rect(0, 64, 390, 228, { fill: T.wall }), resultBox("ok")),
      warn: ph(rect(0, 64, 390, 228, { fill: T.wall }), resultBox("warn")),
      // Halaman Scan setelah dua kali pindai (posisi seperti langkah 5), lalu digulir 212px ke kolom tempel link.
      pv: ph(rect(0, 64, 390, 1200, { fill: T.wall }), resultBox("warn"), rect(16, 292, 358, 358, { r: 7.5, fill: "#0b141a" }), rect(36, 312, 318, 318, { r: 6, fill: "#18242c" }),
        pillBtn(16, 662, 358, "Tutup kamera"), text(195, 727, "Arahkan ke QR tamu.", { size: 13, fill: T.sub, anchor: "middle" }), linkBox(736), recentBox(832, [[false], [true]])),
      pasted: { svg: ph(rect(30, 550, 290, 46, { fill: "#fff" }), text(37, 579, fit(SITE + "?to=Bapak+Andi+%26+Ibu+Rina&u=P4N8RW", 280, 16), { size: 16, fill: T.text })), enter: "fade" },
      andi: ph(rect(30, 550, 290, 46, { fill: "#fff" }), text(37, 579, "https://…?to=Nama&u=KODE", { size: 16, fill: T.grey }), recentBox(620, [[true, ANDI], [false], [true]])),
      closed: { svg: ph(rect(0, 64, 390, 709, { fill: T.wall }), resultBox("ok", ANDI), pillBtn(16, 292, 358, "Buka kamera"), linkBox(344), recentBox(443, [[true, ANDI], [false], [true]])), enter: "fade" },
      cover: { svg: ph(scanBar(), tabbar("harih")), enter: "fade" },
      masks: MASKS
    },
    steps: [
      { caption: "Buka tab Hari-H di HP penerima tamu.", at: tabAt("harih"), click: true, show: ["scan", "cover"], dur: 3 },
      { caption: "Tekan Buka kamera, lalu izinkan kamera.", at: P(195, 100), click: true, show: ["cam"] },
      { caption: "Arahkan kamera ke QR di undangan tamu.", show: ["qr"], dur: 2.8 },
      { caption: "Kotak hijau Selamat datang: tamu tercatat datang.", scroll: { id: "cam", dy: -212 }, hide: ["qr"], show: ["ok"], dur: 3.4 },
      { caption: "Dipindai lagi? Kotak kuning: Sudah check-in pukul 10.12.", hide: ["ok"], show: ["warn"], dur: 3.4 },
      { caption: "QR tidak terbaca? Gulir ke kolom Atau tempel link tamu.", show: ["pv"], scroll: { id: "pv", dy: 212 }, dur: 3 },
      { caption: "Ketuk kolom itu, lalu tempel link pribadi tamu.", at: P(180, 573), click: true, show: ["pasted"] },
      { caption: "Tekan tombol kirim hijau. Hasilnya sama seperti scan.", at: P(347, 573), click: true, hide: ["pasted"], show: ["andi"], dur: 3.4 },
      { caption: "Tekan Tutup kamera. Riwayat ada di Check-in di perangkat ini.", at: P(195, 470), click: true, show: ["closed"], dur: 3.8 }
    ]
  },

  // 7. Pelacakan di laptop: lajur ikon kiri + daftar (di HP lewat menu akun).
  "pasangan-pelacakan": {
    title: "Melihat siapa yang sudah membuka undangan",
    world: { x: 0, y: DY, w: 551, h: 800 },
    base: [dg(berandaDesk(), railD("beranda"))],
    els: {
      pel: { svg: dg(rect(64, 0, 1216, 800, { fill: "#fff" }), listPaneD(), emptyDetail(), railD("pelacakan")), enter: "fade" },
      chipsAll: dg(chipsD(0), countD(5)),
      rowsAll: dg(trackRows([["Dibuka Oktober 2026", ["dewi", "hendra", "rudi"]], ["Belum dibuka", ["surya", "sari"]]])),
      n1: ring(74, DY + 306, 466, 396, { r: 12 }),
      chipsPenuh: { svg: dg(chipsD(3), countD(1)), enter: "fade" },
      rowsPenuh: { svg: dg(rect(64, 262, 486, 538, { fill: "#fff" }), trackRows([["Dibuka Oktober 2026", ["hendra"]]])), enter: "fade" },
      n2: ring(84, DY + 182, 446, 78, { r: 10 }),
      n3: ring(498, DY + 12, 40, 40, { r: 20 })
    },
    steps: [
      { caption: "Di laptop, klik ikon Pelacakan di lajur kiri (di HP lewat menu akun).", at: D(32, 291), click: true, show: ["pel", "chipsAll", "rowsAll"], dur: 3.4 },
      { caption: "Tiap baris: berapa kali dibuka, kapan pertama, dan jumlah perangkat.", show: ["n1"], dur: 3.8 },
      { caption: "Saring dengan Perangkat penuh: tamu yang jatah perangkatnya habis.", at: D(CHIP_AT[3][0] - 10, 132), click: true, hide: ["n1"], show: ["chipsPenuh", "rowsPenuh"] },
      { caption: "Bar PIN tamu untuk HP baru: berikan PIN ini ke tamu yang ganti HP.", show: ["n2"], dur: 3.6 },
      { caption: "Ikon unduh di kanan atas: CSV berisi nama, jumlah buka, dan perangkat.", at: D(518, 32), hide: ["n2"], show: ["n3"] }
    ]
  },

  // 8. Buka kunci perangkat: panel detail tamu di kanan (laptop).
  "pasangan-buka-kunci": {
    title: "Membuka kunci perangkat tamu",
    world: { x: 551, y: DY, w: 729, h: 800 },
    base: [dg(emptyDetail())],
    els: {
      det: { svg: dg(detailD()), enter: "fade" },
      n1: ring(675, DY + 422, 480, 260, { r: 12 }),
      menu: { svg: dg(menuBox(1032, 56, 232, 57), menuItem(1040, 64, "lock-open", "Buka kunci perangkat")), enter: "pop", origin: D(1244, 40) },
      reset: dg(`<svg x="1024" y="50" width="250" height="72" viewBox="1024 50 250 72" overflow="hidden">${detailD()}</svg>`, ddPatch(0, "Sudah dibuka"), ddPatch(4, "0/2")),
      done: { svg: dg(waToast(915, 784, "Kunci perangkat dibuka.")), enter: "slide" }
    },
    steps: [
      { caption: "Klik tamu di daftar. Detailnya tampil di kanan.", show: ["det"], dur: 2.8 },
      { caption: "Aktivitas undangan: Status, Dibuka, Perangkat 2/2, dan Kode tamu.", show: ["n1"], dur: 3.6 },
      { caption: "Klik ⋮ di kanan atas. Menu tamu terbuka.", at: D(1244, 32), click: true, hide: ["n1"], show: ["menu"] },
      { caption: "Pilih Buka kunci perangkat supaya tamu bisa membuka di HP baru.", at: D(1150, 84), click: true, show: ["reset", "done"] },
      { caption: "Muncul Kunci perangkat dibuka. Status dan Perangkat kembali 0/2.", dur: 3.6 }
    ]
  },

  // 9. Pengaturan undangan (menu akun > Pengaturan undangan > Buka untuk semua).
  "pasangan-pengaturan": (() => {
    const MX = 80, MY = 565, MW = 302;
    const settings = () => rect(0, 0, 390, 844, { fill: T.wash }) + head("Pengaturan") + circle(195, 120, 40, { fill: T.soft }) + text(195, 130, "RD", { size: 28, fill: T.strong, anchor: "middle" }) +
      text(195, 196, "Undangan Anda", { size: 20, fill: T.text, anchor: "middle" }) + text(195, 222, "/rani-dimas", { size: 16, fill: T.sub, anchor: "middle" }) +
      text(20, 284, "Undangan", { size: 14, fill: T.sub }) + rect(16, 298, 358, 112, { r: 12, fill: "#fff" }) +
      [["external-link", "Lihat undangan"], ["send", "Kirim undangan"]].map(([ic, l], i) => wa(ic, 48, 328 + i * 52, 24, T.sub) + text(76, 333 + i * 52, l, { size: 15, fill: T.text }) + wa("chevron-right", 350, 328 + i * 52, 20, T.sub)).join("") +
      text(20, 444, "Akses tamu", { size: 14, fill: T.sub }) + rect(16, 458, 358, 60, { r: 12, fill: "#fff" }) + wa("lock-open", 48, 488, 24, T.sub) + text(76, 493, "Buka untuk semua", { size: 15, fill: T.text }) +
      text(20, 552, "Akses dashboard", { size: 14, fill: T.sub }) + rect(16, 566, 358, 60, { r: 12, fill: "#fff" }) + wa("log-out", 48, 596, 24, T.danger) + text(76, 601, "Keluar", { size: 15, fill: T.danger }) + wa("chevron-right", 350, 596, 20, T.danger) +
      tabbar(null);
    const chipState = (s) => ph(rect(300, 478, 66, 24, { fill: "#fff" }), text(354, 493, s, { size: 14, fill: T.sub, anchor: "end" }));
    return {
      title: "Membuka Pengaturan undangan dan Buka untuk semua",
      world: PCROP,
      base: [...phoneBase(T.wash), ph(HOME_STATIC)],
      els: {
        menu: { svg: ph(menuBox(MX, MY, MW, 203), text(MX + 20, MY + 34, "Undangan Anda", { size: 16, weight: 500, fill: T.text }), text(MX + 20, MY + 52, SITE, { size: 13, fill: T.sub }),
          line(MX + 8, MY + 68.5, MX + MW - 8, MY + 68.5, { stroke: T.line }), menuItem(MX + 8, MY + 75, "pelacakan", "Pelacakan"), menuItem(MX + 8, MY + 115, "akun", "Pengaturan undangan"),
          menuItem(MX + 8, MY + 155, "keluar", "Keluar", true)), enter: "pop", origin: ME },
        set: { svg: ph(settings()), enter: "fade" },
        off: chipState("Mati"),
        on: chipState("Aktif"),
        off2: chipState("Mati"),
        n1: ring(PX + 16, PY + 302, 358, 52, { r: 12 }),
        n2: ring(PX + 16, PY + 354, 358, 52, { r: 12 }),
        tOn: { svg: ph(waToast(195, 756, "Terbuka untuk semua.")), enter: "slide" },
        tOff: { svg: ph(waToast(195, 756, "Kembali khusus tamu.")), enter: "slide" },
        masks: MASKS
      },
      steps: [
        { caption: "Di HP, ketuk lingkaran inisial di ujung kanan tab bawah.", at: ME, click: true, show: ["menu"] },
        { caption: "Menu akun terbuka. Pilih Pengaturan undangan.", at: P(MX + 120, MY + 135), click: true, show: ["set", "off"] },
        { caption: "Bagian Undangan: buka undangan sebagai tamu, atau pindah ke Kirim.", hide: ["menu"], show: ["n1", "n2"], dur: 3.6 },
        { caption: "Ketuk Buka untuk semua: undangan khusus terbuka tanpa tautan tamu.", at: P(195, 488), click: true, hide: ["n1", "n2"], show: ["on", "tOn"], dur: 3.6 },
        { caption: "Ketuk lagi untuk kembali khusus tamu. Status kembali Mati.", at: P(195, 488), click: true, hide: ["tOn"], show: ["off2", "tOff"], dur: 3.6 }
      ]
    };
  })()
};

export const scenes = SCENES;
