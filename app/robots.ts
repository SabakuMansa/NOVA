import type { MetadataRoute } from "next";
import { seo } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /v2 : espace de démonstration multi-pages en évaluation (déjà en
      // noindex,nofollow par page) — exclu du crawl tant qu'il n'est pas validé.
      disallow: "/v2",
    },
    sitemap: `${seo.siteUrl}/sitemap.xml`,
    host: seo.siteUrl,
  };
}
