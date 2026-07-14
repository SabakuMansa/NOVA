"use client";

import { useState } from "react";
import { siteAutonomeDemo } from "@/content/exemples/site-autonome";

export default function SiteAutonomeContactPage() {
  const { contact, business } = siteAutonomeDemo;
  const [sent, setSent] = useState(false);
  const field =
    "w-full rounded-xl border-2 border-encre bg-white px-4 py-3 font-sans text-encre placeholder-encre/35 focus:outline-none";

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-encre bg-white px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-encre shadow-[2px_2px_0_#211D16]">
            <span className="h-2 w-2 rounded-full bg-violet" aria-hidden />
            {contact.eyebrow}
          </p>
          <h1 className="mt-6 font-sans text-4xl font-extrabold tracking-tight sm:text-5xl">
            {contact.title}
          </h1>
          <p className="mt-4 font-sans text-lg text-encre/70">
            {contact.subtitle}
          </p>

          <div className="mt-8 space-y-3">
            <div className="v3-card flex items-center gap-3 p-4">
              <span className="text-xl" aria-hidden>
                📍
              </span>
              <span className="font-sans text-sm font-medium text-encre">
                {business.address}
              </span>
            </div>
            <div className="v3-card flex items-center gap-3 p-4">
              <span className="text-xl" aria-hidden>
                🕒
              </span>
              <span className="font-sans text-sm font-medium text-encre">
                {business.hours}
              </span>
            </div>
            <div className="v3-card flex items-center gap-3 p-4">
              <span className="text-xl" aria-hidden>
                ⭐
              </span>
              <span className="font-sans text-sm font-medium text-encre">
                {business.googleRating} sur Google ({business.googleReviews}{" "}
                avis)
              </span>
            </div>
          </div>
        </div>

        <div className="v3-window">
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
              rendez-vous.form
            </span>
          </div>
          {sent ? (
            <div className="flex min-h-[18rem] flex-col items-center justify-center p-8 text-center">
              <span
                className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-encre bg-teal text-2xl text-white"
                aria-hidden
              >
                ✓
              </span>
              <h2 className="mt-4 font-sans text-xl font-extrabold text-encre">
                Demande envoyée !
              </h2>
              <p className="mt-2 max-w-xs font-sans text-sm text-encre/70">
                Le salon revient vers vous rapidement pour confirmer.
              </p>
            </div>
          ) : (
            <form
              className="space-y-4 p-6"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <input
                required
                placeholder={contact.fields.name}
                autoComplete="name"
                className={field}
              />
              <input
                required
                type="email"
                placeholder={contact.fields.email}
                autoComplete="email"
                className={field}
              />
              <input
                required
                placeholder={contact.fields.service}
                className={field}
              />
              <textarea
                rows={4}
                placeholder={contact.fields.message}
                className={`${field} resize-none`}
              />
              <button
                type="submit"
                className="w-full rounded-xl border-2 border-encre bg-violet px-6 py-3.5 font-sans text-base font-bold text-white shadow-[4px_4px_0_#211D16] transition-transform hover:-translate-y-0.5"
              >
                {contact.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
