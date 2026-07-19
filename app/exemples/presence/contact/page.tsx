"use client";

import { useState } from "react";
import { presenceDemo } from "@/content/exemples/presence";

export default function PresenceContactPage() {
  const { contact, business } = presenceDemo;
  const [sent, setSent] = useState(false);
  const field =
    "w-full rounded-md border-none bg-fleur-sage-light px-4 py-3.5 font-fleur-sans text-[15px] text-fleur-bg placeholder-fleur-bg/60 transition-colors focus:outline-none focus:ring-2 focus:ring-fleur-bg/40";

  return (
    <section className="bg-fleur-sage px-5 py-16 text-fleur-bg md:px-8 md:py-24">
      <div className="mx-auto grid max-w-content gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h1 className="font-fleur-display text-3xl font-medium leading-tight sm:text-4xl">
            {contact.title}
          </h1>
          <p className="mt-5 max-w-sm font-fleur-sans text-lg text-fleur-bg/85">
            {contact.subtitle}
          </p>

          <div className="mt-9 flex flex-col gap-4 font-fleur-sans text-[15px]">
            <div className="flex gap-3">
              <span className="text-fleur-bg/60">Adresse</span>
              <span>{business.address}</span>
            </div>
            <div className="flex gap-3">
              <span className="text-fleur-bg/60">Horaires</span>
              <span>{business.hours}</span>
            </div>
            <div className="flex gap-3">
              <span className="text-fleur-bg/60">Google</span>
              <span>
                {business.googleRating} sur Google ({business.googleReviews}{" "}
                avis)
              </span>
            </div>
          </div>
        </div>

        {sent ? (
          <div className="flex min-h-[18rem] flex-col items-center justify-center rounded-md bg-fleur-sage-light/40 p-8 text-center">
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full bg-fleur-bg text-2xl text-fleur-sage"
              aria-hidden
            >
              ✓
            </span>
            <h2 className="mt-4 font-fleur-display text-xl">
              Message envoyé !
            </h2>
            <p className="mt-2 max-w-xs font-fleur-sans text-[15px] text-fleur-bg/80">
              On revient vers vous rapidement.
            </p>
          </div>
        ) : (
          <form
            className="flex flex-col gap-3.5"
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
            <textarea
              required
              rows={4}
              placeholder={contact.fields.message}
              className={`${field} resize-none`}
            />
            <button
              type="submit"
              className="mt-1 rounded-full bg-fleur-bg py-3.5 font-fleur-sans text-[15px] font-bold text-fleur-sage transition-transform hover:-translate-y-0.5"
            >
              {contact.submit}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
