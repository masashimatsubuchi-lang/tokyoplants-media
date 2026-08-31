"use client";

import { useState } from "react";
import Link from "next/link";
import { PostMeta } from "@/lib/posts";
import { Category } from "@/lib/categories";
import ArticleCard from "./ArticleCard";

interface CategoryTabData extends Category {
  posts: PostMeta[];
  totalCount: number;
}

export default function CategoryTabs({ tabs }: { tabs: CategoryTabData[] }) {
  const [activeSlug, setActiveSlug] = useState(tabs[0]?.slug);
  const active = tabs.find((t) => t.slug === activeSlug) ?? tabs[0];
  if (!active) return null;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="カテゴリ">
        {tabs.map((tab) => (
          <button
            key={tab.slug}
            type="button"
            role="tab"
            aria-selected={tab.slug === active.slug}
            onClick={() => setActiveSlug(tab.slug)}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
              tab.slug === active.slug
                ? "bg-teal-700 text-white"
                : "bg-white text-gray-500 border border-gray-200 hover:border-teal-300 hover:text-teal-700"
            }`}
          >
            {tab.name}
            <span className={`ml-1.5 ${tab.slug === active.slug ? "text-teal-100" : "text-gray-400"}`}>
              {tab.totalCount}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-end justify-between">
        <p className="text-sm leading-relaxed text-gray-400">{active.description}</p>
        <Link
          href={`/${active.slug}`}
          className="hidden shrink-0 pl-4 text-[13px] font-medium text-gray-400 transition-colors hover:text-gray-900 sm:block"
        >
          すべて見る &rarr;
        </Link>
      </div>

      {active.posts.length === 0 ? (
        <p className="mt-10 text-sm text-gray-400">まだ記事がありません。</p>
      ) : (
        <div className="mt-6 flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 -mx-4 md:mx-0 md:px-0">
          {active.posts.map((post) => (
            <div key={`${post.category}-${post.slug}`} className="w-[280px] shrink-0 snap-start md:w-[300px]">
              <ArticleCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
