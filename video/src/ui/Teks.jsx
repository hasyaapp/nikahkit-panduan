// Teks narasi di bawah ponsel, dari waktu.json: per potongan (paling banyak 2 baris), kata yang sudah diucapkan gelap,
// kata yang sedang diucapkan hijau, sisanya abu. Potongan pindah tepat saat kata pertamanya diucapkan.
import { useCurrentFrame } from "remotion";
import { FPS, HURUF, W, WARNA, ZONA } from "./dasar";

const MAKS = 70, BELAH = 34;
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
    <div style={{ position: "absolute", left: 0, top: ZONA.bawah, width: W, height: 1920 - ZONA.bawah, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 56px 40px" }}>
      {p ? (
        <p style={{ margin: 0, maxWidth: 960, textAlign: "center", font: `700 44px/1.32 ${HURUF}`, letterSpacing: "-0.01em", textWrap: "balance" }}>
          {p.kata.map(([w, a, b], i) => (
            <span key={i} style={{ color: t >= a && t < b ? "#138a4f" : t >= a ? WARNA.teks : "#a3adbb" }}>{w + (i < p.kata.length - 1 ? " " : "")}</span>
          ))}
        </p>
      ) : null}
    </div>
  );
};
