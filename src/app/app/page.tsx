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
//
// 配色（ナチュラル・低コントラストすぎない範囲で明るく）
//   背景  #FAF8F4  生成り。⚠️ scripts/prepare-app-screenshots.py の PAGE_BG と
//                  同じ値にすること。スクショの端末まわりをこの色で塗っているため、
//                  ここだけ変えると端末の背景が浮く
//   帯    #F1EEE6  セクションの区切り
//   見出し #16352A  深い緑。本文より一段濃くして視線を集める
//   本文  #5C5A52  温かみのあるグレー（背景に対して約6.2:1）
//   補足  #6E6C63  注記（約4.7:1。これ以上薄くすると読めない）
//   罫線  #E6E1D6
//   強調  #015440  ブランドグリーン。CTAの塗りに使う

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
// 生成は scripts/prepare-app-screenshots.py。実行すると入れるべき height が表示される。
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

const planRows: [string, string, string][] = [
  ["植物の登録・お世話の記録", "3株まで", "無制限"],
  ["写真からのAI種類判定", "○", "○"],
  ["成長タイムライン", "○", "○"],
  ["水やりリマインド", "○", "○"],
  ["ともだちのコレクション閲覧", "○", "○"],
  ["季節に合わせた自動調整", "―", "○"],
  ["屋外栽培の天気連動調整", "―", "○"],
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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-center text-[22px] font-bold leading-snug text-[#16352A] sm:text-[26px]">
      {children}
    </h2>
  );
}

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
    <div className="bg-[#FAF8F4] text-[#5C5A52]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ヒーロー: ファーストビューでボタンまで到達させる */}
      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 pt-12 pb-14 text-center sm:pt-16">
        <Image
          src="/images/app/app-icon.png"
          alt="Green Collection アプリアイコン"
          width={88}
          height={88}
          priority
          className="rounded-[20px] shadow-[0_6px_20px_rgba(22,53,42,0.13)]"
        />
        <p className="mt-5 text-[13px] font-semibold tracking-[0.18em] text-[#6E6C63]">
          GREEN COLLECTION
        </p>
        <h1 className="mt-3 text-[30px] font-bold leading-[1.35] tracking-tight text-[#16352A] sm:text-[38px]">
          あつめるほど、
          <br />
          たのしくなる。
        </h1>
        <p className="mt-5 text-[15px] leading-[1.9] sm:text-base">
          観葉植物のお世話と成長を記録する iPhone アプリです。
          <br className="hidden sm:block" />
          撮るだけでわかるAI図鑑、水やりリマインド、成長のBefore/After。
        </p>

        <div className="mt-9 flex w-full flex-col items-center gap-3">
          <AppStoreButton />
          <p className="text-xs text-[#6E6C63]">iPhone対応・無料ではじめられます</p>
        </div>

        {/* Instagram等のアプリ内ブラウザで万一開かなかった人向けの逃げ道 */}
        <p className="mt-6 max-w-sm text-[11px] leading-relaxed text-[#8C8A80]">
          App Store が開かない場合は、画面右上の「…」から「Safariで開く」を選んで
          もう一度お試しください。
        </p>
      </section>

      {/* 機能紹介。余白と画像の交互配置でリズムをつくる。
          ⚠️ このセクションの背景はページ背景(#FAF8F4)のままにすること。
          スクショの端末まわりを同じ色で塗ってあるので、白にすると端末の背景が四角く浮く。 */}
      <section className="border-t border-[#E6E1D6]">
        <div className="mx-auto max-w-5xl px-5">
          {features.map((f, i) => (
            <div
              key={f.image}
              className={`flex flex-col items-center gap-7 py-12 sm:gap-16 sm:py-20 ${
                i > 0 ? "border-t border-[#EFEBE1]" : ""
              } ${i % 2 === 1 ? "sm:flex-row-reverse" : "sm:flex-row"}`}
            >
              <div className="w-full max-w-[250px] shrink-0 sm:max-w-[290px]">
                <Image
                  src={f.image}
                  alt={f.alt}
                  width={1242}
                  height={f.height}
                  sizes="(max-width: 640px) 250px, 290px"
                  className="h-auto w-full"
                />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-[22px] font-bold leading-snug text-[#16352A] sm:text-[27px]">
                  {f.title}
                </h2>
                <p className="mt-4 text-[15px] leading-[1.9]">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 画像なしの機能一覧 */}
      <section className="border-t border-[#E6E1D6] px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <SectionHeading>まだまだ、できることがあります。</SectionHeading>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {extraFeatures.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-[#EAE5DA] bg-white p-5"
              >
                <h3 className="text-[15px] font-bold text-[#16352A]">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-[1.85]">{f.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-9 text-center text-xs text-[#6E6C63]">
            日本語・English・繁體中文・한국어に対応しています。
          </p>
        </div>
      </section>

      {/* 料金プラン。帯を敷いて、他のセクションと区別する */}
      <section className="border-t border-[#E6E1D6] bg-[#F1EEE6] px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <SectionHeading>まずは無料で、3株から。</SectionHeading>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-[1.9]">
            主な機能は無料のまま使えます。もっとたくさん育てたくなったら、Proプランへ。
          </p>

          <div className="mt-9 overflow-hidden rounded-2xl border border-[#E0DACD] bg-white">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#F7F5EF]">
                  <th className="px-4 py-3 text-left font-semibold text-[#16352A]">
                    できること
                  </th>
                  <th className="w-[22%] px-2 py-3 text-center font-semibold text-[#6E6C63]">
                    無料
                  </th>
                  <th className="w-[22%] bg-[#015440] px-2 py-3 text-center font-bold text-white">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                {planRows.map(([label, free, pro]) => (
                  <tr key={label} className="border-t border-[#EFEBE1]">
                    <td className="px-4 py-3">{label}</td>
                    <td className="px-2 py-3 text-center text-[#6E6C63]">
                      {free}
                    </td>
                    <td className="bg-[#015440]/[0.04] px-2 py-3 text-center font-semibold text-[#015440]">
                      {pro}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-center text-xs leading-relaxed text-[#6E6C63]">
            Proプランの料金はApp Storeおよびアプリ内でご確認いただけます。
            <br className="hidden sm:block" />
            サブスクリプションは自動更新され、いつでも解約できます。
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[#E6E1D6] px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <SectionHeading>よくある質問</SectionHeading>
          <dl className="mt-9 space-y-3">
            {faqs.map((f) => (
              <div
                key={f.q}
                className="rounded-2xl border border-[#EAE5DA] bg-white p-5"
              >
                <dt className="text-[15px] font-bold text-[#16352A]">{f.q}</dt>
                <dd className="mt-2 text-sm leading-[1.85]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 2つめのCTA */}
      <section className="border-t border-[#E6E1D6] bg-white px-5 py-16">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className="text-[22px] font-bold leading-snug text-[#16352A] sm:text-[26px]">
            今日から、記録をはじめよう。
          </h2>
          <p className="mt-4 text-sm leading-[1.9]">
            水やり管理はオフにもできます。頻度を気にせず、
            <br className="hidden sm:block" />
            ただ育てる楽しさだけを味わう使い方も。
          </p>
          <div className="mt-8 flex w-full flex-col items-center gap-3">
            <AppStoreButton />
            <p className="text-xs text-[#6E6C63]">
              iPhone対応・無料ではじめられます
            </p>
          </div>
        </div>
      </section>

      {/* 最下部のリンク行。以前はここに商品バナー（土・タオル）を置いていたが、
          アプリのダウンロードだけに集中させるため外した。 */}
      <section className="border-t border-[#E6E1D6] px-5 py-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm leading-relaxed">
            アプリをつくっているのは、観葉植物の専門店 tokyoplants です。
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px]">
            <a
              href="https://www.tokyoplants.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#015440] underline-offset-4 hover:underline"
            >
              オンラインストア
            </a>
            <Link
              href="/"
              className="text-[#015440] underline-offset-4 hover:underline"
            >
              育て方メディアを読む
            </Link>
            <a
              href="https://www.instagram.com/tokyoplants.jp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#015440] underline-offset-4 hover:underline"
            >
              Instagram
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
