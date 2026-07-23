"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

// App Store（my Plants Collection / Green Collection）へのリンク。
// Instagram・Xなど「参照元ドメインを持たない」チャネルからの流入を区別するための中継ページ。
// ここを経由させることで、GA4側では/go/[channel]へのページビューとして、
// App Store Connect側ではmedia.tokyoplants.comからのWeb Referrerとして計測できる。
const APP_STORE_URL =
  "https://apps.apple.com/jp/app/green-collection-%E8%A6%B3%E8%91%89%E6%A4%8D%E7%89%A9%E3%81%AE%E3%81%8A%E4%B8%96%E8%A9%B1-%E6%88%90%E9%95%B7%E8%A8%98%E9%8C%B2/id6790673876";

const CHANNEL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  x: "X",
  media: "tokyoplants media",
  top_banner: "tokyoplants media",
  article_bottom: "tokyoplants media",
};

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
    const redirect = () => window.location.replace(APP_STORE_URL);

    if (typeof window.gtag === "function") {
      // event_callback/event_timeoutでヒット送信（またはタイムアウト）を待ってから
      // 遷移する。即座にreplace()すると、afterInteractiveで読み込まれるgtag.jsの
      // ネットワークリクエストが遷移によってキャンセルされ、イベントが計測されない
      // ことがあるため。
      window.gtag("event", "app_store_click", {
        channel,
        event_callback: redirect,
        event_timeout: 500,
      });
      const timer = setTimeout(redirect, 500);
      return () => clearTimeout(timer);
    }

    // gtag.jsがまだ読み込まれていない場合は計測を諦めて遷移する
    redirect();
  }, [channel]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm text-gray-500">
        {label}からApp Storeへ移動しています…
      </p>
      <a href={APP_STORE_URL} className="text-teal-700 underline">
        自動的に移動しない場合はこちらをタップ
      </a>
    </main>
  );
}
