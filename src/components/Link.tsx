import NextLink from "next/link";
import type { ComponentProps } from "react";

// 2026-11-15: Next.js の <Link> は画面に入ったリンク先を自動で先読みする。
// Next 16 では1リンクにつき3〜5回のリクエストになり、記事1ページを読むだけで
// 100回前後に膨らんでいた（Vercel無料枠のリクエスト数・ISR Readsを数倍超過し、
// 2026-11-14にサイト全体が停止）。サイト内リンクはすべてこのコンポーネントを使い、
// 先読みを既定で止める。クリック時の遷移は1回の取得で済むので体感はほぼ変わらない。
export default function Link({ prefetch = false, ...props }: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={prefetch} {...props} />;
}
