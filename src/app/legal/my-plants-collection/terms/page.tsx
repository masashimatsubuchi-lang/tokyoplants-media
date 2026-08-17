import { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 | my Plants Collection",
  description: "アプリ「my Plants Collection」の利用規約",
};

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">利用規約</h1>
      <p className="mt-4 text-sm text-gray-500">制定日: 2026年7月14日</p>

      <div className="mt-8 space-y-6 text-gray-700 leading-relaxed">
        <p>
          この利用規約（以下「本規約」といいます）は、松淵 将史（以下「当方」といいます）が提供するアプリケーション「my
          Plants Collection」（以下「本アプリ」といいます）の利用条件を定めるものです。ユーザーの皆様（以下「ユーザー」といいます）には、本規約に従って本アプリをご利用いただきます。
        </p>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">第1条（適用）</h2>
          <p className="mt-2">
            本規約は、ユーザーと当方との間の本アプリの利用に関わる一切の関係に適用されるものとします。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            第2条（本アプリの内容）
          </h2>
          <p className="mt-2">
            本アプリは、ユーザーが所有する観葉植物等の情報・写真・お世話の記録を管理し、水やり等のリマインド通知を行うことを目的としたアプリケーションです。本アプリには、写真からAIが植物の種類を推定する機能が含まれますが、これはあくまで参考情報であり、正確性を保証するものではありません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            第3条（利用登録・ログイン）
          </h2>
          <p className="mt-2">
            本アプリはアカウントを作成しなくてもすべての機能をご利用いただけます。ログインしない場合、ユーザーが入力したデータは端末内にのみ保存されるため、機種変更やアプリの削除・再インストールによりデータが失われる可能性があることをあらかじめご了承ください。
          </p>
          <p className="mt-2">
            ユーザーは任意で、Google・Apple・Facebook・LINEのいずれかのアカウントを用いて本アプリにログインすることができます。ログインした場合、データはクラウド上にも同期され、機種変更後もデータを引き継ぐことができます。ログインに関する情報の取り扱いについては、別途定めるプライバシーポリシーによります。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            第4条（プラン・料金）
          </h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>
              本アプリには、無料で利用できる「Freeプラン」と、月額料金にてご利用いただける「Proプラン」があります。各プランの内容・料金は本アプリ内の表示による最新の内容が適用されます。
            </li>
            <li>
              Proプランは自動更新のサブスクリプションであり、ユーザーが更新期間終了の24時間前までに解約手続きを行わない限り、自動的に更新され、更新料金が請求されます。
            </li>
            <li>
              解約は、ユーザーご自身の端末の「設定」アプリ内、Apple
              IDのサブスクリプション管理画面から行うものとします。
            </li>
            <li>
              お支払いはApple Inc.が提供するApp Store決済システムを通じて行われ、返金に関するお問い合わせは、Appleの定める方法に従うものとします。
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            第5条（禁止事項）
          </h2>
          <p className="mt-2">
            ユーザーは、本アプリの利用にあたり、以下の行為をしてはなりません。
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>法令または公序良俗に違反する行為</li>
            <li>本アプリの運営を妨害するおそれのある行為</li>
            <li>
              本アプリのリバースエンジニアリング、逆コンパイル、逆アセンブルその他の解析行為
            </li>
            <li>その他、当方が不適切と判断する行為</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            第6条（本アプリの提供の停止等）
          </h2>
          <p className="mt-2">
            当方は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本アプリの全部または一部の提供を停止または中断することができるものとします。
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>本アプリにかかるシステムの保守点検または更新を行う場合</li>
            <li>
              地震、落雷、火災、停電または天災などの不可抗力により、本アプリの提供が困難となった場合
            </li>
            <li>その他、当方が本アプリの提供が困難と判断した場合</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            第7条（保証の否認・免責事項）
          </h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>
              本アプリで提供される植物の育成情報（水やり頻度・肥料の目安等）、AIによる植物同定結果、およびAI健康チェックの結果は、一般的な目安・参考情報であり、その正確性・完全性を保証するものではありません。AI健康チェックは植物の不調について考えられる可能性を示すものであり、病名や害虫の種類を特定・確定するものではありません。植物の実際の生育状況は個体差や環境により異なるため、最終的な判断はユーザーご自身の責任で行うものとします。
            </li>
            <li>
              当方は、本アプリに関してユーザーに生じたあらゆる損害について、当方の故意または重過失による場合を除き、一切の責任を負いません。
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            第8条（利用規約の変更）
          </h2>
          <p className="mt-2">
            当方は、必要と判断した場合には、ユーザーへの事前の通知なくいつでも本規約を変更することができるものとします。変更後の利用規約は、本アプリ内または当方が指定する場所に掲載したときから効力を生じるものとします。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            第9条（準拠法・裁判管轄）
          </h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
            <li>
              本アプリに関して紛争が生じた場合には、当方の所在地を管轄する裁判所を専属的合意管轄とします。
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">
            第10条（お問い合わせ窓口）
          </h2>
          <p className="mt-2">
            本規約に関するお問い合わせは、下記の窓口までお願いいたします。
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
