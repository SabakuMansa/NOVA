"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductPhoto from "@/components/exemples/boutique/ProductPhoto";
import QuantitySelector from "@/components/exemples/QuantitySelector";
import DeliveryOption, {
  type ReceptionMode,
} from "@/components/exemples/boutique/DeliveryOption";
import { DELIVERY_STORAGE_KEY } from "@/components/exemples/boutique/DeliveryTracking";
import { useCart } from "@/components/exemples/CartContext";
import { boutiqueDemo } from "@/content/exemples/boutique";
import type { Address, DeliveryQuote } from "@/lib/delivery/types";

// Adresse réelle de la boutique (footer, fiche business) — point de retrait
// pour le devis de livraison.
const PICKUP_ADDRESS: Address = {
  street: "14 rue Nationale",
  postalCode: "92100",
  city: "Boulogne-Billancourt",
};

export default function BoutiquePanierPage() {
  const { panier } = boutiqueDemo;
  const { items, updateQty, removeItem, total, clear } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ReceptionMode>("retrait");
  const [quote, setQuote] = useState<DeliveryQuote | null>(null);
  const [dropoff, setDropoff] = useState<Address | null>(null);

  const lines = items
    .map((it) => ({
      item: it,
      product: boutiqueDemo.products.find((p) => p.slug === it.slug),
    }))
    .filter((l) => l.product);

  const handleQuote = (q: DeliveryQuote | null, d: Address | null) => {
    setQuote(q);
    setDropoff(d);
  };

  const deliveryFee = mode === "livraison" && quote ? quote.feeCents / 100 : 0;
  const grandTotal = total + deliveryFee;
  const checkoutDisabled =
    loading || (mode === "livraison" && (!quote || !dropoff));

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      if (mode === "livraison") {
        if (!quote || !dropoff) {
          setError("Merci d'estimer la livraison avant de continuer.");
          return;
        }
        const createRes = await fetch("/api/delivery/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quoteId: quote.id,
            pickup: PICKUP_ADDRESS,
            dropoff,
            orderReference: `BOUTIQUE-${Date.now()}`,
          }),
        });
        const job = await createRes.json();
        if (!createRes.ok)
          throw new Error(job.error || "Création de la course impossible.");
        sessionStorage.setItem(DELIVERY_STORAGE_KEY, job.id);
      } else {
        sessionStorage.removeItem(DELIVERY_STORAGE_KEY);
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur inconnue.");
        return;
      }
      if (data.url) {
        // Vraie session Stripe Checkout (mode test ou live).
        window.location.href = data.url;
        return;
      }
      // Pas de clé Stripe configurée : mode démo, confirmation simulée.
      clear();
      router.push("/exemples/boutique/confirmation");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Impossible de contacter le serveur de paiement.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-content px-5 py-16 md:px-8 md:py-24">
      <span className="font-nord-sans text-[13px] uppercase tracking-[0.22em] text-nord-camel">
        {panier.eyebrow}
      </span>
      <h1 className="mt-4 font-nord-display text-4xl text-nord-ink sm:text-5xl">
        {panier.title}
      </h1>

      {lines.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 border border-nord-border bg-nord-bg-alt p-10 text-center">
          <p className="font-nord-sans text-lg text-nord-muted">
            {panier.empty}
          </p>
          <Link
            href="/exemples/boutique/catalogue"
            className="inline-flex items-center justify-center gap-2 border border-nord-ink bg-nord-ink px-6 py-3 font-nord-sans text-[13px] font-semibold uppercase tracking-[0.1em] text-nord-bg transition-colors hover:bg-transparent hover:text-nord-ink"
          >
            {panier.emptyCta}
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-4">
            {lines.map(({ item, product }) => (
              <div
                key={item.slug}
                className="flex flex-wrap items-center gap-4 border-b border-nord-border pb-4"
              >
                <ProductPhoto
                  slug={product!.slug}
                  label={product!.name}
                  width={200}
                  className="h-20 w-20 shrink-0"
                />
                <div className="min-w-[10rem] flex-1">
                  <p className="font-nord-display text-base text-nord-ink">
                    {product!.name}
                  </p>
                  <p className="font-nord-sans text-sm text-nord-muted">
                    {product!.price}€ / unité
                  </p>
                </div>
                <div className="flex w-full items-center justify-between gap-4 md:w-auto md:justify-end">
                  <QuantitySelector
                    value={item.qty}
                    onChange={(qty) => updateQty(item.slug, qty)}
                    variant="nord"
                  />
                  <span className="w-16 shrink-0 text-right font-nord-sans text-sm font-semibold text-nord-ink">
                    {(product!.price * item.qty).toFixed(2)}€
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.slug)}
                    className="shrink-0 font-nord-sans text-xs uppercase tracking-wide text-nord-muted underline underline-offset-2 hover:text-nord-ink"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit border border-nord-border bg-nord-bg-alt p-6">
            <DeliveryOption
              pickup={PICKUP_ADDRESS}
              mode={mode}
              onModeChange={setMode}
              quote={quote}
              onQuote={handleQuote}
            />

            <div className="mt-5 space-y-1.5">
              {mode === "livraison" && quote && (
                <>
                  <div className="flex items-center justify-between font-nord-sans text-sm text-nord-muted">
                    <span>Sous-total</span>
                    <span>{total.toFixed(2)}€</span>
                  </div>
                  <div className="flex items-center justify-between font-nord-sans text-sm text-nord-muted">
                    <span>Livraison</span>
                    <span>{deliveryFee.toFixed(2)}€</span>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between font-nord-display text-lg text-nord-ink">
                <span>Total</span>
                <span>{grandTotal.toFixed(2)}€</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkoutDisabled}
              className="mt-6 w-full border border-nord-ink bg-nord-ink px-6 py-3.5 font-nord-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-nord-bg transition-colors hover:bg-transparent hover:text-nord-ink disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-nord-ink disabled:hover:text-nord-bg"
            >
              {loading ? "…" : panier.submit}
            </button>
            {error && (
              <p className="mt-3 font-nord-sans text-sm font-semibold text-red-700">
                {error}
              </p>
            )}
            <p className="mt-4 font-nord-sans text-[0.7rem] uppercase leading-relaxed tracking-wide text-nord-muted-light">
              {panier.testModeNote}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
