import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { getAllAuthors } from "@/lib/authors";

const siteUrl = "https://media.tokyoplants.com";

const staticPaths = ["/", "/guide", "/soil", "/research", "/review", "/species", "/app", "/about", "/contact", "/items"] as const;

function parseDate(value: string): Date {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path, index) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: index === 0 ? 1 : 0.85,
  }));

  const postEntries: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${siteUrl}/${post.category}/${post.slug}`,
    lastModified: parseDate(post.updated ?? post.date),
    changeFrequency: "monthly",
    priority: ["soil", "species"].includes(post.category) ? 0.8 : 0.7,
  }));

  const authorEntries: MetadataRoute.Sitemap = getAllAuthors().map((author) => ({
    url: `${siteUrl}/author/${author.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries, ...authorEntries];
}
