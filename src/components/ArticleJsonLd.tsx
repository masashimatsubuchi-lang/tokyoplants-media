import { Post } from "@/lib/posts";
import { getAuthorForPost } from "@/lib/authors";

export default function ArticleJsonLd({ post, siteUrl = "https://media.tokyoplants.com" }: { post: Post; siteUrl?: string }) {
  const author = getAuthorForPost(post);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Person",
      name: author.name,
      url: `${siteUrl}/author/${author.slug}`,
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
