"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";
import {
  v3fondateur,
  v3footer,
  v3plans,
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
const TEXT: Record<string, string> = {
  corail: "text-corail",
  violet: "text-violet",
  teal: "text-teal",
  jaune: "text-encre",
};

function Eyebrow({
  children,
  color = "violet",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <p
      className={`inline-flex items-center gap-2 rounded-full border-2 border-arcade-border-thick bg-arcade-card px-3.5 py-2 font-pixel text-[0.55rem] tracking-wide text-arcade-taupe shadow-[2px_2px_0_#000000]`}
    >
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
          <span className="text-jaune" aria-hidden>
            ✦
          </span>
        </span>
      ))}
    </div>
  );
  return (
    <div
      className="overflow-hidden border-y-2 border-encre bg-encre py-3"
      aria-hidden
    >
      <div className="v3-ticker-track">{[row("a"), row("b")]}</div>
    </div>
  );
}

/* --------------------------------------------------------------- Verdict */
const TYPE_MS = 40;
const PAUSE_MS = 800;

/** Réponse façon terminal : effacement caractère par caractère (arrière),
 *  puis écriture de la réponse suivante caractère par caractère, curseur
 *  clignotant. Exception volontaire à la règle "pas d'effet lettre par
 *  lettre" — cohérente avec le thème arcade/terminal déjà en place
 *  (Press Start 2P, curseur INSERT COIN). reduced-motion : answers[0]
 *  affichée seule, texte fixe, aucun curseur ni animation. */
