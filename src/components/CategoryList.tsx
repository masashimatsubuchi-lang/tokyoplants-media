import { PostMeta } from "@/lib/posts";
import CategoryFilterableList from "./CategoryFilterableList";

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
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">{title}</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{description}</p>
      {posts.length === 0 ? <p className="mt-8 text-gray-500">まだ記事がありません。</p> : <CategoryFilterableList posts={posts} />}
    </div>
  );
}
