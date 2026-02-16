import Link from "next/link";
import { getAllPosts, getPostsByCategory } from "@/lib/posts";
import ArticleCard from "@/components/ArticleCard";

export default function Home() {
  const allPosts = getAllPosts();
  const soilPosts = getPostsByCategory("soil").slice(0, 3);
  const guidePosts = getPostsByCategory("guide").slice(0, 3);
  const speciesPosts = getPostsByCategory("species").slice(0, 3);
  const latestPosts = allPosts.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="py-32 md:py-44">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-700">
            tokyoplants Media
          </p>
          <h1 className="mt-4 text-4xl md:text-7xl font-extrabold tracking-tight text-gray-900">
            観葉植物専門メディア
          </h1>
          <p className="mt-6 text-base md:text-lg leading-relaxed text-gray-400">
            用土・育て方・図鑑・レビューを発信
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/soil"
              className="inline-block rounded-full bg-green-800 px-8 py-3 text-sm font-semibold text-white hover:bg-green-900 transition-colors"
            >
              用土の記事を読む
            </Link>
            <a
              href="https://www.tokyoplants.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full border border-green-800 px-8 py-3 text-sm font-semibold text-green-800 hover:bg-green-50 transition-colors"
            >
              ショップを見る
            </a>
          </div>
        </div>
      </section>

      {/* Soil 特集 */}
      <section className="bg-green-50/50 py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-green-700">Featured</p>
              <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                土・用土
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                観葉植物の土選び・配合・市販土の比較など
              </p>
            </div>
            <Link href="/soil" className="hidden sm:block text-sm font-medium text-green-700 hover:text-green-900 transition-colors">
              すべて見る →
            </Link>
          </div>
          {soilPosts.length === 0 ? (
            <p className="mt-8 text-gray-400">まだ記事がありません。</p>
          ) : (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {soilPosts.map((post) => (
                <ArticleCard key={`${post.category}-${post.slug}`} post={post} />
              ))}
            </div>
          )}
          <div className="mt-8 sm:hidden text-center">
            <Link href="/soil" className="text-sm font-medium text-green-700 hover:text-green-900 transition-colors">
              すべて見る →
            </Link>
          </div>
        </div>
      </section>

      {/* Guide ブロック */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                育て方ガイド
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                初心者から中級者まで、育て方の基本とコツ
              </p>
            </div>
            <Link href="/guide" className="hidden sm:block text-sm font-medium text-green-700 hover:text-green-900 transition-colors">
              すべて見る →
            </Link>
          </div>
          {guidePosts.length === 0 ? (
            <p className="mt-8 text-gray-400">まだ記事がありません。</p>
          ) : (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {guidePosts.map((post) => (
                <ArticleCard key={`${post.category}-${post.slug}`} post={post} />
              ))}
            </div>
          )}
          <div className="mt-8 sm:hidden text-center">
            <Link href="/guide" className="text-sm font-medium text-green-700 hover:text-green-900 transition-colors">
              すべて見る →
            </Link>
          </div>
        </div>
      </section>

      {/* Species ブロック */}
      <section className="bg-gray-50/50 py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                植物図鑑
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                観葉植物の種類と特徴を詳しく紹介
              </p>
            </div>
            <Link href="/species" className="hidden sm:block text-sm font-medium text-green-700 hover:text-green-900 transition-colors">
              すべて見る →
            </Link>
          </div>
          {speciesPosts.length === 0 ? (
            <p className="mt-8 text-gray-400">まだ記事がありません。</p>
          ) : (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {speciesPosts.map((post) => (
                <ArticleCard key={`${post.category}-${post.slug}`} post={post} />
              ))}
            </div>
          )}
          <div className="mt-8 sm:hidden text-center">
            <Link href="/species" className="text-sm font-medium text-green-700 hover:text-green-900 transition-colors">
              すべて見る →
            </Link>
          </div>
        </div>
      </section>

      {/* 最新記事一覧 */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            最新の記事
          </h2>
          {latestPosts.length === 0 ? (
            <p className="mt-8 text-gray-400">まだ記事がありません。</p>
          ) : (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <ArticleCard key={`${post.category}-${post.slug}`} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* EC導線 */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="rounded-2xl bg-green-900 px-6 py-16 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-green-300">Online Shop</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-white">
              希少植物のオンラインショップ
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-green-200">
              厳選された希少植物をお届けします
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
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
                  className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                >
                  {cat.name}
                </a>
              ))}
            </div>
            <div className="mt-8">
              <a
                href="https://www.tokyoplants.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-green-900 hover:bg-green-50 transition-colors"
              >
                ショップを見る
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
