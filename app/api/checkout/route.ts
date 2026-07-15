import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { boutiqueDemo } from "@/content/exemples/boutique";

// ————————————————————————————————————————————————————————————
// Paiement Stripe Checkout pour la démo /exemples/boutique — MODE TEST
// par défaut. Même pattern que celui déjà en place sur le projet Oncle
// Wang (app/api/checkout).
//
// Config (.env.local, jamais commité) :
//   PAYMENT_MODE=test | live        (défaut : test)
//   STRIPE_SECRET_KEY=sk_test_…     (clé test) ou sk_live_… (production)
//
// Sans clé configurée, la route répond { demo: true } et le front bascule
// sur la confirmation simulée — la démo reste montrable sans compte
// Stripe. Carte de test : 4242 4242 4242 4242, n'importe quelle date
// future/CVC.
// ————————————————————————————————————————————————————————————

interface CheckoutBody {
  items: { slug: string; qty: number }[];
}

export async function POST(req: NextRequest) {
  const paymentMode = process.env.PAYMENT_MODE === "live" ? "live" : "test";
  const secretKey = process.env.STRIPE_SECRET_KEY;

  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // — Validation + prix recalculés côté serveur (jamais depuis le client) —
  const items = (body.items ?? [])
    .map((it) => ({
      product: boutiqueDemo.products.find((p) => p.slug === it.slug),
      qty: Math.max(1, Math.min(99, Math.floor(it.qty))),
    }))
    .filter((it): it is { product: (typeof boutiqueDemo.products)[number]; qty: number } =>
      Boolean(it.product)
    );

  if (items.length === 0) {
    return NextResponse.json({ error: "Panier vide." }, { status: 400 });
  }

  const total = items.reduce((s, it) => s + it.product.price * it.qty, 0);

  // — Pas de clé Stripe : mode démo assumé —
  if (!secretKey) {
    return NextResponse.json({
      demo: true,
      total: Math.round(total * 100) / 100,
    });
  }
  // Garde-fou : refuse une clé test en mode live et inversement.
  if (paymentMode === "live" && secretKey.startsWith("sk_test_")) {
    return NextResponse.json(
      { error: "PAYMENT_MODE=live avec une clé de test — configuration refusée." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secretKey);
  const origin = req.headers.get("origin") ?? "http://localhost:3002";

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
    (it) => ({
      quantity: it.qty,
      price_data: {
        currency: "eur",
        unit_amount: Math.round(it.product.price * 100),
        product_data: {
          name: it.product.name,
          description: it.product.category,
        },
      },
    })
  );

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}/exemples/boutique/confirmation`,
      cancel_url: `${origin}/exemples/boutique/panier?statut=annule`,
    });
    return NextResponse.json({ url: session.url, paymentMode });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur Stripe inconnue.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
