# Video panduan

Video bernarasi dari animasi panduan (`anim/scenes`). Satu seri = beberapa animasi berurutan, didefinisikan di `series.json`
(`slug`, `title`, `chapters` [nama animasi, judul bab], `intro`, `outro`).

```
npm run video -- panduan-kreator-nikahin ~/Desktop
```

Hasil: `<folder>/<slug>.mp4` (1920x1080) dan `<slug>-bab.txt` (daftar bab). Tanpa folder, hasilnya di `video/out/`.

- Narasi tiap langkah = teks langkah di `<desc>` SVG animasinya, dibaca ElevenLabs (suara Sarah, model eleven_v4, bahasa
  Indonesia). Jalankan `node panduan/anim/build.mjs` dulu bila adegan berubah.
- Narasi disimpan per teks di `video/cache/`, jadi hanya langkah yang teksnya berubah yang dibayar lagi. Jumlah huruf baru
  tertulis di akhir.
- Kunci API dari Keychain macOS: layanan `nikahin-elevenlabs`, akun `api`.
- Perlu `ffmpeg`/`ffprobe` dan Chrome seperti `anim/frames.mjs` (`CHROME=<path>` untuk browser lain).
