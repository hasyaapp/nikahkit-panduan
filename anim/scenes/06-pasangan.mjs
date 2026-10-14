// Dashboard pasangan: serah terima dari NikahKit, masuk, Beranda, Kirim, Tamu dan Ucapan, Hari-H, Pelacakan, Pengaturan.
// Satu layar desktop 1440x900 per adegan (lib v4). Halaman HP = layar polos 390x844 di tengah desktop (phoneDesk),
// diukur dari tangkapan dashboard 390x844 (14 Okt); desktop di sekitarnya generik. Pelacakan dan Buka kunci = dashboard
// laptop selebar layar, diukur dari server/pages/panel/scalev_panel.html di Chromium 1440x900 (14 Okt, worker asli dengan
// data contoh); baris hitung mundur Beranda laptop ditambahkan dari tangkapan 1280. Bagikan dan jendela PIN (pin.html)
// di editor Scalev utuh, ukuran dari QA panel. Label, warna, dan ikon dari server/pages/src/{panel,dashboard,share,
// checkin} dan nikahkit/ext/pin.html; ikon WhatsApp dan template pesan dibaca langsung dari sumbernya.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { C, WORLD, PHONE, rect, text, line, circle, para, tw, textWidth, wrap, icon, iconX, skeleton, clipped } from "../lib.mjs";
import { BAGIKAN_TOOL, NO_NOTE, ACC_Y, COUPLE_Y, shareTop, shareBtns, accessHead, forCouple, pinBtn, pinHint, pinBox } from "../ui/bagikan.mjs";
import { nkBtn, nkBtnBox, nkInput, nkLabel, nkHint, nkH3, nkNote, nkLogo, nkHead, nkAcc, scalevEditor, dim, phoneDesk } from "../ui/kit.mjs";

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

// ---- Layar HP (390x844, tanpa bingkai perangkat) ----------------------------------------------------------------------
const PX = PHONE.x, PY = PHONE.y;
const P = (x, y) => [PX + x, PY + y];
const PB = (x, y, w, h) => [PX + x, PY + y, w, h]; // kotak di layar HP -> dunia
const ph = (...k) => `<g transform="translate(${PX} ${PY})">${k.join("")}</g>`;
// Isi layar sebagai elemen: dipotong ke layar HP (isi yang lebih tinggi dari 844 tidak keluar ke desktop).
const scr = (...k) => clipped(PX, PY, 390, 844, ph(...k));
// Penutup di atas dan bawah layar untuk isi yang bergulir (lib menggeser elemen utuh, potongan ikut bergeser):
// warna desktop di tempat itu (bilah atas putih, latar desktop).
const MASKS = skeleton(rect(PX - 4, 0, 398, PY, { fill: "#fff" }) + rect(PX - 4, PY + 844, 398, WORLD.h - PY - 844, { fill: "#eef1f5" }));
const SITE = "https://tokomu.myscalev.com/rani-dimas";

// Kepala tab (pane-header 64px): judul hijau 22px, tombol ikon 40px.
const head = (title, acts = "rekap") => rect(0, 0, 390, 64, { fill: "#fff" }) + text(16, 40, title, { size: 22, fill: T.accent }) +
  (acts === "rekap" ? wa("rotate-cw", 303, 32) + wa("download", 347, 32) : acts === "share" ? wa("menu", 361, 32) : "");
// Tab bawah (#svPanel .rail di HP): Beranda, Kirim, Tamu, Ucapan, Hari-H, lingkaran inisial.
const TABS = [["beranda", "Beranda", 36], ["kirim", "Kirim", 101], ["tamu", "Tamu", 166], ["ucapan", "Ucapan", 231], ["harih", "Hari-H", 296]];
const tabAt = (k) => P(TABS.find((t) => t[0] === k)[2], 806);
const tabBox = (k) => ({ box: PB(TABS.find((t) => t[0] === k)[2] - 32, 780, 64, 60), r: 8 }); // tombol tab (ikon + label)
const ME = P(357, 809);
const BACK = { box: PB(4, 12, 40, 40), r: 20 }, KEBAB = { box: PB(342, 12, 40, 40), r: 20 }; // kembali / menu ⋮ di kepala
const tabbar = (active) => rect(0, 773, 390, 71, { fill: "#fff" }) + line(0, 773.5, 390, 773.5, { stroke: T.line }) +
  TABS.map(([k, l, x]) => (k === active ? rect(x - 32, 784, 64, 32, { r: 16, fill: T.soft }) : "") + wa(k, x, 800, 24, k === active ? T.strong : T.text) +
    text(x, 833, l, { size: 12, weight: 500, fill: T.text, anchor: "middle" })).join("") +
  circle(357, 809, 16, { fill: T.soft }) + text(357, 813.5, "RD", { size: 13, fill: T.strong, anchor: "middle" });
const search = (y, label, x0 = 20, w = 350) => rect(x0, y, w, 40, { r: 20, fill: T.hi }) + wa("search", x0 + 26, y + 20, 20, T.sub) + text(x0 + 48, y + 25, label, { size: 14, fill: T.sub });
// Pil filter (.fbtn / .chip): 32px, garis rgba(0,0,0,.2); yang aktif hijau muda.
function chips(y, items, active, x0 = 20) {
  let x = x0, svg = "";
  const at = [], boxes = [];
  items.forEach(([l, n], i) => {
    const w = textWidth(l, 14, 500) + (n == null ? 0 : textWidth("  " + n, 12)) + 24, on = i === active, fg = on ? T.strong : T.sub;
    svg += rect(x + 0.5, y + 0.5, w - 1, 31, { r: 16, fill: on ? T.soft : "#fff", stroke: on ? "#bfe6b8" : T.outline }) +
      text(x + w / 2, y + 21, n == null ? [l] : [l, { t: "  " + n, size: 12, w: 400 }], { size: 14, weight: 500, fill: fg, anchor: "middle" });
    at.push([x + w / 2, y + 16]);
    boxes.push([x, y, w, 32]);
    x += w + 8;
  });
  return { svg, at, boxes };
}
// Baris daftar ala chat: avatar 48, nama 16px + waktu, baris kedua 14px.
function row(y, o) {
  const x0 = o.x0 ?? 10, right = o.right ?? 365, [bg, fg] = avc(o.name), ax = x0 + 37, nx = x0 + 76;
  return (o.sel ? rect(x0, y, right + 15 - x0, 72, { r: 12, fill: T.hi }) : "") + circle(ax, y + 36, 24, { fill: bg }) + text(ax, y + 42, o.ini, { size: 17, fill: fg, anchor: "middle" }) +
    text(nx, y + 31, fit(o.name, right - nx - (o.time ? 50 : 0), 16), { size: 16, fill: T.text }) + (o.time ? text(right, y + 31, o.time, { size: 12, weight: 500, fill: T.sub, anchor: "end" }) : "") +
    l2(o.parts, right - nx)(nx, y + 54);
}
// Baris kedua: potongan { t, fill, w, icon } dalam satu baris teks (browser yang menyusun), dipangkas dengan … ke maxW.
const l2 = (parts, maxW) => (x, y) => {
  const ic = parts[0].icon ? wa(parts[0].icon, x + 8, y - 5, 16, parts[0].iconFill ?? parts[0].fill ?? T.sub) : "", tx = x + (ic ? 19 : 0);
  let left = fit(parts.map((p) => p.t).join(" "), x + maxW - tx, 14);
  const runs = parts.map((p, i) => { const t = left.slice(0, p.t.length + (i ? 1 : 0)); left = left.slice(t.length); return { t, fill: p.fill ?? T.sub, w: p.w }; }).filter((r) => r.t);
  return ic + text(tx, y, runs, { size: 14, fill: T.sub });
};
const groupLabel = (y, s, x = 23) => text(x, y, s, { size: 13, weight: 500, fill: T.sub });
// Snackbar dashboard (#242626, 14px) berpusat di cx, sisi bawah di bottom.
const waToast = (cx, bottom, label) => { const w = textWidth(label, 14) + 44; return rect(cx - w / 2, bottom - 48, w, 48, { r: 4, fill: T.toast }) + text(cx, bottom - 19, label, { size: 14, fill: "#fff", anchor: "middle" }); };
const menuBox = (x, y, w, h) => rect(x, y + 6, w, h, { r: 16, fill: "rgba(0,0,0,.08)" }) + rect(x - 1, y + 2, w + 2, h + 1, { r: 17, fill: "rgba(0,0,0,.06)" }) + rect(x, y, w, h, { r: 16, fill: "#fff" });
const menuItem = (x, y, ic, label, danger) => wa(ic, x + 21, y + 20, 18, danger ? T.danger : T.sub) + text(x + 46, y + 25, label, { size: 15, fill: danger ? T.danger : T.text });
// Ekor gelembung chat (masuk = kiri, putih; keluar = kanan, hijau).
const tail = (x, y, side, fill) => side === "in" ? `<path d="M${x} ${y} h-6.5 q-2.6 0 -1.1 2.1 l7.6 9.9 z" fill="${fill}"/>` : `<path d="M${x} ${y} h6.5 q2.6 0 1.1 2.1 l-7.6 9.9 z" fill="${fill}"/>`;
const dayChip = (cx, y, s) => { const w = textWidth(s, 12, 500) + 26; return rect(cx - w / 2, y, w, 24, { r: 6, fill: "#fff" }) + text(cx, y + 16, s, { size: 12, weight: 500, fill: T.sub, anchor: "middle" }); };
const sysNote = (cx, y, s) => { const w = textWidth(s, 12.5) + 26; return rect(cx - w / 2, y, w, 29, { r: 7.5, fill: T.system }) + text(cx, y + 19, s, { size: 12.5, fill: T.sub, anchor: "middle" }); };
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
    [["Hadir", "52", T.accent, 40], ["Ragu", "4", T.amber, 120], ["Tidak hadir", "5", T.grey, 190]].map(([l, n, c, x]) => circle(x + 4, 326, 4, { fill: c }) + text(x + 14, 330, [l + " ", { t: n, w: 600, fill: T.text }], { size: 12, fill: T.sub })).join("") +
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
    geo: { bTop, bh, bEnd, infoTop: bEnd + 24, replyTop, outY, outH },
    els: {
      detail: { svg: scr(rect(0, 0, 390, 844, { fill: T.wall }), dayChip(195, 80, "12 Oktober 2026"), inBubble, chatBar("Dewi Lestari", iniR("Dewi Lestari"), "Hadir · 2 orang · 082198765432")), enter: "fade", skel: true },
      infoA: { svg: scr(info(bEnd + 24)), skel: true },
      composeA: { svg: scr(compose("Tulis balasan")), skel: true },
      reply: scr(rect(0, 752, 390, 92, { fill: T.wall }), text(16, 772, "Balasan untuk Dewi Lestari", { size: 13, fill: T.sub }),
        rect(8, 786, 374, 52, { r: 26, fill: "rgba(0,0,0,.08)" }), rect(8, 784, 374, 52, { r: 26, fill: "#fff" }), wa("x", 313, 811, 24, T.text), circle(357, 811, 20, { fill: T.accent }), wa("send", 357, 811, 24, "#fff")),
      phReply: scr(text(29, 816, "Tulis ucapan terima kasih...", { size: 15, fill: T.grey })),
      typed: scr(text(29, 816, "Terima kasih doanya, Dewi!", { size: 15, fill: T.text })),
      out: { svg: scr(rect(0, replyTop, 390, 900, { fill: T.wall }), dayChip(195, replyTop, "14 Oktober 2026"),
        rect(374 - 228, outY, 228, outH, { r: 7.5, fill: T.soft }), rect(364, outY, 10, 10, { fill: T.soft }), tail(374, outY, "out", T.soft),
        text(374 - 219, outY + 21, "Terima kasih doanya, Dewi!", { size: 14.2, fill: T.text }), text(347, outY + outH - 8, "10.15", { size: 11, fill: T.sub, anchor: "end" }), wa("read", 359, outY + outH - 12, 16, T.link),
        info(infoB), compose("Ubah balasan")), skel: true },
      saved: { svg: scr(waToast(195, 756, "Balasan berhasil disimpan.")), enter: "slide" }
    }
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
// Kartu tautan di HP (share/index.html .lp, @media max-width 760px): selebar gelembung, gambar persegi 1:1, judul maks 2 baris,
// deskripsi, domain. Isinya contoh SEO & Page Identity Scalev. unpub: penanda .lpn "Belum diterbitkan" di bawah kartu.
const GUEST_LINK = SITE + "?to=Dewi+Lestari&u=K7Q2MX";
// Ikon daftar periksa (share/index.html CHECK_ICON: ✅ ⚠️ ❌ ✏️ ➖ 🚫), digambar sebagai bentuk agar tidak bergantung font emoji.
const emo = (k, x, y) => ({
  ok: rect(x, y, 15, 15, { r: 3, fill: "#43b54a" }) + `<path d="M${x + 3.5} ${y + 7.8} l2.8 2.8 l5.2 -5.6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`,
  no: `<path d="M${x + 2.5} ${y + 2.5} l10 10 M${x + 12.5} ${y + 2.5} l-10 10" stroke="#e5383b" stroke-width="3.2" stroke-linecap="round"/>`,
  warn: `<path d="M${x + 7.5} ${y + 1} l7 13 h-14 z" fill="#f4b400" stroke="#f4b400" stroke-linejoin="round"/>` + rect(x + 6.6, y + 5, 1.8, 5, { fill: "#111" }) + rect(x + 6.6, y + 11, 1.8, 1.8, { fill: "#111" }),
  free: `<path d="M${x + 2} ${y + 13} l1 -4 l8 -8 l3 3 l-8 8 z" fill="#f2a33a"/>`,
  optional: rect(x + 1, y + 6, 13, 3, { r: 1, fill: "#8696a0" }),
  rule: circle(x + 7.5, y + 7.5, 6.5, { stroke: "#e5383b", sw: 2 }) + `<path d="M${x + 3} ${y + 3} l9 9" stroke="#e5383b" stroke-width="2"/>`
})[k];
// Status layak kirim (.ready) dan daftar periksa (.mhint) untuk Dewi Lestari; mode "no" = baris [link-undangan] terhapus.
const READY = { ok: ["ok", "Siap dikirim ke Dewi Lestari", ""], no: ["no", "Belum bisa dikirim", "[link-undangan] terhapus, tamu tidak dapat tautan undangan"] };
const CHECKS = (mode) => [["free", "Kalimat, urutan, emoji, *tebal*", "boleh diubah bebas"],
  mode === "no" ? ["no", "[link-undangan] terhapus", "tamu tidak dapat tautan undangan"] : ["ok", "[link-undangan]", "jadi tautan pribadi tiap tamu"],
  ["ok", "[nama]", "jadi nama tamu"], ["ok", "[pasangan]", "jadi Rani & Dimas"],
  ["rule", "Jangan isi nama/tautan manual", "tulis penanda persis dengan [ ], diganti otomatis saat dikirim"]];
