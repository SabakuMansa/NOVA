"use client";

import { useEffect, useState } from "react";
import { v3nav } from "@/content/v3";
import InsertCoinOverlay from "./InsertCoinOverlay";

export default function V3Nav() {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [easterEgg, setEasterEgg] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setCompact(window.scrollY > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setScore(Math.floor(progress * 99999));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Bandeau "borne d'arcade" persistant — chrome décoratif uniquement,
          jamais de vraie donnée (le compteur "1P" suit juste la progression
          du scroll, "HI 99999" n'est pas un vrai score). Toujours opaque
          (indépendant du compactage de la nav en dessous) pour rester lisible
          sur tout le site, pas seulement le Hero. Masqué sous `sm` : la
          consigne demande une barre mobile simplifiée (logo + menu). */}
      <div className="hidden items-center justify-between border-b border-arcade-border bg-arcade-bg px-6 py-2 font-pixel text-[0.55rem] text-arcade-gold sm:flex md:px-8">
        <span className="text-arcade-orange">
          1P{" "}
          <span className="text-arcade-cream">
            {String(score).padStart(5, "0")}
          </span>
        </span>
        <button
          type="button"
          onClick={() => setEasterEgg(true)}
          className="arcade-blink hidden cursor-pointer md:inline hover:text-arcade-cream focus-visible:text-arcade-cream"
          aria-haspopup="dialog"
          aria-label="Easter egg Insert Coin"
        >
          INSERT COIN
        </button>
        <span className="text-arcade-orange">
          HI <span className="text-arcade-cream">99999</span>
        </span>
      </div>

      <nav
        className={`flex items-center justify-between px-5 transition-all duration-300 md:px-8 ${
          compact
            ? "border-b border-arcade-border bg-arcade-bg/90 backdrop-blur-md"
            : "bg-transparent"
        }`}
        aria-label="Navigation principale"
      >
        <div
          className={`mx-auto flex w-full max-w-content items-center justify-between transition-all duration-300 ${
            compact ? "h-14" : "h-20"
          }`}
        >
          <a href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-arcade-border-thick bg-arcade-gold font-pixel text-xs text-arcade-bg shadow-[2px_2px_0_#2C241A]">
              N
            </span>
            <span className="font-pixel text-xs tracking-tight text-arcade-cream">
              NOVA<span className="text-arcade-orange">.studio</span>
            </span>
          </a>

          <div className="hidden items-center gap-6 lg:flex">
            {v3nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-pixel text-[0.6rem] text-arcade-taupe transition-colors hover:text-arcade-cream"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={v3nav.cta.href}
              className="hidden rounded-xl border-2 border-arcade-border-thick bg-arcade-orange px-4 py-2.5 font-pixel text-[0.6rem] text-arcade-bg shadow-[3px_3px_0_#2C241A] transition-transform hover:-translate-y-0.5 sm:inline-block"
            >
              {v3nav.cta.label}
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-arcade-border-thick bg-arcade-card shadow-[2px_2px_0_#2C241A] lg:hidden"
              aria-expanded={open}
              aria-label="Ouvrir le menu"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 h-0.5 w-4 bg-arcade-cream transition-all ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 h-0.5 w-4 bg-arcade-cream transition-opacity ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 h-0.5 w-4 bg-arcade-cream transition-all ${
                    open ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="border-t-2 border-arcade-border bg-arcade-bg lg:hidden">
          <div className="mx-auto flex max-w-content flex-col gap-1 px-5 py-4">
            {v3nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 font-pixel text-[0.65rem] text-arcade-tan hover:bg-arcade-card"
              >
                {l.label}
              </a>
            ))}
            <a
              href={v3nav.cta.href}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl border-2 border-arcade-border-thick bg-arcade-orange px-5 py-3.5 text-center font-pixel text-[0.65rem] text-arcade-bg shadow-[3px_3px_0_#2C241A]"
            >
              {v3nav.cta.label}
            </a>
          </div>
        </div>
      )}

      <InsertCoinOverlay
        open={easterEgg}
        onClose={() => setEasterEgg(false)}
        contactHref={v3nav.cta.href}
      />
    </header>
  );
}
