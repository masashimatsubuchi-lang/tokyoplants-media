import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getPostsByCategory } from "@/lib/posts";
import ArticleDetail from "@/components/ArticleDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPostsByCategory("soil").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug("soil", slug);
  if (!post) return {};
  const url = `/soil/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      locale: "ja_JP",
      siteName: "tokyoplants media",
      publishedTime: post.date,
      images: post.image ? [{ url: post.image, alt: post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function SoilArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug("soil", slug);
  if (!post) notFound();
  return <ArticleDetail post={post} />;
}
