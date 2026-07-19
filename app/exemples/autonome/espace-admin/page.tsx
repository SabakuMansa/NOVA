"use client";

import { useState } from "react";
import { autonomeDemo } from "@/content/exemples/autonome";

export default function AutonomeEspaceAdminPage() {
  const { espaceAdmin } = autonomeDemo;
  const [activeTab, setActiveTab] = useState(espaceAdmin.tabs[0].id);
  const [justSaved, setJustSaved] = useState(false);
  const field =
    "w-full rounded-lg border border-metam-border-dark bg-metam-bg-alt px-4 py-2.5 font-metam-sans text-[15px] text-metam-ink placeholder-metam-muted-light focus:border-metam-purple focus:outline-none";

  const tab =
    espaceAdmin.tabs.find((t) => t.id === activeTab) ?? espaceAdmin.tabs[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2200);
  };

  return (
    <>
      {/* Section sombre — écho de la maquette : "vous gérez votre site vous-même" */}
      <section className="bg-metam-dark px-5 py-16 text-center md:px-8 md:py-20">
        <span className="inline-flex items-center gap-2 font-metam-sans text-[13px] font-semibold uppercase tracking-[1.5px] text-metam-purple-soft">
          <span
            className="h-2 w-2 rounded-full bg-metam-purple-soft"
            aria-hidden
          />
          {espaceAdmin.eyebrow}
        </span>
        <h1 className="mx-auto mt-5 max-w-2xl font-metam-display text-4xl font-bold tracking-tight text-metam-bg sm:text-5xl">
          {espaceAdmin.title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-metam-sans text-lg text-metam-muted-light">
          {espaceAdmin.subtitle}
        </p>

        <div className="mx-auto mt-6 flex max-w-xl items-start gap-3 rounded-lg border border-dashed border-metam-muted/40 bg-metam-ink/60 p-4 text-left">
          <span className="text-lg" aria-hidden>
            ⓘ
          </span>
          <p className="font-metam-sans text-[13px] uppercase leading-relaxed tracking-wide text-metam-muted-light">
            {espaceAdmin.disclaimer}
          </p>
        </div>
      </section>

      <section className="mx-auto -mt-10 max-w-content px-5 pb-16 md:px-8 md:pb-24">
        <div className="overflow-hidden rounded-2xl border border-metam-border-dark bg-metam-bg shadow-[0_30px_80px_rgba(20,20,26,0.25)]">
          <div className="flex items-center gap-2 border-b border-metam-border bg-metam-bg-alt px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" aria-hidden />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" aria-hidden />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" aria-hidden />
            <span className="ml-2 font-metam-sans text-[13px] text-metam-muted-light">
              admin.salon-marguerite.fr
            </span>
          </div>

          <div className="flex flex-col sm:flex-row">
            <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-metam-border p-3 sm:w-52 sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-r">
              {espaceAdmin.tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-left font-metam-sans text-[14px] font-medium transition-colors metam-anim ${
                    t.id === activeTab
                      ? "bg-metam-purple text-metam-bg"
                      : "text-metam-muted hover:bg-metam-bg-alt hover:text-metam-ink"
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
                      <span className="mb-1.5 block font-metam-sans text-[12px] uppercase tracking-wide text-metam-muted-light">
                        {f.label}
                      </span>
                      <input defaultValue={f.value} className={field} />
                    </label>
                  ))}
                  <button
                    type="submit"
                    className="mt-2 inline-flex items-center gap-2 rounded-lg bg-metam-purple px-5 py-2.5 font-metam-sans text-[14px] font-semibold text-metam-bg transition-transform metam-anim hover:-translate-y-0.5"
                  >
                    {justSaved ? "✓ Enregistré" : espaceAdmin.saveLabel}
                  </button>
                  {justSaved && (
                    <p className="metam-pop font-metam-sans text-sm text-metam-muted">
                      {espaceAdmin.savedConfirm}
                    </p>
                  )}
                </form>
              ) : (
                <div className="flex min-h-[12rem] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-metam-border-dark p-8 text-center">
                  <span className="text-3xl" aria-hidden>
                    🖼️
                  </span>
                  <p className="max-w-xs font-metam-sans text-[15px] text-metam-muted">
                    {tab.note}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
