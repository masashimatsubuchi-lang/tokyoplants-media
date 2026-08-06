import { Post } from "@/lib/posts";

export default function ArticleJsonLd({ post, siteUrl = "https://media.tokyoplants.com" }: { post: Post; siteUrl?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Person",
      name: post.author || "tokyoplants 編集部",
    },
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    image: post.image
      ? post.image.startsWith("http")
        ? post.image
        : `${siteUrl}${post.image}`
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "tokyoplants",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/${post.category}/${post.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
