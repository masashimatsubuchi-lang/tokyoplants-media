import { Metadata } from "next";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import { resolveRelatedPosts } from "@/lib/posts";
import { JOURNAL_APPROVED, JOURNAL_SECTIONS } from "@/lib/journalCuration";

const PAGE_TITLE = "Journal｜植物を迎える人のための厳選記事";
const PAGE_DESCRIPTION =
  "tokyoplants のショップで植物や培養土を選ぶ人のために、育て方・植物図鑑・用土の選び方の3つの軸で記事を厳選しました。届いた株を元気に育てるための読みものです。";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/journal" },
  // 掲載記事がオーナー承認前のうちは検索に出さない
  robots: JOURNAL_APPROVED ? undefined : { index: false, follow: true },
  openGraph: {
    type: "website",
    url: "/journal",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

// ショップへの導線。utm_content が ClickTracker の ec_click の placement になる
const SHOP_PLANTS_URL =
  "https://www.tokyoplants.com/categories/6382090?utm_source=media&utm_medium=journal&utm_campaign=shop_renewal&utm_content=journal-shop";

export default function JournalPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <nav className="mb-6 text-[13px] text-zinc-400">
        <Link href="/" className="hover:text-zinc-900 transition-colors">トップ</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-600">Journal</span>
      </nav>

      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#22614c]">Journal</p>
      <h1 className="mt-2 text-2xl md:text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">
        植物をもっと知る。
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-zinc-600">
        ショップで植物や培養土を選ぶ人のための読みもの。届いた株を元気に育てる方法、品種の特徴、根を守る土の選び方を集めました。
      </p>

      {JOURNAL_SECTIONS.map((section) => {
        const posts = resolveRelatedPosts(section.slugs);
        if (posts.length === 0) return null;
        return (
          <section key={section.id} className="mt-12" aria-labelledby={`journal-${section.id}`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#22614c]">{section.overline}</p>
            <h2 id={`journal-${section.id}`} className="mt-1 text-xl md:text-2xl font-bold text-zinc-900">
              {section.title}
            </h2>
            <p className="mt-2 text-[14px] text-zinc-600">{section.description}</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <ArticleCard key={`${post.category}/${post.slug}`} post={post} imageWidth={600} />
              ))}
            </div>
            {section.shopLink && (
              <a
                href={section.shopLink.url}
                className="mt-6 inline-flex items-center rounded-full border border-[#22614c] px-5 py-2.5 text-sm font-bold text-[#22614c] hover:bg-[#22614c] hover:text-white transition-colors"
              >
                {section.shopLink.label} →
              </a>
            )}
          </section>
        );
      })}

      <section className="mt-16 rounded-2xl bg-[#edf2ee] px-6 py-8 md:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#22614c]">Shop</p>
        <p className="mt-2 text-lg font-bold text-zinc-900">写真の個体をそのままお届けする、希少な観葉植物。</p>
        <a
          href={SHOP_PLANTS_URL}
          className="mt-4 inline-flex items-center rounded-full bg-[#22614c] px-5 py-2.5 text-sm font-bold text-white hover:opacity-90"
        >
          ショップで植物を見る →
        </a>
      </section>
    </div>
  );
}
