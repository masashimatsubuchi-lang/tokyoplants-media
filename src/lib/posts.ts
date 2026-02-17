import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";
import { CategorySlug } from "./categories";

const contentDirectory = path.join(process.cwd(), "content");

export interface BaseProduct {
  title: string;
  url: string;
  image?: string;
  price?: string;
}

export interface PostMeta {
  slug: string;
  category: CategorySlug;
  title: string;
  description: string;
  date: string;
  author: string;
  image?: string;
  genus?: string;
  relatedSlugs?: string[]; // "category/slug" 形式
  baseProducts?: BaseProduct[];
}

export interface Post extends PostMeta {
  contentHtml: string;
}

export function getPostsByCategory(category: CategorySlug): PostMeta[] {
  const dir = path.join(contentDirectory, category);
  if (!fs.existsSync(dir)) return [];

  const filenames = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  const posts = filenames.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const filePath = path.join(dir, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      category,
      title: data.title ?? slug,
      description: data.description ?? "",
      date: data.date ?? "",
      author: data.author ?? "",
      image: data.image,
      genus: data.genus,
      relatedSlugs: data.relatedSlugs,
      baseProducts: data.baseProducts,
    } satisfies PostMeta;
  });

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getAllPosts(): PostMeta[] {
  const categories: CategorySlug[] = ["guide", "soil", "research", "review", "species"];
  return categories.flatMap((c) => getPostsByCategory(c)).sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getPostBySlug(category: CategorySlug, slug: string): Promise<Post | null> {
  const filePath = path.join(contentDirectory, category, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(remarkGfm).use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    category,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "",
    author: data.author ?? "",
    image: data.image,
    genus: data.genus,
    relatedSlugs: data.relatedSlugs,
    baseProducts: data.baseProducts,
    contentHtml,
  };
}

/**
 * relatedSlugs ("category/slug" 形式) から PostMeta を解決する
 */
export function resolveRelatedPosts(relatedSlugs: string[]): PostMeta[] {
  const allPosts = getAllPosts();
  return relatedSlugs
    .map((ref) => {
      const [cat, slug] = ref.split("/");
      return allPosts.find((p) => p.category === cat && p.slug === slug);
    })
    .filter((p): p is PostMeta => p !== undefined);
}

/**
 * 同カテゴリの他の記事を取得（自身を除く、最大4件）
 */
export function getSameCategoryPosts(category: CategorySlug, excludeSlug: string, limit = 4): PostMeta[] {
  return getPostsByCategory(category)
    .filter((p) => p.slug !== excludeSlug)
    .slice(0, limit);
}

/**
 * 属ページの slug から、その属に属する品種記事を取得
 * 例: "genus-anthurium" → genus "anthurium" を持つ種ページ一覧
 */
export function getSpeciesByGenus(genusSlug: string): PostMeta[] {
  const genusKey = genusSlug.replace("genus-", "");
  return getPostsByCategory("species")
    .filter((p) => !p.slug.startsWith("genus-") && p.genus === genusKey);
}
