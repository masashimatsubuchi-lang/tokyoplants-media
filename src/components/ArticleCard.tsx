import Link from "next/link";
import { PostMeta } from "@/lib/posts";
import { getCategoryBySlug } from "@/lib/categories";

export default function ArticleCard({ post }: { post: PostMeta }) {
  const category = getCategoryBySlug(post.category);

  return (
    <article className="group">
      <Link href={`/${post.category}/${post.slug}`} className="block">
        <div className="aspect-[16/9] bg-green-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
          <span className="text-4xl">🌿</span>
        </div>
        <span className="text-xs font-medium text-green-600">{category?.name}</span>
        <h3 className="mt-1 font-semibold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{post.description}</p>
        <time className="mt-2 block text-xs text-gray-400">{post.date}</time>
      </Link>
    </article>
  );
}
