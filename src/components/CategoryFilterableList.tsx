"use client";

import { useMemo, useState } from "react";
import { PostMeta } from "@/lib/posts";
import ArticleCard from "./ArticleCard";

type Option = { label: string; value: string };

const difficultyOptions: Option[] = [
  { label: "難易度: すべて", value: "all" },
  { label: "初心者向け", value: "beginner" },
  { label: "中級者向け", value: "intermediate" },
];

const symptomOptions: Option[] = [
  { label: "症状: すべて", value: "all" },
  { label: "葉が黄色い", value: "yellow" },
  { label: "根腐れ", value: "rootrot" },
  { label: "害虫", value: "pests" },
  { label: "カビ", value: "mold" },
];

const seasonOptions: Option[] = [
  { label: "季節: すべて", value: "all" },
  { label: "春", value: "spring" },
  { label: "夏", value: "summer" },
  { label: "秋", value: "autumn" },
  { label: "冬", value: "winter" },
];

const plantOptions: Option[] = [
  { label: "植物: すべて", value: "all" },
  { label: "モンステラ", value: "monstera" },
  { label: "アンスリウム", value: "anthurium" },
  { label: "フィロデンドロン", value: "philodendron" },
  { label: "ポトス", value: "pothos" },
  { label: "アロカシア", value: "alocasia" },
];

function buildHaystack(post: PostMeta): string {
  return [post.title, post.description, post.author, ...(post.tags ?? [])].join(" ").toLowerCase();
}

function includesAny(text: string, words: string[]): boolean {
  return words.some((word) => text.includes(word));
}

export default function CategoryFilterableList({ posts }: { posts: PostMeta[] }) {
  const [difficulty, setDifficulty] = useState("all");
  const [symptom, setSymptom] = useState("all");
  const [season, setSeason] = useState("all");
  const [plant, setPlant] = useState("all");

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const text = buildHaystack(post);

      const difficultyOk =
        difficulty === "all" ||
        (difficulty === "beginner" && includesAny(text, ["初心者", "入門", "はじめて", "基本"])) ||
        (difficulty === "intermediate" && includesAny(text, ["比較", "検証", "徹底", "完全", "実測"]));

      const symptomOk =
        symptom === "all" ||
        (symptom === "yellow" && includesAny(text, ["黄色", "黄変"])) ||
        (symptom === "rootrot" && includesAny(text, ["根腐れ"])) ||
        (symptom === "pests" && includesAny(text, ["虫", "害虫", "ハダニ", "カイガラムシ"])) ||
        (symptom === "mold" && includesAny(text, ["カビ"]));

      const seasonOk =
        season === "all" ||
        (season === "spring" && includesAny(text, ["春", "3月", "4月", "5月"])) ||
        (season === "summer" && includesAny(text, ["夏", "6月", "7月", "8月"])) ||
        (season === "autumn" && includesAny(text, ["秋", "9月", "10月", "11月"])) ||
        (season === "winter" && includesAny(text, ["冬", "12月", "1月", "2月"]));

      const plantOk =
        plant === "all" ||
        (plant === "monstera" && includesAny(text, ["モンステラ"])) ||
        (plant === "anthurium" && includesAny(text, ["アンスリウム"])) ||
        (plant === "philodendron" && includesAny(text, ["フィロデンドロン"])) ||
        (plant === "pothos" && includesAny(text, ["ポトス"])) ||
        (plant === "alocasia" && includesAny(text, ["アロカシア"]));

      return difficultyOk && symptomOk && seasonOk && plantOk;
    });
  }, [posts, difficulty, symptom, season, plant]);

  return (
    <>
      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <label className="text-xs font-semibold text-gray-600">
            難易度
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-teal-700 focus:outline-none"
            >
              {difficultyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-semibold text-gray-600">
            症状
            <select
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-teal-700 focus:outline-none"
            >
              {symptomOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-semibold text-gray-600">
            季節
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-teal-700 focus:outline-none"
            >
              {seasonOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-semibold text-gray-600">
            植物
            <select
              value={plant}
              onChange={(e) => setPlant(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-teal-700 focus:outline-none"
            >
              {plantOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-3 text-xs text-gray-500">表示件数: {filtered.length}件</p>
      </section>

      {filtered.length === 0 ? (
        <p className="mt-8 text-sm text-gray-500">条件に一致する記事がありません。条件を緩めて再検索してください。</p>
      ) : (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <ArticleCard key={`${post.category}-${post.slug}`} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
