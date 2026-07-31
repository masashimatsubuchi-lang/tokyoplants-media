import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { appStoreUrl } from "@/lib/appStore";

// Green Collection の「ともだち招待」リンクの着地ページ。
//
// このURL（https://media.tokyoplants.com/invite/XXXXXXXX）はアプリのQRコードに埋め込まれている。
// アプリがインストール済みのiPhoneではUniversal Linkとしてアプリが直接開くため、このページは
// 表示されない。ここに到達するのは「アプリ未インストール」か「PC/Androidで開いた」ケースなので、
// アプリのダウンロード導線として機能させる。
//
// ともだちIDはアプリ側で英大文字＋数字8桁として発行される。形式が違うものは404にする
// （任意の文字列でページが無限に生成され、クロール対象になるのを防ぐ）。
const CODE_PATTERN = /^[A-Z0-9]{8}$/;

export const metadata: Metadata = {
  title: "ともだち招待｜Green Collection",
  description:
    "Green Collection のともだち招待リンクです。アプリをインストールすると、おたがいの植物コレクションを見せ合えます。",
  // 招待コードは個別のURLなので検索結果に出す意味がなく、出るべきでもない。
  robots: { index: false, follow: false },
};

export default async function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const normalized = decodeURIComponent(code).toUpperCase();
  if (!CODE_PATTERN.test(normalized)) notFound();

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
      <p className="text-sm font-medium text-teal-700">ともだち招待</p>
      <h1 className="mt-3 text-2xl font-bold text-gray-900">
        Green Collection に招待されています
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-gray-600">
        観葉植物のお世話と成長を記録するアプリです。
        <br />
        ともだちになると、おたがいの植物コレクションを見せ合えます。
      </p>

      <div className="mt-8 w-full rounded-2xl border border-gray-200 bg-gray-50 px-6 py-5">
        <p className="text-xs text-gray-500">ともだちID</p>
        <p className="mt-1 font-mono text-3xl font-bold tracking-widest text-gray-900">
          {normalized}
        </p>
      </div>

      <a
        href={appStoreUrl("invite")}
        className="mt-8 w-full rounded-full bg-teal-700 px-6 py-4 text-base font-bold text-white transition hover:bg-teal-800"
      >
        App Store でアプリを入手
      </a>

      <p className="mt-6 text-xs leading-relaxed text-gray-500">
        アプリをインストールしたあと、もう一度このリンクを開くか、
        ともだちタブで上のIDを入力すると追加できます。
      </p>
    </div>
  );
}
