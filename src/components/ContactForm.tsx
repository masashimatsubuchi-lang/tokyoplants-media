"use client";

import { useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { trackEvent } from "@/lib/track";

const WEB3FORMS_ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "a50a61a7-9a62-4d94-acb6-fc91e98cb596";

const INQUIRY_TYPES = ["記事掲載・タイアップのご相談", "法人・パートナーシップに関するお問い合わせ", "その他"];

// Web3Forms の無料プラン用の hCaptcha サイトキー（公式ドキュメント記載の共用キー）。
// 2026-10-28、確認なしの送信が Web3Forms 側ですべて迷惑判定（ダッシュボードの Spam）になり、
// メールが届かなかったため追加。Web3Forms のフォーム設定で Block Spam を hCaptcha にしておくこと。
const HCAPTCHA_SITEKEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";

type Status = "idle" | "sending" | "success" | "error" | "captcha";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [captchaToken, setCaptchaToken] = useState("");
  const captchaRef = useRef<HCaptcha>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!captchaToken) {
      setStatus("captcha");
      return;
    }
    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", WEB3FORMS_ACCESS_KEY);
    formData.append("subject", "【tokyoplants media】お問い合わせ");
    formData.set("h-captcha-response", captchaToken);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        // 問い合わせ件数を GA4 で数えるため（2026-10-28）。種別は登録済みディメンション placement に載せる。
        // 名前・メールアドレス・本文は送らない
        trackEvent("contact_submit", { placement: String(formData.get("inquiry_type") ?? "") });
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
    // 確認は1回の送信ごとに使い切りなので、失敗したときに備えてやり直せる状態に戻す
    setCaptchaToken("");
    captchaRef.current?.resetCaptcha();
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-6 text-center">
        <p className="text-sm font-semibold text-emerald-800">お問い合わせありがとうございます。</p>
        <p className="mt-1 text-sm text-emerald-700">内容を確認の上、担当者よりご連絡いたします。</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ハニーポット（bot対策・非表示） */}
      <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

      <div>
        <label htmlFor="company" className="block text-sm font-semibold text-gray-900">
          会社名・屋号
        </label>
        <input
          id="company"
          name="company"
          type="text"
          className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-900">
          お名前 <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </div>

      <div>
        <label htmlFor="inquiry_type" className="block text-sm font-semibold text-gray-900">
          お問い合わせ種別 <span className="text-red-500">*</span>
        </label>
        <select
          id="inquiry_type"
          name="inquiry_type"
          required
          defaultValue=""
          className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="" disabled>
            選択してください
          </option>
          {INQUIRY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-gray-900">
          お問い合わせ内容 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </div>

      <div className="min-h-[78px]">
        <HCaptcha
          ref={captchaRef}
          sitekey={HCAPTCHA_SITEKEY}
          reCaptchaCompat={false}
          languageOverride="ja"
          onVerify={(token) => {
            setCaptchaToken(token);
            if (status === "captcha") setStatus("idle");
          }}
          onExpire={() => setCaptchaToken("")}
        />
      </div>

      {status === "captcha" && (
        <p className="text-sm text-red-600">送信する前に「私はロボットではありません」にチェックを入れてください。</p>
      )}

      {status === "error" && (
        <p className="text-sm text-red-600">
          送信に失敗しました。お手数ですが時間をおいて再度お試しください。
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-60"
      >
        {status === "sending" ? "送信中..." : "送信する"}
      </button>
    </form>
  );
}
