import type { MetadataRoute } from "next";
import { seo } from "@/content/site";

// Ancres de la page d'accueil v3 + la page dédiée /qui-je-suis.
const SECTIONS = ["constat", "moteur", "plans", "process", "contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: seo.siteUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${seo.siteUrl}/qui-je-suis`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...SECTIONS.map((id) => ({
      url: `${seo.siteUrl}/#${id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
