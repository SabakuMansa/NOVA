"use client";

import { useState } from "react";
import { autonomeDemo } from "@/content/exemples/autonome";

export default function AutonomeContactPage() {
  const { contact, business } = autonomeDemo;
  const [sent, setSent] = useState(false);
  const field =
    "w-full rounded-xl border-2 border-arcade-border-thick bg-arcade-bg-alt px-4 py-3 font-terminal text-lg text-arcade-cream placeholder-arcade-taupe focus:border-arcade-orange focus:outline-none";

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-arcade-border-thick bg-arcade-card px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-arcade-taupe shadow-[2px_2px_0_#000000]">
            <span className="h-2 w-2 rounded-full bg-violet" aria-hidden />
            {contact.eyebrow}
          </p>
          <h1 className="mt-6 font-pixel text-lg leading-relaxed tracking-tight text-arcade-cream sm:text-2xl md:text-3xl">
            {contact.title}
          </h1>
          <p className="mt-4 font-terminal text-xl text-arcade-tan">
            {contact.subtitle}
          </p>

          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-arcade-border bg-arcade-card p-4">
              <span className="text-xl" aria-hidden>
                📍
              </span>
              <span className="font-terminal text-base text-arcade-tan">
                {business.address}
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-arcade-border bg-arcade-card p-4">
              <span className="text-xl" aria-hidden>
                🕒
              </span>
              <span className="font-terminal text-base text-arcade-tan">
                {business.hours}
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-arcade-border bg-arcade-card p-4">
              <span className="text-xl" aria-hidden>
                ⭐
              </span>
              <span className="font-terminal text-base text-arcade-tan">
                {business.googleRating} sur Google ({business.googleReviews}{" "}
                avis)
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border-2 border-arcade-border-thick bg-arcade-card">
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
              rendez-vous.form
            </span>
          </div>
          {sent ? (
            <div className="flex min-h-[18rem] flex-col items-center justify-center p-8 text-center">
              <span
                className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-arcade-border-thick bg-violet text-2xl text-arcade-bg"
                aria-hidden
              >
                ✓
              </span>
              <h2 className="mt-4 font-pixel text-sm leading-relaxed text-arcade-cream">
                Demande envoyée !
              </h2>
              <p className="mt-2 max-w-xs font-terminal text-lg text-arcade-tan">
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
                className="w-full rounded-xl border-2 border-arcade-border-thick bg-violet px-6 py-3.5 font-pixel text-[0.6rem] leading-relaxed text-arcade-bg shadow-[4px_4px_0_#FFD23F] transition-transform hover:-translate-y-0.5"
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
