// npm run layar  →  public/kirim-undangan/layar/*.png (layar HP 393x744, 3x) dan layar.json (kotak elemen per layar).
// Tampilan asli: halaman dashboard hasil build (server/pages/panel/scalev_panel.html, berisi Beranda, Kirim, Hari-H) dibuka
// di Chrome tanpa jendela. API worker diganti tiruan lokal (data contoh, tanpa menyentuh produksi); sampul undangan dari
// demo template di R2. Urutan langkah = alur di naskah.js. Jalankan ulang bila halaman Kirim berubah.
import { spawn, execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.join(here, "..", "..", "..", "..");
const OUT = path.join(here, "..", "..", "public", "kirim-undangan", "layar");
const PANEL = path.join(REPO, "server", "pages", "panel", "scalev_panel.html");
const WORKER = "https://wedding-guestbook.nikahin.workers.dev";

// Data contoh panduan: Rani & Dimas di tokomu.myscalev.com, demo template Garden Stroll.
const W = "365671", LINK = "https://tokomu.myscalev.com/rani-dimas", PIN = "482913", COUPLE = "Rani & Dimas";
const DEMO = "https://assets.nikahin.workers.dev/brand-assets/templates/garden-stroll/demo.html";
const OG = "https://tokomu.myscalev.com/og/rani-dimas.jpg";
const SEKARANG = Date.parse("2026-11-25T19:42:00+07:00");
const TAMU = [
  "Keluarga Besar Surya",
  "Bapak Andi & Ibu Rina - 081234567890",
  "Dewi Lestari - 082198765432 - Sahabat - 2",
  "Om Hendra & Tante Lia - 081355512345 - Keluarga - 2",
  "Sari Wulandari - 085711223344 - Sahabat",
  "Tim Marketing PT Sinar Jaya - Kantor - 5",
].join("\n");
const PILIH = "Keluarga Besar Surya";
const HP = { width: 393, height: 744, deviceScaleFactor: 3, mobile: true };
const UA_HP = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36";

// Kode tautan seperti worker (6 huruf dari HMAC); di sini dari SHA-256 nama, cukup untuk tampilan.
const ABJAD = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const kode = (name) => [...crypto.createHash("sha256").update(name.toLowerCase()).digest()].slice(0, 6).map((b) => ABJAD[b % ABJAD.length]).join("");
const jam = (h) => new Date(SEKARANG - h * 36e5).toISOString();
const RSVP = [
  ["Bude Ratna", "hadir", 2, "Selamat ya Rani & Dimas, semoga sakinah mawaddah warahmah.", 5],
  ["Fajar Nugroho", "hadir", 1, "Barakallah! Ditunggu kabar bahagianya.", 9],
  ["Mbak Tari", "ragu", 0, "Insyaallah datang, masih cek jadwal.", 20],
  ["Keluarga Pak Darmo", "hadir", 4, "Semoga lancar sampai hari-H.", 30],
  ["Nadia Putri", "hadir", 2, "Happy wedding! 🤍", 50],
  ["Yoga Pratama", "tidak", 0, "Maaf belum bisa hadir, doa terbaik untuk kalian.", 70],
  ["Tante Wulan", "hadir", 2, "Selamat menempuh hidup baru.", 96],
  ["Rizky Ananda", "hadir", 1, "", 120],
  ["Om Bagus", "hadir", 3, "Semoga menjadi keluarga yang bahagia.", 150],
  ["Lina Marlina", "ragu", 0, "", 180],
  ["Dimas Arya", "hadir", 2, "Mantap, selamat ya!", 220],
  ["Sinta Maharani", "hadir", 2, "Bahagia selalu.", 260],
].map(([name, attendance, guests_count, message, h], i) => ({ id: "rsvp-" + i, name, attendance, guests_count, message, created_at: jam(h), is_visible: 1 }));
const REKAP = {
  rsvp: RSVP, comments: RSVP.filter((r) => r.message).map((r) => ({ id: "c-" + r.id, name: r.name, message: r.message, created_at: r.created_at, is_visible: 1 })),
  guest_views: [], checkins: [], event: { title: "Akad Nikah", start: "2027-02-14T08:00", tz: "+07:00" },
  summary: { total_orang: 19, hadir: 9, ragu: 2, tidak: 1, total: 12, checkin: 0, ucapan: 10, guests_opened: 0, views_total: 0 },
};
const PREVIEW = { image: OG, title: "Undangan Pernikahan Rani & Dimas", description: "Minggu, 14 Februari 2027. Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberi doa restu." };
function api(route, body) {
  if (route === "/sign-tokens") {
    const names = Array.isArray(body.names) ? body.names : [];
    return { ok: true, weddingId: W, tokens: Object.fromEntries(names.map((n) => [n, kode(n)])), ...(body.link && !names.length ? { couple: COUPLE, preview: PREVIEW } : {}) };
  }
  if (route === "/rekap") return { ok: true, ...REKAP };
  return { ok: true };
}

// Server lokal: halaman dashboard dengan alamat worker diganti /api server ini.
const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname.startsWith("/api/")) {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => { res.writeHead(200, { "Content-Type": "application/json" }); res.end(JSON.stringify(api(url.pathname.slice(4), raw ? JSON.parse(raw) : {}))); });
    return;
  }
  if (url.pathname === "/kelola") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(fs.readFileSync(PANEL, "utf8").split(WORKER).join(`http://127.0.0.1:${server.address().port}/api`));
    return;
  }
  res.writeHead(404); res.end();
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const PORT = server.address().port;

