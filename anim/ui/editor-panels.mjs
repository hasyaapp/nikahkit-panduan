// The NikahKit editor panels that the guide shows with real content: the Template library (switch, search, category
// chips, template cards) and the Konten panel (sample note, Bahasa undangan, group accordions and each group's fields),
// plus the Media "Pilih foto" dialog and the Galeri rows. Boxes follow /tmp/ref/editor-metrics.json (cards 134x229,
// accordions 279x50, fields 253 wide; search 219, chips 263/297, cards 337, measured in Chromium); labels and sample
// values from nikahkit/src/fields.js, model.js (SAMPLE, SAMPLE_CHECKS), ui/panel-content.jsx, ui/panels-style.jsx,
// ui/fields.jsx, ui/App.jsx (MediaDialog, Toast). Template card thumbnails are drawn (the real ones are screenshots).
import { C, esc, rect, text, line, circle, para, clipped, shadow, icon, iconX, tw } from "../lib.mjs";
import { nkHead, nkRail, nkLabel, nkBtn, nkSwitch, nkDialogHead, scalevEditor } from "./kit.mjs";
import { SERIF, photo } from "./invitation.mjs";

export const ACCOUNT = "Tahunan"; // the account chip shows the member's plan
export const P = 88, PW = 279, I = 101, IW = 253; // panel content box; inside an open accordion

// Text with inline bold / underlined runs (link buttons, <b> in notes); parts: string | { t, w?, fill?, u? }.
export const rich = (x, y, parts, o = {}) => `<text x="${x}" y="${y}" font-size="${o.size ?? 12}" fill="${o.fill ?? C.faint}">${parts.map((p) => (typeof p === "string" ? esc(p) : `<tspan font-weight="${p.w ?? 700}" fill="${p.fill ?? C.strong}"${p.u ? ' text-decoration="underline"' : ""}>${esc(p.t)}</tspan>`)).join("")}</text>`;

