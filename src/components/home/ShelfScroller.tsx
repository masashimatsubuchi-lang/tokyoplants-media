"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

// 横スクロールの棚。スマホはスワイプ、PCは右下の矢印でも送れる。
// 1枚目の左端は見出しと揃え（.store-shelf）、右側は画面の端まで流して次のカードを少し見せる。
export default function ShelfScroller({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const move = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div>
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="store-shelf scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 pt-1 outline-none md:gap-5"
      >
        {children}
      </div>
      {(canPrev || canNext) && (
        <div className="store-gutter mt-4 hidden justify-end gap-3 md:flex">
          <button
            type="button"
            onClick={() => move(-1)}
            disabled={!canPrev}
            aria-label={`${label}を前へ`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8e8ed] text-[#1d1d1f] transition-colors hover:bg-[#dcdce1] disabled:opacity-35"
          >
            <svg width="9" height="15" viewBox="0 0 9 15" aria-hidden="true">
              <path d="M7.5 1.5 1.5 7.5l6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            disabled={!canNext}
            aria-label={`${label}を次へ`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8e8ed] text-[#1d1d1f] transition-colors hover:bg-[#dcdce1] disabled:opacity-35"
          >
            <svg width="9" height="15" viewBox="0 0 9 15" aria-hidden="true">
              <path d="m1.5 1.5 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
