// Judul langkah di atas ponsel, di dalam zona aman. `daftar` = [[detik, langkah | null, judul], ...]; judul baru masuk dari
// bawah. Selama layar WhatsApp (`wa`), ikon aplikasinya tampil di baris kecil supaya jelas sedang di aplikasi WhatsApp.
import { Img, staticFile, useCurrentFrame } from "remotion";
import { AMAN, antara, detik, HURUF, JUDUL, lepas, WARNA } from "./dasar";

export const Judul = ({ daftar, total, wa }) => {
  const f = useCurrentFrame();
  const i = daftar.findLastIndex(([t]) => detik(t) <= f);
  if (i < 0) return null;
  const [t, langkah, judul] = daftar[i];
  const mulai = detik(t);
  const a = antara(f, mulai, mulai + 10, 0, 1, lepas);
  const kecil = [wa ? "WhatsApp" : null, langkah ? `Langkah ${langkah} dari ${total}` : null].filter(Boolean).join(" · ");
  return (
    <div style={{ position: "absolute", left: AMAN.x0, top: AMAN.y0, width: AMAN.x1 - AMAN.x0, height: 108, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
      {kecil ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, height: 32, font: `900 24px/1 ${HURUF}`, color: WARNA.oranyeTua, letterSpacing: "0.12em", textTransform: "uppercase", opacity: a }}>
          {wa ? <Img src={staticFile("kirim-undangan/layar/whatsapp.webp")} style={{ width: 32, height: 32, borderRadius: 8, display: "block" }} /> : null}
          {kecil}
        </div>
      ) : null}
      <div style={{ font: `700 52px/1.1 ${JUDUL}`, color: WARNA.coklat, letterSpacing: "-0.01em", textAlign: "center", whiteSpace: "nowrap", opacity: a, transform: `translateY(${(1 - a) * 16}px)` }}>{judul}</div>
    </div>
  );
};
