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
      <p className="inline-flex items-center gap-2 rounded-full border-2 border-encre bg-white px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-wide text-encre shadow-[2px_2px_0_#211D16]">
        <span className="h-2 w-2 rounded-full bg-jaune" aria-hidden />
        {panier.eyebrow}
      </p>
      <h1 className="mt-6 font-sans text-4xl font-extrabold tracking-tight sm:text-5xl">
        {panier.title}
      </h1>

      {lines.length === 0 ? (
        <div className="v3-card mt-10 flex flex-col items-center gap-4 p-10 text-center">
          <p className="font-sans text-lg text-encre/70">{panier.empty}</p>
          <Link
            href="/exemples/boutique/catalogue"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-encre bg-jaune px-6 py-3 font-sans text-sm font-bold text-encre shadow-[3px_3px_0_#211D16] transition-transform hover:-translate-y-0.5"
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
                className="v3-card flex items-center gap-4 p-4"
              >
                <PlaceholderImage
                  icon={product!.icon}
                  color={product!.color}
                  className="h-20 w-20 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-sm font-bold text-encre">
                    {product!.name}
                  </p>
                  <p className="font-mono text-sm text-encre/60">
                    {product!.price}€ / unité
                  </p>
                </div>
                <div className="flex items-center rounded-xl border-2 border-encre">
                  <button
                    type="button"
                    onClick={() => updateQty(item.slug, item.qty - 1)}
                    className="px-2.5 py-1.5 font-sans text-base font-bold text-encre"
                    aria-label="Diminuer la quantité"
                  >
                    −
                  </button>
                  <span className="min-w-[2ch] text-center font-sans text-sm font-bold text-encre">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQty(item.slug, item.qty + 1)}
                    className="px-2.5 py-1.5 font-sans text-base font-bold text-encre"
                    aria-label="Augmenter la quantité"
                  >
                    +
                  </button>
                </div>
                <span className="w-16 shrink-0 text-right font-mono text-sm font-bold text-encre">
                  {(product!.price * item.qty).toFixed(2)}€
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(item.slug)}
                  className="shrink-0 font-sans text-xs font-bold text-encre/50 underline underline-offset-2 hover:text-encre"
                >
                  Retirer
                </button>
              </div>
            ))}
          </div>

          <div className="v3-window h-fit">
            <div className="v3-window-bar">
              <span
                className="h-3 w-3 rounded-full border-2 border-encre bg-corail"
                aria-hidden
              />
              <span
                className="h-3 w-3 rounded-full border-2 border-encre bg-jaune"
                aria-hidden
              />
              <span
                className="h-3 w-3 rounded-full border-2 border-encre bg-teal"
                aria-hidden
              />
              <span className="ml-2 font-mono text-[0.62rem] text-encre/60">
                paiement.checkout
              </span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between font-sans text-lg font-extrabold text-encre">
                <span>Total</span>
                <span className="font-mono">{total.toFixed(2)}€</span>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading}
                className="mt-6 w-full rounded-xl border-2 border-encre bg-jaune px-6 py-3.5 font-sans text-base font-bold text-encre shadow-[4px_4px_0_#211D16] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {loading ? "…" : panier.submit}
              </button>
              {error && (
                <p className="mt-3 font-sans text-sm font-bold text-corail">
                  {error}
                </p>
              )}
              <p className="mt-4 font-mono text-[0.65rem] uppercase leading-relaxed tracking-wide text-encre/45">
                {panier.testModeNote}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
