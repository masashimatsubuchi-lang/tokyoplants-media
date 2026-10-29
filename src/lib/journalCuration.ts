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
    title: "用土の選び方",
    description: "希少植物の根を守る土の考え方と、市販の用土の比べ方。",
    slugs: [
      "soil/best-soil-for-anthurium",
      "soil/best-soil-for-alocasia",
      "soil/aroid-mix-guide",
      "soil/aroid-soil-products-comparison",
      "soil/neko-chip-vs-original-soil",
    ],
  },
];
