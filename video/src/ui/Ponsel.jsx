// iPhone 18 Pro: bingkai dari model AR Apple (public/mockup/iphone.png, dibuat alat/mockup.swift) di atas layar. Anak
// memakai pt layar (402x874, 0,0 = pojok kiri atas layar); ponsel diperbesar s kali dan diletakkan di `ponsel` tata letak.
import { Img, staticFile } from "remotion";
import { BINGKAI, HP, useTata } from "./dasar";

export const Ponsel = ({ children }) => {
  const { ponsel, s } = useTata();
  return (
    <div style={{ position: "absolute", left: ponsel.x, top: ponsel.y, width: HP.w, height: HP.h, transform: `scale(${s})`, transformOrigin: "0 0" }}>
      <div style={{ position: "absolute", left: -BINGKAI.x + 4, top: -BINGKAI.y + 4, width: BINGKAI.w - 8, height: BINGKAI.h - 8, borderRadius: BINGKAI.r + BINGKAI.y,
        boxShadow: "0 34px 70px rgba(43,26,7,.22), 0 10px 22px rgba(43,26,7,.14)" }} />
      <div style={{ position: "absolute", inset: -4, borderRadius: BINGKAI.r + 4, background: "#000" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: BINGKAI.r, overflow: "hidden", background: "#fff" }}>{children}</div>
      <Img src={staticFile("mockup/iphone.png")} style={{ position: "absolute", left: -BINGKAI.x, top: -BINGKAI.y, width: BINGKAI.w, height: BINGKAI.h, pointerEvents: "none", zIndex: 8 }} />
    </div>
  );
};
