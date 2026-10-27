import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { getAllPosts, getPostsByCategory, getAllTags, getPostsByTag } from "@/lib/posts";
import { categories } from "@/lib/categories";
import { OWN_COLLECTION, OwnProduct, RANKING_LIMIT, RANKING_PERIOD, READER_RANKING } from "@/lib/homeStorefront";
import ArticleCard from "@/components/ArticleCard";
import CategoryTabs from "@/components/CategoryTabs";
import AppShowcase from "./AppShowcase";
import CollectionCard from "./CollectionCard";
import RankingCard from "./RankingCard";
import ShelfScroller from "./ShelfScroller";

// トップページ。「商品コレクションと専門的な読み物が共存するサイト」として、
// 自社商品 → 人気ランキング → アプリ → 読みもの の順に並べる。
// 記事への内部リンク（よく読まれている記事・カテゴリの新着・タグ）は旧トップと同程度の本数を残している。

// 直近28日間のGA4実績（PV上位）に基づく選出。2026-08-31更新（旧トップから引き継ぎ）
const EDITORS_PICK = [
  "soil/neko-chip-vs-original-soil",
  "review/plant-light-review",
  "guide/hydroculture-to-soil-transition",
  "guide/platycerium-grow-light-guide",
  "species/alocasia-silver-dragon",
  "guide/no-drainage-hole-pot-guide",
  "soil/best-soil-for-pachira",
  "guide/anthurium-warocqueanum-care-guide",
  "guide/monstera-hydroculture",
];

/** 2段組みの見出し。前半を黒、後半をグレーにするApple Storeの書き方。補足の小さな文は付けない */
function SectionTitle({ id, strong, rest }: { id: string; strong: string; rest: string }) {
  return (
    <h2
      id={id}
      className="text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] [word-break:auto-phrase] md:text-[40px] md:leading-[1.15]"
    >
      {strong}
      <span className="text-[#86868b]">{rest}</span>
    </h2>
  );
}

/** 柄の見本は、画像ファイルを置いたものだけ出す（届いていない柄でカードが壊れないように） */
function withExistingVariants(product: OwnProduct): OwnProduct {
  if (!product.variants) return product;
  const exists = (src: string) => fs.existsSync(path.join(process.cwd(), "public", src));
  const variants = product.variants.filter((v) => exists(v.image) && exists(v.thumb));
  return { ...product, variants };
}