// ---- Panel widgets at measured sizes ------------------------------------------------------------------------------
export const lbl = (x, y, s) => nkLabel(x, y + 12, s);
export const hintL = (x, y, lines, fill = C.faint) => para(x, y + 12, lines, { size: 12, fill, lh: 16 });
// Input / select / datetime / textarea (o.lines). focus: blue border + 3px soft ring; err: red border; sel: selected text.
export function inp(x, y, w, val, o = {}) {
  const h = o.h ?? 36, tail = o.select || o.icon ? 34 : 6;
  let s = (o.focus ? rect(x - 3, y - 3, w + 6, h + 6, { r: 6, fill: C.primarySoft }) : "") +
    rect(x + 0.5, y + 0.5, w - 1, h - 1, { r: 4, fill: C.white, stroke: o.err ? C.danger : o.focus ? C.primary : C.field, sw: o.focus || o.err ? 1.5 : 1 });
  if (o.sel && val) s += rect(x + 10, y + 8, tw(val, 14) + 2, 20, { fill: "#b4d7fe" });
  if (o.lines) s += clipped(x + 2, y + 2, w - 4, h - 4, para(x + 11, y + 22, o.lines, { size: 14, fill: C.strong, lh: 17 }));
  else if (val) s += clipped(x + 2, y + 2, w - tail, h - 4, text(x + 11, y + h / 2 + 5, val, { size: 14, fill: o.ph ? C.faint : C.strong }));
  if (o.select) s += icon("chevron-down", x + w - 16, y + h / 2, 16, C.text);
  if (o.icon) s += icon(o.icon, x + w - 20, y + h / 2, 16, C.strong);
  return s;
}
// Typing into a cleared, focused input: [box, typed text, type spec for a step's `type`].
export const typeIn = (x, y, w, val) => [inp(x, y, w, "", { focus: true }), text(x + 11, y + 23, val, { size: 14, fill: C.strong }), { n: val.length, box: [x + 10, y + 7, tw(val, 14) + 2, 22] }];
const badge = (xr, y, label, ok = true) => { const w = Math.round(label.length * 4.6 + 9); return rect(xr - w, y, w, 18, { r: 9, fill: ok ? C.okSoft : C.warnSoft }) + text(xr - w / 2, y + 12.5, label, { size: 10, weight: 500, fill: ok ? C.ok : C.warnStrong, anchor: "middle" }); };
// Konten accordion (nk-acc) at the panel's left: 50px bar, chevron, title, status badge; open = body height h below a hairline.
export function acc(y, title, b, h) {
  return rect(P + 0.5, y + 0.5, PW - 1, (h ?? 50) - 1, { r: 4, fill: C.white, stroke: C.line }) + (h ? line(P + 1, y + 50.5, P + PW - 1, y + 50.5) : "") +
    icon(h ? "chevron-down" : "chevron-right", P + 22, y + 25, 18, C.strong) + text(P + 43, y + 30, title, { size: 14, weight: 500 }) + (b ? badge(P + 266, y + 16, b, b === "Terisi") : "");
}
export const quietBlock = (x, y, w, label, ic) => nkBtn(x, y, label, { variant: "quiet", w, icon: ic });
// Vertical stack of fields (nk-field: label 16 + gap 4 + control, hint +8, margin 12). c.at: label -> top y of its field.
export function col(x, y, w) {
  let s = "";
  const c = {
    at: {},
    get y() { return y; }, get svg() { return s; },
    add(str, h = 0) { s += str; y += h; return c; },
    field(l, v, o = {}) {
      const h = o.h ?? 36;
      c.at[l] = y;
      s += lbl(x, y, l) + inp(x, y + 20, w, v, o);
      let used = 20 + h;
      if (o.err) { s += text(x, y + used + 15, o.err, { size: 12, fill: C.danger }); used += 20; }
      else if (o.hint) { s += hintL(x, y + used + 8, o.hint); used += 8 + o.hint.length * 16; }
      y += used + 12; return c;
    },
    area(l, lines, rows = 2) { return c.field(l, "", { lines, h: rows * 17 + 14 }); },
    toggle(l, on, hint) {
      const ls = [].concat(l);
      s += para(x, y + 25 - (ls.length - 1) * 10, ls, { size: 14, fill: C.text, lh: 20 }) + nkSwitch(x + w - 36, y + 10, on);
      y += 48;
      if (hint) { s += hintL(x, y - 6, hint); y += -6 + hint.length * 16 + 12; }
      return c;
    },
    h3(t) { y += 12; s += text(x, y + 12, t, { size: 12, weight: 700 }); y += 24; return c; },
    lead(t) { s += text(x, y + 12, t, { size: 12, fill: C.faint }); y += 28; return c; },
    // Photo field (nk-photo): label, 96px thumb, button (Ganti foto; Pilih foto when empty).
    photo(l, k, btn = "Ganti foto") { c.at[l] = y; s += lbl(x, y, l) + (k === null ? "" : photo(x, y + 20, 96, 96, k, 4)) + quietBlock(x, y + (k === null ? 20 : 124), w, btn, "image"); y += k === null ? 68 : 172; return c; }
  };
  return c;
}
// List item (nk-item): page-grey box, bar with title and up/down/trash icon buttons.
export const itemBar = (y, title, first, last) => text(I + 10, y + 28, title, { size: 12, weight: 700 }) +
  icon("chevron-up", I + IW - 100, y + 24, 18, first ? "rgba(91,102,117,.35)" : C.text) + icon("chevron-down", I + IW - 62, y + 24, 18, last ? "rgba(91,102,117,.35)" : C.text) + icon("trash", I + IW - 24, y + 24, 18, C.text);
export const itemBox = (y, h) => rect(I + 0.5, y + 0.5, IW - 1, h - 1, { r: 4, fill: C.page, stroke: C.line });
// List item built by build(col) inside c; its field tops join c.at (first occurrence wins).
export function item(c, title, build, first, last) {
  const y0 = c.y, f = col(I + 10, y0 + 48, IW - 20); build(f);
  const h = f.y - y0 - 2;
  c.at[title] = y0; for (const [k, v] of Object.entries(f.at)) if (!(k in c.at)) c.at[k] = v;
  return c.add(itemBox(y0, h) + itemBar(y0, title, first, last) + f.svg, h + 8);
}
// The panel body below the head (72,153 327x747): its white background, and content clipped to it.
export const panelBg = () => rect(72, 153, 327, 747, { fill: C.white });
export const panelBody = (...kids) => clipped(72, 153, 327, 747, ...kids);
// The Scalev bars and panel head drawn over a scrolling panel body (content slides under them).
export const lid = (rail, o = {}) => clipped(72, 0, 327, 153, scalevEditor(0, 0, { rail }), nkHead(0, 0, rail, { account: ACCOUNT, ...o }));
// Rail before a template is picked: only Template and Media open; Bagikan and Kosongkan disabled.
export const LOCKED = [160, 216, 328, 384].map((y) => rect(0, y, 71, 52, { fill: C.page, opacity: 0.62 })).join("") + rect(0, 560, 71, 50, { fill: C.page, opacity: 0.62 }) + rect(0, 750, 71, 46, { fill: C.page, opacity: 0.62 });

