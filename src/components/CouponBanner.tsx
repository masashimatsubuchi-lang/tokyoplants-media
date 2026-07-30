"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "coupon-banner-dismissed";
const COUPON_CODE = "A4TH7NVB";
const SHOP_URL =
  "https://www.tokyoplants.com?utm_source=media&utm_medium=banner&utm_campaign=coupon_a4th7nvb";

export default function CouponBanner() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(COUPON_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — code is still visible as text
    }
  };

  return (
    <div className="relative flex items-center justify-center gap-2 bg-teal-800 px-3 py-2 text-white sm:gap-3 sm:px-4">
      <p className="min-w-0 truncate text-[12px] sm:text-[13px]">
        <span className="mr-1.5">🎁</span>
        <span className="sm:hidden">読者限定10%OFFクーポン配布中</span>
        <span className="hidden sm:inline">&lt;読者限定&gt; 公式ストアで使える10%OFFクーポン配布中</span>
      </p>
      <button
        type="button"
        onClick={copyCode}
        className="shrink-0 whitespace-nowrap rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-mono font-semibold tracking-wide text-white hover:bg-white/25 transition-colors"
      >
        {copied ? "コピーしました" : `コード：${COUPON_CODE}`}
      </button>
      <a
        href={SHOP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 whitespace-nowrap rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-teal-800 hover:bg-teal-50 transition-colors"
      >
        <span className="sm:hidden">使う</span>
        <span className="hidden sm:inline">ショップで使う</span>
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
