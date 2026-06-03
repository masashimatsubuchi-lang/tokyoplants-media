import { BaseProduct } from "@/lib/posts";

interface Props {
  products: BaseProduct[];
}

const SOIL_COPY: Record<string, { label: string; note: string; img: string }> = {
  soil: {
    label: "I'm original SOIL",
    note: "この記事の配合に対応したオリジナル用土。6種天然素材・化学肥料不使用。",
    img: "/images/products/im-original-soil-main.jpg",
  },
  hydro: {
    label: "HYDRO MINERAL 2L",
    note: "溶岩石×ゼオライトの無機培地。ハイドロ・底面給水に最適。",
    img: "/images/products/hydro-mineral-main.jpg",
  },
};

function detectType(product: BaseProduct): "soil" | "hydro" | null {
  if (product.url.includes("/items/99620939") || product.title.includes("I'm original SOIL")) return "soil";
  if (product.url.includes("/items/142692278") || product.title.includes("HYDRO MINERAL")) return "hydro";
  return null;
}

export default function InlineProductBanner({ products }: Props) {
  const targets = products
    .map((p) => ({ product: p, type: detectType(p) }))
    .filter((x): x is { product: BaseProduct; type: "soil" | "hydro" } => x.type !== null);

  if (targets.length === 0) return null;

  return (
    <div className="not-prose my-8 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-1">
      <p className="px-4 pt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">
        Pick Up — この記事で使う用土
      </p>
      <div className="mt-1 flex flex-col gap-1 p-2">
        {targets.map(({ product, type }) => {
          const meta = SOIL_COPY[type];
          return (
            <a
              key={product.url}
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-emerald-100 bg-white px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md"
            >
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
                <p className="mt-0.5 text-[12px] leading-snug text-gray-500 line-clamp-1">{meta.note}</p>
              </div>

              {/* Price + CTA */}
              <div className="shrink-0 text-right">
                {product.price && product.price !== "SOLD OUT" && (
                  <p className="text-base font-extrabold text-emerald-700">{product.price}</p>
                )}
                <span className="mt-1 inline-block rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white transition-colors group-hover:bg-emerald-700">
                  購入する →
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
