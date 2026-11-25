// Penanda ketukan jari (pt layar, ukuran tetap di kanvas): bulatan muncul, menekan di bingkai `pada`, gelombang oranye
// melebar sekali, lalu hilang. `tahan` (bingkai) untuk tekan lama, misalnya sebelum Tempel.
import { useCurrentFrame } from "remotion";
import { antara, lepas, WARNA } from "./dasar";
import { useKamera } from "./kamera";

export const Ketuk = ({ x, y, pada, tahan = 0 }) => {
  const f = useCurrentFrame();
  const u = 1 / useKamera().s;
  if (f < pada - 10 || f > pada + tahan + 20) return null;
  const muncul = antara(f, pada - 10, pada - 3, 0, 1) * (1 - antara(f, pada + tahan + 8, pada + tahan + 18, 0, 1));
  const tekan = f < pada ? 1 : f <= pada + tahan ? 0.82 : antara(f, pada + tahan, pada + tahan + 6, 0.82, 1);
  const g = antara(f, pada + tahan, pada + tahan + 16, 0, 1, lepas);
  const r = 26 * u, gr = r + 34 * u * g;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 7, pointerEvents: "none", opacity: muncul }}>
      <div style={{ position: "absolute", left: -gr, top: -gr, width: 2 * gr, height: 2 * gr, borderRadius: "50%", border: `${3 * u}px solid ${WARNA.oranye}`,
        opacity: f < pada + tahan ? 0 : 1 - g }} />
      <div style={{ position: "absolute", left: -r, top: -r, width: 2 * r, height: 2 * r, borderRadius: "50%", transform: `scale(${tekan})`,
        background: "rgba(255,255,255,.35)", border: `${3 * u}px solid rgba(43,26,7,.6)`, boxShadow: `0 ${4 * u}px ${14 * u}px rgba(43,26,7,.25)` }} />
    </div>
  );
};
