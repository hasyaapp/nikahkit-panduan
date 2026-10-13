// node panduan/anim/lib.test.mjs — the scene compiler's visibility rules (what readers with "reduce motion" see).
import assert from "node:assert/strict";
import { compile } from "./lib.mjs";

const svg = compile({
  title: "uji",
  els: { base: "<rect/>", later: "<rect/>", gone: "<rect/>", c0: "<rect/>" },
  steps: [
    { caption: "satu", show: ["gone"] },
    { caption: "dua", show: ["later"], hide: ["base"], at: [10, 10], click: true },
    { caption: "tiga", hide: ["gone"] }
  ]
});
const final = (id) => +new RegExp(`#e-${id}\\{opacity:(\\d)`).exec(svg)?.[1];
assert.equal(final("later"), 1, "shown later: visible in the final frame");
assert.equal(final("base"), 0, "base element hidden in step 2: gone in the final frame");
assert.equal(final("gone"), 0, "shown then hidden: gone in the final frame");
assert.ok(!/#e-c0\{/.test(svg), "never shown or hidden: no animation rule, always visible");
assert.ok(svg.includes('<g id="e-c0">') && svg.includes('<g id="c0">'), "scene id c0 does not collide with caption c0");
assert.match(svg, /data-steps="0,3\.2,6\.4"/, "step start times for frames.mjs");
assert.throws(() => compile({ title: "x", els: {}, steps: [{ caption: "a", show: ["nope"] }] }), /unknown "nope"/);
assert.throws(() => compile({ title: "x", steps: [{ caption: "x".repeat(81) }] }), /80 huruf/);
console.log("lib.mjs: ok");
