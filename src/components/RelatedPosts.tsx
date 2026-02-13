import { PostMeta } from "@/lib/posts";
import ArticleCard from "./ArticleCard";

export default function RelatedPosts({
  posts,
  title,
}: {
  posts: PostMeta[];
  title: string;
}) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <ArticleCard key={`${post.category}-${post.slug}`} post={post} />
        ))}
      </div>
    </section>
  );
}
