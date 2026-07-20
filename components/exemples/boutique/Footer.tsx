/**
 * Pied de page "Le Petit Atelier" — palette/typo propres à cette démo.
 * Fond sombre (nord-dark) pour un contraste éditorial, cohérent avec la
 * maquette "Atelier Nord" (footer sombre sur fond clair general).
 */
export default function BoutiqueFooter({
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
    <footer className="bg-nord-dark px-5 py-12 text-center md:px-8">
      <p className="font-nord-display text-xl uppercase tracking-[0.14em] text-nord-bg sm:text-2xl">
        {businessName}
      </p>
      <p className="mt-3 font-nord-sans text-sm text-nord-bg/70">
        {address} · {hours}
      </p>
      <p className="mt-6 font-nord-sans text-[0.65rem] uppercase tracking-wide text-nord-bg/40">
        Site d&apos;exemple réalisé avec le {planLabel} de K1000 Studio ·
        Hébergement inclus
      </p>
    </footer>
  );
}
