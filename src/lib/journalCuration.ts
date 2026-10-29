/**
 * Journal（ECの購入者向け厳選記事ページ /journal）の掲載記事。
 * 仕様 Q42・Q77・Q100: 育て方・植物図鑑・用土比較の3つの軸で、EC で買った人・買おうとしている人に役立つ記事を選ぶ。
 * 記事の候補は AI が提案し、掲載は人が承認する。
 *
 * 2026-10-29 の初版は Claude の提案（オーナー未承認）。選び方:
 *  - 育て方: ショップで今販売している属（アンスリウム・アロカシア）の基本と、通販で買ったあとの不安に答える記事
 *  - 植物図鑑: ショップで今販売している品種の図鑑記事
 *  - 用土比較: 自社の培養土と、アロイド系の用土選びの記事
 */

export interface JournalSection {
  id: string;
  /** 小見出し（英字） */
  overline: string;
  title: string;
  description: string;
  /** "category/slug" 形式 */
  slugs: string[];
  /** 記事一覧の下に出すショップの商品への導線 */
  shopLink?: { label: string; url: string };
}

export const JOURNAL_APPROVED = false;

export const JOURNAL_SECTIONS: JournalSection[] = [
  {
    id: "care",
    overline: "HOW TO GROW",
    title: "育て方",
    description: "届いた株を元気に育てるための基本と、植え替え後のケア。",
    slugs: [
      "guide/anthurium-care-for-beginners",
      "guide/alocasia-care-guide",
      "guide/anthurium-warocqueanum-care-guide",
      "guide/buying-houseplants-online-in-winter",
      "guide/after-repotting-watering-and-fertilizer",
    ],
  },
  {
    id: "species",
    overline: "PLANT ENCYCLOPEDIA",
    title: "植物図鑑",
    description: "ショップに並ぶ品種の特徴と、育てるときのポイント。",
    slugs: [
      "species/alocasia-holy-grail",
      "species/monstera-electro-light",
      "species/stephania-kaweesakii",
      "species/anthurium-regale",
      "species/platycerium-ridleyi",
      "species/philodendron-heterocraspedon",
    ],
  },
  {
    id: "soil",
    overline: "SOIL & CARE",
    title: "観葉植物の土",
    description: "希少植物のために配合した I'm original SOIL（tokyoplantsプレミアム培養土）と、市販の土との違い。",
    // 2026-10-30 オーナー指示: 自社の培養土をおすすめしている土の記事を載せる（自社の土への言及が多い記事を選んだ）。
    // アロカシアの土の記事は HYDRO MINERAL 優先の属なので外した
    slugs: [
      "soil/repotting-soil-guide",
      "soil/neko-chip-vs-original-soil",
      "soil/aroid-soil-products-comparison",
      "soil/protoleaf-vs-original-soil",
      "soil/organic-vs-inorganic-soil-guide",
      "soil/best-soil-for-anthurium",
    ],
    shopLink: {
      label: "I'm original SOIL（tokyoplantsプレミアム培養土）を見る",
      url: "https://www.tokyoplants.com/items/99620939?utm_source=media&utm_medium=journal&utm_campaign=shop_renewal&utm_content=journal-soil",
    },
  },
];
