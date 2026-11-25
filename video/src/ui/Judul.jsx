// Judul langkah di atas ponsel. `daftar` = [[detik, langkah | null, judul], ...]; judul baru masuk dari bawah.
import { useCurrentFrame } from "remotion";
import { antara, detik, HURUF, lepas, W, WARNA, ZONA } from "./dasar";

export const Judul = ({ daftar, total }) => {
  const f = useCurrentFrame();
  const i = daftar.findLastIndex(([t]) => detik(t) <= f);
  if (i < 0) return null;
  const [t, langkah, judul] = daftar[i];
  const mulai = detik(t);
  const a = antara(f, mulai, mulai + 9, 0, 1, lepas);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: ZONA.atas, display: "flex", alignItems: "center", gap: 22, padding: "26px 60px 0" }}>
      {langkah ? (
        <div style={{ flex: "none", width: 76, height: 76, borderRadius: 24, background: WARNA.hijau, color: "#fff", display: "grid", placeItems: "center",
          font: `800 40px ${HURUF}`, transform: `scale(${0.7 + 0.3 * a})`, opacity: a, boxShadow: "0 8px 20px rgba(29,170,97,.35)" }}>{langkah}</div>
      ) : null}
      <div style={{ minWidth: 0, opacity: a, transform: `translateY(${(1 - a) * 18}px)` }}>
        {langkah ? <div style={{ font: `700 24px ${HURUF}`, color: WARNA.hijauTua, letterSpacing: "0.06em", textTransform: "uppercase" }}>Langkah {langkah} dari {total}</div> : null}
        <div style={{ font: `800 ${langkah ? 50 : 56}px/1.12 ${HURUF}`, color: WARNA.teks, letterSpacing: "-0.02em" }}>{judul}</div>
      </div>
    </div>
  );
};
