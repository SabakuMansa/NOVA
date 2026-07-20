"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { autonomeDemo } from "@/content/exemples/autonome";

/**
 * Nav du site fictif "Salon Marguerite" (/exemples/autonome) — style propre à
 * cette démo (référence visuelle : maquette Claude Design "02 - Salon de
 * coiffure (Autonome)", alias "Studio.Métamorphose"), distinct des 3 autres
 * démos et de l'arcade K1000 Studio. Wordmark + puce violette décorative,
 * liens texte, CTA "Prendre RDV" séparé de la liste `nav` (comme dans la
 * maquette d'origine où le CTA n'appartient pas à la nav elle-même) —
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
    <header className="metam-scope sticky top-0 z-20 border-b border-metam-border bg-metam-bg/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link
          href="/exemples/autonome"
          className="flex items-center gap-2 font-metam-display text-lg font-bold uppercase tracking-tight text-metam-ink"
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full bg-metam-purple"
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
                  ? "text-metam-purple"
                  : "text-metam-muted hover:text-metam-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/exemples/autonome/contact"
            className="rounded-lg bg-metam-ink px-5 py-2.5 font-metam-sans text-[14px] font-semibold text-metam-bg transition-transform metam-anim hover:-translate-y-0.5"
          >
            {autonomeDemo.accueil.cta}
          </Link>
        </div>
      </nav>
    </header>
  );
}
