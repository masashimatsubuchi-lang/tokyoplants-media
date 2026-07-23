"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "app-promo-banner-dismissed";

export default function AppPromoBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY) !== "1") {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // localStorage unavailable — banner will simply reappear next visit
    }
  };

  return (
    <div className="relative flex items-center justify-center gap-3 bg-emerald-800 px-4 py-2 text-white">
      <p className="truncate text-[12px] md:text-[13px]">
        <span className="mr-1.5">🌱</span>
        植物との毎日がちょっと楽しくなるアプリ、はじめました。
      </p>
      <a
        href="/go/top_banner"
        target="_blank"
        className="shrink-0 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors"
      >
        7日間の無料体験
      </a>
      <button
        type="button"
        onClick={dismiss}
        aria-label="バナーを閉じる"
        className="shrink-0 rounded-full p-1 text-white/70 hover:text-white transition-colors"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
