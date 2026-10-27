import Link from "next/link";
import { getAllPosts, getPostsByCategory, getAllTags, getPostsByTag } from "@/lib/posts";
import { categories } from "@/lib/categories";
import { EDITORIAL_SHELVES, OWN_COLLECTION, READER_RANKING, Shelf } from "@/lib/homeStorefront";
import ArticleCard from "@/components/ArticleCard";
import CategoryTabs from "@/components/CategoryTabs";
import AppShowcase from "./AppShowcase";
import CollectionCard from "./CollectionCard";
import ShelfCard from "./ShelfCard";
import ShelfScroller from "./ShelfScroller";

// トップページ。「商品コレクションと専門的な読み物が共存するサイト」として、
// 自社商品 → 外部商品 → アプリ → 読みもの の順に並べる。
// 記事への内部リンク（注目の記事・カテゴリ別の最新記事・タグ）は旧トップと同程度の本数を残している。

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

/** 2段組みの見出し。前半を太字、後半をグレーにするApple Storeの書き方 */
function SectionTitle({ id, strong, rest }: { id: string; strong: string; rest: string }) {
  return (
    <h2 id={id} className="text-[24px] font-semibold leading-[1.3] tracking-[-0.01em] [word-break:auto-phrase] md:text-[32px]">
      {strong}
      <span className="text-[#86868b]">{rest}</span>
    </h2>
  );
}

const NAV = [
  { label: "培養土", href: "#collection", image: "/images/home/soil-2l.jpg" },
  { label: "無機培地", href: "#collection", image: "/images/home/hydro-mineral.jpg" },
  { label: "タオル", href: "#collection", image: "/images/home/towel-monstera-variegata.jpg" },
  { label: "レザー", href: "#collection", image: "/images/home/sishicraft-monstera.jpg" },
  { label: "育成ライト", href: "#shelf-lights", image: "https://m.media-amazon.com/images/I/81nywh0p0lL._AC_SL300_.jpg" },
  { label: "鉢", href: "#shelf-pots", image: "https://m.media-amazon.com/images/I/611ZZ6LnsdL._AC_SL300_.jpg" },
  { label: "アプリ", href: "#app", image: "/images/app/app-icon.png" },
];

/**
 * Amazonの画像をASINから組み立てる汎用URL（/images/P/）は、商品によって空の画像が返る。
 * 記事のamazonProductsには実際の画像URLが入っているので、あればそちらに差し替える。
 * 記事側は200px指定なので、カードの大きさに合わせて500pxに置き換える。
 */
function withArticleImages(shelves: Shelf[], posts: ReturnType<typeof getAllPosts>): Shelf[] {
  const byAsin = new Map<string, string>();
  for (const post of posts) {
    for (const p of post.amazonProducts ?? []) {
      if (p.asin && p.image && !byAsin.has(p.asin)) byAsin.set(p.asin, p.image.replace(/_SL\d+_/, "_SL500_"));
    }
  }
  return shelves.map((shelf) => ({
    ...shelf,
    items: shelf.items.map((item) =>
      item.image.includes("/images/P/") && byAsin.has(item.asin) ? { ...item, image: byAsin.get(item.asin)! } : item,
    ),
  }));
}

