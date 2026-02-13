export type CategorySlug = "guide" | "soil" | "research" | "review" | "species";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
}

export const categories: Category[] = [
  { slug: "guide", name: "育て方ガイド", description: "観葉植物の育て方やお手入れ方法を解説" },
  { slug: "soil", name: "土・用土", description: "観葉植物に適した土や用土の選び方" },
  { slug: "research", name: "リサーチ", description: "観葉植物に関する調査・研究記事" },
  { slug: "review", name: "レビュー", description: "園芸用品・植物関連商品のレビュー" },
  { slug: "species", name: "植物図鑑", description: "観葉植物の種類を詳しく紹介" },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
