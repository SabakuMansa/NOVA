import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono, Work_Sans } from "next/font/google";
import BoutiqueBanner from "@/components/exemples/boutique/Banner";
import BoutiqueFooter from "@/components/exemples/boutique/Footer";
import BoutiqueNav from "@/components/exemples/boutique/Nav";
import { CartProvider } from "@/components/exemples/CartContext";
import { boutiqueDemo } from "@/content/exemples/boutique";

// Polices propres à cette démo, chargées uniquement pour les routes sous
// /exemples/boutique (next/font scinde par segment) — n'affectent ni la
// homepage arcade, ni les 3 autres démos. Univers "Unit—9" (design handoff
// du 21/07, concept store urbain — appliqué visuellement au Petit Atelier) :
// Space Grotesk + Work Sans remplacent Playfair Display/Manrope — mêmes
// noms de variable CSS, donc catalogue/panier/produit/confirmation héritent
// automatiquement de la nouvelle typo. Space Mono ajouté en 3e police pour
// les labels/prix/flourish mono du hero et du module clé (appliqué via
// inline style, jamais de token Tailwind dédié — voir accueil/page.tsx).
const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-nord-display",
  display: "swap",
});

const workSans = Work_Sans({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-nord-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-nord-mono",
  display: "swap",
});

// Exemple fictif, jamais indexé (même traitement que /demo/*).
export const metadata: Metadata = {
  title: `Exemple — Plan Boutique (${boutiqueDemo.business.name})`,
  description:
    "Exemple concret de ce qu'inclut le plan Boutique de K1000 Studio : catalogue, panier, paiement en ligne (Stripe, mode test).",
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
        className={`${spaceGrotesk.variable} ${workSans.variable} ${spaceMono.variable} min-h-screen bg-nord-bg font-nord-sans text-nord-ink`}
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
