import { Metadata } from "next";
import { getPostsByCategory } from "@/lib/posts";
import { getCategoryBySlug } from "@/lib/categories";
import CategoryList from "@/components/CategoryList";

const category = getCategoryBySlug("review")!;

export const metadata: Metadata = {
  title: category.name,
  description: category.description,
};

export default function ReviewPage() {
  const posts = getPostsByCategory("review");
  return <CategoryList posts={posts} title={category.name} description={category.description} />;
}