// Chrome dari cache Playwright, seperti anim/frames.mjs; CHROME=<path> untuk browser lain.
const PW = path.join(process.env.HOME, "Library/Caches/ms-playwright");
const newest = fs.existsSync(PW) ? fs.readdirSync(PW).filter((d) => /^chromium-\d+$/.test(d)).sort((a, b) => b.split("-")[1] - a.split("-")[1])[0] : null;
const CHROME = process.env.CHROME || path.join(PW, newest ?? "chromium-missing", "chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing");
const prof = fs.mkdtempSync("/tmp/layar-prof-");
const chrome = spawn(CHROME, ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${prof}`, "--hide-scrollbars", "--force-color-profile=srgb", "--lang=id-ID", "--window-size=393,744", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 300 && !target; i++) {
  await sleep(200);
  try { const port = fs.readFileSync(path.join(prof, "DevToolsActivePort"), "utf8").split("\n")[0]; target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch {}
}
if (!target) { chrome.kill(); throw new Error(`Chrome tidak siap: ${CHROME}`); }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let seq = 0;
const pending = new Map();
let ogJpeg = null;
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const i = ++seq;
  pending.set(i, (m) => (m.error ? reject(new Error(`${method}: ${m.error.message}`)) : resolve(m.result)));
  ws.send(JSON.stringify({ id: i, method, params }));
});
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id) { pending.get(m.id)?.(m); pending.delete(m.id); return; }
  // Gambar pratinjau tautan (https, seperti dari Scalev) dilayani dari potongan sampul demo.
  if (m.method === "Fetch.requestPaused") send("Fetch.fulfillRequest", { requestId: m.params.requestId, responseCode: 200,
    responseHeaders: [{ name: "Content-Type", value: "image/jpeg" }], body: ogJpeg.toString("base64") });
});
const js = async (expr) => {
  const r = await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(`${expr.slice(0, 80)}: ${r.exceptionDetails.exception?.description || r.exceptionDetails.text}`);
  return r.result.value;
};
const until = async (expr, what, ms = 20000) => {
  for (const end = Date.now() + ms; Date.now() < end; await sleep(100)) if (await js(expr).catch(() => false)) return;
  throw new Error(`tidak muncul: ${what}`);
};

// Semua dokumen (juga iframe srcdoc): jam tetap 25 Nov 2026 19.42 WIB, huruf Roboto seperti HP Android.
await send("Page.enable");
await send("Page.addScriptToEvaluateOnNewDocument", { source: `(() => {
  const D = Date, shift = ${SEKARANG} - D.now();
  class F extends D { constructor(...a) { if (a.length) super(...a); else super(D.now() + shift); } static now() { return D.now() + shift; } }
  globalThis.Date = F;
  const font = () => { if (!document.head || document.getElementById("nk-roboto")) return; const l = document.createElement("link"); l.id = "nk-roboto"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300..700;1,400&display=block"; document.head.appendChild(l); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", font); else font();
})();` });
await send("Emulation.setTimezoneOverride", { timezoneId: "Asia/Jakarta" });
await send("Emulation.setLocaleOverride", { locale: "id-ID" });
const hp = async () => {
  await send("Emulation.setDeviceMetricsOverride", HP);
  await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  await send("Emulation.setUserAgentOverride", { userAgent: UA_HP, platform: "Android" });
};
await hp();

// Kotak elemen (px CSS, relatif layar): "pemilih", "share:pemilih" (di iframe Kirim), "rekap:pemilih", akhiran "|teks".
const KOTAK = `(spec) => {
  const out = {};
  const frame = (t) => [...document.querySelectorAll("iframe")].find((f) => f.title === t && !f.hidden);
  for (const [key, raw] of Object.entries(spec)) {
    let doc = document, dx = 0, dy = 0, sel = raw;
    const m = /^(share|rekap):(.*)$/.exec(raw);
    if (m) { const f = frame(m[1] === "share" ? "Kirim undangan" : "Tamu, ucapan, dan pengaturan"); if (!f) continue; doc = f.contentDocument; const b = f.getBoundingClientRect(); dx = b.left; dy = b.top; sel = m[2]; }
    const [css, text] = sel.split("|");
    const el = [...doc.querySelectorAll(css)].find((n) => !text || n.textContent.replace(/\\s+/g, " ").trim().includes(text));
    if (!el) continue;
    const b = el.getBoundingClientRect();
    if (!b.width || !b.height) continue;
    out[key] = [b.left + dx, b.top + dy, b.width, b.height].map((v) => Math.round(v * 10) / 10);
  }
  return out;
}`;
const manifest = { viewport: [HP.width, HP.height], scale: HP.deviceScaleFactor, sekarang: new Date(SEKARANG).toISOString(), layar: {} };
// Huruf dan gambar yang terlihat sudah termuat, animasi UI (panel bergeser, menu) selesai, lalu dua bingkai; paling lama
// 4 detik (gambar lazy di luar layar dan animasi tanpa akhir tidak ditunggu).
const settle = () => js(`(async () => {
  const docs = [document, ...[...document.querySelectorAll("iframe")].map((f) => f.contentDocument).filter(Boolean)];
  const seen = (i) => { const b = i.getBoundingClientRect(); return b.bottom > 0 && b.top < innerHeight && b.width > 0; };
  const ready = Promise.all([...docs.map((d) => d.fonts.ready), ...docs.flatMap((d) => [...d.images].filter((i) => !i.complete && seen(i)).map((i) => new Promise((r) => { i.addEventListener("load", r); i.addEventListener("error", r); }))),
    ...docs.flatMap((d) => d.getAnimations().filter((a) => a.effect && a.effect.getTiming().iterations !== Infinity).map((a) => a.finished.catch(() => {})))]);
  await Promise.race([ready, new Promise((r) => setTimeout(r, 4000))]);
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  return true;
})()`);
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
async function shot(name, spec = {}, extra = {}) {
  await settle();
  await sleep(250);
  const r = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(OUT, name + ".png"), Buffer.from(r.data, "base64"));
  manifest.layar[name] = { kotak: await js(`(${KOTAK})(${JSON.stringify(spec)})`), ...extra };
  console.log("layar", name, Object.keys(manifest.layar[name].kotak).join(" "));
}
const share = (expr) => js(`(() => { const d = [...document.querySelectorAll("iframe")].find((f) => f.title === "Kirim undangan").contentDocument; return (${expr})(d); })()`);
const tap = (sel) => js(`document.querySelector(${JSON.stringify(sel)}).click()`);

// 1. Sampul undangan dengan nama tamu, dan potongan persegi sampul tanpa nama untuk gambar pratinjau tautan.
await send("Page.navigate", { url: DEMO });
await until(`document.readyState === "complete"`, "demo undangan");
await sleep(2500);
await settle();
{
  const r = await send("Page.captureScreenshot", { format: "png" });
  const tmp = path.join(prof, "og.png");
  fs.writeFileSync(tmp, Buffer.from(r.data, "base64"));
  // Persegi dari atas sampul (judul, nama pasangan, tanggal), 600 px seperti gambar SEO.
  const ogPath = path.join(OUT, "pratinjau.jpg");
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", tmp, "-vf", `crop=${HP.width * 3}:${HP.width * 3}:0:${60 * 3},scale=600:600`, "-q:v", "3", ogPath]);
  ogJpeg = fs.readFileSync(ogPath);
}
const linkTamu = `${LINK}?to=${encodeURIComponent(PILIH).replace(/%20/g, "+")}&u=${kode(PILIH)}`;
await send("Page.navigate", { url: `${DEMO}?to=${encodeURIComponent(PILIH)}&u=${kode(PILIH)}` });
await until(`document.readyState === "complete" && document.body.textContent.includes(${JSON.stringify(PILIH)})`, "nama tamu di sampul");
await sleep(2500);
await shot("undangan-sampul", { nama: `.inv-cover__guest|${PILIH}`, kepada: ".inv-cover__to" }, { url: linkTamu });

// 2. Masuk dashboard: link kedua dari pesan serah terima (?w= dan link), PIN, Masuk.
await send("Fetch.enable", { patterns: [{ urlPattern: OG.replace(/[^/]*$/, "*") }] });
const KELOLA = `/kelola?w=${W}&link=${encodeURIComponent(LINK)}`;
await send("Page.navigate", { url: `http://127.0.0.1:${PORT}${KELOLA}` });
await until(`!!document.getElementById("pinInput") && !document.getElementById("gate").hidden`, "gerbang PIN");
const GERBANG = { pin: "#pinInput", masuk: "#gateSubmit", kartu: "#gate .card" };
await shot("gerbang", GERBANG, { url: `tokomu.myscalev.com${KELOLA}` });
await js(`document.getElementById("pinInput").focus()`);
for (let i = 1; i <= 6; i++) {
  await send("Input.insertText", { text: PIN[i - 1] });
  await shot("gerbang-pin-" + i, GERBANG);
}
await tap("#gateSubmit");
await until(`document.getElementById("gate").hidden && document.getElementById("loading").hidden && (() => { const f = [...document.querySelectorAll("iframe")].find((f) => !f.hidden); const v = f && f.contentDocument.getElementById("homeView"); return v && !v.hidden && f.contentDocument.getElementById("attendanceTotal").textContent !== "0"; })()`, "Beranda");
const TAB = { "tab-beranda": '.tab[data-tab="beranda"]', "tab-kirim": '.tab[data-tab="kirim"]', "tab-tamu": '.tab[data-tab="tamu"]', akun: "#meBtn" };
await shot("beranda", TAB);

// 3. Tab Kirim: daftar kosong, tombol tambah hijau kanan bawah; tampilan laptop untuk tombol di kepala daftar.
await tap('.tab[data-tab="kirim"]');
await until(`(() => { const f = [...document.querySelectorAll("iframe")].find((f) => f.title === "Kirim undangan" && !f.hidden); const e = f && f.contentDocument.getElementById("empty"); return e && !e.hidden && e.textContent.includes("Belum ada tamu") && document.getElementById("loading").hidden; })()`, "Kirim kosong");
// Tunggu toast "Berhasil masuk." hilang (2,5 detik) supaya layar bersih.
await sleep(2800);
await shot("kirim-kosong", { ...TAB, fab: "share:#fabAdd", kosong: "share:#empty" });
// Tampilan laptop (1280x800, mouse) untuk sisipan; sesudahnya kembali ke HP.
const laptop = async () => {
  await send("Emulation.setTouchEmulationEnabled", { enabled: false });
  await send("Emulation.setUserAgentOverride", { userAgent: UA_HP.replace("Linux; Android 14; Pixel 8", "Windows NT 10.0; Win64; x64").replace(" Mobile", ""), platform: "Win32" });
  await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 800, deviceScaleFactor: 2, mobile: false });
  await sleep(800);
};
await laptop();
await shot("kirim-laptop", { tambah: "share:#addBtn", daftar: "share:.side" }, { viewport: [1280, 800] });
await hp();
await sleep(800);

