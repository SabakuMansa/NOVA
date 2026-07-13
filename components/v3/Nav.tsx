"use client";

import { useEffect, useState } from "react";
import { v3nav } from "@/content/v3";

export default function V3Nav() {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        compact ? "bg-lait/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-content items-center justify-between px-5 transition-all duration-300 md:px-8 ${
          compact ? "h-14" : "h-20"
        }`}
        aria-label="Navigation principale"
      >
        <a href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-encre bg-jaune font-sans text-sm font-extrabold text-encre shadow-[2px_2px_0_#211D16]">
            N
          </span>
          <span className="font-sans text-lg font-extrabold tracking-tight text-encre">
            NOVA<span className="text-violet">.studio</span>
          </span>
        </a>

        <div className="hidden items-center gap-6 lg:flex">
          {v3nav.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-sans text-sm font-medium text-encre/70 transition-colors hover:text-encre"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={v3nav.cta.href}
            className="hidden rounded-xl border-2 border-encre bg-corail px-4 py-2 font-sans text-sm font-bold text-white shadow-[3px_3px_0_#211D16] transition-transform hover:-translate-y-0.5 sm:inline-block"
          >
            {v3nav.cta.label}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-encre bg-white shadow-[2px_2px_0_#211D16] lg:hidden"
            aria-expanded={open}
            aria-label="Ouvrir le menu"
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 h-0.5 w-4 bg-encre transition-all ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 h-0.5 w-4 bg-encre transition-opacity ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-4 bg-encre transition-all ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t-2 border-encre bg-lait lg:hidden">
          <div className="mx-auto flex max-w-content flex-col gap-1 px-5 py-4">
            {v3nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 font-sans text-base font-medium text-encre/80 hover:bg-white"
              >
                {l.label}
              </a>
            ))}
            <a
              href={v3nav.cta.href}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl border-2 border-encre bg-corail px-5 py-3 text-center font-sans text-sm font-bold text-white shadow-[3px_3px_0_#211D16]"
            >
              {v3nav.cta.label}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
