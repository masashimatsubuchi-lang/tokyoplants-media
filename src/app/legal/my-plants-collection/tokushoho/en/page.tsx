import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal Notice (Specified Commercial Transactions Act) | my Plants Collection",
  description:
    "Disclosure under Japan's Specified Commercial Transactions Act for the app \"my Plants Collection\"",
};

const rows: [string, string][] = [
  ["Seller", "Masashi Matsubuchi"],
  ["Person in charge of operations", "Masashi Matsubuchi"],
  [
    "Address",
    "Will be disclosed without delay upon request. *1",
  ],
  [
    "Phone number",
    "Will be disclosed without delay upon request. *1",
  ],
  ["Email address", "tokyoplants.shop@gmail.com"],
  [
    "Sales price",
    "The price of each plan is as displayed within the App and on the App Store product page (tax included)",
  ],
  [
    "Fees other than the product price",
    "Internet connection charges are borne by the customer",
  ],
  [
    "Payment method",
    "App Store payment provided by Apple Inc. (payment method registered to your Apple ID)",
  ],
  [
    "Timing of payment",
    "At the time of subscribing and each time the subscription automatically renews",
  ],
  [
    "Timing of service provision",
    "Pro plan features become available immediately after payment is completed",
  ],
  [
    "Returns and cancellations",
    "Due to the nature of digital content, returns are not accepted after purchase. If you wish to request a refund, please follow Apple's refund policy and procedures. Subscriptions can be cancelled from Settings > Apple ID > Subscriptions on your device at least 24 hours before the next renewal",
  ],
  ["System requirements", "iOS 17.0 or later"],
];

export default function TokushohoPageEn() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">
        Legal Notice under the Specified Commercial Transactions Act
      </h1>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <p>
          The following disclosure is made pursuant to Article 11 of Japan&apos;s Act on
          Specified Commercial Transactions in connection with the sale of the Pro plan
          (subscription) of the app &quot;my Plants Collection.&quot;
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
          *1 Under the Act on Specified Commercial Transactions, individual sole proprietors for
          whom disclosing contact details in mail-order sales would be difficult are, per the
          Consumer Affairs Agency&apos;s interpretation, permitted to omit the ongoing public
          disclosure of their address and phone number by stating that this information will be
          disclosed without delay upon request.
        </p>

        <p className="mt-8 text-sm text-gray-500">
          This English translation is provided for convenience only. In the event of any
          discrepancy, the{" "}
          <a
            className="text-emerald-700 underline"
            href="https://media.tokyoplants.com/legal/my-plants-collection/tokushoho"
          >
            Japanese version
          </a>{" "}
          shall prevail. A Traditional Chinese translation is also available{" "}
          <a
            className="text-emerald-700 underline"
            href="https://media.tokyoplants.com/legal/my-plants-collection/tokushoho/zh-Hant"
          >
            here
          </a>
          , and a Korean translation is also available{" "}
          <a
            className="text-emerald-700 underline"
            href="https://media.tokyoplants.com/legal/my-plants-collection/tokushoho/ko"
          >
            here
          </a>
          .
        </p>
      </div>
    </div>
  );
}
