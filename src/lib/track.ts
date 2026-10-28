// gtag.js（layout.tsx で読み込む G-xxxx）へ直接イベントを送る。
// GTM／サーバーサイドタグを通さないのは、sGTM の 503 で GTM 経由のイベントが欠損した経緯があるため
// （詳しくは ClickTracker.tsx の冒頭）。
export function trackEvent(name: string, params: Record<string, string>) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
    return;
  }
  // gtag がまだ無い（読み込み前・ブロック時）場合は dataLayer に積んでおく
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
}
