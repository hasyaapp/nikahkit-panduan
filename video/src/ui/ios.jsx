// Bagian iOS 26 yang digambar sendiri (pt layar 402x874): bilah status di samping Dynamic Island (jam, atau tautan balik
// "◀ WhatsApp" saat aplikasi dibuka dari aplikasi lain), bilah Safari bawah, garis beranda, dan ikon garis gaya SF.
import React from "react";
import { HP, IOS } from "./dasar";

const G = {
  kembali: <path d="M15 4.5 7.5 12l7.5 7.5" />,
  video: <><rect x="2.5" y="6" width="13" height="12" rx="3" /><path d="m15.5 10.5 5-3v9l-5-3" /></>,
  telepon: <path d="M6.6 3.5h2.3l1.6 4.2-2 1.4a12 12 0 0 0 6.4 6.4l1.4-2 4.2 1.6v2.3a2.1 2.1 0 0 1-2.3 2.1A17.6 17.6 0 0 1 4.5 5.8a2.1 2.1 0 0 1 2.1-2.3z" />,
  tambah: <path d="M12 4.5v15M4.5 12h15" />,
  kamera: <><path d="M3 8.5a2 2 0 0 1 2-2h2.3l1.5-2h6.4l1.5 2H19a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><circle cx="12" cy="13" r="3.8" /></>,
  mik: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" /></>,
  stiker: <path d="M20 12.5V7a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h5.5M20 12.5 12.5 20M20 12.5h-4.5a3 3 0 0 0-3 3V20" />,
  cari: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></>,
  titik: <><circle cx="5.5" cy="12" r="1.3" fill="currentColor" /><circle cx="12" cy="12" r="1.3" fill="currentColor" /><circle cx="18.5" cy="12" r="1.3" fill="currentColor" /></>,
  muat: <path d="M19 12a7 7 0 1 1-2.05-4.95M19.5 4.5V8h-3.5" />,
  halaman: <><rect x="4" y="3.5" width="16" height="17" rx="3" /><path d="M8 8.5h8M8 12h8M8 15.5h5" /></>,
  tutup: <path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />,
};
export const IkonIOS = ({ n, s = 24, c = "#000", w = 1.9, style }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flex: "none", color: c, ...style }}>{G[n]}</svg>
);

// Bilah status: jam di kiri Dynamic Island, sinyal/Wi-Fi/baterai di kanan. `balik` = nama aplikasi asal ("◀ WhatsApp").
export const StatusIOS = ({ jam = "19.42", balik, warna = "#000" }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: HP.w, height: HP.status, zIndex: 4, color: warna, pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: 0, width: 140, top: 21, height: 22, display: "flex", alignItems: "center", justifyContent: "center", font: `600 ${balik ? 13.5 : 17}px/22px ${IOS}`, letterSpacing: balik ? 0 : "-0.02em" }}>
      {balik ? <><svg width="9" height="10" viewBox="0 0 9 10" style={{ marginRight: 3 }}><path d="M8.5 0v10L0 5z" fill={warna} /></svg>{balik}</> : jam}
    </div>
    <div style={{ position: "absolute", left: 262, width: 140, top: 21, height: 22, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
      <svg width="19" height="12" viewBox="0 0 19 12">{[0, 1, 2, 3].map((i) => <rect key={i} x={i * 5} y={9 - i * 3} width="3.6" height={3 + i * 3} rx="1" fill={warna} />)}</svg>
      <svg width="17" height="12" viewBox="0 0 17 12"><path d="M8.5 11.6 5.9 8.9a3.7 3.7 0 0 1 5.2 0zM3.6 6.6l-1.7-1.7a9.4 9.4 0 0 1 13.2 0l-1.7 1.7a7 7 0 0 0-9.8 0zM.2 3.2l-.2-.2a12.2 12.2 0 0 1 17 0l-.2.2-1.5 1.5a10 10 0 0 0-13.6 0z" fill={warna} /></svg>
      <svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.8" fill="none" stroke={warna} strokeOpacity=".4" /><rect x="2" y="2" width="17" height="9" rx="2.4" fill={warna} /><path d="M25 4.3v4.4a2.3 2.3 0 0 0 0-4.4z" fill={warna} fillOpacity=".45" /></svg>
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
        <div style={{ width: 48, height: 48, borderRadius: 24, display: "grid", placeItems: "center", ...kaca }}><IkonIOS n="kembali" s={22} w={2.3} /></div>
        <div style={{ flex: 1, height: 48, borderRadius: 24, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", ...kaca }}>
          <IkonIOS n="halaman" s={19} w={1.8} />
          <span style={{ flex: 1, textAlign: "center", font: `500 16px ${IOS}`, color: "#000", letterSpacing: "-0.01em" }}>{host}</span>
          <IkonIOS n="muat" s={19} w={2} />
        </div>
        <div style={{ width: 48, height: 48, borderRadius: 24, display: "grid", placeItems: "center", ...kaca }}><IkonIOS n="titik" s={22} /></div>
      </div>
      <GarisBeranda />
    </div>
  );
};