// ---- Konten panel --------------------------------------------------------------------------------------------------
// Sample-data warning at the top of Konten (sampleFields: 6 checks, the button names the first left).
const sampleNote = (left, link) => rect(P, 169, PW, 64, { r: 4, fill: C.warnSoft }) + text(P + 12, 192, `${left} isian masih contoh. Ganti sebelum terbit.`, { size: 12, fill: C.warnStrong }) +
  text(P + 12, 218, link, { size: 12, weight: 500, fill: C.strong, underline: true });
// Konten groups in panel order (nikahkit/src/fields.js GROUPS, labels from model.js META).
export const GRP = ["Sampul", "Mempelai", "Acara & Tanggal", "Salam Pembuka", "Ayat / Kutipan", "Kisah Cinta", "Galeri Foto", "Video", "Dress Code", "Susunan Acara",
  "RSVP & Ucapan", "Siaran Langsung", "Filter Kamera", "Amplop Digital", "Aturan Tamu", "Turut Mengundang", "Salam Penutup", "Kaki Halaman"];
// Konten panel body: the head (sample note, Bahasa undangan, Lapisan line) when from = 0, then the accordions from GRP[from];
// open: title of the open group, fill(c) adds its fields to a col; todo: groups marked Belum diisi; dy: panel scrolled by dy;
// raw: no clip (a scroll element under lid()). Returns the svg, each bar's y and the open group's field tops (f), all in
// scrolled coordinates.
export function kList({ from = 0, top = 169, left = 6, link = "Ganti nama mempelai wanita", open, fill, todo = [], dy = 0, raw = false } = {}) {
  let s = "", y = top;
  if (!from) {
    const c = col(P, left ? 245 : 169, PW);
    if (left) s += sampleNote(left, link);
    c.field("Bahasa undangan", "Indonesia", { select: true, hint: ["Hanya halaman tamu. Teks bawaan ikut berganti;", "teks yang sudah diubah tetap."] });
    s += c.svg + rich(P, c.y + 12, ["Urutan dan tampilan bagian di ", { t: "Lapisan", w: 500, u: true }, "."]);
    y = c.y + 28;
  }
  const at = {}, f = {};
  for (const t of GRP.slice(from)) {
    if (y - dy > 3000) break;
    at[t] = y - dy;
    const b = todo.includes(t) ? "Belum diisi" : "Terisi";
    if (t !== open) { s += acc(y, t, b); y += 58; continue; }
    const c = col(I, y + 54, IW); fill(c);
    for (const [k, v] of Object.entries(c.at)) f[k] = v - dy;
    const h = c.y - y; s += acc(y, t, b, h) + c.svg; y += h + 8;
  }
  const g = dy ? `<g transform="translate(0 ${-dy})">${s}</g>` : s;
  return { svg: raw ? rect(72, -2000, 327, 5000, { fill: C.white }) + g : panelBody(panelBg(), g), at, f };
}
// A Konten list placed so that group t's bar sits at y (the panel scrolled to it), with enough groups above to reach the head.
export const kListAt = (t, y, o = {}) => { const i = GRP.indexOf(t), from = Math.max(1, i - Math.ceil((y - 153) / 58)); return kList({ ...o, from, top: y - 58 * (i - from) }); };

// Group fields (fields from nikahkit/src/fields.js, sample values from model.js SAMPLE); each fillX adds to a col.
export const fillMempelai = (nick = "Rani") => (c) => c.field("Judul", "Mempelai", { ph: true }).field("Urutan nama", "Wanita dulu", { select: true }).h3("Mempelai Wanita")
  .field("Nama panggilan", nick, { hint: ["Tampil di sampul."] }).field("Nama lengkap dan gelar", "Rani Ayu, S.Psi.").field("Profesi atau bio singkat (opsional)", "Psikolog")
  .field("Anak ke- (opsional)", "Putri kedua", { hint: ["Kosong: \"Putri dari\" / \"Putra dari\"."] }).field("Nama ayah", "Ahmad").toggle("Ayah sudah wafat (Alm.)", false)
  .field("Nama ibu", "Siti").toggle("Ibu sudah wafat (Almh.)", true);
