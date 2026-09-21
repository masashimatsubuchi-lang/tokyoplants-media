import type { ParsedBlock } from "@/lib/articleBlocks";

/**
 * 記事本文に埋め込む視覚ブロック群（2026-09-22導入）。
 * Markdown側のマーカー記法は src/lib/articleBlocks.ts を参照。
 * すべて `not-prose` で prose のスタイルから切り離し、インラインstyleを使わない
 * （globals.css の `.prose div[style]` ルールに巻き込まれないため）。
 */

function BlockTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  if (!title) return null;
  return (
    <div className="mb-3 flex items-baseline gap-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">{eyebrow}</span>
      <span className="text-[15px] font-bold text-zinc-800">{title}</span>
    </div>
  );
}

/* ---------- key-facts: 記事冒頭の「30秒でわかる」要約グリッド ---------- */
function KeyFacts({ block }: { block: Extract<ParsedBlock, { kind: "key-facts" }> }) {
  return (
    <section className="not-prose my-8 rounded-2xl bg-zinc-900 p-5 text-white sm:p-6">
      <BlockTitleDark eyebrow="At a glance" title={block.title || "この記事の要点"} />
      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        {block.items.map((it, i) => (
          <div key={i} className="flex gap-3 border-l-2 border-emerald-400 pl-3">
            <dt className="w-[5.5em] shrink-0 text-[12px] font-semibold leading-6 text-zinc-400">{it.label}</dt>
            <dd
              className="text-[14px] font-medium leading-6 text-zinc-50 [&_strong]:font-bold [&_strong]:text-emerald-300 [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: it.valueHtml }}
            />
          </div>
        ))}
      </dl>
    </section>
  );
}

function BlockTitleDark({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-4 flex items-baseline gap-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">{eyebrow}</span>
      <span className="text-[15px] font-bold text-white">{title}</span>
    </div>
  );
}

