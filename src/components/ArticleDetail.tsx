import { Post, PostMeta, resolveRelatedPosts, getSameCategoryPosts } from "@/lib/posts";
import { getCategoryBySlug } from "@/lib/categories";
import ArticleJsonLd from "./ArticleJsonLd";
import RelatedPosts from "./RelatedPosts";
import BaseProductBlock from "./BaseProductBlock";
import ShopBanner from "./ShopBanner";
import Image from "next/image";
import Link from "next/link";

export default function ArticleDetail({ post }: { post: Post }) {
  const category = getCategoryBySlug(post.category);
  const relatedPosts: PostMeta[] = post.relatedSlugs ? resolveRelatedPosts(post.relatedSlugs) : [];
  const sameCategoryPosts = getSameCategoryPosts(post.category, post.slug);

  return (
    <>
      <ArticleJsonLd post={post} />

      {/* Hero Image */}
      {post.image && (
        <div className="relative h-64 md:h-96 w-full bg-gray-100">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      <article className="mx-auto max-w-3xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-[13px] text-zinc-400">
          <Link href="/" className="hover:text-zinc-900 transition-colors">トップ</Link>
          <span className="mx-2">/</span>
          <Link href={`/${post.category}`} className="hover:text-zinc-900 transition-colors">{category?.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-600">{post.title}</span>
        </nav>

        {/* Header */}
        <header>
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-teal-700">{category?.name}</span>
          <h1 className="mt-3 text-2xl md:text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">{post.title}</h1>
          <div className="mt-4 flex items-center gap-4 text-[13px] text-zinc-400">
            <time>{post.date}</time>
            {post.author && <span>by {post.author}</span>}
          </div>
        </header>

        {/* Content */}
        <div
          className="prose prose-zinc mt-12 max-w-none prose-headings:tracking-tight prose-headings:font-bold prose-p:leading-[1.85] prose-p:text-zinc-600 prose-a:text-teal-700 prose-a:no-underline hover:prose-a:underline prose-strong:text-zinc-800 prose-li:text-zinc-600 prose-li:leading-[1.85]"
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
