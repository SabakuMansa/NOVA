import Link from "next/link";

/**
 * Bandeau de contexte NOVA Studio (chrome méta, pas la marque du commerce
 * fictif) — recoloré dans la palette "nord" pour ne jamais retomber sur
 * l'arcade, même principe que les autres démos (voir Présence/Autonome/
 * Machine).
 */
export default function BoutiqueBanner({ planLabel }: { planLabel: string }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-nord-border bg-nord-dark px-5 py-2 text-center">
      <p className="font-nord-sans text-[0.68rem] uppercase tracking-wide text-nord-bg/80">
        Exemple concret · {planLabel} — commerce fictif, à titre
        d&apos;illustration
      </p>
      <Link
        href="/#plans"
        className="font-nord-sans text-[0.68rem] uppercase tracking-wide text-nord-bg/55 underline underline-offset-2 hover:text-nord-bg"
      >
        ← Retour aux plans NOVA Studio
      </Link>
    </div>
  );
}
