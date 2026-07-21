"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { autonomeDemo } from "@/content/exemples/autonome";

/**
 * Nav du site fictif "Salon Marguerite" (/exemples/autonome) — style propre à
 * cette démo. Recoloré le 21/07 sur l'univers "Maison Doré" (design handoff
 * hifi, salon haussmannien chic) : bandeau noir/or, Bodoni Moda pour le nom
 * — palette en valeurs Tailwind arbitraires (pas de nouveaux tokens dans
 * tailwind.config.ts, pour ne pas affecter les sous-pages de cette démo, qui
 * gardent leur ancienne palette "metam" purple/blanc). Wordmark + puce or
 * décorative, liens texte, CTA "Prendre RDV" séparé de la liste `nav` —
 * réutilise le texte réel `accueil.cta`, jamais de copie inventée.
 */
export default function AutonomeNav({
  businessName,
  links,
}: {
  businessName: string;
  links: { label: string; href: string }[];
}) {
  const pathname = usePathname();

  return (
    <header className="metam-scope sticky top-0 z-20 border-b border-[#2a2118] bg-[#161310]/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link
          href="/exemples/autonome"
          className="flex items-center gap-2 font-metam-display text-lg tracking-wide text-[#e7d9bf]"
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full bg-[#b89968]"
            aria-hidden
          />
          {businessName}
        </Link>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-metam-sans text-[14px] font-medium transition-colors metam-anim ${
                pathname === l.href
                  ? "text-[#e0c48d]"
                  : "text-[#cabfa6] hover:text-[#e7d9bf]"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/exemples/autonome/contact"
            className="rounded-sm bg-[#b89968] px-5 py-2.5 font-metam-sans text-[14px] font-semibold text-[#161310] transition-transform metam-anim hover:-translate-y-0.5"
          >
            {autonomeDemo.accueil.cta}
          </Link>
        </div>
      </nav>
    </header>
  );
}
