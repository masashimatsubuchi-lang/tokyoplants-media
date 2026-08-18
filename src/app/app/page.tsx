import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AppStoreButton from "@/components/AppStoreButton";
import FeatureVideo from "@/components/FeatureVideo";
import HeroVideo from "@/components/HeroVideo";
import StickyAppCta from "@/components/StickyAppCta";

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
//   背景  #FAF8F4  生成り
//   帯    #F1EEE6  セクションの区切り
//   見出し #16352A  深い緑。本文より一段濃くして視線を集める
//   本文  #5C5A52  温かみのあるグレー（背景に対して約6.2:1）
//   補足  #6E6C63  注記（約4.7:1。これ以上薄くすると読めない）
//   罫線  #E6E1D6
//   強調  #015440  ブランドグリーン。CTAの塗りに使う

const PAGE_TITLE = "Green Collection｜観葉植物のお世話と成長を記録するアプリ";
const PAGE_DESCRIPTION =
  "撮るだけで品種がわかるAI図鑑、水やりリマインド、成長のBefore/After記録。観葉植物の専門店 tokyoplants がつくった、育てる楽しさが続くiPhoneアプリです。3株までずっと無料。";

// 記事と同じ動的OG生成ルートを使う（1200x630）。
// スクショは縦長なので、SNSのカードに載せると上下が切れてしまう。
const OG_IMAGE = `/og?title=${encodeURIComponent(PAGE_TITLE)}`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/app" },
  openGraph: {
    type: "website",
    url: "/app",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  // ⚠️ twitter を省略すると layout.tsx のメディアサイト用の値（Unsplash画像つき）を
  // そのまま継承してしまう。XにこのURLを貼ったときに別サイトのカードが出るため、
  // og と同じ内容で必ず上書きすること。
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

// 端末画像は scripts/frame-app-screenshots.py で生成する（生スクショに枠を合成）。
// 背景が透明なので、どのセクションに置いても浮かない。
// 同じ機種のスクショなら出力サイズは揃うが、差し替え時は実行時に表示される
// height を必ず反映すること（実寸と違うとアスペクト比が崩れる）。
const SHOT_WIDTH = 900;
const SHOT_HEIGHT = 1894;

// 並び順は「実用フックで“使える”と思わせてから、情緒価値で“好き”にさせる」。
// 初見の人はまず自分の困りごとが解けるかを見ているため、水やり・登録・育て方を先に置く。
//
// width/height/containerClass は、端末フレームの縦長画像（900x1894）以外を
// 混ぜるときだけ指定する。ウィジェットのように横長のカードを同じ縦長の枠に
// 収めると小さく潰れるため、素材の実寸に合わせて上書きできるようにしてある。
type Feature = {
  image: string;
  alt: string;
  title: string;
  body: string;
  width?: number;
  height?: number;
  containerClass?: string;
  // 指定すると画像の代わりに端末フレームつきの自動再生動画を表示する
  // （FeatureVideo.tsx）。生成は scripts/make-feature-video.swift。
  video?: string;
  poster?: string;
};

const features: Feature[] = [
  {
    image: "/images/app/screen-add.png",
    video: "/videos/feature-ai-draft.mp4",
    poster: "/videos/feature-ai-draft-poster.jpg",
    alt: "植物を追加する画面。写真から背景を切り抜き、原産地・適温・適湿度・水やり頻度などをAIが自動入力する",
    title: "撮るだけで、図鑑クオリティ。",
    body: "写真を1枚追加すれば、AIが品種名から水やり頻度まで下書き。1,000種以上のデータから検索して選ぶこともできます。",
  },
  {
    image: "/images/app/screen-detail.png",
    video: "/videos/feature-light-meter.mp4",
    poster: "/videos/feature-light-meter-poster.jpg",
    alt: "光をはかる画面。葉っぱにカメラを向けて3秒待つと、実際の明るさをlux換算で表示し、この植物に合っているか判定する",
    title: "その場所の明るさ、写すだけで測れる。",
    body: "葉っぱを3秒写すだけで、実際の明るさをlux換算。この植物に合っているかをその場で判定し、同じ場所が合う株も教えてくれます。",
  },
  {
    image: "/images/app/screen-detail.png",
    video: "/videos/feature-ai-health-check.mp4",
    poster: "/videos/feature-ai-health-check-poster.jpg",
    alt: "AI健康チェック画面。葉が黄色くなっている状態に対し、植え替え直後の影響（高め）・水切れ（中程度）・光量不足（低め）と考えられる原因、試してみてほしいことが表示されている",
    title: "気になる症状も、写真でAIに相談。",
    body: "葉が黄色い、元気がないなど気になる症状を選んで写真を送ると、考えられる原因と試してほしいことをAIが教えてくれます。水やりや植え替えの記録もふまえて判断します。",
  },
  {
    image: "/images/app/screen-watering.png",
    alt: "「次のお水」画面。今日3株、明日2株、それ以降23株にまとまっている",
    title: "今日水やりをする植物が、ひと目でわかる。",
    body: "今日・明日・それ以降に自動でまとまります。株をダブルタップすれば、その場で水やりを記録。",
  },
  {
    image: "/images/app/screen-widget.png",
    width: 1096,
    height: 514,
    containerClass: "max-w-[300px] sm:max-w-[380px]",
    alt: "ホーム画面のウィジェット。今日水やりが必要な8株がサムネイルで並び、「ぜんぶ」ボタンがある",
    title: "ウィジェットで、今日のお世話がわかる。",
    body: "ホーム画面に置くだけで、水やりが必要な株がひと目で並びます。「ぜんぶ」をタップすれば、アプリを開かずまとめて記録完了に。",
  },
  {
    image: "/images/app/screen-detail.png",
    alt: "植物の詳細画面。適温、適湿度、日当たり、耐寒温度などの育て方データ",
    title: "適温も、湿度も、光の強さも。",
    body: "「レースカーテン越しの窓辺」まで具体的に。品種ごとの育て方が最初から入っているので、調べ直す必要がありません。",
  },
  {
    image: "/images/app/screen-calendar.png",
    alt: "カレンダー画面。日付ごとに水やりや剪定、メモの記録が並んでいる",
    title: "お世話は、ぜんぶカレンダーに残る。",
    body: "水やり・肥料・剪定・メモが日付ごとに積み上がります。植え替えの予定も自由に書き込めるので、季節の作業を先に決めておけます。",
  },
  {
    image: "/images/app/screen-collection.png",
    alt: "「うちの植物」画面。41株が並び、属ごとのフィルタと検索ができる",
    title: "増えても、迷わない。",
    body: "属ごとの絞り込み、名前・品種での検索、お気に入り。何十株になっても、探している子がすぐ見つかります。",
  },
  {
    image: "/images/app/screen-summary.png",
    alt: "今月のまとめ画面。新入り・水やり・お世話合計・使ったお金の4つの数字と、水やり回数ランキングが表示されている",
    title: "がんばった分が、数字になる。",
    body: "今月の水やり回数とお世話の合計、使った金額、いちばん世話した株のランキングが毎月まとまります。予算を決めておけば、使いすぎも防げます。",
  },
  {
    image: "/images/app/screen-characters.png",
    alt: "なかまたち図鑑の画面。ブルーム、ラム、クロなどのキャラクターと担当が並んでいる",
    title: "ひとりで育てない。8体のなかまたち。",
    body: "応援担当のブルーム、植物博士のラム、土と植え替えならクロ、静かに見守るシェイディ。それぞれの担当から、毎日ひとことずつ届きます。",
  },
];

// スクリーンショットを用意していない機能は、上の features（画像つき）ではなく
// ここにテキストだけで並べる。画像ありきの節を無理に増やすより、
// 「他にもこれだけできる」を一覧で見せたほうが読み進めやすい。
const extraFeatures = [
  {
    title: "棚をそのままシェア",
    body: "集めた棚を動画で書き出せます。フィード（4:5）とストーリーズ（9:16）から選べるので、加工なしでそのまま投稿できます。",
  },
  {
    title: "成長のBefore/After",
    body: "お迎えから1ヶ月・3ヶ月・1年…節目ごとに撮影をリマインド。並べれば、ちゃんと育っているのがひと目でわかります。",
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
];

// Free/Proの差分は、実際の課金判定コード（isProUser / requiresPro）の有無で確認してから
// 表に反映すること。特に「無料」列を書くときは、アプリ側で本当にゲートされていないか
// 確認する（見た目や思い込みで「Pro限定っぽい」と判断しない）。
// 光チェック・ウィジェット・クラウド同期は、いずれも該当コードにPro判定が一切なく、
// 無料ユーザーも無条件で使えることを確認済み（2026-08-13）。
const planRows: [string, string, string][] = [
  ["植物の登録・お世話の記録", "3株まで", "無制限"],
  // 回数・上限を数字で示す項目は続けて置き、○×だけの項目と混ざらないようにする
  // （アプリ内のプラン比較表と並び順を揃えている）。
  ["AI健康チェック", "月3回まで", "無制限"],
  ["写真からのAI種類判定", "○", "○"],
  ["成長タイムライン", "○", "○"],
  ["水やりリマインド", "○", "○"],
  ["光をはかる（光チェック）", "○", "○"],
  ["ホーム画面ウィジェット", "○", "○"],
  ["クラウド同期（機種変更対応）", "○", "○"],
  ["ともだちのコレクション閲覧", "○", "○"],
  ["季節に合わせた自動調整", "―", "○"],
  ["屋外栽培の天気連動調整", "―", "○"],
];

const faqs = [
  {
    q: "無料でどこまで使えますか？",
    a: "3株まで登録・記録できます。AIの種類判定、成長タイムライン、水やりリマインド、光チェック、ウィジェット、クラウド同期、ともだち機能は無料のまま使えます。AI健康チェックは月3回まで無料でお試しいただけます。4株以上を登録したい場合はProプランが必要です。",
  },
  {
    q: "Proプランでは何ができますか？",
    a: "植物を何株でも登録できるほか、AI健康チェックを月の回数制限なくご利用いただけます（無料プランは月3回まで）。さらに、季節に合わせて水やり間隔を自動調整するスマート通知と、屋外の植物向けの天気連動調整が使えます。",
  },
  {
    q: "解約はできますか？",
    a: "いつでも解約できます。iPhoneの「設定」＞ Apple ID ＞「サブスクリプション」から手続きしてください。",
  },
  {
    q: "AIの判定はどのくらい正確ですか？",
    a: "AIが出すのはあくまで「下書き」です。品種名も水やり頻度も、その場で自由に書き換えられます。似た品種は取り違えることもあるので、違っていたら直してください。登録済みの1,000種以上から検索して選ぶこともできます。",
  },
  {
    q: "通知はうるさくないですか？",
    a: "通知の強さを選べます。予定日の朝だけ知らせる設定にも、まだ水やりできていない株に毎日そっと知らせ続ける設定にもできます。通知を切ることも、水やり管理そのものをオフにすることもできます。",
  },
  {
    q: "Android版はありますか？",
    a: "現在はiPhone向けのみです。Android版は近日公開予定です。iPadでもダウンロードできますが、iPhone向けの画面がそのまま表示されます。",
  },
];

// ページ途中に挟むCTA。読み進めている間に「入れよう」と思った瞬間、
// その場で押せるようにするためのもの。
function InlineCta({ note }: { note: string }) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-2.5 px-5 py-12">
      <AppStoreButton />
      <p className="text-center text-[13px] font-medium text-[#16352A]">
        {note}
      </p>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-center text-[22px] font-bold leading-snug text-balance [word-break:auto-phrase] text-[#16352A] sm:text-[26px]">
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
    // pb-28 はモバイルの固定CTAバーのぶん。これがないと最下部のリンクが隠れる。
    <div className="bg-[#FAF8F4] pb-28 text-[#5C5A52] sm:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ヒーロー。アプリの顔である「アイコンが降ってくる」動画を主役に据える。
          動画が縦に長いぶん、アイコンと名前は横並びの小さなロックアップにまとめ、
          CTAが画面の下に押し出されすぎないようにしている。 */}
      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 pt-7 pb-14 text-center sm:pt-12">
        <div className="flex items-center gap-2.5">
          <Image
            src="/images/app/app-icon.png"
            alt=""
            aria-hidden
            width={40}
            height={40}
            priority
            className="rounded-[10px]"
          />
          <p className="text-[13px] font-semibold tracking-[0.16em] text-[#6E6C63]">
            GREEN COLLECTION
          </p>
        </div>

        {/* 見出しだけで「何のアプリか」が伝わるようにする。
            Instagramからの流入は最初の1画面で離脱を判断するため、
            説明文を読ませる前提のキャッチにしない。 */}
        <h1 className="mt-4 text-[27px] font-bold leading-[1.4] tracking-tight text-balance [word-break:auto-phrase] text-[#16352A] sm:text-[35px]">
          植物のお世話が、
          <br />
          コレクションになる。
        </h1>
        <p className="mt-4 text-[15px] leading-[1.85] text-pretty [word-break:auto-phrase] sm:text-base">
          開くたびに、育てている植物が降ってくる。
          <br />
          観葉植物の専門店がつくった、育てる楽しさが続くアプリ。
        </p>

        <div className="mt-5 flex justify-center">
          <HeroVideo />
        </div>

        <div className="mt-7 flex w-full flex-col items-center gap-2.5">
          <AppStoreButton />
          <p className="text-[13px] font-medium text-[#16352A]">
            3株までずっと無料
          </p>
          <p className="text-xs text-[#6E6C63]">
            iPhone対応（Android版は近日公開予定）
          </p>
        </div>
      </section>

      {/* 信頼バー。開発元はこのアプリ最大の差別化なので、フッター直前ではなく
          ファーストビューの直後に置く。
          ⚠️ App Storeの評価やDL数を足すのはここ。実数がはっきりするまでは
          憶測の数字を書かないこと。 */}
      <section className="border-y border-[#E6E1D6] bg-[#F1EEE6] px-5 py-5">
        <ul className="mx-auto flex max-w-3xl flex-col items-center gap-2 text-center text-[13px] text-[#16352A] sm:flex-row sm:justify-center sm:gap-8">
          <li className="font-semibold">観葉植物専門店 tokyoplants が開発</li>
          <li>1,000種以上の植物データを収録</li>
          <li>日本語・English・繁體中文・한국어</li>
        </ul>
      </section>

      {/* 機能紹介。余白と画像の交互配置でリズムをつくる */}
      <section className="border-t border-[#E6E1D6]">
        <div className="mx-auto max-w-5xl px-5">
          {features.map((f, i) => (
            <div
              // video指定時はimageがダミー値（アスペクト比合わせのポスター代わり）で
              // 重複しうるため、videoを優先してキーにする。
              key={f.video ?? f.image}
              className={`flex flex-col items-center gap-7 py-12 sm:gap-16 sm:py-20 ${
                i > 0 ? "border-t border-[#EFEBE1]" : ""
              } ${i % 2 === 1 ? "sm:flex-row-reverse" : "sm:flex-row"}`}
            >
              <div
                className={`w-full shrink-0 ${f.containerClass ?? "max-w-[240px] sm:max-w-[280px]"}`}
              >
                {f.video ? (
                  <FeatureVideo src={f.video} poster={f.poster!} alt={f.alt} />
                ) : (
                  <Image
                    src={f.image}
                    alt={f.alt}
                    width={f.width ?? SHOT_WIDTH}
                    height={f.height ?? SHOT_HEIGHT}
                    sizes="(max-width: 640px) 280px, 380px"
                    className="h-auto w-full drop-shadow-[0_14px_30px_rgba(22,53,42,0.16)]"
                  />
                )}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-[22px] font-bold leading-snug text-balance [word-break:auto-phrase] text-[#16352A] sm:text-[27px]">
                  {f.title}
                </h2>
                <p className="mt-4 text-[15px] leading-[1.9] text-pretty [word-break:auto-phrase]">
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 中間CTA①: 主要機能を見終えた直後 */}
      <section className="border-t border-[#E6E1D6]">
        <InlineCta note="3株までずっと無料" />
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
                <h3 className="text-[15px] font-bold text-balance [word-break:auto-phrase] text-[#16352A]">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-[1.85] text-pretty [word-break:auto-phrase]">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 料金プラン。帯を敷いて、他のセクションと区別する */}
      <section className="border-t border-[#E6E1D6] bg-[#F1EEE6] px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <SectionHeading>まずは無料で、3株から。</SectionHeading>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-[1.9] text-pretty [word-break:auto-phrase]">
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
          {/* 中間CTA②: 料金を見て納得した直後 */}
          <InlineCta note="まずは無料の3株から。あとから変更できます" />
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
                <dt className="text-[15px] font-bold text-balance [word-break:auto-phrase] text-[#16352A]">
                  {f.q}
                </dt>
                <dd className="mt-2 text-sm leading-[1.85] text-pretty [word-break:auto-phrase]">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 最終CTA */}
      <section className="border-t border-[#E6E1D6] bg-white px-5 py-16">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className="text-[22px] font-bold leading-snug text-balance [word-break:auto-phrase] text-[#16352A] sm:text-[26px]">
            最初の1株を、登録してみよう。
          </h2>
          <p className="mt-4 text-sm leading-[1.9] text-pretty [word-break:auto-phrase]">
            3株までずっと無料。水やり管理はオフにして、
            <br className="hidden sm:block" />
            ただ育てる楽しさだけ味わうのもOK。
          </p>
          <div className="mt-8 flex w-full flex-col items-center gap-2.5">
            <AppStoreButton />
            <p className="text-xs text-[#6E6C63]">
              iPhone対応（Android版は近日公開予定）
            </p>
          </div>

          {/* Instagram等のアプリ内ブラウザで万一開かなかった人向けの逃げ道。
              ヒーローに置くと不安要素として目立ってしまうので、ここまで下げている。
              メニューの名称はInstagramの表記に合わせること（「Safariで開く」ではない）。 */}
          <p className="mt-8 max-w-sm text-[11px] leading-relaxed text-[#8C8A80]">
            App Store
            が開かない場合は、画面右上の「…」から「外部ブラウザで開く」を
            選んで、もう一度お試しください。
          </p>
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

      <StickyAppCta />
    </div>
  );
}
