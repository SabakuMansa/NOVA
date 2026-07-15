import type { Metadata } from "next";
import ExempleBanner from "@/components/exemples/ExempleBanner";
import ExempleFooter from "@/components/exemples/ExempleFooter";
import ExempleNav from "@/components/exemples/ExempleNav";
import { CartProvider } from "@/components/exemples/CartContext";
import { boutiqueDemo } from "@/content/exemples/boutique";

// Exemple fictif, jamais indexé (même traitement que /demo/*).
export const metadata: Metadata = {
  title: `Exemple — Plan Boutique (${boutiqueDemo.business.name})`,
  description:
    "Exemple concret de ce qu'inclut le plan Boutique de NOVA Studio : catalogue, panier, paiement en ligne (Stripe, mode test).",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function BoutiqueDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-lait text-encre">
        <ExempleBanner planLabel="Plan Boutique" />
        <ExempleNav
          businessName={boutiqueDemo.business.name}
          links={boutiqueDemo.nav}
        />
        <main>{children}</main>
        <ExempleFooter
          businessName={boutiqueDemo.business.name}
          address={boutiqueDemo.business.address}
          hours={boutiqueDemo.business.hours}
          planLabel="plan Boutique"
        />
      </div>
    </CartProvider>
  );
}
