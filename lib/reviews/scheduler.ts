/**
 * Planification des relances avis Google.
 *
 * `scheduleReviewRequest` calcule l'heure d'envoi (réservation + délai) et
 * persiste le job. `processDueJobs` — appelée par la route cron
 * (`/api/reviews/run`, déclenchée par Vercel Cron en prod) ET par un petit
 * poller local (dev uniquement, ci-dessous) — envoie tout ce qui est dû.
 *
 * Délai configurable, PAS codé en dur :
 *   1. `business.reviewDelayHours` (propre au commerce — un restaurant et une
 *      boutique n'ont pas le même rythme idéal), sinon
 *   2. `REVIEW_REQUEST_DELAY_HOURS` (variable d'environnement, défaut 3h),
 *      sinon
 *   3. `delayMinutesOverride` explicite (utilisé par la démo pour tester en
 *      quelques minutes plutôt qu'en heures) prime sur les deux ci-dessus
 *      quand fourni.
 */

import { getBusiness } from "./businesses";
import { getEmailProvider } from "./email-provider";
import { getReviewStore } from "./store";
import type { CreateReviewJobInput, ReviewJob } from "./types";

const DEFAULT_DELAY_HOURS = 3;
// Filet local dev uniquement — voir startLocalPoller() plus bas.
const LOCAL_POLL_MS = 15_000;

function getDefaultDelayHours(): number {
  const raw = Number(process.env.REVIEW_REQUEST_DELAY_HOURS);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_DELAY_HOURS;
}

export class UnknownBusinessError extends Error {}

export async function scheduleReviewRequest(
  input: CreateReviewJobInput,
): Promise<ReviewJob> {
  const business = getBusiness(input.businessId);
  if (!business) {
    throw new UnknownBusinessError(`Commerce inconnu : "${input.businessId}".`);
  }

  const reservationAt = new Date(input.reservationAt);
  let sendAt: Date;
  if (input.delayMinutesOverride != null) {
    sendAt = new Date(
      reservationAt.getTime() + input.delayMinutesOverride * 60_000,
    );
  } else {
    const hours = business.reviewDelayHours ?? getDefaultDelayHours();
    sendAt = new Date(reservationAt.getTime() + hours * 60 * 60_000);
  }

  const job: ReviewJob = {
    id: crypto.randomUUID(),
    businessId: business.id,
    customerEmail: input.customerEmail,
    customerName: input.customerName,
    reservationAt: reservationAt.toISOString(),
    sendAt: sendAt.toISOString(),
    status: "scheduled",
    createdAt: new Date().toISOString(),
    mode: getEmailProvider().mode,
  };

  const store = getReviewStore();
  if (await store.isUnsubscribed(business.id, input.customerEmail)) {
    job.status = "canceled";
    job.unsubscribed = true;
  }
  await store.create(job);

  startLocalPoller(); // no-op en production (voir plus bas)
  return job;
}

/** Envoie tout ce qui est dû. Retourne un résumé (utile pour la route cron
 *  et pour le test manuel via curl). */
export async function processDueJobs(): Promise<{
  processed: number;
  sent: number;
  simulated: number;
  errors: number;
}> {
  const store = getReviewStore();
  const due = await store.listDue(new Date());
  let sent = 0;
  let simulated = 0;
  let errors = 0;

  for (const job of due) {
    const business = getBusiness(job.businessId);
    if (!business) {
      await store.markSent(job.id, {
        status: "error",
        error: `Commerce "${job.businessId}" introuvable au moment de l'envoi.`,
      });
      errors++;
      continue;
    }
    try {
      const result = await getEmailProvider().sendReviewRequest(job, business);
      await store.markSent(job.id, result);
      if (result.status === "sent") sent++;
      else if (result.status === "simulated") simulated++;
      else errors++;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue.";
      await store.markSent(job.id, { status: "error", error: message });
      errors++;
    }
  }

  return { processed: due.length, sent, simulated, errors };
}

/**
 * Filet de confort pour le développement local UNIQUEMENT.
 *
 * En production serverless (Vercel), rien ne garantit qu'un process reste
 * vivant entre deux requêtes : c'est le rôle de Vercel Cron (voir
 * vercel.json) d'appeler périodiquement /api/reviews/run. Mais en `next dev`,
 * le process Node est unique et persistant — ce petit intervalle permet de
 * voir un job planifié partir tout seul sans avoir à curl la route cron à la
 * main. Démarré une seule fois (idempotent), jamais en production.
 */
// globalThis, pas un `let` de module : voir le commentaire équivalent dans
// store.ts (chaque route peut bundler sa propre copie du module en dev).
const g = globalThis as unknown as { __reviewsPollerStarted?: boolean };
function startLocalPoller() {
  if (g.__reviewsPollerStarted) return;
  if (process.env.VERCEL || process.env.NODE_ENV === "production") return;
  g.__reviewsPollerStarted = true;
  setInterval(() => {
    processDueJobs().catch((err) => {
      // eslint-disable-next-line no-console
      console.error("[reviews:poller]", err);
    });
  }, LOCAL_POLL_MS);
}
