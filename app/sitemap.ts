import type { MetadataRoute } from "next";
import { seo } from "@/content/site";

// Ancres du one-page v3 (désormais à la racine).
const SECTIONS = ["constat", "moteur", "plans", "process", "fondateur", "contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: seo.siteUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...SECTIONS.map((id) => ({
      url: `${seo.siteUrl}/#${id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
