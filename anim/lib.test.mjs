// node panduan/anim/lib.test.mjs — the scene compiler's rules (canvas, skeleton, focus, marks, lens, timing, reduced motion).
import assert from "node:assert/strict";
import { compile, skeleton, text, rect, tw } from "./lib.mjs";

const scene = (over = {}) => ({
  title: "uji",
  base: [rect(0, 0, 1440, 900, { fill: "#f3f5f9" }), text(100, 100, "Judul panel", { size: 16, fill: "#223548" })],
  els: { base: "<rect/>", later: "<rect/>", gone: "<rect/>", c0: "<rect/>" },
  steps: [
    { caption: "satu", focus: [72, 92, 327, 808], show: ["gone"] },
    { caption: "dua", show: ["later"], hide: ["base"], at: [10, 10], click: true, mark: [0, 0, 30, 30] },
    { caption: "tiga", focus: "all", hide: ["gone"] }
  ],
  ...over
});
const svg = compile(scene());

// Canvas: always the whole 1440x900 desktop on a 960x600 stage (caption bar below), no crops.
assert.match(svg, /viewBox="0 0 960 \d+"/, "stage 960 wide");
assert.match(svg, /<g id="world" transform="scale\(0\.6667\)">/, "world scaled 2/3, never moved");
assert.throws(() => compile(scene({ world: { w: 400, h: 900 } })), /"world" dihapus/);
assert.throws(() => compile(scene({ steps: [{ caption: "a" }] })), /langkah 1 harus punya focus/);
assert.throws(() => compile(scene({ steps: [{ caption: "a", focus: "all", cam: "all" }] })), /kunci "cam" tidak dikenal/);
assert.throws(() => compile(scene({ steps: [{ caption: "a", focus: "all", show: ["nope"] }] })), /"nope" tidak ada/);
assert.throws(() => compile(scene({ steps: [{ caption: "x".repeat(81), focus: "all" }] })), /80 huruf/);
assert.throws(() => compile(scene({ steps: [{ caption: "a", focus: "all", at: [500, 500], click: true, mark: [0, 0, 30, 30] }] })), /tidak berada di dalam mark/, "a click must land on its mark");
assert.throws(() => compile(scene({ steps: [{ caption: "a", focus: "all", mark: [100, 100, 60, 30], note: { text: "x", at: [60, 60] } }] })), /menutupi mark/, "a note or lens never covers the mark");

// Skeleton: text becomes a bar of its measured width at its place; colours turn light grey; white surfaces stay.
const sk = skeleton(text(100, 100, "Simpan", { size: 14, weight: 500, anchor: "middle" }) + rect(0, 0, 10, 10, { fill: "#0779a6" }) + rect(0, 0, 10, 10, { fill: "#ffffff" }) + rect(0, 0, 5, 5, { fill: "rgba(15,22,30,.42)" }));
assert.ok(!/<text/.test(sk), "no text left in a skeleton");
assert.ok(sk.includes(`<rect x="${100 - tw("Simpan", 14, 500) / 2}" y="91.3" width="${tw("Simpan", 14, 500)}" height="7" rx="3.5"`), "text bar centred on the anchor, measured width: " + sk);
assert.ok(sk.includes('fill="#eceff3"') && sk.includes('fill="#ffffff"') && sk.includes("rgba(214,219,226,0.42)"), "dark fill greyed, white kept, alpha kept");

// Focus: the skeleton base under one detailed layer per run of steps with the same focus.
assert.ok(svg.includes('<clipPath id="fz0"><rect x="72" y="92" width="327" height="808"/></clipPath>'), "step 1-2 focus clip");
assert.ok(/<g class="fz0" clip-path="url\(#fz0\)"><use href="#db"\/><\/g>/.test(svg) && /<g class="fz1"><use href="#db"\/><\/g>/.test(svg), "two focus layers, the second unclipped (all)");
assert.ok(svg.indexOf('fill="#dde2e8"') < svg.indexOf('class="fz0"'), "skeleton drawn under the detailed layers");

// Visibility (class rules, so lens copies animate the same) and what reduced motion shows: the final state.
const final = (id) => +new RegExp(`\\.e-${id}\\{[^}]*?opacity:(\\d)`).exec(svg)?.[1];
assert.equal(final("later"), 1, "shown later: visible in the final frame");
assert.equal(final("base"), 0, "hidden in step 2: gone in the final frame");
assert.equal(final("gone"), 0, "shown then hidden: gone in the final frame");
assert.ok(!/\.e-c0\{/.test(svg) && svg.includes('<g class="e-c0">') && svg.includes('<g id="c0">'), "never shown or hidden: always visible; does not collide with caption c0");
assert.match(svg, /data-steps="0,3\.2,6\.4"/, "step start times for frames.mjs");
// A click step changes the screen at the click (1.12 s into the 3.2 s step + 0.1), not at its start: 4.42 / 11.2 s.
const at = (id, v) => new RegExp(`@keyframes v\\d+\\{[^@]*?39\\.464%\\{opacity:${v}`).test(svg);
assert.ok(at("later", 0) && at("base", 1), "show and hide of a click step happen together at the click");

// Mark: ring 4 px outside the element's exact stage bounds, radius r*2/3 + 4, step number on its corner.
const m = compile(scene({ steps: [{ caption: "a", focus: "all", mark: { box: [300, 150, 90, 30], r: 6 }, note: "Klik di sini" }] }));
assert.ok(m.includes('<rect x="196" y="96" width="68" height="28" rx="8" fill="none" stroke="#b8460d" stroke-width="2.5"/>'), "ring hugs the button");
assert.ok(m.includes('<circle cx="196" cy="96" r="10" fill="#b8460d"/>'), "step number on the ring corner");
// Arrow: straight, its tip exactly on the ring's nearest edge (the note sits to the right, so the right edge x = 264).
const tip = /<path d="M([\d.]+) ([\d.]+) L/.exec(m);
assert.ok(tip && +tip[1] === 264 && +tip[2] >= 96 && +tip[2] <= 124, "arrow tip on the ring edge: " + (tip && tip.slice(1)));

// Lens: 2x the stage view of its source, with the detailed base and the elements of that step.
const l = compile(scene({ els: { later: "<rect/>" }, steps: [{ caption: "a", focus: [72, 92, 327, 200], show: ["later"], mark: [100, 120, 80, 30], lens: { src: [72, 92, 300, 120] } }] }));
assert.ok(/scale\(1\.3333\) translate\(-72 -92\)"><g clip-path="url\(#ln0\)"><use href="#db"\/><g class="e-later">/.test(l), "lens = detailed base + the step's elements at 2x");
console.log("lib.mjs: ok");
