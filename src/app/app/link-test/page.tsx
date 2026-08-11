import type { Metadata } from "next";
import UserAgentReadout from "@/components/UserAgentReadout";

// App Storeへのリンクが、アプリ内ブラウザでどの形なら開くのかを実機で切り分けるページ。
//
// Instagramのアプリ内ブラウザからApp Storeが開けない件の調査用。
// 推測で直すのをやめ、候補を並べて1回のセッションで判定できるようにした。
//
// 原因が確定したら、このページは消してよい。
export const metadata: Metadata = {
  title: "App Storeリンク検証",
  robots: { index: false, follow: false },
};

const APP_ID = "6790673876";
const PT = "129155915";

const variants: { key: string; label: string; href: string; note: string }[] = [
  {
    key: "A",
    label: "いまLPで使っている形",
    href: `https://apps.apple.com/jp/app/id${APP_ID}?pt=${PT}&ct=linktest_a&mt=8`,
    note: "国コードあり・計測パラメータあり",
  },
  {
    key: "B",
    label: "動作実績のある形と同じ",
    href: `https://apps.apple.com/app/id${APP_ID}?mt=8`,
    note: "国コードなし・パラメータはmt=8だけ",
  },
  {
    key: "C",
    label: "いちばん短いhttps",
    href: `https://apps.apple.com/app/id${APP_ID}`,
    note: "パラメータなし",
  },
  {
    key: "D",
    label: "スキームを直接（s1つ）",
    href: `itms-apps://apps.apple.com/app/id${APP_ID}`,
    note: "リダイレクトを経由しない",
  },
  {
    key: "E",
    label: "スキームを直接（s2つ）",
    href: `itms-appss://apps.apple.com/app/id${APP_ID}`,
    note: "Appleがリダイレクト先に使うのと同じ形",
  },
  {
    key: "F",
    label: "自ドメインで1回受けてから転送",
    href: "/go/appstore-test",
    note: "外部ツールと同じくホップを1つ挟む",
  },
];

export default function LinkTestPage() {
  return (
    <div className="mx-auto max-w-lg px-5 py-10">
      <h1 className="text-xl font-bold text-[#16352A]">
        App Storeリンクの検証
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[#5C5A52]">
        上から順にタップして、<strong>App Storeが開いたものの記号</strong>
        を教えてください。開かなかったら、このページに戻って次を試してください。
      </p>

      <ol className="mt-8 space-y-3">
        {variants.map((v) => (
          <li key={v.key}>
            <a
              href={v.href}
              className="flex items-center gap-3 rounded-2xl border border-[#E0DACD] bg-white px-4 py-4"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#015440] text-base font-bold text-white">
                {v.key}
              </span>
              <span className="min-w-0">
                <span className="block text-[15px] font-bold text-[#16352A]">
                  {v.label}
                </span>
                <span className="mt-0.5 block text-xs text-[#6E6C63]">
                  {v.note}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ol>

      <p className="mt-8 text-xs leading-relaxed text-[#6E6C63]">
        すべて同じアプリ（Green Collection）に向いています。どれか1つでも開けば、
        その形に統一します。全部開かない場合は、リンクの形ではなく
        アプリ内ブラウザ側の制限が原因と判断できます。
      </p>

      {/* 判定に使っているUAが実機で何になっているかも見たいので出しておく */}
      <UserAgentReadout />
    </div>
  );
}
