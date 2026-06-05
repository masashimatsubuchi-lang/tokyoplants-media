import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { getAllPosts, getPostsByCategory } from "@/lib/posts";
import { categories } from "@/lib/categories";
import ArticleCard from "@/components/ArticleCard";
import AllArticlesList from "@/components/AllArticlesList";

export default function Home() {
  const allPosts = getAllPosts();
  const editorsPickDefs = [
    { category: "review", slug: "daily-botanical-towel-review" },
    { category: "soil", slug: "houseplant-soil-hub-guide" },
    { category: "soil", slug: "hydroculture-complete-guide" },
  ];
  const editorsPick = editorsPickDefs
    .map((def) => allPosts.find((p) => p.category === def.category && p.slug === def.slug))
    .filter((post) => post !== undefined);
  const editorsPickSlugs = new Set(editorsPickDefs.map((d) => d.slug));
  const soilPosts = getPostsByCategory("soil").filter((p) => !editorsPickSlugs.has(p.slug)).slice(0, 3);
  const guidePosts = getPostsByCategory("guide").filter((p) => !editorsPickSlugs.has(p.slug)).slice(0, 3);
  const speciesPosts = getPostsByCategory("species").slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="bg-[#f1eee6]">
        <div className="mx-auto max-w-5xl bg-[#f1eee6] px-4 pt-8 pb-0 md:pt-12">
          <Image
            src="/images/hero-illustration.png"
            alt="tokyoplants — 植物を知り、育てる。"
            width={6144}
            height={3048}
            priority
            className="mx-auto h-auto w-full max-w-[1280px]"
          />
        </div>
        <div className="bg-[#f1eee6] pb-10 pt-6">
          <div className="mx-auto max-w-3xl px-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className={`rounded-xl border border-white/60 bg-white/70 px-3 py-3 text-center transition-all hover:border-teal-500 hover:bg-white ${
                    cat.slug === "species" ? "col-span-2 md:col-span-1" : ""
                  }`}
                >
                  <span className="block text-[13px] font-bold text-slate-800">
                    {cat.name}
                  </span>
                  <span className="mt-1 block text-[11px] leading-relaxed text-slate-500">
                    {cat.description}
                  </span>
                </Link>
              ))}
            </div>
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

      {/* Editors Pick */}
      {editorsPick.length > 0 && (
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-5xl px-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">
              Editors Pick
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              注目の記事
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {editorsPick.map((post) => (
                <ArticleCard key={`${post.category}-${post.slug}`} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Soil 特集 */}
      <section className="py-24 bg-gray-50/80">
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
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {soilPosts.map((post) => (
                <ArticleCard key={`${post.category}-${post.slug}`} post={post} />
              ))}
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
      <section className="bg-white py-24">
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
      <section className="py-24 bg-gray-50/80">
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

      {/* All Articles */}
      <section className="border-t border-gray-100 py-24 bg-white">
        <div className="mx-auto max-w-5xl px-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">All Articles</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            すべての記事一覧
          </h2>
          <p className="mt-2 text-sm text-gray-400">{allPosts.length}本の記事</p>
          <AllArticlesList posts={allPosts} />
        </div>
      </section>

      {/* EC Banner */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="rounded-2xl bg-teal-800 overflow-hidden">
            <div className="px-8 py-14 md:px-16 md:py-16 grid md:grid-cols-2 gap-10 items-center">

              {/* Left: Copy + CTA */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-300">
                  Online Shop
                </p>
                <h2 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-white leading-snug">
                  入荷即完売の希少植物を<br className="hidden md:block" />専門店から直接お届け
                </h2>
                <ul className="mt-6 space-y-2">
                  {[
                    "国内希少種・コレクター品種を厳選",
                    "入荷情報はInstagramで先行発表",
                    "専門スタッフが状態を確認して発送",
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-teal-100">
                      <span className="mt-0.5 text-teal-400 shrink-0">✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="https://www.tokyoplants.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full bg-white px-7 py-3 text-sm font-semibold text-teal-800 hover:bg-teal-50 transition-colors"
                  >
                    ショップを見る
                  </a>
                  <a
                    href="https://www.instagram.com/tokyoplants_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full border border-white/30 px-7 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                  >
                    入荷情報をチェック
                  </a>
                </div>
              </div>

              {/* Right: Category grid */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: "Monstera", ja: "モンステラ", path: "/categories/6382102" },
                  { name: "Philodendron", ja: "フィロデンドロン", path: "/categories/6382100" },
                  { name: "Anthurium", ja: "アンスリウム", path: "/categories/6382097" },
                  { name: "Alocasia", ja: "アロカシア", path: "/categories/6382096" },
                  { name: "Aglaonema", ja: "アグラオネマ", path: "/categories/6382098" },
                  { name: "Begonia", ja: "ベゴニア", path: "/categories/7114659" },
                ].map((cat) => (
                  <a
                    key={cat.name}
                    href={`https://www.tokyoplants.com${cat.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-white/10 hover:bg-white/20 transition-colors px-3 py-4 text-center group"
                  >
                    <p className="text-[11px] font-semibold text-white/90 group-hover:text-white">{cat.name}</p>
                    <p className="mt-0.5 text-[10px] text-teal-300">{cat.ja}</p>
                  </a>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="border-t border-gray-100 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
              Instagram
            </p>
            <h2 className="mt-3 text-xl md:text-2xl font-bold tracking-tight text-gray-900">
              <a
                href="https://www.instagram.com/tokyoplants_"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-700 transition-colors"
              >
                @tokyoplants_
              </a>
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              入荷情報・育て方のコツを発信中
            </p>
          </div>
          {/* Behold Instagram feed */}
          <div className="mt-8">
            {/* @ts-expect-error: behold-widget is a custom element */}
            <behold-widget feed-id="bSzZ9HspWQL63I2d0INH"></behold-widget>
          </div>
          <div className="mt-8 text-center">
            <a
              href="https://www.instagram.com/tokyoplants_"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
            >
              もっと見る
            </a>
          </div>
        </div>
      </section>
      <Script
        src="https://w.behold.so/widget.js"
        type="module"
        strategy="afterInteractive"
      />
    </>
  );
}
