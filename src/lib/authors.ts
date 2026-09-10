import { PostMeta } from "./posts";

export interface Author {
  slug: string;
  name: string;
  role: string;
  /** 記事末尾カード用の短い紹介文（100〜150字程度） */
  bio: string;
  /** 著者ページ用の詳しい紹介文 */
  bioLong: string;
  image: string;
  specialties: string[];
  sameAs: string[];
}

export const DEFAULT_AUTHOR_SLUG = "masashi-matsubuchi";

export const AUTHORS: Record<string, Author> = {
  "masashi-matsubuchi": {
    slug: "masashi-matsubuchi",
    name: "Masashi Matsubuchi",
    role: "tokyoplants オーナー",
    bio: "東京・世田谷を拠点とする希少観葉植物専門店「tokyoplants」オーナー。実店舗は持たず、自ら海外へ足を運んで一点ずつ厳選した株を買い付け、年間1,000株以上を自身の手で育てて販売しています。",
    bioLong:
      "東京都世田谷区を拠点に、希少な観葉植物を専門に扱う「tokyoplants」を運営しています。実店舗は構えず、自ら海外まで足を運び、現地で一点ずつ状態を確かめながら株を買い付けるスタイルを続けてきました。仕入れた株はすぐに販売するのではなく、自身の手で育成し、状態を見極めた上で送り出す——そうして毎年1,000株を超える観葉植物を育て、販売しています。アンスリウムやモンステラ、アロカシアといった熱帯植物を中心に、日々の栽培・検証で得た知見をもとに、育て方や用土選びの情報を発信しています。",
    image: "/images/authors/masashi-matsubuchi.jpg",
    specialties: ["アンスリウム", "モンステラ", "アロカシア", "観葉植物用土", "室内栽培", "海外での買い付け"],
    sameAs: ["https://www.tokyoplants.com", "https://www.instagram.com/tokyoplants.jp"],
  },
};

export function getAuthorBySlug(slug: string): Author | undefined {
  return AUTHORS[slug];
}

export function getAllAuthors(): Author[] {
  return Object.values(AUTHORS);
}

/**
 * frontmatterのauthorIdからAuthorを解決する。未指定の記事は既定の著者にフォールバックする
 * （現状すべての記事が単一著者のため、記事側の一括書き換えは不要）。
 */
export function getAuthorForPost(post: Pick<PostMeta, "authorId">): Author {
  const slug = post.authorId ?? DEFAULT_AUTHOR_SLUG;
  return AUTHORS[slug] ?? AUTHORS[DEFAULT_AUTHOR_SLUG];
}