function TypewriterAnswer({ items }: { items: string[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [phase, setPhase] = useState<"typing" | "erasing">("typing");

  useEffect(() => {
    if (reduce) return;
    const current = items[index];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (length < current.length) {
        timeout = setTimeout(() => setLength((l) => l + 1), TYPE_MS);
      } else {
        timeout = setTimeout(() => setPhase("erasing"), PAUSE_MS);
      }
    } else {
      if (length > 0) {
        timeout = setTimeout(() => setLength((l) => l - 1), TYPE_MS);
      } else {
        setIndex((v) => (v + 1) % items.length);
        setPhase("typing");
      }
    }

    return () => clearTimeout(timeout);
  }, [reduce, phase, length, index, items]);

  const textClass =
    "font-pixel leading-relaxed text-arcade-gold text-xl sm:text-3xl md:text-4xl";

  if (reduce) {
    return <p className={textClass}>{items[0]}</p>;
  }

  return (
    <p className={textClass} aria-live="off">
      {items[index].slice(0, length)}
      <span className="arcade-blink" aria-hidden>
        _
      </span>
    </p>
  );
}

export function V3Verdict() {
  return (
    <section
      id={v3verdict.id}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-arcade-bg px-5 pb-24 pt-28 text-center md:px-8 md:pb-28 md:pt-32"
    >
      <Reveal>
        <h2 className="mx-auto max-w-3xl font-pixel text-lg leading-relaxed tracking-tight text-arcade-cream sm:text-2xl md:text-3xl">
          {v3verdict.question}
        </h2>
      </Reveal>
      <div className="mt-10 md:mt-14">
        <TypewriterAnswer items={v3verdict.answers} />
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- Plans */
// Découpe "dès 1990€" → { prefix: "dès", amount: "1990€" } pour ne jamais
// mettre "dès" en emphase visuelle (toujours plus petit / atténué que le
// montant, jamais en gras/pixel) — contrainte explicite de la maquette.
function splitPrice(price: string): { prefix: string | null; amount: string } {
  const match = price.match(/^(dès)\s+(.+)$/i);
  if (!match) return { prefix: null, amount: price };
  return { prefix: match[1], amount: match[2] };
}

export function V3Plans() {
  const credit = String(v3plans.plans.length).padStart(2, "0");

  return (
    <section
      id={v3plans.id}
      className="mx-auto max-w-content px-5 py-20 md:px-8 md:py-28"
    >
      <Reveal className="text-center">
        <Eyebrow color="violet">{v3plans.eyebrow}</Eyebrow>
        <h2 className="mx-auto mt-5 max-w-2xl font-pixel text-lg leading-relaxed tracking-tight text-arcade-cream sm:text-2xl md:text-3xl">
          {v3plans.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-terminal text-xl text-arcade-tan">
          {v3plans.subtitle}
        </p>
      </Reveal>

      {/* Panneau façon borne d'arcade — même traitement que le Hero. */}
      <div className="mt-12 overflow-hidden rounded-[18px] border border-arcade-border bg-arcade-bg shadow-[0_30px_70px_rgba(0,0,0,0.55)]">
        <div className="flex items-center justify-between border-b-2 border-arcade-border px-6 py-3.5 font-pixel text-[0.55rem] text-arcade-gold sm:px-8 sm:text-[0.6rem]">
          <span className="text-arcade-orange">1P</span>
          <span className="hidden sm:inline">SELECT YOUR PLAN</span>
          <span className="text-arcade-orange">
            CREDIT <span className="text-arcade-cream">{credit}</span>
          </span>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8 xl:grid-cols-4">
          {v3plans.plans.map((p, i) => {
            const { prefix, amount } = splitPrice(p.price);
            return (
              <Reveal key={p.name} delay={i * 0.08}>
                <div
                  className={`relative flex flex-col gap-3.5 rounded-md border-[3px] p-5 ${
                    p.featured
                      ? "border-arcade-orange bg-arcade-card-featured shadow-[0_0_22px_rgba(255,122,0,0.22)]"
                      : "border-arcade-border-thick bg-arcade-card"
                  }`}
                >
                  {p.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-arcade-gold px-2 py-1 font-pixel text-[0.45rem] text-arcade-bg">
                      {p.badge}
                    </span>
                  )}

                  <p className="font-terminal text-lg leading-none text-arcade-taupe">
                    › {p.pitch}
                  </p>
                  <h3 className="font-pixel text-sm leading-snug text-arcade-cream">
                    {p.name}
                  </h3>
                  <p className="font-pixel text-lg text-arcade-gold">
                    {prefix && (
                      <span className="mr-1.5 font-terminal text-base font-normal text-arcade-taupe">
                        {prefix}
                      </span>
                    )}
                    {amount}
                  </p>
                  <p className="-mt-2 font-terminal text-lg text-arcade-taupe">
                    {p.monthly}
                  </p>

                  <div
                    className="h-1"
                    style={{
                      background:
                        "repeating-linear-gradient(90deg, #FF7A00 0 6px, transparent 6px 10px)",
                    }}
                    aria-hidden
                  />

                  <ul className="flex flex-col gap-2.5 font-mono text-xs text-arcade-tan">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span
                          className={`font-bold ${TEXT[p.color]}`}
                          aria-hidden
                        >
                          ✓
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="mailto:bonjour@k1000studio.fr"
                    className={`mt-auto block rounded border-2 py-3 text-center font-sans text-[0.55rem] transition-transform hover:-translate-y-0.5 ${
                      p.featured
                        ? "border-arcade-border-thick bg-arcade-orange text-arcade-bg shadow-[3px_3px_0_#FFD23F]"
                        : "border-arcade-border-thick text-arcade-cream"
                    }`}
                  >
                    Démarrer avec {p.name}
                  </a>
                  {p.exampleHref && (
                    <Link
                      href={p.exampleHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded border border-arcade-border-thick py-2 text-center font-mono text-[0.65rem] uppercase tracking-wide text-arcade-taupe transition-colors hover:border-arcade-orange hover:text-arcade-gold"
                    >
                      Voir un exemple concret ↗
                    </Link>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Module Commande & Livraison (v3plans.addon) volontairement masqué :
          pas prioritaire pour le moment. Données conservées dans content/v3.ts. */}
      <Reveal className="mx-auto mt-10 max-w-2xl text-center">
        <p className="font-terminal text-lg text-arcade-taupe">
          {v3plans.footnote}
        </p>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------- Fondateur */
export function V3Fondateur() {
  return (
    <section
      id={v3fondateur.id}
      className="mx-auto max-w-content px-5 py-20 md:px-8 md:py-28"
    >
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:items-center">
        <Reveal>
          <Eyebrow color="jaune">{v3fondateur.eyebrow}</Eyebrow>
          <h2 className="mt-5 font-sans text-base leading-relaxed tracking-tight text-arcade-cream sm:text-xl">
            {v3fondateur.title}
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {v3fondateur.badges.map((b) => (
              <span
                key={b}
                className="rounded-full border-2 border-arcade-border-thick bg-arcade-card px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-wide text-arcade-taupe shadow-[2px_2px_0_#000000]"
              >
                {b}
              </span>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="font-terminal text-xl leading-relaxed text-arcade-tan">
            {v3fondateur.teaser}
          </p>
          <Link
            href={v3fondateur.ctaHref}
            className="mt-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-arcade-gold underline underline-offset-4 hover:text-arcade-cream"
          >
            {v3fondateur.ctaLabel} →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Footer */
export function V3Footer() {
  return (
    <footer className="border-t border-arcade-border bg-arcade-bg">
      <div className="mx-auto flex max-w-content flex-col gap-6 px-5 py-12 md:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-arcade-border-thick bg-arcade-gold font-pixel text-xs text-arcade-bg">
              K
            </span>
            <span className="font-pixel text-xs tracking-tight text-arcade-cream">
              K1000<span className="text-arcade-orange">.studio</span>
            </span>
          </div>
          <p className="mt-3 max-w-sm font-terminal text-base leading-relaxed text-arcade-taupe">
            {v3footer.blurb}
          </p>
        </div>
        <div className="font-mono text-[0.65rem] uppercase tracking-wide text-arcade-muted">
          <p>{v3footer.tagline}</p>
          <p className="mt-1.5">{v3footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
