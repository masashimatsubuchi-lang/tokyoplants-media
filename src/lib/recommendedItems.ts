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
  /** tokyoplants商品の商品写真（/public配下）。未指定ならAmazon側はASINから自動生成 */
  image?: string;
  price?: string;
  /** なぜ選んでいるか（1文、購入判断の決め手のみ） */
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
    image: "/images/products/im-original-soil-main.jpg",
    price: "¥1,200〜",
    reason: "6種の天然素材をブレンドし、化学肥料不使用で元肥配合済みの看板用土。",
    relatedSlugs: ["soil/recommended-soil-for-houseplants"],
  },
  {
    title: "HYDRO MINERAL 2L｜溶岩石×ゼオライトの培地",
    source: "tokyoplants",
    url: "https://www.tokyoplants.com/items/142692278",
    image: "/images/products/hydro-mineral-main.jpg",
    price: "¥1,480",
    reason: "富士山溶岩石×ゼオライトの無機配合で、肥料効果が8〜9ヶ月持続。",
    relatedSlugs: ["guide/monstera-hydroculture", "guide/alocasia-hydroculture"],
  },
  {
    title: "Daily Botanical Towel｜リーフタオル",
    source: "tokyoplants",
    url: "https://www.tokyoplants.com/items/135803882",
    image: "/images/products/botanical-towel-main.jpg",
    price: "¥2,000",
    reason: "モンステラ・アンスリウム・アロカシアのシルエットをモチーフにしたタオル。",
    relatedSlugs: ["review/daily-botanical-towel-review"],
  },
  {
    title: "Leather Botanical Collection｜SISHICRAFT × tokyoplants",
    source: "tokyoplants",
    url: "https://www.tokyoplants.com/categories/7318231",
    image: "/images/products/leather-botanical-monstera-stand.jpg",
    price: "¥18,000〜",
    reason: "台湾のレザーアーティストSISHICRAFTと仕立てた、植物タンニン鞣しレザーの「革の植物」。",
    relatedSlugs: ["review/leather-botanical-collection"],
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
        reason: "堺の刃物メーカー製で、握るだけでロック解除できる定番のバイパス式剪定鋏。",
        relatedSlugs: ["review/pruning-shears-comparison", "guide/repotting-tools-checklist"],
      },
      {
        title: "ヒラサワ PC 土入れ 3ツ組",
        source: "amazon",
        asin: "B00CSH0AGC",
        price: "¥355〜",
        reason: "大小3サイズがセットになった、鉢のサイズに合わせて使い分けられる定番の土入れ。",
        relatedSlugs: ["guide/repotting-tools-checklist"],
      },
      {
        title: "XiaZ園芸シート 極厚植え替えシート 75×75cm",
        source: "amazon",
        asin: "B0C9LN59ZR",
        price: "¥999前後",
        reason: "防水生地でこぼれた土をそのまま鉢に戻せる、部屋を汚さない植え替えシート。",
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
        reason: "電球型で高PPFD・演色性Ra97の本格モデル。光量を要する植物にも対応。",
        relatedSlugs: ["review/plant-light-review"],
      },
      {
        title: "HaruDesign 植物育成LEDライト GL-T5 L530（バー型）",
        source: "amazon",
        asin: "B0D362RR1R",
        price: "¥6,973前後",
        reason: "連結拡張できるバー型で、棚全体をまとめて照らしたい人向け。",
        relatedSlugs: ["review/bar-type-grow-light-comparison"],
      },
      {
        title: "SANSI 小型1〜3鉢用 植物育成ライト LEDクリップ式 7W",
        source: "amazon",
        asin: "B0GHQKG46C",
        price: "¥3,359前後",
        reason: "1〜3鉢向けの省スペースなクリップ式で、デスクや棚の一角だけを照らしたい人向け。",
        relatedSlugs: ["review/clip-type-grow-light-comparison"],
      },
      {
        title: "SwitchBot サーキュレーター Lite",
        source: "amazon",
        asin: "B0D9896MPY",
        reason: "静音22dBのDCモーター搭載で、風通しを良くしてコバエ・根腐れ予防にもつながる。",
        relatedSlugs: ["review/circulator-for-houseplants-review"],
      },
      {
        title: "フルプラ ダイヤスプレー エクセレント500",
        source: "amazon",
        asin: "B001HPEIWI",
        reason: "霧が細かく葉全体に均一にかかる、葉水やハダニ予防の日常ケアに使いやすい定番品。",
        relatedSlugs: ["review/misting-bottle-review"],
      },
      {
        title: "ハイポネックス原液 800ml",
        source: "amazon",
        asin: "B0027WPD7O",
        price: "¥748〜",
        reason: "希釈して水やりのタイミングで使える、成長期の追肥に常備したい液体肥料の定番。",
        relatedSlugs: ["review/houseplant-fertilizer-products-comparison"],
      },
      {
        title: "住友化学園芸 ルートン 植物成長調整剤 15g",
        source: "amazon",
        asin: "B00288GPJC",
        price: "¥400〜600程度",
        reason: "切り口に軽くまぶすだけで発根率が上がる、挿し木の発根促進剤の定番。",
        relatedSlugs: ["review/rooting-hormone-powder-comparison"],
      },
      {
        title: "Ailunate 試験管フラワーベース 木製フレーム",
        source: "amazon",
        asin: "B0CV9TCSQR",
        price: "¥1,478前後",
        reason: "水挿しの発根管理をそのままインテリアにできる、木製フレームの試験管型スタンド。",
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
        reason: "温度・湿度に加え快適レベルまで表示され、最高最低記録・アラーム機能も搭載。",
        relatedSlugs: ["review/thermo-hygrometer-comparison"],
      },
      {
        title: "SUStee(サスティー) 水やりチェッカー Mサイズ 5本セット",
        source: "amazon",
        asin: "B08PPML5TC",
        price: "¥2,480〜",
        reason: "土に挿すだけで水やりのタイミングが一目でわかる、GOOD DESIGN AWARD受賞の電池不要スティック。",
        relatedSlugs: ["review/watering-checker-comparison"],
      },
      {
        title: "YAMRON 4-in-1 土壌水分計（水分・pH・温度・日照）",
        source: "amazon",
        asin: "B0DF4TB93J",
        price: "¥2,798前後",
        reason: "水分・pH・温度・日照を1台で数値化できる、アプリ不要のデジタルメーター。",
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
        reason: "ハダニ・アブラムシ・カイガラムシに即効性のある、常備しておきたいスプレー。",
        relatedSlugs: ["review/houseplant-pest-control-tools"],
      },
      {
        title: "アースガーデン BotaNice 土からわいたコバエ退治 置くだけ粘着剤タイプ",
        source: "amazon",
        asin: "B0CRJND4H6",
        price: "¥1,555〜",
        reason: "土に挿すだけで忌避と捕獲を両立、薬剤不使用で子供やペットがいる家庭にも使いやすい。",
        relatedSlugs: ["review/fungus-gnat-control-products-comparison"],
      },
      {
        title: "ゼオライト 根腐れ防止剤 中粒 2L",
        source: "amazon",
        asin: "B0CZJKWQKB",
        price: "¥2,500〜",
        reason: "土に混ぜ込んで水はけを改善し、過湿によるカビ・根腐れを予防する。",
        relatedSlugs: ["soil/mold-on-houseplant-soil"],
      },
    ],
  },
  {
    id: "pots",
    title: "鉢を選ぶ",
    description: "植物の大きさ・目的に合わせて選ぶ鉢・プランター",
    items: [
      {
        title: "ITANSE スリット鉢 6・7・8号セット",
        source: "amazon",
        asin: "B08CXX4B4X",
        price: "¥3,480前後",
        reason: "通気性・排水性に優れたスリット構造で、根詰まり・根腐れを防ぐ定番の鉢。",
        relatedSlugs: ["review/recommended-pots-for-houseplants"],
      },
      {
        title: "アップルウェアー プレステラ90型 10組 ブラック",
        source: "amazon",
        asin: "B00BQ6BVPU",
        price: "¥950前後",
        reason: "多肉植物・サボテン・挿し木の管理に使いやすい、底穴の多いスタッキング鉢。",
        relatedSlugs: ["review/recommended-pots-for-houseplants"],
      },
      {
        title: "T4U 12cm 給水プランター 4個セット",
        source: "amazon",
        asin: "B0CWRL4LK3",
        price: "¥2,399前後",
        reason: "給水ひも式・水位インジケーター付きで、水やり忘れの心配を減らせる自動給水鉢。",
        relatedSlugs: ["review/self-watering-pot-comparison"],
      },
    ],
  },
  {
    id: "support",
    title: "支柱・吊るして仕立てる",
    description: "つる性・気根性植物の誘引や、ハンギングでの飾り付けに",
    items: [
      {
        title: "園芸支柱 120cm 太め ココスティック",
        source: "amazon",
        asin: "B0F1K913VB",
        price: "¥1,349前後",
        reason: "極太タイプで、大株・重い葉もしっかり支えられるモンステラ向け支柱。",
        relatedSlugs: ["review/moss-pole-comparison"],
      },
      {
        title: "リッチェル(Richell) ハンギングボール プレーン 5号",
        source: "amazon",
        asin: "B0928GVB1B",
        price: "¥306前後",
        reason: "鉢ごと吊るせるシンプルな吊り鉢で、つる性植物の垂れ下がりを邪魔しない。",
        relatedSlugs: ["review/hanging-planter-hook-comparison-pothos-tradescantia"],
      },
      {
        title: "山崎実業(Yamazaki) tower ウォールハンギンググリーンフック",
        source: "amazon",
        asin: "B0D4QCLCL9",
        price: "¥1,485前後",
        reason: "石こうボード対応のピン付きで、賃貸でも設置しやすい壁掛けフック。",
        relatedSlugs: ["review/hanging-planter-hook-comparison-pothos-tradescantia"],
      },
    ],
  },
  {
    id: "watering",
    title: "水やりを楽にする",
    description: "毎日の水やりそのものを快適にする道具",
    items: [
      {
        title: "IMEEA じょうろ ステンレス 900ml シルバー",
        source: "amazon",
        asin: "B01H2Z9PRO",
        price: "¥2,789〜",
        reason: "ロングノズルのステンレス製で、室内の観葉植物向けとして最も定番のサイズ・形状。",
        relatedSlugs: ["review/watering-can-comparison"],
      },
      {
        title: "IMEEA じょうろ 1000ml 木製ハンドル ブラック",
        source: "amazon",
        asin: "B0BGXVXGSV",
        price: "¥2,750〜",
        reason: "木製ハンドルの北欧テイストなデザインで、大きめの鉢にも対応する1000ml容量。",
        relatedSlugs: ["review/watering-can-comparison"],
      },
    ],
  },
  {
    id: "humidity",
    title: "加湿・除湿で季節を乗り切る",
    description: "乾燥・過湿による葉トラブルを防ぐ、季節ごとの環境対策",
    items: [
      {
        title: "Troston 卓上加湿器 超音波式 350ml",
        source: "amazon",
        asin: "B0DCFXF1H1",
        price: "¥1,999〜",
        reason: "小型でデスクや棚の近くにも置ける超音波式。冬の乾燥による葉先の傷みを防ぐ。",
        relatedSlugs: ["review/winter-humidity-control-humidifier-dehumidifier"],
      },
      {
        title: "シャープ 衣類乾燥除湿機 CV-R71-W",
        source: "amazon",
        asin: "B0CZTGPY25",
        price: "¥25,800前後",
        reason: "プラズマクラスター搭載のコンプレッサー式で、梅雨〜夏場の過湿・カビ対策に。",
        relatedSlugs: ["review/winter-humidity-control-humidifier-dehumidifier"],
      },
    ],
  },
  {
    id: "caudex",
    title: "塊根植物・多肉植物専用アイテム",
    description: "SOILの配合思想と合わない塊根植物・多肉植物には、専用の鉢・用土をAmazonから紹介",
    items: [
      {
        title: "日本ポリ鉢販売 プレステラ75型 10個組 ブラック",
        source: "amazon",
        asin: "B0CSCX75Z5",
        price: "¥453前後",
        reason: "多肉植物・サボテン向けの定番スリット鉢。水はけの良さを重視した設計。",
        relatedSlugs: ["review/caudex-plant-tools-comparison"],
      },
      {
        title: "BLACK PLASTIC POT シャロータイプ（塊根・コーデックス用）",
        source: "amazon",
        asin: "B0C5M5HPC4",
        price: "¥780前後",
        reason: "塊根植物向けに作られた浅型プラ鉢。根が浅く広がるコーデックスの形状に合う。",
        relatedSlugs: ["review/caudex-plant-tools-comparison"],
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
        reason: "育成ライト・サーキュレーターの取付に対応した、キャスター付き連結拡張式の植物専用ラック。",
        relatedSlugs: ["review/plant-rack-and-greenhouse-review"],
      },
      {
        title: "Goovilla 花台 鉢受プレート キャスター付き 伸縮タイプ",
        source: "amazon",
        asin: "B0F8HVGRB4",
        price: "¥2,490",
        reason: "耐荷重200kgの伸縮式で、大型鉢の日当たり調整や模様替えの負担を大きく減らせる。",
        relatedSlugs: ["review/plant-caddy-stand-with-wheels-comparison"],
      },
      {
        title: "Bambu Lab A1 mini 3Dプリンター",
        source: "amazon",
        asin: "B0CRYJBKQQ",
        reason: "既製品にちょうどいいサイズがない鉢を自作したい人向けの入門機。",
        relatedSlugs: ["review/bambu-lab-3d-printer-comparison"],
      },
      {
        title: "セフティー3(Safety-3) 鉢底用ネット ロールタイプ 30×50cm",
        source: "amazon",
        asin: "B01EIXUY0A",
        price: "¥417〜",
        reason: "好きなサイズにカットして使える、鉢底石の流出・虫の侵入を防ぐロールタイプの定番品。",
        relatedSlugs: ["review/drainage-net-comparison"],
      },
    ],
  },
];
