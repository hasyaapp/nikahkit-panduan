// Garis waktu langkah 1-5 mendatar di atas ponsel (di dalam zona aman), lalu judul langkah yang sedang berjalan.
// `daftar` = [[detik, tahap, judul], ...]; tahap 0 = belum mulai, 1-5 = langkah yang sedang dikerjakan, 6 = semua selesai.
// Saat tahap naik, garis penghubung terisi ke langkah berikutnya; langkah selesai bercentang. Selama layar WhatsApp (`wa`),
// ikon aplikasinya tampil di depan judul.
import { Img, staticFile, useCurrentFrame } from "remotion";
import { Check } from "lucide-react";
import { AMAN, antara, detik, halus, HURUF, JUDUL, lepas, WARNA } from "./dasar";

const LANGKAH = ["Masuk", "Tab Kirim", "Tempel", "Kirim", "WhatsApp"];
const LEBAR = AMAN.x1 - AMAN.x0, JARAK = LEBAR / LANGKAH.length, Y = 20;
const cx = (k) => JARAK * (k - 0.5);

export const Judul = ({ daftar, wa }) => {
  const f = useCurrentFrame();
  const i = daftar.findLastIndex(([t]) => detik(t) <= f);
  if (i < 0) return null;
  const [t, tahap, judul] = daftar[i];
  const mulai = detik(t), dari = i > 0 ? daftar[i - 1][1] : tahap;
  const pr = antara(f, mulai, mulai + 18, dari, tahap, halus);
  const a = antara(f, mulai, mulai + 10, 0, 1, lepas);
  return (
    <div style={{ position: "absolute", left: AMAN.x0, top: AMAN.y0, width: LEBAR, height: 140 }}>
      {[1, 2, 3, 4].map((k) => (
        <div key={k} style={{ position: "absolute", left: cx(k) + 24, top: Y - 2, width: JARAK - 48, height: 4, borderRadius: 2, background: "#ecdfd4", overflow: "hidden" }}>
          <div style={{ width: `${Math.max(0, Math.min(1, pr - k)) * 100}%`, height: "100%", background: WARNA.oranyeTua }} />
        </div>
      ))}
      {LANGKAH.map((nama, j) => {
        const k = j + 1, selesai = pr >= k + 1, aktif = !selesai && pr >= k;
        const d = aktif ? 40 : 34;
        return (
          <div key={k} style={{ position: "absolute", left: cx(k) - JARAK / 2, top: 0, width: JARAK, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ width: d, height: d, marginTop: Y - d / 2, borderRadius: "50%", display: "grid", placeItems: "center",
              background: selesai ? WARNA.oranyeTua : aktif ? WARNA.oranye : "#fff", boxShadow: aktif ? "0 0 0 6px rgba(255,111,30,.18)" : selesai ? "none" : "inset 0 0 0 2px #e3d6ca",
              color: aktif ? "#fff" : WARNA.samar, font: `900 ${aktif ? 19 : 17}px/1 ${HURUF}` }}>
              {selesai ? <Check size={19} color="#fff" strokeWidth={3.2} /> : k}
            </div>
            <div style={{ font: `800 17px/1 ${HURUF}`, color: aktif ? WARNA.coklat : selesai ? WARNA.abu : WARNA.samar, whiteSpace: "nowrap" }}>{nama}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 80, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, opacity: a, transform: `translateY(${(1 - a) * 14}px)` }}>
        {wa ? <Img src={staticFile("kirim-undangan/layar/whatsapp.webp")} style={{ width: 42, height: 42, borderRadius: 10, display: "block" }} /> : null}
        <div style={{ font: `700 48px/1.1 ${JUDUL}`, color: WARNA.coklat, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{judul}</div>
      </div>
    </div>
  );
};
