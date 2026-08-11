import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AppStoreButton from "@/components/AppStoreButton";

// Green Collection（iOSアプリ）の紹介LP。
//
// このページの第一の役割は Instagram のプロフィールリンクの着地点。
// App Store へ直リンクするとアプリ内ブラウザで白画面になるため、必ずここを挟む。
// 詳しい理由は AppStoreButton のコメントを参照。
//
// 検索流入ではなく「すでに興味がある人」が来る前提なので、読み物ではなく
// ファーストビューでボタンに到達できる構成にしている。

const BRAND_GREEN = "#015440";
const BRAND_CREAM = "#E0E8C0";

export const metadata: Metadata = {
  title: "Green Collection｜観葉植物のお世話と成長を記録するアプリ",
  description:
    "撮るだけで品種がわかるAI図鑑、水やりリマインド、成長のBefore/After記録。8体のなかまたちと一緒に、植物との暮らしを楽しく続けられるiPhoneアプリです。無料ではじめられます。",
  alternates: { canonical: "/app" },
  openGraph: {
    type: "website",
    url: "/app",
    title: "Green Collection｜観葉植物のお世話と成長を記録するアプリ",
    description:
      "撮るだけで品種がわかるAI図鑑、水やりリマインド、成長のBefore/After記録。8体のなかまたちと一緒に、植物との暮らしを楽しく続けられるiPhoneアプリです。",
    images: [
      {
        // 記事と同じ動的OG生成ルートを使う（1200x630）。
        // スクショは縦長なので、SNSのカードに載せると上下が切れてしまう。
        url: "/og?title=Green%20Collection%EF%BD%9C%E8%A6%B3%E8%91%89%E6%A4%8D%E7%89%A9%E3%81%AE%E3%81%8A%E4%B8%96%E8%A9%B1%E3%81%A8%E6%88%90%E9%95%B7%E3%82%92%E8%A8%98%E9%8C%B2%E3%81%99%E3%82%8B%E3%82%A2%E3%83%97%E3%83%AA",
        width: 1200,
        height: 630,
      },
    ],
  },
};

// 高さは画像ごとに異なる（App Store掲載画像から見出しの焼き込み部分を切り落としたため）。
// 実寸と違う値を入れるとアスペクト比が崩れるので、差し替え時は必ず測り直すこと。
const features = [
  {
    image: "/images/app/screen-home.png",
    height: 1997,
    alt: "Green Collection のホーム画面。育てている植物のアイコンが降ってくる",
    title: "開くたびに、ぽとぽと降ってくる。",
    body: "自宅で育てている植物のアイコンが、アプリを開くたびに可愛く舞い降りてきます。集めるほど、棚がにぎやかになっていく。",
  },
  {
    image: "/images/app/screen-ai-add.png",
    height: 1948,
    alt: "植物を追加する画面。AIが品種名と水やり頻度を下書きしている",
    title: "撮るだけで、図鑑クオリティ。",
    body: "写真を撮るだけで、AIが品種名・育て方・水やり頻度まで下書きしてくれます。800品種を登録済みで、随時追加中。",
  },
  {
    image: "/images/app/screen-calendar.png",
    height: 1956,
    alt: "カレンダー画面。水やりや肥料の予定が表示されている",
    title: "水やり、もう忘れない。",
    body: "水やり・肥料などお世話のタイミングを、キャラクターがやさしく通知。季節に合わせて次回の予定を自動調整することもできます。",
  },
  {
    image: "/images/app/screen-characters.png",
    height: 1942,
    alt: "なかまたち図鑑の画面。ブルーム、ラム、クロなどのキャラクター一覧",
    title: "8体のなかまたちが、そばにいるよ。",
    body: "「ひとりで育てない。」応援担当のブルーム、植物博士のラム、土のことならクロ。個性豊かな仲間が日々のお世話に寄り添います。",
  },
  {
    image: "/images/app/screen-photo-log.png",
    height: 1903,
    alt: "植物の詳細画面。切り抜き前後の写真を比較している",
    title: "育てた日々を、写真で残そう。",
    body: "お迎えから1ヶ月・3ヶ月・半年・1年…節目ごとに撮影を促してくれます。並べて見ると、ちゃんと育っているのがわかる。",
  },
];

