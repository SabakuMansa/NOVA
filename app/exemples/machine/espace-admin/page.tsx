"use client";

import { useState } from "react";
import NotifFeed from "@/components/v3/NotifFeed";
import { machineDemo } from "@/content/exemples/machine";

export default function MachineEspaceAdminPage() {
  const { espaceAdmin } = machineDemo;
  const [activeTab, setActiveTab] = useState(espaceAdmin.tabs[0].id);
  const [justSaved, setJustSaved] = useState(false);
  const field =
    "w-full rounded-xl border-2 border-arcade-border-thick bg-arcade-card px-4 py-2.5 font-terminal text-lg text-arcade-cream placeholder-arcade-taupe focus:outline-none focus:border-arcade-orange";

  const tab = espaceAdmin.tabs.find((t) => t.id === activeTab) ?? espaceAdmin.tabs[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2200);
  };

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <p className="inline-flex items-center gap-2 rounded-full border-2 border-arcade-border-thick bg-arcade-card px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-arcade-taupe shadow-[2px_2px_0_#000000]">
        <span className="h-2 w-2 rounded-full bg-corail" aria-hidden />
        {espaceAdmin.eyebrow}
      </p>
      <h1 className="mt-6 max-w-2xl font-pixel text-lg leading-relaxed tracking-tight text-arcade-cream sm:text-2xl md:text-3xl">
        {espaceAdmin.title}
      </h1>
      <p className="mt-4 max-w-xl font-terminal text-xl leading-relaxed text-arcade-tan">
        {espaceAdmin.subtitle}
      </p>

      <div className="mt-6 flex items-start gap-3 rounded-xl border-2 border-dashed border-arcade-border-thick bg-arcade-card/40 p-4">
        <span className="text-lg" aria-hidden>
          ⓘ
        </span>
        <p className="font-mono text-[0.68rem] uppercase leading-relaxed tracking-wide text-arcade-taupe">
          {espaceAdmin.disclaimer}
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border-2 border-arcade-border-thick bg-arcade-card">
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
          <span className="ml-2 font-mono text-[0.62rem] text-arcade-taupe">
            espace-personnel · {machineDemo.business.name}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row">
          <nav className="flex shrink-0 gap-1 overflow-x-auto border-b-2 border-arcade-border-thick p-3 sm:w-52 sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-r-2">
            {espaceAdmin.tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-left font-pixel text-[0.6rem] leading-relaxed transition-colors ${
                  t.id === activeTab
                    ? "bg-corail text-arcade-bg"
                    : "text-arcade-taupe hover:bg-arcade-bg-alt hover:text-arcade-cream"
                }`}
              >
                <span aria-hidden>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>

          <div className="flex-1 p-6">
            {tab.fields ? (
              <form onSubmit={handleSave} className="space-y-4">
                {tab.fields.map((f) => (
                  <label key={f.label} className="block">
                    <span className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-wide text-arcade-muted">
                      {f.label}
                    </span>
                    <input defaultValue={f.value} className={field} />
                  </label>
                ))}
                <button
                  type="submit"
                  className="mt-2 inline-flex items-center gap-2 rounded-xl border-2 border-arcade-border-thick bg-corail px-5 py-2.5 font-pixel text-[0.6rem] leading-relaxed text-arcade-bg shadow-[3px_3px_0_#FFD23F] transition-transform hover:-translate-y-0.5"
                >
                  {justSaved ? "✓ Enregistré" : espaceAdmin.saveLabel}
                </button>
                {justSaved && (
                  <p className="font-terminal text-base text-arcade-tan">
                    {espaceAdmin.savedConfirm}
                  </p>
                )}
              </form>
            ) : tab.notifications ? (
              <div>
                <p className="mb-3 font-terminal text-lg text-arcade-tan">
                  Ce qui s&apos;est passé automatiquement, sans action de
                  votre part :
                </p>
                <NotifFeed events={tab.notifications} intervalMs={2600} />
              </div>
            ) : tab.stats ? (
              <div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {tab.stats.map((s) => (
                    <div
                      key={s.label}
                      className="flex flex-col gap-2 rounded-xl border border-arcade-border bg-arcade-card p-5"
                    >
                      <span className="text-2xl" aria-hidden>
                        {s.icon}
                      </span>
                      <span className="font-pixel text-xl text-corail">
                        {s.value}
                      </span>
                      <span className="font-terminal text-base text-arcade-tan">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
                {tab.statsNote && (
                  <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-wide text-arcade-muted">
                    {tab.statsNote}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex min-h-[12rem] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-arcade-border-thick p-8 text-center">
                <span className="text-3xl" aria-hidden>
                  🖼️
                </span>
                <p className="max-w-xs font-terminal text-lg text-arcade-tan">
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
