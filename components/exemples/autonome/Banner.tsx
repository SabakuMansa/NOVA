import Link from "next/link";

/**
 * Bandeau de contexte K1000 Studio (chrome méta, pas la marque du commerce
 * fictif) — recoloré dans la palette "metam" pour ne jamais retomber sur
 * l'arcade, cohérent avec le principe déjà établi sur les autres démos.
 */
export default function AutonomeBanner({ planLabel }: { planLabel: string }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-metam-border bg-metam-ink px-5 py-2 text-center">
      <p className="font-metam-sans text-[0.68rem] uppercase tracking-wide text-metam-bg/80">
        Exemple concret · {planLabel} — commerce fictif, à titre
        d&apos;illustration
      </p>
      <Link
        href="/#plans"
        className="font-metam-sans text-[0.68rem] uppercase tracking-wide text-metam-bg/55 underline underline-offset-2 hover:text-metam-bg"
      >
        ← Retour aux plans K1000 Studio
      </Link>
    </div>
  );
}
