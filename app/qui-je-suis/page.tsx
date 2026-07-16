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
 */
export default function QuiJeSuisPage() {
  return (
    <div className="bg-lait text-encre">
      <SmoothScroll />
      <V3Nav />
      <main className="pt-28 md:pt-32">
        <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border-2 border-encre bg-white px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-encre shadow-[2px_2px_0_#211D16]">
              <span className="h-2 w-2 rounded-full bg-jaune" aria-hidden />
              {v3fondateur.eyebrow}
            </p>
            <h1 className="mt-6 max-w-2xl font-sans text-4xl font-extrabold tracking-tight text-encre sm:text-5xl md:text-6xl">
              {v3fondateur.title}
            </h1>
            <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-encre/75">
              {v3fondateur.pageIntro}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {v3fondateur.badges.map((b) => (
                <span
                  key={b}
                  className="rounded-full border-2 border-encre bg-white px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-wide text-encre shadow-[2px_2px_0_#211D16]"
                >
                  {b}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-14 max-w-2xl">
            <ul className="space-y-3.5">
              {v3fondateur.points.map((p, i) => (
                <li key={i} className="v3-card flex items-start gap-3.5 p-4">
                  <span
                    className="font-mono text-sm font-bold text-corail"
                    aria-hidden
                  >
                    {">"}_
                  </span>
                  <span className="font-sans leading-snug text-encre/85">
                    {p}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-l-4 border-jaune pl-4 font-display text-xl italic leading-snug text-encre/80">
              {v3fondateur.closing}
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-14">
            <div className="v3-card flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <p className="font-sans text-lg font-bold text-encre">
                On regarde votre commerce ensemble ?
              </p>
              <Link
                href="mailto:bonjour@nova-studio.fr"
                className="shrink-0 rounded-xl border-2 border-encre bg-corail px-6 py-3 text-center font-sans text-sm font-bold text-white shadow-[3px_3px_0_#211D16] transition-transform hover:-translate-y-0.5"
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
