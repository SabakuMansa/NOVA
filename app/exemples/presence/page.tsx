import Link from "next/link";
import PlaceholderImage from "@/components/exemples/PlaceholderImage";
import { presenceDemo } from "@/content/exemples/presence";

export default function PresenceAccueilPage() {
  const { accueil, business } = presenceDemo;

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-arcade-border-thick bg-arcade-card px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-arcade-taupe shadow-[2px_2px_0_#000000]">
            <span className="h-2 w-2 rounded-full bg-teal" aria-hidden />
            {accueil.eyebrow}
          </p>
          <h1 className="mt-6 font-pixel text-lg leading-relaxed tracking-tight text-arcade-cream sm:text-2xl md:text-3xl">
            {accueil.title}
          </h1>
          <p className="mt-5 max-w-lg font-terminal text-xl leading-relaxed text-arcade-tan">
            {accueil.subtitle}
          </p>
          <Link
            href="/exemples/presence/contact"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-arcade-border-thick bg-arcade-orange px-6 py-3.5 font-pixel text-[0.6rem] leading-relaxed text-arcade-bg shadow-[5px_5px_0_#FFD23F] transition-transform hover:-translate-y-0.5"
          >
            {accueil.cta} →
          </Link>
          <ul className="mt-10 space-y-3">
            {accueil.highlights.map((h) => (
              <li
                key={h.text}
                className="flex items-center gap-3 font-terminal text-base text-arcade-tan"
              >
                <span className="text-lg" aria-hidden>
                  {h.icon}
                </span>
                {h.text}
              </li>
            ))}
          </ul>
        </div>
        <PlaceholderImage
          icon="🪴"
          label="Photo de la boutique"
          color="violet"
          className="aspect-[4/3] w-full"
        />
      </div>

      {/* Fiche Google Business mise en avant — mention, pas un vrai back-office. */}
      <div className="mt-16 flex flex-wrap items-center gap-4 rounded-xl border border-arcade-border bg-arcade-card p-5 sm:p-6">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-arcade-border-thick bg-jaune text-2xl"
          aria-hidden
        >
          ⭐
        </span>
        <div>
          <p className="font-pixel text-xs text-arcade-cream">
            Fiche Google Business
          </p>
          <p className="font-terminal text-base text-arcade-tan">
            {business.googleRating} · {business.googleReviews} avis — mise en
            avant directement depuis le site.
          </p>
        </div>
      </div>
    </section>
  );
}
