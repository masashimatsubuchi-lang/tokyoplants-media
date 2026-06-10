import Link from "next/link";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "タグ一覧 | tokyoplants MEDIA",
  description: "観葉植物の記事をテーマ別タグで探せます。育て方・用土・ハイドロカルチャー・希少植物など。",
};

export default function TagsPage() {
  const tags = getAllTags();
  const tagCounts = tags.map((tag) => ({
    tag,
    count: getPostsByTag(tag).length,
  })).sort((a, b) => b.count - a.count);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <header className="mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-teal-700">Tags</p>
        <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900">タグ一覧</h1>
        <p className="mt-2 text-sm text-zinc-500">{tags.length}件のタグ</p>
      </header>
      <div className="flex flex-wrap gap-3">
        {tagCounts.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/tag/${tag}`}
            className="flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100 hover:text-teal-900"
          >
            <span>#{tag}</span>
            <span className="rounded-full bg-teal-100 px-1.5 py-0.5 text-[11px] font-semibold text-teal-600">
              {count}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
