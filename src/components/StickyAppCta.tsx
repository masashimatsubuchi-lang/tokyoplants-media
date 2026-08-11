"use client";

import { useEffect, useState } from "react";
import AppStoreButton from "./AppStoreButton";

// モバイルの画面下部に追従するCTA。
//
// /app は縦に長く、CTAがヒーローと最下部にしかないと、途中で「入れよう」と
// 思った人が戻る/送るのに一手かかる。Instagramからの流入はほぼモバイルなので
// ここだけに出す（sm以上では非表示）。
//
// ヒーローのボタンが見えている間は出さない。同じボタンが二重に見えると
// かえって押しづらいため、ヒーローを通り過ぎてから現れる。
const SHOW_AFTER_PX = 520;

export default function StickyAppCta() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const update = () => setShown(window.scrollY > SHOW_AFTER_PX);
    // 途中までスクロールした状態で再読み込みされたときのために初期状態も取る。
    // effect本体で直接setStateすると連鎖レンダリングになるため、次フレームで評価する。
    const raf = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div
      aria-hidden={!shown}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#E6E1D6] bg-[#FAF8F4]/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-200 sm:hidden ${
        shown ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <AppStoreButton size="sm" label="無料でダウンロード" />
      <p className="mt-1.5 text-center text-[11px] text-[#6E6C63]">
        3株までずっと無料
      </p>
    </div>
  );
}
