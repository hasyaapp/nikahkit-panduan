// Sorotan berkoordinat (pt layar): sekeliling diredupkan, bingkai oranye merek dengan ruang lega di sekitar elemen, label
// coklat dengan panah. Ukuran garis, huruf, dan jarak tetap di kanvas walau kamera memperbesar; label dijaga tetap di
// bagian layar yang tampak. Muncul sekali di bingkai `dari` (tanpa denyut berulang), hilang di `sampai`.
import { useCurrentFrame } from "remotion";
import { antara, HP, HURUF, lepas, WARNA } from "./dasar";
import { useKamera } from "./kamera";

let ctx;
// Lebar teks label di kanvas (px), diukur dengan huruf yang sama.
export function lebarTeks(teks, font) {
  ctx = ctx || document.createElement("canvas").getContext("2d");
  ctx.font = font;
  return ctx.measureText(teks).width;
}
// Gaya label dalam px kanvas; Tanda.jsx memakai yang sama.
export const LABEL = { huruf: 28, padY: 14, padX: 22, jarak: 20, maks: 600, radius: 16 };

export const Sorot = ({ kotak, label, dari, sampai, sisi, pad = 9, radius = 14, redup = true }) => {
  const f = useCurrentFrame();
  const { s, lihat, ukuran = [HP.w, HP.h] } = useKamera();
  if (!kotak || f < dari || f > sampai + 8) return null;
  const a = antara(f, dari, dari + 8, 0, 1, lepas) * (1 - antara(f, sampai, sampai + 7, 0, 1));
  const u = 1 / s, [x, y, w, h] = kotak;
  const box = { left: x - pad, top: y - pad, width: w + 2 * pad, height: h + 2 * pad };
  // Cincin tumbuh sekali saat muncul, lalu diam.
  const masuk = antara(f, dari, dari + 12, 0, 1, lepas);
  let lw = 0, lh = 0, lx = 0, ly = 0, panah = 0, di = "atas";
  const font = `800 ${LABEL.huruf}px ${HURUF}`;
  if (label) {
    const tepi = 14 * u, x0 = Math.max(lihat[0], 0) + tepi, x1 = Math.min(lihat[2], ukuran[0]) - tepi;
    const y0 = Math.max(lihat[1], 0) + tepi, y1 = Math.min(lihat[3], ukuran[1]) - tepi;
    // Lebar label paling banyak selebar bagian layar yang tampak; lebih panjang dari itu, teksnya turun baris.
    const maks = Math.min(LABEL.maks, (x1 - x0) / u), t = lebarTeks(label, font), baris = Math.ceil(t / (maks - 2 * LABEL.padX));
    lw = Math.min(t + 2 * LABEL.padX + 2, maks) * u;
    lh = (baris * LABEL.huruf * 1.25 + 2 * LABEL.padY) * u;
    const jarak = LABEL.jarak * u;
    di = sisi || (box.top - jarak - lh >= y0 ? "atas" : box.top + box.height + jarak + lh <= y1 ? "bawah" : "atas");
    lx = Math.max(x0, Math.min(x1 - lw, x + w / 2 - lw / 2));
    ly = di === "atas" ? box.top - jarak - lh : box.top + box.height + jarak;
    panah = Math.max(LABEL.radius * u + 8 * u, Math.min(lw - LABEL.radius * u - 8 * u, x + w / 2 - lx));
  }
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 6, pointerEvents: "none", opacity: a }}>
      <div style={{ position: "absolute", ...box, borderRadius: radius, boxShadow: redup ? "0 0 0 4000px rgba(43,26,7,.46)" : "none" }} />
      <div style={{ position: "absolute", ...box, borderRadius: radius, border: `${3 * u}px solid ${WARNA.oranye}`, transform: `scale(${1.06 - 0.06 * masuk})` }} />
      <div style={{ position: "absolute", left: box.left - 9 * u * masuk, top: box.top - 9 * u * masuk, width: box.width + 18 * u * masuk, height: box.height + 18 * u * masuk,
        borderRadius: radius + 9 * u * masuk, border: `${2 * u}px solid ${WARNA.oranye}`, opacity: 0.55 * (1 - masuk) }} />
      {label ? (
        <div style={{ position: "absolute", left: lx, top: ly, width: lw, transform: `translateY(${(1 - masuk) * (di === "atas" ? 10 : -10) * u}px)` }}>
          <div style={{ position: "relative", padding: `${LABEL.padY * u}px ${LABEL.padX * u}px`, borderRadius: LABEL.radius * u, background: WARNA.coklat, color: "#fff",
            font: `800 ${LABEL.huruf * u}px/1.25 ${HURUF}`, textAlign: "center", boxShadow: `0 ${8 * u}px ${22 * u}px rgba(43,26,7,.28)` }}>
            {label}
            <div style={{ position: "absolute", left: panah - 8 * u, [di === "atas" ? "bottom" : "top"]: -7 * u, width: 16 * u, height: 16 * u, background: WARNA.coklat, transform: "rotate(45deg)", borderRadius: 3 * u }} />
          </div>
        </div>
      ) : null}
    </div>
  );
};
