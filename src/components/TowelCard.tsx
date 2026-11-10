/* eslint-disable @next/next/no-img-element */
import { TOWEL_ITEM_PATH, TOWEL_PATTERNS, towelImage, type TowelChoice } from "@/lib/towelPatterns";

/**
 * 記事の植物に合わせた Daily Botanical Towel のカード（2026-11-10 導入）。
 *
 * 以前は記事中の商品バナーが baseProducts の先頭1件しか出さず、モンステラ・アンスリウム・アロカシアの
 * 記事でもタオルは末尾の商品欄の2番目にしか見えていなかった（10/15〜11/9、これらの記事からのタオルの
 * クリックは0）。土のバナーとは役割が違うので同じ枠に積まず、記事の後半に別のカードとして出す。
 * - pattern: その記事の植物の柄を大きく見せ、残りの柄を小さく並べる（utm_content=pattern-card）
 * - lineup : ギフト記事では全8種を並べる（utm_content=gift-card）
 * 文言はECの商品ページで確認した仕様だけ（約30×20cm・マイクロファイバー・ループ付き・全8種）。
 */
export default function TowelCard({ choice }: { choice: TowelChoice }) {
  const placement = choice.mode === "pattern" ? "pattern-card" : "gift-card";
  const u = new URL(TOWEL_ITEM_PATH, "https://www.tokyoplants.com");
  u.searchParams.set("utm_source", "media");
  u.searchParams.set("utm_medium", "article");
  u.searchParams.set("utm_campaign", "botanical-towel");
  u.searchParams.set("utm_content", placement);
  const href = u.toString();

  if (choice.mode === "pattern") {
    const { pattern, genus } = choice;
    const others = TOWEL_PATTERNS.filter((p) => p.file !== pattern.file);
    return (
      <aside className="not-prose my-10 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
        <a href={href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-4 sm:gap-6 sm:p-5">
          <div className="h-32 w-32 shrink-0 overflow-hidden rounded-xl bg-white sm:h-40 sm:w-40">
            <img
              src={towelImage(pattern.file)}
              alt={`Daily Botanical Towel ${pattern.name.replace("｜", " ")}`}
              className="h-full w-full object-contain p-1.5 transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold tracking-[0.15em] text-emerald-700">Daily Botanical Towel</p>
            <p className="mt-1 text-[16px] font-bold leading-snug text-gray-900 sm:text-[17px]">{genus}のような、不思議なタオル</p>
            <p className="mt-1 text-[13px] text-gray-600">柄：{pattern.name}</p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-gray-500">葉の形と葉脈が、そのままタオルになりました。約30×20cmのマイクロファイバーで、ループ付き。</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-[16px] font-extrabold text-emerald-700">¥2,000</span>
              <span className="rounded-full bg-emerald-600 px-4 py-1.5 text-[12px] font-bold text-white transition-colors group-hover:bg-emerald-700">
                柄を見る →
              </span>
            </div>
          </div>
        </a>
        <div className="flex items-center gap-1.5 border-t border-emerald-100 bg-white/60 px-4 py-2.5 sm:px-5">
          <span className="mr-1 shrink-0 text-[11px] font-bold text-gray-500">全8種</span>
          {others.map((p) => (
            <img key={p.file} src={towelImage(p.file)} alt={p.name} title={p.name} className="h-8 w-8 rounded-md bg-white object-contain" loading="lazy" />
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="not-prose my-10 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4 sm:p-5">
      <p className="text-[11px] font-bold tracking-[0.15em] text-emerald-700">Daily Botanical Towel</p>
      <p className="mt-1 text-[16px] font-bold leading-snug text-gray-900 sm:text-[17px]">植物好きに贈る、葉っぱのような不思議なタオル</p>
      <p className="mt-1 text-[12.5px] leading-relaxed text-gray-500">
        モンステラ・アンスリウム・アロカシアの葉が、そのままタオルになりました。全8種。約30×20cmのマイクロファイバーで、ループ付き。
      </p>
      <a href={href} target="_blank" rel="noopener noreferrer" className="group mt-3 block">
        <div className="grid grid-cols-4 gap-2">
          {TOWEL_PATTERNS.map((p) => (
            <div key={p.file} className="aspect-square overflow-hidden rounded-lg bg-white">
              <img src={towelImage(p.file)} alt={p.name} title={p.name} className="h-full w-full object-contain p-1 transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[16px] font-extrabold text-emerald-700">各¥2,000</span>
          <span className="rounded-full bg-emerald-600 px-4 py-1.5 text-[12px] font-bold text-white transition-colors group-hover:bg-emerald-700">
            8種の柄を見る →
          </span>
        </div>
      </a>
    </aside>
  );
}
