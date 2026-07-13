import type { Metadata } from "next";
import { Instrument_Serif, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { seo } from "@/content/site";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

const instrument = Instrument_Serif({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-worksans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-plexmono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: {
    default:
      "NOVA Studio — Sites internet pour commerçants qui bossent tout seuls, Île-de-France",
    template: "%s · NOVA Studio",
  },
  description:
    "Pendant que vous êtes en plein service, votre site bosse : réservations, avis, commandes. Sites et outils numériques pour commerces locaux — restaurants, boutiques, artisans — de Saint-Maur-des-Fossés à Suresnes (Val-de-Marne, Hauts-de-Seine), construits par un restaurateur en activité.",
  keywords: [
    "création site internet commerçants",
    "création site internet Île-de-France",
    "site internet restaurant",
    "site internet boutique",
    "site internet artisan",
    "studio digital local",
    "SEO local",
    "site vitrine commerçant",
    "Saint-Maur-des-Fossés",
    "Suresnes",
    "Val-de-Marne",
    "Hauts-de-Seine",
  ],
  alternates: { canonical: "/" },
  authors: [{ name: seo.name }],
  openGraph: {
    title: "NOVA Studio — Votre site bosse pendant que vous servez",
    description:
      "Réservations, avis, commandes : ça tourne tout seul. Par un restaurateur en activité, pour les commerces locaux d'Île-de-France.",
    url: seo.siteUrl,
    siteName: seo.name,
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NOVA Studio — Votre site bosse pendant que vous servez",
    description:
      "Réservations, avis, commandes : ça tourne tout seul. Par un restaurateur en activité, pour les commerces locaux d'Île-de-France.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${instrument.variable} ${workSans.variable} ${plexMono.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
        <JsonLd />
        <Analytics />
      </body>
    </html>
  );
}
