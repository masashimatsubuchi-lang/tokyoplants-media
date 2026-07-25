import { Metadata } from "next";

export const metadata: Metadata = {
  title: "依日本《特定商業交易法》規定之標示 | my Plants Collection",
  description:
    "應用程式「my Plants Collection」依日本《特定商業交易法》所為之揭露",
};

const rows: [string, string][] = [
  ["銷售業者", "松淵 將史"],
  ["業務統籌負責人", "松淵 將史"],
  ["所在地", "如收到請求，將於不遲延之情況下揭露。※1"],
  ["電話號碼", "如收到請求，將於不遲延之情況下揭露。※1"],
  ["電子郵件地址", "tokyoplants.shop@gmail.com"],
  [
    "銷售價格",
    "各方案之價格，以本應用程式內及 App Store 商品頁面所顯示之金額（含稅）為準",
  ],
  [
    "商品價款以外之必要費用",
    "使用網際網路連線所需之通訊費用由使用者自行負擔",
  ],
  [
    "付款方式",
    "透過 Apple Inc. 提供之 App Store 付款（以 Apple ID 登錄之付款方式進行）",
  ],
  ["付款時期", "訂閱申請時，以及契約每次自動續約時"],
  [
    "服務提供時期",
    "完成付款手續後，即可立即使用 Pro 方案之功能",
  ],
  [
    "退貨與解約相關事宜",
    "基於數位內容之性質，購買後恕不接受退貨。如欲申請退款，請依 Apple 所定之退款政策及程序辦理。訂閱之解約，可於下次更新前24小時，透過您裝置之「設定」＞Apple ID＞訂閱項目進行",
  ],
  ["系統需求", "iOS 17.0 以上版本"],
];

export default function TokushohoPageZhHant() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">
        依日本《特定商業交易法》規定之標示
      </h1>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <p>
          有關本應用程式「my Plants Collection」之 Pro
          方案（訂閱）銷售，依日本《特定商業交易法》第11條規定，標示如下。
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
          依日本《特定商業交易法》規定，就通訊販賣業務中公開聯絡方式有困難之個人事業主等，依日本消費者廳之解釋，得以「如收到請求，將於不遲延之情況下揭露」之方式表明，而免除所在地與電話號碼之常態性公開。
        </p>

        <p className="mt-8 text-sm text-gray-500">
          本繁體中文譯本僅供參考之用。如本譯本與日文版之間有任何歧異，應以
          <a
            className="text-emerald-700 underline"
            href="https://media.tokyoplants.com/legal/my-plants-collection/tokushoho"
          >
            日文版
          </a>
          為準。英文版本請參閱
          <a
            className="text-emerald-700 underline"
            href="https://media.tokyoplants.com/legal/my-plants-collection/tokushoho/en"
          >
            English
          </a>
          。
        </p>
      </div>
    </div>
  );
}
