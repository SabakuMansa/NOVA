import { NextResponse } from "next/server";
import { getDeliveryProvider } from "@/lib/delivery";
import type { CreateDeliveryInput } from "@/lib/delivery";

// Création de la course (après validation/paiement de la commande).
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateDeliveryInput;
    if (!body?.quoteId || !body?.pickup || !body?.dropoff) {
      return NextResponse.json(
        { error: "quoteId, pickup et dropoff sont requis." },
        { status: 400 }
      );
    }
    const job = await getDeliveryProvider().createDelivery(body);
    return NextResponse.json(job);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
