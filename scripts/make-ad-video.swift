// LPの機能紹介動画を、Meta広告に入稿できる縦動画に合成する。
//
// 版面（背景・見出し・端末フレーム）は ads/make-app-ads.py が
// 「画面部分だけ透明なオーバーレイPNG」として書き出している。
// ここでは動画のフレームをその穴に敷き、上からオーバーレイを重ねるだけ。
// 文字組みをPillow側に寄せているので、このスクリプトは合成に専念できる。
//
// ⚠️ 音声トラックは読まない。画面収録がマイクの音を拾っていることがあり、
//    そのまま配信すると意図しない音声を流すことになる。
//    Metaの配信は無音前提なので、映像だけで意味が通る版面にしてある。
//
// ffmpeg は入っていないので AVFoundation で処理している。
//
// Usage:
//     swift scripts/make-ad-video.swift ads/app/video-jobs.json
//
// video-jobs.json の各要素:
//     video      入力mp4（LPの素材）
//     overlay    オーバーレイPNG（画面部分が透明）
//     out        出力mp4
//     canvas     [幅, 高さ]
//     screen     [x, y, 幅, 高さ]（左上原点。オーバーレイの穴の位置）
//     maxSeconds これを超える素材は先頭から切り詰める

import AVFoundation
import CoreImage
import Foundation
import ImageIO

let BITRATE = 6_000_000   // 1080x1920のUI動画。文字の輪郭を保つためLP用より厚く取る

struct Job: Decodable {
    let video: String
    let overlay: String
    let out: String
    let canvas: [Int]
    let screen: [Double]
    let maxSeconds: Double
}

func loadCGImage(_ path: String) -> CGImage {
    guard let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: path) as CFURL, nil),
          let image = CGImageSourceCreateImageAtIndex(src, 0, nil) else {
        fatalError("オーバーレイを読めない: \(path)")
    }
    return image
}

func render(_ job: Job) throws {
    let width = job.canvas[0], height = job.canvas[1]
    let asset = AVURLAsset(url: URL(fileURLWithPath: job.video))
    guard let track = asset.tracks(withMediaType: .video).first else {
        fatalError("映像トラックがない: \(job.video)")
    }

    let overlay = loadCGImage(job.overlay)
    // JSONは左上原点。CoreGraphicsは左下原点なので、Yだけ入れ替える。
    let screen = CGRect(
        x: job.screen[0],
        y: Double(height) - job.screen[1] - job.screen[3],
        width: job.screen[2],
        height: job.screen[3]
    )

    let reader = try AVAssetReader(asset: asset)
    let output = AVAssetReaderTrackOutput(
        track: track,
        outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA]
    )
    reader.add(output)

    let outURL = URL(fileURLWithPath: job.out)
    try? FileManager.default.removeItem(at: outURL)
    let writer = try AVAssetWriter(outputURL: outURL, fileType: .mp4)
    let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
        AVVideoCodecKey: AVVideoCodecType.h264,
        AVVideoWidthKey: width,
        AVVideoHeightKey: height,
        AVVideoCompressionPropertiesKey: [
            AVVideoAverageBitRateKey: BITRATE,
            AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
        ],
    ])
    input.expectsMediaDataInRealTime = false
    let adaptor = AVAssetWriterInputPixelBufferAdaptor(
        assetWriterInput: input,
        sourcePixelBufferAttributes: [
            kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
            kCVPixelBufferWidthKey as String: width,
            kCVPixelBufferHeightKey as String: height,
        ]
    )
    writer.add(input)

    let ciContext = CIContext()
    let colorSpace = CGColorSpaceCreateDeviceRGB()
    writer.startWriting()
    writer.startSession(atSourceTime: .zero)
    reader.startReading()

    let queue = DispatchQueue(label: "ad-video")
    let done = DispatchSemaphore(value: 0)
    var frames = 0

    input.requestMediaDataWhenReady(on: queue) {
        while input.isReadyForMoreMediaData {
            guard let sample = output.copyNextSampleBuffer(),
                  let pixels = CMSampleBufferGetImageBuffer(sample) else {
                input.markAsFinished()
                done.signal()
                return
            }
            let time = CMSampleBufferGetPresentationTimeStamp(sample)
            if time.seconds > job.maxSeconds {
                input.markAsFinished()
                reader.cancelReading()
                done.signal()
                return
            }

            var buffer: CVPixelBuffer?
            CVPixelBufferPoolCreatePixelBuffer(nil, adaptor.pixelBufferPool!, &buffer)
            guard let dst = buffer else { continue }
            CVPixelBufferLockBaseAddress(dst, [])
            guard let ctx = CGContext(
                data: CVPixelBufferGetBaseAddress(dst),
                width: width, height: height,
                bitsPerComponent: 8,
                bytesPerRow: CVPixelBufferGetBytesPerRow(dst),
                space: colorSpace,
                bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue
                    | CGBitmapInfo.byteOrder32Little.rawValue
            ) else { continue }

            // 画面 → オーバーレイの順。オーバーレイの黒縁が動画の角を隠すので、
            // 動画側を角丸にクリップする必要はない。
            let frame = CIImage(cvPixelBuffer: pixels)
            if let cg = ciContext.createCGImage(frame, from: frame.extent) {
                ctx.draw(cg, in: screen)
            }
            ctx.draw(overlay, in: CGRect(x: 0, y: 0, width: width, height: height))

            CVPixelBufferUnlockBaseAddress(dst, [])
            adaptor.append(dst, withPresentationTime: time)
            frames += 1
        }
    }

    done.wait()
    let finished = DispatchSemaphore(value: 0)
    input.markAsFinished()
    writer.finishWriting { finished.signal() }
    finished.wait()

    if writer.status != .completed {
        fatalError("書き出しに失敗: \(writer.error?.localizedDescription ?? "不明")")
    }
    let size = ((try? FileManager.default.attributesOfItem(atPath: job.out))?[.size] as? Int) ?? 0
    let seconds = Double(frames) / (Double(track.nominalFrameRate) == 0 ? 30 : Double(track.nominalFrameRate))
    print(String(format: "  %@  %dフレーム / %.1f秒 / %.1fMB",
                 (job.out as NSString).lastPathComponent, frames, seconds,
                 Double(size) / 1_048_576))
}

let args = CommandLine.arguments
guard args.count >= 2 else {
    print("Usage: swift scripts/make-ad-video.swift <video-jobs.json>")
    exit(1)
}
let jobs = try JSONDecoder().decode([Job].self, from: Data(contentsOf: URL(fileURLWithPath: args[1])))
print("\(jobs.count)件を合成する")
for job in jobs { try render(job) }
print("完了")
