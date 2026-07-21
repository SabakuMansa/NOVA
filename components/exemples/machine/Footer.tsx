/**
 * Pied de page "Chez Fernand" — recoloré le 21/07 sur l'univers "bistrot
 * parisien traditionnel" (design handoff hifi, ex-"Chez Margot") : fond
 * ardoise `#20211c`, texte crème, nom en Playfair Display italique. Voir
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
    <footer className="bg-[#20211c] px-5 py-9 text-center md:px-8">
      <p className="font-braise-display text-xl italic text-[#e6c48f]">
        {businessName}
      </p>
      <p className="mt-2 font-braise-sans text-sm text-[#f2e4c9]/70">
        {address} · {hours}
      </p>
      <p className="mt-4 font-braise-sans text-xs uppercase tracking-wide text-[#f2e4c9]/40">
        Site d&apos;exemple réalisé avec le {planLabel} de K1000 Studio ·
        Hébergement inclus
      </p>
    </footer>
  );
}
