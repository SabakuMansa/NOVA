import { NextResponse } from "next/server";
import { getDeliveryProvider } from "@/lib/delivery";
import type { QuoteInput } from "@/lib/delivery";

// Devis de livraison. En mode démo : réponse factice instantanée.
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as QuoteInput;
    if (!body?.pickup || !body?.dropoff) {
      return NextResponse.json(
        { error: "Adresses de retrait et de dépôt requises." },
        { status: 400 }
      );
    }
    const quote = await getDeliveryProvider().getQuote(body);
    return NextResponse.json(quote);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
