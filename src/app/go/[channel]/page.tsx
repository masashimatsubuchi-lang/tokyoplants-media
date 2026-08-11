import { redirect } from "next/navigation";

// Instagram・Xなど「参照元ドメインを持たない」チャネルからの流入を区別するための中継ページ。
//
// 以前はここで window.location.replace() により App Store へ直接飛ばしていたが、
// これは Instagram 等のアプリ内ブラウザで必ず失敗する。
// iOS の UA に対して Apple は `301 Location: itms-appss://...` を返すが、
// WKWebView は http/https 以外のスキームへのサーバーリダイレクトを処理できず、
// 白画面のまま止まってしまうため（2026-08-11に実測）。
//
// App Store アプリへの受け渡しが成立するのは「ユーザーが <a> をタップした」
// ナビゲーションだけなので、自前ドメインの /app に着地させ、そこでタップさせる。
//
// サイト内の導線（ヘッダーバナー・記事下CTA・フッター）は Safari 上での閲覧が
// 前提なので App Store へ直リンクのままでよく、ここは通さない。
export default async function ChannelRedirectPage({
  params,
}: {
  params: Promise<{ channel: string }>;
}) {
  const { channel } = await params;
  // ct（キャンペーントークン）に使うため、App Store が受け付ける文字種に丸める。
  const safe = decodeURIComponent(channel).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
  redirect(safe ? `/app?ch=${safe}` : "/app");
}
