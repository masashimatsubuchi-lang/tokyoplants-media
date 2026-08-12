// App Store（Green Collection）へのリンク生成。
//
// 流入元の計測に使うチャネル名の一覧。
// ここで付けた値が、計測先（下記）と GA4 の app_store_click イベントの
// channel の両方に入る。
//
//   instagram      Instagramのプロフィールリンク
//   media_banner   メディアのヘッダー帯バナー
//   media_article  記事下のCTA
//   media_footer   メディアのフッター
//   header         メディアのヘッダーのAppボタン
//   invite         ともだち招待の着地ページ
//   app_lp         /app に直接来た（chなし）
//
// ⚠️ サイト内からApp Storeへ直リンクしないこと。アプリ内ブラウザで開けなくなる。
// 必ず /app?ch=... を経由させるか、AppStoreButton を使うこと。
const APP_ID = "6790673876";

// ⚠️ アプリ名入りの長いURL（.../green-collection-%E8%A6%B3.../id6790673876）を
// 使ってはいけない。IDだけの短い形にすること。
// iOSのUAに対して、Appleはどのhttps URLでも `301 Location: itms-appss://...` を返し、
// このスキームURLはリクエストしたパスをそのまま引き継ぐため、無駄に長くなる。
const APP_STORE_URL = `https://apps.apple.com/jp/app/id${APP_ID}`;
const PROVIDER_ID = "129155915";

// Adjust のリンクトークン。
//
// Adjust管理画面で発行した英数字（例: onebank は "hve3jrj"）をここに入れると、
// サイト内のApp Store導線がすべてAdjust経由に切り替わる。
// 空のあいだは、これまでどおりApp Storeへ直接リンクする。
//
// ⚠️ インストール数の計測まで行うには、アプリ側にAdjust SDKの組み込みが必要。
//    トークンを入れただけではクリック数までしか取れない。
//
// ⚠️ アプリ内ブラウザからApp Storeを開けない問題は、これでは解決しない可能性が高い。
//    2026-08-12の実機検証で、https・スキーム直リンク・自ドメイン経由の転送の
//    いずれもInstagram内では無反応だった。Adjust自身もInstagram経由では
//    「ブラウザで開いて続ける」という手順画面を出している。
//    導入の主目的は計測と割り切ること。
const ADJUST_LINK_TOKEN = "";

export const usesAdjust = ADJUST_LINK_TOKEN !== "";

export function appStoreUrl(campaign: string): string {
  const channel = sanitize(campaign);

  if (usesAdjust) {
    // PC閲覧時の逃げ先。Adjustはスマホ以外ではここへ転送する。
    const fallback = encodeURIComponent(APP_STORE_URL);
    // campaign / adgroup はAdjustのリンクパラメータ名。
    // 管理画面のリンク設定によって使う名前が変わることがあるので、
    // 実際に計測が入るかダッシュボードで必ず確認すること。
    return (
      `https://app.adjust.com/${ADJUST_LINK_TOKEN}` +
      `?campaign=${channel}` +
      `&redirect_macos=${fallback}&redirect_windows=${fallback}`
    );
  }

  // pt（Provider ID）とct（Campaign Token）で、App Store Connectの
  // アナリティクス > 獲得 > キャンペーン に流入元ごとの数字が入る。
  return `${APP_STORE_URL}?pt=${PROVIDER_ID}&ct=${channel}&mt=8`;
}

// ctは最大40文字。使える文字種に丸める。
function sanitize(campaign: string): string {
  return campaign.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
}
