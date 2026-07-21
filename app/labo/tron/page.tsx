import type { Metadata } from "next";
import TronPreview from "@/components/labo/TronPreview";

/**
 * LABO — preview de la navigation spatiale 2D « Tron » (module `components/tron`).
 * Hors périmètre commercial, comme /labo : noindex/nofollow, absente de la nav
 * et du sitemap. Fichier jetable — se supprime sans impacter le module.
 */

export const metadata: Metadata = {
  title: "Labo — Tron",
  description: "Preview technique de la navigation spatiale néon K1000 Studio.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function LaboTronPage() {
  return <TronPreview />;
}
