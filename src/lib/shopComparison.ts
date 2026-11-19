import data from "@/data/shop-comparison.json";

/**
 * 観葉植物の通販比較（review/houseplant-online-shop-comparison）の比較表データ。
 * 2026-11-19 導入。表は Markdown に直書きせず src/data/shop-comparison.json から作る。
 *
 * - 価格・在庫・送料は月1回、商品ページを見て手動で更新する（2026-11-19 オーナー判断で自動更新はしない）。
 *   更新したら各行の checkedAt と manualCheckedAt を確認日にする。並び順は描画時に決まるので並べ替え不要
 * - Amazon は価格を出さない（アソシエイトの規約上、表示するなら常に最新である必要があるため）
 * - 並び順は描画時に「送料込み総額の安い順」で決める。売り切れ・取得失敗・手動で外したものは順位外
 */

export type SourceType = "rakuten" | "shopify" | "amazon" | "yahoo" | "manual";

export interface ShopItem {
  seller: string;
  url: string;
  product: string;
  size: string;
  price: number;
  shipping: number | null;
  shippingText?: string;
  photo: string;
  note: string;
  source: { type: SourceType; itemCode?: string; host?: string; handle?: string; variantId?: number; asin?: string };
  stock: "in" | "out";
  checkedAt: string;
  autoCheckedAt?: string;
  failCount: number;
  excluded?: string;
  needsReview?: string;
}

export interface ShopTable {
  plant: string;
  spec: string;
  items: ShopItem[];
}

export interface RankedRow {
  item: ShopItem;
  total: number | null;
  rank: number | null;
  /** 順位外の理由（rank が null のとき） */
  reason?: string;
}

const DB = data as { updatedAt: string; manualCheckedAt: string; tables: Record<string, ShopTable> };

/** 自動取得に何日続けて失敗したら順位から外すか */
const FAIL_LIMIT = 3;

export function getShopTable(id: string): ShopTable | null {
  return DB.tables[id] ?? null;
}

export function shopComparisonDates() {
  return { updatedAt: DB.updatedAt, manualCheckedAt: DB.manualCheckedAt };
}

function outReason(it: ShopItem): string | undefined {
  if (it.excluded) return it.excluded;
  if (it.stock === "out") return "売り切れ（確認時点）";
  if (it.failCount >= FAIL_LIMIT) return "価格・在庫を確認できなかったため、いったん順位から外しています";
  if (it.needsReview) return "価格が大きく変わったため確認中";
  if (it.shipping === null) return "送料を確認できなかったため、送料込みの順位から外しています";
  return undefined;
}

/** Amazon 以外の行を、送料込み総額の安い順に並べる。順位外の行は後ろにまとめる */
export function rankTable(t: ShopTable): { ranked: RankedRow[]; others: RankedRow[]; amazon: ShopItem[] } {
  const ranked: RankedRow[] = [];
  const others: RankedRow[] = [];
  const amazon: ShopItem[] = [];
  for (const it of t.items) {
    if (it.source.type === "amazon") {
      amazon.push(it);
      continue;
    }
    const total = it.shipping === null ? null : it.price + it.shipping;
    const reason = outReason(it);
    if (reason) others.push({ item: it, total, rank: null, reason });
    else ranked.push({ item: it, total, rank: null });
  }
  ranked.sort((a, b) => (a.total ?? 0) - (b.total ?? 0) || a.item.price - b.item.price);
  ranked.forEach((r, i) => (r.rank = i + 1));
  return { ranked, others, amazon };
}

export function yen(n: number): string {
  return `${n.toLocaleString("ja-JP")}円`;
}

export function shortDate(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${Number(m[2])}月${Number(m[3])}日` : iso;
}
