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

      {/* Shop Section */}
      <section className="mx-auto max-w-5xl px-4 pb-12">
        <div className="rounded-xl bg-gradient-to-r from-green-700 to-green-600 p-8">
          <div className="text-center">
            <p className="text-sm font-medium text-green-200">TOKYO PLANTS</p>
            <h2 className="mt-1 text-2xl font-bold text-white">
              希少植物のオンラインショップ
            </h2>
            <p className="mt-2 text-sm text-green-100">
              厳選された希少植物をお届けします
            </p>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {[
              { name: "Monstera", path: "/categories/monstera" },
              { name: "Philodendron", path: "/categories/philodendron" },
              { name: "Anthurium", path: "/categories/anthurium" },
              { name: "Alocasia", path: "/categories/alocasia" },
              { name: "Aglaonema", path: "/categories/aglaonema" },
              { name: "Begonia", path: "/categories/begonia" },
            ].map((cat) => (
              <a
                key={cat.name}
                href={`https://www.tokyoplants.com${cat.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white hover:bg-white/30 transition-colors"
              >
                {cat.name}
              </a>
            ))}
          </div>
          <div className="mt-6 text-center">
            <a
              href="https://www.tokyoplants.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-50 transition-colors"
            >
              ショップを見る
            </a>
          </div>
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
