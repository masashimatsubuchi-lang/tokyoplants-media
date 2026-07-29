import { Metadata } from "next";

export const metadata: Metadata = {
  title: "隱私權政策 | my Plants Collection",
  description: "應用程式「my Plants Collection」的隱私權政策",
};

export default function PrivacyPolicyPageZhHant() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">隱私權政策</h1>
      <p className="mt-4 text-sm text-gray-500">
        生效日期：2026年7月14日
        <br />
        最後更新日期：2026年7月14日
      </p>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <p>
          松淵將史（以下稱「本公司」或「我方」）為說明我方在提供應用程式「my
          Plants Collection」（以下稱「本應用程式」）時如何處理使用者資訊，特此制定本隱私權政策（以下稱「本政策」）。
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">1. 基本方針</h2>
          <p className="mt-2">
            本應用程式讓使用者管理其登錄植物的相關資訊、照片及照護記錄。使用者無需登入即可使用本應用程式的所有功能，在此情況下，您輸入的資料僅會
            <strong>保存在您的裝置內，絕不會傳送至或保存於我方或任何第三方的伺服器</strong>
            。僅有在您選擇性地登入（透過 Google、Apple、Facebook 或
            LINE）後，您的資料才會依第3項所述同步至雲端，以便在更換裝置時保留資料。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            2. 我方蒐集的資訊及其蒐集方式
          </h2>
          <div className="mt-2 overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-200 px-3 py-2 text-left">
                    資訊類型
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left">
                    蒐集方式
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left">
                    保存位置
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">
                    植物名稱、迎接日期、照護記錄、備註等文字資訊
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    由使用者於本應用程式內輸入
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    儲存於您的裝置內（透過 SwiftData
                    進行本機儲存）。若已登入，亦會依第3項儲存於雲端
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">植物照片</td>
                  <td className="border border-gray-200 px-3 py-2">
                    使用本應用程式的相機功能拍攝
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    儲存於您的裝置內（本應用程式的 Documents
                    目錄）。若已登入，亦會依第3項儲存於雲端
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">
                    用於登入的電子郵件地址與帳號識別碼
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    於登入時，從 Google、Apple、Facebook 或 LINE
                    的驗證服務取得
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    雲端（詳見第3項）
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">
                    推播通知的許可狀態
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    作業系統的通知許可設定
                  </td>
                  <td className="border border-gray-200 px-3 py-2">您的裝置內</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">
                    購買與訂閱狀態
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    Apple Inc. 的 App Store 付款系統
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    Apple Inc. 及我方的訂閱管理服務商（詳見第5項）
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2">
            本應用程式不會蒐集位置資訊、聯絡人、裝置識別碼，或任何上述未列出的資訊。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            3. 登入與雲端同步功能
          </h2>
          <p className="mt-2">
            本應用程式讓您可選擇性地使用 Google、Apple、Facebook 或 LINE
            帳號登入。登入並非必要，若您不登入，仍可如常使用本應用程式的所有功能。
          </p>
          <p className="mt-2">
            若您選擇登入，為使您在更換裝置或重新安裝本應用程式後仍能保留資料，您的植物資訊、照護記錄及照片將依使用者分別儲存於我方使用的雲端服務「Supabase」（由
            Supabase, Inc. 提供）伺服器上。所儲存的資料受存取控制（Row Level
            Security）保護，我方以外的第三方無法存取。有關 Supabase
            如何處理資料，請參閱 Supabase 的隱私權政策（
            <a
              className="text-emerald-700 underline"
              href="https://supabase.com/privacy"
            >
              https://supabase.com/privacy
            </a>
            ）。
          </p>
          <p className="mt-2">
            為實現登入功能，驗證所需範圍內的資訊（如電子郵件地址）將傳送至
            Google、Apple、Facebook 或
            LINE的驗證服務。有關各家業者如何處理該資訊，請參閱其各自的隱私權政策。
          </p>
          <p className="mt-2">
            若您登入後又登出，雲端同步將會停止，但雲端上已儲存的資料本身不會被刪除。如您希望刪除雲端上的資料，請於本應用程式的設定畫面中執行「刪除帳號」操作，或透過第10項所列的聯絡方式與我方聯絡。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            4. 向第三方提供資訊（AI 植物辨識功能）
          </h2>
          <p className="mt-2">
            僅於您使用本應用程式的「以 AI
            判定植物」功能時，您所拍攝的植物照片資料才會傳送至植物辨識服務「Pl@ntNet」（由
            Pl@ntNet
            專案營運方提供）。此為取得辨識結果所必需的處理程序，我方不會保存或以其他方式再利用所傳送的影像。有關
            Pl@ntNet 如何處理資料，請參閱 Pl@ntNet 的隱私權政策（
            <a
              className="text-emerald-700 underline"
              href="https://plantnet.org/en/privacy-policy/"
            >
              https://plantnet.org/en/privacy-policy/
            </a>
            ）。
          </p>
          <p className="mt-2">若您不使用此功能，照片資料將不會傳送至外部。</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            5. 有關訂閱（Pro 方案）的資訊
          </h2>
          <p className="mt-2">
            訂閱 Pro 方案透過 Apple 提供的 App Store
            付款系統進行。我方不會取得或保留付款資訊（如信用卡卡號），該等資訊由
            Apple Inc. 管理。
          </p>
          <p className="mt-2">
            我方亦使用 RevenueCat, Inc.
            的服務來管理訂閱狀態（如到期日）。與購買相關的資訊（購買日期、到期日、匿名裝置識別碼等，不包含信用卡資訊）將傳送至
            RevenueCat, Inc.。有關 RevenueCat 如何處理資料，請參閱 RevenueCat
            的隱私權政策（
            <a
              className="text-emerald-700 underline"
              href="https://www.revenuecat.com/privacy"
            >
              https://www.revenuecat.com/privacy
            </a>
            ）。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            6. Cookie 等追蹤技術
          </h2>
          <p className="mt-2">
            本應用程式為原生應用程式，並不使用
            Cookie。我方亦不會為廣告投放目的進行任何追蹤。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            7. 資訊之揭露與刪除
          </h2>
          <p className="mt-2">
            若您未登入，您的植物資訊及照片僅儲存於您的裝置內，因此刪除（解除安裝）本應用程式即會一併從您的裝置中刪除這些資訊。若您已登入，可於本應用程式的設定畫面中執行「刪除帳號」操作，以刪除儲存於雲端的資訊。有關依第4項及第5項傳送至外部服務的資訊，請依各該業者隱私權政策所定的方式與其聯絡。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            8. 未成年人之使用
          </h2>
          <p className="mt-2">本應用程式依 App Store 所定的年齡分級提供。</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">9. 本政策之變更</h2>
          <p className="mt-2">
            除法令另有規定或本政策另有約定者外，我方得不經個別通知使用者而變更本政策之內容。經修訂之隱私權政策，自公告於本應用程式內或我方指定之處所時起發生效力。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">10. 聯絡窗口</h2>
          <p className="mt-2">如對本政策有任何疑問，請透過下列方式與我方聯絡。</p>
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
            href="https://media.tokyoplants.com/legal/my-plants-collection/privacy"
          >
            日文版
          </a>
          為準。英文版本請參閱
          <a
            className="text-emerald-700 underline"
            href="https://media.tokyoplants.com/legal/my-plants-collection/privacy/en"
          >
            English
          </a>
          。韓文版本請參閱
          <a
            className="text-emerald-700 underline"
            href="https://media.tokyoplants.com/legal/my-plants-collection/privacy/ko"
          >
            한국어
          </a>
          。
        </p>
      </div>
    </div>
  );
}
