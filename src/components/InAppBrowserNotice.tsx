"use client";

import { useSyncExternalStore } from "react";
import { usesAdjust } from "@/lib/appStore";
import { isInAppBrowser } from "@/lib/inAppBrowser";

// Instagram等のアプリ内ブラウザで開かれたときに、外部ブラウザへの逃げ道を案内する。
//
// ⚠️ アプリ内ブラウザからは、どうやってもApp Storeを開けない。
//    2026-08-12に実機で検証し、以下すべてが無反応だった。
//      - https（国コードあり・なし、パラメータあり・なし）
//      - itms-apps:// / itms-appss:// のスキーム直リンク
//      - 自ドメインで1回受けてから転送（外部ツールと同じ構造）
//    同じ結論はAdjust（この用途の専業サービス）も出していて、
//    Instagram経由のときは「ブラウザで開いて続ける」という手順画面を出している。
//    リンクの書き方で解決しようとしないこと。
//
// そのため、開かないボタンを見せて失敗させるより、先に手順を示す。
export default function InAppBrowserNotice() {
  const inApp = useSyncExternalStore(
    () => () => {},
    isInAppBrowser,
    () => false,
  );

  // Adjust経由に切り替えると、Adjust側が同じ手順画面を出す。
  // 二重に同じ案内を見せないよう、こちらは引っ込める。
  if (!inApp || usesAdjust) return null;

  return (
    <div className="mb-5 w-full max-w-sm rounded-2xl border border-[#E8C9A0] bg-[#FDF4E9] p-5 text-left">
      <p className="text-[15px] font-bold text-[#7A4A1E]">
        ブラウザで開いて続けてください
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-[#8A6136]">
        いまご覧のアプリ内ブラウザからは、App Store を開けません。
        お手数ですが、次の2ステップでお進みください。
      </p>
      <ol className="mt-4 space-y-2.5">
        {[
          "画面右上の「…」をタップ",
          "「外部ブラウザで開く」を選ぶ",
        ].map((step, i) => (
          <li key={step} className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#7A4A1E] text-xs font-bold text-white">
              {i + 1}
            </span>
            <span className="text-[14px] font-medium text-[#5E3A16]">
              {step}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-[12px] leading-relaxed text-[#A07C4E]">
        ブラウザで開き直すと、下のボタンから App Store に進めます。
      </p>
    </div>
  );
}
