import { Metadata } from "next";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | my Plants Collection",
  description: "アプリ「my Plants Collection」の特定商取引法に基づく表記",
};

const rows: [string, string][] = [
  ["販売事業者", "松淵 将史"],
  ["運営統括責任者", "松淵 将史"],
  ["所在地", "ご請求をいただいた場合には、遅滞なく開示いたします。※1"],
  ["電話番号", "ご請求をいただいた場合には、遅滞なく開示いたします。※1"],
  ["メールアドレス", "tokyoplants.shop@gmail.com"],
  [
    "販売価格",
    "各プランの価格は、本アプリ内および App Store の商品ページに表示された金額（税込）によります",
  ],
  [
    "商品代金以外の必要料金",
    "インターネット接続に必要な通信料はお客様のご負担となります",
  ],
  [
    "お支払い方法",
    "Apple Inc. の提供する App Store 決済（Apple ID に登録のお支払い方法）",
  ],
  ["お支払い時期", "サブスクリプションのお申し込み時、および契約が自動更新される都度"],
  [
    "サービスの提供時期",
    "お支払い手続き完了後、直ちにProプランの機能をご利用いただけます",
  ],
  [
    "返品・キャンセルについて",
    "デジタルコンテンツの性質上、購入後の返品には応じられません。返金をご希望の場合は、Appleの定める返金ポリシーおよび手続きに従ってください。サブスクリプションの解約は、次回更新の24時間前までにお客様の端末の「設定」＞Apple ID＞サブスクリプションから行うことができます",
  ],
  ["動作環境", "iOS 17.0 以降"],
];

export default function TokushohoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">
        特定商取引法に基づく表記
      </h1>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <p>
          本アプリ「my Plants Collection」のProプラン（サブスクリプション）販売に関して、特定商取引法第11条に基づき、以下のとおり表示します。
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <tbody>
              {rows.map(([label, value]) => (
                <tr key={label}>
                  <th className="w-48 whitespace-nowrap border border-gray-200 bg-gray-50 px-3 py-2 text-left align-top">
                    {label}
                  </th>
                  <td className="border border-gray-200 px-3 py-2">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-gray-500">
          ※1
          特定商取引法上、通信販売において連絡先の公開が困難な個人事業主等については、請求を受けた場合に遅滞なく開示する旨を明記することで、所在地・電話番号の常時公開を省略できる運用が消費者庁の解釈により認められています。
        </p>
      </div>
    </div>
  );
}
