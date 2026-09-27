import Link from "next/link";
import Image from "next/image";
import type { PostMeta } from "@/lib/posts";
import { getCategoryBySlug } from "@/lib/categories";
import ArticleCard from "./ArticleCard";

/**
 * 記事末尾の回遊モジュール。
 *
 * モバイルでは縦積みのカードが延々と続いて、2〜3枚目より先がほぼ見られていなかった。
 * スマホは横スクロール（スナップ）にして一覧性を上げ、PCは従来どおりグリッドで出す。
 * 2026-09-27 導入。
 *
 * `rank` を true にすると順位バッジを出す（「よく読まれている記事」用）。
 */
export default function PostScroller({
  posts,
  title,
  eyebrow,
  description,
  rank = false,
  tone = "plain",
  cols = 3,
}: {
  posts: PostMeta[];
  title: string;
  eyebrow?: string;
  description?: string;
  rank?: boolean;
  tone?: "plain" | "surface";
  cols?: 2 | 3;
}) {
  if (posts.length === 0) return null;

  const gridCols = cols === 2 ? "md:grid-cols-2" : "md:grid-cols-3";
  const wrapper =
    tone === "surface"
      ? "mt-12 rounded-2xl border border-teal-100 bg-teal-50/40 py-5 md:p-6"
      : "mt-12";
  // surface のときは、横スクロールがカード枠の外まで抜けるように内側だけ余白を持たせる
  const pad = tone === "surface" ? "px-5 md:px-0" : "";

  return (
    <section className={wrapper}>
      <div className={pad}>
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">{eyebrow}</p>
        )}
        <h2 className={`${eyebrow ? "mt-2" : ""} text-lg font-bold text-gray-900 md:text-xl`}>{title}</h2>
        {description && <p className="mt-1 text-[13px] leading-relaxed text-gray-500">{description}</p>}
      </div>

      {/* モバイル: 横スクロール */}
      <div
        className={`scrollbar-hide -mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 md:hidden ${
          tone === "surface" ? "sm:-mx-5 sm:px-5" : ""
        }`}
      >
        {posts.map((post, i) => (
          <CompactCard key={`${post.category}-${post.slug}`} post={post} rank={rank ? i + 1 : undefined} />
        ))}
      </div>

      {/* PC: 従来どおりグリッド */}
      <div className={`mt-5 hidden gap-6 md:grid ${gridCols}`}>
        {posts.map((post) => (
          <ArticleCard key={`${post.category}-${post.slug}`} post={post} />
        ))}
      </div>
    </section>
  );
}

function CompactCard({ post, rank }: { post: PostMeta; rank?: number }) {
  const category = getCategoryBySlug(post.category);
  return (
    <article className="w-[64vw] max-w-[230px] shrink-0 snap-start">
      <Link
        href={`/${post.category}/${post.slug}`}
        className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-2.5 transition-colors hover:border-teal-200"
      >
        <div className="relative mb-2.5 aspect-[3/2] overflow-hidden rounded-xl bg-gray-100">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="230px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl opacity-30">&#x1f331;</span>
            </div>
          )}
          {rank !== undefined && (
            <span className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-br-xl rounded-tl-xl bg-gray-900 text-[12px] font-extrabold text-white">
              {rank}
            </span>
          )}
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-teal-700">
          {category?.name}
        </span>
        <h3 className="mt-1 text-[13.5px] font-bold leading-snug text-gray-900 line-clamp-3">{post.title}</h3>
      </Link>
    </article>
  );
}
