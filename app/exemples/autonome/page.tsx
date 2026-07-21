import Link from "next/link";
import PlanningSlot from "@/components/exemples/autonome/PlanningSlot";
import { autonomeDemo } from "@/content/exemples/autonome";

export default function AutonomeAccueilPage() {
  const { accueil, business, planningModule } = autonomeDemo;

  return (
    <>
      {/* HERO — recréation fidèle du design handoff "Maison Doré" (21/07) :
          salon haussmannien chic, cadre or filet, titre 2 lignes (2e ligne
          italique dorée), paragraphe Cormorant Garamond, CTA or. */}
      <section className="relative min-h-[480px] overflow-hidden bg-[#2a231b] sm:h-[540px]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{ backgroundImage: `url('${accueil.heroImage}')` }}
          role="img"
          aria-label={accueil.heroImageAlt}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,16,12,0.55), rgba(20,16,12,0.2) 45%, rgba(20,16,12,0.85))",
          }}
        />
        <div className="pointer-events-none absolute inset-[20px] border border-[#b89968]/40" />
        <div className="relative flex h-full flex-col items-center justify-center px-6 py-16 text-center sm:px-12">
          <span className="font-metam-sans text-[10px] uppercase tracking-[0.4em] text-[#b89968]">
            {accueil.heroBadge}
          </span>
          <h1 className="mt-5 font-metam-display text-[13vw] font-normal leading-none text-[#f3ede3] sm:text-6xl md:text-7xl">
            {accueil.heroTitleRest}
            <br />
            <span className="italic text-[#e0c48d]">
              {accueil.heroTitleAccent}
            </span>
          </h1>
          <div className="my-6 h-px w-11 bg-[#b89968]" />
          <p
            className="max-w-sm text-[19px] leading-relaxed text-[#e7d9bf]"
            style={{ fontFamily: "var(--font-metam-serif)" }}
          >
            {accueil.heroParagraph}
          </p>
          <Link
            href="/exemples/autonome/contact"
            className="mt-7 rounded-sm bg-[#b89968] px-7 py-3.5 font-metam-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#161310] transition-transform hover:-translate-y-0.5"
          >
            {accueil.cta}
          </Link>
        </div>
      </section>

      {/* MODULE CLÉ — "Espace salon / Planning du mardi 21", recréation
          fidèle du module du zip. La maquette d'origine se lit comme un
          reporting automatisé ; l'affordance crayon sur le 1er créneau
          rappelle que sur le plan Autonome, c'est le commerçant qui modifie
          lui-même son planning — pas un système automatique (→ Machine). */}
      <section className="bg-[#f3ede3] px-5 py-12 sm:px-11 sm:py-14">
        <div className="mx-auto max-w-content">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-metam-sans text-[9.5px] uppercase tracking-[0.3em] text-[#a9946a]">
                {planningModule.eyebrow}
              </span>
              <h2 className="mt-1 font-metam-display text-2xl text-[#161310] sm:text-[30px]">
                {planningModule.title}
              </h2>
            </div>
            <span className="rounded-sm border border-[#cabfa6] px-3.5 py-2 font-metam-sans text-[11px] font-medium text-[#7a6f5c]">
              {planningModule.badge}
            </span>
          </div>

          <div className="overflow-hidden rounded-sm border border-[#e3d9c5] bg-white">
            <div className="grid grid-cols-[56px_1fr_1fr] bg-[#161310] px-4 py-2.5 font-metam-sans text-[10px] uppercase tracking-[0.14em] text-[#b89968] sm:grid-cols-[70px_1fr_1fr] sm:px-4">
              <span>Heure</span>
              <span>{planningModule.staff[0]}</span>
              <span>{planningModule.staff[1]}</span>
            </div>
            {planningModule.rows.map((row, i) => (
              <div
                key={row.time}
                className={`grid grid-cols-[56px_1fr_1fr] items-center gap-2 px-3 py-2.5 sm:grid-cols-[70px_1fr_1fr] sm:gap-0 sm:px-4 sm:py-3 ${
                  i < planningModule.rows.length - 1
                    ? "border-b border-[#f0e9db]"
                    : ""
                }`}
              >
                <span className="font-metam-sans text-[12px] text-[#7a6f5c]">
                  {row.time}
                </span>
                {row.slots.map((slot, j) =>
                  slot.free ? (
                    <span
                      key={j}
                      className="font-metam-sans text-[11px] text-[#b6a988]"
                    >
                      libre
                    </span>
                  ) : slot.editable ? (
                    <PlanningSlot
                      key={j}
                      text={slot.text}
                      borderColor={j === 0 ? "#b89968" : "#7a6f5c"}
                    />
                  ) : (
                    <span
                      key={j}
                      className="py-2 pl-2.5 pr-2 font-metam-sans text-[12px] text-[#3a3226]"
                      style={{
                        background: "#f6efdf",
                        borderLeft: `3px solid ${j === 0 ? "#b89968" : "#7a6f5c"}`,
                      }}
                    >
                      {slot.text}
                    </span>
                  ),
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <div className="flex-1 rounded-sm bg-[#161310] px-[18px] py-4">
              <div className="font-metam-display text-[28px] text-[#e0c48d]">
                {planningModule.stats.encaisseValue}
              </div>
              <div className="font-metam-sans text-[10px] uppercase tracking-[0.12em] text-[#e7d9bf]/70">
                {planningModule.stats.encaisseLabel}
              </div>
            </div>
            <div className="flex-1 rounded-sm border border-[#e3d9c5] bg-white px-[18px] py-4">
              <div className="font-metam-display text-[28px] text-[#161310]">
                {planningModule.stats.tauxValue}
              </div>
              <div className="font-metam-sans text-[10px] uppercase tracking-[0.12em] text-[#a9946a]">
                {planningModule.stats.tauxLabel}
              </div>
            </div>
          </div>
        </div>
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
