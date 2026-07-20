"use client";

import { useState } from "react";
import type { Address, DeliveryQuote } from "@/lib/delivery/types";

export type ReceptionMode = "retrait" | "livraison";

/**
 * Choix retrait / livraison au panier, réutilisant tel quel le module
 * /lib/delivery (mêmes types, même route /api/delivery/quote) — seul
 * l'habillage change pour coller à la DA "nord" de Boutique. Calque de
 * components/delivery/DeliveryOptionSelector.tsx.
 *
 * Aucune mention de la marque technique : "un livreur" / "livraison
 * directe" uniquement, jamais le nom du prestataire.
 */
export default function DeliveryOption({
  pickup,
  mode,
  onModeChange,
  quote,
  onQuote,
}: {
  pickup: Address;
  mode: ReceptionMode;
  onModeChange: (mode: ReceptionMode) => void;
  quote: DeliveryQuote | null;
  onQuote: (quote: DeliveryQuote | null, dropoff: Address | null) => void;
}) {
  const [dropoff, setDropoff] = useState<Address>({
    street: "",
    postalCode: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canQuote =
    dropoff.street.trim() && dropoff.postalCode.trim() && dropoff.city.trim();

  async function fetchQuote() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/delivery/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickup, dropoff }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Estimation indisponible.");
      onQuote(data as DeliveryQuote, dropoff);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Estimation indisponible.");
    } finally {
      setLoading(false);
    }
  }

  function selectMode(next: ReceptionMode) {
    onModeChange(next);
    if (next === "retrait") {
      setError(null);
      onQuote(null, null);
    }
  }

  const field =
    "w-full border border-nord-border bg-white px-3.5 py-2.5 font-nord-sans text-sm text-nord-ink placeholder-nord-muted-light transition-colors focus:border-nord-ink focus:outline-none";

  return (
    <div className="border-t border-nord-border pt-5">
      <span className="block font-nord-sans text-[11px] uppercase tracking-[0.18em] text-nord-muted">
        Mode de réception
      </span>
      <div
        className="mt-3 flex gap-2"
        role="radiogroup"
        aria-label="Mode de réception"
      >
        {(["retrait", "livraison"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === m}
            onClick={() => selectMode(m)}
            className={`flex-1 border px-4 py-2.5 font-nord-sans text-[13px] uppercase tracking-[0.06em] transition-colors ${
              mode === m
                ? "border-nord-ink bg-nord-ink text-nord-bg"
                : "border-nord-border text-nord-muted hover:border-nord-ink hover:text-nord-ink"
            }`}
          >
            {m === "retrait" ? "Retrait en boutique" : "Livraison à domicile"}
          </button>
        ))}
      </div>

      {mode === "retrait" && (
        <p className="mt-3 font-nord-sans text-sm leading-relaxed text-nord-muted">
          Votre commande vous attend en boutique — vous êtes prévenu dès
          qu'elle est prête.
        </p>
      )}

      {mode === "livraison" &&
        (quote ? (
          <div className="mt-4 border border-nord-border bg-white px-4 py-3.5">
            <p className="font-nord-sans text-sm text-nord-ink">
              Livraison estimée :{" "}
              <span className="font-semibold">
                {(quote.feeCents / 100).toFixed(2)}€
              </span>{" "}
              · environ {quote.etaMinutes} min
            </p>
            <p className="mt-1.5 font-nord-sans text-[11px] uppercase tracking-wide text-nord-camel">
              Vous ne payez que le coût de la course — aucune commission
              prélevée sur votre vente
            </p>
            <button
              type="button"
              onClick={() => onQuote(null, null)}
              className="mt-3 font-nord-sans text-xs uppercase tracking-wide text-nord-muted underline underline-offset-2 hover:text-nord-ink"
            >
              Changer d'adresse
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-[1.4fr_0.7fr]">
              <input
                className={field}
                placeholder="Adresse"
                aria-label="Adresse de livraison"
                value={dropoff.street}
                onChange={(e) =>
                  setDropoff({ ...dropoff, street: e.target.value })
                }
              />
              <input
                className={field}
                placeholder="Code postal"
                aria-label="Code postal"
                inputMode="numeric"
                value={dropoff.postalCode}
                onChange={(e) =>
                  setDropoff({ ...dropoff, postalCode: e.target.value })
                }
              />
            </div>
            <input
              className={field}
              placeholder="Ville"
              aria-label="Ville"
              value={dropoff.city}
              onChange={(e) =>
                setDropoff({ ...dropoff, city: e.target.value })
              }
            />
            <button
              type="button"
              onClick={fetchQuote}
              disabled={!canQuote || loading}
              className="w-full border border-nord-ink px-4 py-2.5 font-nord-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-nord-ink transition-colors hover:bg-nord-ink hover:text-nord-bg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-nord-ink"
            >
              {loading ? "Estimation…" : "Estimer la livraison"}
            </button>
            {error && (
              <p className="font-nord-sans text-sm text-red-700">{error}</p>
            )}
          </div>
        ))}
    </div>
  );
}
