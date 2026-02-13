import { Metadata } from "next";
import { getPostsByCategory } from "@/lib/posts";
import { getCategoryBySlug } from "@/lib/categories";
import CategoryList from "@/components/CategoryList";

const category = getCategoryBySlug("species")!;

export const metadata: Metadata = {
  title: category.name,
  description: category.description,
};

export default function SpeciesPage() {
  const posts = getPostsByCategory("species");
  return <CategoryList posts={posts} title={category.name} description={category.description} />;
}
