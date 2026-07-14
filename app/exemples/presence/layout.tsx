import type { Metadata } from "next";
import ExempleBanner from "@/components/exemples/ExempleBanner";
import ExempleFooter from "@/components/exemples/ExempleFooter";
import ExempleNav from "@/components/exemples/ExempleNav";
import { presenceDemo } from "@/content/exemples/presence";

// Exemple fictif, jamais indexé (même traitement que /demo/*).
export const metadata: Metadata = {
  title: `Exemple — Plan Présence (${presenceDemo.business.name})`,
  description:
    "Exemple concret de ce qu'inclut le plan Présence de NOVA Studio : site 3-4 pages, fiche Google Business, formulaire de contact.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function PresenceDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-lait text-encre">
      <ExempleBanner planLabel="Plan Présence" />
      <ExempleNav
        businessName={presenceDemo.business.name}
        links={presenceDemo.nav}
      />
      <main>{children}</main>
      <ExempleFooter
        businessName={presenceDemo.business.name}
        address={presenceDemo.business.address}
        hours={presenceDemo.business.hours}
      />
    </div>
  );
}