// Sample events: name, start, end, place, address, map link, note.
export const EVS = [["Akad Nikah", "14/02/2027, 08.00", "", "Masjid Al-Ikhlas", "Jl. Melati 1, Jakarta", "https://maps.google.com/?q=Kebayoran+Baru", "Khusus keluarga inti"],
  ["Resepsi", "14/02/2027, 11.00", "14/02/2027, 14.00", "Gedung Sejahtera", "Jl. Melati 10, Jakarta", "https://maps.google.com/?q=Kebayoran+Baru", "Parkir di basement"],
  ["Ngunduh Mantu", "21/02/2027, 10.00", "21/02/2027, 13.00", "Rumah Bpk. Budi", "Jl. Mawar 5, Depok", "https://maps.google.com/?q=Depok", "Acara keluarga"]];
export const fillAcara = (list) => (c) => {
  c.field("Zona waktu", "WIB", { select: true }).field("Acara utama", "Akad Nikah", { select: true, hint: ["Acuan tanggal sampul, Simpan Tanggal,", "Hitung Mundur, dan kalender. Tanpa", "tanggal: acara pertama yang bertanggal."] });
  list.forEach((e, i) => item(c, e[0], (f) => f.field("Nama acara", e[0]).field("Mulai", e[1], { icon: "calendar" })
    .field("Selesai (opsional)", e[2] || "hh/bb/tttt, --.--", { icon: "calendar", ph: !e[2] }).field("Nama tempat atau gedung", e[3])
    .area("Alamat lengkap", [e[4]]).field("Tautan peta", e[5]).area("Catatan (opsional)", [e[6]]), i === 0, i === list.length - 1));
  c.at["Tambah acara"] = c.y;
  c.add(quietBlock(I, c.y, IW, "Tambah acara", "plus"), 48).toggle("Tampilkan peta di kartu acara", true, ["Butuh tautan Google Maps dan alamat."]);
};
export const fillSampul = (c) => c.add(hintL(I, c.y, ["Nama dan tanggal diambil dari", "Mempelai dan Acara."]), 44).photo("Foto sampul", 6).photo("Foto slideshow (opsional, maks. 4)", 2, "Tambah foto");
export const fillSalam = (c) => c.field("Preset salam", "Islam", { select: true, hint: ["Mengisi kalimat pembuka, salam,", "kata pengantar, dan salam penutup.", "Tetap bisa diubah."] })
  .field("Kalimat pembuka (opsional)", "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ", { hint: ["Mis. basmalah. Kosongkan bila tidak", "dipakai."] })
  .field("Salam", "Assalamu'alaikum Warahmatullahi Wabarakatuh").area("Kata pengantar", ["Dengan memohon rahmat dan rida", "Allah SWT, kami bermaksud", "menyelenggarakan pernikahan", "putra-putri kami. Merupakan", "kebahagiaan bagi kami apabila"], 5);
const story = (when, place, title, lines, k) => (f) => f.field("Waktu", when).field("Lokasi (opsional)", place).field("Judul", title).area("Cerita", lines, 4).photo("Foto (opsional)", k);
export const fillKisah = (c) => { c.field("Judul", "Kisah Cinta", { ph: true }); item(c, "Pertama Bertemu", story("Maret 2021", "Bandung", "Pertama Bertemu", ["Kami bertemu di sebuah acara", "kampus dan mulai saling", "mengenal."], 1), true, false);
  item(c, "Menjalin Hubungan", story("Agustus 2022", "Jakarta", "Menjalin Hubungan", ["Setelah sekian lama berteman,", "kami memutuskan untuk", "melangkah bersama."], 3), false, false); };
export const fillVideo = (c) => { c.field("Judul", "Video", { ph: true }).area("Keterangan", ["Saksikan perjalanan kami dalam", "video berikut."]);
  item(c, "Prewedding", (f) => f.field("Tautan YouTube", "https://www.youtube.com/watch?v=boRd_GXsYWA").field("Judul video (opsional)", "Prewedding"), true, true);
  c.add(quietBlock(I, c.y, IW, "Tambah video", "plus"), 48); };
const swatch = (f, hex) => f.add(rect(I + IW - 52, f.y - 40, 20, 20, { r: 3, fill: hex, stroke: C.field }));
export const fillDress = (c) => { c.field("Judul", "Dress Code", { ph: true });
  [["Olive", "#3F4232"], ["Terakota", "#A0522D"], ["Sage", "#5B7553"]].forEach(([n, hex], i) => item(c, n, (f) => swatch(f.field("Warna", hex), hex).field("Nama warna", n), i === 0, false)); };
