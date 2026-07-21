/**
 * Pied de page "Le Petit Atelier" — palette/typo propres à cette démo.
 * Recoloré le 21/07 sur l'univers "Unit—9" (quasi-noir + vert acide, en
 * valeurs Tailwind arbitraires) — partagé par toutes les sous-pages de la
 * démo, cf. Nav.tsx pour le détail du principe (chrome sombre, contenu des
 * sous-pages inchangé sur la palette claire "nord-*").
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
    <footer className="bg-[#101012] px-5 py-12 text-center md:px-8">
      <p className="font-nord-display text-xl uppercase tracking-[0.14em] text-[#f2f2f0] sm:text-2xl">
        {businessName}
      </p>
      <p className="mt-3 font-nord-sans text-sm text-[#a9a9ad]">
        {address} · {hours}
      </p>
      <p className="mt-6 font-nord-sans text-[0.65rem] uppercase tracking-wide text-[#8a8a90]">
        Site d&apos;exemple réalisé avec le {planLabel} de K1000 Studio ·
        Hébergement inclus
      </p>
    </footer>
  );
}
