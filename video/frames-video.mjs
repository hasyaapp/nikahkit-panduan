// node video/frames-video.mjs <name> <outDir>  →  every frame of docs/assets/anim/<name>.svg as <outDir>/00000.jpg …
// The video counterpart of anim/frames.mjs: same headless Chrome and DevTools Animation domain, but it seeks the whole
// loop at FPS (default 15) and captures at SCALE x the SVG size (default 2). Prints { frames, fps, total, starts }.
// CHROME overrides the browser path.
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const [name, outDir] = process.argv.slice(2);
if (!name || !outDir) throw new Error("pakai: node video/frames-video.mjs <nama-animasi> <folder>");
const FPS = +process.env.FPS || 15, SCALE = +process.env.SCALE || 2;
const here = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(here, "..", "docs", "assets", "anim", name + ".svg");
const svg = fs.readFileSync(file, "utf8");
// Written on the root element by anim/lib.mjs.
const total = +/data-total="([\d.]+)"/.exec(svg)[1];
const starts = /data-steps="([\d.,]+)"/.exec(svg)[1].split(",").map(Number);
const [, vw, vh] = /viewBox="0 0 (\d+) (\d+)"/.exec(svg).map(Number);
const PW = path.join(process.env.HOME, "Library/Caches/ms-playwright");
const newest = fs.existsSync(PW) ? fs.readdirSync(PW).filter((d) => /^chromium-\d+$/.test(d)).sort((a, b) => b.split("-")[1] - a.split("-")[1])[0] : null;
const CHROME = process.env.CHROME || path.join(PW, newest ?? "chromium-missing", "chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing");
const prof = fs.mkdtempSync("/tmp/frames-prof-");
const chrome = spawn(CHROME, ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${prof}`, `--window-size=${vw},${vh}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 300 && !target; i++) {
  await sleep(200);
  try { const port = fs.readFileSync(path.join(prof, "DevToolsActivePort"), "utf8").split("\n")[0]; target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch {}
}
if (!target) { chrome.kill(); throw new Error(`Chrome tidak siap dalam 60 dtk: ${CHROME}`); }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const pending = new Map(), anims = new Set(); let loaded = false;
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id) { pending.get(m.id)?.(m); pending.delete(m.id); }
  else if (m.method === "Animation.animationStarted") anims.add(m.params.animation.id);
  else if (m.method === "Page.loadEventFired") loaded = true;
});
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send("Emulation.setDeviceMetricsOverride", { width: vw, height: vh, deviceScaleFactor: SCALE, mobile: false });
await send("Page.enable");
await send("Animation.enable");
await send("Page.navigate", { url: pathToFileURL(file).href });
// As anim/frames.mjs: seek only once the page has loaded and no new animation was reported for 3 checks in a row.
for (let n = -1, still = 0, k = 0; k < 200 && still < 3; k++) { await sleep(300); still = loaded && anims.size && anims.size === n ? still + 1 : 0; n = anims.size; }
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
const ids = [...anims];
await send("Animation.setPaused", { animations: ids, paused: true });
const frames = Math.ceil(total * FPS);
for (let f = 0; f < frames; f++) {
  await send("Animation.seekAnimations", { animations: ids, currentTime: Math.round((f * 1000) / FPS) });
  await send("Runtime.evaluate", { expression: "new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))", awaitPromise: true });
  const r = await send("Page.captureScreenshot", { format: "jpeg", quality: 90 });
  fs.writeFileSync(path.join(outDir, String(f).padStart(5, "0") + ".jpg"), Buffer.from(r.result.data, "base64"));
}
console.log(JSON.stringify({ frames, fps: FPS, total, starts }));
ws.close(); chrome.kill(); await sleep(400);
fs.rmSync(prof, { recursive: true, force: true, maxRetries: 5 });
