import Link from "next/link";

/**
 * Bandeau de contexte K1000 Studio (chrome méta, pas la marque du commerce
 * fictif) — recoloré le 21/07 sur l'univers "bistrot parisien traditionnel"
 * (ardoise `#20211c` foncé) pour ne jamais retomber sur l'arcade, cohérent
 * avec le principe déjà établi sur les autres démos.
 */
export default function MachineBanner({ planLabel }: { planLabel: string }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-[#20211c] px-5 py-2 text-center">
      <p className="font-braise-sans text-[0.68rem] uppercase tracking-wide text-[#f2e4c9]/80">
        Exemple concret · {planLabel} — commerce fictif, à titre
        d&apos;illustration
      </p>
      <Link
        href="/#plans"
        className="font-braise-sans text-[0.68rem] uppercase tracking-wide text-[#f2e4c9]/55 underline underline-offset-2 hover:text-[#f2e4c9]"
      >
        ← Retour aux plans K1000 Studio
      </Link>
    </div>
  );
}
