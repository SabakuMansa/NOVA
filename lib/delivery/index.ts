/**
 * Point d'entrée du module de livraison.
 *
 * Le reste du projet ne dépend QUE de ce fichier (jamais des implémentations).
 * Le mode est piloté par la variable d'environnement `DELIVERY_MODE` :
 *   - "demo" (défaut, y compris si la variable est absente) → données factices.
 *   - "live" → vrai client Uber Direct (nécessite des credentials).
 *
 * Le site fonctionne normalement même si `DELIVERY_MODE` n'est pas configuré.
 */

import { mockProvider } from "./mock-provider";
import { createUberDirectClient } from "./uber-direct-client";
import type { DeliveryMode, DeliveryProvider } from "./types";

export function getDeliveryMode(): DeliveryMode {
  return process.env.DELIVERY_MODE === "live" ? "live" : "demo";
}

/** true seulement quand un vrai fournisseur est branché et activé. */
export function isDeliveryLive(): boolean {
  return getDeliveryMode() === "live";
}

let liveClient: DeliveryProvider | null = null;

export function getDeliveryProvider(): DeliveryProvider {
  if (getDeliveryMode() === "live") {
    // Instanciation paresseuse : aucune credential lue tant qu'on n'appelle pas
    // une méthode → l'import du module ne peut jamais casser le build.
    liveClient ??= createUberDirectClient();
    return liveClient;
  }
  return mockProvider;
}

export * from "./types";
