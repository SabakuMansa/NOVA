import type { MetadataRoute } from "next";
import { seo } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Pages de démonstration sandbox : utiles en lien direct, pas en SEO.
      disallow: "/demo",
    },
    sitemap: `${seo.siteUrl}/sitemap.xml`,
    host: seo.siteUrl,
  };
}
