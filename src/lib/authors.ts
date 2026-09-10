import { PostMeta } from "./posts";

export interface AuthorProduct {
  title: string;
  url: string;
}

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
  /** 開発・監修した商品・サービス（著者ページにリンク付きで表示） */
  products?: AuthorProduct[];
}

export const DEFAULT_AUTHOR_SLUG = "masashi-matsubuchi";

export const AUTHORS: Record<string, Author> = {
  "masashi-matsubuchi": {
    slug: "masashi-matsubuchi",
    name: "Masashi Matsubuchi",
    role: "tokyoplants オーナー",
    bio: "東京・世田谷を拠点とする希少観葉植物専門店「tokyoplants」オーナー。実店舗は持たず、自ら海外へ足を運んで一点ずつ厳選した株を買い付け、年間800株以上を自身の手で育てて販売しています。",
    bioLong:
      "東京都世田谷区を拠点に、希少な観葉植物を専門に扱う「tokyoplants」を運営しています。実店舗は構えず、自ら海外まで足を運び、現地で一点ずつ状態を確かめながら株を買い付けるスタイルを続けてきました。仕入れた株はすぐに販売するのではなく、自身の手で育成し、状態を見極めた上で送り出す——そうして毎年800株を超える観葉植物を育て、販売しています。アンスリウムやモンステラ、アロカシアといった熱帯植物を中心に、日々の栽培・検証で得た知見をもとに、育て方や用土選びの情報を発信しています。アロイド植物の根の性質に合わせて、培養土「I'm original SOIL」や無機培地「HYDRO MINERAL」もオリジナルで開発しました。また、自身の栽培経験・専門知識を反映した育成アドバイスが得られる植物管理アプリ「Green Collection」の開発にも携わっています。",
    image: "/images/authors/masashi-matsubuchi.jpg",
    specialties: ["アンスリウム", "モンステラ", "アロカシア", "観葉植物用土", "室内栽培", "海外での買い付け"],
    sameAs: ["https://www.tokyoplants.com", "https://www.instagram.com/tokyoplants.jp"],
    products: [
      { title: "I'm original SOIL（tokyoplantsプレミアム培養土）", url: "https://www.tokyoplants.com/items/99620939" },
      { title: "HYDRO MINERAL 2L｜溶岩石×ゼオライトの培地", url: "https://www.tokyoplants.com/items/142692278" },
      { title: "Green Collection｜観葉植物のお世話・成長記録アプリ", url: "/app" },
    ],
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
