"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PlaceholderImage from "@/components/exemples/PlaceholderImage";
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
      <p className="inline-flex items-center gap-2 rounded-full border-2 border-arcade-border-thick bg-arcade-card px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-arcade-taupe shadow-[2px_2px_0_#000000]">
        <span className="h-2 w-2 rounded-full bg-jaune" aria-hidden />
        {panier.eyebrow}
      </p>
      <h1 className="mt-6 font-pixel text-2xl tracking-tight text-arcade-cream sm:text-3xl">
        {panier.title}
      </h1>

      {lines.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-xl border border-arcade-border bg-arcade-card p-10 text-center">
          <p className="font-terminal text-xl text-arcade-tan">{panier.empty}</p>
          <Link
            href="/exemples/boutique/catalogue"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-arcade-border-thick bg-jaune px-6 py-3 font-pixel text-[0.6rem] leading-relaxed text-arcade-bg shadow-[3px_3px_0_#FFD23F] transition-transform hover:-translate-y-0.5"
          >
            {panier.emptyCta} →
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-4">
            {lines.map(({ item, product }) => (
              <div
                key={item.slug}
                className="flex items-center gap-4 rounded-xl border border-arcade-border bg-arcade-card p-4"
              >
                <PlaceholderImage
                  icon={product!.icon}
                  color={product!.color}
                  className="h-20 w-20 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-terminal text-base font-bold text-arcade-cream">
                    {product!.name}
                  </p>
                  <p className="font-mono text-sm text-arcade-taupe">
                    {product!.price}€ / unité
                  </p>
                </div>
                <div className="flex items-center rounded-xl border-2 border-arcade-border-thick">
                  <button
                    type="button"
                    onClick={() => updateQty(item.slug, item.qty - 1)}
                    className="px-2.5 py-1.5 font-mono text-base font-bold text-arcade-cream hover:text-arcade-gold"
                    aria-label="Diminuer la quantité"
                  >
                    −
                  </button>
                  <span className="min-w-[2ch] text-center font-mono text-sm font-bold text-arcade-cream">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQty(item.slug, item.qty + 1)}
                    className="px-2.5 py-1.5 font-mono text-base font-bold text-arcade-cream hover:text-arcade-gold"
                    aria-label="Augmenter la quantité"
                  >
                    +
                  </button>
                </div>
                <span className="w-16 shrink-0 text-right font-mono text-sm font-bold text-arcade-gold">
                  {(product!.price * item.qty).toFixed(2)}€
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(item.slug)}
                  className="shrink-0 font-mono text-xs font-bold text-arcade-taupe underline underline-offset-2 hover:text-arcade-cream"
                >
                  Retirer
                </button>
              </div>
            ))}
          </div>

          <div className="h-fit overflow-hidden rounded-2xl border-2 border-arcade-border-thick bg-arcade-card">
            <div className="flex items-center gap-2 border-b-2 border-arcade-border-thick bg-arcade-bg px-3.5 py-2.5">
              <span
                className="h-3 w-3 rounded-full border-2 border-arcade-border-thick bg-arcade-orange"
                aria-hidden
              />
              <span
                className="h-3 w-3 rounded-full border-2 border-arcade-border-thick bg-arcade-gold"
                aria-hidden
              />
              <span
                className="h-3 w-3 rounded-full border-2 border-arcade-border-thick bg-arcade-tan"
                aria-hidden
              />
              <span className="ml-2 font-mono text-[0.62rem] text-arcade-taupe">
                paiement.checkout
              </span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between font-pixel text-base text-arcade-cream">
                <span>Total</span>
                <span className="font-mono text-arcade-gold">{total.toFixed(2)}€</span>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading}
                className="mt-6 w-full rounded-xl border-2 border-arcade-border-thick bg-jaune px-6 py-3.5 font-pixel text-[0.65rem] leading-relaxed text-arcade-bg shadow-[4px_4px_0_#FFD23F] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {loading ? "…" : panier.submit}
              </button>
              {error && (
                <p className="mt-3 font-terminal text-base font-bold text-corail">
                  {error}
                </p>
              )}
              <p className="mt-4 font-mono text-[0.65rem] uppercase leading-relaxed tracking-wide text-arcade-muted">
                {panier.testModeNote}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
