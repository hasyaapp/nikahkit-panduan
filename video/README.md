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
