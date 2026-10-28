// JPEG/PNG を AVIF に書き出す（macOS の ImageIO を使う。追加のインストール不要）。
// usage: swiftc -O scripts/encode-avif.swift -o /tmp/encode-avif && /tmp/encode-avif in.jpg out.avif 0.85
// 画質の選び方は scripts/encode-home-images.sh を参照。
import Foundation
import ImageIO

let a = CommandLine.arguments
guard a.count == 4, let q = Double(a[3]),
      let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: a[1]) as CFURL, nil),
      let img = CGImageSourceCreateImageAtIndex(src, 0, nil),
      let dst = CGImageDestinationCreateWithURL(URL(fileURLWithPath: a[2]) as CFURL, "public.avif" as CFString, 1, nil)
else {
  FileHandle.standardError.write("usage: encode-avif in.jpg out.avif quality(0-1)\n".data(using: .utf8)!)
  exit(1)
}
CGImageDestinationAddImage(dst, img, [kCGImageDestinationLossyCompressionQuality: q] as CFDictionary)
exit(CGImageDestinationFinalize(dst) ? 0 : 1)
