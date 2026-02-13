import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getPostsByCategory } from "@/lib/posts";
import ArticleDetail from "@/components/ArticleDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPostsByCategory("species").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug("species", slug);
  if (!post) return {};
  return { title: post.title, description: post.description };
}

export default async function SpeciesArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug("species", slug);
  if (!post) notFound();
  return <ArticleDetail post={post} />;
}
