import Link from "next/link";
import PlaceholderImage from "@/components/exemples/PlaceholderImage";
import { presenceDemo } from "@/content/exemples/presence";

export default function PresenceAccueilPage() {
  const { accueil, business } = presenceDemo;

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-encre bg-white px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-encre shadow-[2px_2px_0_#211D16]">
            <span className="h-2 w-2 rounded-full bg-teal" aria-hidden />
            {accueil.eyebrow}
          </p>
          <h1 className="mt-6 font-sans text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            {accueil.title}
          </h1>
          <p className="mt-5 max-w-lg font-sans text-lg leading-relaxed text-encre/75">
            {accueil.subtitle}
          </p>
          <Link
            href="/exemples/presence/contact"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-encre bg-corail px-6 py-3.5 font-sans text-base font-bold text-white shadow-[4px_4px_0_#211D16] transition-transform hover:-translate-y-0.5"
          >
            {accueil.cta} →
          </Link>
          <ul className="mt-10 space-y-3">
            {accueil.highlights.map((h) => (
              <li
                key={h.text}
                className="flex items-center gap-3 font-sans text-sm text-encre/80"
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
      <div className="v3-card mt-16 flex flex-wrap items-center gap-4 p-5 sm:p-6">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-encre bg-jaune text-2xl"
          aria-hidden
        >
          ⭐
        </span>
        <div>
          <p className="font-sans text-sm font-bold text-encre">
            Fiche Google Business
          </p>
          <p className="font-sans text-sm text-encre/70">
            {business.googleRating} · {business.googleReviews} avis — mise en
            avant directement depuis le site.
          </p>
        </div>
      </div>
    </section>
  );
}
