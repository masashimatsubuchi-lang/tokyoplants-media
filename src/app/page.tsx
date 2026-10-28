import type { Metadata } from "next";
import StoreHome from "@/components/home/StoreHome";

// トップだけのタイトル・説明文・シェア画像（2026-10-28 商品発見型への刷新に合わせて変更）。
// シェア画像は自社4商品の写真をサイトのカードと同じ見せ方で並べたもの。
const TITLE = "観葉植物の専門店がつくった土と道具、育て方と図鑑 | tokyoplants media";
const DESCRIPTION =
  "観葉植物専門店tokyoplantsのメディア。I'm original SOIL（tokyoplantsプレミアム培養土）など自社の土と道具、育て方・植物図鑑の記事、記事で人気の道具ランキングを掲載。";
const OG_IMAGE = { url: "/images/og-home.jpg", width: 1200, height: 630, alt: "tokyoplantsの培養土・無機培地・リーフタオル・レザー作品" };

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "tokyoplants media",
    locale: "ja_JP",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

export default function Home() {
  return <StoreHome />;
}
