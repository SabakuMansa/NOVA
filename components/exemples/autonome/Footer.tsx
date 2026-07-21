/**
 * Pied de page "Salon Marguerite" — palette/typo propres à cette démo.
 * Recoloré le 21/07 sur l'univers "Maison Doré" (noir #161310, or #b89968)
 * en valeurs Tailwind arbitraires. Voir ExempleFooter pour la version
 * arcade (homepage) et les autres démos pour leurs propres traitements.
 */
export default function AutonomeFooter({
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
    <footer className="metam-scope bg-[#161310] px-5 py-10 text-center md:px-8">
      <p className="font-metam-display text-xl tracking-wide text-[#f3ede3]">
        {businessName}
      </p>
      <p className="mt-2 font-metam-sans text-sm text-[#cabfa6]">
        {address} · {hours}
      </p>
      <p className="mt-5 font-metam-sans text-xs uppercase tracking-wide text-[#cabfa6]/50">
        Site d&apos;exemple réalisé avec le {planLabel} de K1000 Studio ·
        Hébergement inclus
      </p>
    </footer>
  );
}
