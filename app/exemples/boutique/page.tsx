import Link from "next/link";
import { HERO_PHOTO } from "@/components/exemples/boutique/productPhotos";
import { boutiqueDemo } from "@/content/exemples/boutique";

export default function BoutiqueAccueilPage() {
  const { accueil, business } = boutiqueDemo;

  return (
    <>
      <section className="grid gap-0 md:min-h-[78vh] md:grid-cols-[1fr_1.05fr] md:items-stretch">
        <div
          className="min-h-[320px] bg-nord-bg-alt bg-cover bg-center"
          style={{
            backgroundImage: `url('${HERO_PHOTO}?w=1200&q=80&auto=format&fit=crop')`,
          }}
          role="img"
          aria-label={`Savons artisanaux ${business.name}`}
        />
        <div className="flex flex-col justify-center px-5 py-14 md:px-16 md:py-20">
          <span className="font-nord-sans text-[13px] uppercase tracking-[0.22em] text-nord-camel">
            {accueil.eyebrow}
          </span>
          <h1 className="mt-5 font-nord-display text-4xl leading-[1.08] text-nord-ink sm:text-5xl lg:text-6xl">
            {accueil.title}
          </h1>
          <p className="mt-6 max-w-md font-nord-sans text-lg leading-relaxed text-nord-muted">
            {accueil.subtitle}
          </p>
          <Link
            href="/exemples/boutique/catalogue"
            className="mt-8 inline-flex w-fit items-center justify-center gap-2 border border-nord-ink bg-nord-ink px-7 py-3.5 font-nord-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-nord-bg transition-colors hover:bg-transparent hover:text-nord-ink"
          >
            {accueil.cta}
          </Link>
          <ul className="mt-10 space-y-3">
            {accueil.highlights.map((h) => (
              <li
                key={h.text}
                className="flex items-center gap-3 font-nord-sans text-[15px] text-nord-muted"
              >
                <span className="text-lg" aria-hidden>
                  {h.icon}
                </span>
                {h.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Fiche Google Business mise en avant — mention, pas un vrai back-office. */}
      <section className="mx-auto max-w-content px-5 pb-16 md:px-8 md:pb-24">
        <div className="flex flex-wrap items-center gap-4 border border-nord-border bg-nord-bg-alt p-5 sm:p-6">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-nord-camel text-xl text-nord-bg"
            aria-hidden
          >
            ⭐
          </span>
          <div>
            <p className="font-nord-display text-lg text-nord-ink">
              Fiche Google Business
            </p>
            <p className="font-nord-sans text-[15px] text-nord-muted">
              {business.googleRating} · {business.googleReviews} avis — mise
              en avant directement depuis le site.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
