import products from "@/data/shop-search-products.json";
import type { BaseProduct } from "@/lib/posts";

/**
 * 図鑑記事などに「tokyoplants で販売中の株」を出すためのデータ。
 *
 * 商品は src/data/shop-search-products.json（scripts/build-shop-search-index.mjs が BASE API から作る。
 * 公開してよい項目だけ: ID・名前・価格・販売中か・代表画像）から取る。BASE の鍵はサイトに置かない。
 * 記事の baseProducts に品種カテゴリ（/categories/{ID}）があれば、その属の販売中の株を名前で探す。
 * BASE の商品データにはカテゴリが入っていないので、商品名の学名（属名）で照合する。
 */

interface IndexedProduct {
  id: number;
  name: string;
  price: number | null;
  available: boolean;
  image: string | null;
}

interface Genus {
  /** 表示用の和名 */
  label: string;
  /** 商品名の先頭付近に出る学名（属名）。どれかが単語として含まれれば対象 */
  latin: string[];
}

// ECの【品種】で探すカテゴリ（reference_ec_category_ids）。ブロメリア・その他は属が一定しないので出さない
const GENUS_BY_CATEGORY: Record<string, Genus> = {
  "6382096": { label: "アロカシア", latin: ["Alocasia"] },
  "6382097": { label: "アンスリウム", latin: ["Anthurium"] },
  "6382098": { label: "アグラオネマ", latin: ["Aglaonema"] },
  "6382099": { label: "ステファニア", latin: ["Stephania"] },
  "6382100": { label: "フィロデンドロン", latin: ["Philodendron"] },
  "6382102": { label: "モンステラ", latin: ["Monstera"] },
  "6382103": { label: "ビカクシダ", latin: ["Platycerium"] },
  "6382104": { label: "ジュエルオーキッド", latin: ["Macodes", "Ludisia", "Anoectochilus", "Goodyera", "Dossinia"] },
  "7114659": { label: "ベゴニア", latin: ["Begonia"] },
};

// 植物ではない商品（レザー作品・雑貨など）。名前に属名が入っていても株ではない
const NOT_A_PLANT = /SISHICRAFT|Leather|レザー|キーホルダー|しおり|Bookmark|Towel|タオル|Rug|ラグ|Socks|ソックス/i;

export interface StockItem {
  id: number;
  /** 学名の部分（例: Alocasia 'Holy Grail'） */
  latinName: string;
  /** 和名の部分（例: アロカシア・ホーリーグレイル③） */
  japaneseName: string;
  price: string;
  image: string | null;
  url: string;
}

export interface ShopStock {
  genusLabel: string;
  categoryUrl: string;
  items: StockItem[];
  /** 記事の品種と同じ株が1つも無い（別の品種だけを並べている）。属の解説記事（genus-）では常に false */
  otherVarietiesOnly: boolean;
}

function splitName(name: string): { latinName: string; japaneseName: string } {
  const parts = name
    .replace(/^<[^>]*>\s*/, "") // <SELECT STOCK> など
    .split(/[｜│|]/)
    .map((s) => s.trim())
    .filter(Boolean);
  return { latinName: parts[0] ?? name, japaneseName: parts[1] ?? "" };
}

/** BASE の画像は ?im=Resize で縮小できる（元画像は数百KBある） */
function smallImage(url: string | null): string | null {
  if (!url) return null;
  const base = url.replace(/\?.*$/, "");
  return `${base}?imformat=generic&q=85&im=Resize,width=360,type=normal`;
}

/**
 * 記事の baseProducts から品種カテゴリを見つけ（図鑑記事はスラッグの属名でも）、その属の販売中の株を返す。
 * 記事のスラッグに含まれる語（例: holy-grail）と名前が合う株を先に並べる。
 */
export function getShopStock(
  baseProducts: BaseProduct[] | undefined,
  slug: string,
  category: string,
  limit = 4,
): ShopStock | null {
  let categoryUrl = baseProducts
    ?.map((p) => p.url)
    .find((u) => /\/categories\/\d+/.test(u) && GENUS_BY_CATEGORY[u.match(/\/categories\/(\d+)/)![1]]);
  // 図鑑記事は baseProducts が土や個別の株を指していることがあるので、スラッグの属名（alocasia-venom、genus-alocasia）でも判定する
  if (!categoryUrl && category === "species") {
    const head = slug.replace(/^genus-/, "").split("-")[0];
    const id = Object.keys(GENUS_BY_CATEGORY).find((k) => GENUS_BY_CATEGORY[k].latin.some((l) => l.toLowerCase() === head));
    if (id) categoryUrl = `https://www.tokyoplants.com/categories/${id}`;
  }
  if (!categoryUrl) return null;
  const genus = GENUS_BY_CATEGORY[categoryUrl.match(/\/categories\/(\d+)/)![1]];
  const genusRe = new RegExp(`\\b(${genus.latin.join("|")})\\b`, "i");
  const words = slug
    .toLowerCase()
    .split("-")
    .filter((w) => w.length >= 3 && !genus.latin.some((l) => l.toLowerCase() === w) && !["genus", "care", "guide"].includes(w));

  const scored = (products.products as IndexedProduct[])
    .filter((p) => p.available && genusRe.test(p.name) && !NOT_A_PLANT.test(p.name))
    .map((p) => {
      const name = p.name.toLowerCase().replace(/[^a-z0-9]+/g, " ");
      const score = words.filter((w) => name.includes(w)).length;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score || (a.p.price ?? 0) - (b.p.price ?? 0))
    .slice(0, limit);
  const otherVarietiesOnly = !slug.startsWith("genus-") && words.length > 0 && scored.every((x) => x.score === 0);
  const items = scored.map(({ p }) => {
      const u = new URL(`https://www.tokyoplants.com/items/${p.id}`);
      u.searchParams.set("utm_source", "media");
      u.searchParams.set("utm_medium", "article");
      u.searchParams.set("utm_campaign", "plant-stock");
      u.searchParams.set("utm_content", "stock");
      return {
        id: p.id,
        ...splitName(p.name),
        price: p.price ? `¥${p.price.toLocaleString("ja-JP")}` : "",
        image: smallImage(p.image),
        url: u.toString(),
      };
    });
  if (items.length === 0) return null;
  const cat = new URL(categoryUrl);
  cat.searchParams.set("utm_source", "media");
  cat.searchParams.set("utm_medium", "article");
  cat.searchParams.set("utm_campaign", "plant-stock");
  cat.searchParams.set("utm_content", "stock");
  return { genusLabel: genus.label, categoryUrl: cat.toString(), items, otherVarietiesOnly };
}
