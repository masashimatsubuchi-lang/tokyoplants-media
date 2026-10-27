import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getPostsByCategory } from "@/lib/posts";
import { categories } from "@/lib/categories";
import { RECOMMENDED_OWN_ITEMS, RECOMMENDED_SECTIONS } from "@/lib/recommendedItems";
import ArticleCard from "@/components/ArticleCard";
import AllArticlesList from "@/components/AllArticlesList";
import CategoryTabs from "@/components/CategoryTabs";

/**
 * Storefront-inspired editorial home.
 * Product photography, original products and editorial archives all come from
 * existing site assets and data. This is presentation-only; it does not change
 * article URLs, Markdown content, the item catalogue or tracking infrastructure.
 */
const featuredProducts = [
  {
    key: "soil",
    index: 0,
    eyebrow: "ORIGINAL SOIL",
    title: "育てる楽しさは、土から。",
    description: "植物の根と向き合って生まれた、tokyoplantsのオリジナル培養土。",
    background: "#F0EDE6",
    imageCover: false,
    editorial: "/soil/repotting-soil-guide",
    editorialLabel: "土の選び方を読む",
  },
  {
    key: "hydro",
    index: 1,
    eyebrow: "HYDRO MINERAL",
    title: "土にとらわれない、育て方。",
    description: "溶岩石とゼオライトで、植物との新しい暮らしを。",
    background: "#E9EEEC",
    imageCover: false,
    editorial: "/guide/monstera-hydroculture",
    editorialLabel: "ハイドロ栽培を知る",
  },
  {
    key: "towel",
    index: 2,
    eyebrow: "DAILY BOTANICAL TOWEL",
    title: "植物のかたちを、日常に。",
    description: "好きな葉の姿を、毎日の暮らしの小さな楽しみに。",
    background: "#F4EDEB",
    imageCover: false,
    editorial: "/review/daily-botanical-towel-review",
    editorialLabel: "アイテムを詳しく知る",
  },
  {
    key: "leather",
    index: 3,
    eyebrow: "SISHI CRAFT × TOKYOPLANTS",
    title: "手仕事から生まれる、植物。",
    description: "植物の造形美を、クラフトの視点から楽しむレザーコレクション。",
    background: "#EAE7E2",
    imageCover: true,
    editorial: "/review/leather-botanical-collection",
    editorialLabel: "コレクションを知る",
  },
] as const;

const curatedAsins = [
  "B0BXPKS4S7", // grow light
  "B0C9LN59ZR", // repotting mat
  "B08PPML5TC", // watering checker
  "B0BGXVXGSV", // watering can
  "B08CXX4B4X", // pot; existing image provided
  "B0C5M5HPC4", // caudex pot
];

const topicLinks = [
  { label: "植物の土", subtitle: "用土と植え替え", href: "/soil", number: "01" },
  { label: "育て方", subtitle: "水やり・光・環境", href: "/guide", number: "02" },
  { label: "植物図鑑", subtitle: "品種から探す", href: "/species", number: "03" },
  { label: "アイテム", subtitle: "道具を選ぶ", href: "/items", number: "04" },
];

function productLink(url: string | undefined, key: string): string {
  if (!url) return "/items";
  const result = new URL(url);
  result.searchParams.set("utm_source", "media");
  result.searchParams.set("utm_medium", "homepage");
  result.searchParams.set("utm_campaign", "featured-collection");
  result.searchParams.set("utm_content", key);
  return result.toString();
}

function amazonLink(asin: string): string {
  const tag = process.env.AMAZON_ASSOCIATE_TAG || "tokyoplants0f-22";
  const url = new URL("https://www.amazon.co.jp/dp/" + asin);
  url.searchParams.set("tag", tag);
  return url.toString();
}

function SmallArrow() {
  return <span aria-hidden="true" className="ml-1">↗</span>;
}

