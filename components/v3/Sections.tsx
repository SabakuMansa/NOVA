"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";
import {
  v3constat,
  v3contact,
  v3fondateur,
  v3footer,
  v3moteur,
  v3plans,
  v3process,
  v3ticker,
  v3verdict,
} from "@/content/v3";

/* Couleurs mappées statiquement (Tailwind ne compile pas les classes dynamiques). */
const DOT: Record<string, string> = {
  corail: "bg-corail",
  violet: "bg-violet",
  teal: "bg-teal",
  jaune: "bg-jaune",
};
const SOFT: Record<string, string> = {
  corail: "bg-corail/10",
  violet: "bg-violet/10",
  teal: "bg-teal/10",
  jaune: "bg-jaune/20",
};
const TEXT: Record<string, string> = {
  corail: "text-corail",
  violet: "text-violet",
  teal: "text-teal",
  jaune: "text-encre",
};

function Eyebrow({ children, color = "violet" }: { children: React.ReactNode; color?: string }) {
  return (
    <p className={`inline-flex items-center gap-2 rounded-full border-2 border-encre bg-white px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-encre shadow-[2px_2px_0_#211D16]`}>
      <span className={`h-2 w-2 rounded-full ${DOT[color]}`} aria-hidden />
      {children}
    </p>
  );
}

/* ---------------------------------------------------------------- Ticker */
export function V3Ticker() {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {v3ticker.items.map((it, i) => (
        <span key={i} className="flex items-center">
          <span className="px-5 font-mono text-xs uppercase tracking-wide text-lait">
            {it}
          </span>
          <span className="text-jaune" aria-hidden>✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="overflow-hidden border-y-2 border-encre bg-encre py-3" aria-hidden>
      <div className="v3-ticker-track">{[row("a"), row("b")]}</div>
    </div>
  );
}

/* --------------------------------------------------------------- Verdict */
const VERDICT_CYCLE_MS = 2000;
const VERDICT_GLITCH_MS = 350;

/** Réponse qui défile en boucle avec effet glitch/RGB-split au changement.
 *  reduced-motion : answers[0] affichée seule, sans animation ni pseudo-éléments. */
function GlitchAnswer({ items }: { items: string[] }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [glitching, setGlitching] = useState(false);
  const glitchTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (reduce) return;
    const interval = setInterval(() => {
      setI((v) => (v + 1) % items.length);
      setGlitching(true);
      glitchTimeout.current = setTimeout(() => setGlitching(false), VERDICT_GLITCH_MS);
    }, VERDICT_CYCLE_MS);
    return () => {
      clearInterval(interval);
      if (glitchTimeout.current) clearTimeout(glitchTimeout.current);
    };
  }, [reduce, items.length]);

  const textClass =
    "font-sans text-3xl font-extrabold tracking-tight text-jaune sm:text-5xl md:text-6xl";

  if (reduce) {
    return <p className={textClass}>{items[0]}</p>;
  }

  const current = items[i];
  return (
    <p
      data-text={current}
      className={`glitch-answer ${glitching ? "is-glitching" : ""} ${textClass}`}
    >
      {current}
    </p>
  );
}

