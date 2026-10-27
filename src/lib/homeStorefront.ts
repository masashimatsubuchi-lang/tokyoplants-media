/**
 * トップページ（商品発見型）のデータ。
 *
 * - 自社商品の文言は、ECの商品ページの言葉からの抜粋を基本にしている（2026-10-28 取得）
 * - カードの文字はApple Storeの商品カードにならい「種類・名前・一言・価格」の4つだけ
 * - 外部商品はトップでは人気ランキングだけを出す（編集部おすすめは /items）
 */

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
  name: string;
  image: string;
  /** 色の丸に塗る色（CSSのbackground）。2色の柄は斜めに塗り分ける */
  color?: string;
  alt: string;
  /** 容量ごとに価格が違う場合の価格 */
  price?: string;
}

export interface OwnProduct {
  id: string;
  /** 商品の種類（小さな見出し）。SOILはここで「tokyoplantsプレミアム培養土」を併記する */
  kind: string;
  name: string;
  /** ECの商品ページから抜粋した一言 */
  catchCopy: string;
  price: string;
  image: string;
  alt: string;
  /** 柄違い・容量違い。先頭が代表。画像ファイルが無いものはページ側で表示しない */
  variants?: ProductVariant[];
  /** color: 色の丸をタップして写真を切り替える ／ size: 容量の切り替えボタン */
  variantStyle?: "color" | "size";
  href: string;
}

/** タオルの柄。並びはECの「種類」の8項目と同じ。代表はモンステラ・ホワイト（オーナー指定）。
 *  色は商品写真の地の色から取った目安で、2色の柄は丸を斜めに塗り分ける */
const TOWEL_PATTERNS: [string, string, string][] = [
  ["モンステラ・デリシオーサ｜斑入り", "monstera-variegata", "linear-gradient(135deg, #2f6b4f 50%, #efe6c2 50%)"],
  ["モンステラ・デリシオーサ｜緑", "monstera-green", "linear-gradient(135deg, #3a6e4a 50%, #ffffff 50%)"],
  ["アンスリウム・ワロクアーナム｜緑", "warocqueanum-green", "#6fa35f"],
  ["アンスリウム・ワロクアーナム｜深緑", "warocqueanum-deepgreen", "#2c5a38"],
  ["アンスリウム・キング オブ スペード｜緑", "king-of-spades-green", "#3f7d64"],
  ["アンスリウム・キング オブ スペード｜黒", "king-of-spades-black", "#1f2e52"],
  ["アロカシア｜緑", "alocasia-green", "linear-gradient(135deg, #b8dba4 50%, #2f6a3d 50%)"],
  ["アロカシア｜ピンク", "alocasia-pink", "linear-gradient(135deg, #f5d2d9 50%, #5cc24e 50%)"],
];

export const OWN_COLLECTION: OwnProduct[] = [
  {
    id: "soil",
    kind: "tokyoplantsプレミアム培養土",
    name: "I'm original SOIL",
    catchCopy: "特別な植物には、特別な土を。",
    // 写真はオーナー指定どおり2Lを主役にし、10Lに切り替えられる
    price: "¥1,200",
    image: "/images/home/soil-2l.jpg",
    alt: "I'm original SOIL 2Lのパッケージ",
    variantStyle: "size",
    variants: [
      { name: "2L", price: "¥1,200", image: "/images/home/soil-2l.jpg", alt: "I'm original SOIL 2Lのパッケージ" },
      { name: "10L", price: "¥4,800", image: "/images/home/soil-10l.jpg", alt: "I'm original SOIL 10Lのパッケージ" },
    ],
    href: ecUrl("/items/99620939", "collection-soil"),
  },
  {
    id: "hydro",
    kind: "溶岩石×ゼオライトの無機培地",
    name: "HYDRO MINERAL",
    catchCopy: "土を使わない、新しい植物の育て方。",
    price: "¥1,480",
    image: "/images/home/hydro-mineral.jpg",
    alt: "HYDRO MINERAL 2Lのパッケージ",
    href: ecUrl("/items/142692278", "collection-hydro"),
  },
  {
    id: "towel",
    kind: "希少植物のリーフタオル・全8種",
    name: "Daily Botanical Towel",
    catchCopy: "キッチンや洗面所に、植物がある。",
    price: "¥2,000",
    image: "/images/home/towel-monstera-variegata.jpg",
    alt: "Daily Botanical Towel モンステラ・デリシオーサ 斑入り",
    variantStyle: "color",
    variants: TOWEL_PATTERNS.map(([name, file, color]) => ({
      name,
      image: `/images/home/towel-${file}.jpg`,
      color,
      alt: `Daily Botanical Towel ${name.replace("｜", " ")}`,
    })),
    href: ecUrl("/items/135803882", "collection-towel"),
  },
  {
    id: "sishicraft",
    kind: "SISHICRAFT × tokyoplants",
    name: "Leather Botanical",
    catchCopy: "台湾で出会った、ひとつの作品。",
    price: "¥18,000",
    image: "/images/home/sishicraft-monstera.jpg",
    alt: "SISHICRAFT 斑入りモンステラのレザー作品",
    href: ecUrl("/items/143263775", "collection-sishicraft"),
  },
];

/* ---------- 人気ランキング（Amazon） ---------- */

export interface RankingItem {
  asin: string;
  title: string;
  price: string;
  image: string;
  /** 並び順の根拠（表示はしない） */
  orders: number;
}

/**
 * tokyoplants経由のAmazon注文数の多い順。最大15位まで表示する。
 * 当サイトのAmazon選定基準（★3.2以上・レビュー10件以上・出荷元Amazon・在庫あり）を
 * 満たす商品だけを載せ、満たさない商品は注文数が多くても載せない。
 *   除外: BARREL NEO AMATERAS-20W（32件・レビュー9件）、HaruDesign L610（15件・出荷元が販売者）、
 *         BARREL NEO TSUKUYOMI-20W（6件・レビュー7件）
 * 出典はアソシエイトの「リンクした商品」レポート（上位のみ明細が出て、残りは Other にまとまる）。
 * 15位まで埋めるには「注文レポート」の全明細が要る。価格・評価は 2026-10-28 に商品ページで確認。
 */
export const RANKING_PERIOD = "2026年1月1日〜10月26日";
export const RANKING_LIMIT = 15;

export const READER_RANKING: RankingItem[] = [
  { asin: "B0CLD6QSDD", title: "BRIM FLORA 植物育成ライト 3ヘッド", price: "¥4,780", image: "https://m.media-amazon.com/images/I/81nywh0p0lL._AC_SL500_.jpg", orders: 19 },
  { asin: "B0CY2VJ3D3", title: "ジャパン蘭土 圧縮水苔AAA 150g", price: "¥2,180", image: "https://m.media-amazon.com/images/I/61XVL+zGwUL._AC_SL500_.jpg", orders: 10 },
  { asin: "B0CP4BVWMN", title: "BRIM PANEL A 植物育成ライト 45W", price: "¥7,386", image: "https://m.media-amazon.com/images/I/71KvklTOC0L._AC_SL500_.jpg", orders: 9 },
  { asin: "B0B3M47RQJ", title: "BRIM SOL 植物育成ライト 24W", price: "¥3,426", image: "https://m.media-amazon.com/images/I/71B+1-FFtjL._AC_SL500_.jpg", orders: 8 },
  { asin: "B0BYYQTM98", title: "Charming Club モスポール 110cm", price: "¥2,599", image: "https://m.media-amazon.com/images/I/61AcOWOTsxL._AC_SL500_.jpg", orders: 6 },
];
