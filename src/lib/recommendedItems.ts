/**
 * 「tokyoplantsのおすすめアイテム」ページのデータ。
 * 記事内で実際に紹介・検証したtokyoplants公式商品とAmazon商品の中から、
 * 用途別に編集部が厳選したものだけを掲載する（網羅的な商品DBではない）。
 * 各商品は必ず、選定根拠となった記事（relatedSlug）を1件以上持つ。
 */

export type ItemSource = "tokyoplants" | "amazon";

export interface RecommendedItem {
  /** 商品名 */
  title: string;
  source: ItemSource;
  /** tokyoplants商品の場合はEC URL、Amazon商品の場合は未使用（asinを使う） */
  url?: string;
  /** Amazon商品の場合のASIN */
  asin?: string;
  price?: string;
  /** なぜ選んでいるか（1〜3文、本文の言い換えではなく購入判断の決め手） */
  reason: string;
  /** この商品の選定根拠となった記事（content/{category}/{slug}） */
  relatedSlugs: string[];
}

export interface RecommendedItemSection {
  id: string;
  title: string;
  description: string;
  items: RecommendedItem[];
}

export const RECOMMENDED_OWN_ITEMS: RecommendedItem[] = [
  {
    title: "I'm original SOIL（tokyoplantsプレミアム培養土）",
    source: "tokyoplants",
    url: "https://www.tokyoplants.com/items/99620939",
    price: "¥1,200〜",
    reason:
      "6種の天然素材をブレンドし、化学肥料不使用で元肥配合済み。植え替え直後から追肥を気にせず使える、tokyoplantsの看板用土です。",
    relatedSlugs: ["soil/recommended-soil-for-houseplants"],
  },
  {
    title: "HYDRO MINERAL 2L｜溶岩石×ゼオライトの培地",
    source: "tokyoplants",
    url: "https://www.tokyoplants.com/items/142692278",
    price: "¥1,480",
    reason:
      "富士山溶岩石75%・ゼオライト25%の無機配合で、ハイドロカルチャーや底面給水に最適。肥料効果が8〜9ヶ月持続するため管理の手間が少なくて済みます。",
    relatedSlugs: ["guide/monstera-hydroculture", "guide/alocasia-hydroculture"],
  },
  {
    title: "Daily Botanical Towel｜リーフタオル",
    source: "tokyoplants",
    url: "https://www.tokyoplants.com/items/135803882",
    price: "¥2,000",
    reason:
      "モンステラ・アンスリウム・アロカシアなど人気植物のシルエットをモチーフにしたマイクロファイバータオル。植物好きへのギフトとしても選ばれています。",
    relatedSlugs: ["species/genus-monstera"],
  },
];

