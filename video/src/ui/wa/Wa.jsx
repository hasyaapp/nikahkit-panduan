// WhatsApp Android tiruan (tema terang) untuk adegan di luar dashboard: chat, pilih kontak, kotak tulis dengan kartu
// tautan. Ukuran px CSS layar; isi menempati layar di antara bilah status dan garis navigasi. Tanpa logo WhatsApp.
import { Img } from "remotion";
import { HP, ROBOTO } from "../dasar";
import { Ikon } from "../ikon";

export const WA = { hijau: "#1daa61", teks: "#111b21", abu: "#667781", latar: "#efeae2", keluar: "#d9fdd3", link: "#027eb5", garis: "#e9edef" };
const huruf = (w, s, lh = 1.35) => `${w} ${s}px/${lh} ${ROBOTO}`;

// Foto profil bawaan (siluet abu), seperti kontak tanpa foto.
export const Avatar = ({ s = 40, warna }) => (
  <svg width={s} height={s} viewBox="0 0 40 40" style={{ flex: "none", display: "block" }}>
    <circle cx="20" cy="20" r="20" fill={warna || "#dfe5e7"} />
    <circle cx="20" cy="15.5" r="7" fill="#fff" />
    <path d="M6.5 33.5c2.4-6 7.4-9 13.5-9s11.1 3 13.5 9A19.9 19.9 0 0 1 20 40a19.9 19.9 0 0 1-13.5-6.5z" fill="#fff" />
  </svg>
);
export const WaLayar = ({ children, latar = WA.latar }) => (
  <div style={{ position: "absolute", left: 0, top: HP.status, width: HP.w, height: HP.h - HP.status - HP.nav, background: latar, overflow: "hidden", font: huruf(400, 15.5) }}>
    {latar === WA.latar ? (
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.05 }}>
        <defs><pattern id="pola" width="44" height="44" patternUnits="userSpaceOnUse"><circle cx="8" cy="10" r="2.2" fill="#4a5a52" /><path d="M28 30l5 5m0-5l-5 5" stroke="#4a5a52" strokeWidth="1.6" /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#pola)" />
      </svg>
    ) : null}
    {children}
  </div>
);
export const WaKepala = ({ nama, sub }) => (
  <div style={{ position: "relative", height: 60, display: "flex", alignItems: "center", padding: "0 8px 0 6px", background: "#fff", borderBottom: `1px solid ${WA.garis}` }}>
    <Ikon n="kembali" s={24} c="#1f1f1f" />
    <span style={{ width: 6 }} />
    <Avatar s={38} />
    <div style={{ flex: 1, minWidth: 0, marginLeft: 10 }}>
      <div style={{ font: huruf(500, 17, 1.2), color: WA.teks }}>{nama}</div>
      {sub ? <div style={{ font: huruf(400, 12.5, 1.3), color: WA.abu }}>{sub}</div> : null}
    </div>
    <Ikon n="video" s={24} c="#1f1f1f" style={{ margin: "0 11px" }} />
    <Ikon n="telepon" s={22} c="#1f1f1f" style={{ margin: "0 11px" }} />
    <Ikon n="titik" s={22} c="#1f1f1f" style={{ marginLeft: 2 }} />
  </div>
);
// Teks pesan: *tebal* jadi tebal, tautan biru, `kode` berhuruf rata seperti WhatsApp.
export function format(teks) {
  return teks.split("\n").map((baris, i) => (
    <span key={i}>
      {baris.split(/(\*[^*\n]+\*|https?:\/\/\S+|`[^`]+`)/g).filter(Boolean).map((b, j) =>
        b.startsWith("*") && b.endsWith("*") && b.length > 2 ? <b key={j} style={{ fontWeight: 700 }}>{b.slice(1, -1)}</b>
        : /^https?:\/\//.test(b) ? <span key={j} style={{ color: WA.link, wordBreak: "break-all" }}>{b}</span>
        : b.startsWith("`") ? <span key={j} style={{ fontFamily: "ui-monospace, Menlo, monospace", background: "rgba(0,0,0,.06)", borderRadius: 4, padding: "0 3px" }}>{b.slice(1, -1)}</span>
        : <span key={j}>{b}</span>)}
      {"\n"}
    </span>
  ));
}
export const Gelembung = ({ keluar, jam, centang, children, ekor = true, lebar = 316, rapat }) => (
  <div style={{ position: "relative", alignSelf: keluar ? "flex-end" : "flex-start", maxWidth: lebar, margin: rapat ? "2px 10px" : "6px 10px 2px",
    padding: "6px 8px 7px 9px", borderRadius: 8, [keluar ? "borderTopRightRadius" : "borderTopLeftRadius"]: ekor ? 0 : 8,
    background: keluar ? WA.keluar : "#fff", boxShadow: "0 1px .5px rgba(11,20,26,.13)", font: huruf(400, 15.5, 1.38), color: WA.teks, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
    {ekor ? (
      <svg width="8" height="13" viewBox="0 0 8 13" style={{ position: "absolute", top: 0, [keluar ? "right" : "left"]: -8, transform: keluar ? "none" : "scaleX(-1)" }}>
        <path d="M0 0h8L1.4 9.3C.9 10 0 9.6 0 8.8V0z" fill={keluar ? WA.keluar : "#fff"} />
      </svg>
    ) : null}
    {children}
    <span style={{ float: "right", display: "inline-flex", alignItems: "center", gap: 3, margin: "8px 0 -5px 12px", font: huruf(400, 11, 1), color: WA.abu, whiteSpace: "nowrap" }}>
      {jam}{centang ? <Ikon n="centang2" s={16} c={centang === "biru" ? "#53bdeb" : "#8696a0"} /> : null}
    </span>
  </div>
);
// Kartu tautan dalam gelembung (gambar persegi selebar gelembung, seperti WhatsApp di HP) atau di kotak tulis (gambar kecil).
export const KartuTautan = ({ gambar, judul, deskripsi, domain, kecil, tutup }) => (
  <div style={{ position: "relative", display: "flex", flexDirection: kecil ? "row" : "column", gap: kecil ? 10 : 0, marginBottom: 6, borderRadius: 7, overflow: "hidden",
    background: kecil ? "#f0f2f5" : "rgba(11,20,26,.05)", padding: kecil ? 8 : 0 }}>
    <Img src={gambar} style={{ width: kecil ? 64 : "100%", height: kecil ? 64 : undefined, aspectRatio: "1 / 1", objectFit: "cover", borderRadius: kecil ? 6 : 0, flex: "none", display: "block" }} />
    <div style={{ minWidth: 0, padding: kecil ? "1px 18px 0 0" : "8px 10px 9px", display: "flex", flexDirection: "column", gap: 2 }}>
      <div style={{ font: huruf(500, 14.5, 1.3), color: WA.teks, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{judul}</div>
      <div style={{ font: huruf(400, 13, 1.3), color: WA.abu, display: "-webkit-box", WebkitLineClamp: kecil ? 1 : 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{deskripsi}</div>
      <div style={{ font: huruf(400, 12.5, 1.3), color: WA.abu }}>{domain}</div>
    </div>
    {tutup ? <Ikon n="tutup" s={18} c="#667781" style={{ position: "absolute", right: 6, top: 6 }} /> : null}
  </div>
);
// Kotak tulis di bawah: teks terisi (paling banyak `baris` baris terlihat), kartu tautan di atasnya, tombol kirim hijau.
export const WaTulis = ({ teks, kartu, baris = 5, tombol }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "6px 6px 8px", display: "flex", alignItems: "flex-end", gap: 5 }}>
    <div style={{ flex: 1, minWidth: 0, borderRadius: 24, background: "#fff", boxShadow: "0 1px 1px rgba(11,20,26,.12)", padding: kartu ? "6px 6px 0" : 0 }}>
      {kartu}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, padding: "11px 12px 11px 10px" }}>
        <Ikon n="emoji" s={24} c="#54656f" />
        <div style={{ flex: 1, minWidth: 0, maxHeight: teks ? baris * 22 : 22, overflow: "hidden", font: huruf(400, 16.5, 22 / 16.5), color: teks ? WA.teks : "#8696a0", whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{teks || "Pesan"}</div>
        <Ikon n="lampir" s={23} c="#54656f" style={{ transform: "rotate(-45deg)" }} />
        {teks ? null : <Ikon n="kamera" s={23} c="#54656f" />}
      </div>
    </div>
    {tombol || <BulatKirim ada={!!teks} />}
  </div>
);
export const BulatKirim = ({ ada }) => (
  <div style={{ width: 48, height: 48, flex: "none", borderRadius: 24, background: WA.hijau, display: "grid", placeItems: "center", boxShadow: "0 1px 2px rgba(0,0,0,.2)" }}>
    <Ikon n={ada ? "kirim" : "mik"} s={ada ? 22 : 24} c="#fff" style={{ marginLeft: ada ? 3 : 0 }} />
  </div>
);
// Daftar kontak "Kirim ke…": kepala (judul atau kolom cari berisi `cari`), lalu baris kontak. `bungkus` membungkus judul
// (misalnya dengan <Tanda>) tanpa mengubah tata letaknya.
export const WaPilih = ({ cari, kontak, caret, bungkus = (n) => n }) => (
  <WaLayar latar="#fff">
    <div style={{ height: 60, display: "flex", alignItems: "center", gap: 18, padding: "0 14px 0 14px", borderBottom: `1px solid ${WA.garis}` }}>
      <Ikon n="kembali" s={24} c="#1f1f1f" />
      {cari === null ? (
        <><div style={{ flex: 1, font: huruf(500, 19, 1.2), color: WA.teks }}>{bungkus("Kirim ke…")}</div><Ikon n="cari" s={24} c="#1f1f1f" /></>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", font: huruf(400, 18, 1.2), color: cari ? WA.teks : "#8696a0" }}>
          {cari || "Cari…"}{caret ? <span style={{ width: 2, height: 22, marginLeft: 1, background: WA.hijau }} /> : null}
        </div>
      )}
    </div>
    <div style={{ padding: "14px 18px 6px", font: huruf(500, 14, 1.2), color: WA.abu }}>{cari ? "Kontak" : "Chat terbaru"}</div>
    {kontak}
  </WaLayar>
);
export const Kontak = ({ nama, sub, warna }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "9px 18px" }}>
    <Avatar s={46} warna={warna} />
    <div style={{ minWidth: 0 }}>
      <div style={{ font: huruf(400, 17, 1.25), color: WA.teks }}>{nama}</div>
      {sub ? <div style={{ font: huruf(400, 14, 1.3), color: WA.abu, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</div> : null}
    </div>
  </div>
);
