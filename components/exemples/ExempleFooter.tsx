/**
 * Pied de page du site fictif. La mention "hébergement inclus" reste une
 * ligne informative en pied de page — jamais une fonctionnalité visible du
 * site lui-même (l'offre "Présence" n'inclut aucun back-office).
 * Restylé le 16/07 en pixel arcade (cohérence DA sitewide).
 */
export default function ExempleFooter({
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
    <footer className="border-t border-arcade-border bg-arcade-bg px-5 py-8 text-center md:px-8">
      <p className="font-pixel text-xs text-arcade-cream">{businessName}</p>
      <p className="mt-2 font-terminal text-base text-arcade-taupe">
        {address} · {hours}
      </p>
      <p className="mt-4 font-mono text-[0.58rem] uppercase tracking-wide text-arcade-muted">
        Site d&apos;exemple réalisé avec le {planLabel} de K1000 Studio ·
        Hébergement inclus
      </p>
    </footer>
  );
}
