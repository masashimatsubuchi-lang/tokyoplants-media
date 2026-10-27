import type { RankingItem } from "@/lib/homeStorefront";

const ASSOCIATE_TAG = process.env.AMAZON_ASSOCIATE_TAG || "tokyoplants0f-22";

// 人気ランキングのカード。Apple Storeの商品カードにならい、順位・名前・価格・写真だけにする。
// data-placement は ClickTracker の amazon_click に載り、トップのランキングから押されたことが分かる。
export default function RankingCard({ item, rank }: { item: RankingItem; rank: number }) {
  return (
    <a
      href={`https://www.amazon.co.jp/dp/${item.asin}?tag=${ASSOCIATE_TAG}`}
      target="_blank"
      rel="sponsored noopener noreferrer"
      data-placement="home-ranking"
      className="group flex w-[64%] shrink-0 snap-start flex-col rounded-[24px] bg-white px-6 pb-5 pt-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.10)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16352A] sm:w-[40%] md:w-[264px]"
    >
      <p className="text-[12px] font-semibold text-[#2c6e52]">{rank}位</p>
      <h3 className="mt-2 line-clamp-2 min-h-[2.6em] text-[16px] font-semibold leading-[1.3] tracking-[-0.01em]">{item.title}</h3>
      <p className="mt-2 text-[13px] text-[#1d1d1f]">{item.price}</p>
      <div className="mt-auto pt-5">
        <div className="relative mx-auto aspect-square w-full max-w-[210px]">
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
      </div>
    </a>
  );
}
