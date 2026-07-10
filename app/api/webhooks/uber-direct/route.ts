import { NextResponse } from "next/server";
import { isDeliveryLive } from "@/lib/delivery";

/**
 * Endpoint webhook Uber Direct — reçoit les mises à jour de statut des courses.
 *
 * En mode démo : inactif. Le statut évolue tout seul côté mock, aucun webhook
 * n'est attendu ; on répond 200 sans rien traiter.
 *
 * En mode live : c'est ici qu'il faudra vérifier la signature du webhook
 * (en-tête `X-Uber-Signature`, HMAC avec un secret de signature dédié) puis
 * mettre à jour l'état de la commande. Laissé en TODO tant qu'aucun vrai compte
 * n'est branché (voir README-delivery.md).
 */
export async function POST(request: Request) {
  if (!isDeliveryLive()) {
    // Démo : on accuse réception sans traiter.
    return NextResponse.json({ received: true, mode: "demo", processed: false });
  }

  try {
    const payload = await request.json().catch(() => ({}));
    // TODO (live) : vérifier X-Uber-Signature (HMAC) avant de faire confiance
    // au payload, puis router la mise à jour de statut vers la commande.
    void payload;
    return NextResponse.json({ received: true, mode: "live", processed: false });
  } catch {
    return NextResponse.json({ received: false }, { status: 400 });
  }
}
