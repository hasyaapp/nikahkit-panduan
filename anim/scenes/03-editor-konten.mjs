// Editor dan Konten: langkah editor, pilih/ganti template, Langkah tiap halaman Konten, tambah acara, galeri, RSVP dan Amplop Digital.
// Every scene is the whole real 1440x900 Scalev editor (ui/kit scalevEditor): top bar, tabs, rail, panel and preview. The
// Template and Konten panels come from ui/editor-panels (measured), the preview from ui/invitation (generic layout).
import { C, rect, text, line, clipped, shadow, icon, iconX, tw } from "../lib.mjs";
import { ED, nkHead, nkRail, nkBtn, scalevEditor } from "../ui/kit.mjs";
import { PHOTO_DEFS, EV, pvCover, pvEvents, pvGallery, pvGift, pvForeign, pvFolio, pvDasar, pvSinta, pvSintaFolio } from "../ui/invitation.mjs";
import { ACCOUNT, P, PW, I, IW, rich, hintL, inp, typeIn, acc, col, itemBar, itemBox, quietBlock, panelBg, panelBody, lid, LOCKED, kList, kListAt,
  fillMempelai, EVS, fillAcara, fillSampul, fillSalam, fillKisah, fillVideo, fillDress, fillGifts, fillFamilies, fillFooter, kontenPanel,
  seg, htmlNote, chips, ALL_N, cards, library, TOAST, URUNGKAN, GAL } from "../ui/editor-panels.mjs";

// Focus areas (world px): rail + panel, panel body, preview screen, Scalev bars, Simpan buttons, rail foot. Every element
// in this file is a state of the screen (`skel: true`): skeleton outside the step's focus, detail inside, like the base.
const F = { side: [0, 92, 399, 808], body: [72, 153, 327, 747], pv: [726, 105, 392, 786], top: [0, 0, 1440, 92],
  save: [1183, 44, 257, 48], foot: [0, 851, 72, 49] };
// Marks: Scalev Simpan, the save status at the rail foot, a rail tab, an accordion bar, a template card.
const SIMPAN = ED.simpanBox, FOOT = { box: [0, 851, 71, 49], r: 0 };
const railM = (n) => ({ box: [0, ED.rail[n][1] - 26, 71, 52], r: 0 });
const accM = (y) => [88, y, 279, 50];
const cardM = (x, y) => ({ box: [x, y, 134, 167], r: 8 });
const FOLIO_C = [301, 420], DASAR_C = [155, 420]; // card centres with the cards at y 337
const ADAT_CHIP = [206, 277]; // centre of the Adat chip with the default counts
// The whole editor with a rail tab active (gradients for the photo placeholders first).
const editor = (rail, o = {}) => [PHOTO_DEFS, scalevEditor(0, 0, { rail, ...o })];
// Lens around the save status at the rail foot.
const FOOT_LENS = { src: [0, 852, 72, 48], zoom: 3 };
// Scalev Simpan button, redrawn so it can dip when clicked.
const simpanBtn = () => rect(1193, 50, 82, 34, { r: 4, fill: C.white, stroke: C.svBtnLine, sw: 2 }) + text(1201, 72, "Simpan", { size: 13, weight: 500, fill: C.strong }) + iconX("file-text", 1258, 67, 15, C.strong);

