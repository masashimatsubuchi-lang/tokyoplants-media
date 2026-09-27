export interface ComparisonOption {
  label: string;
  tagline: string;
  items: string[];
}

interface Props {
  title: string;
  left: ComparisonOption;
  right: ComparisonOption;
}

interface Accent {
  bg: string;
  ring: string;
  label: string;
  tagline: string;
  check: string;
}

/**
 * 2つの選択肢は「どちらが正解か」ではなく「どちらが自分に合うか」を示すもの。
 * 以前は左=アンバー／右=グリーンで、右が推奨に見えてしまっていた（2026-09-27修正）。
 * 面はニュートラルと淡いセージに留め、ラベル・チェックは両者とも同じ色にして
 * 優劣の印象が出ないようにしている。
 */
const ACCENTS: { left: Accent; right: Accent } = {
  left: {
    bg: "bg-ink-50",
    ring: "ring-ink-200",
    label: "text-ink-900",
    tagline: "text-ink-500",
    check: "text-sage-600",
  },
  right: {
    bg: "bg-sage-50",
    ring: "ring-sage-200",
    label: "text-ink-900",
    tagline: "text-ink-500",
    check: "text-sage-600",
  },
};

function OptionColumn({ option, accent }: { option: ComparisonOption; accent: Accent }) {
  return (
    <div className={`flex-1 rounded-xl ${accent.bg} ring-1 ${accent.ring} p-4`}>
      <p className={`text-[15px] font-extrabold ${accent.label}`}>{option.label}</p>
      <p className={`mt-0.5 text-[12px] font-bold ${accent.tagline}`}>{option.tagline}</p>
      <ul className="mt-3 space-y-1.5">
        {option.items.map((item, i) => (
          <li key={i} className="flex items-start gap-1.5 text-[13px] leading-snug text-zinc-700">
            <span className={`mt-0.5 shrink-0 font-bold ${accent.check}`}>✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ComparisonSummary({ title, left, right }: Props) {
  return (
    <div className="not-prose my-8 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400">結論</p>
      <p className="mt-0.5 text-[15px] font-bold text-zinc-900">{title}</p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <OptionColumn option={left} accent={ACCENTS.left} />
        <div className="flex shrink-0 items-center justify-center">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-[11px] font-bold text-zinc-400">
            VS
          </span>
        </div>
        <OptionColumn option={right} accent={ACCENTS.right} />
      </div>
    </div>
  );
}