// 4. Panel Tambah tamu: contoh di kolom (placeholder), lalu daftar ditempel.
await share(`(d) => d.getElementById("fabAdd").click()`);
await until(`(() => { const d = [...document.querySelectorAll("iframe")].find((f) => f.title === "Kirim undangan").contentDocument; return !d.getElementById("addDrawer").hidden; })()`, "panel Tambah tamu");
await share(`(d) => d.getElementById("guests").blur()`);
// Kotak tiap bagian baris contoh di placeholder (bukan elemen): cermin kolom dengan gaya huruf, padding, dan lebar yang
// sama di posisi yang sama, tiap bagian satu <span>, lalu diukur. Ikut terbungkus bila baris lebih lebar dari kolom.
await settle();
const contoh = await share(`(d) => {
  const ta = d.getElementById("guests"), cs = d.defaultView.getComputedStyle(ta), r = ta.getBoundingClientRect(), f = [...document.querySelectorAll("iframe")].find((f) => f.title === "Kirim undangan").getBoundingClientRect();
  const m = d.createElement("div");
  for (const p of ["fontFamily", "fontSize", "fontWeight", "fontStyle", "lineHeight", "letterSpacing", "wordSpacing", "textIndent", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
    "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth", "boxSizing", "overflowWrap", "wordBreak", "tabSize"]) m.style[p] = cs[p];
  Object.assign(m.style, { position: "fixed", left: r.left + "px", top: r.top + "px", width: r.width + "px", visibility: "hidden", whiteSpace: "pre-wrap", borderStyle: "solid", borderColor: "transparent", margin: "0" });
  const spans = {};
  ta.placeholder.split("\\n").forEach((line, i) => {
    const row = d.createElement("span"); spans["baris-" + (i + 1)] = row;
    line.split(" - ").forEach((part, j) => { if (j) row.append(" - "); const s = d.createElement("span"); s.textContent = part; spans["baris-" + (i + 1) + "-" + (j + 1)] = s; row.append(s); });
    m.append(row, "\\n");
  });
  d.body.append(m);
  const out = Object.fromEntries(Object.entries(spans).map(([k, s]) => { const b = s.getBoundingClientRect(); return [k, [b.left + f.left, b.top + f.top, b.width, b.height].map((n) => Math.round(n * 10) / 10)]; }));
  m.remove();
  return out;
}`);
const PANEL_TAMBAH = { kolom: "share:#guests", label: 'share:label[for="guests"]', petunjuk: "share:#addDrawer .hint", simpan: "share:#generate", csv: 'share:#addDrawer label[for="csvFile"]', kembali: "share:#addDrawer [data-close]" };
await shot("tambah-kosong", PANEL_TAMBAH);
Object.assign(manifest.layar["tambah-kosong"].kotak, contoh);
await share(`(d) => { const ta = d.getElementById("guests"); ta.value = ${JSON.stringify(TAMU)}; ta.dispatchEvent(new Event("input", { bubbles: true })); ta.scrollTop = 0; }`);
await shot("tambah-isi", PANEL_TAMBAH);

