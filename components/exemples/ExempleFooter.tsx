/**
 * Pied de page du site fictif. La mention "hébergement inclus" reste une
 * ligne informative en pied de page — jamais une fonctionnalité visible du
 * site lui-même (l'offre "Présence" n'inclut aucun back-office).
 */
export default function ExempleFooter({
  businessName,
  address,
  hours,
}: {
  businessName: string;
  address: string;
  hours: string;
}) {
  return (
    <footer className="border-t-2 border-encre bg-white px-5 py-8 text-center md:px-8">
      <p className="font-sans text-sm font-bold text-encre">{businessName}</p>
      <p className="mt-1 font-sans text-xs text-encre/60">
        {address} · {hours}
      </p>
      <p className="mt-4 font-mono text-[0.58rem] uppercase tracking-wide text-encre/35">
        Site d&apos;exemple réalisé avec le plan Présence de NOVA Studio · Hébergement
        inclus
      </p>
    </footer>
  );
}