export const fillGifts = (c) => {
  c.field("Judul", "Tanda Kasih", { ph: true }).area("Teks pengantar (opsional)", ["Doa restu Anda sudah lebih dari", "cukup. Bila ingin memberi tanda"])
    .toggle(["Tampilkan lewat tombol", "\"Kirim Hadiah\""], true, ["Rekening dan alamat terbuka setelah tamu", "menekan tombol."]);
  [["BCA", "1234567890", "Rani Ayu"], ["Mandiri", "1230004567890", "Dimas Putra"]].forEach(([b, n, h], i) => item(c, b, (f) => f.field("Bank atau e-wallet", b, { hint: ["Logo tampil otomatis untuk bank dan", "e-wallet yang dikenal (BCA, BNI, BRI,", "BSI, Mandiri, DANA, OVO, ...). Nama", "lain tampil sebagai teks."] })
    .field("Nomor rekening", n).field("Nama pemilik rekening", h).photo("Gambar QRIS (opsional)", null, "Pilih foto"), i === 0, i === 1));
  c.add(quietBlock(I, c.y, IW, "Tambah rekening", "plus"), 48).h3("Kirim kado (opsional)").field("Nama penerima", "Rani Ayu").area("Alamat", ["Jl. Melati 10, Jakarta 12110"], 3)
    .field("Tautan peta alamat (opsional)", "https://maps.google.com/?q=Kebayoran+Baru").toggle("Tampilkan peta alamat", true, ["Butuh tautan Google Maps dan alamat."]).field("WhatsApp konfirmasi", "081234567890");
};
export const fillFamilies = (c) => c.field("Judul", "Turut Mengundang", { ph: true }).field("Judul grup wanita", "Keluarga Bpk. Ahmad").area("Keluarga mempelai wanita", ["Kel. Bpk. Hasan", "Kel. Ibu Aminah", "Kel. Bpk. Rahmat"], 3)
  .field("Judul grup pria", "Keluarga Bpk. Budi").area("Keluarga mempelai pria", ["Kel. Bpk. Hartono", "Kel. Ibu Sri", "Kel. Bpk. Joko"], 3);
export const fillFooter = (c) => c.add(hintL(I, c.y, ["Branding Anda. Undangan baru mengambil", "nama dan WhatsApp dari Profil merek,", "atau dari bisnis Scalev bila profil kosong.", "Kosongkan kolom untuk menyembunyikan", "barisnya."]), 92)
  .toggle(["Hak cipta (© tahun dan nama", "mempelai)"], true).photo("Logo (opsional)", null, "Pilih foto")
  .field("Nama brand", "Rina WO", { hint: ["Mengisi {{Brand}} di Kredit. Tanpa {{Brand}}", "di Kredit: tampil sendiri di bawah logo."] }).field("Tautan brand (opsional)", "https://...", { ph: true });
// Rail on Konten + the whole Konten panel (head and body) with Mempelai open, nickname `nick`; o goes to kList.
export const kontenPanel = (nick = "Rani", o = {}) => nkRail(0, 0, "Konten") + rect(72, 92, 327, 808, { fill: C.white }) + nkHead(0, 0, "Konten", { account: ACCOUNT }) + kList({ ...o, open: "Mempelai", fill: fillMempelai(nick) }).svg;

