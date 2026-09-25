import { Metadata } from "next";

export const metadata: Metadata = {
  title: "계정 및 데이터 삭제 | Green Collection",
  description:
    "앱 「Green Collection」의 계정과 저장된 데이터를 삭제하는 방법",
};

export default function DeleteAccountPageKo() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">계정 및 데이터 삭제</h1>
      <p className="mt-4 text-sm text-gray-500">
        앱 이름: Green Collection
        <br />
        제공자: 마츠부치 마사시
      </p>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            1. 앱에서 삭제하기
          </h2>
          <p className="mt-2">
            앱에 로그인되어 있는 경우, 다음 순서로 계정과 클라우드에 저장된 데이터를
            삭제할 수 있습니다.
          </p>
          <ol className="mt-3 list-decimal space-y-1 pl-6">
            <li>앱을 엽니다</li>
            <li>화면 하단 탭에서 「설정」을 엽니다</li>
            <li>「계정 삭제하기」를 선택합니다</li>
            <li>확인 화면의 내용을 읽고 삭제를 실행합니다</li>
          </ol>
          <p className="mt-3">
            삭제는 취소할 수 없습니다. 실행하면 계정과 클라우드에 저장된 데이터가
            삭제됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            2. 앱을 사용할 수 없는 경우
          </h2>
          <p className="mt-2">
            기기 분실, 앱 삭제 등의 이유로 앱에서 조작할 수 없는 경우에는 아래 창구로
            이메일을 보내주세요. 본인 확인 후 삭제 절차를 진행합니다.
          </p>
          <p className="mt-2">이메일: tokyoplants.shop@gmail.com</p>
          <p className="mt-2">
            번거로우시겠지만 메일에 <strong>로그인에 사용한 이메일 주소</strong>를
            기재하시고, 제목에 「계정 삭제 요청」이라고 적어주세요.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            3. 삭제되는 데이터
          </h2>
          <p className="mt-2">
            계정을 삭제하면 클라우드에 저장된 다음 데이터가 삭제됩니다.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>계정 정보(로그인에 사용한 이메일 주소·계정 식별자)</li>
            <li>
              등록한 식물 정보(별명·품종·데려온 날·놓아둔 장소·메모 등)
            </li>
            <li>돌봄 기록, 캘린더에 추가한 일정</li>
            <li>업로드한 사진</li>
            <li>빛 체크 측정 기록, AI 건강 체크 진단 기록</li>
            <li>구입품 지출 기록, 위시리스트</li>
            <li>친구 관련 정보</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            4. 로그인하지 않은 경우
          </h2>
          <p className="mt-2">
            로그인하지 않고 이용하는 경우, 입력한 데이터는{" "}
            <strong>
              사용 중인 기기 안에만 저장되며 당사 서버로 전송되지 않습니다
            </strong>
            . 이 경우 기기에서 앱을 삭제(제거)하면 데이터도 함께 삭제됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            5. 삭제되지 않는 것
          </h2>
          <p className="mt-2">
            다음은 당사의 관리 범위 밖이므로 계정 삭제 대상에 포함되지 않습니다.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>App Store 및 Google Play의 구매 내역(각 스토어의 규정에 따릅니다)</li>
            <li>
              구매 상태 관리에 이용하는 RevenueCat, Inc.에 저장된 구매 관련 정보
            </li>
            <li>
              이용 상황 분석에 이용하는 Amplitude, Inc.에 전송된, 개인을 특정하지 않는
              이용 통계
            </li>
          </ul>
          <p className="mt-3">
            이에 대한 취급은{" "}
            <a
              href="/legal/my-plants-collection/privacy/ko"
              className="text-emerald-700 underline"
            >
              개인정보 처리방침
            </a>
            {" "}및 각 사의 개인정보 처리방침을 확인해 주세요.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">6. 문의 창구</h2>
          <p className="mt-2">
            마츠부치 마사시
            <br />
            이메일: tokyoplants.shop@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
