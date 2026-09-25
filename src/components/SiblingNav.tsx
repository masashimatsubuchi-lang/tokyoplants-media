import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

/**
 * 同じ検索意図を奪い合いやすい姉妹記事の「読み分け」ナビ。
 *
 * 同じ植物について guide（育て方の実務）と species（図鑑）を両方持つケースなど、
 * 読者にも検索エンジンにも役割の違いが伝わらない組み合わせがあるため、
 * 各記事の冒頭で「どれを読めばよいか」を明示してカニバリを抑える。
 * frontmatter の `siblings`（slug と role の組）で宣言する。2026-09-26 導入。
 */
export default function SiblingNav({
  items,
  currentSlug,
}: {
  items: { post: PostMeta | null; role: string; slug: string }[];
  currentSlug: string;
}) {
  const rows = items.filter((i) => i.post || i.slug === currentSlug);
  if (rows.length < 2) return null;

  return (
    <nav className="not-prose my-6 rounded-xl border border-teal-100 bg-teal-50/40 px-4 py-3.5 sm:px-5">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-teal-700">
        読み分けガイド
      </p>
      <ul className="space-y-1.5">
        {rows.map((r) => {
          const isCurrent = r.slug === currentSlug;
          return (
            <li key={r.slug} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[13.5px] leading-snug">
              <span className="shrink-0 rounded-md bg-white px-2 py-0.5 text-[11px] font-bold text-teal-800 ring-1 ring-teal-200">
                {r.role}
              </span>
              {isCurrent ? (
                <span className="font-bold text-zinc-800">この記事</span>
              ) : (
                <Link
                  href={`/${r.slug}`}
                  className="text-zinc-600 underline-offset-2 hover:text-teal-700 hover:underline"
                >
                  {(r.post?.title ?? r.slug).replace(/[｜|][\s\S]*/, "").trim()}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
