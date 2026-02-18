import { Post, PostMeta, resolveRelatedPosts, getSameCategoryPosts, getSpeciesByGenus } from "@/lib/posts";
import { getCategoryBySlug } from "@/lib/categories";
import ArticleJsonLd from "./ArticleJsonLd";
import RelatedPosts from "./RelatedPosts";
import ArticleCard from "./ArticleCard";
import BaseProductBlock from "./BaseProductBlock";
import ShopBanner from "./ShopBanner";
import Image from "next/image";
import Link from "next/link";

type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, "").trim();
}

function withHeadingIds(contentHtml: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  let index = 0;
  const html = contentHtml.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_, levelRaw: string, inner: string) => {
    const level = Number(levelRaw) as 2 | 3;
    const text = stripHtml(inner);
    const id = `section-${++index}`;
    toc.push({ id, text, level });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
  return { html, toc };
}

export default function ArticleDetail({ post }: { post: Post }) {
  const category = getCategoryBySlug(post.category);
  const relatedPosts: PostMeta[] = post.relatedSlugs ? resolveRelatedPosts(post.relatedSlugs) : [];
  const sameCategoryPosts = getSameCategoryPosts(post.category, post.slug);
  const isGenusPage = post.slug.startsWith("genus-");
  const speciesPosts = isGenusPage ? getSpeciesByGenus(post.slug) : [];
  const { html: contentWithIds, toc } = withHeadingIds(post.contentHtml);
  const nextReads = [...relatedPosts, ...sameCategoryPosts].filter(
    (p, idx, arr) => idx === arr.findIndex((item) => item.category === p.category && item.slug === p.slug),
  ).slice(0, 3);

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

      <article className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 text-[13px] text-zinc-400">
          <Link href="/" className="hover:text-zinc-900 transition-colors">トップ</Link>
          <span className="mx-2">/</span>
          <Link href={`/${post.category}`} className="hover:text-zinc-900 transition-colors">{category?.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-600">{post.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_280px] lg:items-start">
          <div>
            {/* Header */}
            <header>
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-teal-700">{category?.name}</span>
              <h1 className="mt-3 text-2xl md:text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">{post.title}</h1>
              <div className="mt-4 flex items-center gap-4 text-[13px] text-zinc-500">
                <time>{post.date}</time>
                {post.author && <span>by {post.author}</span>}
              </div>
            </header>

            {/* Species Pills for Genus Pages */}
            {isGenusPage && speciesPosts.length > 0 && (
              <nav className="mt-8 rounded-xl border border-teal-100 bg-teal-50/30 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-teal-700 mb-2">品種別の図鑑</p>
                <div className="flex flex-wrap gap-2">
                  {speciesPosts.map((sp) => (
                    <Link
                      key={`${sp.category}-${sp.slug}`}
                      href={`/${sp.category}/${sp.slug}`}
                      className="rounded-full border border-teal-200 bg-white px-3 py-1.5 text-[13px] font-medium text-zinc-700 transition-colors hover:border-teal-400 hover:bg-teal-50 hover:text-teal-800"
                    >
                      {sp.title.replace(/[｜|].*/s, "").replace(/図鑑$/, "").trim()}
                    </Link>
                  ))}
                </div>
              </nav>
            )}

            {/* Content */}
            <div
              className="prose prose-zinc mt-10 max-w-none prose-headings:scroll-mt-28 prose-headings:tracking-tight prose-headings:font-bold prose-p:leading-[1.85] prose-p:text-zinc-700 prose-a:text-teal-700 prose-a:no-underline prose-a:hover:underline prose-strong:text-zinc-800 prose-li:text-zinc-700 prose-li:leading-[1.85]"
              dangerouslySetInnerHTML={{ __html: contentWithIds }}
            />

            {nextReads.length > 0 && (
              <section className="mt-12 rounded-2xl border border-teal-100 bg-teal-50/40 p-5 md:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">Next Read</p>
                <h2 className="mt-2 text-lg md:text-xl font-bold text-gray-900">読了後におすすめの記事</h2>
                <div className="mt-5 grid gap-6 md:grid-cols-3">
                  {nextReads.map((item) => (
                    <ArticleCard key={`${item.category}-${item.slug}`} post={item} />
                  ))}
                </div>
              </section>
            )}

            {/* BASE Products */}
            {post.baseProducts && post.baseProducts.length > 0 && (
              <BaseProductBlock products={post.baseProducts} />
            )}

            {/* Shop Banner */}
            <ShopBanner />

            {/* Instagram CTA */}
            <div className="mt-12 flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/60 p-5">
              <span className="text-2xl">📷</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">Instagram で最新情報をチェック</p>
                <p className="mt-0.5 text-xs text-gray-500">入荷情報・育て方のコツを発信中</p>
              </div>
              <a
                href="https://www.instagram.com/tokyoplants_"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-full bg-gray-900 px-5 py-2 text-xs font-semibold text-white hover:bg-gray-700 transition-colors"
              >
                @tokyoplants_
              </a>
            </div>

            {/* Related Posts */}
            <RelatedPosts posts={relatedPosts} title="関連記事" />

            {/* Same Category Posts */}
            <RelatedPosts posts={sameCategoryPosts} title={`${category?.name}の他の記事`} />
          </div>

          {toc.length > 0 && (
            <aside className="hidden lg:block lg:sticky lg:top-24">
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">Contents</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={`block rounded-md px-2 py-1 text-gray-600 transition-colors hover:bg-teal-50 hover:text-teal-800 ${
                          item.level === 3 ? "pl-5 text-[13px]" : ""
                        }`}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}
        </div>
      </article>
    </>
  );
}
