// Sorotan berkoordinat: sekeliling digelapkan, bingkai kuning berdenyut, label gelap dengan panah. Koordinat dan ukuran
// huruf memakai satuan wadahnya (px CSS layar ponsel, atau px kanvas bila `lebar`/`ukuran` diberikan). Muncul di bingkai
// `dari`, hilang di `sampai`.
import { useCurrentFrame } from "remotion";
import { antara, FPS, HP, HURUF, lepas, WARNA } from "./dasar";

export const Sorot = ({ kotak, label, dari, sampai, redup = true, sisi, pad = 6, radius = 12, lebar = HP.w, ukuran = 18 }) => {
  const f = useCurrentFrame();
  if (!kotak || f < dari || f > sampai + 8) return null;
  const a = antara(f, dari, dari + 7, 0, 1) * (1 - antara(f, sampai, sampai + 7, 0, 1));
  const [x, y, w, h] = kotak;
  const u = ukuran / 16.5;
  const box = { left: x - pad, top: y - pad, width: w + 2 * pad, height: h + 2 * pad };
  const tumbuh = antara(f, dari, dari + 10, 1.14, 1, lepas);
  const denyut = 0.55 + 0.45 * Math.sin(((f - dari) / FPS) * Math.PI * 2.2);
  const lw = label ? Math.min(330 * u, label.length * 9.4 * u + 32 * u) : 0;
  const di = sisi || (box.top > 150 * u ? "atas" : "bawah");
  const lx = Math.max(10 * u, Math.min(lebar - 10 * u - lw, x + w / 2 - lw / 2));
  const ly = di === "atas" ? box.top - 14 * u : box.top + box.height + 14 * u;
  const panah = Math.max(14 * u, Math.min(lw - 14 * u, x + w / 2 - lx));
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 6, pointerEvents: "none", opacity: a }}>
      <div style={{ position: "absolute", ...box, borderRadius: radius, boxShadow: redup ? "0 0 0 4000px rgba(15,23,42,.52)" : "none" }} />
      <div style={{ position: "absolute", ...box, borderRadius: radius, transform: `scale(${tumbuh})`,
        border: `${3 * u}px solid ${WARNA.sorot}`, boxShadow: `0 0 ${(10 + 10 * denyut) * u}px rgba(255,200,61,${0.55 + 0.35 * denyut})` }} />
      {label ? (
        <div style={{ position: "absolute", left: lx, top: ly, width: lw, transform: `translateY(${di === "atas" ? "-100%" : "0"}) translateY(${(1 - a) * (di === "atas" ? 6 : -6) * u}px)` }}>
          <div style={{ position: "relative", padding: `${8 * u}px ${12 * u}px`, borderRadius: 11 * u, background: WARNA.gelap, color: "#fff",
            font: `700 ${ukuran}px/1.25 ${HURUF}`, textAlign: "center", boxShadow: "0 6px 16px rgba(0,0,0,.25)" }}>
            {label}
            <div style={{ position: "absolute", left: panah - 7 * u, [di === "atas" ? "bottom" : "top"]: -6 * u, width: 14 * u, height: 14 * u, background: WARNA.gelap, transform: "rotate(45deg)", borderRadius: 2 }} />
          </div>
        </div>
      ) : null}
    </div>
  );
};
