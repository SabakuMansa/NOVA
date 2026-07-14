"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Mini navigation du site FICTIF présenté dans `/exemples/*` — volontairement
 * distincte de <V3Nav/> (celle de NOVA Studio elle-même) : ce composant
 * représente le site que le commerçant recevrait, pas celui de l'agence.
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
    <header className="border-b-2 border-encre bg-lait">
      <nav className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-3 px-5 py-4 md:px-8">
        <span className="font-sans text-lg font-extrabold tracking-tight text-encre">
          {businessName}
        </span>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-sans text-sm font-medium transition-colors ${
                pathname === l.href
                  ? "text-encre"
                  : "text-encre/60 hover:text-encre"
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
