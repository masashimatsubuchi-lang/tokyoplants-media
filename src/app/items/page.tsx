import { Metadata } from "next";
import Link from "next/link";
import {
  RECOMMENDED_OWN_ITEMS,
  RECOMMENDED_SECTIONS,
  RecommendedItem,
} from "@/lib/recommendedItems";
import { resolveRelatedPosts } from "@/lib/posts";

const PAGE_TITLE = "tokyoplantsのおすすめアイテム｜記事で紹介した道具まとめ";
const PAGE_DESCRIPTION =
  "tokyoplants MEDIAの記事で実際に紹介・検証した観葉植物の道具を、植え替える・育てる・環境を測る・害虫対策・置き場所を整えるの用途別にまとめました。tokyoplants公式商品とAmazonアソシエイト商品を掲載しています。";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/items" },
  openGraph: {
    type: "website",
    url: "/items",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

const ASSOCIATE_TAG = process.env.AMAZON_ASSOCIATE_TAG || "tokyoplants0f-22";

function getAmazonImageUrl(asin: string): string {
  return `https://m.media-amazon.com/images/P/${asin}.01._SL160_.jpg`;
}

function getAmazonUrl(asin: string): string {
  return `https://www.amazon.co.jp/dp/${asin}?tag=${ASSOCIATE_TAG}`;
}

function getTokyoplantsUrl(url: string): string {
  const u = new URL(url);
  u.searchParams.set("utm_source", "media");
  u.searchParams.set("utm_medium", "items-page");
  u.searchParams.set("utm_campaign", "recommended-items");
  return u.toString();
}

function firstRelatedTitle(slugs: string[]): { title: string; href: string } | null {
  const [post] = resolveRelatedPosts(slugs);
  if (!post) return null;
  return { title: post.title, href: `/${post.category}/${post.slug}` };
}

function ItemCard({ item }: { item: RecommendedItem }) {
  const isOwn = item.source === "tokyoplants";
  const href = isOwn ? getTokyoplantsUrl(item.url!) : getAmazonUrl(item.asin!);
  const imageUrl = item.image ?? (isOwn ? undefined : getAmazonImageUrl(item.asin!));
  const related = firstRelatedTitle(item.relatedSlugs);

  return (
    <div
      className={`flex w-72 shrink-0 snap-start flex-col overflow-hidden rounded-2xl border ${
        isOwn ? "border-emerald-200 bg-white" : "border-amber-200 bg-white"
      }`}
    >
      <div className={`relative h-44 w-full ${isOwn ? "bg-emerald-50" : "bg-amber-50"}`}>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={item.title}
            className={`h-full w-full ${isOwn ? "object-cover" : "object-contain p-4"}`}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">🌿</div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${
            isOwn ? "bg-emerald-600" : "bg-amber-500"
          }`}
        >
          {isOwn ? "tokyoplants公式" : "Amazon"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[15px] font-bold leading-snug text-gray-900">{item.title}</p>
        {item.price && <p className="mt-0.5 text-sm font-bold text-gray-700">{item.price}</p>}
        <p className="mt-2 text-[13px] leading-relaxed text-gray-600">{item.reason}</p>

        {related && (
          <Link
            href={related.href}
            className="mt-2 text-xs text-teal-700 hover:text-teal-900 hover:underline"
          >
            {related.title} →
          </Link>
        )}

        <a
          href={href}
          target="_blank"
          rel={isOwn ? "noopener noreferrer" : "sponsored noopener noreferrer"}
          className={`mt-auto pt-4 inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-bold text-white transition-colors ${
            isOwn ? "bg-emerald-700 hover:bg-emerald-800" : "bg-amber-600 hover:bg-amber-700"
          }`}
        >
          {isOwn ? "tokyoplantsで見る →" : "Amazonで見る →"}
        </a>
      </div>
    </div>
  );
}

export default function RecommendedItemsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <nav className="mb-6 text-[13px] text-zinc-400">
        <Link href="/" className="hover:text-zinc-900 transition-colors">トップ</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-600">おすすめアイテム</span>
      </nav>

      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-teal-700">Recommended Items</p>
      <h1 className="mt-2 text-2xl md:text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">
        tokyoplantsのおすすめアイテム
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-zinc-600">
        このページは、tokyoplants MEDIAの記事内で実際に紹介・検証した道具の中から、編集部が用途別に厳選したものだけをまとめています。網羅的な商品一覧ではなく、「記事で本当に勧めているもの」だけを掲載する方針です。各商品には、選定の根拠になった記事へのリンクを添えています。
      </p>

      {/* tokyoplants公式アイテム */}
      <section className="mt-12">
        <h2 className="text-xl font-extrabold tracking-tight text-gray-900">tokyoplants公式アイテム</h2>
        <p className="mt-1 text-[13px] text-gray-500">tokyoplantsが自社で開発・販売している商品</p>
        <div className="mt-5 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
          {RECOMMENDED_OWN_ITEMS.map((item) => (
            <ItemCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      {/* 用途別セクション */}
      {RECOMMENDED_SECTIONS.map((section) => (
        <section key={section.id} id={section.id} className="mt-14 scroll-mt-24">
          <h2 className="text-xl font-extrabold tracking-tight text-gray-900">{section.title}</h2>
          <p className="mt-1 text-[13px] text-gray-500">{section.description}</p>
          <div className="mt-5 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
            {section.items.map((item) => (
              <ItemCard key={item.title} item={item} />
            ))}
          </div>
        </section>
      ))}

      <div className="mt-16 rounded-xl border border-gray-100 bg-gray-50/60 p-5 text-xs leading-relaxed text-gray-500">
        掲載商品は、tokyoplants MEDIAの商品選定基準（評価★3.2以上・レビュー10件以上・在庫あり等）を満たすものの中から編集部が選んでいます。最終更新日: 2026-09-09
        <br />
        ※本ページにはAmazonアソシエイトリンクを含みます。
      </div>
    </div>
  );
}
