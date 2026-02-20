import { AmazonProduct } from "@/lib/posts";

function addAssociateTag(url: string, associateTag?: string): string {
  if (!associateTag) return url;

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("amazon.")) return url;
    if (!parsed.searchParams.get("tag")) {
      parsed.searchParams.set("tag", associateTag);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

function buildAmazonUrl(product: AmazonProduct, associateTag?: string): string | null {
  if (product.asin) {
    const baseUrl = `https://www.amazon.co.jp/dp/${product.asin}`;
    return addAssociateTag(baseUrl, associateTag);
  }
  if (product.url) {
    return addAssociateTag(product.url, associateTag);
  }
  return null;
}

export default function AmazonAffiliateBlock({ products }: { products: AmazonProduct[] }) {
  if (products.length === 0) return null;

  const associateTag = process.env.AMAZON_ASSOCIATE_TAG || "tokyoplants0f-22";

  return (
    <section className="mt-8 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/70 via-white to-amber-50/40 p-6 md:p-7">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-extrabold tracking-tight text-gray-900">Amazonで関連商品を見る</h2>
        <a
          href={addAssociateTag("https://www.amazon.co.jp/", associateTag)}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="text-sm font-semibold text-amber-700 hover:text-amber-900 transition-colors"
        >
          Amazonへ →
        </a>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-gray-500">
        ※本セクションにはAmazonアソシエイトリンクを含みます。
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {products.map((product, index) => {
          const href = buildAmazonUrl(product, associateTag);
          if (!href) return null;

          return (
            <a
              key={`${product.title}-${index}`}
              href={href}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-amber-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md"
            >
              <div className="h-20 w-20 overflow-hidden rounded-xl border border-amber-100 bg-amber-50 flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-sm font-semibold text-amber-800">Amazon</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-semibold leading-snug text-gray-900 line-clamp-2">{product.title}</p>
                {product.note && <p className="mt-1 text-xs text-gray-500 line-clamp-2">{product.note}</p>}
                {product.price && <p className="mt-2 text-lg font-extrabold tracking-tight text-amber-700">{product.price}</p>}
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
