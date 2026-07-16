"use client";

import { v3hero } from "@/content/v3";

/**
 * Hero arcade — import maquette Claude Design du 15/07. Cadre "borne
 * d'arcade" (bandeau 1P/HI SCORE décoratif, police pixel) réservé à ce
 * composant + V3Plans, par consigne explicite. V3Backdrop (aurore WebGL)
 * n'est plus rendu ici : le nouveau Hero est un panneau sombre uni, pas un
 * fond animé de blobs colorés — composant conservé intact, simplement plus
 * importé (même traitement que les sections retirées de la homepage).
 * Mockup "fenêtre navigateur avec notifications" retiré le 16/07 (colonne
 * de droite du grid) — colonne unique centrée depuis.
 */
export default function V3Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-arcade-bg pt-28 md:pt-32"
    >
      <div className="relative z-10 mx-auto max-w-content px-5 pb-14 md:px-8 md:pb-20">
        <div className="overflow-hidden rounded-[18px] border border-arcade-border shadow-[0_30px_70px_rgba(0,0,0,0.55)]">
          {/* Bandeau "borne d'arcade" — chrome décoratif uniquement, aucune
              donnée réelle représentée (pas de vrais scores/stats). */}
          <div className="flex items-center justify-between border-b-2 border-arcade-border bg-arcade-bg px-6 py-3.5 font-pixel text-[0.55rem] text-arcade-gold sm:px-8 sm:text-[0.6rem]">
            <span className="text-arcade-orange">
              1P <span className="text-arcade-cream">00042</span>
            </span>
            <span className="arcade-blink hidden sm:inline">INSERT COIN</span>
            <span className="text-arcade-orange">
              HI <span className="text-arcade-cream">99999</span>
            </span>
          </div>

          <div
            className="px-6 py-14 sm:px-10 sm:py-20 lg:px-14"
            style={{
              background:
                "radial-gradient(120% 130% at 50% 20%, #2A1C08 0%, #17130D 60%)",
            }}
          >
            <div className="mx-auto max-w-2xl">
              {/* font-mono (pas font-pixel) : Press Start 2P n'a pas de
                  glyphe correct pour les majuscules accentuées (Î) —
                  vérifié visuellement, glyphe cassé. Le label reste dans
                  l'esprit arcade via la carte/bordure/couleur. */}
              <p className="hero-rise inline-flex items-center gap-2 rounded-full border-2 border-arcade-border-thick bg-arcade-card px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-arcade-taupe">
                <span
                  className="h-2 w-2 animate-pulse rounded-full bg-arcade-orange"
                  aria-hidden
                />
                {v3hero.eyebrow}
              </p>

              <h1
                className="hero-rise mt-7 font-pixel text-[0.95rem] leading-[1.75] text-arcade-cream sm:text-[1.15rem] md:text-[1.3rem]"
                style={{ animationDelay: "0.08s" }}
              >
                {v3hero.titleA}{" "}
                <span className="text-arcade-gold">{v3hero.titleEm}</span>
                {v3hero.titleB}
              </h1>

              <p
                className="hero-rise mt-7 max-w-xl font-terminal text-[1.3rem] leading-snug text-arcade-tan sm:text-[1.45rem]"
                style={{ animationDelay: "0.16s" }}
              >
                {v3hero.subtitle}
              </p>

              <div
                className="hero-rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
                style={{ animationDelay: "0.24s" }}
              >
                <a
                  href={v3hero.ctaPrimary.href}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-arcade-border-thick bg-arcade-orange px-6 py-4 font-pixel text-[0.6rem] leading-relaxed text-arcade-bg shadow-[5px_5px_0_#FFD23F] transition-transform hover:-translate-y-0.5"
                >
                  {v3hero.ctaPrimary.label}
                </a>
                <a
                  href={v3hero.ctaSecondary.href}
                  className="inline-flex items-center justify-center rounded-lg border-2 border-arcade-border-thick bg-transparent px-6 py-4 font-terminal text-xl text-arcade-cream transition-colors hover:border-arcade-orange hover:text-arcade-gold"
                >
                  {v3hero.ctaSecondary.label}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
