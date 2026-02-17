import { BaseProduct } from "@/lib/posts";

export default function BaseProductBlock({ products }: { products: BaseProduct[] }) {
  if (products.length === 0) return null;

  const getProductImage = (product: BaseProduct): string | undefined => {
    if (product.image) return product.image;

    // Fallback for the main tokyoplants soil product card.
    const soilKeywords = ["I'm original SOIL", "観葉植物の土"];
    const isSoilProduct =
      soilKeywords.some((keyword) => product.title.includes(keyword)) ||
      product.url.includes("/items/99620939");

    return isSoilProduct ? "/images/products/im-original-soil.jpg" : undefined;
  };

  return (
    <section className="mt-12 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/40 p-6 md:p-7">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold tracking-tight text-gray-900">
          tokyoplants で購入する
        </h2>
        <a
          href="https://www.tokyoplants.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
        >
          ショップを見る →
        </a>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {products.map((product) => {
          const isSoldOut = product.price === "SOLD OUT";
          const productImage = getProductImage(product);

          return (
            <a
              key={product.url}
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex items-center gap-4 rounded-xl border bg-white/95 p-4 transition-all ${
                isSoldOut
                  ? "border-gray-200 opacity-60 cursor-not-allowed"
                  : "border-gray-200 hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md"
              }`}
            >
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50 flex items-center justify-center">
                {productImage ? (
                  <img
                    src={productImage}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-2xl">🌿</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[17px] font-semibold leading-snug text-gray-900 line-clamp-2">{product.title}</p>
                {product.price && (
                  <p className={`mt-2 text-xl font-extrabold tracking-tight ${
                    isSoldOut ? "text-red-500" : "text-emerald-700"
                  }`}>
                    {product.price}
                  </p>
                )}
              </div>
              {isSoldOut && (
                <span className="absolute top-2 right-2 rounded bg-gray-500 px-2 py-0.5 text-xs font-bold text-white">
                  SOLD OUT
                </span>
              )}
            </a>
          );
        })}
      </div>
    </section>
  );
}