// 5. Simpan daftar: link pribadi tiap tamu dibuat, daftar seperti daftar chat.
await share(`(d) => d.getElementById("generate").click()`);
await until(`(() => { const d = [...document.querySelectorAll("iframe")].find((f) => f.title === "Kirim undangan").contentDocument; return d.querySelectorAll("#guestBody .row").length === 6 && d.getElementById("addDrawer").hidden; })()`, "daftar tamu");
const names = TAMU.split("\n").map((l) => l.split(" - ")[0]);
const DAFTAR = { ...TAB, fab: "share:#fabAdd", cari: "share:#search", semua: 'share:[data-filter="all"]', belum: 'share:[data-filter="pending"]', terkirim: 'share:[data-filter="sent"]',
  ...Object.fromEntries(names.map((n, i) => ["tamu-" + (i + 1), `share:#guestBody .row|${n}`])), toast: "share:#status" };
await shot("daftar-toast", DAFTAR);
await sleep(2800);
await shot("daftar", DAFTAR);
// Di HP baris tamu terpotong ("Sahabat…"); di laptop terlihat utuh (nomor · kategori · jumlah orang) untuk sisipan.
await laptop();
await shot("daftar-laptop", { "tamu-3": "share:#guestBody .row|Dewi Lestari", "tamu-3-sub": "share:#guestBody .row .l2|Sahabat · 2 orang" }, { viewport: [1280, 800] });
await hp();
await sleep(800);
// Kategori bisa dicari: kolom Cari tamu berisi "Sahabat".
const cari = (teks) => share(`(d) => { const s = d.getElementById("search"); s.value = ${JSON.stringify(teks)}; s.dispatchEvent(new Event("input", { bubbles: true })); s.blur(); }`);
await cari("Sahabat");
await shot("daftar-cari", { cari: "share:#search", "tamu-3": "share:#guestBody .row|Dewi Lestari", "tamu-5": "share:#guestBody .row|Sari Wulandari" });
await cari("");
await sleep(300);

