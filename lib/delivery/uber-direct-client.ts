/**
 * Client réel Uber Direct (mode "live" uniquement).
 *
 * ⚠️ NE JAMAIS coder de credentials en dur ici. Elles sont lues depuis
 * l'environnement (`.env.local`, jamais commité) :
 *   - UBER_DIRECT_CUSTOMER_ID
 *   - UBER_DIRECT_CLIENT_ID
 *   - UBER_DIRECT_CLIENT_SECRET
 *
 * Ce client n'est instancié qu'en mode "live". Voir README-delivery.md : le
 * passage en "live" suppose que le commerçant a validé son onboarding Uber
 * Direct — K1000 Studio ne peut pas l'activer unilatéralement.
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

const OAUTH_URL = "https://login.uber.com/oauth/v2/token";
const API_BASE = "https://api.uber.com/v1/customers";

interface UberCredentials {
  customerId: string;
  clientId: string;
  clientSecret: string;
}

function readCredentials(): UberCredentials {
  const customerId = process.env.UBER_DIRECT_CUSTOMER_ID;
  const clientId = process.env.UBER_DIRECT_CLIENT_ID;
  const clientSecret = process.env.UBER_DIRECT_CLIENT_SECRET;

  if (!customerId || !clientId || !clientSecret) {
    throw new Error(
      "Mode livraison 'live' demandé mais les credentials Uber Direct sont " +
        "absentes (UBER_DIRECT_CUSTOMER_ID / _CLIENT_ID / _CLIENT_SECRET). " +
        "Renseignez-les dans .env.local — voir README-delivery.md.",
    );
  }
  return { customerId, clientId, clientSecret };
}

function mapStatus(uberStatus: string): DeliveryStatusValue {
  switch (uberStatus) {
    case "pending":
      return "pending";
    case "pickup":
    case "pickup_complete":
      return "preparing";
    case "dropoff":
      return "courier_en_route";
    case "delivered":
      return "delivered";
    case "canceled":
    case "returned":
      return "canceled";
    default:
      return "pending";
  }
}

function toUberAddress(a: QuoteInput["pickup"]): string {
  // Uber Direct attend une adresse structurée sérialisée en JSON string.
  return JSON.stringify({
    street_address: [a.street],
    city: a.city,
    zip_code: a.postalCode,
    country: "FR",
  });
}

export function createUberDirectClient(): DeliveryProvider {
  let cachedToken: { value: string; expiresAt: number } | null = null;

  async function getToken(creds: UberCredentials): Promise<string> {
    if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
      return cachedToken.value;
    }
    const body = new URLSearchParams({
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
      grant_type: "client_credentials",
      scope: "eats.deliveries",
    });
    const res = await fetch(OAUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) {
      throw new Error(`Uber Direct: échec d'authentification (${res.status}).`);
    }
    const json = (await res.json()) as {
      access_token: string;
      expires_in: number;
    };
    cachedToken = {
      value: json.access_token,
      expiresAt: Date.now() + json.expires_in * 1000,
    };
    return cachedToken.value;
  }

  async function authedFetch(path: string, init: RequestInit) {
    const creds = readCredentials();
    const token = await getToken(creds);
    const res = await fetch(`${API_BASE}/${creds.customerId}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(
        `Uber Direct: ${res.status} sur ${path}. ${detail.slice(0, 200)}`,
      );
    }
    return res.json();
  }

  return {
    mode: "live",

    async getQuote({ pickup, dropoff }: QuoteInput): Promise<DeliveryQuote> {
      const data = (await authedFetch("/delivery_quotes", {
        method: "POST",
        body: JSON.stringify({
          pickup_address: toUberAddress(pickup),
          dropoff_address: toUberAddress(dropoff),
        }),
      })) as {
        id: string;
        fee: number;
        currency: string;
        dropoff_eta?: number;
        duration?: number;
      };

      return {
        id: data.id,
        feeCents: data.fee,
        currency: (data.currency || "EUR").toUpperCase(),
        etaMinutes: data.dropoff_eta ?? data.duration ?? 0,
        expiresAt: new Date(Date.now() + 5 * 60_000).toISOString(),
        mode: "live",
      };
    },

    async createDelivery(input: CreateDeliveryInput): Promise<DeliveryJob> {
      const data = (await authedFetch("/deliveries", {
        method: "POST",
        body: JSON.stringify({
          quote_id: input.quoteId,
          pickup_address: toUberAddress(input.pickup),
          dropoff_address: toUberAddress(input.dropoff),
          manifest_reference: input.orderReference,
        }),
      })) as {
        id: string;
        status: string;
        tracking_url?: string;
        dropoff_eta?: number;
      };

      return {
        id: data.id,
        status: mapStatus(data.status),
        trackingUrl: data.tracking_url,
        etaMinutes: data.dropoff_eta ?? null,
        createdAt: new Date().toISOString(),
        mode: "live",
      };
    },

    async getStatus(deliveryId: string): Promise<DeliveryStatus> {
      const data = (await authedFetch(`/deliveries/${deliveryId}`, {
        method: "GET",
      })) as { id: string; status: string; dropoff_eta?: number };

      return {
        id: data.id,
        status: mapStatus(data.status),
        etaMinutes: data.dropoff_eta ?? null,
        updatedAt: new Date().toISOString(),
        mode: "live",
      };
    },
  };
}
