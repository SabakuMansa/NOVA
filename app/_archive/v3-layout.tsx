import type { Metadata } from "next";
import { seo } from "@/content/site";

// Espace isolé de refonte (direction « geek coloré ») — non indexé tant que
// non validé pour remplacer le site principal.
export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: "K1000 Studio — Votre site bosse pendant que vous servez",
  description:
    "Sites et outils numériques pour commerces locaux d'Île-de-France, construits par un restaurateur en activité. Réservations, avis, commandes : ça tourne tout seul.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/v3" },
};

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return <div className="bg-lait text-encre">{children}</div>;
}
