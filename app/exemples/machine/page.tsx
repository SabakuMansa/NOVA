import Link from "next/link";
import NotifFeed from "@/components/v3/NotifFeed";
import { machineDemo } from "@/content/exemples/machine";

// Photo d'ambiance salon de toilettage (Unsplash, licence libre) — jamais
// reprise de la maquette "Table & Braise" (photos de restaurant hors sujet
// pour Au Poil) : recherche dédiée sur un thème neutre/cohérent.
const HERO_PHOTO =
  "https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?w=1600&q=80&auto=format&fit=crop";

const TAG_COLORS: Record<string, string> = {
  avis: "bg-braise-orange/20 text-braise-orange",
  résa: "bg-braise-teal/20 text-braise-teal",
  contact: "bg-braise-muted-light/20 text-braise-muted-light",
};

// Labels courts des automatisations actives, dérivés du même triptyque que
// le commentaire d'en-tête de content/exemples/machine.ts (relance avis
// Google post-réservation, confirmation auto de réservation, réponse auto à
// une demande de contact) — aucune donnée inventée, juste re-présentée en
// liste de bascules pour coller au patron "Automatisations actives" de la
// maquette.
const ACTIVE_AUTOMATIONS = [
  { icon: "⭐", label: "Relance avis Google après rendez-vous" },
  { icon: "✅", label: "Confirmation automatique de réservation" },
  { icon: "📩", label: "Réponse automatique aux demandes de contact" },
];

export default function MachineAccueilPage() {
  const { accueil, business, liveFeed, espaceAdmin } = machineDemo;
  const dashboardTab = espaceAdmin.tabs.find((t) => t.id === "tableau-de-bord");

  return (
    <>
      {/* Hero plein cadre — photo + dégradé sombre, patron repris de la
          maquette "Table & Braise" (palette/typo seulement). */}
      <section className="relative flex min-h-[80vh] items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(28,24,21,0.85) 0%, rgba(28,24,21,0.45) 55%, rgba(28,24,21,0.15) 100%), url('${HERO_PHOTO}')`,
          }}
          role="img"
          aria-label="Chien détendu pendant une séance de toilettage"
        />
        <div className="relative max-w-xl px-5 py-20 text-braise-bg md:px-16">
          <span className="font-braise-sans text-[13px] uppercase tracking-[3px] text-braise-orange">
            {accueil.eyebrow}
          </span>
          <h1 className="mt-5 font-braise-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
            {accueil.title}
          </h1>
          <p className="mt-6 max-w-md font-braise-sans text-lg leading-relaxed text-braise-bg/85">
            {accueil.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3.5">
            <Link
              href="/exemples/machine/contact"
              className="rounded-md bg-braise-rust px-7 py-3.5 font-braise-sans text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              {accueil.cta} →
            </Link>
            <Link
              href="/exemples/machine/prestations"
              className="rounded-md border border-braise-bg/40 px-7 py-3.5 font-braise-sans text-[15px] font-semibold text-braise-bg transition-colors hover:border-braise-bg"
            >
              Voir les prestations
            </Link>
          </div>
        </div>
      </section>

      {/* Bandeau d'atouts — patron 3 colonnes repris de la grille "La carte"
          de la maquette, contenu 100% réel (aucun vocabulaire restaurant). */}
      <section className="grid gap-8 border-b border-braise-ink/10 px-5 py-12 sm:grid-cols-3 md:px-8 md:py-14">
        {accueil.highlights.map((h) => (
          <div key={h.text} className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden>
              {h.icon}
            </span>
            <p className="font-braise-sans text-[15px] leading-snug text-braise-muted">
              {h.text}
            </p>
          </div>
        ))}
      </section>

      {/* Section automatisations / tableau de bord — le cœur du plan
          Machine, patron repris tel quel de la maquette (fond sombre, carte
          "Tableau de bord" + carte "Notifications"), recoloré en braise-*. */}
      <section className="bg-braise-dark px-5 py-16 text-braise-bg md:px-16 md:py-24">
        <div className="mx-auto max-w-content">
          <div className="mb-11 max-w-2xl">
            <span className="font-braise-sans text-[13px] uppercase tracking-[3px] text-braise-orange">
              Plan Machine · Automatisations
            </span>
            <h2 className="mt-4 font-braise-display text-3xl leading-tight sm:text-4xl">
              {accueil.philosophy}
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* Tableau de bord */}
            <div className="rounded-2xl border border-braise-border-dark bg-braise-dark-card p-6 sm:p-7">
              <div className="mb-6 flex items-center justify-between">
                <span className="font-braise-sans text-base font-semibold">
                  Tableau de bord
                </span>
                <span className="inline-flex items-center gap-1.5 font-braise-mono text-xs text-braise-teal">
                  <span
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-braise-teal"
                    aria-hidden
                  />
                  en direct
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {dashboardTab?.stats?.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl bg-braise-dark p-4"
                  >
                    <p className="font-braise-mono text-[1.9rem] font-bold leading-none">
                      {s.value}
                    </p>
                    <p className="mt-2 font-braise-sans text-[13px] leading-snug text-braise-muted-light">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
              {dashboardTab?.statsNote && (
                <p className="mt-5 font-braise-sans text-xs leading-relaxed text-braise-muted-light">
                  {dashboardTab.statsNote}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-6">
              {/* Notifications — flux en direct, logique/animation NotifFeed
                  inchangée, seules les couleurs sont recolorées via props. */}
              <div className="rounded-2xl border border-braise-border-dark bg-braise-dark-card p-5 sm:p-6">
                <p className="mb-4 font-braise-sans text-base font-semibold">
                  Notifications
                </p>
                <NotifFeed
                  events={liveFeed}
                  tagColors={TAG_COLORS}
                  itemClassName="border-braise-border-dark bg-braise-dark"
                  textClassName="text-braise-bg/90"
                />
              </div>

              {/* Automatisations actives — bascules statiques, patron repris
                  de la maquette (toggle "on" teal), contenu dérivé des
                  automatisations réellement décrites pour ce plan. */}
              <div className="rounded-2xl border border-braise-border-dark bg-braise-dark-card p-5 sm:p-6">
                <p className="mb-3 font-braise-sans text-base font-semibold">
                  Automatisations actives
                </p>
                <ul>
                  {ACTIVE_AUTOMATIONS.map((a, i) => (
                    <li
                      key={a.label}
                      className={`flex items-center justify-between gap-3 py-2.5 ${
                        i < ACTIVE_AUTOMATIONS.length - 1
                          ? "border-b border-braise-border-dark"
                          : ""
                      }`}
                    >
                      <span className="flex items-center gap-2.5 font-braise-sans text-[13px] text-braise-bg/85">
                        <span aria-hidden>{a.icon}</span>
                        {a.label}
                      </span>
                      <span
                        className="relative h-[22px] w-10 shrink-0 rounded-full bg-braise-teal"
                        role="img"
                        aria-label="Automatisation activée"
                      >
                        <span className="absolute right-0.5 top-0.5 h-[18px] w-[18px] rounded-full bg-white" />
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
      <section className="mx-auto max-w-content px-5 py-14 md:px-8 md:py-16">
        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-braise-ink/10 bg-braise-ink/5 p-5 sm:p-6">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-braise-rust text-xl text-white"
            aria-hidden
          >
            ⭐
          </span>
          <div>
            <p className="font-braise-display text-lg text-braise-ink">
              Fiche Google Business
            </p>
            <p className="font-braise-sans text-[15px] text-braise-muted">
              {business.googleRating} · {business.googleReviews} avis — mise
              en avant directement depuis le site.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
