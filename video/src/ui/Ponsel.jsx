// Ponsel Android: bingkai, bilah status, bilah alamat Chrome (bila `alamat`), isi layar, garis navigasi. Semua anak memakai
// px CSS layar (393x852, titik 0,0 di pojok kiri atas layar); ponsel diperbesar S kali dan diletakkan di PONSEL.
import { BINGKAI, HP, PONSEL, ROBOTO, S } from "./dasar";
import { Ikon } from "./ikon";

const Status = ({ jam }) => (
  <div style={{ position: "absolute", inset: "0 0 auto 0", height: HP.status, display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 18px 0 22px", background: "#fff", color: "#1f1f1f", font: `500 13.5px ${ROBOTO}`, zIndex: 3 }}>
    <span>{jam}</span>
    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <svg width="15" height="15" viewBox="0 0 24 24"><path d="M12 20.5 23.6 6.2A19 19 0 0 0 12 2.5 19 19 0 0 0 .4 6.2L12 20.5z" fill="#1f1f1f" /></svg>
      <svg width="14" height="14" viewBox="0 0 24 24"><path d="M2 22h20V2z" fill="#1f1f1f" /></svg>
      <svg width="22" height="12" viewBox="0 0 26 13"><rect x=".5" y=".5" width="22" height="12" rx="3" fill="none" stroke="#1f1f1f" /><rect x="2.5" y="2.5" width="14" height="8" rx="1.5" fill="#1f1f1f" /><rect x="23.6" y="4.2" width="2" height="4.6" rx="1" fill="#1f1f1f" /></svg>
    </span>
  </div>
);
// Bilah alamat Chrome Android: kotak alamat membulat (domain hitam, sisa alamat abu), jumlah tab, menu. Bagian dari layar
// web (ikut bergeser saat pindah layar), bukan dari ponsel.
export const Alamat = ({ url }) => {
  const [host, ...rest] = url.split("/");
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: HP.status, height: HP.alamat, display: "flex", alignItems: "center", gap: 12, padding: "0 10px 0 12px",
      background: "#fff", borderBottom: "1px solid #e8eaed", zIndex: 3 }}>
      <div style={{ flex: 1, minWidth: 0, height: 40, display: "flex", alignItems: "center", gap: 10, padding: "0 14px", borderRadius: 20, background: "#f0f2f5", color: "#1f1f1f" }}>
        <Ikon n="atur" s={18} c="#444746" />
        <span style={{ minWidth: 0, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", font: `400 15px ${ROBOTO}` }}>
          {host}<span style={{ color: "#5f6368" }}>{rest.length ? "/" + rest.join("/") : ""}</span>
        </span>
      </div>
      <div style={{ width: 20, height: 20, border: "2px solid #444746", borderRadius: 4, display: "grid", placeItems: "center", font: `700 10px ${ROBOTO}`, color: "#444746" }}>2</div>
      <Ikon n="titik" s={22} c="#444746" />
    </div>
  );
};

export const Ponsel = ({ alamat, jam = "19.42", children }) => {
  const w = HP.w + 2 * BINGKAI, h = HP.h + 2 * BINGKAI;
  return (
    <div style={{ position: "absolute", left: PONSEL.x, top: PONSEL.y, width: w, height: h, transform: `scale(${S})`, transformOrigin: "0 0" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 50, background: "#16171b", boxShadow: "0 30px 70px rgba(15,23,42,.28), 0 8px 18px rgba(15,23,42,.18), inset 0 0 0 1.5px #3a3b40" }} />
      <div style={{ position: "absolute", left: BINGKAI, top: BINGKAI, width: HP.w, height: HP.h, borderRadius: 40, overflow: "hidden", background: "#fff" }}>
        <Status jam={jam} />
        {alamat ? <Alamat url={alamat} /> : null}
        {children}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: HP.nav, background: "#fff", zIndex: 3, display: "grid", placeItems: "center" }}>
          <div style={{ width: 112, height: 4.5, borderRadius: 3, background: "#1f1f1f", opacity: 0.85 }} />
        </div>
        <div style={{ position: "absolute", left: "50%", top: 9, width: 11, height: 11, marginLeft: -5.5, borderRadius: "50%", background: "#0b0b0d", zIndex: 4 }} />
      </div>
    </div>
  );
};