// ---- Template panel ------------------------------------------------------------------------------------------------
// Templates as cards show them (build/templates.json name + description, clamped to two lines as measured in Chromium).
const TPL = {
  dasar: ["Dasar", ["Abu-abu gelap di atas", "foto, tanpa ornamen…"]], folio: ["Folio", ["Hitam & krem gaya", "majalah, foto penuh…"]],
  galeri: ["Galeri Putih", ["Putih bersih gaya", "majalah, huruf serif…"]], "modern-estetik": ["Modern Estetik", ["Putih & krem, bingkai", "lengkung, bayangan…"]],
  "cute-gemoy": ["Cute Gemoy", ["Krem, foto polaroid", "berjepit, bunga kering…"]], "tradisional-elegan": ["Tradisional Elegan", ["Hitam & emas, bingkai", "lengkung, judul huruf…"]],
  kencana: ["Kencana", ["Krem & merah bata,", "wayang golek…"]], joyo: ["Kembang Joyo", ["Kertas cokelat muda,", "bingkai lengkung dan…"]],
  ladomudo: ["Lado Mudo", ["Krem merah muda &", "marun, pita ulos dan…"]], pusako: ["Pusako", ["Merah marun, rumah", "gadang bergaris dan…"]],
  saman: ["Saman", ["Hitam & emas, motif", "Aceh dan bingkai…"]], pendopo: ["Pendopo", ["Krem & cokelat emas,", "bingkai lengkung dan…"]],
  "sekar-kedaton": ["Sekar Kedaton", ["Krem & merah marun,", "gerbang lengkung…"]], sogan: ["Sogan", ["Krem & cokelat sogan,", "bingkai ukir emas…"]],
  "sekar-jagad": ["Sekar Jagad", ["Kertas batik putih &", "hijau tua, gunungan…"]], kayon: ["Kayon", ["Kertas krem & cokelat", "tua, gunungan…"]],
  joglo: ["Joglo", ["Kertas batik tan,", "gunungan, rumah…"]]
};
const FIRST6 = ["dasar", "folio", "galeri", "modern-estetik", "cute-gemoy", "tradisional-elegan"];
// Section strip colours [light, mid, accent]; adat templates from their default palette (surface, bg, accent).
const STRIP = { dasar: ["#ffffff", "#e7e3dc", "#3a3a3a"], folio: ["#ffffff", "#e9e3d8", "#2b2a28"], galeri: ["#ffffff", "#eceae6", "#9a948c"],
  "modern-estetik": ["#ffffff", "#efe7dd", "#7b5a44"], "cute-gemoy": ["#fff3f6", "#fbd9e2", "#e48aa3"], "tradisional-elegan": ["#2a2522", "#1f1c1a", "#ecbb6c"],
  kencana: ["#FFFDF8", "#FFF7E9", "#8E2818"], joyo: ["#E7DCC8", "#D8C9AE", "#18150F"], ladomudo: ["#FFFFFF", "#FFFAF0", "#520000"], pusako: ["#F2EDDC", "#E1DABB", "#520000"],
  saman: ["#232220", "#181818", "#F0DA86"], pendopo: ["#FFFAF2", "#FAF4EC", "#86683A"], "sekar-kedaton": ["#FFFFFF", "#FFFCF3", "#7A1A1A"], sogan: ["#FFFFFF", "#FFFCF3", "#86683A"],
  "sekar-jagad": ["#FFFFFF", "#FDFDFD", "#374A33"], kayon: ["#F7F1E3", "#E6D6B4", "#473735"], joglo: ["#F7F1E3", "#E6D6B4", "#473735"] };
