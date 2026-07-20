/**
 * Pied de page "Salon Marguerite" — palette/typo propres à cette démo (fond
 * quasi-noir #0D0D12, cf. maquette "02 - Salon de coiffure (Autonome)").
 * Voir ExempleFooter pour la version arcade (homepage) et les autres démos
 * pour leurs propres traitements.
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
    <footer className="metam-scope bg-metam-footer px-5 py-10 text-center md:px-8">
      <p className="font-metam-display text-xl font-bold uppercase tracking-tight text-metam-bg">
        {businessName}
      </p>
      <p className="mt-2 font-metam-sans text-sm text-metam-muted-light">
        {address} · {hours}
      </p>
      <p className="mt-5 font-metam-sans text-xs uppercase tracking-wide text-metam-muted-light/60">
        Site d&apos;exemple réalisé avec le {planLabel} de K1000 Studio ·
        Hébergement inclus
      </p>
    </footer>
  );
}
