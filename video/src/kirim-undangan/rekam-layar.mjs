// npm run layar  →  public/kirim-undangan/layar/*.png (isi Safari iPhone 402x728, 3x; MacBook 1280x751, 2x) dan
// layar.json (kotak elemen per layar). Tampilan asli: halaman dashboard hasil build (server/pages/panel/scalev_panel.html,
// berisi Beranda, Kirim, Hari-H) dibuka di Chrome tanpa jendela dengan profil Safari iPhone. API worker diganti tiruan
// lokal (data contoh, tanpa menyentuh produksi); sampul undangan dari demo template di R2. Urutan langkah = alur di
// naskah.js. Jalankan ulang bila halaman Kirim berubah.
// npm run uji  →  uji daftar tamu dengan data terburuk (break-ui): out/uji/*.png, temuan di konsol, lalu server tetap
// jalan dengan pengalih data di bawah tengah layar (?data=demo|terburuk|kosong|satu|seribu). Hanya ada di alat ini.
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

// Data contoh panduan: Rani & Dimas di nikahin.id, demo template Garden Stroll.
const W = "365671", LINK = "https://nikahin.id/rani-dimas", PIN = "482913", COUPLE = "Rani & Dimas";
const DEMO = "https://assets.nikahin.workers.dev/brand-assets/templates/garden-stroll/demo.html";
const OG = "https://nikahin.id/og/rani-dimas.jpg";
const SEKARANG = Date.parse("2026-11-25T19:42:00+07:00");
const TAMU = [
  "Budi",
  "Keluarga Besar Surya",
  "Bapak Andi & Ibu Rina - 081234567890",
  "Dewi Lestari - 082198765432 - Sahabat - 2",
  "Om Hendra & Tante Lia - 081355512345 - Keluarga - 2",
  "Sari Wulandari - 085711223344 - Sahabat",
  "Tim Marketing PT Sinar Jaya - Kantor - 5",
].join("\n");
const PILIH = "Keluarga Besar Surya";
// Safari iPhone (layar 402x874 pt): isi web di antara bilah status (62) dan bilah Safari bawah (84).
const HP = { width: 402, height: 728, deviceScaleFactor: 3, mobile: true };
const UA_HP = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1";
// MacBook (layar 1280x828 pt, "teks lebih besar"): isi web di bawah bilah menu (25) dan bilah Safari (52).
const MAC = { width: 1280, height: 751, deviceScaleFactor: 2, mobile: false };
const UA_MAC = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15";
const UJI = process.argv.includes("--uji");
// Data uji daftar tamu: nilai yang masuk akal dari pengantin sungguhan, termasuk yang paling buruk.
const DATA = {
  demo: TAMU,
  terburuk: [
    "Budi",
    "Keluarga Besar Bapak H. Muhammad Ridwan Syahputra, S.E., M.M. beserta Istri dan Anak-anak - 0812 3456 7890 - Keluarga Besar dari Pihak Mempelai Wanita (Bandung) - 10",
    "🌸 Bude Sri",
    "Ma'ruf & Nur'aini",
    "dr. Andreas Wijaya Kusuma, Sp.OG - +62 811-2233-4455 - Rekan Kerja RS - 2",
    "Dewi Lestari - 0821 9876 5432 - Sahabat - 2 orang",
    "081298765432",
    "Andi - 081111111111",
    "Andi - 082222222222",
    "Tim Marketing PT Sinar Jaya Abadi Sentosa Tbk. - Kantor - 150",
    "Muhammadrizkyalfarizipratamaputra",
    "Ibu Hj. Siti Nurhaliza binti Abdullah - 0857-1122-3344 - Pengajian Ibu-ibu Al-Hikmah Perumahan Griya Asri Blok C - 25",
  ].join("\n"),
  kosong: "",
  satu: "Budi",
  seribu: Array.from({ length: 1200 }, (_, i) => `Tamu Undangan ${i + 1} - 0812${String(10000000 + i).slice(-8)} - ${["Keluarga", "Kantor", "Sahabat"][i % 3]} - ${1 + (i % 4)}`).join("\n"),
};
// Tamu yang ditandai terkirim lewat menu percakapan (awal nama).
const TERKIRIM = { terburuk: ["Budi", "Keluarga Besar Bapak"], seribu: ["Tamu Undangan 1"] };
// Skrip uji di halaman (hanya bila ?data=): pengalih data di bawah tengah, lalu data dimasukkan lewat jalur pengguna:
// PIN, tab Kirim, tempel di panel Tambah tamu, Simpan daftar, menu titik tiga > Tandai terkirim. &tangkap=1 menyembunyikan
// pengalihnya untuk tangkapan layar.
const UJI_HALAMAN = `(() => {
  const DATA = ${JSON.stringify(DATA)}, TERKIRIM = ${JSON.stringify(TERKIRIM)}, PIN = ${JSON.stringify(PIN)};
  const q = new URLSearchParams(location.search), kunci = q.get("data");
  if (!(kunci in DATA)) return;
  if (!q.get("tangkap")) addEventListener("DOMContentLoaded", () => {
    const bar = document.createElement("div");
    bar.setAttribute("role", "group"); bar.setAttribute("aria-label", "Data uji daftar tamu");
    bar.style.cssText = "position:fixed;left:50%;bottom:12px;transform:translateX(-50%);z-index:2147483647;display:flex;gap:2px;padding:3px;border-radius:999px;background:rgba(17,17,17,.9);box-shadow:0 4px 14px rgba(0,0,0,.3);font:600 12px/1 system-ui,sans-serif";
    for (const [k, label] of [["demo", "Demo"], ["terburuk", "Terburuk"], ["kosong", "Kosong"], ["satu", "Satu"], ["seribu", "1.000+"]]) {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = label; b.setAttribute("aria-pressed", String(k === kunci));
      b.style.cssText = "border:0;border-radius:999px;padding:9px 12px;cursor:pointer;color:#fff;font:inherit;background:" + (k === kunci ? "#b8460d" : "transparent");
      b.onclick = () => { localStorage.clear(); sessionStorage.clear(); const u = new URL(location.href); u.searchParams.set("data", k); location.href = u.toString(); };
      bar.append(b);
    }
    document.body.append(bar);
  });
  const tunggu = async (f, ms = 30000) => {
    for (const t = Date.now() + ms; Date.now() < t; await new Promise((r) => setTimeout(r, 80))) { try { const v = f(); if (v) return v; } catch (e) {} }
    throw new Error("uji: tidak muncul " + f);
  };
  const terlihat = (el) => !!el && el.getClientRects().length > 0 && el.ownerDocument.defaultView.getComputedStyle(el).visibility !== "hidden";
  (async () => {
    const pin = await tunggu(() => document.getElementById("pinInput"));
    await tunggu(() => !document.getElementById("gate").hidden || document.getElementById("loading").hidden);
    if (!document.getElementById("gate").hidden) {
      pin.value = PIN; pin.dispatchEvent(new Event("input", { bubbles: true }));
      document.getElementById("gateSubmit").click();
    }
    await tunggu(() => document.getElementById("gate").hidden && document.getElementById("loading").hidden);
    document.querySelector('.tab[data-tab="kirim"]').click();
    const d = await tunggu(() => { const f = [...document.querySelectorAll("iframe")].find((f) => f.title === "Kirim undangan" && !f.hidden); return f && f.contentDocument.getElementById("guestBody") && !f.contentDocument.getElementById("empty").hidden && f.contentDocument; });
    if (DATA[kunci]) {
      (terlihat(d.getElementById("fabAdd")) ? d.getElementById("fabAdd") : d.getElementById("addBtn")).click();
      await tunggu(() => !d.getElementById("addDrawer").hidden);
      const ta = d.getElementById("guests");
      ta.value = DATA[kunci]; ta.dispatchEvent(new Event("input", { bubbles: true }));
      d.getElementById("generate").click();
      await tunggu(() => d.getElementById("addDrawer").hidden && /tamu siap/.test(d.getElementById("status").textContent));
      for (const awal of TERKIRIM[kunci] || []) {
        [...d.querySelectorAll("#guestBody .row")].find((r) => { const n = r.querySelector(".nm").textContent; return n === awal || n.startsWith(awal + " "); }).click();
        await tunggu(() => !d.getElementById("chat").hidden);
        d.querySelector('#chatBar [aria-controls="chatMenu"]').click();
        await tunggu(() => !d.getElementById("chatMenu").hidden);
        d.querySelector('#chatMenu [data-act="toggle-sent"]').click();
        await tunggu(() => d.querySelector("#thread .day").textContent.startsWith("Terkirim"));
        const kembali = d.querySelector("#chatBar [data-back]");
        if (terlihat(kembali)) { kembali.click(); await tunggu(() => d.getElementById("chat").hidden || !terlihat(d.getElementById("chat"))); }
      }
    }
    window.__ujiSiap = true;
  })().catch((e) => { window.__ujiGagal = String(e); });
})();`;

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
  if (url.pathname === "/dashboard") {
    const html = fs.readFileSync(PANEL, "utf8").split(WORKER).join(`http://127.0.0.1:${server.address().port}/api`);
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(url.searchParams.has("data") ? html.replace(/<\/body>/i, `<script>${UJI_HALAMAN}</script></body>`) : html);
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
const chrome = spawn(CHROME, ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${prof}`, "--hide-scrollbars", "--force-color-profile=srgb", "--lang=id-ID", `--window-size=${HP.width},${HP.height}`, "about:blank"], { stdio: "ignore" });
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

// Semua dokumen (juga iframe srcdoc): jam tetap 25 Nov 2026 19.42 WIB. Huruf sistem = SF Pro, seperti Safari di iPhone.
await send("Page.enable");
await send("Page.addScriptToEvaluateOnNewDocument", { source: `(() => {
  const D = Date, shift = ${SEKARANG} - D.now();
  class F extends D { constructor(...a) { if (a.length) super(...a); else super(D.now() + shift); } static now() { return D.now() + shift; } }
  globalThis.Date = F;
})();` });
await send("Emulation.setTimezoneOverride", { timezoneId: "Asia/Jakarta" });
await send("Emulation.setLocaleOverride", { locale: "id-ID" });
const hp = async () => {
  await send("Emulation.setDeviceMetricsOverride", HP);
  await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
  await send("Emulation.setUserAgentOverride", { userAgent: UA_HP, platform: "iPhone" });
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
// Tampilan laptop (MacBook, tetikus) untuk sisipan dan uji; sesudahnya kembali ke HP dengan hp().
const laptop = async (vp = MAC) => {
  await send("Emulation.setTouchEmulationEnabled", { enabled: false });
  await send("Emulation.setUserAgentOverride", { userAgent: UA_MAC, platform: "MacIntel" });
  await send("Emulation.setDeviceMetricsOverride", vp);
  await sleep(800);
};

// ---- npm run uji: daftar tamu dengan data terburuk di empat lebar, fakta dari DOM ke out/uji/temuan.json ----
if (UJI) {
  const keluar = path.join(here, "..", "..", "out", "uji");
  fs.rmSync(keluar, { recursive: true, force: true });
  fs.mkdirSync(keluar, { recursive: true });
  const foto = async (nama) => {
    await settle();
    await sleep(250);
    fs.writeFileSync(path.join(keluar, nama + ".png"), Buffer.from((await send("Page.captureScreenshot", { format: "png" })).data, "base64"));
  };
  const ukur = (w, h, s) => async () => { await hp(); await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: s, mobile: true }); };
  // 320 = HP kecil, 402 = iPhone, zoom200 = iPhone diperbesar 200% (201 px CSS), 1280 = laptop.
  const LEBAR = [["320", ukur(320, 640, 2)], ["402", hp], ["zoom200", ukur(201, 364, 6)], ["1280", () => laptop({ ...MAC, height: 800 })]];
  const chatTerbuka = `(() => { const d = [...document.querySelectorAll("iframe")].find((f) => f.title === "Kirim undangan").contentDocument; return !d.getElementById("chat").hidden && d.querySelector("#thread .bubble"); })()`;
  const temuan = {};
  for (const kunci of Object.keys(DATA)) for (const [lebar, atur] of LEBAR) {
    await js("localStorage.clear(); sessionStorage.clear(); true").catch(() => {});
    await atur();
    await send("Page.navigate", { url: `http://127.0.0.1:${PORT}/dashboard?w=${W}&link=${encodeURIComponent(LINK)}&data=${kunci}&tangkap=1` });
    await until("window.__ujiSiap || window.__ujiGagal", `uji ${kunci} ${lebar}`, 120000);
    const gagal = await js("window.__ujiGagal || ''");
    if (gagal) throw new Error(`${kunci} ${lebar}: ${gagal}`);
    await sleep(2800);
    await foto(`${kunci}-${lebar}-daftar`);
    const f = temuan[`${kunci}-${lebar}`] = await share(`(d) => {
      const rows = [...d.querySelectorAll("#guestBody .row")], luap = (el) => Math.round(el.scrollWidth - el.clientWidth);
      // Tombol tambah (FAB) vs baris terakhir saat daftar digulir sampai habis: lebar yang tertutup (px).
      const list = d.getElementById("guestBody"), fab = d.getElementById("fabAdd");
      list.scrollTop = list.scrollHeight;
      const akhir = rows.at(-1) && rows.at(-1).getBoundingClientRect(), fb = fab.getBoundingClientRect();
      const tutup = akhir && fb.width ? Math.max(0, Math.min(akhir.right, fb.right) - Math.max(akhir.left, fb.left)) * (Math.min(akhir.bottom, fb.bottom) > Math.max(akhir.top, fb.top) ? 1 : 0) : 0;
      list.scrollTop = 0;
      return { baris: rows.length, semua: d.getElementById("countAll").textContent, luapKirim: luap(d.documentElement), luapDashboard: luap(document.documentElement),
        namaTerpotong: rows.filter((r) => luap(r.querySelector(".nm")) > 0).length, subTerpotong: rows.filter((r) => luap(r.querySelector(".pv")) > 0).length, fabMenutupiBarisAkhir: Math.round(tutup),
        tamu: rows.slice(0, 14).map((r) => ({ nama: r.querySelector(".nm").textContent, inisial: [...r.querySelector(".av").textContent].map((c) => c.codePointAt(0).toString(16)).join(" "),
          sub: r.querySelector(".pv").textContent, waktu: r.querySelector(".tm").textContent })) };
    }`);
    if (lebar !== "402") delete f.tamu;
    if (kunci === "terburuk") {
      await share(`(d) => [...d.querySelectorAll("#guestBody .row")].find((r) => r.querySelector(".nm").textContent.startsWith("Keluarga Besar Bapak")).click()`);
      await until(chatTerbuka, "percakapan nama panjang");
      await foto(`terburuk-${lebar}-chat`);
      f.kepalaTerpotong = await share(`(d) => { const n = d.getElementById("chatName"); return n.scrollWidth > n.clientWidth; }`);
      if (lebar === "402") {
        // Peringatan tempel di panel Tambah tamu: baris tanpa nama dilewati, nama kembar satu link.
        await share(`(d) => { const b = d.querySelector("#chatBar [data-back]"); if (b.getClientRects().length) b.click(); d.getElementById("fabAdd").click(); }`);
        await until(`(() => { const d = [...document.querySelectorAll("iframe")].find((f) => f.title === "Kirim undangan").contentDocument; return !d.getElementById("addDrawer").hidden; })()`, "panel Tambah tamu");
        await share(`(d) => d.getElementById("guests").blur()`);
        await foto(`terburuk-${lebar}-tempel`);
        f.peringatanTempel = await share(`(d) => d.getElementById("pasteWarn").hidden ? "" : d.getElementById("pasteWarn").textContent`);
        await share(`(d) => d.querySelector("#addDrawer [data-close]").click()`);
        await sleep(300);
        // Dua tamu bernama sama dengan nomor berbeda: link pribadinya.
        f.linkAndi = [];
        for (const i of [0, 1]) {
          await share(`(d) => { const b = d.querySelector("#chatBar [data-back]"); if (!d.getElementById("chat").hidden && b.getClientRects().length) b.click(); }`);
          await sleep(300);
          await share(`(d) => [...d.querySelectorAll("#guestBody .row")].filter((r) => r.querySelector(".nm").textContent === "Andi")[${i}].click()`);
          await until(chatTerbuka, "percakapan Andi");
          f.linkAndi.push(await share(`(d) => [d.getElementById("chatSub").textContent, d.querySelector("#thread .bubble a").href]`));
        }
        await share(`(d) => { const b = d.querySelector("#chatBar [data-back]"); if (b.getClientRects().length) b.click(); }`);
        await sleep(300);
        // Mencari nomor seperti yang diketik orang Indonesia (0812...) dan seperti yang tersimpan (62812...).
        f.cari = {};
        for (const kata of ["0812", "62812", "Sahabat", "orang"]) {
          f.cari[kata] = await share(`(d) => { const s = d.getElementById("search"); s.value = ${JSON.stringify(kata)}; s.dispatchEvent(new Event("input", { bubbles: true })); return d.querySelectorAll("#guestBody .row").length; }`);
        }
        await share(`(d) => { const s = d.getElementById("search"); s.value = "0812"; s.dispatchEvent(new Event("input", { bubbles: true })); s.blur(); }`);
        await foto(`terburuk-${lebar}-cari-0812`);
      }
    }
    if (kunci === "seribu") {
      f.masukan = DATA.seribu.split("\n").length;
      f.cariMs = await share(`(d) => { const s = d.getElementById("search"), t = performance.now(); s.value = "Tamu Undangan 99"; s.dispatchEvent(new Event("input", { bubbles: true })); return Math.round(performance.now() - t); }`);
    }
    console.log("uji", kunci, lebar, JSON.stringify({ ...f, tamu: undefined }));
  }
  fs.writeFileSync(path.join(keluar, "temuan.json"), JSON.stringify(temuan, null, 1) + "\n");
  ws.close(); chrome.kill();
  fs.rmSync(prof, { recursive: true, force: true, maxRetries: 5 });
  console.log(`selesai: ${Object.keys(temuan).length} tangkapan → ${path.relative(REPO, keluar)}`);
  if (process.argv.includes("--sekali")) { server.close(); process.exit(0); }
  console.log(`Pengalih data (Ctrl+C untuk berhenti): http://127.0.0.1:${PORT}/dashboard?w=${W}&link=${encodeURIComponent(LINK)}&data=terburuk`);
  await new Promise(() => {});
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
// Ikon aplikasi WhatsApp (App Store) untuk adegan buka aplikasi.
fs.writeFileSync(path.join(OUT, "whatsapp.webp"), Buffer.from(await (await fetch("https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/34/f8/4c/34f84cc3-89ca-8fa9-03c4-cef1327edd31/Placeholder.mill/400x400Icon.ApSiOS01-75.webp")).arrayBuffer()));

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
const KELOLA = `/dashboard?w=${W}&link=${encodeURIComponent(LINK)}`;
await send("Page.navigate", { url: `http://127.0.0.1:${PORT}${KELOLA}` });
await until(`!!document.getElementById("pinInput") && !document.getElementById("gate").hidden`, "gerbang PIN");
const GERBANG = { pin: "#pinInput", masuk: "#gateSubmit", kartu: "#gate .card" };
await shot("gerbang", GERBANG, { url: `nikahin.id${KELOLA}` });
await js(`document.getElementById("pinInput").focus()`);
for (let i = 1; i <= 6; i++) {
  await send("Input.insertText", { text: PIN[i - 1] });
  await shot("gerbang-pin-" + i, GERBANG);
}
await tap("#gateSubmit");
await until(`document.getElementById("gate").hidden && document.getElementById("loading").hidden && (() => { const f = [...document.querySelectorAll("iframe")].find((f) => !f.hidden); const v = f && f.contentDocument.getElementById("homeView"); return v && !v.hidden && f.contentDocument.getElementById("attendanceTotal").textContent !== "0"; })()`, "Beranda");
const TAB = { "tab-beranda": '.tab[data-tab="beranda"]', "tab-kirim": '.tab[data-tab="kirim"]', "tab-tamu": '.tab[data-tab="tamu"]', akun: "#meBtn" };
await shot("beranda", TAB);

// 3. Tab Kirim: daftar kosong, tombol tambah hijau kanan bawah; tampilan MacBook untuk tombol di kepala daftar.
await tap('.tab[data-tab="kirim"]');
await until(`(() => { const f = [...document.querySelectorAll("iframe")].find((f) => f.title === "Kirim undangan" && !f.hidden); const e = f && f.contentDocument.getElementById("empty"); return e && !e.hidden && e.textContent.includes("Belum ada tamu") && document.getElementById("loading").hidden; })()`, "Kirim kosong");
// Tunggu toast "Berhasil masuk." hilang (2,5 detik) supaya layar bersih.
await sleep(2800);
await shot("kirim-kosong", { ...TAB, fab: "share:#fabAdd", kosong: "share:#empty" });
await laptop();
await shot("kirim-laptop", { tambah: "share:#addBtn", daftar: "share:.side" }, { viewport: [MAC.width, MAC.height] });
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
await until(`(() => { const d = [...document.querySelectorAll("iframe")].find((f) => f.title === "Kirim undangan").contentDocument; return d.querySelectorAll("#guestBody .row").length === 7 && d.getElementById("addDrawer").hidden; })()`, "daftar tamu");
const names = TAMU.split("\n").map((l) => l.split(" - ")[0]);
const DAFTAR = { ...TAB, fab: "share:#fabAdd", cari: "share:#search", semua: 'share:[data-filter="all"]', belum: 'share:[data-filter="pending"]', terkirim: 'share:[data-filter="sent"]',
  ...Object.fromEntries(names.map((n, i) => ["tamu-" + (i + 1), `share:#guestBody .row|${n}`])), toast: "share:#status" };
await shot("daftar-toast", DAFTAR);
await sleep(2800);
await shot("daftar", DAFTAR);
// Di HP baris tamu terpotong ("Sahabat…"); di MacBook terlihat utuh (nomor · kategori · jumlah orang) untuk sisipan.
await laptop();
await shot("daftar-laptop", { dewi: "share:#guestBody .row|Dewi Lestari", "dewi-sub": "share:#guestBody .row .l2|Sahabat · 2 orang" }, { viewport: [MAC.width, MAC.height] });
await hp();
await sleep(800);
// Kategori bisa dicari: kolom Cari tamu berisi "Sahabat".
const cari = (teks) => share(`(d) => { const s = d.getElementById("search"); s.value = ${JSON.stringify(teks)}; s.dispatchEvent(new Event("input", { bubbles: true })); s.blur(); }`);
await cari("Sahabat");
await shot("daftar-cari", { cari: "share:#search", dewi: "share:#guestBody .row|Dewi Lestari", sari: "share:#guestBody .row|Sari Wulandari" });
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
