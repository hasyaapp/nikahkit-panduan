// Ukuran, warna, huruf, dan alat bersama video panduan (30 fps), dalam dua tata letak: tegak 1080x1920 (Shorts, TikTok,
// Reels) dan lanskap 1920x1080 (YouTube, panduan). Layar iPhone digambar dalam pt (= px CSS tangkapan layar, 402x874), lalu
// diperbesar s kali ke video; kotak dari layar.json memakai pt yang sama.
import { createContext, useContext } from "react";
import { Easing, interpolate } from "remotion";
import { loadFont } from "@remotion/fonts";
import { loadFont as nunito } from "@remotion/google-fonts/Nunito";
import mockup from "./mockup.json";

export const FPS = 30;

// iPhone: layar 402x874 pt, bilah status 62 (Dynamic Island), bilah Safari bawah 84; isi web 402x728 = tangkapan layar.
export const HP = { w: 402, h: 874, status: 62, safari: 84 };
export const WEB_Y = HP.status, WEB_H = HP.h - HP.status - HP.safari;
// Bingkai dari render model AR Apple (alat/mockup.swift): posisi gambar terhadap layar, dalam pt.
const I = mockup.iphone, PT = I.layar.w / HP.w;
export const BINGKAI = { x: I.layar.x / PT, y: I.layar.y / PT, w: I.w / PT, h: I.h / PT, r: I.layar.r / PT };

// Tata letak (px kanvas). aman = zona aman, semua isi di dalamnya. panggung = tempat ponsel, kartu, dan pil: ponsel utuh pas
// setinggi panggung, di tengah mendatar, perbesaran paling besar kmaks (bingkai utuh selebar panggung), jadi sisi kiri dan
// kanan ponsel tidak pernah terpotong; saat diperbesar hanya atas dan bawah panggung yang memudar lembut. langkah = garis
// langkah 1-5, judul = judul langkah, teks = teks narasi, laptop = lebar MacBook (di tengah panggung, boleh keluar zona aman).
function susun(W, H, t) {
  const g = t.panggung, s = (g.y1 - g.y0) / BINGKAI.h;
  const ponsel = { x: (g.x0 + g.x1) / 2 - (HP.w / 2) * s, y: g.y0 + BINGKAI.y * s };
  return { W, H, ...t, s, kmaks: (g.x1 - g.x0) / (BINGKAI.w * s), ponsel, pusat: { x: (g.x0 + g.x1) / 2, y: ponsel.y + (HP.h / 2) * s } };
}
// Tegak: zona aman feed Shorts, TikTok, dan Reels (longgar), bebas dari kepala aplikasi di atas, keterangan dan tombol di
// bawah. Dari atas, dengan jarak lega di antaranya: garis langkah, judul, panggung ponsel, teks narasi.
const AMAN_T = { x0: 80, y0: 170, x1: 1000, y1: 1590 };
const PANGGUNG_T = { x0: AMAN_T.x0, x1: AMAN_T.x1, y0: AMAN_T.y0 + 190, y1: AMAN_T.y1 - 150 };
// Lanskap: ponsel di kiri; di kolom kanan, garis langkah, judul, dan teks narasi berkelompok di tengah tinggi kanvas.
const AMAN_L = { x0: 100, y0: 60, x1: 1820, y1: 1020 }, KOLOM_L = { x0: 1020, x1: AMAN_L.x1 };
export const TATA = {
  tegak: susun(1080, 1920, { aman: AMAN_T, panggung: PANGGUNG_T, langkah: { x0: AMAN_T.x0, x1: AMAN_T.x1, y: AMAN_T.y0 },
    judul: { y: AMAN_T.y0 + 102, huruf: 50 }, teks: { x0: AMAN_T.x0, x1: AMAN_T.x1, y0: PANGGUNG_T.y1 + 34, y1: AMAN_T.y1, huruf: 40 }, laptop: 1080 - 24 }),
  lanskap: susun(1920, 1080, { aman: AMAN_L, panggung: { x0: AMAN_L.x0, x1: 940, y0: AMAN_L.y0, y1: AMAN_L.y1 },
    langkah: { ...KOLOM_L, y: 355 }, judul: { y: 489, huruf: 48 }, teks: { x0: KOLOM_L.x0 + 20, x1: KOLOM_L.x1 - 20, y0: 605, y1: AMAN_L.y1, huruf: 46 }, laptop: 920 }),
};
export const TataLetak = createContext(TATA.tegak);
export const useTata = () => useContext(TataLetak);

// Warna merek Nikahin (server/pages: --cocoa, --muted, --marker, --marker-dark, latar krem).
export const WARNA = { latar: "#fbf7f2", krem: "#f7efe9", kertas: "#fff", coklat: "#2b1a07", abu: "#6f675f", samar: "#b9aea4", garis: "rgba(43,26,7,.12)",
  oranye: "#ff6f1e", oranyeTua: "#b8460d", hijau: "#1f7a3f" };
// Huruf merek: Gelica (judul), Nunito (isi). Layar iOS memakai huruf sistem (SF Pro) seperti iPhone asli.
const ASET = "https://assets.nikahin.workers.dev/brand-assets/fonts";
loadFont({ family: "Gelica", url: `${ASET}/gelica/gelica-bold.woff2`, weight: "700" });
export const JUDUL = "Gelica, Georgia, serif";
export const HURUF = nunito("normal", { weights: ["600", "700", "800", "900"], subsets: ["latin"] }).fontFamily;
export const IOS = '-apple-system, "SF Pro Text", "SF Pro", system-ui, sans-serif';

export const halus = Easing.bezier(0.45, 0, 0.2, 1);
export const lepas = Easing.bezier(0.16, 1, 0.3, 1);
// Nilai dari `dari` ke `ke` antara bingkai a dan b, tertahan di luar rentang.
export const antara = (f, a, b, dari, ke, easing = halus) =>
  a === b ? (f < a ? dari : ke) : interpolate(f, [a, b], [dari, ke], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
export const detik = (s) => Math.round(s * FPS);
