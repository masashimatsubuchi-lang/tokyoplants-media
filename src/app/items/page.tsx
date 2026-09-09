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
  const imageUrl = isOwn ? undefined : getAmazonImageUrl(item.asin!);
  const related = firstRelatedTitle(item.relatedSlugs);

  return (
    <div
      className={`flex flex-col rounded-2xl border p-5 ${
        isOwn
          ? "border-emerald-200 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30"
          : "border-amber-200 bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white ${
            isOwn ? "border-emerald-100" : "border-amber-100"
          }`}
        >
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="" className="h-full w-full object-contain" loading="lazy" />
          ) : (
            <span className="text-2xl">🌿</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
              isOwn ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"
            }`}
          >
            {isOwn ? "tokyoplants公式" : "Amazon"}
          </span>
          <p className="mt-1 text-[15px] font-bold leading-snug text-gray-900">{item.title}</p>
          {item.price && <p className="mt-0.5 text-sm font-bold text-gray-700">{item.price}</p>}
        </div>
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-gray-600">{item.reason}</p>

      {related && (
        <Link
          href={related.href}
          className="mt-3 text-xs font-semibold text-teal-700 hover:text-teal-900 hover:underline"
        >
          この商品が登場する記事: {related.title} →
        </Link>
      )}

      <a
        href={href}
        target="_blank"
        rel={isOwn ? "noopener noreferrer" : "sponsored noopener noreferrer"}
        className={`mt-4 inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-bold text-white transition-colors ${
          isOwn ? "bg-emerald-700 hover:bg-emerald-800" : "bg-amber-600 hover:bg-amber-700"
        }`}
      >
        {isOwn ? "tokyoplantsで見る →" : "Amazonで見る →"}
      </a>
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

      <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/60 p-4 text-xs leading-relaxed text-gray-500">
        ※本ページにはAmazonアソシエイトリンクを含みます。価格・在庫・レビュー件数は変動するため、購入前に必ず商品ページで最新情報をご確認ください。
      </div>

      {/* tokyoplants公式アイテム */}
      <section className="mt-12">
        <h2 className="text-xl font-extrabold tracking-tight text-gray-900">tokyoplants公式アイテム</h2>
        <p className="mt-1 text-[13px] text-gray-500">tokyoplantsが自社で開発・販売している商品</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map((item) => (
              <ItemCard key={item.title} item={item} />
            ))}
          </div>
        </section>
      ))}

      <div className="mt-16 rounded-xl border border-gray-100 bg-gray-50/60 p-5 text-xs leading-relaxed text-gray-500">
        掲載商品は、tokyoplants MEDIAの商品選定基準（評価★3.2以上・レビュー10件以上・在庫あり等）を満たすものの中から編集部が選んでいます。最終更新日: 2026-09-09
      </div>
    </div>
  );
}
