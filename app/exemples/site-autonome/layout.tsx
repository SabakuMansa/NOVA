import type { Metadata } from "next";
import ExempleBanner from "@/components/exemples/ExempleBanner";
import ExempleFooter from "@/components/exemples/ExempleFooter";
import ExempleNav from "@/components/exemples/ExempleNav";
import { siteAutonomeDemo } from "@/content/exemples/site-autonome";

// Exemple fictif, jamais indexé (même traitement que /demo/*).
export const metadata: Metadata = {
  title: `Exemple — Plan Autonome (${siteAutonomeDemo.business.name})`,
  description:
    "Exemple concret de ce qu'inclut le plan Autonome de NOVA Studio : site complet sur-mesure, espace admin, prise de rendez-vous, SEO local.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function SiteAutonomeDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-lait text-encre">
      <ExempleBanner planLabel="Plan Autonome" />
      <ExempleNav
        businessName={siteAutonomeDemo.business.name}
        links={siteAutonomeDemo.nav}
      />
      <main>{children}</main>
      <ExempleFooter
        businessName={siteAutonomeDemo.business.name}
        address={siteAutonomeDemo.business.address}
        hours={siteAutonomeDemo.business.hours}
        planLabel="plan Autonome"
      />
    </div>
  );
}
