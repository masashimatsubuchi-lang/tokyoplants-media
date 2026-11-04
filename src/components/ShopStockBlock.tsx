import type { ShopStock } from "@/lib/shopStock";

/**
 * 図鑑記事の「tokyoplants で販売中の株」。src/lib/shopStock.ts が選んだ販売中の株を写真・名前・価格で並べる。
 * 以前は品種の商品一覧への文字リンクだけで、何が売っているかが記事から見えず、
 * 図鑑記事のECクリックは100PVあたり0.14〜0.27回だった（2026-10-08〜11-04）。
 * 在庫の元データは週1回の更新なので、売り切れていることがある旨を必ず添える。
 */
export default function ShopStockBlock({ stock }: { stock: ShopStock }) {
  return (
    <section className="not-prose my-8 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[15px] font-bold text-zinc-800">tokyoplants で販売中の{stock.genusLabel}</p>
        <a
          href={stock.categoryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-[12px] font-semibold text-emerald-700 hover:text-emerald-900"
        >
          すべて見る →
        </a>
      </div>
      {stock.otherVarietiesOnly && (
        <p className="mt-1 text-[12px] text-zinc-500">この記事で紹介した品種ではなく、同じ{stock.genusLabel}の仲間です。</p>
      )}
      <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {stock.items.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col overflow-hidden rounded-xl border border-emerald-100 bg-white transition-all hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md"
          >
            <div className="aspect-square w-full overflow-hidden bg-zinc-50">
              {item.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.japaneseName || item.latinName}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              )}
            </div>
            <div className="flex flex-1 flex-col p-2.5">
              <p className="text-[12px] font-bold leading-snug text-zinc-800 line-clamp-2">{item.latinName}</p>
              {item.japaneseName && <p className="mt-0.5 text-[11px] leading-snug text-zinc-500 line-clamp-2">{item.japaneseName}</p>}
              {item.price && <p className="mt-auto pt-1.5 text-[13px] font-extrabold text-emerald-700">{item.price}</p>}
            </div>
          </a>
        ))}
      </div>
      <p className="mt-2.5 text-[11px] leading-relaxed text-zinc-500">
        1株ずつの出品が中心で、売り切れていることがあります。最新の在庫はショップの商品ページでご確認ください。
      </p>
    </section>
  );
}
