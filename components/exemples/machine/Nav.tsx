"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Nav du site fictif "Au Poil" (/exemples/machine) — style propre à cette
 * démo (référence visuelle : maquette Claude Design "03 - Restaurant
 * (Machine)", palette et typographie uniquement, jamais son vocabulaire
 * restaurant). Modelé sur PresenceNav : le lien "Contact" (prise de
 * rendez-vous) est traité comme le CTA rempli, les autres en liens texte —
 * même liste de contenu que ExempleNav, juste un rendu différent.
 */
export default function MachineNav({
  businessName,
  links,
}: {
  businessName: string;
  links: { label: string; href: string }[];
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-braise-ink/10 bg-braise-bg/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link
          href="/exemples/machine"
          className="font-braise-display text-2xl text-braise-ink"
        >
          {businessName}
        </Link>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
          {links.map((l) =>
            l.label === "Contact" ? (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-md bg-braise-rust px-5 py-2.5 font-braise-sans text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                {l.label}
              </Link>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className={`font-braise-sans text-[15px] font-medium transition-colors ${
                  pathname === l.href
                    ? "text-braise-rust"
                    : "text-braise-ink hover:text-braise-rust"
                }`}
              >
                {l.label}
              </Link>
            )
          )}
        </div>
      </nav>
    </header>
  );
}
