import type { ReactNode } from "react";

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * スマートフォン向けの目次。
 *
 * サイドバーの目次は `hidden lg:block` でPCにしか出ておらず、
 * 流入の約8割を占めるモバイルでは「この記事に何が書いてあるか」が
 * 最初のスクロールまで分からない状態だった（2026-09-26に判明）。
 *
 * 長い記事ほど効くので、H2が4つ以上ある記事だけに出す。
 * JavaScriptを使わずに開閉できるよう <details> で実装している
 * （記事本体はサーバーコンポーネントのままにしたいため）。
 */
export default function MobileToc({ items }: { items: TocEntry[] }): ReactNode {
  const headings = items.filter((i) => i.level === 2);
  if (headings.length < 4) return null;

  return (
    <details className="not-prose group my-6 rounded-2xl border border-zinc-200 bg-zinc-50/80 lg:hidden">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">Contents</span>
        <span className="text-[14px] font-bold text-zinc-800">この記事の内容</span>
        <span className="ml-auto text-[12px] text-zinc-500">{headings.length}項目</span>
        <svg
          className="h-4 w-4 shrink-0 text-zinc-400 transition-transform group-open:rotate-180"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <ol className="space-y-0.5 border-t border-zinc-200 px-4 py-3">
        {headings.map((item, i) => (
          <li key={item.id} className="flex gap-2.5">
            <span className="w-4 shrink-0 pt-[3px] text-right text-[11px] font-bold tabular-nums text-emerald-600">
              {i + 1}
            </span>
            <a
              href={`#${item.id}`}
              className="block py-1 text-[14px] leading-snug text-zinc-700 underline-offset-2 hover:text-teal-700 hover:underline"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}
