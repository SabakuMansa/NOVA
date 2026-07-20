import type { Metadata } from "next";
import ShatterPortal from "@/components/labo/ShatterPortal";

/**
 * LABO — expérimentation technique pure, HORS périmètre commercial.
 * - Route volontairement absente de toute navigation du site.
 * - noindex/nofollow (metadata ci-dessous + disallow dans app/robots.ts).
 * - Absente du sitemap (app/sitemap.ts ne la liste pas).
 * Démo : « portail qui se fissure » — l'écran se brise en verre au clic.
 */

export const metadata: Metadata = {
  title: "Labo — expérience 01",
  description: "Terrain de jeu technique K1000 Studio. Rien à vendre ici.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function LaboPage() {
  return <ShatterPortal />;
}
