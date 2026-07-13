import { NextResponse } from "next/server";
import { getReviewStore } from "@/lib/reviews/store";

/**
 * Vue de suivi pour le commerçant : volume et statut des relances avis
 * (planifiée / envoyée / simulée / erreur / désinscrite). Version minimale —
 * un vrai tableau de bord filtrerait par commerce/période, mais la structure
 * (un statut par job, horodaté) est déjà prête pour ça.
 *
 * `force-dynamic` : cette route ne lit ni cookies ni searchParams, Next.js la
 * pré-rendait donc en statique au build (réponse figée pour toujours en
 * prod) — jamais ce qu'on veut pour un état qui change à chaque envoi.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const jobs = await getReviewStore().listAll();
  return NextResponse.json({ count: jobs.length, jobs });
}
