"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// ヘッダーのAppボタン。アプリ紹介LP（/app）へ送る。
//
// ⚠️ App Storeへ直接リンクしないこと。アプリ内ブラウザで開けなくなる。
//    理由は AppStoreButton と appStore.ts のコメントを参照。
//
// /app を開いているときは出さない。遷移先が同じページなので、
// 押しても何も起きないように見えてしまうため。
export default function HeaderAppLink({ className }: { className: string }) {
  if (usePathname() === "/app") return null;

  return (
    <Link href="/app?ch=header" className={className}>
      App
    </Link>
  );
}
