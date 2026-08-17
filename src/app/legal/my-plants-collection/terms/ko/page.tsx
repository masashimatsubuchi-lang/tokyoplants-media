import { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 | my Plants Collection",
  description: "앱 「my Plants Collection」의 이용약관",
};

export default function TermsOfServicePageKo() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">이용약관</h1>
      <p className="mt-4 text-sm text-gray-500">제정일: 2026년 7월 14일</p>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <p>
          본 이용약관(이하 &quot;본 약관&quot;이라 합니다)은 마쓰부치
          마사시(이하 &quot;당사&quot;라 합니다)가 제공하는 애플리케이션
          &quot;my Plants Collection&quot;(이하 &quot;본 앱&quot;이라
          합니다)의 이용 조건을 정하는 것입니다. 이용자 여러분(이하
          &quot;이용자&quot;라 합니다)께서는 본 약관에 따라 본 앱을
          이용하시게 됩니다.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            제1조(적용)
          </h2>
          <p className="mt-2">
            본 약관은 이용자와 당사 간의 본 앱 이용에 관련된 일체의 관계에
            적용됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            제2조(본 앱의 내용)
          </h2>
          <p className="mt-2">
            본 앱은 이용자가 소유한 관엽식물 등의 정보・사진・관리 기록을
            관리하고, 물주기 등의 알림 통지를 하는 것을 목적으로 하는
            애플리케이션입니다. 본 앱에는 사진으로부터 AI가 식물의 종류를
            추정하는 기능이 포함되어 있으나, 이는 어디까지나 참고 정보이며
            정확성을 보증하는 것은 아닙니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            제3조(이용 등록・로그인)
          </h2>
          <p className="mt-2">
            본 앱은 계정을 만들지 않아도 모든 기능을 이용하실 수 있습니다.
            로그인하지 않는 경우, 이용자가 입력한 데이터는 기기 내에만
            저장되므로 기기 변경이나 앱 삭제・재설치로 인해 데이터가 소실될
            수 있음을 미리 양해해 주시기 바랍니다.
          </p>
          <p className="mt-2">
            이용자는 임의로 Google・Apple・Facebook・LINE 중 하나의 계정을
            사용하여 본 앱에 로그인할 수 있습니다. 로그인한 경우, 데이터는
            클라우드에도 동기화되어 기기 변경 후에도 데이터를 이어받을 수
            있습니다. 로그인에 관한 정보의 취급에 대해서는 별도로 정하는
            개인정보처리방침에 따릅니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            제4조(플랜・요금)
          </h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>
              본 앱에는 무료로 이용할 수 있는 &quot;Free 플랜&quot;과 월정액
              요금으로 이용할 수 있는 &quot;Pro 플랜&quot;이 있습니다. 각
              플랜의 내용・요금은 본 앱 내에 표시되는 최신 내용이
              적용됩니다.
            </li>
            <li>
              Pro 플랜은 자동 갱신되는 구독 상품으로, 이용자가 갱신 기간
              종료 24시간 전까지 해지 절차를 밟지 않는 한 자동으로 갱신되며
              갱신 요금이 청구됩니다.
            </li>
            <li>
              해지는 이용자 본인의 기기 내 &quot;설정&quot; 앱에서 Apple ID
              구독 관리 화면을 통해 진행합니다.
            </li>
            <li>
              결제는 Apple Inc.가 제공하는 App Store 결제 시스템을 통해
              이루어지며, 환불에 관한 문의는 Apple이 정하는 방법에
              따릅니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            제5조(금지 사항)
          </h2>
          <p className="mt-2">
            이용자는 본 앱을 이용함에 있어 다음 행위를 해서는 안 됩니다.
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>법령 또는 공서양속에 위반하는 행위</li>
            <li>본 앱의 운영을 방해할 우려가 있는 행위</li>
            <li>
              본 앱에 대한 리버스 엔지니어링, 디컴파일, 디스어셈블 등의
              해석 행위
            </li>
            <li>기타 당사가 부적절하다고 판단하는 행위</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            제6조(본 앱 제공의 정지 등)
          </h2>
          <p className="mt-2">
            당사는 다음 각 호의 사유가 있다고 판단하는 경우, 이용자에게
            사전 통지 없이 본 앱의 전부 또는 일부의 제공을 정지 또는
            중단할 수 있습니다.
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>본 앱에 관한 시스템의 보수 점검 또는 업데이트를 하는 경우</li>
            <li>
              지진, 낙뢰, 화재, 정전 또는 천재지변 등 불가항력으로 인해 본
              앱의 제공이 곤란해진 경우
            </li>
            <li>기타 당사가 본 앱의 제공이 곤란하다고 판단한 경우</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            제7조(보증의 부인・면책 사항)
          </h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>
              본 앱에서 제공하는 식물 관리 정보(물주기 빈도・비료 기준 등),
              AI에 의한 식물 판별 결과 및 AI 건강 체크 결과는 일반적인 참고
              정보이며, 그 정확성・완전성을 보증하지 않습니다. AI 건강 체크는
              식물의 이상에 대해 생각할 수 있는 가능성을 제시하는 것이며,
              병명이나 해충의 종류를 특정・확정하는 것이 아닙니다. 식물의 실제 생육 상태는
              개체 차이와 환경에 따라 다르므로, 최종적인 판단은 이용자
              본인의 책임하에 이루어져야 합니다.
            </li>
            <li>
              당사는 본 앱과 관련하여 이용자에게 발생한 모든 손해에 대해,
              당사의 고의 또는 중과실에 의한 경우를 제외하고는 일체 책임을
              지지 않습니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            제8조(이용약관의 변경)
          </h2>
          <p className="mt-2">
            당사는 필요하다고 판단하는 경우 이용자에 대한 사전 통지 없이
            언제든지 본 약관을 변경할 수 있습니다. 변경 후의 이용약관은 본
            앱 내 또는 당사가 지정하는 장소에 게시한 때부터 효력이
            발생합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            제9조(준거법・재판관할)
          </h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>본 약관의 해석에는 일본법을 준거법으로 합니다.</li>
            <li>
              본 앱과 관련하여 분쟁이 발생한 경우에는 당사 소재지를
              관할하는 법원을 전속적 합의관할로 합니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            제10조(문의처)
          </h2>
          <p className="mt-2">
            본 약관에 관한 문의는 아래 연락처로 부탁드립니다.
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
            href="https://media.tokyoplants.com/legal/my-plants-collection/terms"
          >
            일본어판
          </a>{" "}
          이 우선합니다. 영어판은{" "}
          <a
            className="text-emerald-700 underline"
            href="https://media.tokyoplants.com/legal/my-plants-collection/terms/en"
          >
            여기
          </a>
          에서, 번체 중국어판은{" "}
          <a
            className="text-emerald-700 underline"
            href="https://media.tokyoplants.com/legal/my-plants-collection/terms/zh-Hant"
          >
            여기
          </a>
          에서 확인하실 수 있습니다.
        </p>
      </div>
    </div>
  );
}