export const RECOMMENDED_SECTIONS: RecommendedItemSection[] = [
  {
    id: "repotting",
    title: "植え替える",
    description: "植え替え作業そのものを安全に・快適にする道具",
    items: [
      {
        title: "ARS(アルス) 剪定鋏 VS-8Z",
        source: "amazon",
        asin: "B005Q4LU1I",
        price: "¥3,220〜",
        reason:
          "1876年創業・堺の刃物メーカー製のバイパス式。握るだけでロック解除できる打ち合いクッション付きで、根切りにも使いやすい定番の1本です。",
        relatedSlugs: ["review/pruning-shears-comparison", "guide/repotting-tools-checklist"],
      },
      {
        title: "ヒラサワ PC 土入れ 3ツ組",
        source: "amazon",
        asin: "B00CSH0AGC",
        price: "¥355〜",
        reason:
          "大小3サイズがセットになった定番の土入れ。鉢のサイズに合わせて使い分けられ、価格も手頃なので最初の1セットとしておすすめです。",
        relatedSlugs: ["guide/repotting-tools-checklist"],
      },
      {
        title: "XiaZ園芸シート 極厚植え替えシート 75×75cm",
        source: "amazon",
        asin: "B0C9LN59ZR",
        price: "¥999前後",
        reason:
          "600D防水オックスフォード生地に銅製ボタン付き。植え替え中にこぼれた土をそのまま鉢に戻せる設計で、部屋を汚さずに作業できます。",
        relatedSlugs: ["review/repotting-mat-comparison"],
      },
    ],
  },
  {
    id: "growing",
    title: "育てる",
    description: "日々の生育を支えるライト・風・栄養の道具",
    items: [
      {
        title: "BARREL NEO AMATERAS LED 20W 植物育成ライト",
        source: "amazon",
        asin: "B0BXPKS4S7",
        reason:
          "電球型で高PPFD・演色性Ra97の本格モデル。コレクター植物や光量を要する品種まで、幅広い植物の光量不足を補えます。",
        relatedSlugs: ["review/plant-light-review"],
      },
      {
        title: "SwitchBot サーキュレーター Lite",
        source: "amazon",
        asin: "B0D9896MPY",
        reason:
          "DCモーター搭載で静音22dB、30畳まで対応。風通しを良くすることでコバエや根腐れの予防にもつながる、地味だが効果の大きい道具です。",
        relatedSlugs: ["review/circulator-for-houseplants-review"],
      },
      {
        title: "フルプラ ダイヤスプレー エクセレント500",
        source: "amazon",
        asin: "B001HPEIWI",
        reason:
          "霧が細かく葉全体に均一にかかるタイプ。高湿度を好む植物の葉水や、ハダニ予防の日常ケアに使いやすい定番品です。",
        relatedSlugs: ["review/misting-bottle-review"],
      },
      {
        title: "ハイポネックス原液 800ml",
        source: "amazon",
        asin: "B0027WPD7O",
        price: "¥748〜",
        reason:
          "液体肥料の定番。希釈して水やりのタイミングで使え、成長期の追肥を切らさないために常備しておきたい1本です。",
        relatedSlugs: ["review/houseplant-fertilizer-products-comparison"],
      },
      {
        title: "住友化学園芸 ルートン 植物成長調整剤 15g",
        source: "amazon",
        asin: "B00288GPJC",
        price: "¥400〜600程度",
        reason:
          "挿し木を増やしたいときの発根促進剤の定番。切り口に軽くまぶすだけで発根率が上がりやすく、初めての挿し木にも扱いやすい粉末タイプです。",
        relatedSlugs: ["review/rooting-hormone-powder-comparison"],
      },
      {
        title: "Ailunate 試験管フラワーベース 木製フレーム",
        source: "amazon",
        asin: "B0CV9TCSQR",
        price: "¥1,478前後",
        reason:
          "水挿しの発根管理をそのままインテリアにできる試験管型スタンド。挿し穂の根の伸びを日々観察したい人に向いています。",
        relatedSlugs: ["review/propagation-station-glass-vase-comparison"],
      },
    ],
  },
  {
    id: "measuring",
    title: "環境を測る",
    description: "勘に頼らず、数値で管理判断するための道具",
    items: [
      {
        title: "タニタ(Tanita) デジタル温湿度計 TT-538 BK",
        source: "amazon",
        asin: "B002B54J4U",
        price: "¥3,064前後",
        reason:
          "温度・湿度に加え快適レベルまで表示され、最高最低記録・アラーム機能付き。置き場所の環境を数値で把握する第一歩に向いています。",
        relatedSlugs: ["review/thermo-hygrometer-comparison"],
      },
      {
        title: "SUStee(サスティー) 水やりチェッカー Mサイズ 5本セット",
        source: "amazon",
        asin: "B08PPML5TC",
        price: "¥2,480〜",
        reason:
          "GOOD DESIGN AWARD受賞の色変化式・電池不要スティック。土に挿しておくだけで水やりのタイミングが一目でわかり、水のやりすぎ・根腐れ予防に直結します。",
        relatedSlugs: ["review/watering-checker-comparison"],
      },
      {
        title: "YAMRON 4-in-1 土壌水分計（水分・pH・温度・日照）",
        source: "amazon",
        asin: "B0DF4TB93J",
        price: "¥2,798前後",
        reason:
          "水分・pH・温度に加えて日照（照度）まで1台で数値化できるデジタルメーター。電池式でアプリ不要、すぐに使い始められます。",
        relatedSlugs: ["review/smart-soil-moisture-sensor-comparison"],
      },
    ],
  },
  {
    id: "pest-trouble",
    title: "害虫・トラブル対策",
    description: "コバエ・害虫・カビなど、起きてしまったトラブルへの対処",
    items: [
      {
        title: "住友化学園芸 ベニカXファインスプレー 420ml",
        source: "amazon",
        asin: "B007UM6NK2",
        price: "¥800〜",
        reason:
          "スプレータイプで、ハダニ・アブラムシ・カイガラムシに即効性があります。虫を見つけたときにすぐ対処できる、常備しておきたい1本です。",
        relatedSlugs: ["review/houseplant-pest-control-tools"],
      },
      {
        title: "アースガーデン BotaNice 土からわいたコバエ退治 置くだけ粘着剤タイプ",
        source: "amazon",
        asin: "B0CRJND4H6",
        price: "¥1,555〜",
        reason:
          "土に挿すだけで忌避と捕獲を両立でき、薬剤不使用なので小さな子供やペットがいる家庭でも使いやすい設計です。",
        relatedSlugs: ["review/fungus-gnat-control-products-comparison"],
      },
      {
        title: "ゼオライト 根腐れ防止剤 中粒 2L",
        source: "amazon",
        asin: "B0CZJKWQKB",
        price: "¥2,500〜",
        reason:
          "土に混ぜ込むことで水はけを改善し、過湿によるカビ・根腐れの発生を予防します。土のカビが気になる方の対策の第一歩に向いています。",
        relatedSlugs: ["soil/mold-on-houseplant-soil"],
      },
    ],
  },
  {
    id: "placement",
    title: "置き場所を整える",
    description: "植物を並べる・移動する・増やしたときの収納と設備",
    items: [
      {
        title: "BIBILAB ビザールプランツラック LPR-800-BK",
        source: "amazon",
        asin: "B0DGFY7TMV",
        reason:
          "育成ライト・サーキュレーターの取付に対応した植物専用設計のラック。キャスター付きで連結拡張もでき、コレクションが増えてきた人に向いています。",
        relatedSlugs: ["review/plant-rack-and-greenhouse-review"],
      },
      {
        title: "Goovilla 花台 鉢受プレート キャスター付き 伸縮タイプ",
        source: "amazon",
        asin: "B0F8HVGRB4",
        price: "¥2,490",
        reason:
          "耐荷重200kgで円形・矩形どちらの鉢にも対応する伸縮式。大型鉢の日当たり調整や模様替えの負担を大きく減らせます。",
        relatedSlugs: ["review/plant-caddy-stand-with-wheels-comparison"],
      },
      {
        title: "Bambu Lab A1 mini 3Dプリンター",
        source: "amazon",
        asin: "B0CRYJBKQQ",
        reason:
          "既製品にちょうどいいサイズがない鉢を自作したい人向けの入門機。通気性メッシュ鉢など、観葉植物向けのデータ設計にも対応しやすいモデルです。",
        relatedSlugs: ["review/bambu-lab-3d-printer-comparison"],
      },
      {
        title: "セフティー3(Safety-3) 鉢底用ネット ロールタイプ 30×50cm",
        source: "amazon",
        asin: "B01EIXUY0A",
        price: "¥417〜",
        reason:
          "好きなサイズにカットして使えるロールタイプの定番品。植え替えのたびに鉢底石の流出・虫の侵入を防ぐ、地味だが欠かせない道具です。",
        relatedSlugs: ["review/drainage-net-comparison"],
      },
    ],
  },
];
