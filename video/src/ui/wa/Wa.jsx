// WhatsApp iOS tiruan (tema terang, desain 2025): kepala abu muda, gelembung membulat berekor di bawah, kolom tulis dengan
// +, stiker, kamera, mikrofon, tombol kirim hijau, dan lembar "Kirim ke" dengan kartu kontak berbulatan pilih. Ikon dari
// SF Symbols; foto profil bawaan = bulatan warna pastel dengan siluet orang, warnanya dari nama (palet WhatsApp).
// Ukuran pt layar 402x874; bilah status digambar di atasnya.
import { Img } from "remotion";
import { HP, IOS } from "../dasar";
import { GarisBeranda } from "../ios";
import { Simbol } from "../simbol";

export const WA = { hijau: "#1daa61", teks: "#000", abu: "#8a8a8e", latar: "#f5efe6", keluar: "#d9fdd3", masuk: "#fff", link: "#027eb5", kepala: "#f6f5f3", garis: "rgba(60,60,67,.18)", baca: "#3a97f5", ikon: "#1c1c1e" };
const huruf = (w, s, lh = 1.3) => `${w} ${s}px/${lh} ${IOS}`;
export const ATAS = HP.status + 54;
export const BAWAH = 34;

// Warna foto profil bawaan WhatsApp (latar, siluet), sama dengan AVATAR di halaman Kirim undangan; dipilih dari nama.
const PALET = [["#cbf2ee", "#028377"], ["#ffdae7", "#d42a66"], ["#e8e0ff", "#5e47de"], ["#fee2d8", "#c4532d"], ["#d2e8fe", "#0063cb"], ["#fff0d4", "#9d6c2c"], ["#d9fdd3", "#1b8755"], ["#caecfa", "#027eb5"], ["#f4ded1", "#855538"], ["#fbd8dc", "#b80531"]];
const warnaNama = (nama) => { let h = 0; for (const c of String(nama)) h = (h * 31 + c.charCodeAt(0)) % 997; return PALET[h % PALET.length]; };
const ORANG = "M13.8 25.3v-.6c0-2.4 2.8-4.2 6.2-4.2s6.2 1.8 6.2 4.2v.6c0 .4-.3.7-.7.7H14.5c-.4 0-.7-.3-.7-.7z";
export const Avatar = ({ s = 40, nama = "", grup }) => {
  const [bg, fg] = warnaNama(nama);
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" style={{ flex: "none", display: "block" }}>
      <circle cx="20" cy="20" r="20" fill={bg} />
      {grup ? (
        <g fill={fg}>
          <g transform="translate(-4 -.4)" opacity=".7"><circle cx="20" cy="16.6" r="2.6" /><path d={ORANG} /></g>
          <g transform="translate(3.2 .8)"><circle cx="20" cy="16.6" r="2.9" /><path d={ORANG} /></g>
        </g>
      ) : <g fill={fg}><circle cx="20" cy="16.6" r="2.9" /><path d={ORANG} /></g>}
    </svg>
  );
};
// Seluruh layar aplikasi; latar wallpaper WhatsApp (krem dengan pola samar) atau warna lain.
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
    <div style={{ position: "absolute", left: 0, right: 0, top: HP.status, height: 54, display: "flex", alignItems: "center", padding: "0 18px 0 12px" }}>
      <Simbol n="kembali-tebal" h={21} c={WA.ikon} />
      <span style={{ width: 12 }} />
      <Avatar s={38} nama={nama} />
      <div style={{ flex: 1, minWidth: 0, marginLeft: 10 }}>
        <div style={{ font: huruf(600, 17, 1.2), color: WA.teks, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nama}</div>
        {sub ? <div style={{ font: huruf(400, 13, 1.3), color: WA.abu, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</div> : null}
      </div>
      <Simbol n="video" h={17} c={WA.ikon} style={{ margin: "0 22px 0 14px" }} />
      <Simbol n="telepon" h={20} c={WA.ikon} />
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
  <div style={{ position: "relative", display: "flex", flexDirection: kecil ? "row" : "column", gap: kecil ? 10 : 0, marginBottom: kecil ? 0 : 6, borderRadius: 12, overflow: "hidden",
    background: kecil ? "#f0f0f2" : "rgba(0,0,0,.05)", padding: kecil ? 8 : 0 }}>
    <Img src={gambar} style={{ width: kecil ? 62 : "100%", height: kecil ? 62 : undefined, aspectRatio: "1 / 1", objectFit: "cover", borderRadius: kecil ? 8 : 0, flex: "none", display: "block" }} />
    <div style={{ minWidth: 0, padding: kecil ? "2px 22px 0 0" : "8px 10px 9px", display: "flex", flexDirection: "column", gap: 2 }}>
      <div style={{ font: huruf(600, 15, 1.25), color: WA.teks, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{judul}</div>
      <div style={{ font: huruf(400, 13.5, 1.3), color: "#6e6e73", display: "-webkit-box", WebkitLineClamp: kecil ? 1 : 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{deskripsi}</div>
      <div style={{ font: huruf(400, 13, 1.3), color: WA.abu }}>{domain}</div>
    </div>
    {tutup ? <Simbol n="tutup" h={11} c={WA.abu} style={{ position: "absolute", right: 10, top: 10 }} /> : null}
  </div>
);
// Stiker WhatsApp (kotak dengan sudut terlipat) di dalam kolom tulis; tidak ada padanannya di SF Symbols.
const Stiker = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3c3c43" strokeWidth="1.6" strokeLinejoin="round" style={{ display: "block", flex: "none" }}>
    <path d="M20 12.5V7a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h5.5M20 12.5 12.5 20M20 12.5h-4.5a3 3 0 0 0-3 3V20" />
  </svg>
);
// Kolom tulis di bawah: +, kotak teks (paling banyak `baris` baris terlihat), kartu tautan di atasnya; kosong: stiker,
// kamera, mikrofon; berisi: tombol kirim hijau.
export const WaTulis = ({ teks, kartu, baris = 5, tombol }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: `8px 12px ${BAWAH + 4}px`, background: WA.kepala, borderTop: `.5px solid ${WA.garis}`, zIndex: 2 }}>
    {kartu ? <div style={{ margin: "0 0 8px 40px" }}>{kartu}</div> : null}
    <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
      <Simbol n="tambah" h={21} c={WA.ikon} style={{ marginBottom: 9 }} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "flex-end", minHeight: 38, padding: "7px 10px 7px 14px", borderRadius: 19, background: "#fff", boxShadow: `0 0 0 .5px ${WA.garis}` }}>
        <div style={{ flex: 1, minWidth: 0, maxHeight: teks ? baris * 22 : 22, overflow: "hidden", font: huruf(400, 17, 22 / 17), color: teks ? WA.teks : "#b0b0b5", whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{teks || ""}</div>
        {teks ? null : <Stiker />}
      </div>
      {tombol || (teks ? <BulatKirim /> : <><Simbol n="kamera" h={19} c={WA.ikon} style={{ marginBottom: 10 }} /><Simbol n="mik" h={22} c={WA.ikon} style={{ marginBottom: 8 }} /></>)}
    </div>
  </div>
);
export const BulatKirim = () => (
  <div style={{ width: 38, height: 38, flex: "none", borderRadius: 19, background: WA.hijau, display: "grid", placeItems: "center" }}>
    <Simbol n="kirim" h={18} c="#fff" style={{ transform: "rotate(45deg) translate(-1px, 1px)" }} />
  </div>
);

// ---- Lembar "Kirim ke" (tautan WhatsApp berisi teks tanpa nomor) ----
// Latar hitam, layar WhatsApp di belakangnya mundur, lembar abu: Batal / Kirim ke / Grup baru, kolom Cari, lalu kelompok
// kartu putih berisi kontak dengan bulatan pilih. `judul` membungkus tulisan "Kirim ke" (mis. dengan <Tanda>).
export const LembarKirim = ({ cari, caret, judul = (n) => n, children }) => (
  <div style={{ position: "absolute", inset: 0, background: "#000", overflow: "hidden", font: huruf(400, 17), color: WA.teks }}>
    <div style={{ position: "absolute", left: 20, right: 20, top: 47, height: 40, borderRadius: 12, background: "#d1d1d6" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 57, bottom: 0, borderRadius: "12px 12px 0 0", background: "#f2f2f7", overflow: "hidden" }}>
      <div style={{ position: "relative", height: 54, display: "flex", alignItems: "center", justifyContent: "center", font: huruf(600, 17, 1.2) }}>
        <span style={{ position: "absolute", left: 20, font: huruf(400, 17, 1.2) }}>Batal</span>
        {judul("Kirim ke")}
        <span style={{ position: "absolute", right: 20, font: huruf(400, 17, 1.2) }}>Grup baru</span>
      </div>
      <div style={{ margin: "1px 20px 0", height: 36, borderRadius: 10, background: "rgba(118,118,128,.12)", display: "flex", alignItems: "center", gap: 6, padding: "0 8px" }}>
        <Simbol n="cari" h={15.5} c="#8a8a8e" />
        <span style={{ flex: 1, display: "flex", alignItems: "center", color: cari ? WA.teks : "#8a8a8e" }}>
          {cari || "Cari"}{caret ? <span style={{ width: 2, height: 21, marginLeft: 1, background: WA.hijau, borderRadius: 1 }} /> : null}
        </span>
        {cari ? <Simbol n="hapus-isian" h={16} c="#a8a8ad" /> : null}
      </div>
      <div style={{ paddingTop: 12 }}>{children}</div>
    </div>
    <GarisBeranda />
  </div>
);
// Kartu putih tanpa overflow hidden: sorotan (<Tanda>) di dalamnya tetap bisa meredupkan seluruh layar.
export const Kelompok = ({ judul, children }) => (
  <div style={{ margin: "0 20px 6px" }}>
    {judul ? <div style={{ padding: "16px 19px 8px", font: huruf(600, 15, 1.2), color: WA.abu }}>{judul}</div> : null}
    <div style={{ borderRadius: 10, background: "#fff" }}>{children}</div>
  </div>
);
// Satu baris kontak: foto, nama (nomor bila kontak tidak tersimpan) dan keterangan, bulatan pilih di kanan.
export const Baris = ({ nama, sub, avatar, dipilih, titik, akhir }) => (
  <div style={{ display: "flex", alignItems: "center", height: 48, paddingLeft: 19 }}>
    {avatar || <Avatar s={39} nama={nama} />}
    <div style={{ flex: 1, minWidth: 0, alignSelf: "stretch", display: "flex", alignItems: "center", gap: 14, marginLeft: 12, paddingRight: 21,
      borderBottom: akhir ? "none" : ".5px solid rgba(60,60,67,.29)" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: huruf(400, 17, 1.25), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nama}</div>
        {sub ? <div style={{ font: huruf(400, 13, 1.25), color: WA.abu, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</div> : null}
      </div>
      {titik ? <Simbol n="lainnya" h={4.5} c={WA.ikon} /> : null}
      {dipilih ? <Simbol n="dipilih" h={21} c={WA.hijau} /> : <span style={{ flex: "none", width: 21, height: 21, borderRadius: "50%", boxShadow: "inset 0 0 0 1.4px #c4c4c7" }} />}
    </div>
  </div>
);
// Ikon baris atas lembar: Status saya (lingkaran berbingkai dengan +) dan Meta AI (cincin titik ungu-biru).
export const IkonStatus = () => (
  <svg width="39" height="39" viewBox="0 0 40 40" style={{ flex: "none", display: "block" }}>
    <circle cx="20" cy="20" r="20" fill="#f0f0f2" />
    <circle cx="19" cy="21" r="7.5" fill="none" stroke="#1c1c1e" strokeWidth="2" strokeDasharray="38 9" transform="rotate(-50 19 21)" />
    <circle cx="19" cy="21" r="3.2" fill="#1c1c1e" />
    <path d="M26.5 9.5v6M23.5 12.5h6" stroke="#1c1c1e" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
export const IkonMetaAI = () => (
  <svg width="39" height="39" viewBox="0 0 40 40" style={{ flex: "none", display: "block" }}>
    <defs><linearGradient id="metaai" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c86bff" /><stop offset="1" stopColor="#4f6bff" /></linearGradient></defs>
    <circle cx="20" cy="20" r="19.5" fill="#fff" stroke="#e5e5ea" />
    {[0, 1, 2, 3, 4, 5].map((i) => <ellipse key={i} cx="20" cy="12.2" rx="2.6" ry="4.4" fill="url(#metaai)" transform={`rotate(${i * 60} 20 20)`} />)}
  </svg>
);
