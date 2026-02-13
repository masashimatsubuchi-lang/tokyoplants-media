import { BaseProduct } from "@/lib/posts";

export default function BaseProductBlock({ products }: { products: BaseProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mt-12 rounded-lg border border-gray-200 bg-gray-50 p-6">
      <h2 className="text-lg font-bold text-gray-900">おすすめ商品（BASE）</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {products.map((product) => (
          <a
            key={product.url}
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 hover:border-green-400 transition-colors"
          >
            <div className="h-16 w-16 flex-shrink-0 rounded bg-green-100 flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl">🛒</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 text-sm line-clamp-2">{product.title}</p>
              {product.price && (
                <p className="mt-1 text-sm font-semibold text-green-700">{product.price}</p>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
