// App Store（my Plants Collection / Green Collection）へのリンク生成。
// pt（Provider ID）とct（Campaign Token）を付けることで、App Store Connectの
// アナリティクス > 獲得 > キャンペーン で流入元ごとのダウンロード数を計測できる。
// ctは最大40文字。
const APP_STORE_URL =
  "https://apps.apple.com/jp/app/green-collection-%E8%A6%B3%E8%91%89%E6%A4%8D%E7%89%A9%E3%81%AE%E3%81%8A%E4%B8%96%E8%A9%B1-%E6%88%90%E9%95%B7%E8%A8%98%E9%8C%B2/id6790673876";
const PROVIDER_ID = "129155915";

// URLコンストラクタを使うと、日本語部分のパーセントエンコードが再エンコードされて
// しまうため、文字列連結で組み立てる。
export function appStoreUrl(campaign: string): string {
  const ct = campaign.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
  return `${APP_STORE_URL}?pt=${PROVIDER_ID}&ct=${ct}&mt=8`;
}