// 6. Percakapan tamu tanpa nomor: pratinjau pesan dengan kartu tautan, pilihan teks, status, kirim.
await share(`(d) => [...d.querySelectorAll("#guestBody .row")].find((r) => r.textContent.includes(${JSON.stringify(PILIH)})).click()`);
await until(`(() => { const d = [...document.querySelectorAll("iframe")].find((f) => f.title === "Kirim undangan").contentDocument; return !d.getElementById("chat").hidden && d.querySelector("#thread .lp img") && d.querySelector("#thread .lp img").complete; })()`, "percakapan tamu");
// Di HP seluruh percakapan (gelembung lalu kotak pesan) bergulir di #chat; pilihan teks dan status menempel di bawah kepala.
const CHAT = { kembali: "share:#chatBar [data-back]", nama: "share:#chatName", sub: "share:#chatSub", menu: 'share:#chatBar [aria-controls="chatMenu"]', hari: "share:#thread .day", gelembung: "share:#thread .bubble",
  kartu: "share:#thread .lp", gambar: "share:#thread .lp img", "kartu-teks": "share:#thread .lp div", "nama-tamu": `share:#thread .bubble b|${PILIH}`, "link-tamu": "share:#thread .bubble a",
  pilihan: "share:.tpls", status: "share:#msgReady", pesan: "share:#message", kirim: "share:#sendBtn", periksa: "share:#msgHint",
  "periksa-link": "share:#msgHint .hr|[link-undangan] jadi", "periksa-nama": "share:#msgHint .hr|[nama] jadi", "periksa-bebas": "share:#msgHint .hr|Kalimat",
  ...Object.fromEntries(["formal", "muslim", "nasrani", "hindu", "custom"].map((k) => ["teks-" + k, `share:#templateButtons [data-template="${k}"]`])) };
