# Video panduan

Video bernarasi dari animasi panduan (`anim/scenes`). Satu seri = beberapa animasi berurutan, didefinisikan di `series.json`
(`slug`, `title`, `chapters` [nama animasi, judul bab], `intro`, `outro`).

```
npm run video -- panduan-kreator-nikahin ~/Desktop
```

Hasil: `<folder>/<slug>.mp4` (1920x1080) dan `<slug>-bab.txt` (daftar bab). Tanpa folder, hasilnya di `video/out/`.
Video final yang sudah diunggah tidak disimpan lokal (dihapus 25 Nov atas permintaan pemilik; render ulang dari repo bila
perlu). Katalog `Daftar video.csv` (judul, ID YouTube, playlist, status), uji suara, rekaman mentah, dan video tidak publik
ada di `video/arsip/` (tidak masuk git). Render baru menunggu dicek di `video/out/`. `video/out/frames` dan `video/out/seg` hanya berkas sementara dan boleh dihapus;
`video/cache` jangan dihapus (narasi yang sudah dibayar).

- Narasi tiap langkah = teks langkah di `<desc>` SVG animasinya, dibaca ElevenLabs (suara Sarah, model eleven_v4, bahasa
  Indonesia). Jalankan `node panduan/anim/build.mjs` dulu bila adegan berubah.
- Narasi disimpan per teks di `video/cache/`, jadi hanya langkah yang teksnya berubah yang dibayar lagi. Jumlah huruf baru
  tertulis di akhir.
- Kunci API dari Keychain macOS: layanan `nikahin-elevenlabs`, akun `api`. Kuota akun itu habis? Pakai kunci lain yang
  tersimpan dengan `ELEVEN_KEYCHAIN=<nama layanan>` (mis. `nikahin-elevenlabs-2`); suara Sarah sama di semua akun.
- Perlu `ffmpeg`/`ffprobe` dan Chrome seperti `anim/frames.mjs` (`CHROME=<path>` untuk browser lain).

## Remotion

