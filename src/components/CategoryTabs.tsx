"use client";

import { useState } from "react";
import Link from "next/link";
import { PostMeta } from "@/lib/posts";
import { Category } from "@/lib/categories";
import ArticleCard from "./ArticleCard";
import ShelfScroller from "./home/ShelfScroller";

interface CategoryTabData extends Category {
  posts: PostMeta[];
  totalCount: number;
}

// トップの「カテゴリの新着」。記事は「よく読まれている記事」と同じ横スクロールの棚で見せる。
// タブと説明は見出しの幅（.store-gutter）に収め、棚だけ画面の右端まで流す。
export default function CategoryTabs({ tabs }: { tabs: CategoryTabData[] }) {
  const [activeSlug, setActiveSlug] = useState(tabs[0]?.slug);
  const active = tabs.find((t) => t.slug === activeSlug) ?? tabs[0];
  if (!active) return null;

  return (
    <div>
      <div className="store-gutter">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="カテゴリ">
            {tabs.map((tab) => (
              <button
                key={tab.slug}
                type="button"
                role="tab"
                aria-selected={tab.slug === active.slug}
                onClick={() => setActiveSlug(tab.slug)}
                className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                  tab.slug === active.slug ? "bg-[#1d1d1f] text-white" : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#ebebf0]"
                }`}
              >
                {tab.name}
                <span className={`ml-1.5 font-normal ${tab.slug === active.slug ? "text-white/60" : "text-[#86868b]"}`}>
                  {tab.totalCount}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-end justify-between">
            <p className="text-[13px] leading-relaxed text-[#86868b]">{active.description}</p>
            <Link
              href={`/${active.slug}`}
              className="hidden shrink-0 pl-4 text-[13px] font-medium text-[#2c6e52] hover:underline sm:block"
            >
              すべて見る ›
            </Link>
          </div>
        </div>
      </div>

      {active.posts.length === 0 ? (
        <p className="store-gutter mt-10 text-sm text-[#86868b]">まだ記事がありません。</p>
      ) : (
        <div className="mt-5">
          {/* タブを切り替えたら棚を先頭から見せる */}
          <ShelfScroller key={active.slug} label={`${active.name}の新着`}>
            {active.posts.map((post) => (
              <div key={`${post.category}-${post.slug}`} className="w-[78%] shrink-0 snap-start sm:w-[300px]">
                <ArticleCard post={post} />
              </div>
            ))}
          </ShelfScroller>
        </div>
      )}
    </div>
  );
}
