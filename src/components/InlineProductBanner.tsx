import { BaseProduct } from "@/lib/posts";

interface Props {
  products: BaseProduct[];
}

type ProductType = "soil" | "hydro" | "warocqueanum" | "regale";

interface ProductMeta {
  label: string;
  note: string;
  img: string;
  heading: string;
}

const PRODUCT_META: Record<ProductType, ProductMeta> = {
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
  if (product.url.includes("/items/94920117") || product.title.includes("Warocqueanum") || product.title.includes("ワロクアーナム")) return "warocqueanum";
  if (product.url.includes("/items/94918874") || product.title.includes("Regale") || product.title.includes("レガレ")) return "regale";
  if (product.url.includes("/items/99620939") || product.title.includes("I'm original SOIL")) return "soil";
  if (product.url.includes("/items/142692278") || product.title.includes("HYDRO MINERAL")) return "hydro";
  return null;
}

/** バナーに表示する商品を優先順で1件選ぶ（植物 > 土 > ハイドロ） */
function pickPrimary(products: BaseProduct[]): { product: BaseProduct; type: ProductType; meta: ProductMeta } | null {
  const priority: ProductType[] = ["warocqueanum", "regale", "soil", "hydro"];
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

  const { product, meta } = primary;
  const isSoldOut = product.price === "SOLD OUT";

  return (
    <div className="not-prose my-8 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-1">
      <p className="px-4 pt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">
        Pick Up — {meta.heading}
      </p>
      <div className="mt-1 p-2">
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`group flex items-center gap-4 rounded-xl border bg-white px-4 py-3 transition-all ${
            isSoldOut
              ? "border-gray-200 cursor-not-allowed opacity-60"
              : "border-emerald-100 hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md"
          }`}
        >
          {/* Thumbnail */}
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-emerald-100">
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

          {/* Price + CTA */}
          <div className="shrink-0 text-right">
            {product.price && !isSoldOut && (
              <p className="text-base font-extrabold text-emerald-700">{product.price}</p>
            )}
            {isSoldOut ? (
              <span className="mt-1 inline-block rounded-full bg-gray-400 px-3 py-1 text-[11px] font-bold text-white">
                SOLD OUT
              </span>
            ) : (
              <span className="mt-1 inline-block rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white transition-colors group-hover:bg-emerald-700">
                購入する →
              </span>
            )}
          </div>
        </a>
      </div>
    </div>
  );
}
