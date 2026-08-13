// iPhoneの画面収録を、LPの機能紹介セクションに置ける動画に変換する。
//
// make-hero-video.swift の汎用版。ヒーローは168〜210px表示の小さな浮動動画
// 専用に作ったが、機能紹介セクションは既存の端末フレーム画像と同じ
// 240〜280px幅で表示するため、出力名・出力幅・ビットレートを引数にした。
//
// ⚠️ 音声トラックは必ず捨てる。画面収録はマイクで周囲の音を拾っていることがあり、
//    そのまま公開すると意図しない音声を配信してしまう。
//    ここでは映像トラックしか読まないので、出力に音声は入らない。
//
// 端末の枠（黒縁・角丸）はここでは焼き込まない。CSS側（FeatureVideo.tsx）で
// scripts/frame-app-screenshots.py と同じ比率のフレームを描く。動画のピクセルは
// 画面の中身だけを持たせておくと、フレームの色を後から調整しやすい。
//
// ffmpeg は入っていないので AVFoundation で処理している。
//
// Usage:
//   swift scripts/make-feature-video.swift <入力.MOV> <出力先ディレクトリ> <出力名> <出力幅px> [ビットレートbps] [ポスターの秒数]
//
// 出力: <出力先>/<出力名>.mp4, <出力先>/<出力名>-poster.jpg

import AVFoundation
import CoreImage
import Foundation

// 画面収録中を示す赤い丸を隠す矩形（入力の原寸、左上原点）。
// ダイナミックアイランドは純黒なので、内側を黒で塗れば継ぎ目なく消える。
// 座標は収録した端末・iOSのバージョンで変わる。差し替えたら
// 「赤い画素の範囲」と「矩形の外周がすべて純黒か」を測り直すこと。
// 現在の値は iPhone 16 Pro / 1260x2736 の収録で確認済み（make-hero-video.swiftと同じ）。
let MASK_RECT = CGRect(x: 386, y: 84, width: 58, height: 59)
let MASK_ENABLED = true
let POSTER_QUALITY = 0.65

let args = CommandLine.arguments
guard args.count >= 5 else {
    print("usage: swift make-feature-video.swift <input.mov> <outDir> <outName> <outWidth> [bitrate] [posterSeconds]")
    exit(1)
}
let srcURL = URL(fileURLWithPath: args[1])
let outDir = URL(fileURLWithPath: args[2])
let outName = args[3]
let outWidthArg = Double(args[4]) ?? 600
let bitrateArg = args.count > 5 ? Int(args[5]) : nil
let posterSeconds = args.count > 6 ? Double(args[6]) ?? 1.0 : 1.0

let asset = AVURLAsset(url: srcURL)
guard let track = asset.tracks(withMediaType: .video).first else {
    print("映像トラックが見つからない"); exit(1)
}
guard track.preferredTransform.isIdentity else {
    print("回転情報を持つ動画には未対応"); exit(1)
}

let outW = Int((outWidthArg / 2).rounded()) * 2
let outH = Int((outWidthArg * track.naturalSize.height / track.naturalSize.width / 2).rounded()) * 2

// 明示指定がなければ、make-hero-video.swiftで確認済みの
// 440x956 / 1.1Mbps を基準に、画素数の比で自動計算する。
let BITRATE = bitrateArg ?? Int(1_100_000.0 * Double(outW * outH) / Double(440 * 956))

func maskRecordingDot(_ image: CIImage, height: CGFloat) -> CIImage {
    guard MASK_ENABLED else { return image }
    let rect = CGRect(x: MASK_RECT.minX, y: height - MASK_RECT.maxY,
                      width: MASK_RECT.width, height: MASK_RECT.height)
    return CIImage(color: .black).cropped(to: rect).composited(over: image)
}

let outURL = outDir.appendingPathComponent("\(outName).mp4")
try? FileManager.default.removeItem(at: outURL)

let reader = try AVAssetReader(asset: asset)
let readerOutput = AVAssetReaderTrackOutput(
    track: track,
    outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
readerOutput.alwaysCopiesSampleData = false
reader.add(readerOutput)

let writer = try AVAssetWriter(outputURL: outURL, fileType: .mp4)
let writerInput = AVAssetWriterInput(
    mediaType: .video,
    outputSettings: [
        AVVideoCodecKey: AVVideoCodecType.h264,
        AVVideoWidthKey: outW,
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
writer.shouldOptimizeForNetworkUse = true

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
        let scale = CGFloat(outW) / CGFloat(CVPixelBufferGetWidth(pixels))
        let masked = maskRecordingDot(CIImage(cvPixelBuffer: pixels),
                                      height: CGFloat(CVPixelBufferGetHeight(pixels)))
        let image = masked.transformed(by: CGAffineTransform(scaleX: scale, y: scale))
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

let gen = AVAssetImageGenerator(asset: asset)
gen.appliesPreferredTrackTransform = true
gen.requestedTimeToleranceBefore = .zero
gen.requestedTimeToleranceAfter = CMTime(seconds: 0.3, preferredTimescale: 600)
let cg = try gen.copyCGImage(
    at: CMTime(seconds: posterSeconds, preferredTimescale: 600), actualTime: nil)
let posterScale = CGFloat(outW) / CGFloat(cg.width)
let poster = maskRecordingDot(CIImage(cgImage: cg), height: CGFloat(cg.height))
    .transformed(by: CGAffineTransform(scaleX: posterScale, y: posterScale))
let posterURL = outDir.appendingPathComponent("\(outName)-poster.jpg")
try? FileManager.default.removeItem(at: posterURL)
try ciContext.writeJPEGRepresentation(
    of: poster, to: posterURL,
    colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!,
    options: [kCGImageDestinationLossyCompressionQuality as CIImageRepresentationOption: POSTER_QUALITY])

let bytes = (try FileManager.default.attributesOfItem(atPath: outURL.path)[.size] as? Int) ?? 0
print("動画: \(outURL.lastPathComponent) \(outW)x\(outH)"
      + " / \(String(format: "%.2f", Double(bytes) / 1_048_576))MB"
      + " / \(String(format: "%.2f", CMTimeGetSeconds(asset.duration)))秒"
      + " / bitrate \(BITRATE/1000)kbps / \(frames)フレーム")
print("ポスター: \(posterURL.lastPathComponent)")
