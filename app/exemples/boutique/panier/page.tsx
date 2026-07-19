"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductPhoto from "@/components/exemples/boutique/ProductPhoto";
import QuantitySelector from "@/components/exemples/QuantitySelector";
import { useCart } from "@/components/exemples/CartContext";
import { boutiqueDemo } from "@/content/exemples/boutique";

export default function BoutiquePanierPage() {
  const { panier } = boutiqueDemo;
  const { items, updateQty, removeItem, total, clear } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lines = items
    .map((it) => ({
      item: it,
      product: boutiqueDemo.products.find((p) => p.slug === it.slug),
    }))
    .filter((l) => l.product);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
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
    } catch {
      setError("Impossible de contacter le serveur de paiement.");
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
            <div className="flex items-center justify-between font-nord-display text-lg text-nord-ink">
              <span>Total</span>
              <span>{total.toFixed(2)}€</span>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className="mt-6 w-full border border-nord-ink bg-nord-ink px-6 py-3.5 font-nord-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-nord-bg transition-colors hover:bg-transparent hover:text-nord-ink disabled:opacity-60"
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
