// node alat/waktu.mjs <video> [audio] [--cek]  →  src/<video>/waktu.json: kapan tiap kalimat dan kata naskah
// (src/<video>/naskah.js) diucapkan di audio narasi (bawaan public/<video>/narasi.*). whisper.cpp (Homebrew `whisper-cli`)
// mendengar kata dan waktunya; naskah lalu dijajarkan ke kata yang terdengar (urutan kata, toleran salah dengar), jadi teks
// di video tetap teks naskah. --cek: hanya cetak kecocokan, tanpa menulis waktu.json (untuk membandingkan rekaman).
// Model: WHISPER_MODEL, bawaan ~/Library/Caches/whisper.cpp/ggml-large-v3-turbo-q5_0.bin.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const VIDEO = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const [id, audioArg] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const cek = process.argv.includes("--cek");
if (!id || !fs.existsSync(path.join(VIDEO, "src", id, "naskah.js"))) throw new Error("pakai: node alat/waktu.mjs <video> [audio] [--cek], misalnya kirim-undangan");
const MODEL = process.env.WHISPER_MODEL || path.join(os.homedir(), "Library/Caches/whisper.cpp/ggml-large-v3-turbo-q5_0.bin");
const { NASKAH } = await import(pathToFileURL(path.join(VIDEO, "src", id, "naskah.js")));
const folder = path.join(VIDEO, "public", id);
const audio = audioArg ? path.resolve(audioArg) : path.join(folder, fs.readdirSync(folder).find((f) => /^narasi\.(mp3|wav|m4a)$/i.test(f)) || "narasi.mp3");
const work = path.join(VIDEO, "out", "waktu");
fs.mkdirSync(work, { recursive: true });
const run = (cmd, args) => execFileSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"] }).toString();

// whisper.cpp butuh WAV 16 kHz mono; -ml 1 -sow = satu segmen per kata, dengan waktu dari DTW.
const nama = id + "-" + path.basename(audio).replace(/\.[^.]+$/, "");
const wav = path.join(work, nama + "-16k.wav");
run("ffmpeg", ["-v", "error", "-y", "-i", audio, "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", wav]);
run("whisper-cli", ["-m", MODEL, "-f", wav, "-l", "id", "-ml", "1", "-sow", "-oj", "-of", path.join(work, nama), "--dtw", "large.v3.turbo", "-np"]);
const durasi = +run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", audio]);

// Kata dibandingkan tanpa huruf besar, tanda baca, dan strip; "&" dibaca "dan", "1.000" sama dengan "1000".
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/&/g, "dan").replace(/[^a-z0-9]/g, "");
const heard = JSON.parse(fs.readFileSync(path.join(work, nama + ".json"), "utf8")).transcription
  .map((s) => ({ w: norm(s.text), a: s.offsets.from / 1000, b: s.offsets.to / 1000 })).filter((h) => h.w);
const words = NASKAH.flatMap((k, s) => k.text.split(/\s+/).filter(Boolean).map((w) => ({ s, text: w, w: norm(w) }))).filter((t) => t.w);

// Penjajaran urutan (Needleman-Wunsch): sama = 0, mirip = 1 - kemiripan huruf, lompat = 0,7.
function mirip(x, y) {
  if (x === y) return 1;
  const p = Array.from({ length: y.length + 1 }, (_, j) => j);
  for (let i = 1; i <= x.length; i++) {
    let prev = p[0]; p[0] = i;
    for (let j = 1; j <= y.length; j++) { const t = p[j]; p[j] = Math.min(p[j] + 1, p[j - 1] + 1, prev + (x[i - 1] === y[j - 1] ? 0 : 1)); prev = t; }
  }
  return 1 - p[y.length] / Math.max(x.length, y.length);
}
const GAP = 0.7, n = words.length, m = heard.length, D = new Float64Array((n + 1) * (m + 1)), P = new Uint8Array((n + 1) * (m + 1));
const at = (i, j) => i * (m + 1) + j;
for (let i = 1; i <= n; i++) { D[at(i, 0)] = i * GAP; P[at(i, 0)] = 1; }
for (let j = 1; j <= m; j++) { D[at(0, j)] = j * GAP; P[at(0, j)] = 2; }
for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
  const sub = D[at(i - 1, j - 1)] + Math.min(1.4, 1 - mirip(words[i - 1].w, heard[j - 1].w)), del = D[at(i - 1, j)] + GAP, ins = D[at(i, j - 1)] + GAP;
  const best = Math.min(sub, del, ins);
  D[at(i, j)] = best; P[at(i, j)] = best === sub ? 0 : best === del ? 1 : 2;
}
const pair = new Array(n).fill(-1);
for (let i = n, j = m; i > 0 || j > 0;) {
  const p = P[at(i, j)];
  if (i > 0 && j > 0 && p === 0) { pair[i - 1] = j - 1; i--; j--; } else if (i > 0 && (j === 0 || p === 1)) i--; else j--;
}
// Kata naskah yang tidak terdengar: waktunya dibagi rata di antara kata terdengar sebelum dan sesudahnya.
const times = words.map((_, i) => (pair[i] >= 0 ? [heard[pair[i]].a, heard[pair[i]].b] : null));
for (let i = 0; i < n; i++) {
  if (times[i]) continue;
  let k = i; while (k < n && !times[k]) k++;
  const from = i > 0 ? times[i - 1][1] : 0, to = k < n ? times[k][0] : durasi, step = (to - from) / (k - i);
  for (let q = i; q < k; q++) times[q] = [from + step * (q - i), from + step * (q - i + 1)];
}
const r2 = (v) => Math.round(v * 100) / 100;
const kalimat = NASKAH.map((k, s) => {
  const idx = words.map((w, i) => (w.s === s ? i : -1)).filter((i) => i >= 0);
  const kata = idx.map((i) => [words[i].text, r2(times[i][0]), r2(times[i][1])]);
  const sama = idx.filter((i) => pair[i] >= 0 && heard[pair[i]].w === words[i].w).length / (idx.length || 1);
  return { id: k.id, text: k.text, mulai: kata[0][1], selesai: kata.at(-1)[2], kata, sama: r2(sama) };
});
const out = { audio: path.relative(path.join(VIDEO, "public"), audio), durasi: r2(durasi), kalimat };
if (!cek) fs.writeFileSync(path.join(VIDEO, "src", id, "waktu.json"), JSON.stringify(out, null, 1) + "\n");
for (const k of kalimat) console.log(`${k.mulai.toFixed(2).padStart(7)} ${k.selesai.toFixed(2).padStart(7)}  ${String(Math.round(k.sama * 100)).padStart(3)}%  ${k.id}`);
const cocok = kalimat.reduce((n, k) => n + k.sama * k.kata.length, 0) / words.length;
console.log(`durasi ${out.durasi} s, ${words.length} kata naskah, ${heard.length} kata terdengar, ${Math.round(cocok * 1000) / 10}% kata sama${cek ? " (cek, waktu.json tidak ditulis)" : ""}`);
