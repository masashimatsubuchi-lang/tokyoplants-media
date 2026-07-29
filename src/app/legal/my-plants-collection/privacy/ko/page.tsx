import { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 | my Plants Collection",
  description: "앱 「my Plants Collection」의 개인정보처리방침",
};

export default function PrivacyPolicyPageKo() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">개인정보처리방침</h1>
      <p className="mt-4 text-sm text-gray-500">
        제정일: 2026년 7월 14일
        <br />
        최종 개정일: 2026년 7월 14일
      </p>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <p>
          마쓰부치 마사시(이하 &quot;당사&quot;라 합니다)는 당사가 제공하는
          애플리케이션 &quot;my Plants Collection&quot;(이하 &quot;본
          앱&quot;이라 합니다)에서 이용자 정보를 어떻게 취급하는지에 대해 다음과
          같이 개인정보처리방침(이하 &quot;본 방침&quot;이라 합니다)을
          정합니다.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">1. 기본 방침</h2>
          <p className="mt-2">
            본 앱은 이용자가 등록한 식물의 정보・사진・관리 기록을 관리하기
            위한 앱입니다. 본 앱은 로그인하지 않아도 모든 기능을 이용하실 수
            있으며, 이 경우 이용자가 입력한 데이터는{" "}
            <strong>
              기기 내에만 저장되며 당사나 제3자의 서버로 전송・저장되지
              않습니다
            </strong>
            . 이용자가 임의로 로그인(Google／Apple／Facebook／LINE 중 하나)을
            한 경우에 한해, 기기 변경 시 데이터 이전 등을 목적으로 제3항에
            기재된 바와 같이 클라우드에 데이터가 동기화됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            2. 수집하는 정보와 수집 방법
          </h2>
          <div className="mt-2 overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-200 px-3 py-2 text-left">
                    정보 종류
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left">
                    수집 방법
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left">
                    저장 위치
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">
                    식물 이름・맞이한 날짜・관리 기록・메모 등 텍스트 정보
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    이용자가 본 앱 내에서 입력
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    기기 내(SwiftData를 통한 로컬 저장). 로그인 시에는
                    제3항의 클라우드에도 저장
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">
                    식물 사진
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    본 앱의 카메라 기능으로 촬영
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    기기 내(앱의 Documents 디렉터리). 로그인 시에는 제3항의
                    클라우드에도 저장
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">
                    로그인에 사용되는 이메일 주소・계정 식별자
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    로그인 시 Google／Apple／Facebook／LINE 중 하나의 인증
                    서비스로부터 취득
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    클라우드(제3항 참조)
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">
                    푸시 알림 허용 상태
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    OS의 알림 허용 설정
                  </td>
                  <td className="border border-gray-200 px-3 py-2">기기 내</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">
                    구매・구독 현황
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    Apple Inc.의 App Store 결제 시스템
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    Apple社 및 결제 관리 사업자(제5항 참조)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2">
            본 앱은 위치 정보・연락처・기기 식별자 등 위에 기재되지 않은
            정보는 수집하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            3. 로그인・클라우드 동기화 기능에 대하여
          </h2>
          <p className="mt-2">
            본 앱에서는 이용자가 임의로 Google・Apple・Facebook・LINE 중
            하나의 계정을 사용하여 로그인할 수 있습니다. 로그인은 필수가
            아니며, 로그인하지 않는 경우에도 본 앱의 모든 기능을 지금까지와
            동일하게 이용하실 수 있습니다.
          </p>
          <p className="mt-2">
            로그인을 한 경우, 기기 변경이나 앱 재설치를 하더라도 데이터를
            이어받을 수 있도록, 식물 정보・관리 기록・사진이 당사가 이용하는
            클라우드 서비스 &quot;Supabase&quot;(Supabase, Inc. 제공)의 서버
            상에 이용자별로 구분되어 저장됩니다. 저장된 데이터는 당사 이외의
            제3자가 접근할 수 없도록 접근 제어(Row Level Security)로 보호되고
            있습니다. Supabase 측의 취급에 대해서는 Supabase의
            개인정보처리방침(
            <a
              className="text-emerald-700 underline"
              href="https://supabase.com/privacy"
            >
              https://supabase.com/privacy
            </a>
            )을 확인해 주십시오.
          </p>
          <p className="mt-2">
            로그인 기능을 구현하기 위해 Google・Apple・Facebook・LINE 각
            사의 인증 서비스에 인증에 필요한 범위의 정보(이메일 주소 등)가
            전송됩니다. 각 사의 취급에 대해서는 각각의 개인정보처리방침을
            확인해 주십시오.
          </p>
          <p className="mt-2">
            로그인 후 로그아웃한 경우, 클라우드 상 데이터의 동기화는
            중지되지만 클라우드 상의 데이터 자체는 삭제되지 않습니다.
            클라우드 상 데이터의 삭제를 원하시는 경우에는 본 앱의 설정
            화면에서 &quot;계정 삭제&quot; 조작을 하시거나, 제10항의
            문의처로 연락해 주십시오.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            4. 제3자에 대한 정보 제공(AI 식물 판별 기능)
          </h2>
          <p className="mt-2">
            본 앱의 &quot;AI로 식물 판정하기&quot; 기능을 이용하는 경우에
            한해, 이용자가 촬영한 식물 사진 데이터가 식물 판별 서비스
            &quot;Pl@ntNet&quot;(Pl@ntNet 프로젝트 운영처)으로 전송됩니다.
            이는 판별 결과를 취득하기 위해 필요한 처리이며, 전송된 이미지를
            당사가 저장・재이용하는 일은 없습니다. Pl@ntNet 측의 취급에
            대해서는 Pl@ntNet의 개인정보처리방침(
            <a
              className="text-emerald-700 underline"
              href="https://plantnet.org/en/privacy-policy/"
            >
              https://plantnet.org/en/privacy-policy/
            </a>
            )을 확인해 주십시오.
          </p>
          <p className="mt-2">
            이 기능을 이용하지 않는 경우, 사진 데이터가 외부로 전송되는
            일은 없습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            5. 구독(Pro 플랜)에 관한 정보
          </h2>
          <p className="mt-2">
            Pro 플랜 신청은 Apple이 제공하는 App Store 결제 시스템을 통해
            이루어집니다. 결제 정보(신용카드 번호 등)는 당사가 취득・보유하지
            않으며, Apple Inc.가 관리합니다.
          </p>
          <p className="mt-2">
            또한 구매 현황(유효기간 등)의 관리에는 RevenueCat, Inc.의
            서비스를 이용하고 있으며, 구매에 관한 정보(구매 일시・유효기간・
            익명의 기기 식별자 등. 신용카드 정보는 포함되지 않습니다)가
            RevenueCat, Inc.로 전송됩니다. RevenueCat의 취급에 대해서는
            RevenueCat의 개인정보처리방침(
            <a
              className="text-emerald-700 underline"
              href="https://www.revenuecat.com/privacy"
            >
              https://www.revenuecat.com/privacy
            </a>
            )을 확인해 주십시오.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            6. 쿠키 등 추적 기술에 대하여
          </h2>
          <p className="mt-2">
            본 앱은 네이티브 애플리케이션으로, 쿠키를 사용하지 않습니다.
            또한 광고 게재를 위한 추적은 실시하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            7. 정보의 공개・삭제에 대하여
          </h2>
          <p className="mt-2">
            로그인을 하지 않은 경우, 이용자의 식물 정보・사진은 기기 내에만
            저장되므로 앱을 삭제(제거)하면 이러한 정보도 기기에서 삭제됩니다.
            로그인한 경우에는 본 앱의 설정 화면에서 &quot;계정 삭제&quot;
            조작을 함으로써 클라우드에 저장된 정보를 삭제할 수 있습니다.
            제4항・제5항에 따라 외부 서비스로 전송된 정보에 대해서는 각 사의
            개인정보처리방침에 정해진 방법으로 문의해 주십시오.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            8. 미성년자의 이용에 대하여
          </h2>
          <p className="mt-2">
            본 앱은 App Store의 연령 등급에 따라 제공됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            9. 본 방침의 변경
          </h2>
          <p className="mt-2">
            본 방침의 내용은 법령 또는 본 방침에 별도로 정한 사항을 제외하고,
            이용자에게 통지하지 않고 변경할 수 있습니다. 변경 후의
            개인정보처리방침은 본 앱 내 또는 당사가 지정하는 장소에 게시한
            때부터 효력이 발생합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            10. 문의처
          </h2>
          <p className="mt-2">
            본 방침에 관한 문의는 아래 연락처로 부탁드립니다.
          </p>
          <p className="mt-2">
            마쓰부치 마사시
            <br />
            이메일 주소: tokyoplants.shop@gmail.com
          </p>
        </section>

        <p className="mt-8 text-sm text-gray-500">
          본 한국어 번역본은 참고용으로 제공되며, 내용에 차이가 있는 경우{" "}
          <a
            className="text-emerald-700 underline"
            href="https://media.tokyoplants.com/legal/my-plants-collection/privacy"
          >
            일본어판
          </a>{" "}
          이 우선합니다. 영어판은{" "}
          <a
            className="text-emerald-700 underline"
            href="https://media.tokyoplants.com/legal/my-plants-collection/privacy/en"
          >
            여기
          </a>
          에서, 번체 중국어판은{" "}
          <a
            className="text-emerald-700 underline"
            href="https://media.tokyoplants.com/legal/my-plants-collection/privacy/zh-Hant"
          >
            여기
          </a>
          에서 확인하실 수 있습니다.
        </p>
      </div>
    </div>
  );
}
