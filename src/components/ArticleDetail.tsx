import { Post, PostMeta, resolveRelatedPosts, getSameCategoryPosts } from "@/lib/posts";
import { getCategoryBySlug } from "@/lib/categories";
import ArticleJsonLd from "./ArticleJsonLd";
import RelatedPosts from "./RelatedPosts";
import BaseProductBlock from "./BaseProductBlock";
import ShopBanner from "./ShopBanner";
import Link from "next/link";

export default function ArticleDetail({ post }: { post: Post }) {
  const category = getCategoryBySlug(post.category);
  const relatedPosts: PostMeta[] = post.relatedSlugs ? resolveRelatedPosts(post.relatedSlugs) : [];
  const sameCategoryPosts = getSameCategoryPosts(post.category, post.slug);

  return (
    <>
      <ArticleJsonLd post={post} />
      <article className="mx-auto max-w-3xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-green-700">トップ</Link>
          <span className="mx-2">/</span>
          <Link href={`/${post.category}`} className="hover:text-green-700">{category?.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{post.title}</span>
        </nav>

        {/* Header */}
        <header>
          <span className="text-sm font-medium text-green-600">{category?.name}</span>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 leading-tight">{post.title}</h1>
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
            <time>{post.date}</time>
            {post.author && <span>by {post.author}</span>}
          </div>
        </header>

        {/* Content */}
        <div
          className="prose prose-green mt-8 max-w-none"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* BASE Products */}
        {post.baseProducts && post.baseProducts.length > 0 && (
          <BaseProductBlock products={post.baseProducts} />
        )}

        {/* Shop Banner */}
        <ShopBanner />

        {/* Related Posts */}
        <RelatedPosts posts={relatedPosts} title="関連記事" />

        {/* Same Category Posts */}
        <RelatedPosts posts={sameCategoryPosts} title={`${category?.name}の他の記事`} />
      </article>
    </>
  );
}
