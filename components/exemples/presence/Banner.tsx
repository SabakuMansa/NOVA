import Link from "next/link";

/**
 * Bandeau de contexte K1000 Studio (chrome méta, pas la marque du commerce
 * fictif) — recoloré le 21/07 sur l'univers "Au Petit Marché" (brun-vert
 * foncé) pour ne jamais retomber sur l'arcade, cohérent avec le principe
 * déjà établi sur les autres démos.
 */
export default function PresenceBanner({ planLabel }: { planLabel: string }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-[#2a2118] px-5 py-2 text-center">
      <p className="font-fleur-sans text-[0.68rem] uppercase tracking-wide text-[#f2e6c9]/80">
        Exemple concret · {planLabel} — commerce fictif, à titre
        d&apos;illustration
      </p>
      <Link
        href="/#plans"
        className="font-fleur-sans text-[0.68rem] uppercase tracking-wide text-[#f2e6c9]/55 underline underline-offset-2 hover:text-[#f2e6c9]"
      >
        ← Retour aux plans K1000 Studio
      </Link>
    </div>
  );
}
