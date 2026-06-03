'use client';

import { useState } from "react";
import { PostMeta } from "@/lib/posts";
import ArticleCard from "./ArticleCard";

// 属名を title から抽出（「〇〇属とは｜...」→「〇〇属」）
function getGenusLabel(title: string) {
  const match = title.match(/^(.+?属)/);
  return match ? match[1] : title.split("｜")[0];
}

export default function SpeciesDirectory({ posts }: { posts: PostMeta[] }) {
  const [activeGenus, setActiveGenus] = useState<string | null>(null);

  // 属ページ（genus-*）と種ページを分離
  const genusPosts = posts.filter((p) => p.slug.startsWith("genus-"));
  const speciesPosts = posts.filter((p) => !p.slug.startsWith("genus-"));

  // フィルター用の属リストを構築（種ページの genus フィールドを使用）
  const genusKeys = Array.from(
    new Set(speciesPosts.map((p) => p.genus).filter(Boolean) as string[])
  );

  // genus キーから表示名を引く（genus-* ページの title を利用）
  const genusLabelMap = new Map<string, string>();
  for (const gp of genusPosts) {
    const key = gp.slug.replace("genus-", "");
    genusLabelMap.set(key, getGenusLabel(gp.title));
  }

  // フィルター済み記事
  const filtered = activeGenus
    ? speciesPosts.filter((p) => p.genus === activeGenus)
    : speciesPosts;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">植物図鑑</h1>
      <p className="mt-2 text-gray-500">
        観葉植物の特徴・品種・育て方を種ごとに解説
      </p>

      {/* フィルターボタン */}
      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveGenus(null)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            activeGenus === null
              ? "bg-teal-700 text-white"
              : "border border-gray-200 bg-white text-gray-600 hover:border-teal-400 hover:text-teal-700"
          }`}
        >
          すべて
        </button>
        {genusKeys.map((key) => (
          <button
            key={key}
            onClick={() => setActiveGenus(key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeGenus === key
                ? "bg-teal-700 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:border-teal-400 hover:text-teal-700"
            }`}
          >
            {genusLabelMap.get(key) ?? key}
          </button>
        ))}
      </div>

      {/* 件数 */}
      <p className="mt-4 text-sm text-gray-400">{filtered.length}件</p>

      {/* 記事グリッド */}
      {filtered.length === 0 ? (
        <p className="mt-10 text-sm text-gray-400">記事がありません。</p>
      ) : (
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
