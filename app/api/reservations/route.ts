import { NextResponse } from "next/server";
import {
  scheduleReviewRequest,
  UnknownBusinessError,
} from "@/lib/reviews/scheduler";
import type { CreateReviewJobInput } from "@/lib/reviews/types";

/**
 * Création d'une réservation (démo). Dans un vrai déploiement, cette route
 * vivrait à côté de la logique de réservation propre au commerçant — ici,
 * elle se limite à ce dont le module "Relance avis" a besoin : email du
 * client + horodatage de la réservation, puis déclenche la planification.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateReviewJobInput;
    if (!body?.businessId || !body?.customerEmail || !body?.reservationAt) {
      return NextResponse.json(
        { error: "businessId, customerEmail et reservationAt sont requis." },
        { status: 400 },
      );
    }
    const job = await scheduleReviewRequest(body);
    return NextResponse.json(job);
  } catch (err) {
    if (err instanceof UnknownBusinessError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    const message = err instanceof Error ? err.message : "Erreur inconnue.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
