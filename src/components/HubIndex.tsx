import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

/**
 * まとめ（ハブ）記事の末尾に出す、配下記事の自動一覧。
 *
 * frontmatter の `hubIndex` で「どの記事を拾うか」を正規表現で宣言しておくと、
 * 新しい記事を追加しただけで一覧に載る。手作業で relatedSlugs を足す必要がない。
 * 記事が500本を超えて手動リンクの維持が破綻したため 2026-09-26 に導入。
 */
export default function HubIndex({
  title,
  groups,
}: {
  title?: string;
  groups: { label: string; posts: PostMeta[] }[];
}) {
  const visible = groups.filter((g) => g.posts.length > 0);
  if (visible.length === 0) return null;
  const total = visible.reduce((n, g) => n + g.posts.length, 0);

  return (
    <section className="not-prose mt-12 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-5 sm:p-6">
      <div className="mb-4 flex items-baseline gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">Index</span>
        <h2 className="text-[16px] font-bold text-zinc-900">{title ?? "この記事から探せる関連記事"}</h2>
        <span className="ml-auto text-[11px] text-zinc-500">{total}本</span>
      </div>

      <div className="space-y-5">
        {visible.map((g) => (
          <div key={g.label}>
            <h3 className="mb-2 border-l-2 border-emerald-400 pl-2 text-[13px] font-bold text-zinc-700">
              {g.label}
              <span className="ml-1.5 font-normal text-zinc-400">{g.posts.length}</span>
            </h3>
            <ul className="grid grid-cols-1 gap-x-5 gap-y-1.5 sm:grid-cols-2">
              {g.posts.map((p) => (
                <li key={`${p.category}/${p.slug}`} className="flex">
                  <Link
                    href={`/${p.category}/${p.slug}`}
                    className="text-[13.5px] leading-snug text-zinc-600 underline-offset-2 transition-colors hover:text-teal-700 hover:underline"
                  >
                    {p.title.replace(/[｜|][\s\S]*/, "").trim()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
