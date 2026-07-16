import type { Metadata } from "next";
import ExempleBanner from "@/components/exemples/ExempleBanner";
import ExempleFooter from "@/components/exemples/ExempleFooter";
import ExempleNav from "@/components/exemples/ExempleNav";
import { autonomeDemo } from "@/content/exemples/autonome";

// Exemple fictif, jamais indexé (même traitement que /demo/*).
export const metadata: Metadata = {
  title: `Exemple — Plan Autonome (${autonomeDemo.business.name})`,
  description:
    "Exemple concret de ce qu'inclut le plan Autonome de NOVA Studio : site complet sur-mesure, espace admin, prise de rendez-vous, SEO local.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function AutonomeDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-arcade-bg text-arcade-cream">
      <ExempleBanner planLabel="Plan Autonome" />
      <ExempleNav
        businessName={autonomeDemo.business.name}
        links={autonomeDemo.nav}
      />
      <main>{children}</main>
      <ExempleFooter
        businessName={autonomeDemo.business.name}
        address={autonomeDemo.business.address}
        hours={autonomeDemo.business.hours}
        planLabel="plan Autonome"
      />
    </div>
  );
}
