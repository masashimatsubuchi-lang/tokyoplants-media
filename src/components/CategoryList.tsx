import { PostMeta } from "@/lib/posts";
import ArticleCard from "./ArticleCard";

export default function CategoryList({
  posts,
  title,
  description,
}: {
  posts: PostMeta[];
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      <p className="mt-2 text-gray-500">{description}</p>
      {posts.length === 0 ? (
        <p className="mt-8 text-gray-400">まだ記事がありません。</p>
      ) : (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
