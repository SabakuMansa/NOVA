import Link from "next/link";

/**
 * Bandeau de contexte K1000 Studio (chrome méta, pas la marque du commerce
 * fictif) — recoloré le 21/07 sur l'univers "Unit—9" (quasi-noir + vert
 * acide en valeurs arbitraires) pour ne jamais retomber sur l'arcade, même
 * principe que les autres démos (voir Présence/Autonome/Machine).
 */
export default function BoutiqueBanner({ planLabel }: { planLabel: string }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-[#26262a] bg-[#101012] px-5 py-2 text-center">
      <p className="font-nord-sans text-[0.68rem] uppercase tracking-wide text-[#a9a9ad]">
        Exemple concret · {planLabel} — commerce fictif, à titre
        d&apos;illustration
      </p>
      <Link
        href="/#plans"
        className="font-nord-sans text-[0.68rem] uppercase tracking-wide text-[#8a8a90] underline underline-offset-2 hover:text-[#c8ff3d]"
      >
        ← Retour aux plans K1000 Studio
      </Link>
    </div>
  );
}
