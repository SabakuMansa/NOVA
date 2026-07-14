import type { MetadataRoute } from "next";
import { seo } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Démos sandbox, page labo, exemples de plans : utiles en lien direct,
      // jamais en SEO (commerces fictifs, pas de contenu réel à indexer).
      disallow: ["/demo", "/labo", "/exemples"],
    },
    sitemap: `${seo.siteUrl}/sitemap.xml`,
    host: seo.siteUrl,
  };
}
