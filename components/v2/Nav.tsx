"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { nav } from "@/content/site";

const PAGES = [
  { label: "Accueil", href: "/v2" },
  { label: "L'approche", href: "/v2/approche" },
  { label: "La carte", href: "/v2/carte" },
  { label: "Aperçu", href: "/v2/apercu" },
  { label: "Contact", href: "/v2/contact" },
];

export default function V2Nav() {
  const pathname = usePathname();
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  // Seule /v2 a un hero sombre (shader) : tant que la nav est transparente
  // (avant scroll), le texte doit être clair pour rester lisible dessus.
  const onDarkHero = pathname === "/v2" && !compact;

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

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
        <Link href="/v2" className="group flex items-baseline gap-2">
          <span
            className={`font-display text-2xl leading-none tracking-tight transition-colors ${
              onDarkHero ? "text-nappe" : "text-cafe"
            }`}
          >
            NOVA
          </span>
          <span
            className={`font-mono text-[0.62rem] uppercase tracking-eyebrow transition-colors ${
              onDarkHero ? "text-moutarde" : "text-lie"
            }`}
          >
            Studio
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {PAGES.map((p) => {
            const isActive =
              p.href === "/v2" ? pathname === "/v2" : pathname.startsWith(p.href);
            return (
              <Link
                key={p.href}
                href={p.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative font-sans text-sm transition-colors ${
                  onDarkHero
                    ? isActive
                      ? "text-nappe"
                      : "text-nappe/70 hover:text-nappe"
                    : isActive
                    ? "text-cafe"
                    : "text-cafe/70 hover:text-cafe"
                }`}
              >
                {p.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px transition-all duration-300 ${
                    onDarkHero ? "bg-moutarde" : "bg-lie"
                  } ${isActive ? "w-full opacity-100" : "w-0 opacity-0"}`}
                  aria-hidden
                />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/v2/contact"
            className={`hidden rounded-full px-5 py-2 font-mono text-xs uppercase tracking-wide transition-all hover:-translate-y-0.5 sm:inline-block ${
              onDarkHero
                ? "bg-moutarde text-cafe hover:bg-nappe"
                : "bg-cafe text-nappe hover:bg-lie"
            }`}
          >
            {nav.cta.label}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border lg:hidden ${
              onDarkHero && !open ? "border-nappe/30" : "border-cafe/20"
            }`}
            aria-expanded={open}
            aria-label="Ouvrir le menu"
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 h-0.5 w-4 transition-all ${
                  onDarkHero && !open ? "bg-nappe" : "bg-cafe"
                } ${open ? "top-1.5 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 top-1.5 h-0.5 w-4 transition-opacity ${
                  onDarkHero && !open ? "bg-nappe" : "bg-cafe"
                } ${open ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`absolute left-0 h-0.5 w-4 transition-all ${
                  onDarkHero && !open ? "bg-nappe" : "bg-cafe"
                } ${open ? "top-1.5 -rotate-45" : "top-3"}`}
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
            {PAGES.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="rounded-lg px-3 py-2.5 font-sans text-base text-cafe/80 hover:bg-craie"
              >
                {p.label}
              </Link>
            ))}
            <Link
              href="/v2/contact"
              className="mt-2 rounded-full bg-cafe px-5 py-3 text-center font-mono text-xs uppercase tracking-wide text-nappe"
            >
              {nav.cta.label}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
