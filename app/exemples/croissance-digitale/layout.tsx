import type { Metadata } from "next";
import ExempleBanner from "@/components/exemples/ExempleBanner";
import ExempleFooter from "@/components/exemples/ExempleFooter";
import ExempleNav from "@/components/exemples/ExempleNav";
import { croissanceDigitaleDemo } from "@/content/exemples/croissance-digitale";

// Exemple fictif, jamais indexé (même traitement que /demo/*).
export const metadata: Metadata = {
  title: `Exemple — Plan Machine (${croissanceDigitaleDemo.business.name})`,
  description:
    "Exemple concret de ce qu'inclut le plan Machine de NOVA Studio : tout Autonome, plus automatisations visibles et tableau de bord.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function CroissanceDigitaleDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-lait text-encre">
      <ExempleBanner planLabel="Plan Machine" />
      <ExempleNav
        businessName={croissanceDigitaleDemo.business.name}
        links={croissanceDigitaleDemo.nav}
      />
      <main>{children}</main>
      <ExempleFooter
        businessName={croissanceDigitaleDemo.business.name}
        address={croissanceDigitaleDemo.business.address}
        hours={croissanceDigitaleDemo.business.hours}
        planLabel="plan Machine"
      />
    </div>
  );
}
