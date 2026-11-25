// Ikon SF Symbols (alat/simbol.swift → public/simbol/*.png dan simbol.json): bentuknya sama dengan ikon bilah status iOS,
// Safari, macOS, dan WhatsApp iOS. Diwarnai lewat mask, ukuran menurut tinggi `h` (lebar mengikuti bentuk aslinya).
import { staticFile } from "remotion";
import UKURAN from "./simbol.json";

export const Simbol = ({ n, h, c = "#000", style }) => {
  const u = UKURAN[n];
  if (!u) throw new Error(`simbol "${n}" belum dirender: swift alat/simbol.swift`);
  const url = `url("${staticFile(`simbol/${n}.png`)}")`;
  return <span aria-hidden style={{ display: "block", flex: "none", width: (h * u.w) / u.h, height: h, background: c,
    WebkitMaskImage: url, maskImage: url, WebkitMaskSize: "100% 100%", maskSize: "100% 100%", ...style }} />;
};
