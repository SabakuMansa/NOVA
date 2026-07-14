/**
 * Registre des commerces branchés sur le module "Relance avis Google".
 *
 * En production réelle, chaque site commerçant NOVA Studio fournirait ses
 * propres jetons de marque (couleurs/police) et son propre lien d'avis
 * Google — ce fichier serait alors alimenté par la config de CE commerce
 * précis, pas une liste en dur. Pour la démo, un seul commerce fictif
 * suffit à illustrer le mécanisme de bout en bout.
 *
 * ⚠️ Le lien Google doit toujours pointer vers la fenêtre de notation
 * DIRECTE du commerce (via la Place ID), jamais une fiche générique.
 */

import type { BusinessProfile } from "./types";

const BUSINESSES: Record<string, BusinessProfile> = {
  "la-table-du-marche": {
    id: "la-table-du-marche",
    name: "La Table du Marché",
    // Exemple représentatif — format réel : https://search.google.com/local/writereview?placeid=<PLACE_ID>
    googleReviewUrl:
      "https://search.google.com/local/writereview?placeid=EXEMPLE_PLACE_ID_A_REMPLACER",
    brand: {
      primary: "#FF6B4A", // corail
      ink: "#211D16", // encre
      background: "#FBF7EF", // lait
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    },
    // Un restaurant : quelques heures après le repas, pendant que c'est frais.
    reviewDelayHours: 3,
  },
};

export function getBusiness(businessId: string): BusinessProfile | null {
  return BUSINESSES[businessId] ?? null;
}

export function listBusinesses(): BusinessProfile[] {
  return Object.values(BUSINESSES);
}
