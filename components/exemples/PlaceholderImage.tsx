/**
 * Bloc placeholder stylé remplaçant une vraie photo dans les pages
 * `/exemples/*` — objectif : montrer la STRUCTURE d'un site livrable, pas
 * produire de vraies images. Dégradé + icône, cohérent avec la palette v3
 * (mêmes couleurs que les blobs du Hero / les bento cards).
 */

const GRADIENTS: Record<string, string> = {
  violet:
    "bg-[radial-gradient(circle_at_30%_20%,rgba(108,92,231,0.35),transparent_70%)]",
  corail:
    "bg-[radial-gradient(circle_at_30%_20%,rgba(255,107,74,0.35),transparent_70%)]",
  teal: "bg-[radial-gradient(circle_at_30%_20%,rgba(14,168,139,0.35),transparent_70%)]",
  jaune:
    "bg-[radial-gradient(circle_at_30%_20%,rgba(255,197,61,0.4),transparent_70%)]",
};

export default function PlaceholderImage({
  icon,
  label,
  color = "violet",
  className = "",
}: {
  icon: string;
  label?: string;
  color?: "violet" | "corail" | "teal" | "jaune";
  className?: string;
}) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-encre bg-lait shadow-[3px_3px_0_#211D16] ${GRADIENTS[color]} ${className}`}
    >
      <span className="text-5xl" aria-hidden>
        {icon}
      </span>
      {label && (
        <span className="font-mono text-[0.6rem] font-bold uppercase tracking-wide text-encre/40">
          {label}
        </span>
      )}
    </div>
  );
}
