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
  /** 別の商品ページに分かれている場合のリンク先（SISHICRAFTの鉢植え／キーホルダー） */
  href?: string;
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
  /** color: 色の丸をタップして写真を切り替える ／ size: 容量・種類の切り替えボタン */
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
    // 鉢植えとキーホルダーは別の商品ページ。切り替えるとリンク先も変わる。
    // 色の丸は商品写真の斑の色（鉢植え＝白、キーホルダー＝黄色）から取った
    variantStyle: "color",
    variants: [
      {
        name: "鉢植え（白い斑）",
        color: "#f0f2ea",
        price: "¥18,000",
        image: "/images/home/sishicraft-monstera.jpg",
        alt: "SISHICRAFT 斑入りモンステラのレザー作品",
        href: ecUrl("/items/143263775", "collection-sishicraft"),
      },
      {
        name: "キーホルダー（黄色の斑）",
        color: "#efe48e",
        price: "¥8,000",
        image: "/images/home/sishicraft-keyholder.jpg",
        alt: "SISHICRAFT 斑入りモンステラのレザーキーホルダー",
        href: ecUrl("/items/146918176", "collection-sishicraft-keyholder"),
      },
    ],
  },
];

/* ---------- 人気ランキング（Amazon） ---------- */

export interface RankingItem {
  asin: string;
  title: string;
  price: string;
  image: string;
  /** 並び順の根拠：この商品を紹介している記事の閲覧数の合計（表示はしない） */
  views: number;
}

/**
 * よく読まれている記事で紹介している商品のランキング（2026-10-28 オーナーと決定）。
 * 注文数やクリック数は記録が少なく15位まで意味のある順位を作れないため、
 * 「その商品を amazonProducts に載せている記事の、直近28日の閲覧数（GA4）の合計」で並べる。
 *
 * 除外するもの
 * - 当サイトのAmazon選定基準（★3.2以上・レビュー10件以上・出荷元Amazon・在庫あり）を満たさない商品
 *   （BARREL NEO AMATERAS／NEO TSUKUYOMI、HaruDesign L610／GL-T5、ITANSE スリット鉢、GOODGOODS、BIBIPLANTS、怪獣モス など）
 * - I'm original SOIL・HYDRO MINERAL の代わりになる培養土・無機培地
 *   （花ごころ・プロトリーフ・KINCHOの土、ねこチップ、ゼオライト、ハイドロボール、洋らんバーク、パーライト等）
 * - 同じ商品の容量違いは1つにまとめる（日清の水苔 No.500／No.150 など）
 * 閲覧数は 2026-09-30〜10-27、価格・評価は 2026-10-28 に商品ページで確認。定期的に作り直すこと。
 */
export const RANKING_LIMIT = 15;

export const READER_RANKING: RankingItem[] = [
  { asin: "B0CLD6QSDD", title: "BRIM FLORA 植物育成ライト 3ヘッド", price: "¥4,780", image: "https://m.media-amazon.com/images/I/81nywh0p0lL._AC_SL500_.jpg", views: 1586 },
  { asin: "B0B3M47RQJ", title: "BRIM SOL 植物育成ライト 24W", price: "¥3,426", image: "https://m.media-amazon.com/images/I/71B+1-FFtjL._AC_SL500_.jpg", views: 1251 },
  { asin: "B0CP4BVWMN", title: "BRIM PANEL A 植物育成ライト 45W", price: "¥7,386", image: "https://m.media-amazon.com/images/I/71KvklTOC0L._AC_SL500_.jpg", views: 1135 },
  { asin: "B0CY2VJ3D3", title: "ジャパン蘭土 圧縮水苔AAA 150g", price: "¥2,180", image: "https://m.media-amazon.com/images/I/61XVL+zGwUL._AC_SL500_.jpg", views: 722 },
  { asin: "B0BYYQTM98", title: "Charming Club モスポール 110cm", price: "¥2,599", image: "https://m.media-amazon.com/images/I/61AcOWOTsxL._AC_SL500_.jpg", views: 526 },
  { asin: "B0F1K913VB", title: "園芸支柱 ココスティック 120cm 太め", price: "¥1,499", image: "https://m.media-amazon.com/images/I/71oTpMWx6gL._AC_SL500_.jpg", views: 341 },
  { asin: "B0D7C1LT7M", title: "BRIM PANEL Y 植物育成ライト 100W", price: "¥9,764", image: "https://m.media-amazon.com/images/I/619wbqYTqKL._AC_SL500_.jpg", views: 279 },
  { asin: "B07ZTM6H4H", title: "ハイポネックス 専用液肥 観葉植物用 450ml", price: "¥990", image: "https://m.media-amazon.com/images/I/317m+X7Za-L._AC_SL500_.jpg", views: 250 },
  { asin: "B0CG35V5CD", title: "コルク樹皮 300×400mm（着生用）", price: "¥2,980", image: "https://m.media-amazon.com/images/I/51DbJvUJERL._AC_SL500_.jpg", views: 197 },
  { asin: "B0764P7D64", title: "SUStee 水やりチェッカー Mサイズ", price: "¥458", image: "https://m.media-amazon.com/images/I/41hQLomFS-L._AC_SL500_.jpg", views: 186 },
  { asin: "B07H9VRZ17", title: "ドウシシャ ルミナス ノワール ラック 4段", price: "¥9,720", image: "https://m.media-amazon.com/images/I/81eB9ZsSuoL._AC_SL500_.jpg", views: 158 },
  { asin: "B009HI1YBU", title: "タカショー ビニール温室 3段", price: "¥4,259", image: "https://m.media-amazon.com/images/I/71Hyz9Qw1YL._AC_SL500_.jpg", views: 158 },
  { asin: "B000FXC3T8", title: "日清ガーデンメイト 超圧縮水苔 No.500", price: "¥2,442", image: "https://m.media-amazon.com/images/I/71DAj0MPg9L._AC_SL500_.jpg", views: 128 },
  { asin: "B09KVC22B5", title: "チリ産水苔 AA 150g", price: "¥1,187", image: "https://m.media-amazon.com/images/I/51pzw95PcjL._AC_SL500_.jpg", views: 128 },
  { asin: "B09DG9KRZ7", title: "YOUSHY ココスティック 40cm×2本セット", price: "¥1,699", image: "https://m.media-amazon.com/images/I/71zAmMtBNtL._AC_SL500_.jpg", views: 119 },
];
