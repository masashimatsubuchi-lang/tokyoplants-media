"use client";

import { Suspense, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { appStoreSchemeUrl, appStoreUrl } from "@/lib/appStore";
import { isInAppBrowser } from "@/lib/inAppBrowser";

// App Store へのCTAボタン。
//
// ⚠️ 実装上の制約が多い。変更する前に必ずここを読むこと。
//
// 1. target="_blank" を付けない
//    アプリ内ブラウザは新規ウィンドウを開けないため、タップしても何も起きなくなる。
//
// 2. 通常のブラウザでは JavaScript で遷移させない
//    iOS は apps.apple.com を App Store の Universal Link として扱うが、
//    OSが横取りするのは「ユーザーが <a> をタップした」ナビゲーションのみ。
//
// 3. アプリ内ブラウザでは href 自体を itms-apps:// に差し替える
//    Instagram等のWKWebViewは、Appleが返す `301 Location: itms-appss://...` を
//    処理できず、httpsのままだと何も起きない。
//    https のApp Store URLは、短縮形でも itunes.apple.com でもパラメータを変えても
//    例外なくこのスキームへ転送されるため（2026-08-12に実測）、
//    「リダイレクトを挟む」やり方では回避できない。最初からスキームを渡すしかない。
//
//    JSで location を書き換えるのではなく href に入れるのが要点。
//    WKWebViewは「ユーザーがリンクをタップした」ナビゲーションだけをホストアプリに
//    問い合わせるので、実際のタップのほうが受け渡される見込みが高い。
//    誤判定で通常ブラウザにスキームを出しても、Safariは itms-apps:// を解釈できるため実害はない。
//
//    それでも開けなかった場合は、外部ブラウザで開く案内を出す（下の BLOCKED_MS）。
//
// ct（キャンペーントークン）は ?ch= から取る。/go/[channel] からのリダイレクトと
// Instagram プロフィールリンクの両方がこのクエリを付けて着地する。
const DEFAULT_CHANNEL = "app_lp";

// スキームでも開けなかったと判断するまでの待ち時間。
// App Storeが開けば画面は hidden になるので、visible のままなら失敗とみなす。
const BLOCKED_MS = 1500;

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

// アプリ内ブラウザかどうかはクライアントでしか分からない。
// useEffect + setState だと連鎖レンダリングになるうえハイドレーションもずれるため、
// サーバー側スナップショットを false に固定して useSyncExternalStore で読む。
const noopSubscribe = () => () => {};

function useIsInAppBrowser() {
  return useSyncExternalStore(noopSubscribe, isInAppBrowser, () => false);
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
  const inApp = useIsInAppBrowser();
  const [blocked, setBlocked] = useState(false);

  // LPは明るい生成りの背景なので、主ボタンはブランドグリーンの塗り。
  const base =
    "inline-flex w-full items-center justify-center rounded-full font-bold transition-colors";
  const sizes =
    size === "sm" ? "px-6 py-3 text-[15px]" : "max-w-sm px-8 py-4 text-base";
  const styles =
    variant === "primary"
      ? "bg-[#015440] text-white shadow-sm hover:bg-[#026A51]"
      : "border-2 border-[#015440] text-[#015440] hover:bg-[#015440]/5";

  return (
    <>
      <a
        href={inApp ? appStoreSchemeUrl(channel) : appStoreUrl(channel)}
        onClick={() => {
          window.gtag?.("event", "app_store_click", { channel, inApp });
          // 既定動作は止めない。アプリ内ブラウザのときだけ、開けたかどうかを見張る。
          // App Storeが開けば画面は hidden になるので、visible のままなら失敗とみなす。
          if (!inApp) return;
          window.setTimeout(() => {
            if (document.visibilityState === "visible") setBlocked(true);
          }, BLOCKED_MS);
        }}
        className={`${base} ${sizes} ${styles}`}
      >
        {label}
      </a>
      {blocked && (
        <div
          role="alert"
          className="mt-2 max-w-sm rounded-xl bg-[#FBEFE2] px-4 py-3 text-[13px] leading-relaxed text-[#7A4A1E]"
        >
          このブラウザからは App Store を開けないようです。画面右上の「
          <strong className="font-bold">…</strong>
          」から
          <strong className="font-bold">「外部ブラウザで開く」</strong>
          を選んで、もう一度お試しください。
        </div>
      )}
    </>
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
  channel,
}: {
  variant?: "primary" | "secondary";
  label?: string;
  size?: "default" | "sm";
  // /app 以外のページに置く場合に、計測用のチャネルを直接指定する。
  // 指定がなければURLの ?ch= を使う。
  channel?: string;
}) {
  if (channel) {
    return (
      <ButtonLink
        channel={sanitizeChannel(channel)}
        variant={variant}
        label={label}
        size={size}
      />
    );
  }
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
