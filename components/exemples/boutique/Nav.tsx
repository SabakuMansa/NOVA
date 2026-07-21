"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/exemples/CartContext";

/**
 * Nav du site fictif "Le Petit Atelier" (/exemples/boutique) — style propre
 * à cette démo, distinct des 3 autres démos et de l'arcade K1000 Studio.
 * Recoloré le 21/07 sur l'univers "Unit—9" (design handoff, concept store
 * urbain) : bandeau quasi-noir + accent vert acide, en valeurs Tailwind
 * arbitraires (pas de nouveaux tokens dans tailwind.config.ts). Ce bandeau
 * est partagé par toutes les sous-pages de la démo (catalogue/panier/
 * produit/confirmation), qui gardent elles-mêmes la palette claire "nord-*"
 * existante — seul le chrome (Nav/Footer/Banner) et l'accueil changent de
 * palette, cf. brief du 21/07. Le dernier lien de `links` (Panier) est
 * rendu comme une icône de panier avec badge de comptage plutôt qu'un
 * simple lien texte — affordance déjà présente dans la maquette (icône
 * panier + compteur).
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
    <header className="sticky top-0 z-20 border-b border-[#26262a] bg-[#101012]/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-5 md:px-8">
        <Link
          href="/exemples/boutique"
          className="whitespace-nowrap font-nord-display text-lg uppercase tracking-[0.12em] text-[#f2f2f0] sm:text-xl md:text-2xl"
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
                  ? "text-[#c8ff3d]"
                  : "text-[#a9a9ad] hover:text-[#f2f2f0]"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {cartLink && (
            <Link
              href={cartLink.href}
              className="flex items-center gap-2 font-nord-sans text-[13px] uppercase tracking-[0.12em] text-[#a9a9ad] transition-colors hover:text-[#f2f2f0]"
            >
              {cartLink.label}
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c8ff3d] px-1.5 font-nord-sans text-[11px] font-semibold text-[#101012]">
                {count}
              </span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
