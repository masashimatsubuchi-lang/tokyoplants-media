import { Metadata } from "next";

export const metadata: Metadata = {
  title: "アカウントとデータの削除 | Green Collection",
  description:
    "アプリ「Green Collection」のアカウントと、保存されたデータの削除方法について",
};

export default function DeleteAccountPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">
        アカウントとデータの削除
      </h1>
      <p className="mt-4 text-sm text-gray-500">
        アプリ名: Green Collection
        <br />
        提供者: 松淵 将史
      </p>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            1. アプリから削除する
          </h2>
          <p className="mt-2">
            アプリにログインしている場合は、以下の手順でアカウントと、クラウド上に保存されたデータを削除できます。
          </p>
          <ol className="mt-3 list-decimal space-y-1 pl-6">
            <li>アプリを開く</li>
            <li>画面下部のタブから「設定」を開く</li>
            <li>「アカウントを削除する」を選ぶ</li>
            <li>確認画面の内容を読み、削除を実行する</li>
          </ol>
          <p className="mt-3">
            削除は取り消せません。実行するとアカウントと、クラウド上に保存されたデータが削除されます。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            2. アプリを使えない場合
          </h2>
          <p className="mt-2">
            端末の紛失、アプリの削除済みなどの理由でアプリから操作できない場合は、下記の窓口までメールでご連絡ください。ご本人確認のうえ、削除の手続きを行います。
          </p>
          <p className="mt-2">
            Eメールアドレス: tokyoplants.shop@gmail.com
          </p>
          <p className="mt-2">
            お手数ですが、メールには
            <strong>ログインに使用したメールアドレス</strong>
            と、件名に「アカウント削除希望」とご記入ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            3. 削除されるデータ
          </h2>
          <p className="mt-2">
            アカウントの削除により、クラウド上に保存された以下のデータが削除されます。
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>アカウント情報（ログインに用いたメールアドレス・アカウント識別子）</li>
            <li>登録した植物の情報（ニックネーム・品種・お迎え日・置き場所・メモなど）</li>
            <li>お世話の記録、カレンダーに追加した予定</li>
            <li>アップロードした写真</li>
            <li>光チェックの測定履歴、AI健康チェックの診断履歴</li>
            <li>購入品の支出の記録、「ほしい」リスト</li>
            <li>ともだちに関する情報</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            4. ログインしていない場合
          </h2>
          <p className="mt-2">
            ログインせずにご利用の場合、入力されたデータは
            <strong>お使いの端末内にのみ保存されており、当方のサーバーには送信されていません</strong>
            。この場合は、アプリを端末から削除（アンインストール）することでデータも削除されます。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            5. 削除されないもの
          </h2>
          <p className="mt-2">
            以下は当方の管理外のため、アカウント削除の対象に含まれません。
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>
              App Store および Google Play における購入履歴（各ストアの規定によります）
            </li>
            <li>
              購入状況の管理に利用している RevenueCat, Inc. に保存された購入に関する情報
            </li>
            <li>
              利用状況の分析に利用している Amplitude, Inc. に送信された、個人を特定しない利用統計
            </li>
          </ul>
          <p className="mt-3">
            これらの取り扱いについては、
            <a
              href="/legal/my-plants-collection/privacy"
              className="text-emerald-700 underline"
            >
              プライバシーポリシー
            </a>
            および各社のプライバシーポリシーをご確認ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            6. お問い合わせ窓口
          </h2>
          <p className="mt-2">
            松淵 将史
            <br />
            Eメールアドレス: tokyoplants.shop@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
