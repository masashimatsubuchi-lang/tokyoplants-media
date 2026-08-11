"use client";

import { useEffect, useRef } from "react";

// ヒーローに置く、アイコンが降ってくる様子のループ動画。
// このアニメーションはアプリの顔にあたるもので、静止画では魅力が伝わらない。
//
// 動画は scripts/make-hero-video.swift で生成する（音声は必ず落としている）。
//
// 端末の枠はCSSで描く。画像側の枠（scripts/frame-app-screenshots.py）と
// 見た目を揃えるため、寸法は同じ比率から出している。
// 幅1260pxのスクショに対して 画面の角丸172 / 黒縁26 / 金属フレーム12。
//   168px幅 → 角丸23 / 黒縁4 / フレーム2
//   210px幅 → 角丸29 / 黒縁4 / フレーム2
//
// 幅を欲張るとCTAがファーストビューから押し出される。大きくしたくなったら、
// 実機の375x812でCTAが見えているかを必ず確認すること。
export default function HeroVideo() {
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
    <div className="w-[168px] rounded-[29px] bg-[#55525A] p-[2px] shadow-[0_18px_40px_rgba(22,53,42,0.20)] sm:w-[210px] sm:rounded-[35px]">
      <div className="rounded-[27px] bg-[#101014] p-[4px] sm:rounded-[33px]">
        <video
          ref={ref}
          // 音声トラックを持たない動画だが、iOSの自動再生要件を満たすため
          // muted と playsInline は明示しておく。
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/videos/hero-falling-poster.jpg"
          width={440}
          height={956}
          aria-label="アプリを開くと、育てている植物のアイコンが上から降ってきて棚に並ぶ様子"
          className="block h-auto w-full rounded-[23px] sm:rounded-[29px]"
        >
          <source src="/videos/hero-falling.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
