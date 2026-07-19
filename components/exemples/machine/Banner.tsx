import Link from "next/link";

/**
 * Bandeau de contexte NOVA Studio (chrome méta, pas la marque du commerce
 * fictif) — recoloré dans la palette "braise" pour ne jamais retomber sur
 * l'arcade, cohérent avec le principe déjà établi sur les autres démos.
 */
export default function MachineBanner({ planLabel }: { planLabel: string }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-braise-border-dark bg-braise-ink px-5 py-2 text-center">
      <p className="font-braise-sans text-[0.68rem] uppercase tracking-wide text-braise-bg/80">
        Exemple concret · {planLabel} — commerce fictif, à titre
        d&apos;illustration
      </p>
      <Link
        href="/#plans"
        className="font-braise-sans text-[0.68rem] uppercase tracking-wide text-braise-bg/55 underline underline-offset-2 hover:text-braise-bg"
      >
        ← Retour aux plans NOVA Studio
      </Link>
    </div>
  );
}
