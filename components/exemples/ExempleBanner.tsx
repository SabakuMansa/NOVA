import Link from "next/link";

/**
 * Bandeau de contexte affiché en haut de chaque page `/exemples/*` — même
 * traitement que les sandbox `/demo/*` : rappelle qu'il s'agit d'un exemple
 * fictif, avec un lien de retour vers la section Plans du site NOVA Studio.
 */
export default function ExempleBanner({ planLabel }: { planLabel: string }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b-2 border-encre bg-encre px-5 py-2 text-center">
      <p className="font-mono text-[0.62rem] uppercase tracking-wide text-jaune">
        Exemple concret · {planLabel} — commerce fictif, à titre d&apos;illustration
      </p>
      <Link
        href="/#plans"
        className="font-mono text-[0.62rem] uppercase tracking-wide text-lait/70 underline underline-offset-2 hover:text-lait"
      >
        ← Retour aux plans NOVA Studio
      </Link>
    </div>
  );
}
