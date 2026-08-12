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

// Branch のリンクドメイン。
//
// Branch管理画面で払い出される `xxxxx.app.link` 形式のドメインをここに入れると、
// サイト内のApp Store導線がすべてBranch経由に切り替わる。
// 空のあいだは、これまでどおりApp Storeへ直接リンクする。
//
// ⚠️ アプリ内ブラウザからApp Storeを開けない問題は、これでは解決しない。
//    2026-08-12の実機検証で、https・スキーム直リンク・自ドメイン経由の転送の
//    いずれもInstagram内では無反応だった。この用途の専業サービスも
//    「Metaのアプリ内ブラウザを確実に回避できるサービスは存在しない」としている。
//    Branchを入れても外部ブラウザへの誘導（InAppBrowserNotice）は必要。
const BRANCH_LINK_DOMAIN = "";

export const usesBranch = BRANCH_LINK_DOMAIN !== "";

export function appStoreUrl(campaign: string): string {
  const channel = sanitize(campaign);

  if (usesBranch) {
    // ~channel はBranchの分析用パラメータ。ダッシュボードで流入元の内訳になる。
    // $desktop_url はPCで開かれたときの逃げ先（Branchはストアへ送れないため）。
    return (
      `https://${BRANCH_LINK_DOMAIN}/?~channel=${channel}` +
      `&$desktop_url=${encodeURIComponent(APP_STORE_URL)}`
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
