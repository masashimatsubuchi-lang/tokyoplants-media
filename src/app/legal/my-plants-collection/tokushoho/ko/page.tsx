import { Metadata } from "next";

export const metadata: Metadata = {
  title: "일본 특정상거래법에 따른 표기 | my Plants Collection",
  description:
    "앱 「my Plants Collection」의 일본 특정상거래법에 따른 표기",
};

const rows: [string, string][] = [
  ["판매사업자", "마쓰부치 마사시"],
  ["운영 총괄 책임자", "마쓰부치 마사시"],
  ["소재지", "청구를 받은 경우 지체 없이 공개합니다. ※1"],
  ["전화번호", "청구를 받은 경우 지체 없이 공개합니다. ※1"],
  ["이메일 주소", "tokyoplants.shop@gmail.com"],
  [
    "판매 가격",
    "각 플랜의 가격은 본 앱 내 및 App Store 상품 페이지에 표시된 금액(세금 포함)에 따릅니다",
  ],
  [
    "상품 대금 이외의 필요 요금",
    "인터넷 접속에 필요한 통신료는 고객님이 부담하셔야 합니다",
  ],
  [
    "결제 방법",
    "Apple Inc.가 제공하는 App Store 결제(Apple ID에 등록된 결제 수단)",
  ],
  ["결제 시기", "구독 신청 시 및 계약이 자동 갱신될 때마다"],
  [
    "서비스 제공 시기",
    "결제 절차 완료 후 즉시 Pro 플랜 기능을 이용하실 수 있습니다",
  ],
  [
    "반품・해지에 대하여",
    "디지털 콘텐츠의 특성상 구매 후 반품은 불가합니다. 환불을 원하시는 경우 Apple이 정하는 환불 정책 및 절차에 따라 주십시오. 구독 해지는 다음 갱신 24시간 전까지 사용자 기기의 「설정」＞Apple ID＞구독에서 진행할 수 있습니다",
  ],
  ["동작 환경", "iOS 17.0 이상"],
];

export default function TokushohoPageKo() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">
        일본 특정상거래법에 따른 표기
      </h1>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <p>
          본 앱 「my Plants Collection」의 Pro 플랜(구독) 판매와 관련하여,
          일본 특정상거래법 제11조에 근거하여 다음과 같이 표시합니다. 이는
          일본 국내법인 특정상거래법에 따른 표기이며, 판매사업자가 일본
          거주자임을 밝히는 것입니다.
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
          ※1 일본 특정상거래법상, 통신판매에서 연락처 공개가 곤란한 개인
          사업자 등의 경우, 청구를 받았을 때 지체 없이 공개한다는 뜻을
          명기함으로써 소재지・전화번호의 상시 공개를 생략할 수 있는 운용이
          일본 소비자청의 해석상 인정되고 있습니다.
        </p>

        <p className="mt-8 text-sm text-gray-500">
          본 한국어 번역본은 참고용으로 제공되며, 내용에 차이가 있는 경우{" "}
          <a
            className="text-emerald-700 underline"
            href="https://media.tokyoplants.com/legal/my-plants-collection/tokushoho"
          >
            일본어판
          </a>{" "}
          이 우선합니다. 영어판은{" "}
          <a
            className="text-emerald-700 underline"
            href="https://media.tokyoplants.com/legal/my-plants-collection/tokushoho/en"
          >
            여기
          </a>
          에서, 번체 중국어판은{" "}
          <a
            className="text-emerald-700 underline"
            href="https://media.tokyoplants.com/legal/my-plants-collection/tokushoho/zh-Hant"
          >
            여기
          </a>
          에서 확인하실 수 있습니다.
        </p>
      </div>
    </div>
  );
}
