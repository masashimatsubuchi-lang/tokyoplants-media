export default function ArticleAppCta() {
  return (
    <div className="mt-12 rounded-xl border border-emerald-100 bg-emerald-50/60 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-gray-900">
            植物のある暮らしを、アプリでも
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            水やり管理から成長記録まで、無料ではじめられます
          </p>
        </div>
        <a
          href="/go/article_bottom"
          target="_blank"
          className="shrink-0 rounded-full bg-emerald-700 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors"
        >
          7日間の無料体験
        </a>
      </div>
    </div>
  );
}
