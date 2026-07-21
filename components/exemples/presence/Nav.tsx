"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Nav du site fictif "Maison Verdure" (/exemples/presence) — style propre à
 * cette démo. Recoloré le 21/07 sur l'univers "Au Petit Marché" (design
 * handoff hifi) : bandeau vert sapin/crème/or, DM Serif Display pour le nom
 * — palette en valeurs Tailwind arbitraires (pas de nouveaux tokens dans
 * tailwind.config.ts, pour ne pas affecter les sous-pages de cette démo).
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
    <header className="sticky top-0 z-20 bg-[#3d5245]">
      <nav className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link href="/exemples/presence" className="flex items-center gap-3">
          <span className="font-fleur-display text-2xl tracking-wide text-[#f5ecd8]">
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
                  ? "text-[#e0a93b]"
                  : "text-[#e2d6b8] hover:text-[#f5ecd8]"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={cta.href}
            className="rounded-sm bg-[#e0a93b] px-5 py-2.5 font-fleur-sans text-[15px] font-semibold text-[#3d3220] transition-transform hover:-translate-y-0.5"
          >
            {cta.label}
          </Link>
        </div>
      </nav>
    </header>
  );
}
