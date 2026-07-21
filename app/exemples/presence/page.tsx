import Link from "next/link";
import { presenceDemo } from "@/content/exemples/presence";

export default function PresenceAccueilPage() {
  const { accueil, business, selectionDuJour } = presenceDemo;

  return (
    <>
      {/* HERO — recréation fidèle du design handoff "Au Petit Marché" (21/07) */}
      <section className="relative min-h-[480px] overflow-hidden sm:h-[540px]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-85"
          style={{ backgroundImage: `url('${accueil.heroImage}')` }}
          role="img"
          aria-label={accueil.heroImageAlt}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(61,82,69,0.35), rgba(200,73,46,0.15) 45%, rgba(61,50,30,0.7))",
          }}
        />
        <div className="relative flex h-full flex-col items-center justify-center px-6 py-16 text-center sm:px-12">
          <span className="rounded-sm border-2 border-[#f2e6c9] px-4 py-1.5 font-fleur-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-[#f2e6c9]">
            {accueil.heroBadge}
          </span>
          <h1 className="mt-6 font-fleur-display text-[15vw] leading-[0.92] text-[#f5ecd8] [text-shadow:0_3px_18px_rgba(40,30,15,0.5)] sm:text-6xl md:text-7xl">
            <span className="italic">{accueil.heroTitleAccent}</span>
            <br />
            {accueil.heroTitleRest}
          </h1>
          <div className="my-6 h-[3px] w-[60px] bg-[#e0a93b]" />
          <p className="max-w-sm font-fleur-sans text-sm leading-relaxed text-[#f5ecd8]">
            {accueil.subtitle}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link
              href="/exemples/presence/galerie"
              className="rounded-sm bg-[#e0a93b] px-7 py-3.5 font-fleur-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3d3220] transition-transform hover:-translate-y-0.5"
            >
              Voir la sélection du jour
            </Link>
            <Link
              href="/exemples/presence/contact"
              className="rounded-sm border border-[#f2e6c9]/60 px-7 py-3.5 font-fleur-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f5ecd8] transition-colors hover:border-[#f2e6c9]"
            >
              {accueil.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* MODULE CLÉ — "La sélection du jour", recréation fidèle de l'étal du
          zip avec le vrai catalogue plantes de Maison Verdure. */}
      <section className="bg-[#f5ecd8] px-5 py-12 sm:px-11 sm:py-14">
        <div className="mx-auto max-w-content">
          <div className="mb-7 text-center">
            <h2 className="font-fleur-display text-3xl text-[#3d5245] sm:text-4xl">
              {selectionDuJour.title}
            </h2>
            <span className="font-fleur-sans text-[10px] font-medium uppercase tracking-[0.24em] text-[#b08a3a]">
              {selectionDuJour.subtitle}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
            {selectionDuJour.items.map((item) => (
              <div
                key={item.name}
                className="overflow-hidden rounded-sm border border-[#e2d3ab] bg-white"
              >
                <div
                  className="h-[150px] bg-cover bg-center"
                  style={{ backgroundImage: `url('${item.image}')` }}
                  role="img"
                  aria-label={item.name}
                />
                <div className="flex items-center justify-between px-4 py-3.5">
                  <span className="font-fleur-display text-lg text-[#3d3220]">
                    {item.name}
                  </span>
                  <span className="font-fleur-sans text-base font-semibold text-[#c8492e]">
                    {item.price}
                  </span>
                </div>
              </div>
            ))}
            <div className="flex flex-col justify-center rounded-sm bg-[#3d5245] p-[18px] text-[#f2e6c9]">
              <span className="font-fleur-display text-2xl italic leading-tight">
                {selectionDuJour.mystery.title}
              </span>
              <span className="my-2 font-fleur-sans text-xs opacity-80">
                {selectionDuJour.mystery.text}
              </span>
              <span className="font-fleur-sans text-[17px] font-semibold text-[#e0a93b]">
                {selectionDuJour.mystery.price}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-5 pt-2 pb-16 md:px-8 md:pb-24">
        <ul className="mb-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {accueil.highlights.map((h) => (
            <li
              key={h.text}
              className="flex items-center gap-2 font-fleur-sans text-[15px] text-fleur-muted"
            >
              <span className="text-lg" aria-hidden>
                {h.icon}
              </span>
              {h.text}
            </li>
          ))}
        </ul>
        {/* Fiche Google Business mise en avant — mention, pas un vrai back-office. */}
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
