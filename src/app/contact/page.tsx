import { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

const PAGE_TITLE = "お問い合わせ";
const PAGE_DESCRIPTION =
  "tokyoplants MEDIAへの記事掲載・タイアップのご相談、法人・パートナーシップに関するお問い合わせはこちらから。";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: "/contact",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12 md:py-16">
      <nav className="mb-6 text-[13px] text-zinc-400">
        <Link href="/" className="hover:text-zinc-900 transition-colors">トップ</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-600">お問い合わせ</span>
      </nav>

      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-teal-700">Contact</p>
      <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900">
        お問い合わせ
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-zinc-600">
        記事掲載・タイアップのご相談、法人・パートナーシップに関するお問い合わせなどは、下記フォームよりご連絡ください。内容を確認の上、担当者よりご返信いたします。
      </p>

      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
