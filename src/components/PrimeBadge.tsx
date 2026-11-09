/** Amazonの「prime」表示（2026-11-10 オーナー指示：Prime対象の商品は青文字でprimeと載せる）。
 * 表示するかは frontmatter の note に「Prime対象」と記録があるかで決める（amazonIsPrime）。 */
export default function PrimeBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[13px] font-extrabold italic leading-none tracking-tight text-[#00A8E1] ${className}`}
      aria-label="Amazonプライム対象"
    >
      <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
        <path d="M2 6.5 4.7 9 10 3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      prime
    </span>
  );
}
