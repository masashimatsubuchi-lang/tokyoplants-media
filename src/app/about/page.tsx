import { Metadata } from "next";
import Link from "next/link";

const PAGE_TITLE = "tokyoplants MEDIAについて";
const PAGE_DESCRIPTION =
  "tokyoplants MEDIAは、観葉植物専門店tokyoplantsが運営する観葉植物専門メディアです。育て方・土選び・図鑑・レビューを、専門店としての知見とファクトチェックに基づいてお届けします。";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: "/about",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

export default function AboutPage() {
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: PAGE_TITLE,
    url: "https://media.tokyoplants.com/about",
    mainEntity: {
      "@type": "Organization",
      name: "tokyoplants",
      url: "https://www.tokyoplants.com",
      sameAs: [
        "https://media.tokyoplants.com",
        "https://www.instagram.com/tokyoplants.jp",
      ],
    },
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-teal-700">About</p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">tokyoplants MEDIAについて</h1>

      <div className="mt-6 space-y-4 leading-relaxed text-gray-600">
        <p>
          tokyoplants MEDIAは、観葉植物専門店<strong className="text-gray-900">tokyoplants</strong>が運営する観葉植物の専門メディアです。育て方・用土の選び方・植物図鑑・園芸用品のレビューまで、初心者の方から上級者の方まで役立つ情報を発信しています。
        </p>
        <p>
          店舗で日々植物と向き合う専門店だからこそ得られる知見をもとに記事を制作し、公開後も情報の正確性を継続的に確認しています。固有の商品名や資材を扱う際は、メーカー公式サイトや販売ページなど一次情報を直接確認したうえで執筆する方針を徹底しています。
        </p>
        <p>
          運営元のtokyoplantsは、観葉植物専門の培養土「I&apos;m original SOIL」やリーフタオルなどの園芸用品を扱うオンラインストアも運営しています。あわせて、観葉植物のお世話と成長記録を楽しめるiPhoneアプリ「Green Collection」も開発・提供しています。
        </p>
      </div>

      <div className="mt-10 border-t border-gray-200 pt-8">
        <h2 className="text-lg font-bold text-gray-900">運営者情報</h2>
        <dl className="mt-4 space-y-3 text-sm text-gray-600">
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
            <dt className="shrink-0 font-semibold text-gray-900 sm:w-28">運営</dt>
            <dd>tokyoplants</dd>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
            <dt className="shrink-0 font-semibold text-gray-900 sm:w-28">執筆・編集</dt>
            <dd>tokyoplants 編集部</dd>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
            <dt className="shrink-0 font-semibold text-gray-900 sm:w-28">オンラインストア</dt>
            <dd>
              <a
                href="https://www.tokyoplants.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 underline-offset-4 hover:underline"
              >
                www.tokyoplants.com
              </a>
            </dd>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
            <dt className="shrink-0 font-semibold text-gray-900 sm:w-28">アプリ</dt>
            <dd>
              <Link href="/app" className="text-teal-700 underline-offset-4 hover:underline">
                Green Collection（観葉植物のお世話・成長記録アプリ）
              </Link>
            </dd>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
            <dt className="shrink-0 font-semibold text-gray-900 sm:w-28">Instagram</dt>
            <dd>
              <a
                href="https://www.instagram.com/tokyoplants.jp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 underline-offset-4 hover:underline"
              >
                @tokyoplants.jp
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
