/**
 * トップページ（商品発見型）のデータ。
 *
 * - 自社商品の文言は、ECの商品ページの言葉からの抜粋を基本にしている（2026-10-28 取得）
 * - 外部商品は「編集部おすすめ」（/items と同じ RECOMMENDED_SECTIONS を流用）と
 *   「読者によく選ばれている」（Amazonアソシエイトの注文数）を別の列にし、混ぜない
 */
import { RECOMMENDED_SECTIONS, RecommendedItem } from "@/lib/recommendedItems";

const EC = "https://www.tokyoplants.com";

/** ECリンクに付ける計測パラメータ。utm_content は ClickTracker の ec_click の placement になる */
export function ecUrl(path: string, placement: string): string {
  const u = new URL(path, EC);
  u.searchParams.set("utm_source", "media");
  u.searchParams.set("utm_medium", "home");
  u.searchParams.set("utm_campaign", "storefront");
  u.searchParams.set("utm_content", placement);
  return u.toString();
}

export interface ProductVariant {
  label: string;
  price: string;
  image: string;
  alt: string;
}

export interface OwnProduct {
  id: string;
  /** 商品の種類（小さな見出し）。SOILはここで「tokyoplantsプレミアム培養土」を併記する */
  kind: string;
  name: string;
  /** ECの商品ページから抜粋した一言 */
  catchCopy: string;
  variants: ProductVariant[];
  /** 在庫・発送の状態。一時的な告知なので、状況が変わったら消す */
  status?: string;
  /** 柄の数を色の点で示す（タオル） */
  swatches?: { name: string; color: string }[];
  href: string;
  article: { href: string; label: string };
}

export const OWN_COLLECTION: OwnProduct[] = [
  {
    id: "soil",
    kind: "tokyoplantsプレミアム培養土",
    name: "I'm original SOIL",
    catchCopy: "特別な植物には、特別な土を。",
    variants: [
      { label: "2L", price: "¥1,200", image: "/images/home/soil-2l.jpg", alt: "I'm original SOIL 2Lのパッケージ" },
      { label: "10L", price: "¥4,800", image: "/images/home/soil-10l.jpg", alt: "I'm original SOIL 10Lのパッケージ" },
    ],
    status: "予約受付中・11月1日から順次発送",
    href: ecUrl("/items/99620939", "collection-soil"),
    article: { href: "/soil/houseplant-soil-hub-guide", label: "土の選び方を読む" },
  },
  {
    id: "hydro",
    kind: "溶岩石×ゼオライトの無機培地",
    name: "HYDRO MINERAL",
    catchCopy: "土を使わない、新しい植物の育て方。",
    variants: [
      { label: "2L", price: "¥1,480", image: "/images/home/hydro-mineral.jpg", alt: "HYDRO MINERAL 2Lのパッケージ" },
    ],
    href: ecUrl("/items/142692278", "collection-hydro"),
    article: { href: "/soil/hydroculture-complete-guide", label: "ハイドロカルチャーを読む" },
  },
  {
    id: "towel",
    kind: "希少植物のリーフタオル",
    name: "Daily Botanical Towel",
    catchCopy: "キッチンや洗面所に、植物がある。",
    variants: [
      {
        label: "",
        price: "¥2,000",
        image: "/images/home/towel-monstera-variegata.jpg",
        alt: "Daily Botanical Towel モンステラ・デリシオーサ 斑入り",
      },
    ],
    // ECの「種類」の8項目。色は商品写真から近い色を取った目安
    swatches: [
      { name: "モンステラ・デリシオーサ｜緑", color: "#3f6e50" },
      { name: "モンステラ・デリシオーサ｜斑入り", color: "#e8e2bf" },
      { name: "アンスリウム・ワロクアーナム｜緑", color: "#7aa25f" },
      { name: "アンスリウム・ワロクアーナム｜深緑", color: "#2e5a3b" },
      { name: "アンスリウム・キング オブ スペード｜緑", color: "#4d8063" },
      { name: "アンスリウム・キング オブ スペード｜黒", color: "#1f2a47" },
      { name: "アロカシア｜緑", color: "#a8c98e" },
      { name: "アロカシア｜ピンク", color: "#f1c9cf" },
    ],
    href: ecUrl("/items/135803882", "collection-towel"),
    article: { href: "/review/daily-botanical-towel-review", label: "使い心地を読む" },
  },
  {
    id: "sishicraft",
    kind: "SISHICRAFT × tokyoplants",
    name: "Leather Botanical",
    catchCopy: "台湾で出会った、ひとつの作品。",
    variants: [
      {
        label: "",
        price: "¥18,000",
        image: "/images/home/sishicraft-monstera.jpg",
        alt: "SISHICRAFT 斑入りモンステラのレザー作品",
      },
    ],
    status: "現在売り切れ・再入荷通知を受付中",
    href: ecUrl("/items/143263775", "collection-sishicraft"),
    article: { href: "/review/leather-botanical-collection", label: "作品の話を読む" },
  },
];