const NO_LINK = MUSLIM.replace("\n[link-undangan]", "");
function chatContent(unpub = false, mode = "ok") {
  const tpl = mode === "no" ? NO_LINK : MUSLIM;
  const msg = tpl.replace(/\*\[nama\]\*/g, "*Dewi Lestari*").replace(/\[nama\]/g, "Dewi Lestari").replace(/\[pasangan\]/g, "Rani & Dimas").replace(/\[link-undangan\]/g, GUEST_LINK);
  const bw = 305, bx = 374 - bw, inner = bw - 16;
  const lines = msg.split("\n").flatMap((l) => { const bold = /^\*[^*]+\*$/.test(l.trim()); return wrap(bold ? l.trim().slice(1, -1) : l, inner, 14.2, bold ? 600 : 400).map((t) => ({ t, bold, link: /^https?:/.test(l) })); });
  let y = 116;
  let s = rect(0, 0, 390, 2600, { fill: T.wall }) + dayChip(195, 80, "Belum dikirim");
  const cw = bw - 6, card = cw + 8 + 16 + 18 + 16 + 12, note = unpub ? 2 * 16 + 20 : 0, top = 3 + card + note;
  const bh = top + lines.length * 19 + 8 + 17;
  s += rect(bx, y, bw, bh, { r: 7.5, fill: T.soft }) + rect(bx + bw - 10, y, 10, 10, { fill: T.soft }) + tail(bx + bw, y, "out", T.soft) +
    rect(bx + 3, y + 3, cw, card, { r: 6, fill: "rgba(0,0,0,.05)" }) + rect(bx + 3, y + 3, cw, cw, { r: 6, fill: T.strong }) +
    text(bx + 3 + cw / 2, y + 3 + cw / 2 - 6, "RANI & DIMAS", { size: 26, fill: "#fff", anchor: "middle", font: "Georgia,serif" }) +
    text(bx + 3 + cw / 2, y + 3 + cw / 2 + 22, "14 . 02 . 2027", { size: 14, fill: "#fff", anchor: "middle", font: "Georgia,serif" }) +
    text(bx + 13, y + 3 + cw + 22, "Undangan Rani & Dimas", { size: 13.6, weight: 600, fill: T.text }) +
    text(bx + 13, y + 3 + cw + 40, "Minggu, 14 Februari 2027. Mohon doa restu.", { size: 12, fill: T.sub }) +
    text(bx + 13, y + 3 + cw + 58, "tokomu.myscalev.com", { size: 12, fill: T.sub }) +
    (unpub ? para(bx + 9, y + 3 + card + 22, ["Belum diterbitkan: tamu masih melihat versi lama.", "Terbitkan halaman di Scalev."], { size: 12, fill: "#b45309", lh: 16 }) : "");
  lines.forEach((l, i) => (s += text(bx + 9, y + top + 15 + i * 19, l.t, { size: 14.2, fill: l.link ? T.link : T.text, weight: l.bold ? 600 : undefined })));
  s += text(bx + bw - 7, y + bh - 8, "Draf · belum dikirim", { size: 11, fill: T.sub, anchor: "end" });
  y += bh + 20;
  // Penyusun (.chead: pilihan teks, tombol penanda, status layak kirim) + kotak pesan (tumbuh setinggi isi) + daftar periksa.
  // Mode "no"/"fixed": baris tombol digeser (di HP bergulir ke samping) sampai + [link-undangan] terlihat.
  let cx = 12, chip = null; const s0 = s.length;
  const chipBtn = (k, on) => { const w = textWidth(k, 13, 500) + 26; s += rect(cx + 0.5, y + 0.5, w - 1, 29, { r: 15, fill: on ? T.soft : "#fff", stroke: T.outline }) + text(cx + w / 2, y + 20, k, { size: 13, weight: 500, fill: on ? T.strong : T.sub, anchor: "middle" }); const c = [cx + w / 2, y + 15, cx, w]; cx += w + 6; return c; };
  (mode === "ok" ? ["formal", "muslim", "nasrani", "hindu", "custom"] : ["custom"]).forEach((k) => chipBtn(k, k === "muslim"));
  s += rect(cx, y + 4, 1, 22, { fill: T.outline }); cx += 7;
  ["+ [nama]", "+ [link-undangan]", "+ [pasangan]"].forEach((k) => { const c = chipBtn(k, false); if (k === "+ [link-undangan]") chip = c; });
  // Status: ikon + judul tebal · keterangan, latar hijau/merah.
  const [st, title, detail] = READY[mode === "no" ? "no" : "ok"], rl = wrap(title + (detail ? " · " + detail : ""), 296, 13);
  const ry = y + 38, rh = 14 + rl.length * 18;
  s += rect(12, ry, 366, rh, { r: 8, fill: st === "no" ? "#ffe0de" : "#d9fdd3" }) + emo(st, 22, ry + 9);
  rl.forEach((t, i) => (s += text(42, ry + 20 + i * 18, i ? t : [{ t: title, w: 600 }, t.slice(title.length)], { size: 13, fill: "#111b21" })));
  // .chead menempel di bawah kepala percakapan (top 64px, padding-top 8px) saat pesan digulir.
  const sticky = `<g transform="translate(0 ${72 - y})">` + rect(0, y - 8, 390, 38 + rh + 16, { fill: T.wall }) + s.slice(s0) + "</g>";
  const raw = tpl.split("\n").flatMap((l) => wrap(l, 286, 15));
  const ch = Math.max(52, 20 + raw.length * 22 + 10), cy = ry + rh + 8;
  s += rect(8, cy + 2, 374, ch, { r: 26, fill: "rgba(0,0,0,.08)" }) + rect(8, cy, 374, ch, { r: 26, fill: "#fff" }) +
    raw.map((t, i) => text(29, cy + 26 + i * 22, t, { size: 15, fill: T.text })).join("");
  const send = [356, cy + ch - 26];
  s += `<g opacity="${mode === "no" ? 0.4 : 1}">` + circle(send[0], send[1], 20, { fill: T.accent }) + wa("send", send[0], send[1], 24, "#fff") + "</g>";
  // Daftar periksa (.mhint): ikon 20px + label tebal + keterangan, baris 17,5px, jarak 4px.
  let hy = cy + ch + 8; const hy0 = hy;
  CHECKS(mode).forEach(([k, label, desc]) => {
    const hl = wrap(label + " " + desc, 306, 12.5);
    s += emo(k, 16, hy + 2);
    hl.forEach((t, i) => (s += text(40, hy + 13 + i * 17.5, i ? t : [{ t: label, w: 600, fill: "#111b21" }, t.slice(label.length)], { size: 12.5, fill: "#54656f" })));
    hy += hl.length * 17.5 + 4;
  });
  // Kotak untuk mark (koordinat layar HP; chip dan ready di baris yang menempel, checks/send di isi yang belum digulir).
  return { svg: s, bottom: hy + 8, send, chip, chipBox: [chip[2], 72, chip[3], 30], sticky, ready: [12, 72 + 38, 366, rh], checks: [8, hy0 - 4, 374, hy - hy0 + 8],
    card: [bx + 3, 119, cw, card], unpubNote: [bx + 5, 119 + card + 8, 300, 38] };
}
const CHAT = chatContent(), CHAT_U = chatContent(true), CHAT_NO = chatContent(true, "no"), CHAT_FIX = chatContent(true, "fixed");
const NO_DY = CHAT_NO.bottom - 844;
const CHAT_DY = CHAT_U.bottom - 844;

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
// Kamera terbuka (.ck-stage[data-cam], diukur di Chromium 390 lebar, tinggi bingkai 773): jendela persegi min(100%,46svh) = 356px
// di tengah, garis bidik inset 18%, hasil scan = kartu di dalam jendela (kiri/kanan/bawah 10px), tombol 12px di bawahnya.
const STAGE = { x: 17, y: 80, s: 356 };
const camStage = () => {
  const { x, y, s } = STAGE, i = Math.round(s * 0.18), ax = x + i, ay = y + i, a = s - 2 * i, k = 28, c = "#fff";
  const corner = (cx, cy, dx, dy) => rect(dx > 0 ? cx : cx - k, dy > 0 ? cy : cy - 4, k, 4, { fill: c }) + rect(dx > 0 ? cx : cx - 4, dy > 0 ? cy : cy - k, 4, k, { fill: c });
  return rect(x, y, s, s, { r: 12, fill: "#18242c" }) + rect(ax, ay, a, a, { r: 16, fill: "#2a3640" }) +
    corner(ax, ay, 1, 1) + corner(ax + a, ay, -1, 1) + corner(ax, ay + a, 1, -1) + corner(ax + a, ay + a, -1, -1);
};
const camCard = (kind, [name, info] = DEWI) => {
  const ok = kind === "ok", h = ok ? 128 : 104, y = STAGE.y + STAGE.s - 10 - h, fill = ok ? T.strong : T.text;
  return rect(27, y + 3, 336, h, { r: 7.5, fill: "rgba(11,20,26,.18)" }) + rect(27, y, 336, h, { r: 7.5, fill: ok ? T.soft : T.system }) + (ok ? wa("read", 195, y + 24, 24, T.accent) : "") +
    text(195, y + (ok ? 62 : 34), name, { size: 22, weight: 500, fill: T.text, anchor: "middle" }) +
    text(195, y + (ok ? 87 : 59), ok ? "Selamat datang" : "Sudah check-in pukul 10.12", { size: 15, fill, anchor: "middle" }) + text(195, y + (ok ? 111 : 83), info, { size: 15, fill, anchor: "middle" });
};
// Kartu Check-in di perangkat ini (terbaru di atas): baris [ok, tamu].
const recentBox = (y, rows) => rect(16, y, 358, 52 + rows.length * 72, { r: 12, fill: "#fff" }) + text(32, y + 31, "Check-in di perangkat ini", { size: 14, weight: 500, fill: T.sub }) +
  rows.map(([ok, g], i) => recentRow(y + 44 + i * 72, ok, g)).join("");

