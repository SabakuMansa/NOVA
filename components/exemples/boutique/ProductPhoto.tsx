import { productPhotoUrl } from "./productPhotos";

/**
 * Photo produit de la démo /exemples/boutique — remplace PlaceholderImage
 * (icône + dégradé arcade) ici : la maquette "Atelier Nord" mise sur une
 * "mise en scène généreuse des produits", donc de vraies photos plutôt que
 * des placeholders. Voir productPhotos.ts pour la sélection Unsplash.
 */
export default function ProductPhoto({
  slug,
  label,
  width = 700,
  className = "",
}: {
  slug: string;
  label: string;
  width?: number;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden border border-nord-border bg-nord-bg-alt bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url('${productPhotoUrl(slug, width)}')` }}
      role="img"
      aria-label={label}
    />
  );
}
