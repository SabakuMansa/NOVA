import type { MetadataRoute } from "next";
import { seo } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: seo.siteUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    // Ancres de la page unique — utiles pour le maillage interne.
    ...seo.sections.map((id) => ({
      url: `${seo.siteUrl}/#${id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
