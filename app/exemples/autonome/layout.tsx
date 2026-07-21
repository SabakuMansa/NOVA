import type { Metadata } from "next";
import { Bodoni_Moda, Work_Sans, Cormorant_Garamond } from "next/font/google";
import AutonomeBanner from "@/components/exemples/autonome/Banner";
import AutonomeFooter from "@/components/exemples/autonome/Footer";
import AutonomeNav from "@/components/exemples/autonome/Nav";
import { autonomeDemo } from "@/content/exemples/autonome";

// Polices propres à cette démo, chargées uniquement pour les routes sous
// /exemples/autonome (next/font scinde par segment) — n'affectent ni la
// homepage arcade, ni les 3 autres démos. Univers "Maison Doré" (design
// handoff du 21/07, salon haussmannien chic) : Bodoni Moda + Work Sans
// remplacent Space Grotesk/Manrope — mêmes noms de variable CSS, donc tout
// le reste de la démo (Nav/Footer/sous-pages) hérite automatiquement de la
// nouvelle typo. Cormorant Garamond ajoutée en 3e police, uniquement pour
// le paragraphe d'accroche du hero (via style inline, cf. page.tsx) — pas
// de nouveau token Tailwind, tailwind.config.ts reste intouché.
const bodoniModa = Bodoni_Moda({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-metam-display",
  display: "swap",
});

const workSans = Work_Sans({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-metam-sans",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-metam-serif",
  display: "swap",
});

// Exemple fictif, jamais indexé (même traitement que /demo/*).
export const metadata: Metadata = {
  title: `Exemple — Plan Autonome (${autonomeDemo.business.name})`,
  description:
    "Exemple concret de ce qu'inclut le plan Autonome de K1000 Studio : site complet sur-mesure, espace admin, prise de rendez-vous, SEO local.",
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
    <div
      className={`${bodoniModa.variable} ${workSans.variable} ${cormorantGaramond.variable} metam-scope min-h-screen bg-metam-bg font-metam-sans text-metam-ink`}
    >
      {/* Anime légèrement l'entrée du hero + les survols de cette démo ;
          désactivé sous prefers-reduced-motion, scopé à .metam-scope pour ne
          jamais affecter le reste du site. */}
      <style>{`
        @keyframes metamPop {
          from { opacity: 0; transform: scale(0.97) translateY(6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .metam-scope .metam-pop {
          animation: metamPop 0.6s ease both;
        }
        @media (prefers-reduced-motion: reduce) {
          .metam-scope .metam-pop {
            animation: none;
          }
          .metam-scope .metam-anim {
            transition: none;
          }
        }
      `}</style>
      <AutonomeBanner planLabel="Plan Autonome" />
      <AutonomeNav
        businessName={autonomeDemo.business.name}
        links={autonomeDemo.nav}
      />
      <main>{children}</main>
      <AutonomeFooter
        businessName={autonomeDemo.business.name}
        address={autonomeDemo.business.address}
        hours={autonomeDemo.business.hours}
        planLabel="plan Autonome"
      />
    </div>
  );
}
