"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

// トップページのGreen Collection紹介。文言と動画は /app のヒーローと同じものを使う。
//
// /app の HeroVideo と違い、ここは画面の下のほうにあるため、
// 見えるまで動画を読み込まない（preload="none"）。見えたら再生し、外れたら止める。
// 動きを減らす設定の人には自動再生せず、静止画の上に再生ボタンを出す。
// 枠は aspect-ratio で先に高さを確保しているので、読み込みでレイアウトがずれない。
export default function AppShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.controls = true;
      return;
    }
    if (!("IntersectionObserver" in window)) {
      video.play().catch(() => {});
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <section id="app" aria-labelledby="app-heading" className="scroll-mt-16 bg-[#f6f4ef] py-16 md:py-24">
      <div className="store-gutter">
        {/* スマホは /app と同じく「紹介文 → 動画 → ボタン」の順。PCは左に文章とボタン、右に動画 */}
        <div className="mx-auto grid max-w-[1180px] gap-8 md:grid-cols-[1fr_auto] md:grid-rows-[auto_auto] md:gap-x-16 lg:gap-x-24">
          <div className="text-center md:col-start-1 md:row-start-1 md:self-end md:text-left">
            <div className="flex items-center justify-center gap-2.5 md:justify-start">
              <Image src="/images/app/app-icon.png" alt="" aria-hidden width={40} height={40} className="rounded-[10px]" />
              <p className="text-[13px] font-semibold tracking-[0.16em] text-[#6E6C63]">GREEN COLLECTION</p>
            </div>
            <h2
              id="app-heading"
              className="mt-5 text-[28px] font-bold leading-[1.4] tracking-tight text-[#16352A] [word-break:auto-phrase] md:text-[38px]"
            >
              植物のお世話が、
              <br />
              コレクションになる。
            </h2>
            <p className="mt-5 text-[15px] leading-[1.9] text-[#4b4b50] [word-break:auto-phrase] md:text-[16px]">
              開くたびに、育てている植物が降ってくる。
              <br />
              観葉植物の専門店がつくった、育てる楽しさが続くアプリ。
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 md:col-start-1 md:row-start-2 md:items-start md:self-start">
              <Link
                href="/app?ch=media_home"
                className="inline-flex items-center rounded-full bg-[#16352A] px-7 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#1f4a3a]"
              >
                アプリを見る
              </Link>
              <p className="mt-1 text-[13px] font-medium text-[#16352A]">3株までずっと無料</p>
              <p className="text-[12px] text-[#6E6C63]">iPhone対応（Android版は近日公開予定）</p>
          </div>

          {/* 端末の枠は /app の HeroVideo と同じ比率（角丸・黒縁・フレーム） */}
          <div className="row-start-2 mx-auto w-[190px] rounded-[33px] bg-[#55525A] p-[2px] shadow-[0_24px_50px_rgba(22,53,42,0.22)] sm:w-[220px] md:col-start-2 md:row-span-2 md:row-start-1 md:w-[250px] md:self-center md:rounded-[41px]">
            <div className="rounded-[31px] bg-[#101014] p-[4px] md:rounded-[39px]">
              <div className="relative aspect-[440/956] overflow-hidden rounded-[27px] bg-[#f6f3ec] md:rounded-[35px]">
                <video
                  ref={videoRef}
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster="/videos/hero-falling-poster.jpg"
                  width={440}
                  height={956}
                  aria-label="アプリを開くと、育てている植物のアイコンが上から降ってきて棚に並ぶ様子"
                  className="absolute inset-0 h-full w-full object-cover"
                >
                  <source src="/videos/hero-falling.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
