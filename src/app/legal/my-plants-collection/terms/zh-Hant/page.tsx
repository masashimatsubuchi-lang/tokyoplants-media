import { Metadata } from "next";

export const metadata: Metadata = {
  title: "服務條款 | my Plants Collection",
  description: "應用程式「my Plants Collection」的服務條款",
};

export default function TermsOfServicePageZhHant() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">服務條款</h1>
      <p className="mt-4 text-sm text-gray-500">制定日期：2026年7月14日</p>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <p>
          本服務條款（以下稱「本條款」）訂定由松淵將史（以下稱「本公司」或「我方」）提供之應用程式「my
          Plants
          Collection」（以下稱「本應用程式」）之使用條件。各位使用者（以下稱「使用者」或「您」）應依本條款使用本應用程式。
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">第1條（適用範圍）</h2>
          <p className="mt-2">
            本條款適用於使用者與我方之間，因使用本應用程式所生之一切關係。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            第2條（本應用程式之內容）
          </h2>
          <p className="mt-2">
            本應用程式旨在協助使用者管理其所擁有之觀葉植物等相關資訊、照片及照護記錄，並發送澆水等提醒通知。本應用程式包含利用
            AI
            由照片推測植物種類之功能，惟該功能僅供參考，我方不保證其正確性。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            第3條（使用登錄與登入）
          </h2>
          <p className="mt-2">
            使用者無需建立帳號即可使用本應用程式的所有功能。若未登入，使用者輸入之資料僅儲存於裝置內，敬請注意，若更換裝置或刪除、重新安裝本應用程式，該等資料可能因此遺失。
          </p>
          <p className="mt-2">
            使用者得選擇性地使用 Google、Apple、Facebook 或
            LINE帳號登入本應用程式。登入後，資料將同步儲存於雲端，於更換裝置後仍可保留資料。有關登入相關資訊之處理方式，依另行制定之隱私權政策辦理。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            第4條（方案與費用）
          </h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>
              本應用程式提供可免費使用之「Free
              方案」，以及需支付月費方可使用之「Pro
              方案」。各方案之內容及費用，以本應用程式內顯示之最新內容為準。
            </li>
            <li>
              Pro
              方案為自動續訂之訂閱服務，除非使用者於更新期間屆滿前24小時完成解約手續，否則將自動續訂並收取續訂費用。
            </li>
            <li>
              解約應由使用者本人於其裝置的「設定」App 內、Apple ID
              的訂閱管理畫面中進行。
            </li>
            <li>
              付款透過 Apple Inc. 提供之 App Store
              付款系統進行，有關退款事宜之詢問，應依 Apple 所定之方式辦理。
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            第5條（禁止事項）
          </h2>
          <p className="mt-2">使用者於使用本應用程式時，不得從事下列行為：</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>違反法令或公序良俗之行為</li>
            <li>有妨礙本應用程式營運之虞的行為</li>
            <li>對本應用程式進行還原工程、反編譯、反組譯或其他解析行為</li>
            <li>其他經我方認定為不適當之行為</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            第6條（本應用程式提供之停止等）
          </h2>
          <p className="mt-2">
            我方於認定有下列任一事由時，得不經事前通知使用者，停止或中斷提供本應用程式之全部或一部：
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>對本應用程式相關系統進行維護、檢修或更新時</li>
            <li>
              因地震、雷擊、火災、停電或其他天然災害等不可抗力，致本應用程式難以提供時
            </li>
            <li>其他經我方認定難以提供本應用程式之情形</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            第7條（保證之否認與免責事項）
          </h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>
              本應用程式所提供之植物照護資訊（如澆水頻率、施肥基準等）、AI
              植物辨識結果及 AI
              健康檢查結果，僅為一般性參考資訊，我方不保證其正確性及完整性。AI
              健康檢查係就植物的異常狀況提示可能的原因，並非特定或確認病名或害蟲種類。植物實際生長狀況因個體差異及環境而異，最終判斷應由使用者自行負責。
            </li>
            <li>
              除因我方故意或重大過失所致者外，我方對於使用者因本應用程式所生之任何損害，概不負責。
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            第8條（服務條款之變更）
          </h2>
          <p className="mt-2">
            我方於認定有必要時，得不經事前通知使用者，隨時變更本條款。經變更之服務條款，自公告於本應用程式內或我方指定之處所時起發生效力。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            第9條（準據法與管轄法院）
          </h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>本條款之解釋，以日本法為準據法。</li>
            <li>
              因本應用程式所生之爭議，以我方所在地為管轄之法院為專屬合意管轄法院。
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            第10條（聯絡窗口）
          </h2>
          <p className="mt-2">如對本條款有任何疑問，請透過下列方式與我方聯絡。</p>
          <p className="mt-2">
            松淵將史
            <br />
            電子郵件地址：tokyoplants.shop@gmail.com
          </p>
        </section>

        <p className="mt-8 text-sm text-gray-500">
          本繁體中文譯本僅供參考之用。如本譯本與日文版之間有任何歧異，應以
          <a
            className="text-emerald-700 underline"
            href="https://media.tokyoplants.com/legal/my-plants-collection/terms"
          >
            日文版
          </a>
          為準。英文版本請參閱
          <a
            className="text-emerald-700 underline"
            href="https://media.tokyoplants.com/legal/my-plants-collection/terms/en"
          >
            English
          </a>
          。韓文版本請參閱
          <a
            className="text-emerald-700 underline"
            href="https://media.tokyoplants.com/legal/my-plants-collection/terms/ko"
          >
            한국어
          </a>
          。
        </p>
      </div>
    </div>
  );
}
