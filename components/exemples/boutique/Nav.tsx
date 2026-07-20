"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/exemples/CartContext";

/**
 * Nav du site fictif "Le Petit Atelier" (/exemples/boutique) — style propre
 * à cette démo (référence visuelle : maquette Claude Design "04 - Boutique
 * mode (Boutique)" — DA éditoriale mode, appliquée ici visuellement à une
 * savonnerie/bougies), distinct des 3 autres démos et de l'arcade K1000
 * Studio. Le dernier lien de `links` (Panier) est rendu comme une icône de
 * panier avec badge de comptage plutôt qu'un simple lien texte — affordance
 * déjà présente dans la maquette (icône panier + compteur).
 */
export default function BoutiqueNav({
  businessName,
  links,
}: {
  businessName: string;
  links: { label: string; href: string }[];
}) {
  const pathname = usePathname();
  const { count } = useCart();
  const cartLink = links.find((l) => l.href.endsWith("/panier"));
  const navLinks = links.filter((l) => l !== cartLink);

  return (
    <header className="sticky top-0 z-20 border-b border-nord-border bg-nord-bg/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-5 md:px-8">
        <Link
          href="/exemples/boutique"
          className="whitespace-nowrap font-nord-display text-lg uppercase tracking-[0.12em] text-nord-ink sm:text-xl md:text-2xl"
        >
          {businessName}
        </Link>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-nord-sans text-[13px] uppercase tracking-[0.12em] transition-colors ${
                pathname === l.href
                  ? "text-nord-ink"
                  : "text-nord-muted hover:text-nord-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {cartLink && (
            <Link
              href={cartLink.href}
              className="flex items-center gap-2 font-nord-sans text-[13px] uppercase tracking-[0.12em] text-nord-muted transition-colors hover:text-nord-ink"
            >
              {cartLink.label}
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-nord-ink px-1.5 font-nord-sans text-[11px] font-semibold text-nord-bg">
                {count}
              </span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
