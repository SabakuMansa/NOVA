import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import BoutiqueBanner from "@/components/exemples/boutique/Banner";
import BoutiqueFooter from "@/components/exemples/boutique/Footer";
import BoutiqueNav from "@/components/exemples/boutique/Nav";
import { CartProvider } from "@/components/exemples/CartContext";
import { boutiqueDemo } from "@/content/exemples/boutique";

// Polices propres à cette démo, chargées uniquement pour les routes sous
// /exemples/boutique (next/font scinde par segment) — n'affectent ni la
// homepage arcade, ni les 3 autres démos. Choix calqués sur la maquette
// Claude Design "04 - Boutique mode" : Playfair Display (serif éditorial,
// pour les titres/logo) + Manrope (sans, confirmé dans le CSS de la
// maquette : font-family: 'Manrope', sans-serif).
const playfairDisplay = Playfair_Display({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-nord-display",
  display: "swap",
});

const manrope = Manrope({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-nord-sans",
  display: "swap",
});

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
      <div
        className={`${playfairDisplay.variable} ${manrope.variable} min-h-screen bg-nord-bg font-nord-sans text-nord-ink`}
      >
        <BoutiqueBanner planLabel="Plan Boutique" />
        <BoutiqueNav
          businessName={boutiqueDemo.business.name}
          links={boutiqueDemo.nav}
        />
        <main>{children}</main>
        <BoutiqueFooter
          businessName={boutiqueDemo.business.name}
          address={boutiqueDemo.business.address}
          hours={boutiqueDemo.business.hours}
          planLabel="plan Boutique"
        />
      </div>
    </CartProvider>
  );
}
