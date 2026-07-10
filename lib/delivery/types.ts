/**
 * Types du module de livraison (marque blanche).
 * Volontairement agnostiques du fournisseur : le mode "demo" (mock) et le mode
 * "live" (Uber Direct) implémentent tous deux l'interface `DeliveryProvider`.
 */

export type DeliveryMode = "demo" | "live";

export interface Address {
  /** Rue et numéro. */
  street: string;
  postalCode: string;
  city: string;
  /** Optionnel : adresse brute si non décomposée. */
  raw?: string;
}

export interface QuoteInput {
  /** Adresse du commerce (point de retrait). */
  pickup: Address;
  /** Adresse du client (point de dépôt). */
  dropoff: Address;
}

export interface DeliveryQuote {
  id: string;
  /** Coût de la course, en centimes (pas de flottant). */
  feeCents: number;
  currency: string;
  /** Délai estimé, en minutes. */
  etaMinutes: number;
  /** Expiration du devis (ISO 8601). */
  expiresAt: string;
  mode: DeliveryMode;
}

export type DeliveryStatusValue =
  | "pending"
  | "preparing"
  | "courier_en_route"
  | "delivered"
  | "canceled";

/** Étapes affichées dans la timeline (ordre logique). */
export const DELIVERY_TIMELINE: DeliveryStatusValue[] = [
  "preparing",
  "courier_en_route",
  "delivered",
];

/** Libellés FR pour l'UI. */
export const STATUS_LABELS: Record<DeliveryStatusValue, string> = {
  pending: "En attente",
  preparing: "En préparation",
  courier_en_route: "Coursier en route",
  delivered: "Livré",
  canceled: "Annulée",
};

export interface CreateDeliveryInput {
  quoteId: string;
  pickup: Address;
  dropoff: Address;
  /** Référence de commande côté commerçant (optionnelle). */
  orderReference?: string;
}

export interface DeliveryJob {
  id: string;
  status: DeliveryStatusValue;
  /** URL de suivi fournie par le transporteur (le cas échéant). */
  trackingUrl?: string;
  etaMinutes: number | null;
  createdAt: string;
  mode: DeliveryMode;
}

export interface DeliveryStatus {
  id: string;
  status: DeliveryStatusValue;
  etaMinutes: number | null;
  updatedAt: string;
  mode: DeliveryMode;
}

/**
 * Contrat commun aux deux fournisseurs (mock et réel).
 * Tout le reste du code ne dépend que de cette interface.
 */
export interface DeliveryProvider {
  readonly mode: DeliveryMode;
  getQuote(input: QuoteInput): Promise<DeliveryQuote>;
  createDelivery(input: CreateDeliveryInput): Promise<DeliveryJob>;
  getStatus(deliveryId: string): Promise<DeliveryStatus>;
}
