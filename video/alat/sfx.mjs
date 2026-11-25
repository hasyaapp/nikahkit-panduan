// node alat/sfx.mjs  →  public/sounds/: salin efek suara di src/ui/sfx.json dari pustaka Boombox Studio (lisensi pengguna
// Mac ini). Hanya berkas yang dipakai; public/ tidak masuk git, jadi WAV-nya tidak ikut terbit.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const akar = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUSTAKA = path.join(os.homedir(), "Library/Application Support/Boombox Studio/data/sounds");
const tujuan = path.join(akar, "public", "sounds");
const daftar = JSON.parse(fs.readFileSync(path.join(akar, "src/ui/sfx.json"), "utf8"));
fs.mkdirSync(tujuan, { recursive: true });
for (const nama of Object.values(daftar)) fs.copyFileSync(path.join(PUSTAKA, nama), path.join(tujuan, nama));
console.log(`${Object.keys(daftar).length} efek suara → ${path.relative(process.cwd(), tujuan)}`);
