// node video/build.mjs <slug> [outDir]  →  <outDir>/<slug>.mp4 and <slug>-bab.txt (chapters), outDir default video/out.
// A narrated video of one series in video/series.json: each chapter is an animation from anim/scenes, each step's caption
// (the SVG <desc>) is read by ElevenLabs and the step's frames are held until the narration ends; an intro on the first
// frame and an outro on the last. Narration is cached per exact text in video/cache, so only changed text is billed.
// Needs ffmpeg/ffprobe and, for uncached text, the API key in the macOS Keychain (service nikahin-elevenlabs, account api).
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const [slug, outArg] = process.argv.slice(2);
const SERIES = JSON.parse(fs.readFileSync(path.join(here, "series.json"), "utf8"));
const series = SERIES.find((s) => s.slug === slug);
if (!series) throw new Error(`pakai: node video/build.mjs <seri> [folder]; seri: ${SERIES.map((s) => s.slug).join(", ")}`);
const OUT = path.join(here, "out"), CACHE = path.join(here, "cache"), outDir = path.resolve(outArg || OUT);
const FPS = 15, VOICE = "EXAVITQu4vr4xnSDxMaL", MODEL = "eleven_v4", LANG = "id";
// The 2x frames scaled to 1080 high, centred on a 1920x1080 canvas in the guide's background colour.
const VF = "scale=-2:1080,pad=1920:1080:(ow-iw)/2:0:color=0xf3f5f9,format=yuv420p";
for (const d of [OUT, CACHE, outDir, path.join(OUT, "seg")]) fs.mkdirSync(d, { recursive: true });

const run = (cmd, args) => execFileSync(cmd, args, { stdio: ["ignore", "pipe", "inherit"] }).toString();
const dur = (f) => +run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]);
let key = null, billed = 0;
// One file per exact text (and voice, model, language): unchanged steps are never billed again.
async function tts(text) {
  const file = path.join(CACHE, crypto.createHash("sha256").update(JSON.stringify([VOICE, MODEL, LANG, text])).digest("hex").slice(0, 16) + ".mp3");
  if (fs.existsSync(file)) return file;
  key ??= run("security", ["find-generic-password", "-s", process.env.ELEVEN_KEYCHAIN || "nikahin-elevenlabs", "-a", "api", "-w"]).trim();
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}`, { method: "POST",
    headers: { "xi-api-key": key, "content-type": "application/json" }, body: JSON.stringify({ text, model_id: MODEL, language_code: LANG }) });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 300)}`);
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  billed += text.length;
  return file;
}
// Step captions from the SVG <desc> ("1. … 2. …", written by anim/lib.mjs), XML-unescaped.
const unxml = (s) => s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
function captions(name, count) {
  const svg = fs.readFileSync(path.join(here, "..", "docs", "assets", "anim", name + ".svg"), "utf8");
  const parts = unxml(/<desc id="dsc">([\s\S]*?)<\/desc>/.exec(svg)[1]).split(/(?:^|\s)\d+\.\s/).map((p) => p.trim()).filter(Boolean);
  if (parts.length !== count) throw new Error(`${name}: ${parts.length} kalimat di <desc>, ${count} langkah`);
  return parts;
}
// A still frame held for the narration (intro, outro).
function still(frame, audio, pad, seg) {
  const need = dur(audio) + pad;
  run("ffmpeg", ["-y", "-loglevel", "error", "-loop", "1", "-framerate", String(FPS), "-i", frame, "-i", audio, "-filter_complex",
    `[0:v]${VF},fps=30[v];[1:a]apad=whole_dur=${need.toFixed(3)}[a]`, "-map", "[v]", "-map", "[a]",
    "-c:v", "libx264", "-crf", "20", "-c:a", "aac", "-ar", "44100", "-t", need.toFixed(3), seg]);
  return need;
}
// One step: its frames from s to e, the last one held until the narration (plus 0.5 s) ends.
function clip(frames, s, e, audio, seg) {
  const need = Math.max(e - s, dur(audio) + 0.5);
  run("ffmpeg", ["-y", "-loglevel", "error", "-framerate", String(FPS), "-start_number", String(Math.round(s * FPS)), "-i", path.join(frames, "%05d.jpg"), "-i", audio,
    "-filter_complex", `[0:v]trim=duration=${(e - s).toFixed(3)},setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=${(need - (e - s)).toFixed(3)},${VF},fps=30[v];[1:a]apad=whole_dur=${need.toFixed(3)}[a]`,
    "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-c:a", "aac", "-ar", "44100", "-t", need.toFixed(3), seg]);
  return need;
}

const segs = [], marks = [];
let t = 0;
const seg = (n) => { const p = path.join(OUT, "seg", `${slug}-${n}.mp4`); segs.push(p); return p; };
const shots = {};
for (const [name] of series.chapters) {
  const dir = path.join(OUT, "frames", name);
  const info = JSON.parse(run("node", [path.join(here, "frames-video.mjs"), name, dir]).trim().split("\n").pop());
  shots[name] = { dir, ...info };
  console.log(`${name}: ${info.frames} bingkai`);
}
const first = shots[series.chapters[0][0]], last = shots[series.chapters.at(-1)[0]];
marks.push([0, "Pembuka"]);
t += still(path.join(first.dir, "00000.jpg"), await tts(series.intro), 0.8, seg("intro"));
for (const [name, chapter] of series.chapters) {
  const { dir, starts, total } = shots[name];
  marks.push([t, chapter]);
  const texts = captions(name, starts.length);
  for (let i = 0; i < texts.length; i++) t += clip(dir, starts[i], starts[i + 1] ?? total, await tts(texts[i]), seg(`${name}-${i}`));
}
marks.push([t, "Penutup"]);
still(path.join(last.dir, String(last.frames - 1).padStart(5, "0") + ".jpg"), await tts(series.outro), 1.2, seg("outro"));
const list = path.join(OUT, "seg", `${slug}.txt`);
fs.writeFileSync(list, segs.map((p) => `file '${p}'\n`).join(""));
const mp4 = path.join(outDir, slug + ".mp4");
run("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", list, "-c", "copy", "-movflags", "+faststart", mp4]);
const mmss = (x) => `${Math.floor(x / 60)}:${String(Math.floor(x % 60)).padStart(2, "0")}`;
const bab = marks.map(([x, c]) => `${mmss(x)} ${c}`).join("\n");
fs.writeFileSync(path.join(outDir, slug + "-bab.txt"), `${series.title}\n\n${bab}\n`);
console.log(`${mp4} (${mmss(dur(mp4))})\n${bab}\nElevenLabs: ${billed} huruf baru`);