const gulir = (to) => share(`(d) => { const c = d.getElementById("chat"), a = d.querySelector("#thread .bubble a");
  c.scrollTop = ${JSON.stringify(to)} === "atas" ? 0 : ${JSON.stringify(to)} === "bawah" ? c.scrollHeight : a.offsetTop - c.clientHeight / 2; return [c.scrollTop, c.scrollHeight, c.clientHeight]; }`);
manifest.gulir = { atas: await gulir("atas") };
await shot("chat", CHAT);
manifest.gulir.link = await gulir("link");
await shot("chat-link", CHAT);
manifest.gulir.bawah = await gulir("bawah");
await shot("chat-bawah", CHAT);

// 7. Tombol kirim: WhatsApp dibuka (dicatat, tidak dibuka), tamu langsung ditandai Terkirim; menu ⋮ Tandai belum dikirim.
await share(`(d) => { d.defaultView.open = (u) => { d.defaultView.__wa = u; return null; }; d.getElementById("sendBtn").click(); }`);
await until(`(() => { const d = [...document.querySelectorAll("iframe")].find((f) => f.title === "Kirim undangan").contentDocument; return d.querySelector("#thread .day").textContent.startsWith("Terkirim"); })()`, "Terkirim");
const wa = await share(`(d) => d.defaultView.__wa`);
const waText = new URL(wa).searchParams.get("text");
await shot("chat-terkirim-bawah", { ...CHAT, toast: "share:#status" }, { wa, pesan: waText, link: linkTamu });
await sleep(2800);
await gulir("atas");
await shot("chat-terkirim", CHAT);
await share(`(d) => d.querySelector('#chatBar [aria-controls="chatMenu"]').click()`);
await until(`(() => { const d = [...document.querySelectorAll("iframe")].find((f) => f.title === "Kirim undangan").contentDocument; return !d.getElementById("chatMenu").hidden; })()`, "menu tamu");
await shot("chat-menu", { ...CHAT, "menu-buka": "share:#chatMenu", "belum-dikirim": 'share:#chatMenu [data-act="toggle-sent"]' });
await share(`(d) => d.querySelector('#chatBar [aria-controls="chatMenu"]').click()`);
await sleep(300);

// 8. Kembali ke daftar: tamu tadi bercentang dua; saringan Belum dikirim.
await share(`(d) => d.querySelector("#chatBar [data-back]").click()`);
await until(`(() => { const d = [...document.querySelectorAll("iframe")].find((f) => f.title === "Kirim undangan").contentDocument; return d.getElementById("chat").hidden || d.querySelector("#guestBody .row .tick"); })()`, "daftar lagi");
await sleep(2800);
await shot("daftar-terkirim", DAFTAR);
await share(`(d) => d.querySelector('[data-filter="pending"]').click()`);
await sleep(400);
await shot("daftar-belum", DAFTAR);

fs.writeFileSync(path.join(here, "layar.json"), JSON.stringify(manifest, null, 1) + "\n");
console.log(`selesai: ${Object.keys(manifest.layar).length} layar → ${path.relative(REPO, OUT)}`);
ws.close(); chrome.kill(); server.close(); await sleep(400);
fs.rmSync(prof, { recursive: true, force: true, maxRetries: 5 });