Video panduan berikutnya dibuat dengan [Remotion](https://www.remotion.dev) dari audio narasi dan skripnya; `build.mjs`
tetap untuk seri yang sudah ada. Versi dipaku di `package.json` folder ini (Remotion 4.0.547, React 19.3.1): pasang dengan
`npm ci` di `panduan/video`. Render pertama mengunduh Chrome Headless Shell ke `node_modules/.remotion`; FFmpeg ikut paket
Remotion. Hasil render ke `out/`.

Satu video = `src/<video>/` (naskah, adegan, waktu, kotak layar) dan `public/<video>/` (narasi dan gambar layar, tidak
masuk git; narasi jangan dihapus). Semua perintah dijalankan di `panduan/video`.

- `src/kirim-undangan/`: cara kirim undangan ke tamu, satu adegan dalam dua tata letak (`TATA` di `src/ui/dasar.js`):
  tegak 1080x1920 (`KirimUndangan`, Shorts/TikTok/Reels) dan lanskap 1920x1080 (`KirimUndanganLanskap`, YouTube dan
  sematan panduan). `naskah.js` = teks narasi per kalimat (id dipakai adegan), `Video.jsx` = adegan yang dijangkarkan ke
  kata narasi, `rekam-layar.mjs` = perekam layar asli.
- Tampilan: iPhone 18 Pro (layar 402x874 pt, Safari iOS 26, WhatsApp iOS digambar ulang di `src/ui/wa/`: lembar Kirim ke,
  foto profil bawaan pastel) dan MacBook Neo untuk adegan laptop. Warna dan huruf merek Nikahin (Gelica, Nunito, coklat
  `#2b1a07`, oranye `#ff6f1e`/`#b8460d`, krem) di `src/ui/dasar.js`. Domain contoh di video ini `nikahin.id` (keputusan
  pemilik, 25 Nov), bukan `tokomu.myscalev.com`. Ringkasan undangan di Beranda serba 0 (undangan baru diserahkan).
- Tegak, zona aman (longgar): semua isi di dalam `aman` x 80-1000, y 170-1590 (bebas dari kepala dan keterangan
  Shorts/TikTok/Reels). Dari atas, dengan jarak lega di antaranya: garis langkah 1-5, judul, panggung ponsel, teks narasi.
- Lanskap: ponsel di kiri (panggung x 100-940, y 60-1020), di kolom kanan (x 1020-1820) garis langkah, judul, dan teks
  narasi berkelompok di tengah tinggi kanvas. Kartu dan pil tetap di atas ponsel, seperti versi tegak.
- Keduanya: ponsel selalu di tengah panggung dan perbesaran paling besar `kmaks` (bingkai utuh selebar panggung), jadi
  sisi kiri-kanan ponsel tidak pernah terpotong; hanya atas dan bawah panggung yang memudar lembut saat diperbesar. Kartu
  dan pil diletakkan sebagai bagian dari tinggi panggung. Laptop utuh (tegak selebar kanvas, lanskap 920 px; boleh keluar
  zona aman, keputusan pemilik) dan tidak diperbesar.
- Ikon: SF Symbols untuk bilah status iOS, Safari, macOS, dan WhatsApp (`swift alat/simbol.swift` → `public/simbol/`,
  ukurannya di `src/ui/simbol.json`); Lucide (`lucide-react`) untuk kartu, pil, dan garis langkah.
- `swift alat/mockup.swift`: merender model 3D Apple (.usdz, disalin ke `~/Library/Caches/nikahin-mockup/`) jadi
  `public/mockup/iphone.png` dan `macbook.png` dengan layar transparan, kotak layarnya ke `src/ui/mockup.json`. iPhone 18
  Pro dari apple.com (kamera ortografis, tampak depan); laptop = MacBook Neo dari pustaka model 3D Apple di Mac ini
  (pilihan pemilik, layar 1280x802 pt tanpa takik), dirender apa adanya seperti foto produk: kamera perspektif (sudut
  pandang 22°) tegak lurus layar, jadi layar tetap persegi panjang dan badan serta papan ketiknya tidak gepeng.
- `node alat/sfx.mjs`: menyalin efek suara di `src/ui/sfx.json` dari pustaka Boombox Studio di Mac ini ke `public/sounds/`
  (lisensi pengguna; hanya berkas yang dipakai, tidak masuk git).
- `npm run layar`: membuka halaman dashboard hasil build (`server/pages/panel/scalev_panel.html`) di Chrome tanpa jendela
  dengan API tiruan (data contoh Rani & Dimas, tidak menyentuh produksi), menjalankan alurnya dengan profil Safari iPhone
  (isi web 402x728) dan MacBook (1280x726, tinggi dari `mockup.json`), lalu menyimpan gambarnya ke `public/kirim-undangan/layar/` (juga ikon
  WhatsApp dari App Store) dan kotak tiap elemen ke `src/kirim-undangan/layar.json`. Jalankan ulang bila halaman Kirim
  berubah, lalu render ulang.
- `npm run uji`: uji daftar tamu Kirim dengan data terburuk (nama panjang, emoji, nama kembar, satu tamu, kosong, 1.200
  baris) di lebar 320, 402, 1280, dan zoom 200%: gambar dan fakta DOM ke `out/uji/`, lalu server tetap jalan dengan
  pengalih data di bawah tengah layar (`?data=demo|terburuk|kosong|satu|seribu`). Pengalih itu hanya ada di alat ini.
- `npm run waktu`: whisper.cpp (`brew install whisper-cpp`, model `ggml-large-v3-turbo-q5_0.bin` di
  `~/Library/Caches/whisper.cpp/`) mencari waktu tiap kata `naskah.js` di `public/kirim-undangan/narasi.*`, hasilnya
  `src/kirim-undangan/waktu.json`. Narasi diganti: jalankan ini dulu. Bandingkan dua rekaman tanpa menulis:
  `node alat/waktu.mjs kirim-undangan <file> --cek`.
- `npm run studio` untuk melihat di browser, `npm run render` untuk `out/kirim-undangan.mp4` (tegak) dan
  `npm run render:lanskap` untuk `out/kirim-undangan-lanskap.mp4`; berkas itu yang dicek dan diunggah.
- Narasi ElevenLabs dibuat di akun yang kuncinya di Keychain `nikahin-elevenlabs-6` (akun `api`). `narasi.mp3` sudah
  dinormalkan ke -16 LUFS (ffmpeg loudnorm); rekaman aslinya `narasi-asli.mp3` di folder yang sama.