const HS = [10, 16, 8, 20, 12, 18, 9, 14, 22, 11, 16, 8, 13];
// Catalogue thumbnail: the template's phone cover plus its section strip (the real card image is a screenshot).
function thumb(x, y, id) {
  const [a, b, c] = STRIP[id], ix = x + 6, iy = y + 6, iw = 74, ih = 155, mx = ix + iw / 2;
  let s = "";
  for (const [k, cx] of [[0, x + 84], [5, x + 108]]) {
    let yy = y + 6, i = k;
    while (yy < y + 160) { const h = HS[i % HS.length]; s += rect(cx, yy, 22, Math.min(h - 2, y + 161 - yy), { r: 1, fill: i % 3 === 2 ? c : i % 2 ? b : a }); yy += h; i++; }
  }
  const tline = (yy, w, f) => rect(mx - w / 2, yy, w, 2.5, { r: 1, fill: f });
  if (id === "dasar" || id === "folio") s += photo(ix, iy, iw, ih, 6, 3) + text(mx, iy + (id === "dasar" ? 70 : 92), "Rani & Dimas", { size: 7, font: SERIF, fill: C.white, anchor: "middle" }) + tline(iy + 78, 40, "rgba(255,255,255,.7)") + tline(iy + 98, 30, "rgba(255,255,255,.6)") + rect(mx - 15, iy + 108, 30, 6, { r: 3, fill: C.white });
  else if (id === "galeri") s += rect(ix, iy, iw, ih, { r: 3, fill: C.white }) + tline(iy + 14, 30, "#9a948c") + tline(iy + 22, 22, "#c9c3bb") + photo(ix + 12, iy + 40, 50, 64, 0, 2) + tline(iy + 118, 40, "#6b6560") + rect(mx - 18, iy + 132, 36, 7, { fill: "#2F3E4E" });
  else if (id === "modern-estetik") s += rect(ix, iy, iw, ih, { r: 3, fill: C.white }) + tline(iy + 16, 36, "#9b8676") + photo(ix + 17, iy + 30, 40, 52, 4, 20) + tline(iy + 96, 30, "#7b5a44") + tline(iy + 104, 24, "#7b5a44") + rect(mx - 16, iy + 126, 32, 7, { r: 3.5, fill: "#7b5a44" });
  else if (id === "cute-gemoy") s += rect(ix, iy, iw, ih, { r: 3, fill: "#fde7ec" }) + circle(mx, iy + 56, 22, { fill: "#f7b9c8" }) + circle(mx, iy + 56, 16, { fill: "#fff3f6" }) + tline(iy + 96, 40, "#e48aa3") + tline(iy + 106, 28, "#e9a4b6") + rect(mx - 16, iy + 126, 32, 7, { r: 3.5, fill: "#e48aa3" });
  // Adat covers: paper colour, arch frame and title lines in the accent.
  else s += rect(ix, iy, iw, ih, { r: 3, fill: b }) + `<path d="M${ix + 14} ${iy + 100} V${iy + 48} A23 23 0 0 1 ${ix + 60} ${iy + 48} V${iy + 100} Z" fill="none" stroke="${c}" stroke-width="1.5"/>` + tline(iy + 116, 40, c) + tline(iy + 126, 26, c);
  return s;
}
// One template card at (x, y): thumbnail 134x167, name, two description lines; o.on: blue border + Dipakai badge.
export function card(x, y, id, o = {}) {
  const [name, desc] = TPL[id];
  return rect(x + 1, y + 1, 132, 165, { r: 8, fill: C.page, stroke: o.on ? C.primary : C.line, sw: 2 }) + clipped(x + 2, y + 2, 130, 163, thumb(x, y, id)) +
    text(x, y + 188, name, { size: 14, weight: 500 }) + (o.on ? badge(x + 133, y + 174, "Dipakai") : "") + para(x, y + 209, desc, { size: 12, fill: C.faint, lh: 16 });
}
// Top-left of card i (two columns, 241 apart) when the cards start at y top; its box is [x, y, 134, 167].
export const cardAt = (i, top) => [i % 2 ? 234 : 88, top + Math.floor(i / 2) * 241];
export const cards = (top, used, ids = FIRST6) => ids.map((id, i) => card(...cardAt(i, top), id, { on: id === used })).join("");
const MEGAPHONE = `<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>`;
// Template / Marketing switch (the Template side active) at the top of the panel body.
export const seg = () => rect(P + 0.5, 169.5, PW - 1, 37, { r: 4, fill: C.white, stroke: C.field }) + rect(P + 1, 170, 138, 36, { r: 3, fill: C.primarySoft }) +
  icon("layout-grid", 129, 188, 16, C.action) + text(146, 192, "Template", { size: 12, weight: 600, fill: C.action }) +
  `<g transform="translate(289 180) scale(.6667)" fill="none" stroke="${C.text}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${MEGAPHONE}</g>`;
// Warning under the switch when the page holds other HTML (moves the library down by 68).
export const htmlNote = () => rect(P, 219, PW, 56, { r: 4, fill: C.warnSoft }) + para(P + 12, 242, ["Halaman berisi HTML lain. Memilih template", "akan menggantinya."], { size: 12, fill: C.warnStrong, lh: 18 });
// Search box and category chips above the cards (panels-style.jsx TemplatePanel; categories from templates/base/categories.json,
// counts from the build catalogue). Chips are 28 high, 6 apart, wrap at the panel width; widths measured in Chromium.
const SEARCH_PH = "Cari: Jawa, bunga, atau tulis keinginan klien…";
const CATS = ["Semua", "Adat", "Floral", "Elegan", "Minimalis", "Ceria"];
export const ALL_N = [62, 32, 15, 6, 5, 4];
const CHIP_W = { Semua: [72, 76, 79], Adat: [60, 63, 67], Floral: [65, 70, 70], Elegan: [72], Minimalis: [86], Ceria: [63] }; // 1 digit, 11, other 2 digits
export function chips(y, n = ALL_N, on = "Semua") {
  let x = P, row = y, s = "";
  CATS.forEach((c, i) => {
    const w = CHIP_W[c][n[i] < 10 ? 0 : n[i] === 11 ? 1 : 2], a = c === on;
    if (x + w > P + PW) { x = P; row += 34; }
    s += rect(x + 0.5, row + 0.5, w - 1, 27, { r: 14, fill: a ? C.primarySoft : C.white, stroke: a ? C.primary : C.field }) +
      text(x + 11, row + 18, c, { size: 12, fill: a ? C.action : C.strong }) + text(x + w - 11, row + 18, String(n[i]), { size: 12, fill: C.text, anchor: "end" });
    x += w + 6;
  });
  return s;
}
const searchBox = (y, q = "", focus = false) => inp(P, y, PW, q || SEARCH_PH, { ph: !q, focus });
// The whole library under the switch: search at top, chips 44 below, cards 118 below (cards at 337 when top = 219).
// used: id of the card marked Dipakai; o.q: search text, o.n: chip counts, o.cat: active chip, o.ids: the cards shown.
export const library = (top, used, o = {}) => searchBox(top, o.q) + chips(top + 44, o.n, o.cat) + cards(top + 118, used, o.ids);
// The Template panel body content (switch + library at 219), unclipped: wrap in panelBody() or clip it yourself.
export const templatePanel = (used, o = {}) => seg() + library(219, used, o);
// Toast after a template change, with Urungkan; URUNGKAN is the box of its Urungkan text, for a mark.
export const TOAST = shadow(84, 836, 302, 52, 4, 2) + rect(84, 836, 302, 52, { r: 4, fill: C.strong }) + text(96, 867, "Template diganti ke Dasar.", { size: 14, fill: C.white }) +
  text(374, 867, "Urungkan", { size: 14, weight: 700, fill: "#7fd3f5", anchor: "end" }), URUNGKAN = [304, 850, 76, 26];

