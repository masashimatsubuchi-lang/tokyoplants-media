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
  const url = `/species/${post.slug}`;
  const ogImageUrl = `/og?title=${encodeURIComponent(post.title)}&category=species`;
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
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImageUrl],
    },
  };
}

export default async function SpeciesArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug("species", slug);
  if (!post) notFound();
  return <ArticleDetail post={post} />;
}