export const scenes = {
  // ---------------------------------------------------------------------------------------------------------------------
  "editor-peta": {
    title: "Langkah pertama di editor NikahKit: tab NikahKit sampai Konten",
    base: [PHOTO_DEFS, scalevEditor(0, 0, { tab: "Code", screenFill: C.white })],
    els: {
      gate: { svg: clipped(0, 44, 399, 856, scalevEditor(0, 0, { rail: "Template", screenFill: C.white })) + rect(0, 93, 399, 807, { fill: C.white }) +
        text(200, 300, "Memeriksa akses...", { size: 14, weight: 600, anchor: "middle" }), enter: "fade", skel: true },
      tpl: { svg: nkRail(0, 0, "Template") + rect(72, 92, 327, 808, { fill: C.white }) + nkHead(0, 0, "Template", { inbox: false, account: ACCOUNT }) + panelBody(seg(), library(219)), enter: "fade", delay: 0.5, skel: true },
      locked: { svg: LOCKED, enter: "fade", delay: 0.5, skel: true },
      picked: { svg: panelBody(panelBg(), seg(), library(219, "folio")) + icon("inbox", 236, 122, 18, C.text), enter: "fade", skel: true },
      pvF: { svg: pvFolio(), enter: "fade", delay: 0.2, skel: true },
      konten: { svg: kontenPanel(), enter: "fade", skel: true }
    },
    steps: [
      { caption: "Buka halaman undangan di Scalev. Editornya terbuka dalam HTML Mode.", focus: F.top, mark: [8, 54, 222, 26], lens: { src: [0, 0, 412, 92] }, at: [120, 66] },
      { caption: "Klik tab NikahKit. Sebentar tertulis Memeriksa akses...", focus: [0, 44, 399, 856], mark: [226, 54, 88, 26], lens: { src: [224, 46, 172, 46] }, show: ["gate"], at: ED.tab.NikahKit, click: true },
      { caption: "Tunggu pemeriksaan akses selesai. Menu dan panel muncul.", focus: F.side, mark: { box: [0, 104, 71, 332], r: 0 }, lens: { src: [0, 96, 399, 166], at: [290, 70] }, show: ["tpl", "locked"], at: [230, 330] },
      { caption: "Halaman masih kosong? Klik satu kartu template, misalnya Folio.", mark: cardM(234, 337), lens: { src: [226, 330, 150, 242] }, hide: ["locked"], show: ["picked", "pvF"], at: FOLIO_C, click: true, dur: 3.4 },
      { caption: "Klik Konten untuk mengisi data. Daftar bagian undangan muncul.", mark: railM("Konten"), lens: { src: [0, 376, 399, 62], at: [290, 200] }, show: ["konten"], at: ED.rail.Konten, click: true }
    ]
  },

  "editor-peta-simpan": {
    title: "Langkah pertama di editor NikahKit: pratinjau dan Simpan",
    base: [...editor("Konten"), kontenPanel("Sinta"), pvFolio()],
    els: { pvName: { svg: pvSintaFolio(), enter: "fade", delay: 0.6, skel: true }, sBtn: { svg: simpanBtn(), skel: true } },
    steps: [
      { caption: "Lihat hasilnya di pratinjau: nama yang kamu ketik langsung tampil.", focus: F.pv, mark: [784, 420, 276, 46], show: ["pvName"], at: [922, 560], dur: 3.4 },
      { caption: "Status Tersimpan di kolom kiri? Klik Simpan di kanan atas Scalev.", focus: [F.foot, F.save], mark: [FOOT, { box: SIMPAN, r: 4 }], lens: FOOT_LENS, at: ED.simpan, press: "sBtn" }
    ]
  },

  // ---------------------------------------------------------------------------------------------------------------------
  "editor-pilih-template": {
    title: "Memilih template NikahKit pertama kali: kartu template",
    base: [...editor("Template"), nkHead(0, 0, "Template", { inbox: false, account: ACCOUNT }), pvForeign()],
    els: {
      locked: { svg: LOCKED, skel: true },
      cardsA: { svg: rect(72, 153, 327, 1000, { fill: C.white }) + seg() + htmlNote() + library(287), enter: "fade", skel: true },
      lidT: { svg: lid("Template", { inbox: false }), skel: true }
    },
    steps: [
      { caption: "Klik Template di menu kiri. Panel Template terbuka.", focus: F.side, mark: railM("Template"), lens: { src: [0, 96, 399, 122], at: [290, 70] }, at: ED.rail.Template, click: true, show: ["cardsA"] },
      { caption: "Pastikan pilihan Template yang aktif, bukan Marketing.", focus: [80, 161, 295, 122], mark: [P, 169, PW, 38], lens: { src: [80, 161, 295, 122] }, at: [160, 188] },
      { caption: "Gulir ke bawah dan lihat gambar contoh tiap template.", focus: F.body, scroll: { id: "cardsA", dy: 241 }, at: [230, 560], dur: 3.4 },
      { caption: "Klik kartu yang kamu suka, misalnya Folio.", mark: cardM(234, 405), lens: { src: [226, 398, 150, 242] }, scroll: { id: "cardsA", dy: -241 }, at: [301, 488], click: true, dur: 3.6 }
    ]
  },

  "editor-pilih-template-ganti": {
    title: "Memilih template NikahKit pertama kali: dialog Ganti",
    base: [...editor("Template"), nkHead(0, 0, "Template", { inbox: false, account: ACCOUNT }), panelBody(panelBg(), seg(), htmlNote(), library(287)), pvForeign()],
    els: {
      veil: { svg: rect(0, 0, 1440, 900, { fill: "rgba(255,255,255,.92)" }), enter: "fade", skel: true },
      dlg: { svg: shadow(540, 383, 360, 134, 8, 3) + rect(540, 383, 360, 134, { r: 8, fill: C.white }) + text(560, 418, "Ganti isi halaman dengan Folio?", { size: 14, weight: 600 }) +
        text(560, 442, "HTML yang sekarang ada di halaman akan diganti.", { size: 12, fill: C.faint }) + nkBtn(758, 461, "Batal", { variant: "quiet", w: 57 }), enter: "fade", skel: true },
      gnt: { svg: nkBtn(823, 461, "Ganti", { w: 57 }), enter: "fade", skel: true },
      pvF: { svg: pvFolio(), enter: "fade", delay: 0.2, skel: true }
    },
    steps: [
      { caption: "Halaman berisi HTML lain, jadi muncul dialog Ganti isi halaman.", focus: [540, 383, 360, 134], mark: { box: [540, 383, 360, 134], r: 8 }, lens: { src: [540, 383, 360, 134] }, at: [650, 495] },
      { caption: "Klik Ganti. Pratinjau kini menampilkan Folio.", focus: F.pv, mark: [823, 461, 57, 36], note: "Ganti", at: [851, 479], click: true, press: "gnt", hide: ["veil", "dlg", "gnt"], show: ["pvF"], dur: 3.6 }
    ]
  },

  "editor-pilih-template-dipakai": {
    title: "Memilih template NikahKit pertama kali: Dipakai dan Konten",
    base: [...editor("Template"), nkHead(0, 0, "Template", { account: ACCOUNT }), panelBody(panelBg(), seg(), library(219, "folio")), pvFolio()],
    els: { konten: { svg: kontenPanel(), enter: "fade", skel: true }, sBtn: { svg: simpanBtn(), skel: true } },
    steps: [
      { caption: "Kartu Folio kini bertanda Dipakai. Menu lain bisa diklik.", focus: F.side, mark: { box: [326, 511, 41, 18], r: 9 }, lens: { src: [226, 330, 150, 242] }, at: [346, 520] },
      { caption: "Ganti data contoh: klik Konten. Catatan kuning menghitung isian contoh.", mark: railM("Konten"), lens: { src: [80, 161, 295, 80], at: [290, 90] }, show: ["konten"], at: ED.rail.Konten, click: true, dur: 3.6 },
      { caption: "Tunggu status Tersimpan, lalu klik Simpan di kanan atas Scalev.", focus: [F.foot, F.save], mark: [FOOT, { box: SIMPAN, r: 4 }], lens: FOOT_LENS, at: ED.simpan, press: "sBtn" }
    ]
  },

  // Search and categories (panels-style.jsx TemplatePanel). Keyword results and counts from model.findTemplates on the build
  // catalogue; the sentence answer comes from the worker (Jev), so its order here is only an example.
  "editor-cari-template": (() => {
    const [qBox, q1, t1] = typeIn(P, 219, PW, "Jawa"), [, q2, t2] = typeIn(P, 219, PW, "Jawa, nuansa hijau");
    const below = (...kids) => rect(72, 257, 327, 643, { fill: C.white }) + kids.join("");
    const Q = [P, 219, PW, 36], LS = { src: [80, 211, 295, 84], at: [290, 60] };
    return {
      title: "Mencari template lewat kata kunci, kategori, atau kalimat",
      base: [...editor("Template", { screenFill: C.white }), nkHead(0, 0, "Template", { account: ACCOUNT }), panelBody(panelBg(), seg(), library(219))],
      els: {
        adat: { svg: panelBody(below(chips(263, ALL_N, "Adat"), cards(337, null, ["tradisional-elegan", "kencana", "joyo", "ladomudo", "pusako", "saman"]))), enter: "fade", skel: true },
        jawa: { svg: panelBody(below(chips(263, [11, 11, 0, 0, 0, 0], "Adat"), cards(337, null, ["tradisional-elegan", "kencana", "joyo", "pendopo", "sekar-kedaton", "sogan"]))), enter: "fade", delay: 0.5, skel: true },
        busy: { svg: panelBody(below(chips(263, [0, 0, 0, 0, 0, 0], "Adat"), hintL(P, 337, ["Mencari template yang paling cocok…"]))), enter: "fade", delay: 1.4, skel: true },
        smart: { svg: panelBody(below(chips(263, [6, 6, 0, 0, 0, 0], "Adat"), hintL(P, 337, ["Paling cocok untuk “Jawa, nuansa hijau”,", "urut dari yang terdekat."]),
          cards(369, null, ["sekar-jagad", "kayon", "joglo", "sogan", "kencana", "pendopo"]))), enter: "fade", skel: true },
        qBox: { svg: qBox, enter: "fade", skel: true },
        q1: { svg: q1, enter: "fade", skel: true },
        q2: { svg: q2, enter: "fade", skel: true }
      },
      steps: [
        { caption: "Klik kategori, misalnya Adat. Hanya template adat yang tampil.", focus: F.body, mark: { box: [173, 263, 67, 28], r: 14 }, lens: LS, at: ADAT_CHIP, click: true, show: ["adat"] },
        { caption: "Ketik kata kunci di kotak Cari, misalnya Jawa. Angka kategori ikut berubah.", mark: Q, lens: LS, at: [228, 237], click: true, show: ["qBox", "q1", "jawa"], type: [{ id: "q1", ...t1 }], dur: 3.6 },
        { caption: "Tulis keinginan klien dalam kalimat, lalu tekan Enter.", mark: Q, lens: { src: [80, 211, 295, 118] }, at: [300, 237], click: true, hide: ["q1"], show: ["q2", "busy"], type: [{ id: "q2", ...t2 }], dur: 4.4 },
        { caption: "Hasilnya diurutkan dari yang paling cocok dengan kalimatmu.", mark: cardM(P, 369), lens: { src: [80, 329, 295, 276], at: [290, 170] }, at: [160, 452], show: ["smart"], dur: 3.6 }
      ]
    };
  })(),

  // ---------------------------------------------------------------------------------------------------------------------
  "editor-ganti-template": {
    title: "Mengganti template nanti: kartu lain",
    base: [...editor("Konten"), kontenPanel(), pvFolio()],
    els: {
      tplB: { svg: nkRail(0, 0, "Template") + rect(72, 92, 327, 808, { fill: C.white }) + nkHead(0, 0, "Template", { account: ACCOUNT }) + panelBody(seg(), library(219, "folio")), enter: "fade", skel: true },
      cardsC: { svg: panelBody(panelBg(), seg(), library(219, "dasar")), enter: "fade", skel: true },
      toast: { svg: TOAST, enter: "slide", delay: 0.4, skel: true },
      pvD: { svg: pvDasar(), enter: "fade", delay: 0.2, skel: true }
    },
    steps: [
      { caption: "Klik Template di menu kiri. Template yang dipakai bertanda Dipakai.", focus: F.side, mark: railM("Template"), lens: { src: [226, 330, 150, 242], at: [290, 160] }, at: ED.rail.Template, click: true, show: ["tplB"] },
      { caption: "Klik kartu template lain, misalnya Dasar. Muncul pesan dengan Urungkan.", mark: cardM(P, 337), lens: { src: [80, 330, 295, 242], at: [290, 140] }, at: DASAR_C, click: true, show: ["cardsC", "toast", "pvD"], dur: 3.6 }
    ]
  },

  "editor-ganti-template-pratinjau": {
    title: "Mengganti template nanti: pratinjau",
    base: [...editor("Template"), nkHead(0, 0, "Template", { account: ACCOUNT }), panelBody(panelBg(), seg(), library(219, "dasar")), pvDasar()],
    els: {
      cardsF: { svg: panelBody(panelBg(), seg(), library(219, "folio")), enter: "fade", skel: true },
      pvF: { svg: pvFolio(), enter: "fade", skel: true },
      toast: { svg: TOAST, skel: true }
    },
    steps: [
      { caption: "Periksa pratinjau. Desainnya Dasar, isian Konten tetap ada.", focus: F.pv, mark: [790, 326, 264, 48], at: [922, 420] },
      { caption: "Tidak suka? Klik Urungkan di pesan bawah panel. Folio kembali.", focus: [[84, 836, 302, 52], F.pv], mark: URUNGKAN, lens: { src: [84, 836, 302, 54] }, at: [342, 863], click: true, show: ["cardsF", "pvF"], dur: 3.4 }
    ]
  },

  // ---------------------------------------------------------------------------------------------------------------------
  "editor-isi-mempelai": (() => {
    const hold = { left: 5, link: "Ganti foto sampul", raw: true };
    const v1 = kList({ open: "Mempelai", fill: fillMempelai(), raw: true });
    const v1b = kList({ ...hold, open: "Mempelai", fill: fillMempelai("Sinta") });
    const yM = v1.at.Mempelai, nickY = v1.f["Nama panggilan"] + 20, [clear, typed, ty] = typeIn(I, nickY, IW, "Sinta");
    const D4 = v1b.f["Nama ayah"] - 400, ayahY = 420;
    const D5 = Math.max(0, v1b.at["Acara & Tanggal"] - D4 - 260), barA = v1b.at["Acara & Tanggal"] - D4 - D5;
    const a0 = kList({ ...hold, open: "Acara & Tanggal", fill: fillAcara(EVS) });
    const dyA = Math.max(0, a0.at["Acara & Tanggal"] - barA);
    const v2 = kList({ ...hold, open: "Acara & Tanggal", fill: fillAcara(EVS), dy: dyA });
    const D6 = v2.f["Ngunduh Mantu"] - 320;
    const v2d = kList({ ...hold, open: "Acara & Tanggal", fill: fillAcara(EVS.slice(0, 2)), dy: dyA + D6 });
    const v3 = kList({ ...hold, open: "Sampul", fill: fillSampul }), yS = v3.at.Sampul;
    const D8 = v3.at["Salam Pembuka"] - 420;
    const s0 = kList({ ...hold, open: "Salam Pembuka", fill: fillSalam });
    const v4s = kList({ ...hold, open: "Salam Pembuka", fill: fillSalam, dy: s0.at["Salam Pembuka"] - 420 });
    const v5 = kList({ left: 5, link: "Ganti foto sampul" }), y5 = v5.at.Sampul;
    const sub = (id, D) => (D ? { scroll: { id, dy: D } } : {});
    return {
      title: "Mengisi Mempelai, Acara, Sampul, dan Salam di Konten",
      base: [...editor("Template"), nkHead(0, 0, "Template", { account: ACCOUNT }), panelBody(seg(), library(219)), pvCover("Rani & Dimas")],
      els: {
        railK: { svg: nkRail(0, 0, "Konten"), enter: "fade", skel: true },
        v1: { svg: v1.svg, enter: "fade", skel: true },
        clear: { svg: clear, enter: "fade", skel: true },
        typed: { svg: typed, enter: "fade", skel: true },
        pvS: { svg: pvSinta(), enter: "fade", delay: 0.4, skel: true },
        v1b: { svg: v1b.svg, enter: "fade", delay: -1.2, skel: true },
        // The list after Nama ayah was clicked, at the scroll it has then, so the focused field scrolls with it.
        v1bA: { svg: `<g transform="translate(0 ${-D4})">${v1b.svg}${inp(I, v1b.f["Nama ayah"] + 20, IW, "Ahmad", { focus: true })}</g>`, enter: "fade", skel: true },
        v2: { svg: v2.svg, enter: "fade", skel: true },
        v2d: { svg: v2d.svg, enter: "fade", skel: true },
        v3: { svg: v3.svg, enter: "fade", skel: true },
        v4: { svg: v4s.svg, enter: "fade", skel: true },
        v5: { svg: v5.svg, enter: "fade", skel: true },
        lidK: { svg: lid("Konten"), enter: "fade", skel: true },
        sBtn: { svg: simpanBtn(), skel: true }
      },
      steps: [
        { caption: "Klik Konten di menu kiri. Daftar bagian muncul, di atasnya Bahasa undangan.", focus: F.side, mark: railM("Konten"), lens: { src: [0, 376, 399, 62], at: [290, 200] }, at: ED.rail.Konten, click: true, show: ["railK", "v1", "lidK"] },
        { caption: "Buka Mempelai. Biasanya sudah terbuka; bila tertutup, klik namanya.", focus: [72, yM - 8, 327, 908 - yM], mark: accM(yM), lens: { src: [80, yM - 8, 295, 120] }, at: [190, yM + 25] },
        { caption: "Klik Nama panggilan di bawah Mempelai Wanita, lalu ketik nama klien.", focus: [72, nickY - 60, 327, 130], mark: [I, nickY, IW, 36], lens: { src: [93, nickY - 56, 270, 120] },
          show: ["clear", "typed", "pvS"], at: [230, nickY + 18], click: true, type: [{ id: "typed", ...ty }], dur: 3.6 },
        { caption: "Isi kolom mempelai lain: Nama lengkap, Nama ayah, Nama ibu. Ulangi untuk pria.", focus: F.body, mark: [I, ayahY, IW, 36], lens: { src: [93, ayahY - 28, 270, 110] },
          hide: ["clear", "typed"], show: ["v1b", "v1bA"], ...sub("v1b", D4), at: [230, ayahY + 18], click: true, dur: 3.8 },
        { caption: "Klik Acara & Tanggal. Pilih Zona waktu, lalu ganti isi acara contoh.", mark: accM(barA), lens: { src: [80, barA - 8, 295, 128] }, hide: ["v1"], show: ["v2"], ...sub("v1bA", D5), at: [190, barA + 25], click: true, dur: 3.6 },
        { caption: "Hapus acara yang tidak dipakai dengan ikon tempat sampah.", mark: [I + IW - 35, 333, 22, 22], lens: { src: [96, 314, 262, 52] }, hide: ["v1b", "v1bA"], show: ["v2d"], scroll: { id: "v2", dy: D6 }, at: [I + IW - 24, 344], click: true, dur: 3.6 },
        { caption: "Klik Sampul. Pilih Foto sampul; teks sampul boleh dibiarkan kosong.", mark: accM(yS), lens: { src: [80, yS - 8, 295, 124] }, hide: ["v2"], show: ["v3"], scroll: { id: "v2d", dy: -(dyA + D6) }, at: [190, yS + 25], click: true, dur: 3.6 },
        { caption: "Klik Salam Pembuka dan pilih Preset salam. Lalu buka Ayat / Kutipan.", mark: accM(420), lens: { src: [80, 412, 295, 126] }, hide: ["v2d"], show: ["v4"], scroll: { id: "v3", dy: D8 }, at: [190, 445], click: true, dur: 3.6 },
        { caption: "Periksa tanda Terisi. Status Tersimpan? Klik Simpan di Scalev.", focus: [F.body, F.foot, F.save], mark: [{ box: [317, y5 + 16, 37, 18 + 58 * 5], r: 9 }, FOOT, { box: SIMPAN, r: 4 }],
          lens: { src: [84, y5 - 4, 287, 236] }, hide: ["v3"], show: ["v5"], at: ED.simpan, press: "sBtn", dur: 3.8 }
      ]
    };
  })(),

  "editor-isi-mempelai-pratinjau": (() => {
    const hold = { left: 5, link: "Ganti foto sampul" };
    const k = kList({ ...hold, open: "Mempelai", fill: fillMempelai("Sinta") }), nickY = k.f["Nama panggilan"] + 20;
    const shut = kList(hold), barA = shut.at["Acara & Tanggal"];
    return {
      title: "Hasil isian Mempelai dan Acara di pratinjau",
      base: [...editor("Konten"), nkHead(0, 0, "Konten", { account: ACCOUNT }), k.svg, pvCover("Rani & Dimas")],
      els: {
        pvS: { svg: pvSinta(), enter: "fade", delay: 0.8, skel: true },
        shut: { svg: shut.svg, enter: "fade", delay: -1, skel: true },
        open: { svg: kList({ ...hold, open: "Acara & Tanggal", fill: fillAcara(EVS.slice(0, 2)) }).svg, enter: "fade", skel: true },
        pvEv: { svg: pvEvents(["akad", "resepsi"]), enter: "fade", skel: true }
      },
      steps: [
        { caption: "Isi Nama panggilan mempelai wanita: sampul di pratinjau ikut berubah.", focus: [[72, nickY - 60, 327, 130], F.pv], mark: [{ box: [I, nickY, IW, 36], r: 4 }, { box: [770, 466, 304, 58], r: 4 }],
          lens: { src: [93, nickY - 56, 270, 120] }, show: ["pvS"], at: [922, 600], dur: 3.4 },
        { caption: "Klik Acara & Tanggal: acara-acara tampil di pratinjau.", focus: [[72, barA - 8, 327, 160], F.pv], mark: accM(barA), lens: { src: [80, barA - 8, 295, 128] },
          show: ["shut", "open", "pvEv"], at: [190, barA + 25], click: true, dur: 3.4 }
      ]
    };
  })(),
  // ---------------------------------------------------------------------------------------------------------------------
  "editor-tambah-acara": (() => {
    const DY = 560;
    // Panel scrolled to Acara & Tanggal (Mempelai closed above it), one event left in the list.
    const c = col(I, 223, IW).field("Zona waktu", "WIB", { select: true })
      .field("Acara utama", "Akad Nikah", { select: true, hint: ["Acuan tanggal sampul, Simpan Tanggal,", "Hitung Mundur, dan kalender. Tanpa", "tanggal: acara pertama yang bertanggal."] });
    const it1 = c.y;
    const f1 = col(I + 10, it1 + 48, IW - 20).field("Nama acara", "Akad Nikah").field("Mulai", "14/02/2027, 08.00", { icon: "calendar" })
      .field("Selesai (opsional)", "hh/bb/tttt, --.--", { icon: "calendar", ph: true }).field("Nama tempat atau gedung", "Masjid Al-Ikhlas")
      .area("Alamat lengkap", ["Jl. Melati 1, Jakarta"]).field("Tautan peta", "https://maps.google.com/?q=Kebayoran+Baru").area("Catatan (opsional)", ["Khusus keluarga inti"]);
    const end1 = f1.y - 2, btnY = end1 + 8;
    const after = col(I, btnY + 48, IW).toggle("Tampilkan peta di kartu acara", true, ["Butuh tautan Google Maps dan alamat."]).lead("Hitung mundur memakai Acara utama.");
    const scrolled = rect(72, 153, 327, 747 + DY, { fill: C.white }) + acc(111, "Mempelai", "Terisi") + acc(169, "Acara & Tanggal", "Terisi", 1400) + c.svg +
      itemBox(it1, end1 - it1) + itemBar(it1, "Akad Nikah", true, true) + f1.svg + quietBlock(I, btnY, IW, "Tambah acara", "plus") + after.svg;
    // Second event, after scrolling (world y = scrolled y - DY).
    const y2 = btnY - DY, nameY = y2 + 48, startY = nameY + 68, endY = startY + 68;
    const lower = (y) => col(I + 10, y, IW - 20).field("Nama tempat atau gedung", "").area("Alamat lengkap", []).field("Tautan peta", "https://...", { ph: true }).svg;
    const item2 = rect(I, y2 - 1, IW, 901 - y2, { fill: C.white }) + itemBox(y2, 900 - y2 + 20) + itemBar(y2, "Acara 2", false, true) +
      col(I + 10, nameY, IW - 20).field("Nama acara", "mis. Akad Nikah", { ph: true }).field("Mulai", "hh/bb/tttt, --.--", { icon: "calendar", ph: true }).field("Selesai (opsional)", "hh/bb/tttt, --.--", { icon: "calendar", ph: true }).svg + lower(endY + 68);
    const below = (y) => rect(I + 2, y, IW - 4, 900 - y, { fill: C.page });
    const times = rect(I + 11, startY + 21, IW - 58, 34, { fill: C.white }) + text(I + 21, startY + 43, "14/02/2027, 11.00", { size: 14, fill: C.strong }) +
      below(endY + 18) + inp(I + 10, endY + 20, IW - 20, "14/02/2027, 10.00", { icon: "calendar", err: true, focus: true }) +
      text(I + 10, endY + 71, "Jam selesai harus setelah jam mulai.", { size: 12, fill: C.danger }) + lower(endY + 88);
    const fixed = below(endY + 18) + inp(I + 10, endY + 20, IW - 20, "14/02/2027, 14.00", { icon: "calendar", focus: true }) + lower(endY + 68);
    const dd = shadow(I, 281, IW, 80, 6, 2) + rect(I, 281, IW, 80, { r: 6, fill: C.white, stroke: C.field }) + rect(I + 4, 285, IW - 8, 24, { r: 4, fill: C.primarySoft }) +
      ["WIB", "WITA", "WIT"].map((v, i) => text(I + 14, 302 + i * 24, v, { size: 14, fill: C.strong })).join("") + iconX("check", I + IW - 18, 297, 14, C.action);
    const nameM = [I + 10, nameY + 20, IW - 20, 36], endM = [I + 10, endY + 20, IW - 20, 36];
    const nameL = { src: [I - 6, y2 - 6, IW + 12, nameY + 62 - y2] }, timeL = { src: [I - 6, startY - 6, IW + 12, endY + 94 - startY] };
    return {
      title: "Menambah acara di Acara & Tanggal",
      base: [...editor("Konten"), pvEvents(["akad"])],
      els: {
        list: { svg: scrolled, skel: true },
        dd: { svg: dd, enter: "pop", origin: [I + IW / 2, 279], skel: true },
        item2: { svg: item2, enter: "rise", skel: true },
        nFocus: { svg: inp(I + 10, nameY + 20, IW - 20, "", { focus: true }), enter: "fade", skel: true },
        nBlur: { svg: inp(I + 10, nameY + 20, IW - 20, ""), enter: "fade", skel: true },
        nTyped: { svg: text(I + 21, nameY + 43, "Resepsi", { size: 14, fill: C.strong }), enter: "fade", skel: true },
        title2: { svg: rect(I + 8, y2 + 12, 80, 22, { fill: C.page }) + text(I + 10, y2 + 28, "Resepsi", { size: 12, weight: 700 }), enter: "fade", delay: 0.9, skel: true },
        times: { svg: times, enter: "fade", skel: true },
        fixed: { svg: fixed, enter: "fade", skel: true },
        lidE: { svg: lid("Konten"), skel: true }
      },
      steps: [
        { caption: "Di Acara & Tanggal, pilih Zona waktu: WIB, WITA, atau WIT.", focus: [72, 215, 327, 150], mark: [I, 243, IW, 36], lens: { src: [93, 215, 270, 142] }, at: [I + 120, 261], click: true, hover: "dd" },
        { caption: "Gulir ke bawah daftar acara, lalu klik Tambah acara.", focus: F.body, mark: [I, y2, IW, 36], lens: { src: [93, y2 - 8, 270, 52] }, scroll: { id: "list", dy: DY },
          at: [I + IW / 2, y2 + 18], click: true, show: ["item2"], dur: 3.6 },
        { caption: "Kotak Acara 2 muncul. Klik kotak Nama acara.", focus: [72, y2 - 8, 327, 908 - y2], mark: nameM, lens: nameL, at: [I + 120, nameY + 38], click: true, show: ["nFocus"] },
        { caption: "Ketik nama acara, misalnya Resepsi. Judul kotaknya ikut berganti.", mark: nameM, lens: nameL, show: ["nTyped", "title2"], type: [{ id: "nTyped", n: 7, box: [I + 20, nameY + 27, tw("Resepsi", 14) + 2, 22] }], dur: 3.4 },
        { caption: "Isi Mulai dan Selesai. Selesai lebih awal? Muncul pesan merah.", mark: endM, lens: timeL, hide: ["nFocus"], show: ["nBlur", "times"], at: [I + 120, endY + 38], click: true, dur: 3.6 },
        { caption: "Perbaiki jam Selesai, misalnya 14.00. Pesan merah hilang.", mark: endM, lens: timeL, at: [I + 60, endY + 38], click: true, show: ["fixed"] }
      ]
    };
  })(),

  "editor-tambah-acara-pratinjau": {
    title: "Acara baru di pratinjau",
    base: [...editor("Konten"), nkHead(0, 0, "Konten", { account: ACCOUNT }), kList({ left: 5, link: "Ganti foto sampul", open: "Acara & Tanggal", fill: fillAcara(EVS.slice(0, 2)) }).svg, pvEvents(["akad"])],
    els: { pv2: { svg: pvEvents(["akad", "resepsi"]), enter: "fade", delay: 0.4, skel: true } },
    steps: [{ caption: "Acara baru tampil di pratinjau, lengkap dengan jamnya.", focus: F.pv, mark: { box: [751, EV.resepsi.y, 342, EV.resepsi.h], r: 14 }, lens: { src: [745, EV.resepsi.y - 6, 354, EV.resepsi.h + 12] }, show: ["pv2"], at: [922, 640], dur: 3.6 }]
  },

  // ---------------------------------------------------------------------------------------------------------------------
  "editor-galeri-pilih-foto": {
    title: "Memilih foto galeri dari Media Scalev",
    base: [...editor("Konten"), nkHead(0, 0, "Konten", { account: ACCOUNT }), panelBody(GAL.top(0), GAL.rest(471)), pvCover("Rani & Dimas")],
    els: {
      dlg: { svg: GAL.dlg, enter: "rise", skel: true },
      s1: { svg: GAL.pick(0), enter: "pop", origin: [75, 350], skel: true },
      b1: { svg: GAL.foot(1), enter: "fade", skel: true },
      s2: { svg: GAL.pick(4), enter: "pop", origin: [199, 474], skel: true },
      b2: { svg: GAL.foot(2), enter: "fade", skel: true },
      after: { svg: GAL.after(), enter: "fade", skel: true }
    },
    steps: [
      { caption: "Klik Tambah foto. Jendela Pilih foto berisi foto Media Scalev.", focus: F.side, mark: [I, 471, IW, 36], note: "Tambah foto", at: [I + IW / 2, 489], click: true, show: ["dlg"] },
      { caption: "Klik foto yang ingin dipakai. Foto terpilih diberi tanda centang.", focus: [0, 285, 399, 554], mark: [16, 291, 118, 118], lens: { src: [8, 283, 254, 130] }, at: [75, 350], click: true, show: ["s1", "b1"] },
      { caption: "Klik foto lain bila perlu. Tombolnya kini Pakai 2 foto.", focus: [[0, 285, 399, 554], [0, 839, 399, 61]], mark: [140, 415, 118, 118], lens: { src: [132, 407, 256, 130] }, at: [199, 474], click: true, show: ["s2", "b2"] },
      { caption: "Klik Pakai 2 foto. Foto masuk daftar Foto galeri (2).", focus: [[0, 839, 399, 61], [72, 440, 327, 240]], mark: [16, 851, 366, 36], lens: { src: [93, 443, 270, 230] },
        at: [199, 869], click: true, press: "b2", hide: ["dlg", "s1", "b1", "s2", "b2"], show: ["after"], dur: 3.6 }
    ]
  },

  "editor-galeri-pratinjau": {
    title: "Galeri Foto di pratinjau",
    base: [...editor("Konten"), nkHead(0, 0, "Konten", { account: ACCOUNT }), GAL.after(), pvCover("Rani & Dimas")],
    els: { pvG: { svg: pvGallery(), enter: "fade", delay: 0.4, skel: true } },
    steps: [{ caption: "Galeri tampil di pratinjau. Foto pertama tampil paling besar.", focus: F.pv, mark: { box: [751, 305, 342, 236], r: 10 }, note: "Foto pertama paling besar", show: ["pvG"], at: [1000, 640], dur: 3.6 }]
  },

  // ---------------------------------------------------------------------------------------------------------------------
  "editor-isi-galeri": (() => {
    const [dClear, dTyped, dTy] = typeIn(I + 81, 480, 127, "Lamaran kami");
    const g = { from: 5, raw: true };
    const vK = kList({ ...g, top: 191, open: "Kisah Cinta", fill: fillKisah });
    const DK = vK.at.Video - 330;
    const vV = kListAt("Video", 330, { ...g, open: "Video", fill: fillVideo });
    const DV = vV.at["Dress Code"] - 330;
    const vD = kListAt("Dress Code", 330, { ...g, open: "Dress Code", fill: fillDress });
    return {
      title: "Mengisi Galeri Foto, Kisah Cinta, Video, dan Dress Code",
      base: [...editor("Konten"), nkHead(0, 0, "Konten", { account: ACCOUNT }), kList({ from: 5, top: 191, todo: ["Galeri Foto"] }).svg, pvCover("Rani & Dimas")],
      els: {
        after: { svg: GAL.after(), enter: "fade", skel: true },
        dClear: { svg: dClear, enter: "fade", skel: true },
        dTyped: { svg: dTyped, enter: "fade", skel: true },
        vK: { svg: vK.svg, enter: "fade", skel: true },
        vV: { svg: vV.svg, enter: "fade", skel: true },
        vD: { svg: vD.svg, enter: "fade", skel: true },
        vAll: { svg: kList({ from: 5, top: 191 }).svg, enter: "fade", skel: true },
        lidK: { svg: lid("Konten"), skel: true },
        sBtn: { svg: simpanBtn(), skel: true }
      },
      steps: [
        { caption: "Klik Konten, lalu Galeri Foto. Foto dari Tambah foto ada di daftar.", focus: [72, 241, 327, 659], mark: accM(249), lens: { src: [80, 241, 295, 60] }, at: [190, 274], click: true, show: ["after"] },
        { caption: "Isi Deskripsi foto. Foto pertama tampil paling besar.", focus: [I - 8, 463, IW + 16, 112], mark: [I + 81, 480, 127, 36], lens: { src: [I - 8, 467, IW + 16, 104] },
          at: [245, 498], click: true, show: ["dClear", "dTyped"], type: [{ id: "dTyped", ...dTy }], dur: 3.6 },
        { caption: "Klik Kisah Cinta. Ganti Waktu, Judul, dan Cerita tiap momen.", focus: [72, 183, 327, 717], mark: accM(191), lens: { src: [80, 183, 295, 126] }, hide: ["dClear", "dTyped"], at: [190, 216], click: true, show: ["vK"], dur: 3.4 },
        { caption: "Klik Video. Ganti Tautan YouTube dengan video klien.", focus: F.body, mark: accM(330), lens: { src: [80, 322, 295, 320] }, hide: ["after"], scroll: { id: "vK", dy: DK }, at: [190, 355], click: true, show: ["vV"], dur: 3.6 },
        { caption: "Isi Dress Code dan Susunan Acara bila dipakai.", mark: accM(330), lens: { src: [80, 322, 295, 238] }, hide: ["vK"], scroll: { id: "vV", dy: DV }, at: [190, 355], click: true, show: ["vD"], dur: 3.6 },
        { caption: "Periksa tanda Terisi. Status Tersimpan? Klik Simpan di Scalev.", focus: [F.body, F.foot, F.save], mark: [{ box: [317, 207, 37, 18 + 58 * 8], r: 9 }, FOOT, { box: SIMPAN, r: 4 }],
          lens: { src: [84, 183, 287, 240] }, hide: ["vV"], show: ["vAll"], at: ED.simpan, press: "sBtn", dur: 3.8 }
      ]
    };
  })(),

  // ---------------------------------------------------------------------------------------------------------------------
  "editor-rsvp-hadiah": (() => {
    // RSVP & Ucapan open (sample: allowMaybe off, maxGuests 2, the four "Tanyakan juga" switches on).
    const rs = col(I, 223, IW).field("Judul", "Ucapan & Kehadiran", { ph: true });
    const noteY = rs.y;
    rs.add(rect(I, noteY, IW, 38, { r: 4, fill: C.primarySoft }) + rich(I + 12, noteY + 24, ["Tersambung. ID: ", { t: "365671" }], { fill: C.strong }), 50);
    const formY = rs.y + 20;
    rs.field("Isi form", "Ucapan + konfirmasi hadir", { select: true });
    const guestsY = rs.y + 20;
    rs.field("Jumlah tamu paling banyak per undangan", "2 orang", { select: true })
      .field("Tenggat konfirmasi (opsional)", "07/02/2027, 23.59", { icon: "calendar", hint: ["Setelah lewat, form ditutup; daftar ucapan", "tetap tampil."] })
      .toggle("Tampilkan jumlah kehadiran", true, ["Mis. \"120 konfirmasi hadir\" di atas daftar", "ucapan."])
      .toggle("Pilihan \"Masih ragu\"", false, ["Mati: tamu hanya memilih Hadir atau Tidak", "hadir."]).h3("Tanyakan juga")
      .toggle("Tamu dari pihak mana", true).toggle("Acara yang dihadiri", true, ["Butuh minimal 2 acara."]).toggle("Perkiraan jam datang", true)
      .toggle("Minta nomor WhatsApp tamu", true, ["Tamu mengisi nomornya sendiri di form (boleh", "kosong). Nomor tampil di Dashboard."]).lead("Jawaban tampil di Dashboard.")
      .toggle(["Tampilkan QR masuk untuk tamu", "undangan khusus"], false, ["Hanya berlaku bila Undangan khusus menyala", "(di Bagikan). Tamu yang menjawab Hadir", "melihat QR ini di kartu terima kasih RSVP;", "penerima tamu memindainya di halaman Check-in."]);
    const accY = rs.y + 8;
    const DY = accY + 2 * 58 - 169; // scroll so Amplop Digital's bar lands at y 169, where the opened group stays
    const accs = ["Siaran Langsung", "Filter Kamera", "Amplop Digital", "Aturan Tamu", "Turut Mengundang"].map((t, i) => acc(accY + i * 58, t, "Terisi")).join("");
    const rsvp = () => rect(72, 153, 327, 747 + DY, { fill: C.white }) + acc(111, "Susunan Acara", "Terisi") + acc(169, "RSVP & Ucapan", "Terisi", 1400) + rect(P + 1, accY - 9, PW - 2, 1400, { fill: C.white }) + line(P, accY - 8.5, P + PW, accY - 8.5) +
      rs.svg + accs;
    const ddMode = shadow(I, formY + 38, IW, 80, 6, 2) + rect(I, formY + 38, IW, 80, { r: 6, fill: C.white, stroke: C.field }) + rect(I + 4, formY + 42, IW - 8, 24, { r: 4, fill: C.primarySoft }) +
      ["Ucapan + konfirmasi hadir", "Ucapan saja", "Konfirmasi hadir saja"].map((v, i) => text(I + 14, formY + 59 + i * 24, v, { size: 14, fill: C.strong })).join("") + iconX("check", I + IW - 18, formY + 54, 14, C.action);
    const gifts = kListAt("Amplop Digital", 169, { open: "Amplop Digital", fill: fillGifts, raw: true });
    const D6 = gifts.f["WhatsApp konfirmasi"] - 450, waY = 470;
    const [waClear, waTyped, waTy] = typeIn(I, waY, IW, "081298765432");
    const turutY = gifts.at["Turut Mengundang"] - D6;
    const vF = kListAt("Turut Mengundang", turutY, { open: "Turut Mengundang", fill: fillFamilies, raw: true });
    const D8 = vF.at["Kaki Halaman"] - 330;
    const vKaki = kListAt("Kaki Halaman", 330, { open: "Kaki Halaman", fill: fillFooter }), brandY = vKaki.f["Nama brand"] + 20;
    return {
      title: "Mengatur RSVP, Amplop Digital, dan bagian penutup",
      base: [...editor("Konten"), kListAt("RSVP & Ucapan", 169).svg, pvCover("Rani & Dimas")],
      els: {
        list1: { svg: rsvp(), enter: "fade", skel: true },
        ddMode: { svg: ddMode, enter: "pop", origin: [I + IW / 2, formY + 36], skel: true },
        ddG: { svg: shadow(I, guestsY + 38, IW, 152, 6, 2) + rect(I, guestsY + 38, IW, 152, { r: 6, fill: C.white, stroke: C.field }) + rect(I + 4, guestsY + 66, IW - 8, 24, { r: 4, fill: C.primarySoft }) +
          [1, 2, 3, 4, 5, 6].map((n, i) => text(I + 14, guestsY + 59 + i * 24, `${n} orang`, { size: 14, fill: C.strong })).join("") + iconX("check", I + IW - 18, guestsY + 78, 14, C.action), enter: "pop", origin: [I + IW / 2, guestsY + 36], skel: true },
        list2: { svg: rsvp(), enter: "fade", delay: -1.3, skel: true },
        gifts: { svg: gifts.svg, enter: "fade", skel: true },
        pvGift: { svg: pvGift(), enter: "fade", delay: 0.3, skel: true },
        waClear: { svg: waClear, enter: "fade", skel: true },
        waTyped: { svg: waTyped, enter: "fade", skel: true },
        vF: { svg: vF.svg, enter: "fade", skel: true },
        vKaki: { svg: vKaki.svg, enter: "fade", skel: true },
        lidE: { svg: lid("Konten"), skel: true },
        sBtn: { svg: simpanBtn(), skel: true }
      },
      steps: [
        { caption: "Klik Konten, lalu klik RSVP & Ucapan. Bagian terbuka.", focus: F.body, mark: accM(169), lens: { src: [80, 161, 295, 120] }, at: [190, 194], click: true, show: ["list1"] },
        { caption: "Pastikan tertulis Tersambung. ID: diikuti angka ID halaman.", focus: [80, noteY - 8, 295, 54], mark: [I, noteY, IW, 38], lens: { src: [93, noteY - 8, 270, 54] }, at: [I + 150, noteY + 19] },
        { caption: "Pilih Isi form, misalnya Ucapan + konfirmasi hadir.", focus: [80, formY - 28, 295, 156], mark: [I, formY, IW, 36], lens: { src: [93, formY - 24, 270, 144] }, hover: "ddMode", at: [I + 120, formY + 18], click: true },
        { caption: "Pilih Jumlah tamu paling banyak per undangan, lalu atur sakelar Tanyakan juga.", focus: [80, guestsY - 28, 295, 226], mark: [I, guestsY, IW, 36], lens: { src: [93, guestsY - 24, 270, 220] },
          hover: "ddG", at: [I + 120, guestsY + 18], click: true },
        { caption: "Klik Amplop Digital, lalu ganti rekening contoh 1234567890.", focus: [F.body, F.pv], mark: accM(169), lens: { src: [80, 161, 295, 200] },
          show: ["list2", "gifts", "pvGift"], scroll: { id: "list2", dy: DY }, at: [190, 194], click: true, dur: 3.8 },
        { caption: "Masih di Amplop Digital, isi WhatsApp konfirmasi dengan nomor klien.", focus: F.body, mark: [I, waY, IW, 36], lens: { src: [93, waY - 28, 270, 72] }, hide: ["list1", "list2"], scroll: { id: "gifts", dy: D6 },
          at: [230, waY + 18], click: true, show: ["waClear", "waTyped"], type: [{ id: "waTyped", ...waTy }], dur: 3.8 },
        { caption: "Isi Turut Mengundang dan Salam Penutup.", focus: [72, turutY - 8, 327, 908 - turutY], mark: accM(turutY), lens: { src: [80, turutY - 8, 295, 120] }, at: [190, turutY + 25], click: true, show: ["vF"], dur: 3.4 },
        { caption: "Periksa Kaki Halaman: nama brand dan WhatsApp pemesanan milik usahamu.", focus: F.body, mark: accM(330), lens: { src: [93, 322, 270, brandY + 44 - 322] },
          hide: ["gifts", "waClear", "waTyped"], scroll: { id: "vF", dy: D8 }, at: [190, 355], click: true, show: ["vKaki"], dur: 3.8 },
        { caption: "Simpan: tunggu status Tersimpan, lalu klik Simpan di Scalev.", focus: [F.foot, F.save], mark: [FOOT, { box: SIMPAN, r: 4 }], lens: FOOT_LENS, hide: ["vF"], at: ED.simpan, press: "sBtn" }
      ]
    };
  })()
};
