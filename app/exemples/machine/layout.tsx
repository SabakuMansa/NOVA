import type { Metadata } from "next";
import ExempleBanner from "@/components/exemples/ExempleBanner";
import ExempleFooter from "@/components/exemples/ExempleFooter";
import ExempleNav from "@/components/exemples/ExempleNav";
import { machineDemo } from "@/content/exemples/machine";

// Exemple fictif, jamais indexé (même traitement que /demo/*).
export const metadata: Metadata = {
  title: `Exemple — Plan Machine (${machineDemo.business.name})`,
  description:
    "Exemple concret de ce qu'inclut le plan Machine de NOVA Studio : tout Autonome, plus automatisations visibles et tableau de bord.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function MachineDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-lait text-encre">
      <ExempleBanner planLabel="Plan Machine" />
      <ExempleNav
        businessName={machineDemo.business.name}
        links={machineDemo.nav}
      />
      <main>{children}</main>
      <ExempleFooter
        businessName={machineDemo.business.name}
        address={machineDemo.business.address}
        hours={machineDemo.business.hours}
        planLabel="plan Machine"
      />
    </div>
  );
}
