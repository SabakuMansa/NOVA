import Link from "next/link";
import NotifFeed from "@/components/v3/NotifFeed";
import { machineDemo } from "@/content/exemples/machine";

const TAG_COLORS: Record<string, string> = {
  avis: "bg-[#e6c48f]/20 text-[#e6c48f]",
  résa: "bg-[#8a6a44]/30 text-[#d9b48a]",
  contact: "bg-[#d9b48a]/15 text-[#d9b48a]",
};

// Labels courts des automatisations actives, dérivés du même triptyque que
// le commentaire d'en-tête de content/exemples/machine.ts (relance avis
// Google post-réservation, confirmation auto de réservation, réponse auto à
// une demande de contact) — aucune donnée inventée, juste re-présentée en
// liste de bascules pour coller au patron "Automatisations actives" de la
// maquette.
const ACTIVE_AUTOMATIONS = [
  { icon: "⭐", label: "Relance avis Google après réservation" },
  { icon: "✅", label: "Confirmation automatique de réservation" },
  { icon: "📩", label: "Réponse automatique aux demandes de contact" },
];

export default function MachineAccueilPage() {
  const { accueil, business, ardoiseDuJour, liveFeed, espaceAdmin } = machineDemo;
  const dashboardTab = espaceAdmin.tabs.find((t) => t.id === "tableau-de-bord");

  return (
    <>
      {/* HERO — recréation fidèle du design handoff "bistrot parisien
          traditionnel" (21/07, ex-"Chez Margot") : photo plein cadre +
          dégradé bordeaux, titre Playfair 2 lignes, citation italique, CTA
          or. */}
      <section className="relative min-h-[480px] overflow-hidden sm:h-[540px]">
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
              "linear-gradient(180deg, rgba(40,15,17,0.55), rgba(40,15,17,0.25) 45%, rgba(40,15,17,0.9))",
          }}
        />
        <div className="relative flex h-full flex-col items-center justify-center px-6 py-16 text-center sm:px-12">
          <span className="font-braise-sans text-[11px] uppercase tracking-[0.36em] text-[#e0be92]">
            {accueil.heroBadge}
          </span>
          <h1 className="mt-5 font-braise-display text-5xl leading-[1.0] text-[#f4ecdd] sm:text-6xl md:text-[62px]">
            {accueil.heroTitleRest}
            <br />
            <span className="italic text-[#e6c48f]">{accueil.heroTitleAccent}</span>
          </h1>
          <p className="mt-5 max-w-sm font-braise-display text-lg italic leading-relaxed text-[#efdcc1]">
            « {accueil.heroQuote} »
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link
              href="/exemples/machine/contact"
              className="rounded-sm bg-[#e6c48f] px-8 py-3.5 font-braise-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b1f24] transition-transform hover:-translate-y-0.5"
            >
              Réserver une table
            </Link>
            <Link
              href="/exemples/machine/prestations"
              className="rounded-sm border border-[#f2e4c9]/50 px-8 py-3.5 font-braise-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f2e4c9] transition-colors hover:border-[#f2e4c9]"
            >
              {accueil.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* MODULE CLÉ — "Ardoise du jour", recréation quasi verbatim du
          design handoff (encadré ardoise, filets pointillés). Suivie d'un
          indicateur d'automatisation visible : le module du zip est
          purement décoratif, cet ajout rend concret le distinguo
          Autonome/Machine juste en dessous, sans quitter l'univers
          bistrot. */}
      <section className="bg-[#f4ecdd] px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-lg">
          <div className="rounded-md border-[6px] border-[#3a3428] bg-[#20211c] px-7 py-8 text-[#f0ead9] sm:px-10">
            <div className="text-center font-braise-display text-[28px] italic leading-tight text-[#e6c48f] sm:text-3xl">
              {ardoiseDuJour.title}
            </div>
            <div className="mt-1 text-center font-braise-sans text-[10px] uppercase tracking-[0.24em] text-[#8a8674]">
              {ardoiseDuJour.date}
            </div>
            <div className="mt-5">
              {ardoiseDuJour.items.map((item, i) => (
                <div
                  key={item.name}
                  className={`flex items-baseline justify-between gap-4 py-2.5 ${
                    i < ardoiseDuJour.items.length - 1 ? "border-b border-dashed border-[#4a4534]" : ""
                  }`}
                >
                  <span className="font-braise-display text-lg sm:text-[19px]">{item.name}</span>
                  <span className="shrink-0 font-braise-sans text-[15px] text-[#e6c48f]">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 text-center font-braise-display text-[15px] italic text-[#c9a06a] sm:text-base">
              {ardoiseDuJour.footer}
            </div>
          </div>

          {/* Indicateur "activité automatique" — pastille pulsante + ligne
              d'événement, intégré visuellement à l'univers bistrot (même
              carte ardoise/or que le module au-dessus). Respecte
              prefers-reduced-motion via motion-safe:. */}
          <div className="mt-4 flex items-center gap-3 rounded-md border border-[#3a3428]/30 bg-[#f2e4c9] px-5 py-3.5">
            <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden>
              <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6b1f24] opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#6b1f24]" />
            </span>
            <p className="min-w-0 flex-1 truncate font-braise-sans text-[13px] text-[#3a2a1e]">
              <span className="font-semibold text-[#6b1f24]">Activité automatique</span>{" "}
              — {accueil.automationHighlight.text}
            </p>
            <span className="shrink-0 font-braise-sans text-[11px] text-[#8a7458]">
              {accueil.automationHighlight.time}
            </span>
          </div>
        </div>
      </section>

      {/* Bandeau d'atouts — 3 colonnes, contenu 100% réel. */}
      <section className="grid gap-8 border-b border-[#3a3428]/10 bg-[#f4ecdd] px-5 py-12 sm:grid-cols-3 md:px-8 md:py-14">
        {accueil.highlights.map((h) => (
          <div key={h.text} className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden>
              {h.icon}
            </span>
            <p className="font-braise-sans text-[15px] leading-snug text-[#6b5d4a]">
              {h.text}
            </p>
          </div>
        ))}
      </section>

      {/* Section automatisations / tableau de bord — le cœur du plan
          Machine, recolorée sur la palette bordeaux/or/ardoise. */}
      <section className="bg-[#20211c] px-5 py-16 text-[#f2e4c9] md:px-16 md:py-24">
        <div className="mx-auto max-w-content">
          <div className="mb-11 max-w-2xl">
            <span className="font-braise-sans text-[13px] uppercase tracking-[3px] text-[#e6c48f]">
              Plan Machine · Automatisations
            </span>
            <h2 className="mt-4 font-braise-display text-3xl leading-tight sm:text-4xl">
              {accueil.philosophy}
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* Tableau de bord */}
            <div className="rounded-2xl border border-[#3a3428] bg-[#26241c] p-6 sm:p-7">
              <div className="mb-6 flex items-center justify-between">
                <span className="font-braise-sans text-base font-semibold">
                  Tableau de bord
                </span>
                <span className="inline-flex items-center gap-1.5 font-braise-mono text-xs text-[#e6c48f]">
                  <span
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e6c48f]"
                    aria-hidden
                  />
                  en direct
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {dashboardTab?.stats?.map((s) => (
                  <div key={s.label} className="rounded-xl bg-[#20211c] p-4">
                    <p className="font-braise-mono text-[1.9rem] font-bold leading-none">
                      {s.value}
                    </p>
                    <p className="mt-2 font-braise-sans text-[13px] leading-snug text-[#d9b48a]">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
              {dashboardTab?.statsNote && (
                <p className="mt-5 font-braise-sans text-xs leading-relaxed text-[#d9b48a]">
                  {dashboardTab.statsNote}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-6">
              {/* Notifications — flux en direct, logique/animation NotifFeed
                  inchangée, seules les couleurs sont recolorées via props. */}
              <div className="rounded-2xl border border-[#3a3428] bg-[#26241c] p-5 sm:p-6">
                <p className="mb-4 font-braise-sans text-base font-semibold">
                  Notifications
                </p>
                <NotifFeed
                  events={liveFeed}
                  tagColors={TAG_COLORS}
                  itemClassName="border-[#3a3428] bg-[#20211c]"
                  textClassName="text-[#f2e4c9]/90"
                />
              </div>

              {/* Automatisations actives — bascules statiques. */}
              <div className="rounded-2xl border border-[#3a3428] bg-[#26241c] p-5 sm:p-6">
                <p className="mb-3 font-braise-sans text-base font-semibold">
                  Automatisations actives
                </p>
                <ul>
                  {ACTIVE_AUTOMATIONS.map((a, i) => (
                    <li
                      key={a.label}
                      className={`flex items-center justify-between gap-3 py-2.5 ${
                        i < ACTIVE_AUTOMATIONS.length - 1 ? "border-b border-[#3a3428]" : ""
                      }`}
                    >
                      <span className="flex items-center gap-2.5 font-braise-sans text-[13px] text-[#f2e4c9]/85">
                        <span aria-hidden>{a.icon}</span>
                        {a.label}
                      </span>
                      <span
                        className="relative h-[22px] w-10 shrink-0 rounded-full bg-[#e6c48f]"
                        role="img"
                        aria-label="Automatisation activée"
                      >
                        <span className="absolute right-0.5 top-0.5 h-[18px] w-[18px] rounded-full bg-[#20211c]" />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fiche Google Business mise en avant — mention, pas un vrai back-office. */}
      <section className="mx-auto max-w-content bg-[#f4ecdd] px-5 py-14 md:px-8 md:py-16">
        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-[#3a3428]/10 bg-[#f2e4c9] p-5 sm:p-6">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#6b1f24] text-xl text-[#f2e4c9]"
            aria-hidden
          >
            ⭐
          </span>
          <div>
            <p className="font-braise-display text-lg text-[#3a2a1e]">
              Fiche Google Business
            </p>
            <p className="font-braise-sans text-[15px] text-[#6b5d4a]">
              {business.googleRating} · {business.googleReviews} avis — mise
              en avant directement depuis le site.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
