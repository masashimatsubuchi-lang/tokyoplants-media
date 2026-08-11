"use client";

import { useSyncExternalStore } from "react";

// 検証ページ（/app/link-test）用。実機のUAをそのまま表示する。
// アプリ内ブラウザの判定が実際に効いているか、UAが想定どおりかを確かめるためのもの。
const noopSubscribe = () => () => {};

export default function UserAgentReadout() {
  const ua = useSyncExternalStore(
    noopSubscribe,
    () => navigator.userAgent,
    () => "",
  );
  if (!ua) return null;

  return (
    <div className="mt-6 rounded-xl bg-[#F1EEE6] px-4 py-3">
      <p className="text-xs font-bold text-[#16352A]">ブラウザの識別子（UA）</p>
      <p className="mt-1 break-all font-mono text-[11px] leading-relaxed text-[#5C5A52]">
        {ua}
      </p>
    </div>
  );
}