/* ---------- stats: 大きな数字タイル ---------- */
function Stats({ block }: { block: Extract<ParsedBlock, { kind: "stats" }> }) {
  const n = block.items.length;
  const cols = n >= 4 ? "grid-cols-2 sm:grid-cols-4" : n === 3 ? "grid-cols-3" : "grid-cols-2";
  return (
    <section className="not-prose my-8">
      <BlockTitle eyebrow="Numbers" title={block.title} />
      <div className={`grid ${cols} gap-2 sm:gap-3`}>
        {block.items.map((it, i) => (
          <div key={i} className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-4 text-center">
            <div className="text-[26px] font-extrabold leading-none tracking-tight text-emerald-700 sm:text-[30px]">
              {it.value}
            </div>
            <div className="mt-2 text-[12px] font-bold leading-tight text-zinc-800">{it.label}</div>
            {it.note && <div className="mt-1 text-[11px] leading-snug text-zinc-500">{it.note}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- steps: 番号つき手順カード ---------- */
function Steps({ block }: { block: Extract<ParsedBlock, { kind: "steps" }> }) {
  return (
    <section className="not-prose my-8">
      <BlockTitle eyebrow="Steps" title={block.title} />
      <ol className="relative ml-1 border-l-2 border-emerald-200 pl-6">
        {block.items.map((it, i) => (
          <li key={i} className="relative pb-6 last:pb-0">
            <span className="absolute -left-[2.05rem] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-[13px] font-extrabold text-white ring-4 ring-white">
              {i + 1}
            </span>
            {it.title && <div className="pt-1 text-[15px] font-bold leading-6 text-zinc-900">{it.title}</div>}
            <div
              className="mt-1 text-[14px] leading-[1.75] text-zinc-600 [&_strong]:font-bold [&_strong]:text-zinc-800 [&_a]:text-teal-700 [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: it.bodyHtml }}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------- callout: 注意・コツ・補足 ---------- */
const CALLOUT_STYLE = {
  warning: { box: "border-rose-200 bg-rose-50", eyebrow: "text-rose-600", label: "注意", icon: "!" },
  tip: { box: "border-amber-200 bg-amber-50", eyebrow: "text-amber-700", label: "コツ", icon: "★" },
  info: { box: "border-sky-200 bg-sky-50", eyebrow: "text-sky-700", label: "補足", icon: "i" },
} as const;

function Callout({ block }: { block: Extract<ParsedBlock, { kind: "callout" }> }) {
  const s = CALLOUT_STYLE[block.variant];
  return (
    <aside className={`not-prose my-6 rounded-xl border ${s.box} px-4 py-3.5 sm:px-5`}>
      <div className="mb-1.5 flex items-center gap-2">
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-black ${s.eyebrow} ring-1 ring-current`}
        >
          {s.icon}
        </span>
        <span className={`text-[11px] font-bold uppercase tracking-[0.15em] ${s.eyebrow}`}>{s.label}</span>
        {block.title && <span className="text-[14px] font-bold text-zinc-800">{block.title}</span>}
      </div>
      <div
        className="text-[14px] leading-[1.8] text-zinc-700 [&>p]:m-0 [&>p+p]:mt-2 [&_strong]:font-bold [&_strong]:text-zinc-900 [&_a]:text-teal-700 [&_a]:underline [&_ul]:mt-1 [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: block.bodyHtml }}
      />
    </aside>
  );
}

/* ---------- cards: 品種・商品・症状などの横並びカード ---------- */
function Cards({ block }: { block: Extract<ParsedBlock, { kind: "cards" }> }) {
  const cols = block.cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <section className="not-prose my-8">
      <BlockTitle eyebrow="Compare" title={block.title} />
      <div className={`grid grid-cols-1 gap-3 ${cols}`}>
        {block.items.map((it, i) => (
          <article key={i} className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <h4 className="mb-2 border-b border-emerald-100 pb-2 text-[15px] font-bold leading-snug text-zinc-900">
              {it.title}
            </h4>
            <div
              className="text-[13.5px] leading-[1.75] text-zinc-600 [&>p]:m-0 [&>p+p]:mt-2 [&_strong]:font-bold [&_strong]:text-emerald-700 [&_ul]:mt-1.5 [&_ul]:space-y-1 [&_li]:relative [&_li]:pl-4 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.55em] [&_li]:before:h-1.5 [&_li]:before:w-1.5 [&_li]:before:rounded-full [&_li]:before:bg-emerald-400 [&_a]:text-teal-700 [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: it.bodyHtml }}
            />
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- calendar: 12ヶ月ヒートストリップ ---------- */
const CAL_LEVEL: Record<string, { cls: string; title: string }> = {
  "◎": { cls: "bg-emerald-600", title: "最適・多め" },
  "○": { cls: "bg-emerald-400", title: "通常" },
  "△": { cls: "bg-emerald-200", title: "控えめ" },
  "×": { cls: "bg-zinc-200", title: "不要・避ける" },
  "-": { cls: "bg-transparent", title: "" },
  "": { cls: "bg-transparent", title: "" },
};

function Calendar({ block }: { block: Extract<ParsedBlock, { kind: "calendar" }> }) {
  return (
    <section className="not-prose my-8">
      <BlockTitle eyebrow="Calendar" title={block.title} />
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <div className="grid grid-cols-[minmax(4.5em,auto)_repeat(12,minmax(0,1fr))] items-center gap-y-1 px-2 py-2 text-[10px] sm:text-[11px]">
          <div />
          {block.months.map((m, i) => (
            <div key={i} className="pb-1 text-center font-semibold text-zinc-500">
              {m}
            </div>
          ))}
          {block.rows.map((row, r) => (
            <RowCells key={r} row={row} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-zinc-100 bg-zinc-50 px-3 py-2 text-[10px] text-zinc-500">
          {(["◎", "○", "△", "×"] as const).map((k) => (
            <span key={k} className="inline-flex items-center gap-1">
              <span className={`inline-block h-2.5 w-2.5 rounded-sm ${CAL_LEVEL[k].cls}`} />
              {k} {CAL_LEVEL[k].title}
            </span>
          ))}
          {block.legend && <span className="ml-auto">{block.legend}</span>}
        </div>
      </div>
    </section>
  );
}

function RowCells({ row }: { row: { label: string; cells: string[] } }) {
  return (
    <>
      <div className="pr-2 text-[11px] font-bold leading-tight text-zinc-700 sm:text-[12px]">{row.label}</div>
      {Array.from({ length: 12 }, (_, i) => {
        const raw = (row.cells[i] ?? "").trim();
        const lv = CAL_LEVEL[raw];
        return (
          <div key={i} className="px-[1px] py-[2px]">
            {lv ? (
              <div className={`h-6 w-full rounded-[4px] ${lv.cls}`} title={lv.title} />
            ) : (
              <div className="flex h-6 w-full items-center justify-center rounded-[4px] bg-emerald-50 text-[9px] font-bold text-emerald-800">
                {raw}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

export default function ArticleBlock({ block }: { block: ParsedBlock }) {
  switch (block.kind) {
    case "key-facts":
      return <KeyFacts block={block} />;
    case "stats":
      return <Stats block={block} />;
    case "steps":
      return <Steps block={block} />;
    case "callout":
      return <Callout block={block} />;
    case "cards":
      return <Cards block={block} />;
    case "calendar":
      return <Calendar block={block} />;
  }
}
