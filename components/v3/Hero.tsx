"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { v3hero } from "@/content/v3";
import V3Backdrop from "./V3Backdrop";

const TAG_COLORS: Record<string, string> = {
  résa: "bg-violet/15 text-violet",
  avis: "bg-jaune/25 text-encre",
  commande: "bg-corail/15 text-corail",
  admin: "bg-teal/15 text-teal",
};

/** Flux d'événements simulé : une notif toutes les 2,2 s, 4 visibles max.
 *  Reduced-motion : liste statique, aucune rotation. */
function NotifFeed() {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setCount((c) => c + 1), 2200);
    return () => clearInterval(t);
  }, [reduce]);

  const visible = Array.from({ length: 4 }, (_, i) => {
    const idx = (count - 3 + i + v3hero.events.length * 100) % v3hero.events.length;
    return { ...v3hero.events[idx], key: count - 3 + i };
  });

  return (
    <ul className="space-y-2.5" aria-live="off">
      {visible.map((e) => (
        <li
          key={e.key}
          className={`${reduce ? "" : "v3-notif"} flex items-center gap-3 rounded-xl border-2 border-encre/10 bg-lait px-3.5 py-2.5`}
        >
          <span className="text-lg" aria-hidden>
            {e.icon}
          </span>
          <span className="min-w-0 flex-1 truncate font-sans text-[0.83rem] text-encre/85">
            {e.text}
          </span>
          <span
            className={`shrink-0 rounded-md px-2 py-0.5 font-mono text-[0.58rem] uppercase ${
              TAG_COLORS[e.tag] || "bg-encre/10 text-encre"
            }`}
          >
            {e.tag}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function V3Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-lait pt-28 md:pt-32">
      <V3Backdrop />

      <div className="relative z-10 mx-auto grid max-w-content items-center gap-12 px-5 pb-20 md:px-8 md:pb-24 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="hero-rise inline-flex items-center gap-2 rounded-full border-2 border-encre bg-white px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-encre shadow-[2px_2px_0_#211D16]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-teal" aria-hidden />
            {v3hero.eyebrow}
          </p>

          <h1
            className="hero-rise mt-6 font-sans text-[2.5rem] font-extrabold leading-[1.06] tracking-tight text-encre sm:text-5xl md:text-6xl"
            style={{ animationDelay: "0.08s" }}
          >
            {v3hero.titleA}{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10 px-1">{v3hero.titleEm}</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 top-1 -rotate-1 rounded-md bg-jaune"
              />
            </span>
            , {v3hero.titleB}
          </h1>

          <p
            className="hero-rise mt-7 max-w-xl font-sans text-lg leading-relaxed text-encre/75"
            style={{ animationDelay: "0.16s" }}
          >
            {v3hero.subtitle}
          </p>

          <div
            className="hero-rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "0.24s" }}
          >
            <a
              href={v3hero.ctaPrimary.href}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-encre bg-corail px-6 py-3.5 font-sans text-base font-bold text-white shadow-[4px_4px_0_#211D16] transition-transform hover:-translate-y-0.5"
            >
              {v3hero.ctaPrimary.label} →
            </a>
            <a
              href={v3hero.ctaSecondary.href}
              className="inline-flex items-center justify-center rounded-xl border-2 border-encre bg-white px-6 py-3.5 font-sans text-base font-bold text-encre shadow-[4px_4px_0_#211D16] transition-transform hover:-translate-y-0.5"
            >
              {v3hero.ctaSecondary.label}
            </a>
          </div>
        </div>

        {/* Fenêtre « le site en service » */}
        <div className="hero-slate v3-window mx-auto w-full max-w-md" style={{ transform: "rotate(1.2deg)" }}>
          <div className="v3-window-bar">
            <span className="h-3 w-3 rounded-full border-2 border-encre bg-corail" aria-hidden />
            <span className="h-3 w-3 rounded-full border-2 border-encre bg-jaune" aria-hidden />
            <span className="h-3 w-3 rounded-full border-2 border-encre bg-teal" aria-hidden />
            <span className="ml-2 truncate font-mono text-[0.62rem] text-encre/60">
              {v3hero.terminalTitle}
            </span>
            <span className="ml-auto rounded-md bg-teal px-2 py-0.5 font-mono text-[0.55rem] font-bold uppercase text-white">
              live
            </span>
          </div>
          <div className="p-4 sm:p-5">
            <NotifFeed />
            <p className="mt-4 border-t-2 border-dashed border-encre/10 pt-3 font-mono text-[0.6rem] uppercase tracking-wide text-encre/45">
              Pendant ce temps, vous êtes en salle.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
