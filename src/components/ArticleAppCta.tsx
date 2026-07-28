import Image from "next/image";
import { appStoreUrl } from "@/lib/appStore";

// 記事のfrontmatterの appCta に一言を書いた記事だけに出す。
// EC・アフィリエイト導線と競合しないよう、soil / review / 育成ライト系には設置しない。
export default function ArticleAppCta({ message }: { message: string }) {
  return (
    <div className="mt-12 rounded-xl border border-emerald-100 bg-emerald-50/60 p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Image
            src="/images/app/app-icon.png"
            alt="my Plants Collection アプリアイコン"
            width={48}
            height={48}
            className="shrink-0 rounded-xl"
          />
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900">{message}</p>
            <p className="mt-0.5 text-xs text-gray-500">
              my Plants Collection｜iOSアプリ・無料ではじめられます
            </p>
          </div>
        </div>
        <a
          href={appStoreUrl("media_article_cta")}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full bg-emerald-700 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors"
        >
          アプリを見る
        </a>
      </div>
    </div>
  );
}
