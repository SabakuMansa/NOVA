import { hero } from "@/content/site";

// Composant serveur (aucun JS) : le contenu above-the-fold est rendu côté
// serveur et animé en CSS (classes .hero-rise / .hero-slate). Cela garantit un
// LCP rapide et un affichage même si le JS est lent/désactivé.
export default function Hero() {
  return (
    <section
      id="top"
      className="paper-grain relative overflow-hidden pt-28 md:pt-36"
    >
      {/* Halo décoratif discret */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-24 h-[36rem] w-[36rem] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(200,155,60,0.35) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto grid max-w-content items-center gap-12 px-5 pb-20 md:px-8 md:pb-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        {/* Colonne texte */}
        <div>
          <p className="hero-rise font-mono text-[0.68rem] uppercase tracking-eyebrow text-lie">
            {hero.eyebrow}
          </p>

          <h1
            className="hero-rise mt-6 font-display text-[2.6rem] leading-[1.12] tracking-[-0.005em] text-cafe sm:text-5xl md:text-[3.6rem]"
            style={{ animationDelay: "0.1s" }}
          >
            {hero.titleLead}{" "}
            <span className="display-em relative whitespace-nowrap text-lie">
              {hero.titleEm}
              <svg
                aria-hidden
                viewBox="0 0 200 20"
                className="absolute -bottom-2 left-0 h-3 w-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 12 C 50 4, 150 4, 198 10"
                  stroke="#C89B3C"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            .
          </h1>

          <p
            className="hero-rise mt-8 max-w-xl font-sans text-lg leading-relaxed text-cafe/80"
            style={{ animationDelay: "0.2s" }}
          >
            {hero.subtitle}
          </p>

          <div
            className="hero-rise mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "0.3s" }}
          >
            <a
              href={hero.ctaPrimary.href}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-lie px-7 py-4 font-sans text-base font-medium text-nappe shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              {hero.ctaPrimary.label}
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href={hero.ctaSecondary.href}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cafe/25 px-7 py-4 font-sans text-base text-cafe transition-colors hover:border-cafe hover:bg-craie/60"
            >
              {hero.ctaSecondary.label}
            </a>
          </div>
        </div>

        {/* Colonne visuelle — l'ardoise de bistrot */}
        <div
          className="hero-slate relative mx-auto w-full max-w-sm lg:max-w-md"
          style={{ transform: "rotate(-1.4deg)" }}
        >
          {/* Ficelle d'accroche */}
          <div
            aria-hidden
            className="absolute left-1/2 top-0 z-10 h-6 w-6 -translate-x-1/2 -translate-y-3 rounded-full border-4 border-cafe/70 bg-nappe"
          />
          <div className="relative rounded-[1.4rem] bg-cafe p-7 shadow-[0_30px_60px_-25px_rgba(46,37,33,0.55)] ring-1 ring-black/20 sm:p-9">
            {/* Cadre intérieur façon ardoise */}
            <div className="rounded-[1rem] border border-nappe/15 p-5 sm:p-6">
              <p className="font-mono text-[0.62rem] uppercase tracking-eyebrow text-moutarde">
                {hero.slate.label}
              </p>
              <ul className="mt-5 space-y-4">
                {hero.slate.items.map((it) => (
                  <li key={it.name}>
                    <div className="flex items-baseline">
                      <span className="font-display text-2xl italic text-nappe">
                        {it.name}
                      </span>
                      <span className="dot-leader border-nappe/25" />
                      <svg
                        className="h-4 w-4 shrink-0 text-sauge"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="m5 13 4 4L19 7"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="mt-0.5 font-sans text-sm text-nappe/60">
                      {it.note}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex items-center gap-3 border-t border-dashed border-nappe/20 pt-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-moutarde font-display text-lg text-cafe">
                  N
                </span>
                <p className="font-mono text-[0.62rem] uppercase leading-tight tracking-wide text-nappe/70">
                  {hero.slate.stamp}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
