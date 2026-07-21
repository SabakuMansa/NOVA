import type { Metadata } from "next";
import { DM_Serif_Display, Work_Sans } from "next/font/google";
import PresenceBanner from "@/components/exemples/presence/Banner";
import PresenceFooter from "@/components/exemples/presence/Footer";
import PresenceNav from "@/components/exemples/presence/Nav";
import { presenceDemo } from "@/content/exemples/presence";

// Polices propres à cette démo, chargées uniquement pour les routes sous
// /exemples/presence (next/font scinde par segment) — n'affectent ni la
// homepage arcade, ni les 3 autres démos. Univers "Au Petit Marché" (design
// handoff du 21/07) : DM Serif Display + Work Sans remplacent Cormorant/
// Nunito — mêmes noms de variable CSS, donc tout le reste de la démo
// (Nav/Footer/sous-pages) hérite automatiquement de la nouvelle typo.
const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-fleur-display",
  display: "swap",
});

const workSans = Work_Sans({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-fleur-sans",
  display: "swap",
});

// Exemple fictif, jamais indexé (même traitement que /demo/*).
export const metadata: Metadata = {
  title: `Exemple — Plan Présence (${presenceDemo.business.name})`,
  description:
    "Exemple concret de ce qu'inclut le plan Présence de K1000 Studio : site 3-4 pages, fiche Google Business, formulaire de contact.",
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
    <div
      className={`${dmSerifDisplay.variable} ${workSans.variable} min-h-screen bg-fleur-bg font-fleur-sans text-fleur-ink`}
    >
      <PresenceBanner planLabel="Plan Présence" />
      <PresenceNav
        businessName={presenceDemo.business.name}
        links={presenceDemo.nav}
      />
      <main>{children}</main>
      <PresenceFooter
        businessName={presenceDemo.business.name}
        address={presenceDemo.business.address}
        hours={presenceDemo.business.hours}
        planLabel="plan Présence"
      />
    </div>
  );
}
