import Image from "next/image";

const SHOP_PRODUCTS = [
  {
    title: "観葉植物の土\n『 I'm original SOIL 』",
    price: "¥1,200〜",
    url: "https://www.tokyoplants.com/items/99620939?utm_source=media&utm_medium=article&utm_campaign=shop-banner",
    image: "https://baseec-img-mng.akamaized.net/images/item/origin/413a54d2734d729bb0811e84196e55e0.jpg",
    tags: ["6種天然素材", "室内向け"],
    soldOut: false,
  },
  {
    title: "HYDRO MINERAL 2L\n溶岩石×ゼオライト培地",
    price: "¥1,200",
    url: "https://www.tokyoplants.com/items/142692278?utm_source=media&utm_medium=article&utm_campaign=shop-banner",
    image: "https://baseec-img-mng.akamaized.net/images/item/origin/8c005d36fa6b24f95424f388eca16b7f.jpg",
    tags: ["ハイドロ対応", "肥料8〜9ヶ月"],
    soldOut: false,
  },
  {
    title: "Daily Botanical Towel\nリーフタオル",
    price: "¥2,000",
    url: "https://www.tokyoplants.com/items/135803882?utm_source=media&utm_medium=article&utm_campaign=shop-banner",
    image: "https://baseec-img-mng.akamaized.net/images/item/origin/bbc1475ea0cca198e331fb00760bc15b.jpg",
    tags: ["全10種", "ギフト対応"],
    soldOut: false,
  },
  {
    title: "MOCHI POT｜3号\n3Dプリント鉢",
    price: "¥2,800",
    url: "https://www.tokyoplants.com/items/140571906?utm_source=media&utm_medium=article&utm_campaign=shop-banner",
    image: "https://baseec-img-mng.akamaized.net/images/item/origin/1a71835fed9fdffb01911db4835fcd54.png",
    tags: ["Olive / Gray", "通気性メッシュ"],
    soldOut: false,
  },
  {
    title: "Anthurium Warocqueanum\nアンスリウム・ワロク",
    price: "¥4,800",
    url: "https://www.tokyoplants.com/items/94920117?utm_source=media&utm_medium=article&utm_campaign=shop-banner",
    image: "https://baseec-img-mng.akamaized.net/images/item/origin/09e298133894a3196fd2ad64c82a988e.jpg",
    tags: ["Queen Anthurium", "SELECT STOCK"],
    soldOut: false,
  },
  {
    title: "SISHI CRAFT × tokyoplants\nLeather Botanical",
    price: "¥18,000",
    url: "https://www.tokyoplants.com/items/143263775?utm_source=media&utm_medium=article&utm_campaign=shop-banner",
    image: "https://baseec-img-mng.akamaized.net/images/item/origin/ddcc2cb431e28bbdae445da88bd24236.jpg",
    tags: ["職人手作業", "水やり不要"],
    soldOut: true,
  },
];

function ProductCard({ product }: { product: typeof SHOP_PRODUCTS[0] }) {
  const inner = (
    <>
      <div className="relative h-40 w-full overflow-hidden rounded-t-xl bg-gray-50">
        <Image
          src={product.image}
          alt={product.title.replace("\n", " ")}
          fill
          sizes="176px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <span className="rounded bg-gray-600 px-2 py-0.5 text-[11px] font-bold text-white">SOLD OUT</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <p className="text-[13px] font-semibold leading-snug text-gray-900 whitespace-pre-line line-clamp-3">
          {product.title}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {product.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-medium text-teal-700">
              {tag}
            </span>
          ))}
        </div>
        <p className={`mt-auto pt-2 text-base font-extrabold tracking-tight ${product.soldOut ? "text-gray-400" : "text-teal-700"}`}>
          {product.price}
        </p>
      </div>
    </>
  );

  if (product.soldOut) {
    return (
      <div className="group relative flex w-44 shrink-0 snap-start flex-col rounded-xl border border-gray-200 bg-white opacity-50 cursor-not-allowed">
        {inner}
      </div>
    );
  }

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex w-44 shrink-0 snap-start flex-col rounded-xl border border-gray-200 bg-white hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md transition-all"
    >
      {inner}
    </a>
  );
}

export default function ShopBanner() {
  return (
    <section className="mt-14">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">tokyoplants Shop</p>
          <h2 className="mt-1 text-lg font-extrabold tracking-tight text-gray-900">tokyoplants で購入する</h2>
        </div>
        <a
          href="https://www.tokyoplants.com?utm_source=media&utm_medium=article&utm_campaign=shop-banner"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-sm font-semibold text-teal-700 hover:text-teal-900 transition-colors"
        >
          ショップを見る →
        </a>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">
        {SHOP_PRODUCTS.map((product) => (
          <ProductCard key={product.url} product={product} />
        ))}
      </div>
    </section>
  );
}
