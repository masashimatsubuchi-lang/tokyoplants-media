import { Metadata } from "next";
import { getPostsByCategory } from "@/lib/posts";
import SpeciesDirectory from "@/components/SpeciesDirectory";

export const metadata: Metadata = {
  title: "植物図鑑",
  description: "属ごとに観葉植物の特徴・品種・育て方を解説",
};

export default function SpeciesPage() {
  const posts = getPostsByCategory("species");
  return <SpeciesDirectory posts={posts} />;
}
