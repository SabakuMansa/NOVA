import { NextResponse } from "next/server";
import { getDeliveryProvider } from "@/lib/delivery";

// Suivi de statut d'une course. GET /api/delivery/status?id=...
export async function GET(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Paramètre 'id' requis." },
        { status: 400 },
      );
    }
    const status = await getDeliveryProvider().getStatus(id);
    return NextResponse.json(status);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
