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
//   shop_top_banner ショップ(tokyoplants.com)のTOPバナー経由
//                   （URLは utm_source=shop&utm_medium=banner&utm_campaign=app_promo も併記。
//                   ch はApp Store側の計測用、utm_*はGA4のセッション流入元計測用で役割が別）
//   shop_blog      ショップ(BASE)のブログ記事経由
//                   （URLは utm_source=shop&utm_medium=blog&utm_campaign=app_promo も併記）
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
// Adjust管理画面で発行した英数字（例: ワンバンクは "hve3jrj"）をここに入れると、
// サイト内のApp Store導線がすべてAdjust経由に切り替わる。
// 空のあいだは、これまでどおりApp Storeへ直接リンクする。
//
// 料金は Base プランが無料（月1,500アトリビューションまで・最長12ヶ月）。
// セルフサーブで登録でき、遅延ディープリンクも含まれる。
// 2026-08-12に公式の料金ページで確認。
//
// ⚠️ インストール数の計測まで行うには、アプリ側にAdjust SDKの組み込みが必要。
//    トークンを入れただけではクリック数までしか取れない。
//
// ⚠️ アプリ内ブラウザからApp Storeを開けない問題について。
//    2026-08-12の実機検証時点ではInstagram内で無反応だったが、2026-08-17時点では
//    Instagramからでも直接開けるようになっている（Instagram側の挙動変化とみられる）。
//    そのため常時表示の事前案内（InAppBrowserNotice）は廃止し、実際にタップして
//    開かなかった場合だけ AppStoreButton.tsx の `blocked` フォールバックで
//    外部ブラウザへの誘導を出す方式にした。Adjustを入れてもこの前提は変わらない。
const ADJUST_LINK_TOKEN = "";

export const usesAdjust = ADJUST_LINK_TOKEN !== "";

export function appStoreUrl(campaign: string): string {
  const channel = sanitize(campaign);

  if (usesAdjust) {
    // PC閲覧時の逃げ先。Adjustはスマホ以外ではここへ転送する。
    const fallback = encodeURIComponent(APP_STORE_URL);
    // campaign はAdjustのリンクパラメータ名。管理画面のリンク設定によって
    // 使う名前が変わることがあるので、実際に数字が入るか必ず確認すること。
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
