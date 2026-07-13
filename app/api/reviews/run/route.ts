import { NextResponse } from "next/server";
import { processDueJobs } from "@/lib/reviews/scheduler";

/**
 * Point d'entrée du "cron" de relance avis : envoie tout job dû.
 * - En production : appelée périodiquement par Vercel Cron (voir vercel.json).
 * - En local : peut être appelée à la main (`curl localhost:3000/api/reviews/run`)
 *   pour forcer un passage immédiat sans attendre le poller de dev.
 * Idempotente : rejouer sur les mêmes jobs ne renvoie pas de doublons (un job
 * "sent"/"simulated" sort de listDue()).
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const summary = await processDueJobs();
  return NextResponse.json(summary);
}

export async function POST() {
  const summary = await processDueJobs();
  return NextResponse.json(summary);
}
