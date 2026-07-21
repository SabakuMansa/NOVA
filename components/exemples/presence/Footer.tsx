/**
 * Pied de page "Maison Verdure" — palette/typo propres à cette démo.
 * Recoloré le 21/07 sur l'univers "Au Petit Marché" (vert sapin foncé,
 * crème, or) en valeurs Tailwind arbitraires. Voir ExempleFooter pour la
 * version arcade (homepage) et les autres démos pour leurs traitements.
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
    <footer className="bg-[#2e3d34] px-5 py-9 text-center md:px-8">
      <p className="font-fleur-display text-xl text-[#f5ecd8]">{businessName}</p>
      <p className="mt-2 font-fleur-sans text-sm text-[#e2d6b8]/80">
        {address} · {hours}
      </p>
      <p className="mt-4 font-fleur-sans text-xs uppercase tracking-wide text-[#e2d6b8]/40">
        Site d&apos;exemple réalisé avec le {planLabel} de K1000 Studio ·
        Hébergement inclus
      </p>
    </footer>
  );
}
