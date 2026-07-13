import type { MetadataRoute } from "next";
import { seo } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Démos sandbox + page labo : utiles en lien direct, jamais en SEO.
      disallow: ["/demo", "/labo"],
    },
    sitemap: `${seo.siteUrl}/sitemap.xml`,
    host: seo.siteUrl,
  };
}
