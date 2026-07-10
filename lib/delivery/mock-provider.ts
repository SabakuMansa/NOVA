/**
 * Fournisseur de démonstration (mode "demo", actif par défaut).
 * 100 % local et instantané : AUCUN appel réseau vers un service externe.
 *
 * Le statut évolue automatiquement dans le temps (Préparation → Coursier en
 * route → Livré) avec des délais courts pour la démo. Astuce : l'horodatage de
 * création est encodé dans l'identifiant de la course, ce qui permet de calculer
 * le statut sans stockage serveur (compatible environnement serverless).
 */

import type {
  CreateDeliveryInput,
  DeliveryJob,
  DeliveryProvider,
  DeliveryQuote,
  DeliveryStatus,
  DeliveryStatusValue,
  QuoteInput,
} from "./types";

// Durées de la démo (secondes). Volontairement courtes pour une démo fluide.
const PREPARING_UNTIL = 6;
const EN_ROUTE_UNTIL = 16;

function stableHash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function statusFromElapsed(elapsedSec: number): {
  status: DeliveryStatusValue;
  etaMinutes: number | null;
} {
  if (elapsedSec < PREPARING_UNTIL) return { status: "preparing", etaMinutes: 20 };
  if (elapsedSec < EN_ROUTE_UNTIL) {
    const remaining = Math.max(1, Math.round((EN_ROUTE_UNTIL - elapsedSec) / 2));
    return { status: "courier_en_route", etaMinutes: remaining };
  }
  return { status: "delivered", etaMinutes: 0 };
}

// id de la forme "demo-<createdAtMs>-<rand>" → createdAt décodable.
function makeId(createdAt: number): string {
  return `demo-${createdAt}-${Math.random().toString(36).slice(2, 8)}`;
}
function createdAtFromId(id: string): number | null {
  const m = /^demo-(\d+)-/.exec(id);
  return m ? Number(m[1]) : null;
}

export const mockProvider: DeliveryProvider = {
  mode: "demo",

  async getQuote({ dropoff }: QuoteInput): Promise<DeliveryQuote> {
    // Coût plausible et déterministe (~4,50 à 7,90 €) selon l'adresse de dépôt.
    const seed = stableHash(`${dropoff.postalCode}${dropoff.street}`);
    const feeCents = 450 + (seed % 340);
    const etaMinutes = 20 + (seed % 16);
    return {
      id: `quote-${makeId(Date.now())}`,
      feeCents,
      currency: "EUR",
      etaMinutes,
      expiresAt: new Date(Date.now() + 5 * 60_000).toISOString(),
      mode: "demo",
    };
  },

  async createDelivery(_input: CreateDeliveryInput): Promise<DeliveryJob> {
    const createdAt = Date.now();
    const id = makeId(createdAt);
    return {
      id,
      status: "preparing",
      etaMinutes: 20,
      trackingUrl: undefined,
      createdAt: new Date(createdAt).toISOString(),
      mode: "demo",
    };
  },

  async getStatus(deliveryId: string): Promise<DeliveryStatus> {
    const createdAt = createdAtFromId(deliveryId) ?? Date.now();
    const elapsedSec = (Date.now() - createdAt) / 1000;
    const { status, etaMinutes } = statusFromElapsed(elapsedSec);
    return {
      id: deliveryId,
      status,
      etaMinutes,
      updatedAt: new Date().toISOString(),
      mode: "demo",
    };
  },
};
