// Ukuran, warna, huruf, dan alat bersama video panduan (1080x1920, 30 fps). Layar iPhone digambar dalam pt (= px CSS
// tangkapan layar, 402x874), lalu diperbesar S kali ke video; kotak dari layar.json memakai pt yang sama.
import { Easing, interpolate } from "remotion";
import { loadFont } from "@remotion/fonts";
import { loadFont as nunito } from "@remotion/google-fonts/Nunito";
import mockup from "./mockup.json";

export const FPS = 30, W = 1080, H = 1920;
// Zona aman feed Shorts, TikTok, dan Reels (longgar): bebas dari kepala aplikasi di atas, keterangan dan tombol di bawah.
// Semua isi (garis langkah, judul, ponsel, sorotan, kartu, teks narasi) di dalamnya.
export const AMAN = { x0: 80, y0: 170, x1: 1000, y1: 1590 };
// Susunan dari atas, dengan jarak lega di antaranya: garis langkah (AMAN.y0 + 0..70), judul (JUDUL_Y), panggung ponsel,
// lalu teks narasi di bawah panggung. Ponsel utuh pas setinggi panggung; saat diperbesar hanya atas dan bawahnya yang
// memudar lembut, sisi kiri dan kanan ponsel tidak pernah terpotong.
export const JUDUL_Y = AMAN.y0 + 102;
export const PANGGUNG = { x0: AMAN.x0, x1: AMAN.x1, y0: AMAN.y0 + 190, y1: AMAN.y1 - 150 };

// iPhone: layar 402x874 pt, bilah status 62 (Dynamic Island), bilah Safari bawah 84; isi web 402x728 = tangkapan layar.
export const HP = { w: 402, h: 874, status: 62, safari: 84 };
export const WEB_Y = HP.status, WEB_H = HP.h - HP.status - HP.safari;
// Bingkai dari render model AR Apple (alat/mockup.swift): posisi gambar terhadap layar, dalam pt.
const I = mockup.iphone, PT = I.layar.w / HP.w;
export const BINGKAI = { x: I.layar.x / PT, y: I.layar.y / PT, w: I.w / PT, h: I.h / PT, r: I.layar.r / PT };
export const S = (PANGGUNG.y1 - PANGGUNG.y0) / BINGKAI.h;
// Perbesaran paling besar: bingkai ponsel (termasuk tombol samping) tetap utuh di dalam lebar zona aman.
export const KMAKS = (AMAN.x1 - AMAN.x0) / (BINGKAI.w * S);
// Titik 0,0 layar di kanvas, dan titik tengah layar (kamera menaruh titik fokus di sini).
export const PONSEL = { x: W / 2 - (HP.w / 2) * S, y: PANGGUNG.y0 + BINGKAI.y * S };
export const PUSAT = { x: W / 2, y: PONSEL.y + (HP.h / 2) * S };

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