export default function StoreHome() {
  const allPosts = getAllPosts();
  const collection = OWN_COLLECTION.map(withExistingVariants);
  const ranking = READER_RANKING.slice(0, RANKING_LIMIT);
  const editorsPick = EDITORS_PICK.map((key) => allPosts.find((p) => `${p.category}/${p.slug}` === key)).filter(
    (p) => p !== undefined,
  );
  const pickedSlugs = new Set(EDITORS_PICK.map((k) => k.split("/")[1]));
  const categoryTabs = (["soil", "guide", "species", "research", "review"] as const).map((slug) => {
    const category = categories.find((c) => c.slug === slug)!;
    const inCategory = getPostsByCategory(slug);
    return { ...category, posts: inCategory.filter((p) => !pickedSlugs.has(p.slug)).slice(0, 8), totalCount: inCategory.length };
  });
  const popularTags = getAllTags()
    .map((tag) => ({ tag, count: getPostsByTag(tag).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 16);

  return (
    <div className="font-store">
      {/* 導入。タイトルは控えめにし、すぐ下の商品写真をファーストビューに入れる */}
      <section className="bg-[#f5f5f7] pt-10 md:pt-16">
        <div className="store-gutter">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h1 className="text-[30px] font-semibold leading-[1.2] tracking-[-0.015em] md:text-[44px]">
              植物と暮らす、
              <br className="md:hidden" />
              土と道具と読みもの。
            </h1>
            <p className="max-w-[420px] text-[14px] leading-relaxed text-[#6e6e73] [word-break:auto-phrase] md:pb-1.5 md:text-right">
              観葉植物の専門店 tokyoplants がつくったものと、育て方の記事。
            </p>
          </div>
        </div>
      </section>

      {/* オリジナル商品 */}
      <section id="collection" aria-labelledby="collection-heading" className="scroll-mt-16 bg-[#f5f5f7] pb-16 pt-12 md:pb-24 md:pt-16">
        <div className="store-gutter">
          <div className="mx-auto max-w-[1180px]">
            <SectionTitle id="collection-heading" strong="オリジナル。" rest="専門店がつくったもの。" />
          </div>
        </div>
        <div className="store-shelf store-collection scrollbar-hide mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pt-1 md:mx-auto md:mt-10 md:grid md:max-w-[1180px] md:grid-cols-2 md:gap-5 md:overflow-visible xl:grid-cols-4">
          {collection.map((p, i) => (
            <CollectionCard key={p.id} product={p} priority={i < 2} />
          ))}
        </div>
      </section>

      {/* 人気ランキング（Amazon）。トップでは編集部おすすめを出さず、ランキングだけにする（おすすめは /items） */}
      <section id="ranking" aria-labelledby="ranking-heading" className="scroll-mt-16 bg-[#f5f5f7] pb-16 md:pb-24">
        <div className="store-gutter">
          <div className="mx-auto max-w-[1180px]">
            <SectionTitle id="ranking-heading" strong="人気ランキング。" rest="読者が選んだ道具。" />
          </div>
        </div>
        <div className="mt-8 md:mt-10">
          <ShelfScroller label="人気ランキング">
            {ranking.map((item, i) => (
              <RankingCard key={item.asin} item={item} rank={i + 1} />
            ))}
          </ShelfScroller>
        </div>
        {/* 利益相反とランキングの根拠の開示。Amazonアソシエイトの表記は規約上必須 */}
        <div className="store-gutter mt-10">
          <p className="mx-auto max-w-[1180px] text-[11px] leading-relaxed text-[#86868b]">
            オリジナル商品はtokyoplantsが販売しています。ランキングはtokyoplants経由のAmazon注文数の順（{RANKING_PERIOD}
            ）で、当サイトの選定基準を満たす商品に限っています。Amazonのアソシエイトとして、tokyoplantsは適格販売により収入を得ています。
          </p>
        </div>
      </section>

      <AppShowcase />

      {/* 読みもの */}
      <section id="reading" aria-labelledby="reading-heading" className="scroll-mt-16 bg-white py-16 md:py-24">
        <div className="store-gutter">
          <div className="mx-auto max-w-[1180px]">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionTitle id="reading-heading" strong="読みもの。" rest="植物を知り、育てる。" />
              <form action="/search" method="get" role="search" className="w-full md:w-[320px]">
                <label htmlFor="home-search" className="sr-only">
                  記事を検索
                </label>
                <input
                  id="home-search"
                  name="q"
                  type="search"
                  placeholder="植物名・症状で検索"
                  className="w-full rounded-full bg-[#f5f5f7] px-5 py-3 text-[14px] outline-none placeholder:text-[#86868b] focus:ring-2 focus:ring-[#16352A]/30"
                />
              </form>
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/${cat.slug}`} className="block h-full rounded-2xl bg-[#f5f5f7] px-4 py-4 transition-colors hover:bg-[#ebebf0]">
                    <span className="block text-[14px] font-semibold">{cat.name}</span>
                    <span className="mt-1 block text-[12px] text-[#6e6e73]">{getPostsByCategory(cat.slug).length}本</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/items" className="block h-full rounded-2xl bg-[#f5f5f7] px-4 py-4 transition-colors hover:bg-[#ebebf0]">
                  <span className="block text-[14px] font-semibold">おすすめアイテム</span>
                  <span className="mt-1 block text-[12px] text-[#6e6e73]">記事で紹介した道具</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {editorsPick.length > 0 && (
          <div className="mt-14">
            <div className="store-gutter">
              <h3 className="mx-auto max-w-[1180px] text-[19px] font-semibold md:text-[21px]">よく読まれている記事</h3>
            </div>
            <div className="mt-4">
              <ShelfScroller label="よく読まれている記事">
                {editorsPick.map((post) => (
                  <div key={`${post.category}-${post.slug}`} className="w-[78%] shrink-0 snap-start sm:w-[300px]">
                    <ArticleCard post={post} />
                  </div>
                ))}
              </ShelfScroller>
            </div>
          </div>
        )}

        <div className="store-gutter mt-14">
          <div className="mx-auto max-w-[1180px]">
            <h3 className="text-[19px] font-semibold md:text-[21px]">カテゴリの新着</h3>
            <div className="mt-6">
              <CategoryTabs tabs={categoryTabs} />
            </div>

            <h3 className="mt-14 text-[19px] font-semibold md:text-[21px]">タグから探す</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {popularTags.map(({ tag }) => (
                <Link
                  key={tag}
                  href={`/tag/${encodeURIComponent(tag)}`}
                  className="rounded-full bg-[#f5f5f7] px-4 py-2 text-[13px] text-[#1d1d1f] transition-colors hover:bg-[#ebebf0]"
                >
                  {tag}
                </Link>
              ))}
              <Link href="/tags" className="rounded-full px-4 py-2 text-[13px] font-medium text-[#2c6e52] hover:underline">
                すべてのタグ ›
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#e8e8ed] bg-white py-10">
        <div className="store-gutter">
          <div className="mx-auto flex max-w-[1180px] flex-col items-start gap-1 md:flex-row md:items-center md:justify-between">
            <p className="text-[14px] text-[#6e6e73]">入荷情報と育て方のコツは Instagram で。</p>
            <a
              href="https://www.instagram.com/tokyoplants.jp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] font-medium text-[#2c6e52] hover:underline"
            >
              @tokyoplants.jp ›
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
