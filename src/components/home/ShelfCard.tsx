import Link from "next/link";
import type { ShelfItem } from "@/lib/homeStorefront";

const ASSOCIATE_TAG = process.env.AMAZON_ASSOCIATE_TAG || "tokyoplants0f-22";

// 外部商品（Amazon）のカード。人気の列は順位と注文数、編集部おすすめの列は選んだ理由を出す。
// data-placement は ClickTracker の amazon_click に載り、どの棚から押されたかを分けて見られる。
export default function ShelfCard({ item, placement }: { item: ShelfItem; placement: string }) {
  return (
    <article className="group relative flex w-[62%] shrink-0 snap-start flex-col rounded-[22px] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.09)] sm:w-[40%] md:w-[264px]">
      <a
        href={`https://www.amazon.co.jp/dp/${item.asin}?tag=${ASSOCIATE_TAG}`}
        target="_blank"
        rel="sponsored noopener noreferrer"
        data-placement={placement}
        aria-label={`${item.title}をAmazonで見る`}
        className="absolute inset-0 z-0 rounded-[22px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16352A]"
      />
      <div className="pointer-events-none relative flex flex-1 flex-col">
        {item.rank && (
          <span className="absolute left-0 top-0 z-[1] flex h-7 min-w-7 items-center justify-center rounded-full bg-[#16352A] px-2 text-[12px] font-semibold text-white">
            {item.rank}
          </span>
        )}
        <div className="relative mx-auto aspect-square w-full max-w-[200px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt=""
            loading="lazy"
            width={500}
            height={500}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
        <h4 className="mt-4 line-clamp-2 text-[14px] font-semibold leading-snug">{item.title}</h4>
        {item.price && <p className="mt-1.5 text-[13px] text-[#1d1d1f]">{item.price}</p>}
        {item.reason && <p className="mt-2 line-clamp-3 text-[12px] leading-relaxed text-[#6e6e73]">{item.reason}</p>}
        {item.orders !== undefined && (
          <p className="mt-2 text-[12px] text-[#6e6e73]">tokyoplants経由の注文 {item.orders}件</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-4 text-[12px]">
          <span className="font-medium text-[#6e6e73]">Amazonで見る</span>
          {item.article && (
            <Link href={item.article.href} className="pointer-events-auto relative z-10 font-medium text-[#2c6e52] hover:underline">
              記事 ›
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
