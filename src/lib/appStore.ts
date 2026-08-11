// App Store（Green Collection）へのリンク生成。
// pt（Provider ID）とct（Campaign Token）を付けることで、App Store Connectの
// アナリティクス > 獲得 > キャンペーン で流入元ごとのダウンロード数を計測できる。
// ctは最大40文字。
// 流入元の計測に使うチャネル名の一覧。
// ここで付けた値が App Store Connect の ct（キャンペーン）と
// GA4 の app_store_click イベントの channel の両方に入る。
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
const APP_STORE_URL =
  "https://apps.apple.com/jp/app/green-collection-%E8%A6%B3%E8%91%89%E6%A4%8D%E7%89%A9%E3%81%AE%E3%81%8A%E4%B8%96%E8%A9%B1-%E6%88%90%E9%95%B7%E8%A8%98%E9%8C%B2/id6790673876";
const PROVIDER_ID = "129155915";

// URLコンストラクタを使うと、日本語部分のパーセントエンコードが再エンコードされて
// しまうため、文字列連結で組み立てる。
export function appStoreUrl(campaign: string): string {
  return `${APP_STORE_URL}?pt=${PROVIDER_ID}&ct=${sanitize(campaign)}&mt=8`;
}

// App Store アプリを直接開くスキーム。
//
// iOSのUAで https://apps.apple.com にアクセスすると、Appleは必ず
// `301 Location: itms-appss://...` を返す。Safariはこれを解釈してApp Storeを開くが、
// Instagram等のアプリ内ブラウザ（WKWebView）はhttp/https以外へのサーバーリダイレクトを
// 処理できず、何も起きないまま止まる（2026-08-12にオーナー環境で再現）。
//
// リダイレクトを経由せず、最初からスキームでリンクすれば、
// アプリ内ブラウザでもOSに受け渡される可能性がある。
// アプリ内ブラウザだと判定できたときだけ、こちらを使う。
export function appStoreSchemeUrl(campaign: string): string {
  return `itms-apps://apps.apple.com/jp/app/id${APP_ID}?pt=${PROVIDER_ID}&ct=${sanitize(campaign)}`;
}

// ctは最大40文字。使える文字種に丸める。
function sanitize(campaign: string): string {
  return campaign.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
}
