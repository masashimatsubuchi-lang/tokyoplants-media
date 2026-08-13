"use client";

import { useEffect, useRef } from "react";

// 機能紹介セクション用の、端末フレームつき自動再生動画。
//
// HeroVideo.tsx と同じ「フレームはCSSで描き、動画のピクセルには焼き込まない」方式。
// こちらは機能紹介セクションの表示幅（240〜280px、features配列の既定コンテナ幅）に
// 合わせて、角丸・縁の太さを scripts/frame-app-screenshots.py と同じ比率で
// 計算し直している。
//   幅1260pxのスクショに対して 画面の角丸172 / 黒縁26 / 金属フレーム12。
//   240px幅 → 角丸33 / 黒縁5 / フレーム2
//   280px幅 → 角丸38 / 黒縁6 / フレーム3
//
// 動画は scripts/make-feature-video.swift で生成する（音声・録画中の赤丸は除去済み）。
export default function FeatureVideo({
  src,
  poster,
  alt,
}: {
  src: string;
  poster: string;
  alt: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // 動きを減らす設定の人には自動再生しない。代わりに再生ボタンを出す。
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      video.controls = true;
    }
  }, []);

  return (
    <div className="w-full rounded-[33px] bg-[#55525A] p-[2px] shadow-[0_14px_30px_rgba(22,53,42,0.16)] sm:rounded-[38px] sm:p-[3px]">
      <div className="rounded-[31px] bg-[#101014] p-[5px] sm:rounded-[35px] sm:p-[6px]">
        <video
          ref={ref}
          // 音声トラックを持たない動画だが、iOSの自動再生要件を満たすため
          // muted と playsInline は明示しておく。
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          width={600}
          height={1302}
          aria-label={alt}
          className="block h-auto w-full rounded-[26px] sm:rounded-[29px]"
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
