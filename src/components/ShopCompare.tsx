import { getShopTable, rankTable, shortDate, yen, type RankedRow, type ShopItem } from "@/lib/shopComparison";

/**
 * <!-- shop-compare id="monstera-8" --><!-- /shop-compare --> の描画（2026-11-19）。
 * スマホでも最初に「送料込み総額」が目に入るよう、スマホは1店1枚のカード、PCは5列の表にする。
 * 以前の8列の Markdown 表は、スマホで総額の列まで横スクロールしないと見えなかった。
 */

function checkedLabel(it: ShopItem): string {
  return it.autoCheckedAt ? `${shortDate(it.autoCheckedAt)}自動確認` : `${shortDate(it.checkedAt)}確認`;
}

function breakdown(it: ShopItem): string {
  if (it.shipping === null) return `本体${yen(it.price)}＋送料${it.shippingText ?? "未確認"}`;
  return it.shipping === 0 ? `本体${yen(it.price)}・送料無料` : `本体${yen(it.price)}＋送料${yen(it.shipping)}`;
}

function SellerLink({ it, className }: { it: ShopItem; className?: string }) {
  const isAmazon = it.source.type === "amazon";
  return (
    <a
      href={it.url}
      target="_blank"
      rel={isAmazon ? "sponsored nofollow noopener" : "nofollow noopener"}
      data-placement="shop-compare"
      className={className ?? "font-semibold text-emerald-800 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-600"}
    >
      {it.seller}
    </a>
  );
}

function Detail({ it }: { it: ShopItem }) {
  return (
    <>
      {it.product}
      <span className="text-zinc-400"> ・ </span>写真：{it.photo}
      {it.note && (
        <>
          <span className="text-zinc-400"> ・ </span>
          {it.note}
        </>
      )}
      <span className="whitespace-nowrap text-zinc-400">（{checkedLabel(it)}）</span>
    </>
  );
}

function MobileCard({ row }: { row: RankedRow }) {
  const { item: it, rank, total, reason } = row;
  return (
    <li className={`rounded-xl border p-3.5 ${rank ? "border-zinc-200 bg-white" : "border-dashed border-zinc-300 bg-zinc-50"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-bold text-zinc-400">{rank ? `${rank}位` : "順位外"}</div>
          <SellerLink it={it} />
        </div>
        <div className="shrink-0 text-right">
          <div className="text-[10px] text-zinc-400">送料込み</div>
          <div className={`text-[17px] font-bold ${rank ? "text-zinc-900" : "text-zinc-500"}`}>{total === null ? "要確認" : yen(total)}</div>
        </div>
      </div>
      <div className="mt-2 text-[12.5px] leading-relaxed text-zinc-700">
        <div className="font-semibold">{it.size}</div>
        <div className="text-zinc-500">{breakdown(it)}</div>
        <div className="mt-1 text-zinc-600">
          <Detail it={it} />
        </div>
        {reason && <div className="mt-1.5 text-[12px] text-amber-700">{reason}</div>}
      </div>
    </li>
  );
}

function TableRow({ row }: { row: RankedRow }) {
  const { item: it, rank, total, reason } = row;
  return (
    <tr className={rank ? "" : "bg-zinc-50 text-zinc-500"}>
      <td className="px-3 py-2.5 align-top text-[12px] font-bold whitespace-nowrap text-zinc-400">{rank ?? "外"}</td>
      <td className="min-w-[8.5rem] px-3 py-2.5 align-top">
        <SellerLink it={it} />
      </td>
      <td className="px-3 py-2.5 align-top whitespace-nowrap">
        <div className={`font-bold ${rank ? "text-zinc-900" : ""}`}>{total === null ? "要確認" : yen(total)}</div>
        <div className="text-[11.5px] text-zinc-500">{breakdown(it)}</div>
      </td>
      <td className="min-w-[8rem] px-3 py-2.5 align-top">{it.size}</td>
      <td className="px-3 py-2.5 align-top text-[12.5px] text-zinc-600">
        <Detail it={it} />
        {reason && <div className="mt-1 text-amber-700">{reason}</div>}
      </td>
    </tr>
  );
}

function AmazonList({ items }: { items: ShopItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-3 rounded-xl bg-zinc-50 p-3.5 text-[12.5px] leading-relaxed text-zinc-600">
      <div className="mb-1.5 font-bold text-zinc-700">Amazonの出品（価格は変わりやすいため表示していません）</div>
      <ul className="space-y-1.5">
        {items.map((it) => (
          <li key={it.url}>
            <SellerLink it={it} />
            <span className="text-zinc-400"> ・ </span>
            {it.size}
            <span className="text-zinc-400"> ・ </span>
            {it.product}
            {it.note && (
              <>
                <span className="text-zinc-400"> ・ </span>
                {it.note}
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-1.5 text-[11px] text-zinc-400">Amazonへのリンクはアソシエイトリンクです。価格と送料は商品ページで確認してください。</div>
    </div>
  );
}

export default function ShopCompare({ id, title }: { id: string; title?: string }) {
  const table = getShopTable(id);
  if (!table) return null;
  const { ranked, others, amazon } = rankTable(table);
  const rows = [...ranked, ...others];
  // 見出しは記事本文側（### 植物名、**規格**）に書くので、title 属性があるときだけ出す
  const heading = title;
  return (
    <section className="not-prose my-6">
      {heading && <div className="mb-2 text-[15px] font-bold text-zinc-800">{heading}</div>}

      <ol className="space-y-2.5 md:hidden">
        {rows.map((r) => (
          <MobileCard key={r.item.url} row={r} />
        ))}
      </ol>

      <div className="hidden overflow-hidden rounded-xl border border-zinc-200 md:block">
        <table className="w-full border-collapse text-[13.5px] leading-relaxed">
          <thead className="bg-zinc-100 text-left text-[12px] text-zinc-600">
            <tr>
              <th className="px-3 py-2 font-bold whitespace-nowrap">順位</th>
              <th className="px-3 py-2 font-bold">販売先</th>
              <th className="px-3 py-2 font-bold whitespace-nowrap">送料込み総額</th>
              <th className="px-3 py-2 font-bold">号数・高さ</th>
              <th className="px-3 py-2 font-bold">鉢・写真・備考</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((r) => (
              <TableRow key={r.item.url} row={r} />
            ))}
          </tbody>
        </table>
      </div>

      <AmazonList items={amazon} />
    </section>
  );
}
