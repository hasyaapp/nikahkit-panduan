// Ukuran dan alat bersama video panduan (1080x1920, 30 fps). Layar HP digambar dalam px CSS seperti tangkapan layar
// (393 lebar), lalu diperbesar S kali ke video; kotak dari layar.json memakai px CSS yang sama.
import { Easing, interpolate } from "remotion";
import { loadFont as jakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as roboto } from "@remotion/google-fonts/Roboto";

export const FPS = 30, W = 1080, H = 1920;
// Layar Android: bilah status 28, bilah alamat Chrome 56, isi web 744 (= tangkapan layar), garis navigasi 24.
export const HP = { w: 393, h: 852, status: 28, alamat: 56, nav: 24 };
export const WEB_Y = HP.status + HP.alamat;
export const BINGKAI = 11;
export const S = 660 / HP.w;
export const PONSEL = { x: (W - (HP.w + 2 * BINGKAI) * S) / 2, y: 196 };
// Titik tengah ponsel di video: kamera memperbesar ke titik fokus lalu menaruhnya di sini.
export const PUSAT = { x: W / 2, y: PONSEL.y + ((HP.h + 2 * BINGKAI) * S) / 2 };
export const ZONA = { atas: 176, bawah: 1700 };

export const WARNA = { latar: "#f3f1ec", teks: "#0f172a", abu: "#64748b", hijau: "#1daa61", hijauTua: "#15603e", sorot: "#ffc83d", gelap: "#111827", merah: "#b80531" };
export const HURUF = jakarta("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin"] }).fontFamily;
export const ROBOTO = roboto("normal", { weights: ["400", "500", "700"], subsets: ["latin"] }).fontFamily;

export const halus = Easing.bezier(0.45, 0, 0.2, 1);
export const lepas = Easing.bezier(0.16, 1, 0.3, 1);
// Nilai dari `dari` ke `ke` antara bingkai a dan b, tertahan di luar rentang.
export const antara = (f, a, b, dari, ke, easing = halus) =>
  a === b ? (f < a ? dari : ke) : interpolate(f, [a, b], [dari, ke], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
export const detik = (s) => Math.round(s * FPS);
