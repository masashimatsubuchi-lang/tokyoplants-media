import { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | my Plants Collection",
  description: "アプリ「my Plants Collection」のプライバシーポリシー",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">プライバシーポリシー</h1>
      <p className="mt-4 text-sm text-gray-500">
        制定日: 2026年7月14日
        <br />
        最終改定日: 2026年7月14日
      </p>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <p>
          松淵 将史（以下「当方」といいます）は、当方が提供するアプリケーション「my
          Plants Collection」（以下「本アプリ」といいます）における、ユーザーの情報の取り扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">1. 基本方針</h2>
          <p className="mt-2">
            本アプリは、ユーザーが登録した植物の情報・写真・お世話の記録を管理するためのアプリです。本アプリはログインしなくてもすべての機能をご利用いただけ、その場合ユーザーが入力したデータは
            <strong>端末内にのみ保存され、当方や第三者のサーバーに送信・保存されることはありません</strong>
            。ユーザーが任意でログイン（Google／Apple／Facebook／LINEのいずれか）を行った場合に限り、機種変更時のデータ引き継ぎ等を目的として、第3項に記載のとおりクラウド上にデータが同期されます。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            2. 取得する情報とその取得方法
          </h2>
          <div className="mt-2 overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-200 px-3 py-2 text-left">
                    情報の種類
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left">
                    取得方法
                  </th>
                  <th className="border border-gray-200 px-3 py-2 text-left">
                    保存場所
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">
                    植物の名称・お迎え日・お世話記録・メモ等のテキスト情報
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    ユーザーが本アプリ内で入力
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    端末内（SwiftDataによるローカル保存）。ログイン時は第3項のクラウドにも保存
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">植物の写真</td>
                  <td className="border border-gray-200 px-3 py-2">
                    本アプリのカメラ機能で撮影
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    端末内（アプリのDocumentsディレクトリ）。ログイン時は第3項のクラウドにも保存
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">
                    ログインに用いるメールアドレス・アカウント識別子
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    ログイン時、Google／Apple／Facebook／LINEいずれかの認証サービスから取得
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    クラウド（第3項参照）
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">
                    プッシュ通知の許可状態
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    OSの通知許可設定
                  </td>
                  <td className="border border-gray-200 px-3 py-2">端末内</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2">
                    購入・サブスクリプション状況
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    Apple Inc.のApp Store決済システム
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    Apple社および決済管理事業者（第5項参照）
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2">
            本アプリは、位置情報・連絡先・端末の識別子等、上記に記載のない情報を取得しません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            3. ログイン・クラウド同期機能について
          </h2>
          <p className="mt-2">
            本アプリでは、ユーザーが任意でGoogle・Apple・Facebook・LINEのいずれかのアカウントを用いてログインできます。ログインは必須ではなく、ログインしない場合は本アプリのすべての機能をこれまでどおりご利用いただけます。
          </p>
          <p className="mt-2">
            ログインを行った場合、機種変更やアプリの再インストールを行ってもデータを引き継げるようにするため、植物の情報・お世話の記録・写真が、当方が利用するクラウドサービス「Supabase」（Supabase,
            Inc.が提供）のサーバー上に、ユーザーごとに区分された形で保存されます。保存されたデータは当方以外の第三者がアクセスできないよう、アクセス制御（Row
            Level Security）により保護されています。Supabase側の取り扱いについては、Supabaseのプライバシーポリシー（
            <a
              className="text-emerald-700 underline"
              href="https://supabase.com/privacy"
            >
              https://supabase.com/privacy
            </a>
            ）をご確認ください。
          </p>
          <p className="mt-2">
            ログイン機能の実現にあたり、Google・Apple・Facebook・LINE各社の認証サービスに、認証に必要な範囲の情報（メールアドレス等）が送信されます。各社の取り扱いについては、それぞれのプライバシーポリシーをご確認ください。
          </p>
          <p className="mt-2">
            ログイン後にログアウトした場合、クラウド上のデータの同期は停止しますが、クラウド上のデータ自体は削除されません。クラウド上のデータの削除をご希望の場合は、本アプリの設定画面から「アカウントを削除する」操作を行うか、第10項の窓口までお問い合わせください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            4. 第三者への情報提供（AIによる植物同定機能）
          </h2>
          <p className="mt-2">
            本アプリの「AIで植物を判定する」機能を利用した場合に限り、ユーザーが撮影した植物の写真データが、植物同定サービス「Pl@ntNet」（Pl@ntNetプロジェクト運営元）へ送信されます。これは同定結果を取得するために必要な処理であり、送信された画像は当方が保存・二次利用することはありません。Pl@ntNet側での取り扱いについては、Pl@ntNetのプライバシーポリシー（
            <a
              className="text-emerald-700 underline"
              href="https://plantnet.org/en/privacy-policy/"
            >
              https://plantnet.org/en/privacy-policy/
            </a>
            ）をご確認ください。
          </p>
          <p className="mt-2">
            この機能を利用しない場合、写真データが外部に送信されることはありません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            5. サブスクリプション（Pro プラン）に関する情報
          </h2>
          <p className="mt-2">
            Proプランへのお申し込みは、Appleの提供する App Store
            の決済システムを通じて行われます。決済情報（クレジットカード番号等）は当方が取得・保持することはなく、Apple
            Inc.が管理します。
          </p>
          <p className="mt-2">
            また、購入状況（有効期限等）の管理には RevenueCat, Inc.
            のサービスを利用しており、購入に関する情報（購入日時・有効期限・匿名の端末識別子等。クレジットカード情報は含みません）が
            RevenueCat, Inc.
            に送信されます。RevenueCatの取り扱いについては、RevenueCatのプライバシーポリシー（
            <a
              className="text-emerald-700 underline"
              href="https://www.revenuecat.com/privacy"
            >
              https://www.revenuecat.com/privacy
            </a>
            ）をご確認ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            6. Cookie等のトラッキング技術について
          </h2>
          <p className="mt-2">
            本アプリはネイティブアプリケーションであり、Cookieを使用しません。また、広告配信のためのトラッキングは行っていません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            7. 情報の開示・削除について
          </h2>
          <p className="mt-2">
            ログインをしていない場合、ユーザーの植物情報・写真は端末内にのみ保存されるため、アプリを削除（アンインストール）することでこれらの情報も端末から削除されます。ログインしている場合は、本アプリの設定画面から「アカウントを削除する」操作を行うことで、クラウド上に保存された情報を削除できます。第4項・第5項に基づき外部サービスへ送信された情報については、各社のプライバシーポリシーに定める方法でお問い合わせください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            8. 未成年の利用について
          </h2>
          <p className="mt-2">本アプリはApp Storeの年齢区分に従って提供されます。</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            9. 本ポリシーの変更
          </h2>
          <p className="mt-2">
            本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく変更することができるものとします。変更後のプライバシーポリシーは、本アプリ内または当方が指定する場所に掲載したときから効力を生じるものとします。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            10. お問い合わせ窓口
          </h2>
          <p className="mt-2">
            本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。
          </p>
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
