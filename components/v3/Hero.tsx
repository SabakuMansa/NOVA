"use client";

import { v3hero } from "@/content/v3";
import V3Backdrop from "./V3Backdrop";
import NotifFeed from "./NotifFeed";

export default function V3Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-lait pt-28 md:pt-32"
    >
      <V3Backdrop />

      <div className="relative z-10 mx-auto grid max-w-content items-center gap-12 px-5 pb-20 md:px-8 md:pb-24 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="hero-rise inline-flex items-center gap-2 rounded-full border-2 border-encre bg-white px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-encre shadow-[2px_2px_0_#211D16]">
            <span
              className="h-2 w-2 animate-pulse rounded-full bg-teal"
              aria-hidden
            />
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
            {v3hero.titleB}
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
        <div
          className="hero-slate v3-window mx-auto w-full max-w-md"
          style={{ transform: "rotate(1.2deg)" }}
        >
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
            <span className="ml-2 truncate font-mono text-[0.62rem] text-encre/60">
              {v3hero.terminalTitle}
            </span>
            <span className="ml-auto rounded-md bg-teal px-2 py-0.5 font-mono text-[0.55rem] font-bold uppercase text-white">
              live
            </span>
          </div>
          <div className="p-4 sm:p-5">
            <NotifFeed events={v3hero.events} />
            <p className="mt-4 border-t-2 border-dashed border-encre/10 pt-3 font-mono text-[0.6rem] uppercase tracking-wide text-encre/45">
              Pendant ce temps, vous êtes avec vos clients.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
