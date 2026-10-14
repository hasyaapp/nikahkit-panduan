// node anim/frames.mjs <name> [outDir]  →  one PNG per step (mid-step) + the reduced-motion final frame.
// Opens docs/assets/anim/<name>.svg in headless Chrome, pauses every animation at the sampled time.
// Needs Chrome for Testing (CHROME env var to override the path). Build first: node anim/build.mjs.
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const [name, outDir = "/tmp/frames"] = process.argv.slice(2);
if (!name) throw new Error("pakai: node anim/frames.mjs <nama-animasi>");
const here = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(here, "..", "docs", "assets", "anim", name + ".svg");
const svg = fs.readFileSync(file, "utf8");
// Step start times and loop length are written on the root element by anim/lib.mjs (data-steps, data-total).
const total = +/data-total="([\d.]+)"/.exec(svg)[1];
const starts = /data-steps="([\d.,]+)"/.exec(svg)[1].split(",").map(Number);
const steps = starts.length;
const [, vw, vh] = /viewBox="0 0 (\d+) (\d+)"/.exec(svg).map(Number);
const PW = path.join(process.env.HOME, "Library/Caches/ms-playwright");
const newest = fs.readdirSync(PW).filter((d) => /^chromium-\d+$/.test(d)).sort((a, b) => b.split("-")[1] - a.split("-")[1])[0];
const CHROME = process.env.CHROME || path.join(PW, newest ?? "chromium-missing", "chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing");
const port = 9300 + Math.floor(Math.random() * 500), prof = `/tmp/frames-prof-${port}`;
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, `--window-size=${vw},${vh}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 50 && !target; i++) { await sleep(200); try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch {} }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const pending = new Map();
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); pending.get(m.id)?.(m); pending.delete(m.id); });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send("Emulation.setDeviceMetricsOverride", { width: vw, height: vh, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: pathToFileURL(file).href });
await sleep(800);
fs.mkdirSync(outDir, { recursive: true });
const shoot = async (label, expr) => {
  await send("Runtime.evaluate", { expression: expr });
  await sleep(150);
  const r = await send("Page.captureScreenshot", { format: "png" });
  const p = path.join(outDir, `${name}-${label}.png`);
  fs.writeFileSync(p, Buffer.from(r.result.data, "base64"));
  console.log(p);
};
for (let i = 0; i < steps; i++) {
  const end = i + 1 < steps ? starts[i + 1] : total - 0.5;
  await shoot(String(i + 1), `document.getAnimations().forEach(a=>{a.pause();a.currentTime=${Math.round((starts[i] + (end - starts[i]) * 0.8) * 1000)}})`);
}
await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
await shoot("diam", "0");
ws.close(); chrome.kill(); await sleep(400);
fs.rmSync(prof, { recursive: true, force: true, maxRetries: 5 });
