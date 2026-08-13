"use client";

import { useEffect, useRef } from "react";

// 機能紹介セクション用の、端末フレームつき動画。
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
//
// ⚠️ autoPlay は使わない。ページ読み込み時に即再生を始めてしまうと、
//    このセクションが画面外（下の方）にある間もループが進み続け、
//    実際にスクロールして辿り着いた頃には動画の途中から見える状態になる
//    （オーナー報告で実際に発生）。IntersectionObserver で「画面に入る
//    少し手前で再生開始、画面外に出たら一時停止・次に入るときは頭から」
//    という制御にして、必ず冒頭から見えるようにする。
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
      video.controls = true;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 毎回、その機能紹介の「体験」を冒頭から見せる。
          // 一時停止していた続きからだと、前回どこまで見たか次第で
          // 話の順序（撮影→切り抜き→AI下書き、など）が伝わらないことがある。
          video.currentTime = 0;
          // 高速スクロール中にpause()が割り込むとplay()がAbortErrorで
          // 拒否されることがある。実害はないので握りつぶす。
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      {
        // 画面の下端から200px手前で交差判定させる＝スクロールで
        // 実際に視界へ入るより一足早く再生を始めておく。
        // ぴったり視界に入った瞬間に再生開始だと、届いた直後の数百msが
        // 止め絵に見えてしまうため。
        rootMargin: "0px 0px 200px 0px",
        threshold: 0.01,
      },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full rounded-[33px] bg-[#55525A] p-[2px] shadow-[0_14px_30px_rgba(22,53,42,0.16)] sm:rounded-[38px] sm:p-[3px]">
      <div className="rounded-[31px] bg-[#101014] p-[5px] sm:rounded-[35px] sm:p-[6px]">
        <video
          ref={ref}
          // 音声トラックを持たない動画だが、iOSでJS側からplay()するには
          // muted と playsInline が必須（autoPlay属性と同じ制約）。
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
