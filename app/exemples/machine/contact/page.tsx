"use client";

import { useState } from "react";
import { machineDemo } from "@/content/exemples/machine";

export default function MachineContactPage() {
  const { contact, business } = machineDemo;
  const [sent, setSent] = useState(false);
  const field =
    "w-full rounded-md border border-braise-ink/15 bg-white px-4 py-3 font-braise-sans text-[15px] text-braise-ink placeholder-braise-muted focus:border-braise-rust focus:outline-none";

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <span className="font-braise-sans text-[13px] uppercase tracking-[3px] text-braise-orange">
            {contact.eyebrow}
          </span>
          <h1 className="mt-4 font-braise-display text-3xl leading-tight text-braise-ink sm:text-4xl">
            {contact.title}
          </h1>
          <p className="mt-4 font-braise-sans text-lg leading-relaxed text-braise-muted">
            {contact.subtitle}
          </p>

          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 rounded-md border border-braise-ink/10 bg-white p-4">
              <span className="text-xl" aria-hidden>
                📍
              </span>
              <span className="font-braise-sans text-[15px] text-braise-ink">
                {business.address}
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-md border border-braise-ink/10 bg-white p-4">
              <span className="text-xl" aria-hidden>
                🕒
              </span>
              <span className="font-braise-sans text-[15px] text-braise-ink">
                {business.hours}
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-md border border-braise-ink/10 bg-white p-4">
              <span className="text-xl" aria-hidden>
                ⭐
              </span>
              <span className="font-braise-sans text-[15px] text-braise-ink">
                {business.googleRating} sur Google ({business.googleReviews}{" "}
                avis)
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-braise-ink/10 bg-white">
          <div className="border-b border-braise-ink/10 bg-braise-bg px-5 py-3">
            <span className="font-braise-mono text-xs text-braise-muted">
              rendez-vous.form
            </span>
          </div>
          {sent ? (
            <div className="flex min-h-[18rem] flex-col items-center justify-center p-8 text-center">
              <span
                className="flex h-14 w-14 items-center justify-center rounded-full bg-braise-rust text-2xl text-white"
                aria-hidden
              >
                ✓
              </span>
              <h2 className="mt-4 font-braise-display text-xl text-braise-ink">
                {contact.successTitle}
              </h2>
              <p className="mt-3 max-w-xs font-braise-sans text-[15px] text-braise-muted">
                {contact.successText}
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
                className="w-full rounded-md bg-braise-rust px-6 py-3.5 font-braise-sans text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5"
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
