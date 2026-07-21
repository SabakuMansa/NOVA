"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Nav du site fictif "Chez Fernand" (/exemples/machine) — recolorée le
 * 21/07 sur l'univers "bistrot parisien traditionnel" (design handoff
 * hifi, ex-"Chez Margot") : bandeau bordeaux `#6b1f24`, nom en Playfair
 * Display italique gras, CTA or `#e6c48f`. Palette en valeurs Tailwind
 * arbitraires (pas de nouveaux tokens dans tailwind.config.ts), même
 * principe que PresenceNav. Le CTA (réservation) est repéré par son `href`
 * (`/contact`) plutôt que par son libellé, pour rester correct même si le
 * texte du lien change ("Réserver" au lieu de "Contact").
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
    <header className="sticky top-0 z-20 bg-[#6b1f24]">
      <nav className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link
          href="/exemples/machine"
          className="font-braise-display text-2xl italic text-[#f2e4c9]"
        >
          {businessName}
        </Link>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
          {links.map((l) =>
            l.href.endsWith("/contact") ? (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-sm bg-[#e6c48f] px-5 py-2.5 font-braise-sans text-[15px] font-semibold text-[#6b1f24] transition-transform hover:-translate-y-0.5"
              >
                {l.label}
              </Link>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className={`font-braise-sans text-[15px] font-medium transition-colors ${
                  pathname === l.href
                    ? "text-[#e6c48f]"
                    : "text-[#f2e4c9]/85 hover:text-[#f2e4c9]"
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
