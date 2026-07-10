import { carte } from "@/content/site";
import Reveal from "./Reveal";
import ScaleReveal from "./ScaleReveal";

export default function Carte() {
  return (
    <section id={carte.id} className="bg-lie/[0.04] py-24 md:py-32">
      <div className="mx-auto max-w-content px-5 md:px-8">
        <Reveal>
          <div className="text-center">
            <p className="font-mono text-[0.68rem] uppercase tracking-eyebrow text-lie">
              {carte.eyebrow}
            </p>
            <h2 className="mt-4 font-display text-5xl text-cafe sm:text-6xl md:text-7xl">
              {carte.title}
            </h2>
            <p className="mt-4 font-sans text-lg text-cafe/70">
              {carte.subtitle}
            </p>
          </div>
        </Reveal>

        {/* Le carton de menu — entrée en un seul bloc (fade + scale), jamais fragmenté */}
        <ScaleReveal>
          <div className="mx-auto mt-14 max-w-4xl">
            <div
              className="relative rounded-[0.4rem] border-2 border-cafe/25 bg-[#FBF6EA] p-6 shadow-[0_24px_60px_-30px_rgba(46,37,33,0.5)] sm:p-10 md:p-14"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(46,37,33,0.035) 39px, rgba(46,37,33,0.035) 40px)",
              }}
            >
              {/* Filet décoratif intérieur */}
              <div className="pointer-events-none absolute inset-3 rounded-[0.3rem] border border-cafe/15" />

              {/* En-tête du menu */}
              <div className="relative mb-10 text-center">
                <div className="flex items-center justify-center gap-3">
                  <span className="h-px w-10 bg-cafe/30" />
                  <span className="font-mono text-[0.62rem] uppercase tracking-eyebrow text-lie">
                    Menu du studio
                  </span>
                  <span className="h-px w-10 bg-cafe/30" />
                </div>
                <p className="mt-3 font-display text-2xl italic text-cafe/70">
                  Établi en Île-de-France
                </p>
              </div>

              {/* Plats = offres */}
              <ul className="relative space-y-9">
                {carte.offres.map((o) => (
                  <li
                    key={o.name}
                    className={
                      o.featured
                        ? "featured-offer -mx-3 rounded-lg bg-moutarde/[0.09] px-3 py-4 ring-1 ring-moutarde/30 transition-all duration-300 hover:bg-moutarde/[0.14] hover:ring-moutarde/60 sm:-mx-5 sm:px-5"
                        : ""
                    }
                  >
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <h3 className="font-display text-2xl text-cafe sm:text-[1.7rem]">
                        {o.name}
                      </h3>
                      {o.badge && (
                        <span className="rounded-full bg-lie px-2.5 py-0.5 font-mono text-[0.58rem] uppercase tracking-wide text-nappe">
                          {o.badge}
                        </span>
                      )}
                      {/* points de suite façon carte */}
                      <span className="dot-leader hidden sm:block" />
                      <span className="ml-auto font-mono text-xl font-medium text-cafe sm:ml-0 sm:text-2xl">
                        {o.price}
                      </span>
                    </div>

                    <p className="mt-1.5 max-w-2xl font-sans text-[0.98rem] italic leading-snug text-cafe/70">
                      {o.tagline}
                    </p>

                    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
                      {o.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 font-sans text-sm text-cafe/75"
                        >
                          <span className="text-sauge">·</span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <p className="mt-3 font-mono text-xs uppercase tracking-wide text-lie/80">
                      {o.subscription}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Suppléments à la carte — secondaire, même style menu (plus discret) */}
              <div className="relative mt-8 border-t border-dashed border-cafe/20 pt-6">
                <p className="font-mono text-[0.6rem] uppercase tracking-eyebrow text-cafe/50">
                  {carte.supplement.title}
                </p>
                <div className="mt-3 flex flex-wrap items-baseline gap-x-2">
                  <h4 className="font-display text-lg text-cafe sm:text-xl">
                    {carte.supplement.name}
                  </h4>
                  <span className="dot-leader hidden sm:block" />
                  <span className="ml-auto font-mono text-sm font-medium text-cafe sm:ml-0 sm:text-base">
                    {carte.supplement.price}
                  </span>
                </div>
                <p className="mt-1.5 max-w-2xl font-sans text-sm italic leading-snug text-cafe/70">
                  {carte.supplement.description}
                </p>
                <p className="mt-2 max-w-2xl font-sans text-xs leading-snug text-cafe/55">
                  {carte.supplement.availability}
                </p>
                <p className="mt-3 max-w-2xl font-sans text-[0.7rem] leading-relaxed text-cafe/50">
                  {carte.supplement.note}
                </p>
              </div>

              {/* Pied du carton */}
              <div className="relative mt-10 border-t border-dashed border-cafe/25 pt-6 text-center">
                <p className="font-display text-lg italic text-cafe/70">
                  {carte.footnote}
                </p>
                <a
                  href={carte.footnoteCta.href}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-cafe px-6 py-3 font-sans text-sm font-medium text-nappe transition-all hover:-translate-y-0.5 hover:bg-lie"
                >
                  {carte.footnoteCta.label}
                  <span aria-hidden>→</span>
                </a>
              </div>
            </div>
            <p className="mt-4 text-center font-mono text-[0.62rem] uppercase tracking-wide text-cafe/45">
              Prix indicatifs · devis personnalisé après audit
            </p>
          </div>
        </ScaleReveal>
      </div>
    </section>
  );
}
