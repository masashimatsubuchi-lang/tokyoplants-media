import Link from "@/components/Link";
import { getPostsByCategory } from "@/lib/posts";
import { ecUrl } from "@/lib/homeStorefront";
import FeatureBannerSlides, { type Slide } from "./FeatureBannerSlides";

// トップの先頭に出す新入荷のバナー（2026-11-27 八幡化成 Sen）。
// 価格は BASE の値（S ¥2,600・M ¥3,800、2026-11-27 API で確認）。BASE で価格を変えたらここも直す。
// 紹介記事（review/sen-roly-pot）が公開されていれば「記事を読む」を出す。
const ARTICLE = { category: "review", slug: "sen-roly-pot" } as const;

// 写真はオーナー指定の5枚（メーカー提供、2026-11-27）。先頭が最初に表示される
const SLIDES: Slide[] = [
  { src: "/images/home/sen/orchid.jpg", alt: "ブラックの Sen ローリーポットと同じ色の受け皿に植えた白い胡蝶蘭" },
  { src: "/images/home/sen/hanging.jpg", alt: "専用ロープで吊るしたグレーの Sen ローリーポットとつる性の観葉植物" },
  { src: "/images/home/sen/sink.jpg", alt: "グレーの Sen ローリーポットに植えた斑入りの観葉植物を手に持つ様子" },
  { src: "/images/home/sen/stand-orchid.jpg", alt: "ゴールドのチアーズスタンドにのせた Sen ローリーポットと小さな胡蝶蘭" },
  { src: "/images/home/sen/lineup.jpg", alt: "スタンドと受け皿に置いた Sen ローリーポットが並ぶ様子" },
];

export default function FeatureBanner() {
  const article = getPostsByCategory(ARTICLE.category).some((p) => p.slug === ARTICLE.slug);
  return (
    <div className="mx-auto mt-8 max-w-[1180px] overflow-hidden rounded-[28px] bg-white md:mt-10">
      <div className="flex flex-col md:flex-row">
        {/* 写真。スマホは上、PCは右。数秒ごとに切り替わる（サボテン・多肉の写真は使わない：オーナー指示 2026-11-27） */}
        <div className="md:order-2 md:min-h-[440px] md:w-[58%]">
          <FeatureBannerSlides slides={SLIDES} href={ecUrl("/categories/7903585", "banner-sen-photo")} />
        </div>
        <div className="flex flex-col justify-center px-6 pb-8 pt-6 md:order-1 md:w-[42%] md:px-12 md:py-12">
          <p className="text-[12px] font-semibold tracking-[0.08em] text-[#bf4800]">NEW ARRIVAL</p>
          <p className="mt-2 text-[14px] font-semibold text-[#6e6e73]">Sen ローリーポット｜八幡化成</p>
          <h2 className="mt-2 text-[28px] font-semibold leading-[1.2] tracking-[-0.015em] text-[#1d1d1f] md:text-[36px]">
            光と風が通う、
            <br />
            まるい鉢。
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[#424245] [word-break:auto-phrase]">
            スリットの入ったまるい鉢と、同じ色の受け皿のセット。iF DESIGN AWARD 2026・Red Dot Design Award 2026 受賞。
          </p>
          <dl className="mt-5 flex flex-wrap gap-2 text-[13px]">
            <div className="flex items-baseline gap-1.5 rounded-full bg-[#f5f5f7] px-3.5 py-1.5">
              <dt className="font-semibold">S</dt>
              <dd>¥2,600</dd>
            </div>
            <div className="flex items-baseline gap-1.5 rounded-full bg-[#f5f5f7] px-3.5 py-1.5">
              <dt className="font-semibold">M</dt>
              <dd>¥3,800</dd>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-[#f5f5f7] px-3.5 py-1.5">
              <dt className="sr-only">カラー</dt>
              <dd className="flex items-center gap-1.5">
                <span aria-hidden className="inline-block h-3 w-3 rounded-full bg-[#2b2b2b]" />
                <span aria-hidden className="inline-block h-3 w-3 rounded-full bg-[#9a9c9e]" />
                ブラック・グレー
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-[12px] text-[#6e6e73]">専用のスタンド（S用）・吊り鉢ロープもあります。</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={ecUrl("/categories/7903585", "banner-sen")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#16352A] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#0f261e]"
            >
              ショップで見る
            </a>
            {article && (
              <Link href={`/${ARTICLE.category}/${ARTICLE.slug}`} className="text-[14px] font-semibold text-[#2c6e52] hover:underline">
                鉢の紹介を読む ›
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