export default function AppLandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Green Collection",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "iOS",
    url: "https://media.tokyoplants.com/app",
    description:
      "観葉植物のお世話と成長を記録するiPhoneアプリ。AI品種判定、水やりリマインド、成長記録に対応。",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    publisher: { "@type": "Organization", name: "tokyoplants" },
  };

  return (
    <div style={{ backgroundColor: BRAND_GREEN }} className="text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ヒーロー: ファーストビューでボタンまで到達させる */}
      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 pt-14 pb-12 text-center sm:pt-20">
        <Image
          src="/images/app/app-icon.png"
          alt="Green Collection アプリアイコン"
          width={96}
          height={96}
          priority
          className="rounded-[22px] shadow-lg"
        />
        <h1
          className="mt-6 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl"
          style={{ color: BRAND_CREAM }}
        >
          あつめるほど、
          <br />
          たのしくなる。
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-white/85 sm:text-base">
          Green Collection は、観葉植物のお世話と成長を記録する iPhone アプリです。
          <br className="hidden sm:block" />
          撮るだけでわかるAI図鑑、水やりリマインド、成長のBefore/After。
        </p>

        <div className="mt-9 flex w-full flex-col items-center gap-3">
          <AppStoreButton />
          <p className="text-xs text-white/60">
            iPhone / iPad 対応・無料ではじめられます
          </p>
        </div>

        {/* Instagram等のアプリ内ブラウザで万一開かなかった人向けの逃げ道 */}
        <p className="mt-6 max-w-sm text-[11px] leading-relaxed text-white/45">
          App Store が開かない場合は、画面右上の「…」から「Safariで開く」を選んで
          もう一度お試しください。
        </p>
      </section>

      {/* 機能紹介 */}
      <section className="mx-auto max-w-5xl px-5 pb-4">
        {features.map((f, i) => (
          <div
            key={f.image}
            className={`flex flex-col items-center gap-8 border-t border-white/10 py-14 sm:gap-14 sm:py-20 ${
              i % 2 === 1 ? "sm:flex-row-reverse" : "sm:flex-row"
            }`}
          >
            <div className="w-full max-w-[260px] shrink-0 sm:max-w-[300px]">
              <Image
                src={f.image}
                alt={f.alt}
                width={1242}
                height={f.height}
                sizes="(max-width: 640px) 260px, 300px"
                className="h-auto w-full"
              />
            </div>
            <div className="text-center sm:text-left">
              <h2
                className="text-2xl font-extrabold leading-snug sm:text-[28px]"
                style={{ color: BRAND_CREAM }}
              >
                {f.title}
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-white/85">
                {f.body}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* 2つめのCTA */}
      <section className="mx-auto flex max-w-2xl flex-col items-center border-t border-white/10 px-5 py-16 text-center">
        <h2
          className="text-2xl font-extrabold leading-snug"
          style={{ color: BRAND_CREAM }}
        >
          今日から、記録をはじめよう。
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-white/80">
          水やり管理はオフにもできます。頻度を気にせず、
          <br className="hidden sm:block" />
          ただ育てる楽しさだけを味わう使い方も。
        </p>
        <div className="mt-8 flex w-full flex-col items-center gap-3">
          <AppStoreButton />
          <p className="text-xs text-white/60">
            iPhone / iPad 対応・無料ではじめられます
          </p>
        </div>
      </section>

      {/* EC導線: アプリ訴求を邪魔しないよう最下部に控えめに置く */}
      <section className="border-t border-white/10 bg-white/5 px-5 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-widest text-white/50">
            FROM TOKYOPLANTS
          </p>
          <h2 className="mt-3 text-xl font-bold" style={{ color: BRAND_CREAM }}>
            土もタオルも、tokyoplants で。
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            アプリをつくっているのは、観葉植物の専門店 tokyoplants です。
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <a
              href="https://www.tokyoplants.com/items/99620939"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-white/10 px-5 py-4 text-left transition-colors hover:bg-white/15"
            >
              <p className="text-sm font-bold text-white">
                観葉植物の土『 I&apos;m original SOIL 』
              </p>
              <p className="mt-1 text-xs text-white/60">¥1,200〜</p>
            </a>
            <a
              href="https://www.tokyoplants.com/items/135803882"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-white/10 px-5 py-4 text-left transition-colors hover:bg-white/15"
            >
              <p className="text-sm font-bold text-white">
                Daily Botanical Towel｜リーフタオル
              </p>
              <p className="mt-1 text-xs text-white/60">¥2,000</p>
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px]">
            <a
              href="https://www.tokyoplants.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 underline-offset-4 hover:text-white hover:underline"
            >
              オンラインストア
            </a>
            <Link
              href="/"
              className="text-white/70 underline-offset-4 hover:text-white hover:underline"
            >
              育て方メディアを読む
            </Link>
            <a
              href="https://www.instagram.com/tokyoplants.jp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 underline-offset-4 hover:text-white hover:underline"
            >
              Instagram
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
