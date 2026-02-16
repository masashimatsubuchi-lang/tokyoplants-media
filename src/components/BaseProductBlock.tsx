import { BaseProduct } from "@/lib/posts";

export default function BaseProductBlock({ products }: { products: BaseProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mt-12 rounded-xl border border-green-200 bg-green-50/50 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">
          tokyoplants で購入する
        </h2>
        <a
          href="https://www.tokyoplants.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-green-700 hover:text-green-900 transition-colors"
        >
          ショップを見る →
        </a>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {products.map((product) => {
          const isSoldOut = product.price === "SOLD OUT";
          return (
            <a
              key={product.url}
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex items-center gap-4 rounded-lg border bg-white p-4 transition-colors ${
                isSoldOut
                  ? "border-gray-200 opacity-60 cursor-not-allowed"
                  : "border-gray-200 hover:border-green-500 hover:shadow-sm"
              }`}
            >
              <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-green-100 flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl">🌿</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 text-sm line-clamp-2">{product.title}</p>
                {product.price && (
                  <p className={`mt-1 text-sm font-semibold ${
                    isSoldOut ? "text-red-500" : "text-green-700"
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
