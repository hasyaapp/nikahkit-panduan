# Video panduan

Video bernarasi dari animasi panduan (`anim/scenes`). Satu seri = beberapa animasi berurutan, didefinisikan di `series.json`
(`slug`, `title`, `chapters` [nama animasi, judul bab], `intro`, `outro`).

```
npm run video -- panduan-kreator-nikahin ~/Desktop
```

Hasil: `<folder>/<slug>.mp4` (1920x1080) dan `<slug>-bab.txt` (daftar bab). Tanpa folder, hasilnya di `video/out/`.
Video yang sudah diunggah disimpan di `~/Movies/Nikahin Video Panduan/` (`1 Member`, `2 Kreator` bernomor sesuai urutan
playlist, `3 Ringkasan`, `9 Arsip`), dengan `Daftar video.csv` berisi judul, ID YouTube, playlist, dan status. Render baru
masuk ke `_baru/` di folder itu. `video/out/frames` dan `video/out/seg` hanya berkas sementara dan boleh dihapus;
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

- `src/kirim-undangan/`: cara kirim undangan ke tamu, tegak 1080x1920. `naskah.js` = teks narasi per kalimat (id dipakai
  adegan), `Video.jsx` = adegan yang dijangkarkan ke kata narasi, `rekam-layar.mjs` = perekam layar asli.
- `npm run layar`: membuka halaman dashboard hasil build (`server/pages/panel/scalev_panel.html`) di Chrome tanpa jendela
  dengan API tiruan (data contoh Rani & Dimas, tidak menyentuh produksi), menjalankan alurnya di layar HP 393x744, lalu
  menyimpan gambarnya ke `public/kirim-undangan/layar/` dan kotak tiap elemen ke `src/kirim-undangan/layar.json`.
  Jalankan ulang bila halaman Kirim berubah, lalu render ulang.
- `npm run waktu`: whisper.cpp (`brew install whisper-cpp`, model `ggml-large-v3-turbo-q5_0.bin` di
  `~/Library/Caches/whisper.cpp/`) mencari waktu tiap kata `naskah.js` di `public/kirim-undangan/narasi.*`, hasilnya
  `src/kirim-undangan/waktu.json`. Narasi diganti: jalankan ini dulu. Bandingkan dua rekaman tanpa menulis:
  `node alat/waktu.mjs kirim-undangan <file> --cek`.
- `npm run studio` untuk melihat di browser, `npm run render` untuk `out/kirim-undangan.mp4`. Hasil yang dipakai disalin
  ke `~/Movies/Nikahin Video Panduan/_baru/`.
- Narasi ElevenLabs dibuat di akun yang kuncinya di Keychain `nikahin-elevenlabs-6` (akun `api`).
