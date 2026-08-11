"use client";

import { useSyncExternalStore } from "react";
import { isInAppBrowser } from "@/lib/inAppBrowser";

// Instagram等のアプリ内ブラウザで開かれたときだけ出す案内。
//
// アプリ内ブラウザからはApp Storeを開けない。Appleはどのhttps URLに対しても
// iOSのUAには `301 Location: itms-appss://...` を返し、WKWebViewはこのスキームを
// 処理できないため、タップしても何も起きない（2026-08-12に実測）。
// これはAdjustやAppsFlyerのような計測ツールを挟んでも同じで、
// リンクの張り方では回避できない。
//
// そのため、押してから失敗を知らせるのではなく、押す前に逃げ道を示す。
// （タップ後の検知はAppStoreButton側にも残してある）
export default function InAppBrowserNotice() {
  const inApp = useSyncExternalStore(
    () => () => {},
    isInAppBrowser,
    () => false,
  );

  if (!inApp) return null;

  return (
    <p className="mx-auto mb-4 max-w-sm rounded-xl bg-[#FBEFE2] px-4 py-3 text-[13px] leading-relaxed text-[#7A4A1E]">
      このブラウザからは App Store を開けないことがあります。うまくいかない場合は
      画面右上の「<strong className="font-bold">…</strong>」から
      <strong className="font-bold">「外部ブラウザで開く」</strong>
      を選んでください。
    </p>
  );
}
