/**
 * Pied de page "Maison Verdure" — palette/typo propres à cette démo. Voir
 * ExempleFooter pour la version arcade (homepage) et les autres démos pour
 * leurs propres traitements.
 */
export default function PresenceFooter({
  businessName,
  address,
  hours,
  planLabel,
}: {
  businessName: string;
  address: string;
  hours: string;
  planLabel: string;
}) {
  return (
    <footer className="bg-fleur-footer px-5 py-9 text-center md:px-8">
      <p className="font-fleur-display text-xl text-fleur-bg">{businessName}</p>
      <p className="mt-2 font-fleur-sans text-sm text-fleur-bg/70">
        {address} · {hours}
      </p>
      <p className="mt-4 font-fleur-sans text-xs uppercase tracking-wide text-fleur-bg/40">
        Site d&apos;exemple réalisé avec le {planLabel} de NOVA Studio ·
        Hébergement inclus
      </p>
    </footer>
  );
}
