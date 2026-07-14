"use client";

import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { nav } from "@/content/site";

export default function Nav() {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  // Barre de progression du scroll global.
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Section active → lien de nav mis en avant (IntersectionObserver).
  useEffect(() => {
    const ids = nav.links.map((l) => l.href.replace("#", ""));
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        compact
          ? "bg-nappe/90 backdrop-blur-md shadow-[0_1px_0_rgba(46,37,33,0.08)]"
          : "bg-transparent"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-content items-center justify-between px-5 transition-all duration-300 md:px-8 ${
          compact ? "h-14" : "h-20"
        }`}
        aria-label="Navigation principale"
      >
        <a href="#top" className="group flex items-baseline gap-2">
          <span className="font-display text-2xl leading-none tracking-tight">
            NOVA
          </span>
          <span className="font-mono text-[0.62rem] uppercase tracking-eyebrow text-lie">
            Studio
          </span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {nav.links.map((l) => {
            const isActive = active === l.href.replace("#", "");
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={isActive ? "true" : undefined}
                className={`relative font-sans text-sm transition-colors ${
                  isActive ? "text-cafe" : "text-cafe/70 hover:text-cafe"
                }`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-lie transition-all duration-300 ${
                    isActive ? "w-full opacity-100" : "w-0 opacity-0"
                  }`}
                  aria-hidden
                />
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={nav.cta.href}
            className="hidden rounded-full bg-cafe px-5 py-2 font-mono text-xs uppercase tracking-wide text-nappe transition-transform hover:-translate-y-0.5 hover:bg-lie sm:inline-block"
          >
            {nav.cta.label}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cafe/20 lg:hidden"
            aria-expanded={open}
            aria-label="Ouvrir le menu"
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 h-0.5 w-4 bg-cafe transition-all ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 h-0.5 w-4 bg-cafe transition-opacity ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-4 bg-cafe transition-all ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Barre de progression du scroll (accent moutarde, discrète) */}
      <motion.div
        aria-hidden
        style={{ scaleX: scrollYProgress }}
        className="h-[2px] origin-left bg-moutarde"
      />

      {open && (
        <div className="border-t border-cafe/10 bg-nappe/95 backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-content flex-col gap-1 px-5 py-4">
            {nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 font-sans text-base text-cafe/80 hover:bg-craie"
              >
                {l.label}
              </a>
            ))}
            <a
              href={nav.cta.href}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-cafe px-5 py-3 text-center font-mono text-xs uppercase tracking-wide text-nappe"
            >
              {nav.cta.label}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
