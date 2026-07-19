"use client";

import { useState } from "react";
import { autonomeDemo } from "@/content/exemples/autonome";

export default function AutonomeContactPage() {
  const { contact, business } = autonomeDemo;
  const [sent, setSent] = useState(false);
  const field =
    "w-full rounded-lg border border-metam-border-dark bg-metam-bg px-4 py-3 font-metam-sans text-[15px] text-metam-ink placeholder-metam-muted-light focus:border-metam-purple focus:outline-none";

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <span className="inline-flex items-center gap-2 font-metam-sans text-[13px] font-semibold uppercase tracking-[1.5px] text-metam-purple">
            <span
              className="h-2 w-2 rounded-full bg-metam-purple"
              aria-hidden
            />
            {contact.eyebrow}
          </span>
          <h1 className="mt-5 font-metam-display text-4xl font-bold tracking-tight text-metam-ink sm:text-5xl">
            {contact.title}
          </h1>
          <p className="mt-4 font-metam-sans text-lg text-metam-muted">
            {contact.subtitle}
          </p>

          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 rounded-lg border border-metam-border bg-metam-bg-alt p-4">
              <span className="text-lg" aria-hidden>
                📍
              </span>
              <span className="font-metam-sans text-[15px] text-metam-muted">
                {business.address}
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-metam-border bg-metam-bg-alt p-4">
              <span className="text-lg" aria-hidden>
                🕒
              </span>
              <span className="font-metam-sans text-[15px] text-metam-muted">
                {business.hours}
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-metam-border bg-metam-bg-alt p-4">
              <span className="text-lg" aria-hidden>
                ⭐
              </span>
              <span className="font-metam-sans text-[15px] text-metam-muted">
                {business.googleRating} sur Google ({business.googleReviews}{" "}
                avis)
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-metam-border-dark bg-metam-bg shadow-[0_30px_80px_rgba(20,20,26,0.12)]">
          <div className="flex items-center gap-2 border-b border-metam-border bg-metam-bg-alt px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" aria-hidden />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" aria-hidden />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" aria-hidden />
            <span className="ml-2 font-metam-sans text-[13px] text-metam-muted-light">
              rendezvous.salon-marguerite.fr
            </span>
          </div>
          {sent ? (
            <div className="metam-pop flex min-h-[18rem] flex-col items-center justify-center p-8 text-center">
              <span
                className="flex h-14 w-14 items-center justify-center rounded-full bg-metam-purple text-2xl text-metam-bg"
                aria-hidden
              >
                ✓
              </span>
              <h2 className="mt-4 font-metam-display text-xl font-bold text-metam-ink">
                Demande envoyée !
              </h2>
              <p className="mt-2 max-w-xs font-metam-sans text-[15px] text-metam-muted">
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
                className="w-full rounded-lg bg-metam-purple px-6 py-3.5 font-metam-sans text-[15px] font-semibold text-metam-bg transition-transform metam-anim hover:-translate-y-0.5"
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
