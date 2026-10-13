// node panduan/html.mjs [--upload]
// Panduan (docs.json + docs/**/*.mdx) → server/pages/src/panduan/index.html, one Scalev page (nikahin.myscalev.com/panduan)
// with a sidebar, search and one guide page shown at a time (#/path). Without JavaScript every page is shown in order.
// Animations are not inlined (Scalev rejects SVG data URLs): they live in R2 brand-assets/panduan/anim/<name>-<hash>.svg.
// The hash is in the name because the assets worker caches non-HTML files for a year. --upload sends missing SVGs.
// Only the MDX subset the guide uses is understood (see COMPONENTS); anything else stops the build.
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, "..");
const ASSET_BASE = "https://assets.nikahin.workers.dev/brand-assets/panduan/anim/";
const OUT = path.join(ROOT, "server", "pages", "src", "panduan", "index.html");
const COMPONENTS = ["Steps", "Step", "Tabs", "TabItem", "AccordionGroup", "Accordion", "Info", "Warning", "Error", "Success", "CardGroup", "Card", "Image"];
const NOTE = { Info: "Info", Warning: "Perhatian", Error: "Galat", Success: "Berhasil" };

const esc = (s) => String(s).replace(/&(?![a-zA-Z]+;|#\d+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slug = (href) => href === "/" ? "" : href.replace(/^\//, "").replace(/\/$/, "");

// ---- Animations: content-hashed names ----------------------------------------------------------------------------
const animDir = path.join(HERE, "docs", "assets", "anim");
const anim = {};
for (const f of fs.readdirSync(animDir).filter((f) => f.endsWith(".svg"))) {
  const buf = fs.readFileSync(path.join(animDir, f));
  anim[f.slice(0, -4)] = { buf, name: `${f.slice(0, -4)}-${crypto.createHash("sha256").update(buf).digest("hex").slice(0, 8)}.svg` };
}

// ---- Inline markdown ------------------------------------------------------------------------------------------------
function inline(s, ctx) {
  const codes = [];
  s = s.replace(/\\([\\`*_{}\[\]()#+\-.!<>|])/g, (_, c) => `\u0000e${c.charCodeAt(0)}\u0000`);
  s = s.replace(/`([^`]+)`/g, (_, c) => (codes.push(`<code>${esc(c)}</code>`), `\u0000c${codes.length - 1}\u0000`));
  s = esc(s);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => link(u, t, ctx));
  s = s.replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*\w])\*([^*\s][^*]*)\*(?!\w)/g, "$1<em>$2</em>");
  return s.replace(/\u0000c(\d+)\u0000/g, (_, i) => codes[i]).replace(/\u0000e(\d+)\u0000/g, (_, c) => esc(String.fromCharCode(c)));
}
// Heading anchors: docs.page slugs ("Izin domain (CSP)" → izin-domain-csp); ids are prefixed with the page path.
const hslug = (t) => t.toLowerCase().replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const aid = (p, a) => `a-${p.replace(/\//g, "_") || "beranda"}--${a}`;
const anchors = [];
function href(u, ctx) {
  if (/^https?:|^mailto:/.test(u)) return { url: u, ext: true };
  const [p0, a] = u.split("#");
  if (p0 && !p0.startsWith("/")) throw new Error(`${ctx.file}: tautan "${u}" bukan root-relative`);
  const p = p0 ? slug(p0) : ctx.path;
  if (!ctx.paths.has(p)) throw new Error(`${ctx.file}: tautan ke halaman yang tidak ada: ${u}`);
  if (a) anchors.push({ id: aid(p, a), file: ctx.file });
  return { url: "#/" + p, ext: false, a: a && aid(p, a) };
}
function link(u, text, ctx) {
  const h = href(u.replace(/&amp;/g, "&"), ctx);
  return `<a href="${esc(h.url)}"${h.a ? ` data-a="${h.a}"` : ""}${h.ext ? ' target="_blank" rel="noopener"' : ""}>${text}</a>`;
}

// ---- Block markdown -------------------------------------------------------------------------------------------------
function dedent(text, midLine) {
  const lines = text.split("\n");
  const rest = midLine ? lines.slice(1) : lines;
  const ind = Math.min(...rest.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length), 99);
  return lines.map((l, i) => (midLine && i === 0) ? l.trim() : l.slice(Math.min(ind, l.match(/^ */)[0].length))).join("\n");
}
function blocks(text, ctx) {
  const L = text.split("\n"), out = [];
  let i = 0;
  const isList = (l) => /^(\s*)(-|\d+\.)\s+/.exec(l);
  while (i < L.length) {
    const l = L[i];
    if (!l.trim()) { i++; continue; }
    if (/^```/.test(l)) {
      const lang = l.slice(3).trim(), body = [];
      for (i++; i < L.length && !/^```/.test(L[i]); i++) body.push(L[i]);
      i++;
      out.push(`<pre class="code"${lang ? ` data-lang="${esc(lang)}"` : ""}><code>${esc(body.join("\n"))}</code></pre>`);
      continue;
    }
    const h = /^(#{2,4})\s+(.*)$/.exec(l);
    if (h) { const t = inline(h[2], ctx); out.push(`<h${h[1].length} id="${aid(ctx.path, hslug(t))}">${t}</h${h[1].length}>`); i++; continue; }
    if (/^\|/.test(l) && /^\|?[\s:-]+\|/.test(L[i + 1] || "")) {
      const row = (r) => r.trim().replace(/^\||\|$/g, "").split(/(?<!\\)\|/).map((c) => c.trim());
      const head = row(l); i += 2;
      const rows = [];
      for (; i < L.length && /^\|/.test(L[i]); i++) rows.push(row(L[i]));
      out.push(`<div class="table"><table><thead><tr>${head.map((c) => `<th>${inline(c, ctx)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c, ctx)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }
    if (/^(\*\*\*|---)\s*$/.test(l)) { out.push("<hr>"); i++; continue; }
    if (isList(l)) {
      const items = [];
      for (; i < L.length; i++) {
        const m = isList(L[i]);
        if (m && m[1].length === 0) { items.push({ ord: m[2] !== "-", lines: [L[i].slice(m[0].length)] }); continue; }
        if (!L[i].trim()) { if (L[i + 1] && (/^\s+\S/.test(L[i + 1]) || (isList(L[i + 1]) && isList(L[i + 1])[1].length === 0))) { items.at(-1).lines.push(""); continue; } break; }
        if (/^\s+\S/.test(L[i])) { items.at(-1).lines.push(L[i]); continue; }
        break;
      }
      const tag = items[0].ord ? "ol" : "ul";
      out.push(`<${tag}>${items.map((it) => `<li>${blocks(dedent(it.lines.join("\n"), true), ctx).replace(/^<p>([\s\S]*?)<\/p>$/, "$1")}</li>`).join("")}</${tag}>`);
      continue;
    }
    const para = [];
    for (; i < L.length && L[i].trim() && !/^```|^#{2,4}\s|^\|/.test(L[i]) && !isList(L[i]); i++) para.push(L[i].trim());
    out.push(`<p>${inline(para.join(" "), ctx)}</p>`);
  }
  return out.join("\n");
}

// ---- Components -----------------------------------------------------------------------------------------------------
const TAG = new RegExp(`<(/?)(${COMPONENTS.join("|")})((?:\\s+[a-zA-Z]+=(?:"[^"]*"|'[^']*'|\\{[^}]*\\}))*)\\s*(/?)>`, "g");
const attrs = (s) => Object.fromEntries([...s.matchAll(/([a-zA-Z]+)=(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})/g)].map((m) => [m[1], m[2] ?? m[3] ?? m[4]]));
function tree(src, ctx) {
  const root = { name: "root", kids: [] }, stack = [root];
  let last = 0;
  const text = (t, midLine) => { if (t.trim()) stack.at(-1).kids.push({ text: t, midLine }); };
  for (const m of src.matchAll(TAG)) {
    text(src.slice(last, m.index), last > 0 && src[last - 1] !== "\n" && !src.slice(last, m.index).startsWith("\n"));
    last = m.index + m[0].length;
    const [, close, name, a, self] = m;
    if (close) {
      const top = stack.pop();
      if (top.name !== name) throw new Error(`${ctx.file}: </${name}> menutup <${top.name}>`);
    } else {
      const node = { name, attrs: attrs(a), kids: [] };
      stack.at(-1).kids.push(node);
      if (!self) stack.push(node);
    }
  }
  text(src.slice(last), last > 0 && src[last - 1] !== "\n");
  if (stack.length !== 1) throw new Error(`${ctx.file}: <${stack.at(-1).name}> tidak ditutup`);
  return root;
}
let uid = 0;
function render(node, ctx) {
  if (node.text !== undefined) return blocks(dedent(node.text.replace(/^\n/, ""), node.midLine && !node.text.startsWith("\n")), ctx);
  const kids = () => node.kids.map((k) => render(k, ctx)).join("\n");
  const a = node.attrs || {};
  switch (node.name) {
    case "root": return kids();
    case "Steps": return `<ol class="steps">${node.kids.filter((k) => k.name === "Step").map((k) => render(k, ctx)).join("")}</ol>`;
    case "Step": return `<li><h4>${inline(a.title || "", ctx)}</h4>${kids()}</li>`;
    case "Info": case "Warning": case "Error": case "Success":
      return `<div class="note note-${node.name.toLowerCase()}"><b class="note-t">${NOTE[node.name]}</b>${kids()}</div>`;
    case "AccordionGroup": return `<div class="acc">${kids()}</div>`;
    case "Accordion": return `<details><summary>${inline(a.title || "", ctx)}</summary><div>${kids()}</div></details>`;
    case "Tabs": {
      const id = "t" + uid++, items = node.kids.filter((k) => k.name === "TabItem");
      return `<div class="tabs" data-tabs><div class="tab-bar" role="tablist">${items.map((k, i) => `<button type="button" role="tab" aria-selected="${i === 0}" aria-controls="${id}-${i}">${esc(k.attrs.label || "")}</button>`).join("")}</div>${items.map((k, i) => `<div class="tab-panel" role="tabpanel" id="${id}-${i}" data-label="${esc(k.attrs.label || "")}"${i ? " hidden" : ""}>${render(k, ctx)}</div>`).join("")}</div>`;
    }
    case "TabItem": return kids();
    case "CardGroup": return `<div class="cards">${kids()}</div>`;
    case "Card": {
      const h = a.href ? href(a.href, ctx) : null;
      const inner = `<b>${inline(a.title || "", ctx)}</b>${kids()}`;
      return h ? `<a class="card" href="${esc(h.url)}"${h.a ? ` data-a="${h.a}"` : ""}${h.ext ? ' target="_blank" rel="noopener"' : ""}>${inner}</a>` : `<div class="card">${inner}</div>`;
    }
    case "Image": {
      const m = /^\/assets\/anim\/([a-z0-9-]+)\.svg$/.exec(a.src || "");
      if (!m || !anim[m[1]]) throw new Error(`${ctx.file}: gambar tidak dikenal ${a.src}`);
      return `<figure><img src="${ASSET_BASE + anim[m[1]].name}" alt="${esc(a.alt || "")}" width="960" height="600" loading="lazy" decoding="async">${a.caption ? `<figcaption>${esc(a.caption)}</figcaption>` : ""}</figure>`;
    }
  }
  throw new Error(`${ctx.file}: komponen ${node.name} belum didukung`);
}

// ---- Pages ----------------------------------------------------------------------------------------------------------
const cfg = JSON.parse(fs.readFileSync(path.join(HERE, "docs.json"), "utf8"));
const order = cfg.sidebar.flatMap((g) => g.pages.map((p) => ({ ...p, group: g.group, path: slug(p.href) })));
const paths = new Set(order.map((p) => p.path));
const pages = order.map((p) => {
  const file = path.join(HERE, "docs", (p.path || "index") + ".mdx");
  const raw = fs.readFileSync(file, "utf8");
  const fm = /^---\n([\s\S]*?)\n---\n/.exec(raw);
  const meta = Object.fromEntries(fm[1].split("\n").map((l) => /^(\w+):\s*(.*)$/.exec(l)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, "")]));
  const ctx = { file: path.relative(ROOT, file), paths, path: p.path };
  const body = render(tree(raw.slice(fm[0].length), ctx), ctx);
  return { ...p, title: meta.title || p.title, description: meta.description || "", body };
});

const nav = cfg.sidebar.map((g) => `<div class="nav-g"><p>${esc(g.group)}</p>${g.pages.map((p) => `<a href="#/${slug(p.href)}" data-p="${slug(p.href)}">${esc(p.title)}</a>`).join("")}</div>`).join("");
const sections = pages.map((p, i) => {
  const prev = pages[i - 1], next = pages[i + 1];
  return `<section class="doc" data-p="${p.path}" id="p-${p.path || "beranda"}">
<p class="crumb">${esc(p.group)}</p>
<h1>${esc(p.title)}</h1>
${p.description ? `<p class="lead">${inline(p.description, { file: p.path, paths })}</p>` : ""}
${p.body}
<nav class="pn">${prev ? `<a href="#/${prev.path}"><small>Sebelumnya</small>${esc(prev.title)}</a>` : "<span></span>"}${next ? `<a class="next" href="#/${next.path}"><small>Berikutnya</small>${esc(next.title)}</a>` : ""}</nav>
</section>`;
}).join("\n");

const legal = fs.readFileSync(path.join(ROOT, "server", "pages", "src", "legal", "index.html"), "utf8");
const baseCss = /<style>([\s\S]*?)<\/style>/.exec(legal)[1].trim();
const fonts = [...legal.matchAll(/<link[^>]*>/g)].map((m) => m[0]).join("\n");
const CSS = fs.readFileSync(path.join(HERE, "html.css"), "utf8").trim();
const JS = fs.readFileSync(path.join(HERE, "html.js"), "utf8").trim();

const html = `<title>Panduan NikahKit · Nikahin</title>
${fonts}
<style>
${baseCss}
${CSS}
</style>

<div id="svLegal">
<div class="pd" id="pd">
<aside class="pd-side">
<details class="pd-toc" open><summary>Daftar isi</summary>
<label class="pd-search"><span>Cari di panduan</span><input type="search" id="pdQ" placeholder="Cari, misalnya: PIN, CSV, musik" autocomplete="off"></label>
<div id="pdHits" class="pd-hits" hidden></div>
<nav class="pd-nav" aria-label="Daftar isi panduan">${nav}</nav>
</details>
</aside>
<main class="pd-main" id="pdMain">
${sections}
</main>
</div>
</div>
<script>
${JS}
</script>
`;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
for (const a of anchors) if (!html.includes(`id="${a.id}"`)) throw new Error(`${a.file}: tautan ke judul yang tidak ada (${a.id})`);
console.log(`${pages.length} halaman → ${path.relative(ROOT, OUT)} (${Math.round(html.length / 1024)} KB), ${Object.keys(anim).length} animasi`);

// ---- Upload missing animations to R2 --------------------------------------------------------------------------------
if (process.argv.includes("--upload")) {
  const md = fs.readFileSync(path.join(os.homedir(), ".config", "nikahin", "KONFIGURASI-CLOUDFLARE.md"), "utf8");
  const ACC = /Account ID \| `([0-9a-f]{32})`/.exec(md)?.[1], TOK = /API token \| `([^`]+)`/.exec(md)?.[1];
  if (!ACC || !TOK) throw new Error("Account ID / API token Cloudflare tidak ditemukan");
  let sent = 0;
  for (const { buf, name } of Object.values(anim)) {
    if ((await fetch(ASSET_BASE + name)).ok) continue; // the assets worker answers HEAD with 405
    const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACC}/r2/buckets/brand-assets/objects/panduan/anim/${name}`,
      { method: "PUT", headers: { Authorization: "Bearer " + TOK, "Content-Type": "image/svg+xml" }, body: buf });
    if (!r.ok) throw new Error(`${name}: HTTP ${r.status} ${(await r.text()).slice(0, 200).split(TOK).join("***")}`);
    sent++;
  }
  console.log(`R2: ${sent} animasi diunggah, ${Object.keys(anim).length - sent} sudah ada`);
}
