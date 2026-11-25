// swift alat/mockup.swift  →  public/mockup/{iphone,macbook}.png (bingkai perangkat, layar bolong transparan) dan
// src/ui/mockup.json (kotak layar dalam px gambar itu, jari-jari sudutnya). Model AR Apple (.usdz) dirender lewat
// SceneKit dari depan, tegak lurus layar. Gambar tidak masuk git (public/ diabaikan); model disimpan di cache.
// iPhone 18 Pro dari apple.com; laptop = MacBook Neo dari pustaka model 3D Apple milik pemilik (berkas lokal, disalin ke
// cache), pilihan pemilik 25 Nov.
import AppKit
import Foundation
import SceneKit

let akar = URL(fileURLWithPath: #filePath).deletingLastPathComponent().deletingLastPathComponent()
let cache = FileManager.default.homeDirectoryForCurrentUser.appendingPathComponent("Library/Caches/nikahin-mockup")
let keluar = akar.appendingPathComponent("public/mockup")

struct Model {
  let nama, berkas, sumber, layar: String  // berkas = nama di cache; sumber = URL unduhan atau jalur berkas lokal
  let sembunyi: [String]  // simpul yang tidak ikut (iPhone: model kedua yang tampak belakang)
  let tinggi: Int?, lebar: Int?  // ukuran gambar keluaran
}
let MODEL = [
  Model(nama: "iphone", berkas: "iphone.usdz", sumber: "https://www.apple.com/105/media/us/iphone-18-pro/2026/591df885-5ee2-4173-86e6-401021249f7c/ar/iphone-18-pro-e-sim.usdz",
        layar: "EHjrGDHNHzgNjtE", sembunyi: ["wUOhcMgiBmCgGaw"], tinggi: 2600, lebar: nil),
  Model(nama: "macbook", berkas: "macbook-neo.usdz", sumber: "/Users/hasyaapp/orca/projects/full-visual/doc/keyframes/workspace/library/apple-3d/macbook-neo.usdz",
        layar: "rvnQqsVlUxgRHpf", sembunyi: [], tinggi: nil, lebar: 2600),
]

func unduh(_ m: Model) throws -> URL {
  let f = cache.appendingPathComponent(m.berkas)
  if !FileManager.default.fileExists(atPath: f.path) {
    try FileManager.default.createDirectory(at: cache, withIntermediateDirectories: true)
    if m.sumber.hasPrefix("/") { try FileManager.default.copyItem(at: URL(fileURLWithPath: m.sumber), to: f) }
    else { try Data(contentsOf: URL(string: m.sumber)!).write(to: f) }
  }
  return f
}

// Sudut-sudut kotak batas simpul dalam koordinat dunia.
func sudut(_ n: SCNNode) -> [SCNVector3] {
  let (a, b) = n.boundingBox
  return [a.x, b.x].flatMap { x in [a.y, b.y].flatMap { y in [a.z, b.z].map { z in n.convertPosition(SCNVector3(x, y, z), to: nil) } } }
}

// Lingkungan cahaya studio sederhana (atas terang, bawah gelap) untuk pantulan bahan PBR.
func studio() -> CGImage {
  let w = 512, h = 256
  let ctx = CGContext(data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: 0, space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue)!
  let g = CGGradient(colorsSpace: CGColorSpace(name: CGColorSpace.sRGB)!, colors: [NSColor(white: 0.08, alpha: 1).cgColor, NSColor(white: 0.45, alpha: 1).cgColor, NSColor(white: 1, alpha: 1).cgColor] as CFArray, locations: [0, 0.5, 1])!
  ctx.drawLinearGradient(g, start: .zero, end: CGPoint(x: 0, y: h), options: [])
  ctx.setFillColor(NSColor(white: 1, alpha: 1).cgColor)
  ctx.fill(CGRect(x: w / 2 - 60, y: h - 70, width: 120, height: 40))
  return ctx.makeImage()!
}

func piksel(_ img: NSImage, _ w: Int, _ h: Int) -> CGContext {
  let ctx = CGContext(data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4, space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
  ctx.draw(img.cgImage(forProposedRect: nil, context: nil, hints: nil)!, in: CGRect(x: 0, y: 0, width: w, height: h))
  return ctx
}

var info: [String: Any] = [:]
for m in MODEL {
  let scene = try SCNScene(url: try unduh(m), options: nil)
  for s in m.sembunyi { scene.rootNode.childNode(withName: s, recursively: true)!.removeFromParentNode() }
  let layar = scene.rootNode.childNode(withName: m.layar, recursively: true)!

  // Arah pandang: tegak lurus layar. Bidang layar dari kotak batasnya: sumbu tertipis = normal (iPhone: z; laptop: layar
  // miring ke belakang, normalnya dari kemiringan y-z).
  let s = sudut(layar)
  let mn = SCNVector3(s.map(\.x).min()!, s.map(\.y).min()!, s.map(\.z).min()!), mx = SCNVector3(s.map(\.x).max()!, s.map(\.y).max()!, s.map(\.z).max()!)
  let pusat = SCNVector3((mn.x + mx.x) / 2, (mn.y + mx.y) / 2, (mn.z + mx.z) / 2)
  let kamera = SCNNode()
  kamera.camera = SCNCamera()
  kamera.camera!.usesOrthographicProjection = true
  kamera.camera!.zNear = 1
  kamera.camera!.zFar = 400
  var maju: SCNVector3  // dari layar ke arah kamera
  if m.nama == "iphone" {
    maju = SCNVector3(0, 0, -1)  // layar iPhone menghadap -z
    kamera.eulerAngles = SCNVector3(0, CGFloat.pi, 0)
  } else {
    let miring = atan2(mx.z - mn.z, mx.y - mn.y)  // tutup laptop condong ke belakang
    maju = SCNVector3(0, sin(miring), cos(miring))
    kamera.eulerAngles = SCNVector3(-miring, 0, 0)
  }
  kamera.position = SCNVector3(pusat.x + maju.x * 150, pusat.y + maju.y * 150, pusat.z + maju.z * 150)
  scene.rootNode.addChildNode(kamera)

  // Luas pandang dari semua sudut model di bidang kamera, sedikit longgar; tepi kosong dipangkas sesudah render.
  let kanan = kamera.convertVector(SCNVector3(1, 0, 0), to: nil), atas = kamera.convertVector(SCNVector3(0, 1, 0), to: nil)
  let titik = sudut(scene.rootNode).map { p in (p.x * kanan.x + p.y * kanan.y + p.z * kanan.z, p.x * atas.x + p.y * atas.y + p.z * atas.z) }
  let c = (pusat.x * kanan.x + pusat.y * kanan.y + pusat.z * kanan.z, pusat.x * atas.x + pusat.y * atas.y + pusat.z * atas.z)
  let lx = titik.map { abs($0.0 - c.0) }.max()! * 1.04, ly = titik.map { abs($0.1 - c.1) }.max()! * 1.04
  kamera.camera!.orthographicScale = Double(ly)
  let W = m.lebar ?? Int((Double(m.tinggi!) * Double(lx / ly)).rounded()), H = m.tinggi ?? Int((Double(m.lebar!) * Double(ly / lx)).rounded())

  let r = SCNRenderer(device: MTLCreateSystemDefaultDevice(), options: nil)
  r.scene = scene
  r.pointOfView = kamera
  scene.background.contents = NSColor.clear
  scene.lightingEnvironment.contents = studio()
  scene.lightingEnvironment.intensity = 1.4
  let lampu = SCNNode()
  lampu.light = SCNLight()
  lampu.light!.type = .directional
  lampu.light!.intensity = 900
  lampu.eulerAngles = SCNVector3(-0.6, -0.5, 0)
  kamera.addChildNode(lampu)

  // Lintasan 1: tampilan biasa, layar hitam. Lintasan 2: topeng layar (layar putih, sisanya hitam tanpa cahaya).
  let asli = layar.geometry!.materials
  let hitam = SCNMaterial(); hitam.lightingModel = .constant; hitam.diffuse.contents = NSColor.black
  let putih = SCNMaterial(); putih.lightingModel = .constant; putih.diffuse.contents = NSColor.white
  layar.geometry!.materials = [hitam]
  let biasa = piksel(r.snapshot(atTime: 0, with: CGSize(width: W, height: H), antialiasingMode: .multisampling4X), W, H)
  var simpan: [(SCNGeometry, [SCNMaterial])] = []
  scene.rootNode.enumerateHierarchy { n, _ in if let g = n.geometry, n !== layar { simpan.append((g, g.materials)); g.materials = [hitam] } }
  layar.geometry!.materials = [putih]
  scene.lightingEnvironment.contents = nil
  scene.background.contents = NSColor.black
  let topeng = piksel(r.snapshot(atTime: 0, with: CGSize(width: W, height: H), antialiasingMode: .multisampling4X), W, H)
  for (g, ms) in simpan { g.materials = ms }
  layar.geometry!.materials = asli

  // Gabung: alfa = alfa asli x (1 - topeng). Data CGContext: baris 0 = atas gambar.
  let p = biasa.data!.assumingMemoryBound(to: UInt8.self), t = topeng.data!.assumingMemoryBound(to: UInt8.self)
  var a0 = (x: W, y: H), a1 = (x: -1, y: -1), l0 = (x: W, y: H), l1 = (x: -1, y: -1)
  for y in 0..<H { for x in 0..<W {
    let i = (y * W + x) * 4, k = 255 - Int(t[i])
    for j in 0..<4 { p[i + j] = UInt8(Int(p[i + j]) * k / 255) }
    if p[i + 3] > 8 { a0 = (min(a0.x, x), min(a0.y, y)); a1 = (max(a1.x, x), max(a1.y, y)) }
    if t[i] > 127 { l0 = (min(l0.x, x), min(l0.y, y)); l1 = (max(l1.x, x), max(l1.y, y)) }
  } }
  // Jari-jari sudut layar dari diagonal: titik sudut membulat berjarak r(1 - 1/√2) dari pojok kotaknya.
  var d = 0
  while t[((l0.y + d) * W + l0.x + d) * 4] <= 127 { d += 1 }
  let jari = Double(d) / (1 - 1 / 2.0.squareRoot())
  let tepi = 6, x0 = max(0, a0.x - tepi), y0 = max(0, a0.y - tepi), x1 = min(W - 1, a1.x + tepi), y1 = min(H - 1, a1.y + tepi)
  let potong = biasa.makeImage()!.cropping(to: CGRect(x: x0, y: y0, width: x1 - x0 + 1, height: y1 - y0 + 1))!

  try FileManager.default.createDirectory(at: keluar, withIntermediateDirectories: true)
  let f = keluar.appendingPathComponent(m.nama + ".png")
  let dest = CGImageDestinationCreateWithURL(f as CFURL, "public.png" as CFString, 1, nil)!
  CGImageDestinationAddImage(dest, potong, nil)
  CGImageDestinationFinalize(dest)
  info[m.nama] = ["w": potong.width, "h": potong.height, "layar": ["x": l0.x - x0, "y": l0.y - y0, "w": l1.x - l0.x + 1, "h": l1.y - l0.y + 1, "r": (jari * 10).rounded() / 10]]
  print(m.nama, potong.width, "x", potong.height, info[m.nama]!)
}
let json = try JSONSerialization.data(withJSONObject: info, options: [.prettyPrinted, .sortedKeys])
try json.write(to: akar.appendingPathComponent("src/ui/mockup.json"))
