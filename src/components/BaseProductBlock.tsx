import { BaseProduct } from "@/lib/posts";

export default function BaseProductBlock({ products }: { products: BaseProduct[] }) {
  if (products.length === 0) return null;

  const isSoilProduct = (product: BaseProduct): boolean => {
    const soilKeywords = ["I'm original SOIL", "観葉植物の土"];
    return soilKeywords.some((keyword) => product.title.includes(keyword)) || product.url.includes("/items/99620939");
  };

  const isTowelProduct = (product: BaseProduct): boolean => {
    return product.title.includes("Botanical Towel") || product.url.includes("/items/135803882");
  };

  const isHydroProduct = (product: BaseProduct): boolean => {
    return product.title.includes("HYDRO MINERAL") || product.url.includes("/items/142692278");
  };

  const isWarocqueanum = (product: BaseProduct): boolean => {
    return product.title.includes("Warocqueanum") || product.title.includes("ワロクアーナム") || product.url.includes("/items/94920117");
  };

  const isRegale = (product: BaseProduct): boolean => {
    return product.title.includes("Regale") || product.title.includes("レガレ") || product.url.includes("/items/94918874");
  };

  const getProductImage = (product: BaseProduct): string | undefined => {
    if (product.image) return product.image;

    if (isSoilProduct(product)) return "/images/products/im-original-soil-main.jpg";
    if (isTowelProduct(product)) return "/images/products/botanical-towel-main.jpg";
    if (isHydroProduct(product)) return "/images/products/hydro-mineral-main.jpg";
    if (isWarocqueanum(product)) return "/images/products/anthurium-warocqueanum-group.jpg";
    if (isRegale(product)) return "/images/products/anthurium-regale-group.jpg";
    return undefined;
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
          const isSoil = isSoilProduct(product);
          const isTowel = isTowelProduct(product);
          const isHydro = isHydroProduct(product);
          const isWaroc = isWarocqueanum(product);
          const isReg = isRegale(product);

          return (
            <a
              key={product.url}
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex items-center gap-4 rounded-xl border bg-white/95 p-4 transition-all ${
                isSoldOut
                  ? "border-gray-200 opacity-60 cursor-not-allowed"
                  : isSoil || isTowel || isHydro || isWaroc || isReg
                    ? "border-emerald-300 hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md"
                    : "border-gray-200 hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md"
              }`}
            >
              <div className={`flex items-center justify-center overflow-hidden rounded-xl border ${
                isSoil || isTowel || isHydro || isWaroc || isReg
                  ? "h-24 w-24 border-emerald-200 bg-emerald-50/70"
                  : "h-20 w-20 border-emerald-100 bg-emerald-50"
              }`}>
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
                {isSoil && (
                  <>
                    <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
                      観葉植物向けに通気性と排水性を重視したオリジナルブレンド用土。
                    </p>
                    <p className="mt-1 text-xs font-medium text-gray-500">容量: 複数サイズ展開</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">
                        6種天然素材
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">
                        室内向け配合
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">
                        化学肥料不使用
                      </span>
                    </div>
                  </>
                )}
                {isHydro && (
                  <>
                    <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
                      富士山溶岩石×ゼオライト配合のハイドロ・底面給水向け無機培地。
                    </p>
                    <p className="mt-1 text-xs font-medium text-gray-500">容量: 2L / 粒サイズ: 3〜5mm</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">
                        溶岩石×ゼオライト
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">
                        肥料8〜9ヶ月分
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">
                        ハイドロ対応
                      </span>
                    </div>
                  </>
                )}
                {isReg && (
                  <>
                    <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
                      横幅のある重厚なベルベット葉と白い葉脈のコントラスト。成熟するほど葉幅が増す。
                    </p>
                    <p className="mt-1 text-xs font-medium text-gray-500">水苔植え・SELECT STOCK</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">
                        大判ハート型葉
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">
                        お得なセレクト株
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">
                        希少コレクター種
                      </span>
                    </div>
                  </>
                )}
                {isWaroc && (
                  <>
                    <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
                      深緑のベルベット葉に白銀の葉脈。成熟するほど葉が伸び、垂れ下がる圧倒的な存在感。
                    </p>
                    <p className="mt-1 text-xs font-medium text-gray-500">水苔植え・SELECT STOCK</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">
                        Queen Anthurium
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">
                        お得なセレクト株
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">
                        希少コレクター種
                      </span>
                    </div>
                  </>
                )}
                {isTowel && (
                  <>
                    <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
                      希少植物のシルエットをモチーフにしたマイクロファイバータオル。
                    </p>
                    <p className="mt-1 text-xs font-medium text-gray-500">サイズ: 約30cm × 20cm</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">
                        マイクロファイバー
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">
                        速乾・吸水
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">
                        全7種
                      </span>
                    </div>
                  </>
                )}
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
