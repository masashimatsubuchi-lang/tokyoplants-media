import type { OwnProductType } from "@/lib/articleBlocks";
import type { BaseProduct } from "@/lib/posts";

/**
 * 本文の product-cards（src/lib/articleBlocks.ts）で出す自社商品。
 * 商品名・写真・一言はEC商品ページの記載どおり。価格は記事の baseProducts にあればそちらを使う
 * （商品ページの価格が変わったときに記事側の突合スクリプトで直せるように）。
 */
export interface OwnProduct {
  name: string;
  /** 商品名の下に出す一言（仕様の事実だけ） */
  spec: string;
  image: string;
  url: string;
  price: string;
  /** utm_campaign */
  campaign: string;
}

export const OWN_PRODUCTS: Record<OwnProductType, OwnProduct> = {
  soil: {
    name: "I'm original SOIL（tokyoplantsプレミアム培養土）",
    spec: "ヤシ繊維・日向石・発酵樹皮など6種の天然素材。粗めの粒、ジップ付き袋の2L／10L",
    image: "/images/products/im-original-soil-card.jpg",
    url: "https://www.tokyoplants.com/items/99620939",
    price: "¥1,200〜",
    campaign: "original-soil",
  },
  hydro: {
    name: "HYDRO MINERAL 2L｜溶岩石×ゼオライトの培地",
    spec: "富士山溶岩石75%＋島根県産ゼオライト25%、オスモコート配合の無機培地",
    image: "/images/products/hydro-mineral-card.jpg",
    url: "https://www.tokyoplants.com/items/142692278",
    price: "¥1,480",
    campaign: "hydro-mineral",
  },
  pot: {
    name: "MOCHI POT｜モチポット・3号",
    spec: "3Dプリントの鉢（PETG）。内側にメッシュ構造、高さのある受け皿つき。OLIVE／GRAY",
    image: "/images/products/mochi-pot-card.jpg",
    url: "https://www.tokyoplants.com/items/140571906",
    price: "¥1,500",
    campaign: "mochi-pot",
  },
};

/** baseProducts の中から、その自社商品の行を探す（価格を記事側の値に合わせるため） */
export function findOwnInBaseProducts(type: OwnProductType, products: BaseProduct[] = []): BaseProduct | undefined {
  const id = OWN_PRODUCTS[type].url.split("/items/")[1];
  return products.find((p) => p.url.includes(`/items/${id}`));
}

export function ownProductUrl(type: OwnProductType, placement: string): string {
  const u = new URL(OWN_PRODUCTS[type].url);
  u.searchParams.set("utm_source", "media");
  u.searchParams.set("utm_medium", "article");
  u.searchParams.set("utm_campaign", OWN_PRODUCTS[type].campaign);
  u.searchParams.set("utm_content", placement);
  return u.toString();
}
