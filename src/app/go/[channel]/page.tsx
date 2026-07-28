"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { appStoreUrl } from "@/lib/appStore";

// Instagram・Xなど「参照元ドメインを持たない」チャネルからの流入を区別するための中継ページ。
// サイト内の導線（ヘッダーバナー・記事下CTA・フッター）はApp Storeへ直リンクしており、
// GA4の拡張計測（outbound click）とApp Store Connectのct計測で追えるため、ここは通さない。
const CHANNEL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  x: "X",
  media: "tokyoplants media",
};

// gtag.jsはafterInteractiveで読み込まれるため、useEffect時点ではまだ未定義のことがある。
// 読み込みを最大この時間まで待ってからイベントを送る。
const GTAG_WAIT_MS = 1500;
const GTAG_POLL_MS = 100;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function AppStoreRedirectPage() {
  const params = useParams<{ channel: string }>();
  const channel = params.channel;
  const label = CHANNEL_LABELS[channel] ?? channel;

  useEffect(() => {
    const url = appStoreUrl(channel);
    let done = false;
    const redirect = () => {
      if (done) return;
      done = true;
      window.location.replace(url);
    };

    const send = () => {
      // event_callback/event_timeoutでヒット送信（またはタイムアウト）を待ってから
      // 遷移する。即座にreplace()すると、gtag.jsのネットワークリクエストが遷移で
      // キャンセルされ、イベントが計測されないことがあるため。
      window.gtag!("event", "app_store_click", {
        channel,
        event_callback: redirect,
        event_timeout: 500,
      });
      setTimeout(redirect, 500);
    };

    if (typeof window.gtag === "function") {
      send();
      return;
    }

    const start = Date.now();
    const poll = setInterval(() => {
      if (typeof window.gtag === "function") {
        clearInterval(poll);
        send();
      } else if (Date.now() - start >= GTAG_WAIT_MS) {
        // 待っても読み込まれない場合は計測を諦めて遷移する
        clearInterval(poll);
        redirect();
      }
    }, GTAG_POLL_MS);

    return () => clearInterval(poll);
  }, [channel]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm text-gray-500">
        {label}からApp Storeへ移動しています…
      </p>
      <a href={appStoreUrl(channel)} className="text-teal-700 underline">
        自動的に移動しない場合はこちらをタップ
      </a>
    </main>
  );
}
