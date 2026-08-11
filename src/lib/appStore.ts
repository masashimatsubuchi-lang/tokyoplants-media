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

// ⚠️ アプリ名入りの長いURL（.../green-collection-%E8%A6%B3.../id6790673876）を
// 使ってはいけない。IDだけの短い形にすること。
//
// iOSのUAに対して、Appleはどのhttps URLでも `301 Location: itms-appss://...` を返す。
// このスキームURLはリクエストしたパスをそのまま引き継ぐため、
//   長いURL → itms-appss://.../green-collection-%E8%A6%B3.../id6790673876  (179文字)
//   短いURL → itms-appss://apps.apple.com/jp/app/id6790673876              (52文字)
// となり、Instagramのアプリ内ブラウザは前者を開けずタップしても何も起きない。
// 後者は問題なくApp Storeが開く（同じ形のURLで動いている実例を確認済み。2026-08-12）。
//
// pt / ct はどのみちこのリダイレクトで落ちるので、スキームURLの長さには影響しない。
const APP_STORE_URL = `https://apps.apple.com/jp/app/id${APP_ID}`;
const PROVIDER_ID = "129155915";

// URLコンストラクタを使うと、日本語部分のパーセントエンコードが再エンコードされて
// しまうため、文字列連結で組み立てる。
export function appStoreUrl(campaign: string): string {
  return `${APP_STORE_URL}?pt=${PROVIDER_ID}&ct=${sanitize(campaign)}&mt=8`;
}

// ctは最大40文字。使える文字種に丸める。
function sanitize(campaign: string): string {
  return campaign.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
}
