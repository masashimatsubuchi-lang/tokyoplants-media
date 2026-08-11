"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { appStoreUrl } from "@/lib/appStore";

// App Store へのCTAボタン。
//
// ⚠️ 実装上の制約が多い。変更する前に必ずここを読むこと。
//
// 1. target="_blank" を付けない
//    Instagram・Facebook・LINE のアプリ内ブラウザ（WKWebView）は新規ウィンドウを
//    開けないため、_blank だとタップしても何も起きないことがある。
//
// 2. JavaScript で遷移させない（window.location = ... は不可）
//    iOS は apps.apple.com を App Store アプリの Universal Link として扱うが、
//    OSが横取りするのは「ユーザーが <a> をタップした」ナビゲーションのみ。
//    JS発火の遷移は Universal Link にならず、実際にHTTPリクエストが飛ぶ。
//    その結果 Apple が返す `301 Location: itms-appss://...` を WebView が
//    処理できず、真っ白な画面で止まる（2026-08-11に実測）。
//    iOSのUAなら Safari 相手でも同じ301が返るため、UAでの回避もできない。
//
// 3. onClick で preventDefault しない
//    計測イベントは投げるが、遷移そのものはブラウザに委ねる。
//
// ct（キャンペーントークン）は ?ch= から取る。/go/[channel] からのリダイレクトと
// Instagram プロフィールリンクの両方がこのクエリを付けて着地する。
const DEFAULT_CHANNEL = "app_lp";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function sanitizeChannel(raw: string | null): string {
  if (!raw) return DEFAULT_CHANNEL;
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
  return cleaned || DEFAULT_CHANNEL;
}

function ButtonLink({
  channel,
  variant,
  label,
  size,
}: {
  channel: string;
  variant: "primary" | "secondary";
  label: string;
  size: "default" | "sm";
}) {
  // LPは明るい生成りの背景なので、主ボタンはブランドグリーンの塗り。
  const base =
    "inline-flex w-full items-center justify-center rounded-full font-bold transition-colors";
  const sizes =
    size === "sm"
      ? "px-6 py-3 text-[15px]"
      : "max-w-sm px-8 py-4 text-base";
  const styles =
    variant === "primary"
      ? "bg-[#015440] text-white shadow-sm hover:bg-[#026A51]"
      : "border-2 border-[#015440] text-[#015440] hover:bg-[#015440]/5";

  return (
    <a
      href={appStoreUrl(channel)}
      onClick={() => {
        // 遷移はブラウザに任せる。ここでは計測イベントを投げるだけ。
        window.gtag?.("event", "app_store_click", { channel });
      }}
      className={`${base} ${sizes} ${styles}`}
    >
      {label}
    </a>
  );
}

function AppStoreButtonInner(props: {
  variant: "primary" | "secondary";
  label: string;
  size: "default" | "sm";
}) {
  const channel = sanitizeChannel(useSearchParams().get("ch"));
  return <ButtonLink channel={channel} {...props} />;
}

export default function AppStoreButton({
  variant = "primary",
  label = "無料でダウンロード",
  size = "default",
}: {
  variant?: "primary" | "secondary";
  label?: string;
  size?: "default" | "sm";
}) {
  // useSearchParams はページ全体を動的レンダリングに落とさないよう Suspense で包む。
  // fallback は ct が既定値になるだけで見た目は同一なので、ズレは起きない。
  return (
    <Suspense
      fallback={
        <ButtonLink
          channel={DEFAULT_CHANNEL}
          variant={variant}
          label={label}
          size={size}
        />
      }
    >
      <AppStoreButtonInner variant={variant} label={label} size={size} />
    </Suspense>
  );
}
