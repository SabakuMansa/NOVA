/**
 * Photos produit de la démo /exemples/boutique — Unsplash, libres de droit,
 * chacune vérifiée (chargement + sujet) avant intégration. Sélection
 * strictement thématique savon/bougie/soin artisanal : aucune photo de
 * vêtement ni de marque visible, à l'inverse de la maquette Claude Design
 * "04 - Boutique mode" (mode/vêtements) qui a servi de donneuse de style
 * (palette, typo, mise en page) mais jamais de donneuse de contenu visuel.
 */
export const PRODUCT_PHOTOS: Record<string, string> = {
  "savon-lavande-provence":
    "https://images.unsplash.com/photo-1546552768-9e3a94b38a59",
  "savon-argile-menthe":
    "https://images.unsplash.com/photo-1474625121024-7595bfbc57ac",
  "coffret-decouverte":
    "https://images.unsplash.com/photo-1454873019514-eae2f086587a",
  "bougie-bois-de-santal":
    "https://images.unsplash.com/photo-1757688525739-8d1e13daf44f",
  "bougie-figuier":
    "https://images.unsplash.com/photo-1602523961358-f9f03dd557db",
  "baume-miel-karite":
    "https://images.unsplash.com/photo-1617897903246-719242758050",
};

export const HERO_PHOTO = PRODUCT_PHOTOS["savon-lavande-provence"];

export function productPhotoUrl(slug: string, width = 700) {
  const base = PRODUCT_PHOTOS[slug] ?? HERO_PHOTO;
  return `${base}?w=${width}&q=80&auto=format&fit=crop`;
}
