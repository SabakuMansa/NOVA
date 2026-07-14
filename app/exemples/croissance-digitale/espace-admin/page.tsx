"use client";

import { useState } from "react";
import { croissanceDigitaleDemo } from "@/content/exemples/croissance-digitale";

export default function CroissanceDigitaleEspaceAdminPage() {
  const { espaceAdmin } = croissanceDigitaleDemo;
  const [activeTab, setActiveTab] = useState(espaceAdmin.tabs[0].id);
  const [justSaved, setJustSaved] = useState(false);
  const field =
    "w-full rounded-xl border-2 border-encre bg-white px-4 py-2.5 font-sans text-sm text-encre focus:outline-none";

  const tab = espaceAdmin.tabs.find((t) => t.id === activeTab) ?? espaceAdmin.tabs[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2200);
  };

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <p className="inline-flex items-center gap-2 rounded-full border-2 border-encre bg-white px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-encre shadow-[2px_2px_0_#211D16]">
        <span className="h-2 w-2 rounded-full bg-corail" aria-hidden />
        {espaceAdmin.eyebrow}
      </p>
      <h1 className="mt-6 max-w-2xl font-sans text-4xl font-extrabold tracking-tight sm:text-5xl">
        {espaceAdmin.title}
      </h1>
      <p className="mt-4 max-w-xl font-sans text-lg text-encre/70">
        {espaceAdmin.subtitle}
      </p>

      <div className="mt-6 flex items-start gap-3 rounded-xl border-2 border-dashed border-encre/40 bg-encre/[0.03] p-4">
        <span className="text-lg" aria-hidden>
          ⓘ
        </span>
        <p className="font-mono text-[0.68rem] uppercase leading-relaxed tracking-wide text-encre/60">
          {espaceAdmin.disclaimer}
        </p>
      </div>

      <div className="v3-window mt-10">
        <div className="v3-window-bar">
          <span
            className="h-3 w-3 rounded-full border-2 border-encre bg-corail"
            aria-hidden
          />
          <span
            className="h-3 w-3 rounded-full border-2 border-encre bg-jaune"
            aria-hidden
          />
          <span
            className="h-3 w-3 rounded-full border-2 border-encre bg-teal"
            aria-hidden
          />
          <span className="ml-2 font-mono text-[0.62rem] text-encre/60">
            espace-personnel · {croissanceDigitaleDemo.business.name}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row">
          <nav className="flex shrink-0 gap-1 overflow-x-auto border-b-2 border-encre p-3 sm:w-52 sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-r-2">
            {espaceAdmin.tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-left font-sans text-sm font-medium transition-colors ${
                  t.id === activeTab
                    ? "bg-corail text-white"
                    : "text-encre/70 hover:bg-encre/5"
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
                    <span className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-wide text-encre/50">
                      {f.label}
                    </span>
                    <input defaultValue={f.value} className={field} />
                  </label>
                ))}
                <button
                  type="submit"
                  className="mt-2 inline-flex items-center gap-2 rounded-xl border-2 border-encre bg-teal px-5 py-2.5 font-sans text-sm font-bold text-white shadow-[3px_3px_0_#211D16] transition-transform hover:-translate-y-0.5"
                >
                  {justSaved ? "✓ Enregistré" : espaceAdmin.saveLabel}
                </button>
                {justSaved && (
                  <p className="font-sans text-xs text-encre/60">
                    {espaceAdmin.savedConfirm}
                  </p>
                )}
              </form>
            ) : tab.notifications ? (
              <div className="space-y-3">
                <p className="mb-1 font-sans text-sm text-encre/60">
                  Ce qui s&apos;est passé automatiquement, sans action de
                  votre part :
                </p>
                {tab.notifications.map((n, i) => (
                  <div
                    key={i}
                    className="v3-notif flex items-center gap-3 rounded-xl border-2 border-encre bg-white p-4"
                  >
                    <span className="text-xl" aria-hidden>
                      {n.icon}
                    </span>
                    <p className="flex-1 font-sans text-sm text-encre">
                      {n.text}
                    </p>
                    <span className="rounded-full border-2 border-encre bg-jaune/40 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wide text-encre">
                      {n.tag}
                    </span>
                  </div>
                ))}
              </div>
            ) : tab.stats ? (
              <div className="grid gap-4 sm:grid-cols-3">
                {tab.stats.map((s) => (
                  <div
                    key={s.label}
                    className="v3-card flex flex-col gap-2 p-5"
                  >
                    <span className="text-2xl" aria-hidden>
                      {s.icon}
                    </span>
                    <span className="font-sans text-2xl font-extrabold text-encre">
                      {s.value}
                    </span>
                    <span className="font-sans text-xs text-encre/60">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[12rem] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-encre/30 p-8 text-center">
                <span className="text-3xl" aria-hidden>
                  🖼️
                </span>
                <p className="max-w-xs font-sans text-sm text-encre/60">
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