export default function StorefrontHome() {
  const allPosts = getAllPosts();

  const chosenExternal = curatedAsins.flatMap((asin) => {
    const section = RECOMMENDED_SECTIONS.find((group) => group.items.some((item) => item.asin === asin));
    const item = section?.items.find((product) => product.asin === asin);
    return item ? [{ item, section: section?.title ?? "おすすめ" }] : [];
  });

  const editorsPickDefs = [
    { category: "soil", slug: "neko-chip-vs-original-soil" },
    { category: "review", slug: "plant-light-review" },
    { category: "guide", slug: "monstera-hydroculture" },
    { category: "soil", slug: "repotting-soil-guide" },
    { category: "guide", slug: "anthurium-warocqueanum-care-guide" },
    { category: "guide", slug: "no-drainage-hole-pot-guide" },
  ];
  const editorsPick = editorsPickDefs
    .map((entry) => allPosts.find((post) => post.category === entry.category && post.slug === entry.slug))
    .filter((post) => post !== undefined);
  const featuredSlugs = new Set(editorsPick.map((post) => post.slug));

  const categoryTabs = (["soil", "guide", "species", "research", "review"] as const).map((slug) => {
    const category = categories.find((entry) => entry.slug === slug)!;
    const posts = getPostsByCategory(slug)
      .filter((post) => !featuredSlugs.has(post.slug))
      .slice(0, 8);
    return { ...category, posts, totalCount: getPostsByCategory(slug).length };
  });

  return (
    <>
      <section className="bg-white">
        <div className="mx-auto max-w-[1320px] px-5 pb-10 pt-14 sm:px-8 md:pb-14 md:pt-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.27em] text-[#37664f]">
            TOKYOPLANTS JOURNAL & STORE
          </p>
          <h1 className="mt-5 max-w-5xl text-[clamp(2.6rem,6.6vw,5.7rem)] font-semibold leading-[1.13] tracking-[-0.055em] text-[#181b19]">
            植物のある暮らしに、<br className="hidden sm:block" />
            いい選択を。
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-[1.9] text-[#686d69] md:text-[18px]">
            育てるための道具も、暮らしを彩るアイテムも。
            <br className="hidden sm:block" />
            植物をもっと楽しむためのプロダクトと知識を、ひとつに。
          </p>

          <div className="mt-12 grid grid-cols-2 gap-3 border-t border-[#e9e9e6] pt-6 md:mt-16 md:grid-cols-4 md:gap-6">
            {topicLinks.map((topic) => (
              <Link
                key={topic.number}
                href={topic.href}
                className="group flex items-start justify-between rounded-2xl px-1 py-2 transition-colors hover:text-[#22614c]"
              >
                <div>
                  <p className="text-[10px] font-medium tracking-[0.16em] text-[#9c9f9b]">{topic.number} / EXPLORE</p>
                  <p className="mt-2 text-[16px] font-semibold tracking-tight">{topic.label}</p>
                  <p className="mt-1 text-xs text-[#7c817d]">{topic.subtitle}</p>
                </div>
                <span aria-hidden="true" className="pt-7 text-lg text-[#949995] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f5] py-14 md:py-24" aria-labelledby="featured-collection-heading">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-3 md:mb-12">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.23em] text-[#668272]">FEATURED COLLECTION</p>
              <h2 id="featured-collection-heading" className="mt-3 text-[clamp(1.9rem,3.3vw,3.3rem)] font-semibold leading-tight tracking-[-0.045em] text-[#1d211f]">
                tokyoplantsのプロダクト。
              </h2>
              <p className="mt-3 text-sm text-[#777c78]">使うものも、飾るものも。植物への想いから生まれた4つのコレクション。</p>
            </div>
            <Link href="/items" className="text-[13px] font-semibold text-[#22614c] hover:underline">
              すべてのアイテムを見る <SmallArrow />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((tile) => {
              const item = RECOMMENDED_OWN_ITEMS[tile.index];
              if (!item) return null;
              return (
                <article
                  key={tile.key}
                  className="group flex min-h-[445px] flex-col overflow-hidden rounded-[26px] transition-transform duration-300 hover:-translate-y-1"
                  style={{ backgroundColor: tile.background }}
                >
                  <div className="px-7 pb-3 pt-8">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#69736c]">{tile.eyebrow}</p>
                    <h3 className="mt-3 text-[23px] font-semibold leading-[1.35] tracking-[-0.04em] text-[#242a26]">{tile.title}</h3>
                    <p className="mt-3 min-h-12 text-[12px] leading-[1.8] text-[#676f69]">{tile.description}</p>
                  </div>

                  <a
                    href={productLink(item.url, tile.key)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.title + " の商品ページを見る"}
                    className="relative mx-5 mt-1 block min-h-[205px] flex-1 overflow-hidden rounded-[18px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22614c]"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 85vw, (max-width: 1280px) 42vw, 23vw"
                        className={tile.imageCover ? "object-cover transition-transform duration-700 group-hover:scale-[1.035]" : "object-contain p-3 transition-transform duration-700 group-hover:scale-[1.055]"}
                        priority={tile.index < 2}
                      />
                    ) : null}
                  </a>
                  <div className="flex items-center justify-between gap-3 px-7 pb-7 pt-5 text-[12px] font-semibold">
                    <Link href={tile.editorial} className="text-[#4e6056] hover:underline">{tile.editorialLabel}</Link>
                    <a href={productLink(item.url, tile.key)} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-full bg-[#1d3026] px-4 py-2 text-white hover:bg-[#294d37]">
                      商品を見る <SmallArrow />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24" aria-labelledby="curated-items-heading">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.23em] text-[#668272]">THE EDIT</p>
              <h2 id="curated-items-heading" className="mt-3 text-[clamp(1.9rem,3.3vw,3.1rem)] font-semibold tracking-[-0.045em] text-[#1d211f]">
                植物との暮らしに、選びたいもの。
              </h2>
              <p className="mt-3 text-sm text-[#777c78]">育成ライト、植え替え用品、鉢、水やりの道具。用途別に選んだアイテム。</p>
            </div>
            <Link href="/items" className="text-[13px] font-semibold text-[#22614c] hover:underline">おすすめアイテム一覧 <SmallArrow /></Link>
          </div>

          <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 scrollbar-hide sm:-mx-8 sm:px-8">
            {chosenExternal.map(({ item, section }) => (
              <a
                key={item.asin}
                href={amazonLink(item.asin!)}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="group flex w-[255px] shrink-0 snap-start flex-col overflow-hidden rounded-[22px] bg-[#f6f6f4] transition-transform hover:-translate-y-1 sm:w-[290px]"
              >
                <div className="flex h-[222px] items-center justify-center overflow-hidden p-6">
                  {item.image ? (
                    // Existing editorial-approved Amazon product image URL; no new media assets are introduced.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <span className="text-[52px] font-light text-[#bdc6bf]" aria-hidden="true">+</span>
                  )}
                </div>
                <div className="flex flex-1 flex-col bg-[#f8f8f6] px-5 pb-6 pt-4">
                  <p className="text-[10px] font-semibold tracking-[0.1em] text-[#738375]">{section}</p>
                  <h3 className="mt-2 min-h-[48px] text-[15px] font-semibold leading-[1.6] text-[#232823]">{item.title}</h3>
                  <p className="mt-2 line-clamp-2 text-[12px] leading-[1.7] text-[#777e79]">{item.reason}</p>
                  <span className="mt-5 text-[12px] font-semibold text-[#22614c]">Amazonで見る <SmallArrow /></span>
                </div>
              </a>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-[#929892]">※外部商品へのリンクにはAmazonアソシエイトリンクを含みます。掲載は人気順位ではなく、用途別の編集部セレクションです。</p>
        </div>
      </section>

      <section className="bg-[#e9eeeb] py-16 md:py-24" aria-labelledby="app-feature-heading">
        <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.23em] text-[#5b7765]">GREEN COLLECTION</p>
            <h2 id="app-feature-heading" className="mt-4 text-[clamp(2rem,4vw,4.1rem)] font-semibold leading-[1.22] tracking-[-0.052em] text-[#1c2921]">
              育てる時間まで、<br />もっと楽しく。
            </h2>
            <p className="mt-6 max-w-lg text-[15px] leading-[1.9] text-[#5e6c63]">
              水やりも、成長の記録も。大切な植物との毎日を、手のひらで。
            </p>
            <Link
              href="/app?ch=media_home_feature"
              className="mt-8 inline-flex items-center gap-1 rounded-full bg-[#1f392b] px-6 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#31563f]"
            >
              アプリを詳しく見る <SmallArrow />
            </Link>
          </div>
          <Link href="/app?ch=media_home_feature" className="relative block h-[310px] overflow-hidden rounded-[26px] bg-[#d6e3da] sm:h-[390px]">
            <Image
              src="/images/app/screen-collection.png"
              alt="Green Collectionアプリの植物コレクション画面"
              fill
              sizes="(max-width: 1024px) 90vw, 48vw"
              className="object-contain p-7 transition-transform duration-700 hover:scale-[1.035]"
            />
          </Link>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24" aria-labelledby="journal-heading">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.23em] text-[#668272]">THE JOURNAL</p>
              <h2 id="journal-heading" className="mt-3 text-[clamp(2rem,3.5vw,3.4rem)] font-semibold tracking-[-0.045em] text-[#1d211f]">
                植物を、もっと知る。
              </h2>
              <p className="mt-3 text-sm text-[#777c78]">育て方、用土選び、植物図鑑。専門メディアの実践的なガイド。</p>
            </div>
            <Link href="/guide" className="text-[13px] font-semibold text-[#22614c] hover:underline">育て方の記事を見る <SmallArrow /></Link>
          </div>
          <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 scrollbar-hide sm:-mx-8 sm:px-8">
            {editorsPick.map((post) => (
              <div key={post.category + "-" + post.slug} className="w-[280px] shrink-0 snap-start sm:w-[315px]">
                <ArticleCard post={post} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f5] py-14 md:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.23em] text-[#668272]">EXPLORE ARTICLES</p>
          <h2 className="mt-3 text-[clamp(1.8rem,3vw,2.8rem)] font-semibold tracking-[-0.04em] text-[#1d211f]">テーマから探す。</h2>
          <div className="mt-8">
            <CategoryTabs tabs={categoryTabs} />
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-[1160px] px-5 sm:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.23em] text-[#668272]">ALL ARTICLES</p>
          <h2 className="mt-3 text-[clamp(1.8rem,3vw,2.8rem)] font-semibold tracking-[-0.04em] text-[#1d211f]">すべての記事。</h2>
          <p className="mt-2 text-sm text-[#8a908a]">{allPosts.length}本の記事</p>
          <div className="mt-8">
            <AllArticlesList posts={allPosts} />
          </div>
        </div>
      </section>

      <section className="border-t border-[#eeeeeb] bg-white py-12">
        <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-5 px-5 sm:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#89958b]">TOKYOPLANTS</p>
            <p className="mt-2 text-xl font-semibold tracking-tight text-[#252b27]">希少な観葉植物を、もっと身近に。</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a href="https://www.tokyoplants.com?utm_source=media&utm_medium=homepage&utm_campaign=shop" target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#1f392b] px-5 py-3 text-[13px] font-semibold text-white hover:bg-[#31563f]">
              オンラインショップ <SmallArrow />
            </a>
            <a href="https://www.instagram.com/tokyoplants.jp" target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#d8dfda] px-5 py-3 text-[13px] font-semibold text-[#3d5545] hover:bg-[#f1f4f1]">
              Instagram <SmallArrow />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
