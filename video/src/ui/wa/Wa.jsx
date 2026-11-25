// WhatsApp iOS tiruan (tema terang, desain 2025: kepala abu muda, gelembung membulat berekor di bawah, kolom tulis dengan
// tombol +, kamera, mikrofon, tombol kirim hijau bulat). Ukuran pt layar 402x874; bilah status digambar di atasnya.
import { Img } from "remotion";
import { HP, IOS } from "../dasar";
import { GarisBeranda, IkonIOS } from "../ios";

export const WA = { hijau: "#1daa61", teks: "#000", abu: "#8a8a8e", latar: "#f5efe6", keluar: "#d9fdd3", masuk: "#fff", link: "#027eb5", kepala: "#f6f5f3", garis: "rgba(60,60,67,.18)", baca: "#3a97f5" };
const huruf = (w, s, lh = 1.3) => `${w} ${s}px/${lh} ${IOS}`;
export const ATAS = HP.status + 54;
export const BAWAH = 34;

// Foto profil bawaan (siluet putih di lingkaran abu), seperti kontak tanpa foto.
export const Avatar = ({ s = 40, warna }) => (
  <svg width={s} height={s} viewBox="0 0 40 40" style={{ flex: "none", display: "block" }}>
    <circle cx="20" cy="20" r="20" fill={warna || "#d7dbe0"} />
    <circle cx="20" cy="15.5" r="7" fill="#fff" />
    <path d="M6.5 33.5c2.4-6 7.4-9 13.5-9s11.1 3 13.5 9A19.9 19.9 0 0 1 20 40a19.9 19.9 0 0 1-13.5-6.5z" fill="#fff" />
  </svg>
);
// Seluruh layar aplikasi; latar wallpaper WhatsApp (krem dengan pola samar) atau putih.
export const WaLayar = ({ children, latar = WA.latar }) => (
  <div style={{ position: "absolute", inset: 0, background: latar, overflow: "hidden", font: huruf(400, 17) }}>
    {latar === WA.latar ? (
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.07 }}>
        <defs><pattern id="pola" width="58" height="58" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="12" r="4" fill="none" stroke="#6b5a45" strokeWidth="1.4" /><path d="M34 34l7 7m0-7l-7 7M38 8c3 0 5 2 5 5M14 42h8" stroke="#6b5a45" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </pattern></defs>
        <rect width="100%" height="100%" fill="url(#pola)" />
      </svg>
    ) : null}
    {children}
    <GarisBeranda />
  </div>
);
// Kepala percakapan: kembali, foto, nama dan status, video, telepon. Latarnya meneruskan ke belakang bilah status.
export const WaKepala = ({ nama, sub }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: ATAS, background: WA.kepala, borderBottom: `.5px solid ${WA.garis}`, zIndex: 2 }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: HP.status, height: 54, display: "flex", alignItems: "center", padding: "0 14px 0 6px" }}>
      <IkonIOS n="kembali" s={30} w={2.2} />
      <span style={{ width: 4 }} />
      <Avatar s={38} />
      <div style={{ flex: 1, minWidth: 0, marginLeft: 10 }}>
        <div style={{ font: huruf(600, 17, 1.2), color: WA.teks, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nama}</div>
        {sub ? <div style={{ font: huruf(400, 13, 1.3), color: WA.abu, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</div> : null}
      </div>
      <IkonIOS n="video" s={27} w={1.7} style={{ margin: "0 14px" }} />
      <IkonIOS n="telepon" s={24} w={1.7} />
    </div>
  </div>
);
export const Hari = ({ children }) => (
  <div style={{ alignSelf: "center", margin: "12px 0 8px", padding: "4px 11px", borderRadius: 9, background: "rgba(255,255,255,.92)", color: "#54656f", font: huruf(600, 12.5, 1.3),
    boxShadow: "0 .5px 1px rgba(0,0,0,.1)" }}>{children}</div>
);
// Teks pesan: *tebal* jadi tebal, tautan biru, `kode` berhuruf rata seperti WhatsApp. Baris dipisah "\n" (tanpa baris
// kosong di akhir).
export function format(teks) {
  return teks.split("\n").map((baris, i, semua) => (
    <span key={i}>
      {baris.split(/(\*[^*\n]+\*|https?:\/\/\S+|`[^`]+`)/g).filter(Boolean).map((b, j) =>
        b.startsWith("*") && b.endsWith("*") && b.length > 2 ? <b key={j} style={{ fontWeight: 600 }}>{b.slice(1, -1)}</b>
        : /^https?:\/\//.test(b) ? <span key={j} style={{ color: WA.link, wordBreak: "break-all" }}>{b}</span>
        : b.startsWith("`") ? <span key={j} style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 15, background: "rgba(0,0,0,.06)", borderRadius: 4, padding: "0 3px" }}>{b.slice(1, -1)}</span>
        : <span key={j}>{b}</span>)}
      {i < semua.length - 1 ? "\n" : null}
    </span>
  ));
}
// Gelembung: sudut 18 pt, ekor di bawah (masuk: kiri, keluar: kanan) bila `ekor`, jam dan centang di pojok kanan bawah.
export const Gelembung = ({ keluar, jam, centang, children, ekor = true, lebar = 300, rapat }) => {
  const warna = keluar ? WA.keluar : WA.masuk;
  return (
    <div style={{ position: "relative", alignSelf: keluar ? "flex-end" : "flex-start", maxWidth: lebar, margin: rapat ? "2px 12px" : "8px 12px 2px",
      padding: "7px 11px 7px 12px", borderRadius: 18, [keluar ? "borderBottomRightRadius" : "borderBottomLeftRadius"]: ekor ? 5 : 18,
      background: warna, boxShadow: "0 .5px .5px rgba(0,0,0,.13)", font: huruf(400, 17, 22 / 17), color: WA.teks, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
      {ekor ? (
        <svg width="12" height="16" viewBox="0 0 12 16" style={{ position: "absolute", bottom: 0, [keluar ? "right" : "left"]: -6, transform: keluar ? "none" : "scaleX(-1)" }}>
          <path d="M0 0c0 7 2 12 6 14.5 1.6 1 3.6 1.4 5.6 1.5H0z" fill={warna} />
        </svg>
      ) : null}
      {children}
      <span style={{ float: "right", display: "inline-flex", alignItems: "center", gap: 3, margin: "9px 0 -4px 12px", font: huruf(400, 12, 1), color: "rgba(0,0,0,.45)", whiteSpace: "nowrap" }}>
        {jam}{centang ? (
          <svg width="18" height="11" viewBox="0 0 18 11"><path d="m1 6 3.2 3.2L11.5 1.5M7.5 8.8l.6.4L15.5 1.5" fill="none" stroke={centang === "biru" ? WA.baca : "#8e8e93"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        ) : null}
      </span>
    </div>
  );
};
// Kartu tautan: di gelembung (gambar lebar penuh di atas) atau di kolom tulis (gambar kecil di kiri, tombol tutup).
export const KartuTautan = ({ gambar, judul, deskripsi, domain, kecil, tutup }) => (
  <div style={{ position: "relative", display: "flex", flexDirection: kecil ? "row" : "column", gap: kecil ? 10 : 0, marginBottom: kecil ? 0 : 6, borderRadius: kecil ? 12 : 12, overflow: "hidden",
    background: kecil ? "#f0f0f2" : "rgba(0,0,0,.05)", padding: kecil ? 8 : 0 }}>
    <Img src={gambar} style={{ width: kecil ? 62 : "100%", height: kecil ? 62 : undefined, aspectRatio: "1 / 1", objectFit: "cover", borderRadius: kecil ? 8 : 0, flex: "none", display: "block" }} />
    <div style={{ minWidth: 0, padding: kecil ? "2px 22px 0 0" : "8px 10px 9px", display: "flex", flexDirection: "column", gap: 2 }}>
      <div style={{ font: huruf(600, 15, 1.25), color: WA.teks, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{judul}</div>
      <div style={{ font: huruf(400, 13.5, 1.3), color: "#6e6e73", display: "-webkit-box", WebkitLineClamp: kecil ? 1 : 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{deskripsi}</div>
      <div style={{ font: huruf(400, 13, 1.3), color: "#8a8a8e" }}>{domain}</div>
    </div>
    {tutup ? <IkonIOS n="tutup" s={16} c="#8a8a8e" w={2.2} style={{ position: "absolute", right: 8, top: 8 }} /> : null}
  </div>
);
// Kolom tulis di bawah: +, kotak teks (paling banyak `baris` baris terlihat), kartu tautan di atasnya; kosong: stiker,
// kamera, mikrofon; berisi: tombol kirim hijau.
export const WaTulis = ({ teks, kartu, baris = 5, tombol }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: `8px 10px ${BAWAH + 4}px`, background: WA.kepala, borderTop: `.5px solid ${WA.garis}`, zIndex: 2 }}>
    {kartu ? <div style={{ margin: "0 0 8px 40px" }}>{kartu}</div> : null}
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
      <IkonIOS n="tambah" s={30} w={1.8} style={{ marginBottom: 4 }} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "flex-end", minHeight: 38, padding: "7px 10px 7px 14px", borderRadius: 19, background: "#fff", boxShadow: `0 0 0 .5px ${WA.garis}` }}>
        <div style={{ flex: 1, minWidth: 0, maxHeight: teks ? baris * 22 : 22, overflow: "hidden", font: huruf(400, 17, 22 / 17), color: teks ? WA.teks : "#b0b0b5", whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{teks || ""}</div>
        {teks ? null : <IkonIOS n="stiker" s={22} c="#3c3c43" w={1.6} />}
      </div>
      {tombol || (teks ? <BulatKirim /> : <><IkonIOS n="kamera" s={28} w={1.7} style={{ marginBottom: 5 }} /><IkonIOS n="mik" s={26} w={1.7} style={{ marginBottom: 6 }} /></>)}
    </div>
  </div>
);
export const BulatKirim = () => (
  <div style={{ width: 38, height: 38, flex: "none", borderRadius: 19, background: WA.hijau, display: "grid", placeItems: "center" }}>
    <svg width="20" height="20" viewBox="0 0 24 24"><path d="M4.3 19.6 21 12 4.3 4.4l2.3 6.6L14 12l-7.4 1z" fill="#fff" /></svg>
  </div>
);
// Pilih kontak "Kirim ke": kepala lembar (Batal, judul), kolom cari berisi `cari` (null = belum diketuk), lalu baris kontak.
// `bungkus` membungkus judul (misalnya dengan <Tanda>) tanpa mengubah tata letaknya.
export const WaPilih = ({ cari, kontak, caret, bungkus = (n) => n }) => (
  <WaLayar latar="#fff">
    <div style={{ position: "absolute", left: 0, right: 0, top: HP.status, padding: "0 16px" }}>
      <div style={{ position: "relative", height: 48, display: "flex", alignItems: "center", justifyContent: "center", font: huruf(600, 17, 1.2), color: WA.teks }}>
        <span style={{ position: "absolute", left: 0, font: huruf(400, 17, 1.2) }}>Batal</span>
        {bungkus("Kirim ke")}
      </div>
      <div style={{ height: 38, margin: "4px 0 10px", display: "flex", alignItems: "center", gap: 6, padding: "0 10px", borderRadius: 11, background: "rgba(118,118,128,.12)", font: huruf(400, 17, 1.2), color: cari ? WA.teks : "#8a8a8e" }}>
        <IkonIOS n="cari" s={19} c="#8a8a8e" w={2.1} />
        {cari || "Cari"}{caret ? <span style={{ width: 2, height: 22, marginLeft: 1, background: WA.hijau, borderRadius: 1 }} /> : null}
      </div>
      <div style={{ padding: "6px 0 4px", font: huruf(600, 15, 1.2), color: WA.abu }}>{cari ? "Kontak" : "Chat terbaru"}</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: HP.status + 48 + 52 + 30 }}>{kontak}</div>
  </WaLayar>
);
export const Kontak = ({ nama, sub, warna }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 0 0 16px", height: 66 }}>
    <Avatar s={46} warna={warna} />
    <div style={{ flex: 1, minWidth: 0, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", borderBottom: `.5px solid ${WA.garis}`, paddingRight: 16 }}>
      <div style={{ font: huruf(600, 17, 1.25), color: WA.teks }}>{nama}</div>
      {sub ? <div style={{ font: huruf(400, 15, 1.3), color: WA.abu, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</div> : null}
    </div>
  </div>
);
