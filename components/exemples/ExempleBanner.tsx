import Link from "next/link";

/**
 * Bandeau de contexte affiché en haut de chaque page `/exemples/*` — même
 * traitement que les sandbox `/demo/*` : rappelle qu'il s'agit d'un exemple
 * fictif, avec un lien de retour vers la section Plans du site K1000 Studio.
 * Restylé le 16/07 en pixel arcade (cohérence DA sitewide) — déjà sombre
 * avant ce passage, seuls les tokens de couleur/police changent.
 */
export default function ExempleBanner({ planLabel }: { planLabel: string }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-arcade-border bg-arcade-bg-alt px-5 py-2 text-center">
      <p className="font-mono text-[0.62rem] uppercase tracking-wide text-arcade-gold">
        Exemple concret · {planLabel} — commerce fictif, à titre d&apos;illustration
      </p>
      <Link
        href="/#plans"
        className="font-mono text-[0.62rem] uppercase tracking-wide text-arcade-taupe underline underline-offset-2 hover:text-arcade-cream"
      >
        ← Retour aux plans K1000 Studio
      </Link>
    </div>
  );
}
