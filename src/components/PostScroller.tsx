import Link from "next/link";
import Image from "next/image";
import type { PostMeta } from "@/lib/posts";
import { getCategoryBySlug } from "@/lib/categories";

/**
 * 記事末尾の回遊モジュール。
 *
 * モバイルでは縦積みのカードが延々と続いて、2〜3枚目より先がほぼ見られていなかった。
 * スマホは横スクロール（スナップ）にして一覧性を上げ、PCはグリッドで出す。
 * 2026-09-27 導入。
 *
 * ⚠️ カードは1回だけ描画し、レイアウトの切り替えはCSSで行うこと。
 * 導入当初はモバイル用とPC用のカードを別々に出して `md:hidden` / `hidden md:grid` で
 * 出し分けていたが、1,188ページ全部でカードが二重になり、ビルド出力が
 * 375MB → 458MB に増えた（同日中に修正）。
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
  const bleed = tone === "surface" ? "sm:-mx-5 sm:px-5" : "";

  return (
    <section className={wrapper}>
      <div className={pad}>
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">{eyebrow}</p>
        )}
        <h2 className={`${eyebrow ? "mt-2" : ""} text-lg font-bold text-gray-900 md:text-xl`}>{title}</h2>
        {description && <p className="mt-1 text-[13px] leading-relaxed text-gray-500">{description}</p>}
      </div>

      <div
        className={`scrollbar-hide -mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 ${bleed}
          md:mx-0 md:mt-5 md:grid ${gridCols} md:gap-6 md:overflow-visible md:px-0 md:pb-0`}
      >
        {posts.map((post, i) => (
          <Card key={`${post.category}-${post.slug}`} post={post} rank={rank ? i + 1 : undefined} />
        ))}
      </div>
    </section>
  );
}

function Card({ post, rank }: { post: PostMeta; rank?: number }) {
  const category = getCategoryBySlug(post.category);
  return (
    <article className="w-[64vw] max-w-[230px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink">
      <Link
        href={`/${post.category}/${post.slug}`}
        className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-2.5 transition-all hover:border-teal-200 md:p-3 md:hover:-translate-y-0.5 md:hover:shadow-md"
      >
        <div className="relative mb-2.5 aspect-[3/2] overflow-hidden rounded-xl bg-gray-100 md:mb-4">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 230px, 33vw"
              className="object-cover transition-transform duration-500 md:group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl opacity-30 md:text-3xl">&#x1f331;</span>
            </div>
          )}
          {rank !== undefined && (
            <span className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-br-xl rounded-tl-xl bg-gray-900 text-[12px] font-extrabold text-white">
              {rank}
            </span>
          )}
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-teal-700 md:text-[11px]">
          {category?.name}
        </span>
        <h3 className="mt-1 text-[13.5px] font-bold leading-snug text-gray-900 line-clamp-3 transition-colors group-hover:text-teal-700 md:mt-1.5 md:text-[17px] md:line-clamp-2">
          {post.title}
        </h3>
        {/* 説明文と日付はPCだけ。モバイルの横スクロールでは高さを取りすぎる */}
        <p className="mt-2 hidden text-[14px] leading-relaxed text-gray-600 line-clamp-2 md:block">
          {post.description}
        </p>
        <time className="mt-3 hidden text-xs font-medium text-gray-500 md:block">{post.date}</time>
      </Link>
    </article>
  );
}
