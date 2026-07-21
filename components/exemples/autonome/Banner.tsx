import Link from "next/link";

/**
 * Bandeau de contexte K1000 Studio (chrome méta, pas la marque du commerce
 * fictif) — recoloré le 21/07 sur l'univers "Maison Doré" (noir/or) pour ne
 * jamais retomber sur l'arcade, cohérent avec le principe déjà établi sur
 * les autres démos.
 */
export default function AutonomeBanner({ planLabel }: { planLabel: string }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-[#2a2118] bg-[#161310] px-5 py-2 text-center">
      <p className="font-metam-sans text-[0.68rem] uppercase tracking-wide text-[#e7d9bf]/80">
        Exemple concret · {planLabel} — commerce fictif, à titre
        d&apos;illustration
      </p>
      <Link
        href="/#plans"
        className="font-metam-sans text-[0.68rem] uppercase tracking-wide text-[#e7d9bf]/55 underline underline-offset-2 hover:text-[#e7d9bf]"
      >
        ← Retour aux plans K1000 Studio
      </Link>
    </div>
  );
}