// ---- Laptop: dashboard 1440x900 (scalev_panel.html di Chromium 1440x900, 14 Okt) --------------------------------------
// Lajur 0..64 (ikon 24 di tengah tombol 40, lingkaran inisial di bawah), panel kiri 64..614 (pane-header 64, cari
// 84..594), detail 614..1440 (chat-bar 64, isi 480 lebar di tengah: 788..1268). Beranda: kolom 800 di tengah (352..1152).
const RAILD = [["beranda", 30], ["kirim", 78], ["tamu", 126], ["ucapan", 174], ["harih", 222], ["pelacakan", 291]];
const railD = (active) => rect(0, 0, 64, 900, { fill: T.wash }) + line(63.5, 0, 63.5, 900, { stroke: T.line }) + rect(20, 256, 24, 1, { fill: "rgba(0,0,0,.1)" }) +
  RAILD.map(([k, y]) => (k === active ? circle(32, y, 20, { fill: T.railOn }) : "") + wa(k, 32, y, 24, k === active ? T.text : "#5c5c5c")).join("") +
  circle(34, 870, 16, { fill: T.soft }) + text(34, 874.5, "RD", { size: 13, fill: T.strong, anchor: "middle" });
const paneHead = (x, w, title) => rect(x, 0, w, 64, { fill: "#fff" }) + text(x + 20, 40, title, { size: 22, fill: T.accent }) + wa("rotate-cw", x + w - 76, 32) + wa("download", x + w - 32, 32);
// Baris daftar laptop (guest-row): avatar 48 di x0+13, nama 16px di x0+67, tanggal rata kanan x0+w-15, baris kedua =
// chip status (ikon opsional) lalu keterangan 6px sesudahnya.
function rowD(x0, y, w, o) {
  const [bg, fg] = avc(o.name), nx = x0 + 67;
  let s = (o.sel ? rect(x0, y, w, 72, { r: 12, fill: T.hi }) : "") + circle(x0 + 37, y + 36, 24, { fill: bg }) + text(x0 + 37, y + 42, iniR(o.name), { size: 17, fill: fg, anchor: "middle" }) +
    text(nx, y + 31, o.name, { size: 16, fill: T.text }) + (o.date ? text(x0 + w - 15, y + 29, o.date, { size: 12, weight: 500, fill: T.sub, anchor: "end" }) : "");
  let cx = nx;
  if (o.dot) { s += circle(cx + 4, y + 48, 2.5, { fill: o.fill }); cx += 12; } // .chip.warn::before
  if (o.icon) { s += wa(o.icon, cx + 8, y + 48, 16, o.fill ?? T.sub); cx += 18; }
  return s + text(cx, y + 53, [{ t: o.chip, fill: o.fill ?? T.sub }, " " + o.cap], { size: 14, fill: T.sub });
}
// Beranda laptop. Ukuran tanpa tanggal acara, ditambah 28px untuk baris hitung mundur (data contoh punya tanggal acara).
const TREND = [0, 1, 0, 2, 3, 1, 4, 2, 0, 5, 3, 8, 12, 2]; // RSVP per hari, contoh
function berandaDesk() {
  let s = rect(64, 64, 1376, 836, { fill: T.wash }) + paneHead(64, 1376, "Beranda") +
    text(352, 110, "Ringkasan undangan", { size: 22, fill: T.text }) + text(352, 138, "45 hari lagi · Akad Nikah, Sabtu, 28 November 2026 pukul 08.00", { size: 16, fill: T.sub });
  s += rect(352, 164, 388, 232, { r: 16, fill: "#fff" }) + text(376, 203, "Estimasi tamu hadir", { size: 14, fill: T.sub }) + text(374, 251, "128", { size: 40, weight: 500, fill: T.text }) +
    text(376, 268, "52 konfirmasi hadir", { size: 12, fill: T.sub }) +
    rect(376, 286, 340, 8, { r: 4, fill: "#707070" }) + rect(376, 286, 290, 8, { r: 4, fill: T.accent }) + rect(660, 286, 6, 8, { fill: T.accent }) + rect(666, 286, 22, 8, { fill: T.amber });
  // Legenda .att-legend: diukur Hadir 376, Ragu 443, Tidak hadir 509 dengan angka 1 digit; +7 untuk "52".
  [["Hadir", "52", T.accent, 376], ["Ragu", "4", T.amber, 450], ["Tidak hadir", "5", "#707070", 516]].forEach(([l, n, c, lx]) =>
    (s += circle(lx + 4, 312, 4, { fill: c }) + text(lx + 14, 316, [l + " ", { t: n, w: 500, fill: T.text }], { size: 12, fill: T.sub })));
  s += rect(376.5, 336.5, 143, 35, { r: 18, fill: "#fff", stroke: T.outline }) + text(448, 359, "Lihat daftar tamu", { size: 14, weight: 500, fill: T.strong, anchor: "middle" });
  s += rect(764, 164, 388, 232, { r: 16, fill: "#fff" }) + STATS.map(([l, v, n], i) => { const x = i % 2 ? 966 : 784, y = i > 1 ? 108 : 0;
    return text(x, 196 + y, l, { size: 12, fill: T.sub }) + text(x, 224 + y, v, { size: 24, weight: 500, fill: T.text }) + text(x, 244 + y, n.join(" "), { size: 12, fill: T.sub }); }).join("");
  s += QUICK.map(([ic, a, b], i) => { const x = [352, 621, 891][i]; return rect(x, 428, 261, 73, { r: 16, fill: "#fff" }) + circle(x + 36, 464, 20, { fill: T.soft }) + wa(ic, x + 36, 464, 24, T.strong) +
    text(x + 68, 460, a, { size: 16, weight: 500, fill: T.text }) + text(x + 68, 481, b, { size: 12, fill: T.sub }); }).join("");
  const top = Math.max(...TREND);
  s += rect(352, 533, 800, 192, { r: 16, fill: "#fff" }) + text(372, 571, "RSVP masuk, 14 hari terakhir", { size: 16, weight: 500, fill: T.text }) +
    TREND.map((n, i) => { const h = Math.max(3, Math.round((96 * n) / top)); return rect(+(372 + i * 54.6).toFixed(1), 685 - h, 51, h, { r: 2, fill: T.accent }); }).join("") +
    text(372, 702, "14 hari lalu", { size: 11, fill: T.sub }) + text(1132, 702, "Hari ini", { size: 11, fill: T.sub, anchor: "end" });
  s += text(352, 781, "Kabar terbaru", { size: 16, weight: 500, fill: T.text }) + text(1095, 780, "Lihat semua", { size: 14, weight: 500, fill: T.strong, anchor: "middle" }) +
    rect(352, 801, 800, 160, { r: 16, fill: "#fff" }) +
    rowD(360, 805, 784, { name: "Dewi Lestari", date: "12 Okt", icon: "check", chip: "Hadir", fill: T.strong, cap: "· Selamat ya Rani & Dimas, semoga sakinah" }) +
    rowD(360, 877, 784, { name: "Rudi Hartono", date: "11 Okt", icon: "x", chip: "Tidak hadir", fill: "#555", cap: "· Maaf belum bisa datang" });
  return s;
}
// Pelacakan: terakhir dibuka di atas, yang belum dibuka di bawah urut nama.
const TRACK = {
  dewi: { name: "Dewi Lestari", date: "12 Okt", chip: "3 kali dibuka", fill: T.strong, cap: "· Pertama dibuka 3 Okt · Perangkat 1/2" },
  hendra: { name: "Bapak Hendra", date: "11 Okt", dot: true, chip: "Perangkat penuh", fill: T.danger, cap: "· Pertama dibuka 4 Okt · Perangkat 2/2" },
  rudi: { name: "Rudi Hartono", date: "9 Okt", chip: "1 kali dibuka", fill: T.strong, cap: "· Pertama dibuka 9 Okt · Perangkat 1/2" },
  surya: { name: "Keluarga Besar Surya", chip: "Belum dibuka", cap: "· Tautan dibuat 2 Okt" },
  sari: { name: "Sari Wulandari", chip: "Belum dibuka", cap: "· Tautan dibuat 2 Okt" }
};
// Saringan (.fbtn, diukur): [label, jumlah, x, lebar]; baris saringan terpotong di tepi daftar (594).
const CHIPS_D = [["Semua", 5, 84, 85], ["Sudah dibuka", 3, 177, 130], ["Belum dibuka", 2, 314, 130], ["Perangkat penuh", 1, 452, 152]];
const PENUH_CHIP = [452, 116, 142, 32];
const chev = (cx, cy, dir) => `<path d="M${cx + 2 * dir} ${cy - 4} l${-4 * dir} 4 l${4 * dir} 4" fill="none" stroke="${T.sub}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;
const pagD = (y, n) => text(84, y + 12, `Menampilkan 1 - ${n} dari ${n} tamu`, { size: 12, fill: T.sub }) +
  rect(84.5, y + 28.5, 33, 35, { r: 18, fill: "#fff", stroke: "rgba(0,0,0,.2)" }) + chev(101, y + 46, 1) + circle(138, y + 46, 16, { fill: T.soft }) + text(138, y + 50, "1", { size: 12, weight: 500, fill: T.strong, anchor: "middle" }) +
  rect(158.5, y + 28.5, 33, 35, { r: 18, fill: "#fff", stroke: "rgba(0,0,0,.2)" }) + chev(175, y + 46, -1) + text(384, y + 50, "Per hal:", { size: 12, fill: T.sub }) +
  [["10", 449], ["25", 485], ["50", 521], ["Semua", 568]].map(([l, x]) => (l === "25" ? circle(x, y + 46, 16, { fill: T.soft }) : "") + text(x, y + 50, l, { size: 12, weight: l === "25" ? 500 : 400, fill: l === "25" ? T.strong : T.sub, anchor: "middle" })).join("");
function listD(active, groups, sel) {
  const n = groups.reduce((a, [, k]) => a + k.length, 0);
  let s = rect(64, 0, 550, 900, { fill: "#fff" }) + line(614.5, 0, 614.5, 900, { stroke: T.line }) + paneHead(64, 550, "Pelacakan") +
    rect(84, 66, 510, 40, { r: 20, fill: T.hi }) + wa("search", 110, 86, 20, T.sub) + text(132, 91, "Cari nama, ucapan, atau nomor HP", { size: 14, fill: T.sub }) +
    clipped(84, 112, 510, 40, CHIPS_D.map(([l, c, x, w], i) => { const on = i === active; return rect(x + 0.5, 116.5, w - 1, 31, { r: 16, fill: on ? T.soft : "#fff", stroke: "rgba(0,0,0,.2)" }) +
      text(x + 13, 137, l, { size: 14, weight: 500, fill: on ? T.strong : T.sub }) + text(x + w - 20, 137, String(c), { size: 12, weight: 500, fill: on ? T.strong : T.sub }); }).join("")) +
    text(84, 171, "Tautan tamu: dibuka atau belum, kapan, dan perangkatnya.", { size: 13, fill: T.sub }) + text(594, 171, `${n} tamu`, { size: 13, weight: 500, fill: T.sub, anchor: "end" }) +
    // Bar PIN tamu untuk HP baru (undangan khusus dengan keamanan "+ PIN untuk HP baru")
    rect(84.5, 175.5, 509, 79, { r: 10, fill: "#fff", stroke: "rgba(0,0,0,.1)" }) + text(97, 210, "PIN tamu untuk HP baru:", { size: 14, fill: T.text }) +
    text(263, 210, "731905", { size: 18, weight: 700, fill: T.text }).replace("<text", '<text letter-spacing="2"') +
    rect(346.5, 186.5, 67, 35, { r: 18, fill: "#fff", stroke: "rgba(0,0,0,.2)" }) + text(380, 209, "Ganti", { size: 14, weight: 500, fill: T.strong, anchor: "middle" }) +
    text(97, 240, "Berikan ke tamu yang ganti HP. PIN ini tidak membuka dashboard.", { size: 12, fill: T.sub });
  let y = 268;
  for (const [label, keys] of groups) {
    s += text(87, y + 21, label, { size: 13, weight: 500, fill: T.sub }); y += 32;
    for (const k of keys) { s += rowD(74, y, 530, { ...TRACK[k], sel: k === sel }); y += 72; }
  }
  return s + pagD(y + 20, n);
}
// Detail di kanan: chat-bar, lalu bagian Info tamu / Aktivitas undangan (judul 14px, grup 480 lebar, baris 36px).
const barD = (name, sub) => rect(614, 0, 826, 900, { fill: T.wall }) + rect(615, 64, 825, 3, { fill: "rgba(10,10,10,.05)" }) + rect(615, 0, 825, 64, { fill: "#fff" }) +
  circle(651, 32, 20, { fill: avc(name)[0] }) + text(651, 37.5, iniR(name), { size: 15, fill: avc(name)[1], anchor: "middle" }) +
  text(679, 29, name, { size: 16, fill: T.text }) + text(679, 47, sub, { size: 13, fill: T.sub }) + wa("menu", 1404, 32);
const secD = (y, title, lines) => text(792, y + 15, title, { size: 14, fill: T.sub }) + detailGroup(788, y + 28, 480, lines, 36);
const HENDRA_INFO = [["Kehadiran", "Belum konfirmasi"], ["Jumlah tamu", "Tidak ada konfirmasi hadir"], ["Pihak keluarga", "Belum diisi"], ["Perkiraan datang", "Belum diisi"], ["Check-in", "Belum datang"]];
const HENDRA_TRACK = [["Status", "Perangkat penuh"], ["Dibuka", "5 kali"], ["Pertama dibuka", "4 Okt 2026 · 19.20"], ["Terakhir dibuka", "11 Okt 2026 · 08.05"], ["Perangkat", "2/2"], ["Tautan dibuat", "2 Okt 2026 · 14.30"], ["Kode tamu", "H3T6VQ"]];
const DEWI_INFO = [["Kehadiran", "Hadir"], ["Jumlah tamu", "2 orang"], ["Pihak keluarga", "Mempelai wanita"], ["Perkiraan datang", "Belum diisi"], ["Check-in", "Belum datang"]];
const DEWI_TRACK = [["Status", "Sudah dibuka"], ["Dibuka", "3 kali"], ["Pertama dibuka", "3 Okt 2026 · 20.11"], ["Terakhir dibuka", "12 Okt 2026 · 19.40"], ["Perangkat", "1/2"], ["Tautan dibuat", "2 Okt 2026 · 14.30"], ["Kode tamu", "K7Q2MX"]];
const hendraD = () => barD("Bapak Hendra", "Belum konfirmasi") + dayChip(1028, 84, "2 Oktober 2026") + sysNote(1028, 120, "Tamu ini belum mengirim konfirmasi atau ucapan.") +
  secD(173, "Info tamu", HENDRA_INFO) + secD(409, "Aktivitas undangan", HENDRA_TRACK);
const dewiD = () => barD("Dewi Lestari", "Hadir · 2 orang · 082198765432") + dayChip(1028, 84, "12 Oktober 2026") +
  rect(681, 120, 326, 68, { r: 7.5, fill: "#fff" }) + rect(681, 120, 10, 10, { fill: "#fff" }) + tail(681, 120, "in", "#fff") +
  rect(684, 123, 320, 31, { r: 6, fill: "rgba(0,0,0,.05)" }) + text(692, 143, "Hadir · 2 orang", { size: 14.2, weight: 500, fill: T.text }) +
  text(690, 175, "Selamat ya Rani & Dimas, semoga sakinah", { size: 14.2, fill: T.text }) + text(1001, 181, "19.42", { size: 11, fill: T.sub, anchor: "end" }) +
  secD(212, "Info tamu", DEWI_INFO) + secD(448, "Aktivitas undangan", DEWI_TRACK) + secD(756, "Pemeriksaan otomatis", [["Status", "Belum diperiksa"]]) +
  rect(627, 838, 801, 52, { r: 26, fill: "rgba(0,0,0,.08)" }) + rect(627, 836, 801, 52, { r: 26, fill: "#fff" }) + text(648, 867, "Tulis balasan", { size: 15, fill: T.sub }) +
  circle(1403, 862, 20, { fill: T.accent }) + wa("send", 1403, 862, 24, "#fff");
// Ganti nilai dd baris ke-i Aktivitas undangan Bapak Hendra (grup di y 437).
const ddPatch = (i, s) => rect(1040, 447 + i * 36, 220, 26, { fill: "#fff" }) + text(1252, 464 + i * 36, s, { size: 14, fill: T.sub, anchor: "end" });
const ROWS_ALL = [["Dibuka Oktober 2026", ["dewi", "hendra", "rudi"]], ["Belum dibuka", ["surya", "sari"]]];
// Di laptop baris pertama halaman terpilih otomatis, jadi detail kanan selalu berisi tamu.
const PEL_ALL = railD("pelacakan") + listD(0, ROWS_ALL, "dewi") + dewiD();
const PEL_PENUH = railD("pelacakan") + listD(3, [["Dibuka Oktober 2026", ["hendra"]]], "hendra") + hendraD();

// ---- Editor Scalev 1440x900 + jendela PIN NikahKit ---------------------------------------------------------------------
// Dialog Bagikan tanpa catatan belum disimpan (ui/bagikan.mjs); Kelola PIN dashboard terpisah supaya bisa ditekan.
const bagikan = () => shareTop(NO_NOTE) + shareBtns(NO_NOTE) + accessHead(ACC_Y, false) + forCouple(COUPLE_Y) + pinHint(COUPLE_Y);
const KELOLA = pinBox(COUPLE_Y);
// pin.html dalam dialog Scalev (src/pin-frame.js): kartu 440px, sudut 8px, di tengah editor. revealed = setelah Lihat PIN.
const DLG_X = 500;
const dlgTop = (revealed) => 450 - (revealed ? 282 : 233);
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
  const lihat = nkBtnBox(x + 32, by, "Lihat PIN", { size: 14 });
  s += nkBtn(x + 32, by, "Lihat PIN", { size: 14 }) + nkBtn(x + 32 + lihat[2] + 8, by, "Buat PIN baru", { size: 14, variant: "quiet" });
  const bc = pc + ph2 + 12;
  s += card(bc, 121) + nkH3(x + 32, bc + 28, "Bisnis Scalev") + text(x + 32, bc + 54, "Rina WO (@rinawo)", { size: 14, fill: C.text }) + nkBtn(x + 32, bc + 70, "Hubungkan ulang", { size: 14, variant: "quiet" });
  return { svg: s, lihat, pinCard: [x + 16, pc, 408, ph2], noteY: bc + 133, handover: [x + 390, pc + 80] };
}
const DLG_A = pinDialog(false), DLG_B = pinDialog(true);
const pinNote = (s) => nkNote(DLG_X + 16, DLG_B.noteY, 408, [s], { h: 38 });
// Editor Scalev (tab Konten NikahKit) dengan pratinjau undangan, sebelum panel Bagikan dibuka.
const EDITOR_BASE = [scalevEditor(0, 0, { rail: "Konten", page: "Undangan Rani & Dimas", user: "Rina" }),
  nkHead(0, 0, "Konten") + nkLabel(88, 192, "Bahasa undangan") + nkInput(88, 200, 279, "Indonesia", { select: true }) +
    para(88, 256, ["Hanya halaman tamu. Teks bawaan ikut berganti;", "teks yang sudah diubah tetap."], { size: 12, fill: C.faint, lh: 16 }) +
    nkAcc(88, 300, 279, "Sampul", { badge: "Terisi" }) + nkAcc(88, 358, 279, "Mempelai", { badge: "Terisi" }),
  text(922, 300, "Rani & Dimas", { size: 34, fill: "#8a3b2b", anchor: "middle", italic: true, font: "Georgia,serif" }) + text(922, 340, "Sabtu, 28 November 2026", { size: 15, fill: "#5a4636", anchor: "middle", font: "Georgia,serif" })];

const circ = (cx, cy, r) => ({ box: [cx - r, cy - r, 2 * r, 2 * r], r }); // tombol bulat
const SCENES = {
  // 1a. Member: Bagikan > Kelola PIN dashboard (lajur + panel NikahKit di editor utuh).
  "pasangan-kelola-pin": {
    title: "Membuka Kelola PIN dashboard di NikahKit",
    base: EDITOR_BASE,
    els: {
      share: { svg: bagikan(), enter: "fade", skel: true },
      kelola: { svg: pinBtn(COUPLE_Y), enter: "fade" },
      backdrop: { svg: dim(0, 0, WORLD.w, WORLD.h), enter: "fade" },
      dlg: { svg: DLG_A.svg, enter: "pop" }
    },
    steps: [
      { caption: "Di editor undangan, klik Bagikan di lajur kiri NikahKit.", focus: [0, 92, 399, 62], mark: BAGIKAN_TOOL, note: "Bagikan",
        at: [36, 584], click: true, show: ["share", "kelola"] },
      { caption: "Di bawah Untuk pengantin ada bagian PIN dashboard.", focus: [0, 586, 399, 244], mark: [12, 738, 374, 84], lens: { src: [0, 588, 399, 238] }, at: [200, 700], dur: 3.4 },
      { caption: "Klik Kelola PIN dashboard. Jendela NikahKit terbuka di atas editor.", focus: [DLG_X, dlgTop(false), 440, 466], mark: KELOLA, note: "Kelola PIN dashboard",
        at: [KELOLA[0] + 183, KELOLA[1] + 18], click: true, press: "kelola", show: ["backdrop", "dlg"], dur: 3.6 }
    ]
  },

  // 1b. Jendela NikahKit (pin.html): Lihat PIN > balon chat > pesan untuk pengantin.
  "pasangan-salin-pesan": (() => {
    const msg = ["Undangan siap: " + SITE, "Kelola undangan (kirim ke tamu, RSVP, ucapan, check-in): https://tokomu.myscalev.com/kelola?w=365671&link=https%3A%2F%2Ftokomu.myscalev.com%2Frani-dimas", "PIN: 482913"]
      .flatMap((l) => wrap(l, 372, 14));
    const bx = 976, by = 330, bh = 24 + msg.length * 20 + 16, [hx, hy] = DLG_B.handover;
    // Kartu PIN (sebelum dan sesudah Lihat PIN) selalu di dalam jendela: focus tidak membuka redup gelap di sekitarnya.
    const pinCard = [DLG_B.pinCard[0], DLG_B.pinCard[1], 408, DLG_A.pinCard[1] + DLG_A.pinCard[3] - DLG_B.pinCard[1] + 2];
    return {
      title: "Menyalin pesan serah terima untuk pengantin",
      // Jendela NikahKit di atas editor yang diredupkan; kedua keadaannya bagian layar (skel), jadi ikut focus.
      base: [...EDITOR_BASE, bagikan(), pinBtn(COUPLE_Y), dim(0, 0, WORLD.w, WORLD.h)],
      els: {
        dlgA: { svg: DLG_A.svg, skel: true },
        dlgB: { svg: DLG_B.svg + pinNote("PIN aktif saat ini. Tetap berlaku sampai Anda membuat PIN baru."), enter: "fade", skel: true },
        tip: { svg: rect(hx - 150, hy + 24, 192, 24, { r: 4, fill: "#fff", stroke: "#c4c7c5" }) + text(hx - 54, hy + 40, "Salin pesan untuk pengantin", { size: 12, fill: C.crText, anchor: "middle" }), enter: "fade" },
        copied: { svg: pinNote("Pesan tersalin."), enter: "fade" },
        bubble: { svg: rect(bx, by + 2, 404, bh, { r: 8, fill: "rgba(0,0,0,.08)" }) + rect(bx, by, 404, bh, { r: 8, fill: T.soft }) +
          para(bx + 16, by + 30, msg, { size: 14, fill: T.text, lh: 20 }), enter: "rise" }
      },
      steps: [
        { caption: "Di jendela NikahKit, bagian PIN dashboard, klik Lihat PIN. PIN 6 angka tampil.", focus: pinCard, mark: DLG_A.lihat,
          lens: { src: [524, 474, 240, 52], at: [16, 230] }, at: [DLG_A.lihat[0] + DLG_A.lihat[2] / 2, DLG_A.lihat[1] + 18], click: true, show: ["dlgB"], dur: 3.4 },
        { caption: "Klik ikon balon chat: Salin pesan untuk pengantin. Muncul Pesan tersalin.", focus: [pinCard, [516, DLG_B.noteY - 2, 408, 42]], mark: [hx - 12, hy - 12, 24, 24],
          lens: { src: [524, 425, 412, 100], zoom: 1.5, at: [530, 476] },
          at: DLG_B.handover, click: true, hover: "tip", show: ["copied"], dur: 3.6 },
        { caption: "Pesan berisi link undangan, link kelola undangan, dan PIN. Tempel di WA.", focus: [bx, by, 404, bh + 2], mark: { box: [bx, by, 404, bh], r: 8 },
          lens: { src: [bx - 8, by - 8, 420, bh + 18], zoom: 1.5 }, show: ["bubble"], dur: 4.4 }
      ]
    };
  })(),

  // 2. Masuk dashboard di HP (gerbang #gate di panel/index.html).
  "pasangan-masuk": (() => {
    const dots = () => Array.from({ length: 6 }, (_, i) => circle(52 + i * 11, 420, 3.6, { fill: T.text })).join("");
    const pinBox = [P(46, 0)[0], P(0, 408)[1], 70, 24];
    const input = { box: PB(36, 398, 318, 44), r: 8 }, btn = { box: PB(36, 458, 318, 40), r: 20 }, card = PB(16, 249, 358, 305);
    return {
      title: "Masuk ke Dashboard pasangan dengan PIN",
      base: [phoneDesk(ph(rect(16, 249, 358, 305, { r: 24, fill: "#fff" }), text(195, 297, "Kelola undangan", { size: 22, fill: T.text, anchor: "middle" }),
        para(195, 326, ["Kirim undangan, lihat RSVP dan ucapan, dan catat", "tamu di hari-H. Semuanya dari sini."], { size: 14, fill: T.sub, anchor: "middle", lh: 20 }),
        text(36, 388, "PIN atau kode staff", { size: 14, fill: T.sub }), rect(36.5, 398.5, 317, 43, { r: 8, fill: "#fff", stroke: T.border }),
        wa("lock", 73, 586, 14, T.sub), text(86, 591, "PIN hanya diingat selama tab ini terbuka.", { size: 13, fill: T.sub })), { screen: T.wash })],
      els: {
        focus: ph(rect(37, 399, 316, 42, { r: 8, fill: "#fff", stroke: T.accent, sw: 2 })),
        hint: ph(text(48, 425, "••••••", { size: 16, fill: T.sub })),
        pin1: ph(dots()),
        pin2: ph(rect(40, 402, 300, 36, { fill: "#fff" }), dots()),
        btn: ph(rect(36, 458, 318, 40, { r: 20, fill: T.accent }), text(195, 483, "Masuk", { size: 15, weight: 500, fill: "#fff", anchor: "middle" })),
        err: ph(text(195, 526, "PIN salah.", { size: 14, fill: T.danger, anchor: "middle" })),
        home: { svg: scr(HOME_STATIC), enter: "fade", skel: true }
      },
      steps: [
        { caption: "Pengantin membuka link dashboard dari WA, lalu mengetuk kolom PIN.", focus: card, mark: input, lens: { src: PB(28, 370, 334, 80), zoom: 1.5 }, at: P(195, 420), click: true, show: ["focus"], dur: 3.4 },
        { caption: "Ketik PIN 6 angka (pengantin) atau kode staff 8 karakter (staff).", mark: input, lens: { src: PB(28, 370, 334, 80), zoom: 1.5 }, hide: ["hint"], show: ["pin1"], type: [{ id: "pin1", n: 6, box: pinBox }], dur: 2.8 },
        { caption: "Tekan Masuk. Kalau salah, muncul tulisan merah: PIN salah.", mark: btn, lens: { src: PB(28, 450, 334, 92), zoom: 1.5 }, at: P(195, 478), click: true, press: "btn", show: ["err"] },
        { caption: "Hapus, lalu ketik ulang PIN yang benar.", mark: input, lens: { src: PB(28, 370, 334, 80), zoom: 1.5 }, hide: ["pin1"], show: ["pin2"], type: [{ id: "pin2", n: 6, box: pinBox }], dur: 2.8 },
        { caption: "Tekan Masuk. PIN benar: Beranda terbuka.", focus: PB(0, 0, 390, 844), mark: btn, note: "Masuk", at: P(195, 478), click: true, press: "btn",
          hide: ["focus", "pin2", "btn", "err"], show: ["home"], dur: 3.4 },
        { caption: "Tab ada di bawah layar. Lingkaran inisial di kanan membuka menu akun.", focus: PB(0, 773, 390, 71), mark: [{ box: PB(4, 782, 324, 56), r: 12 }, { box: PB(341, 793, 32, 32), r: 16 }],
          lens: { src: PB(196, 778, 186, 64) }, at: P(270, 240), dur: 3.8 }
      ]
    };
  })(),

  // 3. Beranda (home-view rekap): hitung mundur, estimasi hadir, empat angka, tombol cepat.
  "pasangan-beranda": {
    title: "Membaca Beranda Dashboard pasangan",
    cursorStart: P(270, 240),
    base: [phoneDesk("", { screen: T.wash })],
    els: {
      home: { svg: ph(homeContent()), skel: true },
      chromeTop: { svg: ph(head("Beranda"), tabbar("beranda")), skel: true },
      tamu: { svg: scr(tamuList()), enter: "fade", skel: true },
      masks: MASKS
    },
    steps: [
      { caption: "Beranda terbuka pertama kali setelah masuk.", focus: PB(0, 0, 390, 844), lens: { src: PB(0, 0, 390, 64), zoom: 1.25 }, dur: 2.8 },
      { caption: "Di bawah judul: berapa hari lagi menuju acara utama.", focus: PB(0, 64, 390, 110), mark: PB(12, 113, 366, 52), lens: { src: PB(8, 76, 348, 94), zoom: 1.25 } },
      { caption: "Estimasi tamu hadir menjumlahkan orang dari RSVP Hadir.", focus: PB(16, 180, 358, 230), mark: { box: PB(16, 180, 358, 230), r: 16 }, lens: { src: PB(8, 172, 374, 246), zoom: 1.25 } },
      { caption: "Gulir: konfirmasi, sudah datang, ucapan, dan tamu membuka.", focus: PB(16, 104, 358, 207), mark: { box: PB(16, 104, 358, 207), r: 16 }, lens: { src: PB(8, 96, 374, 223), zoom: 1.25 },
        scroll: { id: "home", dy: 330 }, dur: 3.4 },
      { caption: "Tombol cepat: Lihat undangan, Kirim undangan, Scan tamu datang.", focus: PB(16, 335, 358, 211), mark: { box: PB(16, 335, 358, 211), r: 16 }, lens: { src: PB(8, 327, 374, 227), zoom: 1.25 } },
      { caption: "Gulir ke atas, tekan Lihat daftar tamu: tab Tamu terbuka.", focus: PB(0, 0, 390, 180), mark: { box: PB(...LIHAT_DAFTAR), r: 18 },
        note: "Lihat daftar tamu", scroll: { id: "home", dy: -330 }, at: P(LIHAT_DAFTAR[0] + 72, LIHAT_DAFTAR[1] + 18), click: true, show: ["tamu"], dur: 5 }
    ]
  },

  // 4. Kirim undangan (share/index.html di HP).
  "pasangan-kirim": (() => {
    const dewi = P(200, 158 + 144 + 36), rowsF = PB(0, 150, 390, 230);
    const sticky = (c) => PB(0, 64, 390, c.ready[1] + c.ready[3] + 8 - 64);
    const sendNo = P(CHAT_NO.send[0], CHAT_NO.send[1] - NO_DY), sendFix = P(CHAT_FIX.send[0], CHAT_FIX.send[1] - CHAT_DY);
    const checks = PB(CHAT_U.checks[0], CHAT_U.checks[1] - CHAT_DY, CHAT_U.checks[2], CHAT_U.checks[3]);
    return {
      title: "Mengirim undangan per tamu lewat WhatsApp",
      base: [phoneDesk(ph(kirimTop([0, 0, 0]), text(195, 452, "Belum ada tamu", { size: 16, fill: T.text, anchor: "middle" }),
        para(195, 478, ["Tekan tombol tambah untuk menempel daftar", "tamu dari WhatsApp, Excel, atau catatan."], { size: 14, fill: T.sub, anchor: "middle", lh: 20 }), fab(), tabbar("kirim")))],
      els: {
        fab: ph(fab()),
        drawer: { svg: scr(rect(0, 0, 390, 773, { fill: "#fff" }), wa("back", 36, 32), text(64, 38, "Tambah tamu", { size: 16, weight: 500, fill: T.text }),
          text(20, 90, "Daftar tamu, satu per baris", { size: 14, fill: T.sub }), rect(20.5, 100.5, 349, 179, { r: 8, fill: "#fff", stroke: T.border }),
          para(20, 302, ["Format: nama - nomor WA - kategori - jumlah orang.", "Hanya nama yang wajib. Bisa ditempel langsung dari", "WhatsApp, Excel, atau catatan. File CSV: kolom", "nama, no wa, kategori, jumlah."], { size: 13, fill: T.sub, lh: 17 }),
          pillBtn(20, 390, 136, "Simpan daftar"), pillBtn(164, 390, 104, "Impor CSV", { soft: true })), skel: true },
        ph1: { svg: scr(para(32, 126, ["Keluarga Besar Surya", "Bapak Andi & Ibu Rina - 081234567890", "Dewi Lestari - 082198765432 - Sahabat - 2"], { size: 16, fill: T.grey, lh: 24 })), skel: true },
        paste: { svg: scr(rect(22, 102, 346, 176, { r: 7, fill: "#fff" }), rect(21, 101, 348, 178, { r: 8, stroke: T.accent, sw: 2 }),
          para(32, 126, ["Keluarga Besar Surya", "Bapak Andi & Ibu Rina - 081234567890", "Dewi Lestari - 082198765432 - Sahabat - 2"], { size: 16, fill: T.text, lh: 24 })), enter: "fade", skel: true },
        list: { svg: scr(kirimTop([3, 3, 0]), SENT_ROWS(false), fab(), tabbar("kirim")), enter: "fade", skel: true },
        ready: { svg: scr(waToast(195, 684, "3 tamu siap.")), enter: "slide" },
        chat: { svg: scr(CHAT.svg), enter: "fade", skel: true },
        chatU: { svg: ph(CHAT_U.svg), enter: "fade", skel: true },
        stickOk: { svg: scr(CHAT_U.sticky), enter: "fade", skel: true },
        broken: { svg: scr(`<g transform="translate(0 ${-NO_DY})">${CHAT_NO.svg}</g>`, CHAT_NO.sticky), enter: "fade", skel: true },
        fixed: { svg: scr(`<g transform="translate(0 ${-CHAT_DY})">${CHAT_FIX.svg}</g>`, CHAT_FIX.sticky), enter: "fade", skel: true },
        chatTop: { svg: scr(chatBar("Dewi Lestari", "", "+6282198765432", { av: false })), enter: "fade", skel: true },
        opened: { svg: scr(waToast(195, 684, "WhatsApp dibuka untuk Dewi Lestari.")), enter: "slide" },
        sent: { svg: scr(kirimTop([3, 2, 1]), SENT_ROWS(true), fab(), tabbar("kirim")), enter: "fade", skel: true },
        masks: MASKS
      },
      steps: [
        { caption: "Buka tab Kirim. Tekan tombol tambah hijau di kanan bawah.", focus: PB(0, 0, 390, 290), mark: { box: PB(317, 701, 56, 56), r: 16 },
          note: "Tombol tambah", at: FAB, click: true, press: "fab", hide: ["fab"], show: ["drawer", "ph1"] },
        { caption: "Tempel daftar tamu, satu per baris. Hanya nama yang wajib.", focus: PB(0, 64, 390, 230), mark: { box: PB(20, 100, 350, 180), r: 8 },
          lens: { src: PB(12, 96, 366, 192), zoom: 1.25 }, at: P(195, 190), click: true, hide: ["ph1"], show: ["paste"], dur: 3.4 },
        { caption: "Tekan Simpan daftar. Muncul 3 tamu siap, masing-masing dengan tautan.", focus: [PB(0, 96, 390, 344), PB(40, 630, 310, 60)], mark: { box: PB(20, 390, 136, 40), r: 20 },
          lens: { src: PB(12, 286, 366, 152), zoom: 1.25 }, at: P(88, 410), click: true, show: ["list", "ready"], dur: 3.6 },
        { caption: "Ketuk nama tamu. Pratinjau pesan dengan tautan pribadinya muncul.", focus: [PB(0, 0, 390, 64), PB(...CHAT.card)], mark: { box: PB(10, 302, 370, 72), r: 12 },
          note: "Dewi Lestari", at: dewi, click: true, hide: ["ready"], show: ["chat", "chatTop"], dur: 3.6 },
        { caption: "Kartu berisi gambar, judul, dan deskripsi dari SEO & Page Identity Scalev.", focus: PB(...CHAT.card), mark: { box: PB(...CHAT.card), r: 6 },
          lens: { src: PB(CHAT.card[0], CHAT.card[1] + CHAT.card[2], CHAT.card[2], 72), zoom: 1.5 }, dur: 3.6 },
        { caption: "Versi terbaru belum terbit? Muncul Belum diterbitkan: terbitkan dulu di Scalev.", focus: PB(66, 414, 308, 124), mark: PB(...CHAT_U.unpubNote),
          lens: { src: PB(66, 422, 308, 118), zoom: 1.5 }, show: ["chatU"], dur: 4.2 },
        { caption: "Gulir ke bawah. Status Siap dikirim dan daftar periksa semuanya hijau.", focus: [sticky(CHAT_U), checks], mark: [{ box: checks, r: 8 }, { box: PB(...CHAT_U.ready), r: 8 }],
          lens: { src: [checks[0] - 4, checks[1], checks[2] + 8, Math.min(checks[3], 250)], zoom: 1.25 }, scroll: { id: "chatU", dy: CHAT_DY }, show: ["stickOk"], dur: 4 },
        { caption: "Baris [link-undangan] terhapus? Belum bisa dikirim, tombol kirim mati.", focus: [sticky(CHAT_NO), [sendNo[0] - 30, sendNo[1] - 30, 60, 60]],
          mark: [{ box: PB(...CHAT_NO.ready), r: 8 }, circ(sendNo[0], sendNo[1], 20)], lens: { src: PB(4, CHAT_NO.ready[1] - 8, 382, CHAT_NO.ready[3] + 16), zoom: 1.25 },
          at: sendNo, show: ["broken"], dur: 4.4 },
        { caption: "Tekan + [link-undangan]. Tanda kembali hijau, tombol kirim menyala.", focus: [sticky(CHAT_NO), [sendNo[0] - 30, sendNo[1] - 30, 60, 60]], mark: { box: PB(...CHAT_NO.chipBox), r: 15 },
          lens: { src: PB(0, 66, CHAT_NO.chipBox[0] + CHAT_NO.chipBox[2] + 4, 42), zoom: 1.5, at: [600, 24] }, at: P(CHAT_NO.chip[0], 87), click: true, hide: ["broken"], show: ["fixed"], dur: 4 },
        { caption: "Tekan tombol kirim hijau. WhatsApp terbuka.", focus: [sendFix[0] - 28, sendFix[1] - 28, 56, 56], mark: circ(sendFix[0], sendFix[1], 20),
          note: "Kirim", at: sendFix, click: true, show: ["opened"], dur: 3.6 },
        { caption: "Kembali ke daftar: tamu itu bercentang dan masuk hitungan Terkirim.", focus: [PB(0, 0, 390, 150), rowsF], mark: BACK,
          lens: { src: PB(10, 302, 370, 72), zoom: 1.25 }, at: P(24, 32), click: true, hide: ["opened"], show: ["sent"], dur: 3.8 }
      ]
    };
  })(),

  // 5. Tab Tamu: buka, saring, cari, detail seperti chat, kembali.
  "pasangan-tamu": (() => {
    const hadir = [GUESTS[0], GUESTS[3]], g = DET.geo, { detail, infoA, composeA } = DET.els;
    return {
      title: "Melihat daftar tamu dan detailnya",
      base: [phoneDesk(ph(HOME_STATIC), { screen: T.wash })],
      els: {
        list: { svg: scr(tamuList()), enter: "fade", skel: true },
        hadir: { svg: scr(tamuList({ active: 1, rows: hadir })), enter: "fade", skel: true },
        res: { svg: scr(tamuList({ active: 1, rows: [GUESTS[0]], q: true })), enter: "fade", delay: 1.4, skel: true },
        qbox: scr(searchOn(66)),
        qtxt: scr(text(68, 91, "Dewi", { size: 14, fill: T.text })),
        sel: { svg: scr(rect(10, TAMU_ROW0, 370, 72, { r: 12, fill: T.hi }), row(TAMU_ROW0, { ...GUESTS[0], ini: iniR(GUESTS[0].name) })), skel: true },
        detail, infoA, composeA
      },
      steps: [
        { caption: "Buka tab Tamu. Muncul Kehadiran dan ucapan dan jumlah tamu.", focus: [PB(0, 0, 390, 180), PB(0, 773, 390, 71)], mark: tabBox("tamu"),
          lens: { src: PB(70, 778, 193, 64), at: [20, 470] }, at: tabAt("tamu"), click: true, show: ["list"] },
        { caption: "Saring daftar: tekan Hadir. Angka di tombol menunjukkan jumlahnya.", focus: PB(0, 100, 390, 260), mark: { box: PB(...tamuChips(0).boxes[1]), r: 16 },
          lens: { src: PB(12, 108, tamuChips(0).boxes[2][0] - 12, 72) }, at: P(TAMU_CHIP_AT[1][0], 132), click: true, show: ["hadir"] },
        { caption: "Cari tamu: ketik nama di kolom Cari nama, ucapan, atau nomor HP.", focus: PB(0, 60, 390, 230), mark: { box: PB(20, 66, 350, 40), r: 20 },
          lens: { src: PB(12, 58, 366, 154), zoom: 1.25 }, at: P(160, 86), click: true, show: ["res", "qbox", "qtxt"], type: [{ id: "qtxt", n: 4, box: [PX + 68, PY + 76, 34, 20] }], dur: 4 },
        { caption: "Buka detail tamu: ketuk namanya. RSVP, ucapan, dan Info tamu tampil.", focus: PB(0, 0, 390, g.infoTop + 300), mark: { box: PB(10, TAMU_ROW0, 370, 72), r: 12 },
          lens: { src: PB(8, g.bTop - 8, 321, g.bh + 16), zoom: 1.5 }, at: P(200, TAMU_ROW0 + 62), click: true, hide: ["qbox", "qtxt"], show: ["sel", "detail", "infoA", "composeA"], dur: 3.6 },
        { caption: "Tekan panah kiri untuk kembali ke daftar tamu.", focus: PB(0, 0, 390, 300), mark: BACK, lens: { src: PB(0, 0, 390, 64), zoom: 1.25, at: [12, 60] },
          at: P(24, 32), click: true, hide: ["sel", "detail", "infoA", "composeA"], show: ["qbox", "qtxt"] }
      ]
    };
  })(),

  // 6. Tab Ucapan: buka, balas, menu ⋮, pilih banyak.
  "pasangan-ucapan": (() => {
    const menu = [["pencil", "Ubah ucapan"], ["eye-off", "Sembunyikan ucapan"], ["del", "Hapus balasan", true], ["lock-open", "Buka kunci perangkat"], ["del", "Hapus data tamu", true]];
    const g = DET.geo, compose = { box: PB(8, 784, 374, 52), r: 26 }, bulk = { src: PB(12, 134, 366, 134), zoom: 1.25 };
    const pick = (i, picked) => ({ box: PB(22, ucapanRowY(i, picked) + 26, 20, 20), r: 5 });
    return {
      title: "Membalas ucapan dan memilih banyak ucapan",
      base: [phoneDesk(ph(tamuList()))],
      els: {
        ucapan: { svg: scr(ucapanList()), enter: "fade", skel: true },
        sel: { svg: scr(rect(54, ucapanRowY(0), 326, 72, { r: 12, fill: T.hi }), row(ucapanRowY(0), { x0: 54, name: UCAPAN[0][0], ini: iniR(UCAPAN[0][0]), time: UCAPAN[0][1], parts: [{ t: "Belum dibalas" }, { t: UCAPAN[0][2] }] })), skel: true },
        ...DET.els,
        menu: { svg: scr(menuBox(142, 56, 232, 221), ...menu.map(([ic, l, d], i) => menuItem(150, 64 + i * 41, ic, l, d))), enter: "pop", origin: P(362, 40) },
        back: { svg: scr(ucapanList({ replied: true })), enter: "fade", skel: true },
        pick1: { svg: scr(ucapanList({ replied: true, picked: [1] })), skel: true },
        pick2: { svg: scr(ucapanList({ replied: true, picked: [1, 2] })), skel: true }
      },
      steps: [
        { caption: "Buka tab Ucapan. Tiap baris bertanda Belum dibalas atau Sudah dibalas.", focus: [PB(0, 0, 390, 250), PB(0, 773, 390, 71)], mark: tabBox("ucapan"),
          lens: { src: PB(134, 778, 194, 64), at: [20, 470] }, at: tabAt("ucapan"), click: true, show: ["ucapan"] },
        { caption: "Balas ucapan: ketuk ucapannya. Detail terbuka seperti chat.", focus: PB(0, 0, 390, g.bEnd + 30), mark: { box: PB(54, ucapanRowY(0), 326, 72), r: 12 },
          lens: { src: PB(8, 100, 374, 150), zoom: 1.25 }, at: P(200, ucapanRowY(0) + 36), click: true, show: ["sel", "detail", "infoA", "composeA"] },
        { caption: "Tekan Tulis balasan di bawah.", focus: PB(0, 740, 390, 104), mark: compose, lens: { src: PB(4, 756, 382, 88), zoom: 1.25 }, at: P(150, 810), click: true, show: ["reply", "phReply"], dur: 2.8 },
        { caption: "Ketik balasan, maksimal 500 huruf.", mark: compose, lens: { src: PB(4, 756, 382, 88), zoom: 1.25 }, hide: ["phReply"], show: ["typed"], type: [{ id: "typed", n: 26, box: [PX + 29, PY + 798, 196, 24] }], dur: 2.8 },
        { caption: "Tekan tombol kirim. Muncul Balasan berhasil disimpan.", focus: [PB(0, g.replyTop, 390, g.outY + g.outH + 12 - g.replyTop), PB(60, 700, 270, 60)], mark: circ(P(357, 811)[0], P(357, 811)[1], 20),
          lens: { src: PB(138, g.outY - 8, 244, g.outH + 16), zoom: 1.75 }, at: P(357, 811), click: true, hide: ["reply", "typed"], show: ["out", "saved"], dur: 3.6 },
        { caption: "Menu ⋮ di kanan atas: ubah, sembunyikan, hapus, buka kunci perangkat.", focus: PB(0, 0, 390, 64), mark: KEBAB, lens: { src: PB(140, 50, 240, 236), zoom: 1.5 },
          at: P(362, 32), click: true, hide: ["saved"], show: ["menu"], dur: 3.8 },
        { caption: "Tutup menu dan kembali. Ucapan itu kini Sudah dibalas.", focus: [PB(0, 0, 390, 64), PB(0, 150, 390, 250)], mark: BACK, lens: { src: PB(16, 166, 366, 88), zoom: 1.25 },
          at: P(24, 32), click: true, hide: ["menu"], show: ["back"] },
        { caption: "Pilih banyak: centang kotak di kiri ucapan. Bar dipilih muncul.", focus: PB(0, 130, 390, 410), mark: pick(1, []), lens: bulk,
          at: P(32, ucapanRowY(1) + 36), click: true, show: ["pick1"] },
        { caption: "Centang lagi, lalu pilih Tampilkan, Sembunyikan, Hapus, atau Batal.", mark: pick(2, [1]), lens: bulk,
          at: P(32, ucapanRowY(2, [1]) + 36), click: true, show: ["pick2"], dur: 3.8 }
      ]
    };
  })(),

  // 7. Hari-H (checkin/index.html di dalam dashboard).
  "pasangan-hari-h": {
    title: "Check-in tamu di hari-H",
    base: [phoneDesk(ph(HOME_STATIC), { screen: T.wash })],
    els: {
      scan: { svg: scr(rect(0, 0, 390, 844, { fill: T.wall }), pillBtn(16, 80, 358, "Buka kamera"), linkBox(132)), enter: "fade", skel: true },
      cam: { svg: scr(rect(0, 64, 390, 709, { fill: T.wall }), camStage(), pillBtn(16, 448, 358, "Tutup kamera"), text(195, 501, "Arahkan ke QR tamu.", { size: 13, fill: T.sub, anchor: "middle" }), linkBox(517)), skel: true },
      qr: { svg: scr(rect(110, 150, 170, 218, { r: 14, fill: "#2c3a43" }), rect(118, 160, 154, 198, { r: 8, fill: "#fdf6ee" }), qrCode(139, 200, 112)), enter: "rise" },
      // Hasil scan = kartu di dalam jendela kamera; tombol dan kolom link tidak bergeser. Riwayat: satu baris per tamu.
      ok: { svg: scr(camCard("ok"), recentBox(604, [[true]])), enter: "rise", skel: true },
      warn: { svg: scr(camStage(), camCard("warn")), skel: true },
      pasted: { svg: scr(rect(30, 543, 290, 46, { fill: "#fff" }), text(37, 572, fit(SITE + "?to=Bapak+Andi+%26+Ibu+Rina&u=P4N8RW", 280, 16), { size: 16, fill: T.text })), enter: "fade" },
      andi: { svg: scr(camStage(), camCard("ok", ANDI), rect(30, 543, 290, 46, { fill: "#fff" }), text(37, 572, "https://…?to=Nama&u=KODE", { size: 16, fill: T.grey }), recentBox(604, [[true, ANDI], [true]])), skel: true },
      closed: { svg: scr(rect(0, 64, 390, 709, { fill: T.wall }), resultBox("ok", ANDI), pillBtn(16, 292, 358, "Buka kamera"), text(195, 345, "Arahkan ke QR tamu.", { size: 13, fill: T.sub, anchor: "middle" }), linkBox(361), recentBox(448, [[true, ANDI], [true]])), enter: "fade", skel: true },
      cover: { svg: scr(scanBar(), tabbar("harih")), enter: "fade", skel: true }
    },
    steps: [
      { caption: "Buka tab Hari-H di HP penerima tamu.", focus: [PB(0, 0, 390, 220), PB(0, 773, 390, 71)], mark: tabBox("harih"), lens: { src: PB(196, 778, 186, 64), at: [20, 470] },
        at: tabAt("harih"), click: true, show: ["scan", "cover"], dur: 3 },
      { caption: "Tekan Buka kamera, lalu izinkan kamera.", focus: PB(0, 64, 390, 460), mark: { box: PB(16, 80, 358, 40), r: 20 }, note: "Buka kamera",
        at: P(195, 100), click: true, show: ["cam"] },
      { caption: "Arahkan QR tamu ke dalam garis bidik di jendela kamera.", mark: { box: PB(STAGE.x, STAGE.y, STAGE.s, STAGE.s), r: 12 }, lens: { src: PB(8, 440, 374, 72), zoom: 1.25 }, show: ["qr"], dur: 3 },
      { caption: "Kartu hijau Selamat datang muncul di jendela kamera.", focus: [PB(0, 64, 390, 380), PB(0, 600, 390, 130)], mark: { box: PB(27, 298, 336, 128), r: 8 },
        lens: { src: PB(19, 290, 352, 144), zoom: 1.25 }, hide: ["qr"], show: ["ok"], dur: 3.4 },
      { caption: "Dipindai lagi? Kartu kuning: Sudah check-in pukul 10.12.", mark: { box: PB(27, 322, 336, 104), r: 8 }, lens: { src: PB(19, 314, 352, 120), zoom: 1.25 }, show: ["warn"], dur: 3.4 },
      { caption: "QR tidak terbaca? Ketuk kolom Atau tempel link tamu, tempel link.", focus: PB(0, 500, 390, 100), mark: { box: PB(16, 540, 358, 52), r: 26 },
        lens: { src: PB(8, 514, 374, 86), zoom: 1.25 }, at: P(180, 566), click: true, show: ["pasted"], dur: 3.4 },
      { caption: "Tekan tombol kirim hijau. Hasilnya sama seperti scan.", focus: [PB(0, 64, 390, 380), PB(0, 500, 390, 273)], mark: circ(P(347, 566)[0], P(347, 566)[1], 20),
        lens: { src: PB(19, 290, 352, 144), zoom: 1.25 }, at: P(347, 566), click: true, hide: ["pasted"], show: ["andi"], dur: 3.4 },
      { caption: "Tekan Tutup kamera. Riwayat ada di Check-in di perangkat ini.", focus: PB(0, 440, 390, 333), mark: { box: PB(16, 448, 358, 40), r: 20 },
        lens: { src: PB(8, 440, 374, 212), zoom: 1.25 }, at: P(195, 468), click: true, show: ["closed"], dur: 3.8 }
    ]
  },

  // 8. Pelacakan di laptop: lajur ikon kiri + daftar + detail (di HP lewat menu akun).
  "pasangan-pelacakan": {
    title: "Melihat siapa yang sudah membuka undangan",
    base: [railD("beranda") + berandaDesk()],
    els: {
      pel: { svg: PEL_ALL, enter: "fade", skel: true },
      penuh: { svg: PEL_PENUH, enter: "fade", skel: true }
    },
    steps: [
      { caption: "Di laptop, klik ikon Pelacakan di lajur kiri (di HP lewat menu akun).", focus: [[0, 0, 64, 900], [64, 0, 550, 174]], mark: circ(32, 291, 20),
        lens: { src: [72, 4, 532, 170], zoom: 1.5, at: [410, 40] }, at: [32, 291], click: true, show: ["pel"], dur: 3.4 },
      { caption: "Tiap baris: berapa kali dibuka, kapan pertama, dan jumlah perangkat.", focus: [64, 262, 550, 440], mark: { box: [74, 268, 530, 424], r: 12 },
        lens: { src: [80, 296, 520, 152], zoom: 1.5 }, dur: 3.8 },
      { caption: "Saring dengan Perangkat penuh: tamu yang jatah perangkatnya habis.", focus: [64, 100, 550, 380], mark: { box: PENUH_CHIP, r: 16 },
        lens: { src: [80, 296, 520, 80], zoom: 1.5 }, at: [520, 132], click: true, show: ["penuh"] },
      { caption: "Bar PIN tamu untuk HP baru: berikan PIN ini ke tamu yang ganti HP.", focus: [64, 170, 550, 90], mark: { box: [84, 175, 510, 80], r: 10 },
        lens: { src: [80, 171, 518, 88], zoom: 1.5 }, dur: 3.6 },
      { caption: "Ikon unduh di kanan atas: CSV berisi nama, jumlah buka, dan perangkat.", focus: [64, 0, 550, 64], mark: circ(582, 32, 20), note: "Unduh CSV", at: [582, 32] }
    ]
  },

  // 9. Buka kunci perangkat: panel detail tamu di kanan (laptop).
  "pasangan-buka-kunci": {
    title: "Membuka kunci perangkat tamu",
    base: [PEL_ALL],
    els: {
      det: { svg: rect(74, 300, 530, 144, { fill: "#fff" }) + rowD(74, 300, 530, TRACK.dewi) + rowD(74, 372, 530, { ...TRACK.hendra, sel: true }) + hendraD(), enter: "fade", skel: true },
      menu: { svg: menuBox(1192, 56, 232, 56) + menuItem(1200, 64, "lock-open", "Buka kunci perangkat"), enter: "pop", origin: [1404, 40] },
      reset: ddPatch(0, "Sudah dibuka") + ddPatch(4, "0/2"),
      done: { svg: waToast(1027, 884, "Kunci perangkat dibuka."), enter: "slide" }
    },
    steps: [
      { caption: "Klik tamu di daftar. Detailnya tampil di kanan.", focus: [[74, 372, 530, 72], [614, 0, 826, 900]], mark: { box: [74, 372, 530, 72], r: 12 },
        lens: { src: [623, 4, 460, 64], zoom: 1.5, at: [12, 420] }, at: [330, 408], click: true, show: ["det"], dur: 3.2 },
      { caption: "Aktivitas undangan: Status, Dibuka, Perangkat 2/2, dan Kode tamu.", focus: [788, 400, 480, 300], mark: { box: [788, 437, 480, 260], r: 12 },
        lens: { src: [780, 429, 496, 276], zoom: 1.5 }, dur: 3.6 },
      { caption: "Klik ⋮ di kanan atas. Menu tamu terbuka.", focus: [1180, 0, 260, 130], mark: circ(1404, 32, 20), lens: { src: [1184, 50, 248, 70], at: [600, 110] },
        at: [1404, 32], click: true, show: ["menu"] },
      { caption: "Pilih Buka kunci perangkat supaya tamu bisa membuka di HP baru.", focus: [[1180, 0, 260, 130], [788, 437, 480, 260], [860, 820, 340, 70]], mark: { box: [1200, 64, 216, 40], r: 10 },
        note: { text: "Buka kunci perangkat", at: [600, 110] }, at: [1308, 84], click: true, hide: ["menu"], show: ["reset", "done"] },
      { caption: "Muncul Kunci perangkat dibuka. Status dan Perangkat kembali 0/2.", focus: [[788, 437, 480, 260], [860, 820, 340, 70]], mark: [[788, 441, 480, 36], [788, 585, 480, 36]],
        lens: { src: [780, 429, 496, 276], zoom: 1.5 }, dur: 3.6 }
    ]
  },

  // 10. Pengaturan undangan (menu akun > Pengaturan undangan > Buka untuk semua).
  "pasangan-pengaturan": (() => {
    const MX = 80, MY = 565, MW = 302;
    const settings = () => rect(0, 0, 390, 844, { fill: T.wash }) + head("Pengaturan") + circle(195, 120, 40, { fill: T.soft }) + text(195, 130, "RD", { size: 28, fill: T.strong, anchor: "middle" }) +
      text(195, 196, "Undangan Anda", { size: 20, fill: T.text, anchor: "middle" }) + text(195, 222, "/rani-dimas", { size: 16, fill: T.sub, anchor: "middle" }) +
      text(20, 284, "Undangan", { size: 14, fill: T.sub }) + rect(16, 298, 358, 112, { r: 12, fill: "#fff" }) +
      [["external-link", "Lihat undangan"], ["send", "Kirim undangan"]].map(([ic, l], i) => wa(ic, 48, 328 + i * 52, 24, T.sub) + text(76, 333 + i * 52, l, { size: 15, fill: T.text }) + wa("chevron-right", 350, 328 + i * 52, 20, T.sub)).join("") +
      text(20, 444, "Akses tamu", { size: 14, fill: T.sub }) + rect(16, 458, 358, 60, { r: 12, fill: "#fff" }) + wa("lock-open", 48, 488, 24, T.sub) + text(76, 493, "Buka untuk semua", { size: 15, fill: T.text }) +
      text(20, 552, "Akses dashboard", { size: 14, fill: T.sub }) + rect(16, 566, 358, 60, { r: 12, fill: "#fff" }) + wa("log-out", 48, 596, 24, T.danger) + text(76, 601, "Keluar", { size: 15, fill: T.danger }) + wa("chevron-right", 350, 596, 20, T.danger) +
      tabbar(null);
    const chipState = (s) => scr(rect(300, 478, 66, 24, { fill: "#fff" }), text(354, 493, s, { size: 14, fill: T.sub, anchor: "end" }));
    const open = { box: PB(16, 458, 358, 60), r: 12 }, toastF = PB(60, 700, 270, 60);
    return {
      title: "Membuka Pengaturan undangan dan Buka untuk semua",
      base: [phoneDesk(ph(HOME_STATIC), { screen: T.wash })],
      els: {
        menu: { svg: scr(menuBox(MX, MY, MW, 203), text(MX + 20, MY + 34, "Undangan Anda", { size: 16, weight: 500, fill: T.text }), text(MX + 20, MY + 52, SITE, { size: 13, fill: T.sub }),
          line(MX + 8, MY + 68.5, MX + MW - 8, MY + 68.5, { stroke: T.line }), menuItem(MX + 8, MY + 75, "pelacakan", "Pelacakan"), menuItem(MX + 8, MY + 115, "akun", "Pengaturan undangan"),
          menuItem(MX + 8, MY + 155, "keluar", "Keluar", true)), enter: "pop", origin: ME },
        set: { svg: scr(settings()), enter: "fade", skel: true },
        off: chipState("Mati"),
        on: chipState("Aktif"),
        off2: chipState("Mati"),
        tOn: { svg: scr(waToast(195, 756, "Terbuka untuk semua.")), enter: "slide" },
        tOff: { svg: scr(waToast(195, 756, "Kembali khusus tamu.")), enter: "slide" }
      },
      steps: [
        { caption: "Di HP, ketuk lingkaran inisial di ujung kanan tab bawah.", focus: [PB(0, 773, 390, 71), PB(MX, MY, MW, 203)], mark: { box: PB(341, 793, 32, 32), r: 16 },
          lens: { src: PB(76, 561, 310, 211), zoom: 1.5, at: [12, 300] }, at: ME, click: true, show: ["menu"] },
        { caption: "Menu akun terbuka. Pilih Pengaturan undangan.", focus: PB(0, 0, 390, 240), mark: { box: PB(MX + 8, MY + 115, MW - 16, 40), r: 10 },
          note: "Pengaturan undangan", at: P(MX + 120, MY + 135), click: true, show: ["set", "off"] },
        { caption: "Bagian Undangan: buka undangan sebagai tamu, atau pindah ke Kirim.", focus: PB(0, 270, 390, 150), mark: { box: PB(16, 298, 358, 112), r: 12 },
          lens: { src: PB(8, 264, 374, 154), zoom: 1.25 }, hide: ["menu"], dur: 3.6 },
        { caption: "Ketuk Buka untuk semua: undangan khusus terbuka tanpa tautan tamu.", focus: [PB(0, 430, 390, 100), toastF], mark: open, lens: { src: PB(8, 452, 374, 72), zoom: 1.25 },
          at: P(195, 488), click: true, show: ["on", "tOn"], dur: 3.6 },
        { caption: "Ketuk lagi untuk kembali khusus tamu. Status kembali Mati.", mark: open, lens: { src: PB(8, 452, 374, 72), zoom: 1.25 },
          at: P(195, 488), click: true, hide: ["tOn"], show: ["off2", "tOff"], dur: 3.6 }
      ]
    };
  })()
};

export const scenes = SCENES;
