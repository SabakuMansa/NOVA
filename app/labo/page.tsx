import type { Metadata } from "next";
import Link from "next/link";
import SmoothScroll from "@/components/v2/SmoothScroll";
import V3Nav from "@/components/v3/Nav";
import { V3Footer } from "@/components/v3/Sections";
import Reveal from "@/components/Reveal";

/**
 * LE LABO — page hub des projets perso, HORS périmètre commercial K1000.
 * - Route volontairement absente de la nav principale (v3nav.links n'y
 *   pointe pas) et du sitemap (app/sitemap.ts).
 * - noindex/nofollow (metadata ci-dessous + disallow /labo dans app/robots.ts).
 * - Ton plus brut/décontracté que "Mes réalisations" : pas de grille
 *   élaborée, juste une liste de projets qui s'enrichira avec le temps.
 *
 * Le portail qui se fissure façon verre (ancienne démo /labo) vit
 * maintenant à /labo/portail — pas encore relié depuis cette page.
 */

export const metadata: Metadata = {
  title: "Le Labo",
  description: "Projets perso et expérimentations K1000 Studio. Rien à vendre ici.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

const PROJECTS = [
  {
    key: "mousquetaires",
    name: "Les Mousquetaires",
    kind: "Site réel · livré",
    description:
      "Site du club de foot américain Les Mousquetaires — un projet réel, livré bénévolement.",
    href: "https://mousquetairesfootus.fr/",
    external: true,
  },
  {
    key: "tron",
    name: "Navigation spatiale — Tron",
    kind: "Démo technique · jouable",
    description:
      "Une navigation spatiale néon jouable, vaisseau et planètes compris — ce qu'on peut pousser techniquement.",
    href: "/labo/tron",
    external: false,
  },
] as const;

/** Petit aperçu déco du projet Mousquetaires — pas le vrai visuel du site,
 * juste un repère thématique (ballon de foot US) sur fond sobre. */
function MousquetairesPreview() {
  return (
    <div className="flex h-32 items-center justify-center rounded-lg border border-arcade-border bg-arcade-bg-alt">
      <span className="text-5xl" aria-hidden>
        🏈
      </span>
    </div>
  );
}

/** Petit aperçu déco du projet Tron — même langage néon que l'expérience
 * réelle (cyan sur fond sombre), un cercle (planète) + un delta (vaisseau). */
function TronPreview() {
  return (
    <div className="flex h-32 items-center justify-center rounded-lg border border-arcade-border bg-[#05070c]">
      <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden>
        <circle
          cx="36"
          cy="30"
          r="16"
          fill="none"
          stroke="#5ff2ff"
          strokeWidth="2"
          style={{ filter: "drop-shadow(0 0 4px #5ff2ff)" }}
        />
        <path
          d="M36 52 L30 62 L36 59 L42 62 Z"
          fill="none"
          stroke="#5ff2ff"
          strokeWidth="1.5"
          style={{ filter: "drop-shadow(0 0 3px #5ff2ff)" }}
        />
      </svg>
    </div>
  );
}

export default function LaboPage() {
  return (
    <div className="bg-arcade-bg text-arcade-cream">
      <SmoothScroll />
      <V3Nav />
      <main className="pt-28 md:pt-32">
        <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border-2 border-arcade-border-thick bg-arcade-card px-3.5 py-2 font-pixel text-[0.55rem] tracking-wide text-arcade-taupe shadow-[2px_2px_0_#000000]">
              <span className="h-2 w-2 rounded-full bg-arcade-gold" aria-hidden />
              Labo perso
            </p>
            <h1 className="mt-6 max-w-2xl font-pixel text-lg leading-relaxed tracking-tight text-arcade-cream sm:text-2xl md:text-3xl">
              Le Labo
            </h1>
            <p className="mt-6 max-w-xl font-terminal text-xl leading-relaxed text-arcade-tan">
              Ici, rien à vendre. Des projets perso et des expérimentations
              techniques, compilés au fil du temps — commençons par ceux-là.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-12 max-w-2xl">
            <ul className="space-y-5">
              {PROJECTS.map((p) => {
                const Preview = p.key === "mousquetaires" ? MousquetairesPreview : TronPreview;
                return (
                  <li
                    key={p.key}
                    className="rounded-xl border border-arcade-border bg-arcade-card p-4 sm:p-5"
                  >
                    <Preview />
                    <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-pixel text-sm text-arcade-cream">
                        {p.name}
                      </span>
                      <span className="font-mono text-[0.62rem] uppercase tracking-wide text-arcade-taupe">
                        {p.kind}
                      </span>
                    </div>
                    <p className="mt-2 font-terminal text-lg leading-snug text-arcade-tan">
                      {p.description}
                    </p>
                    {p.external ? (
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-arcade-gold transition-colors hover:text-arcade-cream"
                      >
                        Voir le site
                        <span aria-hidden>↗</span>
                      </a>
                    ) : (
                      <Link
                        href={p.href}
                        className="mt-4 inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-arcade-gold transition-colors hover:text-arcade-cream"
                      >
                        Essayer
                        <span aria-hidden>→</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </section>
      </main>
      <V3Footer />
    </div>
  );
}
