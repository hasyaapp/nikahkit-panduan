// Penanda ketukan jari (px CSS layar): bulatan muncul, menekan di bingkai `pada`, gelombang melebar, lalu hilang.
// `tahan` (bingkai) untuk tekan lama, misalnya sebelum Tempel.
import { useCurrentFrame } from "remotion";
import { antara, lepas } from "./dasar";

export const Ketuk = ({ x, y, pada, tahan = 0 }) => {
  const f = useCurrentFrame();
  if (f < pada - 10 || f > pada + tahan + 20) return null;
  const muncul = antara(f, pada - 10, pada - 3, 0, 1) * (1 - antara(f, pada + tahan + 8, pada + tahan + 18, 0, 1));
  const tekan = f < pada ? 1 : f <= pada + tahan ? 0.84 : antara(f, pada + tahan, pada + tahan + 6, 0.84, 1);
  const g = antara(f, pada + tahan, pada + tahan + 16, 0, 1, lepas);
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 7, pointerEvents: "none", opacity: muncul }}>
      <div style={{ position: "absolute", left: -22 - 26 * g, top: -22 - 26 * g, width: 44 + 52 * g, height: 44 + 52 * g, borderRadius: "50%",
        border: "3px solid rgba(255,255,255,.95)", boxShadow: "0 0 0 2px rgba(15,23,42,.25)", opacity: f < pada + tahan ? 0 : 1 - g }} />
      <div style={{ position: "absolute", left: -19, top: -19, width: 38, height: 38, borderRadius: "50%", transform: `scale(${tekan})`,
        background: "rgba(255,255,255,.62)", border: "2.5px solid rgba(15,23,42,.55)", boxShadow: "0 4px 12px rgba(15,23,42,.35)" }} />
    </div>
  );
};
