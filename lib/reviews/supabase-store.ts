/**
 * Store Supabase (mode "live" de persistance uniquement — REVIEWS_STORE_MODE=supabase).
 *
 * ⚠️ NE JAMAIS coder de credentials en dur ici. Lues depuis l'environnement :
 *   - SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY  (clé serveur, jamais exposée au client)
 *
 * Nécessaire dès qu'on quitte le poste de développement : contrairement au
 * MemoryReviewStore, cette implémentation survit aux invocations serverless
 * séparées (création de la réservation et cron de vérification peuvent
 * atterrir sur des instances différentes). Voir README-reviews.md pour le
 * schéma SQL de la table `review_jobs` à créer avant activation.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ReviewJob, ReviewJobStore, SendResult } from "./types";

const TABLE = "review_jobs";

function readClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "REVIEWS_STORE_MODE=supabase demandé mais SUPABASE_URL / " +
        "SUPABASE_SERVICE_ROLE_KEY sont absentes. Renseignez-les dans " +
        ".env.local — voir README-reviews.md.",
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

// Mappe les noms de colonnes snake_case (convention SQL) ↔ ReviewJob camelCase.
function toRow(job: ReviewJob) {
  return {
    id: job.id,
    business_id: job.businessId,
    customer_email: job.customerEmail,
    customer_name: job.customerName ?? null,
    reservation_at: job.reservationAt,
    send_at: job.sendAt,
    status: job.status,
    created_at: job.createdAt,
    sent_at: job.sentAt ?? null,
    error: job.error ?? null,
    mode: job.mode,
    unsubscribed: job.unsubscribed ?? false,
  };
}

function fromRow(row: Record<string, unknown>): ReviewJob {
  return {
    id: row.id as string,
    businessId: row.business_id as string,
    customerEmail: row.customer_email as string,
    customerName: (row.customer_name as string | null) ?? undefined,
    reservationAt: row.reservation_at as string,
    sendAt: row.send_at as string,
    status: row.status as ReviewJob["status"],
    createdAt: row.created_at as string,
    sentAt: (row.sent_at as string | null) ?? undefined,
    error: (row.error as string | null) ?? undefined,
    mode: row.mode as ReviewJob["mode"],
    unsubscribed: Boolean(row.unsubscribed),
  };
}

export function createSupabaseReviewStore(): ReviewJobStore {
  return {
    async create(job: ReviewJob): Promise<void> {
      const { error } = await readClient().from(TABLE).insert(toRow(job));
      if (error) throw new Error(`Supabase (create): ${error.message}`);
    },

    async get(id: string): Promise<ReviewJob | null> {
      const { data, error } = await readClient()
        .from(TABLE)
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw new Error(`Supabase (get): ${error.message}`);
      return data ? fromRow(data) : null;
    },

    async listAll(): Promise<ReviewJob[]> {
      const { data, error } = await readClient()
        .from(TABLE)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(`Supabase (listAll): ${error.message}`);
      return (data ?? []).map(fromRow);
    },

    async listDue(now: Date): Promise<ReviewJob[]> {
      const { data, error } = await readClient()
        .from(TABLE)
        .select("*")
        .eq("status", "scheduled")
        .lte("send_at", now.toISOString());
      if (error) throw new Error(`Supabase (listDue): ${error.message}`);
      return (data ?? []).map(fromRow);
    },

    async markSent(id: string, result: SendResult): Promise<void> {
      const patch: Record<string, unknown> = { status: result.status };
      if (result.status === "sent" || result.status === "simulated") {
        patch.sent_at = new Date().toISOString();
      }
      if (result.error) patch.error = result.error;
      const { error } = await readClient()
        .from(TABLE)
        .update(patch)
        .eq("id", id);
      if (error) throw new Error(`Supabase (markSent): ${error.message}`);
    },

    async unsubscribe(id: string): Promise<void> {
      const { error } = await readClient()
        .from(TABLE)
        .update({ unsubscribed: true, status: "canceled" })
        .eq("id", id);
      if (error) throw new Error(`Supabase (unsubscribe): ${error.message}`);
    },

    async isUnsubscribed(businessId: string, email: string): Promise<boolean> {
      const { data, error } = await readClient()
        .from(TABLE)
        .select("id")
        .eq("business_id", businessId)
        .eq("customer_email", email.toLowerCase())
        .eq("unsubscribed", true)
        .limit(1);
      if (error) throw new Error(`Supabase (isUnsubscribed): ${error.message}`);
      return (data?.length ?? 0) > 0;
    },
  };
}
