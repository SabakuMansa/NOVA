import Link from "next/link";
import NotifFeed from "@/components/v3/NotifFeed";
import { machineDemo } from "@/content/exemples/machine";

export default function MachineAccueilPage() {
  const { accueil, business, liveFeed } = machineDemo;

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-arcade-border-thick bg-arcade-card px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-arcade-taupe shadow-[2px_2px_0_#000000]">
            <span className="h-2 w-2 rounded-full bg-corail" aria-hidden />
            {accueil.eyebrow}
          </p>
          <h1 className="mt-6 font-pixel text-lg leading-relaxed tracking-tight text-arcade-cream sm:text-2xl md:text-3xl">
            {accueil.title}
          </h1>
          <p className="mt-5 max-w-lg font-terminal text-xl leading-relaxed text-arcade-tan">
            {accueil.subtitle}
          </p>
          <Link
            href="/exemples/machine/contact"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-arcade-border-thick bg-corail px-6 py-3.5 font-pixel text-[0.6rem] leading-relaxed text-arcade-bg shadow-[4px_4px_0_#FFD23F] transition-transform hover:-translate-y-0.5"
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

          <p className="mt-8 inline-flex items-center gap-2 rounded-xl border-2 border-arcade-border-thick bg-corail/10 px-4 py-3 font-terminal text-lg text-arcade-cream">
            <span aria-hidden>🔔</span>
            {accueil.philosophy}
          </p>
        </div>

        {/* Flux d'activité qui se remplit tout seul, sans clic — la mise en
            scène centrale du plan Machine (contraste avec la photo statique
            mise en avant sur /exemples/autonome). */}
        <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border-2 border-arcade-border-thick bg-arcade-card">
          <div className="flex items-center gap-2 border-b-2 border-arcade-border-thick bg-arcade-bg px-3.5 py-2.5">
            <span
              className="h-3 w-3 rounded-full border-2 border-arcade-border-thick bg-arcade-orange"
              aria-hidden
            />
            <span
              className="h-3 w-3 rounded-full border-2 border-arcade-border-thick bg-arcade-gold"
              aria-hidden
            />
            <span
              className="h-3 w-3 rounded-full border-2 border-arcade-border-thick bg-arcade-tan"
              aria-hidden
            />
            <span className="ml-2 truncate font-mono text-[0.62rem] text-arcade-taupe">
              {business.name} — activité
            </span>
            <span className="ml-auto rounded-md bg-corail px-2 py-0.5 font-mono text-[0.55rem] font-bold uppercase text-arcade-bg">
              live
            </span>
          </div>
          <div className="p-4 sm:p-5">
            <NotifFeed events={liveFeed} />
            <p className="mt-4 border-t-2 border-dashed border-arcade-border pt-3 font-mono text-[0.6rem] uppercase tracking-wide text-arcade-muted">
              Pendant ce temps, personne au salon n&apos;a rien fait.
            </p>
          </div>
        </div>
      </div>

      {/* Fiche Google Business mise en avant — mention, pas un vrai back-office. */}
      <div className="mt-16 flex flex-wrap items-center gap-4 rounded-xl border border-arcade-border bg-arcade-card p-5 sm:p-6">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-arcade-border-thick bg-corail text-2xl"
          aria-hidden
        >
          ⭐
        </span>
        <div>
          <p className="font-pixel text-xs leading-relaxed text-arcade-cream">
            Fiche Google Business
          </p>
          <p className="mt-1 font-terminal text-lg text-arcade-tan">
            {business.googleRating} · {business.googleReviews} avis — mise en
            avant directement depuis le site.
          </p>
        </div>
      </div>
    </section>
  );
}
