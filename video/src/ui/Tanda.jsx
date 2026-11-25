// Sorotan untuk layar yang digambar sendiri (WhatsApp iOS): membungkus elemennya langsung, jadi tidak perlu koordinat.
// Gaya sama dengan Sorot (bingkai oranye berjarak lega, label coklat, ukuran tetap di kanvas, tanpa denyut). Sekeliling
// diredupkan lewat bayangan raksasa; leluhurnya tidak boleh punya transform/opacity/z-index (konteks tumpuk).
import { useCurrentFrame } from "remotion";
import { antara, HURUF, lepas, WARNA } from "./dasar";
import { useKamera } from "./kamera";
import { Ketuk } from "./Ketuk";
import { LABEL } from "./Sorot";

export const Tanda = ({ dari, sampai, label, di = "atas", rata = "tengah", ketuk, tahan, radius = 12, pad = 7, block, children }) => {
  const f = useCurrentFrame();
  const u = 1 / useKamera().s;
  const aktif = dari !== undefined && f >= dari && f <= sampai + 7;
  const a = aktif ? antara(f, dari, dari + 8, 0, 1, lepas) * (1 - antara(f, sampai, sampai + 7, 0, 1)) : 0;
  const masuk = aktif ? antara(f, dari, dari + 12, 0, 1, lepas) : 1;
  const pos = rata === "kiri" ? { left: -pad } : rata === "kanan" ? { right: -pad } : { left: "50%", transform: "translateX(-50%)" };
  return (
    <span style={{ position: "relative", display: block ? "block" : "inline-block", zIndex: a ? 6 : undefined }}>
      {a ? (
        <span style={{ position: "absolute", inset: -pad, borderRadius: radius, pointerEvents: "none", opacity: a,
          boxShadow: `0 0 0 2000px rgba(43,26,7,.46), inset 0 0 0 ${3 * u}px ${WARNA.oranye}`, transform: `scale(${1.06 - 0.06 * masuk})` }} />
      ) : null}
      {children}
      {label && a ? (
        <span style={{ position: "absolute", ...pos, [di === "atas" ? "bottom" : "top"]: `calc(100% + ${pad + LABEL.jarak * u}px)`, width: "max-content", maxWidth: LABEL.maks * u,
          opacity: a, padding: `${LABEL.padY * u}px ${LABEL.padX * u}px`, borderRadius: LABEL.radius * u, background: WARNA.coklat, color: "#fff",
          font: `800 ${LABEL.huruf * u}px/1.25 ${HURUF}`, textAlign: "center", boxShadow: `0 ${8 * u}px ${22 * u}px rgba(43,26,7,.28)`, whiteSpace: "normal" }}>{label}</span>
      ) : null}
      {ketuk !== undefined ? <Ketuk x="50%" y="50%" pada={ketuk} tahan={tahan} /> : null}
    </span>
  );
};
