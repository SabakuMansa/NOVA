import Link from "next/link";
import { autonomeDemo } from "@/content/exemples/autonome";

export default function AutonomeAccueilPage() {
  const { accueil, business, nav } = autonomeDemo;
  const prestationsLabel =
    nav.find((l) => l.href.endsWith("/prestations"))?.label ?? "Prestations";

  return (
    <>
      {/* HERO */}
      <section className="grid gap-0 md:min-h-[74vh] md:grid-cols-[1.05fr_1fr] md:items-stretch">
        <div className="metam-pop flex flex-col justify-center px-5 py-14 md:px-16 md:py-20">
          <span className="inline-flex items-center gap-2 font-metam-sans text-[13px] font-semibold uppercase tracking-[1.5px] text-metam-purple">
            <span
              className="h-2 w-2 rounded-full bg-metam-purple"
              aria-hidden
            />
            {accueil.eyebrow}
          </span>
          <h1 className="mt-5 font-metam-display text-4xl font-bold leading-[1.03] tracking-tight text-metam-ink sm:text-5xl lg:text-[3.6rem]">
            {accueil.title}
          </h1>
          <p className="mt-6 max-w-md font-metam-sans text-lg leading-relaxed text-metam-muted">
            {accueil.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3.5">
            <Link
              href="/exemples/autonome/contact"
              className="rounded-lg bg-metam-purple px-7 py-3.5 font-metam-sans text-[15px] font-semibold text-metam-bg transition-transform metam-anim hover:-translate-y-0.5"
            >
              {accueil.cta}
            </Link>
            <Link
              href="/exemples/autonome/prestations"
              className="rounded-lg border border-metam-border-dark px-7 py-3.5 font-metam-sans text-[15px] font-semibold text-metam-ink transition-colors metam-anim hover:border-metam-purple"
            >
              {prestationsLabel}
            </Link>
          </div>
        </div>
        <div
          className="min-h-[280px] bg-cover bg-center grayscale"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1100&q=80&auto=format&fit=crop')",
          }}
          role="img"
          aria-label={`Intérieur du salon ${business.name}`}
        />
      </section>

      {/* HIGHLIGHTS STRIP */}
      <section className="border-y border-metam-border bg-metam-bg-alt">
        <div className="mx-auto grid max-w-content gap-6 px-5 py-10 sm:grid-cols-3 md:px-8">
          {accueil.highlights.map((h) => (
            <div key={h.text} className="flex items-center gap-3">
              <span className="text-xl" aria-hidden>
                {h.icon}
              </span>
              <span className="font-metam-sans text-[15px] font-medium text-metam-ink">
                {h.text}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* PHILOSOPHIE — distingue ce plan de Machine, mis en évidence */}
      <section className="bg-metam-dark px-5 py-14 text-center md:px-8">
        <p className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-3 font-metam-sans text-lg font-semibold leading-relaxed text-metam-bg sm:text-xl">
          <span className="text-2xl" aria-hidden>
            🖐️
          </span>
          <span className="text-metam-purple-soft">{accueil.philosophy}</span>
        </p>
      </section>

      {/* Fiche Google Business mise en avant — mention, pas un vrai back-office. */}
      <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-20">
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-metam-border bg-metam-bg-alt p-5 sm:p-6">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-metam-purple text-xl text-metam-bg"
            aria-hidden
          >
            ⭐
          </span>
          <div>
            <p className="font-metam-display text-lg font-semibold text-metam-ink">
              Fiche Google Business
            </p>
            <p className="font-metam-sans text-[15px] text-metam-muted">
              {business.googleRating} · {business.googleReviews} avis — mise
              en avant directement depuis le site.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