export function V3Verdict() {
  return (
    <section
      id={v3verdict.id}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-encre px-5 py-24 text-center md:px-8"
    >
      <Reveal>
        <h2 className="mx-auto max-w-4xl font-sans text-4xl font-extrabold leading-[1.05] tracking-tight text-lait sm:text-6xl md:text-7xl">
          {v3verdict.question}
        </h2>
      </Reveal>
      <div className="mt-10 md:mt-14">
        <GlitchAnswer items={v3verdict.answers} />
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Constat */
export function V3Constat() {
  return (
    <section id={v3constat.id} className="mx-auto max-w-content px-5 py-20 md:px-8 md:py-28">
      <Reveal>
        <Eyebrow color="corail">{v3constat.eyebrow}</Eyebrow>
        <h2 className="mt-5 max-w-2xl font-sans text-3xl font-extrabold tracking-tight text-encre sm:text-4xl md:text-5xl">
          {v3constat.title}
        </h2>
        <p className="mt-4 max-w-xl font-sans text-lg text-encre/70">{v3constat.subtitle}</p>
      </Reveal>
      <div className="mt-12 grid max-w-2xl gap-5 sm:grid-cols-2">
        {v3constat.cards.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.08}>
            <div className="v3-card v3-card-hover h-full p-6">
              <div className="flex items-center gap-3">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 border-encre text-xl ${SOFT[c.color]}`} aria-hidden>
                  {c.emoji}
                </span>
                <h3 className="font-sans text-xl font-extrabold text-encre">{c.title}</h3>
              </div>
              <p className="mt-3.5 font-sans leading-relaxed text-encre/75">{c.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Moteur */
export function V3Moteur() {
  return (
    <section id={v3moteur.id} className="border-y-2 border-encre bg-white">
      <div className="mx-auto max-w-content px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <Eyebrow color="teal">{v3moteur.eyebrow}</Eyebrow>
          <h2 className="mt-5 max-w-2xl font-sans text-3xl font-extrabold tracking-tight text-encre sm:text-4xl md:text-5xl">
            {v3moteur.title}
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {v3moteur.bento.filter((b) => !b.hidden).map((b, i) => (
            <Reveal
              key={b.title}
              delay={i * 0.08}
              className={b.size === "large" ? "md:col-span-2" : ""}
            >
              <div className={`v3-card v3-card-hover h-full p-6 sm:p-7 ${SOFT[b.color]}`}>
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-encre bg-white text-2xl" aria-hidden>
                    {b.icon}
                  </span>
                  <span className={`rounded-full border-2 border-encre bg-white px-2.5 py-1 font-mono text-[0.58rem] font-bold uppercase ${TEXT[b.color]}`}>
                    {b.chip}
                  </span>
                </div>
                <h3 className="mt-4 font-sans text-2xl font-extrabold text-encre">{b.title}</h3>
                <p className="mt-2.5 max-w-lg font-sans leading-relaxed text-encre/75">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- Plans */
export function V3Plans() {
  return (
    <section id={v3plans.id} className="mx-auto max-w-content px-5 py-20 md:px-8 md:py-28">
      <Reveal className="text-center">
        <Eyebrow color="violet">{v3plans.eyebrow}</Eyebrow>
        <h2 className="mt-5 font-sans text-3xl font-extrabold tracking-tight text-encre sm:text-4xl md:text-5xl">
          {v3plans.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-sans text-lg text-encre/70">{v3plans.subtitle}</p>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-3 md:items-start">
        {v3plans.plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08}>
            <div className={`v3-window ${p.featured ? "md:-mt-3 md:mb-3" : ""}`}>
              <div className={`v3-window-bar ${p.featured ? "!bg-violet" : ""}`}>
                <span className={`h-2.5 w-2.5 rounded-full ${DOT[p.color]}`} aria-hidden />
                <span className={`font-mono text-[0.62rem] font-bold uppercase tracking-wide ${p.featured ? "text-white" : "text-encre/70"}`}>
                  plan/{p.name.toLowerCase()}
                </span>
                {p.badge && (
                  <span className="ml-auto rounded-md border-2 border-encre bg-jaune px-2 py-0.5 font-mono text-[0.55rem] font-bold uppercase text-encre">
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-sans text-2xl font-extrabold text-encre">{p.name}</h3>
                <p className="mt-1 font-sans text-sm italic text-encre/65">{p.pitch}</p>
                <p className="mt-4 font-mono text-3xl font-bold text-encre">
                  {p.price}
                  <span className="ml-2 align-middle font-sans text-sm font-medium text-encre/60">
                    {p.monthly}
                  </span>
                </p>
                <ul className="mt-5 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 font-sans text-sm text-encre/80">
                      <span className={`mt-0.5 font-bold ${TEXT[p.color]}`} aria-hidden>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`mt-6 block rounded-xl border-2 border-encre px-5 py-3 text-center font-sans text-sm font-bold shadow-[3px_3px_0_#211D16] transition-transform hover:-translate-y-0.5 ${
                    p.featured ? "bg-corail text-white" : "bg-white text-encre"
                  }`}
                >
                  Démarrer avec {p.name}
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Module Commande & Livraison (v3plans.addon) volontairement masqué :
          pas prioritaire pour le moment. Données conservées dans content/v3.ts. */}
      <Reveal className="mx-auto mt-10 max-w-2xl text-center">
        <p className="font-sans text-sm italic text-encre/60">{v3plans.footnote}</p>
      </Reveal>
    </section>
  );
}

/* --------------------------------------------------------------- Process */
export function V3Process() {
  return (
    <section id={v3process.id} className="border-y-2 border-encre bg-encre">
      <div className="mx-auto max-w-content px-5 py-20 md:px-8 md:py-28">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-lait/30 px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-lait">
            <span className="h-2 w-2 rounded-full bg-jaune" aria-hidden />
            {v3process.eyebrow}
          </p>
          <h2 className="mt-5 max-w-2xl font-sans text-3xl font-extrabold tracking-tight text-lait sm:text-4xl md:text-5xl">
            {v3process.title}
          </h2>
        </Reveal>
        <ol className="mt-12 grid gap-x-8 gap-y-9 md:grid-cols-3">
          {v3process.steps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 0.06}>
              <div className="flex items-center gap-3">
                <span className="rounded-lg border-2 border-jaune px-2.5 py-1 font-mono text-sm font-bold text-jaune">
                  {s.n}
                </span>
                <h3 className="font-sans text-xl font-extrabold text-lait">{s.name}</h3>
              </div>
              <p className="mt-2.5 font-sans leading-relaxed text-lait/65">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Fondateur */
export function V3Fondateur() {
  return (
    <section id={v3fondateur.id} className="mx-auto max-w-content px-5 py-20 md:px-8 md:py-28">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:items-center">
        <Reveal>
          <Eyebrow color="jaune">{v3fondateur.eyebrow}</Eyebrow>
          <h2 className="mt-5 font-sans text-3xl font-extrabold tracking-tight text-encre sm:text-4xl">
            {v3fondateur.title}
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {v3fondateur.badges.map((b) => (
              <span key={b} className="rounded-full border-2 border-encre bg-white px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-wide text-encre shadow-[2px_2px_0_#211D16]">
                {b}
              </span>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="font-sans text-lg leading-relaxed text-encre/80">{v3fondateur.teaser}</p>
          <Link
            href={v3fondateur.ctaHref}
            className="mt-5 inline-flex items-center gap-2 font-sans text-sm font-bold text-violet underline underline-offset-4 hover:text-encre"
          >
            {v3fondateur.ctaLabel} →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Contact */
export function V3Contact() {
  const [sent, setSent] = useState(false);
  const field =
    "w-full rounded-xl border-2 border-encre bg-white px-4 py-3 font-sans text-encre placeholder-encre/35 focus:bg-lait";

  return (
    <section id={v3contact.id} className="border-t-2 border-encre bg-violet/10">
      <div className="mx-auto max-w-content px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <Eyebrow color="violet">{v3contact.eyebrow}</Eyebrow>
            <h2 className="mt-5 font-sans text-3xl font-extrabold tracking-tight text-encre sm:text-4xl md:text-5xl">
              {v3contact.title}
            </h2>
            <p className="mt-4 font-sans text-lg text-encre/70">{v3contact.subtitle}</p>
            <p className="mt-6 font-display text-xl italic text-encre/75">{v3contact.intro}</p>
            <div className="mt-8 space-y-3">
              <a href={`mailto:${v3contact.email}`} className="v3-card v3-card-hover flex items-center gap-3 p-4">
                <span className="text-xl" aria-hidden>✉️</span>
                <span className="font-sans font-medium text-encre">{v3contact.email}</span>
              </a>
              <a href={`tel:${v3contact.phone.replace(/\s/g, "")}`} className="v3-card v3-card-hover flex items-center gap-3 p-4">
                <span className="text-xl" aria-hidden>📞</span>
                <span className="font-sans font-medium text-encre">{v3contact.phone}</span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="v3-window">
              <div className="v3-window-bar">
                <span className="h-3 w-3 rounded-full border-2 border-encre bg-corail" aria-hidden />
                <span className="h-3 w-3 rounded-full border-2 border-encre bg-jaune" aria-hidden />
                <span className="h-3 w-3 rounded-full border-2 border-encre bg-teal" aria-hidden />
                <span className="ml-2 font-mono text-[0.62rem] text-encre/60">audit-gratuit.form</span>
              </div>
              {sent ? (
                <div className="flex min-h-[22rem] flex-col items-center justify-center p-8 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-encre bg-teal text-3xl text-white" aria-hidden>✓</span>
                  <h3 className="mt-5 font-sans text-2xl font-extrabold text-encre">Bien reçu !</h3>
                  <p className="mt-2 max-w-xs font-sans text-encre/70">
                    Votre demande est notée. Je reviens vers vous sous 24h pour caler l'audit.
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
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input required placeholder={v3contact.fields.name} autoComplete="name" className={field} />
                    <input required placeholder={v3contact.fields.business} className={field} />
                    <input placeholder={v3contact.fields.city} className={field} />
                    <input type="tel" placeholder={v3contact.fields.phone} autoComplete="tel" className={field} />
                  </div>
                  <input type="email" required placeholder={v3contact.fields.email} autoComplete="email" className={field} />
                  <textarea rows={4} placeholder={v3contact.fields.message} className={`${field} resize-none`} />
                  <button
                    type="submit"
                    className="w-full rounded-xl border-2 border-encre bg-corail px-6 py-4 font-sans text-base font-bold text-white shadow-[4px_4px_0_#211D16] transition-transform hover:-translate-y-0.5"
                  >
                    {v3contact.submit}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Footer */
export function V3Footer() {
  return (
    <footer className="border-t-2 border-encre bg-encre">
      <div className="mx-auto flex max-w-content flex-col gap-6 px-5 py-12 md:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-lait/60 bg-jaune font-sans text-sm font-extrabold text-encre">
              N
            </span>
            <span className="font-sans text-lg font-extrabold tracking-tight text-lait">
              NOVA<span className="text-jaune">.studio</span>
            </span>
          </div>
          <p className="mt-3 max-w-sm font-sans text-sm leading-relaxed text-lait/60">{v3footer.blurb}</p>
        </div>
        <div className="font-mono text-[0.65rem] uppercase tracking-wide text-lait/50">
          <p>{v3footer.tagline}</p>
          <p className="mt-1.5">{v3footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
