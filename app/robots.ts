import type { MetadataRoute } from "next";
import { seo } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Démos sandbox, exemples de plans : utiles en lien direct, jamais en
      // SEO (commerces fictifs, pas de contenu réel à indexer). /labo/tron
      // est une démo technique (pas /labo lui-même, qui est indexable — sa
      // propre metadata robots noindex/nofollow prend le relais, ce qui
      // exige justement de NE PAS le bloquer ici pour que Google puisse la
      // lire) : bloqué explicitement, pas via un préfixe /labo générique.
      disallow: ["/demo", "/exemples", "/labo/tron"],
    },
    sitemap: `${seo.siteUrl}/sitemap.xml`,
    host: seo.siteUrl,
  };
}
