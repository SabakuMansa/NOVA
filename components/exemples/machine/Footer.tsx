/**
 * Pied de page "Au Poil" — palette/typo propres à cette démo (maquette
 * Claude Design "03 - Restaurant (Machine)", tokens braise-*). Voir
 * ExempleFooter pour la version arcade (homepage) et les autres démos pour
 * leurs propres traitements.
 */
export default function MachineFooter({
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
    <footer className="bg-braise-footer px-5 py-9 text-center md:px-8">
      <p className="font-braise-display text-xl text-braise-bg">
        {businessName}
      </p>
      <p className="mt-2 font-braise-sans text-sm text-braise-bg/70">
        {address} · {hours}
      </p>
      <p className="mt-4 font-braise-sans text-xs uppercase tracking-wide text-braise-bg/40">
        Site d&apos;exemple réalisé avec le {planLabel} de K1000 Studio ·
        Hébergement inclus
      </p>
    </footer>
  );
}
