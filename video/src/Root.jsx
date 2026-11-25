// Daftar video panduan Remotion. Tambah video baru: folder src/<video>/ (naskah.js, Video.jsx), aset di public/<video>/.
import { Composition } from "remotion";
import { FPS, H, W } from "./ui/dasar";
import { DURASI, KirimUndangan } from "./kirim-undangan/Video";

export const Root = () => (
  <Composition id="KirimUndangan" component={KirimUndangan} durationInFrames={DURASI} fps={FPS} width={W} height={H} />
);
