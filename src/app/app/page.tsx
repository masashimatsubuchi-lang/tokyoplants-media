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
    body: "写真を撮るだけで、AIが品種名・育て方・水やり頻度まで下書きしてくれます。1,000種以上を登録済みで、随時追加中。",
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

// スクリーンショットを用意していない機能は、上の features（画像つき）ではなく
// ここにテキストだけで並べる。画像ありきの節を無理に増やすより、
// 「他にもこれだけできる」を一覧で見せたほうが読み進めやすい。
const extraFeatures = [
  {
    title: "棚をそのままシェア",
    body: "集めた棚を画像・動画で書き出せます。フィード（4:5）とストーリーズ（9:16）から選べるので、そのまま投稿できます。",
  },
  {
    title: "ホーム画面ウィジェット",
    body: "水やりが必要な株をロック解除せずに確認。ウィジェットからワンタップでそのまま記録できます。",
  },
  {
    title: "ともだちと見せ合う",
    body: "QRコードを読み取るだけでつながれます。おたがいのコレクションを覗いたり、葉水を送って応援したり。",
  },
  {
    title: "機種変更でも消えない",
    body: "Apple・Google・LINEでログインすると、植物の記録をクラウドに保存。新しい端末でもそのまま続きから育てられます。",
  },
  {
    title: "思い出図鑑",
    body: "お別れした植物も、写真とメモを添えて残しておけます。枯らしてしまっても、育てた日々は消えません。",
  },
  {
    title: "自分の予定も書ける",
    body: "カレンダーには水やり以外の予定も追加できます。植え替えの計画も、開花の記録も自由に。",
  },
];

const faqs = [
  {
    q: "無料でどこまで使えますか？",
    a: "3株まで登録・記録できます。AIの種類判定、成長タイムライン、水やりリマインド、ともだち機能は無料のまま使えます。4株以上を登録したい場合はProプランが必要です。",
  },
  {
    q: "Proプランでは何ができますか？",
    a: "植物を何株でも登録できるほか、季節に合わせて水やり間隔を自動調整するスマート通知と、屋外の植物向けの天気連動調整が使えます。",
  },
  {
    q: "解約はできますか？",
    a: "いつでも解約できます。iPhoneの「設定」＞ Apple ID ＞「サブスクリプション」から手続きしてください。",
  },
  {
    q: "Android版はありますか？",
    a: "現在はiPhone向けのみです。iPadでもダウンロードできますが、iPhone向けの画面がそのまま表示されます。",
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
    // ダウンロード自体は無料。Proプランはアプリ内課金なので、価格が変わっても
    // ここを直さずに済むよう金額は持たせない（表示は上のプラン表とApp Store側が正）。
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    publisher: { "@type": "Organization", name: "tokyoplants" },
  };

  // ページ内のFAQと同じ内容。検索結果にFAQが出る可能性を作る。
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div style={{ backgroundColor: BRAND_GREEN }} className="text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
            iPhone対応・無料ではじめられます
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

      {/* 画像なしの機能一覧 */}
      <section className="mx-auto max-w-5xl border-t border-white/10 px-5 py-14 sm:py-20">
        <h2
          className="text-center text-2xl font-extrabold leading-snug sm:text-[28px]"
          style={{ color: BRAND_CREAM }}
        >
          まだまだ、できることがあります。
        </h2>
        <div className="mt-10 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {extraFeatures.map((f) => (
            <div key={f.title}>
              <h3 className="text-base font-bold" style={{ color: BRAND_CREAM }}>
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                {f.body}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-xs text-white/50">
          日本語・English・繁體中文・한국어に対応しています。
        </p>
      </section>

      {/* 料金プラン */}
      <section className="mx-auto max-w-3xl border-t border-white/10 px-5 py-14 sm:py-20">
        <h2
          className="text-center text-2xl font-extrabold leading-snug sm:text-[28px]"
          style={{ color: BRAND_CREAM }}
        >
          まずは無料で、3株から。
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-white/80">
          主な機能は無料のまま使えます。もっとたくさん育てたくなったら、
          Proプランへ。
        </p>

        <div className="mt-9 overflow-hidden rounded-2xl border border-white/15">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-white/10">
                <th className="px-4 py-3 text-left font-semibold text-white/80">
                  できること
                </th>
                <th className="w-[22%] px-2 py-3 text-center font-semibold text-white/80">
                  無料
                </th>
                <th
                  className="w-[22%] px-2 py-3 text-center font-bold"
                  style={{ color: BRAND_CREAM }}
                >
                  Pro
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["植物の登録・お世話の記録", "3株まで", "無制限"],
                ["写真からのAI種類判定", "○", "○"],
                ["成長タイムライン", "○", "○"],
                ["水やりリマインド", "○", "○"],
                ["ともだちのコレクション閲覧", "○", "○"],
                ["季節に合わせた自動調整", "―", "○"],
                ["屋外栽培の天気連動調整", "―", "○"],
              ].map(([label, free, pro]) => (
                <tr key={label} className="border-t border-white/10">
                  <td className="px-4 py-3 text-white/85">{label}</td>
                  <td className="px-2 py-3 text-center text-white/60">
                    {free}
                  </td>
                  <td
                    className="px-2 py-3 text-center font-semibold"
                    style={{ color: BRAND_CREAM }}
                  >
                    {pro}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-5 text-center text-xs leading-relaxed text-white/50">
          Proプランの料金はApp Storeおよびアプリ内でご確認いただけます。
          <br className="hidden sm:block" />
          サブスクリプションは自動更新され、いつでも解約できます。
        </p>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl border-t border-white/10 px-5 py-14 sm:py-20">
        <h2
          className="text-center text-2xl font-extrabold leading-snug sm:text-[28px]"
          style={{ color: BRAND_CREAM }}
        >
          よくある質問
        </h2>
        <dl className="mt-9 space-y-7">
          {faqs.map((f) => (
            <div key={f.q}>
              <dt className="text-base font-bold" style={{ color: BRAND_CREAM }}>
                {f.q}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-white/80">
                {f.a}
              </dd>
            </div>
          ))}
        </dl>
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
            iPhone対応・無料ではじめられます
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
