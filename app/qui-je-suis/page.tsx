import type { Metadata } from "next";
import Link from "next/link";
import SmoothScroll from "@/components/v2/SmoothScroll";
import V3Nav from "@/components/v3/Nav";
import { V3Footer } from "@/components/v3/Sections";
import Reveal from "@/components/Reveal";
import { v3fondateur } from "@/content/v3";

export const metadata: Metadata = {
  title: "Qui suis-je",
  description:
    "Restaurateur en activité en Île-de-France, à l'origine de NOVA Studio après un constat vécu au quotidien — pas une agence qui a lu sur les commerçants.",
};

/**
 * Page dédiée au fondateur — développe ce que la section homepage ne fait
 * qu'évoquer (teaser + lien). Reste factuel : aucun détail inventé (dates,
 * nombre d'établissements) au-delà de ce qui est établi ailleurs sur le site.
 * Restylé le 16/07 en pixel arcade (cohérence DA sitewide) — Nav/Footer
 * étaient déjà arcade, seul le corps de page suivait encore l'ancien thème
 * clair. Titre en font-pixel, corps de texte en font-terminal (règle de
 * lisibilité déjà appliquée sur "La Carte" : pixel réservé aux titres).
 */
export default function QuiJeSuisPage() {
  return (
    <div className="bg-arcade-bg text-arcade-cream">
      <SmoothScroll />
      <V3Nav />
      <main className="pt-28 md:pt-32">
        <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border-2 border-arcade-border-thick bg-arcade-card px-3.5 py-2 font-pixel text-[0.55rem] tracking-wide text-arcade-taupe shadow-[2px_2px_0_#000000]">
              <span className="h-2 w-2 rounded-full bg-arcade-gold" aria-hidden />
              {v3fondateur.eyebrow}
            </p>
            <h1 className="mt-6 max-w-2xl font-pixel text-lg leading-relaxed tracking-tight text-arcade-cream sm:text-2xl md:text-3xl">
              {v3fondateur.title}
            </h1>
            <p className="mt-6 max-w-xl font-terminal text-xl leading-relaxed text-arcade-tan">
              {v3fondateur.pageIntro}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {v3fondateur.badges.map((b) => (
                <span
                  key={b}
                  className="rounded-full border-2 border-arcade-border-thick bg-arcade-card px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-wide text-arcade-taupe shadow-[2px_2px_0_#000000]"
                >
                  {b}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-14 max-w-2xl">
            <ul className="space-y-3.5">
              {v3fondateur.points.map((p, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3.5 rounded-xl border border-arcade-border bg-arcade-card p-4"
                >
                  <span
                    className="font-mono text-sm font-bold text-corail"
                    aria-hidden
                  >
                    {">"}_
                  </span>
                  <span className="font-terminal text-lg leading-snug text-arcade-tan">
                    {p}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-l-4 border-arcade-gold pl-4 font-display text-xl italic leading-snug text-arcade-cream">
              {v3fondateur.closing}
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-14">
            <div className="flex flex-col items-start gap-4 rounded-xl border border-arcade-border bg-arcade-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <p className="font-pixel text-sm text-arcade-cream">
                On regarde votre commerce ensemble ?
              </p>
              <Link
                href="mailto:bonjour@nova-studio.fr"
                className="shrink-0 rounded-lg border-2 border-arcade-border-thick bg-arcade-orange px-6 py-4 text-center font-pixel text-[0.6rem] leading-relaxed text-arcade-bg shadow-[5px_5px_0_#FFD23F] transition-transform hover:-translate-y-0.5"
              >
                Réserver un audit gratuit →
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
      <V3Footer />
    </div>
  );
}
