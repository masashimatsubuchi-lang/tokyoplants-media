import type { Metadata } from "next";

// 「Adjustを挟めばアプリ内ブラウザからApp Storeを開ける」かどうかを、
// 他社の実物と自前の実装を並べて比較するページ。
//
// 先の検証では自前の6パターンが全滅したが、ワンバンク（Adjust利用）は
// Instagramから開けているというオーナーの報告がある。
// 同じ端末・同じセッションで両方を叩けば、Adjust側に何か仕掛けがあるのか、
// それとも別の条件（外部ブラウザに切り替えていた等）だったのかが分かる。
//
// 結論が出たらこのページは削除する。
export const metadata: Metadata = {
  title: "リンク比較テスト",
  robots: { index: false, follow: false },
};

const APP_ID = "6790673876";

const cases = [
  {
    key: "1",
    label: "ワンバンクのAdjustリンク（他社の実物）",
    href: "https://app.adjust.com/hve3jrj",
    note: "これが開けば、Adjustに仕掛けがあると確定します",
    accent: true,
  },
  {
    key: "2",
    label: "自ドメインで受けてから転送（Adjustと同じ構造）",
    href: "/go/appstore-test",
    note: "302でApp Storeへ送る。Adjustがやっているのと同じ形",
    accent: false,
  },
  {
    key: "3",
    label: "App Storeへ直接",
    href: `https://apps.apple.com/app/id${APP_ID}?mt=8`,
    note: "いまLPで使っている形",
    accent: false,
  },
];

export default function LinkTestPage() {
  return (
    <div className="mx-auto max-w-lg px-5 py-10">
      <h1 className="text-xl font-bold text-[#16352A]">リンク比較テスト</h1>
      <p className="mt-3 text-sm leading-relaxed text-[#5C5A52]">
        <strong>Instagramのアプリ内ブラウザで</strong>開いて、上から順にタップしてください。
        それぞれ <strong>App Storeが開いたかどうか</strong> を教えてください。
      </p>
      <p className="mt-2 text-xs leading-relaxed text-[#6E6C63]">
        ※ 1番だけワンバンク（他社アプリ）のページが開きます。比較用なので、
        インストールはせず戻ってきてください。
      </p>

      <ol className="mt-8 space-y-3">
        {cases.map((c) => (
          <li key={c.key}>
            <a
              href={c.href}
              className={`flex items-start gap-3 rounded-2xl border px-4 py-4 ${
                c.accent
                  ? "border-[#015440] bg-[#F1F6F3]"
                  : "border-[#E0DACD] bg-white"
              }`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#015440] text-base font-bold text-white">
                {c.key}
              </span>
              <span className="min-w-0">
                <span className="block text-[15px] font-bold leading-snug text-[#16352A]">
                  {c.label}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-[#6E6C63]">
                  {c.note}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ol>

      <div className="mt-8 rounded-xl bg-[#F1EEE6] px-4 py-4">
        <p className="text-xs font-bold text-[#16352A]">この結果で決まること</p>
        <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-[#5C5A52]">
          <li>
            <strong>1が開き、2・3が開かない</strong> → Adjustに仕掛けがある。
            私の見立てが誤りなので、Adjustを導入します
          </li>
          <li>
            <strong>1も開かない</strong> → 以前うまくいったのは別の条件だった
            （外部ブラウザに切り替わっていた等）ということになります
          </li>
          <li>
            <strong>全部開く</strong> → 状況によって変わる。条件を絞り込みます
          </li>
        </ul>
      </div>
    </div>
  );
}
