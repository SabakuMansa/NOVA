"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Nav du site fictif "Maison Verdure" (/exemples/presence) — style propre à
 * cette démo (référence visuelle : maquette Claude Design "01 - Fleuriste
 * (Présence)"), distinct des 3 autres démos et de l'arcade NOVA Studio.
 * Dernier lien de `links` traité comme le CTA rempli (Contact), les autres
 * en liens texte — même liste de contenu que ExempleNav, juste un rendu
 * différent.
 */
export default function PresenceNav({
  businessName,
  links,
}: {
  businessName: string;
  links: { label: string; href: string }[];
}) {
  const pathname = usePathname();
  const navLinks = links.slice(0, -1);
  const cta = links[links.length - 1];

  return (
    <header className="sticky top-0 z-20 border-b border-fleur-border bg-fleur-bg/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link href="/exemples/presence" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-fleur-sage font-fleur-display text-lg text-fleur-bg">
            {businessName.charAt(0)}
          </span>
          <span className="font-fleur-display text-2xl font-medium tracking-wide text-fleur-ink-dark">
            {businessName}
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-fleur-sans text-[15px] transition-colors ${
                pathname === l.href
                  ? "text-fleur-sage"
                  : "text-fleur-ink hover:text-fleur-olive"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={cta.href}
            className="rounded-full bg-fleur-sage px-5 py-2.5 font-fleur-sans text-[15px] font-semibold text-fleur-bg transition-transform hover:-translate-y-0.5"
          >
            {cta.label}
          </Link>
        </div>
      </nav>
    </header>
  );
}
