import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";
import { searchAll, SearchCategory, SearchProduct } from "@/lib/shopSearch";
import staticProducts from "@/data/shop-search-products.json";
import aliases from "@/data/plant-name-aliases.json";

/**
 * ショップの検索窓（BASE テーマの JS）から呼ぶ横断検索。GET /api/shop-search?q=モンステラ
 * 商品は環境変数 BASE_API_TOKEN（items.read の PAT）があれば BASE から取り（10分キャッシュ）、
 * 無ければ scripts/build-shop-search-index.mjs で作った索引を使う。
 */

// ショップの本番とプレビュー（HTML編集App）からだけ呼べるようにする
const ALLOWED_ORIGINS = ["https://www.tokyoplants.com", "https://tokyoplants.com", "https://admin.thebase.com"];

// BASE のカテゴリー。keys は学名・和名・よくある表記ゆれ
const CATEGORIES: SearchCategory[] = [
  { id: "6382097", name: "アンスリウム / Anthurium", keys: ["Anthurium", "アンスリウム", "アンスリューム"] },
  { id: "6382096", name: "アロカシア / Alocasia", keys: ["Alocasia", "アロカシア"] },
  { id: "6382102", name: "モンステラ / Monstera", keys: ["Monstera", "モンステラ"] },
  { id: "6382100", name: "フィロデンドロン / Philodendron", keys: ["Philodendron", "フィロデンドロン"] },
  { id: "6382099", name: "ステファニア / Stephania", keys: ["Stephania", "ステファニア", "ステファニヤ"] },
  { id: "6382103", name: "ビカクシダ / Platycerium", keys: ["Platycerium", "ビカクシダ", "コウモリラン"] },
  { id: "7114659", name: "ベゴニア / Begonia", keys: ["Begonia", "ベゴニア"] },
  { id: "6382098", name: "アグラオネマ / Aglaonema", keys: ["Aglaonema", "アグラオネマ"] },
  { id: "6382104", name: "ジュエルオーキッド / Jewel Orchid", keys: ["Jewel Orchid", "ジュエルオーキッド", "Macodes", "マコデス"] },
  { id: "6820321", name: "観葉植物の土", keys: ["土", "用土", "培養土", "SOIL", "ソイル", "HYDRO MINERAL", "ハイドロ"] },
  { id: "7318231", name: "SISHICRAFT｜Leather Botanical", keys: ["SISHICRAFT", "レザー", "革", "キーホルダー", "しおり"] },
];

async function loadProducts(): Promise<SearchProduct[]> {
  const token = process.env.BASE_API_TOKEN;
  if (!token) return staticProducts.products as SearchProduct[];
  try {
    const all: SearchProduct[] = [];
    for (let offset = 0; offset < 2000; offset += 100) {
      const res = await fetch(`https://apiv2.thebase.com/api/items?limit=100&offset=${offset}&visible=true`, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 600 },
      });
      if (!res.ok) throw new Error(String(res.status));
      const page: { id: number; name: string; price: number | null; stock: number; sales_status: string; images?: { url: string }[] }[] = await res.json();
      all.push(...page.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        available: i.sales_status === "item_now_on_sale" && i.stock > 0,
        image: i.images?.[0]?.url ?? null,
      })));
      if (page.length < 100) break;
    }
    return all;
  } catch {
    return staticProducts.products as SearchProduct[];
  }
}

function corsHeaders(origin: string | null): Record<string, string> {
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) return {};
  return { "Access-Control-Allow-Origin": origin, Vary: "Origin" };
}

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") || "").slice(0, 80);
  const includeSoldOut = request.nextUrl.searchParams.get("soldout") === "1";
  const articles = getAllPosts().map((p) => ({
    path: `/${p.category}/${p.slug}`,
    title: p.title,
    description: p.description,
    image: p.image,
  }));
  const result = searchAll(q, { products: await loadProducts(), categories: CATEGORIES, articles, aliases }, { includeSoldOut });
  return NextResponse.json(result, {
    headers: { ...corsHeaders(request.headers.get("origin")), "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
