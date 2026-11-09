import { Metadata } from "next";
import Link from "next/link";
import {
  RECOMMENDED_OWN_ITEMS,
  RECOMMENDED_SECTIONS,
  RecommendedItem,
} from "@/lib/recommendedItems";
import { resolveRelatedPosts } from "@/lib/posts";
import { amazonPrice } from "@/lib/amazonDisplay";
import { FaqItem } from "@/lib/faq";
import FaqJsonLd from "@/components/FaqJsonLd";

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

// 自社商品の構造化データ（AI検索・検索エンジンが商品として読めるように）。事実は BASE の商品説明（2026-11-04 時点）
// 価格を変えたら public/llms.txt と recommendedItems.ts も直す
const SITE = "https://media.tokyoplants.com";
const OWN_PRODUCTS = [
  {
    name: "I'm original SOIL（tokyoplantsプレミアム培養土）",
    url: "https://www.tokyoplants.com/items/99620939",
    image: "/images/products/im-original-soil-main.jpg",
    description:
      "観葉植物用の培養土。天然ヤシの繊維30%・日向石20%・蘭の発酵樹皮20%・ミミズ堆肥10%・ピートモス10%・パーライト10%。粗めの粒で通気性と水はけがよく、アンスリウム・モンステラなどサトイモ科の熱帯植物向け。2L・10L。",
    low: 1200,
    high: 4800,
    availability: "InStock",
  },
  {
    name: "HYDRO MINERAL 2L",
    url: "https://www.tokyoplants.com/items/142692278",
    image: "/images/products/hydro-mineral-main.jpg",
    description:
      "土を使わない無機用土。富士山の溶岩石75%・島根県産ゼオライト25%に緩効性肥料0.5%配合で、約8〜9ヶ月は水だけで育てられる。ハイドロカルチャー・底面給水鉢向け。",
    low: 1480,
    availability: "InStock",
  },
  {
    name: "Daily Botanical Towel",
    url: "https://www.tokyoplants.com/items/135803882",
    image: "/images/products/botanical-towel-door.jpg",
    description:
      "モンステラ・アンスリウム・アロカシアの葉の形をしたマイクロファイバーのタオル（約30×20cm、全8種）。植物好きへのギフトに。",
    low: 2000,
    availability: "InStock",
  },
  {
    name: "Daily Botanical Socks（MONSTERA MONDAY）",
    url: "https://www.tokyoplants.com/items/164953353",
    image: "/images/products/botanical-socks-main.jpg",
    description:
      "モンステラの葉を編み込んだグリーンのソックス。ユニセックス2サイズ（S/M 22〜25cm、M/L 25〜28cm）、コーマコットン使用、紙製パッケージ入り。",
    low: 2000,
    availability: "InStock",
  },
  {
    name: "Leather Botanical Collection（SISHICRAFT × tokyoplants）",
    url: "https://www.tokyoplants.com/categories/7318231",
    image: "/images/products/leather-botanical-monstera-pot.jpg",
    description:
      "台湾のレザーアーティストSISHICRAFTによる、植物タンニン鞣しレザーの「革の植物」。斑入りモンステラ（3枚葉・高さ約15cm）と、気根まで革で表現したタイコンステレーション。予約販売。",
    low: 19800,
    high: 29800,
    availability: "PreOrder",
  },
];

const ITEMS_FAQ: FaqItem[] = [
  {
    question: "観葉植物の土は、I'm original SOIL と HYDRO MINERAL のどちらを選べばいいですか？",
    answer:
      "ふつうの鉢でアンスリウム・モンステラなどを育てるなら I'm original SOIL（有機質と軽石をブレンドした培養土）、ハイドロカルチャーや底面給水鉢で育てたい・虫を避けたいなら HYDRO MINERAL（溶岩石とゼオライトの無機用土、肥料入り）が向いています。",
  },
  {
    question: "I'm original SOIL のサイズと価格は？",
    answer: "2L が1,200円、10L が4,800円（いずれも税込）です。10L は2L×5袋分が4袋分の価格です。",
  },
  {
    question: "観葉植物が好きな人へのプレゼントには何がいいですか？",
    answer:
      "葉の形をしたタオル「Daily Botanical Towel」（2,000円〜、3枚・6枚・全8種のセットあり）、モンステラ柄のソックス「Daily Botanical Socks」（2,000円）、革で作られた植物「Leather Botanical Collection」（19,800円〜）があります。ギフトバッグ（1袋300円）でお包みできます。",
  },
  {
    question: "どこで買えますか？",
    answer: "tokyoplants オンラインストア（https://www.tokyoplants.com）で購入できます。",
  },
];

const itemsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "tokyoplants公式アイテム",
  itemListElement: OWN_PRODUCTS.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Product",
      name: p.name,
      url: p.url,
      image: SITE + p.image,
      description: p.description,
      brand: { "@type": "Brand", name: "tokyoplants" },
      offers: p.high
        ? { "@type": "AggregateOffer", priceCurrency: "JPY", lowPrice: p.low, highPrice: p.high, availability: `https://schema.org/${p.availability}`, url: p.url }
        : { "@type": "Offer", priceCurrency: "JPY", price: p.low, availability: `https://schema.org/${p.availability}`, url: p.url },
    },
  })),
};

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
  const price = isOwn ? item.price : amazonPrice(item.price);
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
        {/* Amazon商品の価格は表示しない（SHOW_AMAZON_PRICES）。自社商品は出す */}
        {price && <p className="mt-0.5 text-sm font-bold text-gray-700">{price}</p>}
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
        記事の中で実際に使って、良かったものだけを集めました。植え替える・育てる・環境を整えるなど、用途別にまとめています。気になったら紹介記事もあわせてチェックしてみてください。
      </p>

      {/* tokyoplants公式アイテム */}
      <section className="mt-10">
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

      <section className="mt-16">
        <h2 className="text-xl font-extrabold tracking-tight text-gray-900">よくある質問</h2>
        <div className="mt-4 divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white">
          {ITEMS_FAQ.map((f) => (
            <details key={f.question} className="group p-5">
              <summary className="cursor-pointer list-none text-[15px] font-bold text-gray-900">{f.question}</summary>
              <p className="mt-2 text-[14px] leading-relaxed text-gray-600">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemsJsonLd) }} />
      <FaqJsonLd faqs={ITEMS_FAQ} />

      <div className="mt-16 rounded-xl border border-gray-100 bg-gray-50/60 p-5 text-xs leading-relaxed text-gray-500">
        掲載商品は、tokyoplants MEDIAの商品選定基準（評価★3.2以上・レビュー10件以上・在庫あり等）を満たすものの中から編集部が選んでいます。最終更新日: 2026-11-04
        <br />
        ※本ページにはAmazonアソシエイトリンクを含みます。
      </div>
    </div>
  );
}
