import Link from "next/link";
import Image from "next/image";
import { PostMeta } from "@/lib/posts";
import { getCategoryBySlug } from "@/lib/categories";

export default function ArticleCard({ post }: { post: PostMeta }) {
  const category = getCategoryBySlug(post.category);

  return (
    <article className="group h-full">
      <Link
        href={`/${post.category}/${post.slug}`}
        className="block h-full rounded-2xl border border-gray-100 bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
      >
        <div className="aspect-[3/2] rounded-xl bg-gray-100 mb-4 overflow-hidden relative">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl opacity-30">&#x1f331;</span>
            </div>
          )}
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-teal-700">
          {category?.name}
        </span>
        <h3 className="mt-1.5 min-h-[3.2rem] text-[18px] font-bold leading-snug text-gray-900 group-hover:text-teal-700 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="mt-2 min-h-[2.8rem] text-[14px] leading-relaxed text-gray-600 line-clamp-2">
          {post.description}
        </p>
        <time className="mt-4 block text-xs font-medium text-gray-500">{post.date}</time>
      </Link>
    </article>
  );
}
