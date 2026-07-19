"use client";

import { useState } from "react";
import NotifFeed from "@/components/v3/NotifFeed";
import { machineDemo } from "@/content/exemples/machine";

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

export default function MachineEspaceAdminPage() {
  const { espaceAdmin } = machineDemo;
  const [activeTab, setActiveTab] = useState(espaceAdmin.tabs[0].id);
  const [justSaved, setJustSaved] = useState(false);
  // Bascules des automatisations — décoratif/démonstratif (aucun état réel
  // côté serveur, cf. disclaimer), toutes actives par défaut puisque ce sont
  // les automatisations effectivement livrées avec le plan Machine.
  const [automationsOn, setAutomationsOn] = useState<boolean[]>(
    ACTIVE_AUTOMATIONS.map(() => true)
  );
  const field =
    "w-full rounded-md border border-braise-ink/15 bg-braise-bg px-4 py-2.5 font-braise-sans text-[15px] text-braise-ink placeholder-braise-muted focus:border-braise-rust focus:outline-none";

  const tab =
    espaceAdmin.tabs.find((t) => t.id === activeTab) ?? espaceAdmin.tabs[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2200);
  };

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <span className="font-braise-sans text-[13px] uppercase tracking-[3px] text-braise-orange">
        {espaceAdmin.eyebrow}
      </span>
      <h1 className="mt-4 max-w-2xl font-braise-display text-3xl leading-tight text-braise-ink sm:text-4xl">
        {espaceAdmin.title}
      </h1>
      <p className="mt-4 max-w-xl font-braise-sans text-lg leading-relaxed text-braise-muted">
        {espaceAdmin.subtitle}
      </p>

      <div className="mt-6 flex items-start gap-3 rounded-md border border-dashed border-braise-ink/20 bg-white p-4">
        <span className="text-lg" aria-hidden>
          ⓘ
        </span>
        <p className="font-braise-sans text-[13px] leading-relaxed text-braise-muted">
          {espaceAdmin.disclaimer}
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-braise-ink/10 bg-white">
        <div className="border-b border-braise-ink/10 bg-braise-bg px-5 py-3">
          <span className="font-braise-mono text-xs text-braise-muted">
            espace-personnel · {machineDemo.business.name}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row">
          <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-braise-ink/10 p-3 sm:w-56 sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-r">
            {espaceAdmin.tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-left font-braise-sans text-sm font-medium transition-colors ${
                  t.id === activeTab
                    ? "bg-braise-rust text-white"
                    : "text-braise-muted hover:bg-braise-bg hover:text-braise-ink"
                }`}
              >
                <span aria-hidden>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>

          <div className="min-w-0 flex-1 p-6">
            {tab.fields ? (
              <form onSubmit={handleSave} className="space-y-4">
                {tab.fields.map((f) => (
                  <label key={f.label} className="block">
                    <span className="mb-1.5 block font-braise-mono text-[11px] uppercase tracking-wide text-braise-muted">
                      {f.label}
                    </span>
                    <input defaultValue={f.value} className={field} />
                  </label>
                ))}
                <button
                  type="submit"
                  className="mt-2 inline-flex items-center gap-2 rounded-md bg-braise-rust px-5 py-2.5 font-braise-sans text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                >
                  {justSaved ? "✓ Enregistré" : espaceAdmin.saveLabel}
                </button>
                {justSaved && (
                  <p className="font-braise-sans text-sm text-braise-muted">
                    {espaceAdmin.savedConfirm}
                  </p>
                )}
              </form>
            ) : tab.notifications ? (
              <div>
                <p className="mb-4 font-braise-sans text-[15px] text-braise-muted">
                  Ce qui s&apos;est passé automatiquement, sans action de
                  votre part :
                </p>
                <div className="rounded-2xl bg-braise-dark p-5 text-braise-bg sm:p-6">
                  <p className="mb-3 font-braise-sans text-sm font-semibold">
                    Automatisations actives
                  </p>
                  <ul className="mb-6">
                    {ACTIVE_AUTOMATIONS.map((a, i) => (
                      <li
                        key={a.label}
                        className={`flex items-center justify-between gap-3 py-2.5 ${
                          i < ACTIVE_AUTOMATIONS.length - 1
                            ? "border-b border-braise-border-dark"
                            : ""
                        }`}
                      >
                        <span className="flex min-w-0 flex-1 items-center gap-2.5 font-braise-sans text-[13px] text-braise-bg/85">
                          <span aria-hidden>{a.icon}</span>
                          {a.label}
                        </span>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={automationsOn[i]}
                          aria-label={a.label}
                          onClick={() =>
                            setAutomationsOn((prev) =>
                              prev.map((v, idx) => (idx === i ? !v : v))
                            )
                          }
                          className={`relative h-[22px] w-10 shrink-0 rounded-full transition-colors ${
                            automationsOn[i] ? "bg-braise-teal" : "bg-braise-border-dark"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white transition-all ${
                              automationsOn[i] ? "right-0.5" : "left-0.5"
                            }`}
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className="mb-3 font-braise-sans text-sm font-semibold">
                    Notifications
                  </p>
                  <NotifFeed
                    events={tab.notifications}
                    intervalMs={2600}
                    tagColors={TAG_COLORS}
                    itemClassName="border-braise-border-dark bg-braise-dark-card"
                    textClassName="text-braise-bg/90"
                  />
                </div>
              </div>
            ) : tab.stats ? (
              <div className="rounded-2xl bg-braise-dark p-5 text-braise-bg sm:p-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  {tab.stats.map((s) => (
                    <div key={s.label} className="rounded-xl bg-braise-dark-card p-4">
                      <span className="text-xl" aria-hidden>
                        {s.icon}
                      </span>
                      <p className="mt-2 font-braise-mono text-2xl font-bold leading-none">
                        {s.value}
                      </p>
                      <p className="mt-2 font-braise-sans text-[13px] leading-snug text-braise-muted-light">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
                {tab.statsNote && (
                  <p className="mt-5 font-braise-sans text-xs leading-relaxed text-braise-muted-light">
                    {tab.statsNote}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex min-h-[12rem] flex-col items-center justify-center gap-3 rounded-md border border-dashed border-braise-ink/20 p-8 text-center">
                <span className="text-3xl" aria-hidden>
                  🖼️
                </span>
                <p className="max-w-xs font-braise-sans text-[15px] text-braise-muted">
                  {tab.note}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
