// Bagian iOS 26 yang digambar sendiri (pt layar 402x874): bilah status di samping Dynamic Island (jam, atau tautan balik
// "◀ WhatsApp" saat aplikasi dibuka dari aplikasi lain), bilah Safari bawah, dan garis beranda. Ikon dari SF Symbols.
import { HP, IOS } from "./dasar";
import { Simbol } from "./simbol";

// Bilah status: jam di kiri Dynamic Island, sinyal/Wi-Fi/baterai di kanan. `balik` = nama aplikasi asal ("◀ WhatsApp").
export const StatusIOS = ({ jam = "19.42", balik, warna = "#000" }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: HP.w, height: HP.status, zIndex: 4, color: warna, pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: 0, width: 140, top: 21, height: 22, display: "flex", alignItems: "center", justifyContent: "center", gap: 3,
      font: `600 ${balik ? 13.5 : 17}px/22px ${IOS}`, letterSpacing: balik ? 0 : "-0.02em" }}>
      {balik ? <><Simbol n="segitiga" h={8.5} c={warna} />{balik}</> : jam}
    </div>
    <div style={{ position: "absolute", left: 262, width: 140, top: 21, height: 22, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
      <Simbol n="sinyal" h={11.5} c={warna} />
      <Simbol n="wifi" h={11.5} c={warna} />
      <Simbol n="baterai" h={12.5} c={warna} />
    </div>
  </div>
);

export const GarisBeranda = ({ warna = "#000" }) => (
  <div style={{ position: "absolute", left: HP.w / 2 - 70, bottom: 8, width: 140, height: 5, borderRadius: 3, background: warna, zIndex: 5 }} />
);

// Bilah Safari iOS 26 (tata letak ringkas): tombol kembali, kapsul alamat (domain saja, seperti Safari), tombol lainnya.
export const Safari = ({ url }) => {
  const host = url.replace(/^https?:\/\//, "").split("/")[0];
  const kaca = { background: "rgba(255,255,255,.86)", boxShadow: "0 0 0 .5px rgba(0,0,0,.08), 0 6px 18px rgba(0,0,0,.12)", backdropFilter: "blur(16px)" };
  return (
    <div style={{ position: "absolute", left: 0, top: HP.h - HP.safari, width: HP.w, height: HP.safari, background: "linear-gradient(rgba(255,255,255,0), #fff 40%)", zIndex: 3 }}>
      <div style={{ position: "absolute", left: 14, right: 14, top: 8, height: 48, display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: 24, display: "grid", placeItems: "center", ...kaca }}><Simbol n="kembali" h={20} /></div>
        <div style={{ flex: 1, height: 48, borderRadius: 24, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", ...kaca }}>
          <Simbol n="halaman" h={18} />
          <span style={{ flex: 1, textAlign: "center", font: `500 16px ${IOS}`, color: "#000", letterSpacing: "-0.01em" }}>{host}</span>
          <Simbol n="muat-ulang" h={17} />
        </div>
        <div style={{ width: 48, height: 48, borderRadius: 24, display: "grid", placeItems: "center", ...kaca }}><Simbol n="lainnya" h={5} /></div>
      </div>
      <GarisBeranda />
    </div>
  );
};
