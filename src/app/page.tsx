import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { getAllPosts, getPostsByCategory, getAllTags, getPostsByTag } from "@/lib/posts";
import { categories } from "@/lib/categories";
import ArticleCard from "@/components/ArticleCard";
import AllArticlesList from "@/components/AllArticlesList";
import CategoryTabs from "@/components/CategoryTabs";

/** 現在の月から季節を判定する（3-5月=春, 6-8月=夏, 9-11月=秋, 12-2月=冬）。
 * トップページの「季節の作業」カードが常に今の季節の記事を指すようにするため。 */
function getCurrentSeasonKeyword(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "春";
  if (month >= 6 && month <= 8) return "夏";
  if (month >= 9 && month <= 11) return "秋";
  return "冬";
}

export default function Home() {
  const allPosts = getAllPosts();
  const seasonKeyword = getCurrentSeasonKeyword();
  const featuredTags = [
    "観葉植物", "モンステラ", "アロカシア", "アンスリウム", "フィロデンドロン",
    "ビカクシダ", "育て方", "植え替え", "用土", "根腐れ",
    "水やり", "ハイドロカルチャー", "育成ライト", "害虫対策", "斑入り",
    "希少植物", "初心者", "夏の管理", "冬の管理", "完全ガイド",
  ];
  // 直近28日間のGA4実績（PV上位）に基づく選出。2026-08-31更新。
  // 定期的に実データで見直すこと（メモリ: project_ga4.md参照）。
  const editorsPickDefs = [
    { category: "soil", slug: "neko-chip-vs-original-soil" },
    { category: "review", slug: "plant-light-review" },
    { category: "guide", slug: "hydroculture-to-soil-transition" },
    { category: "guide", slug: "platycerium-grow-light-guide" },
    { category: "species", slug: "alocasia-silver-dragon" },
    { category: "guide", slug: "no-drainage-hole-pot-guide" },
    { category: "soil", slug: "best-soil-for-pachira" },
    { category: "guide", slug: "anthurium-warocqueanum-care-guide" },
    { category: "guide", slug: "monstera-hydroculture" },
  ];
  const editorsPick = editorsPickDefs
    .map((def) => allPosts.find((p) => p.category === def.category && p.slug === def.slug))
    .filter((post) => post !== undefined);
  const editorsPickSlugs = new Set(editorsPickDefs.map((d) => d.slug));
  const popularTags = getAllTags()
    .map((tag) => ({ tag, count: getPostsByTag(tag).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const categoryTabs = (["soil", "guide", "species", "research", "review"] as const).map((slug) => {
    const category = categories.find((c) => c.slug === slug)!;
    const allInCategory = getPostsByCategory(slug);
    const posts = allInCategory.filter((p) => !editorsPickSlugs.has(p.slug)).slice(0, 8);
    return { ...category, posts, totalCount: allInCategory.length };
  });

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
      <section className="bg-gradient-to-r from-emerald-50/70 via-white to-emerald-50/40 py-10 md:py-16">
        <div className="mx-auto max-w-5xl px-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">Quick Start</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-gray-900">目的から探す</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "初心者向け", desc: "最初の1鉢で失敗しにくい記事", href: "/guide" },
              { title: "症状から探す", desc: "黄化・害虫・根腐れの対処", href: "/search?q=%E5%8E%9F%E5%9B%A0" },
              { title: "植物別で探す", desc: "モンステラやアンスリウムの図鑑", href: "/species" },
              { title: "季節の作業", desc: `今は${seasonKeyword}。植え替え・水やりの時期別ガイド`, href: `/search?q=${encodeURIComponent(seasonKeyword)}` },
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

      {/* Tag Cloud */}
      <section className="bg-gray-50/80 py-10 md:py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">Browse by Tag</p>
              <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-gray-900">ハッシュタグから探す</h2>
            </div>
            <Link
              href="/tags"
              className="hidden sm:block text-[13px] font-medium text-gray-400 hover:text-gray-900 transition-colors"
            >
              すべてのタグ &rarr;
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {popularTags.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}`}
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-teal-400 hover:bg-teal-50 hover:text-teal-800"
              >
                <span className="text-teal-500">#</span>{tag}
                <span className="ml-1 text-[11px] text-gray-400">{count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Editors Pick */}
      {editorsPick.length > 0 && (
        <section className="py-12 md:py-24 bg-white">
          <div className="mx-auto max-w-5xl px-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">
                  Editors Pick
                </p>
                <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                  注目の記事
                </h2>
              </div>
            </div>
            <div className="mt-10 flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
              {editorsPick.map((post) => (
                <div key={`${post.category}-${post.slug}`} className="w-[280px] md:w-[300px] shrink-0 snap-start">
                  <ArticleCard post={post} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* カテゴリ別記事（タブ切り替え） */}
      <section className="py-12 md:py-24 bg-gray-50/80">
        <div className="mx-auto max-w-5xl px-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">
            Browse by Category
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            カテゴリから探す
          </h2>
          <div className="mt-8">
            <CategoryTabs tabs={categoryTabs} />
          </div>
        </div>
      </section>

      {/* All Articles */}
      <section className="border-t border-gray-100 py-12 md:py-24 bg-white">
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
      <section className="py-12 md:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="rounded-2xl bg-teal-800 overflow-hidden">
            <div className="px-8 py-14 md:px-16 md:py-16 grid md:grid-cols-2 gap-10 items-center">

              {/* Left: Copy + CTA */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-300">
                  Online Shop
                </p>
                <h2 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-white leading-snug">
                  厳選した希少な観葉植物<br />
                  <span className="text-teal-300">全て１点もの</span>
                </h2>
                <ul className="mt-6 space-y-2">
                  {[
                    "国内希少種・コレクター品種を厳選",
                    "入荷情報はInstagramで随時発信",
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
                    href="https://www.instagram.com/tokyoplants.jp"
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
      <section className="border-t border-gray-100 py-10 md:py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
              Instagram
            </p>
            <h2 className="mt-3 text-xl md:text-2xl font-bold tracking-tight text-gray-900">
              <a
                href="https://www.instagram.com/tokyoplants.jp"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-700 transition-colors"
              >
                @tokyoplants.jp
              </a>
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              入荷情報・育て方のコツを発信中
            </p>
          </div>
          {/* LightWidget Instagram feed */}
          <div className="mt-8">
            <Script src="https://cdn.lightwidget.com/widgets/lightwidget.js" strategy="afterInteractive" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <iframe src="https://cdn.lightwidget.com/widgets/0fafb7e258bd5178895ab034d0d46332.html" scrolling="no" className="lightwidget-widget" style={{width:"100%",minHeight:"320px",border:0,overflow:"hidden",display:"block"}}></iframe>
          </div>
          <div className="mt-8 text-center">
            <a
              href="https://www.instagram.com/tokyoplants.jp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-gray-900 px-8 py-3 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
            >
              もっと見る
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
