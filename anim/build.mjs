// node anim/build.mjs              →  docs/assets/anim/<name>.svg for every scene in anim/scenes/*.mjs
// node anim/build.mjs 03-editor.mjs →  only that scene file (no cleanup of other SVGs)
// Each scene file exports `scenes`: { "<name>": scene } (see anim/lib.mjs for the scene shape).
// Fails on unknown element ids, duplicate names, or an SVG that is not well-formed enough to load.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { compile } from "./lib.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, "..", "docs", "assets", "anim");
fs.mkdirSync(out, { recursive: true });
const only = process.argv[2] && path.basename(process.argv[2]);
const seen = new Map();
for (const f of fs.readdirSync(path.join(here, "scenes")).filter((f) => f.endsWith(".mjs") && (!only || f === only)).sort()) {
  const { scenes } = await import(pathToFileURL(path.join(here, "scenes", f)).href);
  for (const [name, scene] of Object.entries(scenes)) {
    if (!/^[a-z0-9-]+$/.test(name)) throw new Error(`${f}: nama "${name}" harus huruf kecil, angka, tanda minus`);
    if (seen.has(name)) throw new Error(`${f}: "${name}" sudah dipakai di ${seen.get(name)}`);
    seen.set(name, f);
    const svg = compile(scene);
    // Cheap well-formedness checks: balanced tags and no raw ampersands.
    const open = (svg.match(/<(?!\/|!|\?)[a-zA-Z][^>]*[^/]>/g) || []).length, close = (svg.match(/<\/[a-zA-Z]+>/g) || []).length;
    if (open !== close) throw new Error(`${name}: tag tidak seimbang (${open} buka, ${close} tutup)`);
    if (/&(?!amp;|lt;|gt;|quot;|#\d+;)/.test(svg)) throw new Error(`${name}: & tanpa escape`);
    fs.writeFileSync(path.join(out, name + ".svg"), svg);
  }
}
// Remove SVGs whose scene no longer exists (full builds only).
if (!only) for (const f of fs.readdirSync(out)) if (f.endsWith(".svg") && !seen.has(f.slice(0, -4))) fs.rmSync(path.join(out, f));
console.log(`${seen.size} animasi → docs/assets/anim/`);
