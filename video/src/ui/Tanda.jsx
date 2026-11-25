// Sorotan untuk layar yang digambar sendiri (WhatsApp tiruan): membungkus elemennya langsung, jadi tidak perlu koordinat.
// Sekeliling digelapkan lewat bayangan raksasa; leluhurnya tidak boleh punya transform/opacity/z-index (konteks tumpuk).
import { useCurrentFrame } from "remotion";
import { antara, FPS, HURUF, WARNA } from "./dasar";
import { Ketuk } from "./Ketuk";

export const Tanda = ({ dari, sampai, label, di = "atas", rata = "tengah", ketuk, tahan, radius = 10, block, children }) => {
  const f = useCurrentFrame();
  const aktif = dari !== undefined && f >= dari && f <= sampai + 7;
  const a = aktif ? antara(f, dari, dari + 7, 0, 1) * (1 - antara(f, sampai, sampai + 7, 0, 1)) : 0;
  const denyut = 0.55 + 0.45 * Math.sin(((f - (dari || 0)) / FPS) * Math.PI * 2.2);
  const pos = rata === "kiri" ? { left: 0 } : rata === "kanan" ? { right: 0 } : { left: "50%", transform: "translateX(-50%)" };
  return (
    <span style={{ position: "relative", display: block ? "block" : "inline-block", borderRadius: radius, zIndex: a ? 6 : undefined,
      boxShadow: a ? `0 0 0 2000px rgba(15,23,42,${0.52 * a}), 0 0 0 3px rgba(255,200,61,${a}), 0 0 ${10 + 10 * denyut}px rgba(255,200,61,${(0.55 + 0.35 * denyut) * a})` : "none" }}>
      {children}
      {label && a ? (
        <span style={{ position: "absolute", ...pos, [di === "atas" ? "bottom" : "top"]: "calc(100% + 14px)", width: "max-content", maxWidth: 320, opacity: a,
          padding: "8px 12px", borderRadius: 11, background: WARNA.gelap, color: "#fff", font: `700 18px/1.25 ${HURUF}`, textAlign: "center", boxShadow: "0 6px 16px rgba(0,0,0,.25)", whiteSpace: "normal" }}>{label}</span>
      ) : null}
      {ketuk !== undefined ? <Ketuk x="50%" y="50%" pada={ketuk} tahan={tahan} /> : null}
    </span>
  );
};
