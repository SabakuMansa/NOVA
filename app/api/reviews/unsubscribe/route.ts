import { NextResponse } from "next/server";
import { getReviewStore } from "@/lib/reviews/store";

/**
 * Désinscription (conformité RGPD/anti-spam de base) — lien direct depuis
 * l'email, sans confirmation supplémentaire ni compte à créer.
 *
 * ⚠️ Simplification volontaire pour la démo : le token est l'id du job en
 * clair. En production, préférer un token opaque signé (HMAC) pour éviter
 * qu'un id deviné désinscrive le job d'un tiers.
 */
export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Paramètre 'id' manquant." }, { status: 400 });
  }

  const store = getReviewStore();
  const job = await store.get(id);
  if (job) await store.unsubscribe(id);

  const html = `<!doctype html>
<html lang="fr"><body style="font-family:-apple-system,sans-serif;max-width:480px;margin:80px auto;text-align:center;color:#211D16;">
<h1 style="font-size:22px;">C'est fait.</h1>
<p>Vous ne recevrez plus ce type d'email pour cette réservation.</p>
</body></html>`;

  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
