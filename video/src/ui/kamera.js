// Kamera yang sedang aktif, untuk isi layar yang ukurannya tetap di kanvas (sorotan, ketukan) walau ponsel diperbesar:
// s = px kanvas per pt layar; lihat = bagian layar (pt) yang tampak di panggung [x0, y0, x1, y1].
import { createContext, useContext } from "react";
import { HP, TATA } from "./dasar.js";

export const Kamera = createContext({ s: TATA.tegak.s, lihat: [0, 0, HP.w, HP.h] });
export const useKamera = () => useContext(Kamera);
