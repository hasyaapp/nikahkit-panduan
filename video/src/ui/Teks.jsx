// Teks narasi di bawah ponsel, di dalam zona aman, dari waktu.json: per potongan (paling banyak 2 baris), kata yang sudah
// diucapkan coklat, kata yang sedang diucapkan oranye merek, sisanya samar. Potongan pindah tepat saat kata pertamanya
// diucapkan.
import { useCurrentFrame } from "remotion";
import { AMAN, FPS, HURUF, PANGGUNG, WARNA } from "./dasar";

const MAKS = 58, BELAH = 28;
export function potong(kalimat) {
  const out = [];
  for (const k of kalimat) {
    let cur = [];
    const len = (ws) => ws.reduce((n, w) => n + w[0].length + 1, 0);
    k.kata.forEach((w, i) => {
      cur.push(w);
      const akhir = i === k.kata.length - 1, koma = /[,:;]$/.test(w[0]);
      const next = k.kata[i + 1];
      if (akhir || len(cur) + (next ? next[0].length : 0) > MAKS || (koma && len(cur) >= BELAH && len(k.kata.slice(i + 1)) > 12)) { out.push(cur); cur = []; }
    });
  }
  return out.map((kata, i, all) => ({ kata, mulai: kata[0][1], sampai: all[i + 1] ? Math.min(all[i + 1][0][1], kata.at(-1)[2] + 1.4) : kata.at(-1)[2] + 1.2 }));
}

export const Teks = ({ potongan }) => {
  const t = useCurrentFrame() / FPS;
  const p = potongan.find((c) => t >= c.mulai - 0.12 && t < c.sampai);
  return (
    <div style={{ position: "absolute", left: AMAN.x0, top: PANGGUNG.y1 + 12, width: AMAN.x1 - AMAN.x0, height: AMAN.y1 - PANGGUNG.y1 - 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {p ? (
        <p style={{ margin: 0, textAlign: "center", font: `800 39px/1.3 ${HURUF}`, letterSpacing: "-0.005em", textWrap: "balance" }}>
          {p.kata.map(([w, a, b], i) => (
            <span key={i} style={{ color: t >= a && t < b ? WARNA.oranyeTua : t >= a ? WARNA.coklat : WARNA.samar }}>{w + (i < p.kata.length - 1 ? " " : "")}</span>
          ))}
        </p>
      ) : null}
    </div>
  );
};
