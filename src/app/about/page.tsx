import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "BOTANY LIFE について",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">About</h1>
      <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
        <p>
          BOTANY LIFE は、観葉植物の魅力をお届けするオウンドメディアです。
        </p>
        <p>
          初心者の方から上級者の方まで、観葉植物の育て方、土の選び方、
          おすすめの品種、園芸用品のレビューなど、幅広い情報を発信しています。
        </p>
        <p>
          植物と暮らす豊かな毎日を、一緒に楽しみましょう。
        </p>
      </div>
    </div>
  );
}
