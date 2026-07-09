"use client";

import { useState } from "react";
import { contact } from "@/content/site";
import Reveal from "./Reveal";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Démo : aucun backend. Le studio branchera son service d'envoi plus tard.
    setSent(true);
  };

  const field =
    "w-full rounded-xl border border-cafe/20 bg-nappe px-4 py-3 font-sans text-cafe placeholder-cafe/40 transition-colors focus:border-lie focus:bg-white";

  return (
    <section id={contact.id} className="mx-auto max-w-content px-5 py-24 md:px-8 md:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* Colonne accroche + coordonnées */}
        <Reveal>
          <p className="font-mono text-[0.68rem] uppercase tracking-eyebrow text-lie">
            {contact.eyebrow}
          </p>
          <h2 className="mt-6 font-display text-4xl leading-tight text-cafe sm:text-5xl md:text-[3.4rem]">
            Parlons de votre commerce,{" "}
            <span className="display-em text-lie">pas de technique</span>.
          </h2>
          <p className="mt-5 max-w-md font-sans text-lg text-cafe/75">
            {contact.subtitle}
          </p>
          <p className="mt-8 max-w-md font-display text-xl italic leading-snug text-cafe/70">
            {contact.intro}
          </p>

          <div className="mt-10 space-y-4">
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-4 rounded-xl border border-cafe/15 bg-craie/40 px-5 py-4 transition-colors hover:border-lie/40"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cafe text-moutarde">
                @
              </span>
              <span>
                <span className="block font-mono text-[0.6rem] uppercase tracking-wide text-cafe/50">
                  Email
                </span>
                <span className="font-sans text-cafe">{contact.email}</span>
              </span>
            </a>
            <a
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-4 rounded-xl border border-cafe/15 bg-craie/40 px-5 py-4 transition-colors hover:border-lie/40"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cafe text-moutarde">
                ☎
              </span>
              <span>
                <span className="block font-mono text-[0.6rem] uppercase tracking-wide text-cafe/50">
                  Téléphone
                </span>
                <span className="font-sans text-cafe">{contact.phone}</span>
              </span>
            </a>
          </div>
        </Reveal>

        {/* Formulaire */}
        <Reveal delay={0.1}>
          <div className="rounded-3xl border border-cafe/12 bg-craie/50 p-6 shadow-[0_24px_60px_-40px_rgba(46,37,33,0.6)] sm:p-9">
            {sent ? (
              <div className="flex min-h-[24rem] flex-col items-center justify-center text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sauge text-nappe">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden>
                    <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h3 className="mt-6 font-display text-3xl text-cafe">Merci !</h3>
                <p className="mt-3 max-w-xs font-sans text-cafe/70">
                  Votre demande est bien notée. Je reviens vers vous sous 24h
                  pour convenir d'un créneau d'audit.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-wide text-cafe/60">
                      {contact.fields.name}
                    </span>
                    <input type="text" name="name" required autoComplete="name" className={field} placeholder="Camille Dupont" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-wide text-cafe/60">
                      {contact.fields.business}
                    </span>
                    <input type="text" name="business" required className={field} placeholder="Le Comptoir de Camille" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-wide text-cafe/60">
                      {contact.fields.city}
                    </span>
                    <input type="text" name="city" className={field} placeholder="Saint-Maur-des-Fossés" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-wide text-cafe/60">
                      {contact.fields.phone}
                    </span>
                    <input type="tel" name="phone" autoComplete="tel" className={field} placeholder="06 12 34 56 78" />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-wide text-cafe/60">
                    {contact.fields.email}
                  </span>
                  <input type="email" name="email" required autoComplete="email" className={field} placeholder="camille@moncommerce.fr" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block font-mono text-[0.6rem] uppercase tracking-wide text-cafe/60">
                    {contact.fields.message}
                  </span>
                  <textarea name="message" rows={4} className={`${field} resize-none`} placeholder="Mon site actuel date de 2015 et je perds des réservations…" />
                </label>
                <button
                  type="submit"
                  className="w-full rounded-full bg-lie px-6 py-4 font-sans text-base font-medium text-nappe transition-all hover:-translate-y-0.5 hover:bg-cafe"
                >
                  {contact.submit}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
