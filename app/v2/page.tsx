import type { Metadata } from "next";
import Link from "next/link";
import { seo } from "@/content/site";
import V2Hero from "@/components/v2/V2Hero";
import Problemes from "@/components/Problemes";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Accueil",
  description: seo.shortDescription,
  alternates: { canonical: "/v2" },
  openGraph: { title: "NOVA Studio", description: seo.shortDescription, url: "/v2" },
};

const LINKS = [
  {
    href: "/v2/approche",
    label: "L'approche",
    text: "Pourquoi un restaurateur derrière ce studio, et comment on travaille.",
  },
  {
    href: "/v2/carte",
    label: "La carte",
    text: "Les formules, prix inclus, et le supplément commande & livraison.",
  },
  {
    href: "/v2/apercu",
    label: "Aperçu",
    text: "Essayez le configurateur : votre site, en direct.",
  },
  {
    href: "/v2/contact",
    label: "Contact",
    text: "Réservez un audit gratuit, réponse sous 24h.",
  },
];

export default function V2HomePage() {
  return (
    <main>
      <V2Hero />
      <Problemes />

      <section className="mx-auto max-w-content px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <p className="font-mono text-[0.68rem] uppercase tracking-eyebrow text-lie">
            Explorer
          </p>
          <h2 className="mt-4 font-display text-3xl text-cafe sm:text-4xl">
            Le reste du site
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {LINKS.map((l, i) => (
            <Reveal key={l.href} delay={i * 0.08}>
              <Link
                href={l.href}
                className="group flex h-full flex-col justify-between rounded-2xl border border-cafe/10 bg-craie/40 p-6 transition-all hover:-translate-y-1 hover:border-moutarde/40"
              >
                <div>
                  <h3 className="font-display text-xl text-cafe">{l.label}</h3>
                  <p className="mt-2 font-sans text-sm text-cafe/70">{l.text}</p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-lie">
                  Voir
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
