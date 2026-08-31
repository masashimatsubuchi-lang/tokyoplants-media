import { BaseProduct } from "@/lib/posts";

interface Props {
  products: BaseProduct[];
}

type ProductType = "soil" | "hydro" | "warocqueanum" | "regale" | "holygrail" | "towel";

interface ProductMeta {
  label: string;
  note: string;
  img: string;
  heading: string;
}

const PRODUCT_META: Record<ProductType, ProductMeta> = {
  towel: {
    heading: "tokyoplants のおすすめギフト",
    label: "Daily Botanical Towel｜リーフタオル",
    note: "ボタニカルデザインのマイクロファイバー素材。吸水性・速乾性に優れ、植物好きへのギフトに。",
    img: "/images/products/botanical-towel-main.jpg",
  },
  holygrail: {
    heading: "tokyoplants で購入できます",
    label: "Alocasia 'Holy Grail'",
    note: "深みのある濃色葉と隆起した葉脈。光で変わるメタリック質感。水苔植え・SELECT STOCK。",
    img: "/images/products/alocasia-holy-grail-group.jpg",
  },
  soil: {
    heading: "この記事で使う用土",
    label: "I'm original SOIL",
    note: "この記事の配合に対応したオリジナル用土。6種天然素材・化学肥料不使用。",
    img: "/images/products/im-original-soil-main.jpg",
  },
  hydro: {
    heading: "この記事で使う培地",
    label: "HYDRO MINERAL 2L",
    note: "溶岩石×ゼオライトの無機培地。ハイドロ・底面給水に最適。",
    img: "/images/products/hydro-mineral-main.jpg",
  },
  warocqueanum: {
    heading: "tokyoplants で購入できます",
    label: "Anthurium Warocqueanum",
    note: "深緑のベルベット葉に白銀の葉脈。水苔植え・SELECT STOCK。",
    img: "/images/products/anthurium-warocqueanum-group.jpg",
  },
  regale: {
    heading: "tokyoplants で購入できます",
    label: "Anthurium Regale",
    note: "横幅のある重厚なベルベット葉と白い葉脈のコントラスト。水苔植え・SELECT STOCK。",
    img: "/images/products/anthurium-regale-group.jpg",
  },
};

function detectType(product: BaseProduct): ProductType | null {
  if (product.url.includes("/items/135803882") || product.title.includes("Daily Botanical Towel") || product.title.includes("リーフタオル")) return "towel";
  if (product.url.includes("/items/144787813") || product.title.includes("Holy Grail") || product.title.includes("ホーリーグレイル")) return "holygrail";
  if (product.url.includes("/items/94920117") || product.title.includes("Warocqueanum") || product.title.includes("ワロクアーナム")) return "warocqueanum";
  if (product.url.includes("/items/94918874") || product.title.includes("Regale") || product.title.includes("レガレ")) return "regale";
  if (product.url.includes("/items/99620939") || product.title.includes("I'm original SOIL")) return "soil";
  if (product.url.includes("/items/142692278") || product.title.includes("HYDRO MINERAL")) return "hydro";
  return null;
}

/** バナーに表示する商品を優先順で1件選ぶ（植物 > 土 > ハイドロ） */
function pickPrimary(products: BaseProduct[]): { product: BaseProduct; type: ProductType; meta: ProductMeta } | null {
  const priority: ProductType[] = ["towel", "holygrail", "warocqueanum", "regale", "hydro", "soil"];
  for (const ptype of priority) {
    const found = products.find((p) => detectType(p) === ptype);
    if (found) return { product: found, type: ptype, meta: PRODUCT_META[ptype] };
  }
  return null;
}

export function hasInlineProduct(products?: BaseProduct[]): boolean {
  if (!products || products.length === 0) return false;
  return products.some((p) => detectType(p) !== null);
}

export default function InlineProductBanner({ products }: Props) {
  const primary = pickPrimary(products);
  if (!primary) return null;

  const { product, type: productType, meta } = primary;
  const isSoldOut = product.price === "SOLD OUT";
  const campaignMap: Record<string, string> = { soil: "original-soil", hydro: "hydro-mineral", towel: "botanical-towel" };
  const productUrl = (() => { const u = new URL(product.url); u.searchParams.set("utm_source","media"); u.searchParams.set("utm_medium","article"); u.searchParams.set("utm_campaign", campaignMap[productType] ?? "other"); return u.toString(); })();

  return (
    <div className="not-prose my-8 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-1">
      <p className="px-4 pt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">
        Pick Up — {meta.heading}
      </p>
      <div className="mt-1 p-2">
        <a
          href={productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`group flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border bg-white px-4 py-3 transition-all ${
            isSoldOut
              ? "border-gray-200 cursor-not-allowed opacity-60"
              : "border-emerald-100 hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md"
          }`}
        >
          {/* Thumbnail + Text row */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Thumbnail */}
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-emerald-100">
              <img
                src={meta.img}
                alt={meta.label}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-gray-900">{meta.label}</p>
              <p className="mt-0.5 text-[12px] leading-snug text-gray-500 line-clamp-2">{meta.note}</p>
            </div>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between sm:flex-col sm:items-end shrink-0">
            {product.price && !isSoldOut && (
              <p className="text-base font-extrabold text-emerald-700">{product.price}</p>
            )}
            {isSoldOut ? (
              <span className="inline-block rounded-full bg-gray-400 px-3 py-1 text-[11px] font-bold text-white">
                SOLD OUT
              </span>
            ) : (
              <span className="inline-block rounded-full bg-emerald-600 px-4 py-2 text-[12px] font-bold text-white transition-colors group-hover:bg-emerald-700">
                購入する →
              </span>
            )}
          </div>
        </a>
      </div>
    </div>
  );
}
