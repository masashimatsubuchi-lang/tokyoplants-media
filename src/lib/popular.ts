import popularData from "@/data/popular-articles.json";
import { getAllPosts, type PostMeta } from "./posts";

/**
 * 「よく読まれている記事」の元データ。
 *
 * GA4はビルド時に叩けないので、エクスポートから作った静的リスト
 * （src/data/popular-articles.json）を読む。更新手順は
 * scripts/README-popular-articles.md を参照。2026-09-27 導入。
 */
export const POPULAR_PERIOD = popularData.period;

/**
 * 人気記事を、除外リストを避けて返す。
 *
 * 同じページ内の「読了後におすすめ」「関連記事」と重複すると回遊の選択肢が
 * 増えないので、すでに出している記事は必ず exclude に渡すこと。
 *
 * @param exclude `category/slug` 形式の配列
 */
export function getPopularPosts(exclude: string[] = [], limit = 6): PostMeta[] {
  const skip = new Set(exclude);
  const byKey = new Map(getAllPosts().map((p) => [`${p.category}/${p.slug}`, p]));

  const picked: PostMeta[] = [];
  for (const item of popularData.items) {
    if (picked.length >= limit) break;
    if (skip.has(item.slug)) continue;
    const post = byKey.get(item.slug);
    // 記事が消えている・カテゴリが移動した場合は黙って飛ばす
    if (post) picked.push(post);
  }
  return picked;
}
