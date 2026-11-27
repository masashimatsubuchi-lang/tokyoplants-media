"use client";

import { useEffect, useState } from "react";

export interface Slide {
  src: string;
  alt: string;
}

// トップの新入荷バナーの写真。数秒ごとにフェードで切り替わり、下の丸で選べる。
// 動きを減らす設定の端末と、カーソルを乗せている間・画面外にあるときは自動で切り替えない。
export default function FeatureBannerSlides({ slides, href, intervalMs = 5000 }: { slides: Slide[]; href: string; intervalMs?: number }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") setActive((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [paused, slides.length, intervalMs]);

  return (
    <div
      className="relative aspect-[3/2] h-full w-full overflow-hidden bg-[#e8e8ed] md:aspect-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Sen ローリーポットをショップで見る" className="absolute inset-0 block">
        {slides.map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s.src}
            src={s.src}
            alt={i === active ? s.alt : ""}
            aria-hidden={i !== active}
            width={1600}
            height={1067}
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </a>
      {slides.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => {
                setActive(i);
                setPaused(true);
              }}
              aria-label={`写真 ${i + 1} / ${slides.length}`}
              aria-current={i === active}
              // 押しやすさのため当たり判定は 24px、見た目の丸は小さく
              className="flex h-6 w-6 items-center justify-center"
            >
              <span className={`block h-2 rounded-full bg-white shadow transition-all ${i === active ? "w-5 opacity-100" : "w-2 opacity-60"}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
