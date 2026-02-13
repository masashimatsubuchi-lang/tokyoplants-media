import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { categories } from "@/lib/categories";
import ArticleCard from "@/components/ArticleCard";

export default function Home() {
  const posts = getAllPosts();
  const latestPosts = posts.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="bg-green-50 py-20">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            植物と暮らす、<br className="md:hidden" />豊かな毎日。
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            観葉植物の育て方・図鑑・レビューをお届けするメディア
          </p>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="rounded-lg border border-gray-200 p-4 text-center hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <span className="block text-sm font-semibold text-gray-900">{cat.name}</span>
              <span className="mt-1 block text-xs text-gray-500">{cat.description}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Posts */}
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900">最新の記事</h2>
        {latestPosts.length === 0 ? (
          <p className="mt-4 text-gray-400">まだ記事がありません。</p>
        ) : (
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <ArticleCard key={`${post.category}-${post.slug}`} post={post} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
