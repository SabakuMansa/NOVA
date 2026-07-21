import type { Metadata } from "next";
import ShatterPortal from "@/components/labo/ShatterPortal";

/**
 * LABO — expérimentation technique pure, HORS périmètre commercial.
 * - Route volontairement absente de toute navigation du site.
 * - noindex/nofollow (metadata ci-dessous + disallow /labo dans app/robots.ts).
 * - Absente du sitemap (app/sitemap.ts ne la liste pas).
 * Démo : « portail qui se fissure » — l'écran se brise en verre au clic.
 *
 * Anciennement à la route /labo elle-même ; déplacée ici le 21/07 pour
 * libérer /labo, qui devient la page hub "Le Labo" listant les projets
 * perso (voir app/labo/page.tsx).
 */

export const metadata: Metadata = {
  title: "Labo — portail de verre",
  description: "Terrain de jeu technique K1000 Studio. Rien à vendre ici.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function LaboPortailPage() {
  return <ShatterPortal />;
}
