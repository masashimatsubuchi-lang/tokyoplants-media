import { getAllTags, getPostsByTag } from "@/lib/posts";
import ArticleCard from "@/components/ArticleCard";
import { Metadata } from "next";

type Props = { params: Promise<{ tag: string }> };

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `#${decodedTag} の記事一覧 | tokyoplants MEDIA`,
    description: `「${decodedTag}」タグがついた観葉植物の記事をまとめています。`,
    robots: { index: false, follow: false },
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <header className="mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-teal-700">Tag</p>
        <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900">
          #{decodedTag}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">{posts.length}件の記事</p>
      </header>

      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={`${post.category}-${post.slug}`} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-zinc-500">このタグの記事はまだありません。</p>
      )}
    </main>
  );
}
