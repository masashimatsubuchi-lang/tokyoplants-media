import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://media.tokyoplants.com/sitemap.xml",
    host: "https://media.tokyoplants.com",
  };
}