export default function StoreHome() {
  const allPosts = getAllPosts();
  const shelves = withArticleImages([READER_RANKING, ...EDITORIAL_SHELVES], allPosts);
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
      <section className="bg-[#f5f5f7] pb-2 pt-10 md:pt-16">
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

        {/* カテゴリへの近道（Apple Storeの上部の製品アイコン列にあたる） */}
        <nav aria-label="このページの内容" className="mt-8 md:mt-10">
          <ul className="store-shelf scrollbar-hide flex gap-5 overflow-x-auto pb-2 md:gap-8">
            {NAV.map((n) => (
              <li key={n.label} className="shrink-0">
                <a href={n.href} className="group flex w-[72px] flex-col items-center gap-2 text-center">
                  <span className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-[18px] bg-white shadow-[0_1px_6px_rgba(0,0,0,0.05)] transition-transform group-hover:-translate-y-0.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={n.image} alt="" width={72} height={72} loading="lazy" className="h-[60px] w-[60px] object-contain" />
                  </span>
                  <span className="text-[12px] font-medium text-[#1d1d1f]">{n.label}</span>
                </a>
              </li>
            ))}
            <li className="shrink-0">
              <a href="#reading" className="group flex w-[72px] flex-col items-center gap-2 text-center">
                <span className="flex h-[72px] w-[72px] items-center justify-center rounded-[18px] bg-white text-[#16352A] shadow-[0_1px_6px_rgba(0,0,0,0.05)] transition-transform group-hover:-translate-y-0.5">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13ZM13 4h5.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H13V4Z" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-[12px] font-medium text-[#1d1d1f]">読みもの</span>
              </a>
            </li>
          </ul>
        </nav>
      </section>

      {/* オリジナル商品 */}
      <section id="collection" aria-labelledby="collection-heading" className="scroll-mt-16 bg-[#f5f5f7] pb-16 pt-12 md:pb-24 md:pt-16">
        <div className="store-gutter">
          <div className="mx-auto max-w-[1180px]">
            <SectionTitle id="collection-heading" strong="オリジナル。" rest="植物専門店がつくった、使うものと飾るもの。" />
            <p className="mt-3 text-[12px] text-[#86868b]">tokyoplantsが販売している商品です。</p>
          </div>
        </div>
        <div className="store-shelf store-collection scrollbar-hide mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pt-1 md:mx-auto md:grid md:max-w-[1180px] md:grid-cols-2 md:gap-5 md:overflow-visible xl:grid-cols-4">
          {OWN_COLLECTION.map((p, i) => (
            <CollectionCard key={p.id} product={p} priority={i < 2} />
          ))}
        </div>
      </section>

      {/* 外部商品。人気（注文数）と編集部おすすめを別の列に分け、それぞれの根拠を列ごとに書く */}
      <section id="tools" aria-labelledby="tools-heading" className="scroll-mt-16 bg-[#f5f5f7] pb-16 md:pb-24">
        <div className="store-gutter">
          <div className="mx-auto max-w-[1180px]">
            <SectionTitle id="tools-heading" strong="育てる道具。" rest="記事で確かめて選んだもの。" />
          </div>
        </div>
        {shelves.map((shelf) => (
          <div key={shelf.id} id={`shelf-${shelf.id}`} className="mt-10 scroll-mt-16 md:mt-14">
            <div className="store-gutter">
              <div className="mx-auto max-w-[1180px]">
                <h3 className="text-[19px] font-semibold md:text-[21px]">{shelf.title}</h3>
                <p className="mt-1 text-[12px] leading-relaxed text-[#86868b]">{shelf.basis}</p>
              </div>
            </div>
            <div className="mt-4">
              <ShelfScroller label={shelf.title}>
                {shelf.items.map((item) => (
                  <ShelfCard key={item.asin} item={item} placement={`home-${shelf.id}`} />
                ))}
              </ShelfScroller>
            </div>
          </div>
        ))}
        <div className="store-gutter mt-10">
          <div className="mx-auto max-w-[1180px] space-y-1 text-[11px] leading-relaxed text-[#86868b]">
            <p>Amazonのアソシエイトとして、tokyoplantsは適格販売により収入を得ています。価格は確認時点のもので、変わることがあります。</p>
            <p>
              <Link href="/items" className="text-[#2c6e52] hover:underline">
                おすすめアイテムの一覧 ›
              </Link>
            </p>
          </div>
        </div>
      </section>

      <AppShowcase />

      {/* 読みもの */}
      <section id="reading" aria-labelledby="reading-heading" className="scroll-mt-16 bg-white py-16 md:py-24">
        <div className="store-gutter">
          <div className="mx-auto max-w-[1180px]">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionTitle id="reading-heading" strong="読みもの。" rest={`植物を知り、育てる。${allPosts.length}本の記事。`} />
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
