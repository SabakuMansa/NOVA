import type { Metadata } from "next";
import { JetBrains_Mono, Playfair_Display, Work_Sans } from "next/font/google";
import MachineBanner from "@/components/exemples/machine/Banner";
import MachineFooter from "@/components/exemples/machine/Footer";
import MachineNav from "@/components/exemples/machine/Nav";
import { machineDemo } from "@/content/exemples/machine";

// Polices propres à cette démo, chargées uniquement pour les routes sous
// /exemples/machine (next/font scinde par segment) — n'affectent ni la
// homepage arcade, ni les 3 autres démos. Univers "bistrot parisien
// traditionnel" (design handoff hifi du 21/07, ex-"Chez Margot" → "Chez
// Fernand") : Playfair Display remplace DM Serif Display pour les titres et
// l'ardoise, Work Sans remplace DM Sans pour le corps/UI — mêmes noms de
// variable CSS (--font-braise-display / --font-braise-sans), donc tout le
// reste de la démo (Nav/Footer/sous-pages) hérite automatiquement de la
// nouvelle typo sans changement supplémentaire. JetBrains Mono reste chargé
// pour les indicateurs "en direct" et les chiffres du tableau de bord,
// toujours utilisés par cette page.
const playfairDisplay = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-braise-display",
  display: "swap",
});

const workSans = Work_Sans({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-braise-sans",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-braise-mono",
  display: "swap",
});

// Exemple fictif, jamais indexé (même traitement que /demo/*).
export const metadata: Metadata = {
  title: `Exemple — Plan Machine (${machineDemo.business.name})`,
  description:
    "Exemple concret de ce qu'inclut le plan Machine de K1000 Studio : tout Autonome, plus automatisations visibles et tableau de bord.",
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
    <div
      className={`${playfairDisplay.variable} ${workSans.variable} ${jetBrainsMono.variable} min-h-screen bg-braise-bg font-braise-sans text-braise-ink`}
    >
      <MachineBanner planLabel="Plan Machine" />
      <MachineNav
        businessName={machineDemo.business.name}
        links={machineDemo.nav}
      />
      <main>{children}</main>
      <MachineFooter
        businessName={machineDemo.business.name}
        address={machineDemo.business.address}
        hours={machineDemo.business.hours}
        planLabel="plan Machine"
      />
    </div>
  );
}
