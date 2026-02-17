import Link from "next/link";
import Image from "next/image";
import { Noto_Sans_JP } from "next/font/google";
import { getAllPosts, getPostsByCategory } from "@/lib/posts";
import { categories } from "@/lib/categories";
import ArticleCard from "@/components/ArticleCard";

const heroSans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["500", "700"],
});

export default function Home() {
  const allPosts = getAllPosts();
  const soilPosts = getPostsByCategory("soil");
  const editorsPickSlugs = ["houseplant-soil-hub-guide", "recommended-soil-for-houseplants"];
  const editorsPickSoil = editorsPickSlugs
    .map((slug) => soilPosts.find((post) => post.slug === slug))
    .filter((post) => post !== undefined);
  const otherSoil = soilPosts.filter((post) => !editorsPickSlugs.includes(post.slug)).slice(0, 2);
  const guidePosts = getPostsByCategory("guide").slice(0, 3);
  const speciesPosts = getPostsByCategory("species").slice(0, 3);
  const latestPosts = allPosts.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1628246499185-54f441171885?w=1600&q=80"
          alt="観葉植物"
          fill
          priority
          sizes="100vw"
          className="object-cover scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/75 via-white/60 to-emerald-100/55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(15,118,110,0.25),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(20,83,45,0.2),transparent_45%)]" />
        <div className="relative py-32 md:py-44">
          <div className="mx-auto max-w-5xl px-4">
            <div className="mx-auto max-w-3xl rounded-3xl border border-white/60 bg-white/45 px-8 py-14 text-center shadow-[0_20px_70px_-30px_rgba(15,23,42,0.6)] backdrop-blur-md md:px-14 md:py-20">
              <h1 className={`${heroSans.className} inline-block whitespace-nowrap text-center text-[clamp(1.2rem,3.1vw,2.8rem)] font-bold tracking-[0.04em] text-slate-900 leading-[1.2]`}>
                観葉植物を知り、育てる。
              </h1>
              <p className="mt-6 text-sm tracking-[0.14em] text-slate-500">
                by tokyoplants
              </p>
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/soil"
                  className="inline-block rounded-full bg-teal-700 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/20 hover:bg-teal-800 transition-colors"
                >
                  記事を読む
                </Link>
                <a
                  href="https://www.tokyoplants.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full border border-slate-400/60 bg-white/70 px-8 py-3 text-sm font-semibold text-slate-700 hover:bg-white hover:border-slate-500 transition-colors"
                >
                  ショップを見る
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="border-y border-gray-100 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="group rounded-xl border border-gray-100 bg-white p-5 text-center hover:border-teal-600 hover:shadow-sm transition-all"
              >
                <span className="block text-sm font-bold text-gray-900 group-hover:text-teal-700 transition-colors">
                  {cat.name}
                </span>
                <span className="mt-1.5 block text-xs leading-relaxed text-gray-400">
                  {cat.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Intent Navigation */}
      <section className="bg-gradient-to-r from-emerald-50/70 via-white to-emerald-50/40 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">Quick Start</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-gray-900">目的から探す</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "初心者向け", desc: "最初の1鉢で失敗しにくい記事", href: "/guide" },
              { title: "症状から探す", desc: "黄化・害虫・根腐れの対処", href: "/search?q=%E5%8E%9F%E5%9B%A0" },
              { title: "植物別で探す", desc: "モンステラやアンスリウムの図鑑", href: "/species" },
              { title: "季節の作業", desc: "植え替え・水やりの時期別ガイド", href: "/search?q=%E5%86%AC" },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="rounded-2xl border border-emerald-100 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-sm"
              >
                <p className="text-[15px] font-bold text-emerald-800">{item.title}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-gray-600">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Soil 特集 */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">
                Featured
              </p>
              <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                土・用土
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                観葉植物の土選び・配合・市販土の比較など
              </p>
            </div>
            <Link
              href="/soil"
              className="hidden sm:block text-[13px] font-medium text-gray-400 hover:text-gray-900 transition-colors"
            >
              すべて見る &rarr;
            </Link>
          </div>
          {soilPosts.length === 0 ? (
            <p className="mt-10 text-sm text-gray-400">まだ記事がありません。</p>
          ) : (
            <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
              {editorsPickSoil.length > 0 && (
                <div className="rounded-3xl border border-teal-100 bg-teal-50/40 p-4 md:p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">Editors Pick</p>
                  <div className="mt-4 grid gap-6">
                    {editorsPickSoil.map((post) => (
                      <ArticleCard key={`${post.category}-${post.slug}`} post={post} />
                    ))}
                  </div>
                </div>
              )}
              <div className="grid gap-6">
                {otherSoil.map((post) => (
                  <ArticleCard key={`${post.category}-${post.slug}`} post={post} />
                ))}
              </div>
            </div>
          )}
          <div className="mt-8 sm:hidden text-center">
            <Link href="/soil" className="text-sm font-medium text-teal-700">
              すべて見る &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Guide */}
      <section className="bg-gray-50/80 py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                育て方ガイド
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                初心者から中級者まで、育て方の基本とコツ
              </p>
            </div>
            <Link
              href="/guide"
              className="hidden sm:block text-[13px] font-medium text-gray-400 hover:text-gray-900 transition-colors"
            >
              すべて見る &rarr;
            </Link>
          </div>
          {guidePosts.length === 0 ? (
            <p className="mt-10 text-sm text-gray-400">まだ記事がありません。</p>
          ) : (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {guidePosts.map((post) => (
                <ArticleCard key={`${post.category}-${post.slug}`} post={post} />
              ))}
            </div>
          )}
          <div className="mt-8 sm:hidden text-center">
            <Link href="/guide" className="text-sm font-medium text-teal-700">
              すべて見る &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Species */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                植物図鑑
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                観葉植物の種類と特徴を詳しく紹介
              </p>
            </div>
            <Link
              href="/species"
              className="hidden sm:block text-[13px] font-medium text-gray-400 hover:text-gray-900 transition-colors"
            >
              すべて見る &rarr;
            </Link>
          </div>
          {speciesPosts.length === 0 ? (
            <p className="mt-10 text-sm text-gray-400">まだ記事がありません。</p>
          ) : (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {speciesPosts.map((post) => (
                <ArticleCard key={`${post.category}-${post.slug}`} post={post} />
              ))}
            </div>
          )}
          <div className="mt-8 sm:hidden text-center">
            <Link href="/species" className="text-sm font-medium text-teal-700">
              すべて見る &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Latest */}
      <section className="border-t border-gray-100 py-24 bg-gray-50/50">
        <div className="mx-auto max-w-5xl px-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">New</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            最新の記事
          </h2>
          {latestPosts.length === 0 ? (
            <p className="mt-10 text-sm text-gray-400">まだ記事がありません。</p>
          ) : (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <ArticleCard key={`${post.category}-${post.slug}`} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* EC Banner */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="rounded-2xl bg-teal-800 px-6 py-20 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-300">
              Online Shop
            </p>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-white">
              希少植物のオンラインショップ
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-teal-200">
              厳選された希少植物をお届けします
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {[
                { name: "Monstera", path: "/categories/6382102" },
                { name: "Philodendron", path: "/categories/6382100" },
                { name: "Anthurium", path: "/categories/6382097" },
                { name: "Alocasia", path: "/categories/6382096" },
                { name: "Aglaonema", path: "/categories/6382098" },
                { name: "Begonia", path: "/categories/7114659" },
              ].map((cat) => (
                <a
                  key={cat.name}
                  href={`https://www.tokyoplants.com${cat.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/20 px-5 py-2 text-[13px] font-medium text-white hover:bg-white/10 transition-colors"
                >
                  {cat.name}
                </a>
              ))}
            </div>
            <div className="mt-10">
              <a
                href="https://www.tokyoplants.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-teal-800 hover:bg-gray-50 transition-colors"
              >
                ショップを見る
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="border-t border-gray-100 py-16">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            Instagram
          </p>
          <h2 className="mt-3 text-xl md:text-2xl font-bold tracking-tight text-gray-900">
            @tokyoplants_
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            入荷情報・育て方のコツを発信中
          </p>
          <div className="mt-6">
            <a
              href="https://www.instagram.com/tokyoplants_"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
            >
              フォローする
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