// ---- Galeri Foto and the Media dialog (Pilih foto) ------------------------------------------------------------------
// Konten scrolled so Kisah Cinta's bar is at y 191 and Galeri Foto (opened) at 249. top(n): bars + Judul/Teks pengantar +
// "Foto galeri (n)"; rest(y): Tambah foto button and the next bars; dlg: the dialog covering rail and panel (Unggah foto,
// paste link, 3-column grid, Pakai foto footer); pick(i): photo i selected; foot(n): Pakai n foto; after(): two photos added.
export const GAL = (() => {
  const top = (n) => acc(191, "Kisah Cinta", "Terisi") + acc(249, "Galeri Foto", n ? "Terisi" : "Belum diisi", 1400) +
    col(I, 303, IW).field("Judul", "Galeri", { ph: true }).area("Teks pengantar (opsional)", ["Sebagian momen yang ingin kami", "bagi bersama Anda."]).svg +
    lbl(I, 451, `Foto galeri (${n})`);
  const rest = (y) => quietBlock(I, y, IW, "Tambah foto", "image") + text(I, y + 60, "Foto pertama tampil paling besar.", { size: 12, fill: C.faint }) +
    ["Video", "Dress Code", "Susunan Acara", "RSVP & Ucapan", "Siaran Langsung", "Filter Kamera"].map((t, i) => acc(y + 85 + i * 58, t, "Terisi")).join("");
  const cell = (i) => [16 + (i % 3) * 124, 291 + Math.floor(i / 3) * 124];
  const dlg = nkDialogHead(0, 0, "Pilih foto") + nkBtn(16, 169, "Unggah foto", { variant: "ghost", w: 366, icon: "upload" }) + lbl(16, 217, "Atau tempel tautan https") +
    inp(16, 237, 300, "https://...", { ph: true }) + `<g opacity=".5">${nkBtn(322, 237, "Pakai", { variant: "ghost", w: 60 })}</g>` +
    clipped(0, 285, 399, 554, ...Array.from({ length: 12 }, (_, i) => photo(...cell(i), 118, 118, i % 6, 4))) +
    rect(0, 839, 399, 61, { fill: C.white }) + line(0, 839.5, 399, 839.5) + `<g opacity=".5">${nkBtn(16, 851, "Pakai foto", { w: 366 })}</g>`;
  const pick = (i) => { const [x, y] = cell(i); return rect(x + 1, y + 1, 116, 116, { r: 4, stroke: C.primary, sw: 2 }) + circle(x + 104, y + 14, 8, { fill: C.action }) + iconX("check", x + 104, y + 14, 10, C.white, 3.5); };
  const foot = (n) => rect(0, 840, 399, 60, { fill: C.white }) + nkBtn(16, 851, `Pakai ${n} foto`, { w: 366 });
  const row = (k) => { const y = 471 + k * 104; return rect(I + 0.5, y + 0.5, IW - 1, 95, { r: 4, fill: C.page, stroke: C.line }) + photo(I + 9, y + 9, 64, 64, k * 4, 4) +
    inp(I + 81, y + 9, 127, "Deskripsi foto", { ph: true }) + inp(I + 81, y + 51, 127, "Fokus tengah", { select: true }) +
    icon("chevron-up", I + 230, y + 27, 16, k ? C.text : "rgba(91,102,117,.35)") + icon("trash", I + 230, y + 63, 16, C.text); };
  const after = () => panelBody(panelBg(), top(2), rest(679), row(0), row(1));
  return { top, rest, dlg, pick, foot, after };
})();
