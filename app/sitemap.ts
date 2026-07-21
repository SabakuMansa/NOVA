import type { MetadataRoute } from "next";
import { seo } from "@/content/site";

// Ancres de la page d'accueil v3 + les pages dédiées /qui-je-suis et /labo.
const SECTIONS = [
  "verdict",
  "constat",
  "moteur",
  "plans",
  "process",
  "contact",
];

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
    {
      // Page hub des projets perso — reliée depuis la nav, mais pas un
      // levier commercial : priorité basse, comme les ancres homepage.
      url: `${seo.siteUrl}/labo`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...SECTIONS.map((id) => ({
      url: `${seo.siteUrl}/#${id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
