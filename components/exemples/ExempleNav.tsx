"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Mini navigation du site FICTIF présenté dans `/exemples/*` — volontairement
 * distincte de <V3Nav/> (celle de K1000 Studio elle-même) : ce composant
 * représente le site que le commerçant recevrait, pas celui de l'agence.
 * Restylé le 16/07 en pixel arcade (cohérence DA sitewide) — reste un
 * composant à part de <V3Nav/>, mêmes tokens de couleur/police seulement.
 */
export default function ExempleNav({
  businessName,
  links,
}: {
  businessName: string;
  links: { label: string; href: string }[];
}) {
  const pathname = usePathname();

  return (
    <header className="border-b border-arcade-border bg-arcade-bg">
      <nav className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-3 px-5 py-4 md:px-8">
        <span className="font-pixel text-xs tracking-tight text-arcade-cream">
          {businessName}
        </span>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-pixel text-[0.6rem] transition-colors ${
                pathname === l.href
                  ? "text-arcade-gold"
                  : "text-arcade-taupe hover:text-arcade-cream"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
