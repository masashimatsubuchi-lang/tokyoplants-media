import { Post } from "@/lib/posts";

export default function ArticleJsonLd({ post, siteUrl = "https://example.com" }: { post: Post; siteUrl?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Person",
      name: post.author || "BOTANY LIFE",
    },
    datePublished: post.date,
    dateModified: post.date,
    image: post.image ? `${siteUrl}${post.image}` : undefined,
    publisher: {
      "@type": "Organization",
      name: "BOTANY LIFE",
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
