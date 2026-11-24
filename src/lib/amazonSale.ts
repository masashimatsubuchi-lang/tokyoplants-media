/**
 * Amazonの大型セール期間の告知（2026-11-24 導入）。
 *
 * 期間中だけ、サイト上部の帯・Amazon商品カードの上に「開催中」の告知を出す。
 * 記事ページは静的に書き出しているので、表示の切り替えは閲覧時（ブラウザ側）で判定する
 * （日付が変わってもビルドし直す必要はない）。
 *
 * 次のセール（プライムデー等）は SALES に1件足すだけで同じ表示になる。
 * 日程はAmazon公式の告知・報道で確認してから入れること。
 *
 * 表示文言の注意：紹介している個別の商品が値下がりしているとは書かない
 * （セール対象かどうかは商品ごとに違い、価格はAmazonの商品ページでしか保証できないため）。
 */
export type AmazonSale = {
  id: string;
  name: string;
  /** 先行セールの開始（無ければ start と同じ） */
  preStart: string;
  /** 本セールの開始 */
  start: string;
  /** 終了（この時刻を過ぎたら出さない） */
  end: string;
  /** 終了日の表示用（例「12/7（月）23:59」） */
  endLabel: string;
  preEndLabel?: string;
  /** セール会場のURL（アソシエイトタグは付けずに書く。表示時に付ける） */
  url: string;
};

export const SALES: AmazonSale[] = [
  {
    // 日程：先行 11/27(金)0:00〜11/29(日)23:59、本セール 11/30(月)0:00〜12/7(月)23:59
    // （2026-11-19 Amazon発表。Impress Watch ほか各紙の報道と amazon.co.jp/blackfriday で確認）
    id: "blackfriday-2026",
    name: "Amazon ブラックフライデー",
    preStart: "2026-11-27T00:00:00+09:00",
    start: "2026-11-30T00:00:00+09:00",
    end: "2026-12-08T00:00:00+09:00",
    endLabel: "12/7（月）23:59",
    preEndLabel: "11/29（日）23:59",
    url: "https://www.amazon.co.jp/blackfriday",
  },
];

export const AMAZON_TAG = "tokyoplants0f-22";

export function withTag(url: string): string {
  return url + (url.includes("?") ? "&" : "?") + `tag=${AMAZON_TAG}`;
}

export type SalePhase = { sale: AmazonSale; phase: "pre" | "main" } | null;

/** now の時点で開催中のセール。確認用に ?amazonSale=pre|main で強制表示できる */
export function currentSale(now: Date, preview?: string | null): SalePhase {
  if (preview === "pre" || preview === "main") return { sale: SALES[0], phase: preview };
  const t = now.getTime();
  for (const sale of SALES) {
    if (t >= Date.parse(sale.start) && t < Date.parse(sale.end)) return { sale, phase: "main" };
    if (t >= Date.parse(sale.preStart) && t < Date.parse(sale.start)) return { sale, phase: "pre" };
  }
  return null;
}
