"use client";

import { useState } from "react";
import { autonomeDemo } from "@/content/exemples/autonome";

export default function AutonomeEspaceAdminPage() {
  const { espaceAdmin } = autonomeDemo;
  const [activeTab, setActiveTab] = useState(espaceAdmin.tabs[0].id);
  const [justSaved, setJustSaved] = useState(false);
  const field =
    "w-full rounded-xl border-2 border-arcade-border-thick bg-arcade-bg-alt px-4 py-2.5 font-terminal text-base text-arcade-cream placeholder-arcade-taupe focus:border-arcade-orange focus:outline-none";

  const tab = espaceAdmin.tabs.find((t) => t.id === activeTab) ?? espaceAdmin.tabs[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2200);
  };

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <p className="inline-flex items-center gap-2 rounded-full border-2 border-arcade-border-thick bg-arcade-card px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-arcade-taupe shadow-[2px_2px_0_#000000]">
        <span className="h-2 w-2 rounded-full bg-violet" aria-hidden />
        {espaceAdmin.eyebrow}
      </p>
      <h1 className="mt-6 max-w-2xl font-pixel text-lg leading-relaxed tracking-tight text-arcade-cream sm:text-2xl md:text-3xl">
        {espaceAdmin.title}
      </h1>
      <p className="mt-4 max-w-xl font-terminal text-xl text-arcade-tan">
        {espaceAdmin.subtitle}
      </p>

      <div className="mt-6 flex items-start gap-3 rounded-xl border-2 border-dashed border-arcade-border-thick bg-arcade-card p-4">
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
            className="h-3 w-3 rounded-full border-2 border-arcade-border-thick bg-corail"
            aria-hidden
          />
          <span
            className="h-3 w-3 rounded-full border-2 border-arcade-border-thick bg-jaune"
            aria-hidden
          />
          <span
            className="h-3 w-3 rounded-full border-2 border-arcade-border-thick bg-teal"
            aria-hidden
          />
          <span className="ml-2 font-mono text-[0.62rem] text-arcade-taupe">
            espace-personnel · {autonomeDemo.business.name}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row">
          <nav className="flex shrink-0 gap-1 overflow-x-auto border-b-2 border-arcade-border-thick p-3 sm:w-52 sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-r-2">
            {espaceAdmin.tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-left font-pixel text-[0.6rem] transition-colors ${
                  t.id === activeTab
                    ? "bg-violet text-arcade-bg"
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
                    <span className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-wide text-arcade-taupe">
                      {f.label}
                    </span>
                    <input defaultValue={f.value} className={field} />
                  </label>
                ))}
                <button
                  type="submit"
                  className="mt-2 inline-flex items-center gap-2 rounded-xl border-2 border-arcade-border-thick bg-violet px-5 py-2.5 font-pixel text-[0.55rem] leading-relaxed text-arcade-bg shadow-[3px_3px_0_#FFD23F] transition-transform hover:-translate-y-0.5"
                >
                  {justSaved ? "✓ Enregistré" : espaceAdmin.saveLabel}
                </button>
                {justSaved && (
                  <p className="font-terminal text-sm text-arcade-tan">
                    {espaceAdmin.savedConfirm}
                  </p>
                )}
              </form>
            ) : (
              <div className="flex min-h-[12rem] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-arcade-border-thick p-8 text-center">
                <span className="text-3xl" aria-hidden>
                  🖼️
                </span>
                <p className="max-w-xs font-terminal text-base text-arcade-tan">
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
