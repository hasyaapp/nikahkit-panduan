// Daftar video panduan Remotion. Tambah video baru: folder src/<video>/ (naskah.js, Video.jsx), aset di public/<video>/.
// Satu video, dua tata letak (ui/dasar.js TATA): tegak untuk Shorts/TikTok/Reels, lanskap untuk YouTube dan panduan.
import { Composition } from "remotion";
import { FPS, TATA } from "./ui/dasar";
import { DURASI, KirimUndangan } from "./kirim-undangan/Video";

export const Root = () => (
  <>
    <Composition id="KirimUndangan" component={KirimUndangan} defaultProps={{ format: "tegak" }} durationInFrames={DURASI} fps={FPS}
      width={TATA.tegak.W} height={TATA.tegak.H} />
    <Composition id="KirimUndanganLanskap" component={KirimUndangan} defaultProps={{ format: "lanskap" }} durationInFrames={DURASI} fps={FPS}
      width={TATA.lanskap.W} height={TATA.lanskap.H} />
  </>
);