/* ---------- 外部商品 ---------- */

export interface ShelfItem {
  asin: string;
  title: string;
  price?: string;
  image: string;
  /** 編集部おすすめ: 選んだ理由（1文） */
  reason?: string;
  article?: { href: string };
  /** 人気の列: 順位と注文数 */
  rank?: number;
  orders?: number;
}

export interface Shelf {
  id: string;
  title: string;
  /** 列の選定根拠。ランキングと編集部おすすめを見分けられるよう、必ず書く */
  basis: string;
  items: ShelfItem[];
}

function amazonImage(item: RecommendedItem): string {
  return item.image ?? `https://m.media-amazon.com/images/P/${item.asin}.01._SL500_.jpg`;
}

const ALL_RECOMMENDED = RECOMMENDED_SECTIONS.flatMap((s) => s.items).filter((i) => i.source === "amazon");

function pick(asins: string[]): ShelfItem[] {
  return asins.flatMap((asin) => {
    const item = ALL_RECOMMENDED.find((i) => i.asin === asin);
    if (!item) return [];
    return [
      {
        asin,
        title: item.title,
        price: item.price,
        image: amazonImage(item),
        reason: item.reason,
        article: item.relatedSlugs[0] ? { href: `/${item.relatedSlugs[0]}` } : undefined,
      },
    ];
  });
}

/**
 * tokyoplants経由のAmazon注文数（アソシエイトの「リンクした商品」レポート）。
 * 当サイトのAmazon選定基準（★3.2以上・レビュー10件以上・出荷元Amazon・在庫あり）を
 * 満たす商品だけを注文数の順に並べる。満たさない商品は順位があっても載せない。
 *   除外: BARREL NEO AMATERAS-20W（32件・レビュー9件）、HaruDesign L610（15件・出荷元が販売者）、
 *         BARREL NEO TSUKUYOMI-20W（6件・レビュー7件）
 * 価格・評価は 2026-10-28 に商品ページで確認。
 */
export const RANKING_PERIOD = "2026年1月1日〜10月26日";

export const READER_RANKING: Shelf = {
  id: "ranking",
  title: "読者によく選ばれている",
  basis: `tokyoplants経由のAmazon注文数の多い順（${RANKING_PERIOD}）。当サイトの選定基準を満たす商品のみ。`,
  items: [
    { asin: "B0CLD6QSDD", title: "BRIM FLORA 植物育成ライト 3ヘッド", price: "¥4,780", image: "https://m.media-amazon.com/images/I/81nywh0p0lL._AC_SL500_.jpg", rank: 1, orders: 19 },
    { asin: "B0CY2VJ3D3", title: "ジャパン蘭土 圧縮水苔AAA 150g", price: "¥2,180", image: "https://m.media-amazon.com/images/I/61XVL+zGwUL._AC_SL500_.jpg", rank: 2, orders: 10 },
    { asin: "B0CP4BVWMN", title: "BRIM PANEL A 植物育成ライト 45W", price: "¥7,386", image: "https://m.media-amazon.com/images/I/71KvklTOC0L._AC_SL500_.jpg", rank: 3, orders: 9 },
    { asin: "B0B3M47RQJ", title: "BRIM SOL 植物育成ライト 24W", price: "¥3,426", image: "https://m.media-amazon.com/images/I/71B+1-FFtjL._AC_SL500_.jpg", rank: 4, orders: 8 },
    { asin: "B0BYYQTM98", title: "Charming Club モスポール 110cm", price: "¥2,599", image: "https://m.media-amazon.com/images/I/61AcOWOTsxL._AC_SL500_.jpg", rank: 5, orders: 6 },
  ],
};

const EDITORIAL_BASIS = "記事で取り上げ、編集部が選んだもの。選んだ理由を添えています。";

export const EDITORIAL_SHELVES: Shelf[] = [
  { id: "lights", title: "植物育成ライト", basis: EDITORIAL_BASIS, items: pick(["B0BXPKS4S7", "B0D362RR1R", "B0GHQKG46C"]) },
  { id: "pots", title: "鉢・プランター", basis: EDITORIAL_BASIS, items: pick(["B08CXX4B4X", "B00BQ6BVPU", "B0CWRL4LK3", "B0928GVB1B"]) },
  { id: "repotting", title: "剪定・植え替えの道具", basis: EDITORIAL_BASIS, items: pick(["B005Q4LU1I", "B00CSH0AGC", "B0C9LN59ZR"]) },
  { id: "watering", title: "水やりの道具", basis: EDITORIAL_BASIS, items: pick(["B01H2Z9PRO", "B0BGXVXGSV", "B001HPEIWI"]) },
  { id: "measuring", title: "温湿度計・水分計", basis: EDITORIAL_BASIS, items: pick(["B002B54J4U", "B08PPML5TC", "B0DF4TB93J"]) },
  { id: "environment", title: "育てる環境を整える", basis: EDITORIAL_BASIS, items: pick(["B0D9896MPY", "B0DCFXF1H1", "B0CZTGPY25"]) },
];
