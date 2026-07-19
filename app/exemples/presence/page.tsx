import Link from "next/link";
import { presenceDemo } from "@/content/exemples/presence";

export default function PresenceAccueilPage() {
  const { accueil, business } = presenceDemo;

  return (
    <>
      <section className="grid gap-0 md:min-h-[78vh] md:grid-cols-[1.05fr_1fr] md:items-stretch">
        <div className="flex flex-col justify-center px-5 py-14 md:px-16 md:py-20">
          <span className="font-fleur-sans text-[13px] uppercase tracking-[3px] text-fleur-olive">
            {accueil.eyebrow}
          </span>
          <h1 className="mt-5 font-fleur-display text-4xl font-medium leading-[1.05] text-fleur-ink-dark sm:text-5xl lg:text-6xl">
            {accueil.title}
          </h1>
          <p className="mt-6 max-w-md font-fleur-sans text-lg leading-relaxed text-fleur-muted">
            {accueil.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/exemples/presence/galerie"
              className="rounded-full bg-fleur-sage px-7 py-3.5 font-fleur-sans text-[15px] font-semibold text-fleur-bg transition-transform hover:-translate-y-0.5"
            >
              Voir nos créations
            </Link>
            <Link
              href="/exemples/presence/contact"
              className="rounded-full border border-fleur-olive/60 px-7 py-3.5 font-fleur-sans text-[15px] font-semibold text-fleur-ink transition-colors hover:border-fleur-sage"
            >
              {accueil.cta}
            </Link>
          </div>
          <ul className="mt-10 space-y-3">
            {accueil.highlights.map((h) => (
              <li
                key={h.text}
                className="flex items-center gap-3 font-fleur-sans text-[15px] text-fleur-muted"
              >
                <span className="text-lg" aria-hidden>
                  {h.icon}
                </span>
                {h.text}
              </li>
            ))}
          </ul>
        </div>
        <div
          className="min-h-[280px] bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=1100&q=80&auto=format&fit=crop')",
          }}
          role="img"
          aria-label="Vitrine de plantes de Maison Verdure"
        />
      </section>

      {/* Fiche Google Business mise en avant — mention, pas un vrai back-office. */}
      <section className="mx-auto max-w-content px-5 pb-16 md:px-8 md:pb-24">
        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-fleur-border bg-fleur-bg-alt p-5 sm:p-6">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-fleur-sage text-xl text-fleur-bg"
            aria-hidden
          >
            ⭐
          </span>
          <div>
            <p className="font-fleur-display text-lg text-fleur-ink-dark">
              Fiche Google Business
            </p>
            <p className="font-fleur-sans text-[15px] text-fleur-muted">
              {business.googleRating} · {business.googleReviews} avis — mise
              en avant directement depuis le site.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
