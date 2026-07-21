import type { Metadata } from "next";
import PlanetsPreview from "@/components/labo/PlanetsPreview";

/**
 * LABO — preview du module de planètes procédurales (`components/planets`).
 * Hors périmètre commercial, comme /labo : noindex/nofollow, absente de la nav
 * et du sitemap. Fichier jetable — se supprime sans impacter le module.
 */

export const metadata: Metadata = {
  title: "Labo — planètes procédurales",
  description: "Preview technique du module de planètes shader K1000 Studio.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function LaboPlanetesPage() {
  return <PlanetsPreview />;
}
