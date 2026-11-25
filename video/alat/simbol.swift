// swift alat/simbol.swift  →  public/simbol/<berkas>.png (hitam di latar transparan) dan src/ui/simbol.json (ukuran asli
// tiap simbol pada 100 pt). Ikon bilah status iOS, Safari, macOS, dan WhatsApp iOS diambil dari SF Symbols bawaan macOS
// (NSImage(systemSymbolName:)), jadi bentuknya sama dengan yang dipakai Apple. Gambar tidak masuk git (public/ diabaikan).
import AppKit
import Foundation

let akar = URL(fileURLWithPath: #filePath).deletingLastPathComponent().deletingLastPathComponent()
let keluar = akar.appendingPathComponent("public/simbol")

// [berkas, simbol, bobot, berlapis]. Berlapis = warna hierarkis (mis. bingkai baterai lebih pudar dari isinya).
let DAFTAR: [(String, String, NSFont.Weight, Bool)] = [
  ("sinyal", "cellularbars", .semibold, false),
  ("wifi", "wifi", .semibold, false),
  ("baterai", "battery.100", .regular, true),
  ("apple", "apple.logo", .regular, false),
  ("cari", "magnifyingglass", .regular, false),
  ("cari-tebal", "magnifyingglass", .medium, false),
  ("pusat-kontrol", "switch.2", .regular, false),
  ("bilah-samping", "sidebar.left", .regular, false),
  ("kembali", "chevron.backward", .regular, false),
  ("kembali-tebal", "chevron.backward", .semibold, false),
  ("maju", "chevron.forward", .regular, false),
  ("muat-ulang", "arrow.clockwise", .regular, false),
  ("bagikan", "square.and.arrow.up", .regular, false),
  ("tambah", "plus", .regular, false),
  ("tab", "square.on.square", .regular, false),
  ("perisai", "shield.lefthalf.filled", .regular, false),
  ("halaman", "text.page", .regular, false),
  ("lainnya", "ellipsis", .semibold, false),
  ("video", "video", .regular, false),
  ("telepon", "phone", .regular, false),
  ("kamera", "camera", .regular, false),
  ("mik", "mic", .regular, false),
  ("kirim", "paperplane.fill", .regular, false),
  ("centang", "checkmark", .bold, false),
  ("tutup", "xmark", .semibold, false),
  ("segitiga", "arrowtriangle.backward.fill", .regular, false),
  ("hapus-isian", "xmark.circle.fill", .regular, false),
  ("dipilih", "checkmark.circle.fill", .regular, false),
]

var info: [String: Any] = [:]
try FileManager.default.createDirectory(at: keluar, withIntermediateDirectories: true)
for (berkas, nama, bobot, berlapis) in DAFTAR {
  guard let dasar = NSImage(systemSymbolName: nama, accessibilityDescription: nil) else { print("tidak ada di macOS ini:", nama); continue }
  var cfg = NSImage.SymbolConfiguration(pointSize: 100, weight: bobot)
  if berlapis { cfg = cfg.applying(NSImage.SymbolConfiguration(hierarchicalColor: .black)) }
  let img = dasar.withSymbolConfiguration(cfg)!
  let ukuran = img.size, skala: CGFloat = 4
  let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: Int((ukuran.width * skala).rounded(.up)), pixelsHigh: Int((ukuran.height * skala).rounded(.up)),
                             bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
  rep.size = ukuran
  NSGraphicsContext.saveGraphicsState()
  NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
  img.draw(in: NSRect(origin: .zero, size: ukuran))
  NSGraphicsContext.restoreGraphicsState()
  try rep.representation(using: .png, properties: [:])!.write(to: keluar.appendingPathComponent(berkas + ".png"))
  info[berkas] = ["simbol": nama, "w": (ukuran.width * 10).rounded() / 10, "h": (ukuran.height * 10).rounded() / 10]
}
try JSONSerialization.data(withJSONObject: info, options: [.prettyPrinted, .sortedKeys]).write(to: akar.appendingPathComponent("src/ui/simbol.json"))
print("\(info.count) simbol → public/simbol")
