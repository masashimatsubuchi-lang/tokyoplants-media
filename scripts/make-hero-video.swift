// iPhoneの画面収録を、LPのヒーローに置ける動画に変換する。
//
// ⚠️ 音声トラックは必ず捨てる。画面収録はマイクで周囲の音を拾っていることがあり、
//    そのまま公開すると意図しない音声を配信してしまう。
//    ここでは映像トラックしか読まないので、出力に音声は入らない。
//
// AVAssetExportSession のプリセットはビットレートを指定できず、
// 5秒の縦動画でも2.5MBほどになってしまう。Instagramからの流入は
// モバイル回線が前提なので、AVAssetWriter で明示的に絞っている。
//
// あわせてポスター画像（読み込み中に出る静止画）も書き出す。
// 冒頭はアイコンが落ちてくる前で画面がさびしいので、終盤のフレームを使う。
//
// ffmpeg は入っていないので AVFoundation で処理している。
//
// Usage:
//     swift scripts/make-hero-video.swift <入力.MOV> <出力先ディレクトリ> [ポスターの秒数]
//
// 出力: <出力先>/hero-falling.mp4, <出力先>/hero-falling-poster.jpg

import AVFoundation
import CoreImage
import Foundation

let OUT_WIDTH: CGFloat = 440          // LPでの表示は最大240pt。2倍弱あれば足りる
let BITRATE = 1_100_000               // 縦440pxのUI動画ならこれで十分きれい
let POSTER_QUALITY = 0.6

let args = CommandLine.arguments
guard args.count >= 3 else {
    print("usage: swift make-hero-video.swift <input.MOV> <outDir> [posterSeconds]")
    exit(1)
}
let srcURL = URL(fileURLWithPath: args[1])
let outDir = URL(fileURLWithPath: args[2])
let posterSeconds = args.count > 3 ? Double(args[3]) ?? 4.6 : 4.6

let asset = AVURLAsset(url: srcURL)
guard let track = asset.tracks(withMediaType: .video).first else {
    print("映像トラックが見つからない"); exit(1)
}

// 回転を含む動画は縮小の計算が変わる。iPhoneの画面収録は回転なしなので、
// 対応していないことを明示して弾く（無言で崩れた動画を出さないため）。
guard track.preferredTransform.isIdentity else {
    print("回転情報を持つ動画には未対応"); exit(1)
}
// H.264 は偶数サイズを要求するので丸める
let outW = Int((OUT_WIDTH / 2).rounded()) * 2
let outH = Int((OUT_WIDTH * track.naturalSize.height / track.naturalSize.width / 2).rounded()) * 2

let outURL = outDir.appendingPathComponent("hero-falling.mp4")
try? FileManager.default.removeItem(at: outURL)

let reader = try AVAssetReader(asset: asset)
// 映像トラックだけを読む。ここで音声は入り込まない
let readerOutput = AVAssetReaderTrackOutput(
    track: track,
    outputSettings: [kCVPixelBufferPixelFormatTypeKey as String:
                        kCVPixelFormatType_32BGRA])
readerOutput.alwaysCopiesSampleData = false
reader.add(readerOutput)

let writer = try AVAssetWriter(outputURL: outURL, fileType: .mp4)
let writerInput = AVAssetWriterInput(
    mediaType: .video,
    outputSettings: [
        AVVideoCodecKey: AVVideoCodecType.h264,
        AVVideoWidthKey: Int(outW),
        AVVideoHeightKey: outH,
        AVVideoCompressionPropertiesKey: [
            AVVideoAverageBitRateKey: BITRATE,
            AVVideoMaxKeyFrameIntervalKey: 60,
            AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
        ],
    ])
writerInput.expectsMediaDataInRealTime = false
writerInput.transform = track.preferredTransform
let adaptor = AVAssetWriterInputPixelBufferAdaptor(
    assetWriterInput: writerInput, sourcePixelBufferAttributes: nil)
writer.add(writerInput)
writer.shouldOptimizeForNetworkUse = true   // moov atom を先頭に置き、再生開始を速くする

writer.startWriting()
writer.startSession(atSourceTime: .zero)
reader.startReading()

let ciContext = CIContext()
let queue = DispatchQueue(label: "encode")
let sem = DispatchSemaphore(value: 0)
var frames = 0

writerInput.requestMediaDataWhenReady(on: queue) {
    while writerInput.isReadyForMoreMediaData {
        guard let sample = readerOutput.copyNextSampleBuffer(),
              let pixels = CMSampleBufferGetImageBuffer(sample) else {
            writerInput.markAsFinished()
            writer.finishWriting { sem.signal() }
            return
        }
        let time = CMSampleBufferGetPresentationTimeStamp(sample)
        // 縮小はCoreImageで行う（writerのoutputSettingsだけでは拡縮されないため）
        let scale = CGFloat(outW) / CGFloat(CVPixelBufferGetWidth(pixels))
        let image = CIImage(cvPixelBuffer: pixels)
            .transformed(by: CGAffineTransform(scaleX: scale, y: scale))
        var out: CVPixelBuffer?
        CVPixelBufferPoolCreatePixelBuffer(nil, adaptor.pixelBufferPool!, &out)
        if let out {
            ciContext.render(image, to: out)
            adaptor.append(out, withPresentationTime: time)
            frames += 1
        }
    }
}
sem.wait()

guard writer.status == .completed else {
    print("変換に失敗: \(writer.error?.localizedDescription ?? "不明")"); exit(1)
}

// ポスター画像
let gen = AVAssetImageGenerator(asset: asset)
gen.appliesPreferredTrackTransform = true
gen.maximumSize = CGSize(width: CGFloat(outW), height: CGFloat(outH))
gen.requestedTimeToleranceBefore = .zero
gen.requestedTimeToleranceAfter = CMTime(seconds: 0.3, preferredTimescale: 600)
let cg = try gen.copyCGImage(
    at: CMTime(seconds: posterSeconds, preferredTimescale: 600), actualTime: nil)
let posterURL = outDir.appendingPathComponent("hero-falling-poster.jpg")
try? FileManager.default.removeItem(at: posterURL)
try ciContext.writeJPEGRepresentation(
    of: CIImage(cgImage: cg), to: posterURL,
    colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!,
    options: [kCGImageDestinationLossyCompressionQuality as CIImageRepresentationOption:
                POSTER_QUALITY])

let bytes = (try FileManager.default.attributesOfItem(atPath: outURL.path)[.size] as? Int) ?? 0
print("動画: \(outURL.lastPathComponent) \(outW)x\(outH)"
      + " / \(String(format: "%.2f", Double(bytes) / 1_048_576))MB"
      + " / \(String(format: "%.2f", CMTimeGetSeconds(asset.duration)))秒"
      + " / \(frames)フレーム")
print("ポスター: \(posterURL.lastPathComponent)")
