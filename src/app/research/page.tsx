import { Metadata } from "next";
import { getPostsByCategory } from "@/lib/posts";
import { getCategoryBySlug } from "@/lib/categories";
import CategoryList from "@/components/CategoryList";

const category = getCategoryBySlug("research")!;

export const metadata: Metadata = {
  title: category.name,
  description: category.description,
};

export default function ResearchPage() {
  const posts = getPostsByCategory("research");
  return <CategoryList posts={posts} title={category.name} description={category.description} />;
}
