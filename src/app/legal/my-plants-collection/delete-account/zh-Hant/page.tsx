import { Metadata } from "next";

export const metadata: Metadata = {
  title: "帳號與資料刪除 | Green Collection",
  description: "應用程式「Green Collection」的帳號與已儲存資料的刪除方式",
};

export default function DeleteAccountPageZhHant() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">帳號與資料刪除</h1>
      <p className="mt-4 text-sm text-gray-500">
        應用程式名稱: Green Collection
        <br />
        提供者: 松淵 將史
      </p>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            1. 從應用程式內刪除
          </h2>
          <p className="mt-2">
            若您已登入應用程式，可依照以下步驟刪除帳號與儲存在雲端的資料。
          </p>
          <ol className="mt-3 list-decimal space-y-1 pl-6">
            <li>開啟應用程式</li>
            <li>從畫面下方的分頁開啟「設定」</li>
            <li>選擇「刪除帳號」</li>
            <li>閱讀確認畫面的內容後執行刪除</li>
          </ol>
          <p className="mt-3">
            刪除後無法復原。執行後，帳號與儲存在雲端的資料將被刪除。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            2. 無法使用應用程式時
          </h2>
          <p className="mt-2">
            若因遺失裝置、已解除安裝應用程式等原因而無法在應用程式內操作，請來信至下列窗口。我們將於確認本人身分後進行刪除手續。
          </p>
          <p className="mt-2">電子郵件: tokyoplants.shop@gmail.com</p>
          <p className="mt-2">
            麻煩您在信件中註明<strong>登入時使用的電子郵件地址</strong>
            ，並於主旨填寫「申請刪除帳號」。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            3. 會被刪除的資料
          </h2>
          <p className="mt-2">刪除帳號後，儲存在雲端的下列資料將被刪除。</p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>帳號資訊（登入時使用的電子郵件地址、帳號識別碼）</li>
            <li>已登錄的植物資訊（暱稱、品種、迎接日、擺放位置、備註等）</li>
            <li>照顧紀錄、新增至行事曆的預定</li>
            <li>上傳的照片</li>
            <li>光線檢測的測量紀錄、AI 健康檢查的診斷紀錄</li>
            <li>購買物品的支出紀錄、願望清單</li>
            <li>與朋友相關的資訊</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            4. 未登入的情況
          </h2>
          <p className="mt-2">
            若您未登入即使用本應用程式，所輸入的資料
            <strong>僅儲存於您的裝置內，不會傳送至我方伺服器</strong>
            。此時只要從裝置移除（解除安裝）應用程式，資料也會一併刪除。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            5. 不會被刪除的項目
          </h2>
          <p className="mt-2">
            下列項目不在我方管理範圍內，因此不包含在帳號刪除的對象中。
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>App Store 及 Google Play 的購買紀錄（依各商店的規定）</li>
            <li>用於管理購買狀態的 RevenueCat, Inc. 所保存的購買相關資訊</li>
            <li>
              用於分析使用狀況的 Amplitude, Inc. 所接收、無法識別個人的使用統計
            </li>
          </ul>
          <p className="mt-3">
            關於這些資訊的處理方式，請參閱
            <a
              href="/legal/my-plants-collection/privacy/zh-Hant"
              className="text-emerald-700 underline"
            >
              隱私權政策
            </a>
            以及各公司的隱私權政策。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">6. 聯絡窗口</h2>
          <p className="mt-2">
            松淵 將史
            <br />
            電子郵件: tokyoplants.shop@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
