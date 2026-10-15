"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// EC・Amazon・Green Collection への導線クリックと、キャラクター注釈の表示を計測する。
//
// ⚠️ 2026-09-22 に「gtag直送にしてsGTMから独立させた」と記録していたが、これは誤りだった。
// layout.tsx の gtag は dataLayer.push そのもので、GTMと同じ dataLayer を共有している。
// 送信は今も GTM → サーバーサイドタグ（server-side-tagging-….run.app）を通る。
// イベント名が届くので正常に見えていただけで、パラメータは落ちていた（下の send を参照）。
//
// イベント名と主なパラメータ:
//   ec_click            { placement, link_path, article_slug }   tokyoplants.com（media以外）への遷移
//   amazon_click        { asin, article_slug }                    amazon.co.jp への遷移
//   gc_lp_click         { channel, article_slug }                 /app への内部遷移（?ch= がチャネル）
//   character_note_view { character, note_type, article_slug }   注釈が画面に50%以上入った時に1回
//
// placement は各コンポーネントが URL に付ける utm_content（inline / bottom / shop-banner）を
// そのまま使う。付いていないリンク（本文中のテキストリンク等）は "text"。

const CHARACTER_NOTE_SELECTOR = "[data-character-note]";

/**
 * ⚠️ ここで `gtag()` を呼んではいけない（2026-10-15）。
 *
 * layout.tsx の gtag は `function gtag(){dataLayer.push(arguments)}` でしかなく、
 * GTMコンテナ（GTM-W4B3BGPL）と同じ dataLayer を共有している。gtag形式で積むと
 * パラメータが arguments[2] の入れ子に入り、GTMのGA4イベントタグがそれを読まずに
 * 捨てるため、**イベント名だけが届いてパラメータが全部消える**。
 *
 * 実際の送信内容（修正前）:
 *   /g/collect?…&en=ec_click&ep.event_name=ec_click&ep.x-fb-ck-fbp=…
 *   → placement / link_path / article_slug がどこにも無い
 *
 * イベント数は正しく取れていたので正常に見えてしまい、長く気づけなかった。
 * フラットに積めばGTMのデータレイヤー変数（{{DLV - placement}} など）で素直に読める。
 */
function send(name: string, params: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
}

function articleSlug(): string {
  return window.location.pathname.replace(/\/$/, "") || "/";
}

function handleClick(e: MouseEvent) {
  const target = e.target as Element | null;
  const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!anchor) return;

  let url: URL;
  try {
    url = new URL(anchor.href, window.location.href);
  } catch {
    return;
  }
  const host = url.hostname;

  // tokyoplants EC（media サブドメインは除く）
  if (host === "www.tokyoplants.com" || host === "tokyoplants.com") {
    send("ec_click", {
      placement: url.searchParams.get("utm_content") || "text",
      link_path: url.pathname,
      article_slug: articleSlug(),
    });
    return;
  }

  // Amazon
  if (host.endsWith("amazon.co.jp") || host.endsWith("amzn.to") || host.endsWith("amzn.asia")) {
    const asin = url.pathname.match(/\/dp\/([A-Z0-9]{10})/)?.[1] || "";
    send("amazon_click", { asin, article_slug: articleSlug() });
    return;
  }

  // Green Collection LP（内部リンク）。App Store 直リンクは AppStoreButton 側の app_store_click が担当
  if (host === window.location.hostname && url.pathname === "/app") {
    send("gc_lp_click", {
      channel: url.searchParams.get("ch") || "unknown",
      article_slug: articleSlug(),
    });
  }
}

export default function ClickTracker() {
  // App Router のクライアント遷移でも注釈を観測し直すため pathname に依存させる
  const pathname = usePathname();

  useEffect(() => {
    document.addEventListener("click", handleClick, true);

    // キャラクター注釈の表示計測（要素ごとに1回だけ）
    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const el = entry.target as HTMLElement;
            send("character_note_view", {
              character: el.dataset.character || "",
              note_type: el.dataset.noteType || "",
              article_slug: articleSlug(),
            });
            observer?.unobserve(el);
          }
        },
        { threshold: 0.5 }
      );
      document.querySelectorAll(CHARACTER_NOTE_SELECTOR).forEach((el) => observer?.observe(el));
    }

    return () => {
      document.removeEventListener("click", handleClick, true);
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
