'use client';

import { useState } from 'react';
import ArticleCard from './ArticleCard';
import type { PostMeta } from '@/lib/posts';

const PAGE_SIZE = 6;

export default function AllArticlesList({ posts }: { posts: PostMeta[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  return (
    <>
      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {visible.map((post) => (
          <ArticleCard key={`${post.category}-${post.slug}`} post={post} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            className="rounded-full border border-teal-600 px-8 py-3 text-sm font-semibold text-teal-700 hover:bg-teal-50 transition-colors"
          >
            もっと見る ({posts.length - visibleCount}件)
          </button>
        </div>
      )}
    </>
  );
}
